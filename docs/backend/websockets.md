# WebSockets (ওয়েবসকেট)

## WebSocket কী?

**WebSocket** হলো একটি **full-duplex, persistent communication protocol** যা client ও server-এর মধ্যে একটি connection খুলে রাখে — দুজনেই যেকোনো সময় data পাঠাতে পারে।

```
HTTP (Traditional):
Client ──► Request  ──► Server
Client ◄── Response ◄── Server
(প্রতিবার নতুন request পাঠাতে হয়, server নিজে থেকে পাঠাতে পারে না)

WebSocket:
Client ◄════════════════► Server
(connection খোলা থাকে, দুজনেই যখন ইচ্ছা data পাঠাতে পারে)
```

> HTTP-তে client বলে "data দাও", server দেয়। WebSocket-এ server নিজে থেকে বলতে পারে "নতুন data এসেছে, এই নাও!"

---

## কেন WebSocket দরকার হলো?

### HTTP-র সমস্যা — Real-time Data

HTTP-তে server **নিজে থেকে** client-কে কিছু পাঠাতে পারে না। Client-কে বারবার জিজ্ঞেস করতে হয়।

**ধরো একটা chat app বানাচ্ছো:**

```
HTTP দিয়ে (Polling):
Client: "নতুন message আছে?" → Server: "না"
(2 সেকেন্ড পর)
Client: "নতুন message আছে?" → Server: "না"
(2 সেকেন্ড পর)
Client: "নতুন message আছে?" → Server: "না"
(2 সেকেন্ড পর)
Client: "নতুন message আছে?" → Server: "হ্যাঁ! এই নাও"

= ৪টা request, ৩টা অকারণে! Bandwidth নষ্ট, server-এ load

WebSocket দিয়ে:
Client ◄═══ connection খোলা ═══► Server
Server: "নতুন message এসেছে, এই নাও!"  (যখন আসলেই আসে)

= শুধু ১টা connection, শুধু দরকার হলেই data আসে
```

---

## HTTP-র Real-time Workarounds (WebSocket আসার আগে)

### 1. Short Polling

নির্দিষ্ট interval-এ বারবার request পাঠানো:

```
Client → GET /api/messages (every 2 sec)
Client → GET /api/messages
Client → GET /api/messages
Client → GET /api/messages → "নতুন message!"
```

```
সমস্যা:
- বেশিরভাগ request অকারণ (data নেই)
- Server-এ unnecessary load
- Real-time না (2 সেকেন্ড delay)
- Battery drain (mobile)
```

### 2. Long Polling

Request পাঠাও, server data না আসা পর্যন্ত response **ধরে রাখে**:

```
Client → GET /api/messages  (request পাঠালো)
Server → (অপেক্ষা করছে... 10 সেকেন্ড... 20 সেকেন্ড...)
Server → "নতুন message!" (data আসলো, response দিলো)
Client → GET /api/messages  (আবার নতুন request)
Server → (অপেক্ষা করছে...)
```

```
Short polling-এর চেয়ে ভালো কিন্তু:
- প্রতিবার নতুন HTTP connection লাগে
- Server-এ অনেক open connection থাকে
- HTTP overhead (headers) প্রতিবার
```

### 3. Server-Sent Events (SSE)

Server থেকে client-এ **one-way stream**:

```
Client → GET /api/events (EventSource connection)
Server → data: new message 1
Server → data: new message 2
Server → data: new message 3
(server ক্রমাগত data push করতে থাকে)
```

```
ভালো দিক: Simple, HTTP-based, auto-reconnect
সমস্যা: শুধু server → client (one-way), client → server পাঠাতে পারে না
```

### তুলনা

| Feature | Short Polling | Long Polling | SSE | WebSocket |
|---------|--------------|-------------|-----|-----------|
| Direction | Client → Server | Client → Server | Server → Client | Both ways |
| Connection | প্রতিবার নতুন | প্রতিবার নতুন | Persistent | Persistent |
| Real-time | ❌ Delay আছে | ⚠️ কিছুটা | ✅ | ✅ |
| Overhead | অনেক বেশি | বেশি | কম | সবচেয়ে কম |
| Complexity | সহজ | মাঝারি | সহজ | মাঝারি |
| Binary data | ❌ | ❌ | ❌ | ✅ |
| ব্যবহার | Legacy | Fallback | Notifications | Chat, Gaming |

---

## WebSocket কীভাবে কাজ করে?

### Step 1: Handshake (HTTP Upgrade)

প্রথমে একটি normal HTTP request পাঠায় এবং WebSocket-এ **upgrade** করতে বলে:

```http
GET /chat HTTP/1.1
Host: example.com
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Key: dGhlIHNhbXBsZSBub25jZQ==
Sec-WebSocket-Version: 13
```

Server agree করলে:

```http
HTTP/1.1 101 Switching Protocols
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Accept: s3pPLMBiTxaQ9kYGzzhZRbK+xOo=
```

### Step 2: Persistent Connection

Handshake-এর পর HTTP connection WebSocket connection-এ পরিণত হয়:

```
         HTTP Handshake              WebSocket Connection
Client ────── Upgrade? ──────► Server
Client ◄────── 101 OK ──────── Server
Client ◄═══════════════════════► Server  (এখন থেকে full-duplex)
         ↑                        ↑
    যেকোনো সময়              যেকোনো সময়
    data পাঠাতে পারে         data পাঠাতে পারে
```

### Step 3: Data Exchange (Frames)

WebSocket data **frames** আকারে পাঠায়। HTTP-র মতো বড় header নেই — তাই অনেক lightweight:

```
HTTP request overhead:  ~800 bytes (headers)
WebSocket frame:        ~6 bytes (header) + data

1000 messages পাঠালে:
HTTP:      ~800KB শুধু headers-এ
WebSocket: ~6KB শুধু headers-এ
```

### Step 4: Connection Close

যেকোনো পক্ষ connection বন্ধ করতে পারে:

```
Client ──► Close frame (code: 1000, reason: "Done")
Server ◄── Close frame (acknowledge)
Connection বন্ধ
```

**Close Codes:**

| Code | মানে |
|------|------|
| 1000 | Normal close |
| 1001 | Going away (page navigate) |
| 1006 | Abnormal close (no close frame) |
| 1008 | Policy violation |
| 1011 | Server error |

---

## WebSocket Protocol Details

### URL Scheme

```
ws://example.com/chat       ← Unencrypted (HTTP-র মতো)
wss://example.com/chat      ← Encrypted (HTTPS-র মতো) ← সবসময় এটা ব্যবহার করো
```

### Frame Types

```
Text Frame:    UTF-8 text data (JSON, plain text)
Binary Frame:  Binary data (images, audio, files)
Ping Frame:    Server/client alive আছে কিনা check
Pong Frame:    Ping-এর response
Close Frame:   Connection বন্ধ করতে চাই
```

### Ping/Pong — Heartbeat

Connection alive আছে কিনা check করে:

```
Server ──► Ping
Client ◄── Pong ("আমি আছি!")

যদি Pong না আসে → Connection dead → Reconnect
```

```
সাধারণত প্রতি 30 সেকেন্ডে একটা Ping পাঠায়
→ Dead connections detect করা যায়
→ Proxy/firewall idle timeout এড়ানো যায়
```

---

## Client-Side Implementation

### Browser JavaScript

```javascript
const ws = new WebSocket('wss://api.example.com/chat');

ws.onopen = () => {
  console.log('Connected!');
  ws.send(JSON.stringify({
    type: 'join',
    room: 'general'
  }));
};

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log('Received:', data);

  if (data.type === 'message') {
    displayMessage(data.text, data.user);
  }
};

ws.onclose = (event) => {
  console.log('Disconnected:', event.code, event.reason);
  // Reconnect logic
};

ws.onerror = (error) => {
  console.error('WebSocket error:', error);
};

// Message পাঠানো
function sendMessage(text) {
  ws.send(JSON.stringify({
    type: 'message',
    text: text,
    timestamp: Date.now()
  }));
}
```

### Auto-Reconnect Pattern

```javascript
class WebSocketClient {
  constructor(url) {
    this.url = url;
    this.reconnectDelay = 1000;
    this.maxDelay = 30000;
    this.connect();
  }

  connect() {
    this.ws = new WebSocket(this.url);

    this.ws.onopen = () => {
      this.reconnectDelay = 1000;  // Reset delay on success
    };

    this.ws.onclose = () => {
      // Exponential backoff: 1s, 2s, 4s, 8s, ... 30s max
      setTimeout(() => this.connect(), this.reconnectDelay);
      this.reconnectDelay = Math.min(
        this.reconnectDelay * 2,
        this.maxDelay
      );
    };
  }
}
```

> **Exponential backoff** — প্রতিবার reconnect delay দ্বিগুণ হয়। Server down থাকলে হাজারো client একসাথে reconnect করে server-কে আরো খারাপ করে না।

---

## Server-Side Implementation

### Node.js (ws library)

```javascript
const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });

const clients = new Map();

wss.on('connection', (ws, req) => {
  const userId = getUserFromToken(req);
  clients.set(userId, ws);

  ws.on('message', (data) => {
    const message = JSON.parse(data);

    if (message.type === 'chat') {
      broadcast({
        type: 'chat',
        user: userId,
        text: message.text,
        timestamp: Date.now()
      });
    }
  });

  ws.on('close', () => {
    clients.delete(userId);
    broadcast({
      type: 'user_left',
      user: userId
    });
  });
});

function broadcast(data) {
  const message = JSON.stringify(data);
  clients.forEach((ws) => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(message);
    }
  });
}
```

### Python (FastAPI + WebSockets)

```python
from fastapi import FastAPI, WebSocket, WebSocketDisconnect

app = FastAPI()

class ConnectionManager:
    def __init__(self):
        self.active_connections: list[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def broadcast(self, message: str):
        for connection in self.active_connections:
            await connection.send_text(message)

manager = ConnectionManager()

@app.websocket("/ws/chat")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            await manager.broadcast(f"Message: {data}")
    except WebSocketDisconnect:
        manager.disconnect(websocket)
```

---

## Common WebSocket Patterns

### 1. Room/Channel Pattern

```
Server
├── Room: "general"
│   ├── User A
│   ├── User B
│   └── User C
├── Room: "dev-team"
│   ├── User A
│   └── User D
└── Room: "support"
    ├── User E
    └── User F

User A "general"-এ message পাঠালে → শুধু B, C পাবে
User A "dev-team"-এ message পাঠালে → শুধু D পাবে
```

```javascript
// Client
ws.send(JSON.stringify({ type: 'join', room: 'general' }));
ws.send(JSON.stringify({ type: 'message', room: 'general', text: 'Hello!' }));
ws.send(JSON.stringify({ type: 'leave', room: 'general' }));
```

### 2. Pub/Sub Pattern

```
Publisher (data source) → Topic → Subscribers

Topic: "stock-prices"
  ├── Subscriber 1 (Dashboard)
  ├── Subscriber 2 (Mobile App)
  └── Subscriber 3 (Trading Bot)

Stock price বদলালে → সব subscriber-কে জানায়
```

### 3. Request/Response Pattern (over WebSocket)

```javascript
// Client
ws.send(JSON.stringify({
  id: "req-123",
  type: "request",
  action: "getUser",
  payload: { userId: 42 }
}));

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  if (data.id === "req-123") {
    // এই response আমার request-এর জন্য
  }
};
```

```
সুবিধা: HTTP-র মতো request-response কিন্তু persistent connection-এ
ব্যবহার: Multiplayer games, real-time collaboration
```

### 4. Heartbeat Pattern

```
Client                     Server
  |── Ping ──────────────►|  (every 30s)
  |◄── Pong ──────────────|
  |                        |
  |── Ping ──────────────►|
  |◄── Pong ──────────────|
  |                        |
  |── Ping ──────────────►|
  |   (no Pong... timeout) |
  |── Reconnect ─────────►|
```

---

## WebSocket Authentication

### 1. Token in URL (Simple)

```javascript
const ws = new WebSocket('wss://api.example.com/ws?token=eyJhbG...');
```

```
সমস্যা: Token URL-এ দেখা যায় (logs-এ থাকে)
ব্যবহার: Quick prototype, internal API
```

### 2. Token in First Message (Recommended)

```javascript
const ws = new WebSocket('wss://api.example.com/ws');

ws.onopen = () => {
  ws.send(JSON.stringify({
    type: 'auth',
    token: 'eyJhbG...'
  }));
};

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  if (data.type === 'auth_success') {
    // Authenticated!
  } else if (data.type === 'auth_failed') {
    ws.close();
  }
};
```

### 3. Cookie-Based

```
Browser automatically cookie পাঠায় WebSocket handshake-এ
Server cookie থেকে session verify করে
```

---

## Scaling WebSockets

### সমস্যা — Multiple Server Instances

```
Server 1: User A, User B connected
Server 2: User C, User D connected

User A → Server 1-এ message পাঠালো
→ Server 1 শুধু User B-কে পাঠাতে পারে
→ User C, D (Server 2-তে) message পাবে না!
```

### সমাধান — Message Broker (Redis Pub/Sub)

```
Server 1 ──► Redis ──► Server 2
   ↑          ↑ ↓         ↑
User A,B    Pub/Sub    User C,D

User A message পাঠায় → Server 1 Redis-এ publish করে
→ Redis সব server-এ broadcast করে
→ Server 2-ও message পায় → User C, D-কে পাঠায়
```

```
Scaling strategy:
1. Redis Pub/Sub (সহজ, ছোট-মাঝারি scale)
2. Kafka/RabbitMQ (বড় scale, message persistence)
3. Dedicated WebSocket service (Socket.io cluster)
```

### Sticky Sessions

```
Load Balancer → একই user সবসময় একই server-এ যায়

User A → (first request)  → Server 1 (WebSocket connection)
User A → (all requests)   → Server 1 (same server!)
```

---

## Socket.IO — জনপ্রিয় WebSocket Library

**Socket.IO** WebSocket-এর উপর built একটি library যা অনেক extra feature দেয়:

```
Socket.IO = WebSocket + Auto-reconnect + Rooms + Fallback + Acknowledgments

Socket.IO fallback:
WebSocket → (fail হলে) → Long Polling → (fail হলে) → Short Polling
```

```javascript
// Server (Node.js)
const io = require('socket.io')(server);

io.on('connection', (socket) => {
  socket.join('general');

  socket.on('chat message', (msg) => {
    io.to('general').emit('chat message', msg);
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

// Client
const socket = io('wss://api.example.com');

socket.emit('chat message', 'Hello!');

socket.on('chat message', (msg) => {
  console.log('Received:', msg);
});
```

**Socket.IO vs Raw WebSocket:**

| Feature | Raw WebSocket | Socket.IO |
|---------|--------------|-----------|
| Auto-reconnect | ❌ নিজে লিখতে হয় | ✅ Built-in |
| Rooms | ❌ নিজে manage | ✅ Built-in |
| Fallback | ❌ | ✅ Long polling fallback |
| Acknowledgments | ❌ | ✅ Callback support |
| Binary data | ✅ | ✅ |
| Namespace | ❌ | ✅ |
| Broadcast | নিজে loop | ✅ `io.emit()` |
| Protocol | Standard WS | Custom (WS-এর সাথে compatible না) |

> **সতর্কতা:** Socket.IO client শুধু Socket.IO server-এর সাথে কাজ করে — standard WebSocket server-এর সাথে না।

---

## WebSocket Use Cases

### Chat Application

```
User A ──► Server ──► User B
User A ◄── Server ◄── User B
(দুজনেই real-time message পায়)
```

### Live Notifications

```
Server → "নতুন order এসেছে!"    → Admin Dashboard
Server → "আপনার post-এ like!"   → Mobile App
Server → "Payment successful!"   → User Browser
```

### Real-time Dashboard

```
Server → Stock price: $150.25   → Dashboard
Server → Stock price: $150.30   → Dashboard (instant update)
Server → Stock price: $149.85   → Dashboard
(প্রতি সেকেন্ডে update)
```

### Multiplayer Games

```
Player A → "move left"  → Server → সব player-কে নতুন position
Player B → "shoot"      → Server → সব player-কে bullet info
(millisecond-এ response দরকার)
```

### Collaborative Editing (Google Docs)

```
User A → "typed 'H'" → Server → User B-র screen-এ 'H' দেখায়
User B → "typed 'i'" → Server → User A-র screen-এ 'i' দেখায়
(দুজনেই একই document real-time-এ edit করছে)
```

### Live Sports/Trading

```
Server → "Goal! Bangladesh 2-1" → সব connected user
Server → "BTC: $95,230"         → সব trader-এর screen
```

---

## WebSocket vs SSE vs HTTP — কখন কোনটা?

| Use Case | Best Choice | কেন |
|----------|-------------|------|
| Chat app | **WebSocket** | Two-way, real-time |
| Live notifications | **SSE** | One-way server → client, simpler |
| File upload | **HTTP** | One-time, large data |
| REST API | **HTTP** | Request-response pattern |
| Stock ticker | **WebSocket** | Frequent two-way updates |
| News feed update | **SSE** | Server push only |
| Online game | **WebSocket** | Low latency, two-way |
| Form submit | **HTTP** | One-time action |
| Collaborative editing | **WebSocket** | Two-way, real-time |
| Log streaming | **SSE** | Server push, text data |

```
মনে রাখার সূত্র:

One-way (server → client only)    → SSE
Two-way (both directions)          → WebSocket
One-time request-response          → HTTP
```

---

## সংক্ষেপে মনে রাখার সূত্র

```
HTTP:      Client asks, server responds (one request, one response)
SSE:       Server pushes to client (one-way stream)
WebSocket: Both talk anytime (full-duplex, persistent)

WebSocket lifecycle:
1. HTTP Upgrade request
2. 101 Switching Protocols
3. Full-duplex communication (frames)
4. Close frame → connection end

Scaling: Redis Pub/Sub → সব server-এ message broadcast
```

---

## Interview Golden Lines

> **WebSocket starts as HTTP, then upgrades to a persistent full-duplex connection.**

> **HTTP is like sending letters. WebSocket is like a phone call — both sides can talk anytime.**

> **Polling wastes bandwidth asking "anything new?" — WebSocket only sends when there IS something new.**

> **Socket.IO is NOT WebSocket — it's a library built on top of WebSocket with fallback and extra features.**

> **Scaling WebSockets requires a message broker like Redis Pub/Sub — one server can't broadcast to another server's clients.**
