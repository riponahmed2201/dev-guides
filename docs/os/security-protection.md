# Security & Protection

অপারেটিং সিস্টেমের নিরাপত্তা এবং প্রোটেকশন নিশ্চিত করা অত্যন্ত গুরুত্বপূর্ণ যাতে অননুমোদিত এক্সেস এবং ডেটা চুরি প্রতিরোধ করা যায়।

## 1. User Authentication

**Authentication** হলো ইউজারের পরিচয় যাচাই করার প্রক্রিয়া। OS নিশ্চিত করে যে শুধুমাত্র অনুমোদিত ইউজাররাই সিস্টেম এক্সেস করতে পারে।

### Authentication Methods:

- **Password-based:** সবচেয়ে কমন। ইউজার নাম এবং পাসওয়ার্ড দিয়ে লগইন।
- **Biometric:** ফিঙ্গারপ্রিন্ট, ফেস রিকগনিশন।
- **Two-Factor Authentication (2FA):** পাসওয়ার্ড + OTP/SMS কোড।
- **Certificate-based:** ডিজিটাল সার্টিফিকেট ব্যবহার করে।

**Real-life Example:**
ব্যাংক লকারে ঢুকতে আপনার পরিচয়পত্র এবং চাবি দুটোই লাগে। এটি 2FA-র মতো।

## 2. Capabilities

**Capability** হলো একটি টোকেন যা নির্দিষ্ট রিসোর্সে নির্দিষ্ট অপারেশন করার অনুমতি দেয়। এটি একটি "key" এর মতো যা শুধুমাত্র নির্দিষ্ট দরজা খুলতে পারে।

**Example:**
একটি ফাইলের জন্য capability থাকতে পারে: `(File_ID, Read, Write)` - এর মানে এই capability দিয়ে শুধু ঐ ফাইলে রিড এবং রাইট করা যাবে, ডিলিট নয়।

**Advantage:** Fine-grained access control।

## 3. Sandboxing & Isolation

**Sandboxing** হলো একটি টেকনিক যেখানে প্রোগ্রামকে একটি আলাদা, সীমাবদ্ধ পরিবেশে চালানো হয় যাতে সিস্টেমের বাকি অংশে ক্ষতি করতে না পারে।

**Real-life Example:**
বাচ্চারা স্যান্ডবক্সে খেলে। তারা যা খুশি করতে পারে কিন্তু বাইরের বাগান নষ্ট করতে পারে না।

**Use Cases:**

- **Web Browsers:** প্রতিটি ট্যাব আলাদা স্যান্ডবক্সে চলে। একটি ট্যাব ক্র্যাশ করলে অন্যগুলো ঠিক থাকে।
- **Virtual Machines:** সম্পূর্ণ OS একটি VM-এ চালানো।
- **Containers (Docker):** অ্যাপ্লিকেশন আইসোলেশন।

## 4. Access Control Lists (ACL)

**ACL** হলো একটি লিস্ট যা নির্ধারণ করে কোন ইউজার বা গ্রুপ কোন রিসোর্সে কী কী অপারেশন করতে পারবে।

**Example:**

```
File: report.txt
- User: Alice → Read, Write
- User: Bob → Read
- Group: Admins → Read, Write, Delete
```

**Linux Permissions:**

```bash
-rwxr-xr--  # Owner: rwx, Group: r-x, Others: r--
```

## 5. Encryption in OS

**Encryption** হলো ডেটাকে এমনভাবে এনকোড করা যাতে শুধুমাত্র অনুমোদিত ব্যক্তিরা ডিকোড করে পড়তে পারে।

### Types:

- **Full Disk Encryption (FDE):** পুরো ডিস্ক এনক্রিপ্ট করা (যেমন BitLocker, LUKS)।
- **File-level Encryption:** নির্দিষ্ট ফাইল এনক্রিপ্ট করা।
- **Transport Encryption:** নেটওয়ার্কে ডেটা পাঠানোর সময় এনক্রিপ্ট করা (HTTPS, SSH)।

**Real-life Example:**
আপনি একটি চিঠি লিখে তালাবদ্ধ বক্সে রাখলেন। শুধুমাত্র যার কাছে চাবি আছে সে খুলে পড়তে পারবে। এখানে তালা = Encryption, চাবি = Decryption Key।

**Benefits:**

- ডেটা চুরি হলেও পড়া যাবে না।
- Privacy এবং Confidentiality নিশ্চিত করে।
