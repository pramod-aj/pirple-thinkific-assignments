/**
 * Model file library for storing  and retrieving data
 */
// Dependencies
const fs  = require('fs'); // Filesystem module
const path = require('path'); //Normalize the path to different directories

//Base directory of the data folder


// Container for this module
let lib = {};
// take the current directory, move up a folder and move to .data/ folder
lib.baseDir = path.join(__dirname,'/../.data'); 

/**
 * 
 * Create and write a file using FS Module 
 * @param {string} dir name of the directory to store inside .data root folder 
 * @param {string} file name of the file
 * @param {object} data the data that needs to go in
 * @param {function} callback handler function
 */
lib.create = (dir, file, data, callback) => {
 // fileDescriptor - A way to uniquely identify a particular file} dir 
    fs.open(`${lib.baseDir}/${dir}/${file}.json`,'wx',(err, fileDescriptor)=>{
        if(!err && fileDescriptor){
            const stringData  = JSON.stringify(data);
            fs.writeFile(fileDescriptor,stringData, (error)=>{
                if(!error){
                    fs.close(fileDescriptor,(error2)=>{
                        if(!error2){
                            callback(false); //giving a false error is a good thing.
                        }else {
                            callback('Error closing the file');
                        }
                    })
                }else{
                    callback('Error writing to new file'); // This - in theory, should never be called.
                }
            }); // Write 
            callback
        } else {
            callback('Could not create new file. It may already exist');
        }
    });
}


/**
 * Read a file using the FS module
 * @param {string} dir 
 * @param {string} file 
 * @param {function} callback 
 */
lib.read = (dir, file, callback) =>{
    fs.readFile(`${lib.baseDir}/${dir}/${file}.json`,'utf8',(err,data)=>{
        if(!err && data){
            const parsedData = lib.parseJsonToObject(data);
            callback(false, parsedData); // Now the read function is complete - it returns a valid JSON object
        } else {
            callback(err,data);
        }
    });
}

/**
 * Update a file with new data
 * @param {string} dir name of the directory to store inside .data root folder 
 * @param {string} file name of the file
 * @param {object} data the data that needs to be updated
 * @param {function} callback handler function
 */
lib.update = (dir, file, data, callback) => {
    //R+ => Open the file with switch -> Open file up for writing, error if the file doesnt exist yet
    //WX => Open the file with swtich -> Open file for writing, error if the file already exists
    //W+ => Open the file with swtich -> Open file for reading and writing. The file is created (if it does not exist) or truncated (if it exists)
    //Open the file for writing
    fs.open(`${lib.baseDir}/${dir}/${file}.json`,'r+',(err,fileDescriptor)=>{
        if(!err && fileDescriptor){
            const stringData  = JSON.stringify(data);
            //Truncate the contents of the file before writing on top of it
            fs.truncate(fileDescriptor,(err)=>{
                if(!err){
                    //Now finally - write to the file and close it
                    fs.writeFile(fileDescriptor,stringData,(error2)=>{
                        if(!error2){
                            fs.close(fileDescriptor, (error3)=>{
                                if(!error3){
                                    callback(false); //Successfully wrote to a file and closed it
                                }else{
                                    callback('Error closing the file', error3);
                                }
                            })
                        }else {
                            callback('Error writing to an existing file', error2);
                        }
                    })

                }else{
                    callback('Error truncating the file', error);
                }
            });
        } else {
            callback('Could not open the file for updating, it may not exist yet');
        }
    });
}


/**
 * Delete a file
 * @param {string} dir name of the directory to store inside .data root folder 
 * @param {string} file name of the file
 * @param {function} callback handler function
 */
lib.delete = (dir,file,callback)=>{
    //Unlinking the file from filesystem
    fs.unlink(`${lib.baseDir}/${dir}/${file}.json`,(err)=>{
        if(!err){
            callback(false);
        } else {
            callback('Error deleting the file');
        }
    });
}

/**
 * Parse a JSON string to an object in all cases, without throwing
 * @param string buffer
 * @returns Object any
 */
lib.parseJsonToObject = (inputBuffer)=>{
    try{
        const obj = JSON.parse(inputBuffer);
        return obj;
    }catch(error){
        // console.log('Error parsing data: ',error);
        return {};
    }
};


module.exports = lib; //Export the container