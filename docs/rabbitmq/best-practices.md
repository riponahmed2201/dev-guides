# মডিউল ১০: বেস্ট প্র্যাকটিস ও প্রোডাকশন ডিপ্লয়মেন্ট (Best Practices)

এই মডিউলে আমরা RabbitMQ প্রোডাকশনে ডিপ্লয় করার জন্য গুরুত্বপূর্ণ best practices শিখব।

## ১. Production Checklist

### Infrastructure:

- ✅ কমপক্ষে ৩টি নোড দিয়ে cluster সেটআপ করুন
- ✅ Quorum queues ব্যবহার করুন high availability এর জন্য
- ✅ Separate disk for RabbitMQ data
- ✅ Adequate RAM (minimum 4GB per node)
- ✅ Fast network between nodes

### Security:

- ✅ SSL/TLS enable করুন
- ✅ Default `guest` user ডিলিট করুন
- ✅ Strong passwords ব্যবহার করুন
- ✅ Firewall rules সেট করুন
- ✅ Virtual hosts দিয়ে isolation করুন

### Monitoring:

- ✅ Prometheus + Grafana সেটআপ করুন
- ✅ Alerts configure করুন (memory, disk, queue depth)
- ✅ Log aggregation সেটআপ করুন
- ✅ Regular health checks

### Configuration:

- ✅ Memory limits সেট করুন
- ✅ Disk space limits সেট করুন
- ✅ Connection limits সেট করুন
- ✅ Message TTL configure করুন

## ২. High Availability Setup

### 3-Node Cluster Architecture:

```mermaid
graph TB
    LB[Load Balancer]

    subgraph RabbitMQ Cluster
    N1[Node 1]
    N2[Node 2]
    N3[Node 3]
    end

    LB --> N1
    LB --> N2
    LB --> N3

    N1 <--> N2
    N2 <--> N3
    N3 <--> N1
```

### HAProxy Configuration:

```conf
# haproxy.cfg
listen rabbitmq
    bind *:5672
    mode tcp
    balance roundrobin
    server rabbit1 192.168.1.101:5672 check inter 5s rise 2 fall 3
    server rabbit2 192.168.1.102:5672 check inter 5s rise 2 fall 3
    server rabbit3 192.168.1.103:5672 check inter 5s rise 2 fall 3
```

## ৩. Backup and Recovery

### Backup Strategy:

```bash
# Export definitions (exchanges, queues, bindings)
rabbitmqadmin export /backup/definitions.json

# Backup messages (requires shovel or federation)
# Use rabbitmqadmin to list and backup queue messages
```

### Restore:

```bash
# Import definitions
rabbitmqadmin import /backup/definitions.json
```

### Automated Backup Script:

```bash
#!/bin/bash
BACKUP_DIR="/backup/rabbitmq"
DATE=$(date +%Y%m%d_%H%M%S)

# Export definitions
rabbitmqadmin export "$BACKUP_DIR/definitions_$DATE.json"

# Rotate old backups (keep last 7 days)
find $BACKUP_DIR -name "definitions_*.json" -mtime +7 -delete
```

## ৪. Capacity Planning

### Estimating Resources:

**Memory Calculation:**

```
Required RAM = (Number of Queues × Average Queue Depth × Average Message Size) + Overhead

Example:
- 100 queues
- 10,000 messages per queue
- 1KB average message size
= 100 × 10,000 × 1KB = 1GB + 2GB overhead = 3GB minimum
```

**Disk Space:**

```
Disk Space = Message Rate × Retention Time × Message Size

Example:
- 1000 msg/sec
- 24 hours retention
- 2KB average size
= 1000 × 86400 × 2KB = 172GB
```

## ৫. Common Pitfalls and Solutions

### Problem 1: Memory Alarms

**Symptom**: Publishers blocked, "memory alarm" in logs

**Solution:**

```conf
# Increase memory threshold
vm_memory_high_watermark.relative = 0.6

# Use lazy queues
x-queue-mode: lazy
```

### Problem 2: Slow Consumer

**Symptom**: Queue depth growing, messages piling up

**Solution:**

```python
# Increase prefetch count
channel.basic_qos(prefetch_count=50)

# Scale consumers horizontally
# Add more consumer instances
```

### Problem 3: Connection Leaks

**Symptom**: Too many connections, file descriptor limit reached

**Solution:**

```python
# Always close connections
try:
    connection = pika.BlockingConnection(params)
    # ... work ...
finally:
    connection.close()

# Use connection pooling
```

### Problem 4: Message Loss

**Symptom**: Messages disappearing

**Solution:**

```python
# Use durable queues
channel.queue_declare(queue='important', durable=True)

# Use persistent messages
properties=pika.BasicProperties(delivery_mode=2)

# Use publisher confirms
channel.confirm_delivery()

# Use manual acknowledgments
channel.basic_consume(queue='q', on_message_callback=callback, auto_ack=False)
```

## ৬. Application Integration Examples

### Java (Spring Boot):

```java
@Configuration
public class RabbitConfig {
    @Bean
    public ConnectionFactory connectionFactory() {
        CachingConnectionFactory factory = new CachingConnectionFactory("localhost");
        factory.setUsername("user");
        factory.setPassword("password");
        return factory;
    }

    @Bean
    public RabbitTemplate rabbitTemplate() {
        return new RabbitTemplate(connectionFactory());
    }
}

@Service
public class MessageProducer {
    @Autowired
    private RabbitTemplate rabbitTemplate;

    public void send(String message) {
        rabbitTemplate.convertAndSend("myQueue", message);
    }
}
```

### Python (Django):

```python
# settings.py
CELERY_BROKER_URL = 'amqp://user:password@localhost:5672//'

# tasks.py
from celery import shared_task

@shared_task
def process_order(order_id):
    # Process order
    return f"Processed order {order_id}"
```

### Node.js (NestJS):

```typescript
// app.module.ts
import { Module } from "@nestjs/common";
import { ClientsModule, Transport } from "@nestjs/microservices";

@Module({
  imports: [
    ClientsModule.register([
      {
        name: "RABBITMQ_SERVICE",
        transport: Transport.RMQ,
        options: {
          urls: ["amqp://localhost:5672"],
          queue: "my_queue",
          queueOptions: {
            durable: true,
          },
        },
      },
    ]),
  ],
})
export class AppModule {}
```

---

> [!IMPORTANT]
> প্রোডাকশনে যাওয়ার আগে অবশ্যই load testing করুন এবং disaster recovery plan তৈরি করুন।

> [!TIP]
> RabbitMQ documentation এবং community forums নিয়মিত follow করুন latest best practices জানার জন্য।
