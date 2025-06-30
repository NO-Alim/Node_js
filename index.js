const http = require('http');
// load the environment variables from the .env file
require('dotenv').config();
const { add, subtract, multiply } = require('./math');

const server = http.createServer((req, res) => {
    res.end('Hello World');
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log('The addition result is: ', add(1, 2));
    console.log('The subtraction result is: ', subtract(1, 2));
    console.log('The multiplication result is: ', multiply(1, 2));
});