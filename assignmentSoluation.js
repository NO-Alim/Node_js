// assignment: Write a script that fetches data from a local file and returns only unique lines

const fs = require('fs/promises');

const filename = 'fruits.txt';

const readFruits = async() => {
    try {
        const data = await fs.readFile(filename, 'utf-8');
        // split the data into lines
        const lines = data.split('\n');
        // remove the empty lines
        const filteredLines = lines.filter(line => line.trim() !== '');
        // remove the duplicate lines   
        const uniqueLines = [...new Set(lines)]
        console.log(uniqueLines);
    } catch (error) {
        console.error(`Error reading file ${filename}:`, error);
    }
}

module.exports = {
    readFruits
}