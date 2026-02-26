# Advanced Types (অ্যাডভান্সড টাইপ)

TypeScript-এর আসল শক্তি হলো এর **উন্নত টাইপ সিস্টেম**। এই সেকশনে আমরা শিখবো কীভাবে বিভিন্ন টাইপ **একত্রিত**, **সংকীর্ণ** এবং **কাস্টমাইজ** করা যায় — যা জটিল অ্যাপ্লিকেশনে টাইপ সেফটি নিশ্চিত করতে অত্যন্ত গুরুত্বপূর্ণ।

---

## 1. Union Types (ইউনিয়ন টাইপ — `|`)

Union type দিয়ে একটি ভেরিয়েবল বা প্যারামিটার **একাধিক টাইপের যেকোনো একটি** হতে পারে। `|` (pipe) চিহ্ন দিয়ে টাইপগুলো আলাদা করা হয়।

### 1.1 বেসিক Union Type

```typescript
// id হতে পারে string অথবা number
let id: string | number;

id = "ABC-123"; // ✅ string
id = 12345; // ✅ number
// id = true;    // ❌ Error: Type 'boolean' is not assignable to type 'string | number'

// ফাংশনে union type
function printId(id: string | number): void {
  console.log(`আইডি: ${id}`);
}

printId("USR-001"); // "আইডি: USR-001"
printId(42); // "আইডি: 42"
```

### 1.2 Union Type-এ প্রপার্টি অ্যাক্সেস

Union type-এ শুধু **সব টাইপে কমন** প্রপার্টি/মেথড সরাসরি ব্যবহার করা যায়:

```typescript
function printId(id: string | number): void {
  // ✅ toString() দুটো টাইপেই আছে — কমন মেথড
  console.log(id.toString());

  // ❌ toUpperCase() শুধু string-এ আছে — সরাসরি ব্যবহার করা যাবে না
  // console.log(id.toUpperCase()); // Error!

  // ✅ টাইপ চেক করে ব্যবহার করতে হবে
  if (typeof id === "string") {
    console.log(id.toUpperCase()); // এখন কাজ করবে ✅
  } else {
    console.log(id.toFixed(2)); // number মেথড ✅
  }
}

printId("hello"); // "HELLO"
printId(3.14159); // "3.14"
```

### 1.3 অ্যারেতে Union Type

```typescript
// mixed array — string বা number হতে পারে
let mixedArray: (string | number)[] = [1, "দুই", 3, "চার"];

mixedArray.push(5); // ✅
mixedArray.push("ছয়"); // ✅
// mixedArray.push(true);  // ❌ Error!

// ব্যবহারিক উদাহরণ — API রেসপন্স
type ApiResponse = string | { message: string; code: number };

function handleResponse(response: ApiResponse): void {
  if (typeof response === "string") {
    console.log(`সরাসরি মেসেজ: ${response}`);
  } else {
    console.log(`কোড ${response.code}: ${response.message}`);
  }
}

handleResponse("সফল!"); // "সরাসরি মেসেজ: সফল!"
handleResponse({ message: "ব্যর্থ", code: 404 }); // "কোড 404: ব্যর্থ"
```

::: tip কখন Union Type ব্যবহার করবেন?

- যখন একটি ভেরিয়েবল **একাধিক টাইপের** হতে পারে (যেমন: ID হতে পারে string বা number)
- **API রেসপন্স** — সফল হলে data, ব্যর্থ হলে error
- **ফাংশন প্যারামিটার** — বিভিন্ন টাইপের ইনপুট গ্রহণ করতে
  :::

---

## 2. Intersection Types (ইন্টারসেকশন টাইপ — `&`)

Intersection type দিয়ে **একাধিক টাইপ একত্রিত** করা যায়। `&` চিহ্ন দিয়ে টাইপগুলো যোগ করা হয়। ফলে নতুন টাইপে **সবগুলো টাইপের সব প্রপার্টি** থাকে।

### 2.1 বেসিক Intersection

```typescript
type HasName = {
  name: string;
};

type HasAge = {
  age: number;
};

type HasEmail = {
  email: string;
};

// তিনটি টাইপ একত্রিত — সবগুলো প্রপার্টি থাকতে হবে
type Person = HasName & HasAge & HasEmail;

let person: Person = {
  name: "রিপন", // HasName থেকে
  age: 25, // HasAge থেকে
  email: "ripon@test.com", // HasEmail থেকে
};

// ❌ কোনো প্রপার্টি বাদ দেওয়া যাবে না
// let wrong: Person = { name: "রিপন", age: 25 }; // Error: 'email' is missing
```

### 2.2 Interface-এর সাথে Intersection

```typescript
interface Printable {
  print(): void;
}

interface Loggable {
  log(): void;
}

// দুটি interface একত্রিত
type PrintableAndLoggable = Printable & Loggable;

let doc: PrintableAndLoggable = {
  print() {
    console.log("প্রিন্ট হচ্ছে... 🖨️");
  },
  log() {
    console.log("লগ করা হচ্ছে... 📝");
  },
};

doc.print(); // "প্রিন্ট হচ্ছে... 🖨️"
doc.log(); // "লগ করা হচ্ছে... 📝"
```

### 2.3 ব্যবহারিক উদাহরণ — API মডেল

```typescript
// বেস মডেল — সব এন্টিটিতে থাকবে
type BaseModel = {
  id: number;
  createdAt: Date;
  updatedAt: Date;
};

// টাইমস্ট্যাম্প — সফট ডিলিটের জন্য
type SoftDelete = {
  deletedAt?: Date;
  isDeleted: boolean;
};

// ইউজার মডেল — BaseModel + SoftDelete + নিজস্ব ফিল্ড
type User = BaseModel &
  SoftDelete & {
    name: string;
    email: string;
    role: "admin" | "user";
  };

let user: User = {
  id: 1,
  createdAt: new Date(),
  updatedAt: new Date(),
  isDeleted: false,
  name: "রিপন",
  email: "ripon@example.com",
  role: "admin",
};

console.log(user.name); // "রিপন"
console.log(user.role); // "admin"
```

::: info Union vs Intersection — পার্থক্য
| বৈশিষ্ট্য | Union (`\|`) | Intersection (`&`) |
|---|---|---|
| অর্থ | এটি **অথবা** ওটি | এটি **এবং** ওটি |
| প্রপার্টি | যেকোনো **একটি** টাইপের প্রপার্টি | **সবগুলো** টাইপের প্রপার্টি |
| ব্যবহার | ভিন্ন ভিন্ন সম্ভাবনা | টাইপ একত্রীকরণ |
| উদাহরণ | `string \| number` | `HasName & HasAge` |

**সহজ ভাষায়:** Union = "OR", Intersection = "AND"
:::

---

## 3. Type Aliases (টাইপ এলিয়াস — `type`)

`type` কিওয়ার্ড দিয়ে যেকোনো টাইপকে একটি **নাম** দেওয়া যায়। এতে টাইপ পুনঃব্যবহার করা সহজ হয় এবং কোড পরিষ্কার থাকে।

### 3.1 সাধারণ টাইপ এলিয়াস

```typescript
// Primitive টাইপে alias
type ID = string | number;
type Username = string;
type Age = number;
type IsActive = boolean;

let userId: ID = "USR-001";
let adminId: ID = 42;
let name: Username = "রিপন";
let age: Age = 25;
```

### 3.2 অবজেক্ট টাইপ এলিয়াস

```typescript
type Coordinate = {
  x: number;
  y: number;
};

type Color = {
  r: number;
  g: number;
  b: number;
  alpha?: number; // ঐচ্ছিক
};

let point: Coordinate = { x: 10, y: 20 };
let red: Color = { r: 255, g: 0, b: 0 };
let semiTransparentBlue: Color = { r: 0, g: 0, b: 255, alpha: 0.5 };
```

### 3.3 ফাংশন টাইপ এলিয়াস

```typescript
// ফাংশনের টাইপ alias
type MathFn = (a: number, b: number) => number;
type Predicate = (value: number) => boolean;
type Callback = (error: Error | null, data?: string) => void;

const add: MathFn = (a, b) => a + b;
const multiply: MathFn = (a, b) => a * b;
const isPositive: Predicate = (value) => value > 0;

console.log(add(3, 5)); // 8
console.log(isPositive(-3)); // false
```

### 3.4 জটিল টাইপ কম্পোজিশন

```typescript
// বিভিন্ন স্টেটের জন্য আলাদা আলাদা টাইপ
type LoadingState = { status: "loading" };
type SuccessState = { status: "success"; data: string[] };
type ErrorState = { status: "error"; message: string };

// সব স্টেট একত্রে — Union Type Alias
type RequestState = LoadingState | SuccessState | ErrorState;

function renderUI(state: RequestState): string {
  switch (state.status) {
    case "loading":
      return "⏳ লোড হচ্ছে...";
    case "success":
      return `✅ ${state.data.length}টি ফলাফল পাওয়া গেছে`;
    case "error":
      return `❌ ত্রুটি: ${state.message}`;
  }
}

console.log(renderUI({ status: "loading" }));
// "⏳ লোড হচ্ছে..."

console.log(renderUI({ status: "success", data: ["আম", "কাঁঠাল", "লিচু"] }));
// "✅ 3টি ফলাফল পাওয়া গেছে"

console.log(renderUI({ status: "error", message: "নেটওয়ার্ক ব্যর্থ" }));
// "❌ ত্রুটি: নেটওয়ার্ক ব্যর্থ"
```

::: tip কখন `type` ব্যবহার করবেন?

- **Union টাইপ** তৈরি করতে: `type ID = string | number`
- **Intersection টাইপ** তৈরি করতে: `type Admin = User & Permissions`
- **ফাংশন টাইপ** সংজ্ঞায়িত করতে: `type Handler = (e: Event) => void`
- **Tuple টাইপ**: `type Point = [number, number]`
- **জটিল টাইপ কম্পোজিশন**: একাধিক টাইপ মিলিয়ে নতুন টাইপ
  :::

---

## 4. Literal Types (লিটারেল টাইপ)

Literal type-এ একটি ভেরিয়েবলের মান **নির্দিষ্ট কিছু মানের** মধ্যে সীমাবদ্ধ থাকে। এটি শুধু `string`, `number` বা `boolean` না হয়ে **নির্দিষ্ট মান** হতে হবে।

### 4.1 String Literal Type

```typescript
// শুধু এই তিনটি মানের যেকোনো একটি হতে পারে
type Direction = "up" | "down" | "left" | "right";

let move: Direction = "up"; // ✅
move = "down"; // ✅
// move = "forward";            // ❌ Error: Type '"forward"' is not assignable to type 'Direction'

// ব্যবহারিক উদাহরণ
type Theme = "light" | "dark" | "system";
type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
type Status = "active" | "inactive" | "pending" | "banned";

function setTheme(theme: Theme): void {
  console.log(`থিম সেট হয়েছে: ${theme}`);
}

setTheme("dark"); // ✅
// setTheme("blue"); // ❌ Error!
```

### 4.2 Numeric Literal Type

```typescript
type DiceValue = 1 | 2 | 3 | 4 | 5 | 6;

function rollDice(): DiceValue {
  return (Math.floor(Math.random() * 6) + 1) as DiceValue;
}

let result: DiceValue = rollDice();
console.log(`ডাইস ফল: ${result}`); // 1 থেকে 6 এর মধ্যে

// HTTP Status Codes
type SuccessCode = 200 | 201 | 204;
type ErrorCode = 400 | 401 | 403 | 404 | 500;
type StatusCode = SuccessCode | ErrorCode;

function handleStatus(code: StatusCode): string {
  if (code === 200) return "OK ✅";
  if (code === 404) return "Not Found ❌";
  if (code === 500) return "Server Error 💥";
  return `Status: ${code}`;
}
```

### 4.3 Boolean Literal Type

```typescript
type True = true;
type False = false;

// ব্যবহারিক উদাহরণ — কনফিগারেশন
type DebugMode = {
  debug: true;
  logLevel: "verbose" | "debug";
};

type ProductionMode = {
  debug: false;
  logLevel: "error" | "warn";
};

type AppMode = DebugMode | ProductionMode;

let devConfig: AppMode = {
  debug: true,
  logLevel: "verbose", // ✅
};

let prodConfig: AppMode = {
  debug: false,
  logLevel: "error", // ✅
};

// ❌ ভুল — debug: false হলে logLevel "verbose" হতে পারে না
// let wrongConfig: AppMode = { debug: false, logLevel: "verbose" }; // Error!
```

### 4.4 `const` অ্যাসারশন

`as const` ব্যবহার করলে TypeScript সবকিছুকে **literal type** হিসেবে ধরে:

```typescript
// as const ছাড়া
let color1 = "red"; // টাইপ: string

// as const দিয়ে
let color2 = "red" as const; // টাইপ: "red" (literal)

// অবজেক্টে as const
const config = {
  host: "localhost",
  port: 3000,
  debug: true,
} as const;

// config.host এর টাইপ: "localhost" (readonly literal)
// config.port এর টাইপ: 3000 (readonly literal)

// ❌ readonly — পরিবর্তন করা যাবে না
// config.port = 8080; // Error: Cannot assign to 'port' because it is a read-only property

// অ্যারেতে as const
const directions = ["up", "down", "left", "right"] as const;
// টাইপ: readonly ["up", "down", "left", "right"]
type Direction2 = (typeof directions)[number]; // "up" | "down" | "left" | "right"
```

---

## 5. Type Assertions (টাইপ অ্যাসারশন)

Type assertion দিয়ে TypeScript-কে বলা হয়: **"আমি জানি এই ভেরিয়েবলের টাইপ কী, তুমি আমাকে বিশ্বাস করো।"** এটি টাইপ **কনভার্ট করে না**, শুধু TypeScript-এর কম্পাইলারকে জানায়।

### 5.1 `as` সিনট্যাক্স (বেশি ব্যবহৃত)

```typescript
// unknown থেকে নির্দিষ্ট টাইপে assertion
let someValue: unknown = "হ্যালো TypeScript";

// TypeScript জানে না এটি string — তাই assertion লাগবে
let strLength: number = (someValue as string).length;
console.log(strLength); // 18

// DOM element-এ assertion (সবচেয়ে কমন ব্যবহার)
const inputElement = document.getElementById("username") as HTMLInputElement;
inputElement.value = "রিপন"; // ✅ HTMLInputElement-এ value আছে

// getElementById সাধারণত HTMLElement | null রিটার্ন করে
// assertion দিয়ে আমরা বলছি এটি HTMLInputElement
```

### 5.2 Angle-bracket সিনট্যাক্স

```typescript
// <Type> সিনট্যাক্স — as এর বিকল্প
let someValue: unknown = "হ্যালো";
let strLength: number = (<string>someValue).length;

// ⚠️ JSX/TSX ফাইলে <Type> সিনট্যাক্স কাজ করে না!
// তাই সবসময় `as` ব্যবহার করা উচিত
```

### 5.3 কখন Assertion ব্যবহার করবেন?

```typescript
// ১. DOM Elements
const canvas = document.getElementById("myCanvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d"); // ✅ getContext এখন কাজ করবে

// ২. API রেসপন্স
interface User {
  id: number;
  name: string;
  email: string;
}

async function fetchUser(): Promise<User> {
  const response = await fetch("/api/user");
  const data = await response.json(); // টাইপ: any
  return data as User; // assertion দিয়ে নির্দিষ্ট টাইপে রূপান্তর
}

// ৩. Event objects
document.addEventListener("click", (event) => {
  const target = event.target as HTMLButtonElement;
  console.log(target.textContent);
});
```

### 5.4 Non-null Assertion (`!`)

যখন আপনি **নিশ্চিত** যে একটি মান `null` বা `undefined` নয়:

```typescript
// ! দিয়ে null/undefined বাদ দেওয়া
function getLength(value: string | null): number {
  // আমরা জানি value null না (বাইরে চেক করা হয়েছে)
  return value!.length; // ! বলছে: "এটি null না, বিশ্বাস করো"
}

// DOM-এ ব্যবহার
const element = document.getElementById("app")!; // null হবে না বলে ধরে নিচ্ছি
element.innerHTML = "হ্যালো!";
```

::: danger Type Assertion-এ সাবধান!
Type assertion **টাইপ চেক বাইপাস** করে — তাই ভুল assertion রানটাইমে ক্র্যাশ ঘটাতে পারে:

```typescript
// ❌ বিপজ্জনক — ভুল assertion
let num: number = 42;
let str = num as unknown as string; // TypeScript কোনো এরর দেখাবে না!
console.log(str.toUpperCase()); // 💥 রানটাইম ক্র্যাশ!
```

**নিয়ম:**

- Assertion **কম ব্যবহার** করুন — টাইপ গার্ড ব্যবহার করুন
- **শুধুমাত্র নিশ্চিত** হলে assertion ব্যবহার করুন
- `as any` বা double assertion (`as unknown as X`) **এড়িয়ে চলুন**
  :::

---

## 6. Type Guards (টাইপ গার্ড)

Type Guard দিয়ে রানটাইমে একটি ভেরিয়েবলের **সঠিক টাইপ যাচাই** করা যায়। TypeScript এই চেকের উপর ভিত্তি করে **স্বয়ংক্রিয়ভাবে টাইপ সংকীর্ণ (narrow)** করে দেয়।

### 6.1 `typeof` গার্ড (Primitive টাইপ চেক)

```typescript
function formatValue(value: string | number | boolean): string {
  // typeof দিয়ে primitive টাইপ চেক
  if (typeof value === "string") {
    // এই ব্লকে TypeScript জানে value হলো string
    return value.toUpperCase();
  }
  if (typeof value === "number") {
    // এই ব্লকে TypeScript জানে value হলো number
    return value.toFixed(2);
  }
  // এখানে TypeScript জানে value হলো boolean
  return value ? "সত্য ✅" : "মিথ্যা ❌";
}

console.log(formatValue("hello")); // "HELLO"
console.log(formatValue(3.14159)); // "3.14"
console.log(formatValue(true)); // "সত্য ✅"
```

### 6.2 `instanceof` গার্ড (ক্লাস/অবজেক্ট চেক)

```typescript
class Dog {
  bark(): string {
    return "ঘেউ ঘেউ! 🐕";
  }
}

class Cat {
  meow(): string {
    return "মিয়াউ! 🐈";
  }
}

function makeSound(animal: Dog | Cat): string {
  // instanceof দিয়ে ক্লাস চেক
  if (animal instanceof Dog) {
    return animal.bark(); // TypeScript জানে এটি Dog
  }
  return animal.meow(); // TypeScript জানে এটি Cat
}

console.log(makeSound(new Dog())); // "ঘেউ ঘেউ! 🐕"
console.log(makeSound(new Cat())); // "মিয়াউ! 🐈"

// Date-এ instanceof ব্যবহার
function formatDate(value: string | Date): string {
  if (value instanceof Date) {
    return value.toLocaleDateString("bn-BD");
  }
  return value;
}

console.log(formatDate(new Date())); // বাংলা তারিখ
console.log(formatDate("২৬ ফেব্রুয়ারি")); // "২৬ ফেব্রুয়ারি"
```

### 6.3 `in` গার্ড (প্রপার্টি চেক)

```typescript
interface Bird {
  fly(): void;
  layEggs(): void;
}

interface Fish {
  swim(): void;
  layEggs(): void;
}

function move(animal: Bird | Fish): void {
  // "fly" প্রপার্টি আছে কি না চেক
  if ("fly" in animal) {
    animal.fly(); // TypeScript জানে এটি Bird
    console.log("পাখি উড়ছে! 🐦");
  } else {
    animal.swim(); // TypeScript জানে এটি Fish
    console.log("মাছ সাঁতার কাটছে! 🐟");
  }
}
```

### 6.4 কাস্টম টাইপ গার্ড (`is` কিওয়ার্ড)

নিজের মতো টাইপ গার্ড ফাংশন তৈরি করা যায় `is` কিওয়ার্ড দিয়ে:

```typescript
interface Car {
  type: "car";
  brand: string;
  horsepower: number;
}

interface Bicycle {
  type: "bicycle";
  brand: string;
  gears: number;
}

type Vehicle = Car | Bicycle;

// কাস্টম টাইপ গার্ড — রিটার্ন টাইপে `is` ব্যবহার
function isCar(vehicle: Vehicle): vehicle is Car {
  return vehicle.type === "car";
}

function isBicycle(vehicle: Vehicle): vehicle is Bicycle {
  return vehicle.type === "bicycle";
}

function getVehicleInfo(vehicle: Vehicle): string {
  if (isCar(vehicle)) {
    // TypeScript জানে এটি Car
    return `🚗 ${vehicle.brand} — ${vehicle.horsepower} HP`;
  }
  // TypeScript জানে এটি Bicycle
  return `🚲 ${vehicle.brand} — ${vehicle.gears} গিয়ার`;
}

console.log(getVehicleInfo({ type: "car", brand: "Toyota", horsepower: 150 }));
// "🚗 Toyota — 150 HP"

console.log(getVehicleInfo({ type: "bicycle", brand: "Giant", gears: 21 }));
// "🚲 Giant — 21 গিয়ার"
```

::: tip টাইপ গার্ড সারসংক্ষেপ
| গার্ড | ব্যবহার | উদাহরণ |
|---|---|---|
| `typeof` | Primitive টাইপ চেক | `typeof x === "string"` |
| `instanceof` | ক্লাস ইনস্ট্যান্স চেক | `x instanceof Date` |
| `in` | প্রপার্টি আছে কি না | `"fly" in animal` |
| কাস্টম (`is`) | নিজস্ব লজিক দিয়ে চেক | `function isCar(v): v is Car` |
:::

---

## 7. Discriminated Unions (ডিসক্রিমিনেটেড ইউনিয়ন)

Discriminated Union হলো একটি **প্যাটার্ন** যেখানে Union-এর প্রতিটি টাইপে একটি **কমন প্রপার্টি** থাকে যার মান **লিটারেল টাইপ**। এই কমন প্রপার্টিকে **discriminant** বা **tag** বলা হয়। এটি TypeScript-এর সবচেয়ে শক্তিশালী প্যাটার্নগুলোর একটি।

### 7.1 বেসিক Discriminated Union

```typescript
// প্রতিটি Shape-এ "kind" হলো discriminant (tag)
interface Circle {
  kind: "circle"; // লিটারেল টাইপ — ট্যাগ
  radius: number;
}

interface Rectangle {
  kind: "rectangle"; // লিটারেল টাইপ — ট্যাগ
  width: number;
  height: number;
}

interface Triangle {
  kind: "triangle"; // লিটারেল টাইপ — ট্যাগ
  base: number;
  height: number;
}

type Shape = Circle | Rectangle | Triangle;

function calculateArea(shape: Shape): number {
  switch (shape.kind) {
    case "circle":
      // TypeScript জানে এটি Circle — radius আছে ✅
      return Math.PI * shape.radius ** 2;

    case "rectangle":
      // TypeScript জানে এটি Rectangle — width, height আছে ✅
      return shape.width * shape.height;

    case "triangle":
      // TypeScript জানে এটি Triangle — base, height আছে ✅
      return (shape.base * shape.height) / 2;
  }
}

console.log(calculateArea({ kind: "circle", radius: 5 })); // 78.54
console.log(calculateArea({ kind: "rectangle", width: 10, height: 5 })); // 50
console.log(calculateArea({ kind: "triangle", base: 8, height: 6 })); // 24
```

### 7.2 Exhaustive Check — সব কেস কভার নিশ্চিত করা

```typescript
function getShapeDescription(shape: Shape): string {
  switch (shape.kind) {
    case "circle":
      return `বৃত্ত (ব্যাসার্ধ: ${shape.radius})`;
    case "rectangle":
      return `আয়তক্ষেত্র (${shape.width}×${shape.height})`;
    case "triangle":
      return `ত্রিভুজ (ভূমি: ${shape.base}, উচ্চতা: ${shape.height})`;
    default:
      // এখানে shape-এর টাইপ হবে `never`
      // নতুন shape যোগ করলে কিন্তু case না লিখলে TypeScript এরর দেখাবে!
      const _exhaustive: never = shape;
      return _exhaustive;
  }
}
```

### 7.3 ব্যবহারিক উদাহরণ — API রেসপন্স

```typescript
// API রেসপন্স স্টেট ম্যানেজমেন্ট
interface IdleState {
  status: "idle";
}

interface LoadingState {
  status: "loading";
  startedAt: Date;
}

interface SuccessState<T> {
  status: "success";
  data: T;
  fetchedAt: Date;
}

interface ErrorState {
  status: "error";
  error: string;
  retryCount: number;
}

type FetchState<T> = IdleState | LoadingState | SuccessState<T> | ErrorState;

// User ডেটার জন্য ব্যবহার
interface User {
  id: number;
  name: string;
}

function renderUserState(state: FetchState<User[]>): string {
  switch (state.status) {
    case "idle":
      return "🔘 অপেক্ষমাণ — ডেটা লোড করুন";

    case "loading":
      return `⏳ লোড হচ্ছে... (শুরু: ${state.startedAt.toLocaleTimeString()})`;

    case "success":
      return `✅ ${state.data.length}জন ইউজার পাওয়া গেছে`;

    case "error":
      return `❌ ত্রুটি: ${state.error} (চেষ্টা: ${state.retryCount}বার)`;
  }
}

// ব্যবহার
console.log(renderUserState({ status: "idle" }));
// "🔘 অপেক্ষমাণ — ডেটা লোড করুন"

console.log(
  renderUserState({
    status: "success",
    data: [
      { id: 1, name: "রিপন" },
      { id: 2, name: "করিম" },
    ],
    fetchedAt: new Date(),
  }),
);
// "✅ 2জন ইউজার পাওয়া গেছে"

console.log(
  renderUserState({
    status: "error",
    error: "নেটওয়ার্ক ব্যর্থ",
    retryCount: 3,
  }),
);
// "❌ ত্রুটি: নেটওয়ার্ক ব্যর্থ (চেষ্টা: 3বার)"
```

### 7.4 Redux-স্টাইল Action Pattern

```typescript
// Redux action pattern — discriminated union-এর সবচেয়ে বিখ্যাত ব্যবহার
interface AddTodoAction {
  type: "ADD_TODO";
  payload: { text: string };
}

interface ToggleTodoAction {
  type: "TOGGLE_TODO";
  payload: { id: number };
}

interface DeleteTodoAction {
  type: "DELETE_TODO";
  payload: { id: number };
}

type TodoAction = AddTodoAction | ToggleTodoAction | DeleteTodoAction;

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

function todoReducer(state: Todo[], action: TodoAction): Todo[] {
  switch (action.type) {
    case "ADD_TODO":
      return [
        ...state,
        { id: Date.now(), text: action.payload.text, completed: false },
      ];

    case "TOGGLE_TODO":
      return state.map((todo) =>
        todo.id === action.payload.id
          ? { ...todo, completed: !todo.completed }
          : todo,
      );

    case "DELETE_TODO":
      return state.filter((todo) => todo.id !== action.payload.id);
  }
}
```

::: warning Discriminated Union-এর নিয়ম

1. প্রতিটি টাইপে একটি **কমন প্রপার্টি** থাকতে হবে (discriminant/tag)
2. এই প্রপার্টির মান **লিটারেল টাইপ** হতে হবে (`"circle"`, `"rectangle"` — `string` না)
3. `switch` বা `if` দিয়ে **discriminant চেক** করলে TypeScript স্বয়ংক্রিয়ভাবে টাইপ সংকীর্ণ করে

**Discriminated Union সবচেয়ে বেশি ব্যবহৃত হয়:**

- **State management** (Redux actions, React state)
- **API response** হ্যান্ডলিং
- **Form validation** রেজাল্ট
- **Shape/Geometry** ক্যালকুলেশন
- **Payment system** (বিভিন্ন পেমেন্ট মেথড)
  :::

---

## সারসংক্ষেপ (Summary)

এই সেকশনে আমরা শিখলাম:

| বিষয়                   | বিবরণ                 | উদাহরণ                               |
| ----------------------- | --------------------- | ------------------------------------ |
| **Union (`\|`)**        | এটি অথবা ওটি          | `string \| number`                   |
| **Intersection (`&`)**  | এটি এবং ওটি           | `HasName & HasAge`                   |
| **Type Alias**          | টাইপে নাম দেওয়া      | `type ID = string \| number`         |
| **Literal Type**        | নির্দিষ্ট মান         | `"light" \| "dark"`                  |
| **Type Assertion**      | টাইপ জানানো (`as`)    | `value as string`                    |
| **typeof Guard**        | Primitive চেক         | `typeof x === "string"`              |
| **instanceof Guard**    | ক্লাস চেক             | `x instanceof Date`                  |
| **Discriminated Union** | ট্যাগ-ভিত্তিক ইউনিয়ন | `{ kind: "circle"; radius: number }` |

::: tip পরবর্তী ধাপ
Advanced Types ভালোভাবে বুঝে থাকলে এবার **Generics** সেকশনে যান, যেখানে শিখবেন কীভাবে টাইপকে প্যারামিটার হিসেবে পাস করে **পুনঃব্যবহারযোগ্য** এবং **ফ্লেক্সিবল** কোড লেখা যায়।
:::
