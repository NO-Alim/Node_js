# Node.js Learning Journey - Day 2: Module System & File Operations

## 🎯 Day's Objectives
- Understanding Node.js Module System (CommonJS)
- Working with Core Modules
- Building a CLI Tool

## 📚 Node.js Module System (CommonJS)

In Node.js, every file is treated as a **module**. You can export functions, variables, or objects from one file and import them into another using `require`.

### Why Modules?
- **Organization**: Break code into logical units
- **Reusability**: Write once, use many times
- **Namespace isolation**: Avoid naming collisions
- **Maintainability**: Easier to debug and update

### 1. Module Exports and Require

#### Example: Math Operations Module
```javascript
// math.js
function add(a, b) {
    return a + b;
}

function subtract(a, b) {
    return a - b;
}

function multiply(a, b) {
    return a * b;
}

module.exports = {
    add,
    subtract,
    multiply
};
```

#### Using the Module
```javascript
// index.js
const { add, subtract, multiply } = require('./math');

console.log('Addition:', add(5, 3));      // Output: 8
console.log('Subtraction:', subtract(5, 3)); // Output: 2
console.log('Multiplication:', multiply(5, 3)); // Output: 15
```

### 2. Core Modules

Node.js comes with several built-in modules. Here are some essential ones:

#### A. File System (`fs`)
```javascript
const fs = require('fs');

// Async read
fs.readFile('note.txt', 'utf8', (err, data) => {
    if (err) return console.error(err);
    console.log(data);
});

// Sync read
const data = fs.readFileSync('note.txt', 'utf8');
console.log(data);
```

#### B. Path (`path`)
```javascript
const path = require('path');

// Join paths safely across operating systems
const filePath = path.join(__dirname, 'files', 'note.txt');
console.log(filePath);

// Get file extension
console.log(path.extname('file.txt')); // Output: .txt
```

#### C. Operating System (`os`)
```javascript
const os = require('os');

console.log('Platform:', os.platform());
console.log('Home Directory:', os.homedir());
console.log('Free Memory:', os.freemem() / 1024 / 1024, 'MB');
```

## 🛠️ Practical Project: Word Counter CLI

Let's build a command-line tool that counts words in a text file.

### Project Structure
```
project/
├── wordcounter.js
└── sample.txt
```

### Implementation

```javascript
const fs = require('fs');
const path = require('path');

// Check if file path is provided
if (process.argv.length < 3) {
    console.error('Please provide a file path');
    process.exit(1);
}

// Get file path from command line args
const filePath = path.join(__dirname, process.argv[2]);

// Read and process file
fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
        console.error('Error:', err.message);
        process.exit(1);
    }

    const words = data.trim().split(/\s+/);
    console.log(`Word Count: ${words.length}`);
});
```

### How to Run
```bash
node wordcounter.js sample.txt
```

## 📝 Today's Key Learnings
- Module system in Node.js (CommonJS)
- Creating and using custom modules
- Working with core modules (`fs`, `path`, `os`)
- Building a CLI tool
- Handling command-line arguments
- Asynchronous file operations

## 🎯 Practice Exercises
1. Enhance the word counter to also count:
   - Characters (excluding spaces)
   - Lines
   - Paragraphs
2. Create a module that provides different text analysis functions
3. Add error handling for non-existent files

## 📚 Additional Resources
- [Node.js Documentation - Modules](https://nodejs.org/api/modules.html)
- [Node.js Documentation - File System](https://nodejs.org/api/fs.html)
- [Node.js Documentation - Path](https://nodejs.org/api/path.html)