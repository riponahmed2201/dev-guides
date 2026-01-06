# OOP Advanced

অ্যাডভান্সড লেভেলে আমরা শিখবো কিভাবে ডাটা সিকিউর রাখা যায় এবং কিভাবে কোডকে আরো ফ্লেক্সিবল করা যায়।

---

## ১. Encapsulation (ডেটা গোপন করা)

এনক্যাপসুলেশন মানে হলো ডাটা এবং মেথডকে একটি ইউনিটের ভেতর আটকে রাখা এবং বাইরের সরাসরি অ্যাক্সেস সীমাবদ্ধ করা। পাইথনে এটি আন্ডারস্কোর (`_` বা `__`) দিয়ে প্রকাশ করা হয়।

- **Public**: সরাসরি এক্সেস করা যায়।
- **Protected (`_`)**: ক্লাসের প্রপার্টি, যা সাধারণত সাবক্লাসে ব্যবহার করা উচিত।
- **Private (`__`)**: যা শুধুমাত্র ওই ক্লাসের ভেতরেই কাজ করবে।

```python
class BankAccount:
    def __init__(self, balance):
        self.__balance = balance # Private variable

    def deposit(self, amount):
        if amount > 0:
            self.__balance += amount
    
    def get_balance(self):
        return self.__balance

acc = BankAccount(1000)
# print(acc.__balance) # সরাসরি এক্সেস করলে Error দিবে
print(acc.get_balance()) # সঠিক উপায়
```

---

## ২. Data Decorators (@property)

প্রাইভেট ভেরিয়েবলকে ফাংশনের মাধ্যমে না বরং প্রপার্টির মতো এক্সেস করার জন্য `@property` ব্যবহার করা হয়।

```python
class Student:
    def __init__(self, marks):
        self.__marks = marks

    @property
    def marks(self):
        return self.__marks

s = Student(80)
print(s.marks) # ফাংশন হলেও () লাগে না
```

---

## ৩. Static Methods ও Class Methods

- **@staticmethod**: যে মেথডের ক্লাসের কোনো ভেরিয়েবলের (`self` বা `cls`) প্রয়োজন নেই।
- **@classmethod**: যে মেথড পুরো ক্লাস নিয়ে কাজ করে।

```python
class Calculator:
    @staticmethod
    def add(a, b): # self নেই
        return a + b

print(Calculator.add(5, 10))
```

---

## ৪. Polymorphism (বহুরূপতা)

পলি-মর্ফিজম মানে হলো একই জিনিস বিভিন্ন অবস্থায় ভিন্ন ভিন্ন আচরণ করা। যেমন- একটি `speak()` মেথড বিড়ালের জন্য হবে 'Meow' এবং কুকুরের জন্য হবে 'Woof'।

---

## ৫. Abstraction (অ্যাবস্ট্রাকশন)

অ্যাবস্ট্রাক্ট ক্লাস হলো এমন একটি ক্লাস যার কোনো অবজেক্ট সরাসরি বানানো যায় না। এটি শুধু নকশা হিসেবে কাজ করে। এর জন্য `abc` মডিউল লাগে।

```python
from abc import ABC, abstractmethod

class Shape(ABC):
    @abstractmethod
    def area(self):
        pass

class Circle(Shape):
    def area(self):
        print("Circle Area Calculation")

# s = Shape() # Error!
c = Circle()
c.area()
```
---

::: tip
অ্যাডভান্সড OOP আপনার কোডকে ইন্ডাস্ট্রিয়াল গ্রেড (Professional) কোডে রূপান্তরিত করে।
:::
