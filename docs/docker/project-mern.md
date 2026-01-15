# Real-World Project: MERN Stack with Docker

এই প্রজেক্টে আমরা একটি ফুল-স্ট্যাক **MERN** (MongoDB, Express, React, Node.js) অ্যাপ্লিকেশন কন্টেইনারাইজ করব। এটি একটি ইন্টারমিডিয়েট লেভেলের প্রজেক্ট যেখানে ফ্রন্টএন্ড এবং ব্যাকএন্ড আলাদা কন্টেইনারে রান করবে এবং ডাটাবেসের সাথে কানেক্ট করবে।

## প্রজেক্ট স্ট্রাকচার

প্রথমে প্রজেক্টের ফোল্ডার স্ট্রাকচার তৈরি করে নিন:

```bash
mkdir mern-docker
cd mern-docker
mkdir client server
```

- **client:** রিয়্যাক্ট ফ্রন্টএন্ডের জন্য।
- **server:** এক্সপ্রেস ব্যাকএন্ডের জন্য।

---

## ১. ব্যাকএন্ড সেটআপ (Server)

`server` ফোল্ডারে `package.json` এবং `index.js` তৈরি করুন।

### server/index.js

```javascript
const express = require("express");
const mongoose = require("mongoose");
const app = express();

// MongoDB Connection
// 'mongo' হলো docker-compose এ ডিফাইন করা সার্ভিস নেম
mongoose
  .connect("mongodb://mongo:27017/mydb", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("Hello from Dockerized Express Backend!");
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
```

### server/Dockerfile

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5000
CMD ["node", "index.js"]
```

---

## ২. ফ্রন্টএন্ড সেটআপ (Client)

`client` ফোল্ডারে একটি রিয়্যাক্ট অ্যাপ তৈরি করুন (অথবা ম্যানুয়ালি ফাইলগুলো তৈরি করুন)। আমরা প্রোডাকশনের জন্য **Multi-stage Build** ব্যবহার করব।

### client/nginx.conf (ঐচ্ছিক, যদি কাস্টম কনফিগ লাগে)

ডিফল্ট এনজিনিক্স কনফিগ যথেষ্ট, তবে রিয়্যাক্ট রাউটারের জন্য আলাদা কনফিগ লাগতে পারে। আমরা সিম্পল রাখার জন্য ডিফল্টটাই ব্যবহার করব।

### client/Dockerfile

```dockerfile
# Stage 1: Build React App
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine
# বিল্ড ফোল্ডার থেকে ফাইলগুলো এনজিনিক্সের html ফোল্ডারে কপি করা হচ্ছে
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

---

## ৩. Docker Compose (অর্কিস্ট্রেশন)

এখন রুট ডিরেক্টরিতে `docker-compose.yml` ফাইল তৈরি করুন যা তিনটি সার্ভিসকে (Mongo, Backend, Frontend) একসাথে কানেক্ট করবে।

### docker-compose.yml

```yaml
version: "3.8"

services:
  # 1. Database
  mongo:
    image: mongo:latest
    container_name: mern-mongo
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db

  # 2. Backend API
  server:
    build: ./server
    container_name: mern-server
    ports:
      - "5000:5000"
    depends_on:
      - mongo
    environment:
      - MONGO_URI=mongodb://mongo:27017/mydb

  # 3. Frontend UI
  client:
    build: ./client
    container_name: mern-client
    ports:
      - "80:80"
    depends_on:
      - server

volumes:
  mongo_data:
```

## ৪. রান করা এবং টেস্ট করা

পুরো স্ট্যাক রান করতে:

```bash
docker-compose up --build -d
```

- **Frontend:** `http://localhost` (Nginx এর মাধ্যমে সার্ভ হচ্ছে)
- **Backend:** `http://localhost:5000`
- **Database:** MongoDB কন্টেইনার ব্যাকগ্রাউন্ডে চলছে।

## সারাংশ

এই প্রজেক্টে আমরা দেখলাম কীভাবে একটি মাল্টি-কন্টেইনার ফুল-স্ট্যাক অ্যাপ্লিকেশন সেটআপ করতে হয়। এখানে `multi-stage build` ব্যবহার করে ফ্রন্টএন্ডের ইমেজ সাইজ অনেক কমানো হয়েছে এবং `bridge network` এর মাধ্যমে কন্টেইনারগুলো একে অপরের সাথে যোগাযোগ করছে।
