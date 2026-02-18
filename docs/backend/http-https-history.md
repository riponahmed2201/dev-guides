# HTTP এবং HTTPS এর ইতিহাস

## প্রথমে বুঝি — Internet কীভাবে শুরু হয়েছিল?

১৯৬০-এর দশকে আমেরিকার military একটা network তৈরি করে — **ARPANET**। সেটাই পরে Internet-এ পরিণত হয়। কিন্তু তখন web browser, website — কিছুই ছিল না। শুধু computers একে অপরের সাথে data share করত।

তারপর এলেন একজন মানুষ — যিনি পুরো দুনিয়া বদলে দিলেন।

---

## Tim Berners-Lee — WWW-এর জনক

**১৯৮৯ সাল।** Switzerland-এর CERN laboratory-তে কাজ করতেন **Tim Berners-Lee**। তিনি দেখলেন — scientists-রা একে অপরের সাথে documents share করতে পারছে না সহজে।

তিনি একটা proposal লিখলেন — **"Information Management: A Proposal"**

এই proposal থেকেই জন্ম নিল তিনটি জিনিস:

- **HTML** — webpage বানানোর ভাষা
- **URL** — webpage-এর address
- **HTTP** — webpage পাঠানোর নিয়ম

---

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

```http
GET /index.html
```

রেসপন্সে শুধু HTML কন্টেন্ট আসতো:

```html
<html>
  <body>Hello World</body>
</html>
```

> এত simple ছিল যে এটাকে বলা হত **"The One-Line Protocol"**

**সীমাবদ্ধতা:** শুধু HTML পাঠাতে পারত। Image, CSS — কিছুই না।

---

### HTTP/1.0 (১৯৯৬) — RFC 1945

এটি HTTP এর প্রথম আনুষ্ঠানিক ভার্সন। এখানে অনেক নতুন ফিচার যুক্ত করা হয়।

**নতুন ফিচার:**

- **HTTP Headers** যুক্ত হলো (request ও response উভয়ে)
- **Status Codes** চালু হলো (200, 404, 500 ইত্যাদি)
- **Content-Type** header — HTML ছাড়াও অন্যান্য ফাইল (image, CSS, JS) পাঠানো সম্ভব হলো
- `POST` এবং `HEAD` মেথড যুক্ত হলো
- HTTP versioning চালু হলো (`HTTP/1.0`)

```http
GET /index.html HTTP/1.0
User-Agent: Mozilla/1.0

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

একসাথে multiple request পাঠানো যায় (response-এর জন্য অপেক্ষা না করেই):

```
──► GET /page.html
──► GET /style.css
──► GET /app.js
◄── Response /page.html
◄── Response /style.css
◄── Response /app.js
```

#### 3. নতুন HTTP Methods

`PUT`, `DELETE`, `OPTIONS`, `PATCH`, `TRACE` method যুক্ত হলো।

#### 4. Host Header (বাধ্যতামূলক)

একই IP-তে একাধিক ওয়েবসাইট হোস্ট করা সম্ভব হলো (Virtual Hosting):

```http
GET /page HTTP/1.1
Host: www.example.com
```

#### 5. অন্যান্য ফিচার

- **Chunked Transfer Encoding** — বড় ফাইল টুকরো টুকরো করে পাঠানো
- **Cache Control** — browser-এ data cache করা
- **Content Negotiation** — client বলতে পারে কোন format-এ data চায়

> ২০১৫ সাল পর্যন্ত প্রায় সব internet HTTP/1.1-এ চলেছে!

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
HTTP/1.1: [Req1] → [Res1] → [Req2] → [Res2]  (একটার পর একটা)

HTTP/2:
      ┌─── Stream 1: GET /page.html ──► Response
      │
TCP ──┼─── Stream 2: GET /style.css ──► Response   (সব একসাথে!)
      │
      └─── Stream 3: GET /app.js   ──► Response
```

#### 3. Header Compression (HPACK)

HTTP headers অনেক সময় repetitive হয়। HPACK algorithm ব্যবহার করে compress করা হয়:

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

> HTTP/2 ব্যবহারে website প্রায় **৫০-৭০% দ্রুত** হয়ে যায়!

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

প্রতিটি stream-এর জন্য আলাদা congestion control। Packet loss হলেও বাকি data চলতে থাকে।

> Google, Facebook, YouTube — সবাই HTTP/3 ব্যবহার করছে।


---

## HTTP ভার্সনগুলোর তুলনা

| বৈশিষ্ট্য | HTTP/0.9 | HTTP/1.0 | HTTP/1.1 | HTTP/2 | HTTP/3 |
|---|---|---|---|---|---|
| সাল | ১৯৯১ | ১৯৯৬ | ১৯৯৭ | ২০১৫ | ২০২২ |
| Transport | TCP | TCP | TCP | TCP | QUIC (UDP) |
| Connection | প্রতিবার নতুন | প্রতিবার নতুন | Persistent | Persistent | Persistent |
| Methods | GET | GET, POST, HEAD | + PUT, DELETE, PATCH | সব | সব |
| Headers | ❌ | ✅ | ✅ | ✅ (HPACK) | ✅ (QPACK) |
| Multiplexing | ❌ | ❌ | ❌ | ✅ | ✅ |
| Server Push | ❌ | ❌ | ❌ | ✅ | ✅ |
| Encryption | ❌ | ❌ | ❌ | ঐচ্ছিক | বাধ্যতামূলক |
| HOL Blocking | N/A | N/A | ✅ সমস্যা | TCP লেভেলে | ❌ সমাধান |

---

## HTTP-এর বড় সমস্যা — Security নেই

HTTP-তে সব data **plain text**-এ যায়। মানে কেউ মাঝখানে বসে (Man-in-the-Middle Attack) সব পড়তে পারে:

```
তুমি Bank-এ password দিলে:
HTTP:  password=12345  ← সবাই দেখতে পাচ্ছে!
HTTPS: x7#kL9@mQ2...  ← encrypted, কেউ বুঝবে না
```

Hacker সহজেই দেখতে পারে — Username, Password, Card info। Open WiFi-তে আরও বিপদ!

এই সমস্যা সমাধানের জন্যই এলো **HTTPS**।

---

## HTTPS কী?

**HTTPS = HTTP + Encryption**

HTTPS হলো HTTP-এর নিরাপদ সংস্করণ। এটি ডেটা আদান-প্রদানের সময় **SSL/TLS** encryption ব্যবহার করে।

```
HTTP:   Client ──── Plain Text ────► Server    (যে কেউ পড়তে পারে)
HTTPS:  Client ──── Encrypted  ────► Server    (শুধু Client ও Server পড়তে পারে)
```

---

## HTTPS / SSL / TLS এর ইতিহাস

### SSL — ১৯৯৪ (শুরু)

**Netscape** company ১৯৯৪ সালে তৈরি করে **SSL (Secure Sockets Layer)**:

- **SSL 1.0** — কখনো release-ই হয়নি, অনেক bug ছিল।
- **SSL 2.0 — ১৯৯৫** — প্রথম public release, কিন্তু serious security flaw ছিল।
- **SSL 3.0 — ১৯৯৬** — অনেক ভালো হলো। এটাই HTTPS-এর ভিত্তি তৈরি করল।

এই সময় **Netscape** প্রথম **HTTPS** implement করে। URL-এ **https://** দেখা গেল প্রথমবারের মতো।

### TLS — ১৯৯৯ (SSL-এর উত্তরসূরি)

**IETF (Internet Engineering Task Force)** SSL-কে নিয়ে আরো উন্নত করল — নাম দিল **TLS (Transport Layer Security)**।

| Version | সাল | RFC | অবস্থা |
|---------|-----|-----|--------|
| SSL 1.0 | 1994 | — | ❌ কখনো release হয়নি |
| SSL 2.0 | 1995 | — | ❌ Deprecated |
| SSL 3.0 | 1996 | — | ❌ Deprecated (POODLE attack) |
| TLS 1.0 | 1999 | RFC 2246 | ❌ Deprecated |
| TLS 1.1 | 2006 | RFC 4346 | ❌ Deprecated |
| TLS 1.2 | 2008 | RFC 5246 | ✅ এখনো চলছে |
| TLS 1.3 | 2018 | RFC 8446 | ✅ সর্বোত্তম |

**TLS 1.3 এর বিশেষত্ব:**

- Handshake অনেক দ্রুত (1-RTT, এমনকি 0-RTT)
- পুরনো এবং অনিরাপদ cipher suites বাদ দেওয়া হলো
- Forward Secrecy বাধ্যতামূলক
- বর্তমানে সবচেয়ে নিরাপদ version

> **মনে রাখো:** আমরা বলি "SSL Certificate" কিন্তু আসলে এখন সবাই **TLS** ব্যবহার করে। SSL নামটা historically থেকে গেছে।

---

## HTTPS কীভাবে কাজ করে? (TLS Handshake)

```
Client (Browser)                          Server
      |                                      |
      |── 1. "Hello, TLS 1.3 চাই" ─────────►|
      |                                      |
      |◄── 2. Certificate + Public Key ──────|
      |                                      |
      |   3. [Certificate যাচাই করে]         |
      |                                      |
      |── 4. Encrypted Session Key ─────────►|
      |                                      |
      |   5. [দুজনেই Session Key জানে]       |
      |                                      |
      |◄════ Encrypted Data ════════════════►|
```

**ধাপে ধাপে ব্যাখ্যা:**

1. **ClientHello**: Client server-কে বলে সে কোন কোন encryption method support করে
2. **ServerHello**: Server একটি cipher বেছে নেয় এবং তার SSL Certificate পাঠায়
3. **Certificate Verification**: Client যাচাই করে certificate টি বিশ্বস্ত CA থেকে এসেছে কিনা
4. **Key Exchange**: Client একটি pre-master secret তৈরি করে এবং server-এর public key দিয়ে encrypt করে পাঠায়
5. **Session Keys**: উভয় পক্ষ একই session key তৈরি করে — এরপর সব data এই key দিয়ে encrypt হয়

---

## SSL Certificate কী?

একটা **digital পরিচয়পত্র** — যা প্রমাণ করে website-টা আসল।

**Certificate দেয় কে?** — **CA (Certificate Authority)**

- DigiCert
- Let's Encrypt (free!)
- Comodo
- GlobalSign

**Certificate-এ কী থাকে:**

- Website-এর domain name
- Certificate-এর মেয়াদ
- Public key
- CA-এর digital signature

---

## HTTP vs HTTPS পার্থক্য

| বিষয় | HTTP | HTTPS |
|------|------|-------|
| Full Form | HyperText Transfer Protocol | HyperText Transfer Protocol Secure |
| Port | 80 | 443 |
| Encryption | ❌ নেই | ✅ TLS/SSL দিয়ে encrypted |
| Data | Plain text | Encrypted |
| Certificate | লাগে না | SSL/TLS Certificate লাগে |
| Speed | একটু দ্রুত | সামান্য slow (পার্থক্য নগণ্য) |
| SEO | Google rank কম দেয় | Google rank বেশি দেয় |
| Browser | "Not Secure" দেখায় | Padlock icon দেখায় |
| Data Integrity | ❌ tamper হতে পারে | ✅ tamper-proof |
| ব্যবহার | প্রায় obsolete | সব আধুনিক site |

---

## HTTPS কেন এখন বাধ্যতামূলক?

**২০১৪** — Google ঘোষণা করল HTTPS site-কে SEO-তে ranking boost দেবে।

**২০১৭** — Chrome browser HTTP site-কে **"Not Secure"** দেখানো শুরু করল।

**২০১৮** — Chrome HTTP site-কে **লাল রঙে "Not Secure"** দেখাতে লাগল।

**আজ** — HTTPS ছাড়া কোনো website professional বলেই বিবেচিত হয় না।

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

## Interview Golden Line

> **HTTP was designed for simplicity, HTTPS was designed for trust.**

HTTP দিয়ে শুরু হয়েছিল শুধু document share করার জন্য — আজ সেটাই পুরো internet-এর মেরুদণ্ড।
