# Input Validation (ইনপুট ভ্যালিডেশন)

## Input Validation কী?

**Input Validation** হলো user-এর পাঠানো data **গ্রহণ করার আগে** যাচাই করা — data সঠিক format-এ আছে কিনা, নিরাপদ কিনা, business rule মানছে কিনা।

```
User Input → Validation → ✅ Valid → Process → Database
                        → ❌ Invalid → Error Response (details সহ)
```

> **Golden Rule: Never trust user input.** User হোক বা API consumer — বাইরে থেকে আসা যেকোনো data potentially dangerous বা ভুল।

---

## কেন Validation দরকার?

### Validation ছাড়া কী হতে পারে?

```javascript
// ❌ No validation
app.post("/api/users", async (req, res) => {
  const user = await User.create(req.body); // যা আসবে তাই save!
  res.json(user);
});
```

```
সমস্যা ১ — Invalid Data:
  { email: "not-an-email", age: -5, name: "" }
  → Database-এ garbage data ঢুকে যাবে

সমস্যা ২ — Security Attack:
  { email: "admin@test.com", role: "admin" }
  → User নিজেকে admin বানিয়ে দিলো!

সমস্যা ৩ — SQL Injection:
  { name: "'; DROP TABLE users; --" }
  → পুরো table delete!

সমস্যা ৪ — Server Crash:
  { data: "a".repeat(100000000) }
  → Memory overflow → Server crash
```

### Validation থাকলে

```javascript
// ✅ With validation
app.post("/api/users", validate(createUserSchema), async (req, res) => {
  const user = await User.create(req.body);
  res.json(user);
});

// ভুল input পাঠালে:
// 400 Bad Request
// {
//   "error": {
//     "code": "VALIDATION_ERROR",
//     "details": [
//       { "field": "email", "message": "Must be a valid email" },
//       { "field": "age", "message": "Must be at least 0" }
//     ]
//   }
// }
```

---

## Validation কোথায় করবে?

```
Layer                কী Check করবে
────────────────────────────────────────────────────────
Client-side          UX improvement (instant feedback)
                     ⚠️ Bypass করা যায় — trust করো না!

API Layer            Input format, type, required fields
(Controller)         → এখানেই মূল validation

Service Layer        Business rules, cross-field logic
(Business Logic)     → "User 3টার বেশি order দিতে পারবে না"

Database Layer       Constraints, unique, not null
(Schema)             → Last line of defense
```

```
❌ শুধু Client-side validation = NO validation
   (DevTools দিয়ে bypass করা যায়)

✅ Server-side validation = MUST
   Client-side validation = UX bonus (optional)
```

---

## Validation-এর ধরন

### 1. Type Validation

```javascript
// Data সঠিক type-এ আছে কিনা
typeof name === "string"; // String check
typeof age === "number"; // Number check
Array.isArray(tags); // Array check
typeof isActive === "boolean"; // Boolean check
```

### 2. Format Validation

```javascript
// নির্দিষ্ট format মানছে কিনা
/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)   // Email
/^01[3-9]\d{8}$/.test(phone)                // BD phone
/^\d{4}-\d{2}-\d{2}$/.test(date)            // Date (YYYY-MM-DD)
/^https?:\/\/.+/.test(url)                   // URL
```

### 3. Range/Length Validation

```javascript
name.length >= 2 && name.length <= 100; // String length
age >= 0 && age <= 150; // Number range
password.length >= 8; // Minimum length
tags.length <= 10; // Array max items
fileSize <= 5 * 1024 * 1024; // Max 5MB
```

### 4. Required/Optional

```javascript
// Required field আছে কিনা
if (!email) throw new Error("Email is required");
if (!password) throw new Error("Password is required");

// Optional field — থাকলে validate, না থাকলে skip
if (phone && !isValidPhone(phone)) {
  throw new Error("Invalid phone number");
}
```

### 5. Business Rule Validation

```javascript
// Application-specific rules
if (startDate >= endDate) throw new Error("Start must be before end");
if (quantity > stock) throw new Error("Not enough stock");
if (user.orders.length >= 3) throw new Error("Max 3 pending orders");
```

### 6. Whitelist Validation

```javascript
// শুধু allowed values accept করো
const ROLES = ["user", "moderator", "admin"];
if (!ROLES.includes(role)) throw new Error("Invalid role");

const SORT_FIELDS = ["name", "email", "createdAt"];
if (!SORT_FIELDS.includes(sortBy)) throw new Error("Invalid sort field");
```

---

## Joi (Node.js Validation Library)

### Installation

```bash
npm install joi
```

### Basic Schema

```javascript
const Joi = require("joi");

const createUserSchema = Joi.object({
  name: Joi.string().min(2).max(100).required().messages({
    "string.min": "নাম কমপক্ষে ২ অক্ষরের হতে হবে",
    "any.required": "নাম আবশ্যক",
  }),

  email: Joi.string().email().required(),

  password: Joi.string()
    .min(8)
    .max(128)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .required()
    .messages({
      "string.pattern.base":
        "Password-এ uppercase, lowercase ও number থাকতে হবে",
    }),

  age: Joi.number().integer().min(13).max(150).optional(),

  role: Joi.string().valid("user", "moderator").default("user"),

  tags: Joi.array().items(Joi.string().max(30)).max(10).optional(),

  address: Joi.object({
    street: Joi.string().required(),
    city: Joi.string().required(),
    zip: Joi.string()
      .pattern(/^\d{4}$/)
      .required(),
  }).optional(),
});
```

### Schema ব্যবহার

```javascript
// Direct validation
const { error, value } = createUserSchema.validate(req.body, {
  abortEarly: false, // সব error একসাথে দেখাও
  stripUnknown: true, // schema-তে নেই এমন field বাদ দাও
});

if (error) {
  const details = error.details.map((d) => ({
    field: d.path.join("."),
    message: d.message,
  }));
  return res.status(400).json({
    status: "error",
    error: { code: "VALIDATION_ERROR", message: "Validation failed", details },
  });
}

// value = validated + sanitized data (unknown fields stripped)
```

### Validation Middleware (Reusable)

```javascript
function validate(schema, source = "body") {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[source], {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const details = error.details.map((d) => ({
        field: d.path.join("."),
        message: d.message,
      }));
      return res.status(400).json({
        status: "error",
        error: {
          code: "VALIDATION_ERROR",
          message: "Validation failed",
          details,
        },
      });
    }

    req[source] = value;
    next();
  };
}

// Usage:
app.post("/api/users", validate(createUserSchema), createUser);
app.get("/api/users", validate(querySchema, "query"), getUsers);
app.put(
  "/api/users/:id",
  validate(paramsSchema, "params"),
  validate(updateUserSchema),
  updateUser,
);
```

### Advanced Joi Features

```javascript
// Conditional Validation
const schema = Joi.object({
  type: Joi.string().valid("personal", "business").required(),

  // type = 'business' হলে companyName required
  companyName: Joi.when("type", {
    is: "business",
    then: Joi.string().required(),
    otherwise: Joi.forbidden(),
  }),

  // passwordConfirm must match password
  password: Joi.string().min(8).required(),
  passwordConfirm: Joi.string()
    .valid(Joi.ref("password"))
    .required()
    .messages({ "any.only": "Passwords must match" }),
});

// Custom Validation
const schema = Joi.object({
  phone: Joi.string()
    .custom((value, helpers) => {
      if (!value.startsWith("01") || value.length !== 11) {
        return helpers.error("any.invalid");
      }
      return value;
    })
    .messages({
      "any.invalid": "Valid Bangladeshi phone number required (01XXXXXXXXX)",
    }),
});

// Rename / Transform
const schema = Joi.object({
  first_name: Joi.string().required(),
  last_name: Joi.string().required(),
})
  .rename("firstName", "first_name")
  .rename("lastName", "last_name");
```

---

## Zod (TypeScript-First Validation)

TypeScript project-এ Zod বেশি popular — **schema থেকে type auto-generate** হয়:

### Installation

```bash
npm install zod
```

### Basic Schema

```typescript
import { z } from "zod";

const createUserSchema = z.object({
  name: z.string().min(2, "নাম কমপক্ষে ২ অক্ষরের হতে হবে").max(100),

  email: z.string().email("Valid email দিন"),

  password: z
    .string()
    .min(8, "Password কমপক্ষে ৮ অক্ষরের হতে হবে")
    .regex(/[A-Z]/, "কমপক্ষে একটি uppercase letter")
    .regex(/[0-9]/, "কমপক্ষে একটি number"),

  age: z.number().int().min(13).max(150).optional(),

  role: z.enum(["user", "moderator"]).default("user"),

  tags: z.array(z.string().max(30)).max(10).optional(),

  address: z
    .object({
      street: z.string(),
      city: z.string(),
      zip: z.string().regex(/^\d{4}$/),
    })
    .optional(),
});

// Schema থেকে Type auto-generate!
type CreateUserInput = z.infer<typeof createUserSchema>;
// {
//   name: string;
//   email: string;
//   password: string;
//   age?: number;
//   role: 'user' | 'moderator';
//   tags?: string[];
//   address?: { street: string; city: string; zip: string };
// }
```

### Zod Validation

```typescript
// Parse (throws on error)
try {
  const data = createUserSchema.parse(req.body);
} catch (error) {
  if (error instanceof z.ZodError) {
    const details = error.errors.map((e) => ({
      field: e.path.join("."),
      message: e.message,
    }));
    return res.status(400).json({
      status: "error",
      error: { code: "VALIDATION_ERROR", details },
    });
  }
}

// SafeParse (doesn't throw)
const result = createUserSchema.safeParse(req.body);

if (!result.success) {
  const details = result.error.errors.map((e) => ({
    field: e.path.join("."),
    message: e.message,
  }));
  return res.status(400).json({
    status: "error",
    error: { code: "VALIDATION_ERROR", details },
  });
}

const validData = result.data; // TypeScript type-safe!
```

### Zod Middleware

```typescript
function validate(schema: z.ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        status: "error",
        error: {
          code: "VALIDATION_ERROR",
          message: "Validation failed",
          details: result.error.errors.map((e) => ({
            field: e.path.join("."),
            message: e.message,
          })),
        },
      });
    }

    req.body = result.data;
    next();
  };
}

app.post("/api/users", validate(createUserSchema), createUser);
```

### Advanced Zod Features

```typescript
// Transform
const schema = z.string().transform((val) => val.trim().toLowerCase());
schema.parse("  HELLO  "); // "hello"

// Refine (custom validation)
const passwordSchema = z
  .object({
    password: z.string().min(8),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords must match",
    path: ["confirmPassword"],
  });

// Union (or)
const idSchema = z.union([z.string().uuid(), z.number().int().positive()]);

// Discriminated Union
const eventSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("click"), x: z.number(), y: z.number() }),
  z.object({ type: z.literal("scroll"), offset: z.number() }),
  z.object({ type: z.literal("keypress"), key: z.string() }),
]);

// Partial (সব field optional)
const updateUserSchema = createUserSchema.partial();

// Pick / Omit
const loginSchema = createUserSchema.pick({ email: true, password: true });
const publicUserSchema = createUserSchema.omit({ password: true });
```

---

## Joi vs Zod Comparison

```
Feature              Joi                    Zod
────────────────────────────────────────────────────────
Language             JavaScript             TypeScript-first
Type Inference       ❌ Manual              ✅ Auto (z.infer)
Bundle Size          ~150KB                 ~50KB
Custom Messages      ✅ .messages()          ✅ Inline string
Conditional          ✅ .when()              ✅ .refine()
Transform            ❌ Limited              ✅ .transform()
Ecosystem            Express/Hapi           tRPC, Next.js, React Hook Form
Best For             JS projects            TS projects
```

---

## Python — Pydantic

Python-এ সবচেয়ে popular validation library। FastAPI-এর সাথে built-in:

```python
from pydantic import BaseModel, EmailStr, Field, validator
from typing import Optional
from enum import Enum

class Role(str, Enum):
    user = "user"
    moderator = "moderator"
    admin = "admin"

class CreateUserRequest(BaseModel):
    name: str = Field(min_length=2, max_length=100)
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)
    age: Optional[int] = Field(None, ge=13, le=150)
    role: Role = Role.user
    tags: Optional[list[str]] = Field(None, max_length=10)

    @validator('password')
    def password_strength(cls, v):
        if not any(c.isupper() for c in v):
            raise ValueError('Must contain uppercase letter')
        if not any(c.isdigit() for c in v):
            raise ValueError('Must contain a digit')
        return v

    @validator('name')
    def name_must_not_be_empty(cls, v):
        if not v.strip():
            raise ValueError('Name cannot be empty')
        return v.strip()

    class Config:
        extra = "forbid"  # unknown fields reject করো
```

### FastAPI-তে ব্যবহার

```python
from fastapi import FastAPI, HTTPException

app = FastAPI()

@app.post("/api/users")
async def create_user(user: CreateUserRequest):
    # FastAPI automatically validate করে!
    # ভুল data আসলে 422 Unprocessable Entity return করে
    return {"message": "User created", "data": user.dict()}
```

```json
// ভুল input-এ FastAPI auto response:
{
  "detail": [
    {
      "loc": ["body", "email"],
      "msg": "value is not a valid email address",
      "type": "value_error.email"
    },
    {
      "loc": ["body", "password"],
      "msg": "Must contain uppercase letter",
      "type": "value_error"
    }
  ]
}
```

---

## Input Sanitization

Validation = data format ঠিক আছে কিনা check।
**Sanitization** = data **clean করা** — dangerous parts বাদ দেওয়া।

```
Validation → "এই data কি acceptable?"
Sanitization → "এই data-কে safe বানাও"

দুটোই দরকার — আগে validate, তারপর sanitize।
```

### Common Sanitization

```javascript
// Trim whitespace
const name = input.name.trim();

// Lowercase email
const email = input.email.toLowerCase().trim();

// Remove HTML tags (XSS prevention)
const sanitizeHtml = require("sanitize-html");
const cleanContent = sanitizeHtml(input.content, {
  allowedTags: ["b", "i", "em", "strong", "p", "br"],
  allowedAttributes: {},
});

// Escape special characters
const escapeHtml = require("escape-html");
const safeString = escapeHtml(input.comment);
// "<script>alert('xss')</script>"
// → "&lt;script&gt;alert(&#39;xss&#39;)&lt;/script&gt;"
```

### SQL Injection Prevention

```javascript
// ❌ String concatenation — SQL Injection vulnerable!
const query = `SELECT * FROM users WHERE email = '${email}'`;
// Input: email = "' OR 1=1 --"
// Query becomes: SELECT * FROM users WHERE email = '' OR 1=1 --'
// → সব users return!

// ✅ Parameterized Queries
const result = await db.query("SELECT * FROM users WHERE email = $1", [email]);

// ✅ ORM ব্যবহার করো (Prisma, Sequelize, Mongoose)
const user = await User.findOne({ where: { email } });
```

### NoSQL Injection Prevention

```javascript
// ❌ Vulnerable — user object পাঠাতে পারে
app.post("/login", async (req, res) => {
  const user = await User.findOne({
    email: req.body.email,
    password: req.body.password,
  });
});
// Input: { "password": { "$gt": "" } }
// → Password check bypass!

// ✅ Type check + sanitize
app.post("/login", async (req, res) => {
  if (
    typeof req.body.email !== "string" ||
    typeof req.body.password !== "string"
  ) {
    return res.status(400).json({ error: "Invalid input type" });
  }

  const user = await User.findOne({ email: req.body.email });
  const isMatch = await bcrypt.compare(req.body.password, user.password);
});
```

### express-validator

```bash
npm install express-validator
```

```javascript
const { body, param, query, validationResult } = require("express-validator");

app.post(
  "/api/users",
  [
    body("name")
      .trim()
      .notEmpty()
      .withMessage("Name is required")
      .isLength({ min: 2, max: 100 }),
    body("email")
      .isEmail()
      .withMessage("Valid email required")
      .normalizeEmail(),
    body("password")
      .isLength({ min: 8 })
      .matches(/[A-Z]/)
      .withMessage("Must contain uppercase")
      .matches(/[0-9]/)
      .withMessage("Must contain number"),
    body("age").optional().isInt({ min: 13, max: 150 }),
    body("role").optional().isIn(["user", "moderator"]),
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: "error",
        error: {
          code: "VALIDATION_ERROR",
          details: errors.array().map((e) => ({
            field: e.path,
            message: e.msg,
          })),
        },
      });
    }
    next();
  },
  createUser,
);
```

---

## Validation Strategy — কোথায় কী Validate করবে?

### Request Params

```javascript
const paramsSchema = Joi.object({
  id: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required(),
  // MongoDB ObjectId format
});

app.get("/api/users/:id", validate(paramsSchema, "params"), getUser);
```

### Query Parameters

```javascript
const querySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20),
  sort: Joi.string().valid("name", "email", "createdAt").default("createdAt"),
  order: Joi.string().valid("asc", "desc").default("desc"),
  search: Joi.string().max(200).optional(),
});

app.get("/api/users", validate(querySchema, "query"), getUsers);
```

### Request Body

```javascript
const createUserSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).required(),
  email: Joi.string().email().lowercase().required(),
  password: Joi.string().min(8).max(128).required(),
});

const updateUserSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100),
  email: Joi.string().email().lowercase(),
  age: Joi.number().integer().min(13).max(150),
}).min(1); // কমপক্ষে একটা field থাকতে হবে

app.post("/api/users", validate(createUserSchema), createUser);
app.patch("/api/users/:id", validate(updateUserSchema), updateUser);
```

### Headers

```javascript
const headerSchema = Joi.object({
  authorization: Joi.string()
    .pattern(/^Bearer .+/)
    .required(),
  "content-type": Joi.string().valid("application/json").required(),
}).unknown(true); // অন্যান্য headers allow করো
```

### File Uploads

```javascript
function validateFile(req, res, next) {
  const file = req.file;

  if (!file) {
    return res.status(400).json({ error: "File is required" });
  }

  const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
  if (!allowedTypes.includes(file.mimetype)) {
    return res.status(400).json({ error: "Only JPEG, PNG, WebP allowed" });
  }

  const maxSize = 5 * 1024 * 1024; // 5MB
  if (file.size > maxSize) {
    return res.status(400).json({ error: "File size must be under 5MB" });
  }

  next();
}
```

---

## Validation Error Response — Best Practices

```javascript
// ✅ Good — specific field-level errors
{
    "status": "error",
    "error": {
        "code": "VALIDATION_ERROR",
        "message": "Validation failed",
        "details": [
            { "field": "email", "message": "Must be a valid email address" },
            { "field": "password", "message": "Must be at least 8 characters" },
            { "field": "age", "message": "Must be between 13 and 150" }
        ]
    }
}

// ❌ Bad — vague error
{ "error": "Bad request" }

// ❌ Bad — only first error (abortEarly: true)
{ "error": "Email is invalid" }
// User fix করে আবার submit → নতুন error → frustrating!
```

```
Best Practices:
✅ সব error একসাথে দেখাও (abortEarly: false)
✅ প্রতিটি field-এর error আলাদা
✅ Human-readable message
✅ Machine-readable field name
✅ 400 status code (client error)
```

---

## সংক্ষেপে মনে রাখার সূত্র

```
Input Validation = বাইরে থেকে আসা data যাচাই
Input Sanitization = data safe/clean করা
দুটোই দরকার!

Never Trust User Input — NEVER.

Validation Layers:
  Client-side  → UX only, bypass করা যায়
  API Layer    → MUST (Joi/Zod/Pydantic)
  Service      → Business rules
  Database     → Constraints (last defense)

Validation Types:
  Type     → string, number, boolean
  Format   → email, phone, date
  Range    → min, max, length
  Required → present or not
  Business → custom rules
  Whitelist → allowed values only

Popular Libraries:
  JavaScript → Joi, express-validator
  TypeScript → Zod (auto type inference!)
  Python     → Pydantic (FastAPI built-in)

Sanitization:
  trim(), lowercase(), escape HTML
  Parameterized queries (SQL Injection prevention)
  Type checking (NoSQL Injection prevention)

Error Response:
  400 status code
  abortEarly: false → সব error একসাথে
  field + message per error
```

---

## Interview Golden Lines

> **Never trust user input — always validate on the server side. Client-side validation is for UX, not security.**

> **Validation checks if data is correct; Sanitization makes data safe. Both are required.**

> **Zod provides TypeScript type inference from schemas — one source of truth for validation and types.**

> **Always use parameterized queries to prevent SQL injection — never concatenate user input into queries.**

> **Return all validation errors at once (abortEarly: false) with field-level details for a good API consumer experience.**
