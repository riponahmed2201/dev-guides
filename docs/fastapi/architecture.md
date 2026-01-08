# Application Architecture (অ্যাপ্লিকেশন আর্কিটেকচার)

একটি ছোট প্রোজেক্ট শুধু একটি `main.py` ফাইলে রাখা সম্ভব হলেও প্রোডাকশন লেভেলের বড় অ্যাপ্লিকেশনে কোড গুছিয়ে রাখা অত্যন্ত জরুরি। একেই বলা হয় সফটওয়্যার আর্কিটেকচার।

---

## ১. APIRouter: কোড মডুলার করা

FastAPI-তে বড় অ্যাপ্লিকেশনকে ছোট ছোট অংশে (Modules) ভাগ করার জন্য `APIRouter` ব্যবহার করা হয়। এটি অনেকটা Flask-এর Blueprint বা Django-র App-এর মতো কাজ করে।

### ১.১. রাউট ফাইল তৈরি (`app/routers/users.py`):
```python
from fastapi import APIRouter

router = APIRouter(
    prefix="/users",
    tags=["users"],
)

@router.get("/")
async def read_users():
    return [{"username": "Rick"}, {"username": "Morty"}]

@router.get("/{user_id}")
async def read_user(user_id: str):
    return {"user_id": user_id}
```

### ১.২. মেইন অ্যাপে যুক্ত করা (`app/main.py`):
```python
from fastapi import FastAPI
from .routers import users, items

app = FastAPI()

# রাউটারগুলো ইনক্লুড করা
app.include_router(users.router)
app.include_router(items.router)
```

---

## ২. Production Project Structure

পেশাদার ডেভেলপাররা সাধারণত নিচের মতো একটি ফোল্ডার স্ট্রাকচার অনুসরণ করেন যা কোড মেইনটেইন করা সহজ করে:

```text
/my-fastapi-app
├── app/
│   ├── main.py             # অ্যাপ এন্ট্রি পয়েন্ট
│   ├── dependencies.py     # গ্লোবাল ডিপেন্ডেন্সি
│   ├── database.py         # DB কানেকশন লজিক
│   ├── models/             # SQLAlchemy (Database) মডেল
│   ├── schemas/            # Pydantic (Validation) মডেল
│   ├── routers/            # বিভিন্ন ফিচারের রাউটস
│   │   ├── users.py
│   │   └── items.py
│   └── crud/               # ডেটাবেস অপারেশন (Create, Read, etc.)
├── tests/                  # Pytest ফাইলস
├── .env                    # এনভায়রনমেন্ট ভেরিয়েবল
├── Dockerfile
└── requirements.txt
```

---

## ৩. Configuration Management (Environment Variables)

পাসওয়ার্ড, ডাটাবেস ইউআরএল বা সিক্রেট কি (Secret Key) সরাসরি কোডের ভেতর না রেখে সব সময় এনভায়রনমেন্ট ভেরিয়েবল ব্যবহার করা উচিত।

### ৩.১. `.env` ফাইল:
```env
DATABASE_URL=postgresql://user:password@localhost/dbname
SECRET_KEY=yoursecretkeyhere
DEBUG=True
```

### ৩.২. Pydantic Settings ব্যবহার করে লোড করা:
FastAPI-তে `pydantic-settings` লাইব্রেরি ব্যবহার করা সবচেয়ে আধুনিক এবং নিরাপদ পদ্ধতি।

`pip install pydantic-settings`

```python
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    db_url: str
    secret_key: str
    debug: bool = False

    # .env ফাইল থেকে ডেটা রিড করার কনফিগারেশন
    model_config = SettingsConfigDict(env_file=".env")

# সেটিংস অবজেক্ট তৈরি
settings = Settings()

# ব্যবহারের উদাহরণ:
# print(settings.db_url)
```

---

## ৪. Practice Exercises (অনুশীলন)

১. আপনার বর্তমান প্রোজেক্টটিকে `APIRouter` ব্যবহার করে অন্তত দুটি মডিউলে (যেমন: `blog` এবং `user`) ভাগ করুন।
২. একটি `.env` ফাইল তৈরি করুন এবং `pydantic-settings` ব্যবহার করে সেটির ডেটা আপনার অ্যাপে প্রিন্ট করুন।
৩. উপরের ফোল্ডার স্ট্রাকচার অনুযায়ী একটি নতুন ডিরেক্টরি তৈরি করে ফাইলগুলো সাজান।

---

## ৫. Best Practices

1. **Keep `main.py` Slim:** মেইন ফাইলে শুধু অ্যাপ ইনিশিয়ালাইজেশন এবং রাউটার ইনক্লুড করার কাজ রাখুন।
2. **Standardize Naming:** ফোল্ডার এবং ফাইলের নাম সবসময় ছোট হাতের অক্ষরে (snake_case) রাখুন।
3. **Decouple Logic:** ডেটাবেস কুয়েরি এবং এপিআই এন্ডপয়েন্ট লজিক আলাদা রাখুন (CRUD ফোল্ডার ব্যবহার করে)।
4. **Never Commit `.env`:** প্রোডাকশন সিক্রেটস কখনোই গিটহাবে পুশ করবেন না। `.gitignore`-এ `.env` ফাইলটি যুক্ত করে দিন।

---

::: tip পরবর্তী ধাপ
আর্কিটেকচার শেখার মাধ্যমে আপনি এখন একটি প্রফেশনাল লেভেলের প্রোজেক্ট শুরু করতে প্রস্তুত। পরবর্তী চ্যাপ্টারে আমরা শিখবো **Expert Level Final Step: Docker & Deployment**।
:::
