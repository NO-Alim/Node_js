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
// don't want to run the server if the connection to the database fails
connect().then(() => {
    app.listen(port, () => {
        console.log(`Blog Post API listening at http://localhost:${port}`);
    });
}).catch((error) => {
    console.error('Error connecting to MongoDB:', error);
});