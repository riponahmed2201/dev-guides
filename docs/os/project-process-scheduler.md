# Project: Build a Process Scheduler Simulator

প্রসেস শিডিউলার সিমুলেটর তৈরি করা OS-এর শিডিউলিং অ্যালগরিদমগুলো গভীরভাবে বোঝার জন্য একটি চমৎকার প্রজেক্ট। এই প্রজেক্টে আপনি বিভিন্ন শিডিউলিং অ্যালগরিদম ইমপ্লিমেন্ট করবেন এবং তাদের পারফরম্যান্স তুলনা করবেন।

## প্রজেক্ট ওভারভিউ

একটি সিমুলেটর তৈরি করা যা:

- প্রসেসের লিস্ট (Arrival Time, Burst Time, Priority) ইনপুট নিবে।
- বিভিন্ন অ্যালগরিদম (FCFS, SJF, Round Robin, Priority) অনুযায়ী শিডিউলিং সিমুলেট করবে।
- Gantt Chart জেনারেট করবে (টেক্সট-বেসড)।
- Average Waiting Time এবং Turnaround Time ক্যালকুলেট করবে।

## Requirements

- **Language:** Python বা C++
- **Algorithms:** FCFS, SJF (Preemptive/Non-preemptive), Round Robin, Priority
- **Metrics:** Waiting Time, Turnaround Time, CPU Utilization

## Data Structure

```python
class Process:
    def __init__(self, pid, arrival_time, burst_time, priority=0):
        self.pid = pid
        self.arrival_time = arrival_time
        self.burst_time = burst_time
        self.remaining_time = burst_time
        self.priority = priority
        self.start_time = -1
        self.completion_time = 0
        self.waiting_time = 0
        self.turnaround_time = 0
```

## Algorithms Implementation

### 1. First-Come, First-Served (FCFS)

```python
def schedule_fcfs(processes):
    processes.sort(key=lambda x: x.arrival_time)
    current_time = 0

    for p in processes:
        if current_time < p.arrival_time:
            current_time = p.arrival_time

        p.start_time = current_time
        p.completion_time = current_time + p.burst_time
        p.turnaround_time = p.completion_time - p.arrival_time
        p.waiting_time = p.turnaround_time - p.burst_time

        current_time += p.burst_time
```

### 2. Shortest Job First (SJF) - Non-preemptive

```python
def schedule_sjf(processes):
    processes.sort(key=lambda x: x.arrival_time)
    n = len(processes)
    completed = 0
    current_time = 0
    is_completed = [False] * n

    while completed < n:
        idx = -1
        min_burst = float('inf')

        # Find process with minimum burst time among arrived processes
        for i in range(n):
            if (processes[i].arrival_time <= current_time and
                not is_completed[i]):
                if processes[i].burst_time < min_burst:
                    min_burst = processes[i].burst_time
                    idx = i

        if idx != -1:
            p = processes[idx]
            p.start_time = current_time
            p.completion_time = current_time + p.burst_time
            p.turnaround_time = p.completion_time - p.arrival_time
            p.waiting_time = p.turnaround_time - p.burst_time

            is_completed[idx] = True
            completed += 1
            current_time = p.completion_time
        else:
            current_time += 1
```

### 3. Round Robin (RR)

```python
def schedule_rr(processes, time_quantum):
    processes.sort(key=lambda x: x.arrival_time)
    queue = []
    current_time = 0
    completed = 0
    n = len(processes)

    # Copy remaining times
    rem_burst = [p.burst_time for p in processes]

    # Add first process
    queue.append(0)
    visited = [False] * n
    visited[0] = True

    while completed < n:
        if not queue:
             # Idle time handling
             for i in range(n):
                 if not visited[i]:
                     queue.append(i)
                     visited[i] = True
                     current_time = processes[i].arrival_time
                     break

        idx = queue.pop(0)
        p = processes[idx]

        if rem_burst[idx] > time_quantum:
            current_time += time_quantum
            rem_burst[idx] -= time_quantum
        else:
            current_time += rem_burst[idx]
            rem_burst[idx] = 0
            p.completion_time = current_time
            p.turnaround_time = p.completion_time - p.arrival_time
            p.waiting_time = p.turnaround_time - p.burst_time
            completed += 1

        # Check for new arrivals
        for i in range(n):
            if (processes[i].arrival_time <= current_time and
                not visited[i]):
                queue.append(i)
                visited[i] = True

        # If process not finished, add back to queue
        if rem_burst[idx] > 0:
            queue.append(idx)
```

## Performance Metrics & Visualization

### Metrics Calculation

```python
def print_metrics(processes):
    total_wt = sum(p.waiting_time for p in processes)
    total_tat = sum(p.turnaround_time for p in processes)
    n = len(processes)

    print(f"Average Waiting Time: {total_wt/n:.2f}")
    print(f"Average Turnaround Time: {total_tat/n:.2f}")
```

### Gantt Chart Visualization

```python
def print_gantt_chart(execution_log):
    print("\nGantt Chart:")
    print("-" * 50)
    for entry in execution_log:
        print(f"| P{entry['pid']} ", end="")
    print("|")
    print("-" * 50)

    print(min(e['start'] for e in execution_log), end="")
    for entry in execution_log:
        print(f"    {entry['end']}", end="")
    print()
```

## Complete Simulator Structure

```python
def main():
    print("Process Scheduler Simulator")
    print("1. FCFS")
    print("2. SJF")
    print("3. Round Robin")

    choice = int(input("Choose algorithm: "))

    # Input processes
    # Run algorithm
    # Print metrics
    # Show Gantt Chart

if __name__ == "__main__":
    main()
```

## Learning Outcomes

এই প্রজেক্ট করে আপনি শিখবেন:

- **Scheduling Algorithms:** কীভাবে বিভিন্ন অ্যালগরিদম কাজ করে এবং তাদের পার্থক্য।
- **Queue Management:** রেডি কিউ ইমপ্লিমেন্টেশন।
- **Context Switching:** সিমুলেশনে কনটেক্সট সুইচিং হ্যান্ডলিং।
- **Performance Analysis:** ওয়েটিং টাইম এবং টার্নঅ্যারাউন্ড টাইম অপ্টিমাইজেশন।
- **Metric Comparison:** কেন একটি অ্যালগরিদম নির্দিষ্ট সিনারিওতে ভালো পারফর্ম করে।
