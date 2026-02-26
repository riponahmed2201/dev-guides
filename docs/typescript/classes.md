# Classes (ক্লাস)

TypeScript-এ ক্লাস হলো **অবজেক্ট-ওরিয়েন্টেড প্রোগ্রামিং (OOP)**-এর মূল ভিত্তি। JavaScript-এর ES6 ক্লাসের উপর TypeScript **টাইপ সিস্টেম**, **অ্যাক্সেস মডিফায়ার**, এবং **অ্যাবস্ট্রাক্ট ক্লাস**-এর মতো শক্তিশালী ফিচার যোগ করে। এতে কোড আরও **সংগঠিত**, **নিরাপদ** এবং **মেইনটেনেবল** হয়।

---

## 1. Class Syntax এবং Constructors (ক্লাস সিনট্যাক্স ও কনস্ট্রাক্টর)

### 1.1 বেসিক ক্লাস

```typescript
class Person {
  // প্রপার্টি ডিক্লেয়ারেশন — টাইপসহ
  name: string;
  age: number;

  // কনস্ট্রাক্টর — অবজেক্ট তৈরির সময় কল হয়
  constructor(name: string, age: number) {
    this.name = name;
    this.age = age;
  }

  // মেথড
  greet(): string {
    return `হ্যালো, আমি ${this.name}। আমার বয়স ${this.age}।`;
  }
}

// অবজেক্ট (ইনস্ট্যান্স) তৈরি
const person1 = new Person("রিপন", 25);
const person2 = new Person("করিম", 30);

console.log(person1.greet()); // "হ্যালো, আমি রিপন। আমার বয়স 25।"
console.log(person2.name); // "করিম"

// ❌ ভুল — কনস্ট্রাক্টরে ভুল টাইপ
// const person3 = new Person("রহিম", "ত্রিশ"); // Error: string দেওয়া যাবে না
```

### 1.2 কনস্ট্রাক্টর শর্টহ্যান্ড (Parameter Properties)

কনস্ট্রাক্টর প্যারামিটারে অ্যাক্সেস মডিফায়ার লিখলে **প্রপার্টি ডিক্লেয়ারেশন** এবং **অ্যাসাইনমেন্ট** স্বয়ংক্রিয়ভাবে হয়ে যায়:

```typescript
// ❌ দীর্ঘ পদ্ধতি
class UserLong {
  name: string;
  email: string;
  age: number;

  constructor(name: string, email: string, age: number) {
    this.name = name;
    this.email = email;
    this.age = age;
  }
}

// ✅ শর্টহ্যান্ড — একই কাজ, অনেক কম কোড!
class UserShort {
  constructor(
    public name: string,
    public email: string,
    public age: number,
  ) {}
  // this.name = name, this.email = email, this.age = age — সব স্বয়ংক্রিয়!
}

const user = new UserShort("রিপন", "ripon@test.com", 25);
console.log(user.name); // "রিপন"
console.log(user.email); // "ripon@test.com"
```

### 1.3 ডিফল্ট ভ্যালু ও অপশনাল প্রপার্টি

```typescript
class AppConfig {
  constructor(
    public appName: string,
    public port: number = 3000, // ডিফল্ট মান
    public debug: boolean = false, // ডিফল্ট মান
    public version?: string, // ঐচ্ছিক
  ) {}

  getInfo(): string {
    return `${this.appName} v${this.version ?? "1.0.0"} — পোর্ট ${this.port}`;
  }
}

const app1 = new AppConfig("MyApp");
console.log(app1.getInfo()); // "MyApp v1.0.0 — পোর্ট 3000"

const app2 = new AppConfig("ShopAPI", 8080, true, "2.1.0");
console.log(app2.getInfo()); // "ShopAPI v2.1.0 — পোর্ট 8080"
```

---

## 2. Access Modifiers (অ্যাক্সেস মডিফায়ার)

অ্যাক্সেস মডিফায়ার দিয়ে ক্লাসের প্রপার্টি ও মেথড **কোথায় থেকে অ্যাক্সেস করা যাবে** তা নিয়ন্ত্রণ করা হয়। TypeScript-এ তিনটি মডিফায়ার আছে: `public`, `private`, `protected`।

### 2.1 `public` (পাবলিক — সবার জন্য উন্মুক্ত)

ডিফল্টভাবে সব প্রপার্টি ও মেথড `public`। যেকোনো জায়গা থেকে অ্যাক্সেস করা যায়:

```typescript
class Animal {
  public name: string; // public — স্পষ্টভাবে লেখা
  species: string; // public — ডিফল্ট (না লিখলেও public)

  constructor(name: string, species: string) {
    this.name = name;
    this.species = species;
  }

  public makeSound(): string {
    return `${this.name} শব্দ করছে!`;
  }
}

const cat = new Animal("মিটু", "বিড়াল");
console.log(cat.name); // ✅ "মিটু" — বাইরে থেকে অ্যাক্সেস
console.log(cat.makeSound()); // ✅ "মিটু শব্দ করছে!"
```

### 2.2 `private` (প্রাইভেট — শুধু ক্লাসের ভেতরে)

`private` প্রপার্টি/মেথড **শুধু ক্লাসের ভেতরেই** অ্যাক্সেস করা যায়। বাইরে বা সাবক্লাসে অ্যাক্সেস করা যায় না:

```typescript
class BankAccount {
  public accountHolder: string;
  private balance: number; // 🔒 প্রাইভেট — বাইরে থেকে দেখা যাবে না
  private pin: string; // 🔒 প্রাইভেট

  constructor(holder: string, initialBalance: number, pin: string) {
    this.accountHolder = holder;
    this.balance = initialBalance;
    this.pin = pin;
  }

  // পাবলিক মেথড — বাইরে থেকে ব্যালেন্স দেখা যায়
  getBalance(): number {
    return this.balance;
  }

  // পাবলিক মেথড — টাকা জমা
  deposit(amount: number): void {
    if (amount <= 0) {
      console.log("❌ অবৈধ পরিমাণ!");
      return;
    }
    this.balance += amount;
    console.log(
      `✅ ৳${amount} জমা হয়েছে। বর্তমান ব্যালেন্স: ৳${this.balance}`,
    );
  }

  // পাবলিক মেথড — টাকা উত্তোলন
  withdraw(amount: number, enteredPin: string): void {
    if (!this.verifyPin(enteredPin)) {
      // প্রাইভেট মেথড কল
      console.log("❌ ভুল PIN!");
      return;
    }
    if (amount > this.balance) {
      console.log("❌ পর্যাপ্ত ব্যালেন্স নেই!");
      return;
    }
    this.balance -= amount;
    console.log(
      `✅ ৳${amount} উত্তোলন হয়েছে। বর্তমান ব্যালেন্স: ৳${this.balance}`,
    );
  }

  // 🔒 প্রাইভেট মেথড — শুধু ক্লাসের ভেতরে ব্যবহার
  private verifyPin(pin: string): boolean {
    return this.pin === pin;
  }
}

const account = new BankAccount("রিপন", 10000, "1234");

console.log(account.accountHolder); // ✅ "রিপন"
console.log(account.getBalance()); // ✅ 10000

account.deposit(5000); // ✅ "৳5000 জমা হয়েছে..."
account.withdraw(3000, "1234"); // ✅ "৳3000 উত্তোলন হয়েছে..."
account.withdraw(3000, "0000"); // ❌ "ভুল PIN!"

// ❌ প্রাইভেট — বাইরে থেকে অ্যাক্সেস করা যাবে না
// console.log(account.balance);     // Error: Property 'balance' is private
// console.log(account.pin);         // Error: Property 'pin' is private
// account.verifyPin("1234");        // Error: Method 'verifyPin' is private
```

### 2.3 `protected` (প্রটেক্টেড — ক্লাস ও সাবক্লাসে)

`protected` প্রপার্টি/মেথড **ক্লাস এবং এর সাবক্লাসে** অ্যাক্সেস করা যায়, কিন্তু **বাইরে থেকে না**:

```typescript
class Employee {
  public name: string;
  protected salary: number; // 🛡️ প্রটেক্টেড — সাবক্লাসে অ্যাক্সেস করা যাবে
  private ssn: string; // 🔒 প্রাইভেট — শুধু এই ক্লাসে

  constructor(name: string, salary: number, ssn: string) {
    this.name = name;
    this.salary = salary;
    this.ssn = ssn;
  }

  protected calculateBonus(): number {
    return this.salary * 0.1; // ১০% বোনাস
  }
}

class Manager extends Employee {
  private department: string;

  constructor(name: string, salary: number, ssn: string, department: string) {
    super(name, salary, ssn);
    this.department = department;
  }

  getDetails(): string {
    // ✅ protected salary অ্যাক্সেস করা যায় — সাবক্লাসে
    const bonus = this.calculateBonus(); // ✅ protected মেথড কল
    return `${this.name} — ${this.department} বিভাগ (বোনাস: ৳${bonus})`;

    // ❌ private ssn অ্যাক্সেস করা যায় না — এমনকি সাবক্লাসেও
    // console.log(this.ssn); // Error: Property 'ssn' is private
  }
}

const manager = new Manager("রহিম", 80000, "SSN-123", "IT");
console.log(manager.getDetails()); // "রহিম — IT বিভাগ (বোনাস: ৳8000)"
console.log(manager.name); // ✅ public

// ❌ বাইরে থেকে protected/private অ্যাক্সেস করা যায় না
// console.log(manager.salary);    // Error: protected
// console.log(manager.ssn);       // Error: private
```

::: tip Access Modifier সারসংক্ষেপ
| মডিফায়ার | ক্লাসের ভেতরে | সাবক্লাসে | বাইরে থেকে |
|---|---|---|---|
| `public` | ✅ হ্যাঁ | ✅ হ্যাঁ | ✅ হ্যাঁ |
| `protected` | ✅ হ্যাঁ | ✅ হ্যাঁ | ❌ না |
| `private` | ✅ হ্যাঁ | ❌ না | ❌ না |
:::

---

## 3. Readonly Properties (শুধু-পঠনযোগ্য প্রপার্টি)

`readonly` প্রপার্টি **শুধু কনস্ট্রাক্টরে** মান দেওয়া যায়, পরে আর পরিবর্তন করা যায় না:

```typescript
class User {
  readonly id: number; // 🔒 readme — পরিবর্তন অযোগ্য
  readonly createdAt: Date; // 🔒 readonly
  name: string; // পরিবর্তনযোগ্য

  constructor(id: number, name: string) {
    this.id = id; // ✅ কনস্ট্রাক্টরে মান দেওয়া যায়
    this.createdAt = new Date(); // ✅ কনস্ট্রাক্টরে মান দেওয়া যায়
    this.name = name;
  }

  updateName(newName: string): void {
    this.name = newName; // ✅ name পরিবর্তন করা যায়
    // this.id = 999;               // ❌ Error: Cannot assign to 'id' — readonly
    // this.createdAt = new Date(); // ❌ Error: Cannot assign to 'createdAt'
  }
}

const user = new User(1, "রিপন");
console.log(user.id); // 1
console.log(user.createdAt); // 2025-xx-xx...

user.updateName("রিপন আহমেদ"); // ✅ name পরিবর্তন হলো
// user.id = 2;                  // ❌ Error: readonly!
```

**শর্টহ্যান্ডে readonly:**

```typescript
class DatabaseConfig {
  constructor(
    public readonly host: string,
    public readonly port: number,
    public readonly database: string,
    private readonly password: string,
  ) {}

  getConnectionString(): string {
    return `postgresql://${this.host}:${this.port}/${this.database}`;
  }
}

const db = new DatabaseConfig("localhost", 5432, "myapp", "secret");
console.log(db.host); // ✅ "localhost"
console.log(db.getConnectionString()); // ✅ "postgresql://localhost:5432/myapp"
// db.host = "newhost";                // ❌ Error: readonly
// db.password;                        // ❌ Error: private
```

---

## 4. Getters এবং Setters (গেটার ও সেটার)

Getter এবং Setter দিয়ে প্রপার্টি **পড়া ও লেখার সময় কাস্টম লজিক** যোগ করা যায়। এটি **ডেটা ভ্যালিডেশন** এবং **এনক্যাপসুলেশনের** জন্য খুবই কার্যকর।

### 4.1 বেসিক Getter ও Setter

```typescript
class Temperature {
  private _celsius: number; // _ দিয়ে প্রাইভেট নাম রাখা convention

  constructor(celsius: number) {
    this._celsius = celsius;
  }

  // Getter — প্রপার্টির মতো অ্যাক্সেস করা যায়
  get celsius(): number {
    return this._celsius;
  }

  // Setter — মান সেট করার সময় ভ্যালিডেশন
  set celsius(value: number) {
    if (value < -273.15) {
      throw new Error("❌ তাপমাত্রা -273.15°C এর নিচে হতে পারে না!");
    }
    this._celsius = value;
  }

  // Fahrenheit — computed property (শুধু getter)
  get fahrenheit(): number {
    return (this._celsius * 9) / 5 + 32;
  }

  // Kelvin
  get kelvin(): number {
    return this._celsius + 273.15;
  }
}

const temp = new Temperature(25);
console.log(temp.celsius); // 25 — getter কল হচ্ছে
console.log(temp.fahrenheit); // 77
console.log(temp.kelvin); // 298.15

temp.celsius = 100; // ✅ setter কল — ভ্যালিডেশন পাস
console.log(temp.fahrenheit); // 212

// temp.celsius = -300;        // ❌ Error: তাপমাত্রা -273.15°C এর নিচে হতে পারে না!
```

### 4.2 ব্যবহারিক উদাহরণ — ইউজার ক্লাস

```typescript
class UserAccount {
  private _name: string;
  private _email: string;
  private _age: number;

  constructor(name: string, email: string, age: number) {
    this._name = name;
    this._email = email;
    this._age = age;
  }

  // Name — প্রথম অক্ষর বড় করে রিটার্ন
  get name(): string {
    return this._name;
  }

  set name(value: string) {
    if (value.trim().length === 0) {
      throw new Error("❌ নাম খালি হতে পারে না!");
    }
    this._name = value.trim();
  }

  // Email — ভ্যালিডেশনসহ
  get email(): string {
    return this._email;
  }

  set email(value: string) {
    if (!value.includes("@")) {
      throw new Error("❌ সঠিক ইমেইল দিন!");
    }
    this._email = value.toLowerCase();
  }

  // Age — রেঞ্জ চেক
  get age(): number {
    return this._age;
  }

  set age(value: number) {
    if (value < 0 || value > 150) {
      throw new Error("❌ বয়স 0-150 এর মধ্যে হতে হবে!");
    }
    this._age = value;
  }

  // Computed property — শুধু getter (read-only)
  get isAdult(): boolean {
    return this._age >= 18;
  }
}

const user = new UserAccount("রিপন", "ripon@test.com", 25);
console.log(user.name); // "রিপন"
console.log(user.isAdult); // true

user.name = "করিম"; // ✅ setter কল
user.email = "KARIM@Test.COM"; // ✅ "karim@test.com" — toLowerCase হয়ে সেট

// user.email = "invalid";    // ❌ Error: সঠিক ইমেইল দিন!
// user.age = -5;             // ❌ Error: বয়স 0-150 এর মধ্যে হতে হবে!
// user.isAdult = false;      // ❌ Error: read-only property (setter নেই)
```

---

## 5. Static Members (স্ট্যাটিক মেম্বার)

`static` প্রপার্টি ও মেথড **ক্লাসের সাথে** সম্পর্কিত, **ইনস্ট্যান্সের সাথে না**। অবজেক্ট তৈরি না করেই সরাসরি ক্লাসের নাম দিয়ে অ্যাক্সেস করা যায়।

### 5.1 Static Properties ও Methods

```typescript
class MathHelper {
  // Static property — সব ইনস্ট্যান্সে শেয়ার্ড
  static readonly PI: number = 3.14159265359;
  static readonly E: number = 2.71828182846;

  // Static method — ক্লাসের নাম দিয়ে কল করা হয়
  static circleArea(radius: number): number {
    return MathHelper.PI * radius ** 2;
  }

  static rectangleArea(width: number, height: number): number {
    return width * height;
  }

  static max(...numbers: number[]): number {
    return numbers.reduce((max, n) => (n > max ? n : max), numbers[0]);
  }
}

// ✅ ক্লাসের নাম দিয়ে সরাসরি অ্যাক্সেস — new দরকার নেই
console.log(MathHelper.PI); // 3.14159265359
console.log(MathHelper.circleArea(5)); // 78.54
console.log(MathHelper.rectangleArea(10, 5)); // 50
console.log(MathHelper.max(3, 7, 2, 9, 4)); // 9

// ❌ ইনস্ট্যান্স দিয়ে static অ্যাক্সেস করা যায় না
// const math = new MathHelper();
// math.PI; // Error!
```

### 5.2 Static Counter — ইনস্ট্যান্স গণনা

```typescript
class User {
  static totalUsers: number = 0; // কতগুলো User তৈরি হয়েছে

  readonly id: number;
  name: string;

  constructor(name: string) {
    User.totalUsers++; // প্রতিটি নতুন ইনস্ট্যান্সে কাউন্ট বাড়ে
    this.id = User.totalUsers;
    this.name = name;
  }

  static getUserCount(): number {
    return User.totalUsers;
  }
}

const user1 = new User("রিপন");
const user2 = new User("করিম");
const user3 = new User("রহিম");

console.log(User.totalUsers); // 3
console.log(User.getUserCount()); // 3

console.log(user1.id); // 1
console.log(user2.id); // 2
console.log(user3.id); // 3
```

### 5.3 Singleton Pattern — Static দিয়ে

```typescript
class Database {
  private static instance: Database;
  private connectionString: string;

  // কনস্ট্রাক্টর private — বাইরে থেকে new করা যাবে না
  private constructor(connectionString: string) {
    this.connectionString = connectionString;
    console.log("📦 ডেটাবেস সংযোগ তৈরি হলো");
  }

  // Static method — একমাত্র ইনস্ট্যান্স পাওয়ার উপায়
  static getInstance(connStr: string = "localhost:5432"): Database {
    if (!Database.instance) {
      Database.instance = new Database(connStr);
    }
    return Database.instance;
  }

  query(sql: string): void {
    console.log(`🔍 Query: ${sql}`);
  }
}

const db1 = Database.getInstance("localhost:5432");
const db2 = Database.getInstance(); // আগের instance-ই রিটার্ন করবে

console.log(db1 === db2); // true — একই instance!
db1.query("SELECT * FROM users");
```

---

## 6. Abstract Classes (অ্যাবস্ট্রাক্ট ক্লাস)

Abstract class হলো এমন একটি ক্লাস যেটি থেকে **সরাসরি অবজেক্ট তৈরি করা যায় না** — শুধু **সাবক্লাসের ভিত্তি (blueprint)** হিসেবে কাজ করে। এতে **abstract মেথড** থাকতে পারে যেগুলো সাবক্লাসে বাধ্যতামূলকভাবে ইমপ্লিমেন্ট করতে হয়।

### 6.1 বেসিক Abstract Class

```typescript
// abstract — সরাসরি new করা যাবে না
abstract class Shape {
  // সাধারণ প্রপার্টি ও মেথড থাকতে পারে
  constructor(public color: string) {}

  // abstract মেথড — শুধু সিগনেচার, বডি নেই
  // সাবক্লাসে অবশ্যই ইমপ্লিমেন্ট করতে হবে!
  abstract calculateArea(): number;
  abstract calculatePerimeter(): number;

  // সাধারণ মেথড — সাবক্লাসে inherited হয়
  describe(): string {
    return `এটি একটি ${this.color} রঙের আকৃতি`;
  }
}

// ❌ abstract ক্লাস থেকে সরাসরি অবজেক্ট তৈরি করা যায় না
// const shape = new Shape("লাল"); // Error: Cannot create an instance of an abstract class

// ✅ সাবক্লাসে abstract মেথড ইমপ্লিমেন্ট করতে হবে
class Circle extends Shape {
  constructor(
    color: string,
    public radius: number,
  ) {
    super(color);
  }

  // abstract মেথড ইমপ্লিমেন্ট — বাধ্যতামূলক
  calculateArea(): number {
    return Math.PI * this.radius ** 2;
  }

  calculatePerimeter(): number {
    return 2 * Math.PI * this.radius;
  }
}

class Rectangle extends Shape {
  constructor(
    color: string,
    public width: number,
    public height: number,
  ) {
    super(color);
  }

  calculateArea(): number {
    return this.width * this.height;
  }

  calculatePerimeter(): number {
    return 2 * (this.width + this.height);
  }
}

const circle = new Circle("নীল", 5);
console.log(circle.describe()); // "এটি একটি নীল রঙের আকৃতি"
console.log(circle.calculateArea()); // 78.54
console.log(circle.calculatePerimeter()); // 31.42

const rect = new Rectangle("সবুজ", 10, 5);
console.log(rect.calculateArea()); // 50
console.log(rect.calculatePerimeter()); // 30
```

### 6.2 পলিমরফিজম — Abstract Class দিয়ে

```typescript
// বিভিন্ন Shape একটি অ্যারেতে
const shapes: Shape[] = [
  new Circle("লাল", 3),
  new Rectangle("নীল", 4, 6),
  new Circle("সবুজ", 7),
];

// একই মেথড কল — ভিন্ন ভিন্ন ফলাফল (পলিমরফিজম)
shapes.forEach((shape) => {
  console.log(
    `${shape.describe()} — ক্ষেত্রফল: ${shape.calculateArea().toFixed(2)}`,
  );
});
// "এটি একটি লাল রঙের আকৃতি — ক্ষেত্রফল: 28.27"
// "এটি একটি নীল রঙের আকৃতি — ক্ষেত্রফল: 24.00"
// "এটি একটি সবুজ রঙের আকৃতি — ক্ষেত্রফল: 153.94"

// মোট ক্ষেত্রফল বের করা
const totalArea = shapes.reduce((sum, s) => sum + s.calculateArea(), 0);
console.log(`মোট ক্ষেত্রফল: ${totalArea.toFixed(2)}`); // 206.21
```

### 6.3 ব্যবহারিক উদাহরণ — Notification System

```typescript
abstract class Notification {
  constructor(
    protected recipient: string,
    protected message: string,
  ) {}

  // abstract — প্রতিটি নোটিফিকেশন টাইপ আলাদাভাবে পাঠাবে
  abstract send(): void;

  // কমন মেথড
  protected formatMessage(): string {
    return `[${new Date().toLocaleTimeString()}] ${this.message}`;
  }
}

class EmailNotification extends Notification {
  constructor(
    recipient: string,
    message: string,
    private subject: string,
  ) {
    super(recipient, message);
  }

  send(): void {
    console.log(`📧 ইমেইল পাঠানো হচ্ছে ${this.recipient}-কে`);
    console.log(`   বিষয়: ${this.subject}`);
    console.log(`   মেসেজ: ${this.formatMessage()}`);
  }
}

class SMSNotification extends Notification {
  send(): void {
    console.log(`📱 SMS পাঠানো হচ্ছে ${this.recipient}-এ`);
    console.log(`   মেসেজ: ${this.formatMessage()}`);
  }
}

class PushNotification extends Notification {
  constructor(
    recipient: string,
    message: string,
    private icon: string,
  ) {
    super(recipient, message);
  }

  send(): void {
    console.log(`🔔 Push notification: ${this.icon}`);
    console.log(`   To: ${this.recipient}`);
    console.log(`   মেসেজ: ${this.formatMessage()}`);
  }
}

// পলিমরফিজম — সব নোটিফিকেশন একই ভাবে পাঠানো
const notifications: Notification[] = [
  new EmailNotification("ripon@test.com", "নতুন অর্ডার এসেছে", "অর্ডার #123"),
  new SMSNotification("01712345678", "OTP: 567890"),
  new PushNotification("user_123", "মেসেজ এসেছে", "💬"),
];

notifications.forEach((n) => n.send());
```

---

## 7. Implementing Interfaces (ইন্টারফেস ইমপ্লিমেন্ট করা)

`implements` কিওয়ার্ড দিয়ে একটি ক্লাস একটি বা একাধিক Interface **অনুসরণ** করতে পারে। ক্লাসকে Interface-এ ডিফাইন করা **সব প্রপার্টি ও মেথড** বাধ্যতামূলকভাবে ইমপ্লিমেন্ট করতে হয়।

### 7.1 বেসিক Interface Implementation

```typescript
interface Printable {
  print(): void;
}

interface Saveable {
  save(): boolean;
}

// একটি interface implement
class Report implements Printable {
  constructor(
    private title: string,
    private content: string,
  ) {}

  // ✅ Printable interface-এর print() মেথড ইমপ্লিমেন্ট
  print(): void {
    console.log(`📄 রিপোর্ট: ${this.title}`);
    console.log(`   বিষয়বস্তু: ${this.content}`);
  }
}

// একাধিক interface implement
class Document implements Printable, Saveable {
  constructor(
    private title: string,
    private content: string,
  ) {}

  print(): void {
    console.log(`📄 ডকুমেন্ট প্রিন্ট: ${this.title}`);
  }

  save(): boolean {
    console.log(`💾 "${this.title}" সেভ হয়েছে!`);
    return true;
  }
}

const doc = new Document("চিঠি", "প্রিয় মহোদয়...");
doc.print(); // "📄 ডকুমেন্ট প্রিন্ট: চিঠি"
doc.save(); // "💾 "চিঠি" সেভ হয়েছে!"
```

### 7.2 ব্যবহারিক উদাহরণ — Repository Pattern

```typescript
// Generic interface — যেকোনো এন্টিটির জন্য কাজ করবে
interface Repository<T> {
  findAll(): T[];
  findById(id: number): T | undefined;
  create(item: T): T;
  update(id: number, item: Partial<T>): T | undefined;
  delete(id: number): boolean;
}

interface User {
  id: number;
  name: string;
  email: string;
}

// Repository interface implement করে UserRepository
class UserRepository implements Repository<User> {
  private users: User[] = [];

  findAll(): User[] {
    return [...this.users];
  }

  findById(id: number): User | undefined {
    return this.users.find((u) => u.id === id);
  }

  create(user: User): User {
    this.users.push(user);
    console.log(`✅ ইউজার তৈরি: ${user.name}`);
    return user;
  }

  update(id: number, data: Partial<User>): User | undefined {
    const index = this.users.findIndex((u) => u.id === id);
    if (index === -1) return undefined;
    this.users[index] = { ...this.users[index], ...data };
    return this.users[index];
  }

  delete(id: number): boolean {
    const index = this.users.findIndex((u) => u.id === id);
    if (index === -1) return false;
    this.users.splice(index, 1);
    return true;
  }
}

const userRepo = new UserRepository();
userRepo.create({ id: 1, name: "রিপন", email: "ripon@test.com" });
userRepo.create({ id: 2, name: "করিম", email: "karim@test.com" });

console.log(userRepo.findAll()); // [User1, User2]
console.log(userRepo.findById(1)); // { id: 1, name: "রিপন", ... }

userRepo.update(1, { name: "রিপন আহমেদ" });
console.log(userRepo.findById(1)?.name); // "রিপন আহমেদ"
```

### 7.3 Interface vs Abstract Class — কোনটি কখন?

```typescript
// Interface — শুধু চুক্তি (contract), কোনো ইমপ্লিমেন্টেশন নেই
interface Flyable {
  fly(): void;
  altitude: number;
}

// Abstract class — চুক্তি + কিছু ইমপ্লিমেন্টেশন থাকতে পারে
abstract class Vehicle {
  constructor(public brand: string) {}

  abstract startEngine(): void; // abstract — সাবক্লাসে ইমপ্লিমেন্ট
  honk(): void {
    // concrete — সাবক্লাসে inherited
    console.log("বিপ বিপ! 🔊");
  }
}
```

::: tip Interface vs Abstract Class — সিদ্ধান্ত গাইড
| বৈশিষ্ট্য | Interface | Abstract Class |
|---|---|---|
| ইমপ্লিমেন্টেশন থাকে? | ❌ না | ✅ হ্যাঁ (partial) |
| একাধিক implement/extend? | ✅ একাধিক `implements` | ❌ একটি মাত্র `extends` |
| প্রপার্টি ভ্যালু? | ❌ না | ✅ হ্যাঁ |
| কনস্ট্রাক্টর? | ❌ না | ✅ হ্যাঁ |
| কখন ব্যবহার? | **চুক্তি** ডিফাইন করতে | **শেয়ার্ড লজিক** + **চুক্তি** |

**নিয়ম:**

- শুধু **"কী করবে"** বলতে চাইলে → **Interface**
- **"কী করবে"** + **"কিভাবে করবে" (আংশিক)** বলতে চাইলে → **Abstract Class**
  :::

---

## সারসংক্ষেপ (Summary)

এই সেকশনে আমরা শিখলাম:

| বিষয়                   | বিবরণ                    | উদাহরণ                                               |
| ----------------------- | ------------------------ | ---------------------------------------------------- |
| **Class & Constructor** | ক্লাস তৈরি ও শর্টহ্যান্ড | `class User { constructor(public name: string) {} }` |
| **public**              | সবার কাছে উন্মুক্ত       | ডিফল্ট মডিফায়ার                                     |
| **private**             | শুধু ক্লাসের ভেতরে       | `private balance: number`                            |
| **protected**           | ক্লাস + সাবক্লাসে        | `protected salary: number`                           |
| **readonly**            | পরিবর্তন-অযোগ্য          | `readonly id: number`                                |
| **get/set**             | কাস্টম accessor          | `get name() {}`, `set name(v) {}`                    |
| **static**              | ক্লাস-লেভেল মেম্বার      | `static PI = 3.14`                                   |
| **abstract**            | ব্লুপ্রিন্ট ক্লাস        | `abstract class Shape {}`                            |
| **implements**          | ইন্টারফেস অনুসরণ         | `class X implements Y {}`                            |

::: tip পরবর্তী ধাপ
Classes ভালোভাবে বুঝে থাকলে এবার **Generics** সেকশনে যান, যেখানে শিখবেন কীভাবে টাইপকে প্যারামিটার হিসেবে পাস করে ক্লাস, ফাংশন ও ইন্টারফেস আরও **ফ্লেক্সিবল** ও **পুনঃব্যবহারযোগ্য** করা যায়।
:::
