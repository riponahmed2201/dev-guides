import { ssrRenderAttrs } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"SOLID Principles (সলিড প্রিন্সিপাল)","description":"","frontmatter":{},"headers":[],"relativePath":"design-patterns/solid.md","filePath":"design-patterns/solid.md"}');
const _sfc_main = { name: "design-patterns/solid.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="solid-principles-সলিড-প্রিন্সিপাল" tabindex="-1">SOLID Principles (সলিড প্রিন্সিপাল) <a class="header-anchor" href="#solid-principles-সলিড-প্রিন্সিপাল" aria-label="Permalink to &quot;SOLID Principles (সলিড প্রিন্সিপাল)&quot;">​</a></h1><p>SOLID হলো পাঁচটি ডিজাইন প্রিন্সিপাল যা সফ্টওয়্যার ডিজাইনকে আরও ফ্লেক্সিবল, স্কেলেবল এবং মেইনটেইনেবল করে।</p><hr><h2 id="১-s-single-responsibility-srp" tabindex="-1">১. S - Single Responsibility (SRP) <a class="header-anchor" href="#১-s-single-responsibility-srp" aria-label="Permalink to &quot;১. S - Single Responsibility (SRP)&quot;">​</a></h2><p>একটি ক্লাসের শুধুমাত্র একটি নির্দিষ্ট কাজ থাকতে হবে। একাধিক দায়িত্ব একটি ক্লাসে রাখা যাবে না।</p><h2 id="২-o-open-closed-ocp" tabindex="-1">২. O - Open/Closed (OCP) <a class="header-anchor" href="#২-o-open-closed-ocp" aria-label="Permalink to &quot;২. O - Open/Closed (OCP)&quot;">​</a></h2><p>সফ্টওয়্যার এনটিটি (ক্লাস, মডিউল) নতুন ফিচার যোগ করার জন্য <strong>ওপেন</strong> থাকবে, কিন্তু তার অভ্যন্তরীণ কোড পরিবর্তন করার জন্য <strong>ক্লোজ</strong> থাকবে।</p><h2 id="৩-l-liskov-substitution-lsp" tabindex="-1">৩. L - Liskov Substitution (LSP) <a class="header-anchor" href="#৩-l-liskov-substitution-lsp" aria-label="Permalink to &quot;৩. L - Liskov Substitution (LSP)&quot;">​</a></h2><p>একটি প্যারেন্ট ক্লাসের অবজেক্টকে তার চাইল্ড ক্লাসের অবজেক্ট দিয়ে রিপ্লেস করা সম্ভব হতে হবে, যেন প্রোগ্রামের কোনো লজিক ভেঙে না যায়।</p><h2 id="৪-i-interface-segregation-isp" tabindex="-1">৪. I - Interface Segregation (ISP) <a class="header-anchor" href="#৪-i-interface-segregation-isp" aria-label="Permalink to &quot;৪. I - Interface Segregation (ISP)&quot;">​</a></h2><p>ইউজারকে এমন কোনো ইন্টারফেস ব্যবহার করতে বাধ্য করা উচিত নয় যা তার প্রয়োজন নেই। বড় ইন্টারফেসের বদলে ছোট এবং নির্দিষ্ট ইন্টারফেস ব্যবহার করা ভালো।</p><h2 id="৫-d-dependency-inversion-dip" tabindex="-1">৫. D - Dependency Inversion (DIP) <a class="header-anchor" href="#৫-d-dependency-inversion-dip" aria-label="Permalink to &quot;৫. D - Dependency Inversion (DIP)&quot;">​</a></h2><p>হাই-লেভেল মডিউলগুলো লো-লেভেল মডিউলের ওপর সরাসরি নির্ভর করবে না; উভয়েই অ্যাবস্ট্রাকশনের ওপর নির্ভর করবে।</p><hr><h2 id="কেন-শিখবেন" tabindex="-1">কেন শিখবেন? <a class="header-anchor" href="#কেন-শিখবেন" aria-label="Permalink to &quot;কেন শিখবেন?&quot;">​</a></h2><ul><li>কোড রিইউজেবিলিটি বাড়ে।</li><li>বাগ ফিক্স করা সহজ হয়।</li><li>বড় টিমে কাজ করার সময় কনফ্লিক্ট কমে।</li></ul><hr><div class="tip custom-block"><p class="custom-block-title">TIP</p><p>প্রিন্সিপালগুলো প্রথমবার শুনে কঠিন মনে হতে পারে, কিন্তু রিয়েল কোডে ইম্প্লিমেন্ট করলে এগুলো আপনার কোডিং স্টাইলকে বদলে দেবে।</p></div></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("design-patterns/solid.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const solid = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  solid as default
};
