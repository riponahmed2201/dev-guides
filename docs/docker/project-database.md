# Real-World Project: Database Setup (PostgreSQL & MongoDB)

সফটওয়্যার ডেভেলপমেন্টে ডাটাবেস সেটআপ করা প্রায়ই একটি ঝামেলার কাজ। ডকার ব্যবহার করে আপনি কোনো ডিপেন্ডেন্সি বা কনফিগারেশন ঝামেলা ছাড়াই মুহূর্তে **PostgreSQL** বা **MongoDB** এর মতো ডাটাবেস রান করতে পারেন।

## প্রজেক্টের লক্ষ্য

- PostgreSQL কন্টেইনার রান করা এবং কানেক্ট করা।
- MongoDB কন্টেইনার রান করা এবং GUI দিয়ে কানেক্ট করা।
- ডাটা পারসিস্টেন্সের জন্য ভলিউম ব্যবহার করা।

---

## ১. PostgreSQL সেটআপ

### কন্টেইনার রান করা

নিচের কমান্ডটি দিয়ে একটি পোস্টগ্রেএসকিউএল (PostgreSQL) ডাটাবেস রান করুন:

```bash
docker run -d \
    --name my-postgres \
    -e POSTGRES_USER=myuser \
    -e POSTGRES_PASSWORD=mypassword \
    -e POSTGRES_DB=mydb \
    -p 5432:5432 \
    -v postgres_data:/var/lib/postgresql/data \
    postgres:15-alpine
```

**কমান্ড ব্যাখ্যা:**

- `-e POSTGRES_USER`: ডাটাবেস ইউজারনাম (ডিফল্ট: postgres)।
- `-e POSTGRES_PASSWORD`: ডাটাবেস পাসওয়ার্ড (অবশ্যই দিতে হবে)।
- `-v postgres_data:/...`: ডাটা সেভ রাখার জন্য ভলিউম।

### কানেক্ট করা

CLI বা pgAdmin ব্যবহার করে কানেক্ট করতে পারেন।
**Host:** localhost
**Port:** 5432
**User:** myuser
**Password:** mypassword
**Database:** mydb

---

## ২. MongoDB সেটআপ

### কন্টেইনার রান করা

নিচের কমান্ডটি দিয়ে একটি মঙ্গোডিবি (MongoDB) ডাটাবেস রান করুন:

```bash
docker run -d \
    --name my-mongo \
    -e MONGO_INITDB_ROOT_USERNAME=mongoadmin \
    -e MONGO_INITDB_ROOT_PASSWORD=mongopass \
    -p 27017:27017 \
    -v mongo_data:/data/db \
    mongo:latest
```

### কানেক্ট করা (MongoDB Compass)

MongoDB Compass ওপেন করে নিচের কানেকশন স্ট্রিং ব্যবহার করুন:

```
mongodb://mongoadmin:mongopass@localhost:27017
```

---

## ৩. Docker Compose দিয়ে একসাথে রান করা

যদি আপনি একাধিক ডাটাবেস এবং একটি অ্যাডমিন টুল (যেমন pgAdmin) একসাথে রান করতে চান, তবে `docker-compose.yml` ব্যবহার করা সবচেয়ে ভালো।

```yaml
version: "3.8"

services:
  # PostgreSQL Service
  db:
    image: postgres:15-alpine
    environment:
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
    volumes:
      - pg_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  # pgAdmin Service (Web GUI for Postgres)
  pgadmin:
    image: dpage/pgadmin4
    environment:
      PGADMIN_DEFAULT_EMAIL: admin@admin.com
      PGADMIN_DEFAULT_PASSWORD: admin
    ports:
      - "8080:80"
    depends_on:
      - db

volumes:
  pg_data:
```

রান করতে:

```bash
docker-compose up -d
```

এখন `http://localhost:8080` এ গিয়ে pgAdmin ব্যবহার করতে পারবেন।

## সারাংশ

এই প্রজেক্টের মাধ্যমে আমরা দেখলাম কীভাবে লোকাল মেশিনে কোনো ইন্সটলেশন ছাড়াই ডাটাবেস সেটআপ এবং ম্যানেজ করা যায়। এটি ডেভেলপমেন্ট এবং টেস্টিং এর জন্য একটি গেম-চেঞ্জার।
