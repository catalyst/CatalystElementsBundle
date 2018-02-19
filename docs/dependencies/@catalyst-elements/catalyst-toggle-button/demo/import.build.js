'use strict';var $jscomp=$jscomp||{};$jscomp.scope={};$jscomp.getGlobal=function(a){return"undefined"!=typeof window&&window===a?a:"undefined"!=typeof global&&null!=global?global:a};$jscomp.global=$jscomp.getGlobal(this);$jscomp.ASSUME_ES5=!1;$jscomp.ASSUME_NO_NATIVE_MAP=!1;$jscomp.ASSUME_NO_NATIVE_SET=!1;$jscomp.objectCreate=$jscomp.ASSUME_ES5||"function"==typeof Object.create?Object.create:function(a){var c=function(){};c.prototype=a;return new c};
$jscomp.underscoreProtoCanBeSet=function(){var a={a:!0},c={};try{return c.__proto__=a,c.a}catch(f){}return!1};$jscomp.setPrototypeOf="function"==typeof Object.setPrototypeOf?Object.setPrototypeOf:$jscomp.underscoreProtoCanBeSet()?function(a,c){a.__proto__=c;if(a.__proto__!==c)throw new TypeError(a+" is not extensible");return a}:null;
$jscomp.inherits=function(a,c){a.prototype=$jscomp.objectCreate(c.prototype);a.prototype.constructor=a;if($jscomp.setPrototypeOf){var f=$jscomp.setPrototypeOf;f(a,c)}else for(f in c)if("prototype"!=f)if(Object.defineProperties){var e=Object.getOwnPropertyDescriptor(c,f);e&&Object.defineProperty(a,f,e)}else a[f]=c[f];a.superClass_=c.prototype};
$jscomp.defineProperty=$jscomp.ASSUME_ES5||"function"==typeof Object.defineProperties?Object.defineProperty:function(a,c,f){a!=Array.prototype&&a!=Object.prototype&&(a[c]=f.value)};$jscomp.SYMBOL_PREFIX="jscomp_symbol_";$jscomp.initSymbol=function(){$jscomp.initSymbol=function(){};$jscomp.global.Symbol||($jscomp.global.Symbol=$jscomp.Symbol)};$jscomp.Symbol=function(){var a=0;return function(c){return $jscomp.SYMBOL_PREFIX+(c||"")+a++}}();
$jscomp.initSymbolIterator=function(){$jscomp.initSymbol();var a=$jscomp.global.Symbol.iterator;a||(a=$jscomp.global.Symbol.iterator=$jscomp.global.Symbol("iterator"));"function"!=typeof Array.prototype[a]&&$jscomp.defineProperty(Array.prototype,a,{configurable:!0,writable:!0,value:function(){return $jscomp.arrayIterator(this)}});$jscomp.initSymbolIterator=function(){}};$jscomp.arrayIterator=function(a){var c=0;return $jscomp.iteratorPrototype(function(){return c<a.length?{done:!1,value:a[c++]}:{done:!0}})};
$jscomp.iteratorPrototype=function(a){$jscomp.initSymbolIterator();a={next:a};a[$jscomp.global.Symbol.iterator]=function(){return this};return a};$jscomp.makeIterator=function(a){$jscomp.initSymbolIterator();var c=a[Symbol.iterator];return c?c.call(a):$jscomp.arrayIterator(a)};
$jscomp.polyfill=function(a,c,f,e){if(c){f=$jscomp.global;a=a.split(".");for(e=0;e<a.length-1;e++){var b=a[e];b in f||(f[b]={});f=f[b]}a=a[a.length-1];e=f[a];c=c(e);c!=e&&null!=c&&$jscomp.defineProperty(f,a,{configurable:!0,writable:!0,value:c})}};$jscomp.FORCE_POLYFILL_PROMISE=!1;
$jscomp.polyfill("Promise",function(a){function c(){this.batch_=null}function f(d){return d instanceof b?d:new b(function(b,a){b(d)})}if(a&&!$jscomp.FORCE_POLYFILL_PROMISE)return a;c.prototype.asyncExecute=function(d){null==this.batch_&&(this.batch_=[],this.asyncExecuteBatch_());this.batch_.push(d);return this};c.prototype.asyncExecuteBatch_=function(){var d=this;this.asyncExecuteFunction(function(){d.executeBatch_()})};var e=$jscomp.global.setTimeout;c.prototype.asyncExecuteFunction=function(d){e(d,
0)};c.prototype.executeBatch_=function(){for(;this.batch_&&this.batch_.length;){var d=this.batch_;this.batch_=[];for(var b=0;b<d.length;++b){var a=d[b];delete d[b];try{a()}catch(k){this.asyncThrow_(k)}}}this.batch_=null};c.prototype.asyncThrow_=function(d){this.asyncExecuteFunction(function(){throw d;})};var b=function(d){this.state_=0;this.result_=void 0;this.onSettledCallbacks_=[];var b=this.createResolveAndReject_();try{d(b.resolve,b.reject)}catch(m){b.reject(m)}};b.prototype.createResolveAndReject_=
function(){function d(d){return function(c){a||(a=!0,d.call(b,c))}}var b=this,a=!1;return{resolve:d(this.resolveTo_),reject:d(this.reject_)}};b.prototype.resolveTo_=function(d){if(d===this)this.reject_(new TypeError("A Promise cannot resolve to itself"));else if(d instanceof b)this.settleSameAsPromise_(d);else{a:switch(typeof d){case "object":var a=null!=d;break a;case "function":a=!0;break a;default:a=!1}a?this.resolveToNonPromiseObj_(d):this.fulfill_(d)}};b.prototype.resolveToNonPromiseObj_=function(d){var b=
void 0;try{b=d.then}catch(m){this.reject_(m);return}"function"==typeof b?this.settleSameAsThenable_(b,d):this.fulfill_(d)};b.prototype.reject_=function(b){this.settle_(2,b)};b.prototype.fulfill_=function(b){this.settle_(1,b)};b.prototype.settle_=function(b,a){if(0!=this.state_)throw Error("Cannot settle("+b+", "+a|"): Promise already settled in state"+this.state_);this.state_=b;this.result_=a;this.executeOnSettledCallbacks_()};b.prototype.executeOnSettledCallbacks_=function(){if(null!=this.onSettledCallbacks_){for(var b=
this.onSettledCallbacks_,a=0;a<b.length;++a)b[a].call(),b[a]=null;this.onSettledCallbacks_=null}};var g=new c;b.prototype.settleSameAsPromise_=function(b){var a=this.createResolveAndReject_();b.callWhenSettled_(a.resolve,a.reject)};b.prototype.settleSameAsThenable_=function(b,a){var d=this.createResolveAndReject_();try{b.call(a,d.resolve,d.reject)}catch(k){d.reject(k)}};b.prototype.then=function(a,c){function d(b,a){return"function"==typeof b?function(a){try{g(b(a))}catch(n){e(n)}}:a}var g,e,f=new b(function(b,
a){g=b;e=a});this.callWhenSettled_(d(a,g),d(c,e));return f};b.prototype.catch=function(b){return this.then(void 0,b)};b.prototype.callWhenSettled_=function(b,a){function d(){switch(c.state_){case 1:b(c.result_);break;case 2:a(c.result_);break;default:throw Error("Unexpected state: "+c.state_);}}var c=this;null==this.onSettledCallbacks_?g.asyncExecute(d):this.onSettledCallbacks_.push(function(){g.asyncExecute(d)})};b.resolve=f;b.reject=function(a){return new b(function(b,d){d(a)})};b.race=function(a){return new b(function(b,
d){for(var c=$jscomp.makeIterator(a),g=c.next();!g.done;g=c.next())f(g.value).callWhenSettled_(b,d)})};b.all=function(a){var d=$jscomp.makeIterator(a),c=d.next();return c.done?f([]):new b(function(b,a){function g(a){return function(d){e[a]=d;h--;0==h&&b(e)}}var e=[],h=0;do e.push(void 0),h++,f(c.value).callWhenSettled_(g(e.length-1),a),c=d.next();while(!c.done)})};return b},"es6","es3");
(function(a){function c(b){if(e[b])return e[b].exports;var d=e[b]={i:b,l:!1,exports:{}};a[b].call(d.exports,d,d.exports,c);d.l=!0;return d.exports}var f=window.webpackJsonp;window.webpackJsonp=function(c,d,e){for(var g,k,h=0,l=[];h<c.length;h++)k=c[h],b[k]&&l.push(b[k][0]),b[k]=0;for(g in d)Object.prototype.hasOwnProperty.call(d,g)&&(a[g]=d[g]);for(f&&f(c,d,e);l.length;)l.shift()()};var e={},b={1:0};c.e=function(a){function d(){h.onerror=h.onload=null;clearTimeout(p);var d=b[a];if(0!==d){if(d)d[1](Error("Loading chunk "+
a+" failed."));b[a]=void 0}}var g=b[a];if(0===g)return new Promise(function(b){b()});if(g)return g[2];var e=new Promise(function(d,c){g=b[a]=[d,c]});g[2]=e;var f=document.getElementsByTagName("head")[0],h=document.createElement("script");h.type="text/javascript";h.charset="utf-8";h.async=!0;h.timeout=12E4;c.nc&&h.setAttribute("nonce",c.nc);h.src=c.p+"import."+a+".build.js";var p=setTimeout(d,12E4);h.onerror=h.onload=d;f.appendChild(h);return e};c.m=a;c.c=e;c.d=function(b,a,e){c.o(b,a)||Object.defineProperty(b,
a,{configurable:!1,enumerable:!0,get:e})};c.n=function(b){var a=b&&b.__esModule?function(){return b["default"]}:function(){return b};c.d(a,"a",a);return a};c.o=function(b,a){return Object.prototype.hasOwnProperty.call(b,a)};c.p="";c.oe=function(b){console.error(b);throw b;};return c(c.s=0)})([function(a,c,f){Object.defineProperty(c,"__esModule",{value:!0});f(1);void 0===window.WebComponents||window.WebComponents.ready?f.e(0).then(f.bind(null,2)):window.addEventListener("WebComponentsReady",function(){f.e(0).then(f.bind(null,
2))})},function(a,c,f){var e=function(b){b=void 0===b?e.template:b;var a=HTMLElement.call(this)||this;a.attachShadow({mode:"open"});a.shadowRoot.appendChild(b.content.cloneNode(!0));a._inputElement=document.createElement("input");a._inputElement.type="checkbox";a._inputElement.style.display="none";a.appendChild(a._inputElement);return a};$jscomp.inherits(e,HTMLElement);e._register=function(){var b=function(){window.customElements.define(e.is,e);e.__isRegistered=!0};void 0===window.WebComponents||
window.WebComponents.ready?b():window.addEventListener("WebComponentsReady",function(){b()})};e.prototype.connectedCallback=function(){void 0!==window.ShadyCSS&&window.ShadyCSS.styleElement(this);this._upgradeProperty("checked");this._upgradeProperty("pressed");this._upgradeProperty("disabled");this._upgradeProperty("required");this.setAttribute("aria-disabled",this.disabled);this.setAttribute("aria-required",this.required);this.hasAttribute("role")?"button"!==this.getAttribute("role")&&this.setAttribute("aria-checked",
this.checked):(this.setAttribute("role","button"),this.setAttribute("aria-pressed",this.checked));this.hasAttribute("tabindex")||this.setAttribute("tabindex",0);this.addEventListener("keydown",this._onKeyDown);this.addEventListener("click",this._onClick)};e.prototype._upgradeProperty=function(b){if(this.hasOwnProperty(b)){var a=this[b];delete this[b];this[b]=a}};e.prototype.disconnectedCallback=function(){this.removeEventListener("keydown",this._onKeyDown);this.removeEventListener("click",this._onClick)};
e.prototype.attributeChangedCallback=function(b,a,c){a=null!==c;switch(b){case "checked":case "pressed":"button"===this.getAttribute("role")?this.setAttribute("aria-pressed",a):this.setAttribute("aria-checked",a);a?this.inputElement.setAttribute("checked",""):this.inputElement.removeAttribute("checked");break;case "disabled":this.setAttribute("aria-disabled",a);a?(this.inputElement.setAttribute("disabled",""),this.hasAttribute("tabindex")&&(this._tabindexBeforeDisabled=this.getAttribute("tabindex"),
this.removeAttribute("tabindex"),this.blur())):(this.inputElement.removeAttribute("disabled"),this.hasAttribute("tabindex")||void 0===this._tabindexBeforeDisabled||null===this._tabindexBeforeDisabled||this.setAttribute("tabindex",this._tabindexBeforeDisabled));break;case "required":this.setAttribute("aria-required",a);a?this.inputElement.setAttribute("required",""):this.inputElement.removeAttribute("required");break;case "name":this.inputElement.setAttribute("name",new String(c));break;case "value":this.inputElement.setAttribute("value",
new String(c));break;case "form":this._inputElement.setAttribute("form",c)}};e.prototype._onKeyDown=function(a){if(!a.altKey)switch(a.keyCode){case e._KEYCODE.SPACE:case e._KEYCODE.ENTER:a.preventDefault(),this._toggleChecked()}};e.prototype._onClick=function(){this._toggleChecked()};e.prototype._toggleChecked=function(){if(!this.disabled){if("button"===this.getAttribute("role")){this.pressed=!this.pressed;var a="pressed"}else this.checked=!this.checked,a="checked";var c={};this.dispatchEvent(new CustomEvent("change",
{detail:(c[a]=this.checked,c),bubbles:!0}))}};$jscomp.global.Object.defineProperties(e.prototype,{checked:{configurable:!0,enumerable:!0,set:function(a){a?this.setAttribute("checked",""):this.removeAttribute("checked")},get:function(){return this.hasAttribute("checked")}},pressed:{configurable:!0,enumerable:!0,set:function(a){a?this.setAttribute("pressed",""):this.removeAttribute("pressed")},get:function(){return this.hasAttribute("pressed")}},disabled:{configurable:!0,enumerable:!0,set:function(a){a?
this.setAttribute("disabled",""):this.removeAttribute("disabled")},get:function(){return this.hasAttribute("disabled")}},required:{configurable:!0,enumerable:!0,set:function(a){a?this.setAttribute("required",""):this.removeAttribute("required")},get:function(){return this.hasAttribute("required")}},name:{configurable:!0,enumerable:!0,set:function(a){this.setAttribute("name",new String(a))},get:function(){return this.hasAttribute("name")?this.getAttribute("name"):""}},form:{configurable:!0,enumerable:!0,
get:function(){return this._inputElement.form}},value:{configurable:!0,enumerable:!0,set:function(a){this.setAttribute("value",new String(a))},get:function(){return this.hasAttribute("value")?this.getAttribute("value"):"on"}},inputElement:{configurable:!0,enumerable:!0,get:function(){return this._inputElement}}});$jscomp.global.Object.defineProperties(e,{is:{configurable:!0,enumerable:!0,get:function(){return"catalyst-toggle-button"}},_isRegistered:{configurable:!0,enumerable:!0,get:function(){return!!e.__isRegistered}},
template:{configurable:!0,enumerable:!0,get:function(){var a=document.createElement("template");a.innerHTML="<style>:host{display:inline-block;-webkit-box-align:start;-ms-flex-align:start;align-items:flex-start;padding:2px 7px;margin:0;font:400 13.3333px Arial;letter-spacing:normal;word-spacing:normal;color:#000;text-align:center;text-indent:0;text-rendering:auto;text-shadow:none;text-transform:none;cursor:default;background-color:#ddd;border:2px outset #ddd;-o-border-image:none;border-image:none;-o-border-image:initial;border-image:initial;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;-webkit-appearance:button;-moz-appearance:button}:host([pressed]){padding:2px 6px 2px 8px;color:#000;text-shadow:.5px .5px 1px #f0f0f0;background-color:#bbb;border-color:#aaa;border-style:inset}:host([hidden]){display:none}</style><slot></slot>";
void 0!==window.ShadyCSS&&window.ShadyCSS.prepareTemplate(a,e.is);return a}},_KEYCODE:{configurable:!0,enumerable:!0,get:function(){void 0===this.__keycode&&(this.__keycode={SPACE:32,ENTER:13});return this.__keycode}},observedAttributes:{configurable:!0,enumerable:!0,get:function(){return"checked pressed disabled required name value form".split(" ")}}});e._isRegistered||e._register()}]);
