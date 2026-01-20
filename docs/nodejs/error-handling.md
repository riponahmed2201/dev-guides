# Error Handling & Debugging in Node.js - সম্পূর্ণ গাইড

Error handling এবং debugging হলো professional Node.js development এর অত্যন্ত গুরুত্বপূর্ণ দুটি skill। এই গাইডে আপনি শিখবেন কিভাবে errors সঠিকভাবে handle করতে হয় এবং দ্রুত bugs খুঁজে বের করতে হয়।

## 📑 Table of Contents
1. [Try-Catch Blocks](#try-catch-blocks)
2. [Error Handling Middleware](#error-handling-middleware)
3. [Custom Error Classes](#custom-error-classes)
4. [Operational vs Programming Errors](#operational-vs-programming-errors)
5. [Error Logging](#error-logging)
6. [Debugging Techniques](#debugging-techniques)
7. [Node.js Debugger](#nodejs-debugger)
8. [VS Code Debugging](#vs-code-debugging)
9. [Console Methods](#console-methods)
10. [Stack Traces পড়া](#stack-traces-পড়া)

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
