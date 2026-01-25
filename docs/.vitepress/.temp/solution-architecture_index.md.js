import { ssrRenderAttrs } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"Solution Architecture Guide 🏛️","description":"","frontmatter":{},"headers":[],"relativePath":"solution-architecture/index.md","filePath":"solution-architecture/index.md"}');
const _sfc_main = { name: "solution-architecture/index.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="solution-architecture-guide-🏛️" tabindex="-1">Solution Architecture Guide 🏛️ <a class="header-anchor" href="#solution-architecture-guide-🏛️" aria-label="Permalink to &quot;Solution Architecture Guide 🏛️&quot;">​</a></h1><p>একজন সলিউশন আর্কিটেক্ট হওয়ার জন্য যে যে বিষয়গুলো জানা প্রয়োজন, তার একটি পূর্ণাঙ্গ গাইড এখানে দেওয়া হয়েছে।</p><hr><h2 id="📚-level-1-foundation" tabindex="-1">📚 Level 1: Foundation <a class="header-anchor" href="#📚-level-1-foundation" aria-label="Permalink to &quot;📚 Level 1: Foundation&quot;">​</a></h2><ul><li><a href="/dev-guides/solution-architecture/">Architecture Intro</a></li><li><a href="/dev-guides/solution-architecture/sdlc.html">SDLC &amp; Agile</a></li><li><a href="/dev-guides/solution-architecture/system-design.html">System Design Basics</a></li><li><a href="/dev-guides/solution-architecture/cloud-intro.html">Cloud Intro</a></li></ul><hr><h2 id="🚀-পরবর্তী-পদক্ষেপ" tabindex="-1">🚀 পরবর্তী পদক্ষেপ <a class="header-anchor" href="#🚀-পরবর্তী-পদক্ষেপ" aria-label="Permalink to &quot;🚀 পরবর্তী পদক্ষেপ&quot;">​</a></h2><p>বামে থাকা সাইডবার থেকে আপনার পছন্দের টপিকটি সিলেক্ট করে শেখা শুরু করুন।</p></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("solution-architecture/index.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  index as default
};
