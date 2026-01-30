# 13. String Operations

স্ট্রিংয়ের ওপর বিভিন্ন ধরণের ম্যানিপুলেশন বা অপারেশন চালানো ইন্টারভিউ এবং সমস্যা সমাধানের জন্য খুবই গুরুত্বপূর্ণ। সব উদাহরণ **Java** এবং **Python** এ দেওয়া হয়েছে।

## ১. ক্যারেক্টার এক্সেস এবং সাব-স্ট্রিং (Access & Substring)

স্ট্রিংয়ের নির্দিষ্ট ইনডেক্সের ক্যারেক্টার বের করা এবং কোনো একটি অংশ (Substring) কেটে নেওয়া।

#### Java Implementation

```java
String s = "Knowledge";
char ch = s.charAt(0); // 'K'
String sub = s.substring(0, 4); // "Know"
```

#### Python Implementation

```python
s = "Knowledge"
ch = s[0] # 'K'
sub = s[0:4] # "Know"
```

---

## ২. স্ট্রিং রিভার্স (String Reversal)

স্ট্রিংকে উল্টো করা। এটি করার জন্য ২-পয়েন্টার টেকনিক বা বিল্ট-ইন মেথড ব্যবহার করা যায়।

#### Java Implementation

```java
public String reverse(String s) {
    return new StringBuilder(s).reverse().toString();
}
```

#### Python Implementation

```python
def reverse_str(s):
    return s[::-1]
```

---

## ৩. প্যালিনড্রোম চেক (Palindrome Check)

যদি কোনো স্ট্রিং সোজা এবং উল্টো করলে একই থাকে (যেমন: "madam"), তাকে প্যালিনড্রোম বলে।

#### Java Implementation

```java
public boolean isPalindrome(String s) {
    int i = 0, j = s.length() - 1;
    while (i < j) {
        if (s.charAt(i++) != s.charAt(j--)) return false;
    }
    return true;
}
```

#### Python Implementation

```python
def is_palindrome(s):
    return s == s[::-1]
```

---

## ৪. ক্যারেক্টার ফ্রিকোয়েন্সি (Frequency Count)

একটি স্ট্রিংয়েনে কোন ক্যারেক্টার কতবার আছে তা বের করা।

#### Java Implementation

```java
public void countFreq(String s) {
    int[] count = new int[256];
    for (char c : s.toCharArray()) count[c]++;
}
```

#### Python Implementation

```python
from collections import Counter
def count_freq(s):
    return Counter(s)
```

---

## ৫. অ্যানাগ্রাম চেক (Anagram Check)

দুটি স্ট্রিং অ্যানাগ্রাম কিনা (অর্থাৎ দুটিতেই একই ক্যারেক্টার একই সংখ্যক বার আছে কিনা)। যেমন: "listen" এবং "silent"।

#### Java Implementation

```java
public boolean isAnagram(String s1, String s2) {
    if (s1.length() != s2.length()) return false;
    char[] c1 = s1.toCharArray();
    char[] c2 = s2.toCharArray();
    java.util.Arrays.sort(c1);
    java.util.Arrays.sort(c2);
    return java.util.Arrays.equals(c1, c2);
}
```

#### Python Implementation

```python
def is_anagram(s1, s2):
    return sorted(s1) == sorted(s2)
```

---

## ৬. কেস কনভার্সন (Case Conversion)

বড় হাত থেকে ছোট হাত বা তার উল্টোটা করা।

#### Java Implementation

```java
String upper = "test".toUpperCase(); // "TEST"
String lower = "TEST".toLowerCase(); // "test"
```

#### Python Implementation

```python
upper = "test".upper() # "TEST"
lower = "test".lower() # "test"
```

---

> [!IMPORTANT]
> অ্যানাগ্রাম চেকের ক্ষেত্রে সর্টিং করার কমপ্লেক্সিটি O(n log n)। ফ্রিকোয়েন্সি অ্যারে ব্যবহার করে এটি O(n) এ করা সম্ভব।

---

> [!TIP]
> প্যাটার্ন সার্চিংয়ের মতো জটিল অপারেশনের জন্য পরবর্তীতে আমরা **KMP Algorithm** বা **Z-Algorithm** শিখব।
