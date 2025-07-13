const express = require('express');
const bookRoutes = require('./routes/book.routes');
const errorHandler = require('./middlewares/errorHandler');

const app = express();
app.use(express.json());

app.use('/api/books', bookRoutes);

// use this middleware to handle errors and use it after all the routes
app.use(errorHandler)

module.exports = app;
