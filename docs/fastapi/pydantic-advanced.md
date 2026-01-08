# Advanced Pydantic Patterns (অ্যাডভান্সড পাইড্যান্টিক প্যাটার্নস)

FastAPI-র ডেটা ভ্যালিডেশন মূলত Pydantic-এর ওপর নির্ভরশীল। ইন্টারমিডিয়েট লেভেলে আমরা বেসিক হ্যান্ডলিং দেখেছি, এবার আমরা দেখবো কীভাবে Pydantic-এর অ্যাডভান্সড ফিচারগুলো ব্যবহার করে আরও জটিল ডেটা লজিক ম্যানেজ করা যায়।

---

## ১. Custom Validators (`@field_validator`)

কখনো কখনো আমাদের এমন ভ্যালিডেশন দরকার হয় যা ডিফল্ট কোনো কন্সট্রেইন্ট (যেমন: `min_length` বা `regex`) দিয়ে করা সম্ভব নয়। এজন্য আমরা `@field_validator` ডেকোরেটর ব্যবহার করি।

```python
from pydantic import BaseModel, field_validator

class UserCreate(BaseModel):
    username: str
    password: str
    confirm_password: str

    @field_validator("username")
    @classmethod
    def username_must_contain_space(cls, v: str):
        if " " in v:
            raise ValueError("Username cannot contain spaces")
        return v.title() # আমরা চাইলে ভ্যালু ট্রান্সফর্মও করতে পারি

    @field_validator("confirm_password")
    @classmethod
    def passwords_match(cls, v: str, info):
        # 'info.data' থেকে অন্যান্য ফিল্ডের ভ্যালু এক্সেস করা যায়
        if "password" in info.data and v != info.data["password"]:
            raise ValueError("Passwords do not match")
        return v
```

---

## ২. Read vs Write Models (Inheritance)

বাস্তব প্রজেক্টে ডেটা পাঠানোর সময় (Create) এবং ডেটা দেখানোর সময় (Read) ফিল্ডগুলো আলাদা হয়। Pydantic Inheritance ব্যবহার করে আমরা এটি চমৎকার ভাবে করতে পারি।

```python
class UserBase(BaseModel):
    email: str
    username: str

class UserCreate(UserBase):
    password: str # শুধু ক্রিয়েট করার সময় পাসওয়ার্ড লাগবে

class UserRead(UserBase):
    id: int
    is_active: bool
    
    class ConfigDict:
        from_attributes = True # SQLAlchemy মডেল থেকে সরাসরি ডেটা নেয়ার জন্য
```

---

## ৩. Using `ConfigDict` (Pydantic V2)

Pydantic V2-তে `class Config` এর বদলে `ConfigDict` ব্যবহার করা হয়। এটি মডেলের বিহেভিয়ার কন্ট্রোল করতে সাহায্য করে।

```python
from pydantic import BaseModel, ConfigDict

class Item(BaseModel):
    model_config = ConfigDict(
        str_strip_whitespace=True, # সব স্ট্রিং থেকে অটোমেটিক স্পেস রিমুভ করবে
        extra="forbid",            # মডেলের বাইরের কোনো ফিল্ড পাঠালে এরর দেবে
        strict=True                # টাইপ চেক করার সময় কঠোর হবে (যেমন: "1" কে int ধরবে না)
    )
    name: str
    price: float
```

---

## ৪. Recursive Models (গাঠনিক জটিলতা)

যদি আমাদের এমন ডেটা থাকে যা নিজের ক্লাসেরই অন্য একটি অবজেক্টকে ধারণ করে (যেমন: একটি ফোল্ডারের ভেতর আরও ফোল্ডার), তবে একে Recursive Model বলে।

```python
from typing import List

class Category(BaseModel):
    name: str
    description: str | None = None
    sub_categories: List["Category"] = [] # নিজের ক্লাসের নাম স্ট্রিং হিসেবে দিন

# রিকার্সিভ রেফারেন্স আপডেট করা (V2 তে অনেক সময় অটো হয়ে যায়)
Category.model_rebuild()
```

---

## ৫. Practice Exercises (অনুশীলন)

১. একটি `Product` মডেল তৈরি করুন যেখানে `price` ফিল্ডটি অবশ্যই পজিটিভ হতে হবে (কাস্টম ভ্যালিডেটর ব্যবহার করে)।
২. User CRUD অপারেশন করার জন্য `UserBase`, `UserCreate`, এবং `UserRead` মডেলগুলো ইমপ্লিমেন্ট করুন।
৩. একটি `ConfigDict` তৈরি করুন যা ইনপুট হিসেবে আসা সব স্ট্রিংকে অটোমেটিক ছোটহাতের অক্ষরে (lowercase) কনভার্ট করবে।
৪. একটি `Comment` মডেল তৈরি করুন যা নিজের ভেতরে `replies` (অন্যান্য কমেন্ট) এর একটি লিস্ট রাখতে পারে।

---

## ৬. Best Practices

1. **Use Inheritance:** কমন ফিল্ডগুলো `BaseModel`-এ রাখুন এবং ক্রিয়েট/আপডেট/রিড করার জন্য সেগুলো ইনহেরিট করুন।
2. **Transform in Validators:** ভ্যালিডেটরে শুধু চেক না করে প্রয়োজন হলে ডেটা ক্লিনও করুন (যেমন: `.strip()`, `.lower()`)।
3. **Use from_attributes:** ORM (SQLAlchemy) এর সাথে কাজ করার সময় রেসপন্স মডেলে অবশ্যই `from_attributes = True` ব্যবহার করুন।

---

::: tip পরবর্তী ধাপ
অ্যাডভান্সড পাইড্যান্টিক প্যাটার্নস শেখার মাধ্যমে আপনার ডেটা ইঞ্জিনিয়ারিং স্কিল এখন অনেক উন্নত। পরবর্তী চ্যাপ্টারে আমরা শিখবো **FastAPI-তে প্রফেশনাল টেস্টিং (Pytest)**।
:::
