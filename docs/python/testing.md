# Testing (টেস্টিং)

প্রোফেশনাল সফটওয়্যার ডেভেলপমেন্টে টেস্টিং একটি অপরিহার্য অংশ। টেস্টিং নিশ্চিত করে যে আপনার কোড ঠিকঠাক কাজ করছে এবং ভবিষ্যতে কোনো পরিবর্তন করলে পুরনো ফিচারগুলো নষ্ট হচ্ছে না।

---

## ১. Why Testing?

- **Confidence**: কোড নিয়ে কনফিডেন্স বাড়ে।
- **Bug Prevention**: বড় প্রোজেক্টে এরর আগেভাগেই ধরা পড়ে।
- **Refactoring**: কোড পরিবর্তন করা সহজ হয়।

---

## ২. Unittest (Built-in)

পাইথনে টেস্টিং এর জন্য আগে থেকেই `unittest` মডিউল দেওয়া থাকে।

```python
import unittest

def add(a, b):
    return a + b

class TestMath(unittest.TestCase):
    def test_add(self):
        self.assertEqual(add(10, 5), 15)
        self.assertEqual(add(-1, 1), 0)

if __name__ == '__main__':
    unittest.main()
```

---

## ৩. Pytest (Modern & Popular)

বর্তমানে পাইথন ডেভেলপারদের মধ্যে `pytest` সবচেয়ে বেশি জনপ্রিয়। এর সিনট্যাক্স অনেক সহজ এবং এটি দিয়ে বড় বড় টেস্ট কেস সহজে লেখা যায়।

### installation:
```bash
pip install pytest
```

### Example:
```python
# test_logic.py
def add(a, b):
    return a + b

def test_add():
    assert add(10, 5) == 15
```

রান করার কমান্ড: `pytest`

---

## ৪. Types of Testing

- **Unit Testing**: ছোট ছোট ফাংশন বা কম্পোনেন্ট আলাদাভাবে চেক করা।
- **Integration Testing**: অনেকগুলো কম্পোনেন্ট একসাথে ঠিকঠাক কাজ করছে কি না তা দেখা।
- **Functional Testing**: ইউজার হিসেবে পুরো ফিচারটা কাজ করছে কি না তা ভেরিফাই করা।

---

## ৫. Mocking

কখনো কখনো ডাটাবেস বা থার্ড-পার্টি এপিআই (API) এর ওপর টেস্ট রান করা কঠিন হয়। সেক্ষেত্রে **Mocking** ব্যবহার করে সেই ডাটার একটি ডামি (Dummy) ভার্সন তৈরি করা যায়।

---

::: tip
একটি আদর্শ নিয়ম হলো—আপনি যতটুকু কোড লিখবেন, তার জন্য অন্তত একটি টেস্ট কেস লিখে রাখা।
:::
