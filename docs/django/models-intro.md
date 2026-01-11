# Models Introduction & ORM Basics

Django-তে **Models** হলো আপনার অ্যাপ্লিকেশনের ডেটা স্ট্রাকচার বা ব্লুপ্রিন্ট। সাধারণত প্রতিটি মডেল ডেটাবেসের একটি টেবিলের সাথে ম্যাপ করে।

---

## ১. ORM (Object-Relational Mapping) কি?

ORM হলো এমন একটি টেকনিক যা আপনাকে SQL কোড না লিখেই পাইথন ক্লাসের মাধ্যমে ডেটাবেসের সাথে কাজ করতে দেয়।
- **SQL:** `INSERT INTO users (name, age) VALUES ('Ripon', 25);`
- **Django ORM:** `User.objects.create(name='Ripon', age=25)`

Django ORM অটোমেটিক আপনার পাইথন কোডকে ডেটাবেসের জন্য প্রয়োজনীয় SQL কোডে রূপান্তর করে নেয়।

---

## ২. Model Definition

একটি মডেল তৈরি করতে `models.Model` ক্লাসকে ইনহেরিট করতে হয়।

```python
from django.db import models

class Product(models.Model):
    name = models.CharField(max_length=200)
    price = models.IntegerField()
    description = models.TextField()
    is_active = models.BooleanField(default=True)
```

এটি ডেটাবেসে `appname_product` নামে একটি টেবিল তৈরি করবে।

---

## ৩. Field Types (কমন ফিল্ডসমূহ)

| Field Type | ব্যবহার | উদাহরণ |
| :--- | :--- | :--- |
| `CharField` | ছোট টেক্সট (নাম, টাইটেল) | `name = models.CharField(max_length=100)` |
| `TextField` | বড় টেক্সট (বর্ণনা, ব্লগ পোস্ট) | `body = models.TextField()` |
| `IntegerField` | পূর্ণ সংখ্যা | `age = models.IntegerField()` |
| `DecimalField` | দশমিক সংখ্যা (টাকা/পয়সা) | `price = models.DecimalField(max_digits=10, decimal_places=2)` |
| `BooleanField` | সত্য/মিথ্যা (চেকবক্স) | `is_published = models.BooleanField(default=False)` |
| `DateTimeField` | তারিখ ও সময় | `created_at = models.DateTimeField(auto_now_add=True)` |
| `EmailField` | ইমেইল ভ্যালিডেশনসহ টেক্সট | `email = models.EmailField()` |

---

## ৪. Field Options

ফিল্ডগুলোর বিহেভিয়ার নিয়ন্ত্রণ করার জন্য কিছু কমন অপশন ব্যবহার করা হয়:

- `max_length`: চারফিল্ডের জন্য সর্বোচ্চ ক্যারেক্টার সংখ্যা।
- `default`: ডিফল্ট ভ্যালু সেট করা।
- `null=True`: ডেটাবেসে ফাঁকা (NULL) ভ্যালু রাখা যাবে কি না।
- `blank=True`: ফর্মে ফিল্ডটি ফাঁকা রাখা যাবে কি না।
- `unique=True`: ডুপ্লিকেট ভ্যালু আটকানোর জন্য।
- `verbose_name`: এডমিন প্যানেলে ফিল্ডের নাম সুন্দর করে দেখানোর জন্য।

---

## ৫. Database Migrations

যখনই আপনি `models.py`-তে কোনো পরিবর্তন করবেন, সেই পরিবর্তনটি ডেটাবেসে অ্যাপ্লাই করার জন্য দুটি স্টেপ ফলো করতে হয়।

**Step 1: makemigrations**
পরিবর্তনগুলো ডিটেক্ট করে নতুন মাইগ্রেশন ফাইল তৈরি করে।
```bash
python manage.py makemigrations
```

**Step 2: migrate**
SQL কমান্ড জেনারেট করে ডেটাবেস আপডেট করে।
```bash
python manage.py migrate
```

> [!IMPORTANT]
> প্রজেক্টে প্রথমবার কাজ শুরু করার সময় অবশ্যই `migrate` কমান্ডটি চালাতে হবে।

---

## ৬. Database Configuration

Django ডিফল্টভাবে **SQLite** ডেটাবেস ব্যবহার করে, যা ছোট প্রজেক্ট বা প্র্যাকটিসের জন্য চমৎকার। এটি `settings.py` ফাইলে কনফিগার করা থাকে।

```python
# settings.py

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}
```

আপনি চাইলে সহজেই এখানে PostgreSQL, MySQL বা Oracle সেটআপ করতে পারেন।

---

## ৭. Admin Panel Model Registration

আপনার মডেলটি Django-র এডমিন প্যানেলে দেখার জন্য `admin.py` ফাইলে রেজিস্টার করতে হবে।

```python
# app/admin.py
from django.contrib import admin
from .models import Product

admin.site.register(Product)
```

এখন আপনি `python manage.py runserver` চালিয়ে এডমিন প্যানেল (`/admin`) থেকে প্রোডাক্ট তৈরি, এডিট বা ডিলিট করতে পারবেন।

---

::: tip পরবর্তী ধাপ
অভিনন্দন! আপনি Django Models এবং ORM এর বেসিক ধারণা পেয়েছেন। পরবর্তী চ্যাপ্টারে আমরা শিখবো **Working with Data (CRUD Operations)** সম্পর্কে।
:::
