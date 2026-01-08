# Error Handling & Background Tasks (এরর হ্যান্ডলিং ও ব্যাকগ্রাউন্ড টাস্ক)

সফটওয়্যার ডেভেলপমেন্টে এরর হ্যান্ডলিং এবং ব্যাকগ্রাউন্ড প্রসেসিং দুটি খুবই গুরুত্বপূর্ণ বিষয়। FastAPI আমাদের এই কাজগুলো খুব সহজ এবং আধুনিক ভাবে করার সুবিধা দেয়।

---

## ১. Global Exception Handlers

FastAPI-তে আমরা শুধু নির্দিষ্ট রাউটে এরর হ্যান্ডেল না করে পুরো অ্যাপ্লিকেশনের জন্য "গ্লোবাল এরর হ্যান্ডলার" তৈরি করতে পারি। এতে করে আপনার এপিআই সব সময় একই ফরম্যাটে এরর মেসেজ রিটার্ন করবে।

### ১.১. কাস্টম এক্সেপশন তৈরি:
```python
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse

class MyCustomException(Exception):
    def __init__(self, name: str):
        self.name = name

app = FastAPI()

# গ্লোবাল হ্যান্ডলার রেজিস্টার করা
@app.exception_handler(MyCustomException)
async def custom_exception_handler(request: Request, exc: MyCustomException):
    return JSONResponse(
        status_code=418,
        content={"message": f"Oops! {exc.name} did something wrong."},
    )

@app.get("/test/{name}")
async def test_exception(name: str):
    if name == "error":
        raise MyCustomException(name=name)
    return {"name": name}
```

---

## ২. Background Tasks (নন-ব্লকিং অপারেশন্স)

অনেক সময় এমন কিছু কাজ থাকে যা করতে অনেক সময় লাগে (যেমন: ইমেইল পাঠানো, ইমেজ প্রসেসিং, বা রিপোর্ট জেনারেশন)। ইউজারের রিকোয়েস্ট আটকে না রেখে এই কাজগুলো ব্যাকগ্রাউন্ডে করার জন্য FastAPI-তে `BackgroundTasks` ক্লাস ব্যবহার করা হয়।

### ২.১. ইমেইল পাঠানোর উদাহরণ:
```python
from fastapi import BackgroundTasks, FastAPI

app = FastAPI()

def send_welcome_email(email: str, message: str):
    # এখানে ইমেইল পাঠানোর লজিক থাকবে (যেমন: smtplib বা কোনো এপিআই)
    print(f"Sending email to {email}: {message}")
    # সিমুলেট করার জন্য একটি টাইম-কনজুমিং কাজ
    import time
    time.sleep(5) 
    print("Email sent!")

@app.post("/register/")
async def register_user(email: str, background_tasks: BackgroundTasks):
    # ১. ইউজারকে সাথে সাথে রেসপন্স দিয়ে দেয়া হলো
    background_tasks.add_task(send_welcome_email, email, "Welcome to our platform!")
    
    # ২. ইউজার মেসেজটি সাথে সাথে পেয়ে যাবে, কিন্তু ইমেইলটি ব্যাকগ্রাউন্ডে পাঠাতে থাকবে
    return {"message": "Registration successful. You will receive an email shortly."}
```

### ২.২. ফাইল প্রসেসিং:
আপনি একইভাবে বড় ফাইল আপলোড করার পর সেটিকে ব্যাকগ্রাউন্ডে প্রসেস করতে পারেন।

```python
def process_file_in_bg(file_path: str):
    # ফাইল প্রসেসিং লজিক
    pass

@app.post("/upload/")
async def upload_file(background_tasks: BackgroundTasks):
    background_tasks.add_task(process_file_in_bg, "path/to/file")
    return {"message": "File upload started in background"}
```

---

## ৩. Practice Exercises (অনুশীলন)

১. একটি গ্লোবাল হ্যান্ডলার তৈরি করুন যা `404 Not Found` এরর হলে নির্দিষ্ট একটি কাস্টম JSON ফরম্যাট রিটার্ন করবে।
২. একটি রাউট তৈরি করুন যা ইউজারের ডেটা রিসিভ করবে এবং একটি ব্যাকগ্রাউন্ড টাস্ক ব্যবহার করে সেই ডেটা একটি টেক্সট ফাইলে সেভ করবে।
৩. একই রাউটে একাধিক ব্যাকগ্রাউন্ড টাস্ক যোগ করে দেখুন সেগুলো কীভাবে কাজ করে।

---

## ৪. Summary & Best Practices

1. **User Consistent Errors:** ফ্রন্টএন্ড ডেভেলপারদের সুবিধার্থে সব সময় একই ধরনের এরর অবজেক্ট (e.g. `{"error": "message"}`) রিটার্ন করুন।
2. **Don't wait for Heavy Tasks:** ইমেইল পাঠানো বা রিপোর্টিং এর মতো কাজগুলো কখনোই রাউট ফাংশনের ভেতরে ডিরেক্ট করবেন না, সব সময় `BackgroundTasks` ব্যবহার করুন।
3. **Use Celery for complex tasks:** যদি আপনার ব্যাকগ্রাউন্ড টাস্কগুলো খুব বেশি জটিল বা ভারি হয় (যেমন: ভিডিও এনকোডিং), তবে `Celery` বা `Redis Queue` ব্যবহার করার কথা চিন্তা করুন। FastAPI-র ইন-বিল্ট ব্যাকগ্রাউন্ড টাস্ক ছোট কাজের জন্য সেরা।

---

::: tip পরবর্তী ধাপ
অভিনন্দন! আপনি ইন্টারমিডিয়েট লেভেলের প্রায় সবগুলো গুরুত্বপূর্ণ টপিক শেষ করেছেন। পরবর্তী লেভেলে আমরা শিখবো **Level 3: Advanced**, যেখানে আমাদের প্রথম টপিক হবে **Testing in FastAPI with Pytest**।
:::
