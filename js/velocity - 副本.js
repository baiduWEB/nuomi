/**
 * Created by Administrator on 2017/3/27.
 */
(function(window){

    //模拟一个jquery $。
    window.$ = function( obj ){

        var objList = document.querySelectorAll( obj );
        var len = objList.length;
        if( len > 1 ){

            for(var i=0; i<len; i++){
                return new Velocity( objList[i] );
            }

        }else{
            return new Velocity( objList[0] );
        }
    };

    //创建Velocity 构造函数
    function Velocity( obj ){
        this.obj = obj;
    };

    //Velocity添加方法及属性
    Velocity.prototype = {

        constructor : Velocity,

        //配置参数
        settings : {

        },

        //动画属性
        json : {},

        velocity : function( json , options ){

            //覆盖默认参数
            extend( this.settings , options );
            extend( this.json , json );

            this.animate();

        },

        //动画函数
        animate : function(){
            var json = this.json;
            var obj = this.obj;
            var date = this.settings.date;
            var fx = this.settings.type;
            var fn = this.settings.callback;
            var _this = this;

            var iCur = {} , off = true , startTime = ( new Date() ).getTime() ;
            for( var attr in json ){
                if( attr === 'opacity' ){
                    iCur[attr] = Math.round( css( obj , 'opacity') * 100 );
                }else{
                    iCur[attr] = parseInt( css( obj , attr ) );
                }
            }
            clearInterval( obj.timer );
            requestAnimationFrame( animation );
            function animation(){
                var changeTime = ( new Date() ).getTime();
                var t = date - Math.max( 0 , ( startTime - changeTime + date ) );

                for(var attr in json){

                    var value = Tween[fx]( t , iCur[attr] , ( json[attr] - iCur[attr] ) , date );

                    if( attr === 'opacity' ){
                        obj.style.opacity = value/100;
                        obj.style.fliter = 'alpha(opacity='+value+')'
                    }else{
                        obj.style[attr] = value + 'px';
                    }

                };


                if( t === date){
                    off = true;
                    fn && fn.call( obj );
                    return;
                };
                requestAnimationFrame( aaa );
            };

            /*obj.timer = setInterval(function(){
                console.log( 0 )
                var changeTime = ( new Date() ).getTime();
                var t = date - Math.max( 0 , ( startTime - changeTime + date ) );

                for(var attr in json){

                    var value = Tween[fx]( t , iCur[attr] , ( json[attr] - iCur[attr] ) , date );

                    if( attr === 'opacity' ){
                        obj.style.opacity = value/100;
                        obj.style.fliter = 'alpha(opacity='+value+')'
                    }else{
                        obj.style[attr] = value + 'px';
                    }

                };
                if( t === date){
                    off = true;
                    clearInterval( obj.timer );
                    fn && fn.call( obj );
                }

            },16);*/
        }

    };

    //获取css样式
    function css( obj , style ){
        return obj.currentStyle ? obj.currentStyle[style] : getComputedStyle( obj )[style];
    };

    //简单版的extend
    function extend(obj1,obj2){
        for(var attr in obj2){
            obj1[attr] = obj2[attr];
        }
    };

    //因为requestAnimationFrame和setTimeout一样都是全局函数可以直接调用的。
    //这段兼容的意思就是 如果浏览器兼容requestAnimationFrame，就使用requestAnimationFrame,否则就 用setTimeout来代替requestAnimationFrame。
    // timeDelta 这里时间的计算最终结果为0， 这是js setTimeout 的一个小技巧。大致意思就是 普通队列执行完成以后，才顺序执行setTimeout队列
    window.requestAnimationFrame = window.requestAnimationFrame || (function() {
            var timeLast = 0;

            return window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function(callback) {
                    var timeCurrent = (new Date()).getTime(),
                        timeDelta;

                    /* Dynamically set delay on a per-tick basis to match 60fps. */
                    /* Technique by Erik Moller. MIT license: https://gist.github.com/paulirish/1579671 */
                    timeDelta = Math.max(0, 16 - (timeCurrent - timeLast) );
                    timeLast = timeCurrent + timeDelta;

                    return setTimeout(function() { callback(timeCurrent + timeDelta); }, timeDelta);
                };
        })();

})(window);