import { ssrRenderAttrs } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"Design Patterns & Principles 🏗️","description":"","frontmatter":{},"headers":[],"relativePath":"design-patterns/index.md","filePath":"design-patterns/index.md"}');
const _sfc_main = { name: "design-patterns/index.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="design-patterns-principles-🏗️" tabindex="-1">Design Patterns &amp; Principles 🏗️ <a class="header-anchor" href="#design-patterns-principles-🏗️" aria-label="Permalink to &quot;Design Patterns &amp; Principles 🏗️&quot;">​</a></h1><p>সফ্টওয়্যার ইঞ্জিনিয়ারিংয়ের অন্যতম গুরুত্বপূর্ণ বিষয় হলো ডিজাইন প্যাটার্ন এবং প্রিন্সিপাল। এখানে আমরা কোডকে আরও রিডেবল এবং মেইনটেইনেবল করার কৌশলগুলো শিখবো।</p><hr><h2 id="📚-level-1-foundation" tabindex="-1">📚 Level 1: Foundation <a class="header-anchor" href="#📚-level-1-foundation" aria-label="Permalink to &quot;📚 Level 1: Foundation&quot;">​</a></h2><ul><li><a href="/dev-guides/design-patterns/oop-basics.html">OOP Fundamentals</a></li><li><a href="/dev-guides/design-patterns/solid.html">SOLID Principles</a></li><li><a href="/dev-guides/design-patterns/core-principles.html">DRY, KISS, YAGNI</a></li></ul><hr><h2 id="🚀-পরবর্তী-পদক্ষেপ" tabindex="-1">🚀 পরবর্তী পদক্ষেপ <a class="header-anchor" href="#🚀-পরবর্তী-পদক্ষেপ" aria-label="Permalink to &quot;🚀 পরবর্তী পদক্ষেপ&quot;">​</a></h2><p>বামে থাকা সাইডবার থেকে আপনার পছন্দের টপিকটি সিলেক্ট করে শেখা শুরু করুন।</p></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("design-patterns/index.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  index as default
};
