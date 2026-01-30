# Custom Template Backends

Django-র শক্তিশালী টেমপ্লেট ল্যাঙ্গুয়েজ (DTL) ছাড়াও আপনি চাইলে অন্য কোনো টেমপ্লেট ইঞ্জিন (যেমন- Jinja2) ব্যবহার করতে পারেন। Django-র টেমপ্লেট ব্যাকএন্ড API আপনাকে একাধিক ইঞ্জিন এক সাথে ব্যবহার করার স্বাধীনতা দেয়।

## 1. TEMPLATES Configuration

`settings.py`-তে `TEMPLATES` সেটিংসের মাধ্যমে ব্যাকএন্ড কনফিগার করা হয়। আপনি চাইলে একাধিক ইঞ্জিন ডিফাইন করতে পারেন।

```python
TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [BASE_DIR / 'templates'],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
    {
        'BACKEND': 'django.template.backends.jinja2.Jinja2',
        'DIRS': [BASE_DIR / 'jinja2'],
        'APP_DIRS': True,
        'OPTIONS': {
            'environment': 'myproject.jinja2.environment',
        },
    },
]
```

## 2. Jinja2 Integration

Jinja2 পাইথনের একটি অত্যন্ত জনপ্রিয় এবং দ্রুত টেমপ্লেট ইঞ্জিন। Django-তে এটি ব্যবহার করার জন্য:

- একটি `jinja2` ফোল্ডার তৈরি করুন।
- `environment.py` ফাইল তৈরি করে Jinja2 এনভায়রনমেন্ট কনফিগার করুন।
- Django ভিউ থেকে সাধারণভাবেই `render()` কল করলে Django স্বয়ংক্রিয়ভাবে সঠিক ইঞ্জিন সিলেক্ট করে নিবে।

## 3. Template Context Processors

কনটেক্সট প্রসেসর হলো এমন কিছু ফাংশন যা প্রতিটি টেমপ্লেটে কিছু কমন ডেটা (যেমন- কারেন্ট ইউজার, সাইট সেটিংস) অটোমেটিক পাঠিয়ে দেয়।

- এটি শুধুমাত্র `DjangoTemplates` ব্যাকএন্ডে কাজ করে।
- কাস্টম কনটেক্সট প্রসেসর তৈরি করে আপনি গ্লোবাল ভেরিয়েবল সেট করতে পারেন।

## 4. Template Loaders

Loaders ঠিক করে Django কোথায় এবং কিভাবে টেমপ্লেট ফাইলগুলো খুঁজবে।

- **Filesystem Loader:** `DIRS` এ দেওয়া পাথে টেমপ্লেট খোঁজে।
- **App Directories Loader:** প্রতিটি ইনস্টলড অ্যাপের `templates` ফোল্ডারে টেমপ্লেট খোঁজে।
- আপনি চাইলে কাস্টম লোডার তৈরি করে ডাটাবেস বা অন্য কোনো সোর্স থেকেও টেমপ্লেট লোড করতে পারেন।

## 5. Custom Template Engines

যদি আপনি একদম নতুন কোনো টেমপ্লেট লাইব্রেরি ইন্টিগ্রেট করতে চান, তবে আপনাকে `django.template.backends.base.BaseEngine` ক্লাসটি ইনহেরিট করে একটি কাস্টম ব্যাকএন্ড তৈরি করতে হবে। এতে আপনাকে `from_string()` এবং `get_template()` মেথডগুলো ইমপ্লিমেন্ট করতে হবে।
