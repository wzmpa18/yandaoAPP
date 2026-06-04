var fs = require('fs');
var path = require('path');

function checkFile(filePath) {
  var content = fs.readFileSync(filePath, 'utf-8');
  var lines = content.split('\n').map(function(l) { return l.trim(); });
  
  // Remove comments and empty lines
  var codeLines = [];
  var inBlockComment = false;
  for (var i = 0; i < lines.length; i++) {
    var line = lines[i];
    if (inBlockComment) {
      if (line.includes('*/')) { inBlockComment = false; }
      continue;
    }
    if (line.startsWith('//')) continue;
    if (line.startsWith('/*')) { inBlockComment = true; continue; }
    if (line.length === 0) continue;
    codeLines.push(line);
  }
  
  var fullCode = codeLines.join('\n');
  
  // Check for export statements
  var exports = fullCode.match(/export\s+(const|let|var|function|class|default|async|enum)/g);
  var typeExports = fullCode.match(/export\s+(interface|type)/g);
  var hasValueExport = exports && exports.length > 0;
  var hasOnlyTypeExports = !hasValueExport && typeExports && typeExports.length > 0;
  
  if (hasOnlyTypeExports) {
    console.log('PURE_TYPE:', filePath);
    return 'PURE_TYPE';
  }
  
  // Check if file has any non-import/non-type content
  var nonImportLines = codeLines.filter(function(l) {
    return !l.startsWith('import ') && !l.startsWith('export interface') && !l.startsWith('export type');
  }).join('\n');
  
  if (nonImportLines.trim().length === 0 && typeExports && typeExports.length > 0) {
    console.log('PURE_TYPE_ONLY:', filePath);
    return 'PURE_TYPE';
  }
  
  return 'OK';
}

function walkDir(dir) {
  var results = [];
  var list = fs.readdirSync(dir);
  for (var i = 0; i < list.length; i++) {
    var fullPath = path.join(dir, list[i]);
    var stat = fs.statSync(fullPath);
    if (stat.isDirectory() && list[i] !== 'node_modules' && list[i] !== 'dist') {
      results = results.concat(walkDir(fullPath));
    } else if (list[i].endsWith('.ts') && !list[i].endsWith('.d.ts')) {
      results.push(fullPath);
    }
  }
  return results;
}

var srcDir = path.join(__dirname, 'src');
var files = walkDir(srcDir);
console.log('Total .ts files:', files.length);

var problemFiles = [];
for (var i = 0; i < files.length; i++) {
  var result = checkFile(files[i]);
  if (result === 'PURE_TYPE') {
    problemFiles.push(files[i]);
  }
}

console.log('\nProblematic pure-type files:', problemFiles.length);
problemFiles.forEach(function(f) { console.log('  ', f); });
