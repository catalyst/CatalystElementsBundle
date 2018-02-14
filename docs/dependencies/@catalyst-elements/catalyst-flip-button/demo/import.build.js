'use strict';(function(k){function e(a){if(b[a])return b[a].exports;var c=b[a]={i:a,l:!1,exports:{}};k[a].call(c.exports,c,c.exports,e);c.l=!0;return c.exports}var h=window.webpackJsonp;window.webpackJsonp=function(c,d,f){for(var e,b,g=0,l=[];g<c.length;g++)b=c[g],a[b]&&l.push(a[b][0]),a[b]=0;for(e in d)Object.prototype.hasOwnProperty.call(d,e)&&(k[e]=d[e]);for(h&&h(c,d,f);l.length;)l.shift()()};var b={},a={1:0};e.e=function(c){function d(){g.onerror=g.onload=null;clearTimeout(l);var d=a[c];if(0!==
d){if(d)d[1](Error("Loading chunk "+c+" failed."));a[c]=void 0}}var f=a[c];if(0===f)return new Promise(function(a){a()});if(f)return f[2];var b=new Promise(function(d,b){f=a[c]=[d,b]});f[2]=b;var h=document.getElementsByTagName("head")[0],g=document.createElement("script");g.type="text/javascript";g.charset="utf-8";g.async=!0;g.timeout=12E4;e.nc&&g.setAttribute("nonce",e.nc);g.src=e.p+"import."+c+".build.js";var l=setTimeout(d,12E4);g.onerror=g.onload=d;h.appendChild(g);return b};e.m=k;e.c=b;e.d=
function(a,d,f){e.o(a,d)||Object.defineProperty(a,d,{configurable:!1,enumerable:!0,get:f})};e.n=function(a){var c=a&&a.__esModule?function(){return a["default"]}:function(){return a};e.d(c,"a",c);return c};e.o=function(a,d){return Object.prototype.hasOwnProperty.call(a,d)};e.p="";e.oe=function(a){console.error(a);throw a;};return e(e.s=0)})([function(k,e,h){function b(){h.e(0).then(h.bind(null,2))}Object.defineProperty(e,"__esModule",{value:!0});var a=h(1);void 0===window.WebComponents||window.WebComponents.ready?
(a.a.register(),b()):window.addEventListener("WebComponentsReady",()=>{a.a.register();b()})},function(k,e,h){h.d(e,"a",function(){return b});class b extends HTMLElement{static get is(){return"catalyst-flip-button"}static get template(){let a=document.createElement("template");a.innerHTML='<style>:host{position:relative;display:inline-block;-webkit-box-align:start;-ms-flex-align:start;align-items:flex-start;padding:1px 6px;margin:0;font-family:inherit;font-size:83.33333%;font-style:normal;font-weight:400;line-height:normal;letter-spacing:normal;word-spacing:normal;color:#000;color:ButtonText;text-align:center;text-indent:0;text-rendering:auto;text-shadow:none;text-transform:none;vertical-align:bottom;cursor:default;-webkit-box-sizing:content-box;box-sizing:content-box;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;-webkit-perspective:100px;perspective:100px;contain:layout style}:host #card{position:absolute;top:0;right:0;bottom:0;left:0;-webkit-transition:-webkit-transform .4s ease;transition:-webkit-transform .4s ease;transition:transform .4s ease;transition:transform .4s ease,-webkit-transform .4s ease;-webkit-transform-style:preserve-3d;transform-style:preserve-3d}:host #card #back,:host #card #front{position:absolute;top:0;right:0;bottom:0;left:0;display:-webkit-box;display:-ms-flexbox;display:flex;-webkit-box-align:center;-ms-flex-align:center;align-items:center;-webkit-box-pack:center;-ms-flex-pack:center;justify-content:center;margin:0;background:#ddd;background:ButtonFace;background:var(--catalyst-flip-button-card-face-background,ButtonFace);border:2px outset ButtonFace;border:var(--catalyst-flip-button-card-face-border,2px outset ButtonFace);border-radius:var(--catalyst-flip-button-card-face-border-radius,0);-webkit-backface-visibility:hidden;backface-visibility:hidden;-webkit-appearance:var(--catalyst-flip-button-card-face-appearance,button);-moz-appearance:var(--catalyst-flip-button-card-face-appearance,button)}:host #card #back{-webkit-transform:rotateY(180deg);transform:rotateY(180deg)}:host(:focus){outline:none}:host(:focus) #card #back,:host(:focus) #card #front{outline:var(--catalyst-flip-button-card-face-focused-outline,#000 dotted 1px)}:host([hidden]),:host [hidden]{display:none}</style><div id="card"><div id="front"></div><div id="back"></div></div><div hidden><slot></slot></div>';
void 0!==window.ShadyCSS&&window.ShadyCSS.prepareTemplate(a,b.is);return a}static get _KEYCODE(){void 0===this.__keycode&&(this.__keycode={SPACE:32,ENTER:13,LEFT:37,UP:38,RIGHT:39,DOWN:40});return this.__keycode}static get isIE11(){return!!navigator.userAgent.match(/Trident\/7\./)}static get observedAttributes(){return["disabled"]}static register(){window.customElements.define(b.is,b)}constructor(a=b.template){super();this.attachShadow({mode:"open"});this.shadowRoot.appendChild(a.content.cloneNode(!0));
this._cardElement=this.shadowRoot.querySelector("#card");this._cardFrontFace=this._cardElement.querySelector("#front");this._cardBackFace=this._cardElement.querySelector("#back");this._flipped=!1;this._rotation=0}connectedCallback(){this._setUpSelectElement();this._upgradeProperty("disabled");this._upgradeProperty("noAutoPerspective");this.setAttribute("aria-disabled",this.disabled);this.hasAttribute("aria-live")||this.setAttribute("aria-live","polite");this.hasAttribute("role")||this.setAttribute("role",
"combobox");this.hasAttribute("tabindex")||this.setAttribute("tabindex",0);this.addEventListener("keydown",this._onKeyDown);this.addEventListener("click",this._onClick);this.addEventListener("mouseup",this._onMouseUp);this.setAttribute("oncontextmenu","if (event.button === 2) { event.preventDefault(); }");this._selectObserver=new MutationObserver(this._onLightDomMutation.bind(this));this._selectObserver.observe(this,{childList:!0});setTimeout(()=>{this._setUpDimensions()},0);void 0!==window.ShadyCSS&&
window.ShadyCSS.styleElement(this)}_upgradeProperty(a){if(this.hasOwnProperty(a)){let c=this[a];delete this[a];this[a]=c}else this.hasAttribute(a)&&(this[a]=this.getAttribute(a))}_setUpSelectElement(){var a=this.querySelector("select");if(null!==a&&a!==this._selectElement){null!==this._selectElement&&void 0!==this._selectElement&&this._selectElement.removeEventListener("change",this.notifySelectedOptionChanged.bind(this));void 0!==this._optionsObserver&&(this._optionsObserver.disconnect(),this._optionsObserver=
void 0);this._selectElement=a;this._selectElement.addEventListener("change",this.notifySelectedOptionChanged.bind(this));this._optionsObserver=new MutationObserver(this._onOptionsMutation.bind(this));this._optionsObserver.observe(this._selectElement,{childList:!0});if(this._selectElement.labels&&0<this._selectElement.labels.length){a=[];for(let c=0;c<this._selectElement.labels.length;c++){let d=this._selectElement.labels[c];""===d.id&&(d.id=this._generateGuid());a.push(d.id)}this.setAttribute("aria-labelledby",
a.join(" "))}else this.removeAttribute("aria-labelledby");this._selectElement.disabled=this.disabled;this.notifySelectedOptionChanged()}}_setUpDimensions(){this.style.minWidth="";this.style.minHeight="";let a=getComputedStyle(this);var c=Number.parseInt(a.width,10),d=Number.parseInt(a.height,10);c=0===c;d=0===d;if(c||d){let b=0,e=0;this._cardElement.style.position="relative";let g=this._selectElement.options;if(0<g.length){this._cardFrontFace.style.position="relative";this._cardBackFace.style.position=
"relative";let a=this._cardFrontFace.textContent;this._cardFrontFace.textContent="";let h=this._cardBackFace.textContent;this._cardBackFace.textContent="";for(let a=0;a<g.length;a++){this._cardFrontFace.textContent=g[a].textContent;this._cardBackFace.textContent=g[a].textContent;if(c){var f=this._cardFrontFace.offsetWidth;f>b&&(b=f);f=this._cardBackFace.offsetWidth;f>b&&(b=f)}d&&(f=this._cardFrontFace.offsetHeight,f>e&&(e=f),f=this._cardBackFace.offsetHeight,f>b&&(b=f))}this._cardFrontFace.textContent=
a;this._cardBackFace.textContent=h;this._cardFrontFace.style.position="";this._cardBackFace.style.position=""}this._cardElement.style.position="";c&&(c=b+2,this.style.minWidth=c+"px",this.noAutoPerspective||(this.style.perspective=2*(c+Number.parseInt(a.paddingLeft,10)+Number.parseInt(a.paddingRight,10))+"px"));d&&(this.style.minHeight=e+2+"px")}}disconnectedCallback(){this.removeEventListener("keydown",this._onKeyDown);this.removeEventListener("click",this._onClick);this.removeEventListener("mouseUp",
this._onMouseUp);null!==this._selectObserver&&(this._selectObserver.disconnect(),this._selectObserver=void 0);this._selectElement=void 0;null!==this._optionsObserver&&(this._optionsObserver.disconnect(),this._optionsObserver=void 0)}set disabled(a){void 0!==this._selectElement&&(a?this.setAttribute("disabled",""):this.removeAttribute("disabled"))}get disabled(){return this.hasAttribute("disabled")}set noAutoPerspective(a){a?this.setAttribute("no-auto-perspective",""):this.removeAttribute("no-auto-perspective")}get noAutoPerspective(){return this.hasAttribute("no-auto-perspective")}get selectElement(){return this._selectElement}attributeChangedCallback(a,
c,d){c=null!==d;switch(a){case "disabled":this.setAttribute("aria-disabled",c),c?(this.selectElement.setAttribute("disabled",""),this.hasAttribute("tabindex")&&(this._tabindexBeforeDisabled=this.getAttribute("tabindex"),this.removeAttribute("tabindex"),this.blur())):(this.selectElement.removeAttribute("disabled"),this.hasAttribute("tabindex")||void 0===this._tabindexBeforeDisabled||null===this._tabindexBeforeDisabled||this.setAttribute("tabindex",this._tabindexBeforeDisabled))}}_onKeyDown(a){if(!a.altKey)switch(a.keyCode){case b._KEYCODE.SPACE:case b._KEYCODE.ENTER:a.preventDefault();
this._flip();break;case b._KEYCODE.LEFT:case b._KEYCODE.UP:a.preventDefault();this.previous();break;case b._KEYCODE.RIGHT:case b._KEYCODE.DOWN:a.preventDefault(),this.next()}}_onClick(a){0===a.button&&this._onLeftClick()}_onMouseUp(a){2===a.button&&this._onRightClick()}_onLeftClick(){this.focus();this.next()}_onRightClick(){this.focus();this.previous()}notifySelectedOptionChanged(){if(null!==this._selectElement&&0!==this._selectElement.length){var a=this._selectElement.options[this._selectElement.selectedIndex];
this._flipped?this._cardBackFace.textContent=a.textContent:this._cardFrontFace.textContent=a.textContent;b.isIE11&&(a=this._flipped?"visible":"hidden",this._cardFrontFace.style.backfaceVisibility=a,this._cardBackFace.style.backfaceVisibility=a);this._update()}}_onLightDomMutation(a){let c=!1,d=!1,b;b=!1;for(let b=0;b<a.length;b++)0<a[b].addedNodes.length&&(c=!0),0<a[b].removedNodes.length&&(d=!0);if(c||d)a=this._selectElement,this._setUpSelectElement(),this._selectElement!==a&&(b=!0);b&&this._setUpDimensions()}_onOptionsMutation(a){let c;
c=!1;for(let d=0;d<a.length;d++){for(var b=0;b<a[d].addedNodes.length&&"OPTION"!==a[d].addedNodes[b].tagName;b++);for(b=0;b<a[d].addedNodes.length&&"OPTION"!==a[d].addedNodes[b].tagName;b++);null!==this._selectElement&&0===this._selectElement.length&&(c=!0)}c&&this._setUpDimensions()}next(){this._flip(!0)}previous(){this._flip(!1)}_flip(a=!0){if(null!==this._selectElement&&!this.disabled){let b=this._selectElement.length;this._selectElement.selectedIndex=((this._selectElement.selectedIndex+(a?1:-1))%
b+b)%b;this._rotation+=180*(a?-1:1);this._flipped=!this._flipped;this.dispatchEvent(new CustomEvent("change",{detail:{selectedIndex:this._selectElement.selectedIndex,selectedOption:this._selectElement.options[this._selectElement.selectedIndex]},bubbles:!0}));this.notifySelectedOptionChanged()}}_update(){null!==this._selectElement&&(this.setAttribute("value",this._selectElement.value),this._cardElement.style.transform="rotateY("+this._rotation+"deg)")}_generateGuid(){let a=()=>Math.floor(65536*(1+
Math.random())).toString(16).substring(1);return a()+a()+"-"+a()+"-"+a()+"-"+a()+"-"+a()+a()+a()}}}]);
