const express = require('express');
const app = express();
const port = 3000;

const { connect } = require('./services/mongo');

connect();

app.listen(port, () => {
    console.log(`Blog Post API listening at http://localhost:${port}`);
});