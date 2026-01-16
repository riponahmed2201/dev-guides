# ES6+ Advanced JavaScript

Node.js এর আসল শক্তি ব্যবহার করতে হলে মডার্ন জাভাস্ক্রিপ্ট (ES6+) ফিচারগুলো বোঝা মাস্ট। বিশেষ করে অ্যাসিনক্রোনাস প্রোগ্রামিং হ্যান্ডেল করা Node.js এর মূল চ্যালেঞ্জ এবং শক্তি।

## ১. Promises সম্পর্কে বিস্তারিত

জাভাস্ক্রিপ্টে কোনো কাজ যখন সময়সাপেক্ষ হয় (যেমন ফাইল রিড করা বা ডাটাবেস কোয়েরি), তখন সেটি শেষ হওয়ার জন্য অপেক্ষা না করে কোড সামনে এগিয়ে যায়। এই ধরণের কাজ হ্যান্ডেল করার জন্যই **Promise** ব্যবহার করা হয়।

একটি Promise-এর তিনটি অবস্থা থাকতে পারে:
1. **Pending:** কাজটি এখনো চলছে।
2. **Resolved (Fulfilled):** কাজটি সফলভাবে শেষ হয়েছে।
3. **Rejected:** কাজটি ব্যর্থ হয়েছে।

```javascript
const myPromise = new Promise((resolve, reject) => {
    let success = true;
    if (success) {
        resolve("Operation Successful! ✅");
    } else {
        reject("Operation Failed! ❌");
    }
});

myPromise
    .then((message) => console.log(message))
    .catch((error) => console.error(error));
```

### Promise Chaining
যখন একটার পর একটা অ্যাসিনক্রোনাস কাজ করতে হয়, তখন আমরা `.then()` চেইন করি।

```javascript
firstTask()
    .then(result1 => secondTask(result1))
    .then(result2 => thirdTask(result2))
    .catch(err => console.error(err));
```

### Promise.all & Promise.race
- **`Promise.all()`**: একাধিক প্রমিস একসাথে প্যারালাল রান করে এবং সবগুলো শেষ হলে রেজাল্ট দেয়। যদি একটাও ফেইল করে, তবে পুরো প্রসেস ফেইল করবে।
- **`Promise.race()`**: যেটি সবার আগে শেষ হবে, সেটির রেজাল্ট দেবে।

```javascript
Promise.all([p1, p2, p3]).then(values => console.log(values));
```

---

## ২. Async / Await

Promise চেইনিং অনেক সময় কোডকে জটিল করে ফেলে (যাকে **Callback Hell** এর মতো দেখা যায়)। এর সমাধান হলো `async` এবং `await`। এটি অ্যাসিনক্রোনাস কোডকে সিনক্রোনাস কোডের মতো করে পড়তে সাহায্য করে।

- **async:** কোনো ফাংশনের আগে বসলে সেটি অটোমেটিক একটি প্রমিস রিটার্ন করে।
- **await:** এটি প্রমিস রিজলভ হওয়া পর্যন্ত এক্সিকিউশন থামিয়ে রাখে (লজিক্যালি)।

```javascript
async function fetchData() {
    try {
        const response = await fetch('https://api.example.com/data');
        const data = await response.json();
        console.log(data);
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}
```

> **টিপস:** `await` শুধুমাত্র `async` ফাংশনের ভেতরেই কাজ করে।

---

## ৩. Classes & OOP Concepts

Node.js এ স্ট্রাকচার্ড এবং রিইউজেবল কোড লেখার জন্য Class এবং OOP (Object Oriented Programming) কনসেপ্ট জানা জরুরি।

```javascript
class User {
    constructor(name, email) {
        this.name = name;
        this.email = email;
    }

    login() {
        console.log(`${this.name} has logged in.`);
    }
}

// Inheritance (উত্তরাধিকার সূত্রে বৈশিষ্ট্য পাওয়া)
class Admin extends User {
    deleteUser(user) {
        console.log(`Admin ${this.name} deleted ${user.name}`);
    }
}

const user1 = new User("Rahim", "rahim@mail.com");
const admin = new Admin("Karim", "karim@mail.com");

user1.login();
admin.deleteUser(user1);
```

---

## ৪. Modules (Import / Export)

কোডকে ছোট ছোট ফাইলে ভাগ করে রাখার জন্য মডিউল সিস্টেম ব্যবহার করা হয়।

### A. CommonJS (Node.js ডিফল্ট)
```javascript
// math.js
const add = (a, b) => a + b;
module.exports = add;

// index.js
const add = require('./math');
```

### B. ES Modules (Modern Standard)
`package.json` এ `"type": "module"` সেট করতে হয়।

```javascript
// math.js
export const add = (a, b) => a + b;

// index.js
import { add } from './math.js';
```

---

## ৫. Higher-Order Functions

যে ফাংশন অন্য ফাংশনকে আর্গুমেন্ট হিসেবে নেয় অথবা একটি ফাংশন রিটার্ন করে, তাকে হায়ার-অর্ডার ফাংশন বলে। `map`, `filter`, `reduce` সবই হায়ার-অর্ডার ফাংশন।

```javascript
function operation(x, y, func) {
    return func(x, y);
}

const add = (a, b) => a + b;
console.log(operation(5, 3, add)); // 8
```

---

## ৬. Closures

যখন কোনো ফাংশন তার বাইরের স্কোপের ভেরিয়েবল মনে রাখে বা অ্যাক্সেস করতে পারে, এমনকি সেই বাইরের ফাংশন এক্সিকিউশন শেষ হয়ে গেলেও—তাকে **Closure** বলে।

```javascript
function outer() {
    let count = 0;
    return function inner() {
        count++;
        console.log(count);
    };
}

const counter = outer();
counter(); // 1
counter(); // 2
```
এখানে `inner` ফাংশন `count` ভেরিয়েবলকে "ক্লোজ" করে রেখেছে।

---

## ৭. This Keyword

`this` জাভাস্ক্রিপ্টের অন্যতম বিভ্রান্তিকর বিষয়। সহজ কথায়, `this` সেই অবজেক্টকে নির্দেশ করে যেটি বর্তমান ফাংশনটিকে কল করছে (execution context)।

- **Global:** ব্রাউজারে `window`, নোডে `global`।
- **Method:** অবজেক্টের মেথডে `this` ওই অবজেক্টকে নির্দেশ করে।
- **Arrow Function:** এর নিজস্ব `this` নেই, এটি তার বাইরের (lexical) স্কোপের `this` ব্যবহার করে।

---

## ৮. Prototypes

জাভাস্ক্রিপ্টের প্রতিটি অবজেক্টের একটি গোপন প্রপার্টি থাকে যার নাম `[[Prototype]]`। এর মাধ্যমেই জাভাস্ক্রিপ্টে ইনহেরিটেন্স কাজ করে।

```javascript
function Person(name) {
    this.name = name;
}

// প্রোটোটাইপে মেথড অ্যাড করা (মেমোরি সাশ্রয়ী)
Person.prototype.hello = function() {
    console.log(`Hello, ${this.name}`);
};

const p1 = new Person("Ali");
p1.hello();
```
