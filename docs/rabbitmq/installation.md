# মডিউল ২: RabbitMQ ইন্সটলেশন ও সেটআপ (Installation & Setup)

এই মডিউলে আমরা বিভিন্ন অপারেটিং সিস্টেমে RabbitMQ ইন্সটল এবং কনফিগার করার পদ্ধতি শিখব।

## পূর্বশর্ত (Pre-requisites)

RabbitMQ চালানোর জন্য **Erlang/OTP** ইন্সটল থাকতে হবে কারণ RabbitMQ Erlang ভাষায় লেখা।

### Erlang ইন্সটল আছে কি না চেক করুন:

```bash
erl -version
```

## Windows-এ ইন্সটলেশন

১. [Erlang/OTP](https://www.erlang.org/downloads) ডাউনলোড এবং ইন্সটল করুন
২. [RabbitMQ Windows Installer](https://www.rabbitmq.com/install-windows.html) ডাউনলোড করুন
৩. Installer রান করে ইন্সটল করুন
৪. RabbitMQ সার্ভিস স্টার্ট করুন:

```powershell
# Service start
rabbitmq-service start
```

## Linux (Ubuntu/Debian) এ ইন্সটলেশন

```bash
# Update package list
sudo apt-get update

# Install Erlang
sudo apt-get install erlang

# Add RabbitMQ repository
curl -s https://packagecloud.io/install/repositories/rabbitmq/rabbitmq-server/script.deb.sh | sudo bash

# Install RabbitMQ
sudo apt-get install rabbitmq-server

# Start RabbitMQ
sudo systemctl start rabbitmq-server
sudo systemctl enable rabbitmq-server
```

## Mac (Homebrew) এ ইন্সটলেশন

```bash
# Install RabbitMQ
brew install rabbitmq

# Start RabbitMQ
brew services start rabbitmq
```

## Management Plugin সক্রিয় করা

Management Plugin একটি ওয়েব-বেসড UI প্রদান করে যা দিয়ে RabbitMQ ম্যানেজ করা যায়।

```bash
# Enable management plugin
rabbitmq-plugins enable rabbitmq_management

# Restart RabbitMQ
sudo systemctl restart rabbitmq-server  # Linux
rabbitmq-service restart  # Windows
```

এখন ব্রাউজারে `http://localhost:15672` এ যান। ডিফল্ট ইউজারনেম এবং পাসওয়ার্ড: **guest/guest**

## বেসিক কনফিগারেশন

RabbitMQ এর কনফিগারেশন ফাইল `rabbitmq.conf` এ থাকে।

```conf
# Maximum number of connections
listeners.tcp.default = 5672

# Management UI port
management.tcp.port = 15672

# Log level
log.file.level = info
```

## প্রথম Queue তৈরি করা

Management UI থেকে:
১. **Queues** ট্যাবে যান
২. **Add a new queue** ক্লিক করুন
৩. নাম দিন (যেমন: `my-first-queue`)
৪. **Add queue** ক্লিক করুন

অথবা CLI দিয়ে:

```bash
# Create a queue
rabbitmqadmin declare queue name=my-first-queue durable=true
```

---

> [!TIP]
> প্রোডাকশনে `guest` ইউজার ডিলিট করে নতুন ইউজার তৈরি করুন নিরাপত্তার জন্য।
