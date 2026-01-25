import { ssrRenderAttrs, ssrRenderStyle } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"Notification System Design (LLD Deep-Dive)","description":"","frontmatter":{},"headers":[],"relativePath":"system-design/lld/problems/notification.md","filePath":"system-design/lld/problems/notification.md"}');
const _sfc_main = { name: "system-design/lld/problems/notification.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="notification-system-design-lld-deep-dive" tabindex="-1">Notification System Design (LLD Deep-Dive) <a class="header-anchor" href="#notification-system-design-lld-deep-dive" aria-label="Permalink to &quot;Notification System Design (LLD Deep-Dive)&quot;">​</a></h1><p>একটি স্কেলেবল নোটিফিকেশন সিস্টেম ডিজাইন করা যা ইমেইল, এসএমএস এবং পুশ নোটিফিকেশন পাঠাতে পারে।</p><hr><h2 id="১-রিকোয়ারমেন্টস-requirements" tabindex="-1">১. রিকোয়ারমেন্টস (Requirements) <a class="header-anchor" href="#১-রিকোয়ারমেন্টস-requirements" aria-label="Permalink to &quot;১. রিকোয়ারমেন্টস (Requirements)&quot;">​</a></h2><ul><li>ভিন্ন ভিন্ন চ্যানেল (SMS, Email, Push) সাপোর্ট করতে হবে।</li><li>প্রিয়োরিটি কিউ (Critical notifications like OTP vs Marketing SMS) থাকতে হবে।</li><li>রেট লিমিটিং (একই ইউজারকে যেন খুব বেশি নোটিফিকেশন না যায়) থাকতে হবে।</li><li>স্ট্যাটাস ট্র্যাকিং (Sent, Delivered, Failed)।</li></ul><hr><h2 id="২-মেইন-ক্লাস-এবং-এনটিটি" tabindex="-1">২. মেইন ক্লাস এবং এনটিটি <a class="header-anchor" href="#২-মেইন-ক্লাস-এবং-এনটিটি" aria-label="Permalink to &quot;২. মেইন ক্লাস এবং এনটিটি&quot;">​</a></h2><ul><li><strong>Notification:</strong> মেসেজ বডি, টাইপ, রিসিভার।</li><li><strong>NotificationChannel (Interface):</strong> EmailChannel, SMSChannel, PushChannel এটা ইমপ্লিমেন্ট করবে।</li><li><strong>NotificationService:</strong> পুরো প্রসেস এবং কিউইং হ্যান্ডেল করবে।</li><li><strong>UserPreferences:</strong> ইউজার কোন মাধ্যমে নোটিফিকেশন পেতে চায়।</li></ul><hr><h2 id="৩-ডিজাইন-প্যাটার্ন-ব্যবহার" tabindex="-1">৩. ডিজাইন প্যাটার্ন ব্যবহার <a class="header-anchor" href="#৩-ডিজাইন-প্যাটার্ন-ব্যবহার" aria-label="Permalink to &quot;৩. ডিজাইন প্যাটার্ন ব্যবহার&quot;">​</a></h2><ul><li><strong>Strategy Pattern:</strong> রান-টাইমে চ্যানেল সিলেক্ট করার জন্য।</li><li><strong>Observer Pattern:</strong> সিস্টেমের কোনো ইভেন্ট (যেমন: Order Placed) ঘটলে সাবস্ক্রাইবারদের নোটিফাই করা।</li><li><strong>Factory Pattern:</strong> নোটিফিকেশন অবজেক্ট তৈরির জন্য।</li><li><strong>Decorator Pattern:</strong> নোটিফিকেশনে অতিরিক্ত ফিচার (যেমন: লোগো যোগ করা বা এনক্রিপশন) যুক্ত করার জন্য।</li></ul><hr><h2 id="৪-আর্কিটেকচার-এবং-কিউইং" tabindex="-1">৪. আর্কিটেকচার এবং কিউইং <a class="header-anchor" href="#৪-আর্কিটেকচার-এবং-কিউইং" aria-label="Permalink to &quot;৪. আর্কিটেকচার এবং কিউইং&quot;">​</a></h2><p>স্কেলেবিলিটির জন্য মেসেজ কিউ (Kafka বা RabbitMQ) ব্যবহার করা হয়। <strong>প্রসেস:</strong> ১. ইউজার রিকোয়েস্ট পাঠায়। ২. সিস্টেম রিকোয়েস্টটি ভ্যালিডেট করে কিউতে রাখে। ৩. ওয়ার্কাররা কিউ থেকে ডেটা নিয়ে থার্ড পার্টি এপিআই (যেমন: Twilio, SendGrid) এর মাধ্যমে পাঠায়।</p><hr><h2 id="৫-ক্লাস-ডায়াগ্রাম-mermaid" tabindex="-1">৫. ক্লাস ডায়াগ্রাম (Mermaid) <a class="header-anchor" href="#৫-ক্লাস-ডায়াগ্রাম-mermaid" aria-label="Permalink to &quot;৫. ক্লাস ডায়াগ্রাম (Mermaid)&quot;">​</a></h2><div class="language-mermaid vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">mermaid</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">classDiagram</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">    class NotificationChannel {</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">        &lt;&lt;interface&gt;&gt;</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">        +send(Notification n)</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">    }</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">    class NotificationService {</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">        +sendNotification(Notification n)</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">    }</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">    NotificationChannel &lt;|.. SMSChannel</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">    NotificationChannel &lt;|.. EmailChannel</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">    NotificationService --&gt; NotificationChannel : uses</span></span></code></pre></div></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("system-design/lld/problems/notification.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const notification = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  notification as default
};
