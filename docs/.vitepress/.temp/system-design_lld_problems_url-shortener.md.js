import { ssrRenderAttrs, ssrRenderStyle } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"URL Shortener Design (LLD Deep-Dive)","description":"","frontmatter":{},"headers":[],"relativePath":"system-design/lld/problems/url-shortener.md","filePath":"system-design/lld/problems/url-shortener.md"}');
const _sfc_main = { name: "system-design/lld/problems/url-shortener.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="url-shortener-design-lld-deep-dive" tabindex="-1">URL Shortener Design (LLD Deep-Dive) <a class="header-anchor" href="#url-shortener-design-lld-deep-dive" aria-label="Permalink to &quot;URL Shortener Design (LLD Deep-Dive)&quot;">​</a></h1><p>TinyURL বা Bitly-এর মতো URL শর্টেনার ডিজাইন করা ডাটাবেস এবং এনকোডিং বোঝার জন্য চমৎকার উদাহরণ।</p><hr><h2 id="১-রিকোয়ারমেন্টস-requirements" tabindex="-1">১. রিকোয়ারমেন্টস (Requirements) <a class="header-anchor" href="#১-রিকোয়ারমেন্টস-requirements" aria-label="Permalink to &quot;১. রিকোয়ারমেন্টস (Requirements)&quot;">​</a></h2><ul><li>লং URL ইনপুট দিলে একটি ইউনিক শর্ট URL জেনারেট করে দিবে।</li><li>শর্ট URL-এ ভিজিট করলে অরিজিনাল URL-এ রিডাইরেক্ট করবে।</li><li>শর্ট URL যেন ছোট হয় (উদা: tiny.com/abc1234)।</li></ul><hr><h2 id="২-অ্যালগরিদম-base62-encoding" tabindex="-1">২. অ্যালগরিদম (Base62 Encoding) <a class="header-anchor" href="#২-অ্যালগরিদম-base62-encoding" aria-label="Permalink to &quot;২. অ্যালগরিদম (Base62 Encoding)&quot;">​</a></h2><p>৬২টি ক্যারেক্টার (a-z, A-Z, 0-9) ব্যবহার করে শর্ট আইডি জেনারেট করা হয়। <strong>প্রসেস:</strong> ১. ডাটাবেসে একটি ইউনিক অটো-ইনক্রিমেন্ট আইডি (ID) লিবে। ২. সেই আইডি-কে Base62-তে কনভার্ট করবে। (ID 12345 -&gt; &#39;sfR&#39;)</p><hr><h2 id="৩-মেইন-ক্লাস-এবং-এনটিটি" tabindex="-1">৩. মেইন ক্লাস এবং এনটিটি <a class="header-anchor" href="#৩-মেইন-ক্লাস-এবং-এনটিটি" aria-label="Permalink to &quot;৩. মেইন ক্লাস এবং এনটিটি&quot;">​</a></h2><ul><li><strong>URLService:</strong> শর্ট করা এবং রিডাইরেক্ট করার মেইন লজিক।</li><li><strong>URLMapping:</strong> লং URL, শর্ট URL এবং এক্সপায়ার ডেট স্টোর করবে।</li><li><strong>Statistics:</strong> হিট কাউন্ট এবং ট্রাফিক ডাটা।</li></ul><hr><h2 id="৪-ডিজাইন-প্যাটার্ন" tabindex="-1">৪. ডিজাইন প্যাটার্ন <a class="header-anchor" href="#৪-ডিজাইন-প্যাটার্ন" aria-label="Permalink to &quot;৪. ডিজাইন প্যাটার্ন&quot;">​</a></h2><ul><li><strong>Singleton:</strong> ইউআরএল জেনারেটরের জন্য।</li><li><strong>Strategy:</strong> ভিন্ন ভিন্ন এনকোডিং অ্যালগরিদম ব্যবহারের জন্য।</li></ul><hr><h2 id="৫-ক্লাস-ডায়াগ্রাম-mermaid" tabindex="-1">৫. ক্লাস ডায়াগ্রাম (Mermaid) <a class="header-anchor" href="#৫-ক্লাস-ডায়াগ্রাম-mermaid" aria-label="Permalink to &quot;৫. ক্লাস ডায়াগ্রাম (Mermaid)&quot;">​</a></h2><div class="language-mermaid vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">mermaid</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">classDiagram</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">    class URLService {</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">        +String shorten(longUrl)</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">        +String redirect(shortUrl)</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">    }</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">    class Base62Codec {</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">        +encode(id)</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">        +decode(shortStr)</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">    }</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">    URLService --&gt; Base62Codec</span></span></code></pre></div><hr><h2 id="৬-ডিপ-ডাইভ-optimization" tabindex="-1">৬. ডিপ ডাইভ (Optimization) <a class="header-anchor" href="#৬-ডিপ-ডাইভ-optimization" aria-label="Permalink to &quot;৬. ডিপ ডাইভ (Optimization)&quot;">​</a></h2><ul><li><strong>Caching:</strong> যেহেতু রিডাইরেকশন রিকোয়েস্ট অনেক বেশি হয়, তাই পপুলার ইউআরএলগুলো <strong>Redis</strong>-এ ক্যাশ করে রাখা হয়।</li><li><strong>Collision:</strong> রেন্ডম স্ট্রিং জেনারেট করলে কোলিশন হতে পারে, তাই ডাটাবেস সিকোয়েন্স ব্যবহার করা আইডি সবচেয়ে সেফ।</li></ul></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("system-design/lld/problems/url-shortener.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const urlShortener = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  urlShortener as default
};
