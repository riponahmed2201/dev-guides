# Testing

অ্যাপ্লিকেশন বাগ-মুক্ত এবং স্টেবল রাখার জন্য টেস্টিং অপরিহার্য। Django তে `unittest` লাইব্রেরির উপর ভিত্তি করে শক্তিশালী টেস্টিং ফ্রেমওয়ার্ক রয়েছে।

## Why Write Tests?
- **Confidence:** কোড পরিবর্তন করলে আগের কিছু ভেঙেছে কিনা তা নিশ্চিত হওয়া যায়।
- **Documentation:** টেস্ট কেসগুলো ডকুমেন্টেশন হিসেবে কাজ করে (কিভাবে কোড ব্যবহার করতে হয়)।
- **Debugging:** বাগ ফিক্স করা সহজ হয়।

## Django TestCase

Django তে টেস্ট লেখার জন্য `django.test.TestCase` ক্লাস ব্যবহার করা হয়। এটি প্রতিটি টেস্টের পর ডাটাবেস রোলব্যাক করে, তাই এক টেস্টের ডেটা অন্য টেস্টকে প্রভাবিত করে না।

```python
# app/tests.py
from django.test import TestCase
from .models import Product

class ProductModelTest(TestCase):
    def setUp(self):
        # প্রতিটি টেস্ট মেথড কল হওয়ার আগে এটি রান হয়
        Product.objects.create(name="iPhone", price=999)

    def test_product_creation(self):
        product = Product.objects.get(name="iPhone")
        self.assertEqual(product.price, 999)
```

## Test Client

ভিউজ টেস্ট করার জন্য `Client` ব্যবহার করা হয়। এটি একটি ডামি ব্রাউজার হিসেবে কাজ করে।

```python
class ProductViewTest(TestCase):
    def test_product_list_view(self):
        response = self.client.get('/products/')
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "iPhone")
```

## Fixtures vs Factories

টেস্ট ডেটা পপুলেট করার জন্য দুই উপায় আছে:

### 1. Fixtures (Static/JSON)
ডেটা JSON ফাইলে সেভ করে রাখা হয়।
```python
class MyTest(TestCase):
    fixtures = ['products.json']
```

### 2. Factory Boy (Dynamic/Recommended)
এটি ডায়নামিকভাবে অবজেক্ট তৈরি করতে সাহায্য করে। এটি `fixtures` এর চেয়ে বেশি ফ্লেক্সিবল।

**Installation:** `pip install factory_boy`

```python
import factory
from .models import Product

class ProductFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Product
    
    name = "Test Product"
    price = 100

# Usage in tests
product = ProductFactory(name="New Name")
```

## Code Coverage

আপনার কোডের কত শতাংশ টেস্ট করা হয়েছে তা দেখার জন্য `coverage` টুল ব্যবহার করা হয়।

**Installation:** `pip install coverage`

**Run Tests:**
```bash
coverage run manage.py test
```

**View Report:**
```bash
coverage report
coverage html # HTML রিপোর্ট জেনারেট করবে
```

## Mocking

এক্সটার্নাল সার্ভিস (যেমন: ইমেইল পাঠানো বা পেমেন্ট গেটওয়ে) টেস্ট করার সময় `unittest.mock` ব্যবহার করে ফেইক রেসপন্স তৈরি করা হয়।

```python
from unittest.mock import patch

@patch('app.utils.send_email')
def test_email_sending(self, mock_send_email):
    # ... trigger email logic ...
    mock_send_email.assert_called_once()
```
