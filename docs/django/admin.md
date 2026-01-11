# Django Admin Interface

Django-র সবচেয়ে জনপ্রিয় এবং শক্তিশালী ফিচারগুলোর একটি হলো এর বিল্ট-ইন **Admin Interface**। এটি আপনার ডেটাবেসের মডেলগুলো ম্যানেজ করার জন্য একটি রেডিমেড ইউজার ইন্টারফেস প্রদান করে।

---

## ১. Admin Interface Overview

Django Admin প্যানেল অটোমেটিক্যালি আপনার মডেলগুলো থেকে ডেটা রিড করে এবং একটি সুন্দর ড্যাশবোর্ড তৈরি করে। এখান থেকে আপনি ডেটা Create, Read, Update এবং Delete (CRUD) করতে পারেন।

অ্যাক্সেস করতে ব্রাউজারে যান: `http://127.0.0.1:8000/admin/`

---

## ২. Superuser Creation

এডমিন প্যানেলে লগইন করার জন্য আপনার একটি **Superuser** (অ্যাডমিনিস্ট্রেটর) অ্যাকাউন্ট প্রয়োজন।

টার্মিনালে নিচের কমান্ডটি দিন:

```bash
python manage.py createsuperuser
```

এরপর ইউজারনেম, ইমেইল এবং পাসওয়ার্ড দিন। (পাসওয়ার্ড টাইপ করার সময় দেখা যাবে না, এটা স্বাভাবিক)।

---

## ৩. Admin Site Customization & ModelAdmin

মডেলকে এডমিনে রেজিস্টার করার সময় আমরা `ModelAdmin` ক্লাস ব্যবহার করে ইন্টারফেসটি কাস্টমাইজ করতে পারি।

 `admin.py` ফাইলে:

```python
from django.contrib import admin
from .models import Product

# সাধারণ রেজিস্ট্রেশন
# admin.site.register(Product)

# কাস্টমাইজড রেজিস্ট্রেশন
@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'price', 'is_active', 'created_at')
    search_fields = ('name', 'description')
    list_filter = ('is_active', 'created_at')
```

---

## ৪. গুরুত্বপূর্ণ ModelAdmin অপশনসমূহ

### list_display
লিস্ট ভিউতে কোন কোন কলাম দেখাতে চান তা নির্ধারণ করে।
```python
list_display = ('name', 'price', 'stock')
```

### search_fields
উপরে একটি সার্চ বার যোগ করে।
```python
search_fields = ('name', 'email')
```

### list_filter
ডানপাশে একটি ফিল্টার সাইডবার যোগ করে।
```python
list_filter = ('category', 'publish_date')
```

### list_editable
লিস্ট ভিউ থেকেই সরাসরি ডেটা এডিট করার সুযোগ দেয়।
```python
list_editable = ('price', 'is_active')
```

---

## ৫. Admin Actions

ডিফল্টভাবে "Delete selected objects" অ্যাকশন থাকে। আপনি চাইলে নিজস্ব অ্যাকশন তৈরি করতে পারেন।

```python
@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    actions = ['mark_as_delivered']

    @admin.action(description='Mark selected orders as delivered')
    def mark_as_delivered(self, request, queryset):
        queryset.update(status='Delivered')
```

---

## ৬. Inline Models

যদি দুটি মডেলের মধ্যে রিলেশন থাকে (যেমন: Author এবং Book), তবে প্যারেন্ট মডেলের এডিট পেজেই চাইল্ড মডেল এডিট করার জন্য **Inline** ব্যবহার করা হয়।

```python
# models.py
class Author(models.Model): ...
class Book(models.Model):
    author = models.ForeignKey(Author, on_delete=models.CASCADE) ...

# admin.py
class BookInline(admin.TabularInline):
    model = Book
    extra = 1

@admin.register(Author)
class AuthorAdmin(admin.ModelAdmin):
    inlines = [BookInline]
```

এখন অথার এডিট পেজেই আপনি তার বইগুলো যোগ বা এডিট করতে পারবেন।

---

## ৭. Admin Site Header & Title

পুরো এডমিন সাইটের হেডার এবং টাইটেল পরিবর্তন করতে `urls.py` বা `admin.py`-তে নিচের কোড লিখুন:

```python
admin.site.site_header = "My E-Commerce Admin"
admin.site.site_title = "My Shop Admin Portal"
admin.site.index_title = "Welcome to My Shop Portal"
```

---

::: tip পরবর্তী ধাপ
অভিনন্দন! আপনি Django Admin এর শক্তিশালী ফিচারগুলো সম্পর্কে জেনেছেন। পরবর্তী চ্যাপ্টারে আমরা শিখবো **Working with Data (QuerySets)** সম্পর্কে।
:::
