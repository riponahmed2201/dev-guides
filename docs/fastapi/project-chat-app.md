# Practical Project 5: Real-time Chat (রিয়েল-টাইম চ্যাট অ্যাপ)

এই প্রোজেক্টে আমরা শিখবো কীভাবে FastAPI ব্যবহার করে একটি রিয়েল-টাইম চ্যাট অ্যাপ্লিকেশন তৈরি করা যায়। এখানে আমরা প্রথাগত HTTP-র বদলে **WebSockets** ব্যবহার করবো, যা একইসাথে সার্ভার এবং ক্লায়েন্টের মধ্যে তথ্য আদান-প্রদান করতে পারে।

---

## ১. প্রোজেক্টের লক্ষ্য (Objective)
- **WebSockets:** টু-ওয়ে (Two-way) কমিউনিকেশন সেটআপ করা।
- **Broadcasting:** একজন ইউজার মেসেজ পাঠালে তা সবার কাছে পৌঁছে দেওয়া।
- **Connection Management:** কে কখন জয়েন করলো বা ডিসকানেক্ট হলো তা ট্র্যাক করা।
- **JSON Messages:** টেক্সটের বদলে জে-সন (JSON) ডাটা আদান-প্রদান করা।

---

## ২. প্রোজেক্টের জন্য প্রয়োজনীয় প্যাকেজ (Required Packages)

```text
fastapi[all]
uvicorn
```

ইন্সটল কমান্ড: `pip install fastapi[all] uvicorn`

---

## ৩. প্রোজেক্ট স্ট্রাকচার (Project Structure)
```text
/chat-app
├── app/
│   ├── main.py
│   ├── manager.py     # কানেকশন হ্যান্ডেল করার জন্য আলাদা ক্লাস
│   └── templates/
│       └── index.html # ক্লায়েন্ট সাইড টেস্টিংয়ের জন্য
└── requirements.txt
```

---

## ৪. কানেকশন ম্যানেজার (`manager.py`)
রিয়েল-টাইম অ্যাপে অনেকগুলো কানেকশনকে একসাথে ম্যানেজ করার জন্য একটি ম্যানেজার ক্লাস থাকা ভালো।

```python
from fastapi import WebSocket

class ConnectionManager:
    def __init__(self):
        # একটি লিস্টে সব অ্যাক্টিভ কানেকশন সেভ করে রাখা হবে
        self.active_connections: list[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def send_personal_message(self, message: str, websocket: WebSocket):
        await websocket.send_text(message)

    async def broadcast(self, message: str):
        # কানেক্টেড সবার কাছে মেসেজ পাঠিয়ে দেওয়া
        for connection in self.active_connections:
            await connection.send_text(message)

manager = ConnectionManager()
```

---

## ৫. সার্ভার ইমপ্লিমেন্টেশন (`main.py`)

```python
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from .manager import manager

app = FastAPI()

@app.websocket("/ws/{client_id}")
async def websocket_endpoint(websocket: WebSocket, client_id: int):
    await manager.connect(websocket)
    try:
        while True:
            # ক্লায়েন্ট থেকে তথ্য রিসিভ করা
            data = await websocket.receive_text()
            # সবাইকে ব্রডকাস্ট করা
            await manager.broadcast(f"Client #{client_id} says: {data}")
    except WebSocketDisconnect:
        # ইউজার ডিসকানেক্ট হয়ে গেলে
        manager.disconnect(websocket)
        await manager.broadcast(f"Client #{client_id} left the chat")
```

---

## ৬. যা যা মেনটেইন করা হয়েছে (Best Practices)
1. **Try-Except Block:** ক্লায়েন্ট হুট করে ট্যাব বন্ধ করে দিলে যেন সার্ভার ক্র্যাশ না করে।
2. **Modular Style:** কানেকশন লজিক মেইন ফাইল থেকে আলাদা রাখা হয়েছে।
3. **Identity Tracking:** `client_id` ব্যবহার করে কে মেসেজ দিচ্ছে তা শনাক্ত করা।
4. **Scalability:** এই মেকানিজম ব্যবহার করে সহজেই চ্যাট রুম বা গ্রুপ চ্যাট তৈরি করা সম্ভব।

---

## ৭. অনুশীলন (Your Task)
- একটি চ্যাট রুম সিস্টেম তৈরি করুন যেন ইউজার নির্দিষ্ট রুম আইডিতে জয়েন করতে পারে (যেমন: `/ws/room1/user1`)।
- মেসেজের সাথে টাইম-স্ট্যাম্প (টাইম) যোগ করুন।
- ইউজার জয়েন করার সাথে সাথে তাকে গত ৫টি মেসেজের হিস্ট্রি দেখানোর ব্যবস্থা করুন।

---

::: tip অভিনন্দন!
আপনি এখন রিয়েল-টাইম কমিউনিকেশন ইঞ্জিনিয়ারিং বোঝেন। এটি দিয়ে আপনি নোটিফিকেশন সিস্টেম, লাইভ ড্যাশবোর্ড বা গেমিং ব্যাকএন্ড তৈরি করতে পারবেন!
:::
