# Express.js Framework

Node.js দিয়ে র "Raw" কোড লেখা অনেক সময় কষ্টসাধ্য এবং রিপিটিটিভ হতে পারে। এই সমস্যা সমাধানের জন্যই **Express.js**। এটি Node.js এর জন্য সবচেয়ে জনপ্রিয় এবং মিনিমালিস্ট ওয়েব ফ্রেমওয়ার্ক।

## ১. Express.js কি এবং কেন?

Express.js হলো Node.js এর ওপর তৈরি একটি লেয়ার যা সার্ভার তৈরি, রাউটিং এবং মিডলওয়্যার ম্যানেজমেন্টকে অনেক সহজ করে দেয়।
- **Easy Routing:** কমপ্লেক্স URL রাউটিং খুব সহজে করা যায়।
- **Middleware Support:** রিকোয়েস্ট এবং রেসপন্স এর মাঝখানে লজিক বসানো যায়।
- **Database Integration:** যেকোনো ডাটাবেস (MongoDB, MySQL) এর সাথে সহজে কানেক্ট করা যায়।

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

## ৩. Routing Fundamentals

এক্সপ্রেসে রাউটিং খুব স্ট্রাকচার্ড।

### HTTP Methods (GET, POST, PUT, DELETE)

```javascript
// GET Request (ডেটা আনা)
app.get('/users', (req, res) => {
    res.send('Get all users');
});

// POST Request (ডেটা পাঠানো)
app.post('/users', (req, res) => {
    res.send('Create a new user');
});

// PUT Request (ডেটা আপডেট করা)
app.put('/users/:id', (req, res) => {
    res.send(`Update user with ID ${req.params.id}`);
});

// DELETE Request (ডেটা ডিলিট করা)
app.delete('/users/:id', (req, res) => {
    res.send(`Delete user with ID ${req.params.id}`);
});
```

### Route Parameters & Query Strings

- **Params (`:id`):** URL এর নির্দিষ্ট অংশ ডায়নামিক হলে।
- **Query (`?sort=asc`):** ফিল্টারিং বা সার্চিং এর জন্য।

```javascript
// URL: /users/5?sort=asc
app.get('/users/:id', (req, res) => {
    console.log(req.params.id); // "5"
    console.log(req.query.sort); // "asc"
    res.send(`User ID: ${req.params.id}`);
});
```

---

## ৪. Middleware (Express এর জাদুকরী শক্তি)

মিডলওয়্যার হলো এমন ফাংশন যা রিকোয়েস্ট (`req`) এবং রেসপন্স (`res`) এর মাঝখানে কাজ করে। এটি রিকোয়েস্ট মডিফাই করতে পারে বা ভ্যালিডেশন চেক করতে পারে।

### A. Custom Application-Level Middleware
এমন একটি মিডলওয়্যার যা সব রাউটের আগে রান হবে (যেমন লগার)।

```javascript
// Logger Middleware
app.use((req, res, next) => {
    console.log(`${req.method} Request to ${req.url}`);
    next(); // এটি না দিলে রিকোয়েস্ট এখানেই আটকে থাকবে!
});
```

### B. Built-in Middleware
Express এর নিজস্ব কিছু মিডলওয়্যার আছে।
- `express.json()`: JSON ডেটা রিসিভ করার জন্য (POST request এ বডি পড়ার জন্য)।
- `express.static()`: স্ট্যাটিক ফাইল (ইমেজ, CSS) সার্ভ করার জন্য।

```javascript
app.use(express.json()); // Body parser
app.use(express.static('public')); // 'public' ফোল্ডারের ফাইল ব্রাউজারে দেখাবে
```

### C. Third-party Middleware
অন্যদের তৈরি প্যাকেজ।
- **morgan:** লগিং এর জন্য।
- **cors:** ক্রস-অরিজিন রিকোয়েস্ট হ্যান্ডেল করার জন্য।

```bash
npm install morgan cors
```

```javascript
const morgan = require('morgan');
app.use(morgan('dev'));
```

### D. Error Handling Middleware
এটি সবার শেষে ব্যবহার করতে হয়। ৪টি আর্গুমেন্ট থাকে (`err, req, res, next`)।

```javascript
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});
```

---

## ৫. Template Engines (EJS, Pug)

সার্ভার সাইড রেন্ডারিং (SSR) এর জন্য টেমপ্লেট ইঞ্জিন ব্যবহার করা হয়। জনপ্রিয় হলো **EJS**।

```bash
npm install ejs
```

সেটআপ:
```javascript
app.set('view engine', 'ejs');

app.get('/profile', (req, res) => {
    res.render('profile', { name: 'Ripon', age: 25 });
});
```
(`views/profile.ejs` ফাইলে HTML এর মত কোড লিখে ডায়নামিক ডেটা দেখানো যায়)।

---

## ৬. Request & Response Objects

- **Request (`req`):** ক্লায়েন্ট থেকে আসা সব তথ্য থাকে (`req.body`, `req.query`, `req.params`, `req.headers`)।
- **Response (`res`):** সার্ভার থেকে যা পাঠানো হয় (`res.send()`, `res.json()`, `res.status()`, `res.redirect()`)।

```javascript
app.get('/api/check', (req, res) => {
    res.status(200).json({ 
        success: true, 
        message: 'API is working!' 
    });
});
```
