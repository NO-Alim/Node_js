const http = require('http');
// load the environment variables from the .env file
require('dotenv').config();


const server = http.createServer((req, res) => {
    // hit the url http://localhost:3000 and see the response
    res.end('Hello World');
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});