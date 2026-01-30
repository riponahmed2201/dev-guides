# 10. Two Pointer Technique

**Two Pointer Technique** হলো অ্যারে বা লিস্টের সমস্যা সমাধানের একটি অত্যন্ত কার্যকর পদ্ধতি। এতে দুটি ভেরিয়েবল বা "Pointers" ব্যবহার করে অ্যারের বিভিন্ন পজিশনে নজর রাখা হয়। এটি সাধারণত টাইম কমপ্লেক্সিটি $O(n^2)$ থেকে $O(n)$ এ কমিয়ে আনতে সাহায্য করে।

## ২-পয়েন্টার অ্যাপ্রোচ (Approach)

সাধারণত দুই ধরণের ২-পয়েন্টার ব্যবহার করা হয়:

1. **Left & Right Pointer:** একটি শুরু থেকে এবং অন্যটি শেষ থেকে মাঝখানের দিকে আসে (সাধারণত সর্টেড অ্যারের ক্ষেত্রে)।
2. **Fast & Slow Pointer:** দুটিই শুরু থেকে শুরু হয় কিন্তু ভিন্ন গতিতে আগায় (এটি লিংকেড লিস্টে বেশি ব্যবহৃত হয়)।

## ১. পেয়ার সাম প্রবলেম (Pair Sum / Two Sum in Sorted Array)

একটি সর্টেড অ্যারে থেকে দুটি সংখ্যা খুঁজে বের করা যাদের যোগফল একটি নির্দিষ্ট সংখার সমান।

````carousel
```java
// Java Implementation
public int[] twoSum(int[] arr, int target) {
    int left = 0, right = arr.length - 1;
    while (left < right) {
        int sum = arr[left] + arr[right];
        if (sum == target) return new int[]{left, right};
        if (sum < target) left++;
        else right--;
    }
    return new int[]{-1, -1};
}
```
<!-- slide -->
```python
# Python Implementation
def two_sum(arr, target):
    left, right = 0, len(arr) - 1
    while left < right:
        current_sum = arr[left] + arr[right]
        if current_sum == target:
            return [left, right]
        elif current_sum < target:
            left += 1
        else:
            right -= 1
    return [-1, -1]
```
````

---

## ২. ডুপ্লিকেট রিমুভ করা (Remove Duplicates)

সর্টেড অ্যারে থেকে ডুপ্লিকেট মুছে ফেলার জন্য ২-পয়েন্টার খুব কার্যকর।

---

## ৩. কন্টেইনার উইথ মোস্ট ওয়াটার (Container with Most Water)

অনেকগুলো লাইনের মধ্যে দুটি লাইন বেছে নিতে হবে যাতে তাদের মাঝখানে সবচেয়ে বেশি পানি ধরে রাখা যায়।

- **Logic:** `left` এবং `right` পয়েন্টারের মধ্যে যেটির হাইট ছোট, সেটিকে সরাতে হবে।

````carousel
```java
// Java
public int maxArea(int[] height) {
    int maxArea = 0, l = 0, r = height.length - 1;
    while (l < r) {
        int h = Math.min(height[l], height[r]);
        maxArea = Math.max(maxArea, h * (r - l));
        if (height[l] < height[r]) l++;
        else r--;
    }
    return maxArea;
}
```
<!-- slide -->
```python
# Python
def max_area(height):
    max_area, l, r = 0, 0, len(height) - 1
    while l < r:
        h = min(height[l], height[r])
        max_area = max(max_area, h * (r - l))
        if height[l] < height[r]:
            l += 1
        else:
            r -= 1
    return max_area
```
````

---

## ৪. সর্ট কালারস (Sort Colors / Dutch National Flag)

০, ১ এবং ২ সমৃদ্ধ একটি অ্যারেকে সর্ট করা। এটি ৩-পয়েন্টার ব্যবহার করে $O(n)$ এ সমাধান করা যায়।

````carousel
```java
// Java - Dutch National Flag
public void sortColors(int[] nums) {
    int low = 0, mid = 0, high = nums.length - 1;
    while (mid <= high) {
        if (nums[mid] == 0) {
            swap(nums, low++, mid++);
        } else if (nums[mid] == 1) {
            mid++;
        } else {
            swap(nums, mid, high--);
        }
    }
}
```
<!-- slide -->
```python
# Python - Sort Colors
def sort_colors(nums):
    low, mid, high = 0, 0, len(nums) - 1
    while mid <= high:
        if nums[mid] == 0:
            nums[low], nums[mid] = nums[mid], nums[low]
            low += 1
            mid += 1
        elif nums[mid] == 1:
            mid += 1
        else:
            nums[mid], nums[high] = nums[high], nums[mid]
            high -= 1
```
````

---

> [!IMPORTANT]
> ২-পয়েন্টার টেকনিক ব্যবহারের প্রধান শর্ত হলো ডেটা সর্টেড থাকা (অধিকাংশ ক্ষেত্রে)।

---

> [!TIP]
> যদি কোনো অ্যারে প্রবলেমে নেস্টেড লুপ ($O(n^2)$) চলে আসে, তবে একবার চিন্তা করুন সেটি ২-পয়েন্টার দিয়ে $O(n)$ এ করা সম্ভব কি না।
