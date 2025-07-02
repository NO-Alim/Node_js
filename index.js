const http = require('http');
// load the environment variables from the .env file
require('dotenv').config();

// fs/promises is a newer way to handle file operations
const fs = require('fs/promises');
// fs is the older way to handle file operations
const fsWithoutPromises = require('fs');
const {readFruits} = require('./assignmentSoluation');

// file operation using fs/promises
const fileOperation = async () => {
    const filename = 'data.txt';
    const data = 'Hello World';
    const additionalData = 'Additional Data';

    try {
        await fs.writeFile(filename, data)
        console.log(`File ${filename} created successfully`);

        await fs.appendFile(filename, additionalData);
        console.log(`Additional data appended to ${filename}`);
    } catch (error) {
        console.error(`Error creating file ${filename}:`, error);
    }
}

// read file
const readFile = async () => {
    const filename = 'sample.txt';
    const data = await fs.readFile(filename, 'utf-8')
    console.log(data);
}

// read file without promises
const readFileWithoutPromises = () => {
    const filename = 'sample.txt';
    fsWithoutPromises.readFile(filename, 'utf-8', (err, data) => {
        if (err) {
            console.error(`Error reading file ${filename}:`, err);
            return;
        }
        console.log(data);
    })
}


// file operation without promises
const fileOperationWithoutPromises = () => {
    const filename = 'doc.txt';
    const data = 'hello world';
    const additionalData = 'Additional Data';

    try {
        fsWithoutPromises.writeFile(filename, data, (err) => {
            if (err) {
                console.error(`Error creating file ${filename}:`, err);
                return;
            }
            console.log(`File ${filename} created successfully`);
        });

        fsWithoutPromises.appendFile(filename, additionalData, (err) => {
            if (err) {
                console.error(`Error appending to file ${filename}:`, err);
                return;
            }
            console.log(`Additional data appended to ${filename}`);
        });
    } catch (error) {
        console.error(`Error creating file ${filename}:`, error);
    }
}

// create a server
const server = http.createServer((req, res) => {
    res.end('Hello World');
});

// call the file operation functions with promises
fileOperation();
// call the file operation without promises function
fileOperationWithoutPromises();
// call the read file function
readFile()
// call the read file without promises function
readFileWithoutPromises()
// assignment solution
readFruits();

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});