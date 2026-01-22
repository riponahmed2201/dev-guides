# System Design (সিস্টেম ডিজাইন)

সিস্টেম ডিজাইন হলো একটি জটিল সমস্যার সমাধান করার জন্য বিভিন্ন কম্পোনেন্ট, আর্কিটেকচার এবং ইন্টারফেস ডিজাইন করার প্রক্রিয়া। এটি মূলত একটি সফটওয়্যার সিস্টেমের ব্লুপ্রিন্ট।

এই গাইডে আমরা সিস্টেম ডিজাইনের বিভিন্ন দিক নিয়ে আলোচনা করব, বিশেষ করে **High Level Design (HLD)** এবং এর ফান্ডামেন্টাল বিষয়গুলো।

## আমাদের শেখার ধাপসমূহ

### ধাপ ১: ফান্ডামেন্টালস (Fundamentals)

সিস্টেম ডিজাইনের প্রাথমিক বিষয়গুলো বোঝা অত্যন্ত জরুরি। এখানে আমরা শিখব:

- [Serverless vs Serverfull](./step-1-fundamentals/serverless-serverfull)
- [Scaling (Horizontal vs Vertical)](./step-1-fundamentals/scaling)
- [Threads and Pages](./step-1-fundamentals/threads-pages)
- [How the Web Works](./step-1-fundamentals/how-web-works)

### ধাপ ২: ডেটাবেস (Databases)

ডেটা কিভাবে স্টোর এবং রিট্রিভ করা হয় তা সিস্টেম ডিজাইনের একটি বড় অংশ। এখানে আমরা জানব:

- [SQL vs NoSQL Databases](./step-2-databases/sql-nosql)
- [In-Memory Databases (Redis)](./step-2-databases/in-memory-dbs)
- [Data Replication & Migration](./step-2-databases/replication-migration)
- [Data Partitioning & Sharding](./step-2-databases/partitioning-sharding)

### ধাপ ৩: কন্সিস্টেন্সি এবং অ্যাভেইল্যাবিলিটি (Consistency & Availability)

একটি ডিস্ট্রিবিউটেড সিস্টেমে ডেটা কতটা সঠিক এবং সিস্টেম কতটা সচল থাকবে তা নিয়ে আলোচনা:

- [Data Consistency & its Levels](./step-3-consistency-availability/consistency-levels)
- [Isolation & its Levels (ACID)](./step-3-consistency-availability/isolation-levels)
- [CAP Theorem Deep-Dive](./step-3-consistency-availability/cap-theorem)

### ধাপ ৪: ক্যাশ এবং সিডিএন (Cache & CDNs)

সিস্টেমের স্পিড বাড়ানোর জন্য ডেটা টেম্পোরারি স্টোর করার কৌশল:

- [What is Cache? (Redis, Memcached)](./step-4-cache/cache-basics)
- [Write Policies: Write Back, Through & Around](./step-4-cache/write-policies)
- [Replacement Policies: LRU, LFU, etc.](./step-4-cache/replacement-policies)
- [Content Delivery Network (CDNs)](./step-4-cache/cdn)

### ধাপ ৫: নেটওয়ার্কিং (Networking)

সিস্টেমের বিভিন্ন কম্পোনেন্টের মধ্যে যোগাযোগ করার প্রোটোকল এবং পদ্ধতি:

- [TCP vs UDP](./step-5-networking/tcp-udp)
- [What is HTTP (1/2/3) & HTTPS?](./step-5-networking/http-https)
- [Web Sockets](./step-5-networking/websockets)
- [WebRTC & Video Streaming](./step-5-networking/webrtc-streaming)

### ধাপ ৬: লোড ব্যালেন্সার এবং প্রক্সি (Load Balancers & Proxies)

সিস্টেমের ট্রাফিক ম্যানেজমেন্ট এবং সিকিউরিটি নিশ্চিত করার উপায়:

- [Load Balancing Algorithms (Stateless & Stateful)](./step-6-load-balancers/load-balancers)
- [Consistent Hashing](./step-6-load-balancers/consistent-hashing)
- [Proxy & Reverse Proxy](./step-6-load-balancers/proxies)
- [Rate Limiting](./step-6-load-balancers/rate-limiting)

### ধাপ ৭: মেসেজ কিউ (Message Queues)

সিস্টেমের বিভিন্ন কম্পোনেন্টের মধ্যে অ্যাসিনক্রোনাস যোগাযোগ:

- [Asynchronous processing (Kafka, RabbitMQ)](./step-7-message-queues/kafka-rabbitmq)
- [Publishers - Subscriber Model](./step-7-message-queues/pub-sub)

### ধাপ ৮: মনোলিথ বনাম মাইক্রোসার্ভিস (Monoliths vs Microservices)

আধুনিক সিস্টেম আর্কিটেকচার এবং স্কেলিং কৌশল:

- [Why microservices?](./step-8-microservices/monoliths-microservices)
- [Single point of failure & Cascading failures](./step-8-microservices/failure-management)
- [Containerization (Docker)](./step-8-microservices/containerization-docker)
- [Migrating to Microservices](./step-8-microservices/migration-strategy)

### ধাপ ৯: মনিটরিং এবং লগিং (Monitoring & Logging)

সিস্টেমের স্বাস্থ্য এবং পারফরম্যান্স ট্রাক করার উপায়:

- [Logging events & monitoring metrics](./step-9-monitoring/logging-metrics)
- [Anomaly Detection](./step-9-monitoring/anomaly-detection)

### ধাপ ১০: সিকিউরিটি (Security)

সিস্টেমের নিরাপত্তা নিশ্চিত করার বিভিন্ন লেয়ার এবং টেকনিক:

- [Tokens for Auth (JWT, Session Tokens)](./step-10-security/auth-tokens)
- [SSO & OAuth](./step-10-security/sso-oauth)
- [Access Control Lists & Rule Engines](./step-10-security/access-control)
- [Encryption (Symmetric & Asymmetric)](./step-10-security/encryption)

### ধাপ ১১: সিস্টেম ডিজাইন ট্রেড-অফ (System Design Tradeoffs)

সিস্টেম ডিজাইনে প্রতিটি সিদ্ধান্তের সুবিধা এবং অসুবিধা থাকে। এখানে আমরা গুরুত্বপূর্ণ কিছু ট্রেড-অফ নিয়ে আলোচনা করব:

- [Push vs Pull Architecture](./step-11-tradeoffs/push-pull)
- [Consistency vs Availability (CAP)](./step-11-tradeoffs/consistency-availability)
- [SQL vs NoSQL Tradeoffs](./step-11-tradeoffs/sql-nosql-tradeoff)
- [Performance Tradeoffs (Latency vs Memory/Throughput/Accuracy)](./step-11-tradeoffs/latency-tradeoffs)

---

> [!TIP]
> সিস্টেম ডিজাইন শুধুমাত্র থিওরি নয়, এটি বাস্তব অভিজ্ঞতার মাধ্যমে শেখার বিষয়। তাই প্রতিটি টপিক পড়ার সাথে সাথে এর বাস্তব প্রয়োগ ভাবার চেষ্টা করুন।
