# Core Built-in Modules

Node.js এর শক্তি হলো এর বিল্ট-ইন মডিউলগুলো। কোনো এক্সট্রা লাইব্রেরি ইন্সটল করা ছাড়াই আমরা ফাইল সিস্টেম, নেটওয়ার্কিং, অপারেটিং সিস্টেমের তথ্যের মতো কাজ করতে পারি। এখানে সবচেয়ে গুরুত্বপূর্ণ ৫টি মডিউল নিয়ে আলোচনা করা হলো।

## ১. fs (File System) Module

ফাইল রিড, রাইট, ডিলেট বা ফোল্ডার তৈরির জন্য `fs` মডিউল ব্যবহার করা হয়।

### Async vs Sync
Node.js এ প্রায় সব ফাইল অপারেশনের দুটি ভার্সন থাকে:
1.  **Asynchronous (Non-blocking):** কাজ শেষ হলে কলব্যাক দেয়। (রেকমেন্ডেড)
2.  **Synchronous (Blocking):** কাজ শেষ না হওয়া পর্যন্ত কোড আটকে রাখে।

```javascript
const fs = require('fs');

// ফাইল রাইট করা (Async)
fs.writeFile('example.txt', 'Hello Node.js', (err) => {
    if (err) throw err;
    console.log('File created successfully!');
});

// ফাইল রিড করা
fs.readFile('example.txt', 'utf8', (err, data) => {
    if (err) throw err;
    console.log(data); // Hello Node.js
});
```

### fs.promises API (Modern Way)
কলব্যাক এড়াতে আমরা আধুনিক `fs/promises` ব্যবহার করতে পারি।
```javascript
const fs = require('fs/promises');

async function readFile() {
    try {
        const data = await fs.readFile('example.txt', 'utf8');
        console.log(data);
    } catch (err) {
        console.error(err);
    }
}
readFile();
```

---

## ২. path Module

বিভিন্ন ফোল্ডার পাথ বা ফাইল পাথ নিয়ে কাজ করতে `path` মডিউল ব্যবহার করা হয়। এটি উইন্ডোজ এবং লিনাক্সের পাথের পার্থক্য (`\` vs `/`) হ্যান্ডেল করে।

```javascript
const path = require('path');

const filePath = path.join(__dirname, 'files', 'image.png');
console.log(filePath); 
// Windows: C:\projects\my-app\files\image.png
// Linux: /projects/my-app/files/image.png

console.log(path.basename(filePath)); // image.png
console.log(path.extname(filePath));  // .png
console.log(path.resolve('dist', 'index.html')); // Absolute Path দেয়
```

---

## ৩. os Module

অপারেটিং সিস্টেম এবং হার্ডওয়্যার সম্পর্কিত তথ্যের জন্য এটি ব্যবহার করা হয়।

```javascript
const os = require('os');

console.log('OS Platform:', os.platform()); // win32, linux, darwin
console.log('OS Arch:', os.arch()); // x64
console.log('Total Memory:', os.totalmem());
console.log('Free Memory:', os.freemem());
console.log('CPU Info:', os.cpus());
```

---

## ৪. events Module

Node.js এর ইভেন্ট-ড্রিভেন আর্কিটেকচারের মূলে আছে এই মডিউল। আমরা নিজস্ব ইভেন্ট তৈরি ও হ্যান্ডেল করতে পারি।

```javascript
const EventEmitter = require('events');
const myEmitter = new EventEmitter();

// ১. ইভেন্ট লিসেনার তৈরি (on)
myEmitter.on('order-placed', (product) => {
    console.log(`Email sent for ${product}`);
});

// ২. ইভেন্ট ফায়ার করা (emit)
myEmitter.emit('order-placed', 'Laptop');
```

---

## ৫. http Module (Creating Server)

সবচেয়ে বেসিক ওয়েব সার্ভার তৈরির জন্য `http` মডিউল ব্যবহার করা হয় (যদিও বাস্তবে আমরা Express.js ব্যবহার করি, তবে এটি জানা থাকলে ভালো)।

```javascript
const http = require('http');

const server = http.createServer((req, res) => {
    // হেডার সেট করা
    res.writeHead(200, { 'Content-Type': 'text/html' });

    // রিকোয়েস্ট URL চেক করা
    if (req.url === '/') {
        res.write('<h1>Welcome to Home Page</h1>');
    } else if (req.url === '/about') {
        res.write('<h1>About Us</h1>');
    } else {
        res.write('<h1>404 Not Found</h1>');
    }

    res.end();
});

server.listen(3000, () => {
    console.log('Server running on port 3000');
});
```
এখন ব্রাউজারে `http://localhost:3000` এ গেলে আপনার সার্ভার রেসপন্স করবে।
