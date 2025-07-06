const express = require('express');
const fs = require('fs/promises');
const path = require('path');

const port = process.env.PORT || 3000;

const app = express();

const DATA_FILE = path.join(__dirname, 'data', 'books.json')
let books = [];
let nextBookId = 1;


// middleware to parse json
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
// Custom middleware: Logger
app.use((req, res, next) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${req.method} ${req.url}`);
    next();
});

async function loadBooks() {
    try {
        const data = await fs.readFile(DATA_FILE, 'utf-8')
        books = JSON.parse(data);

        if (books.length > 0) {
            const maxId = Math.max(...books.map(book => parseInt(book.id) || 0));
            nextBookId = maxId + 1;
        } else{
            nextBookId = 1;
        }
    } catch (error) {
        if (error.code === 'ENOENT') {
            console.warn('books.json not found. Starting with an empty book list.');
            books = [];
            nextBookId = 1;
        } else {
            console.log(`Error loading books:`, error);
            
            books = [];
            nextBookId = 1;
        }
    }
}

async function saveBooks(prams) {
    try {
        await fs.writeFile(DATA_FILE, JSON.stringify(books, null, 2), 'utf-8');
        console.log('Books saved successfully to books.json');
    } catch (error) {
        console.error('Error saving books:', error);
    }
}

app.get('/', (req, res) => {
    res.send('hello world')
});

// get all boooks 
app.get('/books', (req, res) => {
    res.json(books)
})

// create a new book
app.post('/books', async ( req, res) => {
    const { title, author, year } = req.body; 
    // Basic validation
    if (!title || !author) {
        return res.status(400).json({ message: 'Title and Author are required.' });
    }

    // create a new book

    const newBook = {
        id: String(nextBookId++),
        title,
        author,
        year: year ? Number(year) : undefined
    }

    books.push(newBook);
    await saveBooks();

    res.status(201).json(newBook);
})


// get single book
app.get('/books/:id', (req, res) => {
    const bookId = req.params.id;

    const book = books.find(b => b.id === bookId);
    if (book) {
        res.json(book);
    } else{
        res.status(404).json({message: 'Book not found'});
    }
});

//delete book 
app.delete('/books/:id', async(req, res) => {
    const bookId = req.params.id;
    const initialLength = books.length;

    books = books.filter(book => book.id !== bookId);

    if (books.length < initialLength) {
        await saveBooks(); // Persist the updated book list to file
        // 204 No Content is standard for successful DELETE with no response body
        res.status(204).send();
    } else {
        // If no book was removed, it means the ID was not found
        res.status(404).json({ message: `Book with ID ${bookId} not found.` });
    }
})



app.listen(port, async () => {
    await loadBooks();
    console.log(`server is running on port ${port}`);
})