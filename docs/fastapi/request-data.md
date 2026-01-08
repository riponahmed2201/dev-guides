# Request Data Deep Dive (রিকোয়েস্ট ডেটা)

একটি চমৎকার API তৈরি করার জন্য ক্লায়েন্ট থেকে বিভিন্নভাবে ডেটা রিসিভ করার ক্ষমতা থাকতে হয়। FastAPI আমাদের JSON, Form ডাটা, ফাইল আপলোড, এবং রিকোয়েস্ট হেডার হ্যান্ডেল করার সহজ ও আধুনিক উপায় দেয়।

---

## ১. JSON Request Body (প্রফেশনাল ডেটা রিসিভ)

সবচেয়ে কমন পদ্ধতি হলো JSON পেলোড পাঠানো। আমরা ইতিমধ্যে Pydantic চ্যাপ্টারে এটি বিস্তারিত দেখেছি।

```python
from pydantic import BaseModel
from fastapi import FastAPI

app = FastAPI()

class Product(BaseModel):
    name: str
    price: float
    is_offer: bool | None = None

@app.post("/products/")
async def create_product(product: Product):
    return product
```

---

## ২. Form Data এবং URL-encoded Data

কখনো কখনো আমাদের HTML ফর্ম থেকে ডেটা রিসিভ করতে হয়। এজন্য আমাদের `python-multipart` লাইব্রেরিটি ইন্সটল থাকতে হবে।
`pip install python-multipart`

```python
from fastapi import Form

@app.post("/login/")
async def login(username: str = Form(...), password: str = Form(...)):
    return {"username": username}
```

> [!IMPORTANT]
> আপনি একই রাউটে JSON Body এবং Form Data একসাথে রিসিভ করতে পারবেন না। তবে একই রিকোয়েস্টে একাধিক `Form` প্যারামিটার থাকতে পারে।

---

## ৩. File Uploads (File এবং UploadFile)

FastAPI-তে ফাইল আপলোড করার জন্য দুটি ক্লাস আছে:

### ৩.১. `File` (ছোট ফাইলের জন্য)
এটি ফাইলের সম্পূর্ণ কন্টেট মেমোরিতে (RAM) লোড করে। ছোট ফাইলের জন্য এটি দ্রুত।

```python
from fastapi import File, UploadFile

@app.post("/files/")
async def create_file(file: bytes = File(...)):
    return {"file_size": len(file)}
```

### ৩.২. `UploadFile` (বড় ফাইল বা রিয়েল-লাইফ ব্যবহারের জন্য)
এটি মেমোরি ইন-এপিশিয়েন্ট নয়, কারণ এটি একটি টেম্পোরারি ফাইলে ডেটা রাখে। এতে আপনি ফাইলের মেটাডেটা (নাম, টাইপ) সহজে পেতে পারেন।

```python
@app.post("/uploadfile/")
async def create_upload_file(file: UploadFile):
    return {
        "filename": file.filename,
        "content_type": file.content_type,
        "size": file.size # Pydantic V2 supports .size
    }
```

**সুবিধা:**
- এটি একটি file-like object, তাই আপনি `file.read()`, `file.write()`, `file.seek()` মেথডগুলো ব্যবহার করতে পারবেন।

---

## ৪. Headers এবং Cookies এর মাধ্যমে ডেটা আদান-প্রদান

অনেক সময় সিকিউরিটি বা সেশন ম্যানেজমেন্টের জন্য আমাদের হেডার বা কুকি চেক করতে হয়।

### ৪.১. Request Headers:
```python
from fastapi import Header

@app.get("/items/")
async def read_items(user_agent: str | None = Header(default=None)):
    return {"User-Agent": user_agent}
```
> [!TIP]
> FastAPI অটোমেটিক হাইফেনকে আন্ডারস্কোরে কনভার্ট করে (যেমন: `User-Agent` হেডারটি `user_agent` ভেরিয়েবলে আসবে)।

### ৪.২. Cookies:
```python
from fastapi import Cookie

@app.get("/items-cookie/")
async def read_items_cookie(ads_id: str | None = Cookie(default=None)):
    return {"ads_id": ads_id}
```

---

## ৫. Multiple Files এবং Form এক সাথে

বাস্তব প্রজেক্টে অনেক সময় আমাদের ইউজারের নাম এবং তার প্রোফাইল পিকচার একসাথে রিসিভ করতে হয়।

```python
@app.post("/user-registration/")
async def register(
    username: str = Form(...),
    profile_pic: UploadFile = File(...)
):
    return {
        "username": username,
        "file_name": profile_pic.filename
    }
```

---

## ৬. Practice Exercises (অনুশীলন)

১. একটি রাউট তৈরি করুন `/upload-document/` যা একটি PDF ফাইল আপলোড নেবে এবং ফাইলের নাম ও সাইজ রিটার্ন করবে।
২. একটি সার্চ রাউট তৈরি করুন যা ইউজারের পাঠানো `X-Token` হেডার রিসিভ করবে এবং চেক করবে টোকেনটি "secret-token" কিনা।
৩. একটি কন্টাক্ট ফর্ম তৈরি করুন যা `name`, `email`, এবং একটি `message` রিসিভ করবে Form ডাটা হিসেবে।

---

## ৭. Best Practices

1. **Use UploadFile for safety:** বড় ফাইলের ক্ষেত্রে মেমোরি এরর এড়াতে সবসময় `UploadFile` ব্যবহার করুন।
2. **Security Headers:** সেন্সিটিভ টোকেনের জন্য হেডার ব্যবহার করুন, ইউআরএল প্যারামিটার নয়।
3. **Pydantic for JSON:** সাধারণ ডেটা আদান-প্রদানের জন্য সবসময় JSON Body এবং Pydantic ব্যবহার করুন।

---

::: tip পরবর্তী ধাপ
কংগ্রাচুলেশনস! আপনি ফাউন্ডেশন লেভেলের সব চ্যাপ্টার সফলভাবে সম্পন্ন করেছেন। পরবর্তী লেভেলে আমরা শিখবো **Level 2: Intermediate**, যেখানে আমাদের প্রথম টপিক হবে **FastAPI-র সবচেয়ে শক্তিশালী ফিচার "Dependency Injection"**।
:::
