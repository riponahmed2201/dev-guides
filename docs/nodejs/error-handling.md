# Error Handling & Debugging in Node.js - সম্পূর্ণ গাইড

Error handling এবং debugging হলো professional Node.js development এর অত্যন্ত গুরুত্বপূর্ণ দুটি skill। এই গাইডে আপনি শিখবেন কিভাবে errors সঠিকভাবে handle করতে হয় এবং দ্রুত bugs খুঁজে বের করতে হয়।

## 📑 Table of Contents

### Basic Topics
1. [Try-Catch Blocks](#try-catch-blocks)
2. [Error Handling Middleware](#error-handling-middleware)
3. [Custom Error Classes](#custom-error-classes)
4. [Operational vs Programming Errors](#operational-vs-programming-errors)
5. [Error Logging](#error-logging)

### Debugging
6. [Debugging Techniques](#debugging-techniques)
7. [Node.js Debugger](#nodejs-debugger)
8. [VS Code Debugging](#vs-code-debugging)
9. [Console Methods](#console-methods)
10. [Stack Traces পড়া](#stack-traces-পড়া)

### Advanced Topics
11. [Unhandled Rejections & Uncaught Exceptions](#unhandled-rejections--uncaught-exceptions)
12. [Graceful Shutdown](#graceful-shutdown)
13. [Circuit Breaker Pattern](#circuit-breaker-pattern)
14. [Retry Mechanisms](#retry-mechanisms)
15. [Database Transaction Errors](#database-transaction-errors)
16. [External API Error Handling](#external-api-error-handling)
17. [Error Recovery Strategies](#error-recovery-strategies)
18. [Production Error Monitoring](#production-error-monitoring)

---

## Try-Catch Blocks

Try-catch হলো synchronous এবং async code এ error handle করার মূল পদ্ধতি।

### 1. Basic Try-Catch

```javascript
// Synchronous code এ try-catch
function divideNumbers(a, b) {
  try {
    if (b === 0) {
      throw new Error('Cannot divide by zero');
    }
    return a / b;
  } catch (error) {
    console.error('Error occurred:', error.message);
    return null;
  }
}

const result = divideNumbers(10, 0);
console.log(result); // null
```

**ব্যাখ্যা:**
- `try` block এ code execute হয়
- Error থাকলে `catch` block এ যায়
- `catch` এ error object পাওয়া যায়

### 2. Try-Catch-Finally

```javascript
function processFile(filename) {
  let file = null;
  
  try {
    file = openFile(filename);
    const data = readFile(file);
    return processData(data);
  } catch (error) {
    console.error('Error processing file:', error.message);
    return null;
  } finally {
    // এই block সবসময় execute হবে
    if (file) {
      closeFile(file);
      console.log('File closed');
    }
  }
}
```

**Finally block:**
- সবসময় execute হয়, error থাকুক বা না থাকুক
- Resource cleanup এর জন্য perfect (file close, database connection close)

### 3. Try-Catch with Async/Await

```javascript
// Async function এ try-catch
async function fetchUserData(userId) {
  try {
    const response = await fetch(`/api/users/${userId}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to fetch user:', error.message);
    throw error; // Re-throw করা যায়
  }
}

// Usage
async function main() {
  try {
    const user = await fetchUserData(123);
    console.log(user);
  } catch (error) {
    console.error('Main error:', error.message);
  }
}
```

### 4. Multiple Try-Catch Blocks

```javascript
async function processOrder(orderId) {
  let order, payment, inventory;
  
  try {
    order = await getOrder(orderId);
  } catch (error) {
    console.error('Failed to get order:', error.message);
    return { success: false, error: 'Order not found' };
  }
  
  try {
    payment = await processPayment(order.paymentId);
  } catch (error) {
    console.error('Payment failed:', error.message);
    await cancelOrder(orderId);
    return { success: false, error: 'Payment failed' };
  }
  
  try {
    inventory = await updateInventory(order.items);
  } catch (error) {
    console.error('Inventory update failed:', error.message);
    await refundPayment(payment.id);
    await cancelOrder(orderId);
    return { success: false, error: 'Inventory update failed' };
  }
  
  return { success: true, order, payment, inventory };
}
```

### 5. Nested Try-Catch (এড়িয়ে চলুন)

```javascript
// ❌ Bad Practice - Nested try-catch
function badExample() {
  try {
    try {
      try {
        // Too nested!
      } catch (error) {
        console.error(error);
      }
    } catch (error) {
      console.error(error);
    }
  } catch (error) {
    console.error(error);
  }
}

// ✅ Good Practice - Separate functions
async function goodExample() {
  try {
    await step1();
    await step2();
    await step3();
  } catch (error) {
    console.error('Process failed:', error.message);
  }
}
```

---

## Error Handling Middleware

Express.js এ error handling middleware ব্যবহার করে centralized error management করা যায়।

### 1. Basic Error Middleware

```javascript
const express = require('express');
const app = express();

// Routes
app.get('/user/:id', async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }
    res.json(user);
  } catch (error) {
    next(error); // Error middleware এ পাঠানো
  }
});

// Error handling middleware (সবসময় শেষে)
app.use((err, req, res, next) => {
  console.error(err.stack);
  
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  
  res.status(statusCode).json({
    success: false,
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

app.listen(3000);
```

**গুরুত্বপূর্ণ:**
- Error middleware এ 4টি parameter থাকতে হবে: `(err, req, res, next)`
- সবসময় route গুলোর পরে define করতে হবে

### 2. Multiple Error Middlewares

```javascript
// 404 Error Handler
app.use((req, res, next) => {
  const error = new Error('Not Found');
  error.statusCode = 404;
  next(error);
});

// Validation Error Handler
app.use((err, req, res, next) => {
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      error: 'Validation Error',
      details: Object.values(err.errors).map(e => e.message)
    });
  }
  next(err);
});

// Database Error Handler
app.use((err, req, res, next) => {
  if (err.name === 'MongoError' || err.name === 'MongoServerError') {
    return res.status(500).json({
      success: false,
      error: 'Database Error',
      message: err.message
    });
  }
  next(err);
});

// Generic Error Handler
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    error: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { 
      stack: err.stack 
    })
  });
});
```

### 3. Async Error Handler Wrapper

```javascript
// Utility function
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Usage
app.get('/users', asyncHandler(async (req, res) => {
  const users = await User.find();
  res.json(users);
  // No need for try-catch!
}));

app.post('/users', asyncHandler(async (req, res) => {
  const user = await User.create(req.body);
  res.status(201).json(user);
}));
```

### 4. Express Error Handler Package

```bash
npm install express-async-errors
```

```javascript
require('express-async-errors'); // শুরুতেই import করুন

const express = require('express');
const app = express();

// এখন async errors automatically catch হবে
app.get('/users', async (req, res) => {
  const users = await User.find(); // No try-catch needed
  res.json(users);
});

// Error middleware
app.use((err, req, res, next) => {
  res.status(err.statusCode || 500).json({
    error: err.message
  });
});
```

---

## Custom Error Classes

Custom error classes তৈরি করে আরো meaningful এবং structured error handling করা যায়।

### 1. Base Custom Error Class

```javascript
// errors/AppError.js
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
```

**ব্যাখ্যা:**
- `Error` class থেকে extend করা
- `statusCode` - HTTP status code
- `isOperational` - Operational error চিহ্নিত করতে
- `captureStackTrace` - Proper stack trace এর জন্য

### 2. Specific Error Classes

```javascript
// errors/NotFoundError.js
class NotFoundError extends AppError {
  constructor(message = 'Resource not found') {
    super(message, 404);
  }
}

// errors/ValidationError.js
class ValidationError extends AppError {
  constructor(message = 'Validation failed') {
    super(message, 400);
  }
}

// errors/UnauthorizedError.js
class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized access') {
    super(message, 401);
  }
}

// errors/ForbiddenError.js
class ForbiddenError extends AppError {
  constructor(message = 'Access forbidden') {
    super(message, 403);
  }
}

// errors/BadRequestError.js
class BadRequestError extends AppError {
  constructor(message = 'Bad request') {
    super(message, 400);
  }
}

module.exports = {
  NotFoundError,
  ValidationError,
  UnauthorizedError,
  ForbiddenError,
  BadRequestError
};
```

### 3. Using Custom Errors

```javascript
const { NotFoundError, ValidationError } = require('./errors');

// In routes
app.get('/users/:id', async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      throw new NotFoundError('User not found');
    }
    
    res.json(user);
  } catch (error) {
    next(error);
  }
});

app.post('/users', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      throw new ValidationError('Email and password are required');
    }
    
    const user = await User.create(req.body);
    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
});
```

### 4. Error Factory Pattern

```javascript
// errors/errorFactory.js
class ErrorFactory {
  static notFound(resource) {
    return new NotFoundError(`${resource} not found`);
  }
  
  static validation(field) {
    return new ValidationError(`${field} is invalid`);
  }
  
  static unauthorized() {
    return new UnauthorizedError('Please login to continue');
  }
  
  static forbidden(action) {
    return new ForbiddenError(`You don't have permission to ${action}`);
  }
  
  static badRequest(message) {
    return new BadRequestError(message);
  }
}

// Usage
app.get('/users/:id', async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) throw ErrorFactory.notFound('User');
    res.json(user);
  } catch (error) {
    next(error);
  }
});
```

---

## Operational vs Programming Errors

Error দুই ধরনের হয়: Operational এবং Programming।

### 1. Operational Errors

Operational errors হলো expected errors যা runtime এ ঘটতে পারে।

**Examples:**
- Database connection failure
- Invalid user input
- File not found
- Network timeout
- API rate limit exceeded

```javascript
// Operational Error Example
class DatabaseError extends AppError {
  constructor(message) {
    super(message, 500);
    this.isOperational = true;
  }
}

async function connectDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Database connected');
  } catch (error) {
    throw new DatabaseError('Failed to connect to database');
  }
}
```

**Handling:**
- ✅ এই errors handle করা যায়
- ✅ User-friendly message দেখানো যায়
- ✅ Retry logic implement করা যায়
- ✅ Application চালু রাখা যায়

### 2. Programming Errors

Programming errors হলো bugs যা code এ ভুলের কারণে হয়।

**Examples:**
- Syntax errors
- Undefined variables
- Type errors
- Null/undefined access
- Wrong function arguments

```javascript
// Programming Error Examples

// ❌ Type Error
const user = null;
console.log(user.name); // Cannot read property 'name' of null

// ❌ Reference Error
console.log(nonExistentVariable); // nonExistentVariable is not defined

// ❌ Syntax Error
const obj = { name: 'John' ; // Missing closing brace

// ❌ Wrong arguments
function add(a, b) {
  return a + b;
}
add(1); // Returns NaN (programming error)
```

**Handling:**
- ❌ এই errors handle করা উচিত নয়
- ✅ Code fix করতে হবে
- ✅ Testing দিয়ে prevent করতে হবে
- ⚠️ Application crash হলে restart করতে হবে

### 3. Distinguishing Between Error Types

```javascript
// Error handler
app.use((err, req, res, next) => {
  // Operational Error
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      success: false,
      error: err.message
    });
  }
  
  // Programming Error
  console.error('CRITICAL ERROR:', err);
  
  // Development এ full stack দেখান
  if (process.env.NODE_ENV === 'development') {
    return res.status(500).json({
      success: false,
      error: err.message,
      stack: err.stack
    });
  }
  
  // Production এ generic message
  res.status(500).json({
    success: false,
    error: 'Something went wrong'
  });
  
  // Programming error হলে process exit (PM2 restart করবে)
  process.exit(1);
});
```

### 4. Best Practices

```javascript
// ✅ Good: Operational error
async function getUser(id) {
  const user = await User.findById(id);
  if (!user) {
    throw new NotFoundError('User not found');
  }
  return user;
}

// ✅ Good: Input validation
function processPayment(amount) {
  if (typeof amount !== 'number' || amount <= 0) {
    throw new ValidationError('Invalid amount');
  }
  // Process payment
}

// ❌ Bad: Not validating input (programming error waiting to happen)
function badProcessPayment(amount) {
  return amount * 1.1; // What if amount is undefined?
}
```

---

## Error Logging

Proper error logging অত্যন্ত গুরুত্বপূর্ণ production applications এর জন্য।

### 1. Console Logging (Basic)

```javascript
// Basic console logging
console.log('Info message');
console.error('Error message');
console.warn('Warning message');
console.debug('Debug message');

// Error with stack trace
try {
  throw new Error('Something went wrong');
} catch (error) {
  console.error('Error:', error.message);
  console.error('Stack:', error.stack);
}
```

### 2. Winston Logger

Winston হলো সবচেয়ে জনপ্রিয় logging library।

**Installation:**
```bash
npm install winston
```

**Basic Setup:**

```javascript
// config/logger.js
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { service: 'user-service' },
  transports: [
    // Write all logs to console
    new winston.transports.Console({
      format: winston.format.simple()
    }),
    // Write all errors to error.log
    new winston.transports.File({ 
      filename: 'logs/error.log', 
      level: 'error' 
    }),
    // Write all logs to combined.log
    new winston.transports.File({ 
      filename: 'logs/combined.log' 
    })
  ]
});

module.exports = logger;
```

**Usage:**

```javascript
const logger = require('./config/logger');

// Different log levels
logger.error('This is an error');
logger.warn('This is a warning');
logger.info('This is info');
logger.debug('This is debug');

// With metadata
logger.info('User logged in', { 
  userId: 123, 
  email: 'user@example.com' 
});

// In routes
app.get('/users/:id', async (req, res, next) => {
  try {
    logger.info('Fetching user', { userId: req.params.id });
    const user = await User.findById(req.params.id);
    
    if (!user) {
      logger.warn('User not found', { userId: req.params.id });
      throw new NotFoundError('User not found');
    }
    
    logger.info('User fetched successfully', { userId: user._id });
    res.json(user);
  } catch (error) {
    logger.error('Error fetching user', { 
      error: error.message, 
      userId: req.params.id 
    });
    next(error);
  }
});
```

### 3. Advanced Winston Configuration

```javascript
const winston = require('winston');
const path = require('path');

// Custom format
const customFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.json()
);

// Create logger
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: customFormat,
  defaultMeta: { 
    service: 'my-app',
    environment: process.env.NODE_ENV 
  },
  transports: [
    // Console transport
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.printf(({ timestamp, level, message, ...meta }) => {
          return `${timestamp} [${level}]: ${message} ${
            Object.keys(meta).length ? JSON.stringify(meta) : ''
          }`;
        })
      )
    }),
    
    // Error file
    new winston.transports.File({
      filename: path.join('logs', 'error.log'),
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5
    }),
    
    // Combined file
    new winston.transports.File({
      filename: path.join('logs', 'combined.log'),
      maxsize: 5242880,
      maxFiles: 5
    })
  ],
  
  // Handle exceptions
  exceptionHandlers: [
    new winston.transports.File({ 
      filename: path.join('logs', 'exceptions.log') 
    })
  ],
  
  // Handle rejections
  rejectionHandlers: [
    new winston.transports.File({ 
      filename: path.join('logs', 'rejections.log') 
    })
  ]
});

module.exports = logger;
```

### 4. Morgan HTTP Logger

Morgan ব্যবহার করে HTTP requests log করা যায়।

```bash
npm install morgan
```

```javascript
const express = require('express');
const morgan = require('morgan');
const logger = require('./config/logger');

const app = express();

// Development এ
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Production এ Winston এর সাথে integrate
const stream = {
  write: (message) => logger.info(message.trim())
};

app.use(morgan('combined', { stream }));
```

### 5. Error Logging Middleware

```javascript
// Error logging middleware
app.use((err, req, res, next) => {
  // Log error
  logger.error('Error occurred', {
    error: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userId: req.user?.id
  });
  
  // Send response
  res.status(err.statusCode || 500).json({
    success: false,
    error: err.message
  });
});
```

### 6. External Logging Services

**Sentry (Error Tracking):**

```bash
npm install @sentry/node
```

```javascript
const Sentry = require('@sentry/node');

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0
});

// Request handler (সবার আগে)
app.use(Sentry.Handlers.requestHandler());

// Routes
app.get('/', (req, res) => {
  res.send('Hello');
});

// Error handler (routes এর পরে)
app.use(Sentry.Handlers.errorHandler());

// Custom error handler
app.use((err, req, res, next) => {
  res.status(500).json({ error: err.message });
});
```

---

## Debugging Techniques

### 1. Console Debugging

```javascript
// Basic console.log debugging
function calculateTotal(items) {
  console.log('Items:', items); // Check input
  
  let total = 0;
  for (let item of items) {
    console.log('Processing item:', item); // Check each iteration
    total += item.price * item.quantity;
    console.log('Running total:', total); // Check calculation
  }
  
  console.log('Final total:', total); // Check output
  return total;
}

// Better: Labeled logs
function calculateTotal(items) {
  console.log('=== Calculate Total Start ===');
  console.log('Input items:', JSON.stringify(items, null, 2));
  
  let total = 0;
  items.forEach((item, index) => {
    const itemTotal = item.price * item.quantity;
    console.log(`Item ${index}:`, {
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      itemTotal
    });
    total += itemTotal;
  });
  
  console.log('Final total:', total);
  console.log('=== Calculate Total End ===');
  return total;
}
```

### 2. Debugger Statement

```javascript
function processOrder(order) {
  debugger; // Execution থামবে এখানে (যদি debugger attached থাকে)
  
  const total = calculateTotal(order.items);
  
  debugger; // আবার থামবে
  
  return {
    orderId: order.id,
    total: total
  };
}
```

### 3. Assert for Validation

```javascript
const assert = require('assert');

function divide(a, b) {
  // Assert conditions during development
  assert(typeof a === 'number', 'First argument must be a number');
  assert(typeof b === 'number', 'Second argument must be a number');
  assert(b !== 0, 'Cannot divide by zero');
  
  return a / b;
}

// Usage
try {
  console.log(divide(10, 2)); // 5
  console.log(divide(10, 0)); // AssertionError
} catch (error) {
  console.error(error.message);
}
```

### 4. Conditional Breakpoints

```javascript
function processItems(items) {
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    
    // Debug only specific conditions
    if (item.price < 0) {
      debugger; // শুধু negative price হলে থামবে
    }
    
    processItem(item);
  }
}
```

### 5. Memory Leak Detection

```bash
npm install memwatch-next
```

```javascript
const memwatch = require('memwatch-next');

// Memory leak detection
memwatch.on('leak', (info) => {
  console.error('Memory leak detected:', info);
});

// Heap diff
const hd = new memwatch.HeapDiff();

// ... your code ...

const diff = hd.end();
console.log('Heap diff:', diff);
```

---

## Node.js Debugger

Node.js এ built-in debugger আছে যা command line থেকে use করা যায়।

### 1. Starting Debugger

```bash
# Normal run
node app.js

# Debug mode
node inspect app.js

# Debug mode with break at first line
node --inspect-brk app.js
```

### 2. Debugger Commands

```javascript
// app.js
function calculateSum(numbers) {
  debugger; // Breakpoint
  
  let sum = 0;
  for (let num of numbers) {
    sum += num;
  }
  
  return sum;
}

const result = calculateSum([1, 2, 3, 4, 5]);
console.log('Result:', result);
```

**Run:**
```bash
node inspect app.js
```

**Commands:**
- `cont`, `c` - Continue execution
- `next`, `n` - Step to next line
- `step`, `s` - Step into function
- `out`, `o` - Step out of function
- `pause` - Pause execution
- `repl` - Open REPL to inspect variables
- `watch('expression')` - Watch expression
- `list(5)` - Show code (5 lines before/after)

### 3. Chrome DevTools Debugging

```bash
# Start with --inspect
node --inspect app.js

# Or break at first line
node --inspect-brk app.js
```

**Access:**
1. Open Chrome
2. Go to `chrome://inspect`
3. Click "Open dedicated DevTools for Node"
4. Set breakpoints and debug

### 4. Remote Debugging

```bash
# Listen on specific host and port
node --inspect=0.0.0.0:9229 app.js

# For production (security risk, use carefully)
node --inspect=127.0.0.1:9229 app.js
```

---

## VS Code Debugging

VS Code এ powerful debugging features আছে।

### 1. Launch Configuration

Create `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Launch Program",
      "skipFiles": ["<node_internals>/**"],
      "program": "${workspaceFolder}/app.js"
    },
    {
      "type": "node",
      "request": "launch",
      "name": "Launch with Nodemon",
      "runtimeExecutable": "nodemon",
      "program": "${workspaceFolder}/app.js",
      "restart": true,
      "console": "integratedTerminal"
    },
    {
      "type": "node",
      "request": "launch",
      "name": "Jest Tests",
      "program": "${workspaceFolder}/node_modules/.bin/jest",
      "args": ["--runInBand"],
      "console": "integratedTerminal"
    }
  ]
}
```

### 2. Setting Breakpoints

**Normal Breakpoint:**
- Line number এর বামে click করুন
- লাল dot দেখা যাবে

**Conditional Breakpoint:**
- Right-click on breakpoint
- Select "Edit Breakpoint"
- Add condition: `user.age > 18`

**Logpoint:**
- Right-click on line number
- Select "Add Logpoint"
- Enter message: `User: {user.name}`

### 3. Debug Configuration with Environment Variables

```json
{
  "type": "node",
  "request": "launch",
  "name": "Launch with Env",
  "program": "${workspaceFolder}/app.js",
  "env": {
    "NODE_ENV": "development",
    "PORT": "3000",
    "DEBUG": "*"
  },
  "envFile": "${workspaceFolder}/.env"
}
```

### 4. Debugging Express Apps

```json
{
  "type": "node",
  "request": "launch",
  "name": "Debug Express",
  "program": "${workspaceFolder}/server.js",
  "restart": true,
  "console": "integratedTerminal",
  "internalConsoleOptions": "neverOpen"
}
```

### 5. Attach to Running Process

```json
{
  "type": "node",
  "request": "attach",
  "name": "Attach to Process",
  "port": 9229,
  "restart": true
}
```

**Start app:**
```bash
node --inspect app.js
```

**Then:** Press F5 in VS Code

### 6. Debug Panel Features

**Variables:**
- Local variables দেখা যায়
- Watch expressions add করা যায়

**Call Stack:**
- Function call history
- Click করে different stack frames এ যাওয়া যায়

**Debug Console:**
- Variables inspect করা
- Expressions evaluate করা
- Code execute করা

**Example:**
```javascript
// Debug console এ
> user.name
'John Doe'
> user.age
25
> user.age > 18
true
```

---

## Console Methods

Node.js এ console এর অনেক useful methods আছে।

### 1. Basic Methods

```javascript
// Standard output
console.log('Normal message');

// Error output
console.error('Error message');

// Warning
console.warn('Warning message');

// Info
console.info('Info message');

// Debug
console.debug('Debug message');
```

### 2. Formatting

```javascript
// String substitution
console.log('Hello %s', 'World');
console.log('Number: %d', 42);
console.log('Float: %f', 3.14);
console.log('Object: %o', { name: 'John' });

// Multiple substitutions
console.log('User %s is %d years old', 'John', 25);

// CSS styling (browser only)
console.log('%cStyled Text', 'color: blue; font-size: 20px');
```

### 3. Object Inspection

```javascript
const user = {
  name: 'John',
  age: 25,
  address: {
    city: 'Dhaka',
    country: 'Bangladesh'
  }
};

// Simple log
console.log(user);

// Formatted JSON
console.log(JSON.stringify(user, null, 2));

// Directory (shows all properties)
console.dir(user, { depth: null, colors: true });
```

### 4. Table Display

```javascript
const users = [
  { id: 1, name: 'John', age: 25 },
  { id: 2, name: 'Jane', age: 30 },
  { id: 3, name: 'Bob', age: 35 }
];

// Display as table
console.table(users);

// Select specific columns
console.table(users, ['name', 'age']);
```

**Output:**
```
┌─────────┬────┬────────┬─────┐
│ (index) │ id │  name  │ age │
├─────────┼────┼────────┼─────┤
│    0    │ 1  │ 'John' │ 25  │
│    1    │ 2  │ 'Jane' │ 30  │
│    2    │ 3  │ 'Bob'  │ 35  │
└─────────┴────┴────────┴─────┘
```

### 5. Timing

```javascript
// Start timer
console.time('operation');

// Your code
for (let i = 0; i < 1000000; i++) {
  // Some operation
}

// End timer and log duration
console.timeEnd('operation');
// Output: operation: 5.234ms

// Time log (intermediate)
console.time('total');
console.timeLog('total', 'Step 1 complete');
// ... more code
console.timeLog('total', 'Step 2 complete');
console.timeEnd('total');
```

### 6. Counting

```javascript
// Count occurrences
for (let i = 0; i < 5; i++) {
  console.count('Loop');
}
// Output:
// Loop: 1
// Loop: 2
// Loop: 3
// Loop: 4
// Loop: 5

// Reset counter
console.countReset('Loop');
console.count('Loop'); // Loop: 1
```

### 7. Grouping

```javascript
console.log('First level');

console.group('Group 1');
console.log('Inside group 1');

console.group('Nested Group');
console.log('Inside nested group');
console.groupEnd();

console.log('Back to group 1');
console.groupEnd();

console.log('Back to first level');

// Collapsed group
console.groupCollapsed('Collapsed Group');
console.log('This is collapsed by default');
console.groupEnd();
```

### 8. Assertions

```javascript
// Console assert
console.assert(true, 'This will not print');
console.assert(false, 'This will print as error');

// With multiple messages
const user = { name: 'John', age: 15 };
console.assert(
  user.age >= 18,
  'User must be 18 or older',
  'Current age:',
  user.age
);
```

### 9. Trace

```javascript
function a() {
  b();
}

function b() {
  c();
}

function c() {
  console.trace('Trace from function c');
}

a();

// Output shows full call stack:
// Trace: Trace from function c
//   at c (file.js:10:11)
//   at b (file.js:6:3)
//   at a (file.js:2:3)
//   at Object.<anonymous> (file.js:13:1)
```

### 10. Clear Console

```javascript
console.clear(); // Clears console
```

---

## Stack Traces পড়া

Stack traces বোঝা debugging এর জন্য অত্যন্ত গুরুত্বপূর্ণ।

### 1. Understanding Stack Trace

```javascript
function a() {
  b();
}

function b() {
  c();
}

function c() {
  throw new Error('Something went wrong');
}

try {
  a();
} catch (error) {
  console.error(error.stack);
}
```

**Output:**
```
Error: Something went wrong
    at c (/path/to/file.js:10:9)
    at b (/path/to/file.js:6:3)
    at a (/path/to/file.js:2:3)
    at Object.<anonymous> (/path/to/file.js:14:3)
```

**Reading:**
1. **First line:** Error message
2. **Following lines:** Call stack (নিচ থেকে উপরে পড়ুন)
   - `at Object.<anonymous>` - শুরু এখানে
   - `at a` - a function call করা হয়েছে
   - `at b` - b function call করা হয়েছে
   - `at c` - c function এ error হয়েছে

### 2. Async Stack Traces

```javascript
async function fetchUser(id) {
  const user = await getUserFromDB(id);
  if (!user) {
    throw new Error('User not found');
  }
  return user;
}

async function processUser(id) {
  const user = await fetchUser(id);
  return user;
}

async function main() {
  try {
    await processUser(123);
  } catch (error) {
    console.error(error.stack);
  }
}

main();
```

**Stack Trace:**
```
Error: User not found
    at fetchUser (/path/file.js:4:11)
    at async processUser (/path/file.js:10:18)
    at async main (/path/file.js:15:5)
```

### 3. Cleaning Stack Traces

```javascript
// Remove node_modules from stack trace
Error.prepareStackTrace = (error, stack) => {
  return error.message + '\n' + stack
    .filter(frame => !frame.getFileName().includes('node_modules'))
    .map(frame => `  at ${frame}`)
    .join('\n');
};
```

### 4. Custom Stack Traces

```javascript
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    
    // Capture stack trace
    Error.captureStackTrace(this, this.constructor);
  }
  
  // Custom stack trace formatting
  toString() {
    return `${this.name}: ${this.message}\nStatus: ${this.statusCode}\n${this.stack}`;
  }
}

try {
  throw new AppError('Custom error', 400);
} catch (error) {
  console.log(error.toString());
}
```

### 5. Source Maps

TypeScript বা transpiled code এ original source দেখার জন্য:

```bash
npm install source-map-support
```

```javascript
// app.js (first line)
require('source-map-support').install();

// Now stack traces show TypeScript source, not compiled JS
```

---

## Complete Error Handling Example

এখানে একটি production-ready error handling system এর example:

```javascript
// errors/AppError.js
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

// errors/index.js
class NotFoundError extends AppError {
  constructor(message = 'Resource not found') {
    super(message, 404);
  }
}

class ValidationError extends AppError {
  constructor(message = 'Validation failed') {
    super(message, 400);
  }
}

module.exports = { AppError, NotFoundError, ValidationError };

// config/logger.js
const winston = require('winston');

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    }),
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' })
  ]
});

module.exports = logger;

// middleware/errorHandler.js
const logger = require('../config/logger');

const errorHandler = (err, req, res, next) => {
  // Log error
  logger.error({
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userId: req.user?.id,
    timestamp: new Date().toISOString()
  });
  
  // Operational error
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      success: false,
      error: err.message
    });
  }
  
  // Programming error
  console.error('CRITICAL ERROR:', err);
  
  res.status(500).json({
    success: false,
    error: process.env.NODE_ENV === 'production' 
      ? 'Internal server error' 
      : err.message
  });
  
  // Exit process for programming errors in production
  if (process.env.NODE_ENV === 'production' && !err.isOperational) {
    process.exit(1);
  }
};

module.exports = errorHandler;

// middleware/asyncHandler.js
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;

// app.js
const express = require('express');
const morgan = require('morgan');
const logger = require('./config/logger');
const errorHandler = require('./middleware/errorHandler');
const asyncHandler = require('./middleware/asyncHandler');
const { NotFoundError, ValidationError } = require('./errors');

const app = express();

// Middleware
app.use(express.json());
app.use(morgan('combined', {
  stream: { write: (message) => logger.info(message.trim()) }
}));

// Routes
app.get('/users/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  if (!id.match(/^[0-9]+$/)) {
    throw new ValidationError('Invalid user ID');
  }
  
  const user = await User.findById(id);
  
  if (!user) {
    throw new NotFoundError('User not found');
  }
  
  res.json({ success: true, data: user });
}));

// 404 handler
app.use((req, res, next) => {
  throw new NotFoundError(`Route ${req.url} not found`);
});

// Error handler (must be last)
app.use(errorHandler);

// Unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection:', { reason, promise });
  process.exit(1);
});

// Uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});
```

---

## Unhandled Rejections & Uncaught Exceptions

Node.js application এ unhandled errors handle করা অত্যন্ত গুরুত্বপূর্ণ।

### 1. Unhandled Promise Rejections

Promise reject হলে কিন্তু `.catch()` না থাকলে এটি unhandled rejection।

```javascript
// ❌ Bad - Unhandled rejection
async function fetchData() {
  const data = await fetch('https://api.example.com/data');
  return data.json();
}

fetchData(); // No error handling!

// ✅ Good - Proper handling
async function fetchData() {
  try {
    const data = await fetch('https://api.example.com/data');
    return data.json();
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
}

fetchData().catch(error => {
  console.error('Failed to fetch data:', error);
});
```

### 2. Global Unhandled Rejection Handler

```javascript
// server.js
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise);
  console.error('Reason:', reason);
  
  // Log to error tracking service
  logger.error('Unhandled Rejection', {
    reason: reason,
    promise: promise
  });
  
  // Gracefully shutdown
  server.close(() => {
    process.exit(1);
  });
});

// Example that triggers unhandled rejection
Promise.reject(new Error('Oops!')); // Will be caught by handler
```

### 3. Uncaught Exceptions

Synchronous code এ error throw হলে কিন্তু catch না করলে uncaught exception হয়।

```javascript
process.on('uncaughtException', (error, origin) => {
  console.error('Uncaught Exception!');
  console.error('Error:', error);
  console.error('Origin:', origin);
  
  logger.error('Uncaught Exception', {
    error: error.message,
    stack: error.stack,
    origin: origin
  });
  
  // Exit process - uncaught exceptions are serious
  process.exit(1);
});

// This will trigger uncaught exception
// throw new Error('This is uncaught!');
```

### 4. Warning Events

```javascript
process.on('warning', (warning) => {
  console.warn('Warning:', warning.name);
  console.warn('Message:', warning.message);
  console.warn('Stack:', warning.stack);
  
  // Common warnings:
  // - MaxListenersExceededWarning
  // - DeprecationWarning
  // - ExperimentalWarning
});
```

### 5. Complete Error Handler Setup

```javascript
// config/errorHandlers.js
const logger = require('./logger');

const setupErrorHandlers = (server) => {
  // Unhandled Promise Rejections
  process.on('unhandledRejection', (reason, promise) => {
    logger.error('Unhandled Promise Rejection', {
      reason: reason instanceof Error ? reason.message : reason,
      stack: reason instanceof Error ? reason.stack : undefined,
      promise: promise
    });
    
    gracefulShutdown(server, 'unhandledRejection');
  });
  
  // Uncaught Exceptions
  process.on('uncaughtException', (error) => {
    logger.error('Uncaught Exception', {
      error: error.message,
      stack: error.stack
    });
    
    gracefulShutdown(server, 'uncaughtException');
  });
  
  // SIGTERM signal
  process.on('SIGTERM', () => {
    logger.info('SIGTERM signal received');
    gracefulShutdown(server, 'SIGTERM');
  });
  
  // SIGINT signal (Ctrl+C)
  process.on('SIGINT', () => {
    logger.info('SIGINT signal received');
    gracefulShutdown(server, 'SIGINT');
  });
};

const gracefulShutdown = (server, signal) => {
  logger.info(`${signal} received, starting graceful shutdown`);
  
  server.close(() => {
    logger.info('HTTP server closed');
    
    // Close database connections
    mongoose.connection.close(false, () => {
      logger.info('MongoDB connection closed');
      process.exit(signal === 'SIGTERM' || signal === 'SIGINT' ? 0 : 1);
    });
  });
  
  // Force shutdown after 10 seconds
  setTimeout(() => {
    logger.error('Forced shutdown after timeout');
    process.exit(1);
  }, 10000);
};

module.exports = setupErrorHandlers;
```

**Usage in server.js:**
```javascript
const app = require('./app');
const setupErrorHandlers = require('./config/errorHandlers');

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Setup error handlers
setupErrorHandlers(server);
```

---

## Graceful Shutdown

Application বন্ধ করার সময় সঠিকভাবে cleanup করা অত্যন্ত গুরুত্বপূর্ণ।

### 1. Basic Graceful Shutdown

```javascript
const gracefulShutdown = (server) => {
  console.log('Received shutdown signal, closing server...');
  
  // Stop accepting new connections
  server.close(() => {
    console.log('Server closed, exiting process');
    process.exit(0);
  });
  
  // Force shutdown after 30 seconds
  setTimeout(() => {
    console.error('Forced shutdown!');
    process.exit(1);
  }, 30000);
};

process.on('SIGTERM', () => gracefulShutdown(server));
process.on('SIGINT', () => gracefulShutdown(server));
```

### 2. Complete Graceful Shutdown with Cleanup

```javascript
class GracefulShutdown {
  constructor(server, options = {}) {
    this.server = server;
    this.timeout = options.timeout || 30000;
    this.connections = new Set();
    this.isShuttingDown = false;
    
    // Track all connections
    this.server.on('connection', (conn) => {
      this.connections.add(conn);
      conn.on('close', () => {
        this.connections.delete(conn);
      });
    });
  }
  
  async shutdown(signal) {
    if (this.isShuttingDown) {
      console.log('Shutdown already in progress');
      return;
    }
    
    this.isShuttingDown = true;
    console.log(`${signal} received, starting graceful shutdown`);
    
    // Stop accepting new requests
    this.server.close(async () => {
      console.log('HTTP server closed');
      await this.cleanup();
      process.exit(0);
    });
    
    // Close existing connections
    for (const conn of this.connections) {
      conn.end();
      setTimeout(() => conn.destroy(), 5000);
    }
    
    // Force shutdown after timeout
    setTimeout(() => {
      console.error('Forced shutdown after timeout');
      process.exit(1);
    }, this.timeout);
  }
  
  async cleanup() {
    console.log('Starting cleanup...');
    
    const tasks = [];
    
    // Close database connections
    if (mongoose.connection.readyState === 1) {
      tasks.push(
        mongoose.connection.close(false)
          .then(() => console.log('✓ MongoDB closed'))
          .catch(err => console.error('✗ MongoDB close error:', err))
      );
    }
    
    // Close Redis connection
    if (redisClient && redisClient.isOpen) {
      tasks.push(
        redisClient.quit()
          .then(() => console.log('✓ Redis closed'))
          .catch(err => console.error('✗ Redis close error:', err))
      );
    }
    
    // Complete pending jobs
    if (jobQueue) {
      tasks.push(
        jobQueue.close()
          .then(() => console.log('✓ Job queue closed'))
          .catch(err => console.error('✗ Job queue close error:', err))
      );
    }
    
    // Wait for all cleanup tasks
    await Promise.allSettled(tasks);
    console.log('Cleanup completed');
  }
  
  setup() {
    process.on('SIGTERM', () => this.shutdown('SIGTERM'));
    process.on('SIGINT', () => this.shutdown('SIGINT'));
    process.on('SIGQUIT', () => this.shutdown('SIGQUIT'));
  }
}

// Usage
const shutdown = new GracefulShutdown(server, { timeout: 30000 });
shutdown.setup();
```

### 3. Health Check During Shutdown

```javascript
app.get('/health', (req, res) => {
  if (isShuttingDown) {
    res.status(503).json({
      status: 'shutting_down',
      message: 'Server is shutting down'
    });
  } else {
    res.json({
      status: 'ok',
      uptime: process.uptime(),
      timestamp: Date.now()
    });
  }
});
```

---

## Circuit Breaker Pattern

Circuit breaker pattern ব্যবহার করে cascading failures prevent করা যায়।

### 1. Circuit Breaker Implementation

```bash
npm install opossum
```

```javascript
const CircuitBreaker = require('opossum');
const axios = require('axios');

// Function that might fail
async function callExternalAPI(userId) {
  const response = await axios.get(`https://api.example.com/users/${userId}`);
  return response.data;
}

// Circuit breaker options
const options = {
  timeout: 3000,              // Request timeout
  errorThresholdPercentage: 50, // Open circuit at 50% errors
  resetTimeout: 30000,        // Try again after 30 seconds
  rollingCountTimeout: 10000, // Rolling window for statistics
  rollingCountBuckets: 10     // Number of buckets
};

// Create circuit breaker
const breaker = new CircuitBreaker(callExternalAPI, options);

// Circuit breaker events
breaker.on('open', () => {
  console.log('Circuit opened - too many failures');
});

breaker.on('halfOpen', () => {
  console.log('Circuit half-open - trying again');
});

breaker.on('close', () => {
  console.log('Circuit closed - back to normal');
});

breaker.on('failure', (error) => {
  console.error('Request failed:', error.message);
});

breaker.on('success', (result) => {
  console.log('Request successful');
});

breaker.on('timeout', () => {
  console.error('Request timeout');
});

breaker.on('reject', () => {
  console.error('Request rejected - circuit open');
});

// Fallback function
breaker.fallback(() => {
  return {
    id: null,
    name: 'Default User',
    cached: true
  };
});

// Usage
async function getUser(userId) {
  try {
    const user = await breaker.fire(userId);
    return user;
  } catch (error) {
    console.error('Failed to get user:', error.message);
    throw error;
  }
}

// Express route
app.get('/users/:id', async (req, res) => {
  try {
    const user = await getUser(req.params.id);
    res.json(user);
  } catch (error) {
    res.status(503).json({
      error: 'Service temporarily unavailable'
    });
  }
});
```

### 2. Multiple Circuit Breakers

```javascript
// API Service with multiple endpoints
class APIService {
  constructor() {
    // Separate circuit breakers for different services
    this.userBreaker = new CircuitBreaker(this.fetchUsers, options);
    this.orderBreaker = new CircuitBreaker(this.fetchOrders, options);
    this.paymentBreaker = new CircuitBreaker(this.processPayment, {
      ...options,
      timeout: 5000, // Higher timeout for payments
      errorThresholdPercentage: 30 // Lower threshold
    });
    
    this.setupFallbacks();
  }
  
  setupFallbacks() {
    this.userBreaker.fallback(() => ({ error: 'User service unavailable' }));
    this.orderBreaker.fallback(() => ({ error: 'Order service unavailable' }));
    this.paymentBreaker.fallback(() => {
      throw new Error('Payment service unavailable - please try again');
    });
  }
  
  async fetchUsers(userId) {
    const response = await axios.get(`${API_URL}/users/${userId}`);
    return response.data;
  }
  
  async fetchOrders(userId) {
    const response = await axios.get(`${API_URL}/orders?userId=${userId}`);
    return response.data;
  }
  
  async processPayment(paymentData) {
    const response = await axios.post(`${API_URL}/payments`, paymentData);
    return response.data;
  }
  
  async getUser(userId) {
    return await this.userBreaker.fire(userId);
  }
  
  async getOrders(userId) {
    return await this.orderBreaker.fire(userId);
  }
  
  async pay(paymentData) {
    return await this.paymentBreaker.fire(paymentData);
  }
  
  getStatus() {
    return {
      users: {
        opened: this.userBreaker.opened,
        stats: this.userBreaker.stats
      },
      orders: {
        opened: this.orderBreaker.opened,
        stats: this.orderBreaker.stats
      },
      payments: {
        opened: this.paymentBreaker.opened,
        stats: this.paymentBreaker.stats
      }
    };
  }
}

const apiService = new APIService();

// Health check with circuit breaker status
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    circuitBreakers: apiService.getStatus()
  });
});
```

---

## Retry Mechanisms

Transient errors এর জন্য automatic retry করা যায়।

### 1. Simple Retry Logic

```javascript
async function retryOperation(operation, maxRetries = 3, delay = 1000) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      console.log(`Attempt ${attempt} failed:`, error.message);
      
      if (attempt === maxRetries) {
        throw error; // Final attempt failed
      }
      
      // Wait before retry
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}

// Usage
async function fetchData() {
  return await retryOperation(
    async () => {
      const response = await fetch('https://api.example.com/data');
      if (!response.ok) throw new Error('API error');
      return response.json();
    },
    3,  // Max 3 retries
    1000 // 1 second delay
  );
}
```

### 2. Exponential Backoff

```javascript
async function retryWithBackoff(
  operation,
  maxRetries = 5,
  baseDelay = 1000,
  maxDelay = 30000
) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      if (attempt === maxRetries) {
        throw error;
      }
      
      // Exponential backoff: 1s, 2s, 4s, 8s, 16s
      const delay = Math.min(
        baseDelay * Math.pow(2, attempt - 1),
        maxDelay
      );
      
      console.log(`Retry ${attempt}/${maxRetries} after ${delay}ms`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}

// Usage
async function saveToDatabase(data) {
  return await retryWithBackoff(
    async () => {
      return await User.create(data);
    },
    5,     // Max retries
    1000,  // Base delay
    30000  // Max delay
  );
}
```

### 3. Advanced Retry with Axios

```bash
npm install axios-retry
```

```javascript
const axios = require('axios');
const axiosRetry = require('axios-retry');

// Configure axios retry
axiosRetry(axios, {
  retries: 3,
  retryDelay: axiosRetry.exponentialDelay,
  retryCondition: (error) => {
    // Retry on network errors or 5xx errors
    return axiosRetry.isNetworkOrIdempotentRequestError(error) ||
           (error.response && error.response.status >= 500);
  },
  onRetry: (retryCount, error, requestConfig) => {
    console.log(`Retry attempt ${retryCount} for ${requestConfig.url}`);
  }
});

// Usage
async function fetchData(url) {
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error('Failed after retries:', error.message);
    throw error;
  }
}
```

### 4. Smart Retry (Conditional)

```javascript
class SmartRetry {
  constructor(options = {}) {
    this.maxRetries = options.maxRetries || 3;
    this.baseDelay = options.baseDelay || 1000;
    this.maxDelay = options.maxDelay || 30000;
    this.retryableErrors = options.retryableErrors || [
      'ETIMEDOUT',
      'ECONNRESET',
      'ENOTFOUND',
      'ECONNREFUSED'
    ];
    this.retryableStatusCodes = options.retryableStatusCodes || [
      408, 429, 500, 502, 503, 504
    ];
  }
  
  shouldRetry(error, attempt) {
    if (attempt >= this.maxRetries) return false;
    
    // Check error code
    if (error.code && this.retryableErrors.includes(error.code)) {
      return true;
    }
    
    // Check HTTP status
    if (error.response && 
        this.retryableStatusCodes.includes(error.response.status)) {
      return true;
    }
    
    return false;
  }
  
  getDelay(attempt) {
    const delay = this.baseDelay * Math.pow(2, attempt - 1);
    return Math.min(delay, this.maxDelay);
  }
  
  async execute(operation) {
    let lastError;
    
    for (let attempt = 1; attempt <= this.maxRetries + 1; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error;
        
        if (!this.shouldRetry(error, attempt)) {
          throw error;
        }
        
        const delay = this.getDelay(attempt);
        console.log(`Retry ${attempt}/${this.maxRetries} after ${delay}ms`);
        console.log(`Error: ${error.message}`);
        
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    
    throw lastError;
  }
}

// Usage
const retry = new SmartRetry({
  maxRetries: 3,
  baseDelay: 1000,
  retryableStatusCodes: [429, 500, 502, 503]
});

async function callAPI(endpoint) {
  return await retry.execute(async () => {
    const response = await axios.get(endpoint);
    return response.data;
  });
}
```

---

## Database Transaction Errors

Database transactions এ error handling বিশেষভাবে গুরুত্বপূর্ণ।

### 1. MongoDB Transaction with Error Handling

```javascript
const mongoose = require('mongoose');

async function transferMoney(fromUserId, toUserId, amount) {
  const session = await mongoose.startSession();
  
  try {
    await session.startTransaction();
    
    // Deduct from sender
    const sender = await User.findById(fromUserId).session(session);
    if (!sender) {
      throw new Error('Sender not found');
    }
    
    if (sender.balance < amount) {
      throw new Error('Insufficient balance');
    }
    
    sender.balance -= amount;
    await sender.save({ session });
    
    // Add to receiver
    const receiver = await User.findById(toUserId).session(session);
    if (!receiver) {
      throw new Error('Receiver not found');
    }
    
    receiver.balance += amount;
    await receiver.save({ session });
    
    // Create transaction record
    await Transaction.create([{
      from: fromUserId,
      to: toUserId,
      amount: amount,
      status: 'completed',
      timestamp: Date.now()
    }], { session });
    
    // Commit transaction
    await session.commitTransaction();
    
    console.log('Transaction successful');
    return { success: true, transactionId: transaction._id };
    
  } catch (error) {
    // Rollback on error
    await session.abortTransaction();
    console.error('Transaction failed:', error.message);
    
    // Log failed transaction
    await Transaction.create({
      from: fromUserId,
      to: toUserId,
      amount: amount,
      status: 'failed',
      error: error.message,
      timestamp: Date.now()
    });
    
    throw error;
    
  } finally {
    // Always end session
    session.endSession();
  }
}

// Usage with error handling
app.post('/transfer', async (req, res) => {
  try {
    const { fromUserId, toUserId, amount } = req.body;
    
    const result = await transferMoney(fromUserId, toUserId, amount);
    
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});
```

### 2. PostgreSQL Transaction (Sequelize)

```javascript
const { sequelize, User, Transaction } = require('./models');

async function transferMoney(fromUserId, toUserId, amount) {
  const transaction = await sequelize.transaction();
  
  try {
    // Find sender with lock
    const sender = await User.findByPk(fromUserId, {
      lock: transaction.LOCK.UPDATE,
      transaction
    });
    
    if (!sender) {
      throw new Error('Sender not found');
    }
    
    if (sender.balance < amount) {
      throw new Error('Insufficient balance');
    }
    
    // Update sender balance
    await sender.update(
      { balance: sender.balance - amount },
      { transaction }
    );
    
    // Find receiver with lock
    const receiver = await User.findByPk(toUserId, {
      lock: transaction.LOCK.UPDATE,
      transaction
    });
    
    if (!receiver) {
      throw new Error('Receiver not found');
    }
    
    // Update receiver balance
    await receiver.update(
      { balance: receiver.balance + amount },
      { transaction }
    );
    
    // Create transaction record
    const txRecord = await Transaction.create({
      fromUserId,
      toUserId,
      amount,
      status: 'completed'
    }, { transaction });
    
    // Commit
    await transaction.commit();
    
    return { success: true, transactionId: txRecord.id };
    
  } catch (error) {
    // Rollback
    await transaction.rollback();
    
    console.error('Transaction failed:', error.message);
    
    // Log error
    await Transaction.create({
      fromUserId,
      toUserId,
      amount,
      status: 'failed',
      errorMessage: error.message
    });
    
    throw error;
  }
}
```

### 3. Deadlock Handling

```javascript
async function handleDeadlock(operation, maxRetries = 3) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      // Check if it's a deadlock error
      const isDeadlock = 
        error.code === 'ER_LOCK_DEADLOCK' || // MySQL
        error.code === '40P01'; // PostgreSQL
      
      if (isDeadlock && attempt < maxRetries) {
        console.log(`Deadlock detected, retry ${attempt}/${maxRetries}`);
        
        // Random delay to avoid repeated deadlocks
        const delay = Math.random() * 1000;
        await new Promise(resolve => setTimeout(resolve, delay));
        
        continue;
      }
      
      throw error;
    }
  }
}

// Usage
async function updateInventory(productId, quantity) {
  return await handleDeadlock(async () => {
    const transaction = await sequelize.transaction();
    
    try {
      const product = await Product.findByPk(productId, {
        lock: transaction.LOCK.UPDATE,
        transaction
      });
      
      if (product.stock < quantity) {
        throw new Error('Insufficient stock');
      }
      
      await product.update(
        { stock: product.stock - quantity },
        { transaction }
      );
      
      await transaction.commit();
      return product;
      
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  });
}
```

---

## External API Error Handling

External APIs call করার সময় বিভিন্ন ধরনের errors handle করতে হয়।

### 1. Comprehensive API Error Handler

```javascript
class APIError extends Error {
  constructor(message, statusCode, originalError) {
    super(message);
    this.statusCode = statusCode;
    this.originalError = originalError;
    this.isAPIError = true;
  }
}

class ExternalAPIClient {
  constructor(baseURL, options = {}) {
    this.baseURL = baseURL;
    this.timeout = options.timeout || 10000;
    this.retries = options.retries || 3;
  }
  
  async request(endpoint, options = {}) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);
    
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        ...options,
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      // Handle different status codes
      if (response.ok) {
        return await response.json();
      }
      
      // Handle error responses
      const errorData = await response.json().catch(() => ({}));
      
      switch (response.status) {
        case 400:
          throw new APIError(
            errorData.message || 'Bad Request',
            400,
            errorData
          );
        
        case 401:
          throw new APIError(
            'Unauthorized - Invalid API key',
            401,
            errorData
          );
        
        case 403:
          throw new APIError(
            'Forbidden - Access denied',
            403,
            errorData
          );
        
        case 404:
          throw new APIError(
            'Resource not found',
            404,
            errorData
          );
        
        case 429:
          const retryAfter = response.headers.get('Retry-After');
          throw new APIError(
            `Rate limit exceeded. Retry after ${retryAfter}s`,
            429,
            { retryAfter, ...errorData }
          );
        
        case 500:
        case 502:
        case 503:
        case 504:
          throw new APIError(
            'External service error',
            response.status,
            errorData
          );
        
        default:
          throw new APIError(
            `HTTP Error ${response.status}`,
            response.status,
            errorData
          );
      }
      
    } catch (error) {
      clearTimeout(timeoutId);
      
      // Handle network errors
      if (error.name === 'AbortError') {
        throw new APIError(
          `Request timeout after ${this.timeout}ms`,
          408,
          error
        );
      }
      
      if (error.isAPIError) {
        throw error;
      }
      
      // Network error
      throw new APIError(
        'Network error - Unable to reach API',
        503,
        error
      );
    }
  }
  
  async get(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'GET' });
  }
  
  async post(endpoint, data, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      body: JSON.stringify(data)
    });
  }
}

// Usage with retry
async function fetchUserWithRetry(userId) {
  const client = new ExternalAPIClient('https://api.example.com');
  
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const user = await client.get(`/users/${userId}`);
      return user;
      
    } catch (error) {
      console.error(`Attempt ${attempt} failed:`, error.message);
      
      // Don't retry on 4xx errors (except 429)
      if (error.statusCode >= 400 && 
          error.statusCode < 500 && 
          error.statusCode !== 429) {
        throw error;
      }
      
      if (attempt === 3) {
        throw error;
      }
      
      // Wait before retry
      const delay = attempt * 1000;
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}
```

### 2. Rate Limit Handling

```javascript
class RateLimitedAPIClient {
  constructor(baseURL, rateLimit = { requests: 100, per: 60000 }) {
    this.baseURL = baseURL;
    this.rateLimit = rateLimit;
    this.requestQueue = [];
    this.processing = false;
  }
  
  async request(endpoint, options = {}) {
    return new Promise((resolve, reject) => {
      this.requestQueue.push({ endpoint, options, resolve, reject });
      this.processQueue();
    });
  }
  
  async processQueue() {
    if (this.processing || this.requestQueue.length === 0) return;
    
    this.processing = true;
    
    while (this.requestQueue.length > 0) {
      const { endpoint, options, resolve, reject } = this.requestQueue.shift();
      
      try {
        const response = await fetch(`${this.baseURL}${endpoint}`, options);
        
        if (response.status === 429) {
          const retryAfter = response.headers.get('Retry-After') || 60;
          console.log(`Rate limited, waiting ${retryAfter}s`);
          
          // Re-queue request
          this.requestQueue.unshift({ endpoint, options, resolve, reject });
          
          // Wait
          await new Promise(r => setTimeout(r, retryAfter * 1000));
          continue;
        }
        
        const data = await response.json();
        resolve(data);
        
        // Rate limiting delay
        const delay = this.rateLimit.per / this.rateLimit.requests;
        await new Promise(r => setTimeout(r, delay));
        
      } catch (error) {
        reject(error);
      }
    }
    
    this.processing = false;
  }
}
```

---

## Error Recovery Strategies

বিভিন্ন ধরনের errors এর জন্য আলাদা recovery strategies।

### 1. Error Recovery by Type

```javascript
class ErrorRecoveryService {
  constructor() {
    this.strategies = {
      'DatabaseError': this.recoverFromDatabaseError,
      'APIError': this.recoverFromAPIError,
      'ValidationError': this.recoverFromValidationError,
      'AuthenticationError': this.recoverFromAuthError
    };
  }
  
  async recover(error, context) {
    const errorType = error.constructor.name;
    const strategy = this.strategies[errorType];
    
    if (strategy) {
      return await strategy.call(this, error, context);
    }
    
    // Default recovery
    return this.defaultRecovery(error, context);
  }
  
  async recoverFromDatabaseError(error, context) {
    console.log('Recovering from database error...');
    
    // Try to reconnect
    try {
      await mongoose.connection.close();
      await mongoose.connect(process.env.MONGODB_URI);
      
      // Retry operation
      if (context.retryOperation) {
        return await context.retryOperation();
      }
    } catch (retryError) {
      // Use cache if available
      if (context.cacheKey && cache.has(context.cacheKey)) {
        return cache.get(context.cacheKey);
      }
      
      throw error;
    }
  }
  
  async recoverFromAPIError(error, context) {
    console.log('Recovering from API error...');
    
    // Use fallback API
    if (context.fallbackAPI) {
      try {
        return await context.fallbackAPI();
      } catch (fallbackError) {
        // Use cached data
        if (context.cachedData) {
          return context.cachedData;
        }
      }
    }
    
    // Return default data
    return context.defaultData || null;
  }
  
  async recoverFromValidationError(error, context) {
    console.log('Recovering from validation error...');
    
    // Use default values
    if (context.defaults) {
      return context.defaults;
    }
    
    throw error; // Can't recover from validation errors
  }
  
  async recoverFromAuthError(error, context) {
    console.log('Recovering from auth error...');
    
    // Try to refresh token
    if (context.refreshToken) {
      try {
        const newToken = await refreshAuthToken(context.refreshToken);
        context.token = newToken;
        
        // Retry with new token
        if (context.retryOperation) {
          return await context.retryOperation();
        }
      } catch (refreshError) {
        // Redirect to login
        throw new AuthenticationError('Please login again');
      }
    }
    
    throw error;
  }
  
  defaultRecovery(error, context) {
    console.error('No specific recovery strategy for:', error.constructor.name);
    throw error;
  }
}

// Usage
const recovery = new ErrorRecoveryService();

app.get('/users/:id', async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    res.json(user);
  } catch (error) {
    try {
      const recovered = await recovery.recover(error, {
        retryOperation: async () => await User.findById(req.params.id),
        cacheKey: `user:${req.params.id}`,
        defaultData: { id: req.params.id, name: 'Unknown' }
      });
      
      res.json(recovered);
    } catch (recoveryError) {
      next(recoveryError);
    }
  }
});
```

---

## Production Error Monitoring

Production এ error tracking এবং monitoring অত্যন্ত গুরুত্বপূর্ণ।

### 1. Sentry Integration (Complete Setup)

```bash
npm install @sentry/node @sentry/tracing
```

```javascript
// config/sentry.js
const Sentry = require('@sentry/node');
const Tracing = require('@sentry/tracing');

const initSentry = (app) => {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.NODE_ENV,
    
    // Performance monitoring
    tracesSampleRate: 1.0,
    
    // Release tracking
    release: process.env.RELEASE_VERSION,
    
    // Additional integrations
    integrations: [
      // HTTP integration
      new Sentry.Integrations.Http({ tracing: true }),
      
      // Express integration
      new Tracing.Integrations.Express({ app }),
      
      // MongoDB integration
      new Tracing.Integrations.Mongo({
        useMongoose: true
      })
    ],
    
    // Custom error filtering
    beforeSend(event, hint) {
      const error = hint.originalException;
      
      // Don't send validation errors
      if (error && error.name === 'ValidationError') {
        return null;
      }
      
      // Add custom context
      event.contexts = {
        ...event.contexts,
        app: {
          version: process.env.APP_VERSION,
          environment: process.env.NODE_ENV
        }
      };
      
      return event;
    }
  });
};

module.exports = initSentry;
```

**app.js:**
```javascript
const express = require('express');
const Sentry = require('@sentry/node');
const initSentry = require('./config/sentry');

const app = express();

// Initialize Sentry (must be first)
initSentry(app);

// Request handler (must be first middleware)
app.use(Sentry.Handlers.requestHandler());

// Tracing handler
app.use(Sentry.Handlers.tracingHandler());

// Your routes
app.get('/users/:id', async (req, res) => {
  // Add custom context
  Sentry.setContext('user_request', {
    userId: req.params.id,
    timestamp: Date.now()
  });
  
  try {
    const user = await User.findById(req.params.id);
    res.json(user);
  } catch (error) {
    // Add breadcrumb
    Sentry.addBreadcrumb({
      category: 'database',
      message: 'Failed to fetch user',
      level: 'error',
      data: { userId: req.params.id }
    });
    
    throw error;
  }
});

// Error handler (must be before other error middleware)
app.use(Sentry.Handlers.errorHandler());

// Custom error handler
app.use((err, req, res, next) => {
  res.status(500).json({
    error: 'Internal server error',
    eventId: res.sentry // Sentry event ID
  });
});

module.exports = app;
```

### 2. Custom Error Tracking

```javascript
// services/errorTracker.js
class ErrorTracker {
  constructor() {
    this.errors = [];
    this.errorCounts = new Map();
  }
  
  track(error, context = {}) {
    const errorInfo = {
      message: error.message,
      stack: error.stack,
      type: error.constructor.name,
      timestamp: Date.now(),
      context: context,
      userAgent: context.req?.headers['user-agent'],
      url: context.req?.url,
      method: context.req?.method,
      userId: context.user?.id
    };
    
    // Store error
    this.errors.push(errorInfo);
    
    // Count occurrences
    const key = `${error.constructor.name}:${error.message}`;
    this.errorCounts.set(key, (this.errorCounts.get(key) || 0) + 1);
    
    // Alert if error occurs too frequently
    if (this.errorCounts.get(key) > 10) {
      this.sendAlert(errorInfo);
    }
    
    // Keep only last 1000 errors
    if (this.errors.length > 1000) {
      this.errors = this.errors.slice(-1000);
    }
  }
  
  async sendAlert(errorInfo) {
    // Send email/SMS/Slack notification
    console.error('ALERT: Frequent error detected!', errorInfo);
    
    // Example: Send to Slack
    try {
      await axios.post(process.env.SLACK_WEBHOOK_URL, {
        text: `⚠️ Error Alert: ${errorInfo.message}`,
        attachments: [{
          color: 'danger',
          fields: [
            { title: 'Type', value: errorInfo.type, short: true },
            { title: 'Count', value: this.errorCounts.get(`${errorInfo.type}:${errorInfo.message}`), short: true },
            { title: 'URL', value: errorInfo.url },
            { title: 'Stack', value: errorInfo.stack.substring(0, 500) }
          ]
        }]
      });
    } catch (err) {
      console.error('Failed to send alert:', err);
    }
  }
  
  getStats() {
    const stats = {
      total: this.errors.length,
      byType: {},
      recent: this.errors.slice(-10),
      topErrors: []
    };
    
    // Group by type
    this.errors.forEach(error => {
      stats.byType[error.type] = (stats.byType[error.type] || 0) + 1;
    });
    
    // Top errors
    stats.topErrors = Array.from(this.errorCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([key, count]) => ({ error: key, count }));
    
    return stats;
  }
}

const errorTracker = new ErrorTracker();

// Error tracking middleware
const trackError = (err, req, res, next) => {
  errorTracker.track(err, {
    req,
    user: req.user
  });
  next(err);
};

// Stats endpoint
app.get('/admin/error-stats', (req, res) => {
  res.json(errorTracker.getStats());
});

module.exports = { errorTracker, trackError };
```

### 3. Performance Monitoring

```javascript
// middleware/performanceMonitor.js
class PerformanceMonitor {
  constructor() {
    this.metrics = [];
  }
  
  middleware() {
    return (req, res, next) => {
      const start = Date.now();
      
      // Capture response
      const originalSend = res.send;
      res.send = function(data) {
        const duration = Date.now() - start;
        
        // Log slow requests
        if (duration > 1000) {
          console.warn('Slow request detected:', {
            url: req.url,
            method: req.method,
            duration: `${duration}ms`
          });
        }
        
        // Store metrics
        this.metrics.push({
          url: req.url,
          method: req.method,
          status: res.statusCode,
          duration,
          timestamp: Date.now()
        });
        
        return originalSend.call(this, data);
      }.bind(this);
      
      next();
    };
  }
  
  getMetrics() {
    const now = Date.now();
    const last5Min = this.metrics.filter(m => now - m.timestamp < 300000);
    
    return {
      total: last5Min.length,
      averageResponseTime: last5Min.reduce((sum, m) => sum + m.duration, 0) / last5Min.length,
      slowRequests: last5Min.filter(m => m.duration > 1000).length,
      errors: last5Min.filter(m => m.status >= 400).length
    };
  }
}

const monitor = new PerformanceMonitor();
app.use(monitor.middleware());

app.get('/admin/performance', (req, res) => {
  res.json(monitor.getMetrics());
});
```

---

## Best Practices Summary

### ✅ Do's:

1. **Always handle errors**
   - Use try-catch for async/await
   - Use .catch() for promises
   - Implement error middleware

2. **Use custom error classes**
   - Distinguish error types
   - Include status codes
   - Make errors meaningful

3. **Log everything**
   - Use proper logging library (Winston)
   - Log different levels (error, warn, info)
   - Include context (user, request, etc.)

4. **Validate input**
   - Check data types
   - Validate ranges
   - Sanitize user input

5. **Use meaningful error messages**
   - Clear and descriptive
   - Help debugging
   - User-friendly in production

### ❌ Don'ts:

1. **Don't ignore errors**
   ```javascript
   // ❌ Bad
   doSomething().catch(() => {});
   
   // ✅ Good
   doSomething().catch(error => {
     logger.error('Error:', error);
     // Handle appropriately
   });
   ```

2. **Don't expose sensitive info**
   ```javascript
   // ❌ Bad
   res.status(500).json({ error: error.stack });
   
   // ✅ Good
   res.status(500).json({ 
     error: 'Internal server error' 
   });
   ```

3. **Don't swallow errors**
   ```javascript
   // ❌ Bad
   try {
     await doSomething();
   } catch (error) {
     console.log('Error occurred');
   }
   
   // ✅ Good
   try {
     await doSomething();
   } catch (error) {
     logger.error('Error:', error);
     throw error; // or handle properly
   }
   ```

4. **Don't use generic error messages**
   ```javascript
   // ❌ Bad
   throw new Error('Error');
   
   // ✅ Good
   throw new NotFoundError('User with ID 123 not found');
   ```

---

এই comprehensive guide এ Error Handling এবং Debugging এর সব গুরুত্বপূর্ণ aspects cover করা হয়েছে। এই practices follow করে আপনি robust এবং maintainable Node.js applications তৈরি করতে পারবেন! 🚀
