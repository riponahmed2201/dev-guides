# Email Sending

Web অ্যাপ্লিকেশনে ইমেইল পাঠানো একটি কমন রিকোয়ারমেন্ট (যেমন: পাসওয়ার্ড রিসেট, ওয়েলকাম ইমেইল)। Django তে ইমেইল পাঠানোর জন্য বিল্ট-ইন `django.core.mail` মডিউল আছে যা SMTP এর উপর ভিত্তি করে কাজ করে।

## Email Configuration (SMTP)

প্রোডাকশনে ইমেইল পাঠানোর জন্য আপনাকে `settings.py` ফাইলে SMTP সার্ভারের ডিটেইলস কনফিগার করতে হবে। উদাহরণস্বরূপ, Gmail এর জন্য:

```python
# settings.py

EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_PORT = 587
EMAIL_USE_TLS = True
EMAIL_HOST_USER = 'your-email@gmail.com'
EMAIL_HOST_PASSWORD = 'your-app-password' # অ্যাপ পাসওয়ার্ড ব্যবহার করুন
```

## `send_mail()` Function

সহজ এবং সাধারণ টেক্সট ইমেইল পাঠানোর জন্য `send_mail()` ফাংশন ব্যবহার করা হয়।

```python
from django.core.mail import send_mail
from django.conf import settings

def send_welcome_email(request):
    subject = 'Welcome to My Site'
    message = 'Thank you for creating an account!'
    email_from = settings.EMAIL_HOST_USER
    recipient_list = ['user@example.com',]

    send_mail( subject, message, email_from, recipient_list )
```

## `EmailMessage` Class

যদি আপনি অ্যাডভান্সড ফিচার চান যেমন—`BCC`, `CC`, বা এটাচমেন্ট, তবে `EmailMessage` ক্লাস ব্যবহার করতে হবে।

```python
from django.core.mail import EmailMessage

email = EmailMessage(
    'Subject here',
    'Here is the message.',
    'from@example.com',
    ['to@example.com'],
    ['bcc@example.com'],
    headers={'Reply-To': 'another@example.com'},
)
email.send()
```

## HTML Emails & Attachments

HTML ইমেইল পাঠানোর জন্য `EmailMultiAlternatives` ক্লাস ব্যবহার করা ভালো, এটি টেক্সট এবং HTML উভয় ভার্সন পাঠাতে পারে।

```python
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string

def send_html_email(user):
    subject = "Welcome!"
    from_email = "admin@example.com"
    to = [user.email]

    # টেমপ্লেট থেকে কন্টেন্ট রেন্ডার করা
    html_content = render_to_string('emails/welcome.html', {'user': user})
    text_content = "This is an important message."

    msg = EmailMultiAlternatives(subject, text_content, from_email, to)
    msg.attach_alternative(html_content, "text/html")
    
    # ফাইল এটাচমেন্ট
    # msg.attach_file('/path/to/file.pdf')
    
    msg.send()
```

## Email Backends

ডেভেলপমেন্টের সময় সত্যিকারের ইমেইল না পাঠিয়ে কনসোলে প্রিন্ট করা সুবিধাজনক।

`settings.py`:
```python
# টেস্টিং এর জন্য কনসোল ব্যাকএন্ড
EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'
```

এর ফলে সব ইমেইল টার্মিনালে বা কনসোলে প্রিন্ট হবে।

## Async Email Sending

SMTP প্রটোকল স্লো হতে পারে, তাই মেইন থ্রেডে ইমেইল পাঠালে ইউজারের রিকোয়েস্ট ব্লক হয়ে থাকতে পারে। প্রোডাকশনে ইমেইল সবসময় **Asynchronously** পাঠানো উচিত।

এর জন্য জনপ্রিয় সলিউশন হলো **Celery**।

```python
# tasks.py (Celery Task)
from celery import shared_task
from django.core.mail import send_mail

@shared_task
def send_email_task(subject, message, recipient):
    send_mail(subject, message, 'admin@example.com', [recipient])
    return "Email Sent"
```

বিকল্প হিসেবে ছোট প্রজেক্টে **Threading** ব্যবহার করা যেতে পারে, তবে বড় স্কেলে Celery বা Redis Queue ব্যবহার করা বেস্ট প্র্যাকটিস।
