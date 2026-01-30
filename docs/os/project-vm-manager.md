# Project: Implement a Virtual Memory Manager

ভার্চুয়াল মেমোরি ম্যানেজার তৈরি করা OS-এর মেমোরি ম্যানেজমেন্ট কনসেপ্ট বোঝার জন্য একটি চ্যালেঞ্জিং প্রজেক্ট। এই প্রজেক্টে আপনি paging, page replacement, এবং TLB সিমুলেশন শিখবেন।

## প্রজেক্ট ওভারভিউ

একটি ভার্চুয়াল মেমোরি ম্যানেজার যা:

- ভার্চুয়াল অ্যাড্রেসকে ফিজিক্যাল অ্যাড্রেসে ট্রান্সলেট করবে
- Page table ম্যানেজ করবে
- TLB (Translation Lookaside Buffer) সিমুলেট করবে
- Page replacement অ্যালগরিদম ইমপ্লিমেন্ট করবে

## Requirements

- **Language:** C/C++
- **Concepts:** Paging, Page Tables, TLB, Page Replacement

## System Parameters

```c
#define PAGE_SIZE 256          // bytes per page
#define FRAME_SIZE 256         // bytes per frame
#define NUM_FRAMES 256         // total frames in physical memory
#define NUM_PAGES 256          // total pages in virtual memory
#define TLB_SIZE 16            // TLB entries
#define PAGE_TABLE_SIZE 256    // page table entries
```

## Core Components

### 1. TLB Structure

```c
typedef struct {
    int page_number;
    int frame_number;
    int valid;
} TLB_Entry;

TLB_Entry tlb[TLB_SIZE];
int tlb_index = 0;  // For FIFO replacement

void init_tlb() {
    for (int i = 0; i < TLB_SIZE; i++) {
        tlb[i].valid = 0;
    }
}

int search_tlb(int page_number) {
    for (int i = 0; i < TLB_SIZE; i++) {
        if (tlb[i].valid && tlb[i].page_number == page_number) {
            return tlb[i].frame_number;  // TLB hit
        }
    }
    return -1;  // TLB miss
}

void update_tlb(int page_number, int frame_number) {
    tlb[tlb_index].page_number = page_number;
    tlb[tlb_index].frame_number = frame_number;
    tlb[tlb_index].valid = 1;
    tlb_index = (tlb_index + 1) % TLB_SIZE;  // FIFO
}
```

### 2. Page Table

```c
typedef struct {
    int frame_number;
    int valid;
} Page_Table_Entry;

Page_Table_Entry page_table[PAGE_TABLE_SIZE];

void init_page_table() {
    for (int i = 0; i < PAGE_TABLE_SIZE; i++) {
        page_table[i].valid = 0;
    }
}

int search_page_table(int page_number) {
    if (page_table[page_number].valid) {
        return page_table[page_number].frame_number;
    }
    return -1;  // Page fault
}
```

### 3. Physical Memory

```c
char physical_memory[NUM_FRAMES][FRAME_SIZE];
int free_frame_list[NUM_FRAMES];
int next_free_frame = 0;

void init_physical_memory() {
    for (int i = 0; i < NUM_FRAMES; i++) {
        free_frame_list[i] = i;
    }
}

int allocate_frame() {
    if (next_free_frame < NUM_FRAMES) {
        return free_frame_list[next_free_frame++];
    }
    return -1;  // No free frames
}
```

### 4. Address Translation

```c
typedef struct {
    int page_number;
    int offset;
} Virtual_Address;

typedef struct {
    int frame_number;
    int offset;
} Physical_Address;

Virtual_Address parse_virtual_address(int address) {
    Virtual_Address va;
    va.page_number = (address >> 8) & 0xFF;  // Upper 8 bits
    va.offset = address & 0xFF;              // Lower 8 bits
    return va;
}

int translate_address(int virtual_address) {
    Virtual_Address va = parse_virtual_address(virtual_address);
    int frame_number;

    // Step 1: Check TLB
    frame_number = search_tlb(va.page_number);
    if (frame_number != -1) {
        // TLB hit
        return (frame_number << 8) | va.offset;
    }

    // Step 2: Check Page Table
    frame_number = search_page_table(va.page_number);
    if (frame_number != -1) {
        // Page table hit
        update_tlb(va.page_number, frame_number);
        return (frame_number << 8) | va.offset;
    }

    // Step 3: Page fault - load from backing store
    frame_number = handle_page_fault(va.page_number);
    update_tlb(va.page_number, frame_number);
    page_table[va.page_number].frame_number = frame_number;
    page_table[va.page_number].valid = 1;

    return (frame_number << 8) | va.offset;
}
```

### 5. Page Fault Handler

```c
FILE *backing_store;

int handle_page_fault(int page_number) {
    int frame_number = allocate_frame();

    if (frame_number == -1) {
        // No free frames - need page replacement
        frame_number = page_replacement();
    }

    // Load page from backing store
    fseek(backing_store, page_number * PAGE_SIZE, SEEK_SET);
    fread(physical_memory[frame_number], sizeof(char), FRAME_SIZE, backing_store);

    return frame_number;
}
```

### 6. Page Replacement (FIFO)

```c
int fifo_queue[NUM_FRAMES];
int fifo_front = 0;
int fifo_rear = 0;

int page_replacement() {
    // FIFO: Remove oldest page
    int victim_frame = fifo_queue[fifo_front];
    fifo_front = (fifo_front + 1) % NUM_FRAMES;

    // Invalidate page table entry
    for (int i = 0; i < PAGE_TABLE_SIZE; i++) {
        if (page_table[i].valid &&
            page_table[i].frame_number == victim_frame) {
            page_table[i].valid = 0;
            break;
        }
    }

    return victim_frame;
}
```

## Complete Implementation

```c
#include <stdio.h>
#include <stdlib.h>

#define PAGE_SIZE 256
#define NUM_FRAMES 256
#define TLB_SIZE 16
#define PAGE_TABLE_SIZE 256

// Statistics
int tlb_hits = 0;
int tlb_misses = 0;
int page_faults = 0;
int total_addresses = 0;

// [Include all structures and functions from above]

int main(int argc, char *argv[]) {
    if (argc != 2) {
        fprintf(stderr, "Usage: %s <input_file>\n", argv[0]);
        return 1;
    }

    // Initialize
    init_tlb();
    init_page_table();
    init_physical_memory();

    // Open backing store
    backing_store = fopen("BACKING_STORE.bin", "rb");
    if (!backing_store) {
        fprintf(stderr, "Error opening backing store\n");
        return 1;
    }

    // Open input file
    FILE *input = fopen(argv[1], "r");
    if (!input) {
        fprintf(stderr, "Error opening input file\n");
        return 1;
    }

    int virtual_address;
    while (fscanf(input, "%d", &virtual_address) != EOF) {
        total_addresses++;
        int physical_address = translate_address(virtual_address);
        char value = physical_memory[physical_address >> 8][physical_address & 0xFF];

        printf("Virtual: %d, Physical: %d, Value: %d\n",
               virtual_address, physical_address, value);
    }

    // Print statistics
    printf("\nStatistics:\n");
    printf("TLB Hits: %d\n", tlb_hits);
    printf("TLB Misses: %d\n", tlb_misses);
    printf("TLB Hit Rate: %.2f%%\n", (float)tlb_hits / total_addresses * 100);
    printf("Page Faults: %d\n", page_faults);
    printf("Page Fault Rate: %.2f%%\n", (float)page_faults / total_addresses * 100);

    fclose(input);
    fclose(backing_store);
    return 0;
}
```

## Compilation & Running

```bash
gcc -o vm_manager vm_manager.c
./vm_manager addresses.txt
```

## Advanced Features

### 1. LRU Page Replacement

```c
// Track last access time for each frame
int lru_counter[NUM_FRAMES];
```

### 2. Demand Paging

```c
// Load pages only when accessed
```

### 3. Page Replacement Algorithms

- FIFO
- LRU (Least Recently Used)
- Optimal

## Learning Outcomes

এই প্রজেক্ট করে আপনি শিখবেন:

- **Virtual to Physical Address Translation**
- **TLB Management:** ক্যাশিং এবং দ্রুত লুকআপ
- **Page Table Management:** পেজ ম্যাপিং
- **Page Fault Handling:** ডিমান্ড পেজিং
- **Page Replacement:** মেমোরি অপ্টিমাইজেশন
