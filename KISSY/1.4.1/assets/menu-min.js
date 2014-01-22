/*
Copyright 2013, KISSY v1.41
MIT Licensed
build time: Dec 4 22:16
*/
KISSY.add("menu/menu-render",["component/container"],function(e,a){return a("component/container").getDefaultRender().extend({beforeCreateDom:function(a){a.elAttrs.role="menu"},containsElement:function(a){var c=this.$el;return c&&(c[0]===a||c.contains(a))}})});
KISSY.add("menu/control",["node","component/container","component/extension/delegate-children","./menu-render"],function(e,a){function b(a){a.target.isMenu&&(a=a.newVal,this.el.setAttribute("aria-activedescendant",a&&a.el.id||""))}var c=a("node"),h=a("component/container"),d=a("component/extension/delegate-children"),g=a("./menu-render"),i=c.KeyCode;return h.extend([d],{isMenu:1,_onSetHighlightedItem:function(a,f){var d;a&&f&&(d=f.prevVal)&&d.set("highlighted",!1,{data:{byPassSetHighlightedItem:1}})},
_onSetVisible:function(a,f){this.callSuper(f);var d;!a&&(d=this.get("highlightedItem"))&&d.set("highlighted",!1)},bindUI:function(){this.on("afterHighlightedItemChange",b,this)},getRootMenu:function(){return this},handleMouseEnterInternal:function(a){this.callSuper(a);if((a=this.getRootMenu())&&a._popupAutoHideTimer)clearTimeout(a._popupAutoHideTimer),a._popupAutoHideTimer=null;this.focus()},handleBlurInternal:function(a){this.callSuper(a);var f;(f=this.get("highlightedItem"))&&f.set("highlighted",
!1)},_getNextEnabledHighlighted:function(a,f){var d=this.get("children"),b=d.length,c=a;do{var g=d[a];if(!g.get("disabled")&&!1!==g.get("visible"))return d[a];a=(a+f+b)%b}while(a!==c)},handleKeyDownInternal:function(a){var f=this.get("highlightedItem");if(f&&f.handleKeyDownInternal(a))return!0;var d=this.get("children"),b=d.length;if(0!==b){var c;switch(a.keyCode){case i.ESC:(f=this.get("highlightedItem"))&&f.set("highlighted",!1);break;case i.HOME:c=this._getNextEnabledHighlighted(0,1);break;case i.END:c=
this._getNextEnabledHighlighted(b-1,-1);break;case i.UP:f?(a=e.indexOf(f,d),b=(a-1+b)%b):b-=1;c=this._getNextEnabledHighlighted(b,-1);break;case i.DOWN:f?(a=e.indexOf(f,d),b=(a+1+b)%b):b=0,c=this._getNextEnabledHighlighted(b,1)}if(c)return c.set("highlighted",!0,{data:{fromKeyboard:1}}),!0}},containsElement:function(a){if(!this.get("visible")||!this.$el)return!1;if(this.view.containsElement(a))return!0;for(var f=this.get("children"),b=0,d=f.length;b<d;b++){var c=f[b];if(c.containsElement&&c.containsElement(a))return!0}return!1}},
{ATTRS:{highlightedItem:{value:null},xrender:{value:g},defaultChildCfg:{value:{xclass:"menuitem"}}},xclass:"menu"})});
KISSY.add("menu/menuitem-render",["component/control"],function(e,a){return a("component/control").getDefaultRender().extend({beforeCreateDom:function(a){a.elAttrs.role=a.selectable?"menuitemradio":"menuitem";a.selected&&a.elCls.push(this.getBaseCssClasses("selected"))},_onSetSelected:function(a){var c=this.getBaseCssClasses("selected");this.$el[a?"addClass":"removeClass"](c)},containsElement:function(a){var c=this.$el;return c&&(c[0]===a||c.contains(a))}},{HTML_PARSER:{selectable:function(a){return a.hasClass(this.getBaseCssClass("selectable"))}}})});
KISSY.add("menu/menuitem",["component/control","./menuitem-render","node"],function(e,a){var b=a("component/control"),c=a("./menuitem-render"),h=a("node").all;return b.extend({isMenuItem:1,handleClickInternal:function(){this.callSuper();this.get("selectable")&&this.set("selected",!0);this.fire("click");return!0},_onSetHighlighted:function(a,c){var b=this.get("parent");if(!c||!c.byPassSetHighlightedItem)this.get("rendered")?b.set("highlightedItem",a?this:null):a&&b.set("highlightedItem",this);if(a){var e=
this.$el;(b=e.parent(function(a){return"visible"!==h(a).css("overflow")},b.get("el").parent()))&&e.scrollIntoView(b,{alignWithTop:!0,allowHorizontalScroll:!0,onlyScrollIfNeeded:!0})}},containsElement:function(a){return this.view.containsElement(a)}},{ATTRS:{focusable:{value:!1},handleMouseEvents:{value:!1},selectable:{view:1},value:{},selected:{view:1},xrender:{value:c}},xclass:"menuitem"})});
KISSY.add("menu/check-menuitem-xtpl",["component/extension/content-xtpl"],function(e,a,b,c){return function(b){var d,g;d=this.config.utils;"undefined"!==typeof c&&c.kissy&&(g=c);var e=d.renderOutput,j=d.runInlineCommand;d='<div class="';var f={},k=[];k.push("checkbox");f.params=k;f=j(this,b,f,"getBaseCssClasses",1);d+=e(f,!0);d+='">\n</div>\n';f={};k=[];k.push("component/extension/content-xtpl");f.params=k;g&&(a("component/extension/content-xtpl"),f.params[0]=g.resolveByName(f.params[0]));b=j(this,
b,f,"include",3);return d+=e(b,!1)}});KISSY.add("menu/check-menuitem-render",["./menuitem-render","component/extension/content-render","./check-menuitem-xtpl"],function(e,a){var b=a("./menuitem-render"),c=a("component/extension/content-render"),h=a("./check-menuitem-xtpl");return b.extend([c],{beforeCreateDom:function(a){a.checked&&a.elCls.push(this.getBaseCssClasses("checked"))},_onSetChecked:function(a){var b=this.getBaseCssClasses("checked");this.$el[a?"addClass":"removeClass"](b)}},{ATTRS:{contentTpl:{value:h}}})});
KISSY.add("menu/check-menuitem",["./menuitem","./check-menuitem-render"],function(e,a){var b=a("./menuitem"),c=a("./check-menuitem-render");return b.extend({handleClickInternal:function(){this.callSuper();this.set("checked",!this.get("checked"));this.fire("click");return!0}},{ATTRS:{checked:{view:1},xrender:{value:c}},xclass:"check-menuitem"})});
KISSY.add("menu/submenu-xtpl",[],function(){return function(e){var a;a=this.config.utils;var b=a.renderOutput,c=a.runInlineCommand,h=a.getPropertyOrRunCommand;a='<div id="ks-content-';var d=h(this,e,{},"id",0,1);a+=b(d,!0);a+='"\n     class="';var d={},g=[];g.push("content");d.params=g;c=c(this,e,d,"getBaseCssClasses",2);a+=b(c,!0);a+='">';c=h(this,e,{},"content",0,2);a+=b(c,!1);a+='</div>\n<span class="';e=h(this,e,{},"prefixCls",0,3);a+=b(e,!0);return a+'submenu-arrow">\u25ba</span>'}});
KISSY.add("menu/submenu-render",["./submenu-xtpl","./menuitem-render","component/extension/content-render"],function(e,a){var b=a("./submenu-xtpl"),c=a("./menuitem-render"),h=a("component/extension/content-render");return c.extend([h],{decorateDom:function(a){var b=this.control,c=b.get("prefixCls"),a=a.one("."+c+"popupmenu"),e=a[0].ownerDocument.body;e.insertBefore(a[0],e.firstChild);e=this.getComponentConstructorByNode(c,a);b.setInternal("menu",new e({srcNode:a,prefixCls:c}))}},{ATTRS:{contentTpl:{value:b}}})});
KISSY.add("menu/submenu",["node","./menuitem","./submenu-render"],function(e,a){function b(a){var b=a.target;b!==this&&b.isMenuItem&&a.newVal&&(this.clearHidePopupMenuTimers(),this.get("highlighted")||(this.set("highlighted",!0),b.set("highlighted",!1),b.set("highlighted",!0)))}function c(){var a=this.get("menu"),b={node:this.$el,points:["tr","tl"],overflow:{adjustX:1,adjustY:1}};e.mix(a.get("align"),b,!1);a.show();this.el.setAttribute("aria-haspopup",a.get("el").attr("id"))}function h(){this.get("menu").hide()}
var d=a("node"),g=a("./menuitem"),i=a("./submenu-render"),j=d.KeyCode;return g.extend({isSubMenu:1,clearShowPopupMenuTimers:function(){var a;if(a=this._showTimer)a.cancel(),this._showTimer=null},clearHidePopupMenuTimers:function(){var a;if(a=this._dismissTimer)a.cancel(),this._dismissTimer=null},clearSubMenuTimers:function(){this.clearHidePopupMenuTimers();this.clearShowPopupMenuTimers()},bindUI:function(){this.on("afterHighlightedChange",b,this)},handleMouseLeaveInternal:function(){this.set("highlighted",
!1,{data:{fromMouse:1}});this.clearSubMenuTimers();this.get("menu").get("visible")&&(this._dismissTimer=e.later(h,1E3*this.get("menuDelay"),!1,this))},handleMouseEnterInternal:function(){this.set("highlighted",!0,{data:{fromMouse:1}});this.clearSubMenuTimers();this.get("menu").get("visible")||(this._showTimer=e.later(c,1E3*this.get("menuDelay"),!1,this))},_onSetHighlighted:function(a,b){b&&(this.callSuper(b),b.fromMouse||(a&&!b.fromKeyboard?c.call(this):a||h.call(this)))},handleClickInternal:function(){c.call(this);
this.callSuper()},handleKeyDownInternal:function(a){var b=this.get("menu"),d,e=b.get("visible"),g=a.keyCode;if(e){if(!b.handleKeyDownInternal(a))if(g===j.LEFT)this.set("highlighted",!1),this.set("highlighted",!0,{data:{fromKeyboard:1}});else return}else if(g===j.RIGHT)c.call(this),a=b.get("children"),(d=a[0])&&d.set("highlighted",!0,{data:{fromKeyboard:1}});else{if(g===j.ENTER)return this.handleClickInternal(a);return}return!0},containsElement:function(a){return this.get("menu").containsElement(a)},
destructor:function(){var a=this.get("menu");this.clearSubMenuTimers();a.destroy()}},{ATTRS:{menuDelay:{value:0.15},menu:{value:{},getter:function(a){a.isControl||(a.xclass=a.xclass||"popupmenu",a=this.createComponent(a),this.setInternal("menu",a));return a},setter:function(a){a.isControl&&a.setInternal("parent",this)}},xrender:{value:i}},xclass:"submenu"})});
KISSY.add("menu/popupmenu-render",["component/extension/content-render","./menu-render"],function(e,a){var b=a("component/extension/content-render");return a("./menu-render").extend([b])});
KISSY.add("menu/popupmenu",["component/extension/align","component/extension/shim","./control","./popupmenu-render"],function(e,a){var b=a("component/extension/align"),c=a("component/extension/shim"),h=a("./control"),d=a("./popupmenu-render");return h.extend([c,b],{getRootMenu:function(){var a=this,b;do b=a,a=a.get("parent");while(a&&(a.isMenuItem||a.isMenu));return b===this?null:b},handleMouseLeaveInternal:function(a){this.callSuper(a);if(this.get("autoHideOnMouseLeave")){var b=this.getRootMenu();
b&&(clearTimeout(b._popupAutoHideTimer),b._popupAutoHideTimer=setTimeout(function(){var a;(a=b.get("highlightedItem"))&&a.set("highlighted",!1)},1E3*this.get("parent").get("menuDelay")))}},isPopupMenu:1,handleBlurInternal:function(a){this.callSuper(a);this.hide()}},{ATTRS:{focusable:{value:!1},autoHideOnMouseLeave:{},contentEl:{},visible:{value:!1},xrender:{value:d}},xclass:"popupmenu"})});
KISSY.add("menu",["menu/control","menu/menuitem","menu/check-menuitem","menu/submenu","menu/popupmenu"],function(e,a){var b=a("menu/control"),c=a("menu/menuitem"),h=a("menu/check-menuitem"),d=a("menu/submenu"),g=a("menu/popupmenu");b.Item=c;b.CheckItem=h;b.SubMenu=d;b.PopupMenu=g;return b});
