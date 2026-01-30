# Git Branching & Merging

Branching এবং Merging হলো Git-এর সবচেয়ে শক্তিশালী ফিচার। এটি আপনাকে মেইন কোডবেস এফেক্ট না করে নতুন ফিচার নিয়ে কাজ করতে দেয়।

## What are Branches?

**Branch** হলো কোডের একটি প্যারালাল লাইন।

- ডিফল্টভাবে Git-এ একটি ব্রাঞ্চ থাকে: `master` বা `main`.
- নতুন ফিচারের জন্য আমরা নতুন ব্রাঞ্চ তৈরি করি (যেমন `feature-login`), কাজ শেষ হলে মেইন ব্রাঞ্চের সাথে মার্জ করি।

### Basic Commands

#### 1. Create a Branch

```bash
git branch [branch-name]
# Example:
git branch feature-login
```

#### 2. Monitor Branches

```bash
git branch      # সব ব্রাঞ্চের লিস্ট এবং বর্তমান ব্রাঞ্চ দেখায়
```

#### 3. Switch Branches (`checkout` vs `switch`)

অন্য ব্রাঞ্চে যেতে:

```bash
# Old way
git checkout feature-login

# New way (Git 2.23+)
git switch feature-login
```

#### 4. Create & Switch in One Command

```bash
git checkout -b new-feature
# or
git switch -c new-feature
```

---

## Merging Branches

কাজ শেষ হওয়ার পর ব্রাঞ্চটি মেইন ব্রাঞ্চের সাথে যুক্ত করাকে **Merging** বলে।

১. প্রথমে `main` ব্রাঞ্চে যান:

```bash
git switch main
```

২. ফিচার ব্রাঞ্চটি মার্জ করুন:

```bash
git merge feature-login
```

### Merge Strategies

#### 1. Fast-Forward Merge

- যদি `main` ব্রাঞ্চে নতুন কোনো কমিট না হয়ে থাকে, তবে Git শুধু পয়ন্টার সামনে এগিয়ে দেয়।
- কোনো নতুন "Merge Commit" তৈরি হয় না।

#### 2. 3-Way Merge (Recursive)

- যদি `main` এবং `feature` দুই ব্রাঞ্চেই আলাদা আলাদা কমিট থাকে, তবে Git দুই ব্রাঞ্চের পরিবর্তন এবং তাদের কমন এনসেস্টর (Common Ancestor) নিয়ে একটি নতুন **Merge Commit** তৈরি করে।

---

## Merge Conflicts & Resolution

যখন একই ফাইলের একই লাইনে দুই ব্রাঞ্চে দুই রকম পরিবর্তন থাকে, তখন Git অটোমেটিক মার্জ করতে পারে না। একে **Merge Conflict** বলে।

### How to Resolve?

১. `git status` দিয়ে দেখুন কোন ফাইলে কনফ্লিক্ট হয়েছে।
২. ফাইলটি ওপেন করুন। Git কনফ্লিক্ট এরিয়া মার্ক করে দেয়:

```
<<<<<<< HEAD
print("Hello from Main")
=======
print("Hello from Feature")
>>>>>>> feature-login
```

৩. অপ্রয়োজনীয় লাইন মুছে আপনার কাঙ্খিত কোডটি রাখুন।
৪. ফাইল সেভ করুন।
৫. `git add [file]` এবং `git commit` করুন।

---

## Git Rebase

Rebase হলো হিস্ট্রি ক্লিন রাখার একটি পদ্ধতি। এটি মার্জের বিকল্প।

### Merge vs Rebase

- **Merge:** হিস্ট্রি প্রিজার্ভ করে (Non-destructive)। ব্রাঞ্চিং স্ট্রাকচার দেখা যায়।
- **Rebase:** আপনার ব্রাঞ্চের বেস (Base) পরিবর্তন করে `main`-এর লেটেস্ট কমিটে নিয়ে যায়। এতে হিস্ট্রি লিনিয়ার (Linear) হয়।

⚠️ **Warning:** পাবলিক বা শেয়ার্ড ব্রাঞ্চে (যেমন `main`) কখনো Rebase করবেন না। শুধু নিজের লোকাল ফিচার ব্রাঞ্চে Rebase ব্যবহার করুন।

### Interactive Rebase

কমিট হিস্ট্রি এডিট করতে (squash, reword, drop):

```bash
git rebase -i HEAD~3
```

এটি গত ৩টি কমিট নিয়ে একটি এডিটর ওপেন করবে যেখানে আপনি কমিট মডিফাই করতে পারবেন।
