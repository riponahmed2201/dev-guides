# JavaScript Fundamentals (Must Know)

Node.js শিখতে গেলে জাভাস্ক্রিপ্টের ভিত্তি মজবুত থাকা অপরিহার্য। এখানে আমরা সেই টপিকগুলো নিয়ে বিস্তারিত আলোচনা করব যা Node.js এ কাজ করার জন্য **অবশ্যই** জানতে হবে।

## ১. Variables (ভেরিয়েবল)

ES6 এ ভেরিয়েবল ডিক্লেয়ার করার জন্য `var` এর পরিবর্তে `let` এবং `const` ব্যবহার করা হয়।

- **`let`**: যখন ভেরিয়েবলের মান ভবিষ্যতে পরিবর্তিত হতে পারে। এটি block-scoped।
- **`const`**: যখন মান একবার অ্যাসাইন করার পর আর পরিবর্তন হবে না। এটিও block-scoped।
- **`var`**: পুরনো পদ্ধতি, এটি function-scoped এবং কিছু বিভ্রান্তি তৈরি করতে পারে (hoisting এর কারণে), তাই আধুনিক কোডে এটি এড়িয়ে চলাই ভালো।

```javascript
let age = 25;
age = 26; // ঠিক আছে

const name = "Ripon";
// name = "Ahmed"; // এরর! const পরিবর্তন করা যায় না।

if (true) {
    let x = 10;
}
// console.log(x); // এরর! x ব্লকের বাইরে এক্সেস করা যাবে না।
```

---

## ২. Data Types (ডেটা টাইপ)

জাভাস্ক্রিপ্টে ডেটা টাইপ দুই ধরণের:

1.  **Primitives (Immutable):**
    - `String`: টেক্সট ডেটার জন্য (`"Hello"`).
    - `Number`: পূর্ণসংখ্যা বা দশমিক (`10`, `10.5`).
    - `Boolean`: সত্য বা মিথ্যা (`true`, `false`).
    - `Undefined`: মান অ্যাসাইন করা হয়নি।
    - `Null`: ইচ্ছাকৃতভাবে খালি রাখা হয়েছে।
    - `Symbol`: ইউনিক আইডেন্টিফায়ার।
    - `BigInt`: অনেক বড় সংখ্যার জন্য।

2.  **Reference (Mutable):**
    - `Object`: `{ name: "Ripon" }`
    - `Array`: `[1, 2, 3]`
    - `Function`

---

## ৩. Operators

- **Arithmetic:** `+`, `-`, `*`, `/`, `%` (ভাগশেষ)।
- **Comparison:** `==` (মান চেক করে), `===` (মান ও টাইপ উভয়ই চেক করে), `!=`, `!==`, `>`, `<`।
- **Logical:** `&&` (AND), `||` (OR), `!` (NOT)।

```javascript
// '==' vs '==='
console.log(5 == "5");  // true (শুধুমাত্র ভ্যালু চেক করে)
console.log(5 === "5"); // false (টাইপও চেক করে, Number vs String)
```

---

## ৪. Control Flow

- **If-Else:** শর্ত সাপেক্ষে কোড রান করা।
- **Switch:** একাধিক কন্ডিশন চেক করার জন্য।
- **Ternary Operator:** এক লাইনে if-else লেখার জন্য।

```javascript
const age = 18;
const status = age >= 18 ? "Adult" : "Minor"; // Ternary Operator
```

---

## ৫. Loops (লুপস)

- **`for` loop:** নির্দিষ্ট বার ঘোরার জন্য।
- **`while` loop:** কন্ডিশন সত্য থাকা পর্যন্ত ঘোরার জন্য।
- **`for...of`:** অ্যারে বা ইটারেবল এর উপাদানের ওপর লুপ চালাতে।
- **`for...in`:** অবজেক্টের প্রপার্টি বা কী (key) এর ওপর লুপ চালাতে।

```javascript
const colors = ["Red", "Green", "Blue"];

// for...of (Best for Arrays)
for (const color of colors) {
    console.log(color);
}
```

---

## ৬. Functions (ফাংশন)

Node.js এ ফাংশন লেখার বিভিন্ন পদ্ধতি আছে।

### Arrow Functions
এটি আধুনিক এবং সংক্ষিপ্ত। বিশেষ করে `this` কিওয়ার্ডের আচরণের কারণে এটি জনপ্রিয়।

```javascript
// Regular Function
function add(a, b) {
    return a + b;
}

// Arrow Function
const multiply = (x, y) => x * y; // এক লাইনের হলে return লাগে না
```

---

## ৭. Arrays & Array Methods

ডেটা ম্যানিপুলেশনের জন্য অ্যারে মেথডগুলো জানা ফরজ।

- **`map()`**: একটি অ্যারে থেকে প্রতিটি উপাদান নিয়ে কাজ করে নতুন একটি অ্যারে তৈরি করে।
- **`filter()`**: কন্ডিশন অনুযায়ী কিছু উপাদান বাছাই করে নতুন অ্যারে দেয়।
- **`reduce()`**: অ্যারের সব উপাদান মিলিয়ে একটি রেজাল্ট তৈরি করে (যেমন যোগফল)।
- **`forEach()`**: লুপ চালানোর জন্য (কোনো কিছু রিটার্ন করে না)।
- **`find()`**: কন্ডিশন অনুযায়ী প্রথম উপাদানটি খুঁজে পায়।

```javascript
const numbers = [1, 2, 3, 4, 5];

// Map: সংখ্যাগুলো দ্বিগুণ করা
const doubled = numbers.map(num => num * 2); 
// [2, 4, 6, 8, 10]

// Filter: শুধু জোড় সংখ্যা নেওয়া
const evens = numbers.filter(num => num % 2 === 0); 
// [2, 4]

// Reduce: সব সংখ্যার যোগফল
const sum = numbers.reduce((total, num) => total + num, 0);
// 15
```

---

## ৮. Objects & Methods

```javascript
const user = {
    name: "Ripon",
    age: 25,
    greet: function() {
        console.log(`Hello, I am ${this.name}`);
    }
};

console.log(Object.keys(user));   // ['name', 'age', 'greet']
console.log(Object.values(user)); // ['Ripon', 25, [Function: greet]]
```

---

## ৯. Destructuring (Array & Object)

অবজেক্ট বা অ্যারে থেকে ডেটা বের করে আনার সহজ উপায়।

```javascript
// Object Destructuring
const person = { id: 1, city: "Dhaka" };
const { city } = person; // city = "Dhaka"

// Array Destructuring
const nums = [10, 20];
const [first, second] = nums; // first = 10
```

---

## ১০. Spread & Rest Operators (...)

- **Spread:** অ্যারে বা অবজেক্টকে ছড়িয়ে দিতে (Copy বা Merge করতে) ব্যবহৃত হয়।
- **Rest:** ফাংশনে অনির্দিষ্ট সংখ্যক আর্গুমেন্ট গ্রহণ করতে ব্যবহৃত হয়।

```javascript
// Spread
const arr1 = [1, 2];
const combined = [...arr1, 3, 4]; // [1, 2, 3, 4]

// Rest
function sumAll(...args) {
    return args.reduce((sum, current) => sum + current, 0);
}
console.log(sumAll(1, 2, 3)); // 6
```

---

## ১১. Template Literals

ব্যাকটিক (\`) ব্যবহার করে স্ট্রিং এর ভেতর ভেরিয়েবল লেখা।

```javascript
const name = "Node.js";
const message = `Welcome to learning ${name}!`; 
// "Welcome to learning Node.js!"
```

---

## ১২. Error Handling (try-catch-finally)

Node.js বা জাভাস্ক্রিপ্ট অ্যাপ ক্রাশ হওয়া ঠেকাতে এরর হ্যান্ডলিং খুব গুরুত্বপূর্ণ।

```javascript
try {
    // এখানে এমন কোড থাকবে যা এরর দিতে পারে
    const userJson = '{"name": "Ripon"}'; // Valid JSON
    const user = JSON.parse(userJson);
    console.log(user.name);
} catch (error) {
    // এরর হলে এখানে ধরা পড়বে
    console.error("Something went wrong:", error.message);
} finally {
    // এটি সব সময় রান হবে (এরর হোক বা না হোক)
    console.log("Operation finished.");
}
```
