# File Uploads (ফাইল আপলোড)

## File Upload কী?

**File Upload** হলো client থেকে server-এ file (image, PDF, video, document) পাঠানোর প্রক্রিয়া। সাধারণ JSON request-এর মতো না — file binary data, তাই এর জন্য আলাদা mechanism দরকার।

```
Regular Request:
  POST /api/users  →  { "name": "Ripon", "email": "ripon@test.com" }
  Content-Type: application/json

File Upload Request:
  POST /api/upload  →  [binary file data + metadata]
  Content-Type: multipart/form-data
```

---

## multipart/form-data কী?

সাধারণ JSON-এ file পাঠানো যায় না। `multipart/form-data` হলো এমন একটা encoding যেখানে **text data ও binary file একসাথে** পাঠানো যায়:

```
POST /api/upload HTTP/1.1
Content-Type: multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW

------WebKitFormBoundary7MA4YWxkTrZu0gW
Content-Disposition: form-data; name="title"

My Profile Photo
------WebKitFormBoundary7MA4YWxkTrZu0gW
Content-Disposition: form-data; name="avatar"; filename="photo.jpg"
Content-Type: image/jpeg

[binary image data...]
------WebKitFormBoundary7MA4YWxkTrZu0gW--
```

```
multipart/form-data এর গঠন:
─────────────────────────────
boundary → প্রতিটি part আলাদা করে
প্রতিটি part-এ:
  name    → field name
  filename → (file হলে) original filename
  Content-Type → file-এর MIME type
  [data]  → actual content (text বা binary)
```

---

## Multer (Node.js/Express)

Node.js-এ file upload handle করার সবচেয়ে popular library:

### Installation

```bash
npm install multer
```

### Basic Setup — Disk Storage

```javascript
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname);
    cb(null, `${uniqueName}${ext}`);
  },
});

const upload = multer({ storage });
```

### Single File Upload

```javascript
app.post("/api/avatar", upload.single("avatar"), (req, res) => {
  // req.file → uploaded file info
  console.log(req.file);
  // {
  //   fieldname: 'avatar',
  //   originalname: 'photo.jpg',
  //   encoding: '7bit',
  //   mimetype: 'image/jpeg',
  //   destination: 'uploads/',
  //   filename: '1708300000000-123456789.jpg',
  //   path: 'uploads/1708300000000-123456789.jpg',
  //   size: 245678
  // }

  res.json({
    message: "File uploaded",
    file: {
      filename: req.file.filename,
      size: req.file.size,
      url: `/uploads/${req.file.filename}`,
    },
  });
});
```

### Multiple File Upload

```javascript
// একই field-এ একাধিক file (max 5)
app.post("/api/gallery", upload.array("photos", 5), (req, res) => {
  // req.files → array of uploaded files
  const files = req.files.map((f) => ({
    filename: f.filename,
    size: f.size,
    url: `/uploads/${f.filename}`,
  }));
  res.json({ files });
});

// আলাদা আলাদা field-এ file
app.post(
  "/api/document",
  upload.fields([
    { name: "resume", maxCount: 1 },
    { name: "coverLetter", maxCount: 1 },
    { name: "certificates", maxCount: 5 },
  ]),
  (req, res) => {
    // req.files.resume[0]
    // req.files.coverLetter[0]
    // req.files.certificates[0..4]
    res.json({ message: "Documents uploaded" });
  },
);
```

### Memory Storage (Buffer-এ রাখো)

Disk-এ না রেখে memory-তে রাখো — cloud-এ upload করার আগে process করার জন্য ভালো:

```javascript
const upload = multer({
  storage: multer.memoryStorage(),
});

app.post("/api/avatar", upload.single("avatar"), (req, res) => {
  // req.file.buffer → file-এর binary data (Buffer)
  // এটা সরাসরি S3/Cloudinary-তে পাঠাতে পারো

  console.log(req.file.buffer); // <Buffer ff d8 ff e0 ...>
  console.log(req.file.size); // 245678
  console.log(req.file.mimetype); // 'image/jpeg'
});
```

---

## File Validation

File upload-এ validation অত্যন্ত গুরুত্বপূর্ণ — না করলে server-এ malware upload হতে পারে:

### File Type Validation

```javascript
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (ALLOWED_TYPES.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new Error(
          `File type '${file.mimetype}' not allowed. Allowed: ${ALLOWED_TYPES.join(", ")}`,
        ),
      );
    }
  },
});
```

### File Size Limit

```javascript
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max
    files: 5, // Max 5 files
    fields: 10, // Max 10 non-file fields
    fieldSize: 1024 * 1024, // 1MB max per field value
  },
});
```

### Magic Number Validation (MIME Sniffing)

File extension change করে `.jpg` বানিয়ে `.exe` upload করা যায়। তাই extension না, **file-এর actual content** check করো:

```bash
npm install file-type
```

```javascript
const { fileTypeFromBuffer } = require("file-type");

async function validateFileContent(req, res, next) {
  if (!req.file) return next();

  const type = await fileTypeFromBuffer(req.file.buffer);

  if (!type || !ALLOWED_TYPES.includes(type.mime)) {
    return res.status(400).json({
      error: "Invalid file type",
      detected: type?.mime || "unknown",
      allowed: ALLOWED_TYPES,
    });
  }

  req.file.detectedType = type;
  next();
}

app.post(
  "/api/avatar",
  upload.single("avatar"),
  validateFileContent,
  uploadHandler,
);
```

```
Extension check:  photo.exe → rename → photo.jpg → ✅ Pass! 😱
Magic number:     photo.exe → rename → photo.jpg → ❌ Blocked!
                  (file content-এ EXE signature detect করে)

Common Magic Numbers:
  JPEG: FF D8 FF
  PNG:  89 50 4E 47
  GIF:  47 49 46 38
  PDF:  25 50 44 46
  ZIP:  50 4B 03 04
```

### Complete Validation Middleware

```javascript
function createUploadValidator(options) {
  const { allowedTypes, maxSize = 5 * 1024 * 1024, maxFiles = 1 } = options;

  return [
    multer({
      storage: multer.memoryStorage(),
      limits: { fileSize: maxSize, files: maxFiles },
      fileFilter: (req, file, cb) => {
        if (allowedTypes.includes(file.mimetype)) {
          cb(null, true);
        } else {
          cb(new Error(`Allowed types: ${allowedTypes.join(", ")}`));
        }
      },
    }).single("file"),

    async (req, res, next) => {
      if (!req.file) {
        return res.status(400).json({ error: "File is required" });
      }

      // Magic number check
      const type = await fileTypeFromBuffer(req.file.buffer);
      if (!type || !allowedTypes.includes(type.mime)) {
        return res
          .status(400)
          .json({ error: "File content does not match type" });
      }

      next();
    },
  ];
}

// Usage:
const avatarUpload = createUploadValidator({
  allowedTypes: ["image/jpeg", "image/png", "image/webp"],
  maxSize: 2 * 1024 * 1024, // 2MB
});

const documentUpload = createUploadValidator({
  allowedTypes: ["application/pdf"],
  maxSize: 10 * 1024 * 1024, // 10MB
});

app.post("/api/avatar", ...avatarUpload, uploadAvatar);
app.post("/api/documents", ...documentUpload, uploadDocument);
```

---

## File Storage Strategies

### Strategy 1: Local Disk Storage

```javascript
// uploads/ folder-এ save
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// Static file serve
app.use("/uploads", express.static("uploads"));
```

```
✅ Simple, no extra cost
✅ Fast (local disk)
❌ Server crash → files lost
❌ Multiple servers → file শুধু একটা server-এ
❌ Disk space limited
❌ No CDN, slow for global users

Best For: Development, small projects
```

### Strategy 2: Cloud Storage (S3/GCS/Azure Blob)

```bash
npm install @aws-sdk/client-s3 @aws-sdk/s3-request-presigner
```

```javascript
const {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const { v4: uuidv4 } = require("uuid");

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

async function uploadToS3(file) {
  const key = `uploads/${uuidv4()}-${file.originalname}`;

  await s3.send(
    new PutObjectCommand({
      Bucket: process.env.S3_BUCKET,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    }),
  );

  return {
    key,
    url: `https://${process.env.S3_BUCKET}.s3.amazonaws.com/${key}`,
  };
}

app.post("/api/avatar", upload.single("avatar"), async (req, res) => {
  const result = await uploadToS3(req.file);

  await User.findByIdAndUpdate(req.user.id, { avatar: result.url });

  res.json({ url: result.url });
});
```

```
✅ Unlimited storage
✅ Highly durable (99.999999999%)
✅ CDN integration (CloudFront)
✅ Multiple servers → same storage
✅ Backup, versioning built-in
❌ Cost (storage + transfer)
❌ Network latency
❌ Vendor lock-in

Best For: Production, scalable apps
```

### Strategy 3: Pre-signed URL (Direct Upload)

File server-এর মধ্য দিয়ে না গিয়ে **client সরাসরি S3-এ upload** করে:

```javascript
// Step 1: Server generates pre-signed URL
app.post("/api/upload/presign", authenticate, async (req, res) => {
  const { filename, contentType } = req.body;
  const key = `uploads/${req.user.id}/${uuidv4()}-${filename}`;

  const command = new PutObjectCommand({
    Bucket: process.env.S3_BUCKET,
    Key: key,
    ContentType: contentType,
  });

  const signedUrl = await getSignedUrl(s3, command, { expiresIn: 300 });

  res.json({ uploadUrl: signedUrl, key });
});

// Step 2: Client uploads directly to S3 using the signed URL
// (Frontend code)
// const response = await fetch(uploadUrl, {
//     method: 'PUT',
//     body: file,
//     headers: { 'Content-Type': file.type }
// });

// Step 3: Client confirms upload
app.post("/api/upload/confirm", authenticate, async (req, res) => {
  const { key } = req.body;
  await User.findByIdAndUpdate(req.user.id, {
    avatar: `https://${process.env.S3_BUCKET}.s3.amazonaws.com/${key}`,
  });
  res.json({ message: "Upload confirmed" });
});
```

```
Regular Upload:
  Client → [file] → Server → [file] → S3
  (Server-এর bandwidth খরচ হচ্ছে, double transfer)

Pre-signed URL:
  Client → Server (get URL) → Client → [file] → S3 (direct!)
  (Server-এ file যায়ই না, lightweight)

✅ Server load কমে (file pass-through নেই)
✅ বড় file-এ ideal (video, large images)
✅ Faster upload (direct to cloud)
❌ Complex flow (3 steps)
❌ Client-side validation-এ নির্ভর করতে হয়
```

---

## Image Processing

Upload-এর পর image resize, compress, thumbnail তৈরি করা common:

### Sharp (Node.js Image Processing)

```bash
npm install sharp
```

```javascript
const sharp = require("sharp");

async function processImage(buffer) {
  const processed = await sharp(buffer)
    .resize(800, 800, {
      fit: "inside", // aspect ratio রাখো
      withoutEnlargement: true, // ছোট image বড় করো না
    })
    .jpeg({ quality: 80 }) // JPEG-এ convert, 80% quality
    .toBuffer();

  return processed;
}

// Thumbnail তৈরি
async function createThumbnail(buffer) {
  return sharp(buffer)
    .resize(200, 200, { fit: "cover" })
    .jpeg({ quality: 70 })
    .toBuffer();
}

app.post("/api/avatar", upload.single("avatar"), async (req, res) => {
  const processed = await processImage(req.file.buffer);
  const thumbnail = await createThumbnail(req.file.buffer);

  const [mainResult, thumbResult] = await Promise.all([
    uploadToS3({ ...req.file, buffer: processed }, "avatars/"),
    uploadToS3({ ...req.file, buffer: thumbnail }, "avatars/thumbs/"),
  ]);

  await User.findByIdAndUpdate(req.user.id, {
    avatar: mainResult.url,
    avatarThumb: thumbResult.url,
  });

  res.json({ avatar: mainResult.url, thumbnail: thumbResult.url });
});
```

### Multiple Sizes তৈরি

```javascript
const IMAGE_SIZES = {
  thumbnail: { width: 150, height: 150, fit: "cover" },
  small: { width: 320, height: 320, fit: "inside" },
  medium: { width: 640, height: 640, fit: "inside" },
  large: { width: 1280, height: 1280, fit: "inside" },
};

async function generateVariants(buffer) {
  const variants = {};

  for (const [name, options] of Object.entries(IMAGE_SIZES)) {
    variants[name] = await sharp(buffer)
      .resize(options.width, options.height, {
        fit: options.fit,
        withoutEnlargement: true,
      })
      .webp({ quality: 80 })
      .toBuffer();
  }

  return variants;
}
```

---

## File Upload — Frontend (Client-Side)

### HTML Form

```html
<form action="/api/upload" method="POST" enctype="multipart/form-data">
  <input type="file" name="avatar" accept="image/*" />
  <button type="submit">Upload</button>
</form>
```

### JavaScript (Fetch API)

```javascript
async function uploadFile(file) {
  const formData = new FormData();
  formData.append("avatar", file);
  formData.append("title", "Profile Photo");

  const response = await fetch("/api/upload", {
    method: "POST",
    body: formData,
    // Content-Type header দেওয়ার দরকার নেই
    // fetch automatically multipart/form-data set করে
  });

  return response.json();
}

// Input change event
document.getElementById("fileInput").addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (file) uploadFile(file);
});
```

### Upload Progress

```javascript
function uploadWithProgress(file, onProgress) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    const formData = new FormData();
    formData.append("file", file);

    xhr.upload.addEventListener("progress", (e) => {
      if (e.lengthComputable) {
        const percent = Math.round((e.loaded / e.total) * 100);
        onProgress(percent);
      }
    });

    xhr.addEventListener("load", () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(JSON.parse(xhr.responseText));
      } else {
        reject(new Error(`Upload failed: ${xhr.status}`));
      }
    });

    xhr.addEventListener("error", () => reject(new Error("Network error")));

    xhr.open("POST", "/api/upload");
    xhr.send(formData);
  });
}

// Usage:
uploadWithProgress(file, (percent) => {
  console.log(`Upload: ${percent}%`);
  progressBar.style.width = `${percent}%`;
});
```

### Drag & Drop

```javascript
const dropZone = document.getElementById("dropZone");

dropZone.addEventListener("dragover", (e) => {
  e.preventDefault();
  dropZone.classList.add("drag-over");
});

dropZone.addEventListener("dragleave", () => {
  dropZone.classList.remove("drag-over");
});

dropZone.addEventListener("drop", (e) => {
  e.preventDefault();
  dropZone.classList.remove("drag-over");

  const files = Array.from(e.dataTransfer.files);
  files.forEach((file) => uploadFile(file));
});
```

---

## Chunked / Resumable Upload

বড় file (100MB+) upload করতে গেলে network disconnect হতে পারে। **Chunked upload** মানে file ছোট ছোট piece-এ ভেঙে পাঠানো:

```
Regular Upload:
  [======== 500MB file ========] → একবারে পাঠাও
  Network fail → আবার শুরু থেকে! 😫

Chunked Upload:
  [=chunk1=][=chunk2=][=chunk3=]...[=chunkN=]
  5MB each → একটা একটা করে পাঠাও
  Network fail → যেখান থেকে থেমেছিল সেখান থেকে resume! ✅
```

### Server-Side (Chunked Upload)

```javascript
const fs = require("fs");
const path = require("path");

app.post("/api/upload/chunk", upload.single("chunk"), async (req, res) => {
  const { uploadId, chunkIndex, totalChunks, filename } = req.body;

  const chunkDir = path.join("temp", uploadId);
  if (!fs.existsSync(chunkDir)) {
    fs.mkdirSync(chunkDir, { recursive: true });
  }

  const chunkPath = path.join(chunkDir, `chunk-${chunkIndex}`);
  fs.writeFileSync(chunkPath, req.file.buffer);

  res.json({ chunkIndex, received: true });
});

app.post("/api/upload/complete", async (req, res) => {
  const { uploadId, totalChunks, filename } = req.body;
  const chunkDir = path.join("temp", uploadId);
  const finalPath = path.join("uploads", `${uploadId}-${filename}`);

  const writeStream = fs.createWriteStream(finalPath);

  for (let i = 0; i < totalChunks; i++) {
    const chunkPath = path.join(chunkDir, `chunk-${i}`);
    const chunkData = fs.readFileSync(chunkPath);
    writeStream.write(chunkData);
  }

  writeStream.end();

  // Cleanup temp chunks
  fs.rmSync(chunkDir, { recursive: true });

  res.json({
    message: "Upload complete",
    url: `/uploads/${uploadId}-${filename}`,
  });
});
```

### Client-Side (Chunked Upload)

```javascript
async function chunkedUpload(file, chunkSize = 5 * 1024 * 1024) {
  const uploadId = crypto.randomUUID();
  const totalChunks = Math.ceil(file.size / chunkSize);

  for (let i = 0; i < totalChunks; i++) {
    const start = i * chunkSize;
    const end = Math.min(start + chunkSize, file.size);
    const chunk = file.slice(start, end);

    const formData = new FormData();
    formData.append("chunk", chunk);
    formData.append("uploadId", uploadId);
    formData.append("chunkIndex", i);
    formData.append("totalChunks", totalChunks);
    formData.append("filename", file.name);

    await fetch("/api/upload/chunk", {
      method: "POST",
      body: formData,
    });

    console.log(`Chunk ${i + 1}/${totalChunks} uploaded`);
  }

  // সব chunk পাঠানো হয়ে গেলে merge request
  const response = await fetch("/api/upload/complete", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ uploadId, totalChunks, filename: file.name }),
  });

  return response.json();
}
```

### tus Protocol (Resumable Upload Standard)

```bash
npm install tus-js-client   # Client
npm install @tus/server     # Server
```

```javascript
// Server
const { Server } = require("@tus/server");
const { FileStore } = require("@tus/file-store");

const tusServer = new Server({
  path: "/api/tus",
  datastore: new FileStore({ directory: "./uploads" }),
});

app.all("/api/tus/*", (req, res) => tusServer.handle(req, res));
```

```javascript
// Client
import * as tus from "tus-js-client";

const upload = new tus.Upload(file, {
  endpoint: "/api/tus/",
  retryDelays: [0, 1000, 3000, 5000],
  chunkSize: 5 * 1024 * 1024,
  metadata: { filename: file.name, filetype: file.type },
  onProgress: (bytesUploaded, bytesTotal) => {
    const percentage = ((bytesUploaded / bytesTotal) * 100).toFixed(2);
    console.log(`${percentage}%`);
  },
  onSuccess: () => console.log("Upload complete:", upload.url),
});

upload.start();

// Network fail হলে:
// upload.start() আবার call করলে automatically resume করবে!
```

---

## Python — FastAPI File Upload

```python
from fastapi import FastAPI, File, UploadFile, HTTPException
import shutil, uuid
from pathlib import Path

app = FastAPI()

UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)

ALLOWED_TYPES = {"image/jpeg", "image/png", "image/webp"}
MAX_SIZE = 5 * 1024 * 1024  # 5MB

@app.post("/api/upload")
async def upload_file(file: UploadFile = File(...)):
    # Type check
    if file.content_type not in ALLOWED_TYPES:
        raise HTTPException(400, f"Type '{file.content_type}' not allowed")

    # Size check
    contents = await file.read()
    if len(contents) > MAX_SIZE:
        raise HTTPException(400, "File too large (max 5MB)")

    # Save
    filename = f"{uuid.uuid4()}-{file.filename}"
    filepath = UPLOAD_DIR / filename

    with open(filepath, "wb") as f:
        f.write(contents)

    return {"filename": filename, "size": len(contents)}

@app.post("/api/upload/multiple")
async def upload_multiple(files: list[UploadFile] = File(...)):
    results = []
    for file in files:
        contents = await file.read()
        filename = f"{uuid.uuid4()}-{file.filename}"
        with open(UPLOAD_DIR / filename, "wb") as f:
            f.write(contents)
        results.append({"filename": filename, "size": len(contents)})
    return results
```

---

## Security Best Practices

### ১. Never Trust the Filename

```javascript
// ❌ User-এর filename সরাসরি ব্যবহার করো না
const path = `uploads/${req.file.originalname}`;
// User filename: "../../../etc/passwd" → Path Traversal!

// ✅ নিজের filename generate করো
const filename = `${uuidv4()}${path.extname(req.file.originalname)}`;
```

### ২. Never Trust Content-Type Header

```javascript
// ❌ শুধু Content-Type header check
if (file.mimetype === "image/jpeg") {
}
// User header spoof করতে পারে!

// ✅ File content (magic number) check
const type = await fileTypeFromBuffer(file.buffer);
```

### ৩. Virus/Malware Scan

```bash
npm install clamscan
```

```javascript
const NodeClam = require("clamscan");

const clam = await new NodeClam().init({
  clamdscan: { host: "127.0.0.1", port: 3310 },
});

async function scanFile(filePath) {
  const { isInfected, viruses } = await clam.isInfected(filePath);
  if (isInfected) {
    fs.unlinkSync(filePath);
    throw new Error(`Malware detected: ${viruses.join(", ")}`);
  }
}
```

### ৪. Upload Directory Security

```javascript
// ❌ Upload folder app root-এ
// uploads/ → accessible via path traversal

// ✅ Upload folder web root-এর বাইরে
const UPLOAD_DIR = "/var/data/uploads/";

// ✅ Serve through a controller (not static)
app.get("/files/:filename", authenticate, (req, res) => {
  const filepath = path.join(UPLOAD_DIR, path.basename(req.params.filename));
  if (!fs.existsSync(filepath)) return res.status(404).send("Not found");
  res.sendFile(filepath);
});
```

### ৫. Rate Limiting

```javascript
const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20, // Max 20 uploads per hour
  message: { error: "Too many uploads, try again later" },
});

app.post(
  "/api/upload",
  authenticate,
  uploadLimiter,
  upload.single("file"),
  handler,
);
```

### ৬. Storage Quota

```javascript
async function checkStorageQuota(userId) {
  const totalSize = await File.aggregate([
    { $match: { userId } },
    { $group: { _id: null, total: { $sum: "$size" } } },
  ]);

  const used = totalSize[0]?.total || 0;
  const QUOTA = 100 * 1024 * 1024; // 100MB per user

  if (used >= QUOTA) {
    throw new Error("Storage quota exceeded");
  }

  return { used, remaining: QUOTA - used };
}
```

---

## File Upload Architecture — Production

```
┌─────────┐     ┌──────────┐     ┌────────────┐     ┌─────────┐
│  Client  │────→│  Server   │────→│ Cloud      │────→│  CDN    │
│          │     │ (API)     │     │ Storage    │     │         │
│  - Form  │     │ - Validate│     │ (S3/GCS)   │     │ - Cache │
│  - Drag  │     │ - Process │     │ - Original │     │ - Edge  │
│  - Chunk │     │ - Upload  │     │ - Variants │     │ - Fast  │
└─────────┘     └──────┬───┘     └────────────┘     └─────────┘
                       │
                       ▼
                 ┌──────────┐
                 │ Database  │
                 │ (metadata)│
                 │ - url     │
                 │ - size    │
                 │ - type    │
                 │ - userId  │
                 └──────────┘
```

```
Database-এ file save করো না!
Database-এ শুধু metadata রাখো (url, size, type, userId)
File → Cloud Storage (S3/GCS)
Serve → CDN (CloudFront/Cloudflare)
```

---

## সংক্ষেপে মনে রাখার সূত্র

```
File Upload = multipart/form-data encoding-এ binary data পাঠানো

Node.js → Multer (diskStorage বা memoryStorage)
Python → FastAPI File/UploadFile

Validation (MUST):
  ✅ File type (MIME + magic number)
  ✅ File size limit
  ✅ Filename sanitize (never trust original)
  ✅ Virus scan (production)

Storage Strategies:
  Local Disk    → Dev only
  Cloud (S3)    → Production ✅
  Pre-signed URL → Large files, client direct upload ✅

Image Processing → Sharp (resize, compress, thumbnail, webp)

Chunked Upload → বড় file ভেঙে ভেঙে পাঠাও, resume support
tus Protocol → Standard resumable upload

Security:
  ❌ Original filename ব্যবহার করো না
  ❌ Content-Type header trust করো না
  ✅ Magic number check করো
  ✅ Upload rate limit করো
  ✅ Storage quota enforce করো
  ✅ Upload directory web root-এর বাইরে রাখো

Production Architecture:
  Client → Server (validate + process) → S3 (store) → CDN (serve)
  Database-এ শুধু metadata রাখো, file না!
```

---

## Interview Golden Lines

> **File uploads use multipart/form-data encoding because JSON cannot represent binary data efficiently.**

> **Never trust the filename or Content-Type header — always generate unique filenames and validate file content with magic numbers.**

> **For production, store files in cloud storage (S3/GCS) and serve through a CDN — never store in the database or rely solely on local disk.**

> **Pre-signed URLs let clients upload directly to cloud storage, reducing server bandwidth and load.**

> **Chunked/resumable uploads (tus protocol) are essential for large files — they allow uploads to resume after network interruptions.**

> **Always validate file type, size, and content; rate-limit uploads; and enforce per-user storage quotas.**
