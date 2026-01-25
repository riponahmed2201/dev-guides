import { ssrRenderAttrs, ssrRenderStyle } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"Parking Lot System Design (LLD Deep-Dive)","description":"","frontmatter":{},"headers":[],"relativePath":"system-design/lld/problems/parking-lot.md","filePath":"system-design/lld/problems/parking-lot.md"}');
const _sfc_main = { name: "system-design/lld/problems/parking-lot.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="parking-lot-system-design-lld-deep-dive" tabindex="-1">Parking Lot System Design (LLD Deep-Dive) <a class="header-anchor" href="#parking-lot-system-design-lld-deep-dive" aria-label="Permalink to &quot;Parking Lot System Design (LLD Deep-Dive)&quot;">​</a></h1><p>পার্কিং লট ডিজাইন করা LLD ইন্টারভিউয়ের অন্যতম কমন প্রবলেম। এটি মূলত অবজেক্টের মধ্যকার রিলেশনশিপ বোঝার জন্য সেরা প্রবলেম।</p><hr><h2 id="১-রিকোয়ারমেন্টস-requirements" tabindex="-1">১. রিকোয়ারমেন্টস (Requirements) <a class="header-anchor" href="#১-রিকোয়ারমেন্টস-requirements" aria-label="Permalink to &quot;১. রিকোয়ারমেন্টস (Requirements)&quot;">​</a></h2><ul><li>একাধিক লেভেল (Floors) থাকবে।</li><li>বিভিন্ন ধরনের পার্কিং স্পট থাকবে (Small for Bike, Compact for Car, Large for Truck)।</li><li>এন্ট্রি এবং এক্সিট পয়েন্ট থাকবে।</li><li>পার্কিং টিকিট জেনারেট করা হবে।</li><li>সময়ের ওপর ভিত্তি করে পেমেন্ট ক্যালকুলেশন হবে।</li></ul><hr><h2 id="২-মেইন-ক্লাস-এবং-এনটিটি" tabindex="-1">২. মেইন ক্লাস এবং এনটিটি <a class="header-anchor" href="#২-মেইন-ক্লাস-এবং-এনটিটি" aria-label="Permalink to &quot;২. মেইন ক্লাস এবং এনটিটি&quot;">​</a></h2><ul><li><strong>Vehicle (Abstract):</strong> Car, Bike, Truck এগুলো একে ইনহেরিট করবে।</li><li><strong>ParkingSpot:</strong> স্পটের ধরণ এবং স্ট্যাটাস (Free/Occupied) থাকবে।</li><li><strong>ParkingFloor:</strong> অনেকগুলো পার্কিং স্পট থাকবে।</li><li><strong>Ticket:</strong> এন্ট্রি টাইম, ভেহিকেল ইনফো ইত্যাদি থাকবে।</li><li><strong>ParkingLot:</strong> একাধিক ফ্লোর, পেমেন্ট গেটওয়ে এবং এন্ট্রি/একজিট ম্যানেজমেন্ট।</li></ul><hr><h2 id="৩-ডিজাইন-প্যাটার্ন-ব্যবহার" tabindex="-1">৩. ডিজাইন প্যাটার্ন ব্যবহার <a class="header-anchor" href="#৩-ডিজাইন-প্যাটার্ন-ব্যবহার" aria-label="Permalink to &quot;৩. ডিজাইন প্যাটার্ন ব্যবহার&quot;">​</a></h2><ul><li><strong>Singleton Pattern:</strong> নিশ্চিত করতে হবে যেন পুরো অ্যাপ্লিকেশনে পার্কিং লটের মাত্র একটি অবজেক্ট থাকে।</li><li><strong>Factory Pattern:</strong> ভেহিকেলের টাইপ অনুযায়ী অবজেক্ট তৈরির জন্য।</li><li><strong>Strategy Pattern:</strong> বিভিন্ন ধরনের পেমেন্ট লজিক বা পার্কিং অ্যাাইনমেন্ট লজিকের জন্য।</li></ul><hr><h2 id="৪-ক্লাস-ডায়াগ্রাম-mermaid" tabindex="-1">৪. ক্লাস ডায়াগ্রাম (Mermaid) <a class="header-anchor" href="#৪-ক্লাস-ডায়াগ্রাম-mermaid" aria-label="Permalink to &quot;৪. ক্লাস ডায়াগ্রাম (Mermaid)&quot;">​</a></h2><div class="language-mermaid vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">mermaid</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">classDiagram</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">    class Vehicle {</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">        &lt;&lt;abstract&gt;&gt;</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">        +String licenseNumber</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">        +VehicleType type</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">    }</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">    class ParkingSpot {</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">        +int id</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">        +SpotType type</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">        +boolean isFree</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">        +park(Vehicle v)</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">    }</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">    class ParkingFloor {</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">        +List spots</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">        +findFreeSpot(type)</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">    }</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">    class ParkingLot {</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">        -static instance</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">        +List floors</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">        +issueTicket(Vehicle v)</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">    }</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">    Vehicle &lt;|-- Car</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">    Vehicle &lt;|-- Bike</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">    ParkingFloor &quot;1&quot; *-- &quot;*&quot; ParkingSpot</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">    ParkingLot &quot;1&quot; *-- &quot;*&quot; ParkingFloor</span></span></code></pre></div><hr><h2 id="৫-ডিপ-ডাইভ-advanced-tips" tabindex="-1">৫. ডিপ ডাইভ (Advanced Tips) <a class="header-anchor" href="#৫-ডিপ-ডাইভ-advanced-tips" aria-label="Permalink to &quot;৫. ডিপ ডাইভ (Advanced Tips)&quot;">​</a></h2><ul><li><strong>Concurrency:</strong> যখন অনেকগুলো গাড়ি একসাথে এন্ট্রি করার চেষ্টা করে, তখন রেস কন্ডিশন এড়াতে <strong>Mutex/Locks</strong> ব্যবহার করতে হবে যাতে একই স্পট ডবল বুক না হয়।</li><li><strong>Scalability:</strong> নতুন ধরনের চার্জিং স্পট (EV Charging) সহজে যুক্ত করার জন্য ইন্টারফেস ব্যবহার করুন।</li></ul></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("system-design/lld/problems/parking-lot.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const parkingLot = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  parkingLot as default
};
