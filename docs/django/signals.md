# Django Signals

Django Signals হলো এমন একটি মেকানিজম বা স্ট্র্যাটেজি যা ফ্রেমওয়ার্কের এক অংশে কোনো ঘটনা (Event) ঘটলে অন্য অংশে নোটিফিকেশন পাঠাতে ব্যবহৃত হয়। এটি **Observer Design Pattern** অনুসরণ করে।

সহজ কথায়, যখন কোনো নির্দিষ্ট অ্যাকশন ঘটে (যেমন: ডেটাবেসে কোনো অবজেক্ট সেভ হওয়া বা ডিলিট হওয়া), তখন সিগন্যাল অটোমেটিক্যালি ট্রিগার হয় এবং সেই সিগন্যালের সাথে যুক্ত ফাংশনগুলো (রিসিভার) এক্সিকিউট হয়। এটি কোডকে **De-coupled** রাখতে সাহায্য করে।

## Built-in Signals

Django তে বেশ কিছু বিল্ট-ইন সিগন্যাল রয়েছে। সবচেয়ে বেশি ব্যবহৃত কিছু সিগন্যাল হলো:

`django.db.models.signals` মডিউলে থাকে:

1.  **`pre_save`**: কোনো মডেলের `save()` মেথড কল হওয়ার ঠিক আগে ট্রিগার হয়।
2.  **`post_save`**: কোনো মডেলের `save()` মেথড কল হয়ে ডেটা সেভ হওয়ার ঠিক পরে ট্রিগার হয়।
3.  **`pre_delete`**: কোনো মডেলের `delete()` মেথড বা কুয়েরিসেট ডিলিট হওয়ার আগে ট্রিগার হয়।
4.  **`post_delete`**: কোনো মডেল বা কুয়েরিসেট ডিলিট হওয়ার পরে ট্রিগার হয়।
5.  **`m2m_changed`**: যখন কোনো `ManyToManyField` এ পরিবর্তন আসে।

অন্যান্য:
- **`request_started`**, **`request_finished`**: HTTP রিকোয়েস্ট শুরু বা শেষ হলে।

## Signal Receivers & Decorator

সিগন্যাল রিসিভ করার জন্য আমাদের একটি ফাংশন বা মেথড লিখতে হয়, যাকে **Receiver** বলা হয়। এই রিসিভারকে সিগন্যালের সাথে কানেক্ট করার জন্য `Signal.connect()` মেথড অথবা `@receiver` ডেকোরেটর ব্যবহার করা হয়।

সবচেয়ে সহজ এবং জনপ্রিয় উপায় হলো **`@receiver`** ডেকোরেটর ব্যবহার করা।

```python
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth.models import User
from .models import Profile

@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)
```

এখানে:
- **`sender=User`**: স্পেসিফাই করে দিচ্ছে যে শুধুমাত্র `User` মডেল সেভ হলেই এই সিগন্যাল কাজ করবে।
- **`created`**: এটি একটি বুলিয়ান ভ্যালু। যদি নতুন রেকর্ড তৈরি হয় তবে `True`, আর আপডেট হলে `False`।
- **`instance`**: যেই অবজেক্টটি সেভ হয়েছে তার ইন্সটেন্স।

## Connecting Signals

সিগন্যাল কোড সাধারণত `models.py` এ লেখা হয় না (ইম্পোর্ট লুপ এড়াতে)। এর জন্য বেস্ট প্র্যাকটিস হলো অ্যাপ ফোল্ডারে একটি `signals.py` ফাইল তৈরি করা এবং `apps.py` এর `ready()` মেথডে সেটি ইম্পোর্ট করে রেজিস্টার করা।

**১. `signals.py` তৈরি করা:**
আপনার অ্যাপের ভেতরে `signals.py` ফাইলে সিগন্যাল রিসিভার কোড লিখুন।

**২. `apps.py` কনফিগার করা:**

```python
from django.apps import AppConfig

class AccountConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'account'

    def ready(self):
        import account.signals  # সিগন্যাল কানেক্ট করা হচ্ছে
```

## Custom Signals

আপনি চাইলে নিজের অ্যাপ্লিকেশনের জন্যও কাস্টম সিগন্যাল তৈরি করতে পারেন।

১. সিগন্যাল ডিফাইন করা:

```python
# signals.py
from django.dispatch import Signal

# একটি কাস্টম সিগন্যাল তৈরি
payment_completed = Signal()
```

২. সিগন্যাল পাঠানো (Send):

```python
# views.py
from .signals import payment_completed

def process_payment(request):
    # ... পেমেন্ট লজিক ...
    payment_completed.send(sender=request.user, amount=500)
```

৩. সিগন্যাল রিসিভ করা:

```python
@receiver(payment_completed)
def send_payment_email(sender, amount, **kwargs):
    print(f"Payment received from {sender}: {amount}")
```

## Use Cases

কখন সিগন্যাল ব্যবহার করবেন?
1.  **User Profile Creation:** ইউজার সাইন-আপ করার সাথে সাথে অটোমেটিক প্রোফাইল তৈরি করতে (`post_save`)।
2.  **Notification System:** কোনো পোস্ট বা কমেন্ট হলে ইউজারকে নোটিফাই করতে।
3.  **Cache Invalidation:** ডেটা আপডেট হলে ক্যাশ ক্লিয়ার করতে।
4.  **Log Entry:** ক্রিটিক্যাল অ্যাকশনের লগ রাখতে।

তবে মনে রাখবেন, সিগন্যাল কোডের ফ্লো বোঝা একটু কঠিন করে দেয়। তাই যদি মডেলের `save()` মেথড ওভাররাইড করে বা সরাসরি ভিউতে কাজ করা সম্ভব হয়, তবে সিগন্যাল এড়িয়ে চলাই ভালো।
