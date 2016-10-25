"use strict";
var WheelClass=require('./WheelClass.js');
var MinuWheelClass = WheelClass.extend({
    itemClassName:"car-time-minu",
    ctor:function(step){
        var textList = this.produceTextList(step);
        this._super("carTimeControlMinu",textList);
    },
    produceTextList:function(step){
        var textList = [];
        var begin = 0;
        while(begin<60){
            if(begin<10){
                textList.push("0"+begin+"分");
            }else{
                textList.push(begin+"分");
            }
            begin+=step;
        }
        return textList;
    }
});
module.exports = MinuWheelClass;