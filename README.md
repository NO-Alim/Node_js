# Node.js Learning Journey - Day 1: Introduction to Node.js & Environment Setup

## 🎯 Day's Objectives

Learn the fundamentals of Node.js and set up a development environment for our journey ahead.

## 📚 What is Node.js?

**Node.js** is an open-source, **JavaScript runtime environment** that allows you to run JavaScript code **outside of a web browser**.

- Traditionally, JavaScript was only used in browsers (like Chrome or Firefox) to make web pages interactive.
- Node.js takes JavaScript and lets it run on a **server** (back-end), meaning you can use JavaScript for both front-end (browser) and back-end (server) development.

### Key Features

✅ **Built on Chrome's V8 Engine** (the same engine that runs JavaScript in Chrome)
✅ **Event-driven & Non-blocking I/O** (handles multiple tasks efficiently)
✅ **Single-threaded but highly scalable** (uses asynchronous programming)

### Why Use Node.js?

#### A. JavaScript Everywhere
- Developers can use **one language (JavaScript)** for both front-end and back-end, making development smoother.

#### B. Fast & Scalable
- Node.js is **asynchronous** (non-blocking), meaning it can handle many requests at once without waiting for one to finish before starting another.

**Example:**
Imagine a restaurant:
- **Blocking (Traditional PHP/Java):** One waiter takes an order, waits for the kitchen to cook, and only then takes the next order.
- **Non-blocking (Node.js):** The waiter takes orders continuously, and the kitchen notifies when food is ready.

### When Should and Should Not You Use Node.js?

✔ **Perfect For:**
- Real-time apps (Chat apps, live notifications, gaming)
- APIs & Microservices (Fast, scalable back-end services)
- Streaming apps (Video/audio processing)
- Single-page applications (SPAs) (Like React/Angular apps)

❌ **Not Recommended For:**
- CPU-heavy tasks (like video encoding, complex calculations)
- Relational database-heavy apps (better handled by Java, C#, or Python with frameworks like Django)

## 🛠 Development Environment Setup

### 1. Install Node.js & npm

Node.js comes with **npm** (Node Package Manager), which helps install libraries.

#### Steps:
1. **Download Node.js** from the official site:
   🔗 [https://nodejs.org](https://nodejs.org/)
   - Choose the **LTS (Long-Term Support)** version for stability.
2. **Run the installer** (follow default settings).
3. **Verify Installation:**
   Open **Terminal (Mac/Linux) or Command Prompt (Windows)** and run:
   ```bash
   node --version
   npm --version
   ```
   You should see versions like:
   ```
   v23.12.0  (Node.js version)
   9.5.1     (npm version)
   ```

### 2. Choose a Code Editor

A good editor improves productivity. Popular choices:
- **Visual Studio Code (VS Code)** (Recommended) → [Download Here](https://code.visualstudio.com/)
- **Sublime Text** (Lightweight)

### 3. Initialize a Node.js Project

Every Node.js app should have a **`package.json`** file (stores project details & dependencies).

#### Steps:
1. **Create a Project Folder**
   ```bash
   mkdir my-node-app
   cd my-node-app
   ```

2. **Initialize `package.json`**
   ```bash
   npm init -y
   ```
   - This creates **`package.json`** with default settings.

### 4. Install Essential Packages

Some commonly used packages:

| **Package** | **Purpose** | **Install Command** |
| --- | --- | --- |
| **`express`** | Web framework for APIs & servers | **`npm install express`** |
| **`nodemon`** | Auto-restarts server on changes | **`npm install --save-dev nodemon`** |
| **`dotenv`** | Manage environment variables | **`npm install dotenv`** |

**Example:** Installing Express
```bash
npm install express
```
This adds **`express`** to **`package.json`** under **`dependencies`**.

### 5. Set Up a Basic Server

Let's create a simple HTTP server.

1. **Create `index.js`**
   ```javascript
   const http = require('http');
   
   const server = http.createServer((req, res) => {
       // hit the url http://localhost:3000 and see the response
       res.end('Hello World');
   });
   
   const PORT = process.env.PORT || 3000;
   
   server.listen(PORT, () => {
       console.log(`Server is running on port ${PORT}`);
   });
   ```

2. **Run the Server**
   ```bash
   node index.js
   ```
   Visit: [http://localhost:3000](http://localhost:3000/) → You'll see **`"Hello World"`**

### 6. Use Nodemon for Auto-Reloading

Manually restarting the server after every change is tedious. **Nodemon** fixes this.

1. **Install Nodemon** (if not installed):
   ```bash
   npm install --save-dev nodemon
   ```

2. **Update `package.json`**
   ```json
   "scripts": {
     "start": "node index.js",
     "dev": "nodemon index.js"
   }
   ```

3. **Run in Development Mode**
   ```bash
   npm run dev
   ```
   Now, any change in **`index.js`** will **auto-restart** the server.

### 7. Use Environment Variables (`.env`)

Sensitive data (like API keys) should not be hardcoded. Use **`dotenv`**.

1. **Install `dotenv`**
   ```bash
   npm install dotenv
   ```

2. **Create `.env` File**
   ```
   PORT=3000
   API_KEY=your_secret_key_here
   ```

3. **Modify `index.js`**
   ```javascript
   require('dotenv').config();
   const PORT = process.env.PORT || 3000; // Fallback to 3000 if .env missing
   ```
   Now, **`PORT`** is securely loaded from **`.env`**.

⚠ **Never commit `.env` to GitHub!** Add it to **`.gitignore`**.

### 8. Version Control (Git)

Always use Git to track changes.

1. **Initialize Git**
   ```bash
   git init
   ```

2. **Create `.gitignore`**
   ```
   node_modules/
   .env
   ```

3. **Commit Changes**
   ```bash
   git add .
   git commit -m "Initial Node.js setup"
   ```

## 📝 Today's Key Learnings
- What is Node.js (V8, single-threaded, non-blocking)
- Use cases of Node.js
- Install Node.js & npm
- Use `node`, `npm`, `npx` from the terminal
- Initialize a project with `npm init`
- Create a basic HTTP server
- Work with environment variables
- Set up development workflow with nodemon