# Strings (স্ট্রিং)

Python-এ টেক্সট ডেটা নিয়ে কাজ করার জন্য **String** ব্যবহার করা হয়। এটি সিঙ্গেল কোট `' '` অথবা ডাবল কোট `" "` দিয়ে লেখা যায়।

---

## ১. String Indexing এবং Slicing

String আসলে কারেক্টারের একটি সিকোয়েন্স। তাই এর প্রতিটি কারেক্টারের একটি নির্দিষ্ট পজিশন বা **Index** আছে। মনে রাখবেন, ইনডেক্স **০ (শূন্য)** থেকে শুরু হয়।

```python
s = "Python"

print(s[0])   # Output: 'P'
print(s[-1])  # Output: 'n' (শেষ অক্ষর)
```

### Slicing (অংশ বিশেষ নেওয়া):
`[start : stop : step]` ফরম্যাটে স্ট্রিং স্লাইস করা যায়।

```python
name = "Hello World"
print(name[0:5])   # Output: 'Hello'
print(name[6:])    # Output: 'World'
print(name[::-1])  # Output: 'dlroW olleH' (Reverse string)
```

---

## ২. String Methods (প্রয়োজনীয় মেথড)

Python-এ স্ট্রিং নিয়ে কাজ করার জন্য অনেক বিল্ট-ইন মেথড আছে।

- `upper()`: সব বড় হাতের করা।
- `lower()`: সব ছোট হাতের করা।
- `strip()`: আগে-পিছের খালি জায়গা কমানো।
- `split()`: স্ট্রিংকে টুকরো করে লিস্ট বানানো।
- `replace(a, b)`: 'a' কে 'b' দিয়ে পরিবর্তন করা।

```python
text = "  hello python  "
print(text.strip().upper())  # Output: "HELLO PYTHON"
```

---

## ৩. String Formatting (ফ-স্ট্রিংস)

আধুনিক Python-এ স্ট্রিং এর ভেতর ভেরিয়েবল বসানোর সবচেয়ে সহজ উপায় হলো **f-strings**।

```python
name = "Ripon"
age = 25

# f-string ব্যবহার করে
message = f"আমার নাম {name} এবং বয়স {age} বছর।"
print(message)
```

---

## ৪. Escape Characters

স্ট্রিং এর ভেতর বিশেষ চিহ্ন (যেমন: নতুন লাইন) ব্যবহার করার জন্য ব্যাকস্ল্যাশ `\` ব্যবহার করা হয়।

- `\n`: New Line (নতুন লাইন)
- `\t`: Tab (ট্যাব)
- `\'`: Single Quote
- `\"`: Double Quote
```python
print("Hello\nWorld")
```
---

::: tip Immutability
Python-এ Strings হলো **Immutable**। এর মানে হলো একবার তৈরি করা স্ট্রিং পরিবর্তন করা যায় না, কোনো পরিবর্তন করলে আসলে একটি নতুন স্ট্রিং তৈরি হয়।
:::
