# Django Introduction

Django হলো একটি high-level Python Web Framework যা দ্রুত নিরাপদ এবং মেইনটেনেবল ওয়েবসাইট তৈরির জন্য ডিজাইন করা হয়েছে। এটি "The framework for perfectionists with deadlines" হিসেবে পরিচিত।

**কেন Django ব্যবহার করবে?**
- **Fast:** Django-তে অনেক কিছু আগে থেকেই তৈরি থাকে, তাই ডেভেলপমেন্ট অনেক দ্রুত হয়।
- **Secure:** এটি SQL injection, XSS, CSRF-এর মতো কমন সিকিউরিটি রিস্ক থেকে অটোমেটিক সুরক্ষা দেয়।
- **Scalable:** ট্রাফিক বাড়লে Django খুব সহজেই তা হ্যান্ডেল করতে পারে (যেমন- Instagram)।

**Django এর History এবং Philosophy:**
- ২০০৩ সালে Adrian Holovaty এবং Simon Willison এটি তৈরি করেন "Lawrence Journal-World" সংবাদপত্রের জন্য।
- ২০০৫ সালে এটি ওপেন সোর্স করা হয়।
- এর মূল দর্শন হলো **DRY (Don't Repeat Yourself)** এবং **Rapid Development**।

**MVT (Model-View-Template) Architecture:**
- **Model:** ডাটাবেস হ্যান্ডেল করে (Data layer)।
- **View:** বিজনেস লজিক হ্যান্ডেল করে এবং টেমপ্লেট রেন্ডার করে (Logic layer)।
- **Template:** ইউজার ইন্টারফেস বা HTML ফাইলগুলো (UI layer)।
- *নোট:* Django-তে View অনেকটা MVC-এর Controller-এর মতো কাজ করে।

**Django vs Flask vs FastAPI:**
| Feature | Django | Flask | FastAPI |
| :--- | :--- | :--- | :--- |
| **Type** | Full-stack | Micro-framework | Micro-framework (Async) |
| **Batteries** | Everything included | Minimal | Minimal (+ Async Support) |
| **Speed** | Moderate | Fast | Very Fast |
| **Ease of Learning** | Moderate | Easy | Moderate |

**"Batteries included" Philosophy:**
Django-তে প্রয়োজনীয় প্রায় সবকিছুই বিল্ট-ইন থাকে। যেমন:
- Authentication system
- Admin Interface
- ORM (Database connector)
- Middleware
- URL routing

**Who uses Django?**
বিশ্বের অনেক বড় বড় কোম্পানি Django ব্যবহার করে:
- **Instagram:** তাদের পুরো ব্যাকএন্ড Django দিয়ে তৈরি।
- **Pinterest:** স্কেলেবিলিটির জন্য Django ব্যবহার করে।
- **Spotify:** ডাটা ম্যানেজমেন্টের জন্য।
- **Disqus, Bitbucket, YouTube, Dropbox (partially)**।
