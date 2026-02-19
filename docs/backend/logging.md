# Logging (লগিং)

## Logging কী?

**Logging** হলো application-এর ভেতরে কী ঘটছে সেটা **record** করে রাখা — কে কখন কোন request পাঠালো, কোন function কত সময় নিলো, কোথায় error হলো — সব documented থাকে।

```
Logging ছাড়া:
  "Server down ছিল রাতে, কী হয়েছিল কে জানে" 🤷

Logging সহ:
  [2026-02-18 03:14:22] ERROR  Database connection refused at 03:14
  [2026-02-18 03:14:22] ERROR  Retry 1/3 failed
  [2026-02-18 03:14:25] ERROR  Retry 2/3 failed
  [2026-02-18 03:14:28] INFO   Retry 3/3 succeeded — DB reconnected
  → ঠিক কী হয়েছিল, কখন হয়েছিল, কীভাবে recover হলো — সব জানা!
```

> **বাস্তব উদাহরণ:** Hospital-এ patient-এর সব medical history record রাখা হয়। কোনো সমস্যা হলে doctor record দেখে বুঝতে পারে কী হয়েছে। Logging হলো তোমার application-এর medical record।

---

## Logging কেন দরকার?

| উদ্দেশ্য              | ব্যাখ্যা                                     |
| --------------------- | -------------------------------------------- |
| **Debugging**         | Bug খুঁজে বের করা — কোন request-এ কী ভুল হলো |
| **Monitoring**        | App কেমন চলছে real-time-এ দেখা               |
| **Auditing**          | কে কখন কী করলো (security compliance)         |
| **Performance**       | কোন endpoint slow, কোন query ভারী            |
| **Incident Response** | Production-এ সমস্যা হলে root cause বের করা   |
| **Analytics**         | User behavior, traffic patterns বোঝা         |

```
Development-এ → console.log() দিয়ে কাজ চলে
Production-এ  → Proper logging system must, console.log() চলবে না
```

---

## Log Levels

প্রতিটি log-এর একটা **severity level** থাকে — সব log সমান গুরুত্বপূর্ণ না:

### Standard Log Levels (RFC 5424)

```
Level       কখন ব্যবহার করবে                     Priority
─────────────────────────────────────────────────────────────
FATAL/      App চলতে পারছে না, immediately          ⬆ সবচেয়ে
EMERGENCY   shutdown দরকার                          │ গুরুত্বপূর্ণ
                                                     │
ERROR       কোনো operation fail হয়েছে,              │
            কিন্তু app চলছে                          │
                                                     │
WARN        কিছু একটা ঠিক নেই, কিন্তু               │
            এখনো কাজ করছে                            │
                                                     │
INFO        Normal operation, গুরুত্বপূর্ণ           │
            event record                              │
                                                     │
DEBUG       Detailed তথ্য, development-               │
            এ কাজের                                   │
                                                     │
TRACE       সবচেয়ে detailed, প্রতিটি               ⬇ সবচেয়ে কম
            step-এর তথ্য                              গুরুত্বপূর্ণ
```

### প্রতিটি Level-এর Real Example

```javascript
// FATAL — App আর চলতে পারছে না
logger.fatal("Database connection permanently lost. Shutting down.");

// ERROR — Operation fail, কিন্তু app alive
logger.error("Payment processing failed for order #12345", {
  orderId: "12345",
  error: "Gateway timeout",
  userId: "u_789",
});

// WARN — সমস্যার সম্ভাবনা, এখনো ঠিক আছে
logger.warn("Memory usage at 85%. Threshold is 90%.", {
  memoryUsage: "85%",
  threshold: "90%",
});

// INFO — Normal important event
logger.info("User registered successfully", {
  userId: "u_789",
  email: "ripon@example.com",
});

// DEBUG — Development-এ দরকারি details
logger.debug("Fetching user from database", {
  query: { id: "u_789" },
  collection: "users",
});

// TRACE — অতি-বিস্তারিত
logger.trace("Entering validateEmail function", {
  input: "ripon@example.com",
});
```

### কোন Environment-এ কোন Level?

```
Production:   INFO + WARN + ERROR + FATAL
              (DEBUG/TRACE বন্ধ — performance-এ impact পড়ে)

Staging:      DEBUG + INFO + WARN + ERROR + FATAL
              (Bug ধরতে DEBUG চালু)

Development:  সব Level চালু (TRACE সহ)
```

---

## console.log() কেন Production-এ যথেষ্ট না?

```javascript
// ❌ console.log — কী সমস্যা?
console.log("User created");
console.log("Error:", error);
console.log("Request received");

// সমস্যা:
// 1. কোনো timestamp নেই — কখন হলো জানা যায় না
// 2. কোনো level নেই — error আর info একসাথে মিশে যায়
// 3. কোনো context নেই — কোন user, কোন request?
// 4. কোনো structure নেই — parse করা যায় না
// 5. Output শুধু stdout-এ — file/service-এ পাঠানো যায় না
// 6. Performance — sync, blocking I/O
```

```javascript
// ✅ Proper Logger
logger.info("User created", {
  userId: "u_789",
  email: "ripon@example.com",
  requestId: "req_abc123",
  duration: 45,
});

// Output:
// {"level":"info","timestamp":"2026-02-18T10:30:00.000Z",
//  "message":"User created","userId":"u_789",
//  "email":"ripon@example.com","requestId":"req_abc123",
//  "duration":45}
```

```
console.log()         vs        Logger
───────────────────────────────────────────────
No timestamp          →   Auto timestamp
No level              →   Level-based filtering
No structure          →   JSON/structured output
stdout only           →   File, service, multiple destinations
No context            →   requestId, userId, metadata
Sync/blocking         →   Async, buffered
No rotation           →   Auto file rotation
```

---

## Winston (Node.js Logger)

### Installation ও Basic Setup

```bash
npm install winston
```

```javascript
const winston = require("winston");

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || "info",
  format: winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    winston.format.errors({ stack: true }),
    winston.format.json(),
  ),
  defaultMeta: { service: "user-service" },
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
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple(),
      ),
    }),
  );
}

module.exports = logger;
```

### Transports কী?

Transport মানে log কোথায় যাবে:

```javascript
const logger = winston.createLogger({
  transports: [
    // Console-এ দেখাও
    new winston.transports.Console(),

    // File-এ লেখো
    new winston.transports.File({ filename: "app.log" }),

    // Error আলাদা file-এ
    new winston.transports.File({ filename: "error.log", level: "error" }),

    // HTTP endpoint-এ পাঠাও
    new winston.transports.Http({
      host: "log-server.com",
      port: 443,
      path: "/logs",
    }),
  ],
});
```

```
Transport = Log-এর গন্তব্য (destination)

Console  → Terminal-এ দেখায় (dev-এ)
File     → File-এ সেভ করে (persistence)
Http     → Remote server-এ পাঠায় (centralized logging)
Stream   → যেকোনো writable stream
```

### Format Customization

```javascript
const { combine, timestamp, printf, colorize, json, errors } = winston.format;

// Custom format
const devFormat = printf(({ level, message, timestamp, ...meta }) => {
  const metaStr = Object.keys(meta).length ? JSON.stringify(meta) : "";
  return `${timestamp} [${level}]: ${message} ${metaStr}`;
});

// Development: readable format
const devLogger = winston.createLogger({
  format: combine(
    colorize(),
    timestamp({ format: "HH:mm:ss" }),
    errors({ stack: true }),
    devFormat,
  ),
  transports: [new winston.transports.Console()],
});
// Output: 10:30:00 [info]: User created {"userId":"u_789"}

// Production: JSON format (machine-parseable)
const prodLogger = winston.createLogger({
  format: combine(timestamp(), errors({ stack: true }), json()),
  transports: [new winston.transports.File({ filename: "app.log" })],
});
// Output: {"level":"info","message":"User created","userId":"u_789","timestamp":"2026-02-18T10:30:00Z"}
```

---

## Pino (High-Performance Logger)

Winston-এর alternative — **৫x faster**, production-এ বেশি ব্যবহৃত:

### Basic Setup

```bash
npm install pino pino-pretty
```

```javascript
const pino = require("pino");

const logger = pino({
  level: process.env.LOG_LEVEL || "info",
  transport:
    process.env.NODE_ENV !== "production"
      ? { target: "pino-pretty", options: { colorize: true } }
      : undefined,
  base: { service: "user-service" },
  timestamp: pino.stdTimeFunctions.isoTime,
});

module.exports = logger;
```

### Pino ব্যবহার

```javascript
logger.info({ userId: "u_789", email: "ripon@example.com" }, "User registered");

logger.error({ err: error, orderId: "12345" }, "Payment failed");

// Child logger — context inherit করে
const requestLogger = logger.child({ requestId: "req_abc123" });
requestLogger.info("Processing request");
// Output-এ requestId automatically থাকবে
```

### Winston vs Pino

```
Feature              Winston              Pino
──────────────────────────────────────────────────────
Speed                Moderate             5x faster
Format               Built-in formats     JSON only (pipe to pino-pretty)
Transports           Multiple built-in    stdout (pipe to other tools)
Philosophy           Feature-rich         Minimal, fast
Child Logger         ❌                    ✅ Built-in
Serializers          ❌                    ✅ Built-in
Best For             Flexibility          Performance
```

---

## Structured Logging

### Unstructured vs Structured

```
❌ Unstructured:
"User ripon@example.com created at 2026-02-18 with id u_789"

→ Parse করা কঠিন, search করা কঠিন

✅ Structured (JSON):
{
    "level": "info",
    "timestamp": "2026-02-18T10:30:00Z",
    "message": "User created",
    "userId": "u_789",
    "email": "ripon@example.com",
    "duration": 45
}

→ Machine-readable, searchable, filterable
```

### কেন Structured?

```
1. Search:    userId="u_789" দিয়ে একজনের সব log খুঁজো
2. Filter:    level="error" দিয়ে শুধু error দেখো
3. Aggregate: গড় response time বের করো
4. Alert:     error count > 100/min হলে alarm দাও
5. Dashboard: Kibana/Grafana-তে visualize করো
```

---

## Request Logging

### HTTP Request Logger Middleware

```javascript
const logger = require("./logger");

function requestLogger(req, res, next) {
  const start = Date.now();
  const requestId = req.id || req.headers["x-request-id"];

  // Request log
  logger.info(
    {
      type: "request",
      requestId,
      method: req.method,
      url: req.originalUrl,
      ip: req.ip,
      userAgent: req.get("User-Agent"),
      userId: req.user?.id,
    },
    `${req.method} ${req.originalUrl}`,
  );

  // Response log (finish event-এ)
  res.on("finish", () => {
    const duration = Date.now() - start;

    const logData = {
      type: "response",
      requestId,
      method: req.method,
      url: req.originalUrl,
      statusCode: res.statusCode,
      duration,
      contentLength: res.get("Content-Length"),
    };

    if (res.statusCode >= 500) {
      logger.error(
        logData,
        `${req.method} ${req.originalUrl} ${res.statusCode} ${duration}ms`,
      );
    } else if (res.statusCode >= 400) {
      logger.warn(
        logData,
        `${req.method} ${req.originalUrl} ${res.statusCode} ${duration}ms`,
      );
    } else {
      logger.info(
        logData,
        `${req.method} ${req.originalUrl} ${res.statusCode} ${duration}ms`,
      );
    }
  });

  next();
}
```

### Morgan (HTTP Logger for Express)

```bash
npm install morgan
```

```javascript
const morgan = require("morgan");

// Development — readable format
app.use(morgan("dev"));
// Output: GET /api/users 200 45.123 ms - 523

// Production — combined format (Apache-style)
app.use(morgan("combined"));
// Output: ::1 - - [18/Feb/2026:10:30:00 +0000] "GET /api/users HTTP/1.1" 200 523

// Custom format
morgan.token("request-id", (req) => req.id);
app.use(morgan(":request-id :method :url :status :response-time ms"));

// Winston-এর সাথে integrate
const morganStream = {
  write: (message) => logger.info(message.trim()),
};
app.use(morgan("combined", { stream: morganStream }));
```

---

## Correlation ID / Request ID

Distributed system-এ একটা request অনেক service-এ যায়। **Correlation ID** দিয়ে পুরো journey track করা যায়:

```javascript
const { v4: uuidv4 } = require("uuid");

function correlationId(req, res, next) {
  req.id = req.headers["x-request-id"] || uuidv4();
  res.setHeader("X-Request-ID", req.id);
  next();
}

app.use(correlationId);
```

```
Client → API Gateway → User Service → Order Service → Payment Service
         req_abc123    req_abc123      req_abc123       req_abc123

সব service-এর log-এ req_abc123 থাকবে
→ একটা search-এ পুরো request journey দেখতে পাবে
```

### Child Logger with Request Context

```javascript
function requestContext(req, res, next) {
  req.log = logger.child({
    requestId: req.id,
    method: req.method,
    url: req.originalUrl,
    userId: req.user?.id,
  });
  next();
}

// Route handler-এ:
app.get("/api/users/:id", async (req, res) => {
  req.log.info("Fetching user");
  const user = await User.findById(req.params.id);
  req.log.info({ user: user.id }, "User found");
  res.json(user);
});

// Output:
// {"requestId":"req_abc","method":"GET","url":"/api/users/123",
//  "message":"Fetching user","level":"info"}
// {"requestId":"req_abc","method":"GET","url":"/api/users/123",
//  "user":"123","message":"User found","level":"info"}
```

---

## Log Rotation

Log file অনন্তকাল বড় হতে থাকলে disk full হয়ে যাবে। **Log rotation** মানে পুরোনো log auto-archive/delete হওয়া:

### Winston Daily Rotate File

```bash
npm install winston-daily-rotate-file
```

```javascript
const DailyRotateFile = require("winston-daily-rotate-file");

const transport = new DailyRotateFile({
  filename: "logs/app-%DATE%.log",
  datePattern: "YYYY-MM-DD",
  maxSize: "20m", // প্রতি file সর্বোচ্চ 20MB
  maxFiles: "14d", // ১৪ দিনের পুরোনো file delete
  zippedArchive: true, // পুরোনো file compress করো
});

const logger = winston.createLogger({
  transports: [transport],
});
```

```
logs/
├── app-2026-02-18.log     ← আজকের log
├── app-2026-02-17.log.gz  ← গতকালের (compressed)
├── app-2026-02-16.log.gz
├── ...
└── app-2026-02-05.log.gz  ← ১৪ দিনের পুরোনো → auto delete
```

---

## Centralized Logging

Production-এ ১০টা server থাকলে ১০টা server-এ SSH করে log দেখা impractical। **Centralized logging** মানে সব server-এর log এক জায়গায়:

### ELK Stack (Elasticsearch + Logstash + Kibana)

```
App Servers                  ELK Stack
───────────                  ─────────
Server 1 ──┐                ┌──────────────┐
Server 2 ──┼── Logs ──→     │  Logstash    │  (Collect & Parse)
Server 3 ──┤                └──────┬───────┘
Server 4 ──┘                       │
                             ┌─────▼────────┐
                             │ Elasticsearch │  (Store & Index)
                             └──────┬───────┘
                                    │
                             ┌──────▼───────┐
                             │   Kibana     │  (Visualize & Search)
                             └──────────────┘
```

### Loki + Grafana (Lightweight Alternative)

```
ELK = powerful কিন্তু ভারী (resource-hungry)
Loki = lightweight, Grafana-এর সাথে integrate

App → Promtail (agent) → Loki (storage) → Grafana (dashboard)
```

### Cloud Logging Services

```
Service              Provider        বৈশিষ্ট্য
──────────────────────────────────────────────────────
CloudWatch Logs      AWS             AWS integrated
Cloud Logging        Google Cloud    GCP integrated
Azure Monitor        Microsoft       Azure integrated
Datadog              Third-party     APM + Logs
Papertrail           Third-party     Simple, real-time
Loggly               Third-party     Search-focused
```

---

## কী Log করবে, কী করবে না

### ✅ Log করবে

```
✅ Request method, URL, status code, duration
✅ Error messages ও stack traces
✅ Authentication events (login success/failure)
✅ Authorization failures
✅ Business-critical events (payment, order, signup)
✅ External service calls ও responses
✅ Performance metrics (slow queries, high memory)
✅ Application startup/shutdown
✅ Configuration changes
```

### ❌ Log করবে না (NEVER!)

```
❌ Passwords / Secrets / API Keys
❌ Credit card numbers
❌ Full SSN / National ID
❌ Session tokens / JWT tokens
❌ Personal health information
❌ Sensitive personal data (without masking)
```

### Data Masking

```javascript
function maskSensitiveData(data) {
  const masked = { ...data };

  if (masked.password) masked.password = "***REDACTED***";
  if (masked.token) masked.token = "***REDACTED***";
  if (masked.creditCard) {
    masked.creditCard = `****${masked.creditCard.slice(-4)}`;
  }
  if (masked.email) {
    const [name, domain] = masked.email.split("@");
    masked.email = `${name[0]}***@${domain}`;
  }

  return masked;
}

logger.info(
  maskSensitiveData({
    email: "ripon@example.com",
    password: "secret123",
    creditCard: "4111111111111234",
  }),
  "User login attempt",
);

// Output: { email: "r***@example.com", password: "***REDACTED***",
//           creditCard: "****1234" }
```

---

## Python Logging

### Built-in logging Module

```python
import logging

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s [%(levelname)s] %(name)s: %(message)s',
    handlers=[
        logging.FileHandler('app.log'),
        logging.StreamHandler()
    ]
)

logger = logging.getLogger(__name__)

logger.info('User created', extra={'userId': 'u_789'})
logger.error('Payment failed', exc_info=True)
```

### Structlog (Structured Logging for Python)

```bash
pip install structlog
```

```python
import structlog

structlog.configure(
    processors=[
        structlog.processors.TimeStamper(fmt="iso"),
        structlog.processors.JSONRenderer()
    ]
)

logger = structlog.get_logger()

logger.info("user_created", user_id="u_789", email="ripon@example.com")
# {"event": "user_created", "user_id": "u_789",
#  "email": "ripon@example.com", "timestamp": "2026-02-18T10:30:00Z"}

# Bind context
request_logger = logger.bind(request_id="req_abc123")
request_logger.info("processing")
# {"event": "processing", "request_id": "req_abc123", ...}
```

### FastAPI Logging

```python
from fastapi import FastAPI, Request
import structlog
import time

logger = structlog.get_logger()

app = FastAPI()

@app.middleware("http")
async def logging_middleware(request: Request, call_next):
    start = time.time()
    request_id = request.headers.get("X-Request-ID", str(uuid.uuid4()))

    log = logger.bind(
        request_id=request_id,
        method=request.method,
        url=str(request.url)
    )

    log.info("request_started")

    response = await call_next(request)

    duration = round((time.time() - start) * 1000, 2)
    log.info("request_completed",
             status_code=response.status_code,
             duration_ms=duration)

    response.headers["X-Request-ID"] = request_id
    return response
```

---

## Logging Best Practices

### 1. Use Structured Logging

```javascript
// ❌ String concatenation
logger.info(`User ${userId} created order ${orderId} for $${amount}`);

// ✅ Structured
logger.info({ userId, orderId, amount }, "Order created");
```

### 2. Meaningful Messages

```javascript
// ❌ Vague
logger.info("Done");
logger.error("Error occurred");

// ✅ Specific
logger.info("User registration completed");
logger.error({ err, userId }, "Password reset token generation failed");
```

### 3. Right Level, Right Time

```javascript
// ❌ Wrong level
logger.error("User logged in"); // এটা error না, info
logger.info("Database connection lost"); // এটা error!

// ✅ Right level
logger.info("User logged in");
logger.error("Database connection lost");
```

### 4. Don't Over-Log

```javascript
// ❌ Loop-এর ভিতরে log
for (const item of items) {
  logger.debug(`Processing item ${item.id}`); // 10000 items = 10000 logs!
}

// ✅ Summary log
logger.info({ count: items.length }, "Processing items batch");
// ... process ...
logger.info(
  { processed: items.length, failed: 0 },
  "Batch processing complete",
);
```

### 5. Log at Boundaries

```
Request comes in    → Log (method, url, ip)
External API call   → Log (service, url, duration)
Database query      → Log (query type, duration) [slow queries only]
Response sent       → Log (status, duration)
Error caught        → Log (error, stack, context)
```

---

## Monitoring ও Alerting

Log শুধু record করলেই হবে না — **monitor** করতে হবে এবং সমস্যায় **alert** দিতে হবে:

```
Logs → Aggregation → Dashboard → Alerts
       (ELK/Loki)   (Kibana/    (Slack/Email/
                     Grafana)    PagerDuty)
```

### Alert Rules উদাহরণ

```
🔴 CRITICAL: Error rate > 5% in 5 minutes     → PagerDuty (wake up!)
🟠 WARNING:  Response time > 2s average        → Slack notification
🟡 INFO:     New deployment detected           → Slack notification
🔴 CRITICAL: 0 requests in 5 minutes           → PagerDuty (app down?)
🟠 WARNING:  Disk usage > 80%                  → Email notification
```

---

## সংক্ষেপে মনে রাখার সূত্র

```
Logging = Application-এর medical record

Log Levels (priority order):
  FATAL → App dead
  ERROR → Operation failed
  WARN  → Something suspicious
  INFO  → Normal important event
  DEBUG → Detailed dev info
  TRACE → Everything

Production: INFO level minimum
Development: DEBUG/TRACE চালু

console.log() ❌  →  Winston/Pino ✅

Structured Logging:
  JSON format → Machine-readable → Searchable → Alertable

Must Log:
  Request info, errors, auth events, business events, performance

Never Log:
  Passwords, tokens, credit cards, sensitive PII

Correlation ID:
  একটা unique ID সব service-এ pass করো → পুরো request journey track

Centralized Logging:
  ELK Stack / Loki+Grafana / Cloud services
  → সব server-এর log এক জায়গায়

Log Rotation:
  পুরোনো log auto-archive/delete → disk full না হয়
```

---

## Interview Golden Lines

> **Logging is the only way to understand what happened in production — without it, debugging is guessing.**

> **Use structured JSON logging for machine-parseable, searchable, filterable logs.**

> **Log levels exist for filtering — ERROR for failures, WARN for suspicious activity, INFO for normal operations, DEBUG for development.**

> **Never log sensitive data (passwords, tokens, credit cards). Always mask PII.**

> **Correlation IDs tie logs across microservices — one ID tracks the entire request journey.**

> **Centralized logging (ELK/Loki) aggregates logs from all servers into one searchable dashboard.**
