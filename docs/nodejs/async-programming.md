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

এই comprehensive guide এ Asynchronous Programming এর সব advanced concepts cover করা হয়েছে। এই knowledge দিয়ে আপনি high-performance Node.js applications তৈরি করতে পারবেন! 🚀
