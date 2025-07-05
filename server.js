const express = require('express');
const path = require('path')

const port = 3000;
const app = express();


// This build in middleware is used to parse the body of the request
app.use(express.json())



// Task
// serve a static page from the public folder
// build in middleware static, this serves static files from the public folder
app.use(express.static(path.join(__dirname, 'public')));


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

app.get('/static-page', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'static-ex.html'))
})


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})