# Django REST Framework (DRF) Advanced

Django REST Framework (DRF) দিয়ে সাধারণ API তৈরি করা সহজ, তবে প্রোডাকশন লেভেলে এবং জটিল প্রোজেক্টের জন্য কিছু অ্যাডভান্সড ফিচার এবং অপ্টিমাইজেশন জানা প্রয়োজন।

## 1. Custom Renderers and Parsers

DRF ডিফল্টভাবে JSON এবং Browsable API রেন্ডার করে। তবে আপনার যদি কাস্টম ফরম্যাট (যেমন- XML বা YAML) প্রয়োজন হয়, তবে আপনি কাস্টম রেন্ডারার তৈরি করতে পারেন।

- **Renderers:** ডেটাকে আউটপুট ফরম্যাটে কনভার্ট করে।
- **Parsers:** ইনকামিং রিকোয়েস্টের ডেটাকে পাইথন ডিকশনারিতে কনভার্ট করে।

```python
# Custom XML Renderer example
from rest_framework.renderers import BaseRenderer

class XMLRenderer(BaseRenderer):
    media_type = 'application/xml'
    format = 'xml'

    def render(self, data, accepted_media_type=None, renderer_context=None):
        # logic to convert data to XML
        return xml_data
```

## 2. Hyperlinked Serializers

`ModelSerializer` এর পরিবর্তে `HyperlinkedModelSerializer` ব্যবহার করলে API-তে আইডি-র বদলে সরাসরি রিসোর্সের ইউআরএল (URL) রিটার্ন করে। এটি API কে আরও ব্রাউজেবল এবং সেলফ-ডেসক্রিপটিভ করে তোলে।

```python
class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ['url', 'username', 'email']
```

## 3. API Versioning

API আপডেট করার সময় পুরনো ইউজারদের সাপোর্ট দেওয়ার জন্য ভার্সনিং প্রয়োজন। DRF-এ কয়েকভাবে ভার্সনিং করা যায়:

- **URLPathVersioning:** `/api/v1/users/`
- **QueryParameterVersioning:** `/api/users/?version=1`
- **AcceptHeaderVersioning:** হেডার দিয়ে ভার্সন কন্ট্রোল করা।

```python
# settings.py configuration
REST_FRAMEWORK = {
    'DEFAULT_VERSIONING_CLASS': 'rest_framework.versioning.URLPathVersioning'
}
```

## 4. Nested Routes

জটিল রিলেশনশিপের ক্ষেত্রে (যেমন- `/users/1/posts/`) নেস্টেড রাউট প্রয়োজন হয়। এর জন্য `drf-nested-routers` প্যাকেজটি ব্যাপকভাবে ব্যবহৃত হয়।

## 5. Schema Customization (OpenAPI)

আপনার API-এর ডকুমেন্টেশন অটোমেট করতে `drf-spectacular` ব্যবহার করা হয়। এটি OpenAPI 3.0 সাপোর্ট করে এবং স্বয়ংক্রিয়ভাবে Swagger UI বা Redoc জেনারেট করে।

## 6. Performance Optimization

বড় ডেটাসেটের ক্ষেত্রে API স্লো হয়ে যেতে পারে। পারফরম্যান্স বাড়ানোর কিছু উপায়:

- **`select_related` and `prefetch_related`:** ডাটাবেস কোয়েরি কমানোর জন্য।
- **Pagination:** এক সাথে সব ডেটা না পাঠিয়ে ছোট ছোট পেজে পাঠানো।
- **Throttling:** রিকোয়েস্টের লিমিট সেট করা যাতে কেউ স্প্যাম করতে না পারে।

## 7. Caching Strategies

API-এর রেসপন্স টাইম কমানোর জন্য ক্যাশিং অত্যন্ত কার্যকর।

- **View Caching:** নির্দিষ্ট ভিউ-এর রেজাল্ট ক্যাশ করা।
- **API Cache:** `drf-extensions` ব্যবহার করে সহজেই মেথড বা ভিউ লেভেলে ক্যাশিং ইমপ্লিমেন্ট করা যায়।
