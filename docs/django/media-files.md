# Media Files

**Media Files** হলো সেইসব ফাইল যা ব্যবহারকারীরা (Users) আপলোড করে। যেমন: প্রোফাইল পিকচার, ডকুমেন্ট, বা ব্লগের ফিচারড ইমেজ।

---

## ১. Media Files কনফিগারেশন

Static Files-এর মতোই Media Files-এর জন্য `settings.py`-তে দুটি কনফিগারেশন প্রয়োজন।

```python
# settings.py
import os

# ব্রাউজার যে URL দিয়ে মিডিয়া ফাইল অ্যাক্সেস করবে
MEDIA_URL = '/media/'

# সার্ভারের যে ফোল্ডারে ফাইলগুলো ফিজিক্যালি সেভ হবে
MEDIA_ROOT = BASE_DIR / 'media'
```

---

## ২. মডেল ফিল্ড (FileField & ImageField)

মডেলে ফাইল আপলোডের সুবিধা দেওয়ার জন্য `FileField` বা `ImageField` ব্যবহার করা হয়।

⚠️ **Note:** `ImageField` ব্যবহার করার জন্য `Pillow` লাইব্রেরি ইনস্টল থাকতে হবে।
```bash
pip install Pillow
```

**models.py:**
```python
from django.db import models

class Profile(models.Model):
    name = models.CharField(max_length=100)
    # ছবি আপলোড হবে 'media/profiles/' ফোল্ডারে
    photo = models.ImageField(upload_to='profiles/') 
    # ডকুমেন্ট আপলোড হবে 'media/documents/' ফোল্ডারে
    resume = models.FileField(upload_to='documents/', null=True, blank=True)
```

---

## ৩. File Upload Handling (Forms & Views)

ফাইল আপলোড করার জন্য HTML ফর্মে অবশ্যই `enctype="multipart/form-data"` থাকতে হবে।

**template:**
```html
<form method="post" enctype="multipart/form-data">
    {% csrf_token %}
    {{ form.as_p }}
    <button type="submit">Upload</button>
</form>
```

**views.py:**
```python
def upload_profile(request):
    if request.method == 'POST':
        # form এবং request.FILES পাস করতে হবে
        form = ProfileForm(request.POST, request.FILES) 
        if form.is_valid():
            form.save()
            return redirect('success')
    else:
        form = ProfileForm()
    return render(request, 'upload.html', {'form': form})
```

---

## ৪. Serving Media in Development

ডেভেলপমেন্ট সার্ভারে (`DEBUG=True`) মিডিয়া ফাইল সার্ভ করার জন্য `urls.py` কনফিগার করতে হয়।

**project/urls.py:**
```python
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    # ... আপনার অন্যান্য পাথ
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
```

---

## ৫. টেমপ্লেটে মিডিয়া ফাইল দেখানো

ফাইল বা ইমেজ দেখানোর জন্য `.url` অ্যাট্রিবিউট ব্যবহার করতে হয়।

```html
<!-- ইমেজ দেখানো -->
<img src="{{ profile.photo.url }}" alt="{{ profile.name }}">

<!-- ফাইল ডাউনলোডের লিঙ্ক -->
<a href="{{ profile.resume.url }}">Download Resume</a>
```

⚠️ **Safeguard:** যদি ফাইল না থাকে তবে এরর এড়াতে `{% if profile.photo %}` চেক দেওয়া ভালো।

---

::: tip পরবর্তী ধাপ
অভিনন্দন! আপনি **Level 1 (Foundation)** এবং **Static/Media Files** সম্পর্কে জেনেছেন। এখন আমরা **Level 2: Intermediate** শুরু করবো। পরবর্তী চ্যাপ্টারে আমরা শিখবো **Advanced Model Fields** সম্পর্কে।
:::
