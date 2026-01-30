# OS Fundamentals Q&A (Interview Preparation)

অপারেটিং সিস্টেম ইন্টারভিউতে সাধারণত দুই ধরণের প্রশ্ন করা হয়: **Theoretical** (থিওরিটিক্যাল) এবং **Scenario-based** (সিনারিও-বেসড)। নিচে গুরুত্বপূর্ণ প্রশ্নগুলো দেওয়া হলো।

## General OS Concepts

### Q1: কার্নেল এবং ইউজার স্পেসের মধ্যে পার্থক্য কী?

**Answer:**

- **Kernel Space:** এখানে OS-এর কোর কম্পোনেন্ট (כযেমন মেমোরি ম্যানেজার, শিডিউলার) রান হয়। এখানে সব হার্ডওয়্যারে ফুল এক্সেস থাকে।
- **User Space:** এখানে সাধারণ অ্যাপ্লিকেশন (যেমন Browser, Editor) রান হয়। এখান থেকে হার্ডওয়্যার এক্সেস করতে হলে **System Call** ব্যবহার করতে হয়।

### Q2: System Call কী? কয়েকটি উদাহরণ দিন।

**Answer:**
System Call হলো ইউজার প্রোগ্রাম এবং কার্নেলের মধ্যে একটি ইন্টারফেস। যখন কোনো ইউজার প্রোগ্রাম হার্ডওয়্যার রিসোর্স (যেমন ফাইল রিড, মেমোরি অ্যালোকেশন) চায়, তখন সে সিস্টেম কল করে।
**Examples:** `fork()`, `exec()`, `read()`, `write()`, `open()`.

### Q3: Monolithic Kernel vs Microkernel?

**Answer:**

- **Monolithic Kernel:** OS-এর সব সার্ভিস (File system, Driver, Memory management) একই কার্নেল স্পেসে চলে। Example: Linux, Unix. (Fast but less secure/stable).
- **Microkernel:** শুধুমাত্র বেসিক সার্ভিস (IPC, Scheduling) কার্নেলে থাকে, বাকি সব ইউজার স্পেসে চলে। Example: Minix, QNX. (More stable but slower due to context switching).

---

## Processes & Threads

### Q4: Process এবং Thread-এর মধ্যে মূল পার্থক্য কী?

**Answer:**

- **Process:** একটি এক্সিকিউটিং প্রোগ্রাম। প্রতিটি প্রসেসের নিজস্ব মেমোরি স্পেস (Code, Data, Heap, Stack) থাকে। এটি হেভিওয়েট।
- **Thread:** প্রসেসের একটি সাব-ইউনিট। একই প্রসেসের থ্রেডগুলো মেমোরি শেয়ার করে (Code, Data, Heap), কিন্তু নিজস্ব Stack থাকে। এটি লাইটওয়েট।

### Q5: Context Switching কী? এটি কেন ব্যয়বহুল (expensive)?

**Answer:**
CPU যখন এক প্রসেস থেকে অন্য প্রসেসে সুইচ করে, তখন বর্তমান প্রসেসের স্টেট (Register values, PC) সেভ করতে হয় এবং নতুন প্রসেসের স্টেট লোড করতে হয়। একে Context Switching বলে।
এটি ব্যয়বহুল কারণ:

1. রেজিস্টার সেভ/লোড করতে সময় লাগে।
2. Cache flush হয়ে যায় (TLB flush), ফলে মেমোরি এক্সেস স্লো হয়ে যায়।

### Q6: Zombie Process এবং Orphan Process কী?

**Answer:**

- **Zombie Process:** প্রসেস শেষ হয়ে গেছে (`exit()` কল করেছে), কিন্তু প্যারেন্ট প্রসেস এখনো `wait()` কল করে তার স্ট্যাটাস রিড করেনি। প্রসেস টেবিলে এন্ট্রি থেকে যায়।
- **Orphan Process:** প্যারেন্ট প্রসেস মারা গেছে, কিন্তু চাইল্ড প্রসেস এখনো চলছে। `init` প্রসেস এদের অ্যাডপ্ট করে নেয়।

---

## Concurrency & Synchronization

### Q7: Race Condition কী?

**Answer:**
যখন একাধিক প্রসেস বা থ্রেড একই সময়ে শেয়ারড ডেটা এক্সেস বা মডিফাই করার চেষ্টা করে এবং আউটপুট তাদের এক্সিকিউশন অর্ডারের ওপর নির্ভর করে, তখন তাকে Race Condition বলে।

### Q8: Deadlock হওয়ার ৪টি শর্ত (Coffman Conditions) কী কী?

**Answer:**

1. **Mutual Exclusion:** রিসোর্স শেয়ার করা যাবে না (এক সময়ে একজন)।
2. **Hold and Wait:** একটি রিসোর্স ধরে রেখে অন্যটির জন্য অপেক্ষা করা।
3. **No Preemption:** জোর করে রিসোর্স কেড়ে নেওয়া যাবে না।
4. **Circular Wait:** A ওয়েট করছে B-এর জন্য, B C-এর জন্য, C A-এর জন্য।

### Q9: Mutex এবং Semaphore-এর পার্থক্য কী?

**Answer:**

- **Mutex (Lock):** লকিং মেকানিজম। যে থ্রেড লক করে, শুধু সেই আনলক করতে পারে। (Ownership আছে)।
- **Semaphore:** সিগন্যালিং মেকানিজম। এটি একটি কাউন্টার। এটি একাধিক থ্রেডকে এক্সেস দিতে পারে (Counting Semaphore)। এর কোনো ওনারশিপ নেই।

---

## Memory Management

### Q10: Virtual Memory কী? এটি কেন প্রয়োজন?

**Answer:**
Virtual Memory হলো একটি টেকনিক যা ফিজিক্যাল মেমোরি (RAM) এর চেয়ে বড় প্রোগ্রাম রান করতে দেয়। এটি ফিজিক্যাল মেমোরি এবং সেকেন্ডারি স্টোরেজ (Disk) মিলিয়ে একটি ইল্যুশন তৈরি করে।
**প্রয়োজন:**

1. RAM-এর চেয়ে বড় প্রোগ্রাম চালানো।
2. প্রসেস আইসোলেশন (এক প্রসেস অন্য প্রসেসের মেমোরি এক্সেস করতে পারে না)।

### Q11: Page Fault কী? OS এটি কীভাবে হ্যান্ডেল করে?

**Answer:**
যখন CPU এমন একটি পেইজ এক্সেস করতে চায় যা বর্তমানে RAM-এ নেই (Virtually mapped but not physically loaded), তখন Page Fault হয়।
**Handling:**

1. OS ইন্টারাপ্ট পায় এবং প্রসেস পজ করে।
2. ডিস্ক থেকে মিসিং পেইজটি ক্খুঁজে বের করে।
3. RAM-এ খালি ফ্রেম থাকলে সেখানে লোড করে (না থাকলে Page Replacement করে)।
4. Page Table আপডেট করে এবং ইনস্ট্রাকশন রিস্টার্ট করে।

### Q12: Thrashing কী?

**Answer:**
যখন সিস্টেম খুব বেশি Page Fault হ্যান্ডেল করতে ব্যস্ত থাকে এবং আসল কাজ করার সময় পায় না, তখন তাকে Thrashing বলে। এটি হয় যখন RAM-এ পর্যাপ্ত জায়গা থাকে না এবং বারবার Page Replacement হতে থাকে।

---

## Scenario-Based Q&A (Advanced)

### Scenario 1: High CPU Usage Debugging

**Question:** আপনার লিনাক্স সার্ভারটি হঠাৎ স্লো হয়ে গেছে। `top` কমান্ডে দেখছেন Load Average অনেক বেশি। আপনি কীভাবে ডিবাগ করবেন?
**Answer:**

1. **Identify Process:** `top` বা `htop` দিয়ে দেখব কোন প্রসেস CPU খাচ্ছে।
2. **Check I/O Wait:** যদি CPU usage কম কিন্তু Load Average বেশি হয়, তবে `iostat` বা `iotop` দিয়ে ডিস্ক I/O চেক করব। হতে পারে ডিস্ক বটলনেক।
3. **Check Memory:** `free -m` দিয়ে দেখব সোয়াপিং (Swapping) হচ্ছে কিনা। সোয়াপিং হলে সিস্টেম স্লো হবে।
4. **Logs:** `dmesg` বা `/var/log/syslog` চেক করব কোনো কার্নেল এরর (OOM Killer) আছে কিনা।

### Scenario 2: Web Server Design

**Question:** আপনাকে একটি হাই-পারফরম্যান্স ওয়েব সার্ভার ডিজাইন করতে বলা হলো (כযেমন Nginx)। আপনি কি Multi-threaded মডেল ব্যবহার করবেন নাকি Event-driven? কেন?
**Answer:**
**Event-driven (Asynchronous I/O)** মডেল প্রেফার করব।

- **Reason:** ট্র্যাডিশনাল Multi-threaded মডেলে প্রতিটি রিকোয়েস্টের জন্য একটি থ্রেড তৈরি হয়। ১০,০০০ কনকারেন্ট কানেকশনের জন্য ১০,০০০ থ্রেড তৈরি করলে Context Switching-এর কারণে CPU শেষ হয়ে যাবে এবং মেমোরি অনেক লাগবে।
- Event-driven মডেলে (Single threaded with Non-blocking I/O - like Node.js/Nginx) একটি লুপেই সব রিকোয়েস্ট হ্যান্ডেল করা যায়, যা অনেক বেশি স্কেলেবল।

### Scenario 3: Database Consistency

**Question:** আপনি একটি ব্যাংকিং সিস্টেম বানাচ্ছেন। টাকা ট্রান্সফারের সময় লোড শেডিং এ সার্ভার বন্ধ হয়ে গেল। টাকা প্রেরকের অ্যাকাউন্ট থেকে কমলো কিন্তু প্রাপকের অ্যাকাউন্টে যোগ হলো না। OS-এর কোন কনসেপ্ট এখানে আপনাকে বাঁচাবে?
**Answer:**
এখানে **Transaction (ACID properties)** এবং **Journaling/Write-Ahead Logging (WAL)** কনসেপ্ট লাগবে।

- ফাইল সিস্টেম লেভেলে **Journaling File System** (যেমন ext4, NTFS) মেটাডেটা চেঞ্জ করার আগে জার্নালে লিখে রাখে।
- ক্র্যাশ হওয়ার পর রিবুট হলে OS জার্নাল চেক করে ইনকমপ্লিট অপারেশন রোলব্যাক (Undo) বা রিপ্লে (Redo) করে কনসিস্টেন্সি ফিরিয়ে আনে।

### Scenario 4: Chrome Tabs

**Question:** Google Chrome-এ প্রতিটি ট্যাব কেন আলাদা প্রসেস হিসেবে চলে (Multi-process architecture)? কেন একটি সিঙ্গেল প্রসেসে সব ট্যাব চলে না?
**Answer:**

1. **Stability:** একটি ট্যাব ক্র্যাশ করলে (e.g. Bad JavaScript) পুরো ব্রাউজার বন্ধ হবে না।
2. **Security (Sandboxing):** এক ট্যাবের মেলিসিয়াস কোড অন্য ট্যাবের ডেটা (যেমন ব্যাংকিং সেশন) পড়তে পারবে না।
3. **Performance:** মাল্টি-কোর CPU-র সুবিধা নেওয়া যায়।
   **Trade-off:** RAM ব্যবহার বেশি হয় কারণ প্রতিটি প্রসেসের নিজস্ব মেমোরি ওভারহেড থাকে।

### Scenario 5: Producer-Consumer Problem

**Question:** একটি ডাটা পাইপলাইন আছে যেখানে একটি থ্রেড ডাটা জেনারেট করছে (Producer) এবং অন্যটি প্রসেস করছে (Consumer)। বাফার সাইজ ফিক্সড। আপনি কীভাবে এটি ইমপ্লিমেন্ট করবেন যাতে বাফার ফুল হলে প্রোডিউসার ওয়েট করে এবং এম্পটি হলে কনজিউমার ওয়েট করে?
**Answer:**
আমি **Semaphores** এবং **Mutex** ব্যবহার করব।

- `Mutex`: বাফার এক্সেস প্রোটেক্ট করার জন্য (যাতে দুজন একসাথে রাইট/রিড না করে)।
- `Semaphore empty = N`: বাফারে কয়টি খালি স্লট আছে। (Producer এটি `wait()` করবে)।
- `Semaphore full = 0`: বাফারে কয়টি আইটেম আছে। (Consumer এটি `wait()` করবে)।

**Logic:**

- Producer: `wait(empty) -> lock(mutex) -> write -> unlock(mutex) -> signal(full)`
- Consumer: `wait(full) -> lock(mutex) -> read -> unlock(mutex) -> signal(empty)`
