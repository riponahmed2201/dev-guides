# Kadane's Algorithm

Kadane's Algorithm হলো একটি ডাইনামিক প্রোগ্রামিং (DP) ভিত্তিক পদ্ধতি যার মাধ্যমে কোনো অ্যারের মধ্যে সর্বোচ্চ যোগফল বিশিষ্ট সাব-অ্যারে (Maximum Subarray Sum) খুঁজে বের করা হয়।

## ১. সর্বোচ্চ সাব-অ্যারে সাম (Maximum Subarray Sum)

এই সমস্যায় আমাদের এমন একটি সাব-অ্যারে খুঁজতে হয় যার এলিমেন্টগুলোর যোগফল সর্বোচ্চ হয়।

**Time Complexity:** $O(n)$
**Space Complexity:** $O(1)$

```java
public int maxSubArray(int[] nums) {
    int maxSoFar = nums[0];
    int currentMax = nums[0];
    for (int i = 1; i < nums.length; i++) {
        currentMax = Math.max(nums[i], currentMax + nums[i]);
        maxSoFar = Math.max(maxSoFar, currentMax);
    }
    return maxSoFar;
}
```

```python
def max_subarray(nums):
    max_so_far = nums[0]
    current_max = nums[0]
    for i in range(1, len(nums)):
        current_max = max(nums[i], current_max + nums[i])
        max_so_far = max(max_so_far, current_max)
    return max_so_far
```

## ২. অ্যালগরিদম ব্যাখ্যা (Algorithm Explanation)

কাদানে'স অ্যালগরিদম প্রতিটি ইনডেক্সে দাঁড়িয়ে দুটি সিদ্ধান্ত নেয়:

1. আগের সাব-অ্যারের যোগফলের সাথে বর্তমান এলিমেন্ট যুক্ত করবে।
2. অথবা বর্তমান এলিমেন্ট থেকেই নতুন সাব-অ্যারে শুরু করবে।

সূত্র: `currentMax = max(arr[i], currentMax + arr[i])`

## ৩. সার্কুলার অ্যারে ভ্যারিয়েশন (Variations - Circular Array)

সার্কুলার অ্যারের ক্ষেত্রে সর্বোচ্চ যোগফল বের করার জন্য আমাদের দুটি কেস চেক করতে হয়:

- **Case 1:** স্বাভাবিক সর্বোচ্চ যোগফল (Standard Kadane's)।
- **Case 2:** সার্কুলার সর্বোচ্চ যোগফল (Total Sum - Minimum Subarray Sum)।

## ৪. সর্বোচ্চ প্রোডাক্ট সাব-অ্যারে (Maximum Product Subarray)

যোগফলের পরিবর্তে গুণফলের ক্ষেত্রে আমাদের পজিটিভ এবং নেগেটিভ উভয় ভ্যালু ট্র্যাক করতে হয় (কারণ দুটি নেগেটিভ সংখ্যা মিলে পজিটিভ হতে পারে)।

```python
def maxProduct(nums):
    res = max(nums)
    curMin, curMax = 1, 1
    for n in nums:
        if n == 0:
            curMin, curMax = 1, 1
            continue
        tmp = curMax * n
        curMax = max(n * curMax, n * curMin, n)
        curMin = min(tmp, n * curMin, n)
        res = max(res, curMax)
    return res
```

## ৫. অ্যাপ্লিকেশনস (Applications)

- **Stock Market Analysis:** কোনো নির্দিষ্ট সময়ে সর্বোচ্চ লাভ খুঁজে বের করতে।
- **Computer Vision:** ইমেজের নির্দিষ্ট অংশ (Maximum Intensity) শনাক্ত করতে।
- **Data Mining:** বিশাল ডেটাসেট থেকে গুরুত্বপূর্ণ প্যাটার্ন আইডেন্টিফাই করতে।
- **Genomic Sequence Analysis:** ডিএনএ সিকুয়েন্সে গুরুত্বপূর্ণ সেগমেন্ট খুঁজতে।
