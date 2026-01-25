import { ssrRenderAttrs } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"Networking Complete Guide 🌐","description":"","frontmatter":{},"headers":[],"relativePath":"networking/index.md","filePath":"networking/index.md"}');
const _sfc_main = { name: "networking/index.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="networking-complete-guide-🌐" tabindex="-1">Networking Complete Guide 🌐 <a class="header-anchor" href="#networking-complete-guide-🌐" aria-label="Permalink to &quot;Networking Complete Guide 🌐&quot;">​</a></h1><p>এই সেকশনে আমরা নেটওয়ার্কিংয়ের একদম বেসিক থেকে শুরু করে অ্যাডভান্সড এবং এক্সপার্ট লেভেল পর্যন্ত সব কিছু শিখবো।</p><hr><h2 id="📚-level-1-foundation-beginner" tabindex="-1">📚 Level 1: Foundation (Beginner) <a class="header-anchor" href="#📚-level-1-foundation-beginner" aria-label="Permalink to &quot;📚 Level 1: Foundation (Beginner)&quot;">​</a></h2><p>এই লেভেলে আমরা নেটওয়ার্কিংয়ের মৌলিক বিষয়গুলো যেমন OSI Model, TCP/IP, এবং IP Addressing নিয়ে আলোচনা করবো।</p><ul><li><a href="/dev-guides/networking/basics.html">Networking Basics</a></li><li><a href="/dev-guides/networking/osi-model.html">OSI Model</a></li><li><a href="/dev-guides/networking/ipv4.html">IPv4 Addressing</a></li></ul><hr><h2 id="🚀-পরবর্তী-পদক্ষেপ" tabindex="-1">🚀 পরবর্তী পদক্ষেপ <a class="header-anchor" href="#🚀-পরবর্তী-পদক্ষেপ" aria-label="Permalink to &quot;🚀 পরবর্তী পদক্ষেপ&quot;">​</a></h2><p>বামে থাকা সাইডবার থেকে আপনার পছন্দের টপিকটি সিলেক্ট করে শেখা শুরু করুন।</p></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("networking/index.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  index as default
};
