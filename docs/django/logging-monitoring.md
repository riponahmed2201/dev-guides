# Logging and Monitoring

একটি প্রোডাকশন গ্রেড অ্যাপ্লিকেশনে লগিং এবং মনিটরিং অত্যন্ত গুরুত্বপূর্ণ। এর মাধ্যমে অ্যাপ্লিকেশনের পারফরম্যান্স ট্র্যাক করা এবং এরর ডিবাগ করা সহজ হয়।

## 1. Python Logging Basics

Python-এর স্ট্যান্ডার্ড লাইব্রেরিতে `logging` মডিউল রয়েছে যা দিয়ে মেসেজ রেকর্ড করা যায়। লগের কিছু প্রধান গুরুত্ব হলো:

- অ্যাপ্লিকেশন ফ্লো ট্র্যাক করা।
- ডায়াগনস্টিক ইনফরমেশন সংগ্রহ করা।
- সিকিউরিটি অডিট করা।

## 2. Django Logging Configuration

Django তে `LOGGING` সেটিংসের মাধ্যমে লগ কনফিগার করা হয়। এটি ৪টি কম্পোনেন্ট নিয়ে গঠিত:

1. **Loggers:** লগ মেসেজ রিসিভ করে এবং হ্যান্ডেলার এ পাঠায়।
2. **Handlers:** লগ কোথায় সেভ হবে (Console, File, Email) তা নির্ধারণ করে।
3. **Filters:** কোন লগগুলো পাস হবে তা ফিল্টার করে।
4. **Formatters:** লগের ফরম্যাট কেমন হবে তা ঠিক করে।

**Example Configuration (`settings.py`):**

```python
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'verbose': {
            'format': '{levelname} {asctime} {module} {message}',
            'style': '{',
        },
    },
    'handlers': {
        'console': {
            'level': 'DEBUG',
            'class': 'logging.StreamHandler',
            'formatter': 'verbose'
        },
        'file': {
            'level': 'INFO',
            'class': 'logging.FileHandler',
            'filename': 'django.log',
            'formatter': 'verbose'
        },
    },
    'loggers': {
        'django': {
            'handlers': ['console', 'file'],
            'level': 'INFO',
            'propagate': True,
        },
    },
}
```

## 3. Log Levels

লগ মেসেজকে গুরুত্ব অনুযায়ী বিভিন্ন লেভেলে ভাগ করা যায়:

- **DEBUG:** লো-লেভেল ইনফরমেশন (ডেভেলপমেন্টে দরকারি)।
- **INFO:** জেনারেল সিস্টেম ইনফরমেশন।
- **WARNING:** ভবিষ্যতে কোনো সমস্যা হতে পারে এমন সংকেত।
- **ERROR:** বড় কোনো সমস্যা বা এক্সেপশন।
- **CRITICAL:** অ্যাপ্লিকেশন শাটডাউন হতে পারে এমন সিরিয়াস সমস্যা।

## 4. Application Monitoring

অ্যাপ্লিকেশনের রিয়েল-টাইম হেলথ চেক করার জন্য মনিটরিং টুলস ব্যবহার করা হয়।

- **New Relic:** সার্ভার পারফরম্যান্স, ডাটাবেস কোয়েরি এবং এন্ডপয়েন্ট রেসপন্স টাইম মনিটর করে।
- **Datadog:** ক্লাউড স্কেল অ্যাপ্লিকেশন মনিটরিং এবং সিকিউরিটি অডিট করতে সাহায্য করে।

## 5. Error Tracking (Sentry)

Sentry হলো একটি পাওয়ারফুল এরর ট্র্যাকিং টুল যা অ্যাপ্লিকেশনে কোনো বাগ বা এক্সেপশন হলে তা ডিটেইলড রিপোর্ট সহ (যেমন- স্ট্যাক ট্রেস, ইউজার ডাটা) নোটিফিকেশন পাঠায়।

**Integration:**

```bash
pip install sentry-sdk
```

```python
import sentry_sdk
from sentry_sdk.integrations.django import DjangoIntegration

sentry_sdk.init(
    dsn="YOUR_SENTRY_DSN",
    integrations=[DjangoIntegration()],
    traces_sample_rate=1.0,
    send_default_pii=True
)
```

## 6. Performance Monitoring (Scout APM)

Scout APM ব্যবহার করে পাইথন অ্যাপ্লিকেশনের N+1 কোয়েরি, মেমোরি ব্লোউট এবং স্লো রিকোয়েস্ট আইডেন্টিফাই করা যায়। এটি ডেভেলপারদের জন্য পারফরম্যান্স অপ্টিমাইজেশন সহজ করে দেয়।
