import { ssrRenderAttrs, ssrRenderStyle } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"Rate Limiter Design (LLD Deep-Dive)","description":"","frontmatter":{},"headers":[],"relativePath":"system-design/lld/problems/rate-limiter.md","filePath":"system-design/lld/problems/rate-limiter.md"}');
const _sfc_main = { name: "system-design/lld/problems/rate-limiter.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="rate-limiter-design-lld-deep-dive" tabindex="-1">Rate Limiter Design (LLD Deep-Dive) <a class="header-anchor" href="#rate-limiter-design-lld-deep-dive" aria-label="Permalink to &quot;Rate Limiter Design (LLD Deep-Dive)&quot;">​</a></h1><p>রেট লিমিটর একটি সিস্টেমকে অতিরিক্ত রিকোয়েস্ট (Spam/DDoS) থেকে রক্ষা করে। এটি নিশ্চিত করে যে একজন ইউজার একটি নির্দিষ্ট সময়ে মাত্র নির্দিষ্ট সংখ্যাক রিকোয়েস্ট পাঠাতে পারবে।</p><hr><h2 id="১-রিকোয়ারমেন্টস-requirements" tabindex="-1">১. রিকোয়ারমেন্টস (Requirements) <a class="header-anchor" href="#১-রিকোয়ারমেন্টস-requirements" aria-label="Permalink to &quot;১. রিকোয়ারমেন্টস (Requirements)&quot;">​</a></h2><ul><li>ইউজার বা আইপি ভিত্তিক লিমিট।</li><li>লো-ল্যাটেন্সি হতে হবে।</li><li>ডিস্ট্রিবিউটেড এনভায়রনমেন্ট সাপোর্ট করবে।</li></ul><hr><h2 id="২-অ্যালগরিদমসমূহ" tabindex="-1">২. অ্যালগরিদমসমূহ <a class="header-anchor" href="#২-অ্যালগরিদমসমূহ" aria-label="Permalink to &quot;২. অ্যালগরিদমসমূহ&quot;">​</a></h2><ul><li><strong>Token Bucket:</strong> একটি বাকেটে টোকেন জমা হয়, রিকোয়েস্ট আসলে একটি টোকেন নেওয়া হয়। বাকেট খালি থাকলে রিকোয়েস্ট রিজেক্ট হয়। (সবচেয়ে জনপ্রিয়)।</li><li><strong>Leaky Bucket:</strong> রিকোয়েস্ট একটি নির্দিষ্ট রেটে প্রসেস হয়।</li><li><strong>Fixed Window Counter:</strong> নির্দিষ্ট টাইমে (উদা: ১ মিনিট) কাউন্টার বাড়ানো হয়।</li></ul><hr><h2 id="৩-মেইন-ক্লাস-এবং-এনটিটি" tabindex="-1">৩. মেইন ক্লাস এবং এনটিটি <a class="header-anchor" href="#৩-মেইন-ক্লাস-এবং-এনটিটি" aria-label="Permalink to &quot;৩. মেইন ক্লাস এবং এনটিটি&quot;">​</a></h2><ul><li><strong>RateLimiter:</strong> মেইন ইন্টারফেস।</li><li><strong>UserBucket:</strong> প্রতিটি ইউজারের জন্য টোকেন ট্র্যাকার।</li><li><strong>Refiller:</strong> একটি নির্দিষ্ট সময় পর পর টোকেন রিফিল করার লজিক।</li></ul><hr><h2 id="৪-ডিজাইন-প্যাটার্ন" tabindex="-1">৪. ডিজাইন প্যাটার্ন <a class="header-anchor" href="#৪-ডিজাইন-প্যাটার্ন" aria-label="Permalink to &quot;৪. ডিজাইন প্যাটার্ন&quot;">​</a></h2><ul><li><strong>Strategy Pattern:</strong> রান-টাইমে অ্যালগরিদম (Token Bucket vs Leaky Bucket) চেঞ্জ করার জন্য।</li><li><strong>Singleton:</strong> রেট লিমিটর কনফিগারেশন ম্যানেজারের জন্য।</li></ul><hr><h2 id="৫-ক্লাস-ডায়াগ্রাম-mermaid" tabindex="-1">৫. ক্লাস ডায়াগ্রাম (Mermaid) <a class="header-anchor" href="#৫-ক্লাস-ডায়াগ্রাম-mermaid" aria-label="Permalink to &quot;৫. ক্লাস ডায়াগ্রাম (Mermaid)&quot;">​</a></h2><div class="language-mermaid vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">mermaid</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">classDiagram</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">    class RateLimiter {</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">        &lt;&lt;interface&gt;&gt;</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">        +boolean allowRequest(userId)</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">    }</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">    class TokenBucketLimiter {</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">        -int capacity</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">        -int currentTokens</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">        +allowRequest(userId)</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">    }</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">    RateLimiter &lt;|.. TokenBucketLimiter</span></span></code></pre></div><hr><h2 id="৬-ডিপ-ডাইভ-distributed-rate-limiting" tabindex="-1">৬. ডিপ ডাইভ (Distributed Rate Limiting) <a class="header-anchor" href="#৬-ডিপ-ডাইভ-distributed-rate-limiting" aria-label="Permalink to &quot;৬. ডিপ ডাইভ (Distributed Rate Limiting)&quot;">​</a></h2><p>যদি আপনার একাধিক সার্ভার থাকে, তবে লোকাল কাউন্টার কাজ করবে না। সেক্ষেত্রে <strong>Redis</strong> ব্যবহার করা হয়। Redis-এর <code>INCR</code> এবং <code>EXPIRE</code> কমান্ড ব্যবহার করে খুব সহজে গ্লোবাল রেট লিমিট হ্যান্ডেল করা যায়।</p></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("system-design/lld/problems/rate-limiter.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const rateLimiter = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  rateLimiter as default
};
