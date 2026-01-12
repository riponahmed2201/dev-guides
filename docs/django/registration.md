# User Registration & Account Management

লগইন সিস্টেমের পরেই আসে রেজিস্ট্রেশন বা সাইনআপ। Django-তে এটি খুব সহজেই `UserCreationForm` দিয়ে করা যায়। এছাড়াও ইমেইল ভেরিফিকেশন এবং পাসওয়ার্ড রিসেট এর মতো ফিচারগুলো কীভাবে ইমপ্লিমেন্ট করতে হয় তা আমরা দেখবো।

---

## ১. খুব সহজে রেজিস্ট্রেশন (`UserCreationForm`)

Django একটি বিল্ট-ইন ফর্ম দেয় যা ইউজারের নাম এবং পাসওয়ার্ড (দুইবার) ইনপুট নেয় এবং ভ্যালিডেশন করে ইউজার তৈরি করে।

**views.py:**
```python
from django.contrib.auth.forms import UserCreationForm
from django.urls import reverse_lazy
from django.views.generic import CreateView

class SignUpView(CreateView):
    form_class = UserCreationForm
    success_url = reverse_lazy('login') # সফল হলে লগইন পেজে পাঠাবে
    template_name = 'signup.html'
```

**signup.html:**
```html
<h2>Sign Up</h2>
<form method="post">
    {% csrf_token %}
    {{ form.as_p }}
    <button type="submit">Sign Up</button>
</form>
```

---

## ২. কাস্টম রেজিস্ট্রেশন ফর্ম (Extra Fields)

`UserCreationForm` ডিফল্টভাবে শুধু ইউজারনেম আর পাসওয়ার্ড নেয়। যদি আপনি ইমেইল বা ফার্স্ট নেমও নিতে চান, তবে ফর্মটি ইনহেরিট করে কাস্টমাইজ করতে হবে।

**forms.py:**
```python
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User
from django import forms

class SignUpForm(UserCreationForm):
    email = forms.EmailField(required=True)
    first_name = forms.CharField(max_length=30)

    class Meta:
        model = User
        fields = ('username', 'first_name', 'email') # পাসওয়ার্ড অটোমেটিক আসবে
    
    def save(self, commit=True):
        user = super().save(commit=False)
        user.email = self.cleaned_data['email']
        user.first_name = self.cleaned_data['first_name']
        if commit:
            user.save()
        return user
```

---

## ৩. ইমেইল ভেরিফিকেশন (Email Verification)

ইউজার সত্যি ইমেইলটির মালিক কি না তা যাচাই করার জন্য। এটি করার সবচেয়ে সহজ উপায় হলো ইউজারের `is_active=False` করে রাখা এবং ইমেইলে একটি লিংক পাঠানো।

**লজিক ফ্লো:**
১. ইউজার সাইনআপ করলে `is_active=False` থাকবে।
২. একটি ইউনিক টোকেন জেনারেট করে ইমেইলে লিংক পাঠানো হবে।
৩. ইউজার লিংকে ক্লিক করলে একটি ভিউ চেক করবে টোকেন ঠিক আছে কি না।
৪. ঠিক থাকলে `is_active=True` করে তাকে লগইন করানো হবে।

*(এটি ম্যানুয়ালি করা একটু জটিল, তাই প্রফেশনাল প্রজেক্টে সাধারণত `django-allauth` প্যাকেজ ব্যবহার করা হয়)*

ম্যানুয়াল উদাহরণের জন্য `PasswordResetTokenGenerator` ব্যবহার করা যেতে পারে ইউনিক টোকেন বানাতে।

---

## ৪. পাসওয়ার্ড রিসেট (Password Reset)

ইউজার পাসওয়ার্ড ভুলে গেলে ইমেইলের মাধ্যমে রিসেট লিংক পাঠানো। এটি Django-তে একদম রেডিমেড আছে।

**urls.py:**
```python
from django.contrib.auth import views as auth_views

urlpatterns = [
    # ১. ইমেইল চাওয়ার ফর্ম
    path('password-reset/', 
         auth_views.PasswordResetView.as_view(template_name='password_reset.html'), 
         name='password_reset'),

    # ২. ইমেইল পাঠানো হয়েছে মেসেজ
    path('password-reset/done/', 
         auth_views.PasswordResetDoneView.as_view(template_name='password_reset_done.html'), 
         name='password_reset_done'),

    # ৩. নতুন পাসওয়ার্ড সেট করার লিংক (ইমেইল থেকে এখানে আসবে)
    path('password-reset-confirm/<uidb64>/<token>/', 
         auth_views.PasswordResetConfirmView.as_view(template_name='password_reset_confirm.html'), 
         name='password_reset_confirm'),

    # ৪. পাসওয়ার্ড রিসেট সম্পন্ন মেসেজ
    path('password-reset-complete/', 
         auth_views.PasswordResetCompleteView.as_view(template_name='password_reset_complete.html'), 
         name='password_reset_complete'),
]
```

---

## ৫. Custom User Model (কেন এবং কীভাবে?)

প্রজেক্টের মাঝপথে ডিফল্ট ইউজার মডেল পরিবর্তন করা খুব কঠিন। তাই প্রজেক্ট শুরুর **আগেই** কাস্টম ইউজার মডেল সেটআপ করা বেস্ট প্র্যাকটিস।

যেমন: আপনি ইউজারনেম এর বদলে **ইমেইল** দিয়ে লগইন করাতে চান।

**models.py:**
```python
from django.contrib.auth.models import AbstractUser
from django.db import models

class CustomUser(AbstractUser):
    mobile_number = models.CharField(max_length=15, blank=True)
    birth_date = models.DateField(null=True, blank=True)
    
    # ইমেইল ইউনিক হতে হবে
    email = models.EmailField(unique=True) 
```

**settings.py:**
```python
AUTH_USER_MODEL = 'myapp.CustomUser'
```

**admin.py:**
কাস্টম ইউজার মডেল এডমিন প্যানেলে দেখানোর জন্য `UserAdmin` কাস্টমাইজ করতে হয়।

```python
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser

class CustomUserAdmin(UserAdmin):
    # ফিল্ডসেট আপডেট করতে হবে নতুন ফিল্ড দেখানোর জন্য
    pass

admin.site.register(CustomUser, CustomUserAdmin)
```
