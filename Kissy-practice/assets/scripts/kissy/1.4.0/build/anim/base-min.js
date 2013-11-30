/*
Copyright 2013, KISSY v1.40
MIT Licensed
build time: Nov 6 11:53
*/
KISSY.add("anim/base/queue",function(b,f){function j(a,c,d){var c=c||h,e,b=f.data(a,i);!b&&!d&&f.data(a,i,b={});b&&(e=b[c],!e&&!d&&(e=b[c]=[]));return e}var i=b.guid("ks-queue-"+b.now()+"-"),h=b.guid("ks-queue-"+b.now()+"-"),g;return g={queueCollectionKey:i,queue:function(a,b,d){a=j(a,b);a.push(d);return a},remove:function(a,c,d){var e=j(a,c,1);e&&(d=b.indexOf(d,e),-1<d&&e.splice(d,1));e&&!e.length&&g.clearQueue(a,c);return e},clearQueues:function(a){f.removeData(a,i)},clearQueue:function(a,c){var c=
c||h,d=f.data(a,i);d&&delete d[c];b.isEmptyObject(d)&&f.removeData(a,i)},dequeue:function(a,b){var d=j(a,b,1);d&&(d.shift(),d.length||g.clearQueue(a,b));return d}}},{requires:["dom"]});
KISSY.add("anim/base/utils",function(b,f,j,i){var h=b.guid("ks-anim-unqueued-"+b.now()+"-"),g=b.guid("ks-anim-paused-"+b.now()+"-");return{saveRunningAnim:function(a){var c=a.node,d=f.data(c,h);d||f.data(c,h,d={});d[b.stamp(a)]=a},removeRunningAnim:function(a){var c=a.node,d=f.data(c,h);d&&(delete d[b.stamp(a)],b.isEmptyObject(d)&&f.removeData(c,h))},isAnimPaused:function(a){var c=f.data(a.node,g);return c?!!c[b.stamp(a)]:0},removePausedAnim:function(a){var c=a.node,d=f.data(c,g);d&&(delete d[b.stamp(a)],
b.isEmptyObject(d)&&f.removeData(c,g))},savePausedAnim:function(a){var c=a.node,d=f.data(c,g);d||f.data(c,g,d={});d[b.stamp(a)]=a},isAnimRunning:function(a){var c=f.data(a.node,h);return c?!!c[b.stamp(a)]:0},isElPaused:function(a){return(a=f.data(a,g))&&!b.isEmptyObject(a)},isElRunning:function(a){return(a=f.data(a,h))&&!b.isEmptyObject(a)},pauseOrResumeQueue:function(a,c,d){a=f.data(a,"resume"==d?g:h);a=b.merge(a);b.each(a,function(e){if(c===i||e.config.queue==c)e[d]()})},stopEl:function(a,c,d,e){d&&
(e===i?j.clearQueues(a):!1!==e&&j.clearQueue(a,e));a=f.data(a,h);a=b.merge(a);b.each(a,function(a){(e===i||a.config.queue==e)&&a.stop(c)})}}},{requires:["dom","./queue"]});
KISSY.add("anim/base",function(b,f,j,i,h){function g(e){g.superclass.constructor.call(this);i.Defer(this);this.config=e;var a=e.node;b.isPlainObject(a)||(a=f.get(e.node));this.node=this.el=a;this._backupProps={};this._propsData={}}var a=f.NodeType,c=b.noop,d={toggle:1,hide:1,show:1};b.extend(g,i,{on:function(a,b){"please use promise api of anim instead";"complete"==a?this.then(b):"end"==a?this.fin(b):"step"==a?this.progress(b):"not supported event for anim: "+a;return this},prepareFx:c,runInternal:function(){var e=
this,c=e.config,g=e.node,h,i=e._backupProps,l=e._propsData,k=c.to,p=c.delay||0,n=c.duration;j.saveRunningAnim(e);b.each(k,function(a,e){b.isPlainObject(a)||(a={value:a});l[e]=b.mix({delay:p,easing:c.easing,frame:c.frame,duration:n},a)});if(g.nodeType==a.ELEMENT_NODE){if(k.width||k.height)k=g.style,b.mix(i,{overflow:k.overflow,"overflow-x":k.overflowX,"overflow-y":k.overflowY}),k.overflow="hidden","inline"===f.css(g,"display")&&"none"===f.css(g,"float")&&(b.UA.ie?k.zoom=1:k.display="inline-block");
var o,m;m="none"===f.css(g,"display");b.each(l,function(a,b){h=a.value;if(d[h]){if("hide"==h&&m||"show"==h&&!m)return e.stop(!0),o=!1;i[b]=f.style(g,b);"toggle"==h?h=m?"show":"hide":"hide"==h?(a.value=0,i.display="none"):(a.value=f.css(g,b),f.css(g,b,0),f.show(g))}});if(!1===o)return}e.startTime=b.now();b.isEmptyObject(l)?(e.__totalTime=1E3*n,e.__waitTimeout=setTimeout(function(){e.stop(!0)},e.__totalTime)):(e.prepareFx(),e.doStart())},isRunning:function(){return j.isAnimRunning(this)},isPaused:function(){return j.isAnimPaused(this)},
pause:function(){this.isRunning()&&(this._runTime=b.now()-this.startTime,this.__totalTime-=this._runTime,j.removeRunningAnim(this),j.savePausedAnim(this),this.__waitTimeout?clearTimeout(this.__waitTimeout):this.doStop());return this},doStop:c,doStart:c,resume:function(){var a=this;a.isPaused()&&(a.startTime=b.now()-a._runTime,j.removePausedAnim(a),j.saveRunningAnim(a),a.__waitTimeout?a.__waitTimeout=setTimeout(function(){a.stop(!0)},a.__totalTime):(a.beforeResume(),a.doStart()));return a},beforeResume:c,
run:function(){var a;a=this.config.queue;!1===a?this.runInternal():(a=h.queue(this.node,a,this),1==a.length&&this.runInternal());return this},stop:function(a){var c=this.node,d=this.config.queue;if(this.isResolved()||this.isRejected())return this;this.__waitTimeout&&(clearTimeout(this.__waitTimeout),this.__waitTimeout=0);if(!this.isRunning()&&!this.isPaused())return!1!==d&&h.remove(c,d,this),this;this.doStop(a);j.removeRunningAnim(this);j.removePausedAnim(this);var g=this.defer;if(a){var i,l;b.isEmptyObject(i=
this._backupProps)||f.css(this.node,i);(l=this.config.complete)&&l.call(this);g.resolve([this])}else g.reject([this]);!1!==d&&(a=h.dequeue(c,d))&&a[0]&&a[0].runInternal();return this}});g.Utils=j;g.Q=h;return g},{requires:["dom","./base/utils","promise","./base/queue"]});
