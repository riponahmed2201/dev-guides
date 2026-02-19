# Pagination (পেজিনেশন)

## Pagination কী?

**Pagination** হলো বড় dataset-কে **ছোট ছোট page-এ ভাগ করে** client-কে পাঠানো — একবারে সব data না দিয়ে, যতটুকু দরকার ততটুকু দেওয়া।

```
Pagination ছাড়া:
  GET /api/users → 1,000,000 users একবারে! 😱
  → Slow response, high memory, client hang

Pagination সহ:
  GET /api/users?page=1&limit=20 → 20 users (page 1)
  GET /api/users?page=2&limit=20 → 20 users (page 2)
  → Fast, lightweight, client-friendly
```

> **বাস্তব উদাহরণ:** Google Search-এ 10 billion results আছে, কিন্তু তুমি একবারে শুধু 10টা দেখো। পরের page-এ যেতে "Next" চাপো।

---

## কেন Pagination দরকার?

| সমস্যা            | Pagination ছাড়া | Pagination সহ |
| ----------------- | ---------------- | ------------- |
| **Response Size** | 50MB JSON        | 5KB JSON      |
| **Response Time** | 30+ seconds      | 50ms          |
| **Server Memory** | 1GB+ load        | Minimal       |
| **Database Load** | Full table scan  | Small query   |
| **Network**       | Bandwidth waste  | Efficient     |
| **Client**        | Freeze/crash     | Smooth UI     |

---

## তিন ধরনের Pagination

### Overview

```
1. Offset-Based   → page=2&limit=20    → সহজ, কিন্তু বড় dataset-এ slow
2. Cursor-Based   → cursor=abc&limit=20 → Fast, real-time data-তে best
3. Keyset-Based   → after_id=100&limit=20 → Database-friendly, scalable
```

---

## 1. Offset-Based Pagination

সবচেয়ে সাধারণ ও সহজ পদ্ধতি:

### ধারণা

```
Table: 100 users
limit = 20, page = 3

SKIP (offset) = (page - 1) × limit = (3 - 1) × 20 = 40
→ প্রথম 40টা skip করো, পরের 20টা আনো (row 41-60)
```

### Implementation (Express + MongoDB)

```javascript
app.get("/api/users", async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 20));
  const skip = (page - 1) * limit;

  const [users, total] = await Promise.all([
    User.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select("name email createdAt"),
    User.countDocuments(),
  ]);

  const totalPages = Math.ceil(total / limit);

  res.json({
    data: users,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
  });
});
```

### Response

```json
{
  "data": [
    { "id": "41", "name": "User 41", "email": "user41@test.com" },
    { "id": "42", "name": "User 42", "email": "user42@test.com" }
  ],
  "pagination": {
    "page": 3,
    "limit": 20,
    "total": 1000,
    "totalPages": 50,
    "hasNextPage": true,
    "hasPrevPage": true
  }
}
```

### SQL Version

```sql
-- Page 3, 20 per page
SELECT * FROM users
ORDER BY created_at DESC
LIMIT 20 OFFSET 40;

-- Total count
SELECT COUNT(*) FROM users;
```

### Prisma Version

```javascript
const page = 3;
const limit = 20;

const [users, total] = await Promise.all([
  prisma.user.findMany({
    skip: (page - 1) * limit,
    take: limit,
    orderBy: { createdAt: "desc" },
  }),
  prisma.user.count(),
]);
```

### সমস্যা

```
Page 1:   SKIP 0,     LIMIT 20   → ✅ Fast
Page 10:  SKIP 180,   LIMIT 20   → 🟡 OK
Page 100: SKIP 1980,  LIMIT 20   → 🟠 Slow
Page 5000: SKIP 99980, LIMIT 20  → 🔴 Very Slow!

কারণ: Database-কে 99,980টা row scan করে skip করতে হচ্ছে!
OFFSET বাড়লে → Performance কমে (O(n) complexity)
```

```
আরেকটা সমস্যা — Data Inconsistency:

User page 1 দেখছে (rows 1-20)
এর মধ্যে নতুন user add হলো (top-এ)
User page 2 এ গেলো → row 20 আবার দেখবে! (shift হয়ে গেছে)
বা কিছু row miss করবে
```

```
Offset Pagination:
  ✅ Simple, widely understood
  ✅ "Page 5 of 50" UI friendly
  ✅ যেকোনো page-এ jump করা যায়
  ❌ বড় offset-এ slow (SKIP expensive)
  ❌ Real-time data-তে row duplicate/miss
  ❌ COUNT(*) expensive বড় table-এ
```

---

## 2. Cursor-Based Pagination

### ধারণা

Offset-এর বদলে **last item-এর unique identifier** (cursor) ব্যবহার করে পরবর্তী page আনা:

```
Page 1: "প্রথম 20টা দাও"
  → Last item ID: "user_60"

Page 2: "user_60-এর পরের 20টা দাও"
  → Last item ID: "user_40"

Page 3: "user_40-এর পরের 20টা দাও"
  → ...
```

### Implementation (Express + MongoDB)

```javascript
app.get("/api/users", async (req, res) => {
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 20));
  const cursor = req.query.cursor; // last item-এর ID

  const query = {};
  if (cursor) {
    query._id = { $lt: cursor }; // cursor-এর আগের items
  }

  const users = await User.find(query)
    .sort({ _id: -1 })
    .limit(limit + 1) // 1 extra আনো → next page আছে কিনা check
    .select("name email createdAt");

  const hasNextPage = users.length > limit;
  if (hasNextPage) users.pop(); // extra item বাদ দাও

  const nextCursor = hasNextPage ? users[users.length - 1]._id : null;

  res.json({
    data: users,
    pagination: {
      limit,
      hasNextPage,
      nextCursor,
    },
  });
});
```

### Response

```json
{
  "data": [
    { "id": "user_59", "name": "User 59" },
    { "id": "user_58", "name": "User 58" }
  ],
  "pagination": {
    "limit": 20,
    "hasNextPage": true,
    "nextCursor": "user_40"
  }
}
```

### Client-Side Usage

```javascript
// First page
let url = "/api/users?limit=20";

// Next page
const response = await fetch(url);
const data = await response.json();

if (data.pagination.hasNextPage) {
  url = `/api/users?limit=20&cursor=${data.pagination.nextCursor}`;
  // এই URL দিয়ে পরের page fetch করো
}
```

### Encoded Cursor (Opaque)

Client-কে raw ID না দিয়ে **encoded cursor** দাও — implementation details লুকানো:

```javascript
function encodeCursor(data) {
  return Buffer.from(JSON.stringify(data)).toString("base64url");
}

function decodeCursor(cursor) {
  return JSON.parse(Buffer.from(cursor, "base64url").toString());
}

// Cursor encode
const nextCursor = encodeCursor({
  id: lastUser._id,
  createdAt: lastUser.createdAt,
});
// "eyJpZCI6InVzZXJfNDAiLCJjcmVhdGVkQXQiOiIyMDI2LTAyLTE4In0"

// Cursor decode
const { id, createdAt } = decodeCursor(req.query.cursor);
```

### Cursor-Based সুবিধা ও সমস্যা

```
Cursor Pagination:
  ✅ Consistent performance (offset বাড়লেও fast)
  ✅ Real-time data-তে duplicate/miss নেই
  ✅ Infinite scroll-এ perfect
  ❌ "Page 5 of 50" UI করা যায় না
  ❌ যেকোনো page-এ jump করা যায় না
  ❌ Slightly complex implementation
```

---

## 3. Keyset-Based Pagination

Cursor-based-এর database-optimized version — sorted column-এর value ব্যবহার করে:

### ধারণা

```sql
-- Offset (slow):
SELECT * FROM users ORDER BY created_at DESC LIMIT 20 OFFSET 10000;
-- 10,000 rows scan + skip!

-- Keyset (fast):
SELECT * FROM users
WHERE created_at < '2026-02-15T10:00:00Z'
ORDER BY created_at DESC
LIMIT 20;
-- Index ব্যবহার করে directly jump!
```

### Implementation

```javascript
app.get("/api/users", async (req, res) => {
  const limit = Math.min(100, parseInt(req.query.limit) || 20);
  const afterDate = req.query.after; // last item-এর createdAt
  const afterId = req.query.after_id; // tie-breaking-এর জন্য

  const query = {};
  if (afterDate && afterId) {
    query.$or = [
      { createdAt: { $lt: new Date(afterDate) } },
      {
        createdAt: new Date(afterDate),
        _id: { $lt: afterId },
      },
    ];
  }

  const users = await User.find(query)
    .sort({ createdAt: -1, _id: -1 })
    .limit(limit + 1);

  const hasNextPage = users.length > limit;
  if (hasNextPage) users.pop();

  const lastItem = users[users.length - 1];

  res.json({
    data: users,
    pagination: {
      limit,
      hasNextPage,
      next: hasNextPage
        ? {
            after: lastItem.createdAt.toISOString(),
            after_id: lastItem._id,
          }
        : null,
    },
  });
});
```

### SQL Version

```sql
-- Keyset with composite sort (created_at + id for tie-breaking)
SELECT * FROM users
WHERE (created_at, id) < ('2026-02-15T10:00:00Z', 1050)
ORDER BY created_at DESC, id DESC
LIMIT 20;
```

```
Keyset Pagination:
  ✅ Best database performance (index-friendly)
  ✅ O(1) regardless of page position
  ✅ No row skip needed
  ❌ Sorted column-এ index দরকার
  ❌ Sort order change করা কঠিন
  ❌ যেকোনো page-এ jump করা যায় না
```

---

## তিন পদ্ধতির তুলনা

```
Feature              Offset         Cursor         Keyset
──────────────────────────────────────────────────────────────
Simplicity           ✅ Easy        🟡 Medium      🟡 Medium
Random Page Access   ✅ Yes         ❌ No           ❌ No
Total Count          ✅ Easy        ❌ Expensive    ❌ Expensive
Performance (large)  ❌ Degrades    ✅ Constant     ✅ Constant
Real-time Safe       ❌ Duplicates  ✅ Safe         ✅ Safe
"Page X of Y" UI     ✅ Yes         ❌ No           ❌ No
Infinite Scroll      🟡 OK         ✅ Perfect      ✅ Perfect
DB Index Required    🟡 Optional   🟡 Recommended  ✅ Required
```

### কখন কোনটা ব্যবহার করবে?

```
Offset-Based:
  → Admin panel, dashboard (total count দরকার)
  → ছোট dataset (< 10,000 items)
  → "Page 1, 2, 3..." style navigation

Cursor-Based:
  → Social media feed (infinite scroll)
  → Real-time data (chat messages, notifications)
  → বড় dataset
  → Public API (Facebook, Twitter style)

Keyset-Based:
  → খুব বড় dataset (millions+)
  → Performance critical endpoints
  → Log/event data (time-series sorted)
```

---

## Filtering + Sorting + Pagination

Real API-তে তিনটা একসাথে কাজ করে:

### Complete Implementation

```javascript
app.get("/api/users", async (req, res) => {
  // Pagination
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 20));
  const skip = (page - 1) * limit;

  // Sorting
  const sortField = ["name", "email", "createdAt"].includes(req.query.sort)
    ? req.query.sort
    : "createdAt";
  const sortOrder = req.query.order === "asc" ? 1 : -1;
  const sort = { [sortField]: sortOrder };

  // Filtering
  const filter = {};
  if (req.query.search) {
    filter.$or = [
      { name: { $regex: req.query.search, $options: "i" } },
      { email: { $regex: req.query.search, $options: "i" } },
    ];
  }
  if (req.query.role) {
    filter.role = req.query.role;
  }
  if (req.query.status) {
    filter.isActive = req.query.status === "active";
  }
  if (req.query.from || req.query.to) {
    filter.createdAt = {};
    if (req.query.from) filter.createdAt.$gte = new Date(req.query.from);
    if (req.query.to) filter.createdAt.$lte = new Date(req.query.to);
  }

  const [users, total] = await Promise.all([
    User.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .select("name email role isActive createdAt"),
    User.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(total / limit);

  res.json({
    data: users,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
    filters: {
      search: req.query.search || null,
      role: req.query.role || null,
      status: req.query.status || null,
      from: req.query.from || null,
      to: req.query.to || null,
    },
    sort: { field: sortField, order: sortOrder === 1 ? "asc" : "desc" },
  });
});
```

### API Call Example

```
GET /api/users?page=2&limit=10&sort=name&order=asc&search=ripon&role=admin&from=2026-01-01
```

---

## Reusable Pagination Middleware

```javascript
function paginate(defaultLimit = 20, maxLimit = 100) {
  return (req, res, next) => {
    req.pagination = {
      page: Math.max(1, parseInt(req.query.page) || 1),
      limit: Math.min(
        maxLimit,
        Math.max(1, parseInt(req.query.limit) || defaultLimit),
      ),
    };
    req.pagination.skip = (req.pagination.page - 1) * req.pagination.limit;
    next();
  };
}

function paginateResponse(data, total, pagination) {
  const totalPages = Math.ceil(total / pagination.limit);
  return {
    data,
    pagination: {
      page: pagination.page,
      limit: pagination.limit,
      total,
      totalPages,
      hasNextPage: pagination.page < totalPages,
      hasPrevPage: pagination.page > 1,
    },
  };
}

// Usage
app.get("/api/users", paginate(), async (req, res) => {
  const { skip, limit } = req.pagination;

  const [users, total] = await Promise.all([
    User.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
    User.countDocuments(),
  ]);

  res.json(paginateResponse(users, total, req.pagination));
});

app.get("/api/posts", paginate(10, 50), async (req, res) => {
  const { skip, limit } = req.pagination;

  const [posts, total] = await Promise.all([
    Post.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
    Post.countDocuments(),
  ]);

  res.json(paginateResponse(posts, total, req.pagination));
});
```

---

## Python — FastAPI Pagination

### Offset-Based

```python
from fastapi import FastAPI, Query
from pydantic import BaseModel

app = FastAPI()

class PaginationParams(BaseModel):
    page: int = Query(1, ge=1)
    limit: int = Query(20, ge=1, le=100)

    @property
    def skip(self):
        return (self.page - 1) * self.limit

@app.get("/api/users")
async def get_users(
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    search: str = Query(None)
):
    skip = (page - 1) * limit

    query = {}
    if search:
        query = {"name": {"$regex": search, "$options": "i"}}

    users = await db.users.find(query).skip(skip).limit(limit).to_list(limit)
    total = await db.users.count_documents(query)
    total_pages = -(-total // limit)  # ceil division

    return {
        "data": users,
        "pagination": {
            "page": page,
            "limit": limit,
            "total": total,
            "total_pages": total_pages,
            "has_next": page < total_pages,
            "has_prev": page > 1
        }
    }
```

### Cursor-Based

```python
from bson import ObjectId

@app.get("/api/feed")
async def get_feed(
    limit: int = Query(20, ge=1, le=100),
    cursor: str = Query(None)
):
    query = {}
    if cursor:
        query["_id"] = {"$lt": ObjectId(cursor)}

    items = await db.posts.find(query)\
        .sort("_id", -1)\
        .limit(limit + 1)\
        .to_list(limit + 1)

    has_next = len(items) > limit
    if has_next:
        items.pop()

    next_cursor = str(items[-1]["_id"]) if has_next and items else None

    return {
        "data": items,
        "pagination": {
            "limit": limit,
            "has_next": has_next,
            "next_cursor": next_cursor
        }
    }
```

---

## HATEOAS-Style Pagination Links

REST best practice — response-এ **navigation links** দাও:

```json
{
    "data": [...],
    "pagination": {
        "page": 3,
        "limit": 20,
        "total": 1000,
        "totalPages": 50
    },
    "links": {
        "self": "/api/users?page=3&limit=20",
        "first": "/api/users?page=1&limit=20",
        "prev": "/api/users?page=2&limit=20",
        "next": "/api/users?page=4&limit=20",
        "last": "/api/users?page=50&limit=20"
    }
}
```

```javascript
function generateLinks(req, page, totalPages, limit) {
  const base = `${req.baseUrl}${req.path}`;
  const links = {
    self: `${base}?page=${page}&limit=${limit}`,
    first: `${base}?page=1&limit=${limit}`,
    last: `${base}?page=${totalPages}&limit=${limit}`,
  };
  if (page > 1) links.prev = `${base}?page=${page - 1}&limit=${limit}`;
  if (page < totalPages) links.next = `${base}?page=${page + 1}&limit=${limit}`;
  return links;
}
```

---

## Performance Tips

### ১. Index দাও

```javascript
// MongoDB
userSchema.index({ createdAt: -1 });
userSchema.index({ name: 1, createdAt: -1 });

// SQL
// CREATE INDEX idx_users_created_at ON users(created_at DESC);
```

### ২. COUNT(\*) Optimize করো

```javascript
// ❌ প্রতিবার exact count — বড় table-এ slow
const total = await User.countDocuments(filter);

// ✅ Estimated count (filter ছাড়া)
const total = await User.estimatedDocumentCount();

// ✅ Count cache করো (Redis)
const cacheKey = `users:count:${JSON.stringify(filter)}`;
let total = await redis.get(cacheKey);
if (!total) {
  total = await User.countDocuments(filter);
  await redis.setex(cacheKey, 60, total); // 60 sec cache
}
```

### ৩. Projection ব্যবহার করো

```javascript
// ❌ সব field আনো
const users = await User.find().skip(skip).limit(limit);

// ✅ শুধু দরকারি fields
const users = await User.find()
  .skip(skip)
  .limit(limit)
  .select("name email createdAt")
  .lean(); // plain JS object (faster)
```

### ৪. Maximum Limit সেট করো

```javascript
// Client যত বড় limit-ই দিক, max 100
const limit = Math.min(100, parseInt(req.query.limit) || 20);
```

---

## সংক্ষেপে মনে রাখার সূত্র

```
Pagination = বড় data-কে ছোট ছোট page-এ ভাগ করা

3 পদ্ধতি:
  Offset  → page=2&limit=20  → SKIP + LIMIT → সহজ, বড়-এ slow
  Cursor  → cursor=abc123    → WHERE id < cursor → constant speed
  Keyset  → after=2026-02-15 → WHERE col < value → index-optimized

কখন কোনটা:
  Offset → Admin panel, ছোট data, "Page X of Y"
  Cursor → Social feed, infinite scroll, real-time
  Keyset → Millions of rows, time-series

Response Format:
  { data: [...], pagination: { page, limit, total, hasNext, hasPrev } }
  + links: { self, first, prev, next, last } (HATEOAS)

Filter + Sort + Paginate → একসাথে কাজ করে:
  GET /api/users?page=2&limit=20&sort=name&order=asc&search=ripon

Performance:
  ✅ Index দাও sorted columns-এ
  ✅ Count cache করো (Redis)
  ✅ Projection (select) ব্যবহার করো
  ✅ Max limit enforce করো (100)
  ✅ .lean() ব্যবহার করো (Mongoose)
```

---

## Interview Golden Lines

> **Offset pagination uses SKIP and LIMIT — simple but degrades with large offsets because the database must scan and discard rows.**

> **Cursor-based pagination uses the last item's ID as a pointer — performance is constant regardless of dataset size.**

> **Keyset pagination leverages database indexes directly with WHERE clauses — the most performant approach for large sorted datasets.**

> **For real-time data like feeds or chat, cursor-based pagination avoids duplicate or missing items caused by concurrent inserts.**

> **Always enforce a maximum limit to prevent clients from requesting excessive data, and cache COUNT queries for large tables.**

> **HATEOAS pagination links (self, first, prev, next, last) make APIs self-discoverable and easier for clients to navigate.**
