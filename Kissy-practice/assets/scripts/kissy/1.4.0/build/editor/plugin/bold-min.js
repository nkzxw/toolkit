/*
Copyright 2013, KISSY v1.40dev
MIT Licensed
build time: Oct 25 16:41
*/
KISSY.add("editor/plugin/bold",function(c,g,e,f){function d(){}c.augment(d,{pluginRenderUI:function(a){f.init(a);a.addButton("bold",{cmdType:"bold",tooltip:"\u7c97\u4f53 "},e.Button);a.docReady(function(){a.get("document").on("keydown",function(b){b.ctrlKey&&b.keyCode==c.Node.KeyCode.B&&(a.execCommand("bold"),b.preventDefault())})})}});return d},{requires:["editor","./font/ui","./bold/cmd"]});
