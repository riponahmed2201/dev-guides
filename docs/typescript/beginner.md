# Prerequisites (পূর্বশর্ত)

এই সেকশনে আমরা TypeScript এর ভিত্তি বা মৌলিক বিষয়গুলো নিয়ে আলোচনা করবো। আপনি যদি জাভাস্ক্রিপ্ট জানেন, তাহলে আপনার জন্য এটি ধরা খুব সহজ হবে।

---

## **Prerequisites (পূর্বশর্ত)**

TypeScript শুরু করার আগে আপনার নিচের বিষয়গুলো সম্পর্কে পরিষ্কার ধারণা থাকা **অত্যন্ত জরুরি**। নিচে প্রতিটি বিষয় বিস্তারিতভাবে ব্যাখ্যা করা হলো।

---

### 1. JavaScript Fundamentals (ES6+)

TypeScript মূলত JavaScript-এর উপরে তৈরি, তাই আধুনিক JavaScript (ES6 এবং তার পরের ভার্সন) এর ফিচারগুলো ভালোভাবে জানা থাকতে হবে। নিচে প্রতিটি গুরুত্বপূর্ণ ফিচার উদাহরণসহ দেখানো হলো:

#### 1.1 `let` এবং `const` (ভেরিয়েবল ডিক্লেয়ারেশন)

পুরাতন `var` এর বদলে ES6 থেকে `let` এবং `const` এসেছে। `let` দিয়ে ডিক্লেয়ার করা ভেরিয়েবলের মান পরিবর্তন করা যায়, কিন্তু `const` দিয়ে ডিক্লেয়ার করলে মান আর পরিবর্তন করা যায় না।

```javascript
// let - মান পরিবর্তন করা যায়
let name = "Ripon";
name = "Ahmed"; // ✅ ঠিক আছে

// const - মান পরিবর্তন করা যায় না
const PI = 3.1416;
// PI = 3.14; // ❌ Error! Assignment to constant variable.

// const দিয়ে অবজেক্ট/অ্যারে ডিক্লেয়ার করলে, ভেতরের মান বদলানো যায়
const user = { name: "Ripon" };
user.name = "Ahmed"; // ✅ এটি ঠিক আছে, কারণ অবজেক্টের প্রপার্টি বদলাচ্ছি
```

::: tip কেন `var` ব্যবহার করবেন না?
`var` ফাংশন-স্কোপড, যার কারণে অনেক সময় অপ্রত্যাশিত বাগ তৈরি হয়। `let` এবং `const` ব্লক-স্কোপড, তাই এগুলো অনেক বেশি নিরাপদ।
:::

#### 1.2 Arrow Functions (তীর ফাংশন)

Arrow function হলো ফাংশন লেখার একটি সংক্ষিপ্ত ও আধুনিক পদ্ধতি।

```javascript
// ট্র্যাডিশনাল ফাংশন
function add(a, b) {
  return a + b;
}

// Arrow Function - সংক্ষিপ্ত
const add = (a, b) => a + b;

// একাধিক লাইনের Arrow Function
const greet = (name) => {
  const message = `হ্যালো, ${name}!`;
  return message;
};

console.log(greet("Ripon")); // হ্যালো, Ripon!
```

::: warning গুরুত্বপূর্ণ পার্থক্য
Arrow function-এ `this` keyword আলাদাভাবে কাজ করে। এটি তার **parent scope** থেকে `this` নেয়, যেখানে সাধারণ ফাংশন নিজের `this` তৈরি করে।
:::

#### 1.3 Template Literals (টেমপ্লেট লিটারেল)

ব্যাকটিক (`` ` ``) ব্যবহার করে স্ট্রিং-এর ভেতরে সরাসরি ভেরিয়েবল বা এক্সপ্রেশন বসানো যায়।

```javascript
const name = "Ripon";
const age = 25;

// পুরাতন পদ্ধতি (String concatenation)
const old = "আমার নাম " + name + " এবং বয়স " + age;

// আধুনিক পদ্ধতি (Template Literal) ✅
const modern = `আমার নাম ${name} এবং বয়স ${age}`;

// এক্সপ্রেশনও ব্যবহার করা যায়
const result = `${age >= 18 ? "প্রাপ্তবয়স্ক" : "অপ্রাপ্তবয়স্ক"}`;

// মাল্টি-লাইন স্ট্রিং
const multiLine = `
  এটি প্রথম লাইন
  এটি দ্বিতীয় লাইন
`;
```

#### 1.4 Destructuring (ডিস্ট্রাকচারিং)

অবজেক্ট বা অ্যারে থেকে সরাসরি ভেরিয়েবলে মান বের করে আনার পদ্ধতি।

```javascript
// ---- Object Destructuring ----
const user = { name: "Ripon", age: 25, city: "Dhaka" };

// পুরাতন পদ্ধতি
const name1 = user.name;
const age1 = user.age;

// Destructuring পদ্ধতি ✅
const { name, age, city } = user;
console.log(name); // "Ripon"

// নাম পরিবর্তন করে নেওয়া (Aliasing)
const { name: userName, age: userAge } = user;
console.log(userName); // "Ripon"

// ডিফল্ট ভ্যালু দেওয়া
const { country = "Bangladesh" } = user;
console.log(country); // "Bangladesh" (যেহেতু user-এ country নেই)

// ---- Array Destructuring ----
const colors = ["লাল", "সবুজ", "নীল"];

const [first, second, third] = colors;
console.log(first); // "লাল"
console.log(second); // "সবুজ"

// কিছু এলিমেন্ট স্কিপ করা
const [, , lastColor] = colors;
console.log(lastColor); // "নীল"
```

#### 1.5 Spread (`...`) এবং Rest (`...`) Operators

একই `...` সিনট্যাক্স, কিন্তু ব্যবহারের উপর ভিত্তি করে আলাদা কাজ করে।

```javascript
// ---- Spread Operator: ছড়িয়ে দেয় ----

// অ্যারে কপি ও মার্জ করা
const fruits = ["আম", "কাঁঠাল"];
const moreFruits = ["লিচু", ...fruits, "জাম"];
console.log(moreFruits); // ["লিচু", "আম", "কাঁঠাল", "জাম"]

// অবজেক্ট কপি ও মার্জ করা
const defaults = { theme: "dark", lang: "bn" };
const settings = { ...defaults, lang: "en" }; // lang ওভাররাইড হবে
console.log(settings); // { theme: "dark", lang: "en" }

// ---- Rest Operator: বাকিগুলো জড়ো করে ----

// ফাংশনে অসীম সংখ্যক আর্গুমেন্ট নেওয়া
function sum(...numbers) {
  return numbers.reduce((total, n) => total + n, 0);
}
console.log(sum(1, 2, 3, 4)); // 10

// Destructuring-এর সাথে ব্যবহার
const [head, ...tail] = [10, 20, 30, 40];
console.log(head); // 10
console.log(tail); // [20, 30, 40]
```

#### 1.6 Promises এবং Async/Await

জাভাস্ক্রিপ্টে অ্যাসিনক্রোনাস (asynchronous) কাজ হ্যান্ডেল করার জন্য Promise এবং async/await ব্যবহার করা হয়। যেমন: API কল, ফাইল পড়া ইত্যাদি।

```javascript
// ---- Promise ----
// একটি Promise তৈরি করা
const fetchData = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve("ডেটা সফলভাবে লোড হয়েছে!");
    }, 2000);
  });
};

// Promise ব্যবহার করা (.then/.catch)
fetchData()
  .then((data) => console.log(data)) // "ডেটা সফলভাবে লোড হয়েছে!"
  .catch((error) => console.log(error));

// ---- Async/Await (আরও সহজ পদ্ধতি) ----
// async ফাংশনের ভেতরে await দিয়ে Promise-এর রেজাল্ট পাওয়া যায়
async function loadData() {
  try {
    const data = await fetchData();
    console.log(data); // "ডেটা সফলভাবে লোড হয়েছে!"
  } catch (error) {
    console.log("এরর:", error);
  }
}

loadData();
```

::: tip কেন Async/Await ভালো?
`.then().then().then()` চেইন করলে কোড জটিল হয়ে যায় (Callback Hell এর মতো)। `async/await` ব্যবহার করলে অ্যাসিনক্রোনাস কোড দেখতে সিনক্রোনাস কোডের মতো লাগে, যা পড়া ও বোঝা অনেক সহজ।
:::

#### 1.7 ES Modules (`import` / `export`)

কোডকে আলাদা আলাদা ফাইলে ভাগ করে সংগঠিত রাখার পদ্ধতি।

```javascript
// ---- utils.js (এক্সপোর্ট করা) ----
// Named Export
export const PI = 3.1416;
export function square(x) {
  return x * x;
}

// Default Export (প্রতি ফাইলে শুধু একটি)
export default function greet(name) {
  return `হ্যালো, ${name}!`;
}

// ---- app.js (ইমপোর্ট করা) ----
// Default import (যেকোনো নাম দিতে পারেন)
import greet from "./utils.js";

// Named import (হুবহু একই নাম ব্যবহার করতে হবে)
import { PI, square } from "./utils.js";

console.log(greet("Ripon")); // "হ্যালো, Ripon!"
console.log(PI); // 3.1416
console.log(square(5)); // 25
```

---

### 2. Basic Programming Concepts (মৌলিক প্রোগ্রামিং ধারণা)

যেকোনো প্রোগ্রামিং ভাষা শেখার আগে এই মৌলিক ধারণাগুলো জানা জরুরি:

#### 2.1 ভেরিয়েবল (Variables)

ভেরিয়েবল হলো ডেটা সংরক্ষণ করার একটি কন্টেইনার।

```javascript
let studentName = "করিম"; // টেক্সট (String)
let marks = 85; // সংখ্যা (Number)
let isPassed = true; // সত্য/মিথ্যা (Boolean)
let subjects = ["বাংলা", "ইংরেজি", "গণিত"]; // তালিকা (Array)
```

#### 2.2 কন্ডিশনাল (Conditionals)

শর্তের উপর ভিত্তি করে বিভিন্ন কাজ করানো।

```javascript
const marks = 75;

if (marks >= 80) {
  console.log("A+ পেয়েছো! 🎉");
} else if (marks >= 60) {
  console.log("A পেয়েছো! 👍");
} else if (marks >= 40) {
  console.log("পাস করেছো।");
} else {
  console.log("ফেইল। আবার চেষ্টা করো। 💪");
}

// Ternary Operator (সংক্ষিপ্ত if-else)
const result = marks >= 40 ? "পাস" : "ফেইল";
console.log(result); // "পাস"
```

#### 2.3 লুপ (Loops)

একই কাজ বারবার করানোর জন্য লুপ ব্যবহার করা হয়।

```javascript
// for loop
const fruits = ["আম", "কাঁঠাল", "লিচু", "জাম"];

for (let i = 0; i < fruits.length; i++) {
  console.log(`${i + 1}. ${fruits[i]}`);
}
// Output: 1. আম, 2. কাঁঠাল, 3. লিচু, 4. জাম

// for...of loop (আরও সহজ)
for (const fruit of fruits) {
  console.log(fruit);
}

// while loop
let count = 1;
while (count <= 5) {
  console.log(`গণনা: ${count}`);
  count++;
}

// Array methods (modern approach)
fruits.forEach((fruit, index) => {
  console.log(`${index + 1}. ${fruit}`);
});
```

#### 2.4 ফাংশন (Functions)

পুনরায় ব্যবহারযোগ্য কোড ব্লক তৈরি করা।

```javascript
// ফাংশন ডিক্লেয়ারেশন
function calculateArea(length, width) {
  return length * width;
}

const area = calculateArea(10, 5);
console.log(`ক্ষেত্রফল: ${area}`); // ক্ষেত্রফল: 50

// ডিফল্ট প্যারামিটার
function greet(name = "বন্ধু") {
  return `স্বাগতম, ${name}!`;
}

console.log(greet()); // স্বাগতম, বন্ধু!
console.log(greet("করিম")); // স্বাগতম, করিম!
```

#### 2.5 অবজেক্ট (Objects)

সম্পর্কিত ডেটাকে একসাথে রাখার **key-value** পদ্ধতি।

```javascript
const student = {
  name: "রহিম",
  age: 20,
  department: "CSE",
  isActive: true,
  // মেথড (ফাংশন যা অবজেক্টের ভেতরে থাকে)
  introduce() {
    return `আমি ${this.name}, ${this.department} ডিপার্টমেন্টে পড়ি।`;
  },
};

console.log(student.name); // "রহিম"
console.log(student.introduce()); // "আমি রহিম, CSE ডিপার্টমেন্টে পড়ি।"
```

---

### 3. HTML/CSS Basics (এইচটিএমএল/সিএসএস বেসিক)

ওয়েব ব্রাউজারে কিছু দেখানোর জন্য HTML (কাঠামো) এবং CSS (স্টাইল) এর মৌলিক জ্ঞান থাকা জরুরি।

#### 3.1 HTML বেসিক

HTML হলো ওয়েব পেজের **কাঠামো (Structure)** তৈরি করার ভাষা।

```html
<!DOCTYPE html>
<html lang="bn">
  <head>
    <meta charset="UTF-8" />
    <title>আমার প্রথম পেজ</title>
  </head>
  <body>
    <h1>স্বাগতম!</h1>
    <p>এটি একটি <strong>প্যারাগ্রাফ</strong>।</p>

    <ul>
      <li>আইটেম ১</li>
      <li>আইটেম ২</li>
    </ul>

    <button id="myBtn">ক্লিক করুন</button>
  </body>
</html>
```

#### 3.2 CSS বেসিক

CSS হলো ওয়েব পেজকে **সুন্দর (Style)** করার ভাষা।

```css
/* সিলেক্টর দিয়ে যেকোনো এলিমেন্টকে স্টাইল করা যায় */
body {
  font-family: "SolaimanLipi", sans-serif;
  background-color: #f0f0f0;
  margin: 0;
  padding: 20px;
}

h1 {
  color: #2c3e50; /* টেক্সট রঙ */
  text-align: center; /* মাঝখানে রাখা */
}

button {
  background-color: #3498db;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px; /* গোলাকার কোণা */
  cursor: pointer;
}

button:hover {
  background-color: #2980b9; /* মাউস হোভার করলে রঙ পরিবর্তন */
}
```

#### 3.3 JavaScript দিয়ে HTML ম্যানিপুলেশন (DOM)

TypeScript-এও DOM ম্যানিপুলেশন করা হয়। তাই এটি জানা জরুরি:

```javascript
// HTML এলিমেন্ট সিলেক্ট করা
const btn = document.getElementById("myBtn");
const heading = document.querySelector("h1");

// ইভেন্ট লিসেনার যোগ করা
btn.addEventListener("click", () => {
  heading.textContent = "বাটনে ক্লিক করা হয়েছে! 🎉";
  heading.style.color = "green";
});
```

::: info এগুলো কেন জরুরি?
TypeScript-এ আপনি যখন ওয়েব অ্যাপ্লিকেশন তৈরি করবেন, তখন এই HTML, CSS এবং DOM ম্যানিপুলেশনের জ্ঞান কাজে লাগবে। TypeScript শুধু এর উপরে **Type Safety** যোগ করে।
:::

---

::: tip পরবর্তী ধাপ
Prerequisites গুলো ঝালিয়ে নেওয়ার পর, চলুন **[Getting Started](./getting-started)** পর্বে যাই যেখানে আমরা TypeScript সেটআপ করবো।
:::
