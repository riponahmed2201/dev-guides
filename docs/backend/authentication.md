# Authentication (অথেনটিকেশন)

## Authentication কী?

**Authentication** (সংক্ষেপে AuthN) হলো **"তুমি কে?"** — User-এর পরিচয় যাচাই করা। তুমি যে বলছো তুমি "Ripon", সেটা প্রমাণ করো।

```
Authentication → "তুমি কে?" (পরিচয় যাচাই)
Authorization  → "তুমি কী করতে পারো?" (অনুমতি যাচাই)

Authentication আগে হয়, তারপর Authorization:

Request → Authentication → "হ্যাঁ, এটা Ripon" → Authorization → "Ripon কি admin?"
          (কে?)                                   (কী করতে পারে?)
```

> **বাস্তব উদাহরণ:** Office-এ ঢোকার সময় ID card দেখাও → Guard verify করে "হ্যাঁ, এটা Ripon" (Authentication)। তারপর check করে "Ripon-এর 5th floor-এ access আছে কিনা" (Authorization)।

---

## Authentication vs Authorization

| Feature           | Authentication (AuthN)        | Authorization (AuthZ)                 |
| ----------------- | ----------------------------- | ------------------------------------- |
| **প্রশ্ন**        | তুমি কে?                      | তুমি কী করতে পারো?                    |
| **উদ্দেশ্য**      | পরিচয় যাচাই                  | অনুমতি যাচাই                          |
| **কখন**           | সবার আগে                      | Authentication-এর পরে                 |
| **কী verify করে** | Credentials (email, password) | Permissions, Roles                    |
| **Fail হলে**      | 401 Unauthorized              | 403 Forbidden                         |
| **উদাহরণ**        | Login form, JWT verify        | Admin panel access, delete permission |

```
401 Unauthorized → "তুমি কে আমি জানি না" (Authentication fail)
403 Forbidden    → "তুমি কে জানি, কিন্তু এটা করার অনুমতি নেই" (Authorization fail)
```

---

## Authentication-এর পদ্ধতি

### Overview

```
Method              কীভাবে কাজ করে                        Best For
──────────────────────────────────────────────────────────────────────
Username/Password   Email + Password দিয়ে login           Traditional apps
Session-Based       Server-এ session store, cookie         Server-rendered apps
Token-Based (JWT)   Client-এ token store                   SPA, Mobile, API
OAuth 2.0           Third-party login (Google, GitHub)     Social login
API Key             Static key দিয়ে identify               Service-to-service
Basic Auth          Base64 encoded credentials             Simple API
Multi-Factor (MFA)  Password + OTP/Authenticator           High security
SSO                 একবার login → সব app access            Enterprise
```

---

## 1. Username/Password Authentication

সবচেয়ে basic — user email ও password দিয়ে login করে:

### Registration (Signup)

```javascript
const bcrypt = require("bcrypt");

app.post("/api/auth/register", async (req, res) => {
  const { name, email, password } = req.body;

  // Email already exists?
  const existing = await User.findOne({ email });
  if (existing) {
    return res.status(409).json({ error: "Email already registered" });
  }

  // Password hash করো (NEVER store plain text!)
  const saltRounds = 12;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  res.status(201).json({
    message: "Registration successful",
    user: { id: user._id, name: user.name, email: user.email },
  });
});
```

### Login

```javascript
app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({ error: "Invalid email or password" });
    // "Email not found" বলো না → attacker জানবে email exists কিনা
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  // Login successful → Session বা Token তৈরি করো
  // (পরের section-এ দেখবো)

  res.json({
    message: "Login successful",
    user: { id: user._id, name: user.name },
  });
});
```

### Password Hashing কেন?

```
❌ Plain text password store করলে:
  Database hack হলে → সব password দেখা যাবে!
  users table:
    ripon@test.com → mypassword123  😱

✅ Hashed password store করলে:
  Database hack হলেও → password বের করা প্রায় অসম্ভব!
  users table:
    ripon@test.com → $2b$12$LJ3m...hashed...XYZ

bcrypt:
  - Password → Hash (one-way, reverse করা যায় না)
  - Salt যোগ করে (same password → different hash)
  - Cost factor (saltRounds=12) → brute force slow করে
```

```
Hashing Algorithms:
  bcrypt     → ✅ সবচেয়ে popular, battle-tested
  argon2     → ✅ নতুন, memory-hard (brute force আরো কঠিন)
  scrypt     → ✅ memory-hard
  MD5/SHA1   → ❌ NEVER use (too fast, crackable)
  SHA256     → ❌ Salt ছাড়া unsafe
```

---

## 2. Session-Based Authentication

Login-এর পর server-এ **session** তৈরি হয়, client-এ **session ID cookie** পাঠানো হয়:

### কীভাবে কাজ করে

```
1. Login:
   Client → POST /login { email, password }
   Server → Verify → Session তৈরি (server-এ store) → Cookie পাঠাও
   Client ← Set-Cookie: sessionId=abc123

2. প্রতিটি Request:
   Client → GET /api/profile (Cookie: sessionId=abc123 auto-send)
   Server → Session store-এ abc123 খুঁজো → User data পাও
   Client ← User profile data

3. Logout:
   Client → POST /logout
   Server → Session delete করো
   Client ← Cookie clear
```

### Implementation (Express + express-session)

```bash
npm install express-session connect-mongo
```

```javascript
const session = require("express-session");
const MongoStore = require("connect-mongo");

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
      ttl: 24 * 60 * 60, // 24 hours
    }),
    cookie: {
      httpOnly: true, // JavaScript access বন্ধ (XSS prevention)
      secure: process.env.NODE_ENV === "production", // HTTPS only
      sameSite: "lax", // CSRF prevention
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  }),
);

// Login
app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  // Session-এ user data রাখো
  req.session.userId = user._id;
  req.session.role = user.role;

  res.json({ message: "Logged in", user: { id: user._id, name: user.name } });
});

// Auth Middleware
function isAuthenticated(req, res, next) {
  if (req.session.userId) {
    return next();
  }
  res.status(401).json({ error: "Authentication required" });
}

// Protected Route
app.get("/api/profile", isAuthenticated, async (req, res) => {
  const user = await User.findById(req.session.userId).select("-password");
  res.json(user);
});

// Logout
app.post("/api/auth/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(500).json({ error: "Logout failed" });
    res.clearCookie("connect.sid");
    res.json({ message: "Logged out" });
  });
});
```

### Session Storage Options

```
Store             বৈশিষ্ট্য
──────────────────────────────────────────
Memory (default)  ❌ Server restart → সব session হারাবে
                  ❌ Multiple servers → share হবে না

Redis             ✅ Fast, persistent
                  ✅ Multiple servers share করতে পারে
                  ✅ TTL (auto-expire)

MongoDB           ✅ Persistent
                  ✅ Already ব্যবহার করলে extra dependency নেই
                  🟡 Redis-এর চেয়ে slow

PostgreSQL        ✅ Persistent
                  🟡 Session-এর জন্য overkill
```

### সুবিধা ও সমস্যা

```
Session-Based:
  ✅ Server session revoke করতে পারে (force logout)
  ✅ Cookie automatically পাঠায় (client-এ কিছু করতে হয় না)
  ✅ httpOnly cookie → XSS থেকে safe
  ❌ Server-এ state রাখতে হয় (stateful)
  ❌ Multiple servers → shared session store দরকার (Redis)
  ❌ Mobile app-এ cookie tricky
  ❌ CSRF attack-এর ঝুঁকি
```

---

## 3. Token-Based Authentication (JWT)

Login-এর পর server একটা **token** দেয়, client সেটা store করে এবং প্রতিটি request-এ পাঠায়:

### JWT (JSON Web Token) কী?

```
JWT = Header.Payload.Signature

eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOiJ1Xzc4OSIsInJvbGUiOiJ1c2VyIiwiZXhwIjoxNzA4MzYwMDAwfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
│                      │                                                                          │
└── Header             └── Payload (data)                                                          └── Signature
    (algorithm)             (userId, role, exp)                                                        (verify)
```

```
Header:  { "alg": "HS256", "typ": "JWT" }
Payload: { "userId": "u_789", "role": "user", "exp": 1708360000 }
Signature: HMACSHA256(base64(header) + "." + base64(payload), secret)
```

### কীভাবে কাজ করে

```
1. Login:
   Client → POST /login { email, password }
   Server → Verify → JWT তৈরি → Token পাঠাও
   Client ← { token: "eyJhbG..." }

2. প্রতিটি Request:
   Client → GET /api/profile
            Authorization: Bearer eyJhbG...
   Server → Token verify → Payload থেকে userId পাও
   Client ← User profile data

3. Logout:
   Client → Token delete করো (localStorage/memory থেকে)
   (Server-এ কিছু করার দরকার নেই — stateless!)
```

### Implementation

```bash
npm install jsonwebtoken
```

```javascript
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = "24h";

// Login → Token generate
app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });

  res.json({
    message: "Login successful",
    token,
    user: { id: user._id, name: user.name },
  });
});

// Auth Middleware — Token verify
function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Token required" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // { userId, role, iat, exp }
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Token expired" });
    }
    return res.status(401).json({ error: "Invalid token" });
  }
}

// Protected Route
app.get("/api/profile", authenticate, async (req, res) => {
  const user = await User.findById(req.user.userId).select("-password");
  res.json(user);
});
```

### Access Token + Refresh Token

Access token short-lived রাখো (15 min), Refresh token দিয়ে নতুন access token নাও:

```javascript
function generateTokens(user) {
  const accessToken = jwt.sign(
    { userId: user._id, role: user.role },
    JWT_SECRET,
    { expiresIn: "15m" },
  );

  const refreshToken = jwt.sign(
    { userId: user._id },
    process.env.REFRESH_SECRET,
    { expiresIn: "7d" },
  );

  return { accessToken, refreshToken };
}

// Login
app.post("/api/auth/login", async (req, res) => {
  // ... verify credentials ...

  const { accessToken, refreshToken } = generateTokens(user);

  // Refresh token database-এ save করো (revoke করতে পারবে)
  await RefreshToken.create({
    token: refreshToken,
    userId: user._id,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });

  // Refresh token httpOnly cookie-তে পাঠাও
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.json({ accessToken });
});

// Refresh — নতুন access token নাও
app.post("/api/auth/refresh", async (req, res) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    return res.status(401).json({ error: "Refresh token required" });
  }

  // Database-এ token আছে কিনা check
  const stored = await RefreshToken.findOne({ token: refreshToken });
  if (!stored) {
    return res.status(401).json({ error: "Invalid refresh token" });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET);
    const user = await User.findById(decoded.userId);

    const newAccessToken = jwt.sign(
      { userId: user._id, role: user.role },
      JWT_SECRET,
      { expiresIn: "15m" },
    );

    res.json({ accessToken: newAccessToken });
  } catch (err) {
    await RefreshToken.deleteOne({ token: refreshToken });
    return res.status(401).json({ error: "Invalid refresh token" });
  }
});

// Logout — Refresh token revoke করো
app.post("/api/auth/logout", async (req, res) => {
  const { refreshToken } = req.cookies;
  if (refreshToken) {
    await RefreshToken.deleteOne({ token: refreshToken });
  }
  res.clearCookie("refreshToken");
  res.json({ message: "Logged out" });
});
```

```
Access Token:
  Short-lived (15 min)
  Stateless (server-এ store করা লাগে না)
  প্রতিটি API request-এ পাঠাও

Refresh Token:
  Long-lived (7 days)
  Server-এ store করো (revoke করতে পারবে)
  httpOnly cookie-তে রাখো
  শুধু /refresh endpoint-এ পাঠাও

Flow:
  Login → access + refresh token পাও
  API call → access token পাঠাও
  Access expired → refresh token দিয়ে নতুন access নাও
  Logout → refresh token delete
```

### JWT সুবিধা ও সমস্যা

```
JWT (Token-Based):
  ✅ Stateless — server-এ session store করতে হয় না
  ✅ Scalable — multiple servers-এ কাজ করে (shared store দরকার নেই)
  ✅ Mobile-friendly
  ✅ Microservices-এ ideal
  ❌ Token revoke করা কঠিন (expire পর্যন্ত valid)
  ❌ Payload-এ sensitive data রাখা যায় না (decode করা যায়)
  ❌ Token size বড় (cookie-র চেয়ে)
```

---

## Session vs JWT Comparison

```
Feature              Session              JWT
──────────────────────────────────────────────────
State                Stateful (server)     Stateless
Storage              Server (Redis/DB)     Client
Scalability          Shared store দরকার   ✅ Easy
Revocation           ✅ Easy (delete)       ❌ Hard
Mobile               🟡 Tricky             ✅ Easy
Size                 Small (session ID)    Large (token)
CSRF Risk            ✅ Yes (cookie)        ❌ No (header)
XSS Risk             ❌ httpOnly cookie     ✅ localStorage
Performance          DB lookup per req     ❌ No lookup
Best For             Server-rendered       SPA, Mobile, API
```

```
কখন কোনটা:
  Session → Traditional web app, server-rendered (EJS, Pug, Django)
  JWT → SPA (React, Vue), Mobile app, Microservices, Public API
  Hybrid → Access token (JWT) + Refresh token (server-stored)
```

---

## 4. Cookie-Based Authentication

Cookie হলো browser-এ store হওয়া ছোট data যা প্রতিটি request-এ automatically server-এ যায়:

### Cookie Attributes

```javascript
res.cookie("token", value, {
  httpOnly: true, // JavaScript access বন্ধ (XSS safe)
  secure: true, // শুধু HTTPS-এ পাঠাবে
  sameSite: "strict", // Cross-site request-এ পাঠাবে না (CSRF safe)
  maxAge: 86400000, // 24 hours (milliseconds)
  path: "/", // কোন path-এ cookie valid
  domain: ".example.com", // কোন domain-এ valid
});
```

```
httpOnly: true
  → document.cookie দিয়ে access করা যাবে না
  → XSS attack-এ cookie চুরি সম্ভব না

secure: true
  → শুধু HTTPS connection-এ cookie পাঠাবে
  → HTTP-তে cookie যাবে না (man-in-the-middle safe)

sameSite: 'strict' / 'lax' / 'none'
  strict → শুধু same-site request-এ cookie পাঠাবে
  lax    → Navigation (link click)-এ পাঠাবে, AJAX-এ না
  none   → সব request-এ পাঠাবে (secure: true দরকার)
```

### JWT in Cookie (Best Practice for Web)

```javascript
// Login → JWT cookie-তে রাখো
app.post("/api/auth/login", async (req, res) => {
  // ... verify credentials ...

  const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, {
    expiresIn: "24h",
  });

  res.cookie("token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: 24 * 60 * 60 * 1000,
  });

  res.json({ message: "Logged in", user: { id: user._id, name: user.name } });
});

// Middleware → Cookie থেকে token পড়ো
function authenticate(req, res, next) {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ error: "Not authenticated" });

  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.clearCookie("token");
    return res.status(401).json({ error: "Invalid token" });
  }
}
```

```
JWT কোথায় রাখবে?
──────────────────────────────────────
localStorage:
  ❌ XSS-এ vulnerable (JS access possible)
  ✅ CSRF safe

httpOnly Cookie:
  ✅ XSS safe (JS access নেই)
  ❌ CSRF-এ vulnerable (auto-send)
  → sameSite + CSRF token দিয়ে solve

Best: httpOnly cookie + sameSite: 'lax' (বা strict)
```

---

## 5. OAuth 2.0 (Social Login)

Google, GitHub, Facebook দিয়ে login — user-এর password তোমার কাছে আসে না:

### OAuth 2.0 Flow (Authorization Code)

```
1. User "Login with Google" বাটন চাপে
   → Redirect to Google: https://accounts.google.com/o/oauth2/auth?
     client_id=YOUR_ID&redirect_uri=YOUR_CALLBACK&scope=email+profile

2. Google login page-এ user email/password দেয়
   → Google verify করে
   → Redirect back: YOUR_CALLBACK?code=AUTH_CODE

3. তোমার server AUTH_CODE দিয়ে Google-কে access token চায়
   → POST https://oauth2.googleapis.com/token
     { code, client_id, client_secret, redirect_uri }
   ← { access_token, id_token, refresh_token }

4. Access token দিয়ে Google API থেকে user info আনো
   → GET https://www.googleapis.com/oauth2/v2/userinfo
     Authorization: Bearer ACCESS_TOKEN
   ← { id, email, name, picture }

5. User info দিয়ে তোমার app-এ login/register করো
```

### Implementation (Passport.js)

```bash
npm install passport passport-google-oauth20
```

```javascript
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/api/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      let user = await User.findOne({ googleId: profile.id });

      if (!user) {
        user = await User.create({
          googleId: profile.id,
          name: profile.displayName,
          email: profile.emails[0].value,
          avatar: profile.photos[0].value,
        });
      }

      done(null, user);
    },
  ),
);

// Google login শুরু
app.get(
  "/api/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] }),
);

// Google callback
app.get(
  "/api/auth/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    const token = jwt.sign(
      { userId: req.user._id, role: req.user.role },
      JWT_SECRET,
      { expiresIn: "24h" },
    );
    res.redirect(`${process.env.FRONTEND_URL}/auth?token=${token}`);
  },
);
```

---

## 6. API Key Authentication

Service-to-service communication-এ static key ব্যবহার:

```javascript
// API Key verify middleware
async function apiKeyAuth(req, res, next) {
  const apiKey = req.headers["x-api-key"];

  if (!apiKey) {
    return res.status(401).json({ error: "API key required" });
  }

  const key = await ApiKey.findOne({
    key: apiKey,
    isActive: true,
  });

  if (!key) {
    return res.status(401).json({ error: "Invalid API key" });
  }

  req.apiClient = key;
  next();
}

// Usage
app.get("/api/v1/data", apiKeyAuth, getData);

// Request:
// GET /api/v1/data
// X-API-Key: sk_live_abc123def456
```

---

## 7. Multi-Factor Authentication (MFA/2FA)

Password ছাড়াও **দ্বিতীয় একটা proof** চাওয়া:

```
Factors:
  Something you KNOW   → Password, PIN
  Something you HAVE   → Phone (OTP), Authenticator app, Security key
  Something you ARE    → Fingerprint, Face ID

2FA = 2 different factors:
  Password (know) + OTP (have) → ✅ 2FA
  Password (know) + PIN (know) → ❌ Not 2FA (both "know")
```

### TOTP (Time-Based OTP) Implementation

```bash
npm install otplib qrcode
```

```javascript
const { authenticator } = require("otplib");
const QRCode = require("qrcode");

// ১. 2FA Enable — QR code generate
app.post("/api/auth/2fa/setup", authenticate, async (req, res) => {
  const secret = authenticator.generateSecret();

  await User.findByIdAndUpdate(req.user.userId, {
    twoFactorSecret: secret,
    twoFactorEnabled: false, // verify না করা পর্যন্ত enable না
  });

  const otpauth = authenticator.keyuri(req.user.email, "MyApp", secret);

  const qrCode = await QRCode.toDataURL(otpauth);

  res.json({ secret, qrCode });
  // User Google Authenticator-এ QR scan করবে
});

// ২. 2FA Verify ও Enable
app.post("/api/auth/2fa/verify", authenticate, async (req, res) => {
  const { token } = req.body;
  const user = await User.findById(req.user.userId);

  const isValid = authenticator.verify({
    token,
    secret: user.twoFactorSecret,
  });

  if (!isValid) {
    return res.status(400).json({ error: "Invalid OTP" });
  }

  user.twoFactorEnabled = true;
  await user.save();

  res.json({ message: "2FA enabled" });
});

// ৩. Login with 2FA
app.post("/api/auth/login", async (req, res) => {
  const { email, password, totpToken } = req.body;

  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  // 2FA enabled হলে TOTP token দরকার
  if (user.twoFactorEnabled) {
    if (!totpToken) {
      return res.json({ requires2FA: true, message: "Enter OTP" });
    }

    const isValid = authenticator.verify({
      token: totpToken,
      secret: user.twoFactorSecret,
    });

    if (!isValid) {
      return res.status(401).json({ error: "Invalid OTP" });
    }
  }

  const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, {
    expiresIn: "24h",
  });

  res.json({ token });
});
```

---

## 8. Single Sign-On (SSO)

**একবার login করলে সব connected app-এ access:**

```
Without SSO:
  Gmail → Login
  YouTube → Login (আবার!)
  Google Drive → Login (আবার!)

With SSO:
  Google Account → Login (একবার)
  Gmail ✅, YouTube ✅, Drive ✅ → সব accessible!
```

```
SSO Protocols:
  SAML 2.0  → Enterprise (Okta, Active Directory)
  OpenID Connect (OIDC) → OAuth 2.0 + identity layer
  CAS → Central Authentication Service

SSO Providers:
  Auth0, Okta, Firebase Auth, AWS Cognito, Keycloak
```

---

## Password Reset Flow

```javascript
const crypto = require("crypto");

// ১. Password reset request
app.post("/api/auth/forgot-password", async (req, res) => {
  const user = await User.findOne({ email: req.body.email });

  // Email exists না বললেও same response দাও (security)
  if (!user) {
    return res.json({
      message: "If the email exists, a reset link has been sent",
    });
  }

  const resetToken = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  user.resetToken = hashedToken;
  user.resetTokenExpiry = Date.now() + 30 * 60 * 1000; // 30 minutes
  await user.save();

  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
  await sendEmail(user.email, "Password Reset", `Reset link: ${resetUrl}`);

  res.json({ message: "If the email exists, a reset link has been sent" });
});

// ২. Password reset
app.post("/api/auth/reset-password", async (req, res) => {
  const { token, newPassword } = req.body;
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await User.findOne({
    resetToken: hashedToken,
    resetTokenExpiry: { $gt: Date.now() },
  });

  if (!user) {
    return res.status(400).json({ error: "Invalid or expired reset token" });
  }

  user.password = await bcrypt.hash(newPassword, 12);
  user.resetToken = undefined;
  user.resetTokenExpiry = undefined;
  await user.save();

  // সব active session/refresh token invalidate করো
  await RefreshToken.deleteMany({ userId: user._id });

  res.json({ message: "Password reset successful" });
});
```

---

## সংক্ষেপে মনে রাখার সূত্র

```
Authentication = "তুমি কে?" (401 if fail)
Authorization  = "তুমি কী করতে পারো?" (403 if fail)

Password:
  NEVER store plain text
  bcrypt (saltRounds=12) বা argon2 ব্যবহার করো

Session vs JWT:
  Session → Stateful, server-এ store, cookie-তে session ID
  JWT     → Stateless, client-এ store, header-এ Bearer token

Token Strategy:
  Access Token  → Short-lived (15 min), stateless
  Refresh Token → Long-lived (7 days), server-stored, httpOnly cookie

Cookie Security:
  httpOnly → XSS safe
  secure   → HTTPS only
  sameSite → CSRF safe

OAuth 2.0 → Third-party login (Authorization Code flow)
API Key   → Service-to-service
2FA/MFA   → Password + OTP (TOTP with authenticator app)
SSO       → একবার login → সব app access

Password Reset:
  crypto.randomBytes → hashed token → email → 30 min expiry
```

---

## Interview Golden Lines

> **Authentication verifies identity ("who are you?"), Authorization verifies permissions ("what can you do?"). Auth comes first, returns 401; AuthZ comes second, returns 403.**

> **Never store plain text passwords — use bcrypt or argon2 with a high cost factor. These are deliberately slow to prevent brute force attacks.**

> **Sessions are stateful (server stores state), JWTs are stateless (client holds the token). Sessions are easier to revoke, JWTs are easier to scale.**

> **The Access + Refresh token pattern combines short-lived security (15 min access) with long-lived convenience (7-day refresh) and server-side revocation.**

> **Store JWTs in httpOnly cookies with secure and sameSite flags — not localStorage. This prevents XSS token theft.**

> **OAuth 2.0 Authorization Code flow is the most secure for server-side apps — the client secret never reaches the browser.**
