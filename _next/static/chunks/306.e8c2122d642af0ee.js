"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[306],{75306:(e,t,l)=>{l.r(t),l.d(t,{BaseWalletConnectButton:()=>s,BaseWalletDisconnectButton:()=>d,BaseWalletMultiButton:()=>u,WalletConnectButton:()=>m,WalletDisconnectButton:()=>b,WalletIcon:()=>r.l,WalletModal:()=>p.N,WalletModalButton:()=>C,WalletModalContext:()=>n.w,WalletModalProvider:()=>h.I,WalletMultiButton:()=>f,useWalletModal:()=>n.o});var n=l(81390),a=l(62922),c=l(96540),o=l(56653),r=l(40493);function i({walletIcon:e,walletName:t,...l}){return c.createElement(o.$,{...l,className:"wallet-adapter-button-trigger",startIcon:e&&t?c.createElement(r.l,{wallet:{adapter:{icon:e,name:t}}}):void 0})}function s({children:e,disabled:t,labels:l,onClick:n,...o}){let{buttonDisabled:r,buttonState:s,onButtonClick:d,walletIcon:u,walletName:w}=function(){let e;let{connect:t,connected:l,connecting:n,wallet:o}=(0,a.v)();e=n?"connecting":l?"connected":o?"has-wallet":"no-wallet";let r=(0,c.useCallback)(()=>{t().catch(()=>{})},[t]);return{buttonDisabled:"has-wallet"!==e,buttonState:e,onButtonClick:"has-wallet"===e?r:void 0,walletIcon:o?.adapter.icon,walletName:o?.adapter.name}}();return c.createElement(i,{...o,disabled:t||r,onClick:e=>{n&&n(e),!e.defaultPrevented&&d&&d()},walletIcon:u,walletName:w},e||l[s])}function d({children:e,disabled:t,labels:l,onClick:n,...o}){let{buttonDisabled:r,buttonState:s,onButtonClick:d,walletIcon:u,walletName:w}=function(){let e;let{disconnecting:t,disconnect:l,wallet:n}=(0,a.v)();e=t?"disconnecting":n?"has-wallet":"no-wallet";let o=(0,c.useCallback)(()=>{l().catch(()=>{})},[l]);return{buttonDisabled:"has-wallet"!==e,buttonState:e,onButtonClick:"has-wallet"===e?o:void 0,walletIcon:n?.adapter.icon,walletName:n?.adapter.name}}();return c.createElement(i,{...o,disabled:t||r,onClick:e=>{n&&n(e),!e.defaultPrevented&&d&&d()},walletIcon:u,walletName:w},e||l[s])}function u({children:e,labels:t,...l}){let{setVisible:o}=(0,n.o)(),{buttonState:r,onConnect:s,onDisconnect:d,publicKey:u,walletIcon:w,walletName:m}=function({onSelectWallet:e}){let t;let{connect:l,connected:n,connecting:o,disconnect:r,disconnecting:i,publicKey:s,select:d,wallet:u,wallets:w}=(0,a.v)();t=o?"connecting":n?"connected":i?"disconnecting":u?"has-wallet":"no-wallet";let m=(0,c.useCallback)(()=>{l().catch(()=>{})},[l]),p=(0,c.useCallback)(()=>{r().catch(()=>{})},[r]);return{buttonState:t,onConnect:"has-wallet"===t?m:void 0,onDisconnect:"disconnecting"!==t&&"no-wallet"!==t?p:void 0,onSelectWallet:(0,c.useCallback)(()=>{e({onSelectWallet:d,wallets:w})},[e,d,w]),publicKey:s??void 0,walletIcon:u?.adapter.icon,walletName:u?.adapter.name}}({onSelectWallet(){o(!0)}}),[p,C]=(0,c.useState)(!1),[h,v]=(0,c.useState)(!1),b=(0,c.useRef)(null);(0,c.useEffect)(()=>{let e=e=>{let t=b.current;!t||t.contains(e.target)||v(!1)};return document.addEventListener("mousedown",e),document.addEventListener("touchstart",e),()=>{document.removeEventListener("mousedown",e),document.removeEventListener("touchstart",e)}},[]);let E=(0,c.useMemo)(()=>{if(e)return e;if(u){let e=u.toBase58();return e.slice(0,4)+".."+e.slice(-4)}return"connecting"===r||"has-wallet"===r?t[r]:t["no-wallet"]},[r,e,t,u]);return c.createElement("div",{className:"wallet-adapter-dropdown"},c.createElement(i,{...l,"aria-expanded":h,style:{pointerEvents:h?"none":"auto",...l.style},onClick:()=>{switch(r){case"no-wallet":o(!0);break;case"has-wallet":s&&s();break;case"connected":v(!0)}},walletIcon:w,walletName:m},E),c.createElement("ul",{"aria-label":"dropdown-list",className:`wallet-adapter-dropdown-list ${h&&"wallet-adapter-dropdown-list-active"}`,ref:b,role:"menu"},u?c.createElement("li",{className:"wallet-adapter-dropdown-list-item",onClick:async()=>{await navigator.clipboard.writeText(u.toBase58()),C(!0),setTimeout(()=>C(!1),400)},role:"menuitem"},p?t.copied:t["copy-address"]):null,c.createElement("li",{className:"wallet-adapter-dropdown-list-item",onClick:()=>{o(!0),v(!1)},role:"menuitem"},t["change-wallet"]),d?c.createElement("li",{className:"wallet-adapter-dropdown-list-item",onClick:()=>{d(),v(!1)},role:"menuitem"},t.disconnect):null))}let w={connecting:"Connecting ...",connected:"Connected","has-wallet":"Connect","no-wallet":"Connect Wallet"};function m(e){return c.createElement(s,{...e,labels:w})}var p=l(82570);let C=({children:e="Select Wallet",onClick:t,...l})=>{let{visible:a,setVisible:r}=(0,n.o)(),i=(0,c.useCallback)(e=>{t&&t(e),e.defaultPrevented||r(!a)},[t,r,a]);return c.createElement(o.$,{...l,className:"wallet-adapter-button-trigger",onClick:i},e)};var h=l(53018);let v={disconnecting:"Disconnecting ...","has-wallet":"Disconnect","no-wallet":"Disconnect Wallet"};function b(e){return c.createElement(d,{...e,labels:v})}let E={"change-wallet":"Change wallet",connecting:"Connecting ...","copy-address":"Copy address",copied:"Copied",disconnect:"Disconnect","has-wallet":"Connect","no-wallet":"Select Wallet"};function f(e){return c.createElement(u,{...e,labels:E})}}}]);