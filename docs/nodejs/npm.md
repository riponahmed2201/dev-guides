# NPM & Package Management

Node.js এর অন্যতম বড় শক্তি হলো এর বিশাল প্যাকেজ ইকোসিস্টেম। আর এই সব প্যাকেজ ম্যানেজ করার জন্য আমরা ব্যবহার করি **NPM (Node Package Manager)**।

## ১. NPM কি এবং কেন দরকার?

NPM মূলত দুটি জিনিস:
1.  **Repository:** একটি বিশাল অনলাইন স্টোর (registry) যেখানে লক্ষ লক্ষ ওপেন সোর্স জাভাস্ক্রিপ্ট প্যাকেজ জমা আছে।
2.  **CLI Tool:** একটি কমান্ড লাইন টুল যা দিয়ে আমরা এই প্যাকেজগুলো ইনস্টল ও ম্যানেজ করি।

**কেন দরকার?**
মনে করুন আপনার অ্যাপে তারিখ ও সময় নিয়ে জটিল কাজ করতে হবে। আপনি নিজে কোড লেখার বদলে `date-fns` বা `moment` এর মতো রেডিমেড প্যাকেজ ব্যবহার করতে পারেন। এতে সময় বাঁচে এবং বাগ কম হয়।

---

## ২. package.json বোঝা

প্রতিটি Node.js প্রোজেক্টের হৃদপিণ্ড হলো `package.json` ফাইল। এটি প্রোজেক্টের মেটাডেটা (নাম, ভার্সন, স্ক্রিপ্ট, ডিপেনডেন্সি) ধারণ করে।

এটি তৈরি করতে টার্মিনালে লিখুন:
```bash
npm init -y
```
(`-y` ফ্ল্যাগ দিলে ডিফল্ট সব অপশন ইয়েস হয়ে যাবে)

### `package.json` এর গুরুত্বপূর্ণ অংশ:
```json
{
  "name": "my-app",
  "version": "1.0.0",
  "main": "index.js",
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js"
  },
  "dependencies": {
    "express": "^4.18.2"
  },
  "devDependencies": {
    "nodemon": "^3.0.2"
  }
}
```

---

## ৩. Dependencies vs DevDependencies

প্যাকেজ ইনস্টল করার সময় দুই ভাবে করা যায়:

### Dependencies
যেসব প্যাকেজ অ্যাপ্লিকেশন রান করতে বা প্রোডাকশনে প্রয়োজন হয়।
```bash
npm install express
# Short: npm i express
```

### DevDependencies
যেসব প্যাকেজ শুধুমাত্র ডেভেলপমেন্ট বা টেস্টিং এর সময় লাগে (যেমন: বাগ ফিক্সিং টুল, টেস্টিং টুল), প্রোডাকশনে সার্ভারে লাগে না।
```bash
npm install nodemon --save-dev
# Short: npm i -D nodemon
```

---

## ৪. Package Installation (Local vs Global)

- **Local (Recommended):** প্যাকেজটি শুধুমাত্র বর্তমান প্রোজেক্টের `node_modules` ফোল্ডারে ইনস্টল হবে।
- **Global:** প্যাকেজটি পুরো কম্পিউটারের জন্য ইনস্টল হবে (যেমন `npm-check-updates` বা `nodemon` টুল হিসেবে ব্যবহারের জন্য)।

```bash
npm install -g nodemon
```

---

## ৫. NPM Commands (দরকারী কমান্ডস)

- **`npm install`**: `package.json` এ থাকা সব ডিপেনডেন্সি ইনস্টল করতে (টিম মেম্বারের কোড ক্লোন করার পর এটি চালাতে হয়)।
- **`npm update`**: প্যাকেজগুলো আপডেট করতে।
- **`npm uninstall package_name`**: প্যাকেজ রিমুভ করতে।
- **`npm list`**: ইনস্টল করা সব প্যাকেজ দেখতে।

---

## ৬. Semantic Versioning (SemVer)

ভার্সন নম্বরগুলোর একটি নির্দিষ্ট অর্থ আছে, যেমন `4.18.2`:

1.  **Major (4):** ব্রেকিং চেঞ্জ (আগের কোড আর কাজ নাও করতে পারে)।
2.  **Minor (18):** নতুন ফিচার বা ইম্প্রুভমেন্ট (ব্যাকওয়ার্ড কম্প্যাটিবল)।
3.  **Patch (2):** ছোটখাট বাগ ফিক্স।

`package.json` এ ভার্সনের আগের প্রতীকগুলোর অর্থ:
- **`^` (Caret):** যেমন `^4.18.2` — মাইনর বা প্যাচ আপডেট অটো ইনস্টল হবে। (সেফ ও ডিফল্ট)
- **`~` (Tilde):** যেমন `~4.18.2` — শুধুমাত্র প্যাচ আপডেট হবে।
- **`*` (Asterisk):** যেকোনো লেটেস্ট ভার্সন ইনস্টল হবে (রিস্কি)।

---

## ৭. package-lock.json এর কাজ

`package.json` শুধু ভার্সনের রেঞ্জ বলে দেয় (যেমন `^4.0.0`), কিন্তু ঠিক কোন ভার্সনটি ইনস্টল হয়েছে তা নিশ্চিত করে না।

`package-lock.json` ঠিক এক্সাক্ট ভার্সন এবং ডিপেনডেন্সির ট্রি (tree) লক করে রাখে। এটি এনশিওর করে যে আপনার পিসিতে যা ইনস্টল হয়েছে, প্রোডাকশন সার্ভারে বা অন্য ডেভেলপারের পিসিতেও ঠিক তাই ইনস্টল হবে। এটি কখনোই ম্যানুয়ালি এডিট করবেন না।

---

## ৮. NPM Scripts

কাস্টম কমান্ড সেট করার জন্য `package.json` এর `scripts` সেকশন ব্যবহার করা হয়।

```json
"scripts": {
  "start": "node index.js",
  "dev": "nodemon index.js",
  "test": "jest"
}
```

রান করার নিয়ম:
- `npm start` (এটি স্পেশাল, `run` না লিখলেও চলে)
- `npm run dev`
- `npm run test`

---

## ৯. Yarn Alternative

**Yarn** হলো ফেসবুকের তৈরি আরেকটি প্যাকেজ ম্যানেজার। এটি NPM এর মতোই কাজ করে কিন্তু কিছু ক্ষেত্রে দ্রুত (যদিও এখন NPM ও অনেক ফাস্ট)।

| NPM Command | Yarn Command |
| :--- | :--- |
| `npm install` | `yarn` |
| `npm install package` | `yarn add package` |
| `npm uninstall package` | `yarn remove package` |
| `npm run dev` | `yarn dev` |

---

## ১০. Popular Packages খুঁজে বের করা

ভালো প্যাকেজ চেনার উপায়:
1.  **NPM Weekly Downloads:** যত বেশি, তত জনপ্রিয়।
2.  **GitHub Stars:** কমিউনিটির পছন্দ।
3.  **Last Publish:** প্যাকেজটি কি অ্যাক্টিভ মেইনটেইন হচ্ছে?
4.  **License:** MIT বা ISC লাইসেন্স সেফ।
5.  **সাইট ব্যবহার করুন:** [npmjs.com](https://www.npmjs.com/) বা [bundlephobia.com](https://bundlephobia.com/) (প্যাকেজ সাইজ দেখার জন্য)।
