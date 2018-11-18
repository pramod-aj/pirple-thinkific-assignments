//Dependencies
const _data = require('./../data');
const tokens = require('./tokens');



let handlers = {};

// Add token handlers for verification
handlers.tokens = tokens.tokens;
handlers._tokens = tokens._tokens;



// Set users handler to execute _users handler or return error 
handlers.users = (data, callback)=>{
    allowedMethods = ['get', 'post', 'put', 'delete'];
    if (allowedMethods.indexOf(data.method) > -1) {
        handlers._users[data.method](data, callback);
    } else {
        callback(405,{'Error': 'method not allowed'});
    }
};

// Set _users handlers for get put post and delete
handlers._users = {};

// Users - post
// Required Fields : name, email address, and street address
handlers._users.post = (data, callback)=>{

    // Verify requirements
    let name = typeof(data.payload.name) == 'string' && data.payload.name.trim().length > 0 ? data.payload.name.trim() : false;
    let email = typeof(data.payload.email) == 'string' && data.payload.email.trim().length > 0 ? data.payload.email.trim() : false;
    let streetAddress = typeof(data.payload.address) == 'string' && data.payload.address.trim().length > 0 ? data.payload.address.trim() : false;

    if (name && email && streetAddress){
        // Check file does not already exist
        _data.read('users',email,(err, data)=>{
            // Create users object 

            let userObject = {
                'name' : name,
                'email' : email,
                'address' : streetAddress
            };

            // If there IS error (means file does not exist , continue)
            if(err) {
                _data.create('users',email, userObject, (err)=>{
                    if(!err){
                        callback(200 , {'Message' : 'User successfully created'});
                    } else {
                        callback(500, {'Error': 'Could not create user'});
                    }
                });
            } else {
                callback(400, {'Error': 'A user with that email already exists'});
            }
        });
    } else {
        callback(400, {'Error': 'Missing required fields'});
    }
};

// Users - get
// Required Fields : email address
handlers._users.get = (data, callback)=>{
    // check if email in query is valid
    let email = typeof(data.queryStringObject.email) == 'string' && data.queryStringObject.email.trim().length > 0 ? data.queryStringObject.email.trim() : false;
    
    if (email) {
        let token = typeof(data.headers.token) == 'string' ? data.headers.token : false;
        handlers._tokens.verifyToken(token,email,(tokenIsValid)=>{
            if (tokenIsValid){
                // Read file with filename equal to query
                _data.read('users',email,(err,data)=>{
                    if (!err && data) {
                        callback(200,data);
                    } else {
                        callback(404);
                    }
                });
            } else {
                callback(403,{"Error" : "Missing required token in header, or token is invalid."})
            }
        });
        
    } else {
        callback(400,{'Error': 'Missing required field'});
    }
};


// Required data: email
// Optional data: name , streetAddress
handlers._users.put = (data,callback)=>{

    // Verify requirements
    let name = typeof(data.payload.name) == 'string' && data.payload.name.trim().length > 0 ? data.payload.name.trim() : false;
    let email = typeof(data.payload.email) == 'string' && data.payload.email.trim().length > 0 ? data.payload.email.trim() : false;
    let streetAddress = typeof(data.payload.address) == 'string' && data.payload.address.trim().length > 0 ? data.payload.address.trim() : false;

    // Error if phone is invalid
    if(email){
        // Error if nothing is sent to update
        if(name || streetAddress){
            let token = typeof(data.headers.token) == 'string' ? data.headers.token : false;
            handlers._tokens.verifyToken(token,email,(tokenIsValid)=>{
                if (tokenIsValid){
                    // Lookup the user
                    _data.read('users',email,(err,userData)=>{
                        if(!err && userData){
                            // Update the fields if necessary
                            if(name){
                                userData.name = name;
                            }
                            if(streetAddress){
                                userData.streetAddress = streetAddress;
                            }
                            // Store the new updates
                            _data.update('users',email,userData,(err)=>{
                                if(!err){
                                    callback(200);
                                } else {
                                    console.log(err);
                                    callback(500,{'Error' : 'Could not update the user.'});
                                }
                            });
                        } else {
                            callback(400,{'Error' : 'Specified user does not exist.'});
                        }
                    });                
                } else {
                    callback(403,{"Error" : "Missing required token in header, or token is invalid."})
                }
            });
        } else {
            callback(400,{'Error' : 'Missing fields to update.'});
        }
    } else {
        callback(400,{'Error' : 'Missing required field.'});
    }

};

// Required data: phone
handlers._users.delete = (data,callback)=>{
// Check that email is valid
    let email = typeof(data.queryStringObject.email) == 'string' && data.queryStringObject.email.trim().length > 0 ? data.queryStringObject.email.trim() : false;
        if(email){
            let token = typeof(data.headers.token) == 'string' ? data.headers.token : false;
            handlers._tokens.verifyToken(token,email,(tokenIsValid)=>{
                    if (tokenIsValid){
                    // Lookup the user
                        _data.read('users',email,(err,data)=>{
                            if(!err && data){
                                _data.delete('users',email,(err)=>{
                                if(!err){
                                    callback(200);
                            } else {
                                callback(500,{'Error' : 'Could not delete the specified user'});
                            }
                        });
                    } else {
                        callback(400,{'Error' : 'Could not find the specified user.'});
                    }
                    });
                } else {
                    callback(403,{"Error" : "Missing required token in header, or token is invalid."})
                }
            });
            
        } else {
            callback(400,{'Error' : 'Missing required field'})
        }
};

module.exports = handlers;