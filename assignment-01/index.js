/**
 * Pramod AJ - 5th September 2018
 * This is the HomeWork Assignment #1
 * Creating a simple RESTful JSON API server using just Node JS core libraries
 */

// Built in modules of Node JS - http and url

const PORT = 5000; //STEP 1 - For now setting this to 5000 - port of my choice

const http = require('http');
const url = require('url');

//Server would respond to any type of request with a message - Welcome to Node JS Master class
const server = http.createServer((req,res) => {

    //Response Handler 
    const responseHandler = (statusCode, payload)=>{
        statusCode = typeof(statusCode) == 'number' ? statusCode : 200;

        const payloadString  = JSON.stringify(payload);
        
        res.setHeader('Content-Type','application/json');
        res.writeHead(statusCode);
        res.end(payloadString);
    };

    const parsedURL = url.parse(req.url, true); // Contains all info - in this case full url
    // Get the path from the URL
    const path = parsedURL.pathname; // Untrimmed path that the user requested.
    //Trimming of any extraneous path from the request
    //it will only trim the leading and lagging slashes, not middle slashes
    const trimmedPath = path.replace(/^\/+|\/+$/g,'');
    
    const method = req.method.toLowerCase();

    /*
    * STEP 2 - Check if the method is a POST method
    * Assignment - if anyone `posts`
    */
    if (method == 'post') {
        /**
         * STEP 3 - Check if they have posted - hello
         */
        if (trimmedPath == 'hello') {
            responseHandler(200, {message:'Welcome to Node JS Master Class'});
        }else {
            responseHandler(404, {});
        }
    } else {
        responseHandler(404, {});
    }
});

//Start server
server.listen(PORT,()=>{
	console.log('Server listening at:', server.address().port);
});

