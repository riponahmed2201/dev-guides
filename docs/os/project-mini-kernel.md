# Project: Mini OS Kernel (Educational)

একটি মিনি OS কার্নেল তৈরি করা সবচেয়ে চ্যালেঞ্জিং এবং রিওয়ার্ডিং প্রজেক্ট। এই প্রজেক্টে আপনি bootloader, kernel initialization, এবং basic I/O শিখবেন।

## প্রজেক্ট ওভারভিউ

একটি সিম্পল OS কার্নেল যা:

- x86 আর্কিটেকচারে বুট হবে
- স্ক্রিনে টেক্সট প্রিন্ট করবে
- কীবোর্ড ইনপুট নিবে
- বেসিক মেমোরি ম্যানেজমেন্ট করবে

## Requirements

- **Language:** C, Assembly (x86)
- **Tools:** NASM (assembler), GCC, QEMU (emulator)
- **Concepts:** Bootloader, Protected Mode, Interrupts

## Project Structure

```
mini-os/
├── boot/
│   └── boot.asm          # Bootloader
├── kernel/
│   ├── kernel.c          # Kernel main
│   ├── screen.c          # VGA text mode
│   ├── keyboard.c        # Keyboard driver
│   └── memory.c          # Memory management
├── include/
│   └── *.h               # Header files
└── Makefile
```

## Step 1: Bootloader

বুটলোডার হলো প্রথম কোড যা CPU এক্সিকিউট করে।

```asm
; boot.asm
[BITS 16]           ; 16-bit real mode
[ORG 0x7C00]        ; BIOS loads bootloader here

start:
    mov si, msg
    call print_string
    jmp $           ; Infinite loop

print_string:
    lodsb           ; Load byte from SI to AL
    or al, al       ; Check if zero
    jz done
    mov ah, 0x0E    ; BIOS teletype function
    int 0x10        ; BIOS interrupt
    jmp print_string
done:
    ret

msg db 'Booting Mini OS...', 0

times 510-($-$$) db 0    ; Pad to 510 bytes
dw 0xAA55                ; Boot signature
```

## Step 2: Kernel Entry Point

কার্নেল এন্ট্রি পয়েন্ট (Assembly থেকে C-তে জাম্প)।

```asm
; kernel_entry.asm
[BITS 32]
[EXTERN kernel_main]

global _start

_start:
    cli                 ; Disable interrupts
    call kernel_main    ; Call C kernel
    hlt                 ; Halt CPU
```

## Step 3: VGA Text Mode Driver

স্ক্রিনে টেক্সট প্রিন্ট করার জন্য।

```c
// screen.c
#define VIDEO_MEMORY 0xB8000
#define SCREEN_WIDTH 80
#define SCREEN_HEIGHT 25

static char *video_memory = (char *)VIDEO_MEMORY;
static int cursor_x = 0;
static int cursor_y = 0;

void clear_screen() {
    for (int i = 0; i < SCREEN_WIDTH * SCREEN_HEIGHT * 2; i++) {
        video_memory[i] = 0;
    }
    cursor_x = 0;
    cursor_y = 0;
}

void print_char(char c) {
    if (c == '\n') {
        cursor_x = 0;
        cursor_y++;
    } else {
        int offset = (cursor_y * SCREEN_WIDTH + cursor_x) * 2;
        video_memory[offset] = c;
        video_memory[offset + 1] = 0x0F; // White on black
        cursor_x++;
        if (cursor_x >= SCREEN_WIDTH) {
            cursor_x = 0;
            cursor_y++;
        }
    }
}

void print_string(const char *str) {
    while (*str) {
        print_char(*str++);
    }
}
```

## Step 4: Interrupt Descriptor Table (IDT)

ইন্টারাপ্ট হ্যান্ডল করার জন্য।

```c
// idt.c
#define IDT_ENTRIES 256

typedef struct {
    unsigned short base_low;
    unsigned short selector;
    unsigned char zero;
    unsigned char flags;
    unsigned short base_high;
} __attribute__((packed)) idt_entry_t;

typedef struct {
    unsigned short limit;
    unsigned int base;
} __attribute__((packed)) idt_ptr_t;

idt_entry_t idt[IDT_ENTRIES];
idt_ptr_t idt_ptr;

void idt_set_gate(int num, unsigned int base, unsigned short selector, unsigned char flags) {
    idt[num].base_low = base & 0xFFFF;
    idt[num].base_high = (base >> 16) & 0xFFFF;
    idt[num].selector = selector;
    idt[num].zero = 0;
    idt[num].flags = flags;
}

void idt_install() {
    idt_ptr.limit = sizeof(idt) - 1;
    idt_ptr.base = (unsigned int)&idt;

    // Load IDT
    __asm__ volatile("lidt (%0)" : : "r"(&idt_ptr));
}
```

## Step 5: Keyboard Driver

কীবোর্ড ইনপুট নেওয়ার জন্য।

```c
// keyboard.c
#define KEYBOARD_DATA_PORT 0x60
#define KEYBOARD_STATUS_PORT 0x64

unsigned char inb(unsigned short port) {
    unsigned char result;
    __asm__ volatile("inb %1, %0" : "=a"(result) : "Nd"(port));
    return result;
}

void keyboard_handler() {
    unsigned char scancode = inb(KEYBOARD_DATA_PORT);

    // Simple scancode to ASCII conversion
    if (scancode < 128) {
        char c = scancode_to_ascii(scancode);
        print_char(c);
    }
}
```

## Step 6: Kernel Main

```c
// kernel.c
void kernel_main() {
    clear_screen();
    print_string("Welcome to Mini OS!\n");
    print_string("Kernel initialized successfully.\n");

    // Initialize IDT
    idt_install();

    // Enable interrupts
    __asm__ volatile("sti");

    // Infinite loop
    while (1) {
        __asm__ volatile("hlt");
    }
}
```

## Step 7: Makefile

```makefile
ASM = nasm
CC = gcc
LD = ld

CFLAGS = -m32 -ffreestanding -nostdlib -fno-pie
LDFLAGS = -m elf_i386 -T linker.ld

all: os.img

boot.bin: boot/boot.asm
	$(ASM) -f bin $< -o $@

kernel_entry.o: kernel/kernel_entry.asm
	$(ASM) -f elf32 $< -o $@

kernel.o: kernel/kernel.c
	$(CC) $(CFLAGS) -c $< -o $@

screen.o: kernel/screen.c
	$(CC) $(CFLAGS) -c $< -o $@

kernel.bin: kernel_entry.o kernel.o screen.o
	$(LD) $(LDFLAGS) -o $@ $^

os.img: boot.bin kernel.bin
	cat $^ > $@

run: os.img
	qemu-system-i386 -fda $<

clean:
	rm -f *.o *.bin *.img
```

## Compilation & Running

```bash
make
make run
```

## Advanced Features

### 1. Memory Management

```c
// Simple heap allocator
void* kmalloc(size_t size);
void kfree(void* ptr);
```

### 2. Process Management

```c
// Simple task switching
void create_task(void (*func)());
void schedule();
```

### 3. File System

```c
// Simple FAT12 file system
int read_file(const char* filename, char* buffer);
```

## Learning Outcomes

এই প্রজেক্ট করে আপনি শিখবেন:

- **Bootloader:** কীভাবে OS বুট হয়
- **Protected Mode:** 16-bit থেকে 32-bit মোডে সুইচ
- **Interrupts:** হার্ডওয়্যার ইন্টারাপ্ট হ্যান্ডলিং
- **Device Drivers:** VGA, Keyboard ড্রাইভার
- **Low-level Programming:** Assembly এবং C মিক্স করা

## Resources

- **OSDev Wiki:** https://wiki.osdev.org/
- **Writing a Simple Operating System from Scratch** by Nick Blundell
- **The Little Book About OS Development**
