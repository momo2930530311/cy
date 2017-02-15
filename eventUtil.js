(function (window) {
    "use strict";
    var $ = eventUtil = {};
    //添加事件
    eventUtil.addHander = function (element, type, hander) {
            if (element.addEventListener) {
                element.addEventListener(type, hander, false);
            } else if (element.attachEvent) {
                element.attachEvent("on" + type, hander);
            } else {
                element['on' + type] = hander;
            }
        },

    //删除事件
    eventUtil.removeHander = function (element, type, hander) {
        if (element.removeEventListener) {
            element.removeEventListener(type, hander, false);
        } else if (element.detachEvent) {
            element.detachEvent("on" + type, hander);
        } else {
            element['on' + type] = null;
        }
    },

    //获取事件
    eventUtil.getEvent = function (event) {
        return event ? e : window.event;
    },

    //获取事件类型
    eventUtil.getType = function (event) {
        return event.type;
    },

    //获取事件目标
    eventUtil.getElement = function (event) {
        return event.target || event.srcElement;
    },

    //阻止事件的默认行为
    eventUtil.preventDefault = function (event) {
        if (event.preventDefault) {
            event.preventDefault();
        } else {
            event.returnValue = false;
        }
    },

    //阻止事件冒泡
    eventUtil.stopPropagation = function (event) {
        if (event.stopPropagation) {
            event.stopPropagation();
        } else {
            event.cancelBubble = true;
        }
    },
    
    //跨浏览器取得窗口左边和上边的位置
    eventUtil.getPos=function(leftPos,rightPos){
        leftPos=(typeof window.screenLeft=='number')?window.screenLeft:window.screenX;
        rightPos=(typeof window.screenTop=='number')?window.screenTop:window.screenY;
    },
    
    //取得页面视口的大小
    eventUtil.getRange=function(pageWidth,pageHeight){
        var range={
            pageWidth:window.innerWidth,
            pageHeight:window.innerHeight,
        };
        
        if(typeof range.pageWidth!="number"){
            //document.compatMode检查页面模式是否是标准模式
            if(document.compatMode=="CSS1Compat"){
                range.pageWidth=document.documentElement.clientWidth;
                range.pageHeight=document.documentElement.clientHeight;
            }else{
                range.pageWidth=document.body.clientWidth;
                range.pageHeight=document.body.clientHeight;
            }
        }
//        //将arguments转换成数组，返回
//            var argsArray = Array.prototype.slice.call(arguments);
//            return argsArray;
    //创建对象返回对象
        return range;
    }
    
    //寄生组合式继承
    eventUtil.inheritPrototype=function(subType,superType){
        var prototype=Object.create(superType.prototype);
        prototype.constractor=subType;
        subType.prototype=prototype;
    }
    
    //将nodeList转换成一个数组
    eventUtil.convertToArray=function(nodes){
        var array=null;
        try{
            array=Array.prototype.slice.call(nodes,0);//针对非IE浏览器
        }catch(ex){
            array=new Array();
            for(var i=0,len=nodes.length;i<len;i++){
                array.push(nodes[i]);
            }
        }
        return array;
    }
    
    //动态将外部JS脚本添加到<head>中
    eventUtil.loadScript=function(url){
        var script=document.createElement("script");
        script.type="text/javascript";
        script.src=url;
        document.body.appendChild(script);
    }
    
    //将行内JS脚本添加到<head>中
    eventUtil.loadScriptString=function(code){
        var script=document.createElement("script");
        script.type="text/javascript";
        try{
            script.appendChild(document.createTextNode("node"));
        }catch(ex){
            script.text="code";
        }
        document.body.appendChild(script);
    }
    //调用方式:loadScriptString("function sayhi(){alert('hi);}")
    
    //将外部CSS文件添加到<head>中
    eventUtil.loadStyle=function(url){
        var link=document.createElement("link");
        link.rel="stylesheet";
        link.type="text/css";
        link.href=url;
        var head=document.getElementsByTagName("head")[0];
        head.appendChild(link);
    }
    
    //将行内CSS文件添加到<head>中
    eventUtil.loadStyleString=function(css){
        var style=document.createElement("style");
        script.type="text/css";
        try{
            style.appendChild(document.createTextNode(css));
        }catch(ex){
            style.styleSheet.cssText=css;
        }
        var head=document.getElementsByTagName("head")[0];
        head.appendChild(style);
    }
    //调用方式:loadStyleString("body{background-color:red;}")

    eventUtil.matchesSelector=function(element,selector){
        if(element.matchesSelector){
            return element.matchesSelector(selector);
        }else if(element.msMatchesSelecor){
            return element.msMatchesSelecor(selector);
        }else if(element.mozMatchesSelecor){
            return element.mozMatchesSelecor(selector);
        }else if(element.webkitMatchesSelecor){
            return element.webkitMatchesSelecor(selector);
        }else{
            throw new Error("Not supported.");
        }
    }
    //调用方式：if(eventUtil.matchesSelector(document.body,"body.page1")){//执行操作}

    //获取head元素
    eventUtil.getHead=function(h){
        h=document.head||document.getElementsByTagName("head")[0];
        return h;
    }
    
    //跨浏览器判断一个节点是不是另一个节点的后代
    eventUtil.contains=function(refNode,otherNode){
        if(typeof refNode.contains=="function"&&!(client.engine.webkit||client.engine.webkit>=52)){
            return refNode.contains(otherNode);
        }else if(typeof refNode.compareDocumentPosition=="function"){
            return !!(typeof refNode.compareDocumentPosition(otherNode)&16);
        }else{
            var node=otherNode.parentNode;
            do{
                if(node==refNode){
                    return true;
                }else{
                    node=node.parentNode;
                }
            }while(node!=null);
            return false;
        }
    }
    
    //跨浏览器插入文本节点
    eventUtil.getInnerText=function(element,text){
        if(typeof element.textContent=="string"){
            element.textContent=text;
        }else{
            element.innerText=text;
        }
    }
    
    //跨浏览器获取样式表对象
    eventUtil.getStyleSheet=function(element){
        return element.sheet||element.styleSheets;
    }

    //跨浏览器向样式表中添加规则
    eventUtil.insertRule=function(sheet,selectorText,cssText,position){
        if(sheet.insertRule){
            sheet.insertRule(selectorText+"{"+cssText+"}",position);
        }else if(sheet.addRule){
            sheet.addRule(selectorText,cssText,position);
        }
    }
    //调用实例：insertRule(document.styleSheets[0],"body","background-color:silver",0);
    
    //跨浏览器删除样式规则
    eventUtil.delectRule=function(sheet,index){
        if(sheet.delectRule){
            sheet.delectRule(index);
        }else if(sheet.removeRule){
            sheet.removeRule(index);
        }
    }
    
    //取得元素的左偏移量
    eventUtil.getElementLeft=function(element){
        var actualLeft=element.offsetLeft;
        var current=element.offsetParent;
        
        while(current!==null){
            actualLeft+=current.offsetLeft;
            current=current.offsetParent;
        }
        return actualLeft;
    }
    
    //取得元素的上偏移量
    eventUtil.getElementTop=function(element){
        var actualTop=element.offsetTop;
        var current=element.offsetParent;
        
        while(current!==null){
            actualTop+=current.offsetTop;
            current=current.offsetParent;
        }
        return actualTop;
    }
    
    //跨浏览器取得文档的总的宽高
    eventUtil.getWidthHeight=function(docHeight,docWidth){
        var WH={
            docHeight:Math.max(document.documentElement.scrollHeight,document.documentElement.clientHeight),
            docWidth:Math.max(document.documentElement.scrollWidth,document.documentElement.clientWidth),
        };
        return WH;
    }
    
    //跨浏览器取得元素的宽高及位置等信息
    eventUtil.getBoundingClientRect=function(element){
        var scrollTop=document.documentElement.scrollTop;
        var scrollLeft=document.documentElement.scrollLeft;
        
        if(element.getBoundingClientRect){
            if(typeof arguments.callee.offset!="number"){
                var temp=document.createElement("div");
                temp.style.cssText="position:absolute;left:0;top:0;";
                document.body.appendChild(temp);
                arguments.callee.offset=-temp.getBoundingClientRect().top=scrollTop;
                document.body.removeChild(temp);
                temp=null;
            }
            
            var rect=element.getBoundingClientRect();
            var offset=arguments.callee.offset;
            
            return {
                left:rect.left+offset,
                right:rect.right+offset,
                top:rect.top+offset,
                bottom:rect.bottom+offset,
            };
        }else{
            var actualLeft=getElementLeft(element); //getElementLeft()取得元素的左偏移量
            var actualTop=getElementTop(element);//getElementTop()取得元素的上偏移量
            
            return {
                left:actualLeft-scrollLeft,
                right:actualLeft+element.offsetWidth-scrollLeft,
                top:actualTop-scrollTop,
                bottom:actualTop+element.offsetHeight-scrollTop,
            }
        }
    }
    
    //兼容低版本创建XMLHttpRequest对象（XHR）
    eventUtil.createXHR=function(){
        if(typeof XMLHttpRequest!="undefined"){
            return new XMLHttpRequest();
        }else if(typeof ActiveXObject!="undefined"){
            if(typeof arguments.callee.activeXString!="string"){
                var versions=["MSXML2.XMLHttp.6.0","MSXML2.XMLHttp.3.0","MSXML2.XMLHttp"],
                    i,len;
                for(i=0,len=versions.length;i<len;i++){
                    try{
                        new ActiveXObject(versions[i]);
                        arguments.callee.activeXString=versions[i];
                        break;
                    }catch(ex){
                        //跳过
                    }
                }
            }
            return new ActiveXObject(arguments.callee.activeXString);
        }else{
            throw new Error("No XHR object available.");
        }
    }

    //兼容requestAnimationFrame()
    eventUtil.requestNextAnimationFrame = (function () {
    var originalWebkitRequestAnimationFrame = undefined,
            wrapper = undefined,
            callback = undefined,
            geckoVersion = 0,
            userAgent = navigator.userAgent,
            index = 0,
            self = this;

    // Workaround for Chrome 10 bug where Chrome
    // does not pass the time to the animation function

    if (window.webkitRequestAnimationFrame) {
        // Define the wrapper

        wrapper = function (time) {
            if (time === undefined) {
                time = +new Date();
            }
            self.callback(time);
        };

        // Make the switch

        originalWebkitRequestAnimationFrame = window.webkitRequestAnimationFrame;

        window.webkitRequestAnimationFrame = function (callback, element) {
            self.callback = callback;

            // Browser calls the wrapper and wrapper calls the callback

            originalWebkitRequestAnimationFrame(wrapper, element);
        }
    }

    // Workaround for Gecko 2.0, which has a bug in
    // mozRequestAnimationFrame() that restricts animations
    // to 30-40 fps.

    if (window.mozRequestAnimationFrame) {
        // Check the Gecko version. Gecko is used by browsers
        // other than Firefox. Gecko 2.0 corresponds to
        // Firefox 4.0.

        index = userAgent.indexOf('rv:');

        if (userAgent.indexOf('Gecko') != -1) {
            geckoVersion = userAgent.substr(index + 3, 3);

            if (geckoVersion === '2.0') {
                // Forces the return statement to fall through
                // to the setTimeout() function.

                window.mozRequestAnimationFrame = undefined;
            }
        }
    }

    return  window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||

            function (callback, element) {
                var start,
                        finish;

                window.setTimeout(function () {
                    start = +new Date();
                    callback(start);
                    finish = +new Date();

                    self.timeout = 1000 / 60 - (finish - start);

                }, self.timeout);
            };
}());

    window.cancelNextRequestAnimationFrame = window.cancelRequestAnimationFrame
        || window.webkitCancelAnimationFrame
        || window.webkitCancelRequestAnimationFrame
        || window.mozCancelRequestAnimationFrame
        || window.oCancelRequestAnimationFrame
        || window.msCancelRequestAnimationFrame
        || clearTimeout;

    window.$ = $;
})(window)