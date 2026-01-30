# Operating System Roadmap

অপারেটিং সিস্টেম (OS) হলো কম্পিউটারের হার্ডওয়্যার এবং ইউজারের মধ্যে একটি ইন্টারফেস। একজন সফটওয়্যার ইঞ্জিনিয়ার হিসেবে OS-এর ইন্টারনাল মেকানিজম জানা অত্যন্ত জরুরি।

## Foundations

1. [Operating System Foundations](/os/foundations)
   - What is an Operating System
   - System Calls & APIs
   - Boot Process
   - History & Types of OS
   - Kernel vs User Space

## Processes & Threads

1. [Processes & Threads](/os/processes-threads)
   - Process States & Lifecycle
   - Context Switching
   - Inter-Process Communication
   - Processes & PCB
   - Threads vs Processes
   - Scheduling Algorithms

## Concurrency & Synchronization

1. [Concurrency & Synchronization](/os/concurrency-sync)
   - Race Conditions
   - Locks & Semaphores
   - Deadlocks
   - Critical Sections
   - Monitors & Condition Variables

## Memory Management

1. [Memory Management](/os/memory-management)
   - Physical & Virtual Memory
   - Paging & Segmentation
   - Page Replacement Algorithms
   - Thrashing
   - Memory Allocation
   - MMU

## File Systems & Storage

1. [File Systems & Storage](/os/file-systems)
   - File System Structure
   - File Concepts
   - Directory Implementation
   - Inodes
   - Journaling File Systems
   - Disk Scheduling Algorithms

## I/O & Device Management

1. [I/O & Device Management](/os/io-device-management)
   - I/O System Overview
   - Interrupts
   - Device Drivers
   - DMA (Direct Memory Access)
   - Buffering & Caching

## Security & Protection

1. [Security & Protection](/os/security-protection)
   - User Authentication
   - Capabilities
   - Sandboxing & Isolation
   - Access Control Lists
   - Encryption in OS

## Distributed OS Concepts

1. [Distributed OS Concepts](/os/distributed-concepts)
   - Client-Server Model
   - Distributed File Systems
   - Consensus (Paxos, Raft)
   - Process Migration
   - Clock Synchronization

## Advanced Topics

1. [Advanced Topics](/os/advanced-topics)
   - Virtualization & Hypervisors
   - NUMA
   - Modern OS Internals
   - Containers vs VMs
   - Real-Time Operating Systems

## Projects

1. [Write a Simple Shell](/os/project-simple-shell)
   - Command reading and parsing
   - Process creation with fork()
   - Command execution with exec()
   - Built-in commands

2. [Implement a Virtual Memory Manager](/os/project-vm-manager)
   - Virtual to physical address translation
   - TLB simulation
   - Page table management
   - Page replacement algorithms

3. [Mini OS Kernel (Educational)](/os/project-mini-kernel)
   - Bootloader development
   - Kernel initialization
   - VGA text mode driver
   - Keyboard driver and interrupts

4. [Build a Process Scheduler Simulator](/os/project-process-scheduler)
   - FCFS, SJF, Round Robin implementation
   - Gantt chart visualization
   - Waiting time & Turnaround time calculation

5. [File System Simulation Project](/os/project-file-system)
   - Virtual disk creation with Superblock & Inodes
   - File operations (Create, Read, Write, Delete)
   - Directory structure & bitmap management
