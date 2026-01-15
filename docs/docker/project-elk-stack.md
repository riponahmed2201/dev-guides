# Real-World Project: ELK Stack (Centralized Logging)

বড় স্কেলের অ্যাপ্লিকেশনে লগ ম্যানেজমেন্ট একটি বড় চ্যালেঞ্জ। **ELK Stack** (Elasticsearch, Logstash, Kibana) হলো লগ কালেকশন, প্রসেসিং এবং ভিজুয়ালাইজেশনের জন্য ইন্ডাস্ট্রি স্ট্যান্ডার্ড সলিউশন। এই প্রজেক্টে আমরা ডকার কম্পোজ ব্যবহার করে একটি ফুল ELK স্ট্যাক তৈরি করব।

## প্রজেক্টের লক্ষ্য

- **Elasticsearch:** লগ স্টোর এবং সার্চ করার জন্য।
- **Logstash:** লগ রিসিভ এবং প্রসেস করার জন্য।
- **Kibana:** লগ ভিজুয়ালাইজ করার জন্য ড্যাশবোর্ড।

---

## ১. প্রজেক্ট স্ট্রাকচার

ফোল্ডার স্ট্রাকচার তৈরি করুন:

```bash
mkdir elk-stack
cd elk-stack
mkdir logstash pipeline
```

---

## ২. Logstash কনফিগারেশন

Logstash এর কাজ হলো বিভিন্ন সোর্স থেকে ডাটা নেওয়া, ফিল্টার করা এবং ইলাস্টিকসার্চে পাঠানো।

`logstash/pipeline/logstash.conf` ফাইল তৈরি করুন:

```conf
input {
  # আমরা TCP পোর্ট 5000 এ লগ রিসিভ করব
  tcp {
    port => 5000
    codec => json_lines
  }
}

filter {
  # এখানে লগ ফিল্টার বা মডিফাই করা যায়
}

output {
  # প্রসেস করা লগ ইলাস্টিকসার্চে পাঠানো হবে
  elasticsearch {
    hosts => ["elasticsearch:9200"]
    index => "docker-logs-%{+YYYY.MM.dd}"
  }
}
```

---

## ৩. Docker Compose (Orchestration)

`docker-compose.yml` ফাইল তৈরি করুন:

```yaml
version: "3.8"

services:
  # 1. Elasticsearch (Database for Logs)
  elasticsearch:
    image: docker.elastic.co/elasticsearch/elasticsearch:7.17.10
    container_name: elasticsearch
    environment:
      - discovery.type=single-node
      - "ES_JAVA_OPTS=-Xms512m -Xmx512m" # মেমরি লিমিট সেট করা
    ports:
      - "9200:9200"
    volumes:
      - elasticsearch_data:/usr/share/elasticsearch/data
    networks:
      - elk-net

  # 2. Logstash (Log Processor)
  logstash:
    image: docker.elastic.co/logstash/logstash:7.17.10
    container_name: logstash
    volumes:
      - ./logstash/pipeline:/usr/share/logstash/pipeline
    ports:
      - "5000:5000"
    depends_on:
      - elasticsearch
    networks:
      - elk-net

  # 3. Kibana (Visualization UI)
  kibana:
    image: docker.elastic.co/kibana/kibana:7.17.10
    container_name: kibana
    ports:
      - "5601:5601"
    depends_on:
      - elasticsearch
    networks:
      - elk-net

networks:
  elk-net:
    driver: bridge

volumes:
  elasticsearch_data:
```

---

## ৪. রান করা

স্ট্যাক রান করুন (প্রথমবার রান হতে এবং ইলাস্টিকসার্চ রেডি হতে কিছুটা সময় লাগতে পারে):

```bash
docker-compose up -d
```

---

## ৫. লগ পাঠানো এবং Kibana তে দেখা

### লগ জেনারেট করা

আমরা একটি টেস্ট কন্টেইনার দিয়ে লগ পাঠাব। লিনাক্সের `nc` (netcat) বা যেকোনো অ্যাপ থেকে TCP 5000 পোর্টে JSON ডাটা পাঠিয়ে টেস্ট করা যায়।

অথবা, ডকার লগিং ড্রাইভার ব্যবহার করে কোনো কন্টেইনারের লগ সরাসরি Logstash এ পাঠানো যায়। তবে সহজ পরীক্ষার জন্য আমরা ম্যানুয়ালি ডাটা পাঠাই:

```bash
# লিনাক্স/ম্যাক টার্মিনালে
echo '{"message": "Hello from Docker", "level": "INFO"}' | nc localhost 5000
```

(উইন্ডোজে `nc` না থাকলে আপনি একটি সিম্পল পাইথন স্ক্রিপ্ট বা পোস্টম্যান দিয়েও TCP রিকোয়েস্ট পাঠাতে পারেন, অথবা আলাদা একটি টেস্ট কন্টেইনার ব্যবহার করতে পারেন যা লগ জেনারেট করে)।

### Kibana ড্যাশবোর্ড সেটআপ

- ব্রাউজারে যান: `http://localhost:5601`
- **Management** > **Stack Management** > **Index Patterns** এ যান।
- **Create index pattern** এ ক্লিক করুন।
- লিখুন: `docker-logs-*` (আমরা Logstash কনফিগে এই ইনডেক্স প্যাটার্ন দিয়েছিলাম)।
- **Timestamp field** হিসেবে `@timestamp` সিলেক্ট করুন এবং **Create index pattern** এ ক্লিক করুন।

এখন **Discover** মেনুতে গেলে আপনি আপনার পাঠানো লগগুলো দেখতে পাবেন।

## সারাংশ

এই প্রজেক্টে আমরা দেখলাম কীভাবে একটি সেন্ট্রালাইজড লগিং সিস্টেম তৈরি করা যায়। প্রোডাকশনে শত শত কন্টেইনারের লগ আলাদাভাবে চেক করা অসম্ভব, তাই ELK Stack এর মতো সলিউশন অপরিহার্য।
