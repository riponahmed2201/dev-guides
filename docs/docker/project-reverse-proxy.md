# Real-World Project: Nginx Reverse Proxy & Load Balancing

এই প্রজেক্টে আমরা দেখব কীভাবে **Nginx** কে একটি রিভার্স প্রক্সি এবং লোড ব্যালেন্সার হিসেবে ব্যবহার করা যায়। আমরা ডকার কম্পোজ ব্যবহার করে একটি ব্যাকএন্ড সার্ভিসের একাধিক ইনস্ট্যান্স রান করব এবং এনজিনিক্সের মাধ্যমে সেগুলোর মধ্যে ট্রাফিক ডিস্ট্রিবিউট করব।

## প্রজেক্টের লক্ষ্য
- একটি সিম্পল ব্যাকএন্ড তৈরি করা যা তার হোস্টনেম রিটার্ন করে।
- Docker Compose এর `scale` ফিচার ব্যবহার করে ব্যাকএন্ডের ৩টি কপি রান করা।
- Nginx কনফিগার করা যাতে ট্রাফিক এই ৩টি কন্টেইনারের মধ্যে ভাগ হয়ে যায় (Round Robin)।

---

## ১. প্রজেক্ট স্ট্রাকচার
ফোল্ডার স্ট্রাকচার তৈরি করুন:

```bash
mkdir nginx-load-balancer
cd nginx-load-balancer
mkdir backend nginx
```

---

## ২. ব্যাকএন্ড সার্ভিস তৈরি (Node.js)

আমরা এমন একটি সার্ভার বানাব যা রেসপন্সে নিজের **Hostname** পাঠাবে। ডকার কন্টেইনারের হোস্টনেম সাধারণত তার কন্টেইনার আইডি হয়। এটি দেখে আমরা বুঝব রিকোয়েস্ট কোন কন্টেইনার হ্যান্ডেল করছে।

### backend/index.js
```javascript
const express = require('express');
const os = require('os');
const app = express();

app.get('/', (req, res) => {
    // কন্টেইনারের হোস্টনেম রিটার্ন করবে
    res.send(`Hello from Backend Container: ${os.hostname()}\n`);
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
});
```

### backend/package.json
```json
{
  "name": "simple-backend",
  "version": "1.0.0",
  "main": "index.js",
  "scripts": {
    "start": "node index.js"
  },
  "dependencies": {
    "express": "^4.18.2"
  }
}
```

### backend/Dockerfile
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package.json .
RUN npm install
COPY . .
CMD ["npm", "start"]
```

---

## ৩. Nginx কনফিগারেশন

এনজিনিক্সকে জানাতে হবে যে আমাদের ব্যাকএন্ড সার্ভারগুলো কোথায় আছে।

### nginx/nginx.conf
```nginx
events {}

http {
    # আপস্ট্রিম গ্রুপ ডিফাইন করা
    upstream my-backend {
        # ডকার কম্পোজ নেটওয়ার্কে সার্ভিসের নামই হলো হোস্টনেম
        # ডকার ইন্টারনালি এই নাম দিয়ে রাউন্ড-রবিন ডিএনএস লোড ব্যালেন্সিং করে
        server backend:3000;
    }

    server {
        listen 80;

        location / {
            # প্রক্সি পাস করা আমাদের ডিফাইন করা আপস্ট্রিমে
            proxy_pass http://my-backend;
        }
    }
}
```

---

## ৪. Docker Compose (Orchestration)

```yaml
version: '3.8'

services:
  # ব্যাকএন্ড সার্ভিস
  backend:
    build: ./backend
    # আমরা এখানে কোনো পোর্ট এক্সপোজ করব না হোস্ট মেশিনে
    # কারণ আমরা চাই সব রিকোয়েস্ট এনজিনিক্স হয়ে আসুক

  # এনজিনিক্স লোড ব্যালেন্সার
  nginx:
    image: nginx:alpine
    ports:
      - "8080:80"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf:ro
    depends_on:
      - backend
```

---

## ৫. রান এবং স্কেলিং

১. প্রথমে কন্টেইনারগুলো বিল্ড এবং রান করুন (ডিফল্ট ১টি ব্যাকএন্ড):
```bash
docker-compose up --build -d
```

২. এখন ব্যাকএন্ড সার্ভিসটিকে **৩টি ইনস্ট্যান্সে** স্কেল করুন:
```bash
docker-compose up -d --scale backend=3
```
ডকার এখন `backend` সার্ভিসের ৩টি আলাদা কন্টেইনার রান করবে।

---

## ৬. লোড ব্যালেন্সিং টেস্ট করা

এখন `curl` বা ব্রাউজার দিয়ে `http://localhost:8080` এ বারবার রিকোয়েস্ট পাঠান।

```bash
$ curl http://localhost:8080
Hello from Backend Container: 6b8f3a1d4e2c

$ curl http://localhost:8080
Hello from Backend Container: 8a9b2c3d4e5f

$ curl http://localhost:8080
Hello from Backend Container: 1a2b3c4d5e6f
```
লক্ষ্য করুন, প্রতিবার আলাদা আলাদা **Container ID** আসছে। তার মানে এনজিনিক্স সফলভাবে ট্রাফিক ৩টি কন্টেইনারের মধ্যে লোড ব্যালেন্স করছে।

## সারাংশ
এই প্রজেক্টে আমরা শিখলাম কীভাবে ডকার কম্পোজের `--scale` কমান্ড ব্যবহার করে মুহূর্তের মধ্যে সার্ভিসের ক্যাপাসিটি বাড়ানো যায় এবং এনজিনিক্স দিয়ে তাদের সামনে একটি ইউনিফাইড এন্ট্রি পয়েন্ট সেট করা যায়।
