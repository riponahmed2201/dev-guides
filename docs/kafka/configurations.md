# মডিউল ৫: কাফকা কনফিগারেশন এবং ফ্রেমওয়ার্ক ইন্টিগ্রেশন

কাফকা ক্লাস্টার এবং টপিকগুলোকে সঠিকভাবে পরিচালনা করার জন্য কনফিগারেশন বোঝা অত্যন্ত জরুরি। এই মডিউলে আমরা ব্রোকার এবং টপিক লেভেলের কনফিগারেশন এবং বিভিন্ন জনপ্রিয় ফ্রেমওয়ার্কে কাফকা ব্যবহারের পূর্ণাঙ্গ প্রসেস দেখব।

---

## ১. ব্রোকার লেভেল কনফিগারেশন (Broker Level)

এই কনফিগারেশনগুলো পুরো কাফকা ক্লাস্টারের ওপর প্রভাব ফেলে এবং এগুলো `config/server.properties` ফাইলে সেট করা হয়।

- **log.retention.hours**: কাফকা কতক্ষণ মেসেজগুলো স্টোর করে রাখবে। ডিফল্টভাবে এটি ১৬৮ ঘণ্টা (৭ দিন)।
- **message.max.bytes**: একটি সিঙ্গেল মেসেজের সর্বোচ্চ সাইজ কত হতে পারবে। ডিফল্ট ১ মেগাবাইট।
- **auto.create.topics.enable**: যদি কোনো প্রডিউসার এমন টপিকে মেসেজ পাঠায় যা এখনো তৈরি হয়নি, তবে কি কাফকা নিজে থেকেই সেটি তৈরি করবে? প্রোডাকশনে এটি `false` রাখা ভালো।

---

## ২. টপিক লেভেল কনফিগারেশন (Topic Level)

আপনি প্রতিটি টপিকের জন্য আলাদা আলাদা কনফিগারেশন সেট করতে পারেন।

### টপিক কনফিগারেশন পরিবর্তন করা:

```bash
# Retention সময় ৭ দিন থেকে কমিয়ে ১ দিন (86400000 ms) করা
bin/kafka-configs.sh --bootstrap-server localhost:9092 --entity-type topics --entity-name my-topic --alter --add-config retention.ms=86400000
```

### লগ ক্লিনআপ পলিসি (Log Cleanup Policy):

- **Delete**: পুরনো ডেটা নির্দিষ্ট সময় পর ডিলিট করে দেয় (ডিফল্ট)।
- **Compact**: একই কী (Key) এর মেসেজগুলোর মধ্যে শুধুমাত্র লেটেস্ট মেসেজটি রাখে এবং পুরনো ভ্যালুগুলো ডিলিট করে দেয়।

---

## ৩. ফ্রেমওয়ার্ক ইন্টিগ্রেশন (Full Process)

বিভিন্ন ল্যাঙ্গুয়েজ এবং ফ্রেমওয়ার্কে কাফকা কিভাবে কনফিগার এবং ব্যবহার করবেন তার উদাহরণ নিচে দেওয়া হলো।

### Java (Spring Boot)

Spring Boot-এ `spring-kafka` ডিপেনডেন্সি ব্যবহার করা হয়।

```java
// application.properties
spring.kafka.bootstrap-servers=localhost:9092
spring.kafka.consumer.group-id=my-group

// Producer Service
@Service
public class KafkaProducer {
    @Autowired
    private KafkaTemplate<String, String> kafkaTemplate;

    public void sendMessage(String topic, String message) {
        kafkaTemplate.send(topic, message);
    }
}
```

### Python (FastAPI & Django/DRF)

#### A. FastAPI (using AIOCafka)

```python
# app.py
from fastapi import FastAPI
from aiokafka import AIOKafkaProducer
import asyncio

app = FastAPI()

@app.on_event("startup")
async def startup():
    app.producer = AIOKafkaProducer(bootstrap_servers='localhost:9092')
    await app.producer.start()

@app.post("/notify")
async def notify(msg: str):
    await app.producer.send_and_wait("my-topic", msg.encode())
    return {"status": "sent"}
```

#### B. Django / DRF (using confluent-kafka)

```python
# settings.py
KAFKA_CONFIG = {
    'bootstrap.servers': 'localhost:9092',
    'group.id': 'django-group',
    'auto.offset.reset': 'earliest'
}

# producer.py
from confluent_kafka import Producer
import json

def send_to_kafka(data):
    p = Producer({'bootstrap.servers': 'localhost:9092'})
    p.produce('user-events', json.dumps(data).encode('utf-8'))
    p.flush()
```

### Node.js (Express.js & NestJS)

#### A. Express.js (using KafkaJS)

```javascript
const { Kafka } = require("kafkajs");
const kafka = new Kafka({ clientId: "my-app", brokers: ["localhost:9092"] });
const producer = kafka.producer();

const startProducer = async () => {
  await producer.connect();
  await producer.send({
    topic: "test-topic",
    messages: [{ value: "Hello Kafka from Express!" }],
  });
};
```

#### B. NestJS

NestJS-এ বিল্ট-ইন মাইক্রোসার্ভিস মডিউল আছে।

```typescript
// main.ts
const app = await NestFactory.createMicroservice<MicroserviceOptions>(
  AppModule,
  {
    transport: Transport.KAFKA,
    options: {
      client: { brokers: ["localhost:9092"] },
      consumer: { groupId: "nestjs-consumer" },
    },
  },
);
```

### Laravel (PHP)

Laravel-এ `mateusjunges/laravel-kafka` প্যাকেজটি জনপ্রিয়।

```php
// config/kafka.php তে ব্রোকার সেট করুন
use Junges\Kafka\Facades\Kafka;

// Producer
Kafka::publishOn('my-topic')
    ->withBody(['message' => 'Hello from Laravel'])
    ->send();

// Consumer (Command)
Kafka::createConsumer(['my-topic'])
    ->withHandler(new Handler())
    ->build()
    ->consume();
```

---

> [!IMPORTANT]
> প্রতিটি ফ্রেমওয়ার্কে কাফকা ক্লায়েন্ট ব্যবহারের আগে সংশ্লিষ্ট লাইব্রেরি বা প্যাকেজগুলো ইন্সটল করে নিতে হবে (যেমন: `npm install kafkajs`, `pip install aiokafka`, ইত্যাদি)।

> [!TIP]
> রিয়েল-টাইম অ্যাপ্লিকেশনে কানেকশন পুলিং এবং এরর হ্যান্ডলিং (Retry mechanism) কনফিগার করা খুব জরুরি।
