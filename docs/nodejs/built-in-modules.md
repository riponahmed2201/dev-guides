# Node.js Built-in Modules - সম্পূর্ণ গাইড

Node.js এর সবচেয়ে বড় শক্তি হলো এর **rich built-in modules**। কোনো external library install না করেই আপনি file system, networking, cryptography, streams, এবং আরও অনেক কিছু নিয়ে কাজ করতে পারবেন।

## কেন Built-in Modules শিখবেন?

1. **No Dependencies** - npm install করার দরকার নেই
2. **Fast & Optimized** - C/C++ তে লেখা, অত্যন্ত দ্রুত
3. **Stable API** - Rarely breaking changes
4. **Foundation** - অন্যান্য libraries এগুলোর উপর build করা
5. **Production Ready** - Battle-tested, secure

## Available Built-in Modules:

Node.js এ **50+ built-in modules** আছে। আমরা সবচেয়ে গুরুত্বপূর্ণগুলো শিখব:

### Essential Modules (Must Know):
- `fs` - File System
- `path` - Path utilities
- `http` / `https` - Web servers
- `events` - Event emitter
- `stream` - Data streaming
- `buffer` - Binary data
- `crypto` - Encryption/Hashing

### Important Modules:
- `os` - Operating system info
- `process` - Current process
- `child_process` - Spawn processes
- `url` - URL parsing
- `util` - Utility functions
- `querystring` - Query string parsing

### Advanced Modules:
- `cluster` - Multi-core support
- `net` - TCP/UDP networking
- `dns` - DNS lookup
- `zlib` - Compression
- `readline` - Interactive CLI

---

## ১. fs (File System) Module - সম্পূর্ণ গাইড

File System module দিয়ে files এবং directories নিয়ে সব ধরনের কাজ করা যায়।

### Async vs Sync vs Promises

Node.js এ তিন ধরনের fs API আছে:

#### 1. Callback-based (Original)

```javascript
const fs = require('fs');

fs.readFile('file.txt', 'utf8', (err, data) => {
    if (err) {
        console.error(err);
        return;
    }
    console.log(data);
});

// Async, non-blocking ✅
// But callback hell সমস্যা 😞
```

#### 2. Synchronous (Blocking)

```javascript
const fs = require('fs');

try {
    const data = fs.readFileSync('file.txt', 'utf8');
    console.log(data);
} catch (err) {
    console.error(err);
}

// Blocks event loop ❌
// শুধু initialization code এ ব্যবহার করুন
// Never in request handlers!
```

#### 3. Promise-based (Modern) ✅ Recommended

```javascript
const fs = require('fs/promises');

async function readFile() {
    try {
        const data = await fs.readFile('file.txt', 'utf8');
        console.log(data);
    } catch (err) {
        console.error(err);
    }
}
```

---

### File Operations

#### Reading Files

```javascript
const fs = require('fs/promises');

// 1. Read entire file
async function readEntireFile() {
    const data = await fs.readFile('large-file.txt', 'utf8');
    console.log(data);
}

// 2. Read file in chunks (for large files)
const fs = require('fs');
const stream = fs.createReadStream('large-file.txt', {
    encoding: 'utf8',
    highWaterMark: 64 * 1024  // 64KB chunks
});

stream.on('data', (chunk) => {
    console.log('Chunk:', chunk);
});

stream.on('end', () => {
    console.log('Finished reading');
});

// 3. Check if file exists
async function fileExists(path) {
    try {
        await fs.access(path);
        return true;
    } catch {
        return false;
    }
}

// 4. Get file stats
async function getFileInfo(path) {
    const stats = await fs.stat(path);
    
    console.log({
        size: stats.size,                    // bytes
        isFile: stats.isFile(),
        isDirectory: stats.isDirectory(),
        created: stats.birthtime,
        modified: stats.mtime,
        accessed: stats.atime
    });
}
```

#### Writing Files

```javascript
// 1. Write (overwrite if exists)
await fs.writeFile('output.txt', 'Hello World');

// 2. Append to file
await fs.appendFile('log.txt', 'New log entry\n');

// 3. Write with options
await fs.writeFile('data.json', JSON.stringify(data), {
    encoding: 'utf8',
    mode: 0o666,      // File permissions
    flag: 'w'         // 'w' = write, 'a' = append, 'wx' = write (fail if exists)
});

// 4. Write large files (stream)
const fs = require('fs');
const writeStream = fs.createWriteStream('large-output.txt');

for (let i = 0; i < 1000000; i++) {
    writeStream.write(`Line ${i}\n`);
}

writeStream.end();
writeStream.on('finish', () => {
    console.log('File written');
});
```

#### Copying Files

```javascript
// 1. Simple copy
await fs.copyFile('source.txt', 'destination.txt');

// 2. Copy with overwrite check
await fs.copyFile('source.txt', 'dest.txt', fs.constants.COPYFILE_EXCL);
// Fails if dest.txt already exists

// 3. Copy entire directory (recursive)
await fs.cp('source-dir', 'dest-dir', {
    recursive: true,
    force: true
});
```

#### Deleting Files

```javascript
// 1. Delete file
await fs.unlink('file-to-delete.txt');

// 2. Delete if exists
try {
    await fs.unlink('maybe-exists.txt');
} catch (err) {
    if (err.code !== 'ENOENT') throw err;
}

// 3. Delete directory (empty)
await fs.rmdir('empty-dir');

// 4. Delete directory recursively
await fs.rm('dir-with-files', {
    recursive: true,
    force: true
});
```

#### Renaming/Moving Files

```javascript
// Rename or move file
await fs.rename('old-name.txt', 'new-name.txt');
await fs.rename('file.txt', 'subfolder/file.txt');  // Move
```

---

### Directory Operations

```javascript
// 1. Create directory
await fs.mkdir('new-folder');

// 2. Create nested directories
await fs.mkdir('path/to/nested/folder', { recursive: true });

// 3. Read directory
const files = await fs.readdir('my-folder');
console.log(files);  // ['file1.txt', 'file2.txt']

// 4. Read directory with file types
const entries = await fs.readdir('my-folder', { withFileTypes: true });

for (const entry of entries) {
    console.log({
        name: entry.name,
        isFile: entry.isFile(),
        isDirectory: entry.isDirectory()
    });
}

// 5. Read directory recursively
async function listFilesRecursive(dir) {
    const files = [];
    const entries = await fs.readdir(dir, { withFileTypes: true });
    
    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        
        if (entry.isDirectory()) {
            files.push(...await listFilesRecursive(fullPath));
        } else {
            files.push(fullPath);
        }
    }
    
    return files;
}

// 6. Delete directory
await fs.rmdir('empty-folder');

// 7. Delete directory with contents
await fs.rm('folder-with-files', { recursive: true, force: true });
```

---

### Watching Files & Directories

```javascript
const fs = require('fs');

// Watch for file changes
const watcher = fs.watch('config.json', (eventType, filename) => {
    console.log(`Event: ${eventType}, File: ${filename}`);
    // eventType: 'rename' or 'change'
});

// Stop watching
watcher.close();

// Watch directory
fs.watch('src', { recursive: true }, (eventType, filename) => {
    console.log(`${filename} was ${eventType}`);
});
```

---

### File Permissions & Ownership

```javascript
// 1. Change file permissions
await fs.chmod('file.txt', 0o644);  // rw-r--r--
await fs.chmod('script.sh', 0o755); // rwxr-xr-x

// 2. Change ownership (Linux/Mac only)
await fs.chown('file.txt', uid, gid);

// 3. Get file permissions
const stats = await fs.stat('file.txt');
console.log(stats.mode.toString(8));  // '100644'
```

---

### Advanced Operations

#### 1. Atomic File Write

```javascript
// Write to temp file, then rename (atomic operation)
async function atomicWrite(path, data) {
    const tempPath = `${path}.tmp`;
    await fs.writeFile(tempPath, data);
    await fs.rename(tempPath, path);
}

// Safe from partial writes if crash occurs
```

#### 2. File Locking

```javascript
// Open file exclusively (no other process can open)
const fd = await fs.open('file.txt', 'wx');
// Throws if file exists

await fs.writeFile(fd, 'data');
await fd.close();
```

#### 3. Read File Line by Line

```javascript
const readline = require('readline');
const fs = require('fs');

const rl = readline.createInterface({
    input: fs.createReadStream('large-file.txt'),
    crlfDelay: Infinity
});

for await (const line of rl) {
    console.log(`Line: ${line}`);
}
```

#### 4. File Descriptors (Low-level)

```javascript
// Low-level file operations
const fd = await fs.open('file.txt', 'r');

const buffer = Buffer.alloc(1024);
const { bytesRead } = await fd.read(buffer, 0, 1024, 0);

console.log(buffer.toString('utf8', 0, bytesRead));

await fd.close();
```

---

### Real-World Examples

#### Example 1: File Upload Handler

```javascript
const fs = require('fs/promises');
const path = require('path');

async function saveUploadedFile(file, uploadDir) {
    // Create upload directory if not exists
    await fs.mkdir(uploadDir, { recursive: true });
    
    // Generate unique filename
    const timestamp = Date.now();
    const ext = path.extname(file.originalname);
    const filename = `${timestamp}-${Math.random().toString(36).substring(7)}${ext}`;
    const filepath = path.join(uploadDir, filename);
    
    // Save file
    await fs.writeFile(filepath, file.buffer);
    
    return {
        filename,
        path: filepath,
        size: file.buffer.length
    };
}
```

#### Example 2: Log Rotation

```javascript
async function rotateLog(logPath, maxSize) {
    const stats = await fs.stat(logPath);
    
    if (stats.size >= maxSize) {
        // Rotate: log.txt → log.1.txt → log.2.txt → ...
        const backupPath = `${logPath}.${Date.now()}`;
        await fs.rename(logPath, backupPath);
        
        // Create new log file
        await fs.writeFile(logPath, '');
    }
}
```

#### Example 3: Config File Manager

```javascript
class ConfigManager {
    constructor(configPath) {
        this.configPath = configPath;
    }
    
    async read() {
        try {
            const data = await fs.readFile(this.configPath, 'utf8');
            return JSON.parse(data);
        } catch (err) {
            if (err.code === 'ENOENT') {
                return {};  // Return empty config if file doesn't exist
            }
            throw err;
        }
    }
    
    async write(config) {
        const data = JSON.stringify(config, null, 2);
        await atomicWrite(this.configPath, data);
    }
    
    async update(updates) {
        const config = await this.read();
        Object.assign(config, updates);
        await this.write(config);
    }
}

// Usage
const config = new ConfigManager('config.json');
await config.update({ apiKey: 'abc123', debug: true });
```

---

### Best Practices

✅ **Use `fs/promises` (async/await)** - Modern and clean  
✅ **Never use sync methods in production** - Blocks event loop  
✅ **Handle errors properly** - Files might not exist  
✅ **Use streams for large files** - Memory efficient  
✅ **Check file exists before operations** - Use `fs.access()`  
✅ **Use `path.join()` for cross-platform paths**  
✅ **Close file descriptors** - Avoid resource leaks  
✅ **Atomic writes for critical files** - Temp file + rename  
✅ **Set proper permissions** - Security consideration  
✅ **Use try-catch with async operations**

---

## ২. path Module - Complete Reference

Path module cross-platform file path operations এর জন্য। Windows (`\`) এবং Unix (`/`) এর পার্থক্য automatically handle করে।

### Why Use path Module?

```javascript
// ❌ Bad - Platform-specific, breaks on Windows/Linux
const filePath = __dirname + '/files/' + 'image.png';

// ✅ Good - Cross-platform
const filePath = path.join(__dirname, 'files', 'image.png');
```

---

### Core Methods

#### 1. path.join() - Join Path Segments

```javascript
const path = require('path');

// Join multiple segments
path.join('users', 'john', 'documents');
// Windows: users\john\documents
// Linux:   users/john/documents

// Handles '..' and '.' properly
path.join('/foo', 'bar', '..', 'baz');
// Result: /foo/baz

// Common use: Build file paths
const uploadsDir = path.join(__dirname, 'public', 'uploads');
const filePath = path.join(uploadsDir, 'image.jpg');
```

#### 2. path.resolve() - Resolve Absolute Path

```javascript
// Resolves to absolute path
path.resolve('foo', 'bar', 'baz.txt');
// /current/working/directory/foo/bar/baz.txt

// Starts from absolute if given
path.resolve('/foo', 'bar', 'baz.txt');
// /foo/bar/baz.txt

// Difference between join and resolve:
path.join('/foo', '/bar');     // /foo/bar
path.resolve('/foo', '/bar');  // /bar (last absolute wins)

// Common use: Get absolute paths
const configPath = path.resolve('config', 'database.json');
```

#### 3. path.basename() - Get File Name

```javascript
const filePath = '/users/john/documents/resume.pdf';

path.basename(filePath);
// 'resume.pdf'

// Remove extension
path.basename(filePath, '.pdf');
// 'resume'

// Get just filename from URL
const url = 'https://example.com/images/photo.jpg?size=large';
path.basename(new URL(url).pathname);
// 'photo.jpg'
```

#### 4. path.dirname() - Get Directory Name

```javascript
const filePath = '/users/john/documents/resume.pdf';

path.dirname(filePath);
// '/users/john/documents'

// Go up multiple levels
path.dirname(path.dirname(filePath));
// '/users/john'

// Common use: Get parent directory
const parentDir = path.dirname(__dirname);
```

#### 5. path.extname() - Get File Extension

```javascript
path.extname('index.html');        // '.html'
path.extname('archive.tar.gz');    // '.gz'
path.extname('README');            // ''
path.extname('.gitignore');        // ''
path.extname('file.backup.old');   // '.old'

// Check file type
function isImageFile(filename) {
    const ext = path.extname(filename).toLowerCase();
    return ['.jpg', '.jpeg', '.png', '.gif'].includes(ext);
}
```

#### 6. path.parse() - Parse Path into Object

```javascript
const filePath = '/users/john/documents/resume.pdf';

path.parse(filePath);
// {
//   root: '/',
//   dir: '/users/john/documents',
//   base: 'resume.pdf',
//   name: 'resume',
//   ext: '.pdf'
// }

// Windows example:
path.parse('C:\\Users\\john\\file.txt');
// {
//   root: 'C:\\',
//   dir: 'C:\\Users\\john',
//   base: 'file.txt',
//   name: 'file',
//   ext: '.txt'
// }
```

#### 7. path.format() - Build Path from Object

```javascript
path.format({
    root: '/',
    dir: '/users/john/documents',
    base: 'resume.pdf'
});
// '/users/john/documents/resume.pdf'

// Or use name + ext instead of base
path.format({
    dir: '/users/john/documents',
    name: 'resume',
    ext: '.pdf'
});
// '/users/john/documents/resume.pdf'
```

#### 8. path.relative() - Get Relative Path

```javascript
const from = '/users/john/documents';
const to = '/users/john/pictures/photo.jpg';

path.relative(from, to);
// '../pictures/photo.jpg'

// Same directory
path.relative('/foo', '/foo');
// ''

// Common use: Generate relative imports
const relativePath = path.relative(
    path.dirname(currentFile),
    targetFile
);
```

#### 9. path.normalize() - Normalize Path

```javascript
// Resolves '..' and '.'
path.normalize('/users/john/../jane/./documents');
// '/users/jane/documents'

// Removes trailing slashes
path.normalize('/users/john/documents/');
// '/users/john/documents'

// Handles multiple slashes
path.normalize('/users//john///documents');
// '/users/john/documents'
```

#### 10. path.isAbsolute() - Check if Absolute

```javascript
// Unix
path.isAbsolute('/users/john');     // true
path.isAbsolute('users/john');      // false
path.isAbsolute('../john');         // false

// Windows
path.isAbsolute('C:\\Users\\john'); // true
path.isAbsolute('Users\\john');     // false
```

---

### Platform-Specific Paths

```javascript
// Current platform (automatically used by default)
path.sep;        // '/' on Unix, '\' on Windows
path.delimiter;  // ':' on Unix, ';' on Windows

// Force Windows paths
const pathWin = require('path').win32;
pathWin.join('users', 'john', 'file.txt');
// 'users\\john\\file.txt' (even on Unix!)

// Force Unix paths
const pathPosix = require('path').posix;
pathPosix.join('users', 'john', 'file.txt');
// 'users/john/file.txt' (even on Windows!)
```

---

### Real-World Examples

#### Example 1: File Upload Path Generator

```javascript
const path = require('path');
const crypto = require('crypto');

function generateUploadPath(originalFilename, uploadDir) {
    // Get extension
    const ext = path.extname(originalFilename);
    
    // Generate unique filename
    const hash = crypto.randomBytes(16).toString('hex');
    const filename = `${hash}${ext}`;
    
    // Build full path
    const fullPath = path.join(uploadDir, filename);
    
    return {
        filename,
        fullPath,
        relativePath: path.relative(process.cwd(), fullPath)
    };
}

// Usage
const upload = generateUploadPath('photo.jpg', 'public/uploads');
// {
//   filename: '5f3a8b2c1d4e6f8a9b0c1d2e.jpg',
//   fullPath: '/app/public/uploads/5f3a8b2c1d4e6f8a9b0c1d2e.jpg',
//   relativePath: 'public/uploads/5f3a8b2c1d4e6f8a9b0c1d2e.jpg'
// }
```

#### Example 2: Find Files by Extension

```javascript
const fs = require('fs/promises');
const path = require('path');

async function findFilesByExtension(dir, ext) {
    const files = [];
    const entries = await fs.readdir(dir, { withFileTypes: true });
    
    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        
        if (entry.isDirectory()) {
            files.push(...await findFilesByExtension(fullPath, ext));
        } else if (path.extname(entry.name) === ext) {
            files.push(fullPath);
        }
    }
    
    return files;
}

// Usage
const jsFiles = await findFilesByExtension('./src', '.js');
```

#### Example 3: Change File Extension

```javascript
function changeExtension(filePath, newExt) {
    const parsed = path.parse(filePath);
    
    return path.format({
        dir: parsed.dir,
        name: parsed.name,
        ext: newExt.startsWith('.') ? newExt : `.${newExt}`
    });
}

changeExtension('/path/to/file.txt', '.md');
// '/path/to/file.md'
```

#### Example 4: Get Project Root

```javascript
const path = require('path');

function getProjectRoot(startPath = __dirname) {
    let current = startPath;
    
    while (current !== path.dirname(current)) {
        // Check if package.json exists
        const packagePath = path.join(current, 'package.json');
        
        try {
            require(packagePath);
            return current;  // Found project root!
        } catch {
            current = path.dirname(current);  // Go up one level
        }
    }
    
    return null;  // Not found
}

const projectRoot = getProjectRoot();
```

#### Example 5: Safe Path Join (Security)

```javascript
// Prevent path traversal attacks
function safeJoin(base, userPath) {
    const joined = path.join(base, userPath);
    const normalized = path.normalize(joined);
    
    // Ensure result is still within base directory
    if (!normalized.startsWith(path.normalize(base))) {
        throw new Error('Path traversal detected!');
    }
    
    return normalized;
}

// ✅ Safe
safeJoin('/uploads', 'user/photo.jpg');
// '/uploads/user/photo.jpg'

// ❌ Throws error
safeJoin('/uploads', '../../../etc/passwd');
// Error: Path traversal detected!
```

---

### Common Patterns

```javascript
// 1. Get current script directory
const __dirname = path.dirname(new URL(import.meta.url).pathname);

// 2. Build paths relative to project root
const projectRoot = path.resolve(__dirname, '..');
const configPath = path.join(projectRoot, 'config', 'app.json');

// 3. Resolve module path
const modulePath = require.resolve('express');
const moduleDir = path.dirname(modulePath);

// 4. URL to file path (Windows compatible)
const fileUrl = new URL('file:///C:/Users/john/file.txt');
const filePath = decodeURIComponent(fileUrl.pathname.substring(1));

// 5. Create nested directories
const nestedPath = path.join('deep', 'nested', 'folder');
await fs.mkdir(nestedPath, { recursive: true });
```

---

### Best Practices

✅ **Always use path.join() or path.resolve()** - Never concatenate strings  
✅ **Use __dirname for file paths** - Relative to current file  
✅ **Use process.cwd() for user paths** - Relative to where command ran  
✅ **Normalize user input paths** - Security (path traversal prevention)  
✅ **Use path.extname() for file type checks**  
✅ **Use path.parse() for complex path manipulation**  
✅ **Cross-platform: use path.sep instead of hardcoding / or \**  
✅ **Validate paths before file operations** - Check `path.isAbsolute()`

---

## ৩. os Module - System Information

Operating System এবং hardware সম্পর্কিত information পাওয়ার জন্য।

### System Information

```javascript
const os = require('os');

// 1. Platform information
os.platform();  // 'win32', 'linux', 'darwin' (macOS), 'freebsd'
os.type();      // 'Windows_NT', 'Linux', 'Darwin'
os.release();   // '10.0.19042'
os.version();   // Full OS version string

// 2. Architecture
os.arch();      // 'x64', 'arm', 'arm64'

// 3. Hostname
os.hostname();  // 'my-computer'

// 4. Uptime (seconds since boot)
os.uptime();    // 86400 (1 day)

// 5. Home directory
os.homedir();   // '/home/username' or 'C:\\Users\\username'

// 6. Temp directory
os.tmpdir();    // '/tmp' or 'C:\\Users\\username\\AppData\\Local\\Temp'
```

### Memory Information

```javascript
// Total RAM (bytes)
const totalMem = os.totalmem();
console.log(`Total Memory: ${(totalMem / 1024 / 1024 / 1024).toFixed(2)} GB`);

// Free RAM (bytes)
const freeMem = os.freemem();
console.log(`Free Memory: ${(freeMem / 1024 / 1024 / 1024).toFixed(2)} GB`);

// Memory usage percentage
const usedPercent = ((totalMem - freeMem) / totalMem * 100).toFixed(2);
console.log(`Memory Usage: ${usedPercent}%`);
```

### CPU Information

```javascript
const cpus = os.cpus();

console.log(`CPU Cores: ${cpus.length}`);
console.log(`CPU Model: ${cpus[0].model}`);
console.log(`CPU Speed: ${cpus[0].speed} MHz`);

// CPU usage per core
cpus.forEach((cpu, index) => {
    const total = Object.values(cpu.times).reduce((a, b) => a + b);
    const idle = cpu.times.idle;
    const usage = ((total - idle) / total * 100).toFixed(2);
    
    console.log(`Core ${index}: ${usage}% usage`);
});
```

### Network Interfaces

```javascript
const interfaces = os.networkInterfaces();

Object.keys(interfaces).forEach(name => {
    interfaces[name].forEach(iface => {
        if (iface.family === 'IPv4' && !iface.internal) {
            console.log(`${name}: ${iface.address}`);
        }
    });
});
```

### User Information

```javascript
// Current user info
const userInfo = os.userInfo();

console.log({
    username: userInfo.username,
    uid: userInfo.uid,          // Unix only
    gid: userInfo.gid,          // Unix only
    shell: userInfo.shell,      // Unix only
    homedir: userInfo.homedir
});
```

### Real-World Example: System Monitor

```javascript
function getSystemStats() {
    const totalMem = os.totalmem();
    const freeMem = os.freemem();
    const cpus = os.cpus();
    
    return {
        platform: os.platform(),
        arch: os.arch(),
        hostname: os.hostname(),
        uptime: os.uptime(),
        memory: {
            total: totalMem,
            free: freeMem,
            used: totalMem - freeMem,
            usagePercent: ((totalMem - freeMem) / totalMem * 100).toFixed(2)
        },
        cpu: {
            cores: cpus.length,
            model: cpus[0].model,
            speed: cpus[0].speed
        },
        loadAvg: os.loadavg()  // Unix only: [1min, 5min, 15min]
    };
}

// Usage in monitoring dashboard
setInterval(() => {
    const stats = getSystemStats();
    console.log(stats);
    // Send to monitoring service
}, 60000);  // Every minute
```

---

## ৪. events Module - Event-Driven Architecture

Node.js এর core architecture event-driven। EventEmitter সব asynchronous operations এর foundation।

### Basic Usage

```javascript
const EventEmitter = require('events');
const emitter = new EventEmitter();

// 1. Register listener (on/addListener)
emitter.on('event', (data) => {
    console.log('Event received:', data);
});

// 2. Emit event
emitter.emit('event', { message: 'Hello!' });

// 3. One-time listener (once)
emitter.once('login', (user) => {
    console.log(`${user} logged in`);
});

emitter.emit('login', 'John');  // Logs: John logged in
emitter.emit('login', 'Jane');  // Does nothing (already fired)
```

### Multiple Listeners

```javascript
const emitter = new EventEmitter();

// Multiple listeners for same event
emitter.on('user-registered', (user) => {
    console.log('Send welcome email to', user.email);
});

emitter.on('user-registered', (user) => {
    console.log('Create user profile for', user.name);
});

emitter.on('user-registered', (user) => {
    console.log('Send notification to admins');
});

// Emit once, all listeners execute
emitter.emit('user-registered', {
    name: 'John',
    email: 'john@example.com'
});
```

### Removing Listeners

```javascript
function handler(data) {
    console.log('Received:', data);
}

emitter.on('event', handler);

// Remove specific listener
emitter.off('event', handler);  // or removeListener()

// Remove all listeners for event
emitter.removeAllListeners('event');

// Remove all listeners for all events
emitter.removeAllListeners();
```

### Error Handling

```javascript
// Always listen to 'error' event!
emitter.on('error', (err) => {
    console.error('Error occurred:', err);
});

// If no error listener, Node.js will crash
emitter.emit('error', new Error('Something went wrong'));
```

### Custom EventEmitter Classes

```javascript
class Order extends EventEmitter {
    constructor() {
        super();
    }
    
    place(product, customer) {
        console.log(`Processing order for ${product}`);
        
        // Emit event
        this.emit('order-placed', { product, customer });
        
        setTimeout(() => {
            this.emit('order-shipped', { product, customer });
        }, 2000);
    }
}

const order = new Order();

order.on('order-placed', (data) => {
    console.log(`Email sent to ${data.customer}`);
});

order.on('order-shipped', (data) => {
    console.log(`${data.product} shipped!`);
});

order.place('Laptop', 'john@example.com');
```

### Event Listener Limits

```javascript
// Default max listeners: 10
emitter.getMaxListeners();  // 10

// Increase limit
emitter.setMaxListeners(20);

// Unlimited listeners
emitter.setMaxListeners(0);

// Warning if exceeded (memory leak detection)
```

### Advanced Methods

```javascript
// Get listener count
emitter.listenerCount('event');

// Get all event names
emitter.eventNames();  // ['event1', 'event2']

// Get all listeners for event
const listeners = emitter.listeners('event');

// Prepend listener (execute first)
emitter.prependListener('event', handler);

// Prepend once listener
emitter.prependOnceListener('event', handler);

// Wait for event (Promise-based)
const promise = EventEmitter.once(emitter, 'event');
const [data] = await promise;
```

### Real-World Example: Order Processing System

```javascript
class OrderProcessor extends EventEmitter {
    async processOrder(order) {
        try {
            // Validate order
            this.emit('order-validating', order);
            await this.validateOrder(order);
            this.emit('order-validated', order);
            
            // Process payment
            this.emit('payment-processing', order);
            await this.processPayment(order);
            this.emit('payment-completed', order);
            
            // Ship order
            this.emit('order-shipping', order);
            await this.shipOrder(order);
            this.emit('order-shipped', order);
            
        } catch (error) {
            this.emit('order-failed', { order, error });
        }
    }
    
    validateOrder(order) {
        return new Promise((resolve) => {
            setTimeout(() => resolve(), 100);
        });
    }
    
    processPayment(order) {
        return new Promise((resolve) => {
            setTimeout(() => resolve(), 500);
        });
    }
    
    shipOrder(order) {
        return new Promise((resolve) => {
            setTimeout(() => resolve(), 1000);
        });
    }
}

// Usage
const processor = new OrderProcessor();

// Email service
processor.on('order-validated', (order) => {
    console.log(`📧 Sending confirmation email for order ${order.id}`);
});

// Payment gateway
processor.on('payment-processing', (order) => {
    console.log(`💳 Processing payment of $${order.amount}`);
});

// Shipping service
processor.on('order-shipped', (order) => {
    console.log(`📦 Order ${order.id} shipped!`);
});

// Error handling
processor.on('order-failed', ({ order, error }) => {
    console.error(`❌ Order ${order.id} failed:`, error.message);
});

// Process order
processor.processOrder({
    id: '12345',
    amount: 99.99,
    items: ['Product A', 'Product B']
});
```

### Best Practices

✅ **Always handle 'error' events** - Prevents crashes  
✅ **Use once() for one-time events** - Prevents memory leaks  
✅ **Remove listeners when done** - Cleanup  
✅ **Be careful with listener limits** - Default is 10  
✅ **Use descriptive event names** - 'user:registered' not 'event1'  
✅ **Pass objects as event data** - More flexible than multiple arguments  
✅ **Document your events** - What events are emitted and when

---

## ৫. http & https Modules - Web Servers

HTTP/HTTPS servers তৈরি করার জন্য। Express.js এর foundation এই modules।

### Basic HTTP Server

```javascript
const http = require('http');

const server = http.createServer((req, res) => {
    // Set status code and headers
    res.writeHead(200, {
        'Content-Type': 'text/html',
        'X-Powered-By': 'Node.js'
    });
    
    // Send response
    res.write('<h1>Hello World</h1>');
    res.end();
});

server.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
```

### Routing (Without Express)

```javascript
const http = require('http');
const url = require('url');

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;
    const query = parsedUrl.query;
    
    // Routing
    if (pathname === '/' && req.method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end('<h1>Home Page</h1>');
        
    } else if (pathname === '/api/users' && req.method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ users: ['John', 'Jane'] }));
        
    } else if (pathname === '/api/users' && req.method === 'POST') {
        // Read request body
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            const data = JSON.parse(body);
            res.writeHead(201, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'User created', data }));
        });
        
    } else {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end('<h1>404 Not Found</h1>');
    }
});

server.listen(3000);
```

### HTTPS Server (Secure)

```javascript
const https = require('https');
const fs = require('fs');

const options = {
    key: fs.readFileSync('private-key.pem'),
    cert: fs.readFileSync('certificate.pem')
};

const server = https.createServer(options, (req, res) => {
    res.writeHead(200);
    res.end('Secure Hello World!');
});

server.listen(443);
```

### Making HTTP Requests

```javascript
const http = require('http');

// GET request
http.get('http://api.example.com/users', (res) => {
    let data = '';
    
    res.on('data', (chunk) => {
        data += chunk;
    });
    
    res.on('end', () => {
        console.log(JSON.parse(data));
    });
    
}).on('error', (err) => {
    console.error(err);
});

// POST request
const postData = JSON.stringify({ name: 'John' });

const options = {
    hostname: 'api.example.com',
    port: 80,
    path: '/users',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
    }
};

const req = http.request(options, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => console.log(JSON.parse(data)));
});

req.on('error', (err) => console.error(err));
req.write(postData);
req.end();
```

---

## ৬. crypto Module - Encryption & Hashing

Security operations: hashing, encryption, random data generation।

### Hashing (One-way)

```javascript
const crypto = require('crypto');

// MD5 hash (don't use for passwords!)
const md5 = crypto.createHash('md5').update('password').digest('hex');

// SHA-256 hash
const sha256 = crypto.createHash('sha256').update('password').digest('hex');

// SHA-512 hash (recommended)
const sha512 = crypto.createHash('sha512').update('password').digest('hex');

// HMAC (with secret key)
const hmac = crypto.createHmac('sha256', 'secret-key')
    .update('message')
    .digest('hex');
```

### Password Hashing (bcrypt better, but here's crypto way)

```javascript
// Generate salt
const salt = crypto.randomBytes(16).toString('hex');

// Hash password with salt
crypto.pbkdf2('password', salt, 100000, 64, 'sha512', (err, derivedKey) => {
    if (err) throw err;
    const hash = derivedKey.toString('hex');
    
    // Store: salt + hash
    const stored = `${salt}:${hash}`;
});

// Verify password
function verifyPassword(password, stored) {
    const [salt, hash] = stored.split(':');
    
    crypto.pbkdf2(password, salt, 100000, 64, 'sha512', (err, derivedKey) => {
        if (err) throw err;
        const inputHash = derivedKey.toString('hex');
        return hash === inputHash;
    });
}
```

### Random Data Generation

```javascript
// Random bytes
const randomBytes = crypto.randomBytes(32).toString('hex');
// For tokens, session IDs

// Random UUID
const uuid = crypto.randomUUID();
// 'f7c8d2a0-5b3e-4d6f-8e9c-1a2b3c4d5e6f'

// Random integer
const randomInt = crypto.randomInt(1, 100);  // 1 to 99
```

### Encryption & Decryption

```javascript
const algorithm = 'aes-256-cbc';
const key = crypto.randomBytes(32);  // Must be 32 bytes for aes-256
const iv = crypto.randomBytes(16);   // Initialization vector

// Encrypt
function encrypt(text) {
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
}

// Decrypt
function decrypt(encrypted) {
    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}

const encrypted = encrypt('Secret message');
const decrypted = decrypt(encrypted);  // 'Secret message'
```

---

## ৭. stream Module - Efficient Data Processing

Large data process করার efficient way। Memory-তে সব data load না করে chunk by chunk process করে।

### Why Streams?

```javascript
// ❌ Bad: Load entire 1GB file in memory
const fs = require('fs');
const data = fs.readFileSync('1gb-file.txt');  // 💥 Out of memory!

// ✅ Good: Process in chunks
const stream = fs.createReadStream('1gb-file.txt');
stream.on('data', (chunk) => {
    // Process small chunk
});
```

### Types of Streams

1. **Readable** - Read data (fs.createReadStream)
2. **Writable** - Write data (fs.createWriteStream)
3. **Duplex** - Read & write (TCP socket)
4. **Transform** - Modify data while reading/writing (compression)

### Reading Streams

```javascript
const fs = require('fs');

const readStream = fs.createReadStream('large-file.txt', {
    encoding: 'utf8',
    highWaterMark: 64 * 1024  // 64KB chunks
});

readStream.on('data', (chunk) => {
    console.log('Received chunk:', chunk.length);
});

readStream.on('end', () => {
    console.log('Finished reading');
});

readStream.on('error', (err) => {
    console.error('Error:', err);
});
```

### Writing Streams

```javascript
const writeStream = fs.createWriteStream('output.txt');

writeStream.write('Line 1\n');
writeStream.write('Line 2\n');
writeStream.end('Final line\n');

writeStream.on('finish', () => {
    console.log('File written');
});
```

### Piping Streams (Most Common)

```javascript
// Copy file
const readStream = fs.createReadStream('input.txt');
const writeStream = fs.createWriteStream('output.txt');

readStream.pipe(writeStream);

// With error handling
readStream
    .on('error', err => console.error('Read error:', err))
    .pipe(writeStream)
    .on('error', err => console.error('Write error:', err))
    .on('finish', () => console.log('Done!'));
```

### Transform Streams

```javascript
const { Transform } = require('stream');

// Create uppercase transform
const upperCaseTransform = new Transform({
    transform(chunk, encoding, callback) {
        this.push(chunk.toString().toUpperCase());
        callback();
    }
});

// Use in pipeline
fs.createReadStream('input.txt')
    .pipe(upperCaseTransform)
    .pipe(fs.createWriteStream('output.txt'));
```

### Real Example: File Compression

```javascript
const zlib = require('zlib');

// Compress file
fs.createReadStream('large-file.txt')
    .pipe(zlib.createGzip())
    .pipe(fs.createWriteStream('large-file.txt.gz'));

// Decompress file
fs.createReadStream('large-file.txt.gz')
    .pipe(zlib.createGunzip())
    .pipe(fs.createWriteStream('large-file.txt'));
```

---

## ৮. buffer Module - Binary Data

Binary data handle করার জন্য। Files, network data, images সব কিছু।

### Creating Buffers

```javascript
// From string
const buf1 = Buffer.from('Hello', 'utf8');

// Empty buffer (filled with zeros)
const buf2 = Buffer.alloc(10);

// Uninitialized buffer (faster but unsafe)
const buf3 = Buffer.allocUnsafe(10);

// From array
const buf4 = Buffer.from([72, 101, 108, 108, 111]);  // 'Hello'
```

### Reading & Writing

```javascript
const buf = Buffer.alloc(10);

// Write string
buf.write('Hello', 0, 'utf8');

// Read string
const str = buf.toString('utf8', 0, 5);  // 'Hello'

// Write numbers
buf.writeUInt8(255, 0);      // 1 byte
buf.writeUInt16BE(65535, 1); // 2 bytes, big endian
buf.writeUInt32LE(123456, 3); // 4 bytes, little endian

// Read numbers
buf.readUInt8(0);
buf.readUInt16BE(1);
```

### Buffer Operations

```javascript
const buf1 = Buffer.from('Hello ');
const buf2 = Buffer.from('World');

// Concatenate
const buf3 = Buffer.concat([buf1, buf2]);
console.log(buf3.toString());  // 'Hello World'

// Compare
Buffer.compare(buf1, buf2);  // -1, 0, or 1

// Copy
const target = Buffer.alloc(20);
buf1.copy(target, 0);

// Slice
const slice = buf3.slice(0, 5);  // 'Hello'
```

---

## ৯. process Module - Current Process Info

Current Node.js process সম্পর্কে information এবং control।

### Process Information

```javascript
// Node.js version
process.version;        // 'v18.12.0'
process.versions;       // { node: '18.12.0', v8: '10.2.154.15', ... }

// Platform & architecture
process.platform;       // 'win32', 'linux', 'darwin'
process.arch;           // 'x64', 'arm64'

// Process IDs
process.pid;            // Process ID
process.ppid;           // Parent process ID

// Current working directory
process.cwd();          // '/path/to/project'
process.chdir('/new/path');  // Change directory

// Execution path
process.execPath;       // '/usr/bin/node'

// Memory usage
process.memoryUsage();
// {
//   rss: 36864000,        // Resident set size
//   heapTotal: 7159808,   // V8's total heap
//   heapUsed: 4654456,    // V8's used heap
//   external: 855376,     // C++ objects
//   arrayBuffers: 26812   // ArrayBuffers and SharedArrayBuffers
// }

// CPU usage
process.cpuUsage();
// { user: 38579, system: 6986 }  // microseconds

// Uptime
process.uptime();       // Seconds since process started
```

### Environment Variables

```javascript
// Read
process.env.NODE_ENV;   // 'development', 'production'
process.env.PORT;       // '3000'

// Set
process.env.MY_VAR = 'value';

// All environment variables
console.log(process.env);
```

### Command Line Arguments

```javascript
// node app.js arg1 arg2 --flag
process.argv;
// [
//   '/usr/bin/node',     // Node executable
//   '/path/to/app.js',   // Script file
//   'arg1',              // First argument
//   'arg2',              // Second argument
//   '--flag'             // Flag
// ]

// Get arguments (skip first 2)
const args = process.argv.slice(2);
```

### Exit Process

```javascript
// Exit with success
process.exit(0);

// Exit with error
process.exit(1);

// Before exit event
process.on('exit', (code) => {
    console.log(`Process exiting with code: ${code}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received, closing server...');
    server.close(() => {
        process.exit(0);
    });
});
```

### Standard Streams

```javascript
// stdin (input)
process.stdin.on('data', (data) => {
    console.log('You entered:', data.toString());
});

// stdout (output)
process.stdout.write('Hello World\n');

// stderr (errors)
process.stderr.write('Error message\n');
```

---

## সারাংশ

Node.js built-in modules অত্যন্ত powerful এবং production-ready। এগুলো ভালো করে শিখলে:

✅ External dependencies কমবে  
✅ Performance improve হবে  
✅ Security better হবে  
✅ Lower-level control পাবেন  

**Next Steps:**
1. এই modules দিয়ে ছোট projects বানান
2. Express.js source code পড়ুন (এগুলো কিভাবে use করে)
3. Stream এবং Buffer নিয়ে আরও practice করুন
4. Production apps এ apply করুন

Happy Coding! 🚀
