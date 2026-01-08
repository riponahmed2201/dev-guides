# Security & Authentication (নিরাপত্তা এবং অথেনটিকেশন)

একটি বাস্তব ডোমেইন অ্যাপ্লিকেশনের জন্য সিকিউরিটি সবচেয়ে গুরুত্বপূর্ণ অংশ। FastAPI আমাদের ইন্ডাস্ট্রি স্ট্যান্ডার্ড সিকিউরিটি প্রোটোকলগুলো (যেমন: OAuth2, JWT) সহজে ইমপ্লিমেন্ট করার চমৎকার সব টুলস দেয়।

---

## ১. Password Hashing (bcrypt)

ডাটাবেসে কখনো পাসওয়ার্ড সরাসরি (Plain Text) সেভ করা উচিত নয়। আমরা `passlib` লাইব্রেরি ব্যবহার করে পাসওয়ার্ড হ্যাশ করবো।
`pip install "passlib[bcrypt]"`

```python
from passlib.context import CryptContext

# পাসওয়ার্ড হ্যাশ করার জন্য কনটেক্সট তৈরি
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str):
    return pwd_context.hash(password)

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)
```

---

## ২. JWT (JSON Web Token) Implementation

JWT হলো ক্লায়েন্ট এবং সার্ভারের মধ্যে তথ্য আদান-প্রদান করার একটি সিকিউর পদ্ধতি। এটি মূলত তিনটি অংশ নিয়ে গঠিত: Header, Payload, এবং Signature।
`pip install "python-jose[cryptography]"`

### ২.১. কনফিগারেশন:
```python
from datetime import datetime, timedelta, timezone
from jose import jwt

SECRET_KEY = "your-very-secret-key" # এটি এনভায়রনমেন্ট ভেরিয়েবলে রাখা উচিত
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt
```

---

## ৩. OAuth2 with Password Flow

OAuth2 হলো একটি অথেনটিকেশন ফ্রেমওয়ার্ক। FastAPI-তে `OAuth2PasswordBearer` ব্যবহার করে আমরা সহজেই টোকেন রিড করতে পারি।

```python
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer

# এটি মূলত ক্লায়েন্টকে বলে টোকেন কোথায় পাঠাতে হবে
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

async def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED)
        return username
    except Exception:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED)
```

---

## ৪. Protecting Routes (রাউট প্রোটেক্ট করা)

এখন আমরা `Depends(get_current_user)` ব্যবহার করে যেকোনো রাউটকে প্রোটেক্ট করতে পারি।

```python
@app.get("/users/me")
async def read_users_me(current_user: str = Depends(get_current_user)):
    return {"user": current_user}
```

---

## ৫. User Roles (Admin vs Base User)

অনেক সময় আমাদের নির্দিষ্ট রাউট শুধু অ্যাডমিনদের জন্য রাখতে হয়। এজন্য আমরা একটি কাস্টম ডিপেন্ডেন্সি বা ক্লাস-বেজড অ্যাপ্রোচ নিতে পারি।

```python
def check_admin_role(current_user: str = Depends(get_current_user)):
    # এখানে লজিক থাকবে ইউজার অ্যাডমিন কিনা চেক করার
    if current_user != "admin": # এটি উদাহরণের জন্য সিম্পল রাখা হয়েছে
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You don't have enough permissions"
        )
    return current_user

@app.get("/admin-only")
async def admin_portal(admin: str = Depends(check_admin_role)):
    return {"message": "Welcome Admin!"}
```

---

## ৬. Practice Exercises (অনুশীলন)

১. একটি `login` রাউট তৈরি করুন যা ইউজারনেম এবং পাসওয়ার্ড নেবে এবং ভেরিফাই করে একটি JWT টোকেন রিটার্ন করবে।
২. একটি `SECRET_KEY` জেনারেট করুন (টার্মিনালে `openssl rand -hex 32` কমান্ড ব্যবহার করে) এবং সেটি ব্যবহার করে টোকেন এক্সপাইরেশন চেক করুন।
৩. একটি `RoleChecker` ক্লাস তৈরি করুন যা প্যারামিটার হিসেবে রোলের নাম নেবে এবং ইউজার সেই রোলের কিনা তা চেক করবে।

---

## ৭. Summary & Best Practices

1. **Never store plain passwords:** সবসময় bcrypt বা একই ধরনের হ্যাশিং অ্যালগরিদম ব্যবহার করুন।
2. **Short-lived tokens:** অ্যাক্সেস টোকেনের মেয়াদ কম রাখুন (যেমন: ১৫-৩০ মিনিট) এবং রিফ্রেশ টোকেন ব্যবহার করুন।
3. **Use Environment Variables:** `SECRET_KEY` কখনো সরাসরি কোডে লিখবেন না, এটি `.env` ফাইলে রাখুন।
4. **HTTPS:** প্রোডাকশনে সবসময় HTTPS ব্যবহার করুন, নতুবা টোকেন চুরি হওয়ার সম্ভাবনা থাকে।

---

::: tip পরবর্তী ধাপ
সিকিউরিটি এবং অথেনটিকেশন শেখার মাধ্যমে আপনার API এখন অনেক বেশি নিরাপদ। পরবর্তী চ্যাপ্টারে আমরা শিখবো **Database Integration (Async SQLAlchemy)** - কীভাবে প্রফেশনাল উপায়ে ডেটাবেসের সাথে কানেক্ট হতে হয়।
:::
