# 11. Sliding Window - Basic

**Sliding Window** হলো এমন একটি টেকনিক যা সাধারণত অ্যার বা স্ট্রিংয়ের একটি নির্দিষ্ট অংশ বা "Window" নিয়ে কাজ করে। এটি নেস্টেড লুপের ব্যবহার কমিয়ে টাইম কমপ্লেক্সিটি অনেক উন্নত করতে পারে।

## উইন্ডোর প্রকারভেদ (Types of Window)

১. **Fixed Size Window:** উইন্ডোর আকার সব সময় একই থাকে (যেমন: k)।
২. **Variable Size Window:** শর্ত অনুযায়ী উইন্ডোর আকার ছোট বা বড় হতে পারে।

## ১. ম্যাক্সিমাম সাম সাব-অ্যারে (Maximum Sum Subarray of size k)

একটি নির্দিষ্ট আকার k এর সাব-অ্যারের মধ্যে সর্বোচ্চ যোগফল বের করা।

#### Java Implementation

```java
public int maxSum(int[] arr, int k) {
    int maxVal = 0, currentSum = 0;
    for (int i = 0; i < k; i++) {
        currentSum += arr[i];
    }
    maxVal = currentSum;
    for (int i = k; i < arr.length; i++) {
        currentSum += arr[i] - arr[i - k];
        maxVal = Math.max(maxVal, currentSum);
    }
    return maxVal;
}
```

#### Python Implementation

```python
def max_sum(arr, k):
    if len(arr) < k: return -1
    current_sum = sum(arr[:k])
    max_val = current_sum
    for i in range(k, len(arr)):
        current_sum += arr[i] - arr[i-k]
        max_val = max(max_val, current_sum)
    return max_val
```

---

## ২. ফার্স্ট নেগেটিভ ইন্টিজার (First Negative in every window of size k)

প্রতিটি k সাইজ উইন্ডোতে প্রথম প্রাপ্ত ঋণাত্মক সংখ্যাটি খুঁজে বের করা।

---

## ৩. ভ্যারিয়েবল উইন্ডো (Variable Size Window Example)

**সমস্যা:** এমন একটি ক্ষুদ্রতম সাব-অ্যারের সাইজ বের করুন যার যোগফল S এর সমান বা বড়।

#### Java Implementation

```java
public int minSubArrayLen(int target, int[] nums) {
    int left = 0, sum = 0, minLen = Integer.MAX_VALUE;
    for (int right = 0; right < nums.length; right++) {
        sum += nums[right];
        while (sum >= target) {
            minLen = Math.min(minLen, right - left + 1);
            sum -= nums[left++];
        }
    }
    return minLen == Integer.MAX_VALUE ? 0 : minLen;
}
```

#### Python Implementation

```python
def min_subarray_len(target, nums):
    left = current_sum = 0
    min_len = float('inf')
    for right in range(len(nums)):
        current_sum += nums[right]
        while current_sum >= target:
            min_len = min(min_len, right - left + 1)
            current_sum -= nums[left]
            left += 1
    return 0 if min_len == float('inf') else min_len
```

---

## স্লাইডিং উইন্ডো কখন ব্যবহার করবেন?

- যদি কোনো সমস্যায় "find longest/shortest/maximum/minimum Subarray or Substring" চাওয়া হয়।
- যদি ডেটাগুলো "contiguous" বা পরপর থাকতে হয়।

---

> [!IMPORTANT]
> স্লাইডিং উইন্ডো ব্যবহারে মেমরিতে কোনো অতিরিক্ত স্ট্রাকচার (যেমন: কিউ বা লিস্ট) লাগলে সেটির দিকে খেয়াল রাখতে হবে।

---

> [!TIP]
> Fixed window এর ক্ষেত্রে লুপ চালানোর সময় প্রথম উইন্ডোটি আলাদাভাবে ক্যালকুলেট করে নিলে কোড বুঝতে সহজ হয়।
