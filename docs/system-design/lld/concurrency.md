# Consistency & Thread Safety

ডিস্ট্রিবিউটেড সিস্টেম এবং মাল্টি-থ্রেডেড অ্যাপ্লিকেশনে ডেটা কনসিস্টেন্সি এবং থ্রেড সেফটি বজায় রাখা অত্যন্ত চ্যালেঞ্জিং। লো-লেভেল ডিজাইনে এটি একটি গুরুত্বপূর্ণ বিষয়।

---

## ১. রেস কন্ডিশন কেন হয়? (Internal of Race Conditions)

যখন একাধিক থ্রেড একই সময়ে একই মেমরি লোকেশন এক্সেস করে এবং কমপক্ষে একটি থ্রেড ডেটা রাইট (Write) করে, তখন **Race Condition** তৈরি হয়।

**CPU Context Switching-এর ভূমিকা:**
CPU একটি থ্রেডকে পুরোপুরি শেষ না করেই অন্য থ্রেডে সুইচ করতে পারে। ধরুন একটি ভ্যারিয়েবল `count = 10` আছে।

1. **Thread A:** ভ্যালু রিড করল (১০)।
2. **Context Switch:** CPU Thread B-তে সুইচ করল।
3. **Thread B:** ভ্যালু রিড করল (১০), ১ যোগ করল (১১) এবং রাইট করল।
4. **Thread A:** ফিরে এল, তার কাছে এখনো ভ্যালু ১০ আছে। সে ১ যোগ করল (১১) এবং রাইট করল।
   **ফলাফল:** দুইবার যোগ করার পর ভ্যালু হওয়ার কথা ছিল ১২, কিন্তু হলো ১১। একেই বলা হয় **Atomic Operation** না হওয়ার সমস্যা।

---

## ২. অ্যাডভান্সড লকিং মেকানিজম (Advanced Locking)

শুধু সাধারণ Lock-ই যথেষ্ট নয়, মাঝে মাঝে আরও জটিল লকিং প্রয়োজন হয়:

### ক. Reentrant Lock (RLock)

সাধারণ Lock একই থ্রেড দুইবার এক্সেস করতে গেলে ডেডলক হয়ে যায়। RLock ব্যবহার করলে একই থ্রেড একাধিকবার লকিং সেশনে প্রবেশ করতে পারে।

```python
import threading
lock = threading.RLock()

def nested_call():
    with lock:
        print("First lock acquired")
        with lock:
            print("Second lock acquired by same thread")
```

### খ. সেমাফোর (Semaphore)

যখন আপনার রিসোর্স লিমিটেড থাকে (উদা: ডাটাবেস এর মাত্র ৫টি কানেকশন), তখন Semaphore ব্যবহার করা হয়। এটি নির্দিষ্ট সংখ্যাক থ্রেডকে একসাথে কাম করার অনুমতি দেয়।

```python
import threading
semaphore = threading.Semaphore(3) # ৩ জন একসাথে কাজ করতে পারবে

def access_resource():
    with semaphore:
        print("Working with resource...")
```

---

## ৩. ডাবল-চেকড লকিং (Double-Checked Locking)

এটি একটি পারফরম্যান্স অপ্টিমাইজেশন টেকনিক। লকিং একটি এক্সপেনসিভ অপারেশন, তাই প্রতিবার লকের আগে চেক করা হয় যে সত্যিই লকিং প্রয়োজন কি না।

```python
class Database:
    _instance = None
    _lock = threading.Lock()

    @classmethod
    def get_instance(cls):
        if cls._instance is None: # ১ম চেক
            with cls._lock:
                if cls._instance is None: # ২য় চেক
                    cls._instance = Database()
        return cls._instance
```

---

## ৪. ডেডলক প্রতিরোধ (Deadlock Prevention)

ডেডলক হয় যখন ৪টি শর্ত পূরণ হয় (Coffman Conditions): Mutual Exclusion, Hold and Wait, No Preemption, এবং Circular Wait।

**প্রতিরোধের উপায়:**

- **Lock Ordering:** সবসময় একই অর্ডারে লক করা (উদা: আগে Lock A তারপর Lock B)।
- **Lock Timeout:** অনন্তকাল অপেক্ষা না করে একটি নির্দিষ্ট সময় পর রিকোয়েস্ট ক্যানসেল করা।
- **Avoid Nested Locks:** যতটা সম্ভব নেস্টেড লক এড়িয়ে চলা।

---

## ৫. প্রোডিউসার-কনজিউমার এবং কন্ডিশন ভ্যারিয়েবল

বাফার ফুল (Full) থাকলে প্রোডিউসার ওয়েট করবে এবং বাফার খালি (Empty) থাকলে কনজিউমার ওয়েট করবে। পাইথনে `queue.Queue` এটি ইন্টারনালি হ্যান্ডেল করে, কিন্তু কাস্টম লজিকে `threading.Condition` ব্যবহার করা হয়।

---

> [!CAUTION]
> **Over-synchronization:** সব জায়গায় লক ব্যবহার করলে পারফরম্যান্স মারাত্মকভাবে কমে যেতে পারে এবং সিস্টেম স্লো হয়ে যেতে পারে। তাই যেখানে প্রয়োজন সেখানেই সঠিকভাবে লকিং ব্যবহার করুন।
