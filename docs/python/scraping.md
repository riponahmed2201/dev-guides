# Web Scraping

ইন্টারনেট হলো তথ্যের বিশাল সমাহার। ওয়েবসাইট থেকে অটোমেটিক ডাটা রিড করা এবং তা সেভ করার প্রক্রিয়াকেই বলা হয় **Web Scraping**। পাইথনে এটি করার জন্য অত্যন্ত শক্তিশালী কিছু লাইব্রেরি আছে।

---

## ১. BeautifulSoup (Static Scraping)

যদি কোনো ওয়েবসাইটের ডাটা পিওর এইচটিএমএল (HTML) এ থাকে, তবে **BeautifulSoup** ব্যবহার করা সবচেয়ে সহজ এবং দ্রুত উপায়।

### Installation:
```bash
pip install beautifulsoup4 requests
```

### Example:
```python
import requests
from bs4 import BeautifulSoup

url = "https://example.com"
response = requests.get(url)
soup = BeautifulSoup(response.text, 'html.parser')

# শিরোনাম খুঁজে বের করা
title = soup.find('h1').text
print(title)

# সব লিঙ্ক (links) খুঁজে বের করা
links = soup.find_all('a')
for link in links:
    print(link.get('href'))
```

---

## ২. Selenium (Dynamic Scraping)

অনেক ওয়েবসাইট জাভাস্ক্রিপ্ট (JavaScript) ব্যবহার করে ডাটা লোড করে। সেক্ষেত্রে সাধারণ রিকোয়েস্ট কাজ করে না। তখন **Selenium** ব্যবহার করে একটি আসল ব্রাউজার (যেমন- Chrome বা Firefox) ওপেন করে ডাটা স্ক্র্যাপ করতে হয়।

### Installation:
```bash
pip install selenium
```

### Example:
```python
from selenium import webdriver

driver = webdriver.Chrome()
driver.get("https://dynamic-site.com")

# এলিমেন্ট খুঁজে বের করা
element = driver.find_element("id", "price")
print(element.text)

driver.quit()
```

---

## ৩. Scrapy (Professional Framework)

যদি আপনার অনেক বড় মাপের স্ক্র্যাপিং প্রোজেক্ট থাকে, তবে **Scrapy** ব্যবহার করা উচিত। এটি একটি পূর্ণাঙ্গ ফ্রেমওয়ার্ক যা অনেক ফাস্ট এবং এতে অটোমেটিক ডাটা সেভ এবং মাল্টি-থ্রেডিং সাপোর্ট আছে।

---

## ৪. Ethics & Legal (সতর্কতা)

ওয়েব স্ক্র্যাপিং করার আগে নিচের বিষয়গুলো খেয়াল রাখতে হবে:
- **`robots.txt`**: কোনো ওয়েবসাইট তাদের ডাটা নিতে বাধা দিচ্ছে কি না তা `example.com/robots.txt` এ গিয়ে চেক করুন।
- **Server Load**: খুব দ্রুত হাজার হাজার রিকোয়েস্ট পাঠাবেন না, এতে ওয়েবসাইট ক্র্যাশ করতে পারে বা আপনার আইপি (IP) ব্লক হয়ে যেতে পারে।
- **Privacy**: ব্যক্তিগত ডাটা (Private Data) স্ক্র্যাপ করা এড়িয়ে চলুন।

---

::: tip
বর্তমানে এআই (AI) এবং বড় ল্যাঙ্গুয়েজ মডেল প্রশিক্ষণের জন্য ওয়েব স্ক্র্যাপিং একটি অত্যন্ত ডিমান্ডিং স্কিল।
:::
