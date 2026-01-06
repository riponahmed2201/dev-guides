# Package Management (প্যাকেজ ম্যানেজমেন্ট)

পাইথনে আপনার কোড বা লাইব্রেরি অন্যকে ব্যবহার করতে দেওয়া বা ডিস্ট্রিবিউট করার প্রক্রিয়াকে বলা হয় **Packaging**। এটি আপনার কোডকে একটি মডিউল বা লাইব্রেরি হিসেবে ইন্সটলযোগ্য (Installable) করে তোলে।

---

## ১. Why Package your code?

- **Distribution**: সহজেই PyPI (Python Package Index) এ আপলোড করা যায়।
- **Versioning**: কোডের ভার্সন ম্যানেজ করা যায়।
- **Dependency Management**: আপনার লাইব্রেরি চলতে কী কী লাগবে তা অটোমেটিক সেট করা যায়।

---

## ২. Standard Tools

- **Pip**: প্যাকেজ ইন্সটল করার জন্য।
- **Setuptools**: প্যাকেজ তৈরি করার জন্য।
- **Wheel**: প্যাকেজ ডিস্ট্রিবিউশন ফরম্যাট।
- **Twine**: PyPI-তে সুরুক্ষিতভাবে আপলোড করার জন্য।

---

## ৩. Basic Package Structure

```text
my_package/
├── my_library/        # মেইন কোড
│   ├── __init__.py
│   └── main.py
├── tests/             # টেস্ট কেস
├── pyproject.toml     # আধুনিক কনফিগারেশন ফাইল
├── setup.py           # পুরনো বা স্ট্যান্ডার্ড কনফিগারেশন
└── README.md
```

---

## ৪. `pyproject.toml` (আধুনিক পদ্ধতি)

বর্তমানে `setup.py` এর বদলে `pyproject.toml` ব্যবহার করা রিকমেন্ডেড।

```toml
[build-system]
requires = ["setuptools", "wheel"]
build-backend = "setuptools.build_meta"

[project]
name = "my-awesome-lib"
version = "0.1.0"
description = "A great python library"
readme = "README.md"
authors = [{ name = "Ripon" }]
dependencies = [
    "requests",
]
```

---

## ৫. ডিস্ট্রিবিউট করা

১. **Build**: আপনার কোড থেকে হুইল ফাইল তৈরি করা।
   ```bash
   python -m build
   ```
২. **Upload**: PyPI তে আপলোড করা।
   ```bash
   twine upload dist/*
   ```

---

::: tip
যদি আপনি কোনো বড় প্রোজেক্ট বা ফ্রেমওয়ার্ক বানাতে চান, তবে প্যাকেজিং শেখা আপনার জন্য একটি বড় মাইলফলক হবে।
:::
