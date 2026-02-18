# HTTP Methods (HTTP মেথডস)

## HTTP Method কী?

HTTP Method হলো client থেকে server-কে বলে দেওয়া — **"আমি কী করতে চাই"**।

যখন browser বা কোনো application server-এ request পাঠায়, তখন method বলে দেয় — data চাই, নতুন data তৈরি করতে চাই, update করতে চাই, নাকি delete করতে চাই।

```
Client ──── [METHOD] /api/users ────► Server

উদাহরণ:
GET    /api/users      → সব user দাও
POST   /api/users      → নতুন user তৈরি করো
PUT    /api/users/1    → user 1 update করো
DELETE /api/users/1    → user 1 মুছে দাও
```

---

## সব HTTP Methods এক নজরে

| Method  | কাজ                       | Safe? | Idempotent? | Body? |
| ------- | ------------------------- | ----- | ----------- | ----- |
| GET     | Data পড়া / আনা           | ✅    | ✅          | ❌    |
| POST    | নতুন data তৈরি            | ❌    | ❌          | ✅    |
| PUT     | পুরো resource replace     | ❌    | ✅          | ✅    |
| PATCH   | আংশিক update              | ❌    | ❌          | ✅    |
| DELETE  | Data মুছে ফেলা            | ❌    | ✅          | ❌    |
| HEAD    | শুধু headers (body ছাড়া) | ✅    | ✅          | ❌    |
| OPTIONS | কী কী method সাপোর্ট করে  | ✅    | ✅          | ❌    |
| TRACE   | Request echo back         | ✅    | ✅          | ❌    |
| CONNECT | Tunnel তৈরি (proxy)       | ❌    | ❌          | ❌    |

---

## প্রতিটি Method বিস্তারিত

### 1. GET — Data আনা / পড়া

সবচেয়ে বেশি ব্যবহৃত method। Server থেকে data **পড়ার** জন্য।

**বৈশিষ্ট্য:**

- Server-এ কোনো পরিবর্তন করে না
- Request body থাকে না — data URL-এ query parameter হিসেবে যায়
- Browser address bar-এ যা লেখেন সব GET request
- Response cache করা যায়

```http
GET /api/users HTTP/1.1
Host: example.com
Accept: application/json
```

Response:

```json
HTTP/1.1 200 OK
Content-Type: application/json

[
  { "id": 1, "name": "Ripon", "email": "ripon@example.com" },
  { "id": 2, "name": "Karim", "email": "karim@example.com" }
]
```

**Query Parameter দিয়ে filter:**

```http
GET /api/users?page=2&limit=10&role=admin
GET /api/products?category=electronics&sort=price
GET /api/users/42
```

**কখন ব্যবহার করবেন:**

- Webpage load করা
- API থেকে data fetch করা
- Search করা
- List/detail দেখা

**কখন ব্যবহার করবেন না:**

- Password বা sensitive data পাঠাতে (URL-এ দেখা যায়!)
- Server-এ কিছু তৈরি বা পরিবর্তন করতে

---

### 2. POST — নতুন Data তৈরি করা

Server-এ **নতুন resource তৈরি** করতে ব্যবহৃত হয়।

**বৈশিষ্ট্য:**

- Request body-তে data পাঠায়
- প্রতিবার call করলে নতুন resource তৈরি হয় (idempotent না)
- সাধারণত response-এ নতুন resource-এর id ফেরত আসে
- URL-এ data দেখা যায় না (GET-এর চেয়ে নিরাপদ)

```http
POST /api/users HTTP/1.1
Host: example.com
Content-Type: application/json

{
  "name": "Ripon",
  "email": "ripon@example.com",
  "password": "securePass123"
}
```

Response:

```json
HTTP/1.1 201 Created
Location: /api/users/42

{
  "id": 42,
  "name": "Ripon",
  "email": "ripon@example.com",
  "created_at": "2026-02-18T10:30:00Z"
}
```

**কখন ব্যবহার করবেন:**

- User registration / signup
- নতুন blog post তৈরি
- Form submit করা
- File upload করা
- Login (credentials পাঠাতে)

**POST কেন Idempotent না?**

```
POST /api/orders → Order #101 তৈরি হলো
POST /api/orders → Order #102 তৈরি হলো (আবার নতুন!)
POST /api/orders → Order #103 তৈরি হলো (আবার নতুন!)
```

প্রতিবার নতুন resource তৈরি হয় — তাই idempotent না।

---

### 3. PUT — পুরো Resource Replace করা

পুরো resource-কে **সম্পূর্ণ নতুন data দিয়ে replace** করে।

**বৈশিষ্ট্য:**

- পুরো object পাঠাতে হয়
- যা পাঠাবেন তা-ই হবে — বাকি field মুছে যাবে
- Resource না থাকলে নতুন তৈরি করতে পারে
- Idempotent — ১০০ বার call করলেও result একই

```http
PUT /api/users/42 HTTP/1.1
Content-Type: application/json

{
  "name": "Ripon Ahmed",
  "email": "ripon.new@example.com",
  "password": "newPass456",
  "role": "admin"
}
```

Response:

```json
HTTP/1.1 200 OK

{
  "id": 42,
  "name": "Ripon Ahmed",
  "email": "ripon.new@example.com",
  "role": "admin",
  "updated_at": "2026-02-18T11:00:00Z"
}
```

**PUT-এ সমস্যা — field বাদ দিলে মুছে যায়:**

```
আগে:  { "name": "Ripon", "email": "ripon@example.com", "phone": "01712345678" }

PUT:   { "name": "Ripon Ahmed", "email": "ripon.new@example.com" }

পরে:  { "name": "Ripon Ahmed", "email": "ripon.new@example.com" }
       ← phone মুছে গেছে! কারণ PUT পুরো object replace করে
```

**PUT কেন Idempotent?**

```
PUT /api/users/42 (name: "Ripon") → Result: name = "Ripon"
PUT /api/users/42 (name: "Ripon") → Result: name = "Ripon" (একই!)
PUT /api/users/42 (name: "Ripon") → Result: name = "Ripon" (একই!)
```

যতবারই করো, result সবসময় একই।

---

### 4. PATCH — আংশিক Update

Resource-এর **শুধু নির্দিষ্ট field** update করে — বাকি সব আগের মতো থাকে।

**বৈশিষ্ট্য:**

- শুধু যে field পরিবর্তন করতে চান সেটাই পাঠান
- বাকি field-গুলো অপরিবর্তিত থাকে
- PUT-এর চেয়ে bandwidth বাঁচায় (কম data পাঠাতে হয়)

```http
PATCH /api/users/42 HTTP/1.1
Content-Type: application/json

{
  "email": "ripon.updated@example.com"
}
```

Response:

```json
HTTP/1.1 200 OK

{
  "id": 42,
  "name": "Ripon",
  "email": "ripon.updated@example.com",
  "phone": "01712345678",
  "updated_at": "2026-02-18T11:30:00Z"
}
```

> শুধু email পরিবর্তন হলো — name, phone সব আগের মতো আছে।

---

### PUT vs PATCH — পার্থক্য

এটা interview-তে খুব common প্রশ্ন:

```
ধরো একটা user আছে:
{ "name": "Ripon", "email": "ripon@example.com", "phone": "01712345678" }

PUT  { "name": "Ripon Ahmed" }
→ Result: { "name": "Ripon Ahmed" }
  ← email, phone মুছে গেল! পুরো replace হয়ে গেছে

PATCH { "name": "Ripon Ahmed" }
→ Result: { "name": "Ripon Ahmed", "email": "ripon@example.com", "phone": "01712345678" }
  ← শুধু name বদলেছে, বাকি সব আছে
```

| বিষয়           | PUT                   | PATCH                  |
| --------------- | --------------------- | ---------------------- |
| Update type     | পুরো resource replace | আংশিক update           |
| Data পাঠানো     | সব field পাঠাতে হয়   | শুধু পরিবর্তিত field   |
| Missing field   | মুছে যায়             | আগের মতো থাকে          |
| Idempotent      | ✅ হ্যাঁ              | ❌ না (সবসময় না)      |
| Bandwidth       | বেশি লাগে             | কম লাগে                |
| বাস্তবে ব্যবহার | কম                    | বেশি (বেশিরভাগ API-তে) |

---

### 5. DELETE — Data মুছে ফেলা

Server থেকে resource **মুছে ফেলতে** ব্যবহৃত হয়।

**বৈশিষ্ট্য:**

- সাধারণত request body থাকে না
- Idempotent — একবার delete করলে আবার করলেও result একই (resource নেই)
- Response-এ সাধারণত কোনো body থাকে না

```http
DELETE /api/users/42 HTTP/1.1
Host: example.com
```

Response:

```json
HTTP/1.1 204 No Content
```

অথবা কিছু API confirmation message দেয়:

```json
HTTP/1.1 200 OK

{
  "message": "User 42 successfully deleted"
}
```

**DELETE কেন Idempotent?**

```
DELETE /api/users/42 → User deleted (204 No Content)
DELETE /api/users/42 → User already gone (404 Not Found)
```

Server-এর state একই থাকে — user 42 নেই।

---

### 6. HEAD — শুধু Headers চাই (Body না)

GET-এর মতোই কাজ করে, কিন্তু **response body ছাড়া শুধু headers** ফেরত আসে।

**কখন দরকার:**

- File size জানতে (download আগে)
- Resource আছে কিনা check করতে
- Content-Type জানতে
- Cache valid কিনা check করতে

```http
HEAD /api/files/report.pdf HTTP/1.1
Host: example.com
```

Response:

```
HTTP/1.1 200 OK
Content-Type: application/pdf
Content-Length: 2458930
Last-Modified: Wed, 18 Feb 2026 10:00:00 GMT
```

> Body আসেনি — শুধু headers আসলো। File-টা 2.4MB, PDF format। পুরো file download না করেই জেনে গেলাম।

---

### 7. OPTIONS — কী কী করা যায়?

Server-কে জিজ্ঞেস করে — এই endpoint-এ **কোন কোন HTTP method** সাপোর্ট করে।

**সবচেয়ে বেশি ব্যবহৃত হয়:**

- **CORS preflight request** — browser automatically পাঠায় cross-origin request-এর আগে

```http
OPTIONS /api/users HTTP/1.1
Host: api.example.com
Origin: https://frontend.com
Access-Control-Request-Method: POST
```

Response:

```
HTTP/1.1 204 No Content
Allow: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Origin: https://frontend.com
Access-Control-Allow-Methods: GET, POST, PUT, DELETE
Access-Control-Allow-Headers: Content-Type, Authorization
```

**CORS Preflight flow:**

```
Browser                                 Server
   |                                       |
   |── OPTIONS /api/users ────────────────►|  (আগে জিজ্ঞেস করে)
   |◄── Allow: GET, POST ─────────────────|  (Server বলে কী কী পারবে)
   |                                       |
   |── POST /api/users (actual request) ──►|  (তারপর আসল request পাঠায়)
   |◄── 201 Created ──────────────────────|
```

---

### 8. TRACE — Echo Back

Server request-টাকে **হুবহু ফেরত** পাঠায়। Debugging-এর জন্য ব্যবহৃত হতো।

```http
TRACE /api/users HTTP/1.1
Host: example.com
```

Response:

```
HTTP/1.1 200 OK
Content-Type: message/http

TRACE /api/users HTTP/1.1
Host: example.com
```

> বাস্তবে এটি **security risk** (Cross-Site Tracing attack) তাই বেশিরভাগ server-এ disabled থাকে।

---

### 9. CONNECT — Tunnel তৈরি

**HTTP proxy** দিয়ে encrypted tunnel (HTTPS) তৈরি করতে ব্যবহৃত হয়।

```http
CONNECT www.example.com:443 HTTP/1.1
Host: www.example.com
```

> সাধারণত backend developer হিসেবে সরাসরি ব্যবহার করতে হয় না। Proxy server এটি handle করে।

---

## Safe vs Idempotent কী?

Interview-তে এই দুটো concept খুব গুরুত্বপূর্ণ।

### Safe Method

Server-এ **কোনো পরিবর্তন করে না**। শুধু data পড়ে।

```
Safe:     GET, HEAD, OPTIONS, TRACE
Not Safe: POST, PUT, PATCH, DELETE
```

> GET /api/users — ১০০ বার call করলেও server-এর data একই থাকবে।

### Idempotent Method

**একবার বা ১০০ বার call করলেও server-এর state একই থাকে।**

```
Idempotent:     GET, PUT, DELETE, HEAD, OPTIONS, TRACE
Not Idempotent: POST, PATCH
```

```
PUT  /api/users/1 { name: "Ripon" }
→ ১ বার: name = "Ripon"
→ ১০ বার: name = "Ripon"  (একই result!)

POST /api/users { name: "Ripon" }
→ ১ বার: User #1 তৈরি
→ ১০ বার: User #1, #2, #3...#10 তৈরি (প্রতিবার নতুন!)
```

---

## CRUD Operations এবং HTTP Methods

Backend development-এ সবচেয়ে common pattern — **CRUD**:

| CRUD       | HTTP Method | URL             | কাজ             |
| ---------- | ----------- | --------------- | --------------- |
| **C**reate | POST        | `/api/users`    | নতুন user তৈরি  |
| **R**ead   | GET         | `/api/users`    | সব user দেখা    |
| **R**ead   | GET         | `/api/users/42` | একটি user দেখা  |
| **U**pdate | PUT/PATCH   | `/api/users/42` | user update করা |
| **D**elete | DELETE      | `/api/users/42` | user মুছে ফেলা  |

**Real-world REST API example:**

```
Blog API:

GET    /api/posts              → সব post দেখাও
GET    /api/posts/5            → post #5 দেখাও
POST   /api/posts              → নতুন post তৈরি করো
PUT    /api/posts/5            → post #5 পুরো replace করো
PATCH  /api/posts/5            → post #5 এর কিছু field update করো
DELETE /api/posts/5            → post #5 মুছে দাও

GET    /api/posts/5/comments   → post #5 এর সব comment দেখাও
POST   /api/posts/5/comments   → post #5 এ নতুন comment যোগ করো
```

---

## সংক্ষেপে মনে রাখার সূত্র

```
GET    → দেখতে চাই (Read)
POST   → তৈরি করতে চাই (Create)
PUT    → পুরোটা বদলাতে চাই (Full Replace)
PATCH  → কিছুটা বদলাতে চাই (Partial Update)
DELETE → মুছতে চাই (Delete)
HEAD   → শুধু header চাই (No Body)
OPTIONS → কী কী পারবো? (CORS)
```

---

## Interview Golden Lines

> **GET reads, POST creates, PUT replaces, PATCH updates, DELETE removes.**

> **Safe means no side effects. Idempotent means same result every time.**

> **PUT is like overwriting a file. PATCH is like editing a line in that file.**
