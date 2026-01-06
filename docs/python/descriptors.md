# Descriptors

**Descriptors** হলো এমন এক ধরনের অবজেক্ট যা অন্য অবজেক্টের অ্যাট্রিবিউট (Attribute) এর কাজ বা অ্যাক্সেস কন্ট্রোল করে। পাইথনের `@property`, `classmethod`, `staticmethod`—এ সবগুলোই মূলত ডেসক্রিপ্টর ব্যবহার করে তৈরি।

---

## ১. Descriptor Protocol

একটি ক্লাস ডেসক্রিপ্টর হতে হলে তাতে নিচের অন্তত একটি মেথড থাকতে হবে:
- **`__get__`**: ভ্যালু পড়ার সময় ব্যবহৃত হয়।
- **`__set__`**: ভ্যালু সেট করার সময় ব্যবহৃত হয়।
- **`__delete__`**: ভ্যালু ডিলিট করার সময় ব্যবহৃত হয়।

```python
class PositiveNumber:
    def __init__(self):
        self._value = 0

    def __get__(self, instance, owner):
        return self._value

    def __set__(self, instance, value):
        if value < 0:
            raise ValueError("সংখ্যাটি অবশ্যই পজিটিভ হতে হবে!")
        self._value = value

class Account:
    balance = PositiveNumber() # এটি ডেসক্রিপ্টর হিসেবে কাজ করবে

acc = Account()
acc.balance = 500
# acc.balance = -10 # Error দিবে
```

---

## ২. Data vs Non-data Descriptors

- **Data Descriptor**: যার `__set__` বা `__delete__` মেথড আছে। এদের গুরুত্ব বেশি।
- **Non-data Descriptor**: যার শুধু `__get__` মেথড আছে।

---

## ৩. কেন ব্যবহার করবেন?

১. **Validation**: ডেটা সেট করার সময় ভ্যালিডেশন চেক করা।  
২. **Logging**: কোনো অ্যাট্রিবিউট এক্সেস হলে তা লগ করা।  
৩. **Caching**: রেজাল্ট ক্যালকুলেট করে তা পরে ব্যবহারের জন্য সেভ করে রাখা।

---

## ৪. Descriptor vs Property

`@property` ব্যবহার করা সহজ, কিন্তু যদি আপনার একই ধরনের লজিক অনেকগুলো ভেরিয়েবলের জন্য ব্যবহার করতে হয় (যেমন- ১০টি ভেরিয়েবলই পজিটিভ হতে হবে), তবে বারবার কোড না লিখে একটি **Descriptor** ক্লাস বানানো সবচেয়ে ভালো উপায়।

---

::: tip
ডেসক্রিপ্টর হলো পাইথনের একটি খুব পাওয়ারফুল ইন্টারনাল মেকানিজম যা বড় লাইব্রেরি (যেমন- Django, SQLAlchemy) তৈরিতে সাহায্য করে।
:::
