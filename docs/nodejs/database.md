# Database Integration

যেকোনো ব্যাকএন্ড অ্যাপ্লিকেশনের প্রাণ হলো ডেটাবেস। Node.js এর সাথে সাধারণত দুই ধরণের ডেটাবেস বেশি ব্যবহৃত হয়:
1.  **NoSQL:** MongoDB (সবচেয়ে জনপ্রিয়)।
2.  **Relational (SQL):** PostgreSQL বা MySQL।

---

## ১. MongoDB & Mongoose (NoSQL)

**MongoDB** হলো একটি ডকুমেন্ট-ওরিয়েন্টেড ডেটাবেস যা JSON ফরম্যাটে ডেটা সেভ করে। আর **Mongoose** হলো MongoDB এর জন্য একটি ODM (Object Data Modeling) লাইব্রেরি যা Node.js এ কাজ করা অনেক সহজ করে দেয়।

### Installation & Setup

```bash
npm install mongoose
```

**Connection:**
```javascript
const mongoose = require('mongoose');

// MongoDB Atlas বা Local URL
const uri = 'mongodb://localhost:27017/my_database';

mongoose.connect(uri)
    .then(() => console.log('MongoDB Connected ✅'))
    .catch(err => console.error('Connection Failed ❌', err));
```

### Schema & Model Design
ডেটা দেখতে কেমন হবে তার ব্লুপ্রিন্ট হলো স্কিমা।

```javascript
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    age: Number,
    role: { type: String, default: 'user' }
});

// Model তৈরি (User কালেকশন তৈরি হবে)
const User = mongoose.model('User', userSchema);
```

### CRUD Operations (Mongoose)

**১. Create (ডেটা তৈরি):**
```javascript
const user = new User({ name: 'Ripon', email: 'ripon@gmail.com' });
await user.save();
```

**২. Read (ডেটা পড়া):**
```javascript
// সব ইউজার
const users = await User.find();

// নির্দিষ্ট ইউজার এবং শুধু নাম ও ইমেইল ফিল্ড
const singleUser = await User.findOne({ email: 'ripon@gmail.com' }).select('name email');
```

**৩. Update (ডেটা আপডেট):**
```javascript
// ID দিয়ে খুঁজে আপডেট করা (new: true দিলে আপডেটেড ডেটা রিটার্ন করে)
await User.findByIdAndUpdate(id, { age: 26 }, { new: true });
```

**৪. Delete (ডেটা ডিলিট):**
```javascript
await User.findByIdAndDelete(id);
```

### Relationships (Populate)
এক কালেকশনের সাথে অন্যের সম্পর্ক। ধরুন `Post` মডেলের সাথে `User` এর সম্পর্ক আছে।

```javascript
const postSchema = new mongoose.Schema({
    title: String,
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } // রেফারেন্স
});

// কুয়েরি করার সময় ইউজারের ডিটেইলস আনা
const posts = await Post.find().populate('author', 'name email');
```

---

## ২. PostgreSQL/MySQL & Sequelize (Relational)

রিলেশনাল ডেটাবেসে টেবিল এবং রো (Row) আকারে ডেটা থাকে। Node.js এ **Sequelize** হলো একটি জনপ্রিয় ORM (Object-Relational Mapper)।

### Installation
```bash
# For PostgreSQL
npm install sequelize pg pg-hstore
# For MySQL
npm install sequelize mysql2
```

### Connection & Model

```javascript
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('database', 'username', 'password', {
    host: 'localhost',
    dialect: 'postgres' // বা 'mysql'
});

// Model Definition
const User = sequelize.define('User', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        unique: true
    }
});

// টেবিল সিঙ্ক করা
sequelize.sync({ force: false })
    .then(() => console.log('Database & tables created!'));
```

### CRUD Operations (Sequelize)

```javascript
// Create
await User.create({ name: "Karim", email: "karim@test.com" });

// Read
const users = await User.findAll();
const user = await User.findOne({ where: { email: "karim@test.com" } });

// Update
await User.update({ name: "Karim Uddin" }, {
    where: { id: 1 }
});

// Delete
await User.destroy({
    where: { id: 1 }
});
```
