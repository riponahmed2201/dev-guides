import { ssrRenderAttrs } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"DRY, KISS, YAGNI (কোর প্রিন্সিপালস)","description":"","frontmatter":{},"headers":[],"relativePath":"design-patterns/core-principles.md","filePath":"design-patterns/core-principles.md"}');
const _sfc_main = { name: "design-patterns/core-principles.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="dry-kiss-yagni-কোর-প্রিন্সিপালস" tabindex="-1">DRY, KISS, YAGNI (কোর প্রিন্সিপালস) <a class="header-anchor" href="#dry-kiss-yagni-কোর-প্রিন্সিপালস" aria-label="Permalink to &quot;DRY, KISS, YAGNI (কোর প্রিন্সিপালস)&quot;">​</a></h1><p>এই পেজটির কন্টেন্ট প্রিপ্রেশন চলছে। খুব শীঘ্রই এখানে মাষ্টার ডিটেইলস যোগ করা হবে।</p><hr><h2 id="যা-যা-থাকছে" tabindex="-1">যা যা থাকছে: <a class="header-anchor" href="#যা-যা-থাকছে" aria-label="Permalink to &quot;যা যা থাকছে:&quot;">​</a></h2><ul><li><strong>DRY</strong>: Don&#39;t Repeat Yourself</li><li><strong>KISS</strong>: Keep It Simple, Stupid</li><li><strong>YAGNI</strong>: You Aren&#39;t Gonna Need It</li><li><strong>Least Knowledge</strong>: Law of Demeter</li></ul><div class="tip custom-block"><p class="custom-block-title">TIP</p><p>কোড ডিজাইন করার সময় এই ছোট ছোট নিয়মগুলো মেনে চলা অনেক বড় পার্থক্য তৈরি করে।</p></div></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("design-patterns/core-principles.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const corePrinciples = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  corePrinciples as default
};
