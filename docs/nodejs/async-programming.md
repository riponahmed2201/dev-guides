# Asynchronous Programming Deep Dive - সম্পূর্ণ গাইড

Asynchronous programming হলো Node.js এর core strength। এই গাইডে আপনি শিখবেন Event Loop কিভাবে কাজ করে, async operations কিভাবে handle হয়, এবং advanced concurrency patterns।

## 📑 Table of Contents

### Core Concepts
1. [Event Loop বিস্তারিত](#event-loop-বিস্তারিত)
2. [Microtasks vs Macrotasks](#microtasks-vs-macrotasks)
3. [Promise Internals](#promise-internals)

### Advanced Async
4. [Async Iterators](#async-iterators)
5. [Generators](#generators)

### Concurrency & Parallelism
6. [Worker Threads](#worker-threads)
7. [Child Processes](#child-processes)
8. [Cluster Module](#cluster-module-for-scaling)
9. [PM2 Process Manager](#pm2-process-manager)

### Production-Ready Async
10. [Async Best Practices & Performance](#async-best-practices--performance)
11. [AbortController & Cancellation](#abortcontroller--cancellation)
12. [Async Debugging & Monitoring](#async-debugging--monitoring)

---

## Event Loop বিস্তারিত

Event Loop হলো Node.js এর হৃদয় যা asynchronous operations handle করে।

### 1. Event Loop Architecture

```
   ┌───────────────────────────┐
┌─>│           timers          │ <- setTimeout, setInterval
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
│  │     pending callbacks     │ <- I/O callbacks deferred
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
│  │       idle, prepare       │ <- internal use only
│  └─────────────┬─────────────┘      ┌───────────────┐
│  ┌─────────────┴─────────────┐      │   incoming:   │
│  │           poll            │<─────┤  connections, │
│  └─────────────┬─────────────┘      │   data, etc.  │
│  ┌─────────────┴─────────────┐      └───────────────┘
│  │           check           │ <- setImmediate
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
└──┤      close callbacks      │ <- socket.on('close', ...)
   └───────────────────────────┘
```

### 2. Event Loop Phases বিস্তারিত

```javascript
const fs = require('fs');

console.log('1. Start'); // Synchronous - immediately

setTimeout(() => {
  console.log('2. setTimeout'); // Timers phase
}, 0);

setImmediate(() => {
  console.log('3. setImmediate'); // Check phase
});

fs.readFile(__filename, () => {
  console.log('4. File read'); // Poll phase
  
  setTimeout(() => {
    console.log('5. setTimeout inside readFile');
  }, 0);
  
  setImmediate(() => {
    console.log('6. setImmediate inside readFile');
  });
});

Promise.resolve().then(() => {
  console.log('7. Promise'); // Microtask - after each phase
});

process.nextTick(() => {
  console.log('8. nextTick'); // Microtask - highest priority
});

console.log('9. End'); // Synchronous - immediately

/*
Output:
1. Start
9. End
8. nextTick
7. Promise
2. setTimeout
3. setImmediate
4. File read
6. setImmediate inside readFile
5. setTimeout inside readFile
*/
```

**ব্যাখ্যা:**
1. **Synchronous code** প্রথমে execute হয়
2. **process.nextTick()** সবার আগে (microtask queue)
3. **Promise** তারপর (microtask queue)
4. **setTimeout** (timers phase)
5. **setImmediate** (check phase)

### 3. Call Stack, Callback Queue, Event Loop

```javascript
// Visual representation
console.log('Start');

setTimeout(() => {
  console.log('Timeout 1');
  Promise.resolve().then(() => console.log('Promise in Timeout'));
}, 0);

Promise.resolve()
  .then(() => {
    console.log('Promise 1');
    setTimeout(() => console.log('Timeout in Promise'), 0);
  })
  .then(() => console.log('Promise 2'));

console.log('End');

/*
Call Stack execution order:
1. console.log('Start') - executes immediately
2. setTimeout registered - goes to Web APIs
3. Promise.resolve() - microtask queue
4. console.log('End') - executes immediately

After call stack is empty:
5. Microtask queue (promises) executes
6. Then macrotask queue (setTimeout)
*/
```

### 4. Blocking vs Non-blocking

**Blocking (Bad):**
```javascript
const fs = require('fs');

console.log('Start');

// ❌ Blocks entire event loop
const data = fs.readFileSync('large-file.txt', 'utf8');
console.log(data);

console.log('End');
```

**Non-blocking (Good):**
```javascript
const fs = require('fs');

console.log('Start');

// ✅ Non-blocking - doesn't block event loop
fs.readFile('large-file.txt', 'utf8', (err, data) => {
  if (err) throw err;
  console.log(data);
});

console.log('End');
// End prints first, then file content
```

### 5. Event Loop Monitoring

```javascript
const { performance } = require('perf_hooks');

function checkEventLoopDelay() {
  const start = performance.now();
  
  setImmediate(() => {
    const delay = performance.now() - start;
    
    if (delay > 100) {
      console.warn(`⚠️ Event loop delay: ${delay.toFixed(2)}ms`);
    }
    
    // Check continuously
    checkEventLoopDelay();
  });
}

checkEventLoopDelay();

// Simulate blocking operation
function blockEventLoop(ms) {
  const start = Date.now();
  while (Date.now() - start < ms) {
    // Blocking
  }
}

// Test
setTimeout(() => {
  blockEventLoop(200); // This will show warning
}, 1000);
```

### 6. setImmediate vs setTimeout(0)

```javascript
// Outside I/O cycle - order not guaranteed
setTimeout(() => console.log('setTimeout'), 0);
setImmediate(() => console.log('setImmediate'));

// Inside I/O cycle - setImmediate always first
const fs = require('fs');
fs.readFile(__filename, () => {
  setTimeout(() => console.log('setTimeout in I/O'), 0);
  setImmediate(() => console.log('setImmediate in I/O'));
  // setImmediate will always execute first here
});
```

**Rule:** I/O callbacks এর ভিতরে `setImmediate` সবসময় `setTimeout(0)` এর আগে execute হবে।

---

## Microtasks vs Macrotasks

Node.js এ দুই ধরনের task queue আছে।

### 1. Microtasks (High Priority)

```javascript
// Microtask sources:
// 1. process.nextTick()
// 2. Promises (.then, .catch, .finally)
// 3. queueMicrotask()

console.log('1. Script start');

setTimeout(() => console.log('2. setTimeout'), 0);

Promise.resolve()
  .then(() => console.log('3. Promise 1'))
  .then(() => console.log('4. Promise 2'));

process.nextTick(() => console.log('5. nextTick'));

queueMicrotask(() => console.log('6. queueMicrotask'));

console.log('7. Script end');

/*
Output:
1. Script start
7. Script end
5. nextTick (highest priority microtask)
3. Promise 1
4. Promise 2
6. queueMicrotask
2. setTimeout (macrotask)
*/
```

### 2. Macrotasks (Lower Priority)

```javascript
// Macrotask sources:
// 1. setTimeout
// 2. setInterval
// 3. setImmediate
// 4. I/O operations
// 5. UI rendering (browser only)

setTimeout(() => console.log('setTimeout 1'), 0);
setTimeout(() => console.log('setTimeout 2'), 0);
setImmediate(() => console.log('setImmediate'));

// All macrotasks wait for microtasks to complete
```

### 3. Microtask Queue Starvation

```javascript
// ⚠️ Warning: Infinite microtask recursion blocks event loop
function infiniteMicrotask() {
  Promise.resolve().then(() => {
    console.log('Microtask');
    infiniteMicrotask(); // Recursive microtask
  });
}

// infiniteMicrotask(); // Don't run this!

// Macrotasks will never execute
setTimeout(() => {
  console.log('This will never run!');
}, 0);
```

**Solution:**
```javascript
function safeMicrotask(count = 0) {
  if (count < 10) {
    Promise.resolve().then(() => {
      console.log('Microtask', count);
      safeMicrotask(count + 1);
    });
  }
}

safeMicrotask(); // Stops after 10 iterations
```

### 4. Priority Order

```javascript
console.log('1');

setTimeout(() => console.log('2'), 0);

Promise.resolve()
  .then(() => console.log('3'))
  .then(() => console.log('4'));

process.nextTick(() => {
  console.log('5');
  process.nextTick(() => console.log('6'));
});

setImmediate(() => console.log('7'));

console.log('8');

/*
Priority order:
1. Synchronous code (1, 8)
2. process.nextTick() queue (5, 6)
3. Promise microtasks (3, 4)
4. setTimeout (2)
5. setImmediate (7)
*/
```

### 5. Real-world Example

```javascript
async function processUsers(users) {
  console.log('Start processing');
  
  for (const user of users) {
    // Process each user in microtask
    await Promise.resolve(); // Yield to event loop
    
    await processUser(user);
  }
  
  console.log('All users processed');
}

async function processUser(user) {
  // Simulate async operation
  return new Promise(resolve => {
    setTimeout(() => {
      console.log(`Processed: ${user.name}`);
      resolve();
    }, 100);
  });
}

const users = [
  { name: 'Alice' },
  { name: 'Bob' },
  { name: 'Charlie' }
];

processUsers(users);

// Event loop can handle other operations between users
setTimeout(() => {
  console.log('Other operation');
}, 50);
```

---

## Promise Internals

Promise কিভাবে internally কাজ করে তার deep dive।

### 1. Promise States

```javascript
// Promise has 3 states:
// 1. Pending - initial state
// 2. Fulfilled - operation completed successfully
// 3. Rejected - operation failed

const promise = new Promise((resolve, reject) => {
  // Pending state
  console.log('Promise executor runs immediately');
  
  setTimeout(() => {
    const success = Math.random() > 0.5;
    
    if (success) {
      resolve('Success!'); // -> Fulfilled
    } else {
      reject(new Error('Failed!')); // -> Rejected
    }
  }, 1000);
});

promise
  .then(result => console.log('Fulfilled:', result))
  .catch(error => console.error('Rejected:', error));
```

### 2. Promise Implementation (Simplified)

```javascript
class SimplePromise {
  constructor(executor) {
    this.state = 'pending';
    this.value = undefined;
    this.handlers = [];
    
    try {
      executor(this._resolve.bind(this), this._reject.bind(this));
    } catch (error) {
      this._reject(error);
    }
  }
  
  _resolve(value) {
    if (this.state !== 'pending') return;
    
    this.state = 'fulfilled';
    this.value = value;
    this.handlers.forEach(handler => handler.onFulfilled(value));
  }
  
  _reject(error) {
    if (this.state !== 'pending') return;
    
    this.state = 'rejected';
    this.value = error;
    this.handlers.forEach(handler => handler.onRejected(error));
  }
  
  then(onFulfilled, onRejected) {
    return new SimplePromise((resolve, reject) => {
      const handler = {
        onFulfilled: value => {
          if (!onFulfilled) return resolve(value);
          try {
            resolve(onFulfilled(value));
          } catch (error) {
            reject(error);
          }
        },
        onRejected: error => {
          if (!onRejected) return reject(error);
          try {
            resolve(onRejected(error));
          } catch (err) {
            reject(err);
          }
        }
      };
      
      if (this.state === 'pending') {
        this.handlers.push(handler);
      } else if (this.state === 'fulfilled') {
        handler.onFulfilled(this.value);
      } else {
        handler.onRejected(this.value);
      }
    });
  }
  
  catch(onRejected) {
    return this.then(null, onRejected);
  }
}

// Usage
const promise = new SimplePromise((resolve, reject) => {
  setTimeout(() => resolve('Done!'), 1000);
});

promise
  .then(result => console.log(result))
  .catch(error => console.error(error));
```

### 3. Promise Chaining

```javascript
// Each .then() returns a new Promise
Promise.resolve(1)
  .then(value => {
    console.log(value); // 1
    return value + 1;
  })
  .then(value => {
    console.log(value); // 2
    return value + 1;
  })
  .then(value => {
    console.log(value); // 3
    // Return another promise
    return new Promise(resolve => {
      setTimeout(() => resolve(value + 1), 1000);
    });
  })
  .then(value => {
    console.log(value); // 4 (after 1 second)
  });
```

### 4. Promise.all Implementation

```javascript
Promise.customAll = function(promises) {
  return new Promise((resolve, reject) => {
    if (!Array.isArray(promises)) {
      return reject(new TypeError('Argument must be an array'));
    }
    
    const results = [];
    let completed = 0;
    
    if (promises.length === 0) {
      return resolve(results);
    }
    
    promises.forEach((promise, index) => {
      Promise.resolve(promise)
        .then(value => {
          results[index] = value;
          completed++;
          
          if (completed === promises.length) {
            resolve(results);
          }
        })
        .catch(reject); // Reject on first error
    });
  });
};

// Usage
Promise.customAll([
  Promise.resolve(1),
  Promise.resolve(2),
  Promise.resolve(3)
]).then(results => console.log(results)); // [1, 2, 3]
```

### 5. Promise.race Implementation

```javascript
Promise.customRace = function(promises) {
  return new Promise((resolve, reject) => {
    if (!Array.isArray(promises)) {
      return reject(new TypeError('Argument must be an array'));
    }
    
    promises.forEach(promise => {
      Promise.resolve(promise)
        .then(resolve) // First to resolve wins
        .catch(reject); // First to reject wins
    });
  });
};

// Usage
Promise.customRace([
  new Promise(resolve => setTimeout(() => resolve('slow'), 2000)),
  new Promise(resolve => setTimeout(() => resolve('fast'), 1000))
]).then(result => console.log(result)); // 'fast'
```

### 6. Promise.allSettled Implementation

```javascript
Promise.customAllSettled = function(promises) {
  return new Promise(resolve => {
    const results = [];
    let completed = 0;
    
    if (promises.length === 0) {
      return resolve(results);
    }
    
    promises.forEach((promise, index) => {
      Promise.resolve(promise)
        .then(value => {
          results[index] = { status: 'fulfilled', value };
        })
        .catch(reason => {
          results[index] = { status: 'rejected', reason };
        })
        .finally(() => {
          completed++;
          if (completed === promises.length) {
            resolve(results);
          }
        });
    });
  });
};

// Usage
Promise.customAllSettled([
  Promise.resolve(1),
  Promise.reject('error'),
  Promise.resolve(3)
]).then(results => console.log(results));
/*
[
  { status: 'fulfilled', value: 1 },
  { status: 'rejected', reason: 'error' },
  { status: 'fulfilled', value: 3 }
]
*/
```

---

## Async Iterators

Async iterators ব্যবহার করে asynchronous data streams iterate করা যায়।

### 1. Basic Async Iterator

```javascript
const asyncIterable = {
  [Symbol.asyncIterator]() {
    let i = 0;
    
    return {
      async next() {
        if (i < 3) {
          // Simulate async operation
          await new Promise(resolve => setTimeout(resolve, 1000));
          return { value: i++, done: false };
        }
        return { done: true };
      }
    };
  }
};

// Using for-await-of
(async () => {
  for await (const num of asyncIterable) {
    console.log(num); // 0, 1, 2 (each after 1 second)
  }
})();
```

### 2. Async Generator Function

```javascript
async function* asyncGenerator() {
  yield await Promise.resolve(1);
  yield await Promise.resolve(2);
  yield await Promise.resolve(3);
}

(async () => {
  for await (const num of asyncGenerator()) {
    console.log(num); // 1, 2, 3
  }
})();
```

### 3. Real-world Example - Paginated API

```javascript
async function* fetchPaginatedData(url) {
  let page = 1;
  let hasMore = true;
  
  while (hasMore) {
    const response = await fetch(`${url}?page=${page}`);
    const data = await response.json();
    
    yield data.items;
    
    hasMore = data.hasNextPage;
    page++;
  }
}

// Usage
(async () => {
  const apiUrl = 'https://api.example.com/users';
  
  for await (const items of fetchPaginatedData(apiUrl)) {
    console.log(`Processing ${items.length} items from page`);
    items.forEach(item => console.log(item));
  }
})();
```

### 4. File Streaming Example

```javascript
const fs = require('fs');
const readline = require('readline');

async function* readLines(filename) {
  const fileStream = fs.createReadStream(filename);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });
  
  for await (const line of rl) {
    yield line;
  }
}

// Usage
(async () => {
  for await (const line of readLines('large-file.txt')) {
    console.log(`Line: ${line}`);
  }
})();
```

### 5. Custom Async Iterator - Database Cursor

```javascript
class DatabaseCursor {
  constructor(query, batchSize = 100) {
    this.query = query;
    this.batchSize = batchSize;
    this.offset = 0;
  }
  
  async *[Symbol.asyncIterator]() {
    while (true) {
      // Simulate database query
      const results = await this.fetchBatch();
      
      if (results.length === 0) break;
      
      for (const result of results) {
        yield result;
      }
      
      if (results.length < this.batchSize) break;
      
      this.offset += this.batchSize;
    }
  }
  
  async fetchBatch() {
    // Simulate async database call
    return new Promise(resolve => {
      setTimeout(() => {
        const items = [];
        for (let i = 0; i < this.batchSize && this.offset + i < 1000; i++) {
          items.push({ id: this.offset + i, data: `Item ${this.offset + i}` });
        }
        resolve(items);
      }, 100);
    });
  }
}

// Usage
(async () => {
  const cursor = new DatabaseCursor('SELECT * FROM users', 100);
  
  for await (const user of cursor) {
    console.log(user);
  }
})();
```

---

## Generators

Generator functions ব্যবহার করে pausable functions তৈরি করা যায়।

### 1. Basic Generator

```javascript
function* simpleGenerator() {
  console.log('Before first yield');
  yield 1;
  
  console.log('Before second yield');
  yield 2;
  
  console.log('Before third yield');
  yield 3;
  
  console.log('After last yield');
}

const gen = simpleGenerator();

console.log(gen.next()); // { value: 1, done: false }
console.log(gen.next()); // { value: 2, done: false }
console.log(gen.next()); // { value: 3, done: false }
console.log(gen.next()); // { value: undefined, done: true }
```

### 2. Generator with Input

```javascript
function* generatorWithInput() {
  const a = yield 'First';
  console.log('Received:', a);
  
  const b = yield 'Second';
  console.log('Received:', b);
  
  return a + b;
}

const gen = generatorWithInput();

console.log(gen.next());      // { value: 'First', done: false }
console.log(gen.next(10));    // Received: 10, { value: 'Second', done: false }
console.log(gen.next(20));    // Received: 20, { value: 30, done: true }
```

### 3. Infinite Generator

```javascript
function* idGenerator() {
  let id = 1;
  while (true) {
    yield id++;
  }
}

const ids = idGenerator();

console.log(ids.next().value); // 1
console.log(ids.next().value); // 2
console.log(ids.next().value); // 3
```

### 4. Generator for Iteration

```javascript
function* range(start, end, step = 1) {
  for (let i = start; i <= end; i += step) {
    yield i;
  }
}

// Usage with for-of
for (const num of range(1, 10, 2)) {
  console.log(num); // 1, 3, 5, 7, 9
}

// Convert to array
const numbers = [...range(1, 5)];
console.log(numbers); // [1, 2, 3, 4, 5]
```

### 5. Delegating Generators

```javascript
function* generator1() {
  yield 1;
  yield 2;
}

function* generator2() {
  yield 'a';
  yield 'b';
}

function* combinedGenerator() {
  yield* generator1(); // Delegate to generator1
  yield* generator2(); // Delegate to generator2
  yield 'final';
}

const gen = combinedGenerator();

for (const value of gen) {
  console.log(value); // 1, 2, 'a', 'b', 'final'
}
```

### 6. Async Generator with Backpressure

```javascript
async function* asyncGeneratorWithBackpressure(items, processTime = 100) {
  for (const item of items) {
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, processTime));
    yield item;
  }
}

// Consumer controls the pace
(async () => {
  const items = Array.from({ length: 10 }, (_, i) => i + 1);
  const generator = asyncGeneratorWithBackpressure(items);
  
  for await (const item of generator) {
    console.log(`Processing: ${item}`);
    // Consumer can add delay here
    await new Promise(resolve => setTimeout(resolve, 200));
  }
})();
```

---

## Worker Threads

Worker Threads ব্যবহার করে CPU-intensive tasks parallel এ চালানো যায়।

### 1. Basic Worker Thread

**main.js:**
```javascript
const { Worker } = require('worker_threads');

function runWorker(workerData) {
  return new Promise((resolve, reject) => {
    const worker = new Worker('./worker.js', { workerData });
    
    worker.on('message', resolve);
    worker.on('error', reject);
    worker.on('exit', (code) => {
      if (code !== 0) {
        reject(new Error(`Worker stopped with exit code ${code}`));
      }
    });
  });
}

// Usage
(async () => {
  try {
    const result = await runWorker({ num: 42 });
    console.log('Result:', result);
  } catch (error) {
    console.error('Error:', error);
  }
})();
```

**worker.js:**
```javascript
const { parentPort, workerData } = require('worker_threads');

// CPU-intensive task
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

const result = fibonacci(workerData.num);

parentPort.postMessage(result);
```

### 2. Worker Pool

```javascript
const { Worker } = require('worker_threads');
const os = require('os');

class WorkerPool {
  constructor(workerScript, poolSize = os.cpus().length) {
    this.workerScript = workerScript;
    this.poolSize = poolSize;
    this.workers = [];
    this.queue = [];
    
    this.createWorkers();
  }
  
  createWorkers() {
    for (let i = 0; i < this.poolSize; i++) {
      const worker = new Worker(this.workerScript);
      worker.isBusy = false;
      this.workers.push(worker);
    }
  }
  
  async execute(data) {
    return new Promise((resolve, reject) => {
      const availableWorker = this.workers.find(w => !w.isBusy);
      
      if (availableWorker) {
        this.runTask(availableWorker, data, resolve, reject);
      } else {
        // Queue the task
        this.queue.push({ data, resolve, reject });
      }
    });
  }
  
  runTask(worker, data, resolve, reject) {
    worker.isBusy = true;
    
    worker.once('message', (result) => {
      worker.isBusy = false;
      resolve(result);
      
      // Process queue
      if (this.queue.length > 0) {
        const { data, resolve, reject } = this.queue.shift();
        this.runTask(worker, data, resolve, reject);
      }
    });
    
    worker.once('error', (error) => {
      worker.isBusy = false;
      reject(error);
    });
    
    worker.postMessage(data);
  }
  
  async terminate() {
    await Promise.all(this.workers.map(w => w.terminate()));
  }
}

// Usage
const pool = new WorkerPool('./calculator-worker.js', 4);

async function main() {
  const tasks = Array.from({ length: 10 }, (_, i) => i + 30);
  
  const results = await Promise.all(
    tasks.map(num => pool.execute({ operation: 'fibonacci', num }))
  );
  
  console.log('Results:', results);
  await pool.terminate();
}

main();
```

### 3. Shared Memory with SharedArrayBuffer

```javascript
const { Worker } = require('worker_threads');

// Main thread
const sharedBuffer = new SharedArrayBuffer(4);
const sharedArray = new Int32Array(sharedBuffer);

sharedArray[0] = 0; // Counter

const worker = new Worker(`
  const { parentPort, workerData } = require('worker_threads');
  const sharedArray = new Int32Array(workerData);
  
  // Increment counter 1000 times
  for (let i = 0; i < 1000; i++) {
    Atomics.add(sharedArray, 0, 1);
  }
  
  parentPort.postMessage('done');
`, { eval: true, workerData: sharedBuffer });

// Main thread also increments
for (let i = 0; i < 1000; i++) {
  Atomics.add(sharedArray, 0, 1);
}

worker.on('message', () => {
  console.log('Final count:', sharedArray[0]); // 2000
  worker.terminate();
});
```

---

## Child Processes

Child processes ব্যবহার করে external commands run করা যায়।

### 1. exec - Simple Command Execution

```javascript
const { exec } = require('child_process');

exec('ls -la', (error, stdout, stderr) => {
  if (error) {
    console.error(`Error: ${error.message}`);
    return;
  }
  
  if (stderr) {
    console.error(`Stderr: ${stderr}`);
    return;
  }
  
  console.log(`Output:\n${stdout}`);
});
```

### 2. spawn - Streaming Output

```javascript
const { spawn } = require('child_process');

const child = spawn('find', ['.', '-type', 'f']);

child.stdout.on('data', (data) => {
  console.log(`stdout: ${data}`);
});

child.stderr.on('data', (data) => {
  console.error(`stderr: ${data}`);
});

child.on('close', (code) => {
  console.log(`Process exited with code ${code}`);
});
```

### 3. fork - Node.js Process Communication

**main.js:**
```javascript
const { fork } = require('child_process');

const child = fork('./child.js');

child.on('message', (msg) => {
  console.log('Message from child:', msg);
});

child.send({ task: 'calculate', data: [1, 2, 3, 4, 5] });
```

**child.js:**
```javascript
process.on('message', (msg) => {
  if (msg.task === 'calculate') {
    const sum = msg.data.reduce((a, b) => a + b, 0);
    process.send({ result: sum });
  }
});
```

### 4. execFile - Execute Binary

```javascript
const { execFile } = require('child_process');

execFile('node', ['--version'], (error, stdout, stderr) => {
  if (error) {
    console.error(`Error: ${error.message}`);
    return;
  }
  console.log(`Node version: ${stdout}`);
});
```

---

## Cluster Module for Scaling

Cluster module ব্যবহার করে multi-core CPUs এ Node.js scale করা যায়।

### 1. Basic Cluster

```javascript
const cluster = require('cluster');
const http = require('http');
const os = require('os');

const numCPUs = os.cpus().length;

if (cluster.isMaster) {
  console.log(`Master ${process.pid} is running`);
  
  // Fork workers
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }
  
  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died`);
    console.log('Starting a new worker');
    cluster.fork();
  });
  
} else {
  // Workers share TCP connection
  http.createServer((req, res) => {
    res.writeHead(200);
    res.end(`Hello from worker ${process.pid}\n`);
  }).listen(8000);
  
  console.log(`Worker ${process.pid} started`);
}
```

### 2. Load Balancing

```javascript
const cluster = require('cluster');
const express = require('express');
const os = require('os');

if (cluster.isMaster) {
  const numWorkers = os.cpus().length;
  
  console.log(`Master cluster setting up ${numWorkers} workers...`);
  
  for (let i = 0; i < numWorkers; i++) {
    cluster.fork();
  }
  
  cluster.on('online', (worker) => {
    console.log(`Worker ${worker.process.pid} is online`);
  });
  
  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died with code: ${code}, signal: ${signal}`);
    console.log('Starting a new worker');
    cluster.fork();
  });
  
} else {
  const app = express();
  
  app.get('/', (req, res) => {
    // Simulate work
    const worker = cluster.worker.id;
    const pid = process.pid;
    
    res.json({
      worker,
      pid,
      message: 'Hello from cluster!'
    });
  });
  
  app.listen(3000, () => {
    console.log(`Worker ${process.pid} listening on port 3000`);
  });
}
```

---

## PM2 Process Manager

PM2 হলো production-ready process manager।

### 1. Installation & Basic Usage

```bash
npm install -g pm2

# Start app
pm2 start app.js

# Start with name
pm2 start app.js --name "my-api"

# Start cluster mode
pm2 start app.js -i max
```

### 2. Ecosystem File

**ecosystem.config.js:**
```javascript
module.exports = {
  apps: [{
    name: 'my-app',
    script: './app.js',
    instances: 'max',
    exec_mode: 'cluster',
    watch: true,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'development',
      PORT: 3000
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 8000
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z'
  }]
};
```

```bash
# Start with ecosystem file
pm2 start ecosystem.config.js

# Start in production mode
pm2 start ecosystem.config.js --env production
```

### 3. PM2 Commands

```bash
# List processes
pm2 list

# Monitor
pm2 monit

# Logs
pm2 logs
pm2 logs app-name

# Restart
pm2 restart app-name

# Stop
pm2 stop app-name

# Delete
pm2 delete app-name

# Save current process list
pm2 save

# Resurrect saved processes
pm2 resurrect

# Startup script
pm2 startup
```

---

## Async Best Practices & Performance

Production-level async code লেখার জন্য best practices এবং performance optimization techniques।

### 1. Common Async Patterns ✅

#### Pattern 1: Parallel Execution
```javascript
// ❌ BAD: Sequential (slow)
async function getUsers() {
  const user1 = await fetchUser(1);  // 1 sec
  const user2 = await fetchUser(2);  // 1 sec
  const user3 = await fetchUser(3);  // 1 sec
  return [user1, user2, user3];     // Total: 3 sec
}

// ✅ GOOD: Parallel (fast)
async function getUsersParallel() {
  const [user1, user2, user3] = await Promise.all([
    fetchUser(1),
    fetchUser(2),
    fetchUser(3)
  ]);
  return [user1, user2, user3];     // Total: 1 sec
}

// ✅ BETTER: With error handling
async function getUsersSafe() {
  const results = await Promise.allSettled([
    fetchUser(1),
    fetchUser(2),
    fetchUser(3)
  ]);
  
  return results
    .filter(r => r.status === 'fulfilled')
    .map(r => r.value);
}
```

#### Pattern 2: Rate Limiting
```javascript
// ✅ Controlled Concurrency
class AsyncQueue {
  constructor(concurrency = 3) {
    this.concurrency = concurrency;
    this.running = 0;
    this.queue = [];
  }
  
  async run(fn) {
    while (this.running >= this.concurrency) {
      await new Promise(resolve => this.queue.push(resolve));
    }
    
    this.running++;
    
    try {
      return await fn();
    } finally {
      this.running--;
      const resolve = this.queue.shift();
      if (resolve) resolve();
    }
  }
}

// Usage
const queue = new AsyncQueue(3); // Max 3 concurrent

const userIds = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const users = await Promise.all(
  userIds.map(id => queue.run(() => fetchUser(id)))
);
```

#### Pattern 3: Batch Processing
```javascript
// ✅ Process in Batches
async function processBatch(items, batchSize = 5) {
  const results = [];
  
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    const batchResults = await Promise.all(
      batch.map(item => processItem(item))
    );
    results.push(...batchResults);
    
    // Optional: delay between batches
    if (i + batchSize < items.length) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }
  
  return results;
}

// Usage
const items = Array.from({ length: 100 }, (_, i) => i);
const results = await processBatch(items, 10);
```

### 2. Common Anti-Patterns ❌

#### Anti-Pattern 1: Unhandled Promise Rejections
```javascript
// ❌ BAD: Silent failure
async function badExample() {
  fetchData(); // Missing await - promise floating!
  return 'done';
}

// ✅ GOOD: Proper handling
async function goodExample() {
  try {
    await fetchData();
    return 'done';
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

// ✅ BETTER: Global handler (backup)
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // Log to monitoring service
  logger.error({ reason, promise });
});
```

#### Anti-Pattern 2: Callback Hell in Async/Await
```javascript
// ❌ BAD: Nested callbacks
async function badNesting() {
  return fetchUser().then(user => {
    return fetchPosts(user.id).then(posts => {
      return fetchComments(posts[0].id).then(comments => {
        return { user, posts, comments };
      });
    });
  });
}

// ✅ GOOD: Flat structure
async function goodStructure() {
  const user = await fetchUser();
  const posts = await fetchPosts(user.id);
  const comments = await fetchComments(posts[0].id);
  return { user, posts, comments };
}

// ✅ BETTER: Parallel when possible
async function betterStructure() {
  const user = await fetchUser();
  const [posts, profile] = await Promise.all([
    fetchPosts(user.id),
    fetchProfile(user.id)
  ]);
  const comments = await fetchComments(posts[0].id);
  return { user, posts, profile, comments };
}
```

#### Anti-Pattern 3: Memory Leaks
```javascript
// ❌ BAD: Memory leak
class DataProcessor {
  constructor() {
    this.cache = new Map();
  }
  
  async processData(id) {
    const data = await fetchData(id);
    this.cache.set(id, data); // Never cleaned up!
    return data;
  }
}

// ✅ GOOD: With cleanup
class DataProcessorSafe {
  constructor(maxSize = 100) {
    this.cache = new Map();
    this.maxSize = maxSize;
  }
  
  async processData(id) {
    // Check cache first
    if (this.cache.has(id)) {
      return this.cache.get(id);
    }
    
    const data = await fetchData(id);
    
    // LRU eviction
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
    
    this.cache.set(id, data);
    return data;
  }
  
  cleanup() {
    this.cache.clear();
  }
}
```

### 3. Performance Optimization

#### Optimization 1: Lazy Loading
```javascript
// ✅ Load only when needed
class DatabaseConnection {
  constructor() {
    this._connection = null;
  }
  
  async getConnection() {
    if (!this._connection) {
      this._connection = await this.connect();
    }
    return this._connection;
  }
  
  async connect() {
    console.log('Connecting to database...');
    // Expensive operation
    return await createConnection();
  }
  
  async query(sql) {
    const conn = await this.getConnection();
    return conn.query(sql);
  }
}
```

#### Optimization 2: Memoization
```javascript
// ✅ Cache expensive async operations
function asyncMemoize(fn) {
  const cache = new Map();
  
  return async function(...args) {
    const key = JSON.stringify(args);
    
    if (cache.has(key)) {
      console.log('Cache hit!');
      return cache.get(key);
    }
    
    console.log('Cache miss, executing...');
    const result = await fn.apply(this, args);
    cache.set(key, result);
    return result;
  };
}

// Usage
const expensiveOperation = asyncMemoize(async (n) => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return n * n;
});

console.time('first');
await expensiveOperation(5); // Takes 1 sec
console.timeEnd('first');

console.time('second');
await expensiveOperation(5); // Instant (cached)
console.timeEnd('second');
```

#### Optimization 3: Debouncing Async Calls
```javascript
// ✅ Prevent duplicate calls
function asyncDebounce(fn, delay = 300) {
  let timeoutId;
  let lastPromise;
  
  return function(...args) {
    clearTimeout(timeoutId);
    
    return new Promise((resolve, reject) => {
      timeoutId = setTimeout(async () => {
        try {
          lastPromise = fn.apply(this, args);
          const result = await lastPromise;
          resolve(result);
        } catch (error) {
          reject(error);
        }
      }, delay);
    });
  };
}

// Usage: Search API
const searchAPI = asyncDebounce(async (query) => {
  const response = await fetch(`/api/search?q=${query}`);
  return response.json();
}, 300);

// User types fast - only last call executes
await searchAPI('h');
await searchAPI('he');
await searchAPI('hel');
await searchAPI('hello'); // Only this executes
```

### 4. Memory Management

#### Strategy 1: Stream Large Data
```javascript
// ❌ BAD: Load everything in memory
async function processLargeFileBad(filename) {
  const data = await fs.promises.readFile(filename, 'utf8');
  return data.split('\n').map(line => processLine(line));
}

// ✅ GOOD: Stream processing
const fs = require('fs');
const readline = require('readline');

async function processLargeFileGood(filename) {
  const fileStream = fs.createReadStream(filename);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });
  
  const results = [];
  for await (const line of rl) {
    results.push(processLine(line));
  }
  
  return results;
}
```

#### Strategy 2: Generator for Large Sets
```javascript
// ✅ Memory efficient iteration
async function* fetchAllUsers() {
  let page = 1;
  let hasMore = true;
  
  while (hasMore) {
    const response = await fetch(`/api/users?page=${page}`);
    const data = await response.json();
    
    for (const user of data.users) {
      yield user;
    }
    
    hasMore = data.hasMore;
    page++;
  }
}

// Usage: Process one at a time
for await (const user of fetchAllUsers()) {
  await processUser(user);
  // Only one user in memory at a time
}
```

#### Strategy 3: Cleanup Resources
```javascript
// ✅ Proper resource cleanup
class ResourceManager {
  constructor() {
    this.resources = new Set();
  }
  
  async acquire(createResource) {
    const resource = await createResource();
    this.resources.add(resource);
    return resource;
  }
  
  async release(resource) {
    if (this.resources.has(resource)) {
      if (resource.close) await resource.close();
      if (resource.destroy) await resource.destroy();
      this.resources.delete(resource);
    }
  }
  
  async cleanup() {
    const promises = Array.from(this.resources).map(r => this.release(r));
    await Promise.allSettled(promises);
  }
}

// Usage
const manager = new ResourceManager();

try {
  const db = await manager.acquire(() => connectDatabase());
  const cache = await manager.acquire(() => connectRedis());
  
  // Use resources
  await db.query('SELECT * FROM users');
} finally {
  await manager.cleanup(); // Always cleanup
}
```

### 5. Performance Monitoring

```javascript
// ✅ Track async operation performance
class PerformanceTracker {
  constructor() {
    this.metrics = new Map();
  }
  
  async track(name, fn) {
    const start = Date.now();
    
    try {
      const result = await fn();
      const duration = Date.now() - start;
      
      this.recordMetric(name, duration, 'success');
      return result;
    } catch (error) {
      const duration = Date.now() - start;
      this.recordMetric(name, duration, 'error');
      throw error;
    }
  }
  
  recordMetric(name, duration, status) {
    if (!this.metrics.has(name)) {
      this.metrics.set(name, {
        count: 0,
        totalDuration: 0,
        errors: 0,
        successes: 0
      });
    }
    
    const metric = this.metrics.get(name);
    metric.count++;
    metric.totalDuration += duration;
    metric[status === 'success' ? 'successes' : 'errors']++;
  }
  
  getStats(name) {
    const metric = this.metrics.get(name);
    if (!metric) return null;
    
    return {
      avgDuration: metric.totalDuration / metric.count,
      count: metric.count,
      successRate: (metric.successes / metric.count) * 100,
      errors: metric.errors
    };
  }
  
  report() {
    console.log('\n📊 Performance Report:');
    for (const [name, stats] of this.metrics.entries()) {
      console.log(`\n${name}:`);
      console.log(`  Calls: ${stats.count}`);
      console.log(`  Avg Duration: ${(stats.totalDuration / stats.count).toFixed(2)}ms`);
      console.log(`  Success Rate: ${((stats.successes / stats.count) * 100).toFixed(2)}%`);
    }
  }
}

// Usage
const tracker = new PerformanceTracker();

await tracker.track('fetchUser', () => fetchUser(1));
await tracker.track('fetchPosts', () => fetchPosts());

tracker.report();
```

---

## AbortController & Cancellation

Modern request cancellation এবং timeout handling using AbortController API।

### 1. Basic AbortController

```javascript
// ✅ Basic cancellation
async function fetchWithTimeout(url, timeout = 5000) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(url, {
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    return await response.json();
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error(`Request timeout after ${timeout}ms`);
    }
    throw error;
  }
}

// Usage
try {
  const data = await fetchWithTimeout('https://api.example.com/slow', 3000);
  console.log(data);
} catch (error) {
  console.error('Request failed:', error.message);
}
```

### 2. Manual Cancellation

```javascript
// ✅ User-triggered cancellation
class CancellableRequest {
  constructor() {
    this.controller = null;
  }
  
  async fetch(url) {
    // Cancel previous request if exists
    if (this.controller) {
      this.controller.abort();
    }
    
    this.controller = new AbortController();
    
    try {
      const response = await fetch(url, {
        signal: this.controller.signal
      });
      return await response.json();
    } catch (error) {
      if (error.name === 'AbortError') {
        console.log('Request cancelled');
        return null;
      }
      throw error;
    }
  }
  
  cancel() {
    if (this.controller) {
      this.controller.abort();
      this.controller = null;
    }
  }
}

// Usage: Search with cancellation
const searchRequest = new CancellableRequest();

async function handleSearch(query) {
  const results = await searchRequest.fetch(`/api/search?q=${query}`);
  if (results) {
    displayResults(results);
  }
}

// User types fast - previous requests cancelled
handleSearch('h');
handleSearch('he');
handleSearch('hel'); // Previous 2 cancelled
```

### 3. Multiple Operations with Single Controller

```javascript
// ✅ Cancel multiple operations together
async function fetchUserData(userId, signal) {
  const [user, posts, comments] = await Promise.all([
    fetch(`/api/users/${userId}`, { signal }),
    fetch(`/api/users/${userId}/posts`, { signal }),
    fetch(`/api/users/${userId}/comments`, { signal })
  ]);
  
  return {
    user: await user.json(),
    posts: await posts.json(),
    comments: await comments.json()
  };
}

// Usage
const controller = new AbortController();

// Start fetching
const dataPromise = fetchUserData(123, controller.signal);

// Cancel after 5 seconds
setTimeout(() => {
  console.log('Cancelling all requests...');
  controller.abort();
}, 5000);

try {
  const data = await dataPromise;
  console.log('Data loaded:', data);
} catch (error) {
  if (error.name === 'AbortError') {
    console.log('All requests cancelled');
  }
}
```

### 4. Custom Async Functions with AbortSignal

```javascript
// ✅ Make custom functions cancellable
async function processLargeArray(items, signal) {
  const results = [];
  
  for (let i = 0; i < items.length; i++) {
    // Check if cancelled
    if (signal.aborted) {
      throw new Error('Operation cancelled');
    }
    
    // Process item
    const result = await processItem(items[i]);
    results.push(result);
    
    // Allow cancellation between iterations
    await new Promise(resolve => setTimeout(resolve, 0));
  }
  
  return results;
}

// Usage
const controller = new AbortController();

const items = Array.from({ length: 1000 }, (_, i) => i);
const promise = processLargeArray(items, controller.signal);

// Cancel after 2 seconds
setTimeout(() => controller.abort(), 2000);

try {
  const results = await promise;
  console.log('Processed:', results.length);
} catch (error) {
  console.error('Cancelled:', error.message);
}
```

### 5. Timeout Wrapper for Any Async Function

```javascript
// ✅ Generic timeout wrapper
function withTimeout(promise, timeoutMs) {
  const controller = new AbortController();
  
  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => {
      controller.abort();
      reject(new Error(`Operation timeout after ${timeoutMs}ms`));
    }, timeoutMs);
  });
  
  return Promise.race([promise, timeoutPromise]);
}

// Usage
async function slowOperation() {
  await new Promise(resolve => setTimeout(resolve, 5000));
  return 'Done!';
}

try {
  const result = await withTimeout(slowOperation(), 2000);
  console.log(result);
} catch (error) {
  console.error('Timeout:', error.message);
}
```

### 6. Cleanup with AbortSignal

```javascript
// ✅ Cleanup resources on abort
class DataFetcher {
  async fetchWithCleanup(url, signal) {
    const resources = [];
    
    // Register cleanup handler
    signal.addEventListener('abort', () => {
      console.log('Cleaning up resources...');
      resources.forEach(resource => {
        if (resource.close) resource.close();
      });
    });
    
    try {
      // Simulate resource allocation
      const connection = await openConnection(url);
      resources.push(connection);
      
      const stream = await connection.getStream();
      resources.push(stream);
      
      // Fetch data
      const data = await stream.read({ signal });
      return data;
    } finally {
      // Always cleanup
      resources.forEach(resource => {
        if (resource.close) resource.close();
      });
    }
  }
}

// Usage
const controller = new AbortController();
const fetcher = new DataFetcher();

setTimeout(() => controller.abort(), 3000);

try {
  const data = await fetcher.fetchWithCleanup('/api/data', controller.signal);
  console.log(data);
} catch (error) {
  console.error('Error:', error.message);
}
```

### 7. React/UI Integration Example

```javascript
// ✅ Real-world example: Auto-complete search
class SearchComponent {
  constructor() {
    this.currentController = null;
  }
  
  async search(query) {
    // Cancel previous search
    if (this.currentController) {
      this.currentController.abort();
    }
    
    // Create new controller
    this.currentController = new AbortController();
    const signal = this.currentController.signal;
    
    try {
      // Add delay (debounce)
      await new Promise((resolve, reject) => {
        const timeoutId = setTimeout(resolve, 300);
        signal.addEventListener('abort', () => {
          clearTimeout(timeoutId);
          reject(new Error('Aborted'));
        });
      });
      
      // Fetch results
      const response = await fetch(`/api/search?q=${query}`, { signal });
      const results = await response.json();
      
      this.displayResults(results);
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('Search error:', error);
      }
    }
  }
  
  displayResults(results) {
    console.log('Search results:', results);
  }
}

// Usage
const search = new SearchComponent();

// User types fast
search.search('n');
search.search('no');
search.search('nod');
search.search('node');  // Only this completes
```

---

## Async Debugging & Monitoring

Production-level debugging এবং monitoring techniques for async operations।

### 1. Async Hooks API (Advanced)

```javascript
const async_hooks = require('async_hooks');
const fs = require('fs');

// ✅ Track all async operations
class AsyncTracker {
  constructor() {
    this.operations = new Map();
    this.hook = null;
  }
  
  start() {
    this.hook = async_hooks.createHook({
      init: (asyncId, type, triggerAsyncId) => {
        this.operations.set(asyncId, {
          type,
          triggerAsyncId,
          stack: new Error().stack,
          timestamp: Date.now()
        });
      },
      
      destroy: (asyncId) => {
        const operation = this.operations.get(asyncId);
        if (operation) {
          const duration = Date.now() - operation.timestamp;
          console.log(`${operation.type} completed in ${duration}ms`);
          this.operations.delete(asyncId);
        }
      }
    });
    
    this.hook.enable();
    console.log('Async tracking enabled');
  }
  
  stop() {
    if (this.hook) {
      this.hook.disable();
      console.log('Async tracking disabled');
    }
  }
  
  getActiveOperations() {
    return Array.from(this.operations.entries()).map(([id, op]) => ({
      id,
      type: op.type,
      duration: Date.now() - op.timestamp
    }));
  }
}

// Usage
const tracker = new AsyncTracker();
tracker.start();

setTimeout(() => {
  console.log('Active operations:', tracker.getActiveOperations());
  tracker.stop();
}, 5000);
```

### 2. Async Context Tracking (AsyncLocalStorage)

```javascript
const { AsyncLocalStorage } = require('async_hooks');

// ✅ Track request context across async calls
const requestContext = new AsyncLocalStorage();

class RequestTracker {
  static run(requestId, callback) {
    return requestContext.run({ requestId, startTime: Date.now() }, callback);
  }
  
  static getRequestId() {
    const context = requestContext.getStore();
    return context?.requestId || 'unknown';
  }
  
  static getDuration() {
    const context = requestContext.getStore();
    if (!context) return 0;
    return Date.now() - context.startTime;
  }
}

// Enhanced logger with context
class Logger {
  log(message, data = {}) {
    console.log(JSON.stringify({
      timestamp: new Date().toISOString(),
      requestId: RequestTracker.getRequestId(),
      duration: RequestTracker.getDuration(),
      message,
      ...data
    }));
  }
}

const logger = new Logger();

// Usage in Express
app.use((req, res, next) => {
  const requestId = req.headers['x-request-id'] || Math.random().toString(36);
  RequestTracker.run(requestId, () => {
    logger.log('Request started', { method: req.method, url: req.url });
    next();
  });
});

app.get('/api/users', async (req, res) => {
  logger.log('Fetching users');
  const users = await fetchUsers();
  
  logger.log('Processing users');
  const processed = await processUsers(users);
  
  logger.log('Request completed', { count: processed.length });
  res.json(processed);
});

// All logs will have same requestId!
```

### 3. Promise State Inspection

```javascript
// ✅ Check promise state
function getPromiseState(promise) {
  const uniqueValue = Symbol('test');
  
  return Promise.race([promise, Promise.resolve(uniqueValue)])
    .then(value => {
      if (value === uniqueValue) {
        return 'pending';
      }
      return 'fulfilled';
    })
    .catch(() => 'rejected');
}

// Usage
const promise1 = new Promise(resolve => setTimeout(resolve, 1000));
const promise2 = Promise.resolve('done');
const promise3 = Promise.reject('error');

console.log(await getPromiseState(promise1)); // 'pending'
console.log(await getPromiseState(promise2)); // 'fulfilled'
console.log(await getPromiseState(promise3)); // 'rejected'
```

### 4. Async Stack Trace Enhancement

```javascript
// ✅ Better error stack traces
Error.stackTraceLimit = 50; // Increase stack trace depth

class AsyncError extends Error {
  constructor(message, originalError) {
    super(message);
    this.name = 'AsyncError';
    this.originalError = originalError;
    this.asyncStack = this.captureAsyncStack();
  }
  
  captureAsyncStack() {
    const stack = [];
    let error = this.originalError;
    
    while (error) {
      stack.push({
        message: error.message,
        stack: error.stack
      });
      error = error.cause || error.originalError;
    }
    
    return stack;
  }
  
  get fullStack() {
    let result = this.stack;
    
    if (this.asyncStack.length > 0) {
      result += '\n\nAsync Stack Trace:';
      this.asyncStack.forEach((s, i) => {
        result += `\n\n[${i + 1}] ${s.message}\n${s.stack}`;
      });
    }
    
    return result;
  }
}

// Usage
async function level3() {
  throw new Error('Database connection failed');
}

async function level2() {
  try {
    await level3();
  } catch (error) {
    throw new AsyncError('Failed to fetch user', error);
  }
}

async function level1() {
  try {
    await level2();
  } catch (error) {
    console.error(error.fullStack);
  }
}

level1();
```

### 5. Performance Profiling

```javascript
const { performance, PerformanceObserver } = require('perf_hooks');

// ✅ Detailed performance monitoring
class AsyncProfiler {
  constructor() {
    this.marks = new Map();
    this.measurements = [];
    
    this.observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach(entry => {
        this.measurements.push({
          name: entry.name,
          duration: entry.duration,
          startTime: entry.startTime
        });
      });
    });
    
    this.observer.observe({ entryTypes: ['measure'] });
  }
  
  async profile(name, fn) {
    const startMark = `${name}-start`;
    const endMark = `${name}-end`;
    
    performance.mark(startMark);
    
    try {
      const result = await fn();
      performance.mark(endMark);
      performance.measure(name, startMark, endMark);
      return result;
    } catch (error) {
      performance.mark(endMark);
      performance.measure(name, startMark, endMark);
      throw error;
    }
  }
  
  getReport() {
    const report = {};
    
    this.measurements.forEach(m => {
      if (!report[m.name]) {
        report[m.name] = {
          count: 0,
          totalDuration: 0,
          minDuration: Infinity,
          maxDuration: -Infinity
        };
      }
      
      const stat = report[m.name];
      stat.count++;
      stat.totalDuration += m.duration;
      stat.minDuration = Math.min(stat.minDuration, m.duration);
      stat.maxDuration = Math.max(stat.maxDuration, m.duration);
      stat.avgDuration = stat.totalDuration / stat.count;
    });
    
    return report;
  }
  
  printReport() {
    const report = this.getReport();
    
    console.log('\n📊 Performance Report:');
    console.log('═'.repeat(80));
    
    Object.entries(report).forEach(([name, stats]) => {
      console.log(`\n${name}:`);
      console.log(`  Calls: ${stats.count}`);
      console.log(`  Avg: ${stats.avgDuration.toFixed(2)}ms`);
      console.log(`  Min: ${stats.minDuration.toFixed(2)}ms`);
      console.log(`  Max: ${stats.maxDuration.toFixed(2)}ms`);
      console.log(`  Total: ${stats.totalDuration.toFixed(2)}ms`);
    });
    
    console.log('\n' + '═'.repeat(80));
  }
}

// Usage
const profiler = new AsyncProfiler();

async function fetchUser(id) {
  await new Promise(resolve => setTimeout(resolve, Math.random() * 100));
  return { id, name: `User ${id}` };
}

async function fetchPosts(userId) {
  await new Promise(resolve => setTimeout(resolve, Math.random() * 200));
  return [{ id: 1, userId, title: 'Post 1' }];
}

async function main() {
  for (let i = 0; i < 10; i++) {
    await profiler.profile('fetchUser', () => fetchUser(i));
    await profiler.profile('fetchPosts', () => fetchPosts(i));
  }
  
  profiler.printReport();
}

main();
```

### 6. Memory Leak Detection

```javascript
// ✅ Detect memory leaks in async code
class MemoryLeakDetector {
  constructor(options = {}) {
    this.threshold = options.threshold || 100; // MB
    this.interval = options.interval || 5000; // ms
    this.snapshots = [];
    this.timer = null;
  }
  
  start() {
    this.timer = setInterval(() => {
      const usage = process.memoryUsage();
      const heapMB = (usage.heapUsed / 1024 / 1024).toFixed(2);
      
      this.snapshots.push({
        timestamp: Date.now(),
        heapUsed: parseFloat(heapMB),
        rss: (usage.rss / 1024 / 1024).toFixed(2)
      });
      
      // Keep only last 10 snapshots
      if (this.snapshots.length > 10) {
        this.snapshots.shift();
      }
      
      // Check for leak
      this.checkForLeak();
    }, this.interval);
    
    console.log('Memory leak detector started');
  }
  
  stop() {
    if (this.timer) {
      clearInterval(this.timer);
      console.log('Memory leak detector stopped');
    }
  }
  
  checkForLeak() {
    if (this.snapshots.length < 3) return;
    
    const recent = this.snapshots.slice(-3);
    const increasing = recent.every((snapshot, i) => {
      if (i === 0) return true;
      return snapshot.heapUsed > recent[i - 1].heapUsed;
    });
    
    if (increasing) {
      const growth = recent[2].heapUsed - recent[0].heapUsed;
      console.warn(`⚠️  Possible memory leak detected!`);
      console.warn(`   Heap growth: +${growth.toFixed(2)}MB`);
      console.warn(`   Current heap: ${recent[2].heapUsed}MB`);
    }
  }
  
  getReport() {
    return {
      snapshots: this.snapshots,
      currentHeap: this.snapshots[this.snapshots.length - 1]?.heapUsed || 0
    };
  }
}

// Usage
const detector = new MemoryLeakDetector({ interval: 2000 });
detector.start();

// Simulate leak
const leakyArray = [];
setInterval(() => {
  leakyArray.push(new Array(1000000).fill('leak'));
}, 3000);

// Detector will warn about memory growth
```

### 7. Production Monitoring Integration

```javascript
// ✅ Complete monitoring solution
class ProductionAsyncMonitor {
  constructor(serviceName) {
    this.serviceName = serviceName;
    this.metrics = {
      requests: 0,
      errors: 0,
      slowRequests: 0
    };
  }
  
  async monitor(operationName, fn, options = {}) {
    const startTime = Date.now();
    const requestId = this.generateRequestId();
    
    this.log('info', 'Operation started', {
      requestId,
      operationName
    });
    
    try {
      const result = await fn();
      const duration = Date.now() - startTime;
      
      this.metrics.requests++;
      
      if (duration > (options.slowThreshold || 1000)) {
        this.metrics.slowRequests++;
        this.log('warn', 'Slow operation', {
          requestId,
          operationName,
          duration
        });
      }
      
      this.log('info', 'Operation completed', {
        requestId,
        operationName,
        duration
      });
      
      return result;
    } catch (error) {
      this.metrics.errors++;
      
      this.log('error', 'Operation failed', {
        requestId,
        operationName,
        error: error.message,
        stack: error.stack
      });
      
      // Send to monitoring service (e.g., Sentry, DataDog)
      this.reportError(error, { requestId, operationName });
      
      throw error;
    }
  }
  
  log(level, message, data) {
    console.log(JSON.stringify({
      timestamp: new Date().toISOString(),
      service: this.serviceName,
      level,
      message,
      ...data
    }));
  }
  
  reportError(error, context) {
    // Integrate with error tracking service
    // Example: Sentry.captureException(error, { contexts: context });
    console.error('Error reported:', error.message, context);
  }
  
  generateRequestId() {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
  
  getMetrics() {
    return {
      ...this.metrics,
      errorRate: (this.metrics.errors / this.metrics.requests * 100).toFixed(2) + '%',
      slowRate: (this.metrics.slowRequests / this.metrics.requests * 100).toFixed(2) + '%'
    };
  }
}

// Usage
const monitor = new ProductionAsyncMonitor('user-service');

app.get('/api/users/:id', async (req, res) => {
  try {
    const user = await monitor.monitor('fetchUser', 
      () => fetchUser(req.params.id),
      { slowThreshold: 500 }
    );
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get metrics
setInterval(() => {
  console.log('Current metrics:', monitor.getMetrics());
}, 60000);
```

---

এই advanced sections যোগ করার মাধ্যমে এখন async-programming.md file সম্পূর্ণ production-ready! 

## 🎯 নতুন যা যোগ হয়েছে:

### **Section 10: Async Best Practices & Performance**
- ✅ Common patterns (Parallel execution, Rate limiting, Batch processing)
- ✅ Anti-patterns এবং কিভাবে এড়াবেন
- ✅ Performance optimization (Lazy loading, Memoization, Debouncing)
- ✅ Memory management strategies
- ✅ Performance tracking system

### **Section 11: AbortController & Cancellation**
- ✅ Basic request cancellation
- ✅ Timeout implementation
- ✅ Manual user-triggered cancellation
- ✅ Multiple operations cancellation
- ✅ Custom async functions with abort support
- ✅ Cleanup on cancellation
- ✅ Real-world UI integration example

### **Section 12: Async Debugging & Monitoring**
- ✅ Async Hooks API for operation tracking
- ✅ AsyncLocalStorage for context propagation
- ✅ Promise state inspection
- ✅ Enhanced stack traces
- ✅ Performance profiling with perf_hooks
- ✅ Memory leak detection
- ✅ Production monitoring integration

এই comprehensive guide এ এখন Asynchronous Programming এর সব production-level concepts cover করা হয়েছে! 🚀
