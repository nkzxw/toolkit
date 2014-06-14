/*
 * ***************************************************************************
 * Effect:DOM Package
 * Author:ifany
 * Date:2011.09
 * ***************************************************************************
 */
//Determine when the DOM has finished loading.
//eg: domReady(function(){ ...do something... }
function domReady(f){
    //If the DOM installation is completed, immediately perform the function.
    if (domReady.done) 
        return f();
    
    //If a function has been added to.
    if (domReady.timer) {
        //Then add it to the list of functions to be performed.
        domReady.ready.push(f);
    }
    else {
        //Installation is completed for the page to bind an event.
        window.onload = isDOMReady;
        //addEvent(window, "load", isDOMReady);
        
        //Array initialization function to be performed.
        domReady.ready = [f];
        
        //DOM as soon as possible to check whether the available.
        domReady.timer = setInterval(isDOMReady, 13);
    }
}

//Check whether the operational DOM.
function isDOMReady(){
    //If we can determine the DOM is available, ignore.
    if (domReady.done) 
        return false;
    
    //Check the availability of a number of functions and elements.
    if (document && document.getElementsByTagName && document.getElementById && document.body) {
        //If available, we can stop checking.
        clearInterval(domReady.timer);
        domReady.timer = null;
        
        //Perform all the functions are waiting.
        for (var i = 0; i < domReady.ready.length; i++) {
            domReady.ready[i]();
        }
        //We have done this record.
        domReady.ready = null;
        domReady.done = true;
    }
}


//Package through the "ID" to obtain elements.
//eg:ID('id')
function ID(id){
    if (typeof id != "undefined" && typeof id === "string") {
        return document.getElementById(id);
    }
    return null;
}

//Label positioned to rely on HTML DOM document elements.
//eg:tag("h3")  tag("h3",ID('id'))
function tag(name, elem){
    return (elem || document).getElementsByTagName(name);
}

//Package through the "class" to obtain elements.
//eg:getByClass('a'); getByClass('b','wrap'); getByClass('b',null,'strong'); getByClass('b','wrap','strong')
function getByClass(name, elem, tag){
    if (elem) {
        elem = typeof elem == 'string' ? document.getElementById(elem) : elem;
    }
    else {
        elem = document.body;
    }
    var els = elem.getElementsByTagName(tag || "*"), arr = [];
    for (var i = 0, len = els.length; i < len; i++) {
        for (var j = 0, k = els[i].className.split(" "), l = k.length; j < l; j++) {
            if (k[j] == name) {
                arr.push(els[i]);
                break;
            }
        }
    }
    return arr;
}

//Package through the "hasClass(elem,name)" to add className.
//eg:hasClass(ID('d'),'c')
function hasClass(elem, name){
    return elem.className.match(new RegExp('(\\s|^)' + name + '(\\s|$)'));
}

//Package through the "addClass(elem,name)" to add className.
//eg:addClass(ID('d'),'c')
function addClass(elem, name){
    if (!this.hasClass(elem, name)) {
        this.className !== '' ? elem.className = name : elem.className += " " + name;
    }
}

//Package through the "removeClass(elem,name)" to add className.
//eg:removeClass(ID('d'),'c')
function removeClass(elem, name){
    if (hasClass(elem, name)) {
        var reg = new RegExp('(\\s|^)' + name + '(\\s|$)');
        elem.className = elem.className.replace(reg, ' ')
    }
}

//Find related elements 'elem' previous sibling element.
function prev(elem){
    do {
        elem = elem.previousSibling;
    }
    while (elem && elem.nodeType != 1)
    {
        return elem;
    }
}

//Find related elements 'elem' next sibling element.
function next(elem){
    do {
        elem = elem.nextSibling;
    }
    while (elem && elem.nodeType != 1)
    return elem;
}

//Find related elements 'elem' parent sibling element.
function parent(elem, num){
    num = num || 1;
    for (var i = 0; i < num; i++) 
        if (elem != null) 
            elem = elem.parentNode;
    return elem;
}


//Find related elements 'elem' previous sibling element.
//eg:elem.prev()
if (!document.all) {
    //让firefox支持innerText.
    //eg: elem.innerText
    HTMLElement.prototype.__defineGetter__("innerText", function(){
        var anyString = "";
        
        var childS = this.childNodes;
        for (var i = 0; i < childS.length; i++) {
            if (childS[i].nodeType == 1) 
                anyString += childS[i].tagName == "BR" ? '\n' : childS[i].innerText;
            else 
                if (childS[i].nodeType == 3) 
                    anyString += childS[i].nodeValue;
        }
        return anyString;
    });
    
    //Find elements 'elem' prev child.
    //eg:elem.prev()  
    HTMLElement.prototype.prev = function(){
        var elem = this;
        do {
            elem = elem.previousSibling;
        }
        while (elem && elem.nodeType != 1)
        {
            return elem;
        }
    }
    
    //Find elements 'elem' next child.
    //eg:elem.next()
    HTMLElement.prototype.next = function(){
        var elem = this;
        do {
            elem = elem.nextSibling;
        }
        while (elem && elem.nodeType != 1)
        return elem;
    }
    
    //Find elements 'elem' first child.
    //eg:elem.first()
    HTMLElement.prototype.first = function(){
        var elem = this;
        elem = elem.firstChild;
        return elem && elem.nodeType != 1 ? next(elem) : elem;
    }
    
    //Find elements 'elem' last child.
    //eg:elem.last()
    HTMLElement.prototype.last = function(){
        var elem = this;
        elem = elem.lastChild;
        return elem && elem.nodeType != 1 ? prev(elem) : elem;
    }
    
    //Find elements 'elem' of parent element.
    //eg:elem.parent()
    HTMLElement.prototype.parent = function(){
        var elem = this;
        var num = this.num;
        num = num || 1;
        for (var i = 0; i < num; i++) 
            if (elem != null) 
                elem = elem.parentNode;
        return elem;
    }
    
    
}
else {
    var domMethod = {
        //设置扩展dom的方法
        extendDom: function(name, fn){
        
            if (!document.all) { //除了ie而外的浏览器都能够访问到HTMLElement这个类
                HTMLElement.prototype[name] = fn;
            }
            else {
                var _createElement = document.createElement;
                document.createElement = function(tag){
                    var elem = _createElement(tag);
                    elem[name] = fn;
                    return elem;
                }
                var _getElementById = document.getElementById;
                document.getElementById = function(id){
                    var elem = _getElementById(id);
                    elem[name] = fn;
                    return elem;
                }
                var _getElementsByTagName = document.getElementsByTagName;
                document.getElementsByTagName = function(tag){
                    var arr = _getElementsByTagName(tag);
                    for (var i = 0; i < arr.length; i++) {
                        arr[i][name] = fn;
                    }
                    return arr;
                }
            }
        }
    }
    
    //Find elements 'elem' prev child.
    //eg:elem.prev() 
    domMethod.extendDom('prev', function(){
        var elem = this;
        do {
            elem = elem.previousSibling;
        }
        while (elem && elem.nodeType != 1)
        {
            return elem;
        }
    });
    //Find elements 'elem' next child.
    //eg:elem.next() 
    domMethod.extendDom('next', function(){
        var elem = this;
        do {
            elem = elem.nextSibling;
        }
        while (elem && elem.nodeType != 1)
        return elem;
    });
    //Find elements 'elem' first child.
    //eg:elem.first() 
    domMethod.extendDom('first', function(){
        var elem = this;
        elem = elem.firstChild;
        return elem && elem.nodeType != 1 ? next(elem) : elem;
    });
    //Find elements 'elem' last child.
    //eg:elem.last() 
    domMethod.extendDom('last', function(){
        var elem = this;
        elem = elem.lastChild;
        return elem && elem.nodeType != 1 ? prev(elem) : elem;
    });
    //Find elements 'elem' parent child.
    //eg:elem.parent() 
    domMethod.extendDom('parent', function(){
        var elem = this;
        var num = this.num;
        num = num || 1;
        for (var i = 0; i < num; i++) 
            if (elem != null) 
                elem = elem.parentNode;
        return elem;
    });
    
}

//Create a new DOM elements common function.
//eg:create("div")
function create(elem){
    var newElem = document.createElementNS ? document.createElementNS('http://www.w3.org/1999/xhtml', elem) : document.createElement(elem);
    return newElem;
}

//Get and set element value of the property.
//eg: attr(img,'src','123.gif');


/*-------Inject html into the DOM----start----*/
//Inserted before the element in another element.
//eg: iBefore(tag('ol')[0].last(),"<h3>I'm here!</h3>")
function iBefore(parent, newNode, target){
    //Check providing parent node parameters.
    if (newNode == null) {
        newNode = target;
        target = parent;
        parent = target.parentNode;
    }
    
    //Obtain a new array of elements.
    var elems = checkElem(newNode);
    
    //Backward through the array.
    //Because forward into Elements.
    for (var i = elems.length - 1; i >= 0; i--) {
        parent.insertBefore(elems[i], target);
    }
}

//Another element to append a child element.
//iAppend(tag('ol')[0],"<li>Mouse trap</li>");
function iAppend(parent, elem){
    //Obtain a new array of elements.
    var elems = checkElem(elem);
    //All elements are appended to.
    for (var i = 0; i < elems.length; i++) {
        parent.appendChild(elems[i]);
    }
}


function checkElem(elem){
    var r = [];
    //If the parameter is not an array, then the cast.
    if (elem.constructor != Array) {
        elem = [elem];
    }
    
    for (var i = 0; i < elem.length; i++) {
        //If a string.
        if (elem[i].constructor == String) {
            //A temporary Offline Storage element to HTML.
            var div = document.createElement('div');
            //Into HTML, convert the DOM structure.
            div.innerHTML = elem[i];
            for (var j = 0; j < div.childNodes.length; j++) {
                r[r.length] = div.childNodes[j];
            }
        }
        else 
            if (elem[i].length) {
                //Assumption is that an array of DOM nodes.
                for (var j = 0; j < elem[i].length; i++) {
                    r[r.length] = elem[i][j];
                }
            }
            else {
                //Otherwise, assume that is a DOM node.
                r[r.length] = elem[i];
            }
    }
    return r;
}

//
//eg:insertAfter(create('li'),tag('ul')[0].last())
function insertAfter(newChild, refChild){
    var parElem = refChild.parentNode;
    if (parElem.lastChild == refChild) {
        refChild.appendChild(newChild);
    }
    else {
        parElem.insertBefore(newChild, refChild.nextSibling);
    }
}


/*-------Inject html into the DOM----end------*/
//Delete a single DOM node.
//eg: remove(ID('mice'))
function remove(elem){
    if (elem) {
        elem.parentNode.removeChild(elem);
    }
}

//Deleting a DOM element all child nodes.
//eg: empty(tag('ol')[0])
function empty(elem){
    while (elem.firstChild) {
        remove(elem.firstChild);
    }
}

/*
 * ******************************************************************************
 * Effect:Generic function
 * Author:ifany
 * Date:2011.09
 *****************************************************************************
 */
//Remove spaces in String with three function "lTrim(str),rTrim,Trim(str)".
//Remove the spaces left.     
function lTrim(str){
    var i;
    for (i = 0; i < str.length; i++) {
        if (str.charAt(i) != " ") 
            break;
    }
    str = str.substring(i, str.length);
    return str;
    var i;
    for (i = 0; i < str.length; i++) {
        if (str.charAt(i) != " ") {
            break;
        }
    }
    str = str.substring(i, str.length);
    return str;
}

//Remove the spaces right.  
function rTrim(str){
    var i;
    for (i = str.length - 1; i >= 0; i--) {
        if (str.charAt(i) != " ") {
            break;
        }
    }
    str = str.substring(0, i + 1);
    return str;
}

//Remove the spaces both.   
function Trim(str){
    return lTrim(rTrim(str));
}

/*
 * ******************************************************************************
 * Effect:Event Package
 * Author:ifany
 * Date:2011.09
 *****************************************************************************
 */
//Generic function to stop event bubbling.
//eg: function fname(e){...stopBubble(e);}
function stopBubble(e){
    if (e && e.stopPropagation) {
        //W3c
        e.stopPropagation();
    }
    else {
        //IE
        window.event.cancelBubble = true;
    }
}

//Prevent browser default behavior of the generic function.
//eg: function fname(e){...stopDefault(e);}
function stopDefault(e){
    if (e && e.preventDefault) {
        //W3C
        e.preventDefault();
    }
    else {
        //IE
        window.event.returnValue = false;
    }
}

/*-------------addEvent / removeEvent Library----start----------------*/
/*eg:
 *   addEvent(window,'load',inCome); function inCome(){....};
 *   removeEvent(window,'load',inCome);
 */
// written by Dean Edwards, 2005
// with input from Tino Zijdel, Matthias Miller, Diego Perini

// http://dean.edwards.name/weblog/2005/10/add-event/

function addEvent(element, type, handler){
    if (element.addEventListener) {
        element.addEventListener(type, handler, false);
    }
    else {
        // assign each event handler a unique ID
        if (!handler.$$guid) 
            handler.$$guid = addEvent.guid++;
        // create a hash table of event types for the element
        if (!element.events) 
            element.events = {};
        // create a hash table of event handlers for each element/event pair
        var handlers = element.events[type];
        if (!handlers) {
            handlers = element.events[type] = {};
            // store the existing event handler (if there is one)
            if (element["on" + type]) {
                handlers[0] = element["on" + type];
            }
        }
        // store the event handler in the hash table
        handlers[handler.$$guid] = handler;
        // assign a global event handler to do all the work
        element["on" + type] = handleEvent;
    }
};
// a counter used to create unique IDs
addEvent.guid = 1;

function removeEvent(element, type, handler){
    if (element.removeEventListener) {
        element.removeEventListener(type, handler, false);
    }
    else {
        // delete the event handler from the hash table
        if (element.events && element.events[type]) {
            delete element.events[type][handler.$$guid];
        }
    }
};

function handleEvent(event){
    var returnValue = true;
    // grab the event Object (IE uses a global event Object)
    event = event || fixEvent(((this.ownerDocument || this.document || this).parentWindow || window).event);
    // get a reference to the hash table of event handlers
    var handlers = this.events[event.type];
    // execute each event handler
    for (var i in handlers) {
        this.$$handleEvent = handlers[i];
        if (this.$$handleEvent(event) === false) {
            returnValue = false;
        }
    }
    return returnValue;
};

function fixEvent(event){
    // add W3C standard event methods
    event.preventDefault = fixEvent.preventDefault;
    event.stopPropagation = fixEvent.stopPropagation;
    return event;
};
fixEvent.preventDefault = function(){
    this.returnValue = false;
};
fixEvent.stopPropagation = function(){
    this.cancelBubble = true;
};
/*-------------addEvent / removeEvent Library-----end----------------*/

/*
 * ******************************************************************************
 * Effect:CSS Package
 * Author:ifany
 * Date:2011.09
 *****************************************************************************
 */

// Dynamic load CSS files ,with a function "loadCSS(file,fileID)";
// eg:loadCSS('newh1.css',"cssh1");
function loadCSS(file, fileID){
    var cssTag = fileID?document.getElementById(fileID):null ;
    var head = document.getElementsByTagName("head").item(0);
    if(cssTag){head.removeChild(cssTag);}
    var newCSS = document.createElement('link');
    newCSS.href = file ;
    newCSS.rel = 'stylesheet' ;
    newCSS.type = 'text/css' ;
    if(fileID){newCSS.id = fileID;}
    head.appendChild(newCSS);
}

//Gets the specified element (elem) style attributes (name).
//eg:getStyle(tag('h1')[0],'color')
function getStyle(elem, name){
    if (elem.style[name]) {
        //If the property exists in the style [], then return its value directly.
        return elem.style[name];
    }
    else 
        if (elem.currentStyle) {
            //IE 
            return elem.currentStyle[name];
        }
        else 
            if (document.defaultView && document.defaultView.getComputedStyle) {
                //W3C
                //
                name = name.replace(/([A-Z])/g, "-$1");
                name = name.toLowerCase();
                var s = document.defaultView.getComputedStyle(elem, '');
                return s && s.getPropertyValue(name);
            }
            else {
                //Other browsers.
                return null;
            }
}

/*----------------------Element position----start-------------- -----*/
//Element relative to the X position of the entire document.
//eg:pageX(tag('h1')[0])
function pageX(elem){
    //如果offsetParent是元素的父亲，那么提前退出；
    //否则，我们需要找到元素和元素的父亲相对于整个页面位置，并计算他们之间的差。
    var pageXW = elem.offsetParent ? elem.offsetLeft - pageX(elem.offsetParent) : elem.offsetLeft;
   
	return pageXW;
}

//Element relative to the Y position of the entire document.
//eg:pageY(tag('h1')[0])
function pageY(elem){
    //如果offsetParent是元素的父亲，那么提前退出；
    //否则，我们需要找到元素和元素的父亲相对于整个页面位置，并计算他们之间的差。
    var pageYH = elem.offsetParent ? elem.offsetTop - pageY(elem.offsetParent) : elem.offsetTop;
	
	return pageYH;
}

//Get the element relative to the horizontal position of the father.
function parentX(elem){
    return elem.parentNode == elem.offsetParent ? elem.offsetLeft : pageX(elem) - pageX(elem.parentNode);
}

//Get the element relative to the vertical position of the father
function parentY(elem){
    return elem.parentNode == elem.offsetParent ? elem.offsetTop : pageY(elem) - pageY(elem.parentNode);
}

//Find left position of elements.
function posX(elem){
    //Get the ultimate style and get the value.
    return parseInt(getStyle(elem, 'left'));
}

//Find the top position of elements.
function posY(elem){
    //Get the ultimate style and get the value.
    return parseInt(getStyle(elem, 'top'));
}

//Set the left position of elements.
function setX(elem, pos){
    //Set of CSS using pixels 'left' properties.
    elem.style.left = pos + 'px';
}

//Set the top position of elements.
function setY(elem, pos){
    //Set of CSS using pixels 'left' properties.
    elem.style.top = pos + 'px';
}

//add the left position of elements with 'pos' pxel 
function addX(elem, pos){
    setX(elem, posX(elem) + pos);
}

//add the top position of elements with 'pos' pxel 
function addY(elem, pos){
    setY(elem, posY(elem) + pos);
}

/*----------------------Element position----end-------------- -----*/
/*----------------------Element size----start---------------------*/
//To obtain the height in style of element.
function getHeight(elem){
    return parseInt(getStyle(elem, 'height'));
}

//To obtain the width in style of element
function getWidth(elem){
    return parseInt(getStyle(elem, 'width'));
}

//get the element's complete or may height, Include 'padding' 'border' 
function fullHeight(elem){
    if (getStyle(elem, 'display') != 'none') {
        //If the element pattern is: display: block;
        return elem.offsetHeight || getHeight(elem);
    }
    else {
        //If the element pattern is: display: none;
        var old = resetCSS(elem, {
            display: '',
            visibility: 'hidden',
            position: 'absolute'
        });
        //Use 'clientHeight' to find out the full height of the element, if you do not take effect, use the 'getHeight' function.
        var h = elem.clientHeight || getHeight(elem);
        //Do not forget to restore the original properties of CSS.
        resetCSS(elem, old);
        //Back to the full height of the elements.
        return h;
    }
}

//get the element's complete or may width,Include 'padding' 'border' 
function fullWidth(elem){
    if (getStyle(elem, 'display') != 'none') {
        //If the element pattern is: display: block;
        return elem.offsetWidth || getWidth(elem);
    }
    else {
        //If the element pattern is: display: none;
        var old = resetCSS(elem, {
            display: '',
            visibility: 'hidden',
            position: 'absolute'
        });
        //Use 'clientWidth' to find out the full height of the element, if you do not take effect, use the 'getWidth' function
        var w = elem.clientWidth || getWidth(elem);
        //Do not forget to restore the original properties of CSS.
        resetCSS(elem, old);
        //Back to the full width of the elements.
        return w;
    }
}

//Set of CSS properties of a function, it can be restored to their original settings.
function resetCSS(elem, prop){
    var old = {};
    //Through each attribute.
    for (var i in prop) {
        //Record the old property value.
        old[i] = elem.style[i];
        //Set new property value.
        elem.style[i] = prop[i];
    }
    //Return to the changed set of values​​, a function reserved for use restoreCSS.
    return old;
}

//Restore the original CSS property value, a function of side-effects house resetCSS function.
function restoreCSS(elem, prop){
    //Reset all properties to restore their original values.
    for (var i in prop) {
        elem.style[i] = prop[i];
    }
}

/*----------------------Element size----end---------------------*/
/*-------------Visibility of the elements----start----------------*/
//Use display to hide element function.
function hide(elem){
    //Identify the elements of the display property's current value.
    var curDisplay = getStyle(elem, 'display');
    if (curDisplay != 'none') {
        elem.$oldDisplay = curDisplay;
    }
    //hide element.
    elem.style.display = 'none';
}

//Use display to show element function.
function show(elem){
    //Recovery element of the property "display" of the original value, 
    //if not record the original value, use the "block" value.
    elem.style.display = elem.$oldDisplay || 'block';
}

//Set the transparency of elements (level values ​​range from 0-100).
//elem元素一定要设置width样式属性，ie6,7下才生效.
function setOpacity(elem, level){
    if (document.all) {
        //IE
        elem.style.filter = 'alpha(opacity=' + level + ')';
    }
    else {
        //W3C
        elem.style.opacity = level / 100;
    }
}

/*-------------Visibility of the elements----end----------------*/
/*-------------Animation----start----------------*/

/*-------------Animation-----end-----------------*/
/*-------------Browser-related----start----------------*/
//Get the horizontal position of the cursor.(不兼容IE，待解决)
function getX(e){
    //Standardized event Object.
    e = e || window.event;
    //W3C browser to check the location, then check the location of the IE.
    return e.pageX || e.clientX + document.body.scrollLeft;
}

//Get the Vertical position of the cursor.(不兼容IE，待解决)
function getY(e){
    //Standardized event Object.
    e = e || window.event;
    //W3C browser to check the location, then check the location of the IE.
    return e.pageY || e.clientY + document.body.scrollTop;
}

//Returns the page's height (an increase when the content may change).
function pageHeight(){
    return document.body.scrollHeight;
}

//Returns the page's width.
function pageWidth(){
    return document.body.scrollWidth;
}

//Determine the location of the browser function of the horizontal scroll.
function scrollX(){
    //A shortcut, use the IE6 / 7 strict mode.
    var de = document.documentElement;
    return self.pageXOffset || (de && de.scrollLeft) || document.body.scrollLeft;
}

//Determine the location of the browser function of the vertical scroll.(不兼容IE，待解决)
function scrollY(){
    //A shortcut, use the IE6 / 7 strict mode.
    var de = document.documentElement;
    return self.pageYOffset || (de && de.scrollTop) || document.body.scrollTop;
}

//Get the width of the viewport.
function windowWidth(){
    //A shortcut, use the IE6 / 7 strict mode.
    var de = document.documentElement;
    return self.innerWidth || (de && de.clientWidth) || document.body.clientWidth;
}

//Get the height of the viewport.
function windowHeight(){
    //A shortcut, use the IE6 / 7 strict mode.
    var de = document.documentElement;
    return self.innerHeight || (de && de.clientHeight) || document.body.clientHeight;
}

/*-------------Browser-related-----end-----------------*/

function fadeIn( elem, to, speed ) {
    // Start the opacity at  0
    setOpacity( elem, 0 );

    // Show the element (but you can see it, since the opacity is 0)
    show( elem );

    // We�re going to do a 20 �frame� animation that takes
    // place over one second
    for ( var i = 0; i <= 100; i += 5 ) {
        // A closure to make sure that we have the right �i�
        (function(){
        		var opacity = i;

            // Set the timeout to occur at the specified time in the future
            setTimeout(function(){

                // Set the new opacity of the element
                setOpacity( elem, ( opacity / 100 ) * to );

            }, ( i + 1 ) * speed );
        })();
    }
}

function fadeOut( elem, to, speed ) {
    // Start the opacity at 1
    //setOpacity( elem, 1 );

    // We�re going to do a 20 �frame� animation that takes
    // place over one second
    for ( var i = 0; i < 100; i += 5 ) {
        // A closure to make sure that we have the right �i�
        (function(){
        		var opacity = i;

            // Set the timeout to occur at the specified time in the future
            setTimeout(function(){

                // Set the new opacity of the element
                setOpacity( elem, 100 - opacity );

                if ( opacity == 95 )
                    hide( elem );

            }, ( i + 1 ) * speed );
        })();
    }
}

