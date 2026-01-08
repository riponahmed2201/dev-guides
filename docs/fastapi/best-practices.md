# API Best Practices (এপিআই বেস্ট প্রাক্টিস)

সঠিক ভাবে এপিআই ডিজাইন করা একটি আর্ট। শুধু এন্ডপয়েন্ট তৈরি করলেই হয় না, বরং সেটিকে এমনভাবে সাজাতে হয় যেন তা ডেভেলপারদের কাছে পরিষ্কার, সিকিউর এবং স্কেলেবল হয়।

---

## ১. RESTful API Design Rules

RESTful এপিআই-এর কিছু অলিখিত নিয়ম আছে যা মেনে চলা উচিত:

- **Nouns (বিশেষ্য) ব্যবহার করুন:** ইউআরএল-এ ভার্ব (যেমন: `/getUsers`) ব্যবহার না করে নাউন (যেমন: `/users`) ব্যবহার করুন।
- **Plural (বহুবচন) ব্যবহার করুন:** `/user/1` এর বদলে `/users/1` ব্যবহার করা স্ট্যান্ডার্ড।
- **HTTP Methods:** সঠিক কাজের জন্য সঠিক মেথড ব্যবহার করুন:
  - `GET`: ডাটা রিড করার জন্য।
  - `POST`: নতুন ডাটা তৈরি করার জন্য।
  - `PUT/PATCH`: ডাটা আপডেট করার জন্য।
  - `DELETE`: ডাটা মুছে ফেলার জন্য।

---

## ২. API Versioning (v1, v2)

আপনার এপিআই-এ বড় কোনো পরিবর্তন আসলে আগের ইউজাররা যেন সমস্যায় না পড়ে, সেজন্য ভার্সন ব্যবহার করা জরুরি।

```python
from fastapi import FastAPI, APIRouter

app = FastAPI()

# ভার্সন ১ এর রাউটার
v1_router = APIRouter(prefix="/v1")
@v1_router.get("/items")
async def get_items_v1():
    return [{"item": "old_data"}]

# ভার্সন ২ এর রাউটার
v2_router = APIRouter(prefix="/v2")
@v2_router.get("/items")
async def get_items_v2():
    return [{"item": "new_format_data", "version": 2}]

app.include_router(v1_router)
app.include_router(v2_router)
```

---

## ৩. Pagination (limit, offset)

যখন আপনার ডাটাবেসে হাজার হাজার ডাটা থাকে, তখন সব ডাটা একসাথে পাঠানো উচিত নয়। এতে পারফরম্যান্স কমে যায়। একে সমাধান করতে **Pagination** ব্যবহার করা হয়।

```python
from typing import List
from fastapi import Query

@app.get("/items/")
async def read_items(
    skip: int = Query(0, ge=0), # কতগুলো ডাটা স্কিপ করবে
    limit: int = Query(10, le=100) # কতগুলো ডাটা দেখাবে
):
    # ডাটাবেস কোয়েরি হবে: SELECT * FROM items OFFSET skip LIMIT limit
    return {"skip": skip, "limit": limit, "items": []}
```

---

## ৪. Filtering & Sorting Logic

ইউজার যেন তাদের পছন্দমতো ডাটা ফিল্টার এবং শর্ট করতে পারে তার ব্যবস্থা রাখা প্রয়োজন।

```python
@app.get("/products/")
async def filter_products(
    category: str | None = None,
    sort_by: str = "price", # ডিফল্ট শর্টিং ফিল্ড
    order: str = "asc"      # ডিফল্ট অর্ডার
):
    query = "SELECT * FROM products"
    if category:
        query += f" WHERE category = {category}"
    
    query += f" ORDER BY {sort_by} {order}"
    
    return {"message": f"Executing: {query}"}
```

---

## ৫. Practice Exercises (অনুশীলন)

১. একটি ইউজার এপিআই ডিজাইন করুন যেখানে `v1` এবং `v2` ভার্সন থাকবে। `v2`-তে ইউজারের নাম এবং ইমেইল আলাদা অবজেক্টে থাকবে।
২. একটি প্রোডাক্ট লিস্ট এপিআই তৈরি করুন যেখানে `offset` এবং `limit` প্যারামিটার কাজ করবে।
৩. সার্চ ফাংশনালিটি যোগ করুন যেখানে ইউজার এন্ডপয়েন্টে `q=search_term` দিয়ে সার্চ করতে পারবে।

---

## ৬. Best Practices Summary

1. **Use JSON:** রেসপন্স সব সময় JSON ফরম্যাটে দিন।
2. **Clear Error Messages:** শুধু `404` না বলে কেন এরর হয়েছে তার পরিষ্কার মেসেজ দিন।
3. **Handle Trailing Slashes:** `/users` এবং `/users/` যেন একই কাজ করে।
4. **Use HTTPS:** প্রোডাকশনে সব সময় এসএসএল (SSL) ব্যবহার নিশ্চিত করুন।
5. **Rate Limiting:** ইউজারের রিকোয়েস্টের সংখ্যা লিমিট করুন যেন কেউ সার্ভার ডাউন করতে না পারে।

---

::: tip অভিনন্দন!
আপনি এখন এপিআই ডিজাইনের প্রো লেভেলের নিয়মগুলো জানেন। আপনার তৈরি করা এপিআই এখন অনেক বেশি প্রফেশনাল এবং স্ট্যান্ডার্ড।
:::
