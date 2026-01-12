# Django QuerySets & ORM

Django এর অন্যতম শক্তিশালী ফিচার হলো এর **ORM (Object-Relational Mapper)**। SQL কোড না লিখেও আপনি ডাটাবেসের সব কাজ Python কোড দিয়েই করতে পারেন। `QuerySet` হলো ডাটাবেস থেকে আসা অবজেক্টের একটি তালিকা।

---

## ১. বেসিক কুয়েরি মেথডস

### ১.১ সব ডাটা আনা (`all()`)
টেবিলের সব রেকর্ড আনার জন্য:
```python
products = Product.objects.all()
```

### ১.২ ফিল্টার করা (`filter()`)
নির্দিষ্ট শর্ত মেনে ডাটা আনার জন্য। এটি একটি `QuerySet` রিটার্ন করে (একাধিক অবজেক্ট হতে পারে)।
```python
# যাদের দাম ৫০০ টাকার বেশি
expensive_products = Product.objects.filter(price__gt=500)

# যারা 'Electronics' ক্যাটাগরির
electronics = Product.objects.filter(category__name="Electronics")
```
> **টিপ:** `__gt`, `__lt`, `__contains` এগুলো হলো "Field Lookups".

### ১.৩ বাদ দেওয়া (`exclude()`)
শর্তের বাইরের ডাটা আনার জন্য। `filter()` এর ঠিক উল্টো।
```python
# যারা active না তাদের বাদ দাও (মানে শুধু active গুলো আনো)
active_products = Product.objects.exclude(is_active=False)
```

### ১.৪ একটি মাত্র ডাটা আনা (`get()`)
আমরা নিশ্চিত যে **শুধুমাত্র একটি** রেকর্ড আছে, তখন এটি ব্যবহার হয়।
```python
# ID 1 এর প্রোডাক্ট
p = Product.objects.get(id=1)
```
> **সতর্কতা:** যদি কোনো রেকর্ড না পায় তবে `DoesNotExist` এরর দিবে। আর যদি একের অধিক পায় তবে `MultipleObjectsReturned` এরর দিবে।

### ১.৫ প্রথম বা শেষ ডাটা (`first()`, `last()`)
```python
latest_product = Product.objects.first() # প্রথমটি
oldest_product = Product.objects.last() # শেষেরটি
```
এটি এরর দেয় না, ডাটা না পেলে `None` রিটার্ন করে।

---

## ২. অর্ডারিং (`order_by()`)

ডাটা সাজানোর জন্য।
```python
# দাম অনুযায়ী ছোট থেকে বড় (Ascending)
products = Product.objects.order_by('price')

# দাম অনুযায়ী বড় থেকে ছোট (Descending) - সামনে '-' দিতে হয়
products = Product.objects.order_by('-price')

# একাধিক ফিল্ড দিয়ে সর্ট (প্রথমে নাম, তারপর দাম)
products = Product.objects.order_by('name', '-price')
```

---

## ৩. নির্দিষ্ট ফিল্ড আনা (`values()`, `values_list()`)

পুরো অবজেক্ট না এনে শুধু নির্দিষ্ট কলামের ডাটা আনতে চাইলে। এটি মেমোরি বাঁচায়।

### ৩.১ `values()`
এটি Dictionary (`dict`) এর একটি লিস্ট রিটার্ন করে।
```python
products = Product.objects.values('name', 'price')
# Output: <QuerySet [{'name': 'TV', 'price': 50000}, {'name': 'Phone', 'price': 20000}]>
```

### ৩.২ `values_list()`
এটি Tuple (`tuple`) এর একটি লিস্ট রিটার্ন করে।
```python
products = Product.objects.values_list('name', 'price')
# Output: <QuerySet [('TV', 50000), ('Phone', 20000)]>
```
যদি মাত্র একটি ফিল্ড লাগে এবং লিস্ট হিসেবে চান:
```python
names = Product.objects.values_list('name', flat=True)
# Output: <QuerySet ['TV', 'Phone']>
```

---

## ৪. গুরুত্বপূর্ণ চেকস (`count()`, `exists()`, `distinct()`)

### ৪.১ `count()`
কতটি রেকর্ড আছে তা গোনার জন্য। (ডাটাবেস থেকে সব ডাটা না এনেই কাউন্ট করে, তাই এটি খুব ফাস্ট)।
```python
total_active = Product.objects.filter(is_active=True).count()
```

### ৪.২ `exists()`
ডাটা আদৌ আছে কি না তা চেক করতে। এটি `True` বা `False` রিটার্ন করে।
```python
if Product.objects.filter(name="iPhone").exists():
    print("Available!")
```

### ৪.৩ `distinct()`
ডুপ্লিকেট ডাটা বাদ দিতে।
```python
# যেসব ক্যাটাগরিতে প্রোডাক্ট আছে তাদের নাম ( ইউনিক )
categories = Product.objects.values_list('category__name', flat=True).distinct()
```

---

## ৫. কুয়েরি চেইনিং (Chaining)

QuerySet এর মেজিক হলো আপনি একটার পর একটা মেথড চেইন করতে পারেন।
```python
# ১. Active প্রোডাক্ট নাও
# ২. যেগুলো Electronics ক্যাটাগরির
# ৩. নামের শুরুতে 'S' আছে
# ৪. দাম অনুযায়ী সাজাও

products = Product.objects.filter(is_active=True)\
                          .filter(category__name="Electronics")\
                          .filter(name__startswith='S')\
                          .order_by('-price')
```

---

## ৬. Lazy Evaluation

Django QuerySet হলো **Lazy**। মানে আপনি যখন কুয়েরি লিখলেন (`Product.objects.filter(...)`), তখন আসলে ডাটাবেসে কোনো হিট হয় না।

ডাটাবেসে হিট হয় যখন আপনি:
1. ডাটা লুপিং করেন (`for p in products:`)
2. প্রিন্ট করেন (`print(products)`)
3. `list()` এ কনভার্ট করেন
4. `count()`, `get()`, `exists()` কল করেন

এর মানে হলো আপনি যত খুশি ফিল্টার চেইন করতে পারেন, ডাটাবেস হিট হবে একদম শেষ মুহূর্তে, যা পারফরম্যান্সের জন্য দারুণ।
