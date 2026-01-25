# Prisma ORM - Next-Generation Database Toolkit

Prisma হলো একটি modern, type-safe ORM যা database operations কে সহজ এবং নিরাপদ করে।

## কেন Prisma?

### Traditional ORMs এর সমস্যা:

- Type safety নেই
- Complex queries লেখা কঠিন
- Runtime errors
- Poor auto-completion
- Migration management জটিল

### Prisma এর সুবিধা:

- ✅ **Type-safe**: Full TypeScript support
- ✅ **Auto-completion**: Excellent IntelliSense
- ✅ **Intuitive API**: Easy to learn
- ✅ **Prisma Studio**: Visual database browser
- ✅ **Migration system**: Simple and powerful
- ✅ **Multiple databases**: PostgreSQL, MySQL, SQLite, MongoDB, SQL Server
- ✅ **Performance**: Optimized queries

## Installation

```bash
npm install prisma --save-dev
npm install @prisma/client

# Initialize Prisma
npx prisma init
```

এটি তৈরি করবে:

- `prisma/schema.prisma` - Database schema
- `.env` - Environment variables

## Schema Definition

```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  name      String?
  posts     Post[]
  profile   Profile?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Post {
  id        Int      @id @default(autoincrement())
  title     String
  content   String?
  published Boolean  @default(false)
  author    User     @relation(fields: [authorId], references: [id])
  authorId  Int
  tags      Tag[]
  createdAt DateTime @default(now())
}

model Profile {
  id     Int    @id @default(autoincrement())
  bio    String
  user   User   @relation(fields: [userId], references: [id])
  userId Int    @unique
}

model Tag {
  id    Int    @id @default(autoincrement())
  name  String @unique
  posts Post[]
}
```

## Environment Setup

```env
# .env
DATABASE_URL="postgresql://user:password@localhost:5432/mydb?schema=public"
```

## Generate Prisma Client

```bash
npx prisma generate
```

এটি type-safe Prisma Client তৈরি করবে।

## Migrations

```bash
# Create migration
npx prisma migrate dev --name init

# Apply migrations in production
npx prisma migrate deploy

# Reset database
npx prisma migrate reset
```

## Basic CRUD Operations

### Setup Prisma Client

```typescript
// prisma.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default prisma;
```

### Create

```typescript
import prisma from "./prisma";

// Create single user
const user = await prisma.user.create({
  data: {
    email: "john@example.com",
    name: "John Doe",
  },
});

// Create with relations
const userWithPost = await prisma.user.create({
  data: {
    email: "jane@example.com",
    name: "Jane Doe",
    posts: {
      create: [
        { title: "My first post", content: "Hello World!" },
        { title: "My second post", content: "Learning Prisma" },
      ],
    },
  },
  include: {
    posts: true,
  },
});

// Create many
const users = await prisma.user.createMany({
  data: [
    { email: "user1@example.com", name: "User 1" },
    { email: "user2@example.com", name: "User 2" },
  ],
});
```

### Read

```typescript
// Find all
const users = await prisma.user.findMany();

// Find with conditions
const publishedPosts = await prisma.post.findMany({
  where: { published: true },
});

// Find unique
const user = await prisma.user.findUnique({
  where: { email: "john@example.com" },
});

// Find first
const firstUser = await prisma.user.findFirst({
  where: { name: { contains: "John" } },
});

// Include relations
const userWithPosts = await prisma.user.findUnique({
  where: { id: 1 },
  include: {
    posts: true,
    profile: true,
  },
});

// Select specific fields
const userEmails = await prisma.user.findMany({
  select: {
    email: true,
    name: true,
  },
});
```

### Update

```typescript
// Update single
const updatedUser = await prisma.user.update({
  where: { id: 1 },
  data: { name: "Updated Name" },
});

// Update many
const updateResult = await prisma.post.updateMany({
  where: { published: false },
  data: { published: true },
});

// Upsert (update or create)
const user = await prisma.user.upsert({
  where: { email: "john@example.com" },
  update: { name: "John Updated" },
  create: { email: "john@example.com", name: "John Doe" },
});
```

### Delete

```typescript
// Delete single
const deletedUser = await prisma.user.delete({
  where: { id: 1 },
});

// Delete many
const deleteResult = await prisma.post.deleteMany({
  where: { published: false },
});
```

## Advanced Queries

### Filtering

```typescript
// AND condition
const users = await prisma.user.findMany({
  where: {
    AND: [
      { email: { contains: "@example.com" } },
      { name: { startsWith: "J" } },
    ],
  },
});

// OR condition
const posts = await prisma.post.findMany({
  where: {
    OR: [
      { title: { contains: "Prisma" } },
      { content: { contains: "Prisma" } },
    ],
  },
});

// NOT condition
const unpublishedPosts = await prisma.post.findMany({
  where: {
    NOT: { published: true },
  },
});
```

### Sorting

```typescript
const users = await prisma.user.findMany({
  orderBy: {
    createdAt: "desc",
  },
});

// Multiple sort fields
const posts = await prisma.post.findMany({
  orderBy: [{ published: "desc" }, { createdAt: "desc" }],
});
```

### Pagination

```typescript
// Skip and take
const users = await prisma.user.findMany({
  skip: 10,
  take: 5,
});

// Cursor-based pagination
const users = await prisma.user.findMany({
  take: 10,
  cursor: {
    id: lastUserId,
  },
  skip: 1, // Skip the cursor
});
```

### Aggregation

```typescript
// Count
const userCount = await prisma.user.count();

// Count with conditions
const publishedCount = await prisma.post.count({
  where: { published: true },
});

// Aggregate
const result = await prisma.post.aggregate({
  _count: true,
  _avg: { authorId: true },
  _sum: { authorId: true },
  _min: { createdAt: true },
  _max: { createdAt: true },
});

// Group by
const groupedPosts = await prisma.post.groupBy({
  by: ["authorId"],
  _count: {
    id: true,
  },
});
```

## Relations

### One-to-Many

```typescript
// Get user with all posts
const userWithPosts = await prisma.user.findUnique({
  where: { id: 1 },
  include: {
    posts: {
      where: { published: true },
      orderBy: { createdAt: "desc" },
    },
  },
});
```

### One-to-One

```typescript
// Get user with profile
const userWithProfile = await prisma.user.findUnique({
  where: { id: 1 },
  include: {
    profile: true,
  },
});
```

### Many-to-Many

```typescript
// Get post with tags
const postWithTags = await prisma.post.findUnique({
  where: { id: 1 },
  include: {
    tags: true,
  },
});

// Create post with tags
const post = await prisma.post.create({
  data: {
    title: "My Post",
    tags: {
      connect: [{ id: 1 }, { id: 2 }],
    },
  },
});
```

## Transactions

```typescript
// Sequential operations
const result = await prisma.$transaction(async (prisma) => {
  const user = await prisma.user.create({
    data: { email: "john@example.com", name: "John" },
  });

  const post = await prisma.post.create({
    data: {
      title: "First Post",
      authorId: user.id,
    },
  });

  return { user, post };
});

// Batch operations
const [deleteUsers, createUser] = await prisma.$transaction([
  prisma.user.deleteMany({ where: { name: "Test" } }),
  prisma.user.create({ data: { email: "new@example.com", name: "New User" } }),
]);
```

## Raw Queries

```typescript
// Raw query
const users = await prisma.$queryRaw`SELECT * FROM User WHERE name = ${"John"}`;

// Execute raw SQL
const result =
  await prisma.$executeRaw`UPDATE User SET name = 'Updated' WHERE id = ${1}`;
```

## Prisma with Express

```typescript
import express from "express";
import prisma from "./prisma";

const app = express();
app.use(express.json());

// Get all users
app.get("/users", async (req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
});

// Create user
app.post("/users", async (req, res) => {
  const user = await prisma.user.create({
    data: req.body,
  });
  res.json(user);
});

// Get user by ID
app.get("/users/:id", async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: Number(req.params.id) },
    include: { posts: true },
  });
  res.json(user);
});

app.listen(3000);
```

## Prisma Studio

Visual database browser:

```bash
npx prisma studio
```

Opens at `http://localhost:5555`

## Best Practices

1. **Use transactions** for related operations
2. **Select only needed fields** for performance
3. **Use pagination** for large datasets
4. **Index frequently queried fields**
5. **Use connection pooling** in production
6. **Handle errors properly**
7. **Use migrations** for schema changes

---

> [!TIP]
> Prisma এর type-safety আপনাকে runtime errors থেকে বাঁচায়। সবসময় Prisma Client regenerate করুন schema change করার পর।
