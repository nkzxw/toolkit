/*
 * ************************************************************
 * Effect:imgLibrary.js
 * Author:ifany
 * Date:2011.10
 * ************************************************************
*/
var curImage = null;
window.onload = function(){
    //建立整个图库的支架
    var gallery = create('div');
    gallery.id = 'gallery' ;
    var galleryHTML = '<div id="gallery_image"></div> ' ;
    galleryHTML += '<div id="gallery_prev"><a href="">&laquo; Prev</a></div>';
    galleryHTML += '<div id="gallery_next"><a href="">Next &raquo;</a></div>';
    galleryHTML += '<div id="gallery_title"></div>';
    gallery.innerHTML = galleryHTML;
    iAppend(document.body,gallery);

    //为“prev”,"next"添加单击事件
    addEvent(ID("gallery_next"),'click',nextImage);
    addEvent(ID("gallery_prev"),'click',prevImage);

    var g = getByClass("gallery",null,"ul");
    for(var i=0; i<g.length; i++){
        var link = tag("a", g[i]);
        for(var j=0; j<link.length; j++){
            addEvent(link[j], 'click', function(e){
                //阻止图片链接发生跳转
                stopDefault(e);
                //显示遮盖层
                showOverlay();
                //在图库内显示图片
                showImage(this.parent());

            })
        }
        //在图库内加入幻灯片导航
            addSlideShow(g[i]);
    }

    //showOverlay()
    var overlay = create('div');
    overlay.id = "overlay" ;
    addEvent(overlay , 'click', hideOverlay);
    document.body.appendChild(overlay);
    function showOverlay(){
          var over = ID('overlay');
        over.style.height = pageHeight() + 'px' ;
        over.style.width = pageWidth() + 'px' ;

        fadeIn(over, 50, 10);
    }

    function hideOverlay(){
        curImage = null;
        hide(ID("overlay"));
        hide(ID("gallery"));
    }

    //showImage()
    function showImage(cur){
         curImage = cur;

        var img = ID('gallery_image');
        if(img.first()){img.removeChild(img.first());}
        img.appendChild(cur.first().cloneNode(true));
        ID('gallery_title').innerHTML = cur.firstChild.firstChild.alt;
        var gallery = ID('gallery');
        show(gallery);
        !next(cur)?hide(ID('gallery_next')):show(ID('gallery_next'));
        !prev(cur)?hide(ID('gallery_prev')):show(ID('gallery_prev'));
        fadeIn(gallery, 100, 10);
        adjust();
    }

    function adjust(){
        var obj = ID('gallery');
        if(!obj) return;
        var w = getWidth(obj);
        var h = getHeight(obj);

        var t = scrollY() + (windowHeight()/2) - (h/2) ;
        if(t < 0) t=0;
        var L = scrollX() + (windowWidth()/2) - (w/2) ;
        if(L < 0) L=0;
        setY(obj, t);
        setX(obj, L);
    }

    window.onresize = document.onscroll = adjust;

    function prevImage(e){
        stopDefault(e);
        showImage(prev(curImage));
    }
    function nextImage(e){
        stopDefault(e);
        showImage(next(curImage));
    }


    function addSlideShow(elem){
       var slider = create('div');
        slider.className = 'slideshow';

        var span = create('span');
        span.innerHTML = g[i].title;
        iAppend(slider,span);

        var a = create('a');
        a.href = '';
        a.innerHTML = "&raquo; View as a Slideshow"

        addEvent(a, 'click', function(e){
            stopDefault(e);
            startShow(this.parent().next());
        })

        iAppend(slider,a);
        iBefore(elem.parent(),slider,elem);
    }

    function startShow(obj){
        var elem = tag('li', obj);
        var gallery = ID('gallery');
        for(var i=0; i<elem.length; i++) new function(){
            var cur = elem[i];
            setTimeout(function(){
                showImage(cur);
                setTimeout(function(){
                    fadeOut(gallery, 0, 10);
                },3500)
            },i*5000)
        }
        setTimeout(hideOverlay(), 5000*elem.length);
        showOverlay();
    }
}