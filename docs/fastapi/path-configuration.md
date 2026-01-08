# Path Operations Configuration (পাথ অপারেশন কনফিগারেশন)

আপনার API-কে আরও প্রফেশনাল এবং ইউজার-ফ্রেন্ডলি করার জন্য এর ডকুমেন্টেশন কাস্টমাইজ করা প্রয়োজন। FastAPI আমাদের OpenAPI (Swagger) ডকুমেন্টেশন সরাসরি কোড থেকেই কনফিগার করার সুবিধা দেয়।

---

## ১. OpenAPI (Swagger) ডকুমেন্টেশন কাস্টমাইজ করা

আমরা যখন `@app.get()` বা অন্যান্য ডেকোরেটর ব্যবহার করি, তখন আমরা সেখানে কিছু প্যারামিটার পাস করে ডকুমেন্টেশন সুন্দর করতে পারি।

### ১.১. Tags (গ্রুপ করা)
যদি আপনার অনেকগুলো রাউট থাকে, তবে সেগুলোকে ক্যাটাগরি অনুযায়ী গ্রুপ করা ভালো।

```python
@app.get("/users/", tags=["Users"])
async def get_users():
    return [{"username": "ripon"}]

@app.get("/items/", tags=["Items"])
async def get_items():
    return [{"item_name": "Portal Gun"}]
```
**আউটপুট:** Swagger UI-তে ইউজাররা "Users" এবং "Items" নামে আলাদা আলাদা সেকশন দেখতে পাবে।

### ১.২. Summary এবং Description
রাউটের কাজ কী তা সংক্ষেপে এবং বিস্তারিতভাবে বোঝানোর জন্য এগুলো ব্যবহার করা হয়।

```python
@app.post(
    "/items/",
    tags=["Items"],
    summary="Create a new item",
    description="Create an item with all the information: name, description, price, and tax."
)
async def create_item(item: Item):
    return item
```

---

## ২. Deprecating Endpoints (পুরানো API রিটায়ার করা)

কখনো কখনো আমাদের একটি রাউট বন্ধ করে নতুন রাউট চালু করতে হয়। কিন্তু হুট করে বন্ধ না করে আমরা সেটিকে `deprecated` হিসেবে মার্ক করতে পারি।

```python
@app.get("/old-items/", tags=["Items"], deprecated=True)
async def read_old_items():
    return [{"item_name": "Old Portal Gun"}]
```
**আউটপুট:** Swagger UI-তে এটি একটি ধূসর বা স্ট্রাইক-থ্রু (strike-through) স্টাইলে দেখাবে, যা বুঝিয়ে দেবে এটি আর ব্যবহার করা উচিত নয়।

---

## ৩. Response Description এবং Operation ID

### ৩.১. `response_description`
রেসপন্স হিসেবে কী পাওয়া যাবে তার বর্ণনা দিতে এটি ব্যবহার করা হয়।

```python
@app.get("/items/{item_id}", response_description="The specific item requested by ID")
async def read_item(item_id: str):
    return {"item_id": item_id}
```

### ৩.২. `operation_id`
এটি মূলত অ্যাডভান্সড কাজের জন্য ব্যবহৃত হয়। যদি আপনি আপনার API-র জন্য কোড জেনারেট করতে চান (যেমন: TypeScript Client জেনারেশন), তবে একটি ইউনিক `operation_id` দিলে আপনার জেনারেটেড কোডের ফাংশনের নাম সুন্দর হবে।

```python
@app.get("/items/", operation_id="get_all_available_items")
async def read_items():
    return [{"name": "Item 1"}]
```

---

## ৪. Docstrings এর মাধ্যমে Description লেখা

ডেকোরেটরে `description` প্যারামিটার না লিখে আপনি সরাসরি ফাংশনের ভেতরে **Docstring** ব্যবহার করেও সুন্দর ডকুমেন্টেশন লিখতে পারেন। এটি মাল্টি-লাইন বা বড় বর্ণনার জন্য সেরা।

```python
@app.post("/items/", tags=["Items"])
async def create_item(item: Item):
    """
    Create an item with all the information:

    - **name**: each item must have a name
    - **description**: a long description
    - **price**: required
    - **tax**: if the item doesn't have tax, you can omit this
    """
    return item
```
FastAPI অটোমেটিক এই ডকস্ট্রিংটি রেন্ডার করে Swagger-এ দেখাবে (Markdown সাপোর্টসহ)।

---

## ৫. Practice Exercises (অনুশীলন)

১. একটি `Items` রাউট তৈরি করুন যেখানে `tags=["Inventory"]` থাকবে এবং একটি মাল্টি-লাইন ডকস্ট্রিং থাকবে।
২. একটি পুরানো রাউটকে `deprecated=True` হিসেবে মার্ক করে দেখান।
৩. একটি রাউট তৈরি করুন যাতে `summary` এবং `response_description` উভয়ই থাকে।

---

## ৬. Best Practices

1. **Group with Tags:** প্রতিটি রাউটে অন্তত একটি ট্যাগ ব্যবহার করুন।
2. **Concise Summary:** সামারিটি ছোট এবং কাজের নাম অনুযায়ী রাখুন (যেমন: "Get all users")।
3. **Use Docstrings for Details:** রাউটের ভেতরে প্যারামিটার বা লজিক বোঝাতে ডকস্ট্রিং ব্যবহার করুন।
4. **Mark as Deprecated early:** রিটায়ার করার অন্তত এক ভার্সন আগে থেকেই ডেপ্রিকেটেড মার্ক করুন।

---

::: tip পরবর্তী ধাপ
পাথ কনফিগারেশন শেখার মাধ্যমে আপনার API ডকুমেন্টেশন এখন অনেক বেশি প্রফেশনাল। পরবর্তী চ্যাপ্টারে আমরা শিখবো FastAPI-র সবচেয়ে শক্তিশালী ফিচার: **Dependency Injection**।
:::
