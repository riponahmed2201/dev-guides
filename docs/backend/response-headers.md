# HTTP Response Headers (রেসপন্স হেডারস)

## Response Header কী?

Client যখন server-এ request পাঠায়, server response-এর সাথে কিছু **অতিরিক্ত তথ্য** ফেরত পাঠায় — এগুলোই **Response Headers**। এই headers client/browser-কে বলে দেয় — data কীভাবে handle করবে, cache করবে কিনা, security কী হবে ইত্যাদি।

```http
HTTP/1.1 200 OK
Content-Type: application/json        ← data কোন format-এ আছে?
Content-Length: 1234                   ← data কত বড়?
Cache-Control: max-age=3600           ← cache করো ১ ঘণ্টা
Set-Cookie: session_id=abc123         ← এই cookie রেখে দাও
X-Request-ID: req-uuid-789           ← request tracking ID

{"id": 1, "name": "Ripon"}
```

```
Client                                   Server
  |                                         |
  |◄── Status: 200 OK                      |
  |◄── Headers:                             |
  |      Content-Type: application/json     |
  |      Cache-Control: max-age=3600        |
  |      Set-Cookie: session_id=abc123      |
  |◄── Body:                                |
  |      {"id": 1, "name": "Ripon"}         |
  |◄────────────────────────────────────────|
```

---

## Header-এর Category

| Category | কাজ | উদাহরণ |
|----------|-----|--------|
| **Content** | Response body সম্পর্কিত | Content-Type, Content-Length |
| **Caching** | Cache নিয়ন্ত্রণ | Cache-Control, ETag, Expires |
| **Security** | নিরাপত্তা | CORS headers, CSP, HSTS |
| **Cookie** | Cookie set করা | Set-Cookie |
| **Redirect** | অন্য URL-এ পাঠানো | Location |
| **Server Info** | Server সম্পর্কে তথ্য | Server, X-Powered-By |
| **Rate Limiting** | Request limit জানানো | X-RateLimit-* |

---

## Content Headers

### Content-Type

Response body **কোন format-এ** আছে। Browser/client এটা দেখে বুঝে data কীভাবে parse/render করবে।

```http
Content-Type: application/json; charset=utf-8     ← JSON data
Content-Type: text/html; charset=utf-8            ← HTML page
Content-Type: text/css                            ← CSS file
Content-Type: application/javascript              ← JS file
Content-Type: image/png                           ← PNG image
Content-Type: application/pdf                     ← PDF file
Content-Type: application/octet-stream            ← Binary file (download)
```

**Common Content-Types:**

| Content-Type | কখন ব্যবহার হয় |
|---|---|
| `application/json` | REST API response (সবচেয়ে common) |
| `text/html` | Webpage serve করলে |
| `text/plain` | Plain text response |
| `image/jpeg`, `image/png` | Image serve করলে |
| `application/pdf` | PDF file |
| `application/octet-stream` | File download force করতে |

> **মনে রাখো:** Request-এ `Content-Type` বলে "আমি কী পাঠাচ্ছি", Response-এ `Content-Type` বলে "আমি কী ফেরত দিচ্ছি"।

### Content-Length

Response body-র **size** (bytes-এ)।

```http
Content-Length: 2048
```

Client জানে কত data আসবে — progress bar দেখাতে পারে, download complete হয়েছে কিনা বুঝতে পারে।

### Content-Encoding

Response body **compress** করা হয়েছে কিনা।

```http
Content-Encoding: gzip       ← Gzip compression
Content-Encoding: br         ← Brotli compression (আরো ভালো)
Content-Encoding: deflate    ← Deflate compression
```

```
Without compression:
Server → 500KB response → Client

With gzip:
Server → compress → 100KB response → Client → decompress → 500KB
                    (৮০% bandwidth বাঁচলো!)
```

> Client `Accept-Encoding: gzip, br` পাঠায়, server দেখে কোনটা দিয়ে compress করবে।

### Content-Disposition

Browser-কে বলে — data **display করবে নাকি download করবে**।

```http
Content-Disposition: inline                              ← Browser-এ দেখাও
Content-Disposition: attachment                          ← Download করো
Content-Disposition: attachment; filename="report.pdf"   ← এই নামে download করো
```

```
inline:     Browser-এ PDF/image সরাসরি দেখায়
attachment: "Save As" dialog আসে, file download হয়

API response:
GET /api/reports/download
→ Content-Disposition: attachment; filename="sales-2026.pdf"
→ Browser automatically download শুরু করে
```

### Content-Language

Response **কোন ভাষায়** আছে।

```http
Content-Language: bn          ← বাংলা
Content-Language: en-US       ← American English
```

---

## Caching Headers

Caching হলো performance-এর সবচেয়ে বড় হাতিয়ার। এই headers ঠিকভাবে ব্যবহার করলে website অনেক দ্রুত হয়।

### Cache-Control

সবচেয়ে গুরুত্বপূর্ণ caching header। Browser/proxy **কীভাবে cache করবে** তা সম্পূর্ণ নিয়ন্ত্রণ করে।

```http
Cache-Control: public, max-age=86400       ← যেকেউ cache করতে পারে, ২৪ ঘণ্টা
Cache-Control: private, max-age=3600       ← শুধু browser cache করবে, ১ ঘণ্টা
Cache-Control: no-cache                    ← cache আছে, কিন্তু প্রতিবার server-এ validate করো
Cache-Control: no-store                    ← কিছুই cache করো না
Cache-Control: max-age=0, must-revalidate  ← সবসময় server-এ check করো
```

**Directive গুলো বিস্তারিত:**

| Directive | মানে |
|-----------|------|
| `public` | যেকেউ cache করতে পারে (CDN, proxy, browser) |
| `private` | শুধু browser cache করবে (user-specific data) |
| `no-cache` | Cache রাখো কিন্তু use করার আগে server-এ validate করো |
| `no-store` | একেবারে cache করো না (sensitive data) |
| `max-age=N` | N সেকেন্ড পর্যন্ত cache valid |
| `s-maxage=N` | Shared cache (CDN/proxy) এর জন্য max-age |
| `must-revalidate` | Expired হলে অবশ্যই server-এ check করতে হবে |
| `immutable` | Content কখনো বদলাবে না (versioned assets) |

**বাস্তব উদাহরণ:**

```http
HTML page:      Cache-Control: no-cache
                (সবসময় server-এ check করো — content বদলাতে পারে)

CSS/JS (v2.1):  Cache-Control: public, max-age=31536000, immutable
                (১ বছর cache করো — filename-এ version আছে, বদলাবে না)

API response:   Cache-Control: private, max-age=60
                (শুধু browser-এ ১ মিনিট cache করো)

Bank data:      Cache-Control: no-store
                (কিছুই cache করো না!)
```

### ETag (Entity Tag)

Resource-এর একটা **unique fingerprint/version**। Cache validation-এ ব্যবহৃত হয়।

```http
ETag: "abc123xyz"
ETag: W/"abc123"          ← Weak ETag (approximate match)
```

**ETag কীভাবে কাজ করে:**

```
প্রথম request:
Client → GET /api/users
Server → 200 OK + ETag: "v5" + [data]
(Client data ও ETag cache করে রাখে)

পরের request:
Client → GET /api/users + If-None-Match: "v5"

যদি data একই:
Server → 304 Not Modified (body পাঠায় না! bandwidth বাঁচে)

যদি data বদলেছে:
Server → 200 OK + ETag: "v6" + [নতুন data]
```

```
ETag ছাড়া:  প্রতিবার 200 OK + পুরো data (500KB)
ETag দিয়ে:  304 Not Modified + কোনো data নেই (~100 bytes)
             → bandwidth ৯৯% বাঁচে!
```

### Expires

Cache **কখন expire** হবে তার তারিখ।

```http
Expires: Wed, 18 Feb 2026 22:00:00 GMT
```

> `Cache-Control: max-age` থাকলে `Expires` ignore হয়। `max-age` বেশি reliable।

### Last-Modified

Resource **শেষবার কখন পরিবর্তন** হয়েছে।

```http
Last-Modified: Tue, 17 Feb 2026 15:30:00 GMT
```

Client পরে `If-Modified-Since` header দিয়ে check করতে পারে resource বদলেছে কিনা।

### Vary

**কোন request header-এর উপর** ভিত্তি করে cache আলাদা করবে।

```http
Vary: Accept-Encoding          ← gzip ও non-gzip version আলাদা cache
Vary: Accept-Language          ← ভাষা অনুযায়ী আলাদা cache
Vary: Accept-Encoding, Accept-Language
```

```
একই URL কিন্তু ভিন্ন cache:

GET /api/data + Accept-Encoding: gzip    → Cache A (compressed)
GET /api/data + Accept-Encoding: br      → Cache B (brotli)
GET /api/data (no encoding)              → Cache C (raw)

Vary: Accept-Encoding বলে proxy-কে: "encoding অনুযায়ী আলাদা cache রাখো"
```

---

## Security Headers

Backend developer হিসেবে এগুলো জানা **অত্যন্ত গুরুত্বপূর্ণ**।

### CORS Headers

Browser যখন **ভিন্ন domain-এ** request পাঠায়, server এই headers দিয়ে permission দেয়।

```http
Access-Control-Allow-Origin: https://frontend.com       ← এই domain allow
Access-Control-Allow-Origin: *                           ← সব domain allow
Access-Control-Allow-Methods: GET, POST, PUT, DELETE     ← এই methods allow
Access-Control-Allow-Headers: Content-Type, Authorization ← এই headers allow
Access-Control-Allow-Credentials: true                   ← Cookie পাঠাতে পারবে
Access-Control-Max-Age: 86400                            ← Preflight cache ২৪ ঘণ্টা
Access-Control-Expose-Headers: X-Request-ID              ← JS থেকে এই header পড়তে পারবে
```

**CORS flow:**

```
frontend.com → api.example.com

Preflight:
Browser → OPTIONS /api/users + Origin: https://frontend.com
Server  ← Access-Control-Allow-Origin: https://frontend.com
          Access-Control-Allow-Methods: GET, POST

Actual request:
Browser → POST /api/users + Origin: https://frontend.com
Server  ← Access-Control-Allow-Origin: https://frontend.com
          + response data
```

**CORS ভুল করলে browser-এ দেখায়:**
```
Access to fetch at 'https://api.example.com/users' from origin
'https://frontend.com' has been blocked by CORS policy
```

### Strict-Transport-Security (HSTS)

Browser-কে বলে — এই site **সবসময় HTTPS** ব্যবহার করো। HTTP দিয়ে কখনো access করো না।

```http
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
```

```
max-age=31536000    → ১ বছর মনে রাখো
includeSubDomains   → সব subdomain-এও HTTPS
preload             → Browser-এর built-in HSTS list-এ যোগ হতে চাই
```

```
HSTS ছাড়া:
User types: http://bank.com → Server redirects → https://bank.com
                    ↑
          এই মুহূর্তে hacker attack করতে পারে!

HSTS দিয়ে:
User types: http://bank.com → Browser নিজেই → https://bank.com
                                  (server-এ HTTP request যায়ই না)
```

### Content-Security-Policy (CSP)

Browser-কে বলে — **কোন source থেকে** resource (script, image, style) load করা যাবে। XSS attack প্রতিরোধে খুব কার্যকর।

```http
Content-Security-Policy: default-src 'self'; script-src 'self' https://cdn.example.com; img-src *; style-src 'self' 'unsafe-inline'
```

```
default-src 'self'                    → নিজের domain ছাড়া কিছু load করো না
script-src 'self' https://cdn.com     → Script শুধু নিজের domain ও CDN থেকে
img-src *                             → Image যেকোনো জায়গা থেকে চলবে
style-src 'self' 'unsafe-inline'      → CSS নিজের domain + inline style allow

Hacker inject করলো: <script src="https://evil.com/steal.js">
→ CSP block করবে! কারণ evil.com allowed source না
```

### X-Content-Type-Options

Browser-কে বলে — Content-Type **sniffing করো না**, যা বলা আছে তা-ই মানো।

```http
X-Content-Type-Options: nosniff
```

```
nosniff ছাড়া:
Server বলল Content-Type: text/plain
কিন্তু browser দেখলো HTML আছে → HTML হিসেবে render করলো → XSS attack!

nosniff দিয়ে:
Server বলল Content-Type: text/plain
Browser: "ঠিক আছে, plain text হিসেবেই দেখাবো" → নিরাপদ!
```

### X-Frame-Options

**অন্য site তোমার page কে iframe-এ** দেখাতে পারবে কিনা। Clickjacking attack প্রতিরোধ করে।

```http
X-Frame-Options: DENY               ← কেউ iframe-এ দেখাতে পারবে না
X-Frame-Options: SAMEORIGIN          ← শুধু নিজের domain iframe করতে পারবে
```

```
Clickjacking attack:
Hacker একটা invisible iframe-এ তোমার bank site রাখে।
User মনে করে game খেলছে কিন্তু আসলে bank-এ "Transfer" button click করছে!

X-Frame-Options: DENY → iframe-এ load হবে না → attack fail
```

### X-XSS-Protection

Browser-এর built-in **XSS filter** চালু/বন্ধ করে।

```http
X-XSS-Protection: 1; mode=block
```

> Note: আধুনিক browser-এ CSP বেশি effective। এটি legacy support-এর জন্য রাখা হয়।

### Referrer-Policy

Browser **কতটুকু Referer information** পাঠাবে পরের request-এ।

```http
Referrer-Policy: no-referrer                    ← Referer পাঠাবে না
Referrer-Policy: same-origin                    ← শুধু নিজের domain-এ পাঠাবে
Referrer-Policy: strict-origin-when-cross-origin ← Cross-origin-এ শুধু domain পাঠাবে (recommended)
```

```
strict-origin-when-cross-origin:
Same-origin:  Referer: https://example.com/page/details?user=123 (পুরো URL)
Cross-origin: Referer: https://example.com (শুধু origin, path/query বাদ)
```

### Permissions-Policy

Browser **কোন কোন feature** (camera, microphone, geolocation) ব্যবহার করতে পারবে তা নিয়ন্ত্রণ করে।

```http
Permissions-Policy: camera=(), microphone=(), geolocation=(self)
```

```
camera=()              → Camera access বন্ধ (কেউ পাবে না)
microphone=()          → Microphone বন্ধ
geolocation=(self)     → শুধু নিজের domain location access পাবে
```

---

## Cookie Headers

### Set-Cookie

Server **browser-এ cookie সেট** করে। Browser পরবর্তী সব request-এ এই cookie পাঠাবে।

```http
Set-Cookie: session_id=abc123; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=86400
```

**Cookie attributes:**

| Attribute | কাজ |
|-----------|-----|
| `Path=/` | কোন URL path-এ cookie পাঠাবে |
| `Domain=.example.com` | কোন domain-এ cookie valid |
| `Max-Age=86400` | কত সেকেন্ড পর expire (২৪ ঘণ্টা) |
| `Expires=date` | নির্দিষ্ট তারিখে expire |
| `HttpOnly` | JavaScript দিয়ে access করা যাবে না (XSS protection) |
| `Secure` | শুধু HTTPS-এ পাঠাবে |
| `SameSite=Strict` | Cross-site request-এ পাঠাবে না (CSRF protection) |
| `SameSite=Lax` | কিছু cross-site request-এ পাঠাবে (navigation) |
| `SameSite=None` | সব cross-site request-এ পাঠাবে (Secure লাগবে) |

**SameSite explained:**

```
Strict:
User: evil.com-এ আছে → evil.com bank.com-এ request পাঠায়
→ Cookie পাঠাবে না (safe!)

Lax:
User: evil.com-এর link click করে bank.com-এ যায়
→ Cookie পাঠাবে (navigation allowed)
কিন্তু evil.com POST request পাঠালে → Cookie পাঠাবে না

None + Secure:
সবসময় পাঠাবে (third-party cookie, HTTPS-এ)
```

---

## Redirect Headers

### Location

**কোন URL-এ redirect** করবে। 3xx status code-এর সাথে ব্যবহৃত হয়।

```http
HTTP/1.1 301 Moved Permanently
Location: https://example.com/new-page

HTTP/1.1 302 Found
Location: /login

HTTP/1.1 201 Created
Location: /api/users/42        ← নতুন resource-এর URL
```

---

## Server Info Headers

### Server

Server **কোন software** ব্যবহার করছে।

```http
Server: nginx/1.24.0
Server: Apache/2.4.57
Server: cloudflare
```

> **Security tip:** Production-এ Server header লুকানো ভালো — hacker server version জেনে vulnerability খুঁজতে পারে।

### X-Powered-By

Server-এর **backend technology**।

```http
X-Powered-By: Express
X-Powered-By: PHP/8.2
X-Powered-By: Django
```

> **Security tip:** এটি **সবসময় disable** করুন production-এ!

```javascript
// Express.js-এ disable করা:
app.disable('x-powered-by');
```

---

## Rate Limiting Headers

API-তে rate limit থাকলে এই headers client-কে জানায়।

```http
X-RateLimit-Limit: 100              ← মোট কত request করতে পারবে (per window)
X-RateLimit-Remaining: 73           ← আর কত request বাকি
X-RateLimit-Reset: 1708300800       ← কখন reset হবে (Unix timestamp)
Retry-After: 60                     ← কত সেকেন্ড পর retry করবে (429-এর সাথে)
```

```
প্রথম request:
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 99

...অনেক request পরে...

X-RateLimit-Limit: 100
X-RateLimit-Remaining: 0
→ 429 Too Many Requests
→ Retry-After: 45
```

---

## অন্যান্য গুরুত্বপূর্ণ Headers

### Date

Response **কখন generate** হয়েছে।

```http
Date: Wed, 18 Feb 2026 14:30:00 GMT
```

### Transfer-Encoding

Response body **কীভাবে transfer** হচ্ছে।

```http
Transfer-Encoding: chunked
```

```
Chunked response (streaming):
Server data তৈরি হওয়ার সাথে সাথে টুকরো টুকরো পাঠায়:

5\r\n
Hello\r\n
6\r\n
 World\r\n
0\r\n
\r\n

→ "Hello World"

কখন দরকার: বড় data, real-time streaming, server-sent events
```

### WWW-Authenticate

**401 Unauthorized** response-এর সাথে ব্যবহৃত হয়। Client-কে বলে কোন authentication scheme ব্যবহার করতে হবে।

```http
HTTP/1.1 401 Unauthorized
WWW-Authenticate: Bearer realm="api"
WWW-Authenticate: Basic realm="Admin Area"
```

### Allow

**405 Method Not Allowed** response-এর সাথে ব্যবহৃত হয়। কোন methods allowed তা বলে।

```http
HTTP/1.1 405 Method Not Allowed
Allow: GET, POST, HEAD
```

---

## সব Response Headers এক নজরে

| Header | কাজ | উদাহরণ |
|--------|-----|--------|
| Content-Type | Response format | `application/json` |
| Content-Length | Body size | `2048` |
| Content-Encoding | Compression | `gzip` |
| Content-Disposition | Display/download | `attachment; filename="file.pdf"` |
| Cache-Control | Cache নিয়ন্ত্রণ | `public, max-age=3600` |
| ETag | Resource version | `"abc123"` |
| Last-Modified | শেষ পরিবর্তন | `Tue, 17 Feb 2026 15:30:00 GMT` |
| Set-Cookie | Cookie সেট | `session_id=abc; HttpOnly; Secure` |
| Location | Redirect URL | `/new-page` |
| Access-Control-Allow-Origin | CORS allow | `https://frontend.com` |
| Strict-Transport-Security | HTTPS force | `max-age=31536000` |
| Content-Security-Policy | Resource policy | `default-src 'self'` |
| X-Content-Type-Options | Type sniffing বন্ধ | `nosniff` |
| X-Frame-Options | iframe নিয়ন্ত্রণ | `DENY` |
| Retry-After | Rate limit wait | `60` |
| Server | Server software | `nginx` |

---

## Recommended Security Headers (Production Checklist)

প্রতিটি production API/website-এ এই headers থাকা উচিত:

```http
Strict-Transport-Security: max-age=31536000; includeSubDomains
Content-Security-Policy: default-src 'self'
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=()
```

এবং এগুলো **remove** করুন:

```
Server: nginx/1.24.0           ← version লুকান
X-Powered-By: Express          ← পুরো header remove করুন
```

---

## Interview Golden Lines

> **Cache-Control is the king of caching — ETag is its validator.**

> **Set-Cookie with HttpOnly prevents XSS. SameSite=Strict prevents CSRF.**

> **HSTS forces HTTPS at the browser level — no HTTP request ever reaches the server.**

> **CSP is the strongest defense against XSS — it controls what the browser can load.**

> **Always hide Server and X-Powered-By headers in production — security through obscurity helps.**
