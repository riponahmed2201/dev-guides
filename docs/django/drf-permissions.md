# DRF Permissions

Authentication শুধু আইডেন্টিফাই করে যে ইউজার কে। আর **Permissions** নির্ধারণ করে যে সেই ইউজারের নির্দিষ্ট কোনো কাজ করার ক্ষমতা আছে কিনা।

## Built-in Permissions

DRF এর `rest_framework.permissions` মডিউলে অনেকগুলো বিল্ট-ইন পারমিশন ক্লাস থাকে।

- **`AllowAny`**: যে কেউ এক্সেস পাবে (Authentication ছাড়াও)।
- **`IsAuthenticated`**: শুধুমাত্র লগইন করা ইউজাররা এক্সেস পাবে।
- **`IsAdminUser`**: শুধুমাত্র `is_staff=True` ইউজাররা এক্সেস পাবে।
- **`IsAuthenticatedOrReadOnly`**: লগইন করা ইউজাররা `Create/Update/Delete` করতে পারবে, আর বাকিরা শুধু `Read` (GET) করতে পারবে।

**ব্যবহার:**

```python
from rest_framework.permissions import IsAuthenticated

class ProductViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
```

## DjangoModelPermissions

এটি Django-র ডিফল্ট পারমিশন সিস্টেম (`add_product`, `change_product`, `delete_product`) এর সাথে ইন্টিগ্রেট করে। যদি ইউজারের স্পেসিফিক মডেল পারমিশন থাকে, তবেই সে এক্সেস পাবে।

```python
from rest_framework.permissions import DjangoModelPermissions

class ProductViewSet(viewsets.ModelViewSet):
    permission_classes = [DjangoModelPermissions]
```
*নোট: এটি শুধুমাত্র `POST`, `PUT`, `DELETE` রিকোয়েস্টের জন্য পারমিশন চেক করে। `GET` রিকোয়েস্টের জন্য সাধারণত `DjangoModelPermissionsOrAnonReadOnly` ব্যবহার করা হয়।*

## Custom Permissions

যদি আপনার কাস্টম লজিক দরকার হয়, তবে `BasePermission` ইনহেরিট করে নতুন পারমিশন ক্লাস তৈরি করতে পারেন।

### Global/View Level Permission (`has_permission`)

```python
from rest_framework.permissions import BasePermission

class IsBlacklisted(BasePermission):
    """
    Allows access only if the user is not blacklisted.
    """
    def has_permission(self, request, view):
        return not request.user.is_blacklisted
```

### Object Level Permission (`has_object_permission`)

এটি তখন কল হয় যখন আপনি কোনো স্পেসিফিক অবজেক্ট এক্সেস করতে চান (যেমন: `GET /products/1/` বা `PUT /products/1/`)। সাধারণত চেক করা হয় যে ইউজার এই অবজেক্টের মালিক কিনা।

```python
class IsOwnerOrReadOnly(BasePermission):
    """
    Object-level permission to only allow owners of an object to edit it.
    Assumes the model instance has an `owner` attribute.
    """
    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed to any request,
        # so we'll always allow GET, HEAD or OPTIONS requests.
        if request.method in permissions.SAFE_METHODS:
            return True

        # Instance must have an attribute named `owner`.
        return obj.owner == request.user
```

**Custom Permission ব্যবহার:**

```python
class SnippetDetail(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated, IsOwnerOrReadOnly]
    queryset = Snippet.objects.all()
    serializer_class = SnippetSerializer
```
