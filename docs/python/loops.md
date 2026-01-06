# Loops (লুপ)

একই কাজ বারবার করার জন্য আমরা **Loops** ব্যবহার করি। Python-এ প্রধানত দুই ধরনের লুপ আছে: `for` এবং `while`।

---

## ১. `for` Loop

Python-এ `for` লুপ সাধারণত কোনো সিকোয়েন্স (List, Tuple, String) বা `range()` এর ওপর লুপ চালানোর জন্য ব্যবহৃত হয়।

```python
# ১ থেকে ৫ পর্যন্ত প্রিন্ট করা
for i in range(1, 6):
    print(i)

# লিস্টের ওপর লুপ
fruits = ["apple", "banana", "cherry"]
for fruit in fruits:
    print(fruit)
```

### range() ফাংশন:
- `range(5)` -> ০ থেকে ৪ পর্যন্ত।
- `range(2, 6)` -> ২ থেকে ৫ পর্যন্ত।
- `range(1, 10, 2)` -> ১, ৩, ৫, ৭, ৯ (২ ধাপ করে)।

---

## ২. `while` Loop

যতক্ষণ পর্যন্ত কন্ডিশন সত্য থাকবে, ততক্ষণ `while` লুপ চলতে থাকবে।

```python
count = 1
while count <= 5:
    print(count)
    count += 1  # এটি না দিলে লুপটি আজীবন চলতে থাকবে (Infinite Loop)
```

---

## ৩. Loop Control: `break` এবং `continue`

- **break**: লুপটি সাথে সাথে বন্ধ করে দেয়।
- **continue**: এই ধাপটি বাদ দিয়ে পরবর্তী ধাপে চলে যায়।

```python
# ৩ হলে বন্ধ হয়ে যাবে
for i in range(1, 10):
    if i == 3:
        break
    print(i)

# ৫ বাদ দিয়ে বাকিগুলো প্রিন্ট হবে
for i in range(1, 6):
    if i == 3:
        continue
    print(i)
```

---

## ৪. Loop with `else`

Python-এ লুপের সাথে `else` ব্যবহার করা যায়। লুপটি কোনো `break` ছাড়াই সফলভাবে শেষ হলে `else` ব্লকটি কাজ করবে।

```python
for i in range(5):
    print(i)
else:
    print("Loop finished successfully!")
```
