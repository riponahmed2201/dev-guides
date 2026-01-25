import { ssrRenderAttrs, ssrRenderStyle } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"Splitwise App Design (LLD Deep-Dive)","description":"","frontmatter":{},"headers":[],"relativePath":"system-design/lld/problems/splitwise.md","filePath":"system-design/lld/problems/splitwise.md"}');
const _sfc_main = { name: "system-design/lld/problems/splitwise.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="splitwise-app-design-lld-deep-dive" tabindex="-1">Splitwise App Design (LLD Deep-Dive) <a class="header-anchor" href="#splitwise-app-design-lld-deep-dive" aria-label="Permalink to &quot;Splitwise App Design (LLD Deep-Dive)&quot;">​</a></h1><p>Splitwise হলো বন্ধুদের মধ্যে খরচ ভাগাভাগি করার জনপ্রিয় অ্যাপ। এর ডিজাইনে ডেটাবেস এবং ব্যালেন্স সেটেলমেন্ট লজিক গুরুত্বপূর্ণ।</p><hr><h2 id="১-রিকোয়ারমেন্টস-requirements" tabindex="-1">১. রিকোয়ারমেন্টস (Requirements) <a class="header-anchor" href="#১-রিকোয়ারমেন্টস-requirements" aria-label="Permalink to &quot;১. রিকোয়ারমেন্টস (Requirements)&quot;">​</a></h2><ul><li>ইউজাররা গ্রুপ তৈরি করতে পারবে।</li><li>যেকোনো ইউজার খরচ (Expense) যোগ করতে পারবে।</li><li>খরচ সমানভাগে (Equal), নির্দিষ্ট পারসেন্টেজ (%) বা অ্যামাউন্ট অনুযায়ী ভাগ করা যাবে।</li><li>কে কার কাছে কত পায় তার হিসাব দেখা যাবে।</li><li>ট্রানজেশন সংখ্যা কমানোর জন্য <strong>Simplify Debt</strong> ফিচার থাকবে।</li></ul><hr><h2 id="২-মেইন-ক্লাস-এবং-এনটিটি" tabindex="-1">২. মেইন ক্লাস এবং এনটিটি <a class="header-anchor" href="#২-মেইন-ক্লাস-এবং-এনটিটি" aria-label="Permalink to &quot;২. মেইন ক্লাস এবং এনটিটি&quot;">​</a></h2><ul><li><strong>User:</strong> আইডি, নাম, ইমেইল।</li><li><strong>Group:</strong> মেম্বার লিস্ট এবং এক্সপেন্স লিস্ট।</li><li><strong>Expense (Abstract):</strong> EqualExpense, PercentExpense, ExactExpense একে ইনহেরিট করবে।</li><li><strong>Split (Abstract):</strong> প্রতিটি ইউজারের ভাগের হিসাব।</li><li><strong>BalanceSheet:</strong> কে কার কাছে কত পায় তার নেট ব্যালেন্স।</li></ul><hr><h2 id="৩-ডিজাইন-প্যাটার্ন-ব্যবহার" tabindex="-1">৩. ডিজাইন প্যাটার্ন ব্যবহার <a class="header-anchor" href="#৩-ডিজাইন-প্যাটার্ন-ব্যবহার" aria-label="Permalink to &quot;৩. ডিজাইন প্যাটার্ন ব্যবহার&quot;">​</a></h2><ul><li><strong>Strategy Pattern:</strong> খরচ ভাগ করার বিভিন্ন পদ্ধতি (Equal, Percent, Exact) ম্যানেজ করার জন্য।</li><li><strong>Observer Pattern:</strong> যখন গ্রুপে নতুন খরচ যোগ করা হয়, তখন সব মেম্বারকে নোটিফাই করা।</li><li><strong>Factory Pattern:</strong> এক্সপেন্স টাইপ অনুযায়ী সঠিক অবজেক্ট তৈরির জন্য।</li></ul><hr><h2 id="৪-ক্লাস-ডায়াগ্রাম-mermaid" tabindex="-1">৪. ক্লাস ডায়াগ্রাম (Mermaid) <a class="header-anchor" href="#৪-ক্লাস-ডায়াগ্রাম-mermaid" aria-label="Permalink to &quot;৪. ক্লাস ডায়াগ্রাম (Mermaid)&quot;">​</a></h2><div class="language-mermaid vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">mermaid</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">classDiagram</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">    class Expense {</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">        &lt;&lt;abstract&gt;&gt;</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">        +double amount</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">        +User paidBy</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">        +List splits</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">    }</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">    class Split {</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">        +User user</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">        +double amount</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">    }</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">    class Group {</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">        +String name</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">        +List members</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">        +addExpense(Expense e)</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">    }</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">    Expense &lt;|-- EqualExpense</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">    Expense &lt;|-- PercentExpense</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">    Expense &quot;1&quot; *-- &quot;*&quot; Split</span></span></code></pre></div><hr><h2 id="৫-ডিপ-ডাইভ-simplified-debt-algorithm" tabindex="-1">৫. ডিপ ডাইভ (Simplified Debt Algorithm) <a class="header-anchor" href="#৫-ডিপ-ডাইভ-simplified-debt-algorithm" aria-label="Permalink to &quot;৫. ডিপ ডাইভ (Simplified Debt Algorithm)&quot;">​</a></h2><p>সবচেয়ে ইন্টারেস্টিং পার্ট হলো ট্রানজিশন কমানো। <strong>লজিক:</strong> ১. সবার নেট ব্যালেন্স বের করুন (Credit - Debit)। ২. যাদের ব্যালেন্স নেগেটিভ (পাওনাদার) এবং পজিটিভ (ঋণী) তাদের আলাদা করুন। ৩. Greedy পদ্ধতিতে সবচেয়ে বড় ঋণী এবং সবচেয়ে বড় পাওনাদারের মধ্যে সেটেলমেন্ট করুন। এটি মিনিমাম ট্রানজিশন নিশ্চিত করবে।</p></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("system-design/lld/problems/splitwise.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const splitwise = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  splitwise as default
};
