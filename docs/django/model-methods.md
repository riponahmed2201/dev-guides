# Django Model Methods & Meta Options

মডেলের কাজ শুধু ডাটাবেস টেবিল তৈরি করা না, এর সাথে বিজনেস লজিক এবং মেটাডাটা হ্যান্ডেল করাও এর দায়িত্ব। এই সেকশনে আমরা মডেলের মেথড, প্রপার্টি এবং `Meta` ক্লাস নিয়ে আলোচনা করবো।

---

## ১. `__str__` মেথড

এটি সবচেয়ে বেসিক এবং গুরুত্বপূর্ণ মেথড। অবজেক্টকে যখন প্রিন্ট করা হয় বা এডমিন প্যানেলে দেখানো হয়, তখন এই মেথডটি কল হয়। এটি যদি না থাকে, তবে Django অবজেক্টটিকে `Product object (1)` এর মতো করে দেখায়, যা বোঝা কঠিন।

```python
class Product(models.Model):
    name = models.CharField(max_length=200)
    price = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"{self.name} - ${self.price}"
```

---

## ২. Custom Model Methods

মডেলে আমরা নিজেদের প্রয়োজন মতো মেথড তৈরি করতে পারি। এটি ডাটাবেস লেভেলে লজিক রাখার জন্য সেরা জায়গা (একে "Fat Model, Thin View" প্যাটার্ন বলে)।

**উদাহরণ:** একটি প্রোডাক্টের ডিসকাউন্ট প্রাইস বের করার মেথড।

```python
class Product(models.Model):
    name = models.CharField(max_length=200)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    discount_percentage = models.IntegerField(default=0)

    def get_discounted_price(self):
        if self.discount_percentage > 0:
            discount_amount = (self.price * self.discount_percentage) / 100
            return self.price - discount_amount
        return self.price
```

**ব্যবহার:**
```python
p = Product.objects.get(id=1)
print(p.get_discounted_price())
```

---

## ৩. `@property` ডেকোরেটর

মাঝে মাঝে আমাদের এমন কিছু ভ্যালু দরকার হয় যা ডাটাবেসে ফিল্ড হিসেবে নেই, কিন্তু অন্য ফিল্ড থেকে ক্যালকুলেট করে বের করা যায়। `@property` ব্যবহার করলে মেথডটিকে আমরা ফিল্ডের মতো অ্যাক্সেস করতে পারি (ফাংশন কল `()` ছাড়া)।

```python
class Person(models.Model):
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)

    @property
    def full_name(self):
        return f"{self.first_name} {self.last_name}"
```

**ব্যবহার:**
```python
person = Person.objects.get(id=1)
print(person.full_name) # person.full_name() লিখা লাগবে না
```

---

## ৪. `get_absolute_url()`

এটি একটি বিশেষ মেথড যা Django-কে বলে দেয় কিভাবে একটি নির্দিষ্ট অবজেক্টের ডিটেইলস পেজের URL পেতে হয়। এটি এডমিন প্যানেল এবং টেমপ্লেটে "View on site" বাটনের জন্য খুবই কাজের।

```python
from django.urls import reverse

class Post(models.Model):
    title = models.CharField(max_length=200)
    slug = models.SlugField(unique=True)

    def get_absolute_url(self):
        # 'post_detail' হলো urls.py এ ডিফাইন করা path এর name
        return reverse('post_detail', kwargs={'slug': self.slug})
```

**টেমপ্লেটে ব্যবহার:**
HTML এ অনেক বড় URL না লিখে সরাসরি এটি ব্যবহার করা যায়:
```html
<a href="{{ post.get_absolute_url }}">{{ post.title }}</a>
```

---

## ৫. Model `Meta` ক্লাস

মডেল ক্লাসের ভেতরে `class Meta:` ডিফাইন করে আমরা মডেলের বিহেভিয়ার কন্ট্রোল করতে পারি। এটি ডাটাবেস ফিল্ডের অংশ নয়, কিন্তু মডেলের কনফিগারেশন।

### ৫.১ `ordering`
ডিফল্টভাবে ডাটাবেস থেকে ডাটা কিভাবে সর্ট (Sort) হয়ে আসবে তা ঠিক করে।

```python
class Meta:
    ordering = ['-created_at'] # প্রথমে নতুন পোস্ট দেখাবে
    # ordering = ['name'] # নামের অ্যালফাবেটিক অর্ডারে দেখাবে
```

### ৫.২ `verbose_name` এবং `verbose_name_plural`
এডমিন প্যানেলে মডেলের নাম কিভাবে দেখাবে তা কাস্টমাইজ করতে।

```python
class Category(models.Model):
    # ... fields ...
    class Meta:
        verbose_name = "Subject"
        verbose_name_plural = "Subjects" 
        # ডিফল্টভাবে Django 'Categorys' দেখাতো (s যোগ করে), যা ভুল।
```

### ৫.৩ `unique_together`
একাধিক ফিল্ড মিলিয়ে ইউনিক হতে হবে।

**উদাহরণ:** একজন স্টুডেন্ট একটি কোর্সে একবারই এনরোল করতে পারবে।

```python
class Enrollment(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    course = models.ForeignKey(Course, on_delete=models.CASCADE)

    class Meta:
        unique_together = [['student', 'course']]
```

### ৫.৪ `db_table`
ডিফল্টভাবে Django টেবিলের নাম দেয় `appname_modelname`। আপনি যদি কাস্টম নাম দিতে চান:

```python
class Meta:
    db_table = 'my_custom_table_name'
```

---

## ৬. সম্পূর্ণ উদাহরণ

```python
from django.db import models
from django.urls import reverse

class Book(models.Model):
    title = models.CharField(max_length=200)
    author = models.CharField(max_length=100)
    published_date = models.DateField()
    price = models.DecimalField(max_digits=6, decimal_places=2)

    class Meta:
        ordering = ['-published_date']
        verbose_name = "Book Info"
        verbose_name_plural = "Books Information"
        db_table = "library_books"
        # একই লেখকের একই নামের বই দুইবার থাকতে পারবে না
        unique_together = [['title', 'author']]

    def __str__(self):
        return f"{self.title} by {self.author}"

    @property
    def is_new_arrival(self):
        # লজিক: যদি গত ৩০ দিনের মধ্যে পাবলিশ হয়ে থাকে
        from django.utils import timezone
        import datetime
        return self.published_date >= timezone.now().date() - datetime.timedelta(days=30)

    def get_absolute_url(self):
        return reverse('book_detail', args=[str(self.id)])
```
