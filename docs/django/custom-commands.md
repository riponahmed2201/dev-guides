# Custom Management Commands

Django তে `python manage.py migrate` বা `python manage.py createsuperuser` এর মতো বিল্ট-ইন কমান্ড রয়েছে। আপনি নিজের প্রয়োজন অনুযায়ী কাস্টম কমান্ড তৈরি করতে পারেন (যেমন: ডেটা ইম্পোর্ট, ক্লিনআপ স্ক্রিপ্ট ইত্যাদি)।

## Directory Structure

কাস্টম কমান্ড তৈরি করতে আপনার অ্যাপের মধ্যে নিম্নলিখিত স্ট্রাকচার তৈরি করতে হবে:

```
myapp/
    management/
        __init__.py
        commands/
            __init__.py
            my_command.py
```

## BaseCommand Class

প্রতিটি কমান্ড `django.core.management.base.BaseCommand` ক্লাস ইনহেরিট করে এবং `handle()` মেথড ইমপ্লিমেন্ট করে।

```python
# myapp/management/commands/greet.py
from django.core.management.base import BaseCommand

class Command(BaseCommand):
    help = 'Greets the user'

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS('Hello, World!'))
```

**Run:**
```bash
python manage.py greet
```

## Command Arguments

পজিশনাল আর্গুমেন্ট যোগ করার জন্য `add_arguments()` মেথড ব্যবহার করা হয়।

```python
class Command(BaseCommand):
    help = 'Greets a specific user'

    def add_arguments(self, parser):
        parser.add_argument('name', type=str, help='Name of the user')

    def handle(self, *args, **options):
        name = options['name']
        self.stdout.write(f'Hello, {name}!')
```

**Run:**
```bash
python manage.py greet John
```

## Command Options

অপশনাল ফ্ল্যাগ যোগ করার জন্য `--` প্রিফিক্স ব্যবহার করা হয়।

```python
def add_arguments(self, parser):
    parser.add_argument(
        '--uppercase',
        action='store_true',
        help='Display name in uppercase',
    )

def handle(self, *args, **options):
    name = "World"
    if options['uppercase']:
        name = name.upper()
    self.stdout.write(f'Hello, {name}!')
```

**Run:**
```bash
python manage.py greet --uppercase
```

## Scheduling Commands

### 1. Cron Jobs (Linux/Mac)
```bash
# crontab -e
0 2 * * * cd /path/to/project && python manage.py my_command
```

### 2. Celery Beat (Recommended)
Celery Beat দিয়ে পিরিয়ডিক টাস্ক শিডিউল করা যায়।

```python
# settings.py
from celery.schedules import crontab

CELERY_BEAT_SCHEDULE = {
    'run-every-morning': {
        'task': 'myapp.tasks.cleanup_task',
        'schedule': crontab(hour=2, minute=0),
    },
}
```
