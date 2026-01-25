# OOP Fundamentals & SOLID Principles (বাংলায়)

অবজেক্ট ওরিয়েন্টেড প্রোগ্রামিং (OOP) এবং SOLID প্রিন্সিপাল হলো ভালো মানের সফটওয়্যার তৈরির মূল স্তম্ভ। এই গাইডে আমরা এই বিষয়গুলো কোড উদাহরণসহ গভীরে গিয়ে শিখব।

---

## ১. অবজেক্ট ওরিয়েন্টেড প্রোগ্রামিং (OOP)

OOP-এর ৪টি প্রধান স্তম্ভ রয়েছে:

### ক. এনক্যাপসুলেশন (Encapsulation)

এনক্যাপসুলেশন হলো ডেটা (Variables) এবং সেই ডেটার ওপর কাজ করা মেথডগুলোকে (Functions) একটি সিঙ্গেল ইউনিটে (Class) বন্দি করা। এটি ডেটা হাইডিং নিশ্চিত করে।

**কোড উদাহরণ:**

```python
class BankAccount:
    def __init__(self, balance):
        self.__balance = balance  # Private Variable (Encapsulation)

    def deposit(self, amount):
        if amount > 0:
            self.__balance += amount
            print(f"Deposited: {amount}")

    def get_balance(self):
        return self.__balance

account = BankAccount(1000)
account.deposit(500)
print(f"Current Balance: {account.get_balance()}")
# print(account.__balance) # এটি এরর দিবে, কারণ ব্যালেন্স প্রাইভেট।
```

### খ. অ্যাবস্ট্রাকশন (Abstraction)

অ্যাবস্ট্রাকশন মানে হলো অপ্রয়োজনীয় ডিটেইলস লুকিয়ে রেখে শুধুমাত্র প্রয়োজনীয় ফিচারগুলো ইউজারকে দেখানো।

**কোড উদাহরণ:**

```python
from abc import ABC, abstractmethod

class RemoteControl(ABC):
    @abstractmethod
    def press_button(self):
        pass

class TVRemote(RemoteControl):
    def press_button(self):
        print("TV is now ON")

class ACRemote(RemoteControl):
    def press_button(self):
        print("AC is now ON")

# ইউজার জানে না ইন্টারনাল সার্কিট কীভাবে কাজ করে, সে শুধু বাটন প্রেস করে।
remote = TVRemote()
remote.press_button()
```

### গ. ইনহেরিটেন্স (Inheritance)

ইনহেরিটেন্সের মাধ্যমে একটি ক্লাস অন্য একটি ক্লাসের প্রপার্টি এবং মেথড লাভ করতে পারে। এটি কোড রিইউজেবল করে।

**কোড উদাহরণ:**

```python
class Animal:
    def speak(self):
        print("Animal makes a sound")

class Dog(Animal): # Dog ক্লাস Animal কে ইনহেরিট করছে
    def bark(self):
        print("Dog barks")

my_dog = Dog()
my_dog.speak() # প্যারেন্ট ক্লাসের মেথড
my_dog.bark()  # নিজের মেথড
```

### ঘ. পলিমরফিজম (Polymorphism)

পলিমরফিজম মানে হলো "বহুরূপী"। একই মেথড ভিন্ন ভিন্ন অবজেক্টের জন্য ভিন্নভাবে কাজ করতে পারে।

**কোড উদাহরণ:**

```python
class Bird:
    def fly(self):
        print("Most birds can fly")

class Sparrow(Bird):
    def fly(self):
        print("Sparrow flies high")

class Penguin(Bird):
    def fly(self):
        print("Penguin cannot fly")

def make_it_fly(bird):
    bird.fly()

make_it_fly(Sparrow())
make_it_fly(Penguin()) # একই fly() মেথড ভিন্ন আউটপুট দিচ্ছে
```

---

## ২. SOLID Principles

SOLID হলো ৫টি ডিজাইন প্রিন্সিপালের সমষ্টি যা কোডকে আরও মেইনটেইনেবল এবং স্কেলেবল করে।

### S - Single Responsibility Principle (SRP)

একটি ক্লাসের শুধুমাত্র **একটিই** কাজ থাকা উচিত।

**উদাহরণ:**

```python
# ভুল পদ্ধতি
class User:
    def save_to_db(self): pass
    def send_email(self): pass # দুইটা আলাদা কাজ এক ক্লাসে

# সঠিক পদ্ধতি
class User:
    def save(self): pass

class EmailService:
    def send_welcome_email(self): pass
```

### O - Open/Closed Principle (OCP)

সফটওয়্যার এনটিটি নতুন ফিচারের জন্য **Open** থাকবে কিন্তু বিদ্যমান কোড পরিবর্তনের জন্য **Closed** থাকবে।

**উদাহরণ:**

```python
class Discount:
    def get_discount(self): return 10

class FestiveDiscount(Discount): # ক্লাস পরিবর্তন না করে ইনহেরিটেন্স ব্যবহার
    def get_discount(self): return 20
```

### L - Liskov Substitution Principle (LSP)

প্যারেন্ট ক্লাসের অবজেক্টকে তার চাইল্ড ক্লাসের অবজেক্ট দ্বারা রিপ্লেস করা গেলেও অ্যাপ্লিকেশনের লজিক ঠিক থাকতে হবে।

**উদাহরণ:**
যদি `Sparrow` একটি `Bird` হয়, তবে যেখানে `Bird` ব্যবহার করা হয় সেখানে `Sparrow` ব্যবহার করলে কোড ব্রেক হওয়া উচিত নয়। (কিন্তু `Penguin` এর ক্ষেত্রে `fly()` মেথড কল করলে যদি এক্সেপশন দেয়, তবে সেটি LSP ব্রেক করবে)।

### I - Interface Segregation Principle (ISP)

একটি বড় ইন্টারফেসের চেয়ে অনেকগুলো ছোট ছোট স্পেসিফাইড ইন্টারফেস ভালো।

**উদাহরণ:**

```python
class Printer:
    def print_doc(self): pass

class Scanner:
    def scan_doc(self): pass

# একটি মেশিন শুধু প্রিন্ট করবে, তাকে স্ক্যান মেথড ইমপ্লিমেন্ট করতে বাধ্য করা যাবে না।
```

### D - Dependency Inversion Principle (DIP)

হাই-লেভেল মডিউলগুলো লো-লেভেল মডিউলের ওপর নির্ভর করা উচিত নয়। উভয়ই অ্যাবস্ট্রাকশনের ওপর নির্ভর করবে।

**উদাহরণ:**
ডাইরেক্ট `MySQL` ক্লাসের ওপর নির্ভর না করে একটি `Database` ইন্টারফেসের ওপর নির্ভর করা, যাতে ভবিষ্যতে সহজে ডাটাবেস পরিবর্তন করা যায়।

---

> [!TIP]
> কোড লেখার সময় সবসময় চিন্তা করবেন কীভাবে এটি আরও সিম্পল এবং ফ্লেক্সিবল রাখা যায়। SOLID প্রিন্সিপাল আপনাকে দীর্ঘমেয়াদে হেল্প করবে।
