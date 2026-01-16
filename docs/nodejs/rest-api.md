# RESTful API Development - সম্পূর্ণ গাইড

API (Application Programming Interface) হলো এমন একটি মাধ্যম যার মাধ্যমে ফ্রন্টএন্ড এবং ব্যাকএন্ড একে অপরের সাথে কথা বলে। বর্তমানে ওয়েব ডেভেলপমেন্টে **REST** (Representational State Transfer) আর্কিটেকচার সবচেয়ে জনপ্রিয়।

## REST API কি এবং কেন?

### API কি?

ধরুন একটি রেস্টুরেন্টে আপনি খেতে গেছেন:
- **আপনি (Client/Frontend):** খাবার অর্ডার করছেন
- **ওয়েটার (API):** আপনার অর্ডার নিয়ে রান্নাঘরে দিচ্ছে এবং খাবার এনে দিচ্ছে
- **রান্নাঘর (Server/Backend):** খাবার তৈরি করছে

API হলো ওই ওয়েটার - যে দুই পক্ষের মধ্যে যোগাযোগ করায়।

### REST কি?

REST (Representational State Transfer) হলো একটা আর্কিটেকচারাল স্টাইল যা HTTP প্রোটোকল ব্যবহার করে।

**REST এর মূল ধারণা:**
- সবকিছুকে **Resource** হিসেবে দেখা (Users, Posts, Products)
- প্রতিটি resource এর একটা unique URL (endpoint) আছে
- HTTP methods (GET, POST, PUT, DELETE) দিয়ে resource এর উপর কাজ করা
- JSON/XML ফরম্যাটে ডেটা আদান-প্রদান

### REST vs Traditional API

**Traditional API (RPC Style):**
```
POST /getUserById
POST /createNewUser
POST /updateUserDetails
POST /deleteUser
```

**REST API:**
```
GET    /users/:id     → Get user
POST   /users         → Create user
PUT    /users/:id     → Update user
DELETE /users/:id     → Delete user
```

REST অনেক বেশি organized এবং predictable!

---

## ১. REST API Principles (6টি মূলনীতি)

একটি API কে সত্যিকারের RESTful হতে হলে ৬টি নিয়ম মেনে চলতে হয়:

### ক. Client-Server Architecture

ফ্রন্টএন্ড এবং ব্যাকএন্ড সম্পূর্ণ আলাদা থাকবে।

**সুবিধা:**
- Frontend এবং Backend আলাদাভাবে ডেভেলপ করা যায়
- Frontend (React, Vue) পরিবর্তন করলে Backend (Express, Django) ঠিক থাকবে
- Multiple frontends (Web, Mobile, Desktop) একই API ব্যবহার করতে পারে

```
┌─────────────┐         HTTP Request/Response         ┌─────────────┐
│   Client    │ ◄───────────────────────────────────► │   Server    │
│  (React)    │          JSON/XML Data                │  (Express)  │
└─────────────┘                                        └─────────────┘
```

### খ. Stateless

প্রতিটি রিকোয়েস্ট স্বাধীন হবে। সার্ভার ক্লায়েন্টের আগের কোনো রিকোয়েস্টের তথ্য মনে রাখবে না।

**Example:**

**❌ Stateful (Bad):**
```javascript
// Request 1: Login
POST /login → Server stores: user is logged in

// Request 2: Get profile
GET /profile → Server remembers previous login
```

**✅ Stateless (Good):**
```javascript
// Every request includes authentication
GET /profile
Headers: {
  Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

প্রতিটি রিকোয়েস্টে token/credentials পাঠাতে হবে।

**সুবিধা:**
- সার্ভার সহজে scale করা যায়
- Load balancing সহজ
- কোন সার্ভার crash করলে অন্যটা কাজ করবে

### গ. Cacheable

রেসপন্স ক্যাশ করার ব্যবস্থা থাকবে যাতে পারফরম্যান্স বাড়ে।

```javascript
app.get('/api/products', (req, res) => {
    res.set('Cache-Control', 'public, max-age=300'); // 5 minutes cache
    res.json(products);
});
```

**সুবিধা:**
- নেটওয়ার্ক calls কমে
- Server load কমে
- Response time কমে

### ঘ. Uniform Interface

সব resource এক্সেস করার পদ্ধতি একই রকম হবে।

```javascript
// Users resource
GET    /users
POST   /users
GET    /users/:id
PUT    /users/:id
DELETE /users/:id

// Posts resource (same pattern)
GET    /posts
POST   /posts
GET    /posts/:id
PUT    /posts/:id
DELETE /posts/:id
```

### ঙ. Layered System

Client সরাসরি server এর সাথে connect আছে কিনা জানবে না। মাঝখানে proxy, load balancer থাকতে পারে।

```
Client → API Gateway → Load Balancer → Server 1
                                     → Server 2
                                     → Server 3
```

### চ. Code on Demand (Optional)

Server চাইলে executable code (JavaScript) পাঠাতে পারে।

```javascript
// Server sends JavaScript code
{
  "data": {...},
  "executable": "function() { alert('Hello'); }"
}
```

(তবে এটা rarely ব্যবহার হয়)

---

## ২. Resource Naming Conventions (URL Design)

REST API তে URL গুলোকে **"Resource"** হিসেবে চিন্তা করতে হবে, **"Action"** হিসেবে নয়।

### মূল নিয়মাবলী:

#### ১. Nouns ব্যবহার করুন, Verbs নয়

✅ **Good Practice:**
```
GET    /users           → সব ইউজার আনা
GET    /users/123       → নির্দিষ্ট ইউজার আনা
POST   /users           → নতুন ইউজার তৈরি করা
PUT    /users/123       → ইউজার আপডেট করা
DELETE /users/123       → ইউজার ডিলিট করা
```

❌ **Bad Practice:**
```
GET    /getAllUsers
GET    /getUserById/123
POST   /createNewUser
POST   /updateUser/123
DELETE /deleteUser/123
```

**কেন?** HTTP method-ই action বলে দেয়, URL এ আবার verb লাগে না।

#### ২. Plural Nouns ব্যবহার করুন

✅ **Good:**
```
/users
/products
/orders
/posts
```

❌ **Bad:**
```
/user
/product
/order
/post
```

**কারণ:** Consistency. `/users` এবং `/users/123` দুটোই logical।

#### ৩. Hierarchical Structure (Nested Resources)

```javascript
// User এর posts
GET /users/123/posts              → User 123 এর সব posts
GET /users/123/posts/456          → User 123 এর post 456

// Post এর comments
GET /posts/456/comments           → Post 456 এর সব comments
POST /posts/456/comments          → Post 456 এ নতুন comment

// User এর orders
GET /users/123/orders             → User 123 এর orders
GET /users/123/orders/789         → নির্দিষ্ট order
```

**সতর্কতা:** 3 level এর বেশি nested করবেন না:
```
❌ /users/123/posts/456/comments/789/likes  (Too deep!)
✅ /comments/789/likes                       (Better)
```

#### ৪. Lowercase এবং Hyphens ব্যবহার করুন

✅ **Good:**
```
/api/user-profiles
/api/blog-posts
/api/shopping-cart-items
```

❌ **Bad:**
```
/api/UserProfiles      (camelCase)
/api/user_profiles     (snake_case)
/api/BLOG-POSTS        (uppercase)
```

#### ৫. File Extensions যোগ করবেন না

✅ **Good:**
```
GET /users/123
Accept: application/json
```

❌ **Bad:**
```
GET /users/123.json
GET /users/123.xml
```

**কারণ:** Content type headers দিয়ে specify করা উচিত।

#### ৬. CRUD Operation এর জন্য Standard Pattern

```javascript
// Collection endpoints (multiple resources)
GET    /resources              → List all
POST   /resources              → Create new

// Member endpoints (single resource)
GET    /resources/:id          → Get one
PUT    /resources/:id          → Update (full replace)
PATCH  /resources/:id          → Update (partial)
DELETE /resources/:id          → Delete
```

### Real-world Examples:

#### E-commerce API:
```javascript
// Products
GET    /api/products                    → All products
GET    /api/products/123                → Single product
GET    /api/products/123/reviews        → Product reviews
POST   /api/products                    → Create product (admin)
PUT    /api/products/123                → Update product

// Cart
GET    /api/cart                        → Get user's cart
POST   /api/cart/items                  → Add item to cart
DELETE /api/cart/items/456              → Remove item
PUT    /api/cart/items/456              → Update quantity

// Orders
GET    /api/orders                      → User's orders
GET    /api/orders/789                  → Single order
POST   /api/orders                      → Create order (checkout)
GET    /api/orders/789/invoice          → Download invoice
```

#### Blog API:
```javascript
// Posts
GET    /api/posts                       → All posts
GET    /api/posts?author=ripon          → Filter by author
GET    /api/posts/123                   → Single post
POST   /api/posts                       → Create post
PUT    /api/posts/123                   → Update post
DELETE /api/posts/123                   → Delete post

// Comments
GET    /api/posts/123/comments          → Post comments
POST   /api/posts/123/comments          → Add comment
DELETE /api/comments/456                → Delete comment

// Categories
GET    /api/categories                  → All categories
GET    /api/categories/tech/posts       → Posts in category
```

#### Social Media API:
```javascript
// Users & Profiles
GET    /api/users/ripon                 → User profile
GET    /api/users/ripon/posts           → User's posts
GET    /api/users/ripon/followers       → User's followers
GET    /api/users/ripon/following       → Who user follows
POST   /api/users/ripon/follow          → Follow user
DELETE /api/users/ripon/follow          → Unfollow user

// Posts & Interactions
POST   /api/posts                       → Create post
GET    /api/posts/123/likes             → Post likes
POST   /api/posts/123/like              → Like post
DELETE /api/posts/123/like              → Unlike post
```

### Actions যা Noun নয়

কিছু কিছু ক্ষেত্রে action-based endpoints প্রয়োজন:

```javascript
// Authentication
POST /api/auth/login
POST /api/auth/logout
POST /api/auth/refresh-token
POST /api/auth/forgot-password
POST /api/auth/reset-password

// Bulk operations
POST /api/products/bulk-delete
POST /api/users/bulk-import

// Complex operations
POST /api/orders/123/cancel
POST /api/orders/123/refund
POST /api/products/123/publish
POST /api/products/123/archive

// Search
GET  /api/search?q=express&type=posts

// Analytics
GET  /api/dashboard/analytics
GET  /api/reports/sales
```

এসব ক্ষেত্রে verb ব্যবহার করা acceptable কারণ এগুলো সত্যিকারের resource নয়।

---

## ৩. HTTP Methods & CRUD (বিস্তারিত)

CRUD অপারেশন ইমপ্লিমেন্ট করার জন্য স্ট্যান্ডার্ড HTTP মেথড ব্যবহার করা উচিত।

| Operation | HTTP Method | Idempotent? | Safe? | Description |
| :--- | :--- | :---: | :---: | :--- |
| **Create** | `POST` | ❌ | ❌ | নতুন রিসোর্স তৈরি করতে |
| **Read** | `GET` | ✅ | ✅ | ডেটা পড়তে বা আনতে |
| **Update (Full)** | `PUT` | ✅ | ❌ | পুরো রিসোর্স রিপ্লেস করতে |
| **Update (Partial)** | `PATCH` | ❌ | ❌ | রিসোর্সের কিছু অংশ মডিফাই করতে |
| **Delete** | `DELETE` | ✅ | ❌ | রিসোর্স মুছে ফেলতে |

### পরিভাষা:
- **Idempotent:** একই request বারবার পাঠালে same result
- **Safe:** Server state পরিবর্তন করে না

---

### GET - Read করা (Safe & Idempotent)

**বৈশিষ্ট্য:**
- শুধু ডেটা পড়ে, কোনো পরিবর্তন করে না
- ব্রাউজারে cache হতে পারে
- URL এ query parameters পাঠানো যায়

**Examples:**

```javascript
// 1. Get all resources
app.get('/api/users', (req, res) => {
    const users = await User.find();
    res.json({
        success: true,
        count: users.length,
        data: users
    });
});

// 2. Get single resource
app.get('/api/users/:id', (req, res) => {
    const user = await User.findById(req.params.id);
    
    if (!user) {
        return res.status(404).json({
            success: false,
            error: 'User not found'
        });
    }
    
    res.json({
        success: true,
        data: user
    });
});

// 3. Get with filters
app.get('/api/products', (req, res) => {
    const { category, minPrice, maxPrice, sort } = req.query;
    
    let query = {};
    if (category) query.category = category;
    if (minPrice || maxPrice) {
        query.price = {};
        if (minPrice) query.price.$gte = minPrice;
        if (maxPrice) query.price.$lte = maxPrice;
    }
    
    const products = await Product.find(query).sort(sort);
    
    res.json({
        success: true,
        count: products.length,
        data: products
    });
});

// URL: /api/products?category=electronics&minPrice=100&maxPrice=500&sort=price
```

**Response Codes:**
- `200 OK` - সফল
- `404 Not Found` - রিসোর্স পাওয়া যায়নি

---

### POST - Create করা (Not Idempotent, Not Safe)

**বৈশিষ্ট্য:**
- নতুন রিসোর্স তৈরি করে
- একই request দুইবার পাঠালে দুইটা resource তৈরি হবে
- Body তে data পাঠাতে হয়

**Examples:**

```javascript
// 1. Basic create
app.post('/api/users', async (req, res) => {
    const { name, email, password } = req.body;
    
    // Validation
    if (!name || !email || !password) {
        return res.status(400).json({
            success: false,
            error: 'All fields are required'
        });
    }
    
    // Check if email exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(409).json({
            success: false,
            error: 'Email already exists'
        });
    }
    
    // Create user
    const user = await User.create({ name, email, password });
    
    res.status(201).json({
        success: true,
        data: user
    });
});

// 2. Nested resource create
app.post('/api/posts/:postId/comments', async (req, res) => {
    const { postId } = req.params;
    const { text, author } = req.body;
    
    // Check if post exists
    const post = await Post.findById(postId);
    if (!post) {
        return res.status(404).json({
            success: false,
            error: 'Post not found'
        });
    }
    
    const comment = await Comment.create({
        text,
        author,
        post: postId
    });
    
    res.status(201).json({
        success: true,
        data: comment
    });
});

// 3. Bulk create
app.post('/api/products/bulk', async (req, res) => {
    const { products } = req.body;
    
    if (!Array.isArray(products)) {
        return res.status(400).json({
            success: false,
            error: 'Products must be an array'
        });
    }
    
    const createdProducts = await Product.insertMany(products);
    
    res.status(201).json({
        success: true,
        count: createdProducts.length,
        data: createdProducts
    });
});
```

**Response Codes:**
- `201 Created` - নতুন রিসোর্স তৈরি হয়েছে
- `400 Bad Request` - ভুল ডেটা
- `409 Conflict` - ইতিমধ্যে আছে (duplicate)

---

### PUT - পুরো Resource Replace করা (Idempotent, Not Safe)

**বৈশিষ্ট্য:**
- পুরো resource replace করে
- যে fields দেওয়া হয়নি সেগুলো null/empty হবে
- একই request বারবার পাঠালে same result

**Examples:**

```javascript
app.put('/api/users/:id', async (req, res) => {
    const { id } = req.params;
    const { name, email, password, bio, avatar } = req.body;
    
    // সব field দিতে হবে, নাহলে null হয়ে যাবে
    const updatedUser = await User.findByIdAndUpdate(
        id,
        { name, email, password, bio, avatar },
        { new: true, overwrite: true } // overwrite: পুরো replace
    );
    
    if (!updatedUser) {
        return res.status(404).json({
            success: false,
            error: 'User not found'
        });
    }
    
    res.json({
        success: true,
        data: updatedUser
    });
});

// Request Body (সব field দিতে হবে):
{
    "name": "Ripon Ahmed",
    "email": "ripon@example.com",
    "password": "newpassword123",
    "bio": "Full Stack Developer",
    "avatar": "https://example.com/avatar.jpg"
}
```

**Response Codes:**
- `200 OK` - আপডেট সফল
- `404 Not Found` - রিসোর্স নেই

---

### PATCH - কিছু Field আপডেট করা (Not Idempotent, Not Safe)

**বৈশিষ্ট্য:**
- শুধু দেওয়া fields আপডেট হবে
- বাকি fields unchanged থাকবে
- Partial update এর জন্য ideal

**Examples:**

```javascript
app.patch('/api/users/:id', async (req, res) => {
    const { id } = req.params;
    const updates = req.body; // শুধু যা পাঠানো হয়েছে
    
    // শুধু allowed fields আপডেট করুন
    const allowedUpdates = ['name', 'bio', 'avatar'];
    const updateKeys = Object.keys(updates);
    const isValidOperation = updateKeys.every(key => 
        allowedUpdates.includes(key)
    );
    
    if (!isValidOperation) {
        return res.status(400).json({
            success: false,
            error: 'Invalid updates'
        });
    }
    
    const user = await User.findByIdAndUpdate(
        id,
        updates,
        { new: true, runValidators: true }
    );
    
    if (!user) {
        return res.status(404).json({
            success: false,
            error: 'User not found'
        });
    }
    
    res.json({
        success: true,
        data: user
    });
});

// Request Body (শুধু যা পরিবর্তন করতে চান):
{
    "bio": "Updated bio"
}
// name, email, password unchanged থাকবে
```

**PUT vs PATCH তুলনা:**

```javascript
// Original data:
{
    "id": 1,
    "name": "Ripon",
    "email": "ripon@example.com",
    "bio": "Developer",
    "avatar": "avatar.jpg"
}

// PUT request (শুধু name পাঠালে):
PUT /users/1
{ "name": "Ripon Ahmed" }

Result: {
    "name": "Ripon Ahmed",
    "email": null,        // ❌ Lost!
    "bio": null,          // ❌ Lost!
    "avatar": null        // ❌ Lost!
}

// PATCH request (শুধু name পাঠালে):
PATCH /users/1
{ "name": "Ripon Ahmed" }

Result: {
    "name": "Ripon Ahmed",
    "email": "ripon@example.com",  // ✅ Preserved
    "bio": "Developer",            // ✅ Preserved
    "avatar": "avatar.jpg"         // ✅ Preserved
}
```

**Response Codes:**
- `200 OK` - আপডেট সফল
- `404 Not Found` - রিসোর্স নেই

---

### DELETE - Resource মুছে ফেলা (Idempotent, Not Safe)

**বৈশিষ্ট্য:**
- Resource permanently মুছে দেয়
- একই request বারবার পাঠালে same result (already deleted)
- সাধারণত empty response body

**Examples:**

```javascript
// 1. Simple delete
app.delete('/api/users/:id', async (req, res) => {
    const { id } = req.params;
    
    const user = await User.findByIdAndDelete(id);
    
    if (!user) {
        return res.status(404).json({
            success: false,
            error: 'User not found'
        });
    }
    
    // Option 1: No content
    res.status(204).send();
    
    // Option 2: Confirmation message
    // res.json({
    //     success: true,
    //     message: 'User deleted successfully'
    // });
});

// 2. Soft delete (recommended)
app.delete('/api/posts/:id', async (req, res) => {
    const { id } = req.params;
    
    // Actually না মুছে 'deleted' flag set করুন
    const post = await Post.findByIdAndUpdate(
        id,
        { deleted: true, deletedAt: new Date() },
        { new: true }
    );
    
    if (!post) {
        return res.status(404).json({
            success: false,
            error: 'Post not found'
        });
    }
    
    res.json({
        success: true,
        message: 'Post deleted'
    });
});

// 3. Cascade delete (related data ও মুছা)
app.delete('/api/users/:id', async (req, res) => {
    const { id } = req.params;
    
    // User মুছলে তার সব posts ও মুছবে
    await Post.deleteMany({ author: id });
    await Comment.deleteMany({ author: id });
    await User.findByIdAndDelete(id);
    
    res.status(204).send();
});
```

**Response Codes:**
- `204 No Content` - সফলভাবে deleted (no response body)
- `200 OK` - deleted with confirmation message
- `404 Not Found` - রিসোর্স নেই

---

### অন্যান্য HTTP Methods

#### HEAD - Metadata পাওয়া

GET এর মতো কিন্তু শুধু headers, body নেই।

```javascript
app.head('/api/users/:id', async (req, res) => {
    const user = await User.findById(req.params.id);
    
    if (user) {
        res.status(200).end();
    } else {
        res.status(404).end();
    }
});
```

#### OPTIONS - Supported methods জানা

CORS এর জন্য ব্যবহার হয়।

```javascript
app.options('/api/users', (req, res) => {
    res.set('Allow', 'GET, POST, PUT, DELETE');
    res.send();
});
```

---

## ৪. HTTP Status Codes - সম্পূর্ণ গাইড

ক্লায়েন্টকে সঠিক স্ট্যাটাস কোড পাঠানো খুব জরুরি। এতে ফ্রন্টএন্ড ডেভেলপার বুঝতে পারে কী হয়েছে।

### Status Code Categories

```
1xx - Informational (রিকোয়েস্ট রিসিভ হয়েছে)
2xx - Success (সফল হয়েছে)
3xx - Redirection (আরও কাজ করতে হবে)
4xx - Client Error (ক্লায়েন্টের ভুল)
5xx - Server Error (সার্ভারের ভুল)
```

---

### 2xx - Success Codes

#### 200 OK - সাধারণ সফলতা
সবচেয়ে common status code।

```javascript
// GET request সফল
app.get('/api/users', (req, res) => {
    res.status(200).json({ data: users });
});

// PUT/PATCH request সফল
app.put('/api/users/:id', (req, res) => {
    res.status(200).json({ data: updatedUser });
});
```

#### 201 Created - নতুন Resource তৈরি
POST request সফল হলে।

```javascript
app.post('/api/users', (req, res) => {
    const newUser = await User.create(req.body);
    
    res.status(201)
       .location(`/api/users/${newUser.id}`) // নতুন resource এর URL
       .json({
           success: true,
           data: newUser
       });
});
```

#### 202 Accepted - প্রসেসিং চলছে
Async operation এর জন্য।

```javascript
app.post('/api/reports/generate', (req, res) => {
    // Background job start করুন
    const jobId = startReportGeneration(req.body);
    
    res.status(202).json({
        message: 'Report generation started',
        jobId: jobId,
        statusUrl: `/api/jobs/${jobId}`
    });
});
```

#### 204 No Content - সফল কিন্তু কোন ডেটা নেই
DELETE request এর জন্য ideal।

```javascript
app.delete('/api/users/:id', (req, res) => {
    await User.findByIdAndDelete(req.params.id);
    res.status(204).send(); // Empty response
});
```

---

### 3xx - Redirection Codes

#### 301 Moved Permanently - স্থায়ী পরিবর্তন

```javascript
app.get('/api/v1/users', (req, res) => {
    res.redirect(301, '/api/v2/users');
});
```

#### 302 Found - অস্থায়ী redirect

```javascript
app.get('/api/users/:id', (req, res) => {
    res.redirect(302, '/api/users');
});
```

#### 304 Not Modified - Cache থেকে ব্যবহার করুন

```javascript
app.get('/api/users', (req, res) => {
    const lastModified = users.lastUpdated;
    const clientLastModified = req.headers['if-modified-since'];
    
    if (clientLastModified === lastModified) {
        return res.status(304).send(); // Cache থেকে নিন
    }
    
    res.set('Last-Modified', lastModified);
    res.json(users);
});
```

---

### 4xx - Client Error Codes

#### 400 Bad Request - ভুল ইনপুট

```javascript
app.post('/api/users', (req, res) => {
    const { name, email } = req.body;
    
    if (!name || !email) {
        return res.status(400).json({
            success: false,
            error: 'Name and email are required',
            fields: {
                name: !name ? 'Name is required' : null,
                email: !email ? 'Email is required' : null
            }
        });
    }
    
    // Create user...
});
```

#### 401 Unauthorized - Authentication প্রয়োজন

```javascript
app.get('/api/profile', (req, res) => {
    const token = req.headers.authorization;
    
    if (!token) {
        return res.status(401).json({
            success: false,
            error: 'Authentication required',
            message: 'Please provide a valid token'
        });
    }
    
    // Verify token...
});
```

**Note:** "Unauthorized" মানে actually "Unauthenticated" (logged in নেই)

#### 403 Forbidden - Permission নেই

```javascript
app.delete('/api/posts/:id', authenticate, (req, res) => {
    const post = await Post.findById(req.params.id);
    
    // Check if user owns this post
    if (post.author.toString() !== req.user.id) {
        return res.status(403).json({
            success: false,
            error: 'Forbidden',
            message: 'You do not have permission to delete this post'
        });
    }
    
    await post.remove();
    res.status(204).send();
});
```

#### 404 Not Found - Resource পাওয়া যায়নি

```javascript
app.get('/api/users/:id', (req, res) => {
    const user = await User.findById(req.params.id);
    
    if (!user) {
        return res.status(404).json({
            success: false,
            error: 'User not found',
            message: `No user found with ID: ${req.params.id}`
        });
    }
    
    res.json({ success: true, data: user });
});

// 404 for invalid routes
app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: 'Route not found',
        message: `Cannot ${req.method} ${req.url}`
    });
});
```

#### 405 Method Not Allowed - ভুল HTTP method

```javascript
// শুধু GET এবং POST allowed
app.all('/api/users', (req, res, next) => {
    if (!['GET', 'POST'].includes(req.method)) {
        return res.status(405)
                  .set('Allow', 'GET, POST')
                  .json({
                      success: false,
                      error: 'Method not allowed',
                      allowedMethods: ['GET', 'POST']
                  });
    }
    next();
});
```

#### 409 Conflict - ডুপ্লিকেট বা conflict

```javascript
app.post('/api/users', (req, res) => {
    const { email } = req.body;
    
    const existingUser = await User.findOne({ email });
    
    if (existingUser) {
        return res.status(409).json({
            success: false,
            error: 'Conflict',
            message: 'User with this email already exists'
        });
    }
    
    // Create user...
});
```

#### 422 Unprocessable Entity - Validation error

```javascript
app.post('/api/users', (req, res) => {
    const { email } = req.body;
    
    // Email format ভুল
    if (!isValidEmail(email)) {
        return res.status(422).json({
            success: false,
            error: 'Validation failed',
            details: {
                email: 'Invalid email format'
            }
        });
    }
    
    // Create user...
});
```

#### 429 Too Many Requests - Rate limit exceeded

```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,
    statusCode: 429,
    message: {
        success: false,
        error: 'Too many requests',
        message: 'Please try again after 15 minutes'
    }
});

app.use('/api/', limiter);
```

---

### 5xx - Server Error Codes

#### 500 Internal Server Error - সাধারণ সার্ভার error

```javascript
app.get('/api/users', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            error: 'Internal server error',
            message: 'Something went wrong on our end'
        });
    }
});

// Global error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    
    res.status(err.statusCode || 500).json({
        success: false,
        error: err.message,
        ...(process.env.NODE_ENV === 'development' && {
            stack: err.stack
        })
    });
});
```

#### 502 Bad Gateway - Upstream server error

```javascript
app.get('/api/external-data', async (req, res) => {
    try {
        const response = await fetch('https://external-api.com/data');
        const data = await response.json();
        res.json(data);
    } catch (error) {
        res.status(502).json({
            success: false,
            error: 'Bad Gateway',
            message: 'External service is unavailable'
        });
    }
});
```

#### 503 Service Unavailable - Temporarily down

```javascript
let isMaintenanceMode = false;

app.use((req, res, next) => {
    if (isMaintenanceMode) {
        return res.status(503)
                  .set('Retry-After', '3600') // 1 hour
                  .json({
                      success: false,
                      error: 'Service unavailable',
                      message: 'System is under maintenance'
                  });
    }
    next();
});
```

---

### Status Code Selection Guide

```javascript
// যখন কী status code ব্যবহার করবেন

// GET Requests
✅ 200 - Resource পাওয়া গেছে
✅ 404 - Resource পাওয়া যায়নি
✅ 304 - Not modified (cached)

// POST Requests
✅ 201 - Successfully created
✅ 400 - Invalid data
✅ 409 - Already exists
✅ 422 - Validation failed

// PUT/PATCH Requests
✅ 200 - Successfully updated
✅ 404 - Resource not found
✅ 400 - Invalid data

// DELETE Requests
✅ 204 - Successfully deleted (no content)
✅ 200 - Deleted with confirmation
✅ 404 - Resource not found
✅ 403 - No permission to delete

// Authentication/Authorization
✅ 401 - Not logged in
✅ 403 - Logged in but no permission

// Errors
✅ 400 - Client's fault (bad input)
✅ 500 - Server's fault (bug/crash)
```

---

### Best Practices

```javascript
// ✅ Good: Specific status code
res.status(404).json({ error: 'User not found' });

// ❌ Bad: Generic 200 for everything
res.status(200).json({ error: 'User not found' }); // Wrong!

// ✅ Good: Consistent error format
{
    "success": false,
    "error": "Validation failed",
    "details": { ... }
}

// ❌ Bad: Inconsistent format
{
    "err": "error message",
    "msg": "validation failed"
}
```

---

## ৫. Query Parameters - Filtering, Sorting, Pagination

RESTful API তে query parameters ব্যবহার করে data filtering, sorting এবং pagination করা হয়।

### Filtering - ডেটা ফিল্টার করা

```javascript
// URL: /api/products?category=electronics&minPrice=100&maxPrice=500

app.get('/api/products', async (req, res) => {
    try {
        // Build query object
        const query = {};
        
        // 1. Simple filtering
        if (req.query.category) {
            query.category = req.query.category;
        }
        
        // 2. Range filtering
        if (req.query.minPrice || req.query.maxPrice) {
            query.price = {};
            if (req.query.minPrice) {
                query.price.$gte = parseInt(req.query.minPrice);
            }
            if (req.query.maxPrice) {
                query.price.$lte = parseInt(req.query.maxPrice);
            }
        }
        
        // 3. Boolean filtering
        if (req.query.inStock !== undefined) {
            query.inStock = req.query.inStock === 'true';
        }
        
        // 4. Array filtering (comma-separated)
        if (req.query.tags) {
            query.tags = { $in: req.query.tags.split(',') };
        }
        
        const products = await Product.find(query);
        
        res.json({
            success: true,
            count: products.length,
            data: products
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Example URLs:
// /api/products?category=electronics
// /api/products?minPrice=100&maxPrice=500
// /api/products?inStock=true
// /api/products?tags=new,featured,sale
```

### Sorting - সর্ট করা

```javascript
// URL: /api/products?sort=price (ascending)
// URL: /api/products?sort=-price (descending)

app.get('/api/products', async (req, res) => {
    const query = {};
    
    // Sorting
    let sortOption = {};
    if (req.query.sort) {
        const sortFields = req.query.sort.split(',');
        sortFields.forEach(field => {
            if (field.startsWith('-')) {
                // Descending
                sortOption[field.substring(1)] = -1;
            } else {
                // Ascending
                sortOption[field] = 1;
            }
        });
    } else {
        // Default sort
        sortOption = { createdAt: -1 }; // Newest first
    }
    
    const products = await Product.find(query).sort(sortOption);
    
    res.json({
        success: true,
        data: products
    });
});

// Example URLs:
// /api/products?sort=price          → Price low to high
// /api/products?sort=-price         → Price high to low
// /api/products?sort=name           → Name A to Z
// /api/products?sort=-createdAt     → Newest first
// /api/products?sort=price,name     → Price then name
```

### Pagination - পেজিনেশন

```javascript
// URL: /api/products?page=2&limit=10

app.get('/api/products', async (req, res) => {
    try {
        // Pagination
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        
        // Get total count for pagination info
        const total = await Product.countDocuments();
        
        // Fetch paginated data
        const products = await Product.find()
            .skip(skip)
            .limit(limit);
        
        res.json({
            success: true,
            pagination: {
                page: page,
                limit: limit,
                total: total,
                pages: Math.ceil(total / limit),
                hasNext: page * limit < total,
                hasPrev: page > 1
            },
            data: products
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Response:
{
    "success": true,
    "pagination": {
        "page": 2,
        "limit": 10,
        "total": 45,
        "pages": 5,
        "hasNext": true,
        "hasPrev": true
    },
    "data": [...]
}
```

### Field Selection - নির্দিষ্ট ফিল্ড আনা

```javascript
// URL: /api/users?fields=name,email

app.get('/api/users', async (req, res) => {
    let selectFields = {};
    
    if (req.query.fields) {
        const fields = req.query.fields.split(',');
        fields.forEach(field => {
            selectFields[field] = 1;
        });
    }
    
    const users = await User.find().select(selectFields);
    
    res.json({
        success: true,
        data: users
    });
});

// Response (শুধু name এবং email):
{
    "data": [
        { "name": "Ripon", "email": "ripon@example.com" },
        { "name": "Karim", "email": "karim@example.com" }
    ]
}
```

### Search - সার্চ করা

```javascript
// URL: /api/products?search=laptop

app.get('/api/products', async (req, res) => {
    let query = {};
    
    if (req.query.search) {
        query.$or = [
            { name: { $regex: req.query.search, $options: 'i' } },
            { description: { $regex: req.query.search, $options: 'i' } }
        ];
    }
    
    const products = await Product.find(query);
    
    res.json({
        success: true,
        data: products
    });
});
```

### Complete Advanced Query Handler

সব features একসাথে:

```javascript
const APIFeatures = class {
    constructor(query, queryString) {
        this.query = query;
        this.queryString = queryString;
    }
    
    filter() {
        const queryObj = { ...this.queryString };
        const excludedFields = ['page', 'sort', 'limit', 'fields', 'search'];
        excludedFields.forEach(field => delete queryObj[field]);
        
        // Advanced filtering (gte, lte, gt, lt)
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
        
        this.query = this.query.find(JSON.parse(queryStr));
        return this;
    }
    
    search() {
        if (this.queryString.search) {
            this.query = this.query.find({
                $or: [
                    { name: { $regex: this.queryString.search, $options: 'i' } },
                    { description: { $regex: this.queryString.search, $options: 'i' } }
                ]
            });
        }
        return this;
    }
    
    sort() {
        if (this.queryString.sort) {
            const sortBy = this.queryString.sort.split(',').join(' ');
            this.query = this.query.sort(sortBy);
        } else {
            this.query = this.query.sort('-createdAt');
        }
        return this;
    }
    
    limitFields() {
        if (this.queryString.fields) {
            const fields = this.queryString.fields.split(',').join(' ');
            this.query = this.query.select(fields);
        }
        return this;
    }
    
    paginate() {
        const page = parseInt(this.queryString.page) || 1;
        const limit = parseInt(this.queryString.limit) || 10;
        const skip = (page - 1) * limit;
        
        this.query = this.query.skip(skip).limit(limit);
        return this;
    }
};

// Usage
app.get('/api/products', async (req, res) => {
    try {
        const features = new APIFeatures(Product.find(), req.query)
            .filter()
            .search()
            .sort()
            .limitFields()
            .paginate();
        
        const products = await features.query;
        
        res.json({
            success: true,
            count: products.length,
            data: products
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Example URLs:
// /api/products?category=electronics&price[gte]=100&price[lte]=500&sort=-price&page=2&limit=10&fields=name,price&search=laptop
```

---

## ৬. CRUD Implementation Example (Complete)

একটি সম্পূর্ণ User Management API:

```javascript
const express = require('express');
const app = express();

app.use(express.json());

// Fake database
let users = [
    { id: 1, name: "Ripon", email: "ripon@example.com", role: "admin" },
    { id: 2, name: "Karim", email: "karim@example.com", role: "user" }
];

// GET: All Users (with filtering, sorting, pagination)
app.get('/api/v1/users', (req, res) => {
    try {
        let filteredUsers = [...users];
        
        // Filtering
        if (req.query.role) {
            filteredUsers = filteredUsers.filter(u => u.role === req.query.role);
        }
        
        if (req.query.search) {
            const search = req.query.search.toLowerCase();
            filteredUsers = filteredUsers.filter(u => 
                u.name.toLowerCase().includes(search) ||
                u.email.toLowerCase().includes(search)
            );
        }
        
        // Sorting
        if (req.query.sort) {
            const sortField = req.query.sort.replace('-', '');
            const sortOrder = req.query.sort.startsWith('-') ? -1 : 1;
            filteredUsers.sort((a, b) => {
                if (a[sortField] < b[sortField]) return -1 * sortOrder;
                if (a[sortField] > b[sortField]) return 1 * sortOrder;
                return 0;
            });
        }
        
        // Pagination
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        const paginatedUsers = filteredUsers.slice(startIndex, endIndex);
        
        res.status(200).json({
            status: 'success',
            results: paginatedUsers.length,
            pagination: {
                page,
                limit,
                total: filteredUsers.length,
                pages: Math.ceil(filteredUsers.length / limit)
            },
            data: { users: paginatedUsers }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
});

// GET: Single User
app.get('/api/v1/users/:id', (req, res) => {
    const user = users.find(u => u.id === parseInt(req.params.id));
    
    if (!user) {
        return res.status(404).json({
            status: 'fail',
            message: 'User not found'
        });
    }
    
    res.status(200).json({
        status: 'success',
        data: { user }
    });
});

// POST: Create User
app.post('/api/v1/users', (req, res) => {
    const { name, email, role } = req.body;
    
    // Validation
    if (!name || !email) {
        return res.status(400).json({
            status: 'fail',
            message: 'Name and email are required'
        });
    }
    
    // Check duplicate email
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
        return res.status(409).json({
            status: 'fail',
            message: 'Email already exists'
        });
    }
    
    const newUser = {
        id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
        name,
        email,
        role: role || 'user'
    };
    
    users.push(newUser);
    
    res.status(201)
       .location(`/api/v1/users/${newUser.id}`)
       .json({
           status: 'success',
           data: { user: newUser }
       });
});

// PUT: Update User (full replace)
app.put('/api/v1/users/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = users.findIndex(u => u.id === id);
    
    if (index === -1) {
        return res.status(404).json({
            status: 'fail',
            message: 'User not found'
        });
    }
    
    const { name, email, role } = req.body;
    
    if (!name || !email) {
        return res.status(400).json({
            status: 'fail',
            message: 'Name and email are required'
        });
    }
    
    users[index] = { id, name, email, role: role || 'user' };
    
    res.status(200).json({
        status: 'success',
        data: { user: users[index] }
    });
});

// PATCH: Update User (partial)
app.patch('/api/v1/users/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const user = users.find(u => u.id === id);
    
    if (!user) {
        return res.status(404).json({
            status: 'fail',
            message: 'User not found'
        });
    }
    
    // Update only provided fields
    if (req.body.name) user.name = req.body.name;
    if (req.body.email) user.email = req.body.email;
    if (req.body.role) user.role = req.body.role;
    
    res.status(200).json({
        status: 'success',
        data: { user }
    });
});

// DELETE: Delete User
app.delete('/api/v1/users/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = users.findIndex(u => u.id === id);
    
    if (index === -1) {
        return res.status(404).json({
            status: 'fail',
            message: 'User not found'
        });
    }
    
    users.splice(index, 1);
    
    res.status(204).send();
});

// 404 Handler
app.use((req, res) => {
    res.status(404).json({
        status: 'fail',
        message: 'Route not found'
    });
});

// Error Handler
app.use((err, req, res, next) => {
    res.status(500).json({
        status: 'error',
        message: err.message
    });
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
```

---

## ৭. API Versioning - বিস্তারিত

ভবিষ্যতে API পরিবর্তন হলে যাতে পুরনো ক্লায়েন্টদের সমস্যা না হয়, সেজন্য ভার্সনিং ব্যবহার করা আবশ্যক।

### কেন Versioning প্রয়োজন?

ধরুন আপনার API এখন এভাবে কাজ করে:
```json
GET /api/users/123
{
    "name": "Ripon Ahmed",
    "email": "ripon@example.com"
}
```

কিন্তু পরে আপনি response format পরিবর্তন করলেন:
```json
{
    "user": {
        "fullName": "Ripon Ahmed",
        "contactEmail": "ripon@example.com"
    }
}
```

পুরনো mobile apps crash করবে! এজন্য versioning দরকার।

### Versioning Strategies

#### ১. URL Versioning (সবচেয়ে জনপ্রিয়) ✅

```javascript
// v1
app.get('/api/v1/users', (req, res) => {
    res.json({
        name: "Ripon",
        email: "ripon@example.com"
    });
});

// v2 (নতুন structure)
app.get('/api/v2/users', (req, res) => {
    res.json({
        user: {
            fullName: "Ripon",
            contactInfo: {
                email: "ripon@example.com"
            }
        }
    });
});

// URLs:
// /api/v1/users
// /api/v2/users
```

**সুবিধা:**
- সহজ এবং clear
- Browser এ test করা easy
- Documentation সহজ

**অসুবিধা:**
- URL পরিবর্তন হয়

#### ২. Header Versioning

```javascript
app.get('/api/users', (req, res) => {
    const version = req.headers['api-version'] || '1';
    
    if (version === '1') {
        res.json({
            name: "Ripon",
            email: "ripon@example.com"
        });
    } else if (version === '2') {
        res.json({
            user: {
                fullName: "Ripon",
                contactInfo: { email: "ripon@example.com" }
            }
        });
    }
});

// Request:
// GET /api/users
// Headers: { "API-Version": "2" }
```

**সুবিধা:**
- URL একই থাকে
- RESTful principle মানে

**অসুবিধা:**
- ব্রাউজারে test করা কঠিন
- Header সেট করতে হয়

#### ৩. Query Parameter Versioning

```javascript
app.get('/api/users', (req, res) => {
    const version = req.query.version || '1';
    
    if (version === '1') {
        // v1 response
    } else if (version === '2') {
        // v2 response
    }
});

// URL: /api/users?version=2
```

#### ৪. Accept Header Versioning (RESTful)

```javascript
app.get('/api/users', (req, res) => {
    const acceptHeader = req.headers.accept;
    
    if (acceptHeader.includes('application/vnd.myapi.v2+json')) {
        // v2 response
    } else {
        // v1 response
    }
});

// Request:
// Accept: application/vnd.myapi.v2+json
```

### Best Practices

```javascript
// 1. Version from the start
✅ /api/v1/users (শুরু থেকেই)
❌ /api/users (পরে পরিবর্তন করা কঠিন)

// 2. Support multiple versions
app.use('/api/v1', require('./routes/v1'));
app.use('/api/v2', require('./routes/v2'));

// 3. Deprecation notice
app.get('/api/v1/users', (req, res) => {
    res.set('Warning', '299 - "API v1 is deprecated. Please migrate to v2"');
    res.json(users);
});

// 4. Sunset header (কবে বন্ধ হবে)
res.set('Sunset', 'Sat, 31 Dec 2026 23:59:59 GMT');
```

### Version Migration Example

```javascript
// routes/v1/users.js
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.json({
        name: "Ripon",
        email: "ripon@example.com"
    });
});

module.exports = router;

// routes/v2/users.js
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.json({
        data: {
            firstName: "Ripon",
            lastName: "Ahmed",
            contact: {
                email: "ripon@example.com",
                phone: "+880123456789"
            }
        }
    });
});

module.exports = router;

// app.js
const v1Routes = require('./routes/v1/users');
const v2Routes = require('./routes/v2/users');

app.use('/api/v1/users', v1Routes);
app.use('/api/v2/users', v2Routes);
```

---

## ৮. Standard Response Format (JSend Pattern)

সবসময় একটি consistent ফরম্যাটে রেসপন্স পাঠানো উচিত। এতে ফ্রন্টএন্ড ডেভেলপারদের কাজ অনেক সহজ হয়।

### JSend Specification

তিন ধরনের response status আছে:

#### ১. Success Response
সবকিছু ঠিক আছে।

```json
{
  "status": "success",
  "data": {
    "id": 1,
    "name": "Ripon",
    "email": "ripon@example.com"
  }
}
```

```javascript
// Implementation
app.get('/api/users/:id', (req, res) => {
    const user = users.find(u => u.id === req.params.id);
    
    res.json({
        status: 'success',
        data: user
    });
});
```

#### ২. Fail Response
Client এর ভুল (validation error, not found, etc.)

```json
{
  "status": "fail",
  "message": "Validation failed",
  "errors": {
    "email": "Email is required",
    "password": "Password must be at least 6 characters"
  }
}
```

```javascript
app.post('/api/users', (req, res) => {
    const { name, email } = req.body;
    
    if (!name || !email) {
        return res.status(400).json({
            status: 'fail',
            message: 'Validation failed',
            errors: {
                name: !name ? 'Name is required' : null,
                email: !email ? 'Email is required' : null
            }
        });
    }
    
    // Create user...
});
```

#### ৩. Error Response
Server এ problem (bug, crash, database down)

```json
{
  "status": "error",
  "message": "Internal server error",
  "code": "DATABASE_CONNECTION_FAILED"
}
```

```javascript
app.use((err, req, res, next) => {
    console.error(err);
    
    res.status(500).json({
        status: 'error',
        message: err.message,
        ...(process.env.NODE_ENV === 'development' && {
            stack: err.stack
        })
    });
});
```

### Extended Response Format

আরও তথ্য যোগ করা:

```json
{
  "status": "success",
  "message": "User created successfully",
  "data": {
    "user": {
      "id": 123,
      "name": "Ripon"
    }
  },
  "meta": {
    "timestamp": "2026-01-17T10:30:00Z",
    "version": "v1",
    "requestId": "abc-123-def-456"
  },
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "pages": 10
  }
}
```

### Collection Response (Multiple Items)

```json
{
  "status": "success",
  "results": 25,
  "data": [
    { "id": 1, "name": "User 1" },
    { "id": 2, "name": "User 2" }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "pages": 3
  }
}
```

### Nested Resource Response

```json
{
  "status": "success",
  "data": {
    "user": {
      "id": 1,
      "name": "Ripon",
      "posts": [
        { "id": 101, "title": "First Post" },
        { "id": 102, "title": "Second Post" }
      ]
    }
  }
}
```

### Response Helper Functions

```javascript
// helpers/response.js

class ResponseHelper {
    static success(res, data, statusCode = 200, message = null) {
        const response = {
            status: 'success',
            ...(message && { message }),
            data
        };
        return res.status(statusCode).json(response);
    }
    
    static fail(res, message, errors = null, statusCode = 400) {
        const response = {
            status: 'fail',
            message,
            ...(errors && { errors })
        };
        return res.status(statusCode).json(response);
    }
    
    static error(res, message, statusCode = 500) {
        const response = {
            status: 'error',
            message
        };
        return res.status(statusCode).json(response);
    }
    
    static paginated(res, data, pagination, statusCode = 200) {
        return res.status(statusCode).json({
            status: 'success',
            results: data.length,
            pagination,
            data
        });
    }
}

module.exports = ResponseHelper;

// Usage
const ResponseHelper = require('./helpers/response');

app.get('/api/users/:id', (req, res) => {
    const user = users.find(u => u.id === req.params.id);
    
    if (!user) {
        return ResponseHelper.fail(res, 'User not found', null, 404);
    }
    
    return ResponseHelper.success(res, { user });
});

app.post('/api/users', (req, res) => {
    const { name, email } = req.body;
    
    if (!name || !email) {
        return ResponseHelper.fail(res, 'Validation failed', {
            name: !name ? 'Name is required' : null,
            email: !email ? 'Email is required' : null
        });
    }
    
    const newUser = createUser({ name, email });
    return ResponseHelper.success(res, { user: newUser }, 201, 'User created');
});
```

### Error Response with Codes

```javascript
// Custom error codes
const ERROR_CODES = {
    VALIDATION_FAILED: 'VALIDATION_FAILED',
    USER_NOT_FOUND: 'USER_NOT_FOUND',
    DUPLICATE_EMAIL: 'DUPLICATE_EMAIL',
    UNAUTHORIZED: 'UNAUTHORIZED',
    FORBIDDEN: 'FORBIDDEN'
};

app.post('/api/users', (req, res) => {
    const { email } = req.body;
    
    if (users.find(u => u.email === email)) {
        return res.status(409).json({
            status: 'fail',
            message: 'Email already exists',
            code: ERROR_CODES.DUPLICATE_EMAIL
        });
    }
    
    // Create user...
});

// Frontend can check:
// if (response.code === 'DUPLICATE_EMAIL') { ... }
```

---

## ৯. Authentication & Authorization

### Authentication - ইউজার কে?

```javascript
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// Register
app.post('/api/auth/register', async (req, res) => {
    const { name, email, password } = req.body;
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = await User.create({
        name,
        email,
        password: hashedPassword
    });
    
    // Generate JWT token
    const token = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
    );
    
    res.status(201).json({
        status: 'success',
        data: {
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            },
            token
        }
    });
});

// Login
app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;
    
    // Find user
    const user = await User.findOne({ email });
    
    if (!user) {
        return res.status(401).json({
            status: 'fail',
            message: 'Invalid credentials'
        });
    }
    
    // Verify password
    const isValid = await bcrypt.compare(password, user.password);
    
    if (!isValid) {
        return res.status(401).json({
            status: 'fail',
            message: 'Invalid credentials'
        });
    }
    
    // Generate token
    const token = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
    );
    
    res.json({
        status: 'success',
        data: {
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            },
            token
        }
    });
});

// Authentication Middleware
const authenticate = (req, res, next) => {
    try {
        // Get token from header
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                status: 'fail',
                message: 'No token provided'
            });
        }
        
        const token = authHeader.split(' ')[1];
        
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Add user to request
        req.user = decoded;
        
        next();
    } catch (error) {
        return res.status(401).json({
            status: 'fail',
            message: 'Invalid or expired token'
        });
    }
};

// Protected route
app.get('/api/profile', authenticate, (req, res) => {
    res.json({
        status: 'success',
        data: {
            user: req.user
        }
    });
});
```

### Authorization - ইউজার কী করতে পারবে?

```javascript
// Role-based authorization
const authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                status: 'fail',
                message: 'You do not have permission to perform this action'
            });
        }
        next();
    };
};

// Usage
app.delete('/api/users/:id', 
    authenticate,                    // Must be logged in
    authorize('admin'),              // Must be admin
    (req, res) => {
        // Delete user
    }
);

app.post('/api/posts', 
    authenticate,                    // Must be logged in
    authorize('admin', 'editor'),    // Must be admin OR editor
    (req, res) => {
        // Create post
    }
);
```

### Resource Ownership Check

```javascript
// Check if user owns the resource
const checkOwnership = (resourceType) => {
    return async (req, res, next) => {
        try {
            let resource;
            
            if (resourceType === 'post') {
                resource = await Post.findById(req.params.id);
            } else if (resourceType === 'comment') {
                resource = await Comment.findById(req.params.id);
            }
            
            if (!resource) {
                return res.status(404).json({
                    status: 'fail',
                    message: `${resourceType} not found`
                });
            }
            
            // Check if user owns this resource
            if (resource.author.toString() !== req.user.userId) {
                return res.status(403).json({
                    status: 'fail',
                    message: 'You can only modify your own resources'
                });
            }
            
            req.resource = resource;
            next();
        } catch (error) {
            res.status(500).json({
                status: 'error',
                message: error.message
            });
        }
    };
};

// Usage
app.delete('/api/posts/:id',
    authenticate,
    checkOwnership('post'),
    (req, res) => {
        // User owns this post, can delete
        req.resource.remove();
        res.status(204).send();
    }
);
```

### API Key Authentication

```javascript
const API_KEYS = {
    'abc123': { name: 'Mobile App', permissions: ['read', 'write'] },
    'xyz789': { name: 'Analytics', permissions: ['read'] }
};

const apiKeyAuth = (req, res, next) => {
    const apiKey = req.headers['x-api-key'];
    
    if (!apiKey || !API_KEYS[apiKey]) {
        return res.status(401).json({
            status: 'fail',
            message: 'Invalid API key'
        });
    }
    
    req.apiClient = API_KEYS[apiKey];
    next();
};

app.get('/api/data', apiKeyAuth, (req, res) => {
    res.json({
        status: 'success',
        data: { ... },
        client: req.apiClient.name
    });
});
```

---

## ১০. API Security Best Practices

### ১. HTTPS ব্যবহার করুন
সবসময় HTTPS ব্যবহার করুন, HTTP নয়।

```javascript
// Redirect HTTP to HTTPS
app.use((req, res, next) => {
    if (req.header('x-forwarded-proto') !== 'https') {
        res.redirect(`https://${req.header('host')}${req.url}`);
    } else {
        next();
    }
});
```

### ২. Rate Limiting
একই IP থেকে অতিরিক্ত request block করুন।

```bash
npm install express-rate-limit
```

```javascript
const rateLimit = require('express-rate-limit');

// General API limiter
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // 100 requests per 15 minutes
    message: {
        status: 'fail',
        message: 'Too many requests, please try again later'
    },
    standardHeaders: true,
    legacyHeaders: false
});

app.use('/api/', apiLimiter);

// Stricter limiter for authentication endpoints
const authLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 5, // 5 failed attempts
    skipSuccessfulRequests: true
});

app.post('/api/auth/login', authLimiter, loginController);
```

### ৩. Input Validation & Sanitization

```bash
npm install express-validator
```

```javascript
const { body, validationResult } = require('express-validator');
const validator = require('validator');

app.post('/api/users',
    // Validation rules
    [
        body('email')
            .isEmail().withMessage('Invalid email')
            .normalizeEmail(),
        body('password')
            .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
            .matches(/\d/).withMessage('Password must contain a number'),
        body('name')
            .trim()
            .escape()
            .isLength({ min: 2 }).withMessage('Name too short')
    ],
    (req, res) => {
        const errors = validationResult(req);
        
        if (!errors.isEmpty()) {
            return res.status(422).json({
                status: 'fail',
                errors: errors.array()
            });
        }
        
        // Create user
    }
);
```

### ৪. SQL Injection Prevention

```javascript
// ❌ Bad - SQL Injection vulnerable
const query = `SELECT * FROM users WHERE email = '${req.body.email}'`;

// ✅ Good - Use parameterized queries
const query = 'SELECT * FROM users WHERE email = ?';
db.query(query, [req.body.email]);

// ✅ Good - Use ORM (Sequelize, TypeORM)
const user = await User.findOne({ where: { email: req.body.email } });
```

### ৫. NoSQL Injection Prevention

```javascript
// ❌ Bad
const user = await User.findOne({ email: req.body.email });

// If attacker sends: { "email": { "$gt": "" } }
// It will return any user!

// ✅ Good - Validate type
if (typeof req.body.email !== 'string') {
    return res.status(400).json({ error: 'Invalid email' });
}

const user = await User.findOne({ email: req.body.email });
```

### ৬. CORS Configuration

```bash
npm install cors
```

```javascript
const cors = require('cors');

// Production CORS config
app.use(cors({
    origin: process.env.FRONTEND_URL, // Only allow your frontend
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
```

### ৭. Helmet - Security Headers

```bash
npm install helmet
```

```javascript
const helmet = require('helmet');

app.use(helmet()); // Adds various security headers

// Custom configuration
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"]
        }
    }
}));
```

### ৮. Hide Sensitive Information

```javascript
// Don't expose stack traces in production
app.use((err, req, res, next) => {
    res.status(500).json({
        status: 'error',
        message: process.env.NODE_ENV === 'production' 
            ? 'Internal server error' 
            : err.message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
});

// Hide Express from X-Powered-By header
app.disable('x-powered-by');
```

### ৯. Secure Password Storage

```javascript
const bcrypt = require('bcrypt');

// Hash password before saving
const saltRounds = 10;
const hashedPassword = await bcrypt.hash(password, saltRounds);

// Never store plain text passwords
❌ { password: 'mypassword123' }
✅ { password: '$2b$10$N9qo8uLOickgx2ZMRZoMye' }
```

### ১০. Environment Variables

```javascript
// .env file
PORT=3000
JWT_SECRET=your-super-secret-key-here-very-long-and-random
DATABASE_URL=mongodb://localhost:27017/myapp
NODE_ENV=production

// Use dotenv
require('dotenv').config();

const jwtSecret = process.env.JWT_SECRET;
```

---

## ১১. Error Handling Pattern

### Centralized Error Handling

```javascript
// Custom error class
class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        this.isOperational = true;
        
        Error.captureStackTrace(this, this.constructor);
    }
}

// Async error handler wrapper
const catchAsync = (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch(next);
    };
};

// Usage
app.get('/api/users/:id', catchAsync(async (req, res, next) => {
    const user = await User.findById(req.params.id);
    
    if (!user) {
        return next(new AppError('User not found', 404));
    }
    
    res.json({
        status: 'success',
        data: { user }
    });
}));

// Global error handler
app.use((err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';
    
    if (process.env.NODE_ENV === 'development') {
        res.status(err.statusCode).json({
            status: err.status,
            error: err,
            message: err.message,
            stack: err.stack
        });
    } else {
        // Production
        if (err.isOperational) {
            res.status(err.statusCode).json({
                status: err.status,
                message: err.message
            });
        } else {
            console.error('ERROR 💥', err);
            res.status(500).json({
                status: 'error',
                message: 'Something went wrong'
            });
        }
    }
});

module.exports = { AppError, catchAsync };
```

---

## ১২. API Documentation

### Swagger/OpenAPI Documentation

```bash
npm install swagger-ui-express swagger-jsdoc
```

```javascript
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'My API',
            version: '1.0.0',
            description: 'API Documentation',
            contact: {
                name: 'Ripon',
                email: 'ripon@example.com'
            }
        },
        servers: [
            {
                url: 'http://localhost:3000',
                description: 'Development server'
            }
        ]
    },
    apis: ['./routes/*.js']
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Annotate your routes
/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: List of users
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       name:
 *                         type: string
 *                       email:
 *                         type: string
 */
app.get('/api/users', (req, res) => {
    // ...
});
```

---

## ১৩. API Testing

### Manual Testing Tools

#### 1. Postman (সবচেয়ে জনপ্রিয়)
- Collections তৈরি করুন
- Environment variables ব্যবহার করুন
- Automated tests লিখুন

```javascript
// Postman Test Script
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Response has user data", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.status).to.eql("success");
    pm.expect(jsonData.data).to.have.property("user");
});
```

#### 2. Thunder Client (VS Code Extension)
- VS Code এর মধ্যেই কাজ করে
- হালকা এবং দ্রুত

#### 3. Insomnia
- সুন্দর UI
- GraphQL support

### Automated Testing (Jest + Supertest)

```bash
npm install --save-dev jest supertest
```

```javascript
// users.test.js
const request = require('supertest');
const app = require('../app');

describe('User API', () => {
    describe('GET /api/users', () => {
        it('should return all users', async () => {
            const res = await request(app)
                .get('/api/users')
                .expect('Content-Type', /json/)
                .expect(200);
            
            expect(res.body.status).toBe('success');
            expect(Array.isArray(res.body.data)).toBe(true);
        });
    });
    
    describe('POST /api/users', () => {
        it('should create a new user', async () => {
            const newUser = {
                name: 'Test User',
                email: 'test@example.com',
                password: 'password123'
            };
            
            const res = await request(app)
                .post('/api/users')
                .send(newUser)
                .expect(201);
            
            expect(res.body.status).toBe('success');
            expect(res.body.data.user).toHaveProperty('id');
            expect(res.body.data.user.name).toBe('Test User');
        });
        
        it('should fail without email', async () => {
            const res = await request(app)
                .post('/api/users')
                .send({ name: 'Test' })
                .expect(400);
            
            expect(res.body.status).toBe('fail');
        });
    });
    
    describe('DELETE /api/users/:id', () => {
        it('should delete a user', async () => {
            await request(app)
                .delete('/api/users/1')
                .expect(204);
        });
        
        it('should return 404 for non-existent user', async () => {
            await request(app)
                .delete('/api/users/9999')
                .expect(404);
        });
    });
});
```

---

## ১৪. Complete Production-Ready API Example

```javascript
// app.js
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
require('dotenv').config();

const app = express();

// 1. Security middleware
app.use(helmet());
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}));

// 2. Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100
});
app.use('/api', limiter);

// 3. Logging
app.use(morgan('combined'));

// 4. Body parsers
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// 5. Routes
app.use('/api/v1/users', require('./routes/userRoutes'));
app.use('/api/v1/posts', require('./routes/postRoutes'));

// 6. Health check
app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// 7. 404 handler
app.all('*', (req, res) => {
    res.status(404).json({
        status: 'fail',
        message: `Route ${req.originalUrl} not found`
    });
});

// 8. Global error handler
app.use((err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    
    res.status(err.statusCode).json({
        status: err.status || 'error',
        message: err.message,
        ...(process.env.NODE_ENV === 'development' && {
            stack: err.stack
        })
    });
});

module.exports = app;

// server.js
const app = require('./app');
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📚 API Docs: http://localhost:${PORT}/api-docs`);
});
```

---

## ১৫. Best Practices Summary

### ✅ Do's (করণীয়)

1. **Use proper HTTP methods and status codes**
2. **Version your API from day one** (`/api/v1/...`)
3. **Use nouns for resources, not verbs** (`/users` not `/getUsers`)
4. **Implement pagination for collections**
5. **Use filtering, sorting, and field selection**
6. **Consistent response format** (JSend)
7. **Authentication and authorization**
8. **Input validation and sanitization**
9. **Rate limiting**
10. **Error handling** (centralized)
11. **API documentation** (Swagger)
12. **HTTPS everywhere**
13. **Environment variables for config**
14. **Logging** (Morgan, Winston)
15. **Testing** (unit + integration)

### ❌ Don'ts (বর্জনীয়)

1. **Don't use verbs in URLs** (`/createUser`)
2. **Don't return different formats** (inconsistent responses)
3. **Don't expose sensitive data** (passwords, keys)
4. **Don't skip authentication**
5. **Don't ignore error handling**
6. **Don't use GET for state-changing operations**
7. **Don't return 200 for everything**
8. **Don't trust user input** (always validate)
9. **Don't nest routes too deep** (max 2-3 levels)
10. **Don't forget documentation**

---

## সারাংশ

একটি Production-Ready RESTful API তে থাকা উচিত:

✅ Proper resource naming  
✅ Correct HTTP methods & status codes  
✅ Query parameters (filtering, sorting, pagination)  
✅ Consistent response format  
✅ Authentication & authorization  
✅ Input validation  
✅ Security headers (Helmet)  
✅ Rate limiting  
✅ CORS configuration  
✅ Error handling  
✅ API documentation  
✅ Logging  
✅ Testing  
✅ Versioning  

**Next Steps:**
1. Database integration (MongoDB/PostgreSQL)
2. File uploads (Multer)
3. Real-time features (Socket.io)
4. Caching (Redis)
5. Microservices architecture

Happy Coding! 🚀
