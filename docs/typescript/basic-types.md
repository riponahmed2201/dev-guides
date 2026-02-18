# Basic Types (প্রাথমিক ডেটা টাইপ)

TypeScript-এর সবচেয়ে গুরুত্বপূর্ণ ফিচার হলো এর **Type System**। এই সেকশনে আমরা TypeScript-এ ব্যবহৃত সব মৌলিক ডেটা টাইপ বিস্তারিতভাবে শিখবো — উদাহরণ ও ব্যবহারিক কোডসহ।

---

## 1. Primitive Types (আদিম টাইপ)

Primitive types হলো সবচেয়ে মৌলিক ডেটা টাইপ। TypeScript-এ তিনটি প্রধান primitive type আছে: **string**, **number**, এবং **boolean**।

### 1.1 `string` (স্ট্রিং / টেক্সট)

`string` টাইপ দিয়ে যেকোনো টেক্সট ডেটা রাখা হয়। Single quote (`'`), double quote (`"`) বা backtick (`` ` ``) দিয়ে স্ট্রিং তৈরি করা যায়।

```typescript
// string টাইপ ডিক্লেয়ারেশন
let firstName: string = "রিপন";
let lastName: string = "আহমেদ";
let fullName: string = `${firstName} ${lastName}`; // Template Literal

console.log(fullName); // "রিপন আহমেদ"

// ❌ ভুল — string-এ number অ্যাসাইন করা যাবে না
// let name: string = 123; // Error: Type 'number' is not assignable to type 'string'
```

::: tip কখন `string` ব্যবহার করবেন?
নাম, ঠিকানা, মেসেজ, ইমেইল — যেকোনো টেক্সট ডেটার জন্য `string` ব্যবহার করুন।
:::

### 1.2 `number` (সংখ্যা)

TypeScript-এ **integer** এবং **float** আলাদা টাইপ নেই — সবই `number`। এতে decimal, hex, octal এবং binary সংখ্যা রাখা যায়।

```typescript
// বিভিন্ন ধরনের number
let age: number = 25; // পূর্ণসংখ্যা (integer)
let price: number = 99.99; // দশমিক (float)
let hex: number = 0xff; // হেক্সাডেসিমাল (255)
let binary: number = 0b1010; // বাইনারি (10)
let octal: number = 0o744; // অক্টাল (484)
let billion: number = 1_000_000_000; // আন্ডারস্কোর সেপারেটর (পড়তে সুবিধা)

// বিশেষ সংখ্যা
let inf: number = Infinity;
let notANum: number = NaN;

console.log(age); // 25
console.log(hex); // 255
console.log(binary); // 10

// ❌ ভুল
// let count: number = "দশ"; // Error: Type 'string' is not assignable to type 'number'
```

::: info `bigint` টাইপ
খুব বড় সংখ্যার জন্য TypeScript-এ `bigint` টাইপও আছে:

```typescript
let bigNumber: bigint = 9007199254740991n;
```

:::

### 1.3 `boolean` (বুলিয়ান — সত্য/মিথ্যা)

`boolean` টাইপে শুধু দুটি মান রাখা যায়: `true` অথবা `false`।

```typescript
let isLoggedIn: boolean = true;
let hasPermission: boolean = false;
let isAdult: boolean = age >= 18; // expression থেকে boolean

console.log(isLoggedIn); // true
console.log(isAdult); // true (কারণ age = 25)

// কন্ডিশনে ব্যবহার
if (isLoggedIn && hasPermission) {
  console.log("অ্যাক্সেস আছে ✅");
} else {
  console.log("অ্যাক্সেস নেই ❌");
}

// ❌ ভুল
// let isActive: boolean = "yes"; // Error: Type 'string' is not assignable to type 'boolean'
// let flag: boolean = 1;          // Error: Type 'number' is not assignable to type 'boolean'
```

::: warning সাবধান!
JavaScript-এ `0`, `""`, `null`, `undefined` কে `false` হিসেবে ধরা হয় (falsy values)। কিন্তু TypeScript-এ `boolean` টাইপ শুধু `true` বা `false` গ্রহণ করে — `0` বা `1` গ্রহণ করে না।
:::

---

## 2. Array এবং Tuple Types (অ্যারে এবং টাপল)

### 2.1 Array (অ্যারে)

TypeScript-এ অ্যারে ডিক্লেয়ার করার **দুটি পদ্ধতি** আছে:

```typescript
// পদ্ধতি ১: type[] সিনট্যাক্স (বেশি জনপ্রিয়)
let numbers: number[] = [1, 2, 3, 4, 5];
let names: string[] = ["রিপন", "করিম", "রহিম"];
let flags: boolean[] = [true, false, true];

// পদ্ধতি ২: Array<type> সিনট্যাক্স (Generic)
let scores: Array<number> = [85, 92, 78];
let cities: Array<string> = ["ঢাকা", "চট্টগ্রাম", "সিলেট"];
```

**অ্যারে অপারেশন:**

```typescript
let fruits: string[] = ["আম", "কাঁঠাল"];

// এলিমেন্ট যোগ করা
fruits.push("লিচু"); // ✅ string যোগ করা যাবে
// fruits.push(123);            // ❌ Error: number যোগ করা যাবে না!

// অ্যারে মেথড ব্যবহার
let uppercased = fruits.map((f) => f.toUpperCase());
let longNames = fruits.filter((f) => f.length > 2);
let total = [10, 20, 30].reduce((sum, n) => sum + n, 0);

console.log(uppercased); // ["আম", "কাঁঠাল", "লিচু"] (বাংলায় toUpperCase কাজ করবে না, just example)
console.log(total); // 60

// মাল্টি-ডাইমেনশনাল অ্যারে (2D Array)
let matrix: number[][] = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
];
console.log(matrix[1][2]); // 6
```

### 2.2 Tuple (টাপল)

Tuple হলো একটি **নির্দিষ্ট দৈর্ঘ্য** এবং **নির্দিষ্ট টাইপের** অ্যারে। প্রতিটি পজিশনে কোন টাইপ হবে তা আগে থেকে বলে দেওয়া হয়।

```typescript
// Tuple: প্রথম এলিমেন্ট string, দ্বিতীয়টি number
let student: [string, number] = ["করিম", 22];

console.log(student[0]); // "করিম" (string)
console.log(student[1]); // 22 (number)

// ❌ ভুল — টাইপ বা অর্ডার মিলছে না
// let wrong: [string, number] = [22, "করিম"]; // Error!
// let alsoWrong: [string, number] = ["করিম"];  // Error: Missing element

// একাধিক টাইপের Tuple
let record: [number, string, boolean] = [1, "রিপন", true];

// Tuple-এ destructuring
let [id, name, isActive] = record;
console.log(id); // 1
console.log(name); // "রিপন"
console.log(isActive); // true
```

**Readonly Tuple:**

```typescript
// readonly tuple — কোনো পরিবর্তন করা যাবে না
let point: readonly [number, number] = [10, 20];

// point[0] = 30; // ❌ Error: Cannot assign to '0' because it is a read-only property
// point.push(30); // ❌ Error: Property 'push' does not exist on type 'readonly [number, number]'

console.log(point); // [10, 20]
```

**Named Tuple (TypeScript 4.0+):**

```typescript
// Named tuple — প্রতিটি এলিমেন্টের নাম দেওয়া যায় (ডকুমেন্টেশনের জন্য সুবিধাজনক)
type UserInfo = [name: string, age: number, email: string];

let user: UserInfo = ["রিপন", 25, "ripon@example.com"];
```

::: tip Array vs Tuple — পার্থক্য কী?
| বৈশিষ্ট্য | Array | Tuple |
|---|---|---|
| দৈর্ঘ্য | যেকোনো সংখ্যক | নির্দিষ্ট সংখ্যক |
| টাইপ | সব এলিমেন্ট একই টাইপ | প্রতিটি এলিমেন্ট আলাদা টাইপ হতে পারে |
| ব্যবহার | লিস্ট/কালেকশন | নির্দিষ্ট স্ট্রাকচারের ডেটা (যেমন: coordinate, key-value) |
:::

---

## 3. Enum Types (ইনাম টাইপ)

Enum (Enumeration) দিয়ে কতগুলো **সম্পর্কিত কনস্ট্যান্ট ভ্যালু** কে একটি নামের আওতায় গ্রুপ করা যায়। এটি কোডকে আরও **পঠনযোগ্য** এবং **মেইনটেনেবল** করে।

### 3.1 Numeric Enum (সংখ্যাভিত্তিক ইনাম)

ডিফল্টভাবে enum-এর মান `0` থেকে শুরু হয়:

```typescript
enum Direction {
  Up, // 0
  Down, // 1
  Left, // 2
  Right, // 3
}

let move: Direction = Direction.Up;
console.log(move); // 0
console.log(Direction.Right); // 3

// কাস্টম মান দিয়ে শুরু করা
enum StatusCode {
  OK = 200,
  NotFound = 404,
  ServerError = 500,
}

console.log(StatusCode.OK); // 200
console.log(StatusCode.NotFound); // 404
```

### 3.2 String Enum (স্ট্রিং ইনাম)

String enum-এ প্রতিটি মেম্বারকে একটি স্ট্রিং ভ্যালু দিতে হয়:

```typescript
enum Color {
  Red = "RED",
  Green = "GREEN",
  Blue = "BLUE",
}

let favoriteColor: Color = Color.Green;
console.log(favoriteColor); // "GREEN"

// ব্যবহারিক উদাহরণ
enum UserRole {
  Admin = "ADMIN",
  Editor = "EDITOR",
  Viewer = "VIEWER",
}

function checkAccess(role: UserRole): string {
  if (role === UserRole.Admin) {
    return "সব অ্যাক্সেস আছে ✅";
  } else if (role === UserRole.Editor) {
    return "এডিট করতে পারবেন ✏️";
  } else {
    return "শুধু দেখতে পারবেন 👀";
  }
}

console.log(checkAccess(UserRole.Admin)); // "সব অ্যাক্সেস আছে ✅"
```

### 3.3 Const Enum (কনস্ট ইনাম)

`const enum` ব্যবহার করলে কম্পাইলের সময় enum সম্পূর্ণভাবে মুছে যায় এবং সরাসরি মান বসিয়ে দেয়। এতে **পারফরম্যান্স ভালো** হয়:

```typescript
const enum Size {
  Small = "S",
  Medium = "M",
  Large = "L",
}

let shirtSize = Size.Medium;
// কম্পাইল হলে JavaScript-এ এটি হবে:
// let shirtSize = "M";  (enum অবজেক্ট তৈরি হবে না)
```

### 3.4 Reverse Mapping (রিভার্স ম্যাপিং)

Numeric enum-এ মান থেকে নাম বের করা যায়:

```typescript
enum Status {
  Active = 1,
  Inactive = 2,
  Pending = 3,
}

console.log(Status[1]); // "Active" — মান থেকে নাম পাওয়া
console.log(Status[2]); // "Inactive"

// ⚠️ String enum-এ reverse mapping কাজ করে না!
```

::: warning কখন Enum ব্যবহার করবেন?

- যখন কতগুলো **নির্দিষ্ট অপশন** আছে (যেমন: দিক, রঙ, স্ট্যাটাস)
- যখন **ম্যাজিক নম্বর** (যেমন: `1`, `2`, `3`) এড়াতে চান
- যখন কোডকে আরও **পঠনযোগ্য** করতে চান

তবে অনেক ক্ষেত্রে **Union Types** (`type Direction = "up" | "down"`) enum-এর চেয়ে ভালো বিকল্প।
:::

---

## 4. Any, Unknown, Never, Void (বিশেষ টাইপ)

TypeScript-এ কিছু বিশেষ টাইপ আছে যেগুলো নির্দিষ্ট পরিস্থিতিতে ব্যবহার করা হয়।

### 4.1 `any` (যেকোনো টাইপ)

`any` টাইপ দিলে TypeScript **কোনো টাইপ চেকিং করে না**। এটি মূলত টাইপ সিস্টেমকে বন্ধ করে দেয়।

```typescript
let data: any = "হ্যালো";
data = 42; // ✅ কোনো এরর নেই
data = true; // ✅ কোনো এরর নেই
data = [1, 2, 3]; // ✅ কোনো এরর নেই

// any দিলে যেকোনো অপারেশন করা যায় — এবং TypeScript চুপ থাকে!
data.foo(); // ✅ কোনো এরর নেই (কিন্তু রানটাইমে ক্র্যাশ হবে!)
data.bar.baz; // ✅ কোনো এরর নেই (কিন্তু রানটাইমে ক্র্যাশ হবে!)
```

::: danger `any` ব্যবহার করবেন না!
`any` ব্যবহার করলে TypeScript-এর পুরো সুবিধা হারিয়ে যায়। এটি মূলত JavaScript-এর মতো হয়ে যায়। শুধুমাত্র **জরুরি প্রয়োজনে** (যেমন: তৃতীয়-পক্ষের লাইব্রেরি যেখানে টাইপ নেই) `any` ব্যবহার করুন।
:::

### 4.2 `unknown` (অজানা টাইপ — any এর নিরাপদ বিকল্প)

`unknown` টাইপও যেকোনো মান গ্রহণ করে, কিন্তু ব্যবহার করার আগে **টাইপ চেক করতে হয়**। এটি `any` এর চেয়ে অনেক নিরাপদ।

```typescript
let value: unknown = "হ্যালো TypeScript";

// ❌ সরাসরি ব্যবহার করা যাবে না
// console.log(value.length); // Error: Object is of type 'unknown'
// value.toUpperCase();       // Error!

// ✅ টাইপ চেক করে ব্যবহার করতে হবে
if (typeof value === "string") {
  console.log(value.length); // ✅ এখন কাজ করবে (15)
  console.log(value.toUpperCase()); // ✅ এখন কাজ করবে
}

if (typeof value === "number") {
  console.log(value.toFixed(2)); // ✅ number হলে এটি চলবে
}

// ব্যবহারিক উদাহরণ — API রেসপন্স
function processApiResponse(response: unknown): string {
  if (typeof response === "string") {
    return response;
  }
  if (
    typeof response === "object" &&
    response !== null &&
    "message" in response
  ) {
    return (response as { message: string }).message;
  }
  return "অজানা রেসপন্স";
}
```

::: tip `any` vs `unknown` — পার্থক্য
| বৈশিষ্ট্য | `any` | `unknown` |
|---|---|---|
| যেকোনো মান অ্যাসাইন | ✅ হ্যাঁ | ✅ হ্যাঁ |
| সরাসরি ব্যবহার | ✅ হ্যাঁ (অনিরাপদ!) | ❌ না (টাইপ চেক লাগবে) |
| টাইপ সেফটি | ❌ নেই | ✅ আছে |
| কখন ব্যবহার? | শুধু জরুরি ক্ষেত্রে | `any` এর বদলে সবসময় |

**নিয়ম: `any` এর বদলে সবসময় `unknown` ব্যবহার করার চেষ্টা করুন!**
:::

### 4.3 `void` (কিছু রিটার্ন করে না)

`void` ব্যবহার করা হয় যখন কোনো ফাংশন **কিছু রিটার্ন করে না**।

```typescript
// void ফাংশন — কিছু রিটার্ন করে না
function logMessage(message: string): void {
  console.log(`[LOG]: ${message}`);
  // return কিছু নেই
}

logMessage("সার্ভার চালু হয়েছে"); // [LOG]: সার্ভার চালু হয়েছে

// Arrow function-এ void
const printHello = (): void => {
  console.log("হ্যালো!");
};

// ❌ void ফাংশন থেকে কিছু রিটার্ন করা যাবে না
// function wrong(): void {
//   return "something"; // Error: Type 'string' is not assignable to type 'void'
// }

// void ভেরিয়েবলে শুধু undefined অ্যাসাইন করা যায়
let nothing: void = undefined;
```

### 4.4 `never` (কখনো ঘটে না)

`never` টাইপ বোঝায় যে ফাংশনটি **কখনো শেষ হবে না** বা **কখনো কোনো মান রিটার্ন করবে না**।

```typescript
// ১. যে ফাংশন সবসময় Error throw করে
function throwError(message: string): never {
  throw new Error(message);
}

// ২. যে ফাংশন অসীম লুপে চলে
function infiniteLoop(): never {
  while (true) {
    // কখনো বের হবে না
  }
}

// ৩. Exhaustive check — সব কেস কভার হয়েছে কি না তা নিশ্চিত করা
type Shape = "circle" | "square" | "triangle";

function getArea(shape: Shape): number {
  switch (shape) {
    case "circle":
      return Math.PI * 10 * 10;
    case "square":
      return 10 * 10;
    case "triangle":
      return (10 * 5) / 2;
    default:
      // এখানে shape-এর টাইপ হবে `never`
      // যদি নতুন shape যোগ করেন কিন্তু case না লিখেন, TypeScript এরর দেখাবে!
      const _exhaustiveCheck: never = shape;
      return _exhaustiveCheck;
  }
}
```

::: info `void` vs `never` — পার্থক্য
| বৈশিষ্ট্য | `void` | `never` |
|---|---|---|
| অর্থ | কিছু রিটার্ন করে না | কখনো শেষ হয় না বা সবসময় error throw করে |
| ফাংশন শেষ হয়? | ✅ হ্যাঁ, শেষ হয় | ❌ না, কখনো শেষ হয় না |
| `undefined` রিটার্ন | ✅ সম্ভব | ❌ অসম্ভব |
| ব্যবহার | সাধারণ ফাংশন যা কিছু রিটার্ন করে না | Error handler, infinite loop, exhaustive check |
:::

---

## 5. Null এবং Undefined

### 5.1 `null` এবং `undefined` কী?

- **`undefined`**: ভেরিয়েবল ডিক্লেয়ার করা হয়েছে কিন্তু কোনো মান দেওয়া হয়নি।
- **`null`**: ইচ্ছাকৃতভাবে "কোনো মান নেই" বোঝাতে ব্যবহার করা হয়।

```typescript
let notAssigned: undefined = undefined;
let empty: null = null;

console.log(notAssigned); // undefined
console.log(empty); // null
```

### 5.2 `strictNullChecks` (কঠোর নাল চেকিং)

`tsconfig.json`-এ `strict: true` (বা `strictNullChecks: true`) থাকলে TypeScript আপনাকে `null` এবং `undefined` সম্পর্কে সাবধান করবে:

```typescript
// strictNullChecks: true থাকলে

let userName: string = "রিপন";
// userName = null;      // ❌ Error: Type 'null' is not assignable to type 'string'
// userName = undefined; // ❌ Error!

// null বা undefined অনুমতি দিতে চাইলে Union type ব্যবহার করুন
let nickname: string | null = "Ripon";
nickname = null; // ✅ এখন কাজ করবে

let age: number | undefined = undefined;
age = 25; // ✅ পরে মান দেওয়া যায়
```

### 5.3 Optional Chaining (`?.`)

কোনো প্রপার্টি `null` বা `undefined` হতে পারে কি না — নিরাপদে চেক করার পদ্ধতি:

```typescript
interface User {
  name: string;
  address?: {
    city?: string;
    zip?: string;
  };
}

const user: User = { name: "রিপন" };

// পুরাতন পদ্ধতি (ভারবোস)
// const city = user.address && user.address.city ? user.address.city : "অজানা";

// ✅ Optional Chaining (সংক্ষিপ্ত ও নিরাপদ)
const city = user.address?.city;
console.log(city); // undefined (কারণ address নেই)

// অ্যারেতে optional chaining
const users: User[] | undefined = undefined;
const firstUser = users?.[0]?.name;
console.log(firstUser); // undefined

// মেথডে optional chaining
const length = user.name?.toUpperCase();
console.log(length); // "রিপন" (toUpperCase বাংলায় same থাকে)
```

### 5.4 Nullish Coalescing (`??`)

`null` বা `undefined` হলে **ডিফল্ট মান** দেওয়ার সহজ উপায়:

```typescript
const input: string | null = null;

// ✅ Nullish Coalescing — শুধু null/undefined হলে ডিফল্ট মান দেয়
const value = input ?? "ডিফল্ট মান";
console.log(value); // "ডিফল্ট মান"

// || (OR) vs ?? (Nullish Coalescing) পার্থক্য
let count: number | null = 0;

let result1 = count || 10; // 10 😱 (0 কে falsy ধরে!)
let result2 = count ?? 10; // 0 ✅ (শুধু null/undefined হলে ডিফল্ট দেয়)

console.log(result1); // 10 (ভুল! 0 একটি valid মান)
console.log(result2); // 0  (সঠিক!)
```

::: warning `||` vs `??` — গুরুত্বপূর্ণ পার্থক্য

- `||` (OR): সব **falsy** values (`0`, `""`, `false`, `null`, `undefined`) এর ক্ষেত্রে ডিফল্ট মান দেয়
- `??` (Nullish Coalescing): **শুধু** `null` এবং `undefined` এর ক্ষেত্রে ডিফল্ট মান দেয়

বেশিরভাগ ক্ষেত্রে `??` ব্যবহার করা উচিত, কারণ `0` এবং `""` valid মান হতে পারে।
:::

---

## 6. Type Annotations এবং Type Inference

TypeScript-এ টাইপ দুইভাবে নির্ধারিত হয়: **আপনি নিজে বলে দেন** (Type Annotation) অথবা **TypeScript নিজে বুঝে নেয়** (Type Inference)।

### 6.1 Type Annotation (টাইপ এনোটেশন)

আপনি নিজে স্পষ্টভাবে টাইপ লিখে দেন:

```typescript
// ভেরিয়েবলে টাইপ এনোটেশন
let studentName: string = "করিম";
let studentAge: number = 22;
let isEnrolled: boolean = true;
let hobbies: string[] = ["ক্রিকেট", "পড়াশুনা", "কোডিং"];

// ফাংশনে টাইপ এনোটেশন (প্যারামিটার + রিটার্ন)
function multiply(a: number, b: number): number {
  return a * b;
}

// অবজেক্টে টাইপ এনোটেশন
let student: { name: string; age: number; department: string } = {
  name: "করিম",
  age: 22,
  department: "CSE",
};
```

### 6.2 Type Inference (টাইপ ইনফারেন্স — স্বয়ংক্রিয় টাইপ নির্ধারণ)

TypeScript অনেক সময় **নিজে থেকেই টাইপ বুঝে নিতে পারে** — তখন আপনাকে টাইপ লিখতে হয় না:

```typescript
// TypeScript নিজে বুঝে নেয় যে এটি string
let city = "ঢাকা"; // টাইপ: string (inferred)
let population = 20000000; // টাইপ: number (inferred)
let isCapital = true; // টাইপ: boolean (inferred)

// এখনও টাইপ সেফটি কাজ করে!
// city = 123;    // ❌ Error: Type 'number' is not assignable to type 'string'
// population = "অনেক"; // ❌ Error!

// ফাংশনের রিটার্ন টাইপও infer হয়
function add(a: number, b: number) {
  return a + b; // TypeScript বুঝে নেয় রিটার্ন টাইপ হলো number
}

let result = add(5, 3); // result-এর টাইপ: number (inferred)

// অ্যারে inference
let colors = ["লাল", "সবুজ", "নীল"]; // টাইপ: string[] (inferred)
let mixed = [1, "দুই", true]; // টাইপ: (string | number | boolean)[] (inferred)
```

### 6.3 কখন Annotation লিখবেন, কখন Inference-এ ছেড়ে দেবেন?

```typescript
// ✅ Inference ব্যবহার করুন — সহজ ক্ষেত্রে
let name = "রিপন"; // string — পরিষ্কার, annotation দরকার নেই
let items = [1, 2, 3]; // number[] — পরিষ্কার
const PI = 3.1416; // 3.1416 (literal type)
let total = items.reduce((s, n) => s + n, 0); // number — inferred

// ✅ Annotation লিখুন — যখন Inference যথেষ্ট নয়
let response: string | null = null; // পরে string হবে
let data: unknown = fetchSomething(); // API response

// ✅ Annotation লিখুন — ফাংশন প্যারামিটারে (বাধ্যতামূলক!)
function greet(name: string): string {
  // প্যারামিটারে annotation দিতে হবে
  return `হ্যালো, ${name}!`;
}

// ✅ Annotation লিখুন — খালি অ্যারে ডিক্লেয়ার করলে
let scores: number[] = []; // না দিলে TypeScript বুঝবে না কী টাইপ
scores.push(95);

// ✅ Annotation লিখুন — অবজেক্টের স্ট্রাকচার জটিল হলে
interface Product {
  id: number;
  name: string;
  price: number;
  inStock: boolean;
}

let laptop: Product = {
  id: 1,
  name: "Dell XPS",
  price: 150000,
  inStock: true,
};
```

::: tip সেরা চর্চা (Best Practice) সারসংক্ষেপ
| পরিস্থিতি | করণীয় | উদাহরণ |
|---|---|---|
| সরাসরি মান অ্যাসাইন | Inference-এ ছেড়ে দিন | `let x = 10;` |
| ফাংশন প্যারামিটার | **Annotation দিন** | `function fn(x: number)` |
| ফাংশন রিটার্ন টাইপ | Inference চলবে, তবে জটিল হলে দিন | `function fn(): string` |
| খালি অ্যারে | **Annotation দিন** | `let arr: number[] = [];` |
| `null`/`undefined` সম্ভব | **Annotation দিন** (Union) | `let x: string \| null` |
| অবজেক্ট | Interface ব্যবহার করুন | `let u: User = {...}` |
:::

---

## সারসংক্ষেপ (Summary)

এই সেকশনে আমরা শিখলাম:

| টাইপ        | ব্যবহার                       | উদাহরণ                         |
| ----------- | ----------------------------- | ------------------------------ |
| `string`    | টেক্সট ডেটা                   | `let name: string = "রিপন"`    |
| `number`    | সব ধরনের সংখ্যা               | `let age: number = 25`         |
| `boolean`   | সত্য/মিথ্যা                   | `let active: boolean = true`   |
| `Array`     | একই টাইপের লিস্ট              | `let nums: number[] = [1,2,3]` |
| `Tuple`     | নির্দিষ্ট স্ট্রাকচারের অ্যারে | `let x: [string, number]`      |
| `Enum`      | কনস্ট্যান্ট গ্রুপ             | `enum Color { Red, Green }`    |
| `any`       | যেকোনো টাইপ (অনিরাপদ)         | `let x: any = "anything"`      |
| `unknown`   | যেকোনো টাইপ (নিরাপদ)          | `let x: unknown = getData()`   |
| `void`      | কিছু রিটার্ন করে না           | `function log(): void`         |
| `never`     | কখনো শেষ হয় না               | `function err(): never`        |
| `null`      | ইচ্ছাকৃত খালি মান             | `let x: string \| null`        |
| `undefined` | মান দেওয়া হয়নি              | `let x: number \| undefined`   |

::: tip পরবর্তী ধাপ
Basic Types ভালোভাবে বুঝে থাকলে এবার **Functions (ফাংশন)** সেকশনে যান, যেখানে শিখবেন TypeScript-এ ফাংশন কীভাবে টাইপ সহ লেখা হয়।
:::
