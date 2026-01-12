# Celery Integration

Django সিঙ্ক্রোনাস ফ্রেমওয়ার্ক, মানে একটি রিকোয়েস্ট প্রসেস হওয়ার সময় ব্রাউজার অপেক্ষা করে। কিন্তু কিছু কাজ (যেমন: ইমেইল পাঠানো, রিপোর্ট জেনারেট করা) অনেক সময় নেয়। এসব কাজ ব্যাকগ্রাউন্ডে চালানোর জন্য **Celery** ব্যবহার করা হয়।

## Installation

```bash
pip install celery redis
```

## Configuration

**১. `celery.py` তৈরি করুন (প্রোজেক্ট ফোল্ডারে):**

```python
# myproject/celery.py
import os
from celery import Celery

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'myproject.settings')

app = Celery('myproject')
app.config_from_object('django.conf:settings', namespace='CELERY')
app.autodiscover_tasks()
```

**২. `__init__.py` আপডেট করুন:**

```python
# myproject/__init__.py
from .celery import app as celery_app

__all__ = ('celery_app',)
```

**৩. `settings.py` এ Broker কনফিগার করুন:**

```python
# settings.py
CELERY_BROKER_URL = 'redis://localhost:6379/0'
CELERY_RESULT_BACKEND = 'redis://localhost:6379/0'
CELERY_ACCEPT_CONTENT = ['json']
CELERY_TASK_SERIALIZER = 'json'
```

## Message Brokers

Celery কাজ করার জন্য একটি মেসেজ ব্রোকার দরকার যা টাস্ক কিউ ম্যানেজ করে।

- **Redis** (সহজ, জনপ্রিয়)
- **RabbitMQ** (এন্টারপ্রাইজ গ্রেড)

**Redis চালু করুন:**
```bash
redis-server
```

## Task Definition

টাস্ক তৈরি করতে `@shared_task` ডেকোরেটর ব্যবহার করা হয়।

```python
# myapp/tasks.py
from celery import shared_task
from django.core.mail import send_mail

@shared_task
def send_welcome_email(user_email):
    send_mail(
        'Welcome!',
        'Thank you for signing up.',
        'from@example.com',
        [user_email],
    )
    return f"Email sent to {user_email}"
```

**টাস্ক কল করা:**

```python
# views.py
from .tasks import send_welcome_email

def register_user(request):
    # ... user creation logic ...
    send_welcome_email.delay(user.email) # Async execution
    return HttpResponse("Registration successful!")
```

## Running Celery Worker

```bash
celery -A myproject worker --loglevel=info
```

## Periodic Tasks (Celery Beat)

নির্দিষ্ট সময় পরপর টাস্ক চালানোর জন্য Celery Beat ব্যবহার করা হয়।

**Installation:**
```bash
pip install django-celery-beat
```

**Configuration:**
```python
# settings.py
INSTALLED_APPS += ['django_celery_beat']

from celery.schedules import crontab

CELERY_BEAT_SCHEDULE = {
    'send-daily-report': {
        'task': 'myapp.tasks.generate_daily_report',
        'schedule': crontab(hour=9, minute=0),
    },
}
```

**Run Beat:**
```bash
celery -A myproject beat --loglevel=info
```

## Task Monitoring (Flower)

Celery টাস্ক মনিটর করার জন্য **Flower** একটি ওয়েব-বেসড টুল।

```bash
pip install flower
celery -A myproject flower
```
ব্রাউজারে `http://localhost:5555` এ যান।
