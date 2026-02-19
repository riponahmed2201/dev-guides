# API Design (এপিআই ডিজাইন)

## API কী?

**API (Application Programming Interface)** হলো দুটো software-এর মধ্যে **কথা বলার নিয়ম**। একটা application অন্য একটা application-এর সাথে data আদান-প্রদান করে API-এর মাধ্যমে।

```
তুমি (Frontend)  ──── API ────►  Server (Backend)
                  ◄── Data ─────

Mobile App       ──── API ────►  Server
                  ◄── Data ─────

অন্য Service    ──── API ────►  Server
                  ◄── Data ─────
```

**বাস্তব উদাহরণ:**

রেস্তোরাঁয় তুমি (client) সরাসরি রান্নাঘরে (server) যাও না। **Waiter (API)** তোমার order নিয়ে রান্নাঘরে যায়, খাবার এনে দেয়।

```
Customer (Client)  →  Waiter (API)  →  Kitchen (Server)
                   ←  Food (Response) ←
```

---

## API-র প্রকারভেদ

| Type | কীভাবে কাজ করে | ব্যবহার |
|------|----------------|---------|
| **REST** | HTTP methods + URL | সবচেয়ে বেশি ব্যবহৃত (৯০%+ API) |
| **GraphQL** | Single endpoint + query | Facebook তৈরি করেছে, flexible data fetch |
| **gRPC** | Protocol Buffers + HTTP/2 | Microservices, high performance |
| **SOAP** | XML-based | Legacy/enterprise system |
| **WebSocket** | Persistent connection | Real-time (chat, live data) |
| **Webhook** | Server → Client push | Event notification |

---

## REST API কী?

**REST (Representational State Transfer)** হলো API design-এর সবচেয়ে popular architectural style। Roy Fielding ২০০০ সালে তাঁর PhD dissertation-এ এটি প্রস্তাব করেন।

REST কোনো protocol না — এটি একটি **design principle**।

### REST-এর ৬টি মূলনীতি

#### 1. Client-Server Separation

Client (frontend) আর Server (backend) সম্পূর্ণ আলাদা। একে অপরের internal বিষয় জানে না।

```
Frontend (React/Vue)  ←→  Backend (Django/Express)

Frontend শুধু জানে: API URL কী, কোন data পাঠাতে হবে
Backend শুধু জানে: Request process করে response দিতে হবে
```

> সুবিধা: Frontend ও Backend আলাদাভাবে develop, deploy, scale করা যায়।

#### 2. Stateless

Server **কোনো client-এর state/session মনে রাখে না**। প্রতিটি request-এ client-কে সব তথ্য পাঠাতে হয়।

```
❌ Stateful:
Request 1: Login করলাম → Server মনে রাখলো "Ripon logged in"
Request 2: GET /profile → Server জানে Ripon, data দিলো

✅ Stateless:
Request 1: Login → Server token দিলো
Request 2: GET /profile + Authorization: Bearer token123
           → Server token check করে data দিলো
           (প্রতিটি request-এ token পাঠাতে হয়)
```

> সুবিধা: Server scale করা সহজ — যেকোনো server instance request handle করতে পারে।

#### 3. Cacheable

Response **cache করা যাবে** কিনা server বলে দেবে। Cache হলে performance বাড়ে।

```http
HTTP/1.1 200 OK
Cache-Control: public, max-age=3600
ETag: "v5"
```

#### 4. Uniform Interface

সব resource-এর জন্য **একই নিয়ম** — URL structure, HTTP methods, response format একই pattern follow করে।

```
GET    /api/users      → সব user
GET    /api/users/42   → user 42
POST   /api/users      → নতুন user
PUT    /api/users/42   → user 42 update
DELETE /api/users/42   → user 42 delete

GET    /api/posts      → সব post
GET    /api/posts/5    → post 5
POST   /api/posts      → নতুন post
...একই pattern!
```

#### 5. Layered System

Client জানে না request সরাসরি server-এ যাচ্ছে নাকি load balancer, cache, proxy দিয়ে যাচ্ছে।

```
Client → CDN → Load Balancer → API Gateway → Server → Database
         ↑        ↑               ↑
    Client এগুলোর কিছুই জানে না
```

#### 6. Code on Demand (Optional)

Server client-কে executable code (JavaScript) পাঠাতে পারে। এটি optional।

---

## RESTful URL Design — সবচেয়ে গুরুত্বপূর্ণ বিষয়

ভালো URL design হলো ভালো API design-এর ভিত্তি।

### Resource-Oriented URL

URL-এ **noun (বিশেষ্য)** ব্যবহার করো, verb (ক্রিয়া) না:

```
✅ ভালো (Noun):
GET    /api/users
POST   /api/users
GET    /api/users/42
DELETE /api/users/42

❌ খারাপ (Verb):
GET    /api/getUsers
POST   /api/createUser
GET    /api/getUserById/42
POST   /api/deleteUser/42
```

> HTTP method-ই verb — URL-এ আবার verb লাগানোর দরকার নেই।

### Plural Nouns ব্যবহার করো

```
✅ /api/users       (plural)
✅ /api/products
✅ /api/orders

❌ /api/user        (singular)
❌ /api/product
```

### Nested Resources (সম্পর্কযুক্ত resource)

```
GET    /api/users/42/posts          → user 42 এর সব post
GET    /api/users/42/posts/5        → user 42 এর post 5
POST   /api/users/42/posts          → user 42 এর নতুন post
GET    /api/posts/5/comments         → post 5 এর সব comment
POST   /api/posts/5/comments         → post 5 এ নতুন comment
```

> **নিয়ম:** Maximum ২-৩ level nesting। এর বেশি হলে আলাদা endpoint ব্যবহার করো।

```
✅ /api/users/42/posts
✅ /api/posts/5/comments

❌ /api/users/42/posts/5/comments/3/replies    ← অনেক বেশি nested!
✅ /api/comments/3/replies                      ← এভাবে ভাঙো
```

### Filtering, Sorting, Pagination — Query Parameters ব্যবহার করো

```http
GET /api/users?role=admin                      → filter by role
GET /api/users?status=active&role=admin        → multiple filters
GET /api/products?sort=price                   → sort by price (ascending)
GET /api/products?sort=-price                  → sort by price (descending)
GET /api/products?sort=price,-created_at       → multiple sort
GET /api/users?page=2&limit=20                 → pagination
GET /api/users?fields=id,name,email            → specific fields only
GET /api/products?q=laptop                     → search
GET /api/orders?start_date=2026-01-01&end_date=2026-02-18  → date range
```

### Versioning

API-তে breaking change আসলে পুরনো client ভেঙে যায়। Versioning করলে পুরনো ও নতুন দুটোই চলে।

```
URL versioning (সবচেয়ে common):
GET /api/v1/users
GET /api/v2/users

Header versioning:
GET /api/users
Accept: application/vnd.myapi.v2+json

Query parameter:
GET /api/users?version=2
```

---

## API Response Design

### Consistent Response Format

সব endpoint-এ **একই format** follow করো:

**Success response:**

```json
{
  "status": "success",
  "data": {
    "id": 42,
    "name": "Ripon",
    "email": "ripon@example.com"
  }
}
```

**List response (with pagination):**

```json
{
  "status": "success",
  "data": [
    { "id": 1, "name": "Ripon" },
    { "id": 2, "name": "Karim" }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "total_pages": 8
  }
}
```

**Error response:**

```json
{
  "status": "error",
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": [
      { "field": "email", "message": "Invalid email format" },
      { "field": "name", "message": "Name is required" }
    ]
  }
}
```

### সঠিক Status Code ব্যবহার করো

```
POST   /api/users   → 201 Created (200 না!)
DELETE /api/users/42 → 204 No Content (200 না!)
GET    /api/users/99 → 404 Not Found (200 + error message না!)

❌ খারাপ practice:
সবকিছুতে 200 OK দিয়ে body-তে error বলা:
{ "status": 200, "error": "User not found" }

✅ ভালো practice:
404 Not Found
{ "status": "error", "error": { "message": "User not found" } }
```

### JSON Naming Convention

```json
✅ snake_case (Python/Ruby ecosystem):
{
  "first_name": "Ripon",
  "created_at": "2026-02-18",
  "is_active": true
}

✅ camelCase (JavaScript/Java ecosystem):
{
  "firstName": "Ripon",
  "createdAt": "2026-02-18",
  "isActive": true
}
```

> যেকোনো একটা বেছে নাও — কিন্তু **পুরো API-তে consistent** রাখো।

---

## API Authentication Methods

### 1. API Key

সবচেয়ে সহজ। Server একটি unique key দেয়।

```http
GET /api/data HTTP/1.1
X-API-Key: sk-abc123def456
```

```
সুবিধা: Simple, দ্রুত implement
অসুবিধা: Key leak হলে বিপদ, user-level permission কঠিন
ব্যবহার: Third-party API, public API, server-to-server
```

### 2. JWT (JSON Web Token)

Login করলে server একটি signed token দেয়। প্রতিটি request-এ token পাঠাতে হয়।

```http
POST /api/login
{ "email": "ripon@example.com", "password": "secret" }

→ { "token": "eyJhbGciOiJIUzI1NiIs..." }

GET /api/profile
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

```
JWT structure:
header.payload.signature

eyJhbGciOiJIUzI1NiIs.eyJ1c2VyX2lkIjo0Mn0.abc123
       ↑                      ↑                ↑
   Algorithm           User data (id:42)   Signature
```

```
সুবিধা: Stateless, scalable, mobile-friendly
অসুবিধা: Token revoke করা কঠিন, size বড়
ব্যবহার: Modern SPA, mobile app, microservices
```

### 3. OAuth 2.0

Third-party login — "Login with Google/GitHub/Facebook"।

```
User → "Login with Google" button click
     → Google login page-এ redirect
     → Google-এ login করে
     → Google তোমার app-কে authorization code দেয়
     → তোমার server code দিয়ে access token নেয়
     → User logged in!
```

```
সুবিধা: User password তোমার কাছে আসে না, trusted login
অসুবিধা: Complex implementation
ব্যবহার: Social login, third-party API access
```

### 4. Session-Based

Login করলে server session তৈরি করে cookie-তে session ID পাঠায়।

```
POST /login → Server session তৈরি → Set-Cookie: session_id=abc123
GET /profile + Cookie: session_id=abc123 → Server session check → data
```

```
সুবিধা: Simple, server control, সহজে revoke
অসুবিধা: Stateful, scale করতে session store (Redis) লাগে
ব্যবহার: Traditional web app, server-rendered pages
```

---

## API Security Best Practices

### 1. HTTPS সবসময় ব্যবহার করো

```
❌ http://api.example.com/users    ← Plain text! data চুরি হতে পারে
✅ https://api.example.com/users   ← Encrypted! নিরাপদ
```

### 2. Rate Limiting

```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 23

429 Too Many Requests → "ভাই, একটু ধীরে!"
```

### 3. Input Validation

```
Client যা পাঠায় তা কখনো সরাসরি trust করো না:

POST /api/users
{ "name": "<script>alert('hacked')</script>", "age": "not-a-number" }

→ Validate করো: name sanitize, age must be integer
```

### 4. Pagination বাধ্যতামূলক

```
❌ GET /api/users → ১ মিলিয়ন user ফেরত! Server crash
✅ GET /api/users?page=1&limit=20 → শুধু ২০টা
```

### 5. Sensitive Data Response-এ দিও না

```json
❌ { "id": 1, "name": "Ripon", "password": "$2b$10$abc...", "ssn": "123-45-6789" }
✅ { "id": 1, "name": "Ripon", "email": "ripon@example.com" }
```

---

## REST API Design Checklist

```
✅ URL-এ noun ব্যবহার (verb নয়)
✅ Plural nouns (/users, /posts)
✅ সঠিক HTTP methods (GET, POST, PUT, PATCH, DELETE)
✅ সঠিক Status Codes (201, 204, 400, 401, 404)
✅ Consistent response format
✅ Pagination (page, limit)
✅ Filtering ও Sorting (query params)
✅ API Versioning (/api/v1/)
✅ HTTPS only
✅ Authentication (JWT/OAuth)
✅ Rate Limiting
✅ Input Validation
✅ Error handling with meaningful messages
✅ CORS configuration
✅ API documentation
```

---

## REST vs GraphQL vs gRPC — তুলনা

| বৈশিষ্ট্য | REST | GraphQL | gRPC |
|---|---|---|---|
| Protocol | HTTP | HTTP | HTTP/2 |
| Data Format | JSON | JSON | Protocol Buffers |
| Endpoint | Multiple URL | Single URL | Service methods |
| Over-fetching | ✅ সমস্যা | ❌ সমাধান | ❌ সমাধান |
| Under-fetching | ✅ সমস্যা | ❌ সমাধান | ❌ সমাধান |
| Learning Curve | সহজ | মাঝারি | কঠিন |
| Caching | সহজ (HTTP cache) | কঠিন | কঠিন |
| Real-time | ❌ (WebSocket আলাদা) | ✅ Subscriptions | ✅ Streaming |
| ব্যবহার | General purpose | Flexible data needs | Microservices |
| যারা ব্যবহার করে | Almost everyone | Facebook, GitHub | Google, Netflix |

### Over-fetching ও Under-fetching কী?

```
Over-fetching (বেশি data আসে):
GET /api/users/42
→ { id, name, email, phone, address, bio, avatar, created_at, ... }
  শুধু name আর email দরকার ছিল, কিন্তু সব এসে গেল!

Under-fetching (কম data আসে, multiple request লাগে):
GET /api/users/42        → user info
GET /api/users/42/posts  → user-এর posts
GET /api/posts/5/comments → post-এর comments
  একটা page দেখাতে ৩টা API call!

GraphQL solution:
POST /graphql
{
  user(id: 42) {
    name
    email
    posts {
      title
      comments { text }
    }
  }
}
→ একটা request-এ শুধু যা দরকার তা-ই আসে!
```

---

## সংক্ষেপে মনে রাখার সূত্র

```
REST = Resource + HTTP Methods + Status Codes

URL    → কোন resource (noun)
Method → কী করতে চাই (verb)
Status → কী হলো (result)
Body   → data (JSON)
```

```
ভালো API = Consistent + Predictable + Well-documented

/api/v1/users          GET    → List
/api/v1/users          POST   → Create
/api/v1/users/:id      GET    → Read
/api/v1/users/:id      PATCH  → Update
/api/v1/users/:id      DELETE → Delete
```

---

## Interview Golden Lines

> **REST is not a protocol — it's an architectural style built on top of HTTP.**

> **Good API URLs use nouns, not verbs. HTTP methods are the verbs.**

> **Stateless means every request must carry all the information the server needs.**

> **Over-fetching is REST's weakness, and it's GraphQL's strength.**

> **API versioning protects existing clients from breaking changes.**
