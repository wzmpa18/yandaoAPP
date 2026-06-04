var http = require('http');
function get(url) {
  return new Promise(function(resolve, reject) {
    http.get(url, function(r) { var d=''; r.on('data', function(c){d+=c}); r.on('end', function(){ resolve({status: r.statusCode, body: d}); }); }).on('error', reject);
  });
}

async function main() {
  var urls = [
    '/src/providers/LocalAdapter.ts',
    '/src/providers/SupabaseAdapter.ts',
    '/src/providers/TencentCloudAdapter.ts',
    '/src/providers/types.ts'
  ];
  for (var i=0; i<urls.length; i++) {
    var res = await get('http://localhost:5173' + urls[i]);
    console.log(urls[i], res.status, res.body.length);
    if (res.status !== 200 || res.body.includes('SyntaxError') || (res.body.includes('<!DOCTYPE') && res.body.length < 1000)) {
      console.log('  PROBLEM:', res.body.substring(0, 300));
    }
  }
}
main().catch(function(e){console.log('FATAL', e.message)});
