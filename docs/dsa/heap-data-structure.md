# Heap Data Structure

Heap হলো একটি বিশেষ ধরণের **Tree-based Data Structure** যা **Complete Binary Tree** এর নিয়ম মেনে চলে। এটি সাধারণত **Priority Queue** ইমপ্লিমেন্ট করার জন্য ব্যবহৃত হয়।

হিপ দুই ধরণের হতে পারে:

1.  **Max Heap**: প্যারেন্ট নোডের ভ্যালু সবসময় তার চাইল্ড নোডগুলোর চেয়ে বড় বা সমান হয়। রুটে থাকে ম্যাক্সিমাম ভ্যালু।
2.  **Min Heap**: প্যারেন্ট নোডের ভ্যালু সবসময় তার চাইল্ড নোডগুলোর চেয়ে ছোট বা সমান হয়। রুটে থাকে মিনিমাম ভ্যালু।

## ১. Heap Property

Heap-এর দুটি প্রধান বৈশিষ্ট্য হলো:

1.  **Structure Property**: এটি অবশ্যই একটি **Complete Binary Tree** হতে হবে। অর্থাৎ, শেষ লেভেল ছাড়া বাকি সব লেভেল পুরোপুরি পূর্ণ থাকবে এবং শেষ লেভেলে নোডগুলো বাম দিক থেকে ডান দিকে থাকবে।
2.  **Heap Order Property**: প্রতিটি প্যারেন্ট নোড তার চাইল্ড নোডগুলোর চেয়ে বড় (Max Heap) অথবা ছোট (Min Heap) হবে।

## ২. Array Representation (অ্যারে রিপ্রেজেন্টেশন)

যেহেতু Heap একটি Complete Binary Tree, তাই একে খুব সহজেই একটি **Array** দিয়ে রিপ্রেজেন্ট করা যায়। পয়েন্টার ব্যবহার করার দরকার হয় না।

যদি একটি নোড অ্যারের `i` তম ইনডেক্সে থাকে (0-based indexing), তবে:

- **Parent Index:** `(i - 1) / 2`
- **Left Child Index:** `(2 * i) + 1`
- **Right Child Index:** `(2 * i) + 2`

উদাহরণস্বরূপ, অ্যারে: `[10, 5, 3, 2, 4]` (Max Heap)

- ইনডেক্স 0 (10) এর লেফট চাইল্ড: `(2*0)+1 = 1` (ভ্যালু 5)
- ইনডেক্স 0 (10) এর রাইট চাইল্ড: `(2*0)+2 = 2` (ভ্যালু 3)

## ৩. Heapify Operation

**Heapify** হলো এমন একটি প্রসেস যা একটি সাধারণ নোডকে সঠিক পজিশনে নিয়ে গিয়ে হিপ প্রপার্টি ঠিক রাখে। এটি সাধারণত উপর থেকে নিচে (Down-Heapify) বা নিচ থেকে উপরে (Up-Heapify) করা হয়।

### Max-Heapify (Down-Heapify) এর লজিক:

1.  ধরি বর্তমান ইনডেক্স `i` হল রুট।
2.  বাম এবং ডান চাইল্ডের সাথে তুলনা করি।
3.  যদি কোনো চাইল্ড রুটের চেয়ে বড় হয়, তবে তাকে `largest` হিসেবে মার্ক করি।
4.  যদি `largest` এবং `i` সমান না হয়, তবে তাদের ভ্যালু সোয়াপ (swap) করি।
5.  যেই সাব-ট্রিতে সোয়াপ হয়েছে, সেখানে আবার রিকার্সিভলি Heapify কল করি।

## ৪. Build Heap (হিপ তৈরি করা)

একটি র্যান্ডম অ্যারে থেকে হিপ তৈরি করতে আমরা **Build Heap** অপারেশন চালাই।
লিফ নোডগুলোর জন্য Heapify কল করার দরকার নেই। তাই আমরা শেষ নন-লিফ নোড (Last Non-Leaf Node) থেকে শুরু করে রুট পর্যন্ত লুপ চালিয়ে Heapify কল করি।

ইনডেক্স **`n/2 - 1`** থেকে **`0`** পর্যন্ত লুপ চালানো হয়।
এর টাইম কমপ্লেক্সিটি: **O(n)**।

## ৫. Heap Implementation (Java & Python)

নিচে একটি **Max Heap** এর পূর্ণাঙ্গ ইমপ্লিমেন্টেশন দেওয়া হলো।

### Python Implementation

```python
class MaxHeap:
    def __init__(self):
        self.heap = []

    def parent(self, i):
        return (i - 1) // 2

    def left_child(self, i):
        return 2 * i + 1

    def right_child(self, i):
        return 2 * i + 2

    # Insert a new key
    def insert(self, key):
        self.heap.append(key)
        self.heapify_up(len(self.heap) - 1)

    # Moves the element up to maintain heap property
    def heapify_up(self, i):
        while i > 0 and self.heap[self.parent(i)] < self.heap[i]:
            # Swap with parent
            self.heap[i], self.heap[self.parent(i)] = self.heap[self.parent(i)], self.heap[i]
            i = self.parent(i)

    # Extract the maximum element (Root)
    def extract_max(self):
        if len(self.heap) == 0:
            return None
        if len(self.heap) == 1:
            return self.heap.pop()

        root = self.heap[0]
        self.heap[0] = self.heap.pop()  # Move last element to root
        self.heapify_down(0)
        return root

    # Moves the element down to maintain heap property
    def heapify_down(self, i):
        largest = i
        l = self.left_child(i)
        r = self.right_child(i)
        n = len(self.heap)

        if l < n and self.heap[l] > self.heap[largest]:
            largest = l

        if r < n and self.heap[r] > self.heap[largest]:
            largest = r

        if largest != i:
            self.heap[i], self.heap[largest] = self.heap[largest], self.heap[i]
            self.heapify_down(largest)

    def print_heap(self):
        print(self.heap)

# Driver Code
h = MaxHeap()
keys = [3, 10, 12, 8, 2, 14]

print("Inserting elements:", keys)
for key in keys:
    h.insert(key)

print("Current Heap:", end=" ")
h.print_heap()

print("Extracted Max:", h.extract_max())
print("Heap after extraction:", end=" ")
h.print_heap()
```

### Java Implementation

```java
import java.util.ArrayList;

class MaxHeap {
    private ArrayList<Integer> heap;

    public MaxHeap() {
        heap = new ArrayList<>();
    }

    private int parent(int i) { return (i - 1) / 2; }
    private int leftChild(int i) { return 2 * i + 1; }
    private int rightChild(int i) { return 2 * i + 2; }

    // Insert a new key
    public void insert(int key) {
        heap.add(key);
        heapifyUp(heap.size() - 1);
    }

    // Fix heap property upwards
    private void heapifyUp(int i) {
        while (i > 0 && heap.get(parent(i)) < heap.get(i)) {
            swap(i, parent(i));
            i = parent(i);
        }
    }

    // Extract maximum element
    public int extractMax() {
        if (heap.size() == 0) throw new IllegalStateException("Heap is empty");
        if (heap.size() == 1) return heap.remove(0);

        int root = heap.get(0);
        heap.set(0, heap.remove(heap.size() - 1)); // Move last leaf to root
        heapifyDown(0);
        return root;
    }

    // Fix heap property downwards
    private void heapifyDown(int i) {
        int largest = i;
        int l = leftChild(i);
        int r = rightChild(i);
        int n = heap.size();

        if (l < n && heap.get(l) > heap.get(largest))
            largest = l;

        if (r < n && heap.get(r) > heap.get(largest))
            largest = r;

        if (largest != i) {
            swap(i, largest);
            heapifyDown(largest);
        }
    }

    private void swap(int i, int j) {
        int temp = heap.get(i);
        heap.set(i, heap.get(j));
        heap.set(j, temp);
    }

    public void printHeap() {
        System.out.println(heap);
    }

    public static void main(String[] args) {
        MaxHeap h = new MaxHeap();
        int[] keys = {3, 10, 12, 8, 2, 14};

        System.out.println("Inserting elements...");
        for (int key : keys) {
            h.insert(key);
        }

        System.out.print("Current Heap: ");
        h.printHeap(); // Output: [14, 8, 12, 3, 2, 10]

        System.out.println("Extracted Max: " + h.extractMax());
        System.out.print("Heap after extraction: ");
        h.printHeap();
    }
}
```

## ৬. টাইম কমপ্লেক্সিটি (Time Complexity)

| অপারেশন             | বর্ণনা                          | টাইম কমপ্লেক্সিটি |
| :------------------ | :------------------------------ | :---------------- |
| **Get Max/Min**     | সরাসরি রুট (index 0) থেকে নেওয়া | O(1)              |
| **Extract Max/Min** | রুট রিমুভ করে Heapify করা       | O(log n)          |
| **Insert**          | শেষে আড করে Up-Heapify করা      | O(log n)          |
| **Heapify**         | একটি এলিমেন্টকে ঠিক করা         | O(log n)          |
| **Build Heap**      | পুরো অ্যারে থেকে হিপ তৈরি করা   | O(n)              |

> [!NOTE]
> যদিও `Build Heap` এর কমপ্লেক্সিটি মনে হতে পারে O(n log n), তবে গানিতিক প্রমাণ (Taylor Series) এর মাধ্যমে দেখা যায় এটি আসলে **O(n)**।

## ৭. ব্যবহার (Applications)

1.  **Heap Sort:** অ্যারে সর্ট করতে (O(n log n))।
2.  **Priority Queue:** গ্রাফ অ্যালগরিদম যেমন **Dijkstra** এবং **Prim's Algorithm** এ।
3.  **Scheduling:** অপারেটিং সিস্টেমের টাস্ক শিডিউলিং এ।
4.  **K-th Largest Element:** একটি বড় ডেটাসেট থেকে K-তম সর্বোচ্চ সংখ্যা বের করতে।
