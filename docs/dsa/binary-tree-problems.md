# Binary Tree - Problems

বাইনারি ট্রির বিভিন্ন সমস্যা সমাধানের জন্য সাধারণত রিকার্সন (Recursion) ব্যবহার করা হয়। এখানে ইন্টারভিউতে আসা কিছু গুরুত্বপূর্ণ প্রবলেম নিয়ে আলোচনা করা হলো।

## ১. ট্রির উচ্চতা বের করা (Height of Tree)

ট্রির রুট থেকে গভীরতম লিফ নোড পর্যন্ত এজ (Edge) এর সংখ্যাই হলো ট্রির উচ্চতা।

#### 🛠 কর্মপদ্ধতি (Step-by-Step Logic)

1. যদি নোডটি নাল হয়, তবে উচ্চতা ০ রিটার্ন করুন।
2. রিকার্সিভলি বাম সাব-ট্রির উচ্চতা বের করুন।
3. রিকার্সিভলি ডান সাব-ট্রির উচ্চতা বের করুন।
4. দুটির মধ্যে যেটি বড়, তার সাথে ১ যোগ করে রিটার্ন করুন।

```python
# Python Implementation
def tree_height(root):
    if root is None:
        return 0
    left_height = tree_height(root.left)
    right_height = tree_height(root.right)
    return max(left_height, right_height) + 1
```

```java
// Java Implementation
int height(Node node) {
    if (node == null) return 0;
    return Math.max(height(node.left), height(node.right)) + 1;
}
```

## ২. নোড সংখ্যা গণনা (Count Nodes)

ট্রিতে মোট কতগুলো নোড আছে তা বের করা।

```python
# Python Implementation
def count_nodes(root):
    if root is None:
        return 0
    return 1 + count_nodes(root.left) + count_nodes(root.right)
```

```java
// Java Implementation
int countNodes(Node root) {
    if (root == null) return 0;
    return 1 + countNodes(root.left) + countNodes(root.right);
}
```

## ৩. লিফ নোড গণনা (Count Leaf Nodes)

যেসব নোডের কোনো চাইল্ড নেই তাদের সংখ্যা বের করা।

#### 🛠 কর্মপদ্ধতি (Step-by-Step Logic)

1. যদি নোডটি নাল হয়, তবে ০ রিটার্ন করুন।
2. যদি নোডটির বাম এবং ডান উভয় চাইল্ড নাল হয়, তবে ১ রিটার্ন করুন (এটি একটি লিফ নোড)।
3. নতুবা, বাম এবং ডান সাব-ট্রির লিফ নোড সংখ্যা যোগ করে রিটার্ন করুন।

#### Implementation

```python
# Python Implementation
def count_leaf_nodes(root):
    if root is None:
        return 0
    if root.left is None and root.right is None:
        return 1
    return count_leaf_nodes(root.left) + count_leaf_nodes(root.right)
```

```java
// Java Implementation
int countLeaves(Node root) {
    if (root == null) return 0;
    if (root.left == null && root.right == null) return 1;
    return countLeaves(root.left) + countLeaves(root.right);
}
```

## ৪. ট্রি ব্যালেন্সড কি না যাচাই (Check if Balanced)

একটি বাইনারি ট্রি ব্যালেন্সড হবে যদি বাম এবং ডান সাব-ট্রির উচ্চতার পার্থক্য সর্বোচ্চ ১ হয়।

#### 🛠 কর্মপদ্ধতি (Step-by-Step Logic)

1. একটি হেল্পার ফাংশন ব্যবহার করে প্রতিটি নোডের উচ্চতা বের করুন।
2. যদি কোনো নোডের বাম এবং ডান সাব-ট্রির উচ্চতার পার্থক্য ১-এর বেশি হয়, তবে -১ রিটার্ন করুন (যা আনব্যালেন্সড নির্দেশ করে)।
3. যদি বাম বা ডান সাব-ট্রি থেকে -১ ফিরে আসে, তবে পুরো ট্রিটিই আনব্যালেন্সড।
4. সবশেষে চেক করুন রুট থেকে -১ আসছে কি না।

#### Implementation

```python
# Python Implementation
def is_balanced(root):
    def check(node):
        if node is None:
            return 0
        left = check(node.left)
        right = check(node.right)
        if left == -1 or right == -1 or abs(left - right) > 1:
            return -1
        return max(left, right) + 1
    return check(root) != -1
```

```java
// Java Implementation
int check(Node root) {
    if (root == null) return 0;
    int lh = check(root.left);
    int rh = check(root.right);
    if (lh == -1 || rh == -1 || Math.abs(lh - rh) > 1) return -1;
    return Math.max(lh, rh) + 1;
}

boolean isBalanced(Node root) {
    return check(root) != -1;
}
```

## ৫. ট্রির ডায়ামিটার (Diameter of Tree)

ডায়ামিটার হলো ট্রির যেকোনো দুটি নোডের মধ্যে দীর্ঘতম পথের দূরত্ব। এটি রুট দিয়ে যেতেও পারে, আবার নাও পারে।

#### 🛠 কর্মপদ্ধতি (Step-by-Step Logic)

1. প্রতিটি নোডের ক্ষেত্রে বাম উচ্চতা এবং ডান উচ্চতার যোগফল বের করুন।
2. এই যোগফলটিই হলো ওই নির্দিষ্ট নোড দিয়ে যাওয়া সম্ভাব্য দীর্ঘতম পথ।
3. সব নোডের জন্য এই মানগুলো বের করে সর্বোচ্চ মানটিই হবে ট্রির ডায়ামিটার।
4. অপ্টিমাইজড পদ্ধতিতে ($O(n)$) উচ্চতা এবং ডায়ামিটার একইসাথে ক্যালকুলেট করা যায়।

```java
// Java Implementation (Optimized O(n))
class Height { int h; }

int diameter(Node root, Height height) {
    if (root == null) {
        height.h = 0;
        return 0;
    }
    Height lh = new Height(), rh = new Height();
    int ldiam = diameter(root.left, lh);
    int rdiam = diameter(root.right, rh);
    height.h = Math.max(lh.h, rh.h) + 1;
    return Math.max(lh.h + rh.h + 1, Math.max(ldiam, rdiam));
}
```

```python
# Python Implementation (Optimized O(n))
def diameter(root):
    res = [0]
    def dfs(root):
        if not root: return 0
        left = dfs(root.left)
        right = dfs(root.right)
        res[0] = max(res[0], left + right)
        return 1 + max(left, right)
    dfs(root)
    return res[0]
```

## ৬. মিরর ট্রি (Mirror Tree)

একটি বাইনারি ট্রির প্রতিচ্ছবি তৈরি করা (বাম এবং ডান চাইল্ড অদলবদল করা)।

```python
# Python Implementation
def mirror_tree(node):
    if node is None:
        return
    mirror_tree(node.left)
    mirror_tree(node.right)
    # Swap children
    node.left, node.right = node.right, node.left
```

```java
// Java Implementation
void mirror(Node node) {
    if (node == null) return;
    mirror(node.left);
    mirror(node.right);
    Node temp = node.left;
    node.left = node.right;
    node.right = temp;
}
```

## ৭. ট্রি আইডেন্টিকাল কি না যাচাই (Check if Identical)

দুটি বাইনারি ট্রি হুবহু এক কি না তা চেক করা।

```python
# Python Implementation
def is_identical(root1, root2):
    if root1 is None and root2 is None:
        return True
    if root1 is not None and root2 is not None:
        return (root1.data == root2.data and
                is_identical(root1.left, root2.left) and
                is_identical(root1.right, root2.right))
    return False
```

```java
// Java Implementation
boolean isIdentical(Node r1, Node r2) {
    if (r1 == null && r2 == null) return true;
    if (r1 != null && r2 != null) {
        return (r1.data == r2.data &&
                isIdentical(r1.left, r2.left) &&
                isIdentical(r1.right, r2.right));
    }
    return false;
}
```

## ৮. লোয়েস্ট কমন অ্যানসেস্টর (Lowest Common Ancestor - LCA)

দুটি নোড p এবং q এর জন্য LCA হলো ট্রির সেই নোড যা উভয়েরই পূর্বপুরুষ এবং রুট থেকে সবচেয়ে দূরে অবস্থিত।

#### 🛠 কর্মপদ্ধতি (Step-by-Step Logic)

1. যদি রুট নাল হয় অথবা এটি `p` বা `q` এর কোনোটির সমান হয়, তবে রুট রিটার্ন করুন।
2. বাম এবং ডান সাব-ট্রিতে রিকার্সিভলি সার্চ করুন।
3. যদি বাম এবং ডান উভয় দিক থেকেই নন-নাল ভ্যালু ফিরে আসে, তার মানে বর্তমান নোডটিই হলো LCA।
4. অন্যথায়, যেদিক থেকে ভ্যালু পাওয়া গেছে সেটি রিটার্ন করুন।

```java
// Java Implementation
public Node lowestCommonAncestor(Node root, Node p, Node q) {
    if (root == null || root == p || root == q) return root;
    Node left = lowestCommonAncestor(root.left, p, q);
    Node right = lowestCommonAncestor(root.right, p, q);
    if (left != null && right != null) return root;
    return (left != null) ? left : right;
}
```

```python
# Python Implementation
def lowestCommonAncestor(root, p, q):
    if not root or root == p or root == q:
        return root
    left = lowestCommonAncestor(root.left, p, q)
    right = lowestCommonAncestor(root.right, p, q)
    if left and right:
        return root
    return left if left else right
```

## ৯. রুট থেকে লিফ পর্যন্ত সব পথ প্রিন্ট করা

রুট থেকে শুরু করে প্রতিটি শেষ নোড (Leaf) পর্যন্ত যতগুলো পথ আছে তা প্রিন্ট করা।

#### 🛠 কর্মপদ্ধতি (Step-by-Step Logic)

1. একটি লিস্ট বা অ্যারে ব্যবহার করে বর্তমান পথের নোডগুলো স্টোর করুন।
2. যখনই কোনো লিফ নোডে পৌঁছাবেন, তখন পুরো লিস্টটি প্রিন্ট করুন।
3. রিকার্সন থেকে ফিরে আসার সময় (Backtrack) লিস্ট থেকে শেষ নোডটি সরিয়ে ফেলুন।

#### Implementation

```python
# Python Implementation
def print_paths(root, path):
    if not root:
        return
    path.append(root.val)
    if not root.left and not root.right:
        print("->".join(map(str, path)))
    else:
        print_paths(root.left, path)
        print_paths(root.right, path)
    path.pop()
```

```java
// Java Implementation
void printPaths(Node root, List<Integer> path) {
    if (root == null) return;
    path.add(root.data);
    if (root.left == null && root.right == null) {
        System.out.println(path);
    } else {
        printPaths(root.left, path);
        printPaths(root.right, path);
    }
    path.remove(path.size() - 1);
}
```
