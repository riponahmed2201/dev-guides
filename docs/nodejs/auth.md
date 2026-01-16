# Authentication & Security

একটি সিকিউর অ্যাপ্লিকেশনের সবচেয়ে গুরুত্বপূর্ণ অংশ হলো অথেন্টিকেশন (Authentication) এবং অথরাইজেশন (Authorization)।

## ১. Authentication vs Authorization

- **Authentication (কে আপনি?):** ব্যবহারকারীর পরিচয় নিশ্চিত করা। (যেমন: লগইন করা)।
- **Authorization (আপনি কি করতে পারবেন?):** ব্যবহারকারীর পারমিশন চেক করা। (যেমন: সাধারণ ইউজার সব পোস্ট এডিট করতে পারবে না, শুধু অ্যাডমিন পারবে)।

---

## ২. Authentication Methods

### Session-based Auth
সার্ভার ব্যবহারকারীর তথ্য (Session ID) মেমোরি বা ডাটাবেসে সেভ করে রাখে এবং ব্রাউজারে কুকির মাধ্যমে পাঠায়। এটি সাধারণত ছোট অ্যাপ্লিকেশনে ব্যবহৃত হয়।

### Token-based Auth (JWT)
মডার্ন এবং স্কেলেবল অ্যাপ্লিকেশনে **JSON Web Token (JWT)** বেশি ব্যবহৃত হয়। সার্ভার লগইন করার পর একটি এনক্রিপ্টেড টোকেন দেয়, যা ক্লায়েন্ট সেভ করে রাখে এবং পরবর্তী প্রতিটি রিকোয়েস্টের সাথে পাঠায়। সার্ভারকে আলাদা করে সেশন স্টোর করতে হয় না (Stateless)।

---

## ৩. JSON Web Token (JWT)

এটি তিনটি অংশ নিয়ে গঠিত: `Header.Payload.Signature`

1.  **Header:** অ্যালগরিদম এবং টোকেন টাইপ।
2.  **Payload:** ডেটা (যেমন ইউজার আইডি, রোল)। *গোপন তথ্য (পাসওয়ার্ড) এখানে দেওয়া যাবে না।*
3.  **Signature:** টোকেনটি ভ্যালিড কিনা তা যাচাই করার জন্য সার্ভারের সিক্রেট কি (Secret Key) দিয়ে তৈরি করা হয়।

**Setup:**
```bash
npm install jsonwebtoken
```

**Generate Token:**
```javascript
const jwt = require('jsonwebtoken');

const token = jwt.sign(
    { id: user._id, role: user.role }, // Payload
    process.env.JWT_SECRET,            // Secret Key
    { expiresIn: '1h' }                // Expiry
);
```

**Verify Token (Middleware):**
```javascript
const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]; // "Bearer <token>"
    if (!token) return res.status(401).send('Access Denied');

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        next();
    } catch (err) {
        res.status(400).send('Invalid Token');
    }
};
```

---

## ৪. Password Hashing (bcrypt)

পাসওয়ার্ড কখনোই প্লেইন টেক্সটে ডাটাবেসে রাখা উচিত নয়। আমরা **bcryptjs** ব্যবহার করে পাসওয়ার্ড হ্যাশ করব।

```bash
npm install bcryptjs
```

**Hash Password:**
```javascript
const bcrypt = require('bcryptjs');

const salt = await bcrypt.genSalt(10);
const hashedPassword = await bcrypt.hash('mypassword123', salt);
```

**Compare Password (Login):**
```javascript
const isMatch = await bcrypt.compare('mypassword123', hashedPassword);
if (isMatch) console.log('Login Successful');
```

---

## ৫. Login & Register Flow

1.  **Register:**
    - ইউজার ইমেইল ও পাসওয়ার্ড দেবে।
    - পাসওয়ার্ড হ্যাশ করে ডাটাবেসে সেভ হবে।
2.  **Login:**
    - ইউজার ক্রেডেনশিয়াল দেবে।
    - `bcrypt.compare` দিয়ে পাসওয়ার্ড চেক হবে।
    - ম্যাচ করলে সার্ভার একটি JWT টোকেন রিটার্ন করবে।
3.  **Protected Route:**
    - ক্লায়েন্ট টোকেনটি হেডারে পাঠাবে।
    - অথেন্টিকেশন মিডলওয়্যার টোকেন ভেরিফাই করবে এবং এক্সেস দেবে।

---

## ৬. Role-Based Access Control (RBAC)

অথরাইজেশনের জন্য আমরা রোল চেক করি।

```javascript
const checkRole = (roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).send('Access Forbidden');
        }
        next();
    };
};

// Route Usage
app.delete('/users/:id', verifyToken, checkRole(['admin']), deleteUser);
```

---

## ৭. Access Tokens vs Refresh Tokens

- **Access Token:** স্বল্প সময়ের জন্য ভ্যালিড (যেমন ১৫ মিনিট)। রিসোর্স এক্সেস করতে লাগে।
- **Refresh Token:** দীর্ঘ সময়ের জন্য ভ্যালিড (যেমন ৭ দিন)। অ্যাক্সেস টোকেন এক্সপায়ার হলে নতুন অ্যাক্সেস টোকেন জেনারেট করতে লাগে। এটি সিকিউরিটি বাড়ায়।

---

## ৮. Passport.js & OAuth 2.0

সোশ্যাল লগইন (Google, Facebook) বা অ্যাডভান্সড অথেন্টিকেশনের জন্য **Passport.js** লাইব্রেরি জনপ্রিয়। এটি বিভিন্ন "Strategy" ব্যবহার করে লগইন ম্যানেজ করে।

```javascript
// Google Strategy Example (Concept)
passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback"
  },
  function(accessToken, refreshToken, profile, cb) {
    User.findOrCreate({ googleId: profile.id }, function (err, user) {
      return cb(err, user);
    });
  }
));
```
