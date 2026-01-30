# 15. Basic Searching

একটি ডাটা কালেকশন (যেমন: অ্যারে বা লিস্ট) থেকে নির্দিষ্ট কোনো ভ্যালু খুঁজে বের করার পদ্ধতিকেই সার্চিং বলে। ডাটা স্ট্রাকচারে সার্চিং অত্যন্ত কমন এবং গুরুত্বপূর্ণ একটি কাজ।

## ১. লিনিয়ার সার্চ (Linear Search)

এটি সার্চিংয়ের সবচেয়ে সহজ পদ্ধতি। এতে অ্যারের শুরু থেকে শেষ পর্যন্ত প্রতিটি এলিমেন্ট এক এক করে চেক করা হয়।

- **Time Complexity:** O(n)
- **Space Complexity:** O(1)
- **কখন ব্যবহার করবেন:** যখন ডাটা সর্টেড (সাজানো) থাকে না।

#### Java Implementation

```java
public int linearSearch(int[] arr, int target) {
    for (int i = 0; i < arr.length; i++) {
        if (arr[i] == target) return i;
    }
    return -1; // Not found
}
```

#### Python Implementation

```python
def linear_search(arr, target):
    for i in range(len(arr)):
        if arr[i] == target:
            return i
    return -1 # Not found
```

---

## ২. বাইনারি সার্চ (Binary Search Basics)

যদি ডাটা সর্টেড থাকে, তবে বাইনারি সার্চ সবচেয়ে কার্যকর। এটি প্রতি স্টেপে সার্চ এরিয়াকে অর্ধেক করে ফেলে।

- **Time Complexity:** O(log n)
- **Space Complexity:** O(1) (Iterative), O(log n) (Recursive side)
- **شرত (Condition):** ডাটা অবশ্যই সর্টেড থাকতে হবে।

#### Java Implementation (Iterative)

```java
public int binarySearch(int[] arr, int target) {
    int low = 0, high = arr.length - 1;
    while (low <= high) {
        int mid = low + (high - low) / 2;
        if (arr[mid] == target) return mid;
        if (arr[mid] < target) low = mid + 1;
        else high = mid - 1;
    }
    return -1;
}
```

#### Python Implementation (Iterative)

```python
def binary_search(arr, target):
    low, high = 0, len(arr) - 1
    while low <= high:
        mid = low + (high - low) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            low = mid + 1
        else:
            high = mid - 1
    return -1
```

---

## ৩. কমপ্লেক্সিটি তুলনা (Time Complexity Comparison)

| Algorithm     | Best Case | Worst Case | Space Complexity |
| :------------ | :-------- | :--------- | :--------------- |
| Linear Search | O(1)      | O(n)       | O(1)             |
| Binary Search | O(1)      | O(log n)   | O(1)             |

---

## ৪. সর্টেড অ্যারেতে সার্চ (Search in Sorted Array)

সর্টেড অ্যারে পেলে চোখ বন্ধ করে বাইনারি সার্চ চিন্তা করা বুদ্ধিমানের কাজ। এটি বড় ডাটা সেটে অনেক সময় বাঁচায়।

---

## ৫. রোটেটেড সর্টেড অ্যারে (Search in Rotated Array - Basic)

কখনো কখনো একটি সর্টেড অ্যারেকে কোনো একটি নির্দিষ্ট পয়েন্টে রোটেট করা থাকে (যেমন: `[4, 5, 6, 7, 0, 1, 2]`)। এখানেও বাইনারি সার্চের লজিক কিছুটা পরিবর্তন করে O(log n) এ সার্চ করা যায়।

#### Java Implementation

```java
public int searchRotated(int[] nums, int target) {
    int low = 0, high = nums.length - 1;
    while (low <= high) {
        int mid = low + (high - low) / 2;
        if (nums[mid] == target) return mid;

        // Left part is sorted
        if (nums[low] <= nums[mid]) {
            if (target >= nums[low] && target < nums[mid]) high = mid - 1;
            else low = mid + 1;
        }
        // Right part is sorted
        else {
            if (target > nums[mid] && target <= nums[high]) low = mid + 1;
            else high = mid - 1;
        }
    }
    return -1;
}
```

#### Python Implementation

```python
def search_rotated(nums, target):
    low, high = 0, len(nums) - 1
    while low <= high:
        mid = low + (high - low) // 2
        if nums[mid] == target:
            return mid

        if nums[low] <= nums[mid]:
            if target >= nums[low] and target < nums[mid]:
                high = mid - 1
            else:
                low = mid + 1
        else:
            if target > nums[mid] and target <= nums[high]:
                low = mid + 1
            else:
                high = mid - 1
    return -1
```

---

## ৬. প্রথম এবং শেষ অকারেন্স (First and Last Occurrence)

একটি সর্টেড অ্যারেতে একই সংখ্যা বার বার থাকলে তার প্রথম এবং শেষ পজিশন বের করা। এটি বাইনারি সার্চের একটি চমৎকার অ্যাপ্লিকেশন।

#### Java Implementation (First Occurrence)

```java
public int firstOccurrence(int[] arr, int x) {
    int low = 0, high = arr.length - 1, res = -1;
    while (low <= high) {
        int mid = low + (high - low) / 2;
        if (arr[mid] == x) {
            res = mid;
            high = mid - 1; // Look on left
        } else if (arr[mid] < x) low = mid + 1;
        else high = mid - 1;
    }
    return res;
}
```

#### Python Implementation (First Occurrence)

```python
def first_occurrence(arr, x):
    low, high = 0, len(arr) - 1
    res = -1
    while low <= high:
        mid = low + (high - low) // 2
        if arr[mid] == x:
            res = mid
            high = mid - 1
        elif arr[mid] < x:
            low = mid + 1
        else:
            high = mid - 1
    return res
```

---

> [!IMPORTANT]
> বাইনারি সার্চের `mid` ক্যালকুলেট করার সময় `(low + high) / 2` এর বদলে `low + (high - low) / 2` ব্যবহার করা নিরাপদ, যাতে ওভারফ্লো সমস্যা না হয়।

---

> [!TIP]
> সার্চিং রিলেটেড কোনো প্রবলেম পেলে আগে চেক করুন ডাটা সর্টেড কি না। সর্টেড থাকলে বাইনারি সার্চ দিয়ে শুরু করা প্রায় সবসময়ই সেরা পথ।
