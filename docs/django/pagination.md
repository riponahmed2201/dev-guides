# Pagination

অনেক ডেটা একসাথে দেখালে পেজ লোড স্লো হয়ে যায় এবং ইউজার এক্সপেরিয়েন্স খারাপ হয়। তাই ডেটাকে ছোট ছোট চাঙ্কে বা পেজে ভাগ করে দেখানোই হলো **Pagination**। Django তে বিল্ট-ইন `Paginator` ক্লাস দিয়ে এটি খুব সহজে করা যায়।

## Paginator & Page Object

Django এর `django.core.paginator` মডিউলে `Paginator` ক্লাস থাকে।

উদাহরণ:

```python
from django.core.paginator import Paginator

objects = ['john', 'paul', 'george', 'ringo', 'pete']
p = Paginator(objects, 2) # প্রতি পেজে ২টি করে আইটেম

page1 = p.page(1)
print(page1.object_list) # ['john', 'paul']

page2 = p.page(2)
print(page2.object_list) # ['george', 'ringo']
print(page2.has_next()) # True
print(page2.has_previous()) # True
```

**Paginator Methods/Attributes:**
- `count`: মোট আইটেম সংখ্যা।
- `num_pages`: মোট পেজ সংখ্যা।
- `page_range`: পেজের রেঞ্জ (যেমন: `range(1, 4)`).

**Page Object Methods:**
- `has_next()`: পরের পেজ আছে কিনা।
- `has_previous()`: আগের পেজ আছে কিনা।
- `has_other_pages()`: আগের বা পরের কোনো পেজ আছে কিনা।
- `next_page_number()`: পরের পেজ নম্বর।
- `previous_page_number()`: আগের পেজ নম্বর।

## Function Based View (FBV) Pagination

```python
from django.core.paginator import Paginator
from django.shortcuts import render
from .models import Product

def product_list(request):
    product_list = Product.objects.all()
    paginator = Paginator(product_list, 10) # প্রতি পেজে ১০টি

    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)
    
    return render(request, 'product_list.html', {'page_obj': page_obj})
```

## Template Pagination

টেমপ্লেটে `page_obj` ব্যবহার করে নেভিগেশন তৈরি করা হয়।

```html
{% for product in page_obj %}
    <p>{{ product.name }}</p>
{% endfor %}

<div class="pagination">
    <span class="step-links">
        {% if page_obj.has_previous %}
            <a href="?page=1">&laquo; first</a>
            <a href="?page={{ page_obj.previous_page_number }}">previous</a>
        {% endif %}

        <span class="current">
            Page {{ page_obj.number }} of {{ page_obj.paginator.num_pages }}.
        </span>

        {% if page_obj.has_next %}
            <a href="?page={{ page_obj.next_page_number }}">next</a>
            <a href="?page={{ page_obj.paginator.num_pages }}">last &raquo;</a>
        {% endif %}
    </span>
</div>
```

## ListView Pagination

Class Based View (ListView) তে `paginate_by` অ্যাট্রিবিউট ব্যবহার করে খুব সহজে পেজিনেশন করা যায়।

```python
from django.views.generic import ListView
from .models import Product

class ProductListView(ListView):
    model = Product
    template_name = 'product_list.html'
    context_object_name = 'products'
    paginate_by = 10  # প্রতি পেজে ১০টি আইটেম
```

টেমপ্লেটে তখন অটোমেটিক `page_obj` এবং `is_paginated` ভেরিয়েবল পাওয়া যায়।

## Custom Pagination

ডিফল্ট পেজিনেশনে অনেক সময় রেঞ্জ লিমিট করা লাগে (যেমন: 1, 2, ... 45, 46)। এজন্য কাস্টম টেমপ্লেট ট্যাগ বা ভিউ লজিক ব্যবহার করা হয় `elided_page_range` মেথড দিয়ে।

```python
# view তে
page_range = paginator.get_elided_page_range(number, on_each_side=2, on_ends=1)
```

## Ajax Pagination

পেজ রিলোড না করে পেজিনেশন করতে চাইলে JavaScript (Fetch API বা jQuery) ব্যবহার করতে হয়।

১. ভিউ থেকে JSON রেসপন্স রিটার্ন করতে হয় অথবা পার্শিয়াল HTML রেন্ডার করতে হয়।
২. ফ্রন্টএন্ডে বাটন ক্লিলে নতুন ডেটা ফেচ করে DOM আপডেট করতে হয়।

উদাহরণ (Conceptual):
```javascript
fetch(`/products?page=${nextPage}`)
    .then(response => response.text())
    .then(html => {
        document.getElementById('product-container').innerHTML = html;
    });
```
