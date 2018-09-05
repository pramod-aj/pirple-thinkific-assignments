## Homework Assignment #1

Please create a simple "Hello World" API. Meaning:

1. _It should be a RESTful JSON API that listens on a port of your choice._
- I have simply hard-coded the port, rather than defining environments for this assignments

```js
const PORT = 5000; //STEP 1 - For now setting this to 5000 - port of my choice
```

2. _When someone posts anything to the route /hello, you should return a welcome message, in JSON format. This message can be anything you want._
- I have considered `someone posts anything to the route /hello` as follows:
    - Method to be POST
    - No routes configured as explained in `Routing Requests` course
    - I have just considered if the trimmed path contains `/hello`

```js
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
```