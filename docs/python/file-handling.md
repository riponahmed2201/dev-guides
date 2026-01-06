# File Handling (ফাইল হ্যান্ডলিং)

ডাটা পার্মানেন্টলি সেভ করে রাখার জন্য ফাইল হ্যান্ডলিং জানা খুবই গুরুত্বপূর্ণ। পাইথনে ফাইল ওপেন, রিড, রাইট এবং ক্লোজ করা অনেক সহজ।

---

## ১. Opening & Closing Files

ফাইল হ্যান্ডেল করার জন্য `open()` ফাংশন ব্যবহার করা হয়। কাজ শেষ হলে ফাইলটি অবশ্যই `close()` করতে হবে।

```python
file = open("test.txt", "r") # 'r' মানে Read (বড় ডিফল্ট মোড)
# কাজ শেষে:
file.close()
```

### Modes (মোডসমূহ):
| Mode | Name | Description |
| :--- | :--- | :--- |
| **'r'** | Read | শুধু পড়ার জন্য (ফাইল না থাকলে Error দিবে)। |
| **'w'** | Write | লেখার জন্য (পুরনো ডাটা মুছে নতুন করে লিখে)। |
| **'a'** | Append | শেষে নতুন ডাটা যোগ করার জন্য। |
| **'r+'** | Read+Write | পড়ার এবং লেখার জন্য। |

---

## ২. The `with` Statement (Recommended)

ম্যানুয়ালি ফাইল ক্লোজ করা ভুলে গেলে মেমরি লিক হতে পারে। তাই পাইথনে **Context Manager** বা `with` স্টেটমেন্ট ব্যবহার করা সবচেয়ে নিরাপদ উপায়। এটি কাজ শেষে অটোমেটিক ফাইল ক্লোজ করে দেয়।

```python
with open("readme.txt", "w") as f:
    f.write("হ্যালো পাইথন দুনিয়া!\n")
    f.write("ফাইল হ্যান্ডলিং সহজ।")
```

---

## ৩. Reading Files

ফাইল থেকে ডাটা পড়ার কয়েকটি উপায় আছে:

- **`read()`**: পুরো ফাইল একসাথে পড়ে।
- **`readline()`**: শুধু প্রথম লাইনটি পড়ে।
- **`readlines()`**: সব লাইন পড়ে একটি লিস্ট হিসেবে দেয়।

```python
with open("readme.txt", "r") as f:
    content = f.read()
    print(content)

# লাইন বাই লাইন লুপ চালানো:
with open("readme.txt", "r") as f:
    for line in f:
        print(line.strip())
```

---

## ৪. Binary Files

ছবি বা অডিও ফাইলের জন্য 'b' মোড ব্যবহার করতে হয় (যেমন: `rb`, `wb`)।

```python
with open("photo.jpg", "rb") as f:
    data = f.read()
```

---

## ৫. Working with JSON

আধুনিক অ্যাপ্লিকেশনে ডাটা ট্র্যান্সফারের জন্য JSON খুব জনপ্রিয়। পাইথনে বিল্ট-ইন `json` মডিউল আছে।

```python
import json

data = {"name": "Ripon", "age": 25}

# Python Dict থেকে JSON ফাইলে সেভ করা
with open("user.json", "w") as f:
    json.dump(data, f)

# JSON ফাইল থেকে ডাটা পড়া
with open("user.json", "r") as f:
    user = json.load(f)
    print(user["name"])
```
---

::: warning সতর্কতা
ফাইল রাইট করার সময় সতর্ক থাকুন, কারণ 'w' মোড ব্যবহার করলে ফাইলের আগের সব ডাটা পার্মানেন্টলি মুছে যায়। ডাটা অক্ষুণ্ণ রেখে নতুন কিছু যোগ করতে চাইলে সবসময় 'a' (Append) মোড ব্যবহার করুন।
:::
