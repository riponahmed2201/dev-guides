# Design Patterns

**Design Patterns** হলো সফটওয়্যার ডিজাইনে বারবার আসা সাধারণ সমস্যাগুলোর পরীক্ষিত এবং কার্যকর সমাধান। এটি কোডকে ফ্লেক্সিবল, স্কেলেবল এবং মেইনটেইনেবল রাখতে সাহায্য করে।

---

## ১. Singleton Pattern

নিশ্চিত করে যে একটি ক্লাসের শুধুমাত্র একটিই অবজেক্ট বা ইনস্ট্যান্স (Instance) থাকবে। ডাটাবেস কানেকশন বা লগিং সিস্টেমের জন্য এটি জনপ্রিয়।

```python
class Singleton:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance

s1 = Singleton()
s2 = Singleton()
print(s1 is s2) # True (উভয়ই এক)
```

---

## ২. Factory Pattern

অবজেক্ট সরাসরি তৈরি না করে একটি ইন্টারফেস বা ফাংশনের মাধ্যমে তৈরি করাকে ফ্যাক্টরি প্যাটার্ন বলে। এটি কোডকে লুজলি কাপলড (Loosely Coupled) রাখে।

```python
class Dog:
    def speak(self): return "Woof!"

class Cat:
    def speak(self): return "Meow!"

def get_pet(pet_type):
    pets = {"dog": Dog(), "cat": Cat()}
    return pets.get(pet_type)

p = get_pet("dog")
print(p.speak())
```

---

## ৩. Observer Pattern

যখন একটি অবজেক্টের কোনো পরিবর্তন হলে অন্য অনেকগুলো অবজেক্টকে অটোমেটিক নোটিফাই করার প্রয়োজন হয় (যেমন- স্টক প্রাইস আপডেট বা নোটিফিকেশন সিস্টেম)।

---

## ৪. Decorator Pattern

পাইথনের বিল্ট-ইন ডেকোরেটর এ প্যাটার্নটি ফলো করে। এটি বিদ্যমান ফাংশনের আচরণ না বদলে তার সাথে নতুন ফিচার যোগ করতে সাহায্য করে। (বিস্তারিত লেভেল ৩: [Advanced Decorators](/python/adv-decorators))

---

## ৫. কেন শিখবেন?

- **Industry Standard**: বিশ্বের বড় বড় সব সফটওয়্যার কোম্পানি এই প্যাটার্নগুলো ফলো করে।
- **Better Communication**: একজন ডেভেলপার অন্যজনকে বললে "আমি এখানে ফ্যাক্টরি প্যাটার্ন ইউজ করেছি", অন্যজন সাথেসাথেই বুঝে যায় কোড স্ট্রাকচার কেমন।
- **Avoid Anti-patterns**: ভুল পদ্ধতিতে কোড সাজানো এড়ানো যায়।

---

::: tip
ডিজাইন প্যাটার্ন মুখস্থ করার বিষয় নয়, এটি প্র্যাকটিস এবং অভিজ্ঞতার মাধ্যমে ধাপে ধাপে আয়ত্ত করতে হয়।
:::
