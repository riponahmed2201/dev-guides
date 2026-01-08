# Python Basics (প্রাথমিক ধারণা)

Python শেখার যাত্রা শুরু করার জন্য এই অংশটি সবচেয়ে গুরুত্বপূর্ণ। এখানে আমরা একদম শুরু থেকে সবকিছু সহজভাবে এবং গভীরভাবে বুঝবো।

---

## ১. Python কি এবং কেন শিখবে?

**Python** হলো একটি হাই-লেভেল, ইন্টারপ্রেটেড প্রোগ্রামিং ল্যাঙ্গুয়েজ যা ১৯৯১ সালে Guido van Rossum তৈরি করেন। বর্তমানে এটি বিশ্বের সবচেয়ে জনপ্রিয় প্রোগ্রামিং ভাষাগুলোর একটি।

### কেন Python শিখবে?

#### ১. সহজ এবং পরিষ্কার সিনট্যাক্স (Simple & Clean Syntax)
Python এর কোড পড়া প্রায় সাধারণ ইংরেজি পড়ার মতো সহজ। অন্যান্য ভাষার তুলনায় Python এ কম কোড লিখে বেশি কাজ করা যায়।

**উদাহরণ:** একই কাজ বিভিন্ন ভাষায়

```python
# Python
print("Hello World")
```

```java
// Java
public class Main {
    public static void main(String[] args) {
        System.out.println("Hello World");
    }
}
```

দেখুন, Python এ মাত্র ১ লাইনে যা করা যাচ্ছে, Java তে তার জন্য ৫ লাইন লাগছে!

#### ২. ভার্সেটাইল (Versatile) - সব ধরনের কাজে ব্যবহারযোগ্য
- **ওয়েব ডেভেলপমেন্ট:** FastAPI, Django, Flask
- **ডেটা সায়েন্স ও মেশিন লার্নিং:** Pandas, NumPy, TensorFlow
- **অটোমেশন ও স্ক্রিপ্টিং:** ফাইল ম্যানেজমেন্ট, ওয়েব স্ক্র্যাপিং
- **গেম ডেভেলপমেন্ট:** Pygame
- **ডেস্কটপ অ্যাপ্লিকেশন:** Tkinter, PyQt

#### ৩. বিশাল কমিউনিটি এবং লাইব্রেরি
- ৩,০০,০০০+ প্যাকেজ PyPI (Python Package Index) এ উপলব্ধ
- যেকোনো সমস্যার সমাধান Stack Overflow, Reddit, GitHub এ পাওয়া যায়
- প্রচুর ফ্রি টিউটোরিয়াল এবং ডকুমেন্টেশন

#### ৪. চাকরির বাজারে চাহিদা
- Google, Facebook, Netflix, Instagram সহ বড় কোম্পানিগুলো Python ব্যবহার করে
- Data Science এবং AI/ML এর জন্য Python প্রথম পছন্দ
- বাংলাদেশেও Python ডেভেলপারদের চাহিদা দিন দিন বাড়ছে

---

## ২. Installation (সেটআপ)

কোডিং শুরু করার আগে আপনার কম্পিউটারে Python এবং একটি Code Editor সঠিকভাবে ইন্সটল করতে হবে।

### ২.১ Python ইন্সটল করা

#### Windows এর জন্য:
1. [python.org/downloads](https://www.python.org/downloads/) এ যান
2. **Download Python 3.x.x** বাটনে ক্লিক করুন (সর্বশেষ stable version)
3. ডাউনলোড হওয়া `.exe` ফাইলটি রান করুন
4. **গুরুত্বপূর্ণ:** ইন্সটলারের প্রথম স্ক্রিনে **"Add Python to PATH"** চেকবক্সে অবশ্যই টিক দিন
5. **Install Now** ক্লিক করুন

#### Mac এর জন্য:
1. [python.org/downloads](https://www.python.org/downloads/) থেকে macOS installer ডাউনলোড করুন
2. `.pkg` ফাইলটি রান করে ইন্সটল করুন

অথবা Homebrew ব্যবহার করে:
```bash
brew install python3
```

#### Linux এর জন্য:
বেশিরভাগ Linux distro তে Python আগে থেকেই ইন্সটল করা থাকে। না থাকলে:

```bash
# Ubuntu/Debian
sudo apt update
sudo apt install python3 python3-pip

# Fedora
sudo dnf install python3 python3-pip
```

### ২.২ Installation যাচাই করা (Verification)

ইন্সটল সঠিকভাবে হয়েছে কিনা তা যাচাই করতে:

**Windows:** Command Prompt খুলুন (Win + R → `cmd`)  
**Mac/Linux:** Terminal খুলুন

এরপর নিচের কমান্ডগুলো রান করুন:

```bash
python --version
```
অথবা
```bash
python3 --version
```

**Expected Output:**
```
Python 3.11.5
```

যদি version number দেখায়, তাহলে ইন্সটল সফল হয়েছে! ✅

### ২.৩ pip যাচাই করা

`pip` হলো Python এর package manager। এটি দিয়ে বিভিন্ন লাইব্রেরি ইন্সটল করা যায়।

```bash
pip --version
```
অথবা
```bash
pip3 --version
```

**Expected Output:**
```
pip 23.2.1 from /usr/local/lib/python3.11/site-packages/pip (python 3.11)
```

### ২.৪ Editor সেটআপ (VS Code)

#### VS Code ইন্সটল:
1. [code.visualstudio.com](https://code.visualstudio.com/) থেকে ডাউনলোড করুন
2. ইন্সটল করুন

#### Python Extension ইন্সটল:
1. VS Code খুলুন
2. বাম পাশের **Extensions** আইকনে ক্লিক করুন (অথবা `Ctrl+Shift+X`)
3. সার্চ করুন: **"Python"**
4. Microsoft এর অফিশিয়াল **Python extension** ইন্সটল করুন

#### অন্যান্য জনপ্রিয় Editor/IDE:
- **PyCharm** - Professional Python IDE (বড় প্রজেক্টের জন্য)
- **Jupyter Notebook** - Data Science এর জন্য
- **Sublime Text** - হালকা এবং দ্রুত

### ২.৫ সাধারণ Installation সমস্যা এবং সমাধান

#### সমস্যা ১: `python` command কাজ করছে না
**সমাধান:** 
- Windows এ PATH ঠিকমতো সেট হয়নি। Python আবার reinstall করুন এবং "Add to PATH" টিক দিন
- অথবা `python3` কমান্ড ব্যবহার করুন

#### সমস্যা ২: Permission denied (Linux/Mac)
**সমাধান:**
```bash
sudo apt install python3
```

#### সমস্যা ৩: Multiple Python versions installed
**সমাধান:**
- নির্দিষ্ট version ব্যবহার করতে: `python3.11` বা `python3.10`
- Virtual environment ব্যবহার করুন (পরে শিখবো)

### ২.৬ Virtual Environment (ভার্চুয়াল এনভায়রনমেন্ট) - প্রাথমিক ধারণা

::: tip কেন Virtual Environment দরকার?
প্রতিটি Python প্রজেক্টের জন্য আলাদা আলাদা লাইব্রেরি ভার্সন দরকার হতে পারে। Virtual Environment ব্যবহার করে আমরা প্রতিটি প্রজেক্টকে আলাদা রাখতে পারি।
:::

**তৈরি করা:**
```bash
python -m venv myenv
```

**Activate করা:**
```bash
# Windows
myenv\Scripts\activate

# Mac/Linux
source myenv/bin/activate
```

**Deactivate করা:**
```bash
deactivate
```

> **নোট:** এই মুহূর্তে virtual environment না বুঝলেও সমস্যা নেই। পরবর্তীতে প্রজেক্ট শুরু করার সময় এটি বিস্তারিত শিখবো।

---

## ৩. First Program: Hello World

প্রোগ্রামিং এর জগতে প্রথম প্রোগ্রাম হিসেবে "Hello World" প্রিন্ট করার একটি ঐতিহ্য আছে। চলুন আমরাও সেটি করি!

### ৩.১ REPL ব্যবহার করে (দ্রুত টেস্ট)

Terminal/Command Prompt খুলে লিখুন:
```bash
python
```

এরপর Python interactive shell চালু হবে। এখন লিখুন:
```python
>>> print("Hello World")
```

**Output:**
```
Hello World
```

REPL থেকে বের হতে:
```python
>>> exit()
```
অথবা `Ctrl + Z` (Windows) বা `Ctrl + D` (Mac/Linux)

### ৩.২ Python File তৈরি করে (প্রপার পদ্ধতি)

#### Step 1: ফোল্ডার তৈরি করুন
একটি নতুন ফোল্ডার তৈরি করুন, যেমন: `python-learning`

#### Step 2: VS Code এ ফোল্ডার খুলুন
- VS Code খুলুন
- **File → Open Folder** → আপনার তৈরি ফোল্ডার সিলেক্ট করুন

#### Step 3: Python File তৈরি করুন
- নতুন ফাইল তৈরি করুন: `hello.py`
- `.py` extension অবশ্যই দিতে হবে

#### Step 4: কোড লিখুন
```python
print("Hello World")
print("আমার প্রথম Python প্রোগ্রাম!")
```

#### Step 5: কোড রান করুন

**পদ্ধতি ১: VS Code এর Run Button**
- উপরে ডান দিকে ▶️ (Run) বাটনে ক্লিক করুন
- নিচে Terminal এ output দেখাবে

**পদ্ধতি ২: Integrated Terminal ব্যবহার করে**
- VS Code এ Terminal খুলুন: `Ctrl + ` ` (backtick)
- লিখুন:
```bash
python hello.py
```

**পদ্ধতি ৩: External Terminal থেকে**
```bash
cd python-learning
python hello.py
```

**Expected Output:**
```
Hello World
আমার প্রথম Python প্রোগ্রাম!
```

### ৩.৩ print() Function বিস্তারিত

`print()` হলো Python এর সবচেয়ে বেশি ব্যবহৃত built-in function।

#### একাধিক জিনিস প্রিন্ট করা:
```python
print("Hello", "World", "Python")
# Output: Hello World Python
```

#### সংখ্যা প্রিন্ট করা:
```python
print(42)
print(3.14)
# Output:
# 42
# 3.14
```

#### Separator পরিবর্তন করা:
```python
print("Apple", "Banana", "Cherry", sep=", ")
# Output: Apple, Banana, Cherry
```

#### নতুন লাইন এড়ানো:
```python
print("Hello", end=" ")
print("World")
# Output: Hello World
```

### ৩.৪ সাধারণ ভুল এবং সমাধান

#### ভুল ১: Quotation marks ভুলে যাওয়া
```python
print(Hello)  # ❌ ভুল
```
**Error:**
```
NameError: name 'Hello' is not defined
```
**সমাধান:**
```python
print("Hello")  # ✅ সঠিক
```

#### ভুল ২: Parentheses ভুলে যাওয়া
```python
print "Hello"  # ❌ Python 2 এর syntax, Python 3 এ কাজ করবে না
```
**সমাধান:**
```python
print("Hello")  # ✅ সঠিক
```

#### ভুল ৩: Indentation Error
```python
 print("Hello")  # ❌ শুরুতে অপ্রয়োজনীয় space
```
**সমাধান:**
```python
print("Hello")  # ✅ সঠিক
```

### ৩.৫ File Naming Best Practices

#### ✅ ভালো নাম:
- `hello.py`
- `calculator.py`
- `my_first_program.py`

#### ❌ খারাপ নাম:
- `hello world.py` (space আছে)
- `1st_program.py` (সংখ্যা দিয়ে শুরু)
- `print.py` (built-in function এর নাম)

**নিয়ম:**
- ছোট হাতের অক্ষর ব্যবহার করুন
- Space এর বদলে underscore (`_`) ব্যবহার করুন
- Python এর reserved keywords ব্যবহার করবেন না

---

## ৪. Python Interpreter এবং REPL

### ৪.১ Interpreter কি?

Python একটি **interpreted language**। এর মানে হলো:
- কোড লাইন-বাই-লাইন execute হয়
- Compile করার দরকার নেই (C, Java এর মতো)
- কোড লিখেই সাথে সাথে রান করা যায়

**তুলনা:**

| Compiled Language (C, Java) | Interpreted Language (Python) |
|----------------------------|-------------------------------|
| প্রথমে পুরো কোড compile করতে হয় | লাইন-বাই-লাইন execute হয় |
| Faster execution | Slower execution |
| Error পুরো কোড compile এর পরে ধরা পড়ে | Error সাথে সাথে দেখায় |

### ৪.২ REPL কি?

**REPL = Read-Eval-Print Loop**

এটি একটি interactive shell যেখানে:
1. **Read:** আপনার কোড পড়ে
2. **Eval:** কোড execute করে
3. **Print:** ফলাফল দেখায়
4. **Loop:** আবার নতুন কোডের জন্য অপেক্ষা করে

### ৪.৩ REPL কীভাবে ব্যবহার করবেন?

#### REPL শুরু করা:
```bash
python
```

**আপনি দেখবেন:**
```
Python 3.11.5 (main, Sep 11 2023, 13:54:46)
[GCC 11.2.0] on linux
Type "help", "copyright", "credits" or "license" for more information.
>>>
```

`>>>` এই চিহ্নটি মানে Python আপনার কমান্ডের জন্য অপেক্ষা করছে।

#### REPL এ কোড লিখা:

**গাণিতিক হিসাব:**
```python
>>> 2 + 2
4
>>> 10 * 5
50
>>> 100 / 3
33.333333333333336
```

**Variable তৈরি:**
```python
>>> name = "Ripon"
>>> print(name)
Ripon
>>> age = 25
>>> age + 5
30
```

**Function কল:**
```python
>>> len("Hello")
5
>>> type(42)
<class 'int'>
```

#### Multi-line code REPL এ:
```python
>>> def greet(name):
...     print(f"Hello, {name}!")
...
>>> greet("Python")
Hello, Python!
```

লক্ষ্য করুন: দ্বিতীয় লাইনে `...` দেখাচ্ছে, মানে Python বুঝেছে আরও কোড আসবে।

#### REPL থেকে বের হওয়া:
```python
>>> exit()
```
অথবা:
- Windows: `Ctrl + Z` তারপর `Enter`
- Mac/Linux: `Ctrl + D`

### ৪.৪ REPL vs Script File - কখন কোনটা ব্যবহার করবেন?

#### REPL ব্যবহার করুন যখন:
- ✅ দ্রুত কিছু টেস্ট করতে চান
- ✅ ছোট calculation করতে চান
- ✅ কোনো function এর output দেখতে চান
- ✅ Python syntax শিখছেন

**উদাহরণ:**
```python
>>> "Hello".upper()
'HELLO'
>>> [1, 2, 3] + [4, 5]
[1, 2, 3, 4, 5]
```

#### Script File (`.py`) ব্যবহার করুন যখন:
- ✅ বড় প্রোগ্রাম লিখছেন
- ✅ কোড save করে রাখতে চান
- ✅ কোড বারবার রান করতে হবে
- ✅ অন্যদের সাথে শেয়ার করতে চান

### ৪.৫ REPL এর কিছু দরকারি কমান্ড

```python
>>> help()          # Help system চালু করে
>>> help(print)     # print() function এর help দেখায়
>>> dir()           # বর্তমান namespace এর সব নাম দেখায়
>>> quit()          # REPL থেকে বের হয়
```

---

## ৫. Comments এবং Documentation

কোড শুধু কম্পিউটারের জন্য নয়, মানুষের জন্যও। **Comments** ব্যবহার করে আমরা কোড ব্যাখ্যা করি যাতে নিজে এবং অন্যরা পরে বুঝতে পারে।

### ৫.১ Single Line Comments

`#` চিহ্ন ব্যবহার করে single line comment লেখা হয়।

```python
# এটি একটি comment
print("Hello")  # এটিও comment

# age = 25  # এই লাইনটি execute হবে না
```

**কখন ব্যবহার করবেন:**
```python
# ✅ ভালো comment - কেন করছি তা ব্যাখ্যা করছে
# User এর age calculate করছি birth year থেকে
age = 2026 - 2000

# ❌ খারাপ comment - কোড যা বলছে তাই আবার বলছে
# age variable এ 26 assign করছি
age = 26
```

### ৫.২ Multi-line Comments

Python এ dedicated multi-line comment নেই, কিন্তু দুইভাবে করা যায়:

#### পদ্ধতি ১: একাধিক `#` ব্যবহার
```python
# এটি একটি বড় comment
# যা একাধিক লাইনে
# লেখা হয়েছে
print("Hello")
```

#### পদ্ধতি ২: Triple Quotes (Docstring হিসেবে)
```python
"""
এটি একটি multi-line string
যা comment হিসেবে ব্যবহার করা যায়
"""
print("Hello")
```

### ৫.৩ Docstrings (Documentation Strings)

Docstrings হলো বিশেষ ধরনের comment যা function, class, বা module এর documentation হিসেবে ব্যবহৃত হয়।

#### Function Docstring:
```python
def add(a, b):
    """
    দুইটি সংখ্যা যোগ করে।
    
    Parameters:
        a (int/float): প্রথম সংখ্যা
        b (int/float): দ্বিতীয় সংখ্যা
    
    Returns:
        int/float: যোগফল
    """
    return a + b

# Docstring দেখার উপায়
print(add.__doc__)
```

#### Module Docstring:
```python
"""
calculator.py

এই module এ বিভিন্ন গাণিতিক function আছে।
Author: Ripon Ahmed
Date: 2026-01-08
"""

def multiply(a, b):
    """দুইটি সংখ্যা গুণ করে"""
    return a * b
```

### ৫.৪ Comment Best Practices

#### ✅ ভালো Practices:

**১. কেন করছি তা ব্যাখ্যা করুন, কি করছি তা নয়:**
```python
# ✅ ভালো
# Leap year check করছি কারণ February এ দিন সংখ্যা আলাদা
if year % 4 == 0:
    days = 29

# ❌ খারাপ
# year কে 4 দিয়ে ভাগ করছি
if year % 4 == 0:
    days = 29
```

**২. জটিল logic ব্যাখ্যা করুন:**
```python
# Binary search algorithm ব্যবহার করছি O(log n) complexity এর জন্য
def binary_search(arr, target):
    # implementation...
```

**৩. TODO এবং FIXME ব্যবহার করুন:**
```python
# TODO: Error handling যোগ করতে হবে
# FIXME: এই function টি slow, optimize করতে হবে
def process_data(data):
    pass
```

#### ❌ খারাপ Practices:

**১. Obvious কথা comment করবেন না:**
```python
# ❌ খারাপ
x = 5  # x এ 5 assign করছি
```

**২. পুরনো code comment করে রাখবেন না:**
```python
# ❌ খারাপ
print("New version")
# print("Old version")
# x = old_function()
```

**৩. অতিরিক্ত comment করবেন না:**
```python
# ❌ খারাপ - প্রতি লাইনে comment দরকার নেই
name = "Ripon"  # name variable
age = 25  # age variable
city = "Dhaka"  # city variable
```

### ৫.৫ PEP 257 - Docstring Conventions

Python এর official docstring guideline হলো **PEP 257**।

**মূল নিয়ম:**
1. সব public module, function, class, method এ docstring থাকা উচিত
2. Triple double quotes (`"""`) ব্যবহার করুন
3. এক লাইনের docstring এক লাইনেই রাখুন
4. Multi-line docstring এর প্রথম লাইন summary হবে

**উদাহরণ:**
```python
def calculate_area(radius):
    """Calculate the area of a circle."""
    return 3.14 * radius ** 2

def calculate_volume(radius, height):
    """
    Calculate the volume of a cylinder.
    
    Args:
        radius (float): Radius of the base circle
        height (float): Height of the cylinder
    
    Returns:
        float: Volume of the cylinder
    
    Example:
        >>> calculate_volume(5, 10)
        785.0
    """
    return 3.14 * radius ** 2 * height
```

---

## ৬. Python 2 vs Python 3

### সংক্ষিপ্ত ইতিহাস:
- **Python 2:** ২০০০ সালে release, ২০২০ সালে officially discontinued
- **Python 3:** ২০০৮ সালে release, বর্তমানে active

### মূল পার্থক্য:

| Feature | Python 2 | Python 3 |
|---------|----------|----------|
| Print | `print "Hello"` | `print("Hello")` |
| Division | `5 / 2 = 2` | `5 / 2 = 2.5` |
| Unicode | ASCII default | Unicode default |
| Range | `range()` returns list | `range()` returns iterator |

### আপনার কি করা উচিত?
✅ **সবসময় Python 3 ব্যবহার করুন**  
❌ Python 2 শেখার দরকার নেই (deprecated)

---

## ৭. Practice Exercises (অনুশীলন)

### Exercise 1: Installation যাচাই
1. Terminal খুলে Python version চেক করুন
2. pip version চেক করুন
3. REPL চালু করে `2 + 2` calculate করুন

### Exercise 2: প্রথম Program
1. `greeting.py` নামে একটি file তৈরি করুন
2. আপনার নাম এবং শহর print করুন
3. File টি run করুন

**Expected Output:**
```
My name is Ripon
I live in Dhaka
```

### Exercise 3: REPL Practice
REPL এ নিচের কাজগুলো করুন:
1. `10 * 5` calculate করুন
2. `"Python".lower()` execute করুন
3. `len("Bangladesh")` এর output দেখুন

### Exercise 4: Comments
নিচের code এ appropriate comments যোগ করুন:
```python
name = "Ripon"
age = 25
birth_year = 2026 - age
print(f"{name} was born in {birth_year}")
```

### Exercise 5: Docstring
একটি function লিখুন যা দুইটি সংখ্যা বিয়োগ করে এবং proper docstring যোগ করুন।

---

## ৮. Common Beginner Mistakes (সাধারণ ভুল)

### ভুল ১: PATH সেট না করা
**সমস্যা:** `python` command কাজ করছে না  
**সমাধান:** Python reinstall করুন এবং "Add to PATH" টিক দিন

### ভুল ২: Wrong Python version
**সমস্যা:** Python 2 syntax ব্যবহার করছেন  
**সমাধান:** `python3` command ব্যবহার করুন এবং Python 3 syntax শিখুন

### ভুল ৩: File naming issues
**সমস্যা:** `test.py` নামে file তৈরি করেছেন যা built-in module এর সাথে conflict করছে  
**সমাধান:** Descriptive এবং unique নাম ব্যবহার করুন

### ভুল ৪: Indentation errors
**সমস্যা:** অপ্রয়োজনীয় space বা tab  
**সমাধান:** VS Code এর auto-formatting ব্যবহার করুন

### ভুল ৫: Case sensitivity
**সমস্যা:** `Print("Hello")` লিখেছেন (capital P)  
**সমাধান:** Python case-sensitive, সঠিক spelling: `print()`

---

## ৯. Troubleshooting Guide

### সমস্যা: "python is not recognized"
```
'python' is not recognized as an internal or external command
```
**সমাধান:**
1. Python PATH এ আছে কিনা চেক করুন
2. `python3` command try করুন
3. Python reinstall করুন with "Add to PATH"

### সমস্যা: "No module named pip"
**সমাধান:**
```bash
python -m ensurepip --upgrade
```

### সমস্যা: VS Code এ Python extension কাজ করছে না
**সমাধান:**
1. Extension uninstall করে আবার install করুন
2. VS Code restart করুন
3. Python interpreter select করুন: `Ctrl+Shift+P` → "Python: Select Interpreter"

### সমস্যা: Permission denied (Linux/Mac)
**সমাধান:**
```bash
sudo chown -R $USER:$USER /path/to/directory
```

---

## ১০. Useful Resources (দরকারি রিসোর্স)

### Official Documentation:
- [Python.org Documentation](https://docs.python.org/3/)
- [PEP 8 - Style Guide](https://pep8.org/)
- [PEP 257 - Docstring Conventions](https://www.python.org/dev/peps/pep-0257/)

### Practice Platforms:
- [HackerRank Python](https://www.hackerrank.com/domains/python)
- [LeetCode](https://leetcode.com/)
- [Codewars](https://www.codewars.com/)

### Bangla Resources:
- [Python Bangla Tutorial - YouTube](https://www.youtube.com/)
- [Stack Learner](https://stacklearner.com/)

---

::: tip পরবর্তী ধাপ
এখন আপনি Python এর basic setup এবং environment সম্পর্কে জানেন। পরবর্তী অধ্যায়ে আমরা শিখবো **Variables & Data Types** - যা দিয়ে আমরা data store এবং manipulate করতে পারবো।

**শিখবো:**
- Variables কি এবং কীভাবে তৈরি করতে হয়
- বিভিন্ন Data Types (int, float, string, boolean)
- Type conversion
- Input নেওয়া এবং Output দেওয়া
:::

---

::: warning মনে রাখবেন
- প্রতিদিন একটু একটু practice করুন
- Error দেখে ভয় পাবেন না - এটি শেখার অংশ
- Documentation পড়ার অভ্যাস করুন
- Community তে active থাকুন (Stack Overflow, Reddit)
:::
