# Advanced Topics

অপারেটিং সিস্টেমের অ্যাডভান্সড টপিকগুলো আধুনিক কম্পিউটিং এবং ক্লাউড ইনফ্রাস্ট্রাকচারের ভিত্তি।

## 1. Virtualization & Hypervisors

**Virtualization** হলো একটি ফিজিক্যাল মেশিনে একাধিক ভার্চুয়াল মেশিন (VM) চালানোর টেকনোলজি।

### Hypervisor

**Hypervisor** হলো সফটওয়্যার যা ভার্চুয়াল মেশিন তৈরি এবং ম্যানেজ করে।

**Types:**

- **Type 1 (Bare-metal):** সরাসরি হার্ডওয়্যারে চলে (VMware ESXi, Hyper-V, KVM)।
- **Type 2 (Hosted):** হোস্ট OS-এর উপরে চলে (VirtualBox, VMware Workstation)।

**Real-life Example:**
একটি বিল্ডিংয়ে একাধিক অফিস। প্রতিটি অফিস আলাদা কিন্তু একই বিল্ডিং শেয়ার করছে।

## 2. NUMA (Non-Uniform Memory Access)

**NUMA** হলো একটি মেমোরি আর্কিটেকচার যেখানে প্রতিটি CPU-র নিজস্ব লোকাল মেমোরি থাকে। লোকাল মেমোরি এক্সেস দ্রুত কিন্তু রিমোট মেমোরি এক্সেস ধীর।

**কেন ব্যবহার করা হয়?**

- মাল্টি-সকেট সার্ভারে স্কেলেবিলিটি বাড়ানো।
- মেমোরি ব্যান্ডউইথ বাড়ানো।

**Challenge:** OS-কে NUMA-aware হতে হয় যাতে প্রসেসকে তার লোকাল মেমোরির কাছাকাছি শিডিউল করা যায়।

## 3. Modern OS Internals

### Linux

- **Kernel:** Monolithic কিন্তু modular।
- **Scheduler:** CFS (Completely Fair Scheduler)।
- **File Systems:** ext4, XFS, Btrfs।

### Windows

- **Kernel:** Hybrid (Microkernel + Monolithic)।
- **Scheduler:** Priority-based।
- **File Systems:** NTFS, ReFS।

### macOS

- **Kernel:** XNU (Hybrid - Mach microkernel + BSD)।
- **File Systems:** APFS।

## 4. Containers vs VMs

### Virtual Machines

- পুরো OS চালায়।
- হেভিওয়েট (GB সাইজ)।
- স্ট্রং আইসোলেশন।
- বুট টাইম মিনিটে।

### Containers (Docker)

- শুধু অ্যাপ্লিকেশন এবং ডিপেন্ডেন্সি প্যাকেজ করে।
- লাইটওয়েট (MB সাইজ)।
- হোস্ট OS-এর কার্নেল শেয়ার করে।
- বুট টাইম সেকেন্ডে।

**Real-life Example:**

- **VM:** পুরো বাড়ি ভাড়া নেওয়া।
- **Container:** একটি রুম ভাড়া নেওয়া (বাথরুম, কিচেন শেয়ার)।

### Kubernetes

কন্টেইনার অর্কেস্ট্রেশন টুল। একাধিক কন্টেইনার ম্যানেজ, স্কেল, এবং ডিপ্লয় করে।

## 5. Real-Time Operating Systems (RTOS)

**RTOS** হলো এমন OS যা নির্দিষ্ট সময়ের মধ্যে টাস্ক সম্পন্ন করার গ্যারান্টি দেয়।

**Characteristics:**

- **Deterministic:** একই ইনপুটে সবসময় একই টাইমে রেসপন্স।
- **Low Latency:** খুব কম রেসপন্স টাইম।
- **Priority-based Scheduling:** হাই প্রায়োরিটি টাস্ক সবসময় আগে রান হয়।

**Use Cases:**

- **Automotive:** গাড়ির ব্রেক সিস্টেম।
- **Medical Devices:** পেসমেকার।
- **Industrial Automation:** রোবট আর্ম।
- **Aerospace:** ফ্লাইট কন্ট্রোল সিস্টেম।

**Examples:** FreeRTOS, VxWorks, QNX।
