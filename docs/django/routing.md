# URLs and Routing

Django-তে **URL Configuration (URLconf)** হলো ট্রাফিক কন্ট্রোলারের মতো। এটি ঠিক করে দেয় যে ব্রাউজারে কোন লিঙ্ক টাইপ করলে আপনার কোডের কোন ফাংশনটি কাজ করবে।

---

## ১. URL Patterns

URL patterns হলো একটি কালেকশন যা ব্রাউজার থেকে আসা রিকোয়েস্টের পাথের সাথে আপনার কোডের ম্যাপিং করে। Django প্রতিটি রিকোয়েস্টের URL-কে সিরিয়ালি প্রথম থেকে শেষ পর্যন্ত চেক করে এবং প্রথম যে প্যাটার্নটির সাথে মিলে যায়, সেই অনুযায়ী কাজ করে।

---

## ২. path() Function

`path()` হলো Django-র সবচেয়ে কমন রাউটিং ফাংশন। এটি সাধারণত ৪টি আর্গুমেন্ট নেয়:
- **route:** পাথের স্ট্রিং (যেমন: `'about/'`)।
- **view:** যে ফাংশনটি কল হবে।
- **kwargs:** (Optional) ডিকশনারি আকারে অতিরিক্ত ডেটা।
- **name:** (Optional) পাথের একটি নাম (Reverse URL এর জন্য)।

```python
from django.urls import path
from . import views

urlpatterns = [
    path('contact/', views.contact, name='contact'),
]
```

---

## ৩. re_path() for Regex

যদি আপনার খুব জটিল কোনো URL প্যাটার্ন প্রয়োজন হয় যা সাধারণ `path()` দিয়ে সম্ভব নয়, তবে আপনি `re_path()` বা Regular Expression ব্যবহার করতে পারেন।

```python
from django.urls import re_path

urlpatterns = [
    re_path(r'^articles/(?P<year>[0-9]{4})/$', views.year_archive),
]
```

---

## ৪. URL Parameters & Path Converters

ডায়নামিক URL হ্যান্ডেল করার জন্য Django-তে Path Converters ব্যবহার করা হয়। এটি URL থেকে ডেটা ফিল্টার করে এবং ভেরিয়েবল হিসেবে ভিউ ফাংশনে পাঠায়।

```python
path('post/<int:id>/', views.post_detail),
```

### কমন Path Converters:
- `str`: ড্যাশ ছাড়া যেকোনো স্ট্রিং (Default)।
- `int`: পূর্ণ সংখ্যা (যেমন: ১, ২, ৩)।
- `slug`: হাইফেন বা আন্ডারস্কোরযুক্ত স্ট্রিং (যেমন: `how-to-learn-django`)।
- `uuid`: একটি নির্দিষ্ট ফরম্যাটের আইডি।
- `path`: স্লাশসহ যেকোনো স্ট্রিং।

---

## ৫. include() for App URLs

প্রজেক্ট বড় হলে সব রাউট প্রজেক্টের `urls.py`-তে রাখা কঠিন। তাই প্রতিটি অ্যাপের জন্য আলাদা `urls.py` তৈরি করা হয় এবং সেটিকে প্রজেক্টের সাথে `include()` দিয়ে কানেক্ট করা হয়।

```python
# Project's urls.py
from django.urls import path, include

urlpatterns = [
    path('blog/', include('blog.urls')),
]
```

---

## ৬. URL Namespacing

যখন প্রজেক্টে অনেকগুলো অ্যাপ থাকে এবং একাধিক অ্যাপে একই নামের রাউট থাকতে পারে, তখন বিভ্রান্তি এড়াতে URL Namespacing ব্যবহার করা হয়।

```python
# app's urls.py
app_name = 'blog'
urlpatterns = [
    path('detail/', views.detail, name='detail'),
]
```

এখন অন্য জায়গা থেকে অ্যাক্সেস করতে হলে `blog:detail` ব্যবহার করতে হবে।

---

## ৭. Reverse URL Resolution

কোডের ভেতরে সরাসরি হার্ডকোড করা লিঙ্ক (যেমন: `/blog/post/5/`) ব্যবহার করা ঠিক নয়। এর বদলে `reverse()` ফাংশন অথবা `{% url %}` ট্যাগ ব্যবহার করে লিঙ্কের নাম দিয়ে ডায়নামিকালি লিঙ্ক তৈরি করা হয়। একেই **URL Reversing** বলে।

**Template-এ:**
```html
<a href="{% url 'blog:post_detail' id=5 %}">Read Post</a>
```

**Python কোডে:**
```python
from django.urls import reverse
url = reverse('blog:post_detail', args=[5])
```

---

## ৮. URL Naming কেন জরুরি?

- **Flexibility:** আপনি যদি আপনার লিংকের পাথ (`post/` থেকে `articles/`) পরিবর্তন করেন, তবে আপনাকে পুরো প্রজেক্টের কোড খুঁজতে হবে না। শুধু `urls.py`-তে পরিবর্তন করলেই হবে, কারণ লিংকের নাম অপরিবর্তিত থাকছে।
- **Readability:** নাম দেখে বোঝা সহজ যে লিংকটি কীসের জন্য।

---

::: tip পরবর্তী ধাপ
অভিনন্দন! আপনি Django রাউটিং সম্পর্কে বিস্তারিত জেনেছেন। পরবর্তী চ্যাপ্টারে আমরা শিখবো **Views (Function Based Views)** সম্পর্কে।
:::
