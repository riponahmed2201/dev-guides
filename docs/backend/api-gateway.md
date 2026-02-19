# API Gateway (এপিআই গেটওয়ে)

## API Gateway কী?

**API Gateway** হলো client আর backend services-এর মাঝখানে বসে থাকা একটি **single entry point**। সব request আগে gateway-তে আসে, তারপর gateway সঠিক service-এ পাঠায়।

```
API Gateway ছাড়া:
Client → User Service
Client → Order Service
Client → Payment Service
Client → Notification Service
(Client-কে সব service-এর URL জানতে হয়!)

API Gateway দিয়ে:
Client → API Gateway → User Service
                     → Order Service
                     → Payment Service
                     → Notification Service
(Client শুধু gateway-এর URL জানে!)
```

> **বাস্তব উদাহরণ:** একটা বড় office-এ সবাই সরাসরি বিভিন্ন department-এ যায় না — **reception desk** দিয়ে যায়। API Gateway হলো সেই reception desk।

---

## কেন API Gateway দরকার?

### সমস্যা — Gateway ছাড়া

```
Mobile App
  ├── https://users.api.com/users/42         (User Service)
  ├── https://orders.api.com/orders?user=42   (Order Service)
  ├── https://payments.api.com/pay             (Payment Service)
  └── https://notify.api.com/notifications     (Notification Service)

সমস্যাগুলো:
❌ Client-কে ৪টা আলাদা URL জানতে হয়
❌ প্রতিটি service-এ আলাদাভাবে authentication করতে হয়
❌ CORS ৪টা service-এ configure করতে হয়
❌ Rate limiting আলাদাভাবে
❌ Service URL বদলালে সব client update লাগে
❌ Mobile-এ ৪টা connection = battery drain + slow
```

### সমাধান — Gateway দিয়ে

```
Mobile App
  └── https://api.example.com  (শুধু একটা URL!)
        ├── /users/42          → User Service
        ├── /orders?user=42    → Order Service
        ├── /pay               → Payment Service
        └── /notifications     → Notification Service

সুবিধা:
✅ Client শুধু একটা URL জানে
✅ Authentication একবারই gateway-তে
✅ CORS একজায়গায়
✅ Rate limiting centralized
✅ Backend service বদলালে client-এর কোনো পরিবর্তন লাগে না
```

---

## API Gateway-এর কাজ (Core Features)

### 1. Request Routing

Client-এর request সঠিক backend service-এ পাঠানো:

```
GET /api/users/*      → User Service (port 3001)
GET /api/orders/*     → Order Service (port 3002)
GET /api/products/*   → Product Service (port 3003)
POST /api/payments/*  → Payment Service (port 3004)
```

```
Path-based routing:
/api/v1/users   → users-service:3001
/api/v1/orders  → orders-service:3002

Header-based routing:
X-API-Version: 1 → v1-service
X-API-Version: 2 → v2-service

Method-based routing:
GET  /api/products → product-read-service
POST /api/products → product-write-service
```

### 2. Authentication ও Authorization

সব service-এ আলাদাভাবে auth check না করে **gateway-তে একবার** check:

```
Client → API Gateway → Auth Check → Backend Service
                ↑
         Token verify করে
         User info request-এ attach করে

Request flow:
1. Client: Authorization: Bearer eyJhbG...
2. Gateway: Token verify → User: { id: 42, role: "admin" }
3. Gateway: Request-এ X-User-ID: 42, X-User-Role: admin header যোগ করে
4. Backend service: Header দেখে user চেনে (নিজে token verify করতে হয় না!)
```

### 3. Rate Limiting

```
Rate limit rules:
- Free tier:    100 requests/minute
- Pro tier:     1000 requests/minute
- Enterprise:   10000 requests/minute

Client → Gateway → Check rate limit → Allowed? → Backend
                                    → Exceeded? → 429 Too Many Requests
```

```
Per-user rate limit:
User A: 95/100 remaining
User B: 450/1000 remaining

Per-IP rate limit:
IP 203.0.113.50: 80/100 remaining

Per-endpoint rate limit:
POST /api/orders: 10 requests/minute (expensive operation)
GET /api/products: 1000 requests/minute (cheap read)
```

### 4. Load Balancing

একাধিক service instance-এ request distribute করা:

```
Gateway → Round Robin:
  Request 1 → User Service (Instance 1)
  Request 2 → User Service (Instance 2)
  Request 3 → User Service (Instance 3)
  Request 4 → User Service (Instance 1)  ← আবার ঘুরে এলো
```

```
Strategies:
Round Robin:    ঘুরে ঘুরে সবাইকে দেয়
Least Connection: সবচেয়ে কম busy instance-কে দেয়
Weighted:       শক্তিশালী server-কে বেশি দেয়
IP Hash:        একই user সবসময় একই instance-এ (sticky)
```

### 5. Request/Response Transformation

Client-এর request বা backend-এর response **পরিবর্তন** করা:

```
Request transformation:
Client পাঠায়:  { "userName": "Ripon" }         (camelCase)
Gateway বদলায়: { "user_name": "Ripon" }         (snake_case)
Backend পায়:   { "user_name": "Ripon" }

Response transformation:
Backend দেয়:   { "user_name": "Ripon", "internal_id": "xyz" }
Gateway বদলায়: { "userName": "Ripon" }           (internal field সরিয়ে দিলো)
Client পায়:   { "userName": "Ripon" }
```

### 6. Response Aggregation (BFF Pattern)

একটি client request-এ **একাধিক service** call করে combined response দেওয়া:

```
Client: GET /api/dashboard

Gateway internally:
  → User Service:    GET /users/42          → { name: "Ripon" }
  → Order Service:   GET /orders?user=42    → [ order1, order2 ]
  → Stats Service:   GET /stats/42          → { total_orders: 25 }

Gateway combines:
{
  "user": { "name": "Ripon" },
  "recent_orders": [ order1, order2 ],
  "stats": { "total_orders": 25 }
}

→ Client-এর ১টা request-এ ৩টা service-এর data একসাথে!
```

### 7. Caching

Frequently requested data gateway-তে cache রাখা:

```
প্রথম request:
Client → Gateway → Backend → Response → Gateway cache করলো → Client

পরের request:
Client → Gateway → Cache hit! → Response (backend-এ যেতে হলো না!)
```

```
Cache rules:
GET /api/products       → Cache 5 min (পণ্যের তালিকা)
GET /api/products/:id   → Cache 1 min
GET /api/users/me       → No cache (user-specific)
POST /api/orders        → No cache (write operation)
```

### 8. Logging ও Monitoring

সব request-এর log একজায়গায়:

```
Gateway log:
[2026-02-18 14:30:00] GET /api/users/42 → 200 OK (45ms) user:ripon ip:203.0.113.50
[2026-02-18 14:30:01] POST /api/orders → 201 Created (230ms) user:karim
[2026-02-18 14:30:02] GET /api/products → 200 OK (12ms) cache:HIT
[2026-02-18 14:30:03] POST /api/payments → 500 Error (1500ms) user:ripon ⚠️
```

```
Metrics:
- Request count per service
- Average response time
- Error rate per endpoint
- Cache hit ratio
- Active connections
```

### 9. Circuit Breaker

Backend service down হলে **সব request fail না করে** gracefully handle করা:

```
Normal state (Closed):
Client → Gateway → Backend → Response ✅

Backend slow/down (Open):
Client → Gateway → Circuit OPEN → 503 "Service temporarily unavailable"
                   (Backend-এ request পাঠায়ই না!)

Recovery (Half-Open):
Client → Gateway → Test request → Backend
                   সফল? → Circuit CLOSED (normal)
                   fail? → Circuit OPEN (আবার block)
```

```
Circuit Breaker rules:
- 5 টা consecutive failure → Circuit OPEN
- 30 সেকেন্ড পর → Half-Open (test request)
- Test সফল → CLOSED
- Test fail → আবার OPEN (30s wait)
```

> Circuit breaker ছাড়া: একটা service down → request queue হতে থাকে → পুরো system slow → cascading failure!

### 10. SSL Termination

Gateway-তে HTTPS terminate করে backend-এ HTTP দিয়ে যায়:

```
Client ══ HTTPS ══► Gateway ── HTTP ──► Backend Services
                      ↑
              SSL certificate এখানে
              Encryption/Decryption এখানে

সুবিধা:
- Backend services-এ SSL manage করতে হয় না
- Certificate একজায়গায়
- SSL processing-এর load শুধু gateway-তে
```

---

## API Gateway Patterns

### 1. Single Gateway (Simple)

```
              ┌─── Service A
Client → Gateway ├─── Service B
              └─── Service C
```

> ছোট-মাঝারি application-এর জন্য।

### 2. BFF Pattern (Backend for Frontend)

প্রতিটি client type-এর জন্য **আলাদা gateway**:

```
Web App    → Web Gateway    → Services
Mobile App → Mobile Gateway → Services
Partner API → Partner Gateway → Services
```

```
কেন?
Web-এ বড় screen — বেশি data দরকার
Mobile-এ ছোট screen — কম data দরকার, compressed
Partner-এ আলাদা auth, rate limit

Web Gateway:
GET /dashboard → { full user profile, 20 orders, charts, analytics }

Mobile Gateway:
GET /dashboard → { name, avatar, 5 orders, summary }  (lightweight!)
```

### 3. Multi-Layer Gateway

```
Client → Edge Gateway (CDN/Global) → Regional Gateway → Microservice Gateway → Services
              ↑                            ↑                     ↑
         SSL, DDoS                    Auth, Rate Limit      Routing, Load Balance
         protection
```

> Large-scale system (Netflix, Amazon) এভাবে করে।

---

## Popular API Gateway Tools

### Self-Hosted (নিজে manage)

| Tool | Language | বৈশিষ্ট্য |
|------|----------|-----------|
| **Nginx** | C | সবচেয়ে popular reverse proxy, lightweight |
| **Kong** | Lua/Nginx | Plugin-based, feature-rich |
| **Traefik** | Go | Docker/Kubernetes native |
| **HAProxy** | C | High-performance load balancer |
| **Express Gateway** | Node.js | Express.js-based, developer-friendly |
| **APISIX** | Lua/Nginx | High-performance, dynamic |

### Cloud-Managed (provider manage করে)

| Tool | Cloud | বৈশিষ্ট্য |
|------|-------|-----------|
| **AWS API Gateway** | AWS | Serverless, Lambda integration |
| **Azure API Management** | Azure | Enterprise features |
| **Google Cloud Endpoints** | GCP | gRPC support |
| **Cloudflare API Shield** | Cloudflare | Edge-based, DDoS protection |

### কোনটা কখন?

```
ছোট project / শেখা           → Nginx reverse proxy
Microservices / Kubernetes   → Kong বা Traefik
Serverless / AWS             → AWS API Gateway
Enterprise / বড় team         → Kong Enterprise বা Azure APIM
```

---

## Nginx as Simple API Gateway

```nginx
# nginx.conf

upstream user_service {
    server user-service:3001;
    server user-service:3002;  # multiple instances
}

upstream order_service {
    server order-service:4001;
}

server {
    listen 443 ssl;
    server_name api.example.com;

    ssl_certificate /etc/ssl/cert.pem;
    ssl_certificate_key /etc/ssl/key.pem;

    # Rate limiting
    limit_req_zone $binary_remote_addr zone=api:10m rate=100r/m;

    # User Service
    location /api/users {
        limit_req zone=api burst=20;
        proxy_pass http://user_service;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Request-ID $request_id;
    }

    # Order Service
    location /api/orders {
        limit_req zone=api burst=10;
        proxy_pass http://order_service;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # Caching
    location /api/products {
        proxy_cache my_cache;
        proxy_cache_valid 200 5m;
        proxy_pass http://product_service;
    }
}
```

---

## API Gateway vs Reverse Proxy vs Load Balancer

```
Reverse Proxy:
Client → Proxy → Server
(Request forwarding, SSL termination, caching)

Load Balancer:
Client → LB → Server 1
             → Server 2
             → Server 3
(Traffic distribution)

API Gateway:
Client → Gateway → Service A
                 → Service B
(Routing + Auth + Rate Limit + Transform + Monitor + ...)
```

| Feature | Reverse Proxy | Load Balancer | API Gateway |
|---------|--------------|--------------|-------------|
| Request forwarding | ✅ | ✅ | ✅ |
| SSL termination | ✅ | ✅ | ✅ |
| Load balancing | ⚠️ Basic | ✅ Advanced | ✅ |
| Authentication | ❌ | ❌ | ✅ |
| Rate limiting | ⚠️ Basic | ❌ | ✅ |
| Request transformation | ❌ | ❌ | ✅ |
| Response aggregation | ❌ | ❌ | ✅ |
| API analytics | ❌ | ❌ | ✅ |
| Circuit breaker | ❌ | ❌ | ✅ |
| Developer portal | ❌ | ❌ | ✅ |

> **সহজ কথায়:** API Gateway = Reverse Proxy + Load Balancer + অনেক কিছু extra

---

## API Gateway অসুবিধা

### 1. Single Point of Failure

```
Gateway down → পুরো system down!

সমাধান:
- Multiple gateway instances
- Load balancer gateway-এর সামনে
- Health checks
```

### 2. Added Latency

```
Without gateway: Client → Service        (10ms)
With gateway:    Client → Gateway → Service (15ms)
                            ↑
                       +5ms overhead

সমাধান:
- Gateway কে service-এর কাছে রাখো
- Lightweight gateway ব্যবহার করো (Nginx, Traefik)
```

### 3. Complexity

```
আরেকটা component maintain করতে হয়:
- Configuration management
- Monitoring
- Scaling
- Updates
```

### 4. Bottleneck হতে পারে

```
সব traffic gateway দিয়ে যায়:
- Gateway-এর capacity plan করতে হয়
- Auto-scaling দরকার
```

---

## সংক্ষেপে মনে রাখার সূত্র

```
API Gateway = Single Entry Point for all clients

Core Features:
1. Routing        → সঠিক service-এ পাঠায়
2. Auth           → একবার verify, সবার জন্য
3. Rate Limiting  → Abuse prevent
4. Load Balancing → Traffic distribute
5. Caching        → Performance boost
6. Aggregation    → Multiple service → single response
7. Transform      → Request/Response modify
8. Circuit Breaker → Cascading failure prevent
9. Monitoring     → সব log একজায়গায়
10. SSL           → Encryption handle

Gateway = Reverse Proxy + Load Balancer + Auth + Rate Limit + Monitoring + ...
```

---

## Interview Golden Lines

> **API Gateway is the front door to your microservices — all traffic enters through one place.**

> **Without a gateway, every microservice must handle auth, rate limiting, CORS, and logging independently.**

> **BFF pattern means different gateways for different clients — web gets rich data, mobile gets lightweight data.**

> **Circuit breaker in a gateway prevents one failing service from bringing down the entire system.**

> **The biggest risk of an API Gateway is that it becomes a single point of failure — always run multiple instances.**
