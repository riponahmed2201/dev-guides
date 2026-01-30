# 12. Strings - Basics

অ্যারের পরেই সবচেয়ে গুরুত্বপূর্ণ ডেটা স্ট্রাকচার হলো **String**। প্রোগ্রামিংয়ে টেক্সট বা অক্ষর (Character) নিয়ে কাজ করার জন্য এটি ব্যবহৃত হয়।

## 1. স্ট্রিং কি? (What is a String?)

সহজ কথায়, স্ট্রিং হলো একগুচ্ছ ক্যারেক্টার বা অক্ষরের সমাহার। যেমন: `"Hello"` একটি স্ট্রিং যা `'H', 'e', 'l', 'l', 'o'` নিয়ে গঠিত।

## 2. String vs Character Array

| Feature        | Character Array         | String                                                        |
| :------------- | :---------------------- | :------------------------------------------------------------ |
| **Type**       | Primitive/Array         | Object/Class (Java), Primitive-like (Python)                  |
| **Mutability** | Mutable (পরিবর্তনযোগ্য) | Immutable (Java/Python এ একবার তৈরি করলে পরিবর্তন করা যায় না) |
| **Size**       | নির্দিষ্ট সাইজ থাকে।    | ডাইনামিকালি সাইজ বাড়ে।                                        |

## 3. ডিক্লারেশন এবং লেন্থ (Declaration & Length)

#### Java Implementation

```java
String str = "Antigravity";
int len = str.length(); // 11
```

#### Python Implementation

```python
str = "Antigravity"
len_str = len(str) # 11
```

---

## 4. স্ট্রিং ট্রাভার্সাল (String Traversal)

স্ট্রিংয়ের প্রতিটি ক্যারেক্টার এক এক করে ভিজিট করা।

#### Java Implementation

```java
for (int i = 0; i < str.length(); i++) {
    char ch = str.charAt(i);
    System.out.println(ch);
}
```

#### Python Implementation

```python
for char in str:
    print(char)
```

---

## 5. কনক্যাটিনেশন (Concatenation)

দুটি বা ততোধিক স্ট্রিংকে জোড়া দেওয়া।

#### Java Implementation

```java
String s1 = "Hello";
String s2 = "World";
String result = s1 + " " + s2; // "Hello World"
```

#### Python Implementation

```python
s1 = "Hello"
s2 = "World"
result = s1 + " " + s2 # "Hello World"
```

---

## 6. স্ট্রিং কম্পারিজন (String Comparison)

দুটি স্ট্রিং একই কিনা তা চেক করা।

#### Java Implementation

```java
String a = "test";
String b = "test";
if (a.equals(b)) {
    System.out.println("Equal");
}
```

#### Python Implementation

```python
a = "test"
b = "test"
if a == b:
    print("Equal")
```

---

## 7. ইমিউটেবিলিটি (Immutability)

স্ট্রিং **Immutable** মানে হলো, একবার স্ট্রিং তৈরি করার পর এর ভিতরের কোনো ক্যারেক্টার সরাসরি পরিবর্তন করা যায় না। যদি পরিবর্তন করতে চান, তবে একটি নতুন স্ট্রিং তৈরি হবে।

- **Java:** `StringBuilder` বা `StringBuffer` ব্যবহার করে পরিবর্তনযোগ্য (Mutable) স্ট্রিং পাওয়া যায়।
- **Python:** স্ট্রিংকে লিস্টে কনভার্ট করে কাজ করা হয় অথবা স্লাইসিং ব্যবহার করা হয়।

---

> [!IMPORTANT]
> জাভাতে রিফারেন্স চেক করতে `==` এবং কন্টেন্ট চেক করতে `.equals()` ব্যবহার করা জরুরি।

---

> [!TIP]
> যখন স্ট্রিং এ অনেক বেশি কনক্যাটিনেশন করতে হয়, তখন পারফরম্যান্সের জন্য জাভাতে `StringBuilder` ব্যবহার করা বুদ্ধিমানের কাজ।
