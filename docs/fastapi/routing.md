# Routing & Parameters (রাউটিং এবং প্যারামিটার)

FastAPI-তে রাউটিং হলো আপনার API-এর ট্রাফিক কন্ট্রোল সিস্টেম। এটি নির্ধারণ করে কোন URL-এ গেলে কোন ফাংশনটি কাজ করবে এবং কী ধরনের ডেটা রিসিভ করবে।

---

## ১. Path Operations Basics

প্রতিটি রাউট মূলত দুটি অংশের সমন্বয়ে গঠিত:
1. **Path (URL):** যেমন `/users`, `/items/123`
2. **Operation (HTTP Method):** GET, POST, PUT, DELETE ইত্যাদি।

```python
from fastapi import FastAPI

app = FastAPI()

@app.get("/items") # Path: /items, Operation: GET
async def read_items():
    return [{"item_name": "Laptop"}, {"item_name": "Mobile"}]

@app.post("/items") # Path: /items, Operation: POST
async def create_item():
    return {"message": "Item created successfully"}
```

---

## ২. Path Parameters (ডায়নামিক রাউটিং)

কখনো কখনো আমাদের URL-এর মধ্যেই কিছু ডেটা পাঠাতে হয়, যেমন কোনো ইউজারের ID বা প্রোজেক্টের নাম। একে বলা হয় **Path Parameter**।

```python
@app.get("/users/{user_id}")
async def read_user(user_id: int):
    return {"user_id": user_id}
```

### কেন এটি গুরুত্বপূর্ণ?
1. **Type Hinting:** `user_id: int` দেয়া হয়েছে। আপনি যদি ব্রাউজারে `http://127.0.0.1:8000/users/foo` লিখেন, FastAPI আপনাকে একটি সুন্দর Error মেসেজ দেবে যে এটি `integer` হতে হবে।
2. **Automatic Documentation:** Swagger UI অটোমেটিক বুঝে নেবে যে এখানে একটি ID দিতে হবে।

---

## ৩. Query Parameters

যখন আমরা URL-এর শেষে `?` দিয়ে কিছু ডেটা পাঠাই (যেমন: `/items?skip=0&limit=10`), তখন সেগুলোকে বলা হয় **Query Parameters**। এগুলো সাধারণত ফিল্টারিং বা সার্চিংয়ের জন্য ব্যবহার হয়।

```python
@app.get("/items/")
async def read_items(skip: int = 0, limit: int = 10):
    return {"skip": skip, "limit": limit}
```

### প্রধান বৈশিষ্ট্য:
- এগুলোর জন্য ডেকোরেটরে (`@app.get`) কোনো নির্দিষ্ট পাথ দিতে হয় না।
- ফাংশনের প্যারামিটার হিসেবে ডিফাইন করলেই FastAPI বুঝে নেয় এগুলো কুয়েরি প্যারামিটার।
- **Default Values:** `skip: int = 0` মানে হলো ইউজার যদি কিছু না পাঠিয়ে শুধু `/items/` এ যায়, তবে ভ্যালু ০ হিসেবে গণ্য হবে।

---

## ৪. Path vs Query Parameters: কখন কোনটি?

| পর্যারামিটার | Path Parameter | Query Parameter |
| :--- | :--- | :--- |
| **অবস্থান** | URL-এর মাঝখানে বা শেষে থাকে | URL-এর শেষে `?` এর পরে থাকে |
| **ব্যবহার** | নির্দিষ্ট কোনো রিসোর্স আইডেন্টিফাই করতে (ID) | ফিল্টারিং, সার্চিং বা অপশনাল ডেটার জন্য |
| **উদাহরণ** | `/users/ripon` | `/users?search=ripon` |
| **বাধ্যবাধকতা** | সাধারণত বাধ্যতামূলক (Required) | সাধারণত ঐচ্ছিক (Optional) |

---

## ৫. Multiple Parameters (একত্রে ব্যবহার)

আপনি একইসাথে Path এবং Query প্যারামিটার ব্যবহার করতে পারেন।

```python
@app.get("/users/{user_id}/items/{item_slug}")
async def read_user_item(
    user_id: int, 
    item_slug: str, 
    q: str | None = None, # Python 3.10+ syntax for Optional
    short: bool = False
):
    item = {"item_slug": item_slug, "owner_id": user_id}
    if q:
        item.update({"query": q})
    if not short:
        item.update({"description": "This is a detailed description of the item."})
    return item
```

---

## ৬. Parameter Validation (অ্যাডভান্সড ভ্যালিডেশন)

FastAPI আমাদের প্যারামিটারের উপর অতিরিক্ত কন্ট্রোল দেয় `Path` এবং `Query` ক্লাস ব্যবহার করে।

### ১. Query Validation:
ইউজারের রিকোয়েস্টে প্যারামিটারের লেন্থ বা মান লিমিট করা।

```python
from fastapi import Query

@app.get("/search")
async def search_items(
    q: str | None = Query(
        default=None, 
        min_length=3, 
        max_length=50, 
        pattern="^fixedquery$", # Regex validation
        title="Query string",
        description="Search string for items"
    )
):
    return {"query": q}
```

### ২. Path Validation:
ID-র মান কতর বেশি বা কম হবে তাও চেক করা যায়।

```python
from fastapi import Path

@app.get("/items/{item_id}")
async def read_item(
    item_id: int = Path(title="The ID of the item to get", ge=1, le=1000)
):
    # ge=1 মানে Greater than or Equal to 1
    # le=1000 মানে Less than or Equal to 1000
    return {"item_id": item_id}
```

---

## ৭. Best Practices for Routing

1. **Plural Naming:** এন্ডপয়েন্টগুলোর নাম বহুবচনে রাখার চেষ্টা করুন (যেমন: `/users` এর বদলে `/user` না)।
2. **Kebab-case in URLs:** প্রোফেশনাল বিশ্বে URL-এ আন্ডারস্কোরের বদলে হাইফেন ব্যবহার করা ভালো (যেমন: `/user-profiles`)।
3. **HTTP Methods মানুন:** ডেটা পেতে GET, তৈরি করতে POST, আপডেট করতে PUT, এবং ডিলিট করতে DELETE ব্যবহার করুন।
4. **Description যোগ করুন:** প্যারামিটারে description যোগ করলে ভবিষ্যতে Swagger দেখে বুঝতে সুবিধা হয়।

---

## ৮. Practice Exercises (অনুশীলন)

১. একটি রাউট তৈরি করুন `/calculate/{num1}/{num2}` যা দুইটা সংখ্যার যোগফল রিটার্ন করবে (Path Parameters ব্যবহার করুন)।
২. একটি সার্চ রাউট তৈরি করুন `/blogs?tag=python&author=ripon` যেখানে দুটি কুয়েরি প্যারামিটার থাকবে এবং কুয়েরি প্যারামিটার দুটো ঐচ্ছিক হবে।
৩. একটি রাউট তৈরি করুন `/check/{id}` যেখানে ID অবশ্যই ১ থেকে ১০০-র মধ্যে হতে হবে (Path Validation ব্যবহার করুন)।

---

::: tip পরবর্তী ধাপ
রাউটিং এবং প্যারামিটার শেখার মাধ্যমে আপনি এখন যেকোনো ডায়নামিক URL হ্যান্ডেল করতে সক্ষম। পরবর্তী চ্যাপ্টারে আমরা শিখবো **Data Validation with Pydantic** - কীভাবে জটিল ডেটা স্ট্রাকচার ভ্যালিডেট করতে হয়।
:::
