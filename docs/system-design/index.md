# System Design (সিস্টেম ডিজাইন)

সিস্টেম ডিজাইন হলো একটি জটিল সমস্যার সমাধান করার জন্য বিভিন্ন কম্পোনেন্ট, আর্কিটেকচার এবং ইন্টারফেস ডিজাইন করার প্রক্রিয়া। এটি মূলত একটি সফটওয়্যার সিস্টেমের ব্লুপ্রিন্ট।

এই গাইডে আমরা সিস্টেম ডিজাইনের বিভিন্ন দিক নিয়ে আলোচনা করব, বিশেষ করে **High Level Design (HLD)** এবং এর ফান্ডামেন্টাল বিষয়গুলো।

## আমাদের শেখার ধাপসমূহ

### ধাপ ১: ফান্ডামেন্টালস (Fundamentals)
সিস্টেম ডিজাইনের প্রাথমিক বিষয়গুলো বোঝা অত্যন্ত জরুরি। এখানে আমরা শিখব:

*   [Serverless vs Serverfull](./step-1-fundamentals/serverless-serverfull)
*   [Scaling (Horizontal vs Vertical)](./step-1-fundamentals/scaling)
*   [Threads and Pages](./step-1-fundamentals/threads-pages)
*   [How the Web Works](./step-1-fundamentals/how-web-works)

### ধাপ ২: ডেটাবেস (Databases)
ডেটা কিভাবে স্টোর এবং রিট্রিভ করা হয় তা সিস্টেম ডিজাইনের একটি বড় অংশ। এখানে আমরা জানব:

*   [SQL vs NoSQL Databases](./step-2-databases/sql-nosql)
*   [In-Memory Databases (Redis)](./step-2-databases/in-memory-dbs)
*   [Data Replication & Migration](./step-2-databases/replication-migration)
*   [Data Partitioning & Sharding](./step-2-databases/partitioning-sharding)

### ধাপ ৩: কন্সিস্টেন্সি এবং অ্যাভেইল্যাবিলিটি (Consistency & Availability)
একটি ডিস্ট্রিবিউটেড সিস্টেমে ডেটা কতটা সঠিক এবং সিস্টেম কতটা সচল থাকবে তা নিয়ে আলোচনা:

*   [Data Consistency & its Levels](./step-3-consistency-availability/consistency-levels)
*   [Isolation & its Levels (ACID)](./step-3-consistency-availability/isolation-levels)
*   [CAP Theorem Deep-Dive](./step-3-consistency-availability/cap-theorem)

---

> [!TIP]
> সিস্টেম ডিজাইন শুধুমাত্র থিওরি নয়, এটি বাস্তব অভিজ্ঞতার মাধ্যমে শেখার বিষয়। তাই প্রতিটি টপিক পড়ার সাথে সাথে এর বাস্তব প্রয়োগ ভাবার চেষ্টা করুন।
