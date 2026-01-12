# Database Optimization

Django ORM ব্যবহার করা সহজ, কিন্তু খেয়াল না করলে এটি অনেক অপ্রয়োজনীয় ডাটাবেস কোয়েরি জেনারেট করতে পারে। অ্যাপ্লিকেশন ফাস্ট রাখার জন্য কোয়েরি অপ্টিমাইজেশন অপরিহার্য।

## N+1 Query Problem

সবচেয়ে কমন সমস্যা হলো N+1 প্রবলেম। যখন আপনি একটি লুপের মধ্যে রিলেটেড অবজেক্ট এক্সেস করেন।

```python
# Bad Example
books = Book.objects.all() # 1 Query
for book in books:
    print(book.author.name) # N Queries (প্রতিটি বইয়ের জন্য একবার)
```

## Efficient Data Retrieval

### 1. `select_related()`
এটি `JOIN` কোয়েরি ব্যবহার করে। এটি **ForeignKey** এবং **OneToOneField** এর জন্য ব্যবহার করা হয়।

```python
# Good Example (Single Query)
books = Book.objects.select_related('author').all()
for book in books:
    print(book.author.name)
```

### 2. `prefetch_related()`
এটি পাইথনে আলাদাভাবে ডাটাবেস কোয়েরি চালিয়ে জয়েন করে। এটি **ManyToMany** এবং **Reverse ForeignKey** এর জন্য ব্যবহার করা হয়।

```python
# Good Example (Two Queries)
authors = Author.objects.prefetch_related('books').all()
for author in authors:
    print(author.books.count())
```

## Selecting Specific Fields

সবসময় মডেলের সব ফিল্ড লোড করার দরকার নেই।

- **`only()`**: শুধুমাত্র নির্দিষ্ট ফিল্ডগুলো লোড করবে।
- **`defer()`**: নির্দিষ্ট ফিল্ডগুলো লোড করা থেকে বিরত থাকবে (বাদ দিবে)।

```python
# শুধু নাম এবং দাম লোড করবে
products = Product.objects.only('name', 'price') 

# ডেসক্রিপশন বাদে বাকি সব লোড করবে
users = User.objects.defer('bio')
```
*সতর্কতা: যদি আপনি `only()` তে লোড করেননি এমন কোনো ফিল্ড এক্সেস করেন, তবে Django আবার নতুন কোয়েরি করবে।*

## Database Indexes

ডাটাবেস সার্চ ফাস্ট করার জন্য ইনডেক্স ব্যবহার করা জরুরি।

```python
class Customer(models.Model):
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100, db_index=True) # Single Index

    class Meta:
        indexes = [
            models.Index(fields=['last_name', 'first_name']), # Composite Index
        ]
```

## Bulk Operations

লুপের মধ্যে `save()` কল না করে একবারে মাল্টিপল ডেটা সেভ বা আপডেট করা উচিত।

### `bulk_create()`
```python
entries = [Entry(headline=f"Entry {i}") for i in range(1000)]
Entry.objects.bulk_create(entries)
```

### `bulk_update()`
```python
products = list(Product.objects.all())
for p in products:
    p.price += 10
Product.objects.bulk_update(products, ['price'])
```

## Query Analysis

কোথায় অপ্টিমাইজেশন দরকার তা বোঝার জন্য **Django Debug Toolbar** অথবা `connection.queries` ব্যবহার করতে পারেন।

```python
from django.db import connection
print(connection.queries)
```
