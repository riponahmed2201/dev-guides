# Custom User Model

Django তে ডিফল্ট `User` মডেলে সব কমন ফিল্ড (Username, Email, Password, First/Last Name) থাকে। কিন্তু প্রফেশনাল অ্যাপ্লিকেশনে প্রায়ই আমাদের বাড়তি তথ্যের প্রয়োজন হয় (যেমন: Phone Number, Date of Birth, Bio) বা আমরা চাই ইউজার Username এর বদলে Email দিয়ে লগইন করুক। এসব ক্ষেত্রে **Custom User Model** ব্যবহার করা অপরিহার্য।

> [!TIP]
> প্রোজেক্টের শুরুতেই Custom User Model সেটআপ করা বেস্ট প্র্যাকটিস। কারণ প্রোজেক্টের মাঝপথে ইউজার মডেল পরিবর্তন করা অনেক জটিল এবং ডাটাবেস মাইগ্রেশনে সমস্যা তৈরি করতে পারে।

## AbstractUser vs AbstractBaseUser

Django তে কাস্টম ইউজার মডেল তৈরির দুটি প্রধান উপায় রয়েছে:

1.  **`AbstractUser`**:
    - আপনি যদি Django-র ডিফল্ট ইউজার মডেলের সব সুবিধা (ফিল্ডস এবং পারমিশন) চান এবং শুধু অতিরিক্ত কিছু ফিল্ড যোগ করতে চান।
    - এটি ব্যবহার করা সহজ।

2.  **`AbstractBaseUser`**:
    - আপনি যদি সম্পূর্ণ নতুনভাবে ইউজার মডেল ডিফাইন করতে চান।
    - যেমন: Username ফিল্ডটিই বাদ দিয়ে দিবেন এবং শুধু Email দিয়ে লগইন করাবেন।
    - এটি ফ্লেক্সিবল কিন্তু কনফিগারেশন একটু বেশি লাগে (Manager লিখতে হয়)।

## Implementation: AbstractUser (Simple)

যদি আপনার শুধু নতুন ফিল্ড দরকার হয়:

```python
# models.py
from django.contrib.auth.models import AbstractUser
from django.db import models

class CustomUser(AbstractUser):
    bio = models.TextField(blank=True)
    phone_number = models.CharField(max_length=15, blank=True)
    birth_date = models.DateField(null=True, blank=True)
```

## Implementation: AbstractBaseUser (Advanced - Email as Username)

যদি আপনি ইমেইল দিয়ে লগইন ইমপ্লিমেন্ট করতে চান:

**১. মডেল তৈরি করা:**

```python
# models.py
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.db import models
from django.utils import timezone
from .managers import CustomUserManager

class CustomUser(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField("email address", unique=True)
    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    date_joined = models.DateTimeField(default=timezone.now)

    USERNAME_FIELD = "email"  # লগইনের জন্য ইমেইল ব্যবহার হবে
    REQUIRED_FIELDS = []      # সুপারইউজার তৈরির সময় আর কি কি ফিল্ড চাইবে

    objects = CustomUserManager()

    def __str__(self):
        return self.email
```

**২. কাস্টম ম্যানেজার তৈরি করা:**

`AbstractBaseUser` ব্যবহার করলে আপনাকে অবশ্যই বলে দিতে হবে কিভাবে ইউজার এবং সুপারইউজার তৈরি হবে।

```python
# managers.py
from django.contrib.auth.base_user import BaseUserManager

class CustomUserManager(BaseUserManager):
    def create_user(self, email, password, **extra_fields):
        if not email:
            raise ValueError("The Email must be set")
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save()
        return user

    def create_superuser(self, email, password, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        extra_fields.setdefault("is_active", True)

        if extra_fields.get("is_staff") is not True:
            raise ValueError("Superuser must have is_staff=True.")
        if extra_fields.get("is_superuser") is not True:
            raise ValueError("Superuser must have is_superuser=True.")
        
        return self.create_user(email, password, **extra_fields)
```

## Configuration (`AUTH_USER_MODEL`)

মডেল তৈরি হয়ে গেলে `settings.py` ফাইলে Django কে জানিয়ে দিতে হবে যে আপনি কাস্টম মডেল ব্যবহার করছেন।

```python
# settings.py
# Format: 'app_label.ModelName'
AUTH_USER_MODEL = 'accounts.CustomUser'
```

## Migration Considerations

1.  **নতুন প্রোজেক্টে:**
    - মডেল এবং সেটিংস ঠিক করার পর `makemigrations` এবং `migrate` কমান্ড দিন।
2.  **চলমান প্রোজেক্টে:**
    - এটি বেশ ঝুঁকিপূর্ণ। পুরনো `auth_user` টেবিল থেকে ডেটা মাইগ্রেট করতে হয়। সাধারণত ডেটাবেস ড্রপ করে নতুন করে শুরু করা সহজ সমাধান যদি প্রোডাকশন ডেটা না থাকে।
