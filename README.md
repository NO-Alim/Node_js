- ✅ Day 11: MVC Structure & API Folder Organization
    
    ### 🎯 Objective:
    
    - Learn to organize code into controller, model, route structure.
        
        What is MVC?
        
        **MVC** stands for: 
        
        - **Model** – handles data and business logic (usually connected to a database).
        - **View** – in backend APIs, this is often replaced with **JSON responses**.
        - **Controller** – handles user input, works with the model, and returns responses.
        - **(Routes)** – technically not in MVC, but in Node.js APIs, we use routes to handle incoming requests and call controllers.
    
    ### 📚 Topics:
    
    - Why structure matters in large projects
        
        In small apps, a single `server.js` file might work. But as your app grows:
        
        - Code becomes messy and hard to debug.
        - Adding features becomes painful.
        - You can’t collaborate easily with others.
        
        By separating concerns:
        
        - You **organize** related logic.
        - It’s easier to **test**.
        - You improve **code reuse and readability**.
    - Folder structure:
        
        ```
        project-root/
        │
        ├── models/            # Mongoose or schema logic
        │   └── book.model.js
        │
        ├── controllers/       # Request logic
        │   └── book.controller.js
        │
        ├── routes/            # API endpoints
        │   └── book.routes.js
        │
        ├── config/            # Database config, ENV, etc.
        │   └── db.js
        │
        ├── app.js             # Main app entry point
        └── server.js          # Start the server
        ```
        
    - Separate logic for route and controller
        
        This is the core concept of MVC in an API context:
        
        - **Route (`routes/book.routes.js`)**:
            - Declares the endpoint.
            - Says "When a POST request comes to `/api/books`, call `bookController.createBook`."
            - It's like the signpost on a highway.
        - **Controller (`controllers/book.controller.js`)**:
            - Contains the actual function that handles the request.
            - It receives the `req` and `res` objects.
            - It extracts data from `req`.
            - It interacts with `book.model.js` (e.g., `Book.create()`, `Book.findById()`).
            - It sends back the final `res`.
            - It's like the traffic controller at the intersection.
    - Exporting & importing files
        
        For this structure to work, you need to use Node.js's module system (`module.exports` and `require()`).
        
        **1. Models (`models/book.model.js`):**
        * You define your schema and model.
        * You export the Mongoose model so controllers can use it.
        
        ```jsx
        // models/book.model.js
        const mongoose = require('mongoose');
        
        const bookSchema = new mongoose.Schema({
            title: { type: String, required: true, trim: true },
            author: { type: String, required: true, trim: true },
            publishedYear: { type: Number, min: 1000, max: new Date().getFullYear() }
        }, { timestamps: true });
        
        const Book = mongoose.model('Book', bookSchema);
        
        module.exports = Book; // Export the Book model
        ```
        
        **2. Controllers (`controllers/book.controller.js`):**
        * You import the necessary model(s).
        * You define functions for each CRUD operation.
        * You export an object containing these functions.
        
        ```jsx
        // controllers/book.controller.js
        const Book = require('../models/book.model'); // Import the Book model
        
        // Async function to create a new book
        exports.createBook = async (req, res) => {
            try {
                const newBook = await Book.create(req.body);
                res.status(201).json(newBook);
            } catch (error) {
                if (error.name === 'ValidationError') {
                    const errors = {};
                    for (let field in error.errors) {
                        errors[field] = error.errors[field].message;
                    }
                    return res.status(400).json({ message: 'Validation Error', errors });
                }
                res.status(500).json({ message: 'Error creating book', error: error.message });
            }
        };
        
        // Async function to get all books
        exports.getAllBooks = async (req, res) => {
            try {
                const books = await Book.find({});
                res.status(200).json(books);
            } catch (error) {
                res.status(500).json({ message: 'Error fetching books', error: error.message });
            }
        };
        
        // ... (Similarly define getBookById, updateBook, deleteBook)
        
        // Example for getBookById
        exports.getBookById = async (req, res) => {
            try {
                const book = await Book.findById(req.params.id);
                if (!book) {
                    return res.status(404).json({ message: 'Book not found' });
                }
                res.status(200).json(book);
            } catch (error) {
                if (error.name === 'CastError') {
                    return res.status(400).json({ message: 'Invalid Book ID format' });
                }
                res.status(500).json({ message: 'Error fetching book', error: error.message });
            }
        };
        
        // Example for updateBook
        exports.updateBook = async (req, res) => {
            try {
                const updatedBook = await Book.findByIdAndUpdate(
                    req.params.id,
                    req.body,
                    { new: true, runValidators: true }
                );
                if (!updatedBook) {
                    return res.status(404).json({ message: 'Book not found' });
                }
                res.status(200).json(updatedBook);
            } catch (error) {
                if (error.name === 'CastError') {
                    return res.status(400).json({ message: 'Invalid Book ID format' });
                }
                if (error.name === 'ValidationError') {
                    const errors = {};
                    for (let field in error.errors) {
                        errors[field] = error.errors[field].message;
                    }
                    return res.status(400).json({ message: 'Validation Error', errors });
                }
                res.status(500).json({ message: 'Error updating book', error: error.message });
            }
        };
        
        // Example for deleteBook
        exports.deleteBook = async (req, res) => {
            try {
                const deletedBook = await Book.findByIdAndDelete(req.params.id);
                if (!deletedBook) {
                    return res.status(404).json({ message: 'Book not found' });
                }
                res.status(200).json({ message: 'Book deleted successfully', deletedBook });
            } catch (error) {
                if (error.name === 'CastError') {
                    return res.status(400).json({ message: 'Invalid Book ID format' });
                }
                res.status(500).json({ message: 'Error deleting book', error: error.message });
            }
        };
        ```
        *Notice the `exports.` prefix. This is shorthand for `module.exports.createBook = async (req, res) => {...};`*
        ```
        
        **3. Routes (`routes/book.routes.js`):**
        * You import `express` and the controller functions.
        * You define your routes using `router.METHOD()`.
        * You export the configured router.
        
        ```jsx
        // routes/book.routes.js
        const express = require('express');
        const router = express.Router();
        const bookController = require('../controllers/book.controller'); // Import controller functions
        
        // Define routes and map them to controller functions
        router.post('/', bookController.createBook);
        router.get('/', bookController.getAllBooks);
        router.get('/:id', bookController.getBookById);
        router.patch('/:id', bookController.updateBook); // Use patch for partial updates
        router.delete('/:id', bookController.deleteBook);
        
        module.exports = router; // Export the router
        ```
        
        **4. App Entry Point (`app.js`):**
        * Import necessary modules.
        * Import your configuration (e.g., database connection).
        * Import and mount your routers.
        
        ```jsx
        // app.js
        const express = require('express');
        const mongoose = require('mongoose');
        const bookRoutes = require('./routes/book.routes'); // Import the book router
        const app = express();
        
        // Connect to MongoDB
        dbConnect();
        
        // Middleware to parse JSON request bodies
        app.use(express.json());
        
        // Mount the book routes
        app.use('/api/books', bookRoutes);
        
        // Basic route for home
        app.get('/', (req, res) => {
            res.send('Welcome to the Book API!');
        });
        
        // Error handling middleware (optional but good practice for global errors)
        app.use((err, req, res, next) => {
            console.error(err.stack);
            res.status(500).send('Something broke!');
        });
        
        module.exports = app;
        ```
        
        1. `server.js` – **Server Entry Point**
        
        This file is responsible for:
        
        - Connecting to the database (MongoDB, etc.).
        - Importing the app from `app.js`.
        - Starting the server with `app.listen(...)`.
        
        ```jsx
        // server.js
        const app = require('./app');
        const mongoose = require('mongoose');
        const dbConnect = require('./config/db'); // Import DB connection function (create this in config/db.js)
        
        dbConnect().then(() => {
            console.log("MongoDB connected");
            app.listen(3000, () => {
              console.log("Server running on http://localhost:3000");
            });
          })
          .catch(err => console.error("MongoDB connection error:", err));
        
        ```
        
        **6. Database Configuration (`config/db.js`):**
        * This file will contain the logic to connect to your MongoDB database.
        
        ```jsx
        // config/db.js
        const mongoose = require('mongoose');
        
        const connectDB = async () => {
            try {
                const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/bookstore_mvc', {
                    useNewUrlParser: true,
                    useUnifiedTopology: true,
                    // These options are deprecated in newer Mongoose versions, but good to know
                    // useCreateIndex: true,
                    // useFindAndModify: false
                });
                console.log(`MongoDB Connected: ${conn.connection.host}`);
            } catch (error) {
                console.error(`Error: ${error.message}`);
                process.exit(1); // Exit process with failure
            }
        };
        
        module.exports = connectDB;
        ```
        
    
    ### 💻 Task:
    
    - Refactor the Book API using:
        - `book.model.js`
        - `book.controller.js`
        - `book.routes.js`
        
        Task completed in current branch(Day-Eleven)
        
    
    ### 🔁 Assignment:
    
    - Refactor your `User` CRUD API with the same MVC structure