# মডিউল ৫: মেসেজ প্যাটার্ন (Message Patterns)

এই মডিউলে আমরা RabbitMQ এর বিভিন্ন মেসেজিং প্যাটার্ন এবং গুরুত্বপূর্ণ কনসেপ্ট শিখব।

## ১. Work Queues (Task Distribution)

একাধিক worker এর মধ্যে কাজ ডিস্ট্রিবিউট করার জন্য।

```python
# Producer - Send tasks
import pika

connection = pika.BlockingConnection(pika.ConnectionParameters('localhost'))
channel = connection.channel()

channel.queue_declare(queue='task_queue', durable=True)

for i in range(10):
    message = f'Task {i}'
    channel.basic_publish(
        exchange='',
        routing_key='task_queue',
        body=message,
        properties=pika.BasicProperties(delivery_mode=2)  # Make message persistent
    )
    print(f" [x] Sent {message}")

connection.close()
```

```python
# Worker - Process tasks
def callback(ch, method, properties, body):
    print(f" [x] Processing {body}")
    import time
    time.sleep(body.count(b'.'))  # Simulate work
    print(" [x] Done")
    ch.basic_ack(delivery_tag=method.delivery_tag)

channel.basic_qos(prefetch_count=1)  # Fair dispatch
channel.basic_consume(queue='task_queue', on_message_callback=callback)
channel.start_consuming()
```

## ২. Publish/Subscribe Pattern

একটি মেসেজ একাধিক consumer কে পাঠানো।

```javascript
// Node.js Publisher
const amqp = require("amqplib");

async function publish() {
  const connection = await amqp.connect("amqp://localhost");
  const channel = await connection.createChannel();

  await channel.assertExchange("news", "fanout", { durable: false });

  const msg = "Breaking News!";
  channel.publish("news", "", Buffer.from(msg));
  console.log(" [x] Sent:", msg);

  setTimeout(() => connection.close(), 500);
}

publish();
```

```javascript
// Subscriber
async function subscribe() {
  const connection = await amqp.connect("amqp://localhost");
  const channel = await connection.createChannel();

  await channel.assertExchange("news", "fanout", { durable: false });
  const q = await channel.assertQueue("", { exclusive: true });

  channel.bindQueue(q.queue, "news", "");

  channel.consume(
    q.queue,
    (msg) => {
      console.log(" [x] Received:", msg.content.toString());
    },
    { noAck: true },
  );
}

subscribe();
```

## ৩. Request/Reply Pattern (RPC)

Synchronous request-response pattern।

```python
# RPC Client
import pika
import uuid

class RpcClient:
    def __init__(self):
        self.connection = pika.BlockingConnection(pika.ConnectionParameters('localhost'))
        self.channel = self.connection.channel()

        result = self.channel.queue_declare(queue='', exclusive=True)
        self.callback_queue = result.method.queue

        self.channel.basic_consume(
            queue=self.callback_queue,
            on_message_callback=self.on_response,
            auto_ack=True
        )

    def on_response(self, ch, method, props, body):
        if self.corr_id == props.correlation_id:
            self.response = body

    def call(self, n):
        self.response = None
        self.corr_id = str(uuid.uuid4())
        self.channel.basic_publish(
            exchange='',
            routing_key='rpc_queue',
            properties=pika.BasicProperties(
                reply_to=self.callback_queue,
                correlation_id=self.corr_id,
            ),
            body=str(n)
        )
        while self.response is None:
            self.connection.process_data_events()
        return int(self.response)

rpc = RpcClient()
print(" [x] Requesting fib(30)")
response = rpc.call(30)
print(f" [.] Got {response}")
```

## ৪. Message Acknowledgments

মেসেজ সফলভাবে প্রসেস হয়েছে তা নিশ্চিত করা।

```python
# Manual ACK
def callback(ch, method, properties, body):
    print(f" [x] Received {body}")
    # Process message
    ch.basic_ack(delivery_tag=method.delivery_tag)  # Acknowledge

channel.basic_consume(queue='task_queue', on_message_callback=callback)
```

```python
# NACK (Negative Acknowledgment) - Requeue message
def callback(ch, method, properties, body):
    try:
        # Process message
        process(body)
        ch.basic_ack(delivery_tag=method.delivery_tag)
    except Exception as e:
        print(f"Error: {e}")
        ch.basic_nack(delivery_tag=method.delivery_tag, requeue=True)
```

## ৫. Message Durability

সার্ভার রিস্টার্ট হলেও মেসেজ যাতে না হারায়।

```python
# Durable queue
channel.queue_declare(queue='durable_queue', durable=True)

# Persistent message
channel.basic_publish(
    exchange='',
    routing_key='durable_queue',
    body='Important message',
    properties=pika.BasicProperties(delivery_mode=2)  # Persistent
)
```

## ৬. Message TTL (Time To Live)

মেসেজের জীবনকাল নির্ধারণ করা।

```python
# Per-message TTL
channel.basic_publish(
    exchange='',
    routing_key='my_queue',
    body='Expires in 60 seconds',
    properties=pika.BasicProperties(expiration='60000')  # milliseconds
)
```

```python
# Queue-level TTL
channel.queue_declare(
    queue='ttl_queue',
    arguments={'x-message-ttl': 60000}  # All messages expire in 60s
)
```

## ৭. Dead Letter Exchange (DLX)

যে মেসেজগুলো প্রসেস করা যায়নি সেগুলো অন্য queue-তে পাঠানো।

```python
# Declare queue with DLX
channel.queue_declare(
    queue='main_queue',
    arguments={
        'x-dead-letter-exchange': 'dlx_exchange',
        'x-dead-letter-routing-key': 'failed'
    }
)

# DLX exchange and queue
channel.exchange_declare(exchange='dlx_exchange', exchange_type='direct')
channel.queue_declare(queue='dead_letter_queue')
channel.queue_bind(exchange='dlx_exchange', queue='dead_letter_queue', routing_key='failed')
```

---

> [!IMPORTANT]
> প্রোডাকশনে সবসময় manual acknowledgment ব্যবহার করুন যাতে মেসেজ লস না হয়।
