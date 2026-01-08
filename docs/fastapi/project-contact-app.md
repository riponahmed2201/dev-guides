# Practical Project 2: Contact App (কন্ট্যাক্ট অ্যাপ)

এই প্রজেক্টে আমরা একটি প্রফেশনাল **Contact Management System** তৈরি করবো। এখানে মূল ফোকাস থাকবে ডাটাবেস থেকে দক্ষভাবে ডাটা সার্চ করা এবং বিভিন্ন ক্যাটাগরিতে ফিল্টার করার ওপর।

---

## ১. প্রোজেক্টের লক্ষ্য (Objective)
- কন্ট্যাক্ট লিস্ট তৈরি, এডিট এবং ডিলিট করা।
- নাম বা ইমেইল দিয়ে কন্ট্যাক্ট সার্চ করা (Search)।
- নির্দিষ্ট গ্রুপ (যেমন: Family, Work, Friends) অনুযায়ী ফিল্টার করা (Filter)।
- ডাটাবেস ইনটিগ্রেশন (SQLAlchemy with Async)।

---

## ২. প্রোজেক্টের জন্য প্রয়োজনীয় প্যাকেজ (Required Packages)
এই প্রজেক্টের জন্য নিচের প্যাকেজগুলো প্রয়োজন হবে:

```text
fastapi[all]
sqlalchemy
aiosqlite
pydantic-settings
```

ইন্সটল কমান্ড: `pip install fastapi[all] sqlalchemy aiosqlite pydantic-settings`

---

## ৩. ধাপ অনুযায়ী সেটআপ (Step-by-Step Setup)

### ধাপ ১: প্রোজেক্ট স্ট্রাকচার তৈরি
ভবিষ্যতের স্কেলেবিলিটি চিন্তা করে আমরা মডুলার স্ট্রাকচার ব্যবহার করবো:
```text
/contact-app
├── app/
│   ├── main.py
│   ├── database.py
│   ├── models.py
│   ├── schemas.py
│   └── routers/
│       └── contacts.py
├── .env
└── requirements.txt
```

### ধাপ ২: ডাটাবেস মডেল (`models.py`)
```python
from sqlalchemy import Column, Integer, String, select, or_
from .database import Base

class Contact(Base):
    __tablename__ = "contacts"
    id = Column(Integer, primary_key=True, index=True)
    first_name = Column(String, index=True)
    last_name = Column(String, index=True)
    email = Column(String, unique=True, index=True)
    phone = Column(String)
    group = Column(String, index=True) # Family, Work, etc.
```

### ধাপ ৩: পাইড্যান্টিক স্কিমা (`schemas.py`)
```python
from pydantic import BaseModel, EmailStr

class ContactBase(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr
    phone: str | None = None
    group: str = "Others"

class ContactCreate(ContactBase):
    pass

class Contact(ContactBase):
    id: int
    class Config: from_attributes = True
```

### ধাপ ৪: পূর্ণাঙ্গ রাউট লজিক (`routers/contacts.py`)
এখানে লিস্টিং, সার্চিং এবং ফিল্টারিং এর বিস্তারিত কোড দেওয়া হলো:

```python
from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, or_
from typing import List
from ..database import get_db
from .. import models, schemas

router = APIRouter(prefix="/contacts", tags=["contacts"])

@router.get("/", response_model=List[schemas.Contact])
async def list_contacts(
    search: str | None = Query(None, description="Search by name or email"),
    group: str | None = Query(None, description="Filter by group"),
    db: AsyncSession = Depends(get_db)
):
    query = select(models.Contact)
    
    if search:
        query = query.where(
            or_(
                models.Contact.first_name.icontains(search),
                models.Contact.last_name.icontains(search),
                models.Contact.email.icontains(search)
            )
        )
    
    if group:
        query = query.where(models.Contact.group == group)
    
    result = await db.execute(query)
    return result.scalars().all()

@router.post("/", response_model=schemas.Contact)
async def create_contact(contact: schemas.ContactCreate, db: AsyncSession = Depends(get_db)):
    db_contact = models.Contact(**contact.model_dump())
    db.add(db_contact)
    await db.commit()
    await db.refresh(db_contact)
    return db_contact
```

---

## ৪. যা যা মেনটেইন করা হয়েছে (Best Practices)
1. **Async DB:** SQLAlchemy-র আসিনক্রোনাস মোড ব্যবহার করা হয়েছে।
2. **Nullable Fields:** ইমেইল বা ফোন অপশনাল রাখার জন্য Pydantic-এ `| None` ব্যবহার।
3. **Indexing:** ডাটাবেসে `index=True` ব্যবহার করা হয়েছে যেন সার্চ দ্রুত হয়।
4. **Clean URLs:** এন্ডপয়েন্টে কুয়েরি প্যারামিটার ব্যবহার করে সার্চ ও ফিল্টার আলাদা করা হয়েছে।

---

## ৫. অনুশীলন (Your Task)
- কন্ট্যাক্টের সাথে একটি `birthday` ফিল্ড যোগ করুন এবং ফিল্টার করার ব্যবস্থা করুন যাদের জন্মদিন এই মাসে।
- সব কন্ট্যাক্টকে নামের ক্রমানুসারে (Alphabetically) শর্ট (Sort) করার অপশন যোগ করুন।
- একই ইমেইল বা ফোন নাম্বার দিয়ে একাধিক কন্ট্যাক্ট যেন সেভ না হয় সেই ভ্যালিডেশন যোগ করুন।

---

::: tip অভিনন্দন!
আপনি এখন ডাটাবেস থেকে জটিল সার্চ এবং ফিল্টার লজিক ইমপ্লিমেন্ট করতে পারেন। এটি যেকোনো ডাটা-ড্রিভেন অ্যাপের জন্য অত্যন্ত গুরুত্বপূর্ণ একটি স্কিল।
:::
