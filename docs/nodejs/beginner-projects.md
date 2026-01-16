# Beginner Projects (Level 1)

থিওরি অনেক হলো, এবার হাতে-কলমে কোড করার পালা। নিচে ৬টি ছোট ছোট প্রজেক্ট আইডিয়া এবং কোড দেওয়া হলো যা আপনার কনসেপ্ট ক্লিয়ার করতে সাহায্য করবে।

## ১. Command-line Calculator
ইউজারের ইনপুট নিয়ে যোগ, বিয়োগ, গুণ, ভাগ করার একটি সিম্পল টুল।

```javascript
// calculator.js
const args = process.argv.slice(2);
const num1 = parseFloat(args[0]);
const operator = args[1];
const num2 = parseFloat(args[2]);

if (isNaN(num1) || isNaN(num2)) {
    console.log("Usage: node calculator.js <num1> <operator> <num2>");
} else {
    let result;
    switch (operator) {
        case '+': result = num1 + num2; break;
        case '-': result = num1 - num2; break;
        case '*': result = num1 * num2; break;
        case '/': result = num1 / num2; break;
        default: result = "Invalid Operator";
    }
    console.log(`Result: ${result}`);
}
// Run: node calculator.js 10 + 5
```

---

## ২. Simple File Logger
একটি লগ সিস্টেমে মেসেজ এবং টাইমস্ট্যাম্প সহ টেক্সট ফাইলে সেভ করে রাখা।

```javascript
// logger.js
const fs = require('fs');
const os = require('os');

function logMessage(message) {
    const logItem = `[${new Date().toISOString()}] ${message}${os.EOL}`;
    
    fs.appendFile('app.log', logItem, (err) => {
        if (err) throw err;
        console.log('Log saved!');
    });
}

logMessage('User logged in');
logMessage('Database connection failed');
```

---

## ৩. File-based TODO List
একটি JSON ফাইলে টাস্ক সেভ করে রাখা এবং রিড করা।

```javascript
// todo.js
const fs = require('fs');
const FILE_PATH = 'todos.json';

const command = process.argv[2];
const task = process.argv[3];

// Load existing todos
let todos = [];
if (fs.existsSync(FILE_PATH)) {
    const data = fs.readFileSync(FILE_PATH);
    todos = JSON.parse(data);
}

if (command === 'add') {
    todos.push({ task, done: false });
    fs.writeFileSync(FILE_PATH, JSON.stringify(todos, null, 2));
    console.log('Task Added!');
} else if (command === 'list') {
    console.log(todos);
} else {
    console.log('Commands: add <task>, list');
}
```

---

## ৪. Basic HTTP Server with Routing
কোনো ফ্রেমওয়ার্ক (Express) ছাড়া শুধু `http` মডিউল দিয়ে রাউটিং তৈরি।

```javascript
const http = require('http');

const server = http.createServer((req, res) => {
    if (req.url === '/') {
        res.end('Welcome to Home Page');
    } else if (req.url === '/api/users') {
        const users = [
            { id: 1, name: 'Ripon' },
            { id: 2, name: 'Karim' }
        ];
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(users));
    } else {
        res.writeHead(404);
        res.end('Page Not Found');
    }
});

server.listen(3000, () => console.log('Server running on port 3000'));
```

---

## ৫. CSV File Reader/Writer
একটি CSV ফাইল থেকে ডেটা পড়ে আবার নতুন ফরম্যাটে রাইট করা।

```javascript
const fs = require('fs');

const csvData = `name,age,city
Rahim,25,Dhaka
Karim,30,Chittagong`;

// Write CSV
fs.writeFileSync('users.csv', csvData);

// Read and Parse CSV
const data = fs.readFileSync('users.csv', 'utf8');
const lines = data.split('\n');
const headers = lines[0].split(',');

const jsonData = lines.slice(1).map(line => {
    const values = line.split(',');
    let obj = {};
    headers.forEach((header, index) => {
        obj[header] = values[index];
    });
    return obj;
});

console.log(jsonData);
```

---

## ৬. File Backup Utility
একটি নির্দিষ্ট ফোল্ডারের ফাইল অন্য ফোল্ডারে ব্যাকআপ (কপি) নেওয়া।

```javascript
// backup.js
const fs = require('fs');
const path = require('path');

const source = './source_folder';
const destination = './backup_folder';

if (!fs.existsSync(destination)) {
    fs.mkdirSync(destination);
}

fs.readdir(source, (err, files) => {
    if (err) throw err;

    files.forEach(file => {
        const srcPath = path.join(source, file);
        const destPath = path.join(destination, file);

        fs.copyFile(srcPath, destPath, (err) => {
            if (err) throw err;
            console.log(`Backed up: ${file}`);
        });
    });
});
```
