# Dictionaries (ডিকশনারি)

ডিকশনারি বা **Dict** হলো এক ধরনের কালেকশন যেখানে কি-ভ্যালু (**Key-Value pair**) হিসেবে ডেটা থাকে। অনেকটা JSON অবজেক্টের মতো।

---

## ১. Dictionary Creation

```python
user = {
    "name": "Ripon",
    "age": 25,
    "city": "Dhaka"
}
```

---

## ২. Accessing Values

```python
print(user["name"])    # Ripon
print(user.get("city")) # Dhaka (get ব্যবহার করা সেইফ কারণ কি না থাকলে এরর দেয় না)
```

---

## ৩. Adding & Updating

```python
user["job"] = "Developer" # নতুন কি যোগ করা
user["age"] = 26          # ভ্যালু আপডেট করা
```

---

## ৪. Loop in Dictionary

```python
for key, value in user.items():
    print(f"{key}: {value}")
```
