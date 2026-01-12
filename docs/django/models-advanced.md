# Django Models - Advanced Fields & Relationships

Django Models এর বেসিক ধারণা আমরা আগেই পেয়েছি। কিন্তু প্রফেশনাল প্রজেক্টে কাজ করতে গেলে আমাদের রিলেশনশিপ (Relationships) এবং বিভিন্ন ধরনের এডভান্সড ফিল্ড সম্পর্কে গভীর জ্ঞান থাকা জরুরি। এই সেকশনে আমরা Models এর সেই গুরুত্বপূর্ণ বিষয়গুলো নিয়ে আলোচনা করবো।

---

## ১. মডেল রিলেশনশিপ (Model Relationships)

Relational Database-এর সবচেয়ে শক্তিশালী দিক হলো টেবিলগুলোর মধ্যে সম্পর্ক তৈরি করা। Django-তে মূলত তিন ধরনের রিলেশনশিপ হয়:

### ১.১ ForeignKey (One-to-Many Relationship)

এটি সবচেয়ে বেশি ব্যবহৃত রিলেশনশিপ। যখন একটি মডেলের (Child) সাথে অন্য একটি মডেলের (Parent) সম্পর্ক থাকে, কিন্তু প্যারেন্ট মডেলের একাধিক চাইল্ড থাকতে পারে।

**উদাহরণ:** একজন লেখকের (Author) অনেকগুলো বই (Book) থাকতে পারে, কিন্তু একটি বইয়ের লেখক একজনই (ধরে নিলাম)।

```python
from django.db import models

class Author(models.Model):
    name = models.CharField(max_length=100)
    
    def __str__(self):
        return self.name

class Book(models.Model):
    title = models.CharField(max_length=200)
    # ForeignKey ব্যবহার করে Author এর সাথে লিংক করা হলো
    author = models.ForeignKey(Author, on_delete=models.CASCADE, related_name='books')
    
    def __str__(self):
        return self.title
```

**ব্যবহার:**
```python
# লেখক তৈরি
author = Author.objects.create(name="Humayun Ahmed")

# বই তৈরি (লেখকের সাথে লিংক করা)
book = Book.objects.create(title="Himu", author=author)

# রিভার্স রিলেশনশিপ (লেখকের সব বই বের করা)
author_books = author.books.all() 
# related_name='books' দেয়ার কারণে আমরা .books ব্যবহার করতে পারছি। 
# ডিফল্টভাবে এটি author.book_set.all() হতো।
```

---

### ১.২ OneToOneField (One-to-One Relationship)

যখন একটি মডেলের একটি অবজেক্টের সাথে অন্য মডেলের ঠিক একটি অবজেক্টেরই সম্পর্ক থাকে।

**উদাহরণ:** একজন ব্যবহারকারী (User) এর একটি মাত্র প্রোফাইল (Profile) থাকবে।

```python
from django.contrib.auth.models import User

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    bio = models.TextField()
    
    def __str__(self):
        return self.user.username
```

**ব্যবহার:** `user.profile` দিয়ে সরাসরি প্রোফাইল অ্যাক্সেস করা যায়।

---

### ১.৩ ManyToManyField (Many-to-Many Relationship)

যখন একটি মডেলের অনেকগুলো অবজেক্টের সাথে অন্য মডেলের অনেকগুলো অবজেক্টের সম্পর্ক থাকে।

**উদাহরণ:** একটি বইয়ের (Book) অনেকগুলো ক্যাটাগরি (Category) থাকতে পারে, আবার একটি ক্যাটাগরিতে অনেকগুলো বই থাকতে পারে।

```python
class Category(models.Model):
    name = models.CharField(max_length=50)

class Book(models.Model):
    title = models.CharField(max_length=200)
    categories = models.ManyToManyField(Category)
```

**নোট:** `ManyToManyField` এর জন্য `on_delete` অপশন লাগে না।

---

## ২. `on_delete` অপশনস (ডিলিট হলে কী হবে?)

যখন রিলেশনশিপ থাকা কোনো প্যারেন্ট অবজেক্ট ডিলিট করা হয়, তখন চাইল্ড অবজেক্টের কী হবে, তা `on_delete` দিয়ে ঠিক করা হয়।

1.  **models.CASCADE (সবচেয়ে কমন):** প্যারেন্ট ডিলিট হলে চাইল্ডও ডিলিট হয়ে যাবে। (যেমন: User ডিলিট হলে তার Profile-ও ডিলিট হবে)।
2.  **models.PROTECT:** চাইল্ড ডেটা থাকলে প্যারেন্ট ডিলিট করতে দেবে না। এটি `ProtectedError` রেইজ করবে। (যেমন: ইনভয়েস থাকলে কাস্টমার ডিলিট করা যাবে না)।
3.  **models.SET_NULL:** প্যারেন্ট ডিলিট হলে চাইল্ডের ওই ফিল্ডটি `NULL` হয়ে যাবে (অবশ্যই `null=True` থাকতে হবে)।
4.  **models.SET_DEFAULT:** ডিফল্ট ভ্যালু সেট হয়ে যাবে।
5.  **models.DO_NOTHING:** কিছুই করবে না (এটি ডাটাবেস এর উপর ছেড়ে দেয়া হয়, মাঝে মাঝে এরর হতে পারে)।

---

## ৩. `related_name` কেন জরুরি?

`related_name` হলো রিভার্স রিলেশনশিপের জন্য নাম ঠিক করে দেয়া।

- যদি `Book` মডেলে `author = ForeignKey(Author)` থাকে, তবে `Author` অবজেক্ট থেকে বইগুলো পেতে ডিফল্ট ভাবে `author.book_set.all()` লিখতে হয়।
- যদি `related_name='books'` দেন, তবে `author.books.all()` লিখলেই হবে। এটি কোডকে ক্লিন এবং রিডেবল করে।

---

## ৪. গুরুত্বপূর্ণ ফিল্ড টাইপস (Deep Dive)

### ৪.১ DateTimeField (Time traveling?)

তারিখ এবং সময় রাখার জন্য। দুটি গুরুত্বপূর্ণ আর্গুমেন্ট আছে:

- **`auto_now=True`:** যখনই অবজেক্টটি **সেভ (save)** বা আপডেট হবে, তখনকার সময় সেট হবে। (যেমন: `last_modified` ফিল্ডের জন্য)।
- **`auto_now_add=True`:** যখন অবজেক্টটি **প্রথমবার তৈরি (creation)** হবে, শুধু তখন সময় সেট হবে। পরে আর চেঞ্জ হবে না। (যেমন: `created_at` ফিল্ডের জন্য)।

```python
created_at = models.DateTimeField(auto_now_add=True)
updated_at = models.DateTimeField(auto_now=True)
```

### ৪.২ CharField vs TextField

- **CharField:** ছোট টেক্সটের জন্য (নাম, শিরোনাম)। `max_length` দিতেই হবে। ডাটাবেসে এটি `VARCHAR` হিসেবে থাকে।
- **TextField:** বড় টেক্সটের জন্য (ব্লগ কন্টেন্ট, ডেসক্রিপশন)। কোনো সাইজ লিমিট নেই (ডাটাবেস ভেদে)। ডাটাবেসে এটি `TEXT` হিসেবে থাকে।

### ৪.৩ DecimalField (টাকার হিসাব!)

টাকা বা ওজনের মতো সূক্ষ্ম হিসাবের জন্য `Float` ব্যবহার করবেন না, `DecimalField` ব্যবহার করুন।

- **`max_digits`:** মোট কতটি সংখ্যা থাকবে।
- **`decimal_places`:** দশমিকের পর কয়টি সংখ্যা থাকবে।

```python
price = models.DecimalField(max_digits=10, decimal_places=2) 
# উদাহরণ: 12345678.99 পর্যন্ত রাখা যাবে
```

### ৪.৪ SlugField (SEO Friendly URLs)

URL-এ ব্যবহারের জন্য টেক্সট। এতে শুধু অক্ষর, সংখ্যা, হাইফেন (-) এবং আন্ডারস্কোর (_) থাকে।
যেমন: শিরোনাম "Learn Django Fast" -> স্লাগ "learn-django-fast"।

```python
slug = models.SlugField(unique=True)
```

### ৪.৫ অন্যান্য কাজের ফিল্ড

- **EmailField:** ইমেইল ভ্যালিডেশন চেক করে।
- **URLField:** লিংক বা URL এর জন্য।
- **BooleanField:** সত্য/মিথ্যা (True/False) ভ্যালুর জন্য। `default=True` বা `False` দেয়া ভালো।

---

## ৫. সম্পূর্ণ উদাহরণ (Full Example)

```python
from django.db import models
from django.utils.text import slugify

class Category(models.Model):
    name = models.CharField(max_length=50)
    slug = models.SlugField(unique=True, blank=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

class Product(models.Model):
    name = models.CharField(max_length=200)
    slug = models.SlugField(unique=True)
    description = models.TextField()
    price = models.DecimalField(max_digits=7, decimal_places=2)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    # Relationships
    category = models.ForeignKey(Category, on_delete=models.PROTECT, related_name='products')
    
    def __str__(self):
        return self.name
```
