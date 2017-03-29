/**
 * Created by Administrator on 2017/3/27.
 */

var data = {

    data : [
        [{
            id : "周杰伦",
            name : "稻花香",
            url : "mp3/a.mp3"
        }],
        [{
            id : "American Authors",
            name : "Best Day Of My Life",
            url : "mp3/b.mp3"
        }],
        [{
            id : "陈势安",
            name : "非你不可",
            url : "mp3/c.mp3"
        }]
    ]

};

//音频js
(function(window){

    //创建一个播放器的构造函数
    window.Audio = function(){

    };

    Audio.prototype = {

        constructor : Audio,

        //初始化
        init : function( options ){

            this.settings["data"] = options.data;

            //初始化歌曲列表
            this.audioList();

            //初始化音量控制系统
            this.volumeDisplay();

            //初始化左右点击事件
            this.click();

            //初始化就可以调节音量
            this.adjVolume();

        },

        audio : document.querySelector("#mp3"),

        //doc节点
        doc : {
            //歌曲列表
            mp3List : document.querySelector(".mp3List"),
            //播放键
            playContruller : document.querySelector(".playContruller"),
            //歌曲总时间
            setTatalTime : document.querySelector(".setTatalTime"),
            //当前播放时间
            currentTime : document.querySelector(".currentTime"),
            //当前播放进度
            currentSpeed : document.querySelector(".lineS"),
            //歌手歌名
            MP3Name : document.querySelector(".MP3Name"),
            //音量控制
            volume_value : document.querySelector(".volume_value"),
            //音量控制按钮
            volume_radio : document.querySelector(".volume_radio"),
            //控制音量显示隐藏
            volume_display : document.querySelector(".volume"),
            //音量box
            volume_box : document.querySelector(".volume_box")
        },

        //配置参数
        settings : {},

        //初始化歌曲列表
        audioList : function(){
            var arr = [];
            var json = this.settings.data.data;
            // <li><a href="javascript:void(0);">周杰伦-稻花香</a></li>
            for(var i=0; i<25; i++){
                for(var j=0; j<json.length; j++ ){
                    var id = json[j][0]["id"];
                    var name = json[j][0]["name"];
                    var url = json[j][0]["url"];
                    arr.push( '<li url="'+url+'" ids="'+id+'" name="'+name+'"><a href="javascript:void(0);">'+id+'-'+name+'</a></li>')
                }
            };

            this.doc.mp3List.innerHTML = arr.join("")
            this.liClick();
        },

        //li添加事件
        liClick : function(){

            var li = document.querySelectorAll(".mp3List>li");
            var index = 0;
            var _this = this;

            for(var i=0; i<li.length; i++ ){

                li[i].index = i;

                //单击事件
                li[i].onclick = function(){
                    li[index].className = "";
                    this.className = "active";
                    index = this.index;
                };

                //双击事件
                li[i].ondblclick = function(){

                    //设置各种参数的时候要把当前播放进度置0
                    _this.doc.currentSpeed.style.width = "0%";
                    //停止当前时间器
                    clearInterval( _this.settings["timer"] );

                    li[index].className = "";
                    this.className = "active";
                    index = this.index;
                    var url = this.getAttribute("url");
                    var id = this.getAttribute("ids");
                    var name = this.getAttribute("name");

                    //更新当前歌曲信息
                    _this.updateMp3({
                        url : url,
                        id : id,
                        name : name
                    },function(){
                        //双击播放歌曲
                        _this.play();
                    })

                };

            }

        },

        //歌曲状态（ 当前歌曲是否播放 ）
        MP3status : {
            url : "aaaa", //当前播放歌曲的地址
            id : "多大的", //当前歌手
            name : "ddd", //当前歌名
            TotalTime : 0, //歌曲总时间
            CurrentTime : 0, //当前播放时间
            volume : 0.5, //音量
            progress :0, //播放进度
            off : false //当前歌曲是否正在播放
        },

        updateMp3 : function( data ,fn ){
            var _this = this;
            _this.MP3status.url = data.url;
            _this.MP3status.id = data.id;
            _this.MP3status.name = data.name;
            fn();
        },

        //播放歌曲
        play : function(){

            var _this = this;
            _this.audio.src = _this.MP3status.url;
            this.MP3status.off = true;

            _this.audio.addEventListener("canplay", function(){

                //计算audio各种参数
                _this.calculation(function(){

                    //播放键控制器（ 作用就是控制音乐的播放 ）
                    _this.playContruller();

                });

            });

        },

        //计算audio的各种参数
        calculation : function( fn ){

            var _this = this;
            //取小数点后两位
            _this.MP3status.TotalTime = Math.floor( ((_this.audio.duration)/60)*100) / 100;

            //设置歌星
            _this.setMP3Name();

            //设置音量
            _this.setVolume()

            //设置歌曲总时间
            _this.setTotalTime();

            //每秒获取当前播放时间
            _this.setInterval();

            fn();

        },

        //设置音量
        setVolume : function(){
            var _this = this;
            _this.audio.volume = _this.MP3status.volume;
        },

        //设置歌星
        setMP3Name : function(){
            var _this = this;
            _this.doc.MP3Name.innerHTML = _this.MP3status.id + "-"+_this.MP3status.name;
        },

        //设置歌曲总时间
        setTotalTime : function(){
            var _this = this;
            _this.doc.setTatalTime.innerHTML = _this.MP3status.TotalTime;
        },

        //更新当前播放时间
        setCurrentTime : function(){
            var _this = this;
            _this.doc.currentTime.innerHTML = Math.floor( ((_this.MP3status.CurrentTime)/60)*100) / 100;//;
        },

        //更新当前播发进度
        setCurrentSpeed : function(){
            var _this = this;
            _this.doc.currentSpeed.style.width = _this.MP3status.progress + "%";
        },

        //每秒获取当前播放时间
        setInterval : function(){
            var _this = Audio.prototype;
            var TotalTime = _this.MP3status.TotalTime;

            _this.settings["timer"] = setInterval(function(){
                //当前播放时间
                var timer = _this.audio.currentTime
                //当前进度
                var progress = timer/TotalTime;

                if( timer === TotalTime ){
                    console.log( timer );
                    clearInterval( _this.settings["timer"] );
                    return;
                };

                //当前播放时间赋值
                _this.MP3status.CurrentTime = timer;
                //当前播放进度赋值
                _this.MP3status.progress = progress;

                //更新当前播放时间
                _this.setCurrentTime();
                //更新当前播放进度
                _this.setCurrentSpeed();
            },1000)

        },

        //click的想过操作
        click : function(){
            var _this = this;

            //点击播放键 控制歌曲的开关
            _this.doc.playContruller.onclick = function(){

                //停止播放
                if( _this.MP3status.off ){
                    clearInterval( _this.settings["timer"] );
                    _this.MP3status.off = false;
                //继续播放
                }else{

                    _this.MP3status.off = true;
                };
                //计算audio各种参数
                _this.calculation(function(){

                    //播放键控制器（ 作用就是控制音乐的播放 ）
                    _this.playContruller();

                });

            };

        },

        //播放键控制器 （ 作用就是控制音乐的播放 ）
        playContruller : function(){

            var _this = this;
            var status = this.MP3status ;

            //开始播放
            if( status.off ){
                _this.audio.play();
                _this.doc.playContruller.className = "playContruller active"
            //停止播放
            }else{
                _this.audio.pause();
                _this.doc.playContruller.className = "playContruller"
            }

        },

        //音量调节
        adjVolume : function(){

            var _this = this;

            _this.doc.volume_radio.onmousedown = function(ev){

                var ev = ev || event;
                var y = ev.pageY;
                document.onmousemove = function( ev ){
                    var ev = ev || event;
                    var dY = ev.pageY;

                    var k = -(dY - y)/1500;

                    var key = _this.MP3status.volume + k;

                    if( key <= 0 ){
                        key = 0;
                    }else if( key >= 1 ){
                        key = 1;
                    }

                     _this.MP3status.volume = key;

                    //设置音量
                    _this.setVolume();
                    _this.doc.volume_value.style.height = key * 100 + "px";

                };
                document.onmouseup = function(){
                    document.onmousemove = document.onmouseup = null;
                }
                return false;
            };

        },

        //简单的鼠标移入音量图标音量控制器出现
        volumeDisplay : function(){
            var _this = this;
            var timer;
            _this.doc.volume_display.onmousemove = _this.doc.volume_box.onmousemove = function(){
                clearTimeout( timer )
               _this.doc.volume_box.style.display = "block";

            };
            _this.doc.volume_display.onmouseout = _this.doc.volume_box.onmouseout = function(){

                timer = setTimeout(function(){
                    _this.doc.volume_box.style.display = "none";
                },100);

            };
        }

    }

})(window);


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