# Real-time Features (WebSockets)

সাধারণ HTTP রিকোয়েস্টে ক্লায়েন্ট রিকোয়েস্ট পাঠায় এবং সার্ভার রেসপন্স দেয়, এরপর কানেকশন বন্ধ হয়ে যায়। কিন্তু চ্যাট অ্যাপ, লাইভ নোটিফিকেশন বা স্টক মার্কেট আপডেটের জন্য আমাদের এমন একটি কানেকশন দরকার যা সব সময় খোলা থাকবে এবং দুই পাশ থেকেই ডেটা পাঠানো যাবে। একেই বলা হয় **WebSockets**।

---

## ১. WebSocket Connection Basics

FastAPI-তে WebSocket হ্যান্ডেল করা খুব সহজ। আমরা `@app.websocket()` ডেকোরেটর ব্যবহার করে এটি করতে পারি।

```python
from fastapi import FastAPI, WebSocket

app = FastAPI()

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    # ১. কানেকশন এক্সেপ্ট করা
    await websocket.accept()
    while True:
        # ২. ক্লায়েন্ট থেকে ডেটা রিসিভ করা
        data = await websocket.receive_text()
        # ৩. ক্লায়েন্টকে রিপ্লাই পাঠানো
        await websocket.send_text(f"Message text was: {data}")
```

---

## ২. Tracking Active Connections & Broadcasting

বাস্তব জীবনে একটি চ্যাট অ্যাপে অনেকগুলো ইউজার থাকে। আমাদের ট্র্যাক করতে হয় কারা অনলাইনে আছে এবং একজন মেসেজ পাঠালে তা সবার কাছে পৌঁছে দিতে হয় (Broadcasting)।

এর জন্য আমরা একটি ক্লাসের মাধ্যমে কানেকশনগুলো ম্যানেজ করতে পারি:

```python
from typing import List

class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def send_personal_message(self, message: str, websocket: WebSocket):
        await websocket.send_text(message)

    async def broadcast(self, message: str):
        # একটি মেসেজ কানেক্টেড সবার কাছে পাঠানো
        for connection in self.active_connections:
            await connection.send_text(message)

manager = ConnectionManager()
```

---

## ৩. Simple Chat Application Build

উপরে তৈরি করা `manager` ব্যবহার করে আমরা একটি কমপ্লিট রাউট তৈরি করতে পারি:

```python
@app.websocket("/ws/{client_id}")
async def chat_endpoint(websocket: WebSocket, client_id: int):
    await manager.connect(websocket)
    try:
        while True:
            # ক্লায়েন্ট থেকে মেসেজ আসা পর্যন্ত অপেক্ষা করা
            data = await websocket.receive_text()
            # সবাইকে জানানো কে মেসেজ পাঠিয়েছে
            await manager.broadcast(f"Client #{client_id} says: {data}")
    except Exception:
        # ইউজার ডিসকানেক্ট হলে লিস্ট থেকে রিমুভ করা
        manager.disconnect(websocket)
        await manager.broadcast(f"Client #{client_id} left the chat")
```

---

## ৪. Practice Exercises (অনুশীলন)

১. একটি WebSocket হ্যান্ডলার তৈরি করুন যা শুধু টেক্সট নয়, JSON ডেটা আদান-প্রদান করবে (`receive_json` এবং `send_json` ব্যবহার করে)।
২. এমন একটি সিস্টেম তৈরি করুন যেখানে শুধু নির্দিষ্ট নামের (Admin) ইউজাররা মেসেজ ব্রডকাস্ট করতে পারবে।
৩. একটি ফেক লাইভ নোটিফিকেশন সিস্টেম সিমুলেট করুন যেখানে প্রতি ১০ সেকেন্ড পর পর ব্যাকগ্রাউন্ডে একটি র‍্যান্ডম নোটিফিকেশন সব ক্লায়েন্টের কাছে যাবে।

---

## ৫. Summary & Best Practices

1. **Error Handling:** WebSocket-এ কানেকশন হুট করে বন্ধ হতে পারে, তাই সবসময় `try-except` ব্যবহার করুন।
2. **Security:** সেন্সিটিভ কাজের জন্য WebSocket কানেকশনের সময়ও টোকেন বা অথেনটিকেশন চেক করুন।
3. **Scaling:** যদি আপনার অনেক ইউজার হয় (যেমন: ১ লাখের বেশি), তবে শুধু মেমোরিতে লিস্ট ব্যবহার না করে **Redis Pub/Sub** ব্যবহার করা ভালো।
4. **Heartbeats:** কানেকশন জ্যান্ত আছে কিনা চেক করার জন্য মাঝে মাঝে ছোট কোনো মেসেজ (Ping/Pong) আদান-প্রদান করুন।

---

::: tip পরবর্তী ধাপ
ওয়েবসকেট শেখার মাধ্যমে আপনি এখন রিয়েল-টাইম অ্যাপ তৈরির দক্ষতা অর্জন করেছেন। পরবর্তী এবং প্রায় শেষ ধাপে আমরা শিখবো **Level 4: Expert - Deployment & Production Optimization**।
:::
