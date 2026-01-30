# Advanced Testing

Django অ্যাপ্লিকেশনে উন্নত মানের টেস্টিং স্ট্র্যাটেজি অ্যাপলিকেশনকে আরও রোবাস্ট এবং মেইনটেনেবল করে তোলে। এই সেকশনে আমরা অ্যাডভান্সড টেস্টিং টেকনিকগুলো নিয়ে আলোচনা করবো।

## 1. Test-Driven Development (TDD)

TDD হলো একটি সফটওয়্যার ডেভেলপমেন্ট প্রসেস যেখানে কোড লেখার আগে টেস্ট লেখা হয়। এর স্টেপগুলো হলো:

1. **Red:** একটি টেস্ট লিখুন যা ফেইল করবে (কারণ কোডটি এখনো লেখা হয়নি)।
2. **Green:** টেস্টটি পাস করানোর জন্য ন্যূনতম প্রয়োজনীয় কোড লিখুন।
3. **Refactor:** কোডটিকে ক্লিন এবং অপ্টিমাইজ করুন।

**উপকারিতা:**

- কোড কোয়ালিটি নিশ্চিত হয়।
- বাগ এর পরিমাণ কমে।
- রিফ্যাক্টরিং করা সহজ হয়।

## 2. Behavior-Driven Development (BDD)

BDD তে অ্যাপ্লিকেশনের "Behavior" বা আচরণ অনুযায়ী টেস্ট লেখা হয়। এটি সাধারণত নন-টেকনিক্যাল পারসনদের (যেমন Product Owner) সাথে কমিউনিকেশন সহজ করে। Django তে `behave-django` ব্যবহার করে BDD করা যায়।

**Gherkin Syntax (Feature File):**

```gherkin
Feature: User Login
  Scenario: Successful login with valid credentials
    Given the user is on the login page
    When the user enters valid username and password
    Then the user should be redirected to the dashboard
```

## 3. pytest-django

Django এর ডিফল্ট `unittest` ছাড়াও `pytest` অত্যন্ত জনপ্রিয়। এটি ছোট এবং রিডেবল টেস্ট লিখতে সাহায্য করে।

**Installation:**

```bash
pip install pytest-django
```

**Configuration (`pytest.ini`):**

```ini
[pytest]
DJANGO_SETTINGS_MODULE = myproject.settings
python_files = tests.py test_*.py *_tests.py
```

**Usage:**

```python
import pytest
from django.urls import reverse

@pytest.mark.django_db
def test_home_page(client):
    url = reverse('home')
    response = client.get(url)
    assert response.status_code == 200
```

## 4. Factory Boy Advanced

`Factory Boy` দিয়ে অবজেক্ট তৈরি করার সময় রিলেটেড অবজেক্ট হ্যান্ডেল করার জন্য `SubFactory` এবং `RelatedFactory` ব্যবহার করা হয়।

```python
import factory
from .models import User, Profile

class UserFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = User
    username = factory.Sequence(lambda n: f'user_{n}')

class ProfileFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Profile
    user = factory.SubFactory(UserFactory)
    bio = "Test bio"
```

## 5. Mocking External Services

এক্সটার্নাল এপিআই বা থার্ড-পার্টি সার্ভিস (যেমন: Stripe বা AWS) টেস্ট করার সময় রিয়েল কল না করে `unittest.mock` ব্যবহার করা হয়।

```python
from unittest.mock import patch
from django.test import TestCase

class PaymentTest(TestCase):
    @patch('app.services.payment_gateway.process')
    def test_payment_success(self, mock_process):
        mock_process.return_value = {"status": "success"}
        # ... logic that calls the gateway ...
        self.assertTrue(result)
```

## 6. API Testing (DRF)

Django REST Framework (DRF) এর এপিআই টেস্ট করার জন্য `APITestCase` ব্যবহার করা হয়।

```python
from rest_framework.test import APITestCase
from rest_framework import status
from django.urls import reverse

class ProductAPITest(APITestCase):
    def test_create_product(self):
        url = reverse('product-list')
        data = {'name': 'New Product', 'price': 50}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
```

## 7. Performance and Load Testing

- **Performance Testing:** কোডের কোন অংশ স্লো তা চেক করার জন্য `cProfile` বা `django-debug-toolbar` ব্যবহার করা হয়।
- **Load Testing (Locust):** একসাথে হাজার হাজার ইউজার রিকোয়েস্ট পাঠালে সিস্টেম কেমন কাজ করে তা চেক করার জন্য `Locust` ব্যবহার করা হয়।

**Locust Example (`locustfile.py`):**

```python
from locust import HttpUser, task, between

class WebsiteUser(HttpUser):
    wait_time = between(1, 5)

    @task
    def load_home(self):
        self.client.get("/")
```

রান করতে: `locust -f locustfile.py`
