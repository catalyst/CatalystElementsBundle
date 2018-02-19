'use strict';var $jscomp=$jscomp||{};$jscomp.scope={};$jscomp.getGlobal=function(c){return"undefined"!=typeof window&&window===c?c:"undefined"!=typeof global&&null!=global?global:c};$jscomp.global=$jscomp.getGlobal(this);$jscomp.ASSUME_ES5=!1;$jscomp.ASSUME_NO_NATIVE_MAP=!1;$jscomp.ASSUME_NO_NATIVE_SET=!1;$jscomp.objectCreate=$jscomp.ASSUME_ES5||"function"==typeof Object.create?Object.create:function(c){var d=function(){};d.prototype=c;return new d};
$jscomp.underscoreProtoCanBeSet=function(){var c={a:!0},d={};try{return d.__proto__=c,d.a}catch(f){}return!1};$jscomp.setPrototypeOf="function"==typeof Object.setPrototypeOf?Object.setPrototypeOf:$jscomp.underscoreProtoCanBeSet()?function(c,d){c.__proto__=d;if(c.__proto__!==d)throw new TypeError(c+" is not extensible");return c}:null;
$jscomp.inherits=function(c,d){c.prototype=$jscomp.objectCreate(d.prototype);c.prototype.constructor=c;if($jscomp.setPrototypeOf){var f=$jscomp.setPrototypeOf;f(c,d)}else for(f in d)if("prototype"!=f)if(Object.defineProperties){var e=Object.getOwnPropertyDescriptor(d,f);e&&Object.defineProperty(c,f,e)}else c[f]=d[f];c.superClass_=d.prototype};
$jscomp.defineProperty=$jscomp.ASSUME_ES5||"function"==typeof Object.defineProperties?Object.defineProperty:function(c,d,f){c!=Array.prototype&&c!=Object.prototype&&(c[d]=f.value)};$jscomp.SYMBOL_PREFIX="jscomp_symbol_";$jscomp.initSymbol=function(){$jscomp.initSymbol=function(){};$jscomp.global.Symbol||($jscomp.global.Symbol=$jscomp.Symbol)};$jscomp.Symbol=function(){var c=0;return function(d){return $jscomp.SYMBOL_PREFIX+(d||"")+c++}}();
$jscomp.initSymbolIterator=function(){$jscomp.initSymbol();var c=$jscomp.global.Symbol.iterator;c||(c=$jscomp.global.Symbol.iterator=$jscomp.global.Symbol("iterator"));"function"!=typeof Array.prototype[c]&&$jscomp.defineProperty(Array.prototype,c,{configurable:!0,writable:!0,value:function(){return $jscomp.arrayIterator(this)}});$jscomp.initSymbolIterator=function(){}};$jscomp.arrayIterator=function(c){var d=0;return $jscomp.iteratorPrototype(function(){return d<c.length?{done:!1,value:c[d++]}:{done:!0}})};
$jscomp.iteratorPrototype=function(c){$jscomp.initSymbolIterator();c={next:c};c[$jscomp.global.Symbol.iterator]=function(){return this};return c};$jscomp.makeIterator=function(c){$jscomp.initSymbolIterator();var d=c[Symbol.iterator];return d?d.call(c):$jscomp.arrayIterator(c)};
$jscomp.polyfill=function(c,d,f,e){if(d){f=$jscomp.global;c=c.split(".");for(e=0;e<c.length-1;e++){var a=c[e];a in f||(f[a]={});f=f[a]}c=c[c.length-1];e=f[c];d=d(e);d!=e&&null!=d&&$jscomp.defineProperty(f,c,{configurable:!0,writable:!0,value:d})}};$jscomp.FORCE_POLYFILL_PROMISE=!1;
$jscomp.polyfill("Promise",function(c){function d(){this.batch_=null}function f(g){return g instanceof a?g:new a(function(a,b){a(g)})}if(c&&!$jscomp.FORCE_POLYFILL_PROMISE)return c;d.prototype.asyncExecute=function(a){null==this.batch_&&(this.batch_=[],this.asyncExecuteBatch_());this.batch_.push(a);return this};d.prototype.asyncExecuteBatch_=function(){var a=this;this.asyncExecuteFunction(function(){a.executeBatch_()})};var e=$jscomp.global.setTimeout;d.prototype.asyncExecuteFunction=function(a){e(a,
0)};d.prototype.executeBatch_=function(){for(;this.batch_&&this.batch_.length;){var a=this.batch_;this.batch_=[];for(var b=0;b<a.length;++b){var c=a[b];delete a[b];try{c()}catch(k){this.asyncThrow_(k)}}}this.batch_=null};d.prototype.asyncThrow_=function(a){this.asyncExecuteFunction(function(){throw a;})};var a=function(a){this.state_=0;this.result_=void 0;this.onSettledCallbacks_=[];var b=this.createResolveAndReject_();try{a(b.resolve,b.reject)}catch(m){b.reject(m)}};a.prototype.createResolveAndReject_=
function(){function a(a){return function(g){c||(c=!0,a.call(b,g))}}var b=this,c=!1;return{resolve:a(this.resolveTo_),reject:a(this.reject_)}};a.prototype.resolveTo_=function(b){if(b===this)this.reject_(new TypeError("A Promise cannot resolve to itself"));else if(b instanceof a)this.settleSameAsPromise_(b);else{a:switch(typeof b){case "object":var c=null!=b;break a;case "function":c=!0;break a;default:c=!1}c?this.resolveToNonPromiseObj_(b):this.fulfill_(b)}};a.prototype.resolveToNonPromiseObj_=function(a){var b=
void 0;try{b=a.then}catch(m){this.reject_(m);return}"function"==typeof b?this.settleSameAsThenable_(b,a):this.fulfill_(a)};a.prototype.reject_=function(a){this.settle_(2,a)};a.prototype.fulfill_=function(a){this.settle_(1,a)};a.prototype.settle_=function(a,b){if(0!=this.state_)throw Error("Cannot settle("+a+", "+b|"): Promise already settled in state"+this.state_);this.state_=a;this.result_=b;this.executeOnSettledCallbacks_()};a.prototype.executeOnSettledCallbacks_=function(){if(null!=this.onSettledCallbacks_){for(var a=
this.onSettledCallbacks_,b=0;b<a.length;++b)a[b].call(),a[b]=null;this.onSettledCallbacks_=null}};var b=new d;a.prototype.settleSameAsPromise_=function(a){var b=this.createResolveAndReject_();a.callWhenSettled_(b.resolve,b.reject)};a.prototype.settleSameAsThenable_=function(a,b){var c=this.createResolveAndReject_();try{a.call(b,c.resolve,c.reject)}catch(k){c.reject(k)}};a.prototype.then=function(b,c){function d(a,b){return"function"==typeof a?function(b){try{e(a(b))}catch(n){g(n)}}:b}var e,g,f=new a(function(a,
b){e=a;g=b});this.callWhenSettled_(d(b,e),d(c,g));return f};a.prototype.catch=function(a){return this.then(void 0,a)};a.prototype.callWhenSettled_=function(a,c){function d(){switch(e.state_){case 1:a(e.result_);break;case 2:c(e.result_);break;default:throw Error("Unexpected state: "+e.state_);}}var e=this;null==this.onSettledCallbacks_?b.asyncExecute(d):this.onSettledCallbacks_.push(function(){b.asyncExecute(d)})};a.resolve=f;a.reject=function(b){return new a(function(a,c){c(b)})};a.race=function(b){return new a(function(a,
c){for(var d=$jscomp.makeIterator(b),e=d.next();!e.done;e=d.next())f(e.value).callWhenSettled_(a,c)})};a.all=function(b){var c=$jscomp.makeIterator(b),d=c.next();return d.done?f([]):new a(function(a,b){function e(b){return function(c){g[b]=c;h--;0==h&&a(g)}}var g=[],h=0;do g.push(void 0),h++,f(d.value).callWhenSettled_(e(g.length-1),b),d=c.next();while(!d.done)})};return a},"es6","es3");$jscomp.polyfill("Number.parseFloat",function(c){return c||parseFloat},"es6","es3");
(function(c){function d(a){if(e[a])return e[a].exports;var b=e[a]={i:a,l:!1,exports:{}};c[a].call(b.exports,b,b.exports,d);b.l=!0;return b.exports}var f=window.webpackJsonp;window.webpackJsonp=function(b,d,e){for(var g,k,h=0,l=[];h<b.length;h++)k=b[h],a[k]&&l.push(a[k][0]),a[k]=0;for(g in d)Object.prototype.hasOwnProperty.call(d,g)&&(c[g]=d[g]);for(f&&f(b,d,e);l.length;)l.shift()()};var e={},a={1:0};d.e=function(b){function c(){h.onerror=h.onload=null;clearTimeout(p);var c=a[b];if(0!==c){if(c)c[1](Error("Loading chunk "+
b+" failed."));a[b]=void 0}}var e=a[b];if(0===e)return new Promise(function(a){a()});if(e)return e[2];var f=new Promise(function(c,d){e=a[b]=[c,d]});e[2]=f;var k=document.getElementsByTagName("head")[0],h=document.createElement("script");h.type="text/javascript";h.charset="utf-8";h.async=!0;h.timeout=12E4;d.nc&&h.setAttribute("nonce",d.nc);h.src=d.p+"import."+b+".build.js";var p=setTimeout(c,12E4);h.onerror=h.onload=c;k.appendChild(h);return f};d.m=c;d.c=e;d.d=function(a,c,e){d.o(a,c)||Object.defineProperty(a,
c,{configurable:!1,enumerable:!0,get:e})};d.n=function(a){var b=a&&a.__esModule?function(){return a["default"]}:function(){return a};d.d(b,"a",b);return b};d.o=function(a,c){return Object.prototype.hasOwnProperty.call(a,c)};d.p="";d.oe=function(a){console.error(a);throw a;};return d(d.s=0)})([function(c,d,f){Object.defineProperty(d,"__esModule",{value:!0});f(1);void 0===window.WebComponents||window.WebComponents.ready?f.e(0).then(f.bind(null,3)):window.addEventListener("WebComponentsReady",function(){f.e(0).then(f.bind(null,
3))})},function(c,d,f){var e=f(2).a,a=function(b){b=void 0===b?a.template:b;b=e.call(this,b)||this;b._bar=b.shadowRoot.querySelector("#bar");b._knob=b._bar.querySelector("#knob");return b};$jscomp.inherits(a,e);a._register=function(){var b=function(){window.customElements.define(a.is,a);a.__isRegistered=!0};void 0===window.WebComponents||window.WebComponents.ready?b():window.addEventListener("WebComponentsReady",function(){b()})};a.prototype.connectedCallback=function(){this.styleUpdated();this.hasAttribute("role")||
this.setAttribute("role","checkbox");e.prototype.connectedCallback.call(this)};a.prototype.styleUpdated=function(){var a=getComputedStyle(this._bar);this.style.setProperty("--catalyst-toggle-switch-bar-border-top-wdith",a.borderTopWidth);this.style.setProperty("--catalyst-toggle-switch-bar-border-left-wdith",a.borderLeftWidth);0>Number.parseFloat(getComputedStyle(this).getPropertyValue("--catalyst-toggle-switch-knob-offset"))&&this._bar.classList.add("negitive-knob-offset")};$jscomp.global.Object.defineProperties(a,
{is:{configurable:!0,enumerable:!0,get:function(){return"catalyst-toggle-switch"}},_isRegistered:{configurable:!0,enumerable:!0,get:function(){return!!a.__isRegistered}},template:{configurable:!0,enumerable:!0,get:function(){var b=document.createElement("template");b.innerHTML='<style>:host{position:relative;display:inline-block;width:54px;width:calc(var(--catalyst-toggle-switch-bar-width, 44px) + 2 * var(--catalyst-toggle-switch-knob-offset, 5px));height:26px;height:calc(var(--catalyst-toggle-switch-bar-height, 16px) + 2 * var(--catalyst-toggle-switch-knob-offset, 5px));min-width:var(--catalyst-toggle-switch-bar-width,44px);min-height:var(--catalyst-toggle-switch-bar-height,16px);margin:0 8px;vertical-align:middle}#bar{position:absolute;top:5px;top:var(--catalyst-toggle-switch-knob-offset,5px);left:5px;left:var(--catalyst-toggle-switch-knob-offset,5px);width:44px;width:var(--catalyst-toggle-switch-bar-width,44px);height:16px;height:var(--catalyst-toggle-switch-bar-height,16px);cursor:pointer;background-color:#ced4da;background-color:var(--catalyst-toggle-switch-bar-color,#ced4da);border:none;border:var(--catalyst-toggle-switch-bar-border,none);border-radius:8px;border-radius:calc(var(--catalyst-toggle-switch-bar-height, 16px) / 2);-webkit-box-sizing:border-box;box-sizing:border-box;-webkit-transition:background-color .3s ease,border .3s ease;transition:background-color .3s ease,border .3s ease;will-change:background-color,border}#bar.negitive-knob-offset{top:0;left:0}#knob{position:absolute;top:-5px;top:calc(0px - var(--catalyst-toggle-switch-knob-offset, 5px) - var(--catalyst-toggle-switch-bar-border-top-wdith, 0px));left:-5px;left:calc(0px - var(--catalyst-toggle-switch-knob-offset, 5px) - var(--catalyst-toggle-switch-bar-border-left-wdith, 0px));width:26px;width:var(--catalyst-toggle-switch-knob-size,26px);height:26px;height:var(--catalyst-toggle-switch-knob-size,26px);background-color:#fff;background-color:var(--catalyst-toggle-switch-knob-color,#fff);border:1px solid rgba(0,0,0,.04);border:var(--catalyst-toggle-switch-knob-border,solid 1px rgba(0,0,0,.04));border-radius:13px;border-radius:calc(var(--catalyst-toggle-switch-knob-size, 26px) / 2);-webkit-box-shadow:0 2px 2px 0 rgba(0,0,0,.14),0 1px 5px 0 rgba(0,0,0,.12),0 3px 1px -2px rgba(0,0,0,.2);box-shadow:0 2px 2px 0 rgba(0,0,0,.14),0 1px 5px 0 rgba(0,0,0,.12),0 3px 1px -2px rgba(0,0,0,.2);-webkit-box-shadow:var(--catalyst-toggle-switch-knob-box-shadow,0 2px 2px 0 rgba(0,0,0,.14),0 1px 5px 0 rgba(0,0,0,.12),0 3px 1px -2px rgba(0,0,0,.2));box-shadow:var(--catalyst-toggle-switch-knob-box-shadow,0 2px 2px 0 rgba(0,0,0,.14),0 1px 5px 0 rgba(0,0,0,.12),0 3px 1px -2px rgba(0,0,0,.2));-webkit-box-sizing:border-box;box-sizing:border-box;-webkit-transition:width .28s ease,height .28s ease,background-color .28s ease,border .28s ease,-webkit-transform .28s ease,-webkit-box-shadow .28s cubic-bezier(.4,0,.2,1);transition:width .28s ease,height .28s ease,background-color .28s ease,border .28s ease,-webkit-transform .28s ease,-webkit-box-shadow .28s cubic-bezier(.4,0,.2,1);transition:width .28s ease,height .28s ease,background-color .28s ease,border .28s ease,transform .28s ease,box-shadow .28s cubic-bezier(.4,0,.2,1);transition:width .28s ease,height .28s ease,background-color .28s ease,border .28s ease,transform .28s ease,box-shadow .28s cubic-bezier(.4,0,.2,1),-webkit-transform .28s ease,-webkit-box-shadow .28s cubic-bezier(.4,0,.2,1);will-change:width,height,background-color,border,transform,box-shadow}#knob:hover{-webkit-box-shadow:0 3px 4px 0 rgba(0,0,0,.14),0 1px 8px 0 rgba(0,0,0,.12),0 3px 3px -2px rgba(0,0,0,.4);box-shadow:0 3px 4px 0 rgba(0,0,0,.14),0 1px 8px 0 rgba(0,0,0,.12),0 3px 3px -2px rgba(0,0,0,.4);-webkit-box-shadow:var(--catalyst-toggle-switch-knob-box-shadow,0 3px 4px 0 rgba(0,0,0,.14),0 1px 8px 0 rgba(0,0,0,.12),0 3px 3px -2px rgba(0,0,0,.4));box-shadow:var(--catalyst-toggle-switch-knob-box-shadow,0 3px 4px 0 rgba(0,0,0,.14),0 1px 8px 0 rgba(0,0,0,.12),0 3px 3px -2px rgba(0,0,0,.4))}:host([checked]) #knob{-webkit-transform:translateX(28px);transform:translateX(28px);-webkit-transform:translateX(calc(var(--catalyst-toggle-switch-bar-width, 44px) + 2 * var(--catalyst-toggle-switch-knob-offset, 5px) - var(--catalyst-toggle-switch-knob-size, 26px) + var(--catalyst-toggle-switch-bar-border-left-wdith, 0px)));transform:translateX(calc(var(--catalyst-toggle-switch-bar-width, 44px) + 2 * var(--catalyst-toggle-switch-knob-offset, 5px) - var(--catalyst-toggle-switch-knob-size, 26px) + var(--catalyst-toggle-switch-bar-border-left-wdith, 0px)))}:host([checked]) .negitive-knob-offset #knob{-webkit-transform:translateX(calc(var(--catalyst-toggle-switch-bar-width, 44px) + 2 * var(--catalyst-toggle-switch-knob-offset, 5px) - var(--catalyst-toggle-switch-knob-size, 26px) + var(--catalyst-toggle-switch-bar-border-left-wdith, 0px) - (var(--catalyst-toggle-switch-bar-height, 16px) - var(--catalyst-toggle-switch-knob-size, 26px)) / 2 + 1px));transform:translateX(calc(var(--catalyst-toggle-switch-bar-width, 44px) + 2 * var(--catalyst-toggle-switch-knob-offset, 5px) - var(--catalyst-toggle-switch-knob-size, 26px) + var(--catalyst-toggle-switch-bar-border-left-wdith, 0px) - (var(--catalyst-toggle-switch-bar-height, 16px) - var(--catalyst-toggle-switch-knob-size, 26px)) / 2 + 1px))}:host([disabled]) #bar{background-color:#f1f3f5;background-color:var(--catalyst-toggle-switch-bar-color,#f1f3f5)}:host([disabled]) #knob{background-color:#ced4da;background-color:var(--catalyst-toggle-switch-knob-color,#f1f3f5);-webkit-box-shadow:0 2px 2px 0 rgba(0,0,0,.07),0 1px 5px 0 rgba(0,0,0,.06),0 3px 1px -2px rgba(0,0,0,.1);box-shadow:0 2px 2px 0 rgba(0,0,0,.07),0 1px 5px 0 rgba(0,0,0,.06),0 3px 1px -2px rgba(0,0,0,.1);-webkit-box-shadow:var(--catalyst-toggle-switch-knob-box-shadow,0 2px 2px 0 rgba(0,0,0,.07),0 1px 5px 0 rgba(0,0,0,.06),0 3px 1px -2px rgba(0,0,0,.1));box-shadow:var(--catalyst-toggle-switch-knob-box-shadow,0 2px 2px 0 rgba(0,0,0,.07),0 1px 5px 0 rgba(0,0,0,.06),0 3px 1px -2px rgba(0,0,0,.1))}:host(:focus){outline:none}:host(:focus) #knob{background-color:#fafafa;background-color:var(--catalyst-toggle-switch-knob-color,#fafafa);border:1px solid rgba(0,0,0,.16);border:var(--catalyst-toggle-switch-knob-border,solid 1px rgba(0,0,0,.16));-webkit-box-shadow:0 6px 10px 0 rgba(0,0,0,.14),0 1px 18px 0 rgba(0,0,0,.12),0 3px 5px -1px rgba(0,0,0,.4);box-shadow:0 6px 10px 0 rgba(0,0,0,.14),0 1px 18px 0 rgba(0,0,0,.12),0 3px 5px -1px rgba(0,0,0,.4);-webkit-box-shadow:var(--catalyst-toggle-switch-knob-box-shadow,0 6px 10px 0 rgba(0,0,0,.14),0 1px 18px 0 rgba(0,0,0,.12),0 3px 5px -1px rgba(0,0,0,.4));box-shadow:var(--catalyst-toggle-switch-knob-box-shadow,0 6px 10px 0 rgba(0,0,0,.14),0 1px 18px 0 rgba(0,0,0,.12),0 3px 5px -1px rgba(0,0,0,.4))}:host([hidden]){display:none}</style><div id="bar"><div id="knob"></div></div><slot></slot>';
void 0!==window.ShadyCSS&&window.ShadyCSS.prepareTemplate(b,a.is);return b}}});a._isRegistered||a._register()},function(c,d,f){f.d(d,"a",function(){return e});var e=function(a){a=void 0===a?e.template:a;var b=HTMLElement.call(this)||this;b.attachShadow({mode:"open"});b.shadowRoot.appendChild(a.content.cloneNode(!0));b._inputElement=document.createElement("input");b._inputElement.type="checkbox";b._inputElement.style.display="none";b.appendChild(b._inputElement);return b};$jscomp.inherits(e,HTMLElement);
e._register=function(){var a=function(){window.customElements.define(e.is,e);e.__isRegistered=!0};void 0===window.WebComponents||window.WebComponents.ready?a():window.addEventListener("WebComponentsReady",function(){a()})};e.prototype.connectedCallback=function(){void 0!==window.ShadyCSS&&window.ShadyCSS.styleElement(this);this._upgradeProperty("checked");this._upgradeProperty("pressed");this._upgradeProperty("disabled");this._upgradeProperty("required");this.setAttribute("aria-disabled",this.disabled);
this.setAttribute("aria-required",this.required);this.hasAttribute("role")?"button"!==this.getAttribute("role")&&this.setAttribute("aria-checked",this.checked):(this.setAttribute("role","button"),this.setAttribute("aria-pressed",this.checked));this.hasAttribute("tabindex")||this.setAttribute("tabindex",0);this.addEventListener("keydown",this._onKeyDown);this.addEventListener("click",this._onClick)};e.prototype._upgradeProperty=function(a){if(this.hasOwnProperty(a)){var b=this[a];delete this[a];this[a]=
b}};e.prototype.disconnectedCallback=function(){this.removeEventListener("keydown",this._onKeyDown);this.removeEventListener("click",this._onClick)};e.prototype.attributeChangedCallback=function(a,b,c){b=null!==c;switch(a){case "checked":case "pressed":"button"===this.getAttribute("role")?this.setAttribute("aria-pressed",b):this.setAttribute("aria-checked",b);b?this.inputElement.setAttribute("checked",""):this.inputElement.removeAttribute("checked");break;case "disabled":this.setAttribute("aria-disabled",
b);b?(this.inputElement.setAttribute("disabled",""),this.hasAttribute("tabindex")&&(this._tabindexBeforeDisabled=this.getAttribute("tabindex"),this.removeAttribute("tabindex"),this.blur())):(this.inputElement.removeAttribute("disabled"),this.hasAttribute("tabindex")||void 0===this._tabindexBeforeDisabled||null===this._tabindexBeforeDisabled||this.setAttribute("tabindex",this._tabindexBeforeDisabled));break;case "required":this.setAttribute("aria-required",b);b?this.inputElement.setAttribute("required",
""):this.inputElement.removeAttribute("required");break;case "name":this.inputElement.setAttribute("name",new String(c));break;case "value":this.inputElement.setAttribute("value",new String(c));break;case "form":this._inputElement.setAttribute("form",c)}};e.prototype._onKeyDown=function(a){if(!a.altKey)switch(a.keyCode){case e._KEYCODE.SPACE:case e._KEYCODE.ENTER:a.preventDefault(),this._toggleChecked()}};e.prototype._onClick=function(){this._toggleChecked()};e.prototype._toggleChecked=function(){if(!this.disabled){if("button"===
this.getAttribute("role")){this.pressed=!this.pressed;var a="pressed"}else this.checked=!this.checked,a="checked";var b={};this.dispatchEvent(new CustomEvent("change",{detail:(b[a]=this.checked,b),bubbles:!0}))}};$jscomp.global.Object.defineProperties(e.prototype,{checked:{configurable:!0,enumerable:!0,set:function(a){a?this.setAttribute("checked",""):this.removeAttribute("checked")},get:function(){return this.hasAttribute("checked")}},pressed:{configurable:!0,enumerable:!0,set:function(a){a?this.setAttribute("pressed",
""):this.removeAttribute("pressed")},get:function(){return this.hasAttribute("pressed")}},disabled:{configurable:!0,enumerable:!0,set:function(a){a?this.setAttribute("disabled",""):this.removeAttribute("disabled")},get:function(){return this.hasAttribute("disabled")}},required:{configurable:!0,enumerable:!0,set:function(a){a?this.setAttribute("required",""):this.removeAttribute("required")},get:function(){return this.hasAttribute("required")}},name:{configurable:!0,enumerable:!0,set:function(a){this.setAttribute("name",
new String(a))},get:function(){return this.hasAttribute("name")?this.getAttribute("name"):""}},form:{configurable:!0,enumerable:!0,get:function(){return this._inputElement.form}},value:{configurable:!0,enumerable:!0,set:function(a){this.setAttribute("value",new String(a))},get:function(){return this.hasAttribute("value")?this.getAttribute("value"):"on"}},inputElement:{configurable:!0,enumerable:!0,get:function(){return this._inputElement}}});$jscomp.global.Object.defineProperties(e,{is:{configurable:!0,
enumerable:!0,get:function(){return"catalyst-toggle-button"}},_isRegistered:{configurable:!0,enumerable:!0,get:function(){return!!e.__isRegistered}},template:{configurable:!0,enumerable:!0,get:function(){var a=document.createElement("template");a.innerHTML="<style>:host{display:inline-block;-webkit-box-align:start;-ms-flex-align:start;align-items:flex-start;padding:2px 7px;margin:0;font:400 13.3333px Arial;letter-spacing:normal;word-spacing:normal;color:#000;text-align:center;text-indent:0;text-rendering:auto;text-shadow:none;text-transform:none;cursor:default;background-color:#ddd;border:2px outset #ddd;-o-border-image:none;border-image:none;-o-border-image:initial;border-image:initial;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;-webkit-appearance:button;-moz-appearance:button}:host([pressed]){padding:2px 6px 2px 8px;color:#000;text-shadow:.5px .5px 1px #f0f0f0;background-color:#bbb;border-color:#aaa;border-style:inset}:host([hidden]){display:none}</style><slot></slot>";
void 0!==window.ShadyCSS&&window.ShadyCSS.prepareTemplate(a,e.is);return a}},_KEYCODE:{configurable:!0,enumerable:!0,get:function(){void 0===this.__keycode&&(this.__keycode={SPACE:32,ENTER:13});return this.__keycode}},observedAttributes:{configurable:!0,enumerable:!0,get:function(){return"checked pressed disabled required name value form".split(" ")}}});e._isRegistered||e._register()}]);
