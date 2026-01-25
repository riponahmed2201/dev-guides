import { ssrRenderAttrs } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"System Design Basics (সিস্টেম ডিজাইন বেসিকস)","description":"","frontmatter":{},"headers":[],"relativePath":"solution-architecture/system-design.md","filePath":"solution-architecture/system-design.md"}');
const _sfc_main = { name: "solution-architecture/system-design.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="system-design-basics-সিস্টেম-ডিজাইন-বেসিকস" tabindex="-1">System Design Basics (সিস্টেম ডিজাইন বেসিকস) <a class="header-anchor" href="#system-design-basics-সিস্টেম-ডিজাইন-বেসিকস" aria-label="Permalink to &quot;System Design Basics (সিস্টেম ডিজাইন বেসিকস)&quot;">​</a></h1><p>এই পেজটির কন্টেন্ট প্রিপ্রেশন চলছে। খুব শীঘ্রই এখানে মাষ্টার ডিটেইলস যোগ করা হবে।</p><hr><h2 id="যা-যা-থাকছে" tabindex="-1">যা যা থাকছে: <a class="header-anchor" href="#যা-যা-থাকছে" aria-label="Permalink to &quot;যা যা থাকছে:&quot;">​</a></h2><ul><li>Client-Server Architecture</li><li>Multi-tier Architecture</li><li>Monolithic vs Microservices</li><li>Request-Response Cycle</li></ul><div class="tip custom-block"><p class="custom-block-title">TIP</p><p>একটি স্কেলেবল সিস্টেম বানানোর জন্য সিস্টেম ডিজাইনের ফাউন্ডেশন বোঝা খুব জরুরি।</p></div></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("solution-architecture/system-design.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const systemDesign = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  systemDesign as default
};
