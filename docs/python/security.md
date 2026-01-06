# Security (সিকিউরিটি)

একজন এক্সপার্ট ডেভেলপারকে অবশ্যই সিকিউরিটি নিয়ে ভাবতে হয়। পাইথনে ডাটা ইনক্রিপশন, পাসওয়ার্ড হ্যাশিং এবং ভালনারেবিলিটি (Vulnerability) ঠেকানোর জন্য বিভিন্ন টুলস আছে।

---

## ১. Password Hashing (পাসওয়ার্ড হ্যাশিং)

পাসওয়ার্ড কখনো সরাসরি ডাটাবেসে সেভ করা উচিত নয়। এর বদলে **Hashing** ব্যবহার করা হয়। এর জনপ্রিয় লাইব্রেরি হলো **`bcrypt`**।

```python
import bcrypt

# পাসওয়ার্ড হ্যাশ করা
password = b"my_super_secret_pwd"
hashed = bcrypt.hashpw(password, bcrypt.gensalt())

# পাসওয়ার্ড চেক করা
user_input = b"my_super_secret_pwd"
if bcrypt.checkpw(user_input, hashed):
    print("পাসওয়ার্ড মিলেছে!")
```

---

## ২. Data Encryption (Cryptography)

ডাটা এনক্রিপ্ট করে সিকিউর রাখার জন্য `cryptography` লাইব্রেরি ব্যবহার করা হয়।

```python
from cryptography.fernet import Fernet

key = Fernet.generate_key()
f = Fernet(key)
token = f.encrypt(b"Top Secret Data")
print(token) # এনক্রিপ্টেড ডাটা

# ডিক্রিপ্ট করা
print(f.decrypt(token))
```

---

## ৩. Environment Variables

কখনোই সিক্রেট কী বা ডাটাবেস পাসওয়ার্ড হার্ডকোড (Hardcode) করবেন না। এর বদলে `.env` ফাইল এবং `python-dotenv` প্যাকেজ ব্যবহার করুন।

```python
import os
from dotenv import load_dotenv

load_dotenv()
API_KEY = os.getenv("API_KEY")
```

---

## ৪. Common Vulnerabilities

- **SQL Injection**: সবসময় প্যারামিটারাইজড কুয়েরি (Parameterized Query) বা ORM ব্যবহার করুন।
- **Cross-Site Scripting (XSS)**: ইউজার ইনপুট সবসময় স্যানিটাইজ (Sanitize) করুন।
- **Insecure Deserialization**: `pickle` মডিউল ব্যবহার করার সময় সতর্ক থাকুন, কারণ এটি ম্যালিশিয়াস কোড রান করতে পারে।

---

## ৫. Bandit (Security Auditing)

আপনার কোডে কোনো সিকিউরিটি লুপহোল আছে কি না তা অটোমেটিক চেক করার জন্য **Bandit** টুলটি ব্যবহার করতে পারেন।

```bash
pip install bandit
bandit -r my_project/
```

---

::: tip
সিকিউরিটি কোনো ফিচার নয়, এটি একটি অভ্যাস। কোড লেখার সময় প্রতিটি ইনপুটকে সন্দেহ করা এবং বেস্ট প্র্যাকটিস মেনে চলা একজন প্রফেশনাল ডেভেলপারের প্রধান গুণ।
:::
