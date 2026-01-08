# Performance & Scalability (পারফরম্যান্স ও স্কেলেবিলিটি)

FastAPI-র নামকরণের মধ্যেই এর সবচেয়ে বড় গুণ লুকিয়ে আছে—গতি। কিন্তু শুধু ফ্রেমওয়ার্ক ব্যবহার করলেই অ্যাপ ফাস্ট হয় না, ফাস্ট রাখার জন্য কিছু অ্যাডভান্সড টেকনিক এবং সঠিক আর্কিটেকচার বুঝতে হয়।

---

## ১. Async/await এর আসল শক্তি বোঝা

FastAPI মূলত **Asynchronous** প্রোগ্রামিংয়ের ওপর ভিত্তি করে তৈরি। অধিকাংশ ওয়েব অ্যাপ্লিকেশন **I/O Bound** হয় (যেমন: ডাটাবেস কোয়েরি বা এপিআই কল করা)। এ ধরনের কাজে `async` ব্যবহার করলে সার্ভার একটি রিকোয়েস্টের জন্য ডাটাবেসের উত্তরের অপেক্ষায় বসে না থেকে অন্য রিকোয়েস্ট প্রসেস করতে পারে।

```python
import asyncio

@app.get("/slow-api")
async def slow_api():
    # এখানে await ব্যবহার করার ফলে সার্ভার এই ৫ সেকেন্ড অন্য কাজ করতে পারবে
    await asyncio.sleep(5) 
    return {"message": "Finally done!"}
```

> [!IMPORTANT]
> যদি আপনার কোনো ফাংশন ভারি ক্যালকুলেশন করে (CPU Bound), তবে সেটি `async` না করে সাধারণ `def` হিসেবে লিখুন। FastAPI তখন সেটিকে একটি আলাদা Thread-এ চালাবে যেন মেইন ইভেন্ট লুপ ব্লক না হয়।

---

## ২. Concurrent Requests হ্যান্ডেল করা

FastAPI অটোমেটিক্যালি অনেকগুলো রিকোয়েস্ট একসাথে হ্যান্ডেল করতে পারে। আপনি যখন `async def` ব্যবহার করেন, তখন এটি একটিমাত্র Thread-এ ইভেন্ট লুপের মাধ্যমে কনকারেন্সি চালায়। 

কিন্তু যদি আপনি একই সাথে অনেকগুলো ডাটাবেস কোয়েরি বা এক্সটার্নাল এপিআই কল করতে চান, তবে `asyncio.gather` ব্যবহার করতে পারেন:

```python
@app.get("/multi-task")
async def multi_task():
    # দুটি কাজ একসাথে শুরু হবে
    task1 = call_external_api_1()
    task2 = call_external_api_2()
    
    # দুটোর জন্যই একসাথে অপেক্ষা করা
    results = await asyncio.gather(task1, task2)
    return {"result1": results[0], "result2": results[1]}
```

---

## ৩. Caching Strategies (Redis Introduction)

ডেটাবেস থেকে একই ডেটা বারবার রিড না করে **Caching** করলে অ্যাপের পারফরম্যান্স কয়েক গুণ বেড়ে যায়। এ কাজের জন্য **Redis** সবচেয়ে জনপ্রিয়।

ইন্সটলেশন: `pip install redis aioredis`

```python
import aioredis

@app.on_event("startup")
async def startup():
    app.state.redis = await aioredis.from_url("redis://localhost")

@app.get("/cached-data")
async def get_data(request: Request):
    redis = request.app.state.redis
    # ১. প্রথমে ক্যাশে চেক করা
    cached_val = await redis.get("my_key")
    if cached_val:
        return {"data": cached_val, "source": "cache"}
    
    # ২. ক্যাশে না থাকলে ডাটাবেস থেকে আনা
    data = "very expensive data from db"
    
    # ৩. ক্যাশে সেভ করে রাখা (যেমন: ৬০ সেকেন্ডের জন্য)
    await redis.set("my_key", data, ex=60)
    return {"data": data, "source": "database"}
```

---

## ৪. Response Serialization অপ্টিমাইজ করা

যখন আপনার এপিআই অনেক বড় JSON রিটার্ন করে, তখন পাইথনের ডিফল্ট JSON এনকোডার ধীর হয়ে যেতে পারে। FastAPI আমাদের **orjson** বা **ujson** ব্যবহার করার সুযোগ দেয় যা অনেক দ্রুত।

`pip install orjson`

```python
from fastapi.responses import ORJSONResponse

@app.get("/large-data", response_class=ORJSONResponse)
async def get_large_data():
    return [{"id": i, "name": f"Item {i}"} for i in range(10000)]
```

---

## ৫. Practice Exercises (অনুশীলন)

১. একটি রাউট তৈরি করুন যা `asyncio.gather` ব্যবহার করে তিনটি আলাদা ফেক এপিআই কল করবে।
২. একটি সিম্পল Redis ক্যাশিং ডেকোরেটর বা ফাংশন তৈরি করুন।
৩. `orjson` ব্যবহার করে একটি রাউট থেকে ১০০০টি র্যান্ডম ডেটা রিটার্ন করে সাধারণ `JSONResponse`-এর সাথে স্পিড তুলনা করুন।

---

## ৬. Best Practices

1. **Use `async` for I/O:** ডাটাবেস কানেকশন, ফাইল রিড, বা নেটওয়ার্ক কলের জন্য সবসময় `async` লাইব্রেরি ব্যবহার করুন।
2. **Don't block the loop:** ভারি গাণিতিক কাজের জন্য মাল্টি-প্রসেসিং বা সাধারণ `def` ব্যবহার করুন।
3. **Cache aggressiveley:** যে ডেটা ঘনঘন পরিবর্তন হয় না, তা অবশ্যই ক্যাশে রাখুন।
4. **Limit database connections:** সেশন ঠিকভাবে ক্লোজ করুন এবং কানেকশন পুলিং ব্যবহার করুন।

---

::: tip পরবর্তী ধাপ
অ্যাডভান্সড পারফরম্যান্স টেকনিক শেখার মাধ্যমে আপনি এখন হাই-ট্রাফিক অ্যাপ হ্যান্ডেল করতে প্রস্তুত। আমাদের পরবর্তী চ্যাপ্টার হলো **Expert Level: Production Deployment (Docker, Gunicorn, Nginx)**।
:::
