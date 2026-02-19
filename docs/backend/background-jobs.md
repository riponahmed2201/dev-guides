# Background Jobs, Cron Jobs, Task Scheduling & Worker Processes

## Background Job কী?

**Background Job** হলো এমন কাজ যা user-এর request-এর **বাইরে, আলাদাভাবে** চলে — user-কে অপেক্ষা করতে হয় না।

```
Without Background Job:
  User → "Send Email" → [Wait 5 sec for email to send...] → Response
  User 5 সেকেন্ড ধরে loading দেখে! 😩

With Background Job:
  User → "Send Email" → [Queue-তে রাখো] → Response instantly! ✅
  Background → Queue থেকে তুলে email পাঠাও (আলাদাভাবে)
```

> **বাস্তব উদাহরণ:** Restaurant-এ order দিলে waiter তোমাকে "Order received" বলে, তারপর আলাদাভাবে kitchen-এ রান্না হয়। তুমি waiter-এর সামনে দাঁড়িয়ে রান্না শেষ হওয়া পর্যন্ত অপেক্ষা করো না।

---

## কখন Background Job দরকার?

| কাজ                       | কেন Background-এ?                      |
| ------------------------- | -------------------------------------- |
| **Email পাঠানো**          | SMTP slow, retry দরকার হতে পারে        |
| **PDF/Report generate**   | CPU-intensive, সময় লাগে               |
| **Image processing**      | Resize, compress, thumbnail — ভারী কাজ |
| **Video encoding**        | মিনিট থেকে ঘন্টা লাগতে পারে            |
| **Data import/export**    | বড় CSV, millions of rows              |
| **Push notification**     | External service call, bulk send       |
| **Payment processing**    | Third-party API, retry logic           |
| **Database cleanup**      | Old records delete, archiving          |
| **Search index update**   | Elasticsearch sync                     |
| **Webhook delivery**      | External endpoint-এ POST, retry        |
| **Analytics calculation** | Complex aggregation                    |

```
Rule of Thumb:
  < 100ms → Request-এ করো (sync)
  > 100ms → Background job-এ দাও (async)
  > 5sec  → Background job MUST
```

---

## Background Job Architecture

```
┌──────────┐     ┌───────────┐     ┌──────────┐     ┌──────────┐
│  Client   │────→│  API      │────→│  Queue   │────→│  Worker  │
│           │     │  Server   │     │ (Redis/  │     │ Process  │
│           │     │           │     │  RabbitMQ)│     │          │
│           │←────│ "Accepted"│     │           │     │ Process  │
└──────────┘     └───────────┘     └──────────┘     │ the job  │
                                                     └──────────┘

1. Client request পাঠায়
2. API Server job-টা Queue-তে রাখে
3. Client-কে instantly response দেয় ("Job accepted")
4. Worker process Queue থেকে job তুলে আলাদাভাবে process করে
```

### Key Components

```
Producer  → Job তৈরি করে Queue-তে রাখে (API Server)
Queue     → Jobs সারিবদ্ধভাবে store করে (Redis, RabbitMQ)
Consumer  → Queue থেকে job তুলে execute করে (Worker Process)
```

---

## BullMQ (Node.js — Production-Grade)

Redis-based queue — Node.js-এর সবচেয়ে popular job queue:

### Installation

```bash
npm install bullmq ioredis
```

### Queue Setup

```javascript
const { Queue, Worker } = require("bullmq");
const IORedis = require("ioredis");

const connection = new IORedis({
  host: process.env.REDIS_HOST || "127.0.0.1",
  port: 6379,
  maxRetriesPerRequest: null,
});

// Queue তৈরি
const emailQueue = new Queue("email", { connection });
const imageQueue = new Queue("image-processing", { connection });
const reportQueue = new Queue("report-generation", { connection });
```

### Job Add করা (Producer)

```javascript
// API route-এ — job queue-তে দাও, instantly response দাও
app.post("/api/users", async (req, res) => {
  const user = await User.create(req.body);

  // Email job queue-তে রাখো (background-এ পাঠাবে)
  await emailQueue.add("welcome-email", {
    userId: user.id,
    email: user.email,
    name: user.name,
  });

  res.status(201).json({ message: "User created", userId: user.id });
  // Email পাঠানোর জন্য wait করতে হলো না!
});

// Report generation
app.post("/api/reports", async (req, res) => {
  const job = await reportQueue.add("monthly-report", {
    userId: req.user.id,
    month: req.body.month,
    year: req.body.year,
  });

  res.json({ message: "Report generation started", jobId: job.id });
});
```

### Worker (Consumer)

```javascript
// worker.js — আলাদা process-এ চালাও
const { Worker } = require("bullmq");

const emailWorker = new Worker(
  "email",
  async (job) => {
    const { userId, email, name } = job.data;

    console.log(`Processing email job ${job.id} for ${email}`);

    switch (job.name) {
      case "welcome-email":
        await sendWelcomeEmail(email, name);
        break;
      case "password-reset":
        await sendPasswordResetEmail(email, job.data.resetToken);
        break;
      case "order-confirmation":
        await sendOrderConfirmation(email, job.data.orderId);
        break;
    }

    console.log(`Email sent to ${email}`);
    return { sent: true, email };
  },
  { connection },
);

emailWorker.on("completed", (job, result) => {
  console.log(`Job ${job.id} completed:`, result);
});

emailWorker.on("failed", (job, err) => {
  console.error(`Job ${job.id} failed:`, err.message);
});
```

### Job Options

```javascript
// Delay — 5 মিনিট পরে execute করো
await emailQueue.add("reminder", data, {
  delay: 5 * 60 * 1000, // 5 minutes
});

// Retry — fail হলে আবার চেষ্টা করো
await emailQueue.add("notification", data, {
  attempts: 3,
  backoff: {
    type: "exponential",
    delay: 1000, // 1s, 2s, 4s
  },
});

// Priority — গুরুত্বপূর্ণ job আগে process করো
await emailQueue.add("urgent-alert", data, {
  priority: 1, // Lower = higher priority
});

// Remove on complete/fail — storage cleanup
await emailQueue.add("task", data, {
  removeOnComplete: 100, // শেষ 100টা completed job রাখো
  removeOnFail: 50,
});

// Timeout — নির্দিষ্ট সময়ের মধ্যে শেষ না হলে fail
await imageQueue.add("resize", data, {
  timeout: 30000, // 30 seconds
});
```

### Job Progress Tracking

```javascript
// Worker-এ progress update করো
const imageWorker = new Worker(
  "image-processing",
  async (job) => {
    const { images } = job.data;

    for (let i = 0; i < images.length; i++) {
      await processImage(images[i]);
      await job.updateProgress(((i + 1) / images.length) * 100);
    }

    return { processed: images.length };
  },
  { connection },
);

// API-তে progress check করো
app.get("/api/jobs/:id/status", async (req, res) => {
  const job = await imageQueue.getJob(req.params.id);

  if (!job) {
    return res.status(404).json({ error: "Job not found" });
  }

  const state = await job.getState();

  res.json({
    id: job.id,
    state, // 'waiting', 'active', 'completed', 'failed', 'delayed'
    progress: job.progress,
    data: job.data,
    result: job.returnvalue,
    failedReason: job.failedReason,
    attempts: job.attemptsMade,
    createdAt: job.timestamp,
    processedAt: job.processedOn,
    completedAt: job.finishedOn,
  });
});
```

---

## Cron Jobs (সময় অনুযায়ী চলা কাজ)

**Cron Job** হলো **নির্দিষ্ট সময়ে বা interval-এ** automatically চলা কাজ:

### Cron Expression

```
┌───────────── second (0-59) [optional]
│ ┌───────────── minute (0-59)
│ │ ┌───────────── hour (0-23)
│ │ │ ┌───────────── day of month (1-31)
│ │ │ │ ┌───────────── month (1-12)
│ │ │ │ │ ┌───────────── day of week (0-7, 0 & 7 = Sunday)
│ │ │ │ │ │
* * * * * *

Common Examples:
──────────────────────────────────────────────────
*/5 * * * *       প্রতি 5 মিনিটে
0 * * * *         প্রতি ঘন্টায়
0 0 * * *         প্রতিদিন রাত 12:00 এ
0 9 * * *         প্রতিদিন সকাল 9:00 এ
0 9 * * 1         প্রতি সোমবার সকাল 9:00 এ
0 0 1 * *         প্রতি মাসের 1 তারিখ রাত 12:00 এ
0 0 * * 0         প্রতি রবিবার রাত 12:00 এ
30 2 * * *        প্রতিদিন রাত 2:30 এ
0 */6 * * *       প্রতি 6 ঘন্টায়
```

### BullMQ Repeatable Jobs (Cron)

```javascript
// প্রতিদিন রাত 2:00 এ database cleanup
await emailQueue.add(
  "daily-cleanup",
  {},
  {
    repeat: {
      pattern: "0 2 * * *", // cron expression
    },
  },
);

// প্রতি 5 মিনিটে health check
await emailQueue.add(
  "health-check",
  {},
  {
    repeat: {
      every: 5 * 60 * 1000, // milliseconds
    },
  },
);

// প্রতি সোমবার সকাল 9:00 এ weekly report
await reportQueue.add(
  "weekly-report",
  {},
  {
    repeat: {
      pattern: "0 9 * * 1",
    },
  },
);

// প্রতি মাসের 1 তারিখ monthly invoice
await reportQueue.add(
  "monthly-invoice",
  {},
  {
    repeat: {
      pattern: "0 0 1 * *",
    },
  },
);
```

### node-cron (Simple Cron)

```bash
npm install node-cron
```

```javascript
const cron = require("node-cron");

// প্রতি 5 মিনিটে
cron.schedule("*/5 * * * *", async () => {
  console.log("Running health check...");
  await checkSystemHealth();
});

// প্রতিদিন রাত 2:00 এ
cron.schedule("0 2 * * *", async () => {
  console.log("Running daily cleanup...");
  await deleteExpiredSessions();
  await archiveOldLogs();
  await cleanTempFiles();
});

// প্রতি সোমবার সকাল 9:00 এ
cron.schedule("0 9 * * 1", async () => {
  console.log("Generating weekly report...");
  await generateWeeklyReport();
  await sendReportToAdmin();
});
```

```
node-cron vs BullMQ Repeat:
──────────────────────────────────────────
node-cron:
  ✅ Simple, no Redis needed
  ❌ Single server only (no distributed)
  ❌ No retry, no persistence
  ❌ Server restart → missed jobs

BullMQ Repeat:
  ✅ Distributed (multiple servers)
  ✅ Persistent (Redis-backed)
  ✅ Retry, monitoring, dashboard
  ❌ Redis dependency
```

---

## Task Scheduling

নির্দিষ্ট সময়ে একবার চলা কাজ (cron-এর মতো repeat না):

### Delayed Jobs (BullMQ)

```javascript
// 30 মিনিট পরে reminder পাঠাও
await emailQueue.add(
  "payment-reminder",
  {
    userId: user.id,
    orderId: order.id,
  },
  {
    delay: 30 * 60 * 1000, // 30 minutes
  },
);

// নির্দিষ্ট তারিখে execute করো
const scheduledDate = new Date("2026-03-01T09:00:00Z");
const delay = scheduledDate.getTime() - Date.now();

await emailQueue.add(
  "birthday-wish",
  {
    userId: user.id,
    name: user.name,
  },
  {
    delay: Math.max(0, delay),
  },
);
```

### Use Cases

```javascript
// ১. Payment timeout — 30 মিনিটে pay না করলে order cancel
app.post("/api/orders", async (req, res) => {
  const order = await Order.create({ ...req.body, status: "pending" });

  await orderQueue.add(
    "cancel-unpaid",
    {
      orderId: order.id,
    },
    {
      delay: 30 * 60 * 1000,
      jobId: `cancel-${order.id}`, // unique ID দাও
    },
  );

  res.json(order);
});

// Payment হলে scheduled cancel job remove করো
app.post("/api/orders/:id/pay", async (req, res) => {
  await Order.findByIdAndUpdate(req.params.id, { status: "paid" });

  // Cancel job remove করো — আর দরকার নেই
  const job = await orderQueue.getJob(`cancel-${req.params.id}`);
  if (job) await job.remove();

  res.json({ message: "Payment successful" });
});

// Worker — unpaid order cancel করো
const orderWorker = new Worker(
  "orders",
  async (job) => {
    if (job.name === "cancel-unpaid") {
      const order = await Order.findById(job.data.orderId);
      if (order && order.status === "pending") {
        order.status = "cancelled";
        order.cancelReason = "Payment timeout";
        await order.save();
        await emailQueue.add("order-cancelled", {
          userId: order.userId,
          orderId: order.id,
        });
      }
    }
  },
  { connection },
);

// ২. Trial expiry — 14 দিন পরে trial শেষ
await userQueue.add(
  "trial-expiry",
  {
    userId: user.id,
  },
  {
    delay: 14 * 24 * 60 * 60 * 1000, // 14 days
  },
);

// ৩. Scheduled email campaign
await emailQueue.add(
  "campaign",
  {
    campaignId: campaign.id,
    recipients: recipientList,
  },
  {
    delay: campaignDate.getTime() - Date.now(),
  },
);
```

---

## Worker Processes

### Worker কী?

**Worker** হলো একটা আলাদা process যা queue থেকে job তুলে execute করে। Main API server-এর সাথে কোনো সম্পর্ক নেই — আলাদাভাবে চলে:

```
Process Architecture:
──────────────────────────────
API Server (process 1):
  → HTTP requests handle করে
  → Queue-তে job add করে
  → Client-কে response দেয়

Worker (process 2):
  → Queue থেকে job তোলে
  → Job process করে (email, image, report)
  → Result save করে

Worker (process 3):   ← একাধিক worker চালাতে পারো
  → Same queue থেকে job তোলে
  → Parallel processing!
```

### Worker Configuration

```javascript
// worker.js
const { Worker } = require("bullmq");

const worker = new Worker(
  "email",
  async (job) => {
    // Job processing logic
  },
  {
    connection,
    concurrency: 5, // একসাথে 5টা job process করো
    limiter: {
      max: 100, // প্রতি duration-এ max 100 job
      duration: 60000, // 1 minute window
    },
  },
);

// Graceful shutdown
process.on("SIGTERM", async () => {
  console.log("Worker shutting down...");
  await worker.close();
  process.exit(0);
});
```

### Multiple Workers

```javascript
// worker-email.js — শুধু email handle করে
const emailWorker = new Worker("email", processEmail, {
  connection,
  concurrency: 10,
});

// worker-image.js — শুধু image handle করে
const imageWorker = new Worker("image-processing", processImage, {
  connection,
  concurrency: 3, // CPU-intensive, কম concurrency
});

// worker-report.js — শুধু report handle করে
const reportWorker = new Worker("report-generation", processReport, {
  connection,
  concurrency: 2,
});
```

### PM2 দিয়ে Worker চালানো

```bash
# pm2 ecosystem config
# ecosystem.config.js
module.exports = {
    apps: [
        {
            name: 'api-server',
            script: 'src/server.js',
            instances: 4,
            exec_mode: 'cluster'
        },
        {
            name: 'email-worker',
            script: 'src/workers/email.js',
            instances: 2
        },
        {
            name: 'image-worker',
            script: 'src/workers/image.js',
            instances: 1
        },
        {
            name: 'report-worker',
            script: 'src/workers/report.js',
            instances: 1
        }
    ]
};
```

```bash
pm2 start ecosystem.config.js
pm2 status
# ┌─────────────────┬────┬───────┬──────────┐
# │ Name            │ id │ mode  │ status   │
# ├─────────────────┼────┼───────┼──────────┤
# │ api-server      │ 0  │ cluster│ online  │
# │ api-server      │ 1  │ cluster│ online  │
# │ api-server      │ 2  │ cluster│ online  │
# │ api-server      │ 3  │ cluster│ online  │
# │ email-worker    │ 4  │ fork  │ online   │
# │ email-worker    │ 5  │ fork  │ online   │
# │ image-worker    │ 6  │ fork  │ online   │
# │ report-worker   │ 7  │ fork  │ online   │
# └─────────────────┴────┴───────┴──────────┘
```

---

## Job Retry ও Error Handling

### Retry Strategy

```javascript
await emailQueue.add("send-email", data, {
  attempts: 5,
  backoff: {
    type: "exponential",
    delay: 1000,
  },
});

// Retry timeline:
// Attempt 1: Immediately
// Attempt 2: 1 second পরে     (1000ms)
// Attempt 3: 2 seconds পরে    (2000ms)
// Attempt 4: 4 seconds পরে    (4000ms)
// Attempt 5: 8 seconds পরে    (8000ms)
// → সব fail হলে 'failed' state
```

### Custom Backoff

```javascript
await queue.add("task", data, {
  attempts: 5,
  backoff: {
    type: "custom",
  },
});

// Worker-এ custom backoff logic
const worker = new Worker("queue", processor, {
  connection,
  settings: {
    backoffStrategy: (attemptsMade) => {
      const delays = [1000, 5000, 30000, 60000, 300000];
      return delays[attemptsMade - 1] || 300000;
      // 1s, 5s, 30s, 1m, 5m
    },
  },
});
```

### Dead Letter Queue (DLQ)

সব retry-এর পরেও fail হলে job-কে আলাদা queue-তে রাখো:

```javascript
const emailWorker = new Worker(
  "email",
  async (job) => {
    try {
      await sendEmail(job.data);
    } catch (error) {
      if (job.attemptsMade >= job.opts.attempts - 1) {
        // Last attempt-ও fail হলে → Dead Letter Queue-তে রাখো
        await deadLetterQueue.add("failed-email", {
          originalJob: job.data,
          error: error.message,
          attempts: job.attemptsMade + 1,
          failedAt: new Date().toISOString(),
        });
      }
      throw error; // retry trigger করো
    }
  },
  { connection },
);
```

---

## Job Monitoring (Bull Board)

### Installation

```bash
npm install @bull-board/express @bull-board/api
```

### Setup

```javascript
const { createBullBoard } = require("@bull-board/api");
const { BullMQAdapter } = require("@bull-board/api/bullMQAdapter");
const { ExpressAdapter } = require("@bull-board/express");

const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath("/admin/queues");

createBullBoard({
  queues: [
    new BullMQAdapter(emailQueue),
    new BullMQAdapter(imageQueue),
    new BullMQAdapter(reportQueue),
  ],
  serverAdapter,
});

app.use("/admin/queues", serverAdapter.getRouter());
// Visit: http://localhost:3000/admin/queues
```

```
Bull Board Dashboard দেখায়:
  → Queue-তে কয়টা job waiting
  → কয়টা active (processing)
  → কয়টা completed
  → কয়টা failed (error details সহ)
  → Job retry করা যায়
  → Job delete করা যায়
```

---

## Python — Celery

Python-এর সবচেয়ে popular task queue:

### Installation

```bash
pip install celery redis
```

### Setup

```python
# celery_app.py
from celery import Celery

app = Celery('myapp',
    broker='redis://localhost:6379/0',
    backend='redis://localhost:6379/1'
)

app.conf.update(
    task_serializer='json',
    result_serializer='json',
    accept_content=['json'],
    timezone='Asia/Dhaka',
    task_track_started=True,
    task_acks_late=True,
    worker_prefetch_multiplier=1
)
```

### Task Define করা

```python
# tasks.py
from celery_app import app
import time

@app.task(bind=True, max_retries=3, default_retry_delay=60)
def send_email(self, user_id, email, template):
    try:
        # Email send logic
        send_smtp_email(email, template)
        return {'status': 'sent', 'email': email}
    except Exception as exc:
        self.retry(exc=exc)

@app.task
def generate_report(user_id, month, year):
    # Report generation logic
    report = create_monthly_report(user_id, month, year)
    return {'report_url': report.url}

@app.task
def process_image(image_path):
    # Image processing
    resize_image(image_path)
    create_thumbnail(image_path)
    return {'processed': True}
```

### Task Call করা

```python
# FastAPI route-এ
from tasks import send_email, generate_report

@app.post("/api/users")
async def create_user(user: CreateUserRequest):
    user = await db.create_user(user)

    # Background task — instantly return
    send_email.delay(user.id, user.email, 'welcome')

    return {"message": "User created", "user_id": user.id}

@app.post("/api/reports")
async def create_report(req: ReportRequest):
    # Async task with result tracking
    task = generate_report.delay(req.user_id, req.month, req.year)
    return {"task_id": task.id, "status": "processing"}

@app.get("/api/tasks/{task_id}")
async def get_task_status(task_id: str):
    task = generate_report.AsyncResult(task_id)
    return {
        "task_id": task_id,
        "status": task.status,  # PENDING, STARTED, SUCCESS, FAILURE
        "result": task.result if task.ready() else None
    }
```

### Celery Beat (Cron)

```python
app.conf.beat_schedule = {
    'daily-cleanup': {
        'task': 'tasks.cleanup_expired_data',
        'schedule': crontab(hour=2, minute=0),  # প্রতিদিন রাত 2:00
    },
    'health-check': {
        'task': 'tasks.check_system_health',
        'schedule': 300.0,  # প্রতি 5 মিনিটে
    },
    'weekly-report': {
        'task': 'tasks.generate_weekly_report',
        'schedule': crontab(hour=9, minute=0, day_of_week=1),  # সোমবার 9:00
    }
}
```

### Celery চালানো

```bash
# Worker start
celery -A celery_app worker --loglevel=info --concurrency=4

# Beat scheduler start (cron)
celery -A celery_app beat --loglevel=info

# Flower monitoring dashboard
pip install flower
celery -A celery_app flower --port=5555
```

---

## Queue Patterns

### 1. Fan-Out (এক job থেকে অনেক job)

```javascript
// Order place হলে একসাথে অনেক কাজ
const orderWorker = new Worker(
  "orders",
  async (job) => {
    const { orderId, userId } = job.data;

    await Promise.all([
      emailQueue.add("order-confirmation", { orderId, userId }),
      notificationQueue.add("push", { userId, message: "Order placed!" }),
      inventoryQueue.add("reserve-stock", { orderId }),
      analyticsQueue.add("track-order", { orderId, userId }),
    ]);
  },
  { connection },
);
```

### 2. Pipeline (Chain)

```javascript
// Step 1 → Step 2 → Step 3
const step1Worker = new Worker(
  "step1",
  async (job) => {
    const result = await processStep1(job.data);
    await step2Queue.add("process", { ...job.data, step1Result: result });
  },
  { connection },
);

const step2Worker = new Worker(
  "step2",
  async (job) => {
    const result = await processStep2(job.data);
    await step3Queue.add("finalize", { ...job.data, step2Result: result });
  },
  { connection },
);
```

### 3. Batch Processing

```javascript
// 10,000 emails একসাথে না পাঠিয়ে batch-এ ভাগ করো
async function sendBulkEmails(recipients) {
  const BATCH_SIZE = 100;

  for (let i = 0; i < recipients.length; i += BATCH_SIZE) {
    const batch = recipients.slice(i, i + BATCH_SIZE);

    await emailQueue.addBulk(
      batch.map((recipient) => ({
        name: "campaign-email",
        data: { email: recipient.email, template: "campaign" },
        opts: {
          attempts: 3,
          backoff: { type: "exponential", delay: 1000 },
        },
      })),
    );
  }
}
```

### 4. Rate-Limited Queue

```javascript
// External API rate limit মানতে — প্রতি মিনিটে max 100 request
const apiWorker = new Worker("external-api", processor, {
  connection,
  limiter: {
    max: 100,
    duration: 60000, // 100 per minute
  },
});
```

---

## Message Brokers

Queue-র জন্য ব্যবহৃত technologies:

```
Broker            Best For                  Features
──────────────────────────────────────────────────────────
Redis             Simple queues, caching     Fast, in-memory, pub/sub
RabbitMQ          Complex routing, AMQP      Reliable, routing, exchanges
Amazon SQS        AWS ecosystem              Managed, serverless, cheap
Apache Kafka      Event streaming, logs      High throughput, partitioning
Google Pub/Sub    GCP ecosystem              Managed, global
```

```
Redis:
  ✅ Fast, simple
  ✅ BullMQ/Bee-Queue ব্যবহার করে
  ❌ Data loss possible (in-memory)

RabbitMQ:
  ✅ Complex routing (exchanges, bindings)
  ✅ Message durability
  ✅ Multiple consumer patterns
  ❌ Complex setup

Kafka:
  ✅ Millions of messages/sec
  ✅ Message replay possible
  ✅ Distributed, fault-tolerant
  ❌ Overkill for simple queues
```

---

## সংক্ষেপে মনে রাখার সূত্র

```
Background Job = Request-এর বাইরে আলাদাভাবে চলা কাজ
Cron Job = নির্দিষ্ট সময়ে/interval-এ automatically চলা
Task Scheduling = নির্দিষ্ট সময়ে একবার চলা (delay)
Worker Process = Queue থেকে job তুলে execute করা

Architecture:
  Producer (API) → Queue (Redis) → Consumer (Worker)

Node.js → BullMQ (Redis-based)
  queue.add(name, data, options)
  new Worker(queue, processor)

Python → Celery (Redis/RabbitMQ-based)
  @app.task → task.delay(args)
  celery worker → celery beat (cron)

Cron Expression:
  * * * * * → minute hour day month weekday
  0 2 * * * → প্রতিদিন রাত 2:00

Job Options:
  delay    → পরে execute করো
  attempts → retry count
  backoff  → exponential retry delay
  priority → urgent jobs আগে
  timeout  → max execution time

Error Handling:
  Retry with exponential backoff
  Dead Letter Queue → সব retry fail হলে
  Monitoring → Bull Board / Flower

Worker Management:
  PM2 → Multiple workers চালাও
  concurrency → একসাথে কয়টা job
  limiter → rate limit

Queue Patterns:
  Fan-Out  → এক job → অনেক job
  Pipeline → Step 1 → Step 2 → Step 3
  Batch    → বড় কাজ ছোট ছোট ভাগে
  Rate-Limited → API limit মানতে
```

---

## Interview Golden Lines

> **Background jobs offload time-consuming tasks from the request cycle — the user gets an instant response while work happens asynchronously.**

> **The Producer-Queue-Consumer pattern decouples job creation from execution — the API adds to the queue, workers process independently.**

> **Exponential backoff on retries prevents overwhelming a failing service — each retry waits progressively longer (1s, 2s, 4s, 8s).**

> **Cron jobs handle recurring tasks (cleanup, reports, health checks). BullMQ repeatable jobs are preferred over node-cron for distributed, persistent scheduling.**

> **Worker processes run separately from the API server — you can scale them independently based on queue depth.**

> **Dead Letter Queues capture permanently failed jobs for investigation — preventing data loss and enabling manual retry.**
