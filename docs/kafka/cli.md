# মডিউল ৪: কাফকা সিএলআই (Kafka Command Line Interface)

কাফকা ইন্সটল করার পর এর সাথে কাজ করার সবচেয়ে সহজ উপায় হলো কমান্ড লাইন ইন্টারফেস বা CLI ব্যবহার করা। এই মডিউলে আমরা গুরুত্বপূর্ণ কিছু সিএলআই কমান্ড সম্পর্কে জানব।

> [!NOTE]
> আপনি যদি Linux/Mac ব্যবহার করেন তবে `bin/` ডিরেক্টরি ব্যবহার করবেন। আর Windows ব্যবহারকারী হলে `bin\windows\` ডিরেক্টরি এবং `.bat` এক্সটেনশন ব্যবহার করবেন।

## ১. কাফকা টপিক ম্যানেজমেন্ট (Topics)

টপিক তৈরি, লিস্ট চেক করা এবং বিস্তারিত দেখার জন্য `kafka-topics` স্ক্রিপ্ট ব্যবহার করা হয়।

### টপিক তৈরি করা (Create Topic)

ধরা যাক আমরা `first-topic` নামে একটি টপিক তৈরি করব যার **Partition** হবে ৩টি এবং **Replication Factor** হবে ১টি।

```bash
# Linux/Mac
bin/kafka-topics.sh --create --topic first-topic --bootstrap-server localhost:9092 --partitions 3 --replication-factor 1

# Windows
bin\windows\kafka-topics.bat --create --topic first-topic --bootstrap-server localhost:9092 --partitions 3 --replication-factor 1
```

### টপিক লিস্ট দেখা (List Topics)

আপনার ক্লাস্টারে কতগুলো টপিক আছে তা দেখতে:

```bash
bin/kafka-topics.sh --list --bootstrap-server localhost:9092
```

### টপিকের বিস্তারিত দেখা (Describe Topic)

কোন টপিকে কয়টি পার্টীশন আছে এবং তার স্থিতি কী তা দেখতে:

```bash
bin/kafka-topics.sh --describe --topic first-topic --bootstrap-server localhost:9092
```

### টপিক ডিলিট করা (Delete Topic)

```bash
bin/kafka-topics.sh --delete --topic first-topic --bootstrap-server localhost:9092
```

## ২. কনসোল প্রডিউসার (Console Producer)

কোন কোড লেখা ছাড়াই কমান্ড লাইন থেকে টপিকে মেসেজ পাঠানোর জন্য `kafka-console-producer` ব্যবহার করা হয়।

```bash
bin/kafka-console-producer.sh --topic first-topic --bootstrap-server localhost:9092
```

এটি চালানোর পর আপনি যা লিখবেন, সেটিই মেসেজ হিসেবে কাফকায় চলে যাবে।

## ৩. কনসোল কনজিউমার (Console Consumer)

টপিক থেকে রিয়েল-টাইমে মেসেজ পড়ার জন্য `kafka-console-consumer` ব্যবহার করা হয়।

### নতুন মেসেজ পড়া:

```bash
bin/kafka-console-consumer.sh --topic first-topic --bootstrap-server localhost:9092
```

### শুরু থেকে সব মেসেজ পড়া:

যদি আপনি টপিকের একদম শুরুর মেসেজ থেকে সব পড়তে চান, তবে `--from-beginning` ফ্ল্যাগটি ব্যবহার করুন।

```bash
bin/kafka-console-consumer.sh --topic first-topic --bootstrap-server localhost:9092 --from-beginning
```

## ৪. কনজিউমার গ্রুপ (Console Consumer Groups)

কনজিউমার গ্রুপগুলো ম্যানেজ করার জন্য `kafka-consumer-groups` কমান্ডটি ব্যবহৃত হয়।

### গ্রুপের লিস্ট দেখা:

```bash
bin/kafka-consumer-groups.sh --list --bootstrap-server localhost:9092
```

### একটি নির্দিষ্ট গ্রুপের অফসেট এবং ল্যাগ (Lag) চেক করা:

ল্যাগ দেখে বোঝা যায় কনজিউমার কতটুকু পিছিয়ে আছে।

```bash
bin/kafka-consumer-groups.sh --describe --group my-group --bootstrap-server localhost:9092
```

---

> [!TIP]
> প্রোডাকশন এনভায়রনমেন্টে সবসময় একাধিক পার্টীশন এবং রেপ্লিকেশন ফ্যাক্টর (সাধারণত ৩) ব্যবহার করা উচিত যাতে সিস্টেম হাইলি অ্যাভেইল্যাবল থাকে।
