# Working with Dates & Time

পাইথনে তারিখ এবং সময় নিয়ে কাজ করার জন্য বিল্ট-ইন **`datetime`** মডিউলটি স্ট্যান্ডার্ড উপায়। এটি দিয়ে ক্যালেন্ডার ক্যালকুলেশন, টাইমজোন হ্যান্ডলিং এবং ফরমেটিং করা যায়।

---

## ১. বর্তমান সময় এবং তারিখ

```python
from datetime import datetime

now = datetime.now()
print(now) # ২০২৬-০১-০৬ ০৯:৪৫...
print(now.year)
print(now.month)
```

---

## ২. String থেকে Datetime (Parsing)

অনেক সময় ওয়েবসাইট বা ফাইল থেকে তারিখ টেক্সট হিসেবে আসে। তাকে পাইথনের অবজেক্টে রূপান্তর করতে `strptime()` ব্যবহার করা হয়।

```python
date_string = "2026-01-01"
date_object = datetime.strptime(date_string, "%Y-%m-%d")
print(date_object.year) # ২০২৬
```

---

## ৩. Datetime থেকে String (Formatting)

আপনার অবজেক্টটিকে সুন্দরভাবে দেখানোর জন্য `strftime()` ব্যবহার করা হয়।

```python
now = datetime.now()
formatted = now.strftime("%d %B, %Y")
print(formatted) # 06 January, 2026
```

### প্রধান ফরমেট কোডসমূহ:
- **%d**: দিন (০১-৩১)
- **%m**: মাস (০১-১২)
- **%B**: মাসের নাম (যেমন: January)
- **%Y**: পূর্ণ বছর (২০২৬)
- **%H**: ঘণ্টা (২৪ ঘণ্টা ফরমেট)

---

## ৪. সময়ের পার্থক্য (Timedelta)

দুইটি তারিখের মধ্যে পার্থক্য বের করতে বা কোনো তারিখের সাথে কয়েক দিন যোগ/বিয়োগ করতে `timedelta` ব্যবহার করা হয়।

```python
from datetime import timedelta

today = datetime.now()
ten_days_later = today + timedelta(days=10)
print(ten_days_later)
```

---

## ৫. Timezone Handling

タイムজোন ম্যানেজ করার জন্য `pytz` মডিউল ব্যবহার করা সবচেয়ে জনপ্রিয় উপায়। পাইথনের ডিফল্ট লাইব্রেরি দিয়েও এটি করা যায় কিন্তু তা কিছুটা জটিল হতে পারে।

```python
from datetime import timezone
# UTC টাইম বের করা
utc_now = datetime.now(timezone.utc)
```

---

::: tip
তারিখ এবং সময় নিয়ে জটিল কাজ (যেমন: ন্যাচারাল ল্যাঙ্গুয়েজ প্রসেসিং) করার জন্য **`Arrow`** বা **`Pendulum`** এর মতো এক্সটার্নাল লাইব্রেরিও খুবই জনপ্রিয়।
:::
