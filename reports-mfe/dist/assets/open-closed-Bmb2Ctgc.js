import { importShared } from './__federation_fn_import-BFo6b6m_.js';

var i$4=Object.defineProperty;var d$2=(t,e,n)=>e in t?i$4(t,e,{enumerable:true,configurable:true,writable:true,value:n}):t[e]=n;var r$5=(t,e,n)=>(d$2(t,typeof e!="symbol"?e+"":e,n),n);let o$5 = class o{constructor(){r$5(this,"current",this.detect());r$5(this,"handoffState","pending");r$5(this,"currentId",0);}set(e){this.current!==e&&(this.handoffState="pending",this.currentId=0,this.current=e);}reset(){this.set(this.detect());}nextId(){return ++this.currentId}get isServer(){return this.current==="server"}get isClient(){return this.current==="client"}detect(){return typeof window=="undefined"||typeof document=="undefined"?"server":"client"}handoff(){this.handoffState==="pending"&&(this.handoffState="complete");}get isHandoffComplete(){return this.handoffState==="complete"}};let s$3=new o$5;

function l$3(n){var u;return s$3.isServer?null:n==null?document:(u=n==null?void 0:n.ownerDocument)!=null?u:document}function r$4(n){var u,o;return s$3.isServer?null:n==null?document:(o=(u=n==null?void 0:n.getRootNode)==null?void 0:u.call(n))!=null?o:document}function e$1(n){var u,o;return (o=(u=r$4(n))==null?void 0:u.activeElement)!=null?o:null}function d$1(n){return e$1(n)===n}

function t$5(e){typeof queueMicrotask=="function"?queueMicrotask(e):Promise.resolve().then(e).catch(o=>setTimeout(()=>{throw o}));}

function o$4(){let s=[],r={addEventListener(e,t,n,i){return e.addEventListener(t,n,i),r.add(()=>e.removeEventListener(t,n,i))},requestAnimationFrame(...e){let t=requestAnimationFrame(...e);return r.add(()=>cancelAnimationFrame(t))},nextFrame(...e){return r.requestAnimationFrame(()=>r.requestAnimationFrame(...e))},setTimeout(...e){let t=setTimeout(...e);return r.add(()=>clearTimeout(t))},microTask(...e){let t={current:true};return t$5(()=>{t.current&&e[0]();}),r.add(()=>{t.current=false;})},style(e,t,n){let i=e.style.getPropertyValue(t);return Object.assign(e.style,{[t]:n}),this.add(()=>{Object.assign(e.style,{[t]:i});})},group(e){let t=o$4();return e(t),this.add(()=>t.dispose())},add(e){return s.includes(e)||s.push(e),()=>{let t=s.indexOf(e);if(t>=0)for(let n of s.splice(t,1))n();}},dispose(){for(let e of s.splice(0))e();}};return r}

const {useEffect:s$2,useState:o$3} = await importShared('react');
function p(){let[e]=o$3(o$4);return s$2(()=>()=>e.dispose(),[e]),e}

const {useEffect:f,useLayoutEffect:c$3} = await importShared('react');
let n$4=(e,t)=>{s$3.isServer?f(e,t):c$3(e,t);};

const {useRef:t$4} = await importShared('react');
function s$1(e){let r=t$4(e);return n$4(()=>{r.current=e;},[e]),r}

const a$1 = await importShared('react');
let o$2=function(t){let e=s$1(t);return a$1.useCallback((...r)=>e.current(...r),[e])};

const {useMemo:t$3} = await importShared('react');
function n$3(e){return t$3(()=>e,Object.values(e))}

function t$2(...r){return Array.from(new Set(r.flatMap(n=>typeof n=="string"?n.split(" "):[]))).filter(Boolean).join(" ")}

function u$3(r,n,...a){if(r in n){let e=n[r];return typeof e=="function"?e(...a):e}let t=new Error(`Tried to handle "${r}" but there is no handler defined. Only defined handlers are: ${Object.keys(n).map(e=>`"${e}"`).join(", ")}.`);throw Error.captureStackTrace&&Error.captureStackTrace(t,u$3),t}

const E$1 = await importShared('react');
const {Fragment:j$1,cloneElement:v,createElement:S$1,forwardRef:w,isValidElement:k,useCallback:x$1,useRef:M$1} = E$1;
var A$1=(a=>(a[a.None=0]="None",a[a.RenderStrategy=1]="RenderStrategy",a[a.Static=2]="Static",a))(A$1||{}),C$2=(e=>(e[e.Unmount=0]="Unmount",e[e.Hidden=1]="Hidden",e))(C$2||{});function K(){let n=$();return x$1(r=>U({mergeRefs:n,...r}),[n])}function U({ourProps:n,theirProps:r,slot:e,defaultTag:a,features:s,visible:t=true,name:l,mergeRefs:i}){i=i!=null?i:I;let o=P(r,n);if(t)return F(o,e,a,l,i);let y=s!=null?s:0;if(y&2){let{static:f=false,...u}=o;if(f)return F(u,e,a,l,i)}if(y&1){let{unmount:f=true,...u}=o;return u$3(f?0:1,{[0](){return null},[1](){return F({...u,hidden:true,style:{display:"none"}},e,a,l,i)}})}return F(o,e,a,l,i)}function F(n,r={},e,a,s){let{as:t=e,children:l,refName:i="ref",...o}=h(n,["unmount","static"]),y=n.ref!==void 0?{[i]:n.ref}:{},f=typeof l=="function"?l(r):l;"className"in o&&o.className&&typeof o.className=="function"&&(o.className=o.className(r)),o["aria-labelledby"]&&o["aria-labelledby"]===o.id&&(o["aria-labelledby"]=void 0);let u={};if(r){let d=false,p=[];for(let[c,T]of Object.entries(r))typeof T=="boolean"&&(d=true),T===true&&p.push(c.replace(/([A-Z])/g,g=>`-${g.toLowerCase()}`));if(d){u["data-headlessui-state"]=p.join(" ");for(let c of p)u[`data-${c}`]="";}}if(b$2(t)&&(Object.keys(m(o)).length>0||Object.keys(m(u)).length>0))if(!k(f)||Array.isArray(f)&&f.length>1||D$1(f)){if(Object.keys(m(o)).length>0)throw new Error(['Passing props on "Fragment"!',"",`The current component <${a} /> is rendering a "Fragment".`,"However we need to passthrough the following props:",Object.keys(m(o)).concat(Object.keys(m(u))).map(d=>`  - ${d}`).join(`
`),"","You can apply a few solutions:",['Add an `as="..."` prop, to ensure that we render an actual element instead of a "Fragment".',"Render a single element as the child so that we can forward the props onto that element."].map(d=>`  - ${d}`).join(`
`)].join(`
`))}else {let d=f.props,p=d==null?void 0:d.className,c=typeof p=="function"?(...R)=>t$2(p(...R),o.className):t$2(p,o.className),T=c?{className:c}:{},g=P(f.props,m(h(o,["ref"])));for(let R in u)R in g&&delete u[R];return v(f,Object.assign({},g,u,y,{ref:s(H(f),y.ref)},T))}return S$1(t,Object.assign({},h(o,["ref"]),!b$2(t)&&y,!b$2(t)&&u),f)}function $(){let n=M$1([]),r=x$1(e=>{for(let a of n.current)a!=null&&(typeof a=="function"?a(e):a.current=e);},[]);return (...e)=>{if(!e.every(a=>a==null))return n.current=e,r}}function I(...n){return n.every(r=>r==null)?void 0:r=>{for(let e of n)e!=null&&(typeof e=="function"?e(r):e.current=r);}}function P(...n){if(n.length===0)return {};if(n.length===1)return n[0];let r={},e={};for(let s of n)for(let t in s)t.startsWith("on")&&typeof s[t]=="function"?((e[t])!=null||(e[t]=[]),e[t].push(s[t])):r[t]=s[t];if(r.disabled||r["aria-disabled"])for(let s in e)/^(on(?:Click|Pointer|Mouse|Key)(?:Down|Up|Press)?)$/.test(s)&&(e[s]=[t=>{var l;return (l=t==null?void 0:t.preventDefault)==null?void 0:l.call(t)}]);for(let s in e)Object.assign(r,{[s](t,...l){let i=e[s];for(let o of i){if((t instanceof Event||(t==null?void 0:t.nativeEvent)instanceof Event)&&t.defaultPrevented)return;o(t,...l);}}});return r}function V(...n){if(n.length===0)return {};if(n.length===1)return n[0];let r={},e={};for(let s of n)for(let t in s)t.startsWith("on")&&typeof s[t]=="function"?((e[t])!=null||(e[t]=[]),e[t].push(s[t])):r[t]=s[t];for(let s in e)Object.assign(r,{[s](...t){let l=e[s];for(let i of l)i==null||i(...t);}});return r}function Y(n){var r;return Object.assign(w(n),{displayName:(r=n.displayName)!=null?r:n.name})}function m(n){let r=Object.assign({},n);for(let e in r)r[e]===void 0&&delete r[e];return r}function h(n,r=[]){let e=Object.assign({},n);for(let a of r)a in e&&delete e[a];return e}function H(n){return E$1.version.split(".")[0]>="19"?n.props.ref:n.ref}function b$2(n){return n===j$1||n===Symbol.for("react.fragment")}function D$1(n){return b$2(n.type)}

const {useId:r$3} = await importShared('react');

function o$1(e){return typeof e!="object"||e===null?false:"nodeType"in e}function t$1(e){return o$1(e)&&"tagName"in e}function n$2(e){return t$1(e)&&"accessKey"in e}function i$3(e){return t$1(e)&&"tabIndex"in e}function r$2(e){return t$1(e)&&"style"in e}function u$2(e){return n$2(e)&&e.nodeName==="IFRAME"}function l$2(e){return n$2(e)&&e.nodeName==="INPUT"}function a(e){return n$2(e)&&e.nodeName==="FIELDSET"}function E(e){return n$2(e)&&e.nodeName==="LEGEND"}

const {useEffect:l$1,useRef:i$2} = await importShared('react');
let u$1=Symbol();function T$1(t,n=true){return Object.assign(t,{[u$1]:n})}function y(...t){let n=i$2(t);l$1(()=>{n.current=t;},[t]);let c=o$2(e=>{for(let o of n.current)o!=null&&(typeof o=="function"?o(e):o.current=e);});return t.every(e=>e==null||(e==null?void 0:e[u$1]))?void 0:c}

var o=(r=>(r.Space=" ",r.Enter="Enter",r.Escape="Escape",r.Backspace="Backspace",r.Delete="Delete",r.ArrowLeft="ArrowLeft",r.ArrowUp="ArrowUp",r.ArrowRight="ArrowRight",r.ArrowDown="ArrowDown",r.Home="Home",r.End="End",r.PageUp="PageUp",r.PageDown="PageDown",r.Tab="Tab",r))(o||{});

const r$1 = await importShared('react');
const {createContext:n$1,useContext:i$1} = r$1;
let e=n$1(()=>{});function C$1({value:t,children:o}){return r$1.createElement(e.Provider,{value:t},o)}

const {useCallback:t,useState:b$1} = await importShared('react');
function c$2(u=0){let[r,a]=b$1(u),g=t(e=>a(e),[]),s=t(e=>a(l=>l|e),[]),m=t(e=>(r&e)===e,[r]),n=t(e=>a(l=>l&~e),[]),F=t(e=>a(l=>l^e),[]);return {flags:r,setFlag:g,addFlag:s,hasFlag:m,removeFlag:n,toggleFlag:F}}

var define_process_env_default = {};
var T, S;
const {useRef:c$1,useState:b} = await importShared('react');
typeof process != "undefined" && typeof globalThis != "undefined" && typeof Element != "undefined" && ((T = process == null ? void 0 : define_process_env_default) == null ? void 0 : T["NODE_ENV"]) === "test" && typeof ((S = Element == null ? void 0 : Element.prototype) == null ? void 0 : S.getAnimations) == "undefined" && (Element.prototype.getAnimations = function() {
  return console.warn(["Headless UI has polyfilled `Element.prototype.getAnimations` for your tests.", "Please install a proper polyfill e.g. `jsdom-testing-mocks`, to silence these warnings.", "", "Example usage:", "```js", "import { mockAnimationsApi } from 'jsdom-testing-mocks'", "mockAnimationsApi()", "```"].join(`
`)), [];
});
var A = ((i) => (i[i.None = 0] = "None", i[i.Closed = 1] = "Closed", i[i.Enter = 2] = "Enter", i[i.Leave = 4] = "Leave", i))(A || {});
function x(e) {
  let r = {};
  for (let t in e) e[t] === true && (r[`data-${t}`] = "");
  return r;
}
function N(e, r, t, n) {
  let [i, a] = b(t), { hasFlag: s, addFlag: o, removeFlag: l } = c$2(e && i ? 3 : 0), u = c$1(false), f = c$1(false), E = p();
  return n$4(() => {
    var d;
    if (e) {
      if (t && a(true), !r) {
        t && o(3);
        return;
      }
      return (d = n == null ? void 0 : n.start) == null || d.call(n, t), C(r, { inFlight: u, prepare() {
        f.current ? f.current = false : f.current = u.current, u.current = true, !f.current && (t ? (o(3), l(4)) : (o(4), l(2)));
      }, run() {
        f.current ? t ? (l(3), o(4)) : (l(4), o(3)) : t ? l(1) : o(1);
      }, done() {
        var p;
        f.current && D(r) || (u.current = false, l(7), t || a(false), (p = n == null ? void 0 : n.end) == null || p.call(n, t));
      } });
    }
  }, [e, t, r, E]), e ? [i, { closed: s(1), enter: s(2), leave: s(4), transition: s(2) || s(4) }] : [t, { closed: void 0, enter: void 0, leave: void 0, transition: void 0 }];
}
function C(e, { prepare: r, run: t, done: n, inFlight: i }) {
  let a = o$4();
  return j(e, { prepare: r, inFlight: i }), a.nextFrame(() => {
    t(), a.requestAnimationFrame(() => {
      a.add(M(e, n));
    });
  }), a.dispose;
}
function M(e, r) {
  var a, s;
  let t = o$4();
  if (!e) return t.dispose;
  let n = false;
  t.add(() => {
    n = true;
  });
  let i = (s = (a = e.getAnimations) == null ? void 0 : a.call(e).filter((o) => o instanceof CSSTransition)) != null ? s : [];
  return i.length === 0 ? (r(), t.dispose) : (Promise.allSettled(i.map((o) => o.finished)).then(() => {
    n || r();
  }), t.dispose);
}
function j(e, { inFlight: r, prepare: t }) {
  if (r != null && r.current) {
    t();
    return;
  }
  let n = e.style.transition;
  e.style.transition = "none", t(), e.offsetHeight, e.style.transition = n;
}
function D(e) {
  var t, n;
  return ((n = (t = e.getAnimations) == null ? void 0 : t.call(e)) != null ? n : []).some((i) => i instanceof CSSTransition && i.playState !== "finished");
}

const r = await importShared('react');
const {createContext:l,useContext:d} = r;
let n=l(null);n.displayName="OpenClosedContext";var i=(e=>(e[e.Open=1]="Open",e[e.Closed=2]="Closed",e[e.Closing=4]="Closing",e[e.Opening=8]="Opening",e))(i||{});function u(){return d(n)}function c({value:o,children:t}){return r.createElement(n.Provider,{value:o},t)}function s({children:o}){return r.createElement(n.Provider,{value:null},o)}

export { A$1 as A, x as B, C$2 as C, t$2 as D, c as E, s as F, C$1 as G, a as H, E as I, K, N, T$1 as T, V, Y, n$3 as a, o$4 as b, s$1 as c, n$2 as d, r$4 as e, e$1 as f, u$2 as g, r$2 as h, i$3 as i, l$2 as j, o as k, l$3 as l, t$1 as m, n$4 as n, o$2 as o, p, d$1 as q, r$3 as r, s$3 as s, t$5 as t, u$3 as u, u as v, i as w, b$2 as x, y, m as z };
