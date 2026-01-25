# মডিউল ৭: ম্যানেজমেন্ট ও মনিটরিং (Management & Monitoring)

RabbitMQ এর স্বাস্থ্য এবং পারফরম্যান্স মনিটর করা প্রোডাকশনে অত্যন্ত গুরুত্বপূর্ণ।

## ১. Management UI

RabbitMQ Management Plugin একটি ওয়েব-বেসড UI প্রদান করে।

### Features:

- Queue, Exchange, Binding দেখা এবং তৈরি করা
- Message publish এবং consume করা
- User এবং permission ম্যানেজ করা
- Cluster status দেখা
- Real-time metrics এবং charts

### Access:

```
http://localhost:15672
Default: guest/guest
```

### Key Metrics:

- **Message rates**: Publish, Deliver, Acknowledge
- **Queue depth**: কতগুলো মেসেজ pending
- **Connection count**: কতগুলো active connection
- **Memory usage**: কত মেমরি ব্যবহার হচ্ছে

## ২. Command Line Tools (rabbitmqctl)

### Queue Management:

```bash
# List all queues
rabbitmqctl list_queues name messages consumers

# List queues with details
rabbitmqctl list_queues name messages_ready messages_unacknowledged

# Purge a queue
rabbitmqctl purge_queue my_queue
```

### Connection Management:

```bash
# List connections
rabbitmqctl list_connections name peer_host peer_port state

# Close a connection
rabbitmqctl close_connection "<connection_name>" "Reason"
```

### User Management:

```bash
# Create user
rabbitmqctl add_user myuser mypassword

# Set permissions
rabbitmqctl set_permissions -p / myuser ".*" ".*" ".*"

# List users
rabbitmqctl list_users

# Delete user
rabbitmqctl delete_user myuser
```

### Cluster Management:

```bash
# Cluster status
rabbitmqctl cluster_status

# Node health check
rabbitmqctl node_health_check

# Environment info
rabbitmqctl environment
```

## ৩. Monitoring with Prometheus

Prometheus integration RabbitMQ এর জন্য industry-standard monitoring solution।

### Setup:

```bash
# Enable Prometheus plugin
rabbitmq-plugins enable rabbitmq_prometheus

# Metrics endpoint
curl http://localhost:15692/metrics
```

### Prometheus Configuration:

```yaml
# prometheus.yml
scrape_configs:
  - job_name: "rabbitmq"
    static_configs:
      - targets: ["localhost:15692"]
```

### Important Metrics:

```
# Queue metrics
rabbitmq_queue_messages
rabbitmq_queue_messages_ready
rabbitmq_queue_messages_unacknowledged

# Connection metrics
rabbitmq_connections
rabbitmq_channels

# Node metrics
rabbitmq_node_mem_used
rabbitmq_node_fd_used
rabbitmq_node_disk_free
```

### Grafana Dashboard:

RabbitMQ এর জন্য pre-built Grafana dashboards আছে (Dashboard ID: 10991)

## ৪. Logging

### Log Levels:

```bash
# Set log level
rabbitmqctl set_log_level debug

# Log levels: debug, info, warning, error, critical, none
```

### Log Files Location:

- Linux: `/var/log/rabbitmq/`
- Windows: `%APPDATA%\RabbitMQ\log\`

### Log Configuration:

```conf
# rabbitmq.conf
log.file.level = info
log.console.level = info
log.file = /var/log/rabbitmq/rabbit.log
```

## ৫. Tracing

Message tracing debugging এর জন্য খুব কার্যকর।

```bash
# Enable tracing plugin
rabbitmq-plugins enable rabbitmq_tracing

# Create a trace (via Management UI or CLI)
rabbitmqctl trace_on -p /

# Stop tracing
rabbitmqctl trace_off -p /
```

> [!WARNING]
> Tracing পারফরম্যান্সে প্রভাব ফেলে, শুধুমাত্র debugging এর সময় ব্যবহার করুন।

## ৬. Health Checks

### Basic Health Check:

```bash
rabbitmqctl status
```

### Advanced Health Check:

```bash
# Check if node is running
rabbitmqctl ping

# Check alarms
rabbitmqctl alarm_list

# Check if node can accept connections
rabbitmqctl node_health_check
```

### HTTP Health Check Endpoint:

```bash
# Health check endpoint
curl http://localhost:15672/api/health/checks/alarms
curl http://localhost:15672/api/health/checks/local-alarms
```

## ৭. Alerts Setup

### Memory Alarm:

```conf
# rabbitmq.conf
vm_memory_high_watermark.relative = 0.4  # 40% of available RAM
```

### Disk Space Alarm:

```conf
disk_free_limit.absolute = 2GB
```

---

> [!TIP]
> প্রোডাকশনে Prometheus + Grafana + Alertmanager সেটআপ করুন comprehensive monitoring এর জন্য।
