# Streaming Data (স্ট্রিমিং ডেটা)

## Streaming কী?

**Streaming** হলো data **একটু একটু করে** process ও পাঠানো — পুরো data একবারে memory-তে না রেখে ছোট ছোট **chunk**-এ ভেঙে কাজ করা।

```
Without Streaming (Buffering):
  পুরো file memory-তে load → process → পাঠাও
  [====== 500MB file ======] → RAM-এ ধরবে না! 💥

With Streaming:
  একটু একটু করে পড়ো → process করো → পাঠাও
  [=chunk=] → process → send → [=chunk=] → process → send → ...
  Memory-তে একবারে শুধু একটা chunk থাকে (যেমন 64KB)
```

> **বাস্তব উদাহরণ:** YouTube video দেখার সময় পুরো video download হয় না — একটু একটু করে আসে আর play হয়। এটাই streaming।

---

## কেন Streaming দরকার?

### Buffering-এর সমস্যা

```javascript
// ❌ Buffering — পুরো file memory-তে load
const fs = require("fs");

app.get("/api/download", (req, res) => {
  const data = fs.readFileSync("large-file.csv"); // 500MB RAM-এ!
  res.send(data);
});

// 100 users একসাথে request করলে:
// 100 × 500MB = 50GB RAM দরকার! → Server crash 💥
```

### Streaming-এর সমাধান

```javascript
// ✅ Streaming — একটু একটু করে পাঠাও
app.get("/api/download", (req, res) => {
  const stream = fs.createReadStream("large-file.csv");
  stream.pipe(res);
});

// 100 users একসাথে request করলে:
// 100 × 64KB = 6.4MB RAM! → Server ঠিকই চলে ✅
```

```
Feature            Buffering              Streaming
──────────────────────────────────────────────────────
Memory             পুরো data load         ছোট chunk
First Byte         সব load হলে            প্রায় সঙ্গে সঙ্গে
Large Files        Memory overflow         কোনো সমস্যা নেই
User Experience    অনেকক্ষণ wait          তাড়াতাড়ি দেখা শুরু
Scalability        কম users handle         অনেক users handle
```

---

## Node.js Streams

Node.js-এ 4 ধরনের stream আছে:

### 1. Readable Stream (পড়ার stream)

Data **source** থেকে পড়ে:

```javascript
const fs = require("fs");

// File থেকে readable stream
const readStream = fs.createReadStream("data.txt", {
  encoding: "utf8",
  highWaterMark: 64 * 1024, // 64KB chunk size
});

readStream.on("data", (chunk) => {
  console.log(`Received ${chunk.length} bytes`);
});

readStream.on("end", () => {
  console.log("File reading complete");
});

readStream.on("error", (err) => {
  console.error("Read error:", err);
});
```

### 2. Writable Stream (লেখার stream)

Data **destination**-এ লেখে:

```javascript
const writeStream = fs.createWriteStream("output.txt");

writeStream.write("Hello ");
writeStream.write("World\n");
writeStream.write("From streaming!");
writeStream.end(); // লেখা শেষ

writeStream.on("finish", () => {
  console.log("Writing complete");
});
```

### 3. Duplex Stream (পড়া + লেখা)

একই সাথে পড়া ও লেখা যায়:

```javascript
const net = require("net");

// TCP socket is a Duplex stream
const server = net.createServer((socket) => {
  // socket থেকে পড়া যায় (Readable)
  socket.on("data", (data) => {
    console.log("Received:", data.toString());
  });

  // socket-এ লেখা যায় (Writable)
  socket.write("Hello from server\n");
});
```

### 4. Transform Stream (পড়া → রূপান্তর → লেখা)

Data পড়ে, modify করে, আবার বের করে:

```javascript
const { Transform } = require("stream");

const upperCase = new Transform({
  transform(chunk, encoding, callback) {
    this.push(chunk.toString().toUpperCase());
    callback();
  },
});

// pipe: readable → transform → writable
fs.createReadStream("input.txt")
  .pipe(upperCase)
  .pipe(fs.createWriteStream("output.txt"));
```

```
Stream Types:
─────────────────────────────────────────────
Readable    → Source (file read, HTTP request)
Writable    → Destination (file write, HTTP response)
Duplex      → Both (TCP socket, WebSocket)
Transform   → Modify data passing through (compression, encryption)
```

---

## pipe() — Stream চেইন করা

`pipe()` হলো এক stream-এর output অন্য stream-এর input-এ connect করা:

```javascript
readable.pipe(transform).pipe(writable);
```

```
readStream.pipe(gzip).pipe(writeStream)

  ┌──────────┐     ┌──────────┐     ┌───────────┐
  │ Read File │ ──→ │  Gzip    │ ──→ │ Write File│
  │ (chunks)  │     │ Compress │     │ (.gz)     │
  └──────────┘     └──────────┘     └───────────┘
```

### File Copy (Streaming)

```javascript
// ❌ Buffering — পুরো file memory-তে
const data = fs.readFileSync("source.mp4");
fs.writeFileSync("dest.mp4", data);

// ✅ Streaming — memory-efficient
fs.createReadStream("source.mp4")
  .pipe(fs.createWriteStream("dest.mp4"))
  .on("finish", () => console.log("Copy done!"));
```

### Compressed File Download

```javascript
const zlib = require("zlib");

app.get("/api/logs/download", (req, res) => {
  res.setHeader("Content-Type", "application/gzip");
  res.setHeader("Content-Disposition", 'attachment; filename="logs.txt.gz"');

  fs.createReadStream("logs/app.log")
    .pipe(zlib.createGzip()) // compress করো
    .pipe(res); // client-এ পাঠাও
});
```

### pipeline() — Better Error Handling

`pipe()` error properly handle করে না। `pipeline()` ব্যবহার করো:

```javascript
const { pipeline } = require("stream/promises");

app.get("/api/download", async (req, res) => {
  try {
    await pipeline(
      fs.createReadStream("large-data.csv"),
      zlib.createGzip(),
      res,
    );
  } catch (err) {
    console.error("Pipeline failed:", err);
    if (!res.headersSent) {
      res.status(500).json({ error: "Download failed" });
    }
  }
});
```

---

## HTTP Streaming

### Streaming Response to Client

```javascript
// Large JSON array stream করা
app.get("/api/users/export", async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.write("[\n");

  const cursor = User.find().cursor();
  let first = true;

  for await (const user of cursor) {
    if (!first) res.write(",\n");
    res.write(
      JSON.stringify({
        id: user._id,
        name: user.name,
        email: user.email,
      }),
    );
    first = false;
  }

  res.write("\n]");
  res.end();
});
```

### CSV Export (Streaming)

```javascript
app.get("/api/users/csv", async (req, res) => {
  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", 'attachment; filename="users.csv"');

  // Header row
  res.write("ID,Name,Email,Created At\n");

  const cursor = User.find().cursor();

  for await (const user of cursor) {
    res.write(`${user._id},${user.name},${user.email},${user.createdAt}\n`);
  }

  res.end();
});

// 1 million users export → Memory-তে 1M object load হবে না
// একটা একটা করে database থেকে আনবে, CSV row লিখবে, পাঠাবে
```

### Server-Sent Events (SSE)

Server থেকে client-এ continuous data stream:

```javascript
app.get("/api/events", (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  const sendEvent = (data) => {
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  };

  // প্রতি সেকেন্ডে update পাঠাও
  const interval = setInterval(() => {
    sendEvent({
      time: new Date().toISOString(),
      cpu: Math.random() * 100,
      memory: Math.random() * 100,
    });
  }, 1000);

  req.on("close", () => {
    clearInterval(interval);
  });
});

// Client-side:
// const eventSource = new EventSource('/api/events');
// eventSource.onmessage = (e) => console.log(JSON.parse(e.data));
```

### Chunked Transfer Encoding

```javascript
app.get("/api/progress", (req, res) => {
  res.setHeader("Transfer-Encoding", "chunked");

  let step = 0;
  const total = 10;

  const interval = setInterval(() => {
    step++;
    res.write(
      JSON.stringify({ step, total, progress: (step / total) * 100 }) + "\n",
    );

    if (step >= total) {
      clearInterval(interval);
      res.end();
    }
  }, 500);
});
```

---

## Database Streaming

### MongoDB Cursor Streaming

```javascript
// ❌ সব data একবারে memory-তে
const users = await User.find(); // 1M users → 1M objects in RAM!
res.json(users);

// ✅ Cursor দিয়ে streaming
const cursor = User.find().cursor();

for await (const user of cursor) {
  // একটা একটা করে process
}

// বা stream হিসেবে pipe
const cursor = User.find().cursor();
cursor.pipe(transformStream).pipe(res);
```

### PostgreSQL Streaming (Cursor)

```javascript
const { Pool } = require("pg");
const QueryStream = require("pg-query-stream");

const pool = new Pool();

app.get("/api/export", async (req, res) => {
  const client = await pool.connect();

  try {
    const query = new QueryStream("SELECT * FROM users");
    const stream = client.query(query);

    res.setHeader("Content-Type", "application/json");
    res.write("[\n");

    let first = true;
    stream.on("data", (row) => {
      if (!first) res.write(",\n");
      res.write(JSON.stringify(row));
      first = false;
    });

    stream.on("end", () => {
      res.write("\n]");
      res.end();
      client.release();
    });

    stream.on("error", (err) => {
      console.error(err);
      client.release();
      if (!res.headersSent) res.status(500).end();
    });
  } catch (err) {
    client.release();
    throw err;
  }
});
```

### Prisma Streaming

```javascript
// Prisma doesn't have native streaming, use pagination:
async function* streamUsers(batchSize = 1000) {
  let skip = 0;

  while (true) {
    const users = await prisma.user.findMany({
      take: batchSize,
      skip,
      orderBy: { id: "asc" },
    });

    if (users.length === 0) break;

    for (const user of users) {
      yield user;
    }

    skip += batchSize;
  }
}

// Usage
for await (const user of streamUsers()) {
  // process one at a time
}
```

---

## File Processing Streams

### Large File Line-by-Line Processing

```javascript
const readline = require("readline");

async function processLargeFile(filepath) {
  const stream = fs.createReadStream(filepath);
  const rl = readline.createInterface({ input: stream });

  let lineCount = 0;

  for await (const line of rl) {
    lineCount++;
    // প্রতিটি line process করো
    // 10GB file হলেও memory-তে একবারে একটাই line থাকবে
  }

  console.log(`Processed ${lineCount} lines`);
}
```

### CSV Parsing (Streaming)

```bash
npm install csv-parser
```

```javascript
const csv = require("csv-parser");

function importCSV(filepath) {
  return new Promise((resolve, reject) => {
    const results = [];
    let processed = 0;

    fs.createReadStream(filepath)
      .pipe(csv())
      .on("data", async (row) => {
        processed++;

        // Batch insert (প্রতি 1000 row-এ)
        results.push(row);
        if (results.length >= 1000) {
          await User.insertMany(results.splice(0));
          console.log(`Imported ${processed} rows`);
        }
      })
      .on("end", async () => {
        if (results.length > 0) {
          await User.insertMany(results);
        }
        console.log(`Import complete: ${processed} rows`);
        resolve(processed);
      })
      .on("error", reject);
  });
}
```

### JSON Streaming (Large JSON Files)

```bash
npm install JSONStream
```

```javascript
const JSONStream = require("JSONStream");

// 1GB JSON file parse করো — memory-তে পুরো load না করে
fs.createReadStream("huge-data.json")
  .pipe(JSONStream.parse("users.*")) // users array-র প্রতিটি item
  .on("data", (user) => {
    // একটা একটা user process করো
    console.log(user.name);
  })
  .on("end", () => {
    console.log("Done parsing");
  });
```

---

## Video/Audio Streaming

### Range Requests (Partial Content)

Browser video/audio player range request পাঠায় — পুরো file না, নির্দিষ্ট অংশ চায়:

```javascript
app.get("/api/video/:filename", (req, res) => {
  const filepath = path.join("videos", req.params.filename);
  const stat = fs.statSync(filepath);
  const fileSize = stat.size;

  const range = req.headers.range;

  if (range) {
    // Range request: "bytes=32324-"
    const parts = range.replace(/bytes=/, "").split("-");
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
    const chunkSize = end - start + 1;

    res.writeHead(206, {
      "Content-Range": `bytes ${start}-${end}/${fileSize}`,
      "Accept-Ranges": "bytes",
      "Content-Length": chunkSize,
      "Content-Type": "video/mp4",
    });

    fs.createReadStream(filepath, { start, end }).pipe(res);
  } else {
    // পুরো file
    res.writeHead(200, {
      "Content-Length": fileSize,
      "Content-Type": "video/mp4",
    });

    fs.createReadStream(filepath).pipe(res);
  }
});
```

```
Browser: "আমাকে 0-1MB দাও"      → Server: 206 Partial Content (0-1MB)
Browser: "এখন 1MB-2MB দাও"       → Server: 206 Partial Content (1-2MB)
User seeks to 50%:
Browser: "25MB থেকে দাও"          → Server: 206 Partial Content (25MB-)

→ User পুরো video download ছাড়াই যেকোনো জায়গায় seek করতে পারে!
```

---

## Streaming AI/LLM Responses

ChatGPT-style token-by-token streaming:

```javascript
app.post("/api/chat", async (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");

  const stream = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [{ role: "user", content: req.body.message }],
    stream: true,
  });

  for await (const chunk of stream) {
    const content = chunk.choices[0]?.delta?.content;
    if (content) {
      res.write(`data: ${JSON.stringify({ content })}\n\n`);
    }
  }

  res.write("data: [DONE]\n\n");
  res.end();
});
```

```javascript
// Client-side:
const response = await fetch("/api/chat", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ message: "Hello AI" }),
});

const reader = response.body.getReader();
const decoder = new TextDecoder();

while (true) {
  const { done, value } = await reader.read();
  if (done) break;

  const text = decoder.decode(value);
  const lines = text.split("\n").filter((l) => l.startsWith("data: "));

  for (const line of lines) {
    const data = line.replace("data: ", "");
    if (data === "[DONE]") break;
    const { content } = JSON.parse(data);
    document.getElementById("output").textContent += content;
  }
}
```

---

## Python Streaming

### FastAPI Streaming Response

```python
from fastapi import FastAPI
from fastapi.responses import StreamingResponse
import asyncio

app = FastAPI()

async def generate_data():
    for i in range(100):
        yield f"data: {{'step': {i}, 'total': 100}}\n\n"
        await asyncio.sleep(0.1)

@app.get("/api/stream")
async def stream():
    return StreamingResponse(
        generate_data(),
        media_type="text/event-stream"
    )
```

### File Download Streaming

```python
from fastapi.responses import StreamingResponse
from pathlib import Path

@app.get("/api/download/{filename}")
async def download_file(filename: str):
    filepath = Path("files") / filename

    def file_iterator():
        with open(filepath, "rb") as f:
            while chunk := f.read(64 * 1024):  # 64KB chunks
                yield chunk

    return StreamingResponse(
        file_iterator(),
        media_type="application/octet-stream",
        headers={"Content-Disposition": f"attachment; filename={filename}"}
    )
```

### Database Streaming (SQLAlchemy)

```python
from sqlalchemy import select

@app.get("/api/users/export")
async def export_users():
    async def generate():
        yield "["
        first = True
        async with async_session() as session:
            result = await session.stream(select(User))
            async for row in result:
                user = row[0]
                if not first:
                    yield ","
                yield json.dumps({"id": user.id, "name": user.name})
                first = False
        yield "]"

    return StreamingResponse(generate(), media_type="application/json")
```

---

## Backpressure

Readable stream যত দ্রুত data produce করে, Writable stream তত দ্রুত consume নাও করতে পারে। **Backpressure** হলো "slow down" signal:

```
Fast Reader → → → → → → → →  Slow Writer
(1GB/s)      [buffer full!]   (100MB/s)

Backpressure ছাড়া → Buffer বাড়তেই থাকে → Memory overflow!
Backpressure সহ   → Reader slow down করে → Memory stable
```

```javascript
// pipe() automatically backpressure handle করে
readable.pipe(writable);

// Manual backpressure handling:
readable.on("data", (chunk) => {
  const canContinue = writable.write(chunk);

  if (!canContinue) {
    readable.pause(); // Reader-কে থামাও

    writable.once("drain", () => {
      readable.resume(); // Writer ready → Reader চালু করো
    });
  }
});
```

```
pipe() ব্যবহার করলে backpressure automatic।
Manual stream handling করলে drain event listen করো।

readable.pause() → data পড়া বন্ধ
writable 'drain' → buffer খালি, আবার লেখা যাবে
readable.resume() → data পড়া চালু
```

---

## Web Streams API (Browser + Node.js)

Node.js-এর পুরোনো stream ছাড়াও নতুন **Web Streams API** আছে:

```javascript
// ReadableStream তৈরি
const stream = new ReadableStream({
  start(controller) {
    controller.enqueue("Hello ");
    controller.enqueue("World");
    controller.close();
  },
});

// TransformStream
const upper = new TransformStream({
  transform(chunk, controller) {
    controller.enqueue(chunk.toUpperCase());
  },
});

// Chain
const result = stream.pipeThrough(upper);

// Read
const reader = result.getReader();
while (true) {
  const { done, value } = await reader.read();
  if (done) break;
  console.log(value); // "HELLO " then "WORLD"
}
```

---

## Streaming Use Cases Summary

```
Use Case                    Streaming Pattern
───────────────────────────────────────────────────
Large file download         ReadStream → pipe → Response
Large file upload           Request → pipe → WriteStream/S3
CSV/JSON export             DB Cursor → Transform → Response
Video/Audio playback        Range Request → Partial Content (206)
Real-time updates           SSE (text/event-stream)
AI/LLM responses            SSE token-by-token
Log tailing                 ReadStream (follow mode)
File processing             ReadStream → Transform → WriteStream
Data migration              Source DB → Transform → Target DB
Compression                 ReadStream → Gzip → WriteStream
```

---

## সংক্ষেপে মনে রাখার সূত্র

```
Streaming = Data একটু একটু করে process করা (chunk by chunk)
Buffering = পুরো data একবারে memory-তে load

Node.js 4 Stream Types:
  Readable   → Source (fs.createReadStream)
  Writable   → Destination (fs.createWriteStream, res)
  Duplex     → Both (TCP socket)
  Transform  → Modify (gzip, encrypt)

pipe() → এক stream-এর output অন্যটার input
pipeline() → pipe() + proper error handling

HTTP Streaming:
  res.write(chunk) → একটু একটু করে পাঠাও
  Transfer-Encoding: chunked → automatic

Database Streaming:
  MongoDB cursor → for await (const doc of cursor)
  PostgreSQL → pg-query-stream

Video Streaming:
  Range Header → 206 Partial Content → Seek support

Backpressure:
  Reader fast, Writer slow → pause() → drain → resume()
  pipe() automatic handle করে

Golden Rule:
  বড় data → ALWAYS stream
  ছোট data → buffer ঠিক আছে
  Memory-তে ধরবে না → streaming must
```

---

## Interview Golden Lines

> **Streaming processes data in chunks without loading everything into memory — essential for handling large files and high concurrency.**

> **Node.js has 4 stream types: Readable (source), Writable (destination), Duplex (both), and Transform (modify).**

> **pipe() connects streams and automatically handles backpressure — when the writer is slow, it signals the reader to pause.**

> **Video streaming uses HTTP Range Requests (206 Partial Content) — the client requests specific byte ranges for seeking.**

> **For database exports, use cursors instead of loading all records — stream rows one at a time to keep memory constant.**

> **pipeline() is preferred over pipe() because it properly propagates errors and cleans up all streams on failure.**
