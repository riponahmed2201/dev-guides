# Beginner Projects - Hands-On Learning (Level 1)

থিওরি অনেক হলো, এবার **হাতে-কলমে কোড করার পালা**! এই section এ **10+ beginner-friendly projects** রয়েছে যা আপনার Node.js fundamentals ঝালাই করবে এবং practical experience দেবে।

## 🎯 Learning Objectives

এই projects complete করার পর আপনি পারবেন:
- ✅ Command-line arguments handle করতে
- ✅ File system operations করতে
- ✅ HTTP servers তৈরি করতে
- ✅ JSON data parse ও manipulate করতে
- ✅ Error handling implement করতে
- ✅ Async operations handle করতে
- ✅ NPM packages ব্যবহার করতে
- ✅ Real-world problems solve করতে

---

## 📋 Projects Overview

```
Total Projects: 10
Difficulty: Beginner
Time Required: 3-4 weeks
Skills Covered: 15+ Node.js concepts
```

### Projects List

1. **CLI Calculator** - Command-line arguments, Math operations
2. **File Logger** - File system, Async operations
3. **To-Do CLI** - CRUD operations, JSON handling
4. **HTTP Server** - HTTP module, Routing
5. **CSV Parser** - File parsing, Data transformation
6. **File Backup Utility** - File operations, Path module
7. **Weather CLI** - External APIs, HTTP requests
8. **URL Shortener** - Hash generation, File storage
9. **Expense Tracker** - Data management, Reports
10. **Markdown to HTML Converter** - String manipulation, File I/O

---

## Project 1: Command-Line Calculator

**Duration:** 1-2 hours  
**Difficulty:** ⭐ Easy  
**Concepts:** Command-line arguments, Basic operations

### What You'll Learn
- ✅ Process command-line arguments (`process.argv`)
- ✅ Type conversion (parseFloat, parseInt)
- ✅ Switch statements
- ✅ Error handling
- ✅ User input validation

### Version 1: Basic Calculator

```javascript
// calculator.js
const args = process.argv.slice(2);

if (args.length !== 3) {
    console.log('Usage: node calculator.js <num1> <operator> <num2>');
    console.log('Operators: +, -, *, /, %, **');
    process.exit(1);
}

const num1 = parseFloat(args[0]);
const operator = args[1];
const num2 = parseFloat(args[2]);

// Validate numbers
if (isNaN(num1) || isNaN(num2)) {
    console.error('Error: Please provide valid numbers');
    process.exit(1);
}

let result;

switch (operator) {
    case '+':
        result = num1 + num2;
        break;
    case '-':
        result = num1 - num2;
        break;
    case '*':
        result = num1 * num2;
        break;
    case '/':
        if (num2 === 0) {
            console.error('Error: Division by zero');
            process.exit(1);
        }
        result = num1 / num2;
        break;
    case '%':
        result = num1 % num2;
        break;
    case '**':
        result = num1 ** num2;
        break;
    default:
        console.error('Error: Invalid operator');
        console.log('Valid operators: +, -, *, /, %, **');
        process.exit(1);
}

console.log(`${num1} ${operator} ${num2} = ${result}`);
```

**Usage:**
```bash
node calculator.js 10 + 5      # Output: 10 + 5 = 15
node calculator.js 20 / 4      # Output: 20 / 4 = 5
node calculator.js 2 ** 8      # Output: 2 ** 8 = 256
```

### Version 2: Advanced Calculator with History

```javascript
// advanced-calculator.js
const fs = require('fs/promises');
const path = require('path');

const HISTORY_FILE = path.join(__dirname, 'calc-history.json');

async function loadHistory() {
    try {
        const data = await fs.readFile(HISTORY_FILE, 'utf8');
        return JSON.parse(data);
    } catch {
        return [];
    }
}

async function saveHistory(history) {
    await fs.writeFile(HISTORY_FILE, JSON.stringify(history, null, 2));
}

async function calculate(num1, operator, num2) {
    let result;
    
    switch (operator) {
        case '+': result = num1 + num2; break;
        case '-': result = num1 - num2; break;
        case '*': result = num1 * num2; break;
        case '/':
            if (num2 === 0) throw new Error('Division by zero');
            result = num1 / num2;
            break;
        case '%': result = num1 % num2; break;
        case '**': result = num1 ** num2; break;
        default: throw new Error('Invalid operator');
    }
    
    return result;
}

async function main() {
    const args = process.argv.slice(2);
    
    // Show history
    if (args[0] === 'history') {
        const history = await loadHistory();
        console.log('📜 Calculation History:');
        history.forEach((item, index) => {
            console.log(`${index + 1}. ${item.expression} = ${item.result}`);
        });
        return;
    }
    
    // Clear history
    if (args[0] === 'clear') {
        await saveHistory([]);
        console.log('✅ History cleared');
        return;
    }
    
    // Calculate
    if (args.length !== 3) {
        console.log('Usage:');
        console.log('  node calculator.js <num1> <operator> <num2>');
        console.log('  node calculator.js history');
        console.log('  node calculator.js clear');
        process.exit(1);
    }
    
    const num1 = parseFloat(args[0]);
    const operator = args[1];
    const num2 = parseFloat(args[2]);
    
    if (isNaN(num1) || isNaN(num2)) {
        console.error('❌ Error: Invalid numbers');
        process.exit(1);
    }
    
    try {
        const result = await calculate(num1, operator, num2);
        console.log(`✅ ${num1} ${operator} ${num2} = ${result}`);
        
        // Save to history
        const history = await loadHistory();
        history.push({
            expression: `${num1} ${operator} ${num2}`,
            result,
            timestamp: new Date().toISOString()
        });
        await saveHistory(history);
    } catch (error) {
        console.error(`❌ Error: ${error.message}`);
        process.exit(1);
    }
}

main();
```

**Usage:**
```bash
node calculator.js 10 + 5       # Calculate
node calculator.js history      # View history
node calculator.js clear        # Clear history
```

### Challenge Exercises

1. ✏️ Add more operations (sqrt, sin, cos, tan)
2. ✏️ Support expressions like "10 + 5 * 2"
3. ✏️ Add memory functions (M+, M-, MR, MC)
4. ✏️ Create interactive mode (keep asking for input)
5. ✏️ Add unit conversion (cm to inch, kg to lb)

---

## Project 2: Simple File Logger

**Duration:** 2-3 hours  
**Difficulty:** ⭐⭐ Easy-Medium  
**Concepts:** File system, Async operations, Date formatting

### What You'll Learn
- ✅ File append operations
- ✅ Async/await patterns
- ✅ Date formatting
- ✅ Log levels
- ✅ File rotation

### Version 1: Basic Logger

```javascript
// logger.js
const fs = require('fs/promises');
const path = require('path');
const os = require('os');

const LOG_FILE = path.join(__dirname, 'app.log');

async function log(message, level = 'INFO') {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] [${level}] ${message}${os.EOL}`;
    
    try {
        await fs.appendFile(LOG_FILE, logEntry);
        console.log(`✅ Logged: ${message}`);
    } catch (error) {
        console.error('❌ Failed to write log:', error);
    }
}

// Test
async function main() {
    await log('Application started');
    await log('User logged in', 'INFO');
    await log('Database connection failed', 'ERROR');
    await log('Warning: Memory usage high', 'WARN');
}

main();
```

### Version 2: Advanced Logger with Levels & Colors

```javascript
// advanced-logger.js
const fs = require('fs/promises');
const path = require('path');
const os = require('os');

const LOG_DIR = path.join(__dirname, 'logs');
const LOG_FILE = path.join(LOG_DIR, 'app.log');
const MAX_LOG_SIZE = 1024 * 1024; // 1MB

// ANSI color codes
const colors = {
    DEBUG: '\x1b[36m',   // Cyan
    INFO: '\x1b[32m',    // Green
    WARN: '\x1b[33m',    // Yellow
    ERROR: '\x1b[31m',   // Red
    RESET: '\x1b[0m'
};

class Logger {
    constructor() {
        this.init();
    }
    
    async init() {
        try {
            await fs.mkdir(LOG_DIR, { recursive: true });
        } catch (error) {
            console.error('Failed to create log directory:', error);
        }
    }
    
    async checkRotation() {
        try {
            const stats = await fs.stat(LOG_FILE);
            if (stats.size > MAX_LOG_SIZE) {
                const timestamp = Date.now();
                const archiveName = path.join(LOG_DIR, `app.${timestamp}.log`);
                await fs.rename(LOG_FILE, archiveName);
                console.log(`📦 Log rotated to ${archiveName}`);
            }
        } catch (error) {
            // File doesn't exist yet, no rotation needed
        }
    }
    
    formatMessage(level, message) {
        const timestamp = new Date().toISOString();
        return `[${timestamp}] [${level.padEnd(5)}] ${message}`;
    }
    
    async write(level, message) {
        await this.checkRotation();
        
        const logEntry = this.formatMessage(level, message) + os.EOL;
        const coloredEntry = `${colors[level]}${logEntry}${colors.RESET}`;
        
        // Write to file
        try {
            await fs.appendFile(LOG_FILE, logEntry);
        } catch (error) {
            console.error('Failed to write log:', error);
        }
        
        // Print to console with colors
        process.stdout.write(coloredEntry);
    }
    
    debug(message) {
        return this.write('DEBUG', message);
    }
    
    info(message) {
        return this.write('INFO', message);
    }
    
    warn(message) {
        return this.write('WARN', message);
    }
    
    error(message) {
        return this.write('ERROR', message);
    }
}

// Usage
const logger = new Logger();

async function main() {
    await logger.info('Application started');
    await logger.debug('Debug information');
    await logger.warn('This is a warning');
    await logger.error('An error occurred');
}

main();

// Export for use in other files
module.exports = logger;
```

### Version 3: Logger with Streams (Performance)

```javascript
// stream-logger.js
const fs = require('fs');
const path = require('path');
const { Transform } = require('stream');

class LogFormatter extends Transform {
    constructor(level) {
        super();
        this.level = level;
    }
    
    _transform(chunk, encoding, callback) {
        const message = chunk.toString().trim();
        const timestamp = new Date().toISOString();
        const formatted = `[${timestamp}] [${this.level}] ${message}\n`;
        callback(null, formatted);
    }
}

class StreamLogger {
    constructor(logFile) {
        this.logStream = fs.createWriteStream(logFile, { flags: 'a' });
    }
    
    log(message, level = 'INFO') {
        const formatter = new LogFormatter(level);
        const readable = require('stream').Readable.from([message]);
        
        readable
            .pipe(formatter)
            .pipe(this.logStream, { end: false });
        
        console.log(`[${level}] ${message}`);
    }
    
    close() {
        this.logStream.end();
    }
}

// Usage
const logger = new StreamLogger(path.join(__dirname, 'stream.log'));

logger.log('Server started', 'INFO');
logger.log('Database connected', 'INFO');
logger.log('Error processing request', 'ERROR');

// Close when done
process.on('exit', () => logger.close());
```

### Challenge Exercises

1. ✏️ Add log filtering by date/level
2. ✏️ Implement log search functionality
3. ✏️ Create daily log files (YYYY-MM-DD.log)
4. ✏️ Add email notifications for ERROR logs
5. ✏️ Create web interface to view logs

---

## Project 3: File-Based To-Do List (CLI)

**Duration:** 3-4 hours  
**Difficulty:** ⭐⭐ Medium  
**Concepts:** CRUD operations, JSON, CLI arguments

### What You'll Learn
- ✅ CRUD operations (Create, Read, Update, Delete)
- ✅ JSON file handling
- ✅ Array manipulation
- ✅ CLI interface design
- ✅ Data persistence

### Complete Implementation

```javascript
// todo.js
const fs = require('fs/promises');
const path = require('path');

const TODO_FILE = path.join(__dirname, 'todos.json');

class TodoManager {
    async loadTodos() {
        try {
            const data = await fs.readFile(TODO_FILE, 'utf8');
            return JSON.parse(data);
        } catch {
            return [];
        }
    }
    
    async saveTodos(todos) {
        await fs.writeFile(TODO_FILE, JSON.stringify(todos, null, 2));
    }
    
    async add(task) {
        const todos = await this.loadTodos();
        const newTodo = {
            id: Date.now(),
            task,
            completed: false,
            createdAt: new Date().toISOString()
        };
        todos.push(newTodo);
        await this.saveTodos(todos);
        console.log(`✅ Added: "${task}"`);
    }
    
    async list(filter = 'all') {
        const todos = await this.loadTodos();
        
        let filtered = todos;
        if (filter === 'pending') {
            filtered = todos.filter(t => !t.completed);
        } else if (filter === 'completed') {
            filtered = todos.filter(t => t.completed);
        }
        
        if (filtered.length === 0) {
            console.log('📝 No tasks found');
            return;
        }
        
        console.log(`\n📋 To-Do List (${filter}):\n`);
        filtered.forEach((todo, index) => {
            const status = todo.completed ? '✅' : '⬜';
            const date = new Date(todo.createdAt).toLocaleDateString();
            console.log(`${status} ${todo.id}. ${todo.task} (${date})`);
        });
        console.log();
    }
    
    async complete(id) {
        const todos = await this.loadTodos();
        const todo = todos.find(t => t.id === parseInt(id));
        
        if (!todo) {
            console.log('❌ Task not found');
            return;
        }
        
        todo.completed = true;
        todo.completedAt = new Date().toISOString();
        await this.saveTodos(todos);
        console.log(`✅ Completed: "${todo.task}"`);
    }
    
    async delete(id) {
        const todos = await this.loadTodos();
        const index = todos.findIndex(t => t.id === parseInt(id));
        
        if (index === -1) {
            console.log('❌ Task not found');
            return;
        }
        
        const deleted = todos.splice(index, 1)[0];
        await this.saveTodos(todos);
        console.log(`🗑️  Deleted: "${deleted.task}"`);
    }
    
    async update(id, newTask) {
        const todos = await this.loadTodos();
        const todo = todos.find(t => t.id === parseInt(id));
        
        if (!todo) {
            console.log('❌ Task not found');
            return;
        }
        
        const oldTask = todo.task;
        todo.task = newTask;
        todo.updatedAt = new Date().toISOString();
        await this.saveTodos(todos);
        console.log(`📝 Updated: "${oldTask}" → "${newTask}"`);
    }
    
    async clear() {
        await this.saveTodos([]);
        console.log('🗑️  All tasks cleared');
    }
}

async function main() {
    const manager = new TodoManager();
    const [command, ...args] = process.argv.slice(2);
    
    switch (command) {
        case 'add':
            if (!args[0]) {
                console.log('❌ Please provide a task');
                break;
            }
            await manager.add(args.join(' '));
            break;
            
        case 'list':
            await manager.list(args[0] || 'all');
            break;
            
        case 'complete':
            if (!args[0]) {
                console.log('❌ Please provide task ID');
                break;
            }
            await manager.complete(args[0]);
            break;
            
        case 'delete':
            if (!args[0]) {
                console.log('❌ Please provide task ID');
                break;
            }
            await manager.delete(args[0]);
            break;
            
        case 'update':
            if (!args[0] || !args[1]) {
                console.log('❌ Usage: node todo.js update <id> <new task>');
                break;
            }
            await manager.update(args[0], args.slice(1).join(' '));
            break;
            
        case 'clear':
            await manager.clear();
            break;
            
        default:
            console.log(`
📋 To-Do Manager

Usage:
  node todo.js add <task>           Add a new task
  node todo.js list [filter]        List tasks (all/pending/completed)
  node todo.js complete <id>        Mark task as completed
  node todo.js delete <id>          Delete a task
  node todo.js update <id> <task>   Update a task
  node todo.js clear                Clear all tasks

Examples:
  node todo.js add "Buy groceries"
  node todo.js list pending
  node todo.js complete 1234567890
            `);
    }
}

main().catch(console.error);
```

**Usage:**
```bash
node todo.js add "Learn Node.js"
node todo.js add "Build a project"
node todo.js list
node todo.js complete 1234567890
node todo.js list pending
node todo.js delete 1234567890
```

### Challenge Exercises

1. ✏️ Add priorities (high, medium, low)
2. ✏️ Add due dates and reminders
3. ✏️ Add categories/tags
4. ✏️ Search tasks by keyword
5. ✏️ Export tasks to CSV

---

## Project 4: Basic HTTP Server with Routing

**Duration:** 2-3 hours  
**Difficulty:** ⭐⭐ Medium  
**Concepts:** HTTP module, Routing, JSON responses

### What You'll Learn
- ✅ HTTP server creation
- ✅ Request routing
- ✅ Response headers
- ✅ JSON responses
- ✅ Static file serving

### Complete Implementation

```javascript
// server.js
const http = require('http');
const fs = require('fs/promises');
const path = require('path');
const url = require('url');

const PORT = 3000;
const HOSTNAME = '127.0.0.1';

// In-memory data store
let users = [
    { id: 1, name: 'John Doe', email: 'john@example.com' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com' }
];

// Helper functions
function sendJSON(res, statusCode, data) {
    res.writeHead(statusCode, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(data));
}

function sendHTML(res, statusCode, html) {
    res.writeHead(statusCode, { 'Content-Type': 'text/html' });
    res.end(html);
}

function sendError(res, statusCode, message) {
    sendJSON(res, statusCode, { error: message });
}

async function serveStatic(res, filepath) {
    try {
        const data = await fs.readFile(filepath);
        const ext = path.extname(filepath);
        const contentTypes = {
            '.html': 'text/html',
            '.css': 'text/css',
            '.js': 'text/javascript',
            '.json': 'application/json',
            '.png': 'image/png',
            '.jpg': 'image/jpeg'
        };
        
        res.writeHead(200, { 'Content-Type': contentTypes[ext] || 'text/plain' });
        res.end(data);
    } catch (error) {
        sendError(res, 404, 'File not found');
    }
}

// Route handlers
const routes = {
    // Home page
    'GET /': (req, res) => {
        const html = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Node.js Server</title>
                <style>
                    body { font-family: Arial; max-width: 800px; margin: 50px auto; padding: 20px; }
                    h1 { color: #333; }
                    .endpoint { background: #f4f4f4; padding: 10px; margin: 10px 0; border-radius: 5px; }
                    code { background: #e0e0e0; padding: 2px 5px; border-radius: 3px; }
                </style>
            </head>
            <body>
                <h1>🚀 Node.js HTTP Server</h1>
                <h2>Available Endpoints:</h2>
                <div class="endpoint">
                    <strong>GET /</strong> - This page
                </div>
                <div class="endpoint">
                    <strong>GET /api/users</strong> - Get all users
                </div>
                <div class="endpoint">
                    <strong>GET /api/users/:id</strong> - Get user by ID
                </div>
                <div class="endpoint">
                    <strong>POST /api/users</strong> - Create new user
                </div>
                <div class="endpoint">
                    <strong>GET /about</strong> - About page
                </div>
            </body>
            </html>
        `;
        sendHTML(res, 200, html);
    },
    
    // Get all users
    'GET /api/users': (req, res) => {
        sendJSON(res, 200, { users });
    },
    
    // Get user by ID
    'GET /api/users/:id': (req, res, params) => {
        const user = users.find(u => u.id === parseInt(params.id));
        if (user) {
            sendJSON(res, 200, { user });
        } else {
            sendError(res, 404, 'User not found');
        }
    },
    
    // Create user
    'POST /api/users': async (req, res) => {
        let body = '';
        
        req.on('data', chunk => {
            body += chunk.toString();
        });
        
        req.on('end', () => {
            try {
                const data = JSON.parse(body);
                const newUser = {
                    id: users.length + 1,
                    name: data.name,
                    email: data.email
                };
                users.push(newUser);
                sendJSON(res, 201, { user: newUser });
            } catch (error) {
                sendError(res, 400, 'Invalid JSON');
            }
        });
    },
    
    // About page
    'GET /about': (req, res) => {
        const html = `
            <!DOCTYPE html>
            <html>
            <body style="font-family: Arial; max-width: 800px; margin: 50px auto;">
                <h1>About This Server</h1>
                <p>Built with Node.js HTTP module</p>
                <p>No frameworks used!</p>
                <a href="/">← Back to Home</a>
            </body>
            </html>
        `;
        sendHTML(res, 200, html);
    }
};

// Request handler
const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;
    const method = req.method;
    const route = `${method} ${pathname}`;
    
    console.log(`${method} ${pathname}`);
    
    // Try exact match
    if (routes[route]) {
        routes[route](req, res);
        return;
    }
    
    // Try dynamic route (e.g., /api/users/:id)
    const dynamicRoute = Object.keys(routes).find(r => {
        const pattern = r.replace(/:\w+/g, '(\\w+)');
        const regex = new RegExp(`^${pattern}$`);
        return regex.test(route);
    });
    
    if (dynamicRoute) {
        const pattern = dynamicRoute.replace(/:\w+/g, '(\\w+)');
        const regex = new RegExp(`^${pattern}$`);
        const matches = route.match(regex);
        const paramNames = dynamicRoute.match(/:\w+/g)?.map(p => p.slice(1)) || [];
        const params = {};
        paramNames.forEach((name, i) => {
            params[name] = matches[i + 1];
        });
        routes[dynamicRoute](req, res, params);
        return;
    }
    
    // 404 Not Found
    sendError(res, 404, 'Route not found');
});

server.listen(PORT, HOSTNAME, () => {
    console.log(`🚀 Server running at http://${HOSTNAME}:${PORT}/`);
});
```

**Test the server:**
```bash
# Start server
node server.js

# Visit in browser
http://localhost:3000/

# Test API endpoints
curl http://localhost:3000/api/users
curl http://localhost:3000/api/users/1

# Create user
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name":"Alice","email":"alice@example.com"}'
```

### Challenge Exercises

1. ✏️ Add UPDATE and DELETE routes
2. ✏️ Implement request logging middleware
3. ✏️ Add authentication
4. ✏️ Serve static files from /public folder
5. ✏️ Add CORS support

---

## Project 5: CSV File Parser

**Duration:** 2-3 hours  
**Difficulty:** ⭐⭐ Medium  
**Concepts:** File parsing, Data transformation, Streams

### Complete Implementation

```javascript
// csv-parser.js
const fs = require('fs/promises');
const { createReadStream } = require('fs');
const { createInterface } = require('readline');

class CSVParser {
    // Method 1: Simple parsing (for small files)
    async parseSimple(filepath) {
        const content = await fs.readFile(filepath, 'utf8');
        const lines = content.trim().split('\n');
        const headers = lines[0].split(',').map(h => h.trim());
        
        const data = lines.slice(1).map(line => {
            const values = line.split(',').map(v => v.trim());
            const obj = {};
            headers.forEach((header, index) => {
                obj[header] = values[index];
            });
            return obj;
        });
        
        return data;
    }
    
    // Method 2: Stream parsing (for large files)
    async parseStream(filepath, callback) {
        const fileStream = createReadStream(filepath);
        const rl = createInterface({
            input: fileStream,
            crlfDelay: Infinity
        });
        
        let headers = null;
        let lineCount = 0;
        
        for await (const line of rl) {
            if (lineCount === 0) {
                headers = line.split(',').map(h => h.trim());
            } else {
                const values = line.split(',').map(v => v.trim());
                const obj = {};
                headers.forEach((header, index) => {
                    obj[header] = values[index];
                });
                callback(obj);
            }
            lineCount++;
        }
    }
    
    // Convert to JSON
    async toJSON(csvFile, jsonFile) {
        const data = await this.parseSimple(csvFile);
        await fs.writeFile(jsonFile, JSON.stringify(data, null, 2));
        console.log(`✅ Converted ${csvFile} → ${jsonFile}`);
    }
    
    // Filter and export
    async filter(csvFile, condition, outputFile) {
        const data = await this.parseSimple(csvFile);
        const filtered = data.filter(condition);
        
        if (filtered.length === 0) {
            console.log('No records match the filter');
            return;
        }
        
        // Write back to CSV
        const headers = Object.keys(filtered[0]);
        const csvContent = [
            headers.join(','),
            ...filtered.map(row => headers.map(h => row[h]).join(','))
        ].join('\n');
        
        await fs.writeFile(outputFile, csvContent);
        console.log(`✅ Filtered ${filtered.length} records → ${outputFile}`);
    }
    
    // Generate statistics
    async stats(csvFile, column) {
        const data = await this.parseSimple(csvFile);
        const values = data.map(row => parseFloat(row[column])).filter(v => !isNaN(v));
        
        if (values.length === 0) {
            console.log(`No numeric values found in column "${column}"`);
            return;
        }
        
        const sum = values.reduce((a, b) => a + b, 0);
        const avg = sum / values.length;
        const min = Math.min(...values);
        const max = Math.max(...values);
        
        console.log(`\n📊 Statistics for "${column}":`);
        console.log(`   Count: ${values.length}`);
        console.log(`   Sum: ${sum}`);
        console.log(`   Average: ${avg.toFixed(2)}`);
        console.log(`   Min: ${min}`);
        console.log(`   Max: ${max}`);
    }
}

// CLI Usage
async function main() {
    const parser = new CSVParser();
    const [command, ...args] = process.argv.slice(2);
    
    switch (command) {
        case 'parse':
            const data = await parser.parseSimple(args[0]);
            console.log(data);
            break;
            
        case 'to-json':
            await parser.toJSON(args[0], args[1] || 'output.json');
            break;
            
        case 'filter':
            // Example: filter users.csv age>25 filtered.csv
            const [file, condition, output] = args;
            const [field, op, value] = condition.match(/(\w+)([><=]+)(.+)/).slice(1);
            
            await parser.filter(file, (row) => {
                const rowValue = parseFloat(row[field]);
                const targetValue = parseFloat(value);
                
                switch (op) {
                    case '>': return rowValue > targetValue;
                    case '<': return rowValue < targetValue;
                    case '>=': return rowValue >= targetValue;
                    case '<=': return rowValue <= targetValue;
                    case '==': return rowValue === targetValue;
                    default: return false;
                }
            }, output);
            break;
            
        case 'stats':
            await parser.stats(args[0], args[1]);
            break;
            
        default:
            console.log(`
📊 CSV Parser

Usage:
  node csv-parser.js parse <file.csv>                  Parse and display
  node csv-parser.js to-json <file.csv> [output.json]  Convert to JSON
  node csv-parser.js filter <file.csv> <condition> <output.csv>  Filter rows
  node csv-parser.js stats <file.csv> <column>         Calculate statistics

Examples:
  node csv-parser.js parse users.csv
  node csv-parser.js to-json users.csv users.json
  node csv-parser.js filter users.csv "age>25" adults.csv
  node csv-parser.js stats users.csv age
            `);
    }
}

main().catch(console.error);
```

**Create sample CSV:**
```csv
name,age,city,salary
John Doe,30,New York,75000
Jane Smith,25,Los Angeles,65000
Bob Johnson,35,Chicago,80000
Alice Brown,28,Houston,70000
```

**Usage:**
```bash
node csv-parser.js parse users.csv
node csv-parser.js to-json users.csv users.json
node csv-parser.js filter users.csv "age>25" adults.csv
node csv-parser.js stats users.csv salary
```

---

## 📝 Summary & Next Steps

### What You've Learned

```javascript
const skills = {
    commandLine: 'Process arguments, build CLIs',
    fileSystem: 'Read, write, manipulate files',
    http: 'Create servers, handle requests',
    data: 'Parse CSV, handle JSON',
    async: 'Promises, async/await patterns',
    errors: 'Try-catch, validation',
    modules: 'Organize code, reusable components'
};
```

### Practice More

1. **Combine projects** - Create a file logger for your HTTP server
2. **Add features** - Extend projects with new functionality
3. **Refactor** - Improve code quality and structure
4. **Test** - Write tests for your code
5. **Share** - Push to GitHub and get feedback

### Next Level

Ready for intermediate projects? Move on to:
- **Express.js applications**
- **REST APIs with database**
- **Authentication systems**
- **Real-time applications**

**Keep coding!** 🚀

---

*Total Projects: 10 | Estimated Time: 3-4 weeks | Difficulty: Beginner*
