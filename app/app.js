const http = require('http');
const fs = require('fs');
const url = require('url')

const hostname = '127.0.0.1';
const port = 8080;

http.createServer(function (request, response){
    // Parse the request containing file name
    let pathname = url.parse(request.url).pathname;
    
    // Print the name of the file for which the request is made
    console.log ("Request for " + pathname + " recieved");

    // Read the requested file content from file system
   fs.readFile(pathname.substr(1), function (err, data) {
    if (err) {
       console.log(err);
       
       // HTTP Status: 404 : NOT FOUND
       // Content Type: text/html
       response.writeHead(404, {'Content-Type': 'text/html'});
    } else {	
       // Page found	  
       // HTTP Status: 200 : OK
       // Content Type: text/html
       response.writeHead(200, {'Content-Type': 'text/html'});	
       
       // Write the content of the file to response body
       response.write(data.toString());		
    }
    
        // Send the response body 
        response.end();
    });   
}).listen(8080)

//Console will print this message
console.log(`Server running at http://${hostname}:${port}/`);