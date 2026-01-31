# Binary Search Tree (BST)

বাইনারি সার্চ ট্রি (BST) হলো এমন একটি বাইনারি ট্রি যেখানে নোডগুলো একটি নির্দিষ্ট নিয়ম মেনে চলে। এটি ডেটা সার্চিং এবং ম্যানেজমেন্টের জন্য অত্যন্ত শক্তিশালী একটি স্ট্রাকচার।

## ১. BST বৈশিষ্ট্য (BST Property)

BST-এর মূল বৈশিষ্ট্য হলো:

- একটি নোডের **বাম সাব-ট্রির (Left Subtree)** সব নোডের ভ্যালু ওই নোডের ভ্যালু থেকে **ছোট** হবে।
- ওই নোডের **ডান সাব-ট্রির (Right Subtree)** সব নোডের ভ্যালু ওই নোডের ভ্যালু থেকে **বড়** হবে।
- বাম এবং ডান উভয় সাব-ট্রিকেও অবশ্যই বাইনারি সার্চ ট্রি হতে হবে।

## ২. BST অপারেশন (BST Operations)

### সার্চ (Search)

BST-তে কোনো ভ্যালু সার্চ করা খুব সহজ। যদি টার্গেট ভ্যালু বর্তমান নোড থেকে ছোট হয় তবে বামে খুঁজবো, বড় হলে ডানে খুঁজবো।

```python
# Python Search
def search(root, key):
    if root is None or root.val == key:
        return root
    if root.val < key:
        return search(root.right, key)
    return search(root.left, key)
```

```java
// Java Search
Node search(Node root, int key) {
    if (root == null || root.data == key)
        return root;
    if (root.data < key)
        return search(root.right, key);
    return search(root.left, key);
}
```

### ইনসার্ট (Insert)

নতুন নোড যুক্ত করার সময়ও BST প্রপার্টি বজায় রাখতে হয়।

```java
// Java Insert
Node insert(Node root, int key) {
    if (root == null) {
        root = new Node(key);
        return root;
    }
    if (key < root.data)
        root.left = insert(root.left, key);
    else if (key > root.data)
        root.right = insert(root.right, key);
    return root;
}
```

```python
# Python Insert
def insert(root, key):
    if root is None:
        return Node(key)
    if key < root.val:
        root.left = insert(root.left, key)
    else:
        root.right = insert(root.right, key)
    return root
```

### ডিলিট (Delete)

BST থেকে নোড ডিলিট করার তিনটি কেস আছে:

1. নোডটি লিফ নোড (No child)।
2. নোডটির একটি চাইল্ড আছে।
3. নোডটির দুটি চাইল্ড আছে (এক্ষেত্রে ইন-অর্ডার সাকসেসর বা প্রিডিসেসর দিয়ে রিপ্লেস করতে হয়)।

## ৩. ইন-অর্ডার এবং সর্টেড আউটপুট

বাইনারি সার্চ ট্রিতে যদি আমরা **Inorder Traversal** (Left-Root-Right) করি, তবে সবসময় **সর্টেড (Sorted)** বা ছোট থেকে বড় ক্রমে ডেটা পাবো।

## ৪. সর্বনিম্ন এবং সর্বোচ্চ ভ্যালু (Min/Max)

- **Min:** ট্রির একদম বাম দিকের (Leftmost) নোডটি হলো সর্বনিম্ন।
- **Max:** ট্রির একদম ডান দিকের (Rightmost) নোডটি হলো সর্বোচ্চ।

## ৫. ফ্লোর এবং সিল (Floor and Ceil)

- **Floor:** $X$-এর সমান বা তার চেয়ে ছোট সবচেয়ে বড় ভ্যালু।
- **Ceil:** $X$-এর সমান বা তার চেয়ে বড় সবচেয়ে ছোট ভ্যালু।

## ৬. K-তম ক্ষুদ্রতম/বৃহত্তম (Kth Smallest/Largest)

ইন-অর্ডার ট্রাভার্সাল ব্যবহার করে আমরা সহজেই $K$-তম এলিমেন্ট খুঁজে বের করতে পারি।

```python
# Kth Smallest in Python
def kthSmallest(root, k):
    stack = []
    while True:
        while root:
            stack.append(root)
            root = root.left
        root = stack.pop()
        k -= 1
        if k == 0:
            return root.val
        root = root.right
```

```java
// Kth Smallest in Java
int count = 0;
int result = -1;

void kthSmallest(Node root, int k) {
    if (root == null) return;
    kthSmallest(root.left, k);
    count++;
    if (count == k) {
        result = root.data;
        return;
    }
    kthSmallest(root.right, k);
}
```

## ৭. টাইম কমপ্লেক্সিটি (Time Complexity)

| অপারেশন    | এভারেজ কেস  | ওয়ার্স্ট কেস (Skewed Tree) |
| :--------- | :---------- | :------------------------- |
| **Search** | $O(\log n)$ | $O(n)$                     |
| **Insert** | $O(\log n)$ | $O(n)$                     |
| **Delete** | $O(\log n)$ | $O(n)$                     |

> [!IMPORTANT]
> যদি ট্রি ব্যালেন্সড না থাকে (যেমন Skewed Tree), তবে সব অপারেশনের কমপ্লেক্সিটি $O(n)$ হয়ে যায়। একারণেই **AVL Tree** বা **Red-Black Tree** এর মত সেলফ-ব্যালেন্সিং ট্রির প্রয়োজন হয়।
