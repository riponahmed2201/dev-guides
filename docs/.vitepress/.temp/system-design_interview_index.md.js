import { ssrRenderAttrs } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"System Design Interview Preparation (ইন্টারভিউ প্রস্তুতি)","description":"","frontmatter":{},"headers":[],"relativePath":"system-design/interview/index.md","filePath":"system-design/interview/index.md"}');
const _sfc_main = { name: "system-design/interview/index.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="system-design-interview-preparation-ইন্টারভিউ-প্রস্তুতি" tabindex="-1">System Design Interview Preparation (ইন্টারভিউ প্রস্তুতি) <a class="header-anchor" href="#system-design-interview-preparation-ইন্টারভিউ-প্রস্তুতি" aria-label="Permalink to &quot;System Design Interview Preparation (ইন্টারভিউ প্রস্তুতি)&quot;">​</a></h1><p>সিস্টেম ডিজাইন ইন্টারভিউ মূলত আপনার সমস্যা সমাধানের ক্ষমতা, আর্কিটেকচারাল জ্ঞান এবং ট্রেড-অফ বোঝার ক্ষমতা যাচাই করার জন্য নেওয়া হয়। এখানে আমরা ইন্টারভিউয়ের জন্য প্রয়োজনীয় কোর কনসেপ্ট এবং সম্ভাব্য প্রশ্নসমূহ নিয়ে আলোচনা করব।</p><hr><h2 id="ইন্টারভিউ-গাইড" tabindex="-1">ইন্টারভিউ গাইড <a class="header-anchor" href="#ইন্টারভিউ-গাইড" aria-label="Permalink to &quot;ইন্টারভিউ গাইড&quot;">​</a></h2><h3 id="ধাপ-১-কোর-কনসেপ্টস-core-concepts" tabindex="-1">ধাপ ১: কোর কনসেপ্টস (Core Concepts) <a class="header-anchor" href="#ধাপ-১-কোর-কনসেপ্টস-core-concepts" aria-label="Permalink to &quot;ধাপ ১: কোর কনসেপ্টস (Core Concepts)&quot;">​</a></h3><p>সিস্টেম ডিজাইনের মূল ভিত্তিগুলো এবং সেগুলোর ওপর ইন্টারভিউ প্রশ্নোত্তর।</p><ul><li><a href="./core-concepts.html">Core Concepts: Theory &amp; Q&amp;A</a></li><li><a href="./database-storage.html">Database &amp; Storage: Deep-Dive</a></li></ul><h3 id="ধাপ-২-ডিজাইন-প্রবলেমস-design-problems" tabindex="-1">ধাপ ২: ডিজাইন প্রবলেমস (Design Problems) <a class="header-anchor" href="#ধাপ-২-ডিজাইন-প্রবলেমস-design-problems" aria-label="Permalink to &quot;ধাপ ২: ডিজাইন প্রবলেমস (Design Problems)&quot;">​</a></h3><p>রিয়েল-ওয়ার্ল্ড সিস্টেম ডিজাইনের কেস স্টাডি।</p><ul><li><a href="./../step-12-practice/youtube.html">Designing YouTube/Netflix</a></li><li><a href="./../step-12-practice/whatsapp.html">Designing WhatsApp</a></li></ul><hr><div class="tip custom-block github-alert"><p class="custom-block-title">TIP</p><p>ইন্টারভিউতে কখনই একটিমাত্র &quot;সঠিক&quot; উত্তর থাকে না। আপনার সিদ্ধান্তের পেছনের কারণ এবং ট্রেড-অফগুলো পরিষ্কারভাবে ব্যাখ্যা করাই মূল বিষয়।</p></div></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("system-design/interview/index.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  index as default
};
