import { ssrRenderAttrs } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"SDLC & Agile (এসডিএলসি এবং এজাইল)","description":"","frontmatter":{},"headers":[],"relativePath":"solution-architecture/sdlc.md","filePath":"solution-architecture/sdlc.md"}');
const _sfc_main = { name: "solution-architecture/sdlc.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="sdlc-agile-এসডিএলসি-এবং-এজাইল" tabindex="-1">SDLC &amp; Agile (এসডিএলসি এবং এজাইল) <a class="header-anchor" href="#sdlc-agile-এসডিএলসি-এবং-এজাইল" aria-label="Permalink to &quot;SDLC &amp; Agile (এসডিএলসি এবং এজাইল)&quot;">​</a></h1><p>এই পেজটির কন্টেন্ট প্রিপ্রেশন চলছে। খুব শীঘ্রই এখানে মাষ্টার ডিটেইলস যোগ করা হবে।</p><hr><h2 id="যা-যা-থাকছে" tabindex="-1">যা যা থাকছে: <a class="header-anchor" href="#যা-যা-থাকছে" aria-label="Permalink to &quot;যা যা থাকছে:&quot;">​</a></h2><ul><li>SDLC (Software Development Life Cycle)</li><li>Waterfall vs Agile vs DevOps</li><li>Requirements Gathering</li><li>User Stories এবং Use Cases</li></ul><div class="tip custom-block"><p class="custom-block-title">TIP</p><p>আধুনিক সফটওয়্যার ডেভেলপমেন্টে এজাইল (Agile) মেথোডলজি জানা অত্যন্ত জরুরি।</p></div></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("solution-architecture/sdlc.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const sdlc = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  sdlc as default
};
