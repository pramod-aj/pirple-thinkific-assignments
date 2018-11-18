/**
 * PAJ - Helper Module for Stripe Payment, Mailgun Mail Notification...
 */
// Dependencies
const config = require('./config');
const querystring = require('querystring');
const https = require('https');


/**
 * Defining helpers module
 */
let helpers = {};

/**
 * PAJ - Stripe payment helper method
 * @param {number} amount  
 * @param {*} currency 
 * @param {*} description 
 * @param {*} source 
 * @param {*} callback 
 */
helpers.stripe = (amount,currency,description,source,callback) => {
    // Configure the request payload
    const payload = {
      'amount' : amount,
      'currency' : currency,
      'description' : description,
      'source' : source,
    }
  
    // Stringify the payload
    const stringPayload = querystring.stringify(payload);

    // Configure the request details
    const requestDetails = {
      'protocol' : 'https:',
      'hostname' : 'api.stripe.com',
      'method' : 'POST',
      'auth' : config.stripe.secretKey,
      'path' : '/v1/charges',
      'headers' : {
        'Content-Type' : 'application/x-www-form-urlencoded',
        'Content-Length' : Buffer.byteLength(stringPayload)
      }
    };
  
    // Instantiate the request object
    const req = https.request(requestDetails,(res)=>{
      // Grab the status of the sent request
      const status = res.statusCode;
      // Callback successfully if the request went through
      if(status==200 || status==201){
        callback(false);
      } else {
        callback('Status code return was '+status);
      }
    });
  
    // Bind to the error event so it doesn't get the thrown
    req.on('error',function(e){
      callback(e);
    });
  
    // Add the payload
    req.write(stringPayload);
  
    // End the request
    req.end();
};


/**
 * PAJ - MailGun Helper Mehod
 * @param {*} to 
 * @param {*} subject 
 * @param {*} text 
 * @param {*} callback 
 */
helpers.mailgun = function(to,subject,text,callback){
    // Configure the request payload
    const payload = {
      'from' : 'Node Master Class Pizza API! <' + config.mailgun.sender + '>',
      'to' : to,
      'subject' : subject,
      'text' : text
    }
  
    // Stringify the payload
    const stringPayload = querystring.stringify(payload);

    // Configure the request details
    const requestDetails = {
      'protocol' : 'https:',
      'hostname' : 'api.mailgun.net',
      'method' : 'POST',
      'auth' : config.mailgun.apiKey,
      'path' : '/v3/'+config.mailgun.domainName+'/messages',
      'headers' : {
        'Content-Type' : 'application/x-www-form-urlencoded',
        'Content-Length' : Buffer.byteLength(stringPayload)
      }
    }
  
    // Instantiate the request object
    const req = https.request(requestDetails,(res)=>{
      // Grab the status of the sent request
      const status = res.statusCode;
      // Callback successfully if the request went through
      if(status==200 || status==201){
        callback(false);
      } else {
        callback('Status code return was '+status);
      }
    });
  
    // Bind to the error event so it doesn't get the thrown
    req.on('error',function(e){
      callback(e);
    });
  
    // Add the payload
    req.write(stringPayload);
  
    // End the request
    req.end();
};

// Export helper method
module.exports = helpers;