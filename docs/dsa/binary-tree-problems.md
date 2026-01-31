# Binary Tree - Problems

বাইনারি ট্রির বিভিন্ন সমস্যা সমাধানের জন্য সাধারণত রিকার্সন (Recursion) ব্যবহার করা হয়। এখানে ইন্টারভিউতে আসা কিছু গুরুত্বপূর্ণ প্রবলেম নিয়ে আলোচনা করা হলো।

## ১. ট্রির উচ্চতা বের করা (Height of Tree)

ট্রির রুট থেকে গভীরতম লিফ নোড পর্যন্ত এজ (Edge) এর সংখ্যাই হলো ট্রির উচ্চতা।

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

## ৪. ট্রি ব্যালেন্সড কি না যাচাই (Check if Balanced)

একটি বাইনারি ট্রি ব্যালেন্সড হবে যদি বাম এবং ডান সাব-ট্রির উচ্চতার পার্থক্য সর্বোচ্চ ১ হয়।

## ৫. ট্রির ডায়ামিটার (Diameter of Tree)

ডায়ামিটার হলো ট্রির যেকোনো দুটি নোডের মধ্যে দীর্ঘতম পথের দূরত্ব। এটি রুট দিয়ে যেতেও পারে, আবার নাও পারে।

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

দুটি নোড $p$ এবং $q$ এর জন্য LCA হলো ট্রির সেই নোড যা উভয়েরই পূর্বপুরুষ এবং রুট থেকে সবচেয়ে দূরে অবস্থিত।

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
