import { ssrRenderAttrs } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"Decorators","description":"","frontmatter":{},"headers":[],"relativePath":"python/advanced-decorators.md","filePath":"python/advanced-decorators.md"}');
const _sfc_main = { name: "python/advanced-decorators.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="decorators" tabindex="-1">Decorators <a class="header-anchor" href="#decorators" aria-label="Permalink to &quot;Decorators&quot;">​</a></h1></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("python/advanced-decorators.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const advancedDecorators = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  advancedDecorators as default
};
