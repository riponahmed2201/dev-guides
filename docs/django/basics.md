# Environment Setup & Basics

Django ডেভেলপমেন্ট শুরু করার জন্য আপনার পিসিতে নিচের টুলসগুলো সেটআপ থাকতে হবে।

---

## ১. Python Installation (3.8+)

- প্রথমে [python.org](https://www.python.org/) থেকে পাইথনের লেটেস্ট ভার্সন ডাউনলোড করে ইন্সটল করো।
- ইন্সটল করার সময় অবশ্যই **"Add Python to PATH"** অপশনটি চেক মার্ক করে দিবে।
- চেক করার জন্য টার্মিনালে লেখো: `python --version`

---

## ২. Virtual Environment (ভার্চুয়াল এনভায়রনমেন্ট)

প্রতিটি প্রজেক্টের ডিপেন্ডেন্সি আলাদা রাখার জন্য ভার্চুয়াল এনভায়রনমেন্ট ব্যবহার করা জরুরি।

### ২.১ venv (Built-in)
- এনভায়রনমেন্ট তৈরি করতে: `python -m venv venv`
- অ্যাক্টিভেট করতে (Windows): `venv\Scripts\activate`
- অ্যাক্টিভেট করতে (Mac/Linux): `source venv/bin/activate`

### ২.২ virtualenv বা conda
আপনি চাইলে `virtualenv` বা `conda` ব্যবহার করেও এনভায়রনমেন্ট ম্যানেজ করতে পারেন।

---

## ৩. pip Package Manager

- পাইথনের সাথে `pip` অটোমেটিক ইন্সটল হয়। এটি দিয়ে নতুন প্যাকেজ ইন্সটল করা হয়।
- আপডেট করতে: `python -m pip install --upgrade pip`

---

## ৪. Django Installation

ভার্চুয়াল এনভায়রনমেন্ট অ্যাক্টিভেট থাকা অবস্থায় নিচের কমান্ডটি দিন:

```bash
pip install django
```

চেক করার জন্য টার্মিনালে লিখুন: `django-admin --version`

---

## ৫. IDE/Editor Setup (ডেভেলপমেন্ট এনভায়রনমেন্ট)

Django কোড লেখার জন্য একটি ভালো কোড এডিটর থাকা জরুরি।

- **VS Code (Recommended):** এটি সবচেয়ে জনপ্রিয়। ইন্সটল করার পর `Python` এবং `Django` এক্সটেনশনগুলো এড করে নিবেন। তাহলে এটি অটো-কমপ্লিশন এবং সিন্ট্যাক্স হাইলাইটিংয়ে সাহায্য করবে।
- **PyCharm:** এটি একটি প্রফেশনাল পাইথন আইডিই। Django-র সব বড় প্রজেক্টে এটি খুব কার্যকর।

---

## ৬. manage.py Commands

Django-তে কাজ করার সময় কিছু কমান্ড প্রায়ই ব্যবহার করতে হয়:

- `python manage.py runserver`: লোকাল সার্ভার চালু করার জন্য।
- `python manage.py makemigrations`: ডাটাবেসে নতুন কোনো পরিবর্তন ট্র্যাক করার জন্য।
- `python manage.py migrate`: সেই পরিবর্তনগুলো ডাটাবেসে অ্যাপ্লাই করার জন্য।
- `python manage.py createsuperuser`: এডমিন প্যানেলের জন্য ইউজার তৈরি করা।
