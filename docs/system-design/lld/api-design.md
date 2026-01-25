# API Design & Clean Code (বাংলায়)

একটি সফল সফটওয়্যার সিস্টেমের প্রাণ হলো তার API। লো-লেভেল ডিজাইনে API ডিজাইন করার সময় অবজেক্ট মডেলিং এবং ক্লিন কোড প্রিন্সিপাল মেনে চলা অত্যন্ত জরুরি।

---

## ১. API ডিজাইন এবং অবজেক্ট মডেলিং (Request/Response Modeling)

API ডিজাইন করার সময় রিকোয়েস্ট এবং রেসপন্স অবজেক্টগুলো এমনভাবে ডিজাইন করতে হবে যাতে সেগুলো সহজে বোঝা যায় এবং ফ্লেক্সিবল থাকে।

**ভালো প্র্যাকটিস:**

- **ডেসক্রিপটিভ নাম:** ফিল্ডের নামগুলো পরিষ্কার হওয়া উচিত (উদা: `user_id` এর বদলে শুধু `id` না লিখে পরিষ্কার রাখা)।
- **কনসিস্টেন্সি:** পুরো API-তে একই স্টাইল ফলো করা (উদা: camelCase বা snake_case)।

**মডেলিং উদাহরণ (Python):**

```python
class CreateOrderRequest:
    def __init__(self, user_id, items, payment_method):
        self.user_id = user_id
        self.items = items # List of objects
        self.payment_method = payment_method

class OrderResponse:
    def __init__(self, order_id, status, total_amount):
        self.order_id = order_id
        self.status = status
        self.total_amount = total_amount
```

---

## ২. ভার্সনিং এবং এক্সটেনসিবিলিটি (Versioning & Extensibility)

সিস্টেম আপডেট করার সময় যেন পুরনো ইউজারদের কোড ব্রেক না করে, সেজন্য API ভার্সনিং প্রয়োজন।

- **URL Versioning:** `/api/v1/orders`
- **Header Versioning:** `Accept: application/vnd.myapi.v1+json`

**এক্সটেনসিবিলিটি:** নতুন ফিচার যোগ করার সময় বিদ্যমান ফিল্ডগুলো ডিলিট না করে নতুন ফিল্ড অপশনাল হিসেবে যুক্ত করা উচিত।

---

## ৩. ক্লিন কোড প্রিন্সিপাল (Clean Code Principles)

লো-লেভেল ডিজাইনে কোডকে মেইনটেইনেবল করার জন্য নিচের প্রিন্সিপালগুলো মানা উচিত:

### ক. DRY (Don't Repeat Yourself)

একই লজিক বারবার না লিখে কমন ফাংশন বা ক্লাসে নিয়ে আসা।

### খ. SRP (Single Responsibility Principle)

একটি ক্লাস বা ফাংশন শুধুমাত্র একটি নির্দিষ্ট কাজই করবে।

---

## ৪. গড ক্লাস এড়িয়ে চলা (Avoiding God Classes)

**God Class** হলো এমন একটি ক্লাস যা সিস্টেমের অনেক বেশি দায়িত্ব পালন করে এবং অনেক বড় হয়ে যায়। এটি মেইনটেইন করা অসম্ভব হয়ে পড়ে।

**কীভাবে এড়িয়ে চলবেন?**

- ক্লাস যদি ৫০০ লাইনের বেশি হয়ে যায়, তবে সেটির দায়িত্ব ভাগ করে দিন।
- **Composition over Inheritance:** বড় ক্লাসকে ছোট ছোট হেল্পার ক্লাসে ভাগ করে সেগুলোকে কম্পোজিশন হিসেবে ব্যবহার করুন।

**উদাহরণ:**
`OrderManager` ক্লাসে যদি পেমেন্ট, শিপিং এবং ইমেল পাঠানোর লজিক থাকে, তবে সেগুলোকে `PaymentService`, `ShippingService` এবং `NotificationService`-এ ভাগ করে ফেলুন।

---

> [!IMPORTANT]
> একটি API শুধু ডেটা পাস করার জন্য নয়, এটি আপনার সিস্টেমের সাথে অন্য সিস্টেমের যোগাযোগের মাধ্যম। তাই ডিজাইন করার সময় সিকিউরিটি এবং সিম্পলিসিটি উভয় দিকেই নজর রাখুন।
