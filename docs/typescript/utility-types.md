# Utility Types (ইউটিলিটি টাইপ)

TypeScript বিল্ট-ইন কিছু **ইউটিলিটি টাইপ** দেয় যেগুলো বিদ্যমান টাইপকে বিভিন্নভাবে **রূপান্তর (transform)** করে। এগুলো দৈনন্দিন TypeScript কোডিংয়ে **অত্যন্ত বেশি ব্যবহৃত** এবং কোডকে আরও **সংক্ষিপ্ত**, **রিইউজেবল** ও **টাইপ-সেফ** করে। এই সেকশনে আমরা সবগুলো গুরুত্বপূর্ণ ইউটিলিটি টাইপ **ব্যবহারিক উদাহরণসহ** বিস্তারিত শিখবো।

---

## রেফারেন্স মডেল

এই পুরো সেকশনে আমরা নিচের মডেলগুলো ব্যবহার করবো:

```typescript
interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  age: number;
  role: "admin" | "editor" | "viewer";
  createdAt: Date;
  deletedAt?: Date;
}

interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  category: string;
  inStock: boolean;
}
```

---

## 1. `Partial<T>` — সব প্রপার্টি ঐচ্ছিক করা

`Partial<T>` একটি টাইপের **সব প্রপার্টিকে optional (`?`)** করে দেয়।

```typescript
// Partial<User> → সব প্রপার্টি optional
type PartialUser = Partial<User>;
// ফল:
// {
//   id?: number;
//   name?: string;
//   email?: string;
//   password?: string;
//   age?: number;
//   role?: "admin" | "editor" | "viewer";
//   createdAt?: Date;
//   deletedAt?: Date;
// }
```

**ব্যবহারিক উদাহরণ — Update API:**

```typescript
// ✅ সবচেয়ে কমন ব্যবহার — Update ফাংশন
function updateUser(id: number, updates: Partial<User>): User {
  const existingUser: User = {
    id: 1,
    name: "রিপন",
    email: "ripon@test.com",
    password: "hashed",
    age: 25,
    role: "admin",
    createdAt: new Date(),
  };

  // শুধু যে প্রপার্টিগুলো দিয়েছেন সেগুলো আপডেট হবে
  return { ...existingUser, ...updates };
}

// ✅ শুধু নাম আপডেট
updateUser(1, { name: "রিপন আহমেদ" });

// ✅ একাধিক ফিল্ড আপডেট
updateUser(1, { email: "new@test.com", age: 26 });

// ✅ খালিও চলবে — কিছুই আপডেট হবে না
updateUser(1, {});

// ❌ Partial ছাড়া সব দিতে হতো! 😢
```

**ফর্ম ডেটা হ্যান্ডলিং:**

```typescript
// ফর্ম — প্রতিটি ফিল্ড আলাদাভাবে পূরণ হয়
interface RegistrationForm {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

// ফর্ম স্টেট — শুরুতে কিছুই পূরণ নেই
let formData: Partial<RegistrationForm> = {};

// ইউজার ফিল্ড পূরণ করছে...
formData.name = "রিপন";
formData.email = "ripon@test.com";

// ✅ সব পূরণ হলে validate
function isComplete(form: Partial<RegistrationForm>): form is RegistrationForm {
  return !!(form.name && form.email && form.password && form.confirmPassword);
}
```

---

## 2. `Required<T>` — সব প্রপার্টি বাধ্যতামূলক করা

`Required<T>` একটি টাইপের **সব optional প্রপার্টিকে required** করে দেয়। এটি `Partial<T>` এর বিপরীত।

```typescript
interface AppConfig {
  host?: string;
  port?: number;
  debug?: boolean;
  logLevel?: "info" | "warn" | "error";
}

// Required<AppConfig> → সব প্রপার্টি বাধ্যতামূলক
type StrictConfig = Required<AppConfig>;

// ✅ সব দিতে হবে — কোনোটা বাদ দেওয়া যাবে না
let config: StrictConfig = {
  host: "localhost",
  port: 3000,
  debug: false,
  logLevel: "error",
};

// ❌ কোনোটা বাদ দিলে Error
// let bad: StrictConfig = { host: "localhost" }; // Error: port, debug, logLevel missing

// ব্যবহারিক — validated config ensure
function startServer(rawConfig: AppConfig): void {
  // ডিফল্ট মান দিয়ে required করা
  const config: Required<AppConfig> = {
    host: rawConfig.host ?? "localhost",
    port: rawConfig.port ?? 3000,
    debug: rawConfig.debug ?? false,
    logLevel: rawConfig.logLevel ?? "info",
  };
  console.log(`Server: ${config.host}:${config.port}`);
}
```

---

## 3. `Readonly<T>` — সব প্রপার্টি পরিবর্তন-অযোগ্য করা

`Readonly<T>` সব প্রপার্টিতে **`readonly`** যোগ করে — একবার মান দেওয়ার পর আর পরিবর্তন করা যায় না।

```typescript
// Readonly<User> → সব readonly
const frozenUser: Readonly<User> = {
  id: 1,
  name: "রিপন",
  email: "ripon@test.com",
  password: "hashed",
  age: 25,
  role: "admin",
  createdAt: new Date(),
};

// ❌ কোনো প্রপার্টি পরিবর্তন করা যাবে না
// frozenUser.name = "করিম";    // Error: Cannot assign to 'name'
// frozenUser.age = 26;          // Error!

console.log(frozenUser.name); // ✅ পড়া যায়
```

**ব্যবহারিক — Redux-স্টাইল State:**

```typescript
interface AppState {
  user: User | null;
  products: Product[];
  isLoading: boolean;
}

// State সবসময় readonly — সরাসরি mutate করা যাবে না
function reducer(state: Readonly<AppState>, action: any): AppState {
  // ❌ state.isLoading = true; // Error!

  // ✅ নতুন state রিটার্ন করতে হবে — immutable pattern
  return { ...state, isLoading: true };
}
```

---

## 4. `Pick<T, K>` — নির্দিষ্ট প্রপার্টি বেছে নেওয়া

`Pick<T, K>` একটি টাইপ থেকে **নির্দিষ্ট কিছু প্রপার্টি** বেছে নিয়ে নতুন টাইপ তৈরি করে।

```typescript
// User থেকে শুধু id, name, email নেওয়া
type UserPreview = Pick<User, "id" | "name" | "email">;
// ফল: { id: number; name: string; email: string }

let preview: UserPreview = {
  id: 1,
  name: "রিপন",
  email: "ripon@test.com",
};

// ✅ API response — পাবলিক প্রোফাইল (password বাদ!)
type PublicProfile = Pick<User, "id" | "name" | "email" | "role">;

function getPublicProfile(user: User): PublicProfile {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
}

// ✅ Login credentials (শুধু email ও password)
type LoginCredentials = Pick<User, "email" | "password">;

function login(credentials: LoginCredentials): boolean {
  console.log(`Login: ${credentials.email}`);
  return true;
}

login({ email: "ripon@test.com", password: "secret" });
```

---

## 5. `Omit<T, K>` — নির্দিষ্ট প্রপার্টি বাদ দেওয়া

`Omit<T, K>` একটি টাইপ থেকে **নির্দিষ্ট কিছু প্রপার্টি বাদ** দিয়ে নতুন টাইপ তৈরি করে। এটি `Pick` এর বিপরীত।

```typescript
// User থেকে password বাদ
type SafeUser = Omit<User, "password">;

// User থেকে id ও createdAt বাদ — নতুন User তৈরির DTO
type CreateUserDto = Omit<User, "id" | "createdAt" | "deletedAt">;

let newUser: CreateUserDto = {
  name: "করিম",
  email: "karim@test.com",
  password: "secret123",
  age: 28,
  role: "editor",
};

// ✅ API response — password ছাড়া
function sanitizeUser(user: User): Omit<User, "password"> {
  const { password, ...safeUser } = user;
  return safeUser;
}

// ✅ Update DTO — id, createdAt পরিবর্তন করা যাবে না
type UpdateUserDto = Partial<Omit<User, "id" | "createdAt">>;
// ফল: সব optional, কিন্তু id ও createdAt নেই!

function updateUser(id: number, data: UpdateUserDto): void {
  console.log(`Updating user ${id}:`, data);
}

updateUser(1, { name: "নতুন নাম" }); // ✅
updateUser(1, { email: "new@test.com", age: 30 }); // ✅
// updateUser(1, { id: 99 });                  // ❌ Error: id নেই!
```

::: tip Pick vs Omit — কোনটি কখন?
| পরিস্থিতি | ব্যবহার করুন |
|---|---|
| অল্প কিছু প্রপার্টি **দরকার** | `Pick` ✅ |
| অল্প কিছু প্রপার্টি **বাদ** দিতে চান | `Omit` ✅ |
| বেশিরভাগ প্রপার্টি দরকার, কিছু বাদ | `Omit` ✅ |
| DTO/API response তৈরি | দুটোই কাজে লাগে |
:::

---

## 6. `Exclude<T, U>` — Union থেকে টাইপ বাদ দেওয়া

`Exclude<T, U>` একটি **Union type** থেকে নির্দিষ্ট কিছু টাইপ **বাদ** দেয়।

```typescript
type AllTypes = string | number | boolean | null | undefined;

// null ও undefined বাদ
type ValidTypes = Exclude<AllTypes, null | undefined>;
// ফল: string | number | boolean

// string বাদ
type NonStringTypes = Exclude<AllTypes, string>;
// ফল: number | boolean | null | undefined

// ব্যবহারিক উদাহরণ
type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

// শুধু read-only methods
type ReadOnlyMethods = Exclude<HttpMethod, "POST" | "PUT" | "DELETE" | "PATCH">;
// ফল: "GET"

// write methods
type WriteMethods = Exclude<HttpMethod, "GET">;
// ফল: "POST" | "PUT" | "DELETE" | "PATCH"

// Event filtering
type DomEvent = "click" | "focus" | "blur" | "submit" | "change" | "input";
type FormEvent = Exclude<DomEvent, "click" | "focus" | "blur">;
// ফল: "submit" | "change" | "input"
```

---

## 7. `Extract<T, U>` — Union থেকে টাইপ বের করা

`Extract<T, U>` একটি **Union type** থেকে নির্দিষ্ট টাইপ **বের** করে। এটি `Exclude` এর বিপরীত।

```typescript
type AllTypes = string | number | boolean | null | undefined;

// শুধু string ও number বের করা
type StringOrNumber = Extract<AllTypes, string | number>;
// ফল: string | number

// শুধু falsy types বের করা
type FalsyTypes = Extract<AllTypes, null | undefined | boolean>;
// ফল: boolean | null | undefined

// ব্যবহারিক — দুটি টাইপের কমন প্রপার্টি বের করা
type UserKeys = "id" | "name" | "email" | "age";
type FormFields = "name" | "email" | "password" | "phone";

// দুটোতে কমন
type CommonFields = Extract<UserKeys, FormFields>;
// ফল: "name" | "email"

// শুধু User-এ আছে কিন্তু Form-এ নেই
type UserOnlyFields = Exclude<UserKeys, FormFields>;
// ফল: "id" | "age"
```

::: info Exclude vs Extract
| ইউটিলিটি | কাজ | উদাহরণ |
|---|---|---|
| `Exclude<T, U>` | T থেকে U **বাদ** দেয় | `Exclude<"a"\|"b"\|"c", "a">` → `"b"\|"c"` |
| `Extract<T, U>` | T থেকে U **বের** করে | `Extract<"a"\|"b"\|"c", "a"\|"b">` → `"a"\|"b"` |
:::

---

## 8. `Record<K, V>` — Key-Value ম্যাপ তৈরি

`Record<K, V>` একটি নির্দিষ্ট **key type** এবং **value type** দিয়ে **dictionary/map** টাইপ তৈরি করে।

```typescript
// string key, number value
type ScoreBoard = Record<string, number>;

let scores: ScoreBoard = {
  রিপন: 95,
  করিম: 88,
  রহিম: 92,
};

// নির্দিষ্ট keys — literal union
type UserRole = "admin" | "editor" | "viewer";

const rolePermissions: Record<UserRole, string[]> = {
  admin: ["create", "read", "update", "delete"],
  editor: ["create", "read", "update"],
  viewer: ["read"],
};

// ❌ কোনো role বাদ দেওয়া যাবে না
// const bad: Record<UserRole, string[]> = {
//   admin: ["all"],
//   // editor, viewer বাদ — Error!
// };

// ব্যবহারিক — Error messages
type FormField = "name" | "email" | "password";

const validationErrors: Record<FormField, string> = {
  name: "নাম খালি রাখা যাবে না",
  email: "সঠিক ইমেইল দিন",
  password: "পাসওয়ার্ড কমপক্ষে ৬ অক্ষর",
};

// ব্যবহারিক — Status mapping
type StatusCode = 200 | 201 | 400 | 401 | 404 | 500;

const statusMessages: Record<StatusCode, string> = {
  200: "সফল ✅",
  201: "তৈরি হয়েছে ✅",
  400: "ভুল অনুরোধ ❌",
  401: "অনুমতি নেই 🔒",
  404: "পাওয়া যায়নি 🔍",
  500: "সার্ভার ত্রুটি 💥",
};
```

---

## 9. `ReturnType<T>` — ফাংশনের রিটার্ন টাইপ বের করা

`ReturnType<T>` একটি **ফাংশন টাইপের** রিটার্ন টাইপ বের করে।

```typescript
function createUser(name: string, age: number) {
  return {
    id: Date.now(),
    name,
    age,
    active: true,
    createdAt: new Date(),
  };
}

// ফাংশনের রিটার্ন টাইপ বের করা
type CreatedUser = ReturnType<typeof createUser>;
// ফল: { id: number; name: string; age: number; active: boolean; createdAt: Date }

// এখন এই টাইপ অন্য জায়গায় ব্যবহার করা যায়
function processUser(user: CreatedUser): void {
  console.log(`${user.name} (ID: ${user.id})`);
}

// async ফাংশনে — Promise-এর ভেতরের টাইপ পেতে Awaited ব্যবহার করতে হবে
async function fetchUsers() {
  return [
    { id: 1, name: "রিপন" },
    { id: 2, name: "করিম" },
  ];
}

type FetchResult = ReturnType<typeof fetchUsers>;
// ফল: Promise<{ id: number; name: string }[]>

type UsersData = Awaited<ReturnType<typeof fetchUsers>>;
// ফল: { id: number; name: string }[] — Promise unwrap!
```

---

## 10. `Parameters<T>` — ফাংশনের প্যারামিটার টাইপ বের করা

`Parameters<T>` একটি ফাংশনের **সব প্যারামিটারের টাইপ** একটি **tuple** হিসেবে রিটার্ন করে।

```typescript
function registerUser(name: string, email: string, age: number, role: string) {
  return { name, email, age, role };
}

// ফাংশনের প্যারামিটার টাইপ tuple
type RegisterParams = Parameters<typeof registerUser>;
// ফল: [name: string, email: string, age: number, role: string]

// spread operator দিয়ে ফাংশন কল
const params: RegisterParams = ["রিপন", "ripon@test.com", 25, "admin"];
const user = registerUser(...params);

// নির্দিষ্ট প্যারামিটারের টাইপ বের করা
type FirstParam = Parameters<typeof registerUser>[0]; // string (name)
type ThirdParam = Parameters<typeof registerUser>[2]; // number (age)

// ব্যবহারিক — wrapper function তৈরি
function logAndExecute<T extends (...args: any[]) => any>(
  fn: T,
  ...args: Parameters<T>
): ReturnType<T> {
  console.log(`Calling ${fn.name} with:`, args);
  return fn(...args);
}

logAndExecute(registerUser, "রিপন", "ripon@test.com", 25, "admin");
```

---

## 11. `NonNullable<T>` — null ও undefined বাদ দেওয়া

`NonNullable<T>` একটি টাইপ থেকে **`null`** এবং **`undefined`** বাদ দেয়।

```typescript
type MaybeString = string | null | undefined;

// null ও undefined বাদ
type DefiniteString = NonNullable<MaybeString>;
// ফল: string

// ব্যবহারিক উদাহরণ
type UserName = string | null;
type UserAge = number | undefined;
type UserData = string | number | null | undefined;

type SafeName = NonNullable<UserName>; // string
type SafeAge = NonNullable<UserAge>; // number
type SafeData = NonNullable<UserData>; // string | number

// ফাংশনে ব্যবহার
function processValue<T>(value: T): NonNullable<T> {
  if (value === null || value === undefined) {
    throw new Error("❌ মান null বা undefined হতে পারবে না!");
  }
  return value as NonNullable<T>;
}

let safeName = processValue<string | null>("রিপন"); // টাইপ: string ✅
// let bad = processValue<string | null>(null);       // 💥 রানটাইম Error!

// API থেকে আসা ডেটা নিরাপদ করা
interface ApiResponse {
  user: User | null;
  token: string | undefined;
}

function handleResponse(response: ApiResponse) {
  const user: NonNullable<ApiResponse["user"]> = response.user!;
  const token: NonNullable<ApiResponse["token"]> = response.token!;
  console.log(user.name, token);
}
```

---

## 12. `InstanceType<T>` — ক্লাসের ইনস্ট্যান্স টাইপ বের করা

`InstanceType<T>` একটি **constructor function/class** এর ইনস্ট্যান্সের টাইপ বের করে।

```typescript
class UserService {
  constructor(
    public name: string,
    public apiKey: string,
  ) {}

  fetchUsers(): string[] {
    return ["রিপন", "করিম"];
  }
}

// ক্লাসের ইনস্ট্যান্স টাইপ
type UserServiceInstance = InstanceType<typeof UserService>;
// ফল: UserService

let service: UserServiceInstance = new UserService("main", "key-123");
console.log(service.fetchUsers()); // ["রিপন", "করিম"]

// ব্যবহারিক — Factory Pattern
function createInstance<T extends new (...args: any[]) => any>(
  ClassRef: T,
  ...args: ConstructorParameters<T>
): InstanceType<T> {
  return new ClassRef(...args);
}

const svc = createInstance(UserService, "api", "secret-key");
console.log(svc.name); // "api" ✅

// ConstructorParameters — constructor-এর প্যারামিটার টাইপ
type UserServiceParams = ConstructorParameters<typeof UserService>;
// ফল: [name: string, apiKey: string]
```

---

## 13. `Awaited<T>` — Promise-এর ভেতরের টাইপ বের করা

`Awaited<T>` (TypeScript 4.5+) একটি **Promise-এর resolved value** টাইপ বের করে। নেস্টেড Promise-ও **recursive** ভাবে unwrap করে।

```typescript
// সাধারণ Promise
type A = Awaited<Promise<string>>; // string
type B = Awaited<Promise<number>>; // number

// নেস্টেড Promise — recursive unwrap!
type C = Awaited<Promise<Promise<boolean>>>; // boolean
type D = Awaited<Promise<Promise<Promise<string>>>>; // string

// Promise না হলে টাইপ unchanged থাকে
type E = Awaited<string>; // string
type F = Awaited<number>; // number

// ব্যবহারিক — async ফাংশনের রিটার্ন টাইপ
async function fetchUserData() {
  const response = await fetch("/api/users");
  const data: User[] = await response.json();
  return data;
}

// Promise ছাড়া আসল data টাইপ পেতে
type UserData = Awaited<ReturnType<typeof fetchUserData>>;
// ফল: User[] (Promise<User[]> থেকে Promise সরে গেছে)

// Promise.all — সব Promise-এর টাইপ বের করা
async function fetchAll() {
  const [users, products] = await Promise.all([
    fetch("/api/users").then((r) => r.json() as Promise<User[]>),
    fetch("/api/products").then((r) => r.json() as Promise<Product[]>),
  ]);
  return { users, products };
}

type AllData = Awaited<ReturnType<typeof fetchAll>>;
// ফল: { users: User[]; products: Product[] }

// Generic async handler
async function handleAsync<T extends Promise<any>>(
  promise: T,
): Promise<Awaited<T>> {
  try {
    const result = await promise;
    console.log("✅ সফল:", result);
    return result;
  } catch (error) {
    console.log("❌ ব্যর্থ:", error);
    throw error;
  }
}
```

---

## সম্মিলিত ব্যবহার — Real-world Patterns

### Pattern 1: CRUD DTO তৈরি

```typescript
interface Entity {
  id: number;
  name: string;
  description: string;
  status: "active" | "inactive";
  createdAt: Date;
  updatedAt: Date;
}

// Create — id, createdAt, updatedAt বাদ
type CreateDto = Omit<Entity, "id" | "createdAt" | "updatedAt">;

// Update — id বাদ, বাকি সব optional
type UpdateDto = Partial<Omit<Entity, "id" | "createdAt" | "updatedAt">>;

// Response — password-এর মতো sensitive data বাদ
type ResponseDto = Readonly<Omit<Entity, never>>;

// List Query — শুধু filter-এর জন্য
type FilterDto = Partial<Pick<Entity, "name" | "status">>;
```

### Pattern 2: Form State Management

```typescript
// ফর্মের প্রতিটি ফিল্ডের state
type FormFieldState<T> = {
  [K in keyof T]: {
    value: T[K];
    error: string | null;
    touched: boolean;
    dirty: boolean;
  };
};

type LoginForm = {
  email: string;
  password: string;
};

type LoginFormState = FormFieldState<LoginForm>;
// ফল:
// {
//   email: { value: string; error: string | null; touched: boolean; dirty: boolean };
//   password: { value: string; error: string | null; touched: boolean; dirty: boolean };
// }
```

---

## সারসংক্ষেপ (Summary)

| ইউটিলিটি টাইপ     | কাজ                              | উদাহরণ                          |
| ----------------- | -------------------------------- | ------------------------------- |
| `Partial<T>`      | সব optional করে                  | `Partial<User>`                 |
| `Required<T>`     | সব required করে                  | `Required<Config>`              |
| `Readonly<T>`     | সব readonly করে                  | `Readonly<State>`               |
| `Pick<T, K>`      | নির্দিষ্ট প্রপার্টি **নেয়**     | `Pick<User, "name" \| "email">` |
| `Omit<T, K>`      | নির্দিষ্ট প্রপার্টি **বাদ** দেয় | `Omit<User, "password">`        |
| `Exclude<T, U>`   | Union থেকে টাইপ **বাদ**          | `Exclude<T, null>`              |
| `Extract<T, U>`   | Union থেকে টাইপ **বের**          | `Extract<T, string>`            |
| `Record<K, V>`    | key-value ম্যাপ                  | `Record<string, number>`        |
| `ReturnType<T>`   | রিটার্ন টাইপ বের করে             | `ReturnType<typeof fn>`         |
| `Parameters<T>`   | প্যারামিটার টাইপ বের করে         | `Parameters<typeof fn>`         |
| `NonNullable<T>`  | null/undefined বাদ               | `NonNullable<string \| null>`   |
| `InstanceType<T>` | ক্লাসের ইনস্ট্যান্স টাইপ         | `InstanceType<typeof Class>`    |
| `Awaited<T>`      | Promise unwrap                   | `Awaited<Promise<string>>`      |

::: tip পরবর্তী ধাপ
Utility Types ভালোভাবে আয়ত্ত করলে আপনি TypeScript-এর প্রায় সব দৈনন্দিন চাহিদা পূরণ করতে পারবেন। এবার **Decorators ও Advanced Patterns** সেকশনে যান অথবা বাস্তব প্রজেক্টে এই টাইপগুলো প্রয়োগ করুন।
:::
