# DRF Advanced Topics

DRF এর বেসিক ফিচারগুলোর বাইরেও প্রোডাকশন গ্রেড API তৈরির জন্য কিছু অ্যাডভান্সড ফিচার জানা প্রয়োজন।

## Filtering

API তে ডেটা ফিল্টার করার জন্য `django-filter` লাইব্রেরিটি সবচেয়ে জনপ্রিয়।

**Installation:**
```bash
pip install django-filter
```

**Setup:**
`settings.py` এ `INSTALLED_APPS` এ যোগ করুন এবং `DEFAULT_FILTER_BACKENDS` কনফিগার করুন।

```python
REST_FRAMEWORK = {
    'DEFAULT_FILTER_BACKENDS': ['django_filters.rest_framework.DjangoFilterBackend']
}
```

**Usage in View:**

```python
from django_filters.rest_framework import DjangoFilterBackend

class ProductList(generics.ListAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['category', 'in_stock']
```
এখন আপনি `/products/?category=electronics&in_stock=true` এভাবে রিকোয়েস্ট করতে পারবেন।

## Searching & Ordering

DRF এর বিল্ট-ইন `SearchFilter` এবং `OrderingFilter` ব্যবহার করা খুব সহজ।

```python
from rest_framework import filters

class ProductList(generics.ListAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    
    search_fields = ['name', 'description']
    ordering_fields = ['price', 'created_at']
```

- **Search:** `/products/?search=iphone` (name বা description এ খুঁজবে)
- **Ordering:** `/products/?ordering=-price` (দাম অনুযায়ী ডিসন্ডিং অর্ডার)

## Pagination

গ্লোবালি পেজিনেশন সেট করতে `settings.py` এ কনফিগার করুন:

```python
REST_FRAMEWORK = {
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 10
}
```

অথবা ভিউ লেভেলে:

```python
class StandardResultsSetPagination(PageNumberPagination):
    page_size = 100
    page_size_query_param = 'page_size'
    max_page_size = 1000

class ProductViewSet(viewsets.ModelViewSet):
    pagination_class = StandardResultsSetPagination
```

## Throttling (Rate Limiting)

API কে অ্যাবিউজ থেকে রক্ষা করতে Throttling ব্যবহার করা হয়।

**Global Setup:**
```python
REST_FRAMEWORK = {
    'DEFAULT_THROTTLE_CLASSES': [
        'rest_framework.throttling.AnonRateThrottle',
        'rest_framework.throttling.UserRateThrottle'
    ],
    'DEFAULT_THROTTLE_RATES': {
        'anon': '100/day',
        'user': '1000/day'
    }
}
```

## Versioning

API ভার্সনিং মেইনটেইন করা একটি গুড প্র্যাকটিস। DRF এ `URLPathVersioning` বা `NamespaceVersioning` ব্যবহার করা যায়।

```python
# settings.py
REST_FRAMEWORK = {
    'DEFAULT_VERSIONING_CLASS': 'rest_framework.versioning.URLPathVersioning'
}
```
URL: `/v1/products/`

## Content Negotiation

DRF ডিফল্টভাবে JSON এবং Browsable API রেন্ডার করে। আপনি চাইলে এটি কন্ট্রোল করতে পারেন।

```python
REST_FRAMEWORK = {
    'DEFAULT_RENDERER_CLASSES': [
        'rest_framework.renderers.JSONRenderer',
    ]
}
```
এখন Browsable API ইন্টারফেস আর দেখাবে না, শুধু JSON রিটার্ন করবে।

## CORS (Cross-Origin Resource Sharing)

ফ্রন্টএন্ড (যেমন: React/Vue) যদি আলাদা ডোমেইন বা পোর্টে থাকে, তবে ব্রাউজার সিকিউরিটির কারণে API কল ব্লক করে দিতে পারে। এটি ফিক্স করতে `django-cors-headers` ব্যবহার করতে হয়।

**Installation:**
```bash
pip install django-cors-headers
```

**Setup (`settings.py`):**

```python
INSTALLED_APPS = [
    # ...
    'corsheaders',
    # ...
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware', # একদম উপরে রাখা ভালো
    'django.middleware.common.CommonMiddleware',
    # ...
]

CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "https://example.com",
]
```
