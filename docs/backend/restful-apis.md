# RESTful APIs (বিস্তারিত)

## RESTful API কী?

RESTful API হলো এমন একটি API যা **REST (Representational State Transfer)** নীতিমালা পুরোপুরি follow করে। এটি HTTP protocol-এর উপর ভিত্তি করে resource-কেন্দ্রিক একটি architecture।

```
REST = Resources + HTTP Methods + Representations + Stateless

Resource:        /api/users/42         (কে?)
HTTP Method:     GET                   (কী করতে চাই?)
Representation:  JSON/XML              (কোন format-এ?)
Stateless:       Token প্রতিবার পাঠাও  (কোনো session নেই)
```

> API Design page-এ আমরা REST-এর মূলনীতি শিখেছি। এই page-এ আমরা **practical implementation, advanced patterns, এবং real-world best practices** শিখবো।

---

## Richardson Maturity Model — REST-এর Level

Martin Fowler describe করেছেন — সব API সমানভাবে RESTful না। REST-এর ৪টি level আছে:

```
Level 3: Hypermedia Controls (HATEOAS)   ← পুরোপুরি RESTful
Level 2: HTTP Methods + Status Codes     ← বেশিরভাগ API এখানে
Level 1: Resources (URL-based)
Level 0: Single URL, single method       ← RPC style (REST না)
```

### Level 0 — The Swamp of POX

একটা URL, সব কিছু POST দিয়ে:

```http
POST /api
{ "action": "getUser", "id": 42 }

POST /api
{ "action": "createUser", "name": "Ripon" }

POST /api
{ "action": "deleteUser", "id": 42 }
```

> এটা REST না — এটা RPC (Remote Procedure Call)।

### Level 1 — Resources

আলাদা আলাদা URL আছে, কিন্তু সব POST:

```http
POST /api/users/get     { "id": 42 }
POST /api/users/create  { "name": "Ripon" }
POST /api/users/delete  { "id": 42 }
```

> URL আলাদা হলেও method সব POST — এখনো RESTful না।

### Level 2 — HTTP Methods (বেশিরভাগ API এখানে)

সঠিক URL + সঠিক HTTP method + সঠিক status code:

```http
GET    /api/users      → 200 OK
POST   /api/users      → 201 Created
GET    /api/users/42   → 200 OK
PUT    /api/users/42   → 200 OK
DELETE /api/users/42   → 204 No Content
GET    /api/users/999  → 404 Not Found
```

> বেশিরভাগ production API Level 2 follow করে। এটাই practical standard।

### Level 3 — HATEOAS (পুরোপুরি RESTful)

Response-এ **next possible actions-এর link** থাকে। Client-কে URL hardcode করতে হয় না:

```json
GET /api/users/42

{
  "id": 42,
  "name": "Ripon",
  "email": "ripon@example.com",
  "_links": {
    "self": { "href": "/api/users/42" },
    "posts": { "href": "/api/users/42/posts" },
    "update": { "href": "/api/users/42", "method": "PUT" },
    "delete": { "href": "/api/users/42", "method": "DELETE" }
  }
}
```

```json
GET /api/orders/100

{
  "id": 100,
  "status": "pending",
  "total": 1500,
  "_links": {
    "self": { "href": "/api/orders/100" },
    "cancel": { "href": "/api/orders/100/cancel", "method": "POST" },
    "pay": { "href": "/api/orders/100/pay", "method": "POST" }
  }
}
```

> Order paid হলে "cancel" link থাকবে না — client জানে cancel করা যাবে না।

> বাস্তবে Level 3 কম ব্যবহৃত হয় — complexity বেশি। কিন্তু interview-তে জানা থাকলে ভালো impression পড়ে।

---

## Complete CRUD Example — User API

একটি পূর্ণাঙ্গ RESTful API কেমন হয় দেখা যাক:

### Create — POST /api/users

```http
POST /api/users HTTP/1.1
Content-Type: application/json
Authorization: Bearer eyJhbG...

{
  "name": "Ripon Ahmed",
  "email": "ripon@example.com",
  "role": "developer"
}
```

```http
HTTP/1.1 201 Created
Location: /api/users/42
Content-Type: application/json

{
  "status": "success",
  "data": {
    "id": 42,
    "name": "Ripon Ahmed",
    "email": "ripon@example.com",
    "role": "developer",
    "created_at": "2026-02-18T14:30:00Z",
    "updated_at": "2026-02-18T14:30:00Z"
  }
}
```

### Read (List) — GET /api/users

```http
GET /api/users?page=1&limit=10&role=developer&sort=-created_at HTTP/1.1
Authorization: Bearer eyJhbG...
```

```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "status": "success",
  "data": [
    {
      "id": 42,
      "name": "Ripon Ahmed",
      "email": "ripon@example.com",
      "role": "developer"
    },
    {
      "id": 38,
      "name": "Karim Hasan",
      "email": "karim@example.com",
      "role": "developer"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 47,
    "total_pages": 5,
    "has_next": true,
    "has_prev": false
  }
}
```

### Read (Single) — GET /api/users/:id

```http
GET /api/users/42 HTTP/1.1
Authorization: Bearer eyJhbG...
```

```http
HTTP/1.1 200 OK

{
  "status": "success",
  "data": {
    "id": 42,
    "name": "Ripon Ahmed",
    "email": "ripon@example.com",
    "role": "developer",
    "created_at": "2026-02-18T14:30:00Z",
    "updated_at": "2026-02-18T14:30:00Z"
  }
}
```

Resource না থাকলে:

```http
GET /api/users/9999 HTTP/1.1

HTTP/1.1 404 Not Found

{
  "status": "error",
  "error": {
    "code": "RESOURCE_NOT_FOUND",
    "message": "User with id 9999 not found"
  }
}
```

### Update (Full) — PUT /api/users/:id

```http
PUT /api/users/42 HTTP/1.1
Content-Type: application/json
Authorization: Bearer eyJhbG...

{
  "name": "Ripon Ahmed",
  "email": "ripon.new@example.com",
  "role": "senior_developer"
}
```

```http
HTTP/1.1 200 OK

{
  "status": "success",
  "data": {
    "id": 42,
    "name": "Ripon Ahmed",
    "email": "ripon.new@example.com",
    "role": "senior_developer",
    "created_at": "2026-02-18T14:30:00Z",
    "updated_at": "2026-02-18T15:00:00Z"
  }
}
```

### Update (Partial) — PATCH /api/users/:id

```http
PATCH /api/users/42 HTTP/1.1
Content-Type: application/json
Authorization: Bearer eyJhbG...

{
  "role": "lead_developer"
}
```

```http
HTTP/1.1 200 OK

{
  "status": "success",
  "data": {
    "id": 42,
    "name": "Ripon Ahmed",
    "email": "ripon.new@example.com",
    "role": "lead_developer",
    "updated_at": "2026-02-18T15:30:00Z"
  }
}
```

### Delete — DELETE /api/users/:id

```http
DELETE /api/users/42 HTTP/1.1
Authorization: Bearer eyJhbG...
```

```http
HTTP/1.1 204 No Content
```

---

## Advanced REST Patterns

### 1. Bulk Operations

একসাথে অনেক resource create/update/delete করতে:

```http
POST /api/users/bulk
Content-Type: application/json

{
  "users": [
    { "name": "User A", "email": "a@example.com" },
    { "name": "User B", "email": "b@example.com" },
    { "name": "User C", "email": "c@example.com" }
  ]
}
```

```http
HTTP/1.1 207 Multi-Status

{
  "results": [
    { "status": 201, "data": { "id": 43, "name": "User A" } },
    { "status": 201, "data": { "id": 44, "name": "User B" } },
    { "status": 409, "error": { "message": "Email already exists" } }
  ]
}
```

**Bulk Delete:**

```http
DELETE /api/users/bulk
Content-Type: application/json

{ "ids": [10, 15, 23] }
```

### 2. Action Endpoints (Non-CRUD Operations)

কিছু operation CRUD-এ পড়ে না — তখন action endpoint ব্যবহার করো:

```http
POST /api/users/42/activate          ← User activate করো
POST /api/users/42/deactivate        ← User deactivate করো
POST /api/orders/100/cancel          ← Order cancel করো
POST /api/orders/100/pay             ← Order pay করো
POST /api/posts/5/publish            ← Post publish করো
POST /api/emails/send                ← Email পাঠাও
```

> এগুলো verb — কিন্তু CRUD-এ fit করে না, তাই এভাবে করা acceptable।

### 3. Soft Delete

Resource আসলে delete না করে **flag** দিয়ে চিহ্নিত করা:

```http
DELETE /api/users/42

→ Database-এ: UPDATE users SET deleted_at = NOW() WHERE id = 42
→ User আর GET /api/users-এ দেখা যাবে না
→ কিন্তু database-এ data আছে, recover করা যাবে
```

```http
GET /api/users?include_deleted=true     ← Deleted সহ সব user
POST /api/users/42/restore              ← Soft-deleted user ফিরিয়ে আনো
```

### 4. Search Endpoint

Complex search-এর জন্য আলাদা endpoint:

```http
POST /api/users/search
Content-Type: application/json

{
  "filters": {
    "role": ["developer", "designer"],
    "created_after": "2026-01-01",
    "is_active": true
  },
  "sort": { "field": "name", "order": "asc" },
  "page": 1,
  "limit": 20
}
```

> GET-এ complex filter query param-এ কঠিন হয়ে যায়, তখন POST search ব্যবহার করা যায়।

### 5. Sub-Resource Pattern

```http
GET    /api/users/42/posts              ← user 42-এর সব posts
POST   /api/users/42/posts              ← user 42-এর নতুন post
GET    /api/users/42/posts/5            ← user 42-এর post 5
GET    /api/posts/5/comments            ← post 5-এর সব comments
POST   /api/posts/5/comments            ← post 5-এ নতুন comment
GET    /api/users/42/followers          ← user 42-এর followers
GET    /api/users/42/following          ← user 42 যাদের follow করে
```

### 6. Expand / Include Related Data

Extra API call ছাড়াই related data আনতে:

```http
GET /api/users/42?expand=posts,profile

{
  "id": 42,
  "name": "Ripon",
  "profile": {
    "bio": "Backend developer",
    "avatar": "/images/ripon.jpg"
  },
  "posts": [
    { "id": 5, "title": "REST API Guide" },
    { "id": 8, "title": "HTTP Methods" }
  ]
}
```

```http
GET /api/posts/5?expand=author,comments

{
  "id": 5,
  "title": "REST API Guide",
  "author": { "id": 42, "name": "Ripon" },
  "comments": [
    { "id": 1, "text": "Great post!", "user": "Karim" }
  ]
}
```

> এটা REST-এ over-fetching/under-fetching সমস্যা কিছুটা কমায়।

### 7. Field Selection (Sparse Fieldsets)

শুধু যা দরকার তা-ই আনতে:

```http
GET /api/users?fields=id,name,email

[
  { "id": 1, "name": "Ripon", "email": "ripon@example.com" },
  { "id": 2, "name": "Karim", "email": "karim@example.com" }
]
```

> Bandwidth বাঁচায়, mobile app-এ বিশেষভাবে দরকারী।

---

## Idempotency — বারবার করলেও একই ফল

REST API-তে idempotency অত্যন্ত গুরুত্বপূর্ণ concept:

```
GET    /api/users/42    → ১০০ বার করো → একই user আসবে        ✅ Idempotent
PUT    /api/users/42    → ১০০ বার করো → একই result             ✅ Idempotent
DELETE /api/users/42    → ১০০ বার করো → user নেই (404)         ✅ Idempotent
POST   /api/users       → ১০০ বার করো → ১০০টা user তৈরি!      ❌ Not Idempotent
```

### Idempotency Key — POST-কে safe করা

Payment বা order-এ duplicate request বিপদ — দুইবার charge হতে পারে! Idempotency key এটি সমাধান করে:

```http
POST /api/payments HTTP/1.1
Idempotency-Key: unique-uuid-abc-123

{ "amount": 1000, "currency": "BDT" }
```

```
প্রথম request:   Idempotency-Key: abc-123 → Payment process, 201 Created
Network error, client retry করলো:
দ্বিতীয় request: Idempotency-Key: abc-123 → Server দেখলো key আগে ব্যবহার হয়েছে
                                            → আগের response ফেরত দিলো, নতুন payment হলো না!
```

```
Idempotency-Key ছাড়া:
POST /payments { amount: 1000 } → 201 (1000 টাকা কেটে গেল)
Network error, retry:
POST /payments { amount: 1000 } → 201 (আবার 1000 টাকা কেটে গেল! মোট 2000!)

Idempotency-Key দিয়ে:
POST /payments + Key: abc → 201 (1000 টাকা কেটে গেল)
Network error, retry:
POST /payments + Key: abc → 200 (আগের response ফেরত, আবার কাটেনি!)
```

---

## Error Handling Pattern

### Standard Error Response Format

```json
{
  "status": "error",
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Request validation failed",
    "details": [
      {
        "field": "email",
        "message": "Invalid email format",
        "value": "not-email"
      },
      {
        "field": "age",
        "message": "Must be between 18 and 120",
        "value": 5
      }
    ],
    "timestamp": "2026-02-18T15:00:00Z",
    "path": "/api/users",
    "request_id": "req-uuid-789"
  }
}
```

### Error Code Mapping

```
Error Type                    → Status Code  → Error Code
─────────────────────────────────────────────────────────
Validation failed             → 400          → VALIDATION_ERROR
Invalid JSON                  → 400          → INVALID_JSON
Token missing                 → 401          → AUTH_REQUIRED
Token expired                 → 401          → TOKEN_EXPIRED
No permission                 → 403          → FORBIDDEN
Resource not found            → 404          → RESOURCE_NOT_FOUND
Method not allowed            → 405          → METHOD_NOT_ALLOWED
Duplicate resource            → 409          → DUPLICATE_RESOURCE
Rate limit exceeded           → 429          → RATE_LIMIT_EXCEEDED
Server error                  → 500          → INTERNAL_ERROR
Service unavailable           → 503          → SERVICE_UNAVAILABLE
```

### Production Error Guidelines

```
❌ Development error (client-কে দেখানো যাবে না):
{
  "error": "TypeError: Cannot read property 'name' of undefined",
  "stack": "at UserController.js:42\n  at Router.handle..."
}

✅ Production error:
{
  "status": "error",
  "error": {
    "code": "INTERNAL_ERROR",
    "message": "Something went wrong. Please try again later.",
    "request_id": "req-uuid-789"
  }
}
```

> `request_id` দিয়ে developer server logs-এ আসল error খুঁজতে পারে।

---

## Pagination Patterns

### 1. Offset-Based (সবচেয়ে common)

```http
GET /api/users?page=3&limit=20

→ Skip: (3-1) × 20 = 40 records
→ Return: record 41-60
```

```json
{
  "data": [...],
  "pagination": {
    "page": 3,
    "limit": 20,
    "total": 250,
    "total_pages": 13
  }
}
```

```
সুবিধা: Simple, যেকোনো page-এ সরাসরি যেতে পারে
অসুবিধা: বড় offset-এ slow (OFFSET 100000 → database ধীর)
```

### 2. Cursor-Based (বড় dataset-এর জন্য)

```http
GET /api/users?limit=20
GET /api/users?limit=20&cursor=eyJpZCI6NDJ9
```

```json
{
  "data": [...],
  "pagination": {
    "next_cursor": "eyJpZCI6NjJ9",
    "has_more": true
  }
}
```

```
সুবিধা: সবসময় fast (WHERE id > cursor LIMIT 20), real-time data-তে ভালো
অসুবিধা: Random page-এ যেতে পারে না, শুধু next/previous
ব্যবহার: Twitter feed, infinite scroll, large datasets
```

### 3. Keyset-Based

```http
GET /api/users?limit=20&after_id=42&sort=created_at

→ WHERE id > 42 ORDER BY created_at LIMIT 20
```

```
সুবিধা: Offset-এর মতো simple কিন্তু cursor-এর মতো fast
```

---

## Content Negotiation

Client আর server negotiate করে — কোন format-এ data আদান-প্রদান হবে:

```http
GET /api/users HTTP/1.1
Accept: application/json        ← JSON চাই

HTTP/1.1 200 OK
Content-Type: application/json
[{"id": 1, "name": "Ripon"}]
```

```http
GET /api/users HTTP/1.1
Accept: application/xml         ← XML চাই

HTTP/1.1 200 OK
Content-Type: application/xml
<users><user><id>1</id><name>Ripon</name></user></users>
```

```http
GET /api/users HTTP/1.1
Accept: text/csv                ← CSV চাই

HTTP/1.1 200 OK
Content-Type: text/csv
id,name
1,Ripon
2,Karim
```

Server support না করলে:

```http
HTTP/1.1 406 Not Acceptable
{ "error": "Supported formats: application/json, application/xml" }
```

---

## Caching Strategy for REST APIs

```http
Static data (country list):
Cache-Control: public, max-age=86400        ← ২৪ ঘণ্টা
ETag: "v1"

User-specific data (profile):
Cache-Control: private, max-age=300         ← ৫ মিনিট, শুধু browser
ETag: "user-42-v5"

Real-time data (notifications):
Cache-Control: no-store                     ← cache করো না

Versioned assets (CSS/JS):
Cache-Control: public, max-age=31536000, immutable  ← ১ বছর
```

```
Caching flow:

Client → CDN (cache আছে?) → API Gateway (cache?) → Server → Database
                  ↑                    ↑
           public cache          private cache

CDN-এ cache hit = Server-এ request যায়ই না = সবচেয়ে দ্রুত
```

---

## Rate Limiting Strategies

### Fixed Window

```
100 requests per minute:

12:00:00 - 12:00:59  →  100 requests allowed
12:01:00 - 12:01:59  →  100 requests allowed (reset)
```

### Sliding Window

```
100 requests per minute (rolling):

Last 60 seconds-এ কতটা হয়েছে count করে
→ কোনো sudden burst at window boundary হয় না
```

### Token Bucket

```
Bucket size: 100 tokens
Refill rate: 10 tokens/second

Request আসলে 1 token খরচ হয়
Token শেষ হলে → 429 Too Many Requests
ধীরে ধীরে token refill হয়
→ Burst allow করে কিন্তু sustained rate limit রাখে
```

**Rate Limit Response:**

```http
HTTP/1.1 429 Too Many Requests
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 1708300860
Retry-After: 45

{
  "status": "error",
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Rate limit exceeded. Try again in 45 seconds."
  }
}
```

---

## Real-World REST API Examples

### E-commerce API

```
Products:
GET    /api/v1/products                    → সব product
GET    /api/v1/products?category=electronics&sort=-price
GET    /api/v1/products/101                → product details
POST   /api/v1/products                    → নতুন product (admin)

Cart:
GET    /api/v1/cart                         → আমার cart
POST   /api/v1/cart/items                   → cart-এ item যোগ
PATCH  /api/v1/cart/items/5                 → quantity update
DELETE /api/v1/cart/items/5                 → cart থেকে item সরাও

Orders:
POST   /api/v1/orders                       → order place
GET    /api/v1/orders                       → আমার সব order
GET    /api/v1/orders/200                   → order details
POST   /api/v1/orders/200/cancel            → order cancel

Payments:
POST   /api/v1/orders/200/pay               → payment
GET    /api/v1/orders/200/payment-status     → payment status
```

### Social Media API

```
Posts:
GET    /api/v1/feed                         → news feed
POST   /api/v1/posts                        → নতুন post
GET    /api/v1/posts/50                     → post details
DELETE /api/v1/posts/50                     → post delete
POST   /api/v1/posts/50/like                → like
DELETE /api/v1/posts/50/like                → unlike
POST   /api/v1/posts/50/share               → share

Comments:
GET    /api/v1/posts/50/comments            → comments
POST   /api/v1/posts/50/comments            → নতুন comment

Users:
GET    /api/v1/users/42                     → profile
POST   /api/v1/users/42/follow              → follow
DELETE /api/v1/users/42/follow              → unfollow
GET    /api/v1/users/42/followers            → followers
GET    /api/v1/users/42/following            → following
```

---

## REST API Documentation Template

একটি ভালো API doc-এ প্রতিটি endpoint-এর জন্য থাকা উচিত:

```
Endpoint:     POST /api/v1/users
Description:  Create a new user
Auth:         Bearer token (admin only)

Request:
  Headers:
    Content-Type: application/json
    Authorization: Bearer <token>

  Body:
    {
      "name": "string (required, 2-100 chars)",
      "email": "string (required, valid email)",
      "role": "string (optional, default: 'user')"
    }

Response:
  201 Created:
    { "status": "success", "data": { ... } }

  400 Bad Request:
    { "status": "error", "error": { "code": "VALIDATION_ERROR", ... } }

  401 Unauthorized:
    { "status": "error", "error": { "code": "AUTH_REQUIRED", ... } }

  409 Conflict:
    { "status": "error", "error": { "code": "DUPLICATE_RESOURCE", ... } }
```

---

## সংক্ষেপে মনে রাখার সূত্র

```
REST Maturity:
Level 0 → Single endpoint (RPC)
Level 1 → Resources (URLs)
Level 2 → HTTP Methods + Status Codes (practical standard)
Level 3 → HATEOAS (full REST)

Pagination:
Offset → Simple, slow for large data
Cursor → Fast, no random access
Keyset → Best of both

Idempotency:
GET, PUT, DELETE → Safe to retry
POST → Use Idempotency-Key for safety
```

---

## Interview Golden Lines

> **Most APIs claim to be RESTful but are actually Level 2 at best — true REST requires HATEOAS.**

> **Idempotency-Key prevents duplicate payments — it makes POST safe to retry.**

> **Cursor-based pagination is O(1) per page; offset-based is O(n) for large offsets.**

> **REST's biggest weakness is over-fetching and under-fetching — that's exactly what GraphQL solves.**

> **Soft delete preserves data integrity and enables audit trails — hard delete is irreversible.**
