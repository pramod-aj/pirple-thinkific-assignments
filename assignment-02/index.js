/*
 * Homework Assignment #2
 * PAJ - Creating Server for Handling User Logins, Token Generation, Cart Upload, Checkout, Payment 
 */

/*
 * NODE DEPENDENCIES 
 */ 
const http = require('http');
const https = require('https');
const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder;
const handlers = require('./handlers');
const helpers = require('./helpers');
const config = require('./config');
const fs = require('fs');

// Create server object to associate methods and properties to be called in other file
let server = {};

// Instantiate the HTTP server
server.httpServer = http.createServer((req,res)=>{
    server.handleRequests(req,res);
});


// Instantiate the HTTPS server
server.httpsServerOptions = {
    'key': fs.readFileSync('./https/key.pem'),
    'cert': fs.readFileSync('./https/cert.pem')
};

server.httpsServer = https.createServer(server.httpsServerOptions,(req,res)=>{
    server.handleRequests(req,res);
});

//PAJ - Defining handleRequests
server.handleRequests = (req,res)=>{
    // Retrieve the URL from the request and parse it using the url module
    const parsedUrl = url.parse(req.url, true); 


    // Retrieve the full path and trim it to only store the pathname for further matching with route name in route's object
    const path = parsedUrl.pathname;
    const trimmedPath = path.replace(/^\/+|\/+$/g, '');

    // Retrieve the queryString and make it an object for further use when GET or DELETE methods pass it through
    const queryStringObject = parsedUrl.query;

    // Get the HTTP method to indicate handler what subhandler to use
    const method = req.method.toLowerCase();

    // Get the headers as an object
    const headers = req.headers;

    // Get the payload and parse it
    const decoder = new StringDecoder('utf-8');
    let buffer = ''; 

    req.on('data', (data)=>{
         buffer += decoder.write(data);
    });

    req.on('end', ()=>{
        buffer += decoder.end();
        
         //Choose the handler that this request should go to
        const chosenHandler = typeof(routes[trimmedPath]) !== 'undefined' ? routes[trimmedPath] : routes.notFound;



        // All data obtained from the request into an object to pass it to the handler
        // We now want the payload to be instead of the plain buffer, helpers.buffer
        const data = {
            'trimmedPath' : trimmedPath,
            'queryStringObject' : queryStringObject,
            'method' : method,
            'headers' : headers,
            'payload' : helpers.parseJsonToObject(buffer)
        };


        
        // Execute the chosen handler 
        chosenHandler(data,(statusCode, payload)=>{
            
            // Set default status code to 200 in case of not present or different type
            const statusCode = typeof(statusCode) == 'number' ? statusCode : 200;

            // Set default payload value to empty object if not present
            const payload = typeof(payload) == 'object' ? payload : {};


            // Convert payload object to JSON String
            const payloadString = JSON.stringify(payload);


            // Write the response
            res.setHeader('Content-Type', 'application/json');
            res.writeHead(statusCode);
            res.end(payloadString);

            // Log Success or Error message to console

            statusCode == 404 ? console.log('Not found : 404 error code') : console.log('Returned request!');

        });
    });
};

/**
 * Configure ROUTES for users, tokens, cart, payment, notFound
 */
const routes = {
    users : handlers.users,
    tokens : handlers.tokens,
    cart : handlers.cart,
    pay : handlers.payment,
    notFound: handlers.notFound
};

/**
 * start up the server either on http / https port
 * PAJ
 * TODO: Add httpPort and httpsPort on config module
 */
server.init = ()=>{
    // Start the HTTP server
    server.httpServer.listen(config.httpPort,()=>{
        console.log(`The HTTP server is running on port ${config.httpPort}`);
    });

    // Start the HTTPS server
    server.httpsServer.listen(config.httpsPort,()=>{
        console.log(`The HTTPS server is running on port ${config.httpsPort}`);
    });
};

// Execute the NODE Server
server.init();