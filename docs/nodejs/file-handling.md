# File Handling in Node.js - সম্পূর্ণ গাইড

File Handling হলো Node.js অ্যাপ্লিকেশনের একটি অত্যন্ত গুরুত্বপূর্ণ অংশ। ফাইল আপলোড, ভ্যালিডেশন, ইমেজ প্রসেসিং, ক্লাউড স্টোরেজ—সবকিছুই এখানে শিখবেন।

## 📑 Table of Contents
1. [File Upload (Multer)](#file-upload-multer)
2. [File Validation](#file-validation)
3. [Image Processing (Sharp)](#image-processing-sharp)
4. [File Storage Strategies](#file-storage-strategies)
5. [Cloud Storage Integration](#cloud-storage-integration)
6. [CSV/Excel File Handling](#csvexcel-file-handling)
7. [PDF Generation](#pdf-generation)

---

## File Upload (Multer)

Multer হলো একটি Node.js middleware যা মূলত `multipart/form-data` হ্যান্ডল করার জন্য ব্যবহৃত হয়, যা ফাইল আপলোডের জন্য অপরিহার্য।

### Installation

```bash
npm install multer
```

### 1. Multer Middleware Setup

**Basic Setup:**

```javascript
const express = require('express');
const multer = require('multer');
const app = express();

// Simple upload configuration
const upload = multer({ dest: 'uploads/' });

app.post('/upload', upload.single('file'), (req, res) => {
  console.log(req.file);
  res.send('File uploaded successfully!');
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
```

**ব্যাখ্যা:**
- `dest: 'uploads/'` - ফাইল কোথায় সেভ হবে তা নির্ধারণ করে
- `upload.single('file')` - একটি ফাইল আপলোড করার জন্য, যেখানে 'file' হলো form field এর নাম
- `req.file` - আপলোড করা ফাইলের তথ্য

### 2. Single File Upload

```javascript
const express = require('express');
const multer = require('multer');
const path = require('path');
const app = express();

// Storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

app.post('/upload', upload.single('avatar'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }
  
  res.json({
    message: 'File uploaded successfully',
    file: {
      filename: req.file.filename,
      originalname: req.file.originalname,
      size: req.file.size,
      path: req.file.path
    }
  });
});
```

**req.file এর গুরুত্বপূর্ণ properties:**
- `fieldname` - Form এ field এর নাম
- `originalname` - ইউজারের কম্পিউটারে ফাইলের নাম
- `encoding` - ফাইলের encoding type
- `mimetype` - ফাইলের MIME type
- `size` - ফাইলের সাইজ (bytes এ)
- `destination` - ফাইল কোথায় সেভ হয়েছে
- `filename` - সেভ করা ফাইলের নাম
- `path` - আপলোড করা ফাইলের সম্পূর্ণ path

### 3. Multiple Files Upload

**একই field থেকে multiple files:**

```javascript
// Maximum 5 files একসাথে
app.post('/upload-multiple', upload.array('photos', 5), (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).send('No files uploaded.');
  }
  
  const fileDetails = req.files.map(file => ({
    filename: file.filename,
    originalname: file.originalname,
    size: file.size
  }));
  
  res.json({
    message: `${req.files.length} files uploaded successfully`,
    files: fileDetails
  });
});
```

**বিভিন্ন field থেকে files:**

```javascript
const uploadFields = upload.fields([
  { name: 'avatar', maxCount: 1 },
  { name: 'gallery', maxCount: 8 }
]);

app.post('/profile', uploadFields, (req, res) => {
  console.log(req.files.avatar); // Array of avatar files
  console.log(req.files.gallery); // Array of gallery files
  
  res.json({
    message: 'Files uploaded successfully',
    avatar: req.files.avatar[0].filename,
    gallery: req.files.gallery.map(f => f.filename)
  });
});
```

### 4. File Filtering

শুধুমাত্র নির্দিষ্ট ধরনের ফাইল accept করা:

```javascript
const fileFilter = (req, file, cb) => {
  // শুধুমাত্র image files accept করবে
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter
});
```

**নির্দিষ্ট extensions এর জন্য:**

```javascript
const fileFilter = (req, file, cb) => {
  const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif'];
  const ext = path.extname(file.originalname).toLowerCase();
  
  if (allowedExtensions.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPG, JPEG, PNG and GIF are allowed.'), false);
  }
};
```

### 5. Storage Engines

**Disk Storage:**

```javascript
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // ফাইল টাইপ অনুযায়ী আলাদা folder
    let uploadPath = 'uploads/';
    if (file.mimetype.startsWith('image/')) {
      uploadPath += 'images/';
    } else if (file.mimetype === 'application/pdf') {
      uploadPath += 'documents/';
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
```

**Memory Storage:**

```javascript
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.post('/upload', upload.single('file'), (req, res) => {
  // ফাইল memory তে buffer হিসেবে থাকবে
  console.log(req.file.buffer); // File data as buffer
  
  // এখান থেকে আপনি direct cloud এ upload করতে পারবেন
  // অথবা process করে তারপর save করতে পারবেন
});
```

### 6. File Size Limits

```javascript
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
    files: 10 // সর্বোচ্চ 10টি ফাইল
  }
});

// Error handling
app.post('/upload', (req, res) => {
  upload.single('file')(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ error: 'File is too large. Max 5MB allowed.' });
      }
      if (err.code === 'LIMIT_FILE_COUNT') {
        return res.status(400).json({ error: 'Too many files. Max 10 allowed.' });
      }
    } else if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    res.json({ message: 'File uploaded successfully' });
  });
});
```

### 7. Error Handling

**Complete error handling example:**

```javascript
app.post('/upload', upload.single('file'), (req, res) => {
  // Error handling middleware
});

// Global error handler
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    // Multer error
    return res.status(400).json({
      error: 'File upload error',
      message: err.message,
      code: err.code
    });
  } else if (err) {
    // Other errors
    return res.status(500).json({
      error: 'Server error',
      message: err.message
    });
  }
  next();
});
```

---

## File Validation

ফাইল আপলোডের সময় proper validation অত্যন্ত গুরুত্বপূর্ণ security এবং data integrity নিশ্চিত করার জন্য।

### 1. MIME Type Validation

```javascript
const validateMimeType = (file) => {
  const allowedMimeTypes = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'application/pdf'
  ];
  
  return allowedMimeTypes.includes(file.mimetype);
};

const fileFilter = (req, file, cb) => {
  if (validateMimeType(file)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type'), false);
  }
};
```

### 2. File Extension Checking

```javascript
const path = require('path');

const validateExtension = (filename) => {
  const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.pdf'];
  const ext = path.extname(filename).toLowerCase();
  return allowedExtensions.includes(ext);
};

const fileFilter = (req, file, cb) => {
  if (validateExtension(file.originalname)) {
    cb(null, true);
  } else {
    cb(new Error('File extension not allowed'), false);
  }
};
```

### 3. File Size Validation

```javascript
const validateFileSize = (size, maxSize = 5 * 1024 * 1024) => { // 5MB default
  return size <= maxSize;
};

app.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  
  if (!validateFileSize(req.file.size)) {
    // Delete the uploaded file
    fs.unlinkSync(req.file.path);
    return res.status(400).json({ error: 'File too large. Max 5MB allowed.' });
  }
  
  res.json({ message: 'File uploaded successfully' });
});
```

### 4. Custom Validators

```javascript
const validateImage = (file) => {
  // MIME type check
  if (!file.mimetype.startsWith('image/')) {
    return { valid: false, error: 'File must be an image' };
  }
  
  // Extension check
  const allowedExts = ['.jpg', '.jpeg', '.png', '.gif'];
  const ext = path.extname(file.originalname).toLowerCase();
  if (!allowedExts.includes(ext)) {
    return { valid: false, error: 'Invalid image format' };
  }
  
  // Size check (5MB)
  if (file.size > 5 * 1024 * 1024) {
    return { valid: false, error: 'Image must be less than 5MB' };
  }
  
  return { valid: true };
};

app.post('/upload-image', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  
  const validation = validateImage(req.file);
  if (!validation.valid) {
    fs.unlinkSync(req.file.path); // Delete invalid file
    return res.status(400).json({ error: validation.error });
  }
  
  res.json({ message: 'Image uploaded successfully', file: req.file.filename });
});
```

### 5. Magic Number Validation

Magic numbers হলো ফাইলের প্রথম কয়েকটি bytes যা ফাইল টাইপ নির্ধারণ করে। এটি extension এবং MIME type থেকে বেশি নির্ভরযোগ্য।

```bash
npm install file-type
```

```javascript
const FileType = require('file-type');
const fs = require('fs').promises;

app.post('/upload-secure', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    // Read file buffer
    const buffer = await fs.readFile(req.file.path);
    
    // Check actual file type using magic numbers
    const fileType = await FileType.fromBuffer(buffer);
    
    if (!fileType) {
      await fs.unlink(req.file.path);
      return res.status(400).json({ error: 'Unknown file type' });
    }
    
    // Validate against allowed types
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(fileType.mime)) {
      await fs.unlink(req.file.path);
      return res.status(400).json({ 
        error: 'Invalid file type',
        detected: fileType.mime 
      });
    }
    
    res.json({ 
      message: 'File uploaded successfully',
      type: fileType.mime 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

### 6. Whitelist/Blacklist Approach

**Whitelist (Recommended):**

```javascript
const ALLOWED_FILE_TYPES = {
  images: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  documents: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  videos: ['video/mp4', 'video/mpeg', 'video/quicktime']
};

const validateFileType = (file, category) => {
  return ALLOWED_FILE_TYPES[category]?.includes(file.mimetype) || false;
};

app.post('/upload-image', upload.single('file'), (req, res) => {
  if (!validateFileType(req.file, 'images')) {
    fs.unlinkSync(req.file.path);
    return res.status(400).json({ error: 'Only images are allowed' });
  }
  res.json({ message: 'Image uploaded successfully' });
});
```

**Blacklist (কম নিরাপদ):**

```javascript
const BLOCKED_FILE_TYPES = [
  'application/x-msdownload', // .exe
  'application/x-sh',          // Shell scripts
  'application/x-php',         // PHP files
  'text/x-python'             // Python files
];

const isFileBlocked = (mimetype) => {
  return BLOCKED_FILE_TYPES.includes(mimetype);
};
```

---

## Image Processing (Sharp)

Sharp হলো high-performance image processing library যা Node.js এ images resize, compress, convert করার জন্য ব্যবহৃত হয়।

### Installation

```bash
npm install sharp
```

### 1. Image Resizing

```javascript
const sharp = require('sharp');
const path = require('path');

app.post('/upload-image', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image uploaded' });
    }
    
    const filename = `resized-${Date.now()}.jpg`;
    const outputPath = path.join('uploads', 'resized', filename);
    
    // Resize to 800x600
    await sharp(req.file.path)
      .resize(800, 600)
      .toFile(outputPath);
    
    res.json({
      message: 'Image resized successfully',
      original: req.file.filename,
      resized: filename
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

**Aspect ratio maintain করে resize:**

```javascript
await sharp(req.file.path)
  .resize(800, 600, {
    fit: 'inside',      // Aspect ratio maintain
    withoutEnlargement: true  // ছোট images বড় করবে না
  })
  .toFile(outputPath);
```

**Different fit options:**
- `cover` - ছবি crop হবে
- `contain` - পুরো ছবি দেখাবে, blank space হতে পারে
- `fill` - stretch করে পুরো space fill করবে
- `inside` - aspect ratio maintain করে fit করবে

### 2. Image Compression

```javascript
app.post('/compress-image', upload.single('image'), async (req, res) => {
  try {
    const filename = `compressed-${Date.now()}.jpg`;
    const outputPath = path.join('uploads', 'compressed', filename);
    
    const originalSize = req.file.size;
    
    await sharp(req.file.path)
      .jpeg({ quality: 80 })  // 80% quality
      .toFile(outputPath);
    
    const fs = require('fs');
    const compressedSize = fs.statSync(outputPath).size;
    
    res.json({
      message: 'Image compressed successfully',
      originalSize: `${(originalSize / 1024).toFixed(2)} KB`,
      compressedSize: `${(compressedSize / 1024).toFixed(2)} KB`,
      savings: `${(((originalSize - compressedSize) / originalSize) * 100).toFixed(2)}%`
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

### 3. Format Conversion

```javascript
// JPEG to PNG
await sharp('input.jpg')
  .png()
  .toFile('output.png');

// PNG to WebP (modern format, smaller size)
await sharp('input.png')
  .webp({ quality: 80 })
  .toFile('output.webp');

// Any format to JPEG
await sharp('input.png')
  .jpeg({ quality: 90, progressive: true })
  .toFile('output.jpg');
```

**Multiple formats একসাথে:**

```javascript
app.post('/upload-convert', upload.single('image'), async (req, res) => {
  try {
    const baseName = `image-${Date.now()}`;
    
    const image = sharp(req.file.path);
    
    // Create different formats
    await Promise.all([
      image.clone().jpeg({ quality: 90 }).toFile(`uploads/${baseName}.jpg`),
      image.clone().png().toFile(`uploads/${baseName}.png`),
      image.clone().webp({ quality: 80 }).toFile(`uploads/${baseName}.webp`)
    ]);
    
    res.json({
      message: 'Image converted to multiple formats',
      files: [
        `${baseName}.jpg`,
        `${baseName}.png`,
        `${baseName}.webp`
      ]
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

### 4. Cropping & Rotation

**Cropping:**

```javascript
// Specific area crop
await sharp('input.jpg')
  .extract({ left: 100, top: 50, width: 500, height: 400 })
  .toFile('cropped.jpg');

// Center crop
await sharp('input.jpg')
  .resize(400, 400, {
    fit: 'cover',
    position: 'center'
  })
  .toFile('center-cropped.jpg');
```

**Rotation:**

```javascript
// Rotate 90 degrees
await sharp('input.jpg')
  .rotate(90)
  .toFile('rotated.jpg');

// Auto-rotate based on EXIF data
await sharp('input.jpg')
  .rotate()  // No angle = auto-rotate
  .toFile('auto-rotated.jpg');
```

### 5. Watermarking

```javascript
const sharp = require('sharp');

app.post('/watermark', upload.single('image'), async (req, res) => {
  try {
    const watermarkPath = 'assets/watermark.png';
    const outputPath = `uploads/watermarked-${Date.now()}.jpg`;
    
    await sharp(req.file.path)
      .composite([{
        input: watermarkPath,
        gravity: 'southeast'  // নিচের ডান কোণায়
      }])
      .toFile(outputPath);
    
    res.json({
      message: 'Watermark added successfully',
      file: outputPath
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

**Text watermark:**

```javascript
const svgText = `
  <svg width="200" height="50">
    <text x="10" y="30" font-size="20" fill="white" opacity="0.7">
      © Your Name
    </text>
  </svg>
`;

await sharp('input.jpg')
  .composite([{
    input: Buffer.from(svgText),
    gravity: 'southeast'
  }])
  .toFile('watermarked.jpg');
```

### 6. Thumbnail Generation

```javascript
app.post('/upload-with-thumbnail', upload.single('image'), async (req, res) => {
  try {
    const filename = `${Date.now()}-${req.file.originalname}`;
    const thumbnailName = `thumb-${filename}`;
    
    const image = sharp(req.file.path);
    
    // Original image
    await image.clone().toFile(`uploads/images/${filename}`);
    
    // Thumbnail (200x200)
    await image
      .clone()
      .resize(200, 200, {
        fit: 'cover',
        position: 'center'
      })
      .toFile(`uploads/thumbnails/${thumbnailName}`);
    
    res.json({
      message: 'Image and thumbnail created',
      original: filename,
      thumbnail: thumbnailName
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

**Multiple thumbnail sizes:**

```javascript
const thumbnailSizes = [
  { name: 'small', width: 150, height: 150 },
  { name: 'medium', width: 300, height: 300 },
  { name: 'large', width: 600, height: 600 }
];

const image = sharp(req.file.path);

const thumbnails = await Promise.all(
  thumbnailSizes.map(size => 
    image
      .clone()
      .resize(size.width, size.height, { fit: 'cover' })
      .toFile(`uploads/thumbnails/${size.name}-${filename}`)
  )
);
```

### 7. Quality Optimization

```javascript
// Progressive JPEG (web এ fast load হয়)
await sharp('input.jpg')
  .jpeg({
    quality: 85,
    progressive: true,
    mozjpeg: true  // Better compression
  })
  .toFile('optimized.jpg');

// WebP optimization (সবচেয়ে ভালো compression)
await sharp('input.jpg')
  .webp({
    quality: 80,
    effort: 6  // 0-6, higher = better compression but slower
  })
  .toFile('optimized.webp');
```

### 8. Metadata Extraction

```javascript
app.post('/image-info', upload.single('image'), async (req, res) => {
  try {
    const metadata = await sharp(req.file.path).metadata();
    
    res.json({
      format: metadata.format,
      width: metadata.width,
      height: metadata.height,
      space: metadata.space,
      channels: metadata.channels,
      depth: metadata.depth,
      density: metadata.density,
      hasAlpha: metadata.hasAlpha,
      orientation: metadata.orientation,
      exif: metadata.exif,
      size: `${(req.file.size / 1024).toFixed(2)} KB`
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

**Complete Image Processing Pipeline:**

```javascript
app.post('/process-image', upload.single('image'), async (req, res) => {
  try {
    const filename = `processed-${Date.now()}.webp`;
    const outputPath = `uploads/processed/${filename}`;
    
    await sharp(req.file.path)
      .rotate()                    // Auto-rotate based on EXIF
      .resize(1200, 1200, {       // Max 1200x1200
        fit: 'inside',
        withoutEnlargement: true
      })
      .sharpen()                   // Sharpen করা
      .webp({ quality: 85 })      // WebP format
      .toFile(outputPath);
    
    // Original file delete করা
    fs.unlinkSync(req.file.path);
    
    res.json({
      message: 'Image processed successfully',
      file: filename
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

---

## File Storage Strategies

### 1. Local File Storage

**Organized folder structure:**

```javascript
const fs = require('fs').promises;
const path = require('path');

// Folder structure তৈরি
const createUploadFolders = async () => {
  const folders = [
    'uploads/images',
    'uploads/documents',
    'uploads/videos',
    'uploads/temp'
  ];
  
  for (const folder of folders) {
    await fs.mkdir(folder, { recursive: true });
  }
};

createUploadFolders();
```

**Date-based organization:**

```javascript
const getDateBasedPath = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  
  return `uploads/${year}/${month}/${day}`;
};

const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadPath = getDateBasedPath();
    await fs.mkdir(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});
```

### 2. Unique Filename Generation (UUID)

```bash
npm install uuid
```

```javascript
const { v4: uuidv4 } = require('uuid');
const path = require('path');

const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    const uniqueId = uuidv4();
    const ext = path.extname(file.originalname);
    cb(null, `${uniqueId}${ext}`);
  }
});
```

### 3. Temporary File Handling

```javascript
const fs = require('fs').promises;
const path = require('path');

// Temporary storage
const tempStorage = multer.diskStorage({
  destination: 'uploads/temp/',
  filename: (req, file, cb) => {
    cb(null, `temp-${Date.now()}-${file.originalname}`);
  }
});

const uploadTemp = multer({ storage: tempStorage });

app.post('/upload-process', uploadTemp.single('file'), async (req, res) => {
  try {
    // Process file
    const processedPath = `uploads/final/${req.file.filename}`;
    
    // আপনার processing logic (resize, compress, etc.)
    await sharp(req.file.path)
      .resize(800, 600)
      .toFile(processedPath);
    
    // Temporary file delete
    await fs.unlink(req.file.path);
    
    res.json({ message: 'File processed', path: processedPath });
  } catch (error) {
    // Error হলেও temp file delete করা
    if (req.file) {
      await fs.unlink(req.file.path).catch(() => {});
    }
    res.status(500).json({ error: error.message });
  }
});
```

### 4. File Cleanup Strategies

**Old files automatically delete:**

```javascript
const cron = require('node-cron');
const fs = require('fs').promises;
const path = require('path');

// প্রতিদিন রাত 2টায় run হবে
cron.schedule('0 2 * * *', async () => {
  console.log('Running file cleanup...');
  
  try {
    const tempDir = 'uploads/temp';
    const files = await fs.readdir(tempDir);
    const now = Date.now();
    const maxAge = 24 * 60 * 60 * 1000; // 24 hours
    
    for (const file of files) {
      const filePath = path.join(tempDir, file);
      const stats = await fs.stat(filePath);
      
      // 24 ঘণ্টার পুরনো files delete
      if (now - stats.mtimeMs > maxAge) {
        await fs.unlink(filePath);
        console.log(`Deleted: ${file}`);
      }
    }
  } catch (error) {
    console.error('Cleanup error:', error);
  }
});
```

**Manual cleanup function:**

```javascript
const cleanupFiles = async (directory, maxAgeInDays = 30) => {
  try {
    const files = await fs.readdir(directory);
    const now = Date.now();
    const maxAge = maxAgeInDays * 24 * 60 * 60 * 1000;
    
    let deletedCount = 0;
    
    for (const file of files) {
      const filePath = path.join(directory, file);
      const stats = await fs.stat(filePath);
      
      if (now - stats.mtimeMs > maxAge) {
        await fs.unlink(filePath);
        deletedCount++;
      }
    }
    
    return { success: true, deleted: deletedCount };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// API endpoint
app.post('/admin/cleanup', async (req, res) => {
  const result = await cleanupFiles('uploads/temp', 7); // 7 days old
  res.json(result);
});
```

### 5. Storage Path Management

**Configuration file:**

```javascript
// config/storage.js
module.exports = {
  uploadPaths: {
    images: 'uploads/images',
    documents: 'uploads/documents',
    videos: 'uploads/videos',
    temp: 'uploads/temp'
  },
  maxFileSize: {
    image: 5 * 1024 * 1024,      // 5MB
    document: 10 * 1024 * 1024,  // 10MB
    video: 50 * 1024 * 1024      // 50MB
  },
  allowedTypes: {
    image: ['image/jpeg', 'image/png', 'image/gif'],
    document: ['application/pdf', 'application/msword'],
    video: ['video/mp4', 'video/mpeg']
  }
};
```

```javascript
// Usage
const storageConfig = require('./config/storage');

const getUploadConfig = (type) => {
  return multer({
    dest: storageConfig.uploadPaths[type],
    limits: { fileSize: storageConfig.maxFileSize[type] },
    fileFilter: (req, file, cb) => {
      if (storageConfig.allowedTypes[type].includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error(`Invalid ${type} type`), false);
      }
    }
  });
};

const uploadImage = getUploadConfig('image');
const uploadDocument = getUploadConfig('document');

app.post('/upload-image', uploadImage.single('file'), (req, res) => {
  res.json({ message: 'Image uploaded' });
});
```

---

## Cloud Storage Integration

Local storage এর পরিবর্তে cloud storage ব্যবহার করলে scalability এবং reliability বাড়ে।

### AWS S3 Integration

Amazon S3 (Simple Storage Service) হলো সবচেয়ে জনপ্রিয় cloud storage solution।

#### Installation

```bash
npm install aws-sdk multer-s3
npm install @aws-sdk/client-s3 @aws-sdk/lib-storage  # V3 SDK (recommended)
```

#### 1. S3 Bucket Setup

**AWS Console থেকে:**
1. AWS Console এ login করুন
2. S3 service এ যান
3. "Create bucket" ক্লিক করুন
4. Bucket name দিন (globally unique হতে হবে)
5. Region select করুন
6. Block Public Access settings configure করুন
7. Create করুন

**Environment variables:**

```env
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=us-east-1
AWS_BUCKET_NAME=your-bucket-name
```

#### 2. Upload to S3

**Using AWS SDK V3 (Modern approach):**

```javascript
const express = require('express');
const multer = require('multer');
const { S3Client } = require('@aws-sdk/client-s3');
const { Upload } = require('@aws-sdk/lib-storage');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

const app = express();

// S3 Client configuration
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
});

// Multer memory storage (কারণ আমরা direct S3 এ upload করব)
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

app.post('/upload-s3', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    const fileKey = `uploads/${uuidv4()}${path.extname(req.file.originalname)}`;
    
    const uploadParams = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: fileKey,
      Body: req.file.buffer,
      ContentType: req.file.mimetype
    };
    
    const upload = new Upload({
      client: s3Client,
      params: uploadParams
    });
    
    const result = await upload.done();
    
    res.json({
      message: 'File uploaded to S3 successfully',
      location: result.Location,
      key: fileKey,
      bucket: process.env.AWS_BUCKET_NAME
    });
  } catch (error) {
    console.error('S3 upload error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
```

**Using multer-s3 (Simpler approach):**

```javascript
const multer = require('multer');
const multerS3 = require('multer-s3');
const { S3Client } = require('@aws-sdk/client-s3');
const path = require('path');

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
});

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWS_BUCKET_NAME,
    metadata: (req, file, cb) => {
      cb(null, { fieldName: file.fieldname });
    },
    key: (req, file, cb) => {
      const uniqueKey = `uploads/${Date.now()}-${file.originalname}`;
      cb(null, uniqueKey);
    }
  }),
  limits: { fileSize: 5 * 1024 * 1024 }
});

app.post('/upload', upload.single('file'), (req, res) => {
  res.json({
    message: 'File uploaded successfully',
    file: req.file
  });
});
```

#### 3. Download from S3

```javascript
const { GetObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');

app.get('/download/:key', async (req, res) => {
  try {
    const key = req.params.key;
    
    const command = new GetObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key
    });
    
    const response = await s3Client.send(command);
    
    // Set appropriate headers
    res.setHeader('Content-Type', response.ContentType);
    res.setHeader('Content-Disposition', `attachment; filename="${key}"`);
    
    // Stream the file
    response.Body.pipe(res);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

#### 4. Presigned URLs

Presigned URLs ব্যবহার করে temporary access দেওয়া যায় যাতে file সরাসরি S3 থেকে download করা যায়।

```javascript
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const { GetObjectCommand } = require('@aws-sdk/client-s3');

app.get('/presigned-url/:key', async (req, res) => {
  try {
    const key = req.params.key;
    
    const command = new GetObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key
    });
    
    // URL 1 ঘণ্টার জন্য valid থাকবে
    const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
    
    res.json({
      message: 'Presigned URL generated',
      url: url,
      expiresIn: '1 hour'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

**Upload এর জন্য presigned URL:**

```javascript
const { PutObjectCommand } = require('@aws-sdk/client-s3');

app.get('/presigned-upload-url', async (req, res) => {
  try {
    const key = `uploads/${Date.now()}-${req.query.filename}`;
    
    const command = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key,
      ContentType: req.query.contentType
    });
    
    const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
    
    res.json({
      uploadUrl: url,
      key: key
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

#### 5. File Deletion

```javascript
const { DeleteObjectCommand } = require('@aws-sdk/client-s3');

app.delete('/delete/:key', async (req, res) => {
  try {
    const key = req.params.key;
    
    const command = new DeleteObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key
    });
    
    await s3Client.send(command);
    
    res.json({
      message: 'File deleted successfully',
      key: key
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

#### 6. Access Control (ACL)

```javascript
const { PutObjectCommand } = require('@aws-sdk/client-s3');

// Public read access দেওয়া
const uploadParams = {
  Bucket: process.env.AWS_BUCKET_NAME,
  Key: fileKey,
  Body: req.file.buffer,
  ContentType: req.file.mimetype,
  ACL: 'public-read'  // যে কেউ read করতে পারবে
};

// Private (default)
const uploadParams = {
  Bucket: process.env.AWS_BUCKET_NAME,
  Key: fileKey,
  Body: req.file.buffer,
  ContentType: req.file.mimetype,
  ACL: 'private'  // শুধুমাত্র owner access পাবে
};
```

### Cloudinary Integration

Cloudinary হলো image এবং video management এর জন্য popular cloud service যা automatic optimization, transformation প্রদান করে।

#### Installation

```bash
npm install cloudinary multer
```

#### Setup

```javascript
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});
```

#### 1. Image Upload

```javascript
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'uploads',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif'],
    transformation: [{ width: 1000, height: 1000, crop: 'limit' }]
  }
});

const upload = multer({ storage: storage });

app.post('/upload-cloudinary', upload.single('image'), (req, res) => {
  res.json({
    message: 'Image uploaded to Cloudinary',
    url: req.file.path,
    publicId: req.file.filename
  });
});
```

#### 2. Transformation URLs

Cloudinary এর সবচেয়ে powerful feature হলো URL-based transformation।

```javascript
app.get('/image/:publicId', (req, res) => {
  const publicId = req.params.publicId;
  
  // Different transformations
  const urls = {
    original: cloudinary.url(publicId),
    
    // Resize to 300x300
    thumbnail: cloudinary.url(publicId, {
      width: 300,
      height: 300,
      crop: 'fill'
    }),
    
    // Auto quality and format
    optimized: cloudinary.url(publicId, {
      quality: 'auto',
      fetch_format: 'auto'
    }),
    
    // Rounded corners
    rounded: cloudinary.url(publicId, {
      radius: 20
    }),
    
    // Watermark
    watermarked: cloudinary.url(publicId, {
      overlay: 'watermark',
      gravity: 'south_east',
      opacity: 60,
      width: 100
    })
  };
  
  res.json(urls);
});
```

#### 3. Auto Optimization

```javascript
// Automatically সবচেয়ে ভালো format এবং quality select করবে
const optimizedUrl = cloudinary.url(publicId, {
  quality: 'auto',
  fetch_format: 'auto'
});
```

#### 4. CDN Delivery

Cloudinary automatically CDN দিয়ে files serve করে, যাতে globally fast delivery হয়।

```javascript
// Secure URL (HTTPS)
const secureUrl = cloudinary.url(publicId, {
  secure: true
});
```

---

## CSV/Excel File Handling

CSV এবং Excel files handle করা data import/export এর জন্য অত্যন্ত গুরুত্বপূর্ণ।

### CSV Handling

#### Installation

```bash
npm install csv-parser fast-csv
```

#### 1. CSV Parsing (Reading)

```javascript
const fs = require('fs');
const csv = require('csv-parser');

app.post('/import-csv', upload.single('csvfile'), (req, res) => {
  const results = [];
  
  fs.createReadStream(req.file.path)
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', () => {
      // এখানে results array এ সব data আছে
      console.log(`Parsed ${results.length} rows`);
      
      // Database এ save করতে পারেন
      // await Model.insertMany(results);
      
      // Cleanup uploaded file
      fs.unlinkSync(req.file.path);
      
      res.json({
        message: 'CSV imported successfully',
        totalRecords: results.length,
        sample: results.slice(0, 5) // প্রথম 5 rows
      });
    })
    .on('error', (error) => {
      res.status(500).json({ error: error.message });
    });
});
```

**Custom delimiter:**

```javascript
fs.createReadStream(req.file.path)
  .pipe(csv({ separator: ';' }))  // Semicolon delimiter
  .on('data', (data) => results.push(data))
  .on('end', () => {
    // Process data
  });
```

#### 2. CSV Writing

```javascript
const { writeToPath } = require('@fast-csv/format');

app.get('/export-csv', async (req, res) => {
  try {
    // Database থেকে data fetch
    const data = await User.find().lean();
    
    const csvPath = `exports/users-${Date.now()}.csv`;
    
    const rows = data.map(user => ({
      Name: user.name,
      Email: user.email,
      Age: user.age,
      CreatedAt: user.createdAt
    }));
    
    writeToPath(csvPath, rows, { headers: true })
      .on('finish', () => {
        res.download(csvPath, 'users.csv', (err) => {
          if (err) {
            console.error(err);
          }
          // Download complete হলে file delete
          fs.unlinkSync(csvPath);
        });
      })
      .on('error', (error) => {
        res.status(500).json({ error: error.message });
      });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

### Excel Handling

#### Installation

```bash
npm install xlsx exceljs
```

#### 1. Excel Reading (xlsx)

```javascript
const XLSX = require('xlsx');

app.post('/import-excel', upload.single('excelfile'), (req, res) => {
  try {
    // Read the workbook
    const workbook = XLSX.readFile(req.file.path);
    
    // Get first sheet name
    const sheetName = workbook.SheetNames[0];
    
    // Get worksheet
    const worksheet = workbook.Sheets[sheetName];
    
    // Convert to JSON
    const data = XLSX.utils.sheet_to_json(worksheet);
    
    // Cleanup
    fs.unlinkSync(req.file.path);
    
    res.json({
      message: 'Excel imported successfully',
      sheetName: sheetName,
      totalRecords: data.length,
      data: data
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

#### 2. Excel Writing (exceljs)

```javascript
const ExcelJS = require('exceljs');

app.get('/export-excel', async (req, res) => {
  try {
    // Create workbook and worksheet
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Users');
    
    // Define columns
    worksheet.columns = [
      { header: 'ID', key: 'id', width: 10 },
      { header: 'Name', key: 'name', width: 30 },
      { header: 'Email', key: 'email', width: 30 },
      { header: 'Age', key: 'age', width: 10 },
      { header: 'Created At', key: 'createdAt', width: 20 }
    ];
    
    // Fetch data
    const users = await User.find().lean();
    
    // Add rows
    users.forEach(user => {
      worksheet.addRow({
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        age: user.age,
        createdAt: user.createdAt.toLocaleDateString()
      });
    });
    
    // Style the header row
    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF4472C4' }
    };
    
    // Set response headers
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader(
      'Content-Disposition',
      'attachment; filename=users.xlsx'
    );
    
    // Write to response
    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

#### 3. Data Validation

```javascript
const validateExcelData = (data) => {
  const errors = [];
  
  data.forEach((row, index) => {
    // Email validation
    if (!row.email || !row.email.includes('@')) {
      errors.push({
        row: index + 2, // +2 কারণ header এবং 0-indexing
        field: 'email',
        message: 'Invalid email address'
      });
    }
    
    // Age validation
    if (!row.age || row.age < 0 || row.age > 120) {
      errors.push({
        row: index + 2,
        field: 'age',
        message: 'Invalid age'
      });
    }
  });
  
  return {
    valid: errors.length === 0,
    errors: errors
  };
};

app.post('/import-validate', upload.single('file'), (req, res) => {
  const workbook = XLSX.readFile(req.file.path);
  const data = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
  
  const validation = validateExcelData(data);
  
  if (!validation.valid) {
    return res.status(400).json({
      error: 'Validation failed',
      errors: validation.errors
    });
  }
  
  res.json({ message: 'Data is valid', totalRecords: data.length });
});
```

#### 4. Bulk Import/Export

```javascript
const bulkImport = async (data) => {
  const batchSize = 1000;
  let imported = 0;
  
  for (let i = 0; i < data.length; i += batchSize) {
    const batch = data.slice(i, i + batchSize);
    await User.insertMany(batch);
    imported += batch.length;
    console.log(`Imported ${imported}/${data.length} records`);
  }
  
  return imported;
};

app.post('/bulk-import', upload.single('file'), async (req, res) => {
  try {
    const workbook = XLSX.readFile(req.file.path);
    const data = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
    
    const totalImported = await bulkImport(data);
    
    fs.unlinkSync(req.file.path);
    
    res.json({
      message: 'Bulk import completed',
      totalRecords: totalImported
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

#### 5. Stream Processing for Large Files

Large files এর জন্য memory efficient way:

```javascript
const fs = require('fs');
const csv = require('csv-parser');

app.post('/import-large-csv', upload.single('file'), async (req, res) => {
  let count = 0;
  const batchSize = 100;
  let batch = [];
  
  const stream = fs.createReadStream(req.file.path)
    .pipe(csv())
    .on('data', async (row) => {
      batch.push(row);
      
      // যখন batch size এ পৌঁছাবে, database এ save করুন
      if (batch.length >= batchSize) {
        stream.pause(); // Temporarily pause stream
        
        await User.insertMany(batch);
        count += batch.length;
        batch = []; // Clear batch
        
        stream.resume(); // Resume stream
      }
    })
    .on('end', async () => {
      // Remaining batch process করুন
      if (batch.length > 0) {
        await User.insertMany(batch);
        count += batch.length;
      }
      
      fs.unlinkSync(req.file.path);
      
      res.json({
        message: 'Large file imported successfully',
        totalRecords: count
      });
    })
    .on('error', (error) => {
      res.status(500).json({ error: error.message });
    });
});
```

---

## PDF Generation

Node.js এ PDF generate করার বিভিন্ন উপায় আছে।

### Method 1: PDFKit

PDFKit হলো low-level PDF generation library যা দিয়ে programmatically PDF create করা যায়।

#### Installation

```bash
npm install pdfkit
```

#### Basic PDF Generation

```javascript
const PDFDocument = require('pdfkit');
const fs = require('fs');

app.get('/generate-pdf', (req, res) => {
  try {
    // Create a document
    const doc = new PDFDocument();
    
    // Pipe to response
    doc.pipe(res);
    
    // Set response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=document.pdf');
    
    // Add content
    doc.fontSize(25).text('Hello World!', 100, 100);
    
    doc.fontSize(12)
       .text('This is a PDF generated using PDFKit', 100, 150);
    
    // Finalize PDF
    doc.end();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

#### Advanced PDFKit Example

```javascript
app.get('/invoice/:id', async (req, res) => {
  try {
    // Fetch invoice data
    const invoice = await Invoice.findById(req.params.id)
      .populate('customer')
      .populate('items.product');
    
    const doc = new PDFDocument({ margin: 50 });
    
    doc.pipe(res);
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=invoice-${invoice.invoiceNumber}.pdf`);
    
    // Header
    doc.fontSize(20)
       .text('INVOICE', { align: 'center' });
    
    doc.moveDown();
    
    // Company info
    doc.fontSize(10)
       .text('Your Company Name', 50, 100)
       .text('123 Business Street', 50, 115)
       .text('City, State 12345', 50, 130);
    
    // Customer info
    doc.text('Bill To:', 300, 100)
       .text(invoice.customer.name, 300, 115)
       .text(invoice.customer.address, 300, 130);
    
    doc.moveDown(3);
    
    // Table header
    const tableTop = 200;
    doc.fontSize(10)
       .text('Item', 50, tableTop)
       .text('Quantity', 250, tableTop)
       .text('Price', 350, tableTop)
       .text('Total', 450, tableTop);
    
    // Draw line
    doc.moveTo(50, tableTop + 15)
       .lineTo(550, tableTop + 15)
       .stroke();
    
    // Table rows
    let y = tableTop + 25;
    invoice.items.forEach(item => {
      doc.text(item.product.name, 50, y)
         .text(item.quantity.toString(), 250, y)
         .text(`$${item.price.toFixed(2)}`, 350, y)
         .text(`$${(item.quantity * item.price).toFixed(2)}`, 450, y);
      y += 20;
    });
    
    // Total
    doc.fontSize(12)
       .text(`Total: $${invoice.total.toFixed(2)}`, 400, y + 20);
    
    doc.end();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

### Method 2: Puppeteer (HTML to PDF)

Puppeteer ব্যবহার করে HTML কে PDF এ convert করা যায়, যা styling এর জন্য অনেক সহজ।

#### Installation

```bash
npm install puppeteer
```

#### Basic HTML to PDF

```javascript
const puppeteer = require('puppeteer');

app.get('/html-to-pdf', async (req, res) => {
  try {
    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox']
    });
    
    const page = await browser.newPage();
    
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; }
            .header { text-align: center; color: #333; }
            .content { margin: 20px; }
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #4CAF50; color: white; }
          </style>
        </head>
        <body>
          <h1 class="header">Sales Report</h1>
          <div class="content">
            <p>Generated on: ${new Date().toLocaleDateString()}</p>
            <table>
              <tr>
                <th>Product</th>
                <th>Quantity</th>
                <th>Revenue</th>
              </tr>
              <tr>
                <td>Product A</td>
                <td>100</td>
                <td>$10,000</td>
              </tr>
              <tr>
                <td>Product B</td>
                <td>75</td>
                <td>$7,500</td>
              </tr>
            </table>
          </div>
        </body>
      </html>
    `;
    
    await page.setContent(html);
    
    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '20px',
        right: '20px',
        bottom: '20px',
        left: '20px'
      }
    });
    
    await browser.close();
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=report.pdf');
    res.send(pdf);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

#### Using Templates

**EJS Template example:**

```javascript
const ejs = require('ejs');
const path = require('path');

app.get('/invoice-pdf/:id', async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id)
      .populate('customer')
      .populate('items.product');
    
    // Render EJS template
    const html = await ejs.renderFile(
      path.join(__dirname, 'views', 'invoice-template.ejs'),
      { invoice }
    );
    
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    await page.setContent(html);
    
    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true
    });
    
    await browser.close();
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=invoice-${invoice.invoiceNumber}.pdf`);
    res.send(pdf);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

**invoice-template.ejs:**

```html
<!DOCTYPE html>
<html>
<head>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: Arial, sans-serif; padding: 40px; }
    .header { text-align: center; margin-bottom: 40px; }
    .invoice-details { margin-bottom: 30px; }
    .row { display: flex; justify-content: space-between; }
    .column { width: 48%; }
    table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
    th { background-color: #4CAF50; color: white; }
    .total { text-align: right; font-size: 18px; font-weight: bold; margin-top: 20px; }
  </style>
</head>
<body>
  <div class="header">
    <h1>INVOICE</h1>
    <p>Invoice #<%= invoice.invoiceNumber %></p>
    <p>Date: <%= new Date(invoice.date).toLocaleDateString() %></p>
  </div>
  
  <div class="invoice-details">
    <div class="row">
      <div class="column">
        <h3>From:</h3>
        <p>Your Company Name</p>
        <p>123 Business Street</p>
        <p>City, State 12345</p>
      </div>
      <div class="column">
        <h3>Bill To:</h3>
        <p><%= invoice.customer.name %></p>
        <p><%= invoice.customer.address %></p>
        <p><%= invoice.customer.email %></p>
      </div>
    </div>
  </div>
  
  <table>
    <thead>
      <tr>
        <th>Item</th>
        <th>Quantity</th>
        <th>Price</th>
        <th>Total</th>
      </tr>
    </thead>
    <tbody>
      <% invoice.items.forEach(item => { %>
        <tr>
          <td><%= item.product.name %></td>
          <td><%= item.quantity %></td>
          <td>$<%= item.price.toFixed(2) %></td>
          <td>$<%= (item.quantity * item.price).toFixed(2) %></td>
        </tr>
      <% }); %>
    </tbody>
  </table>
  
  <div class="total">
    Total: $<%= invoice.total.toFixed(2) %>
  </div>
</body>
</html>
```

### PDF Download Endpoints

```javascript
// Save to file and then download
app.get('/download-report', async (req, res) => {
  try {
    const pdfPath = `reports/report-${Date.now()}.pdf`;
    
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    
    await page.goto('http://example.com/report', { waitUntil: 'networkidle0' });
    
    await page.pdf({
      path: pdfPath,
      format: 'A4'
    });
    
    await browser.close();
    
    res.download(pdfPath, 'report.pdf', (err) => {
      if (err) console.error(err);
      // Delete file after download
      fs.unlinkSync(pdfPath);
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

---

## Complete File Handling Example

এখানে একটি সম্পূর্ণ file handling system এর example দেওয়া হলো যা সব concepts একসাথে ব্যবহার করে:

```javascript
const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs').promises;
const { v4: uuidv4 } = require('uuid');

const app = express();

// Storage configuration
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadPath = 'uploads/temp';
    await fs.mkdir(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, `${uuidv4()}${path.extname(file.originalname)}`);
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG and GIF allowed.'), false);
  }
};

// Upload configuration
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  }
});

// Complete upload and process endpoint
app.post('/upload-complete', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    const filename = `${uuidv4()}.webp`;
    const thumbnailName = `thumb-${filename}`;
    
    // Process image
    const processedPath = `uploads/images/${filename}`;
    const thumbnailPath = `uploads/thumbnails/${thumbnailName}`;
    
    await fs.mkdir('uploads/images', { recursive: true });
    await fs.mkdir('uploads/thumbnails', { recursive: true });
    
    // Main image
    await sharp(req.file.path)
      .rotate() // Auto-rotate based on EXIF
      .resize(1200, 1200, {
        fit: 'inside',
        withoutEnlargement: true
      })
      .webp({ quality: 85 })
      .toFile(processedPath);
    
    // Thumbnail
    await sharp(req.file.path)
      .resize(300, 300, {
        fit: 'cover',
        position: 'center'
      })
      .webp({ quality: 80 })
      .toFile(thumbnailPath);
    
    // Get file sizes
    const originalSize = req.file.size;
    const stats = await fs.stat(processedPath);
    const processedSize = stats.size;
    
    // Delete temp file
    await fs.unlink(req.file.path);
    
    // Save to database (example)
    // const image = await Image.create({
    //   filename: filename,
    //   thumbnail: thumbnailName,
    //   originalName: req.file.originalname,
    //   size: processedSize
    // });
    
    res.json({
      success: true,
      message: 'Image uploaded and processed successfully',
      data: {
        filename: filename,
        thumbnail: thumbnailName,
        originalSize: `${(originalSize / 1024).toFixed(2)} KB`,
        processedSize: `${(processedSize / 1024).toFixed(2)} KB`,
        savings: `${(((originalSize - processedSize) / originalSize) * 100).toFixed(2)}%`
      }
    });
  } catch (error) {
    // Cleanup on error
    if (req.file) {
      await fs.unlink(req.file.path).catch(() => {});
    }
    
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        error: 'File too large',
        message: 'Maximum file size is 5MB'
      });
    }
  }
  
  res.status(500).json({
    error: 'Server error',
    message: err.message
  });
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
```

---

## Best Practices

### 1. Security
- সবসময় file validation করুন (type, size, content)
- Magic number validation ব্যবহার করুন
- Uploaded files কখনো execute করবেন না
- File names sanitize করুন
- Access control implement করুন

### 2. Performance
- Large files এর জন্য stream processing ব্যবহার করুন
- Image processing asynchronously করুন
- CDN ব্যবহার করুন static files এর জন্য
- Cache headers properly set করুন

### 3. Storage
- Organized folder structure maintain করুন
- Regular cleanup করুন unused files
- Cloud storage ব্যবহার করুন scalability এর জন্য
- Backup strategy রাখুন

### 4. Error Handling
- Proper error messages দিন
- Failed uploads এর পর cleanup করুন
- Logging implement করুন
- User-friendly error responses দিন

---

এই গাইডে File Handling এর সব গুরুত্বপূর্ণ বিষয় কভার করা হয়েছে। প্রতিটি section এ code examples এবং ব্যাখ্যা দেওয়া আছে যাতে আপনি সহজে implement করতে পারেন। 🚀
