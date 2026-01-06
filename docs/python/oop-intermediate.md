# OOP Intermediate (ইনহেরিটেন্স)

বেসিক OOP শিখলে আপনি ক্লাস বানাতে পারেন, কিন্তু **Inheritance** এর মাধ্যমে আপনি এক ক্লাসের ফিচার অন্য ক্লাসে ব্যবহার করতে পারেন। এটি কোড ডুপ্লিকেট হওয়া কমায়।

---

## ১. Inheritance (উত্তরাধিকার) কী?

একটি ক্লাস যখন অন্য একটি ক্লাসের প্রপার্টি (ভেরিয়েবল) এবং মেথড লাভ করে, তাকে ইনহেরিটেন্স বলে।
- **Parent Class / Base Class**: যেখান থেকে ফিচার নেওয়া হয়।
- **Child Class / Derived Class**: যে ফিচার গ্রহণ করে।

```python
class Animal:
    def speak(self):
        print("Animal makes a sound")

class Dog(Animal): # Dog এখন Animal কেই ইনহেরিট করছে
    def bark(self):
        print("Dog barks")

d = Dog()
d.speak() # Parent মেথড এক্সেস করা যাচ্ছে
d.bark()
```

---

## ২. `super()` ফাংশন

চাইল্ড ক্লাসে যদি প্য়ারেন্ট ক্লাসের কোনো মেথড (যেমন: `__init__`) ব্যবহার করার প্রয়োজন হয়, তখন `super()` ব্যবহার করা হয়।

```python
class Person:
    def __init__(self, name):
        self.name = name

class Employee(Person):
    def __init__(self, name, salary):
        super().__init__(name) # প্যারেন্ট ক্লাসের __init__ কল করা হলো
        self.salary = salary

emp = Employee("Ripon", 50000)
print(emp.name, emp.salary)
```

---

## ৩. Method Overriding

যদি প্যারেন্ট ক্লাসের কোনো মেথড চাইল্ড ক্লাসে নিজের মতো করে পরিবর্তন করতে হয়, তাকে **Method Overriding** বলে।

```python
class Father:
    def phone(self):
        print("Nokia 1100")

class Son(Father):
    def phone(self): # Overriding
        print("iPhone 15")

s = Son()
s.phone() # আউটপুট: iPhone 15
```

---

## ৪. Multiple Inheritance

পাইথনে একটি ক্লাস একসাথে অনেকগুলো প্য়ারেন্ট ক্লাস থেকে ফিচার নিতে পারে।

```python
class Father:
    def skills_F(self):
        print("Driving")

class Mother:
    def skills_M(self):
        print("Cooking")

class Child(Father, Mother):
    pass

c = Child()
c.skills_F()
c.skills_M()
```

---

## ৫. Method Resolution Order (MRO)

যখন মাল্টিপল ইনহেরিটেন্স থাকে, তখন পাইথন কোন সিরিয়ালে মেথড সার্চ করবে তা ঠিক করে **MRO**। আপনি `ClassName.mro()` লিখে এটি দেখতে পারেন।

---

::: tip
`isinstance()` এবং `issubclass()` ফাংশন ব্যবহার করে আপনি চেক করতে পারেন কোনো অবজেক্ট ঐ ক্লাসের কি না বা কোনো ক্লাস অন্যটির অধীনে কি না।
:::
