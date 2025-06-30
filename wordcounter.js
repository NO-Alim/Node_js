const http = require('http');
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const server = http.createServer((req, res) => {
    res.end('Hello World');
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
// Get file path from command line args
const filePath = path.join(__dirname, process.argv[2]);

fs.readFile(filePath, 'utf8', (err, data) => {
  if (err) return console.error('Error:', err.message);

  const words = data.trim().split(/\s+/); // split by whitespace
  console.log(`Word Count: ${words.length}`);
});
});