# Comprehensions

পাইথনের একটি অত্যন্ত জনপ্রিয় এবং শক্তিশালী ফিচার হলো **Comprehensions**। এটি কোডকে এক লাইনে এবং অনেক বেশি পাঠযোগ্য (Readable) করে তোলে। 

---

## ১. List Comprehension

লিস্ট তৈরি করার সবচেয়ে পাইথনিক (Pythonic) উপায় হলো এটি।

```python
# সাধারণ পদ্ধতি:
nums = [1, 2, 3, 4, 5]
squares = []
for x in nums:
    squares.append(x * x)

# Comprehension ব্যবহার করে:
squares = [x * x for x in nums]
```

### With Condition (শর্তসহ):
```python
# শুধু জোড় সংখ্যার স্কয়ার:
even_squares = [x * x for x in nums if x % 2 == 0]
# [4, 16]
```

---

## ২. Dictionary Comprehension

ডিকশনারি তৈরির সময়ও এটি ব্যবহার করা যায়।

```python
names = ["Ripon", "Shuvo", "Papon"]
# নামকে Key এবং নামের দৈর্ঘ্যকে Value হিসেবে রাখা:
name_lengths = {name: len(name) for name in names}
# {'Ripon': 5, 'Shuvo': 5, 'Papon': 5}
```

---

## ৩. Set Comprehension

সেটের ক্ষেত্রেও এটি অনেকটা লিস্টের মতোই কাজ করে, শুধু সেকেন্ড ব্র্যাকেট `{ }` ব্যবহার করতে হয়।

```python
nums = [1, 2, 2, 3, 4, 4, 5]
unique_squares = {x * x for x in nums}
# {1, 4, 9, 16, 25} (ডুপ্লিকেট থাকবে না)
```

---

## ৪. Nested Comprehensions

একটি কমপ্রিহেনশনের ভেতরে আরেকটি ইটারেশন চালানো যায়। এটি মেট্রিক্স (Matrix) নিয়ে কাজ করতে ব্যবহৃত হয়।

```python
matrix = [[1, 2], [3, 4]]
flat_list = [num for row in matrix for num in row]
# [1, 2, 3, 4]
```

---

## ৫. কেন ব্যবহার করবেন?

- **ক্লিন কোড**: অনেকগুলো লাইনের লুপ এক লাইনে সুন্দরভাবে প্রকাশ করা যায়।
- **পারফরম্যান্স**: সাধারণ লুপের চেয়ে কমপ্রিহেনশন কিছুটা দ্রুত কাজ করে।

::: warning সতর্কতা
জটিল লুপের ক্ষেত্রে কমপ্রিহেনশন ব্যবহার করলে কোড বুঝতে কষ্ট হতে পারে। সেক্ষেত্রে সাধারণ লুপ ব্যবহার করাই শ্রেয়।
:::
