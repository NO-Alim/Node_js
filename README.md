- ✅ **Day 10: CRUD with Mongoose Models**
    
    ### 🎯 Objective:
    
    - Perform full CRUD operations on MongoDB using Mongoose.
    
    ### 📚 Topics:
    
    - `Model.find()`, `Model.findById()`, `Model.create()`
        - `Model.find()`, `Model.findById()`, `Model.create()`
            
            These methods are used to retrieve documents from your collection.
            
            `Model.find()` is used to query for multiple documents that match specific criteria. If you pass an empty object `{}`, it will return all documents in the collection.
            
            `Model.findById()` is a shorthand for `Model.findOne({ _id: id })`. It's very commonly used to retrieve a specific document when you know its unique MongoDB `_id`.
            
            The `Model.create()` method is used to create one or more new documents in your MongoDB collection. It's a convenient way to insert data based on your model's schema.
            
        - `document.save()`, `Model.updateOne()`, `Model.updateMany()`, `Model.deleteOne()`, `Model.deleteMany()`
            
            These methods are used to modify or remove documents from your collection.
            
            `document.save()` is used to save changes to an existing document that you've retrieved and modified. You must call this on an actual document instance.
            
            `Model.updateOne()` updates a single document that matches the filter criteria. It takes two arguments: a filter object and an update object with `$set` or other update operators.
            
            `Model.updateMany()` works similarly but updates all documents that match the filter criteria.
            
            `Model.deleteOne()` removes a single document that matches the filter criteria. For deleting by ID, you can use `Model.findByIdAndDelete()` as a convenient alternative.
            
            `Model.deleteMany()` removes all documents that match the filter criteria. Be careful with this as passing an empty object `{}` will delete all documents in the collection.
            
            Example usage:
            
            ```jsx
            // Save changes to an existing document
            const user = await User.findById(userId);
            user.name = 'Updated Name';
            await user.save();
            
            // Update operations
            await User.updateOne({ _id: userId }, { $set: { status: 'active' } });
            await User.updateMany({ status: 'inactive' }, { $set: { archived: true } });
            
            // Delete operations
            await User.deleteOne({ _id: userId });
            await User.deleteMany({ status: 'expired' });
            ```
            
    - Validation errors & error handling
        
        Error handling is critical for any robust API. Mongoose provides built-in validation, and when these validations fail, Mongoose throws a `ValidationError`.
        
        **Common Error Types:**
        
        - **`ValidationError`**: Occurs when data doesn't conform to your schema definitions (e.g., `required: true` field is missing, a number is outside `min`/`max` range, or a custom validator fails).
        - **`CastError`**: Occurs when Mongoose tries to cast a value to a different type and fails (e.g., trying to find a document by an `_id` that is not a valid MongoDB ObjectId format).
        - **Duplicate Key Error (Code 11000)**: If you have a unique index on a field and try to insert a document with an existing value for that field.
        
        **How to Handle Them:**
        
        Always wrap your Mongoose operations in `try...catch` blocks. Inside the `catch` block, you can inspect the `error` object.
        
        ```jsx
        // General Error Handling Pattern
        try {
            // Mongoose operation
        } catch (error) {
            if (error.name === 'ValidationError') {
                // Handle Mongoose Validation Errors
                const errors = {};
                for (let field in error.errors) {
                    errors[field] = error.errors[field].message;
                }
                return res.status(400).json({ message: 'Validation Error', errors });
            } else if (error.name === 'CastError') {
                // Handle invalid ID formats
                return res.status(400).json({ message: 'Invalid ID format' });
            } else if (error.code === 11000) {
                // Handle duplicate key errors (e.g., if you had a unique index on 'title')
                return res.status(409).json({ message: 'Duplicate entry', field: Object.keys(error.keyValue)[0] });
            } else {
                // Handle other unexpected errors
                console.error('Unhandled error:', error);
                return res.status(500).json({ message: 'Internal Server Error', error: error.message });
            }
        }
        ```
        
    
    ### 💻 Task:
    
    - Complete full CRUD API for `Book` model
        
        server.js
        
        ```jsx
        const express = require('express');
        const app = express();
        const port = 3000;
        
        const { connect } = require('./services/mongo');
        const Book = require('./models/Book');
        
        app.use(express.json());
        
        // get all books
        app.get('/books', async (req, res) => {
            try {
                const books = await Book.find();
                res.json(books);
            } catch (error) {
                res.status(500).json({ error: 'Failed to fetch books', details: error.message });
            }
        })
        
        // Get a book by id
        app.get('/books/:id', async (req, res) => {
            try {
                const book = await Book.findById(req.params.id);
                if (!book) {
                    return res.status(404).json({ error: 'Book not found' });
                }
                res.json(book);
            } catch (error) {
                res.status(500).json({ error: 'Failed to fetch book', details: error.message });
            }
        })
        
        // Create a new book
        app.post('/books', async(req, res) => {
            try {
                const book =  req.body;
            if(!book.title || !book.author || !book.publishedYear) {    
                return res.status(400).send({error: 'Missing required fields'});
            }
            const newBook = new Book(book);
            await newBook.save();
            res.status(201).send(newBook);
            } catch (error) {
                if (error.name === 'ValidationError') {
                    return res.status(400).json({ error: 'Validation failed', details: error.message });
                  }
                  res.status(500).json({ error: 'Failed to create book', details: error.message });
                }
        })
        
        // Update a book
        app.put('/books/:id', async (req, res) => {
            try {
                const book = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
                if (!book) {
                    return res.status(404).json({ error: 'Book not found' });
                }
                res.json(book);
            } catch (error) {
                res.status(500).json({ error: 'Failed to update book', details: error.message });
            }
        })
        
        // Delete a book
        app.delete('/books/:id', async (req, res) => {
            try {
                const book = await Book.findByIdAndDelete(req.params.id);
                if (!book) {
                    return res.status(404).json({ error: 'Book not found' });
                }
                res.json({ message: 'Book deleted successfully' });
            } catch (error) {
                res.status(500).json({ error: 'Failed to delete book', details: error.message });
            }
        })
        
        connect().then(() => {
            app.listen(port, () => {
                console.log(`Blog Post API listening at http://localhost:${port}`);
            });
        }).catch((error) => {
            console.error('Error connecting to MongoDB:', error);
        });
        ```
        
        models/Book.js
        
        ```jsx
        // models/Book.js
        const mongoose = require('mongoose');
        
        const bookSchema = new mongoose.Schema({
            title: {
                type: String,
                required: true,
                trim: true // Removes whitespace from both ends of a string
            },
            author: {
                type: String,
                required: true,
                trim: true
            },
            
            publishedYear: {
                type: Number,
                min: 1000, // Example of a validator: minimum year
                max: new Date().getFullYear() // Example of a validator: maximum year is current year
            }
        }, {
            timestamps: true // Adds createdAt and updatedAt timestamps
        });
        
        const Book = mongoose.model('Book', bookSchema);
        
        module.exports = Book;
        ```
        
    
    ### 🔁 Assignment:
    
    - Build a `User` CRUD API with proper error handling