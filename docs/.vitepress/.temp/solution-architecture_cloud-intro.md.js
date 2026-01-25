import { ssrRenderAttrs } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"Cloud Computing Intro (ক্লাউড কম্পিউটিং পরিচিতি)","description":"","frontmatter":{},"headers":[],"relativePath":"solution-architecture/cloud-intro.md","filePath":"solution-architecture/cloud-intro.md"}');
const _sfc_main = { name: "solution-architecture/cloud-intro.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="cloud-computing-intro-ক্লাউড-কম্পিউটিং-পরিচিতি" tabindex="-1">Cloud Computing Intro (ক্লাউড কম্পিউটিং পরিচিতি) <a class="header-anchor" href="#cloud-computing-intro-ক্লাউড-কম্পিউটিং-পরিচিতি" aria-label="Permalink to &quot;Cloud Computing Intro (ক্লাউড কম্পিউটিং পরিচিতি)&quot;">​</a></h1><p>এই পেজটির কন্টেন্ট প্রিপ্রেশন চলছে। খুব শীঘ্রই এখানে মাষ্টার ডিটেইলস যোগ করা হবে।</p><hr><h2 id="যা-যা-থাকছে" tabindex="-1">যা যা থাকছে: <a class="header-anchor" href="#যা-যা-থাকছে" aria-label="Permalink to &quot;যা যা থাকছে:&quot;">​</a></h2><ul><li>ক্লাউড কম্পিউটিং কী?</li><li>IaaS, PaaS, SaaS মডেল</li><li>Public, Private, Hybrid ক্লাউড</li><li>AWS, Azure, GCP সম্পর্কে ধারণা</li></ul><div class="tip custom-block"><p class="custom-block-title">TIP</p><p>ক্লাউড টেকনোলজি বর্তমান এবং ভবিষ্যতের সফটওয়্যার সিস্টেমের মেরুদণ্ড।</p></div></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("solution-architecture/cloud-intro.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const cloudIntro = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  cloudIntro as default
};
