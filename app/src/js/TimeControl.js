"use strict";
(function(global, factory) {
    var fa = factory();
    if (typeof define === "function") { // AMD || CMD
        if (define.amd) {
            define(function() {
                return fa;
            });
        } else if (define.cmd) {
            define(function(require, exports, module) {
                module.exports = fa;
            });
        }
    } else if (typeof module === "object" && typeof module.exports === "object") { // commonJS
        module.exports = fa;
    } else { // global

    }
    window.TimeControl = fa;
}(typeof window !== "undefined" ? window : this, function() {
    require('../css/timer.less');
    var timerHtml = require('./tpl/timer.html')({});

    var DateUtil = require('./util/DateUtil.js');

    var DateWheelClass = require('./class/DateWheelClass.js');
    var HourWheelClass = require('./class/HourWheelClass.js');
    var MinuWheelClass = require('./class/MinuWheelClass.js');

    var QEvent = require('./util/EventManage.js').QEvent;
    var em = require('./util/EventManage.js').EventManager;

    var timeControlInitFlag = false;
    var TimeControl = {
        id:"carTimer",
        ele:null,

        options:null,
        minTime:null,//最小时间限
        maxTime:null,//最大时间限
        minAviableTime:null,//最小可选时间
        maxAviableTime:null,//最大可选时间
        step:0,//最小时间刻度分钟
        currentShowTime:"",
        showImmeButton:true,//是否显示马上用车
        onSelectDate:null,  //选择时间之后的回调

        dateControl:null,
        hourControl:null,
        minuControl:null,
        init:function(options){
            if(timeControlInitFlag){
                return;
            }
            timeControlInitFlag = true;
            this.initHtml();
            this.ele = $("#"+this.id);
            this.initListener();
        },
        initHtml:function(){
            $("body").append(timerHtml);
        },
        postTimeChangeMsg:function(){
            var event = new QEvent(QEvent.EventName.ON_TIME_CHANGE);
            em.postMsg(event);
        },
        initListener:function(){
            var _this = this;
            //添加对滚轮的侦听
            em.addEventListener(QEvent.EventName.ON_DATE_CHANGE,function(e){
                _this.postTimeChangeMsg();
            });
            em.addEventListener(QEvent.EventName.ON_HOUR_CHANGE,function(e){
                _this.postTimeChangeMsg();
            });
            em.addEventListener(QEvent.EventName.ON_MINU_CHANGE,function(e){
                _this.postTimeChangeMsg();
            });
            //添加对 取消 确定按钮的侦听
            $("#carTimeSure").on("click",function(){
                //隐藏当前控件 并调用传入的回调
                _this.hide();
                if(_this.onSelectDate){
                    var select = _this.getSelectDate();
                    var returnObj = {};
                    var selectTime = null;
                    if(select==-1){
                        //立即用车
                        returnObj["DateType"]=-1;
                        selectTime = DateUtil.now();
                    }else{
                        returnObj["DateType"]=1;
                        selectTime =_this.getSelectDate();
                    }
                    returnObj["selectedTimeInterval"]=selectTime.getTime()/1000;
                    returnObj["selectUserTime"]=DateUtil.dateFormat('yyyy-MM-dd hh:mm',selectTime);
                    _this.onSelectDate(returnObj);
                }
            });
            $("#carTimeCansel,#carTimerMask").on("click",function(){
                //直接隐藏当前控件
                _this.hide();
            });

        },
        hide:function(){
            this.ele.hide();
        },
        show:function(){
            this.ele.show();
        },

        selectDate:function(options){
            this.initOption(options);
            this.initDate();
            this.initHour();
            this.initMinu();
            //手动触发一次时间改变的事件
            this.postTimeChangeMsg();//用来调整初始化时间
            this.show();
        },
        initDate:function(){
            if(!this.dateControl){
                this.dateControl = new DateWheelClass(this);
            }
            this.dateControl.resetTextList(this.minAviableTime,this.maxAviableTime,this.showImmeButton,this.currentShowTime);
        },
        initHour:function(){
            if(!this.hourControl){
                this.hourControl = new HourWheelClass(this);
            }
            this.hourControl.resetTextList(this.minAviableTime,this.maxAviableTime,this.currentShowTime);
        },
        initMinu:function(){
            if(!this.minuControl){
                this.minuControl = new MinuWheelClass(this);
            }
            this.minuControl.resetTextList(this.minAviableTime,this.maxAviableTime,this.step,this.currentShowTime);
        },
        initOption:function(options){
            //options min 是距离当前时间的最短可用时间 默认是0
            //max 是具体当前时间的最长可用时间 默认是1年 单位是分钟
            this.options = $.extend({
                min:5,
                max:525600,
                minDate:"",
                maxDate:"",
                currentShowTime:"",//"2016-10-28 13:29",
                showImmeButton:true,//是否显示立即用车
                title:"请选择时间",//控件提示title
                success:function(){},
                step:15//最小时间刻度
            },options);
            this.initStep();
            this.initImmeButtonFlag();
            this.initCurrentShow();
            this.initDateRange();
            this.initTitle();
            this.initAviableDateRange();
            this.initCallBack();
        },
        initCallBack:function(){
            this.onSelectDate = this.options.success;
        },
        initTitle:function(){
            $("#carTimeTile").html(this.options.title);
        },
        initStep:function(){
            this.step = this.options.step;
        },
        initImmeButtonFlag:function(){
            this.showImmeButton = this.options.showImmeButton;
        },
        initCurrentShow:function(){
            this.currentShowTime = this.options.currentShowTime;
        },
        initDateRange:function(){
            var options = this.options;
            if(options.minDate!=""&&options.maxDate!=""){
                //使用 传入参数 字符串转为date 作为最大最小的时间限制
                this.maxTime = DateUtil.parseStrToDate(options.maxDate);
                this.minTime = DateUtil.parseStrToDate(options.minDate);
            }else{
                var now = DateUtil.now();
                this.minTime = DateUtil.dateAdd(now,options.min*60000);
                this.maxTime = DateUtil.dateAdd(now,options.max*60000);
            }

        },
        initAviableDateRange:function(){//根据传入的时间限制 得到最早可选时间 和 最晚可选时间
            var minTime = this.minTime;
            var step = this.step;
            var minu = minTime.getMinutes();
            var nearMinu = (Math.floor((minu-1)/step)+1)*step;
            this.minAviableTime = DateUtil.dateAdd(minTime,(nearMinu-minu)*60000);

            var maxTime = this.maxTime;
            var maxMinu = maxTime.getMinutes();
            var nearMaxMinu = Math.floor(maxMinu/step)*step;
            this.maxAviableTime = DateUtil.dateAdd(maxTime,(nearMaxMinu-maxMinu)*60000);
        },
        getSelectDate:function(){
            //返回当前时间控件 选取的时间
            var selectDate = this.dateControl.getSelect();

            if(selectDate==-1){
                //立即用车
                return -1;
            }

            var selectHour = this.hourControl.getSelect();
            var selectMinu = this.minuControl.getSelect();

            var select = selectDate+" "+selectHour+":"+selectMinu;

            return DateUtil.parseStrToDate(select);
        }

    }

    return {
        init:function(){
            TimeControl.init();
        },
        selectDate:function(options){
            TimeControl.selectDate(options);
        },
        getSelectDate:function(){
            return TimeControl.getSelectDate();
        }
    };

}));