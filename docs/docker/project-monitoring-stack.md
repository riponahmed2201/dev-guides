# Real-World Project: Monitoring Stack (Prometheus + Grafana)

প্রোডাকশন এনভায়রনমেন্টে কন্টেইনার এবং সার্ভারের হেলথ মনিটর করা অত্যন্ত গুরুত্বপূর্ণ। এই প্রজেক্টে আমরা **Prometheus** (মেট্রিক্স কালেকশনের জন্য) এবং **Grafana** (ড্যাশবোর্ড ভিজুয়ালাইজেশনের জন্য) দিয়ে একটি পাওয়ারফুল মনিটরিং স্ট্যাক তৈরি করব। সাথে আমরা **Node Exporter** ব্যবহার করব সিস্টেমের হার্ডওয়্যার মেট্রিক্স (CPU, RAM, Disk) কালেক্ট করার জন্য।

## প্রজেক্টের লক্ষ্য
- Prometheus কনফিগার করা মেট্রিক্স স্ক্র্যাপ করার জন্য।
- Grafana সেটআপ করা ভিজুয়ালাইজেশনের জন্য।
- Node Exporter এর মাধ্যমে হোস্ট মেশিনের মেট্রিক্স দেখানো।

---

## ১. প্রজেক্ট স্ট্রাকচার
ফোল্ডার স্ট্রাকচার তৈরি করুন:

```bash
mkdir monitoring-stack
cd monitoring-stack
mkdir prometheus
```

---

## ২. Prometheus কনফিগারেশন

Prometheus কে বলে দিতে হয় সে কোথা থেকে মেট্রিক্স টিপবে (Scrape)। এর জন্য `prometheus/prometheus.yml` ফাইল তৈরি করুন:

```yaml
global:
  scrape_interval: 15s # প্রতি ১৫ সেকেন্ড পর পর মেট্রিক্স চেক করবে

scrape_configs:
  - job_name: 'prometheus'
    static_configs:
      - targets: ['localhost:9090']

  - job_name: 'node-exporter'
    static_configs:
      - targets: ['node-exporter:9100'] # Node Exporter কন্টেইনারের নাম ও পোর্ট
```

---

## ৩. Docker Compose (Orchestration)

`docker-compose.yml` ফাইল তৈরি করুন:

```yaml
version: '3.8'

services:
  # 1. Prometheus - Metrics Collector
  prometheus:
    image: prom/prometheus:latest
    container_name: prometheus
    volumes:
      - ./prometheus/prometheus.yml:/etc/prometheus/prometheus.yml
      - prometheus_data:/prometheus
    ports:
      - "9090:9090"
    command:
      - '--config.file=/etc/prometheus/prometheus.yml'
    networks:
      - monitoring-net

  # 2. Node Exporter - Hardware Metrics Exporter
  node-exporter:
    image: prom/node-exporter:latest
    container_name: node-exporter
    volumes:
      - /proc:/host/proc:ro
      - /sys:/host/sys:ro
      - /:/rootfs:ro
    command:
      - '--path.procfs=/host/proc'
      - '--path.rootfs=/rootfs'
      - '--path.sysfs=/host/sys'
      - '--collector.filesystem.mount-points-exclude=^/(sys|proc|dev|host|etc)($$|/)'
    ports:
      - "9100:9100"
    networks:
      - monitoring-net

  # 3. Grafana - Dashboard Visualization
  grafana:
    image: grafana/grafana:latest
    container_name: grafana
    ports:
      - "3000:3000"
    environment:
      - GF_SECURITY_ADMIN_USER=admin
      - GF_SECURITY_ADMIN_PASSWORD=admin
    volumes:
      - grafana_data:/var/lib/grafana
    networks:
      - monitoring-net

networks:
  monitoring-net:
    driver: bridge

volumes:
  prometheus_data:
  grafana_data:
```

---

## ৪. রান করা

মনিটরিং স্ট্যাক রান করুন:
```bash
docker-compose up -d
```

---

## ৫. ড্যাশবোর্ড অ্যাক্সেস এবং কনফিগারেশন

### Prometheus চেক করা
ব্রাউজারে যান: `http://localhost:9090`
- **Status** > **Targets** এ গিয়ে দেখুন `prometheus` এবং `node-exporter` উভয়েই **UP** স্টেটে আছে কিনা।

### Grafana সেটআপ করা
১. ব্রাউজারে যান: `http://localhost:3000`
২. লগইন করুন: ইউজারনেম `admin`, পাসওয়ার্ড `admin` (প্রথমবার লগইনে পাসওয়ার্ড চেঞ্জ করতে বলবে)।

### গ্রাফানাতে প্রোমিথিউস কানেক্ট করা
1. বাম মেনু থেকে **Connections** > **Data Sources** এ যান।
2. **Add data source** এ ক্লিক করুন এবং **Prometheus** সিলেক্ট করুন।
3. **Connection URL** বক্সে লিখুন: `http://prometheus:9090` (ডকার কম্পোজ কন্টেইনারের নাম)।
4. নিচে স্ক্রল করে **Save & test** এ ক্লিক করুন। "Successfully queried the Prometheus API" মেসেজ আসলে সব ঠিক আছে।

### ড্যাশবোর্ড ইমপোর্ট করা
1. এখন **Dashboards** > **New** > **Import** এ যান।
2. আমরা "Node Exporter Full" ড্যাশবোর্ড ব্যবহার করব। এর আইডি হলো `1860`।
3. **Import via grafana.com** টেক্সট বক্সে `1860` লিখে **Load** ক্লিক করুন।
4. **Data source** ড্রপডাউন থেকে আপনার তৈরি করা Prometheus সোর্সটি সিলেক্ট করুন।
5. **Import** এ ক্লিক করুন।

এখন আপনি আপনার সিস্টেমের CPU, Memory, Disk Usage এর লাইভ গ্রাফ দেখতে পাবেন!

## সারাংশ
এই প্রজেক্টে আমরা শিখলাম কীভাবে খুবই সহজে ডকার ব্যবহার করে একটি সম্পূর্ণ মনিটরিং সিস্টেম দাঁড় করানো যায়। প্রোডাকশন সার্ভারে সার্ভিসের স্ট্যাটাস এবং পারফরম্যান্স ট্র্যাক করার জন্য এটি একটি স্ট্যান্ডার্ড সলিউশন।
