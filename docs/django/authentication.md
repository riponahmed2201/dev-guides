# Django User Authentication (লগইন সিস্টেম)

Django-তে ইউজার ম্যানেজমেন্ট এবং অথেন্টিকেশন সিস্টেম (User Authentication System) বিল্ট-ইন (Built-in) থাকে। অর্থাৎ, লগইন, লগআউট, পাসওয়ার্ড রিসেট—এই কাজগুলোর জন্য আপনাকে স্ক্র্যাচ থেকে কোড লিখতে হবে না।

---

## ১. ডিফল্ট `User` মডেল

Django `django.contrib.auth.models` প্যাকেজে একটি শক্তিশালী `User` মডেল দেয়। এর প্রধান ফিল্ডগুলো হলো:
- `username`
- `password`
- `email`
- `first_name`
- `last_name`
- `is_staff` (এডমিন প্যানেলে ঢুকতে পারবে কি না)
- `is_active` (অ্যাকাউন্ট চালু আছে কি না)
- `is_superuser` (সব পারমিশন আছে কি না)
- `date_joined`
- `last_login`

**বিকল্প:** আপনি চাইলে এই মডেলটি এক্সটেন্ড করতে পারেন (OneToOneField দিয়ে) অথবা সম্পূর্ণ কাস্টম ইউজার মডেল তৈরি করতে পারেন (শুরুতেই করা ভালো)।

---

## ২. ম্যানুয়াল Login এবং Logout

যদি আপনি কাস্টম ভিউতে লগইন বা লগআউট করাতে চান:

```python
from django.contrib.auth import authenticate, login, logout
from django.shortcuts import redirect

def login_view(request):
    if request.method == 'POST':
        username = request.POST['username']
        password = request.POST['password']
        
        # ১. ইউজার চেক করা (সঠিক কিনা)
        user = authenticate(request, username=username, password=password)
        
        if user is not None:
            # ২. লগইন করানো (সেশন তৈরি হয়)
            login(request, user)
            return redirect('home')
        else:
            print("Invalid login details")
            
    return render(request, 'login.html')

def logout_view(request):
    # ৩. লগআউট করানো (সেশন ডিলিট হয়)
    logout(request)
    return redirect('login')
```

---

## ৩. Django Built-in Auth Views (Class Based)

ম্যানুয়ালি ভিউ না লিখে Django-র বিল্ট-ইন ক্লাস ব্যবহার করা সবচেয়ে সহজ।

`urls.py`-তে:
```python
from django.urls import path
from django.contrib.auth import views as auth_views

urlpatterns = [
    # Login View
    path('login/', auth_views.LoginView.as_view(template_name='login.html'), name='login'),
    
    # Logout View (GET মেথডে কাজ করে না, POST লাগে, অথবা settings এ কনফিগার করতে হয়)
    path('logout/', auth_views.LogoutView.as_view(next_page='login'), name='logout'),
]
```

**Password Change & Reset Views:**
Django পাসওয়ার্ড পরিবর্তনের জন্যও রেডিমেড ভিউ দেয়:
- `PasswordChangeView`
- `PasswordChangeDoneView`
- `PasswordResetView` (ইমেইল পাঠানোর জন্য)
- `PasswordResetConfirmView` (লিংকে ক্লিক করার পর)

---

## ৪. অ্যাক্সেস কন্ট্রোল (Access Control)

কোনো ভিউতে এক্সেস আটকানোর জন্য (যেমন: শুধু লগইন করা ইউজার ড্যাশবোর্ড দেখবে)।

### ৪.১ Function Based View (FBV) - `@login_required`

```python
from django.contrib.auth.decorators import login_required

@login_required(login_url='/login/') # লগইন না থাকলে এখানে পাঠাবে
def dashboard(request):
    return render(request, 'dashboard.html')
```

### ৪.২ Class Based View (CBV) - `LoginRequiredMixin`

```python
from django.contrib.auth.mixins import LoginRequiredMixin
from django.views.generic import TemplateView

class DashboardView(LoginRequiredMixin, TemplateView):
    template_name = "dashboard.html"
    login_url = '/login/'
```

---

## ৫. পাসওয়ার্ড ম্যানেজমেন্ট

Django পাসওয়ার্ড কখনো প্লেইন টেক্সটে (Plain Text) সেভ করে না। এটি `PBKDF2` অ্যালগরিদম ব্যবহার করে হ্যাশ (Hash) তৈরি করে।

### ৫.১ পাসওয়ার্ড সেট বা পরিবর্তন করা

```python
u = User.objects.get(username='ripon')
u.set_password('new_secure_password')
u.save()
```

### ৫.২ পাসওয়ার্ড চেক করা
```python
if u.check_password('some_password'):
    print("Correct!")
```

### ৫.৩ Password Validators
পাসওয়ার্ড কতটা শক্তিশালী হবে তা কনফিগার করা যায় `settings.py` তে।

```python
AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
        'OPTIONS': {'min_length': 8}, # মিনিমাম ৮ ক্যারেক্টার
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]
```
