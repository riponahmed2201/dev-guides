# Remote Repositories

Git-এর আসল শক্তি হলো কোলাবোরেশন। Remote Repository হলো ইন্টারনেটে বা নেটওয়ার্কে থাকা প্রজেক্টের একটি ভার্সন (যেমন GitHub, GitLab-এ)।

## Managing Remotes

### 1. View Remotes

আপনার প্রজেক্ট কোন রিমোট সার্ভারের সাথে যুক্ত তা দেখতে:

```bash
git remote -v
# Output usually:
# origin  https://github.com/user/repo.git (fetch)
# origin  https://github.com/user/repo.git (push)
```

এখানে `origin` হলো রিমোট রিপোজিটরির ডিফল্ট নাম (Shortname).

### 2. Add a Remote

নতুন রিমোট অ্যাড করতে:

```bash
git remote add origin https://github.com/username/repo-name.git
```

---

## Syncing with Remotes

### 1. git push

আপনার লোকাল কমিটগুলো রিমোট সার্ভারে পাঠাতে:

```bash
git push -u origin main
```

`-u` বা `--set-upstream` ফ্ল্যাগটি প্রথমবার ব্যবহার করতে হয়। এটি আপনার লোকাল `main` ব্রাঞ্চকে রিমোট `origin/main`-এর সাথে লিঙ্ক (Track) করে। এরপর থেকে শুধু `git push` দিলেই হবে।

### 2. git fetch

রিমোট থেকে নতুন পরিবর্তনগুলো ডাউনলোড করে কিন্তু **মার্জ করে না**।

```bash
git fetch origin
```

এটি দেখার জন্য যে অন্যরা কী কাজ করেছে, কিন্তু আপনার বর্তমান কাজ নষ্ট করতে চান না।

### 3. git pull

এটি মূলত `git fetch` + `git merge` এর কম্বিনেশন।

```bash
git pull origin main
```

এটি রিমোট থেকে পরিবর্তন আনে এবং আপনার বর্তমান ব্রাঞ্চের সাথে সাথে সাথে মার্জ করে।

---

## Tracking Branches

যখন আপনি কোনো রিমোট ব্রাঞ্চ থেকে `clone` বা `checkout` করেন, Git অটোমেটিকালি একটি **Tracking Branch** তৈরি করে।

- একে "Upstream Branch"-ও বলা হয়।
- `git status` দিলে দেখায়: _"Your branch is ahead of 'origin/main' by 1 commit."_

### Working with GitHub/GitLab

টিমওয়ার্কের সাধারণ ওয়ার্কফ্লো:

1. **Clone/Pull:** কাজ শুরুর আগে লেটেস্ট কোড নামিয়ে নিন (`git pull`)।
2. **Branch:** নতুন ফিচারের জন্য ব্রাঞ্চ তৈরি করুন (`git switch -c feature-xyz`)।
3. **Commit:** কাজ শেষে কমিট করুন।
4. **Push:** আপনার ব্রাঞ্চটি রিমোট সার্ভারে পুশ করুন (`git push -u origin feature-xyz`)।
5. **Pull Request (PR):** GitHub/GitLab-এ গিয়ে `main` ব্রাঞ্চে মার্জ করার জন্য Pull Request ওপেন করুন।
