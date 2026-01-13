# Performance Optimization

Django application এর performance optimize করা production deployment এর জন্য অত্যন্ত গুরুত্বপূর্ণ। এই গাইডে আমরা database queries, caching, static files, templates, এবং অন্যান্য optimization techniques নিয়ে বিস্তারিত আলোচনা করব।

## 1. Database Query Optimization

### N+1 Query Problem

```python
# ❌ Bad: N+1 queries
def get_products_with_categories():
    products = Product.objects.all()  # 1 query
    
    for product in products:
        print(product.category.name)  # N queries (one per product)
    
    # Total: 1 + N queries

# ✅ Good: Use select_related
def get_products_with_categories_optimized():
    products = Product.objects.select_related('category').all()  # 1 query with JOIN
    
    for product in products:
        print(product.category.name)  # No additional queries
    
    # Total: 1 query
```

### select_related() for ForeignKey and OneToOne

```python
# models.py
class Category(models.Model):
    name = models.CharField(max_length=100)

class Brand(models.Model):
    name = models.CharField(max_length=100)

class Product(models.Model):
    name = models.CharField(max_length=200)
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    brand = models.ForeignKey(Brand, on_delete=models.CASCADE)

# views.py
def product_list(request):
    # ✅ Optimize ForeignKey access
    products = Product.objects.select_related('category', 'brand').all()
    
    # এখন category এবং brand access করলে additional queries হবে না
    for product in products:
        print(f"{product.name} - {product.category.name} - {product.brand.name}")
```

### prefetch_related() for ManyToMany and Reverse ForeignKey

```python
# models.py
class Tag(models.Model):
    name = models.CharField(max_length=50)

class Product(models.Model):
    name = models.CharField(max_length=200)
    tags = models.ManyToManyField(Tag)

# views.py
def product_list_with_tags(request):
    # ✅ Optimize ManyToMany access
    products = Product.objects.prefetch_related('tags').all()
    
    for product in products:
        tags = ', '.join(tag.name for tag in product.tags.all())
        print(f"{product.name}: {tags}")
```

### Complex Prefetching

```python
from django.db.models import Prefetch

def optimized_orders():
    # Custom prefetch with filtering
    recent_items = OrderItem.objects.filter(
        created_at__gte=timezone.now() - timedelta(days=30)
    )
    
    orders = Order.objects.prefetch_related(
        Prefetch('items', queryset=recent_items, to_attr='recent_items')
    ).all()
    
    for order in orders:
        print(f"Order {order.id} has {len(order.recent_items)} recent items")
```

### only() and defer()

```python
# ✅ only(): শুধু নির্দিষ্ট fields load করুন
products = Product.objects.only('id', 'name', 'price')
# SELECT id, name, price FROM products

# ✅ defer(): নির্দিষ্ট fields বাদ দিন
products = Product.objects.defer('description', 'specifications')
# SELECT id, name, price, ... (except description, specifications)
```

### Aggregation and Annotation

```python
from django.db.models import Count, Sum, Avg, F

# ✅ Database-level aggregation
category_stats = Category.objects.annotate(
    product_count=Count('product'),
    avg_price=Avg('product__price'),
    total_stock=Sum('product__stock')
)

for category in category_stats:
    print(f"{category.name}: {category.product_count} products")

# ✅ F() expressions for database-level operations
Product.objects.update(price=F('price') * 1.1)  # 10% price increase
```

### Query Optimization with exists() and count()

```python
# ❌ Bad: Loads all data
if Product.objects.filter(stock=0):
    print("Out of stock products exist")

# ✅ Good: Use exists()
if Product.objects.filter(stock=0).exists():
    print("Out of stock products exist")

# ❌ Bad: Loads all data to count
total = len(Product.objects.all())

# ✅ Good: Use count()
total = Product.objects.count()
```

---

## 2. Caching Strategies

### Django Cache Framework Setup

```python
# settings.py

# Redis cache (recommended for production)
CACHES = {
    'default': {
        'BACKEND': 'django.core.cache.backends.redis.RedisCache',
        'LOCATION': 'redis://127.0.0.1:6379/1',
        'OPTIONS': {
            'CLIENT_CLASS': 'django_redis.client.DefaultClient',
        },
        'KEY_PREFIX': 'myapp',
        'TIMEOUT': 300,  # 5 minutes default
    }
}

# Memcached
CACHES = {
    'default': {
        'BACKEND': 'django.core.cache.backends.memcached.PyMemcacheCache',
        'LOCATION': '127.0.0.1:11211',
    }
}

# File-based cache (development)
CACHES = {
    'default': {
        'BACKEND': 'django.core.cache.backends.filebased.FileBasedCache',
        'LOCATION': '/var/tmp/django_cache',
    }
}
```

### Low-Level Cache API

```python
from django.core.cache import cache

# Set cache
cache.set('my_key', 'my_value', timeout=300)  # 5 minutes

# Get cache
value = cache.get('my_key')
value = cache.get('my_key', default='default_value')

# Delete cache
cache.delete('my_key')

# Set multiple
cache.set_many({'key1': 'value1', 'key2': 'value2'}, timeout=300)

# Get multiple
values = cache.get_many(['key1', 'key2'])

# Clear all cache
cache.clear()
```

### View-Level Caching

```python
from django.views.decorators.cache import cache_page

# Cache view for 15 minutes
@cache_page(60 * 15)
def product_list(request):
    products = Product.objects.all()
    return render(request, 'products.html', {'products': products})

# Cache with custom key
@cache_page(60 * 15, key_prefix='products')
def product_list_v2(request):
    products = Product.objects.all()
    return render(request, 'products.html', {'products': products})
```

### Template Fragment Caching

```html
<!-- templates/products.html -->

{% load cache %}

{% cache 500 sidebar %}
    <div class="sidebar">
        <!-- Expensive sidebar content -->
        {% for category in categories %}
            <a href="{{ category.url }}">{{ category.name }}</a>
        {% endfor %}
    </div>
{% endcache %}

<!-- Cache with variables -->
{% cache 500 product_detail product.id %}
    <div class="product-details">
        <h1>{{ product.name }}</h1>
        <p>{{ product.description }}</p>
    </div>
{% endcache %}
```

### Per-Site Cache (Middleware)

```python
# settings.py

MIDDLEWARE = [
    'django.middleware.cache.UpdateCacheMiddleware',  # First
    'django.middleware.common.CommonMiddleware',
    'django.middleware.cache.FetchFromCacheMiddleware',  # Last
]

CACHE_MIDDLEWARE_ALIAS = 'default'
CACHE_MIDDLEWARE_SECONDS = 600  # 10 minutes
CACHE_MIDDLEWARE_KEY_PREFIX = 'mysite'
```

### Custom Cache Decorator

```python
from functools import wraps
from django.core.cache import cache

def cache_result(timeout=300, key_prefix=''):
    """
    Custom cache decorator for functions
    """
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            # Generate cache key
            cache_key = f"{key_prefix}:{func.__name__}:{args}:{kwargs}"
            
            # Try to get from cache
            result = cache.get(cache_key)
            
            if result is None:
                # Execute function
                result = func(*args, **kwargs)
                
                # Store in cache
                cache.set(cache_key, result, timeout)
            
            return result
        
        return wrapper
    return decorator

# Usage
@cache_result(timeout=600, key_prefix='products')
def get_featured_products():
    return Product.objects.filter(featured=True)[:10]
```

---

## 3. Static File Optimization

### Static Files Configuration

```python
# settings.py

STATIC_URL = '/static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')

STATICFILES_DIRS = [
    os.path.join(BASE_DIR, 'static'),
]

# Static files storage with compression
STATICFILES_STORAGE = 'django.contrib.staticfiles.storage.ManifestStaticFilesStorage'
```

### WhiteNoise for Static Files

```bash
# Install WhiteNoise
pip install whitenoise
```

```python
# settings.py

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',  # Add after SecurityMiddleware
    # Other middleware...
]

# WhiteNoise configuration
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'

# Enable compression and caching
WHITENOISE_COMPRESS_OFFLINE = True
```

### CDN Integration

```python
# settings.py

# Use CDN for static files
STATIC_URL = 'https://cdn.mysite.com/static/'

# AWS S3 for static files
AWS_ACCESS_KEY_ID = os.environ.get('AWS_ACCESS_KEY_ID')
AWS_SECRET_ACCESS_KEY = os.environ.get('AWS_SECRET_ACCESS_KEY')
AWS_STORAGE_BUCKET_NAME = 'mysite-static'
AWS_S3_CUSTOM_DOMAIN = f'{AWS_STORAGE_BUCKET_NAME}.s3.amazonaws.com'

STATIC_URL = f'https://{AWS_S3_CUSTOM_DOMAIN}/static/'
STATICFILES_STORAGE = 'storages.backends.s3boto3.S3Boto3Storage'
```

### Asset Minification

```python
# Install django-compressor
# pip install django-compressor

# settings.py
INSTALLED_APPS = [
    # ...
    'compressor',
]

STATICFILES_FINDERS = [
    'django.contrib.staticfiles.finders.FileSystemFinder',
    'django.contrib.staticfiles.finders.AppDirectoriesFinder',
    'compressor.finders.CompressorFinder',
]

COMPRESS_ENABLED = True
COMPRESS_OFFLINE = True
```

```html
<!-- templates/base.html -->

{% load compress %}

{% compress css %}
    <link rel="stylesheet" href="{% static 'css/style.css' %}">
    <link rel="stylesheet" href="{% static 'css/responsive.css' %}">
{% endcompress %}

{% compress js %}
    <script src="{% static 'js/jquery.js' %}"></script>
    <script src="{% static 'js/main.js' %}"></script>
{% endcompress %}
```

---

## 4. Template Optimization

### Template Caching

```python
# settings.py

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [os.path.join(BASE_DIR, 'templates')],
        'OPTIONS': {
            'context_processors': [...],
            'loaders': [
                # Cached template loader (production)
                ('django.template.loaders.cached.Loader', [
                    'django.template.loaders.filesystem.Loader',
                    'django.template.loaders.app_directories.Loader',
                ]),
            ],
        },
    },
]
```

### Efficient Template Tags

```python
# templatetags/custom_tags.py

from django import template
from django.core.cache import cache

register = template.Library()

@register.simple_tag
def get_categories():
    """Cached category list"""
    categories = cache.get('categories_list')
    
    if categories is None:
        from myapp.models import Category
        categories = list(Category.objects.all())
        cache.set('categories_list', categories, 300)
    
    return categories

@register.inclusion_tag('tags/product_card.html')
def product_card(product):
    """Reusable product card component"""
    return {'product': product}
```

### Avoid Complex Logic in Templates

```python
# ❌ Bad: Complex logic in template
# template.html
{% for product in products %}
    {% if product.price > 100 and product.stock > 0 and product.category.is_active %}
        <!-- Display product -->
    {% endif %}
{% endfor %}

# ✅ Good: Filter in view
# views.py
def product_list(request):
    products = Product.objects.filter(
        price__gt=100,
        stock__gt=0,
        category__is_active=True
    )
    return render(request, 'products.html', {'products': products})
```

---

## 5. Middleware Optimization

### Conditional Middleware

```python
# middleware/conditional.py

class ConditionalMiddleware:
    """
    Middleware যা শুধু নির্দিষ্ট conditions এ run হবে
    """
    
    def __init__(self, get_response):
        self.get_response = get_response
    
    def __call__(self, request):
        # Skip middleware for static files
        if request.path.startswith('/static/'):
            return self.get_response(request)
        
        # Skip for admin
        if request.path.startswith('/admin/'):
            return self.get_response(request)
        
        # Your middleware logic
        response = self.get_response(request)
        
        return response
```

### Lightweight Middleware

```python
# middleware/performance.py

import time
import logging

logger = logging.getLogger(__name__)

class PerformanceMiddleware:
    """
    Request performance tracking
    """
    
    def __init__(self, get_response):
        self.get_response = get_response
    
    def __call__(self, request):
        # Start timer
        start_time = time.time()
        
        # Process request
        response = self.get_response(request)
        
        # Calculate duration
        duration = time.time() - start_time
        
        # Log slow requests
        if duration > 1.0:  # 1 second threshold
            logger.warning(
                f'Slow request: {request.path} took {duration:.2f}s'
            )
        
        # Add header
        response['X-Request-Duration'] = f'{duration:.3f}'
        
        return response
```

---

## 6. Database Connection Pooling

### PostgreSQL Connection Pooling

```python
# settings.py

# Install: pip install psycopg2-binary django-db-connection-pool

DATABASES = {
    'default': {
        'ENGINE': 'dj_db_conn_pool.backends.postgresql',
        'NAME': 'mydb',
        'USER': 'myuser',
        'PASSWORD': 'mypassword',
        'HOST': 'localhost',
        'PORT': '5432',
        'POOL_OPTIONS': {
            'POOL_SIZE': 10,
            'MAX_OVERFLOW': 10,
        }
    }
}
```

### PgBouncer Configuration

```ini
# /etc/pgbouncer/pgbouncer.ini

[databases]
mydb = host=localhost port=5432 dbname=mydb

[pgbouncer]
listen_port = 6432
listen_addr = 127.0.0.1
auth_type = md5
auth_file = /etc/pgbouncer/userlist.txt
pool_mode = transaction
max_client_conn = 100
default_pool_size = 20
```

```python
# settings.py

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'mydb',
        'USER': 'myuser',
        'PASSWORD': 'mypassword',
        'HOST': '127.0.0.1',
        'PORT': '6432',  # PgBouncer port
    }
}
```

---

## 7. Lazy Loading

### Lazy QuerySets

```python
# QuerySets are lazy by default
products = Product.objects.all()  # No database hit yet

# Database hit happens when:
for product in products:  # Iteration
    print(product.name)

list(products)  # Conversion to list
len(products)   # Length check
products[0]     # Indexing
```

### Iterator for Large QuerySets

```python
# ❌ Bad: Loads all data into memory
products = Product.objects.all()
for product in products:
    process(product)

# ✅ Good: Use iterator for large datasets
products = Product.objects.all().iterator(chunk_size=1000)
for product in products:
    process(product)
```

### Lazy Properties

```python
from django.utils.functional import cached_property

class Product(models.Model):
    name = models.CharField(max_length=200)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    
    @cached_property
    def discounted_price(self):
        """
        Expensive calculation - cached after first access
        """
        # Complex calculation
        discount = self.calculate_discount()
        return self.price * (1 - discount)
    
    def calculate_discount(self):
        # Expensive operation
        return 0.1
```

---

## 8. Profiling Tools

### Django Debug Toolbar

```bash
# Install
pip install django-debug-toolbar
```

```python
# settings.py

INSTALLED_APPS = [
    # ...
    'debug_toolbar',
]

MIDDLEWARE = [
    'debug_toolbar.middleware.DebugToolbarMiddleware',
    # Other middleware...
]

INTERNAL_IPS = [
    '127.0.0.1',
]

DEBUG_TOOLBAR_CONFIG = {
    'SHOW_TOOLBAR_CALLBACK': lambda request: DEBUG,
}
```

```python
# urls.py

from django.conf import settings

if settings.DEBUG:
    import debug_toolbar
    urlpatterns = [
        path('__debug__/', include(debug_toolbar.urls)),
    ] + urlpatterns
```

### Django Silk

```bash
# Install
pip install django-silk
```

```python
# settings.py

INSTALLED_APPS = [
    # ...
    'silk',
]

MIDDLEWARE = [
    'silk.middleware.SilkyMiddleware',
    # Other middleware...
]

# Silk configuration
SILKY_PYTHON_PROFILER = True
SILKY_PYTHON_PROFILER_BINARY = True
SILKY_META = True
```

```python
# urls.py

urlpatterns = [
    path('silk/', include('silk.urls', namespace='silk')),
]
```

```bash
# Run migrations
python manage.py migrate
python manage.py collectstatic

# Access Silk at: http://localhost:8000/silk/
```

### Custom Profiling

```python
import cProfile
import pstats
from io import StringIO

def profile_view(func):
    """
    Decorator to profile view functions
    """
    def wrapper(*args, **kwargs):
        profiler = cProfile.Profile()
        profiler.enable()
        
        result = func(*args, **kwargs)
        
        profiler.disable()
        
        # Print stats
        s = StringIO()
        ps = pstats.Stats(profiler, stream=s).sort_stats('cumulative')
        ps.print_stats()
        print(s.getvalue())
        
        return result
    
    return wrapper

@profile_view
def expensive_view(request):
    # View logic
    pass
```

---

## Best Practices Summary

### Database Optimization Checklist

```python
# ✅ Use select_related for ForeignKey
products = Product.objects.select_related('category', 'brand')

# ✅ Use prefetch_related for ManyToMany
products = Product.objects.prefetch_related('tags')

# ✅ Use only() to limit fields
products = Product.objects.only('id', 'name', 'price')

# ✅ Use exists() instead of if queryset
if Product.objects.filter(stock=0).exists():
    pass

# ✅ Use count() instead of len()
total = Product.objects.count()

# ✅ Use iterator() for large datasets
for product in Product.objects.iterator(chunk_size=1000):
    pass

# ✅ Use F() for database-level operations
Product.objects.update(price=F('price') * 1.1)
```

### Caching Checklist

```python
# ✅ Cache expensive queries
from django.core.cache import cache

products = cache.get('featured_products')
if products is None:
    products = Product.objects.filter(featured=True)[:10]
    cache.set('featured_products', products, 300)

# ✅ Use template fragment caching
{% cache 500 sidebar %}
    <!-- Expensive content -->
{% endcache %}

# ✅ Cache view results
@cache_page(60 * 15)
def product_list(request):
    pass
```

---

## সারসংক্ষেপ

Django application এর performance optimize করে fast এবং scalable application তৈরি করুন:

### Key Points:

1. **Database Queries**: select_related, prefetch_related, only, defer
2. **Caching**: Redis, Memcached, view caching, template caching
3. **Static Files**: WhiteNoise, CDN, compression, minification
4. **Templates**: Cached loader, efficient tags, minimal logic
5. **Middleware**: Conditional execution, lightweight processing
6. **Connection Pooling**: PgBouncer, django-db-connection-pool
7. **Lazy Loading**: Iterator, cached_property, lazy querysets
8. **Profiling**: Debug Toolbar, Silk, custom profiling

Performance optimization একটি continuous process - regular monitoring এবং improvement করতে থাকুন! 🚀⚡
