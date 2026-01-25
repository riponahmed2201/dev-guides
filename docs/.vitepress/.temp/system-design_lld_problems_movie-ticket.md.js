import { ssrRenderAttrs, ssrRenderStyle } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"Movie Ticket Booking System (LLD Deep-Dive)","description":"","frontmatter":{},"headers":[],"relativePath":"system-design/lld/problems/movie-ticket.md","filePath":"system-design/lld/problems/movie-ticket.md"}');
const _sfc_main = { name: "system-design/lld/problems/movie-ticket.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="movie-ticket-booking-system-lld-deep-dive" tabindex="-1">Movie Ticket Booking System (LLD Deep-Dive) <a class="header-anchor" href="#movie-ticket-booking-system-lld-deep-dive" aria-label="Permalink to &quot;Movie Ticket Booking System (LLD Deep-Dive)&quot;">​</a></h1><p>BookMyShow বা মুভি টিকিট বুকিং সিস্টেমের ক্ষেত্রে প্রধান চ্যালেঞ্জ হলো একই সিট যেন দুইজন বুক করতে না পারে (Concurrency)।</p><hr><h2 id="১-রিকোয়ারমেন্টস-requirements" tabindex="-1">১. রিকোয়ারমেন্টস (Requirements) <a class="header-anchor" href="#১-রিকোয়ারমেন্টস-requirements" aria-label="Permalink to &quot;১. রিকোয়ারমেন্টস (Requirements)&quot;">​</a></h2><ul><li>বিভিন্ন শহরে একাধিক থিয়েটার থাকবে।</li><li>থিয়েটারে একাধিক হল/স্ক্রিন থাকবে।</li><li>প্রতিটি স্ক্রিনে আলাদা আলাদা মুভি শো চলবে।</li><li>সিট ক্যাটাগরি (Gold, Silver, Platinum) এবং সিট ম্যাপ থাকবে।</li><li>একটি নির্দিষ্ট সময় পর্যন্ত সিট লক করে রাখা যাবে।</li></ul><hr><h2 id="২-মেইন-ক্লাস-এবং-এনটিটি" tabindex="-1">২. মেইন ক্লাস এবং এনটিটি <a class="header-anchor" href="#২-মেইন-ক্লাস-এবং-এনটিটি" aria-label="Permalink to &quot;২. মেইন ক্লাস এবং এনটিটি&quot;">​</a></h2><ul><li><strong>Movie:</strong> নাম, ল্যাঙ্গুয়েজ, ডিউরেশন।</li><li><strong>Theater:</strong> নাম, লোকেশন, স্ক্রিন লিস্ট।</li><li><strong>Screen:</strong> সিট ম্যাপ।</li><li><strong>Show:</strong> নির্দিষ্ট মুভি, নির্দিষ্ট সময়ে কোনো একটি স্ক্রিনে।</li><li><strong>Booking:</strong> ইউজার, শো, সিট লিস্ট এবং পেমেন্ট স্ট্যাটাস।</li><li><strong>Seat:</strong> সিট নম্বর এবং টাইপ।</li></ul><hr><h2 id="৩-কনকারেন্সি-এবং-লকিং-মেকানিজম" tabindex="-1">৩. কনকারেন্সি এবং লকিং মেকানিজম <a class="header-anchor" href="#৩-কনকারেন্সি-এবং-লকিং-মেকানিজম" aria-label="Permalink to &quot;৩. কনকারেন্সি এবং লকিং মেকানিজম&quot;">​</a></h2><p>টিকিট বুকিংয়ের সময় সবচেয়ে গুরুত্বপূর্ণ বিষয় হলো সিট ইনভেন্টরি ম্যানেজমেন্ট।</p><ul><li><strong>Pessimistic Locking:</strong> যখন ইউজার সিট সিলেক্ট করে পেমেন্ট পেজে যাবে, তখন কিছু সময়ের (ধরা যাক ৫ মিনিট) জন্য ওই সিটগুলো লক করে দেওয়া হয় যাতে অন্য কেউ ওই সময় বুক করতে না পারে।</li><li><strong>Redis Locks:</strong> ডিস্ট্রিবিউটেড লকিংয়ের জন্য Redis ব্যবহার করা যেতে পারে।</li></ul><hr><h2 id="৪-ডিজাইন-প্যাটার্ন" tabindex="-1">৪. ডিজাইন প্যাটার্ন <a class="header-anchor" href="#৪-ডিজাইন-প্যাটার্ন" aria-label="Permalink to &quot;৪. ডিজাইন প্যাটার্ন&quot;">​</a></h2><ul><li><strong>Singleton:</strong> টিকিট বুকিং ইঞ্জিন বা পেমেন্ট গেটওয়ের জন্য।</li><li><strong>Strategy:</strong> বিভিন্ন ডিসকাউন্ট বা অফার অ্যাপ্লাই করার জন্য।</li><li><strong>Observer:</strong> বুকিং কনফার্ম হলে এসএমএস বা ইমেইল পাঠানোর জন্য।</li></ul><hr><h2 id="৫-ক্লাস-ডায়াগ্রাম-mermaid" tabindex="-1">৫. ক্লাস ডায়াগ্রাম (Mermaid) <a class="header-anchor" href="#৫-ক্লাস-ডায়াগ্রাম-mermaid" aria-label="Permalink to &quot;৫. ক্লাস ডায়াগ্রাম (Mermaid)&quot;">​</a></h2><div class="language-mermaid vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">mermaid</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">classDiagram</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">    class Theater {</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">        +String name</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">        +List shows</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">    }</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">    class Show {</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">        +Movie movie</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">        +Screen screen</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">        +DateTime startTime</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">        +Map seatStatus</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">    }</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">    class Booking {</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">        +User user</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">        +Show show</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">        +List seats</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">        +BookingStatus status</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">    }</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">    Theater &quot;1&quot; *-- &quot;*&quot; Show</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">    Show &quot;1&quot; -- &quot;1&quot; Booking</span></span></code></pre></div></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("system-design/lld/problems/movie-ticket.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const movieTicket = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  movieTicket as default
};
