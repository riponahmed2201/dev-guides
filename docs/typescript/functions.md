# Functions (ফাংশন)

TypeScript-এ ফাংশন হলো কোডের পুনঃব্যবহারযোগ্য ব্লক। JavaScript-এর ফাংশনের উপর TypeScript **টাইপ সিস্টেম** যোগ করে, যার ফলে ফাংশনের **প্যারামিটার** এবং **রিটার্ন ভ্যালু** — উভয়ের টাইপ নির্ধারণ করা যায়। এতে কোড আরও **নিরাপদ**, **পঠনযোগ্য** এবং **বাগ-মুক্ত** হয়।

---

## 1. Function Type Annotations (ফাংশন টাইপ এনোটেশন)

TypeScript-এ ফাংশন লেখার সময় **প্যারামিটারের টাইপ** এবং **রিটার্ন টাইপ** স্পষ্টভাবে বলে দেওয়া যায়। এটিকে **Function Type Annotation** বলে।

### 1.1 প্যারামিটার টাইপ এনোটেশন

প্রতিটি প্যারামিটারের পরে `:` দিয়ে টাইপ লিখতে হয়:

```typescript
// প্যারামিটারে টাইপ এনোটেশন
function greet(name: string) {
  console.log(`হ্যালো, ${name}!`);
}

greet("রিপন"); // ✅ কাজ করবে
// greet(123);   // ❌ Error: Argument of type 'number' is not assignable to parameter of type 'string'
```

### 1.2 একাধিক প্যারামিটার

```typescript
function addNumbers(a: number, b: number) {
  return a + b;
}

let result = addNumbers(10, 20); // ✅ result = 30
// addNumbers("10", 20);          // ❌ Error: string দেওয়া যাবে না
// addNumbers(10);                 // ❌ Error: 2টি argument দিতে হবে
```

### 1.3 ফাংশন টাইপ এক্সপ্রেশন (Function Type Expression)

ফাংশনের সম্পূর্ণ টাইপ একটি **ভেরিয়েবল বা টাইপ এলিয়াসে** সংরক্ষণ করা যায়:

```typescript
// ফাংশন টাইপ ডিক্লেয়ারেশন
type MathOperation = (x: number, y: number) => number;

// এই টাইপ ব্যবহার করে ফাংশন তৈরি
const add: MathOperation = (x, y) => x + y;
const subtract: MathOperation = (x, y) => x - y;
const multiply: MathOperation = (x, y) => x * y;

console.log(add(5, 3)); // 8
console.log(subtract(10, 4)); // 6
console.log(multiply(3, 7)); // 21

// ❌ ভুল — টাইপ মিলছে না
// const wrong: MathOperation = (x, y) => `${x + y}`; // Error: string রিটার্ন হচ্ছে, number লাগবে
```

### 1.4 কলব্যাক ফাংশনে টাইপ

কলব্যাক ফাংশনের টাইপ সরাসরি প্যারামিটারে লেখা যায়:

```typescript
// callback-এর টাইপ সরাসরি প্যারামিটারে
function processData(data: string, callback: (result: string) => void) {
  const processed = data.toUpperCase();
  callback(processed);
}

processData("hello typescript", (result) => {
  console.log(result); // "HELLO TYPESCRIPT"
});

// ব্যবহারিক উদাহরণ — অ্যারে ফিল্টার
function filterNumbers(
  numbers: number[],
  predicate: (num: number) => boolean,
): number[] {
  return numbers.filter(predicate);
}

const evenNumbers = filterNumbers([1, 2, 3, 4, 5, 6], (n) => n % 2 === 0);
console.log(evenNumbers); // [2, 4, 6]
```

::: tip ফাংশন টাইপ এনোটেশনের সুবিধা

- কোড লেখার সময় **IDE autocomplete** পাওয়া যায়
- ভুল টাইপের মান পাস করলে **কম্পাইল টাইমে** এরর দেখায়
- কোড **ডকুমেন্টেশন** হিসেবেও কাজ করে — ফাংশন কী আশা করে তা পরিষ্কার
  :::

---

## 2. Return Type Annotations (রিটার্ন টাইপ এনোটেশন)

ফাংশন কী টাইপের মান রিটার্ন করবে তা স্পষ্টভাবে বলে দেওয়া যায়। প্যারামিটার লিস্টের পরে `:` দিয়ে রিটার্ন টাইপ লিখতে হয়।

### 2.1 বেসিক রিটার্ন টাইপ

```typescript
// রিটার্ন টাইপ স্পষ্টভাবে লেখা
function getFullName(firstName: string, lastName: string): string {
  return `${firstName} ${lastName}`;
}

let name: string = getFullName("রিপন", "আহমেদ"); // ✅
console.log(name); // "রিপন আহমেদ"

// number রিটার্ন টাইপ
function calculateArea(width: number, height: number): number {
  return width * height;
}

let area: number = calculateArea(10, 5); // 50

// boolean রিটার্ন টাইপ
function isAdult(age: number): boolean {
  return age >= 18;
}

console.log(isAdult(25)); // true
console.log(isAdult(15)); // false
```

### 2.2 `void` রিটার্ন টাইপ

যখন ফাংশন কিছু রিটার্ন করে না:

```typescript
function logMessage(message: string): void {
  console.log(`[LOG]: ${message}`);
  // return কিছু নেই
}

logMessage("সার্ভার চালু হয়েছে"); // [LOG]: সার্ভার চালু হয়েছে

// ❌ void ফাংশন থেকে কিছু রিটার্ন করা যাবে না
// function wrong(): void {
//   return "something"; // Error: Type 'string' is not assignable to type 'void'
// }
```

### 2.3 `never` রিটার্ন টাইপ

যখন ফাংশন কখনো স্বাভাবিকভাবে শেষ হয় না (sempre error throw করে বা infinite loop):

```typescript
function throwError(message: string): never {
  throw new Error(message);
}

function infiniteLoop(): never {
  while (true) {
    // কখনো বের হবে না
  }
}

// ব্যবহারিক উদাহরণ
function handleError(code: number): never {
  throw new Error(`Error code: ${code}`);
}
```

### 2.4 রিটার্ন টাইপ ইনফারেন্স (Inference)

TypeScript অনেক সময় **নিজে থেকেই রিটার্ন টাইপ বুঝে নেয়**:

```typescript
// TypeScript নিজেই বুঝে নেয় রিটার্ন টাইপ number
function add(a: number, b: number) {
  return a + b; // inferred return type: number
}

// TypeScript নিজেই বুঝে নেয় রিটার্ন টাইপ string
function greet(name: string) {
  return `হ্যালো, ${name}!`; // inferred return type: string
}

let sum = add(3, 5); // sum-এর টাইপ: number ✅
let msg = greet("করিম"); // msg-এর টাইপ: string ✅
```

::: warning কখন রিটার্ন টাইপ লিখবেন?
| পরিস্থিতি | করণীয় |
|---|---|
| সাধারণ ফাংশন | Inference-এ ছেড়ে দিন |
| পাবলিক API বা লাইব্রেরি | **অবশ্যই লিখুন** |
| জটিল ফাংশন (একাধিক return) | **অবশ্যই লিখুন** |
| void/never ফাংশন | লেখা ভালো চর্চা |
| টিমে কাজ করলে | **অবশ্যই লিখুন** — ডকুমেন্টেশন হিসেবে কাজ করে |
:::

---

## 3. Optional এবং Default Parameters (ঐচ্ছিক ও ডিফল্ট প্যারামিটার)

### 3.1 Optional Parameters (ঐচ্ছিক প্যারামিটার — `?`)

কোনো প্যারামিটারের পরে `?` লাগালে সেটি **ঐচ্ছিক** হয়ে যায়। অর্থাৎ, ফাংশন কল করার সময় সেই আর্গুমেন্ট না দিলেও চলবে। দেওয়া না হলে মান হবে `undefined`।

```typescript
// lastName ঐচ্ছিক
function greet(firstName: string, lastName?: string): string {
  if (lastName) {
    return `হ্যালো, ${firstName} ${lastName}!`;
  }
  return `হ্যালো, ${firstName}!`;
}

console.log(greet("রিপন", "আহমেদ")); // "হ্যালো, রিপন আহমেদ!"
console.log(greet("রিপন")); // "হ্যালো, রিপন!"

// ⚠️ ঐচ্ছিক প্যারামিটার সবসময় বাধ্যতামূলক প্যারামিটারের পরে লিখতে হবে!
// ❌ ভুল:
// function wrong(firstName?: string, lastName: string) {} // Error!
```

**একাধিক ঐচ্ছিক প্যারামিটার:**

```typescript
function createUser(name: string, email?: string, age?: number): string {
  let info = `নাম: ${name}`;
  if (email) info += `, ইমেইল: ${email}`;
  if (age) info += `, বয়স: ${age}`;
  return info;
}

console.log(createUser("রিপন")); // "নাম: রিপন"
console.log(createUser("রিপন", "ripon@example.com")); // "নাম: রিপন, ইমেইল: ripon@example.com"
console.log(createUser("রিপন", "ripon@example.com", 25)); // "নাম: রিপন, ইমেইল: ripon@example.com, বয়স: 25"
```

### 3.2 Default Parameters (ডিফল্ট প্যারামিটার — `=`)

প্যারামিটারে ডিফল্ট মান দিলে, আর্গুমেন্ট না দিলে সেই ডিফল্ট মান ব্যবহার হবে। ডিফল্ট প্যারামিটার স্বয়ংক্রিয়ভাবে ঐচ্ছিক হয়ে যায়।

```typescript
// greeting-এর ডিফল্ট মান "হ্যালো"
function greet(name: string, greeting: string = "হ্যালো"): string {
  return `${greeting}, ${name}!`;
}

console.log(greet("রিপন")); // "হ্যালো, রিপন!" (ডিফল্ট মান ব্যবহার)
console.log(greet("রিপন", "স্বাগতম")); // "স্বাগতম, রিপন!" (কাস্টম মান)

// ব্যবহারিক উদাহরণ — কনফিগারেশন
function connectDB(
  host: string = "localhost",
  port: number = 5432,
  database: string = "mydb",
): string {
  return `Connecting to ${database} at ${host}:${port}`;
}

console.log(connectDB()); // "Connecting to mydb at localhost:5432"
console.log(connectDB("192.168.1.1")); // "Connecting to mydb at 192.168.1.1:5432"
console.log(connectDB("192.168.1.1", 3306, "shop")); // "Connecting to shop at 192.168.1.1:3306"
```

### 3.3 Optional vs Default — পার্থক্য

```typescript
// Optional: মান না দিলে undefined হবে
function withOptional(name: string, title?: string) {
  console.log(title); // undefined (যদি না দেওয়া হয়)
}

// Default: মান না দিলে ডিফল্ট মান ব্যবহার হবে
function withDefault(name: string, title: string = "Mr.") {
  console.log(title); // "Mr." (ডিফল্ট মান)
}

withOptional("রিপন"); // undefined
withDefault("রিপন"); // "Mr."
```

::: tip Optional vs Default — কোনটি কখন ব্যবহার করবেন?
| বৈশিষ্ট্য | Optional (`?`) | Default (`=`) |
|---|---|---|
| মান না দিলে | `undefined` | ডিফল্ট মান |
| টাইপ | `T \| undefined` | `T` |
| কখন ব্যবহার? | মান থাকতেও পারে, নাও পারে | বেশিরভাগ সময় একটি নির্দিষ্ট মান থাকে |
| উদাহরণ | `age?: number` | `age: number = 25` |

**নিয়ম:** যদি কোনো যুক্তিসঙ্গত ডিফল্ট মান থাকে, তাহলে **Default Parameter** ব্যবহার করুন। না থাকলে **Optional** ব্যবহার করুন।
:::

---

## 4. Rest Parameters (রেস্ট প্যারামিটার — `...`)

Rest parameter দিয়ে একটি ফাংশনে **অসীম সংখ্যক আর্গুমেন্ট** গ্রহণ করা যায়। এটি `...` (spread operator) দিয়ে লেখা হয় এবং একটি **অ্যারে** হিসেবে কাজ করে।

### 4.1 বেসিক Rest Parameter

```typescript
// ...numbers মানে যতগুলো ইচ্ছা number দেওয়া যাবে
function sum(...numbers: number[]): number {
  return numbers.reduce((total, num) => total + num, 0);
}

console.log(sum(1, 2, 3)); // 6
console.log(sum(10, 20, 30, 40)); // 100
console.log(sum(5)); // 5
console.log(sum()); // 0 (খালি অ্যারে)
```

### 4.2 সাধারণ প্যারামিটারের সাথে Rest Parameter

Rest parameter সবসময় **শেষে** থাকতে হবে:

```typescript
// প্রথম প্যারামিটার নির্দিষ্ট, বাকিগুলো rest
function logMessages(level: string, ...messages: string[]): void {
  messages.forEach((msg) => {
    console.log(`[${level}]: ${msg}`);
  });
}

logMessages("INFO", "সার্ভার চালু", "পোর্ট 3000");
// [INFO]: সার্ভার চালু
// [INFO]: পোর্ট 3000

logMessages("ERROR", "ডেটাবেস সংযোগ ব্যর্থ");
// [ERROR]: ডেটাবেস সংযোগ ব্যর্থ
```

### 4.3 Rest Parameter-এ Tuple টাইপ

```typescript
// নির্দিষ্ট সংখ্যক rest parameter (Tuple)
function createFullName(...parts: [string, string, string?]): string {
  const [first, middle, last] = parts;
  if (last) {
    return `${first} ${middle} ${last}`;
  }
  return `${first} ${middle}`;
}

console.log(createFullName("মোহাম্মদ", "রিপন", "আহমেদ")); // "মোহাম্মদ রিপন আহমেদ"
console.log(createFullName("রিপন", "আহমেদ")); // "রিপন আহমেদ"
```

### 4.4 ব্যবহারিক উদাহরণ

```typescript
// ইভেন্ট হ্যান্ডলার
function addEventListeners(
  element: string,
  ...events: [string, () => void][]
): void {
  events.forEach(([event, handler]) => {
    console.log(`${element}-এ ${event} ইভেন্ট যোগ হলো`);
    handler();
  });
}

addEventListeners(
  "button",
  ["click", () => console.log("ক্লিক হয়েছে!")],
  ["hover", () => console.log("হোভার হয়েছে!")],
);

// Math ফাংশন
function findMax(first: number, ...rest: number[]): number {
  return rest.reduce((max, num) => (num > max ? num : max), first);
}

console.log(findMax(3, 7, 2, 9, 4)); // 9
console.log(findMax(10)); // 10
```

::: warning গুরুত্বপূর্ণ নিয়ম

- Rest parameter **সবসময় শেষ** প্যারামিটার হতে হবে
- একটি ফাংশনে **শুধু একটি** rest parameter থাকতে পারে
- Rest parameter সবসময় একটি **অ্যারে** হিসেবে আসে

```typescript
// ❌ ভুল — rest শেষে নেই
// function wrong(...nums: number[], last: string) {} // Error!

// ❌ ভুল — দুইটি rest parameter
// function wrong2(...a: number[], ...b: string[]) {} // Error!
```

:::

---

## 5. Function Overloading (ফাংশন ওভারলোডিং)

Function Overloading মানে **একই নামের ফাংশন**, কিন্তু **ভিন্ন ভিন্ন প্যারামিটার টাইপ বা সংখ্যা** অনুযায়ী ভিন্নভাবে কাজ করে। TypeScript-এ ওভারলোডিং করতে আগে **ওভারলোড সিগনেচার** (overload signatures) লিখতে হয়, তারপর **ইমপ্লিমেন্টেশন সিগনেচার** (implementation signature)।

### 5.1 বেসিক ওভারলোডিং

```typescript
// ওভারলোড সিগনেচার — কোন কোন ইনপুট গ্রহণ করবে তা বলে দেওয়া
function formatValue(value: string): string;
function formatValue(value: number): string;

// ইমপ্লিমেন্টেশন সিগনেচার — আসল লজিক
function formatValue(value: string | number): string {
  if (typeof value === "string") {
    return value.toUpperCase();
  }
  return value.toFixed(2);
}

console.log(formatValue("hello")); // "HELLO"
console.log(formatValue(3.14159)); // "3.14"
// formatValue(true);                // ❌ Error: No overload matches this call
```

### 5.2 বিভিন্ন সংখ্যক প্যারামিটার দিয়ে ওভারলোডিং

```typescript
// ১টি প্যারামিটার দিলে — নিজের সাথে যোগ
function combine(a: number): number;
// ২টি প্যারামিটার দিলে — দুইটি যোগ
function combine(a: number, b: number): number;
// ৩টি প্যারামিটার দিলে — তিনটি যোগ
function combine(a: number, b: number, c: number): number;

// ইমপ্লিমেন্টেশন
function combine(a: number, b?: number, c?: number): number {
  if (c !== undefined) return a + b! + c;
  if (b !== undefined) return a + b;
  return a + a; // নিজের সাথে যোগ
}

console.log(combine(5)); // 10 (5 + 5)
console.log(combine(5, 3)); // 8  (5 + 3)
console.log(combine(5, 3, 2)); // 10 (5 + 3 + 2)
```

### 5.3 বিভিন্ন রিটার্ন টাইপ দিয়ে ওভারলোডিং

```typescript
// string দিলে string[] রিটার্ন, number দিলে number রিটার্ন
function processInput(input: string): string[];
function processInput(input: number): number;

function processInput(input: string | number): string[] | number {
  if (typeof input === "string") {
    return input.split(" "); // স্ট্রিং ভেঙে অ্যারে করে
  }
  return input * 2; // সংখ্যা দ্বিগুণ করে
}

const words = processInput("hello world typescript"); // টাইপ: string[]
console.log(words); // ["hello", "world", "typescript"]

const doubled = processInput(21); // টাইপ: number
console.log(doubled); // 42
```

### 5.4 ব্যবহারিক উদাহরণ — createElement

```typescript
// HTML element তৈরির ফাংশন — ওভারলোডিং দিয়ে সঠিক টাইপ রিটার্ন
function createElement(tag: "a"): HTMLAnchorElement;
function createElement(tag: "canvas"): HTMLCanvasElement;
function createElement(tag: "div"): HTMLDivElement;
function createElement(tag: string): HTMLElement;

function createElement(tag: string): HTMLElement {
  return document.createElement(tag);
}

const link = createElement("a"); // টাইপ: HTMLAnchorElement — link.href ব্যবহার করা যাবে
const canvas = createElement("canvas"); // টাইপ: HTMLCanvasElement — canvas.getContext() ব্যবহারযোগ্য
const div = createElement("div"); // টাইপ: HTMLDivElement
const span = createElement("span"); // টাইপ: HTMLElement (generic)
```

::: info ওভারলোডিং vs ইউনিয়ন টাইপ — কোনটি ব্যবহার করবেন?

| পরিস্থিতি                                          | ব্যবহার করুন                     |
| -------------------------------------------------- | -------------------------------- |
| ইনপুট টাইপের উপর ভিত্তি করে **ভিন্ন রিটার্ন টাইপ** | ✅ Overloading                   |
| ভিন্ন সংখ্যক প্যারামিটার                           | ✅ Overloading                   |
| সব ইনপুটে **একই রিটার্ন টাইপ**                     | ❌ Union Type ব্যবহার করুন       |
| সিম্পল কেস                                         | ❌ Union Type ব্যবহার করুন (সহজ) |

**নিয়ম:** যদি সম্ভব হয়, ইউনিয়ন টাইপ দিয়ে সমাধান করুন। ওভারলোডিং ব্যবহার করুন শুধু যখন ইনপুট অনুযায়ী রিটার্ন টাইপ আলাদা হয়।
:::

---

## 6. Arrow Functions with Types (টাইপসহ অ্যারো ফাংশন)

Arrow function (`=>`) হলো ফাংশন লেখার একটি **সংক্ষিপ্ত পদ্ধতি**। TypeScript-এ অ্যারো ফাংশনেও টাইপ দেওয়া যায়।

### 6.1 বেসিক অ্যারো ফাংশন

```typescript
// সাধারণ ফাংশন
function add(a: number, b: number): number {
  return a + b;
}

// একই ফাংশন অ্যারো ফাংশন দিয়ে
const addArrow = (a: number, b: number): number => {
  return a + b;
};

// সংক্ষিপ্ত রূপ — একটি expression হলে {} এবং return বাদ দেওয়া যায়
const addShort = (a: number, b: number): number => a + b;

console.log(addArrow(3, 5)); // 8
console.log(addShort(3, 5)); // 8
```

### 6.2 ভেরিয়েবলে টাইপ এনোটেশন দিয়ে অ্যারো ফাংশন

```typescript
// ভেরিয়েবলে সম্পূর্ণ ফাংশন টাইপ দেওয়া
const greet: (name: string) => string = (name) => {
  return `হ্যালো, ${name}!`;
};

// type alias ব্যবহার করে (আরও পরিষ্কার)
type GreetFunction = (name: string) => string;

const greetV2: GreetFunction = (name) => `হ্যালো, ${name}!`;

console.log(greet("রিপন")); // "হ্যালো, রিপন!"
console.log(greetV2("করিম")); // "হ্যালো, করিম!"
```

### 6.3 অ্যারো ফাংশন — void রিটার্ন

```typescript
const logInfo: (msg: string) => void = (msg) => {
  console.log(`[INFO]: ${msg}`);
};

// অথবা type alias দিয়ে
type Logger = (message: string) => void;

const logWarning: Logger = (message) => {
  console.log(`[WARNING]: ${message}`);
};

logInfo("অ্যাপ চালু হয়েছে"); // [INFO]: অ্যাপ চালু হয়েছে
logWarning("মেমরি কম আছে"); // [WARNING]: মেমরি কম আছে
```

### 6.4 অ্যারো ফাংশন — অবজেক্ট রিটার্ন

অবজেক্ট রিটার্ন করতে চাইলে `()` দিয়ে ঘিরে দিতে হয়:

```typescript
interface User {
  name: string;
  age: number;
}

// ❌ ভুল — {} কে ফাংশন বডি মনে করবে!
// const createUser = (name: string, age: number): User => { name, age };

// ✅ সঠিক — () দিয়ে ঘিরতে হবে
const createUser = (name: string, age: number): User => ({ name, age });

const user = createUser("রিপন", 25);
console.log(user); // { name: "রিপন", age: 25 }
```

### 6.5 অ্যারে মেথডে অ্যারো ফাংশন

```typescript
const numbers: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

// map — প্রতিটি সংখ্যা দ্বিগুণ
const doubled: number[] = numbers.map((n: number): number => n * 2);
console.log(doubled); // [2, 4, 6, 8, 10, 12, 14, 16, 18, 20]

// filter — শুধু জোড় সংখ্যা
const evens: number[] = numbers.filter((n: number): boolean => n % 2 === 0);
console.log(evens); // [2, 4, 6, 8, 10]

// reduce — সবগুলোর যোগফল
const total: number = numbers.reduce(
  (sum: number, n: number): number => sum + n,
  0,
);
console.log(total); // 55

// find — প্রথম ৫-এর বেশি সংখ্যা
const firstBig: number | undefined = numbers.find(
  (n: number): boolean => n > 5,
);
console.log(firstBig); // 6
```

::: tip সাধারণ ফাংশন vs অ্যারো ফাংশন — কোনটি কখন?
| বৈশিষ্ট্য | সাধারণ ফাংশন (`function`) | অ্যারো ফাংশন (`=>`) |
|---|---|---|
| `this` বাইন্ডিং | নিজস্ব `this` তৈরি করে | বাইরের `this` ধরে রাখে |
| `arguments` অবজেক্ট | ✅ আছে | ❌ নেই |
| কনস্ট্রাক্টর হিসেবে | ✅ ব্যবহার করা যায় | ❌ করা যায় না |
| Hoisting | ✅ হয় | ❌ হয় না |
| সিনট্যাক্স | দীর্ঘ | **সংক্ষিপ্ত** |
| কলব্যাকে ব্যবহার | কম ব্যবহৃত | **বেশি ব্যবহৃত** |

**নিয়ম:**

- **কলব্যাক, মেথড চেইন, ছোট ফাংশন** → অ্যারো ফাংশন ✅
- **ক্লাস মেথড, জেনারেটর, `this` দরকার** → সাধারণ ফাংশন ✅
  :::

---

## সারসংক্ষেপ (Summary)

এই সেকশনে আমরা শিখলাম:

| বিষয়               | বিবরণ                       | উদাহরণ                            |
| ------------------- | --------------------------- | --------------------------------- |
| **Type Annotation** | প্যারামিটারের টাইপ নির্ধারণ | `function fn(x: number)`          |
| **Return Type**     | রিটার্ন মানের টাইপ          | `function fn(): string`           |
| **Optional Param**  | ঐচ্ছিক প্যারামিটার (`?`)    | `function fn(x?: number)`         |
| **Default Param**   | ডিফল্ট মান (`=`)            | `function fn(x: number = 10)`     |
| **Rest Param**      | অসীম আর্গুমেন্ট (`...`)     | `function fn(...nums: number[])`  |
| **Overloading**     | একই নামে ভিন্ন সিগনেচার     | একাধিক overload signature         |
| **Arrow Function**  | সংক্ষিপ্ত ফাংশন সিনট্যাক্স  | `const fn = (x: number) => x * 2` |

::: tip পরবর্তী ধাপ
Functions ভালোভাবে বুঝে থাকলে এবার **Interfaces & Type Aliases** সেকশনে যান, যেখানে শিখবেন কীভাবে কাস্টম টাইপ তৈরি করা যায় এবং অবজেক্টের স্ট্রাকচার ডিফাইন করা যায়।
:::
