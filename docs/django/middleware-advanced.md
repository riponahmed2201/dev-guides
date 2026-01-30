# Custom Middlewares Advanced

Middleware হলো Django-র রিকোয়েস্ট/রেসপন্স সাইকেলের একটি শক্তিশালী মেকানিজম। অ্যাডভান্সড মিডলওয়্যার ব্যবহারের মাধ্যমে আপনি অ্যাপ্লিকেশনের গ্লোবাল বিহেভিয়ার খুব সহজেই কন্ট্রোল করতে পারেন।

## 1. Middleware Factory Pattern

আধুনিক Django-তে মিডলওয়্যার লেখার জন্য ফাংশন-ভিত্তিক ফ্যাক্টরি প্যাটার্ন ব্যবহার করা হয়। এটি ক্লাসের চেয়ে ক্লিন এবং মেমোরি ইন্টারনাল হ্যান্ডেলিং এ দক্ষ।

```python
def simple_middleware(get_response):
    # One-time configuration and initialization.
    def middleware(request):
        # Code to be executed for each request before
        # the view (and later middleware) are called.

        response = get_response(request)

        # Code to be executed for each request/response after
        # the view is called.
        return response

    return middleware
```

## 2. MiddlewareMixin

পুরাতন (old-style) মিডলওয়্যারকে নতুন Django ভার্সনের সাথে সামঞ্জস্যপূর্ণ করার জন্য `MiddlewareMixin` ব্যবহার করা হয়। যদি আপনি `process_request` বা `process_response` এর মতো মেথডগুলো আলাদাভাবে ডিফাইন করতে চান, তবে এটি সহায়ক।

```python
from django.utils.deprecation import MiddlewareMixin

class CustomMixinMiddleware(MiddlewareMixin):
    def process_request(self, request):
        # ... logic before view ...
        return None

    def process_response(self, request, response):
        # ... logic after view ...
        return response
```

## 3. Request/Response Modification

মিডলওয়্যার দিয়ে আপনি ইনকামিং রিকোয়েস্ট অবজেক্টে কাস্টম অ্যাট্রিবিউট যোগ করতে পারেন অথবা আউটগোয়িং রেসপন্স মডিফাই করতে পারেন।

- **Request Modification:** ইউজারের লোকেশন বা আইপি অ্যাড্রেস হেডার থেকে বের করে `request` এ সেট করা।
- **Response Modification:** রেসপন্স হেডারে সিকিউরিটি টোকেন বা এক্সিকিউশন টাইম যোগ করা।

## 4. Exception Handling

`process_exception` মেথড ব্যবহার করে ভিউ থেকে আসা যেকোনো এরর বা এক্সেপশন গ্লোবালি হ্যান্ডেল করা যায়। এটি প্রোডাকশনে সুন্দর এরর পেজ দেখাতে বা এরর লগ করতে ব্যবহৃত হয়।

```python
class ExceptionLoggingMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        return self.get_response(request)

    def process_exception(self, request, exception):
        # Log the exception or send notification
        print(f"Exception found: {exception}")
        return None
```

## 5. Performance and Security Middleware

- **Performance Middleware:** রিকোয়েস্ট শুরু এবং শেষ হওয়ার সময় ট্র্যাক করে ডাটাবেসে বা লগে সেভ করা।
- **Security Middleware:** কাস্টম আইপি ব্লকিং বা রিকোয়েস্ট ভ্যালিডেশন লজিক ইমপ্লিমেন্ট করা।

## 6. Rate Limiting Middleware

একটি কাস্টম রেসপন্স ফেরানোর মাধ্যমে আপনি ইউজারকে নির্দিষ্ট সময় পর পর রিকোয়েস্ট পাঠাতে বাধ্য করতে পারেন। এর জন্য সাধারণত Redis ব্যবহার করে হিট কাউন্ট রাখা হয়।
