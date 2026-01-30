# Git Foundations

ভার্সন কন্ট্রোল সিস্টেম (VCS) যেকোনো সফটওয়্যার ডেভেলপমেন্টের মেরুদণ্ড। Git হলো বর্তমানে বিশ্বের সবচেয়ে জনপ্রিয় Distributed Version Control System.

## What is Version Control?

**Version Control** হলো এমন একটি সিস্টেম যা কোনো ফাইলের বা ফাইল সেটের পরিবর্তনগুলো সময়ানুসারে রেকর্ড করে রাখে, যাতে আপনি পরবর্তীতে যেকোনো নির্দিষ্ট ভার্সনে ফিরে যেতে পারেন।

### Why use it?

- **History Tracking:** কে, কখন, এবং কেন কোড পরিবর্তন করেছে তা জানা যায়।
- **Collaboration:** একাধিক ডেভেলপার একই প্রজেক্টে কনফ্লিক্ট ছাড়াই কাজ করতে পারে।
- **Backup:** প্রতিটি ডেভেলপারের কাছে প্রজেক্টের সম্পূর্ণ ব্যাকআপ থাকে (DVCS-এর ক্ষেত্রে)।

## Centralized vs Distributed VCS

### Centralized VCS (CVCS)

- একটি সেন্ট্রাল সার্ভারে সব ফাইল এবং হিস্ট্রি থাকে (যেমন: SVN, Perforce)।
- ডেভেলপাররা সার্ভার থেকে ফাইল চেক-আউট করে এবং কাজ শেষে চেক-ইন করে।
- **সমস্যা:** সার্ভার ডাউন হলে কেউ কাজ করতে পারে না বা হিস্ট্রি দেখতে পারে না।

### Distributed VCS (DVCS)

- প্রতিটি ডেভেলপারের কম্পিউটারে প্রজেক্টের **সম্পূর্ণ কপি** (ফাইল + সম্পূর্ণ হিস্ট্রি) থাকে (যেমন: Git, Mercurial)।
- সার্ভার ডাউন থাকলেও লোকালি সব কাজ (commit, log, branch) করা যায়।
- পরে সার্ভারের সাথে Sync (push/pull) করা হয়।

---

## Installation & Setup

### Installing Git

- **Windows:** [git-scm.com](https://git-scm.com/) থেকে ইনস্টলার ডাউনলোড করে ইনস্টল করুন।
- **Linux (Ubuntu/Debian):** `sudo apt install git`
- **Mac:** `brew install git`

### Initial Configuration

ইনস্টল করার পর প্রথম কাজ হলো আপনার নাম এবং ইমেইল সেট করা। Git প্রতিটি কমিটে এই তথ্য ব্যবহার করে।

```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

কনফিগারেশন চেক করতে:

```bash
git config --list
```

---

## Git Architecture: The Three States

Git-এ ফাইল মূলত তিনটি অবস্থায় থাকতে পারে:

1.  **Working Directory:**
    - এটি আপনার প্রজেক্টের বর্তমান ফোল্ডার যেখানে আপনি ফাইল তৈরি বা এডিট করছেন।
    - এখানকার পরিবর্তনগুলো Git এখনো ট্র্যাক করছে না (Untracked or Modified)।

2.  **Staging Area (Index):**
    - এটি একটি ভার্চুয়াল জোন। আপনি যখন `git add` করেন, তখন ফাইলগুলো এখানে জমা হয়।
    - এটি নির্দেশ করে যে পরবর্তী কমিটে কী কী ফাইল যাবে।

3.  **Repository (.git directory):**
    - যখন আপনি `git commit` করেন, তখন Staging Area থেকে ফাইলগুলো স্থায়ীভাবে `.git` ডিরেক্টরিতে সেভ হয়।
    - এটিই আপনার প্রজেক্টের পার্মানেন্ট হিস্ট্রি।

---

## Basic Commands

### 1. Initialize a Repository (`git init`)

নতুন প্রজেক্ট শুরু করতে:

```bash
mkdir my-project
cd my-project
git init
```

এটি একটি `.git` ফোল্ডার তৈরি করে।

### 2. Clone a Repository (`git clone`)

অন্য কোথাও থাকা প্রজেক্ট (যেমন GitHub) ডাউনলোড করতে:

```bash
git clone https://github.com/username/repo-name.git
```

### 3. Check Status (`git status`)

ফাইলগুলোর বর্তমান অবস্থা (Modified, Staged, Untracked) দেখতে:

```bash
git status
```

### 4. Add Files (`git add`)

ফাইলকে Working Directory থেকে Staging Area-তে নিতে:

```bash
git add filename.txt      # একটি ফাইল অ্যাড করতে
git add .                 # সব ফাইল অ্যাড করতে
```

### 5. Commit Changes (`git commit`)

Staging Area-র ফাইলগুলো রিপোজিটরিতে সেভ করতে:

```bash
git commit -m "Initial commit"
```

`-m` ফ্ল্যাগ দিয়ে মিনিংফুল মেসেজ দেওয়া জরুরি।

### 6. View History (`git log`)

কমিট হিস্ট্রি দেখতে:

```bash
git log
git log --oneline         # সব কমিট এক লাইনে দেখতে
```

## Summary Workflow

1. কোড লিখুন বা পরিবর্তন করুন (**Working Directory**)।
2. `git add` দিয়ে ফাইলগুলো সিলেক্ট করুন (**Staging Area**)।
3. `git commit` দিয়ে সেভ করুন (**Repository**)।
