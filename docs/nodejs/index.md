# Node.js Learning Roadmap (Beginner to Expert)

Node.js বর্তমান ওয়েব ডেভেলপমেন্ট জগতের অন্যতম জনপ্রিয় এবং শক্তিশালী টেকনোলজি। এটি JavaScript-কে সার্ভার সাইডে রান করানোর ক্ষমতা দেয়, যার ফলে একটি মাত্র ল্যাঙ্গুয়েজ দিয়েই ফ্রন্টএন্ড এবং ব্যাকএন্ড—উভয় দিকেই কাজ করা যায়।

এই গাইডটি একদম শুরু থেকে (Beginner) অ্যাডভান্সড (Advanced) এবং এক্সপার্ট (Expert) লেভেল পর্যন্ত ধাপে ধাপে সাজানো হয়েছে।

## 📚 Level 1: Foundation (Beginner)

এই লেভেলে আমরা Node.js এর একদম বেসিক কনসেপ্টগুলো শিখব। এটি শেষ করতে আনুমানিক **৪-৬ সপ্তাহ** সময় লাগতে পারে।

### [1. Prerequisites & Setup](./prerequisites.md)
Node.js শুরু করার আগে কিছু বেসিক ধারণা এবং এনভায়রনমেন্ট সেটআপ করা জরুরি।
- Node.js কি এবং কেন?
- JavaScript Runtime Environment (Browser vs Node.js)
- V8 Engine এর ধারণা।
- Node.js Installation (NVM সহ)।
- প্রথম "Hello World" প্রোগ্রাম এবং REPL।

### [2. JavaScript Fundamentals](./js-fundamentals.md)
Node.js এর মূল ভিত্তি হলো JavaScript। তাই জাভাস্ক্রিপ্টের ফান্ডামেন্টালস খুব ভালোভাবে জানা থাকা জরুরি।
- Variables & Data Types.
- Control Flow & Loops.
- Functions, Arrays, Objects.
- Error Handling.

### [3. ES6+ Advanced JavaScript](./es6-advanced.md)
ES6 (ECMAScript 2015) এবং এর পরের ভার্সনগুলোতে জাভাস্ক্রিপ্টে অনেক নতুন ফিচার যোগ হয়েছে যা Node.js ডেভেলপমেন্টে খুবই গুরুত্বপূর্ণ।
- Arrow Functions, `let`, `const`.
- Classes, Modules (ESM).
- Promises, Async/Await.
- Destructuring, Spread/Rest Operators.

### [4. Node.js Core Concepts](./core-concepts.md)
Node.js কিভাবে কাজ করে তার ইন্টারনাল আর্কিটেকচার বোঝা।
- Event Loop & Non-blocking I/O.
- Single-threaded nature.
- Global Objects.

### [5. NPM & Package Management](./npm.md)
Node.js প্রজেক্টের ডিপেনডেন্সি ম্যানেজ করার জন্য NPM অপরিহার্য।
- `package.json` এর বিস্তারিত।
- প্যাকেজ ইন্সটল, আপডেট এবং রিমুভ করা।
- Semantic Versioning.

### [6. Core Built-in Modules](./built-in-modules.md)
Node.js এর পাওয়ারফুল বিল্ট-ইন মডিউলস।
- `fs` (File System), `path`.
- `os`, `events`, `http`.

### [7. Beginner Projects](./beginner-projects.md)
ছোট ছোট ৬টি প্রজেক্ট করে আপনার শেখা কনসেপ্টগুলো ঝালাই করে নিন।
- CLI Calculator, File Logger.
- Basic HTTP Server, CSV Reader.

## 🚀 Level 2: Intermediate (3-4 months)

### [1. Express.js Framework](./express.md)
Node.js এর সবচেয়ে জনপ্রিয় ওয়েব ফ্রেমওয়ার্ক।
- Routing, Middleware, and Servers.
- Template Engines & Static Files.

### [2. RESTful API Development](./rest-api.md)
প্রফেশনাল API ডিজাইনের মূলনীতি।
- REST Principles, CRUD Operations.
- Status Codes, Versioning.

### [3. Database Integration](./database.md)
ডেটা সংরক্ষণ এবং ম্যানেজমেন্ট।
- **MongoDB** (With Mongoose).
- **PostgreSQL/MySQL** (With Sequelize).

### [4. Authentication & Security](./auth.md)
অ্যাপ্লিকেশন সিকিউরিটি এবং লগইন সিস্টেম।
- JWT (JSON Web Token), Bcrypt.
- Session vs Token Auth.
- Authorization & RBAC.

### [5. Security Best Practices](./security.md)
অ্যাপ্লিকেশনকে সুরক্ষিত রাখার উপায়।
- Input Validation, Sanitization.
- SQL Injection, XSS, CSRF Protection.
- Rate Limiting, Helmet, CORS.

### [6. File Handling](./file-handling.md)
ফাইল আপলোড, প্রসেসিং এবং স্টোরেজ ম্যানেজমেন্ট।
- File Upload with Multer.
- Image Processing with Sharp.
- Cloud Storage (AWS S3, Cloudinary).
- CSV/Excel Handling.
- PDF Generation.

### [7. Error Handling & Debugging](./error-handling.md)
Error management এবং debugging techniques।
- Try-Catch Blocks.
- Error Handling Middleware.
- Custom Error Classes.
- Error Logging (Winston).
- Debugging with VS Code.
- Stack Traces Analysis.

### [8. Intermediate Projects](./intermediate-projects.md)
Real-world projects দিয়ে skills practice করুন।
- Blog API with Authentication.
- E-commerce Backend (Products, Cart, Orders).
- Social Media API (Posts, Comments, Likes).
- Task Management System.
- User Management with RBAC.
- File Upload Service.

## 💎 Level 3: Advanced (3-4 months)

### [1. Advanced Express Patterns](./advanced-express.md)
Professional application architecture এবং design patterns।
- Custom Middleware Development.
- Middleware Chaining.
- Advanced Routing & Grouping.
- MVC Pattern & Controllers.
- Service Layer & Repository Pattern.
- Dependency Injection & Design Patterns.

### [2. Asynchronous Programming Deep Dive](./async-programming.md)
Event Loop, Promises, এবং concurrency patterns।
- Event Loop Architecture.
- Microtasks vs Macrotasks.
- Promise Internals.
- Async Iterators & Generators.
- Worker Threads & Child Processes.
- Cluster Module & PM2.

### [3. Streams & Buffers](./streams-buffers.md)
Memory-efficient data processing এবং large file handling।
- Stream Types (Readable, Writable, Duplex, Transform).
- Buffer Operations.
- Pipe Method & Pipelines.
- Backpressure Handling.
- Custom Stream Implementation.
- Large File Processing.
- Production Streaming Patterns.