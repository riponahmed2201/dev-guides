# Networking

পাইথনে নেটওয়ার্কিং নিয়ে কাজ করার জন্য বিল্ট-ইন **`socket`** মডিউলটি সবচেয়ে শক্তিশালী। এটি দিয়ে আপনি নিজের চ্যাট অ্যাপ্লিকেশন, ফাইল ট্রান্সফার সিস্টেম বা কাস্টম এইচটিটিপি সার্ভার তৈরি করতে পারেন।

---

## ১. Socket কী?

সকেট হলো নেটওয়ার্কের দুটি ডিভাইসের মধ্যে আলোচনার জন্য একটি সংযোগ বিন্দু। এটি মূলত **IP Address** এবং **Port Number** এর সমন্বয়।

---

## ২. Simple Server (সার্ভার তৈরি)

```python
import socket

# সকেট অবজেক্ট তৈরি করা
server = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
server.bind(('localhost', 12345)) # আইপি এবং পোর্ট সেট করা
server.listen(1) # কল শোনার জন্য অপেক্ষা

print("সার্ভার চালু হয়েছে, কানেকশনের জন্য অপেক্ষা করছে...")

conn, addr = server.accept()
print(f"কানেক্টেড হয়েছে: {addr}")

conn.send(b"Hello from Server!")
conn.close()
```

---

## ৩. Simple Client (ক্লায়েন্ট তৈরি)

```python
import socket

client = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
client.connect(('localhost', 12345))

message = client.recv(1024)
print(message.decode())

client.close()
```

---

## ৪. TCP vs UDP

- **TCP (Transmission Control Protocol)**: ডাটা পৌঁছানোর গ্যারান্টি দেয় এবং ডাটাগুলো সঠিক সিরিয়ালে যায় (যেমন- ব্রাউজিং, ইমেইল)।
- **UDP (User Datagram Protocol)**: অনেক দ্রুত কিন্তু ডাটা পৌঁছানোর গ্যারান্টি দেয় না (যেমন- ভিডিও কলিং, গেমিং)।

---

## ৫. URL Handling and HTML Requests

নেটওয়ার্কিংয়ের একটু হাই-লেভেল কাজ (যেমন ওয়েবসাইট থেকে ডাটা আনা) করার জন্য পাইথনে `urllib` মডিউল আছে। তবে অধিকাংশ ক্ষেত্রে আমরা `requests` লাইব্রেরি ব্যবহার করি (বিস্তারিত লেভেল ৪: [Working with APIs](/python/apis))।

---

::: tip
নেটওয়ার্কিংয়ের মাধ্যমে আপনি শিখতে পারবেন কিভাবে ইন্টারনেট কাজ করে এবং কিভাবে সিকিউর কানেকশন তৈরি করতে হয়।
:::
