import { ssrRenderAttrs } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"Common LLD Problems (প্র্যাকটিক্যাল প্রবলেম সলভ)","description":"","frontmatter":{},"headers":[],"relativePath":"system-design/lld/problems/index.md","filePath":"system-design/lld/problems/index.md"}');
const _sfc_main = { name: "system-design/lld/problems/index.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="common-lld-problems-প্র্যাকটিক্যাল-প্রবলেম-সলভ" tabindex="-1">Common LLD Problems (প্র্যাকটিক্যাল প্রবলেম সলভ) <a class="header-anchor" href="#common-lld-problems-প্র্যাকটিক্যাল-প্রবলেম-সলভ" aria-label="Permalink to &quot;Common LLD Problems (প্র্যাকটিক্যাল প্রবলেম সলভ)&quot;">​</a></h1><p>লো-লেভেল ডিজাইন (LLD) শেখার সেরা উপায় হলো রিয়েল-ওয়ার্ল্ড প্রবলেম সলভ করা। এখানে আমরা বিভিন্ন জনপ্রিয় ইন্টারভিউ প্রবলেম এবং সেগুলোর গভীর সমাধান নিয়ে আলোচনা করব।</p><hr><h2 id="প্রবলেম-লিস্ট" tabindex="-1">প্রবলেম লিস্ট <a class="header-anchor" href="#প্রবলেম-লিস্ট" aria-label="Permalink to &quot;প্রবলেম লিস্ট&quot;">​</a></h2><h3 id="১-গেম-ডিজাইন-games" tabindex="-1">১. গেম ডিজাইন (Games) <a class="header-anchor" href="#১-গেম-ডিজাইন-games" aria-label="Permalink to &quot;১. গেম ডিজাইন (Games)&quot;">​</a></h3><ul><li><a href="./tic-tac-toe.html">Tic-tac-toe / Chess Design</a></li><li>[Snake &amp; Ladder Game]</li></ul><h3 id="২-ম্যানেজমেন্ট-সিস্টেম-management-systems" tabindex="-1">২. ম্যানেজমেন্ট সিস্টেম (Management Systems) <a class="header-anchor" href="#২-ম্যানেজমেন্ট-সিস্টেম-management-systems" aria-label="Permalink to &quot;২. ম্যানেজমেন্ট সিস্টেম (Management Systems)&quot;">​</a></h3><ul><li><a href="./parking-lot.html">Parking Lot System</a></li><li>[Library Management System]</li><li><a href="./movie-ticket.html">Movie Ticket Booking (BookMyShow)</a></li></ul><h3 id="৩-রিয়েল-টাইম-অ্যাপস-real-time-apps" tabindex="-1">৩. রিয়েল-টাইম অ্যাপস (Real-time Apps) <a class="header-anchor" href="#৩-রিয়েল-টাইম-অ্যাপস-real-time-apps" aria-label="Permalink to &quot;৩. রিয়েল-টাইম অ্যাপস (Real-time Apps)&quot;">​</a></h3><ul><li><a href="./splitwise.html">Splitwise App Design</a></li><li>[Food Delivery App (Swiggy/Zomato)]</li><li><a href="./notification.html">Notification System</a></li></ul><h3 id="৪-ইউটিলিটি-এবং-ইনফ্রাস্ট্রাকচার-utility-infrastructure" tabindex="-1">৪. ইউটিলিটি এবং ইনফ্রাস্ট্রাকচার (Utility &amp; Infrastructure) <a class="header-anchor" href="#৪-ইউটিলিটি-এবং-ইনফ্রাস্ট্রাকচার-utility-infrastructure" aria-label="Permalink to &quot;৪. ইউটিলিটি এবং ইনফ্রাস্ট্রাকচার (Utility &amp; Infrastructure)&quot;">​</a></h3><ul><li><a href="./elevator.html">Elevator System (Multiple Lifts)</a></li><li>[Logging Framework]</li><li><a href="./rate-limiter.html">Rate Limiter</a></li><li><a href="./url-shortener.html">URL Shortener</a></li></ul><hr><div class="tip custom-block github-alert"><p class="custom-block-title">TIP</p><p>প্রতিটি প্রবলেম সলভ করার সময় <strong>OOP Principles</strong>, <strong>Design Patterns</strong> এবং <strong>Thread Safety</strong> এর কথা মাথায় রাখবেন।</p></div></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("system-design/lld/problems/index.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  index as default
};
