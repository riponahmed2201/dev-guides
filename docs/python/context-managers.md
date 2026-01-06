# Context Managers

প্রোগ্রামিংয়ে রিসোর্স ম্যানেজমেন্ট (যেমন- ফাইল ক্লোজ করা, ডাটাবেস ডিসকানেক্ট করা) নিশ্চিত করার জন্য **Context Managers** ব্যবহার করা হয়। এটি মূলত `with` ব্লকের মাধ্যমে কাজ করে।

---

## ১. Classes as Context Managers

একটি ক্লাসকে কন্টেক্সট ম্যানেজার বানাতে দুটি ম্যাজিক মেথড প্রয়োজন:
- **`__enter__()`**: ব্লক শুরুর সময় যা রান হয়।
- **`__exit__()`**: ব্লক শেষের সময় (এরর আসলেও) যা রান হয়।

```python
class MyFileManager:
    def __init__(self, filename):
        self.filename = filename

    def __enter__(self):
        self.file = open(self.filename, 'w')
        return self.file

    def __exit__(self, exc_type, exc_val, exc_tb):
        self.file.close()

with MyFileManager('test.txt') as f:
    f.write('হ্যালো দুনিয়া!')
```

---

## ২. @contextmanager Decorator

ক্লাস না লিখে ছোট কাজের জন্য `contextlib` মডিউল ব্যবহার করে সহজে কন্টেক্সট ম্যানেজার বানানো যায়।

```python
from contextlib import contextmanager

@contextmanager
def temp_file():
    print("রিসোর্স ওপেন হচ্ছে...")
    yield # এখানে প্রোগ্রামের কাজ হবে
    print("রিসোর্স ক্লোজ হচ্ছে...")

with temp_file():
    print("কাজ চলছে...")
```

---

## ৩. কেন ব্যবহার করবেন?

- **রিসোর্স লিক প্রতিরোধ**: ফাইল বা মেমরি ঠিকমতো রিলিজ করা নিশ্চিত করে।
- **Clean Code**: প্রতিবার `try...finally` ব্লক না লিখে শুধু `with` দিয়ে কোড ক্লিন রাখা যায়।

---

::: tip
কন্টেক্সট ম্যানেজার শুধু ফাইল নয়, ডাটাবেস কানেকশন, লক (Lock) ম্যানেজমেন্ট এবং টেম্পোরারি এনভায়রনমেন্ট সেটআপের জন্য অত্যন্ত প্রয়োজনীয়।
:::
