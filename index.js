// assignment: Enhance the server to read content from a .json file and return it via /data route

const http = require('http');
// load the environment variables from the .env file
require('dotenv').config();
const { readFile } = require('./assignmentSoluation');

// create a server
// use async await to read the file
const server = http.createServer(async (req, res) => {
    if (req.url === '/') {
        // Returns Hello World on /
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('Hello World');
    } else if (req.url === '/data') {
        try {
            const data = await readFile();
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(data));
        } catch (error) {
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Internal Server Error');
        }
    } else {
        // Returns 404 on unknown routes
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 Not Found');
    }
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});