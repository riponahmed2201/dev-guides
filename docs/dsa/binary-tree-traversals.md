# Binary Tree - Traversals

ট্রি ট্রাভার্সাল (Tree Traversal) হলো এমন একটি প্রক্রিয়া যার মাধ্যমে ট্রির প্রতিটি নোডকে ঠিক একবার করে ভিজিট করা হয়। ট্রাভার্সালকে প্রধানত দুইভাগে ভাগ করা যায়:

1. **Depth First Search (DFS)**
2. **Breadth First Search (BFS)**

## ১. ডেপথ ফার্স্ট সার্চ (DFS)

DFS তিনভাবে করা যায়। এদের নাম মূলত রুট (Root) নোডটি কখন ভিজিট করা হচ্ছে তার ওপর ভিত্তি করে রাখা হয়েছে।

### ইন-অর্ডার ট্রাভার্সাল (Inorder Traversal)

- **নিয়ম:** Left -> Root -> Right
- বাইনারি সার্চ ট্রিতে এটি সর্টেড অর্ডার দেয়।

```python
# Recursive Python
def inorder(root):
    if root:
        inorder(root.left)
        print(root.val, end=" ")
        inorder(root.right)
```

```java
// Recursive Java
void inorder(Node root) {
    if (root == null) return;
    inorder(root.left);
    System.out.print(root.data + " ");
    inorder(root.right);
}
```

### প্রি-অর্ডার ট্রাভার্সাল (Preorder Traversal)

- **নিয়ম:** Root -> Left -> Right
- এটি ট্রি কনিক্যাল রিপ্রেজেন্টেশন বা ট্রির কপি তৈরি করতে ব্যবহৃত হয়।

```python
# Recursive Python
def preorder(root):
    if root:
        print(root.val, end=" ")
        preorder(root.left)
        preorder(root.right)
```

```java
// Recursive Java
void preorder(Node root) {
    if (root == null) return;
    System.out.print(root.data + " ");
    preorder(root.left);
    preorder(root.right);
}
```

### পোস্ট-অর্ডার ট্রাভার্সাল (Postorder Traversal)

- **নিয়ম:** Left -> Right -> Root
- এটি ট্রি ডিলিট করা বা গাণিতিক এক্সপ্রেশন ট্রির ইভ্যালুয়েশনে ব্যবহৃত হয়।

```python
# Recursive Python
def postorder(root):
    if root:
        postorder(root.left)
        postorder(root.right)
        print(root.val, end=" ")
```

```java
// Recursive Java
void postorder(Node root) {
    if (root == null) return;
    postorder(root.left);
    postorder(root.right);
    System.out.print(root.data + " ");
}
```

## ২. লেভেল অর্ডার ট্রাভার্সাল (Level Order/BFS)

এই পদ্ধতিতে ট্রির প্রতিটি লেভেলের নোডগুলোকে বাম থেকে ডানে ক্রমান্বয়ে ভিজিট করা হয়। এর জন্য **Queue** ডেটা স্ট্রাকচার ব্যবহৃত হয়।

```java
// Java Implementation
void levelOrder(Node root) {
    if (root == null) return;
    Queue<Node> queue = new LinkedList<>();
    queue.add(root);
    while (!queue.isEmpty()) {
        Node current = queue.poll();
        System.out.print(current.data + " ");
        if (current.left != null) queue.add(current.left);
        if (current.right != null) queue.add(current.right);
    }
}
```

```python
# Python Implementation
from collections import deque

def level_order(root):
    if not root: return
    queue = deque([root])
    while queue:
        node = queue.popleft()
        print(node.val, end=" ")
        if node.left: queue.append(node.left)
        if node.right: queue.append(node.right)
```

## ৩. রিকার্সিভ বনাম ইটারেটিভ (Recursive vs Iterative)

রিকার্সিভ ট্রাভার্সাল কোড করতে সহজ কিন্তু এতে স্ট্যাক মেমোরি বেশি লাগে (রিকার্সন কল স্ট্যাক)। ইটারেটিভ পদ্ধতিতে আমরা ইউজার-ডিফাইন্ড স্ট্যাক ব্যবহার করে একই কাজ করতে পারি যা বড় ট্রির ক্ষেত্রে স্ট্যাক ওভারফ্লো এড়াতে সাহায্য করে।

## ৪. মরিস ট্রাভার্সাল (Morris Traversal - Advanced)

সবগুলো ট্রাভার্সালে $O(H)$ স্পেস প্রয়োজন হয় (স্ট্যাক বা রিকার্সনের জন্য)। মরিস ট্রাভার্সাল এমন একটি উন্নত পদ্ধতি যেখানে **$O(1)$ এক্সট্রা স্পেসে** ট্রি ট্রাভার্স করা যায়। এটি ট্রির নাল পয়েন্টারগুলোকে টেম্পোরারি লিঙ্ক (Threaded Binary Tree) হিসেবে ব্যবহার করে।

## সারাংশ (Summary Table)

| ট্রাভার্সাল     | ক্রম (Sequence)   | ব্যবহার (Use Case)              |
| :-------------- | :---------------- | :------------------------------ |
| **Inorder**     | Left, Root, Right | Sorted values in BST            |
| **Preorder**    | Root, Left, Right | Tree cloning, Polish notation   |
| **Postorder**   | Left, Right, Root | Tree deletion, Evaluation       |
| **Level Order** | Level by Level    | Shortest path, Breadth coverage |
