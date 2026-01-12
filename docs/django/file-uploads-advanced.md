# Advanced File Uploads

Django-তে সাধারণ ফাইল আপলোডের বাইরেও অনেক জটিল রিকোয়ারমেন্ট হ্যান্ডেল করতে হয়, যেমন মাল্টিপল ফাইল আপলোড, ইমেজ রিসাইজিং বা ক্লাউড স্টোরেজ ব্যবহার।

## Multiple File Uploads

একসাথে একাধিক ফাইল আপলোড করার জন্য HTML ফর্মে `multiple` অ্যাট্রিবিউট ব্যবহার করতে হয় এবং ভিউতে `request.FILES.getlist()` মেথড ব্যবহার করতে হয়।

**HTML Form:**
```html
<form method="post" enctype="multipart/form-data">
    {% csrf_token %}
    <input type="file" name="files" multiple>
    <button type="submit">Upload</button>
</form>
```

**View:**
```python
def upload_files(request):
    if request.method == 'POST':
        files = request.FILES.getlist('files')
        for f in files:
            handle_uploaded_file(f)
        return HttpResponse("Files uploaded!")
```

## File Validation

ফাইল মডেল বা ফর্ম লেভেলে ভ্যালিডেট করা উচিত।

```python
from django.core.exceptions import ValidationError

def validate_file_size(value):
    filesize = value.size
    
    if filesize > 5 * 1024 * 1024: # 5MB limit
        raise ValidationError("The maximum file size that can be uploaded is 5MB")
    else:
        return value
```

## Image Processing (Pillow)

ইমেজ আপলোডের পর রিসাইজ বা ফরম্যাট চেঞ্জ করার জন্য `Pillow` লাইব্রেরি ব্যবহার করা হয়।

**Installation:**
```bash
pip install Pillow
```

**Custom Save Method:**
```python
from PIL import Image

class Profile(models.Model):
    image = models.ImageField(upload_to='profile_pics')

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)

        img = Image.open(self.image.path)

        if img.height > 300 or img.width > 300:
            output_size = (300, 300)
            img.thumbnail(output_size)
            img.save(self.image.path)
```

## Cloud Storage (AWS S3)

প্রোডাকশনে ফাইল সার্ভারে না রেখে S3 বা DigitalOcean Spaces এ রাখা বেস্ট প্র্যাকটিস। এর জন্য `django-storages` এবং `boto3` ব্যবহার করা হয়।

**Installation:**
```bash
pip install django-storages boto3
```

**Settings:**
```python
# settings.py
INSTALLED_APPS = [
    # ...
    'storages',
]

AWS_ACCESS_KEY_ID = 'your-access-key-id'
AWS_SECRET_ACCESS_KEY = 'your-secret-access-key'
AWS_STORAGE_BUCKET_NAME = 'your-bucket-name'
AWS_S3_REGION_NAME = 'us-east-1'

# Static and Media files configuration
STORAGES = {
    "default": {
        "BACKEND": "storages.backends.s3.S3Storage",
    },
    "staticfiles": {
        "BACKEND": "storages.backends.s3.S3StaticStorage",
    },
}
```

## Custom Storage Backends

যদি আপনার নির্দিষ্ট কোনো ফোল্ডার স্ট্রাকচার বা লজিক দরকার হয়, তবে `Storage` ক্লাস ইনহেরিট করে কাস্টম ব্যাকএন্ড তৈরি করা যায়।

```python
from django.core.files.storage import Storage

class MyStorage(Storage):
    def _open(self, name, mode='rb'):
        # ... logic to open file ...
        pass

    def _save(self, name, content):
        # ... logic to save file ...
        return name
```
