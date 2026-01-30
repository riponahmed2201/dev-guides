# 9. Array Problems - Basic

অ্যারে অপারেশনগুলো শেখার পর এবার বাস্তব কিছু সমস্যা সমাধান করা যাক। এই সমস্যাগুলো ইন্টারভিউতে প্রায়ই জিজ্ঞাসা করা হয়। সবগুলোর সমাধান **Java** এবং **Python** এ দেওয়া হয়েছে।

## ১. সবচেয়ে বড়/ছোট এলিমেন্ট খুঁজে বের করা

একটি অ্যারের মধ্য থেকে বৃহত্তম (Largest) বা ক্ষুদ্রতম (Smallest) সংখ্যাটি খুঁজে বের করা।

````carousel
```java
// Java - Find Largest
public int findLargest(int[] arr) {
    int max = arr[0];
    for (int i = 1; i < arr.length; i++) {
        if (arr[i] > max) max = arr[i];
    }
    return max;
}
```
<!-- slide -->
```python
# Python - Find Largest
def find_largest(arr):
    return max(arr) # Or use a loop for logic
```
````

---

## ২. সেকেন্ড লার্জেস্ট এলিমেন্ট

অ্যারের দ্বিতীয় বৃহত্তম সংখ্যাটি খুঁজে বের করা।

- **Logic:** বৃহত্তম সংখ্যাটি পাওয়ার পর তার চেয়ে ছোট কিন্তু বাকি সবার চেয়ে বড় সংখ্যাটি খুঁজুন।

````carousel
```java
// Java - Second Largest
public int secondLargest(int[] arr) {
    int largest = -1, secondLargest = -1;
    for (int x : arr) {
        if (x > largest) {
            secondLargest = largest;
            largest = x;
        } else if (x > secondLargest && x != largest) {
            secondLargest = x;
        }
    }
    return secondLargest;
}
```
<!-- slide -->
```python
# Python - Second Largest
def second_largest(arr):
    first = second = float('-inf')
    for x in arr:
        if x > first:
            second = first
            first = x
        elif x > second and x != first:
            second = x
    return second
```
````

---

## ৩. অ্যারে সর্টেড কিনা তা চেক করা

অ্যারেটি ছোট থেকে বড় (Ascending) ক্রমে সাজানো আছে কিনা।

````carousel
```java
// Java
public boolean isSorted(int[] arr) {
    for (int i = 1; i < arr.length; i++) {
        if (arr[i] < arr[i - 1]) return false;
    }
    return true;
}
```
<!-- slide -->
```python
# Python
def is_sorted(arr):
    return all(arr[i] <= arr[i+1] for i in range(len(arr)-1))
```
````

---

## ৪. ডুপ্লিকেট রিমুভ করা

একটি সর্টেড অ্যারে থেকে ডুপ্লিকেট এলিমেন্টগুলো রিমুভ করা।

````carousel
```java
// Java - Remove Duplicates (Sorted Array)
public int removeDuplicates(int[] arr) {
    int i = 0;
    for (int j = 1; j < arr.length; j++) {
        if (arr[j] != arr[i]) {
            i++;
            arr[i] = arr[j];
        }
    }
    return i + 1; // New size
}
```
<!-- slide -->
```python
# Python - Remove Duplicates
def remove_duplicates(arr):
    return list(set(arr)) # If order doesn't matter
```
````

---

## ৫. অ্যারের যোগফল এবং গড়

সব এলিমেন্টের সমষ্টি এবং তাদের গড় (Average) বের করা।

---

## ৬. মিসিং নাম্বার খুঁজে বের করা

১ থেকে $n$ পর্যন্ত ক্রমিক সংখ্যার মধ্যে কোনটি মিসিং আছে তা বের করা।

- **Formula:** $Sum = n(n+1)/2$. অ্যারের মোটি যোগফল থেকে এটি বিয়োগ করলেই মিসিং নাম্বার পাওয়া যাবে।

---

## ৭. শূন্যগুলোকে শেষে নিয়ে আসা (Move Zeros to End)

অ্যারের সব ০ এলিমেন্টকে শেষে নিয়ে যাওয়া এবং অন্য এলিমেন্টগুলোর ক্রম ঠিক রাখা।

````carousel
```java
// Java - Move Zeros
public void moveZeros(int[] arr) {
    int j = 0;
    for (int i = 0; i < arr.length; i++) {
        if (arr[i] != 0) {
            int temp = arr[i];
            arr[i] = arr[j];
            arr[j] = temp;
            j++;
        }
    }
}
```
<!-- slide -->
```python
# Python - Move Zeros
def move_zeros(arr):
    non_zeros = [x for x in arr if x != 0]
    zeros = [0] * (len(arr) - len(non_zeros))
    return non_zeros + zeros
```
````

---

> [!TIP]
> এই সাধারণ সমস্যাগুলো প্রাকটিস করলে আপনার অ্যারে এবং লুপের ওপর নিয়ন্ত্রণ অনেক বাড়বে।
