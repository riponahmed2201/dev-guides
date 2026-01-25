import { ssrRenderAttrs } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"","description":"","frontmatter":{"layout":"home","hero":{"name":"Dev Guides Hub","text":"Master Your Future with Deep-Dive Roadmaps","tagline":"Comprehensive, structured, and premium guides for modern technology.","actions":[{"theme":"brand","text":"🐍 Start Python","link":"/python/"},{"theme":"alt","text":"🌐 Networking","link":"/networking/"}]},"features":[{"icon":"🐍","title":"Mastering Python","details":"From basic syntax to advanced concurrency and performance optimization."},{"icon":"🌐","title":"Networking Complete","details":"Deep-dive into OSI layers, TCP/IP, Routing, and Security components."},{"icon":"🏗️","title":"Design Patterns","details":"SOLID principles, GoF patterns, and high-level software architecture."},{"icon":"⚡","title":"FastAPI","details":"Build high-performance APIs with Python 3.6+ based on standard Python type hints."},{"icon":"🏰","title":"Django","details":"Build robust web applications with the most popular Python framework."},{"icon":"🔌","title":"Django REST Framework","details":"Master API development with powerful serialization and authentication."},{"icon":"🐳","title":"Docker & DevOps","details":"Master containerization, orchestration, and modern deployment strategies."}]},"headers":[],"relativePath":"index.md","filePath":"index.md"}');
const _sfc_main = { name: "index.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("index.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  index as default
};
