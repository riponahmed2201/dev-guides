# DRF Authentication

API তে কে এক্সেস করতে পারবে আর কে পারবে না তা নিয়ন্ত্রণ করার জন্য Authentication প্রয়োজন। DRF এ গ্লোবালি বা প্রতি ভিউ লেভেলে অথেনটিকেশন সেট করা যায়।

## Global Configuration

`settings.py` ফাইলে ডিফল্ট অথেনটিকেশন ক্লাস সেট করা যায়:

```python
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework.authentication.SessionAuthentication',
        'rest_framework.authentication.TokenAuthentication',
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated',
    ],
}
```

## 1. SessionAuthentication

এটি Django-র ডিফল্ট সেশন ব্যাকএন্ড ব্যবহার করে। এটি ব্রাউজার বেসড ক্লায়েন্ট (যেখানে কুকিজ সাপোর্ট করে) এর জন্য উপযুক্ত।

- **সুবিধা:** CSRF প্রোটেকশন বিল্ট-ইন থাকে।
- **অসুবিধা:** স্টেটলেস API বা মোবাইল অ্যাপের জন্য খুব একটা সুবিধাজনক নয়।

## 2. TokenAuthentication

এটি একটি সিম্পল টোকেন বেসড সিস্টেম। প্রতিটি ইউজারের জন্য একটি ইউনিক টোকেন জেনারেট হয়। ক্লায়েন্ট সেই টোকেনটি হেডার হিসেবে পাঠায়।

**Setup:**
১. `INSTALLED_APPS` এ `'rest_framework.authtoken'` যোগ করুন।
২. `python manage.py migrate` রান করুন।

**Token Request Format:**
```http
Authorization: Token 9944b09199c62bcf9418ad846dd0e4bbdfc6ee4b
```

## 3. JWT Authentication (SimpleJWT)

Jason Web Token (JWT) হলো মডার্ন এবং সিকিউর অথেনটিকেশন পদ্ধতি, যা স্টেটলেস। DRF এর জন্য `djangorestframework-simplejwt` লাইব্রেরিটি জনপ্রিয়।

**Installation:**
```bash
pip install djangorestframework-simplejwt
```

**Configuration:**
```python
# settings.py
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    )
}
```

**URL Routing:**
```python
# urls.py
from django.urls import path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
```

**Token Request process:**
1. ক্লায়েন্ট `username` এবং `password` দিয়ে `/api/token/` এ POST রিকোয়েস্ট পাঠাবে।
2. সার্ভার `access` এবং `refresh` টোকেন রিটার্ন করবে।
3. ক্লায়েন্ট `access` টোকেন দিয়ে অথেনটিকেটেড রিকোয়েস্ট পাঠাবে:
   ```http
   Authorization: Bearer <access_token>
   ```
4. `access` টোকেন মেয়াদ শেষ হলে `refresh` টোকেন দিয়ে নতুন টোকেন নিবে।

## Custom Authentication

খুব বিশেষ প্রয়োজনে `BaseAuthentication` ক্লাস ইনহেরিট করে কাস্টম অথেনটিকেশন স্কিম তৈরি করা যায়।

```python
from rest_framework.authentication import BaseAuthentication
from django.contrib.auth.models import User

class ExampleAuthentication(BaseAuthentication):
    def authenticate(self, request):
        username = request.META.get('HTTP_X_USERNAME')
        if not username:
            return None
        
        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            raise exceptions.AuthenticationFailed('No such user')

        return (user, None)
```
