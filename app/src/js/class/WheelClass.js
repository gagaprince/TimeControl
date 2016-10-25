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
    resetPos:function(datY,isUpdate){//isUpdate 指是否更新currentIndex
        var needDuration = 0;
        if(typeof datY == "undefined"){
            datY = 0;
            needDuration = 0.3;
        }
        //重置位置

        var pos = this._cacularNowPos(datY);
        this._transLateTo(-pos,needDuration);

        if(isUpdate){
            var currentIndex = this._cacularNowIndex(datY);
            this.currentIndex=currentIndex;
            this.resetPos();
        }
    },
    _cacularNowPos:function(datY){
        var step = this.step;
        var currentIndex = this.currentIndex;
        var pos = currentIndex*step-this.skew-datY;//需要移动的pos位置

        //边界检测
        var  textList =this.textList;
        var topIndex = textList.length+2;
        var topPos = topIndex*step-this.skew;
        if(pos>topPos){
            pos = topPos;
        }
        if(pos<-2*this.skew){
            pos = -2*this.skew;
        }

        return pos;
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
        elDom.addEventListener("touchstart",function(e){
            var touch = e.touches[0];
            touchStart = {
                x:touch.pageX,
                y:touch.pageY
            }
            console.log(touchStart);
        },false);
        elDom.addEventListener("touchmove",function(e){
            var touch = e.touches[0];
            touchCurrent = {
                x:touch.pageX,
                y:touch.pageY
            }

            var datY = touchCurrent.y-touchStart.y;
            _this.resetPos(datY);

            console.log(touchCurrent);
        },false);
        elDom.addEventListener("touchend",function(e){
            var touch = e.changedTouches[0];
            touchEnd = {
                x:touch.pageX,
                y:touch.pageY
            }
            var datY = touchEnd.y-touchStart.y;
            _this.resetPos(datY,true);
            console.log("end");
            console.log(touchEnd);
        },false);
    }
});

module.exports = WheelClass;