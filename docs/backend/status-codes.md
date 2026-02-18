# HTTP Status Codes (স্ট্যাটাস কোড)

## Status Code কী?

যখন client (browser/app) server-এ কোনো request পাঠায়, server একটি **তিন সংখ্যার number** ফেরত দেয় — এটাই **HTTP Status Code**। এই code বলে দেয় — request-এর কী হলো।

```
Client ──── GET /api/users ────► Server
Client ◄──── 200 OK ────────── Server   ← "সফল! এই নাও data"

Client ──── GET /api/xyz ──────► Server
Client ◄──── 404 Not Found ──── Server   ← "এটা তো নেই!"
```

---

## Status Code-এর ৫টি Category

প্রথম digit দেখেই বোঝা যায় response কোন ধরনের:

| Range | Category | মানে |
|-------|----------|------|
| **1xx** | Informational | Request পেয়েছি, প্রসেস হচ্ছে... |
| **2xx** | Success | সফল! সব ঠিক আছে |
| **3xx** | Redirection | অন্য জায়গায় যাও |
| **4xx** | Client Error | তোমার (client) ভুল |
| **5xx** | Server Error | আমার (server) ভুল |

```
মনে রাখার সূত্র:

1xx → "ধৈর্য ধরো..."
2xx → "হয়ে গেছে!"
3xx → "ওদিকে যাও →"
4xx → "তুমি ভুল করেছ"
5xx → "আমি ভুল করেছি"
```

---

## 1xx — Informational (তথ্যমূলক)

Server বলছে — "তোমার request পেয়েছি, কাজ চলছে।"

### 100 Continue

Client একটা বড় request পাঠাতে চায়। প্রথমে header পাঠায়। Server বলে — "ঠিক আছে, body পাঠাও।"

```
Client ──► "বড় file পাঠাবো, পারবো?"
Server ◄── 100 Continue ("হ্যাঁ, পাঠাও")
Client ──► (এবার পুরো file পাঠায়)
```

### 101 Switching Protocols

Client চায় protocol পরিবর্তন করতে। সাধারণত HTTP → WebSocket upgrade-এ ব্যবহৃত হয়।

```http
GET /chat HTTP/1.1
Upgrade: websocket
Connection: Upgrade

HTTP/1.1 101 Switching Protocols
Upgrade: websocket
Connection: Upgrade
```

### 102 Processing

Server request পেয়েছে, কিন্তু process করতে সময় লাগছে। Client-কে জানায় — "অপেক্ষা করো, কাজ হচ্ছে।"

> 1xx codes সাধারণত browser/client নিজে handle করে, developer-কে manually ব্যবহার করতে হয় না।

---

## 2xx — Success (সফল)

এটাই আমরা সবসময় দেখতে চাই — request সফল হয়েছে!

### 200 OK

সবচেয়ে common status code। Request সফল এবং response body-তে data আছে।

```http
GET /api/users/1 HTTP/1.1

HTTP/1.1 200 OK
Content-Type: application/json

{
  "id": 1,
  "name": "Ripon",
  "email": "ripon@example.com"
}
```

**কখন ব্যবহার হয়:**
- GET request সফল হলে
- PUT/PATCH update সফল হলে (updated data সহ)
- DELETE সফল হলে (confirmation message সহ)

### 201 Created

নতুন resource সফলভাবে **তৈরি হয়েছে**। POST request-এর response-এ ব্যবহৃত হয়।

```http
POST /api/users HTTP/1.1
Content-Type: application/json

{ "name": "Ripon", "email": "ripon@example.com" }

HTTP/1.1 201 Created
Location: /api/users/42

{
  "id": 42,
  "name": "Ripon",
  "email": "ripon@example.com"
}
```

> `Location` header-এ নতুন resource-এর URL থাকে।

### 202 Accepted

Request গ্রহণ করা হয়েছে কিন্তু এখনো **process শেষ হয়নি**। Background job বা async operation-এ ব্যবহৃত হয়।

```http
POST /api/reports/generate HTTP/1.1

HTTP/1.1 202 Accepted

{
  "message": "Report generation started",
  "status_url": "/api/reports/status/789"
}
```

> Email পাঠানো, PDF generate করা, বড় data export — এসব ক্ষেত্রে 202 ব্যবহৃত হয়।

### 204 No Content

Request সফল, কিন্তু **response-এ কোনো body নেই**। সাধারণত DELETE-এর পরে ব্যবহৃত হয়।

```http
DELETE /api/users/42 HTTP/1.1

HTTP/1.1 204 No Content
(কোনো body নেই)
```

**কখন ব্যবহার হয়:**
- DELETE সফল হলে
- PUT/PATCH update সফল কিন্তু data ফেরত দেওয়ার দরকার নেই

---

## 3xx — Redirection (পুনঃনির্দেশনা)

Server বলছে — "তুমি যা চাইছ সেটা **অন্য জায়গায়** আছে।"

### 301 Moved Permanently

Resource **স্থায়ীভাবে** নতুন URL-এ চলে গেছে। সব future request নতুন URL-এ যাবে।

```http
GET /old-page HTTP/1.1

HTTP/1.1 301 Moved Permanently
Location: https://example.com/new-page
```

```
Browser: /old-page চাই
Server:  301 → /new-page এ গেছে (চিরকালের জন্য)
Browser: /new-page চাই (automatically)
Server:  200 OK (এই নাও!)
```

**কখন ব্যবহার হয়:**
- Website restructure করলে
- Domain পরিবর্তন করলে
- HTTP থেকে HTTPS-এ redirect
- SEO-তে গুরুত্বপূর্ণ — Google নতুন URL index করে

### 302 Found (Temporary Redirect)

Resource **সাময়িকভাবে** অন্য URL-এ আছে। পরে আবার আগের URL-এ ফিরে আসতে পারে।

```http
GET /profile HTTP/1.1

HTTP/1.1 302 Found
Location: /login
```

**কখন ব্যবহার হয়:**
- Login না থাকলে login page-এ redirect
- Maintenance mode-এ temporary page দেখানো
- A/B testing

### 304 Not Modified

Resource পরিবর্তন হয়নি — browser **cache থেকে** দেখাতে পারবে। Bandwidth বাঁচায়।

```http
GET /api/users HTTP/1.1
If-None-Match: "abc123"

HTTP/1.1 304 Not Modified
(কোনো body নেই — browser cache ব্যবহার করবে)
```

```
প্রথমবার:
Browser → GET /style.css
Server  → 200 OK + ETag: "abc123" + (পুরো file)

পরেরবার:
Browser → GET /style.css + If-None-Match: "abc123"
Server  → 304 Not Modified (file পাঠানোর দরকার নেই!)
Browser → Cache থেকে দেখায় (দ্রুত!)
```

### 307 Temporary Redirect

302-এর মতো, কিন্তু **method ও body preserve** করে। POST redirect-এ POST-ই থাকে।

### 308 Permanent Redirect

301-এর মতো, কিন্তু **method preserve** করে।

| Code | Type | Method Preserve |
|------|------|-----------------|
| 301 | Permanent | ❌ POST → GET হতে পারে |
| 302 | Temporary | ❌ POST → GET হতে পারে |
| 307 | Temporary | ✅ POST → POST থাকে |
| 308 | Permanent | ✅ POST → POST থাকে |

---

## 4xx — Client Error (Client-এর ভুল)

Server বলছে — "তুমি কিছু ভুল করেছ, আমি তোমার request process করতে পারছি না।"

### 400 Bad Request

Request-এ **ভুল বা অসম্পূর্ণ data** আছে। Server বুঝতে পারছে না।

```http
POST /api/users HTTP/1.1
Content-Type: application/json

{ "name": "", "email": "not-a-valid-email" }

HTTP/1.1 400 Bad Request

{
  "error": "Validation failed",
  "details": [
    { "field": "name", "message": "Name is required" },
    { "field": "email", "message": "Invalid email format" }
  ]
}
```

**কখন আসে:**
- Validation fail
- JSON format ভুল
- Required field missing
- Data type mismatch

### 401 Unauthorized

Client **authenticate হয়নি** — মানে "তুমি কে বলো আগে।"

```http
GET /api/profile HTTP/1.1

HTTP/1.1 401 Unauthorized
WWW-Authenticate: Bearer

{
  "error": "Authentication required",
  "message": "Please provide a valid token"
}
```

**কখন আসে:**
- Login না করে protected route access করলে
- Token expire হয়ে গেলে
- Token invalid হলে

> নাম "Unauthorized" হলেও আসলে এটা **authentication** সমস্যা, authorization না।

### 403 Forbidden

Client authenticate হয়েছে কিন্তু এই resource-এ **permission নেই** — "তুমি কে জানি, কিন্তু তোমার অনুমতি নেই।"

```http
DELETE /api/admin/users/1 HTTP/1.1
Authorization: Bearer <normal-user-token>

HTTP/1.1 403 Forbidden

{
  "error": "Access denied",
  "message": "Admin privileges required"
}
```

**401 vs 403 পার্থক্য:**

```
401: "তুমি কে?" (Login করো আগে)
403: "তোমাকে চিনি, কিন্তু এটা তোমার জন্য না" (Permission নেই)

উদাহরণ:
Normal user → GET /admin/dashboard → 403 (login আছে, কিন্তু admin না)
No token    → GET /admin/dashboard → 401 (login-ই করোনি)
```

### 404 Not Found

সবচেয়ে পরিচিত error code! Request করা resource **খুঁজে পাওয়া যায়নি**।

```http
GET /api/users/99999 HTTP/1.1

HTTP/1.1 404 Not Found

{
  "error": "User not found",
  "message": "No user exists with id 99999"
}
```

**কখন আসে:**
- ভুল URL লিখলে
- Deleted resource access করলে
- Typo in URL

### 405 Method Not Allowed

URL ঠিক আছে কিন্তু **HTTP method ভুল**।

```http
DELETE /api/login HTTP/1.1

HTTP/1.1 405 Method Not Allowed
Allow: POST

{
  "error": "DELETE method not allowed on /api/login",
  "allowed_methods": ["POST"]
}
```

### 408 Request Timeout

Client request পাঠাতে **অনেক বেশি সময়** নিয়েছে। Server অপেক্ষা করতে করতে timeout হয়ে গেছে।

### 409 Conflict

Request current resource state-এর সাথে **conflict** করছে।

```http
POST /api/users HTTP/1.1
Content-Type: application/json

{ "email": "ripon@example.com" }

HTTP/1.1 409 Conflict

{
  "error": "Email already exists",
  "message": "A user with email ripon@example.com already exists"
}
```

**কখন আসে:**
- Duplicate entry তৈরি করতে গেলে
- Concurrent update conflict
- Resource state conflict

### 413 Payload Too Large

Request body **অনেক বড়** — server-এর limit অতিক্রম করেছে।

```http
POST /api/upload HTTP/1.1
Content-Length: 524288000  (500MB)

HTTP/1.1 413 Payload Too Large

{
  "error": "File too large",
  "message": "Maximum upload size is 10MB"
}
```

### 415 Unsupported Media Type

Server এই **Content-Type** support করে না।

```http
POST /api/users HTTP/1.1
Content-Type: text/xml

HTTP/1.1 415 Unsupported Media Type

{
  "error": "Only application/json is supported"
}
```

### 422 Unprocessable Entity

Request format ঠিক আছে কিন্তু **semantic/business logic error**।

```http
POST /api/orders HTTP/1.1
Content-Type: application/json

{ "product_id": 5, "quantity": -3 }

HTTP/1.1 422 Unprocessable Entity

{
  "error": "Validation error",
  "details": [
    { "field": "quantity", "message": "Quantity must be positive" }
  ]
}
```

**400 vs 422 পার্থক্য:**

```
400: Request format-ই ভুল (invalid JSON, wrong type)
422: Format ঠিক আছে, কিন্তু data logically ভুল (quantity = -3)
```

### 429 Too Many Requests

Client **অনেক বেশি request** পাঠাচ্ছে — rate limit cross করেছে।

```http
GET /api/data HTTP/1.1

HTTP/1.1 429 Too Many Requests
Retry-After: 60

{
  "error": "Rate limit exceeded",
  "message": "Max 100 requests per minute. Try again in 60 seconds."
}
```

---

## 5xx — Server Error (Server-এর ভুল)

Server বলছে — "আমার সমস্যা, তোমার দোষ নেই।"

### 500 Internal Server Error

সবচেয়ে ভয়ংকর error! Server-এ **অপ্রত্যাশিত কিছু ভুল** হয়েছে। সাধারণত unhandled exception।

```http
GET /api/users HTTP/1.1

HTTP/1.1 500 Internal Server Error

{
  "error": "Internal server error",
  "message": "Something went wrong. Please try again later."
}
```

**কখন আসে:**
- Code-এ bug (null pointer, division by zero)
- Database connection fail
- Unhandled exception
- Configuration error

> Production-এ কখনো error details client-কে দেখাবেন না — security risk!

### 502 Bad Gateway

Server **অন্য একটি server-এর** কাছ থেকে invalid response পেয়েছে। Reverse proxy বা load balancer ব্যবহার করলে দেখা যায়।

```
Client → Nginx (Proxy) → Backend Server (crashed!)
                    ↑
            502 Bad Gateway
```

**কখন আসে:**
- Backend server down/crashed
- Backend server timeout
- Nginx/Apache upstream server-এ connect করতে পারছে না

### 503 Service Unavailable

Server **সাময়িকভাবে request handle করতে পারছে না**। Overloaded বা maintenance-এ আছে।

```http
GET /api/users HTTP/1.1

HTTP/1.1 503 Service Unavailable
Retry-After: 300

{
  "error": "Service temporarily unavailable",
  "message": "We are currently under maintenance. Please try again in 5 minutes."
}
```

**কখন আসে:**
- Server overloaded
- Planned maintenance
- Deployment চলছে
- Database down

### 504 Gateway Timeout

Proxy/gateway server **upstream server থেকে response পায়নি** সময়মতো।

```
Client → Nginx → Backend (কোনো response দিচ্ছে না... timeout!)
              ↑
        504 Gateway Timeout
```

**502 vs 503 vs 504 পার্থক্য:**

```
502: Upstream server ভুল response দিয়েছে (bad response)
503: Server আছে কিন্তু busy/maintenance (temporarily unavailable)
504: Upstream server response-ই দেয়নি (timeout)
```

---

## সবচেয়ে বেশি ব্যবহৃত Status Codes

Backend developer হিসেবে এগুলো সবসময় মনে রাখতে হবে:

| Code | নাম | কখন ব্যবহার করবেন |
|------|-----|--------------------|
| **200** | OK | GET/PUT/PATCH সফল |
| **201** | Created | POST-এ নতুন resource তৈরি |
| **204** | No Content | DELETE সফল |
| **301** | Moved Permanently | URL স্থায়ী redirect |
| **304** | Not Modified | Cache valid |
| **400** | Bad Request | Invalid input |
| **401** | Unauthorized | Login দরকার |
| **403** | Forbidden | Permission নেই |
| **404** | Not Found | Resource নেই |
| **409** | Conflict | Duplicate data |
| **422** | Unprocessable Entity | Validation error |
| **429** | Too Many Requests | Rate limit |
| **500** | Internal Server Error | Server bug |
| **502** | Bad Gateway | Upstream server error |
| **503** | Service Unavailable | Server busy/maintenance |

---

## REST API-তে Status Code ব্যবহারের Best Practice

```
API Operation              → Success Code   → Common Error Codes
─────────────────────────────────────────────────────────────────
GET    /users              → 200 OK         → 401, 403, 500
GET    /users/42           → 200 OK         → 401, 403, 404, 500
POST   /users              → 201 Created    → 400, 401, 409, 422, 500
PUT    /users/42           → 200 OK         → 400, 401, 403, 404, 422, 500
PATCH  /users/42           → 200 OK         → 400, 401, 403, 404, 422, 500
DELETE /users/42           → 204 No Content → 401, 403, 404, 500
```

---

## সংক্ষেপে মনে রাখার সূত্র

```
1xx → "Wait..."
2xx → "Done!"           → 200 OK, 201 Created, 204 No Content
3xx → "Go there →"      → 301 Permanent, 302 Temporary, 304 Cached
4xx → "Your fault"      → 400 Bad, 401 Login, 403 No Permission, 404 Not Found
5xx → "My fault"        → 500 Bug, 502 Bad Gateway, 503 Busy
```

---

## Interview Golden Lines

> **401 is "Who are you?" and 403 is "I know you, but you can't do this."**

> **PUT returns 200, POST returns 201, DELETE returns 204.**

> **400 means bad syntax, 422 means bad semantics.**

> **5xx is never the client's fault — it's always the server's problem.**
