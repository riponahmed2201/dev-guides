# Design Patterns Roadmap (বাংলায়)

ডিজাইন প্যাটার্নস হলো সফটওয়্যার ডিজাইনের সময় বারবার আসা সাধারণ সমস্যাগুলোর প্রমাণিত সমাধান। এগুলো মূলত ব্লুপ্রিন্ট যা আপনি আপনার কোডে প্রয়োগ করে সমস্যার সমাধান করতে পারেন।

সফটওয়্যার ইঞ্জিনিয়ারিংয়ে ডিজাইন প্যাটার্নগুলোকে মূলত ৩টি প্রধান ভাগে ভাগ করা হয়।

---

## ১. ক্রিয়েশনাল প্যাটার্নস (Creational Patterns)

এই প্যাটার্নগুলো অবজেক্ট তৈরির প্রক্রিয়া নিয়ে কাজ করে। এর মূল লক্ষ্য হলো সিস্টেমকে ফ্লেক্সিবল রাখা এবং অবজেক্ট তৈরির জটিলতা কমানো।

### ক. সিঙ্গেলটন প্যাটার্ন (Singleton Pattern)

এই প্যাটার্ন নিশ্চিত করে যে একটি ক্লাসের পুরো অ্যাপ্লিকেশনে মাত্র **একটিই** ইন্সট্যান্স (Instance) থাকবে এবং একটি গ্লোবাল এক্সেস পয়েন্ট থাকবে।

**উদাহরণ:** ডাটাবেস কানেকশন বা লগিং সিস্টেম।

```python
class Singleton:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(Singleton, cls).__new__(cls)
        return cls._instance

s1 = Singleton()
s2 = Singleton()
print(s1 is s2)  # True, কারণ একটাই অবজেক্ট তৈরি হয়েছে।
```

### খ. ফ্যাক্টরি প্যাটার্ন (Factory Method Pattern)

সরাসরি অবজেক্ট তৈরি না করে একটি ইন্টারফেস বা মেথডের মাধ্যমে অবজেক্ট তৈরি করা। এটি ক্লায়েন্ট কোডকে নির্দিষ্ট ক্লাস থেকে আলাদা (Decouple) রাখে।

```python
class Shape:
    def draw(self): pass

class Circle(Shape):
    def draw(self): print("Drawing Circle")

class Square(Shape):
    def draw(self): print("Drawing Square")

class ShapeFactory:
    def get_shape(self, shape_type):
        if shape_type == "circle": return Circle()
        if shape_type == "square": return Square()
        return None

factory = ShapeFactory()
circle = factory.get_shape("circle")
circle.draw()
```

---

## ২. স্ট্রাকচারাল প্যাটার্নস (Structural Patterns)

এই প্যাটার্নগুলো ক্লাস এবং অবজেক্টের মধ্যে সম্পর্ক তৈরি করে বড় স্ট্রাকচার তৈরি করতে সাহায্য করে।

### ক. প্রক্সি প্যাটার্ন (Proxy Pattern)

একটি অবজেক্টের প্রতিনিধিত্ব করার জন্য অন্য একটি অবজেক্ট ব্যবহার করা। এটি মূল অবজেক্টের এক্সেস কন্ট্রোল বা ক্যাশ করার কাজে লাগে।

```python
class RealSubject:
    def request(self): print("Real Subject: Handling request.")

class Proxy:
    def __init__(self, real_subject):
        self._real_subject = real_subject

    def request(self):
        print("Proxy: Checking access before sending to real subject.")
        self._real_subject.request()

real = RealSubject()
proxy = Proxy(real)
proxy.request()
```

### খ. ব্রিজ প্যাটার্ন (Bridge Pattern)

অ্যাবস্ট্রাকশন (Abstraction) এবং ইমপ্লিমেন্টেশনকে (Implementation) আলাদা করা যাতে তারা স্বাধীনভাবে পরিবর্তন হতে পারে।

---

## ৩. বিহেভিয়ারাল প্যাটার্নস (Behavioral Patterns)

এই প্যাটার্নগুলো অবজেক্টগুলোর মধ্যে যোগাযোগ এবং দায়িত্ব ভাগ করে দেওয়া নিয়ে কাজ করে।

### ক. স্ট্র্যাটেজি প্যাটার্ন (Strategy Pattern)

একটি কাজের জন্য ভিন্ন ভিন্ন অ্যালগরিদম বা লজিক ডিফাইন করা এবং রান-টাইমে সেগুলোকে পরিবর্তন করা।

```python
class PaymentStrategy:
    def pay(self, amount): pass

class CreditCardPayment(PaymentStrategy):
    def pay(self, amount): print(f"Paid {amount} using Credit Card.")

class BkashPayment(PaymentStrategy):
    def pay(self, amount): print(f"Paid {amount} using bKash.")

class ShoppingCart:
    def __init__(self, strategy):
        self._strategy = strategy

    def checkout(self, amount):
        self._strategy.pay(amount)

cart = ShoppingCart(BkashPayment())
cart.checkout(500)
```

### খ. অবজারভার প্যাটার্ন (Observer Pattern)

যখন একটি অবজেক্টের স্টেট পরিবর্তন হয়, তখন তার ওপর নির্ভরশীল সব অবজেক্টগুলোকে স্বয়ংক্রিয়ভাবে নোটিফাই করা।

### গ. কমান্ড প্যাটার্ন (Command Pattern)

একটি রিকোয়েস্টকে অবজেক্ট হিসেবে এনক্যাপসুলেট করা। এর ফলে আপনি রিকোয়েস্টগুলোকে কিউতে রাখতে পারেন বা আন-ডু (Undo) করতে পারেন।

---

> [!TIP]
> প্যাটার্নগুলো মুখস্থ করার চেয়ে কোন সমস্যায় এগুলো ব্যবহার করা হয় তা বোঝার চেষ্টা করুন। সব প্যাটার্ন সব জায়গায় ব্যবহার করা ঠিক নয়, এটি কোডকে জটিল করতে পারে।
