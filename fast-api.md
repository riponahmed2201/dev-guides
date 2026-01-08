# FastAPI Complete Learning Guide - Beginner to Expert

এই গাইডটি তোমাকে FastAPI-তে একজন এক্সপার্ট হিসেবে তৈরি করার জন্য ডিজাইন করা হয়েছে। এখানে আমরা প্রতিটি টপিক একদম গোড়া থেকে (Deep Dive) শিখবো।

> [!TIP]
> আমরা এই রোডম্যাপটি অনুসরণ করে প্রতিটি চ্যাপ্টারের জন্য আলাদা আলাদা বিস্তারিত ডক (Detailed Docs) তৈরি করবো।

---

## 📚 Level 1: Beginner (Foundation)

### 1. FastAPI Introduction
- FastAPI কি এবং এটি কেন অনন্য? 
- FastAPI vs Flask vs Django: সঠিকটি বেছে নেওয়া
- Installation এবং Development Environment Setup
- Uvicorn কি এবং এর ভূমিকা?
- প্রথম "Hello World" API এবং এর প্রতিটি লাইনের ব্যাখ্যা
- [Detailed Guide: Introduction](./docs/fastapi/introduction.md)

### 2. Basic Routing & Parameters
- Path Operations (GET, POST, PUT, DELETE, PATCH)
- Path Parameters: dynamic data হ্যান্ডেল করা
- Query Parameters: ফিল্টারিং এবং সর্টিং
- Type Hints এবং automatic validation
- Parameter validation with `Path` and `Query` classes

### 3. Data Validation with Pydantic (V2)
- Pydantic models কি এবং কেন দরকার?
- Schema vs Database Model এর পার্থক্য
- Field validation এবং constraints (`min_length`, `max_length`, `regex`)
- Optional fields এবং default values
- Nested models (একই ডেটার ভেতরে ভিন্ন ডেটা)

### 4. Response Handling
- Response Model: ডেটা সিকিউরিটি এবং ফিল্টারিং
- Path Operation Decorator এর মাধ্যমে status code সেট করা
- `HTTPException` ব্যবহার করে error response পাঠানো
- Custom response message formatting

### 5. Request Data Deep Dive
- JSON Request Body হ্যান্ডেল করা
- Form Data এবং URL-encoded data
- File Uploads: `File` এবং `UploadFile`
- Headers এবং Cookies এর মাধ্যমে ডেটা আদান-প্রদান

---

## 📚 Level 2: Intermediate

### 6. Path Operations Configuration
- OpenAPI (Swagger) ডকুমেন্টেশন কাস্টমাইজ করা (Tags, Summary, Description)
- Deprecating endpoints (পুরানো API রিটায়ার করা)
- response_description এবং operation_id

### 7. Dependency Injection (FastAPI এর শ্রেষ্ঠ ফিচার)
- Dependency Injection (DI) এর কনসেপ্ট
- Dependencies with parameters (reusable logic)
- Class-based dependencies
- Sub-dependencies এবং `yield` (Context Managers)

### 8. Security & Authentication
- Password Hashing (bcrypt)
- JWT (JSON Web Token) implementation: Secret keys, expiration
- OAuth2 with Password Flow
- Protecting routes with dependencies
- User roles (Admin vs Base User)

### 9. Database Integration (Async SQLAlchemy)
- Database Engine এবং Session setup
- Defining Tables with SQLAlchemy (Async)
- CRUD (Create, Read, Update, Delete) patterns
- Database connection dependency
- Migrations with **Alembic**

### 10. Middleware & CORS
- CORS (Cross-Origin Resource Sharing) কেন এবং কীভাবে সেট করবেন?
- Custom Middlewares: প্রতিটা রিকোয়েস্টের শুরুতে এবং শেষে কাজ করা
- Trusted hosts এবং GZip compression

### 11. Error handling & Background Tasks
- Global Exception Handlers
- Background Tasks: ইমেইল পাঠানো বা ফাইল প্রসেস করা (API ব্লক না করে)

---

## 📚 Level 3: Advanced

### 12. Advanced Pydantic Patterns
- Custom Validators (`@field_validator`)
- Read vs Write models (Inheritance)
- Using `ConfigDict` (Pydantic V2)
- Recursive models

### 13. Testing FastAPI Applications
- `TestClient` setup
- Pytest এর মাধ্যমে unit test এবং integration test
- Testing with mock dynamic dependencies
- Database testing (Temporary DB)

### 14. Performance & Scalability
- Async/await এর আসল শক্তি বোঝা
- Concurrent requests হ্যান্ডেল করা
- Caching strategies (Redis introduction)
- Response serialization অপ্টিমাইজ করা

### 15. Real-time Features (WebSockets)
- WebSocket connection basics
- Broadcasting (একসাথে সবাইকে মেসেজ পাঠানো)
- Tracking active connections
- Simple Chat application build

---

## 📚 Level 4: Expert (Production Ready)

### 16. Application Architecture
- Bigger Applications: `APIRouter` ব্যবহার করে কোড মডুলার করা
- Production Project structure (Real-world folder setup)
- Configuration management (Environment variables)

### 17. Deployment & DevOps
- Dockerizing FastAPI (Best practices)
- Gunicorn + Uvicorn worker setup
- Nginx reverse proxy এবং SSL (HTTPS)
- CI/CD pipelines (GitHub Actions)

### 18. API Best Practices
- RESTful API design rules
- API Versioning (v1, v2)
- Pagination (limit, offset)
- Advanced filtering and sorting logic

---

## 🎯 Practical Projects (শিখতে শিখতে বানাও)

1. **Task Manager API** - CRUD, Authentication
2. **Contact App** - Search, Filter, DB integration
3. **Blog Engine** - Relationships (User-Post-Comments)
4. **Library System** - Complex relationships, File uploads
5. **Real-time Chat** - WebSockets integration

---

## 📖 Learning Resources

- **Official Docs:** [fastapi.tiangolo.com](https://fastapi.tiangolo.com/)
- **Pydantic Docs:** [docs.pydantic.dev](https://docs.pydantic.dev/)
- **FastAPI Discord Community**

---

::: tip পরবর্তী ধাপ
এখন রোডম্যাপ রেডি! আমরা প্রথম চ্যাপ্টার **"FastAPI Introduction"** দিয়ে আমাদের জার্নি শুরু করবো।
:::
