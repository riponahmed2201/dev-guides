# Lists (লিস্ট)

Python-এ লজিক্যাল তথ্য বা ডেটার লিস্ট রাখার জন্য **List** ব্যবহার করা হয়। এটি অন্য ল্যাঙ্গুয়েজের Array এর মতো।

---

## ১. List Creation

লিস্টকে থার্ড ব্র্যাকেট `[ ]` দিয়ে তৈরি করা হয়।

```python
fruits = ["apple", "banana", "cherry"]
numbers = [1, 2, 3, 4, 5]
mixed = ["Hello", 101, True]  # সব ধরনের ডেটা থাকতে পারে
```

---

## ২. Accessing Items (ইন্ডেক্সিং)

```python
print(fruits[0])   # apple
print(fruits[-1])  # cherry (শেষ আইটেম)
```

---

## ৩. List Methods

| Method | Description |
| :--- | :--- |
| `append()` | শেষে একটি আইটেম যোগ করা |
| `insert()` | নির্দিষ্ট পজিশনে যোগ করা |
| `remove()` | নির্দিষ্ট আইটেম মুছে ফেলা |
| `pop()` | শেষ আইটেম বা ইন্ডেক্স অনুযায়ী মুছে ফেলা |
| `sort()` | সাজানো |

```python
fruits.append("mango")
fruits.sort()
```

---

## ৪. List Comprehension

এক লাইনে জটিল লুপ চালিয়ে লিস্ট তৈরি করার পদ্ধতিকে **List Comprehension** বলে। এটি পাইথনের একটি খুব শক্তিশালী ফিচার।

```python
# ১ থেকে ১০ এর মধ্যে জোড় সংখ্যার লিস্ট
even_numbers = [x for x in range(1, 11) if x % 2 == 0]
print(even_numbers) # [2, 4, 6, 8, 10]
```
