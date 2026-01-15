# Real-World Project: Microservices with Docker

এই প্রজেক্টে আমরা একটি বেসিক মাইক্রোসার্ভিস আর্কিটেকচার তৈরি করব যেখানে দুটি আলাদা সার্ভিস (**User Service** এবং **Order Service**) একে অপরের সাথে যোগাযোগ করবে। এটি ডকারের নেটওয়ার্কিং এবং সার্ভিস ডিসকভারি বোঝার জন্য চমৎকার একটি প্রজেক্ট।

## আর্কিটেকচার ওভারভিউ
- **User Service:** ইউজারের তথ্য রিটার্ন করে (Port 5001)।
- **Order Service:** ইউজারের অর্ডারের তথ্য রিটার্ন করে এবং User Service থেকে ইউজারের নাম ফেচ করে (Port 5002)।
- **Docker Compose:** দুটি সার্ভিসকে একসাথে রান করবে এবং ইন্টারনাল নেটওয়ার্ক তৈরি করবে।

## ১. প্রজেক্ট স্ট্রাকচার
ফোল্ডার স্ট্রাকচার তৈরি করুন:

```bash
mkdir microservices-demo
cd microservices-demo
mkdir user-service order-service
```

---

## ২. User Service তৈরি করা

`user-service/index.js` তৈরি করুন:
```javascript
const express = require('express');
const app = express();

app.get('/user/:id', (req, res) => {
    res.json({
        id: req.params.id,
        name: "John Doe",
        email: "john@example.com"
    });
});

app.listen(5001, () => {
    console.log('User Service running on port 5001');
});
```

`user-service/package.json` তৈরি করুন:
```json
{
  "name": "user-service",
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

`user-service/Dockerfile` তৈরি করুন:
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package.json .
RUN npm install
COPY . .
EXPOSE 5001
CMD ["npm", "start"]
```

---

## ৩. Order Service তৈরি করা

`order-service/index.js` তৈরি করুন। লক্ষ্য করুন এখানে আমরা `http://user-service:5001` ইউআরএল ব্যবহার করছি। ডকার কম্পোজ অটোমেটিক্যালি সার্ভিস নেমকে আইপিতে রিজলভ করে দেয়।

```javascript
const express = require('express');
const axios = require('axios'); // HTTP requests এর জন্য
const app = express();

app.get('/order/:id', async (req, res) => {
    const userId = 1; // ডেমো ইউজার আইডি
    
    try {
        // User Service কে কল করা হচ্ছে (Internal Docker Network)
        const userResponse = await axios.get(`http://user-service:5001/user/${userId}`);
        
        res.json({
            orderId: req.params.id,
            amount: 99.99,
            user: userResponse.data
        });
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch user data" });
    }
});

app.listen(5002, () => {
    console.log('Order Service running on port 5002');
});
```

`order-service/package.json` তৈরি করুন:
```json
{
  "name": "order-service",
  "version": "1.0.0",
  "main": "index.js",
  "scripts": {
    "start": "node index.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "axios": "^1.6.0"
  }
}
```

`order-service/Dockerfile` তৈরি করুন:
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package.json .
RUN npm install
COPY . .
EXPOSE 5002
CMD ["npm", "start"]
```

---

## ৪. Docker Compose (Orchestration)

রুটে `docker-compose.yml` ফাইল তৈরি করুন:

```yaml
version: '3.8'

services:
  user-service:
    build: ./user-service
    container_name: ms-user
    ports:
      - "5001:5001"
    networks:
      - microservices-net

  order-service:
    build: ./order-service
    container_name: ms-order
    ports:
      - "5002:5002"
    depends_on:
      - user-service
    networks:
      - microservices-net

networks:
  microservices-net:
    driver: bridge
```

## ৫. রান এবং টেস্ট

টার্মিনালে কমান্ড দিন:
```bash
docker-compose up --build -d
```

এখন ব্রাউজারে `Order Service` এর এপিআই হিট করুন:
URL: `http://localhost:5002/order/101`

এক্সপেক্টেড আউটপুট:
```json
{
  "orderId": "101",
  "amount": 99.99,
  "user": {
    "id": "1",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

দেখা যাচ্ছে, Order Service সফলভাবে User Service এর সাথে যোগাযোগ করে ডাটা এনেছে।

## সারাংশ
এই প্রজেক্টে আমরা শিখলাম কীভাবে ডকার কম্পোজ ব্যবহার করে একাধিক মাইক্রোসার্ভিস রান করা যায় এবং কীভাবে তারা একে অপরের সাথে সার্ভিস নেম ব্যবহার করে যোগাযোগ করে।
