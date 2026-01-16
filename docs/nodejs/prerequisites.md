# Prerequisites & Setup - Complete Preparation Guide

Node.js শেখার যাত্রায় স্বাগতম! এই comprehensive guide এ আমরা শিখব Node.js কি, কেন শিখব, কিভাবে setup করব, এবং development এর জন্য কি কি tools প্রয়োজন।

## Table of Contents

1. **What is Node.js?** - Complete understanding
2. **Why Learn Node.js?** - Career & benefits
3. **Node.js Use Cases** - Real-world applications
4. **Node.js vs Browser** - Key differences
5. **V8 Engine** - How it works
6. **Node.js Architecture** - Internal workings
7. **Terminal Basics** - Command line fundamentals
8. **Git Basics** - Version control
9. **VS Code Setup** - IDE configuration
10. **Node.js Installation** - Multiple methods
11. **Hello World** - First program
12. **REPL** - Interactive shell
13. **Project Structure** - Best practices
14. **Troubleshooting** - Common issues
15. **Next Steps** - Learning path

---

## ১. What is Node.js? - Complete Understanding

### Simple Definition

**Node.js = JavaScript Runtime built on Chrome's V8 Engine**

```
Node.js is NOT:
❌ A programming language
❌ A framework
❌ A library
❌ A database

Node.js IS:
✅ A JavaScript runtime environment
✅ A platform to run JavaScript outside browser
✅ Built on V8 engine (same as Chrome)
✅ Event-driven, non-blocking I/O
✅ Single-threaded but highly scalable
```

### Technical Definition

Node.js হলো একটি **server-side JavaScript runtime environment** যা:
- Chrome এর **V8 JavaScript engine** এ built
- **Event-driven, non-blocking I/O model** ব্যবহার করে
- **Cross-platform** (Windows, Mac, Linux)
- **Open-source** (MIT license)
- **Package ecosystem** (npm - largest software registry)

### History

```
2009 - Created by Ryan Dahl
2010 - npm released
2011 - Windows support added
2015 - io.js merged back
2019 - Node.js 12 (LTS)
2020 - Node.js 14 (LTS)
2021 - Node.js 16 (LTS)
2022 - Node.js 18 (LTS)
2023 - Node.js 20 (LTS)
2024 - Node.js 22 (LTS)
2026 - Node.js 24 (Current)
```

### Key Features

1. **Asynchronous & Event-Driven**
   - Non-blocking I/O operations
   - Handles concurrent connections efficiently
   - Perfect for I/O intensive applications

2. **Fast Execution**
   - Built on V8 engine
   - JIT compilation
   - Optimized performance

3. **Single-Threaded but Scalable**
   - Event loop mechanism
   - Can handle thousands of connections
   - Low memory footprint

4. **Cross-Platform**
   - Write once, run anywhere
   - Same code on Windows, Mac, Linux

5. **Rich Ecosystem**
   - 2.5+ million packages on npm
   - Largest software registry
   - Active community

---

## ২. Why Learn Node.js? - Career & Benefits

### Career Opportunities

```
Node.js Developer Average Salary (2026):
🇺🇸 USA: $120,000 - $180,000/year
🇬🇧 UK: £50,000 - £80,000/year
🇨🇦 Canada: C$90,000 - C$140,000/year
🇮🇳 India: ₹8,00,000 - ₹20,00,000/year
🇧🇩 Bangladesh: ৳6,00,000 - ৳15,00,000/year

Remote Opportunities: Abundant
Freelancing: High demand
Startup Jobs: Very popular
```

### Market Demand

```
Companies Using Node.js:
✅ Netflix (streaming)
✅ LinkedIn (social network)
✅ Uber (ride-sharing)
✅ PayPal (payments)
✅ NASA (space)
✅ Medium (blogging)
✅ Trello (project management)
✅ Walmart (e-commerce)
✅ eBay (marketplace)
✅ Twitter (social media)
```

### Benefits of Learning Node.js

**1. JavaScript Everywhere**
```javascript
// Same language for frontend & backend
// Frontend (React)
const user = { name: 'John' };

// Backend (Node.js)
const user = { name: 'John' };
```

**2. Full-Stack Development**
```
Frontend: React/Vue/Angular
Backend: Node.js/Express
Database: MongoDB/PostgreSQL
Mobile: React Native

One language for everything! 🚀
```

**3. High Performance**
- Fast execution (V8 engine)
- Non-blocking I/O
- Handles concurrent requests efficiently
- Low latency

**4. Large Ecosystem**
- 2.5+ million npm packages
- Ready-made solutions
- Active community
- Frequent updates

**5. Easy to Learn**
- If you know JavaScript, you're halfway there
- Similar syntax to frontend JS
- Lots of tutorials & resources
- Beginner-friendly

---

## ৩. Node.js Use Cases - Real-World Applications

### ✅ Perfect For:

**1. RESTful APIs & Microservices**
```javascript
// Fast, scalable API development
const express = require('express');
const app = express();

app.get('/api/users', (req, res) => {
    res.json({ users: [...] });
});
```

**2. Real-Time Applications**
```javascript
// Chat apps, live notifications, collaboration tools
const io = require('socket.io')(server);

io.on('connection', (socket) => {
    socket.on('message', (msg) => {
        io.emit('message', msg);
    });
});
```

**3. Single Page Applications (SPAs)**
- Serve frontend frameworks (React, Vue, Angular)
- API backend for SPAs
- Server-side rendering (SSR)

**4. Streaming Applications**
- Video streaming (Netflix)
- Audio streaming (Spotify)
- File uploads/downloads
- Data processing

**5. Command-Line Tools**
```javascript
// Build CLI tools with Node.js
#!/usr/bin/env node
console.log('My awesome CLI tool');
```

**6. IoT Applications**
- Lightweight
- Event-driven
- Perfect for IoT devices
- Low resource usage

**7. Serverless Functions**
```javascript
// AWS Lambda, Vercel, Netlify
exports.handler = async (event) => {
    return { statusCode: 200, body: 'Hello' };
};
```

### ❌ Not Ideal For:

**1. CPU-Intensive Tasks**
```
❌ Video encoding
❌ Image processing
❌ Machine learning
❌ Heavy computations

Reason: Single-threaded nature
Solution: Use Worker Threads or separate services
```

**2. Relational Database Heavy Operations**
```
❌ Complex SQL joins
❌ Transactions-heavy apps

Better: Use with NoSQL (MongoDB)
Or: Use ORM (Sequelize, TypeORM)
```

---

## ৪. Node.js vs Browser JavaScript - Key Differences

### Environment Comparison

```javascript
// Browser JavaScript
window.alert('Hello');          // ✅ Works
document.getElementById('id');   // ✅ Works
localStorage.setItem('key', 'value'); // ✅ Works
fetch('https://api.example.com'); // ✅ Works

// Node.js
window.alert('Hello');          // ❌ Error: window is not defined
document.getElementById('id');   // ❌ Error: document is not defined
localStorage.setItem('key', 'value'); // ❌ Error: localStorage is not defined
fs.readFile('file.txt');        // ✅ Works (Node.js only)
```

### Complete Comparison Table

| Feature | Browser | Node.js |
|---------|---------|---------|
| **Environment** | Client-side | Server-side |
| **DOM Access** | ✅ Yes (`document`, `window`) | ❌ No DOM |
| **File System** | ❌ Limited/No access | ✅ Full access (`fs` module) |
| **Global Object** | `window` | `global` |
| **This (global)** | `window` | `global` or `undefined` |
| **Modules** | ES Modules (`import/export`) | CommonJS (`require`) + ES Modules |
| **APIs** | Browser APIs (fetch, localStorage) | Node APIs (fs, http, crypto) |
| **Process Control** | ❌ No | ✅ Yes (`process` object) |
| **Network** | Fetch API, XMLHttpRequest | `http`, `https`, `net` modules |
| **Console** | Browser console | Terminal/Command line |
| **Event Loop** | Browser event loop | Node.js event loop (libuv) |
| **Threading** | Web Workers | Worker Threads, Child Processes |
| **Version Control** | ❌ User's browser | ✅ You control version |

### Code Examples

```javascript
// Browser-only features
window.location.href            // Current URL
navigator.userAgent             // Browser info
localStorage.setItem()          // Local storage
document.querySelector()        // DOM selection
alert(), confirm(), prompt()   // Dialogs

// Node.js-only features
require('fs')                   // File system
require('http')                 // HTTP server
process.env                     // Environment variables
process.argv                    // Command line arguments
__dirname, __filename          // Path info
```

---

## ৫. V8 Engine - How It Works

### What is V8?

```
V8 Engine:
- Created by Google (2008)
- Written in C++
- Powers Chrome & Node.js
- Open-source
- Extremely fast
```

### How V8 Executes JavaScript

```
JavaScript Code
      ↓
   Parser (Syntax check)
      ↓
   AST (Abstract Syntax Tree)
      ↓
   Interpreter (Ignition)
      ↓
   Bytecode
      ↓
   Compiler (TurboFan) ← Hot code optimization
      ↓
   Optimized Machine Code
      ↓
   CPU Execution
```

### JIT Compilation

```javascript
// Traditional Interpretation (Slow)
function add(a, b) {
    return a + b;
}
// Interprets line by line every time

// JIT Compilation (Fast)
function add(a, b) {
    return a + b;
}
// First call: Interprets
// Frequently called: Compiles to machine code
// Subsequent calls: Executes machine code directly
```

### V8 Optimization

```javascript
// V8 optimizes hot functions
function hotFunction(x) {
    return x * 2;
}

// Called many times
for (let i = 0; i < 1000000; i++) {
    hotFunction(i);  // V8 optimizes this!
}
```

### Memory Management

```javascript
// Automatic Garbage Collection
let obj = { data: 'large data' };
obj = null;  // Old object marked for garbage collection

// V8 automatically frees unused memory
// No manual memory management needed
```

---

## ৬. Node.js Architecture - Internal Workings

### Architecture Diagram

```
┌─────────────────────────────────────────┐
│      JavaScript Application Code        │
├─────────────────────────────────────────┤
│         Node.js Core Library            │
│    (JavaScript + C++ Bindings)          │
├─────────────────────────────────────────┤
│     V8 Engine          │     libuv      │
│  (JavaScript Engine)   │  (Event Loop)  │
├────────────────────────┴────────────────┤
│           Operating System              │
│      (Windows, Linux, macOS)            │
└─────────────────────────────────────────┘
```

### Key Components

**1. V8 Engine**
- Executes JavaScript
- JIT compilation
- Memory management
- Garbage collection

**2. libuv**
- Written in C
- Event loop implementation
- Async I/O operations
- Thread pool management
- Cross-platform abstraction

**3. Node.js Bindings**
- Bridge between JS and C++
- Expose system functionality
- Native modules

**4. Node.js Standard Library**
- fs (File System)
- http (HTTP Server)
- crypto (Cryptography)
- stream (Streams)
- And many more...

---

## ৭. Terminal Basics - Command Line Fundamentals

### Why Learn Terminal?

```
Node.js Development requires:
✅ Running scripts
✅ Installing packages
✅ Git operations
✅ Server management
✅ Debugging
✅ Deployment
```

### Opening Terminal

```
Windows:
- Command Prompt (cmd)
- PowerShell
- Git Bash
- Windows Terminal (recommended)

Mac:
- Terminal (built-in)
- iTerm2 (recommended)

Linux:
- Terminal (built-in)
- Gnome Terminal
- Konsole
```

### Essential Commands

```bash
# Navigation
pwd                  # Print working directory
ls                   # List files (Mac/Linux)
dir                  # List files (Windows)
cd folder            # Change directory
cd ..                # Go up one level
cd ~                 # Go to home directory

# File Operations
mkdir folder         # Create directory
touch file.txt       # Create file (Mac/Linux)
echo. > file.txt     # Create file (Windows)
rm file.txt          # Delete file
rm -rf folder        # Delete folder
cp source dest       # Copy file
mv source dest       # Move/rename file

# View Files
cat file.txt         # View file content (Mac/Linux)
type file.txt        # View file content (Windows)
less file.txt        # View file with pagination
head file.txt        # First 10 lines
tail file.txt        # Last 10 lines

# Node.js Specific
node file.js         # Run JavaScript file
node                 # Start REPL
npm install          # Install packages
npm start            # Run start script
npm run dev          # Run dev script

# Git Commands
git init             # Initialize repo
git status           # Check status
git add .            # Stage all files
git commit -m "msg"  # Commit changes
git push             # Push to remote
git pull             # Pull from remote

# System
clear                # Clear terminal
exit                 # Exit terminal
whoami               # Current user
date                 # Current date/time
```

### Terminal Shortcuts

```bash
# Windows/Mac/Linux
Ctrl + C             # Cancel/Stop current command
Ctrl + D             # Exit (like 'exit')
Ctrl + L             # Clear screen (like 'clear')
Ctrl + A             # Move to start of line
Ctrl + E             # Move to end of line
Ctrl + U             # Delete line
Ctrl + K             # Delete to end of line

# Tab                # Auto-complete
# ↑/↓ Arrow         # Previous/Next command
```

---

## ৮. Git Basics - Version Control

### Why Git?

```
Version Control Benefits:
✅ Track changes over time
✅ Collaborate with team
✅ Backup code
✅ Rollback to previous versions
✅ Branch for features
✅ Industry standard
```

### Git Installation

```bash
# Check if Git is installed
git --version

# Windows
# Download from: https://git-scm.com/download/win

# Mac
brew install git

# Linux (Ubuntu/Debian)
sudo apt-get install git
```

### Basic Git Workflow

```bash
# 1. Configure Git (first time only)
git config --global user.name "Your Name"
git config --global user.email "you@example.com"

# 2. Initialize repository
git init

# 3. Check status
git status

# 4. Stage files
git add .              # Stage all files
git add file.js        # Stage specific file

# 5. Commit
git commit -m "Initial commit"

# 6. Connect to remote (GitHub)
git remote add origin https://github.com/username/repo.git

# 7. Push
git push -u origin main
```

### .gitignore File

```bash
# Create .gitignore file
touch .gitignore

# Add patterns to ignore
node_modules/
.env
*.log
dist/
build/
.DS_Store
```

---

## ৯. VS Code Setup - IDE Configuration

### Why VS Code?

```
Advantages:
✅ Free & open-source
✅ Lightweight & fast
✅ Built-in terminal
✅ Git integration
✅ IntelliSense (auto-complete)
✅ Debugging support
✅ Extensions ecosystem
✅ Cross-platform
```

### Installation

1. Download: [https://code.visualstudio.com/](https://code.visualstudio.com/)
2. Install for your OS
3. Launch VS Code

### Essential Extensions

```
1. ESLint
   - JavaScript linting
   - Code quality

2. Prettier
   - Code formatter
   - Consistent style

3. GitLens
   - Git supercharged
   - Blame, history, compare

4. JavaScript (ES6) code snippets
   - Code snippets
   - Faster coding

5. Path Intellisense
   - Autocomplete paths
   - File navigation

6. npm Intellisense
   - Autocomplete npm modules
   - Import suggestions

7. Thunder Client / REST Client
   - Test APIs
   - No Postman needed

8. Error Lens
   - Inline errors
   - Better visibility

9. Material Icon Theme
   - File icons
   - Better visual

10. One Dark Pro
    - Dark theme
    - Easy on eyes
```

### Installing Extensions

```bash
# From VS Code
Ctrl + Shift + X (Extensions panel)
Search extension name
Click Install

# Or install via command line
code --install-extension dbaeumer.vscode-eslint
code --install-extension esbenp.prettier-vscode
```

### VS Code Settings

```json
// File → Preferences → Settings → JSON
{
  "editor.fontSize": 14,
  "editor.tabSize": 2,
  "editor.wordWrap": "on",
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "files.autoSave": "afterDelay",
  "terminal.integrated.fontSize": 13,
  "workbench.colorTheme": "One Dark Pro",
  "workbench.iconTheme": "material-icon-theme"
}
```

### VS Code Shortcuts

```bash
# General
Ctrl + Shift + P     # Command palette
Ctrl + P             # Quick open file
Ctrl + ,             # Settings
Ctrl + `             # Toggle terminal

# Editing
Ctrl + /             # Toggle comment
Ctrl + D             # Select next occurrence
Ctrl + Shift + K     # Delete line
Alt + ↑/↓            # Move line up/down
Shift + Alt + ↑/↓    # Copy line up/down

# Navigation
Ctrl + G             # Go to line
Ctrl + Click         # Go to definition
Ctrl + B             # Toggle sidebar
Ctrl + \             # Split editor

# Terminal
Ctrl + Shift + `     # New terminal
Ctrl + `             # Toggle terminal
```

---

## ১০. Node.js Installation - Multiple Methods

### Method 1: Direct Install (Simple)

**Windows:**
1. Visit [nodejs.org](https://nodejs.org/)
2. Download LTS version (recommended)
3. Run installer
4. Follow wizard
5. Restart terminal

**Mac:**
```bash
# Using Homebrew
brew install node

# Or download from nodejs.org
```

**Linux (Ubuntu/Debian):**
```bash
# Using package manager
sudo apt update
sudo apt install nodejs npm

# Or from NodeSource
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### Method 2: NVM (Recommended) - Node Version Manager

**Why NVM?**
```
Benefits:
✅ Install multiple Node versions
✅ Switch between versions easily
✅ Project-specific versions
✅ Easy updates
✅ No sudo required (Mac/Linux)
```

**Windows (nvm-windows):**

```bash
# 1. Download nvm-windows
# https://github.com/coreybutler/nvm-windows/releases
# Download nvm-setup.exe

# 2. Install

# 3. Verify
nvm version

# 4. List available Node versions
nvm list available

# 5. Install Node
nvm install lts          # Latest LTS
nvm install 20.10.0      # Specific version
nvm install latest       # Latest version

# 6. Use Node version
nvm use lts
nvm use 20.10.0

# 7. List installed versions
nvm list

# 8. Set default version
nvm alias default lts
```

**Mac/Linux (nvm):**

```bash
# 1. Install nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash

# Or using wget
wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash

# 2. Load nvm (add to ~/.bashrc or ~/.zshrc)
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# 3. Restart terminal or
source ~/.bashrc

# 4. Verify
nvm --version

# 5. Install Node
nvm install --lts       # Latest LTS
nvm install 20          # Node 20.x
nvm install node        # Latest version

# 6. Use version
nvm use --lts
nvm use 20

# 7. Set default
nvm alias default lts

# 8. List versions
nvm ls
```

### Verification

```bash
# Check Node version
node -v
# Output: v20.10.0

# Check npm version
npm -v
# Output: 10.2.4

# Check installation path
which node     # Mac/Linux
where node     # Windows
```

### Update Node & npm

```bash
# Using nvm
nvm install --lts        # Install latest LTS
nvm use --lts            # Switch to it

# Update npm
npm install -g npm@latest
```

---

## ১১. Hello World - First Program (Expanded)

### Method 1: Simple Console Log

```bash
# 1. Create project folder
mkdir my-first-node-app
cd my-first-node-app

# 2. Create JavaScript file
touch index.js         # Mac/Linux
echo. > index.js       # Windows

# 3. Open in VS Code
code .
```

```javascript
// index.js
console.log("Hello from Node.js! 🚀");
console.log("Node version:", process.version);
console.log("Platform:", process.platform);
```

```bash
# 4. Run
node index.js

# Output:
# Hello from Node.js! 🚀
# Node version: v20.10.0
# Platform: win32
```

### Method 2: HTTP Server

```javascript
// server.js
const http = require('http');

const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Hello World from Node.js Server! 🚀\n');
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});
```

```bash
# Run server
node server.js

# Visit: http://localhost:3000
```

### Method 3: Complete Express App

```bash
# 1. Initialize project
npm init -y

# 2. Install Express
npm install express
```

```javascript
// app.js
const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
    res.send('<h1>Hello World from Express! 🚀</h1>');
});

app.get('/api/users', (req, res) => {
    res.json([
        { id: 1, name: 'John' },
        { id: 2, name: 'Jane' }
    ]);
});

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});
```

```bash
# Run app
node app.js
```

---

## ১২. REPL - Interactive Shell (Complete Guide)

### What is REPL?

```
REPL = Read-Eval-Print-Loop

Read:   Reads user input
Eval:   Evaluates JavaScript code
Print:  Prints result
Loop:   Repeats
```

### Starting REPL

```bash
# Start REPL
node

# You'll see:
Welcome to Node.js v20.10.0.
Type ".help" for more information.
>
```

### Basic Usage

```javascript
> 5 + 10
15

> const name = "John"
undefined

> name
'John'

> name.toUpperCase()
'JOHN'

> Math.random()
0.45678912345

> process.version
'v20.10.0'
```

### Multi-line Expressions

```javascript
> function add(a, b) {
... return a + b;
... }
undefined

> add(5, 10)
15
```

### REPL Special Commands

```javascript
// Get help
> .help

// Exit REPL
> .exit
// Or Ctrl + C (twice)
// Or Ctrl + D

// Clear context
> .clear

// Show current code
> .editor
// (Enter multi-line mode)
// Ctrl + D to execute

// Save session
> .save filename.js

// Load file
> .load filename.js
```

### REPL Variables

```javascript
// Last result
> 5 + 10
15
> _       // Last result
15

// Previous expressions
> 20 + 30
50
> _ + 10  // Using last result
60
```

### Debugging with REPL

```javascript
// Load module
> const fs = require('fs')
undefined

// Test code
> fs.existsSync('test.txt')
false

// Try APIs
> const url = new URL('https://example.com/path?name=John')
> url.hostname
'example.com'
> url.searchParams.get('name')
'John'
```

### REPL Best Practices

```javascript
// ✅ Quick testing
> [1,2,3].map(x => x * 2)
[2, 4, 6]

// ✅ Learning new APIs
> Object.keys({a: 1, b: 2})
['a', 'b']

// ✅ Debugging expressions
> JSON.parse('{"name":"John"}')
{ name: 'John' }

// ❌ Don't write full applications in REPL
// Use files for that
```

---

## ১৩. Project Structure - Best Practices

### Basic Structure

```
my-node-project/
├── node_modules/       # Dependencies (auto-generated)
├── src/                # Source code
│   ├── controllers/    # Request handlers
│   ├── models/         # Data models
│   ├── routes/         # Route definitions
│   ├── middleware/     # Custom middleware
│   ├── utils/          # Helper functions
│   └── index.js        # Entry point
├── tests/              # Test files
├── public/             # Static files
├── .env                # Environment variables
├── .gitignore          # Git ignore file
├── package.json        # Project config
├── package-lock.json   # Dependency lock
└── README.md           # Documentation
```

### Express API Structure

```
express-api/
├── src/
│   ├── config/
│   │   └── database.js
│   ├── controllers/
│   │   └── userController.js
│   ├── models/
│   │   └── User.js
│   ├── routes/
│   │   └── userRoutes.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── errorHandler.js
│   ├── utils/
│   │   └── logger.js
│   └── app.js
├── tests/
│   └── user.test.js
├── .env
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

---

## ১৪. Troubleshooting - Common Issues

### Issue 1: Command Not Found

```bash
# Error
node: command not found

# Solution
1. Verify installation: node -v
2. Restart terminal
3. Check PATH environment variable
4. Reinstall Node.js
```

### Issue 2: Permission Denied

```bash
# Error (Mac/Linux)
EACCES: permission denied

# Solution
# Don't use sudo with npm
# Use nvm instead
nvm install --lts

# Or fix permissions
sudo chown -R $USER /usr/local/lib/node_modules
```

### Issue 3: Port Already in Use

```bash
# Error
Error: listen EADDRINUSE: address already in use :::3000

# Solution (Windows)
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Solution (Mac/Linux)
lsof -i :3000
kill -9 <PID>

# Or use different port
const port = process.env.PORT || 3001;
```

### Issue 4: Module Not Found

```bash
# Error
Error: Cannot find module 'express'

# Solution
npm install express

# Or install all dependencies
npm install
```

### Issue 5: npm install fails

```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules
rm -rf node_modules
rm package-lock.json

# Reinstall
npm install
```

---

## ১৫. Next Steps - Learning Path

### Beginner Level (0-3 months)

```
✅ JavaScript Fundamentals
✅ Node.js Basics
✅ NPM & Package Management
✅ Built-in Modules (fs, path, http)
✅ Express.js Framework
✅ REST API Development
✅ Basic MongoDB/PostgreSQL
```

### Intermediate Level (3-6 months)

```
✅ Authentication (JWT, OAuth)
✅ Database ORMs (Mongoose, Sequelize)
✅ Middleware Concepts
✅ Error Handling
✅ Validation
✅ File Uploads
✅ Security Best Practices
✅ Testing (Jest, Mocha)
```

### Advanced Level (6-12 months)

```
✅ Microservices Architecture
✅ GraphQL APIs
✅ Real-time (WebSockets, Socket.io)
✅ Caching (Redis)
✅ Message Queues (RabbitMQ, Kafka)
✅ Deployment (Docker, Kubernetes)
✅ Performance Optimization
✅ Scalability
```

### Resources

```
📚 Documentation:
- nodejs.org/docs
- developer.mozilla.org
- npmjs.com

🎥 Video Courses:
- freeCodeCamp
- Traversy Media
- The Net Ninja
- Academind

📖 Books:
- Node.js Design Patterns
- You Don't Know JS
- Eloquent JavaScript

💻 Practice:
- Build projects
- Contribute to open source
- LeetCode/HackerRank
```

---

## Summary

এই guide complete করার পর আপনি:
- ✅ Node.js কি এবং কেন তা বুঝবেন
- ✅ Node.js install এবং setup করতে পারবেন
- ✅ Terminal basics জানবেন
- ✅ Git basics বুঝবেন
- ✅ VS Code configure করতে পারবেন
- ✅ First Node.js program লিখতে পারবেন
- ✅ REPL use করতে পারবেন
- ✅ Project structure follow করতে পারবেন
- ✅ Common issues solve করতে পারবেন
- ✅ Next steps জানবেন

**এখন আপনি Node.js development শুরু করার জন্য সম্পূর্ণ ready! 🚀**

Happy Coding! 💻
