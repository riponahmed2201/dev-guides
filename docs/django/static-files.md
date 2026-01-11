# Static Files

Django-তে **Static Files** বলতে বোঝায় সেই সব ফাইল যা অ্যাপ্লিকেশনের সাথে সরাসরি সার্ভ করা হয় এবং সাধারণত পরিবর্তিত হয় না। যেমন: CSS, JavaScript, এবং Images (Logo, Icons ইত্যাদি)।

---

## ১. Static Files কনফিগারেশন

`settings.py` ফাইলে স্ট্যাটিক ফাইলের জন্য কিছু গুরুত্বপূর্ণ কনফিগারেশন থাকে।

```python
# settings.py

# ১. ব্রাউজারে বা টেমপ্লেটে এই URL দিয়ে ফাইল অ্যাক্সেস করা হবে
STATIC_URL = 'static/'

# ২. প্রোডাকশনে সব স্ট্যাটিক ফাইল এই ফোল্ডারে জমা হবে (collectstatic কমান্ডের মাধ্যমে)
STATIC_ROOT = BASE_DIR / 'staticfiles'

# ৩. ডেভেলপমেন্টের সময় অতিরিক্ত ফোল্ডার থেকে ফাইল খোঁজার জন্য
STATICFILES_DIRS = [
    BASE_DIR / 'static',
]
```

---

## ২. টেমপ্লেটে Static Files ব্যবহার

টেমপ্লেটে স্ট্যাটিক ফাইল ব্যবহার করার জন্য প্রথমে `{% load static %}` ট্যাগটি লোড করতে হয়।

```html
{% load static %}

<!DOCTYPE html>
<html>
<head>
    <!-- CSS ফাইল লোড করা -->
    <link rel="stylesheet" href="{% static 'css/style.css' %}">
</head>
<body>
    <!-- ইমেজ ফাইল লোড করা -->
    <img src="{% static 'images/logo.png' %}" alt="My Logo">

    <!-- জাভাস্ক্রিপ্ট ফাইল লোড করা -->
    <script src="{% static 'js/script.js' %}"></script>
</body>
</html>
```

---

## ৩. প্রোজেক্টে ফোল্ডার স্ট্রাকচার

সাধারণত বেস্ট প্র্যাকটিস হলো প্রজেক্টের রুটে একটি `static` ফোল্ডার তৈরি করা এবং তার ভেতরে ফাইলগুলো রাখা।

```text
myproject/
├── manage.py
├── myproject/
├── static/           # আপনার তৈরি করা স্ট্যাটিক ফোল্ডার
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   └── script.js
│   └── images/
│       └── logo.png
└── templates/
```

---

## ৪. collectstatic কমান্ড (Production)

ডেভেলপমেন্ট সার্ভারে (`runserver`) Django অটোমেটিক স্ট্যাটিক ফাইল সার্ভ করে। কিন্তু প্রোডাকশনে (যেমন: Nginx, Apache, বা AWS S3) আপনাকে সব স্ট্যাটিক ফাইল এক জায়গায় জড় করতে হয়।

এর জন্য নিচের কমান্ডটি ব্যবহার করা হয়:

```bash
python manage.py collectstatic
```

এটি আপনার প্রজেক্টের সব অ্যাপ এবং `STATICFILES_DIRS` থেকে ফাইলগুলো কপি করে `STATIC_ROOT` ফোল্ডারে (যেমন: `staticfiles`-এ) জমা করে।

---

## ৫. Development vs Production

> [!NOTE]
> **Debug Mode (DEBUG=True):** Django অটোমেটিক স্ট্যাটিক ফাইল সার্ভ করে।
> **Production Mode (DEBUG=False):** Django আর স্ট্যাটিক ফাইল সার্ভ করে না। তখন `collectstatic` কমান্ড চালিয়ে ওয়েব সার্ভার (Nginx/Apache) বা হোয়াইটনয়েজ (WhiteNoise) লাইব্রেরি ব্যবহার করতে হয়।

---

::: tip পরবর্তী ধাপ
অভিনন্দন! আপনি Static Files সম্পর্কে বিস্তারিত জেনেছেন। পরবর্তী চ্যাপ্টারে আমরা শিখবো **Media Files** সম্পর্কে, যা ইউজারদের আপলোড করা ফাইল হ্যান্ডেল করে।
:::
