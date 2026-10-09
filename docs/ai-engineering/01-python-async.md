# 📘 অধ্যায় ১: Python for AI Engineers & Async Architecture
> **বইয়ের ট্র‍্যাক:** AI Engineer, GenAI & Agentic Systems (Track 2)  
> **মডিউল:** ০1 | পাইথন ফান্ডামেন্টালস, টাইপ সেফটি ও অ্যাসিনক্রোনাস আর্কিটেকচার  
> **উদ্দেশ্য:** একজন সাধারণ পাইথন প্রোগ্রামার থেকে আধুনিক প্রোডাকশন-গ্রেড এআই ইঞ্জিনিয়ার হওয়ার ভিত্তি তৈরি করা।

---

## 📑 সূচিপত্র (Table of Contents)
1. [ভূমিকা: সাধারণ পাইথন বনাম এআই ইঞ্জিনিয়ারের পাইথন](#১-ভূমিকা-সাধারণ-পাইথন-বনাম-এআই-ইঞ্জিনিয়ারের-পাইথন)
2. [টপিক ১: Type Hints ও Dataclass](#২-টপিক-১-type-hints-ও-dataclass)
3. [টপিক ২: Pydantic v2 Mastery (LLM Structured Outputs-এর ভিত্তি)](#৩-টপিক-২-pydantic-v2-mastery)
4. [টপিক ৩: AsyncIO ও Concurrency (একাধিক এআই কল হ্যান্ডেলিং)](#৪-টপিক-৩-asyncio-ও-concurrency)
5. [টপিক ৪: API Fundamentals, Streaming (SSE) ও JSON Parsing](#৫-টপিক-৪-api-fundamentals-streaming-sse-ও-json-parsing)
6. [টপিক ৫: Modern Environment & Dependency Setup (`uv` ও `.env`)](#৬-টপিক-৫-modern-environment--dependency-setup)
7. [🛠️ হ্যান্ডস-অন প্র্যাকটিক্যাল ল্যাব ও এক্সারসাইজ](#৭-হ্যান্ডস-অন-প্র্যাকটিক্যাল-ল্যাব-ও-মিনি-প্রজেক্ট)

---

## ১. ভূমিকা: সাধারণ পাইথন বনাম এআই ইঞ্জিনিয়ারের পাইথন

### প্রশ্ন: আমরা কি শুরু থেকেই পাইথন শিখেছি, তবে আবার কেন শিখব?
সাধারণ ডেটা সায়েন্স বা পাইথন স্ক্রিপ্টিংয়ে আমরা জুপিটার নোটবুকে কোড লিখি, যেখানে টাইপ ভ্যালিডেশন বা অ্যাসিঙ্ক অপারেশন নিয়ে মাথা ঘামাতে হয় না। কিন্তু আপনি যখন একটি **Agentic System** বা **GenAI Application** তৈরি করবেন:
1. **LLM আনপ্রেডিক্টেবল (Unpredictable):** এলএলএম সবসময় একই ফরম্যাটে উত্তর দেয় না। তাই আউটপুটকে কঠোর নিয়মে বাঁধতে **Pydantic Schema** দরকার।
2. **API কল ধীরগতির (High Latency):** একটি এলএলএম রেসপন্স দিতে ২ থেকে ৫ সেকেন্ড সময় নেয়। সিঙ্ক্রোনাস কোড লিখলে ১০ জন ইউজারের জন্য ৫০ সেকেন্ড আটকে থাকবে। এজন্য **AsyncIO (Concurrency)** বাধ্যতামূলক।
3. **টোকেন স্ট্রিমিং (Streaming):** চ্যাটজিপিটির মতো একটার পর একটা শব্দ ভেসে আসার জন্য **Server-Sent Events (SSE)** বুঝতে হয়।

---

## ২. টপিক ১: Type Hints ও Dataclass

### ২.১ Type Hints কেন দরকার?
পাইথন একটি ডায়নামিক টাইপড ল্যাঙ্গুয়েজ। কিন্তু আধুনিক এআই ফ্রেমওয়ার্ক (যেমন LangChain, LlamaIndex, Instructor) টাইপ হিন্টের ওপর ভিত্তি করে প্রম্পট তৈরি করে।

#### সাধারণ কোড বনাম টাইপ-হিন্টেড কোড:
```python
# ❌ সাধারণ কোড (টাইপ বোঝা যায় না)
def calculate_cost(tokens, rate):
    return tokens * rate

# ✅ প্রোডাকশন কোড (Type Hints সহ)
def calculate_cost(tokens: int, rate: float) -> float:
    return tokens * rate
```

#### কমন টাইপ হিন্টস যা প্রতিদিন লাগবে:
```python
from typing import List, Dict, Optional, Union, Any

# একটি চ্যাট হিস্ট্রি লিস্ট
chat_history: list[dict[str, str]] = [
    {"role": "user", "content": "Hello!"},
    {"role": "assistant", "content": "Hi there, how can I help you?"}
]

# Optional টাইপ (মান থাকতেও পারে, নাও থাকতে পারে বা None)
api_key: Optional[str] = None  # অথবা আধুনিক পাইথনে: str | None = None

# Union টাইপ (একাধিক টাইপ গ্রহণ করতে পারে)
query_response: Union[str, dict] = "Response in text"
```

---

### ২.২ Python `dataclass`
ডেটা স্টোর করার জন্য সাধারণ ডিকশনারি (`dict`) ব্যবহার করলে কি-এর বানানে ভুল (KeyError) হওয়ার ঝুঁকি থাকে। `dataclass` ব্যবহার করলে ক্লাস লেখার ঝামেলা ছাড়াই স্ট্রাকচার্ড ডেটা অবজেক্ট তৈরি হয়।

```python
from dataclasses import dataclass
from typing import Optional

@dataclass
class LLMMessage:
    role: str
    content: str
    token_count: Optional[int] = None

# অবজেক্ট তৈরি
msg = LLMMessage(role="user", content="Explain quantum computing", token_count=4)

print(msg.role)         # আউটপুট: user
print(msg.content)      # আউটপুট: Explain quantum computing
```

---

## ৩. টপিক ২: Pydantic v2 Mastery
> **গুরুত্ব:** ⭐⭐⭐⭐⭐ (এআই ইঞ্জিনিয়ারের সবচেয়ে প্রয়োজনীয় লাইব্রেরি)

### ৩.১ Pydantic কী এবং কেন এটি Dataclass-এর চেয়েও শক্তিশালী?
Dataclass শুধু টাইপ দেখায়, কিন্তু ভুল ডেটা পাস করলে এরর দেয় না। যেমন: বয়স `age: int`-এ যদি স্ট্রিং `"twenty"` দেন, Dataclass তা গ্রহণ করে নেবে।
কিন্তু **Pydantic** স্বয়ংক্রিয়ভাবে ডেটা ভ্যালিডেট ও কনভার্ট করে। ভুল হলে তৎক্ষণাৎ `ValidationError` রেইজ করে।

### ৩.২ ইনস্টলেশন:
```bash
pip install pydantic
```

### ৩.৩ প্র্যাকটিক্যাল কোড উদাহরণ:
```python
from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional

class UserProfile(BaseModel):
    user_id: int
    name: str = Field(min_length=2, max_length=50, description="ব্যবহারকারীর পুরো নাম")
    email: str
    skills: List[str] = []
    is_active: bool = True

# সঠিক ডেটা পাস করা
user = UserProfile(
    user_id="101",        # লক্ষ্য করুন: স্ট্রিং দিলেও Pydantic এটাকে int এ কনভার্ট করে নেবে!
    name="Ripon Ahmed",
    email="ripon@example.com",
    skills=["Python", "LangChain", "FastAPI"]
)

print(user.model_dump())       # ডিকশনারিতে কনভার্ট
print(user.model_dump_json())  # সরাসরি JSON স্ট্রিং এ কনভার্ট
```

### ৩.৪ বাস্তব এআই কেস-স্টাডি: LLM Structured Output তৈরি
ধরা যাক, আপনি চান এলএলএম একটি সংবাদ পড়ে তা থেকে সামারি এবং সেন্টিমেন্ট বের করে দিক। আপনি নিচের মতো স্কিমা ডিফাইন করবেন:

```python
from pydantic import BaseModel, Field

class NewsAnalysis(BaseModel):
    summary: str = Field(description="খবরের ২ লাইনের সারসংক্ষেপ")
    sentiment: str = Field(description="খবরের মনোভাব: Positive, Negative, অথবা Neutral")
    confidence_score: float = Field(ge=0.0, le=1.0, description="০ থেকে ১ এর মধ্যে কনফিডেন্স স্কোর")
    tags: list[str] = Field(description="প্রধান কি-ওয়ার্ড বা ট্যাগসমূহ")

# এই স্কিমাটি সরাসরি OpenAI/Gemini এর structured outputs API-তে পাস করা যায়!
```

---

## ৪. টপিক ৩: AsyncIO ও Concurrency
> **গুরুত্ব:** ⭐⭐⭐⭐⭐ (সিস্টেম ফাস্ট ও স্কেলেবল করার চাবিকাঠি)

### ৪.১ সিঙ্ক্রোনাস বনাম অ্যাসিনক্রোনাস (বাস্তব জীবনের রূপক)
* **সিঙ্ক্রোনাস (Synchronous):** আপনি রেস্টুরেন্টে গিয়ে খাবার অর্ডার দিলেন এবং ওয়েটার আপনার খাবারের থালা টেবিলে না দেওয়া পর্যন্ত অন্য কোনো কাস্টমারের অর্ডার নিতে পারল না।
* **অ্যাসিনক্রোনাস (Asynchronous):** কিচেনে খাবার রান্না হতে হতে (I/O Wait) ওয়েটার আরও ৫ জন কাস্টমারের অর্ডার নিয়ে ফেলল।

এআই অ্যাপ্লিকেশনগুলোতে সময়ের ৯৫% ব্যয় হয় ইন্টারনেটের মাধ্যমে মডেলের রিপ্লাইয়ের জন্য অপেক্ষা করতে (Network I/O)। তাই `async` কোড লিখলে একই সময়ে শত শত রিকোয়েস্ট হ্যান্ডেল করা যায়।

### ৪.২ মৌলিক কী-ওয়ার্ড:
* `async def`: অ্যাসিনক্রোনাস ফাংশন (করুটিন) ডিফাইন করতে।
* `await`: কোনো সময়সাপেক্ষ কাজ (যেমন API কল, ডাটাবেস কোয়েরি) শেষ হওয়া পর্যন্ত অপেক্ষা করতে।
* `asyncio.gather()`: একসাথে একাধিক টাস্ক প্যারালালে চালাতে।

### ৪.৩ কোড তুলনা:
```python
import asyncio
import time

# কৃত্রিম এআই এপিআই কল সিমুলেশন
async def fake_ai_call(prompt: str, delay: int) -> str:
    print(f"লঞ্চ করা হলো: '{prompt}'...")
    await asyncio.sleep(delay) # time.sleep() ব্যবহার করা যাবে না, এটি পুরো থ্রেড ফ্রিজ করে দেয়!
    return f"উত্তর: '{prompt}' সম্পন্ন হলো।"

async def main():
    start = time.time()
    
    # একসাথে ৩টি প্রম্পট সমান্তরালে (Parallelly) পাঠানো
    prompts = [
        fake_ai_call("প্রম্পট ১: ডেটা সায়েন্স কী?", 2),
        fake_ai_call("প্রম্পট ২: এলএলএম কীভাবে কাজ করে?", 2),
        fake_ai_call("প্রম্পট ৩: এজেন্টিক ওয়ার্কফ্লো কী?", 2),
    ]
    
    results = await asyncio.gather(*prompts)
    
    for r in results:
        print(r)
        
    print(f"⏱️ মোট সময় লাগল: {time.time() - start:.2f} সেকেন্ড")

# রান করার নিয়ম
if __name__ == "__main__":
    asyncio.run(main())
```
> **ফলাফল বিশ্লেষণ:** সিঙ্ক্রোনাস হলে ২ + ২ + ২ = ৬ সেকেন্ড লাগত। অ্যাসিনক্রোনাসে মাত্র **২.০১ সেকেন্ডেই** ৩টি প্রম্পটের উত্তর একসাথে চলে এসেছে!

---

### ৪.৪ `httpx` (আধুনিক অ্যাসিঙ্ক HTTP ক্লায়েন্ট)
সাধারণ `requests` লাইব্রেরি অ্যাসিঙ্ক সাপোর্ট করে না। আধুনিক এআই ইঞ্জিনিয়াররা ব্যবহার করেন `httpx`।

```bash
pip install httpx
```

```python
import httpx
import asyncio

async def fetch_ai_models():
    async with httpx.AsyncClient() as client:
        response = await client.get("https://api.github.com")
        print("স্ট্যাটাস কোড:", response.status_code)

asyncio.run(fetch_ai_models())
```

---

## ৫. টপিক ৪: API Fundamentals, Streaming (SSE) ও JSON Parsing

### ৫.১ Streaming (Server-Sent Events - SSE)
চ্যাটজিপিটিতে যখন কোনো বড় উত্তর চাওয়া হয়, তখন পুরো প্যারাগ্রাফ একসাথে আসে না; একটার পর একটা টোকেন আসে। একে বলে **Streaming Response**।

* **সাধারণ রেসপন্স:** ক্লায়েন্ট রিকোয়েস্ট পাঠায় ➡️ সার্ভার পুরো উত্তর প্রস্তুত করে ➡️ ১০ সেকেন্ড পর একবারে পাঠায়।
* **স্ট্রিমিং রেসপন্স:** ক্লায়েন্ট সংযোগ খোলে ➡️ সার্ভার প্রতিটি টোকেন জেনারেট হওয়ার সাথে সাথে পাঠিয়ে দেয় (`Transfer-Encoding: chunked`)।

```python
# স্ট্রিমিং জেনারেটরের পাইথন কনসেপ্ট
import time

def stream_tokens():
    tokens = ["কৃত্রিম", " বুদ্ধিমত্তা", " আমাদের", " কাজ", " সহজ", " করছে।"]
    for token in tokens:
        time.sleep(0.3)
        yield token

# কনসোলে টাইপিং ইফেক্ট দেখা
for chunk in stream_tokens():
    print(chunk, end="", flush=True)
print()
```

---

## ৬. টপিক ৫: Modern Environment & Dependency Setup

### ৬.১ আধুনিক টুল: `uv` (Ultra-fast Python Package Manager)
২০২৫-২০২৬ সালে `pip` এবং `conda`-র চেয়ে ১০-১০০ গুণ দ্রুতগতির প্যাকেজ ম্যানেজার হলো `uv` (রার্স্ট-এ লেখা)।

#### কীভাবে ব্যবহার করবেন:
```bash
# uv ইনস্টল (পাওয়ারশেল বা টার্মিনালে)
powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"

# নতুন ভার্চুয়াল এনভায়রনমেন্ট তৈরি
uv venv

# অ্যাক্টিভেট করা (Windows)
.venv\Scripts\activate

# সুপারফাস্ট প্যাকেজ ইনস্টল
uv pip install pydantic httpx python-dotenv
```

### ৬.২ API Keys ও Secrets হ্যান্ডলিং (`python-dotenv`)
কখনোই আপনার OpenAI, Anthropic বা Gemini API Key কোডের ভেতরে সরাসরি লিখবেন না। এটি গিটহাবে পুশ হলে লিক হয়ে যাবে।

1. রুট ডিরেক্টরিতে একটি `.env` ফাইল তৈরি করুন:
   ```env
   OPENAI_API_KEY=sk-proj-your_actual_key_here
   GEMINI_API_KEY=AIzaSy_your_gemini_key_here
   ```
2. `.gitignore` ফাইলে `.env` যোগ করুন।
3. পাইথনে রিড করার নিয়ম:
   ```python
   import os
   from dotenv import load_dotenv

   # .env ফাইল লোড করা
   load_dotenv()

   api_key = os.getenv("OPENAI_API_KEY")
   if not api_key:
       raise ValueError("⚠️ OPENAI_API_KEY পাওয়া যায়নি! .env ফাইল চেক করুন।")
   ```

---

## ৭. হ্যান্ডস-অন প্র্যাকটিক্যাল ল্যাব ও মিনি প্রজেক্ট

এই অধ্যায়ে যা শিখলেন তা প্রমাণ করতে নিচের **৩টি হ্যান্ডস-অন ল্যাব** প্র্যাকটিস করুন:

### 🧪 ল্যাব ১: AI Structured Validator তৈরি
* **টাস্ক:** একটি Pydantic মডেল তৈরি করুন যার নাম হবে `CustomerFeedback`।
* **ফিল্ডসমূহ:**
  1. `customer_name` (স্ট্রিং, কমপক্ষে ৩ অক্ষর)
  2. `rating` (পূর্ণসংখ্যা, ১ থেকে ৫ এর মধ্যে সীমাবদ্ধ)
  3. `comment` (স্ট্রিং)
  4. `category` (শুধু "Pricing", "Support", বা "Feature Request" গ্রহণ করবে)
* **টেস্ট:** একটি ভুল রেটিং (যেমন ৬) দিয়ে টেস্ট করুন এবং দেখুন Pydantic কীভাবে সুন্দর ভ্যালিডেশন এরর মেসেজ দেয়।

### 🧪 ল্যাব ২: Concurrent Mock LLM Fetcher
* **টাস্ক:** `httpx` এবং `asyncio.gather()` ব্যবহার করে একই সাথে ৩টি ভিন্ন ভিন্ন ওয়েবসাইট বা মক এপিআই থেকে ডেটা ফেচ করুন।
* **পরিমাপ:** টাইম ট্র্যাকার দিয়ে মেপে দেখুন সিঙ্ক্রোনাস ও অ্যাসিনক্রোনাস কোডের মধ্যে সময়ের পার্থক্য কত।

### 🧪 ল্যাব ৩: Secure Environment Setup
* **টাস্ক:** আপনার প্রজেক্টে একটি `.env` ফাইল তৈরি করে একটি ডামি API কি সেট করুন এবং পাইথন স্ক্রিপ্ট দিয়ে তা সফলভাবে লোড করে প্রিন্ট করুন।

---

### 🎯 পরবর্তী অধ্যায়:
এই অধ্যায়ের প্র্যাকটিস শেষ হলে আমরা যাব:  
👉 **অধ্যায় ২: LLM Core, Prompt Engineering & Tool Calling** (যেখানে আমরা সরাসরি OpenAI/Gemini API এবং লোকাল মডেল Ollama রান করব)।
