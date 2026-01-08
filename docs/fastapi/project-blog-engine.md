# Practical Project 3: Blog Engine (ব্লগ ইঞ্জিন)

এই প্রোজেক্টে আমরা একটি পূর্ণাঙ্গ **Blog Engine** তৈরি করবো। এখানে আমাদের মূল ফোকাস থাকবে ডাটাবেসের বিভিন্ন টেবিলের মধ্যে সম্পর্ক (Relationships) তৈরি এবং তা হ্যান্ডেল করার ওপর।

---

## ১. প্রোজেক্টের লক্ষ্য (Objective)
- ইউজার, পোস্ট এবং কমেন্ট—এই তিনটি টেবিলের মধ্যে সম্পর্ক তৈরি করা।
- **Relationships:**
  - একজন ইউজারের অনেকগুলো পোস্ট থাকতে পারে (One-to-Many)।
  - একটি পোস্টে অনেকগুলো কমেন্ট থাকতে পারে (One-to-Many)।
- পোস্টের সাথে কমেন্ট লোড করা (Eager Loading)।
- রিলেশনাল ডাটা ভ্যালিডেশন।

---

## ২. প্রোজেক্টের জন্য প্রয়োজনীয় প্যাকেজ (Required Packages)

```text
fastapi[all]
sqlalchemy
aiosqlite
pydantic-settings
```

ইন্সটল কমান্ড: `pip install fastapi[all] sqlalchemy aiosqlite pydantic-settings`

---

## ৩. ধাপ অনুযায়ী সেটআপ (Step-by-Step Setup)

### ধাপ ১: প্রোজেক্ট স্ট্রাকচার
```text
/blog-engine
├── app/
│   ├── main.py
│   ├── database.py
│   ├── models.py
│   ├── schemas.py
│   └── routers/
│       ├── users.py
│       ├── posts.py
│       └── comments.py
├── .env
└── requirements.txt
```

### ধাপ ২: রিলেশনাল মডেল তৈরি (`models.py`)
```python
from sqlalchemy import Column, Integer, String, ForeignKey, Text
from sqlalchemy.orm import relationship

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True)
    username = Column(String, unique=True)
    posts = relationship("Post", back_populates="author")

class Post(Base):
    __tablename__ = "posts"
    id = Column(Integer, primary_key=True)
    title = Column(String)
    content = Column(Text)
    author_id = Column(Integer, ForeignKey("users.id"))
    author = relationship("User", back_populates="posts")
    comments = relationship("Comment", back_populates="post")

class Comment(Base):
    __tablename__ = "comments"
    id = Column(Integer, primary_key=True)
    text = Column(Text)
    post_id = Column(Integer, ForeignKey("posts.id"))
    post = relationship("Post", back_populates="comments")
```

---

## ৪. নেস্টেড ডাটা স্কিমা (`schemas.py`)
পোস্টের সাথে তার কমেন্ট এবং অথর (Author) একসাথে দেখানোর জন্য নিচের স্কিমাগুলো ব্যবহার করতে হবে:

```python
from pydantic import BaseModel

class CommentBase(BaseModel):
    text: str
    post_id: int

class Comment(CommentBase):
    id: int
    class Config: from_attributes = True

class PostBase(BaseModel):
    title: str
    content: str

class PostCreate(PostBase):
    author_id: int

class Post(PostBase):
    id: int
    author_id: int
    comments: list[Comment] = [] # নেস্টেড কমেন্ট লিস্ট
    class Config: from_attributes = True

class UserBase(BaseModel):
    username: str

class User(UserBase):
    id: int
    posts: list[Post] = []
    class Config: from_attributes = True
```

---

## ৫. রাউট ইমপ্লিমেন্টেশন (`routers/posts.py`)
রিলেশনাল ডাটা ফেচ করার জন্য `selectinload` ব্যবহার করা সবচেয়ে ভালো যদি আসিনক্রোনাস ডাটাবেস হয়।

```python
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload
from sqlalchemy import select
from ..database import get_db
from .. import models, schemas

router = APIRouter(prefix="/posts", tags=["posts"])

@router.get("/{post_id}", response_model=schemas.Post)
async def get_post_with_comments(post_id: int, db: AsyncSession = Depends(get_db)):
    # এখানে selectinload এর মাধ্যমে একবারে সব কমেন্ট লোড করা হচ্ছে (Eager Loading)
    query = select(models.Post).options(
        selectinload(models.Post.comments)
    ).where(models.Post.id == post_id)
    
    result = await db.execute(query)
    return result.scalar_one_or_none()

@router.post("/", response_model=schemas.Post)
async def create_post(post: schemas.PostCreate, db: AsyncSession = Depends(get_db)):
    db_post = models.Post(**post.model_dump())
    db.add(db_post)
    await db.commit()
    await db.refresh(db_post)
    return db_post
```

---

## ৬. যা যা মেনটেইন করা হয়েছে (Best Practices)
1. **Back Populates:** রিলেশনের দুই পাশেই ডাটা এক্সেস করার সুবিধা রাখা হয়েছে।
2. **ForeignKey Constraints:** ডাটাবেস লেভেলে রিলেশনশিপ নিশ্চিত করা।
3. **Circular Reference Avoidance:** স্কিমা তৈরির সময় যেন লুপ না তৈরি হয় তা খেয়াল করা।
4. **Efficient Querying:** `joinedload` বা `selectinload` ব্যবহার করে ডাটা ফেচ করা।

---

## ৭. অনুশীলন (Your Task)
- প্রতিটি কমেন্টের সাথে কোন ইউজার কমেন্ট করেছে তা যোগ করুন (User-Comment Relationship)।
- পোস্ট ডিলিট করলে যেন অটোমেটিক তার সব কমেন্ট ডিলিট হয়ে যায় (Cascade Delete) তা ইমপ্লিমেন্ট করুন।
- পোস্টের লিস্ট দেখার সময় শুধু কমেন্টের সংখ্যা (Count) দেখানোর ব্যবস্থা করুন।

---

::: tip অভিনন্দন!
আপনি এখন ডাটাবেস রিলেশনশিপের প্রো-লেভেল কাজগুলো বোঝেন। এটি আপনাকে যেকোনো সোশ্যাল মিডিয়া বা ইকমার্স সাইটের ব্যাকএন্ড তৈরিতে সাহায্য করবে।
:::
