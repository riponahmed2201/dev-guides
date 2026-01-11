# Templates Basics

Django-তে **Templates** হলো HTML ফাইল যা আপনার অ্যাপ্লিকেশনের ইউজার ইন্টারফেস (UI) তৈরি করে। Django তার নিজস্ব **Django Template Language (DTL)** ব্যবহার করে ডায়নামিক ডেটা দেখানোর জন্য।

---

## ১. Django Template Language (DTL)

DTL হলো একটি পাওয়ারফুল ল্যাঙ্গুয়েজ যা HTML-এর ভেতরে লজিক এবং ভেরিয়েবল ব্যবহারের সুযোগ দেয়। এটি ব্রাউজারে রান করে না, বরং সার্ভারে রেন্ডার হয়ে প্লেইন HTML হিসেবে ব্রাউজারে পাঠানো হয়।

মূল সিনট্যাক্স ৩ প্রকার:
1. **Variables:** `\{{ variable }}` - ডেটা প্রিন্ট করার জন্য।
2. **Tags:** `{% tag %}` - লজিক (if/loop) এর জন্য।
3. **Filters:** `\{{ value|filter }}` - ডেটা ফরম্যাট করার জন্য।

---

## ২. Template Configuration & Rendering

### কনফিগারেশন
Django যাতে টেমপ্লেট খুঁজে পায়, তার জন্য `settings.py` ফাইলে `DIRS` সেট করতে হয়:

```python
# settings.py
import os

TEMPLATES = [
    {
        # ...
        'DIRS': [BASE_DIR / 'templates'], # এখানে ফোল্ডারের নাম দিন
        # ...
    },
]
```

### Rendering from View
ভিউ ফাংশন থেকে টেমপ্লেট রেন্ডার করার জন্য `render()` ফাংশন ব্যবহার করা হয়:

```python
def profile(request):
    user_info = {'name': 'Ripon', 'role': 'Admin'}
    return render(request, 'profile.html', context=user_info)
```

---

## ৩. Template Syntax

### Variables
Context থেকে পাঠানো ডেটা দেখানোর জন্য ডাবল কার্লি ব্রেস ব্যবহার করা হয়।

```html
<h1>Welcome, {{ name }}!</h1>
<p>User Role: {{ role }}</p>
```

### Tags
লজিক্যাল অপারেশন চালানোর জন্য ব্যবহার হয়।

**Loop:**
```html
<ul>
    {% for item in items %}
        <li>{{ item }}</li>
    {% endfor %}
</ul>
```

**If-Else:**
```html
{% if user.is_authenticated %}
    <p>Hello, User!</p>
{% else %}
    <p>Please login.</p>
{% endif %}
```

### Filters
ডেটা মডিফাই করার জন্য পাইপ `|` ক্যারেক্টার ব্যবহার করা হয়।

```html
<p>{{ name|lower }}</p>  <!-- ছোট হাতের অক্ষর -->
<p>{{ date|date:"D d M Y" }}</p> <!-- তারিখ ফরম্যাট -->
<p>{{ description|truncatewords:30 }}</p> <!-- ৩০ শব্দ পর্যন্ত দেখাবে -->
```

---

## ৪. Template Inheritance (Extends & Block)

সব পেজে একই হেডার, ফুটার বা মেনু বারবার না লিখে **Inheritance** ব্যবহার করা হয়। এটি Django-র অন্যতম শক্তিশালী ফিচার।

### Base Template (`base.html`)
এখানে কমন অংশগুলো থাকে এবং পরিবর্তনশীল অংশের জন্য `block` ডিফাইন করা হয়।

```html
<!DOCTYPE html>
<html>
<head>
    <title>{% block title %}My Site{% endblock %}</title>
</head>
<body>
    <nav>Menu...</nav>

    <main>
        {% block content %}
        {% endblock %}
    </main>

    <footer>Footer...</footer>
</body>
</html>
```

### Child Template (`home.html`)
চাইল্ড টেমপ্লেট `base.html` কে `extends` করে এবং ব্লকের ভেতর নিজস্ব কন্টেন্ট বসায়।

```html
{% extends 'base.html' %}

{% block title %}Home Page{% endblock %}

{% block content %}
    <h1>Welcome to Home Page</h1>
    <p>This is the dynamic content.</p>
{% endblock %}
```

---

## ৫. include Tag

ছোট কোনো অংশ (যেমন: কার্ড, বাটন) যা একাধিক পেজে ব্যবহার হয়, সেগুলোকে আলাদা ফাইলে রেখে `include` করা যায়।

```html
<!-- navbar.html -->
<nav>...</nav>

<!-- base.html -->
<body>
    {% include 'navbar.html' %}
    ...
</body>
```

---

## ৬. Static Files in Templates

CSS, JavaScript, বা Image ফাইলগুলো টেমপ্লেটে লোড করার জন্য `{% load static %}` ব্যবহার করতে হয়।

```html
{% load static %}

<!DOCTYPE html>
<html>
<head>
    <link rel="stylesheet" href="{% static 'css/style.css' %}">
</head>
<body>
    <img src="{% static 'images/logo.png' %}" alt="Logo">
    <script src="{% static 'js/main.js' %}"></script>
</body>
</html>
```

---

## ৭. Context Data

Context হলো একটি ডিকশনারি যা ভিউ থেকে টেমপ্লেটে ডেটা পাস করে।

```python
def dashboard(request):
    context = {
        'total_users': 500,
        'recent_posts': Post.objects.all()[:5],
        'site_name': 'My Awesome Blog'
    }
    return render(request, 'dashboard.html', context)
```

টেমপ্লেটে এগুলো অ্যাক্সেস করা হয় কী (Key) এর নাম দিয়ে: `\{{ total_users }}`, `\{{ site_name }}`।

---

::: tip পরবর্তী ধাপ
অভিনন্দন! আপনি Django Templates এর বেসিক ধারণা পেয়েছেন। পরবর্তী চ্যাপ্টারে আমরা শিখবো **Models (ORM Basics)** সম্পর্কে, যা দিয়ে আমরা ডাটাবেস এর সাথে কাজ করবো।
:::
