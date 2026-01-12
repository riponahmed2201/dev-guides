# Caching

ডাইনামিক ওয়েবসাইটের পারফরম্যান্স অপ্টিমাইজ করার জন্য Caching অন্যতম সেরা উপায়। সব রিকোয়েস্টের জন্য ডাটাবেস কোয়েরি বা কমপ্লেক্স ক্যালকুলেশন না করে, ফলাফলটি মেমোরিতে (RAM) জমা রাখা হয় এবং পরবর্তী রিকোয়েস্টে সেখান থেকেই সার্ভ করা হয়।

## Cache Backends

### 1. Local Memory Cache (Default)
ডেভেলপমেন্টের জন্য এটি ডিফল্ট থাকে। প্রতিটি প্রসেসের নিজস্ব মেমোরি ব্যবহার করে।

```python
CACHES = {
    'default': {
        'BACKEND': 'django.core.cache.backends.locmem.LocMemCache',
        'LOCATION': 'unique-snowflake',
    }
}
```

### 2. Redis (Recommended for Production)
প্রোডাকশনের জন্য Redis সেরা। এর জন্য `django-redis` লাইব্রেরি লাগে।

**Installation:**
```bash
pip install django-redis
```

**Configuration:**
```python
CACHES = {
    "default": {
        "BACKEND": "django_redis.cache.RedisCache",
        "LOCATION": "redis://127.0.0.1:6379/1",
        "OPTIONS": {
            "CLIENT_CLASS": "django_redis.client.DefaultClient",
        }
    }
}
```

## Per-View Caching

পুরো ভিউ ক্যাশ করার জন্য `@cache_page` ডেকোরেটর ব্যবহার করা হয়।

```python
from django.views.decorators.cache import cache_page

@cache_page(60 * 15) # 15 minutes
def my_view(request):
    # ... expensive calculation ...
    return render(request, 'my_template.html')
```
URL এর উপর ভিত্তি করে এটি আলাদা ক্যাশ তৈরি করে।

## Template Fragment Caching

পুরো পেজ ক্যাশ না করে, নির্দিষ্ট অংশ (যেমন: সাইডবার বা মেনু) ক্যাশ করতে টেম্পলেট ট্যাগ ব্যবহার করা হয়।

```html
{% load cache %}

{% cache 500 sidebar %}
    <!-- ... sidebar content ... -->
{% endcache %}
```
এখানে `500` হলো সেকেন্ড এবং `sidebar` হলো ক্যাশ কি (Key)।

## Low-Level Cache API

আপনি যদি ম্যানুয়ালি কোনো নির্দিষ্ট ডেটা ক্যাশ করতে চান, তবে `cache` API ব্যবহার করতে পারেন।

```python
from django.core.cache import cache

def get_expensive_data():
    # প্রথমে ক্যাশে চেক করি
    data = cache.get('my_key')
    
    if not data:
        # ক্যাশে না থাকলে ক্যালকুলেট বা ডিবি কোয়েরি করি
        data = calculate_expensive_data()
        # এরপর ক্যাশে সেট করি (EXPIRE টাইমসহ)
        cache.set('my_key', data, 300) # 5 minutes
        
    return data
```

Other useful methods:
- `cache.add('key', value)`: শুধু যদি কি (key) না থাকে তবেই সেট করবে।
- `cache.delete('key')`: ক্যাশ থেকে ডিলিট করবে।
- `cache.clear()`: সব ক্যাশ ডিলিট করবে।

## Cache Invalidation

ক্যাশ ব্যবহারের বড় চ্যালেঞ্জ হলো ডেটা আপডেট হলে পুরোনো ক্যাশ মুছে ফেলা। এটি করার কয়েকটি উপায় আছে:

1.  **Signals ব্যবহার করে:** মডেল সেভ বা ডিলিট হওয়ার সময় সিগন্যাল দিয়ে ক্যাশ ডিলিট করা।
    ```python
    @receiver(post_save, sender=Product)
    def clear_product_cache(sender, instance, **kwargs):
        cache.delete('product_list')
    ```
2.  **কাস্টম `save()` মেথডে:**
    ```python
    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        cache.delete(f'product_{self.id}')
    ```
