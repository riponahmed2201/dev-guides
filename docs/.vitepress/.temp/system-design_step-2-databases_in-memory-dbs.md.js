import { ssrRenderAttrs } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"In-Memory Databases","description":"","frontmatter":{},"headers":[],"relativePath":"system-design/step-2-databases/in-memory-dbs.md","filePath":"system-design/step-2-databases/in-memory-dbs.md"}');
const _sfc_main = { name: "system-design/step-2-databases/in-memory-dbs.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="in-memory-databases" tabindex="-1">In-Memory Databases <a class="header-anchor" href="#in-memory-databases" aria-label="Permalink to &quot;In-Memory Databases&quot;">​</a></h1><p>ইন-মেমোরি ডেটাবেস হলো এমন এক ধরনের ডেটাবেস যা তথ্য সরাসরি র্যামে (RAM) স্টোর করে রাখে, হার্ডডিস্কে নয়। ফলে এটি অত্যন্ত দ্রুত গতির হয়।</p><h2 id="কেন-ইন-মেমোরি-ডেটাবেস-প্রয়োজন" tabindex="-1">কেন ইন-মেমোরি ডেটাবেস প্রয়োজন? <a class="header-anchor" href="#কেন-ইন-মেমোরি-ডেটাবেস-প্রয়োজন" aria-label="Permalink to &quot;কেন ইন-মেমোরি ডেটাবেস প্রয়োজন?&quot;">​</a></h2><p>সাধারণ ডেটাবেস (Disk-based) থেকে ডেটা রিড করতে কিছুটা সময় লাগে কারণ ডিস্ক র্যামের তুলনায় ধীরগতিসম্পন্ন। যখন কোনো অ্যাপ্লিকেশনে মিলিসেকেন্ডের মধ্যে রেসপন্স প্রয়োজন হয়, তখন ইন-মেমোরি ডেটাবেস ব্যবহার করা হয়।</p><h2 id="জনপ্রিয়-ইন-মেমোরি-ডেটাবেস" tabindex="-1">জনপ্রিয় ইন-মেমোরি ডেটাবেস <a class="header-anchor" href="#জনপ্রিয়-ইন-মেমোরি-ডেটাবেস" aria-label="Permalink to &quot;জনপ্রিয় ইন-মেমোরি ডেটাবেস&quot;">​</a></h2><p>১. <strong>Redis (Remote Dictionary Server):</strong> সবচেয়ে জনপ্রিয় ওপেন সোর্স কী-ভ্যালু স্টোর। এটি ক্যাশিং, সেশন ম্যানেজমেন্ট এবং রিয়েল-টাইম অ্যানালিটিক্সের জন্য ব্যবহৃত হয়। ২. <strong>Memcached:</strong> এটি মূলত সিম্পল ক্যাশিং এর জন্য ব্যবহৃত হয়। মাল্টি-থ্রেডেড হওয়ার কারণে এটি অনেক রিকোয়স্ট হ্যান্ডেল করতে পারে।</p><h2 id="প্রধান-ব্যবহারের-ক্ষেত্রসমূহ-use-cases" tabindex="-1">প্রধান ব্যবহারের ক্ষেত্রসমূহ (Use Cases) <a class="header-anchor" href="#প্রধান-ব্যবহারের-ক্ষেত্রসমূহ-use-cases" aria-label="Permalink to &quot;প্রধান ব্যবহারের ক্ষেত্রসমূহ (Use Cases)&quot;">​</a></h2><ul><li><strong>Caching:</strong> ঘন ঘন প্রয়োজন এমন ডেটা জমিয়ে রাখা যাতে প্রতিবার মেইন ডিবিতে নক করতে না হয়।</li><li><strong>Session Management:</strong> ইউজারের লগইন সেশন বা টোকেন ম্যানেজ করা।</li><li><strong>Leaderboards:</strong> গেমিং অ্যাপ্লিকেশনে রিয়েল-টাইম স্কোর আপডেট করা।</li><li><strong>Message Queues:</strong> বিভিন্ন সার্ভিসের মধ্যে ডেটা পাস করা (Pub/Sub)।</li></ul><h2 id="বৈশিষ্ট্যসমূহ" tabindex="-1">বৈশিষ্ট্যসমূহ <a class="header-anchor" href="#বৈশিষ্ট্যসমূহ" aria-label="Permalink to &quot;বৈশিষ্ট্যসমূহ&quot;">​</a></h2><ul><li><strong>বিশাল গতি (Extreme Speed):</strong> মাইক্রোসেকেন্ড রেঞ্জে অপারেশন সম্পন্ন হয়।</li><li><strong>ভolatality:</strong> যদি সার্ভার বন্ধ হয়ে যায় তবে ডেটা হারিয়ে যেতে পারে (তবে Redis এ ডিস্ক পারসিস্টেন্স এর সুবিধা আছে)।</li><li><strong>লিমিটেড স্টোরেজ:</strong> যেহেতু র্যাম দামি, তাই এখানে বিশাল পরিমাণ ডেটা রাখা খরচসাপেক্ষ।</li></ul><div class="tip custom-block github-alert"><p class="custom-block-title">TIP</p><p>আপনার সিস্টেমের পারফরম্যান্স হঠাৎ করে অনেক গুণ বাড়িয়ে দেওয়ার সবচেয়ে সহজ উপায় হলো একটি <strong>Redis Cache</strong> লেয়ার যুক্ত করা।</p></div></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("system-design/step-2-databases/in-memory-dbs.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const inMemoryDbs = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  inMemoryDbs as default
};
