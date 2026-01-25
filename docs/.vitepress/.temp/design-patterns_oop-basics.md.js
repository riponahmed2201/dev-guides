import { ssrRenderAttrs } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"OOP Fundamentals (ওওপি ফাউন্ডেশন)","description":"","frontmatter":{},"headers":[],"relativePath":"design-patterns/oop-basics.md","filePath":"design-patterns/oop-basics.md"}');
const _sfc_main = { name: "design-patterns/oop-basics.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="oop-fundamentals-ওওপি-ফাউন্ডেশন" tabindex="-1">OOP Fundamentals (ওওপি ফাউন্ডেশন) <a class="header-anchor" href="#oop-fundamentals-ওওপি-ফাউন্ডেশন" aria-label="Permalink to &quot;OOP Fundamentals (ওওপি ফাউন্ডেশন)&quot;">​</a></h1><p>এই পেজটির কন্টেন্ট প্রিপ্রেশন চলছে। খুব শীঘ্রই এখানে মাষ্টার ডিটেইলস যোগ করা হবে।</p><hr><h2 id="যা-যা-থাকছে" tabindex="-1">যা যা থাকছে: <a class="header-anchor" href="#যা-যা-থাকছে" aria-label="Permalink to &quot;যা যা থাকছে:&quot;">​</a></h2><ul><li>ক্লাসেস এবং অবজেক্টস</li><li>এনক্যাপসুলেশন</li><li>ইনহেরিট্যান্স</li><li>পলিমরফিজম</li><li>অ্যাবস্ট্রাকশন</li></ul><div class="tip custom-block"><p class="custom-block-title">TIP</p><p>ততক্ষণ পর্যন্ত আপনি <a href="/dev-guides/design-patterns/solid.html">SOLID Principles</a> সেকশনটি ঘুরে দেখতে পারেন।</p></div></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("design-patterns/oop-basics.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const oopBasics = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  oopBasics as default
};
