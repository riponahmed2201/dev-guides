# Concurrency (কনকারেন্সি)

বড় কোনো কাজ করার সময় অ্যাপ্লিকেশন যাতে স্লো না হয়ে যায়, সেজন্য পাইথনে **Concurrency** ব্যবহার করা হয়। এটি মূলত দুটি উপায়ে কাজ করে: **Threading** এবং **Multiprocessing**।

---

## ১. Threading vs Multiprocessing

| বৈশিষ্ট্য | Threading | Multiprocessing |
| :--- | :--- | :--- |
| **কাজ করার ধরণ** | একই মেমরি স্পেস ব্যবহার করে। | আলাদা আলাদা প্রসেস (মেমরি) ব্যবহার করে। |
| **GIL এর প্রভাব** | GIL এর কারণে একসাথে গাণিতিক কাজ করতে পারে না। | GIL এর কোনো প্রভাব নেই, সত্যিকারের প্যারালেলিজম দেয়। |
| **ব্যবহার** | I/O ইনটেনসিভ কাজের জন্য (যেমন- নেটওয়ার্ক রিকোয়েস্ট)। | CPU ইনটেনসিভ কাজের জন্য (যেমন- ইমেজ প্রসেসিং)। |

---

## ২. Threading (threading মডিউল)

```python
import threading
import time

def print_numbers():
    for i in range(5):
        time.sleep(1)
        print(f"Number: {i}")

# থ্রেড তৈরি করা
t1 = threading.Thread(target=print_numbers)
t1.start() # থ্রেড শুরু করা
t1.join()  # মেইন থ্রেডকে ওয়েট করানো
```

---

## ৩. Multiprocessing (multiprocessing মডিউল)

মাল্টি-কোর প্রসেসরের পূর্ণ ক্ষমতা ব্যবহার করার জন্য এটি ব্যবহার করা হয়।

```python
import multiprocessing

def square_numbers(n):
    print(f"Square: {n*n}")

if __name__ == "__main__":
    processes = []
    for i in range(5):
        p = multiprocessing.Process(target=square_numbers, args=(i,))
        processes.append(p)
        p.start()

    for p in processes:
        p.join()
```

---

## ৪. GIL (Global Interpreter Lock)

পাইথনে একসাথে একাধিক থ্রেড চললেও তারা সত্যিকারের প্যারালেল কাজ করতে পারে না কারণ পাইথনে **GIL** আছে। এটি এক সময়ে একটি মাত্র থ্রেডকে পাইথন বাইটকোড এক্সিকিউট করতে দেয়। তবে নেটওয়ার্ক বা ফাইল হ্যান্ডলিং এর সময় এটি কোনো সমস্যা করে না কারণ তখন থ্রেডগুলো ওয়েট করে।

---

## ৫. ThreadPoolExecutor

আধুনিক পাইথনে থ্রেড বা প্রসেস ম্যানেজ করার সহজ উপায় হলো `concurrent.futures` মডিউল।

```python
from concurrent.futures import ThreadPoolExecutor

with ThreadPoolExecutor(max_workers=3) as executor:
    executor.map(print_numbers, range(3))
```

---

::: tip
যদি আপনার অ্যাপ্লিকেশনে অনেক বেশি নেটওয়ার্ক রিকোয়েস্ট থাকে, তবে **Threading** বা **AsyncIO** ব্যবহার করুন। আর যদি প্রচুর ডেটা ক্যালকুলেশন থাকে, তবে **Multiprocessing** ব্যবহার করুন।
:::
