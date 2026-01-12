# Middleware

Django Middleware হলো একটি লাইটওয়েট, লো-লেভেল প্লাগইন সিস্টেম যা গ্লোবালি Django-এর ইনপুট এবং আউটপুট প্রসেস পরিবর্তন বা হ্যান্ডেল করতে ব্যবহৃত হয়।

সহজ কথায়, Middleware হলো এমন কিছু হুক (hooks) বা কোড যা প্রতিটি Request প্রসেস হওয়ার আগে এবং Response ক্লায়েন্টের কাছে যাওয়ার আগে রান হয়। প্রতিটি Middleware একটি নির্দিষ্ট কাজ করে, যেমন—User Authentication চেক করা, Session ম্যানেজ করা, বা Security এনশিওর করা।

## Request/Response Cycle

Django তে যখন একটি Request আসে এবং Response ফেরত যায়, তখন এটি Middleware এর মধ্য দিয়ে প্রবাহিত হয়।

1. **Request Phase:** ক্লায়েন্ট থেকে Request আসার পর সেটি একে একে সব Middleware এর `process_request` এবং `process_view` মেথড পার হয়ে View এ পৌঁছায়।
2. **View Phase:** View ফাংশন বা ক্লাস Request প্রসেস করে Response তৈরি করে।
3. **Response Phase:** View থেকে Response তৈরি হওয়ার পর সেটি আবার উল্টো অর্ডারে সব Middleware এর `process_response` বা `process_exception` মেথড পার হয়ে ক্লায়েন্টের কাছে যায়।

## Built-in Middleware

Django প্রোজেক্ট তৈরি করলে `settings.py` ফাইলে `MIDDLEWARE` লিস্টে ডিফল্ট কিছু Middleware থাকে। যেমন:

- **`SecurityMiddleware`**: Request/Response এর সাইকেল এবং Security (SSL, XSS) হ্যান্ডেল করে।
- **`SessionMiddleware`**: সেশন ম্যানেজমেন্টের জন্য ব্যবহৃত হয়।
- **`CommonMiddleware`**: কিছু সাধারণ কাজ যেমন URL Rewrite বা User Agent চেক করে।
- **`CsrfViewMiddleware`**: Cross Site Request Forgery (CSRF) প্রোটেকশন দেয়।
- **`AuthenticationMiddleware`**: প্রতিটি Request এর সাথে User কে অ্যাসোসিয়েট করে।
- **`MessageMiddleware`**: ফ্লাশ ম্যাসেজ (Flash Messages) দেখানোর জন্য কাজে লাগে।
- **`XFrameOptionsMiddleware`**: Clickjacking প্রোটেকশনের জন্য ব্যবহৃত হয়।

## Custom Middleware

অনেক সময় আমাদের কাস্টম লজিক ইমপ্লিমেন্ট করার প্রয়োজন হয়, তখন আমরা Custom Middleware তৈরি করি। এটি একটি ক্লাস বা ফাংশন হতে পারে।

**ফাংশন বেসড কাস্টম মিডলওয়্যার:**

```python
def simple_middleware(get_response):
    # One-time configuration and initialization.

    def middleware(request):
        # Code to be executed for each request before
        # the view (and later middleware) are called.
        print("Before View Execution")

        response = get_response(request)

        # Code to be executed for each request/response after
        # the view is called.
        print("After View Execution")

        return response

    return middleware
```

**ক্লাস বেসড কাস্টম মিডলওয়্যার:**

```python
class SimpleMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response
        # One-time configuration and initialization.

    def __call__(self, request):
        # Code to be executed for each request before
        # the view (and later middleware) are called.
        print("Before View Execution")

        response = self.get_response(request)

        # Code to be executed for each request/response after
        # the view is called.
        print("After View Execution")

        return response
```

### Middleware Hooks

Custom Middleware এ আমরা স্পেসিফিক কিছু হুক ওভাররাইড করতে পারি (ক্লাস বেসড এপ্রোচে):

1. **`process_request(self, request)`**:
   - View কল হওয়ার ঠিক আগে এটি কল হয়।
   - এখানে আপনি `None` রিটার্ন করলে ফ্লো কন্টিনিউ হবে, আর `HttpResponse` রিটার্ন করলে সরাসরি রেসপন্স চলে যাবে (View কল হবে না)।

2. **`process_view(self, request, view_func, view_args, view_kwargs)`**:
   - `process_request` এর পরে এবং ভিউ এক্সিকিউট হওয়ার ঠিক আগে এটি কল হয়।
   - ভিউ ফাংশন বা আর্গুমেন্ট মডিফাই করতে এটি ব্যবহার করা যায়।

3. **`process_exception(self, request, exception)`**:
   - ভিউ যদি কোনো Exception রেইজ করে, তখন এটি কল হয়।
   - গ্লোবাল এরর হ্যান্ডলিং বা লগিং এর জন্য এটি চমৎকার জায়গা।

4. **`process_template_response(self, request, response)`**:
   - ভিউ এক্সিকিউশনের পর যদি রেসপন্সটি `TemplateResponse` টাইপের হয়, তখন এটি কল হয়।

## Middleware Ordering

`MIDDLEWARE` লিস্টে মিডলওয়্যারগুলোর **অর্ডার বা ক্রম** খুবই গুরুত্বপূর্ণ।

- **Request প্রক্রিয়াকরণের সময়:** মিডলওয়্যারগুলো **উপর থেকে নিচে (Top to Bottom)** ক্রমে কাজ করে।
- **Response প্রক্রিয়াকরণের সময়:** মিডলওয়্যারগুলো **নিচ থেকে উপরে (Bottom to Top)** ক্রমে কাজ করে (পেঁয়াজের খোসার মতো)।

উদাহরণস্বরূপ, `AuthenticationMiddleware` কাজ করার জন্য `SessionMiddleware` এর প্রয়োজন হয়, তাই `SessionMiddleware` কে অবশ্যই `AuthenticationMiddleware` এর **উপরে** রাখতে হবে।

```python
MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware', # আগে রান হবে
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware', # পরে রান হবে
    # ...
]
```

ভুল অর্ডারিং এর কারণে অ্যাপ্লিকেশন ক্র্যাশ করতে পারে বা সিকিউরিটি ভালনারিবিলিটি তৈরি হতে পারে।
