# Database Integration (Async SQLAlchemy)

বাস্তব প্রজেক্টে ডেটা স্থায়ীভাবে সংরক্ষণ করার জন্য ডেটাবেস ব্যবহার করা হয়। FastAPI-র সাথে **SQLAlchemy** (Python-এর সবচেয়ে জনপ্রিয় ORM) এবং এর **Async** ফিচার ব্যবহার করা বর্তমান সময়ের স্ট্যান্ডার্ড।

---

## ১. প্রয়োজনীয় লাইব্রেরি ইন্সটল করা

আমরা SQLite ব্যবহার করবো (শেখার জন্য সহজ), তবে এই একই কোড PostgreSQL বা MySQL-এর জন্যও কাজ করবে।
`pip install sqlalchemy aiosqlite alembic`

---

## ২. Database Engine এবং Session Setup

প্রথমে আমাদের ডেটাবেসের সাথে কানেক্ট হওয়ার জন্য একটি ইঞ্জিন এবং সেশন তৈরি করতে হবে।

`database.py` ফাইলে নিচের কোডটি লিখুন:

```python
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from sqlalchemy.orm import DeclarativeBase

# ১. ডেটাবেস ইউআরএল (SQLite Async)
SQLALCHEMY_DATABASE_URL = "sqlite+aiosqlite:///./test.db"

# ২. ইঞ্জিন তৈরি করা
engine = create_async_engine(SQLALCHEMY_DATABASE_URL, echo=True)

# ৩. সেশন মেকার তৈরি করা
SessionLocal = async_sessionmaker(autocommit=False, autoflush=False, bind=engine)

# ৪. বেস ক্লাস তৈরি (যা থেকে সব মডেল ইনহেরিট করবে)
class Base(DeclarativeBase):
    pass
```

---

## ৩. Defining Tables (Models)

এখন আমরা ডেটাবেসে টেবিল তৈরির জন্য মডেল ডিফাইন করবো।

`models.py` ফাইলে:

```python
from sqlalchemy.orm import Mapped, mapped_column
from .database import Base

class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    username: Mapped[str] = mapped_column(unique=True, index=True)
    email: Mapped[str] = mapped_column(unique=True, index=True)
    hashed_password: Mapped[str]
    is_active: Mapped[bool] = mapped_column(default=True)
```

---

## ৪. Database Connection Dependency

প্রতিটি রাউটে ডেটাবেস কানেকশন পাওয়ার জন্য আমরা একটি ডিপেন্ডেন্সি তৈরি করবো (যা আমরা চ্যাপ্টার ৭-এ শিখেছি)।

```python
from .database import SessionLocal

async def get_db():
    async with SessionLocal() as session:
        yield session
        # কাজ শেষে অটোমেটিক সেশন ক্লোজ হয়ে যাবে (Context Manager)
```

---

## ৫. CRUD Patterns (Create, Read, Update, Delete)

এখন আমরা দেখবো কীভাবে এই সেশন ব্যবহার করে ডেটা আদান-প্রদান করতে হয়।

```python
from sqlalchemy import select
from . import models

@app.post("/users/")
async def create_user(username: str, email: str, db: AsyncSession = Depends(get_db)):
    # Create
    new_user = models.User(username=username, email=email, hashed_password="hashed_fake_password")
    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)
    return new_user

@app.get("/users/")
async def read_users(db: AsyncSession = Depends(get_db)):
    # Read
    result = await db.execute(select(models.User))
    users = result.scalars().all()
    return users
```

---

## ৬. Migrations with Alembic

ডেটাবেসের টেবিল পরিবর্তন (যেমন: নতুন কলাম যোগ করা) ম্যানেজ করার জন্য **Alembic** ব্যবহার করা হয়।

### ধাপসমূহ:
১. **Init:** `alembic init -t async migrations`
২. **Config:** `alembic.ini` ফাইলে ডেটাবেস URL সেট করুন।
৩. **Env:** `migrations/env.py` ফাইলে আপনার মডেলের `Base.metadata` ইম্পোর্ট করুন।
৪. **Revision:** `alembic revision --autogenerate -m "create users table"`
৫. **Upgrade:** `alembic upgrade head`

---

## ৭. Practice Exercises (অনুশীলন)

১. একটি `Product` মডেল তৈরি করুন যেখানে `name`, `description`, `price`, এবং `stock_quantity` থাকবে।
২. একটি রাউট তৈরি করুন যা ইউজারের আইডি অনুযায়ী নির্দিষ্ট একজন ইউজারকে রিটার্ন করবে (`select().where()` ব্যবহার করে)।
৩. ইউজারের `email` আপডেট করার জন্য একটি PUT রাউট তৈরি করুন।
৪. ইউজারের আইডি অনুযায়ী ডিলিট করার জন্য একটি DELETE রাউট তৈরি করুন।

---

## ৮. Summary & Best Practices

1. **Always use Async:** FastAPI-র পূর্ণ সুবিধা পেতে SQLAlchemy-র আসিনক্রোনাস (Async) ভার্সন ব্যবহার করুন।
2. **Handle Exceptions:** ডেটাবেস অপারেশনের সময় `try-except` ব্যবহার করুন যেন কোনো এরর হলে সেশন ঠিকভাবে হ্যান্ডেল হয়।
3. **Use Migrations:** সরাসরি ডেটাবেস টেবিল এডিট না করে সবসময় Alembic ব্যবহার করুন।
4. **Pydantic vs Models:** মনে রাখবেন, Pydantic (Schemas) হলো ডেটা ট্রান্সফার করার জন্য এবং SQLAlchemy (Models) হলো ডেটাবেসে রাখার জন্য।

---

::: tip পরবর্তী ধাপ
ডেটাবেস ইন্টিগ্রেশন শেখার মাধ্যমে আপনি এখন একটি পূর্ণাঙ্গ ডায়নামিক অ্যাপ্লিকেশন তৈরি করতে সক্ষম। পরবর্তী চ্যাপ্টারে আমরা শিখবো **Error Handling** - কীভাবে প্রফেশনাল উপায়ে আপনার অ্যাপের মেকানিক্সে এররগুলো ম্যানেজ করবেন।
:::
