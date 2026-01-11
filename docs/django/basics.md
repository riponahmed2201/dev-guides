# Environment Setup

Django ডেভেলপমেন্ট শুরু করার জন্য তোমার পিসিতে নিচের টুলসগুলো সেটআপ থাকতে হবে।

**Python Installation (3.8+):**
- প্রথমে [python.org](https://www.python.org/) থেকে পাইথনের লেটেস্ট ভার্সন ডাউনলোড করে ইন্সটল করো।
- ইন্সটল করার সময় অবশ্যই **"Add Python to PATH"** অপশনটি চেক মার্ক করে দিবে।
- চেক করার জন্য টার্মিনালে লেখো: `python --version`

**Virtual Environment (venv):**
প্রতিটি প্রজেক্টের ডিপেন্ডেন্সি আলাদা রাখার জন্য ভার্চুয়াল এনভায়রনমেন্ট ব্যবহার করা জরুরি।
- এনভায়রনমেন্ট তৈরি করতে: `python -m venv myenv`
- অ্যাক্টিভেট করতে (Windows): `myenv\Scripts\activate`
- অ্যাক্টিভেট করতে (Mac/Linux): `source myenv/bin/activate`

**pip Package Manager:**
- পাইথনের সাথে `pip` অটোমেটিক ইন্সটল হয়। এটি দিয়ে নতুন প্যাকেজ ইন্সটল করা হয়।
- আপডেট করতে: `python -m pip install --upgrade pip`

**Django Installation:**
ভার্চুয়াল এনভায়রনমেন্ট অ্যাক্টিভেট থাকা অবস্থায় নিচের কমান্ডটি দাও:
- `pip install django`
- চেক করার জন্য: `django-admin --version`

**IDE/Editor Setup:**
- **VS Code:** পাইথন ডেভেলপমেন্টের জন্য এটি সেরা। `Python` এবং `Django` এক্সটেনশনগুলো ইন্সটল করে নিবে।
- **PyCharm:** এটি একটি ডেডিকেটেড পাইথন আইডিই।

**Django Project Structure Overview:**
একটি নতুন প্রজেক্ট তৈরি করলে নিচের ফাইলগুলো দেখতে পাবে:
- `manage.py`: প্রজেক্ট ম্যানেজ করার মূল কমান্ড লাইন টুল।
- `settings.py`: প্রজেক্টের সব কনফিগারেশন থাকে।
- `urls.py`: ইউআরএল রাউটিং হ্যান্ডেল করে।
- `wsgi.py/asgi.py`: ওয়েব সার্ভারের সাথে কানেক্ট করার জন্য।

**manage.py Commands:**
কিছু জরুরি কমান্ড:
- `python manage.py runserver`: সার্ভার চালু করা।
- `python manage.py makemigrations`: ডাটাবেস পরিবর্তন ট্র্যাক করা।
- `python manage.py migrate`: পরিবর্তনগুলো ডাটাবেসে অ্যাপ্লাই করা।
- `python manage.py createsuperuser`: এডমিন প্যানেলের ইউজার তৈরি করা।
