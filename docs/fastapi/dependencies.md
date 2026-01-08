# Dependency Injection (ডিপেন্ডেন্সি ইনজেকশন)

**Dependency Injection (DI)** হলো FastAPI-র সবচেয়ে শক্তিশালী এবং চমৎকার একটি ফিচার। এটি আপনার কোডকে মডুলার, টেস্টযোগ্য (testable) এবং পুনরায় ব্যবহারযোগ্য (reusable) করতে সাহায্য করে।

---

## ১. Dependency Injection (DI) এর কনসেপ্ট

সহজ কথায়, একটি ফাংশন বা রাউট চলার আগে যদি অন্য কোনো লজিক বা ভ্যালুর প্রয়োজন হয়, তবে সেই লজিকটিকে রাউটে "ইনজেক্ট" করাকেই ডিপেন্ডেন্সি ইনজেকশন বলে।

FastAPI-তে এটি করার জন্য `Depends` ক্লাস ব্যবহার করা হয়।

```python
from fastapi import Depends, FastAPI

app = FastAPI()

# একটি সিম্পল ডিপেন্ডেন্সি ফাংশন
async def common_parameters(q: str | None = None, skip: int = 0, limit: int = 100):
    return {"q": q, "skip": skip, "limit": limit}

@app.get("/items/")
async def read_items(commons: dict = Depends(common_parameters)):
    return commons

@app.get("/users/")
async def read_users(commons: dict = Depends(common_parameters)):
    return commons
```

### কেন এটি শ্রেষ্ঠ?
1. **Code Reuse:** একই লজিক (যেমন: ইউজার চেক বা পেজিনেশন) বারবার না লিখে এক জায়গায় লিখে সব রাউটে ব্যবহার করা যায়।
2. **Simplified Code:** রাউট ফাংশনগুলো ছোট এবং পরিষ্কার থাকে।
3. **Automatic Docs:** FastAPI ডিপেন্ডেন্সিগুলোকেও অটোমেটিক Swagger ডকুমেন্টেশনে যোগ করে দেয়।

---

## ২. Dependencies with parameters (reusable logic)

ডিপেন্ডেন্সি ফাংশনগুলো নিজেও অন্য প্যারামিটার নিতে পারে। এটি অত্যন্ত ফ্লেক্সিবল।

```python
def query_extractor(q: str | None = None):
    return q

def query_or_cookie_extractor(
    q: str = Depends(query_extractor), 
    last_query: str | None = Cookie(default=None)
):
    if not q:
        return last_query
    return q

@app.get("/items/")
async def read_query(query: str = Depends(query_or_cookie_extractor)):
    return {"query": query}
```

---

## ৩. Class-based dependencies

ফাংশনের বদলে আপনি ক্লাসকেও ডিপেন্ডেন্সি হিসেবে ব্যবহার করতে পারেন। এটি তখন আরও বেশি অবজেক্ট-ওরিয়েন্টেড সুবিধা দেয়।

```python
class CommonQueryParams:
    def __init__(self, q: str | None = None, skip: int = 0, limit: int = 100):
        self.q = q
        self.skip = skip
        self.limit = limit

@app.get("/items/")
async def read_items(commons: CommonQueryParams = Depends(CommonQueryParams)):
    return commons

# একটি শর্টকাট (FastAPI ক্লাস চিনতে পারলে শুধু Depends() দিলেও হয়)
@app.get("/users/")
async def read_users(commons: CommonQueryParams = Depends()):
    return commons
```

---

## ৪. Sub-dependencies (একের ভেতর অন্যটি)

একটি ডিপেন্ডেন্সি অন্য একটি ডিপেন্ডেন্সির ওপর নির্ভর করতে পারে। FastAPI এটি অটোমেটিকলি একটি "গাছ" বা Graph-এর মতো করে সলভ করে।

```python
def func_a():
    return "A"

def func_b(a: str = Depends(func_a)):
    return f"B depends on {a}"

@app.get("/complex/")
async def complex_route(result: str = Depends(func_b)):
    return {"result": result}
```

---

## ৫. `yield` এর মাধ্যমে Context Managers (Resource Setup/Cleanup)

এটি অত্যন্ত গুরুত্বপূর্ণ, বিশেষ করে ডাটাবেস কানেকশন বা ফাইল হ্যান্ডলিংয়ের জন্য। `yield` ব্যবহার করলে আপনি কোনো কাজ করার আগে কিছু সেটআপ এবং কাজ শেষ হওয়ার পর ক্লিনআপ করতে পারেন।

```python
async def get_db():
    db = DBSession() # ১. ডাটাবেস কানেকশন তৈরি
    try:
        yield db     # ২. এই কানেকশনটি রাউটকে দেয়া হলো
    finally:
        db.close()   # ৩. কাজ শেষ হওয়ার পর কানেকশনটি বন্ধ করা হলো
```

**ব্যবহার:**
```python
@app.get("/items/{item_id}")
def get_item(item_id: int, db = Depends(get_db)):
    return db.query(Item).filter(Item.id == item_id).first()
```

---

## ৬. Global Dependencies (পুরো অ্যাপের জন্য)

যদি আপনার এমন কোনো ডিপেন্ডেন্সি থাকে যা সব রাউটের জন্য দরকার (যেমন: অথেনটিকেশন বা এপিআই কি চেক), তবে সেটি গ্লোবালি সেট করতে পারেন।

```python
app = FastAPI(dependencies=[Depends(verify_token), Depends(verify_key)])
```

---

## ৭. Practice Exercises (অনুশীলন)

১. একটি `get_token` ডিপেন্ডেন্সি তৈরি করুন যা রিকোয়েস্ট হেডার থেকে টোকেন রিড করবে এবং সেটি রাউটে রিটার্ন করবে।
২. একটি ক্লাস-বেজড ডিপেন্ডেন্সি তৈরি করুন যা ফিল্টারিং (e.g. `min_price`, `max_price`) হ্যান্ডেল করবে।
৩. `yield` ব্যবহার করে একটি ফেক ডাটাবেস সেশন ম্যানেজমেন্ট লজিক লিখুন যা প্রতিবার কানেকশন ওপেন এবং ক্লোজ করার মেসেজ প্রিন্ট করবে।

---

## ৮. Summary & Best Practices

1. **Keep dependencies small:** একেকটি ডিপেন্ডেন্সি একেকটি ছোট কাজের জন্য রাখুন।
2. **Use classes for complexity:** যদি প্রপার্টি অনেক বেশি হয়, তবে ফাংশনের বদলে ক্লাস ব্যবহার করুন।
3. **Yield for resources:** ডাটাবেস বা নেটওয়ার্ক রিসোর্স হ্যান্ডেল করতে অবশ্যই `yield` ব্যবহার করুন।

---

::: tip পরবর্তী ধাপ
ডিপেন্ডেন্সি ইনজকেশন শেখার মাধ্যমে আপনি এখন FastAPI-র সবচেয়ে শক্তিশালী টুলটি আয়ত্ত করেছেন। পরবর্তী চ্যাপ্টারে আমরা শিখবো **Security & Authentication** - কীভাবে আপনার API-কে সুরক্ষিত করবেন।
:::
