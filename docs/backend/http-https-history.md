# HTTP/HTTPS এর ইতিহাস

## HTTP কী?

**HTTP (HyperText Transfer Protocol)** হলো একটি অ্যাপ্লিকেশন লেয়ার প্রোটোকল যা ওয়েবে ডেটা আদান-প্রদানের জন্য ব্যবহৃত হয়। যখন আপনি ব্রাউজারে কোনো ওয়েবসাইট ভিজিট করেন, তখন ব্রাউজার (client) এবং সার্ভারের মধ্যে HTTP প্রোটোকলের মাধ্যমে যোগাযোগ হয়।

```
Client (Browser)  ──── HTTP Request ────►  Server
                  ◄─── HTTP Response ────
```

## HTTP এর ইতিহাস (Timeline)

### HTTP/0.9 (১৯৯১) — "The One-Line Protocol"

Tim Berners-Lee ১৯৮৯ সালে CERN-এ ওয়ার্ল্ড ওয়াইড ওয়েব তৈরি করেন এবং ১৯৯১ সালে HTTP এর প্রথম ভার্সন রিলিজ হয়।

**বৈশিষ্ট্য:**
- শুধুমাত্র `GET` মেথড সাপোর্ট করতো
- কোনো HTTP header ছিল না
- শুধুমাত্র HTML ফাইল ট্রান্সফার করা যেতো
- কোনো status code ছিল না

```
GET /index.html
```

রেসপন্সে শুধু HTML কন্টেন্ট আসতো:

```html
<html>
  <body>Hello World</body>
</html>
```

---

### HTTP/1.0 (১৯৯৬) — RFC 1945

এটি HTTP এর প্রথম আনুষ্ঠানিক ভার্সন। এখানে অনেক নতুন ফিচার যুক্ত করা হয়।

**নতুন ফিচার:**
- **HTTP Headers** যুক্ত হলো (request ও response উভয়ে)
- **Status Codes** চালু হলো (200, 404, 500 ইত্যাদি)
- **Content-Type** header — HTML ছাড়াও অন্যান্য ফাইল (image, CSS, JS) পাঠানো সম্ভব হলো
- `POST` এবং `HEAD` মেথড যুক্ত হলো
- HTTP versioning চালু হলো (`HTTP/1.0`)

```
GET /index.html HTTP/1.0
Host: www.example.com
User-Agent: Mozilla/5.0

---

HTTP/1.0 200 OK
Content-Type: text/html
Content-Length: 1234

<html>...</html>
```

**সমস্যা:**
- প্রতিটি request-এ নতুন TCP connection খুলতে হতো
- একটি response পাওয়ার পর connection বন্ধ হয়ে যেতো
- একটি পেজে ১০টি resource থাকলে ১০টি আলাদা connection লাগতো — এটি ছিল অত্যন্ত ধীর

```
Connection 1: GET /index.html   → Response → Connection বন্ধ
Connection 2: GET /style.css    → Response → Connection বন্ধ
Connection 3: GET /script.js    → Response → Connection বন্ধ
Connection 4: GET /logo.png     → Response → Connection বন্ধ
```

---

### HTTP/1.1 (১৯৯৭) — RFC 2068, পরে RFC 2616

এটি সবচেয়ে বেশি ব্যবহৃত ভার্সন ছিল এবং প্রায় ১৫+ বছর ধরে ওয়েবের মূল ভিত্তি হিসেবে কাজ করেছে।

**প্রধান উন্নতি:**

#### 1. Persistent Connection (Keep-Alive)
একটি TCP connection-এ একাধিক request-response পাঠানো যায়:

```
Connection 1: GET /index.html → Response
              GET /style.css  → Response
              GET /script.js  → Response
              GET /logo.png   → Response
```

#### 2. Pipelining
একাধিক request একসাথে পাঠানো যায় (response-এর জন্য অপেক্ষা না করেই):

```
──► GET /page.html
──► GET /style.css
──► GET /app.js
◄── Response /page.html
◄── Response /style.css
◄── Response /app.js
```

#### 3. নতুন HTTP Methods
`PUT`, `PATCH`, `DELETE`, `OPTIONS`, `TRACE` মেথড যুক্ত হলো।

#### 4. Host Header (বাধ্যতামূলক)
একই IP-তে একাধিক ওয়েবসাইট হোস্ট করা সম্ভব হলো (Virtual Hosting):

```
GET /index.html HTTP/1.1
Host: www.example.com
```

#### 5. অন্যান্য ফিচার
- **Chunked Transfer Encoding** — বড় ফাইল টুকরো টুকরো করে পাঠানো
- **Cache Control** — ক্যাশিং ব্যবস্থার উন্নতি
- **Content Negotiation** — ক্লায়েন্ট বলতে পারে কোন ফরম্যাটে ডেটা চায়

**সমস্যা — Head-of-Line (HOL) Blocking:**

Pipelining-এ একটি বড় সমস্যা ছিল। প্রথম request-এর response আসার আগে পরের request-এর response আসতে পারতো না:

```
Request 1 (বড় ফাইল) ──────────────────► Response 1 (দেরি হচ্ছে...)
Request 2 (ছোট ফাইল) ──────────────────► Response 2 (অপেক্ষা করছে!)
Request 3 (ছোট ফাইল) ──────────────────► Response 3 (অপেক্ষা করছে!)
```

---

### HTTP/2 (২০১৫) — RFC 7540

Google-এর SPDY প্রোটোকলের উপর ভিত্তি করে HTTP/2 তৈরি হয়। এটি performance-এর বিশাল উন্নতি এনেছে।

**প্রধান ফিচার:**

#### 1. Binary Protocol
HTTP/1.1 ছিল text-based, কিন্তু HTTP/2 হলো binary-based। এটি পার্সিং দ্রুত করে এবং error কমায়:

```
HTTP/1.1 (Text):     GET /index.html HTTP/1.1\r\nHost: example.com
HTTP/2 (Binary):     [Frame: HEADERS] [Stream ID: 1] [Encoded Headers]
```

#### 2. Multiplexing
একটি TCP connection-এ একাধিক request-response একই সময়ে (parallel) পাঠানো যায়। HOL Blocking সমস্যার সমাধান:

```
      ┌─── Stream 1: GET /page.html ──► Response
      │
TCP ──┼─── Stream 2: GET /style.css ──► Response   (সব একসাথে!)
      │
      └─── Stream 3: GET /app.js   ──► Response
```

#### 3. Header Compression (HPACK)
HTTP headers অনেক সময় repetitive হয়। HPACK algorithm ব্যবহার করে headers compress করা হয়:

```
প্রথম Request:  Host: example.com, Accept: text/html (পুরো header)
পরবর্তী Request: [Index 1], [Index 2]  (শুধু reference পাঠায়)
```

#### 4. Server Push
সার্ভার ক্লায়েন্টের request ছাড়াই প্রয়োজনীয় resource পাঠিয়ে দিতে পারে:

```
Client: GET /index.html
Server: এই নাও index.html
        + এই নাও style.css (তুমি এটাও লাগবে!)
        + এই নাও app.js (এটাও পাঠিয়ে দিলাম!)
```

#### 5. Stream Prioritization
কোন resource আগে পাঠানো হবে তা priority দিয়ে নির্ধারণ করা যায়।

**সীমাবদ্ধতা:**
- এখনো TCP-র উপর নির্ভরশীল — TCP লেভেলে HOL blocking থেকে যায়
- TCP packet loss হলে সব stream block হয়ে যায়

---

### HTTP/3 (২০২২) — RFC 9114

HTTP/3 হলো HTTP-র সর্বশেষ মেজর ভার্সন। এটি TCP-র পরিবর্তে **QUIC** (UDP-based) প্রোটোকল ব্যবহার করে।

**কেন TCP বাদ দেওয়া হলো?**

TCP-তে packet loss হলে পুরো connection block হয়ে যায়। QUIC-এ প্রতিটি stream স্বতন্ত্র, তাই একটি stream-এ সমস্যা হলে অন্যগুলো প্রভাবিত হয় না:

```
TCP (HTTP/2):
  Stream 1: ████░░░░ (packet lost → সব stream block!)
  Stream 2: ████████ (অপেক্ষা করছে)
  Stream 3: ██████   (অপেক্ষা করছে)

QUIC (HTTP/3):
  Stream 1: ████░░░░ (packet lost → শুধু এই stream affected)
  Stream 2: ████████ (চলতে থাকে!)
  Stream 3: ██████   (চলতে থাকে!)
```

**প্রধান ফিচার:**

#### 1. QUIC Protocol (UDP-based)
- TCP-র মতো reliable কিন্তু UDP-র উপরে built
- Connection setup অনেক দ্রুত (0-RTT বা 1-RTT)

#### 2. দ্রুত Connection Setup

```
TCP + TLS (HTTP/2):
  Client ──► SYN
  Client ◄── SYN-ACK
  Client ──► ACK
  Client ──► ClientHello (TLS)         ← মোট 3 RTT লাগে
  Client ◄── ServerHello (TLS)
  Client ──► Data

QUIC (HTTP/3):
  Client ──► Initial (Crypto + Data)   ← মাত্র 1 RTT (বা 0-RTT!)
  Client ◄── Handshake + Data
```

#### 3. Built-in Encryption
QUIC-এ TLS 1.3 built-in আছে — আলাদাভাবে TLS handshake করতে হয় না।

#### 4. Connection Migration
নেটওয়ার্ক পরিবর্তন হলেও (WiFi → Mobile Data) connection টিকে থাকে। TCP-তে এটি সম্ভব নয়।

#### 5. উন্নত Congestion Control
প্রতিটি stream-এর জন্য আলাদা congestion control।

---

## HTTP ভার্সনগুলোর তুলনা

| বৈশিষ্ট্য | HTTP/1.0 | HTTP/1.1 | HTTP/2 | HTTP/3 |
|---|---|---|---|---|
| সাল | ১৯৯৬ | ১৯৯৭ | ২০১৫ | ২০২২ |
| Transport | TCP | TCP | TCP | QUIC (UDP) |
| Connection | প্রতি request-এ নতুন | Persistent | Persistent | Persistent |
| Multiplexing | ❌ | ❌ | ✅ | ✅ |
| Header Compression | ❌ | ❌ | HPACK | QPACK |
| Server Push | ❌ | ❌ | ✅ | ✅ |
| Encryption | ❌ | ❌ | ঐচ্ছিক | বাধ্যতামূলক |
| HOL Blocking | N/A | ✅ সমস্যা | TCP লেভেলে | ❌ সমাধান |

---

## HTTPS কী?

**HTTPS (HyperText Transfer Protocol Secure)** হলো HTTP-র সুরক্ষিত সংস্করণ। এটি **SSL/TLS** encryption ব্যবহার করে ক্লায়েন্ট ও সার্ভারের মধ্যে ডেটা এনক্রিপ্ট করে পাঠায়।

```
HTTP:   Client ──── Plain Text ────► Server    (যে কেউ পড়তে পারে)
HTTPS:  Client ──── Encrypted  ────► Server    (শুধু Client ও Server পড়তে পারে)
```

## HTTPS এর ইতিহাস

### SSL 1.0 (১৯৯৪) — কখনো রিলিজ হয়নি
Netscape তৈরি করেছিল, কিন্তু গুরুতর নিরাপত্তা ত্রুটির কারণে প্রকাশ করা হয়নি।

### SSL 2.0 (১৯৯৫)
প্রথম publicly released version। তবে এতেও অনেক vulnerability ছিল।

### SSL 3.0 (১৯৯৬)
SSL 2.0 এর সমস্যাগুলো ঠিক করা হলো। বেশ কিছু বছর ব্যাপকভাবে ব্যবহৃত হয়েছিল।

### TLS 1.0 (১৯৯৯) — RFC 2246
SSL 3.0 এর উপর ভিত্তি করে তৈরি। নাম পরিবর্তন করে SSL থেকে **TLS (Transport Layer Security)** করা হলো।

### TLS 1.1 (২০০৬) — RFC 4346
CBC attack এর বিরুদ্ধে সুরক্ষা যুক্ত করা হলো।

### TLS 1.2 (২০০৮) — RFC 5246
SHA-256 সাপোর্ট, AEAD cipher suites যুক্ত হলো। দীর্ঘদিন ধরে সবচেয়ে বেশি ব্যবহৃত ভার্সন।

### TLS 1.3 (২০১৮) — RFC 8446
- Handshake অনেক দ্রুত হলো (1-RTT, এমনকি 0-RTT)
- পুরনো এবং অনিরাপদ cipher suites বাদ দেওয়া হলো
- Forward Secrecy বাধ্যতামূলক করা হলো
- বর্তমানে এটিই সবচেয়ে নিরাপদ ভার্সন

---

## HTTPS কীভাবে কাজ করে? (TLS Handshake)

```
Client                                          Server
  │                                                │
  │─── 1. ClientHello (supported ciphers) ────────►│
  │                                                │
  │◄── 2. ServerHello (chosen cipher + cert) ──────│
  │                                                │
  │    3. Client verifies certificate               │
  │       (CA chain of trust check)                 │
  │                                                │
  │─── 4. Key Exchange (Pre-master secret) ───────►│
  │                                                │
  │    5. Both derive session keys                  │
  │                                                │
  │◄──────── Encrypted Communication ─────────────►│
```

**ধাপে ধাপে ব্যাখ্যা:**

1. **ClientHello**: ক্লায়েন্ট সার্ভারকে বলে সে কোন কোন encryption method সাপোর্ট করে
2. **ServerHello**: সার্ভার একটি cipher বেছে নেয় এবং তার SSL Certificate পাঠায়
3. **Certificate Verification**: ক্লায়েন্ট যাচাই করে certificate টি বিশ্বস্ত CA (Certificate Authority) থেকে এসেছে কিনা
4. **Key Exchange**: ক্লায়েন্ট একটি pre-master secret তৈরি করে এবং সার্ভারের public key দিয়ে encrypt করে পাঠায়
5. **Session Keys**: উভয় পক্ষ একই session key তৈরি করে এবং এরপর সব ডেটা এই key দিয়ে encrypt হয়

---

## HTTP vs HTTPS

| বিষয় | HTTP | HTTPS |
|---|---|---|
| Port | 80 | 443 |
| Encryption | ❌ নেই | ✅ TLS/SSL |
| Certificate | লাগে না | SSL Certificate লাগে |
| URL | `http://` | `https://` |
| SEO | কম ranking | বেশি ranking (Google prefer করে) |
| Speed | সামান্য দ্রুত | সামান্য ধীর (encryption overhead) |
| Data Integrity | ❌ | ✅ tamper-proof |
| ব্যবহার | শুধু public/non-sensitive data | সব ধরনের ওয়েবসাইট |

---

## কেন HTTPS ব্যবহার করবেন?

### 1. Data Encryption (ডেটা এনক্রিপশন)
Man-in-the-Middle attack থেকে সুরক্ষা। কেউ মাঝখানে বসে ডেটা পড়তে পারবে না।

### 2. Data Integrity (ডেটার অখণ্ডতা)
ট্রান্সমিশনের সময় ডেটা পরিবর্তন করা সম্ভব নয়।

### 3. Authentication (প্রমাণীকরণ)
SSL Certificate প্রমাণ করে আপনি সঠিক সার্ভারের সাথে কথা বলছেন, কোনো ভুয়া সার্ভারের সাথে নয়।

### 4. SEO Benefit
Google ২০১৪ সাল থেকে HTTPS কে ranking signal হিসেবে ব্যবহার করে।

### 5. Browser Trust
আধুনিক ব্রাউজারগুলো HTTP সাইটে "Not Secure" সতর্কতা দেখায়।

---

## সারসংক্ষেপ

```
১৯৯১ ─── HTTP/0.9   ─── শুধু GET, কোনো header নেই
│
১৯৯৫ ─── SSL 2.0    ─── প্রথম encryption attempt
│
১৯৯৬ ─── HTTP/1.0   ─── Headers, Status codes, POST method
│
১৯৯৭ ─── HTTP/1.1   ─── Keep-alive, Pipelining, PUT/DELETE
│
১৯৯৯ ─── TLS 1.0    ─── SSL → TLS নামকরণ
│
২০০৮ ─── TLS 1.2    ─── SHA-256, AEAD ciphers
│
২০১৫ ─── HTTP/2     ─── Binary, Multiplexing, Server Push
│
২০১৮ ─── TLS 1.3    ─── দ্রুত handshake, Forward Secrecy
│
২০২২ ─── HTTP/3     ─── QUIC (UDP), 0-RTT, Connection Migration
```

ওয়েবের শুরু থেকে আজ পর্যন্ত HTTP/HTTPS অনেক বিবর্তনের মধ্য দিয়ে গেছে — সবসময় লক্ষ্য ছিল **দ্রুততা** এবং **নিরাপত্তা** বৃদ্ধি করা।
