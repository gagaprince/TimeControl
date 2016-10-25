"use strict";
var HClass = require('./HClass.js');
var WheelClass = HClass.extend({
    id:null,
    ele:null,   //滚轮的最外层
    elList:null,//滚轮的整个list
    textList:[],
    currentText:"",
    currentIndex:0,
    itemClassName:"",

    step:30,//单个item的高
    skew:75,//这个为纠偏量 是指默认情况下item偏离正常位置的值

    stopMoveFlag:false,
    ctor:function(id,textList,current){
        this.init(id,textList,current);
    },
    init:function(id,textList,current){
        if(!id){
            throw "wheelClass need a dom id";
        }
        if(!textList){
            throw "wheelClass need a array of text!";
        }
        this.id = id;
        this.textList = textList;
        this.ele = $("#"+id);
        if(this.ele.length==0){
            throw "the id dom is not exist!";
        }
        this.elList = this.ele.find('.car-time-list');
        if(current){
            this.currentText = current;
        }
        this.initList();
        this.resetPos();
        this.initListener();
    },
    initList:function(){
        var currentText = this.currentText;
        var elList = this.elList;
        var textList = this.textList;
        elList.html("");
        var text = textList[0];
        for(var i=0;text;text=textList[++i]){
            if(text==currentText){
                this.currentIndex = i;
            }
            elList.append('<div class="'+this.itemClassName+'">'+text+'</div>');
        }
        this.currentText = textList[this.currentIndex];
    },
    resetPos:function(datY,isUpdate,fromBufferMove){
    //isUpdate 指是否更新currentIndex    fromBufferMove 是否来源于缓冲
        //如果来源于缓冲的话 要看是否触发边界  如果触发边界 则 isUpdate=true
        var needDuration = 0;
        if(typeof datY == "undefined"){
            datY = 0;
            needDuration = 0.3;
        }
        //重置位置

        var _this = this;
        this._cacularNowPos(datY,function(pos,isend){//是否触发了边界
            _this._transLateTo(-pos,needDuration);
            if(isUpdate||(fromBufferMove&&isend)){
                var currentIndex = _this._cacularNowIndex(datY);
                _this.currentIndex=currentIndex;
                _this.resetPos();
            }
        });

    },
    _cacularNowIndex:function(datY){
        var  textList =this.textList;
        var currentIndex = this.currentIndex;
        var step = this.step;
        currentIndex = currentIndex-Math.floor(datY/step+0.5);
        if(currentIndex<0){
            currentIndex=0;
        }
        if(currentIndex>textList.length-1){
            currentIndex = textList.length-1;
        }
        return currentIndex;
    },
    _cacularNowPos:function(datY,onCacular){
        var step = this.step;
        var currentIndex = this.currentIndex;
        var pos = currentIndex*step-this.skew-datY;//需要移动的pos位置

        //边界检测
        var  textList =this.textList;
        var topIndex = textList.length+2;
        var topPos = topIndex*step-this.skew;
        var isEnd = false;
        if(pos>topPos){
            pos = topPos;
            this.stopBufferMove();
            isEnd = true;
        }
        if(pos<-2*this.skew){
            pos = -2*this.skew;
            this.stopBufferMove();
            isEnd = true;
        }

        if(onCacular){
            onCacular(pos,isEnd);
        }
    },

    _transLateTo:function(y,duration){
        var elList = this.elList;
        elList.css({
            "-webkit-transform":"translate3d(0,"+y+"px,0)",
            "-moz-transform":"translate3d(0,"+y+"px,0)",
            "-o-transform":"translate3d(0,"+y+"px,0)",
            "transform":"translate3d(0,"+y+"px,0)",
            "-webkit-transition-duration":duration+"s",
            "-moz-transition-duration":duration+"s",
            "-o-transition-duration":duration+"s",
            "transition-duration":duration+"s"
        });
    },
    initListener:function(){
        var el = this.ele;
        var elDom = el[0];
        var touchStart = {};
        var touchCurrent = {};
        var touchEnd = {};
        var _this = this;
        var timeStart = 0;//时间刻度
        var timeEnd = 0;//时间刻度
        var speed = 0;//瞬时速度
        elDom.addEventListener("touchstart",function(e){
            var touch = e.touches[0];
            touchStart = {
                x:touch.pageX,
                y:touch.pageY
            }
            timeStart = new Date().getTime();
        },false);
        elDom.addEventListener("touchmove",function(e){
            var touch = e.touches[0];
            var touchPre = touchCurrent||touchStart;
            touchCurrent = {
                x:touch.pageX,
                y:touch.pageY
            }

            var datY = touchCurrent.y-touchStart.y;
            _this.resetPos(datY);
            //计算瞬时速度
            timeEnd = new Date().getTime();
            speed = (touchCurrent.y-touchPre.y)/(timeEnd-timeStart);
            timeStart = timeEnd;
        },false);
        elDom.addEventListener("touchend",function(e){
            var touch = e.changedTouches[0];

            touchEnd = {
                x:touch.pageX,
                y:touch.pageY
            }
            var datY = touchEnd.y-touchStart.y;
            //_this.resetPos(datY,true);
            //缓冲运动
            _this.bufferMove(datY,speed);
            touchCurrent=null;
            touchStart = null;
            touchEnd = null;
        },false);
    },
    stopBufferMove:function(){
        this.stopMoveFlag = true;
    },
    bufferMove:function(datY,v){
        //v=-1;
        this.stopMoveFlag = false;
        this._move(0,v,datY);
    },
    _move:function(dt,v,datY){
        var g = 0.005;//加速度
        var vend = Math.abs(v)-dt*g;
        console.log("vend:"+vend);
        if(vend<0){
            vend=0;
        }
        var dis = (v*v-vend*vend)/2/g;
        var nowDatY = datY+v/Math.abs(v)*dis;
        this.resetPos(nowDatY,vend==0,true);
        var _this = this;
        if(vend!=0){
            if(!this.stopMoveFlag){
                setTimeout(function(){
                    _this._move(dt+20,v,datY);
                },20);
            }else{
                this.stopMoveFlag = false;
            }
        }

    }
});

module.exports = WheelClass;