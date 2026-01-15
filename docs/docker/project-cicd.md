# Real-World Project: CI/CD Pipeline with GitHub Actions

আধুনিক সফটওয়্যার ডেভেলপমেন্টে **CI/CD (Continuous Integration / Continuous Deployment)** অপরিহার্য। এই প্রজেক্টে আমরা দেখব কীভাবে গিটহাবে কোড পুশ করার সাথে সাথে অটোমেটিকভাবে ডকার ইমেজ বিল্ড এবং ডকার হাবে (Docker Hub) পুশ করা যায়।

## প্রজেক্টের লক্ষ্য

- গিটহাব অ্যাকশনস (GitHub Actions) ওয়ার্কফ্লো তৈরি করা।
- গিটহাব সিক্রেটস (Secrets) কনফিগার করা।
- অটোমেটেড বিল্ড এবং পুশ প্রসেস সেটআপ করা।

---

## ১. পূর্বশর্ত (Prerequisites)

- একটি **GitHub Account** এবং একটি রিপোজিটরি।
- একটি **Docker Hub Account** (যেখানে ইমেজ পুশ হবে)।
- আপনার লোকাল মেশিনে একটি স্যাম্পল প্রোজেক্ট (যেমন আমাদের আগের Node.js অ্যাপটি)।

---

## ২. গিটহাব সিক্রেটস সেটআপ

গিটহাব অ্যাকশনস যাতে আপনার ডকার হাবে লগইন করতে পারে, সেজন্য ইউজারনেম এবং পাসওয়ার্ড (বা অ্যাক্সেস টোকেন) গিটহাবে সেভ করতে হবে।

- আপনার গিটহাব রিপোজিটরিতে যান।
- **Settings** > **Secrets and variables** > **Actions** এ যান।
- **New repository secret** বাটনে ক্লিক করুন এবং নিচের দুটি সিক্রেট অ্যাড করুন:
  - `DOCKER_USERNAME`: আপনার ডকার হাব ইউজারনেম।
  - `DOCKER_PASSWORD`: আপনার ডকার হাব পাসওয়ার্ড (বা Access Token)।

---

## ৩. ওয়ার্কফ্লো ফাইল তৈরি

আপনার প্রজেক্টের রুটে `.github/workflows` নামে ফোল্ডার তৈরি করুন এবং তার ভেতর `docker-publish.yml` নামে একটি ফাইল তৈরি করুন।

### .github/workflows/docker-publish.yml

```yaml
name: Docker Image CI

# কখন এই ওয়ার্কফ্লো রান হবে
on:
  push:
    branches: ["main"]
  pull_request:
    branches: ["main"]

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      # ১. কোড চেকআউট করা
      - name: Checkout code
        uses: actions/checkout@v3

      # ২. ডকার হাবে লগইন করা
      - name: Login to Docker Hub
        uses: docker/login-action@v2
        with:
          username: ${{ secrets.DOCKER_USERNAME }}
          password: ${{ secrets.DOCKER_PASSWORD }}

      # ৩. ডকার ইমেজ বিল্ড এবং পুশ করা
      - name: Build and push Docker image
        uses: docker/build-push-action@v4
        with:
          context: .
          push: true
          tags: ${{ secrets.DOCKER_USERNAME }}/my-node-app:latest
```

**ব্যাখ্যা:**

- `on: push`: যখনই `main` ব্রাঞ্চে পুশ হবে, তখনই এই অ্যাকশন ট্রিগার হবে।
- `docker/login-action`: গিটহাব সিক্রেটস ব্যবহার করে ডকার হাবে লগইন করবে।
- `docker/build-push-action`: বর্তমান ডিরেক্টরি (`.`) থেকে ইমেজ বিল্ড করবে এবং `push: true` থাকায় তা ডকার হাবে আপলোড করে দিবে।

---

## ৪. টেস্ট করা

- আপনার কোড গিটহাবে পুশ করুন:
  ```bash
  git add .
  git commit -m "Added CI/CD workflow"
  git push origin main
  ```
- গিটহাব রিপোজিটরির **Actions** ট্যাবে যান।
- দেখবেন আপনার নতুন ওয়ার্কফ্লো রান হচ্ছে।
- সফল হলে, Docker Hub এ গিয়ে চেক করুন। দেখবেন `my-node-app` নামে একটি নতুন ইমেজ পুশ হয়েছে।

## সারাংশ

এই প্রজেক্টের মাধ্যমে আমরা একটি সম্পূর্ণ অটোমেটেড পাইপলাইন তৈরি করলাম। এখন থেকে কোড চেঞ্জ করে পুশ করলেই নতুন ডকার ইমেজ অটোমেটিকভাবে তৈরি হয়ে যাবে, যা ম্যানুয়ালি বিল্ড করার ঝামেলা দূর করে।
