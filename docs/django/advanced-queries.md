# Django Advanced Queries & Optimization

বেসিক কুয়েরির বাইরেও Django ORM অনেক শক্তিশালী ফিচার দেয় যা জটিল কুয়েরি হ্যান্ডেল করতে এবং ডাটাবেস পারফরম্যান্স অপ্টিমাইজ করতে সাহায্য করে।

---

## ১. `Q` Objects (জটিল শর্ত | OR Condition)

সাধারণ `filter()` মেথডে কমা (`,`) দিয়ে একাধিক শর্ত দিলে সেগুলো `AND` হিসেবে কাজ করে। কিন্তু আমাদের যদি `OR` কন্ডিশন দরকার হয়, তবে `Q` অবজেক্ট ব্যবহার করতে হয়।

```python
from django.db.models import Q

# নাম 'Phone' অথবা দাম ২০০০০ এর কম
products = Product.objects.filter(Q(name="Phone") | Q(price__lt=20000))

# নাম 'Phone' এবং দাম ২০০০০ এর কম (AND)
# এটি filter(name="Phone", price__lt=20000) এর মতোই, কিন্তু Q দিয়েও করা যায়
products = Product.objects.filter(Q(name="Phone") & Q(price__lt=20000))

# নাম 'Phone' নয় (NOT operator ~)
products = Product.objects.filter(~Q(name="Phone"))
```

---

## ২. `F` Objects (ফিল্ড রেফারেন্স)

কখনো কখনো আমাদের কুয়েরিতে একটি ফিল্ডের মানের সাথে অন্য একটি ফিল্ডের মান তুলনা করার দরকার হয়, অথবা ডাটাবেস লেভেলেই কোনো আপডেট করার প্রয়োজন হয়। এর জন্য `F` ব্যবহার করা হয়।

### ২.১ ফিল্ড কম্পারিজন
```python
from django.db.models import F

# যেসব প্রোডাক্টের 'sell_price', 'cost_price' এর চেয়ে কম (লস প্রজেক্ট!)
loss_products = Product.objects.filter(sell_price__lt=F('cost_price'))
```

### ২.২ ডাটাবেস লেভেল আপডেট
এটি খুবই ফাস্ট কারণ ডাটা Python মেমোরিতে এনে যোগ-বিয়োগ করতে হয় না, সরাসরি ডাটাবেসে কুয়েরি চলে।

```python
# সব প্রোডাক্টের দাম ১০% বাড়িয়ে দাও
Product.objects.all().update(price=F('price') * 1.10)
```

---

## ৩. Aggregation (গণনা)

পুরা টেবিলের ডাটা সামারি (Summary) করার জন্য। এটি একটি ডিকশনারি রিটার্ন করে।

```python
from django.db.models import Count, Sum, Avg, Max, Min

# সোজা হিসাব
stats = Product.objects.aggregate(
    total_products=Count('id'),
    total_value=Sum('price'),
    avg_price=Avg('price'),
    max_price=Max('price')
)
print(stats)
# Output: {'total_products': 50, 'total_value': 100000, ...}
```

---

## ৪. Annotation (প্রতি রো-তে এক্সট্রা ডাটা)

`aggregate` পুরো টেবিলের রেজাল্ট দেয়, আর `annotate` প্রতিটি অবজেক্টের সাথে এক্সট্রা তথ্য জুড়ে দেয়। এটি `GROUP BY` এর মতো কাজ করে।

```python
# প্রতিটি ক্যাটাগরিতে কয়টি করে প্রোডাক্ট আছে?
categories = Category.objects.annotate(num_products=Count('products'))

for cat in categories:
    print(f"{cat.name} - {cat.num_products} items")
```

---

## ৫. Query Optimization (N+1 Problem Solution)

Django-তে কাজ করার সময় সবচেয়ে বড় পারফরম্যান্স ইস্যু হলো "N+1 Problem"।

**সমস্যা:**
```python
# ১টি কুয়েরি: সব বই আনো
books = Book.objects.all()

for book in books:
    # প্রতিটি লুপে ১টি করে কুয়েরি: লেখকের নাম আনো
    print(book.author.name) 
```
যদি ১০০টি বই থাকে, তবে ১০১টি কুয়েরি হবে (১টি বইয়ের জন্য + ১০০টি লেখকের জন্য)।

**সমাধান:**

### ৫.১ `select_related()` (For ForeignKey / OneToOne)
এটি SQL `JOIN` ব্যবহার করে এক কুয়েরিতেই ডাটা নিয়ে আসে।

```python
# ১টি কুয়েরি: বই এবং লেখক একসাথে আনো
books = Book.objects.select_related('author').all()

for book in books:
    print(book.author.name) # এখানে আর ডাটাবেস হিট হবে না
```

### ৫.২ `prefetch_related()` (For ManyToMany / Reverse ForeignKey)
এটি দুটি আলাদা কুয়েরি করে এবং পাইথনে জোড়া লাগায়। `ManyToManyField` এর জন্য `JOIN` অনেক ধীরগতির হয়, তাই প্রিফেচ ভালো।

```python
# ১. ক্যাটাগরি আনো, ২. সব বই আনো
categories = Category.objects.prefetch_related('products').all()

for cat in categories:
    print(cat.products.all()) # ডাটাবেস হিট হবে না
```

---

## ৬. Raw SQL Queries

যদি Django ORM দিয়ে কাজ না হয় (খুবই রেয়ার কেস), তবে সরাসরি SQL লিখা যায়।

```python
products = Product.objects.raw('SELECT * FROM myapp_product WHERE price > 100')

for p in products:
    print(p.name)
```

অথবা আরও লো-লেভেল (সরাসরি कursor):
```python
from django.db import connection

with connection.cursor() as cursor:
    cursor.execute("UPDATE myapp_product SET price = price + 10 WHERE id = %s", [1])
```

---

## ৭. `defer()` এবং `only()`

যদি কোনো টেবিলে অনেক বড় টেক্সট ফিল্ড থাকে যা সবসময় দরকার নেই, তবে সেগুলো লোড না করে কুয়েরি ফাস্ট করা যায়।

```python
# 'description' বাদ দিয়ে বাকি সব আনো
products = Product.objects.defer('description')

# শুধুমাত্র 'name' এবং 'price' আনো (ID অটোমেটিক আসবে)
products = Product.objects.only('name', 'price')
```
