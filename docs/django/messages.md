# Django Messages Framework

ওয়েব অ্যাপ্লিকেশনে ইউজারকে ছোট ছোট ফিডব্যাক বা নোটিফিকেশন দেখানো খুব জরুরি। যেমন: "সফলভাবে লগইন হয়েছে", "পাসওয়ার্ড ভুল", বা "প্রোফাইল আপডেট হয়েছে"। এই এককালীন (One-time) মেসেজ দেখানোর জন্য Django-র **Messages Framework** ব্যবহার করা হয়।

---

## ১. মেসেজ লেভেলস (Message Levels)

মেসেজের গুরুত্ব বোঝানোর জন্য Django ৫ টি ডিফল্ট লেভেল দেয়। এগুলো সাধারণত CSS ক্লাস হিসেবে টেমপ্লেটে ব্যবহৃত হয় (যেমন Bootstrap এর অ্যালার্ট কালার)।

| Level | Function | ব্যবহার |
| :--- | :--- | :--- |
| **DEBUG** | `messages.debug()` | ডেভেলপমেন্টের সময় ডিবাগ তথ্যের জন্য (প্রডাকশনে ইগনোর করা হয়)। |
| **INFO** | `messages.info()` | সাধারণ তথ্যের জন্য। |
| **SUCCESS** | `messages.success()` | কোনো কাজ সফল হলে (যেমন: রেজিস্ট্রেশন সাকসেস)। |
| **WARNING** | `messages.warning()` | সতর্ক করার জন্য (যেমন: অ্যাকাউন্টের মেয়াদ শেষ হচ্ছে)। |
| **ERROR** | `messages.error()` | কোনো এরর হলে (যেমন: ফর্ম ভ্যালিডেশন ফেইল)। |

---

## ২. মেসেজ পাঠানো (Views)

ভিউ ফাংশনের ভেতরে মেসেজ পাঠানো খুব সহজ।

```python
from django.contrib import messages
from django.shortcuts import render, redirect

def update_profile(request):
    if request.method == 'POST':
        # ডাটা সেভ করার লজিক...
        
        # সফল হওয়ার মেসেজ
        messages.success(request, 'Your profile was updated successfully!')
        return redirect('profile')
        
    else:
        # ওয়ার্নিং মেসেজ
        messages.warning(request, 'Please complete your profile details.')
        return render(request, 'profile.html')
```

---

## ৩. টেমপ্লেটে মেসেজ দেখানো

টেমপ্লেটে `messages` ভেরিয়েবলটি অটোমেটিক পাওয়া যায় (যদি `context_processors` ঠিক থাকে)।

```html
{% if messages %}
    <div class="messages-container">
        {% for message in messages %}
            <div class="alert alert-{{ message.tags }}">
                {{ message }}
            </div>
        {% endfor %}
    </div>
{% endif %}
```

### ৩.১ `message.tags` এর কাজ
`message.tags` অটোমেটিক মেসেজের ধরণ অনুযায়ী স্ট্রিং রিটার্ন করে।
- `messages.success()` -> tags হবে `success`
- `messages.error()` -> tags হবে `error`

যদি আপনি **Bootstrap** ব্যবহার করেন, তবে `error` ট্যাগটি `danger` ক্লাসের সাথে মেলে না। এটি ঠিক করতে `settings.py`-তে ট্যাগ ম্যাপিং ওভাররাইড করা যায়:

```python
from django.contrib.messages import constants as messages

MESSAGE_TAGS = {
    messages.ERROR: 'danger', # Bootstrap-এ 'alert-danger' আছে, 'alert-error' নেই
}
```

---

## ৪. কাস্টম মেসেজ (Advanced)

আপনি চাইলে মেসেজের সাথে এক্সট্রা ডাটা বা HTML পাঠাতে পারেন।

```python
from django.utils.safestring import mark_safe

link = '<a href="/login/">Log in</a>'
messages.info(request, mark_safe(f'Please {link} to continue.'))
```
> **সতর্কতা:** `mark_safe` ব্যবহারের সময় ইনপুট স্যানিটাইজেশন নিশ্চিত করুন, নইলে XSS অ্যাটাক হতে পারে।

---

## ৫. কনফিগারেশন (`settings.py`)

ডিফল্টভাবে Django সেশন এবং কুকি ব্যবহার করে মেসেজ স্টোর করে। একে `MESSAGE_STORAGE` বলে।

1.  **FallbackStorage (Default):** প্রথমে কুকিতে রাখার চেষ্টা করে, জায়গা না হলে সেশনে রাখে।
2.  **SessionStorage:** শুধু সেশনে রাখে।
3.  **CookieStorage:** শুধু কুকিতে রাখে।

```python
# স্টোরেজ পরিবর্তন করতে চাইলে
MESSAGE_STORAGE = 'django.contrib.messages.storage.session.SessionStorage'
```
