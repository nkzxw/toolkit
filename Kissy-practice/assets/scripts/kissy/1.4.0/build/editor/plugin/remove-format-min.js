/*
Copyright 2013, KISSY v1.40dev
MIT Licensed
build time: Oct 25 16:46
*/
KISSY.add("editor/plugin/remove-format",function(c,d,e){function b(){}c.augment(b,{pluginRenderUI:function(a){e.init(a);a.addButton("removeFormat",{tooltip:"\u6e05\u9664\u683c\u5f0f",listeners:{click:function(){a.execCommand("removeFormat")}},mode:d.Mode.WYSIWYG_MODE})}});return b},{requires:["editor","./remove-format/cmd","./button"]});