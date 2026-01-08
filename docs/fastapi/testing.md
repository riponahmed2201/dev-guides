# Testing FastAPI Applications (টেস্টিং)

একটি ভালো অ্যাপ্লিকেশন শুধু ফিচার দিয়ে বিচার করা হয় না, বরং তার স্ট্যাবিলিটি (Stability) দিয়ে বিচার করা হয়। টেস্টিং নিশ্চিত করে যে আপনার কোড ঠিকমতো কাজ করছে এবং ভবিষ্যতে নতুন ফিচার যোগ করলে পুরানো কিছু ভেঙে যাবে না। 

---

## ১. `TestClient` Setup

FastAPI আমাদের `TestClient` দেয় যা মূলত Starlette এর ওপর ভিত্তি করে তৈরি। এটি ব্যবহার করে আমরা আমাদের API-তে সরাসরি HTTP রিকোয়েস্ট পাঠিয়ে চেক করতে পারি।

ইন্সটলেশন:
`pip install pytest httpx`

```python
from fastapi import FastAPI
from fastapi.testclient import TestClient

app = FastAPI()

@app.get("/")
async def read_main():
    return {"msg": "Hello World"}

# টেস্ট ক্লায়েন্ট তৈরি করা
client = TestClient(app)

def test_read_main():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"msg": "Hello World"}
```

---

## ২. Pytest এর মাধ্যমে Unit এবং Integration Test

Pytest হলো পাইথনের সবচেয়ে জনপ্রিয় টেস্টিং ফ্রেমওয়ার্ক। এটি অটোমেটিক `test_*.py` ফাইলগুলো খুঁজে বের করে এবং রান করে।

### ২.১. ফোল্ডার স্ট্রাকচার:
```
/
  main.py
  /tests
    __init__.py
    test_main.py
```

### ২.২. রান করার কমান্ড:
টার্মিনালে শুধু লিখুন: `pytest`

---

## ৩. Dependency Overriding (Mocking)

এটি টেস্টিংয়ের সবচেয়ে সুন্দর অংশ। ধরুন আপনার একটি রাউট আছে যা ইউজারের টোকেন ভেরিফাই করে। টেস্ট করার সময় আপনি চান না যে রিয়েল টোকেন চেক হোক। এক্ষেত্রে আপনি ডিপেন্ডেন্সিটি "ওভাররাইড" করতে পারেন।

```python
from fastapi import Depends, FastAPI
from fastapi.testclient import TestClient

app = FastAPI()

async def common_user():
    # এটি রিয়েল লজিক যা টেস্টিংয়ের সময় আমরা স্কিপ করতে চাই
    return {"user": "real_user"}

@app.get("/items/")
async def read_items(user: dict = Depends(common_user)):
    return {"user": user["user"]}

client = TestClient(app)

# টেস্ট করার সময় আমরা এটি ব্যবহার করবো
async def override_common_user():
    return {"user": "fake_user"}

def test_override_dependency():
    # ডিপেন্ডেন্সি ওভাররাইড সেট করা
    app.dependency_overrides[common_user] = override_common_user
    
    response = client.get("/items/")
    
    # ওভাররাইড করা ভ্যালুটি চেক করা
    assert response.json() == {"user": "fake_user"}
    
    # টেস্ট শেষে ক্লিনআপ করা (ভালো প্র্যাকটিস)
    app.dependency_overrides = {}
```

---

## ৪. Database Testing (Temporary DB)

ডাটাবেস টেস্টিং করার সময় আমরা সব সময় একটি আলাদা টেম্পোরারি ডাটাবেস (যেমন: SQLite memory db) ব্যবহার করি যেন অরিজিনাল ডাটাবেসে কোনো পরিবর্তন না হয়।

```python
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from .database import Base, get_db
from .main import app

# ১. টেস্টিং ডাটাবেস ইউআরএল
SQLALCHEMY_DATABASE_URL = "sqlite:///./test_db.db"

engine = create_engine(SQLALCHEMY_DATABASE_URL)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# ২. ডাটাবেস ডিপেন্ডেন্সি ওভাররাইড
def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

def test_create_user():
    # টেস্ট ডাটাবেস টেবিল তৈরি
    Base.metadata.create_all(bind=engine)
    
    response = client.post("/users/", json={"username": "testuser", "email": "test@example.com"})
    assert response.status_code == 200
    
    # টেবিল ডিলিট করা
    Base.metadata.drop_all(bind=engine)
```

---

## ৫. Practice Exercises (অনুশীলন)

১. একটি সহজ CRUD রাউট (Create, Read) তৈরি করুন এবং তার জন্য integration test লিখুন।
২. একটি অথেনটিকেশন রাউটের জন্য ডিপেন্ডেন্সি ওভাররাইড ব্যবহার করে সফল এবং ব্যর্থ লগইন টেস্ট করুন।
৩. SQLite ইন-মেমোরি ডাটাবেস (`sqlite:///:memory:`) ব্যবহার করে একটি ডাটাবেস টেস্ট করে দেখুন।

---

## ৬. Best Practices

1. **Test Isolation:** প্রতিটি টেস্ট স্ক্রিপ্ট যেন একে অপরের থেকে আলাদা থাকে।
2. **Use Fixtures:** Pytest-এর `fixture` ব্যবহার করে সেটআপ এবং টিয়ারডাউন (cleanup) লজিক ম্যানেজ করুন।
3. **Mock External Services:** ডেটাবেস বা বাহিরের কোনো এপিআই কল করার সময় সব সময় মকিং বা ওভাররাইডিং ব্যবহার করুন।
4. **Coverage:** চেষ্টা করুন অ্যাপ্লিকেশনের অন্তত ৮০% কোড টেস্টিংয়ের আওতায় রাখতে।

---

::: tip পরবর্তী ধাপ
টেস্টিং শেখার মাধ্যমে আপনার অ্যাপ্লিকেশন এখন অনেক বেশি নির্ভরযোগ্য। পরবর্তী চ্যাপ্টারে আমরা শিখবো **FastAPI Deployment** - কীভাবে আপনার অ্যাপ্লিকেশনটি ডকার এবং এনগিনক্স (Nginx) ব্যবহার করে প্রোডাকশনে পাঠাবেন।
:::
