import { ssrRenderAttrs, ssrRenderStyle } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"Logging Framework Design (LLD Deep-Dive)","description":"","frontmatter":{},"headers":[],"relativePath":"system-design/lld/problems/logging-framework.md","filePath":"system-design/lld/problems/logging-framework.md"}');
const _sfc_main = { name: "system-design/lld/problems/logging-framework.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="logging-framework-design-lld-deep-dive" tabindex="-1">Logging Framework Design (LLD Deep-Dive) <a class="header-anchor" href="#logging-framework-design-lld-deep-dive" aria-label="Permalink to &quot;Logging Framework Design (LLD Deep-Dive)&quot;">​</a></h1><p>একটি কাস্টম লগিং ফ্রেমওয়ার্ক (যেমন: Log4j বা Python&#39;s logging) ডিজাইন করা যা বিভিন্ন লেভেলে (INFO, DEBUG, ERROR) এবং বিভিন্ন গন্তব্যে (Console, File, DB) লগ পাঠাতে পারে।</p><hr><h2 id="১-রিকোয়ারমেন্টস-requirements" tabindex="-1">১. রিকোয়ারমেন্টস (Requirements) <a class="header-anchor" href="#১-রিকোয়ারমেন্টস-requirements" aria-label="Permalink to &quot;১. রিকোয়ারমেন্টস (Requirements)&quot;">​</a></h2><ul><li>মাল্টিপল লগ লেভেল সাপোর্ট করবে।</li><li>মাল্টিপল ডেস্টিনেশন/অ্যাপেন্ডার (Console, File) সাপোর্ট করবে।</li><li>কনফিগারযোগ্য ফরম্যাট হতে হবে।</li><li>থ্রেড-সেফ হতে হবে।</li></ul><hr><h2 id="২-মেইন-ক্লাস-এবং-এনটিটি" tabindex="-1">২. মেইন ক্লাস এবং এনটিটি <a class="header-anchor" href="#২-মেইন-ক্লাস-এবং-এনটিটি" aria-label="Permalink to &quot;২. মেইন ক্লাস এবং এনটিটি&quot;">​</a></h2><ul><li><strong>Logger:</strong> মেইন ক্লাস যা ইউজার ব্যবহার করবে।</li><li><strong>LogMessage:</strong> টাইমস্ট্যাম্প, লেভেল এবং মেসেজ থাকবে।</li><li><strong>LogAppender (Interface):</strong> ConsoleAppender, FileAppender এটি ইমপ্লিমেন্ট করবে।</li><li><strong>LogFilter:</strong> কোন লেভেলের লগ পাস হবে তা ঠিক করবে।</li></ul><hr><h2 id="৩-ডিজাইন-প্যাটার্ন" tabindex="-1">৩. ডিজাইন প্যাটার্ন <a class="header-anchor" href="#৩-ডিজাইন-প্যাটার্ন" aria-label="Permalink to &quot;৩. ডিজাইন প্যাটার্ন&quot;">​</a></h2><ul><li><strong>Singleton Pattern:</strong> পুরো অ্যাপ্লিকেশনে একটি মাত্র লগ ম্যানেজার থাকবে।</li><li><strong>Chain of Responsibility:</strong> লগ মেসেজটি একের পর এক অ্যাপেন্ডারের কাছে পাঠানো।</li><li><strong>Strategy Pattern:</strong> বিভিন্ন ফরম্যাটিং স্টাইলের জন্য।</li><li><strong>Observer Pattern:</strong> লগ তৈরি হলে অ্যাপেন্ডারদের জানানো।</li></ul><hr><h2 id="৪-ক্লাস-ডায়াগ্রাম-mermaid" tabindex="-1">৪. ক্লাস ডায়াগ্রাম (Mermaid) <a class="header-anchor" href="#৪-ক্লাস-ডায়াগ্রাম-mermaid" aria-label="Permalink to &quot;৪. ক্লাস ডায়াগ্রাম (Mermaid)&quot;">​</a></h2><div class="language-mermaid vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">mermaid</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">classDiagram</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">    class Logger {</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">        -LogLevel level</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">        -List appenders</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">        +log(msg, level)</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">    }</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">    class LogAppender {</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">        &lt;&lt;interface&gt;&gt;</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">        +append(LogMessage m)</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">    }</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">    Logger &quot;1&quot; *-- &quot;*&quot; LogAppender</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">    LogAppender &lt;|.. ConsoleAppender</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">    LogAppender &lt;|.. FileAppender</span></span></code></pre></div><hr><h2 id="৫-ডিপ-ডাইভ-performance" tabindex="-1">৫. ডিপ ডাইভ (Performance) <a class="header-anchor" href="#৫-ডিপ-ডাইভ-performance" aria-label="Permalink to &quot;৫. ডিপ ডাইভ (Performance)&quot;">​</a></h2><p>লগিং যেন মেইন থ্রেডকে ব্লক না করে সেজন্য <strong>Asynchronous Logging</strong> ব্যবহার করা হয়। একটি ইন-মেমরি কিউতে লগগুলো রাখা হয় এবং একটি ব্যাকগ্রাউন্ড থ্রেড সেগুলো ডিস্কে রাইট করে।</p></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("system-design/lld/problems/logging-framework.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const loggingFramework = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  loggingFramework as default
};
