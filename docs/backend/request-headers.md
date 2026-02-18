# HTTP Request Headers (রিকোয়েস্ট হেডারস)

## Request Header কী?

যখন client (browser/app) server-এ request পাঠায়, তখন শুধু URL আর method পাঠায় না — সাথে কিছু **অতিরিক্ত তথ্য** পাঠায়। এগুলোই **Request Headers**।

Headers হলো **key-value pair** — যা server-কে বলে দেয় client সম্পর্কে বিভিন্ন তথ্য।

```http
GET /api/users HTTP/1.1
Host: api.example.com              ← কোন server?
Accept: application/json           ← কোন format-এ data চাই?
Authorization: Bearer eyJhbGc...   ← আমি কে? (authentication)
User-Agent: Mozilla/5.0            ← কোন browser/app?
Content-Type: application/json     ← আমি কোন format-এ data পাঠাচ্ছি?
```

```
Client                                    Server
  |                                          |
  |── Method: GET                            |
  |── URL: /api/users                        |
  |── Headers:                               |
  |     Host: api.example.com                |
  |     Accept: application/json             |
  |     Authorization: Bearer token123       |
  |     User-Agent: Chrome/120               |
  |──────────────────────────────────────────►|
```

---

## Header-এর Category

Request headers কে কয়েকটি ভাগে ভাগ করা যায়:

| Category | কাজ | উদাহরণ |
|----------|-----|--------|
| **General** | প্রতিটি request-এ থাকে | Host, Connection |
| **Authentication** | পরিচয় প্রমাণ | Authorization, Cookie |
| **Content** | Body সম্পর্কিত তথ্য | Content-Type, Content-Length |
| **Negotiation** | Response format পছন্দ | Accept, Accept-Language |
| **Caching** | Cache control | Cache-Control, If-None-Match |
| **CORS** | Cross-origin request | Origin, Access-Control-Request-Method |
| **Custom** | App-specific | X-Request-ID, X-API-Key |

---

## General Headers

### Host (বাধ্যতামূলক)

**কোন server-এ request যাচ্ছে** তা বলে। HTTP/1.1 থেকে এটি বাধ্যতামূলক।

```http
Host: api.example.com
Host: api.example.com:8080
```

একই IP-তে একাধিক website থাকতে পারে (Virtual Hosting)। Host header দেখে server বুঝে কোন website-এর জন্য request:

```
IP: 192.168.1.1
  ├── Host: blog.example.com    → Blog app
  ├── Host: shop.example.com    → Shop app
  └── Host: api.example.com     → API server
```

### Connection

TCP connection-এর ব্যবহার কেমন হবে।

```http
Connection: keep-alive    ← connection খোলা রাখো (HTTP/1.1 default)
Connection: close         ← response পাঠিয়ে connection বন্ধ করো
```

### Upgrade

Protocol পরিবর্তন করতে চাইলে। সাধারণত WebSocket-এ upgrade করতে।

```http
Upgrade: websocket
Connection: Upgrade
```

---

## Authentication Headers

### Authorization

Client-এর **পরিচয় প্রমাণ** করে। সবচেয়ে গুরুত্বপূর্ণ header গুলোর একটি।

**Bearer Token (JWT):**

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjo0Mn0.abc123
```

**Basic Auth (username:password base64 encoded):**

```http
Authorization: Basic cmlwb246cGFzc3dvcmQxMjM=
```

```
"ripon:password123" → Base64 encode → "cmlwb246cGFzc3dvcmQxMjM="
```

**API Key:**

```http
Authorization: ApiKey sk-abc123def456
```

**বিভিন্ন Auth scheme:**

| Scheme | কীভাবে কাজ করে | ব্যবহার |
|--------|----------------|---------|
| Bearer | JWT/OAuth token | Modern API (সবচেয়ে common) |
| Basic | Base64(username:password) | Simple auth, internal API |
| Digest | Hash-based | Legacy system |
| ApiKey | API key | Third-party API |

### Cookie

Server আগে যে cookie set করেছিল, browser সেটা **প্রতিটি request-এ** ফেরত পাঠায়।

```http
Cookie: session_id=abc123; user_pref=dark_mode; lang=bn
```

```
প্রথম visit:
Server → Set-Cookie: session_id=abc123 (response header)

পরবর্তী সব request:
Browser → Cookie: session_id=abc123 (request header, automatically!)
```

> Cookie vs Authorization পার্থক্য:
> - **Cookie**: Browser automatically পাঠায় (session-based auth)
> - **Authorization**: Developer manually set করে (token-based auth)

---

## Content Headers

### Content-Type

Client **কোন format-এ data পাঠাচ্ছে** তা বলে। POST/PUT/PATCH request-এ ব্যবহৃত হয়।

```http
Content-Type: application/json                              ← JSON data
Content-Type: application/x-www-form-urlencoded             ← HTML form data
Content-Type: multipart/form-data; boundary=----abc123      ← File upload
Content-Type: text/plain                                    ← Plain text
Content-Type: application/xml                               ← XML data
```

**Common Content-Types:**

| Content-Type | কখন ব্যবহার হয় |
|---|---|
| `application/json` | REST API-তে JSON data পাঠানো (সবচেয়ে common) |
| `application/x-www-form-urlencoded` | HTML form submit (default) |
| `multipart/form-data` | File upload + form data |
| `text/plain` | Plain text |
| `text/html` | HTML content |
| `application/xml` | XML data (legacy API) |

**JSON data পাঠানো:**

```http
POST /api/users HTTP/1.1
Content-Type: application/json

{"name": "Ripon", "email": "ripon@example.com"}
```

**Form data পাঠানো:**

```http
POST /api/login HTTP/1.1
Content-Type: application/x-www-form-urlencoded

username=ripon&password=secret123
```

**File upload:**

```http
POST /api/upload HTTP/1.1
Content-Type: multipart/form-data; boundary=----FormBoundary

------FormBoundary
Content-Disposition: form-data; name="file"; filename="photo.jpg"
Content-Type: image/jpeg

(binary file data)
------FormBoundary--
```

### Content-Length

Request body-র **size** (bytes-এ)। Server জানে কত data আসছে।

```http
Content-Length: 256
```

### Content-Encoding

Body **compress** করা হয়েছে কিনা।

```http
Content-Encoding: gzip
Content-Encoding: br        ← Brotli compression
```

---

## Content Negotiation Headers

Client server-কে বলে — **কোন format-এ response চাই।**

### Accept

**কোন format-এ response data চাই।**

```http
Accept: application/json                    ← JSON চাই
Accept: text/html                           ← HTML চাই
Accept: application/xml                     ← XML চাই
Accept: */*                                 ← যেকোনো format চলবে
Accept: application/json, text/html;q=0.9   ← JSON prefer, HTML-ও চলবে
```

**Quality factor (q)** দিয়ে preference বলা যায়:

```http
Accept: application/json;q=1.0, text/html;q=0.9, text/plain;q=0.5
```

```
q=1.0 → সবচেয়ে বেশি prefer (default)
q=0.9 → এটাও চলবে
q=0.5 → শেষ option
q=0   → চাই না
```

### Accept-Language

**কোন ভাষায় response চাই।**

```http
Accept-Language: bn                          ← বাংলা চাই
Accept-Language: en-US, en;q=0.9, bn;q=0.8   ← US English prefer, বাংলাও চলবে
```

### Accept-Encoding

**কোন compression format support করি।**

```http
Accept-Encoding: gzip, deflate, br
```

Server এই header দেখে response compress করে পাঠায় — bandwidth বাঁচে, page দ্রুত load হয়।

```
Without compression: 500KB response
With gzip:          ~100KB response (৮০% ছোট!)
```

### Accept-Charset

**কোন character encoding support করি।**

```http
Accept-Charset: utf-8, iso-8859-1;q=0.5
```

---

## Caching Headers

### Cache-Control

Browser বা proxy **কীভাবে cache করবে** তা নিয়ন্ত্রণ করে।

```http
Cache-Control: no-cache          ← cache আছে কিন্তু server-এ validate করো
Cache-Control: no-store          ← কিছুই cache করো না
Cache-Control: max-age=3600      ← ১ ঘণ্টা cache করো
```

### If-None-Match (ETag)

আগের response-এ পাওয়া **ETag** পাঠায়। Server চেক করে resource পরিবর্তন হয়েছে কিনা।

```http
If-None-Match: "abc123xyz"
```

```
প্রথমবার:
GET /api/users → 200 OK + ETag: "abc123xyz" + (data)

পরেরবার:
GET /api/users + If-None-Match: "abc123xyz"
→ যদি data একই: 304 Not Modified (data পাঠায় না, bandwidth বাঁচে)
→ যদি data বদলেছে: 200 OK + নতুন ETag + (নতুন data)
```

### If-Modified-Since

নির্দিষ্ট **তারিখের পরে** resource পরিবর্তন হয়েছে কিনা জানতে চায়।

```http
If-Modified-Since: Wed, 18 Feb 2026 10:00:00 GMT
```

---

## CORS Headers (Cross-Origin)

Browser যখন **অন্য domain-এ** request পাঠায়, তখন এই headers ব্যবহৃত হয়।

### Origin

Request **কোন domain থেকে** আসছে।

```http
Origin: https://frontend.example.com
```

```
frontend.example.com → api.example.com (different domain = cross-origin)
Browser automatically Origin header যোগ করে
```

### Access-Control-Request-Method

**CORS preflight** (OPTIONS) request-এ ব্যবহৃত হয়। Browser জানতে চায় — এই method ব্যবহার করতে পারবো?

```http
OPTIONS /api/users HTTP/1.1
Origin: https://frontend.com
Access-Control-Request-Method: POST
Access-Control-Request-Headers: Content-Type, Authorization
```

```
Preflight flow:

Browser: "আমি frontend.com থেকে এসেছি, POST করতে পারবো?" (OPTIONS)
Server:  "হ্যাঁ, পারবে। GET, POST, PUT allowed।"
Browser: "তাহলে এবার আসল POST request পাঠাচ্ছি।"
```

---

## Conditional Headers

### If-Match

নির্দিষ্ট **ETag match করলেই** request process করো। Concurrent update conflict এড়াতে ব্যবহৃত হয় (Optimistic Locking)।

```http
PUT /api/users/42 HTTP/1.1
If-Match: "version-5"
Content-Type: application/json

{ "name": "Ripon Updated" }
```

```
User A: GET /users/42 → ETag: "version-5"
User B: GET /users/42 → ETag: "version-5"

User A: PUT /users/42 + If-Match: "version-5" → 200 OK (ETag এখন "version-6")
User B: PUT /users/42 + If-Match: "version-5" → 412 Precondition Failed!
         (কারণ ETag বদলে গেছে, User A আগেই update করেছে)
```

---

## Client Info Headers

### User-Agent

Client-এর **browser/app সম্পর্কে তথ্য** — কোন browser, কোন OS, কোন version।

```http
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36
```

**কেন দরকার:**
- Browser-specific content দেওয়া
- Mobile vs Desktop detect করা
- Bot/crawler detect করা
- Analytics

```
User-Agent parse করলে:
  Browser: Chrome 120
  OS: Windows 10 64-bit
  Engine: WebKit
```

### Referer

**কোন page থেকে** এই request এসেছে (previous page URL)।

```http
Referer: https://google.com/search?q=http+headers
```

> Note: Header-এর spelling ভুল (Referrer হওয়া উচিত ছিল) — কিন্তু original HTTP spec-এ typo ছিল, আর এখন আর ঠিক করা যায় না!

**কেন দরকার:**
- Analytics — user কোথা থেকে এসেছে
- Security — অন্য site থেকে আসা request block করা
- Logging

### X-Forwarded-For

**Client-এর real IP address** — যখন request proxy/load balancer দিয়ে আসে।

```http
X-Forwarded-For: 203.0.113.50, 70.41.3.18
```

```
Client (203.0.113.50) → Load Balancer (10.0.0.1) → Server

Server যদি শুধু connection IP দেখে → 10.0.0.1 (load balancer)
X-Forwarded-For দেখলে → 203.0.113.50 (real client IP)
```

### X-Real-IP

Proxy পেরিয়ে **আসল client IP**।

```http
X-Real-IP: 203.0.113.50
```

---

## Range Headers

### Range

Resource-এর **নির্দিষ্ট অংশ** চাইলে। বড় file download resume করতে বা video streaming-এ ব্যবহৃত হয়।

```http
Range: bytes=0-1023          ← প্রথম 1KB চাই
Range: bytes=1024-2047       ← দ্বিতীয় 1KB চাই
Range: bytes=1024-           ← 1KB থেকে শেষ পর্যন্ত
```

```
Video streaming:
GET /video.mp4 + Range: bytes=0-999999      → প্রথম 1MB
GET /video.mp4 + Range: bytes=1000000-1999999 → পরের 1MB

Download resume:
Download আটকে গেছে 50MB-তে
GET /file.zip + Range: bytes=52428800-     → 50MB থেকে বাকিটা দাও
```

---

## Custom Headers

### X- Prefix Headers

Developer নিজের app-specific headers তৈরি করতে পারে। Traditionally `X-` prefix ব্যবহার হতো (এখন আর বাধ্যতামূলক না):

```http
X-Request-ID: req-uuid-abc-123-xyz     ← Request tracking
X-API-Key: sk-abc123def456             ← API authentication
X-Correlation-ID: corr-789             ← Distributed tracing
X-Rate-Limit-Remaining: 95            ← কতগুলো request বাকি
X-Forwarded-Proto: https               ← Original protocol
```

**X-Request-ID কেন গুরুত্বপূর্ণ:**

```
Microservice architecture:

Request → API Gateway → Service A → Service B → Database
                                      ↑
                        X-Request-ID: "req-abc-123" (সবখানে একই ID)

Log দেখলে এই ID দিয়ে পুরো request trace করা যায়!
```

---

## সব Headers এক নজরে

| Header | কাজ | উদাহরণ |
|--------|-----|--------|
| Host | কোন server | `api.example.com` |
| Authorization | Authentication | `Bearer eyJhbG...` |
| Content-Type | Body format | `application/json` |
| Accept | Response format চাই | `application/json` |
| Cookie | Session data | `session_id=abc123` |
| User-Agent | Browser/app info | `Mozilla/5.0...` |
| Origin | Cross-origin source | `https://frontend.com` |
| Cache-Control | Cache নিয়ন্ত্রণ | `no-cache` |
| If-None-Match | Cache validation | `"etag-value"` |
| Accept-Encoding | Compression | `gzip, br` |
| Accept-Language | ভাষা preference | `bn, en;q=0.9` |
| Referer | কোথা থেকে এসেছে | `https://google.com/...` |
| Content-Length | Body size | `256` |
| Range | আংশিক data | `bytes=0-1023` |
| X-Forwarded-For | Real client IP | `203.0.113.50` |
| X-Request-ID | Request tracking | `req-uuid-123` |

---

## Interview Golden Lines

> **Host tells WHERE, Authorization tells WHO, Content-Type tells WHAT, Accept tells HOW.**

> **Cookie is automatic (browser sends it). Authorization is manual (developer sets it).**

> **If-None-Match enables 304 — the server says "nothing changed, use your cache."**

> **X-Forwarded-For reveals the real client IP behind proxies and load balancers.**
