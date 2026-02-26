# Objects and Interfaces (অবজেক্ট ও ইন্টারফেস)

TypeScript-এ **অবজেক্ট** হলো key-value pair-এর সংকলন। আর **Interface** হলো অবজেক্টের **আকৃতি (shape)** বা **স্ট্রাকচার** ডিফাইন করার একটি শক্তিশালী উপায়। Interface ব্যবহার করলে কোড আরও **টাইপ-সেফ**, **পুনঃব্যবহারযোগ্য** এবং **পঠনযোগ্য** হয়।

---

## 1. Object Types (অবজেক্ট টাইপ)

TypeScript-এ অবজেক্টের প্রতিটি প্রপার্টির টাইপ স্পষ্টভাবে নির্ধারণ করা যায়।

### 1.1 ইনলাইন অবজেক্ট টাইপ

সরাসরি ভেরিয়েবল বা ফাংশন প্যারামিটারে অবজেক্টের স্ট্রাকচার লেখা যায়:

```typescript
// ইনলাইন অবজেক্ট টাইপ
let student: { name: string; age: number; department: string } = {
  name: "রিপন",
  age: 25,
  department: "CSE",
};

console.log(student.name); // "রিপন"
console.log(student.age); // 25

// ❌ ভুল — অবজেক্টে নেই এমন প্রপার্টি অ্যাক্সেস
// console.log(student.email); // Error: Property 'email' does not exist

// ❌ ভুল — ভুল টাইপ অ্যাসাইন
// student.age = "পঁচিশ"; // Error: Type 'string' is not assignable to type 'number'
```

### 1.2 ফাংশন প্যারামিটারে অবজেক্ট টাইপ

```typescript
// ফাংশনে অবজেক্ট প্যারামিটার
function printUser(user: { name: string; age: number }): void {
  console.log(`নাম: ${user.name}, বয়স: ${user.age}`);
}

printUser({ name: "করিম", age: 30 }); // "নাম: করিম, বয়স: 30"

// ❌ ভুল — প্রপার্টি বাদ দেওয়া
// printUser({ name: "করিম" }); // Error: Property 'age' is missing
```

### 1.3 টাইপ এলিয়াস দিয়ে অবজেক্ট টাইপ

`type` কিওয়ার্ড দিয়ে অবজেক্টের টাইপ আলাদা করে রাখা যায়:

```typescript
// type alias দিয়ে অবজেক্ট টাইপ সংজ্ঞায়িত
type Product = {
  id: number;
  name: string;
  price: number;
  inStock: boolean;
};

let laptop: Product = {
  id: 1,
  name: "Dell XPS 15",
  price: 150000,
  inStock: true,
};

let phone: Product = {
  id: 2,
  name: "iPhone 15",
  price: 180000,
  inStock: false,
};

// ফাংশনে ব্যবহার
function getProductInfo(product: Product): string {
  const status = product.inStock ? "স্টকে আছে ✅" : "স্টকে নেই ❌";
  return `${product.name} — ৳${product.price} (${status})`;
}

console.log(getProductInfo(laptop)); // "Dell XPS 15 — ৳150000 (স্টকে আছে ✅)"
console.log(getProductInfo(phone)); // "iPhone 15 — ৳180000 (স্টকে নেই ❌)"
```

### 1.4 নেস্টেড অবজেক্ট টাইপ

```typescript
type Address = {
  street: string;
  city: string;
  zip: string;
};

type Employee = {
  name: string;
  position: string;
  salary: number;
  address: Address; // নেস্টেড অবজেক্ট
};

let employee: Employee = {
  name: "রহিম",
  position: "Software Engineer",
  salary: 80000,
  address: {
    street: "মিরপুর রোড",
    city: "ঢাকা",
    zip: "1216",
  },
};

console.log(employee.address.city); // "ঢাকা"
```

::: tip অবজেক্ট টাইপ কেন গুরুত্বপূর্ণ?

- কোড লেখার সময় **autocomplete** পাওয়া যায়
- ভুল প্রপার্টি অ্যাক্সেস করলে **কম্পাইল টাইমে** এরর দেখায়
- কোডের **ডকুমেন্টেশন** হিসেবে কাজ করে
  :::

---

## 2. Interface Declarations (ইন্টারফেস ডিক্লেয়ারেশন)

`interface` হলো অবজেক্টের স্ট্রাকচার ডিফাইন করার **আনুষ্ঠানিক উপায়**। এটি `type` এর মতোই কাজ করে, তবে কিছু অতিরিক্ত সুবিধা দেয়।

### 2.1 বেসিক Interface

```typescript
// interface দিয়ে অবজেক্টের আকৃতি ডিফাইন
interface User {
  name: string;
  email: string;
  age: number;
}

// interface ব্যবহার করে অবজেক্ট তৈরি
let user1: User = {
  name: "রিপন আহমেদ",
  email: "ripon@example.com",
  age: 25,
};

let user2: User = {
  name: "করিম সাহেব",
  email: "karim@example.com",
  age: 30,
};

console.log(user1.name); // "রিপন আহমেদ"
console.log(user2.email); // "karim@example.com"

// ❌ ভুল — প্রপার্টি বাদ পড়েছে
// let user3: User = { name: "রহিম", email: "rahim@test.com" }; // Error: 'age' is missing

// ❌ ভুল — অতিরিক্ত প্রপার্টি
// let user4: User = { name: "রহিম", email: "rahim@test.com", age: 20, phone: "01700" }; // Error!
```

### 2.2 Interface-এ মেথড ডিফাইন করা

```typescript
interface Calculator {
  // প্রপার্টি
  brand: string;
  model: string;

  // মেথড — পদ্ধতি ১
  add(a: number, b: number): number;

  // মেথড — পদ্ধতি ২ (arrow syntax)
  subtract: (a: number, b: number) => number;
}

let calc: Calculator = {
  brand: "Casio",
  model: "fx-991EX",
  add(a, b) {
    return a + b;
  },
  subtract: (a, b) => a - b,
};

console.log(calc.add(10, 5)); // 15
console.log(calc.subtract(10, 5)); // 5
```

### 2.3 ফাংশনে Interface ব্যবহার

```typescript
interface LoginCredentials {
  username: string;
  password: string;
}

interface LoginResult {
  success: boolean;
  message: string;
  token?: string; // optional
}

function login(credentials: LoginCredentials): LoginResult {
  if (credentials.username === "admin" && credentials.password === "123456") {
    return {
      success: true,
      message: "লগইন সফল! ✅",
      token: "abc123xyz",
    };
  }
  return {
    success: false,
    message: "ভুল ইউজারনেম বা পাসওয়ার্ড ❌",
  };
}

const result = login({ username: "admin", password: "123456" });
console.log(result.message); // "লগইন সফল! ✅"
console.log(result.token); // "abc123xyz"
```

::: info `type` vs `interface` — পার্থক্য কী?
| বৈশিষ্ট্য | `interface` | `type` |
|---|---|---|
| অবজেক্ট টাইপ ডিফাইন | ✅ হ্যাঁ | ✅ হ্যাঁ |
| `extends` দিয়ে বাড়ানো | ✅ হ্যাঁ | ❌ `&` (intersection) ব্যবহার করতে হয় |
| Declaration Merging | ✅ হ্যাঁ (একই নামে একাধিকবার লেখা যায়) | ❌ না |
| Union / Intersection | ❌ না | ✅ হ্যাঁ |
| Primitive টাইপ | ❌ না | ✅ হ্যাঁ (`type ID = string \| number`) |
| কখন ব্যবহার? | অবজেক্ট ও ক্লাসের জন্য | ইউনিয়ন, ইন্টারসেকশন, primitive-এর জন্য |

**নিয়ম:** অবজেক্টের স্ট্রাকচার ডিফাইন করতে **interface** ব্যবহার করুন। জটিল টাইপ কম্পোজিশনের জন্য **type** ব্যবহার করুন।
:::

---

## 3. Optional Properties (ঐচ্ছিক প্রপার্টি — `?`)

কোনো প্রপার্টি থাকতেও পারে, নাও পারে — এমন ক্ষেত্রে প্রপার্টির নামের পরে `?` লাগানো হয়।

### 3.1 বেসিক Optional Property

```typescript
interface UserProfile {
  name: string; // বাধ্যতামূলক
  email: string; // বাধ্যতামূলক
  phone?: string; // ঐচ্ছিক
  bio?: string; // ঐচ্ছিক
  website?: string; // ঐচ্ছিক
}

// ✅ শুধু বাধ্যতামূলক প্রপার্টি দিলেই চলবে
let user1: UserProfile = {
  name: "রিপন",
  email: "ripon@example.com",
};

// ✅ ঐচ্ছিক প্রপার্টিও দেওয়া যায়
let user2: UserProfile = {
  name: "করিম",
  email: "karim@example.com",
  phone: "01712345678",
  bio: "ফুলস্ট্যাক ডেভেলপার",
};

console.log(user1.phone); // undefined
console.log(user2.phone); // "01712345678"
```

### 3.2 Optional Property ব্যবহার করার সময় সাবধানতা

```typescript
interface Config {
  host: string;
  port?: number;
  ssl?: boolean;
}

function connectToServer(config: Config): string {
  // ❌ সরাসরি ব্যবহার করলে undefined হতে পারে
  // const url = `${config.host}:${config.port}`; // port undefined হতে পারে!

  // ✅ নিরাপদ উপায় ১ — if চেক
  const port = config.port !== undefined ? config.port : 3000;

  // ✅ নিরাপদ উপায় ২ — Nullish Coalescing (??)
  const ssl = config.ssl ?? false;

  const protocol = ssl ? "https" : "http";
  return `${protocol}://${config.host}:${port}`;
}

console.log(connectToServer({ host: "localhost" }));
// "http://localhost:3000"

console.log(
  connectToServer({ host: "api.example.com", port: 8080, ssl: true }),
);
// "https://api.example.com:8080"
```

### 3.3 Optional Methods

```typescript
interface EventHandler {
  onClick(): void;
  onHover?(): void; // ঐচ্ছিক মেথড
  onFocus?(): void; // ঐচ্ছিক মেথড
}

let button: EventHandler = {
  onClick() {
    console.log("ক্লিক হয়েছে!");
  },
  onHover() {
    console.log("হোভার হয়েছে!");
  },
  // onFocus দেওয়া হয়নি — কোনো সমস্যা নেই ✅
};

button.onClick(); // "ক্লিক হয়েছে!"
button.onHover?.(); // "হোভার হয়েছে!" (optional chaining দিয়ে নিরাপদে কল)
button.onFocus?.(); // undefined — কিন্তু ক্র্যাশ হবে না ✅
```

---

## 4. Readonly Properties (শুধু-পঠনযোগ্য প্রপার্টি)

`readonly` কিওয়ার্ড ব্যবহার করলে কোনো প্রপার্টি **একবার মান দেওয়ার পর আর পরিবর্তন করা যায় না**।

### 4.1 বেসিক Readonly

```typescript
interface DatabaseConfig {
  readonly host: string;
  readonly port: number;
  readonly database: string;
  username: string; // এটি পরিবর্তনযোগ্য
  password: string; // এটি পরিবর্তনযোগ্য
}

let dbConfig: DatabaseConfig = {
  host: "localhost",
  port: 5432,
  database: "myapp_db",
  username: "admin",
  password: "secret123",
};

// ✅ পরিবর্তনযোগ্য প্রপার্টি পরিবর্তন করা যায়
dbConfig.username = "new_admin";
dbConfig.password = "new_password";

// ❌ readonly প্রপার্টি পরিবর্তন করা যাবে না!
// dbConfig.host = "192.168.1.1";  // Error: Cannot assign to 'host' because it is a read-only property
// dbConfig.port = 3306;           // Error: Cannot assign to 'port'
// dbConfig.database = "other_db"; // Error: Cannot assign to 'database'
```

### 4.2 Readonly অবজেক্ট এবং অ্যারে

```typescript
interface Point {
  readonly x: number;
  readonly y: number;
}

let origin: Point = { x: 0, y: 0 };
// origin.x = 10; // ❌ Error!

// Readonly অ্যারে
interface Student {
  readonly name: string;
  readonly rollNumber: number;
  readonly grades: readonly number[]; // readonly অ্যারে
}

let student: Student = {
  name: "রিপন",
  rollNumber: 101,
  grades: [90, 85, 92],
};

// ❌ সব readonly
// student.name = "করিম";       // Error!
// student.grades.push(88);      // Error: Property 'push' does not exist on type 'readonly number[]'
// student.grades[0] = 100;      // Error: Index signature in type 'readonly number[]' only permits reading

console.log(student.grades[0]); // ✅ পড়া যায়: 90
```

### 4.3 `Readonly<T>` ইউটিলিটি টাইপ

TypeScript-এর বিল্ট-ইন `Readonly<T>` দিয়ে পুরো অবজেক্ট readonly করা যায়:

```typescript
interface User {
  name: string;
  email: string;
  age: number;
}

// পুরো User-কে readonly করা
let frozenUser: Readonly<User> = {
  name: "রিপন",
  email: "ripon@example.com",
  age: 25,
};

// ❌ কোনো প্রপার্টিই পরিবর্তন করা যাবে না!
// frozenUser.name = "করিম";    // Error!
// frozenUser.email = "new@test.com"; // Error!
// frozenUser.age = 30;         // Error!

console.log(frozenUser.name); // ✅ পড়া যায়: "রিপন"
```

::: warning কখন `readonly` ব্যবহার করবেন?

- **কনফিগারেশন** অবজেক্ট — যেগুলো একবার সেট হলে বদলানো উচিত না
- **ID, তৈরির তারিখ** — যেগুলো কখনোই বদলায় না
- **ইম্যিউটেবল ডেটা স্ট্রাকচার** — ফাংশনাল প্রোগ্রামিংয়ে
- **API রেসপন্স** — বাইরে থেকে আসা ডেটা পরিবর্তন না করা ভালো চর্চা
  :::

---

## 5. Index Signatures (ইনডেক্স সিগনেচার)

কখনো কখনো অবজেক্টে **কতগুলো প্রপার্টি থাকবে তা আগে থেকে জানা যায় না**, কিন্তু সব প্রপার্টির **key এবং value-এর টাইপ** একই। এই পরিস্থিতিতে **Index Signature** ব্যবহার করা হয়।

### 5.1 বেসিক Index Signature

```typescript
// string key আর number value
interface Scores {
  [subject: string]: number;
}

let examScores: Scores = {
  bangla: 85,
  english: 90,
  math: 78,
  science: 92,
};

// ডায়নামিকভাবে প্রপার্টি যোগ করা যায়
examScores["history"] = 88;
examScores["ict"] = 95;

console.log(examScores.bangla); // 85
console.log(examScores["history"]); // 88

// ❌ ভুল — value string হওয়া চলবে না
// examScores["art"] = "excellent"; // Error: Type 'string' is not assignable to type 'number'
```

### 5.2 নির্দিষ্ট প্রপার্টি + Index Signature

```typescript
interface UserData {
  // নির্দিষ্ট প্রপার্টি
  name: string;
  email: string;

  // বাকি যেকোনো প্রপার্টি — string বা number হবে
  [key: string]: string | number;
}

let userData: UserData = {
  name: "রিপন",
  email: "ripon@example.com",
  age: 25, // ✅ number — চলবে
  phone: "01712345678", // ✅ string — চলবে
  city: "ঢাকা", // ✅ string — চলবে
};

// ❌ ভুল — boolean চলবে না
// userData.active = true; // Error: Type 'boolean' is not assignable to type 'string | number'
```

::: warning গুরুত্বপূর্ণ নিয়ম
নির্দিষ্ট প্রপার্টির টাইপ অবশ্যই index signature-এর value টাইপের **সাবসেট** হতে হবে:

```typescript
// ❌ ভুল — name হলো string, কিন্তু index signature-এ শুধু number
// interface Wrong {
//   name: string;              // ❌ Error!
//   [key: string]: number;
// }

// ✅ সঠিক — name হলো string, index signature-এ string | number আছে
interface Correct {
  name: string;
  [key: string]: string | number;
}
```

:::

### 5.3 Number Index Signature

```typescript
// number key দিয়ে — অ্যারে-এর মতো কাজ করে
interface StringArray {
  [index: number]: string;
}

let colors: StringArray = ["লাল", "সবুজ", "নীল"];
console.log(colors[0]); // "লাল"
console.log(colors[1]); // "সবুজ"

// Dictionary প্যাটার্ন
interface Dictionary {
  [word: string]: string;
}

let bnToEn: Dictionary = {
  বিড়াল: "cat",
  কুকুর: "dog",
  পাখি: "bird",
};

console.log(bnToEn["বিড়াল"]); // "cat"
```

### 5.4 Readonly Index Signature

```typescript
interface ReadonlyScores {
  readonly [subject: string]: number;
}

let finalScores: ReadonlyScores = {
  bangla: 85,
  english: 90,
};

console.log(finalScores.bangla); // ✅ পড়া যায়: 85

// ❌ পরিবর্তন করা যাবে না
// finalScores.bangla = 95;     // Error: Index signature in type 'ReadonlyScores' only permits reading
// finalScores["math"] = 80;    // Error!
```

---

## 6. Extending Interfaces (ইন্টারফেস বাড়ানো / এক্সটেন্ড করা)

একটি Interface থেকে আরেকটি Interface তৈরি করা যায় `extends` কিওয়ার্ড দিয়ে। এতে **আগের সব প্রপার্টি** নতুন Interface-এ চলে আসে এবং **নতুন প্রপার্টি** যোগ করা যায়।

### 6.1 সিঙ্গেল Interface এক্সটেন্ড

```typescript
// বেস Interface
interface Person {
  name: string;
  age: number;
}

// Person-কে extend করে Student তৈরি
interface Student extends Person {
  rollNumber: number;
  department: string;
}

// Person-কে extend করে Teacher তৈরি
interface Teacher extends Person {
  employeeId: string;
  subject: string;
  salary: number;
}

let student: Student = {
  name: "রিপন", // Person থেকে এসেছে
  age: 22, // Person থেকে এসেছে
  rollNumber: 101, // Student-এর নিজস্ব
  department: "CSE", // Student-এর নিজস্ব
};

let teacher: Teacher = {
  name: "ড. করিম", // Person থেকে এসেছে
  age: 45, // Person থেকে এসেছে
  employeeId: "T-001", // Teacher-এর নিজস্ব
  subject: "গণিত", // Teacher-এর নিজস্ব
  salary: 60000, // Teacher-এর নিজস্ব
};

console.log(student.name); // "রিপন" ✅
console.log(teacher.employeeId); // "T-001" ✅
```

### 6.2 মাল্টিপল Interface এক্সটেন্ড

একসাথে একাধিক Interface এক্সটেন্ড করা যায়:

```typescript
interface HasName {
  name: string;
}

interface HasEmail {
  email: string;
}

interface HasRole {
  role: "admin" | "editor" | "viewer";
}

// তিনটি interface একসাথে extend
interface AdminUser extends HasName, HasEmail, HasRole {
  permissions: string[];
}

let admin: AdminUser = {
  name: "রিপন আহমেদ",
  email: "ripon@admin.com",
  role: "admin",
  permissions: ["create", "read", "update", "delete"],
};

console.log(admin.name); // "রিপন আহমেদ"
console.log(admin.role); // "admin"
console.log(admin.permissions); // ["create", "read", "update", "delete"]
```

### 6.3 চেইন এক্সটেন্ডিং

```typescript
// স্তরে স্তরে extend করা
interface BaseEntity {
  id: number;
  createdAt: Date;
  updatedAt: Date;
}

interface SoftDeletable extends BaseEntity {
  deletedAt?: Date;
  isDeleted: boolean;
}

interface BlogPost extends SoftDeletable {
  title: string;
  content: string;
  author: string;
  tags: string[];
}

let post: BlogPost = {
  // BaseEntity থেকে
  id: 1,
  createdAt: new Date("2025-01-15"),
  updatedAt: new Date("2025-02-20"),

  // SoftDeletable থেকে
  isDeleted: false,

  // BlogPost-এর নিজস্ব
  title: "TypeScript শিখুন",
  content: "TypeScript খুবই শক্তিশালী...",
  author: "রিপন",
  tags: ["typescript", "programming", "tutorial"],
};

console.log(post.title); // "TypeScript শিখুন"
console.log(post.isDeleted); // false
console.log(post.id); // 1
```

### 6.4 Interface Merging (Declaration Merging)

একই নামে দুইবার interface লিখলে TypeScript সেগুলো **স্বয়ংক্রিয়ভাবে একত্রিত** করে:

```typescript
// প্রথম ডিক্লেয়ারেশন
interface AppConfig {
  appName: string;
  version: string;
}

// দ্বিতীয় ডিক্লেয়ারেশন — একই নামে
interface AppConfig {
  debug: boolean;
  port: number;
}

// দুইটি মিলে একটি হয়ে গেছে — সবগুলো প্রপার্টি দিতে হবে
let config: AppConfig = {
  appName: "MyApp",
  version: "1.0.0",
  debug: true,
  port: 3000,
};

console.log(config.appName); // "MyApp"
console.log(config.port); // 3000
```

::: tip Declaration Merging কোথায় কাজে লাগে?

- **তৃতীয়-পক্ষের লাইব্রেরি** এক্সটেন্ড করতে (যেমন: Express.js এর `Request` অবজেক্টে নতুন প্রপার্টি যোগ)
- **বড় প্রজেক্টে** interface-কে একাধিক ফাইলে ভাগ করতে
- **প্লাগইন সিস্টেম** তৈরি করতে

```typescript
// উদাহরণ: Express.js Request এক্সটেন্ড
declare namespace Express {
  interface Request {
    user?: { id: number; name: string };
  }
}
```

:::

---

## সারসংক্ষেপ (Summary)

এই সেকশনে আমরা শিখলাম:

| বিষয়               | বিবরণ                         | উদাহরণ                            |
| ------------------- | ----------------------------- | --------------------------------- |
| **Object Type**     | অবজেক্টের স্ট্রাকচার ডিফাইন   | `{ name: string; age: number }`   |
| **Interface**       | আনুষ্ঠানিক টাইপ ডিক্লেয়ারেশন | `interface User { name: string }` |
| **Optional (`?`)**  | ঐচ্ছিক প্রপার্টি              | `phone?: string`                  |
| **Readonly**        | পরিবর্তন-অযোগ্য প্রপার্টি     | `readonly id: number`             |
| **Index Signature** | ডায়নামিক key-value           | `[key: string]: number`           |
| **Extends**         | ইন্টারফেস বাড়ানো             | `interface B extends A {}`        |
| **Merging**         | একই নামে ইন্টারফেস একত্রীকরণ  | একই নামে দুইবার `interface`       |

::: tip পরবর্তী ধাপ
Objects ও Interfaces ভালোভাবে বুঝে থাকলে এবার **Type Aliases & Union Types** সেকশনে যান, যেখানে শিখবেন `type` কিওয়ার্ড দিয়ে কাস্টম টাইপ তৈরি এবং Union (`|`) ও Intersection (`&`) টাইপ ব্যবহার।
:::
