const http = require('http');

function fetchModule(path) {
  return new Promise((resolve, reject) => {
    http.get('http://localhost:5173' + path, (res) => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => {
        if (res.statusCode !== 200) return reject(path + ' STATUS:' + res.statusCode);
        if (d.includes('<html') && d.includes('Error') && d.length < 1000) return reject(path + ' ERROR_PAGE');
        const imports = [];
        const re = /import\s+.*?from\s+['"]([^'"]+)['"]/g;
        let m;
        while ((m = re.exec(d)) !== null) {
          if (m[1].startsWith('./') || m[1].startsWith('../')) imports.push(m[1]);
        }
        resolve({ path, imports, len: d.length });
      });
    }).on('error', e => reject(path + ' NET:' + e.message));
  });
}

async function checkDeps(startPath) {
  const seen = new Set();
  const queue = [startPath];
  const errors = [];
  while (queue.length > 0) {
    const path = queue.shift();
    if (seen.has(path)) continue;
    seen.add(path);
    try {
      const info = await fetchModule(path);
      for (const imp of info.imports) {
        const dir = path.substring(0, path.lastIndexOf('/'));
        let resolved = imp;
        if (resolved.startsWith('./')) resolved = dir + '/' + resolved.substring(2);
        else if (resolved.startsWith('../')) {
          const parts = dir.split('/');
          let up = resolved;
          while (up.startsWith('../')) {
            parts.pop();
            up = up.substring(3);
          }
          resolved = parts.join('/') + '/' + up;
        }
        if (!seen.has(resolved)) queue.push(resolved);
      }
    } catch(e) {
      errors.push(e.toString());
      if (errors.length > 20) break;
    }
  }
  console.log('Checked:', seen.size, 'modules');
  if (errors.length > 0) {
    console.log('Errors:', errors.length);
    errors.forEach(e => console.log('  ERR:', e));
  } else {
    console.log('All modules load OK!');
  }
}

checkDeps('/src/main.tsx').catch(e => console.log('FATAL:', e));
