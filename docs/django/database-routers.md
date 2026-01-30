# Database Routers

Django-তে সাধারণত একটি ডাটাবেস ব্যবহার করা হয়, তবে বড় প্রজেক্টে বা পারফরম্যান্স অপ্টিমাইজেশনের প্রয়োজনে একাধিক ডাটাবেস (Multiple Databases) ব্যবহার করা হতে পারে। এই একাধিক ডাটাবেসের মধ্যে ডেটা ডিস্ট্রিবিউশন ম্যানেজ করার জন্য Database Routers ব্যবহার করা হয়।

## 1. Multiple Databases Configuration

প্রথমে `settings.py`-তে একাধিক ডাটাবেস ডিভাইন করতে হয়। যেমন একটি প্রাইমারি (write) এবং একটি রেপ্লিকা (read) ডাটাবেস:

```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'primary_db',
        # ... other settings ...
    },
    'replica': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'replica_db',
        # ... other settings ...
    }
}
```

## 2. Database Routing Logic

একাধিক ডাটাবেস থাকলে Django-কে বলে দিতে হয় কোন মডেলের ডেটা কোন ডাটাবেসে যাবে। এর জন্য একটি কাস্টম রাউটার ক্লাস তৈরি করতে হয়। এই ক্লাসে ৪টি প্রধান মেথড থাকে:

1. **`db_for_read(model, **hints)`:\*\* রিড অপারেশনের (select) জন্য কোন ডাটাবেস ব্যবহার হবে।
2. **`db_for_write(model, **hints)`:\*\* রাইট অপারেশনের (insert, update, delete) জন্য কোন ডাটাবেস ব্যবহার হবে।
3. **`allow_relation(obj1, obj2, **hints)`:\*\* দুইটা অবজেক্টের মধ্যে রিলেশনশিপ অ্যালাউ করা হবে কিনা (যদি তারা আলাদা ডিবিতে থাকে)।
4. **`allow_migrate(db, app_label, model_name=None, **hints)`:\*\* কোন অ্যাপের মাইগ্রেশন কোন ডাটাবেসে রান হবে।

## 3. Read/Write Splitting Example

নিচে একটি রাউটারের উদাহরণ দেওয়া হলো যা রাইট অপারেশনগুলো `default` ডিবিতে এবং রিড অপারেশনগুলো `replica` ডিবিতে পাঠাবে:

```python
class PrimaryReplicaRouter:
    def db_for_read(self, model, **hints):
        return 'replica'

    def db_for_write(self, model, **hints):
        return 'default'

    def allow_relation(self, obj1, obj2, **hints):
        return True

    def allow_migrate(self, db, app_label, model_name=None, **hints):
        return True
```

সেটিংস এ রাউটারটি রেজিস্টার করতে হবে:

```python
DATABASE_ROUTERS = ['path.to.PrimaryReplicaRouter']
```

## 4. Manual Routing with `.using()`

কখনও কখনও রাউটার ছাড়াও ম্যানুয়ালি কোডের মধ্যে বলে দেওয়া যায় কোন ডাটাবেস ব্যবহার হবে। এর জন্য ক্যোয়ারিসেটে `.using()` মেথড ব্যবহার করা হয়।

```python
# Read from replica
user = User.objects.using('replica').get(id=1)

# Write to a specific database
user.save(using='default')
```

## 5. Use Cases

- **Read/Write Splitting:** ডাটাবেস লোড কমানোর জন্য।
- **Multi-tenancy:** প্রতিটি ক্লায়েন্টের জন্য আলাদা ডাটাবেস ব্যবহার করা।
- **Legacy Integration:** নতুন প্রজেক্টের সাথে পুরনো কোনো ডাটাবেস কানেক্ট করা।
