# API Versioning (এপিআই ভার্সনিং)

## API Versioning কী?

API Versioning হলো API-তে **breaking change** আনলে পুরনো client যাতে ভেঙে না যায় তার ব্যবস্থা। নতুন version তৈরি করা হয় — পুরনো version-ও চলতে থাকে।

```
ধরো তোমার API ব্যবহার করে:
- Mobile App (v2.0)
- Partner Company
- ১০,০০০ user-এর frontend

তুমি API response format বদলালে:

❌ Versioning ছাড়া:
API change → সবার app ভেঙে গেল! 💥

✅ Versioning দিয়ে:
v1 চলতে থাকে → পুরনো client-রা ভালো আছে
v2 নতুন → নতুন client v2 ব্যবহার করে
```

---

## কখন নতুন Version দরকার?

### Breaking Changes (নতুন version লাগবে)

```
❌ Response field remove/rename করলে:
v1: { "name": "Ripon", "phone": "01712345678" }
v2: { "full_name": "Ripon", "mobile": "01712345678" }
    ← name → full_name, phone → mobile = BREAKING!

❌ Required field যোগ করলে:
v1: POST /users { "name": "Ripon" }
v2: POST /users { "name": "Ripon", "email": "required!" }
    ← email ছাড়া পুরনো client fail করবে

❌ Data type পরিবর্তন:
v1: { "price": "99.99" }         (string)
v2: { "price": 99.99 }           (number) = BREAKING!

❌ URL structure পরিবর্তন:
v1: GET /api/users/42/orders
v2: GET /api/orders?user_id=42   = BREAKING!

❌ Authentication method পরিবর্তন:
v1: API Key header
v2: OAuth 2.0 Bearer token       = BREAKING!
```

### Non-Breaking Changes (নতুন version লাগবে না)

```
✅ নতুন optional field যোগ:
{ "name": "Ripon" }
→ { "name": "Ripon", "avatar": "url" }  ← পুরনো client এটা ignore করবে

✅ নতুন endpoint যোগ:
GET /api/users     (আগের মতো আছে)
GET /api/reports   (নতুন endpoint, কারো ক্ষতি নেই)

✅ Bug fix / performance improvement

✅ নতুন optional query parameter:
GET /api/users
GET /api/users?include=posts   ← optional, ছাড়াও আগের মতো কাজ করে
```

---

## Versioning Strategies

### 1. URL Path Versioning (সবচেয়ে Common)

URL-এ version number রাখা:

```http
GET /api/v1/users
GET /api/v2/users
GET /api/v3/users
```

```
সুবিধা:
✅ সবচেয়ে সহজ ও স্পষ্ট
✅ Browser-এ সরাসরি test করা যায়
✅ Caching সহজ (URL আলাদা)
✅ API documentation-এ পরিষ্কার
✅ Load balancer দিয়ে আলাদা server-এ route করা যায়

অসুবিধা:
❌ URL "unclean" হয় (purist-দের মতে resource-এর URL বদলানো উচিত না)
❌ Version পরিবর্তনে সব URL বদলায়

ব্যবহার করে: Google, Twitter, Facebook, Stripe, GitHub (v3)
```

**Implementation:**

```
Router-এ:
/api/v1/users → UsersControllerV1
/api/v2/users → UsersControllerV2

অথবা middleware দিয়ে:
/api/v1/* → v1 logic
/api/v2/* → v2 logic
```

### 2. Query Parameter Versioning

Query parameter-এ version:

```http
GET /api/users?version=1
GET /api/users?version=2
GET /api/users?v=2
```

```
সুবিধা:
✅ URL structure একই থাকে
✅ Default version রাখা যায় (version না দিলে latest)
✅ Simple implementation

অসুবিধা:
❌ Version ভুলে গেলে unexpected behavior
❌ Caching কঠিন (same URL, different version)
❌ কম readable

ব্যবহার করে: Amazon, Netflix
```

### 3. Header Versioning (Custom Header)

Custom header-এ version:

```http
GET /api/users HTTP/1.1
X-API-Version: 1

GET /api/users HTTP/1.1
X-API-Version: 2
```

```
সুবিধা:
✅ URL একদম clean
✅ Purist REST approach

অসুবিধা:
❌ Browser-এ সরাসরি test করা যায় না (header set করতে হয়)
❌ API documentation-এ কম visible
❌ Caching কঠিন

ব্যবহার করে: Azure DevOps
```

### 4. Accept Header Versioning (Content Negotiation)

Accept header-এ version encode করা:

```http
GET /api/users HTTP/1.1
Accept: application/vnd.myapi.v1+json

GET /api/users HTTP/1.1
Accept: application/vnd.myapi.v2+json
```

```
vnd = vendor
myapi = তোমার API নাম
v1 = version
json = format

সুবিধা:
✅ সবচেয়ে "RESTful" approach
✅ URL clean
✅ Format ও version একসাথে specify

অসুবিধা:
❌ Complex
❌ Developer-unfriendly (test করা কঠিন)
❌ কম জনপ্রিয়

ব্যবহার করে: GitHub API v3
```

### 5. Subdomain Versioning

```http
GET https://v1.api.example.com/users
GET https://v2.api.example.com/users
```

```
সুবিধা:
✅ সম্পূর্ণ আলাদা deployment সম্ভব
✅ আলাদা server-এ route করা সহজ

অসুবিধা:
❌ DNS configuration দরকার
❌ SSL certificate management
❌ CORS complexity
```

---

## Strategy তুলনা

| Strategy | URL | Visibility | Caching | Simplicity | Popularity |
|----------|-----|-----------|---------|------------|------------|
| **URL Path** | `/api/v1/users` | ✅ খুব clear | ✅ সহজ | ✅ সহজ | সবচেয়ে বেশি |
| **Query Param** | `/api/users?v=1` | ⚠️ মোটামুটি | ❌ কঠিন | ✅ সহজ | মাঝারি |
| **Custom Header** | `X-API-Version: 1` | ❌ Hidden | ❌ কঠিন | ⚠️ মোটামুটি | কম |
| **Accept Header** | `vnd.myapi.v1+json` | ❌ Hidden | ❌ কঠিন | ❌ কঠিন | কম |
| **Subdomain** | `v1.api.example.com` | ✅ Clear | ✅ সহজ | ⚠️ মোটামুটি | কম |

> **Recommendation:** URL Path versioning ব্যবহার করো — সবচেয়ে simple, readable, widely adopted।

---

## Version Lifecycle Management

### Version States

```
Active    → বর্তমানে supported, bug fix ও feature update পায়
Stable    → Supported, শুধু bug fix পায়
Deprecated → এখনো কাজ করে কিন্তু শীঘ্রই বন্ধ হবে
Retired   → বন্ধ, আর কাজ করে না
```

```
Timeline example:

2024 ── v1 Active
2025 ── v2 Active,  v1 Stable
2026 ── v3 Active,  v2 Stable,  v1 Deprecated
2027 ── v3 Active,  v2 Stable,  v1 Retired (বন্ধ!)
```

### Deprecation Strategy

**Step 1: Announce**

```
Blog post, email, documentation-এ জানাও:
"v1 will be deprecated on June 30, 2026. Please migrate to v2."
```

**Step 2: Deprecation Headers**

```http
HTTP/1.1 200 OK
Sunset: Sat, 30 Jun 2026 00:00:00 GMT
Deprecation: true
Link: <https://api.example.com/v2/users>; rel="successor-version"

Warning: 299 - "API v1 is deprecated. Please migrate to v2. Sunset: 2026-06-30"
```

**Step 3: Response-এ Warning**

```json
{
  "data": { ... },
  "_meta": {
    "api_version": "v1",
    "deprecated": true,
    "sunset_date": "2026-06-30",
    "migration_guide": "https://docs.example.com/migration/v1-to-v2"
  }
}
```

**Step 4: Rate Limit / Throttle**

```
Deprecated version-এ ধীরে ধীরে rate limit কমানো:
Month 1: 1000 req/min (normal)
Month 3: 500 req/min
Month 5: 100 req/min
Month 6: 0 req/min (retired) → 410 Gone
```

**Step 5: Retire**

```http
GET /api/v1/users

HTTP/1.1 410 Gone

{
  "error": "API v1 has been retired",
  "message": "Please use v2: https://api.example.com/v2/users",
  "migration_guide": "https://docs.example.com/migration/v1-to-v2"
}
```

---

## Version Migration Best Practices

### 1. Migration Guide লিখো

```markdown
# v1 → v2 Migration Guide

## Breaking Changes

### User endpoint
- `name` → `full_name`
- `phone` → `mobile_number`
- `GET /users/:id/orders` → `GET /orders?user_id=:id`

### Authentication
- API Key → Bearer Token
- Header: `X-API-Key` → `Authorization: Bearer <token>`

## New Features in v2
- Pagination cursor support
- Field selection (?fields=id,name)

## Timeline
- v1 deprecated: March 2026
- v1 retired: June 2026
```

### 2. Backward Compatibility যতটা সম্ভব রাখো

```json
v1 response: { "name": "Ripon" }

v2 response (backward compatible way):
{
  "name": "Ripon",           ← পুরনো field রেখে দাও
  "full_name": "Ripon Ahmed" ← নতুন field যোগ করো
}

→ পুরনো client "name" পড়বে, কোনো সমস্যা নেই
→ নতুন client "full_name" পড়বে
→ পরে v3-তে "name" remove করো
```

### 3. একসাথে বেশি Version Support করো না

```
✅ ভালো: v2 (active) + v1 (deprecated) = 2 versions
❌ খারাপ: v5 (active) + v4 + v3 + v2 + v1 = 5 versions maintain করা nightmare!

Rule of thumb: Maximum 2-3 version একসাথে support করো
```

### 4. Semantic Versioning (API-তে)

```
Major version (v1 → v2): Breaking changes → নতুন URL version
Minor version (v2.1 → v2.2): New features, backward compatible
Patch version (v2.2.0 → v2.2.1): Bug fixes

URL-এ শুধু major version:
/api/v1/  /api/v2/  /api/v3/

Minor ও patch version header বা docs-এ:
X-API-Version: 2.3.1
```

---

## Real-World Examples

### Stripe API

```
URL versioning with date:
/v1/charges  (base URL)
Stripe-Version: 2026-02-18  (header-এ specific date version)

→ প্রতিটি API change-এ date version তৈরি হয়
→ Account-এ default version set করা যায়
→ Override করতে header দেওয়া যায়
```

### GitHub API

```
v3 (REST): Accept: application/vnd.github.v3+json
v4 (GraphQL): POST /graphql

→ REST (v3) ও GraphQL (v4) পাশাপাশি চলে
```

### Google APIs

```
URL versioning:
https://www.googleapis.com/drive/v3/files
https://www.googleapis.com/calendar/v3/events
```

### Twitter API

```
URL versioning:
https://api.twitter.com/2/tweets
https://api.twitter.com/2/users
(v1.1 deprecated, v2 active)
```

---

## সংক্ষেপে মনে রাখার সূত্র

```
Breaking change → নতুন version (major)
Non-breaking change → version বদলানোর দরকার নেই

5 Strategies:
1. URL Path:    /api/v1/users     ← সবচেয়ে জনপ্রিয়, এটা ব্যবহার করো
2. Query Param: /api/users?v=1
3. Header:      X-API-Version: 1
4. Accept:      vnd.myapi.v1+json
5. Subdomain:   v1.api.example.com

Lifecycle:
Active → Stable → Deprecated → Retired (410 Gone)

Rules:
- Maximum 2-3 version support করো
- Breaking change avoid করো (নতুন field যোগ করো, পুরনো রেখে দাও)
- Deprecation আগে থেকে জানাও
- Migration guide লিখো
```

---

## Interview Golden Lines

> **API versioning protects existing clients from breaking changes while allowing the API to evolve.**

> **URL path versioning is the most popular because it's the most visible and cacheable.**

> **The best versioning strategy is to avoid breaking changes — add new fields, don't rename old ones.**

> **Deprecation is a process, not a switch — announce early, warn in headers, migrate gradually, then retire.**

> **Stripe's date-based versioning is brilliant — every API change gets a date, and accounts pin to a specific version.**
