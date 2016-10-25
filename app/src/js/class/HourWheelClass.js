"use strict";
var WheelClass=require('./WheelClass.js');
var HourWheelClassHour = WheelClass.extend({
    itemClassName:"car-time-hour",
    ctor:function(){
        var textList = this.produceTextList();
        this._super("carTimeControlHour",textList);
    },
    produceTextList:function(){
        var textList = [];
        for(var i=0;i<24;i++){
            if(i<10){
                textList.push("0"+i+"点");
            }else{
                textList.push(i+"点");
            }
        }
        return textList;
    }
});
module.exports = HourWheelClassHour;