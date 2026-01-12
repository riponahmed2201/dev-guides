# Django Model Relationships (Deep Dive)

Django Models এর রিলেশনশিপ নিয়ে আমরা বেসিক ধারণা পেয়েছি। কিন্তু প্রফেশনাল লেভেলে কাজ করার জন্য রিলেশনশিপের গভীরে যাওয়া প্রয়োজন। এই সেকশনে আমরা রিলেশনশিপের অ্যাডভান্সড টপিকগুলো নিয়ে আলোচনা করবো।

---

## ১. Forward vs Reverse Relationships

### ১.১ Forward Relationship
যখন আপনি সেই মডেল থেকে অন্য মডেল অ্যাক্সেস করেন যেখানে `ForeignKey` বা `ManyToManyField` ডিফাইন করা আছে।

```python
class Author(models.Model):
    name = models.CharField(max_length=100)

class Book(models.Model):
    title = models.CharField(max_length=100)
    author = models.ForeignKey(Author, on_delete=models.CASCADE, related_name='books')

# Forward Access
book = Book.objects.get(id=1)
print(book.author.name) # সরাসরি author ফিল্ড দিয়ে অ্যাক্সেস
```

### ১.২ Reverse Relationship
যখন আপনি উল্টো দিক থেকে রিলেশনশিপ এক্সেস করেন (যেখানে কোনো ফিল্ড নেই, কিন্তু রিলেশন আছে)।

```python
# Reverse Access
author = Author.objects.get(id=1)
# 'books' হলো related_name। যদি related_name না থাকতো তবে 'book_set' ব্যবহার করতে হতো।
all_books = author.books.all() 
```

---

## ২. Related Manager মেথডস (`add`, `remove`, `clear`, `set`)

`ForeignKey` (যদি `null=True` হয়) এবং `ManyToManyField` এর ক্ষেত্রে আমরা কিছু স্পেশাল মেথড পাই রিলেশনশিপ ম্যানেজ করার জন্য।

ধরি, একটি ব্লগের অনেকগুলো ট্যাগ থাকতে পারে (ManyToMany)।

```python
post = Post.objects.get(id=1)
tag1 = Tag.objects.create(name="Python")
tag2 = Tag.objects.create(name="Django")
```

### ২.১ `add(*objs)`
রিলেশনশিপে নতুন অবজেক্ট যোগ করা।
```python
post.tags.add(tag1, tag2)
```

### ২.২ `remove(*objs)`
রিলেশনশিপ থেকে অবজেক্ট রিমুভ করা (ডাটাবেস থেকে ডিলিট হয় না, শুধু সম্পর্ক বিচ্ছিন্ন হয়)।
```python
post.tags.remove(tag1)
```

### ২.৩ `clear()`
সব রিলেশন রিমুভ করা।
```python
post.tags.clear()
```

### ২.৪ `set([objs])`
আগের সব রিলেশন মুছে নতুন লিস্ট সেট করা।
```python
post.tags.set([tag1, tag2])
```

---

## ৩. `through` Model (Extra Data in ManyToMany)

সাধারণ `ManyToManyField` এ আমরা শুধু দুটি মডেলের সম্পর্ক রাখি। কিন্তু যদি সম্পর্কের সাথে এক্সট্রা তথ্য রাখতে চাই? (যেমন: একজন মেম্বার একটি গ্রুপে কবে জয়েন করেছে?)

তখন আমাদের একটি মধ্যবর্তী মডেল (Intermediary Model) বা `through` মডেল লাগে।

```python
class Person(models.Model):
    name = models.CharField(max_length=50)

class Group(models.Model):
    name = models.CharField(max_length=128)
    members = models.ManyToManyField(Person, through='Membership')

class Membership(models.Model):
    person = models.ForeignKey(Person, on_delete=models.CASCADE)
    group = models.ForeignKey(Group, on_delete=models.CASCADE)
    date_joined = models.DateField() # এক্সট্রা ফিল্ড
    invite_reason = models.CharField(max_length=64)
```

**ডাটা সেভ করা:**
```python
p1 = Person.objects.create(name="Ripon")
g1 = Group.objects.create(name="Developers")

# সরাসরি add() কাজ করবে না, Membership মডেল দিয়ে করতে হবে
m1 = Membership.objects.create(person=p1, group=g1, date_joined=date.today(), invite_reason="Expert")
```

---

## ৪. Symmetrical Relationships

`ManyToManyField` যদি একই মডেলের সাথে হয় (Self-referencing), তবে Django ডিফল্টভাবে সেটিকে **Symmetrical** ধরে নেয়।

**উদাহরণ:** ফ্রেন্ডশিপ। আমি যদি আপনার বন্ধু হই, আপনিও আমার বন্ধু।

```python
class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    friends = models.ManyToManyField("self")
```

যদি আপনি সিমেট্রিকাল না চান (যেমন: ফলোয়ার সিস্টেম - আমি আপনাকে ফলো করি কিন্তু আপনি আমাকে নাও করতে পারেন):

```python
    following = models.ManyToManyField("self", symmetrical=False)
```

---

## ৫. Generic Relations (ContentTypes Framework)

এটি Django-র অন্যতম শক্তিশালী এবং জটিল ফিচার। ধরুন আপনার একটি `Comment` মডেল আছে। আপনি চান এই কমেন্ট `Post`, `Picture`, `Video` বা অন্য যেকোনো মডেলে করা যাবে। আলাদা আলাদা ForeignKey না বানিয়ে `GenericForeignKey` ব্যবহার করা যায়।

এর জন্য `django.contrib.contenttypes` অ্যাপটি ইন্সটলড থাকতে হয় (ডিফল্ট থাকে)।

```python
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
from django.db import models

class Comment(models.Model):
    text = models.TextField()
    
    # এই তিনটি ফিল্ড প্রয়োজন
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    object_id = models.PositiveIntegerField()
    content_object = GenericForeignKey('content_type', 'object_id')

    def __str__(self):
        return self.text
```

**মডেলে রিভার্স রিলেশন যোগ করা:**

```python
from django.contrib.contenttypes.fields import GenericRelation

class Post(models.Model):
    title = models.CharField(max_length=100)
    comments = GenericRelation(Comment) 
    # এতে post.comments.all() করা যাবে
```

**ব্যবহার:**

```python
# একটি পোস্টের জন্য কমেন্ট তৈরি
post = Post.objects.get(id=1)
c = Comment(text="Awesome post!", content_object=post)
c.save()

# ঐ পোস্টের সব কমেন্ট
comments = post.comments.all()
```
