# OOP Basics (অবজেক্ট ওরিয়েন্টেড প্রোগ্রামিং)

**Object-Oriented Programming (OOP)** হলো কোড সাজানোর একটি বিশেষ পদ্ধতি যা রিয়েল ওয়ার্ল্ড অবজেক্টের ওপর ভিত্তি করে কাজ করে। এর মাধ্যমে কোডকে আরও রি-ইউজেবল এবং অর্গানাইজড করা যায়।

---

## ১. Class এবং Object কী?

- **Class**: এটি একটি ব্লু-প্রিন্ট বা নকশা। যেমন- 'মানুষ' একটি ক্লাস।
- **Object**: ক্লাসের বাস্তব রূপ। যেমন- 'রিপন' একজন মানুষ, অর্থাৎ রিপন হলো মানুষ ক্লাসের একটি অবজেক্ট।

```python
class Student:
    pass

s1 = Student() # এটি একটি Object
```

---

## ২. `__init__` মেথড (Constructor)

যখনই একটি নতুন অবজেক্ট তৈরি হয়, পাইথন অটোমেটিক `__init__` মেথডটি কল করে। এটি মূলত অবজেক্টের ভেরিয়েবলগুলো সেট করার জন্য ব্যবহৃত হয়।

```python
class Student:
    def __init__(self, name, roll):
        self.name = name # Instance Variable
        self.roll = roll

    def show_info(self):
        print(f"নাম: {self.name}, রোল: {self.roll}")

s1 = Student("Ripon", 101)
s1.show_info()
```

---

## ৩. `self` প্যারামিটার

আপনার মনে প্রশ্ন আসতে পারে `self` কী? `self` হলো বর্তমান অবজেক্টের একটি রেফারেন্স। এটি নিশ্চিত করে যে কোডটি ঠিক কোন অবজেক্টের ডাটা নিয়ে কাজ করছে। ক্লাসের ভেতরে যেকোনো মেথড লিখলে তার প্রথম প্যারামিটার `self` হতে হয়।

---

## ৪. Instance vs Class Variables

- **Instance Variable**: যা প্রতিটি অবজেক্টের জন্য আলাদা (যেমন: নাম, আইডি)।
- **Class Variable**: যা ওই ক্লাসের সব অবজেক্টের জন্য সমান (যেমন: স্কুলের নাম)।

```python
class Student:
    school_name = "Ideal School" # Class Variable

    def __init__(self, name):
        self.name = name # Instance Variable

s1 = Student("Ripon")
s2 = Student("Shuvo")

print(s1.school_name) # Ideal School
print(s2.school_name) # Ideal School
```

---

## ৫. কেন OOP ব্যবহার করবেন?

১. **Code Reusability**: একবার ক্লাস লিখে হাজার বার অবজেক্ট বানানো যায়।  
২. **Ease of Maintenance**: বড় প্রোজেক্টে কোড খুঁজে বের করা এবং ফিক্স করা সহজ হয়।  
৩. **Real-world mapping**: বাস্তব জীবনের যেকোনো সমস্যাকে (যেমন- ই-কমার্স সিস্টেম, ব্যাংকিং) কোডে রূপান্তর করা সহজ হয়।

---

::: tip পরবর্তী ধাপ
বেসিক ধারণা হয়ে গেলে আমাদের শিখতে হবে **Inheritance** এবং **Polymorphism**, যা OOP এর আসল শক্তি।
:::
