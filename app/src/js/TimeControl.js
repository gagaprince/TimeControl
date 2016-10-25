"use strict";
(function(global, factory) {
    if (typeof define === "function") { // AMD || CMD
        if (define.amd) {
            define(function() {
                return factory();
            });
        } else if (define.cmd) {
            define(function(require, exports, module) {
                module.exports = factory();
            });
        }
    } else if (typeof module === "object" && typeof module.exports === "object") { // commonJS
        module.exports = factory();
    } else { // global
        global.TimerControl = factory();
    }
}(typeof window !== "undefined" ? window : this, function() {

    var DateWheelClass = require('./class/DateWheelClass.js');
    var HourWheelClass = require('./class/HourWheelClass.js');
    var MinuWheelClass = require('./class/MinuWheelClass.js');

    var timeControlInitFlag = false;
    var TimeControl = {
        init:function(options){
            if(timeControlInitFlag){
                return;
            }
            timeControlInitFlag = true;

            this.initListener();

        },
        initListener:function(){
            //时间控件的事件绑定

        },

        selectDate:function(options){
            this.initDate();
            this.initHour();
            this.initMinu();

        },
        initDate:function(){
            var dateList = ["10月21日 今天",
                "10月22日 星期六",
                "10月22日 星期六",
                "10月22日 星期六",
                "10月22日 星期六",
                "10月22日 星期六",
                "10月22日 星期六",
                "10月22日 星期六"];
            var dateWheel = new DateWheelClass(dateList);
        },
        initHour:function(){
            new HourWheelClass();
        },
        initMinu:function(){
            new MinuWheelClass(15);
        }
    }

    TimeControl.init();

    return {
        selectDate:function(options){
            TimeControl.selectDate(options);
        }
    };

}));