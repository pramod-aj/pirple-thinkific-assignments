// Dependencies
const _data = require('./../data');
const helpers = require('./../helpers');
const tokens = require('./tokens');

/*
let prop = {
    amount: 2000,
    currency: "usd",
    source: "tok_mastercard",
    description: "Charge for jenny.rosen@example.com"
};

helpers.stripe(prop.amount,prop.currency,prop.description,prop.source,function(){
    console.log('fin');
});
*/


/**
 * PAJ - Defininf handlers for payment module
 */
let handlers = {};

// set tokens handlers for verification
handlers.tokens = tokens.tokens;
handlers._tokens = tokens._tokens;

// Set payment handler to execute _payment handler or return error 
handlers.payment = (data, callback)=>{
    allowedMethods = ['post'];
    if (allowedMethods.indexOf(data.method) > -1) {
        handlers._payment[data.method](data, callback);
    } else {
        callback(405,{'Error': 'method not allowed'});
    }
};

handlers._payment = {};

handlers._payment.post = (data, callback)=>{
    // Verify requirements
    let email = typeof(data.payload.email) == 'string' && data.payload.email.trim().length > 0 ? data.payload.email.trim() : false;
    let orderId = typeof(data.payload["order-id"]) == 'string' && data.payload["order-id"].trim().length == 5 ? data.payload["order-id"].trim() : false;

    if (email && orderId) {
        // Verify Token
        let token = typeof(data.headers.token) == 'string' ? data.headers.token : false;
        handlers._tokens.verifyToken(token,email,(tokenIsValid)=>{
            if (tokenIsValid) {
                // Read order from file
                _data.read('cart',orderId,(err,userData)=>{
                    if (!err && userData){
                        
                        // Hardcoded props for test stripe helper
                        let prop = {
                            // amount:  you get amount from cart file , in order-total key
                            currency: "usd",
                            source: "tok_mastercard",
                            description: "Charge for " + userData.email
                        };

                        // Use stripe helper to process payment
                        helpers.stripe(userData["order-total"],prop.currency,prop.description,prop.source,(err)=>{

                            if (!err) {

                                // Append variables to email subject
                                const emailSubject = `Your order: (${orderId}) has been paid!`;
                                // Append variables to email text
                                const emailBody = `Your order: \n  ${userData.products} \n with price of: " ${userData["order-total"] / 100 } 'USD' \n has been paid and will soon be delivered!`;

                                
                                helpers.mailgun(email , emailSubject ,emailBody,(err)=>{
                                    if (!err) {

                                        userData.paid = true;

                                        _data.update('cart',orderId,userData,(err)=>{

                                            if (!err){
                                                callback(200, {'Message': 'Order placed successfully!'});
                                            } else {
                                                callback(500, {'Error' : 'could not update cart file to paid status'}); 
                                            }
                                        });
                                        
                                        
                                    } else {
                                        callback(500, {'Error' : err});
                                    }
                                });

                            } else {
                                callback(500, {'Error' : err});
                            }
                        });    
                        

                    } else {
                        callback(500,{'Error' : 'Could not read cart file'});
                    }    
                }); 
              
                
            } else {
                callback(403,{"Error" : "Missing required token in header, or token is invalid."})
            }
        });
    } else {
        callback(400,{'Error' : 'Missing required field(s).'})
    }
};

module.exports = handlers;