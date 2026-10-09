# 📘 অধ্যায় ২: LLM Core, Prompt Engineering & Tool Calling
> **বইয়ের ট্র‍্যাক:** AI Engineer, GenAI & Agentic Systems (Track 2)  
> **মডিউল:** ০২ | এলএলএম ইন্টারনালস, অ্যাডভান্সড প্রম্পটিং, টুল কলিং ও লোকাল রানটাইম  
> **উদ্দেশ্য:** লার্জ ল্যাঙ্গুয়েজ মডেল (LLM) কীভাবে কাজ করে তা বোঝা এবং কোডের মাধ্যমে মডেলকে নির্ভুলভাবে নিয়ন্ত্রণ করা।

---

## 📑 সূচিপত্র (Table of Contents)
1. [ভূমিকা: এলএলএম আসলে কী এবং কীভাবে কাজ করে?](#১-ভূমিকা-এলএলএম-আসলে-কী-এবং-কীভাবে-কাজ-করে)
2. [টপিক ১: Tokens, Context Window ও Sampling Parameters](#২-টপিক-১-tokens-context-window-ও-sampling-parameters)
3. [টপিক ২: Foundation Model APIs (OpenAI, Anthropic, Gemini)](#৩-টপিক-২-foundation-model-apis)
4. [টপিক ৩: Advanced Prompt Engineering (Few-Shot, CoT, ReAct)](#৪-টপিক-৩-advanced-prompt-engineering)
5. [টপিক ৪: Function Calling & Native Tool Calling](#৫-টপিক-৪-function-calling--native-tool-calling)
6. [টপিক ৫: Structured Outputs with Pydantic](#৬-টপিক-৫-structured-outputs-with-pydantic)
7. [টপিক ৬: Local LLM Execution with Ollama](#৭-টপিক-৬-local-llm-execution-with-ollama)
8. [🎯 মাইলস্টোন প্রজেক্ট ১: Multi-LLM Smart Fallback API Wrapper](#৮-মাইলস্টোন-প্রজেক্ট-১-multi-llm-smart-fallback-wrapper)

---

## ১. ভূমিকা: এলএলএম আসলে কী এবং কীভাবে কাজ করে?

অনেকে মনে করেন এলএলএম কোনো জাদুকরি বুদ্ধিমত্তা। কিন্তু কম্পিউটার সায়েন্সের ভাষায়:
> **LLM হলো একটি বিশাল Next-Token Prediction Engine।**

পূর্বের শব্দের প্রেক্ষাপটে পরবর্তী শব্দটি সবচেয়ে বেশি সম্ভাবনাময় (Highest Probability) কোনটি হবে—সেটাই সে অনুমান করে।
একজন সাধারণ এআই ব্যবহারকারী শুধু চ্যাটবক্সে প্রম্পট লেখে, কিন্তু একজন **AI Engineer** মডেলের টোকেন খরচ, লেটেন্সি, স্যাম্পলিং প্যারামিটার এবং আউটপুট ফরম্যাট কোড দিয়ে ১০০% নিয়ন্ত্রণ করে।

---

## ২. টপিক ১: Tokens, Context Window ও Sampling Parameters

### ২.১ টোকেন (Tokens) কী?
এলএলএম সরাসরি ইংরেজি বা বাংলা অক্ষর প্রসেস করে না। টেক্সটকে প্রথমে ছোট ছোট সংখ্যা বা টোকেনে রূপান্তর করা হয় (**Byte-Pair Encoding / BPE**)।
* সাধারণ ইংরেজি: ১০০০ টোকেন ≈ ৭৫০ শব্দ।
* বাংলা বা নন-ল্যাটিন ভাষা: অক্ষরপ্রতি টোকেন খরচ বেশি হতে পারে।

```python
# OpenAI tiktoken দিয়ে টোকেন গণনা
import tiktoken

encoding = tiktoken.encoding_for_model("gpt-4o")
text = "Artificial Intelligence Engineering is awesome!"
tokens = encoding.encode(text)

print(f"টোকেন সংখ্যা: {len(tokens)}")
print(f"টোকেন আইডি তালিকা: {tokens}")
```

### ২.২ Context Window
মডেলের "ওয়ার্কিং মেমরি" হলো কনটেক্সট উইন্ডো। একটি রিকোয়েস্টে ইনপুট প্রম্পট + আউটপুট রেসপন্স মিলিয়ে কনটেক্সট উইন্ডো অতিক্রম করতে পারবে না।
* **GPT-4o:** 128k টোকেন (~৩০০ পৃষ্ঠা)
* **Claude 3.5 Sonnet:** 200k টোকেন
* **Gemini 1.5 Pro:** 2M টোকেন (~১ ঘণ্টা ভিডিও বা বিশাল কোডবেস)

### ২.৩ Sampling Parameters (মডেলকে নিয়ন্ত্রণ করার চাবি)
1. **Temperature (০.০ থেকে ২.০):**
   * `0.0`: উত্তর হবে ১০০% ডিটারমিনিস্টিক ও ফ্যাকচুয়াল (কোডিং, ম্যাথ, JSON এক্সট্রাকশনের জন্য সেরা)।
   * `0.7 - 1.0`: ক্রিয়েটিভ কনটেন্ট, ব্রেনস্টর্মিং বা স্টোরিটেলিংয়ের জন্য ভালো।
2. **Top-P (Nucleus Sampling):**
   * প্রোবাবিলিটি থ্রেশহোল্ড (যেমন `0.9` দিলে টপ ৯০% সম্ভাব্য শব্দ বিবেচনা করবে)।
3. **Frequency & Presence Penalty:**
   * একই শব্দের পুনরাবৃত্তি ঠেকাতে বা নতুন নতুন টপিক নিয়ে আসতে ব্যবহৃত হয়।

---

## ৩. টপিক ২: Foundation Model APIs

প্রোডাকশনে এআই সিস্টেম তৈরির জন্য বিভিন্ন ক্লাউড প্রোভাইডারের অফিশিয়াল SDK ব্যবহার করা হয়:

```python
# OpenAI Official Client
from openai import OpenAI
import os

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

response = client.chat.completions.create(
    model="gpt-4o",
    temperature=0.2,
    messages=[
        {"role": "system", "content": "You are an expert AI Architect."},
        {"role": "user", "content": "Explain RAG architecture in 2 sentences."}
    ]
)

print(response.choices[0].message.content)
```

---

## ৪. টপিক ৩: Advanced Prompt Engineering

### ৪.১ System Prompt Architecture
এআই-এর চরিত্র, দায়িত্ব এবং সীমাবদ্ধতা নির্ধারণের জন্য সিস্টেম প্রম্পট হলো সবচেয়ে গুরুত্বপূর্ণ ফিল্টার।
* **Role:** আপনি কে? (যেমন: Senior Python Architect)
* **Context:** কাজটির প্রেক্ষাপট কী?
* **Constraints (Guardrails):** কী কী করা যাবে না (যেমন: কখনো মনগড়া উত্তর দেবে না)।
* **Output Format:** উত্তর কোন ফরম্যাটে দিতে হবে (যেমন: Markdown বা JSON)।

### ৪.২ Few-Shot Prompting
মডেলকে কেবল নিয়ম না বলে উত্তরের ২-৩টি নমুনা (Examples) দিয়ে দিলে আউটপুট সবচেয়ে নির্ভুল হয়।
```text
Classify customer review sentiment:

Review: "The product quality exceeded my expectations!" -> Positive
Review: "Delivery was 3 days late, very disappointed." -> Negative
Review: "The battery lasts around 6 hours as advertised." -> Neutral
Review: "Customer service never answered my calls." -> 
```

### ৪.৩ Chain-of-Thought (CoT)
জটিল যুক্তিতর্ক বা কোডিং প্রবলেমে মডেলকে সরাসরি উত্তর না চেয়ে `"Let's think step by step"` ইনস্ট্রাকশন দিলে ভুলের হার ৫০% কমে যায়।

### ৪.৪ ReAct Pattern (Reason + Act)
এজেন্ট তৈরির ভিত্তি হলো ReAct। মডেল এভাবে লুপ চালায়:
```text
Question: What is 25 * 48 + 19?
Thought: I need to multiply 25 and 48 first, then add 19.
Action: Calculator(25 * 48)
Observation: 1200
Thought: Now I need to add 19 to 1200.
Action: Calculator(1200 + 19)
Observation: 1219
Thought: I have the final answer.
Final Answer: 1219
```

---

## ৫. টপিক ৪: Function Calling & Native Tool Calling

মডেল নিজে রিয়েল-টাইম ডাটা (যেমন লাইভ আবহাওয়া, ডাটাবেস, কারেন্সি রেট) জানে না। টুল কলিংয়ের মাধ্যমে আমরা এআই-কে আমাদের নিজস্ব ফাংশন চালানোর অনুমতি দিই।

```python
import json
from openai import OpenAI

client = OpenAI()

# ১. আমাদের পাইথন ফাংশন
def get_stock_price(symbol: str) -> str:
    # বাস্তব সিস্টেমে এটি API থেকে ডাটা আনবে
    prices = {"AAPL": "$230.50", "TSLA": "$215.20", "GOOGL": "$175.80"}
    return json.dumps({"symbol": symbol, "price": prices.get(symbol.upper(), "Unknown")})

# ২. ফাংশনের স্কিমা ডিফাইন করা
tools = [
    {
        "type": "function",
        "function": {
            "name": "get_stock_price",
            "description": "Get current stock market price for a given stock symbol",
            "parameters": {
                "type": "object",
                "properties": {
                    "symbol": {"type": "string", "description": "Stock ticker symbol (e.g. AAPL)"}
                },
                "required": ["symbol"]
            }
        }
    }
]

# ৩. মডেলে রিকোয়েস্ট পাঠানো
response = client.chat.completions.create(
    model="gpt-4o",
    messages=[{"role": "user", "content": "What is the current stock price of Apple?"}],
    tools=tools,
    tool_choice="auto"
)

tool_call = response.choices[0].message.tool_calls[0]
print(f"মডেল কল করতে বলেছে: {tool_call.function.name}")
print(f"আর্গুমেন্ট: {tool_call.function.arguments}")
```

---

## ৬. টপিক ৫: Structured Outputs with Pydantic

প্রোডাকশনে টেক্সট আউটপুট পার্স করা ঝুঁকিপূর্ণ। OpenAI ও Gemini এখন নেটিভলি Pydantic স্কিমা অনুযায়ী ১০০% নির্ভুল JSON আউটপুট দেয়:

```python
from pydantic import BaseModel, Field
from openai import OpenAI

client = OpenAI()

class BugReport(BaseModel):
    title: str = Field(description="বাগটির সংক্ষিপ্ত শিরোনাম")
    severity: str = Field(description="Low, Medium, High, or Critical")
    suggested_fix: str = Field(description="বাগ সমাধানের উপায়")

completion = client.beta.chat.completions.parse(
    model="gpt-4o-2024-08-06",
    messages=[
        {"role": "system", "content": "Extract bug report details from developer message."},
        {"role": "user", "content": "App crashed when user clicked checkout with empty cart!"}
    ],
    response_format=BugReport,
)

bug: BugReport = completion.choices[0].message.parsed
print(f"Title: {bug.title}")
print(f"Severity: {bug.severity}")
print(f"Fix: {bug.suggested_fix}")
```

---

## ৭. টপিক ৬: Local LLM Execution with Ollama

ক্লাউড এপিআই ছাড়াও সম্পূর্ণ ফ্রিতে নিজস্ব পিসিতে অফলাইনে LLaMA 3 বা DeepSeek-R1 মডেল চালানো যায়:

```bash
# টার্মিনালে রান করুন
ollama run llama3.2
ollama run deepseek-r1:8b
```

### পাইথনে লোকাল মডেল ব্যবহার:
```python
from openai import OpenAI

# Ollama-র বিল্ট-ইন OpenAI কম্প্যাটিবল এন্ডপয়েন্ট
client = OpenAI(
    base_url='http://localhost:11434/v1',
    api_key='ollama' # কোনো পেমেন্ট বা কি লাগবে না
)

response = client.chat.completions.create(
    model="llama3.2",
    messages=[{"role": "user", "content": "Explain recursion in 1 line."}]
)

print(response.choices[0].message.content)
```

---

## 🎯 ৮. মাইলস্টোন প্রজেক্ট ১: Multi-LLM Smart Fallback Wrapper

**চ্যালেঞ্জ:** এমন একটি প্রোডাকশন ক্লাস তৈরি করুন যা প্রথমে OpenAI-তে কল করবে। যদি কোনো কারণে OpenAI Rate Limit বা Quota Error দেয়, তবে স্বয়ংক্রিয়ভাবে লোকাল Ollama-তে সুইচ করবে।

```python
import os
import httpx
from openai import OpenAI
from pydantic import BaseModel

class SmartFallbackLLM:
    def __init__(self):
        self.cloud_client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
        self.local_client = OpenAI(base_url="http://localhost:11434/v1", api_key="ollama")

    def generate(self, prompt: str) -> str:
        try:
            print("☁️ OpenAI-তে কল করা হচ্ছে...")
            res = self.cloud_client.chat.completions.create(
                model="gpt-4o",
                messages=[{"role": "user", "content": prompt}],
                timeout=5.0
            )
            return res.choices[0].message.content
        except Exception as e:
            print(f"⚠️ OpenAI ব্যর্থ হয়েছে ({e})! স্বয়ংক্রিয়ভাবে Local Ollama-তে সুইচ করা হচ্ছে...")
            res = self.local_client.chat.completions.create(
                model="llama3.2",
                messages=[{"role": "user", "content": prompt}]
            )
            return f"[Local Fallback Output]\n{res.choices[0].message.content}"

# টেস্ট রান
# llm = SmartFallbackLLM()
# print(llm.generate("Python কেন সেরা?"))
```
