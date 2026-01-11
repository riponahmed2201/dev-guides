# Views - Function Based Views (FBV)

Django-তে **View** হলো এমন একটি Python ফাংশন যা একটি HTTP রিকোয়েস্ট নেয় এবং একটি HTTP রেসপন্স রিটার্ন করে। এটি আপনার অ্যাপ্লিকেশনের বিজনেস লজিক হ্যান্ডেল করে।

---

## ১. View Function Basics

একটি সাধারণ ভিউ ফাংশন এরকম দেখতে:

```python
from django.http import HttpResponse

def home(request):
    return HttpResponse("Hello, Django!")
```

এই ফাংশনটি:
- `request` অবজেক্ট প্যারামিটার হিসেবে নেয়।
- একটি `HttpResponse` অবজেক্ট রিটার্ন করে।

---

## ২. HttpRequest এবং HttpResponse

### HttpRequest
প্রতিটি ভিউ ফাংশনের প্রথম আর্গুমেন্ট হলো `HttpRequest` অবজেক্ট। এতে ব্রাউজার থেকে আসা সব তথ্য থাকে:
- `request.method`: HTTP মেথড (GET, POST, PUT, DELETE)
- `request.GET`: URL প্যারামিটার (query string)
- `request.POST`: ফর্ম ডেটা
- `request.user`: লগইন করা ইউজার
- `request.path`: URL পাথ

### HttpResponse
এটি হলো সবচেয়ে বেসিক রেসপন্স টাইপ। আপনি সরাসরি HTML স্ট্রিং রিটার্ন করতে পারেন:

```python
def about(request):
    html = "<h1>About Us</h1><p>We are awesome!</p>"
    return HttpResponse(html)
```

---

## ৩. Request Methods (GET, POST)

### GET Request
ডেটা পড়ার জন্য ব্যবহার হয় (যেমন: পেজ লোড করা)।

```python
def search(request):
    query = request.GET.get('q', '')  # URL: /search/?q=django
    return HttpResponse(f"Searching for: {query}")
```

### POST Request
ডেটা সাবমিট করার জন্য ব্যবহার হয় (যেমন: ফর্ম সাবমিশন)।

```python
def contact(request):
    if request.method == 'POST':
        name = request.POST.get('name')
        return HttpResponse(f"Thanks {name}!")
    return HttpResponse("Send us a message")
```

---

## ৪. Request Object Attributes

কিছু গুরুত্বপূর্ণ অ্যাট্রিবিউট:

- `request.method`: `'GET'`, `'POST'`, `'PUT'`, `'DELETE'`
- `request.GET`: QueryDict (URL parameters)
- `request.POST`: QueryDict (Form data)
- `request.FILES`: আপলোড করা ফাইল
- `request.COOKIES`: ব্রাউজার কুকিজ
- `request.session`: সেশন ডেটা
- `request.user`: বর্তমান ইউজার
- `request.META`: HTTP headers এবং server info

---

## ৫. Response Types

### JsonResponse
JSON ডেটা রিটার্ন করার জন্য:

```python
from django.http import JsonResponse

def api_data(request):
    data = {'name': 'Django', 'version': '5.0'}
    return JsonResponse(data)
```

### FileResponse
ফাইল ডাউনলোড করার জন্য:

```python
from django.http import FileResponse

def download_pdf(request):
    file = open('document.pdf', 'rb')
    return FileResponse(file, as_attachment=True, filename='my_doc.pdf')
```

---

## ৬. Shortcuts (render, redirect, get_object_or_404)

### render()
টেমপ্লেট রেন্ডার করার সবচেয়ে সহজ উপায়:

```python
from django.shortcuts import render

def home(request):
    context = {'title': 'Home Page', 'user': 'Ripon'}
    return render(request, 'home.html', context)
```

### redirect()
অন্য URL-এ রিডাইরেক্ট করার জন্য:

```python
from django.shortcuts import redirect

def old_page(request):
    return redirect('new-page')  # URL name
    # অথবা: return redirect('/new-page/')
```

### get_object_or_404()
ডাটাবেস থেকে অবজেক্ট না পেলে 404 এরর দেখানোর জন্য:

```python
from django.shortcuts import get_object_or_404
from .models import Post

def post_detail(request, id):
    post = get_object_or_404(Post, id=id)
    return render(request, 'post.html', {'post': post})
```

---

## ৭. HTTP Status Codes

Django অটোমেটিক স্ট্যাটাস কোড সেট করে, তবে আপনি ম্যানুয়ালি সেট করতে পারেন:

```python
from django.http import HttpResponse

def custom_response(request):
    return HttpResponse("Created!", status=201)
```

### কমন Status Codes:
- **200 OK**: সফল রিকোয়েস্ট
- **201 Created**: নতুন রিসোর্স তৈরি হয়েছে
- **204 No Content**: সফল কিন্তু কোনো কন্টেন্ট নেই
- **301 Moved Permanently**: পার্মানেন্ট রিডাইরেক্ট
- **302 Found**: টেম্পরারি রিডাইরেক্ট
- **400 Bad Request**: ভুল রিকোয়েস্ট
- **401 Unauthorized**: অথেন্টিকেশন প্রয়োজন
- **403 Forbidden**: পারমিশন নেই
- **404 Not Found**: পেজ পাওয়া যায়নি
- **500 Internal Server Error**: সার্ভার এরর

---

## ৮. Complete Example

```python
from django.shortcuts import render, redirect, get_object_or_404
from django.http import HttpResponse, JsonResponse
from .models import Article

def article_list(request):
    articles = Article.objects.all()
    return render(request, 'articles/list.html', {'articles': articles})

def article_detail(request, id):
    article = get_object_or_404(Article, id=id)
    return render(request, 'articles/detail.html', {'article': article})

def article_create(request):
    if request.method == 'POST':
        title = request.POST.get('title')
        content = request.POST.get('content')
        Article.objects.create(title=title, content=content)
        return redirect('article-list')
    return render(request, 'articles/create.html')

def api_articles(request):
    articles = Article.objects.values('id', 'title')
    return JsonResponse(list(articles), safe=False)
```

---

::: tip পরবর্তী ধাপ
অভিনন্দন! আপনি Django Function Based Views সম্পর্কে বিস্তারিত জেনেছেন। পরবর্তী চ্যাপ্টারে আমরা শিখবো **Templates** সম্পর্কে।
:::
