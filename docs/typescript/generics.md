# Generics (জেনেরিকস)

Generics হলো TypeScript-এর সবচেয়ে **শক্তিশালী ফিচারগুলোর** একটি। এটি দিয়ে ফাংশন, ক্লাস বা ইন্টারফেসকে **নির্দিষ্ট টাইপে বেঁধে না রেখে** যেকোনো টাইপের সাথে কাজ করার ক্ষমতা দেওয়া যায় — এবং তবুও **টাইপ সেফটি** বজায় থাকে। একে বলা হয় **"টাইপ প্যারামিটার"** বা **"টাইপ ভেরিয়েবল"**।

**সহজ ভাষায়:** Generics = "টাইপকেও ভেরিয়েবলের মতো পাস করা"

---

## 1. Generic Functions (জেনেরিক ফাংশন)

### 1.1 সমস্যা — Generics ছাড়া

```typescript
// ❌ সমস্যা ১: প্রতিটি টাইপের জন্য আলাদা ফাংশন লিখতে হচ্ছে
function identityString(value: string): string {
  return value;
}

function identityNumber(value: number): number {
  return value;
}

// ❌ সমস্যা ২: any ব্যবহার করলে টাইপ সেফটি হারায়
function identityAny(value: any): any {
  return value; // রিটার্ন টাইপ any — কোনো টাইপ ইনফো নেই!
}

let result = identityAny("hello");
// result-এর টাইপ: any 😢 — TypeScript জানে না এটি string
```

### 1.2 সমাধান — Generic Function

`<T>` দিয়ে একটি **টাইপ প্যারামিটার** ডিক্লেয়ার করা হয়। `T` হলো একটি প্লেসহোল্ডার যা ফাংশন কলের সময় আসল টাইপে পরিণত হয়:

```typescript
// ✅ Generic function — যেকোনো টাইপে কাজ করে + টাইপ সেফ!
function identity<T>(value: T): T {
  return value;
}

// ব্যবহার ১: টাইপ স্পষ্টভাবে বলে দেওয়া
let str = identity<string>("হ্যালো"); // str-এর টাইপ: string ✅
let num = identity<number>(42); // num-এর টাইপ: number ✅
let bool = identity<boolean>(true); // bool-এর টাইপ: boolean ✅

// ব্যবহার ২: টাইপ ইনফারেন্স — TypeScript নিজে বুঝে নেয়
let inferred = identity("TypeScript"); // টাইপ: string (inferred) ✅

console.log(str); // "হ্যালো"
console.log(num); // 42
console.log(inferred); // "TypeScript"
```

### 1.3 একাধিক টাইপ প্যারামিটার

```typescript
// দুটি ভিন্ন টাইপ প্যারামিটার
function pair<T, U>(first: T, second: U): [T, U] {
  return [first, second];
}

let p1 = pair<string, number>("রিপন", 25); // [string, number]
let p2 = pair<number, boolean>(1, true); // [number, boolean]
let p3 = pair("অটো", 42); // inferred: [string, number]

console.log(p1); // ["রিপন", 25]
console.log(p2); // [1, true]

// ব্যবহারিক উদাহরণ — key-value mapper
function mapKeyValue<K, V>(key: K, value: V): { key: K; value: V } {
  return { key, value };
}

let entry = mapKeyValue("name", "রিপন"); // { key: string, value: string }
let score = mapKeyValue("math", 95); // { key: string, value: number }
let config = mapKeyValue(1, true); // { key: number, value: boolean }
```

### 1.4 অ্যারে নিয়ে কাজ করা

```typescript
// জেনেরিক ফাংশন — অ্যারের প্রথম এলিমেন্ট রিটার্ন
function getFirst<T>(items: T[]): T | undefined {
  return items[0];
}

let firstNum = getFirst([10, 20, 30]); // টাইপ: number | undefined
let firstStr = getFirst(["আম", "কাঁঠাল"]); // টাইপ: string | undefined

console.log(firstNum); // 10
console.log(firstStr); // "আম"

// জেনেরিক ফাংশন — অ্যারে রিভার্স
function reverseArray<T>(items: T[]): T[] {
  return [...items].reverse();
}

console.log(reverseArray([1, 2, 3])); // [3, 2, 1]
console.log(reverseArray(["ক", "খ", "গ"])); // ["গ", "খ", "ক"]

// জেনেরিক ফিল্টার
function filterItems<T>(items: T[], predicate: (item: T) => boolean): T[] {
  return items.filter(predicate);
}

let adults = filterItems(
  [
    { name: "রিপন", age: 25 },
    { name: "রাফি", age: 15 },
  ],
  (user) => user.age >= 18,
);
console.log(adults); // [{ name: "রিপন", age: 25 }]
```

---

## 2. Generic Interfaces (জেনেরিক ইন্টারফেস)

Interface-এও টাইপ প্যারামিটার ব্যবহার করে **ফ্লেক্সিবল** স্ট্রাকচার তৈরি করা যায়।

### 2.1 বেসিক Generic Interface

```typescript
// জেনেরিক ইন্টারফেস — T যেকোনো টাইপ হতে পারে
interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
  timestamp: Date;
}

// বিভিন্ন টাইপের ডেটা দিয়ে ব্যবহার
interface User {
  id: number;
  name: string;
  email: string;
}

interface Product {
  id: number;
  name: string;
  price: number;
}

// User ডেটার রেসপন্স
let userResponse: ApiResponse<User> = {
  success: true,
  data: { id: 1, name: "রিপন", email: "ripon@test.com" },
  message: "ইউজার পাওয়া গেছে",
  timestamp: new Date(),
};

// Product ডেটার রেসপন্স
let productResponse: ApiResponse<Product[]> = {
  success: true,
  data: [
    { id: 1, name: "ল্যাপটপ", price: 150000 },
    { id: 2, name: "ফোন", price: 50000 },
  ],
  message: "2টি পণ্য পাওয়া গেছে",
  timestamp: new Date(),
};

// Error রেসপন্স
let errorResponse: ApiResponse<null> = {
  success: false,
  data: null,
  message: "কিছু ভুল হয়েছে",
  timestamp: new Date(),
};
```

### 2.2 একাধিক টাইপ প্যারামিটার

```typescript
// key-value pair interface
interface KeyValuePair<K, V> {
  key: K;
  value: V;
}

let nameEntry: KeyValuePair<string, string> = { key: "name", value: "রিপন" };
let ageEntry: KeyValuePair<string, number> = { key: "age", value: 25 };
let idEntry: KeyValuePair<number, string> = { key: 1, value: "USR-001" };

// Paginated response
interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  perPage: number;
  hasNext: boolean;
  hasPrev: boolean;
}

let userList: PaginatedResponse<User> = {
  items: [
    { id: 1, name: "রিপন", email: "ripon@test.com" },
    { id: 2, name: "করিম", email: "karim@test.com" },
  ],
  total: 50,
  page: 1,
  perPage: 10,
  hasNext: true,
  hasPrev: false,
};
```

### 2.3 Generic Function Interface

```typescript
// ফাংশনের জন্য জেনেরিক interface
interface Transformer<T, U> {
  (input: T): U;
}

const stringToNumber: Transformer<string, number> = (str) => parseInt(str);
const numberToString: Transformer<number, string> = (num) => num.toString();

console.log(stringToNumber("42")); // 42
console.log(numberToString(42)); // "42"

// Comparator interface
interface Comparator<T> {
  (a: T, b: T): number;
}

const numberSort: Comparator<number> = (a, b) => a - b;
const stringSort: Comparator<string> = (a, b) => a.localeCompare(b);

console.log([3, 1, 4, 1, 5].sort(numberSort)); // [1, 1, 3, 4, 5]
console.log(["গ", "ক", "খ"].sort(stringSort)); // ["ক", "খ", "গ"]
```

---

## 3. Generic Classes (জেনেরিক ক্লাস)

ক্লাসেও টাইপ প্যারামিটার ব্যবহার করে **পুনঃব্যবহারযোগ্য** ডেটা স্ট্রাকচার তৈরি করা যায়।

### 3.1 Generic Stack (LIFO)

```typescript
class Stack<T> {
  private items: T[] = [];

  push(item: T): void {
    this.items.push(item);
  }

  pop(): T | undefined {
    return this.items.pop();
  }

  peek(): T | undefined {
    return this.items[this.items.length - 1];
  }

  isEmpty(): boolean {
    return this.items.length === 0;
  }

  size(): number {
    return this.items.length;
  }

  toArray(): T[] {
    return [...this.items];
  }
}

// Number Stack
const numberStack = new Stack<number>();
numberStack.push(10);
numberStack.push(20);
numberStack.push(30);
console.log(numberStack.peek()); // 30
console.log(numberStack.pop()); // 30
console.log(numberStack.size()); // 2

// String Stack
const stringStack = new Stack<string>();
stringStack.push("প্রথম");
stringStack.push("দ্বিতীয়");
console.log(stringStack.toArray()); // ["প্রথম", "দ্বিতীয়"]
```

### 3.2 Generic Queue (FIFO)

```typescript
class Queue<T> {
  private items: T[] = [];

  enqueue(item: T): void {
    this.items.push(item);
  }

  dequeue(): T | undefined {
    return this.items.shift();
  }

  front(): T | undefined {
    return this.items[0];
  }

  isEmpty(): boolean {
    return this.items.length === 0;
  }

  size(): number {
    return this.items.length;
  }
}

// Task Queue
interface Task {
  id: number;
  title: string;
  priority: "high" | "medium" | "low";
}

const taskQueue = new Queue<Task>();
taskQueue.enqueue({ id: 1, title: "বাগ ফিক্স", priority: "high" });
taskQueue.enqueue({ id: 2, title: "ফিচার যোগ", priority: "medium" });
taskQueue.enqueue({ id: 3, title: "ডকুমেন্টেশন", priority: "low" });

console.log(taskQueue.front()); // { id: 1, title: "বাগ ফিক্স", ... }
console.log(taskQueue.dequeue()); // { id: 1, title: "বাগ ফিক্স", ... } — সরিয়ে দিলো
console.log(taskQueue.front()); // { id: 2, title: "ফিচার যোগ", ... }
```

### 3.3 Generic Repository

```typescript
class Repository<T extends { id: number }> {
  private items: T[] = [];

  add(item: T): void {
    this.items.push(item);
  }

  findById(id: number): T | undefined {
    return this.items.find((item) => item.id === id);
  }

  findAll(): T[] {
    return [...this.items];
  }

  remove(id: number): boolean {
    const index = this.items.findIndex((item) => item.id === id);
    if (index === -1) return false;
    this.items.splice(index, 1);
    return true;
  }

  update(id: number, data: Partial<T>): T | undefined {
    const item = this.findById(id);
    if (!item) return undefined;
    Object.assign(item, data);
    return item;
  }

  count(): number {
    return this.items.length;
  }
}

// User Repository
interface User {
  id: number;
  name: string;
  email: string;
}

const userRepo = new Repository<User>();
userRepo.add({ id: 1, name: "রিপন", email: "ripon@test.com" });
userRepo.add({ id: 2, name: "করিম", email: "karim@test.com" });

console.log(userRepo.findById(1)); // { id: 1, name: "রিপন", ... }
console.log(userRepo.count()); // 2

// Product Repository — একই ক্লাস, ভিন্ন টাইপ!
interface Product {
  id: number;
  name: string;
  price: number;
}

const productRepo = new Repository<Product>();
productRepo.add({ id: 1, name: "ল্যাপটপ", price: 150000 });
```

---

## 4. Generic Constraints (জেনেরিক সীমাবদ্ধতা — `extends`)

কখনো কখনো জেনেরিক টাইপকে **সব টাইপের** জন্য উন্মুক্ত না রেখে কিছু **শর্ত** দিয়ে সীমাবদ্ধ করতে হয়। `extends` কিওয়ার্ড দিয়ে এই constraint দেওয়া হয়।

### 4.1 বেসিক Constraint

```typescript
// ❌ সমস্যা — T-তে .length নেই বলে TypeScript এরর দেয়
// function getLength<T>(value: T): number {
//   return value.length; // Error: Property 'length' does not exist on type 'T'
// }

// ✅ সমাধান — constraint দিয়ে বলে দিচ্ছি T-তে length থাকতে হবে
interface HasLength {
  length: number;
}

function getLength<T extends HasLength>(value: T): number {
  return value.length;
}

console.log(getLength("হ্যালো")); // 5 — string-এ length আছে ✅
console.log(getLength([1, 2, 3])); // 3 — array-তে length আছে ✅
console.log(getLength({ length: 10 })); // 10 — object-এ length আছে ✅

// ❌ number-এ length নেই
// getLength(42);    // Error: number does not satisfy the constraint 'HasLength'
// getLength(true);  // Error!
```

### 4.2 Object Property Constraint (`keyof`)

```typescript
// T-এর কোনো নির্দিষ্ট key ধরে value বের করা
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const user = {
  name: "রিপন",
  age: 25,
  email: "ripon@test.com",
};

let name = getProperty(user, "name"); // টাইপ: string ✅
let age = getProperty(user, "age"); // টাইপ: number ✅

// ❌ user-এ "phone" নেই
// getProperty(user, "phone"); // Error: '"phone"' is not assignable to type '"name" | "age" | "email"'
```

### 4.3 একাধিক Constraint

```typescript
// T-কে একাধিক interface দিয়ে constrain করা
interface Printable {
  toString(): string;
}

interface HasId {
  id: number;
}

function logEntity<T extends Printable & HasId>(entity: T): void {
  console.log(`ID: ${entity.id}, Value: ${entity.toString()}`);
}

logEntity({ id: 1, toString: () => "রিপন" }); // ✅ "ID: 1, Value: রিপন"

// ❌ id নেই
// logEntity({ toString: () => "test" }); // Error: 'id' is missing
```

### 4.4 Conditional Constraint

```typescript
// T যদি number হয়, তাহলে নির্দিষ্ট কাজ করো
function processValue<T extends string | number>(value: T): string {
  if (typeof value === "string") {
    return value.toUpperCase();
  }
  return value.toFixed(2);
}

console.log(processValue("hello")); // "HELLO"
console.log(processValue(3.14)); // "3.14"

// ❌ boolean চলবে না — constraint-এ নেই
// processValue(true); // Error!
```

---

## 5. Default Generic Types (ডিফল্ট জেনেরিক টাইপ)

জেনেরিক টাইপেও **ডিফল্ট মান** দেওয়া যায়। টাইপ আর্গুমেন্ট না দিলে ডিফল্ট টাইপ ব্যবহার হবে।

### 5.1 বেসিক Default Type

```typescript
// T-এর ডিফল্ট টাইপ string
interface Container<T = string> {
  value: T;
  label: string;
}

// টাইপ না দিলে ডিফল্ট string
let textBox: Container = {
  value: "হ্যালো", // string (ডিফল্ট)
  label: "টেক্সট বক্স",
};

// টাইপ দিলে সেটি ব্যবহার হবে
let numberBox: Container<number> = {
  value: 42,
  label: "নম্বর বক্স",
};

let boolBox: Container<boolean> = {
  value: true,
  label: "চেকবক্স",
};
```

### 5.2 একাধিক Default Type

```typescript
interface ApiConfig<
  TData = unknown,
  TError = Error,
  TMeta = Record<string, string>,
> {
  data: TData;
  error: TError | null;
  meta: TMeta;
}

// সব ডিফল্ট
let config1: ApiConfig = {
  data: "anything", // unknown
  error: null,
  meta: { version: "1.0" }, // Record<string, string>
};

// শুধু TData কাস্টম
let config2: ApiConfig<User[]> = {
  data: [{ id: 1, name: "রিপন", email: "test@test.com" }],
  error: null,
  meta: { page: "1" },
};

// সব কাস্টম
let config3: ApiConfig<Product[], string, { total: number }> = {
  data: [{ id: 1, name: "ল্যাপটপ", price: 150000 }],
  error: null,
  meta: { total: 1 },
};
```

### 5.3 ফাংশনে Default Type

```typescript
function createArray<T = string>(length: number, value: T): T[] {
  return Array(length).fill(value);
}

let strings = createArray(3, "হ্যালো"); // string[] — inferred
let numbers = createArray<number>(3, 0); // number[]
let booleans = createArray<boolean>(5, true); // boolean[]

console.log(strings); // ["হ্যালো", "হ্যালো", "হ্যালো"]
console.log(numbers); // [0, 0, 0]
console.log(booleans); // [true, true, true, true, true]
```

---

## 6. Generic Utility Types (জেনেরিক ইউটিলিটি টাইপ)

TypeScript বিল্ট-ইন কিছু **ইউটিলিটি টাইপ** দেয় যেগুলো জেনেরিক ব্যবহার করে বিদ্যমান টাইপকে **রূপান্তর** করে। এগুলো দৈনন্দিন কোডিংয়ে অত্যন্ত কার্যকর।

### 6.1 `Partial<T>` — সব প্রপার্টি ঐচ্ছিক

```typescript
interface User {
  id: number;
  name: string;
  email: string;
  age: number;
}

// Partial<User> — সব প্রপার্টি optional হয়ে যায়
function updateUser(id: number, updates: Partial<User>): void {
  console.log(`User ${id} আপডেট:`, updates);
}

// ✅ শুধু যেগুলো আপডেট করতে চান সেগুলো দিলেই হবে
updateUser(1, { name: "নতুন নাম" });
updateUser(1, { email: "new@test.com", age: 26 });
updateUser(1, {}); // ✅ খালিও চলবে

// Partial ছাড়া — সব প্রপার্টি দিতে হতো!
// updateUser(1, { id: 1, name: "নাম", email: "e@e.com", age: 25 }); 😢
```

### 6.2 `Required<T>` — সব প্রপার্টি বাধ্যতামূলক

```typescript
interface Config {
  host?: string;
  port?: number;
  debug?: boolean;
}

// Required<Config> — সব প্রপার্টি বাধ্যতামূলক
function startServer(config: Required<Config>): void {
  console.log(`Server: ${config.host}:${config.port} (debug: ${config.debug})`);
}

// ✅ সব দিতে হবে
startServer({ host: "localhost", port: 3000, debug: false });

// ❌ কোনোটা বাদ দেওয়া যাবে না
// startServer({ host: "localhost" }); // Error: 'port' and 'debug' are required
```

### 6.3 `Readonly<T>` — সব প্রপার্টি readonly

```typescript
interface AppState {
  user: string;
  theme: "light" | "dark";
  language: string;
}

const state: Readonly<AppState> = {
  user: "রিপন",
  theme: "dark",
  language: "bn",
};

// ❌ কোনো প্রপার্টি পরিবর্তন করা যাবে না
// state.user = "করিম";     // Error: Cannot assign to 'user'
// state.theme = "light";    // Error!
```

### 6.4 `Pick<T, K>` — নির্দিষ্ট প্রপার্টি বেছে নেওয়া

```typescript
interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  createdAt: Date;
}

// শুধু id, name, email নিয়ে নতুন টাইপ
type UserPublicInfo = Pick<User, "id" | "name" | "email">;

let publicUser: UserPublicInfo = {
  id: 1,
  name: "রিপন",
  email: "ripon@test.com",
  // password নেই — নিরাপদ! ✅
};

// API-তে প্রোফাইল দেখানোর জন্য
function getPublicProfile(user: User): Pick<User, "name" | "email"> {
  return { name: user.name, email: user.email };
}
```

### 6.5 `Omit<T, K>` — নির্দিষ্ট প্রপার্টি বাদ দেওয়া

```typescript
// password বাদ দিয়ে বাকি সব নিয়ে নতুন টাইপ
type UserWithoutPassword = Omit<User, "password">;

let safeUser: UserWithoutPassword = {
  id: 1,
  name: "রিপন",
  email: "ripon@test.com",
  createdAt: new Date(),
  // password বাদ — নিরাপদ! ✅
};

// নতুন User তৈরির DTO — id এবং createdAt বাদ
type CreateUserDto = Omit<User, "id" | "createdAt">;

let newUser: CreateUserDto = {
  name: "করিম",
  email: "karim@test.com",
  password: "secret123",
};
```

### 6.6 `Record<K, V>` — key-value ম্যাপ

```typescript
// Record দিয়ে dictionary/map তৈরি
type UserRole = "admin" | "editor" | "viewer";

const rolePermissions: Record<UserRole, string[]> = {
  admin: ["create", "read", "update", "delete"],
  editor: ["create", "read", "update"],
  viewer: ["read"],
};

console.log(rolePermissions.admin); // ["create", "read", "update", "delete"]

// HTTP Status Messages
type StatusCode = 200 | 404 | 500;

const statusMessages: Record<StatusCode, string> = {
  200: "সফল ✅",
  404: "পাওয়া যায়নি ❌",
  500: "সার্ভার ত্রুটি 💥",
};
```

### 6.7 `Exclude<T, U>` এবং `Extract<T, U>`

```typescript
type AllTypes = string | number | boolean | null | undefined;

// Exclude — নির্দিষ্ট টাইপ বাদ দেওয়া
type NonNullable2 = Exclude<AllTypes, null | undefined>;
// ফল: string | number | boolean

// Extract — নির্দিষ্ট টাইপ বের করা
type PrimitiveOnly = Extract<AllTypes, string | number>;
// ফল: string | number
```

### 6.8 `ReturnType<T>` এবং `Parameters<T>`

```typescript
function createUser(name: string, age: number) {
  return { id: Date.now(), name, age, active: true };
}

// ফাংশনের রিটার্ন টাইপ বের করা
type UserType = ReturnType<typeof createUser>;
// টাইপ: { id: number; name: string; age: number; active: boolean }

// ফাংশনের প্যারামিটার টাইপ বের করা
type UserParams = Parameters<typeof createUser>;
// টাইপ: [name: string, age: number]

let user: UserType = { id: 1, name: "রিপন", age: 25, active: true };
let params: UserParams = ["রিপন", 25];
```

::: tip ইউটিলিটি টাইপ সারসংক্ষেপ
| টাইপ | কাজ | উদাহরণ |
|---|---|---|
| `Partial<T>` | সব optional করে | `Partial<User>` |
| `Required<T>` | সব required করে | `Required<Config>` |
| `Readonly<T>` | সব readonly করে | `Readonly<State>` |
| `Pick<T, K>` | নির্দিষ্ট প্রপার্টি নেয় | `Pick<User, "name" \| "email">` |
| `Omit<T, K>` | নির্দিষ্ট প্রপার্টি বাদ দেয় | `Omit<User, "password">` |
| `Record<K, V>` | key-value ম্যাপ | `Record<string, number>` |
| `Exclude<T, U>` | U টাইপ বাদ দেয় | `Exclude<T, null>` |
| `Extract<T, U>` | U টাইপ বের করে | `Extract<T, string>` |
| `ReturnType<T>` | রিটার্ন টাইপ বের করে | `ReturnType<typeof fn>` |
| `Parameters<T>` | প্যারামিটার টাইপ বের করে | `Parameters<typeof fn>` |
:::

---

## সারসংক্ষেপ (Summary)

এই সেকশনে আমরা শিখলাম:

| বিষয়                 | বিবরণ                      | উদাহরণ                          |
| --------------------- | -------------------------- | ------------------------------- |
| **Generic Function**  | টাইপ-প্যারামিটারাইজড ফাংশন | `function fn<T>(x: T): T`       |
| **Generic Interface** | ফ্লেক্সিবল ইন্টারফেস       | `interface Box<T> { value: T }` |
| **Generic Class**     | পুনঃব্যবহারযোগ্য ক্লাস     | `class Stack<T> {}`             |
| **Constraints**       | টাইপ সীমাবদ্ধতা            | `<T extends HasLength>`         |
| **Default Type**      | ডিফল্ট টাইপ প্যারামিটার    | `<T = string>`                  |
| **Utility Types**     | বিল্ট-ইন টাইপ রূপান্তর     | `Partial<T>`, `Pick<T, K>`      |

::: tip পরবর্তী ধাপ
Generics ভালোভাবে বুঝে থাকলে এবার **Modules & Namespaces** সেকশনে যান, যেখানে শিখবেন কীভাবে কোড আলাদা ফাইলে ভাগ করে **import/export** করতে হয় এবং বড় প্রজেক্ট সুন্দরভাবে সংগঠিত করতে হয়।
:::
