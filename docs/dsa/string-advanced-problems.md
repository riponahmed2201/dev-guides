# String Advanced Problems

স্ট্রিং-এর অ্যাডভান্সড প্রবলেমগুলো ইন্টারভিউতে খুব বেশি জিজ্ঞাসা করা হয়। এখানে আমরা কিছু জনপ্রিয় এবং জটিল প্রবলেম নিয়ে আলোচনা করব।

## ১. লংগেস্ট কমন প্রিফিক্স (Longest Common Prefix)

একাধিক স্ট্রিং-এর মধ্যে শুরু থেকে যে অংশটুকু কমন থাকে তাকেই Longest Common Prefix বলে।

```java
public String longestCommonPrefix(String[] strs) {
    if (strs.length == 0) return "";
    String prefix = strs[0];
    for (int i = 1; i < strs.length; i++) {
        while (strs[i].indexOf(prefix) != 0) {
            prefix = prefix.substring(0, prefix.length() - 1);
            if (prefix.isEmpty()) return "";
        }
    }
    return prefix;
}
```

```python
def longestCommonPrefix(strs):
    if not strs: return ""
    prefix = strs[0]
    for s in strs[1:]:
        while not s.startswith(prefix):
            prefix = prefix[:-1]
            if not prefix: return ""
    return prefix
```

## ২. লংগেস্ট প্যালিনড্রোমিক সাবস্ট্রিং (Longest Palindromic Substring)

একটি স্ট্রিং থেকে সবচেয়ে বড় যে সাবস্ট্রিংটি প্যালিনড্রোম (Palindrome), সেটি খুঁজে বের করা। এটি "Expand Around Center" পদ্ধতি দিয়ে খুব সহজে সমাধান করা যায়।

**Time Complexity:** $O(n^2)$

```python
def longestPalindrome(s):
    res = ""
    for i in range(len(s)):
        # Odd length
        tmp = expand(s, i, i)
        if len(tmp) > len(res): res = tmp
        # Even length
        tmp = expand(s, i, i + 1)
        if len(tmp) > len(res): res = tmp
    return res

def expand(s, l, r):
    while l >= 0 and r < len(s) and s[l] == s[r]:
        l -= 1
        r += 1
    return s[l+1:r]
```

## ৩. ওয়ার্ড ব্রেক প্রবলেম (Word Break Problem)

চেক করা যে একটি স্ট্রিং-কে কি ডিকশনারিতে থাকা শব্দগুলোর মাধ্যমে ছোট ছোট ভাগে ভাগ করা সম্ভব কি না। এটি ডাইনামিক প্রোগ্রামিং (DP) ব্যবহার করে সমাধান করা হয়।

## ৪. মিনিমাম উইন্ডো সাবস্ট্রিং (Minimum Window Substring)

একটি স্ট্রিংয়ের মধ্যে ক্ষুদ্রতম সেই সাবস্ট্রিংটি খুঁজে বের করা যার মধ্যে অন্য একটি স্ট্রিংয়ের সব ক্যারেক্টার বিদ্যমান। এটি "Sliding Window" টেকনিকের একটি দারুণ উদাহরণ।

```java
public String minWindow(String s, String t) {
    int[] count = new int[128];
    for (char c : t.toCharArray()) count[c]++;
    int from = 0, to = 0, minLen = Integer.MAX_VALUE, cnt = t.length(), start = 0;
    while (to < s.length()) {
        if (count[s.charAt(to++)]-- > 0) cnt--;
        while (cnt == 0) {
            if (to - from < minLen) {
                minLen = to - from;
                start = from;
            }
            if (count[s.charAt(from++)]++ == 0) cnt++;
        }
    }
    return minLen == Integer.MAX_VALUE ? "" : s.substring(start, start + minLen);
}
```

## ৫. লংগেস্ট সাবস্ট্রিং উইদাউট রিপিটিং (Longest Substring Without Repeating)

এমন একটি সাবস্ট্রিং খুঁজে বের করা যেখানে কোনো ক্যারেক্টার দুইবার নেই। এটি স্লাইডিং উইন্ডো এবং হ্যাশ ম্যাপ দিয়ে সমাধান করা হয়।

```python
def lengthOfLongestSubstring(s):
    char_map = {}
    left = max_len = 0
    for right in range(len(s)):
        if s[right] in char_map:
            left = max(left, char_map[s[right]] + 1)
        char_map[s[right]] = right
        max_len = max(max_len, right - left + 1)
    return max_len
```

## ৬. স্ট্রিং কমপ্রেশন (String Compression)

স্ট্রিংকে কম্প্রেস করা যেমন: "aaabb" -> "a3b2"। যদি কম্প্রেসড স্ট্রিং মূল স্ট্রিং থেকে বড় হয় তবে মূল স্ট্রিং রিটার্ন করতে হবে।

## ৭. ওয়াইল্ডকার্ড ম্যাচিং (Wildcard Matching - Intro)

স্ট্রিংয়ের সাথে প্যাটার্ন ম্যাচিং যেখানে '?' এবং '\*' এর মত স্পেশাল ক্যারেক্টার থাকে। এটি খুব জনপ্রিয় একটি অ্যাডভান্সড ডাইনামিক প্রোগ্রামিং প্রবলেম।
