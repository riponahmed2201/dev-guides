# Permissions and Authorization

অথেন্টিকেশন (কে আপনি?) এবং অথোরাইজেশন (আপনি কি করতে পারবেন?) দুটি আলাদা জিনিস। Django-তে খুব শক্তিশালী পারমিশন সিস্টেম আছে যা দিয়ে আপনি কন্ট্রোল করতে পারেন কোন ইউজার কোন পেজ বা ডাটা দেখতে পাবে।

---

## ১. ডিফল্ট পারমিশন সিস্টেম

যখন আপনি কোনো মডেল তৈরি করেন এবং মাইগ্রেট করেন, Django অটোমেটিক ৪টি পারমিশন তৈরি করে প্রতি মডেলের জন্য:
1.  `add`: ডাটা যোগ করা
2.  `change`: ডাটা এডিট করা
3.  `delete`: ডাটা মুছে ফেলা
4.  `view`: ডাটা দেখা

পারমিশনগুলো `app_label.action_modelname` ফরম্যাটে থাকে।
উদাহরণ: `store.add_product`, `store.change_product`।

---

## ২. ইউজার এবং গ্রুপ পারমিশন

এডমিন প্যানেল থেকে খুব সহজেই ইউজার বা গ্রুপকে পারমিশন দেওয়া যায়।

### ১.১ ইউজারকে পারমিশন দেওয়া (কোড দিয়ে)

```python
from django.contrib.auth.models import Permission, User

user = User.objects.get(username='ripon')
permission = Permission.objects.get(codename='add_product')
user.user_permissions.add(permission)
```

### ১.২ পারমিশন চেক করা (`has_perm`)

```python
if user.has_perm('store.add_product'):
    print("User can add products!")
else:
    print("Permission Denied!")
```

---

## ৩. ভিউ লেভেলে পারমিশন চেক

কোনো ভিউতে এক্সেস কন্ট্রোল করার জন্য।

### ৩.১ `@permission_required` ডেকোরেটর (FBV)

```python
from django.contrib.auth.decorators import permission_required

@permission_required('store.add_product', login_url='/login/')
def add_product_view(request):
    # কোড...
```

### ৩.২ `PermissionRequiredMixin` (CBV)

```python
from django.contrib.auth.mixins import PermissionRequiredMixin
from django.views.generic import CreateView

class ProductCreateView(PermissionRequiredMixin, CreateView):
    permission_required = 'store.add_product'
    template_name = 'product_form.html'
    model = Product
```

---

## ৪. টেমপ্লেটে পারমিশন চেক

টেমপ্লেটে আমরা চেক করতে পারি ইউজারের পারমিশন আছে কি না, এবং সেই অনুযায়ী বাটন দেখাতে বা লুকাতে পারি।

```html
{% if perms.store.add_product %}
    <a href="/add-product/">Add New Product</a>
{% endif %}
```
এখানে `perms.app_label.permission_codename` প্যাটার্ন ব্যবহার হয়।

---

## ৫. Custom Permissions

ডিফল্ট (add, change, delete, view) এর বাইরে যদি নিজের মতো পারমিশন দরকার হয়।

**models.py:**
```python
class BlogPost(models.Model):
    title = models.CharField(max_length=100)
    
    class Meta:
        permissions = [
            ("can_publish_post", "Can publish blog posts"),
            ("can_feature_post", "Can make a post featured"),
        ]
```
মাইগ্রেশন চালানোর পর এই পারমিশনগুলো ডাটাবেসে তৈরি হবে এবং আপনি এগুলো ব্যবহার করতে পারবেন (`blog.can_publish_post`)।

---

## ৬. Object-Level Permissions (Advanced)

Django-র ডিফল্ট পারমিশন সিস্টেম টেবিল লেভেলে কাজ করে। অর্থাৎ, কাউকে `change_product` পারমিশন দিলে সে **সব** প্রোডাক্ট এডিট করতে পারবে।

কিন্তু যদি আপনি চান একজন ইউজার **শুধু নিজের তৈরি করা** প্রোডাক্ট এডিট করতে পারবে? একে বলে **Object-Level Permission**।

Django ডিফল্টভাবে এটি সাপোর্ট করে না। এর জন্য থার্ড-পার্টি লাইব্রেরি **`django-guardian`** ব্যবহার করা হয় অথবা কাস্টম লজিক লিখতে হয়।

### ৬.১ `UserPassesTestMixin` দিয়ে সমাধান

সহজ অবজেক্ট লেভেল চেকিংয়ের জন্য এটি সেরা।

```python
from django.contrib.auth.mixins import UserPassesTestMixin
from django.views.generic import UpdateView

class PostUpdateView(UserPassesTestMixin, UpdateView):
    model = Post
    
    def test_func(self):
        post = self.get_object() # যেই পোস্ট এডিট করতে চাচ্ছে
        return self.request.user == post.author # রিকোয়েস্ট ইউজার কি লেখক?
```
যদি `test_func` False রিটার্ন করে, তবে ইউজার '403 Forbidden' এরর পাবে।
