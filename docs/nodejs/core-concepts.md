# Node.js Core Concepts - সম্পূর্ণ আর্কিটেকচার গাইড

Node.js কিভাবে কাজ করে তার পেছনের মেকানিজম বা আর্কিটেকচার বোঝা একজন এক্সপার্ট ডেভেলপারের জন্য অত্যন্ত জরুরি। এই concepts না বুঝে Node.js এ expert হওয়া impossible!

## Node.js কি?

**Node.js = JavaScript Runtime built on Chrome's V8 Engine**

### Key Points:

1. **Not a language** - JavaScript framework/runtime
2. **Not a framework** - Runtime environment
3. **Built on V8** - Google Chrome's JavaScript engine
4. **Event-driven** - Based on events
5. **Non-blocking I/O** - Asynchronous operations
6. **Single-threaded** - But handles thousands of connections

### Node.js vs Browser JavaScript

```
Browser JavaScript:
├── DOM manipulation (document, window)
├── Browser APIs (localStorage, fetch)
├── Limited file system access
└── Security sandbox

Node.js JavaScript:
├── No DOM (no document, window)
├── File system access (fs module)
├── Network operations (http, net)
├── Operating system access (os module)
└── Full system access
```

---

## ১. Node.js Architecture - বিস্তারিত

Node.js architecture টি multiple components নিয়ে গঠিত।

### Architecture Layers

```
┌─────────────────────────────────────────┐
│         Your JavaScript Code            │
│    (app.js, routes, controllers)        │
├─────────────────────────────────────────┤
│         Node.js APIs (Bindings)         │
│    (fs, http, crypto, buffer, etc.)     │
├─────────────────────────────────────────┤
│            V8 JavaScript Engine         │
│        (Compiles & Executes JS)         │
├─────────────────────────────────────────┤
│              libuv (C library)          │
│  (Event Loop, Thread Pool, Async I/O)   │
├─────────────────────────────────────────┤
│          Operating System               │
│     (Linux, Windows, macOS)             │
└─────────────────────────────────────────┘
```

### Component Details

#### 1. V8 Engine
- Google Chrome এর JavaScript engine
- JavaScript কে machine code এ compile করে
- JIT (Just-In-Time) compilation
- Memory management (Garbage Collection)
- Optimization করে

#### 2. libuv
- C তে লেখা library
- **Event Loop** implement করে
- **Thread Pool** manage করে
- **Asynchronous I/O** operations
- Cross-platform (Windows, Linux, Mac)

#### 3. Node.js Bindings
- V8 এবং libuv এর মধ্যে bridge
- C++ তে লেখা
- JavaScript থেকে system resources access

#### 4. Node.js APIs
- Built-in modules (fs, http, crypto, etc.)
- JavaScript তে লেখা বা C++ bindings
- Developer-friendly interface

---

## Multi-threaded vs Single-threaded

### Traditional Multi-threaded (PHP, Java)

```
Request 1 → Thread 1 → Process → Response
Request 2 → Thread 2 → Process → Response
Request 3 → Thread 3 → Process → Response
...
Request 1000 → Thread 1000 → Process → Response

Problems:
- Each thread = 2-8 MB memory
- Context switching overhead
- Thread creation/destruction cost
- Deadlocks, race conditions
- Limited scalability
```

**Example: Apache Server**
```
10,000 concurrent connections
= 10,000 threads
= ~20-80 GB RAM! 💸
```

### Node.js Single-threaded Event Loop

```
Request 1 ─┐
Request 2 ─┤
Request 3 ─┼→ Event Loop → Async Operations → Callbacks
Request 4 ─┤              ↓
Request 5 ─┘              Thread Pool (libuv)
                          (File I/O, Crypto, DNS)

Advantages:
- One thread handles thousands
- No context switching
- Low memory footprint
- No deadlocks
- Highly scalable
```

**Example: Node.js Server**
```
10,000 concurrent connections
= 1 thread (event loop)
= ~100-200 MB RAM ✅
```

### When Each is Better?

**Multi-threaded is better for:**
- CPU-intensive tasks (video encoding, image processing)
- Heavy computations
- Parallel processing

**Node.js (Single-threaded) is better for:**
- I/O intensive tasks (file operations, database queries)
- Real-time applications (chat, notifications)
- API servers (REST, GraphQL)
- Streaming applications
- Microservices

### Misconception Clarification

**❌ "Node.js is single-threaded"**
- Partially true

**✅ Reality:**
```javascript
Main Thread (Event Loop):
- JavaScript execution
- Handles callbacks
- Coordinates async operations

Background Threads (Thread Pool):
- File system operations
- Crypto operations
- DNS lookups
- Compression
- (Default: 4 threads, configurable)
```

**Proof:**
```javascript
process.env.UV_THREADPOOL_SIZE = 8; // Increase thread pool size

const crypto = require('crypto');

// This runs in thread pool!
crypto.pbkdf2('password', 'salt', 100000, 512, 'sha512', (err, key) => {
    console.log('Hash computed in background thread!');
});

// Event loop continues here
console.log('Event loop is free!');
```

### Visual Comparison

```javascript
// Traditional Server (Multi-threaded)
function handleRequest(req, res) {
    // ❌ Blocks entire thread
    const data = fs.readFileSync('file.txt');  // Waits here
    res.send(data);
}
// Other requests must wait for new thread

// Node.js (Event Loop)
function handleRequest(req, res) {
    // ✅ Non-blocking
    fs.readFile('file.txt', (err, data) => {  // Offloaded
        res.send(data);
    });
    // Event loop immediately handles next request
}
```

---

## What Makes Node.js Fast?

### 1. V8 Engine Optimization
```javascript
// V8 optimizes frequently called functions
function hotFunction() {
    return x + y;  // V8 compiles to optimized machine code
}
```

### 2. Non-blocking I/O
```javascript
// Doesn't wait for slow operations
db.query('SELECT * FROM users', (err, users) => {
    // Callback executed when ready
});
// Continues immediately
```

### 3. Event Loop Efficiency
```javascript
// Handles thousands of connections with minimal overhead
const server = http.createServer((req, res) => {
    // Each request handled asynchronously
});
```

### 4. Single Thread = No Overhead
- No thread creation cost
- No context switching
- No thread synchronization needed

### Performance Numbers

```
Traditional Server:
- 1000 requests/second
- 100 concurrent connections
- High CPU usage (context switching)

Node.js Server:
- 10,000+ requests/second
- 10,000+ concurrent connections
- Low CPU usage (event loop)
```

---

## Node.js Use Cases

### ✅ Perfect For:

1. **RESTful APIs**
   ```javascript
   // Handles many API requests efficiently
   app.get('/api/users', async (req, res) => {
       const users = await db.query('SELECT * FROM users');
       res.json(users);
   });
   ```

2. **Real-time Applications**
   ```javascript
   // Chat, notifications, live updates
   io.on('connection', (socket) => {
       socket.on('message', (msg) => {
           io.emit('message', msg);  // Broadcast to all
       });
   });
   ```

3. **Streaming Applications**
   ```javascript
   // Video, audio streaming
   fs.createReadStream('video.mp4')
     .pipe(res);
   ```

4. **Microservices**
   ```javascript
   // Lightweight, fast startup
   // Easy horizontal scaling
   ```

5. **IoT Applications**
   ```javascript
   // Handle many device connections
   // Low resource usage
   ```

### ❌ Not Ideal For:

1. **CPU-Intensive Tasks**
   ```javascript
   // ❌ Blocks event loop
   function calculatePrimes(max) {
       for (let i = 0; i < max; i++) {
           // Heavy computation blocks everything!
       }
   }
   
   // ✅ Solution: Use Worker Threads or separate service
   const { Worker } = require('worker_threads');
   const worker = new Worker('./primes-worker.js');
   ```

2. **Heavy Computations**
   - Video encoding
   - Image processing
   - Machine learning
   - Scientific computing

   **Solution:** Offload to separate services (Python, Go, C++)

---

## Best Practices

### 1. Keep Event Loop Unblocked

```javascript
// ❌ Bad - Blocks event loop
app.get('/bad', (req, res) => {
    const result = heavyComputation();  // Blocks!
    res.json(result);
});

// ✅ Good - Offload to worker
const { Worker } = require('worker_threads');

app.get('/good', (req, res) => {
    const worker = new Worker('./compute.js');
    worker.on('message', result => {
        res.json(result);
    });
});
```

### 2. Use Async/Await

```javascript
// ❌ Bad - Callback hell
fs.readFile('file1', (err, data1) => {
    fs.readFile('file2', (err, data2) => {
        fs.readFile('file3', (err, data3) => {
            // Nested callbacks 😱
        });
    });
});

// ✅ Good - Clean async/await
async function readFiles() {
    const data1 = await fs.promises.readFile('file1');
    const data2 = await fs.promises.readFile('file2');
    const data3 = await fs.promises.readFile('file3');
}
```

### 3. Cluster for Multi-core

```javascript
const cluster = require('cluster');
const os = require('os');

if (cluster.isMaster) {
    // Fork workers for each CPU core
    const numCPUs = os.cpus().length;
    
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }
} else {
    // Workers share TCP connection
    const server = http.createServer(app);
    server.listen(3000);
}
```

---

---

## ২. Event Loop - নোডের হৃদপিণ্ড (Complete Deep Dive)

Event Loop হলো Node.js এর **most important concept**। এটি বুঝলে Node.js expert হওয়া easy!

### Event Loop কি?

Event Loop হলো একটি infinite loop যা continuously check করে:
1. Call Stack empty কিনা
2. Callback Queue তে কিছু আছে কিনা
3. If yes → Execute callbacks

### Simple Analogy

```
Event Loop = Restaurant Manager

Tasks:
1. Check if chef (call stack) is free
2. If free, assign next order (callback) from queue
3. Repeat forever
```

---

### Event Loop Phases (6টি ফেজ)

Event Loop প্রতিটি iteration এ 6টি phase execute করে:

```
   ┌───────────────────────────┐
┌─>│           timers          │  setTimeout, setInterval
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
│  │     pending callbacks     │  I/O callbacks (TCP errors, etc.)
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
│  │       idle, prepare       │  Internal use only
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
│  │           poll            │  Retrieve new I/O events
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
│  │           check           │  setImmediate callbacks
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
└──│      close callbacks      │  socket.on('close', ...)
   └───────────────────────────┘
```

#### Phase 1: Timers
Execute callbacks scheduled by `setTimeout()` and `setInterval()`

```javascript
setTimeout(() => {
    console.log('Timer executed');
}, 1000);
```

#### Phase 2: Pending Callbacks
Execute I/O callbacks deferred from previous iteration

#### Phase 3: Idle, Prepare
Internal use only (Node.js internal operations)

#### Phase 4: Poll (Most Important!)
- Retrieve new I/O events
- Execute I/O related callbacks
- Block here if no other work

```javascript
fs.readFile('file.txt', (err, data) => {
    console.log('File read complete');  // Executes in poll phase
});
```

#### Phase 5: Check
Execute `setImmediate()` callbacks

```javascript
setImmediate(() => {
    console.log('setImmediate executed');
});
```

#### Phase 6: Close Callbacks
Execute close event callbacks

```javascript
socket.on('close', () => {
    console.log('Socket closed');
});
```

---

### Microtask Queue (Priority Queue)

Event Loop এর **আগে** execute হয়!

```javascript
// Microtasks (highest priority):
- process.nextTick()
- Promise callbacks (.then, .catch, .finally)

// Macrotasks (regular queue):
- setTimeout, setInterval
- setImmediate
- I/O callbacks
```

**Execution Order:**

```
1. Execute all synchronous code
2. Execute all Microtasks (nextTick → Promises)
3. Execute one Macrotask (Timer/I/O/Check)
4. Execute all Microtasks again
5. Repeat step 3-4
```

---

### Complete Example

```javascript
console.log('1: Sync');

setTimeout(() => {
    console.log('2: setTimeout');
}, 0);

setImmediate(() => {
    console.log('3: setImmediate');
});

Promise.resolve().then(() => {
    console.log('4: Promise');
});

process.nextTick(() => {
    console.log('5: nextTick');
});

console.log('6: Sync');

// Output:
// 1: Sync
// 6: Sync
// 5: nextTick        (Microtask - highest priority)
// 4: Promise         (Microtask)
// 2: setTimeout      (Timer phase)
// 3: setImmediate    (Check phase)
```

**Explanation:**
1. Synchronous code runs first (1, 6)
2. Microtasks run next:
   - `process.nextTick` (highest priority) → 5
   - Promise callbacks → 4
3. Macrotasks run:
   - `setTimeout` (Timer phase) → 2
   - `setImmediate` (Check phase) → 3

---

### setImmediate vs setTimeout(0)

```javascript
// Order can vary!
setTimeout(() => console.log('setTimeout'), 0);
setImmediate(() => console.log('setImmediate'));

// But inside I/O callback:
fs.readFile('file.txt', () => {
    setTimeout(() => console.log('setTimeout'), 0);
    setImmediate(() => console.log('setImmediate'));
    
    // Output (guaranteed):
    // setImmediate  (Check phase comes after Poll)
    // setTimeout
});
```

---

### process.nextTick vs setImmediate

```javascript
// process.nextTick = Immediately after current operation
// setImmediate = Next iteration of event loop

setImmediate(() => console.log('setImmediate'));
process.nextTick(() => console.log('nextTick'));

// Output:
// nextTick       (Executes first!)
// setImmediate

// ⚠️ Warning: nextTick can starve event loop!
function recursiveNextTick() {
    process.nextTick(recursiveNextTick);  // ☠️ Infinite loop!
}
```

---

### Call Stack, Callback Queue & Microtask Queue

```javascript
function first() {
    console.log('First');
    second();
}

function second() {
    console.log('Second');
    third();
}

function third() {
    console.log('Third');
}

setTimeout(() => console.log('Timeout'), 0);
Promise.resolve().then(() => console.log('Promise'));
first();

// Execution:

Call Stack:          Microtask Queue:    Callback Queue:
-----------          ----------------    ---------------
first()              [Promise callback]  [Timeout callback]
second()
third()

// Step by step:
1. first() pushed to call stack
2. logs 'First'
3. second() pushed
4. logs 'Second'
5. third() pushed
6. logs 'Third'
7. third() popped
8. second() popped
9. first() popped
10. Call stack empty → Check Microtask Queue
11. Execute Promise callback → logs 'Promise'
12. Microtask queue empty → Check Callback Queue
13. Execute Timeout callback → logs 'Timeout'

// Output:
// First
// Second
// Third
// Promise
// Timeout
```

---

### Real-World Example: API Request

```javascript
const https = require('https');

console.log('1. Start');

// Async operation
https.get('https://api.github.com/users/github', (res) => {
    console.log('3. API Response received');
    
    let data = '';
    res.on('data', chunk => {
        data += chunk;
    });
    
    res.on('end', () => {
        console.log('4. Data received');
    });
});

console.log('2. Request sent');

// Output:
// 1. Start
// 2. Request sent
// (Event loop waits in Poll phase)
// 3. API Response received
// 4. Data received
```

**What happens:**

```
1. Sync code executes (logs 1, 2)
2. http.get sends request (non-blocking)
3. Event loop enters Poll phase
4. Waits for I/O (network response)
5. Response arrives → callback queued
6. Event loop executes callback (logs 3, 4)
```

---

### Blocking the Event Loop (Bad!)

```javascript
// ❌ Bad - Blocks event loop
const start = Date.now();
while (Date.now() - start < 5000) {
    // Blocks for 5 seconds!
    // No other operations can run!
}

// All requests waiting for 5 seconds 😱
```

**Solution:**
```javascript
// ✅ Good - Use setImmediate to break up work
function processLargeArray(array) {
    const chunk = array.splice(0, 1000);  // Process 1000 items
    
    // Process chunk...
    
    if (array.length > 0) {
        setImmediate(() => processLargeArray(array));  // Continue next iteration
    }
}
```

---

### Monitoring Event Loop

```javascript
// Check event loop delay
const { performance } = require('perf_hooks');

setInterval(() => {
    const start = performance.now();
    
    setImmediate(() => {
        const delay = performance.now() - start;
        
        if (delay > 10) {
            console.warn(`Event loop delay: ${delay}ms`);
            // Event loop is blocked!
        }
    });
}, 1000);
```

---

### Event Loop Best Practices

✅ **Keep callbacks small and fast**  
✅ **Use async operations** (never sync in production)  
✅ **Break up CPU-intensive tasks** (setImmediate)  
✅ **Use Worker Threads for heavy computation**  
✅ **Monitor event loop delay**  
✅ **Prefer Promises over callbacks**  
❌ **Never block event loop** (no while loops, heavy sync operations)  
❌ **Don't abuse process.nextTick** (can starve event loop)  
❌ **Avoid deeply nested callbacks** (callback hell)

---

---

## ৩. Blocking vs Non-blocking Code - Complete Guide

Node.js এর পারফরম্যান্স এর মূল চাবিকাঠি হলো **non-blocking I/O**।

### Blocking (Synchronous) - বিস্তারিত

**Definition:** Execution থামিয়ে রাখে যতক্ষণ না operation complete হয়।

```javascript
const fs = require('fs');

console.log('Start');

// ❌ Blocking - Event loop blocked!
const data = fs.readFileSync('large-file.txt', 'utf8');
console.log('File content:', data);

console.log('End');

// Output (sequential):
// Start
// File content: ...
// End

// Problem: যদি file read করতে 5 seconds লাগে,
// তাহলে পুরো 5 seconds event loop blocked!
// এই সময়ে কোন request handle হবে না!
```

**What happens internally:**

```
Call Stack:              
┌──────────────────┐     
│ readFileSync()   │ ← Stuck here for 5 seconds!
│ console.log()    │   (Blocking event loop)
│ main()           │   (No other code runs)
└──────────────────┘     

Server Status:
Request 1: ⏳ Waiting...
Request 2: ⏳ Waiting...
Request 3: ⏳ Waiting...
All blocked! 😱
```

---

### Non-blocking (Asynchronous) - বিস্তারিত

**Definition:** Operation background এ offload হয়, execution continues।

```javascript
const fs = require('fs');

console.log('Start');

// ✅ Non-blocking - Event loop free!
fs.readFile('large-file.txt', 'utf8', (err, data) => {
    if (err) throw err;
    console.log('File content:', data);
});

console.log('End');

// Output (non-sequential):
// Start
// End
// File content: ...

// Benefit: Event loop remains free!
// Other requests can be handled immediately!
```

**What happens internally:**

```
Main Thread (Event Loop):
1. console.log('Start')          ✅ Fast
2. fs.readFile()                 ✅ Offloaded to thread pool
3. console.log('End')            ✅ Continues immediately

Background (Thread Pool):
- Reading file...                ⏳ 5 seconds
- Done → Callback queued         ✅

Event Loop:
- Picks callback from queue
- Executes: console.log(data)    ✅

Server Status:
Request 1: ✅ Handled
Request 2: ✅ Handled  
Request 3: ✅ Handled
All requests processed! 🚀
```

---

### Real-World Impact

#### Scenario: 100 concurrent users

**With Blocking Code:**
```javascript
// Each request blocks for 100ms
app.get('/users', (req, res) => {
    const data = fs.readFileSync('users.json');  // ❌ Blocks 100ms
    res.json(JSON.parse(data));
});

// Time for 100 users:
100 users × 100ms = 10,000ms = 10 seconds! 😱
```

**With Non-blocking Code:**
```javascript
// Requests processed concurrently
app.get('/users', async (req, res) => {
    const data = await fs.promises.readFile('users.json');  // ✅ Non-blocking
    res.json(JSON.parse(data));
});

// Time for 100 users:
~100-200ms (all handled concurrently) 🚀
```

---

### All Sync vs Async Methods

```javascript
const fs = require('fs');

// File operations
fs.readFileSync()  ❌  →  fs.readFile()      ✅
fs.writeFileSync() ❌  →  fs.writeFile()     ✅
fs.appendFileSync() ❌  →  fs.appendFile()   ✅
fs.readdirSync()   ❌  →  fs.readdir()       ✅
fs.statSync()      ❌  →  fs.stat()          ✅
fs.unlinkSync()    ❌  →  fs.unlink()        ✅
fs.mkdirSync()     ❌  →  fs.mkdir()         ✅

// Or use Promises API (recommended):
const fs = require('fs/promises');
await fs.readFile()   ✅
await fs.writeFile()  ✅
await fs.readdir()    ✅
```

---

### When to Use Sync Methods?

**✅ Acceptable:**
- Application startup (loading config)
- CLI tools (not server)
- Build scripts
- Development utilities

```javascript
// OK: Loading config at startup
const config = JSON.parse(
    fs.readFileSync('config.json', 'utf8')
);

// Then start server
const server = app.listen(3000);
```

**❌ Never:**
- Inside request handlers
- In production servers
- Anywhere that blocks event loop

```javascript
// ❌ NEVER do this in request handler!
app.get('/bad', (req, res) => {
    const data = fs.readFileSync('file.txt');  // Blocks all requests!
    res.send(data);
});
```

---

### Evolution: Callbacks → Promises → Async/Await

#### 1. Callbacks (Old way)

```javascript
fs.readFile('file1.txt', (err, data1) => {
    if (err) throw err;
    
    fs.readFile('file2.txt', (err, data2) => {
        if (err) throw err;
        
        fs.readFile('file3.txt', (err, data3) => {
            if (err) throw err;
            
            console.log(data1, data2, data3);
            // 😱 Callback hell!
        });
    });
});
```

#### 2. Promises (Better)

```javascript
const fs = require('fs/promises');

fs.readFile('file1.txt')
    .then(data1 => fs.readFile('file2.txt'))
    .then(data2 => fs.readFile('file3.txt'))
    .then(data3 => {
        console.log(data1, data2, data3);
    })
    .catch(err => console.error(err));
```

#### 3. Async/Await (Best!) ✅

```javascript
const fs = require('fs/promises');

async function readFiles() {
    try {
        const data1 = await fs.readFile('file1.txt', 'utf8');
        const data2 = await fs.readFile('file2.txt', 'utf8');
        const data3 = await fs.readFile('file3.txt', 'utf8');
        
        console.log(data1, data2, data3);
    } catch (err) {
        console.error(err);
    }
}

readFiles();
```

---

### Parallel vs Sequential Execution

```javascript
// Sequential (slow - 3 seconds total)
async function sequential() {
    const data1 = await fetch('/api/1');  // 1 second
    const data2 = await fetch('/api/2');  // 1 second
    const data3 = await fetch('/api/3');  // 1 second
    // Total: 3 seconds
}

// Parallel (fast - 1 second total) ✅
async function parallel() {
    const [data1, data2, data3] = await Promise.all([
        fetch('/api/1'),  // All three
        fetch('/api/2'),  // execute
        fetch('/api/3')   // simultaneously!
    ]);
    // Total: 1 second (fastest of the three)
}
```

---

### Error Handling

```javascript
// Callbacks
fs.readFile('file.txt', (err, data) => {
    if (err) {
        console.error('Error:', err);
        return;
    }
    console.log(data);
});

// Promises
fs.promises.readFile('file.txt')
    .then(data => console.log(data))
    .catch(err => console.error('Error:', err));

// Async/Await
async function read() {
    try {
        const data = await fs.promises.readFile('file.txt');
        console.log(data);
    } catch (err) {
        console.error('Error:', err);
    }
}
```

---

### Common Mistakes

```javascript
// ❌ Mistake 1: Forgetting await
async function bad1() {
    const data = fs.promises.readFile('file.txt');
    console.log(data);  // Promise { <pending> } 😱
}

// ✅ Correct
async function good1() {
    const data = await fs.promises.readFile('file.txt');
    console.log(data);  // Actual data ✅
}

// ❌ Mistake 2: Not handling errors
async function bad2() {
    const data = await fs.promises.readFile('file.txt');
    // If error → unhandled rejection!
}

// ✅ Correct
async function good2() {
    try {
        const data = await fs.promises.readFile('file.txt');
    } catch (err) {
        console.error(err);
    }
}

// ❌ Mistake 3: Sequential when should be parallel
async function bad3() {
    const user = await getUser();      // 1 second
    const posts = await getPosts();    // 1 second
    const comments = await getComments();  // 1 second
    // Total: 3 seconds (but they're independent!)
}

// ✅ Correct
async function good3() {
    const [user, posts, comments] = await Promise.all([
        getUser(),
        getPosts(),
        getComments()
    ]);
    // Total: 1 second (parallel) 🚀
}
```

---

### Best Practices

✅ **Always use async methods in production**  
✅ **Prefer async/await over callbacks**  
✅ **Use Promise.all for parallel operations**  
✅ **Always handle errors** (try-catch or .catch())  
✅ **Use fs/promises API** (cleaner than callbacks)  
❌ **Never use sync methods in request handlers**  
❌ **Don't forget await keyword**  
❌ **Don't do sequential when parallel is possible**

---

---

## ৪. Global Objects - Complete Reference

Node.js এ `window` বা `document` নেই (browser environment নয়)। এর পরিবর্তে Node.js-specific global objects আছে।

### Browser vs Node.js Globals

```javascript
// Browser:
window.alert()
document.getElementById()
localStorage
location

// Node.js:
global
process
__dirname
__filename
Buffer
require()
module
exports
```

---

### 1. global Object

Browser এর `window` এর মতো, Node.js এর global namespace।

```javascript
// Set global variable
global.myVar = 'Hello';

// Access from any file
console.log(global.myVar);  // 'Hello'

// Or without 'global' prefix
console.log(myVar);  // 'Hello'

// ⚠️ Warning: Avoid polluting global namespace!
// Use module.exports instead
```

---

### 2. process Object (Most Important!)

Current Node.js process সম্পর্কে information এবং control।

#### a) Environment Variables

```javascript
// Read environment variables
process.env.NODE_ENV;        // 'development', 'production'
process.env.PORT;            // '3000'
process.env.DATABASE_URL;    // Database connection string

// Check environment
if (process.env.NODE_ENV === 'production') {
    // Production logic
} else {
    // Development logic
}

// Set environment variable (current process only)
process.env.MY_VAR = 'value';
```

#### b) Process Information

```javascript
// Process IDs
process.pid;         // Current process ID
process.ppid;        // Parent process ID

// Platform info
process.platform;    // 'win32', 'linux', 'darwin'
process.arch;        // 'x64', 'arm', 'arm64'
process.version;     // 'v18.12.0'
process.versions;    // All versions (node, v8, etc.)

// Execution info
process.execPath;    // '/usr/local/bin/node'
process.argv;        // Command line arguments
process.cwd();       // Current working directory

// Memory usage
process.memoryUsage();
// {
//   rss: 36864000,
//   heapTotal: 7159808,
//   heapUsed: 4654456,
//   external: 855376,
//   arrayBuffers: 26812
// }

// CPU usage
process.cpuUsage();
// { user: 38579, system: 6986 }

// Uptime
process.uptime();    // Seconds since process started
```

#### c) Process Control

```javascript
// Exit process
process.exit(0);     // Exit with success
process.exit(1);     // Exit with error

// Kill process
process.kill(process.pid, 'SIGTERM');

// Change directory
process.chdir('/new/path');

// Standard streams
process.stdin        // Input stream
process.stdout       // Output stream
process.stderr       // Error stream
```

#### d) Event Listeners

```javascript
// Before exit
process.on('exit', (code) => {
    console.log(`Process exiting with code: ${code}`);
});

// Unhandled promise rejection
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection:', reason);
});

// Uncaught exception
process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
    process.exit(1);
});

// SIGTERM signal (graceful shutdown)
process.on('SIGTERM', () => {
    console.log('SIGTERM received, closing server...');
    server.close(() => {
        process.exit(0);
    });
});
```

---

### 3. __dirname & __filename

Current file এর location info।

```javascript
// File: /home/user/project/src/app.js

console.log(__dirname);
// Output: /home/user/project/src

console.log(__filename);
// Output: /home/user/project/src/app.js

// Use with path module
const path = require('path');
const configPath = path.join(__dirname, 'config', 'database.json');
// /home/user/project/src/config/database.json
```

**Note:** ES Modules এ `__dirname` নেই, alternative:

```javascript
// ES Modules
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
```

---

### 4. Buffer

Binary data handle করার জন্য।

```javascript
// Create buffer
const buf1 = Buffer.from('Hello');
const buf2 = Buffer.alloc(10);  // 10 bytes, filled with zeros

// Convert to string
buf1.toString();  // 'Hello'

// Write to buffer
buf2.write('Hi', 0, 'utf8');

// Buffer operations
const buf3 = Buffer.concat([buf1, buf2]);
Buffer.compare(buf1, buf2);
```

---

### 5. Timer Functions (Global)

```javascript
// setTimeout (execute once after delay)
const timeoutId = setTimeout(() => {
    console.log('Executed after 1 second');
}, 1000);

// Clear timeout
clearTimeout(timeoutId);

// setInterval (execute repeatedly)
const intervalId = setInterval(() => {
    console.log('Every 2 seconds');
}, 2000);

// Clear interval
clearInterval(intervalId);

// setImmediate (execute next event loop iteration)
setImmediate(() => {
    console.log('Next iteration');
});

// process.nextTick (execute before next event loop)
process.nextTick(() => {
    console.log('Before next iteration');
});
```

---

### 6. console Object

Enhanced console methods।

```javascript
// Basic
console.log('Info message');
console.error('Error message');
console.warn('Warning message');
console.info('Info message');

// Formatting
console.log('Hello %s', 'World');  // Hello World
console.log('Number: %d', 42);      // Number: 42
console.log('JSON: %j', {a: 1});    // JSON: {"a":1}

// Table
console.table([
    { name: 'John', age: 30 },
    { name: 'Jane', age: 25 }
]);

// Time measurement
console.time('operation');
// ... some code ...
console.timeEnd('operation');  // operation: 123.456ms

// Trace
console.trace('Trace message');  // Shows stack trace

// Assert
console.assert(1 === 2, 'This will print');  // Assertion failed

// Count
console.count('label');  // label: 1
console.count('label');  // label: 2

// Clear console
console.clear();
```

---

### 7. URL & URLSearchParams (Global)

```javascript
// Parse URL
const myURL = new URL('https://example.com/path?name=John&age=30');

console.log(myURL.protocol);    // 'https:'
console.log(myURL.hostname);    // 'example.com'
console.log(myURL.pathname);    // '/path'
console.log(myURL.search);      // '?name=John&age=30'

// Query parameters
const params = myURL.searchParams;
console.log(params.get('name'));  // 'John'
console.log(params.get('age'));   // '30'

// Modify
params.set('city', 'NYC');
params.delete('age');
```

---

### 8. TextEncoder / TextDecoder

```javascript
// Encode string to bytes
const encoder = new TextEncoder();
const bytes = encoder.encode('Hello');  // Uint8Array

// Decode bytes to string
const decoder = new TextDecoder();
const text = decoder.decode(bytes);  // 'Hello'
```

---

### 9. fetch (Node.js 18+)

```javascript
// HTTP requests (built-in, no need for axios!)
const response = await fetch('https://api.github.com/users/github');
const data = await response.json();

console.log(data);
```

---

### Common Global Functions

```javascript
// Type checking
typeof variable
instanceof Constructor

// Timers
setTimeout, setInterval, setImmediate
clearTimeout, clearInterval

// Encoding
encodeURIComponent()
decodeURIComponent()
encodeURI()
decodeURI()

// Parsing
parseInt('42')
parseFloat('3.14')

// JSON
JSON.parse('{"a":1}')
JSON.stringify({a: 1})

// Error
throw new Error('Something went wrong')
```

---

---

## ৫. Module System - Complete Guide

Node.js এ **প্রতিটি ফাইলই একটি module**। Code reusability এর জন্য module system অত্যন্ত গুরুত্বপূর্ণ।

### Module Types

```
1. Core Modules (Built-in)
   ├── fs (File System)
   ├── http (HTTP Server)
   ├── path (Path Operations)
   ├── crypto (Cryptography)
   └── ... many more

2. Local Modules (Your Files)
   ├── ./utils/helper.js
   ├── ./models/User.js
   └── ./controllers/auth.js

3. Third-party Modules (npm)
   ├── express
   ├── mongoose
   └── lodash
```

---

## CommonJS Modules (Default in Node.js)

### Exporting

#### Single Export (module.exports)

```javascript
// math.js
function add(a, b) {
    return a + b;
}

function subtract(a, b) {
    return a - b;
}

// Method 1: Export object
module.exports = {
    add: add,
    subtract: subtract
};

// Method 2: Export directly
module.exports = {
    add,  // Shorthand
    subtract
};

// Method 3: Export one by one
module.exports.add = add;
module.exports.subtract = subtract;

// Method 4: Export single function
module.exports = function(a, b) {
    return a + b;
};
```

#### Named Exports (exports shorthand)

```javascript
// utils.js
exports.sayHello = function(name) {
    return `Hello ${name}`;
};

exports.sayBye = function(name) {
    return `Bye ${name}`;
};

// ⚠️ Warning: Don't reassign exports!
// ❌ exports = { ... }  // Won't work!
// ✅ module.exports = { ... }  // Works
```

### Importing (require)

```javascript
// Import entire module
const math = require('./math');
console.log(math.add(5, 3));  // 8

// Import with destructuring
const { add, subtract } = require('./math');
console.log(add(5, 3));  // 8

// Import core module
const fs = require('fs');
const path = require('path');

// Import third-party module
const express = require('express');
const mongoose = require('mongoose');

// Import JSON
const config = require('./config.json');
console.log(config.port);  // Auto-parsed JSON
```

---

## ES Modules (Modern JavaScript)

Node.js 12+ supports ES Modules। Enable করতে হবে:

### Enable ES Modules

```json
// package.json
{
  "type": "module"
}
```

অথবা file extension `.mjs` use করুন:
```
app.mjs
utils.mjs
```

### Exporting

```javascript
// math.mjs

// Named exports
export function add(a, b) {
    return a + b;
}

export function subtract(a, b) {
    return a - b;
}

export const PI = 3.14159;

// Default export
export default function multiply(a, b) {
    return a * b;
}

// Or export at the end
function divide(a, b) {
    return a / b;
}

export { divide };
```

### Importing

```javascript
// Import named exports
import { add, subtract, PI } from './math.mjs';

// Import default export
import multiply from './math.mjs';

// Import everything
import * as math from './math.mjs';
console.log(math.add(5, 3));
console.log(math.PI);

// Import with alias
import { add as addition } from './math.mjs';

// Import both default and named
import multiply, { add, subtract } from './math.mjs';

// Dynamic import (async)
const math = await import('./math.mjs');
console.log(math.add(5, 3));
```

---

## CommonJS vs ES Modules

| Feature | CommonJS | ES Modules |
|---------|----------|------------|
| Syntax | `require()` / `module.exports` | `import` / `export` |
| Loading | Synchronous | Asynchronous |
| Usage | Default in Node.js | Need `"type": "module"` |
| File Extension | `.js` | `.mjs` or `.js` with config |
| Default Export | `module.exports = ...` | `export default ...` |
| Named Export | `exports.name = ...` | `export const name = ...` |
| Dynamic Import | `require(variable)` | `await import(variable)` |
| Top-level await | ❌ Not supported | ✅ Supported |
| `__dirname` | ✅ Available | ❌ Not available |
| Tree Shaking | ❌ Limited | ✅ Better |
| Browser Support | ❌ No | ✅ Yes |

### Migration Example

```javascript
// CommonJS
const express = require('express');
const { User } = require('./models/User');

module.exports = {
    createUser,
    deleteUser
};

// ES Modules
import express from 'express';
import { User } from './models/User.js';  // Note: .js extension required!

export { createUser, deleteUser };
```

---

## Module Caching

Node.js **caches** modules after first load।

```javascript
// counter.js
let count = 0;

module.exports = {
    increment: () => ++count,
    getCount: () => count
};

// app.js
const counter1 = require('./counter');
const counter2 = require('./counter');

counter1.increment();
console.log(counter2.getCount());  // 1 (same instance!)

// Both point to same cached module
console.log(counter1 === counter2);  // true
```

**Clear cache (if needed):**
```javascript
delete require.cache[require.resolve('./counter')];
```

---

## Module Wrapping

Node.js wraps every module in a function:

```javascript
// Your code:
const x = 10;
console.log(x);

// Actually wrapped like this:
(function(exports, require, module, __filename, __dirname) {
    const x = 10;
    console.log(x);
});
```

**This is why:**
- Variables are scoped to module (not global)
- `require`, `module`, `exports` are available
- `__filename`, `__dirname` are available

---

## Module Resolution

Node.js এ `require()` কিভাবে module খুঁজে?

```javascript
require('express');
// Search order:
// 1. Core modules (if exists)
// 2. node_modules/express (current directory)
// 3. node_modules/express (parent directory)
// 4. node_modules/express (parent's parent)
// ... continues up to root

require('./math');
// Tries in order:
// 1. ./math.js
// 2. ./math.json
// 3. ./math.node (C++ addon)
// 4. ./math/index.js
// 5. ./math/package.json (main field)

require('./utils/helper');
// Relative path - starts from current directory
```

---

## Circular Dependencies

যখন দুটি module একে অপরকে import করে।

```javascript
// a.js
console.log('a starting');
exports.done = false;
const b = require('./b');
console.log('in a, b.done =', b.done);
exports.done = true;
console.log('a done');

// b.js
console.log('b starting');
exports.done = false;
const a = require('./a');  // Circular!
console.log('in b, a.done =', a.done);
exports.done = true;
console.log('b done');

// main.js
const a = require('./a');
const b = require('./b');

// Output:
// a starting
// b starting
// in b, a.done = false  (a not finished yet!)
// b done
// in a, b.done = true
// a done
```

**Solution:** Restructure to avoid circular dependencies।

---

## Best Practices

### 1. Use Descriptive Names

```javascript
// ❌ Bad
const u = require('./u');
const x = require('./x');

// ✅ Good
const userController = require('./userController');
const authMiddleware = require('./authMiddleware');
```

### 2. Group Imports

```javascript
// Core modules first
const fs = require('fs');
const path = require('path');

// Third-party modules
const express = require('express');
const mongoose = require('mongoose');

// Local modules
const userController = require('./controllers/user');
const authMiddleware = require('./middleware/auth');
```

### 3. Use Destructuring

```javascript
// ❌ OK but verbose
const express = require('express');
const router = express.Router();

// ✅ Better
const { Router } = require('express');
const router = Router();
```

### 4. Export at the End (ES Modules)

```javascript
// ✅ Clean structure
function add(a, b) { return a + b; }
function subtract(a, b) { return a - b; }
function multiply(a, b) { return a * b; }

export { add, subtract, multiply };
```

### 5. Use index.js for Directories

```
utils/
├── math.js
├── string.js
└── index.js

// index.js
module.exports = {
    ...require('./math'),
    ...require('./string')
};

// Usage
const utils = require('./utils');  // Imports index.js automatically
```

---

## Advanced Module Patterns

### 1. Singleton Pattern

```javascript
// database.js
class Database {
    constructor() {
        if (Database.instance) {
            return Database.instance;
        }
        this.connection = null;
        Database.instance = this;
    }
    
    connect() {
        this.connection = 'connected';
    }
}

module.exports = new Database();  // Export instance

// Usage - always same instance
const db1 = require('./database');
const db2 = require('./database');
console.log(db1 === db2);  // true
```

### 2. Factory Pattern

```javascript
// userFactory.js
module.exports = function createUser(name, email) {
    return {
        name,
        email,
        createdAt: new Date()
    };
};

// Usage
const createUser = require('./userFactory');
const user1 = createUser('John', 'john@example.com');
```

### 3. Revealing Module Pattern

```javascript
// calculator.js
module.exports = (() => {
    // Private variables
    let result = 0;
    
    // Private functions
    function log(msg) {
        console.log(msg);
    }
    
    // Public API
    return {
        add: (n) => {
            result += n;
            log(`Added ${n}`);
            return result;
        },
        getResult: () => result
    };
})();

// Usage
const calc = require('./calculator');
calc.add(5);  // "Added 5"
calc.getResult();  // 5
// calc.log() - Not accessible (private)
```

---

## Module Best Practices Summary

✅ **Use ES Modules** for new projects (modern syntax)  
✅ **Keep modules small** and focused (single responsibility)  
✅ **Avoid circular dependencies** (refactor if needed)  
✅ **Use clear naming** (descriptive file names)  
✅ **Group related modules** in directories  
✅ **Export only what's needed** (don't expose everything)  
✅ **Document exports** (JSDoc comments)  
❌ **Don't modify require.cache** (unless absolutely necessary)  
❌ **Don't use global variables** (use module.exports)  
❌ **Don't mix CommonJS and ES Modules** in same file

---

## Summary

Node.js Core Concepts আপনার জানা থাকলে:
- ✅ Performance bottlenecks identify করতে পারবেন
- ✅ Scalable applications build করতে পারবেন
- ✅ Debugging সহজ হবে
- ✅ Best practices follow করতে পারবেন
- ✅ Interview questions handle করতে পারবেন

**মনে রাখবেন:**
1. Node.js = Single-threaded event loop + Thread pool (libuv)
2. Event loop = Heart of Node.js (6 phases)
3. Always use async/non-blocking operations
4. Process object = Process control & information
5. Modules = Code organization & reusability

এই concepts মাস্টার করলে আপনি Node.js expert! 🚀
