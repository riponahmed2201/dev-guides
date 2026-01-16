# Authentication & Authorization - সম্পূর্ণ গাইড

Authentication এবং Authorization হলো যেকোনো secure application এর **foundation**। এই দুটি ছাড়া আপনার app vulnerable এবং insecure।

## Authentication vs Authorization - বিস্তারিত

### Authentication (কে আপনি?)

User এর identity verify করা। "আপনি কি সত্যিই আপনি?"

**Real-world analogy:**
- Airport এ passport check করা
- ATM এ PIN code দেওয়া
- Office এ ID card দেখানো

**Digital world:**
- Username/Password
- Email verification
- Phone OTP
- Biometric (fingerprint, face ID)
- Security keys (YubiKey)

### Authorization (আপনি কি করতে পারবেন?)

User এর permissions check করা। "আপনার access কতটুকু?"

**Real-world analogy:**
- Manager cabin এ employee ঢুকতে পারবে না
- Student library থেকে শুধু borrow করতে পারবে, delete করতে পারবে না

**Digital world:**
- Admin can delete users
- Editor can edit posts
- Viewer can only read
- Guest has no access

### পার্থক্য (তুলনা)

```
┌─────────────────┬──────────────────┬────────────────────┐
│   Aspect        │  Authentication  │   Authorization    │
├─────────────────┼──────────────────┼────────────────────┤
│  Question       │  Who are you?    │  What can you do?  │
│  Process        │  Login           │  Permission check  │
│  Happens        │  Once (login)    │  Every request     │
│  Example        │  Username/Pass   │  Admin only        │
│  HTTP Status    │  401 Unauthorized│  403 Forbidden     │
└─────────────────┴──────────────────┴────────────────────┘
```

**Example Flow:**

```javascript
// 1. Authentication (Login)
User tries to login with email & password
→ Server verifies credentials
→ If valid: Generate token
→ User is now "authenticated"

// 2. Authorization (Access check)
Authenticated user tries to delete a post
→ Server checks: Is user the post owner OR admin?
→ If yes: Allow (200 OK)
→ If no: Deny (403 Forbidden)
```

**Important:**
- ✅ Authentication MUST happen before Authorization
- ✅ Authenticated ≠ Authorized (logged in ≠ has permission)
- ❌ Authorization without Authentication = Security hole!

---

## Types of Authentication

### 1. Password-based Authentication (Most Common)

```
User → Email + Password → Server → Verify → Token/Session
```

**Pros:**
- Simple to implement
- Users familiar with it
- No external dependencies

**Cons:**
- Weak passwords common
- Phishing attacks
- Password reuse

### 2. Multi-Factor Authentication (2FA/MFA)

```
User → Password + (SMS/Email/App code) → Server → Verify
```

**Factors:**
- **Something you know** (password)
- **Something you have** (phone, security key)
- **Something you are** (fingerprint, face)

**Implementation:** We'll cover later

### 3. Biometric Authentication

- Fingerprint
- Face ID
- Iris scan
- Voice recognition

**Use case:** Mobile apps primarily

### 4. Certificate-based Authentication

- Client SSL certificates
- Hardware tokens (YubiKey)
- Smart cards

**Use case:** Enterprise applications

### 5. Social Login (OAuth 2.0)

```
User → Google/Facebook → Consent → Token → Your App
```

**Popular providers:**
- Google
- Facebook
- GitHub
- Twitter
- LinkedIn

**Pros:**
- No password management
- Faster signup
- Email already verified

**Cons:**
- Dependency on third-party
- Privacy concerns
- Platform-specific issues

---

---

## Session-based Authentication - Complete Guide

Traditional authentication method। Server-side এ session store করে।

### How It Works

```
1. User logs in with credentials
2. Server creates session (stores in memory/database)
3. Server sends session ID via cookie
4. Client stores cookie (automatic by browser)
5. Every request includes cookie
6. Server validates session ID
```

### Implementation

```bash
npm install express-session
```

```javascript
const express = require('express');
const session = require('express-session');
const bcrypt = require('bcrypt');

const app = express();
app.use(express.json());

// Session middleware
app.use(session({
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,      // Prevent XSS
        secure: process.env.NODE_ENV === 'production', // HTTPS only
        maxAge: 1000 * 60 * 60 * 24 // 24 hours
    }
}));

// Fake user database
const users = [
    {
        id: 1,
        email: 'admin@example.com',
        password: '$2b$10$...' // bcrypt hash
    }
];

// Register
app.post('/register', async (req, res) => {
    const { email, password } = req.body;
    
    // Check if user exists
    if (users.find(u => u.email === email)) {
        return res.status(400).json({ error: 'User already exists' });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Save user
    const newUser = {
        id: users.length + 1,
        email,
        password: hashedPassword
    };
    users.push(newUser);
    
    res.status(201).json({ message: 'User registered successfully' });
});

// Login
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    
    // Find user
    const user = users.find(u => u.email === email);
    if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Verify password
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
        return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Create session
    req.session.userId = user.id;
    req.session.email = user.email;
    
    res.json({ message: 'Login successful' });
});

// Protected route
app.get('/profile', (req, res) => {
    // Check if session exists
    if (!req.session.userId) {
        return res.status(401).json({ error: 'Not authenticated' });
    }
    
    // Get user from session
    const user = users.find(u => u.id === req.session.userId);
    
    res.json({
        id: user.id,
        email: user.email
    });
});

// Logout
app.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ error: 'Logout failed' });
        }
        res.clearCookie('connect.sid'); // Session cookie name
        res.json({ message: 'Logout successful' });
    });
});

app.listen(3000);
```

### Session with Redis (Production)

```bash
npm install connect-redis redis
```

```javascript
const Redis = require('redis');
const RedisStore = require('connect-redis')(session);

const redisClient = Redis.createClient({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT
});

app.use(session({
    store: new RedisStore({ client: redisClient }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: true,
        maxAge: 1000 * 60 * 60 * 24
    }
}));
```

### Pros & Cons

**✅ Pros:**
- Simple to implement
- Server has full control
- Easy to revoke (delete session)
- Works without JavaScript

**❌ Cons:**
- **Not scalable** - Session stored on server
- **Memory intensive** - Thousands of users = thousands of sessions
- **Doesn't work with mobile apps** well
- **CORS issues** with cookies
- **Horizontal scaling difficult** (need shared session store)

---

## Token-based Authentication (JWT) - Complete Guide

Modern authentication method। Stateless এবং scalable।

### What is JWT?

JWT (JSON Web Token) হলো একটি **self-contained token** যাতে সব information থাকে।

**Structure:** `Header.Payload.Signature`

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoidGVzdEB0ZXN0LmNvbSJ9.4Adcj_KqNL32VxpqL0ZvNHaWyZIeqgJnFvMzJqV10Q
│─────────── Header ──────────│──────────── Payload ────────────│───────── Signature ──────────│
```

### JWT Parts

#### 1. Header

```json
{
  "alg": "HS256",     // Algorithm (HMAC SHA256)
  "typ": "JWT"        // Token type
}
```

#### 2. Payload

```json
{
  "userId": 1,
  "email": "user@example.com",
  "role": "admin",
  "iat": 1642771200,  // Issued at
  "exp": 1642857600   // Expiration
}
```

**⚠️ Important:** 
- Payload is **NOT encrypted**, only **encoded** (Base64)
- **Never put secrets** (password, credit card) in payload
- Anyone can decode and read payload

#### 3. Signature

```
HMACSHA256(
  base64UrlEncode(header) + "." +
  base64UrlEncode(payload),
  secret
)
```

Signature ensures:
- Token hasn't been tampered with
- Token was created by your server (using your secret)

### Implementation

```bash
npm install jsonwebtoken bcrypt
```

```javascript
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const app = express();
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRES_IN = '7d';

// Fake database
const users = [];

// Register
app.post('/register', async (req, res) => {
    try {
        const { email, password, name } = req.body;
        
        // Validation
        if (!email || !password || !name) {
            return res.status(400).json({
                success: false,
                error: 'All fields are required'
            });
        }
        
        // Check if user exists
        if (users.find(u => u.email === email)) {
            return res.status(409).json({
                success: false,
                error: 'Email already registered'
            });
        }
        
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12);
        
        // Create user
        const newUser = {
            id: users.length + 1,
            email,
            password: hashedPassword,
            name,
            role: 'user',
            createdAt: new Date()
        };
        
        users.push(newUser);
        
        // Generate token
        const token = jwt.sign(
            {
                userId: newUser.id,
                email: newUser.email,
                role: newUser.role
            },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES_IN }
        );
        
        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            token,
            user: {
                id: newUser.id,
                email: newUser.email,
                name: newUser.name,
                role: newUser.role
            }
        });
        
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Registration failed'
        });
    }
});

// Login
app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Validation
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                error: 'Email and password are required'
            });
        }
        
        // Find user
        const user = users.find(u => u.email === email);
        if (!user) {
            return res.status(401).json({
                success: false,
                error: 'Invalid credentials'
            });
        }
        
        // Verify password
        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
            return res.status(401).json({
                success: false,
                error: 'Invalid credentials'
            });
        }
        
        // Generate token
        const token = jwt.sign(
            {
                userId: user.id,
                email: user.email,
                role: user.role
            },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES_IN }
        );
        
        res.json({
            success: true,
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role
            }
        });
        
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Login failed'
        });
    }
});

// Authentication middleware
const authenticate = (req, res, next) => {
    try {
        // Get token from header
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                error: 'No token provided'
            });
        }
        
        const token = authHeader.split(' ')[1];
        
        // Verify token
        const decoded = jwt.verify(token, JWT_SECRET);
        
        // Attach user to request
        req.user = decoded;
        
        next();
        
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                error: 'Token expired'
            });
        }
        
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                error: 'Invalid token'
            });
        }
        
        res.status(500).json({
            success: false,
            error: 'Authentication failed'
        });
    }
};

// Protected routes
app.get('/profile', authenticate, (req, res) => {
    const user = users.find(u => u.id === req.user.userId);
    
    if (!user) {
        return res.status(404).json({
            success: false,
            error: 'User not found'
        });
    }
    
    res.json({
        success: true,
        user: {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            createdAt: user.createdAt
        }
    });
});

app.listen(3000);
```

### Client-side Usage

```javascript
// Login
const login = async (email, password) => {
    const response = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
    });
    
    const data = await response.json();
    
    if (data.success) {
        // Store token (localStorage, sessionStorage, or memory)
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
    }
    
    return data;
};

// Make authenticated request
const getProfile = async () => {
    const token = localStorage.getItem('token');
    
    const response = await fetch('http://localhost:3000/profile', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    
    return await response.json();
};

// Logout
const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // Redirect to login page
};
```

### JWT Best Practices

✅ **Use strong secret** (minimum 256 bits)  
✅ **Set reasonable expiration** (15min - 1day)  
✅ **Use HTTPS only**  
✅ **Never store sensitive data in payload**  
✅ **Validate token on every request**  
✅ **Implement refresh tokens** (we'll cover next)  
✅ **Use RS256 for production** (asymmetric)  
✅ **Store tokens securely** (httpOnly cookies > localStorage)  
❌ **Don't use weak secrets** ('secret', '12345')  
❌ **Don't set long expiration** (1 year = bad!)  
❌ **Don't trust client-side data** (always verify token)

### Session vs JWT Comparison

```
┌──────────────────┬─────────────────┬──────────────────┐
│   Feature        │    Session      │      JWT         │
├──────────────────┼─────────────────┼──────────────────┤
│  Storage         │  Server-side    │  Client-side     │
│  Scalability     │  Difficult      │  Easy            │
│  State           │  Stateful       │  Stateless       │
│  Mobile Support  │  Poor           │  Excellent       │
│  Revocation      │  Easy (delete)  │  Difficult       │
│  Size            │  Small (cookie) │  Large (token)   │
│  CORS            │  Issues         │  No issues       │
│  Security        │  Server control │  Client storage  │
└──────────────────┴─────────────────┴──────────────────┘
```

**When to use Session:**
- Traditional web apps
- Need instant revocation
- Small scale applications

**When to use JWT:**
- RESTful APIs
- Mobile applications
- Microservices
- High scalability needed

---

---

## Refresh Tokens - Advanced JWT Pattern

Access tokens are short-lived (15min), refresh tokens are long-lived (7-30 days)।

### Why Refresh Tokens?

**Problem with Long-lived Access Tokens:**
```javascript
// ❌ Bad: 30 days access token
const token = jwt.sign(payload, secret, { expiresIn: '30d' });

// If token stolen:
// - Attacker has 30 days access
// - Can't revoke until expiration
// - Security risk! 🔥
```

**Solution: Short access + Long refresh:**
```javascript
// ✅ Good
Access Token: 15 minutes
Refresh Token: 7 days

// If access token stolen:
// - Only 15 minutes window
// - Refresh token stored securely
// - Can blacklist refresh tokens
```

### Implementation

```javascript
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

// Store refresh tokens (in production: use Redis/database)
const refreshTokens = new Set();

// Generate tokens
function generateTokens(user) {
    // Access token (short-lived)
    const accessToken = jwt.sign(
        {
            userId: user.id,
            email: user.email,
            role: user.role
        },
        ACCESS_TOKEN_SECRET,
        { expiresIn: '15m' }
    );
    
    // Refresh token (long-lived)
    const refreshToken = jwt.sign(
        {
            userId: user.id,
            tokenId: crypto.randomBytes(16).toString('hex') // Unique ID
        },
        REFRESH_TOKEN_SECRET,
        { expiresIn: '7d' }
    );
    
    // Store refresh token
    refreshTokens.add(refreshToken);
    
    return { accessToken, refreshToken };
}

// Login endpoint
app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Verify credentials
        const user = users.find(u => u.email === email);
        if (!user || !await bcrypt.compare(password, user.password)) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        
        // Generate tokens
        const { accessToken, refreshToken } = generateTokens(user);
        
        // Send refresh token as httpOnly cookie (most secure)
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });
        
        res.json({
            success: true,
            accessToken,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role
            }
        });
        
    } catch (error) {
        res.status(500).json({ error: 'Login failed' });
    }
});

// Refresh access token
app.post('/refresh-token', (req, res) => {
    try {
        // Get refresh token from cookie
        const refreshToken = req.cookies.refreshToken;
        
        if (!refreshToken) {
            return res.status(401).json({ error: 'Refresh token required' });
        }
        
        // Check if token exists in store
        if (!refreshTokens.has(refreshToken)) {
            return res.status(403).json({ error: 'Invalid refresh token' });
        }
        
        // Verify refresh token
        const decoded = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);
        
        // Find user
        const user = users.find(u => u.id === decoded.userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        // Generate new access token
        const accessToken = jwt.sign(
            {
                userId: user.id,
                email: user.email,
                role: user.role
            },
            ACCESS_TOKEN_SECRET,
            { expiresIn: '15m' }
        );
        
        res.json({
            success: true,
            accessToken
        });
        
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'Refresh token expired' });
        }
        res.status(403).json({ error: 'Invalid refresh token' });
    }
});

// Logout
app.post('/logout', (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    
    if (refreshToken) {
        // Remove from store (revoke)
        refreshTokens.delete(refreshToken);
    }
    
    // Clear cookie
    res.clearCookie('refreshToken');
    
    res.json({
        success: true,
        message: 'Logout successful'
    });
});

// Logout from all devices
app.post('/logout-all', authenticate, async (req, res) => {
    // Remove all refresh tokens for this user
    const user = users.find(u => u.id === req.user.userId);
    
    // In production: query database for user's refresh tokens and delete
    // For now, we'll just clear the current token
    const refreshToken = req.cookies.refreshToken;
    refreshTokens.delete(refreshToken);
    res.clearCookie('refreshToken');
    
    res.json({
        success: true,
        message: 'Logged out from all devices'
    });
});
```

### Client-side Token Refresh

```javascript
class ApiClient {
    constructor() {
        this.accessToken = null;
    }
    
    async request(url, options = {}) {
        // Add access token to request
        options.headers = {
            ...options.headers,
            'Authorization': `Bearer ${this.accessToken}`
        };
        
        let response = await fetch(url, options);
        
        // If token expired, refresh and retry
        if (response.status === 401) {
            const refreshed = await this.refreshToken();
            
            if (refreshed) {
                // Retry original request with new token
                options.headers['Authorization'] = `Bearer ${this.accessToken}`;
                response = await fetch(url, options);
            } else {
                // Refresh failed, redirect to login
                window.location.href = '/login';
            }
        }
        
        return response;
    }
    
    async refreshToken() {
        try {
            const response = await fetch('/refresh-token', {
                method: 'POST',
                credentials: 'include' // Include cookies
            });
            
            if (response.ok) {
                const data = await response.json();
                this.accessToken = data.accessToken;
                return true;
            }
            
            return false;
            
        } catch (error) {
            return false;
        }
    }
    
    async login(email, password) {
        const response = await fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include', // Include cookies
            body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        
        if (data.success) {
            this.accessToken = data.accessToken;
        }
        
        return data;
    }
    
    async logout() {
        await fetch('/logout', {
            method: 'POST',
            credentials: 'include'
        });
        
        this.accessToken = null;
    }
}

// Usage
const api = new ApiClient();

// Login
await api.login('user@example.com', 'password');

// Make requests (automatically handles token refresh)
const profile = await api.request('/profile');
const data = await profile.json();
```

### Refresh Token with Database

```javascript
// MongoDB schema for refresh tokens
const refreshTokenSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    token: {
        type: String,
        required: true,
        unique: true
    },
    tokenId: {
        type: String,
        required: true
    },
    deviceInfo: {
        userAgent: String,
        ip: String
    },
    expiresAt: {
        type: Date,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const RefreshToken = mongoose.model('RefreshToken', refreshTokenSchema);

// Generate refresh token with database storage
async function generateRefreshToken(user, req) {
    const tokenId = crypto.randomBytes(16).toString('hex');
    
    const refreshToken = jwt.sign(
        { userId: user._id, tokenId },
        REFRESH_TOKEN_SECRET,
        { expiresIn: '7d' }
    );
    
    // Store in database
    await RefreshToken.create({
        userId: user._id,
        token: refreshToken,
        tokenId,
        deviceInfo: {
            userAgent: req.headers['user-agent'],
            ip: req.ip
        },
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    });
    
    return refreshToken;
}

// Verify refresh token from database
async function verifyRefreshToken(token) {
    try {
        const decoded = jwt.verify(token, REFRESH_TOKEN_SECRET);
        
        // Check if token exists in database
        const storedToken = await RefreshToken.findOne({
            token,
            tokenId: decoded.tokenId,
            userId: decoded.userId
        });
        
        if (!storedToken) {
            throw new Error('Token not found');
        }
        
        // Check expiration
        if (storedToken.expiresAt < new Date()) {
            await storedToken.remove();
            throw new Error('Token expired');
        }
        
        return decoded;
        
    } catch (error) {
        throw error;
    }
}

// Revoke refresh token
async function revokeRefreshToken(token) {
    await RefreshToken.deleteOne({ token });
}

// Revoke all user's refresh tokens (logout from all devices)
async function revokeAllUserTokens(userId) {
    await RefreshToken.deleteMany({ userId });
}

// Cleanup expired tokens (run as cron job)
async function cleanupExpiredTokens() {
    await RefreshToken.deleteMany({
        expiresAt: { $lt: new Date() }
    });
}

// Run cleanup daily
setInterval(cleanupExpiredTokens, 24 * 60 * 60 * 1000);
```

### Refresh Token Rotation

Extra security: Issue new refresh token on each refresh।

```javascript
app.post('/refresh-token', async (req, res) => {
    try {
        const oldRefreshToken = req.cookies.refreshToken;
        
        // Verify old token
        const decoded = await verifyRefreshToken(oldRefreshToken);
        
        // Find user
        const user = await User.findById(decoded.userId);
        
        // Generate new tokens
        const accessToken = generateAccessToken(user);
        const newRefreshToken = await generateRefreshToken(user, req);
        
        // Revoke old refresh token
        await revokeRefreshToken(oldRefreshToken);
        
        // Send new refresh token as cookie
        res.cookie('refreshToken', newRefreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });
        
        res.json({
            success: true,
            accessToken
        });
        
    } catch (error) {
        res.status(401).json({ error: 'Invalid refresh token' });
    }
});
```

---

---

## Password Hashing - Complete Guide

**Golden Rule:** NEVER store passwords in plain text!

### Why Hashing?

```javascript
// ❌ NEVER do this!
{
    email: 'user@example.com',
    password: 'myPassword123'  // Plain text! 💀
}

// If database breached:
// - All passwords exposed
// - Users who reuse passwords on other sites = compromised everywhere
// - Your company = lawsuit + reputation damage
```

### Hashing vs Encryption

```
Encryption (Two-way):
Password → Encrypt → Cipher → Decrypt → Password
(Reversible - can get original password back)

Hashing (One-way):
Password → Hash → Hash value (irreversible)
(Can't get original password back)

For passwords: Use HASHING, not encryption!
```

### bcrypt - The Industry Standard

```bash
npm install bcrypt
# or
npm install bcryptjs  # Pure JavaScript (slower but no compilation)
```

#### Why bcrypt?

1. **Slow by design** - Prevents brute force
2. **Salted** - Automatic salt generation
3. **Adaptive** - Can increase cost factor as hardware improves
4. **Industry standard** - Battle-tested

#### Basic Usage

```javascript
const bcrypt = require('bcrypt');

// Hash password
async function hashPassword(password) {
    const saltRounds = 12;  // Cost factor (2^12 iterations)
    const hash = await bcrypt.hash(password, saltRounds);
    return hash;
}

// Verify password
async function verifyPassword(password, hash) {
    const isMatch = await bcrypt.compare(password, hash);
    return isMatch;
}

// Usage
const hash = await hashPassword('myPassword123');
// $2b$12$KIXxLVXNK9F2VxHq8N5J1.ZJ8YQoN5V9Z4xN7K8N5V9Z4xN7K8N5V

const isValid = await verifyPassword('myPassword123', hash);
// true

const isValid2 = await verifyPassword('wrongPassword', hash);
// false
```

#### Understanding Salt Rounds

```javascript
Salt Rounds | Time      | Iterations | Recommended For
-----------+-----------+------------+------------------
    10     |  ~65ms    |    1,024   | Fast servers
    12     |  ~250ms   |    4,096   | ✅ Recommended
    14     |  ~1000ms  |   16,384   | High security
    16     |  ~4000ms  |   65,536   | Maximum security

// Higher = More secure but slower
// Sweet spot: 12 (secure enough, reasonable speed)
```

#### Complete Registration Flow

```javascript
const express = require('express');
const bcrypt = require('bcrypt');
const validator = require('validator');

app.post('/register', async (req, res) => {
    try {
        const { email, password, name } = req.body;
        
        // 1. Validation
        if (!email || !password || !name) {
            return res.status(400).json({
                success: false,
                error: 'All fields are required'
            });
        }
        
        // 2. Email validation
        if (!validator.isEmail(email)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid email address'
            });
        }
        
        // 3. Password strength validation
        if (password.length < 8) {
            return res.status(400).json({
                success: false,
                error: 'Password must be at least 8 characters'
            });
        }
        
        if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
            return res.status(400).json({
                success: false,
                error: 'Password must contain uppercase, lowercase, and number'
            });
        }
        
        // 4. Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({
                success: false,
                error: 'Email already registered'
            });
        }
        
        // 5. Hash password
        const hashedPassword = await bcrypt.hash(password, 12);
        
        // 6. Create user
        const user = await User.create({
            email,
            password: hashedPassword,  // Store hash, not plain password
            name
        });
        
        // 7. Generate token
        const token = generateToken(user);
        
        res.status(201).json({
            success: true,
            message: 'Registration successful',
            token,
            user: {
                id: user._id,
                email: user.email,
                name: user.name
            }
        });
        
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
            success: false,
            error: 'Registration failed'
        });
    }
});
```

#### Complete Login Flow

```javascript
app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // 1. Validation
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                error: 'Email and password are required'
            });
        }
        
        // 2. Find user (include password field)
        const user = await User.findOne({ email }).select('+password');
        
        // 3. Check if user exists
        if (!user) {
            // ⚠️ Don't reveal if email exists or not!
            return res.status(401).json({
                success: false,
                error: 'Invalid credentials'
            });
        }
        
        // 4. Check if account is active
        if (!user.isActive) {
            return res.status(403).json({
                success: false,
                error: 'Account has been deactivated'
            });
        }
        
        // 5. Verify password
        const isValid = await bcrypt.compare(password, user.password);
        
        if (!isValid) {
            // Log failed attempt (for brute force detection)
            await logFailedLogin(user._id, req.ip);
            
            return res.status(401).json({
                success: false,
                error: 'Invalid credentials'
            });
        }
        
        // 6. Check if account is locked (too many failed attempts)
        if (user.isLocked) {
            return res.status(423).json({
                success: false,
                error: 'Account locked due to too many failed login attempts'
            });
        }
        
        // 7. Update last login
        user.lastLogin = new Date();
        user.failedLoginAttempts = 0;  // Reset failed attempts
        await user.save();
        
        // 8. Generate tokens
        const { accessToken, refreshToken } = generateTokens(user);
        
        // 9. Set refresh token cookie
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });
        
        // 10. Send response
        res.json({
            success: true,
            message: 'Login successful',
            accessToken,
            user: {
                id: user._id,
                email: user.email,
                name: user.name,
                role: user.role
            }
        });
        
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            error: 'Login failed'
        });
    }
});
```

#### Password Change

```javascript
app.post('/change-password', authenticate, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        
        // 1. Validation
        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                error: 'Current and new password are required'
            });
        }
        
        // 2. Get user with password
        const user = await User.findById(req.user.userId).select('+password');
        
        // 3. Verify current password
        const isValid = await bcrypt.compare(currentPassword, user.password);
        
        if (!isValid) {
            return res.status(401).json({
                success: false,
                error: 'Current password is incorrect'
            });
        }
        
        // 4. Validate new password
        if (newPassword.length < 8) {
            return res.status(400).json({
                success: false,
                error: 'New password must be at least 8 characters'
            });
        }
        
        // 5. Check if new password is same as current
        const isSame = await bcrypt.compare(newPassword, user.password);
        if (isSame) {
            return res.status(400).json({
                success: false,
                error: 'New password must be different from current password'
            });
        }
        
        // 6. Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 12);
        
        // 7. Update password
        user.password = hashedPassword;
        user.passwordChangedAt = new Date();
        await user.save();
        
        // 8. Optionally: Invalidate all existing tokens
        await revokeAllUserTokens(user._id);
        
        res.json({
            success: true,
            message: 'Password changed successfully'
        });
        
    } catch (error) {
        console.error('Password change error:', error);
        res.status(500).json({
            success: false,
            error: 'Password change failed'
        });
    }
});
```

#### Password Reset Flow

```javascript
const crypto = require('crypto');

// 1. Request password reset
app.post('/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;
        
        const user = await User.findOne({ email });
        
        if (!user) {
            // ⚠️ Don't reveal if email exists!
            return res.json({
                success: true,
                message: 'If email exists, reset link has been sent'
            });
        }
        
        // Generate reset token
        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenHash = crypto
            .createHash('sha256')
            .update(resetToken)
            .digest('hex');
        
        // Save hashed token to database
        user.resetPasswordToken = resetTokenHash;
        user.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
        await user.save();
        
        // Send email with reset link
        const resetUrl = `https://example.com/reset-password/${resetToken}`;
        await sendEmail({
            to: user.email,
            subject: 'Password Reset Request',
            html: `Click <a href="${resetUrl}">here</a> to reset your password.`
        });
        
        res.json({
            success: true,
            message: 'If email exists, reset link has been sent'
        });
        
    } catch (error) {
        console.error('Forgot password error:', error);
        res.status(500).json({
            success: false,
            error: 'Request failed'
        });
    }
});

// 2. Reset password
app.post('/reset-password/:token', async (req, res) => {
    try {
        const { token } = req.params;
        const { newPassword } = req.body;
        
        // Hash token from URL
        const resetTokenHash = crypto
            .createHash('sha256')
            .update(token)
            .digest('hex');
        
        // Find user with valid token
        const user = await User.findOne({
            resetPasswordToken: resetTokenHash,
            resetPasswordExpires: { $gt: Date.now() }
        });
        
        if (!user) {
            return res.status(400).json({
                success: false,
                error: 'Invalid or expired reset token'
            });
        }
        
        // Validate new password
        if (newPassword.length < 8) {
            return res.status(400).json({
                success: false,
                error: 'Password must be at least 8 characters'
            });
        }
        
        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 12);
        
        // Update password and clear reset token
        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        user.passwordChangedAt = new Date();
        await user.save();
        
        // Invalidate all existing tokens
        await revokeAllUserTokens(user._id);
        
        res.json({
            success: true,
            message: 'Password reset successful'
        });
        
    } catch (error) {
        console.error('Reset password error:', error);
        res.status(500).json({
            success: false,
            error: 'Password reset failed'
        });
    }
});
```

### Password Security Best Practices

✅ **Use bcrypt (or argon2)** - Industry standard  
✅ **Salt rounds: 12-14** - Balance security vs speed  
✅ **Never store plain text passwords**  
✅ **Enforce strong password policy** (length, complexity)  
✅ **Rate limit login attempts** - Prevent brute force  
✅ **Lock account after failed attempts** (5-10 tries)  
✅ **Hash reset tokens** - Don't store plain  
✅ **Expire reset tokens quickly** (10-30 minutes)  
✅ **Invalidate tokens on password change**  
✅ **Don't reveal if email exists** (timing attacks)  
❌ **Don't use MD5, SHA1** - Broken algorithms  
❌ **Don't use same salt for all passwords**  
❌ **Don't email passwords** - Ever!

---

---

## Role-Based Access Control (RBAC) - Complete Guide

Authorization system যা user এর role based করে permission দেয়।

### Common Roles

```
Super Admin → Full system access
Admin       → Manage users, content
Moderator   → Edit/delete content
Editor      → Create/edit content
User        → Read content, own profile
Guest       → Public content only
```

### Basic RBAC Implementation

```javascript
// Middleware: Check if user has required role
const authorize = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                error: 'Authentication required'
            });
        }
        
        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                error: 'You do not have permission to access this resource'
            });
        }
        
        next();
    };
};

// Usage
app.get('/admin/dashboard',
    authenticate,
    authorize('admin', 'superadmin'),
    (req, res) => {
        res.json({ message: 'Admin dashboard data' });
    }
);

app.delete('/users/:id',
    authenticate,
    authorize('admin'),
    async (req, res) => {
        // Delete user
    }
);

app.post('/posts',
    authenticate,
    authorize('admin', 'editor', 'user'),
    async (req, res) => {
        // Create post
    }
);
```

### Resource Ownership Check

```javascript
// Check if user owns the resource
const checkOwnership = (resourceModel) => {
    return async (req, res, next) => {
        try {
            const resource = await resourceModel.findById(req.params.id);
            
            if (!resource) {
                return res.status(404).json({
                    success: false,
                    error: 'Resource not found'
                });
            }
            
            // Allow if user is owner OR admin
            if (resource.author.toString() !== req.user.userId && 
                req.user.role !== 'admin') {
                return res.status(403).json({
                    success: false,
                    error: 'You can only modify your own resources'
                });
            }
            
            req.resource = resource;
            next();
            
        } catch (error) {
            res.status(500).json({
                success: false,
                error: 'Authorization failed'
            });
        }
    };
};

// Usage
app.put('/posts/:id',
    authenticate,
    checkOwnership(Post),
    async (req, res) => {
        req.resource.title = req.body.title;
        await req.resource.save();
        res.json({ success: true, data: req.resource });
    }
);
```

### Permission-Based RBAC

```javascript
// Define permissions for each role
const permissions = {
    superadmin: ['*'], // All permissions
    
    admin: [
        'users.read',
        'users.create',
        'users.update',
        'users.delete',
        'posts.read',
        'posts.create',
        'posts.update',
        'posts.delete'
    ],
    
    editor: [
        'posts.read',
        'posts.create',
        'posts.update',
        'posts.delete:own'
    ],
    
    user: [
        'posts.read',
        'posts.create',
        'posts.update:own',
        'posts.delete:own',
        'profile.read',
        'profile.update:own'
    ],
    
    guest: [
        'posts.read'
    ]
};

// Check if user has permission
function hasPermission(role, permission) {
    const rolePerms = permissions[role] || [];
    
    // Superadmin has all permissions
    if (rolePerms.includes('*')) {
        return true;
    }
    
    // Check exact permission
    if (rolePerms.includes(permission)) {
        return true;
    }
    
    // Check wildcard permission (e.g., 'posts.*')
    const [resource, action] = permission.split('.');
    if (rolePerms.includes(`${resource}.*`)) {
        return true;
    }
    
    return false;
}

// Middleware
const requirePermission = (permission) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                error: 'Authentication required'
            });
        }
        
        if (!hasPermission(req.user.role, permission)) {
            return res.status(403).json({
                success: false,
                error: `Permission denied: ${permission} required`
            });
        }
        
        next();
    };
};

// Usage
app.get('/users',
    authenticate,
    requirePermission('users.read'),
    async (req, res) => {
        const users = await User.find();
        res.json({ success: true, data: users });
    }
);

app.delete('/users/:id',
    authenticate,
    requirePermission('users.delete'),
    async (req, res) => {
        await User.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: 'User deleted' });
    }
);
```

### Database Schema with Roles

```javascript
// MongoDB/Mongoose
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['guest', 'user', 'editor', 'admin', 'superadmin'],
        default: 'user'
    },
    permissions: [{
        type: String
    }],
    isActive: {
        type: Boolean,
        default: true
    }
});
```

---

## OAuth 2.0 & Social Login - Complete Guide

Third-party authentication (Google, Facebook, GitHub, etc.)

### OAuth 2.0 Flow

```
1. User clicks "Login with Google"
2. Redirect to Google's authorization page
3. User grants permission
4. Google redirects back with authorization code
5. Exchange code for access token
6. Use token to get user info
7. Create/login user in your system
```

### Google OAuth Implementation

```bash
npm install passport passport-google-oauth20 express-session
```

```javascript
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

// Configure Google Strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/auth/google/callback',
    scope: ['profile', 'email']
},
async (accessToken, refreshToken, profile, done) => {
    try {
        // Find or create user
        let user = await User.findOne({ googleId: profile.id });
        
        if (!user) {
            user = await User.create({
                googleId: profile.id,
                email: profile.emails[0].value,
                name: profile.displayName,
                avatar: profile.photos[0].value,
                provider: 'google'
            });
        }
        
        return done(null, user);
        
    } catch (error) {
        return done(error, null);
    }
}));

// Serialize user
passport.serializeUser((user, done) => {
    done(null, user.id);
});

// Deserialize user
passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});

// Initialize passport
app.use(passport.initialize());
app.use(passport.session());

// Routes
// 1. Initiate OAuth
app.get('/auth/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
);

// 2. Callback
app.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    (req, res) => {
        // Successful authentication
        // Generate JWT token
        const token = generateToken(req.user);
        
        // Redirect to frontend with token
        res.redirect(`http://localhost:3000/auth-success?token=${token}`);
    }
);
```

### GitHub OAuth

```bash
npm install passport-github2
```

```javascript
const GitHubStrategy = require('passport-github2').Strategy;

passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: '/auth/github/callback'
},
async (accessToken, refreshToken, profile, done) => {
    try {
        let user = await User.findOne({ githubId: profile.id });
        
        if (!user) {
            user = await User.create({
                githubId: profile.id,
                username: profile.username,
                email: profile.emails?.[0]?.value,
                name: profile.displayName,
                avatar: profile.photos?.[0]?.value,
                provider: 'github'
            });
        }
        
        return done(null, user);
    } catch (error) {
        return done(error, null);
    }
}));

// Routes
app.get('/auth/github',
    passport.authenticate('github', { scope: ['user:email'] })
);

app.get('/auth/github/callback',
    passport.authenticate('github', { failureRedirect: '/login' }),
    (req, res) => {
        const token = generateToken(req.user);
        res.redirect(`http://localhost:3000/auth-success?token=${token}`);
    }
);
```

---

## Two-Factor Authentication (2FA) - Complete Guide

Extra security layer beyond password।

### Types of 2FA

1. **SMS OTP** - Send code via SMS
2. **Email OTP** - Send code via email
3. **TOTP** - Time-based OTP (Google Authenticator, Authy)
4. **Hardware tokens** - YubiKey, security keys

### TOTP Implementation (Google Authenticator)

```bash
npm install speakeasy qrcode
```

```javascript
const speakeasy = require('speakeasy');
const QRCode = require('qrcode');

// 1. Enable 2FA - Generate secret
app.post('/2fa/enable', authenticate, async (req, res) => {
    try {
        // Generate secret
        const secret = speakeasy.generateSecret({
            name: `MyApp (${req.user.email})`,
            length: 32
        });
        
        // Generate QR code
        const qrCodeUrl = await QRCode.toDataURL(secret.otpauth_url);
        
        // Save secret temporarily (not activated yet)
        req.user.twoFactorSecret = secret.base32;
        req.user.twoFactorEnabled = false;
        await req.user.save();
        
        res.json({
            success: true,
            secret: secret.base32,
            qrCode: qrCodeUrl,
            message: 'Scan QR code with Google Authenticator'
        });
        
    } catch (error) {
        res.status(500).json({
            success: false,
            error: '2FA setup failed'
        });
    }
});

// 2. Verify and activate 2FA
app.post('/2fa/verify', authenticate, async (req, res) => {
    try {
        const { token } = req.body;
        
        // Verify token
        const verified = speakeasy.totp.verify({
            secret: req.user.twoFactorSecret,
            encoding: 'base32',
            token,
            window: 2 // Allow 2 time steps (60 seconds)
        });
        
        if (!verified) {
            return res.status(400).json({
                success: false,
                error: 'Invalid verification code'
            });
        }
        
        // Activate 2FA
        req.user.twoFactorEnabled = true;
        await req.user.save();
        
        // Generate backup codes
        const backupCodes = generateBackupCodes();
        req.user.backupCodes = backupCodes.map(code => 
            bcrypt.hashSync(code, 10)
        );
        await req.user.save();
        
        res.json({
            success: true,
            message: '2FA enabled successfully',
            backupCodes // Show once, user must save them
        });
        
    } catch (error) {
        res.status(500).json({
            success: false,
            error: '2FA verification failed'
        });
    }
});

// 3. Login with 2FA
app.post('/login', async (req, res) => {
    try {
        const { email, password, twoFactorToken } = req.body;
        
        // 1. Verify credentials
        const user = await User.findOne({ email }).select('+password');
        if (!user || !await bcrypt.compare(password, user.password)) {
            return res.status(401).json({
                success: false,
                error: 'Invalid credentials'
            });
        }
        
        // 2. Check if 2FA enabled
        if (user.twoFactorEnabled) {
            if (!twoFactorToken) {
                return res.status(200).json({
                    success: false,
                    requiresTwoFactor: true,
                    message: '2FA code required'
                });
            }
            
            // Verify 2FA token
            const verified = speakeasy.totp.verify({
                secret: user.twoFactorSecret,
                encoding: 'base32',
                token: twoFactorToken,
                window: 2
            });
            
            if (!verified) {
                return res.status(401).json({
                    success: false,
                    error: 'Invalid 2FA code'
                });
            }
        }
        
        // 3. Generate tokens
        const { accessToken, refreshToken } = generateTokens(user);
        
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict'
        });
        
        res.json({
            success: true,
            accessToken,
            user: {
                id: user._id,
                email: user.email,
                name: user.name
            }
        });
        
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Login failed'
        });
    }
});

// 4. Disable 2FA
app.post('/2fa/disable', authenticate, async (req, res) => {
    try {
        const { password, token } = req.body;
        
        // Verify password
        const user = await User.findById(req.user.userId).select('+password');
        if (!await bcrypt.compare(password, user.password)) {
            return res.status(401).json({
                success: false,
                error: 'Invalid password'
            });
        }
        
        // Verify 2FA token
        const verified = speakeasy.totp.verify({
            secret: user.twoFactorSecret,
            encoding: 'base32',
            token,
            window: 2
        });
        
        if (!verified) {
            return res.status(401).json({
                success: false,
                error: 'Invalid 2FA code'
            });
        }
        
        // Disable 2FA
        user.twoFactorEnabled = false;
        user.twoFactorSecret = undefined;
        user.backupCodes = undefined;
        await user.save();
        
        res.json({
            success: true,
            message: '2FA disabled successfully'
        });
        
    } catch (error) {
        res.status(500).json({
            success: false,
            error: '2FA disable failed'
        });
    }
});

// Helper: Generate backup codes
function generateBackupCodes(count = 10) {
    const codes = [];
    for (let i = 0; i < count; i++) {
        codes.push(crypto.randomBytes(4).toString('hex').toUpperCase());
    }
    return codes;
}
```

---

## সারাংশ

Complete authentication & authorization system এ থাকা উচিত:

✅ **Secure password hashing** (bcrypt, 12 rounds)  
✅ **JWT with refresh tokens** (15min access, 7d refresh)  
✅ **Role-Based Access Control** (RBAC)  
✅ **Password reset flow** (secure tokens, expiration)  
✅ **Account lockout** (brute force protection)  
✅ **Two-Factor Authentication** (2FA/MFA)  
✅ **OAuth social login** (Google, GitHub)  
✅ **Session management** (logout, logout all)  
✅ **Input validation** (email, password strength)  
✅ **Rate limiting** (login attempts)  
✅ **Audit logging** (security events)  
✅ **HTTPS only** (secure transport)

**Remember:** Security is not optional - it's essential! 🔒
