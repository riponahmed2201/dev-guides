# Data Validation with Pydantic V2 (ডেটা ভ্যালিডেশন)

FastAPI-তে ডেটা ভ্যালিডেশনের জন্য সবচেয়ে গুরুত্বপূর্ণ টুল হলো **Pydantic**। এটি মূলত Python-এর টাইপ হিন্টস (Type Hints) ব্যবহার করে ডেটা ভ্যালিডেশন এবং সিরিয়ালাইজেশন (Serialization) করে।

---

## ১. Pydantic Models কি এবং কেন দরকার?

**Pydantic Model** হলো একটি Python ক্লাস যা `BaseModel` থেকে ইনহেরিট (inherit) করে। এটি আপনার API-তে আসা বা যাওয়া ডেটার একটি "ব্লুপ্রিন্ট" বা কাঠামো হিসেবে কাজ করে।

### কেন এটি দরকার?
1. **Type Safety:** ডেটা সঠিক টাইপের (যেমন: string, int, list) কিনা তা নিশ্চিত করে।
2. **Data Validation:** ডেটা আসার সাথে সাথে এটি চেক করে। ভুল হলে একটি সুন্দর Error মেসেজ দেয়।
3. **Serialization:** Python অবজেক্টকে JSON-এ এবং JSON-কে Python অবজেক্টে সহজে রূপান্তর করে।
4. **Developer Experience:** এডিটরে কোড লেখার সময় অটো-কমপ্লিশন এবং এরর হাইলাইটিং সুবিধা দেয়।

```python
from pydantic import BaseModel

class User(BaseModel):
    id: int
    username: str
    email: str
    age: int | None = None # Optional field
```

---

## ২. Schema vs Database Model এর পার্থক্য

নতুনদের জন্য এটি একটি কনফিউজিং বিষয়। চলুন পরিষ্কার করা যাক:

| বৈশিষ্ট্য | Schema (Pydantic Model) | Database Model (ORM/SQLAlchemy) |
| :--- | :--- | :--- |
| **উদ্দেশ্য** | ডেটা রিসিভ (Request) বা পাঠানোর (Response) জন্য কাঠামো। | ডেটাবেসে টেবিল তৈরির জন্য কাঠামো। |
| **লাইব্রেরি** | Pydantic | SQLAlchemy, Tortoise, etc. |
| **কাজ** | ডেটা ভ্যালিডেশন এবং ফরম্যাটিং। | ডেটা সংরক্ষণ এবং কোয়েরি করা। |
| **অবস্থান** | API Layer-এ থাকে। | Data Layer/Database-এ থাকে। |

> [!TIP]
> সাধারণত আমরা API রিকোয়েস্টের জন্য একটি Pydantic Schema তৈরি করি এবং সেই ডেটাটিকে পরে Database Model-এ কনভার্ট করে সেভ করি।

---

## ৩. Request Body হ্যান্ডেল করা

যখন কোনো ইউজার POST বা PUT রিকোয়েস্টের মাধ্যমে ডেটা পাঠায়, তখন আমরা Pydantic Model ব্যবহার করে সেটি রিসিভ করি।

```python
from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

class Item(BaseModel):
    name: str
    description: str | None = None
    price: float
    tax: float | None = None

@app.post("/items/")
async def create_item(item: Item): # এখানে item হলো Item মডেলের একটি ইনস্ট্যান্স
    return item
```

---

## ৪. Field Validation এবং Constraints

আপনি চাইলে ডেটার ওপর কড়াকড়ি আরোপ করতে পারেন। এজন্য Pydantic-এর `Field` ক্লাস ব্যবহার করা হয়।

```python
from pydantic import BaseModel, Field

class UserCreate(BaseModel):
    username: str = Field(
        ..., # ... মানে হলো এটি Required
        min_length=3, 
        max_length=20, 
        pattern="^[a-zA-Z0-9]+$" # শুধু আলফানিউমেরিক
    )
    password: str = Field(..., min_length=8)
    age: int = Field(ge=18, le=100) # ge=18 (বয়স ১৮ বা তার বেশি), le=100 (১০০ বা তার কম)
```

---

## ৫. Optional Fields এবং Default Values

সব তথ্য সবসময় দরকারি নাও হতে পারে। আবার কিছু তথ্যের ডিফল্ট মান থাকা দরকার।

```python
class Profile(BaseModel):
    bio: str | None = None # Optional, default is None
    location: str = "Bangladesh" # Optional, default is Bangladesh
    is_active: bool = True # Default True
```

---

## ৬. Nested Models (একই ডেটার ভেতরে ভিন্ন ডেটা)

বাস্তব জীবনে ডেটা অনেক সময় জটিল হয়। একটির ভেতরে আরেকটি অবজেক্ট বা লিস্ট থাকতে পারে।

```python
from pydantic import BaseModel

class Image(BaseModel):
    url: str
    name: str

class Product(BaseModel):
    id: int
    name: str
    tags: list[str] = [] # স্ট্রিং এর একটি লিস্ট
    main_image: Image # অন্য একটি মডেল (Nested)
    gallery: list[Image] | None = None # অন্য মডলে এর লিস্ট
```

### রিকোয়েস্টের নমুনা (JSON Payload):
```json
{
  "id": 1,
  "name": "Mechanical Keyboard",
  "tags": ["tech", "typing", "rgb"],
  "main_image": {
    "url": "https://example.com/main.jpg",
    "name": "Main view"
  },
  "gallery": [
    {"url": "https://example.com/side.jpg", "name": "Side view"},
    {"url": "https://example.com/back.jpg", "name": "Back view"}
  ]
}
```

---

## ৭. Pydantic-এর বিশেষ সুবিধা: `model_dump()`

আগে Pydantic V1-এ `.dict()` ব্যবহার হতো, এখন V2-তে `model_dump()` ব্যবহার করা হয়। এটি আপনার অবজেক্টকে ডিকশনারিতে রূপান্তর করে।

```python
@app.post("/items/")
async def create_item(item: Item):
    item_dict = item.model_dump()
    # এখন এই ডিকশনারিটি আপনি ডেটাবেসে সেভ করতে পারেন
    print(item_dict["name"])
    return item_dict
```

---

## ৮. Practice Exercises (অনুশীলন)

১. একটি `PersonalProfile` মডেল তৈরি করুন যেখানে `full_name`, `email` (অবশ্যই থাকতে হবে), `phone` (ঐচ্ছিক), এবং `experience_years` (১ থেকে ৫০ এর মধ্যে) থাকবে।
২. একটি `Post` মডেল তৈরি করুন যেখানে পোস্টের `title`, `content` ছাড়াও `comments` নামে একটি লিস্ট থাকবে (যা হবে `Comment` নামের অন্য একটি মডেল)।
৩. `Field` ব্যবহার করে একটি পাসওয়ার্ড ফিল্ড তৈরি করুন যার দৈর্ঘ্য কমপক্ষে ১০ ক্যারেক্টার।

---

## ৯. Common Beginner Mistakes

- **ভুল ১: `.py` বা ফাইলের নাম `pydantic.py` রাখা:** এর ফলে অরিজিনাল লাইব্রেরির সাথে ইন্টারফ্ল্যাক্ট (Conflict) হয়।
- **ভুল ২: Type Hint ছাড়া ভেরিয়েবল ডিফাইন করা:** `name = str` এর বদলে `name: str` ব্যবহার করুন।
- **ভুল ৩: Pydantic V1 এর syntax ব্যবহার করা:** V2 এ অনেক কিছু প্রোডাক্টিভিটি বাড়ানোর জন্য পরিবর্তন করা হয়েছে (যেমন: `.dict()` এর বদলে `.model_dump()`)।

---

::: tip পরবর্তী ধাপ
ডেটা ভ্যালিডেশন শেখার মাধ্যমে আপনি এখন ক্লায়েন্ট থেকে আসা ডেটাকে সুরক্ষিত করতে পারেন। পরবর্তী চ্যাপ্টারে আমরা শিখবো **Response Handling** - কীভাবে সার্ভার থেকে ডেটা পাঠানোর সময় সেটিকে ফিল্টার বা সিকিউর করা যায়।
:::
