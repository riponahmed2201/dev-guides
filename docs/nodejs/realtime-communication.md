# Real-time Communication - সম্পূর্ণ Advanced Guide

Modern web applications এ real-time communication অপরিহার্য। এই guide এ WebSockets, Socket.io, এবং Server-Sent Events (SSE) সম্পূর্ণভাবে শিখবেন।

## 📑 Table of Contents

### Foundation & Theory
1. [Real-time Communication কি এবং কেন](#real-time-communication-কি-এবং-কেন)
2. [HTTP এর Limitations](#http-এর-limitations)
3. [Communication Methods তুলনা](#communication-methods-তুলনা)

### WebSocket Protocol Deep Dive
4. [WebSocket Protocol Architecture](#websocket-protocol-architecture)
5. [HTTP to WebSocket Upgrade](#http-to-websocket-upgrade)
6. [WebSocket Frame Structure](#websocket-frame-structure)
7. [WebSocket Protocol বেসিক](#websocket-protocol-বেসিক)
8. [Native WebSocket Implementation](#native-websocket-implementation)

### Socket.io Theory & Architecture
9. [Socket.io Architecture Explained](#socketio-architecture-explained)
10. [Engine.io vs Socket.io](#engineio-vs-socketio)
11. [Transport Mechanisms](#transport-mechanisms)
12. [Socket.io Setup & Basics](#socketio-setup--basics)
6. [Events & Event Handling](#events--event-handling)
7. [Rooms & Namespaces](#rooms--namespaces)
8. [Broadcasting Patterns](#broadcasting-patterns)
9. [Authentication & Authorization](#authentication--authorization)

### Server-Sent Events
10. [SSE Fundamentals](#sse-fundamentals)
11. [SSE vs WebSockets](#sse-vs-websockets)

### Advanced Topics
12. [Scalability & Load Balancing](#scalability--load-balancing)
13. [Redis Adapter for Multi-server](#redis-adapter-for-multi-server)
14. [Performance Optimization](#performance-optimization)
15. [Security Best Practices](#security-best-practices)
16. [Error Handling & Reconnection](#error-handling--reconnection)
17. [Production Deployment Patterns](#production-deployment-patterns)

---

## Real-time Communication কি এবং কেন

### What is Real-time Communication?

Real-time communication হলো একটি system যেখানে data instantly (বা প্রায় instantly) transmit হয় sender থেকে receiver এ। এটি traditional request-response model থেকে আলাদা।

```javascript
// Traditional Model (Request-Response)
┌─────────┐                    ┌─────────┐
│ Client  │ ──── Request ────> │ Server  │
│         │ <─── Response ──── │         │
└─────────┘                    └─────────┘

// Real-time Model (Persistent Connection)
┌─────────┐                    ┌─────────┐
│ Client  │ <══ Connection ══> │ Server  │
│         │ <── Push Data ───  │         │
│         │ ─── Send Data ──>  │         │
└─────────┘                    └─────────┘
```

### Why Real-time Communication?

#### 1. **Latency Reduction**
```javascript
Traditional Polling:
- Client asks every second: "Any update?"
- 99% responses: "No"
- Wasted bandwidth and server resources

Real-time:
- Server pushes only when there's actual data
- Zero unnecessary requests
- Instant delivery
```

#### 2. **Better User Experience**
```javascript
// Example: Live Chat
Traditional: Refresh every 5 seconds to see new messages
Real-time: Messages appear instantly as they're sent

Result: Feels like real conversation
```

#### 3. **Reduced Server Load**
```javascript
// 1000 users polling every second
Traditional: 1000 requests/second = 86,400,000 requests/day

// 1000 users with WebSocket
Real-time: 1000 connections, data sent only when needed
```

---

## HTTP এর Limitations

HTTP protocol যে problems তৈরি করে real-time communication এ।

### 1. Request-Response Model

```javascript
/*
HTTP হলো একমুখী (unidirectional):
- Client must initiate every interaction
- Server cannot "push" data to client
- Each request needs new TCP connection (HTTP/1.1 এর আগে)
*/

// ❌ HTTP Limitation
Client: "Is there new data?" (Request)
Server: "No" (Response)
[Connection closes]

[5 seconds later]
Client: "Is there new data?" (Request)
Server: "No" (Response)
[Connection closes]

[5 seconds later]
Client: "Is there new data?" (Request)
Server: "Yes, here it is" (Response)
[Connection closes]

Total time to get update: Could be up to 5 seconds delay!
```

### 2. Overhead Problem

```javascript
/*
প্রতিটি HTTP request এ overhead থাকে:

HTTP Request Headers (~500-800 bytes):
GET /api/messages HTTP/1.1
Host: example.com
User-Agent: Mozilla/5.0...
Accept: application/json
Cookie: session=abc123...
Authorization: Bearer token...
[and more headers]

এই সব header প্রতিটি request এ পাঠাতে হয়!
*/

// 1 message poll per second for 1 hour:
// 3600 requests × 800 bytes headers = 2.88 MB
// Just for headers! No actual data.
```

### 3. Scalability Issues

```javascript
/*
10,000 users polling every second:
- 10,000 new TCP connections per second
- 10,000 × overhead
- Server must process & respond to all
- Most responses are "No new data"

Server CPU & Memory exhausted!
*/
```

### 4. Battery Drain (Mobile)

```javascript
/*
Mobile devices এ constant polling:
- Network radio stays active
- CPU processes responses
- Battery drains fast

Real-time connection:
- Single persistent connection
- Data comes when available
- Radio can sleep between messages
*/
```

---

## Communication Methods তুলনা

Real-time communication এর মাধ্যমে server এবং client instant data exchange করতে পারে।

### 1. Traditional vs Real-time

```javascript
// ❌ Traditional Polling (Inefficient)
// Client repeatedly asks server for updates
setInterval(async () => {
  const response = await fetch('/api/messages');
  const messages = await response.json();
  updateUI(messages);
}, 1000); // Every second - wasteful!

// ✅ Real-time with WebSocket
const socket = io('http://localhost:3000');

socket.on('new-message', (message) => {
  updateUI(message);
  // Instant update, no polling needed!
});
```

### 2. Use Cases

```javascript
// ✅ Real-time applications যেখানে প্রয়োজন:

// 1. Chat Applications
const chatSocket = io('/chat');
chatSocket.on('message', displayMessage);

// 2. Live Notifications
const notificationSocket = io('/notifications');
notificationSocket.on('notification', showNotification);

// 3. Collaborative Editing (Google Docs like)
const editorSocket = io('/editor');
editorSocket.on('text-change', updateDocument);

// 4. Live Sports/Stock Updates
const sportsSocket = io('/sports');
sportsSocket.on('score-update', updateScore);

// 5. Online Gaming
const gameSocket = io('/game');
gameSocket.on('player-move', updateGameState);

// 6. Live Tracking (Uber, Food Delivery)
const trackingSocket = io('/tracking');
trackingSocket.on('location-update', updateMap);
```

### 3. Benefits

```javascript
// ✅ Real-time communication এর সুবিধা:

// 1. Instant Updates
// No delay, immediate data push

// 2. Reduced Server Load
// No constant polling, fewer HTTP requests

// 3. Better User Experience
// Feels responsive and modern

// 4. Bi-directional Communication
// Both server and client can initiate

// 5. Efficient
// Persistent connection, less overhead
```

---

## Communication Methods তুলনা

বিভিন্ন real-time techniques এর তুলনা।

### 1. HTTP Polling vs Long Polling vs WebSocket vs SSE

```javascript
// ❌ HTTP Polling (Bad)
setInterval(async () => {
  const data = await fetch('/api/data');
  // Many unnecessary requests
}, 1000);

// 🤔 Long Polling (Better but not ideal)
async function longPoll() {
  const response = await fetch('/api/long-poll');
  const data = await response.json();
  processData(data);
  longPoll(); // Reconnect
}

// ✅ WebSocket (Best for bi-directional)
const ws = new WebSocket('ws://localhost:3000');
ws.onmessage = (event) => {
  console.log('Received:', event.data);
};
ws.send('Hello Server'); // Can send anytime

// ✅ SSE (Best for server-to-client only)
const eventSource = new EventSource('/api/events');
eventSource.onmessage = (event) => {
  console.log('Server sent:', event.data);
};
```

### 2. Feature Comparison Table

```javascript
/*
┌─────────────────┬──────────┬─────────────┬──────────┬─────┐
│ Feature         │ Polling  │ Long Polling│ WebSocket│ SSE │
├─────────────────┼──────────┼─────────────┼──────────┼─────┤
│ Real-time       │ ❌       │ 🤔          │ ✅       │ ✅  │
│ Bi-directional  │ ❌       │ ❌          │ ✅       │ ❌  │
│ Overhead        │ High     │ Medium      │ Low      │ Low │
│ Browser Support │ ✅       │ ✅          │ ✅       │ ✅  │
│ Firewall        │ ✅       │ ✅          │ 🤔       │ ✅  │
│ Auto Reconnect  │ N/A      │ Manual      │ Manual   │ ✅  │
│ Use Case        │ Legacy   │ Fallback    │ Chat     │ Feed│
└─────────────────┴──────────┴─────────────┴──────────┴─────┘
*/
```

---

## WebSocket Protocol Architecture

WebSocket protocol এর internal architecture এবং কিভাবে কাজ করে।

### 1. WebSocket কি?

```javascript
/*
WebSocket হলো একটি communication protocol যা:
- Full-duplex (দুই দিকে simultaneously data flow)
- Persistent connection (একবার connect, সবসময় open)
- Low latency (minimal overhead)
- Binary & Text data support

RFC 6455 specification follow করে
*/

// Protocol Identifier
ws://example.com/socket    // Unencrypted
wss://example.com/socket   // Encrypted (SSL/TLS)
```

### 2. WebSocket vs HTTP Architecture

```javascript
/*
┌─────────── HTTP Architecture ───────────┐
│                                          │
│  Client                     Server       │
│    │                           │         │
│    ├──── Request ───────────>  │         │
│    │  (New TCP Connection)     │         │
│    │ <──── Response ──────────┤         │
│    │  (Connection Closes)      │         │
│    │                           │         │
│    ├──── Request ───────────>  │         │
│    │  (New TCP Connection)     │         │
│    │ <──── Response ──────────┤         │
│    │  (Connection Closes)      │         │
│                                          │
└──────────────────────────────────────────┘

┌─────────── WebSocket Architecture ──────┐
│                                          │
│  Client                     Server       │
│    │                           │         │
│    ├──── Handshake ─────────>  │         │
│    │ <──── Upgrade ───────────┤         │
│    │                           │         │
│    │ ═══════════════════════════         │
│    │    Persistent Connection  │         │
│    │ ═══════════════════════════         │
│    │                           │         │
│    ├──── Message ───────────>  │         │
│    │ <──── Message ───────────┤         │
│    ├──── Message ───────────>  │         │
│    │ <──── Message ───────────┤         │
│    │                           │         │
│    │  (Connection stays open)  │         │
│                                          │
└──────────────────────────────────────────┘
*/
```

### 3. WebSocket Layers

```javascript
/*
OSI Model এ WebSocket এর position:

Layer 7: Application Layer
├─ WebSocket Protocol
├─ HTTP (for initial handshake)
│
Layer 6: Presentation Layer
├─ SSL/TLS (for WSS)
│
Layer 5: Session Layer
│
Layer 4: Transport Layer
├─ TCP (WebSocket uses TCP)
│
Layer 3: Network Layer
├─ IP
│
Layer 2: Data Link Layer
Layer 1: Physical Layer

Key Point: WebSocket works on top of TCP
*/
```

### 4. Connection Lifecycle

```javascript
/*
┌─────────────────────────────────────────┐
│     WebSocket Connection Lifecycle       │
└─────────────────────────────────────────┘

1. CONNECTING (readyState = 0)
   ↓
   Client sends HTTP Upgrade request
   ↓
2. OPEN (readyState = 1)
   ↓
   Handshake complete, connection established
   ↓
   ┌─────────────────────────────┐
   │ Data Transfer Phase         │
   │ - Client → Server           │
   │ - Server → Client           │
   │ - Ping/Pong (heartbeat)     │
   └─────────────────────────────┘
   ↓
3. CLOSING (readyState = 2)
   ↓
   Close frame sent/received
   ↓
4. CLOSED (readyState = 3)
   ↓
   Connection terminated
*/
```

### 5. Why WebSocket is Fast?

```javascript
/*
HTTP Request/Response:
┌────────────────────────────────┐
│ TCP Handshake (3-way)          │ ~50ms
│ TLS Handshake (if HTTPS)       │ ~100ms
│ HTTP Headers (~800 bytes)      │
│ Request Processing             │
│ Response Headers (~500 bytes)  │
│ Connection Close               │
└────────────────────────────────┘
Total: ~150ms + processing time

EVERY SINGLE REQUEST!

WebSocket:
┌────────────────────────────────┐
│ Initial Handshake (once)       │ ~150ms
├────────────────────────────────┤
│ Message Frame (~2-6 bytes)     │ ~1ms
│ Data Payload                   │
└────────────────────────────────┘
Total: ~1ms per message (after handshake)

উদাহরণ: 100 messages পাঠাতে
HTTP: 100 × 150ms = 15 seconds
WebSocket: 150ms + (100 × 1ms) = 250ms

60x faster!
*/
```

---

## HTTP to WebSocket Upgrade

কিভাবে HTTP connection WebSocket এ upgrade হয়।

### 1. Upgrade Mechanism

```javascript
/*
WebSocket connection শুরু হয় একটি HTTP request দিয়ে।
এই request টা special "Upgrade" header contain করে।

Flow:
1. Client sends HTTP GET with Upgrade header
2. Server responds with 101 Switching Protocols
3. Connection upgrades from HTTP to WebSocket
4. Now full-duplex communication possible
*/
```

### 2. Client Handshake Request

```http
GET /chat HTTP/1.1
Host: example.com:8000
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Key: dGhlIHNhbXBsZSBub25jZQ==
Sec-WebSocket-Version: 13
Origin: http://example.com

Important Headers:

1. Upgrade: websocket
   - Indicates client wants to upgrade connection

2. Connection: Upgrade
   - Tells server this is an upgrade request

3. Sec-WebSocket-Key: [base64-encoded random bytes]
   - Random value for security
   - Prevents caching proxies from confusing connections
   - Server uses this to prove it understands WebSocket

4. Sec-WebSocket-Version: 13
   - WebSocket protocol version (13 is current)

5. Origin: http://example.com
   - Security feature (CORS-like)
   - Server can verify origin
```

### 3. Server Handshake Response

```http
HTTP/1.1 101 Switching Protocols
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Accept: s3pPLMBiTxaQ9kYGzzhZRbK+xOo=

Important Headers:

1. Status: 101 Switching Protocols
   - Success! Connection is upgrading

2. Upgrade: websocket
   - Confirms upgrade to WebSocket

3. Connection: Upgrade
   - Confirms connection upgrade

4. Sec-WebSocket-Accept: [calculated hash]
   - Proves server understands WebSocket protocol
   - Calculated as: Base64(SHA1(Sec-WebSocket-Key + Magic String))
   - Magic String: "258EAFA5-E914-47DA-95CA-C5AB0DC85B11"
```

### 4. Sec-WebSocket-Accept Calculation

```javascript
// ✅ কিভাবে server calculate করে

const crypto = require('crypto');

function calculateWebSocketAccept(key) {
  // Magic GUID defined in RFC 6455
  const MAGIC_STRING = '258EAFA5-E914-47DA-95CA-C5AB0DC85B11';
  
  // Concatenate key with magic string
  const combined = key + MAGIC_STRING;
  
  // SHA1 hash
  const hash = crypto
    .createHash('sha1')
    .update(combined)
    .digest();
  
  // Base64 encode
  const accept = hash.toString('base64');
  
  return accept;
}

// Example
const clientKey = 'dGhlIHNhbXBsZSBub25jZQ==';
const acceptKey = calculateWebSocketAccept(clientKey);

console.log(acceptKey);
// Output: s3pPLMBiTxaQ9kYGzzhZRbK+xOo=

/*
Why this calculation?
- Proves server truly understands WebSocket
- Prevents cross-protocol attacks
- Simple but effective security measure
*/
```

### 📝 **Hands-on Example: Testing Upgrade Manually**

```javascript
// ✅ Example 1: Simulate WebSocket handshake with Node.js

const crypto = require('crypto');
const http = require('http');

const server = http.createServer((req, res) => {
  if (req.url === '/websocket' && req.headers.upgrade === 'websocket') {
    
    // Get client key
    const key = req.headers['sec-websocket-key'];
    
    // Calculate accept key
    const MAGIC = '258EAFA5-E914-47DA-95CA-C5AB0DC85B11';
    const accept = crypto
      .createHash('sha1')
      .update(key + MAGIC)
      .digest('base64');
    
    // Send 101 Switching Protocols
    const headers = [
      'HTTP/1.1 101 Switching Protocols',
      'Upgrade: websocket',
      'Connection: Upgrade',
      `Sec-WebSocket-Accept: ${accept}`,
      '',
      ''
    ].join('\r\n');
    
    res.socket.write(headers);
    
    console.log('✅ Upgraded to WebSocket!');
    console.log('Client Key:', key);
    console.log('Accept Key:', accept);
    
    // Now you can send/receive WebSocket frames
  } else {
    res.writeHead(200);
    res.end('Use WebSocket client to connect to /websocket');
  }
});

server.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
  console.log('Test with: wscat -c ws://localhost:3000/websocket');
});

/*
Test করুন:
1. npm install -g wscat
2. wscat -c ws://localhost:3000/websocket
3. Console এ upgrade process দেখুন
*/
```

```javascript
// ✅ Example 2: Browser থেকে test করুন

// client.html
/*
<!DOCTYPE html>
<html>
<head><title>WebSocket Handshake Test</title></head>
<body>
  <h1>WebSocket Upgrade Test</h1>
  <button onclick="connect()">Connect</button>
  <div id="status">Not connected</div>
  <div id="log"></div>
  
  <script>
    function connect() {
      const ws = new WebSocket('ws://localhost:3000/websocket');
      const log = document.getElementById('log');
      const status = document.getElementById('status');
      
      // ✅ Connection opening - Upgrade happening
      ws.addEventListener('open', (event) => {
        status.textContent = '✅ Connected (Upgraded)';
        status.style.color = 'green';
        
        log.innerHTML += '<p>✅ HTTP upgraded to WebSocket!</p>';
        log.innerHTML += '<p>ReadyState: ' + ws.readyState + ' (OPEN)</p>';
        
        // Send test message
        ws.send('Hello from browser!');
      });
      
      ws.addEventListener('message', (event) => {
        log.innerHTML += '<p>📩 Received: ' + event.data + '</p>';
      });
      
      ws.addEventListener('close', (event) => {
        status.textContent = '❌ Disconnected';
        status.style.color = 'red';
        log.innerHTML += '<p>Connection closed</p>';
      });
      
      ws.addEventListener('error', (error) => {
        log.innerHTML += '<p>❌ Error: ' + error + '</p>';
      });
    }
  </script>
</body>
</html>
*/

/*
📊 Observe করুন:
1. Browser DevTools → Network tab open করুন
2. "Connect" button click করুন
3. Network tab এ WebSocket connection দেখুন
4. Headers tab এ upgrade headers দেখুন:
   - Request: Upgrade: websocket, Sec-WebSocket-Key
   - Response: 101 Switching Protocols, Sec-WebSocket-Accept
5. Messages tab এ frames দেখুন
*/
```

```javascript
// ✅ Example 3: Upgrade failure scenarios

const http = require('http');

const server = http.createServer((req, res) => {
  // Scenario 1: Missing Upgrade header
  if (!req.headers.upgrade) {
    res.writeHead(400, { 'Content-Type': 'text/plain' });
    res.end('Bad Request: Missing Upgrade header');
    console.log('❌ Rejected: No upgrade header');
    return;
  }
  
  // Scenario 2: Wrong upgrade value
  if (req.headers.upgrade !== 'websocket') {
    res.writeHead(400);
    res.end('Bad Request: Invalid Upgrade value');
    console.log('❌ Rejected: Wrong upgrade value');
    return;
  }
  
  // Scenario 3: Unsupported version
  const version = req.headers['sec-websocket-version'];
  if (version !== '13') {
    res.writeHead(426, {
      'Sec-WebSocket-Version': '13'
    });
    res.end('Upgrade Required: Use WebSocket version 13');
    console.log('❌ Rejected: Unsupported version', version);
    return;
  }
  
  // Scenario 4: Origin check (security)
  const origin = req.headers.origin;
  const allowedOrigins = ['http://localhost:3000', 'http://127.0.0.1:3000'];
  
  if (origin && !allowedOrigins.includes(origin)) {
    res.writeHead(403);
    res.end('Forbidden: Origin not allowed');
    console.log('❌ Rejected: Invalid origin', origin);
    return;
  }
  
  // ✅ All checks passed - upgrade!
  console.log('✅ All validations passed, upgrading...');
  
  const key = req.headers['sec-websocket-key'];
  const accept = calculateAccept(key);
  
  res.socket.write([
    'HTTP/1.1 101 Switching Protocols',
    'Upgrade: websocket',
    'Connection: Upgrade',
    `Sec-WebSocket-Accept: ${accept}`,
    '',
    ''
  ].join('\r\n'));
});

function calculateAccept(key) {
  const crypto = require('crypto');
  return crypto
    .createHash('sha1')
    .update(key + '258EAFA5-E914-47DA-95CA-C5AB0DC85B11')
    .digest('base64');
}

server.listen(3000);

/*
Test different scenarios:

1. Valid upgrade:
   wscat -c ws://localhost:3000
   ✅ Success!

2. Wrong version (if you could):
   Headers: Sec-WebSocket-Version: 12
   ❌ 426 Upgrade Required

3. Missing headers:
   curl http://localhost:3000
   ❌ 400 Bad Request

4. Wrong origin (from browser):
   Open from file:// protocol
   ❌ 403 Forbidden
*/
```

### 5. Upgrade Process Step-by-Step

```javascript
/*
Step-by-Step Upgrade:

┌─────────────────────────────────────────┐
│ 1. TCP Connection Established           │
├─────────────────────────────────────────┤
│ Client: SYN                             │
│ Server: SYN-ACK                         │
│ Client: ACK                             │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│ 2. HTTP Upgrade Request                 │
├─────────────────────────────────────────┤
│ GET /socket HTTP/1.1                    │
│ Upgrade: websocket                      │
│ Connection: Upgrade                     │
│ Sec-WebSocket-Key: xxx                  │
│ Sec-WebSocket-Version: 13               │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│ 3. Server Validates Request             │
├─────────────────────────────────────────┤
│ - Check Origin (security)               │
│ - Verify WebSocket version              │
│ - Calculate Sec-WebSocket-Accept        │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│ 4. Server Sends 101 Response            │
├─────────────────────────────────────────┤
│ HTTP/1.1 101 Switching Protocols        │
│ Upgrade: websocket                      │
│ Connection: Upgrade                     │
│ Sec-WebSocket-Accept: yyy               │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│ 5. Connection Upgraded!                 │
├─────────────────────────────────────────┤
│ HTTP protocol stops                     │
│ WebSocket protocol begins               │
│ Full-duplex communication enabled       │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│ 6. WebSocket Frames Exchange            │
├─────────────────────────────────────────┤
│ Client ←→ Server (bidirectional)        │
└─────────────────────────────────────────┘
*/
```

### 6. Upgrade Failures

```javascript
/*
Common upgrade failures:

1. Missing Headers
HTTP/1.1 400 Bad Request
- Missing Upgrade or Connection header

2. Version Mismatch
HTTP/1.1 426 Upgrade Required
Sec-WebSocket-Version: 13
- Client using unsupported version

3. Origin Rejected
HTTP/1.1 403 Forbidden
- Server doesn't accept this origin

4. Server Error
HTTP/1.1 500 Internal Server Error
- Server-side issue during upgrade
*/
```

---

## WebSocket Frame Structure

WebSocket data কিভাবে frames আকারে transfer হয়।

### 1. Frame Format

```javascript
/*
WebSocket Frame Structure (RFC 6455):

 0                   1                   2                   3
 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1
+-+-+-+-+-------+-+-------------+-------------------------------+
|F|R|R|R| opcode|M| Payload len |    Extended payload length    |
|I|S|S|S|  (4)  |A|     (7)     |             (16/64)           |
|N|V|V|V|       |S|             |   (if payload len==126/127)   |
| |1|2|3|       |K|             |                               |
+-+-+-+-+-------+-+-------------+ - - - - - - - - - - - - - - - +
|     Extended payload length continued, if payload len == 127  |
+ - - - - - - - - - - - - - - - +-------------------------------+
|                               |Masking-key, if MASK set to 1  |
+-------------------------------+-------------------------------+
| Masking-key (continued)       |          Payload Data         |
+-------------------------------- - - - - - - - - - - - - - - - +
:                     Payload Data continued ...                :
+ - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - +
|                     Payload Data continued ...                |
+---------------------------------------------------------------+

প্রতিটি field এর ব্যাখ্যা নিচে...
*/
```

### 2. Frame Fields Explained

```javascript
/*
1. FIN (1 bit):
   - Final fragment indicator
   - 1 = This is the last fragment
   - 0 = More fragments coming
   
   Use case: Large messages can be split into fragments

2. RSV1, RSV2, RSV3 (1 bit each):
   - Reserved for future use
   - Must be 0 unless extension defined

3. Opcode (4 bits):
   - Defines frame type
   - Values:
     0x0 = Continuation frame
     0x1 = Text frame (UTF-8)
     0x2 = Binary frame
     0x8 = Connection close
     0x9 = Ping
     0xA = Pong

4. MASK (1 bit):
   - Is payload masked?
   - Client → Server: MUST be 1 (masked)
   - Server → Client: MUST be 0 (not masked)
   
   Why? Security against cache poisoning attacks

5. Payload Length (7 bits, or 7+16, or 7+64):
   - If 0-125: That's the length
   - If 126: Next 16 bits are length
   - If 127: Next 64 bits are length
   
   Examples:
   - 10 bytes = 10
   - 200 bytes = 126, then 200
   - 70000 bytes = 127, then 70000

6. Masking Key (32 bits):
   - Random key for XOR masking
   - Only present if MASK = 1
   - Changes with every frame from client

7. Payload Data:
   - Actual message data
   - Masked if from client
   - Unmasked if from server
*/
```

### 3. Frame Types Examples

```javascript
// Text Frame (Client → Server)
/*
┌─────────────────────────────────┐
│ FIN: 1 (final fragment)         │
│ Opcode: 0x1 (text)              │
│ MASK: 1 (masked)                │
│ Payload Length: 5               │
│ Masking Key: [random 4 bytes]   │
│ Payload: "Hello" (masked)       │
└─────────────────────────────────┘

Actual bytes (hex):
81 85 [mask] [masked "Hello"]
│  │    │      │
│  │    │      └─ Masked payload
│  │    └──────── Masking key (4 bytes)
│  └───────────── Length (0x85 = 128+5 = masked + 5 bytes)
└──────────────── FIN=1, Opcode=1 (0x81 = 10000001)
*/

// Ping Frame (Server → Client)
/*
┌─────────────────────────────────┐
│ FIN: 1                          │
│ Opcode: 0x9 (ping)              │
│ MASK: 0 (not masked)            │
│ Payload Length: 0               │
└─────────────────────────────────┘

Actual bytes (hex):
89 00
│  │
│  └─ Length (0 bytes)
└──── FIN=1, Opcode=9 (0x89 = 10001001)
*/

// Close Frame
/*
┌─────────────────────────────────┐
│ FIN: 1                          │
│ Opcode: 0x8 (close)             │
│ MASK: 0                         │
│ Payload Length: 2               │
│ Payload: Close code (1000)      │
└─────────────────────────────────┘

Close Codes:
1000 = Normal closure
1001 = Going away
1002 = Protocol error
1003 = Unsupported data
1006 = Abnormal closure
1007 = Invalid data
1008 = Policy violation
1009 = Message too big
1010 = Extension negotiation failed
1011 = Server error
*/
```

### 4. Masking Algorithm

```javascript
// ✅ কিভাবে masking কাজ করে

function maskPayload(payload, maskingKey) {
  const masked = Buffer.alloc(payload.length);
  
  for (let i = 0; i < payload.length; i++) {
    // XOR each byte with corresponding masking key byte
    masked[i] = payload[i] ^ maskingKey[i % 4];
  }
  
  return masked;
}

// Unmask (same algorithm!)
function unmaskPayload(maskedPayload, maskingKey) {
  return maskPayload(maskedPayload, maskingKey);
  // XOR is reversible: (X ^ Y) ^ Y = X
}

// Example
const message = Buffer.from('Hello');
const maskingKey = Buffer.from([0x12, 0x34, 0x56, 0x78]);

const masked = maskPayload(message, maskingKey);
console.log('Masked:', masked.toString('hex'));

const unmasked = unmaskPayload(masked, maskingKey);
console.log('Unmasked:', unmasked.toString()); // "Hello"

/*
Why masking?
- Prevents proxy cache poisoning
- Ensures each frame is unique
- Security against certain attacks
*/
```

### 5. Message Fragmentation

```javascript
/*
Large messages can be split into fragments:

Original: "This is a very long message"

Fragment 1:
┌─────────────────────────────────┐
│ FIN: 0 (not final)              │
│ Opcode: 0x1 (text)              │
│ Payload: "This is a"            │
└─────────────────────────────────┘

Fragment 2:
┌─────────────────────────────────┐
│ FIN: 0 (not final)              │
│ Opcode: 0x0 (continuation)      │
│ Payload: " very long"           │
└─────────────────────────────────┘

Fragment 3:
┌─────────────────────────────────┐
│ FIN: 1 (final!)                 │
│ Opcode: 0x0 (continuation)      │
│ Payload: " message"             │
└─────────────────────────────────┘

Receiver assembles: "This is a very long message"

Benefits:
- Can send data as it becomes available
- Better memory management
- Lower latency for first byte
*/
```

### 6. Control Frames

```javascript
/*
Control frames are special:

1. Must have FIN = 1 (not fragmented)
2. Payload ≤ 125 bytes
3. Can be injected between data fragments

Types:

PING (0x9):
- Heartbeat mechanism
- Check if connection alive
- Server or client can send

PONG (0xA):
- Response to PING
- Must echo PING's payload
- Proves connection is alive

CLOSE (0x8):
- Graceful connection termination
- Contains close code & reason
- Both sides must send CLOSE
*/

// Heartbeat example
setInterval(() => {
  if (ws.readyState === WebSocket.OPEN) {
    ws.ping(); // Send PING frame
  }
}, 30000);

ws.on('pong', () => {
  console.log('Connection alive');
  lastPong = Date.now();
});
```

### 📝 **Hands-on Example: Understanding Frames Practically**

```javascript
// ✅ Example 1: Decode WebSocket frame manually

function decodeFrame(buffer) {
  console.log('Raw bytes:', buffer.toString('hex'));
  console.log('Binary:', buffer.toString('binary'));
  
  // Byte 0: FIN + Opcode
  const byte0 = buffer[0];
  const fin = (byte0 & 0b10000000) >> 7;  // First bit
  const opcode = byte0 & 0b00001111;       // Last 4 bits
  
  console.log('FIN:', fin, fin ? '(Final)' : '(More coming)');
  console.log('Opcode:', opcode, getOpcodeType(opcode));
  
  // Byte 1: MASK + Payload length
  const byte1 = buffer[1];
  const masked = (byte1 & 0b10000000) >> 7;
  let payloadLength = byte1 & 0b01111111;
  
  console.log('MASK:', masked, masked ? '(Masked)' : '(Not masked)');
  console.log('Payload length:', payloadLength);
  
  let offset = 2;
  
  // Extended payload length
  if (payloadLength === 126) {
    payloadLength = buffer.readUInt16BE(2);
    offset = 4;
    console.log('Extended length (16-bit):', payloadLength);
  } else if (payloadLength === 127) {
    payloadLength = buffer.readBigUInt64BE(2);
    offset = 10;
    console.log('Extended length (64-bit):', payloadLength);
  }
  
  // Masking key (if masked)
  let maskingKey;
  if (masked) {
    maskingKey = buffer.slice(offset, offset + 4);
    offset += 4;
    console.log('Masking key:', maskingKey.toString('hex'));
  }
  
  // Payload
  let payload = buffer.slice(offset, offset + payloadLength);
  
  // Unmask if needed
  if (masked && maskingKey) {
    const unmasked = Buffer.alloc(payload.length);
    for (let i = 0; i < payload.length; i++) {
      unmasked[i] = payload[i] ^ maskingKey[i % 4];
    }
    payload = unmasked;
  }
  
  console.log('Payload (decoded):', payload.toString());
  console.log('---');
  
  return {
    fin,
    opcode,
    masked,
    payloadLength,
    payload: payload.toString()
  };
}

function getOpcodeType(opcode) {
  const types = {
    0: 'Continuation',
    1: 'Text',
    2: 'Binary',
    8: 'Close',
    9: 'Ping',
    10: 'Pong'
  };
  return types[opcode] || 'Unknown';
}

// Test it!
// Text frame: "Hello"
const textFrame = Buffer.from([
  0x81,           // FIN=1, Opcode=1 (text)
  0x05,           // MASK=0, Length=5
  0x48, 0x65, 0x6c, 0x6c, 0x6f  // "Hello"
]);

console.log('=== Decoding Text Frame ===');
decodeFrame(textFrame);

// Ping frame
const pingFrame = Buffer.from([
  0x89,           // FIN=1, Opcode=9 (ping)
  0x00            // MASK=0, Length=0
]);

console.log('=== Decoding Ping Frame ===');
decodeFrame(pingFrame);

/*
Output:
=== Decoding Text Frame ===
Raw bytes: 810548656c6c6f
Binary: ...
FIN: 1 (Final)
Opcode: 1 Text
MASK: 0 (Not masked)
Payload length: 5
Payload (decoded): Hello
---

=== Decoding Ping Frame ===
Raw bytes: 8900
FIN: 1 (Final)
Opcode: 9 Ping
MASK: 0 (Not masked)
Payload length: 0
---
*/
```

```javascript
// ✅ Example 2: Create WebSocket frame manually

function createTextFrame(text, masked = false) {
  const payload = Buffer.from(text);
  const payloadLength = payload.length;
  
  // Calculate total frame size
  let frameSize = 2 + payloadLength;
  if (masked) frameSize += 4; // Masking key
  if (payloadLength > 125) frameSize += 2; // Extended length
  if (payloadLength > 65535) frameSize += 6; // 64-bit length
  
  const frame = Buffer.alloc(frameSize);
  let offset = 0;
  
  // Byte 0: FIN (1) + Opcode (1 for text)
  frame[offset++] = 0b10000001; // 0x81
  
  // Byte 1: MASK + Payload length
  let byte1 = 0;
  if (masked) byte1 |= 0b10000000; // Set MASK bit
  
  if (payloadLength <= 125) {
    byte1 |= payloadLength;
    frame[offset++] = byte1;
  } else if (payloadLength <= 65535) {
    byte1 |= 126;
    frame[offset++] = byte1;
    frame.writeUInt16BE(payloadLength, offset);
    offset += 2;
  } else {
    byte1 |= 127;
    frame[offset++] = byte1;
    frame.writeBigUInt64BE(BigInt(payloadLength), offset);
    offset += 8;
  }
  
  // Masking key (if masked)
  let maskingKey;
  if (masked) {
    maskingKey = Buffer.from([
      Math.floor(Math.random() * 256),
      Math.floor(Math.random() * 256),
      Math.floor(Math.random() * 256),
      Math.floor(Math.random() * 256)
    ]);
    maskingKey.copy(frame, offset);
    offset += 4;
  }
  
  // Payload (masked if needed)
  if (masked && maskingKey) {
    for (let i = 0; i < payload.length; i++) {
      frame[offset++] = payload[i] ^ maskingKey[i % 4];
    }
  } else {
    payload.copy(frame, offset);
  }
  
  return frame;
}

// Test
const frame1 = createTextFrame('Hello', false);
console.log('Unmasked frame:', frame1.toString('hex'));
// Output: 810548656c6c6f

const frame2 = createTextFrame('Hello', true);
console.log('Masked frame:', frame2.toString('hex'));
// Output: 8185[random 4 bytes][masked payload]

// Verify by decoding
console.log('\nDecoding our created frame:');
decodeFrame(frame1);
```

```javascript
// ✅ Example 3: Fragmented message

function createFragmentedMessage(text, chunkSize = 5) {
  const payload = Buffer.from(text);
  const fragments = [];
  
  for (let i = 0; i < payload.length; i += chunkSize) {
    const chunk = payload.slice(i, i + chunkSize);
    const isLast = (i + chunkSize >= payload.length);
    
    const frame = Buffer.alloc(2 + chunk.length);
    
    // First fragment: Opcode = 1 (text), FIN = 0
    // Middle fragments: Opcode = 0 (continuation), FIN = 0
    // Last fragment: Opcode = 0 (continuation), FIN = 1
    
    const opcode = (i === 0) ? 1 : 0;
    const fin = isLast ? 1 : 0;
    
    frame[0] = (fin << 7) | opcode;
    frame[1] = chunk.length;
    chunk.copy(frame, 2);
    
    fragments.push(frame);
    
    console.log(`Fragment ${fragments.length}:`, {
      fin: fin ? 'FINAL' : 'MORE',
      opcode: opcode === 1 ? 'TEXT' : 'CONTINUATION',
      payload: chunk.toString(),
      hex: frame.toString('hex')
    });
  }
  
  return fragments;
}

// Test
console.log('=== Creating Fragmented Message ===');
const fragments = createFragmentedMessage('Hello World!', 5);

/*
Output:
Fragment 1: { fin: 'MORE', opcode: 'TEXT', payload: 'Hello', hex: '010548656c6c6f' }
Fragment 2: { fin: 'MORE', opcode: 'CONTINUATION', payload: ' Worl', hex: '0005205776f726c' }
Fragment 3: { fin: 'FINAL', opcode: 'CONTINUATION', payload: 'd!', hex: '80026421' }

Receiver assembles: "Hello" + " Worl" + "d!" = "Hello World!"
*/
```

```javascript
// ✅ Example 4: Real WebSocket server with frame logging

const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 3000 });

wss.on('connection', (ws) => {
  console.log('Client connected');
  
  // Intercept raw frames
  ws._socket.on('data', (buffer) => {
    console.log('\n📥 Received frame:');
    console.log('Hex:', buffer.toString('hex'));
    
    // Decode it
    const decoded = decodeFrame(buffer);
    console.log('Decoded:', decoded);
  });
  
  ws.on('message', (data) => {
    console.log('Message:', data.toString());
    
    // Send pong
    ws.ping();
  });
  
  ws.on('ping', () => {
    console.log('📍 Ping received');
  });
  
  ws.on('pong', () => {
    console.log('📍 Pong received');
  });
  
  ws.on('close', (code, reason) => {
    console.log('Connection closed:', code, reason.toString());
  });
});

console.log('WebSocket server running on ws://localhost:3000');
console.log('Connect with: wscat -c ws://localhost:3000');

/*
Test করুন:

Terminal 1:
node server.js

Terminal 2:
wscat -c ws://localhost:3000

Type: Hello
Watch Terminal 1 for frame breakdown!

You'll see:
📥 Received frame:
Hex: 8185a1b2c3d4e9d7a6b1c8
FIN: 1 (Final)
Opcode: 1 Text
MASK: 1 (Masked)
Masking key: a1b2c3d4
Payload (decoded): Hello
---
Message: Hello
*/
```

---

## WebSocket Protocol বেসিক

WebSocket হলো একটা protocol যা persistent, bi-directional connection provide করে।

### 1. WebSocket Lifecycle

```javascript
// Client Side (Browser)
const ws = new WebSocket('ws://localhost:3000');

// 1. Connection Opening
ws.addEventListener('open', (event) => {
  console.log('Connected to server');
  ws.send('Hello Server!');
});

// 2. Receiving Messages
ws.addEventListener('message', (event) => {
  console.log('Message from server:', event.data);
});

// 3. Connection Close
ws.addEventListener('close', (event) => {
  console.log('Disconnected:', event.code, event.reason);
});

// 4. Error Handling
ws.addEventListener('error', (event) => {
  console.error('WebSocket error:', event);
});

// 5. Sending Messages
function sendMessage(message) {
  if (ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(message));
  } else {
    console.log('WebSocket not ready');
  }
}
```

### 2. WebSocket States

```javascript
// ✅ Understanding WebSocket ReadyState

function checkWebSocketState(ws) {
  switch(ws.readyState) {
    case WebSocket.CONNECTING: // 0
      console.log('Connecting...');
      break;
      
    case WebSocket.OPEN: // 1
      console.log('Connected and ready');
      break;
      
    case WebSocket.CLOSING: // 2
      console.log('Connection closing...');
      break;
      
    case WebSocket.CLOSED: // 3
      console.log('Connection closed');
      break;
  }
}

// Usage
const ws = new WebSocket('ws://localhost:3000');

ws.addEventListener('open', () => {
  console.log('State:', ws.readyState); // 1 (OPEN)
});

// Before sending, always check
if (ws.readyState === WebSocket.OPEN) {
  ws.send('Message');
}
```

---

## Native WebSocket Implementation

Built-in WebSocket দিয়ে server এবং client implementation।

### 1. Basic WebSocket Server

```javascript
// server.js
const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 3000 });

console.log('WebSocket server running on port 3000');

wss.on('connection', (ws) => {
  console.log('New client connected');
  
  // Send welcome message
  ws.send(JSON.stringify({
    type: 'welcome',
    message: 'Welcome to WebSocket server!'
  }));
  
  // Receive messages
  ws.on('message', (data) => {
    console.log('Received:', data.toString());
    
    // Echo back
    ws.send(JSON.stringify({
      type: 'echo',
      message: data.toString()
    }));
  });
  
  // Handle disconnect
  ws.on('close', () => {
    console.log('Client disconnected');
  });
  
  // Handle errors
  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
  });
});
```

### 2. Client Implementation

```html
<!-- client.html -->
<!DOCTYPE html>
<html>
<head>
  <title>WebSocket Client</title>
</head>
<body>
  <h1>WebSocket Demo</h1>
  
  <div id="status">Disconnected</div>
  
  <input type="text" id="messageInput" placeholder="Type message...">
  <button onclick="sendMessage()">Send</button>
  
  <div id="messages"></div>
  
  <script>
    const ws = new WebSocket('ws://localhost:3000');
    const status = document.getElementById('status');
    const messages = document.getElementById('messages');
    const messageInput = document.getElementById('messageInput');
    
    ws.addEventListener('open', () => {
      status.textContent = 'Connected';
      status.style.color = 'green';
    });
    
    ws.addEventListener('message', (event) => {
      const data = JSON.parse(event.data);
      
      const messageDiv = document.createElement('div');
      messageDiv.textContent = `${data.type}: ${data.message}`;
      messages.appendChild(messageDiv);
    });
    
    ws.addEventListener('close', () => {
      status.textContent = 'Disconnected';
      status.style.color = 'red';
    });
    
    ws.addEventListener('error', (error) => {
      console.error('Error:', error);
    });
    
    function sendMessage() {
      const message = messageInput.value;
      
      if (message && ws.readyState === WebSocket.OPEN) {
        ws.send(message);
        messageInput.value = '';
      }
    }
    
    // Send on Enter key
    messageInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        sendMessage();
      }
    });
  </script>
</body>
</html>
```

### 3. Broadcasting to All Clients

```javascript
// server.js
const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 3000 });

// Track all connected clients
const clients = new Set();

wss.on('connection', (ws) => {
  // Add new client
  clients.add(ws);
  console.log(`Total clients: ${clients.size}`);
  
  // Broadcast to all clients
  broadcast({
    type: 'user-joined',
    count: clients.size
  });
  
  ws.on('message', (data) => {
    const message = data.toString();
    
    // Broadcast message to all clients
    broadcast({
      type: 'message',
      content: message,
      timestamp: new Date().toISOString()
    });
  });
  
  ws.on('close', () => {
    // Remove client
    clients.delete(ws);
    
    // Notify others
    broadcast({
      type: 'user-left',
      count: clients.size
    });
  });
});

function broadcast(data) {
  const message = JSON.stringify(data);
  
  clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}
```

### 4. WebSocket with Express

```javascript
// server.js
const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Serve static files
app.use(express.static('public'));

// Regular HTTP routes
app.get('/api/status', (req, res) => {
  res.json({
    clients: wss.clients.size,
    uptime: process.uptime()
  });
});

// WebSocket connection
wss.on('connection', (ws, req) => {
  const ip = req.socket.remoteAddress;
  console.log('New connection from:', ip);
  
  ws.on('message', (data) => {
    console.log('Received:', data.toString());
    
    // Broadcast to all except sender
    wss.clients.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(data);
      }
    });
  });
  
  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

server.listen(3000, () => {
  console.log('Server running on port 3000');
});
```

---

## Socket.io Architecture Explained

Socket.io এর internal architecture এবং কিভাবে কাজ করে তার বিস্তারিত।

### 1. Socket.io কি?

```javascript
/*
Socket.io হলো একটি library (not a protocol!) যা:

1. WebSocket এর উপর build
2. Additional features provide করে
3. Fallback mechanisms আছে
4. Cross-browser compatibility
5. Auto-reconnection
6. Room & Namespace support
7. Broadcasting helpers

Architecture:
┌─────────────────────────────────┐
│        Socket.io Library         │
├─────────────────────────────────┤
│        Engine.io (Core)          │
├─────────────────────────────────┤
│  WebSocket  │  HTTP Long-Poll   │
├─────────────┴───────────────────┤
│             TCP/IP               │
└─────────────────────────────────┘
*/
```

### 2. Socket.io Layers

```javascript
/*
3-Layer Architecture:

Layer 1: Socket.io (High-level API)
├─ Namespaces
├─ Rooms
├─ Acknowledgments
├─ Broadcasting
├─ Middleware
└─ Event-based API

Layer 2: Engine.io (Transport layer)
├─ Connection establishment
├─ Transport negotiation
├─ Heartbeat mechanism
├─ Upgrade logic (polling → WebSocket)
└─ Binary support

Layer 3: Transport (Actual communication)
├─ WebSocket (preferred)
└─ HTTP Long-polling (fallback)
*/
```

### 3. কেন Socket.io ব্যবহার করবেন?

```javascript
/*
Native WebSocket vs Socket.io:

Native WebSocket:
┌────────────────────────────────┐
│ ✅ Faster (less overhead)      │
│ ✅ Simple protocol             │
│ ❌ No fallback                 │
│ ❌ No auto-reconnect           │
│ ❌ No rooms/namespaces         │
│ ❌ Manual heartbeat            │
│ ❌ More code to write          │
└────────────────────────────────┘

Socket.io:
┌────────────────────────────────┐
│ ✅ Automatic fallback          │
│ ✅ Auto-reconnection           │
│ ✅ Built-in rooms/namespaces   │
│ ✅ Automatic heartbeat         │
│ ✅ Broadcasting helpers        │
│ ✅ Middleware support          │
│ ❌ Slightly more overhead      │
└────────────────────────────────┘

Verdict: Socket.io for production, Native for performance-critical
*/
```

### 4. Connection Flow

```javascript
/*
Socket.io Connection Process:

┌─────────────────────────────────────┐
│ 1. Client Initiates Connection      │
├─────────────────────────────────────┤
│ const socket = io('http://server'); │
└─────────────────────────────────────┘
                ↓
┌─────────────────────────────────────┐
│ 2. Engine.io Handshake              │
├─────────────────────────────────────┤
│ GET /socket.io/?EIO=4&transport=... │
│ Server responds with session ID     │
│ (Uses HTTP Long-polling first)      │
└─────────────────────────────────────┘
                ↓
┌─────────────────────────────────────┐
│ 3. Transport Upgrade Attempt        │
├─────────────────────────────────────┤
│ If WebSocket available:             │
│   Try to upgrade to WebSocket       │
│ If successful:                       │
│   Close polling, use WebSocket      │
└─────────────────────────────────────┘
                ↓
┌─────────────────────────────────────┐
│ 4. Socket.io Handshake              │
├─────────────────────────────────────┤
│ Exchange Socket.io metadata         │
│ Establish namespaces                │
└─────────────────────────────────────┘
                ↓
┌─────────────────────────────────────┐
│ 5. Connection Established           │
├─────────────────────────────────────┤
│ socket.on('connect') fires          │
│ Ready for communication             │
└─────────────────────────────────────┘
*/
```

### 5. Packet Structure

```javascript
/*
Socket.io packets format:

[Packet Type][Namespace][Data]

Packet Types:
0 = CONNECT
1 = DISCONNECT
2 = EVENT
3 = ACK
4 = ERROR
5 = BINARY_EVENT
6 = BINARY_ACK

Example packets:

// Connect to default namespace
0

// Connect to /chat namespace
0/chat

// Event with data
2["message",{"text":"Hello"}]
│ │          │
│ │          └─ Data (JSON)
│ └──────────── Event name
└────────────── Packet type (EVENT)

// Event with acknowledgment
21["getData",{}]
│││         │
│││         └─ Data
││└─────────── Event name
│└──────────── Packet ID (for ACK)
└───────────── Packet type (EVENT)

// Acknowledgment response
3["data received"]
││
│└─ ACK data
└── Packet type (ACK)
*/
```

---

## Engine.io vs Socket.io

Engine.io এবং Socket.io এর পার্থক্য এবং relationship।

### 1. Relationship

```javascript
/*
┌───────────────────────────────────────┐
│           Your Application             │
│  (Events, Rooms, Broadcasting, etc.)   │
└────────────────┬──────────────────────┘
                 │
                 │ Uses
                 ↓
┌───────────────────────────────────────┐
│            Socket.io                   │
│  • High-level API                      │
│  • Namespaces & Rooms                  │
│  • Event emitter pattern               │
│  • Middleware support                  │
└────────────────┬──────────────────────┘
                 │
                 │ Built on
                 ↓
┌───────────────────────────────────────┐
│            Engine.io                   │
│  • Low-level transport                 │
│  • Connection management               │
│  • Heartbeat/ping-pong                 │
│  • Transport upgrade                   │
└────────────────┬──────────────────────┘
                 │
                 │ Uses
                 ↓
┌───────────────────────────────────────┐
│    WebSocket / HTTP Long-polling       │
└───────────────────────────────────────┘

Analogy:
Engine.io = Car Engine (transport mechanism)
Socket.io = Complete Car (features + engine)
*/
```

### 2. Engine.io Responsibilities

```javascript
/*
Engine.io handles:

1. Transport Selection
   ├─ Try WebSocket first
   ├─ Fallback to polling if needed
   └─ Upgrade polling to WebSocket when possible

2. Connection Management
   ├─ Session establishment
   ├─ Session ID generation
   └─ Connection state tracking

3. Heartbeat
   ├─ Send ping packets
   ├─ Expect pong responses
   └─ Detect dead connections

4. Message Encoding/Decoding
   ├─ Convert to Engine.io packet format
   └─ Parse incoming packets

5. Buffer Management
   ├─ Queue messages during upgrade
   └─ Flush when upgrade complete
*/
```

### 3. Socket.io Responsibilities

```javascript
/*
Socket.io handles:

1. Event System
   ├─ Event emitter API
   ├─ Custom event names
   └─ Event acknowledgments

2. Namespaces
   ├─ Logical separation
   ├─ Different contexts
   └─ Authorization per namespace

3. Rooms
   ├─ Grouping sockets
   ├─ Targeted broadcasting
   └─ Dynamic room membership

4. Broadcasting
   ├─ To all sockets
   ├─ To specific rooms
   ├─ Excluding sender
   └─ To specific namespaces

5. Middleware
   ├─ Authentication
   ├─ Authorization
   └─ Request preprocessing

6. Auto-reconnection
   ├─ Retry logic
   ├─ Backoff strategy
   └─ State restoration
*/
```

### 4. Packet Flow

```javascript
/*
When you emit an event:

Your Code:
socket.emit('message', { text: 'Hello' });
        ↓
Socket.io Layer:
┌──────────────────────────────────┐
│ 1. Wrap in Socket.io packet      │
│    Format: 2["message",{"text...}]│
│ 2. Add namespace if needed       │
│ 3. Handle acknowledgment if any  │
└──────────────────────────────────┘
        ↓
Engine.io Layer:
┌──────────────────────────────────┐
│ 1. Encode to Engine.io format    │
│    Format: 4[Socket.io packet]   │
│ 2. Check connection state        │
│ 3. Select transport              │
└──────────────────────────────────┘
        ↓
Transport Layer:
┌──────────────────────────────────┐
│ WebSocket:                       │
│   Send as WebSocket frame        │
│ OR                               │
│ Polling:                         │
│   Queue until client polls       │
└──────────────────────────────────┘
        ↓
Network → Server
*/
```

### 📝 **Hands-on Example: Observe Socket.io Packets**

```javascript
// ✅ Example 1: Log Socket.io packet flow

// server.js
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Intercept Engine.io packets
io.engine.on('packet', ({ type, data }) => {
  console.log('📦 Engine.io packet:', {
    type: ['open', 'close', 'ping', 'pong', 'message', 'upgrade', 'noop'][type],
    data
  });
});

io.on('connection', (socket) => {
  console.log('✅ Socket.io connected:', socket.id);
  console.log('Transport:', socket.conn.transport.name);
  
  // Log Socket.io packets
  socket.onAny((eventName, ...args) => {
    console.log('📨 Socket.io event:', eventName, args);
  });
  
  socket.on('my-event', (data) => {
    console.log('Received my-event:', data);
    
    // Send response
    socket.emit('response', { message: 'Got it!' });
  });
  
  // Watch transport changes
  socket.conn.on('upgrade', (transport) => {
    console.log('⬆️ Upgraded to:', transport.name);
  });
});

server.listen(3000, () => {
  console.log('Server on http://localhost:3000');
});

// client.html
/*
<script src="/socket.io/socket.io.js"></script>
<script>
  const socket = io({
    // Enable debugging
    transports: ['polling', 'websocket']
  });
  
  socket.on('connect', () => {
    console.log('Connected:', socket.id);
    console.log('Transport:', socket.io.engine.transport.name);
    
    // Send event
    socket.emit('my-event', { foo: 'bar' });
  });
  
  socket.on('response', (data) => {
    console.log('Response:', data);
  });
  
  // Log all packets (debugging)
  socket.io.engine.on('packet', (packet) => {
    console.log('Packet:', packet);
  });
  
  socket.io.engine.on('packetCreate', (packet) => {
    console.log('Sending:', packet);
  });
</script>
*/

/*
Console output sequence:

Server:
📦 Engine.io packet: { type: 'message', data: '0' }
✅ Socket.io connected: abc123
Transport: polling
📨 Socket.io event: my-event [ { foo: 'bar' } ]
Received my-event: { foo: 'bar' }
⬆️ Upgraded to: websocket
📦 Engine.io packet: { type: 'message', data: '2["response",{"message":"Got it!"}]' }

Client:
Connected: abc123
Transport: polling
Packet: { type: 'message', data: '0' }
Sending: { type: 'message', data: '2["my-event",{"foo":"bar"}]' }
Transport upgraded to: websocket
Response: { message: 'Got it!' }
*/
```

```javascript
// ✅ Example 2: Packet format decoder

function decodeSocketIOPacket(packet) {
  console.log('Raw packet:', packet);
  
  // Engine.io packet format: [type][data]
  const engineType = packet[0];
  const engineTypes = ['open', 'close', 'ping', 'pong', 'message', 'upgrade', 'noop'];
  
  console.log('Engine.io type:', engineTypes[engineType]);
  
  if (engineType === 4) { // message
    const socketIOData = packet.slice(1);
    console.log('Socket.io data:', socketIOData);
    
    // Socket.io packet format: [type][id?][namespace][data]
    const socketIOType = socketIOData[0];
    const socketIOTypes = ['CONNECT', 'DISCONNECT', 'EVENT', 'ACK', 'ERROR', 'BINARY_EVENT', 'BINARY_ACK'];
    
    console.log('Socket.io type:', socketIOTypes[socketIOType]);
    
    // Parse rest
    const rest = socketIOData.slice(1);
    
    if (socketIOType === 2) { // EVENT
      try {
        const eventData = JSON.parse(rest);
        console.log('Event name:', eventData[0]);
        console.log('Event data:', eventData[1]);
      } catch (e) {
        console.log('Data:', rest);
      }
    }
  }
  
  console.log('---');
}

// Test different packets
decodeSocketIOPacket('0');              // CONNECT
decodeSocketIOPacket('2["message",{"text":"hello"}]'); // EVENT
decodeSocketIOPacket('3');              // PONG
decodeSocketIOPacket('40/chat');        // CONNECT to /chat namespace

/*
Output:

Raw packet: 0
Engine.io type: message
Socket.io data: 0
Socket.io type: CONNECT
---

Raw packet: 2["message",{"text":"hello"}]
Engine.io type: message
Socket.io data: 2["message",{"text":"hello"}]
Socket.io type: EVENT
Event name: message
Event data: { text: 'hello' }
---
*/
```

```javascript
// ✅ Example 3: See Engine.io session details

const io = require('socket.io')(3000);

io.on('connection', (socket) => {
  const engine = socket.conn;
  
  console.log('\n=== Engine.io Session Details ===');
  console.log('Session ID:', engine.id);
  console.log('Transport:', engine.transport.name);
  console.log('Ready state:', engine.readyState);
  console.log('Remote address:', engine.request.connection.remoteAddress);
  console.log('Upgraded:', engine.upgraded);
  
  // Transport details
  console.log('\n=== Transport Details ===');
  console.log('Name:', engine.transport.name);
  console.log('Writable:', engine.transport.writable);
  console.log('Supports binary:', engine.transport.supportsBinary);
  
  // Ping/Pong
  engine.on('ping', () => {
    console.log('📍 Ping sent');
  });
  
  engine.on('pong', () => {
    console.log('📍 Pong received (latency: ' + engine.pingInterval + 'ms)');
  });
  
  // Packets
  let packetCount = 0;
  engine.on('packet', (packet) => {
    packetCount++;
    console.log(`Packet #${packetCount}:`, packet.type, packet.data?.slice(0, 50));
  });
  
  // Upgrade
  engine.on('upgrade', (transport) => {
    console.log('\n⬆️ Transport upgraded!');
    console.log('From: polling → To:', transport.name);
  });
  
  // Close
  engine.on('close', (reason) => {
    console.log('\n❌ Engine.io closed:', reason);
    console.log('Total packets:', packetCount);
  });
});

/*
Output when client connects:

=== Engine.io Session Details ===
Session ID: abc123xyz
Transport: polling
Ready state: open
Remote address: ::1
Upgraded: false

=== Transport Details ===
Name: polling
Writable: true
Supports binary: false

📍 Ping sent
📍 Pong received (latency: 25000ms)
Packet #1: message 0
Packet #2: message 2["my-event",...]

⬆️ Transport upgraded!
From: polling → To: websocket

=== Transport Details ===
Name: websocket
Writable: true
Supports binary: true
*/
```

---

## Transport Mechanisms

Socket.io কিভাবে different transports ব্যবহার করে।

### 1. Available Transports

```javascript
/*
Socket.io supports 2 transports:

1. WebSocket
   ✅ Real-time, bi-directional
   ✅ Low latency
   ✅ Efficient
   ❌ Might be blocked by proxies/firewalls

2. HTTP Long-polling
   ✅ Works everywhere (pure HTTP)
   ✅ Firewall-friendly
   ❌ Higher latency
   ❌ More overhead
*/
```

### 2. Transport Selection Process

```javascript
/*
Connection Flow:

┌─────────────────────────────────┐
│ 1. Start with Polling           │
├─────────────────────────────────┤
│ Client: GET /socket.io/?EIO=4...│
│         &transport=polling      │
│                                 │
│ Server: {"sid":"abc123",...}    │
│                                 │
│ Why polling first?              │
│ - Works everywhere              │
│ - Establishes session           │
│ - Gets session ID               │
└─────────────────────────────────┘
                ↓
┌─────────────────────────────────┐
│ 2. Try WebSocket Upgrade        │
├─────────────────────────────────┤
│ Client: WS /socket.io/?EIO=4... │
│         &transport=websocket    │
│         &sid=abc123             │
│                                 │
│ If successful:                  │
│   → Close polling               │
│   → Use WebSocket               │
│                                 │
│ If failed:                      │
│   → Keep using polling          │
└─────────────────────────────────┘
                ↓
┌─────────────────────────────────┐
│ 3. Final Transport              │
├─────────────────────────────────┤
│ WebSocket (preferred)           │
│ OR                              │
│ Polling (fallback)              │
└─────────────────────────────────┘
*/
```

### 3. Polling Mechanism

```javascript
/*
HTTP Long-polling কিভাবে কাজ করে:

Traditional Polling:
┌─────────────────────────────────┐
│ Client → Server: Any data?      │
│ Server → Client: No             │
│ [Wait 1 second]                 │
│ Client → Server: Any data?      │
│ Server → Client: No             │
│ [Repeat...]                     │
└─────────────────────────────────┘
Wasteful!

Long-polling (Engine.io):
┌─────────────────────────────────┐
│ Client → Server: Any data?      │
│ [Server holds connection open]  │
│ [Server waits for data...]      │
│ [Data arrives!]                 │
│ Server → Client: Yes, here!     │
│ Client → Server: Any data?      │
│ [Immediately reconnects]        │
└─────────────────────────────────┘
More efficient!

Implementation:
*/

// Client side (simplified)
async function poll() {
  const response = await fetch(`/socket.io/?EIO=4&transport=polling&sid=${sessionId}`);
  const data = await response.text();
  
  processData(data);
  
  // Immediately poll again
  poll();
}

// Server side
app.get('/socket.io/', (req, res) => {
  const sid = req.query.sid;
  const session = sessions.get(sid);
  
  // Hold request until data available
  session.waitForData().then(data => {
    res.send(data);
  });
  
  // Or timeout after 60 seconds
  setTimeout(() => {
    res.send(''); // Empty response
  }, 60000);
});
```

### 4. Transport Upgrade

```javascript
/*
Polling → WebSocket upgrade:

Step 1: Establish polling session
┌──────────────────────────────┐
│ POST /socket.io/?transport=  │
│      polling&EIO=4            │
│                              │
│ Response: {"sid":"abc"}      │
└──────────────────────────────┘

Step 2: Probe WebSocket
┌──────────────────────────────┐
│ WS /socket.io/?transport=    │
│    websocket&sid=abc          │
│                              │
│ Send: "2probe" (ping)        │
│ Expect: "3probe" (pong)      │
└──────────────────────────────┘

Step 3: Confirm upgrade
┌──────────────────────────────┐
│ If probe successful:         │
│   Send: "5" (upgrade)        │
│   Server: Pause polling      │
│   Client: Close polling      │
│   Client: Use WebSocket      │
└──────────────────────────────┘

Step 4: Resume communication
┌──────────────────────────────┐
│ All future messages via WS   │
└──────────────────────────────┘

Why this complexity?
- Ensures WebSocket truly works
- No data loss during switch
- Graceful fallback if upgrade fails
*/
```

### 📝 **Hands-on Example: Observe Transport Upgrade Live**

```javascript
// ✅ Example 1: Monitor upgrade process in detail

// server.js
const io = require('socket.io')(3000, {
  // Enable all logs
  transports: ['polling', 'websocket'],
  allowUpgrades: true
});

io.engine.on('connection', (socket) => {
  console.log('\n=== New Engine.io Connection ===');
  console.log('ID:', socket.id);
  console.log('Initial transport:', socket.transport.name);
  
  let step = 1;
  
  socket.on('upgrading', (transport) => {
    console.log(`\n[Step ${step++}] 🔄 Upgrading...`);
    console.log('New transport:', transport.name);
  });
  
  socket.on('upgrade', (transport) => {
    console.log(`\n[Step ${step++}] ✅ Upgrade complete!`);
    console.log('Final transport:', transport.name);
    console.log('Old transport closed');
  });
  
  socket.on('packet', (packet) => {
    if (packet.type === 'ping') {
      console.log('📍 Ping via', socket.transport.name);
    }
    if (packet.data === '2probe') {
      console.log(`\n[Step ${step++}] 🔍 Probe request received`);
    }
    if (packet.data === '3probe') {
      console.log(`[Step ${step++}] 📮 Probe response sent`);
    }
    if (packet.data === '5') {
      console.log(`[Step ${step++}] 🚀 Upgrade confirmed`);
    }
  });
});

io.on('connection', (socket) => {
  console.log('\n=== Socket.io Connected ===');
  console.log('Transport:', socket.conn.transport.name);
  
  // Send message every 2 seconds
  const interval = setInterval(() => {
    socket.emit('server-time', {
      time: new Date().toISOString(),
      transport: socket.conn.transport.name
    });
  }, 2000);
  
  socket.on('disconnect', () => {
    clearInterval(interval);
  });
});

console.log('Server running on http://localhost:3000');

/*
Output sequence:

=== New Engine.io Connection ===
ID: abc123
Initial transport: polling

[Step 1] 🔍 Probe request received
[Step 2] 📮 Probe response sent
[Step 3] 🚀 Upgrade confirmed

[Step 4] 🔄 Upgrading...
New transport: websocket

[Step 5] ✅ Upgrade complete!
Final transport: websocket
Old transport closed

=== Socket.io Connected ===
Transport: websocket

📍 Ping via websocket
📍 Ping via websocket
*/
```

```javascript
// ✅ Example 2: Client-side upgrade monitoring

// client.html
/*
<script src="/socket.io/socket.io.js"></script>
<script>
  const socket = io({
    transports: ['polling', 'websocket']
  });
  
  let step = 1;
  const log = [];
  
  function addLog(message) {
    const timestamp = new Date().toISOString().split('T')[1];
    const entry = `[${timestamp}] ${message}`;
    log.push(entry);
    console.log(entry);
  }
  
  // Monitor Engine.io events
  const engine = socket.io.engine;
  
  engine.on('packet', (packet) => {
    addLog(`📦 Packet: ${packet.type} ${packet.data || ''}`);
  });
  
  engine.on('packetCreate', (packet) => {
    addLog(`📤 Sending: ${packet.type} ${packet.data || ''}`);
  });
  
  engine.on('upgrading', (transport) => {
    addLog(`[Step ${step++}] 🔄 Client: Starting upgrade to ${transport.name}`);
  });
  
  engine.on('upgrade', (transport) => {
    addLog(`[Step ${step++}] ✅ Client: Upgraded to ${transport.name}`);
  });
  
  engine.on('upgradeError', (error) => {
    addLog(`❌ Upgrade failed: ${error.message}`);
  });
  
  socket.on('connect', () => {
    addLog(`✅ Connected via ${engine.transport.name}`);
  });
  
  socket.on('server-time', (data) => {
    addLog(`⏰ Server time via ${data.transport}: ${data.time}`);
  });
  
  // Export log
  setTimeout(() => {
    console.log('\n=== Complete Log ===');
    log.forEach(l => console.log(l));
  }, 10000);
</script>
*/

/*
Client console output:

[10:30:00.123] 📦 Packet: open {"sid":"abc123"...}
[10:30:00.150] ✅ Connected via polling
[10:30:00.200] 📤 Sending: message 0
[10:30:00.250] [Step 1] 🔄 Client: Starting upgrade to websocket
[10:30:00.300] 📤 Sending: ping 2probe
[10:30:00.350] 📦 Packet: pong 3probe
[10:30:00.400] [Step 2] ✅ Client: Upgraded to websocket
[10:30:00.450] 📤 Sending: message 5
[10:30:02.500] ⏰ Server time via websocket: 2026-01-18T10:30:02.500Z
[10:30:04.500] ⏰ Server time via websocket: 2026-01-18T10:30:04.500Z
*/
```

### 5. Force Transport

```javascript
// ===== CLIENT =====

// Only use WebSocket (no fallback)
const socket = io({
  transports: ['websocket']
});

// Only use Polling (testing/debugging)
const socket = io({
  transports: ['polling']
});

// Try WebSocket first, fallback to polling
const socket = io({
  transports: ['websocket', 'polling']
});

// Default: Start with polling, upgrade to WebSocket
const socket = io(); // Same as ['polling', 'websocket']

/*
When to force WebSocket only?
✅ Internal network (no proxy issues)
✅ Mobile apps (guaranteed support)
✅ Performance critical
✅ Want to avoid upgrade overhead

When to allow polling fallback?
✅ Public internet
✅ Corporate networks
✅ Maximum compatibility
✅ Unknown client environment
*/
```

### 6. Transport Events

```javascript
// ===== CLIENT =====

socket.on('connect', () => {
  console.log('Connected!');
  console.log('Transport:', socket.io.engine.transport.name);
  // "websocket" or "polling"
});

// Listen for transport upgrade
socket.io.engine.on('upgrade', (transport) => {
  console.log('Upgraded to:', transport.name);
  // polling → websocket
});

// Listen for transport close
socket.io.engine.on('close', (reason) => {
  console.log('Transport closed:', reason);
});

// Monitor active transport
socket.io.engine.on('packet', (packet) => {
  console.log('Packet:', packet.type, 'via', socket.io.engine.transport.name);
});

/*
Typical upgrade sequence:

1. connect (transport: polling)
2. upgrade (transport: websocket)
3. [All future packets via websocket]

If upgrade fails:
1. connect (transport: polling)
2. [Stays on polling forever]
*/
```

---

## Socket.io Setup & Basics

Socket.io হলো সবচেয়ে জনপ্রিয় WebSocket library যা অনেক features provide করে।

### 1. Installation & Basic Setup

```bash
# Server-side
npm install socket.io

# Client-side (if using separate frontend)
npm install socket.io-client
```

```javascript
// server.js
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static('public'));

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

server.listen(3000, () => {
  console.log('Server running on port 3000');
});
```

```html
<!-- public/index.html -->
<!DOCTYPE html>
<html>
<head>
  <title>Socket.io Client</title>
  <script src="/socket.io/socket.io.js"></script>
</head>
<body>
  <h1>Socket.io Demo</h1>
  <div id="status">Connecting...</div>
  
  <script>
    const socket = io();
    
    socket.on('connect', () => {
      document.getElementById('status').textContent = 'Connected: ' + socket.id;
    });
    
    socket.on('disconnect', () => {
      document.getElementById('status').textContent = 'Disconnected';
    });
  </script>
</body>
</html>
```

### 2. CORS Configuration

```javascript
// server.js
const { Server } = require('socket.io');

const io = new Server(server, {
  cors: {
    origin: ['http://localhost:5173', 'https://myapp.com'],
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Or allow all origins (Development only!)
const io = new Server(server, {
  cors: {
    origin: '*'
  }
});
```

### 3. Socket.io Options

```javascript
// ✅ Advanced Socket.io configuration
const io = new Server(server, {
  // Connection options
  pingTimeout: 60000,      // How long to wait for ping response
  pingInterval: 25000,     // How often to ping clients
  upgradeTimeout: 10000,   // Time to wait for upgrade
  maxHttpBufferSize: 1e6,  // Max message size (1MB)
  
  // Transport options
  transports: ['websocket', 'polling'], // Preferred transports
  
  // CORS
  cors: {
    origin: 'http://localhost:5173',
    credentials: true
  },
  
  // Path
  path: '/socket.io/',
  
  // Serialization
  parser: undefined // Custom parser if needed
});
```

---

## Events & Event Handling

Socket.io events হলো real-time communication এর core।

### 1. Basic Events

```javascript
// ===== SERVER =====
io.on('connection', (socket) => {
  console.log('Connected:', socket.id);
  
  // Listen for custom events
  socket.on('chat-message', (data) => {
    console.log('Chat message:', data);
    
    // Send acknowledgment
    socket.emit('message-received', {
      id: data.id,
      timestamp: Date.now()
    });
  });
  
  socket.on('typing', (isTyping) => {
    console.log('User typing:', isTyping);
  });
  
  socket.on('disconnect', (reason) => {
    console.log('Disconnected:', reason);
  });
});

// ===== CLIENT =====
const socket = io();

// Send events
socket.emit('chat-message', {
  id: 123,
  text: 'Hello!',
  user: 'John'
});

socket.emit('typing', true);

// Listen for events
socket.on('message-received', (data) => {
  console.log('Message delivered:', data);
});
```

### 2. Acknowledgments (Callbacks)

```javascript
// ===== SERVER =====
socket.on('save-data', (data, callback) => {
  // Process data
  saveToDatabase(data)
    .then(() => {
      // Success callback
      callback({
        status: 'success',
        message: 'Data saved'
      });
    })
    .catch((error) => {
      // Error callback
      callback({
        status: 'error',
        message: error.message
      });
    });
});

// ===== CLIENT =====
socket.emit('save-data', { name: 'John' }, (response) => {
  if (response.status === 'success') {
    console.log('Saved successfully');
  } else {
    console.error('Save failed:', response.message);
  }
});

// ✅ With timeout
socket.timeout(5000).emit('save-data', data, (err, response) => {
  if (err) {
    console.error('Request timeout');
  } else {
    console.log('Response:', response);
  }
});
```

### 3. Event Object Structure

```javascript
// ✅ Best practice: Structured events
const EventTypes = {
  MESSAGE_SEND: 'message:send',
  MESSAGE_RECEIVE: 'message:receive',
  MESSAGE_DELETE: 'message:delete',
  USER_JOIN: 'user:join',
  USER_LEAVE: 'user:leave',
  TYPING_START: 'typing:start',
  TYPING_STOP: 'typing:stop'
};

// Server
socket.on(EventTypes.MESSAGE_SEND, (data) => {
  const message = {
    id: generateId(),
    text: data.text,
    user: socket.user,
    timestamp: Date.now()
  };
  
  io.emit(EventTypes.MESSAGE_RECEIVE, message);
});

// Client
socket.on(EventTypes.MESSAGE_RECEIVE, (message) => {
  displayMessage(message);
});
```

### 4. Event Validation

```javascript
// ✅ Validate events before processing
const Joi = require('joi');

const messageSchema = Joi.object({
  text: Joi.string().min(1).max(500).required(),
  roomId: Joi.string().required()
});

socket.on('send-message', async (data, callback) => {
  try {
    // Validate
    const { error, value } = messageSchema.validate(data);
    
    if (error) {
      callback({ error: error.details[0].message });
      return;
    }
    
    // Process valid data
    const message = await processMessage(value);
    
    callback({ success: true, message });
  } catch (err) {
    callback({ error: 'Internal error' });
  }
});
```

---

## Rooms & Namespaces

Rooms এবং Namespaces দিয়ে connections organize করা যায়।

### 1. Basic Rooms

```javascript
// ===== SERVER =====

// Join a room
socket.on('join-room', (roomId) => {
  socket.join(roomId);
  console.log(`Socket ${socket.id} joined room ${roomId}`);
  
  // Notify others in the room
  socket.to(roomId).emit('user-joined', {
    userId: socket.id,
    roomId: roomId
  });
  
  // Send to the joiner
  socket.emit('joined-room', {
    roomId: roomId,
    users: getRoomUsers(roomId)
  });
});

// Leave a room
socket.on('leave-room', (roomId) => {
  socket.leave(roomId);
  
  socket.to(roomId).emit('user-left', {
    userId: socket.id
  });
});

// Send message to room
socket.on('room-message', (data) => {
  io.to(data.roomId).emit('message', {
    text: data.text,
    user: socket.id,
    timestamp: Date.now()
  });
});

// ===== CLIENT =====
const socket = io();

// Join room
socket.emit('join-room', 'room-123');

socket.on('joined-room', (data) => {
  console.log('Joined room:', data.roomId);
  console.log('Users in room:', data.users);
});

socket.on('user-joined', (data) => {
  console.log('User joined:', data.userId);
});

// Send message to room
function sendRoomMessage(text) {
  socket.emit('room-message', {
    roomId: 'room-123',
    text: text
  });
}
```

### 2. Multiple Rooms

```javascript
// ✅ User can be in multiple rooms
socket.on('join-channels', (channels) => {
  channels.forEach(channel => {
    socket.join(channel);
  });
  
  console.log('User rooms:', socket.rooms);
  // Set { socket.id, 'room1', 'room2', 'room3' }
});

// Leave all rooms except own room
socket.on('leave-all-rooms', () => {
  socket.rooms.forEach(room => {
    if (room !== socket.id) {
      socket.leave(room);
    }
  });
});

// Get all rooms
function getAllRooms() {
  return io.sockets.adapter.rooms;
}

// Get users in a room
function getRoomUsers(roomId) {
  const room = io.sockets.adapter.rooms.get(roomId);
  return room ? Array.from(room) : [];
}
```

### 3. Namespaces

```javascript
// ===== SERVER =====

// Default namespace
io.on('connection', (socket) => {
  console.log('Connected to default namespace');
});

// Chat namespace
const chatNamespace = io.of('/chat');

chatNamespace.on('connection', (socket) => {
  console.log('Connected to chat namespace:', socket.id);
  
  socket.on('message', (data) => {
    chatNamespace.emit('new-message', data);
  });
});

// Admin namespace
const adminNamespace = io.of('/admin');

adminNamespace.use((socket, next) => {
  // Authentication middleware
  if (socket.handshake.auth.token === 'admin-token') {
    next();
  } else {
    next(new Error('Unauthorized'));
  }
});

adminNamespace.on('connection', (socket) => {
  console.log('Admin connected:', socket.id);
  
  socket.on('broadcast', (data) => {
    // Send to all namespaces
    io.emit('announcement', data);
    chatNamespace.emit('announcement', data);
  });
});

// ===== CLIENT =====

// Connect to default namespace
const socket = io();

// Connect to chat namespace
const chatSocket = io('/chat');

chatSocket.on('connect', () => {
  console.log('Connected to chat');
});

chatSocket.emit('message', { text: 'Hello!' });

// Connect to admin namespace with auth
const adminSocket = io('/admin', {
  auth: {
    token: 'admin-token'
  }
});

adminSocket.on('connect_error', (error) => {
  console.error('Auth failed:', error.message);
});
```

### 4. Dynamic Namespaces

```javascript
// ✅ Create namespaces dynamically
io.of(/^\/team-\w+$/).on('connection', (socket) => {
  const namespace = socket.nsp;
  console.log('Connected to:', namespace.name);
  
  socket.on('message', (data) => {
    namespace.emit('new-message', {
      team: namespace.name,
      ...data
    });
  });
});

// Client connects to: /team-alpha, /team-beta, etc.
const teamSocket = io('/team-alpha');
```

---

## Broadcasting Patterns

বিভিন্ন broadcasting scenarios।

### 1. Broadcasting Options

```javascript
// ===== SERVER =====

socket.on('message', (data) => {
  // 1. Send to everyone including sender
  io.emit('message', data);
  
  // 2. Send to everyone except sender
  socket.broadcast.emit('message', data);
  
  // 3. Send to specific room
  io.to('room-1').emit('message', data);
  
  // 4. Send to room except sender
  socket.to('room-1').emit('message', data);
  
  // 5. Send to multiple rooms
  socket.to('room-1').to('room-2').emit('message', data);
  
  // 6. Send to specific socket
  io.to(socketId).emit('message', data);
  
  // 7. Send to all in namespace
  io.of('/chat').emit('message', data);
  
  // 8. Send to all except specific rooms
  socket.broadcast.except('room-1').emit('message', data);
});
```

### 2. Targeted Broadcasting

```javascript
// ✅ Chat room with private messages
const users = new Map(); // socketId -> userData

io.on('connection', (socket) => {
  // Register user
  socket.on('register', (userData) => {
    users.set(socket.id, userData);
    socket.userId = userData.id;
  });
  
  // Public message to room
  socket.on('room-message', (data) => {
    io.to(data.roomId).emit('message', {
      type: 'public',
      from: users.get(socket.id),
      text: data.text,
      timestamp: Date.now()
    });
  });
  
  // Private message to specific user
  socket.on('private-message', (data) => {
    const recipientSocketId = findSocketByUserId(data.toUserId);
    
    if (recipientSocketId) {
      // Send to recipient
      io.to(recipientSocketId).emit('message', {
        type: 'private',
        from: users.get(socket.id),
        text: data.text,
        timestamp: Date.now()
      });
      
      // Send confirmation to sender
      socket.emit('message-sent', {
        to: data.toUserId,
        status: 'delivered'
      });
    }
  });
});

function findSocketByUserId(userId) {
  for (const [socketId, userData] of users) {
    if (userData.id === userId) {
      return socketId;
    }
  }
  return null;
}
```

### 3. Conditional Broadcasting

```javascript
// ✅ Broadcast based on conditions
socket.on('update-status', (status) => {
  const user = users.get(socket.id);
  user.status = status;
  
  // Broadcast to friends only
  const friendSocketIds = getFriendSocketIds(user.id);
  
  friendSocketIds.forEach(friendSocketId => {
    io.to(friendSocketId).emit('friend-status-change', {
      userId: user.id,
      status: status
    });
  });
});

// ✅ Broadcast with filters
socket.on('notification', (data) => {
  // Send to users with specific roles
  io.fetchSockets().then(sockets => {
    sockets.forEach(s => {
      const user = users.get(s.id);
      
      if (user && user.role === 'admin') {
        s.emit('notification', data);
      }
    });
  });
});
```

---

## Authentication & Authorization

Socket.io connections secure করা।

### 1. Token-based Authentication

```javascript
// ===== SERVER =====
const jwt = require('jsonwebtoken');

// Middleware for authentication
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  
  if (!token) {
    return next(new Error('Authentication error'));
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.userId = decoded.userId;
    socket.user = decoded;
    next();
  } catch (err) {
    next(new Error('Invalid token'));
  }
});

io.on('connection', (socket) => {
  console.log('Authenticated user:', socket.userId);
  
  // User is authenticated, proceed
  socket.join(`user:${socket.userId}`);
});

// ===== CLIENT =====
const token = localStorage.getItem('token');

const socket = io({
  auth: {
    token: token
  }
});

socket.on('connect_error', (error) => {
  if (error.message === 'Authentication error') {
    console.error('Please login first');
    // Redirect to login
  }
});
```

### 2. Session-based Authentication

```javascript
// ===== SERVER =====
const session = require('express-session');
const sharedsession = require('express-socket.io-session');

// Express session
const sessionMiddleware = session({
  secret: 'your-secret',
  resave: false,
  saveUninitialized: false
});

app.use(sessionMiddleware);

// Share session with Socket.io
io.use(sharedsession(sessionMiddleware, {
  autoSave: true
}));

io.on('connection', (socket) => {
  const session = socket.handshake.session;
  
  if (!session.userId) {
    socket.disconnect();
    return;
  }
  
  console.log('User from session:', session.userId);
});
```

### 3. Role-based Authorization

```javascript
// ✅ Check permissions for actions
const permissions = {
  admin: ['delete', 'ban', 'broadcast'],
  moderator: ['delete', 'mute'],
  user: ['send-message']
};

function hasPermission(socket, action) {
  const userRole = socket.user.role;
  return permissions[userRole]?.includes(action);
}

socket.on('delete-message', (messageId) => {
  if (!hasPermission(socket, 'delete')) {
    socket.emit('error', {
      message: 'Permission denied'
    });
    return;
  }
  
  // Proceed with deletion
  deleteMessage(messageId);
});

socket.on('ban-user', (userId) => {
  if (!hasPermission(socket, 'ban')) {
    socket.emit('error', {
      message: 'Only admins can ban users'
    });
    return;
  }
  
  banUser(userId);
});
```

### 4. Rate Limiting

```javascript
// ✅ Prevent spam and abuse
const rateLimit = new Map();

function checkRateLimit(socketId, limit = 10, window = 60000) {
  const now = Date.now();
  const userLimit = rateLimit.get(socketId) || { count: 0, resetTime: now + window };
  
  if (now > userLimit.resetTime) {
    userLimit.count = 0;
    userLimit.resetTime = now + window;
  }
  
  userLimit.count++;
  rateLimit.set(socketId, userLimit);
  
  return userLimit.count <= limit;
}

socket.on('send-message', (data) => {
  if (!checkRateLimit(socket.id, 10, 60000)) {
    socket.emit('error', {
      message: 'Too many messages. Please slow down.'
    });
    return;
  }
  
  // Process message
  broadcastMessage(data);
});

// Cleanup old entries periodically
setInterval(() => {
  const now = Date.now();
  
  for (const [socketId, limit] of rateLimit) {
    if (now > limit.resetTime) {
      rateLimit.delete(socketId);
    }
  }
}, 60000);
```

---

## SSE Fundamentals

Server-Sent Events (SSE) একটা simple way server থেকে client এ data push করার।

### 1. Basic SSE Server

```javascript
// server.js
const express = require('express');
const app = express();

app.use(express.static('public'));

app.get('/api/events', (req, res) => {
  // Set headers for SSE
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  
  // Send initial message
  res.write('data: Connected to SSE\n\n');
  
  // Send updates every 2 seconds
  const intervalId = setInterval(() => {
    const data = {
      timestamp: new Date().toISOString(),
      value: Math.random()
    };
    
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  }, 2000);
  
  // Cleanup on client disconnect
  req.on('close', () => {
    clearInterval(intervalId);
    console.log('Client disconnected');
  });
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
```

### 2. SSE Client

```html
<!-- public/index.html -->
<!DOCTYPE html>
<html>
<head>
  <title>SSE Demo</title>
</head>
<body>
  <h1>Server-Sent Events</h1>
  <div id="status">Disconnected</div>
  <div id="data"></div>
  
  <script>
    const eventSource = new EventSource('/api/events');
    const status = document.getElementById('status');
    const dataDiv = document.getElementById('data');
    
    eventSource.onopen = () => {
      status.textContent = 'Connected';
      status.style.color = 'green';
    };
    
    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      
      const p = document.createElement('p');
      p.textContent = `${data.timestamp}: ${data.value.toFixed(4)}`;
      dataDiv.appendChild(p);
      
      // Keep only last 10 messages
      if (dataDiv.children.length > 10) {
        dataDiv.removeChild(dataDiv.firstChild);
      }
    };
    
    eventSource.onerror = (error) => {
      console.error('SSE error:', error);
      status.textContent = 'Error';
      status.style.color = 'red';
    };
  </script>
</body>
</html>
```

### 3. Named Events

```javascript
// ===== SERVER =====
app.get('/api/events', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  
  // Send different event types
  const sendUpdate = () => {
    res.write(`event: update\ndata: ${JSON.stringify({ type: 'update' })}\n\n`);
  };
  
  const sendNotification = () => {
    res.write(`event: notification\ndata: ${JSON.stringify({ message: 'New notification' })}\n\n`);
  };
  
  const sendPing = () => {
    res.write(`event: ping\ndata: ${Date.now()}\n\n`);
  };
  
  setInterval(sendUpdate, 5000);
  setInterval(sendNotification, 10000);
  setInterval(sendPing, 30000);
  
  req.on('close', () => {
    clearInterval(sendUpdate);
    clearInterval(sendNotification);
    clearInterval(sendPing);
  });
});

// ===== CLIENT =====
const eventSource = new EventSource('/api/events');

// Listen for specific events
eventSource.addEventListener('update', (event) => {
  const data = JSON.parse(event.data);
  console.log('Update:', data);
});

eventSource.addEventListener('notification', (event) => {
  const data = JSON.parse(event.data);
  showNotification(data.message);
});

eventSource.addEventListener('ping', (event) => {
  console.log('Ping:', event.data);
});
```

### 4. SSE with Event IDs & Retry

```javascript
// ===== SERVER =====
let eventId = 0;

app.get('/api/events', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  
  // Get last event ID from client
  const lastEventId = req.headers['last-event-id'];
  
  if (lastEventId) {
    console.log('Resuming from event:', lastEventId);
    // Send missed events
  }
  
  // Set retry time (milliseconds)
  res.write('retry: 5000\n\n');
  
  const interval = setInterval(() => {
    eventId++;
    
    const event = {
      id: eventId,
      data: { message: `Event ${eventId}` },
      timestamp: Date.now()
    };
    
    // Send with ID
    res.write(`id: ${eventId}\n`);
    res.write(`data: ${JSON.stringify(event.data)}\n\n`);
  }, 2000);
  
  req.on('close', () => {
    clearInterval(interval);
  });
});

// ===== CLIENT =====
const eventSource = new EventSource('/api/events');

eventSource.onmessage = (event) => {
  console.log('Event ID:', event.lastEventId);
  console.log('Data:', event.data);
  
  // If connection drops, browser automatically
  // sends 'Last-Event-ID' header on reconnect
};
```

---

## SSE vs WebSockets

দুটোর মধ্যে পার্থক্য এবং কখন কোনটা ব্যবহার করবেন।

### 1. Feature Comparison

```javascript
/*
┌──────────────────────┬─────────────┬─────────────┐
│ Feature              │ WebSocket   │ SSE         │
├──────────────────────┼─────────────┼─────────────┤
│ Direction            │ Bi-direct   │ Server→Client│
│ Protocol             │ ws://       │ HTTP        │
│ Browser Support      │ Excellent   │ Excellent   │
│ Auto Reconnect       │ Manual      │ Automatic   │
│ Event IDs            │ Manual      │ Built-in    │
│ Text Only            │ No (Binary) │ Yes         │
│ Compression          │ Yes         │ Yes         │
│ HTTP/2 Multiplexing  │ No          │ Yes         │
│ Firewall Friendly    │ Sometimes   │ Always      │
│ Complexity           │ Medium      │ Simple      │
├──────────────────────┼─────────────┼─────────────┤
│ Best For             │ Chat, Games │ Feeds, News │
└──────────────────────┴─────────────┴─────────────┘
*/
```

### 2. When to Use What

```javascript
// ✅ Use WebSocket when:
// - Bi-directional communication needed
// - Real-time chat, gaming
// - Low latency required
// - Binary data (images, files)
const chatSocket = io();

// ✅ Use SSE when:
// - Only server-to-client updates
// - News feeds, notifications
// - Stock tickers, sports scores
// - Simple implementation needed
const feedSource = new EventSource('/api/feed');
```

### 3. Practical Example - Live Score Updates

```javascript
// ===== Using SSE (Better for this case) =====

// Server
app.get('/api/scores', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  
  const sendScore = async () => {
    const scores = await getLatestScores();
    res.write(`data: ${JSON.stringify(scores)}\n\n`);
  };
  
  const interval = setInterval(sendScore, 5000);
  
  req.on('close', () => clearInterval(interval));
});

// Client
const scores = new EventSource('/api/scores');

scores.onmessage = (event) => {
  const data = JSON.parse(event.data);
  updateScoreboard(data);
};

// Auto reconnect on error
scores.onerror = () => {
  console.log('Connection lost, reconnecting...');
  // Browser automatically reconnects!
};
```

---

## Scalability & Load Balancing

Multiple servers এ Socket.io scale করা।

### 1. The Problem

```javascript
// ❌ Problem: With multiple servers

/*
┌─────────────┐       ┌─────────────┐
│  Server 1   │       │  Server 2   │
│  Users: A,B │       │  Users: C,D │
└─────────────┘       └─────────────┘

User A sends message → Only Server 1 users see it
User C won't receive the message (on Server 2)
*/
```

### 2. Solution: Redis Adapter

```bash
npm install @socket.io/redis-adapter redis
```

```javascript
// server.js
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const { createAdapter } = require('@socket.io/redis-adapter');
const { createClient } = require('redis');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Create Redis clients
const pubClient = createClient({ url: 'redis://localhost:6379' });
const subClient = pubClient.duplicate();

Promise.all([pubClient.connect(), subClient.connect()]).then(() => {
  io.adapter(createAdapter(pubClient, subClient));
  console.log('Redis adapter connected');
});

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  
  socket.on('message', (data) => {
    // This will broadcast across ALL servers
    io.emit('message', data);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

### 3. Load Balancer Setup (Nginx)

```nginx
# nginx.conf
upstream socketio_backend {
    # Use IP hash for sticky sessions
    ip_hash;
    
    server localhost:3000;
    server localhost:3001;
    server localhost:3002;
}

server {
    listen 80;
    
    location /socket.io/ {
        proxy_pass http://socketio_backend;
        proxy_http_version 1.1;
        
        # WebSocket headers
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        
        # Timeouts
        proxy_connect_timeout 7d;
        proxy_send_timeout 7d;
        proxy_read_timeout 7d;
    }
}
```

### 4. Sticky Sessions

```javascript
// ✅ Enable sticky sessions in Socket.io
const io = new Server(server, {
  transports: ['websocket', 'polling'],
  allowEIO3: true, // Enable Engine.IO v3 for sticky sessions
  cookie: {
    name: 'io',
    path: '/',
    httpOnly: true,
    sameSite: 'lax'
  }
});

// With PM2
/*
{
  "apps": [{
    "name": "socket-server",
    "script": "./server.js",
    "instances": 4,
    "exec_mode": "cluster"
  }]
}
*/
```

---

## Redis Adapter for Multi-server

Redis adapter দিয়ে multiple servers sync করা।

### 1. Complete Setup

```javascript
// server.js
const { Server } = require('socket.io');
const { createAdapter } = require('@socket.io/redis-adapter');
const { createClient } = require('redis');

const io = new Server(server, {
  adapter: createAdapter(pubClient, subClient)
});

// Track server info
const SERVER_ID = process.env.SERVER_ID || 'server-1';

io.on('connection', (socket) => {
  console.log(`[${SERVER_ID}] User connected:`, socket.id);
  
  // Join user to their personal room
  socket.join(`user:${socket.userId}`);
  
  // Broadcast to all servers
  socket.on('global-message', (data) => {
    io.emit('message', {
      ...data,
      serverId: SERVER_ID
    });
  });
  
  // Send to specific user across servers
  socket.on('private-message', (data) => {
    io.to(`user:${data.toUserId}`).emit('message', {
      from: socket.userId,
      text: data.text,
      serverId: SERVER_ID
    });
  });
});
```

### 2. Redis Pub/Sub Pattern

```javascript
// ✅ Manual Redis pub/sub for custom logic
const redis = require('redis');

const publisher = redis.createClient();
const subscriber = redis.createClient();

await publisher.connect();
await subscriber.connect();

// Subscribe to channels
await subscriber.subscribe('notifications', (message) => {
  const data = JSON.parse(message);
  
  // Broadcast to local clients
  io.emit('notification', data);
});

// Publish from any server
socket.on('send-notification', async (data) => {
  await publisher.publish('notifications', JSON.stringify({
    message: data.message,
    serverId: SERVER_ID,
    timestamp: Date.now()
  }));
});
```

### 3. Cluster Communication

```javascript
// ✅ Server-to-server messages
io.of('/').adapter.on('create-room', (room) => {
  console.log(`Room ${room} was created`);
});

io.of('/').adapter.on('delete-room', (room) => {
  console.log(`Room ${room} was deleted`);
});

io.of('/').adapter.on('join-room', (room, id) => {
  console.log(`Socket ${id} joined room ${room}`);
});

io.of('/').adapter.on('leave-room', (room, id) => {
  console.log(`Socket ${id} left room ${room}`);
});

// Get all sockets across all servers
const sockets = await io.fetchSockets();
console.log(`Total connected: ${sockets.length}`);

// Get sockets in a room across all servers
const roomSockets = await io.in('room-1').fetchSockets();
console.log(`Users in room-1: ${roomSockets.length}`);
```

---

## Performance Optimization

Socket.io applications এর performance optimize করা।

### 1. Connection Optimization

```javascript
// ✅ Optimize connection settings
const io = new Server(server, {
  // Only use WebSocket (skip polling)
  transports: ['websocket'],
  
  // Reduce ping/pong overhead
  pingInterval: 30000,  // 30 seconds
  pingTimeout: 60000,   // 60 seconds
  
  // Compression
  perMessageDeflate: {
    threshold: 1024 // Only compress messages > 1KB
  },
  
  // Max payload size
  maxHttpBufferSize: 1e6, // 1MB
  
  // Disable upgrade
  allowUpgrades: false
});
```

### 2. Message Batching

```javascript
// ✅ Batch multiple messages
class MessageBatcher {
  constructor(io, interval = 100) {
    this.io = io;
    this.interval = interval;
    this.batches = new Map();
    
    setInterval(() => this.flush(), interval);
  }
  
  add(room, event, data) {
    const key = `${room}:${event}`;
    
    if (!this.batches.has(key)) {
      this.batches.set(key, []);
    }
    
    this.batches.get(key).push(data);
  }
  
  flush() {
    for (const [key, messages] of this.batches) {
      if (messages.length === 0) continue;
      
      const [room, event] = key.split(':');
      
      this.io.to(room).emit(event, messages);
      
      messages.length = 0;
    }
  }
}

// Usage
const batcher = new MessageBatcher(io, 100);

socket.on('position-update', (data) => {
  // Instead of emitting immediately
  // io.to('game-room').emit('player-move', data);
  
  // Batch it
  batcher.add('game-room', 'player-moves', data);
  // Will send all moves together every 100ms
});
```

### 3. Binary Data Optimization

```javascript
// ✅ Send binary data efficiently
socket.on('send-image', (data) => {
  // Convert to Buffer for efficient transmission
  const buffer = Buffer.from(data.image, 'base64');
  
  socket.broadcast.emit('image', buffer);
});

// Client
socket.on('image', (buffer) => {
  const blob = new Blob([buffer], { type: 'image/jpeg' });
  const url = URL.createObjectURL(blob);
  displayImage(url);
});
```

### 4. Memory Management

```javascript
// ✅ Clean up inactive connections
const activeConnections = new Map();

io.on('connection', (socket) => {
  activeConnections.set(socket.id, {
    connectedAt: Date.now(),
    lastActivity: Date.now()
  });
  
  socket.on('activity', () => {
    const conn = activeConnections.get(socket.id);
    if (conn) {
      conn.lastActivity = Date.now();
    }
  });
  
  socket.on('disconnect', () => {
    activeConnections.delete(socket.id);
  });
});

// Disconnect inactive users
setInterval(() => {
  const now = Date.now();
  const timeout = 30 * 60 * 1000; // 30 minutes
  
  for (const [socketId, conn] of activeConnections) {
    if (now - conn.lastActivity > timeout) {
      const socket = io.sockets.sockets.get(socketId);
      if (socket) {
        socket.disconnect(true);
      }
      activeConnections.delete(socketId);
    }
  }
}, 60000); // Check every minute
```

---

## Security Best Practices

Socket.io applications secure করার উপায়।

### 1. Input Validation & Sanitization

```javascript
const Joi = require('joi');
const DOMPurify = require('isomorphic-dompurify');

// Validation schemas
const schemas = {
  message: Joi.object({
    text: Joi.string().min(1).max(1000).required(),
    roomId: Joi.string().alphanum().required()
  }),
  
  profile: Joi.object({
    name: Joi.string().min(2).max(50).required(),
    bio: Joi.string().max(200).optional()
  })
};

socket.on('send-message', async (data, callback) => {
  // Validate
  const { error, value } = schemas.message.validate(data);
  
  if (error) {
    callback({ error: error.details[0].message });
    return;
  }
  
  // Sanitize
  const sanitized = {
    text: DOMPurify.sanitize(value.text),
    roomId: value.roomId
  };
  
  // Process
  await saveMessage(sanitized);
  
  callback({ success: true });
});
```

### 2. XSS Protection

```javascript
// ✅ Prevent XSS attacks
const xss = require('xss');

socket.on('chat-message', (data) => {
  // Clean HTML
  const cleanText = xss(data.text, {
    whiteList: {},          // No HTML tags allowed
    stripIgnoreTag: true,
    stripIgnoreTagBody: ['script']
  });
  
  io.to(data.roomId).emit('message', {
    user: socket.user.name,
    text: cleanText,
    timestamp: Date.now()
  });
});
```

### 3. Rate Limiting Advanced

```javascript
// ✅ Advanced rate limiting
class RateLimiter {
  constructor(options = {}) {
    this.limits = options.limits || {
      message: { max: 10, window: 60000 },
      join: { max: 5, window: 300000 }
    };
    this.violations = new Map();
  }
  
  check(socketId, action) {
    const limit = this.limits[action];
    if (!limit) return true;
    
    const key = `${socketId}:${action}`;
    const now = Date.now();
    const record = this.violations.get(key) || {
      count: 0,
      resetTime: now + limit.window,
      violations: 0
    };
    
    if (now > record.resetTime) {
      record.count = 0;
      record.resetTime = now + limit.window;
    }
    
    record.count++;
    
    if (record.count > limit.max) {
      record.violations++;
      
      // Ban after 3 violations
      if (record.violations >= 3) {
        return 'banned';
      }
      
      this.violations.set(key, record);
      return false;
    }
    
    this.violations.set(key, record);
    return true;
  }
}

const limiter = new RateLimiter();

socket.on('send-message', (data) => {
  const allowed = limiter.check(socket.id, 'message');
  
  if (allowed === 'banned') {
    socket.emit('error', { message: 'You have been banned' });
    socket.disconnect(true);
    return;
  }
  
  if (!allowed) {
    socket.emit('error', { message: 'Rate limit exceeded' });
    return;
  }
  
  // Process message
});
```

### 4. CORS Security

```javascript
// ✅ Strict CORS configuration
const io = new Server(server, {
  cors: {
    origin: (origin, callback) => {
      const allowedOrigins = [
        'https://myapp.com',
        'https://www.myapp.com'
      ];
      
      if (!origin) {
        // Allow requests with no origin (mobile apps, curl, etc.)
        callback(null, true);
        return;
      }
      
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ['GET', 'POST'],
    credentials: true,
    allowedHeaders: ['Authorization']
  }
});
```

### 5. SQL/NoSQL Injection Prevention

```javascript
// ✅ Prevent injection attacks
socket.on('search-users', async (query, callback) => {
  // BAD: String concatenation
  // const users = await db.query(`SELECT * FROM users WHERE name = '${query}'`);
  
  // GOOD: Parameterized query
  const users = await db.query(
    'SELECT * FROM users WHERE name = $1',
    [query]
  );
  
  callback({ users });
});

// MongoDB with Mongoose (safe by default)
socket.on('find-post', async (data, callback) => {
  // Safe - Mongoose escapes
  const post = await Post.findOne({ title: data.title });
  
  callback({ post });
});
```

---

## Error Handling & Reconnection

Errors handle এবং automatic reconnection।

### 1. Client-side Error Handling

```javascript
// ===== CLIENT =====
const socket = io({
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  randomizationFactor: 0.5
});

// Connection events
socket.on('connect', () => {
  console.log('Connected:', socket.id);
  updateStatus('Connected');
});

socket.on('disconnect', (reason) => {
  console.log('Disconnected:', reason);
  updateStatus('Disconnected');
  
  if (reason === 'io server disconnect') {
    // Server forced disconnect, manually reconnect
    socket.connect();
  }
});

socket.on('connect_error', (error) => {
  console.error('Connection error:', error.message);
  updateStatus('Connection error');
});

socket.on('reconnect', (attemptNumber) => {
  console.log('Reconnected after', attemptNumber, 'attempts');
  updateStatus('Reconnected');
});

socket.on('reconnect_attempt', (attemptNumber) => {
  console.log('Reconnection attempt:', attemptNumber);
  updateStatus(`Reconnecting... (${attemptNumber})`);
});

socket.on('reconnect_failed', () => {
  console.error('Reconnection failed');
  updateStatus('Connection failed');
});

socket.on('error', (error) => {
  console.error('Socket error:', error);
});
```

### 2. Server-side Error Handling

```javascript
// ===== SERVER =====

// Global error handler
io.engine.on('connection_error', (err) => {
  console.error('Connection error:', {
    code: err.code,
    message: err.message,
    context: err.context
  });
});

io.on('connection', (socket) => {
  // Socket-specific error handler
  socket.on('error', (error) => {
    console.error('Socket error:', socket.id, error);
  });
  
  // Catch-all for unhandled events
  socket.onAny((eventName, ...args) => {
    console.log('Event:', eventName, 'Args:', args);
  });
  
  // Validation error wrapper
  socket.use(([event, ...args], next) => {
    try {
      // Validate event
      if (typeof event !== 'string') {
        throw new Error('Invalid event type');
      }
      
      next();
    } catch (err) {
      next(err);
    }
  });
});
```

### 3. Graceful Degradation

```javascript
// ✅ Handle connection issues gracefully
class ConnectionManager {
  constructor(socket) {
    this.socket = socket;
    this.messageQueue = [];
    this.isConnected = false;
    
    socket.on('connect', () => {
      this.isConnected = true;
      this.flushQueue();
    });
    
    socket.on('disconnect', () => {
      this.isConnected = false;
    });
  }
  
  send(event, data) {
    if (this.isConnected) {
      this.socket.emit(event, data);
    } else {
      // Queue messages while offline
      this.messageQueue.push({ event, data });
      
      // Limit queue size
      if (this.messageQueue.length > 100) {
        this.messageQueue.shift();
      }
    }
  }
  
  flushQueue() {
    while (this.messageQueue.length > 0) {
      const { event, data } = this.messageQueue.shift();
      this.socket.emit(event, data);
    }
  }
}

// Usage
const manager = new ConnectionManager(socket);

// Always works, queues if offline
manager.send('message', { text: 'Hello' });
```

### 4. Heartbeat & Health Check

```javascript
// ===== SERVER =====
const HEARTBEAT_INTERVAL = 30000;
const HEARTBEAT_TIMEOUT = 60000;

io.on('connection', (socket) => {
  socket.isAlive = true;
  socket.lastHeartbeat = Date.now();
  
  socket.on('pong', () => {
    socket.isAlive = true;
    socket.lastHeartbeat = Date.now();
  });
  
  const heartbeat = setInterval(() => {
    if (!socket.isAlive) {
      console.log('Client not responding:', socket.id);
      socket.disconnect(true);
      clearInterval(heartbeat);
      return;
    }
    
    socket.isAlive = false;
    socket.emit('ping');
  }, HEARTBEAT_INTERVAL);
  
  socket.on('disconnect', () => {
    clearInterval(heartbeat);
  });
});

// ===== CLIENT =====
socket.on('ping', () => {
  socket.emit('pong');
});
```

---

## Production Deployment Patterns

Production environment এ Socket.io deploy করার best practices।

### 1. Complete Production Server

```javascript
// server.js
require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const helmet = require('helmet');
const cors = require('cors');
const compression = require('compression');
const { createAdapter } = require('@socket.io/redis-adapter');
const { createClient } = require('redis');

const app = express();
const server = http.createServer(app);

// Security
app.use(helmet());
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || [],
  credentials: true
}));

// Compression
app.use(compression());

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    uptime: process.uptime(),
    connections: io.engine.clientsCount,
    memory: process.memoryUsage(),
    timestamp: Date.now()
  });
});

// Socket.io with Redis
const io = new Server(server, {
  transports: ['websocket'],
  cors: {
    origin: process.env.ALLOWED_ORIGINS?.split(','),
    credentials: true
  },
  pingTimeout: 60000,
  pingInterval: 25000
});

// Setup Redis adapter
if (process.env.REDIS_URL) {
  const pubClient = createClient({ url: process.env.REDIS_URL });
  const subClient = pubClient.duplicate();
  
  Promise.all([pubClient.connect(), subClient.connect()])
    .then(() => {
      io.adapter(createAdapter(pubClient, subClient));
      console.log('✅ Redis adapter connected');
    })
    .catch(err => {
      console.error('❌ Redis adapter error:', err);
    });
}

// Authentication middleware
io.use(async (socket, next) => {
  try {
    const token = socket.handshake.auth.token;
    
    if (!token) {
      throw new Error('Authentication required');
    }
    
    const user = await verifyToken(token);
    socket.user = user;
    next();
  } catch (err) {
    next(new Error('Authentication failed'));
  }
});

// Connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.user.id);
  
  // Join user's personal room
  socket.join(`user:${socket.user.id}`);
  
  // Event handlers
  require('./handlers/chatHandler')(io, socket);
  require('./handlers/notificationHandler')(io, socket);
  
  socket.on('disconnect', (reason) => {
    console.log('User disconnected:', socket.user.id, reason);
  });
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, closing server...');
  
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
```

### 2. PM2 Ecosystem File

```javascript
// ecosystem.config.js
module.exports = {
  apps: [{
    name: 'socket-server',
    script: './server.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 3000,
      REDIS_URL: 'redis://localhost:6379',
      ALLOWED_ORIGINS: 'https://myapp.com,https://www.myapp.com'
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true,
    autorestart: true,
    max_restarts: 10,
    min_uptime: '10s'
  }]
};
```

### 3. Docker Setup

```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy source
COPY . .

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD node healthcheck.js || exit 1

EXPOSE 3000

CMD ["node", "server.js"]
```

```yaml
# docker-compose.yml
version: '3.8'

services:
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    command: redis-server --appendonly yes

  socket-server:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - REDIS_URL=redis://redis:6379
      - ALLOWED_ORIGINS=https://myapp.com
    depends_on:
      - redis
    restart: unless-stopped
    deploy:
      replicas: 3
      resources:
        limits:
          cpus: '0.5'
          memory: 512M

volumes:
  redis_data:
```

### 4. Monitoring & Logging

```javascript
// logger.js
const winston = require('winston');

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'socket-server' },
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

module.exports = logger;

// Usage in server
const logger = require('./logger');

io.on('connection', (socket) => {
  logger.info('User connected', {
    socketId: socket.id,
    userId: socket.user?.id,
    ip: socket.handshake.address
  });
  
  socket.on('error', (error) => {
    logger.error('Socket error', {
      socketId: socket.id,
      error: error.message,
      stack: error.stack
    });
  });
});
```

### 5. Metrics & Analytics

```javascript
// metrics.js
class Metrics {
  constructor() {
    this.stats = {
      connections: 0,
      messages: 0,
      errors: 0,
      rooms: new Map()
    };
    
    // Report every minute
    setInterval(() => this.report(), 60000);
  }
  
  trackConnection(socketId) {
    this.stats.connections++;
  }
  
  trackMessage(roomId) {
    this.stats.messages++;
    
    const count = this.stats.rooms.get(roomId) || 0;
    this.stats.rooms.set(roomId, count + 1);
  }
  
  trackError() {
    this.stats.errors++;
  }
  
  report() {
    console.log('📊 Metrics:', {
      totalConnections: this.stats.connections,
      totalMessages: this.stats.messages,
      totalErrors: this.stats.errors,
      activeRooms: this.stats.rooms.size,
      topRooms: Array.from(this.stats.rooms.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
    });
    
    // Send to monitoring service (Datadog, New Relic, etc.)
    // sendToMonitoring(this.stats);
  }
  
  reset() {
    this.stats.messages = 0;
    this.stats.errors = 0;
  }
}

module.exports = new Metrics();
```

---

এই comprehensive guide এ Real-time Communication এর সব fundamental থেকে production-level advanced concepts cover করা হয়েছে। WebSockets, Socket.io, এবং SSE এর complete knowledge দিয়ে আপনি professional real-time applications তৈরি করতে পারবেন! 🚀
