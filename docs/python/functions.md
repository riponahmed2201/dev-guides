# Functions (ফাংশন)

**Function** হলো একগুচ্ছ কোড যা একটি নির্দিষ্ট কাজ সম্পন্ন করে। এটি রি-ইউজেবল, অর্থাৎ একবার লিখে বারবার ব্যবহার করা যায়। এতে কোড ছোট এবং সুন্দর হয়।

---

## ১. Function Definition & Calling

ফাংশন তৈরি করতে `def` কি-ওয়ার্ড ব্যবহার করা হয়।

```python
def say_hello():
    print("Hello from function!")

# ফাংশন কল করা
say_hello()
```

---

## ২. Parameters & Arguments

ফাংশনের ভেতরে তথ্য পাঠানোর জন্য প্যারামিটার ব্যবহার করা হয়।

```python
def greet(name): # name হলো প্যারামিটার
    print(f"হ্যালো {name}!")

greet("Ripon") # "Ripon" হলো আর্গুমেন্ট
```

### Default Parameters:
আপনি চাইলে প্যারামিটারের একটি ডিফল্ট ভ্যালু ঠিক করে দিতে পারেন।

```python
def greet(name="User"):
    print(f"হ্যালো {name}!")

greet() # আউটপুট: হ্যালো User!
```

---

## ৩. `*args` এবং `**kwargs`

কখনো যদি আপনি না জানেন যে কতগুলো আর্গুমেন্ট আসবে, তখন এগুলো ব্যবহার করা হয়।

- **`*args`**: আনলিমিটেড পজিশনাল আর্গুমেন্ট (এটি একটি Tuple হিসেবে আসে)।
- **`**kwargs`**: আনলিমিটেড কিওয়ার্ড আর্গুমেন্ট (এটি একটি Dictionary হিসেবে আসে)।

```python
def sum_all(*numbers):
    total = sum(numbers)
    print(total)

sum_all(1, 2, 3, 4, 5) # ১৫

def user_info(**info):
    for key, value in info.items():
        print(f"{key}: {value}")

user_info(name="Ripon", job="Dev")
```

---

## ৪. Return Values

ফাংশন থেকে কোনো ভ্যালু প্রোগ্রামে ফেরত পাঠাতে `return` ব্যবহার করা হয়।

```python
def add(a, b):
    return a + b

result = add(10, 5)
print(result) # ১৫
```

---

## ৫. Docstrings

আপনার ফাংশনটি কী কাজ করে তা লিখে রাখার জন্য ফাংশনের একদম শুরুতে ট্রিপল কোটেশন ব্যবহার করা হয়। একে **Docstrings** বলে।

```python
def multiply(a, b):
    """
    এই ফাংশনটি দুটি সংখ্যা গুণ করে।
    """
    return a * b

print(multiply.__doc__)
```

---

## ৬. Scope (লোকাল ও গ্লোবাল)

- **Local Scope**: ফাংশনের ভেতরে ডিক্লেয়ার করা ভেরিয়েবল শুধু ফাংশনের ভেতরেই কাজ করে।
- **Global Scope**: ফাংশনের বাইরে ডিক্লেয়ার করা ভেরিয়েবল সব জায়গায় কাজ করে।

```python
x = 10 # Global

def my_func():
    y = 5 # Local
    print(x) # কাজ করবে
    print(y) # কাজ করবে

my_func()
# print(y) # Error দিবে! (লোকাল ভেরিয়েবল বাইরে পাওয়া যাবে না)
```
---

::: tip
একটি ফাংশন সবসময় কিছু না কিছু রিটার্ন করে। আপনি যদি `return` না লেখেন, তবে ডিকশনারি বা কোনো অবজেক্ট নয়, বরং `None` রিটার্ন করবে।
:::
