# Working with APIs

আধুনিক সফটওয়্যারগুলো একে অপরের সাথে ডেটা শেয়ার করার জন্য **APIs (Application Programming Interfaces)** ব্যবহার করে। পাইথনে এপিআই থেকে ডেটা আনা বা পাঠানো অনেক সহজ।

---

## ১. REST APIs এবং JSON

বেশিরভাগ এপিআই **REST (Representational State Transfer)** আর্কিটেকচার মেনে চলে এবং **JSON** ফরমেটে ডেটা আদান-প্রদান করে।

---

## ২. Requests Library (Standard)

পাইথনে এইচটিটিপি (HTTP) রিকোয়েস্ট পাঠানোর জন্য সবচেয়ে জনপ্রিয় লাইব্রেরি হলো **`requests`**।

### Installation:
```bash
pip install requests
```

### GET Request:
```python
import requests

response = requests.get("https://api.github.com/users/ripon")
if response.status_code == 200:
    data = response.json() # JSON থেকে ডিকশনারি করা
    print(data["name"])
```

### POST Request:
```python
payload = {"title": "Hello", "body": "Python", "userId": 1}
response = requests.post("https://jsonplaceholder.typicode.com/posts", json=payload)
print(response.status_code) # 201 Created
```

---

## ৩. Authentication (অথেন্টিকেশন)

অধিকাংশ প্রফেশনাল এপিআই ব্যবহার করার সময় আপনাকে একটি সিক্রেট কী বা টোকেন পাঠাতে হবে।

```python
headers = {"Authorization": "Bearer YOUR_TOKEN"}
response = requests.get(url, headers=headers)
```

---

## ৪. Fast APIs (Backend Development)

যদি আপনি নিজেই একটি এপিআই তৈরি করতে চান, তবে বর্তমানে **FastAPI** সবচেয়ে আধুনিক এবং দ্রুততম ফ্রেমওয়ার্ক। এটি অটোমেটিক টাইপ চেকিং এবং স্পিড এর জন্য জনপ্রিয়।

---

## ৫. API Rate Limiting

বড় বড় সাইটগুলো আপনাকে মিনিটে নির্দিষ্ট সংখ্যক রিকোয়েস্টের বেশি পাঠাতে দিবে না। এটি হ্যান্ডেল করার জন্য আপনার কোডে `time.sleep()` বা কোনো প্রফেশনাল লাইব্রেরি ব্যবহার করা উচিত যাতে আপনার এপিআই ব্লক না হয়ে যায়।

---

::: tip
এপিআই নিয়ে কাজ করার সময় সবসময় এরর হ্যান্ডলিং (`try/except`) ব্যবহার করুন কারণ নেটওয়ার্ক যেকোনো সময় এরর দিতে পারে।
:::
