const http = require("http");

const hostname = '127.0.0.1';
const port = 8080;

http.createServer(function (request, response){
    // Send the HTTP Header
    //HTTP Status: 200: OK
    //Content Type: text/html
    response.writeHeader(200, {'Content-Type':'text/html'});
    response.end("Hello World!\n");
}).listen(8080)

//Console will print this message
console.log(`Server running at http://${hostname}:{port}/`);