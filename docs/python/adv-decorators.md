# Advanced Decorators

আমরা লেভেল ২-এ সাধারণ ডেকোরেটর দেখেছি। এডভান্সড লেভেলে আমরা শিখবো কিভাবে আরও জটিল এবং ফ্লেক্সিবল ডেকোরেটর তৈরি করা যায়।

---

## ১. Decorators with Arguments

কখনো ডেকোরেটরকে নিজেরও কিছু আর্গুমেন্ট নেওয়ার প্রয়োজন হতে পারে। এর জন্য আমাদের ডেকোরেটরের ভেতরে আরেকটি লেয়ার বা ফাংশন তৈরি করতে হয়।

```python
def repeat(n): # এই ফাংশনটি আর্গুমেন্ট রিসিভ করবে
    def decorator(func):
        def wrapper(*args, **kwargs):
            for _ in range(n):
                func(*args, **kwargs)
        return wrapper
    return decorator

@repeat(3)
def greet():
    print("হ্যালো!")

greet() # এটি ৩ বার প্রিন্ট হবে
```

---

## ২. Class Decorators

ফাংশনের মতো পুরো একটি ক্লাসকেও ডেকোরেটর হিসেবে ব্যবহার করা যায়। এর জন্য ক্লাসে `__call__` মেথড থাকতে হয়।

```python
class CountCalls:
    def __init__(self, func):
        self.func = func
        self.num_calls = 0

    def __call__(self, *args, **kwargs):
        self.num_calls += 1
        print(f"কল নম্বর: {self.num_calls}")
        return self.func(*args, **kwargs)

@CountCalls
def say_hi():
    print("Hi!")

say_hi()
say_hi()
```

---

## ৩. `functools.wraps`

যখন আমরা ডেকোরেটর ব্যবহার করি, তখন মেইন ফাংশনের আইডেন্টিটি (যেমন- নাম, ডকস্ট্রিং) হারিয়ে যেতে পারে। এটি ঠিক করার জন্য `@wraps` ব্যবহার করা হয়।

```python
from functools import wraps

def my_decorator(f):
    @wraps(f) # এটি মেইন ফাংশনের প্রপার্টিগুলো ট্রান্সফার করে
    def wrapper(*args, **kwargs):
        return f(*args, **kwargs)
    return wrapper

@my_decorator
def my_func():
    """This is my function."""
    pass

print(my_func.__name__) # 'my_func' (wraps না দিলে আসত 'wrapper')
```

---

## ৪. Multiple Decorators

একটি ফাংশনের ওপর একাধিক ডেকোরেটর ব্যবহার করা যায়। এগুলো নিচ থেকে উপরের দিকে (Bottom to Top) কাজ করে।

```python
@decorator1
@decorator2
def my_function():
    pass
```

---

::: tip
অ্যাডভান্সড ডেকোরেটর সাধারণত লগিং, অথেন্টিকেশন, এবং টাইমিং এর মতো ক্রস-কাটিং কনসার্ন ম্যানেজ করতে ব্যবহৃত হয়।
:::
