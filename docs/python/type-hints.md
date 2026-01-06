# Type Hints & Annotations

পাইথন একটি **Dynamically Typed** ল্যাঙ্গুয়েজ, অর্থাৎ ভেরিয়েবলের টাইপ আগে থেকে বলে দিতে হয় না। তবে বড় প্রোজেক্টে কোড আরও নিরাপদ এবং বোধগম্য করার জন্য **Type Hints** বা **Type Annotations** ব্যবহার করা হয়।

---

## ১. Basic Type Hints

ভেরিয়েবল বা প্যারামিটারের নামের পাশে কোলন (`:`) দিয়ে টাইপ লিখে দেওয়া যায়।

```python
name: str = "Ripon"
age: int = 25
is_student: bool = True

def add(a: int, b: int) -> int: # -> দিয়ে রিটার্ন টাইপ বোঝায়
    return a + b
```

---

## ২. Advanced Typing (Typing Module)

জটিল ডাটা টাইপ (যেমন- লিস্টের ভেতর স্ট্রং) ডিফাইন করার জন্য `typing` মডিউল ব্যবহার করা হয়।

```python
from typing import List, Dict, Tuple, Optional, Union

# নামের লিস্ট
names: List[str] = ["Alice", "Bob"]

# আইডি এবং নামের ডিকশনারি
user_map: Dict[int, str] = {1: "Ripon", 2: "Shuvo"}

# অপশনাল প্যারামিটার (যা None ও হতে পারে)
def find_user(id: int) -> Optional[str]:
    pass

# একাধিক টাইপ সাপোর্ট করা
def process(data: Union[int, str]):
    pass
```

---

## ৩. কেন ব্যবহার করবেন?

- **IDE Support**: টিপস বা অটো-কমপ্লিশন অনেক ভালো পাওয়া যায়।
- **Static Analysis**: `mypy`-এর মতো টুল ব্যবহার করে কোড রান করার আগেই টাইপিং এরর খুঁজে বের করা যায়।
- **Documentation**: কোড পড়লেই বোঝা যায় কোন ফাংশন কী ধরনের ডাটা নিয়ে কাজ করছে।

---

## ৪. `Any` টাইপ

যখন আপনি কোনো নির্দিষ্ট টাইপ নিশ্চিত নন, তখন `Any` ব্যবহার করতে পারেন। তবে এটি যত কম ব্যবহার করা যায় ততই ভালো।

```python
from typing import Any

x: Any = 10
x = "Hello" # কোনো এরর দিবে না
```

---

::: tip
মনে রাখবেন, পাইথন রানটাইমে টাইপ চেক করে না। অর্থাৎ টাইপ হিন্ট ভুল দিলেও পাইথন স্ক্রিপ্ট রান হবে। এটি শুধুমাত্র ডেভেলপার এবং স্ট্যাটিক অ্যানালাইসিস টুলের জন্য।
:::
