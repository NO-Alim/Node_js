- ✅ **Day 3: Asynchronous JavaScript in Node.js**
    
    ### 🎯 Objective:
    
    - Understand how Node.js handles async operations.
        
        At its core, Node.js is single-threaded. This might sound counter-intuitive for a technology that's known for handling many concurrent connections, but the magic lies in how it manages tasks that don't immediately return a result. This is where asynchronous operations come in. Instead of waiting for a long-running task to complete, Node.js offloads it and continues executing other code. Once the long-running task is done, Node.js is notified, and it then processes the result.
        
    
    ### 📚 Topics:
    
    - The Event Loop (overview only)
        
        Think of the Event Loop as the conductor of an orchestra. Node.js applications are constantly running, and the Event Loop is what allows them to perform non-blocking I/O operations. When Node.js encounters an asynchronous operation (like reading a file), it sends that operation off to the underlying system (e.g., the operating system kernel). While that operation is being processed externally, the Event Loop continues to check if there are other tasks in the "call stack" (where synchronous code is executed) that need to be run.
        
        Once an asynchronous operation completes, its callback function (the code that should run after the operation is done) is placed into a "callback queue." The Event Loop continuously checks this queue, and when the call stack is empty, it moves functions from the callback queue to the call stack for execution. This continuous cycle is what keeps Node.js non-blocking.
        
        We'll only do an overview today, as the Event Loop is a deep topic, but understand that it's the mechanism that enables Node.js's asynchronous nature.
        
    - Callbacks, Promises, async/await
        
        **Callbacks:**
        Historically, callbacks were the go-to method. A callback is simply a function that is passed as an argument to another function and is executed later, typically when an asynchronous operation completes.
        
        ```jsx
        // Example of a callback-based function
        function readFileCallback(filename, callback) {
            // Simulating an async file read
            setTimeout(() => {
                const data = "Content from " + filename;
                const error = null; // In a real scenario, this could be an error object
                callback(error, data);
            }, 1000);
        }
        
        readFileCallback("myFile.txt", (err, data) => {
            if (err) {
                console.error("Error reading file:", err);
                return;
            }
            console.log("File content (callback):", data);
        });
        ```
        
        While effective, deeply nested callbacks can lead to "callback hell" or "pyramid of doom," making code difficult to read and maintain.
        
        **Promises:**
        Promises were introduced to address the readability issues of deeply nested callbacks. A Promise is an object that represents the eventual completion (or failure) of an asynchronous operation and its resulting value.
        
        A Promise can be in one of three states:
        
        - **Pending:** Initial state, neither fulfilled nor rejected.
        - **Fulfilled (Resolved):** Meaning that the operation completed successfully.
        - **Rejected:** Meaning that the operation failed.
        
        ```jsx
        // Example of a Promise-based function
        function readFilePromise(filename) {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    const data = "Content from " + filename;
                    const success = Math.random() > 0.3; // Simulate success/failure
                    if (success) {
                        resolve(data); // Operation succeeded
                    } else {
                        reject(new Error("Failed to read " + filename)); // Operation failed
                    }
                }, 1000);
            });
        }
        
        readFilePromise("anotherFile.txt")
            .then(data => {
                console.log("File content (promise):", data);
            })
            .catch(err => {
                console.error("Error reading file (promise):", err.message);
            });
        ```
        
        Promises make asynchronous code more readable and easier to chain.
        
        **async/await:**
        Introduced in ES2017, `async/await` is syntactic sugar built on top of Promises, making asynchronous code look and behave more like synchronous code. It significantly improves readability and error handling for asynchronous operations.
        
        - The `async` keyword is used to define an asynchronous function. An `async` function implicitly returns a Promise.
        - The `await` keyword can only be used inside an `async` function. It pauses the execution of the `async` function until the Promise it's waiting for settles (either resolves or rejects).
        
        ```jsx
        // Example of async/await
        async function readAndProcessFile(filename) {
            try {
                const data = await readFilePromise(filename); // Wait for the promise to resolve
                console.log("File content (async/await):", data);
                // You can do more operations here with the data
            } catch (error) {
                console.error("Error reading file (async/await):", error.message);
            }
        }
        
        readAndProcessFile("yetAnotherFile.txt");
        ```
        
        `async/await` is generally the preferred method for handling asynchronous operations due to its clarity.
        
    - Using Promises and async/await with `fs.promises`
        
        The `fs` (File System) module in Node.js provides an API for interacting with the file system. Node.js offers a promise-based version of the `fs` module, accessible via require('fs/promises'). This is the recommended way to handle file operations in modern Node.js code because it integrates seamlessly with `async/await`.
        
        Let's look at an example.
        
        ```jsx
        const { log } = require('console');
        const http = require('http');
        // load the environment variables from the .env file
        require('dotenv').config();
        
        // fs/promises is a newer way to handle file operations
        const fs = require('fs/promises');
        // fs is the older way to handle file operations
        const fsWithoutPromises = require('fs');
        
        // file operation using fs/promises
        async function fileOperation() {
            const filename = 'data.txt';
            const data = 'Hello World';
            const additionalData = 'Additional Data';
        
            try {
                await fs.writeFile(filename, data)
                console.log(`File ${filename} created successfully`);
        
                await fs.appendFile(filename, additionalData);
                console.log(`Additional data appended to ${filename}`);
            } catch (error) {
                console.error(`Error creating file ${filename}:`, error);
            }
        }
        
        // file operation without promises
        const fileOperationWithoutPromises = () => {
            const filename = 'doc.txt';
            const data = 'hello world';
            const additionalData = 'Additional Data';
        
            try {
                fsWithoutPromises.writeFile(filename, data, (err) => {
                    if (err) {
                        console.error(`Error creating file ${filename}:`, err);
                        return;
                    }
                    console.log(`File ${filename} created successfully`);
                });
        
                fsWithoutPromises.appendFile(filename, additionalData, (err) => {
                    if (err) {
                        console.error(`Error appending to file ${filename}:`, err);
                        return;
                    }
                    console.log(`Additional data appended to ${filename}`);
                });
            } catch (error) {
                console.error(`Error creating file ${filename}:`, error);
            }
        }
        
        // create a server
        const server = http.createServer((req, res) => {
            res.end('Hello World');
        });
        
        // call the file operation functions with promises
        fileOperation();
        // call the file operation without promises function
        fileOperationWithoutPromises();
        
        const PORT = process.env.PORT || 3000;
        
        server.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
        ```
        
    
    ### 💻 Task:
    
    - Read and write to a file using async/await
        
        ```jsx
        const http = require('http');
        // load the environment variables from the .env file
        require('dotenv').config();
        
        // fs/promises is a newer way to handle file operations
        const fs = require('fs/promises');
        // fs is the older way to handle file operations
        const fsWithoutPromises = require('fs');
        
        // read file
        const readFile = async () => {
            const filename = 'sample.txt';
            const data = await fs.readFile(filename, 'utf-8')
            console.log(data);
        }
        
        // read file without promises
        const readFileWithoutPromises = () => {
            const filename = 'sample.txt';
            fsWithoutPromises.readFile(filename, 'utf-8', (err, data) => {
                if (err) {
                    console.error(`Error reading file ${filename}:`, err);
                    return;
                }
                console.log(data);
            })
        }
        
        // create a server
        const server = http.createServer((req, res) => {
            res.end('Hello World');
        });
        
        // call the read file function
        readFile()
        // call the read file without promises function
        readFileWithoutPromises()
        
        const PORT = process.env.PORT || 3000;
        
        server.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
        ```
        
    
    ### 🔁 Assignment:
    
    - Write a script that fetches data from a local file and returns only unique lines