---
title: Django and Microservices
description: Comprehensive guide on Service Decomposition, Communication, Architecture, and Reliability in a Django context.
---

# Django and Microservices (The Complete Guide)

মাইক্রোসার্ভিস আর্কিটেকচার একটি বড় সিস্টেমকে ছোট ছোট, স্বাধীন সার্ভিসে ভাগ করে। এটি সিস্টেমকে স্কেলেবল এবং মেইনটেনেবল করে তোলে। নিচে বাস্তব উদাহরণ এবং গভীর প্রযুক্তিগত ব্যাখ্যাসহ আলোচনা করা হলো।

---

## ১. Service Decomposition (বাস্তব উদাহরণ: E-commerce)

মাইক্রোসার্ভিসের প্রথম ধাপ হলো সিস্টেমকে ডোমেইন অনুযায়ী ভাগ করা।

**উদাহরণ (E-commerce Platform):**

- **User Service:** প্রোফাইল এবং অথেন্টিকেশন হ্যান্ডেল করে।
- **Product Service:** প্রোডাক্ট লিস্ট এবং সার্চ রেজাল্ট ম্যানেজ করে।
- **Order Service:** কার্ট এবং অর্ডার প্রসেসিং করে। (নির্ভর করে User এবং Inventory সার্ভিসের ওপর)।
- **Payment Service:** পেমেন্ট গেটওয়ে প্রসেস করে।
- **Inventory Service:** স্টকের হিসাব রাখে।

> [!IMPORTANT]
> **Database per Service:** প্রতিটি সার্ভিসের আলাদা আলাদা ডাটাবেস থাকবে। এক সার্ভিস অন্য সার্ভিসের ডাটাবেস সরাসরি স্পর্শ করবে না।

---

## ২. Inter-service Communication (সাথে কোড)

সার্ভিসগুলো নিজেদের মধ্যে দুইভাবে কথা বলতে পারে:

### A. Synchronous Communication (REST/gRPC)

যখন একটি সার্ভিস অন্য সার্ভিসের উত্তরের জন্য সরাসরি অপেক্ষা করে।

**কোড উদাহরণ (REST API):** Order Service যখন পেমেন্ট ভেরিফাই করতে চায়।

```python
# order_service/views.py
import requests

def create_order(request):
    # Payment Service-কে কল করা
    response = requests.get('http://payment-service/api/verify/')
    if response.status_code == 200 and response.json()['status'] == 'paid':
        return JsonResponse({'message': 'Order successfully placed'})
    return JsonResponse({'error': 'Payment failed'}, status=400)
```

### B. Asynchronous Communication (Message Queues)

একটি সার্ভিস মেসেজ পাঠিয়ে নিজের কাজে চলে যায় (Fire and forget)।

**কোড উদাহরণ (Celery & RabbitMQ):** অর্ডার হওয়ার পর ইমেইল পাঠানো।

```python
# order_service/tasks.py
from celery import shared_task

@shared_task
def send_confirmation_email(user_email):
    # ব্যাকগ্রাউন্ডে ইমেইল পাঠানোর লজিক
    print(f"Email sent to {user_email}")
```

---

## ৩. API Gateway: প্রধান এন্ট্রি পয়েন্ট

API Gateway হলো ক্লায়েন্ট এবং মাইক্রোসার্ভিসগুলোর মধ্যে একটি "গেটওয়ে" বা দারোয়ান।

**এর প্রধান কাজগুলো হলো:**

1.  **Request Routing:** সঠিক রিকোয়েস্টকে সঠিক সার্ভিসে পাঠিয়ে দেয়া।
2.  **Authentication:** ইউজার ভ্যালিড কি না তা চেক করা।
3.  **Rate Limiting:** কোনো ইউজার যেন সেকেন্ডে নির্দিষ্ট পরিমাণের বেশি রিকোয়েস্ট না পাঠায়।
4.  **SSL Termination:** সিকিউরিটি লেয়ার এক জায়গায় ম্যানেজ করা।

**Tools:** Kong, Nginx, Tyk.

---

## ৪. Service Discovery & Registry

মাইক্রোসার্ভিস পরিবেশে কন্টেইনারগুলোর IP অ্যাড্রেস সবসময় পরিবর্তিত হয়। তাই IP হার্ডকোড করা সম্ভব নয়।

- **Service Registry (Consul/Eureka):** এটি একটি ডিরেক্টরি যেখানে সব সার্ভিস তাদের কারেন্ট IP এবং পোর্ট রেজিস্টার করে রাখে।
- **Service Discovery:** একটি সার্ভিস যখন অন্য সার্ভিসের সাথে কথা বলতে চায়, সে রেজিস্টি থেকে লেটেস্ট IP অ্যাড্রেসটি অটোমেটিক খুঁজে নেয়।

---

## ৫. Load Balancing (লোডার ব্যালেন্সিং)

১. **Server-side Load Balancing:** যেমন Nginx. রিকোয়েস্টটি প্রথমে লোড ব্যালেন্সারে আসে, সে ঠিক করে কোন সুস্থ সার্ভারে পাঠাবে।
২. **Client-side Load Balancing:** এখানে সার্ভিস নিজেই রেজিস্টি থেকে সব IP-এর লিস্ট নিয়ে আসে এবং নিজেই ঠিক করে কার কাছে রিকোয়েস্ট পাঠাবে (যেমন: Ribbon)।

---

## ৬. Reliability Patterns: Circuit Breaker

যদি পেমেন্ট সার্ভিস ডাউন থাকে, তবে অর্ডার সার্ভিস বারবার চেষ্টা করে নিজের প্রসেস নষ্ট করবে না।

**Circuit Breaker-এর ৩টি অবস্থা (States):**

1.  **Closed:** সবকিছু ঠিক আছে, রিকোয়েস্ট যাচ্ছে।
2.  **Open:** এরর রেট বেড়ে গেলে গেট বন্ধ হয়ে যায়। পরবর্তী ৬০ সেকেন্ড কোনো রিকোয়েস্ট পাঠানো হয় না, সরাসরি এরর দেয়।
3.  **Half-Open:** নির্দিষ্ট সময় পর অল্প কিছু রিকোয়েস্ট পাঠিয়ে দেখা হয় সিস্টেম সুস্থ হয়েছে কি না।

**কোড উদাহরণ:**

```python
from pycircuitbreaker import circuit

@circuit(failure_threshold=5, recovery_timeout=60)
def call_service():
    return requests.get('http://down-service/api/')
```

---

## ৭. Distributed Transactions: SAGA Pattern

মাইক্রোসার্ভিসে কয়েক জায়গায় ডাটা আপডেট করার জন্য SAGA ব্যবহার করা হয়।

1.  **Choreography:** সার্ভিসগুলো ইভেন্টের মাধ্যমে কথা বলে। যেমন: অর্ডার হয়েছে -> পেমেন্ট সার্ভিস এই ইভেন্ট শুনে টাকা কাটলো -> পেমেন্ট হয়েছে শুনে শিপিং সার্ভিস কাজ শুরু করলো।
2.  **Orchestration:** একটি সেন্ট্রাল "ম্যানেজার" থাকে যে সবাইকে সিরিয়াল অনুযায়ী কাজ করার নির্দেশ দেয়।

---

## ৮. Service Mesh: অবকাঠামো স্তর

যখন সার্ভিসের সংখ্যা অনেক বেড়ে যায়, তখন তাদের সিকিউরিটি এবং মনিটরিং হ্যান্ডেল করার জন্য **Service Mesh** ব্যবহার করা হয়।

- **Sidecar Proxy:** প্রতিটি সার্ভিসের সাথে একটি করে ছোট প্রক্সি (যেমন: Envoy) থাকে। কমিউনিকেশন এই প্রক্সির মাধ্যমে হয়।
- **Tools:** Istio, Linkerd.

---

::: tip সেরা প্র্যাকটিস
১. ছোট প্রজেক্টের জন্য মাইক্রোসার্ভিসে যাবেন না।
২. অবজারভেবিলিটি (Logging & Tracing) নিশ্চিত করুন।
৩. সার্ভিসগুলোকে যত সম্ভব আলাদা (Decoupled) রাখার চেষ্টা করুন।
:::
