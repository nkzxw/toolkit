/*
Copyright 2013, KISSY v1.40dev
MIT Licensed
build time: Sep 18 00:20
*/
KISSY.add("event/base/utils",function(e){function f(a){if(0>a.indexOf("."))return[a,""];var b=a.match(/([^.]+)?(\..+)?$/),a=[b[1]];(b=b[2])?(b=b.split(".").sort(),a.push(b.join("."))):a.push("");return a}var d,c;return{splitAndRun:d=function(a,b){e.isArray(a)?e.each(a,b):(a=e.trim(a),-1==a.indexOf(" ")?b(a):e.each(a.split(/\s+/),b))},normalizeParam:function(a,b,c){var d=b||{},d="function"===typeof b?{fn:b,context:c}:e.merge(d),b=f(a),a=b[0];d.groups=b[1];d.type=a;return d},batchForType:function(a,
b){var c=e.makeArray(arguments),f=c[2+b];f&&"object"==typeof f?e.each(f,function(d,f){var e=[].concat(c);e.splice(0,2);e[b]=f;e[b+1]=d;a.apply(null,e)}):d(f,function(d){var e=[].concat(c);e.splice(0,2);e[b]=d;a.apply(null,e)})},fillGroupsForEvent:function(a,b){var d=f(a),e=d[1];e&&(e=c(e),b._ks_groups=e);b.type=d[0]},getGroupsRe:c=function(a){return RegExp(a.split(".").join(".*\\.")+"(?:\\.|$)")}}});
KISSY.add("event/base/object",function(e,f){function d(){this.timeStamp=e.now();this.currentTarget=this.target=f}var c=function(){return!1},a=function(){return!0};d.prototype={constructor:d,isDefaultPrevented:c,isPropagationStopped:c,isImmediatePropagationStopped:c,preventDefault:function(){this.isDefaultPrevented=a},stopPropagation:function(){this.isPropagationStopped=a},stopImmediatePropagation:function(){this.isImmediatePropagationStopped=a;this.stopPropagation()},halt:function(a){a?this.stopImmediatePropagation():
this.stopPropagation();this.preventDefault()}};return d});
KISSY.add("event/base/observer",function(e,f){function d(c){e.mix(this,c)}d.prototype={constructor:d,equals:function(c){var a=this;return!!e.reduce(a.keys,function(b,d){return b&&a[d]===c[d]},1)},simpleNotify:function(c,a){var b;b=this.fn.call(this.context||a.currentTarget,c,this.data);this.once&&a.removeObserver(this);return b},notifyInternal:function(c,a){var b=this.simpleNotify(c,a);!1===b&&c.halt();return b},notify:function(c,a){var b=c._ks_groups;return b&&(!this.groups||!this.groups.match(b))?
f:this.notifyInternal(c,a)}};return d});
KISSY.add("event/base/observable",function(e){function f(d){this.currentTarget=null;e.mix(this,d);this.reset()}f.prototype={constructor:f,hasObserver:function(){return!!this.observers.length},reset:function(){this.observers=[]},removeObserver:function(d){var c,a=this.observers,b=a.length;for(c=0;c<b;c++)if(a[c]==d){a.splice(c,1);break}this.checkMemory()},checkMemory:function(){},findObserver:function(d){var c=this.observers,a;for(a=c.length-1;0<=a;--a)if(d.equals(c[a]))return a;return-1}};return f});
KISSY.add("event/base",function(e,f,d,c,a){return{Utils:f,Object:d,Observer:c,Observable:a}},{requires:["./base/utils","./base/object","./base/observer","./base/observable"]});
