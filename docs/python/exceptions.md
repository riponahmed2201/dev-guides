# Exception Handling (এরর হ্যান্ডলিং)

প্রোগ্রাম রান করার সময় কোনো ভুল হলে যাতে পুরো সফটওয়্যারটি ক্র্যাশ না করে, সেজন্য **Exception Handling** ব্যবহার করা হয়। এটি এররগুলোকে সুন্দরভাবে হ্যান্ডেল করতে সাহায্য করে।

---

## ১. Try - Except Block

পাইথনে এরর হ্যান্ডেল করার প্রধান উপায় হলো `try` এবং `except` ব্লক। 

```python
try:
    num = int(input("একটি সংখ্যা দিন: "))
    result = 10 / num
    print(result)
except ZeroDivisionError:
    print("ভুল! শূন্য (০) দিয়ে ভাগ করা সম্ভব নয়।")
except ValueError:
    print("ভুল! দয়া করে একটি সঠিক সংখ্যা দিন।")
```

---

## ২. Else এবং Finally

- **else**: কোনো এরর না আসলে এই ব্লকটি রান হবে।
- **finally**: এরর আসুক বা না আসুক, এই ব্লকটি সবসময় রান হবে (যেমন: ফাইল বা ডাটাবেস কানেকশন ক্লোজ করার জন্য)।

```python
try:
    f = open("data.txt", "r")
except FileNotFoundError:
    print("ফাইলটি খুঁজে পাওয়া যায়নি।")
else:
    print("ফাইলটি সফলভাবে পড়া হয়েছে।")
finally:
    print("সব কাজ শেষ।")
```

---

## ৩. Raising Exceptions

কখনো যদি আপনি চান প্রোগ্রামে জোর করে কোনো এরর দেখাতে, তবে `raise` ব্যবহার করতে পারেন।

```python
age = -5
if age < 0:
    raise ValueError("বয়স কখনো ঋণাত্মক হতে পারে না!")
```

---

## ৪. Custom Exceptions

বড় প্রোজেক্টে নিজের মতো এরর টাইপ তৈরি করতে চাইলে আপনি **Custom Exception** ক্লাস বানাতে পারেন।

```python
class InsufficientBalanceError(Exception):
    """আপনার ব্যালেন্স কম থাকলে এই এরর আসবে।"""
    pass

def withdraw(amount):
    balance = 500
    if amount > balance:
        raise InsufficientBalanceError("আপনার একাউন্টে পর্যাপ্ত ব্যালেন্স নেই।")

try:
    withdraw(1000)
except InsufficientBalanceError as e:
    print(e)
```

---

## ৫. কেন এটি গুরুত্বপূর্ণ?

- **ইউজার এক্সপেরিয়েন্স**: ইউজারকে অদ্ভুত এরর টেক্সট না দেখিয়ে গুছিয়ে বাংলা বা ইংরেজিতে মেসেজ দেওয়া যায়।
- **ডিবাগিং**: কোন লাইনে কী কারণে এরর হচ্ছে তা সহজে বোঝা যায়।
- **সফটওয়্যার স্ট্যাবিলিটি**: মাঝপথে স্ক্রিপ্ট বন্ধ হওয়া ঠেকানো যায়।

---

::: tip
সবসময় স্পেসিফিক এরর হ্যান্ডেল করার চেষ্টা করুন (যেমন: `ValueError`)। শুধু `except:` লেখা এড়িয়ে চললে ভালো হয় কারণ এটি সব ধরনের এরর মাস্ক করে ফেলে।
:::
