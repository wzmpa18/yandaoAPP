var http = require('http');
http.get('http://localhost:5173/src/providers/index.ts', function(r) {
  var d = '';
  r.on('data', function(c) { d += c; });
  r.on('end', function() {
    console.log('Has dp:', d.indexOf('{ data as dp }') > -1);
    console.log('Has dp export:', d.indexOf('export') > -1);
  });
});
