# GraphQL (গ্রাফকিউএল)

## GraphQL কী?

**GraphQL** হলো API-এর জন্য একটি **query language** এবং runtime। Facebook ২০১২ সালে internally তৈরি করে এবং ২০১৫ সালে open-source করে।

REST-এ server ঠিক করে কোন data দেবে — GraphQL-এ **client ঠিক করে কোন data চায়**।

```
REST:     Server বলে "এই নাও সব data"     → Client-এর যা দরকার নয় তাও আসে
GraphQL:  Client বলে "আমার এটুকু দরকার"   → ঠিক ততটুকুই আসে
```

```
REST:
GET /api/users/42  → { id, name, email, phone, bio, avatar, address, created_at, ... }
                     শুধু name আর email দরকার ছিল!

GraphQL:
query {
  user(id: 42) {
    name
    email
  }
}
→ { "name": "Ripon", "email": "ripon@example.com" }
  ঠিক যা চেয়েছি তা-ই এসেছে!
```

---

## কেন GraphQL তৈরি হলো?

Facebook-এর mobile app তৈরি করতে গিয়ে REST API-তে ৩টি বড় সমস্যা দেখা দিল:

### সমস্যা 1: Over-fetching (বেশি data আসা)

```
REST:
GET /api/users/42
→ { id, name, email, phone, bio, avatar, address, settings, ... }
  শুধু name দরকার ছিল কিন্তু 2KB data এলো!
  Mobile-এ bandwidth নষ্ট

GraphQL:
query { user(id: 42) { name } }
→ { "name": "Ripon" }
  শুধু 20 bytes!
```

### সমস্যা 2: Under-fetching (কম data আসা, multiple request লাগা)

```
একটা user profile page দেখাতে REST-এ:

GET /api/users/42           → User info          (Request 1)
GET /api/users/42/posts     → User-এর posts      (Request 2)
GET /api/users/42/followers → User-এর followers   (Request 3)
= 3টা আলাদা API call!

GraphQL-এ:
query {
  user(id: 42) {
    name
    email
    posts { title, created_at }
    followers { name, avatar }
  }
}
= 1টা API call-এ সব!
```

### সমস্যা 3: Multiple Endpoints Maintain করা কঠিন

```
REST:
/api/users
/api/users/:id
/api/users/:id/posts
/api/users/:id/followers
/api/posts
/api/posts/:id/comments
... endpoint বাড়তেই থাকে

GraphQL:
POST /graphql    ← একটাই endpoint!
```

---

## GraphQL কীভাবে কাজ করে?

### একটাই Endpoint

```
REST:  GET /api/users, POST /api/users, GET /api/posts/5/comments, ...
GraphQL: POST /graphql   ← সবসময় এই একটা URL-এ POST request
```

### ৩ ধরনের Operation

| Operation | কাজ | REST-এর সমতুল্য |
|-----------|-----|------------------|
| **Query** | Data পড়া | GET |
| **Mutation** | Data তৈরি/update/delete | POST, PUT, PATCH, DELETE |
| **Subscription** | Real-time data | WebSocket |

---

## Schema — GraphQL-এর ভিত্তি

Schema define করে **কোন data আছে এবং কীভাবে connected**। এটাই GraphQL-এর সবচেয়ে শক্তিশালী দিক।

### Type System

```graphql
type User {
  id: ID!
  name: String!
  email: String!
  age: Int
  is_active: Boolean!
  posts: [Post!]!
  profile: Profile
}

type Post {
  id: ID!
  title: String!
  content: String!
  author: User!
  comments: [Comment!]!
  created_at: String!
}

type Comment {
  id: ID!
  text: String!
  author: User!
  post: Post!
}

type Profile {
  bio: String
  avatar: String
  website: String
}
```

**Scalar Types:**

| Type | বর্ণনা | উদাহরণ |
|------|--------|--------|
| `String` | Text | `"Ripon"` |
| `Int` | Integer | `42` |
| `Float` | Decimal | `99.99` |
| `Boolean` | True/False | `true` |
| `ID` | Unique identifier | `"42"` |

**Type Modifiers:**

```graphql
String    → nullable (null হতে পারে)
String!   → non-nullable (null হতে পারবে না)
[String]  → nullable list of nullable strings
[String!] → nullable list of non-nullable strings
[String!]!→ non-nullable list of non-nullable strings
```

### Query Type — কী কী পড়া যায়

```graphql
type Query {
  user(id: ID!): User
  users(page: Int, limit: Int): [User!]!
  post(id: ID!): Post
  posts(author_id: ID): [Post!]!
  searchUsers(query: String!): [User!]!
}
```

### Mutation Type — কী কী পরিবর্তন করা যায়

```graphql
type Mutation {
  createUser(input: CreateUserInput!): User!
  updateUser(id: ID!, input: UpdateUserInput!): User!
  deleteUser(id: ID!): Boolean!
  createPost(input: CreatePostInput!): Post!
  addComment(postId: ID!, text: String!): Comment!
}

input CreateUserInput {
  name: String!
  email: String!
  age: Int
}

input UpdateUserInput {
  name: String
  email: String
  age: Int
}
```

### Subscription Type — Real-time

```graphql
type Subscription {
  newPost: Post!
  newComment(postId: ID!): Comment!
  userStatusChanged(userId: ID!): User!
}
```

---

## Query — Data পড়া (বিস্তারিত)

### Simple Query

```graphql
query {
  user(id: 42) {
    name
    email
  }
}
```

Response:

```json
{
  "data": {
    "user": {
      "name": "Ripon",
      "email": "ripon@example.com"
    }
  }
}
```

### Nested Query (Related Data একসাথে)

```graphql
query {
  user(id: 42) {
    name
    email
    posts {
      title
      created_at
      comments {
        text
        author {
          name
        }
      }
    }
  }
}
```

Response:

```json
{
  "data": {
    "user": {
      "name": "Ripon",
      "email": "ripon@example.com",
      "posts": [
        {
          "title": "GraphQL Guide",
          "created_at": "2026-02-18",
          "comments": [
            {
              "text": "Excellent!",
              "author": { "name": "Karim" }
            }
          ]
        }
      ]
    }
  }
}
```

> একটি request-এ user, তার posts, প্রতিটি post-এর comments, আর comment-এর author — সব এসে গেল! REST-এ ৪-৫টা API call লাগতো।

### Multiple Queries একসাথে

```graphql
query {
  user(id: 42) {
    name
  }
  recentPosts: posts(limit: 5) {
    title
  }
  stats {
    totalUsers
    totalPosts
  }
}
```

> একটা request-এ তিনটা আলাদা data একসাথে!

### Arguments ও Variables

```graphql
query GetUser($userId: ID!, $includesPosts: Boolean!) {
  user(id: $userId) {
    name
    email
    posts @include(if: $includesPosts) {
      title
    }
  }
}
```

Variables:

```json
{
  "userId": 42,
  "includesPosts": true
}
```

### Aliases — একই field আলাদা নামে

```graphql
query {
  admin: user(id: 1) {
    name
    email
  }
  regularUser: user(id: 42) {
    name
    email
  }
}
```

Response:

```json
{
  "data": {
    "admin": { "name": "Admin", "email": "admin@example.com" },
    "regularUser": { "name": "Ripon", "email": "ripon@example.com" }
  }
}
```

### Fragments — Reusable Field Sets

```graphql
fragment UserFields on User {
  id
  name
  email
  avatar
}

query {
  me {
    ...UserFields
    posts { title }
  }
  topUsers {
    ...UserFields
    followers_count
  }
}
```

> Repeat code কমায়। `UserFields` একবার define করে বারবার ব্যবহার।

---

## Mutation — Data পরিবর্তন

### Create

```graphql
mutation {
  createUser(input: {
    name: "Ripon Ahmed"
    email: "ripon@example.com"
    age: 28
  }) {
    id
    name
    email
    created_at
  }
}
```

Response:

```json
{
  "data": {
    "createUser": {
      "id": "42",
      "name": "Ripon Ahmed",
      "email": "ripon@example.com",
      "created_at": "2026-02-18T14:30:00Z"
    }
  }
}
```

### Update

```graphql
mutation {
  updateUser(id: "42", input: {
    name: "Ripon Ahmed (Updated)"
  }) {
    id
    name
    updated_at
  }
}
```

### Delete

```graphql
mutation {
  deleteUser(id: "42")
}
```

Response:

```json
{
  "data": {
    "deleteUser": true
  }
}
```

### Variables সহ Mutation

```graphql
mutation CreatePost($input: CreatePostInput!) {
  createPost(input: $input) {
    id
    title
    author {
      name
    }
  }
}
```

Variables:

```json
{
  "input": {
    "title": "GraphQL শিখি",
    "content": "GraphQL হলো API-এর জন্য একটি query language...",
    "published": true
  }
}
```

---

## Subscription — Real-time Data

WebSocket connection-এর মাধ্যমে server থেকে real-time update পাওয়া:

```graphql
subscription {
  newComment(postId: "5") {
    id
    text
    author {
      name
      avatar
    }
    created_at
  }
}
```

```
Client                          Server
  |                                |
  |── subscription newComment ────►|  (WebSocket connection)
  |                                |
  |◄── { text: "Great!" } ────────|  (কেউ comment করলেই)
  |◄── { text: "Thanks!" } ───────|  (আবার comment)
  |◄── { text: "Nice!" } ─────────|  (আবার...)
  |                                |
```

> Chat app, live notifications, real-time dashboard — এসবে subscription ব্যবহৃত হয়।

---

## Error Handling

GraphQL-এ error response-এর নিজস্ব format আছে:

```json
{
  "data": null,
  "errors": [
    {
      "message": "User not found",
      "locations": [{ "line": 2, "column": 3 }],
      "path": ["user"],
      "extensions": {
        "code": "NOT_FOUND",
        "status": 404
      }
    }
  ]
}
```

**Partial errors — কিছু data আসে, কিছু error:**

```graphql
query {
  user(id: 42) { name }
  deletedUser: user(id: 999) { name }
}
```

```json
{
  "data": {
    "user": { "name": "Ripon" },
    "deletedUser": null
  },
  "errors": [
    {
      "message": "User 999 not found",
      "path": ["deletedUser"]
    }
  ]
}
```

> REST-এ পুরো request fail হয়। GraphQL-এ একটা error হলেও বাকি data আসে — এটা বড় সুবিধা।

---

## N+1 Problem ও DataLoader

GraphQL-এর সবচেয়ে বড় performance সমস্যা:

```graphql
query {
  posts {          ← 1 query: SELECT * FROM posts
    title
    author {       ← N queries: SELECT * FROM users WHERE id = ? (প্রতিটি post-এর জন্য!)
      name
    }
  }
}
```

```
10টা post থাকলে:
Query 1: SELECT * FROM posts                    (1)
Query 2: SELECT * FROM users WHERE id = 1       (N)
Query 3: SELECT * FROM users WHERE id = 2
Query 4: SELECT * FROM users WHERE id = 3
...
Query 11: SELECT * FROM users WHERE id = 10
= মোট 11 queries!
```

**সমাধান — DataLoader (Batching):**

```
DataLoader দিয়ে:
Query 1: SELECT * FROM posts
Query 2: SELECT * FROM users WHERE id IN (1, 2, 3, ..., 10)
= মোট মাত্র 2 queries!
```

```javascript
// DataLoader pattern
const userLoader = new DataLoader(async (userIds) => {
  const users = await db.query(
    'SELECT * FROM users WHERE id IN (?)', [userIds]
  );
  return userIds.map(id => users.find(u => u.id === id));
});
```

---

## Authentication ও Authorization

### Authentication

```graphql
# HTTP Header-এ token পাঠানো (REST-এর মতোই)
POST /graphql
Authorization: Bearer eyJhbG...

query {
  me {
    name
    email
  }
}
```

### Field-Level Authorization

```graphql
type User {
  id: ID!
  name: String!          ← সবাই দেখতে পারে
  email: String!         ← শুধু নিজে বা admin দেখতে পারে
  salary: Float          ← শুধু admin দেখতে পারে
}
```

```
Normal user query { user(id: 42) { name, salary } }
→ { "name": "Ripon", "salary": null }
→ errors: [{ "message": "Not authorized to view salary" }]

Admin query { user(id: 42) { name, salary } }
→ { "name": "Ripon", "salary": 50000 }
```

---

## REST vs GraphQL — বিস্তারিত তুলনা

| বিষয় | REST | GraphQL |
|-------|------|---------|
| Endpoint | Multiple URL | Single `/graphql` |
| Data fetching | Server ঠিক করে | Client ঠিক করে |
| Over-fetching | ✅ সমস্যা | ❌ সমাধান |
| Under-fetching | ✅ সমস্যা | ❌ সমাধান |
| Caching | সহজ (HTTP cache) | কঠিন (custom cache) |
| File Upload | সহজ (multipart) | কঠিন (separate endpoint) |
| Error handling | Status codes | errors array |
| Versioning | URL versioning | Schema evolution |
| Learning curve | সহজ | মাঝারি |
| Tooling | Postman, curl | GraphiQL, Apollo Studio |
| Real-time | WebSocket (আলাদা) | Subscriptions (built-in) |
| Performance | Predictable | N+1 problem সম্ভব |

### কখন REST ব্যবহার করবেন?

```
✅ Simple CRUD API
✅ Public API (third-party developers-এর জন্য)
✅ Caching গুরুত্বপূর্ণ
✅ File upload/download
✅ Team REST-এ experienced
✅ Microservices-এর মধ্যে communication
```

### কখন GraphQL ব্যবহার করবেন?

```
✅ Complex, nested data relationships
✅ Multiple client (web, mobile, tablet) — ভিন্ন data need
✅ Rapid frontend development — backend change ছাড়াই নতুন query
✅ Real-time features (subscriptions)
✅ Over-fetching/under-fetching সমস্যা আছে
✅ Single Page Application (SPA)
```

### কখন দুটো একসাথে ব্যবহার করবেন?

```
REST → File upload, webhooks, simple CRUD, external API
GraphQL → Complex data queries, frontend-facing API

অনেক বড় company দুটোই ব্যবহার করে:
GitHub: REST API v3 + GraphQL API v4
Shopify: REST API + GraphQL API
```

---

## GraphQL Tools ও Ecosystem

| Tool | কাজ |
|------|-----|
| **GraphiQL** | Browser-based GraphQL IDE (query test করা) |
| **Apollo Server** | Node.js GraphQL server |
| **Apollo Client** | Frontend GraphQL client (React, Vue) |
| **Hasura** | Database → GraphQL API (automatic) |
| **Prisma** | ORM + GraphQL integration |
| **Relay** | Facebook-এর GraphQL client |
| **GraphQL Playground** | Interactive IDE |
| **graphql-codegen** | Schema থেকে TypeScript types generate |

---

## সংক্ষেপে মনে রাখার সূত্র

```
GraphQL = Single Endpoint + Client-Driven Queries + Type System

Query        → Read data (GET)
Mutation     → Change data (POST/PUT/DELETE)
Subscription → Real-time (WebSocket)

Schema = Types + Queries + Mutations + Subscriptions

সমস্যা সমাধান:
Over-fetching  → Client শুধু যা চায় তা-ই চায়
Under-fetching → Nested query-তে সব একসাথে আসে
N+1 Problem    → DataLoader দিয়ে batch করো
```

---

## Interview Golden Lines

> **GraphQL lets the client ask for exactly what it needs — nothing more, nothing less.**

> **REST gives you everything from a fixed endpoint; GraphQL gives you exactly what you ask for from a single endpoint.**

> **The N+1 problem is GraphQL's Achilles' heel — DataLoader is the cure.**

> **GraphQL doesn't replace REST — they solve different problems. Many companies use both.**

> **Schema is the contract between frontend and backend — it's GraphQL's single source of truth.**
