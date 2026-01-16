# RESTful API Development

API (Application Programming Interface) হলো এমন একটি মাধ্যম যার মাধ্যমে ফ্রন্টএন্ড এবং ব্যাকএন্ড একে অপরের সাথে কথা বলে। বর্তমানে ওয়েব ডেভেলপমেন্টে **REST** (Representational State Transfer) আর্কিটেকচার সবচেয়ে জনপ্রিয়।

## ১. REST API Principles

একটি API কে RESTful হতে হলে কিছু নিয়ম মেনে চলতে হয়:
1.  **Client-Server Architecture:** ফ্রন্টএন্ড এবং ব্যাকএন্ড সম্পূর্ণ আলাদা থাকতে হবে।
2.  **Stateless:** প্রতিটি রিকোয়েস্ট স্বাধীন হতে হবে। সার্ভার ক্লায়েন্টের আগের কোনো রিকোয়েস্টের তথ্য মনে রাখবে না (Token ভিত্তিক অথেন্টিকেশন এর উদাহরণ)।
3.  **Cacheable:** রেসপন্স ক্যাশ করার ব্যবস্থা থাকতে হবে যাতে পারফরম্যান্স বাড়ে।
4.  **Uniform Interface:** রিসোর্স এক্সেস করার পদ্ধতি সব জায়গায় একই রকম হতে হবে।

---

## ২. Resource Naming Conventions

REST API তে URL গুলোকে "Resource" হিসেবে চিন্তা করা হয়, "Action" হিসেবে নয়।

✅ **Good Practice:**
- `GET /users` (সব ইউজার আনা)
- `GET /users/123` (নির্দিষ্ট ইউজার আনা)
- `POST /users` (নতুন ইউজার তৈরি করা)
- `DELETE /users/123` (ইউজার ডিলিট করা)

❌ **Bad Practice:**
- `GET /getUsers`
- `POST /createUser`
- `DELETE /deleteUser/123`

---

## ৩. HTTP Methods & CRUD

CRUD অপারেশন ইমপ্লিমেন্ট করার জন্য স্ট্যান্ডার্ড HTTP মেথড ব্যবহার করা উচিত।

| Operation | HTTP Method | Description |
| :--- | :--- | :--- |
| **Create** | `POST` | নতুন রিসোর্স তৈরি করতে ব্যবহৃত হয়। |
| **Read** | `GET` | ডেটা পড়তে বা আনতে ব্যবহৃত হয়। |
| **Update** | `PUT` | পুরো রিসোর্স রিপ্লেস বা আপডেট করতে। |
| **Update** | `PATCH` | রিসোর্সের নির্দিষ্ট অংশ মডিফাই করতে। |
| **Delete** | `DELETE` | রিসোর্স মুছে ফেলতে। |

---

## ৪. HTTP Status Codes বোঝা

ক্লায়েন্টকে সঠিক স্ট্যাটাস কোড পাঠানো খুব জরুরি।

### Success (2xx)
- **200 OK:** রিকোয়েস্ট সফল।
- **201 Created:** নতুন রিসোর্স সফলভাবে তৈরি হয়েছে (POST এর পর)।
- **204 No Content:** সফল, কিন্তু রেসপন্স বডিতে কিছু নেই (DELETE এর পর)।

### Client Error (4xx)
- **400 Bad Request:** ভুল ডেটা বা ইনপুট।
- **401 Unauthorized:** টোকেন নেই বা লগইন করা নেই।
- **403 Forbidden:** পারমিশন নেই।
- **404 Not Found:** রিসোর্সটি পাওয়া যায়নি।

### Server Error (5xx)
- **500 Internal Server Error:** সার্ভারে কোনো সমস্যা হয়েছে।

---

## ৫. CRUD Implementation Example (Express.js)

নিচে একটি সিম্পল ইউজার ম্যানেজমেন্ট API এর উদাহরণ দেওয়া হলো (Array কে ডাটাবেস হিসেবে ধরে)।

```javascript
const express = require('express');
const app = express();

app.use(express.json()); // JSON Body Parsing

let users = [
    { id: 1, name: "Ripon", email: "ripon@example.com" },
    { id: 2, name: "Karim", email: "karim@example.com" }
];

// GET: All Users
app.get('/api/v1/users', (req, res) => {
    res.status(200).json({
        status: 'success',
        results: users.length,
        data: { users }
    });
});

// GET: Single User
app.get('/api/v1/users/:id', (req, res) => {
    const user = users.find(u => u.id === parseInt(req.params.id));
    if (!user) {
        return res.status(404).json({
            status: 'fail',
            message: 'User not found'
        });
    }
    res.status(200).json({
        status: 'success',
        data: { user }
    });
});

// POST: Create User
app.post('/api/v1/users', (req, res) => {
    const newUser = {
        id: users.length + 1,
        name: req.body.name,
        email: req.body.email
    };
    users.push(newUser);
    
    res.status(201).json({
        status: 'success',
        data: { user: newUser }
    });
});

// DELETE: Delete User
app.delete('/api/v1/users/:id', (req, res) => {
    const id = parseInt(req.params.id);
    users = users.filter(u => u.id !== id);
    
    res.status(204).json({
        status: 'success',
        data: null
    });
});

app.listen(3000, () => console.log('Server running...'));
```

---

## ৬. API Versioning

ভবিষ্যতে API পরিবর্তন হলে যাতে পুরনো ক্লায়েন্টদের সমস্যা না হয়, সেজন্য ভার্সনিং ব্যবহার করা উচিত।
- URL Versioning: `/api/v1/users` (সবচেয়ে জনপ্রিয়)
- Header Versioning: `Accept-Version: v1`

---

## ৭. Standard Response Format (JSON)

সবসময় একটি নির্দিষ্ট ফরম্যাটে রেসপন্স পাঠানো উচিত। এতে ফ্রন্টএন্ড ডেভেলপারদের কাজ সহজ হয়।

#### Success Response:
```json
{
  "status": "success",
  "data": {
    "id": 1,
    "name": "Ripon"
  }
}
```

#### Error Response:
```json
{
  "status": "fail",
  "message": "User not found"
}
```

---

## ৮. API Testing

API তৈরি করার পর সেটি টেস্ট করার জন্য আমরা কিছু টুলস ব্যবহার করি:
- **Postman:** সবচেয়ে জনপ্রিয় GUI টুল।
- **Insomnia:** লাইটওয়েট এবং ফাস্ট।
- **Thunder Client:** VS Code এক্সটেনশন (খুবই সুবিধাজনক)।
