# Matrix/2D Arrays

Matrix বা 2D Array হলো ডেটা স্ট্রাকচারের একটি গুরুত্বপূর্ণ অংশ যা row এবং column আকারে ডেটা স্টোর করে। একে "Array of Arrays" ও বলা হয়।

## ২ডি অ্যারে রিপ্রেজেন্টেশন (2D Array Representation)

একটি 2D array সাধারণত `matrix[row][column]` আকারে রিপ্রেজেন্ট করা হয়।

```java
int[][] matrix = {
    {1, 2, 3, 4},
    {5, 6, 7, 8},
    {9, 10, 11, 12}
};
```

```python
matrix = [
    [1, 2, 3, 4],
    [5, 6, 7, 8],
    [9, 10, 11, 12]
]
```

এখানে ৩টি row এবং ৪টি column আছে।

### Memory-তে ২ডি অ্যারের স্টোরেজ মেথড

কম্পিউটার মেমরি লিনিয়ার (linear), তাই 2D array-কে লিনিয়ারলি স্টোর করার দুটি প্রধান উপায় আছে:

1.  **Row-major Order:** ডেটা row অনুযায়ী স্টোর হয় (একই row-র সব এলিমেন্ট আগে আসে)। বেশি প্রচলিত।
2.  **Column-major Order:** ডেটা column অনুযায়ী স্টোর হয়।

## ম্যাট্রিক্স ট্রাভার্সাল (Matrix Traversal)

ম্যাট্রিক্স ট্রাভার্সাল মানে হলো ম্যাট্রিক্সের প্রতিটি এলিমেন্টকে একবার ভিজিট করা।

### ১. সাধারণ ট্রাভার্সাল (Row/Column-wise)

```java
for(int i = 0; i < rows; i++) {
    for(int j = 0; j < cols; j++) {
        System.out.print(matrix[i][j] + " ");
    }
}
```

```python
for i in range(len(matrix)):
    for j in range(len(matrix[0])):
        print(matrix[i][j], end=" ")
```

## স্পাইরাল ট্রাভার্সাল (Spiral Traversal)

একেবারে বাইরের লেয়ার থেকে শুরু করে ভেতরের দিকে ঘোরার মত করে ট্রাভার্স করা।

```java
public List<Integer> spiralOrder(int[][] matrix) {
    List<Integer> res = new ArrayList<>();
    if (matrix.length == 0) return res;
    int top = 0, bottom = matrix.length - 1;
    int left = 0, right = matrix[0].length - 1;

    while (top <= bottom && left <= right) {
        for (int i = left; i <= right; i++) res.add(matrix[top][i]);
        top++;
        for (int i = top; i <= bottom; i++) res.add(matrix[i][right]);
        right--;
        if (top <= bottom) {
            for (int i = right; i >= left; i--) res.add(matrix[bottom][i]);
            bottom--;
        }
        if (left <= right) {
            for (int i = bottom; i >= top; i--) res.add(matrix[i][left]);
            left++;
        }
    }
    return res;
}
```

```python
def spiralOrder(matrix):
    res = []
    if not matrix: return res
    top, bottom = 0, len(matrix) - 1
    left, right = 0, len(matrix[0]) - 1

    while top <= bottom and left <= right:
        for i in range(left, right + 1): res.append(matrix[top][i])
        top += 1
        for i in range(top, bottom + 1): res.append(matrix[i][right])
        right -= 1
        if top <= bottom:
            for i in range(right, left - 1, -1): res.append(matrix[bottom][i])
            bottom -= 1
        if left <= right:
            for i in range(bottom, top - 1, -1): res.append(matrix[i][left])
            left += 1
    return res
```

## ডায়াগোনাল ট্রাভার্সাল (Diagonal Traversal)

একটি ম্যাট্রিক্সকে কোণাকুণি ভাবে ট্রাভার্স করা। এটি প্রায়ই ইন্টারভিউতে জিজ্ঞাসা করা হয়।

## ম্যাট্রিক্স রোটেশন (Matrix Rotation - 90 Degree)

কিভাবে একটি ম্যাট্রিক্সকে ৯০ ডিগ্রি ঘোড়ানো যায়:

1. প্রথমে ম্যাট্রিক্সের **Transpose** বের করা (row এবং column অদলবদল)।
2. প্রতিটি row-কে **Reverse** করা।

```java
public void rotate(int[][] matrix) {
    int n = matrix.length;
    // Transpose
    for (int i = 0; i < n; i++) {
        for (int j = i; j < n; j++) {
            int temp = matrix[i][j];
            matrix[i][j] = matrix[j][i];
            matrix[j][i] = temp;
        }
    }
    // Reverse rows
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n / 2; j++) {
            int temp = matrix[i][j];
            matrix[i][j] = matrix[i][n - 1 - j];
            matrix[i][n - 1 - j] = temp;
        }
    }
}
```

```python
def rotate(matrix):
    n = len(matrix)
    # Transpose
    for i in range(n):
        for j in range(i, n):
            matrix[i][j], matrix[j][i] = matrix[j][i], matrix[i][j]
    # Reverse rows
    for i in range(n):
        matrix[i].reverse()
```

## ম্যাট্রিক্স সার্চ (Search in Sorted Matrix)

যদি রো এবং কলাম আলাদা আলাদাভাবে সর্টেড থাকে, তবে আমরা $O(m+n)$ সময়ে সার্চ করতে পারি।

- টপ-রাইট কর্নার থেকে শুরু করুন।
- যদি টার্গেট ছোট হয়, বামে যান (`j--`)।
- যদি টার্গেট বড় হয়, নিচে যান (`i++`)।

## সেট ম্যাট্রিক্স জিরোস (Set Matrix Zeros)

যদি কোনো এলিমেন্ট ০ হয়, তবে সেই রো এবং কলামের সব এলিমেন্টকে ০ বানিয়ে ফেলতে হবে। এটি করার সময় স্পেস অপ্টিমাইজেশনের দিকে খেয়াল রাখা জরুরি।
