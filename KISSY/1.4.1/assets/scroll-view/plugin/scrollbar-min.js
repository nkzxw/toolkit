/*
Copyright 2013, KISSY v1.41
MIT Licensed
build time: Dec 4 22:18
*/
KISSY.add("scroll-view/plugin/scrollbar/scrollbar-xtpl",[],function(){return function(d){var c;c=this.config.utils;var g=c.renderOutput,h=c.getProperty,i=c.runInlineCommand,f=c.getPropertyOrRunCommand;c='<div id="ks-scrollbar-arrow-up-';var e=f(this,d,{},"id",0,1);c+=g(e,!0);c+='"\n        class="';var e={},a=[],b=h(this,d,"axis",0,2);a.push(b+"-arrow-up");e.params=a;e=i(this,d,e,"getBaseCssClasses",2);c+=g(e,!0);c+='">\n    <a href="javascript:void(\'up\')">up</a>\n</div>\n<div id="ks-scrollbar-arrow-down-';
e=f(this,d,{},"id",0,5);c+=g(e,!0);c+='"\n        class="';e={};a=[];b=h(this,d,"axis",0,6);a.push(b+"-arrow-down");e.params=a;e=i(this,d,e,"getBaseCssClasses",6);c+=g(e,!0);c+='">\n    <a href="javascript:void(\'down\')">down</a>\n</div>\n<div id="ks-scrollbar-track-';e=f(this,d,{},"id",0,9);c+=g(e,!0);c+='"\n     class="';e={};a=[];b=h(this,d,"axis",0,10);a.push(b+"-track");e.params=a;e=i(this,d,e,"getBaseCssClasses",10);c+=g(e,!0);c+='">\n<div id="ks-scrollbar-drag-';f=f(this,d,{},"id",0,11);c+=
g(f,!0);c+='"\n     class="';f={};e=[];a=h(this,d,"axis",0,12);e.push(a+"-drag");f.params=e;f=i(this,d,f,"getBaseCssClasses",12);c+=g(f,!0);c+='">\n<div class="';f={};e=[];a=h(this,d,"axis",0,13);e.push(a+"-drag-top");f.params=e;f=i(this,d,f,"getBaseCssClasses",13);c+=g(f,!0);c+='">\n</div>\n<div class="';f={};e=[];a=h(this,d,"axis",0,15);e.push(a+"-drag-center");f.params=e;f=i(this,d,f,"getBaseCssClasses",15);c+=g(f,!0);c+='">\n</div>\n<div class="';f={};e=[];h=h(this,d,"axis",0,17);e.push(h+"-drag-bottom");
f.params=e;d=i(this,d,f,"getBaseCssClasses",17);c+=g(d,!0);return c+'">\n</div>\n</div>\n</div>'}});
KISSY.add("scroll-view/plugin/scrollbar/render",["component/control","./scrollbar-xtpl"],function(d,c){var g=c("component/control"),h=c("./scrollbar-xtpl"),i=d.Features.isTransform3dSupported(),f=d.Features.isTransformSupported(),e={beforeCreateDom:function(b,a){b.elCls.push(b.prefixCls+"scrollbar-"+b.axis);d.mix(a,{dragEl:"#ks-scrollbar-drag-{id}",downBtn:"#ks-scrollbar-arrow-down-{id}",upBtn:"#ks-scrollbar-arrow-up-{id}",trackEl:"#ks-scrollbar-track-{id}"})},createDom:function(){var b=this.control;
b.$dragEl=b.get("dragEl");b.$trackEl=b.get("trackEl");b.$downBtn=b.get("downBtn");b.$upBtn=b.get("upBtn");b.dragEl=b.$dragEl[0];b.trackEl=b.$trackEl[0];b.downBtn=b.$downBtn[0];b.upBtn=b.$upBtn[0]},syncUI:function(){var b=this.control,a=b.get("scrollView"),c=b.trackEl,e=b.scrollWHProperty,f=b.whProperty,d=b.clientWHProperty,g=b.dragWHProperty;b.scrollView=a;a.allowScroll[b.scrollType]?(b.scrollLength=a[e],c=b.trackElSize="width"===f?c.offsetWidth:c.offsetHeight,a=a[d]/b.scrollLength,a*=c,b.set(g,a),
b.barSize=a,this.syncOnScrollChange(),b.set("visible",!0)):b.set("visible",!1)},syncOnScrollChange:function(){var b=this.control,a=b.scrollType,c=b.scrollView,e=b.dragLTProperty,f=b.dragWHProperty,d=b.trackElSize,g=b.barSize,i=b.scrollLength,h=c.get(b.scrollProperty),j=c.minScroll[a],a=c.maxScroll[a];h>a?(d*=a/i,b.set(f,g-(h-a)),b.set(e,d+g-b.get(f))):h<j?(d*=j/i,b.set(f,g-(j-h)),b.set(e,d)):(b.set(e,h/i*d),b.set(f,g))},_onSetDragHeight:function(a){this.control.dragEl.style.height=a+"px"},_onSetDragWidth:function(a){this.control.dragEl.style.width=
a+"px"},_onSetDragLeft:function(a){this.control.dragEl.style.left=a+"px"},_onSetDragTop:function(a){this.control.dragEl.style.top=a+"px"}},a=d.Features.getTransformProperty();f&&(e._onSetDragLeft=function(b){this.control.dragEl.style[a]="translateX("+b+"px)"+(i?" translateZ(0)":"")},e._onSetDragTop=function(b){this.control.dragEl.style[a]="translateY("+b+"px)"+(i?" translateZ(0)":"")});return g.getDefaultRender().extend(e,{ATTRS:{contentTpl:{value:h}}})});
KISSY.add("scroll-view/plugin/scrollbar/control",["node","component/control","./render"],function(d,c){var g=c("node"),h=c("component/control"),i=c("./render"),f=g.Gesture,e=!d.Features.isTouchGestureSupported();return h.extend({initializer:function(){var a=this.scrollType="x"===this.get("axis")?"left":"top",b=d.ucfirst(a);this.pageXyProperty="left"===a?"pageX":"pageY";a=this.whProperty="left"===a?"width":"height";a=d.ucfirst(a);this.afterScrollChangeEvent="afterScroll"+b+"Change";this.scrollProperty=
"scroll"+b;this.dragWHProperty="drag"+a;this.dragLTProperty="drag"+b;this.clientWHProperty="client"+a;this.scrollWHProperty="scroll"+a},bindUI:function(){var a=this,b=a.get("autoHide"),c=a.get("scrollView");b?a.hideFn=d.bind(a.hide,a):(d.each([a.$downBtn,a.$upBtn],function(b){b.on(f.start,a.onUpDownBtnMouseDown,a).on(f.end,a.onUpDownBtnMouseUp,a)}),a.$trackEl.on(f.start,a.onTrackElMouseDown,a),e&&d.use("dd",function(b,c){a.dd=(new c.Draggable({node:a.$dragEl,disabled:a.get("disabled"),groups:!1,halt:!0})).on("drag",
a.onDrag,a).on("dragstart",a.onDragStart,a)}));c.on(a.afterScrollChangeEvent+".ks-scrollbar",a.afterScrollChange,a).on("scrollEnd.ks-scrollbar",a.onScrollEnd,a).on("afterDisabledChange",a.onScrollViewDisabled,a)},destructor:function(){this.get("scrollView").detach(".ks-scrollbar");this.clearHideTimer()},onScrollViewDisabled:function(a){this.set("disabled",a.newVal)},onDragStart:function(){var a=this.scrollView;this.startMousePos=this.dd.get("startMousePos")[this.scrollType];this.startScroll=a.get(this.scrollProperty)},
onDrag:function(a){var b=this.scrollView,c={};c[this.scrollType]=this.startScroll+(a[this.pageXyProperty]-this.startMousePos)/this.trackElSize*this.scrollLength;b.scrollToWithBounds(c)},startHideTimer:function(){this.clearHideTimer();this.hideTimer=setTimeout(this.hideFn,1E3*this.get("hideDelay"))},clearHideTimer:function(){this.hideTimer&&(clearTimeout(this.hideTimer),this.hideTimer=null)},onUpDownBtnMouseDown:function(a){function b(){var a={};a[d]=c.get(e)+g*f;c.scrollToWithBounds(a)}if(!this.get("disabled")){a.halt();
var c=this.scrollView,e=this.scrollProperty,d=this.scrollType,f=c.getScrollStep()[this.scrollType],a=a.target,g=a===this.downBtn||this.$downBtn.contains(a)?1:-1;clearInterval(this.mouseInterval);this.mouseInterval=setInterval(b,100);b()}},onTrackElMouseDown:function(a){if(!this.get("disabled")){var b=a.target,c=this.$dragEl;if(!(this.dragEl===b||c.contains(b))){var b=this.scrollType,c=this.scrollView,e=Math.max(0,(a[this.pageXyProperty]-this.$trackEl.offset()[b]-this.barSize/2)/this.trackElSize),
d={};d[b]=e*this.scrollLength;c.scrollToWithBounds(d);a.halt()}}},onUpDownBtnMouseUp:function(){clearInterval(this.mouseInterval)},onScrollEnd:function(){this.hideFn&&this.startHideTimer()},afterScrollChange:function(){var a=this.scrollView;a.allowScroll[this.scrollType]&&(this.clearHideTimer(),this.set("visible",!0),this.hideFn&&!a.isScrolling&&this.startHideTimer(),this.view.syncOnScrollChange())},_onSetDisabled:function(a){this.dd&&this.dd.set("disabled",a)}},{ATTRS:{minLength:{value:20},scrollView:{},
axis:{view:1},autoHide:{value:d.UA.ios},visible:{valueFn:function(){return!this.get("autoHide")}},hideDelay:{value:0.1},dragWidth:{setter:function(a){var b=this.get("minLength");return a<b?b:a},view:1},dragHeight:{setter:function(a){var b=this.get("minLength");return a<b?b:a},view:1},dragLeft:{view:1},dragTop:{view:1},dragEl:{},downBtn:{},upBtn:{},trackEl:{},focusable:{value:!1},xrender:{value:i}},xclass:"scrollbar"})});
KISSY.add("scroll-view/plugin/scrollbar",["base","./scrollbar/control"],function(d,c){var g=c("base"),h=c("./scrollbar/control");return g.extend({pluginId:this.getName(),pluginSyncUI:function(c){var f=this.get("minLength"),e=this.get("autoHideX"),a=this.get("autoHideY"),b={scrollView:c,elBefore:c.$contentEl};void 0!==f&&(b.minLength=f);this.scrollBarX?this.scrollBarX.sync():c.allowScroll.left&&(f={axis:"x"},void 0!==e&&(b.autoHide=e),this.scrollBarX=(new h(d.merge(b,f))).render());this.scrollBarY?
this.scrollBarY.sync():c.allowScroll.top&&(f={axis:"y"},void 0!==a&&(b.autoHide=a),this.scrollBarY=(new h(d.merge(b,f))).render())},pluginDestructor:function(){this.scrollBarX&&(this.scrollBarX.destroy(),this.scrollBarX=null);this.scrollBarY&&(this.scrollBarY.destroy(),this.scrollBarY=null)}},{ATTRS:{minLength:{},autoHideX:{},autoHideY:{}}})});
