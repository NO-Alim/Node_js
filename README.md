- **Day 6: Express Middleware & Static Files**
    
    ### 🎯 Objective:
    
    - Learn middleware concepts and how to serve static files.
    
    ### 📚 Topics:
    
    - What is middleware
        
        As we briefly touched upon, middleware functions are functions that have access to the request object (`req`), the response object (`res`), and the `next` middleware function in the application's request-response cycle. They sit in between the incoming request and the final route handler. Think of them as a series of steps a request goes through before reaching its destination.
        
        - **Key Capabilities of Middleware:**
            - Execute any code.
            - Make changes to the request and the response objects.
            - End the request-response cycle (by sending a response).
            - Call the next middleware in the stack (using the `next()` function).
    - Built-in middleware (`express.json`, `express.static`)
        
        Express comes with several built-in middleware functions. We've already seen `express.json()` which parses incoming JSON requests. Another crucial one is `express.static()`.
        
        - **`express.json()`**: Parses incoming requests with JSON payloads. It makes the parsed data available on `req.body`.
        - **`express.static(root)`**: Serves static assets such as HTML files, images, CSS files, and JavaScript files. The `root` argument specifies the root directory from which to serve static assets.
    - Custom middleware (logging, timestamping requests)
        
        You can write your own middleware functions to perform custom tasks. A common use case is logging details of incoming requests or adding a timestamp to the request object.
        
        - **Structure of Custom Middleware:**
            
            ```jsx
            app.use((req, res, next) => {
                // Your middleware logic here
                console.log('Request received!');
                next(); // Call next to pass control to the next middleware/route handler
            });
            ```
            
        - If you don't call `next()`, the request-response cycle will stop at that middleware, and no further middleware or route handlers will be executed for that request.
    - Order of middleware execution
        
        The order in which you define your middleware with `app.use()` matters significantly. Express executes middleware functions in the order they are defined. If a middleware sends a response and doesn't call `next()`, subsequent middleware or route handlers for that request will not be executed. This allows you to control the flow and pre-process requests.
        
    
    ### 💻 Task:
    
    - Create custom logger middleware
        
        ```jsx
        // custom middleware to check if the server is available
        app.use((req, res, next) => {
            const now = new Date();
            const hour = now.getHours();
        
            if (hour >= 22 || hour < 6) {
                return res.status(503).send('<h1>Server Unavailable</h1><p>Our services are closed between 10 PM and 6 AM. Please visit us during operating hours.</p>')
            }
            next();
        })
        ```
        
    - Serve a static HTML page from `public/`
        
        server.js
        
        ```jsx
        const express = require('express');
        const path = require('path')
        
        const port = 3000;
        const app = express();
        
        // This build in middleware is used to parse the body of the request
        app.use(express.json())
        
        // Task
        // serve a static page from the public folder
        // build in middleware static, this serves static files from the public folder
        app.use(express.static(path.join(__dirname, 'public')));
        
        app.get('/', (req, res) => {
            res.sendFile(path.join(__dirname, 'public', 'index.html'))
        })
        
        app.get('/static-page', (req, res) => {
            res.sendFile(path.join(__dirname, 'public', 'static-ex.html'))
        })
        
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        })
        ```
        
        public/index.html
        
        ```jsx
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Static Page Example</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 20px; background-color: #f4f4f4; }
                h1 { color: #333; }
                p { color: #666; }
            </style>
        </head>
        <body>
            <h1>Hello this is a Home page</h1>
        </body>
        </html>
        ```
        
        public/static-ex.html
        
        ```jsx
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Static Page Example</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 20px; background-color: #f4f4f4; }
                h1 { color: #333; }
                p { color: #666; }
            </style>
        </head>
        <body>
            <h1>Hello from a Static HTML Page!</h1>
            <p>This page is served directly by Express using <code>express.static()</code> middleware.</p>
            <p>You can put CSS, JavaScript, and images here too!</p>
        </body>
        </html>
        ```
        
    
    ### 🔁 Assignment:
    - Write a middleware that blocks requests after a certain time (e.g. block all after 10 PM)
    Already Done in Task Section