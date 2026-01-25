# মডিউল ৮: RabbitMQ সিকিউরিটি (Security)

প্রোডাকশন এনভায়রনমেন্টে RabbitMQ সিকিউর করা অত্যন্ত গুরুত্বপূর্ণ।

## ১. Authentication (Users and Permissions)

### User তৈরি করা:

```bash
# Create user
rabbitmqctl add_user admin StrongPassword123

# Set user as administrator
rabbitmqctl set_user_tags admin administrator

# List all users
rabbitmqctl list_users
```

### User Tags:

- **administrator**: সব কাজ করতে পারে
- **monitoring**: শুধু monitoring করতে পারে
- **management**: management UI access
- **policymaker**: policy তৈরি করতে পারে

### Default Guest User ডিলিট করা:

```bash
# Security best practice
rabbitmqctl delete_user guest
```

## ২. Authorization (Access Control)

RabbitMQ তিন ধরনের permission ব্যবহার করে:

### Permission Types:

- **Configure**: Exchange, Queue তৈরি/ডিলিট করা
- **Write**: Message publish করা
- **Read**: Message consume করা

### Permission সেট করা:

```bash
# Syntax: set_permissions [-p vhost] user configure write read

# Full access
rabbitmqctl set_permissions -p / myuser ".*" ".*" ".*"

# Read-only access
rabbitmqctl set_permissions -p / readonly_user "" "" ".*"

# Write-only access (producer)
rabbitmqctl set_permissions -p / producer_user "" ".*" ""

# Specific queue access
rabbitmqctl set_permissions -p / limited_user "^myqueue$" "^myqueue$" "^myqueue$"
```

### Permission চেক করা:

```bash
# List permissions for a user
rabbitmqctl list_user_permissions myuser

# List permissions for a vhost
rabbitmqctl list_permissions -p /
```

## ৩. SSL/TLS Configuration

SSL/TLS দিয়ে client-server communication encrypt করা।

### Certificate তৈরি করা:

```bash
# Generate CA certificate
openssl req -x509 -newkey rsa:4096 -days 365 -nodes \
  -keyout ca-key.pem -out ca-cert.pem \
  -subj "/CN=MyCA"

# Generate server certificate
openssl req -newkey rsa:4096 -nodes \
  -keyout server-key.pem -out server-req.pem \
  -subj "/CN=localhost"

# Sign server certificate
openssl x509 -req -in server-req.pem -days 365 \
  -CA ca-cert.pem -CAkey ca-key.pem -CAcreateserial \
  -out server-cert.pem
```

### RabbitMQ Configuration:

```conf
# rabbitmq.conf
listeners.ssl.default = 5671

ssl_options.cacertfile = /path/to/ca-cert.pem
ssl_options.certfile   = /path/to/server-cert.pem
ssl_options.keyfile    = /path/to/server-key.pem
ssl_options.verify     = verify_peer
ssl_options.fail_if_no_peer_cert = true
```

### Client Connection (Python):

```python
import pika
import ssl

ssl_context = ssl.create_default_context(cafile="/path/to/ca-cert.pem")
ssl_context.load_cert_chain("/path/to/client-cert.pem", "/path/to/client-key.pem")

parameters = pika.ConnectionParameters(
    host='localhost',
    port=5671,
    credentials=pika.PlainCredentials('username', 'password'),
    ssl_options=pika.SSLOptions(ssl_context)
)

connection = pika.BlockingConnection(parameters)
```

## ৪. Virtual Host Isolation

Virtual Hosts বিভিন্ন অ্যাপ্লিকেশন বা টিমকে আলাদা করে রাখে।

```bash
# Create virtual host
rabbitmqctl add_vhost production
rabbitmqctl add_vhost staging

# Set permissions for vhost
rabbitmqctl set_permissions -p production prod_user ".*" ".*" ".*"

# List virtual hosts
rabbitmqctl list_vhosts
```

### Python Connection to Specific VHost:

```python
credentials = pika.PlainCredentials('username', 'password')
parameters = pika.ConnectionParameters(
    host='localhost',
    virtual_host='production',
    credentials=credentials
)
connection = pika.BlockingConnection(parameters)
```

## ৫. Security Best Practices

### ১. Network Security:

```conf
# Bind to specific interface only
listeners.tcp.1 = 192.168.1.100:5672

# Disable guest user remote access (default)
loopback_users.guest = true
```

### ২. Password Policy:

```bash
# Use strong passwords
rabbitmqctl add_user admin $(openssl rand -base64 32)

# Change password regularly
rabbitmqctl change_password admin NewStrongPassword
```

### ৩. Limit Connections:

```conf
# Maximum connections per user
rabbitmq_management.max_connections_per_user = 100

# Connection timeout
channel_max = 128
```

### ৪. Enable Audit Logging:

```bash
# Enable event exchange for auditing
rabbitmq-plugins enable rabbitmq_event_exchange
```

### ৫. Firewall Rules:

```bash
# Allow only specific IPs
# Port 5672: AMQP
# Port 15672: Management UI
# Port 25672: Inter-node communication

sudo ufw allow from 192.168.1.0/24 to any port 5672
sudo ufw allow from 192.168.1.0/24 to any port 15672
```

## ৬. Management UI Security

### Disable Management UI in Production:

```bash
# If not needed
rabbitmq-plugins disable rabbitmq_management
```

### Restrict Management UI Access:

```conf
# Only allow from specific IPs
management.tcp.ip = 127.0.0.1
```

### Use Reverse Proxy:

```nginx
# Nginx configuration
server {
    listen 443 ssl;
    server_name rabbitmq.example.com;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    location / {
        proxy_pass http://localhost:15672;
        proxy_set_header Host $host;
    }
}
```

---

> [!CAUTION]
> কখনোই default `guest/guest` credentials প্রোডাকশনে ব্যবহার করবেন না। সবসময় strong password এবং SSL/TLS ব্যবহার করুন।
