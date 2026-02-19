# Server-Side Rendering (SSR)

## Rendering কী?

**Rendering** মানে হলো HTML তৈরি করা যা browser screen-এ দেখায়। প্রশ্ন হলো — HTML **কোথায়** তৈরি হচ্ছে?

```
Server-Side Rendering (SSR):  Server HTML তৈরি করে → Browser শুধু দেখায়
Client-Side Rendering (CSR):  Server JSON দেয় → Browser JavaScript দিয়ে HTML তৈরি করে
```

---

## CSR vs SSR — মূল পার্থক্য

### Client-Side Rendering (CSR)

React, Vue, Angular — এরা by default CSR করে:

```
Browser                               Server
  |── GET /dashboard ────────────────►|
  |◄── Empty HTML + JS bundle ────────|
  |                                    |
  |  (JavaScript download হচ্ছে...)   |
  |  (JavaScript execute হচ্ছে...)    |
  |                                    |
  |── GET /api/data ─────────────────►|  (API call)
  |◄── JSON data ─────────────────────|
  |                                    |
  |  (JavaScript HTML তৈরি করছে...)  |
  |  ✅ Page দেখা যাচ্ছে!            |
```

**Browser যা পায় প্রথমে:**

```html
<!DOCTYPE html>
<html>
<body>
  <div id="root"></div>              ← ফাঁকা!
  <script src="/bundle.js"></script>  ← 500KB JavaScript
</body>
</html>
```

```
Timeline:
0s ──── Request পাঠালো
0.5s ── Empty HTML পেলো (সাদা screen!)
2s ──── JS download হলো
3s ──── JS execute হলো + API call
4s ──── Data পেলো + HTML render হলো ← এখন দেখা যাচ্ছে!

User ৩-৪ সেকেন্ড সাদা screen দেখে!
```

### Server-Side Rendering (SSR)

Server **পুরো HTML ready করে** পাঠায়:

```
Browser                               Server
  |── GET /dashboard ────────────────►|
  |                                    |  (Server data fetch করে)
  |                                    |  (Server HTML তৈরি করে)
  |◄── Complete HTML ─────────────────|
  |                                    |
  |  ✅ Page দেখা যাচ্ছে!            |
  |                                    |
  |  (JavaScript download হচ্ছে...)   |  (Hydration)
  |  ✅ Page interactive হলো!         |
```

**Browser যা পায় প্রথমে:**

```html
<!DOCTYPE html>
<html>
<body>
  <div id="root">
    <h1>Dashboard</h1>              ← Content আছে!
    <div class="stats">
      <p>Total Users: 1,234</p>     ← Data আছে!
      <p>Revenue: $56,789</p>
    </div>
    <ul class="users">
      <li>Ripon Ahmed</li>          ← List আছে!
      <li>Karim Hasan</li>
    </ul>
  </div>
  <script src="/bundle.js"></script>
</body>
</html>
```

```
Timeline:
0s ──── Request পাঠালো
0.8s ── Complete HTML পেলো ← এখনই দেখা যাচ্ছে!
2s ──── JS download → Hydration → Interactive

User ০.৮ সেকেন্ডেই content দেখে!
```

---

## Hydration কী?

SSR-এ server HTML পাঠায় — কিন্তু সেই HTML **static** (button click কাজ করে না)। JavaScript download হওয়ার পর **hydration** হয় — JavaScript static HTML-কে **interactive** করে তোলে।

```
Step 1: Server → Complete HTML (দেখা যায়, কিন্তু click কাজ করে না)
Step 2: JS download + execute
Step 3: Hydration → JavaScript static HTML-এ event listeners attach করে
Step 4: এখন button click, form submit সব কাজ করে!
```

```
SSR Page Timeline:

0s ─── Request
       ↓
0.8s ─ FCP (First Contentful Paint) ← User content দেখে
       ↓
       (JS downloading...)
       ↓
2.5s ─ TTI (Time to Interactive) ← User interact করতে পারে
```

**Important metrics:**

| Metric | মানে | CSR | SSR |
|--------|------|-----|-----|
| **FCP** (First Contentful Paint) | প্রথম content দেখা | ধীর (3-4s) | দ্রুত (0.5-1s) |
| **TTI** (Time to Interactive) | Interactive হওয়া | FCP-র পরে | FCP-র কিছু পরে |
| **TTFB** (Time to First Byte) | প্রথম byte আসা | দ্রুত | ধীর (server processing) |

---

## Static Site Generation (SSG)

**Build time-এ** HTML তৈরি করে রাখা — প্রতিটি request-এ server-এ render করতে হয় না:

```
SSR:  User request → Server render → HTML response (প্রতিবার)
SSG:  Build time → HTML files ready → CDN serve করে (instant!)
```

```
Build:
npm run build
  ├── /index.html        (ready)
  ├── /about.html        (ready)
  ├── /blog/post-1.html  (ready)
  ├── /blog/post-2.html  (ready)
  └── /products.html     (ready)

Deploy to CDN → User request → CDN থেকে instant serve
```

```
SSG সুবিধা:
- সবচেয়ে দ্রুত (CDN থেকে static file)
- Server load নেই
- সবচেয়ে সস্তা hosting

SSG সমস্যা:
- Data বদলালে rebuild করতে হয়
- Dynamic content (user-specific) কঠিন
- বড় site-এ build time অনেক বেশি
```

---

## ISR — Incremental Static Regeneration

SSG + SSR-এর মিশ্রণ। **Static page serve করে কিন্তু background-এ নির্দিষ্ট সময় পর update করে:**

```
প্রথম request:  CDN থেকে cached HTML (instant!)
Background:     Server নতুন HTML generate করে
পরের request:   Updated HTML (CDN cache update হয়ে গেছে)
```

```
revalidate: 60 মানে:
0s ─── User A → Cached page পায় (instant)
30s ── User B → Same cached page
60s ── Cache expired
61s ── User C → Stale page পায় (instant!) + Background-এ নতুন page generate হচ্ছে
62s ── User D → নতুন page পায়
```

> Next.js এই feature-এর জন্য বিখ্যাত।

---

## সব Rendering Strategy তুলনা

| Strategy | কোথায় render | কখন render | Speed | SEO | Dynamic |
|----------|-------------|-----------|-------|-----|---------|
| **CSR** | Browser | Runtime (client) | ধীর FCP | ❌ খারাপ | ✅ |
| **SSR** | Server | Runtime (server) | দ্রুত FCP | ✅ ভালো | ✅ |
| **SSG** | Server | Build time | সবচেয়ে দ্রুত | ✅ ভালো | ❌ |
| **ISR** | Server | Build + Interval | দ্রুত | ✅ ভালো | ⚠️ কিছুটা |

```
কোনটা কখন:

Blog/Docs         → SSG (content খুব কম বদলায়)
E-commerce home   → ISR (price update হয়, কিন্তু instant load দরকার)
Dashboard         → CSR (user-specific, login-এর পিছনে)
Product page      → SSR (SEO দরকার + dynamic price/stock)
Landing page      → SSG (static content, সবচেয়ে দ্রুত)
Social media feed → CSR (user-specific, real-time)
News site         → ISR/SSR (SEO + frequently updated)
```

---

## SSR-এর সুবিধা ও অসুবিধা

### সুবিধা

**1. SEO (Search Engine Optimization)**

```
Google Bot CSR page visit করলে:
<div id="root"></div>  ← ফাঁকা! Google কিছু দেখে না

Google Bot SSR page visit করলে:
<h1>Best Laptops 2026</h1>
<p>Here are the top 10 laptops...</p>  ← Google সব content দেখে!
```

> Google Bot JavaScript execute করতে পারে কিন্তু সবসময় reliable না। SSR-এ SEO guaranteed।

**2. দ্রুত First Paint**

```
CSR: সাদা screen 3-4 সেকেন্ড → তারপর content
SSR: 0.5-1 সেকেন্ডে content দেখা যায়
```

**3. Social Media Sharing**

```
Facebook/Twitter link share করলে preview দেখায়:

CSR: <div id="root"></div> → কোনো preview দেখায় না!
SSR: <meta og:title="..."> + actual content → সুন্দর preview
```

**4. Low-End Device Performance**

```
CSR: Client-এর device-এ JavaScript heavy lifting
SSR: Server-এ render → client শুধু HTML দেখায়
→ পুরনো phone-এও দ্রুত load হয়
```

### অসুবিধা

**1. Server Load বেশি**

```
CSR: Server শুধু JSON দেয় (lightweight)
SSR: Server প্রতি request-এ HTML render করে (CPU intensive)

1000 user একসাথে request করলে:
CSR server: 1000 JSON response (সহজ)
SSR server: 1000 HTML render (heavy!)
```

**2. TTFB ধীর**

```
CSR: Server instantly JSON/HTML পাঠায় (fast TTFB)
SSR: Server data fetch + render করে তারপর পাঠায় (slow TTFB)
```

**3. Server Cost বেশি**

```
CSR: Static hosting (Netlify, Vercel free tier) → $0
SSR: Server runtime দরকার (Node.js server) → $$
SSG: CDN hosting → $
```

**4. Complexity বেশি**

```
CSR: Frontend শুধু API call করে
SSR: Server-side data fetching, caching, error handling, hydration — সব manage করতে হয়
```

---

## SSR Frameworks

| Framework | Language | Built on |
|-----------|----------|----------|
| **Next.js** | JavaScript/TypeScript | React |
| **Nuxt.js** | JavaScript/TypeScript | Vue |
| **SvelteKit** | JavaScript/TypeScript | Svelte |
| **Remix** | JavaScript/TypeScript | React |
| **Astro** | JavaScript/TypeScript | Any (React, Vue, Svelte) |
| **Django** | Python | Django Templates |
| **Laravel** | PHP | Blade Templates |
| **Rails** | Ruby | ERB Templates |

### Traditional SSR vs Modern SSR

```
Traditional SSR (Django, Laravel, Rails):
Server → Full HTML page (server templates) → Browser
→ প্রতিটি page navigation-এ full page reload

Modern SSR (Next.js, Nuxt.js):
First load: Server → Full HTML (SSR) → Browser
After that: Client-side navigation (SPA-like, no full reload)
→ প্রথম load দ্রুত + পরবর্তী navigation-ও দ্রুত (best of both!)
```

---

## Next.js SSR Example

### Page-Level SSR

```javascript
// pages/products/[id].js

export async function getServerSideProps(context) {
  const { id } = context.params;
  const res = await fetch(`https://api.example.com/products/${id}`);
  const product = await res.json();

  return {
    props: { product }
  };
}

export default function ProductPage({ product }) {
  return (
    <div>
      <h1>{product.name}</h1>
      <p>Price: ${product.price}</p>
      <p>{product.description}</p>
    </div>
  );
}
```

```
User visits /products/42:
1. Server getServerSideProps() চলে
2. API থেকে product data fetch করে
3. Component render করে HTML তৈরি করে
4. Complete HTML client-কে পাঠায়
5. Client-এ hydration হয়
```

### SSG with Next.js

```javascript
// pages/blog/[slug].js

export async function getStaticPaths() {
  const posts = await fetch('https://api.example.com/posts');
  const data = await posts.json();

  return {
    paths: data.map(post => ({
      params: { slug: post.slug }
    })),
    fallback: false
  };
}

export async function getStaticProps({ params }) {
  const res = await fetch(`https://api.example.com/posts/${params.slug}`);
  const post = await res.json();

  return {
    props: { post },
    revalidate: 3600   // ISR: ১ ঘণ্টা পর revalidate
  };
}
```

### App Router (Next.js 13+)

```javascript
// app/products/[id]/page.js

async function getProduct(id) {
  const res = await fetch(`https://api.example.com/products/${id}`, {
    cache: 'no-store'  // SSR (প্রতিবার fresh data)
  });
  return res.json();
}

export default async function ProductPage({ params }) {
  const product = await getProduct(params.id);

  return (
    <div>
      <h1>{product.name}</h1>
      <p>Price: ${product.price}</p>
    </div>
  );
}
```

---

## SSR Caching Strategy

SSR-এর সবচেয়ে বড় সমস্যা — server load। Caching দিয়ে সমাধান:

### Page-Level Cache

```
প্রথম request:  Server render → HTML → Cache-এ রাখো → Client-কে দাও
পরের request:  Cache থেকে দাও (server render করতে হলো না!)

Cache-Control: s-maxage=60, stale-while-revalidate=300

s-maxage=60           → CDN-এ ৬০ সেকেন্ড cache
stale-while-revalidate → Stale page দাও, background-এ update করো
```

### Fragment Caching

```html
<Header />          ← ১ ঘণ্টা cache (সবার জন্য একই)
<Sidebar />         ← ১ ঘণ্টা cache
<UserProfile />     ← No cache (user-specific)
<ProductList />     ← ৫ মিনিট cache
<Footer />          ← ২৪ ঘণ্টা cache
```

### Edge SSR (Vercel Edge, Cloudflare Workers)

```
Traditional SSR:
User (Bangladesh) → Server (US) → Render → Response
                    ~300ms latency

Edge SSR:
User (Bangladesh) → Edge (Singapore) → Render → Response
                    ~50ms latency!
```

> Server user-এর কাছের edge location-এ render করে — latency অনেক কম।

---

## Streaming SSR

পুরো page render শেষ হওয়ার আগেই **টুকরো টুকরো করে** পাঠানো:

```
Traditional SSR:
Server: (data fetch 1s) + (render 1s) = 2s পর পুরো HTML পাঠায়

Streaming SSR:
Server: Header পাঠাও (instant!)
        → Main content পাঠাও (0.5s পর)
        → Sidebar পাঠাও (1s পর)
        → Comments পাঠাও (2s পর)
```

```
User দেখে:
0s ─── Loading...
0.1s ─ Header দেখা যাচ্ছে!
0.5s ─ Main content দেখা যাচ্ছে!
1s ─── Sidebar দেখা যাচ্ছে!
2s ─── Comments দেখা যাচ্ছে!

(পুরো page-এর জন্য 2s অপেক্ষা না করে progressively দেখা যাচ্ছে)
```

```javascript
// React 18 + Next.js streaming
import { Suspense } from 'react';

export default function Page() {
  return (
    <div>
      <Header />
      <Suspense fallback={<Skeleton />}>
        <SlowComponent />
      </Suspense>
      <Suspense fallback={<Skeleton />}>
        <Comments />
      </Suspense>
    </div>
  );
}
```

---

## সংক্ষেপে মনে রাখার সূত্র

```
CSR → Browser renders (JS heavy, bad SEO)
SSR → Server renders per request (good SEO, server load)
SSG → Server renders at build time (fastest, static only)
ISR → SSG + periodic update (best of both)

SSR = Fast FCP + Good SEO + Server Cost
CSR = Slow FCP + Bad SEO + Cheap Hosting
SSG = Fastest + Good SEO + Static Content Only

Hydration = Server HTML + Client JS = Interactive Page
Streaming = Send HTML in chunks (don't wait for everything)
```

---

## Interview Golden Lines

> **SSR is fast for users but expensive for servers. CSR is cheap for servers but slow for users.**

> **Hydration is where JavaScript takes over the server-rendered HTML and makes it interactive.**

> **SSG is the fastest because there's no server rendering at all — it's just static files on a CDN.**

> **ISR gives you the speed of SSG with the freshness of SSR — it revalidates pages in the background.**

> **The real question isn't CSR vs SSR — it's which pages need which strategy. Most apps use a mix.**
