# Django Channels Advanced

Django Channels ব্যবহার করে রিয়েল-টাইম অ্যাপ্লিকেশন (যেমন- চ্যাট, লাইভ নোটিফিকেশন) তৈরি করা যায়। তবে প্রোডাকশন লেভেলে বড় প্রজেক্টের জন্য কিছু অ্যাডভান্সড কনসেপ্ট জানা প্রয়োজন।

## 1. Channel Layers

Channel layer হলো একটি কমিউনিকেশন মেকানিজম যা বিভিন্ন অ্যাপ্লিকেশন ইনস্ট্যান্সের মধ্যে ডেটা ট্রান্সফার করতে সাহায্য করে। এটি মূলত একটি মেসেজ কিউ-এর মতো কাজ করে।

- **ব্যবহার:** যদি আপনি অ্যাপ্লিকেশনটি স্কেল করতে চান এবং একের অধিক সার্ভার ব্যবহার করেন, তবে Channel layer ছাড়া ইউজারেরা একে অপরের সাথে যোগাযোগ করতে পারবে না।
- **ব্যাকএন্ড:** প্রোডাকশনে সাধারণত Redis কে Channel layer হিসেবে ব্যবহার করা হয়।

## 2. Group Messaging

গ্রুপ মেসেজিং এর মাধ্যমে আপনি এক সাথে অনেকজন ইউজারকে মেসেজ পাঠাতে পারেন। যেমন- একটি চ্যাট রুম বা একটি লাইভ ভিডিওর কমেন্ট সেকশন।

- **`group_add`:** কোনো ইউজারকে একটি নির্দিষ্ট গ্রুপে যুক্ত করা।
- **`group_discard`:** ইউজার কানেক্টেড না থাকলে তাকে গ্রুপ থেকে সরিয়ে ফেলা।
- **`group_send`:** গ্রুপের সবার কাছে নির্দিষ্ট ডেটা পাঠানো।

```python
# Consumer example
async def connect(self):
    await self.channel_layer.group_add("chat_room", self.channel_name)
    await self.accept()

async def receive(self, text_data):
    await self.channel_layer.group_send(
        "chat_room",
        {
            "type": "chat_message",
            "message": text_data,
        }
    )
```

## 3. Background Workers

WebSocket কানেকশনে কোনো হেভি টাস্ক (যেমন- ইমেজ প্রসেসিং বা বড় রিপোর্ট জেনারেশন) সরাসরি কনজিউমারে করা উচিত নয়। এটি কানেকশনকে ব্লক করে দিতে পারে।

- **সমাধান:** Background workers ব্যবহার করা। আপনি চ্যানেলে একটি টাস্ক পাঠিয়ে দিতে পারেন যা ব্যাকগ্রাউন্ডে চলতে থাকবে এবং শেষ হলে রেজাল্ট চ্যানেলের মাধ্যমে ইউজারকে জানিয়ে দিবে।

## 4. Authentication and Session Handling

WebSockets ডিফল্টভাবে Django-র অথেনটিকেশন বা সেশন হ্যান্ডেল করে না। এর জন্য `AuthMiddlewareStack` ব্যবহার করতে হয়।

- **`scope['user']`:** একবার অথেনটিকেটেড হয়ে গেলে আপনি এই ডিকশনারি থেকে ইউজারের ইনফরমেশন অ্যাক্সেস করতে পারবেন।
- **Session:** একইভাবে `SessionMiddleware` ব্যবহার করে সেশন ডেটা অ্যাক্সেস করা সম্ভব।

## 5. Scaling with Redis

প্রোডাকশনে Django Channels স্কেল করার জন্য Redis Channel Layer ব্যবহার করা হয়। এটি হাই-পারফরম্যান্স এবং রিলায়েবল কমিউনিকেশন নিশ্চিত করে।

```python
# settings.py configuration
CHANNEL_LAYERS = {
    "default": {
        "BACKEND": "channels_redis.core.RedisChannelLayer",
        "CONFIG": {
            "hosts": [("127.0.0.1", 6379)],
        },
    },
}
```

## 6. Tips for Production

- **Daphne:** প্রোডাকশনে ASGI সার্ভার হিসেবে Daphne বা Hypercorn ব্যবহার করুন।
- **SSL/TLS:** সবসময় সিকিউর কানেকশন (`wss://`) ব্যবহার করুন।
- **Monitoring:** Redis এর লোড মনিটর করুন যাতে মেসেজ ড্রপ না হয়।
