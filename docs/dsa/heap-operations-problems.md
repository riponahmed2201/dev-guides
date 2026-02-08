# Heap Operations & Problems

Heap ডেটা স্ট্রাকচার শুধুমাত্র ডেটা স্টোর করার জন্য নয়, এটি অনেক জটিল সমস্যার সহজ সমাধান দিতে পারে। এই সেকশনে আমরা হিপ-এর বিভিন্ন অপারেশন এবং কিছু জনপ্রিয় ইন্টারভিউ প্রবলেম নিয়ে আলোচনা করব।

---

## ১. মূল অপারেশনসমূহ (Core Operations)

হিপ-এর দুটি প্রধান অপারেশন হলো **Insertion** এবং **Deletion**।

### Insert Element

নতুন কোনো এলিমেন্ট হিপ-এ যোগ করার সময়:

1. এলিমেন্টটি অ্যারের শেষে যোগ করা হয়।
2. এরপর **Heapify-Up** (বা Bubble-up) এর মাধ্যমে তাকে সঠিক পজিশনে নিয়ে যাওয়া হয়।

**টাইম কমপ্লেক্সিটি:** O(log N)

### Delete Element (Extract Max/Min)

রুট থেকে ম্যাক্সিমাম বা মিনিমাম এলিমেন্ট রিমুভ করার সময়:

1. রুট এলিমেন্টটি সরিয়ে নেওয়া হয়।
2. অ্যারের শেষ এলিমেন্টটিকে রুটে বসানো হয়।
3. এরপর **Heapify-Down** এর মাধ্যমে তাকে সঠিক পজিশনে নামিয়ে আনা হয়।

**টাইম কমপ্লেক্সিটি:** O(log N)

---

## ২. Heap Sort (হিপ সর্ট)

Heap Sort হলো একটি Comparison-based sorting algorithm যা হিপ ডেটা স্ট্রাকচার ব্যবহার করে।

### ধাপসমূহ:

1. প্রথমে ইনপুট অ্যারে থেকে একটি **Max Heap** তৈরি করা হয় (O(n))।
2. রুটে থাকা সবথেকে বড় এলিমেন্টটিকে অ্যারের শেষের এলিমেন্টের সাথে সোয়াপ করা হয়।
3. হিপের সাইজ ১ কমিয়ে রুটে **Heapify** চালানো হয়।
4. এই প্রসেসটি বারবার চালানো হয় যতক্ষণ না সব এলিমেন্ট সর্ট হয়।

**টাইম কমপ্লেক্সিটি:** O(n log n)  
**স্পেস কমপ্লেক্সিটি:** O(1) (In-place)

---

## ৩. K-th Largest/Smallest Element

অ্যারের K-তম বড় বা ছোট সংখ্যা বের করার জন্য হিপ খুবই কার্যকর।

- **K-th Smallest:** একটি Max Heap তৈরি করুন যার সাইজ হবে K। যদি বর্তমান এলিমেন্ট রুটের চেয়ে ছোট হয়, তবে রুট সরিয়ে নতুন এলিমেন্ট ইনসার্ট করুন। শেষে রুটে থাকবে K-তম ছোট সংখ্যা।
- **K-th Largest:** একটি Min Heap ব্যবহার করে একই পদ্ধতিতে কাজ করুন।

**টাইম কমপ্লেক্সিটি:** O(N log K)

---

## ৪. Merge K Sorted Arrays

ধরি আপনার কাছে $K$ সংখ্যক সর্টেড অ্যারে আছে, যাদের প্রতিটি $N$ সাইজের। তাদের মার্জ করার সহজ উপায় হলো হিপ ব্যবহার করা।

1. প্রতিটি অ্যারের প্রথম এলিমেন্টটি একটি **Min Heap** এ রাখুন (ভ্যালু এবং কোন অ্যারের তা ট্র্যাক রাখতে)।
2. হিপ থেকে মিনিমাম এলিমেন্ট বের করে রেজাল্ট অ্যারেতে নিন।
3. যেই অ্যারে থেকে এলিমেন্টটি এসেছে, তার পরবর্তী এলিমেন্টটি হিপ-এ ইনসার্ট করুন।
4. হিপ খালি না হওয়া পর্যন্ত এটি চালান।

**টাইম কমপ্লেক্সিটি:** O(N\*K log K)

---

## ৫. Median from Data Stream (Two Heaps Approach)

একটি রানিং ডেটা স্ট্রিম থেকে মিডিয়ান (মধ্যক) বের করার জন্য দুটি হিপ লাগে:

1. **Max Heap (left side):** ছোট অর্ধেক সংখ্যাগুলো রাখার জন্য।
2. **Min Heap (right side):** বড় অর্ধেক সংখ্যাগুলো রাখার জন্য।

**লজিক:**

- দুটি হিপের সাইজ যেন প্রায় সমান থাকে (পার্থক্য সর্বোচ্চ ১)।
- Max Heap এর সব এলিমেন্ট যেন Min Heap এর এলিমেন্ট থেকে ছোট হয়।
- মিডিয়ান হবে হয় কোনো একটির রুট, অথবা দুই রুটের গড়।

---

## ৬. Top K Frequent Elements

একটি অ্যারে থেকে সবথেকে বেশি বার আসা K টি সংখ্যা খুঁজে বের করা।

1. প্রথমে একটি **HashMap** বা ফ্রিকোয়েন্সি টেবিল তৈরি করুন (Value -> Frequency)।
2. একটি **Min Heap** এ ট্র্যভার্স করে ফ্রিকোয়েন্সি অনুযায়ী টপ K টি এলিমেন্ট ইনসার্ট করুন।

---

## ৭. কোড ইমপ্লিমেন্টেশন

### K-th Largest Element (Python)

```python
import heapq

def findKthLargest(nums, k):
    # Min Heap initialization
    min_heap = []

    for num in nums:
        heapq.heappush(min_heap, num)
        if len(min_heap) > k:
            heapq.heappop(min_heap)

    return min_heap[0] # Root of min-heap is the kth largest

# Example
nums = [3, 2, 3, 1, 2, 4, 5, 5, 6]
k = 4
print(f"{k}-th Largest:", findKthLargest(nums, k))
```

### Median from Data Stream (Java)

```java
import java.util.*;

class MedianFinder {
    private PriorityQueue<Integer> small = new PriorityQueue<>(Collections.reverseOrder()); // Max-heap
    private PriorityQueue<Integer> large = new PriorityQueue<>(); // Min-heap

    public void addNum(int num) {
        small.add(num);
        large.add(small.poll());
        if (small.size() < large.size()) {
            small.add(large.poll());
        }
    }

    public double findMedian() {
        if (small.size() > large.size()) return small.peek();
        return (small.peek() + large.peek()) / 2.0;
    }
}
```

---

## ৮. সামারি টেবিল

| সমস্যা             | ডেটা স্ট্রাকচার | কমপ্লেক্সিটি     |
| :----------------- | :-------------- | :--------------- |
| **K-th Element**   | Min/Max Heap    | O(N log K)       |
| **Merge K Arrays** | Min Heap        | O(NK log K)      |
| **Median Stream**  | Two Heaps       | O(log N) per add |
| **Top K Frequent** | HashMap + Heap  | O(N log K)       |
