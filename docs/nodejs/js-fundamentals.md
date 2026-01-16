# JavaScript Fundamentals - Complete Foundation for Node.js

Node.js শিখতে গেলে **JavaScript এর ভিত্তি মজবুত থাকা অপরিহার্য**। এই comprehensive guide এ আমরা সেই সব fundamentals শিখব যা Node.js development এর জন্য absolutely জরুরি।

## Table of Contents

1. **Variables** - let, const, var
2. **Data Types** - Primitives & Reference types
3. **Type Coercion** - Implicit & Explicit conversion
4. **Operators** - Arithmetic, Comparison, Logical
5. **Truthy & Falsy Values**
6. **Control Flow** - if-else, switch, ternary
7. **Loops** - for, while, for...of, for...in
8. **Functions** - Declaration, Expression, Arrow
9. **Scope** - Global, Function, Block, Lexical
10. **Hoisting** - var, let, const, function
11. **Closures** - Lexical environment
12. **This Keyword** - Context binding
13. **Arrays** - Creation & manipulation
14. **Array Methods** - map, filter, reduce, etc.
15. **Objects** - Creation & methods
16. **Object Methods** - Keys, values, entries
17. **Destructuring** - Array & Object
18. **Spread & Rest** - ... operator
19. **Template Literals** - String interpolation
20. **Error Handling** - try-catch-finally
21. **JSON** - Parse & stringify
22. **Dates** - Date object & methods
23. **Math** - Math object & methods
24. **String Methods** - Common operations
25. **Number Methods** - Conversion & validation
26. **Regular Expressions** - Pattern matching

---

## ১. Variables - let, const, var

JavaScript এ variables declare করার 3টি উপায়।

### let - Block Scoped, Reassignable

```javascript
let age = 25;
age = 26;  // ✅ Can be reassigned
console.log(age);  // 26

// Block scope
if (true) {
    let x = 10;
    console.log(x);  // 10
}
console.log(x);  // ❌ ReferenceError: x is not defined
```

### const - Block Scoped, NOT Reassignable

```javascript
const name = "John";
name = "Jane";  // ❌ TypeError: Assignment to constant variable

// But object/array properties CAN be modified
const person = { name: "John" };
person.name = "Jane";  // ✅ OK (reference unchanged)
person.age = 30;       // ✅ OK

const numbers = [1, 2, 3];
numbers.push(4);       // ✅ OK (reference unchanged)
console.log(numbers);  // [1, 2, 3, 4]

// Can't reassign the entire object/array
person = {};           // ❌ Error
numbers = [];          // ❌ Error
```

### var - Function Scoped, Hoisted (Avoid!)

```javascript
// Function scoped (not block scoped)
if (true) {
    var x = 10;
}
console.log(x);  // 10 (accessible outside block!)

// Hoisting issue
console.log(y);  // undefined (not error!)
var y = 5;

// Equivalent to:
var y;
console.log(y);  // undefined
y = 5;

// No error on re-declaration
var z = 1;
var z = 2;  // ✅ OK (but confusing!)
```

### Best Practices

```javascript
// ✅ Use const by default
const API_URL = 'https://api.example.com';
const users = [];

// ✅ Use let when reassignment is needed
let counter = 0;
counter++;

// ❌ Avoid var completely
var oldWay = 'avoid this';
```

---

## ২. Data Types - Complete Guide

JavaScript এ 2 categories of data types।

### Primitive Types (Immutable)

#### 1. String

```javascript
const single = 'Single quotes';
const double = "Double quotes";
const template = `Template literal ${single}`;

// String is immutable
let str = "Hello";
str[0] = "h";  // No effect
console.log(str);  // "Hello" (unchanged)
```

#### 2. Number

```javascript
const integer = 42;
const float = 3.14;
const negative = -10;
const scientific = 2.998e8;  // 299800000

// Special numeric values
const infinity = Infinity;
const negInfinity = -Infinity;
const notANumber = NaN;

console.log(typeof NaN);  // "number" (weird but true!)
```

#### 3. BigInt (ES2020)

```javascript
const big = 9007199254740991n;
const huge = BigInt("9007199254740991");

// Can't mix with regular numbers
const result = big + 10n;  // ✅ OK
const mixed = big + 10;    // ❌ TypeError
```

#### 4. Boolean

```javascript
const isTrue = true;
const isFalse = false;

// Boolean conversion
Boolean(1);        // true
Boolean(0);        // false
Boolean("hello");  // true
Boolean("");       // false
```

#### 5. Undefined

```javascript
let x;
console.log(x);  // undefined

function test() {
    // No return statement
}
console.log(test());  // undefined

const obj = { name: "John" };
console.log(obj.age);  // undefined
```

#### 6. Null

```javascript
let user = null;  // Intentionally empty

console.log(typeof null);  // "object" (JavaScript bug!)
console.log(null === undefined);  // false
console.log(null == undefined);   // true
```

#### 7. Symbol (ES6)

```javascript
const sym1 = Symbol('description');
const sym2 = Symbol('description');

console.log(sym1 === sym2);  // false (always unique)

// Use case: Unique object properties
const ID = Symbol('id');
const user = {
    name: "John",
    [ID]: 12345
};
```

### Reference Types (Mutable)

#### 1. Object

```javascript
const person = {
    name: "John",
    age: 30,
    greet() {
        console.log("Hello!");
    }
};

// Mutable
person.age = 31;
person.city = "NYC";
delete person.age;
```

#### 2. Array

```javascript
const numbers = [1, 2, 3, 4, 5];

// Mutable
numbers.push(6);
numbers[0] = 10;
```

#### 3. Function

```javascript
function add(a, b) {
    return a + b;
}

// Functions are objects!
add.description = "Adds two numbers";
console.log(add.description);  // "Adds two numbers"
```

### Checking Types

```javascript
// typeof operator
console.log(typeof "hello");     // "string"
console.log(typeof 42);          // "number"
console.log(typeof true);        // "boolean"
console.log(typeof undefined);   // "undefined"
console.log(typeof null);        // "object" (bug!)
console.log(typeof {});          // "object"
console.log(typeof []);          // "object" (not "array"!)
console.log(typeof function(){}); // "function"

// Better array check
console.log(Array.isArray([]));  // true

// instanceof operator
console.log([] instanceof Array);     // true
console.log({} instanceof Object);    // true
console.log(new Date() instanceof Date);  // true
```

---

## ৩. Type Coercion - Implicit & Explicit

### Implicit Coercion (Automatic)

```javascript
// String coercion
console.log("5" + 3);      // "53" (number to string)
console.log("Hello" + 1);  // "Hello1"

// Number coercion
console.log("5" - 3);      // 2 (string to number)
console.log("10" * "2");   // 20
console.log("10" / "2");   // 5

// Boolean coercion
console.log(5 + true);     // 6 (true → 1)
console.log(5 + false);    // 5 (false → 0)

// Comparison coercion
console.log(5 == "5");     // true (loose equality)
console.log(5 === "5");    // false (strict equality)
```

### Explicit Conversion

```javascript
// To String
String(123);           // "123"
(123).toString();      // "123"
123 + "";              // "123"

// To Number
Number("123");         // 123
Number("123abc");      // NaN
parseInt("123");       // 123
parseInt("123.45");    // 123
parseFloat("123.45");  // 123.45
+"123";                // 123 (unary plus)

// To Boolean
Boolean(1);            // true
Boolean(0);            // false
!!"hello";             // true (double negation)
```

---

## ৪. Operators - Complete Reference

### Arithmetic Operators

```javascript
const a = 10, b = 3;

console.log(a + b);   // 13 (Addition)
console.log(a - b);   // 7  (Subtraction)
console.log(a * b);   // 30 (Multiplication)
console.log(a / b);   // 3.333... (Division)
console.log(a % b);   // 1  (Modulus/Remainder)
console.log(a ** b);  // 1000 (Exponentiation - ES2016)

// Increment/Decrement
let x = 5;
console.log(x++);  // 5 (post-increment, returns then increments)
console.log(x);    // 6
console.log(++x);  // 7 (pre-increment, increments then returns)
```

### Comparison Operators

```javascript
// Loose equality (==) - Type coercion
console.log(5 == "5");       // true
console.log(0 == false);     // true
console.log(null == undefined);  // true

// Strict equality (===) - No type coercion
console.log(5 === "5");      // false
console.log(0 === false);    // false
console.log(null === undefined);  // false

// Inequality
console.log(5 != "5");       // false (loose)
console.log(5 !== "5");      // true (strict)

// Relational
console.log(10 > 5);         // true
console.log(10 >= 10);       // true
console.log(5 < 3);          // false
console.log(5 <= 5);         // true
```

### Logical Operators

```javascript
// AND (&&) - Returns first falsy or last value
console.log(true && true);     // true
console.log(true && false);    // false
console.log(5 && 10);          // 10
console.log(0 && 10);          // 0 (short-circuit)

// OR (||) - Returns first truthy or last value
console.log(true || false);    // true
console.log(false || false);   // false
console.log(0 || 5);           // 5
console.log(null || "default"); // "default"

// NOT (!) - Inverts boolean
console.log(!true);            // false
console.log(!0);               // true
console.log(!"hello");         // false

// Nullish Coalescing (??) - ES2020
console.log(null ?? "default");      // "default"
console.log(undefined ?? "default"); // "default"
console.log(0 ?? "default");         // 0 (not null/undefined!)
console.log("" ?? "default");        // "" (not null/undefined!)
```

### Assignment Operators

```javascript
let x = 10;

x += 5;   // x = x + 5
x -= 3;   // x = x - 3
x *= 2;   // x = x * 2
x /= 2;   // x = x / 2
x %= 3;   // x = x % 3
x **= 2;  // x = x ** 2

// Logical assignment (ES2021)
x ||= 5;   // x = x || 5 (if falsy)
x &&= 5;   // x = x && 5 (if truthy)
x ??= 5;   // x = x ?? 5 (if null/undefined)
```

### Ternary Operator

```javascript
const age = 18;
const status = age >= 18 ? "Adult" : "Minor";

// Nested ternary (avoid if complex)
const score = 85;
const grade = score >= 90 ? "A" : 
              score >= 80 ? "B" : 
              score >= 70 ? "C" : "F";
```

---

## ৫. Truthy & Falsy Values

JavaScript এ সব values true বা false এ convert হয়।

### Falsy Values (Only 8!)

```javascript
Boolean(false);       // false
Boolean(0);           // false
Boolean(-0);          // false
Boolean(0n);          // false (BigInt zero)
Boolean("");          // false (empty string)
Boolean(null);        // false
Boolean(undefined);   // false
Boolean(NaN);         // false

// All others are truthy!
```

### Truthy Values (Everything else!)

```javascript
Boolean(true);        // true
Boolean(1);           // true
Boolean(-1);          // true
Boolean("0");         // true (string!)
Boolean("false");     // true (string!)
Boolean(" ");         // true (space)
Boolean([]);          // true (empty array)
Boolean({});          // true (empty object)
Boolean(function(){}); // true
```

### Practical Use

```javascript
// Default values (old way)
function greet(name) {
    name = name || "Guest";
    console.log(`Hello, ${name}!`);
}

greet();         // "Hello, Guest!"
greet("John");   // "Hello, John!"

// Problem with || operator
greet(0);        // "Hello, Guest!" (0 is falsy!)

// Solution: Nullish coalescing
function greet2(name) {
    name = name ?? "Guest";
    console.log(`Hello, ${name}!`);
}

greet2(0);       // "Hello, 0!" (only null/undefined use default)
```

---

## ৬. Control Flow - if-else, switch, ternary

### if-else Statement

```javascript
const age = 18;

if (age >= 18) {
    console.log("Adult");
} else if (age >= 13) {
    console.log("Teenager");
} else {
    console.log("Child");
}

// Short-circuit evaluation
const user = null;
user && console.log(user.name);  // No error (short-circuit)

// Truthy/Falsy check
const name = "John";
if (name) {  // Truthy check
    console.log(`Hello, ${name}`);
}
```

### switch Statement

```javascript
const day = "Monday";

switch (day) {
    case "Monday":
        console.log("Start of week");
        break;
    case "Friday":
        console.log("Almost weekend!");
        break;
    case "Saturday":
    case "Sunday":
        console.log("Weekend!");
        break;
    default:
        console.log("Regular day");
}

// Multiple conditions without break
const month = 2;
let season;

switch (month) {
    case 12:
    case 1:
    case 2:
        season = "Winter";
        break;
    case 3:
    case 4:
    case 5:
        season = "Spring";
        break;
    // ... etc
}
```

### Ternary Operator

```javascript
// Basic
const age = 18;
const canVote = age >= 18 ? "Yes" : "No";

// With expressions
const price = 100;
const discount = price > 50 ? price * 0.1 : 0;

// Nested (be careful!)
const score = 85;
const grade = score >= 90 ? "A" :
              score >= 80 ? "B" :
              score >= 70 ? "C" :
              score >= 60 ? "D" : "F";
```

---

## ৭. Loops - for, while, for...of, for...in

### for Loop

```javascript
// Traditional for loop
for (let i = 0; i < 5; i++) {
    console.log(i);  // 0, 1, 2, 3, 4
}

// Multiple variables
for (let i = 0, j = 10; i < 5; i++, j--) {
    console.log(i, j);
}

// Iterate array
const arr = ['a', 'b', 'c'];
for (let i = 0; i < arr.length; i++) {
    console.log(arr[i]);
}
```

### while Loop

```javascript
let i = 0;
while (i < 5) {
    console.log(i);
    i++;
}

// do-while (executes at least once)
let j = 0;
do {
    console.log(j);
    j++;
} while (j < 5);
```

### for...of Loop (Iterables: Arrays, Strings, Maps, Sets)

```javascript
// Arrays
const numbers = [1, 2, 3, 4, 5];
for (const num of numbers) {
    console.log(num);
}

// Strings
for (const char of "Hello") {
    console.log(char);  // H, e, l, l, o
}

// With index
for (const [index, value] of numbers.entries()) {
    console.log(index, value);
}
```

### for...in Loop (Object properties)

```javascript
// Objects
const person = {
    name: "John",
    age: 30,
    city: "NYC"
};

for (const key in person) {
    console.log(key, person[key]);
}

// Arrays (not recommended!)
const arr = ['a', 'b', 'c'];
for (const index in arr) {
    console.log(index, arr[index]);  // "0" a, "1" b, "2" c
}
// Note: index is string, not number!
```

### Loop Control

```javascript
// break - Exit loop
for (let i = 0; i < 10; i++) {
    if (i === 5) break;
    console.log(i);  // 0, 1, 2, 3, 4
}

// continue - Skip iteration
for (let i = 0; i < 5; i++) {
    if (i === 2) continue;
    console.log(i);  // 0, 1, 3, 4 (skips 2)
}

// Labels (rare usage)
outer: for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
        if (i === 1 && j === 1) break outer;
        console.log(i, j);
    }
}
```

---

## ৮. Functions - Declaration, Expression, Arrow

### Function Declaration

```javascript
function greet(name) {
    return `Hello, ${name}!`;
}

console.log(greet("John"));  // "Hello, John!"

// Hoisted (can call before declaration)
sayHi();  // ✅ Works

function sayHi() {
    console.log("Hi!");
}
```

### Function Expression

```javascript
const greet = function(name) {
    return `Hello, ${name}!`;
};

console.log(greet("Jane"));  // "Hello, Jane!"

// NOT hoisted
sayHi();  // ❌ ReferenceError

const sayHi = function() {
    console.log("Hi!");
};
```

### Arrow Function (ES6)

```javascript
// Basic syntax
const add = (a, b) => a + b;

// With block body
const multiply = (a, b) => {
    const result = a * b;
    return result;
};

// Single parameter (no parentheses)
const double = x => x * 2;

// No parameters
const greet = () => console.log("Hello!");

// Return object (wrap in parentheses)
const getPerson = () => ({ name: "John", age: 30 });
```

### Default Parameters

```javascript
function greet(name = "Guest", greeting = "Hello") {
    return `${greeting}, ${name}!`;
}

console.log(greet());              // "Hello, Guest!"
console.log(greet("John"));        // "Hello, John!"
console.log(greet("John", "Hi"));  // "Hi, John!"
```

### Rest Parameters

```javascript
function sum(...numbers) {
    return numbers.reduce((total, n) => total + n, 0);
}

console.log(sum(1, 2, 3, 4, 5));  // 15

// Mix with regular parameters
function multiply(factor, ...numbers) {
    return numbers.map(n => n * factor);
}

console.log(multiply(2, 1, 2, 3));  // [2, 4, 6]
```

### Callback Functions

```javascript
function processData(data, callback) {
    const result = data * 2;
    callback(result);
}

processData(5, (result) => {
    console.log(result);  // 10
});

// Real-world example
setTimeout(() => {
    console.log("Executed after 1 second");
}, 1000);
```

---

## ৯. Scope - Global, Function, Block, Lexical

### Global Scope

```javascript
const globalVar = "I'm global";

function test() {
    console.log(globalVar);  // ✅ Accessible
}

test();
console.log(globalVar);  // ✅ Accessible
```

### Function Scope

```javascript
function test() {
    const functionVar = "I'm in function";
    console.log(functionVar);  // ✅ Accessible
}

test();
console.log(functionVar);  // ❌ ReferenceError
```

### Block Scope (let, const)

```javascript
{
    const blockVar = "I'm in block";
    console.log(blockVar);  // ✅ Accessible
}

console.log(blockVar);  // ❌ ReferenceError

// if statement
if (true) {
    let x = 10;
}
console.log(x);  // ❌ ReferenceError

// for loop
for (let i = 0; i < 3; i++) {
    // i is block-scoped to loop
}
console.log(i);  // ❌ ReferenceError
```

### Lexical Scope (Nested functions)

```javascript
function outer() {
    const outerVar = "outer";
    
    function inner() {
        const innerVar = "inner";
        console.log(outerVar);  // ✅ Can access outer scope
        console.log(innerVar);  // ✅ Can access own scope
    }
    
    inner();
    console.log(innerVar);  // ❌ ReferenceError
}

outer();
```

---

## ১০. Hoisting - var, let, const, function

### Function Hoisting

```javascript
// ✅ Function declarations are hoisted
sayHi();  // "Hi!"

function sayHi() {
    console.log("Hi!");
}

// ❌ Function expressions are NOT hoisted
greet();  // ❌ TypeError

const greet = function() {
    console.log("Hello!");
};
```

### Variable Hoisting

```javascript
// var is hoisted (initialized with undefined)
console.log(x);  // undefined (not error!)
var x = 5;

// Equivalent to:
var x;
console.log(x);  // undefined
x = 5;

// let and const are hoisted but NOT initialized (TDZ)
console.log(y);  // ❌ ReferenceError
let y = 5;

console.log(z);  // ❌ ReferenceError
const z = 5;
```

### Temporal Dead Zone (TDZ)

```javascript
{
    // TDZ starts
    console.log(x);  // ❌ ReferenceError
    
    let x = 5;  // TDZ ends
    console.log(x);  // ✅ 5
}
```

---

This file is getting very long. Should I continue expanding with remaining topics (Closures, This, Arrays, Objects, etc.) or would you like me to save this part first and continue in the next iteration?
