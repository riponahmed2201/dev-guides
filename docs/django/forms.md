# Forms Basics

ওয়েব অ্যাপ্লিকেশনে ইউজারের কাছ থেকে ডেটা নেওয়ার প্রধান মাধ্যম হলো **Forms**। Django-তে ফর্ম হ্যান্ডেল করার জন্য একটি শক্তিশালী লাইব্রেরি রয়েছে যা ডেটা ভ্যালিডেশন, রেন্ডারিং এবং সিকিউরিটি (CSRF) নিশ্চিত করে।

---

## ১. HTML Forms vs Django Forms

সাধারণ HTML ফর্ম দিয়েও কাজ করা যায়, কিন্তু Django Forms ব্যবহার করার সুবিধা হলো:
- অটোমেটিক ডেটা ভ্যালিডেশন।
- HTML ইনপুট ফিল্ড জেনারেট করা।
- SQL Injection এবং XSS অ্যাটাক থেকে সুরক্ষা।

---

## ২. Django Form Class

মডেলের মতোই ফর্ম তৈরি করার জন্য আমরা একটি ক্লাস ডিফাইন করি।

```python
# forms.py
from django import forms

class ContactForm(forms.Form):
    name = forms.CharField(max_length=100, label='আপনার নাম')
    email = forms.EmailField(label='ইমেইল')
    message = forms.CharField(widget=forms.Textarea, label='বার্তা')
```

---

## ৩. Form Rendering

ভিউ থেকে টেমপ্লেটে ফর্ম পাঠানোর পর সেটি বিভিন্নভাবে দেখানো যায়।

**views.py:**
```python
def contact_view(request):
    form = ContactForm()
    return render(request, 'contact.html', {'form': form})
```

**template (contact.html):**
```html
<form method="post">
    {% csrf_token %}
    {{ form.as_p }}  <!-- প্যারাগ্রাফ আকারে দেখাবে -->
    <button type="submit">Send</button>
</form>
```

**Rendering Options:**
- `\{{ form.as_p }}`: প্রতিটি ফিল্ড `<p>` ট্যাগের মধ্যে।
- `\{{ form.as_table }}`: টেবিল রো `<tr>` হিসেবে।
- `\{{ form.as_ul }}`: লিস্ট আইটেম `<li>` হিসেবে।

---

## ৪. Handling Form Submission

ফর্ম সাবমিট হওয়ার পর ডেটা প্রসেস করার স্ট্যান্ডার্ড পদ্ধতি:

```python
def contact_view(request):
    if request.method == 'POST':
        form = ContactForm(request.POST)
        if form.is_valid():
            # ৫. cleaned_data
            name = form.cleaned_data['name']
            email = form.cleaned_data['email']
            
            # ডেটা দিয়ে কিছু করুন (ইমেইল পাঠানো বা সেভ করা)
            print(f"Message from {name}")
            
            return redirect('success_page')
    else:
        form = ContactForm()
    
    return render(request, 'contact.html', {'form': form})
```

---

## ৫. Form Validation & cleaned_data

`form.is_valid()` মেথডটি চেক করে যে ইউজারের ইনপুট সঠিক কি না।
- যদি সব ঠিক থাকে, তবে ডেটাগুলো `form.cleaned_data` ডিকশনারিতে পাওয়া যায়।
- এটি অটোমেটিক টাইপ কনভার্সন করে (যেমন: স্ট্রিং থেকে ইন্টিজারে রূপান্তর)।

---

## ৬. Form Errors

যদি ফর্ম ভ্যালিড না হয়, তবে Django অটোমেটিক এরর মেসেজ জেনারেট করে এবং ফর্মটি আবার রেন্ডার করে ইউজারকে ভুলগুলো দেখিয়ে দেয়।

আপনি চাইলে ম্যানুয়ালি এরর দেখাতে পারেন:
```html
{% if form.errors %}
    <div class="alert alert-danger">
        Please correct the errors below.
    </div>
{% endif %}
```

---

## ৭. CSRF Protection

Django ফর্মে **Cross Site Request Forgery (CSRF)** প্রোটেকশন বাধ্যতামূলক। প্রতিটি `POST` ফর্মে `{% csrf_token %}` ব্যবহার করতে হয়। এটি একটি হিডেন ইনপুট ফিল্ড তৈরি করে যা হ্যাকারদের ফেইক রিকোয়েস্ট পাঠানো থেকে আটকায়।

```html
<form method="post">
    {% csrf_token %}
    ...
</form>
```

---

::: tip পরবর্তী ধাপ
অভিনন্দন! আপনি Django Forms এর বেসিক ধারণা পেয়েছেন। পরবর্তী চ্যাপ্টারে আমরা শিখবো **Model Forms** সম্পর্কে, যা মডেল থেকে সরাসরি ফর্ম তৈরি করতে সাহায্য করে।
:::
