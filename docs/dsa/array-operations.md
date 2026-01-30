# 8. Array Operations

অ্যারের ওপর বিভিন্ন ধরণের অপারেশন চালানো হয়। এই অপারেশনগুলোর লজিক এবং কমপ্লেক্সিটি বোঝা অত্যন্ত জরুরি। সব উদাহরণ এখানে **Java** এবং **Python** এ দেওয়া হলো।

## ১. ইনসার্শন (Insertion)

অ্যারেতে নতুন এলিমেন্ট যোগ করা।

### শুরুতে যোগ করা (At Beginning)

সব এলিমেন্টকে এক ঘর ডানে সরাতে হয়।

- **Time Complexity:** O(n)

#### Java Implementation

```java
public void insertAtBeginning(int[] arr, int size, int element) {
    for (int i = size; i > 0; i--) {
        arr[i] = arr[i - 1];
    }
    arr[0] = element;
}
```

#### Python Implementation

```python
def insert_at_beginning(arr, element):
    arr.insert(0, element)
```

### শেষে যোগ করা (At End)

যদি জায়গা থাকে, তবে সরাসরি শেষে বসানো যায়।

- **Time Complexity:** O(1)

### যেকোনো পজিশনে (At Position)

নির্দিষ্ট ইন্ডেক্সের পরের সব এলিমেন্টকে ডানে সরাতে হয়।

- **Time Complexity:** O(n)

---

## ২. ডিলিশন (Deletion)

অ্যারে থেকে এলিমেন্ট রিমুভ করা।

### নির্দিষ্ট পজিশন থেকে (At Position)

এলিমেন্ট রিমুভ করার পর ডানের সব এলিমেন্টকে এক ঘর বামে সরাতে হয়।

- **Time Complexity:** O(n)

#### Java Implementation

```java
public void deleteAtPos(int[] arr, int size, int pos) {
    for (int i = pos; i < size - 1; i++) {
        arr[i] = arr[i + 1];
    }
}
```

#### Python Implementation

```python
def delete_at_pos(arr, pos):
    if 0 <= pos < len(arr):
        arr.pop(pos)
```

---

## ৩. সার্চিং (Searching - Linear Search)

অ্যারের প্রতিটি এলিমেন্ট চেক করে নির্দিষ্ট ভ্যালু খুঁজে বের করা।

- **Time Complexity:** O(n)

#### Java Implementation

```java
public int linearSearch(int[] arr, int target) {
    for (int i = 0; i < arr.length; i++) {
        if (arr[i] == target) return i;
    }
    return -1;
}
```

#### Python Implementation

```python
def linear_search(arr, target):
    for i in range(len(arr)):
        if arr[i] == target:
            return i
    return -1
```

---

## ৪. রিভার্সিং (Reversing Array)

অ্যারের এলিমেন্টগুলোকে উল্টো করে সাজানো।

- **Time Complexity:** O(n)

#### Java Implementation

```java
public void reverse(int[] arr) {
    int start = 0, end = arr.length - 1;
    while (start < end) {
        int temp = arr[start];
        arr[start] = arr[end];
        arr[end] = temp;
        start++;
        end--;
    }
}
```

#### Python Implementation

```python
def reverse_array(arr):
    arr.reverse() # or arr[::-1]
```

---

## ৫. অ্যারে রোটেশন (Array Rotation)

অ্যারের এলিমেন্টগুলোকে বামে বা ডানে শিফট করা।

### Left Rotation by 1

- **Time Complexity:** O(n)

---

## অপারেশন টাইম কমপ্লেক্সিটি সামারি

| Operation       | Time Complexity |
| :-------------- | :-------------- |
| Access          | O(1)            |
| Search (Linear) | O(n)            |
| Insertion       | O(n)            |
| Deletion        | O(n)            |

> [!CAUTION]
> অ্যারের সাইজ যদি বড় হয়, তবে ইনসার্শন বা ডিলিশন অনেক ধীর গতির হতে পারে। এই সমস্যা সমাধানের জন্য আমরা পরবর্তীতে **Linked List** শিখব।
