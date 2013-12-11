Ext.data.JsonP.KISSY_Component({"tagname":"class","name":"KISSY.Component","alternateClassNames":[],"members":[{"name":"HTML_PARSER","tagname":"property","owner":"KISSY.Component","id":"static-property-HTML_PARSER","meta":{"protected":true,"static":true}},{"name":"createComponent","tagname":"method","owner":"KISSY.Component","id":"method-createComponent","meta":{}}],"aliases":{},"files":[{"filename":"","href":""}],"component":false,"superclasses":[],"subclasses":[],"mixedInto":[],"mixins":[],"parentMixins":[],"requires":[],"uses":[],"html":"<div><div class='doc-contents'>\n</div><div class='members'><div class='members-section'><h3 class='members-title icon-property'>Properties</h3><div class='subsection'><div class='definedBy'>Defined By</div><h4 class='members-subtitle'>Static properties</h3><div id='static-property-HTML_PARSER' class='member first-child not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='KISSY.Component'>KISSY.Component</span><br/><a href='source/render4.html#KISSY-Component-static-property-HTML_PARSER' target='_blank' class='view-source'>view source</a></div><a href='#!/api/KISSY.Component-static-property-HTML_PARSER' class='name expandable'>HTML_PARSER</a> : <a href=\"#!/api/Object\" rel=\"Object\" class=\"docClass\">Object</a><span class=\"signature\"><span class='protected' >protected</span><span class='static' >static</span></span></div><div class='description'><div class='short'>Parse attribute from existing dom node.for example:\n    @example\n    Overlay.HTML_PARSER={\n         // el: root eleme...</div><div class='long'><p>Parse attribute from existing dom node.for example:\n    @example\n    Overlay.HTML_PARSER={\n         // el: root element of current component.\n         \"isRed\":function(el){\n             return el.hasClass(\"ks-red\");\n         }\n     };</p>\n</div></div></div></div></div><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-method'>Methods</h3><div class='subsection'><div id='method-createComponent' class='member first-child not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='KISSY.Component'>KISSY.Component</span><br/><a href='source/manager2.html#KISSY-Component-method-createComponent' target='_blank' class='view-source'>view source</a></div><a href='#!/api/KISSY.Component-method-createComponent' class='name expandable'>createComponent</a>( <span class='pre'>component, parent</span> ) : <a href=\"#!/api/Object\" rel=\"Object\" class=\"docClass\">Object</a><span class=\"signature\"></span></div><div class='description'><div class='short'>Create a component instance using json with xclass. ...</div><div class='long'><p>Create a component instance using json with xclass.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>component</span> : <a href=\"#!/api/Object\" rel=\"Object\" class=\"docClass\">Object</a>|<a href=\"#!/api/KISSY.Component.Control\" rel=\"KISSY.Component.Control\" class=\"docClass\">KISSY.Component.Control</a><div class='sub-desc'><p>Component's json notation with xclass attribute.</p>\n<ul><li><span class='pre'>xclass</span> : <a href=\"#!/api/String\" rel=\"String\" class=\"docClass\">String</a><div class='sub-desc'><p>Component to be newed 's xclass.</p>\n</div></li></ul></div></li><li><span class='pre'>parent</span> : <a href=\"#!/api/KISSY.Component.Control\" rel=\"KISSY.Component.Control\" class=\"docClass\">KISSY.Component.Control</a><div class='sub-desc'><p>Component From which new component generated will inherit prefixCls\nif component 's prefixCls is undefined.</p>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'><a href=\"#!/api/Object\" rel=\"Object\" class=\"docClass\">Object</a></span><div class='sub-desc'><p><a href=\"#!/api/KISSY.Component.Control\" rel=\"KISSY.Component.Control\" class=\"docClass\">KISSY.Component.Control</a></p>\n\n<p> for example:</p>\n\n<pre><code> create({\n     xclass:'menu',\n     children:[{\n         xclass:'menuitem',\n         content:\"1\"\n     }]\n })\n</code></pre>\n</div></li></ul></div></div></div></div></div></div></div>","meta":{}});