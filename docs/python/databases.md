# Database Operations

সফটওয়্যারে ডাটা পার্মানেন্টলি সেভ করার জন্য ডাটাবেস ব্যবহার করা হয়। পাইথনে রিলেশনাল (SQL) এবং নন-রিলেশনাল (NoSQL) উভয় ধরনের ডাটাবেস নিয়ে কাজ করা যায়।

---

## ১. SQLite (Built-in)

পাইথনের সাথে আগে থেকেই **SQLite** ডাটাবেস দেওয়া থাকে। এর জন্য আলাদা কোনো সার্ভার ইন্সটল করতে হয় না। ছোট প্রোজেক্টের জন্য এটি আদর্শ।

```python
import sqlite3

# কানেকশন তৈরি করা (ফাইল না থাকলে অটোমেটিক তৈরি হবে)
conn = sqlite3.connect('example.db')
cursor = conn.cursor()

# টেবিল তৈরি করা
cursor.execute('''CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, name TEXT)''')

# ডাটা ইনসার্ট করা
cursor.execute("INSERT INTO users (name) VALUES ('Ripon')")
conn.commit() # পরিবর্তনগুলো সেভ করা

# ডাটা রিড করা
cursor.execute("SELECT * FROM users")
print(cursor.fetchall())

conn.close()
```

---

## ২. PostgreSQL এবং MySQL (External)

বড় প্রোজেক্টের জন্য এই ডাটাবেসগুলো ব্যবহার করা হয়। এর জন্য `psycopg2` (PostgreSQL) বা `mysql-connector` লাইব্রেরি ইন্সটল করতে হয়।

---

## ৩. SQLAlchemy (ORM)

ম্যানুয়ালি এসকিউএল (SQL) কোড লেখা কখনো কখনো ভুল হওয়ার সম্ভাবনা থাকে। **ORM (Object-Relational Mapping)** ব্যবহার করে আপনি পাইথন অবজেক্ট দিয়েই ডাটাবেস হ্যান্ডেল করতে পারেন। এর জনপ্রিয় লাইব্রেরি হলো **SQLAlchemy**।

### Example with SQLAlchemy:
```python
from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

Base = declarative_base()

class User(Base):
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True)
    name = Column(String)

engine = create_engine('sqlite:///new.db')
Base.metadata.create_all(engine)
```

---

## ৪. NoSQL: MongoDB

যদি আপনি আন-স্ট্রাকচারড ডাটা নিয়ে কাজ করতে চান, তবে **MongoDB** ব্যবহার করা হয়। এর জন্য জনপ্রিয় লাইব্রেরি হলো **`pymongo`**।

---

::: tip
আধুনিক ওয়েব ফ্রেমওয়ার্কগুলোতে (যেমন- Django, FastAPI) ডাটাবেস ম্যানেজমেন্টের জন্য বিল্ট-ইন টুলস থাকে যা কাজকে অনেক সহজ করে দেয়।
:::
