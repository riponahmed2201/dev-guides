# মডিউল ৯: পারফরম্যান্স টিউনিং (Performance Tuning)

RabbitMQ এর পারফরম্যান্স অপ্টিমাইজ করা প্রোডাকশনে অত্যন্ত গুরুত্বপূর্ণ।

## ১. Message Throughput Optimization

### Prefetch Count Configuration:

```python
# Set prefetch count
channel.basic_qos(prefetch_count=10)

# Higher prefetch = better throughput, but uneven distribution
# Lower prefetch = fair distribution, but lower throughput
```

**Best Practice**: Start with 10-20 এবং load test করে adjust করুন।

### Batch Publishing:

```python
# Publish messages in batches
for i in range(1000):
    channel.basic_publish(
        exchange='',
        routing_key='my_queue',
        body=f'Message {i}'
    )
# Commit after batch
connection.close()
```

### Publisher Confirms:

```python
# Enable publisher confirms for reliability
channel.confirm_delivery()

try:
    channel.basic_publish(exchange='', routing_key='queue', body='msg')
    print("Message delivered")
except pika.exceptions.UnroutableError:
    print("Message could not be routed")
```

## ২. Memory Management

### Memory Limits:

```conf
# rabbitmq.conf
# Set memory threshold (40% of total RAM)
vm_memory_high_watermark.relative = 0.4

# Or absolute value
vm_memory_high_watermark.absolute = 2GB
```

### Lazy Queues:

Lazy queues মেসেজগুলো disk-এ রাখে, RAM-এ নয়।

```python
# Declare lazy queue
channel.queue_declare(
    queue='lazy_queue',
    durable=True,
    arguments={'x-queue-mode': 'lazy'}
)
```

**Use Case**: যখন অনেক বড় queue থাকে বা মেসেজ সাইজ বড়।

### Message Size Optimization:

```python
# Compress large messages
import gzip
import json

data = {'large': 'payload' * 1000}
compressed = gzip.compress(json.dumps(data).encode())

channel.basic_publish(
    exchange='',
    routing_key='queue',
    body=compressed,
    properties=pika.BasicProperties(content_encoding='gzip')
)
```

## ৩. Disk I/O Optimization

### Persistent Messages:

```python
# Only make critical messages persistent
channel.basic_publish(
    exchange='',
    routing_key='important_queue',
    body='Critical message',
    properties=pika.BasicProperties(delivery_mode=2)  # Persistent
)
```

### Queue Durability:

```python
# Durable queues survive restarts
channel.queue_declare(queue='durable_queue', durable=True)

# Non-durable for temporary queues
channel.queue_declare(queue='temp_queue', durable=False)
```

### Disk Space Management:

```conf
# Set disk free limit
disk_free_limit.absolute = 5GB

# Or percentage
disk_free_limit.relative = 1.5
```

## ৪. Connection Pooling

### Python Connection Pool:

```python
import pika
from pika import pool

# Create connection pool
connection_pool = pool.QueuedPool(
    create=lambda: pika.BlockingConnection(
        pika.ConnectionParameters('localhost')
    ),
    max_size=10,
    max_overflow=10,
    timeout=10,
    recycle=3600
)

# Use connection from pool
with connection_pool.acquire() as connection:
    channel = connection.channel()
    channel.basic_publish(exchange='', routing_key='queue', body='msg')
```

### Node.js Connection Pool:

```javascript
const amqp = require("amqp-connection-manager");

const connection = amqp.connect(["amqp://localhost"]);

const channelWrapper = connection.createChannel({
  json: true,
  setup: (channel) => channel.assertQueue("my_queue", { durable: true }),
});

// Reuse channel
channelWrapper.sendToQueue("my_queue", { foo: "bar" });
```

## ৫. Network Optimization

### TCP Buffer Sizes:

```conf
# rabbitmq.conf
tcp_listen_options.backlog = 128
tcp_listen_options.nodelay = true
tcp_listen_options.sndbuf = 196608
tcp_listen_options.recvbuf = 196608
```

### Heartbeat Configuration:

```python
# Set heartbeat interval
parameters = pika.ConnectionParameters(
    host='localhost',
    heartbeat=60  # seconds
)
```

## ৬. Queue Performance

### Queue Length Limit:

```python
# Limit queue length to prevent memory issues
channel.queue_declare(
    queue='limited_queue',
    arguments={
        'x-max-length': 10000,
        'x-overflow': 'reject-publish'  # or 'drop-head'
    }
)
```

### Multiple Queues:

```python
# Distribute load across multiple queues
for i in range(10):
    channel.queue_declare(queue=f'queue_{i}')
    channel.queue_bind(exchange='load_balanced', queue=f'queue_{i}')
```

## ৭. Monitoring Performance Metrics

### Key Metrics to Monitor:

```bash
# Message rates
rabbitmqctl list_queues name messages_ready messages_unacknowledged message_stats

# Connection count
rabbitmqctl list_connections name state

# Memory usage
rabbitmqctl status | grep memory

# File descriptors
rabbitmqctl status | grep file_descriptors
```

### Performance Benchmarking:

```bash
# Install perf test tool
wget https://github.com/rabbitmq/rabbitmq-perf-test/releases/download/v2.18.0/perf-test-2.18.0.jar

# Run performance test
java -jar perf-test-2.18.0.jar \
  --producers 10 \
  --consumers 10 \
  --rate 1000 \
  --queue-pattern 'perf-test-%d' \
  --queue-pattern-from 1 \
  --queue-pattern-to 10
```

---

> [!TIP]
> সবসময় production-like environment এ load testing করুন tuning করার আগে। প্রতিটি সিস্টেম আলাদা, তাই generic advice সবসময় কাজ নাও করতে পারে।
