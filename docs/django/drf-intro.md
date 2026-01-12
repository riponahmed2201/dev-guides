# Introduction to Django REST Framework (DRF)

Django দিয়ে আমরা সাধারণত সার্ভার সাইড রেন্ডারড (SSR) অ্যাপ্লিকেশন তৈরি করি। কিন্তু আধুনিক ফ্রন্টএন্ড ফ্রেমওয়ার্ক (React, Vue) বা মোবাইল অ্যাপের সাথে কানেক্ট করার জন্য আমাদের **API (Application Programming Interface)** এর প্রয়োজন হয়। Django REST Framework (DRF) হলো Django-র জন্য একটি শক্তিশালী টুলকিট যা দিয়ে খুব সহজে Web API তৈরি করা যায়।

## REST API কি?

**REST (Representational State Transfer)** হলো একটি আর্কিটেকচারাল স্টাইল যা ওয়েব সার্ভিসের জন্য স্ট্যান্ডার্ড রুল বা কনভেনশন সেট করে দেয়।
- **HTTP Methods:** `GET` (উদ্ধার), `POST` (তৈরি), `PUT/PATCH` (আপডেট), `DELETE` (মুছে ফেলা)।
- **Format:** সাধারণত JSON (JavaScript Object Notation) ফরম্যাটে ডেটা আদান-প্রদান করে।

## Installation & Setup

প্রথমে DRF ইনস্টল করতে হবে:
```bash
pip install djangorestframework
```

এরপর `settings.py` এর `INSTALLED_APPS` এ যোগ করতে হবে:

```python
INSTALLED_APPS = [
    # ...
    'rest_framework',
]
```

## Serializers

Django মডেলের ডেটা (QuerySet) কে JSON ফরম্যাটে কনভার্ট করার জন্য **Serializer** ব্যবহার করা হয়। এটি অনেকটা Django Form এর মতো।

```python
# serializers.py
from rest_framework import serializers
from .models import Product

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = '__all__'
```

## Views: APIView & ViewSets

ভিউ লেখার জন্য DRF দুই ধরনের এপ্রোচ দেয়:

### 1. APIView (Fine-grained control)
যদি আপনি প্রতিটি মেথড (`get`, `post`) নিজের হাতে হ্যান্ডেল করতে চান।

```python
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Product
from .serializers import ProductSerializer

class ProductListAPI(APIView):
    def get(self, request):
        products = Product.objects.all()
        serializer = ProductSerializer(products, many=True)
        return Response(serializer.data)
```

### 2. ViewSets (Rapid Development)
খুব দ্রুত CRUD API তৈরি করার জন্য।

```python
from rest_framework import viewsets
from .models import Product
from .serializers import ProductSerializer

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
```

## Routers

ViewSets ব্যবহার করলে `Router` এর মাধ্যমে অটোমেটিক URL তৈরি করা যায়।

```python
# urls.py
from rest_framework.routers import DefaultRouter
from .views import ProductViewSet

router = DefaultRouter()
router.register(r'products', ProductViewSet)

urlpatterns = router.urls
```

## Authentication & Permissions

DRF এ সহজে অথেনটিকেশন এবং পারমিশন সেট করা যায়।

```python
from rest_framework.permissions import IsAuthenticated

class ProductViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated] # শুধুমাত্র লগইন করা ইউজাররা এক্সেস পাবে
    # ...
```

এটি Django-র বেসিক ইন্ট্রোডাকশন। DRF এর বিস্তারিত ফিচার (Token Auth, Pagination, Throttling) নিয়ে আলাদা সেকশনে আলোচনা করা হবে।
