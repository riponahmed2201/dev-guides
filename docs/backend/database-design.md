# Database Design & Concepts (ডেটাবেস ডিজাইন ও ধারণা)

## Database Design কী?

**Database Design** হলো data কীভাবে **organize, store ও relate** করবে তার পরিকল্পনা — ভালো design মানে fast query, কম redundancy, সহজ maintenance।

```
ভালো Database Design:
  ✅ Data redundancy কম (duplicate data নেই)
  ✅ Data integrity নিশ্চিত (ভুল data ঢুকতে পারে না)
  ✅ Query fast
  ✅ Schema পরিবর্তন সহজ
  ✅ Scale করা যায়

খারাপ Database Design:
  ❌ Same data ১০ জায়গায় → একটা update করলে বাকিগুলো outdated
  ❌ NULL values সবখানে
  ❌ Query slow, JOIN complex
  ❌ একটা পরিবর্তনে পুরো app ভেঙে যায়
```

---

## Database Design Steps

```
1. Requirements Analysis → কী data store করতে হবে?
2. Conceptual Design    → Entity-Relationship (ER) Diagram
3. Logical Design       → Tables, columns, relationships
4. Normalization        → Redundancy কমাও
5. Physical Design      → Indexes, partitioning, storage
6. Denormalization      → Performance-এর জন্য কিছু redundancy রাখো (if needed)
```

---

## Entity-Relationship (ER) Model

### Entities ও Attributes

```
Entity = Real-world object → Table হয়
Attribute = Entity-র বৈশিষ্ট্য → Column হয়

Entity: User
  Attributes: id, name, email, password, created_at

Entity: Post
  Attributes: id, title, content, author_id, created_at

Entity: Comment
  Attributes: id, text, post_id, user_id, created_at
```

### Relationships

```
One-to-One (1:1):
  User ─── Profile
  প্রতিটি user-এর একটাই profile

One-to-Many (1:N):
  User ──< Posts
  একজন user অনেক post করতে পারে
  একটা post শুধু একজন user-এর

Many-to-Many (M:N):
  Students >──< Courses
  একজন student অনেক course নিতে পারে
  একটা course-এ অনেক student থাকতে পারে
  → Junction table দরকার: StudentCourses (student_id, course_id)
```

### ER Diagram Example (E-Commerce)

```
┌──────────┐       ┌──────────┐       ┌──────────────┐
│  Users   │──1:N──│  Orders  │──1:N──│ Order_Items  │
│          │       │          │       │              │
│ id       │       │ id       │       │ id           │
│ name     │       │ user_id  │       │ order_id     │
│ email    │       │ total    │       │ product_id   │
│ password │       │ status   │       │ quantity     │
│ created  │       │ created  │       │ price        │
└──────────┘       └──────────┘       └──────┬───────┘
                                             │ N:1
                                      ┌──────┴───────┐
                                      │  Products    │
                                      │              │
                                      │ id           │
                                      │ name         │
                                      │ price        │
                                      │ category_id  │
                                      │ stock        │
                                      └──────┬───────┘
                                             │ N:1
                                      ┌──────┴───────┐
                                      │ Categories   │
                                      │              │
                                      │ id           │
                                      │ name         │
                                      │ parent_id    │
                                      └──────────────┘
```

---

## Primary Key ও Foreign Key

```sql
-- Primary Key → Table-র প্রতিটি row uniquely identify করে
CREATE TABLE users (
    id SERIAL PRIMARY KEY,        -- Auto-increment integer
    -- অথবা
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),  -- UUID
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL
);

-- Foreign Key → অন্য table-এর primary key reference করে
CREATE TABLE posts (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    content TEXT,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    --                       ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    --                       user delete হলে তার posts-ও delete হবে
    created_at TIMESTAMP DEFAULT NOW()
);
```

### Foreign Key Actions

```sql
ON DELETE CASCADE    → Parent delete → child-ও delete
ON DELETE SET NULL   → Parent delete → child-এর FK NULL হয়
ON DELETE RESTRICT   → Parent delete block (child আছে তাই)
ON DELETE NO ACTION  → RESTRICT-এর মতো (default)

ON UPDATE CASCADE    → Parent PK change → child FK-ও update
```

### Integer ID vs UUID

```
Integer (Auto-increment):
  ✅ ছোট (4-8 bytes), fast
  ✅ Sequential → index-friendly
  ❌ Predictable (id=1, 2, 3...)
  ❌ Distributed systems-এ conflict

UUID:
  ✅ Globally unique
  ✅ Unpredictable (security)
  ✅ Distributed systems-এ conflict নেই
  ❌ বড় (16 bytes), slow index
  ❌ Human-unfriendly

Recommendation:
  Internal → Integer (fast, simple)
  Public-facing → UUID (security, distributed)
```

---

## Normalization (নরমালাইজেশন)

Data redundancy কমানো ও integrity নিশ্চিত করার process:

### Unnormalized Data (সমস্যা)

```
orders table:
┌─────┬───────┬──────────────┬──────────┬───────────────────────┐
│ id  │ user  │ user_email   │ product  │ product_price         │
├─────┼───────┼──────────────┼──────────┼───────────────────────┤
│ 1   │ Ripon │ ripon@t.com  │ Laptop   │ 80000                 │
│ 2   │ Ripon │ ripon@t.com  │ Mouse    │ 500                   │
│ 3   │ Karim │ karim@t.com  │ Laptop   │ 80000                 │
│ 4   │ Ripon │ ripon@t.com  │ Keyboard │ 2000                  │
└─────┴───────┴──────────────┴──────────┴───────────────────────┘

সমস্যা:
  ❌ "Ripon" ও "ripon@t.com" ৩ বার repeat → data redundancy
  ❌ "Laptop" ও "80000" ২ বার repeat
  ❌ Ripon-এর email change করতে ৩টা row update দরকার
  ❌ একটা miss করলে → inconsistent data!
```

### 1NF (First Normal Form)

**Rule:** প্রতিটি column-এ atomic (একক) value থাকবে, repeating groups থাকবে না।

```
❌ 1NF ভঙ্গ:
┌─────┬───────┬──────────────────────┐
│ id  │ name  │ phones               │
├─────┼───────┼──────────────────────┤
│ 1   │ Ripon │ 01712345678, 01898765│  ← একটা cell-এ ২টা value!
└─────┴───────┴──────────────────────┘

✅ 1NF:
┌─────┬───────┬──────────────┐
│ id  │ name  │ phone        │
├─────┼───────┼──────────────┤
│ 1   │ Ripon │ 01712345678  │
│ 1   │ Ripon │ 01898765432  │
└─────┴───────┴──────────────┘

বা আলাদা table:
phones: { id, user_id, phone_number }
```

### 2NF (Second Normal Form)

**Rule:** 1NF + প্রতিটি non-key column পুরো primary key-এর উপর নির্ভরশীল (partial dependency নেই)।

```
❌ 2NF ভঙ্গ (Composite PK: order_id + product_id):
┌──────────┬────────────┬──────────┬───────────────┐
│ order_id │ product_id │ quantity │ product_name  │
├──────────┼────────────┼──────────┼───────────────┤
│ 1        │ 101        │ 2        │ Laptop        │  ← product_name শুধু
│ 1        │ 102        │ 1        │ Mouse         │     product_id-এর উপর
│ 2        │ 101        │ 1        │ Laptop        │     নির্ভরশীল, order_id না
└──────────┴────────────┴──────────┴───────────────┘

✅ 2NF:
order_items: { order_id, product_id, quantity }
products:    { product_id, product_name }
```

### 3NF (Third Normal Form)

**Rule:** 2NF + কোনো non-key column অন্য non-key column-এর উপর নির্ভরশীল না (transitive dependency নেই)।

```
❌ 3NF ভঙ্গ:
┌─────┬───────┬─────────────┬──────────────┐
│ id  │ name  │ department  │ dept_manager │
├─────┼───────┼─────────────┼──────────────┤
│ 1   │ Ripon │ Engineering │ Karim        │  ← dept_manager নির্ভর করে
│ 2   │ Jakir │ Engineering │ Karim        │     department-এর উপর, id-এর না
│ 3   │ Rahim │ Marketing   │ Sumon        │
└─────┴───────┴─────────────┴──────────────┘

✅ 3NF:
employees:   { id, name, department_id }
departments: { id, name, manager_id }
```

### Normalization Summary

```
Form  Rule                                  সমাধান
─────────────────────────────────────────────────────────────
1NF   Atomic values, no repeating groups    আলাদা row/table
2NF   No partial dependency                 আলাদা table (full PK dependency)
3NF   No transitive dependency              আলাদা table (non-key → non-key বাদ)
BCNF  Every determinant is a candidate key  Advanced (rare in practice)
```

```
বেশিরভাগ real project-এ 3NF যথেষ্ট।
BCNF/4NF/5NF academic — production-এ rarely দরকার।
```

---

## Denormalization (ডিনরমালাইজেশন)

Performance-এর জন্য **ইচ্ছাকৃতভাবে redundancy রাখা** — Normalization-এর opposite:

### কখন Denormalize করবে?

```
Normalized (3NF):
  SELECT p.title, u.name, COUNT(c.id) as comment_count
  FROM posts p
  JOIN users u ON p.user_id = u.id
  LEFT JOIN comments c ON c.post_id = p.id
  GROUP BY p.id, u.name;
  → 3টা table JOIN + COUNT → complex, slow (বড় data-তে)

Denormalized:
  SELECT title, author_name, comment_count
  FROM posts;
  → Single table, no JOIN → fast! ⚡
```

### Denormalization Techniques

```sql
-- ১. Computed/Cached Column
ALTER TABLE posts ADD COLUMN comment_count INTEGER DEFAULT 0;

-- Comment add/delete হলে update করো:
UPDATE posts SET comment_count = comment_count + 1 WHERE id = $1;

-- ২. Duplicated Column
ALTER TABLE posts ADD COLUMN author_name VARCHAR(100);

-- ৩. Summary Table
CREATE TABLE daily_stats (
    date DATE PRIMARY KEY,
    total_orders INTEGER,
    total_revenue DECIMAL,
    new_users INTEGER
);
```

### Normalization vs Denormalization

```
Normalization:
  ✅ কম redundancy
  ✅ Data integrity
  ✅ Write-friendly (update একবার)
  ❌ Complex JOINs
  ❌ Read slow (বড় data-তে)

Denormalization:
  ✅ Read fast (JOIN কম)
  ✅ Simple queries
  ❌ Data redundancy
  ❌ Write complex (একাধিক জায়গায় update)
  ❌ Inconsistency risk

Rule: Normalize first, denormalize where needed for performance
```

---

## ACID Properties

Database transaction-এর ৪টি মৌলিক বৈশিষ্ট্য:

### A — Atomicity (পারমাণবিকতা)

```
Transaction-এর সব operation হয় সব succeed করবে, নয়তো সব fail করবে।
"All or Nothing"

Bank Transfer: Ripon → Karim ৫০০০ টাকা
  Step 1: Ripon-এর balance থেকে ৫০০০ কমাও
  Step 2: Karim-এর balance-এ ৫০০০ যোগ করো

  ✅ দুটোই success → Commit
  ❌ Step 2 fail → Step 1-ও rollback (Ripon-এর টাকা ফেরত)

  Step 1 success + Step 2 fail → Ripon-এর টাকা কমলো কিন্তু Karim পেলো না!
  → এটা যেন না হয় সেটাই Atomicity নিশ্চিত করে
```

### C — Consistency (সামঞ্জস্যতা)

```
Transaction-এর পরে database সবসময় valid state-এ থাকবে।
সব constraints (NOT NULL, UNIQUE, FK, CHECK) মানবে।

balance >= 0 constraint আছে:
  Ripon balance: ৩০০০
  Transfer: ৫০০০ → ❌ Rejected! (balance negative হয়ে যাবে)
  → Database consistent থাকলো
```

### I — Isolation (বিচ্ছিন্নতা)

```
একাধিক transaction একসাথে চললেও একটা আরেকটার intermediate state দেখবে না।

Transaction A: Ripon-এর balance পড়ে → ১০০০০
Transaction B: Ripon-এর balance পড়ে → ১০০০০

A: balance - ৫০০০ = ৫০০০ → Write
B: balance - ৩০০০ = ৭০০০ → Write

Isolation ছাড়া: Final balance = ৭০০০ (A-এর write হারিয়ে গেলো!)
Isolation সহ: Transactions sequential → Final balance = ২০০০ ✅
```

### D — Durability (স্থায়িত্ব)

```
Transaction commit হয়ে গেলে data permanently saved — server crash হলেও data থাকবে।

Commit → Disk-এ write → Server crash → Restart → Data আছে! ✅
```

### ACID Summary

```
A → Atomicity   → All or Nothing (সব succeed বা সব rollback)
C → Consistency  → Valid state always (constraints মানবে)
I → Isolation    → Concurrent transactions interfere করবে না
D → Durability   → Commit = permanent (crash-proof)

ACID মানে → Relational databases (PostgreSQL, MySQL)
ACID partially → NoSQL (MongoDB 4.0+ multi-doc transactions)
```

---

## Transactions

### SQL Transaction

```sql
BEGIN;

UPDATE accounts SET balance = balance - 5000 WHERE user_id = 1;
UPDATE accounts SET balance = balance + 5000 WHERE user_id = 2;

-- সব ঠিক থাকলে
COMMIT;

-- সমস্যা হলে
-- ROLLBACK;
```

### Node.js Transaction (PostgreSQL)

```javascript
const { Pool } = require("pg");
const pool = new Pool();

async function transferMoney(fromId, toId, amount) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const sender = await client.query(
      "SELECT balance FROM accounts WHERE user_id = $1 FOR UPDATE",
      [fromId],
    );

    if (sender.rows[0].balance < amount) {
      throw new Error("Insufficient balance");
    }

    await client.query(
      "UPDATE accounts SET balance = balance - $1 WHERE user_id = $2",
      [amount, fromId],
    );

    await client.query(
      "UPDATE accounts SET balance = balance + $1 WHERE user_id = $2",
      [amount, toId],
    );

    await client.query("COMMIT");
    return { success: true };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}
```

### Prisma Transaction

```javascript
await prisma.$transaction(async (tx) => {
  const sender = await tx.account.findUnique({ where: { userId: fromId } });

  if (sender.balance < amount) {
    throw new Error("Insufficient balance");
  }

  await tx.account.update({
    where: { userId: fromId },
    data: { balance: { decrement: amount } },
  });

  await tx.account.update({
    where: { userId: toId },
    data: { balance: { increment: amount } },
  });
});
```

### Mongoose Transaction (MongoDB)

```javascript
const session = await mongoose.startSession();

try {
  session.startTransaction();

  await Account.updateOne(
    { userId: fromId },
    { $inc: { balance: -amount } },
    { session },
  );

  await Account.updateOne(
    { userId: toId },
    { $inc: { balance: amount } },
    { session },
  );

  await session.commitTransaction();
} catch (error) {
  await session.abortTransaction();
  throw error;
} finally {
  session.endSession();
}
```

### Isolation Levels

```
Level              Dirty Read  Non-Repeatable Read  Phantom Read
─────────────────────────────────────────────────────────────────
READ UNCOMMITTED   ✅ Possible  ✅ Possible           ✅ Possible
READ COMMITTED     ❌ No        ✅ Possible           ✅ Possible
REPEATABLE READ    ❌ No        ❌ No                 ✅ Possible
SERIALIZABLE       ❌ No        ❌ No                 ❌ No

PostgreSQL default: READ COMMITTED
MySQL default: REPEATABLE READ

Higher isolation → More safe → More slow (lock বেশি)
```

```
Dirty Read:        Uncommitted data পড়া
Non-Repeatable:    Same row আবার পড়লে different value
Phantom Read:      Same query আবার চালালে নতুন/কম rows
```

---

## CAP Theorem

Distributed system-এ ৩টা guarantee-র মধ্যে **একসাথে সবচেয়ে বেশি ২টা** পাওয়া যায়:

```
C — Consistency  → সব node same data দেখবে (same time-এ)
A — Availability → প্রতিটি request-এ response আসবে (error হলেও)
P — Partition Tolerance → Network failure হলেও system চলবে

CAP Theorem: তুমি সবচেয়ে বেশি ২টা choose করতে পারো
```

```
        C (Consistency)
       / \
      /   \
     /     \
    CP      CA
   /         \
  /           \
 P ─── AP ──── A
(Partition)    (Availability)
```

### CAP Combinations

```
CP (Consistency + Partition Tolerance):
  Network fail → system available না-ও হতে পারে, কিন্তু data consistent
  উদাহরণ: MongoDB (default), HBase, Redis (cluster)
  Use case: Banking, inventory (wrong data দেওয়ার চেয়ে unavailable ভালো)

AP (Availability + Partition Tolerance):
  Network fail → system available, কিন্তু data temporarily inconsistent
  উদাহরণ: Cassandra, DynamoDB, CouchDB
  Use case: Social media feed, analytics (stale data চলে, down হওয়া চলে না)

CA (Consistency + Availability):
  Network fail handle করে না → single node system
  উদাহরণ: Traditional RDBMS (single server PostgreSQL)
  Real distributed system-এ CA practically impossible (network fail হবেই)
```

```
বাস্তবে:
  Network partition কম হয় → বেশিরভাগ সময় CP ও AP দুটোই কাজ করে
  Partition হলে → choose: consistency (wait) or availability (stale data)

PACELC:
  Partition হলে → A or C?
  Else (normal) → Latency or Consistency?
```

---

## SQL vs NoSQL

```
Feature           SQL (Relational)        NoSQL
──────────────────────────────────────────────────────
Structure         Table (rows, columns)   Document, Key-Value, Graph
Schema            Fixed (ALTER TABLE)     Flexible (schemaless)
Relationships     JOIN, Foreign Keys      Embedded/Referenced
Scaling           Vertical (bigger server) Horizontal (more servers)
ACID              ✅ Full                  🟡 Partial (varies)
Query Language    SQL                     Database-specific
Best For          Complex relations       Large scale, flexible data
Examples          PostgreSQL, MySQL       MongoDB, Redis, Cassandra
```

### কখন কোনটা?

```
SQL ব্যবহার করো:
  ✅ Complex relationships (e-commerce, banking)
  ✅ ACID transactions critical
  ✅ Data structure fixed/known
  ✅ Complex queries (JOINs, aggregations)

NoSQL ব্যবহার করো:
  ✅ Schema frequently change হয়
  ✅ Massive scale (millions of reads/writes)
  ✅ Flexible/nested data (JSON-like)
  ✅ Simple queries (key-value lookup)
  ✅ Real-time data (chat, IoT, gaming)
```

---

## Schema Design — MongoDB Example

### Embedded (Denormalized)

```javascript
// একই document-এ related data রাখো
{
    _id: ObjectId("..."),
    title: "My Post",
    content: "...",
    author: {                    // Embedded
        name: "Ripon",
        email: "ripon@test.com"
    },
    comments: [                  // Embedded array
        { text: "Great!", user: "Karim", date: "2026-02-18" },
        { text: "Nice!", user: "Jakir", date: "2026-02-18" }
    ]
}

// ✅ Single query-তে সব data পাবে (fast read)
// ❌ Author info change করলে সব post update করতে হবে
// ❌ Comments বাড়লে document size limit (16MB)
```

### Referenced (Normalized)

```javascript
// আলাদা collection, reference রাখো
// posts
{
    _id: ObjectId("..."),
    title: "My Post",
    content: "...",
    authorId: ObjectId("user_789"),  // Reference
}

// users
{
    _id: ObjectId("user_789"),
    name: "Ripon",
    email: "ripon@test.com"
}

// comments
{
    _id: ObjectId("..."),
    text: "Great!",
    postId: ObjectId("post_123"),
    userId: ObjectId("user_456")
}

// ✅ No redundancy, update একবারেই
// ❌ Multiple queries / $lookup (JOIN equivalent)
```

### কখন Embed, কখন Reference?

```
Embed করো:
  ✅ Data সবসময় একসাথে read হয়
  ✅ Child data ছোট ও limited
  ✅ 1:1 বা 1:Few relationship

Reference করো:
  ✅ Data independently access হয়
  ✅ Many-to-Many relationship
  ✅ Child data বড় বা unlimited
  ✅ Data frequently update হয়
```

---

## সংক্ষেপে মনে রাখার সূত্র

```
Database Design Steps:
  Requirements → ER Diagram → Tables → Normalize → Indexes → Denormalize (if needed)

Normalization:
  1NF → Atomic values
  2NF → No partial dependency
  3NF → No transitive dependency
  → Redundancy কমাও, integrity বাড়াও

Denormalization:
  → Read performance-এর জন্য ইচ্ছাকৃত redundancy
  → "Normalize first, denormalize where needed"

ACID:
  A → All or Nothing (transaction)
  C → Valid state always
  I → Concurrent transactions isolated
  D → Commit = permanent

CAP Theorem:
  C + A + P → সবচেয়ে বেশি ২টা পাবে
  CP → Consistency + Partition (MongoDB)
  AP → Availability + Partition (Cassandra)
  CA → Single server only (traditional RDBMS)

SQL vs NoSQL:
  SQL → Fixed schema, JOINs, ACID, complex relations
  NoSQL → Flexible schema, horizontal scale, simple queries

MongoDB Schema:
  Embed → Data একসাথে read হয়, ছোট, 1:Few
  Reference → Independent access, M:N, বড়, frequently update
```

---

## Interview Golden Lines

> **Normalization eliminates data redundancy — 1NF removes repeating groups, 2NF removes partial dependencies, 3NF removes transitive dependencies.**

> **Denormalization trades write complexity for read performance — add computed columns or duplicate data to avoid expensive JOINs.**

> **ACID ensures transaction reliability: Atomicity (all or nothing), Consistency (valid state), Isolation (concurrent safety), Durability (crash-proof).**

> **CAP theorem states that in a distributed system, you can guarantee at most 2 of 3: Consistency, Availability, and Partition Tolerance.**

> **Choose SQL for complex relationships and ACID transactions; choose NoSQL for flexible schemas, horizontal scaling, and high-throughput simple queries.**

> **In MongoDB, embed data that's always read together (1:Few), reference data that's accessed independently or in Many-to-Many relationships.**
