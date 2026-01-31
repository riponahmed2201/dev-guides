# String Pattern Matching

String Pattern Matching হলো একটি টেক্সটের (Text) মধ্যে নির্দিষ্ট একটি প্যাটার্ন (Pattern) খুঁজে বের করার প্রক্রিয়া। এটি সার্চ ইঞ্জিন, ডেটা মাইনিং এবং নেটওয়ার্ক সিকিউরিটিতে ব্যাপকভাবে ব্যবহৃত হয়।

## ১. নেভ প্যাটার্ন ম্যাচিং (Naive Pattern Matching)

এটি সবচেয়ে সহজ পদ্ধতি। এখানে প্যাটার্নটিকে টেক্সটের প্রতিটি পজিশনের সাথে মিলিয়ে দেখা হয়।

**Time Complexity:** $O(n \times m)$, যেখানে $n$ টেক্সটের দৈর্ঘ্য এবং $m$ প্যাটার্নের দৈর্ঘ্য।

```java
public void search(String text, String pat) {
    int n = text.length();
    int m = pat.length();
    for (int i = 0; i <= n - m; i++) {
        int j;
        for (j = 0; j < m; j++) {
            if (text.charAt(i + j) != pat.charAt(j)) break;
        }
        if (j == m) System.out.println("Pattern found at index " + i);
    }
}
```

```python
def naive_search(text, pat):
    n, m = len(text), len(pat)
    for i in range(n - m + 1):
        if text[i : i + m] == pat:
            print(f"Pattern found at index {i}")
```

## ২. কেএমপি অ্যালগরিদম (KMP Algorithm Basics)

KMP (Knuth-Morris-Pratt) অ্যালগরিদম নেভ পদ্ধতির চেয়ে দক্ষ কারণ এটি ইতিমধ্যে ম্যাচ হওয়া ক্যারেক্টারগুলোকে পুনরায় চেক করে না। এর মূল ভিত্তি হলো **LPS (Longest Proper Prefix which is also Suffix)** অ্যারে।

**Time Complexity:** $O(n + m)$

```python
def computeLPSArray(pat, m, lps):
    length = 0
    lps[0] = 0
    i = 1
    while i < m:
        if pat[i] == pat[length]:
            length += 1
            lps[i] = length
            i += 1
        else:
            if length != 0:
                length = lps[length-1]
            else:
                lps[i] = 0
                i += 1

def KMPSearch(pat, txt):
    m, n = len(pat), len(txt)
    lps = [0]*m
    computeLPSArray(pat, m, lps)
    i = j = 0
    while i < n:
        if pat[j] == txt[i]:
            i += 1
            j += 1
        if j == m:
            print(f"Found pattern at index {i-j}")
            j = lps[j-1]
        elif i < n and pat[j] != txt[i]:
            if j != 0:
                j = lps[j-1]
            else:
                i += 1
```

## ৩. রবিন-কার্প অ্যালগরিদম (Rabin-Karp Algorithm)

রবিন-কার্প অ্যালগরিদম **Hashing** এর মাধ্যমে প্যাটার্ন খুঁজে বের করে। যদি হ্যাশ ভ্যালু মিলে যায়, তবেই কেবল ক্যারেক্টার বাই ক্যারেক্টার চেক করা হয়। এর জন্য **Rolling Hash** ব্যবহৃত হয়।

**Average Time Complexity:** $O(n + m)$

## ৪. অ্যানাগ্রাম সার্চ (Anagram Search)

একটি টেক্সটের মধ্যে কোনো নির্দিষ্ট প্যাটার্নের অ্যানাগ্রাম (Anagram) আছে কিনা তা খুঁজে বের করা। এটি সাধারণত স্লাইডিং উইন্ডো এবং ফ্রিকোয়েন্সি অ্যারে (Frequency Array) দিয়ে করা হয়।

```python
def anagramSearch(txt, pat):
    n, m = len(txt), len(pat)
    if m > n: return

    countP, countT = [0]*256, [0]*256
    for i in range(m):
        countP[ord(pat[i])] += 1
        countT[ord(txt[i])] += 1

    for i in range(m, n):
        if countP == countT:
            print(f"Anagram found at index {i-m}")
        countT[ord(txt[i])] += 1
        countT[ord(txt[i-m])] -= 1

    if countP == countT:
        print(f"Anagram found at index {n-m}")
```

## স্ট্রিং ম্যাচিং এর ব্যবহার (Applications)

- **Search Engines:** টেক্সট সার্চ করার জন্য।
- **DNA Sequencing:** বায়োইনফরম্যাটিক্সে ডিএনএ প্যাটার্ন খোঁজার জন্য।
- **Plagiarism Detection:** লেখা নকল করা হয়েছে কিনা তা যাচাই করতে।
- **Intrusion Detection:** নেটওয়ার্ক প্যাকেট মনিটর করতে।
