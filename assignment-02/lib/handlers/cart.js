/**
 * Cart Handler
 */

//Dependencies
const _data = require('./../data');
const tokens = require('./tokens');
const helpers = require('./../helpers');

let handlers = {};

handlers.tokens = tokens.tokens;
handlers._tokens = tokens._tokens;

// Set cart handler to execute _cart handler or return error 
handlers.cart = (data, callback)=>{
    allowedMethods = ['get', 'post', 'delete'];
    if (allowedMethods.indexOf(data.method) > -1) {
        handlers._cart[data.method](data, callback);
    } else {
        callback(405,{'Error': 'method not allowed'});
    }
};

// Set _cart handlers for get put post and delete
handlers._cart = {};

// Users - post
// Required Fields : name, email address, and street address
handlers._cart.post = (data, callback)=>{
    // Verify requirements
    let cart = typeof(data.payload.cart) == 'object' && data.payload.cart instanceof Array ? data.payload.cart : false;
    let email = typeof(data.payload.email) == 'string' && data.payload.email.trim().length > 0 ? data.payload.email.trim() : false; 

    if(cart && email) {
        // Verify Token
        const token = typeof(data.headers.token) == 'string' ? data.headers.token : false;

        handlers._tokens.verifyToken(token,email,(tokenIsValid)=>{
            if (tokenIsValid) {
                // Read menu from file
                _data.read('menus','menus',(err,userData)=>{
                    if (!err && userData){
                        // Set menu from read file in menus.js
                        const menu = userData.items;
                       
                        helpers.isInMenu(cart,menu,(err,selectedMenuItems)=>{
                            // Check if all cart items exist in menu
                            if(!err) {
                                // Create string for selected products to include in output
                                helpers.selectedProductsData(menu, selectedMenuItems,(selectedProducts,totalPrice)=>{
                                    // Create order id
                                    const orderId = helpers.createRandomString(5);

                                    // Create cart object (cart id, products, total price, instructions)
                                    cart = {
                                        "email" : email,
                                        "products" : selectedProducts,
                                        "order-total" : totalPrice,
                                        "order-id": orderId,
                                        "paid" : false
                                    }

                                    // Store the cart
                                    _data.create('cart',orderId,cart,(err)=>{
                                        if(!err){
                                          callback(200,cart);
                                        } else {
                                          callback(500,{'Error' : 'Could not store the cart'});
                                        }
                                    });

                                });

                            } else {
                                callback(400,{'Error' : 'Specified cart item id does not exist.'});
                            }
                        });
                        

                    } else {
                        callback(500,{'Error' : 'Could not read Menu file'});
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


// Cart - get
// Required Fields : order-id
handlers._cart.get = (data, callback)=>{
    // check if email in query is valid
    const orderId = typeof(data.queryStringObject.id) === 'string' && data.queryStringObject.id.trim().length === 5 ? data.queryStringObject.id.trim() : false;

    if (orderId) {
        // Read file with filename equal to query
        _data.read('cart',orderId,(err,data)=>{
            if (!err && data) {
                callback(200,data);
            } else {
                callback(404);
            }
        });
    
    } else {
        callback(400,{'Error': 'Missing required field'});
    }
};

handlers._cart.delete = (data,callback)=>{
    // Check that id is valid
    var orderId = typeof(data.queryStringObject.id) === 'string' && data.queryStringObject.id.trim().length === 5 ? data.queryStringObject.id.trim() : false;
    if(orderId) {
      // Lookup the token
      _data.read('cart',orderId,(err,tokenData)=>{
        if(!err && tokenData){
          // Delete the token
          _data.delete('cart',orderId,(err)=>{
            if(!err){
              callback(200, {'Message' : 'Cart successfully deleted!'});
            } else {
              callback(500,{'Error' : 'Could not delete the specified token'});
            }
          });
        } else {
          callback(400,{'Error' : 'Could not find the specified token.'});
        }
      });
    } else {
      callback(400,{'Error' : 'Missing required field'})
    }
};



module.exports = handlers;