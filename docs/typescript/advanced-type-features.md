# Advanced Type Features (অ্যাডভান্সড টাইপ ফিচার)

TypeScript-এর টাইপ সিস্টেম শুধু সাধারণ টাইপ চেকিংয়ের মধ্যে সীমাবদ্ধ নয় — এটি একটি পূর্ণাঙ্গ **টাইপ-লেভেল প্রোগ্রামিং ভাষা**। এই সেকশনে আমরা শিখবো কীভাবে বিদ্যমান টাইপ থেকে **নতুন টাইপ তৈরি**, **শর্তসাপেক্ষ টাইপ**, এবং **টেমপ্লেট লিটারেল টাইপ** ব্যবহার করতে হয়। এগুলো লাইব্রেরি তৈরি এবং জটিল অ্যাপ্লিকেশন ডেভেলপমেন্টে অপরিহার্য।

---

## 1. Keyof এবং Typeof Operators

### 1.1 `keyof` — অবজেক্টের সব key বের করা

`keyof` অপারেটর একটি টাইপের সব **property key** বের করে একটি **union type** হিসেবে রিটার্ন করে:

```typescript
interface User {
  id: number;
  name: string;
  email: string;
  age: number;
}

// keyof User → "id" | "name" | "email" | "age"
type UserKeys = keyof User;

let key1: UserKeys = "name"; // ✅
let key2: UserKeys = "email"; // ✅
// let key3: UserKeys = "phone"; // ❌ Error: "phone" নেই User-এ

// ব্যবহারিক উদাহরণ — নিরাপদ property access
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const user: User = { id: 1, name: "রিপন", email: "ripon@test.com", age: 25 };

let userName = getProperty(user, "name"); // টাইপ: string ✅
let userAge = getProperty(user, "age"); // টাইপ: number ✅
// getProperty(user, "phone");               // ❌ Error: "phone" নেই
```

### 1.2 `typeof` — ভেরিয়েবল থেকে টাইপ বের করা

`typeof` অপারেটর একটি **ভ্যালু/ভেরিয়েবল** থেকে তার **টাইপ** বের করে:

```typescript
const config = {
  host: "localhost",
  port: 3000,
  debug: true,
  database: "myapp",
};

// typeof দিয়ে config-এর টাইপ বের করা
type AppConfig = typeof config;
// ফল: { host: string; port: number; debug: boolean; database: string }

// এখন এই টাইপ ব্যবহার করে অন্য ভেরিয়েবল তৈরি
let devConfig: AppConfig = {
  host: "dev.server.com",
  port: 8080,
  debug: true,
  database: "dev_db",
};

// ফাংশনের টাইপ বের করা
function createUser(name: string, age: number) {
  return { id: Date.now(), name, age };
}

type CreateUserFn = typeof createUser;
// ফল: (name: string, age: number) => { id: number; name: string; age: number }

// ✅ keyof + typeof একসাথে — খুবই কমন প্যাটার্ন!
type ConfigKeys = keyof typeof config;
// ফল: "host" | "port" | "debug" | "database"
```

### 1.3 Enum-এ typeof + keyof

```typescript
enum HttpMethod {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  DELETE = "DELETE",
}

// enum-এর সব key পেতে
type HttpMethodName = keyof typeof HttpMethod;
// ফল: "GET" | "POST" | "PUT" | "DELETE"

function logMethod(method: HttpMethodName): void {
  console.log(`Method: ${method}`);
}

logMethod("GET"); // ✅
logMethod("POST"); // ✅
// logMethod("PATCH"); // ❌ Error!
```

---

## 2. Index Accessed Types (ইনডেক্স অ্যাক্সেসড টাইপ)

Index access দিয়ে একটি টাইপের **নির্দিষ্ট প্রপার্টির টাইপ** বের করা যায়। এটি **অবজেক্ট প্রপার্টির টাইপ বের করার** উপায়।

### 2.1 বেসিক Index Access

```typescript
interface User {
  id: number;
  name: string;
  email: string;
  address: {
    street: string;
    city: string;
    zip: string;
  };
  roles: string[];
}

// নির্দিষ্ট প্রপার্টির টাইপ বের করা
type UserName = User["name"]; // string
type UserAddress = User["address"]; // { street: string; city: string; zip: string }
type UserRoles = User["roles"]; // string[]
type UserCity = User["address"]["city"]; // string — নেস্টেড অ্যাক্সেস

let name: UserName = "রিপন"; // ✅ string
let address: UserAddress = {
  // ✅
  street: "মিরপুর",
  city: "ঢাকা",
  zip: "1216",
};
```

### 2.2 Union দিয়ে একাধিক প্রপার্টির টাইপ

```typescript
// একসাথে একাধিক প্রপার্টির টাইপ — union হিসেবে আসে
type UserNameOrEmail = User["name" | "email"]; // string | string → string
type UserIdOrName = User["id" | "name"]; // number | string

// keyof দিয়ে সব প্রপার্টির value টাইপ
type UserValues = User[keyof User];
// ফল: number | string | { street: string; city: string; zip: string } | string[]
```

### 2.3 অ্যারে থেকে এলিমেন্ট টাইপ বের করা

```typescript
// অ্যারের এলিমেন্ট টাইপ বের করা — [number] ব্যবহার করে
type Roles = User["roles"]; // string[]
type RoleItem = User["roles"][number]; // string — অ্যারের এলিমেন্ট টাইপ

// Tuple থেকে specific index-এর টাইপ
type UserTuple = [number, string, boolean];
type First = UserTuple[0]; // number
type Second = UserTuple[1]; // string
type Third = UserTuple[2]; // boolean

// const array থেকে union type তৈরি
const fruits = ["আম", "কাঁঠাল", "লিচু"] as const;
type Fruit = (typeof fruits)[number]; // "আম" | "কাঁঠাল" | "লিচু"

let myFruit: Fruit = "আম"; // ✅
// let bad: Fruit = "আপেল";   // ❌ Error!
```

---

## 3. Mapped Types (ম্যাপড টাইপ)

Mapped type দিয়ে একটি বিদ্যমান টাইপের **প্রতিটি প্রপার্টি** নিয়ে **নতুন টাইপ তৈরি** করা যায়। এটি `for...in` লুপের মতো কাজ করে, কিন্তু **টাইপ লেভেলে**।

### 3.1 বেসিক Mapped Type

```typescript
// সিনট্যাক্স: { [K in KeysType]: ValueType }

interface User {
  id: number;
  name: string;
  email: string;
  age: number;
}

// সব প্রপার্টি optional করা (Partial-এর মতো)
type MyPartial<T> = {
  [K in keyof T]?: T[K];
};

// সব প্রপার্টি readonly করা (Readonly-এর মতো)
type MyReadonly<T> = {
  readonly [K in keyof T]: T[K];
};

// ব্যবহার
type PartialUser = MyPartial<User>;
// ফল: { id?: number; name?: string; email?: string; age?: number }

type ReadonlyUser = MyReadonly<User>;
// ফল: { readonly id: number; readonly name: string; readonly email: string; readonly age: number }

let partialUser: PartialUser = { name: "রিপন" }; // ✅ শুধু name দিলেই হবে
```

### 3.2 প্রপার্টি টাইপ পরিবর্তন

```typescript
// সব প্রপার্টির value-কে boolean করা
type Flags<T> = {
  [K in keyof T]: boolean;
};

type UserFlags = Flags<User>;
// ফল: { id: boolean; name: boolean; email: boolean; age: boolean }

let dirtyFields: UserFlags = {
  id: false,
  name: true, // পরিবর্তন হয়েছে
  email: true, // পরিবর্তন হয়েছে
  age: false,
};

// সব প্রপার্টিকে nullable করা
type Nullable<T> = {
  [K in keyof T]: T[K] | null;
};

type NullableUser = Nullable<User>;
// ফল: { id: number | null; name: string | null; email: string | null; age: number | null }
```

### 3.3 Key Remapping (`as`)

TypeScript 4.1+ এ key রিম্যাপিং করা যায়:

```typescript
// সব key-তে "get" prefix যোগ
type Getters<T> = {
  [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K];
};

type UserGetters = Getters<User>;
// ফল:
// {
//   getId: () => number;
//   getName: () => string;
//   getEmail: () => string;
//   getAge: () => number;
// }

// নির্দিষ্ট টাইপের প্রপার্টি বাদ দেওয়া
type RemoveType<T, U> = {
  [K in keyof T as T[K] extends U ? never : K]: T[K];
};

type UserWithoutNumbers = RemoveType<User, number>;
// ফল: { name: string; email: string } — number প্রপার্টি বাদ!
```

### 3.4 Modifier যোগ/সরানো (`+` / `-`)

```typescript
// optional modifier সরানো — Required-এর মতো
type MyRequired<T> = {
  [K in keyof T]-?: T[K]; // -? মানে optional সরাও
};

// readonly modifier সরানো — Mutable করা
type Mutable<T> = {
  -readonly [K in keyof T]: T[K]; // -readonly মানে readonly সরাও
};

interface Config {
  readonly host: string;
  readonly port: number;
  debug?: boolean;
}

type MutableConfig = Mutable<Config>;
// ফল: { host: string; port: number; debug?: boolean }
// readonly সরে গেছে, এখন পরিবর্তনযোগ্য!

type StrictConfig = MyRequired<Config>;
// ফল: { readonly host: string; readonly port: number; debug: boolean }
// debug এখন বাধ্যতামূলক!
```

---

## 4. Conditional Types (শর্তসাপেক্ষ টাইপ)

Conditional type দিয়ে **শর্তের উপর ভিত্তি করে** ভিন্ন টাইপ রিটার্ন করা যায়। এটি টাইপ লেভেলে `if-else` এর মতো কাজ করে।

**সিনট্যাক্স:** `T extends U ? X : Y`

### 4.1 বেসিক Conditional Type

```typescript
// T যদি string হয় তাহলে true, নাহলে false
type IsString<T> = T extends string ? true : false;

type A = IsString<string>; // true
type B = IsString<number>; // false
type C = IsString<"hello">; // true — "hello" string-এর সাবটাইপ

// T যদি array হয় তাহলে element type বের করো
type ElementType<T> = T extends (infer E)[] ? E : T;

type D = ElementType<string[]>; // string
type E = ElementType<number[]>; // number
type F = ElementType<boolean>; // boolean — array না, তাই T-ই রিটার্ন
```

### 4.2 ব্যবহারিক Conditional Types

```typescript
// null/undefined বাদ দেওয়া — NonNullable-এর মতো
type MyNonNullable<T> = T extends null | undefined ? never : T;

type G = MyNonNullable<string | null | undefined>; // string
type H = MyNonNullable<number | null>; // number

// ফাংশনের রিটার্ন টাইপ বের করা — ReturnType-এর মতো
type MyReturnType<T> = T extends (...args: any[]) => infer R ? R : never;

type I = MyReturnType<() => string>; // string
type J = MyReturnType<(x: number) => boolean>; // boolean

// Promise-এর ভেতরের টাইপ বের করা — Awaited-এর মতো
type UnwrapPromise<T> = T extends Promise<infer U> ? U : T;

type K = UnwrapPromise<Promise<string>>; // string
type L = UnwrapPromise<Promise<number>>; // number
type M = UnwrapPromise<string>; // string — Promise না, তাই T-ই রিটার্ন
```

### 4.3 Distributive Conditional Types

Union type-এ conditional type **স্বয়ংক্রিয়ভাবে বিতরণ (distribute)** হয়:

```typescript
type ToArray<T> = T extends any ? T[] : never;

// Union-এর প্রতিটি member-এ আলাদাভাবে কাজ করে
type N = ToArray<string | number>;
// ফল: string[] | number[] (string | number)[] না!

// Distribute বন্ধ করতে চাইলে [] দিয়ে ঘিরতে হয়
type ToArrayNonDist<T> = [T] extends [any] ? T[] : never;

type O = ToArrayNonDist<string | number>;
// ফল: (string | number)[] — একটি মিশ্র অ্যারে
```

---

## 5. Template Literal Types (টেমপ্লেট লিটারেল টাইপ)

TypeScript 4.1+ এ **string template literal**-কে টাইপ লেভেলে ব্যবহার করা যায়। এটি **string pattern** তৈরি এবং **string manipulation** টাইপ লেভেলে করার সুযোগ দেয়।

### 5.1 বেসিক Template Literal Type

```typescript
// নির্দিষ্ট string pattern তৈরি
type Greeting = `হ্যালো, ${string}!`;

let g1: Greeting = "হ্যালো, রিপন!"; // ✅
let g2: Greeting = "হ্যালো, করিম!"; // ✅
// let g3: Greeting = "বাই, রিপন!";    // ❌ Error: "হ্যালো," দিয়ে শুরু হয়নি

// Union type-এর সাথে template literal
type Color = "red" | "green" | "blue";
type Shade = "light" | "dark";

type ColorVariant = `${Shade}-${Color}`;
// ফল: "light-red" | "light-green" | "light-blue" | "dark-red" | "dark-green" | "dark-blue"

let myColor: ColorVariant = "dark-blue"; // ✅
// let bad: ColorVariant = "medium-red";   // ❌ Error!
```

### 5.2 CSS-এর মতো টাইপ তৈরি

```typescript
// CSS unit সিস্টেম — টাইপ সেফ!
type CSSUnit = "px" | "em" | "rem" | "%" | "vh" | "vw";
type CSSValue = `${number}${CSSUnit}`;

let width: CSSValue = "100px"; // ✅
let height: CSSValue = "50vh"; // ✅
let padding: CSSValue = "2rem"; // ✅
// let bad: CSSValue = "100";      // ❌ Error: unit নেই
// let bad2: CSSValue = "big-px";  // ❌ Error: number নেই

// Event handler pattern
type EventName = "click" | "focus" | "blur" | "change";
type EventHandler = `on${Capitalize<EventName>}`;
// ফল: "onClick" | "onFocus" | "onBlur" | "onChange"

let handler: EventHandler = "onClick"; // ✅
// let bad: EventHandler = "onclick";   // ❌ Error: ছোট হাতের "c"
```

### 5.3 Built-in String Manipulation Types

```typescript
// TypeScript-এর বিল্ট-ইন string manipulation types
type Upper = Uppercase<"hello">; // "HELLO"
type Lower = Lowercase<"HELLO">; // "hello"
type Cap = Capitalize<"hello">; // "Hello"
type Uncap = Uncapitalize<"Hello">; // "hello"

// ব্যবহারিক উদাহরণ — API endpoint তৈরি
type Entity = "user" | "product" | "order";

type ApiEndpoint = `/${Entity}` | `/${Entity}/${number}`;
// ফল: "/user" | "/product" | "/order" | `/user/${number}` | ...

type CrudAction =
  `${"get" | "create" | "update" | "delete"}${Capitalize<Entity>}`;
// ফল: "getUser" | "createUser" | "updateUser" | "deleteUser" | "getProduct" | ...

let action: CrudAction = "createUser"; // ✅
let endpoint: ApiEndpoint = "/product"; // ✅
```

### 5.4 Object Key Pattern

```typescript
// getter/setter pattern — template literal দিয়ে
type PropGetters<T> = {
  [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K];
};

type PropSetters<T> = {
  [K in keyof T as `set${Capitalize<string & K>}`]: (value: T[K]) => void;
};

interface Person {
  name: string;
  age: number;
}

type PersonGetters = PropGetters<Person>;
// ফল: { getName: () => string; getAge: () => number }

type PersonSetters = PropSetters<Person>;
// ফল: { setName: (value: string) => void; setAge: (value: number) => void }

// দুটো একসাথে — full accessor
type PersonAccessors = PropGetters<Person> & PropSetters<Person>;
```

---

## 6. Type Inference in Conditional Types (`infer`)

`infer` কিওয়ার্ড দিয়ে conditional type-এর ভেতরে **একটি টাইপ ভেরিয়েবল** ডিক্লেয়ার করা যায় এবং TypeScript সেই টাইপটি **স্বয়ংক্রিয়ভাবে বের করে দেয়**।

### 6.1 বেসিক `infer`

```typescript
// ফাংশনের রিটার্ন টাইপ বের করা
type GetReturnType<T> = T extends (...args: any[]) => infer R ? R : never;

type A = GetReturnType<() => string>; // string
type B = GetReturnType<(x: number) => boolean>; // boolean
type C = GetReturnType<() => { name: string }>; // { name: string }

// ফাংশনের প্রথম প্যারামিটার টাইপ বের করা
type FirstParam<T> = T extends (first: infer P, ...rest: any[]) => any
  ? P
  : never;

type D = FirstParam<(name: string, age: number) => void>; // string
type E = FirstParam<(id: number) => void>; // number
```

### 6.2 Array/Promise Unwrap

```typescript
// অ্যারের element টাইপ বের করা
type ArrayElement<T> = T extends (infer E)[] ? E : never;

type F = ArrayElement<string[]>; // string
type G = ArrayElement<number[]>; // number
type H = ArrayElement<User[]>; // User

// Promise-এর ভেতরের টাইপ — recursive unwrap
type DeepAwaited<T> = T extends Promise<infer U> ? DeepAwaited<U> : T;

type I = DeepAwaited<Promise<string>>; // string
type J = DeepAwaited<Promise<Promise<number>>>; // number — নেস্টেড Promise!
type K = DeepAwaited<Promise<Promise<Promise<boolean>>>>; // boolean

// Tuple-এর প্রথম ও শেষ element
type First<T extends any[]> = T extends [infer F, ...any[]] ? F : never;
type Last<T extends any[]> = T extends [...any[], infer L] ? L : never;

type L = First<[1, 2, 3]>; // 1
type M = Last<[1, 2, 3]>; // 3
```

### 6.3 String Pattern Matching

```typescript
// string থেকে নির্দিষ্ট অংশ বের করা
type ExtractRoute<T extends string> = T extends `/${infer Resource}/${infer Id}`
  ? { resource: Resource; id: Id }
  : T extends `/${infer Resource}`
    ? { resource: Resource }
    : never;

type R1 = ExtractRoute<"/users/123">; // { resource: "users"; id: "123" }
type R2 = ExtractRoute<"/products">; // { resource: "products" }

// CamelCase to kebab-case
type CamelToKebab<S extends string> = S extends `${infer Head}${infer Tail}`
  ? Tail extends Uncapitalize<Tail>
    ? `${Lowercase<Head>}${CamelToKebab<Tail>}`
    : `${Lowercase<Head>}-${CamelToKebab<Tail>}`
  : S;

type N = CamelToKebab<"backgroundColor">; // "background-color"
type O = CamelToKebab<"fontSize">; // "font-size"
```

### 6.4 ব্যবহারিক উদাহরণ — Event System

```typescript
// Event emitter-এর জন্য টাইপ-সেফ সিস্টেম
interface EventMap {
  click: { x: number; y: number };
  focus: { target: string };
  submit: { data: Record<string, string> };
}

type EventHandler<T extends keyof EventMap> = (event: EventMap[T]) => void;

// টাইপ-সেফ event listener
function on<T extends keyof EventMap>(
  event: T,
  handler: EventHandler<T>,
): void {
  console.log(`"${event}" ইভেন্ট রেজিস্টার হলো`);
}

// ✅ টাইপ-সেফ — সঠিক event data
on("click", (e) => {
  console.log(e.x, e.y); // ✅ x, y আছে
});

on("submit", (e) => {
  console.log(e.data); // ✅ data আছে
});

// ❌ ভুল event data
// on("click", (e) => {
//   console.log(e.data); // Error: "data" নেই click event-এ
// });
```

---

## সারসংক্ষেপ (Summary)

এই সেকশনে আমরা শিখলাম:

| বিষয়                 | বিবরণ                    | উদাহরণ                          |
| --------------------- | ------------------------ | ------------------------------- |
| **`keyof`**           | অবজেক্টের সব key union   | `keyof User` → `"id" \| "name"` |
| **`typeof`**          | ভ্যালু থেকে টাইপ বের করা | `typeof config`                 |
| **Index Access**      | প্রপার্টির টাইপ বের করা  | `User["name"]` → `string`       |
| **Mapped Types**      | প্রতিটি key ট্রান্সফর্ম  | `{ [K in keyof T]: boolean }`   |
| **Conditional Types** | শর্তসাপেক্ষ টাইপ         | `T extends string ? X : Y`      |
| **Template Literal**  | স্ট্রিং প্যাটার্ন টাইপ   | `` `get${Capitalize<K>}` ``     |
| **`infer`**           | টাইপ ইনফারেন্স বের করা   | `T extends (infer E)[] ? E : T` |

::: warning এই বিষয়গুলো কঠিন!
Advanced type features বুঝতে সময় লাগবে — এটি স্বাভাবিক। প্রথমে `keyof`, `typeof`, এবং সাধারণ mapped type ভালোভাবে আয়ত্ত করুন, তারপর ধীরে ধীরে conditional type ও `infer`-এ যান। বাস্তব প্রজেক্টে ব্যবহার করতে করতে এগুলো পরিষ্কার হয়ে যাবে।
:::

::: tip পরবর্তী ধাপ
Advanced Type Features ভালোভাবে বুঝে থাকলে এবার **Decorators ও Metadata** সেকশনে যান, যেখানে শিখবেন কীভাবে ক্লাস ও মেথডে মেটাডেটা যোগ করে কোড আরও ডিক্লেয়ারেটিভ করা যায়।
:::
