Note: From this Tutorial main file name has been changed, it's now server.js which was previously index.js

- ✅ **Day 5: Intro to Express.js**
    
    ### 🎯 Objective:
    
    - Learn how Express simplifies routing and server setup.
    
    ### 📚 Topics:
    
    - Installing and using Express
        
        Express is a Node.js framework, so you'll first need Node.js installed on your machine. Once Node.js is ready, you use `npm` (Node Package Manager) to install Express.
        
        - First, you'd typically initialize a new Node.js project in your directory:
            
            `npm init -y`
            
            This creates a `package.json` file, which manages your project's dependencies.
            
        - Then, you install Express:
            
            `npm install express`
            
            This command downloads the Express package and adds it to your `node_modules` folder, and also updates your `package.json` file.
            
    - Creating an Express app
        
        Once installed, you bring Express into your JavaScript file using `require()` and then initialize an Express application.
        
        ```jsx
        const express = require('express'); // Import the Express library
        const app = express();              // Create an Express application instance
        const port = 3000;                  // Define a port for your server
        
        // get request
        app.get('/', (req, res) => {
            res.send('hello world')
        });
        
        // listen to the port
        app.listen(port, () => {
            console.log(`server is running on port ${port}`);
        })
        ```
        
        The `app` object is where you'll define your routes, middleware, and other server logic.
        
    - Handling routes: GET, POST
        
        Routes define how your application responds to client requests to a particular endpoint. Express provides methods for common HTTP verbs like `GET` (to retrieve data), `POST` (to send data), `PUT` (to update data), and `DELETE` (to remove data). For this lesson, we'll focus on `GET` and `POST`.
        
        - **`GET` requests:** Used to retrieve data from the server.
            
            ```jsx
            app.get('/', (req, res) => {
                // req: request object (contains info about the incoming HTTP request)
                // res: response object (used to send back the HTTP response)
                res.send('Hello World!');
            });
            ```
            
        - **`POST` requests:** Used to send data to the server, often for creating new resources.
            
            ```jsx
            app.post('/submit', (req, res) => {
                res.send('Data received!');
            });
            ```
            
        - **Dynamic Routes (`/:id`):** Express allows you to define routes with parameters. These are placeholders in the URL that capture values. For example, `/products/:id` will match `/products/123` or `/products/abc`, and `id` will be accessible via `req.params.id`.
            
            ```jsx
            app.get('/products/:id', (req, res) => {
                const productId = req.params.id; // Access the dynamic part of the URL
                res.send(`You requested product with ID: ${productId}`);
            });
            ```
            
    - Sending responses: `res.send()`, `res.json()`
        
        After processing a request, your server needs to send a response back to the client. Express provides several methods for this:
        
        - **`res.send(body)`:** This is a versatile method that can send various types of responses:
            - A `String`: Sets the `Content-Type` to `text/html`.
            - An `Array` or `Object`: Express automatically converts it to JSON and sets `Content-Type` to `application/json`.
            - A `Buffer`: Sets `Content-Type` to `application/octet-stream`.
        - **`res.json(body)`:** Specifically sends a JSON response. It automatically sets the `Content-Type` header to `application/json` and converts the `body` (which can be an object or array) into a JSON string. It's generally preferred when you explicitly intend to send JSON.
    - Use of middleware (intro)
        
        Middleware functions are functions that have access to the request object (`req`), the response object (`res`), and the next middleware function in the application's request-response cycle. They can:
        
        - Execute any code.
        - Make changes to the request and the response objects.
        - End the request-response cycle.
        - Call the next middleware in the stack.
        
        A common use case is parsing incoming request bodies. For example, to handle JSON data sent in `POST` requests, you'd use `express.json()` middleware:
        
        ```jsx
        app.use(express.json()); // This middleware parses incoming JSON requests
        ```
        
        When a `POST` request with a JSON body comes in, `express.json()` will parse it and make the data available in `req.body`.
        
    
    ### 💻 Task:
    
    - Create an Express server with:
        - GET `/` → "Home"
        - GET `/about` → "About Page"
        - GET `/products/:id` → dynamic route
    
    ### 🔁 Assignment:
    
    - Build an Express API with 3-4 routes
    - Return hardcoded JSON for each route