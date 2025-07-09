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