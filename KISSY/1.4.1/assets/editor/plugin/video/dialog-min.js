/*
Copyright 2013, KISSY v1.41
MIT Licensed
build time: Dec 4 22:14
*/
KISSY.add("editor/plugin/video/dialog",["editor","../flash/dialog","../menubutton"],function(g,e){function f(){f.superclass.constructor.apply(this,arguments)}var c=e("editor"),i=e("../flash/dialog"),j=e("../menubutton");g.extend(f,i,{_config:function(){var b=this.editor.get("prefixCls"),a=this.config;this._cls="ke_video";this._type="video";this._title="\u89c6\u9891";this._bodyHTML=g.substitute('<div style="padding:20px 20px 0 20px"><p><label>\u94fe\u63a5\uff1a <input class="{prefixCls}editor-video-url {prefixCls}editor-input" style="width:410px;"/></label></p><table style="margin:10px 0 5px  40px;width:400px;"><tr><td><label>\u5bbd\u5ea6\uff1a  <input  data-verify="^(\u81ea\u52a8|((?!0$)\\d+))?$"  data-warning="\u5bbd\u5ea6\u8bf7\u8f93\u5165\u6b63\u6574\u6570" class="{prefixCls}editor-video-width {prefixCls}editor-input" style="width:60px;" /> \u50cf\u7d20</label></td><td><label> \u9ad8\u5ea6\uff1a  <input  data-verify="^(\u81ea\u52a8|((?!0$)\\d+))?$"  data-warning="\u9ad8\u5ea6\u8bf7\u8f93\u5165\u6b63\u6574\u6570" class="{prefixCls}editor-video-height {prefixCls}editor-input" style="width:60px;"/> \u50cf\u7d20</label></td></tr><tr><td><label>\u5bf9\u9f50\uff1a <select class="{prefixCls}editor-video-align" title="\u5bf9\u9f50"><option value="none">\u65e0</option><option value="left">\u5de6\u5bf9\u9f50</option><option value="right">\u53f3\u5bf9\u9f50</option></select></td><td><label>\u95f4\u8ddd\uff1a <input  data-verify="^\\d+$"  data-warning="\u95f4\u8ddd\u8bf7\u8f93\u5165\u975e\u8d1f\u6574\u6570" class="{prefixCls}editor-video-margin {prefixCls}editor-input" style="width:60px;" value="0"/> \u50cf\u7d20</label></td></tr></table></div>',
{prefixCls:b});this._footHTML=g.substitute('<div style="padding:10px 0 35px 20px;"><a class="{prefixCls}editor-video-ok {prefixCls}editor-button ks-inline-block" style="margin-left:40px;margin-right:20px;">\u786e\u5b9a</button> <a class="{prefixCls}editor-video-cancel {prefixCls}editor-button ks-inline-block">\u53d6\u6d88</a></div>',{prefixCls:b});this.urlCfg=a.urlCfg;this._urlTip=a.urlTip||"\u8bf7\u8f93\u5165\u89c6\u9891\u64ad\u653e\u94fe\u63a5..."},_initD:function(){var b=this.dialog,a=this.editor.get("prefixCls"),d=b.get("el");this.dUrl=d.one("."+a+"editor-video-url");
this.dAlign=j.Select.decorate(d.one("."+a+"editor-video-align"),{prefixCls:a+"editor-big-",width:80,menuCfg:{prefixCls:a+"editor-",render:d}});this.dMargin=d.one("."+a+"editor-video-margin");this.dWidth=d.one("."+a+"editor-video-width");this.dHeight=d.one("."+a+"editor-video-height");var f=d.one("."+a+"editor-video-ok"),a=d.one("."+a+"editor-video-cancel");f.on("click",this._gen,this);a.on("click",function(a){b.hide();a.halt()});c.Utils.placeholder(this.dUrl,this._urlTip);c.Utils.placeholder(this.dWidth,
"\u81ea\u52a8");c.Utils.placeholder(this.dHeight,"\u81ea\u52a8");this.addRes(this.dAlign)},_getDInfo:function(){var b=this.dUrl.val(),a=this.config.getProvider(b);if(a){b=a.detect(b);if(!b){window.alert("\u4e0d\u652f\u6301\u8be5\u94fe\u63a5\uff0c\u8bf7\u76f4\u63a5\u8f93\u5165\u8be5\u89c6\u9891\u63d0\u4f9b\u7684\u5206\u4eab\u94fe\u63a5");return}return{url:b,attrs:{height:parseInt(this.dHeight.val())||a.height,width:parseInt(this.dWidth.val())||a.width,style:"margin:"+(parseInt(this.dMargin.val())||0)+"px;float:"+this.dAlign.get("value")+";"}}}window.alert("\u4e0d\u652f\u6301\u8be5\u94fe\u63a5\u6765\u6e90!")},_gen:function(b){var a=this,d=a.dUrl.val(),c=a.urlCfg;if(c)for(var e=
0;e<c.length;e++){var h=c[e];if(h.reg.test(d)){a.dialog.loading();b={};b[h.paramName||"url"]=d;g.io({url:h.url,data:b,dataType:"jsonp",success:function(b){a._dynamicUrlPrepare(b[1])}});return}}f.superclass._gen.call(a,b);b&&b.halt()},_dynamicUrlPrepare:function(b){this.dUrl.val(b);this.dialog.unloading();f.superclass._gen.call(this)},_updateD:function(){var b=this.editor,a=this.selectedFlash;a?(b=b.restoreRealElement(a),c.Utils.valInput(this.dUrl,this._getFlashUrl(b)),this.dAlign.set("value",a.css("float")),
this.dMargin.val(parseInt(b.style("margin"))||0),c.Utils.valInput(this.dWidth,parseInt(a.css("width"))),c.Utils.valInput(this.dHeight,parseInt(a.css("height")))):(c.Utils.resetInput(this.dUrl),this.dAlign.set("value","none"),this.dMargin.val(0),c.Utils.resetInput(this.dWidth),c.Utils.resetInput(this.dHeight))}});return f});
