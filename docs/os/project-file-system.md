# Project: File System Simulation

ফাইল সিস্টেম সিমুলেশন প্রজেক্টটি OS-এর স্টোরেজ ম্যানেজমেন্ট বোঝার জন্য একটি অ্যাডভান্সড প্রজেক্ট। এই প্রজেক্টে আপনি একটি ভার্চুয়াল ডিস্ক তৈরি করবেন এবং সেখানে ফাইল ও ডিরেক্টরি ম্যানেজ করবেন।

## প্রজেক্ট ওভারভিউ

আমরা একটি সিম্পল ফাইল সিস্টেম তৈরি করবো যা Unix-এর মতো inode-based আর্কিটেকচার ফলো করে। এটি একটি সাধারণ ফাইলের মধ্যে (Virtual Disk) ডেটা স্টোর করবে।

### Features:

- **Mount/Unmount:** ফাইল সিস্টেম মাউন্ট করা।
- **Create/Delete:** ফাইল তৈরি এবং মুছে ফেলা।
- **Read/Write:** ফাইলে ডেটা লেখা এবং পড়া।
- **List:** ডিরেক্টরি কন্টেন্ট দেখা।

## Requirements

- **Language:** C/C++
- **Concepts:** Inodes, Superblock, Bitmaps, Directory Entry
- **Storage:** একটি বড় বাইনারি ফাইল (e.g., `virtual_disk.bin`)

## File System Structure

আমাদের ভার্চুয়াল ডিস্কটি নিচের মতো ব্লক ডায়াগ্রামে ভাগ করা থাকবে:

```
[ Superblock | Inode Bitmap | Data Bitmap | Inode Table | Data Blocks ]
```

### 1. Superblock

ফাইল সিস্টেমের মেটাডেটা ধারণ করে।

```c
typedef struct {
    int magic_number;     // ফাইল সিস্টেম আইডেন্টিফায়ার
    int total_blocks;     // মোট ব্লকের সংখ্যা
    int inode_bitmap_block; // Inode bitmap এর লোকেশন
    int data_bitmap_block;  // Data bitmap এর লোকেশন
    int inode_table_block;  // Inode table এর লোকেশন
    int data_block_start;   // Data block এর শুরু
} Superblock;
```

### 2. Inode

প্রতিটি ফাইলের মেটাডেটা।

```c
#define DIRECT_POINTERS 5

typedef struct {
    int size;               // ফাইলের সাইজ
    int type;               // 0 = file, 1 = directory
    int direct[DIRECT_POINTERS]; // ডিরেক্ট ডেটা ব্লক পয়েন্টার
} Inode;
```

### 3. Directory Entry

ফাইল নেম এবং Inode নম্বরের ম্যাপিং।

```c
typedef struct {
    char name[32];
    int inode_number;
} DirectoryEntry;
```

## Implementation Steps

### Step 1: Initialize Virtual Disk

একটি খালি ফাইল তৈরি করে সুপারব্লক এবং বিটম্যাপ ইনিশিয়ালাইজ করা।

```c
void mkfs(const char *filename, int nblocks) {
    // 1. ফাইল তৈরি এবং 0 দিয়ে পূর্ণ করা
    // 2. সুপারব্লক স্ট্রাকচার রাইট করা
    // 3. রুট ডিরেক্টরি (Inode 0) তৈরি করা
}
```

### Step 2: Inode & Block Allocation

ফাইল তৈরির সময় ফ্রি Inode এবং ডেটা ব্লক খুঁজে বের করা।

```c
int allocate_inode() {
    // Inode bitmap চেক করে ফ্রি ইনোড রিটার্ন করা
}

int allocate_block() {
    // Data bitmap চেক করে ফ্রি ব্লক রিটার্ন করা
}
```

### Step 3: File Operations

#### File Creation (Touch)

```c
void fs_create(const char *name) {
    // 1. ফ্রি Inode অ্যালোকেট করা
    // 2. প্যারেন্ট ডিরেক্টরিতে এন্ট্রি যোগ করা
    // 3. Inode ডিস্কে রাইট করা
}
```

#### File Write

```c
void fs_write(const char *name, const char *data, int size) {
    // 1. ফাইলের Inode খুঁজে বের করা
    // 2. প্রয়োজনীয় ডেটা ব্লক অ্যালোকেট করা
    // 3. ব্লকে ডেটা রাইট করা
    // 4. Inode আপডেট করা (size)
}
```

#### File Read

```c
void fs_read(const char *name) {
    // 1. ফাইলের Inode রিড করা
    // 2. ব্লকগুলো থেকে ডেটা রিড করে বাফারে রাখা
    // 3. ইউজারকে দেখানো
}
```

#### File List (ls)

```c
void fs_ls() {
    // 1. রুট ডিরেক্টরি বা কারেন্ট ডিরেক্টরি রিড করা
    // 2. সব এন্ট্রি প্রিন্ট করা
}
```

## Command Line Interface (CLI)

আপনার প্রোগ্রামটি একটি শেল-এর মতো কাজ করবে:

```bash
$ ./myfs virtual_disk.bin
myfs> mkfs
File system initialized.
myfs> create file.txt
File created.
myfs> write file.txt "Hello OS"
Data written.
myfs> read file.txt
Hello OS
myfs> ls
file.txt
myfs> exit
```

## Advanced Features (Optional)

1. **Directories:** ফোল্ডারের ভেতর ফোল্ডার সাপোর্ট (Recursive)।
2. **Indirect Pointers:** বড় ফাইল সাপোর্টের জন্য (Single/Double Indirect)।
3. **Permissions:** Read/Write/Execute পারমিশন সিস্টেম।

## Learning Outcomes

এই প্রজেক্ট করে আপনি শিখবেন:

- **Disk Layout:** ডিস্কে ডেটা কীভাবে অর্গানাইজড থাকে।
- **Metadata Management:** Inode এবং Superblock-এর কাজ।
- **Bitmaps:** ফ্রি স্পেস ম্যানেজমেন্ট।
- **Serialization:** মেমোরি স্ট্রাকচার ডিস্কে সেভ করা (Persistence)।
