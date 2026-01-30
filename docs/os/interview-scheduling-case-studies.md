# Scheduling Case Studies (Linux vs Windows)

ইন্টারভিউতে প্রায়ই রিয়েল-ওয়ার্ল্ড অপারেটিং সিস্টেমের শিডিউলিং অ্যালগরিদম সম্পর্কে জানতে চাওয়া হয়। এখানে **Linux (CFS)** এবং **Windows Scheduler**-এর কেস স্টাডি দেওয়া হলো।

## Linux Scheduler: Completely Fair Scheduler (CFS)

লিনাক্স কার্নেল ২.৬.২৩ থেকে **CFS** ডিফল্ট শিডিউলার হিসেবে ব্যবহৃত হচ্ছে।

### Core Concept

CFS-এর মূল লক্ষ্য হলো প্রতিটি প্রসেসকে CPU-তে সমান সময় দেওয়া (Fair Share)। এটি প্রথাগত টাইম স্লাইস (Time Slice) ব্যবহার করে না, বরং **vruntime (Virtual Runtime)** ব্যবহার করে।

### How it Works

1. **Red-Black Tree:** CFS রানউইবল (runnable) প্রসেসগুলোকে একটি **Time-ordered Red-Black Tree**-তে স্টোর করে।
2. **vruntime:** প্রতিটি প্রসেসের `vruntime` ট্র্যাক করা হয়। যে প্রসেসটি CPU কম পেয়েছে, তার `vruntime` কম হবে।
3. **Selection:** শিডিউলার ট্রি-এর সবচেয়ে বামের (Leftmost) নোডটিকে সিলেক্ট করে (যার `vruntime` সবচেয়ে কম)।
4. **Context Switch:** যখন রানিং প্রসেসের `vruntime` অন্য প্রসেসের চেয়ে বেশি হয়ে যায়, তখন তাকে ট্রি-তে ইনসার্ট করা হয় এবং নতুন লোয়েস্ট `vruntime` প্রসেসকে পিক করা হয়।

### Key Features

- **No Arrays/Queues:** স্ট্যান্ডার্ড কিউ-এর বদলে ট্রি ব্যবহার করায় সার্চ টাইম `O(log N)`।
- **Nice Value:** প্রসেসের প্রায়োরিটি (Nice value) অনুযায়ী `vruntime` ক্যালকুলেশনে ওয়েট (Weight) দেওয়া হয়।
- **Responsiveness:** ইন্টারঅ্যাক্টিভ টাস্কগুলোর `vruntime` সাধারণত কম থাকে, তাই তারা দ্রুত CPU পায়।

---

## Windows Scheduler

Windows NT কার্নেল (Win 10/11 including) একটি **Priority-driven** এবং **Preemptive** শিডিউলিং ব্যবহার করে।

### Core Concept

Windows ৩২টি প্রায়োরিটি লেভেল ব্যবহার করে এবং এটি **Multilevel Feedback Queue**-এর মতো কাজ করে।

### Priority Levels (0-31)

1. **Real-time Class (16-31):** টাইম-ক্রিটিক্যাল টাস্ক (ইন্টারাপ্ট হ্যান্ডলিং, ড্রাইভার)।
2. **Variable Class (1-15):** সাধারণ ইউজার প্রসেস।
3. **Zero Page Thread (0):** যখন কোনো প্রসেস রানিং থাকে না (Idle process)।

### How it Works

1. **Dispatcher:** Windows শিডিউলারকে "Dispatcher" বলা হয়। এটি সবসময় হাইয়েস্ট প্রায়োরিটির রেডি থ্রেডকে রান করে।
2. **Quantum:** প্রতিটি প্রসেসকে একটি টাইম কোয়ান্টাম দেওয়া হয়। উইন্ডোজ ক্লায়েন্ট (Desktop) ভার্সনে ফোরগ্রাউন্ড প্রসেসের কোয়ান্টাম ব্যাকগ্রাউন্ডের চেয়ে বেশি হয়।
3. **Priority Boosting:**
   - **I/O Completion:** I/O অপারেশন শেষ হলে থ্রেডের প্রায়োরিটি টেম্পোরারিলি বাড়িয়ে দেওয়া হয় যাতে ইউজার রেসপন্স পায়।
   - **Starvation Handling:** যদি কোনো লো-প্রায়োরিটি থ্রেড ৩০০ সেকেন্ডের বেশি রান না করে, তবে তাকে র‍্যান্ডমলি বুস্ট করে লেভেল ১৫-এ আনা হয়।

---

## Comparison Summary

| Feature            | Linux (CFS)                              | Windows Scheduler                               |
| :----------------- | :--------------------------------------- | :---------------------------------------------- |
| **Algorithm**      | Weighted Fair Queuing (via RB-Tree)      | Multilevel Feedback Queue (Preemptive Priority) |
| **Data Structure** | Red-Black Tree                           | 32 Priority Queues (Linked Lists)               |
| **Time Slice**     | Dynamic (based on `vruntime`)            | Fixed (Quantum), but variable length            |
| **Focus**          | Fairness & Throughput (Server Optimized) | Responsiveness (Desktop/GUI Optimized)          |
| **Starvation**     | Inherently handled by RB-Tree logic      | Explicit logic checks every few seconds         |

## Interview Questions on Scheduling

### Q1: Linux কেন O(1) শিডিউলার বাদ দিয়ে CFS-এ গেল?

**Answer:**
পুরানো O(1) শিডিউলার ইন্টারঅ্যাক্টিভ (Desktop) টাস্কের জন্য ফেয়ার ছিল না। CFS গাণিতিকভাবে প্রমাণ করতে পারে যে প্রতিটি প্রসেস তার ফেয়ার শেয়ার পাবে, যা সার্ভার এবং ডেস্কটপ উভয়ের জন্যই ভালো।

### Q2: Windows-এ "Priority Boosting" কেন দরকার?

**Answer:**
উইন্ডোজ একটি GUI-হেভি OS। মাউস ক্লিক বা কিবোর্ড ইভেন্ট হ্যান্ডেল করা প্রসেসগুলো যদি I/O-র পর সাথে সাথে CPU না পায়, তবে সিস্টেম ল্যাগি (Laggy) মনে হবে। তাই বুস্টিং দিয়ে রেসপন্সিভনেস নিশ্চিত করা হয়।

### Q3: `nice` ভ্যালু নেগেটিভ হলে লিনাক্সে কী হয়?

**Answer:**
`nice` ভ্যালু নেগেটিভ মানে হাই প্রায়োরিটি (-20 to +19)।
CFS-এ হাই প্রায়োরিটি প্রসেসের `vruntime` খুব ধীরে বাড়ে (Weight factor-এর কারণে)। ফলে সেটি ট্রি-এর বাম দিকে বেশিক্ষণ থাকে এবং বেশি CPU টাইম পায়।
