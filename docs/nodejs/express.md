# Express.js Framework - সম্পূর্ণ গাইড

Node.js দিয়ে র "Raw" কোড লেখা অনেক সময় কষ্টসাধ্য এবং রিপিটিটিভ হতে পারে। এই সমস্যা সমাধানের জন্যই **Express.js**। এটি Node.js এর জন্য সবচেয়ে জনপ্রিয় এবং মিনিমালিস্ট ওয়েব ফ্রেমওয়ার্ক।

## ১. Express.js কি এবং কেন?

### Express.js এর পরিচয়
Express.js হলো Node.js এর ওপর তৈরি একটি লেয়ার যা সার্ভার তৈরি, রাউটিং এবং মিডলওয়্যার ম্যানেজমেন্টকে অনেক সহজ করে দেয়।

### কেন Express.js ব্যবহার করবেন?

1. **Easy Routing:** কমপ্লেক্স URL রাউটিং খুব সহজে করা যায়।
2. **Middleware Support:** রিকোয়েস্ট এবং রেসপন্স এর মাঝখানে লজিক বসানো যায়।
3. **Database Integration:** যেকোনো ডাটাবেস (MongoDB, MySQL) এর সাথে সহজে কানেক্ট করা যায়।
4. **Performance:** হালকা এবং দ্রুত।
5. **Community Support:** বিশাল কমিউনিটি এবং অসংখ্য প্লাগইন।

### Raw Node.js vs Express.js তুলনা

**Raw Node.js দিয়ে সার্ভার:**
```javascript
const http = require('http');
const url = require('url');

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    
    if (parsedUrl.pathname === '/' && req.method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('Home Page');
    } else if (parsedUrl.pathname === '/about' && req.method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('About Page');
    } else if (parsedUrl.pathname === '/api/users' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'User created', data: body }));
        });
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
    }
});

server.listen(3000);
```

**Express.js দিয়ে একই কাজ:**
```javascript
const express = require('express');
const app = express();

app.use(express.json()); // Body parser

app.get('/', (req, res) => res.send('Home Page'));
app.get('/about', (req, res) => res.send('About Page'));
app.post('/api/users', (req, res) => {
    res.json({ message: 'User created', data: req.body });
});

app.listen(3000);
```

**দেখুন কত সহজ!** কোড কম, পড়তে সহজ এবং মেইনটেইন করা সুবিধাজনক।

---

## ২. Installation & Setup

প্রথমে একটি ফোল্ডার তৈরি করে `npm init -y` দিন। এরপর Express ইন্সটল করুন:

```bash
npm install express
```

### Basic Server তৈরি
`index.js` ফাইলে নিচের কোড লিখুন:

```javascript
const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send('Hello World from Express!');
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
```

---

## ৩. Routing Fundamentals (রাউটিং এর মূল বিষয়)

এক্সপ্রেসে রাউটিং খুব স্ট্রাকচার্ড এবং শক্তিশালী। রাউটিং মানে হলো বিভিন্ন URL এর জন্য বিভিন্ন রেসপন্স পাঠানো।

### HTTP Methods বিস্তারিত

HTTP মেথড দিয়ে বোঝানো হয় আমরা সার্ভারের সাথে কী ধরনের কাজ করতে চাই।

#### 1. GET - ডেটা রিড করা
```javascript
// সব ইউজার আনা
app.get('/users', (req, res) => {
    // Database থেকে ডেটা fetch করার লজিক
    const users = [
        { id: 1, name: 'Ripon', email: 'ripon@example.com' },
        { id: 2, name: 'Karim', email: 'karim@example.com' }
    ];
    res.json(users);
});

// নির্দিষ্ট একটি ইউজার আনা
app.get('/users/:id', (req, res) => {
    const userId = req.params.id;
    // Database query: SELECT * FROM users WHERE id = userId
    const user = { id: userId, name: 'Ripon', email: 'ripon@example.com' };
    res.json(user);
});
```

#### 2. POST - নতুন ডেটা তৈরি করা
```javascript
app.post('/users', (req, res) => {
    // req.body তে ক্লায়েন্ট থেকে পাঠানো ডেটা থাকবে
    const newUser = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    };
    
    // Validation
    if (!newUser.name || !newUser.email) {
        return res.status(400).json({ 
            error: 'Name and email are required' 
        });
    }
    
    // Database এ save করার লজিক
    // INSERT INTO users (name, email, password) VALUES (...)
    
    res.status(201).json({ 
        message: 'User created successfully',
        user: newUser 
    });
});
```

#### 3. PUT/PATCH - ডেটা আপডেট করা
```javascript
// PUT - পুরো রিসোর্স রিপ্লেস করে
app.put('/users/:id', (req, res) => {
    const userId = req.params.id;
    const updatedUser = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
        // সব ফিল্ড দিতে হবে
    };
    
    // UPDATE users SET name=?, email=?, password=? WHERE id=?
    res.json({ 
        message: `User ${userId} fully updated`,
        user: updatedUser 
    });
});

// PATCH - শুধু কিছু ফিল্ড আপডেট করে
app.patch('/users/:id', (req, res) => {
    const userId = req.params.id;
    // শুধু যে ফিল্ড পাঠানো হয়েছে সেটা আপডেট হবে
    const updates = req.body; // { name: 'New Name' }
    
    res.json({ 
        message: `User ${userId} partially updated`,
        updates: updates 
    });
});
```

#### 4. DELETE - ডেটা মুছে ফেলা
```javascript
app.delete('/users/:id', (req, res) => {
    const userId = req.params.id;
    
    // Database থেকে delete করার লজিক
    // DELETE FROM users WHERE id = userId
    
    res.json({ 
        message: `User ${userId} deleted successfully` 
    });
});
```

### Route Parameters বিস্তারিত

Route Parameters হলো URL এর ডায়নামিক অংশ যা `:` দিয়ে শুরু হয়।

```javascript
// একটি প্যারামিটার
app.get('/users/:id', (req, res) => {
    console.log(req.params.id); // "123"
    res.send(`User ID: ${req.params.id}`);
});

// একাধিক প্যারামিটার
app.get('/users/:userId/posts/:postId', (req, res) => {
    console.log(req.params.userId);  // "5"
    console.log(req.params.postId);  // "42"
    res.send(`User ${req.params.userId}'s Post ${req.params.postId}`);
});

// Optional Parameter (? দিয়ে)
app.get('/users/:id/:name?', (req, res) => {
    // name থাকতেও পারে, নাও পারে
    if (req.params.name) {
        res.send(`ID: ${req.params.id}, Name: ${req.params.name}`);
    } else {
        res.send(`ID: ${req.params.id}`);
    }
});
```

### Query Strings বিস্তারিত

Query strings URL এর পরে `?` দিয়ে শুরু হয় এবং filtering, sorting, pagination এর জন্য ব্যবহার হয়।

```javascript
// URL: /products?category=electronics&sort=price&order=asc&page=2&limit=10
app.get('/products', (req, res) => {
    const category = req.query.category;  // "electronics"
    const sort = req.query.sort;          // "price"
    const order = req.query.order;        // "asc"
    const page = req.query.page || 1;     // default 1
    const limit = req.query.limit || 10;  // default 10
    
    // Database query তৈরি
    // SELECT * FROM products 
    // WHERE category = 'electronics' 
    // ORDER BY price ASC 
    // LIMIT 10 OFFSET 10
    
    res.json({
        filters: { category, sort, order },
        pagination: { page, limit },
        results: [] // actual data
    });
});
```

### Route চেইনিং

একই রাউটের জন্য একাধিক মেথড একসাথে লেখা:

```javascript
app.route('/users/:id')
    .get((req, res) => {
        res.send('Get user');
    })
    .put((req, res) => {
        res.send('Update user');
    })
    .delete((req, res) => {
        res.send('Delete user');
    });
```

### Express Router দিয়ে মডুলার রাউটিং

বড় প্রজেক্টে সব রাউট এক ফাইলে রাখা মুশকিল। তাই আলাদা ফাইলে রাউট তৈরি করি।

**routes/users.js:**
```javascript
const express = require('express');
const router = express.Router();

// Base path: /api/users
router.get('/', (req, res) => {
    res.json({ message: 'Get all users' });
});

router.get('/:id', (req, res) => {
    res.json({ message: `Get user ${req.params.id}` });
});

router.post('/', (req, res) => {
    res.json({ message: 'Create user' });
});

module.exports = router;
```

**app.js (Main file):**
```javascript
const express = require('express');
const app = express();
const userRoutes = require('./routes/users');

app.use('/api/users', userRoutes); // সব রাউট /api/users দিয়ে শুরু হবে

app.listen(3000);
```

এখন `/api/users` এবং `/api/users/:id` কাজ করবে!

---

## ৪. Middleware (Express এর জাদুকরী শক্তি)

মিডলওয়্যার হলো Express এর সবচেয়ে পাওয়ারফুল ফিচার। এটি এমন ফাংশন যা রিকোয়েস্ট (`req`) এবং রেসপন্স (`res`) এর মাঝখানে কাজ করে।

### Middleware কিভাবে কাজ করে?

```
Client Request → Middleware 1 → Middleware 2 → Route Handler → Response
                     ↓              ↓               ↓
                  next()        next()          res.send()
```

প্রতিটি middleware তিনটি জিনিস করতে পারে:
1. **কোড এক্সিকিউট করা** (লগিং, ভ্যালিডেশন)
2. **req এবং res অবজেক্ট মডিফাই করা** (যেমন: req.user যোগ করা)
3. **পরবর্তী middleware এ পাঠানো** (`next()` কল করে) বা রেসপন্স পাঠিয়ে শেষ করা

### Middleware এর মূল স্ট্রাকচার

```javascript
function myMiddleware(req, res, next) {
    // কিছু কাজ করুন
    console.log('Middleware executing');
    
    // অপশন 1: পরবর্তী middleware এ যান
    next();
    
    // অপশন 2: এখানেই রেসপন্স পাঠিয়ে শেষ করুন
    // res.send('Done');
    
    // অপশন 3: এরর পাঠান
    // next(new Error('Something went wrong'));
}

app.use(myMiddleware);
```

### A. Application-Level Middleware (কাস্টম মিডলওয়্যার)

#### ১. Logger Middleware
সব রিকোয়েস্ট লগ করা:

```javascript
const logger = (req, res, next) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${req.method} ${req.url}`);
    next(); // MUST CALL next() নাহলে আটকে থাকবে!
};

app.use(logger); // সব রাউটে কাজ করবে
```

#### ২. Authentication Middleware
ইউজার লগইন আছে কিনা চেক করা:

```javascript
const isAuthenticated = (req, res, next) => {
    const token = req.headers['authorization'];
    
    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }
    
    // Token verify করা (JWT দিয়ে)
    try {
        const decoded = verifyToken(token);
        req.user = decoded; // req তে user অবজেক্ট যোগ করলাম
        next(); // সফল হলে পরবর্তী স্টেপে যাবে
    } catch (error) {
        res.status(401).json({ error: 'Invalid token' });
    }
};

// নির্দিষ্ট রাউটে ব্যবহার
app.get('/profile', isAuthenticated, (req, res) => {
    res.json({ user: req.user }); // req.user middleware থেকে পাওয়া
});
```

#### ৩. Request Timing Middleware
রিকোয়েস্ট প্রসেস হতে কত সময় লাগলো:

```javascript
const requestTimer = (req, res, next) => {
    const startTime = Date.now();
    
    // Response শেষ হলে এই ইভেন্ট ফায়ার হবে
    res.on('finish', () => {
        const duration = Date.now() - startTime;
        console.log(`${req.method} ${req.url} took ${duration}ms`);
    });
    
    next();
};

app.use(requestTimer);
```

#### ৪. Request Validation Middleware
ইনপুট ডেটা ভ্যালিডেট করা:

```javascript
const validateUser = (req, res, next) => {
    const { name, email, password } = req.body;
    
    if (!name || name.length < 3) {
        return res.status(400).json({ 
            error: 'Name must be at least 3 characters' 
        });
    }
    
    if (!email || !email.includes('@')) {
        return res.status(400).json({ 
            error: 'Valid email is required' 
        });
    }
    
    if (!password || password.length < 6) {
        return res.status(400).json({ 
            error: 'Password must be at least 6 characters' 
        });
    }
    
    next(); // ভ্যালিডেশন পাস হলে এগিয়ে যান
};

app.post('/register', validateUser, (req, res) => {
    // এখানে পৌঁছালে মানে ডেটা valid
    res.json({ message: 'User registered' });
});
```

### B. Built-in Middleware (Express এর নিজস্ব)

#### ১. express.json()
POST/PUT রিকোয়েস্টে JSON body পার্স করে:

```javascript
app.use(express.json());

app.post('/data', (req, res) => {
    console.log(req.body); // { name: "Ripon", age: 25 }
    res.json({ received: req.body });
});
```

#### ২. express.urlencoded()
HTML ফর্ম ডেটা পার্স করে:

```javascript
app.use(express.urlencoded({ extended: true }));

app.post('/form', (req, res) => {
    console.log(req.body); // form data
    res.send('Form received');
});
```

#### ৩. express.static()
স্ট্যাটিক ফাইল (CSS, JS, Images) সার্ভ করে:

```javascript
// 'public' ফোল্ডারের সব ফাইল serve করবে
app.use(express.static('public'));

// এখন http://localhost:3000/style.css কাজ করবে
// যদি public/style.css ফাইল থাকে
```

### C. Third-party Middleware

#### ১. Morgan (Logging)
```bash
npm install morgan
```

```javascript
const morgan = require('morgan');

// Development mode
app.use(morgan('dev'));
// Output: GET /api/users 200 15.234 ms - 1024

// Production mode (more detailed)
app.use(morgan('combined'));
```

#### ২. CORS (Cross-Origin Resource Sharing)
ফ্রন্টএন্ড (React/Vue) থেকে API কল করতে দেয়:

```bash
npm install cors
```

```javascript
const cors = require('cors');

// সব ডোমেইন থেকে এক্সেস দিন
app.use(cors());

// নির্দিষ্ট ডোমেইন থেকে এক্সেস
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));
```

#### ৩. Helmet (Security)
সিকিউরিটি headers যোগ করে:

```bash
npm install helmet
```

```javascript
const helmet = require('helmet');
app.use(helmet());
```

#### ৪. Compression (Response Compression)
রেসপন্স সাইজ কমিয়ে দেয়:

```bash
npm install compression
```

```javascript
const compression = require('compression');
app.use(compression());
```

#### ৫. Express-rate-limit (Rate Limiting)
অতিরিক্ত রিকোয়েস্ট ব্লক করে (DDoS protection):

```bash
npm install express-rate-limit
```

```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // প্রতি IP থেকে 100টা request
    message: 'Too many requests, please try again later'
});

app.use('/api/', limiter);
```

### D. Router-Level Middleware
নির্দিষ্ট রাউটার এর জন্য:

```javascript
const router = express.Router();

// এই middleware শুধু এই router এর রাউটে কাজ করবে
router.use((req, res, next) => {
    console.log('Router middleware');
    next();
});

router.get('/test', (req, res) => {
    res.send('Test route');
});

app.use('/api', router);
```

### E. Error Handling Middleware

এরর হ্যান্ডলিং middleware সবসময় **শেষে** থাকবে এবং **৪টি প্যারামিটার** থাকবে।

```javascript
// সাধারণ Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    
    res.status(err.status || 500).json({
        error: {
            message: err.message,
            status: err.status || 500
        }
    });
});

// Custom Error তৈরি
class AppError extends Error {
    constructor(message, status) {
        super(message);
        this.status = status;
    }
}

// Error throw করা
app.get('/test', (req, res, next) => {
    const error = new AppError('Something went wrong', 400);
    next(error); // Error middleware এ পাঠাবে
});

// Async Error Handling
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

app.get('/async', asyncHandler(async (req, res) => {
    const data = await fetchDataFromDB();
    res.json(data);
}));
```

### Middleware Execution Order (গুরুত্বপূর্ণ!)

```javascript
// 1. প্রথমে এগুলো
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(cors());

// 2. তারপর custom middleware
app.use(logger);

// 3. তারপর routes
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);

// 4. 404 Handler (কোন রাউট match না করলে)
app.use((req, res, next) => {
    res.status(404).json({ error: 'Route not found' });
});

// 5. সবার শেষে Error Handler
app.use((err, req, res, next) => {
    res.status(500).json({ error: err.message });
});
```

**মনে রাখবেন:** Middleware এর order অত্যন্ত গুরুত্বপূর্ণ। যে order এ লিখবেন, সেই order এ execute হবে!

---

## ৫. Template Engines (সার্ভার-সাইড রেন্ডারিং)

সার্ভার সাইড রেন্ডারিং (SSR) এর জন্য টেমপ্লেট ইঞ্জিন ব্যবহার করা হয়। এটি দিয়ে HTML পেজে ডায়নামিক ডেটা দেখানো যায়।

### কেন Template Engine?

**Traditional Way (Static HTML):**
```html
<h1>Welcome, User!</h1>
<p>You have 0 notifications</p>
```

**Template Engine Way (Dynamic):**
```html
<h1>Welcome, <%= userName %>!</h1>
<p>You have <%= notificationCount %> notifications</p>
```

### EJS (Embedded JavaScript) - সবচেয়ে জনপ্রিয়

#### Installation & Setup
```bash
npm install ejs
```

```javascript
const express = require('express');
const app = express();

// View engine সেট করুন
app.set('view engine', 'ejs');
app.set('views', './views'); // views ফোল্ডার (default)
```

#### EJS Syntax

**views/profile.ejs:**
```html
<!DOCTYPE html>
<html>
<head>
    <title>Profile Page</title>
</head>
<body>
    <!-- Variable Output -->
    <h1>Welcome, <%= name %>!</h1>
    
    <!-- JavaScript Code (if/else) -->
    <% if (age >= 18) { %>
        <p>You are an adult</p>
    <% } else { %>
        <p>You are a minor</p>
    <% } %>
    
    <!-- Loop -->
    <ul>
        <% hobbies.forEach(hobby => { %>
            <li><%= hobby %></li>
        <% }) %>
    </ul>
    
    <!-- Unescaped HTML (সতর্কতার সাথে ব্যবহার করুন) -->
    <div><%- htmlContent %></div>
</body>
</html>
```

**app.js:**
```javascript
app.get('/profile', (req, res) => {
    res.render('profile', {
        name: 'Ripon',
        age: 25,
        hobbies: ['Coding', 'Reading', 'Gaming'],
        htmlContent: '<strong>Bold Text</strong>'
    });
});
```

#### EJS এর মূল সিনট্যাক্স

```javascript
<%= variable %>    // Output (HTML escaped)
<%- variable %>    // Output (Raw HTML)
<% code %>         // JavaScript code (no output)
<%# comment %>     // Comment
```

#### Partials (Reusable Components)

একই কোড বারবার না লিখে partials ব্যবহার করুন।

**views/partials/header.ejs:**
```html
<header>
    <nav>
        <a href="/">Home</a>
        <a href="/about">About</a>
        <a href="/contact">Contact</a>
    </nav>
</header>
```

**views/partials/footer.ejs:**
```html
<footer>
    <p>&copy; 2026 My Website</p>
</footer>
```

**views/home.ejs:**
```html
<!DOCTYPE html>
<html>
<head>
    <title>Home</title>
</head>
<body>
    <%- include('partials/header') %>
    
    <main>
        <h1>Home Page Content</h1>
    </main>
    
    <%- include('partials/footer') %>
</body>
</html>
```

#### Layout System

**views/layout.ejs:**
```html
<!DOCTYPE html>
<html>
<head>
    <title><%= title %></title>
    <link rel="stylesheet" href="/css/style.css">
</head>
<body>
    <%- include('partials/header') %>
    
    <main>
        <%- body %>  <!-- Child content এখানে আসবে -->
    </main>
    
    <%- include('partials/footer') %>
</body>
</html>
```

### Pug (আগে Jade) - Minimalist Template Engine

#### Installation
```bash
npm install pug
```

```javascript
app.set('view engine', 'pug');
```

#### Pug Syntax (No closing tags!)

**views/profile.pug:**
```pug
doctype html
html
  head
    title Profile Page
  body
    h1 Welcome, #{name}!
    
    if age >= 18
      p You are an adult
    else
      p You are a minor
    
    ul
      each hobby in hobbies
        li= hobby
```

**app.js:**
```javascript
app.get('/profile', (req, res) => {
    res.render('profile', {
        name: 'Ripon',
        age: 25,
        hobbies: ['Coding', 'Reading']
    });
});
```

### Handlebars - Logic-less Template

```bash
npm install express-handlebars
```

```javascript
const exphbs = require('express-handlebars');

app.engine('handlebars', exphbs.engine());
app.set('view engine', 'handlebars');
```

**views/profile.handlebars:**
```handlebars
<h1>Welcome, {{name}}!</h1>

{{#if isAdmin}}
  <p>You have admin access</p>
{{/if}}

<ul>
  {{#each hobbies}}
    <li>{{this}}</li>
  {{/each}}
</ul>
```

### কোনটা ব্যবহার করবেন?

- **EJS:** HTML এর মতো, শিখতে সহজ (Recommended for beginners)
- **Pug:** ক্লিন সিনট্যাক্স, কম কোড
- **Handlebars:** Logic-less, খুব সিম্পল

### Modern Alternative: React/Vue + Express API

আজকাল অনেকে টেমপ্লেট ইঞ্জিন বাদ দিয়ে:
- Backend: Express API (শুধু JSON রিটার্ন করে)
- Frontend: React/Vue/Angular (আলাদা প্রজেক্ট)

```javascript
// API approach
app.get('/api/profile', (req, res) => {
    res.json({
        name: 'Ripon',
        age: 25,
        hobbies: ['Coding', 'Reading']
    });
});
```

Frontend (React) fetch করে দেখায়।

---

## ৬. Request Object (req) - বিস্তারিত

Request অবজেক্টে ক্লায়েন্ট থেকে আসা সব তথ্য থাকে।

### ১. req.params - Route Parameters

URL এর ডায়নামিক অংশ:

```javascript
// URL: /users/123
app.get('/users/:id', (req, res) => {
    console.log(req.params.id); // "123"
    res.send(`User ID: ${req.params.id}`);
});

// Multiple params
// URL: /users/123/posts/456
app.get('/users/:userId/posts/:postId', (req, res) => {
    console.log(req.params); // { userId: "123", postId: "456" }
});
```

### ২. req.query - Query Strings

URL এর পরে `?` দিয়ে আসা ডেটা:

```javascript
// URL: /search?q=express&sort=asc&page=2
app.get('/search', (req, res) => {
    console.log(req.query.q);     // "express"
    console.log(req.query.sort);  // "asc"
    console.log(req.query.page);  // "2"
    
    // Default value
    const page = req.query.page || 1;
    const limit = req.query.limit || 10;
    
    res.json({ query: req.query });
});
```

### ৩. req.body - Request Body

POST/PUT রিকোয়েস্টে পাঠানো ডেটা (অবশ্যই `express.json()` middleware লাগবে):

```javascript
app.use(express.json());

// Client পাঠাচ্ছে: { "name": "Ripon", "email": "ripon@example.com" }
app.post('/users', (req, res) => {
    console.log(req.body.name);   // "Ripon"
    console.log(req.body.email);  // "ripon@example.com"
    
    res.json({ received: req.body });
});
```

### ৪. req.headers - HTTP Headers

```javascript
app.get('/check-headers', (req, res) => {
    console.log(req.headers['user-agent']);     // Browser info
    console.log(req.headers['authorization']);  // JWT token
    console.log(req.headers['content-type']);   // application/json
    
    res.json({ headers: req.headers });
});
```

### ৫. req.cookies - Cookies

```bash
npm install cookie-parser
```

```javascript
const cookieParser = require('cookie-parser');
app.use(cookieParser());

app.get('/check-cookies', (req, res) => {
    console.log(req.cookies);           // { sessionId: "abc123" }
    console.log(req.cookies.sessionId); // "abc123"
    
    res.json({ cookies: req.cookies });
});
```

### ৬. req.method - HTTP Method

```javascript
app.all('/test', (req, res) => {
    console.log(req.method); // GET, POST, PUT, DELETE, etc.
    res.send(`Method: ${req.method}`);
});
```

### ৭. req.url এবং req.path

```javascript
// URL: /users/123?sort=asc
app.get('/users/:id', (req, res) => {
    console.log(req.url);   // "/users/123?sort=asc"
    console.log(req.path);  // "/users/123"
    console.log(req.originalUrl); // Full URL with base path
});
```

### ৮. req.ip - Client IP Address

```javascript
app.get('/ip', (req, res) => {
    console.log(req.ip);  // Client এর IP address
    res.send(`Your IP: ${req.ip}`);
});
```

### ৯. req.protocol এবং req.hostname

```javascript
app.get('/info', (req, res) => {
    console.log(req.protocol);  // "http" or "https"
    console.log(req.hostname);  // "localhost" or "example.com"
    console.log(req.secure);    // true if HTTPS
    
    res.json({
        protocol: req.protocol,
        hostname: req.hostname,
        secure: req.secure
    });
});
```

### ১০. File Uploads (Multer)

```bash
npm install multer
```

```javascript
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

app.post('/upload', upload.single('avatar'), (req, res) => {
    console.log(req.file);       // File info
    console.log(req.body);       // Other form fields
    
    res.json({
        message: 'File uploaded',
        file: req.file
    });
});
```

---

## ৭. Response Object (res) - বিস্তারিত

Response অবজেক্ট দিয়ে ক্লায়েন্টকে ডেটা পাঠানো হয়।

### ১. res.send() - সাধারণ রেসপন্স

```javascript
app.get('/text', (req, res) => {
    res.send('Hello World');
});

app.get('/html', (req, res) => {
    res.send('<h1>Hello HTML</h1>');
});

app.get('/object', (req, res) => {
    res.send({ name: 'Ripon', age: 25 });
});
```

### ২. res.json() - JSON Response

```javascript
app.get('/api/users', (req, res) => {
    res.json({
        success: true,
        data: [
            { id: 1, name: 'Ripon' },
            { id: 2, name: 'Karim' }
        ]
    });
});
```

### ৩. res.status() - HTTP Status Code

```javascript
// Success
res.status(200).json({ message: 'OK' });
res.status(201).json({ message: 'Created' });

// Client Errors
res.status(400).json({ error: 'Bad Request' });
res.status(401).json({ error: 'Unauthorized' });
res.status(403).json({ error: 'Forbidden' });
res.status(404).json({ error: 'Not Found' });

// Server Errors
res.status(500).json({ error: 'Internal Server Error' });
```

**Common Status Codes:**
- `200` - OK
- `201` - Created
- `204` - No Content
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

### ৪. res.redirect() - Redirect

```javascript
app.get('/old-url', (req, res) => {
    res.redirect('/new-url');
});

// Different domain
app.get('/google', (req, res) => {
    res.redirect('https://www.google.com');
});

// With status code
app.get('/temp', (req, res) => {
    res.redirect(301, '/permanent'); // Permanent redirect
});
```

### ৫. res.render() - Template Render

```javascript
app.get('/profile', (req, res) => {
    res.render('profile', {
        name: 'Ripon',
        age: 25
    });
});
```

### ৬. res.sendFile() - File পাঠানো

```javascript
const path = require('path');

app.get('/download', (req, res) => {
    const filePath = path.join(__dirname, 'files', 'document.pdf');
    res.sendFile(filePath);
});
```

### ৭. res.download() - File Download

```javascript
app.get('/download-pdf', (req, res) => {
    const file = path.join(__dirname, 'files', 'report.pdf');
    res.download(file); // Browser download dialog দেখাবে
});

// Custom filename
app.get('/download-custom', (req, res) => {
    const file = path.join(__dirname, 'files', 'report.pdf');
    res.download(file, 'my-report.pdf');
});
```

### ৮. res.cookie() - Set Cookie

```javascript
app.get('/set-cookie', (req, res) => {
    res.cookie('username', 'Ripon', {
        maxAge: 900000,      // 15 minutes
        httpOnly: true,      // JavaScript থেকে access করা যাবে না
        secure: true,        // শুধু HTTPS এ
        sameSite: 'strict'   // CSRF protection
    });
    
    res.send('Cookie set');
});

// Clear cookie
app.get('/logout', (req, res) => {
    res.clearCookie('username');
    res.send('Logged out');
});
```

### ৯. res.set() / res.header() - Custom Headers

```javascript
app.get('/custom-header', (req, res) => {
    res.set('X-Custom-Header', 'MyValue');
    res.set({
        'X-Powered-By': 'Express',
        'Content-Type': 'application/json'
    });
    
    res.json({ message: 'Check response headers' });
});
```

### ১০. res.type() - Content-Type সেট করা

```javascript
app.get('/xml', (req, res) => {
    res.type('xml');
    res.send('<root>Hello XML</root>');
});

app.get('/text', (req, res) => {
    res.type('text/plain');
    res.send('Plain text');
});
```

### ১১. res.sendStatus() - শর্টকাট

```javascript
app.get('/test', (req, res) => {
    res.sendStatus(200);  // Same as: res.status(200).send('OK')
    res.sendStatus(404);  // Same as: res.status(404).send('Not Found')
    res.sendStatus(500);  // Same as: res.status(500).send('Internal Server Error')
});
```

### ১২. Method Chaining

```javascript
app.get('/api/data', (req, res) => {
    res
        .status(200)
        .set('X-Custom', 'Value')
        .cookie('sessionId', 'abc123')
        .json({
            success: true,
            data: []
        });
});
```

### ১৩. Streaming Response

বড় ফাইলের জন্য:

```javascript
const fs = require('fs');

app.get('/video', (req, res) => {
    const videoPath = path.join(__dirname, 'videos', 'movie.mp4');
    const stream = fs.createReadStream(videoPath);
    
    res.setHeader('Content-Type', 'video/mp4');
    stream.pipe(res);
});
```

---

## ৮. Complete REST API Example

সব কিছু একসাথে:

```javascript
const express = require('express');
const app = express();

// Middleware
app.use(express.json());

// Fake Database
let users = [
    { id: 1, name: 'Ripon', email: 'ripon@example.com' },
    { id: 2, name: 'Karim', email: 'karim@example.com' }
];

// GET - All users
app.get('/api/users', (req, res) => {
    res.json({
        success: true,
        count: users.length,
        data: users
    });
});

// GET - Single user
app.get('/api/users/:id', (req, res) => {
    const user = users.find(u => u.id === parseInt(req.params.id));
    
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

// POST - Create user
app.post('/api/users', (req, res) => {
    const { name, email } = req.body;
    
    // Validation
    if (!name || !email) {
        return res.status(400).json({
            success: false,
            error: 'Name and email are required'
        });
    }
    
    const newUser = {
        id: users.length + 1,
        name,
        email
    };
    
    users.push(newUser);
    
    res.status(201).json({
        success: true,
        data: newUser
    });
});

// PUT - Update user
app.put('/api/users/:id', (req, res) => {
    const user = users.find(u => u.id === parseInt(req.params.id));
    
    if (!user) {
        return res.status(404).json({
            success: false,
            error: 'User not found'
        });
    }
    
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    
    res.json({
        success: true,
        data: user
    });
});

// DELETE - Delete user
app.delete('/api/users/:id', (req, res) => {
    const index = users.findIndex(u => u.id === parseInt(req.params.id));
    
    if (index === -1) {
        return res.status(404).json({
            success: false,
            error: 'User not found'
        });
    }
    
    users.splice(index, 1);
    
    res.json({
        success: true,
        message: 'User deleted'
    });
});

// 404 Handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: 'Route not found'
    });
});

// Error Handler
app.use((err, req, res, next) => {
    res.status(500).json({
        success: false,
        error: err.message
    });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
```

এই API এর সাথে Postman/Insomnia দিয়ে টেস্ট করতে পারবেন!

---

## ৯. Advanced Topics

### A. Environment Variables

কনফিগারেশন ম্যানেজমেন্টের জন্য:

```bash
npm install dotenv
```

**.env ফাইল:**
```
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASS=password
JWT_SECRET=mysecretkey
NODE_ENV=development
```

**app.js:**
```javascript
require('dotenv').config();

const PORT = process.env.PORT || 3000;
const dbHost = process.env.DB_HOST;
const jwtSecret = process.env.JWT_SECRET;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
```

### B. Async/Await Error Handling

সহজ উপায়:

```javascript
// Wrapper function
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

// ব্যবহার
app.get('/users', asyncHandler(async (req, res) => {
    const users = await User.find(); // Database query
    res.json(users);
}));
```

### C. Input Validation (express-validator)

```bash
npm install express-validator
```

```javascript
const { body, validationResult } = require('express-validator');

app.post('/register',
    // Validation rules
    body('email').isEmail().withMessage('Invalid email'),
    body('password').isLength({ min: 6 }).withMessage('Password too short'),
    body('name').trim().notEmpty().withMessage('Name is required'),
    
    // Handler
    (req, res) => {
        const errors = validationResult(req);
        
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        
        // Validation পাস হলে এগিয়ে যান
        res.json({ message: 'User registered' });
    }
);
```

### D. CORS Configuration (বিস্তারিত)

```javascript
const cors = require('cors');

// Option 1: সব ডোমেইন allow
app.use(cors());

// Option 2: নির্দিষ্ট ডোমেইন
app.use(cors({
    origin: 'http://localhost:3000', // React app
    credentials: true, // Cookies allow করবে
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Option 3: Dynamic origin
app.use(cors({
    origin: function(origin, callback) {
        const allowedOrigins = [
            'http://localhost:3000',
            'http://localhost:5173',
            'https://myapp.com'
        ];
        
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    }
}));
```

### E. Session Management

```bash
npm install express-session
```

```javascript
const session = require('express-session');

app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24, // 1 day
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production' // HTTPS only in production
    }
}));

// Session ব্যবহার
app.post('/login', (req, res) => {
    req.session.userId = 123;
    req.session.username = 'Ripon';
    res.json({ message: 'Logged in' });
});

app.get('/profile', (req, res) => {
    if (!req.session.userId) {
        return res.status(401).json({ error: 'Not logged in' });
    }
    
    res.json({
        userId: req.session.userId,
        username: req.session.username
    });
});

app.post('/logout', (req, res) => {
    req.session.destroy();
    res.json({ message: 'Logged out' });
});
```

### F. JWT Authentication

```bash
npm install jsonwebtoken bcrypt
```

```javascript
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Register
app.post('/register', async (req, res) => {
    const { email, password } = req.body;
    
    // Password hash করা
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Database এ save করা
    // await User.create({ email, password: hashedPassword });
    
    res.json({ message: 'User registered' });
});

// Login
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    
    // Database থেকে user খুঁজুন
    // const user = await User.findOne({ email });
    
    const user = { id: 1, email: 'ripon@example.com', password: 'hashedpass' };
    
    if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Password verify করা
    const isValid = await bcrypt.compare(password, user.password);
    
    if (!isValid) {
        return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // JWT token তৈরি
    const token = jwt.sign(
        { userId: user.id, email: user.email },
        JWT_SECRET,
        { expiresIn: '7d' }
    );
    
    res.json({ token });
});

// Authentication Middleware
const authenticate = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1]; // "Bearer TOKEN"
    
    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }
    
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Invalid token' });
    }
};

// Protected route
app.get('/profile', authenticate, (req, res) => {
    res.json({
        message: 'Protected data',
        user: req.user
    });
});
```

### G. File Upload (Multer - বিস্তারিত)

```bash
npm install multer
```

```javascript
const multer = require('multer');
const path = require('path');

// Storage configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueName + path.extname(file.originalname));
    }
});

// File filter
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only JPEG, PNG, and GIF allowed.'));
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 1024 * 1024 * 5 // 5MB max
    }
});

// Single file upload
app.post('/upload/single', upload.single('avatar'), (req, res) => {
    res.json({
        message: 'File uploaded',
        file: req.file
    });
});

// Multiple files
app.post('/upload/multiple', upload.array('photos', 5), (req, res) => {
    res.json({
        message: 'Files uploaded',
        files: req.files
    });
});

// Multiple fields
app.post('/upload/fields',
    upload.fields([
        { name: 'avatar', maxCount: 1 },
        { name: 'gallery', maxCount: 5 }
    ]),
    (req, res) => {
        res.json({
            message: 'Files uploaded',
            avatar: req.files['avatar'],
            gallery: req.files['gallery']
        });
    }
);
```

---

## ১০. Best Practices & Project Structure

### ক. Recommended Project Structure

```
project/
├── src/
│   ├── config/
│   │   └── database.js         # Database configuration
│   ├── controllers/
│   │   ├── userController.js   # User logic
│   │   └── postController.js   # Post logic
│   ├── middleware/
│   │   ├── auth.js             # Authentication middleware
│   │   └── errorHandler.js     # Error handling
│   ├── models/
│   │   ├── User.js             # User model
│   │   └── Post.js             # Post model
│   ├── routes/
│   │   ├── userRoutes.js       # User routes
│   │   └── postRoutes.js       # Post routes
│   ├── utils/
│   │   ├── asyncHandler.js     # Helper functions
│   │   └── validators.js       # Validation functions
│   └── app.js                  # Express app setup
├── public/                     # Static files
├── uploads/                    # Uploaded files
├── .env                        # Environment variables
├── .gitignore
├── package.json
└── server.js                   # Entry point
```

### খ. MVC Pattern Implementation

**models/User.js:**
```javascript
// এটা শুধু স্ট্রাকচার, real database থাকলে Mongoose/Sequelize ব্যবহার করবেন
class User {
    static async findAll() {
        // Database query
        return [];
    }
    
    static async findById(id) {
        // Database query
        return {};
    }
    
    static async create(data) {
        // Database insert
        return {};
    }
}

module.exports = User;
```

**controllers/userController.js:**
```javascript
const User = require('../models/User');

exports.getAllUsers = async (req, res, next) => {
    try {
        const users = await User.findAll();
        res.json({
            success: true,
            data: users
        });
    } catch (error) {
        next(error);
    }
};

exports.getUserById = async (req, res, next) => {
    try {
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
    } catch (error) {
        next(error);
    }
};

exports.createUser = async (req, res, next) => {
    try {
        const user = await User.create(req.body);
        res.status(201).json({
            success: true,
            data: user
        });
    } catch (error) {
        next(error);
    }
};
```

**routes/userRoutes.js:**
```javascript
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticate } = require('../middleware/auth');

router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUserById);
router.post('/', authenticate, userController.createUser);

module.exports = router;
```

**app.js:**
```javascript
const express = require('express');
const userRoutes = require('./routes/userRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(express.json());
app.use('/api/users', userRoutes);
app.use(errorHandler);

module.exports = app;
```

**server.js:**
```javascript
require('dotenv').config();
const app = require('./src/app');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
```

### গ. Error Handling Pattern

**middleware/errorHandler.js:**
```javascript
class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor);
    }
}

const errorHandler = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || 'Internal Server Error';
    
    if (process.env.NODE_ENV === 'development') {
        res.status(err.statusCode).json({
            success: false,
            error: err.message,
            stack: err.stack,
            details: err
        });
    } else {
        // Production: কম তথ্য দেখান
        res.status(err.statusCode).json({
            success: false,
            error: err.message
        });
    }
};

module.exports = { AppError, errorHandler };
```

### ঘ. Key Best Practices

1. **Use Environment Variables**: সংবেদনশীল তথ্য `.env` ফাইলে রাখুন
2. **Proper Error Handling**: সব async function এ try-catch ব্যবহার করুন
3. **Input Validation**: সব user input ভ্যালিডেট করুন
4. **Security**: helmet, cors, rate-limiting ব্যবহার করুন
5. **Logging**: morgan বা winston দিয়ে সব request লগ করুন
6. **API Versioning**: `/api/v1/users` এভাবে version করুন
7. **Consistent Response Format**: সব API একই ফরম্যাট follow করুক
8. **Use HTTP Status Codes Properly**: সঠিক status code ব্যবহার করুন
9. **Modular Code**: কোড ছোট ছোট মডিউলে ভাগ করুন
10. **Documentation**: API ডকুমেন্ট করুন (Swagger/Postman)

---

## ১১. Performance Optimization

### ক. Compression

```javascript
const compression = require('compression');
app.use(compression()); // Response size 70-90% কমে যায়
```

### খ. Caching

```javascript
const cache = new Map();

app.get('/api/data', (req, res) => {
    const cacheKey = 'data';
    
    // Cache check
    if (cache.has(cacheKey)) {
        return res.json(cache.get(cacheKey));
    }
    
    // Database query
    const data = fetchFromDatabase();
    
    // Cache store (5 minutes)
    cache.set(cacheKey, data);
    setTimeout(() => cache.delete(cacheKey), 5 * 60 * 1000);
    
    res.json(data);
});
```

### গ. Database Query Optimization

```javascript
// Bad: N+1 query problem
const users = await User.findAll();
for (let user of users) {
    user.posts = await Post.find({ userId: user.id });
}

// Good: Single query with JOIN
const users = await User.findAll({ include: [Post] });
```

### ঘ. Clustering (Multiple Cores ব্যবহার)

```javascript
const cluster = require('cluster');
const os = require('os');

if (cluster.isMaster) {
    const numCPUs = os.cpus().length;
    
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }
    
    cluster.on('exit', (worker) => {
        console.log(`Worker ${worker.process.pid} died`);
        cluster.fork(); // নতুন worker তৈরি করুন
    });
} else {
    const app = require('./app');
    app.listen(3000);
}
```

---

## ১২. Testing

```bash
npm install --save-dev jest supertest
```

**user.test.js:**
```javascript
const request = require('supertest');
const app = require('./app');

describe('User API', () => {
    test('GET /api/users - should return all users', async () => {
        const response = await request(app)
            .get('/api/users')
            .expect('Content-Type', /json/)
            .expect(200);
        
        expect(response.body.success).toBe(true);
        expect(Array.isArray(response.body.data)).toBe(true);
    });
    
    test('POST /api/users - should create user', async () => {
        const newUser = {
            name: 'Test User',
            email: 'test@example.com'
        };
        
        const response = await request(app)
            .post('/api/users')
            .send(newUser)
            .expect(201);
        
        expect(response.body.success).toBe(true);
        expect(response.body.data.name).toBe('Test User');
    });
});
```

---

## ১৩. Deployment Checklist

### Production এ যাওয়ার আগে:

- [ ] Environment variables সেট করা হয়েছে
- [ ] Error handling সব জায়গায় আছে
- [ ] Security middleware (helmet, cors) যোগ করা হয়েছে
- [ ] Rate limiting সেটআপ করা হয়েছে
- [ ] Logging সেটআপ (winston/morgan)
- [ ] Database connection pooling
- [ ] HTTPS enable করা
- [ ] Process manager (PM2) ব্যবহার করা
- [ ] Health check endpoint তৈরি করা
- [ ] API documentation তৈরি করা
- [ ] Load testing করা হয়েছে

### Health Check Endpoint

```javascript
app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        memory: process.memoryUsage()
    });
});
```

---

## সারাংশ

Express.js দিয়ে আপনি এখন:
- ✅ RESTful API তৈরি করতে পারবেন
- ✅ Middleware ব্যবহার করতে পারবেন
- ✅ Authentication/Authorization implement করতে পারবেন
- ✅ File upload handle করতে পারবেন
- ✅ Error handling করতে পারবেন
- ✅ Production-ready application deploy করতে পারবেন

**Next Steps:**
1. Database integration (MongoDB with Mongoose বা PostgreSQL with Sequelize)
2. Real-time features (Socket.io)
3. Microservices architecture
4. GraphQL with Express

Happy Coding! 🚀
