# Async Programming (অ্যাসিনক্রোনাস প্রোগ্রামিং)

আধুনিক পাইথনে হাজার হাজার নেটওয়ার্ক রিকোয়েস্ট (যেমন- এপিআই কল বা ওয়েব স্ক্যাপলিং) একসাথে হ্যান্ডেল করার জন্য **AsyncIO** ব্যবহার করা হয়। এটি থ্রেডিংয়ের তুলনায় অনেক কম রিসোর্স খরচ করে।

---

## ১. Basic Concepts

- **Coroutine**: এমন একটি ফাংশন যা মাঝপথে থেমে গিয়ে অন্য কাজ করতে দেয় এবং পরে আবার যেখান থেকে থেমেছিল সেখান থেকে শুরু হয়।
- **Event Loop**: যা কোডগুলো কখন রান হবে তার ম্যানেজমেন্ট করে।

---

## ২. `async` এবং `await`

কোনো ফাংশনকে কোরুটিন বানাতে নামের আগে `async` লিখতে হয়। আর কোনো কাজ শেষ হওয়ার জন্য অপেক্ষা করতে `await` ব্যবহার করা হয়।

```python
import asyncio

async def say_hello():
    print("শুরু হচ্ছে...")
    await asyncio.sleep(1) # এটি ব্লকিং নয়, তাই পাইথন অন্য কাজ করতে পারবে
    print("হ্যালো পাইথন!")

asyncio.run(say_hello())
```

---

## ৩. Running Parallel Tasks

অনেকগুলো কাজ একসাথে দেওয়ার জন্য `asyncio.gather()` ব্যবহার করা হয়।

```python
import asyncio

async def task(n):
    await asyncio.sleep(n)
    return f"Task {n} finished"

async def main():
    # ৩টি টাস্ক একসাথে রান হবে
    results = await asyncio.gather(task(1), task(2), task(3))
    print(results)

asyncio.run(main())
```

---

## ৪. কেন এটি থ্রেডিংয়ের চেয়ে ভালো?

- **Low Overhead**: ১০০০টি থ্রেড ওপেন করলে পিসি স্লো হয়ে যায়, কিন্তু ১০০০টি অ্যাসিনক্রোনাস টাস্ক খুব সহজেই হ্যান্ডেল করা যায়।
- **No GIL issues**: যেহেতু এটি একটি সিঙ্গেল থ্রেডেই চলে, তাই মেমরি কনফ্লিক্ট হওয়ার চান্স কম।

---

## ৫. aiohttp (এক্সটার্নাল লাইব্রেরি)

অ্যাসিনক্রোনাসলি এপিআই রিকোয়েস্ট পাঠানোর জন্য স্ট্যান্ডার্ড `requests` লাইব্রেরি কাজ করে না (কারণ এটি ব্লকিং)। সেক্ষেত্রে **`aiohttp`** ব্যবহার করা হয়।

```python
import aiohttp
import asyncio

async def fetch(url):
    async with aiohttp.ClientSession() as session:
        async with session.get(url) as response:
            return await response.text()
```

---

::: warning মনে রাখবেন
আপনার কোড অ্যাসিনক্রোনাস হলেও যদি ভেতরে কোনো ব্লকিং লাইব্রেরি (যেমন- regular `requests` বা `time.sleep`) ব্যবহার করেন, তবে পুরো অ্যাপ্লিকেশনটি স্লো হয়ে যাবে।
:::
