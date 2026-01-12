# Template Advanced

Django Template সিস্টেমে বেসিক `{{ variable }}` এবং `{% tag %}` এর বাইরেও অনেক শক্তিশালী ফিচার আছে যা কমপ্লেক্স অ্যাপ্লিকেশনে কাজে লাগে। এখানে আমরা Custom Template Tags, Filters, Context Processors এবং Performance Optimization নিয়ে আলোচনা করব।

## Custom Template Tags & Filters

Django তে ডিফল্ট অনেক ট্যাগ এবং ফিল্টার থাকলেও, অনেক সময় আমাদের নিজস্ব লজিক টেমপ্লেটে ইমপ্লিমেন্ট করার প্রয়োজন হয়। এজন আমাদের একটি `templatetags` ডিরেক্টরি এবং মডিউল তৈরি করতে হয়।

স্ট্রাকচার:
```text
your_app/
    __init__.py
    models.py
    templatetags/
        __init__.py
        my_custom_tags.py
    views.py
```

`my_custom_tags.py` ফাইলে:

```python
from django import template

register = template.Library()
```

### 1. Custom Filters

ফিল্টার সাধারণত ভ্যালু মডিফাই বা ফরম্যাট করতে ব্যবহৃত হয়।

```python
@register.filter(name='cut')
def cut(value, arg):
    """Removes all values of arg from the given string"""
    return value.replace(arg, '')
```

ব্যবহার:
```html
{% load my_custom_tags %}
{{ somevariable|cut:" " }}
```

### 2. Custom Tags

**Simple Tag:** কোনো ডেটা প্রসেস করে স্ট্রিং রিটার্ন করে।

```python
import datetime

@register.simple_tag
def current_time(format_string):
    return datetime.datetime.now().strftime(format_string)
```

ব্যবহার:
```html
{% current_time "%Y-%m-%d %I:%M %p" %}
```

**Inclusion Tag:** অন্য একটি টেমপ্লেট রেন্ডার করে রেজাল্ট দেখায়।

```python
@register.inclusion_tag('results.html')
def show_results(poll):
    choices = poll.choice_set.all()
    return {'choices': choices}
```

## Template Context Processors

Context Processor হলো এমন একটি ফাংশন যা গ্লোবালি সব টেমপ্লেটে নির্দিষ্ট কিছু ভেরিয়েবল অ্যাভেইলেবল করে দেয়। আলাদা করে ভিউ থেকে পাস করতে হয় না।

উদাহরণ: সাইটের গ্লোবাল সেটিংস বা মেনু আইটেম।

```python
# context_processors.py
def site_settings(request):
    return {
        'SITE_NAME': 'My Awesome Site',
        'SUPPORT_EMAIL': 'support@example.com'
    }
```

`settings.py` এ কনফিগারেশন:

```python
TEMPLATES = [
    {
        # ...
        'OPTIONS': {
            'context_processors': [
                # ...
                'your_app.context_processors.site_settings',
            ],
        },
    },
]
```

এখন যেকোনো টেমপ্লেটে `{{ SITE_NAME }}` ব্যবহার করা যাবে।

## Template Loaders & Caching

প্রোডাকশনে টেমপ্লেট রেন্ডারিং ফাস্ট করার জন্য Django `cached.Loader` ব্যবহার করতে পারে। এটি টেমপ্লেট মেমরিতে ক্যাশ করে রাখে যাতে বারবার ফাইল সিস্টেম থেকে রিড করতে না হয়।

`settings.py`:

```python
TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': False, # ম্যানুয়ালি লোডার কনফিগার করলে এটি False রাখতে হয়
        'OPTIONS': {
            'loaders': [
                ('django.template.loaders.cached.Loader', [
                    'django.template.loaders.filesystem.Loader',
                    'django.template.loaders.app_directories.Loader',
                ]),
            ],
        },
    },
]
```

*নোট: `DEBUG = True` থাকলে ক্যাশ লোডার ব্যবহার করা উচিত নয়, কারণ তখন কোড চেঞ্জ করলে রিলোড না হওয়া পর্যন্ত আপডেট দেখা যাবে না।*

## Template Inheritance Strategies & Block Override

কমপ্লেক্স প্রোজেক্টে মাল্টি-লেভেল ইনহেরিটেন্স ব্যবহার করা ভালো প্র্যাকটিস।

1.  **`base.html`**: সাইটের মেইন লেআউট (Header, Footer, CSS/JS)।
2.  **`base_section.html`**: স্পেসিফিক সেকশনের লেআউট (যেমন `account/base.html`) যা `base.html` কে এক্সটেন্ড করে।
3.  **`page.html`**: একচুয়াল পেজ যা `base_section.html` কে এক্সটেন্ড করে।

**Block Override & `{{ block.super }}`**

প্যারেন্ট ব্লকের কন্টেন্ট রেখে নতুন কন্টেন্ট যোগ করতে:

```html
{% block sidebar %}
    {{ block.super }}
    <li>New Item</li>
{% endblock %}
```

## Template Fragment Caching

পুরো পেজ ক্যাশ না করে পেজের নির্দিষ্ট অংশ (যেমন ভারী কুয়েরি বা মেনু) ক্যাশ করতে `cache` টেমপ্লেট ট্যাগ ব্যবহার করা হয়।

```html
{% load cache %}

{% cache 500 sidebar %}
    <!-- ভারী ক্যালকুলেশন বা কুয়েরি -->
    {% for item in expensive_menu_items %}
        <li>{{ item }}</li>
    {% endfor %}
{% endcache %}
```

এখানে `500` হলো সেকেন্ড এবং `sidebar` হলো ক্যাশ কি (Key)।
