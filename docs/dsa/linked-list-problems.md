# 20. Linked List - Problems

লিঙ্কড লিস্টের কনসেপ্ট পরিষ্কার করার জন্য প্র্যাকটিক্যাল প্রবলেম সলভ করা জরুরি। এখানে ইন্টারভিউতে আসা জনপ্রিয় কিছু প্রবলেম এবং তাদের লজিক আলোচনা করা হলো।

---

## 1. লিঙ্কড লিস্ট রিভার্স করা (Reverse Linked List)

একটি লিঙ্কড লিস্টের সব নোডের লিঙ্ক উল্টে দেওয়া।

#### 🛠 কর্মপদ্ধতি (Step-by-Step Logic)

1. তিনটি পয়েন্টার নিন: `prev = null`, `curr = head`, এবং `next = null`।
2. লিস্টটি ট্রাভার্স করার সময় প্রতিটি নোডে:
   - `next`-কে `curr.next`-এ সেভ করুন।
   - `curr.next`-কে `prev`-এর দিকে পয়েন্ট করান (লিঙ্ক উল্টানো)।
   - `prev`-কে `curr` এবং `curr`-কে `next`-এ সরিয়ে নিন।
3. সবশেষে `head`-কে `prev`-এ আপডেট করুন।

#### Implementation

```java
// Java Reverse
public Node reverse(Node head) {
    Node prev = null, curr = head, next = null;
    while (curr != null) {
        next = curr.next;
        curr.next = prev;
        prev = curr;
        curr = next;
    }
    return prev;
}
```

```python
# Python Reverse
def reverse(head):
    prev, curr = None, head
    while curr:
        next_node = curr.next
        curr.next = prev
        prev = curr
        curr = next_node
    return prev
```

#### 📊 কমপ্লেক্সিটি অ্যানালাইসিস (Complexity Analysis)

- **Time Complexity: O(n)**
- **Space Complexity: O(1)**

---

## 2. সাইকেল ডিটেকশন (Detect Cycle - Floyd's Algorithm)

লিস্টের কোনো নোড কি পুনরায় আগের কোনো নোডকে পয়েন্ট করছে?

#### 🛠 কর্মপদ্ধতি (Step-by-Step Logic)

1. দুটি পয়েন্টার নিন: `slow` এবং `fast`। দুইজনেই শুরুতে `head`-এ থাকবে।
2. `slow` এক ঘর এবং `fast` দুই ঘর করে আগাতে থাকবে।
3. যদি তারা কোনো এক সময় মিলিত হয় (meet), তবে লিস্টে সাইকেল আছে।
4. যদি `fast` নাল (null) হয়ে যায়, তবে সাইকেল নেই।

#### Implementation

```java
// Java Cycle Detection
public boolean hasCycle(Node head) {
    Node slow = head, fast = head;
    while (fast != null && fast.next != null) {
        slow = slow.next;
        fast = fast.next.next;
        if (slow == fast) return true;
    }
    return false;
}
```

```python
# Python Cycle Detection
def has_cycle(head):
    slow, fast = head, head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
        if slow == fast: return True
    return False
```

#### 📊 কমপ্লেক্সিটি অ্যানালাইসিস (Complexity Analysis)

- **Time Complexity: O(n)**
- **Space Complexity: O(1)**

---

## 3. মিডল এলিমেন্ট খুঁজে বের করা (Find Middle Element)

#### 🛠 কর্মপদ্ধতি (Step-by-Step Logic)

- **Two Pointer approach:** `slow` এক ঘর এবং `fast` দুই ঘর করে আগাতে থাকুন। যখন `fast` লিস্টের শেষে পৌঁছাবে, তখন `slow` থাকবে ঠিক মাঝখানে।

#### Implementation

```java
// Java Find Middle
public Node findMiddle(Node head) {
    Node slow = head, fast = head;
    while (fast != null && fast.next != null) {
        slow = slow.next;
        fast = fast.next.next;
    }
    return slow;
}
```

```python
# Python Find Middle
def find_middle(head):
    slow, fast = head, head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
    return slow
```

---

## 4. ডুপ্লিকেট রিমুভ করা (Remove Duplicates)

#### 🛠 কর্মপদ্ধতি (Step-by-Step Logic) - Sorted List

1. বর্তমান নোড এবং তার পরের নোড তুলনা করুন।
2. যদি তারা এক হয়, তবে বর্তমান নোডের `next`-কে এক ঘর বাদ দিয়ে পরের নোডে পয়েন্ট করান।

#### Implementation

```java
// Java Remove Duplicates
public Node removeDuplicates(Node head) {
    Node curr = head;
    while (curr != null && curr.next != null) {
        if (curr.data == curr.next.data) curr.next = curr.next.next;
        else curr = curr.next;
    }
    return head;
}
```

```python
# Python Remove Duplicates
def remove_duplicates(head):
    curr = head
    while curr and curr.next:
        if curr.data == curr.next.data:
            curr.next = curr.next.next
        else:
            curr = curr.next
    return head
```

---

## 5. দুটি সর্টেড লিস্ট মার্চ করা (Merge Two Sorted Lists)

#### 🛠 কর্মপদ্ধতি (Step-by-Step Logic)

1. একটি ডামি (Dummy) নোড নিন এবং রেজাল্ট লিস্টটি সেখান থেকে শুরু করুন।
2. দুটি লিস্টের সামনের নোড তুলনা করুন। যেটির ভ্যালু ছোট, সেটিকে নতুন লিস্টে যোগ করুন এবং সেই প্রসংশিত লিস্টের হেড এক ঘর এগিয়ে নিন।
3. এভাবে চলতে থাকুন যতক্ষণ না কোনো একটি লিস্ট শেষ হয়।

#### Implementation

```java
// Java Merge
public Node mergeTwoLists(Node l1, Node l2) {
    Node dummy = new Node(0);
    Node curr = dummy;
    while (l1 != null && l2 != null) {
        if (l1.data < l2.data) {
            curr.next = l1;
            l1 = l1.next;
        } else {
            curr.next = l2;
            l2 = l2.next;
        }
        curr = curr.next;
    }
    if (l1 != null) curr.next = l1;
    if (l2 != null) curr.next = l2;
    return dummy.next;
}
```

```python
# Python Merge
def merge_two_lists(l1, l2):
    dummy = Node(0)
    curr = dummy
    while l1 and l2:
        if l1.data < l2.data:
            curr.next = l1
            l1 = l1.next
        else:
            curr.next = l2
            l2 = l2.next
        curr = curr.next
    curr.next = l1 or l2
    return dummy.next
```

---

## 6. প্যালিনড্রোম চেক (Palindrome Check)

#### 🛠 কর্মপদ্ধতি (Step-by-Step Logic)

1. মাঝখানের নোড খুঁজে বের করুন।
2. দ্বিতীয় অর্ধেক অংশটি রিভার্স (Reverse) করুন।
3. প্রথম অর্ধেক এবং দ্বিতীয় অর্ধেকের নোডগুলো এক এক করে তুলনা করুন।

---

## 7. ইন্টারসেকশন পয়েন্ট (Intersection Point)

দুটি লিঙ্কড লিস্ট এক জায়গায় মিলিত হয়েছে কি না তা বের করা।

#### 🛠 কর্মপদ্ধতি (Step-by-Step Logic)

1. দুটি লিস্টের লেন্থ (`L1` ও `L2`) বের করুন।
2. বড় লিস্টের হেডকে `|L1 - L2|` পরিমাণ আগিয়ে নিন যাতে তারা সমান দূরত্বে থাকে।
3. এবার দুই লিস্ট এক সাথে আগাতে থাকুন যতক্ষণ না একই নোড পাওয়া যায়।

---

## 8. শেষ থেকে N-তম নোড রিমুভ (Remove Nth node from end)

#### 🛠 কর্মপদ্ধতি (Step-by-Step Logic)

1. দুটি পয়েন্টার নিন: `first` এবং `second`।
2. `first`-কে N ঘর আগে আগিয়ে নিন।
3. এবার `first` এবং `second` একসাথে আগাতে থাকুন। যখন `first` শেষ নোডে পৌঁছাবে, তখন `second` থাকবে লক্ষ্য নোডের ঠিক আগে।
4. `second.next = second.next.next` করে নোডটি রিমুভ করুন।

#### Implementation

```java
// Java Remove Nth from End
public Node removeNthFromEnd(Node head, int n) {
    Node dummy = new Node(0);
    dummy.next = head;
    Node first = dummy, second = dummy;
    for (int i = 0; i <= n; i++) first = first.next;
    while (first != null) {
        first = first.next;
        second = second.next;
    }
    second.next = second.next.next;
    return dummy.next;
}
```

```python
# Python Remove Nth from End
def remove_nth_from_end(head, n):
    dummy = Node(0)
    dummy.next = head
    first = second = dummy
    for _ in range(n + 1):
        first = first.next
    while first:
        first = first.next
        second = second.next
    second.next = second.next.next
    return dummy.next
```

---

> [!IMPORTANT]
> লিঙ্কড লিস্টের বেশিরভাগ সমস্যা **Two Pointer (Slow & Fast)** টেকনিক দিয়ে অত্যন্ত কার্যকরভাবে সমাধান করা যায়।

---

> [!TIP]
> কোড করার সময় সবসময় `null` হ্যান্ডলিং এবং কর্নার কেস (যেমন: লিস্টে মাত্র ১টি নোড থাকা) মাথায় রাখবেন।
