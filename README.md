### ✅ **Day 4: Basic HTTP Server with Node.js**

### 🎯 Objective:

- Learn how to build a web server with core `http` module.

### 📚 Topics:

- `http.createServer`
    
    At the heart of any Node.js HTTP server is the `http` module. This module provides the `createServer()` method, which returns a new instance of `http.Server`.
    
    Here's the basic structure:
    
    ```jsx
    const http = require('http');
    
    const server = http.createServer((req, res) => {
        // This is where we'll handle requests
    });
    
    server.listen(3000, () => {
        console.log('Server listening on port 3000');
    });
    ```
    
    - `require('http')`: This line imports the built-in `http` module.
    - `http.createServer()`: This method takes a function as an argument. This function, often called the "request listener," will be executed every time the server receives a request.
    - `req` (request object): This object contains information about the incoming request, such as the URL, headers, HTTP method, etc.
    - `res` (response object): This object is used to send data back to the client, set headers, and control the response status.
    - `server.listen(3000, () => { ... })`: This method starts the server and makes it listen for incoming connections on the specified port (in this case, port 3000). The callback function is executed once the server starts listening.
- Handling `req` and `res`
    
    When a request comes in, the `req` and `res` objects are your primary tools.
    
    - **`req` (Request)**:
        - `req.url`: The URL path of the request (e.g., `/`, `/api`, `/about`).
        - `req.method`: The HTTP method of the request (e.g., `GET`, `POST`, `PUT`, `DELETE`).
        - `req.headers`: An object containing the request headers.
    - **`res` (Response)**:
        - `res.statusCode`: Sets the HTTP status code for the response (e.g., `200` for OK, `404` for Not Found).
        - `res.setHeader(name, value)`: Sets a single HTTP header for the response.
        - `res.writeHead(statusCode, headers)`: Sets the status code and multiple headers at once.
        - `res.end(data)`: Sends the response body and signals that the response is complete. **You must call `res.end()` to send a response back to the client.**
    
    Let's see a simple example:
    
    ```jsx
    const http = require('http');
    
    const server = http.createServer((req, res) => {
        console.log(`Request received for: ${req.url} with method: ${req.method}`);
    
        res.statusCode = 200; // OK
        res.setHeader('Content-Type', 'text/plain'); // Tell the browser we're sending plain text
        res.end('Hello from the server!'); // Send the response body
    });
    
    server.listen(3000, () => {
        console.log('Server listening on port 3000');
    });
    ```
    
    If you run this code and navigate to `http://localhost:3000` in your browser, you will see "Hello from the server!".
    
- Basic routing using URL
    
    Now, let's make our server respond differently based on the URL path. We'll use `req.url` for this.
    
    ```jsx
    const http = require('http');
    // load the environment variables from the .env file
    require('dotenv').config();
    
    // create a server
    
    const server = http.createServer((req, res) => {
        if (req.url === '/') {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/plain');
            res.end('Welcome to the homepage!');
        } else if (req.url === '/about') {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/plain');
            res.end('This is the about page.');
        } else {
            res.statusCode = 404;
            res.setHeader('Content-Type', 'text/plain');
            res.end('404 Not Found');
        }
    });
    
    server.listen(3000, () => {
        console.log('Server listening on port 3000');
    });
    ```
    
    Here, we're using `if-else if-else` statements to check `req.url` and send different responses accordingly.
    
- Sending HTML, JSON responses
    
    You're not limited to sending plain text. You can send HTML to render a web page or JSON for API responses. The key is setting the correct `Content-Type` header.
    
    - **HTML Response:** Set `Content-Type` to `text/html`.
    - **JSON Response:** Set `Content-Type` to `application/json`. Remember to use `JSON.stringify()` to convert your JavaScript object into a JSON string.
    - 
    
    ```jsx
    const http = require('http');
    // load the environment variables from the .env file
    require('dotenv').config();
    
    // create a server
    const server = http.createServer((req, res) => {
        if (req.url === '/') {
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.end('<h1>Welcome to the homepage!</h1><p>This is the homepage of the website.</p>');
        } else if (req.url === '/api') {
            const data = {
                message: 'Hello from API', 
                version: '1.0.0',
                timestamp: new Date().toISOString()
            }
            res.writeHead(200, {'Content-Type': 'application/json'});
            res.end(JSON.stringify(data));
        } else {
            res.statusCode = 404;
            res.setHeader('Content-Type', 'text/plain');
            res.end('404 Not Found');
        }
    });
    
    const PORT = process.env.PORT || 3000;
    
    server.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
    ```
    

### 💻 Task:

- Create a server that:
    - Returns `Hello World` on `/`
        
        ```jsx
        if (req.url === '/') {
                // Returns Hello World on /
                res.writeHead(200, { 'Content-Type': 'text/plain' });
                res.end('Hello World');
            } 
        ```
        
    - Returns JSON on `/api`
        
        ```jsx
        if (req.url === '/api') {
                // Returns JSON on /api
                const apiData = {
                    message: 'API data',
                    status: 'success',
                    code: 200
                };
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(apiData));
            }
        ```
        
    - Returns 404 on unknown routes
        
        ```jsx
        else {
        // Returns 404 on unknown routes
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 Not Found');
        }
        ```
        

### 🔁 Assignment:

- Enhance the server to read content from a `.json` file and return it via `/data` route