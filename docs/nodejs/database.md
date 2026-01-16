# Database Integration - Complete Guide

যেকোনো ব্যাকএন্ড অ্যাপ্লিকেশনের **প্রাণ হলো ডেটাবেস**। Data persistence, retrieval, এবং management সবকিছুই database এর উপর নির্ভর করে।

## Database Types Overview

### 1. SQL (Relational) Databases

**Structure:** Tables with rows and columns  
**Schema:** Fixed, predefined structure  
**Query Language:** SQL (Structured Query Language)

**Popular SQL Databases:**
- **PostgreSQL** - Most advanced open-source (ACID compliant)
- **MySQL** - Most popular (used by Facebook, Twitter)
- **SQLite** - Lightweight, file-based
- **Microsoft SQL Server** - Enterprise-grade
- **MariaDB** - MySQL fork

**Best For:**
- Complex relationships
- ACID transactions
- Financial applications
- Data integrity critical
- Structured data

### 2. NoSQL (Non-Relational) Databases

**Structure:** Flexible (documents, key-value, graph, etc.)  
**Schema:** Dynamic, schema-less  
**Query Language:** Database-specific APIs

**Popular NoSQL Databases:**
- **MongoDB** - Document-based (most popular)
- **Redis** - In-memory key-value store (caching)
- **Cassandra** - Wide-column store (scalability)
- **Neo4j** - Graph database (relationships)
- **Couchbase** - Document + key-value

**Best For:**
- Rapid development
- Flexible schema
- Horizontal scaling
- Real-time applications
- Unstructured data

---

## SQL vs NoSQL - When to Use What?

| Feature | SQL | NoSQL |
|---------|-----|-------|
| **Schema** | Fixed, predefined | Flexible, dynamic |
| **Scalability** | Vertical (scale up) | Horizontal (scale out) |
| **Transactions** | ACID guaranteed | Eventually consistent |
| **Relationships** | Built-in (JOINs) | Manual (references) |
| **Data Structure** | Structured | Unstructured/Semi-structured |
| **Use Cases** | Banking, ERP, CRM | Social media, IoT, Gaming |
| **Learning Curve** | Moderate | Easy (for simple use) |
| **Performance** | Good for complex queries | Fast for simple queries |

### Decision Tree

```
Need strict data integrity? (Banking, Finance)
├── Yes → SQL (PostgreSQL)
└── No → Continue

Need complex relationships & JOINs?
├── Yes → SQL (PostgreSQL, MySQL)
└── No → Continue

Need horizontal scalability?
├── Yes → NoSQL (MongoDB, Cassandra)
└── No → SQL

Rapid development with changing requirements?
├── Yes → NoSQL (MongoDB)
└── No → SQL

Storing unstructured data? (JSON, logs)
├── Yes → NoSQL (MongoDB)
└── No → SQL
```

---

## ১. MongoDB & Mongoose - Complete Guide

**MongoDB** = Document-oriented NoSQL database (stores data in JSON-like BSON format)  
**Mongoose** = ODM (Object Data Modeling) library for MongoDB (makes working with MongoDB easier)

### Why Mongoose?

```
Without Mongoose (Native MongoDB Driver):
- Manual validation
- No schema structure
- Complex queries
- Lots of boilerplate code

With Mongoose:
✅ Schema definition
✅ Built-in validation
✅ Middleware (hooks)
✅ Virtual properties
✅ Population (relationships)
✅ Query building
✅ Type casting
```

---

### Installation & Setup

#### Install Mongoose

```bash
npm install mongoose

# Optional: Install MongoDB locally
# Or use MongoDB Atlas (cloud)
```

#### Basic Connection

```javascript
const mongoose = require('mongoose');

// Local MongoDB
const uri = 'mongodb://localhost:27017/my_database';

// MongoDB Atlas (cloud)
// const uri = 'mongodb+srv://username:password@cluster.mongodb.net/my_database';

mongoose.connect(uri)
    .then(() => console.log('MongoDB Connected ✅'))
    .catch(err => console.error('Connection Failed ❌', err));
```

#### Advanced Connection with Options

```javascript
const mongoose = require('mongoose');

const options = {
    // Connection pool size
    maxPoolSize: 10,
    minPoolSize: 5,
    
    // Timeout settings
    serverSelectionTimeoutMS: 5000,  // Timeout after 5s
    socketTimeoutMS: 45000,
    
    // Automatically reconnect
    autoIndex: true,  // Build indexes automatically
    
    // Use new URL parser
    useNewUrlParser: true,
    useUnifiedTopology: true
};

mongoose.connect(uri, options)
    .then(() => console.log('MongoDB Connected ✅'))
    .catch(err => console.error('Connection Failed ❌', err));

// Connection events
mongoose.connection.on('connected', () => {
    console.log('Mongoose connected to DB');
});

mongoose.connection.on('error', (err) => {
    console.error('Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
    console.log('Mongoose disconnected');
});

// Graceful shutdown
process.on('SIGINT', async () => {
    await mongoose.connection.close();
    console.log('Mongoose connection closed due to app termination');
    process.exit(0);
});
```

#### Environment Variables (Best Practice)

```javascript
// .env file
MONGODB_URI=mongodb://localhost:27017/my_database
NODE_ENV=development

// app.js
require('dotenv').config();

const uri = process.env.MONGODB_URI;

mongoose.connect(uri)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.error(err));
```

---

### Schema Design - Complete Guide

Schema হলো document এর structure এবং validation rules এর blueprint।

#### Basic Schema

```javascript
const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
    name: String,
    email: String,
    age: Number,
    isActive: Boolean,
    createdAt: Date
});

const User = mongoose.model('User', userSchema);
```

#### Schema with Validation

```javascript
const userSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,                     // Remove whitespace
        minlength: [3, 'Name too short'],
        maxlength: [50, 'Name too long']
    },
    
    email: {
        type: String,
        required: true,
        unique: true,                   // Create unique index
        lowercase: true,                // Convert to lowercase
        trim: true,
        match: [/^\S+@\S+\.\S+$/, 'Invalid email format']
    },
    
    age: {
        type: Number,
        min: [18, 'Must be 18+'],
        max: [120, 'Invalid age']
    },
    
    role: {
        type: String,
        enum: ['user', 'admin', 'moderator'],  // Only these values
        default: 'user'
    },
    
    password: {
        type: String,
        required: true,
        minlength: 8,
        select: false               // Don't return in queries by default
    },
    
    avatar: {
        type: String,
        default: 'default-avatar.png'
    },
    
    isActive: {
        type: Boolean,
        default: true
    },
    
    tags: {
        type: [String],             // Array of strings
        default: []
    },
    
    address: {
        street: String,
        city: String,
        country: {
            type: String,
            default: 'Bangladesh'
        }
    }
}, {
    timestamps: true,               // Auto-create createdAt & updatedAt
    versionKey: false               // Disable __v field
});

const User = mongoose.model('User', userSchema);
```

#### All Schema Types

```javascript
const schema = new Schema({
    // Basic types
    string: String,
    number: Number,
    boolean: Boolean,
    date: Date,
    buffer: Buffer,
    objectId: mongoose.Schema.Types.ObjectId,
    mixed: mongoose.Schema.Types.Mixed,      // Any type
    decimal: mongoose.Schema.Types.Decimal128,
    
    // Arrays
    arrayOfStrings: [String],
    arrayOfNumbers: [Number],
    arrayOfObjects: [{
        name: String,
        value: Number
    }],
    
    // Nested objects
    nested: {
        field1: String,
        field2: Number
    },
    
    // Map (key-value pairs)
    mapField: {
        type: Map,
        of: String
    }
});
```

#### Custom Validation

```javascript
const userSchema = new Schema({
    email: {
        type: String,
        validate: {
            validator: function(v) {
                return /^\S+@\S+\.\S+$/.test(v);
            },
            message: props => `${props.value} is not a valid email!`
        }
    },
    
    password: {
        type: String,
        validate: {
            validator: function(v) {
                // At least 8 chars, 1 uppercase, 1 lowercase, 1 number
                return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(v);
            },
            message: 'Password must be at least 8 chars with uppercase, lowercase & number'
        }
    },
    
    age: {
        type: Number,
        validate: {
            validator: Number.isInteger,
            message: '{VALUE} is not an integer'
        }
    }
});
```

#### Async Validation

```javascript
const userSchema = new Schema({
    email: {
        type: String,
        validate: {
            validator: async function(email) {
                const user = await mongoose.models.User.findOne({ email });
                return !user;  // Return false if user exists
            },
            message: 'Email already exists'
        }
    }
});
```

---

### Schema Methods & Middleware

#### Instance Methods

```javascript
userSchema.methods.getFullName = function() {
    return `${this.firstName} ${this.lastName}`;
};

userSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

// Usage
const user = await User.findById(id);
console.log(user.getFullName());
const isMatch = await user.comparePassword('password123');
```

#### Static Methods

```javascript
userSchema.statics.findByEmail = function(email) {
    return this.findOne({ email: email.toLowerCase() });
};

userSchema.statics.findActive = function() {
    return this.find({ isActive: true });
};

// Usage
const user = await User.findByEmail('john@example.com');
const activeUsers = await User.findActive();
```

#### Query Helpers

```javascript
userSchema.query.byAge = function(age) {
    return this.where({ age: age });
};

userSchema.query.active = function() {
    return this.where({ isActive: true });
};

// Usage
const users = await User.find().byAge(25).active();
```

#### Virtual Properties (Computed Fields)

```javascript
userSchema.virtual('fullName').get(function() {
    return `${this.firstName} ${this.lastName}`;
});

userSchema.virtual('fullName').set(function(name) {
    const [firstName, lastName] = name.split(' ');
    this.firstName = firstName;
    this.lastName = lastName;
});

// Usage
const user = new User({ firstName: 'John', lastName: 'Doe' });
console.log(user.fullName);  // "John Doe"

user.fullName = 'Jane Smith';
console.log(user.firstName);  // "Jane"
```

#### Middleware (Hooks)

**Pre Hooks:**
```javascript
// Before save
userSchema.pre('save', async function(next) {
    // Hash password if modified
    if (!this.isModified('password')) return next();
    
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// Before validate
userSchema.pre('validate', function(next) {
    this.email = this.email.toLowerCase();
    next();
});

// Before remove
userSchema.pre('remove', async function(next) {
    // Delete user's posts when user is deleted
    await this.model('Post').deleteMany({ author: this._id });
    next();
});
```

**Post Hooks:**
```javascript
// After save
userSchema.post('save', function(doc, next) {
    console.log(`User ${doc.name} has been saved`);
    next();
});

// After find
userSchema.post('find', function(docs) {
    console.log(`Found ${docs.length} users`);
});

// Error handling
userSchema.post('save', function(error, doc, next) {
    if (error.name === 'MongoError' && error.code === 11000) {
        next(new Error('Email already exists'));
    } else {
        next(error);
    }
});
```

---

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

### CRUD Operations - Complete Guide

#### Create (C)

**Method 1: Using Constructor + save()**
```javascript
const user = new User({
    name: 'John Doe',
    email: 'john@example.com',
    age: 25
});

await user.save();
console.log('User created:', user._id);
```

**Method 2: Using create()**
```javascript
const user = await User.create({
    name: 'John Doe',
    email: 'john@example.com',
    age: 25
});
```

**Method 3: Insert Many (Bulk)**
```javascript
const users = await User.insertMany([
    { name: 'User 1', email: 'user1@example.com' },
    { name: 'User 2', email: 'user2@example.com' },
    { name: 'User 3', email: 'user3@example.com' }
]);

console.log(`${users.length} users created`);
```

**With Error Handling:**
```javascript
try {
    const user = await User.create({
        name: 'John',
        email: 'john@example.com'
    });
    
    console.log('User created:', user);
} catch (error) {
    if (error.name === 'ValidationError') {
        console.error('Validation failed:', error.message);
    } else if (error.code === 11000) {
        console.error('Duplicate email');
    } else {
        console.error('Error:', error);
    }
}
```

---

#### Read (R)

**Find All:**
```javascript
// All users
const users = await User.find();

// With conditions
const activeUsers = await User.find({ isActive: true });

// Multiple conditions
const users = await User.find({
    age: { $gte: 18 },
    isActive: true,
    role: 'user'
});
```

**Find One:**
```javascript
// First match
const user = await User.findOne({ email: 'john@example.com' });

// By ID
const user = await User.findById('507f1f77bcf86cd799439011');

// With conditions
const user = await User.findOne({
    age: { $gte: 18 },
    isActive: true
});
```

**Select Specific Fields:**
```javascript
// Include only name and email
const users = await User.find().select('name email');

// Exclude password
const users = await User.find().select('-password');

// Multiple ways
const users = await User.find().select({ name: 1, email: 1, _id: 0 });
```

**Sorting:**
```javascript
// Ascending order
const users = await User.find().sort('age');
const users = await User.find().sort({ age: 1 });

// Descending order
const users = await User.find().sort('-age');
const users = await User.find().sort({ age: -1 });

// Multiple fields
const users = await User.find().sort({ age: 1, name: -1 });
```

**Limiting & Skipping:**
```javascript
// Limit results
const users = await User.find().limit(10);

// Skip results (pagination)
const users = await User.find().skip(20).limit(10);

// Page 3, 10 items per page
const page = 3;
const limit = 10;
const users = await User.find()
    .skip((page - 1) * limit)
    .limit(limit);
```

**Counting:**
```javascript
// Count all
const count = await User.countDocuments();

// Count with conditions
const count = await User.countDocuments({ isActive: true });

// Estimated count (faster but less accurate)
const count = await User.estimatedDocumentCount();
```

**Exists Check:**
```javascript
const exists = await User.exists({ email: 'john@example.com' });
console.log(exists);  // { _id: '...' } or null
```

---

#### Update (U)

**Update One:**
```javascript
// Find by ID and update
const user = await User.findByIdAndUpdate(
    userId,
    { age: 26, name: 'John Updated' },
    { 
        new: true,           // Return updated document
        runValidators: true  // Run schema validators
    }
);

// Find one and update
const user = await User.findOneAndUpdate(
    { email: 'john@example.com' },
    { $set: { age: 26 } },
    { new: true }
);
```

**Update Many:**
```javascript
// Update all matching documents
const result = await User.updateMany(
    { isActive: false },
    { $set: { status: 'inactive' } }
);

console.log(`${result.modifiedCount} users updated`);
```

**Update with Operators:**
```javascript
// Increment age by 1
await User.findByIdAndUpdate(userId, { $inc: { age: 1 } });

// Add to array
await User.findByIdAndUpdate(userId, { $push: { tags: 'new-tag' } });

// Remove from array
await User.findByIdAndUpdate(userId, { $pull: { tags: 'old-tag' } });

// Add to array (if not exists)
await User.findByIdAndUpdate(userId, { $addToSet: { tags: 'unique-tag' } });

// Set minimum value
await User.findByIdAndUpdate(userId, { $min: { age: 18 } });

// Set maximum value
await User.findByIdAndUpdate(userId, { $max: { age: 100 } });

// Multiply
await User.findByIdAndUpdate(userId, { $mul: { price: 1.1 } });

// Rename field
await User.updateMany({}, { $rename: { 'oldName': 'newName' } });

// Unset (remove field)
await User.findByIdAndUpdate(userId, { $unset: { tempField: 1 } });
```

**Update or Insert (Upsert):**
```javascript
const user = await User.findOneAndUpdate(
    { email: 'john@example.com' },
    { $set: { name: 'John', age: 25 } },
    { 
        upsert: true,    // Create if doesn't exist
        new: true 
    }
);
```

**Update with Custom Logic:**
```javascript
const user = await User.findById(userId);
user.age += 1;
user.lastModified = Date.now();
await user.save();  // Triggers pre/post save hooks
```

---

#### Delete (D)

**Delete One:**
```javascript
// Find by ID and delete
const user = await User.findByIdAndDelete(userId);
console.log('Deleted user:', user);

// Find one and delete
const user = await User.findOneAndDelete({ email: 'john@example.com' });
```

**Delete Many:**
```javascript
// Delete all matching
const result = await User.deleteMany({ isActive: false });
console.log(`${result.deletedCount} users deleted`);

// Delete all (dangerous!)
const result = await User.deleteMany({});
```

**Delete with Middleware (Recommended):**
```javascript
const user = await User.findById(userId);
await user.remove();  // Triggers pre/post remove hooks
```

---

### Advanced Queries

#### Comparison Operators

```javascript
// Greater than ($gt, $gte)
const users = await User.find({ age: { $gt: 18 } });
const users = await User.find({ age: { $gte: 18 } });

// Less than ($lt, $lte)
const users = await User.find({ age: { $lt: 60 } });
const users = await User.find({ age: { $lte: 60 } });

// Not equal ($ne)
const users = await User.find({ role: { $ne: 'admin' } });

// In array ($in)
const users = await User.find({ role: { $in: ['admin', 'moderator'] } });

// Not in array ($nin)
const users = await User.find({ role: { $nin: ['banned', 'suspended'] } });

// Range
const users = await User.find({ 
    age: { $gte: 18, $lte: 60 } 
});
```

#### Logical Operators

```javascript
// AND (implicit)
const users = await User.find({
    age: { $gte: 18 },
    isActive: true
});

// AND (explicit)
const users = await User.find({
    $and: [
        { age: { $gte: 18 } },
        { isActive: true }
    ]
});

// OR
const users = await User.find({
    $or: [
        { role: 'admin' },
        { role: 'moderator' }
    ]
});

// NOT
const users = await User.find({
    age: { $not: { $lt: 18 } }
});

// NOR
const users = await User.find({
    $nor: [
        { role: 'admin' },
        { isActive: false }
    ]
});

// Complex combination
const users = await User.find({
    $and: [
        { age: { $gte: 18 } },
        {
            $or: [
                { role: 'admin' },
                { isPremium: true }
            ]
        }
    ]
});
```

#### Element Operators

```javascript
// Field exists
const users = await User.find({ phone: { $exists: true } });

// Type check
const users = await User.find({ age: { $type: 'number' } });
```

#### Array Operators

```javascript
// Array contains all
const users = await User.find({ 
    tags: { $all: ['nodejs', 'mongodb'] } 
});

// Array size
const users = await User.find({ 
    tags: { $size: 3 } 
});

// Element match
const users = await User.find({
    orders: {
        $elemMatch: { status: 'pending', amount: { $gt: 100 } }
    }
});
```

#### String Operators (Regex)

```javascript
// Contains (case-sensitive)
const users = await User.find({ 
    name: /john/ 
});

// Contains (case-insensitive)
const users = await User.find({ 
    name: { $regex: 'john', $options: 'i' } 
});

// Starts with
const users = await User.find({ 
    name: /^john/i 
});

// Ends with
const users = await User.find({ 
    name: /son$/i 
});
```

#### Query Chaining

```javascript
const users = await User
    .find({ isActive: true })
    .where('age').gte(18).lte(60)
    .where('role').in(['user', 'premium'])
    .select('name email age')
    .sort('-createdAt')
    .limit(20)
    .skip(0)
    .exec();
```

#### Pagination Helper

```javascript
async function paginate(page = 1, limit = 10, filters = {}) {
    const skip = (page - 1) * limit;
    
    const [users, total] = await Promise.all([
        User.find(filters)
            .select('-password')
            .sort('-createdAt')
            .skip(skip)
            .limit(limit),
        User.countDocuments(filters)
    ]);
    
    return {
        users,
        pagination: {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit),
            hasNext: page * limit < total,
            hasPrev: page > 1
        }
    };
}

// Usage
const result = await paginate(2, 10, { isActive: true });
```

---

### Relationships & Population - Complete Guide

MongoDB তে relationships SQL এর মতো built-in না, তবে references এবং embedding দিয়ে implement করা যায়।

#### Relationship Types

**1. One-to-One (1:1)**
```javascript
// User has one Profile
const userSchema = new Schema({
    name: String,
    email: String,
    profile: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Profile'
    }
});

const profileSchema = new Schema({
    bio: String,
    avatar: String,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});
```

**2. One-to-Many (1:N)**
```javascript
// User has many Posts
const userSchema = new Schema({
    name: String,
    email: String
});

const postSchema = new Schema({
    title: String,
    content: String,
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});
```

**3. Many-to-Many (M:N)**
```javascript
// Student enrolls in many Courses, Course has many Students
const studentSchema = new Schema({
    name: String,
    courses: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course'
    }]
});

const courseSchema = new Schema({
    title: String,
    students: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student'
    }]
});
```

---

#### Population (Join-like operation)

**Basic Population:**
```javascript
// Create post with author reference
const post = await Post.create({
    title: 'My Post',
    content: 'Content here',
    author: userId  // Just store the ID
});

// Populate author details
const posts = await Post.find().populate('author');

// Result:
// {
//     _id: '...',
//     title: 'My Post',
//     author: {
//         _id: '...',
//         name: 'John Doe',
//         email: 'john@example.com'
//     }
// }
```

**Select Specific Fields:**
```javascript
// Populate only name and email
const posts = await Post.find().populate('author', 'name email');

// Exclude _id
const posts = await Post.find().populate('author', 'name email -_id');
```

**Multiple Population:**
```javascript
const posts = await Post.find()
    .populate('author', 'name email')
    .populate('category', 'name')
    .populate('comments');
```

**Nested Population:**
```javascript
const posts = await Post.find().populate({
    path: 'comments',
    populate: {
        path: 'author',
        select: 'name avatar'
    }
});

// Result: Post → Comments → Author
```

**Conditional Population:**
```javascript
const posts = await Post.find().populate({
    path: 'author',
    match: { isActive: true },  // Only populate if active
    select: 'name email'
});
```

**Populate with Options:**
```javascript
const posts = await Post.find().populate({
    path: 'comments',
    options: {
        sort: { createdAt: -1 },
        limit: 10
    }
});
```

**Deep Population:**
```javascript
const posts = await Post.find().populate({
    path: 'author',
    populate: {
        path: 'profile',
        populate: {
            path: 'address'
        }
    }
});

// Post → Author → Profile → Address (3 levels deep)
```

---

#### Virtual Populate (Reverse Population)

```javascript
// User schema
const userSchema = new Schema({
    name: String,
    email: String
});

// Virtual field (not stored in DB)
userSchema.virtual('posts', {
    ref: 'Post',
    localField: '_id',
    foreignField: 'author'
});

// Enable virtuals in JSON
userSchema.set('toJSON', { virtuals: true });
userSchema.set('toObject', { virtuals: true });

// Usage
const user = await User.findById(userId).populate('posts');

// Result:
// {
//     _id: '...',
//     name: 'John',
//     posts: [
//         { title: 'Post 1', ... },
//         { title: 'Post 2', ... }
//     ]
// }
```

---

#### Embedding vs Referencing

**Embedding (Denormalization):**
```javascript
// Good for: Data that's always accessed together
const userSchema = new Schema({
    name: String,
    email: String,
    address: {              // Embedded
        street: String,
        city: String,
        country: String
    },
    tags: [String]         // Embedded array
});

// Pros: Fast reads (single query), atomicity
// Cons: Data duplication, document size limit (16MB)
```

**Referencing (Normalization):**
```javascript
// Good for: Large or shared data
const userSchema = new Schema({
    name: String,
    email: String,
    posts: [{              // Referenced
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post'
    }]
});

// Pros: No duplication, smaller documents
// Cons: Multiple queries, no atomicity
```

**Decision Guide:**
```
Use Embedding when:
✅ Data is small
✅ Data doesn't change often
✅ Data is always accessed together
✅ Need atomic operations
✅ 1-to-1 or 1-to-few relationships

Use Referencing when:
✅ Data is large
✅ Data changes frequently
✅ Data is shared across documents
✅ Need to query independently
✅ 1-to-many or many-to-many relationships
```

---

#### Real-World Example: Blog System

```javascript
// User Model
const userSchema = new Schema({
    name: String,
    email: { type: String, unique: true },
    avatar: String,
    role: { type: String, enum: ['user', 'admin'], default: 'user' }
}, { timestamps: true });

// Virtual: User's posts
userSchema.virtual('posts', {
    ref: 'Post',
    localField: '_id',
    foreignField: 'author'
});

const User = mongoose.model('User', userSchema);

// Category Model
const categorySchema = new Schema({
    name: { type: String, unique: true },
    slug: String,
    description: String
}, { timestamps: true });

const Category = mongoose.model('Category', categorySchema);

// Post Model
const postSchema = new Schema({
    title: { type: String, required: true },
    slug: String,
    content: String,
    excerpt: String,
    
    // References
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    },
    
    // Embedded
    tags: [String],
    
    // Stats (embedded)
    stats: {
        views: { type: Number, default: 0 },
        likes: { type: Number, default: 0 }
    },
    
    status: {
        type: String,
        enum: ['draft', 'published'],
        default: 'draft'
    }
}, { timestamps: true });

// Virtual: Post's comments
postSchema.virtual('comments', {
    ref: 'Comment',
    localField: '_id',
    foreignField: 'post'
});

const Post = mongoose.model('Post', postSchema);

// Comment Model
const commentSchema = new Schema({
    content: { type: String, required: true },
    
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
        required: true
    },
    
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    
    parent: {  // For nested comments
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
    }
}, { timestamps: true });

const Comment = mongoose.model('Comment', commentSchema);

// Usage Examples:

// 1. Get all posts with author and category
const posts = await Post.find()
    .populate('author', 'name avatar')
    .populate('category', 'name')
    .sort('-createdAt');

// 2. Get single post with comments and their authors
const post = await Post.findOne({ slug: 'my-post' })
    .populate('author', 'name avatar email')
    .populate('category')
    .populate({
        path: 'comments',
        populate: {
            path: 'author',
            select: 'name avatar'
        },
        options: { sort: { createdAt: -1 } }
    });

// 3. Get user with all their posts
const user = await User.findById(userId)
    .populate({
        path: 'posts',
        match: { status: 'published' },
        options: { sort: { createdAt: -1 }, limit: 10 }
    });

// 4. Create post with relationships
const post = await Post.create({
    title: 'My New Post',
    content: 'Content here',
    author: userId,
    category: categoryId,
    tags: ['nodejs', 'mongodb']
});

// 5. Add comment to post
const comment = await Comment.create({
    content: 'Great post!',
    post: postId,
    author: userId
});

// 6. Get comments for a post
const comments = await Comment.find({ post: postId })
    .populate('author', 'name avatar')
    .sort('-createdAt');
```

### Aggregation Pipeline - Advanced Data Processing

Aggregation framework allows complex data processing and analysis.

#### Basic Aggregation

```javascript
// $match - Filter documents
const results = await User.aggregate([
    { $match: { isActive: true } }
]);

// $group - Group by field
const results = await User.aggregate([
    {
        $group: {
            _id: '$role',
            count: { $sum: 1 },
            avgAge: { $avg: '$age' }
        }
    }
]);

// $sort - Sort results
const results = await User.aggregate([
    { $sort: { createdAt: -1 } }
]);

// $limit & $skip - Pagination
const results = await User.aggregate([
    { $skip: 10 },
    { $limit: 5 }
]);

// $project - Select fields
const results = await User.aggregate([
    {
        $project: {
            name: 1,
            email: 1,
            age: 1,
            _id: 0
        }
    }
]);
```

#### Advanced Aggregation

```javascript
// Complete example: User statistics by role
const stats = await User.aggregate([
    // Stage 1: Filter active users
    { $match: { isActive: true } },
    
    // Stage 2: Group by role
    {
        $group: {
            _id: '$role',
            count: { $sum: 1 },
            avgAge: { $avg: '$age' },
            minAge: { $min: '$age' },
            maxAge: { $max: '$age' },
            users: { $push: '$name' }
        }
    },
    
    // Stage 3: Sort by count
    { $sort: { count: -1 } },
    
    // Stage 4: Project (rename fields)
    {
        $project: {
            role: '$_id',
            totalUsers: '$count',
            averageAge: '$avgAge',
            _id: 0
        }
    }
]);

// Result:
// [
//   { role: 'user', totalUsers: 150, averageAge: 32.5 },
//   { role: 'admin', totalUsers: 5, averageAge: 35.2 }
// ]
```

#### Aggregation Operators

```javascript
// $lookup - Join collections (like SQL JOIN)
const orders = await Order.aggregate([
    {
        $lookup: {
            from: 'users',           // Collection to join
            localField: 'userId',     // Field from Order
            foreignField: '_id',      // Field from User
            as: 'user'               // Output array field
        }
    },
    { $unwind: '$user' }  // Convert array to object
]);

// $unwind - Deconstruct array
const posts = await Post.aggregate([
    { $unwind: '$tags' },  // One document per tag
    {
        $group: {
            _id: '$tags',
            count: { $sum: 1 }
        }
    }
]);

// $addFields - Add computed fields
const users = await User.aggregate([
    {
        $addFields: {
            fullName: { $concat: ['$firstName', ' ', '$lastName'] },
            isAdult: { $gte: ['$age', 18] }
        }
    }
]);

// $facet - Multiple pipelines
const results = await Product.aggregate([
    {
        $facet: {
            byCategory: [
                { $group: { _id: '$category', count: { $sum: 1 } } }
            ],
            priceRange: [
                {
                    $bucket: {
                        groupBy: '$price',
                        boundaries: [0, 100, 500, 1000],
                        default: '1000+',
                        output: { count: { $sum: 1 } }
                    }
                }
            ],
            avgPrice: [
                { $group: { _id: null, avg: { $avg: '$price' } } }
            ]
        }
    }
]);
```

#### Real-World Example: Analytics

```javascript
// Monthly sales report
const monthlySales = await Order.aggregate([
    // Filter this year
    {
        $match: {
            createdAt: { $gte: new Date('2026-01-01') },
            status: 'completed'
        }
    },
    
    // Group by month
    {
        $group: {
            _id: {
                year: { $year: '$createdAt' },
                month: { $month: '$createdAt' }
            },
            totalSales: { $sum: '$amount' },
            totalOrders: { $sum: 1 },
            avgOrderValue: { $avg: '$amount' }
        }
    },
    
    // Sort by date
    { $sort: { '_id.year': 1, '_id.month': 1 } },
    
    // Format output
    {
        $project: {
            month: {
                $concat: [
                    { $toString: '$_id.year' },
                    '-',
                    { $toString: '$_id.month' }
                ]
            },
            totalSales: { $round: ['$totalSales', 2] },
            totalOrders: 1,
            avgOrderValue: { $round: ['$avgOrderValue', 2] },
            _id: 0
        }
    }
]);
```

---

### Transactions - ACID Compliance

MongoDB 4.0+ supports multi-document transactions.

#### Basic Transaction

```javascript
const session = await mongoose.startSession();
session.startTransaction();

try {
    // Operation 1: Deduct from sender
    await Account.findByIdAndUpdate(
        senderId,
        { $inc: { balance: -amount } },
        { session }
    );
    
    // Operation 2: Add to receiver
    await Account.findByIdAndUpdate(
        receiverId,
        { $inc: { balance: amount } },
        { session }
    );
    
    // Commit transaction
    await session.commitTransaction();
    console.log('Transaction successful');
} catch (error) {
    // Rollback transaction
    await session.abortTransaction();
    console.error('Transaction failed:', error);
    throw error;
} finally {
    session.endSession();
}
```

#### Transaction with Multiple Operations

```javascript
async function transferMoney(senderId, receiverId, amount) {
    const session = await mongoose.startSession();
    
    try {
        await session.withTransaction(async () => {
            // Check sender balance
            const sender = await Account.findById(senderId).session(session);
            
            if (sender.balance < amount) {
                throw new Error('Insufficient balance');
            }
            
            // Deduct from sender
            sender.balance -= amount;
            await sender.save({ session });
            
            // Add to receiver
            const receiver = await Account.findById(receiverId).session(session);
            receiver.balance += amount;
            await receiver.save({ session });
            
            // Log transaction
            await Transaction.create([{
                from: senderId,
                to: receiverId,
                amount: amount,
                timestamp: new Date()
            }], { session });
        });
        
        console.log('Transfer successful');
    } catch (error) {
        console.error('Transfer failed:', error);
        throw error;
    } finally {
        session.endSession();
    }
}
```

---

### Indexing - Performance Optimization

Indexes dramatically improve query performance.

#### Create Indexes

```javascript
// Single field index
userSchema.index({ email: 1 });  // Ascending
userSchema.index({ createdAt: -1 });  // Descending

// Compound index (multiple fields)
userSchema.index({ age: 1, name: 1 });

// Unique index
userSchema.index({ email: 1 }, { unique: true });

// Text index (full-text search)
postSchema.index({ title: 'text', content: 'text' });

// Sparse index (only indexed documents with the field)
userSchema.index({ phone: 1 }, { sparse: true });

// TTL index (auto-delete after time)
sessionSchema.index({ createdAt: 1 }, { expireAfterSeconds: 3600 });

// Partial index (conditional)
userSchema.index(
    { email: 1 },
    { partialFilterExpression: { isActive: true } }
);
```

#### Using Indexes

```javascript
// Text search
const posts = await Post.find({ $text: { $search: 'nodejs mongodb' } })
    .select({ score: { $meta: 'textScore' } })
    .sort({ score: { $meta: 'textScore' } });

// Compound index query (uses index)
const users = await User.find({ age: 25, name: 'John' });

// Query that doesn't use index (slow!)
const users = await User.find({ age: { $gte: 18 } }).sort({ email: 1 });
// age is indexed but email is not in same compound index
```

#### Index Management

```javascript
// List all indexes
const indexes = await User.collection.getIndexes();

// Drop index
await User.collection.dropIndex('email_1');

// Explain query (check if index is used)
const explain = await User.find({ email: 'john@example.com' }).explain();

console.log(explain.executionStats);
// Look for: "IXSCAN" (index scan) vs "COLLSCAN" (collection scan)
```

#### Index Best Practices

```javascript
// ✅ Good: Query uses index
User.find({ email: 'john@example.com' });  // email is indexed

// ✅ Good: Compound index for common queries
userSchema.index({ country: 1, city: 1, age: -1 });
User.find({ country: 'BD', city: 'Dhaka', age: { $gte: 18 } });

// ❌ Bad: Sort field not in index (slow!)
User.find({ age: 25 }).sort({ createdAt: -1 });
// Solution: Create compound index { age: 1, createdAt: -1 }

// ❌ Bad: Too many indexes (slow writes)
// Each index slows down inserts/updates
// Only create indexes for frequently queried fields
```

---

### Performance Optimization

#### 1. Use Lean Queries (Faster)

```javascript
// Normal query (returns Mongoose documents)
const users = await User.find();  // Slow, includes Mongoose features

// Lean query (returns plain JavaScript objects)
const users = await User.find().lean();  // 5-10x faster!

// Use lean() when you don't need:
// - Virtual properties
// - Getters/setters
// - save() method
// - Mongoose features
```

#### 2. Select Only Needed Fields

```javascript
// ❌ Bad: Fetches all fields
const users = await User.find();

// ✅ Good: Only fetch needed fields
const users = await User.find().select('name email');
```

#### 3. Limit Results

```javascript
// ❌ Bad: Fetches all documents
const users = await User.find();

// ✅ Good: Limit results
const users = await User.find().limit(100);
```

#### 4. Use Indexes

```javascript
// ❌ Bad: No index on email (COLLSCAN)
const user = await User.findOne({ email: 'john@example.com' });

// ✅ Good: Create index
userSchema.index({ email: 1 });
// Now uses IXSCAN (much faster!)
```

#### 5. Avoid N+1 Queries

```javascript
// ❌ Bad: N+1 queries
const posts = await Post.find();
for (const post of posts) {
    post.author = await User.findById(post.author);  // N queries!
}

// ✅ Good: Use populate (1 query)
const posts = await Post.find().populate('author');
```

#### 6. Batch Operations

```javascript
// ❌ Bad: Multiple queries
for (const userData of users) {
    await User.create(userData);
}

// ✅ Good: Single batch operation
await User.insertMany(users);
```

#### 7. Connection Pooling

```javascript
mongoose.connect(uri, {
    maxPoolSize: 10,  // Max concurrent connections
    minPoolSize: 5    // Min connections maintained
});
```

#### 8. Query Optimization

```javascript
// Use explain() to analyze queries
const explain = await User.find({ age: 25 }).explain('executionStats');

console.log('Execution time:', explain.executionStats.executionTimeMillis);
console.log('Documents examined:', explain.executionStats.totalDocsExamined);
console.log('Documents returned:', explain.executionStats.nReturned);

// Ideal: totalDocsExamined === nReturned (perfect index usage)
```

---

## ২. PostgreSQL/MySQL & Sequelize (Relational)

**Sequelize** = Powerful ORM for SQL databases (PostgreSQL, MySQL, SQLite, MSSQL)

### Why Use Sequelize?

```
Without ORM (Raw SQL):
- Write SQL queries manually
- Manual data mapping
- Database-specific syntax
- SQL injection risks
- Complex migrations

With Sequelize:
✅ JavaScript-based queries
✅ Automatic data mapping
✅ Database-agnostic code
✅ Built-in SQL injection protection
✅ Migration management
✅ Validation & hooks
✅ Associations (relationships)
```

---

### Installation & Setup

#### Install Sequelize

```bash
# Core package
npm install sequelize

# Database drivers (choose one)
npm install pg pg-hstore          # PostgreSQL
npm install mysql2                # MySQL
npm install sqlite3               # SQLite
npm install tedious              # Microsoft SQL Server
```

#### Basic Connection

```javascript
const { Sequelize } = require('sequelize');

// PostgreSQL
const sequelize = new Sequelize('database', 'username', 'password', {
    host: 'localhost',
    dialect: 'postgres',
    port: 5432
});

// MySQL
const sequelize = new Sequelize('database', 'username', 'password', {
    host: 'localhost',
    dialect: 'mysql',
    port: 3306
});

// SQLite (file-based)
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'database.sqlite'
});

// Test connection
try {
    await sequelize.authenticate();
    console.log('Database connected ✅');
} catch (error) {
    console.error('Connection failed ❌', error);
}
```

#### Connection with Options

```javascript
const sequelize = new Sequelize('database', 'username', 'password', {
    host: 'localhost',
    dialect: 'postgres',
    
    // Connection pool
    pool: {
        max: 10,           // Maximum connections
        min: 0,            // Minimum connections
        acquire: 30000,    // Max time to get connection (ms)
        idle: 10000        // Max idle time (ms)
    },
    
    // Logging
    logging: console.log,  // Log all SQL queries
    // logging: false,     // Disable logging
    
    // Timezone
    timezone: '+06:00',
    
    // Define options for all models
    define: {
        timestamps: true,       // createdAt, updatedAt
        underscored: true,      // Use snake_case (created_at)
        freezeTableName: true   // Don't pluralize table names
    }
});
```

#### Environment-based Connection

```javascript
// .env
DATABASE_URL=postgres://user:pass@localhost:5432/dbname

// config/database.js
require('dotenv').config();

const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    logging: process.env.NODE_ENV === 'development'
});

module.exports = sequelize;
```

---

### Model Definition

#### Basic Model

```javascript
const { DataTypes } = require('sequelize');

const User = sequelize.define('User', {
    // Primary key (auto-created if not defined)
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    
    email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    
    age: {
        type: DataTypes.INTEGER
    },
    
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
}, {
    tableName: 'users',      // Custom table name
    timestamps: true          // createdAt, updatedAt
});
```

#### All Data Types

```javascript
const Product = sequelize.define('Product', {
    // String types
    name: DataTypes.STRING,              // VARCHAR(255)
    description: DataTypes.TEXT,         // TEXT
    shortDesc: DataTypes.STRING(100),    // VARCHAR(100)
    
    // Number types
    quantity: DataTypes.INTEGER,         // INTEGER
    price: DataTypes.DECIMAL(10, 2),     // DECIMAL(10,2)
    rating: DataTypes.FLOAT,             // FLOAT
    views: DataTypes.BIGINT,             // BIGINT
    
    // Boolean
    isAvailable: DataTypes.BOOLEAN,      // BOOLEAN
    
    // Date types
    releaseDate: DataTypes.DATE,         // DATETIME
    dateOnly: DataTypes.DATEONLY,        // DATE (no time)
    
    // JSON
    metadata: DataTypes.JSON,            // JSON
    specs: DataTypes.JSONB,              // JSONB (PostgreSQL only, faster)
    
    // Enum
    status: DataTypes.ENUM('active', 'inactive', 'pending'),
    
    // UUID
    uuid: DataTypes.UUID,
    
    // Binary
    image: DataTypes.BLOB,
    
    // Array (PostgreSQL only)
    tags: DataTypes.ARRAY(DataTypes.STRING)
});
```

#### Validation

```javascript
const User = sequelize.define('User', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: { msg: 'Name is required' },
            notEmpty: { msg: 'Name cannot be empty' },
            len: {
                args: [3, 50],
                msg: 'Name must be 3-50 characters'
            }
        }
    },
    
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: { msg: 'Invalid email format' }
        }
    },
    
    age: {
        type: DataTypes.INTEGER,
        validate: {
            min: { args: 18, msg: 'Must be 18+' },
            max: { args: 120, msg: 'Invalid age' },
            isInt: { msg: 'Age must be integer' }
        }
    },
    
    website: {
        type: DataTypes.STRING,
        validate: {
            isUrl: { msg: 'Invalid URL' }
        }
    },
    
    password: {
        type: DataTypes.STRING,
        validate: {
            is: {
                args: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
                msg: 'Password too weak'
            }
        }
    }
});
```

#### Custom Validation

```javascript
const User = sequelize.define('User', {
    password: {
        type: DataTypes.STRING,
        validate: {
            isStrongPassword(value) {
                if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(value)) {
                    throw new Error('Password too weak');
                }
            }
        }
    },
    
    email: {
        type: DataTypes.STRING,
        validate: {
            async isUnique(value) {
                const user = await User.findOne({ where: { email: value } });
                if (user) {
                    throw new Error('Email already exists');
                }
            }
        }
    }
});
```

---

### CRUD Operations - Complete Guide

#### Create (C)

```javascript
// Method 1: create()
const user = await User.create({
    name: 'John Doe',
    email: 'john@example.com',
    age: 25
});

// Method 2: build() + save()
const user = User.build({
    name: 'John Doe',
    email: 'john@example.com'
});
await user.save();

// Bulk create
const users = await User.bulkCreate([
    { name: 'User 1', email: 'user1@example.com' },
    { name: 'User 2', email: 'user2@example.com' },
    { name: 'User 3', email: 'user3@example.com' }
], {
    validate: true,  // Run validations
    ignoreDuplicates: true  // Skip duplicates
});
```

#### Read (R)

```javascript
// Find all
const users = await User.findAll();

// Find with conditions
const users = await User.findAll({
    where: {
        isActive: true,
        age: { [Op.gte]: 18 }
    }
});

// Find one
const user = await User.findOne({
    where: { email: 'john@example.com' }
});

// Find by primary key
const user = await User.findByPk(1);

// Find or create
const [user, created] = await User.findOrCreate({
    where: { email: 'john@example.com' },
    defaults: { name: 'John', age: 25 }
});

// Count
const count = await User.count({
    where: { isActive: true }
});

// Exists
const exists = await User.findOne({
    where: { email: 'john@example.com' }
}) !== null;
```

**Select Specific Fields:**
```javascript
// Include only
const users = await User.findAll({
    attributes: ['id', 'name', 'email']
});

// Exclude fields
const users = await User.findAll({
    attributes: { exclude: ['password', 'createdAt'] }
});

// With alias
const users = await User.findAll({
    attributes: [
        'id',
        'name',
        ['email', 'emailAddress']  // Alias
    ]
});

// With aggregation
const users = await User.findAll({
    attributes: [
        'role',
        [sequelize.fn('COUNT', sequelize.col('id')), 'userCount']
    ],
    group: ['role']
});
```

**Where Operators:**
```javascript
const { Op } = require('sequelize');

// Comparison
const users = await User.findAll({
    where: {
        age: { [Op.gt]: 18 },        // >
        age: { [Op.gte]: 18 },       // >=
        age: { [Op.lt]: 60 },        // <
        age: { [Op.lte]: 60 },       // <=
        age: { [Op.ne]: 25 },        // !=
        age: { [Op.between]: [18, 60] },
        age: { [Op.notBetween]: [0, 18] }
    }
});

// In/Not In
const users = await User.findAll({
    where: {
        role: { [Op.in]: ['admin', 'moderator'] },
        status: { [Op.notIn]: ['banned', 'suspended'] }
    }
});

// String operations
const users = await User.findAll({
    where: {
        name: { [Op.like]: '%John%' },         // LIKE
        name: { [Op.notLike]: '%Admin%' },
        name: { [Op.iLike]: '%john%' },        // Case-insensitive (PostgreSQL)
        name: { [Op.startsWith]: 'John' },
        name: { [Op.endsWith]: 'Doe' },
        name: { [Op.substring]: 'oh' }
    }
});

// Logical operators
const users = await User.findAll({
    where: {
        [Op.and]: [
            { age: { [Op.gte]: 18 } },
            { isActive: true }
        ]
    }
});

const users = await User.findAll({
    where: {
        [Op.or]: [
            { role: 'admin' },
            { isPremium: true }
        ]
    }
});

// NULL checks
const users = await User.findAll({
    where: {
        deletedAt: { [Op.is]: null },
        phone: { [Op.not]: null }
    }
});
```

**Ordering & Pagination:**
```javascript
// Order
const users = await User.findAll({
    order: [
        ['age', 'ASC'],
        ['name', 'DESC']
    ]
});

// Pagination
const users = await User.findAll({
    limit: 10,
    offset: 20  // Skip 20
});

// Pagination helper
async function paginate(page = 1, limit = 10) {
    const offset = (page - 1) * limit;
    
    const { count, rows } = await User.findAndCountAll({
        limit,
        offset,
        where: { isActive: true }
    });
    
    return {
        users: rows,
        totalUsers: count,
        totalPages: Math.ceil(count / limit),
        currentPage: page
    };
}
```

#### Update (U)

```javascript
// Update instance
const user = await User.findByPk(1);
user.name = 'John Updated';
user.age = 26;
await user.save();

// Update with findOne + save
const user = await User.findOne({ where: { email: 'john@example.com' } });
if (user) {
    await user.update({ name: 'John Updated', age: 26 });
}

// Direct update (returns affected count)
const [affectedCount] = await User.update(
    { isActive: false },
    { where: { id: 1 } }
);

// Update multiple
await User.update(
    { status: 'inactive' },
    { where: { lastLogin: { [Op.lt]: new Date('2025-01-01') } } }
);

// Increment/Decrement
await User.increment('views', { by: 1, where: { id: 1 } });
await User.decrement('stock', { by: 5, where: { id: productId } });
```

#### Delete (D)

```javascript
// Delete instance
const user = await User.findByPk(1);
await user.destroy();

// Direct delete (returns affected count)
const deletedCount = await User.destroy({
    where: { id: 1 }
});

// Delete multiple
await User.destroy({
    where: { isActive: false }
});

// Soft delete (if paranoid: true)
const User = sequelize.define('User', { ... }, {
    paranoid: true  // Adds deletedAt column
});

await user.destroy();  // Sets deletedAt
await user.restore();  // Unsets deletedAt

// Permanent delete (even with paranoid)
await user.destroy({ force: true });
```

---

### Associations (Relationships)

#### One-to-One

```javascript
// User has one Profile
User.hasOne(Profile, { foreignKey: 'userId' });
Profile.belongsTo(User, { foreignKey: 'userId' });

// Create
const user = await User.create({ name: 'John' });
const profile = await Profile.create({
    bio: 'Developer',
    userId: user.id
});

// Query with association
const user = await User.findByPk(1, {
    include: Profile
});

console.log(user.Profile);
```

#### One-to-Many

```javascript
// User has many Posts
User.hasMany(Post, { foreignKey: 'authorId' });
Post.belongsTo(User, { foreignKey: 'authorId' });

// Create
const user = await User.create({ name: 'John' });
const post = await Post.create({
    title: 'My Post',
    authorId: user.id
});

// Or use association methods
const post = await user.createPost({ title: 'My Post' });

// Query
const user = await User.findByPk(1, {
    include: Post
});

console.log(user.Posts);  // Array of posts
```

#### Many-to-Many

```javascript
// Student enrolls in many Courses
Student.belongsToMany(Course, { through: 'Enrollments' });
Course.belongsToMany(Student, { through: 'Enrollments' });

// Create
const student = await Student.create({ name: 'John' });
const course = await Course.create({ title: 'Node.js' });

await student.addCourse(course);

// Query
const student = await Student.findByPk(1, {
    include: Course
});

console.log(student.Courses);
```

#### Nested Includes

```javascript
const user = await User.findByPk(1, {
    include: [{
        model: Post,
        include: [{
            model: Comment,
            include: [User]
        }]
    }]
});

// User → Posts → Comments → User
```

---

### Transactions (Sequelize)

```javascript
// Managed transaction (automatic commit/rollback)
try {
    const result = await sequelize.transaction(async (t) => {
        // All queries must use { transaction: t }
        
        // Deduct from sender
        await Account.update(
            { balance: sequelize.literal('balance - ' + amount) },
            { where: { id: senderId }, transaction: t }
        );
        
        // Add to receiver
        await Account.update(
            { balance: sequelize.literal('balance + ' + amount) },
            { where: { id: receiverId }, transaction: t }
        );
        
        // Log transaction
        await Transaction.create({
            from: senderId,
            to: receiverId,
            amount
        }, { transaction: t });
        
        return { success: true };
    });
    
    console.log('Transaction successful');
} catch (error) {
    console.error('Transaction failed (rolled back)', error);
}

// Manual transaction
const t = await sequelize.transaction();

try {
    await User.update({ balance: 100 }, { where: { id: 1 }, transaction: t });
    await User.update({ balance: 200 }, { where: { id: 2 }, transaction: t });
    
    await t.commit();
} catch (error) {
    await t.rollback();
}
```

---

### Migrations - Database Version Control

#### Setup Sequelize CLI

```bash
npm install --save-dev sequelize-cli

# Initialize
npx sequelize-cli init

# Creates:
# - config/config.json (database config)
# - models/ (models directory)
# - migrations/ (migration files)
# - seeders/ (seed files)
```

#### Create Migration

```bash
# Create migration file
npx sequelize-cli migration:generate --name create-users-table
```

#### Migration File

```javascript
// migrations/20260117000000-create-users-table.js
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('users', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            name: {
                type: Sequelize.STRING,
                allowNull: false
            },
            email: {
                type: Sequelize.STRING,
                unique: true,
                allowNull: false
            },
            age: {
                type: Sequelize.INTEGER
            },
            createdAt: {
                type: Sequelize.DATE,
                allowNull: false
            },
            updatedAt: {
                type: Sequelize.DATE,
                allowNull: false
            }
        });
        
        // Add index
        await queryInterface.addIndex('users', ['email']);
    },
    
    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('users');
    }
};
```

#### Run Migrations

```bash
# Run all pending migrations
npx sequelize-cli db:migrate

# Undo last migration
npx sequelize-cli db:migrate:undo

# Undo all migrations
npx sequelize-cli db:migrate:undo:all
```

#### Add Column Migration

```javascript
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.addColumn('users', 'phone', {
            type: Sequelize.STRING
        });
    },
    
    down: async (queryInterface, Sequelize) => {
        await queryInterface.removeColumn('users', 'phone');
    }
};
```

---

### Seeders - Sample Data

```bash
# Create seeder
npx sequelize-cli seed:generate --name demo-users
```

```javascript
// seeders/20260117000000-demo-users.js
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.bulkInsert('users', [
            {
                name: 'John Doe',
                email: 'john@example.com',
                age: 25,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'Jane Smith',
                email: 'jane@example.com',
                age: 30,
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ]);
    },
    
    down: async (queryInterface, Sequelize) => {
        await queryInterface.bulkDelete('users', null, {});
    }
};
```

```bash
# Run seeders
npx sequelize-cli db:seed:all

# Undo seeders
npx sequelize-cli db:seed:undo:all
```

---

### Raw SQL Queries

#### Sequelize Raw Queries

```javascript
// Simple query
const [results, metadata] = await sequelize.query(
    'SELECT * FROM users WHERE age > :age',
    {
        replacements: { age: 18 },
        type: QueryTypes.SELECT
    }
);

// Insert
await sequelize.query(
    'INSERT INTO users (name, email) VALUES (:name, :email)',
    {
        replacements: { name: 'John', email: 'john@example.com' }
    }
);

// Using literal in Sequelize query
const users = await User.findAll({
    where: sequelize.literal('age > 18 AND isActive = true')
});
```

#### Native Database Drivers

**PostgreSQL (pg):**
```javascript
const { Pool } = require('pg');

const pool = new Pool({
    host: 'localhost',
    user: 'user',
    password: 'pass',
    database: 'mydb',
    port: 5432,
    max: 20  // Connection pool size
});

// Query
const result = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);
console.log(result.rows);

// Transaction
const client = await pool.connect();
try {
    await client.query('BEGIN');
    await client.query('UPDATE accounts SET balance = balance - $1 WHERE id = $2', [100, senderId]);
    await client.query('UPDATE accounts SET balance = balance + $1 WHERE id = $2', [100, receiverId]);
    await client.query('COMMIT');
} catch (e) {
    await client.query('ROLLBACK');
    throw e;
} finally {
    client.release();
}
```

**MySQL (mysql2):**
```javascript
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'user',
    password: 'pass',
    database: 'mydb',
    waitForConnections: true,
    connectionLimit: 10
});

// Query
const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [userId]);

// Prepared statement
const [rows] = await pool.execute(
    'SELECT * FROM users WHERE age > ? AND role = ?',
    [18, 'user']
);
```

---

## ৩. Other Database Solutions

### Knex.js - Query Builder

```bash
npm install knex pg  # or mysql, sqlite3
```

```javascript
const knex = require('knex')({
    client: 'pg',
    connection: {
        host: 'localhost',
        user: 'user',
        password: 'pass',
        database: 'mydb'
    }
});

// Query
const users = await knex('users')
    .where('age', '>', 18)
    .andWhere('isActive', true)
    .select('id', 'name', 'email')
    .orderBy('createdAt', 'desc')
    .limit(10);

// Insert
const [id] = await knex('users').insert({
    name: 'John',
    email: 'john@example.com'
});

// Update
await knex('users')
    .where({ id: 1 })
    .update({ name: 'John Updated' });

// Delete
await knex('users').where({ id: 1 }).del();

// Join
const posts = await knex('posts')
    .join('users', 'posts.author_id', 'users.id')
    .select('posts.*', 'users.name as authorName');

// Transaction
await knex.transaction(async trx => {
    await trx('accounts').where({ id: senderId }).decrement('balance', amount);
    await trx('accounts').where({ id: receiverId }).increment('balance', amount);
});
```

---

### Prisma - Modern ORM

```bash
npm install prisma @prisma/client
npx prisma init
```

**schema.prisma:**
```prisma
datasource db {
    provider = "postgresql"
    url      = env("DATABASE_URL")
}

generator client {
    provider = "prisma-client-js"
}

model User {
    id        Int      @id @default(autoincrement())
    email     String   @unique
    name      String
    posts     Post[]
    createdAt DateTime @default(now())
    updatedAt DateTime @updatedAt
}

model Post {
    id        Int      @id @default(autoincrement())
    title     String
    content   String?
    published Boolean  @default(false)
    author    User     @relation(fields: [authorId], references: [id])
    authorId  Int
    createdAt DateTime @default(now())
    updatedAt DateTime @updatedAt
}
```

```bash
# Generate migrations
npx prisma migrate dev --name init

# Generate Prisma Client
npx prisma generate
```

**Usage:**
```javascript
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Create
const user = await prisma.user.create({
    data: {
        name: 'John',
        email: 'john@example.com'
    }
});

// Read
const users = await prisma.user.findMany({
    where: { 
        age: { gte: 18 },
        isActive: true
    },
    include: { posts: true },
    orderBy: { createdAt: 'desc' },
    take: 10
});

// Update
await prisma.user.update({
    where: { id: 1 },
    data: { name: 'John Updated' }
});

// Delete
await prisma.user.delete({ where: { id: 1 } });

// Transaction
await prisma.$transaction([
    prisma.user.create({ data: { name: 'John', email: 'john@example.com' } }),
    prisma.post.create({ data: { title: 'My Post', authorId: 1 } })
]);
```

---

## Database Best Practices

### 1. Connection Management

```javascript
// ✅ Good: Use connection pooling
mongoose.connect(uri, {
    maxPoolSize: 10,
    minPoolSize: 5
});

// ✅ Good: Reuse connections
// Create one connection and export it
// Don't create new connections for each request

// ✅ Good: Handle connection errors
mongoose.connection.on('error', (err) => {
    console.error('Database error:', err);
});

// ✅ Good: Graceful shutdown
process.on('SIGTERM', async () => {
    await mongoose.connection.close();
    process.exit(0);
});
```

### 2. Schema Design

```javascript
// ✅ Good: Use appropriate data types
{
    price: { type: Number },        // Not String!
    isActive: { type: Boolean },    // Not 0/1
    createdAt: { type: Date }       // Not String!
}

// ✅ Good: Add indexes for frequently queried fields
userSchema.index({ email: 1 });
userSchema.index({ age: 1, role: 1 });

// ✅ Good: Use default values
{
    status: { type: String, default: 'active' },
    createdAt: { type: Date, default: Date.now }
}

// ✅ Good: Add validation
{
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        validate: {
            validator: (v) => /^\S+@\S+\.\S+$/.test(v),
            message: 'Invalid email'
        }
    }
}
```

### 3. Query Optimization

```javascript
// ❌ Bad: N+1 query problem
const users = await User.find();
for (const user of users) {
    user.posts = await Post.find({ author: user._id });
}

// ✅ Good: Use populate/join
const users = await User.find().populate('posts');

// ❌ Bad: Select all fields
const users = await User.find();

// ✅ Good: Select only needed fields
const users = await User.find().select('name email');

// ❌ Bad: No limit
const users = await User.find();

// ✅ Good: Always limit
const users = await User.find().limit(100);

// ✅ Good: Use lean() when you don't need Mongoose features
const users = await User.find().lean();  // 5-10x faster!
```

### 4. Error Handling

```javascript
// ✅ Good: Always handle errors
try {
    const user = await User.create(userData);
} catch (error) {
    if (error.name === 'ValidationError') {
        // Handle validation error
    } else if (error.code === 11000) {
        // Handle duplicate key error
    } else {
        // Handle other errors
    }
}

// ✅ Good: Use transactions for critical operations
const session = await mongoose.startSession();
try {
    await session.withTransaction(async () => {
        // Your operations
    });
} catch (error) {
    // Handle error
} finally {
    session.endSession();
}
```

### 5. Security

```javascript
// ✅ Good: Never store plain passwords
userSchema.pre('save', async function() {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
    }
});

// ✅ Good: Use parameterized queries (prevent SQL injection)
await User.findOne({ email: userInput });  // Safe with Mongoose/Sequelize

// ❌ Bad: String concatenation (SQL injection!)
await sequelize.query(`SELECT * FROM users WHERE email = '${userInput}'`);

// ✅ Good: Use replacements
await sequelize.query('SELECT * FROM users WHERE email = :email', {
    replacements: { email: userInput }
});

// ✅ Good: Don't expose sensitive fields
userSchema.methods.toJSON = function() {
    const obj = this.toObject();
    delete obj.password;
    return obj;
};
```

### 6. Performance

```javascript
// ✅ Good: Create indexes for frequently queried fields
userSchema.index({ email: 1, isActive: 1 });

// ✅ Good: Use projection to limit fields
const users = await User.find().select('name email');

// ✅ Good: Use pagination
const users = await User.find().skip(skip).limit(limit);

// ✅ Good: Use aggregation for complex queries
const stats = await User.aggregate([
    { $group: { _id: '$role', count: { $sum: 1 } } }
]);

// ✅ Good: Cache frequently accessed data
const redis = require('redis');
const client = redis.createClient();

async function getUser(id) {
    // Check cache first
    const cached = await client.get(`user:${id}`);
    if (cached) return JSON.parse(cached);
    
    // If not cached, get from DB
    const user = await User.findById(id);
    
    // Cache for 1 hour
    await client.setEx(`user:${id}`, 3600, JSON.stringify(user));
    
    return user;
}
```

---

## Summary

**MongoDB (Mongoose):**
- ✅ Flexible schema
- ✅ Fast for simple queries
- ✅ Easy to scale horizontally
- ✅ Good for unstructured data
- ❌ No ACID transactions (before 4.0)
- ❌ No built-in relationships

**SQL (Sequelize):**
- ✅ ACID transactions
- ✅ Strong relationships
- ✅ Complex queries (JOINs)
- ✅ Data integrity
- ❌ Fixed schema
- ❌ Harder to scale horizontally

**Choose MongoDB when:**
- Rapid development
- Flexible/changing schema
- Document-based data
- Horizontal scalability needed

**Choose SQL when:**
- Complex relationships
- ACID compliance critical
- Structured data
- Complex queries needed

এই documentation দিয়ে আপনি যেকোনো Node.js প্রজেক্টে database integration করতে পারবেন! 🚀
