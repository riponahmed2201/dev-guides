# SQL Queries (এসকিউএল কোয়েরি)

## SQL কী?

**SQL (Structured Query Language)** হলো relational database-এর সাথে কথা বলার ভাষা — data create, read, update, delete (CRUD) করা, table তৈরি করা, relationship define করা — সব SQL দিয়ে হয়।

```
Application → SQL Query → Database → Result → Application

app.get('/users') → "SELECT * FROM users" → PostgreSQL → [{...}, {...}] → JSON response
```

> **SQL শিখলে কেন উপকার?** PostgreSQL, MySQL, SQLite, SQL Server, Oracle — সব relational database-এ SQL কাজ করে। ORM ব্যবহার করলেও SQL জানা থাকলে debugging, optimization, ও complex queries অনেক সহজ হয়।

---

## Database ও Table তৈরি (DDL)

### CREATE TABLE

```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'user',
    is_active BOOLEAN DEFAULT true,
    bio TEXT,
    age INTEGER CHECK (age >= 13 AND age <= 150),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE posts (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    slug VARCHAR(250) UNIQUE,
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
    view_count INTEGER DEFAULT 0,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE comments (
    id SERIAL PRIMARY KEY,
    text TEXT NOT NULL,
    post_id INTEGER NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Many-to-Many → Junction table
CREATE TABLE post_tags (
    post_id INTEGER REFERENCES posts(id) ON DELETE CASCADE,
    tag_id INTEGER REFERENCES tags(id) ON DELETE CASCADE,
    PRIMARY KEY (post_id, tag_id)
);

CREATE TABLE tags (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL
);
```

### Common Data Types

```
Type              PostgreSQL          MySQL              ব্যবহার
──────────────────────────────────────────────────────────────────
Integer           INTEGER/INT         INT                পূর্ণসংখ্যা
Big Integer       BIGINT              BIGINT             বড় সংখ্যা
Auto ID           SERIAL              AUTO_INCREMENT     Auto-increment PK
UUID              UUID                CHAR(36)           Unique ID
String (fixed)    VARCHAR(n)          VARCHAR(n)         নাম, email
Text              TEXT                TEXT               বড় text (bio, content)
Boolean           BOOLEAN             TINYINT(1)         true/false
Decimal           DECIMAL(10,2)       DECIMAL(10,2)      টাকা (precision)
Float             REAL/FLOAT          FLOAT              আনুমানিক সংখ্যা
Date              DATE                DATE               তারিখ
Timestamp         TIMESTAMP           DATETIME           তারিখ + সময়
JSON              JSONB               JSON               JSON data
Array             INTEGER[]           N/A                Array (PG only)
```

### ALTER TABLE

```sql
-- Column add
ALTER TABLE users ADD COLUMN phone VARCHAR(15);

-- Column type change
ALTER TABLE users ALTER COLUMN name TYPE VARCHAR(200);

-- Column delete
ALTER TABLE users DROP COLUMN bio;

-- Default value change
ALTER TABLE users ALTER COLUMN role SET DEFAULT 'member';

-- NOT NULL add
ALTER TABLE users ALTER COLUMN phone SET NOT NULL;

-- Constraint add
ALTER TABLE users ADD CONSTRAINT check_age CHECK (age >= 0);

-- Index add
CREATE INDEX idx_users_email ON users(email);

-- Table rename
ALTER TABLE users RENAME TO members;

-- Column rename
ALTER TABLE users RENAME COLUMN name TO full_name;
```

### DROP

```sql
DROP TABLE IF EXISTS comments;
DROP TABLE IF EXISTS posts;
DROP TABLE IF EXISTS users;

-- Cascade → dependent objects-ও delete
DROP TABLE users CASCADE;
```

---

## CRUD Operations (DML)

### INSERT (Create)

```sql
-- Single row
INSERT INTO users (name, email, password, role)
VALUES ('Ripon', 'ripon@test.com', '$2b$12$hash...', 'admin');

-- Multiple rows
INSERT INTO users (name, email, password) VALUES
    ('Karim', 'karim@test.com', '$2b$12$hash1...'),
    ('Jakir', 'jakir@test.com', '$2b$12$hash2...'),
    ('Rahim', 'rahim@test.com', '$2b$12$hash3...');

-- Insert ও return generated data
INSERT INTO users (name, email, password)
VALUES ('Sumon', 'sumon@test.com', '$2b$12$hash...')
RETURNING id, name, email, created_at;

-- Insert from another table
INSERT INTO archived_users (name, email)
SELECT name, email FROM users WHERE is_active = false;
```

### SELECT (Read)

```sql
-- সব data
SELECT * FROM users;

-- নির্দিষ্ট columns
SELECT id, name, email FROM users;

-- Alias
SELECT name AS user_name, email AS user_email FROM users;

-- DISTINCT (unique values)
SELECT DISTINCT role FROM users;

-- LIMIT ও OFFSET (pagination)
SELECT * FROM users LIMIT 20 OFFSET 40;  -- page 3, 20 per page
```

### WHERE (Filter)

```sql
-- Exact match
SELECT * FROM users WHERE role = 'admin';

-- Comparison
SELECT * FROM users WHERE age > 25;
SELECT * FROM users WHERE age BETWEEN 18 AND 65;

-- NULL check
SELECT * FROM users WHERE bio IS NULL;
SELECT * FROM users WHERE bio IS NOT NULL;

-- Pattern matching
SELECT * FROM users WHERE name LIKE 'R%';       -- R দিয়ে শুরু
SELECT * FROM users WHERE email LIKE '%@gmail%'; -- gmail আছে
SELECT * FROM users WHERE name ILIKE '%ripon%';  -- case-insensitive (PG)

-- IN (multiple values)
SELECT * FROM users WHERE role IN ('admin', 'editor', 'moderator');

-- NOT
SELECT * FROM users WHERE role NOT IN ('banned', 'suspended');
SELECT * FROM users WHERE NOT is_active;

-- Multiple conditions
SELECT * FROM users WHERE role = 'admin' AND is_active = true;
SELECT * FROM users WHERE role = 'admin' OR role = 'editor';
SELECT * FROM users WHERE (role = 'admin' OR role = 'editor') AND is_active = true;
```

### ORDER BY (Sort)

```sql
-- Ascending (default)
SELECT * FROM users ORDER BY name ASC;

-- Descending
SELECT * FROM users ORDER BY created_at DESC;

-- Multiple columns
SELECT * FROM users ORDER BY role ASC, created_at DESC;

-- NULL handling
SELECT * FROM users ORDER BY age NULLS LAST;
```

### UPDATE

```sql
-- Single row
UPDATE users SET name = 'Ripon Hossain', updated_at = NOW()
WHERE id = 1;

-- Multiple columns
UPDATE users SET role = 'editor', is_active = true
WHERE email = 'karim@test.com';

-- Conditional update
UPDATE users SET role = 'verified'
WHERE created_at < NOW() - INTERVAL '30 days' AND role = 'user';

-- Update with RETURNING
UPDATE users SET role = 'admin' WHERE id = 1
RETURNING id, name, role;

-- Increment
UPDATE posts SET view_count = view_count + 1 WHERE id = 1;
```

### DELETE

```sql
-- Single row
DELETE FROM users WHERE id = 5;

-- Multiple rows
DELETE FROM users WHERE is_active = false;

-- Delete all (careful!)
DELETE FROM users;

-- Soft delete (recommended)
UPDATE users SET is_active = false, deleted_at = NOW() WHERE id = 5;
```

---

## JOINs

একাধিক table থেকে related data একসাথে আনা:

```
users:                    posts:
┌────┬───────┐            ┌────┬─────────┬─────────┐
│ id │ name  │            │ id │ title   │ user_id │
├────┼───────┤            ├────┼─────────┼─────────┤
│ 1  │ Ripon │            │ 1  │ Post A  │ 1       │
│ 2  │ Karim │            │ 2  │ Post B  │ 1       │
│ 3  │ Jakir │            │ 3  │ Post C  │ 2       │
└────┴───────┘            │ 4  │ Post D  │ NULL    │
                          └────┴─────────┴─────────┘
```

### INNER JOIN

```sql
-- শুধু match আছে এমন rows
SELECT u.name, p.title
FROM users u
INNER JOIN posts p ON u.id = p.user_id;

-- Result:
-- Ripon  | Post A
-- Ripon  | Post B
-- Karim  | Post C
-- (Jakir নেই — কোনো post নেই, Post D নেই — user_id NULL)
```

### LEFT JOIN

```sql
-- বাম table-র সব rows + ডান table-র matching rows (না থাকলে NULL)
SELECT u.name, p.title
FROM users u
LEFT JOIN posts p ON u.id = p.user_id;

-- Result:
-- Ripon  | Post A
-- Ripon  | Post B
-- Karim  | Post C
-- Jakir  | NULL      ← Jakir-এর post নেই, তবুও দেখাচ্ছে
```

### RIGHT JOIN

```sql
-- ডান table-র সব rows + বাম table-র matching rows
SELECT u.name, p.title
FROM users u
RIGHT JOIN posts p ON u.id = p.user_id;

-- Result:
-- Ripon  | Post A
-- Ripon  | Post B
-- Karim  | Post C
-- NULL   | Post D    ← Post D-র user নেই, তবুও দেখাচ্ছে
```

### FULL OUTER JOIN

```sql
-- দুই table-র সব rows (match না থাকলে NULL)
SELECT u.name, p.title
FROM users u
FULL OUTER JOIN posts p ON u.id = p.user_id;

-- Result: সব rows — Jakir (NULL post) ও Post D (NULL user) দুটোই আছে
```

### Multiple JOINs

```sql
-- User + Posts + Comments একসাথে
SELECT
    u.name AS author,
    p.title AS post_title,
    c.text AS comment_text,
    cu.name AS commenter
FROM posts p
INNER JOIN users u ON p.user_id = u.id
LEFT JOIN comments c ON c.post_id = p.id
LEFT JOIN users cu ON c.user_id = cu.id
WHERE p.status = 'published'
ORDER BY p.created_at DESC;
```

### Self JOIN

```sql
-- Employee ও তার Manager (same table)
SELECT
    e.name AS employee,
    m.name AS manager
FROM employees e
LEFT JOIN employees m ON e.manager_id = m.id;
```

```
JOIN Summary:
──────────────────────────────────────────
INNER JOIN  → শুধু দুই পাশে match
LEFT JOIN   → বামের সব + ডানের match (NULL if no match)
RIGHT JOIN  → ডানের সব + বামের match
FULL JOIN   → দুই পাশের সব
CROSS JOIN  → Every row × every row (cartesian product)
SELF JOIN   → Same table নিজের সাথে join
```

---

## Aggregate Functions

### Basic Aggregates

```sql
SELECT COUNT(*) AS total_users FROM users;
SELECT COUNT(*) AS active_users FROM users WHERE is_active = true;

SELECT AVG(age) AS average_age FROM users;
SELECT MIN(age) AS youngest, MAX(age) AS oldest FROM users;
SELECT SUM(view_count) AS total_views FROM posts;
```

### GROUP BY

```sql
-- প্রতিটি role-এ কতজন user
SELECT role, COUNT(*) AS count
FROM users
GROUP BY role;
-- admin  | 2
-- editor | 5
-- user   | 100

-- প্রতিটি user-এর post count
SELECT u.name, COUNT(p.id) AS post_count
FROM users u
LEFT JOIN posts p ON u.id = p.user_id
GROUP BY u.id, u.name
ORDER BY post_count DESC;

-- মাসভিত্তিক registration
SELECT
    DATE_TRUNC('month', created_at) AS month,
    COUNT(*) AS signups
FROM users
GROUP BY DATE_TRUNC('month', created_at)
ORDER BY month DESC;
```

### HAVING (Group Filter)

```sql
-- যেসব user-এর 5-এর বেশি post আছে
SELECT u.name, COUNT(p.id) AS post_count
FROM users u
JOIN posts p ON u.id = p.user_id
GROUP BY u.id, u.name
HAVING COUNT(p.id) > 5
ORDER BY post_count DESC;

-- WHERE vs HAVING:
-- WHERE → row-level filter (GROUP BY-এর আগে)
-- HAVING → group-level filter (GROUP BY-এর পরে)
```

---

## Subqueries

### WHERE-এ Subquery

```sql
-- যেসব user কমপক্ষে একটা post লিখেছে
SELECT * FROM users
WHERE id IN (SELECT DISTINCT user_id FROM posts);

-- Average-এর চেয়ে বেশি view আছে এমন posts
SELECT * FROM posts
WHERE view_count > (SELECT AVG(view_count) FROM posts);

-- সবচেয়ে বেশি post লেখা user
SELECT * FROM users
WHERE id = (
    SELECT user_id FROM posts
    GROUP BY user_id
    ORDER BY COUNT(*) DESC
    LIMIT 1
);
```

### FROM-এ Subquery (Derived Table)

```sql
-- প্রতিটি user-এর post count সহ
SELECT u.name, stats.post_count
FROM users u
JOIN (
    SELECT user_id, COUNT(*) AS post_count
    FROM posts
    GROUP BY user_id
) stats ON u.id = stats.user_id
ORDER BY stats.post_count DESC;
```

### EXISTS

```sql
-- যেসব user-এর কমপক্ষে একটা published post আছে
SELECT u.name FROM users u
WHERE EXISTS (
    SELECT 1 FROM posts p
    WHERE p.user_id = u.id AND p.status = 'published'
);

-- EXISTS vs IN:
-- EXISTS → correlated subquery, বড় dataset-এ faster
-- IN → subquery result cache হয়, ছোট result-এ faster
```

---

## Common Table Expressions (CTE)

```sql
-- WITH clause — complex query readable করে
WITH active_authors AS (
    SELECT user_id, COUNT(*) AS post_count
    FROM posts
    WHERE status = 'published'
    GROUP BY user_id
    HAVING COUNT(*) >= 3
)
SELECT u.name, u.email, aa.post_count
FROM users u
JOIN active_authors aa ON u.id = aa.user_id
ORDER BY aa.post_count DESC;
```

### Recursive CTE

```sql
-- Category tree (parent-child hierarchy)
WITH RECURSIVE category_tree AS (
    -- Base case: top-level categories
    SELECT id, name, parent_id, 0 AS depth
    FROM categories
    WHERE parent_id IS NULL

    UNION ALL

    -- Recursive: children
    SELECT c.id, c.name, c.parent_id, ct.depth + 1
    FROM categories c
    JOIN category_tree ct ON c.parent_id = ct.id
)
SELECT * FROM category_tree ORDER BY depth, name;

-- Output:
-- Electronics        (depth 0)
--   Laptops          (depth 1)
--     Gaming Laptops (depth 2)
--   Phones           (depth 1)
-- Clothing           (depth 0)
--   Men              (depth 1)
```

---

## Window Functions

GROUP BY ছাড়াই aggregate — প্রতিটি row-তে aggregate value দেখাও:

```sql
-- প্রতিটি post-এর পাশে user-এর total post count
SELECT
    title,
    user_id,
    COUNT(*) OVER (PARTITION BY user_id) AS user_total_posts
FROM posts;

-- Row number (ranking)
SELECT
    name,
    role,
    ROW_NUMBER() OVER (ORDER BY created_at) AS row_num,
    RANK() OVER (ORDER BY age DESC) AS age_rank
FROM users;

-- Running total
SELECT
    created_at::date AS date,
    COUNT(*) AS daily_signups,
    SUM(COUNT(*)) OVER (ORDER BY created_at::date) AS cumulative_total
FROM users
GROUP BY created_at::date
ORDER BY date;
```

### Common Window Functions

```sql
ROW_NUMBER()  → Sequential number (1, 2, 3...)
RANK()        → Rank with gaps (1, 2, 2, 4)
DENSE_RANK()  → Rank without gaps (1, 2, 2, 3)
LAG(col, n)   → Previous row-এর value
LEAD(col, n)  → Next row-এর value
FIRST_VALUE() → Partition-এর first value
LAST_VALUE()  → Partition-এর last value
NTILE(n)      → n groups-এ ভাগ করো
```

---

## Practical Query Examples

### E-Commerce Dashboard

```sql
-- ১. আজকের order summary
SELECT
    COUNT(*) AS total_orders,
    SUM(total) AS revenue,
    AVG(total) AS avg_order_value,
    COUNT(DISTINCT user_id) AS unique_customers
FROM orders
WHERE created_at >= CURRENT_DATE;

-- ২. Top 10 selling products (this month)
SELECT
    p.name,
    SUM(oi.quantity) AS units_sold,
    SUM(oi.quantity * oi.price) AS revenue
FROM order_items oi
JOIN products p ON oi.product_id = p.id
JOIN orders o ON oi.order_id = o.id
WHERE o.created_at >= DATE_TRUNC('month', CURRENT_DATE)
GROUP BY p.id, p.name
ORDER BY revenue DESC
LIMIT 10;

-- ৩. User-দের recent order সহ
SELECT
    u.name,
    u.email,
    o.id AS last_order_id,
    o.total AS last_order_total,
    o.created_at AS last_order_date
FROM users u
LEFT JOIN LATERAL (
    SELECT * FROM orders
    WHERE user_id = u.id
    ORDER BY created_at DESC
    LIMIT 1
) o ON true
ORDER BY o.created_at DESC NULLS LAST;
```

### Blog Analytics

```sql
-- ৪. Most popular posts (views + comments)
SELECT
    p.title,
    p.view_count,
    COUNT(c.id) AS comment_count,
    u.name AS author
FROM posts p
JOIN users u ON p.user_id = u.id
LEFT JOIN comments c ON c.post_id = p.id
WHERE p.status = 'published'
GROUP BY p.id, p.title, p.view_count, u.name
ORDER BY p.view_count DESC, comment_count DESC
LIMIT 20;

-- ৫. User activity summary
SELECT
    u.name,
    COUNT(DISTINCT p.id) AS posts,
    COUNT(DISTINCT c.id) AS comments,
    COALESCE(SUM(p.view_count), 0) AS total_views,
    MAX(GREATEST(p.created_at, c.created_at)) AS last_activity
FROM users u
LEFT JOIN posts p ON p.user_id = u.id
LEFT JOIN comments c ON c.user_id = u.id
GROUP BY u.id, u.name
ORDER BY last_activity DESC;
```

---

## সংক্ষেপে মনে রাখার সূত্র

```
SQL Categories:
  DDL → CREATE, ALTER, DROP (structure)
  DML → INSERT, SELECT, UPDATE, DELETE (data)
  DCL → GRANT, REVOKE (permissions)
  TCL → BEGIN, COMMIT, ROLLBACK (transactions)

CRUD:
  Create → INSERT INTO ... VALUES
  Read   → SELECT ... FROM ... WHERE
  Update → UPDATE ... SET ... WHERE
  Delete → DELETE FROM ... WHERE

JOINs:
  INNER  → শুধু match
  LEFT   → বামের সব + ডানের match
  RIGHT  → ডানের সব + বামের match
  FULL   → সবার সব

Aggregates:
  COUNT, SUM, AVG, MIN, MAX
  GROUP BY → group করো
  HAVING → group filter (WHERE-এর মতো কিন্তু group-এ)

Advanced:
  Subquery → Query-র মধ্যে query
  CTE      → WITH clause (readable subquery)
  Window   → ROW_NUMBER, RANK, LAG, LEAD (OVER PARTITION BY)

Query Order of Execution:
  FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY → LIMIT
```

---

## Interview Golden Lines

> **JOINs combine data from related tables — INNER returns only matches, LEFT returns all from the left table with NULLs for non-matches.**

> **GROUP BY aggregates rows sharing column values; HAVING filters groups after aggregation, while WHERE filters individual rows before.**

> **Window functions like ROW_NUMBER and RANK compute values across related rows without collapsing them into groups like GROUP BY does.**

> **CTEs (WITH clause) make complex queries readable and reusable — recursive CTEs handle hierarchical data like category trees.**

> **EXISTS is typically faster than IN for large subquery results because it short-circuits on the first match.**

> **SQL execution order is FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY → LIMIT — knowing this helps debug unexpected results.**
