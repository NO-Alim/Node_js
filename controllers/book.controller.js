
const Book = require('../models/Book.model');
const AppError = require('../utils/AppError');

// create a new book
exports.createBook = async (req, res, next) => {
    try {
        const book =  req.body;
    if(!book.title || !book.author || !book.publishedYear) {
        return next(new AppError('Missing Required Fields'))
    }
    const newBook = new Book(book);
    await newBook.save();
    res.status(201).send(newBook);
    } catch (error) {
        if (error.name === 'ValidationError') {
            return next( new AppError('Validation Failed.', 400))
          }
        next(error)
    }
}

// get all books
exports.getAllBooks = async (req, res, next) => {
        try {
        const books = await Book.find();
        res.json(books);
    } catch (error) {
        return next(new AppError('Failed to fech books', 500))
    }
}

// get a book by id
exports.getBookById = async (req, res, next) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) {
            return next(new AppError('Book not Found', 404))
        }
        res.json(book);
    } catch (error) {
        next(error);
    }
}

// update a book
exports.updateBook = async (req, res, next) => {
    try {
        const book = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!book) {
            return next(new AppError('Book not Found', 404))
        }
        res.json(book);
    } catch (error) {
        if (error.name === 'ValidationError') {
            return next( new AppError('Validation Failed.', 400))
          }
        next(error)
    }
}

// delete a book
exports.deleteBook = async (req, res, next) => {
    try {
        const book = await Book.findByIdAndDelete(req.params.id);
        if (!book) {
            return next(new AppError('Book Not Found', 404))
        }
        res.json({ message: 'Book deleted successfully' });
    } catch (error) {
        next(error)
    }
}