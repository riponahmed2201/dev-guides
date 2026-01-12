# Django Sessions Framework

HTTP প্রটোকল হলো **"stateless"**। অর্থাৎ, সার্ভার মনে রাখে না আগের রিকোয়েস্টটি কার ছিল। কিন্তু ওয়েব অ্যাপ্লিকেশন (যেমন: ফেববুক, অ্যামাজন) ব্যবহারকারীকে লগইন অবস্থায় রাখতে বা শপিং কার্টে আইটেম মনে রাখতে **Session** ব্যবহার করে।

Django-তে সেশন ম্যানেজমেন্ট খুবই সহজ এবং এটি ডিফল্টভাবেই চালু থাকে।

---

## ১. সেশন কিভাবে কাজ করে?

১. যখন ক্লায়েন্ট (Browser) সার্ভারে যোগাযোগ করে, সার্ভার একটি ইউনিক **Session ID** তৈরি করে।
২. এই ID-টি ইউজারের ব্রাউজারে **Cookie** হিসেবে সেভ করে দেয়।
৩. সার্ভার নিজের ডাটাবেসে বা ক্যাশে মেমোরিতে ওই Session ID এর সাথে যুক্ত ডাটা (যেমন: user_id, cart_items) সেভ করে রাখে।
৪. পরবর্তী রিকোয়েস্টে ব্রাউজার সেই Cookie পাঠায় এবং সার্ভার চিনে ফেলে যে এটি সেই ইউজার।

---

## ২. সেশন ডাটা ব্যবহার (`request.session`)

Django views-এ `request.session` একটি ডিকশনারির (Dictionary) মতো কাজ করে।

### ২.১ ডাটা রাখা (Set Session Data)
```python
def login_success(request):
    # ইউজারনেম সেশনে রাখা হলো
    request.session['username'] = 'ripon'
    
    # শপিং কার্টে আইটেম রাখা
    request.session['cart'] = {'item_1': 2, 'item_2': 1}
    
    return HttpResponse("Data saved in session!")
```

### ২.২ ডাটা পড়া (Get Session Data)
```python
def profile(request):
    # যদি না থাকে তবে 'Guest' রিটার্ন করবে
    username = request.session.get('username', 'Guest')
    
    return HttpResponse(f"Welcome {username}")
```

### ২.৩ ডাটা ডিলিট করা (Delete Session Data)
```python
# নির্দিষ্ট ডাটা মুছতে
if 'cart' in request.session:
    del request.session['cart']

# পুরো সেশন ডিলিট করতে (লগআউটের সময়)
request.session.flush()
```

---

## ৩. Session Configuration (`settings.py`)

সেশনের আচরণ কন্ট্রোল করার জন্য `settings.py`-তে অনেক অপশন আছে।

### ৩.১ সেশন ইঞ্জিন (ডাটা কোথায় থাকবে?)

1.  **Database (Default):** ডাটাবেসে `django_session` টেবিলে ডাটা রাখে।
    ```python
    SESSION_ENGINE = 'django.contrib.sessions.backends.db'
    ```

2.  **Cached (Fastest):** মেমোরিতে (Redis/Memcached) রাখে। যদি সার্ভার রিস্টার্ট হয়, ডাটা হারিয়ে যেতে পারে।
    ```python
    SESSION_ENGINE = 'django.contrib.sessions.backends.cache'
    ```

3.  **File Based:** সার্ভারের হার্ডডিস্ক ফাইলে রাখে।
    ```python
    SESSION_ENGINE = 'django.contrib.sessions.backends.file'
    ```

4.  **Cookie Based:** সব ডাটা এনক্রিপ্ট করে ব্রাউজারের কুকিতেই রাখে (সার্ভারে কিছু থাকে না)। এটি ফাস্ট কিন্তু ডাটা বেশি রাখা যায় না।
    ```python
    SESSION_ENGINE = 'django.contrib.sessions.backends.signed_cookies'
    ```

### ৩.২ সেশন মেয়াদ (Session Expiry)

ডিফল্টভাবে ব্রাউজার বন্ধ করলে সেশন ডিলিট হয় না (ডিফল্ট ২ সপ্তাহ থাকে)।

```python
# সেশন কতক্ষণ থাকবে (সেকেন্ডে) - এখানে ১ দিন
SESSION_COOKIE_AGE = 86400 

# ব্রাউজার ক্লোজ করলেই সেশন ডিলিট হবে কি না?
SESSION_EXPIRE_AT_BROWSER_CLOSE = True 
```

### ৩.৩ সিকিউরিটি সেটিংস

```python
# শুধুমাত্র HTTPS কানেকশনে কুকি পাঠাবে (প্রডাকশনে True রাখা উচিত)
SESSION_COOKIE_SECURE = True 

# জাভাস্ক্রিপ্ট দিয়ে কুকি এক্সেস করা যাবে না (XSS অ্যাটাক ঠেকাতে)
SESSION_COOKIE_HTTPONLY = True 
```

---

## ৪. `modified` ফ্ল্যাগ

Django ডিফল্টভাবে সেশন ডাটাবেসে তখনই সেভ করে যখন সেশনের কোনো ভ্যালু অ্যাসাইন করা হয় (`request.session['key'] = value`)।

কিন্তু যদি আপনি সেশনের ভেতরের কোনো মিউটেবল অবজেক্ট (যেমন লিস্ট বা ডিকশনারি) পরিবর্তন করেন, Django সেটা বুঝতে পারে না।

```python
# সমস্যা:
request.session['cart']['item_1'] = 5 
# Django ভাববে সেশন চেঞ্জ হয়নি, তাই সেভ করবে না।

# সমাধান:
request.session.modified = True
```
এটি বলে দেয় যে সেশন আপডেট হয়েছে, সেভ করতে হবে।

---

## ৫. কুকি vs ডাটাবেস সেশন

| ফিচার | ডাটাবেস সেশন (Default) | কুকি বেসড সেশন |
| :--- | :--- | :--- |
| **স্টোরেজ** | সার্ভারের ডাটাবেসে থাকে। | ইউজারের ব্রাউজারে থাকে। |
| **সিকিউরিটি** | বেশি সিকিউর (ক্লায়েন্ট ডাটা দেখতে পায় না)। | কম সিকিউর (ক্লায়েন্ট ডাটা দেখতে পারে, তবে এনক্রিপ্টেড)। |
| **সাইজ লিমিট** | আনলিমিটেড (যত খুশি রাখা যায়)। | লিমিটেড (৪KB এর বেশি রাখা যায় না)। |
| **পারফরম্যান্স** | প্রতিবার ডাটাবেস কুয়েরি হয় (একটু স্লো)। | কোনো ডাটাবেস হিট নেই (খুব ফাস্ট)। |

---

## ৬. প্র্যাকটিস টাস্ক

১. একটি ভিউ তৈরি করুন যা ভিজিটর কতবার পেজটি ভিজিট করেছে তা গুনবে (`request.session['visit_count']` দিয়ে)।
২. ১০ সেকেন্ড পর সেশন এক্সপায়ার হবে এমন কনফিগারেশন সেট করুন।
