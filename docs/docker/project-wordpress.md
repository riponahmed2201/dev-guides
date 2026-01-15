# Real-World Project: WordPress + MySQL with Docker Compose

এই প্রজেক্টে আমরা শিখব কীভাবে **Docker Compose** ব্যবহার করে মুহূর্তের মধ্যে একটি ফুল-স্ট্যাক **WordPress** সাইট সেটআপ করা যায়। এখানে আমাদের দুটি সার্ভিস লাগবে: `wordpress` এবং `mxsql`।

## প্রজেক্টের লক্ষ্য
- `docker-compose.yml` ফাইল লেখা।
- ওয়ার্ডপ্রেস এবং ডাটাবেসের মধ্যে কানেকশন স্থাপন করা।
- ভলিউম (Volumes) ব্যবহার করে ডাটা পারসিস্ট করা।
- এনভায়রনমেন্ট ভেরিয়েবল দিয়ে কনফিগারেশন ম্যানেজ করা।

## ১. প্রজেক্ট সেটআপ
একটি নতুন ফোল্ডার তৈরি করুন:

```bash
mkdir wordpress-docker
cd wordpress-docker
```

## ২. docker-compose.yml ফাইল
এই ফাইলেই আমরা পুরো আর্কিটেকচার ডিফাইন করব। `docker-compose.yml` নামে ফাইলটি তৈরি করুন:

```yaml
version: '3.8'

services:
  # ১. ডাটাবেস সার্ভিস
  db:
    image: mysql:8.0
    container_name: wp-database
    restart: always
    environment:
      MYSQL_ROOT_PASSWORD: somewordpress
      MYSQL_DATABASE: wordpress
      MYSQL_USER: wordpress
      MYSQL_PASSWORD: wordpress
    volumes:
      - db_data:/var/lib/mysql

  # ২. ওয়ার্ডপ্রেস সার্ভিস
  wordpress:
    depends_on:
      - db
    image: wordpress:latest
    container_name: wp-app
    restart: always
    ports:
      - "8000:80"
    environment:
      WORDPRESS_DB_HOST: db:3306
      WORDPRESS_DB_USER: wordpress
      WORDPRESS_DB_PASSWORD: wordpress
      WORDPRESS_DB_NAME: wordpress
    volumes:
      - wp_data:/var/www/html

# ৩. ভলিউম ডেফিনিশন
volumes:
  db_data:
  wp_data:
```

## ৩. কনফিগারেশন ব্যাখ্যা
- **Services:** আমাদের দুটি সার্ভিস আছে - `db` (MySQL) এবং `wordpress`।
- **depends_on:** ওয়ার্ডপ্রেস সার্ভিসটি চালু হওয়ার আগে ডাটাবেস সার্ভিস চালু হওয়া নিশ্চিত করে।
- **environment:** ডাটাবেস ক্রেডেনশিয়াল এবং কানেকশন ডিটেইলস পাস করা হয়েছে। লক্ষ্য করুন `WORDPRESS_DB_HOST` এর ভ্যালু `db`, যা আমাদের ডাটাবেস সার্ভিসের নাম। ডকার অটোমেটিক্যালি এই নাম রিজলভ করে।
- **volumes:** `db_data` ডাটাবেসের ডাটা সেভ রাখবে এবং `wp_data` ওয়ার্ডপ্রেসের প্লাগইন/থিম ফাইল সেভ রাখবে। কন্টেইনার ডিলিট করলেও ডাটা হারাবে না।
- **ports:** ব্রাউজারের `8000` পোর্টে সাইটটি এক্সেস করা যাবে।

## ৪. প্রজেক্ট রান করা
টার্মিনালে কমান্ড দিন:
```bash
docker-compose up -d
```
`-d` ফ্ল্যাগটি কন্টেইনারগুলোকে ব্যাকগ্রাউন্ডে (Detached mode) রান করাবে।

## ৫. ভেরিফিকেশন
ব্রাউজারে যান: `http://localhost:8000`

আপনি ওয়ার্ডপ্রেসের বিখ্যাত ইনস্টলেশন পেজ দেখতে পাবেন। ভাষা সিলেক্ট করে সাইট সেটআপ শেষ করুন।

## ৬. কন্টেইনার ম্যানেজমেন্ট
লগ দেখতে চাইলে:
```bash
docker-compose logs -f
```

প্রজেক্ট বন্ধ করতে (ডাটা থাকবে):
```bash
docker-compose stop
```

পুরো প্রজেক্ট মুছে ফেলতে (ভলিউম সহ):
```bash
docker-compose down -v
```

## সারাংশ
Docker Compose ব্যবহার করে মাল্টি-কন্টেইনার অ্যাপ্লিকেশন ডিপ্লয় করা কতটা সহজ তা আমরা দেখলাম। ম্যানুয়ালি ইনস্টল করার ঝামেলা ছাড়াই মাত্র একটি ফাইলে আমরা পুরো স্ট্যাক রেডি করে ফেললাম।
