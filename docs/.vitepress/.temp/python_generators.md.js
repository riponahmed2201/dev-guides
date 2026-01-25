import { ssrRenderAttrs } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"Generators","description":"","frontmatter":{},"headers":[],"relativePath":"python/generators.md","filePath":"python/generators.md"}');
const _sfc_main = { name: "python/generators.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="generators" tabindex="-1">Generators <a class="header-anchor" href="#generators" aria-label="Permalink to &quot;Generators&quot;">​</a></h1></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("python/generators.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const generators = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  generators as default
};
