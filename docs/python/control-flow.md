# Control Flow (কন্ডিশনাল স্টেটমেন্ট)

প্রোগ্রামিংয়ে সিদ্ধান্তের ওপর ভিত্তি করে কোড চালানোর জন্য **Control Flow** ব্যবহার করা হয়। Python-এ এর জন্য `if`, `elif`, এবং `else` ব্যবহার করা হয়।

---

## ১. Simple `if` Statement

```python
age = 18
if age >= 18:
    print("আপনি ভোট দিতে পারবেন।")
```

::: warning ইন্ডেন্টেশন (Indentation)
Python-এ অন্য ল্যাঙ্গুয়েজের মতো সেকেন্ড ব্র্যাকেট `{ }` ব্যবহার করা হয় না। এখানে কোলন `:` এবং এর পরের লাইনে **৪টি স্পেস (Indentation)** ব্যবহার করা বাধ্যতামূলক। ইন্ডেন্টেশন ভুল হলে এরর আসবে।
:::

---

## ২. `if - else` Statement

```python
marks = 45
if marks >= 50:
    print("Pass")
else:
    print("Fail")
```

---

## ৩. `if - elif - else` (একাধিক শর্ত)

```python
score = 85

if score >= 90:
    print("Grade: A+")
elif score >= 80:
    print("Grade: A")
elif score >= 70:
    print("Grade: B")
else:
    print("Grade: F")
```

---

## ৪. Ternary Operator (এক লাইনে ইফ-এলস)

অনেক সময় ছোট কাজের জন্য এক লাইনেই কন্ডিশন চেক করা যায়।

```python
status = "Adult" if age >= 18 else "Minor"
```

---

## ৫. Match-case (Python 3.10+)

আধুনিক Python-এ switch-case এর বিকল্প হিসেবে `match` ব্যবহার করা হয়।

```python
status_code = 404

match status_code:
    case 200:
        print("Success")
    case 404:
        print("Not Found")
    case _:
        print("Unknown Error")
```
