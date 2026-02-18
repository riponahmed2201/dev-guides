# Getting Started (শুরু করা)

## ১. TypeScript কী এবং কেন ব্যবহার করবেন?

TypeScript হলো Microsoft কর্তৃক তৈরি জাভাস্ক্রিপ্টের একটি **Superset**। অর্থাৎ এটি জাভাস্ক্রিপ্টের সব ফিচার সাপোর্ট করে এবং সংসদে অতিরিক্ত কিছু শক্তিশালী ফিচার (যেমন: **Static Typing**, **Interfaces**, **Generics**) যোগ করে।

**কেন TypeScript ব্যবহার করবেন?**

| সুবিধা                          | ব্যাখ্যা                                         |
| ------------------------------- | ------------------------------------------------ |
| **কম্পাইল-টাইম এরর ধরা**        | কোড রান করার আগেই ভুল ধরা পড়ে                   |
| **IntelliSense / Autocomplete** | এডিটরে স্মার্ট সাজেশন পাওয়া যায়                |
| **কোড মেইনটেনেবিলিটি**          | বড় প্রোজেক্টে কোড বোঝা ও মেইনটেইন করা সহজ       |
| **টিম কোলাবরেশন**               | টাইপ থাকায় অন্যদের কোড সহজে বোঝা যায়           |
| **রিফ্যাক্টরিং**                | কোড পরিবর্তন করলে সম্পর্কিত এরর সাথে সাথে দেখায় |

```javascript
// JavaScript - এই ভুল রান করার আগে ধরা পড়বে না
function add(a, b) {
  return a + b;
}
console.log(add("5", 3)); // "53" 😱 (string concatenation হয়ে গেছে!)
```

```typescript
// TypeScript - এই ভুল এডিটরেই দেখাবে ✅
function add(a: number, b: number): number {
  return a + b;
}
console.log(add("5", 3)); // ❌ Error: Argument of type 'string' is not assignable to parameter of type 'number'
```

::: info TypeScript কোথায় ব্যবহার হয়?
বিশ্বের বড় বড় কোম্পানি TypeScript ব্যবহার করে: **Google** (Angular), **Meta** (React types), **Microsoft** (VS Code), **Slack**, **Airbnb**, **Shopify** এবং আরও অনেকে।
:::

---

## ২. TypeScript vs JavaScript

TypeScript এবং JavaScript এর মধ্যে মূল পার্থক্যগুলো নিচে দেখানো হলো:

| বৈশিষ্ট্য          | JavaScript           | TypeScript                      |
| ------------------ | -------------------- | ------------------------------- |
| **টাইপিং**         | ডাইনামিক (Dynamic)   | স্ট্যাটিক (Static)              |
| **এরর ধরা**        | রানটাইমে (ব্রাউজারে) | কম্পাইল টাইমে (এডিটরে)          |
| **কম্পাইলেশন**     | সরাসরি ব্রাউজারে চলে | প্রথমে JS-এ কম্পাইল হয়         |
| **ফাইল এক্সটেনশন** | `.js`                | `.ts`                           |
| **লার্নিং কার্ভ**  | সহজ                  | কিছুটা বেশি (JS জানা থাকলে সহজ) |
| **ইন্টারফেস**      | নেই                  | আছে                             |
| **Generics**       | নেই                  | আছে                             |

```javascript
// ---- JavaScript ----
// কোনো টাইপ বলে দিতে হয় না, কিন্তু ভুলও ধরা পড়ে না
let userName = "Ripon";
userName = 42; // ✅ কোনো এরর নেই (কিন্তু এটি বাগ হতে পারে!)
let items = [1, "two", 3]; // ✅ মিক্সড টাইপ, কোনো এরর নেই
```

```typescript
// ---- TypeScript ----
// টাইপ বলে দিতে হয়, তাই ভুল সাথে সাথে ধরা পড়ে
let userName: string = "Ripon";
userName = 42; // ❌ Error: Type 'number' is not assignable to type 'string'
let items: number[] = [1, 2, 3]; // ✅ শুধু নম্বর অ্যারে
items.push("four"); // ❌ Error: Argument of type 'string' is not assignable
```

::: tip মনে রাখবেন
TypeScript কোড সরাসরি ব্রাউজারে চলে না। এটি প্রথমে **JavaScript-এ compile** হয়, তারপর সেই JavaScript চলে। তাই TypeScript কে বলা হয় **"JavaScript with types"**।
:::

---

## ৩. Setting up TypeScript (এনভায়রনমেন্ট সেটআপ)

### Step 1: Node.js ইনস্টল করা

প্রথমে [Node.js](https://nodejs.org/) ইনস্টল করুন (LTS ভার্সন)। ইনস্টল হয়েছে কি না চেক করুন:

```bash
node --version    # যেমন: v20.11.0
npm --version     # যেমন: 10.2.4
```

### Step 2: TypeScript ইনস্টল করা

```bash
# গ্লোবালি ইনস্টল (সব প্রোজেক্টে ব্যবহার করা যাবে)
npm install -g typescript

# ভার্সন চেক করা
tsc --version     # যেমন: Version 5.3.3
```

### Step 3: `ts-node` ইনস্টল করা

`ts-node` ব্যবহার করলে TypeScript ফাইল সরাসরি চালানো যায় (আলাদা করে compile করতে হয় না):

```bash
npm install -g ts-node

# এখন সরাসরি TypeScript ফাইল চালানো যাবে
ts-node app.ts
```

### Step 4: `tsconfig.json` তৈরি করা

`tsconfig.json` হলো TypeScript প্রোজেক্টের **কনফিগারেশন ফাইল**। এটি TypeScript compiler-কে বলে দেয় কীভাবে কোড compile করতে হবে।

```bash
# tsconfig.json অটোমেটিক তৈরি করা
tsc --init
```

এটি একটি `tsconfig.json` ফাইল তৈরি করবে। গুরুত্বপূর্ণ অপশনগুলো:

```json
{
  "compilerOptions": {
    "target": "ES2020", // কোন JavaScript ভার্সনে compile হবে
    "module": "commonjs", // মডিউল সিস্টেম
    "strict": true, // সবচেয়ে কঠোর টাইপ চেকিং
    "outDir": "./dist", // compile হওয়া JS ফাইল কোথায় যাবে
    "rootDir": "./src", // TypeScript ফাইল কোথায় আছে
    "esModuleInterop": true, // ES Module import সাপোর্ট
    "skipLibCheck": true, // লাইব্রেরির টাইপ চেক স্কিপ (দ্রুত compile)
    "forceConsistentCasingInFileNames": true // ফাইল নামের কেস সংবেদনশীলতা
  },
  "include": ["src/**/*"], // কোন ফাইলগুলো compile করবে
  "exclude": ["node_modules"] // কোনগুলো বাদ দেবে
}
```

::: warning `strict: true` কেন রাখবেন?
`strict: true` চালু রাখলে TypeScript সবচেয়ে কঠোরভাবে টাইপ চেক করবে। এটি শুরুতে কিছুটা কঠিন লাগতে পারে, কিন্তু এটি আপনাকে অনেক বাগ থেকে রক্ষা করবে। প্রফেশনাল প্রোজেক্টে সবসময় এটি `true` রাখা উচিত।
:::

---

## ৪. Your First TypeScript Program (প্রথম TypeScript প্রোগ্রাম)

চলুন একটি সম্পূর্ণ TypeScript প্রোজেক্ট তৈরি করি:

### প্রোজেক্ট স্ট্রাকচার তৈরি করা:

```bash
mkdir my-first-ts-app
cd my-first-ts-app
npm init -y
npm install typescript --save-dev
npx tsc --init
mkdir src
```

### `src/index.ts` ফাইল তৈরি করা:

```typescript
// ---- আপনার প্রথম TypeScript ফাইল! ----

// ১. ভেরিয়েবল ডিক্লেয়ারেশন (টাইপ সহ)
const appName: string = "আমার প্রথম TypeScript অ্যাপ";
const version: number = 1.0;
const isActive: boolean = true;

console.log(`${appName} - v${version}`);
console.log(`অ্যাক্টিভ: ${isActive}`);

// ২. ইন্টারফেস দিয়ে অবজেক্টের গঠন তৈরি করা
interface Student {
  name: string;
  age: number;
  department: string;
  cgpa?: number; // অপশনাল (থাকতেও পারে, নাও পারে)
}

// ৩. ফাংশন (প্যারামিটার এবং রিটার্ন টাইপ সহ)
function greetStudent(student: Student): string {
  let message = `স্বাগতম ${student.name}! তুমি ${student.department} ডিপার্টমেন্টের ছাত্র।`;
  if (student.cgpa) {
    message += ` তোমার CGPA: ${student.cgpa}`;
  }
  return message;
}

// ৪. ব্যবহার করা
const myStudent: Student = {
  name: "করিম",
  age: 22,
  department: "CSE",
  cgpa: 3.75,
};

console.log(greetStudent(myStudent));
// Output: স্বাগতম করিম! তুমি CSE ডিপার্টমেন্টের ছাত্র। তোমার CGPA: 3.75

// ৫. অ্যারে (টাইপ সহ)
const students: Student[] = [
  { name: "রহিম", age: 21, department: "EEE" },
  { name: "কমল", age: 23, department: "BBA", cgpa: 3.5 },
];

students.forEach((s) => {
  console.log(greetStudent(s));
});
```

### কম্পাইল এবং রান করা:

```bash
# TypeScript কে JavaScript-এ compile করা
npx tsc

# compile হওয়া JavaScript ফাইল চালানো
node dist/index.js

# --- অথবা ts-node দিয়ে সরাসরি চালানো ---
npx ts-node src/index.ts
```

::: tip `npx tsc` কী করে?
এটি `src/` ফোল্ডারের সব `.ts` ফাইলকে `.js`-এ compile করে `dist/` ফোল্ডারে রাখে (যদি `tsconfig.json`-এ `outDir` সেট করা থাকে)।
:::

---

## ৫. TypeScript Playground (টাইপস্ক্রিপ্ট প্লেগ্রাউন্ড)

TypeScript Playground হলো একটি **অনলাইন এডিটর** যেখানে কোনো কিছু ইনস্টল না করেই সরাসরি ব্রাউজারে TypeScript কোড লিখে পরীক্ষা করা যায়।

**লিংক:** [https://www.typescriptlang.org/play](https://www.typescriptlang.org/play)

**Playground এ কী কী পাবেন?**

| ফিচার                  | কাজ                                                         |
| ---------------------- | ----------------------------------------------------------- |
| **Live Editor**        | বাম পাশে TypeScript লিখুন, ডান পাশে JavaScript আউটপুট দেখুন |
| **Errors Panel**       | নিচে এরর এবং ওয়ার্নিং দেখায়                               |
| **TypeScript Version** | বিভিন্ন TS ভার্সনে পরীক্ষা করা যায়                         |
| **Share Button**       | কোড শেয়ার করার লিংক তৈরি করা যায়                          |
| **Examples**           | বিল্ট-ইন উদাহরণ দেখে শেখা যায়                              |

**Playground এ এই কোড ট্রাই করুন:**

```typescript
// Playground এ পেস্ট করুন এবং দেখুন কী হয়!

// ✅ সঠিক কোড
let greeting: string = "হ্যালো, TypeScript! 🎉";
console.log(greeting);

// ❌ ভুল কোড - এডিটরে লাল রেখা দেখাবে
// greeting = 123; // Error: Type 'number' is not assignable to type 'string'

// ইন্টারফেস ট্রাই করুন
interface Product {
  name: string;
  price: number;
  inStock: boolean;
}

const laptop: Product = {
  name: "Dell XPS 15",
  price: 150000,
  inStock: true,
};

// টাইপ ভুল করলে Playground সাথে সাথে দেখাবে!
// const phone: Product = { name: "iPhone", price: "expensive" }; // ❌ Error!

console.log(`${laptop.name} - মূল্য: ${laptop.price} টাকা`);
```

::: tip Playground ব্যবহারের সেরা পদ্ধতি

1. নতুন কোনো TypeScript ফিচার শিখলে প্রথমে Playground-এ ট্রাই করুন।
2. ডান পাশের **"JS" ট্যাবে** দেখুন TypeScript কীভাবে JavaScript-এ রূপান্তরিত হচ্ছে।
3. **"Errors" ট্যাবে** দেখুন কোনো এরর আছে কি না।
4. **Share** বাটন দিয়ে আপনার কোড অন্যদের সাথে শেয়ার করুন।
   :::

---

::: tip পরবর্তী ধাপ
সেটআপ সম্পন্ন! এবার আমরা শিখবো **[Basic Types](./basic-types)** সম্পর্কে।
:::
