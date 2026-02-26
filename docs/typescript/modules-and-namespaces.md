# Modules and Namespaces (মডিউল ও নেমস্পেস)

বড় প্রজেক্টে সব কোড একটি ফাইলে রাখা অসম্ভব। TypeScript-এ **মডিউল** ব্যবহার করে কোড আলাদা ফাইলে ভাগ করা যায় এবং **import/export** দিয়ে প্রয়োজনমতো ব্যবহার করা যায়। এতে কোড আরও **সংগঠিত**, **পুনঃব্যবহারযোগ্য** এবং **মেইনটেনেবল** হয়।

---

## 1. ES6 Modules — Import/Export

TypeScript ES6 মডিউল সিস্টেম সম্পূর্ণভাবে সাপোর্ট করে। যেকোনো ফাইলে `import` বা `export` থাকলেই সেটি একটি **মডিউল** হিসেবে গণ্য হয়।

### 1.1 Named Export (নামযুক্ত এক্সপোর্ট)

একটি ফাইল থেকে **একাধিক জিনিস** আলাদা আলাদা নামে এক্সপোর্ট করা:

```typescript
// 📁 utils/math.ts

// প্রতিটি জিনিসের আগে export লিখে এক্সপোর্ট
export const PI: number = 3.14159;

export function add(a: number, b: number): number {
  return a + b;
}

export function multiply(a: number, b: number): number {
  return a * b;
}

export interface MathResult {
  value: number;
  operation: string;
}
```

**Import করা:**

```typescript
// 📁 app.ts

// নাম দিয়ে import — {} ব্যবহার করতে হবে
import { PI, add, multiply, MathResult } from "./utils/math";

console.log(PI); // 3.14159
console.log(add(3, 5)); // 8
console.log(multiply(4, 6)); // 24

let result: MathResult = { value: 8, operation: "addition" };
```

### 1.2 একসাথে Export (Bottom Export)

ফাইলের শেষে একসাথে সব কিছু এক্সপোর্ট করা:

```typescript
// 📁 utils/string-helpers.ts

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength) + "...";
}

function slugify(str: string): string {
  return str.toLowerCase().replace(/\s+/g, "-");
}

// শেষে একসাথে export
export { capitalize, truncate, slugify };
```

```typescript
// 📁 app.ts
import { capitalize, truncate, slugify } from "./utils/string-helpers";

console.log(capitalize("hello")); // "Hello"
console.log(truncate("লম্বা টেক্সট", 5)); // "লম্বা..."
console.log(slugify("Hello World")); // "hello-world"
```

### 1.3 Import Alias (`as`)

```typescript
// নাম পরিবর্তন করে import
import { add as sum, multiply as mul } from "./utils/math";

console.log(sum(3, 5)); // 8
console.log(mul(4, 6)); // 24

// Export-এও alias দেওয়া যায়
// 📁 utils/math.ts
// export { add as sum, multiply as mul };
```

### 1.4 সবকিছু একসাথে Import (`* as`)

```typescript
// পুরো মডিউল একটি অবজেক্ট হিসেবে import
import * as MathUtils from "./utils/math";

console.log(MathUtils.PI); // 3.14159
console.log(MathUtils.add(3, 5)); // 8
console.log(MathUtils.multiply(4, 6)); // 24
```

---

## 2. Default এবং Named Exports

### 2.1 Default Export (ডিফল্ট এক্সপোর্ট)

প্রতিটি ফাইল থেকে **একটি মাত্র** default export করা যায়। এটি সাধারণত ফাইলের **প্রধান জিনিস** হয়:

```typescript
// 📁 models/User.ts

// ক্লাস default export
export default class User {
  constructor(
    public id: number,
    public name: string,
    public email: string,
  ) {}

  greet(): string {
    return `হ্যালো, আমি ${this.name}`;
  }
}
```

```typescript
// 📁 app.ts

// default import — {} লাগে না, যেকোনো নাম দেওয়া যায়
import User from "./models/User";

const user = new User(1, "রিপন", "ripon@test.com");
console.log(user.greet()); // "হ্যালো, আমি রিপন"
```

### 2.2 Default + Named Export একসাথে

```typescript
// 📁 services/api.ts

// নির্দিষ্ট কনফিগারেশন named export
export const API_BASE_URL = "https://api.example.com";
export const API_VERSION = "v2";

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
}

// প্রধান ক্লাস default export
export default class ApiService {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    console.log(`GET ${this.baseUrl}/${endpoint}`);
    // fetch লজিক...
    return { success: true, data: {} as T, message: "OK" };
  }

  async post<T>(endpoint: string, data: unknown): Promise<ApiResponse<T>> {
    console.log(`POST ${this.baseUrl}/${endpoint}`);
    return { success: true, data: {} as T, message: "Created" };
  }
}
```

```typescript
// 📁 app.ts

// default ও named একসাথে import
import ApiService, {
  API_BASE_URL,
  API_VERSION,
  ApiResponse,
} from "./services/api";

console.log(`API: ${API_BASE_URL} (${API_VERSION})`);

const api = new ApiService();
// api.get<User[]>("users");
```

### 2.3 Default vs Named — কোনটি কখন?

::: tip Default vs Named Export
| বৈশিষ্ট্য | Default Export | Named Export |
|---|---|---|
| প্রতি ফাইলে কতটি? | **১টি** মাত্র | **একাধিক** |
| Import-এ `{}` লাগে? | ❌ না | ✅ হ্যাঁ |
| নাম পরিবর্তন | import-এ যেকোনো নাম দেওয়া যায় | `as` ব্যবহার করতে হয় |
| কখন ব্যবহার? | ফাইলের **প্রধান** জিনিস (যেমন: ক্লাস, কম্পোনেন্ট) | **হেল্পার**, **কনস্ট্যান্ট**, **টাইপ** |
| Auto-import | IDE-তে কম সুবিধাজনক | IDE-তে **বেশি সুবিধাজনক** |

**সেরা চর্চা:**

- বেশিরভাগ প্রজেক্টে **Named Export** ব্যবহার করুন — refactoring সহজ
- **React Component** ফাইলে Default Export (convention)
- একটি ফাইলে একটি মাত্র ক্লাস থাকলে Default Export চলবে
  :::

---

## 3. Module Resolution (মডিউল রেজোলিউশন)

TypeScript কীভাবে import path থেকে সঠিক ফাইল খুঁজে পায় তাকে **Module Resolution** বলে।

### 3.1 Relative Imports (আপেক্ষিক পাথ)

`./` বা `../` দিয়ে শুরু হওয়া import — নিজের প্রজেক্টের ফাইলের জন্য:

```typescript
// 📁 প্রজেক্ট স্ট্রাকচার:
// src/
// ├── models/
// │   ├── User.ts
// │   └── Product.ts
// ├── services/
// │   └── UserService.ts
// ├── utils/
// │   └── helpers.ts
// └── app.ts

// 📁 src/services/UserService.ts
import { User } from "../models/User"; // একধাপ উপরে → models ফোল্ডারে
import { helpers } from "../utils/helpers"; // একধাপ উপরে → utils ফোল্ডারে

// 📁 src/app.ts
import { User } from "./models/User"; // একই ডিরেক্টরিতে → models ফোল্ডারে
import { UserService } from "./services/UserService";
```

### 3.2 Non-relative Imports (থার্ড-পার্টি লাইব্রেরি)

`./` বা `../` ছাড়া import — `node_modules` থেকে:

```typescript
// থার্ড-পার্টি প্যাকেজ — node_modules থেকে
import express from "express";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
```

### 3.3 `tsconfig.json`-এ Path Mapping

দীর্ঘ relative path এড়াতে **alias** সেট করা যায়:

```json
// 📁 tsconfig.json
{
  "compilerOptions": {
    "baseUrl": "./src",
    "paths": {
      "@models/*": ["models/*"],
      "@services/*": ["services/*"],
      "@utils/*": ["utils/*"],
      "@config": ["config/index"]
    }
  }
}
```

```typescript
// ❌ আগে — দীর্ঘ relative path
import { User } from "../../../models/User";
import { helpers } from "../../utils/helpers";

// ✅ এখন — পরিষ্কার alias
import { User } from "@models/User";
import { helpers } from "@utils/helpers";
import { AppConfig } from "@config";
```

### 3.4 Index Files (Barrel Exports)

একটি ফোল্ডারের সব export একটি `index.ts` ফাইলে একত্রিত করা:

```typescript
// 📁 models/User.ts
export interface User {
  id: number;
  name: string;
  email: string;
}

// 📁 models/Product.ts
export interface Product {
  id: number;
  name: string;
  price: number;
}

// 📁 models/Order.ts
export interface Order {
  id: number;
  userId: number;
  products: Product[];
  total: number;
}

// 📁 models/index.ts — Barrel file (সব re-export)
export { User } from "./User";
export { Product } from "./Product";
export { Order } from "./Order";
```

```typescript
// 📁 app.ts — একটি মাত্র import statement!
import { User, Product, Order } from "./models";
// "./models" = "./models/index.ts" (index.ts স্বয়ংক্রিয়ভাবে খুঁজে নেয়)
```

::: tip Barrel Export-এর সুবিধা

- **Import সংক্ষিপ্ত** — একটি লাইনে অনেক কিছু import
- **Internal structure লুকানো** — বাইরের কোড জানে না কোন ফাইলে কী আছে
- **Refactoring সহজ** — ফাইল সরালে শুধু `index.ts` আপডেট করলেই হয়
  :::

---

## 4. Namespaces (নেমস্পেস)

Namespace হলো সম্পর্কিত কোড **একটি নামের আওতায়** গ্রুপ করার পুরোনো পদ্ধতি। ES6 মডিউল আসার পর namespace-এর ব্যবহার **অনেক কমে গেছে**, তবে কিছু ক্ষেত্রে এখনও দেখা যায়।

### 4.1 বেসিক Namespace

```typescript
// namespace — সম্পর্কিত কোড গ্রুপ করা
namespace Validation {
  // export না করলে বাইরে থেকে অ্যাক্সেস করা যাবে না
  export function isEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  export function isPhoneNumber(phone: string): boolean {
    return /^01[3-9]\d{8}$/.test(phone);
  }

  export function isRequired(value: string): boolean {
    return value.trim().length > 0;
  }

  // এটি private — বাইরে থেকে অ্যাক্সেস করা যাবে না
  function sanitize(input: string): string {
    return input.trim().toLowerCase();
  }
}

// ব্যবহার — Namespace.member
console.log(Validation.isEmail("ripon@test.com")); // true
console.log(Validation.isEmail("invalid")); // false
console.log(Validation.isPhoneNumber("01712345678")); // true

// ❌ private ফাংশন বাইরে থেকে অ্যাক্সেস করা যায় না
// Validation.sanitize("test"); // Error!
```

### 4.2 Nested Namespaces

```typescript
namespace App {
  export namespace Models {
    export interface User {
      id: number;
      name: string;
    }

    export interface Product {
      id: number;
      name: string;
      price: number;
    }
  }

  export namespace Services {
    export function getUser(id: number): Models.User {
      return { id, name: "রিপন" };
    }

    export function getProduct(id: number): Models.Product {
      return { id, name: "ল্যাপটপ", price: 150000 };
    }
  }
}

// ব্যবহার
let user: App.Models.User = App.Services.getUser(1);
console.log(user.name); // "রিপন"

let product: App.Models.Product = App.Services.getProduct(1);
console.log(product.price); // 150000
```

### 4.3 কখন Namespace ব্যবহার করবেন?

::: warning Namespace vs Module
| বৈশিষ্ট্য | Namespace | ES6 Module |
|---|---|---|
| যুগ | পুরোনো (TypeScript-এর নিজস্ব) | আধুনিক (JavaScript স্ট্যান্ডার্ড) |
| ফাইল সংগঠন | একই ফাইলে গ্রুপিং | **আলাদা ফাইলে** সংগঠন |
| Bundling | `--outFile` দিয়ে | Webpack/Vite দিয়ে |
| Tree Shaking | ❌ সাপোর্ট নেই | ✅ সাপোর্ট আছে |
| বর্তমান ব্যবহার | **কমছে** | **স্ট্যান্ডার্ড** ✅ |

**নিয়ম:**

- নতুন প্রজেক্টে সবসময় **ES6 Module** (`import`/`export`) ব্যবহার করুন ✅
- Namespace ব্যবহার করুন শুধু:
  - পুরোনো প্রজেক্ট মেইনটেইন করলে
  - গ্লোবাল স্ক্রিপ্টে (module system ছাড়া)
  - Declaration file (`.d.ts`) লিখলে
    :::

---

## 5. Declaration Merging (ডিক্লেয়ারেশন মার্জিং)

TypeScript-এ একই নামে **একাধিক ডিক্লেয়ারেশন** লিখলে সেগুলো **স্বয়ংক্রিয়ভাবে একত্রিত** হয়ে যায়। এটি একটি শক্তিশালী ফিচার যা মূলত **লাইব্রেরি এক্সটেনশনে** ব্যবহৃত হয়।

### 5.1 Interface Merging

একই নামে দুটি interface লিখলে তারা **মার্জ** হয়ে একটি হয়ে যায়:

```typescript
// প্রথম ডিক্লেয়ারেশন
interface Config {
  appName: string;
  version: string;
}

// দ্বিতীয় ডিক্লেয়ারেশন — একই নামে
interface Config {
  port: number;
  debug: boolean;
}

// মার্জ হয়ে গেছে — সবগুলো প্রপার্টি দিতে হবে
let config: Config = {
  appName: "MyApp", // প্রথম থেকে
  version: "1.0.0", // প্রথম থেকে
  port: 3000, // দ্বিতীয় থেকে
  debug: false, // দ্বিতীয় থেকে
};
```

### 5.2 তৃতীয়-পক্ষের লাইব্রেরি এক্সটেন্ড করা

Declaration merging-এর সবচেয়ে গুরুত্বপূর্ণ ব্যবহার — **থার্ড-পার্টি লাইব্রেরিতে নতুন প্রপার্টি যোগ** করা:

```typescript
// 📁 types/express.d.ts

// Express.js Request অবজেক্টে কাস্টম প্রপার্টি যোগ
declare namespace Express {
  interface Request {
    user?: {
      id: number;
      name: string;
      role: "admin" | "user";
    };
    requestId?: string;
  }
}

// এখন যেকোনো Express route-এ req.user ব্যবহার করা যাবে
// app.get("/profile", (req, res) => {
//   console.log(req.user?.name); // ✅ TypeScript এরর দেবে না
//   console.log(req.requestId);  // ✅
// });
```

### 5.3 Namespace + Interface Merging

```typescript
// interface হিসেবে ব্যবহার
interface Color {
  name: string;
  hex: string;
}

// namespace দিয়ে static helper যোগ
namespace Color {
  export function fromHex(hex: string): Color {
    return { name: "কাস্টম", hex };
  }

  export function fromRGB(r: number, g: number, b: number): Color {
    const hex = `#${r.toString(16)}${g.toString(16)}${b.toString(16)}`;
    return { name: "কাস্টম", hex };
  }

  export const RED: Color = { name: "লাল", hex: "#FF0000" };
  export const GREEN: Color = { name: "সবুজ", hex: "#00FF00" };
  export const BLUE: Color = { name: "নীল", hex: "#0000FF" };
}

// interface হিসেবে ব্যবহার
let myColor: Color = { name: "কমলা", hex: "#FFA500" };

// namespace-এর static member ব্যবহার
let red = Color.RED;
let custom = Color.fromHex("#FF6347");
let rgb = Color.fromRGB(255, 165, 0);

console.log(red.name); // "লাল"
console.log(custom.hex); // "#FF6347"
```

### 5.4 Enum + Namespace Merging

```typescript
enum Direction {
  Up = "UP",
  Down = "DOWN",
  Left = "LEFT",
  Right = "RIGHT",
}

// enum-এ helper method যোগ
namespace Direction {
  export function isHorizontal(dir: Direction): boolean {
    return dir === Direction.Left || dir === Direction.Right;
  }

  export function isVertical(dir: Direction): boolean {
    return dir === Direction.Up || dir === Direction.Down;
  }

  export function opposite(dir: Direction): Direction {
    switch (dir) {
      case Direction.Up:
        return Direction.Down;
      case Direction.Down:
        return Direction.Up;
      case Direction.Left:
        return Direction.Right;
      case Direction.Right:
        return Direction.Left;
    }
  }
}

console.log(Direction.isHorizontal(Direction.Left)); // true
console.log(Direction.isVertical(Direction.Up)); // true
console.log(Direction.opposite(Direction.Up)); // "DOWN"
```

::: info কোন কোন ডিক্লেয়ারেশন মার্জ হয়?
| ডিক্লেয়ারেশন | Interface-এর সাথে | Namespace-এর সাথে | Class-এর সাথে |
|---|---|---|---|
| **Interface** | ✅ মার্জ হয় | ✅ মার্জ হয় | ❌ |
| **Namespace** | ✅ মার্জ হয় | ✅ মার্জ হয় | ✅ মার্জ হয় |
| **Class** | ❌ | ✅ মার্জ হয় | ❌ মার্জ হয় না |
| **Enum** | ❌ | ✅ মার্জ হয় | ❌ |
| **Type Alias** | ❌ | ❌ | ❌ |

**নিয়ম:** `type` alias কখনো মার্জ হয় না — দ্বিতীয়বার লিখলে এরর দেবে।
:::

---

## সারসংক্ষেপ (Summary)

এই সেকশনে আমরা শিখলাম:

| বিষয়                   | বিবরণ                      | উদাহরণ                             |
| ----------------------- | -------------------------- | ---------------------------------- |
| **Named Export**        | নাম দিয়ে একাধিক export    | `export function add() {}`         |
| **Default Export**      | ফাইলের প্রধান export       | `export default class User {}`     |
| **Import**              | অন্য ফাইল থেকে আনা         | `import { add } from "./math"`     |
| **Wildcard Import**     | সব একসাথে import           | `import * as Utils from "./utils"` |
| **Path Mapping**        | alias দিয়ে সংক্ষিপ্ত path | `@models/User`                     |
| **Barrel Export**       | index.ts দিয়ে re-export   | `export { User } from "./User"`    |
| **Namespace**           | কোড গ্রুপিং (পুরোনো)       | `namespace Validation {}`          |
| **Declaration Merging** | ডিক্লেয়ারেশন একত্রীকরণ    | একই নামে interface + interface     |

::: tip পরবর্তী ধাপ
Modules ও Namespaces ভালোভাবে বুঝে থাকলে এবার **Decorators ও Advanced Patterns** সেকশনে যান, যেখানে শিখবেন TypeScript-এর আরও উন্নত ফিচার ও ডিজাইন প্যাটার্ন।
:::
