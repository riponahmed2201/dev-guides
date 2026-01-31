# Prefix Sum Technique

Prefix Sum হলো একটি অ্যারের প্রাক-প্রক্রিয়াকরণ (Preprocessing) কৌশল, যার মাধ্যমে আমরা অ্যারের নির্দিষ্ট রেঞ্জের যোগফল খুব দ্রুত বা $O(1)$ সময়ে বের করতে পারি।

## ১. প্রিফিক্স সাম অ্যারে (Prefix Sum Array)

একটি অ্যারে $A$-এর জন্য প্রিফিক্স সাম অ্যারে $P$ এমনভাবে তৈরি করা হয় যেখানে $P[i] = A[0] + A[1] + ... + A[i]$।

```java
public int[] buildPrefixSum(int[] arr) {
    int n = arr.length;
    int[] prefixSum = new int[n];
    prefixSum[0] = arr[0];
    for (int i = 1; i < n; i++) {
        prefixSum[i] = prefixSum[i - 1] + arr[i];
    }
    return prefixSum;
}
```

```python
def build_prefix_sum(arr):
    n = len(arr)
    prefix_sum = [0] * n
    prefix_sum[0] = arr[0]
    for i in range(1, n):
        prefix_sum[i] = prefix_sum[i-1] + arr[i]
    return prefix_sum
```

## ২. রেঞ্জ সাম কুয়েরি (Range Sum Queries)

যদি আমাদের কাছে প্রিফিক্স সাম অ্যারে থাকে, তবে আমরা যেকোনো রেঞ্জ $[L, R]$-এর যোগফল নিচের সূত্রে বের করতে পারি:

- $Sum(L, R) = P[R] - P[L-1]$ (যদি $L > 0$ হয়)
- $Sum(0, R) = P[R]$ (যদি $L = 0$ হয়)

## ৩. ইকুইলিব্রিয়াম ইনডেক্স (Equilibrium Index)

ইকুইলিব্রিয়াম ইনডেক্স হলো এমন একটি ইনডেক্স যার বাম পাশের এলিমেন্টগুলোর যোগফল এবং ডান পাশের এলিমেন্টগুলোর যোগফল সমান।

```python
def findEquilibrium(arr):
    total_sum = sum(arr)
    left_sum = 0
    for i, x in enumerate(arr):
        total_sum -= x
        if left_sum == total_sum:
            return i
        left_sum += x
    return -1
```

## ৪. সাব-অ্যারে সাম প্রবলেমস (Subarray Sum Problems)

প্রিফিক্স সাম ব্যবহার করে আমরা সহজেই এমন সাব-অ্যারে খুঁজে বের করতে পারি যার যোগফল একটি নির্দিষ্ট মান $K$-এর সমান।

## ৫. ২ডি প্রিফিক্স সাম (2D Prefix Sum)

ম্যাট্রিক্সের ক্ষেত্রেও প্রিফিক্স সাম ব্যবহার করা যায়। একে **Summed-area table** বলা হয়। এর মাধ্যমে ম্যাট্রিক্সের যেকোনো সাব-ম্যাট্রিক্সের যোগফল $O(1)$ সময়ে বের করা সম্ভব।

## ৬. অ্যাপ্লিকেশনস (Applications)

- **Range Sum Queries:** বারবার রেঞ্জ কুয়েরি করার প্রয়োজন হলে।
- **Image Processing:** ইমেজ ব্লারিং বা ফিল্টারিংয়ে।
- **Database Indexing:** দ্রুত ডেটা এগ্রিগেশনের জন্য।
- **Subarray Problems:** সাব-অ্যারে সংক্রান্ত বিভিন্ন জটিল সমস্যা সমাধানে।
