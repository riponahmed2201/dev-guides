# Variables & Data Types (ভেরিয়েবল এবং ডেটা টাইপ)

Python এ কোনো ডেটা সেভ করে রাখার জন্য আমরা **Variables** ব্যবহার করি। এটি একটি বক্সের বা container এর মতো যেখানে আপনি আপনার প্রয়োজনীয় তথ্য জমা রাখতে পারেন এবং পরে ব্যবহার করতে পারেন।

---

## ১. Variables কি?

**Variable** হলো একটি নাম যা কম্পিউটারের মেমোরিতে একটি মান (value) সংরক্ষণ করে রাখে।

### মেমোরি কনসেপ্ট:

কল্পনা করুন আপনার কম্পিউটারের RAM হলো একটি বিশাল লকার রুম। প্রতিটি লকারে একটি নম্বর আছে (memory address)। Variable হলো সেই লকারের একটি সহজ নাম যা দিয়ে আপনি সহজেই আপনার জিনিস খুঁজে পাবেন।

```python
# Variable তৈরি করা
name = "Ripon"
age = 25

# এখানে কি হচ্ছে?
# 1. Python মেমোরিতে "Ripon" সংরক্ষণ করছে
# 2. সেই মেমোরি লোকেশনকে "name" নাম দিচ্ছে
# 3. একইভাবে 25 কে "age" নামে সংরক্ষণ করছে
```

---

## ২. Variables Declaration (ভেরিয়েবল তৈরি করা)

Python এ variable তৈরি করা অত্যন্ত সহজ। অন্যান্য ল্যাঙ্গুয়েজের মতো কোনো keyword (যেমন: `int`, `var`, `let`) লাগে না।

### Basic Syntax:
```python
variable_name = value
```

### উদাহরণ:
```python
# বিভিন্ন ধরনের variable
name = "Ripon Ahmed"
age = 25
height = 5.8
is_student = True
city = "Dhaka"
```

### Dynamic Typing:

Python একটি **dynamically typed** language। এর মানে হলো:
- Variable তৈরির সময় type বলে দিতে হয় না
- একই variable এ বিভিন্ন type এর value রাখা যায়

```python
x = 10          # x এখন integer
print(x)        # Output: 10

x = "Hello"     # এখন x হলো string
print(x)        # Output: Hello

x = 3.14        # এখন x হলো float
print(x)        # Output: 3.14
```

::: warning সতর্কতা
যদিও Python এ একই variable এ বিভিন্ন type রাখা যায়, তবে এটি **best practice নয়**। এতে code confusing হয়ে যায়।
:::

### Variable Reassignment:

```python
count = 0
print(count)    # Output: 0

count = count + 1
print(count)    # Output: 1

count += 1      # Shorthand
print(count)    # Output: 2
```

---

## ৩. Naming Rules এবং Conventions

### ৩.১ Naming Rules (অবশ্যই মানতে হবে)

#### ✅ সঠিক নাম:
```python
name = "Ripon"
age_2026 = 25
_private = "hidden"
user_name = "ripon123"
```

#### ❌ ভুল নাম:
```python
2name = "Ripon"        # সংখ্যা দিয়ে শুরু করা যাবে না
user-name = "ripon"    # হাইফেন ব্যবহার করা যাবে না
my name = "Ripon"      # space ব্যবহার করা যাবে না
class = "Python"       # reserved keyword ব্যবহার করা যাবে না
```

### ৩.২ Naming Rules সংক্ষেপে:

1. **শুরু হতে হবে:** অক্ষর (a-z, A-Z) বা underscore (`_`) দিয়ে
2. **থাকতে পারে:** অক্ষর, সংখ্যা (0-9), underscore
3. **Case-sensitive:** `Name`, `name`, `NAME` সব আলাদা
4. **Reserved keywords ব্যবহার করা যাবে না**

### ৩.৩ Python Reserved Keywords:

```python
# এই শব্দগুলো variable name হিসেবে ব্যবহার করা যাবে না
False      class      finally    is         return
None       continue   for        lambda     try
True       def        from       nonlocal   while
and        del        global     not        with
as         elif       if         or         yield
assert     else       import     pass
break      except     in         raise
```

### ৩.৪ Naming Conventions (Best Practices)

#### Snake Case (Python Standard - PEP 8):
```python
# ✅ Python এ এটি recommended
user_name = "ripon"
total_price = 1000
is_valid_email = True
```

#### Camel Case (অন্যান্য language এ ব্যবহৃত):
```python
# ❌ Python এ সাধারণত ব্যবহার করা হয় না
userName = "ripon"
totalPrice = 1000
```

#### Pascal Case (Class name এর জন্য):
```python
# ✅ শুধুমাত্র class name এর জন্য
class UserProfile:
    pass

class DatabaseConnection:
    pass
```

#### UPPER_CASE (Constants এর জন্য):
```python
# ✅ Constants এর জন্য
MAX_SIZE = 100
PI = 3.1416
DATABASE_URL = "localhost:5432"
```

### ৩.৫ Descriptive Names (বর্ণনামূলক নাম)

#### ✅ ভালো নাম - অর্থবহ এবং বোধগম্য:
```python
student_name = "Ripon"
total_marks = 450
average_temperature = 25.5
is_logged_in = True
```

#### ❌ খারাপ নাম - অস্পষ্ট:
```python
n = "Ripon"        # n মানে কি?
t = 450            # t কিসের জন্য?
avg = 25.5         # avg কিসের?
flag = True        # কোন flag?
```

#### ✅ আরও ভালো উদাহরণ:
```python
# একটি e-commerce application
product_name = "Laptop"
product_price = 50000
discount_percentage = 10
final_price = product_price - (product_price * discount_percentage / 100)
```

---

## ৪. Data Types (ডেটা টাইপ)

Python এ বিভিন্ন ধরনের data রাখার জন্য বিভিন্ন data type আছে। প্রধান ৪টি basic data type হলো:

### ৪.১ Integer (int) - পূর্ণসংখ্যা

Integer হলো পূর্ণসংখ্যা (দশমিক ছাড়া)।

```python
age = 25
year = 2026
temperature = -5
population = 170000000
```

#### Integer এর বিশেষত্ব:

**১. কোনো সীমা নেই:**
```python
# Python এ integer যত বড় হোক না কেন, handle করতে পারে
huge_number = 99999999999999999999999999999999999999
print(huge_number)
```

**২. বিভিন্ন Number System:**
```python
# Decimal (সাধারণ)
decimal = 100

# Binary (0b দিয়ে শুরু)
binary = 0b1010      # 10 in decimal
print(binary)        # Output: 10

# Octal (0o দিয়ে শুরু)
octal = 0o12         # 10 in decimal
print(octal)         # Output: 10

# Hexadecimal (0x দিয়ে শুরু)
hexadecimal = 0xA    # 10 in decimal
print(hexadecimal)   # Output: 10
```

**৩. Arithmetic Operations:**
```python
a = 10
b = 3

print(a + b)    # যোগ: 13
print(a - b)    # বিয়োগ: 7
print(a * b)    # গুণ: 30
print(a / b)    # ভাগ (float result): 3.3333...
print(a // b)   # Floor division (integer result): 3
print(a % b)    # Modulus (ভাগশেষ): 1
print(a ** b)   # Power (ঘাত): 1000
```

**৪. Underscore for Readability:**
```python
# বড় সংখ্যা পড়তে সহজ করার জন্য
population = 170_000_000
salary = 50_000
print(population)  # Output: 170000000
```

### ৪.২ Float - দশমিক সংখ্যা

Float হলো দশমিক যুক্ত সংখ্যা।

```python
height = 5.8
pi = 3.1416
temperature = -2.5
price = 99.99
```

#### Float এর বিশেষত্ব:

**১. Scientific Notation:**
```python
# খুব বড় বা ছোট সংখ্যার জন্য
speed_of_light = 3e8        # 3 × 10^8 = 300000000
electron_mass = 9.1e-31     # 9.1 × 10^-31
print(speed_of_light)       # Output: 300000000.0
```

**২. Precision Issues:**
```python
# Float এর একটি সমস্যা - precision
print(0.1 + 0.2)           # Output: 0.30000000000000004 (not exactly 0.3!)

# সমাধান: round() ব্যবহার করুন
result = 0.1 + 0.2
print(round(result, 2))    # Output: 0.3
```

**৩. Special Values:**
```python
# Infinity
positive_infinity = float('inf')
negative_infinity = float('-inf')

# Not a Number
not_a_number = float('nan')

print(positive_infinity)   # Output: inf
print(10 > positive_infinity)  # Output: False
```

**৪. Float Formatting:**
```python
pi = 3.1415926535

# বিভিন্ন উপায়ে format করা
print(f"{pi:.2f}")         # 2 decimal places: 3.14
print(f"{pi:.4f}")         # 4 decimal places: 3.1416
print(f"{pi:.0f}")         # No decimal: 3
```

### ৪.৩ String (str) - টেক্সট

String হলো text বা character এর sequence।

```python
name = "Ripon Ahmed"
city = 'Dhaka'
message = "Hello, World!"
```

#### String এর বিশেষত্ব:

**১. Single vs Double vs Triple Quotes:**
```python
# Single quotes
name = 'Ripon'

# Double quotes
city = "Dhaka"

# Triple quotes (multi-line)
address = """
House: 123
Road: 5
Dhaka, Bangladesh
"""

# Quote এর ভেতরে quote
message = "He said, 'Hello!'"
message2 = 'She said, "Hi!"'
```

**২. String Concatenation:**
```python
first_name = "Ripon"
last_name = "Ahmed"

# + operator দিয়ে
full_name = first_name + " " + last_name
print(full_name)  # Output: Ripon Ahmed

# * operator দিয়ে repeat
line = "-" * 20
print(line)  # Output: --------------------
```

**৩. String Indexing:**
```python
text = "Python"

# Positive indexing (শুরু থেকে)
print(text[0])    # P
print(text[1])    # y
print(text[5])    # n

# Negative indexing (শেষ থেকে)
print(text[-1])   # n
print(text[-2])   # o
```

**৪. String Slicing:**
```python
text = "Python Programming"

# [start:end] - end exclusive
print(text[0:6])      # Python
print(text[7:18])     # Programming

# Shortcuts
print(text[:6])       # Python (শুরু থেকে)
print(text[7:])       # Programming (শেষ পর্যন্ত)
print(text[:])        # Python Programming (পুরো string)

# Step
print(text[::2])      # Pto rgamn (প্রতি 2য় character)
print(text[::-1])     # gnimmargorP nohtyP (reverse)
```

**৫. Escape Characters:**
```python
# Special characters
print("Line 1\nLine 2")        # \n = new line
print("Tab\tSpace")            # \t = tab
print("He said, \"Hello!\"")   # \" = quote
print("Path: C:\\Users\\Ripon") # \\ = backslash
```

**৬. Raw Strings:**
```python
# Escape characters ignore করতে
path = r"C:\Users\Ripon\Documents"
print(path)  # Output: C:\Users\Ripon\Documents
```

**৭. String Methods:**
```python
text = "  Python Programming  "

# Case conversion
print(text.upper())        # PYTHON PROGRAMMING
print(text.lower())        # python programming
print(text.title())        # Python Programming
print(text.capitalize())   # Python programming

# Whitespace removal
print(text.strip())        # "Python Programming"
print(text.lstrip())       # "Python Programming  "
print(text.rstrip())       # "  Python Programming"

# Search and replace
print(text.replace("Python", "Java"))  # Java Programming
print(text.find("Programming"))        # 9 (index)
print(text.count("m"))                 # 2

# Split and join
words = "Python,Java,JavaScript".split(",")
print(words)  # ['Python', 'Java', 'JavaScript']

joined = "-".join(words)
print(joined)  # Python-Java-JavaScript

# Check methods
print("Python".startswith("Py"))   # True
print("Python".endswith("on"))     # True
print("123".isdigit())             # True
print("abc".isalpha())             # True
```

**৮. String Immutability:**
```python
# String immutable - পরিবর্তন করা যায় না
text = "Python"
# text[0] = "J"  # ❌ Error: 'str' object does not support item assignment

# নতুন string তৈরি করতে হবে
text = "J" + text[1:]
print(text)  # Jython
```

### ৪.৪ Boolean (bool) - সত্য/মিথ্যা

Boolean শুধুমাত্র দুটি value নিতে পারে: `True` বা `False`।

```python
is_student = True
is_adult = False
has_license = True
```

#### Boolean এর বিশেষত্ব:

**১. Comparison Operators:**
```python
age = 25

print(age > 18)      # True
print(age < 18)      # False
print(age == 25)     # True
print(age != 30)     # True
print(age >= 25)     # True
print(age <= 20)     # False
```

**২. Logical Operators:**
```python
age = 25
has_license = True

# and - দুটোই True হতে হবে
can_drive = age >= 18 and has_license
print(can_drive)  # True

# or - যেকোনো একটি True হলেই হবে
is_eligible = age > 60 or age < 18
print(is_eligible)  # False

# not - উল্টো করে দেয়
is_minor = not (age >= 18)
print(is_minor)  # False
```

**৩. Truthy এবং Falsy Values:**

Python এ কিছু value automatically `False` হিসেবে গণ্য হয়:

```python
# Falsy values
print(bool(0))          # False
print(bool(0.0))        # False
print(bool(""))         # False (empty string)
print(bool([]))         # False (empty list)
print(bool({}))         # False (empty dict)
print(bool(None))       # False

# Truthy values (বাকি সব)
print(bool(1))          # True
print(bool(-1))         # True
print(bool("Hello"))    # True
print(bool([1, 2]))     # True
```

**৪. Short-circuit Evaluation:**
```python
# and - প্রথমটি False হলে দ্বিতীয়টি check করে না
result = False and print("This won't print")

# or - প্রথমটি True হলে দ্বিতীয়টি check করে না
result = True or print("This won't print")
```

---

## ৫. Type Checking (টাইপ চেক করা)

### ৫.১ type() Function:

```python
name = "Ripon"
age = 25
height = 5.8
is_student = True

print(type(name))        # <class 'str'>
print(type(age))         # <class 'int'>
print(type(height))      # <class 'float'>
print(type(is_student))  # <class 'bool'>
```

### ৫.২ isinstance() Function:

```python
age = 25

# একটি type check করা
print(isinstance(age, int))     # True
print(isinstance(age, str))     # False

# একাধিক type check করা
value = 3.14
print(isinstance(value, (int, float)))  # True
```

### ৫.৩ id() Function - Memory Address:

```python
x = 10
y = 10
z = x

print(id(x))  # Memory address
print(id(y))  # Same address (Python optimizes small integers)
print(id(z))  # Same as x

# Check if same object
print(x is y)  # True
print(x is z)  # True
```

---

## ৬. Type Conversion (টাইপ পরিবর্তন)

### ৬.১ Implicit Conversion (Automatic):

Python নিজে থেকে কিছু conversion করে:

```python
# int + float = float
result = 10 + 5.5
print(result)        # 15.5
print(type(result))  # <class 'float'>

# Boolean to int
result = True + 5
print(result)        # 6 (True = 1, False = 0)
```

### ৬.২ Explicit Conversion (Manual):

#### int() - Integer এ convert:
```python
# String to int
x = "100"
y = int(x)
print(y)           # 100
print(type(y))     # <class 'int'>

# Float to int (decimal কেটে ফেলে)
z = int(3.99)
print(z)           # 3

# Boolean to int
print(int(True))   # 1
print(int(False))  # 0
```

#### float() - Float এ convert:
```python
# String to float
x = "3.14"
y = float(x)
print(y)           # 3.14

# Int to float
z = float(10)
print(z)           # 10.0
```

#### str() - String এ convert:
```python
# Int to string
age = 25
age_str = str(age)
print(age_str)     # "25"
print(type(age_str))  # <class 'str'>

# Float to string
pi = 3.14
pi_str = str(pi)
print(pi_str)      # "3.14"

# Boolean to string
print(str(True))   # "True"
```

#### bool() - Boolean এ convert:
```python
# Number to bool
print(bool(0))     # False
print(bool(1))     # True
print(bool(-5))    # True

# String to bool
print(bool(""))    # False (empty)
print(bool("Hi"))  # True
```

### ৬.৩ Conversion Errors:

```python
# Invalid conversion
try:
    x = int("Hello")  # ❌ ValueError
except ValueError as e:
    print(f"Error: {e}")

# Decimal string to int
try:
    y = int("3.14")   # ❌ ValueError
except ValueError:
    # সমাধান: প্রথমে float, তারপর int
    y = int(float("3.14"))
    print(y)  # 3
```

---

## ৭. Constants (ধ্রুবক)

Python এ সত্যিকারের constant নেই, কিন্তু naming convention দিয়ে বোঝানো হয়।

### ৭.১ Naming Convention:

```python
# ✅ Constants - UPPER_CASE এ লিখুন
PI = 3.1416
MAX_SIZE = 100
DATABASE_URL = "localhost:5432"
API_KEY = "abc123xyz"
```

### ৭.২ Best Practices:

```python
# Constants সাধারণত file এর শুরুতে define করা হয়
MAX_ATTEMPTS = 3
TIMEOUT_SECONDS = 30
DEFAULT_COLOR = "blue"

# ব্যবহার
attempts = 0
while attempts < MAX_ATTEMPTS:
    # কিছু কাজ
    attempts += 1
```

### ৭.৩ Configuration File:

```python
# config.py
DATABASE_HOST = "localhost"
DATABASE_PORT = 5432
DATABASE_NAME = "myapp"

MAX_UPLOAD_SIZE = 5 * 1024 * 1024  # 5 MB
ALLOWED_EXTENSIONS = ['jpg', 'png', 'pdf']
```

---

## ৮. Multiple Assignment (একসাথে অনেক ভেরিয়েবল)

### ৮.১ Basic Multiple Assignment:

```python
# একসাথে assign
a, b, c = 1, 2, 3
print(a, b, c)  # 1 2 3

# Same value to multiple variables
x = y = z = 0
print(x, y, z)  # 0 0 0
```

### ৮.২ Tuple Unpacking:

```python
# Tuple unpacking
person = ("Ripon", 25, "Dhaka")
name, age, city = person
print(name)  # Ripon
print(age)   # 25
print(city)  # Dhaka
```

### ৮.৩ Swapping Variables:

```python
# Traditional way (অন্যান্য language এ)
a = 5
b = 10
temp = a
a = b
b = temp
print(a, b)  # 10 5

# Python way (সহজ!)
a = 5
b = 10
a, b = b, a
print(a, b)  # 10 5
```

### ৮.৪ Extended Unpacking (Python 3+):

```python
# * দিয়ে বাকি সব নেওয়া
numbers = [1, 2, 3, 4, 5]
first, *middle, last = numbers
print(first)   # 1
print(middle)  # [2, 3, 4]
print(last)    # 5

# শুধু প্রথম এবং বাকি
head, *tail = numbers
print(head)    # 1
print(tail)    # [2, 3, 4, 5]
```

---

## ৯. Input এবং Output

### ৯.১ input() Function:

```python
# User থেকে input নেওয়া
name = input("আপনার নাম কি? ")
print(f"হ্যালো, {name}!")

# input() সবসময় string return করে
age = input("আপনার বয়স কত? ")
print(type(age))  # <class 'str'>
```

### ৯.২ Type Conversion with Input:

```python
# String to int
age = int(input("আপনার বয়স: "))
print(f"10 বছর পরে আপনার বয়স হবে: {age + 10}")

# String to float
height = float(input("আপনার উচ্চতা (feet): "))
print(f"Meter এ: {height * 0.3048:.2f}")

# Multiple inputs
name = input("নাম: ")
age = int(input("বয়স: "))
city = input("শহর: ")
print(f"{name}, {age} বছর, {city} থেকে")
```

### ৯.৩ Input Validation:

```python
# Error handling সহ input
while True:
    try:
        age = int(input("আপনার বয়স: "))
        if age < 0:
            print("বয়স ঋণাত্মক হতে পারে না!")
            continue
        break
    except ValueError:
        print("দয়া করে একটি সংখ্যা লিখুন!")

print(f"আপনার বয়স: {age}")
```

### ৯.৪ print() Advanced:

```python
# Multiple values
print("Name:", "Ripon", "Age:", 25)

# Separator পরিবর্তন
print("Python", "Java", "JavaScript", sep=" | ")
# Output: Python | Java | JavaScript

# End পরিবর্তন
print("Loading", end="...")
print("Done!")
# Output: Loading...Done!

# File এ print
with open("output.txt", "w") as f:
    print("Hello, File!", file=f)
```

---

## ১০. String Formatting (স্ট্রিং ফরম্যাটিং)

### ১০.১ f-strings (Python 3.6+) - Modern এবং Recommended:

```python
name = "Ripon"
age = 25
height = 5.8

# Basic f-string
message = f"My name is {name} and I am {age} years old."
print(message)

# Expressions inside f-strings
print(f"Next year I will be {age + 1} years old")
print(f"My height in cm: {height * 30.48:.2f}")

# Formatting numbers
price = 1234.5678
print(f"Price: {price:.2f} Taka")      # 1234.57
print(f"Price: {price:,.2f} Taka")     # 1,234.57 (comma separator)

# Padding and alignment
print(f"{'Left':<10}|")      # Left align
print(f"{'Right':>10}|")     # Right align
print(f"{'Center':^10}|")    # Center align
```

### ১০.২ .format() Method:

```python
name = "Ripon"
age = 25

# Positional arguments
message = "My name is {} and I am {} years old.".format(name, age)
print(message)

# Index-based
message = "I am {1} years old and my name is {0}.".format(name, age)
print(message)

# Named arguments
message = "My name is {n} and I am {a} years old.".format(n=name, a=age)
print(message)

# Number formatting
print("Price: {:.2f}".format(1234.5678))  # 1234.57
```

### ১০.৩ Old-style % Formatting:

```python
name = "Ripon"
age = 25

# % formatting (old, not recommended)
message = "My name is %s and I am %d years old." % (name, age)
print(message)

# %s = string, %d = integer, %f = float
print("Pi: %.2f" % 3.1416)  # 3.14
```

### ১০.৪ কোনটা ব্যবহার করবেন?

```python
# ✅ Modern Python (3.6+): f-strings ব্যবহার করুন
name = "Ripon"
print(f"Hello, {name}!")

# ✅ Python 3.0-3.5: .format() ব্যবহার করুন
print("Hello, {}!".format(name))

# ❌ Old style: এড়িয়ে চলুন
print("Hello, %s!" % name)
```

---

## ১১. Practice Exercises (অনুশীলন)

### Exercise 1: Variable Declaration
```python
# নিচের তথ্যগুলো variable এ সংরক্ষণ করুন:
# - আপনার নাম
# - বয়স
# - শহর
# - আপনি student কিনা (True/False)
# সব variable print করুন
```

### Exercise 2: Type Conversion
```python
# User থেকে দুটি সংখ্যা input নিন এবং যোগফল print করুন
# Hint: input() string return করে, int() এ convert করতে হবে
```

### Exercise 3: String Manipulation
```python
# একটি string নিন: "Python Programming"
# নিচের কাজগুলো করুন:
# 1. সব uppercase এ convert করুন
# 2. শুধু "Python" অংশটি slice করুন
# 3. String টি reverse করুন
```

### Exercise 4: Calculator
```python
# User থেকে দুটি সংখ্যা এবং একটি operator (+, -, *, /) নিন
# Calculation করে result দেখান
# f-string ব্যবহার করে সুন্দরভাবে format করুন
```

### Exercise 5: Temperature Converter
```python
# Celsius to Fahrenheit converter তৈরি করুন
# Formula: F = (C × 9/5) + 32
# User থেকে Celsius input নিন এবং Fahrenheit এ convert করে দেখান
```

### Exercise 6: Multiple Assignment
```python
# একটি line এ তিনটি variable (x, y, z) এ 10, 20, 30 assign করুন
# তারপর x এবং y এর মান swap করুন
# সব variable print করুন
```

---

## ১২. Common Mistakes (সাধারণ ভুল)

### ভুল ১: Variable name এ space
```python
# ❌ ভুল
user name = "Ripon"

# ✅ সঠিক
user_name = "Ripon"
```

### ভুল ২: Reserved keyword ব্যবহার
```python
# ❌ ভুল
class = "Python"
for = 10

# ✅ সঠিক
class_name = "Python"
count = 10
```

### ভুল ৩: Type mismatch
```python
# ❌ ভুল
age = "25"
next_year_age = age + 1  # Error: can't add string and int

# ✅ সঠিক
age = 25
next_year_age = age + 1

# অথবা
age = "25"
next_year_age = int(age) + 1
```

### ভুল ৪: String concatenation with number
```python
# ❌ ভুল
age = 25
message = "I am " + age + " years old"  # Error

# ✅ সঠিক - পদ্ধতি ১: Convert to string
message = "I am " + str(age) + " years old"

# ✅ সঠিক - পদ্ধতি ২: f-string (recommended)
message = f"I am {age} years old"
```

### ভুল ৫: Forgetting type conversion with input
```python
# ❌ ভুল
age = input("Age: ")
next_year = age + 1  # Error: string + int

# ✅ সঠিক
age = int(input("Age: "))
next_year = age + 1
```

### ভুল ৬: Case sensitivity
```python
Name = "Ripon"
print(name)  # ❌ Error: name is not defined

# Python case-sensitive, Name এবং name আলাদা
```

---

## ১৩. Best Practices (সেরা পদ্ধতি)

### ১. Meaningful Variable Names:
```python
# ❌ খারাপ
a = 50000
b = 10
c = a - (a * b / 100)

# ✅ ভালো
price = 50000
discount_percent = 10
final_price = price - (price * discount_percent / 100)
```

### ২. Use Constants for Fixed Values:
```python
# ✅ ভালো
PI = 3.1416
MAX_ATTEMPTS = 3

radius = 5
area = PI * radius ** 2
```

### ৩. One Variable, One Purpose:
```python
# ❌ খারাপ - একই variable বিভিন্ন কাজে
data = "Ripon"
print(data)
data = 25
print(data)

# ✅ ভালো - আলাদা variable
name = "Ripon"
age = 25
```

### ৪. Use f-strings for String Formatting:
```python
name = "Ripon"
age = 25

# ❌ পুরনো পদ্ধতি
message = "Name: " + name + ", Age: " + str(age)

# ✅ Modern পদ্ধতি
message = f"Name: {name}, Age: {age}"
```

### ৫. Type Hints (Python 3.5+):
```python
# Type hints যোগ করুন (optional কিন্তু helpful)
name: str = "Ripon"
age: int = 25
height: float = 5.8
is_student: bool = True

def greet(name: str) -> str:
    return f"Hello, {name}!"
```

---

## ১৪. Debugging Tips

### ১. type() দিয়ে check করুন:
```python
value = input("Enter a number: ")
print(f"Type: {type(value)}")  # Check করুন কোন type
```

### ২. print() দিয়ে debug করুন:
```python
x = 10
y = "20"
print(f"x: {x}, type: {type(x)}")
print(f"y: {y}, type: {type(y)}")
# result = x + y  # এখন বুঝবেন কেন error হচ্ছে
```

### ৩. repr() ব্যবহার করুন:
```python
# Hidden characters দেখার জন্য
text = "Hello\n"
print(text)       # Hello (newline দেখা যাবে না)
print(repr(text)) # 'Hello\n' (newline দেখা যাবে)
```

---

::: tip পরবর্তী ধাপ
এখন আপনি Python এর variables এবং data types সম্পর্কে ভালো ধারণা পেয়েছেন। পরবর্তী অধ্যায়ে আমরা শিখবো **Operators** - যা দিয়ে আমরা বিভিন্ন operation করতে পারবো।

**শিখবো:**
- Arithmetic operators (+, -, *, /, //, %, **)
- Comparison operators (==, !=, >, <, >=, <=)
- Logical operators (and, or, not)
- Assignment operators (=, +=, -=, etc.)
- Bitwise operators
:::

---

::: warning মনে রাখবেন
- Variable name সবসময় meaningful রাখুন
- input() থেকে পাওয়া data সবসময় string
- f-strings ব্যবহার করুন string formatting এর জন্য
- Type conversion করার সময় error handling করুন
- Constants UPPER_CASE এ লিখুন
:::
