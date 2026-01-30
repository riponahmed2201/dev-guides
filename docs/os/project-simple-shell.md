# Project: Write a Simple Shell

একটি সিম্পল শেল তৈরি করা OS কনসেপ্ট বোঝার জন্য একটি দুর্দান্ত প্রজেক্ট। এই প্রজেক্টে আপনি process creation, system calls, এবং I/O handling শিখবেন।

## প্রজেক্ট ওভারভিউ

একটি শেল হলো একটি কমান্ড-লাইন ইন্টারপ্রেটার যা ইউজারের কমান্ড নিয়ে এক্সিকিউট করে। আমরা একটি বেসিক শেল বানাবো যা:

- কমান্ড রিড করবে
- কমান্ড পার্স করবে
- নতুন প্রসেস তৈরি করে কমান্ড এক্সিকিউট করবে
- বিল্ট-ইন কমান্ড সাপোর্ট করবে

## Requirements

- **Language:** C
- **OS:** Linux/Unix
- **System Calls:** `fork()`, `exec()`, `wait()`, `pipe()`

## Core Features

### 1. Command Reading

ইউজার থেকে ইনপুট নেওয়া।

```c
#include <stdio.h>
#include <string.h>

#define MAX_CMD_LEN 1024

void read_command(char *cmd) {
    printf("myshell> ");
    fgets(cmd, MAX_CMD_LEN, stdin);
    cmd[strcspn(cmd, "\n")] = 0; // Remove newline
}
```

### 2. Command Parsing

কমান্ড এবং আর্গুমেন্ট আলাদা করা।

```c
#include <string.h>

void parse_command(char *cmd, char **args) {
    int i = 0;
    args[i] = strtok(cmd, " ");
    while (args[i] != NULL) {
        i++;
        args[i] = strtok(NULL, " ");
    }
}
```

### 3. Command Execution

`fork()` এবং `exec()` ব্যবহার করে কমান্ড রান করা।

```c
#include <unistd.h>
#include <sys/wait.h>

void execute_command(char **args) {
    pid_t pid = fork();

    if (pid == 0) {
        // Child process
        if (execvp(args[0], args) == -1) {
            perror("myshell");
        }
        exit(EXIT_FAILURE);
    } else if (pid < 0) {
        // Fork failed
        perror("myshell");
    } else {
        // Parent process
        wait(NULL);
    }
}
```

### 4. Built-in Commands

`cd`, `exit` এর মতো বিল্ট-ইন কমান্ড।

```c
#include <unistd.h>

int builtin_cd(char **args) {
    if (args[1] == NULL) {
        fprintf(stderr, "myshell: expected argument to \"cd\"\n");
    } else {
        if (chdir(args[1]) != 0) {
            perror("myshell");
        }
    }
    return 1;
}

int builtin_exit(char **args) {
    return 0;
}
```

## Complete Shell Implementation

```c
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <sys/wait.h>

#define MAX_CMD_LEN 1024
#define MAX_ARGS 64

// Built-in commands
char *builtin_str[] = {"cd", "exit"};

int (*builtin_func[])(char **) = {&builtin_cd, &builtin_exit};

int num_builtins() {
    return sizeof(builtin_str) / sizeof(char *);
}

int builtin_cd(char **args) {
    if (args[1] == NULL) {
        fprintf(stderr, "myshell: expected argument to \"cd\"\n");
    } else {
        if (chdir(args[1]) != 0) {
            perror("myshell");
        }
    }
    return 1;
}

int builtin_exit(char **args) {
    return 0;
}

void read_command(char *cmd) {
    printf("myshell> ");
    fgets(cmd, MAX_CMD_LEN, stdin);
    cmd[strcspn(cmd, "\n")] = 0;
}

void parse_command(char *cmd, char **args) {
    int i = 0;
    args[i] = strtok(cmd, " ");
    while (args[i] != NULL) {
        i++;
        args[i] = strtok(NULL, " ");
    }
}

int execute_command(char **args) {
    if (args[0] == NULL) {
        return 1;
    }

    // Check for built-in commands
    for (int i = 0; i < num_builtins(); i++) {
        if (strcmp(args[0], builtin_str[i]) == 0) {
            return (*builtin_func[i])(args);
        }
    }

    // Execute external command
    pid_t pid = fork();

    if (pid == 0) {
        if (execvp(args[0], args) == -1) {
            perror("myshell");
        }
        exit(EXIT_FAILURE);
    } else if (pid < 0) {
        perror("myshell");
    } else {
        wait(NULL);
    }

    return 1;
}

int main() {
    char cmd[MAX_CMD_LEN];
    char *args[MAX_ARGS];
    int status = 1;

    while (status) {
        read_command(cmd);
        parse_command(cmd, args);
        status = execute_command(args);
    }

    return 0;
}
```

## Compilation & Running

```bash
gcc -o myshell shell.c
./myshell
```

## Advanced Features (Optional)

### 1. Piping Support

```c
// Example: ls | grep txt
```

### 2. I/O Redirection

```c
// Example: ls > output.txt
```

### 3. Background Processes

```c
// Example: sleep 10 &
```

## Learning Outcomes

এই প্রজেক্ট করে আপনি শিখবেন:

- **Process Creation:** `fork()` কীভাবে কাজ করে
- **Process Execution:** `exec()` ফ্যামিলি ফাংশন
- **Process Synchronization:** `wait()` দিয়ে চাইল্ড প্রসেস ম্যানেজ করা
- **System Calls:** OS-এর সাথে ইন্টারঅ্যাক্ট করা
- **String Manipulation:** C-তে স্ট্রিং পার্সিং
