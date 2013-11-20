/*
 * ************************************************************
 * Effect:focusImages.js
 * Author:ifany
 * Date:2011.10.18
 * ************************************************************
 */
// 定义焦点图通用函数 “focusImages(elem,Sequence,time,handle)”；
// elem ：为焦点图的根元素集合；
// Sequence :精确到单一焦点图；
// time :焦点图轮播间隔时间；
// handle :触发焦点图顺序的事件，可以是‘click’, 'mouseover' ...;
function focusImages(elem,Sequence,time,handle){
   var focusParent = getByClass(elem)[Sequence],
       fUl = getByClass("pic", focusParent)[0],
       imgLists = tag("li", fUl);
   var num = getByClass("num",focusParent)[0],
       numLists = tag("span",num);
   var index = 0 ;
   function autoFocusimg(){
       for(var i=0,len= numLists.length; i<len; i++){
           imgLists[i].style.display = "none" ;
           numLists[i].className = '' ;
       }
       imgLists[index].style.display = "" ;
       numLists[index].className = "cur" ;
       index = index==len-1?0:index+1 ;
   }
   autoFocusimg(index);
   var autoImg = setInterval(autoFocusimg,time);
   addEvent(fUl, 'mouseover', function(){
       clearInterval(autoImg);
   });
   addEvent(fUl, 'mouseout', function(){
       autoImg = setInterval(autoFocusimg, time);
   });
    for(var j=0; j<numLists.length; j++){
         numLists[j]._index = j ;
        addEvent(numLists[j], handle, function(){
            autoFocusimg(this._index);
        });
    }
}