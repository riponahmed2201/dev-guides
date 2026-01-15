# Swarm Service Constraints (সার্ভিস কনস্ট্রেইন্টস)

ডকার সোয়ার্ম ক্লাস্টারে যখন অনেকগুলো নোড থাকে, তখন ডিফল্টভাবে সোয়ার্ম সবচেয়ে কম লোড থাকা নোডে কন্টেইনার রান করে। তবে অনেক সময় আমাদের নির্দিষ্ট কোনো নোডে সার্ভিস রান করানো দরকার হয় (যেমন: শুধুমাত্র ডেটাবেস সার্ভারে বা বিশেষ হার্ডওয়্যার থাকা নোডে)। এই নোড সিলেকশন কন্ট্রোল করার জন্য 'Service Constraints' ব্যবহার করা হয়।

## ১. নোড ডিক্লারেশন এবং লেবেল (Node Labels)

কনস্ট্রেইন্ট ব্যবহার করার আগে নোডগুলোকে লেবেল দিয়ে চিহ্নিত করা ভালো।

```bash
# একটি নোডে লেবেল যুক্ত করা
docker node update --label-add type=compute node-1
docker node update --label-add storage=ssd node-2
```

---

## ২. প্লেসমেন্ট কনস্ট্রেইন্ট (Placement Constraints)

সার্ভিস তৈরি বা আপডেট করার সময় আপনি শর্ত জুড়ে দিতে পারেন যে সেটি কোন ধরণের নোডে চলবে।

```bash
docker service create \
  --name db-service \
  --constraint "node.labels.storage == ssd" \
  --constraint "node.role == worker" \
  mariadb
```

### কমন কনস্ট্রেইন্ট উদাহরণ:

- `node.role == manager` (শুধুমাত্র ম্যানেজার নোডে চলবে)
- `node.role == worker` (শুধুমাত্র ওয়ার্কার নোডে চলবে)
- `node.id == <NODE-ID>` (একটি নির্দিষ্ট নোডে চলবে)
- `node.hostname == <HOSTNAME>` (নির্দিষ্ট হোস্টনেমে চলবে)
- `node.labels.<KEY> == <VALUE>` (কাস্টম লেবেল অনুযায়ী চলবে)

---

## ৩. প্লেসমেন্ট প্রেফারেন্স এবং স্প্রেড (Spread Strategy)

যদি আপনি চান সার্ভিসগুলো সমানভাবে বিভিন্ন ডেটাসেন্টার বা র‍্যাকে (Rack) ভাগ হয়ে থাকুক, তবে `placement-pref` ব্যবহার করা হয়।

```bash
docker service create \
  --name web-app \
  --replicas 6 \
  --placement-pref "spread=node.labels.datacenter" \
  nginx
```

এখানে যদি ২টি ডেটাসেন্টার থাকে, সোয়ার্ম চেষ্টা করবে ৩টি করে কন্টেইনার প্রতিটি ডেটাসেন্টারে রান করতে।

---

## ৪. রিসোর্স কনস্ট্রেইন্ট (Resource Constraints)

সার্ভিস যাতে ক্লাস্টারের সব রিসোর্স খেয়ে না ফেলে, তার জন্য লিমিট এবং রিজার্ভেশন ব্যবহার করা হয়।

```bash
docker service create \
  --name worker-app \
  --limit-cpu 0.5 \
  --limit-memory 512m \
  --reserve-cpu 0.2 \
  --reserve-memory 256m \
  worker-image
```

- **limit:** সর্বোচ্চ কতটুকু ব্যবহার করতে পারবে।
- **reserve:** সোয়ার্ম নিশ্চিত করবে যে নোডে অন্তত এই পরিমাণ রিসোর্স খালি আছে।

---

## ৫. কম্পোজ/স্ট্যাক ফাইলে ব্যবহার

```yaml
version: "3.8"
services:
  web:
    image: nginx
    deploy:
      placement:
        constraints:
          - node.role == worker
          - node.labels.type == compute
        preferences:
          - spread: node.labels.datacenter
      resources:
        limits:
          cpus: "0.50"
          memory: 512M
        reservations:
          cpus: "0.25"
          memory: 256M
```

## ৬. সুবিধা

- **Hardware Optimization:** বিশেষ কাজের জন্য বিশেষ ইক্যুইপমেন্ট (GPU, SSD) ব্যবহার করা যায়।
- **Isolation:** সেনসিটিভ সার্ভিসগুলোকে আলাদা নোডে রাখা যায়।
- **High Availability:** স্প্রেড স্ট্র্যাটেজি ব্যবহারের ফলে একটি পুরো র‍্যাক বা ডেটাসেন্টার ডাউন হলেও সার্ভিস সচল থাকে।
