# Undoing & Cleaning

ভুল মানুষই করে, আর ডেভেলপমেন্টে ভুল হওয়া স্বাভাবিক। Git-এ যেকোনো ভুল শুধরানোর (Undoing) বা আনওয়ান্টেড ফাইল ক্লিন করার শক্তিশালী টুল আছে।

## Undoing Commits

### 1. Git Reset

লোকাল হিস্ট্রি থেকে কমিট মুছে ফেলার জন্য `git reset` ব্যবহার হয়। এটি ৩ ধরণের হতে পারে:

- **Soft Reset (`--soft`):**
  - কমিট মুছে ফেলে কিন্তু ফাইলগুলো **Staging Area**-তে রেখে দেয়।
  - _Use Case:_ যখন আপনি কমিট মেসেজ বা কিছু ফাইল অ্যাড করতে ভুলে গেছেন এবং আবার কমিট করতে চান।

  ```bash
  git reset --soft HEAD~1
  ```

- **Mixed Reset (`--mixed` - Default):**
  - কমিট মুছে ফেলে এবং ফাইলগুলো **Working Directory**-তে (Unstaged) রেখে দেয়।
  - _Use Case:_ যখন আপনি কাজগুলো রাখতে চান কিন্তু কমিট করতে চান না।

  ```bash
  git reset HEAD~1
  ```

- **Hard Reset (`--hard`):**
  - সবকিছু মুছে ফেলে (Commit + Staging + Working Directory)।
  - _Use Case:_ যখন আপনি শেষ কাজের সবকিছু ডিলিট করে আগের অবস্থায় ফিরতে চান। **(সতর্ক থাকুন!)**
  ```bash
  git reset --hard HEAD~1
  ```

### 2. Git Revert

পাবলিক বা শেয়ার্ড ব্রাঞ্চে `git reset` ব্যবহার করা বিপজ্জনক কারণ এটি হিস্ট্রি মুছে ফেলে। এর বদলে `git revert` ব্যবহার করুন।

- এটি একটি **নতুন কমিট** তৈরি করে যা আগের কমিটের কাজগুলো রিভার্স (Reverse) করে দেয়।
- হিস্ট্রি লিনিয়ার থাকে এবং কোনো তথ্য হারায় না।

```bash
git revert [commit-hash]
```

---

## Discarding Local Changes

যদি আপনি কোনো ফাইলে পরিবর্তন করেন কিন্তু তা কমিট বা স্টেজ না করে থাকেন, এবং সেই পরিবর্তন বাতিল করতে চান:

### Old Way (Checkout)

```bash
git checkout filename.txt
```

### New Way (Restore)

Git 2.23+ এ `restore` কমান্ড এসেছে যা আরো স্পষ্ট।

```bash
git restore filename.txt       # ফাইলটি আগের অবস্থায় ফিরিয়ে আনে
git restore .                  # সব ফাইল রিস্টোর করে
```

---

## Stash Changes

ধরুন আপনি একটি ফিচারে কাজ করছেন, কিন্তু হঠাৎ জরুরি একটি বাগ ফিক্স করতে অন্য ব্রাঞ্চে যেতে হবে। আপনার বর্তমান কাজ অর্ধেক করা, তাই কমিটও করতে পারছেন না। তখন `git stash` ব্যবহার করুন।

### 1. Save Changes

```bash
git stash
# অথবা মেসেজসহ
git stash save "Working on login page"
```

এটি আপনার Working Directory ক্লিন করে দেয় এবং পরিবর্তনগুলো মেমোরিতে সেভ রাখে।

### 2. List Stashes

```bash
git stash list
```

### 3. Apply Stash

কাজ শেষে ফিরে এসে পরিবর্তনগুলো আবার অ্যাপ্লাই করতে:

```bash
git stash pop      # অ্যাপ্লাই করে এবং স্ট্যাশ লিস্ট থেকে মুছে ফেলে
# অথবা
git stash apply    # অ্যাপ্লাই করে কিন্তু রেখে দেয়
```

---

## Cleaning Untracked Files

কখনো কখনো বিল্ড ফাইল বা অপ্রয়োজনীয় ফাইল Working Directory-তে জমা হয় যা `.gitignore`-এ নেই।

### 1. Dry Run (Check first)

কোন ফাইলগুলো ডিলিট হবে তা আগে দেখে নেওয়া নিরাপদ:

```bash
git clean -n
```

### 2. Force Delete

ফাইলগুলো পার্মানেন্টলি ডিলিট করতে:

```bash
git clean -fd
```

- `-f`: Force
- `-d`: Remove directories too
