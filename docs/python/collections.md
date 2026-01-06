# Collections Module

পাইথনের বিল্ট-ইন ডাটা স্ট্রাকচার (List, Dict, Tuple) এর বাইরে আরো অ্যাডভান্সড এবং কাজের কিছু ডাটা স্ট্রাকচার আছে যা **`collections`** মডিউলে পাওয়া যায়।

---

## ১. Counter (কাউন্টার)

কোনো লিস্ট বা স্ট্রং-এ কোনটা কতবার আছে তা অটোমেটিক গুনতে এটি ব্যবহার করা হয়। এটি একটি ডিকশনারি রিটার্ন করে।

```python
from collections import Counter

fruits = ["apple", "banana", "apple", "mango", "banana", "apple"]
count = Counter(fruits)
print(count) # Counter({'apple': 3, 'banana': 2, 'mango': 1})
print(count.most_common(1)) # সবচেয়ে বেশি কোনটা আছে
```

---

## ২. defaultdict

সাধারণ ডিকশনারিতে কোনো কি (Key) না থাকলে এরর দেয়। কিন্তু `defaultdict` এ আপনি একটি ডিফল্ট ভ্যালু ঠিক করে দিতে পারেন।

```python
from collections import defaultdict

# ডিফল্ট ভ্যালু হিসেবে ০ থাকবে
d = defaultdict(int) 
d["count"] += 1 
print(d["count"]) # ১ (আগে না থাকলেও এরর দেয়নি)
```

---

## ৩. namedtuple

টুপলে ডাটা অ্যাক্সেস করতে ইনডেক্স ব্যবহার করতে হয় (যেমন- `data[0]`), যা মনে রাখা কঠিন। `namedtuple` ব্যবহার করলে আপনি নামের মাধ্যমে ডাটা অ্যাক্সেস করতে পারবেন।

```python
from collections import namedtuple

Point = namedtuple('Point', ['x', 'y'])
p = Point(10, 20)

print(p.x) # ১০
print(p.y) # ২০
```

---

## ৪. deque (ডেক)

এটি ডাবল-এন্ডেড কিউ (Queue)। লিস্টের শুরুতে বা শেষে অনেক দ্রুত ডাটা যোগ বা রিমুভ করার জন্য এটি ব্যবহার করা হয়।

```python
from collections import deque

q = deque(["a", "b", "c"])
q.append("d")      # শেষে যোগ
q.appendleft("z")  # শুরুতে যোগ
q.popleft()        # শুরু থেকে ডিলিট
```

---

## ৫. ChainMap

একাধিক ডিকশনারিকে একটি ইউনিটে রূপান্তর করতে এটি ব্যবহৃত হয়।

---

::: tip
বড় মাপের ডাটা প্রসেসিং এর সময় `collections` মডিউলের এই স্পেশাল টুলগুলো আপনার কোডিং স্পিড এবং পারফরম্যান্স অনেক বাড়িয়ে দিবে।
:::
