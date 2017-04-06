/**
 * Created by Administrator on 2017/3/29.
 */
(function( window , nodes ){

    //元素
    var doc = {
        id : document.querySelector("#column")
    };
    //初始化
    function init(){

        //创建菜单
        createTree( doc.id , nodes );

        //绑定点击事件事件
        bindClick();

    };

    //根据数据生成菜单
    function createTree( id , data ){
        for(var i=0; i<data.length; i++){

            var li = document.createElement("li");
            var div = document.createElement("div");
            li.style.display = "none";

            if( data[i].children ){

               var ul = document.createElement("ul");
                ul.className = "childNode";
                div.innerHTML = '<i class="child_statusIcon toggle"></i><i class="child_fileIcon"></i><span>'+data[i].name+'</span>';
                li.appendChild( ul );
                createTree( ul , data[i].children );

            }else{
                div.innerHTML = '<i class="notDoc_statusIcon"></i><span>'+data[i].name+'</span>';
            };

            li.insertBefore( div , ul );
            id.appendChild( li );

        };
    };

    //绑定点击事件
    function bindClick(){

        var toggle = document.querySelectorAll(".toggle");
        for( var i=0; i<toggle.length; i++ ){
            bind( toggle[i] , "click" , _click );
        };

    };

    function _click(){

        var off = this["off"] = this["off"] ? false : true;
        var _parent = this.parentNode;
        var siblings = _parent.nextElementSibling;
        var li = siblings.children;

        if( off ){
            for(var i=0; i<li.length; i++){
                li[i].style.display = "block";
                addClass( this , "active");
            }
        }else{
            for(var i=0; i<li.length; i++){
                li[i].style.display = "none";
                removeClass( this , "active");
            }
        }

    };

    //绑定事件
    function bind( obj , event , fn ){

        if( typeof obj != "object" || typeof fn != "function"){
            return;
        };

        if( obj.addEventListener ){
            obj.addEventListener( event , fn , false )
        }else{
            obj.attachEvent( "on"+event , function(){
                fn.call( obj , arguments );
            });
        };

    };

    function addClass(obj,className)
    {
        if(obj.className == '')
        {
            obj.className = className;
        }else
        {
            var arrClass = obj.className.split(' ');
            var numClass = arrClassName(arrClass,className);
            if(numClass == -1)
            {
                obj.className += ' '+className;
            };
        };
    };

    function removeClass( obj , getClass){
        var str = obj.className;
        var re = new RegExp('\\b\\s+'+getClass+'\|'+getClass+'\\s+\|'+getClass+'\\b', 'g' );
        str = str.replace( re , '' );
        return obj.className = str;
    };

    function arrClassName(arr,cn)
    {
        for(var i=0; i<arr.length; i++)
        {
            if(arr[i] == cn)
            {
                return 1;
            };
        };
        return -1;
    };


    init();

})(window , nodes );