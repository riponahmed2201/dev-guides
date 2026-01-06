# Advanced Functions (অ্যাডভান্সড ফাংশন)

পাইথনে ফাংশন শুধু একটি কোড ব্লক নয়, এটি একটি **First-class Object**। এর মানে হলো ফাংশনকে ভেরিয়েবলে সেভ করা যায়, অন্য ফাংশনে আর্গুমেন্ট হিসেবে পাঠানো যায় এবং ফাংশন থেকে ফাংশন রিটার্ন করা যায়।

---

## ১. Lambda Functions

**Lambda** হলো এক লাইনের ছোট এবং অ্যানোনিমাস (নামহীন) ফাংশন। এটি ছোট কোনো লজিক তাৎক্ষণিকভাবে ব্যবহারের জন্য খুব জনপ্রিয়।

```python
# সিনট্যাক্স: lambda arguments : expression

double = lambda x : x * 2
print(double(5)) # ১০

add = lambda x, y : x + y
print(add(5, 10)) # ১৫
```

---

## ২. Map, Filter, এবং Reduce

এই তিনটি ফাংশন ডাটা ম্যানিপুলেশনের জন্য অত্যন্ত শক্তিশালী।

- **map()**: একটি লিস্টের প্রতিটি আইটেমের ওপর নির্দিষ্ট কোনো কাজ করার জন্য।
- **filter()**: শর্ত অনুযায়ী লিস্ট থেকে কিছু আইটেম বাছাই করার জন্য।
- **reduce()**: পুরো লিস্টের ওপর প্রসেস চালিয়ে একটি মাত্র রেজাল্ট বের করার জন্য।

```python
# Map: সব নাম আপারকেস করা
names = ["ripon", "shuvo", "papon"]
upper_names = list(map(lambda n: n.upper(), names))

# Filter: শুধু জোড় সংখ্যা বাছাই করা
nums = [1, 2, 3, 4, 5, 6]
evens = list(filter(lambda x: x % 2 == 0, nums))

# Reduce (functools মডিউল লাগে): সব সংখ্যার গুণফল
from functools import reduce
product = reduce(lambda x, y: x * y, [1, 2, 3, 4]) # ২৪
```

---

## ৩. Nested Functions & Closures

একটি ফাংশনের ভেতরে আরেকটি ফাংশন লিখলে তাকে **Nested Function** বলে। আর যদি ভেতরের ফাংশনটি বাইরের ফাংশনের কোনো ভেরিয়েবলকে মনে রাখে, তাকে বলে **Closure**।

```python
def outer_func(msg):
    def inner_func():
        print(f"মেসেজ: {msg}") # বাইরের msg ভেরিয়েবল মনে রেখেছে
    return inner_func

my_func = outer_func("হ্যালো পাইথন!")
my_func()
```

---

## ৪. Decorators (প্রাথমিক ধারণা)

**Decorator** হলো এমন একটি ফাংশন যা অন্য একটি ফাংশনের কাজকে পরিবর্তন না করে তার সাথে নতুন কিছু ফিচার যোগ করতে পারে।

```python
def my_decorator(func):
    def wrapper():
        print("ফাংশন শুরুর আগে কিছু কাজ...")
        func()
        print("ফাংশন শেষ হওয়ার পর কিছু কাজ...")
    return wrapper

@my_decorator
def printer():
    print("আমি মেইন ফাংশন!")

printer()
```

---

## ৫. Recursion (রিকার্সন)

একটি ফাংশন যখন নিজেকেই নিজে কল করে, তাকে **Recursion** বলে। এটি বড় সমস্যাকে ছোট ছোট ভাগে ভাগ করে সমাধান করতে সাহায্য করে।

```python
def factorial(n):
    if n == 1:
        return 1
    else:
        return n * factorial(n-1)

print(factorial(5)) # ১২০
```
---

::: tip মনে রাখবেন
অ্যাডভান্সড ফাংশনগুলো কোডকে আরো ক্লিন এবং প্রফেশনাল করে তোলে। তবে ল্যাম্বডা বা ম্যাপ ব্যবহারের সময় সতর্ক থাকতে হবে যেন তা কোডের পাঠযোগ্যতা (Readability) কমিয়ে না দেয়।
:::
