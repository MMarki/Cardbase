const http = require('http');

// Options to be used by request 
const options = {
   host: 'localhost',
   port: '8080',
   path: '/index.html'  
};

// Callback function is used to deal with response
let callback = function(response) {
   // Continuously update stream with data
   var body = '';
   response.on('data', function(data) {
      body += data;
   });
   
   response.on('end', function() {
      // Data received completely.
      console.log(body);
   });
}
// Make a request to the server
let req = http.request(options, callback);
req.end();