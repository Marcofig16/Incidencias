if(!self.define){let e,i={};const s=(s,n)=>(s=new URL(s+".js",n).href,i[s]||new Promise((i=>{if("document"in self){const e=document.createElement("script");e.src=s,e.onload=i,document.head.appendChild(e)}else e=s,importScripts(s),i()})).then((()=>{let e=i[s];if(!e)throw new Error(`Module ${s} didn’t register its module`);return e})));self.define=(n,r)=>{const c=e||("document"in self?document.currentScript.src:"")||location.href;if(i[c])return;let o={};const t=e=>s(e,c),d={module:{uri:c},exports:o,require:t};i[c]=Promise.all(n.map((e=>d[e]||t(e)))).then((e=>(r(...e),o)))}}define(["./workbox-5ffe50d4"],(function(e){"use strict";self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"assets/index-CRbD8ys3.js",revision:null},{url:"css/styles.css",revision:"cf3a22c86dfe1e1155dbb66f166972a8"},{url:"index.html",revision:"bbebc6bb50a7f5bde0e29684d923f945"},{url:"registerSW.js",revision:"1872c500de691dce40960bb85481de07"},{url:"icons/icon-192x192.png",revision:"f46a41148c4c47fb449119ca993a9076"},{url:"icons/icon-512x512.png",revision:"b157364bff146dcaac1d3521f4b2482a"},{url:"manifest.webmanifest",revision:"04c06215db910d1cc9e3ace9a2ede2f1"}],{}),e.cleanupOutdatedCaches(),e.registerRoute(new e.NavigationRoute(e.createHandlerBoundToURL("index.html")))}));
