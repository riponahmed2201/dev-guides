# Background Jobs (RQ)

Celery শক্তিশালী কিন্তু কনফিগারেশন কমপ্লেক্স। যদি আপনার সিম্পল ব্যাকগ্রাউন্ড জব দরকার হয়, তবে **RQ (Redis Queue)** একটি সহজ বিকল্প।

## RQ vs Celery

| Feature | RQ | Celery |
|---------|-------|--------|
| **Setup** | সহজ | জটিল |
| **Broker** | শুধু Redis | Redis, RabbitMQ, etc. |
| **Use Case** | সিম্পল টাস্ক | কমপ্লেক্স ওয়ার্কফ্লো |
| **Monitoring** | RQ Dashboard | Flower |

## Installation

```bash
pip install rq django-rq
```

## Configuration

```python
# settings.py
INSTALLED_APPS = [
    # ...
    'django_rq',
]

RQ_QUEUES = {
    'default': {
        'HOST': 'localhost',
        'PORT': 6379,
        'DB': 0,
    },
    'high': {
        'HOST': 'localhost',
        'PORT': 6379,
        'DB': 0,
    },
}
```

**URLs:**
```python
# urls.py
urlpatterns = [
    path('django-rq/', include('django_rq.urls')),
]
```

## Creating Jobs

```python
# tasks.py
import time

def send_email(user_email):
    time.sleep(5)  # Simulate email sending
    print(f"Email sent to {user_email}")
    return f"Success: {user_email}"
```

## Enqueuing Jobs

```python
# views.py
import django_rq

def register_user(request):
    # ... user creation logic ...
    
    # Enqueue job
    queue = django_rq.get_queue('default')
    queue.enqueue('myapp.tasks.send_email', user.email)
    
    return HttpResponse("Registration successful!")
```

## Running Workers

```bash
python manage.py rqworker default
```

একাধিক কিউ একসাথে চালাতে:
```bash
python manage.py rqworker default high
```

## Job Scheduling (Delayed Tasks)

```python
from datetime import timedelta
import django_rq

scheduler = django_rq.get_scheduler('default')

# 10 মিনিট পরে চালাবে
scheduler.enqueue_in(
    timedelta(minutes=10),
    'myapp.tasks.send_reminder',
    user_id=123
)

# নির্দিষ্ট সময়ে চালাবে
from datetime import datetime
scheduler.enqueue_at(
    datetime(2024, 12, 31, 23, 59),
    'myapp.tasks.new_year_greeting'
)
```

## Periodic Tasks (Cron-like)

```python
# Cron syntax: minute hour day month day_of_week
scheduler.cron(
    "0 9 * * *",  # প্রতিদিন সকাল ৯টায়
    func='myapp.tasks.daily_report',
    queue_name='default'
)
```

## Task Retry

```python
from rq import Retry

queue.enqueue(
    'myapp.tasks.flaky_task',
    retry=Retry(max=3, interval=[10, 30, 60])  # 3 বার চেষ্টা করবে
)
```

## Monitoring (RQ Dashboard)

```bash
pip install rq-dashboard
rq-dashboard
```

ব্রাউজারে `http://localhost:9181` এ যান।

## Job Result Storage

```python
job = queue.enqueue('myapp.tasks.calculate_report')
print(job.id)  # Job ID

# পরে রেজাল্ট চেক করা
from rq.job import Job
from django_rq import get_connection

job = Job.fetch(job_id, connection=get_connection())
if job.is_finished:
    print(job.result)
```
