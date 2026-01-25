# মডিউল ৩: কাফকা সিঙ্গেল-নোড ইন্সটলেশন (Installation)

এই মডিউলে আমরা শিখব কিভাবে আপনার লোকাল মেশিনে (Windows/Linux) অ্যাপাচি কাফকা সেটআপ এবং রান করতে হয়।

## ১. পূর্বশর্ত এবং এনভায়রনমেন্ট সেটআপ (Pre-requisites)

কাফকা চালানোর জন্য আপনার সিস্টেমে অবশ্যই **Java (JDK 8 or higher)** ইন্সটল থাকতে হবে। কাফকা মূলত Scala এবং Java-তে লেখা, তাই এটি চালানোর জন্য Java Runtime Environment (JRE) প্রয়োজন।

### Java ইন্সটল আছে কি না চেক করুন:

টার্মিনাল বা কমান্ড প্রম্পটে গিয়ে নিচের কমান্ডটি দিন:

```bash
java -version
```

যদি Java ইন্সটল না থাকে, তবে [Oracle JDK](https://www.oracle.com/java/technologies/downloads/) অথবা [OpenJDK](https://openjdk.org/) থেকে ডাউনলোড করে ইন্সটল করে নিন।

## ২. কাফকা ডাউনলোড (Code Download)

অফিসিয়াল ওয়েবসাইট থেকে কাফকার বাইনারি ফাইল ডাউনলোড করতে হবে।

১. [kafka.apache.org/downloads](https://kafka.apache.org/downloads) লিংকে যান।
২. **Binary downloads** সেকশন থেকে লেটেস্ট রিলিজটি (যেমন: `kafka_2.13-3.6.1.tgz`) ডাউনলোড করুন।
৩. ডাউনলোড শেষ হলে ফাইলটি এক্সট্রাক্ট (Extract) করুন (যেমন: `C:\kafka` অথবা `/home/user/kafka` ডিরেক্টরিতে)।

## ৩. সিঙ্গেল ব্রোকার ইন্সটলেশন ও কনফিগারেশন

কাফকা চালানোর জন্য আপনাকে প্রথমে **Zookeeper** এবং তারপর **Kafka Server** স্টার্ট করতে হবে।

### ধাপ ১: জু-কিপার কনফিগারেশন (Zookeeper Setup)

কাফকা ফোল্ডারের ভেতরে `config/zookeeper.properties` ফাইলে জু-কিপারের সেটিংস থাকে। ডিফল্টভাবে এটি পোর্ট `2181`-এ চলে।

**জু-কিপার স্টার্ট করার কমান্ড:**

```bash
# Linux/Mac
bin/zookeeper-server-start.sh config/zookeeper.properties

# Windows
bin\windows\zookeeper-server-start.bat config\zookeeper.properties
```

### ধাপ ২: কাফকা সার্ভার কনফিগারেশন (Kafka Server Setup)

এবার `config/server.properties` ফাইলটি ওপেন করুন। এখানে কিছু গুরুত্বপূর্ণ সেটিংস আছে:

- `broker.id=0`: প্রতিটি ব্রোকারের একটি ইউনিক আইডি থাকে।
- `listeners=PLAINTEXT://:9092`: কাফকা ডিফল্টভাবে `9092` পোর্টে চলে।
- `log.dirs=/tmp/kafka-logs`: যেখানে কাফকার ডেটা সেভ হবে।

**কাফকা সার্ভার স্টার্ট করার কমান্ড:**

```bash
# Linux/Mac
bin/kafka-server-start.sh config/server.properties

# Windows
bin\windows\kafka-server-start.bat config\server.properties
```

---

## সফলভাবে ইন্সটল হয়েছে কি না চেক করবেন যেভাবে

সার্ভার স্টার্ট হয়ে গেলে আপনি একটি নতুন টার্মিনালে নিচের কমান্ডটি দিয়ে একটি টপিক তৈরি করে টেস্ট করতে পারেন:

```bash
# Topic তৈরি করা
bin/kafka-topics.sh --create --topic test-topic --bootstrap-server localhost:9092 --partitions 1 --replication-factor 1
```

যদি কোনো এরর না আসে, তার মানে আপনার কাফকা সিঙ্গেল-নোড ক্লাস্টার সফলভাবে কাজ করছে!

---

> [!IMPORTANT]
> কাফকা স্টার্ট করার আগে অবশ্যই জু-কিপার স্টার্ট হতে হবে। জু-কিপার বন্ধ করলে কাফকা কাজ করবে না।

> [!TIP]
> Windows ব্যবহারকারীরা কাফকা ফোল্ডারের পাথ যেন খুব বেশি বড় না হয় সেদিকে খেয়াল রাখবেন (যেমন: `C:\kafka`), কারণ পাথের দৈর্ঘ্য বেশি হলে অনেক সময় এরর দেখা দিতে পারে।
