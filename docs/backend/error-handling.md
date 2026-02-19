# Error Handling (এরর হ্যান্ডলিং)

## Error Handling কেন গুরুত্বপূর্ণ?

প্রতিটি backend application-এ error হবেই — database down থাকতে পারে, user ভুল input দিতে পারে, third-party API fail করতে পারে। প্রশ্ন হলো: **error হলে তোমার app কী করে?**

```
❌ Error Handling ছাড়া:
User → Request → Server crashes → User দেখে "Cannot GET /" বা blank page

✅ Error Handling সহ:
User → Request → Error ধরা পড়লো → User দেখে meaningful message
                                  → Developer দেখে detailed log
                                  → Server চলতে থাকে
```

> **মূল নীতি:** Error কখনো ignore করো না। ধরো, handle করো, log করো — কিন্তু app যেন crash না করে।

---

## Error-এর প্রকারভেদ

### 1. Operational Errors (প্রত্যাশিত ভুল)

এগুলো আমরা **আগে থেকেই জানি** হতে পারে:

| Error                        | উদাহরণ                             |
| ---------------------------- | ---------------------------------- |
| **Validation Error**         | User email ছাড়া signup করলো       |
| **Authentication Error**     | ভুল password দিলো                  |
| **Authorization Error**      | User admin route access করতে চাইলো |
| **Not Found**                | এমন resource নেই                   |
| **Conflict**                 | Duplicate email দিয়ে register     |
| **External Service Failure** | Payment gateway down               |
| **Database Error**           | Connection timeout                 |
| **Rate Limit Exceeded**      | অনেক বেশি request পাঠালো           |

### 2. Programming Errors (Bug)

এগুলো developer-এর **ভুল কোড** থেকে হয়:

| Error              | উদাহরণ                          |
| ------------------ | ------------------------------- |
| **TypeError**      | `undefined.property` access করা |
| **ReferenceError** | অস্তিত্বহীন variable ব্যবহার    |
| **SyntaxError**    | ভুল code syntax                 |
| **Logic Error**    | ভুল condition বা calculation    |

```
Operational Error → Handle করো, user-কে meaningful response দাও
Programming Error → Fix করো, log করো, process restart দাও (graceful)
```

---

## JavaScript/Node.js-এ Error Fundamentals

### Error Object

```javascript
const error = new Error("Something went wrong");

console.log(error.message); // "Something went wrong"
console.log(error.name); // "Error"
console.log(error.stack); // Stack trace (কোথায় error হলো)
```

### try...catch

```javascript
try {
  const data = JSON.parse("invalid json");
} catch (error) {
  console.log(error.message); // "Unexpected token i in JSON..."
} finally {
  console.log("এটা সবসময় চলবে");
}
```

### throw

```javascript
function divide(a, b) {
  if (b === 0) {
    throw new Error("Division by zero is not allowed");
  }
  return a / b;
}

try {
  divide(10, 0);
} catch (error) {
  console.log(error.message); // "Division by zero is not allowed"
}
```

### Async Error Handling

```javascript
// ❌ try-catch synchronous error ধরবে, async ধরবে না
try {
  setTimeout(() => {
    throw new Error("Async error"); // এটা catch হবে না!
  }, 1000);
} catch (error) {
  // এখানে আসবে না
}

// ✅ Promise-based error handling
async function fetchUser(id) {
  try {
    const user = await db.users.findById(id);
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  } catch (error) {
    console.error("Error fetching user:", error.message);
    throw error; // re-throw for caller to handle
  }
}
```

---

## Custom Error Classes

Real project-এ generic `Error` ব্যবহার না করে **custom error classes** তৈরি করাই best practice:

### Base Custom Error

```javascript
class AppError extends Error {
  constructor(message, statusCode, errorCode) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}
```

### Specific Error Classes

```javascript
class ValidationError extends AppError {
  constructor(message, details = []) {
    super(message, 400, "VALIDATION_ERROR");
    this.details = details;
  }
}

class NotFoundError extends AppError {
  constructor(resource, id) {
    super(`${resource} with id '${id}' not found`, 404, "NOT_FOUND");
    this.resource = resource;
  }
}

class AuthenticationError extends AppError {
  constructor(message = "Authentication required") {
    super(message, 401, "AUTH_ERROR");
  }
}

class ForbiddenError extends AppError {
  constructor(message = "You do not have permission") {
    super(message, 403, "FORBIDDEN");
  }
}

class ConflictError extends AppError {
  constructor(message) {
    super(message, 409, "CONFLICT");
  }
}

class RateLimitError extends AppError {
  constructor(retryAfter = 60) {
    super("Too many requests", 429, "RATE_LIMIT");
    this.retryAfter = retryAfter;
  }
}

class ExternalServiceError extends AppError {
  constructor(service, originalError) {
    super(`${service} service failed`, 502, "EXTERNAL_SERVICE_ERROR");
    this.service = service;
    this.originalError = originalError;
    this.isOperational = true;
  }
}
```

### Custom Error ব্যবহার

```javascript
// Route Handler-এ:
async function getUser(req, res, next) {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      throw new NotFoundError("User", req.params.id);
    }
    res.json(user);
  } catch (error) {
    next(error);
  }
}

async function createUser(req, res, next) {
  try {
    const { email, name, password } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      throw new ConflictError(`Email '${email}' already registered`);
    }

    const user = await User.create({ email, name, password });
    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
}
```

---

## Express.js Error Handling Architecture

### Error Handling Middleware

```javascript
function errorHandler(err, req, res, next) {
  // Default values
  let statusCode = err.statusCode || 500;
  let errorCode = err.errorCode || "INTERNAL_ERROR";
  let message = err.message || "Something went wrong";

  // Operational error → client-friendly message পাঠাও
  if (err.isOperational) {
    const response = {
      status: "error",
      error: {
        code: errorCode,
        message: message,
      },
    };

    // Validation error হলে details ও পাঠাও
    if (err.details) {
      response.error.details = err.details;
    }

    return res.status(statusCode).json(response);
  }

  // Programming error → generic message পাঠাও, details log করো
  console.error("💥 UNEXPECTED ERROR:", err);

  res.status(500).json({
    status: "error",
    error: {
      code: "INTERNAL_ERROR",
      message: "An unexpected error occurred",
    },
  });
}
```

### Known Error Conversion

কিছু library-এর error গুলোকে আমাদের custom error-এ convert করা:

```javascript
function errorHandler(err, req, res, next) {
  let error = err;

  // Mongoose Validation Error
  if (err.name === "ValidationError" && err.errors) {
    const details = Object.values(err.errors).map((e) => ({
      field: e.path,
      message: e.message,
    }));
    error = new ValidationError("Validation failed", details);
  }

  // Mongoose Duplicate Key Error
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    error = new ConflictError(`Duplicate value for '${field}'`);
  }

  // Mongoose Cast Error (invalid ObjectId)
  if (err.name === "CastError") {
    error = new ValidationError(`Invalid ${err.path}: ${err.value}`);
  }

  // JWT Errors
  if (err.name === "JsonWebTokenError") {
    error = new AuthenticationError("Invalid token");
  }
  if (err.name === "TokenExpiredError") {
    error = new AuthenticationError("Token expired");
  }

  // এখন standard response পাঠাও
  const statusCode = error.statusCode || 500;
  const response = {
    status: "error",
    error: {
      code: error.errorCode || "INTERNAL_ERROR",
      message: error.isOperational ? error.message : "Something went wrong",
    },
  };

  if (error.details) {
    response.error.details = error.details;
  }

  // Development-এ stack trace দেখাও
  if (process.env.NODE_ENV === "development") {
    response.error.stack = err.stack;
  }

  res.status(statusCode).json(response);
}
```

---

## Error Response Format

### Consistent Error Response Structure

```json
{
  "status": "error",
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": [
      {
        "field": "email",
        "message": "Must be a valid email address"
      },
      {
        "field": "password",
        "message": "Must be at least 8 characters"
      }
    ]
  }
}
```

### বিভিন্ন Error Response উদাহরণ

```json
// 401 - Authentication Error
{
    "status": "error",
    "error": {
        "code": "AUTH_ERROR",
        "message": "Invalid or expired token"
    }
}

// 403 - Forbidden
{
    "status": "error",
    "error": {
        "code": "FORBIDDEN",
        "message": "You do not have permission to access this resource"
    }
}

// 404 - Not Found
{
    "status": "error",
    "error": {
        "code": "NOT_FOUND",
        "message": "User with id '507f1f77bcf86cd799439011' not found"
    }
}

// 409 - Conflict
{
    "status": "error",
    "error": {
        "code": "CONFLICT",
        "message": "Email 'ripon@example.com' already registered"
    }
}

// 429 - Rate Limit
{
    "status": "error",
    "error": {
        "code": "RATE_LIMIT",
        "message": "Too many requests",
        "retryAfter": 60
    }
}

// 500 - Internal Error
{
    "status": "error",
    "error": {
        "code": "INTERNAL_ERROR",
        "message": "An unexpected error occurred"
    }
}
```

---

## Async Error Handling Pattern

Express-এ async function-এ error ধরতে try-catch লাগে। কিন্তু প্রতিটি route-এ try-catch লেখা বিরক্তিকর:

### সমস্যা: প্রতিবার try-catch

```javascript
// ❌ প্রতিটি route-এ try-catch repeat
app.get("/api/users", async (req, res, next) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    next(error);
  }
});

app.get("/api/users/:id", async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) throw new NotFoundError("User", req.params.id);
    res.json(user);
  } catch (error) {
    next(error);
  }
});
```

### সমাধান: asyncHandler Wrapper

```javascript
function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

// ✅ Clean code — try-catch দরকার নেই
app.get(
  "/api/users",
  asyncHandler(async (req, res) => {
    const users = await User.find();
    res.json(users);
  }),
);

app.get(
  "/api/users/:id",
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) throw new NotFoundError("User", req.params.id);
    res.json(user);
  }),
);

// Error হলে automatically next(error) call হবে → Error middleware-এ যাবে
```

> **Note:** Express 5 থেকে async error handling built-in আছে — `asyncHandler` দরকার নেই। কিন্তু Express 4-এ এটা must।

---

## Global Error Handling (Process Level)

কিছু error কোনো route-এ ধরা যায় না — সেগুলো globally handle করতে হয়:

### Unhandled Promise Rejection

```javascript
process.on("unhandledRejection", (reason, promise) => {
  console.error("UNHANDLED REJECTION! 💥");
  console.error("Reason:", reason);

  // Graceful shutdown
  server.close(() => {
    process.exit(1);
  });
});
```

### Uncaught Exception

```javascript
process.on("uncaughtException", (error) => {
  console.error("UNCAUGHT EXCEPTION! 💥");
  console.error(error);

  // Immediately exit — state corrupted হতে পারে
  process.exit(1);
});
```

```
unhandledRejection → Promise.reject() কোথাও catch হয়নি
uncaughtException  → Synchronous throw কোথাও catch হয়নি

দুটোই মানে কিছু একটা seriously ভুল হয়েছে → Log করো → Gracefully shutdown করো
Process manager (PM2) আবার restart করবে
```

### Graceful Shutdown

```javascript
function gracefulShutdown(signal) {
  console.log(`${signal} received. Starting graceful shutdown...`);

  server.close(() => {
    console.log("HTTP server closed");

    // Database connection বন্ধ করো
    mongoose.connection.close(false, () => {
      console.log("Database connection closed");

      // Redis connection বন্ধ করো
      redisClient.quit(() => {
        console.log("Redis connection closed");
        process.exit(0);
      });
    });
  });

  // Force shutdown after 30 seconds
  setTimeout(() => {
    console.error("Forced shutdown after timeout");
    process.exit(1);
  }, 30000);
}

process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));
```

---

## 404 Not Found Handler

Route match না করলে 404 দেওয়ার middleware:

```javascript
// সব route-এর পরে, error handler-এর আগে
app.use((req, res, next) => {
  next(new NotFoundError("Route", `${req.method} ${req.originalUrl}`));
});

// অথবা সরাসরি:
app.use((req, res) => {
  res.status(404).json({
    status: "error",
    error: {
      code: "NOT_FOUND",
      message: `Route ${req.method} ${req.originalUrl} not found`,
    },
  });
});
```

---

## Error Logging Best Practices

### কী Log করবে?

```javascript
function errorHandler(err, req, res, next) {
  const logData = {
    timestamp: new Date().toISOString(),
    requestId: req.id,
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
    userId: req.user?.id,
    userAgent: req.get("User-Agent"),

    error: {
      name: err.name,
      message: err.message,
      code: err.errorCode,
      statusCode: err.statusCode,
      stack: err.stack,
      isOperational: err.isOperational,
    },
  };

  if (err.isOperational) {
    logger.warn(logData);
  } else {
    logger.error(logData);
  }

  // ... response পাঠাও
}
```

### Log Levels

```
ERROR   → Unexpected errors, system failures (alert দাও)
WARN    → Operational errors, validation failures (monitor করো)
INFO    → Normal operations (reference-এ রাখো)
DEBUG   → Detailed debugging info (production-এ বন্ধ রাখো)
```

### Winston Logger Setup

```javascript
const winston = require("winston");

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json(),
  ),
  transports: [
    new winston.transports.File({
      filename: "logs/error.log",
      level: "error",
    }),
    new winston.transports.File({
      filename: "logs/combined.log",
    }),
  ],
});

if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple(),
    }),
  );
}
```

---

## Error Handling in Different Scenarios

### Database Errors

```javascript
async function getUserFromDB(id) {
  try {
    const user = await User.findById(id);
    if (!user) throw new NotFoundError("User", id);
    return user;
  } catch (error) {
    if (error instanceof AppError) throw error;

    if (error.name === "CastError") {
      throw new ValidationError(`Invalid user ID format: ${id}`);
    }
    if (error.code === "ECONNREFUSED") {
      throw new ExternalServiceError("Database", error);
    }

    throw error;
  }
}
```

### External API Call Errors

```javascript
async function callPaymentGateway(paymentData) {
  try {
    const response = await axios.post(
      "https://api.payment.com/charge",
      paymentData,
      {
        timeout: 10000,
      },
    );
    return response.data;
  } catch (error) {
    if (error.code === "ECONNABORTED") {
      throw new ExternalServiceError(
        "Payment Gateway",
        new Error("Request timeout"),
      );
    }
    if (error.response) {
      const status = error.response.status;
      if (status === 402) {
        throw new AppError("Payment declined", 402, "PAYMENT_DECLINED");
      }
      if (status >= 500) {
        throw new ExternalServiceError("Payment Gateway", error);
      }
    }
    throw new ExternalServiceError("Payment Gateway", error);
  }
}
```

### File Operation Errors

```javascript
const fs = require("fs").promises;

async function readConfigFile(path) {
  try {
    const data = await fs.readFile(path, "utf8");
    return JSON.parse(data);
  } catch (error) {
    if (error.code === "ENOENT") {
      throw new NotFoundError("Config file", path);
    }
    if (error instanceof SyntaxError) {
      throw new AppError(
        "Invalid config file format",
        500,
        "CONFIG_PARSE_ERROR",
      );
    }
    throw error;
  }
}
```

---

## Error Handling in Python (FastAPI)

### Custom Exception Classes

```python
class AppException(Exception):
    def __init__(self, message: str, status_code: int, error_code: str):
        self.message = message
        self.status_code = status_code
        self.error_code = error_code

class NotFoundError(AppException):
    def __init__(self, resource: str, id: str):
        super().__init__(
            message=f"{resource} with id '{id}' not found",
            status_code=404,
            error_code="NOT_FOUND"
        )

class ValidationError(AppException):
    def __init__(self, message: str, details: list = None):
        super().__init__(message=message, status_code=400, error_code="VALIDATION_ERROR")
        self.details = details or []
```

### FastAPI Exception Handler

```python
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse

app = FastAPI()

@app.exception_handler(AppException)
async def app_exception_handler(request: Request, exc: AppException):
    response = {
        "status": "error",
        "error": {
            "code": exc.error_code,
            "message": exc.message
        }
    }
    if hasattr(exc, 'details') and exc.details:
        response["error"]["details"] = exc.details
    return JSONResponse(status_code=exc.status_code, content=response)

@app.exception_handler(Exception)
async def generic_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content={
            "status": "error",
            "error": {
                "code": "INTERNAL_ERROR",
                "message": "An unexpected error occurred"
            }
        }
    )

@app.get("/users/{user_id}")
async def get_user(user_id: str):
    user = await db.find_user(user_id)
    if not user:
        raise NotFoundError("User", user_id)
    return user
```

---

## Production Error Handling Checklist

```
✅ Custom Error Classes — প্রতিটি error type-এর জন্য আলাদা class
✅ Consistent Response — সব error একই format-এ return
✅ Operational vs Programming — দুই ধরনের error আলাদা handle
✅ Async Errors — asyncHandler wrapper বা Express 5 ব্যবহার
✅ Global Handlers — unhandledRejection ও uncaughtException handle
✅ Graceful Shutdown — Process kill হলে connection বন্ধ করে exit
✅ 404 Handler — Unknown route-এর জন্য proper 404 response
✅ Error Logging — Winston/Pino দিয়ে structured logging
✅ Stack Trace — Production-এ client-কে দেখাবে না, শুধু log-এ রাখবে
✅ Mongoose/JWT Error Conversion — Library error → Custom error
✅ External Service Errors — Timeout, connection refused handle
✅ Request Context — Log-এ request ID, user ID, method, URL রাখো
✅ Monitoring — Error alerts setup (Sentry, Datadog, etc.)
```

---

## Error Handling Architecture — সম্পূর্ণ Flow

```
           Request
              │
              ▼
    ┌─────────────────┐
    │   Middleware     │ ← Error হলে → next(error)
    └────────┬────────┘
             │
             ▼
    ┌─────────────────┐
    │  Route Handler   │ ← throw new AppError()
    │  (asyncHandler)  │ ← catch → next(error)
    └────────┬────────┘
             │
             ▼
    ┌─────────────────┐
    │  Service Layer   │ ← throw new NotFoundError()
    └────────┬────────┘
             │
             ▼
    ┌─────────────────┐
    │  Database/API    │ ← Mongoose/Axios error
    └────────┬────────┘
             │ (error bubbles up)
             ▼
    ┌─────────────────┐
    │  Error Handler   │ ← (err, req, res, next)
    │  Middleware       │
    │                   │ → Convert known errors
    │                   │ → Log with context
    │                   │ → Send consistent response
    └────────┬────────┘
             │
             ▼
         Response
    { status: "error", error: { code, message } }
```

---

## সংক্ষেপে মনে রাখার সূত্র

```
Error = 2 ধরনের
  Operational → আগে থেকে জানি (404, 401, validation) → Handle করো
  Programming → Bug (TypeError, ReferenceError) → Fix করো

Custom Error Classes:
  AppError → Base class (message, statusCode, errorCode, isOperational)
  NotFoundError, ValidationError, AuthError... → Extends AppError

Express Error Flow:
  throw/next(error) → Error Middleware (4 params) → Consistent JSON response

asyncHandler → try-catch ছাড়া async error ধরা

Global:
  unhandledRejection → Promise catch না হলে
  uncaughtException  → throw catch না হলে
  দুটোতেই → Log করো → Graceful shutdown

Production Rules:
  ✅ Client-কে meaningful message দাও
  ✅ Stack trace শুধু log-এ, client-কে না
  ✅ সব error একই format-এ return করো
  ✅ Structured logging (Winston/Pino)
  ✅ Error monitoring (Sentry/Datadog)
```

---

## Interview Golden Lines

> **Operational errors are expected (validation, auth failure) and should be handled gracefully. Programming errors are bugs and should crash the process for restart.**

> **Custom error classes with statusCode and errorCode provide consistent, client-friendly error responses.**

> **asyncHandler wraps async route handlers to catch rejected promises and forward them to the error middleware.**

> **Global handlers (unhandledRejection, uncaughtException) are the last safety net — log and gracefully shutdown.**

> **Never expose stack traces or internal details to the client in production — log them server-side only.**
