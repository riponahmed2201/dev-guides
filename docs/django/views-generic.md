# Generic Class Based Views (GCBV)

Django-তে ওয়েব অ্যাপ বানাতে গেলে আমরা বারবার একই কাজ করি: ডাটাবেস থেকে লিস্ট দেখানো, ডিটেইলস দেখানো, ফর্ম সাবমিট করা, বা ডাটা ডিলিট করা। এই কমন কাজগুলোর জন্য Django আমাদের **Generic Views** দেয়, যা দিয়ে মাত্র কয়েক লাইন কোড লিখেই পুরো ফিচার তৈরি করা সম্ভব।

---

## ১. `ListView` (ডাটা তালিকা দেখানো)

ডাটাবেস থেকে অনেকগুলো অবজেক্ট এনে একটি পেজে দেখানোর জন্য।

```python
from django.views.generic import ListView
from .models import Product

class ProductListView(ListView):
    model = Product
    template_name = "product_list.html"  # টেমপ্লেট ফাইলের নাম
    context_object_name = "products"     # টেমপ্লেটে লুপ চালানোর জন্য ভেরিয়েবল নাম
    paginate_by = 10                     # পেজিনেশন (প্রতি পেজে ১০টি)

    # কাস্টম কুয়েরি (অপশনাল)
    def get_queryset(self):
        return Product.objects.filter(is_active=True).order_by('-price')
```

**টেমপ্লেটে ব্যবহার:**
```html
{% for product in products %}
    <h2>{{ product.name }}</h2>
{% endfor %}
```

---

## ২. `DetailView` (একটির বিস্তারিত দেখানো)

নির্দিষ্ট একটি অবজেক্টের ডিটেইলস দেখানোর জন্য। এটি URL থেকে `pk` বা `slug` নিয়ে অটোমেটিক ডাটাবেস থেকে অবজেক্ট খুঁজে আনে।

```python
from django.views.generic import DetailView
from .models import Product

class ProductDetailView(DetailView):
    model = Product
    template_name = "product_detail.html"
    context_object_name = "product"
```

**URL:**
```python
path('product/<int:pk>/', ProductDetailView.as_view(), name='product_detail'),
```

---

## ৩. `CreateView` (ডাটা তৈরি করা)

নতুন ডাটা তৈরি করার জন্য। এটি অটোমেটিক ফর্ম জেনারেট করে, ভ্যালিডেশন করে এবং ডাটা সেভ করে।

```python
from django.views.generic import CreateView
from django.urls import reverse_lazy
from .models import Product

class ProductCreateView(CreateView):
    model = Product
    fields = ['name', 'price', 'description'] # কোন কোন ফিল্ড ফর্মে থাকবে
    template_name = "product_form.html"
    success_url = reverse_lazy('product_list') # সফল হলে কোথায় যাবে

    def form_valid(self, form):
        # সেভ করার আগে কিছু করতে চাইলে (যেমন: ইউজার সেট করা)
        form.instance.created_by = self.request.user
        return super().form_valid(form)
```

---

## ৪. `UpdateView` (ডাটা আপডেট করা)

আগের ডাটা এডিট করার জন্য। এটি `CreateView` এর মতোই, কিন্তু ফর্মে আগের ডাটা প্রি-ফিল (Pre-fill) করা থাকে।

```python
from django.views.generic import UpdateView

class ProductUpdateView(UpdateView):
    model = Product
    fields = ['name', 'price']
    template_name = "product_form.html" # একই টেমপ্লেট ক্রিয়েট এবং আপডেটের জন্য ব্যবহার করা যায়
    success_url = reverse_lazy('product_list')
```

---

## ৫. `DeleteView` (ডাটা মুছে ফেলা)

ডাটা ডিলিট করার জন্য। এটি সাধারণত একটি কনফার্মেশন পেজ দেখায় (GET মেথডে) এবং ডিলিট করে (POST মেথডে)।

```python
from django.views.generic import DeleteView

class ProductDeleteView(DeleteView):
    model = Product
    template_name = "product_confirm_delete.html" # কনফার্মেশন পেজ
    success_url = reverse_lazy('product_list')
```

---

## ৬. `FormView` (যেকোনো ফর্মের জন্য)

যদি আপনার ফর্মটি কোনো মডেলের সাথে সরাসরি যুক্ত না হয় (যেমন: কন্টাক্ট ফর্ম বা ইমেইল সেন্ডিং), তবে `FormView` ব্যবহার করা হয়।

```python
from django.views.generic import FormView
from .forms import ContactForm

class ContactView(FormView):
    template_name = "contact.html"
    form_class = ContactForm
    success_url = "/thanks/"

    def form_valid(self, form):
        # ফর্ম ভ্যালিড হলে এখানে লজিক লিখুন (যেমন: ইমেইল পাঠানো)
        form.send_email()
        return super().form_valid(form)
```

---

## ৭. কাস্টমাইজেশন টিপস

### ৭.১ `context_object_name`
ডিফল্টভাবে `ListView` `object_list` এবং `DetailView` `object` নাম ব্যবহার করে। এটি পরিবর্তন করে অর্থবহ নাম দেওয়া ভালো (যেমন `products`, `blog_post` ইত্যাদি)।

### ৭.২ `template_name`
ডিফল্টভাবে Django `appname/modelname_viewtype.html` খোঁজে (যেমন `shop/product_list.html`)। আপনি চাইলে নিজের মতো নাম দিতে পারেন।

### ৭.৩ `get_queryset()`
পুরো টেবিলের ডাটা না এনে যদি ফিল্টার করা ডাটা আনতে চান তবে এই মেথড ওভাররাইড (Override) করতে হয়।

```python
def get_queryset(self):
    return Product.objects.filter(author=self.request.user)
```
