const Book = require('../models/Book.model');

// create a new book
exports.createBook = async (req, res) => {
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
}

// get all books
exports.getAllBooks = async (req, res) => {
        try {
        const books = await Book.find();
        res.json(books);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch books', details: error.message });
    }
}

// get a book by id
exports.getBookById = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) {
            return res.status(404).json({ error: 'Book not found' });
        }
        res.json(book);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch book', details: error.message });
    }
}

// update a book
exports.updateBook = async (req, res) => {
    try {
        const book = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!book) {
            return res.status(404).json({ error: 'Book not found' });
        }
        res.json(book);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update book', details: error.message });
    }
}

// delete a book
exports.deleteBook = async (req, res) => {
    try {
        const book = await Book.findByIdAndDelete(req.params.id);
        if (!book) {
            return res.status(404).json({ error: 'Book not found' });
        }
        res.json({ message: 'Book deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete book', details: error.message });
    }
}