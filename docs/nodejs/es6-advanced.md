# ES6+ Advanced JavaScript - Complete Mastery Guide

Node.js এর আসল শক্তি ব্যবহার করতে হলে **Modern JavaScript (ES6+)** ফিচারগুলো বোঝা অত্যন্ত জরুরি। এই guide এ আমরা ES2015 (ES6) থেকে শুরু করে ES2023 পর্যন্ত সব modern features শিখব।

## Why Learn ES6+?

```
Before ES6 (ES5):
- var (function scope, hoisting issues)
- callbacks (callback hell)
- for loops (verbose)
- string concatenation (messy)
- Object manipulation (limited)

After ES6+ (Modern JavaScript):
✅ let/const (block scope)
✅ async/await (clean async code)
✅ Array methods (map, filter, reduce)
✅ Template literals (easy strings)
✅ Destructuring (elegant syntax)
✅ Spread/Rest operators
✅ Arrow functions
✅ Classes
✅ Modules
✅ Promises
✅ And much more!
```

---

## Table of Contents

1. **Promises** - Async operations foundation
2. **Async/Await** - Clean async code
3. **Arrow Functions** - Concise function syntax
4. **Destructuring** - Extract values elegantly
5. **Spread/Rest Operators** - Array/Object manipulation
6. **Template Literals** - String formatting
7. **Enhanced Object Literals** - Object creation shortcuts
8. **Classes & OOP** - Object-oriented programming
9. **Modules** - Code organization
10. **Array Methods** - map, filter, reduce, etc.
11. **Higher-Order Functions** - Functions as values
12. **Closures** - Lexical scoping
13. **This Keyword** - Context binding
14. **Prototypes** - Inheritance mechanism
15. **Symbol** - Unique identifiers
16. **Iterators & Generators** - Custom iteration
17. **Proxy & Reflect** - Metaprogramming
18. **WeakMap & WeakSet** - Weak references
19. **Optional Chaining** - Safe property access
20. **Nullish Coalescing** - Default values
21. **Error Handling** - try/catch/finally
22. **Best Practices** - Modern JavaScript patterns

---

## ১. Promises - Complete Deep Dive

Promise হলো JavaScript এর asynchronous programming এর foundation। এটি "ভবিষ্যতে কোনো একটি value পাওয়ার প্রতিশ্রুতি"।

### Promise States

Promise এর **3টি state** থাকে:

```
┌─────────────────────────────────────────┐
│           PENDING (Initial)             │
│        (কাজ চলছে, waiting...)           │
└─────────────┬───────────────────────────┘
              │
       ┌──────┴──────┐
       │             │
       ▼             ▼
  ┌─────────┐   ┌──────────┐
  │FULFILLED│   │ REJECTED │
  │(Success)│   │ (Failed) │
  └─────────┘   └──────────┘
```

### Creating Promises

```javascript
// Basic Promise
const myPromise = new Promise((resolve, reject) => {
    let success = true;
    
    if (success) {
        resolve("Operation Successful! ✅");  // Fulfilled
    } else {
        reject("Operation Failed! ❌");       // Rejected
    }
});

// Consuming Promise
myPromise
    .then((message) => console.log(message))    // Handle success
    .catch((error) => console.error(error))     // Handle error
    .finally(() => console.log('Done!'));       // Always runs
```

### Real-World Example

```javascript
// Simulating API call
function fetchUser(userId) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (userId > 0) {
                resolve({ id: userId, name: 'John Doe', email: 'john@example.com' });
            } else {
                reject(new Error('Invalid user ID'));
            }
        }, 1000);
    });
}

// Usage
fetchUser(1)
    .then(user => {
        console.log('User found:', user);
        return user.id;  // Return value for next .then()
    })
    .then(userId => {
        console.log('User ID:', userId);
    })
    .catch(error => {
        console.error('Error:', error.message);
    })
    .finally(() => {
        console.log('Fetch attempt completed');
    });
```

---

### Promise Chaining

Multiple async operations কে sequential ভাবে execute করার জন্য।

```javascript
// ❌ Callback Hell (Old way)
getData(function(a) {
    getMoreData(a, function(b) {
        getEvenMoreData(b, function(c) {
            getYetMoreData(c, function(d) {
                console.log(d);
            });
        });
    });
});

// ✅ Promise Chaining (Better)
getData()
    .then(a => getMoreData(a))
    .then(b => getEvenMoreData(b))
    .then(c => getYetMoreData(c))
    .then(d => console.log(d))
    .catch(error => console.error(error));
```

**Important Rules:**
```javascript
// ✅ Return value for next .then()
promise
    .then(result => {
        return result * 2;  // Must return!
    })
    .then(doubled => {
        console.log(doubled);
    });

// ❌ Forgetting return breaks the chain
promise
    .then(result => {
        result * 2;  // No return! Next .then() gets undefined
    })
    .then(doubled => {
        console.log(doubled);  // undefined 😱
    });

// ✅ Return Promise for async operations
fetchUser(1)
    .then(user => {
        return fetchPosts(user.id);  // Return Promise
    })
    .then(posts => {
        console.log(posts);
    });
```

---

### Promise Static Methods

#### 1. Promise.all() - Wait for all to complete

```javascript
// All promises must succeed
const promise1 = Promise.resolve(3);
const promise2 = Promise.resolve(42);
const promise3 = new Promise((resolve) => {
    setTimeout(resolve, 100, 'foo');
});

Promise.all([promise1, promise2, promise3])
    .then(values => {
        console.log(values);  // [3, 42, 'foo']
    });

// If any fails, entire Promise.all fails
const p1 = Promise.resolve(1);
const p2 = Promise.reject('Error!');  // This fails
const p3 = Promise.resolve(3);

Promise.all([p1, p2, p3])
    .then(values => {
        console.log(values);  // Never runs
    })
    .catch(error => {
        console.error(error);  // 'Error!' - stops at first failure
    });
```

**Real-World Use Case:**
```javascript
// Fetch multiple users in parallel
async function fetchMultipleUsers(userIds) {
    const promises = userIds.map(id => fetchUser(id));
    
    try {
        const users = await Promise.all(promises);
        console.log('All users:', users);
    } catch (error) {
        console.error('Failed to fetch users:', error);
    }
}

fetchMultipleUsers([1, 2, 3, 4, 5]);
```

#### 2. Promise.allSettled() - Wait for all to complete (success or failure)

```javascript
// Returns all results regardless of success/failure
const p1 = Promise.resolve(1);
const p2 = Promise.reject('Error!');
const p3 = Promise.resolve(3);

Promise.allSettled([p1, p2, p3])
    .then(results => {
        console.log(results);
        // [
        //   { status: 'fulfilled', value: 1 },
        //   { status: 'rejected', reason: 'Error!' },
        //   { status: 'fulfilled', value: 3 }
        // ]
        
        results.forEach((result, index) => {
            if (result.status === 'fulfilled') {
                console.log(`Promise ${index} succeeded:`, result.value);
            } else {
                console.log(`Promise ${index} failed:`, result.reason);
            }
        });
    });
```

**Use Case: Multiple API calls where some may fail**
```javascript
async function fetchAllData() {
    const results = await Promise.allSettled([
        fetch('/api/users'),
        fetch('/api/posts'),
        fetch('/api/comments')  // May fail
    ]);
    
    const successful = results
        .filter(r => r.status === 'fulfilled')
        .map(r => r.value);
    
    console.log('Successful requests:', successful.length);
}
```

#### 3. Promise.race() - First to complete wins

```javascript
// Returns the first promise to settle (fulfilled or rejected)
const p1 = new Promise((resolve) => setTimeout(resolve, 500, 'one'));
const p2 = new Promise((resolve) => setTimeout(resolve, 100, 'two'));

Promise.race([p1, p2])
    .then(value => {
        console.log(value);  // 'two' (faster)
    });
```

**Use Case: Timeout implementation**
```javascript
function timeout(ms) {
    return new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Timeout!')), ms);
    });
}

function fetchWithTimeout(url, ms) {
    return Promise.race([
        fetch(url),
        timeout(ms)
    ]);
}

// Fetch with 5 second timeout
fetchWithTimeout('/api/data', 5000)
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => {
        if (error.message === 'Timeout!') {
            console.error('Request timed out!');
        } else {
            console.error('Request failed:', error);
        }
    });
```

#### 4. Promise.any() - First successful promise

```javascript
// Returns first fulfilled promise (ignores rejections)
const p1 = Promise.reject('Error 1');
const p2 = Promise.reject('Error 2');
const p3 = Promise.resolve('Success!');
const p4 = Promise.resolve('Also success!');

Promise.any([p1, p2, p3, p4])
    .then(value => {
        console.log(value);  // 'Success!' (first to fulfill)
    })
    .catch(error => {
        console.error(error);  // Only if all reject
    });
```

**Use Case: Multiple API endpoints (fallback)**
```javascript
// Try multiple CDNs, use first successful
Promise.any([
    fetch('https://cdn1.example.com/library.js'),
    fetch('https://cdn2.example.com/library.js'),
    fetch('https://cdn3.example.com/library.js')
])
    .then(response => response.text())
    .then(script => {
        console.log('Loaded from fastest CDN');
    })
    .catch(error => {
        console.error('All CDNs failed!');
    });
```

#### 5. Promise.resolve() & Promise.reject()

```javascript
// Create immediately resolved promise
const resolved = Promise.resolve(42);
resolved.then(value => console.log(value));  // 42

// Create immediately rejected promise
const rejected = Promise.reject('Error!');
rejected.catch(error => console.error(error));  // 'Error!'

// Useful for wrapping values in promises
function getData(value) {
    if (value) {
        return Promise.resolve(value);
    } else {
        return Promise.reject('No value provided');
    }
}
```

---

### Promise Error Handling

```javascript
// Method 1: .catch() at the end
fetchUser(1)
    .then(user => fetchPosts(user.id))
    .then(posts => fetchComments(posts[0].id))
    .catch(error => {
        console.error('Error in chain:', error);
    });

// Method 2: Multiple .catch() blocks
fetchUser(1)
    .then(user => fetchPosts(user.id))
    .catch(error => {
        console.error('Error fetching posts:', error);
        return [];  // Provide default value
    })
    .then(posts => {
        console.log('Posts:', posts);
    });

// Method 3: Error recovery
fetchUser(1)
    .catch(error => {
        console.warn('Primary fetch failed, trying backup');
        return fetchUserFromBackup(1);  // Fallback
    })
    .then(user => {
        console.log('User (from primary or backup):', user);
    });

// Method 4: Re-throwing errors
fetchUser(1)
    .catch(error => {
        console.error('Error:', error);
        throw error;  // Re-throw for outer handler
    })
    .then(user => {
        console.log(user);
    })
    .catch(error => {
        console.error('Outer catch:', error);
    });
```

---

### Promise Best Practices

```javascript
// ✅ Good: Always return in .then()
promise
    .then(result => {
        return processResult(result);  // Return for next .then()
    })
    .then(processed => {
        console.log(processed);
    });

// ✅ Good: Always add .catch()
promise
    .then(result => console.log(result))
    .catch(error => console.error(error));

// ✅ Good: Use .finally() for cleanup
fetchData()
    .then(data => processData(data))
    .catch(error => console.error(error))
    .finally(() => {
        hideLoadingSpinner();  // Always runs
        closeConnection();
    });

// ❌ Bad: Nested promises (promise hell)
fetchUser(1)
    .then(user => {
        fetchPosts(user.id)
            .then(posts => {
                fetchComments(posts[0].id)
                    .then(comments => {
                        console.log(comments);
                    });
            });
    });

// ✅ Good: Flat chain
fetchUser(1)
    .then(user => fetchPosts(user.id))
    .then(posts => fetchComments(posts[0].id))
    .then(comments => console.log(comments))
    .catch(error => console.error(error));

// ❌ Bad: Not handling errors
promise.then(result => console.log(result));  // Unhandled rejection!

// ✅ Good: Always handle errors
promise
    .then(result => console.log(result))
    .catch(error => console.error(error));
```

---

### Promisifying Callback-based Functions

```javascript
// Old callback-based function
function oldStyleAsync(value, callback) {
    setTimeout(() => {
        if (value > 0) {
            callback(null, value * 2);
        } else {
            callback(new Error('Invalid value'));
        }
    }, 1000);
}

// ❌ Using callbacks (old way)
oldStyleAsync(5, (error, result) => {
    if (error) {
        console.error(error);
    } else {
        console.log(result);
    }
});

// ✅ Promisify it
function promisifiedAsync(value) {
    return new Promise((resolve, reject) => {
        oldStyleAsync(value, (error, result) => {
            if (error) {
                reject(error);
            } else {
                resolve(result);
            }
        });
    });
}

// Now use with promises
promisifiedAsync(5)
    .then(result => console.log(result))
    .catch(error => console.error(error));

// Or use Node.js util.promisify
const util = require('util');
const promisified = util.promisify(oldStyleAsync);
```

---

## ২. Async / Await - Modern Async Programming

`async/await` হলো Promise এর উপর built একটি **syntactic sugar** যা async code কে synchronous এর মতো দেখতে এবং লিখতে সাহায্য করে।

### Basic Syntax

```javascript
// async function always returns a Promise
async function myFunction() {
    return 'Hello';  // Automatically wrapped in Promise.resolve()
}

myFunction().then(value => console.log(value));  // 'Hello'

// await pauses execution until Promise resolves
async function fetchData() {
    const response = await fetch('https://api.example.com/data');
    const data = await response.json();
    return data;
}
```

### Promises vs Async/Await

```javascript
// ❌ Using Promises (more verbose)
function getUserPosts() {
    return fetchUser(1)
        .then(user => {
            console.log('User:', user);
            return fetchPosts(user.id);
        })
        .then(posts => {
            console.log('Posts:', posts);
            return fetchComments(posts[0].id);
        })
        .then(comments => {
            console.log('Comments:', comments);
            return comments;
        })
        .catch(error => {
            console.error('Error:', error);
            throw error;
        });
}

// ✅ Using Async/Await (cleaner)
async function getUserPosts() {
    try {
        const user = await fetchUser(1);
        console.log('User:', user);
        
        const posts = await fetchPosts(user.id);
        console.log('Posts:', posts);
        
        const comments = await fetchComments(posts[0].id);
        console.log('Comments:', comments);
        
        return comments;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}
```

### Error Handling

```javascript
// Method 1: try-catch (recommended)
async function fetchData() {
    try {
        const response = await fetch('/api/data');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;  // Re-throw or handle
    }
}

// Method 2: .catch() on individual await
async function fetchData() {
    const data = await fetch('/api/data')
        .catch(error => {
            console.error('Fetch failed:', error);
            return null;  // Provide default
        });
    
    if (data) {
        return await data.json();
    }
}

// Method 3: Wrapper function
async function handle(promise) {
    try {
        const data = await promise;
        return [data, null];
    } catch (error) {
        return [null, error];
    }
}

// Usage
const [data, error] = await handle(fetch('/api/data'));
if (error) {
    console.error('Error:', error);
} else {
    console.log('Data:', data);
}
```

### Parallel Execution

```javascript
// ❌ Sequential (slow - 3 seconds)
async function fetchAllSequential() {
    const user = await fetchUser(1);     // 1 second
    const posts = await fetchPosts(1);   // 1 second
    const comments = await fetchComments(1);  // 1 second
    // Total: 3 seconds
    
    return { user, posts, comments };
}

// ✅ Parallel (fast - 1 second)
async function fetchAllParallel() {
    const [user, posts, comments] = await Promise.all([
        fetchUser(1),
        fetchPosts(1),
        fetchComments(1)
    ]);
    // Total: 1 second (all execute simultaneously)
    
    return { user, posts, comments };
}

// ✅ Parallel with Promise.allSettled (handles failures)
async function fetchAllSafe() {
    const results = await Promise.allSettled([
        fetchUser(1),
        fetchPosts(1),
        fetchComments(1)
    ]);
    
    const [userResult, postsResult, commentsResult] = results;
    
    return {
        user: userResult.status === 'fulfilled' ? userResult.value : null,
        posts: postsResult.status === 'fulfilled' ? postsResult.value : null,
        comments: commentsResult.status === 'fulfilled' ? commentsResult.value : null
    };
}
```

### Real-World Examples

#### 1. API with Error Handling

```javascript
async function createUser(userData) {
    try {
        // Validate data
        if (!userData.email) {
            throw new Error('Email is required');
        }
        
        // Check if user exists
        const existing = await User.findOne({ email: userData.email });
        if (existing) {
            throw new Error('User already exists');
        }
        
        // Hash password
        const hashedPassword = await bcrypt.hash(userData.password, 10);
        
        // Create user
        const user = await User.create({
            ...userData,
            password: hashedPassword
        });
        
        // Send welcome email
        await sendEmail(user.email, 'Welcome!');
        
        return user;
    } catch (error) {
        console.error('Failed to create user:', error);
        throw error;
    }
}
```

#### 2. Database Transactions

```javascript
async function transferMoney(senderId, receiverId, amount) {
    const session = await mongoose.startSession();
    session.startTransaction();
    
    try {
        // Deduct from sender
        const sender = await Account.findById(senderId).session(session);
        if (sender.balance < amount) {
            throw new Error('Insufficient balance');
        }
        sender.balance -= amount;
        await sender.save();
        
        // Add to receiver
        const receiver = await Account.findById(receiverId).session(session);
        receiver.balance += amount;
        await receiver.save();
        
        // Commit transaction
        await session.commitTransaction();
        console.log('Transfer successful');
        
        return { success: true };
    } catch (error) {
        // Rollback transaction
        await session.abortTransaction();
        console.error('Transfer failed:', error);
        throw error;
    } finally {
        session.endSession();
    }
}
```

#### 3. API Request with Timeout

```javascript
async function fetchWithTimeout(url, timeout = 5000) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    
    try {
        const response = await fetch(url, { signal: controller.signal });
        clearTimeout(timeoutId);
        return await response.json();
    } catch (error) {
        if (error.name === 'AbortError') {
            throw new Error('Request timed out');
        }
        throw error;
    }
}

// Usage
try {
    const data = await fetchWithTimeout('/api/data', 3000);
    console.log(data);
} catch (error) {
    console.error('Error:', error.message);
}
```

#### 4. Retry Logic

```javascript
async function retryOperation(operation, maxRetries = 3, delay = 1000) {
    for (let i = 0; i < maxRetries; i++) {
        try {
            return await operation();
        } catch (error) {
            if (i === maxRetries - 1) {
                throw error;  // Last attempt failed
            }
            console.log(`Attempt ${i + 1} failed, retrying...`);
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }
}

// Usage
try {
    const data = await retryOperation(() => fetch('/api/data'));
    console.log('Success:', data);
} catch (error) {
    console.error('All retries failed:', error);
}
```

### Async/Await Best Practices

```javascript
// ✅ Good: Always use try-catch
async function goodAsync() {
    try {
        const data = await fetchData();
        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

// ❌ Bad: No error handling
async function badAsync() {
    const data = await fetchData();  // Unhandled rejection!
    return data;
}

// ✅ Good: Parallel execution when possible
async function goodParallel() {
    const [users, posts] = await Promise.all([
        fetchUsers(),
        fetchPosts()
    ]);
}

// ❌ Bad: Unnecessary sequential execution
async function badSequential() {
    const users = await fetchUsers();   // Waits
    const posts = await fetchPosts();   // Then waits again
}

// ✅ Good: Top-level await (ES2022, in modules)
const data = await fetchData();  // In module scope

// ✅ Good: Named async functions for stack traces
async function namedFunction() {
    await fetchData();
}

// ❌ Bad: Anonymous async functions
const anonymous = async () => {
    await fetchData();  // Harder to debug
};

// ✅ Good: Return await in try-catch
async function goodReturn() {
    try {
        return await fetchData();  // Catch errors here
    } catch (error) {
        console.error(error);
    }
}

// ❌ Bad: Return promise without await
async function badReturn() {
    try {
        return fetchData();  // Errors not caught!
    } catch (error) {
        console.error(error);
    }
}
```

### Common Mistakes

```javascript
// ❌ Mistake 1: Forgetting await
async function mistake1() {
    const data = fetchData();  // Returns Promise, not data!
    console.log(data);  // Promise { <pending> }
}

// ✅ Correct
async function correct1() {
    const data = await fetchData();
    console.log(data);  // Actual data
}

// ❌ Mistake 2: Sequential when should be parallel
async function mistake2() {
    const user = await fetchUser(1);
    const posts = await fetchPosts(1);
    // Both are independent, should run in parallel!
}

// ✅ Correct
async function correct2() {
    const [user, posts] = await Promise.all([
        fetchUser(1),
        fetchPosts(1)
    ]);
}

// ❌ Mistake 3: Using await in loops (slow)
async function mistake3(ids) {
    const results = [];
    for (const id of ids) {
        results.push(await fetchData(id));  // Sequential!
    }
    return results;
}

// ✅ Correct
async function correct3(ids) {
    const promises = ids.map(id => fetchData(id));
    return await Promise.all(promises);  // Parallel!
}

// ❌ Mistake 4: Not handling errors
async function mistake4() {
    const data = await fetchData();  // What if this fails?
    return data;
}

// ✅ Correct
async function correct4() {
    try {
        const data = await fetchData();
        return data;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}
```

---

## ৩. Arrow Functions - Concise Syntax

Arrow functions হলো function expression এর একটি shorter syntax।

### Basic Syntax

```javascript
// Traditional function
function add(a, b) {
    return a + b;
}

// Arrow function
const add = (a, b) => {
    return a + b;
};

// Implicit return (single expression)
const add = (a, b) => a + b;

// Single parameter (no parentheses needed)
const double = x => x * 2;

// No parameters
const greet = () => console.log('Hello!');

// Object return (wrap in parentheses)
const getPerson = () => ({ name: 'John', age: 30 });
```

### Arrow Function vs Regular Function

```javascript
// 1. 'this' binding

// Regular function: 'this' depends on how it's called
const obj1 = {
    name: 'John',
    regularFunc: function() {
        console.log(this.name);  // 'John'
    }
};

// Arrow function: 'this' is lexically bound
const obj2 = {
    name: 'John',
    arrowFunc: () => {
        console.log(this.name);  // undefined (inherits outer 'this')
    }
};

// 2. Cannot be used as constructor
const RegularFunc = function() {
    this.value = 42;
};
const instance = new RegularFunc();  // ✅ Works

const ArrowFunc = () => {
    this.value = 42;
};
const instance2 = new ArrowFunc();  // ❌ TypeError

// 3. No arguments object
function regularFunc() {
    console.log(arguments);  // [1, 2, 3]
}
regularFunc(1, 2, 3);

const arrowFunc = () => {
    console.log(arguments);  // ReferenceError
};
// Use rest parameters instead
const arrowFunc2 = (...args) => {
    console.log(args);  // [1, 2, 3]
};
```

### When to Use Arrow Functions

```javascript
// ✅ Good: Callbacks
const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map(n => n * 2);

// ✅ Good: Promise chains
fetchData()
    .then(data => processData(data))
    .then(result => console.log(result));

// ✅ Good: Event handlers where you need outer 'this'
class Counter {
    constructor() {
        this.count = 0;
    }
    
    start() {
        setInterval(() => {
            this.count++;  // 'this' refers to Counter instance
            console.log(this.count);
        }, 1000);
    }
}

// ❌ Bad: Object methods (need 'this')
const person = {
    name: 'John',
    sayHi: () => {
        console.log(`Hi, I'm ${this.name}`);  // 'this' is undefined!
    }
};

// ✅ Good: Object methods with regular function
const person2 = {
    name: 'John',
    sayHi() {
        console.log(`Hi, I'm ${this.name}`);  // Works!
    }
};
```

---

## ৪. Destructuring - Extract Values Elegantly

Destructuring allows unpacking values from arrays or properties from objects into distinct variables।

### Array Destructuring

```javascript
// Basic
const arr = [1, 2, 3];
const [a, b, c] = arr;
console.log(a, b, c);  // 1 2 3

// Skip elements
const [first, , third] = [1, 2, 3];
console.log(first, third);  // 1 3

// Rest operator
const [head, ...tail] = [1, 2, 3, 4, 5];
console.log(head);  // 1
console.log(tail);  // [2, 3, 4, 5]

// Default values
const [x = 0, y = 0] = [1];
console.log(x, y);  // 1 0

// Swapping variables
let a = 1, b = 2;
[a, b] = [b, a];
console.log(a, b);  // 2 1

// Function return values
function getCoordinates() {
    return [10, 20];
}
const [x, y] = getCoordinates();
```

### Object Destructuring

```javascript
// Basic
const person = { name: 'John', age: 30, city: 'NYC' };
const { name, age, city } = person;
console.log(name, age, city);  // John 30 NYC

// Rename variables
const { name: fullName, age: years } = person;
console.log(fullName, years);  // John 30

// Default values
const { name, country = 'USA' } = person;
console.log(country);  // USA

// Nested destructuring
const user = {
    id: 1,
    name: 'John',
    address: {
        street: '123 Main St',
        city: 'NYC'
    }
};

const { name, address: { street, city } } = user;
console.log(street, city);  // 123 Main St NYC

// Rest operator
const { name, ...rest } = person;
console.log(rest);  // { age: 30, city: 'NYC' }

// Function parameters
function displayUser({ name, age, city = 'Unknown' }) {
    console.log(`${name}, ${age}, from ${city}`);
}

displayUser(person);  // John, 30, from NYC
```

### Real-World Examples

```javascript
// API response
async function getUser(id) {
    const response = await fetch(`/api/users/${id}`);
    const { data: { name, email, profile: { avatar } } } = await response.json();
    
    return { name, email, avatar };
}

// React props
function UserCard({ user: { name, email, avatar }, onDelete }) {
    return (
        <div>
            <img src={avatar} />
            <h2>{name}</h2>
            <p>{email}</p>
            <button onClick={onDelete}>Delete</button>
        </div>
    );
}

// Array methods
const users = [
    { id: 1, name: 'John', age: 30 },
    { id: 2, name: 'Jane', age: 25 },
    { id: 3, name: 'Bob', age: 35 }
];

// Extract specific fields
const names = users.map(({ name }) => name);
console.log(names);  // ['John', 'Jane', 'Bob']

// Filter with destructuring
const adults = users.filter(({ age }) => age >= 30);
```

---

## ৫. Spread/Rest Operators - Array/Object Manipulation

Spread (`...`) এবং Rest (`...`) operators একই syntax ব্যবহার করে কিন্তু different contexts এ different কাজ করে।

### Spread Operator (...)

#### Array Spreading

```javascript
// Copy array
const arr1 = [1, 2, 3];
const arr2 = [...arr1];  // Shallow copy
arr2.push(4);
console.log(arr1);  // [1, 2, 3] (unchanged)
console.log(arr2);  // [1, 2, 3, 4]

// Concatenate arrays
const arr1 = [1, 2];
const arr2 = [3, 4];
const combined = [...arr1, ...arr2];  // [1, 2, 3, 4]

// Add elements
const arr = [2, 3];
const newArr = [1, ...arr, 4, 5];  // [1, 2, 3, 4, 5]

// Convert string to array
const str = 'hello';
const chars = [...str];  // ['h', 'e', 'l', 'l', 'o']

// Function arguments
const numbers = [1, 2, 3];
console.log(Math.max(...numbers));  // 3

// Remove duplicates
const arr = [1, 2, 2, 3, 3, 4];
const unique = [...new Set(arr)];  // [1, 2, 3, 4]
```

#### Object Spreading

```javascript
// Copy object
const obj1 = { name: 'John', age: 30 };
const obj2 = { ...obj1 };  // Shallow copy

// Merge objects
const defaults = { theme: 'light', fontSize: 14 };
const userPrefs = { fontSize: 16, color: 'blue' };
const settings = { ...defaults, ...userPrefs };
// { theme: 'light', fontSize: 16, color: 'blue' }

// Add/Update properties
const user = { name: 'John', age: 30 };
const updatedUser = { ...user, age: 31, city: 'NYC' };
// { name: 'John', age: 31, city: 'NYC' }

// Conditional properties
const showEmail = true;
const user = {
    name: 'John',
    ...(showEmail && { email: 'john@example.com' })
};
```

### Rest Operator (...)

#### Function Parameters

```javascript
// Collect remaining arguments
function sum(...numbers) {
    return numbers.reduce((total, n) => total + n, 0);
}

console.log(sum(1, 2, 3, 4, 5));  // 15

// Mix with regular parameters
function greet(greeting, ...names) {
    return `${greeting} ${names.join(', ')}!`;
}

console.log(greet('Hello', 'John', 'Jane', 'Bob'));
// "Hello John, Jane, Bob!"
```

#### Destructuring

```javascript
// Array rest
const [first, second, ...rest] = [1, 2, 3, 4, 5];
console.log(first);  // 1
console.log(second);  // 2
console.log(rest);  // [3, 4, 5]

// Object rest
const { name, age, ...otherInfo } = {
    name: 'John',
    age: 30,
    city: 'NYC',
    country: 'USA'
};
console.log(otherInfo);  // { city: 'NYC', country: 'USA' }
```

### Real-World Examples

```javascript
// Immutable updates (React/Redux)
const state = { users: [], loading: false };

// Add user
const newState = {
    ...state,
    users: [...state.users, newUser]
};

// Update user
const updatedState = {
    ...state,
    users: state.users.map(user =>
        user.id === id ? { ...user, ...updates } : user
    )
};

// API wrapper
async function api(endpoint, { method = 'GET', ...options } = {}) {
    const response = await fetch(endpoint, {
        method,
        headers: {
            'Content-Type': 'application/json',
            ...options.headers
        },
        ...options
    });
    
    return response.json();
}

// Component props forwarding (React)
function Button({ onClick, children, ...props }) {
    return (
        <button onClick={onClick} {...props}>
            {children}
        </button>
    );
}

// Usage
<Button onClick={handleClick} className="btn" disabled>
    Click me
</Button>
```

---

## ৬. Template Literals - Modern String Formatting

Template literals allow embedded expressions এবং multi-line strings।

### Basic Syntax

```javascript
// Old way (concatenation)
const name = 'John';
const age = 30;
const message = 'My name is ' + name + ' and I am ' + age + ' years old.';

// New way (template literals)
const message = `My name is ${name} and I am ${age} years old.`;
```

### Features

```javascript
// 1. Multi-line strings
const multiLine = `
    This is line 1
    This is line 2
    This is line 3
`;

// 2. Expression interpolation
const a = 5;
const b = 10;
console.log(`Sum: ${a + b}`);  // Sum: 15

// 3. Function calls
function upper(str) {
    return str.toUpperCase();
}
console.log(`Hello ${upper('world')}!`);  // Hello WORLD!

// 4. Nested templates
const user = { name: 'John', isAdmin: true };
const message = `User ${user.name} is ${user.isAdmin ? `an admin` : `not an admin`}`;

// 5. Tagged templates (advanced)
function highlight(strings, ...values) {
    return strings.reduce((result, str, i) => {
        return `${result}${str}<strong>${values[i] || ''}</strong>`;
    }, '');
}

const name = 'John';
const age = 30;
const html = highlight`Name: ${name}, Age: ${age}`;
// "Name: <strong>John</strong>, Age: <strong>30</strong>"
```

### Real-World Examples

```javascript
// HTML templates
function createUserCard(user) {
    return `
        <div class="user-card">
            <img src="${user.avatar}" alt="${user.name}" />
            <h2>${user.name}</h2>
            <p>${user.email}</p>
            <span class="badge">${user.role}</span>
        </div>
    `;
}

// SQL queries (with proper escaping!)
function buildQuery(table, filters) {
    const where = Object.entries(filters)
        .map(([key, value]) => `${key} = '${value}'`)
        .join(' AND ');
    
    return `SELECT * FROM ${table} WHERE ${where}`;
}

// API URLs
const userId = 123;
const endpoint = `/api/users/${userId}/posts?limit=10&sort=desc`;

// Logging
console.log(`[${new Date().toISOString()}] User ${userId} logged in`);
```

---

## ৭. Enhanced Object Literals

ES6 এ object creation এর জন্য shorthand syntax এসেছে।

```javascript
// 1. Property shorthand
const name = 'John';
const age = 30;

// Old way
const person = {
    name: name,
    age: age
};

// New way
const person = { name, age };

// 2. Method shorthand
// Old way
const person = {
    sayHi: function() {
        console.log('Hi!');
    }
};

// New way
const person = {
    sayHi() {
        console.log('Hi!');
    }
};

// 3. Computed property names
const propName = 'age';
const person = {
    name: 'John',
    [propName]: 30,  // age: 30
    [`is${propName}Valid`]: true  // isageValid: true
};

// 4. Dynamic keys
function createObject(key, value) {
    return { [key]: value };
}

const obj = createObject('name', 'John');  // { name: 'John' }

// Real-world example: Form data
function handleSubmit(event) {
    const formData = {
        [event.target.name]: event.target.value,
        timestamp: Date.now()
    };
}
```

---
