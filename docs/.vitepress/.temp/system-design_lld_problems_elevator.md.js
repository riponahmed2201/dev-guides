import { ssrRenderAttrs, ssrRenderStyle } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"Elevator System Design (LLD Deep-Dive)","description":"","frontmatter":{},"headers":[],"relativePath":"system-design/lld/problems/elevator.md","filePath":"system-design/lld/problems/elevator.md"}');
const _sfc_main = { name: "system-design/lld/problems/elevator.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="elevator-system-design-lld-deep-dive" tabindex="-1">Elevator System Design (LLD Deep-Dive) <a class="header-anchor" href="#elevator-system-design-lld-deep-dive" aria-label="Permalink to &quot;Elevator System Design (LLD Deep-Dive)&quot;">​</a></h1><p>একটি মাল্টি-লিফট এলিভেটর সিস্টেম ডিজাইন করা কনকারেন্সি এবং অ্যালগরিদমিক চিন্তার বড় একটি উদাহরণ।</p><hr><h2 id="১-রিকোয়ারমেন্টস-requirements" tabindex="-1">১. রিকোয়ারমেন্টস (Requirements) <a class="header-anchor" href="#১-রিকোয়ারমেন্টস-requirements" aria-label="Permalink to &quot;১. রিকোয়ারমেন্টস (Requirements)&quot;">​</a></h2><ul><li>একাধিক এলিভেটর/লিফট থাকবে।</li><li>অনেকগুলো ফ্লোর থাকবে।</li><li>প্রতিটি ফ্লোরে উপরে বা নিচে যাওয়ার বাটন থাকবে।</li><li>লিফটের ভিতরে ফ্লোর সিলেক্ট করার প্যানেল থাকবে।</li><li>লিফটটি এমনভাবে কাজ করবে যাতে ওয়েটিং টাইম এবং এনার্জি খরচ কমে।</li></ul><hr><h2 id="২-মেইন-ক্লাস-এবং-এনটিটি" tabindex="-1">২. মেইন ক্লাস এবং এনটিটি <a class="header-anchor" href="#২-মেইন-ক্লাস-এবং-এনটিটি" aria-label="Permalink to &quot;২. মেইন ক্লাস এবং এনটিটি&quot;">​</a></h2><ul><li><strong>ElevatorController:</strong> এটি পুরো সিস্টেমের মাথা। কোন রিকোয়েস্টে কোন লিফট আসবে তা এটি ঠিক করে।</li><li><strong>ElevatorCar:</strong> লিফটের বর্তমান স্টেট (Moving up, down, idle), ডিরেকশন এবং বর্তমান ফ্লোর ট্র্যাক করে।</li><li><strong>InternalButton / ExternalButton:</strong> ইউজার ইনপুট হ্যান্ডেল করে।</li><li><strong>Floor:</strong> ফ্লোর নম্বর এবং এক্সটার্নাল বাটন প্যানেল।</li></ul><hr><h2 id="৩-অলগরিদম-এবং-ডিজাইন-প্যাটার্ন" tabindex="-1">৩. অলগরিদম এবং ডিজাইন প্যাটার্ন <a class="header-anchor" href="#৩-অলগরিদম-এবং-ডিজাইন-প্যাটার্ন" aria-label="Permalink to &quot;৩. অলগরিদম এবং ডিজাইন প্যাটার্ন&quot;">​</a></h2><ul><li><strong>Dispatch Strategy:</strong> কোন লিফটকে পাঠানো হবে তার জন্য <strong>Strategy Pattern</strong> ব্যবহার করা হয় (যেমন: Nearest elevator first)।</li><li><strong>Observer Pattern:</strong> যখন লিফট একটি ফ্লোরে পৌঁছাবে, তখন ওয়েটিং ইউজার বা ডিসপ্লে বোর্ডকে নোটিফাই করা।</li><li><strong>State Pattern:</strong> লিফটের স্টেট (Idle, Moving, Stopped) ম্যানেজ করার জন্য।</li><li><strong>SCAN Algorithm:</strong> হার্ড ড্রাইভের মতো লিফটও সাধারণত SCAN বা LOOK অ্যালগরিদম ব্যবহার করে মুভ করে।</li></ul><hr><h2 id="৪-ক্লাস-ডায়াগ্রাম-mermaid" tabindex="-1">৪. ক্লাস ডায়াগ্রাম (Mermaid) <a class="header-anchor" href="#৪-ক্লাস-ডায়াগ্রাম-mermaid" aria-label="Permalink to &quot;৪. ক্লাস ডায়াগ্রাম (Mermaid)&quot;">​</a></h2><div class="language-mermaid vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">mermaid</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">classDiagram</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">    class ElevatorController {</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">        -List elevatorCars</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">        +dispatch(floor, direction)</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">    }</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">    class ElevatorCar {</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">        +int id</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">        +int currentFloor</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">        +State state</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">        +moveUp()</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">        +moveDown()</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">    }</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">    class ExternalButton {</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">        +press(floor, direction)</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">    }</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">    ElevatorController &quot;1&quot; *-- &quot;*&quot; ElevatorCar</span></span></code></pre></div><hr><h2 id="৫-ডিপ-ডাইভ-advanced-concepts" tabindex="-1">৫. ডিপ ডাইভ (Advanced Concepts) <a class="header-anchor" href="#৫-ডিপ-ডাইভ-advanced-concepts" aria-label="Permalink to &quot;৫. ডিপ ডাইভ (Advanced Concepts)&quot;">​</a></h2><ul><li><strong>Concurrency:</strong> যখন ১০টি ফ্লোর থেকে একসাথে বাটন প্রেস করা হয়, তখন <strong>Request Queue</strong> কে থ্রেড-সেফ রাখতে হবে।</li><li><strong>Optimization:</strong> লিফট যখন নিচে নামছে, সে তখন মাঝখানের কোনো ফ্লোর থেকে নিচে যাওয়ার রিকোয়েস্ট পিক করে নেবে (Optimization)।</li></ul></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("system-design/lld/problems/elevator.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const elevator = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  elevator as default
};
