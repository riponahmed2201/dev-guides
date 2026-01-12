# DRF Serializers

Serializers হলো DRF এর অন্যতম গুরুত্বপূর্ণ কম্পোনেন্ট যা কমপ্লেক্স ডেটা টাইপ (যেমন QuerySet বা Model Instances) কে Python Native Data Type এ কনভার্ট করে, যাতে সেগুলো সহজেই JSON বা XML এ রেন্ডার করা যায়। আবার এটি ইনকামিং ডেটাকে ভ্যালিডেট করে মডেলে সেভ করতেও সাহায্য করে।

## Serializer vs ModelSerializer

**`Serializer`**: এটি অনেকটা Django Form এর মতো। এখানে প্রতিটি ফিল্ড ম্যানুয়ালি ডিফাইন করতে হয়।

```python
from rest_framework import serializers

class CommentSerializer(serializers.Serializer):
    email = serializers.EmailField()
    content = serializers.CharField(max_length=200)
    created = serializers.DateTimeField()
```

**`ModelSerializer`**: এটি `ModelForm` এর মতো। এটি মডেলের ফিল্ডগুলোর উপর ভিত্তি করে অটোমেটিক ফিল্ড জেনারেট করে এবং ডিফল্ট `create()` ও `update()` মেথড প্রোভাইড করে।

```python
class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ['id', 'name', 'price', 'stock']
        # fields = '__all__'
```

## SerializerMethodField

যদি মডেলে নেই এমন কোনো ফিল্ড বা ক্যালকু্লেটেড ভ্যালু API তে পাঠাতে চান, তবে `SerializerMethodField` ব্যবহার করা হয়।

```python
class UserSerializer(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'username', 'full_name']

    def get_full_name(self, obj):
        return f"{obj.first_name} {obj.last_name}"
```

## Nested Serializers

রিলেশনাল ডেটা (ForeignKey, ManyToMany) কে ডিটেইলসহ দেখানোর জন্য নেস্টেড সিরিয়ালাইজার ব্যবহার করা হয়।

```python
class AuthorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Author
        fields = ['name', 'bio']

class BookSerializer(serializers.ModelSerializer):
    author = AuthorSerializer()  # Nested

    class Meta:
        model = Book
        fields = ['title', 'author']
```
*নোট: `write` অপারেশনের জন্য নেস্টেড সিরিয়ালাইজার হ্যান্ডেল করতে `create` বা `update` মেথড ওভাররাইড করতে হয়।*

## Read-Only & Write-Only Fields

- **`read_only=True`**: ফিল্ডটি শুধু আউটপুটে (GET response) যাবে, কিন্তু ইনপুটে (POST/PUT) নেয়া হবে না। (যেমন: `created_at`, `id`)
- **`write_only=True`**: ফিল্ডটি শুধু ইনপুটে নেয়া হবে, কিন্তু আউটপুটে দেখানো হবে না। (যেমন: `password`)

```python
class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    
    class Meta:
        model = User
        fields = ['username', 'password']
        extra_kwargs = {
            'username': {'read_only': True}
        }
```

## Validation

ডেটা সেভ করার আগে ভ্যালিডেট করার জন্য দুটি হুক আছে:

১. **Field-level Validation (`validate_<field_name>`)**:

```python
def validate_price(self, value):
    if value < 0:
        raise serializers.ValidationError("Price cannot be negative")
    return value
```

২. **Object-level Validation (`validate`)**:

```python
def validate(self, data):
    if data['start_date'] > data['end_date']:
        raise serializers.ValidationError("End date must occur after start date")
    return data
```

## `create()` and `update()` Methods

সাধারণত `ModelSerializer` এগুলো অটোমেটিক হ্যান্ডেল করে। কিন্তু কাস্টম লজিক (যেমন পাসওয়ার্ড হ্যাশ করা বা সম্পর্কিত অবজেক্ট তৈরি করা) এর জন্য এগুলো ওভাররাইড করতে হয়।

```python
def create(self, validated_data):
    user = User.objects.create_user(**validated_data)
    return user

def update(self, instance, validated_data):
    instance.email = validated_data.get('email', instance.email)
    instance.save()
    return instance
```
