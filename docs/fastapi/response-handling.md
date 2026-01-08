# Response Handling (রেসপন্স হ্যান্ডলিং)

API তৈরি করার সময় ক্লায়েন্টকে ডেটা পাঠানোর প্রক্রিয়াটি অত্যন্ত গুরুত্বপূর্ণ। FastAPI আমাদের রেসপন্স ডেটা ফিল্টার করা, স্ট্যাটাস কোড পরিবর্তন করা এবং এরর হ্যান্ডেল করার জন্য শক্তিশালী ফিচার দেয়।

---

## ১. Response Model: ডেটা সিকিউরিটি এবং ফিল্টারিং

অনেক সময় আমাদের ডেটাবেসে এমন কিছু তথ্য থাকে (যেমন: পাসওয়ার্ড, ইন্টারনাল আইডি) যা আমরা ক্লায়েন্টকে পাঠাতে চাই না। এজন্য আমরা **Response Model** ব্যবহার করি।

```python
from pydantic import BaseModel, EmailStr
from fastapi import FastAPI

app = FastAPI()

class UserIn(BaseModel): # যা ইউজার থেকে নিচ্ছি
    username: str
    password: str
    email: EmailStr

class UserOut(BaseModel): # যা আমরা ক্লায়েন্টকে ফেরত দেবো
    username: str
    email: EmailStr

@app.post("/user/", response_model=UserOut)
async def create_user(user: UserIn):
    # এখানে পাসওয়ার্ড থাকলেও, response_model এর কারণে ক্লায়েন্ট শুধু username এবং email পাবে
    return user
```

### কেন এটি গুরুত্বপূর্ণ?
1. **Data Masking:** সেন্সিটিভ ডেটা অটোমেটিক ফিল্টার হয়ে যায়।
2. **Validation:** পাঠানোর আগে FastAPI চেক করে ডেটা সঠিক ফরম্যাটে আছে কিনা।
3. **Documentation:** Swagger UI-তে ইউজার দেখতে পায় সে রেসপন্সে কী পাবে।

---

## ২. Path Operation Decorator এর মাধ্যমে status code সেট করা

HTTP Status Codes ক্লায়েন্টকে বলে রিকোয়েস্টটি সফল হয়েছে কিনা। যেমন: সফলভাবে কিছু তৈরি হলে `201 Created` পাঠানো উচিত।

```python
from fastapi import status

@app.post("/items/", status_code=status.HTTP_201_CREATED)
async def create_item(name: str):
    return {"name": name}
```

### কমন স্ট্যাটাস কোডসমূহ:
- `200 OK`: সাধারণ সাফল্য।
- `201 Created`: নতুন কিছু তৈরি হলে।
- `204 No Content`: সফল হয়েছে কিন্তু কোনো ডেটা ফেরত দেয়ার নেই।
- `400 Bad Request`: ক্লায়েন্টের পাঠানো ডেটায় ভুল থাকলে।
- `401 Unauthorized`: লগইন করা না থাকলে।
- `403 Forbidden`: পারমিশন না থাকলে।
- `404 Not Found`: রিসোর্স খুঁজে না পেলে।

---

## ৩. `HTTPException` ব্যবহার করে error response পাঠানো

যখন কোনো এরর হয় (যেমন: ইউজার খুঁজে পাওয়া যায়নি), তখন আমাদের একটি নির্দিষ্ট এরর মেসেজ এবং স্ট্যাটাস কোড ফেরত দিতে হয়।

```python
from fastapi import HTTPException, status

items = {"foo": "The Foo Wrestler"}

@app.get("/items/{item_id}")
async def read_item(item_id: str):
    if item_id not in items:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Item not found",
            headers={"X-Error": "There goes my error"} # Optional custom headers
        )
    return {"item": items[item_id]}
```

---

## ৪. Custom Response Message Formatting

সব সময় আমরা শুধু ডেটা পাঠাই না, অনেক সময় একটি স্ট্যান্ডার্ড ফরম্যাট বজায় রাখতে চাই (যেমন: `{"status": "success", "data": ...}`)।

```python
from fastapi.responses import JSONResponse

@app.get("/custom-response/")
async def custom():
    return JSONResponse(
        status_code=200,
        content={
            "status": "success",
            "message": "Custom message here",
            "data": {"id": 1, "name": "Deep Dive"}
        }
    )
```

> [!NOTE]
> `JSONResponse` ব্যবহার করলে আপনি সরাসরি স্ট্যাটাস কোড এবং কন্টেন্ট কন্ট্রোল করতে পারেন, তবে এক্ষেত্রে `response_model` এর অটোমেটিক ভ্যালিডেশন কাজ করবে না।

---

## ৫. Response Model - Advanced (Exclude/Include)

মাঝে মাঝে একই মডেল ব্যবহার করে কিছু ফিল্ড বাদ দিতে হতে পারে।

```python
@app.get("/items/{item_id}", response_model=Item, response_model_exclude_unset=True)
async def read_item(item_id: str):
    # response_model_exclude_unset=True মানে হলো 
    # যে ফিল্ডগুলোর ভ্যালু সেট করা হয়নি সেগুলো রেসপন্সে যাবে না
    return items[item_id]
```

অন্যান্য অপশন:
- `response_model_exclude={"password"}`: নির্দিষ্ট ফিল্ড বাদ দেয়া।
- `response_model_include={"username", "email"}`: শুধু নির্দিষ্ট ফিল্ড রাখা।

---

## ৬. Practice Exercises (অনুশীলন)

১. একটি `Product` স্কিমা তৈরি করুন যেখানে `cost_price` এবং `sale_price` থাকবে। কিন্তু ক্লায়েন্ট যেন শুধু `sale_price` দেখতে পায় এমনভাবে রাউটটি ডিজাইন করুন।
২. একটি রাউট তৈরি করুন যা ইউজারের পাঠানো আইডি যদি ১০০-র বেশি হয় তবে `400 Bad Request` এবং "Invalid ID range" মেসেজ রিটার্ন করবে।
৩. `HTTPException` ব্যবহার করে একটি সিম্পল লগইন রাউট (শুধু চেক করার জন্য) তৈরি করেন যেখানে পাসওয়ার্ড ভুল হলে `401 Unauthorized` ফেরত দেবে।

---

## ৭. Summary & Best Practices

1. **Always use response_model:** সিকিউরিটি নিশ্চিত করতে আউটপুট মডেল অবশ্যই ডিফাইন করুন।
2. **Use status constants:** `201` এর বদলে `status.HTTP_201_CREATED` ব্যবহার করা ভালো কোডিং প্র্যাকটিস।
3. **Descriptive error messages:** `detail` প্যারামিটারে পরিষ্কার মেসেজ দিন যাতে ক্লায়েন্ট সহজে বুঝতে পারে সমস্যা কী।

---

::: tip পরবর্তী ধাপ
রেসপন্স হ্যান্ডলিং শেখার মাধ্যমে আপনি এখন আপনার API-কে আরও প্রফেশনাল এবং সিকিউর করতে পেরেছেন। পরবর্তী চ্যাপ্টারে আমরা শিখবো **Request Data Deep Dive** - কীভাবে ফর্ম ডেটা এবং ফাইল আপলোড হ্যান্ডেল করতে হয়।
:::
