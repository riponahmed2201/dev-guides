# Middleware (মিডলওয়্যার)

## Middleware কী?

**Middleware** হলো এমন একটি function যা **request আর response-এর মাঝখানে** বসে কাজ করে। Request server-এ পৌঁছানোর আগে বা response client-এ যাওয়ার আগে middleware সেটাকে process, modify বা block করতে পারে।

```
Client → Middleware 1 → Middleware 2 → Middleware 3 → Route Handler → Response
         (Auth check)   (Logging)      (Validation)   (Business logic)
```

> **বাস্তব উদাহরণ:** Airport-এ boarding pass check → security check → immigration check → তারপর plane-এ ওঠো। প্রতিটি checkpoint একটা middleware — কোনো একটাতে fail করলে আর সামনে যেতে পারবে না।

---

## Middleware কেন দরকার?

### Middleware ছাড়া

```javascript
app.get("/api/users", (req, res) => {
  // Authentication check
  const token = req.headers.authorization;
  if (!token) return res.status(401).json({ error: "No token" });
  const user = verifyToken(token);
  if (!user) return res.status(401).json({ error: "Invalid token" });

  // Logging
  console.log(`${new Date()} GET /api/users by ${user.id}`);

  // Actual business logic
  const users = db.getUsers();
  res.json(users);
});

app.get("/api/posts", (req, res) => {
  // আবার Authentication check (duplicate!)
  const token = req.headers.authorization;
  if (!token) return res.status(401).json({ error: "No token" });
  const user = verifyToken(token);
  if (!user) return res.status(401).json({ error: "Invalid token" });

  // আবার Logging (duplicate!)
  console.log(`${new Date()} GET /api/posts by ${user.id}`);

  // Actual business logic
  const posts = db.getPosts();
  res.json(posts);
});

// সমস্যা: প্রতিটি route-এ auth ও logging code repeat হচ্ছে!
```

### Middleware দিয়ে

```javascript
// Auth middleware — একবার লিখলাম
function authMiddleware(req, res, next) {
  const token = req.headers.authorization;
  if (!token) return res.status(401).json({ error: "No token" });
  const user = verifyToken(token);
  if (!user) return res.status(401).json({ error: "Invalid token" });
  req.user = user;
  next();
}

// Logging middleware — একবার লিখলাম
function loggingMiddleware(req, res, next) {
  console.log(`${new Date()} ${req.method} ${req.url}`);
  next();
}

// সব route-এ apply
app.use(loggingMiddleware);
app.use("/api", authMiddleware);

// Route handlers — শুধু business logic
app.get("/api/users", (req, res) => {
  const users = db.getUsers();
  res.json(users);
});

app.get("/api/posts", (req, res) => {
  const posts = db.getPosts();
  res.json(posts);
});

// কোনো duplication নেই!
```

---

## Middleware কীভাবে কাজ করে?

### The next() Function

প্রতিটি middleware-এ তিনটি জিনিস থাকে: `req`, `res`, `next`।

```
next() call করলে → পরবর্তী middleware-এ যায়
next() call না করলে → request আটকে যায় (chain ভেঙে যায়)
res.send()/res.json() call করলে → response client-এ চলে যায়
```

```javascript
function middleware1(req, res, next) {
  console.log("Middleware 1 - Start");
  next(); // পরবর্তী middleware-এ যাও
  console.log("Middleware 1 - End"); // response ফেরত আসার পর চলে
}

function middleware2(req, res, next) {
  console.log("Middleware 2 - Start");
  next();
  console.log("Middleware 2 - End");
}

function handler(req, res) {
  console.log("Route Handler");
  res.send("Done");
}

// Output:
// Middleware 1 - Start
// Middleware 2 - Start
// Route Handler
// Middleware 2 - End
// Middleware 1 - End
```

```
Execution order (Onion Model):

        Request →
    ┌──────────────────────────┐
    │  Middleware 1 (start)     │
    │  ┌────────────────────┐  │
    │  │  Middleware 2 (start)│  │
    │  │  ┌──────────────┐  │  │
    │  │  │ Route Handler │  │  │
    │  │  └──────────────┘  │  │
    │  │  Middleware 2 (end)  │  │
    │  └────────────────────┘  │
    │  Middleware 1 (end)       │
    └──────────────────────────┘
        ← Response
```

### Request Block করা

```javascript
function authMiddleware(req, res, next) {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ error: "Token required" });
    // next() call হচ্ছে না → chain এখানেই শেষ
    // Route handler-এ যাবে না
  }

  try {
    req.user = verifyToken(token);
    next(); // Token valid → পরবর্তী middleware/handler-এ যাও
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
}
```

```
Token ছাড়া:
Client → Auth Middleware → 401 Unauthorized (STOP!)
                          Route Handler-এ যাবে না

Token দিয়ে:
Client → Auth Middleware → next() → Route Handler → Response
```

---

## Middleware-এর প্রকারভেদ

### 1. Application-Level Middleware

পুরো app-এ বা নির্দিষ্ট route-এ apply:

```javascript
// সব route-এ apply
app.use(loggingMiddleware);
app.use(express.json());

// নির্দিষ্ট path-এ apply
app.use("/api", authMiddleware);
app.use("/admin", adminOnlyMiddleware);
```

### 2. Router-Level Middleware

নির্দিষ্ট router-এ apply:

```javascript
const userRouter = express.Router();
userRouter.use(authMiddleware);

userRouter.get("/", getUsers);
userRouter.post("/", createUser);

app.use("/api/users", userRouter);
```

### 3. Route-Specific Middleware

শুধু একটি route-এ apply:

```javascript
app.delete(
  "/api/users/:id",
  authMiddleware, // আগে auth check
  adminOnlyMiddleware, // তারপর admin check
  deleteUserHandler, // তারপর delete
);
```

### 4. Error-Handling Middleware

Error catch করার জন্য special middleware (4টি parameter):

```javascript
function errorHandler(err, req, res, next) {
  console.error(err.stack);

  if (err.name === "ValidationError") {
    return res.status(400).json({
      status: "error",
      error: { code: "VALIDATION_ERROR", message: err.message },
    });
  }

  if (err.name === "UnauthorizedError") {
    return res.status(401).json({
      status: "error",
      error: { code: "AUTH_ERROR", message: "Invalid token" },
    });
  }

  res.status(500).json({
    status: "error",
    error: { code: "INTERNAL_ERROR", message: "Something went wrong" },
  });
}

// সবার শেষে register করতে হয়
app.use(errorHandler);
```

```
Normal middleware:  (req, res, next)       → ৩টি parameter
Error middleware:   (err, req, res, next)   → ৪টি parameter

Route handler-এ error হলে:
next(error) → সব normal middleware skip → Error middleware-এ যায়
```

### 5. Third-Party Middleware

npm packages যা middleware হিসেবে কাজ করে:

```javascript
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const compression = require("compression");

const app = express();

app.use(express.json()); // JSON body parse
app.use(cors()); // CORS headers
app.use(helmet()); // Security headers
app.use(morgan("combined")); // HTTP logging
app.use(compression()); // Response compression
app.use(
  rateLimit({
    // Rate limiting
    windowMs: 60 * 1000,
    max: 100,
  }),
);
```

---

## Common Middleware Examples

### Authentication Middleware

```javascript
async function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Token required" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.userId);
    if (!req.user) {
      return res.status(401).json({ error: "User not found" });
    }
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}
```

### Authorization (Role Check) Middleware

```javascript
function authorize(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: "Insufficient permissions" });
    }
    next();
  };
}

// Usage:
app.delete("/api/users/:id", authenticate, authorize("admin"), deleteUser);
app.get(
  "/api/reports",
  authenticate,
  authorize("admin", "manager"),
  getReports,
);
```

### Request Logging Middleware

```javascript
function requestLogger(req, res, next) {
  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;
    console.log(
      `${req.method} ${req.originalUrl} ${res.statusCode} ${duration}ms`,
    );
  });

  next();
}

// Output:
// GET /api/users 200 45ms
// POST /api/users 201 120ms
// GET /api/users/999 404 12ms
```

### Validation Middleware

```javascript
function validateBody(schema) {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        error: "Validation failed",
        details: error.details.map((d) => ({
          field: d.path.join("."),
          message: d.message,
        })),
      });
    }
    next();
  };
}

// Usage with Joi:
const createUserSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
});

app.post("/api/users", validateBody(createUserSchema), createUser);
```

### CORS Middleware

```javascript
function corsMiddleware(req, res, next) {
  res.header("Access-Control-Allow-Origin", "https://frontend.com");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }

  next();
}
```

### Rate Limiting Middleware

```javascript
const requestCounts = new Map();

function rateLimiter(maxRequests, windowMs) {
  return (req, res, next) => {
    const key = req.ip;
    const now = Date.now();
    const windowStart = now - windowMs;

    const requests = requestCounts.get(key) || [];
    const recentRequests = requests.filter((t) => t > windowStart);

    if (recentRequests.length >= maxRequests) {
      return res.status(429).json({
        error: "Too many requests",
        retryAfter: Math.ceil(windowMs / 1000),
      });
    }

    recentRequests.push(now);
    requestCounts.set(key, recentRequests);
    next();
  };
}

app.use("/api", rateLimiter(100, 60 * 1000));
```

### Request ID Middleware

```javascript
const { v4: uuidv4 } = require("uuid");

function requestId(req, res, next) {
  req.id = req.headers["x-request-id"] || uuidv4();
  res.setHeader("X-Request-ID", req.id);
  next();
}

// এখন সব log-এ req.id ব্যবহার করো → distributed tracing
```

### Response Time Middleware

```javascript
function responseTime(req, res, next) {
  const start = process.hrtime();

  res.on("finish", () => {
    const [seconds, nanoseconds] = process.hrtime(start);
    const ms = (seconds * 1000 + nanoseconds / 1e6).toFixed(2);
    res.setHeader("X-Response-Time", `${ms}ms`);
  });

  next();
}
```

---

## Middleware Execution Order

Order অত্যন্ত গুরুত্বপূর্ণ! ভুল order-এ লাগালে সমস্যা হয়:

```javascript
// ✅ সঠিক order:
app.use(requestId); // 1. Request ID assign
app.use(requestLogger); // 2. Logging (ID সহ)
app.use(helmet()); // 3. Security headers
app.use(cors()); // 4. CORS (preflight handle)
app.use(compression()); // 5. Response compression
app.use(express.json()); // 6. Body parse
app.use(rateLimiter); // 7. Rate limit check
app.use("/api", authenticate); // 8. Auth check
// ... routes ...
app.use(errorHandler); // 9. Error handler (সবার শেষে!)
```

```
❌ ভুল order:
app.use(authenticate);     // Body parse-এর আগে auth?
app.use(express.json());   // Token body-তে থাকলে আগে parse দরকার!

❌ ভুল order:
app.use(errorHandler);     // Error handler আগে?
app.use('/api', routes);   // Route পরে? — error handler কাজ করবে না!
```

---

## Middleware অন্যান্য Framework-এ

### Django (Python)

```python
# Django middleware class
class RequestLoggingMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        start = time.time()
        response = self.get_response(request)
        duration = time.time() - start
        print(f"{request.method} {request.path} {response.status_code} {duration:.2f}s")
        return response

# settings.py
MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'myapp.middleware.RequestLoggingMiddleware',  # custom
]
```

### FastAPI (Python)

```python
from fastapi import FastAPI, Request
from starlette.middleware.base import BaseHTTPMiddleware
import time

class TimingMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        start = time.time()
        response = await call_next(request)
        duration = time.time() - start
        response.headers["X-Response-Time"] = f"{duration:.4f}s"
        return response

app = FastAPI()
app.add_middleware(TimingMiddleware)
```

### NestJS (TypeScript)

```typescript
@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const start = Date.now();
    res.on("finish", () => {
      console.log(
        `${req.method} ${req.url} ${res.statusCode} ${Date.now() - start}ms`,
      );
    });
    next();
  }
}
```

---

## সংক্ষেপে মনে রাখার সূত্র

```
Middleware = Request আর Response-এর মাঝখানের function

3 options:
  next()          → পরবর্তী middleware-এ যাও
  res.send()      → response দিয়ে দাও (chain শেষ)
  next(error)     → error handler-এ যাও

Common middleware order:
1. Request ID
2. Logging
3. Security (helmet)
4. CORS
5. Compression
6. Body Parser
7. Rate Limiting
8. Authentication
9. Routes
10. Error Handler (সবার শেষে!)

Types:
Application-level → app.use()
Router-level     → router.use()
Route-specific   → app.get('/path', middleware, handler)
Error-handling   → (err, req, res, next)
Third-party      → npm packages
```

---

## Interview Golden Lines

> **Middleware is a function that sits between the request and the response — it can process, modify, or block the request.**

> **next() passes control to the next middleware. Without it, the request hangs forever.**

> **Error-handling middleware has 4 parameters (err, req, res, next) — that's how Express distinguishes it.**

> **Middleware order matters — body parser must come before route handlers, error handler must come last.**

> **Authentication as middleware follows the DRY principle — write once, protect every route.**
