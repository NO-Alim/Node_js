- ✅ **Day 13: Error Handling & API Response Design**
    
    ### 🎯 Objective:
    
    - Build reliable APIs with good error messages and proper status codes.
    
    ### The Importance of Good Error Handling and API Response Design
    
    Imagine a user interacts with your API, and something goes wrong (e.g., they send invalid data, try to access a non-existent resource, or an internal server issue occurs).
    
    - **Bad Scenario:** They get a cryptic error message like "Internal Server Error" with a `500` status code, or worse, the server just crashes. They have no idea what went wrong or how to fix it.
    - **Good Scenario:** They receive a clear error message, a precise HTTP status code, and perhaps details about what invalid data they sent. This empowers them to understand and correct their request.
    
    Consistent API responses, whether for success or error, make your API predictable and easier for client-side developers to consume.
    
    ### 📚 Topics:
    
    - Global error handling middleware in Express
        
        Express allows you to define special middleware functions specifically for handling errors. These functions have four arguments: `(err, req, res, next)`. Express knows it's an error handler if it has these four arguments.
        
        This middleware is typically placed **at the very end** of your `app.js` file, after all your routes and other middleware. When an error occurs in any of your routes or other middleware (either by calling `next(err)` or by an unhandled `async` error), Express will pass the error to this global handler.
        
        **Why use it?**
        
        - **Centralization:** All error handling logic is in one place, making it easier to manage.
        - **Catch-all:** Catches errors from various parts of your application, preventing server crashes.
        - **Consistency:** Ensures all error responses conform to a uniform format.
    
    middlewares/errorHandler.js
    
    ```jsx
    const errorHandler = (err, req, res, next) => {
      console.error(err.stack); // You can log to file in production
    
      const statusCode = err.statusCode || 500;
    
      res.status(statusCode).json({
        success: false,
        message: err.message || 'Internal Server Error',
        error: process.env.NODE_ENV === 'development' ? err.stack : undefined,
      });
    };
    
    module.exports = errorHandler;
    
    ```
    
    app.js
    
    📌 This should be placed **after all routes** in `app.js`:
    
    ```jsx
    const errorHandler = require('./middlewares/errorHandler');
    
    // After routes
    app.use(errorHandler);
    ```
    
    - Try/catch + `next(err)`
        
        In your controller functions (or any asynchronous code), you should continue to use `try/catch` blocks. However, instead of directly sending an error response from within the `catch` block for every single error, you can **pass the error to the `next()` function**.
        
        - `next(err)`: When `next()` is called with an argument, Express assumes it's an error and skips all subsequent non-error-handling middleware and routes, jumping directly to the first error-handling middleware.
        
        This pattern allows your controller functions to focus on their primary logic and offload the actual error response formatting to the centralized global error handler.
        
        ```jsx
        exports.getBookById = async (req, res, next) => {
          try {
            const book = await Book.findById(req.params.id);
            if (!book) {
              const error = new Error('Book not found');
              error.statusCode = 404;
              return next(error);
            }
            res.status(200).json({
              success: true,
              data: book,
            });
          } catch (err) {
            next(err); // Forward to global error handler
          }
        };
        ```
        
    - Handling Mongoose validation errors
        
        Mongoose `ValidationError` objects are special. They have an `errors` property, which is an object containing details for each field that failed validation. Your global error handler should specifically check for this type of error to provide detailed feedback.
        
        Error Handling Middleware Structure:
        
        ```jsx
        
        // app.js (at the very end, after all app.use() and routes)
        app.use((err, req, res, next) => {
            console.error(err.stack); // Log the error stack for debugging
        
            let statusCode = err.statusCode || 500;
            let message = err.message || 'Internal Server Error';
            let errors = []; // For validation errors
        
            // Handle Mongoose Validation Errors
            if (err.name === 'ValidationError') {
                statusCode = 400; // Bad Request
                message = 'Validation Failed';
                for (let field in err.errors) {
                    errors.push({
                        field: field,
                        message: err.errors[field].message
                    });
                }
            }
            // Handle Mongoose CastError (e.g., invalid ID format)
            else if (err.name === 'CastError' && err.kind === 'ObjectId') {
                statusCode = 400; // Bad Request
                message = `Invalid ID: ${err.value}`;
            }
            // Handle Duplicate Key Error (MongoDB error code 11000)
            else if (err.code === 11000) {
                statusCode = 409; // Conflict
                const field = Object.keys(err.keyValue)[0];
                message = `Duplicate field value: ${field} '${err.keyValue[field]}' already exists.`;
            }
            // Custom errors (e.g., from your controller `new Error('Book not found'); error.statusCode = 404;`)
            // The statusCode and message would already be set if it's a custom error with those properties
        
            res.status(statusCode).json({
                success: false,
                message: message,
                errors: errors.length > 0 ? errors : undefined // Only include if there are specific field errors
            });
        });
        ```
        
    - Consistent API response format (`success`, `data`, `message`, `error`)
        
        A consistent response format makes your API predictable and easier to consume.
        
        **Success Response Format:**
        
        JSON
        
        ```jsx
        {
            "success": true,
            "message": "Operation completed successfully.",
            "data": {
                // The actual resource data (e.g., a book object, an array of books)
            }
        }
        ```
        
        **Error Response Format:**
        
        JSON
        
        ```jsx
        {
            "success": false,
            "message": "A descriptive error message (e.g., 'Validation Failed', 'Book not found').",
            "errors": [
                // Optional: An array of detailed errors, especially for validation errors
                // Example: { "field": "title", "message": "Title is required" }
            ],
            // "code": 11000 // Optional: custom error code for specific error types
        }
        ```
        
        **Implementation in Controllers (Success Responses):**
        
        ```jsx
        // controllers/book.controller.js (createBook success example)
        exports.createBook = async (req, res, next) => {
            try {
                const newBook = await Book.create(req.body);
                res.status(201).json({
                    success: true,
                    message: 'Book created successfully',
                    data: newBook
                });
            } catch (error) {
                next(error);
            }
        };
        
        // controllers/book.controller.js (getAllBooks success example)
        exports.getAllBooks = async (req, res, next) => {
            try {
                const books = await Book.find({});
                res.status(200).json({
                    success: true,
                    message: 'Books fetched successfully',
                    data: books
                });
            } catch (error) {
                next(error);
            }
        };
        ```
        
    - Custom error classes
        
        In Node.js every thrown error is just an **instance of `Error`**(or of something that extends it, like TypeError). A **custom error class** is simply **your own subclass o `Error`**that carries *extra* context: an HTTP status code, whether it’s an “operational” error (expected) or a “programmer” error (bug).
        
        **Example Custom Error Class (`utils/AppError.js`):**
        
        ```jsx
        // utils/AppError.js
        class AppError extends Error {
            constructor(message, statusCode = 500, isOperational = true) {
                super(message); // Call the parent Error constructor
                this.statusCode = statusCode;
                this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
                this.isOperational = isOperational; // Mark as an error we expect and want to send to client
        
                Error.captureStackTrace(this, this.constructor); // Capture stack trace, excluding this constructor
            }
        }
        
        module.exports = AppError;
        ```
        
        Using Custom Error class in Controller
        
        ```jsx
        
        const AppError = require('../utils/AppError'); 
        
        exports.getBookById = async (req, res, next) => {
            try {
                const book = await Book.findById(req.params.id);
                if (!book) {
                    // Throw a custom NotFoundError
                    return next(new AppError('Book not found', 404));
                }
                res.status(200).json({
                    success: true,
                    message: 'Book fetched successfully',
                    data: book
                });
            } catch (error) {
                next(error); // Mongoose CastError will still be caught here
            }
        };
        ```
        
    
    ### 💻 Task:
    
    - Add error handling middleware to your project
    - Refactor your API to use consistent response format
    
    ### 🔁 Assignment:
    
    - Simulate a few error cases (invalid ID, missing fields) and test responses