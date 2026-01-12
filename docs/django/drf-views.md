# DRF Views & ViewSets

Django REST Framework ভিউ তৈরি করার জন্য কয়েক লেভেলের বিমূর্ততা (Abstraction) প্রদান করে। একদম বেসিক `APIView` থেকে শুরু করে হাই-লেভেল `ModelViewSet` পর্যন্ত।

## 1. APIView (Low Level)

এটি Django-র `View` ক্লাসের সাবক্লাস। এখানে আপনাকে `get`, `post`, `put`, `delete` মেথডগুলো ম্যানুয়ালি ডিফাইন করতে হয়। এটি সবচেয়ে বেশি ফ্লেক্সিবিলিটি দেয়।

```python
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

class ProductList(APIView):
    def get(self, request):
        products = Product.objects.all()
        serializer = ProductSerializer(products, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = ProductSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
```

## 2. GenericAPIView & Mixins

DRF কমন অ্যাকশনগুলোর (List, Create, Retrieve, Update, Destroy) জন্য রিইউজেবল `Mixins` প্রোভাইড করে। `GenericAPIView` এর সাথে এই মিক্সিনগুলো ব্যবহার করে কোড কমানো যায়।

```python
from rest_framework import mixins, generics

class ProductList(mixins.ListModelMixin,
                  mixins.CreateModelMixin,
                  generics.GenericAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        return self.create(request, *args, **kwargs)
```

## 3. Concrete View Classes (Common)

মিক্সিনগুলো ম্যানুয়ালি জোড়া না লাগিয়ে আমরা প্রিবিল্ট ক্লাস ব্যবহার করতে পারি।

- `ListCreateAPIView`: GET (list) এবং POST (create) হ্যান্ডেল করে।
- `RetrieveUpdateDestroyAPIView`: GET (single), PUT, PATCH, DELETE হ্যান্ডেল করে।

```python
class ProductList(generics.ListCreateAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

class ProductDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
```

## 4. ViewSets & ModelViewSet (High Level)

ViewSets এ আমরা `get` বা `post` এর বদলে `list`, `create`, `retrieve` ইত্যাদি অ্যাকশন ডিফাইন করি। রাউটার ব্যবহারের মাধ্যমে এটি অটোমেটিক URL কনফিগার করে।

**`ModelViewSet`**: এটি সব কমন অ্যাকশন (CRUD) একবারে দিয়ে দেয়।

```python
from rest_framework import viewsets

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    # permission_classes = [IsAuthenticated]
```

## ViewSet Actions (`@action`)

স্ট্যান্ডার্ড CRUD (create, list, retrieve, update, destroy) এর বাইরে কাস্টম কোনো এন্ডপয়েন্ট দরকার হলে `@action` ডেকোরেটর ব্যবহার করা হয়।

উদাহরণ: পাসওয়ার্ড রিসেট বা প্রোডাক্টের স্টক চেক করা।

```python
from rest_framework.decorators import action
from rest_framework.response import Response

class UserViewSet(viewsets.ModelViewSet):
    # ... standard setup ...

    # URL: /users/{pk}/change_password/
    @action(detail=True, methods=['post'])
    def change_password(self, request, pk=None):
        user = self.get_object()
        # ... password change logic ...
        return Response({'status': 'password set'})

    # URL: /users/recent_users/
    @action(detail=False, methods=['get'])
    def recent_users(self, request):
        recent_users = User.objects.all().order_by('-date_joined')[:10]
        serializer = self.get_serializer(recent_users, many=True)
        return Response(serializer.data)
```

- **`detail=True`**: অ্যাকশনটি সিঙ্গেল অবজেক্টের জন্য (URL এ ID থাকবে)।
- **`detail=False`**: অ্যাকশনটি পুরো কালেকশনের জন্য (URL এ ID থাকবে না)।
