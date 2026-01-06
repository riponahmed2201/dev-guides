# Modules & Packages (মডিউল এবং প্যাকেজ)

বড় কোডবেস ম্যানেজ করার জন্য কোডকে আলাদা আলাদা ফাইলে ভাগ করা অত্যন্ত জরুরি। পাইথনে এই কাজটি **Modules** এবং **Packages** এর মাধ্যমে করা হয়।

---

## ১. Module কী?

একটি সাধারণ `.py` ফাইলকেই পাইথনে একটি মডিউল বলা হয়। এতে ফাংশন, ক্লাস বা ভেরিয়েবল থাকতে পারে যা আপনি অন্য ফাইলে ব্যবহার করতে পারেন।

### Importing Modules:
```python
import math
print(math.sqrt(16)) # ৪.০

from math import pi
print(pi) # ৩.১৪১৫৯...
```

---

## ২. Creating Custom Modules

ধরুন আপনার প্রোজেক্টে একটি ফাইল আছে `my_math.py`:
```python
# my_math.py
def add(a, b):
    return a + b

PI = 3.14
```

এখন অন্য একটি ফাইল `main.py` থেকে আপনি এটি কল করতে পারেন:
```python
# main.py
import my_math

print(my_math.add(5, 10))
print(my_math.PI)
```

---

## ৩. `if __name__ == "__main__":`

যখন কোনো ফাইলকে মডিউল হিসেবে ইম্পোর্ট করা হয়, তখন সেই ফাইলের সব কোড অটোমেটিক রান হয়ে যায়। এটি আটকানোর জন্য এই কন্ডিশন ব্যবহার করা হয়।

```python
# my_module.py
def start():
    print("মডিউল শুরু হলো!")

if __name__ == "__main__":
    # এই অংশটি শুধু তখনই রান হবে যদি ফাইলটি সরাসরি ওপেন করা হয়
    # অন্য কেউ ইম্পোর্ট করলে এটি রান হবে না
    start()
```

---

## ৪. Packages (প্যাকেজ)

অনেকগুলো মডিউলকে একটি ফোল্ডারে গুছিয়ে রাখলে তাকে **Package** বলে। একটি ফোল্ডারকে প্যাকেজ হিসেবে গণ্য করার জন্য আগে সেখানে `__init__.py` নামে একটি ফাইল থাকতে হতো (আধুনিক পাইথনে এটি অপশনাল হলেও প্রফেশনাল প্রোজেক্টে ব্যবহার করা হয়)।

### Package Structure:
```text
my_app/
├── __init__.py
├── utils/
│   ├── __init__.py
│   └── helper.py
└── main.py
```

ইম্পোর্ট করার পদ্ধতি:
```python
from utils.helper import my_function
```

---

## ৫. Built-in vs External Modules

- **Built-in**: পাইথনের সাথে আগে থেকেই থাকে (যেমন: `os`, `sys`, `random`, `datetime`)।
- **External**: যা ইন্টারনেটে থাকে এবং `pip` দিয়ে ইন্সটল করতে হয় (যেমন: `pandas`, `requests`)।

```bash
pip install requests
```
---

::: tip সুবিধা
মডিউল ব্যবহারের ফলে কোড **Re-usable** হয় এবং **Namespace conflict** (একাধিক একই নামের ভেরিয়েবল বা ফাংশনের ঝগড়া) এড়ানো যায়।
:::
