# Practical Project 4: Library System (লাইব্রেরি ম্যানেজমেন্ট)

এই প্রোজেক্টে আমরা একটি অ্যাডভান্সড **Library Management System** তৈরি করবো। এখানে আমরা মূলত শিখবো কীভাবে অনেকগুলো টেবিলের মধ্যে জটিল সম্পর্ক (Many-to-Many) হ্যান্ডেল করতে হয় এবং কীভাবে এপিআই-এর মাধ্যমে ফাইল (যেমন: বইয়ের কভার ইমেজ) আপলোড করতে হয়।

---

## ১. প্রোজেক্টের লক্ষ্য (Objective)
- **Many-to-Many Relationship:** একটি বইয়ের একাধিক লেখক থাকতে পারে, আবার একজন লেখকের একাধিক বই থাকতে পারে।
- **One-to-Many Relationship:** বই এবং ধারের রেকর্ড (Borrow Records)।
- **File Upload:** বইয়ের কভার ফটো আপলোড এবং সার্ভ করা।
- **Complete CRUD:** বই, লেখক এবং মেম্বার ম্যানেজমেন্ট।

---

## ২. প্রোজেক্টের জন্য প্রয়োজনীয় প্যাকেজ (Required Packages)

```text
fastapi[all]
sqlalchemy
aiosqlite
python-multipart      # ফাইল আপলোডের জন্য অবশ্যই লাগবে
pydantic-settings
```

ইন্সটল কমান্ড: `pip install fastapi[all] sqlalchemy aiosqlite python-multipart pydantic-settings`

---

## ৩. প্রোজেক্ট স্ট্রাকচার (Project Structure)
```text
/library-system
├── app/
│   ├── main.py
│   ├── database.py
│   ├── models.py
│   ├── schemas.py
│   ├── routers/
│   │   ├── books.py
│   │   └── authors.py
│   └── uploads/          # এখানে আপলোড করা ছবি জমা হবে
├── .env
└── requirements.txt
```

---

## ৪. ডাটাবেস মডেল ও রিলেশন (`models.py`)

Many-to-Many সম্পর্কের জন্য আমাদের একটি **Association Table** লাগবে।

```python
from sqlalchemy import Column, Integer, String, ForeignKey, Table
from sqlalchemy.orm import relationship
from .database import Base

# Association Table: Book <-> Author
book_author = Table(
    "book_author",
    Base.metadata,
    Column("book_id", Integer, ForeignKey("books.id")),
    Column("author_id", Integer, ForeignKey("authors.id"))
)

class Author(Base):
    __tablename__ = "authors"
    id = Column(Integer, primary_key=True)
    name = Column(String)
    books = relationship("Book", secondary=book_author, back_populates="authors")

class Book(Base):
    __tablename__ = "books"
    id = Column(Integer, primary_key=True)
    title = Column(String)
    cover_image = Column(String) # ছবির পাথ সেভ হবে
    authors = relationship("Author", secondary=book_author, back_populates="books")
```

---

## ৫. ফাইল আপলোড ও রাউট লজিক (`routers/books.py`)

বইয়ের তথ্য সেভ করার পাশাপাশি কভার ড্রড ফটো আপলোড করার পূর্ণাঙ্গ উদাহরণ:

```python
import shutil
from fastapi import APIRouter, Depends, File, UploadFile, Form
from sqlalchemy.ext.asyncio import AsyncSession
from ..database import get_db
from .. import models, schemas

router = APIRouter(prefix="/books", tags=["books"])

@router.post("/")
async def create_book(
    title: str = Form(...),
    author_ids: list[int] = Form(...), # আইডিগুলো ফর্ম ডাটা হিসেবে আসবে
    file: UploadFile = File(...),      # কভার ইমেজ
    db: AsyncSession = Depends(get_db)
):
    # ১. ছবি সেভ করা
    file_path = f"app/uploads/{file.filename}"
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    # ২. বই তৈরি করা
    db_book = models.Book(title=title, cover_image=file_path)
    
    # ৩. লেখকদের সাথে কানেক্ট করা
    # এখানে লজিক অনুযায়ী লেখক খুঁজে বের করে যোগ করতে হবে
    
    db.add(db_book)
    await db.commit()
    await db.refresh(db_book)
    return db_book
```

---

## ৬. যা যা মেনটেইন করা হয়েছে (Best Practices)
1. **Many-to-Many:** Association Table ব্যবহার করে প্রফেশনাল রিলেশনশিপ।
2. **Form Data:** ফাইল আপলোডের সময় অবশ্যই `Form` এবং `File` ব্যবহার করা হয়েছে।
3. **Static Files:** আপলোড করা ছবিগুলো দেখার জন্য `StaticFiles` মাউন্ট করা জরুরি।
4. **Validation:** লেখকের লিস্ট ডাটাবেসে আছে কিনা তা চেক করা।

---

## ৭. অনুশীলন (Your Task)
- `BorrowRecord` নামে একটি টেবিল তৈরি করুন যেখানে ইউজার আইডি এবং বইয়ের আইডি থাকবে (One-to-Many)।
- ফাইল আপলোডের সময় কন্ডিশন যোগ করুন যেন শুধু `.jpg` বা `.png` ফাইল আপলোড করা যায়।
- বইয়ের কভার ফটো ডিলিট করার একটি এন্ডপয়েন্ট তৈরি করুন যা সার্ভার থেকেও ফাইলটি মুছে ফেলবে।

---

::: tip অভিনন্দন!
আপনি এখন ফাইল আপলোড এবং জটিল ডাটাবেস আর্কিটেকচার নিয়ে কাজ করতে পারেন। আপনি এখন যেকোনো এন্টারপ্রাইজ লেভেলের অ্যাপ্লিকেশন তৈরির জন্য প্রস্তুত!
:::
