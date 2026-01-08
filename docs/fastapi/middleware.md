# Middleware & CORS (মিডলওয়্যার এবং কর্স)

FastAPI-তে **Middleware** হলো এমন একটি ফাংশন যা প্রতিটি রিকোয়েস্ট প্রসেস করার আগে এবং প্রতিটি রেসপন্স পাঠানোর পরে কাজ করে। এটি আপনার অ্যাপ্লিকেশনের একটি "সিকিউরিটি গার্ড" বা "ফিল্টার" হিসেবে কাজ করে।

---

## ১. CORS (Cross-Origin Resource Sharing)

যদি আপনার FastAPI সার্ভার একটি ডোমেনে থাকে (যেমন: `api.example.com`) এবং আপনার ফ্রন্টএন্ড (React/Vue) অন্য ডোমেনে থাকে (যেমন: `localhost:3000`), তবে ব্রাউজার সিকিউরিটির কারণে ফ্রন্টএন্ড থেকে এপিআই কল ব্লক করে দেবে। একে সমাধান করতেই **CORS** ব্যবহার করা হয়।

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# ১. কোন কোন ডোমেন থেকে রিকোয়েস্ট আসতে পারবে তার লিস্ট
origins = [
    "http://localhost:3000",
    "https://example.com",
    "https://www.example.com",
]

# ২. মিডলওয়্যার যোগ করা
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,            # নির্দিষ্ট ডোমেনগুলো অ্যালাউ করা
    allow_credentials=True,           # কুকিজ অ্যালাউ করা
    allow_methods=["*"],              # সব ধরনের মেথড (GET, POST, etc.) অ্যালাউ করা
    allow_headers=["*"],              # সব ধরনের হেডার অ্যালাউ করা
)
```

---

## ২. Custom Middlewares

কখনো কখনো আমাদের নিজেদের কোনো লজিক প্রতিটি রিকোয়েস্টে চালাতে হয়, যেমন: রিকোয়েস্টের প্রসেসিং টাইম মাপা।

```python
import time
from fastapi import Request

@app.middleware("http")
async def add_process_time_header(request: Request, call_next):
    # ১. রিকোয়েস্ট আসার সময় (শুরু)
    start_time = time.time()
    
    # ২. রিকোয়েস্টটিকে পরের ধাপে (রাউট/অন্য মিডলওয়্যার) পাঠানো
    response = await call_next(request)
    
    # ৩. রেসপন্স তৈরি হওয়ার পর (শেষ)
    process_time = time.time() - start_time
    
    # ৪. রেসপন্স হেডারে সময়টি যোগ করা
    response.headers["X-Process-Time"] = str(process_time)
    
    return response
```

---

## ৩. Trusted Host Middleware

এটি একটি সিকিউরিটি মিডলওয়্যার যা নিশ্চিত করে যে রিকোয়েস্টটি একটি অনুমোদিত `Host` হেডার থেকে আসছে কিনা (HTTP Host Header Attack প্রতিরোধ করতে)।

```python
from fastapi.middleware.trustedhost import TrustedHostMiddleware

app.add_middleware(
    TrustedHostMiddleware, 
    allowed_hosts=["example.com", "*.example.com", "localhost"]
)
```

---

## ৪. GZip Middleware

যদি আপনার এপিআই অনেক বড় ডেটা (JSON বা HTML) ফেরত দেয়, তবে সেই ডেটাটি কম্প্রেস (Compress) করে পাঠালে ব্যান্ডউইথ বাঁচে এবং গতি বাড়ে।

```python
from fastapi.middleware.gzip import GZipMiddleware

app.add_middleware(GZipMiddleware, minimum_size=1000) # ১০০০ বাইটের বেশি হলে কম্প্রেস হবে
```

---

## ৫. Practice Exercises (অনুশীলন)

১. একটি মিডলওয়্যার তৈরি করুন যা প্রতিটি রিকোয়েস্টের মেথড (GET/POST) এবং ইউআরএল টার্মিনালে প্রিন্ট করবে।
২. আপনার অ্যাপ্লিকেশনে CORS সেটআপ করুন যাতে শুধু আপনার লোকালহোস্টের নির্দিষ্ট পোর্ট থেকে ডেটা এক্সেস করা যায়।
৩. GZip মিডলওয়্যারটি যোগ করুন এবং কোনো বড় রেসপন্স পাঠিয়ে ব্রাউজারের `Network` ট্যাবে চেক করুন স্ট্যাটাস `Content-Encoding: gzip` আছে কিনা।

---

## ৬. Summary & Best Practices

1. **Be Specific with CORS:** প্রোডাকশনে `allow_origins=["*"]` না করে নির্দিষ্ট ডোমেনগুলোর নাম দিন।
2. **First in, Last out:** মিডলওয়্যারগুলো যে সিরিয়ালে যোগ করবেন, সেগুলো সেই অনুযায়ী কাজ করবে। সিকিউরিটি মিডলওয়্যারগুলো সাধারণত সবার আগে রাখা হয়।
3. **Avoid heavy logic in Middleware:** মিডলওয়্যারে খুব বেশি জটিল বা ধীর লজিক রাখবেন না, কারণ এটি প্রতিটি রিকোয়েস্টের গতি কমিয়ে দিতে পারে।

---

::: tip পরবর্তী ধাপ
মিডলওয়্যার এবং কর্স শেখার মাধ্যমে আপনার অ্যাপ্লিকেশন এখন নেটওয়ার্ক লেভেলে অনেক বেশি সিকিউর এবং অপ্টিমাইজড। পরবর্তী চ্যাপ্টারে আমরা শিখবো **Error Handling & Background Tasks** - কীভাবে প্রফেশনাল উপায়ে ব্যতিক্রমী পরিস্থিতিগুলো ম্যানেজ করবেন।
:::
