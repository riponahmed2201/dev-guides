# Practical Project 1: Task Manager API (টাস্ক ম্যানেজার)

সবগুলো চ্যাপ্টার শেষে এখন সময় এসেছে আপনার শেখা জ্ঞানকে একটি বাস্তব প্রোজেক্টে রূপান্তর করার। আমরা একটি **Task Manager API** তৈরি করবো যেখানে ইউজাররা রেজিস্ট্রেশন করতে পারবে এবং তাদের নিজস্ব টাস্কগুলো ম্যানেজ করতে পারবে।

---

## ১. প্রোজেক্টের লক্ষ্য (Objectve)
- ইউজার রেজিস্ট্রেশন এবং লগইন (JWT Auth)।
- টাস্ক তৈরি, দেখা, আপডেট এবং ডিলিট করা (CRUD)।
- নিরাপত্তা: একজন ইউজার শুধু তার নিজের টাস্কই দেখতে বা এডিট করতে পারবে।
- প্রফেশনাল আর্কিটেকচার অনুসরণ করা।

---

## ২. প্রোজেক্টের জন্য প্রয়োজনীয় প্যাকেজ (Required Packages)
প্রোজেক্ট শুরু করার আগে নিচের প্যাকেজগুলো ইন্সটল করে নিতে হবে। আপনি একটি `requirements.txt` ফাইল তৈরি করে তাতে নিচের নামগুলো রাখতে পারেন:

```text
fastapi[all]          # FastAPI এবং সব স্ট্যান্ডার্ড টুলস
sqlalchemy            # ডাটাবেস ORM
aiosqlite             # এস-কিউ-লাইট এর জন্য আসিনক্রোনাস ড্রাইভার
python-jose[cryptography] # JWT টোকেন ম্যানেজমেন্টের জন্য
passlib[bcrypt]       # পাসওয়ার্ড হ্যাশ করার জন্য
python-multipart      # ফর্ম ডাটা হ্যান্ডেল করার জন্য
pydantic-settings     # .env ফাইল ম্যানেজ করার জন্য
```

ইন্সটল করার কমান্ড: `pip install -r requirements.txt`

---

## ৩. ধাপ অনুযায়ী সেটআপ (Step-by-Step Setup)

সবকিছু ঠিকভাবে কাজ করার জন্য নিচের ধাপগুলো অনুসরণ করুন:

### ধাপ ১: পরিবেশ তৈরি (Environment)
প্রথমে প্রোজেক্টের জন্য একটি ফোল্ডার তৈরি করুন এবং সেখানে ভার্চুয়াল এনভায়রনমেন্ট চালু করুন। এরপর একটি `.env` ফাইল তৈরি করুন যেখানে আপনার ডাটাবেস ইউআরএল এবং সিক্রেট কি থাকবে।

### ধাপ ২: ডাটাবেস কনফিগারেশন (`database.py`)
`create_async_engine` ব্যবহার করে ডাটাবেস এর সাথে কানেকশন তৈরি করুন এবং `sessionmaker` সেটআপ করুন।

### ধাপ ৩: মডেল ও স্কিমা তৈরি (`models.py` ও `schemas.py`)
ইউজার এবং টাস্কের ডাটাবেস টেবিল ডিফাইন করুন এবং ইনপুট ভ্যালিডেশনের জন্য পাইড্যান্টিক মডেল তৈরি করুন।

### ধাপ ৪: অথেনটিকেশন লজিক (`routers/auth.py`)
লগইন রাউট তৈরি করুন যা ইউজারের পাসওয়ার্ড চেক করবে এবং একটি JWT টোকেন রিটার্ন করবে। এই টোকেনটি পরবর্তী সব রিকোয়েস্টে সিকিউরিটি হিসেবে কাজ করবে।

### ধাপ ৫: টাস্ক রাউট ইমপ্লিমেন্টেশন (`routers/tasks.py`)
CRUD অপারেশনগুলো অর্থাৎ টাস্ক তৈরি, দেখা ও ডিলিট করার কোড লিখুন। এখানে প্রতিটি রাউটে `get_current_user` ডিপেন্ডেন্সি ব্যবহার করুন যেন শুধু লগইন করা ইউজারই তা এক্সেস করতে পারে।

### ধাপ ৬: মেইন অ্যাপ রান করা (`main.py`)
সবশেষে সব রাউটগুলোকে `app.include_router()` দিয়ে মেইন ফাইলে যুক্ত করুন এবং `uvicorn` দিয়ে সার্ভার চালু করুন।

---

## ৪. প্রোজেক্ট স্ট্রাকচার (Project Structure)
আমরা আমাদের ১০ নম্বর চ্যাপ্টার (Architecture) অনুযায়ী ফাইলগুলো সাজাবো:

```text
/task-manager
├── app/
│   ├── main.py
│   ├── dependencies.py
│   ├── database.py
│   ├── models.py
│   ├── schemas.py
│   ├── crud.py
│   └── routers/
│       ├── auth.py
│       └── tasks.py
├── .env
└── requirements.txt
```

---

## ৫. কোর ইমপ্লিমেন্টেশন (বিস্তারিত)

### ৫.১. ডাটাবেস মডেল (`models.py`)
```python
from sqlalchemy import Column, Integer, String, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from .database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    tasks = relationship("Task", back_populates="owner")

class Task(Base):
    __tablename__ = "tasks"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    description = Column(String)
    completed = Column(Boolean, default=False)
    owner_id = Column(Integer, ForeignKey("users.id"))
    owner = relationship("User", back_populates="tasks")
```

### ৫.২. পাইড্যান্টিক স্কিমা (`schemas.py`)
```python
from pydantic import BaseModel

class TaskBase(BaseModel):
    title: str
    description: str | None = None

class TaskCreate(TaskBase):
    pass

class Task(TaskBase):
    id: int
    completed: bool
    owner_id: int
    class Config: from_attributes = True

class UserCreate(BaseModel):
    username: str
    password: str

class User(BaseModel):
    id: int
    username: str
    class Config: from_attributes = True
```

### ৫.৩. CRUD অপারেশন (`crud.py`)
```python
from sqlalchemy.orm import Session
from . import models, schemas

def get_tasks(db: Session, user_id: int):
    return db.query(models.Task).filter(models.Task.owner_id == user_id).all()

def create_user_task(db: Session, task: schemas.TaskCreate, user_id: int):
    db_task = models.Task(**task.model_dump(), owner_id=user_id)
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return db_task

def delete_task(db: Session, task_id: int, user_id: int):
    db_task = db.query(models.Task).filter(
        models.Task.id == task_id, 
        models.Task.owner_id == user_id
    ).first()
    if db_task:
        db.delete(db_task)
        db.commit()
    return db_task
```

### ৫.৪. টাস্ক রাউটার (`routers/tasks.py`)
```python
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from .. import crud, schemas, models
from ..dependencies import get_db, get_current_user

router = APIRouter(prefix="/tasks", tags=["tasks"])

@router.get("/", response_model=list[schemas.Task])
def read_tasks(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    return crud.get_tasks(db, user_id=current_user.id)

@router.post("/", response_model=schemas.Task)
def create_task(task: schemas.TaskCreate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    return crud.create_user_task(db=db, task=task, user_id=current_user.id)

@router.delete("/{task_id}")
def remove_task(task_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    success = crud.delete_task(db, task_id=task_id, user_id=current_user.id)
    if not success:
        raise HTTPException(status_code=404, detail="Task not found")
    return {"message": "Task deleted successfully"}
```

---

## ৬. যা যা মেনটেইন করা হয়েছে (Best Practices)
1. **Token Based Auth:** ও-অথ২ (OAuth2) এবং জে-ডব্লিউ-টি (JWT) ব্যবহার করে সিকিউর লগইন।
2. **Password Hashing:** `bcrypt` ব্যবহার করে পাসওয়ার্ড হ্যাশ করা।
3. **Pydantic Validation:** ইনপুট এবং আউটপুট ডাটা ভ্যালিডেট করার জন্য আলাদা স্কিমা।
4. **Dependency Injection:** ডাটাবেস সেশন এবং ইউজার অথেনটিকেশন সহজেই রাউটে ইনজেক্ট করা।
5. **Ownership Check:** এর মাধ্যমে একজন ইউজার অন্য ইউজারের ডাটা ডিলিট করতে পারবে না।

---

## ৭. অনুশীলন (Your Task)
- একটি এন্ডপয়েন্ট তৈরি করুন যা ইউজারের সব টাস্ক ডিলিট করে দেবে (Bulk Delete)।
- টাস্কের সাথে একটি `priority` (High, Medium, Low) ফিল্ড যোগ করুন।
- ব্যাকগ্রাউন্ড টাস্ক ব্যবহার করে ইউজার যখন রেজিস্ট্রেশন করবে তখন তাকে একটি কনফার্মেশন মেসেজ টার্মিনালে প্রিন্ট করুন।

---

::: tip অভিনন্দন!
আপনি এখন একটি প্রফেশনাল লেভেলের ব্যাকএন্ড অ্যাপ্লিকেশন ডিজাইন করতে সক্ষম। এই প্রোজেক্টটি আপনার পোর্টফোলিওতে যোগ করতে পারেন!
:::
