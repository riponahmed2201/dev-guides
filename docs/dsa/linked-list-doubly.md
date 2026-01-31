# 21. Linked List - Doubly

**Doubly Linked List (DLL)** হলো লিঙ্কড লিস্টের একটি উন্নত সংস্করণ যেখানে প্রতিটি নোড পরের নোড ছাড়াও তার আগের নোডের অ্যাড্রেস (Reference) ধারণ করে। এটি উভয় দিকে (Forward & Backward) ট্রাভার্সাল করার সুবিধা দেয়।

---

## 1. DLL এর গঠন (DLL Structure)

প্রতিটি নোড তিনটি অংশ নিয়ে গঠিত:

1. **Prev:** আগের নোডের অ্যাড্রেস।
2. **Data:** আসল ডেটা।
3. **Next:** পরের নোডের অ্যাড্রেস।

#### Implementation

```java
// Java DLL Node
class Node {
    int data;
    Node prev, next;
    Node(int data) {
        this.data = data;
        this.prev = this.next = null;
    }
}
```

```python
# Python DLL Node
class Node:
    def __init__(self, data):
        self.data = data
        self.prev = None
        self.next = None
```

---

## 2. ট্রাভার্সাল (Traversal)

DLL-এ আমরা দুই দিক থেকেই ট্রাভার্স করতে পারি।

### সামনের দিকে (Forward)

শুরু থেকে শেষ পর্যন্ত: `curr = head` থেকে শুরু করে `curr = curr.next` করে আগানো।

### পেছনের দিকে (Backward)

শেষ থেকে শুরু পর্যন্ত: যদি `tail` পয়েন্টার থাকে, তবে `curr = tail` থেকে শুরু করে `curr = curr.prev` করে পেছনের দিকে ফেরা।

#### Implementation

```java
// Java DLL Traversal
public void printForward(Node head) {
    Node curr = head;
    while (curr != null) {
        System.out.print(curr.data + " <-> ");
        curr = curr.next;
    }
    System.out.println("null");
}

public void printBackward(Node tail) {
    Node curr = tail;
    while (curr != null) {
        System.out.print(curr.data + " <-> ");
        curr = curr.prev;
    }
    System.out.println("null");
}
```

```python
# Python DLL Traversal
def print_forward(head):
    curr = head
    while curr:
        print(f"{curr.data} <->", end=" ")
        curr = curr.next
    print("None")

def print_backward(tail):
    curr = tail
    while curr:
        print(f"{curr.data} <->", end=" ")
        curr = curr.prev
    print("None")
```

---

## 3. ইনসার্শন (Insertion)

### শুরুতে (At the Beginning)

1. নতুন নোড তৈরি করুন।
2. নতুন নোডের `next` কে বর্তমান `head` এ পয়েন্ট করান।
3. যদি হেড খালি না হয়, তবে `head.prev` কে নতুন নোডে পয়েন্ট করান।
4. `head` কে নতুন নোডে আপডেট করুন।

### শেষে (At the End)

1. শেষ নোড পর্যন্ত যান।
2. শেষ নোডের `next` এ নতুন নোড যুক্ত করুন।
3. নতুন নোডের `prev` কে আগের শেষ নোডে সেট করুন।

#### Implementation

```java
// Java DLL Insertion
public Node insertAtHead(Node head, int data) {
    Node newNode = new Node(data);
    if (head != null) {
        newNode.next = head;
        head.prev = newNode;
    }
    return newNode;
}

public Node insertAtEnd(Node head, int data) {
    Node newNode = new Node(data);
    if (head == null) return newNode;
    Node curr = head;
    while (curr.next != null) curr = curr.next;
    curr.next = newNode;
    newNode.prev = curr;
    return head;
}
```

```python
# Python DLL Insertion
def insert_at_head(head, data):
    new_node = Node(data)
    if head:
        new_node.next = head
        head.prev = new_node
    return new_node

def insert_at_end(head, data):
    new_node = Node(data)
    if not head: return new_node
    curr = head
    while curr.next:
        curr = curr.next
    curr.next = new_node
    new_node.prev = curr
    return head
```

---

## 4. ডিলিট অপারেশন (Deletion)

### নির্দিষ্ট নোড ডিলিট করা

1. নোডটি ডিলিট করার পর তার আগের নোডের `next` কে পরের নোডে এবং পরের নোডের `prev` কে আগের নোডে যুক্ত করতে হয়।
2. এতে মাঝখানের নোডটি মেমরি থেকে বিচ্ছিন্ন হয়ে যায়।

#### Implementation

```java
// Java DLL Deletion
public Node deleteNode(Node head, Node del) {
    if (head == null || del == null) return head;
    if (head == del) head = del.next;
    if (del.next != null) del.next.prev = del.prev;
    if (del.prev != null) del.prev.next = del.next;
    return head;
}
```

```python
# Python DLL Deletion
def delete_node(head, del_node):
    if not head or not del_node: return head
    if head == del_node: head = del_node.next
    if del_node.next: del_node.next.prev = del_node.prev
    if del_node.prev: del_node.prev.next = del_node.next
    return head
```

---

## 5. সুবিধা ও অসুবিধা (Pros & Cons)

### সুবিধা (Advantages)

- **Bi-directional:** উভয় দিকে ট্রাভার্স করা যায়।
- **Easier Deletion:** কোনো নোড ডিলিট করার সময় তার আগের নোড খুঁজে পেতে শুরু থেকে ট্রাভার্স করতে হয় না (যেটি Singly-তে করতে হয়)।

### অসুবিধা (Disadvantages)

- **Extra Memory:** প্রতিটি নোডে এক্সট্রা `prev` পয়েন্টারের জন্য অতিরিক্ত মেমরি লাগে।
- **Complex Updates:** ইনসার্ট বা ডিলিট করার সময় দুটি পয়েন্টার (`next` ও `prev`) মেইনটেইন করতে হয়।

---

## 📊 কমপ্লেক্সিটি অ্যানালাইসিস (Complexity Analysis)

| Operation               | Time Complexity                   |
| :---------------------- | :-------------------------------- |
| **Search/Access**       | O(n)                              |
| **Insert at Head/Tail** | O(1)                              |
| **Insertion in Middle** | O(n)                              |
| **Deletion of Node**    | O(1) (যদি নোড পয়েন্টার জানা থাকে) |

---

## 6. কমন প্রবলেমস (Common Problems)

1. **Reverse DLL:** `prev` এবং `next` পয়েন্টার সোয়াপ করার মাধ্যমে।
2. **Browser History:** ব্রাউজারে 'Back' এবং 'Forward' বাটন মূলত DLL কনসেপ্ট ব্যবহার করে।

---

> [!IMPORTANT]
> DLL মেমরিতে বেশি জায়গা নিলেও এটি Singly Linked List-এর তুলনায় অনেক বেশি ফ্লেক্সিবল।

---

> [!TIP]
> রিয়েল ওয়ার্ল্ড প্রজেক্টে (যেমন: মিউজিক প্লেয়ারের Next/Previous গান) DLL অত্যন্ত কার্যকর।
