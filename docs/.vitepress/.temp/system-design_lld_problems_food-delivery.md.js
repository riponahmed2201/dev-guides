import { ssrRenderAttrs, ssrRenderStyle } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"Food Delivery App Design (LLD Deep-Dive)","description":"","frontmatter":{},"headers":[],"relativePath":"system-design/lld/problems/food-delivery.md","filePath":"system-design/lld/problems/food-delivery.md"}');
const _sfc_main = { name: "system-design/lld/problems/food-delivery.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="food-delivery-app-design-lld-deep-dive" tabindex="-1">Food Delivery App Design (LLD Deep-Dive) <a class="header-anchor" href="#food-delivery-app-design-lld-deep-dive" aria-label="Permalink to &quot;Food Delivery App Design (LLD Deep-Dive)&quot;">​</a></h1><p>Zomato বা Swiggy-এর মতো ফুড ডেলিভারি অ্যাপের LLD ডিজাইনে সবথেকে বড় চ্যালেঞ্জ হলো রিয়েল-টাইম ট্র্যাকিং এবং ডেলিভারি পার্টনার অ্যাসাইনমেন্ট।</p><hr><h2 id="১-রিকোয়ারমেন্টস-requirements" tabindex="-1">১. রিকোয়ারমেন্টস (Requirements) <a class="header-anchor" href="#১-রিকোয়ারমেন্টস-requirements" aria-label="Permalink to &quot;১. রিকোয়ারমেন্টস (Requirements)&quot;">​</a></h2><ul><li>ইউজার রেস্টুরেন্ট সার্চ করতে পারবে এবং খাবার অর্ডার করতে পারবে।</li><li>রেস্টুরেন্ট অর্ডার একসেপ্ট বা রিজেক্ট করতে পারবে।</li><li>ডেলিভারি পার্টনারকে (Rider) অর্ডার অ্যাসাইন করা হবে।</li><li>অর্ডার স্ট্যাটাস রিয়েল-টাইম ট্র্যাক করা যাবে।</li></ul><hr><h2 id="২-মেইন-ক্লাস-এবং-এনটিটি" tabindex="-1">২. মেইন ক্লাস এবং এনটিটি <a class="header-anchor" href="#২-মেইন-ক্লাস-এবং-এনটিটি" aria-label="Permalink to &quot;২. মেইন ক্লাস এবং এনটিটি&quot;">​</a></h2><ul><li><strong>User / Customer:</strong> প্রোফাইল এবং অ্যাড্রেস।</li><li><strong>Restaurant:</strong> মেনু, ডিশ এবং অর্ডার ম্যানেজমেন্ট।</li><li><strong>DeliveryPartner:</strong> কারেন্ট লোকেশন এবং অ্যাভেইল্যাবিলিটি।</li><li><strong>Order:</strong> আইটেম লিস্ট, টোটাল প্রাউস, স্ট্যাটাস।</li><li><strong>Food:</strong> নাম, ডেসক্রিপশন, প্রাইস।</li><li><strong>DeliveryManager:</strong> এটি মূলত ডেলিভারি পার্টনারদের ট্র্যাক করে এবং অর্ডার অ্যাসাইন করে।</li></ul><hr><h2 id="৩-ডেলিভারি-পার্টনার-অ্যাসাইনমেন্ট-লজিক" tabindex="-1">৩. ডেলিভারি পার্টনার অ্যাসাইনমেন্ট লজিক <a class="header-anchor" href="#৩-ডেলিভারি-পার্টনার-অ্যাসাইনমেন্ট-লজিক" aria-label="Permalink to &quot;৩. ডেলিভারি পার্টনার অ্যাসাইনমেন্ট লজিক&quot;">​</a></h2><p><strong>অ্যালগরিদম:</strong> যখন কোনো অর্ডার তৈরি হয়, সিস্টেম তখন রেস্টুরেন্টের কাছাকাছি থাকা (ধরুন ৫ কিমি) ফ্রি ডেলিভারি পার্টনারদের লিস্ট পায় এবং তাদের নোটিফিকেশন পাঠায়। যে আগে একসেপ্ট করবে তাকে অর্ডার দেওয়া হবে।</p><hr><h2 id="৪-ডিজাইন-প্যাটার্ন-ব্যবহার" tabindex="-1">৪. ডিজাইন প্যাটার্ন ব্যবহার <a class="header-anchor" href="#৪-ডিজাইন-প্যাটার্ন-ব্যবহার" aria-label="Permalink to &quot;৪. ডিজাইন প্যাটার্ন ব্যবহার&quot;">​</a></h2><ul><li><strong>Observer Pattern:</strong> অর্ডারের স্ট্যাটাস চেঞ্জ হলে ইউজারকে নোটিফাই করার জন্য।</li><li><strong>Strategy Pattern:</strong> বিভিন্ন ডেলিভারি চার্জ ক্যালকুলেশন বা সার্ভিস ফি এর জন্য।</li><li><strong>Singleton Pattern:</strong> ডেলিভারি ম্যানেজার বা ইনভেন্টরি ম্যানেজারের জন্য।</li></ul><hr><h2 id="৫-ক্লাস-ডায়াগ্রাম-mermaid" tabindex="-1">৫. ক্লাস ডায়াগ্রাম (Mermaid) <a class="header-anchor" href="#৫-ক্লাস-ডায়াগ্রাম-mermaid" aria-label="Permalink to &quot;৫. ক্লাস ডায়াগ্রাম (Mermaid)&quot;">​</a></h2><div class="language-mermaid vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">mermaid</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">classDiagram</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">    class Restaurant {</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">        +String name</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">        +Menu menu</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">        +acceptOrder(Order o)</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">    }</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">    class Order {</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">        +int id</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">        +List items</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">        +OrderStatus status</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">    }</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">    class DeliveryPartner {</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">        +String name</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">        +Point currentLocation</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">        +boolean isBusy</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">    }</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">    class DeliveryManager {</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">        +assignPartner(Order o)</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">    }</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">    Restaurant &quot;1&quot; -- &quot;*&quot; Order</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">    DeliveryManager --&gt; DeliveryPartner</span></span></code></pre></div><hr><div class="note custom-block github-alert"><p class="custom-block-title">NOTE</p><p>রিয়েল-টাইম লোকেশন ট্র্যাকিংয়ের জন্য <strong>WebSockets</strong> এবং জিও-লোকেশন ইনডেক্সিংয়ের জন্য <strong>Redis Geo-spatial</strong> ডেটা ব্যবহার করা হয়।</p></div></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("system-design/lld/problems/food-delivery.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const foodDelivery = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  foodDelivery as default
};
