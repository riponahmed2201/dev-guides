# Class Based Views (CBV)

Django-তে ভিউ (View) দুইভাবে লেখা যায়:
1.  **FBV (Function Based Views):** সাধারণ পাইথন ফাংশন যা `request` নেয় এবং `response` রিটার্ন করে।
2.  **CBV (Class Based Views):** পাইথন ক্লাস যা ভিউ এর কাজ করে।

---

## ১. CBV vs FBV (কেন CBV ব্যবহার করবেন?)

| Function Based View (FBV) | Class Based View (CBV) |
| :--- | :--- |
| কোড পড়া এবং বোঝা সহজ। | শুরুতে একটু কঠিন মনে হতে পারে। |
| ছোট কাজের জন্য সেরা। | বড় এবং জটিল কাজের জন্য সেরা। |
| কোড রিইউজ করা কঠিন। | **Inheritance** এবং **Mixins** এর মাধ্যমে কোড রিইউজ করা খুব সহজ। |
| `if request.method == 'POST':` এভাবে মেথড চেক করতে হয়। | আলাদা মেথড থাকে (যেমন `def get()`, `def post()`)। |

**CBV এর মূল সুবিধা:**
- **Code Reusability:** একই লজিক বারবার লিখতে হয় না।
- **Mixins:** একাধিক ক্লাস থেকে ফিচার ইনহেরিট করা যায়।
- **Generic Views:** Django আগে থেকেই সাধারণ কাজের জন্য (CRUD) বিল্ট-ইন ক্লাস দিয়ে রেখেছে।

---

## ২. বেসিক `View` ক্লাস এবং `as_view()`

সব CBV মূলত `django.views.View` ক্লাস থেকে ইনহেরিট করে।

**urls.py এ ব্যবহার:**
CBV সরাসরি URL এ ব্যবহার করা যায় না। একে ফাংশনে রূপান্তর করতে `as_view()` মেথড কল করতে হয়।

```python
# views.py
from django.views import View
from django.http import HttpResponse

class MyView(View):
    def get(self, request):
        return HttpResponse("Hello from Class Based View!")

# urls.py
from django.urls import path
from .views import MyView

urlpatterns = [
    path('hello/', MyView.as_view(), name='hello'),
]
```

---

## ৩. Method Dispatching (GET, POST)

FBV-তে আমরা `if` কন্ডিশন দিয়ে মেথড চেক করি। কিন্তু CBV-তে মেথডের নামেই ফাংশন থাকে। Django অটোমেটিক উপযুক্ত মেথড কল করে (একে **Dispatching** বলে)।

```python
class ContactView(View):
    def get(self, request):
        # ফর্ম দেখাও
        return render(request, 'contact.html')

    def post(self, request):
        # ডাটা প্রসেস করো
        data = request.POST
        # ... logic ...
        return HttpResponse("Form Submitted!")
```

---

## ৪. `TemplateView` (স্ট্যাটিক পেজের জন্য)

যদি আপনার ভিউ এর কাজ শুধু একটি টেমপ্লেট রেন্ডার করা হয়, তবে `View` ক্লাস ব্যবহার না করে `TemplateView` ব্যবহার করা স্মার্ট।

```python
from django.views.generic import TemplateView

class AboutView(TemplateView):
    template_name = "about.html"
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['title'] = "About Us" # টেমপ্লেটে ডাটা পাঠানো
        return context
```

অথবা সরাসরি `urls.py` তেও ব্যবহার করা যায় (কোনো views.py কোড ছাড়াই!):
```python
path('about/', TemplateView.as_view(template_name="about.html")),
```

---

## ৫. `RedirectView`

কোনো URL রিডাইরেক্ট করার জন্য।

```python
from django.views.generic import RedirectView

class GoToGoogle(RedirectView):
    url = "https://google.com"
```

অথবা `urls.py` তে:
```python
path('go-google/', RedirectView.as_view(url='https://google.com')),
```

---

## ৬. Mixins (CBV এর সুপারপাওয়ার)

Mixins হলো ছোট ছোট ক্লাস যা মেইন ভিউ ক্লাসের সাথে যুক্ত হয়ে এক্সট্রা ফিচার দেয়। Django এবং বিভিন্ন লাইব্রেরি (যেমন `django-braces`) অনেক কাজের Mixin দেয়।

**উদাহরণ: `LoginRequiredMixin`**
FBV-তে আমরা `@login_required` ডেকোরেটর ব্যবহার করি। CBV-তে আমরা Mixin ব্যবহার করি।

```python
from django.contrib.auth.mixins import LoginRequiredMixin
from django.views.generic import TemplateView

class DashboardView(LoginRequiredMixin, TemplateView):
    template_name = "dashboard.html"
    login_url = '/login/' # লগইন না থাকলে এখানে পাঠাবে
```

> **সতর্কতা:** Mixin সবসময় প্যারেন্ট ক্লাসের লিস্টে **সবার বামে** রাখতে হয়।
> `class ViewName(Mixin, BaseView):` (Correct) ✅
> `class ViewName(BaseView, Mixin):` (Incorrect) ❌

---

## ৭. সারসংক্ষেপ

1.  **`View`:** বেসিক প্যারেন্ট ক্লাস। কাস্টম লজিকের জন্য ব্যবহার হয়।
2.  **`TemplateView`:** শুধু HTML পেজ রেন্ডার করার জন্য।
3.  **`RedirectView`:** রিডাইরেক্ট করার জন্য।
4.  **`as_view()`:** ক্লাসকে ভিউ ফাংশনে রূপান্তর করে URL-এ ব্যবহারের উপযোগী করে।
5.  **Mixins:** ক্লাসের ক্ষমতা বাড়ায় (যেমন অথেন্টিকেশন চেক)।
