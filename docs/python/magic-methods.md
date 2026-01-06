# Special Methods (Magic Methods)

পাইথনে এমন কিছু মেথড আছে যাদের নামের শুরুতে এবং শেষে ডাবল আন্ডারস্কোর থাকে (যেমন: `__init__`)। এদেরকে **Magic Methods** বা **Dunder Methods** বলা হয়। এগুলো পাইথনের বিল্ট-ইন ফাংশনগুলোর আচরণ নিয়ন্ত্রণ করতে পারে।

---

## ১. `__str__` এবং `__repr__`

একটি অবজেক্ট যখন প্রিন্ট করা হয়, তখন তা দেখতে কেমন হবে তা এই মেথডগুলো ঠিক করে।

- **`__str__`**: ইউজারের পড়ার জন্য (User-friendly)।
- **`__repr__`**: ডেভেলপারদের দেখার জন্য (Debugging)।

```python
class Book:
    def __init__(self, title, author):
        self.title = title
        self.author = author

    def __str__(self):
        return f"'{self.title}' by {self.author}"

b = Book("The Python Handbook", "Ripon")
print(b) # Output: 'The Python Handbook' by Ripon
```

---

## ২. Operator Overloading (`__add__`, `__sub__`, etc.)

আপনি চাইলে পাইথনের গাণিতিক অপারেটরগুলোকে (+, -, *, /) নিজের মতো করে কাজ করাতে পারেন। 

```python
class Point:
    def __init__(self, x, y):
        self.x = x
        self.y = y

    def __add__(self, other): # '+' অপারেটর ওভারলোড করা
        return Point(self.x + other.x, self.y + other.y)

    def __str__(self):
        return f"({self.x}, {self.y})"

p1 = Point(1, 2)
p2 = Point(3, 4)
p3 = p1 + p2
print(p3) # Output: (4, 6)
```

---

## ৩. Length এবং Indexing (`__len__`, `__getitem__`)

কোনো ক্লাসের অবজেক্টকে লিস্টের মতো আচরণ করাতে চাইলে এগুলো ব্যবহার করা হয়।

```python
class Team:
    def __init__(self, members):
        self.members = members

    def __len__(self):
        return len(self.members)

    def __getitem__(self, index):
        return self.members[index]

my_team = Team(["Ripon", "Shuvo", "Papon"])
print(len(my_team))     # ৩
print(my_team[0])       # Ripon
```

---

## ৪. Call মেথড (`__call__`)

এই মেথড ব্যবহার করলে আপনি একটি অবজেক্টকে ফাংশনের মতো কল করতে পারবেন।

```python
class Greeter:
    def __call__(self, name):
        print(f"Hello {name}!")

hi = Greeter()
hi("Ripon") # অবজেক্টকে ফাংশনের মতো কল করা হলো
```

---

::: tip
ম্যাজিক মেথডগুলো ব্যবহার করে আপনার কাস্টম ক্লাসগুলোকে পাইথনের বিল্ট-ইন ডাটা টাইপের মতো শক্তিশালী এবং সহজ করা সম্ভব।
:::
