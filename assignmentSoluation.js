const fs = require('fs').promises;

// Read the JSON file and return its contents
const readFile = async () => {
    try {
        const data = await fs.readFile('data.json', 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading file:', error);
        throw error;
    }
}

module.exports = {
    readFile
}; 