# Streams & Buffers - সম্পূর্ণ Advanced Guide

Node.js এর সবচেয়ে powerful features হলো Streams এবং Buffers। এই guide এ আপনি শিখবেন কিভাবে efficiently large data handle করতে হয়।

## 📑 Table of Contents

### Core Concepts
1. [Stream কি এবং কেন ব্যবহার করা হয়](#stream-কি-এবং-কেন-ব্যবহার-করা-হয়)
2. [Buffer Operations](#buffer-operations)

### Stream Types
3. [Readable Streams](#readable-streams)
4. [Writable Streams](#writable-streams)
5. [Duplex Streams](#duplex-streams)
6. [Transform Streams](#transform-streams)

### Stream Operations
7. [Pipe Method](#pipe-method)
8. [Stream Events](#stream-events)
9. [Backpressure Handling](#backpressure-handling)

### Advanced Topics
10. [Custom Stream Implementation](#custom-stream-implementation)
11. [Stream Composition & Pipelines](#stream-composition--pipelines)
12. [Stream Performance Optimization](#stream-performance-optimization)
13. [Stream Error Handling](#stream-error-handling)
14. [Large File Processing](#large-file-processing)
15. [Production Streaming Patterns](#production-streaming-patterns)

---

## Stream কি এবং কেন ব্যবহার করা হয়

Streams হলো data handling এর একটা efficient method যেখানে data chunks আকারে process হয়।

### 1. কেন Streams দরকার?

```javascript
const fs = require('fs');

// ❌ BAD: পুরো file memory তে load
function readFileBad(filename) {
  const data = fs.readFileSync(filename);
  console.log('File size:', data.length);
  // 1GB file = 1GB RAM usage!
}

// ✅ GOOD: Stream ব্যবহার করে chunks এ read
function readFileGood(filename) {
  const stream = fs.createReadStream(filename);
  let size = 0;
  
  stream.on('data', (chunk) => {
    size += chunk.length;
    console.log('Received chunk:', chunk.length);
  });
  
  stream.on('end', () => {
    console.log('Total size:', size);
  });
  
  // 1GB file = ~64KB RAM usage at a time!
}
```

### 2. Stream এর সুবিধা

```javascript
// Memory Efficiency Comparison
const fs = require('fs');

// Without Stream - High Memory
function copyWithoutStream(source, dest) {
  const data = fs.readFileSync(source);
  fs.writeFileSync(dest, data);
  // Peak memory: File size
}

// With Stream - Low Memory
function copyWithStream(source, dest) {
  const readStream = fs.createReadStream(source);
  const writeStream = fs.createWriteStream(dest);
  
  readStream.pipe(writeStream);
  // Peak memory: ~64KB (chunk size)
}

// Performance test
console.time('Without Stream');
copyWithoutStream('large-file.mp4', 'copy1.mp4');
console.timeEnd('Without Stream');

console.time('With Stream');
copyWithStream('large-file.mp4', 'copy2.mp4');
console.timeEnd('With Stream');
```

### 3. Stream Types Overview

```javascript
const { Readable, Writable, Duplex, Transform } = require('stream');

// 1. Readable - শুধু read করা যায়
const readable = new Readable({
  read() {
    this.push('Hello ');
    this.push('World!');
    this.push(null); // End signal
  }
});

// 2. Writable - শুধু write করা যায়
const writable = new Writable({
  write(chunk, encoding, callback) {
    console.log('Writing:', chunk.toString());
    callback();
  }
});

// 3. Duplex - Read এবং Write উভয়ই
const duplex = new Duplex({
  read() {
    this.push('Reading data');
    this.push(null);
  },
  write(chunk, encoding, callback) {
    console.log('Writing:', chunk.toString());
    callback();
  }
});

// 4. Transform - Read করে transform করে Write করে
const transform = new Transform({
  transform(chunk, encoding, callback) {
    const upperCase = chunk.toString().toUpperCase();
    this.push(upperCase);
    callback();
  }
});

// Usage
readable.pipe(transform).pipe(writable);
```

---

## Buffer Operations

Buffers হলো raw binary data handle করার way।

### 1. Buffer Creation

```javascript
// ✅ Different ways to create Buffer

// 1. From string
const buf1 = Buffer.from('Hello World', 'utf-8');
console.log(buf1); // <Buffer 48 65 6c 6c 6f 20 57 6f 72 6c 64>

// 2. Allocate empty buffer
const buf2 = Buffer.alloc(10); // 10 bytes, filled with 0
console.log(buf2); // <Buffer 00 00 00 00 00 00 00 00 00 00>

// 3. Unsafe allocation (faster but uninitialized)
const buf3 = Buffer.allocUnsafe(10);
// Contains random data, must be filled before use

// 4. From array
const buf4 = Buffer.from([72, 101, 108, 108, 111]);
console.log(buf4.toString()); // "Hello"

// 5. From another buffer
const buf5 = Buffer.from(buf1);
```

### 2. Buffer Reading & Writing

```javascript
const buf = Buffer.alloc(20);

// ✅ Writing to buffer
buf.write('Hello', 0, 'utf-8');
buf.write('World', 6, 'utf-8');

console.log(buf.toString()); // "Hello World"

// ✅ Reading from buffer
const slice = buf.slice(0, 5);
console.log(slice.toString()); // "Hello"

// ✅ Individual byte access
console.log(buf[0]); // 72 (ASCII code for 'H')
buf[0] = 104; // Change to 'h'
console.log(buf.toString('utf-8', 0, 5)); // "hello"
```

### 3. Buffer Concatenation

```javascript
// ✅ Combining multiple buffers
const buf1 = Buffer.from('Hello ');
const buf2 = Buffer.from('World');
const buf3 = Buffer.from('!');

const combined = Buffer.concat([buf1, buf2, buf3]);
console.log(combined.toString()); // "Hello World!"

// ✅ With total length
const combined2 = Buffer.concat([buf1, buf2], 10);
console.log(combined2.toString()); // "Hello Worl" (truncated)
```

### 4. Buffer Comparison

```javascript
const buf1 = Buffer.from('ABC');
const buf2 = Buffer.from('ABC');
const buf3 = Buffer.from('BCD');

// ✅ Compare buffers
console.log(buf1.equals(buf2)); // true
console.log(buf1.equals(buf3)); // false

console.log(buf1.compare(buf3)); // -1 (buf1 < buf3)
console.log(buf3.compare(buf1)); // 1 (buf3 > buf1)
console.log(buf1.compare(buf2)); // 0 (equal)
```

### 5. Buffer Encoding

```javascript
const text = 'Hello World! 🚀';

// ✅ Different encodings
const utf8 = Buffer.from(text, 'utf-8');
const base64 = Buffer.from(text, 'utf-8').toString('base64');
const hex = Buffer.from(text, 'utf-8').toString('hex');

console.log('UTF-8:', utf8);
console.log('Base64:', base64);
console.log('Hex:', hex);

// Decode back
console.log(Buffer.from(base64, 'base64').toString('utf-8'));
console.log(Buffer.from(hex, 'hex').toString('utf-8'));
```

### 6. Buffer Performance Tips

```javascript
// ❌ BAD: Creating many small buffers
function badBufferUsage() {
  const buffers = [];
  for (let i = 0; i < 1000; i++) {
    buffers.push(Buffer.from(`Item ${i}`));
  }
  return Buffer.concat(buffers);
}

// ✅ GOOD: Pre-allocate buffer
function goodBufferUsage() {
  const buf = Buffer.alloc(10000);
  let offset = 0;
  
  for (let i = 0; i < 1000; i++) {
    const str = `Item ${i}`;
    offset += buf.write(str, offset);
  }
  
  return buf.slice(0, offset);
}
```

---

## Readable Streams

Data source থেকে read করার streams।

### 1. Basic Readable Stream

```javascript
const { Readable } = require('stream');

// ✅ Simple readable stream
const readable = new Readable({
  read(size) {
    // Called when consumer is ready for data
    if (this.currentCharCode > 90) {
      this.push(null); // No more data
      return;
    }
    
    this.push(String.fromCharCode(this.currentCharCode++));
  }
});

readable.currentCharCode = 65; // Start with 'A'

// Consume the stream
readable.on('data', (chunk) => {
  console.log('Received:', chunk.toString());
});

readable.on('end', () => {
  console.log('Stream ended');
});
```

### 2. File Reading Stream

```javascript
const fs = require('fs');

// ✅ Read file with stream
const readStream = fs.createReadStream('large-file.txt', {
  encoding: 'utf-8',
  highWaterMark: 64 * 1024 // 64KB chunks
});

let totalSize = 0;

readStream.on('data', (chunk) => {
  totalSize += chunk.length;
  console.log(`Received ${chunk.length} bytes`);
});

readStream.on('end', () => {
  console.log(`Total: ${totalSize} bytes`);
});

readStream.on('error', (err) => {
  console.error('Error:', err);
});
```

### 3. Pausing & Resuming

```javascript
const fs = require('fs');

const stream = fs.createReadStream('file.txt');

stream.on('data', (chunk) => {
  console.log('Received chunk:', chunk.length);
  
  // Pause to process data
  stream.pause();
  
  // Simulate async processing
  setTimeout(() => {
    console.log('Processing complete, resuming...');
    stream.resume();
  }, 1000);
});
```

### 4. Readable Stream Modes

```javascript
const { Readable } = require('stream');

const readable = new Readable({
  read() {}
});

// Mode 1: Flowing mode (automatic)
readable.on('data', (chunk) => {
  console.log('Flowing:', chunk.toString());
});

// Mode 2: Paused mode (manual)
const readable2 = new Readable({
  read() {}
});

readable2.on('readable', () => {
  let chunk;
  while ((chunk = readable2.read()) !== null) {
    console.log('Paused mode:', chunk.toString());
  }
});

// Push data
readable.push('Hello');
readable.push(null);

readable2.push('World');
readable2.push(null);
```

### 5. Creating Data Generator Stream

```javascript
const { Readable } = require('stream');

class NumberStream extends Readable {
  constructor(max) {
    super();
    this.current = 0;
    this.max = max;
  }
  
  _read() {
    if (this.current <= this.max) {
      this.push(this.current.toString() + '\n');
      this.current++;
    } else {
      this.push(null);
    }
  }
}

// Usage
const numbers = new NumberStream(10);

numbers.on('data', (chunk) => {
  console.log('Number:', chunk.toString().trim());
});
```

### 6. HTTP Response as Readable Stream

```javascript
const https = require('https');

// ✅ Streaming HTTP response
https.get('https://api.example.com/large-data', (res) => {
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
    console.log(`Received ${chunk.length} bytes`);
  });
  
  res.on('end', () => {
    console.log('Download complete');
    console.log('Total size:', data.length);
  });
});
```

---

## Writable Streams

Data destination এ write করার streams।

### 1. Basic Writable Stream

```javascript
const { Writable } = require('stream');

// ✅ Simple writable stream
const writable = new Writable({
  write(chunk, encoding, callback) {
    console.log('Writing:', chunk.toString());
    callback(); // Signal write complete
  }
});

writable.write('Hello ');
writable.write('World!');
writable.end(); // Signal end

writable.on('finish', () => {
  console.log('All writes complete');
});
```

### 2. File Writing Stream

```javascript
const fs = require('fs');

// ✅ Write to file with stream
const writeStream = fs.createWriteStream('output.txt');

writeStream.write('Line 1\n');
writeStream.write('Line 2\n');
writeStream.write('Line 3\n');

writeStream.end('Final line\n');

writeStream.on('finish', () => {
  console.log('File written successfully');
});

writeStream.on('error', (err) => {
  console.error('Write error:', err);
});
```

### 3. Custom Logger Stream

```javascript
const { Writable } = require('stream');
const fs = require('fs');

class LoggerStream extends Writable {
  constructor(filename) {
    super();
    this.filename = filename;
    this.fd = null;
  }
  
  _construct(callback) {
    fs.open(this.filename, 'a', (err, fd) => {
      if (err) {
        callback(err);
      } else {
        this.fd = fd;
        callback();
      }
    });
  }
  
  _write(chunk, encoding, callback) {
    const timestamp = new Date().toISOString();
    const log = `[${timestamp}] ${chunk.toString()}\n`;
    
    fs.write(this.fd, log, callback);
  }
  
  _final(callback) {
    fs.close(this.fd, callback);
  }
}

// Usage
const logger = new LoggerStream('app.log');

logger.write('Application started');
logger.write('User logged in');
logger.end('Application stopped');
```

### 4. Writing with Backpressure Awareness

```javascript
const fs = require('fs');

const writeStream = fs.createWriteStream('output.txt');

function writeMillionRows() {
  let i = 1000000;
  
  function write() {
    let ok = true;
    
    do {
      i--;
      const data = `Row ${i}\n`;
      
      if (i === 0) {
        // Last write
        writeStream.write(data);
      } else {
        // Check if internal buffer is full
        ok = writeStream.write(data);
      }
    } while (i > 0 && ok);
    
    if (i > 0) {
      // Buffer full, wait for drain
      writeStream.once('drain', write);
    }
  }
  
  write();
}

writeMillionRows();

writeStream.on('finish', () => {
  console.log('All rows written');
});
```

### 5. Multiple Destinations

```javascript
const fs = require('fs');

class MultiWriter extends Writable {
  constructor(destinations) {
    super();
    this.destinations = destinations;
  }
  
  _write(chunk, encoding, callback) {
    const writes = this.destinations.map(dest => 
      new Promise((resolve, reject) => {
        dest.write(chunk, (err) => {
          if (err) reject(err);
          else resolve();
        });
      })
    );
    
    Promise.all(writes)
      .then(() => callback())
      .catch(callback);
  }
  
  _final(callback) {
    const closes = this.destinations.map(dest =>
      new Promise((resolve) => {
        dest.end(resolve);
      })
    );
    
    Promise.all(closes).then(() => callback());
  }
}

// Usage: Write to both file and console
const fileStream = fs.createWriteStream('output.txt');
const consoleStream = new Writable({
  write(chunk, encoding, callback) {
    console.log(chunk.toString());
    callback();
  }
});

const multi = new MultiWriter([fileStream, consoleStream]);

multi.write('This goes to both destinations\n');
multi.end('Final message\n');
```

---

## Duplex Streams

Read এবং Write উভয় operation support করে।

### 1. Basic Duplex Stream

```javascript
const { Duplex } = require('stream');

// ✅ Simple duplex stream
const duplex = new Duplex({
  read(size) {
    if (this.currentCharCode > 90) {
      this.push(null);
      return;
    }
    this.push(String.fromCharCode(this.currentCharCode++));
  },
  
  write(chunk, encoding, callback) {
    console.log('Received:', chunk.toString());
    callback();
  }
});

duplex.currentCharCode = 65;

// Read from it
duplex.on('data', (chunk) => {
  console.log('Reading:', chunk.toString());
});

// Write to it
duplex.write('Hello ');
duplex.write('World!');
duplex.end();
```

### 2. TCP Socket Example

```javascript
const net = require('net');

// TCP server (duplex streams)
const server = net.createServer((socket) => {
  console.log('Client connected');
  
  // Socket is a duplex stream
  socket.write('Welcome to the server!\n');
  
  socket.on('data', (data) => {
    console.log('Received:', data.toString());
    socket.write(`Echo: ${data}`);
  });
  
  socket.on('end', () => {
    console.log('Client disconnected');
  });
});

server.listen(3000, () => {
  console.log('Server listening on port 3000');
});

// Client
const client = net.connect({ port: 3000 }, () => {
  console.log('Connected to server');
  client.write('Hello Server!');
});

client.on('data', (data) => {
  console.log('Server says:', data.toString());
  client.end();
});
```

### 3. Custom Duplex Stream

```javascript
const { Duplex } = require('stream');

class EchoStream extends Duplex {
  constructor(options) {
    super(options);
    this.buffer = [];
  }
  
  _write(chunk, encoding, callback) {
    // Store incoming data
    this.buffer.push(chunk);
    callback();
  }
  
  _read(size) {
    // Send stored data back
    if (this.buffer.length > 0) {
      const chunk = this.buffer.shift();
      this.push(chunk);
    }
  }
}

// Usage
const echo = new EchoStream();

echo.on('data', (chunk) => {
  console.log('Echo received:', chunk.toString());
});

echo.write('Hello');
echo.write('World');
```

---

## Transform Streams

Data transform করে output দেয়।

### 1. Basic Transform Stream

```javascript
const { Transform } = require('stream');

// ✅ Uppercase transformer
const upperCase = new Transform({
  transform(chunk, encoding, callback) {
    const transformed = chunk.toString().toUpperCase();
    this.push(transformed);
    callback();
  }
});

// Usage
process.stdin
  .pipe(upperCase)
  .pipe(process.stdout);
```

### 2. CSV to JSON Transform

```javascript
const { Transform } = require('stream');

class CSVToJSON extends Transform {
  constructor(options) {
    super(options);
    this.headers = null;
    this.isFirstLine = true;
  }
  
  _transform(chunk, encoding, callback) {
    const lines = chunk.toString().split('\n');
    
    for (const line of lines) {
      if (!line.trim()) continue;
      
      if (this.isFirstLine) {
        this.headers = line.split(',').map(h => h.trim());
        this.isFirstLine = false;
      } else {
        const values = line.split(',').map(v => v.trim());
        const obj = {};
        
        this.headers.forEach((header, i) => {
          obj[header] = values[i];
        });
        
        this.push(JSON.stringify(obj) + '\n');
      }
    }
    
    callback();
  }
}

// Usage
const fs = require('fs');

fs.createReadStream('data.csv')
  .pipe(new CSVToJSON())
  .pipe(fs.createWriteStream('data.json'));
```

### 3. Data Encryption Transform

```javascript
const { Transform } = require('stream');
const crypto = require('crypto');

class EncryptStream extends Transform {
  constructor(password) {
    super();
    const key = crypto.scryptSync(password, 'salt', 32);
    this.cipher = crypto.createCipheriv('aes-256-cbc', key, Buffer.alloc(16, 0));
  }
  
  _transform(chunk, encoding, callback) {
    const encrypted = this.cipher.update(chunk);
    this.push(encrypted);
    callback();
  }
  
  _flush(callback) {
    const final = this.cipher.final();
    this.push(final);
    callback();
  }
}

class DecryptStream extends Transform {
  constructor(password) {
    super();
    const key = crypto.scryptSync(password, 'salt', 32);
    this.decipher = crypto.createDecipheriv('aes-256-cbc', key, Buffer.alloc(16, 0));
  }
  
  _transform(chunk, encoding, callback) {
    const decrypted = this.decipher.update(chunk);
    this.push(decrypted);
    callback();
  }
  
  _flush(callback) {
    const final = this.decipher.final();
    this.push(final);
    callback();
  }
}

// Usage: Encrypt file
const fs = require('fs');

fs.createReadStream('secret.txt')
  .pipe(new EncryptStream('my-password'))
  .pipe(fs.createWriteStream('secret.encrypted'));

// Decrypt file
fs.createReadStream('secret.encrypted')
  .pipe(new DecryptStream('my-password'))
  .pipe(fs.createWriteStream('secret.decrypted.txt'));
```

### 4. Compression Transform

```javascript
const { Transform } = require('stream');
const zlib = require('zlib');
const fs = require('fs');

// ✅ Compress file
fs.createReadStream('large-file.txt')
  .pipe(zlib.createGzip())
  .pipe(fs.createWriteStream('large-file.txt.gz'));

// ✅ Decompress file
fs.createReadStream('large-file.txt.gz')
  .pipe(zlib.createGunzip())
  .pipe(fs.createWriteStream('large-file-decompressed.txt'));

// ✅ Custom compression with progress
class CompressWithProgress extends Transform {
  constructor(options) {
    super(options);
    this.bytesProcessed = 0;
    this.gzip = zlib.createGzip();
    
    this.gzip.on('data', (chunk) => {
      this.push(chunk);
    });
  }
  
  _transform(chunk, encoding, callback) {
    this.bytesProcessed += chunk.length;
    console.log(`Compressed ${this.bytesProcessed} bytes`);
    
    this.gzip.write(chunk, callback);
  }
  
  _flush(callback) {
    this.gzip.end();
    this.gzip.on('end', callback);
  }
}

// Usage
fs.createReadStream('file.txt')
  .pipe(new CompressWithProgress())
  .pipe(fs.createWriteStream('file.txt.gz'));
```

### 5. JSON Line Parser

```javascript
const { Transform } = require('stream');

class JSONLineParser extends Transform {
  constructor(options) {
    super({ ...options, objectMode: true });
  }
  
  _transform(chunk, encoding, callback) {
    const lines = chunk.toString().split('\n');
    
    for (const line of lines) {
      if (line.trim()) {
        try {
          const obj = JSON.parse(line);
          this.push(obj);
        } catch (err) {
          console.error('Parse error:', err.message);
        }
      }
    }
    
    callback();
  }
}

// Usage
const fs = require('fs');

fs.createReadStream('logs.jsonl')
  .pipe(new JSONLineParser())
  .on('data', (obj) => {
    console.log('Parsed object:', obj);
  });
```

---

## Pipe Method

Streams কে connect করার সবচেয়ে simple way।

### 1. Basic Piping

```javascript
const fs = require('fs');

// ✅ Simple file copy
fs.createReadStream('input.txt')
  .pipe(fs.createWriteStream('output.txt'));

// ✅ With event handling
const readStream = fs.createReadStream('input.txt');
const writeStream = fs.createWriteStream('output.txt');

readStream.pipe(writeStream);

writeStream.on('finish', () => {
  console.log('Copy complete!');
});

readStream.on('error', (err) => {
  console.error('Read error:', err);
});

writeStream.on('error', (err) => {
  console.error('Write error:', err);
});
```

### 2. Multiple Pipes (Chain)

```javascript
const fs = require('fs');
const zlib = require('zlib');
const { Transform } = require('stream');

// ✅ Chain multiple transformations
const upperCase = new Transform({
  transform(chunk, encoding, callback) {
    this.push(chunk.toString().toUpperCase());
    callback();
  }
});

fs.createReadStream('input.txt')
  .pipe(upperCase)              // Transform to uppercase
  .pipe(zlib.createGzip())      // Compress
  .pipe(fs.createWriteStream('output.txt.gz')); // Write
```

### 3. Pipe to Multiple Destinations

```javascript
const fs = require('fs');

const readStream = fs.createReadStream('input.txt');

// ✅ Pipe to multiple destinations
readStream.pipe(fs.createWriteStream('copy1.txt'));
readStream.pipe(fs.createWriteStream('copy2.txt'));
readStream.pipe(process.stdout);
```

### 4. Conditional Piping

```javascript
const fs = require('fs');
const { Transform } = require('stream');

class FilterStream extends Transform {
  constructor(filterFn) {
    super();
    this.filterFn = filterFn;
  }
  
  _transform(chunk, encoding, callback) {
    const line = chunk.toString();
    
    if (this.filterFn(line)) {
      this.push(chunk);
    }
    
    callback();
  }
}

// ✅ Filter and pipe
const readline = require('readline');

const rl = readline.createInterface({
  input: fs.createReadStream('logs.txt'),
  crlfDelay: Infinity
});

const errorStream = fs.createWriteStream('errors.txt');
const infoStream = fs.createWriteStream('info.txt');

rl.on('line', (line) => {
  if (line.includes('ERROR')) {
    errorStream.write(line + '\n');
  } else if (line.includes('INFO')) {
    infoStream.write(line + '\n');
  }
});
```

### 5. Pipeline (Better Error Handling)

```javascript
const { pipeline } = require('stream');
const fs = require('fs');
const zlib = require('zlib');

// ✅ Pipeline with automatic error handling
pipeline(
  fs.createReadStream('input.txt'),
  zlib.createGzip(),
  fs.createWriteStream('output.txt.gz'),
  (err) => {
    if (err) {
      console.error('Pipeline failed:', err);
    } else {
      console.log('Pipeline succeeded');
    }
  }
);

// ✅ With promises
const { pipeline } = require('stream/promises');

async function compressFile(input, output) {
  try {
    await pipeline(
      fs.createReadStream(input),
      zlib.createGzip(),
      fs.createWriteStream(output)
    );
    console.log('Compression complete');
  } catch (err) {
    console.error('Compression failed:', err);
  }
}

compressFile('large-file.txt', 'large-file.txt.gz');
```

---

## Stream Events

Streams বিভিন্ন events emit করে যা handle করা যায়।

### 1. Readable Stream Events

```javascript
const fs = require('fs');

const readable = fs.createReadStream('file.txt');

// ✅ All readable stream events
readable.on('open', (fd) => {
  console.log('File opened, descriptor:', fd);
});

readable.on('ready', () => {
  console.log('Stream is ready');
});

readable.on('data', (chunk) => {
  console.log('Data received:', chunk.length, 'bytes');
});

readable.on('end', () => {
  console.log('No more data');
});

readable.on('close', () => {
  console.log('Stream closed');
});

readable.on('error', (err) => {
  console.error('Error:', err);
});

readable.on('pause', () => {
  console.log('Stream paused');
});

readable.on('resume', () => {
  console.log('Stream resumed');
});
```

### 2. Writable Stream Events

```javascript
const fs = require('fs');

const writable = fs.createWriteStream('output.txt');

// ✅ All writable stream events
writable.on('open', (fd) => {
  console.log('File opened for writing');
});

writable.on('drain', () => {
  console.log('Buffer drained, ready for more data');
});

writable.on('finish', () => {
  console.log('All writes completed');
});

writable.on('close', () => {
  console.log('Stream closed');
});

writable.on('error', (err) => {
  console.error('Write error:', err);
});

writable.on('pipe', (src) => {
  console.log('Something is piping into this writable');
});

writable.on('unpipe', (src) => {
  console.log('Something stopped piping');
});
```

### 3. Custom Event Handling

```javascript
const { Readable } = require('stream');
const EventEmitter = require('events');

class DataStream extends Readable {
  constructor(options) {
    super(options);
    this.dataCount = 0;
  }
  
  _read() {
    if (this.dataCount < 10) {
      const data = `Data chunk ${this.dataCount}\n`;
      this.push(data);
      this.dataCount++;
      
      // Emit custom event
      this.emit('progress', {
        current: this.dataCount,
        total: 10,
        percent: (this.dataCount / 10) * 100
      });
    } else {
      this.push(null);
      this.emit('complete');
    }
  }
}

// Usage
const stream = new DataStream();

stream.on('progress', (info) => {
  console.log(`Progress: ${info.percent}%`);
});

stream.on('complete', () => {
  console.log('Stream complete!');
});

stream.on('data', () => {
  // Consume data
});
```

### 4. Error Propagation

```javascript
const fs = require('fs');
const { Transform } = require('stream');

// ✅ Proper error handling in pipeline
const upperCase = new Transform({
  transform(chunk, encoding, callback) {
    try {
      const result = chunk.toString().toUpperCase();
      callback(null, result);
    } catch (err) {
      callback(err);
    }
  }
});

const readStream = fs.createReadStream('input.txt');
const writeStream = fs.createWriteStream('output.txt');

readStream
  .on('error', (err) => {
    console.error('Read error:', err);
    writeStream.destroy(err);
  })
  .pipe(upperCase)
  .on('error', (err) => {
    console.error('Transform error:', err);
    writeStream.destroy(err);
  })
  .pipe(writeStream)
  .on('error', (err) => {
    console.error('Write error:', err);
  })
  .on('finish', () => {
    console.log('Success!');
  });
```

---

## Backpressure Handling

Stream buffer full হলে backpressure handle করা।

### 1. Understanding Backpressure

```javascript
const fs = require('fs');

// ❌ BAD: Ignoring backpressure
function badWrite() {
  const writeStream = fs.createWriteStream('output.txt');
  
  for (let i = 0; i < 1000000; i++) {
    writeStream.write(`Line ${i}\n`);
    // Buffer might overflow!
  }
  
  writeStream.end();
}

// ✅ GOOD: Handling backpressure
function goodWrite() {
  const writeStream = fs.createWriteStream('output.txt');
  let i = 0;
  
  function write() {
    let ok = true;
    
    do {
      i++;
      const data = `Line ${i}\n`;
      
      if (i >= 1000000) {
        writeStream.write(data);
        break;
      } else {
        ok = writeStream.write(data);
      }
    } while (ok && i < 1000000);
    
    if (i < 1000000) {
      // Buffer full, wait for drain
      writeStream.once('drain', write);
    } else {
      writeStream.end();
    }
  }
  
  write();
}

goodWrite();
```

### 2. Custom Backpressure Handler

```javascript
const { Writable } = require('stream');

class BackpressureAwareWriter extends Writable {
  constructor(destination, options) {
    super(options);
    this.destination = destination;
    this.bufferedWrites = 0;
    this.maxBufferedWrites = 100;
  }
  
  _write(chunk, encoding, callback) {
    this.bufferedWrites++;
    
    const canContinue = this.destination.write(chunk);
    
    if (!canContinue) {
      console.log('Backpressure detected, pausing...');
      this.destination.once('drain', () => {
        console.log('Drained, resuming...');
        this.bufferedWrites = 0;
        callback();
      });
    } else {
      callback();
    }
  }
}

// Usage
const fs = require('fs');

const destination = fs.createWriteStream('output.txt');
const writer = new BackpressureAwareWriter(destination);

for (let i = 0; i < 100000; i++) {
  writer.write(`Line ${i}\n`);
}

writer.end();
```

### 3. Rate Limiting Stream

```javascript
const { Transform } = require('stream');

class RateLimitStream extends Transform {
  constructor(bytesPerSecond) {
    super();
    this.bytesPerSecond = bytesPerSecond;
    this.bytesWritten = 0;
    this.startTime = Date.now();
  }
  
  _transform(chunk, encoding, callback) {
    this.bytesWritten += chunk.length;
    const elapsed = (Date.now() - this.startTime) / 1000;
    const expectedBytes = this.bytesPerSecond * elapsed;
    
    if (this.bytesWritten > expectedBytes) {
      // Slow down
      const delay = ((this.bytesWritten - expectedBytes) / this.bytesPerSecond) * 1000;
      
      setTimeout(() => {
        this.push(chunk);
        callback();
      }, delay);
    } else {
      this.push(chunk);
      callback();
    }
  }
}

// Usage: Limit to 1MB/s
const fs = require('fs');

fs.createReadStream('large-file.txt')
  .pipe(new RateLimitStream(1024 * 1024)) // 1MB/s
  .pipe(fs.createWriteStream('output.txt'));
```

### 4. Buffer Monitoring

```javascript
const { Writable } = require('stream');

class MonitoredWriter extends Writable {
  constructor(options) {
    super(options);
    this.writeCalls = 0;
    this.drainEvents = 0;
    this.totalBytesWritten = 0;
  }
  
  _write(chunk, encoding, callback) {
    this.writeCalls++;
    this.totalBytesWritten += chunk.length;
    
    // Simulate slow write
    setTimeout(() => {
      console.log(`Write #${this.writeCalls}: ${chunk.length} bytes`);
      console.log(`Buffer length: ${this.writableLength}`);
      console.log(`High water mark: ${this.writableHighWaterMark}`);
      console.log(`Needs drain: ${this.writableNeedDrain}`);
      console.log('---');
      
      callback();
    }, 100);
  }
  
  _final(callback) {
    console.log('\n=== Statistics ===');
    console.log(`Total writes: ${this.writeCalls}`);
    console.log(`Total bytes: ${this.totalBytesWritten}`);
    console.log(`Drain events: ${this.drainEvents}`);
    callback();
  }
}

const writer = new MonitoredWriter();

writer.on('drain', () => {
  writer.drainEvents++;
  console.log('>>> DRAIN EVENT <<<\n');
});

// Write data rapidly
for (let i = 0; i < 20; i++) {
  const canContinue = writer.write(`Data chunk ${i}\n`);
  
  if (!canContinue) {
    console.log(`Write ${i}: Backpressure!`);
  }
}

writer.end();
```

---

## Custom Stream Implementation

নিজের custom streams তৈরি করা।

### 1. Custom Readable Stream (Database Query)

```javascript
const { Readable } = require('stream');

class DatabaseQueryStream extends Readable {
  constructor(query, options) {
    super({ ...options, objectMode: true });
    this.query = query;
    this.offset = 0;
    this.limit = 100;
    this.done = false;
  }
  
  async _read() {
    if (this.done) {
      this.push(null);
      return;
    }
    
    try {
      // Simulate database query
      const results = await this.fetchBatch();
      
      if (results.length === 0) {
        this.done = true;
        this.push(null);
      } else {
        for (const row of results) {
          this.push(row);
        }
        this.offset += results.length;
      }
    } catch (err) {
      this.destroy(err);
    }
  }
  
  async fetchBatch() {
    // Simulate async database query
    return new Promise((resolve) => {
      setTimeout(() => {
        const results = [];
        const batchSize = Math.min(this.limit, 1000 - this.offset);
        
        for (let i = 0; i < batchSize; i++) {
          results.push({
            id: this.offset + i,
            name: `User ${this.offset + i}`,
            email: `user${this.offset + i}@example.com`
          });
        }
        
        resolve(results);
      }, 100);
    });
  }
}

// Usage
const userStream = new DatabaseQueryStream('SELECT * FROM users');

userStream.on('data', (user) => {
  console.log('User:', user);
});

userStream.on('end', () => {
  console.log('All users fetched');
});
```

### 2. Custom Writable Stream (Database Insert)

```javascript
const { Writable } = require('stream');

class DatabaseInsertStream extends Writable {
  constructor(tableName, options) {
    super({ ...options, objectMode: true });
    this.tableName = tableName;
    this.batch = [];
    this.batchSize = 100;
    this.insertCount = 0;
  }
  
  _write(record, encoding, callback) {
    this.batch.push(record);
    
    if (this.batch.length >= this.batchSize) {
      this.flush()
        .then(() => callback())
        .catch(callback);
    } else {
      callback();
    }
  }
  
  _final(callback) {
    if (this.batch.length > 0) {
      this.flush()
        .then(() => callback())
        .catch(callback);
    } else {
      callback();
    }
  }
  
  async flush() {
    if (this.batch.length === 0) return;
    
    console.log(`Inserting ${this.batch.length} records into ${this.tableName}...`);
    
    // Simulate database insert
    await new Promise(resolve => setTimeout(resolve, 100));
    
    this.insertCount += this.batch.length;
    console.log(`Total inserted: ${this.insertCount}`);
    
    this.batch = [];
  }
}

// Usage
const insertStream = new DatabaseInsertStream('users');

for (let i = 0; i < 500; i++) {
  insertStream.write({
    name: `User ${i}`,
    email: `user${i}@example.com`
  });
}

insertStream.end();

insertStream.on('finish', () => {
  console.log('All records inserted');
});
```

### 3. Custom Transform Stream (Data Validator)

```javascript
const { Transform } = require('stream');

class DataValidator extends Transform {
  constructor(schema, options) {
    super({ ...options, objectMode: true });
    this.schema = schema;
    this.validCount = 0;
    this.invalidCount = 0;
  }
  
  _transform(record, encoding, callback) {
    const errors = this.validate(record);
    
    if (errors.length === 0) {
      this.validCount++;
      this.push(record);
      callback();
    } else {
      this.invalidCount++;
      console.error('Validation failed:', errors);
      
      // Emit custom event for invalid data
      this.emit('invalid', { record, errors });
      
      callback(); // Continue processing
    }
  }
  
  _final(callback) {
    this.emit('summary', {
      valid: this.validCount,
      invalid: this.invalidCount,
      total: this.validCount + this.invalidCount
    });
    callback();
  }
  
  validate(record) {
    const errors = [];
    
    for (const [field, rules] of Object.entries(this.schema)) {
      const value = record[field];
      
      if (rules.required && !value) {
        errors.push(`${field} is required`);
      }
      
      if (rules.type && typeof value !== rules.type) {
        errors.push(`${field} must be ${rules.type}`);
      }
      
      if (rules.minLength && value.length < rules.minLength) {
        errors.push(`${field} must be at least ${rules.minLength} characters`);
      }
      
      if (rules.pattern && !rules.pattern.test(value)) {
        errors.push(`${field} format is invalid`);
      }
    }
    
    return errors;
  }
}

// Usage
const validator = new DataValidator({
  name: { required: true, type: 'string', minLength: 2 },
  email: { required: true, type: 'string', pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
  age: { type: 'number' }
});

validator.on('invalid', ({ record, errors }) => {
  console.log('Invalid record:', record, 'Errors:', errors);
});

validator.on('summary', (stats) => {
  console.log('Validation summary:', stats);
});

validator.on('data', (record) => {
  console.log('Valid record:', record);
});

// Test data
validator.write({ name: 'John', email: 'john@example.com', age: 30 });
validator.write({ name: 'J', email: 'invalid-email', age: 25 });
validator.write({ email: 'test@example.com', age: 20 });
validator.end();
```

### 4. Custom Duplex Stream (Cache)

```javascript
const { Duplex } = require('stream');

class CacheStream extends Duplex {
  constructor(options) {
    super({ ...options, objectMode: true });
    this.cache = new Map();
    this.readQueue = [];
  }
  
  _write(data, encoding, callback) {
    // Store data in cache
    const { key, value } = data;
    
    if (key && value !== undefined) {
      this.cache.set(key, value);
      console.log(`Cached: ${key} = ${value}`);
    }
    
    callback();
  }
  
  _read() {
    // Return cached data
    if (this.readQueue.length > 0) {
      const key = this.readQueue.shift();
      const value = this.cache.get(key);
      
      this.push({
        key,
        value,
        found: value !== undefined
      });
    }
  }
  
  get(key) {
    this.readQueue.push(key);
    this.read();
  }
}

// Usage
const cache = new CacheStream();

cache.on('data', (result) => {
  console.log('Read from cache:', result);
});

// Write to cache
cache.write({ key: 'user:1', value: { name: 'John' } });
cache.write({ key: 'user:2', value: { name: 'Jane' } });

// Read from cache
cache.get('user:1');
cache.get('user:2');
cache.get('user:3'); // Not found
```

---

## Stream Composition & Pipelines

Multiple streams একসাথে compose করা।

### 1. Stream Pipeline Builder

```javascript
const { pipeline } = require('stream');
const { Transform } = require('stream');

class PipelineBuilder {
  constructor() {
    this.streams = [];
  }
  
  addStream(stream) {
    this.streams.push(stream);
    return this;
  }
  
  addTransform(transformFn) {
    const transform = new Transform({
      objectMode: true,
      transform: transformFn
    });
    this.streams.push(transform);
    return this;
  }
  
  execute(source, destination) {
    return new Promise((resolve, reject) => {
      pipeline(
        source,
        ...this.streams,
        destination,
        (err) => {
          if (err) reject(err);
          else resolve();
        }
      );
    });
  }
}

// Usage
const fs = require('fs');
const zlib = require('zlib');

const builder = new PipelineBuilder()
  .addTransform((chunk, encoding, callback) => {
    // Uppercase transform
    callback(null, chunk.toString().toUpperCase());
  })
  .addStream(zlib.createGzip());

builder.execute(
  fs.createReadStream('input.txt'),
  fs.createWriteStream('output.txt.gz')
).then(() => {
  console.log('Pipeline complete');
}).catch((err) => {
  console.error('Pipeline failed:', err);
});
```

### 2. Multiplex Stream

```javascript
const { Writable, Readable } = require('stream');

class MultiplexStream {
  constructor() {
    this.sources = [];
    this.currentIndex = 0;
  }
  
  addSource(stream) {
    this.sources.push(stream);
    return this;
  }
  
  createReadStream() {
    const self = this;
    
    return new Readable({
      async read() {
        if (self.currentIndex >= self.sources.length) {
          this.push(null);
          return;
        }
        
        const currentSource = self.sources[self.currentIndex];
        
        currentSource.once('data', (chunk) => {
          this.push(chunk);
        });
        
        currentSource.once('end', () => {
          self.currentIndex++;
          this.read();
        });
      }
    });
  }
}

// Usage
const fs = require('fs');

const multiplex = new MultiplexStream()
  .addSource(fs.createReadStream('file1.txt'))
  .addSource(fs.createReadStream('file2.txt'))
  .addSource(fs.createReadStream('file3.txt'));

const combined = multiplex.createReadStream();

combined.pipe(fs.createWriteStream('combined.txt'));
```

### 3. Parallel Stream Processing

```javascript
const { Transform } = require('stream');
const { Worker } = require('worker_threads');

class ParallelTransform extends Transform {
  constructor(workerScript, concurrency = 4) {
    super({ objectMode: true });
    this.workerScript = workerScript;
    this.concurrency = concurrency;
    this.workers = [];
    this.queue = [];
    this.processing = 0;
    
    // Create worker pool
    for (let i = 0; i < concurrency; i++) {
      const worker = new Worker(workerScript);
      this.workers.push({ worker, busy: false });
    }
  }
  
  _transform(chunk, encoding, callback) {
    this.queue.push({ chunk, callback });
    this.processQueue();
  }
  
  processQueue() {
    if (this.queue.length === 0) return;
    
    const availableWorker = this.workers.find(w => !w.busy);
    if (!availableWorker) return;
    
    const { chunk, callback } = this.queue.shift();
    availableWorker.busy = true;
    this.processing++;
    
    availableWorker.worker.postMessage(chunk);
    
    availableWorker.worker.once('message', (result) => {
      this.push(result);
      availableWorker.busy = false;
      this.processing--;
      callback();
      this.processQueue();
    });
  }
  
  _final(callback) {
    const checkDone = setInterval(() => {
      if (this.processing === 0 && this.queue.length === 0) {
        clearInterval(checkDone);
        
        // Terminate workers
        this.workers.forEach(w => w.worker.terminate());
        callback();
      }
    }, 100);
  }
}

// worker.js (separate file)
/*
const { parentPort } = require('worker_threads');

parentPort.on('message', (data) => {
  // Heavy processing
  const result = heavyComputation(data);
  parentPort.postMessage(result);
});

function heavyComputation(data) {
  // Simulate CPU-intensive work
  let sum = 0;
  for (let i = 0; i < 1000000; i++) {
    sum += Math.sqrt(i);
  }
  return { ...data, processed: true, sum };
}
*/
```

### 4. Stream Router

```javascript
const { Writable } = require('stream');

class StreamRouter extends Writable {
  constructor(options) {
    super({ ...options, objectMode: true });
    this.routes = new Map();
    this.defaultRoute = null;
  }
  
  addRoute(condition, destination) {
    this.routes.set(condition, destination);
    return this;
  }
  
  setDefault(destination) {
    this.defaultRoute = destination;
    return this;
  }
  
  _write(chunk, encoding, callback) {
    let routed = false;
    
    for (const [condition, destination] of this.routes) {
      if (condition(chunk)) {
        destination.write(chunk);
        routed = true;
        break;
      }
    }
    
    if (!routed && this.defaultRoute) {
      this.defaultRoute.write(chunk);
    }
    
    callback();
  }
  
  _final(callback) {
    // End all destinations
    for (const [, destination] of this.routes) {
      destination.end();
    }
    
    if (this.defaultRoute) {
      this.defaultRoute.end();
    }
    
    callback();
  }
}

// Usage
const fs = require('fs');

const errorStream = fs.createWriteStream('errors.log');
const warningStream = fs.createWriteStream('warnings.log');
const infoStream = fs.createWriteStream('info.log');

const router = new StreamRouter()
  .addRoute(
    (log) => log.level === 'ERROR',
    errorStream
  )
  .addRoute(
    (log) => log.level === 'WARNING',
    warningStream
  )
  .setDefault(infoStream);

// Write logs
router.write({ level: 'ERROR', message: 'Critical error' });
router.write({ level: 'WARNING', message: 'Warning message' });
router.write({ level: 'INFO', message: 'Info message' });
router.end();
```

---

## Stream Performance Optimization

Stream performance কে optimize করার techniques।

### 1. High Water Mark Tuning

```javascript
const fs = require('fs');

// ✅ Default (16KB)
const defaultStream = fs.createReadStream('file.txt');

// ✅ Larger chunks (better for large files)
const largeChunks = fs.createReadStream('large-file.txt', {
  highWaterMark: 1024 * 1024 // 1MB
});

// ✅ Smaller chunks (better for memory-constrained)
const smallChunks = fs.createReadStream('file.txt', {
  highWaterMark: 4 * 1024 // 4KB
});

// Performance comparison
async function benchmark(stream, name) {
  const start = Date.now();
  let chunks = 0;
  
  return new Promise((resolve) => {
    stream.on('data', () => chunks++);
    stream.on('end', () => {
      const duration = Date.now() - start;
      console.log(`${name}: ${duration}ms, ${chunks} chunks`);
      resolve();
    });
  });
}

benchmark(defaultStream, 'Default (16KB)');
benchmark(largeChunks, 'Large (1MB)');
benchmark(smallChunks, 'Small (4KB)');
```

### 2. Object Mode vs Binary Mode

```javascript
const { Transform } = require('stream');

// ❌ BAD: Converting between modes frequently
class Inefficient extends Transform {
  constructor() {
    super({ objectMode: false });
  }
  
  _transform(chunk, encoding, callback) {
    const obj = JSON.parse(chunk.toString());
    obj.processed = true;
    const str = JSON.stringify(obj);
    callback(null, Buffer.from(str));
  }
}

// ✅ GOOD: Stay in object mode
class Efficient extends Transform {
  constructor() {
    super({ objectMode: true });
  }
  
  _transform(obj, encoding, callback) {
    obj.processed = true;
    callback(null, obj);
  }
}
```

### 3. Stream Pooling

```javascript
class StreamPool {
  constructor(factory, size = 5) {
    this.factory = factory;
    this.size = size;
    this.available = [];
    this.inUse = new Set();
    
    // Pre-create streams
    for (let i = 0; i < size; i++) {
      this.available.push(this.factory());
    }
  }
  
  acquire() {
    if (this.available.length > 0) {
      const stream = this.available.pop();
      this.inUse.add(stream);
      return stream;
    }
    
    // Create new if needed
    const stream = this.factory();
    this.inUse.add(stream);
    return stream;
  }
  
  release(stream) {
    this.inUse.delete(stream);
    
    if (this.available.length < this.size) {
      this.available.push(stream);
    } else {
      stream.destroy();
    }
  }
  
  async use(callback) {
    const stream = this.acquire();
    
    try {
      return await callback(stream);
    } finally {
      this.release(stream);
    }
  }
}

// Usage
const fs = require('fs');

const fileStreamPool = new StreamPool(
  () => fs.createWriteStream('output.txt', { flags: 'a' }),
  3
);

async function writeData(data) {
  await fileStreamPool.use(async (stream) => {
    return new Promise((resolve, reject) => {
      stream.write(data, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  });
}

// Multiple concurrent writes
Promise.all([
  writeData('Line 1\n'),
  writeData('Line 2\n'),
  writeData('Line 3\n')
]);
```

### 4. Buffering Strategy

```javascript
const { Transform } = require('stream');

class BufferedTransform extends Transform {
  constructor(bufferSize = 100) {
    super({ objectMode: true });
    this.buffer = [];
    this.bufferSize = bufferSize;
  }
  
  _transform(chunk, encoding, callback) {
    this.buffer.push(chunk);
    
    if (this.buffer.length >= this.bufferSize) {
      this.flush();
    }
    
    callback();
  }
  
  _flush(callback) {
    this.flush();
    callback();
  }
  
  flush() {
    if (this.buffer.length === 0) return;
    
    // Process batch
    const batch = this.processBatch(this.buffer);
    this.push(batch);
    
    this.buffer = [];
  }
  
  processBatch(items) {
    // Batch processing is more efficient
    return {
      count: items.length,
      items: items
    };
  }
}

// Usage
const stream = new BufferedTransform(50);

for (let i = 0; i < 200; i++) {
  stream.write({ id: i, data: `Item ${i}` });
}

stream.end();

stream.on('data', (batch) => {
  console.log(`Processed batch of ${batch.count} items`);
});
```

---

## Stream Error Handling

Comprehensive error handling strategies।

### 1. Error Handling Best Practices

```javascript
const fs = require('fs');
const { pipeline } = require('stream');

// ❌ BAD: No error handling
function bad() {
  fs.createReadStream('input.txt')
    .pipe(fs.createWriteStream('output.txt'));
  // Errors will crash the app!
}

// ✅ GOOD: Proper error handling
function good() {
  const readStream = fs.createReadStream('input.txt');
  const writeStream = fs.createWriteStream('output.txt');
  
  readStream.on('error', (err) => {
    console.error('Read error:', err);
    writeStream.destroy(err);
  });
  
  writeStream.on('error', (err) => {
    console.error('Write error:', err);
    readStream.destroy();
  });
  
  readStream.pipe(writeStream);
}

// ✅ BEST: Using pipeline
function best() {
  pipeline(
    fs.createReadStream('input.txt'),
    fs.createWriteStream('output.txt'),
    (err) => {
      if (err) {
        console.error('Pipeline error:', err);
      } else {
        console.log('Pipeline success');
      }
    }
  );
}
```

### 2. Error Recovery

```javascript
const { Transform } = require('stream');

class ResilientTransform extends Transform {
  constructor(transformFn, options = {}) {
    super({ ...options, objectMode: true });
    this.transformFn = transformFn;
    this.errorCount = 0;
    this.maxErrors = options.maxErrors || 10;
    this.skipOnError = options.skipOnError !== false;
  }
  
  _transform(chunk, encoding, callback) {
    try {
      const result = this.transformFn(chunk);
      callback(null, result);
    } catch (err) {
      this.errorCount++;
      
      this.emit('transformError', {
        error: err,
        chunk,
        count: this.errorCount
      });
      
      if (this.errorCount > this.maxErrors) {
        callback(new Error(`Too many errors (${this.errorCount})`));
      } else if (this.skipOnError) {
        // Skip this chunk, continue processing
        callback();
      } else {
        callback(err);
      }
    }
  }
}

// Usage
const stream = new ResilientTransform(
  (data) => {
    if (data.value < 0) {
      throw new Error('Negative value');
    }
    return data.value * 2;
  },
  { maxErrors: 5, skipOnError: true }
);

stream.on('transformError', ({ error, chunk, count }) => {
  console.log(`Error #${count}: ${error.message} for chunk:`, chunk);
});

stream.on('data', (result) => {
  console.log('Result:', result);
});

stream.write({ value: 10 }); // OK
stream.write({ value: -5 }); // Error, skipped
stream.write({ value: 20 }); // OK
stream.end();
```

### 3. Retry Logic

```javascript
const { Readable } = require('stream');

class RetryableReadStream extends Readable {
  constructor(fetchFn, options = {}) {
    super(options);
    this.fetchFn = fetchFn;
    this.maxRetries = options.maxRetries || 3;
    this.retryDelay = options.retryDelay || 1000;
    this.currentRetry = 0;
  }
  
  async _read() {
    try {
      const data = await this.fetchWithRetry();
      
      if (data === null) {
        this.push(null);
      } else {
        this.push(data);
      }
      
      this.currentRetry = 0; // Reset on success
    } catch (err) {
      this.destroy(err);
    }
  }
  
  async fetchWithRetry() {
    for (let i = 0; i <= this.maxRetries; i++) {
      try {
        return await this.fetchFn();
      } catch (err) {
        console.log(`Attempt ${i + 1} failed:`, err.message);
        
        if (i < this.maxRetries) {
          await this.delay(this.retryDelay * (i + 1));
        } else {
          throw err;
        }
      }
    }
  }
  
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Usage
let callCount = 0;

const stream = new RetryableReadStream(
  async () => {
    callCount++;
    
    if (callCount < 3) {
      throw new Error('Temporary failure');
    }
    
    return `Success after ${callCount} attempts`;
  },
  { maxRetries: 5, retryDelay: 500 }
);

stream.on('data', (data) => {
  console.log('Data:', data);
});

stream.on('error', (err) => {
  console.error('Final error:', err);
});
```

### 4. Circuit Breaker for Streams

```javascript
const { Transform } = require('stream');

class CircuitBreakerStream extends Transform {
  constructor(options = {}) {
    super(options);
    this.failureThreshold = options.failureThreshold || 5;
    this.resetTimeout = options.resetTimeout || 60000;
    this.failures = 0;
    this.state = 'CLOSED'; // CLOSED, OPEN, HALF_OPEN
    this.nextAttempt = Date.now();
  }
  
  _transform(chunk, encoding, callback) {
    if (this.state === 'OPEN') {
      if (Date.now() < this.nextAttempt) {
        return callback(new Error('Circuit breaker is OPEN'));
      } else {
        this.state = 'HALF_OPEN';
      }
    }
    
    this.processChunk(chunk)
      .then((result) => {
        this.onSuccess();
        callback(null, result);
      })
      .catch((err) => {
        this.onFailure();
        callback(err);
      });
  }
  
  async processChunk(chunk) {
    // Override this method
    return chunk;
  }
  
  onSuccess() {
    this.failures = 0;
    
    if (this.state === 'HALF_OPEN') {
      this.state = 'CLOSED';
      console.log('Circuit breaker CLOSED');
    }
  }
  
  onFailure() {
    this.failures++;
    
    if (this.failures >= this.failureThreshold) {
      this.state = 'OPEN';
      this.nextAttempt = Date.now() + this.resetTimeout;
      console.log(`Circuit breaker OPEN (${this.failures} failures)`);
    }
  }
}

// Usage
class APIStream extends CircuitBreakerStream {
  async processChunk(chunk) {
    // Simulate API call
    const response = await fetch(`https://api.example.com/data/${chunk.id}`);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    return await response.json();
  }
}
```

---

## Large File Processing

বড় files efficiently process করার techniques।

### 1. Line-by-Line Processing

```javascript
const fs = require('fs');
const readline = require('readline');

async function processLargeFile(filename) {
  const fileStream = fs.createReadStream(filename);
  
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });
  
  let lineNumber = 0;
  
  for await (const line of rl) {
    lineNumber++;
    
    // Process each line
    if (line.includes('ERROR')) {
      console.log(`Line ${lineNumber}: ${line}`);
    }
  }
  
  console.log(`Processed ${lineNumber} lines`);
}

processLargeFile('huge-log-file.log');
```

### 2. Chunk-based Processing

```javascript
const fs = require('fs');

async function processInChunks(filename, chunkSize = 1024 * 1024) {
  const stream = fs.createReadStream(filename, {
    highWaterMark: chunkSize
  });
  
  let chunkNumber = 0;
  let totalBytes = 0;
  
  for await (const chunk of stream) {
    chunkNumber++;
    totalBytes += chunk.length;
    
    // Process chunk
    await processChunk(chunk, chunkNumber);
    
    console.log(`Processed chunk ${chunkNumber}: ${chunk.length} bytes`);
  }
  
  console.log(`Total: ${totalBytes} bytes in ${chunkNumber} chunks`);
}

async function processChunk(chunk, number) {
  // Simulate async processing
  return new Promise(resolve => setTimeout(resolve, 100));
}

processInChunks('large-file.bin', 5 * 1024 * 1024); // 5MB chunks
```

### 3. CSV Processing (Large Files)

```javascript
const fs = require('fs');
const { Transform } = require('stream');
const readline = require('readline');

class CSVProcessor extends Transform {
  constructor(options) {
    super({ ...options, objectMode: true });
    this.headers = null;
    this.lineNumber = 0;
    this.processedCount = 0;
  }
  
  _transform(line, encoding, callback) {
    this.lineNumber++;
    
    if (!line.trim()) {
      return callback();
    }
    
    if (!this.headers) {
      this.headers = line.split(',').map(h => h.trim());
      return callback();
    }
    
    try {
      const values = line.split(',').map(v => v.trim());
      const record = {};
      
      this.headers.forEach((header, i) => {
        record[header] = values[i];
      });
      
      this.processedCount++;
      callback(null, record);
    } catch (err) {
      console.error(`Error on line ${this.lineNumber}:`, err);
      callback(); // Skip bad lines
    }
  }
  
  _final(callback) {
    console.log(`Processed ${this.processedCount} records`);
    callback();
  }
}

// Usage
async function processLargeCSV(inputFile, outputFile) {
  const input = fs.createReadStream(inputFile);
  const output = fs.createWriteStream(outputFile);
  
  const rl = readline.createInterface({
    input,
    crlfDelay: Infinity
  });
  
  const processor = new CSVProcessor();
  
  rl.on('line', (line) => {
    processor.write(line);
  });
  
  rl.on('close', () => {
    processor.end();
  });
  
  processor.on('data', (record) => {
    // Filter and transform
    if (record.age && parseInt(record.age) > 18) {
      output.write(JSON.stringify(record) + '\n');
    }
  });
  
  processor.on('end', () => {
    output.end();
    console.log('Processing complete');
  });
}

processLargeCSV('huge-data.csv', 'filtered-data.jsonl');
```

### 4. Splitting Large Files

```javascript
const fs = require('fs');
const { pipeline } = require('stream');
const { Transform } = require('stream');

class FileSplitter extends Transform {
  constructor(maxFileSize) {
    super();
    this.maxFileSize = maxFileSize;
    this.currentSize = 0;
    this.fileIndex = 0;
    this.currentStream = null;
    this.baseFilename = 'output';
  }
  
  _transform(chunk, encoding, callback) {
    if (!this.currentStream || this.currentSize + chunk.length > this.maxFileSize) {
      this.rotateFile();
    }
    
    this.currentStream.write(chunk);
    this.currentSize += chunk.length;
    
    callback();
  }
  
  _final(callback) {
    if (this.currentStream) {
      this.currentStream.end();
    }
    callback();
  }
  
  rotateFile() {
    if (this.currentStream) {
      this.currentStream.end();
    }
    
    this.fileIndex++;
    const filename = `${this.baseFilename}-${this.fileIndex}.txt`;
    
    console.log(`Creating new file: ${filename}`);
    
    this.currentStream = fs.createWriteStream(filename);
    this.currentSize = 0;
  }
}

// Usage: Split into 10MB files
const splitter = new FileSplitter(10 * 1024 * 1024);

fs.createReadStream('huge-file.txt')
  .pipe(splitter)
  .on('finish', () => {
    console.log('Splitting complete');
  });
```

### 5. Progress Tracking

```javascript
const fs = require('fs');
const { Transform } = require('stream');

class ProgressStream extends Transform {
  constructor(totalSize, options) {
    super(options);
    this.totalSize = totalSize;
    this.processedSize = 0;
    this.lastReported = 0;
    this.startTime = Date.now();
  }
  
  _transform(chunk, encoding, callback) {
    this.processedSize += chunk.length;
    
    const percent = (this.processedSize / this.totalSize) * 100;
    
    // Report every 5%
    if (percent - this.lastReported >= 5) {
      this.reportProgress(percent);
      this.lastReported = Math.floor(percent / 5) * 5;
    }
    
    this.push(chunk);
    callback();
  }
  
  _final(callback) {
    this.reportProgress(100);
    callback();
  }
  
  reportProgress(percent) {
    const elapsed = (Date.now() - this.startTime) / 1000;
    const bytesPerSecond = this.processedSize / elapsed;
    const remaining = (this.totalSize - this.processedSize) / bytesPerSecond;
    
    console.log(`Progress: ${percent.toFixed(1)}%`);
    console.log(`Speed: ${(bytesPerSecond / 1024 / 1024).toFixed(2)} MB/s`);
    console.log(`Remaining: ${remaining.toFixed(1)}s`);
    console.log('---');
  }
}

// Usage
async function copyWithProgress(source, dest) {
  const stats = await fs.promises.stat(source);
  const totalSize = stats.size;
  
  console.log(`Copying ${totalSize} bytes...`);
  
  const progress = new ProgressStream(totalSize);
  
  fs.createReadStream(source)
    .pipe(progress)
    .pipe(fs.createWriteStream(dest));
}

copyWithProgress('large-video.mp4', 'copy.mp4');
```

---

## Production Streaming Patterns

Real-world production scenarios।

### 1. Log File Rotation

```javascript
const fs = require('fs');
const { Writable } = require('stream');

class RotatingFileStream extends Writable {
  constructor(baseFilename, options = {}) {
    super(options);
    this.baseFilename = baseFilename;
    this.maxSize = options.maxSize || 10 * 1024 * 1024; // 10MB
    this.maxFiles = options.maxFiles || 5;
    this.currentSize = 0;
    this.currentStream = null;
    this.currentFile = 0;
    
    this.openFile();
  }
  
  _write(chunk, encoding, callback) {
    if (this.currentSize + chunk.length > this.maxSize) {
      this.rotate();
    }
    
    this.currentStream.write(chunk, encoding, callback);
    this.currentSize += chunk.length;
  }
  
  _final(callback) {
    this.currentStream.end(callback);
  }
  
  openFile() {
    const filename = `${this.baseFilename}.${this.currentFile}`;
    this.currentStream = fs.createWriteStream(filename, { flags: 'a' });
    
    // Get current file size
    try {
      const stats = fs.statSync(filename);
      this.currentSize = stats.size;
    } catch (err) {
      this.currentSize = 0;
    }
  }
  
  rotate() {
    this.currentStream.end();
    this.currentFile = (this.currentFile + 1) % this.maxFiles;
    
    const filename = `${this.baseFilename}.${this.currentFile}`;
    
    // Delete old file if exists
    try {
      fs.unlinkSync(filename);
    } catch (err) {
      // File doesn't exist, ignore
    }
    
    this.openFile();
    console.log(`Rotated to ${filename}`);
  }
}

// Usage
const logger = new RotatingFileStream('app.log', {
  maxSize: 5 * 1024 * 1024, // 5MB
  maxFiles: 3
});

setInterval(() => {
  logger.write(`[${new Date().toISOString()}] Log entry\n`);
}, 100);
```

### 2. Streaming Upload to S3

```javascript
const { Upload } = require('@aws-sdk/lib-storage');
const { S3Client } = require('@aws-sdk/client-s3');
const fs = require('fs');
const { PassThrough } = require('stream');

async function uploadFileToS3(localFile, bucket, key) {
  const s3Client = new S3Client({ region: 'us-east-1' });
  
  const fileStream = fs.createReadStream(localFile);
  const passThrough = new PassThrough();
  
  // Track progress
  let uploadedBytes = 0;
  
  passThrough.on('data', (chunk) => {
    uploadedBytes += chunk.length;
    console.log(`Uploaded: ${(uploadedBytes / 1024 / 1024).toFixed(2)} MB`);
  });
  
  fileStream.pipe(passThrough);
  
  try {
    const upload = new Upload({
      client: s3Client,
      params: {
        Bucket: bucket,
        Key: key,
        Body: passThrough
      }
    });
    
    upload.on('httpUploadProgress', (progress) => {
      console.log('Progress:', progress);
    });
    
    const result = await upload.done();
    console.log('Upload complete:', result);
    
    return result;
  } catch (err) {
    console.error('Upload failed:', err);
    throw err;
  }
}

// Usage
uploadFileToS3('large-video.mp4', 'my-bucket', 'videos/video.mp4');
```

### 3. Streaming API Response

```javascript
const express = require('express');
const fs = require('fs');
const { Transform } = require('stream');

const app = express();

// ✅ Stream large JSON array
app.get('/api/users', (req, res) => {
  const query = `SELECT * FROM users`;
  
  res.setHeader('Content-Type', 'application/json');
  res.write('[');
  
  let first = true;
  
  // Simulate database stream
  const userStream = getUserStream(query);
  
  userStream.on('data', (user) => {
    if (!first) {
      res.write(',');
    }
    res.write(JSON.stringify(user));
    first = false;
  });
  
  userStream.on('end', () => {
    res.write(']');
    res.end();
  });
  
  userStream.on('error', (err) => {
    res.status(500).json({ error: err.message });
  });
});

// ✅ Stream file download
app.get('/download/:filename', (req, res) => {
  const filename = req.params.filename;
  const filepath = `./files/${filename}`;
  
  // Check if file exists
  if (!fs.existsSync(filepath)) {
    return res.status(404).json({ error: 'File not found' });
  }
  
  const stat = fs.statSync(filepath);
  
  res.setHeader('Content-Length', stat.size);
  res.setHeader('Content-Type', 'application/octet-stream');
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
  
  const fileStream = fs.createReadStream(filepath);
  fileStream.pipe(res);
  
  fileStream.on('error', (err) => {
    console.error('Stream error:', err);
    res.status(500).end();
  });
});

// ✅ Stream video with range support
app.get('/video/:id', (req, res) => {
  const videoPath = `./videos/${req.params.id}.mp4`;
  const stat = fs.statSync(videoPath);
  const fileSize = stat.size;
  const range = req.headers.range;
  
  if (range) {
    const parts = range.replace(/bytes=/, '').split('-');
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
    const chunkSize = (end - start) + 1;
    
    res.writeHead(206, {
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunkSize,
      'Content-Type': 'video/mp4'
    });
    
    const stream = fs.createReadStream(videoPath, { start, end });
    stream.pipe(res);
  } else {
    res.writeHead(200, {
      'Content-Length': fileSize,
      'Content-Type': 'video/mp4'
    });
    
    fs.createReadStream(videoPath).pipe(res);
  }
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
```

### 4. Real-time Data Processing Pipeline

```javascript
const { Transform, pipeline } = require('stream');
const WebSocket = require('ws');

// ✅ Data source
class DataGenerator extends Transform {
  constructor() {
    super({ objectMode: true });
    this.count = 0;
  }
  
  _transform(chunk, encoding, callback) {
    this.push({
      id: this.count++,
      value: Math.random() * 100,
      timestamp: Date.now()
    });
    callback();
  }
}

// ✅ Data processor
class DataProcessor extends Transform {
  constructor() {
    super({ objectMode: true });
    this.window = [];
    this.windowSize = 10;
  }
  
  _transform(data, encoding, callback) {
    this.window.push(data.value);
    
    if (this.window.length > this.windowSize) {
      this.window.shift();
    }
    
    const avg = this.window.reduce((a, b) => a + b, 0) / this.window.length;
    
    this.push({
      ...data,
      movingAverage: avg
    });
    
    callback();
  }
}

// ✅ WebSocket broadcaster
class WebSocketBroadcaster extends Transform {
  constructor(wss) {
    super({ objectMode: true });
    this.wss = wss;
  }
  
  _transform(data, encoding, callback) {
    // Broadcast to all connected clients
    this.wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(data));
      }
    });
    
    callback();
  }
}

// Setup WebSocket server
const wss = new WebSocket.Server({ port: 8080 });

console.log('WebSocket server running on port 8080');

// Create processing pipeline
const generator = new DataGenerator();
const processor = new DataProcessor();
const broadcaster = new WebSocketBroadcaster(wss);

// Generate data every 100ms
setInterval(() => {
  generator.write({});
}, 100);

// Pipeline
pipeline(
  generator,
  processor,
  broadcaster,
  (err) => {
    if (err) {
      console.error('Pipeline error:', err);
    }
  }
);
```

### 5. Database Export Stream

```javascript
const { Readable, pipeline } = require('stream');
const fs = require('fs');
const zlib = require('zlib');

class DatabaseExportStream extends Readable {
  constructor(tableName, options = {}) {
    super({ ...options, objectMode: true });
    this.tableName = tableName;
    this.batchSize = options.batchSize || 1000;
    this.offset = 0;
    this.done = false;
  }
  
  async _read() {
    if (this.done) {
      this.push(null);
      return;
    }
    
    try {
      const records = await this.fetchBatch();
      
      if (records.length === 0) {
        this.done = true;
        this.push(null);
      } else {
        for (const record of records) {
          this.push(JSON.stringify(record) + '\n');
        }
        this.offset += records.length;
      }
    } catch (err) {
      this.destroy(err);
    }
  }
  
  async fetchBatch() {
    // Simulate database query
    // In real app, use actual DB connection
    console.log(`Fetching ${this.tableName} offset ${this.offset}...`);
    
    return new Promise((resolve) => {
      setTimeout(() => {
        const records = [];
        const batchSize = Math.min(this.batchSize, 10000 - this.offset);
        
        for (let i = 0; i < batchSize; i++) {
          records.push({
            id: this.offset + i,
            data: `Record ${this.offset + i}`,
            timestamp: new Date().toISOString()
          });
        }
        
        resolve(records);
      }, 100);
    });
  }
}

// Usage: Export database to compressed file
async function exportDatabase() {
  const exportStream = new DatabaseExportStream('users', {
    batchSize: 1000
  });
  
  const outputFile = fs.createWriteStream('export.jsonl.gz');
  const gzip = zlib.createGzip();
  
  console.log('Starting export...');
  
  await new Promise((resolve, reject) => {
    pipeline(
      exportStream,
      gzip,
      outputFile,
      (err) => {
        if (err) {
          console.error('Export failed:', err);
          reject(err);
        } else {
          console.log('Export complete!');
          resolve();
        }
      }
    );
  });
}

exportDatabase();
```

---

এই comprehensive guide এ Streams & Buffers এর সব fundamental থেকে advanced concepts cover করা হয়েছে। এই knowledge দিয়ে আপনি memory-efficient এবং high-performance Node.js applications তৈরি করতে পারবেন! 🚀
