var Drag = {

    obj : null,
    
    /* api 说明： 
    *     方法调用可以参考：http://www.dynamicdrive.com/dynamicindex11/domdrag/
    *         o 拖拽 Handle 
    *        oRoot 被拖拽 element  (可选, 默认不填 o为被拖拽对象  type=Object)
    *        minX, maxX, minY, maxY 限制拖拽范围 (可选,默认不填为全屏 type=int )
    *         bSwapHorzRef, bSwapVertRef 判断是否允许 横，纵向拖拽(可选,默认不填无限制 type=boolean )
    *     fXMapper(x), fYMapper(y)  为外置函数 拖拽效果体现前调用 (x,y) 为当前element位置(可选 type=Function）
    */
    init : function(o, oRoot, minX, maxX, minY, maxY, bSwapHorzRef, bSwapVertRef, fXMapper, fYMapper)
    {
        /* 拖拽事件 挂载  (本js 主线 生命周期 描述)
        *    1. 预定 o.onmousedown事件触发运行  Drag.start。
        *    2. 触发 element-> onmousedown->Drag.start
        *        2.1    先得到 element 当前"改变初"位置,记入到 o.lastMouseX ;o.lastMouseY，挂载Drag.obj,Darp.root 为当前 element。
        *        2.2     预定 document.onmousemove    = Drag.drag; document.onmouseup = Drag.end。
        *    3.  触发 document.onmousemove 运行 Drag.drag-> 拖拽效果体现。
        *    4.  触发 document.onmouseup 运行 Drag.end-> 挂载 document.onmousemove;document.onmouseup;Drag.obj取消。
        */
        o.onmousedown = Drag.start;
        
        //是否能 横，纵向拖拽
        o.hmode            = bSwapHorzRef ? false : true ;
        o.vmode            = bSwapVertRef ? false : true ;
        //挂载 o.root 
        o.root = oRoot && oRoot != null ? oRoot : o ;
        
        if (o.hmode  && isNaN(parseInt(o.root.style.left  ))) o.root.style.left   = "0px";
        if (o.vmode  && isNaN(parseInt(o.root.style.top   ))) o.root.style.top    = "0px";
        if (!o.hmode && isNaN(parseInt(o.root.style.right ))) o.root.style.right  = "0px";
        if (!o.vmode && isNaN(parseInt(o.root.style.bottom))) o.root.style.bottom = "0px";
        
        // 限定 移动范围
        o.minX    = typeof minX != 'undefined' ? minX : null;
        o.minY    = typeof minY != 'undefined' ? minY : null;
        o.maxX    = typeof maxX != 'undefined' ? maxX : null;
        o.maxY    = typeof maxY != 'undefined' ? maxY : null;

        o.xMapper = fXMapper ? fXMapper : null;
        o.yMapper = fYMapper ? fYMapper : null;
        
        /*自定义拖拽－事件添加（相当于我们在java中的 抽象类 中未实现的方法  比如：
        *    obj.onDrag = function(x, y) {
         *        scrolldiv.style.top=y * (-1) +"px";
        *    }
        */
        o.root.onDragStart    = new Function();
        o.root.onDragEnd    = new Function();
        o.root.onDrag        = new Function();
    },

    //由 function init >> o.onmousedown    = Drag.start;
    start : function(e)
    {
        //得到被拖拽 element
        var o = Drag.obj = this;
        e = Drag.fixE(e);
        
        //element 移动初位置 
        var y = parseInt(o.vmode ? o.root.style.top  : o.root.style.bottom);
        var x = parseInt(o.hmode ? o.root.style.left : o.root.style.right );
        //可能的外置函数调用
        o.root.onDragStart(x, y);
        //event 初位置 记入
        o.lastMouseX    = e.clientX;
        o.lastMouseY    = e.clientY;
        
        if (o.hmode) {
            if (o.minX != null)    o.minMouseX    = e.clientX - x + o.minX;
            if (o.maxX != null)    o.maxMouseX    = o.minMouseX + o.maxX - o.minX;
        } else {
            if (o.minX != null) o.maxMouseX = -o.minX + e.clientX + x;
            if (o.maxX != null) o.minMouseX = -o.maxX + e.clientX + x;
        }

        if (o.vmode) {
            if (o.minY != null)    o.minMouseY    = e.clientY - y + o.minY;
            if (o.maxY != null)    o.maxMouseY    = o.minMouseY + o.maxY - o.minY;
        } else {
            if (o.minY != null) o.maxMouseY = -o.minY + e.clientY + y;
            if (o.maxY != null) o.minMouseY = -o.maxY + e.clientY + y;
        }
        
        /*>>>>>>>>>>>比较关键的挂载<<<<<<<<<<<<<<
        *    
        *    使用 document.onmousemove 事件 而不使用 element的，是应为当拖动太快，可能会脱离element.
        */
        document.onmousemove    = Drag.drag;
        document.onmouseup        = Drag.end;

        return false;
    },

    //由 function start>> document.onmousemove    = Drag.drag;
    drag : function(e)
    {
        e = Drag.fixE(e);
        var o = Drag.obj;

        var ey    = e.clientY;
        var ex    = e.clientX;
        //得到 element 当前位置（vmode,hmode判断是否可以横纵向拖拽）
        var y = parseInt(o.vmode ? o.root.style.top  : o.root.style.bottom);
        var x = parseInt(o.hmode ? o.root.style.left : o.root.style.right );
        var nx, ny;
        
        if (o.minX != null) ex = o.hmode ? Math.max(ex, o.minMouseX) : Math.min(ex, o.maxMouseX);
        if (o.maxX != null) ex = o.hmode ? Math.min(ex, o.maxMouseX) : Math.max(ex, o.minMouseX);
        if (o.minY != null) ey = o.vmode ? Math.max(ey, o.minMouseY) : Math.min(ey, o.maxMouseY);
        if (o.maxY != null) ey = o.vmode ? Math.min(ey, o.maxMouseY) : Math.max(ey, o.minMouseY);
        
        //本js中 最主要的地方： 
        //得到 鼠标移动 向量 drap(x,y) = fun_drap:event(x,y) - fun_start:event(x,y)
        //并于 得到拖拽效果:  element(x,y) + drap(x,y) 
        nx = x + ((ex - o.lastMouseX) * (o.hmode ? 1 : -1));
        ny = y + ((ey - o.lastMouseY) * (o.vmode ? 1 : -1));

        if (o.xMapper)        nx = o.xMapper(y)
        else if (o.yMapper)    ny = o.yMapper(x)
        
        //效果体现
        Drag.obj.root.style[o.hmode ? "left" : "right"] = nx + "px";
        Drag.obj.root.style[o.vmode ? "top" : "bottom"] = ny + "px";
        Drag.obj.lastMouseX    = ex;
        Drag.obj.lastMouseY    = ey;
        //调用外置函数
        Drag.obj.root.onDrag(nx, ny);
        return false;
    },
    
    //由 function start>> document.onmouseup        = Drag.end;
    end : function()
    {
        document.onmousemove = null;
        document.onmouseup   = null;
        Drag.obj.root.onDragEnd(    parseInt(Drag.obj.root.style[Drag.obj.hmode ? "left" : "right"]), 
                                    parseInt(Drag.obj.root.style[Drag.obj.vmode ? "top" : "bottom"]));
        Drag.obj = null;
    },
    
    //跨 浏览器 得到 event
    fixE : function(e)
    {
        if (typeof e == 'undefined') e = window.event;
        if (typeof e.layerX == 'undefined') e.layerX = e.offsetX;
        if (typeof e.layerY == 'undefined') e.layerY = e.offsetY;
        return e;
    }
};