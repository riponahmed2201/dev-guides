# Real-World Project: Redis Cache with Python Flask

অ্যাপ্লিকেশনের পারফরম্যান্স বাড়ানোর জন্য **Caching** একটি অত্যন্ত কার্যকরী টেকনিক। এই প্রজেক্টে আমরা দেখব কীভাবে একটি Python Flask অ্যাপ্লিকেশনে **Redis** ব্যবহার করে ডাটা ক্যাশ করা যায়, যাতে বারবার ডাটাবেস বা ভারী ক্যালকুলেশন করতে না হয়।

## প্রজেক্টের লক্ষ্য

- একটি "Sluggish" বা ধীরগতির ফাংশন তৈরি করা (যা হেভি কম্পিউটেশন সিমুলেট করবে)।
- প্রথমবার রিকোয়েস্টে রেজাল্ট ক্যালকুলেট করে Redis এ ক্যাশ করা।
- পরবর্তী রিকোয়েস্টে Redis থেকে ইনস্ট্যান্টলি রেজাল্ট রিটার্ন করা।

---

## ১. প্রজেক্ট স্ট্রাকচার

ফোল্ডার স্ট্রাকচার তৈরি করুন:

```bash
mkdir redis-cache-demo
cd redis-cache-demo
```

---

## ২. অ্যাপ্লিকেশন ফাইল তৈরি

### app.py

```python
import time
import redis
from flask import Flask

app = Flask(__name__)
# Redis কন্টেইনারের সাথে কানেক্ট করা হচ্ছে (host='redis')
cache = redis.Redis(host='redis', port=6379)

def get_hit_count():
    retries = 5
    while True:
        try:
            return cache.incr('hits')
        except redis.exceptions.ConnectionError as exc:
            if retries == 0:
                raise exc
            retries -= 1
            time.sleep(0.5)

@app.route('/')
def hello():
    count = get_hit_count()
    return 'Hello World! I have been seen {} times.\n'.format(count)

@app.route('/heavy')
def heavy_computation():
    # প্রথমে চেক করি ক্যাশে ডাটা আছে কিনা
    if cache.exists('heavy_result'):
        print("Cache HIT!")
        return f"Result (from Cache): {cache.get('heavy_result').decode('utf-8')}\n"

    # ক্যাশে না থাকলে ক্যালকুলেট করি (সিমুলেশন: ৫ সেকেন্ড সময় লাগবে)
    print("Cache MISS! Computing...")
    time.sleep(5)
    result = "This was a heavy computation result."

    # রেজাল্ট ক্যাশে সেভ করি (৬০ সেকেন্ডের জন্য)
    cache.set('heavy_result', result, ex=60)

    return f"Result (Computed): {result}\n"

if __name__ == "__main__":
    app.run(host="0.0.0.0", debug=True)
```

### requirements.txt

```text
flask
redis
```

### Dockerfile

```dockerfile
FROM python:3.9-slim
WORKDIR /app
COPY requirements.txt requirements.txt
RUN pip install -r requirements.txt
COPY . .
CMD ["python", "app.py"]
```

---

## ৩. Docker Compose (Orchestration)

`docker-compose.yml` ফাইল তৈরি করুন:

```yaml
version: "3.8"

services:
  web:
    build: .
    ports:
      - "5000:5000"
    volumes:
      - .:/app
    depends_on:
      - redis
    networks:
      - cache-net

  redis:
    image: "redis:alpine"
    networks:
      - cache-net

networks:
  cache-net:
    driver: bridge
```

---

## ৪. রান এবং টেস্ট

১. অ্যাপ্লিকেশন রান করুন:

```bash
docker-compose up --build
```

২. ব্রাউজারে বা `curl` দিয়ে টেস্ট করুন।

**প্রথম রিকোয়েস্ট (Cache Miss):**

```bash
$ curl http://localhost:5000/heavy
Cache MISS! Computing...
# ... ৫ সেকেন্ড অপেক্ষা করুন ...
Result (Computed): This was a heavy computation result.
```

ಟರ್মিনাল লগে খেয়াল করুন, এটি "Cache MISS" দেখাবে এবং ৫ সেকেন্ড সময় নিবে।

**দ্বিতীয় রিকোয়েস্ট (Cache Hit):**

```bash
$ curl http://localhost:5000/heavy
Cache HIT!
Result (from Cache): This was a heavy computation result.
```

এবার রেসপন্স আসবে **তাৎক্ষণিকভাবে**! কারণ এটি আর ক্যালকুলেট করেনি, Redis থেকে সরাসরি ডাটা দিয়েছে।

## সারাংশ

এই প্রজেক্টে আমরা দেখলাম কীভাবে ডকার এবং রেডিস ব্যবহার করে অ্যাপ্লিকেশনের রেসপন্স টাইম নাটকীয়ভাবে কমানো যায়। মাইক্রোসার্ভিস আর্কিটেকচারে এটি খুবই কমন একটি প্যাটার্ন।
