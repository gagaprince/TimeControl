"use strict";
var WheelClass=require('./WheelClass.js');
var DateUtil = require('../util/DateUtil.js');
var DateWheelClass = WheelClass.extend({
    itemClassName:"car-time-date",
    ctor:function(days){
        var textList = this.produceTextList(days);
        this._super("carTimeControlDate",textList);
    },
    produceTextList:function(days){
        var textList=[];
        var now = DateUtil.now();
        for(var i=0;i<=days;i++){
            var fm = "";
            if(i==0){
                fm = "MM月dd日 今天";
            }else{
                fm = "MM月dd日 星期D";
            }
            var dateText = DateUtil.dateFormat(fm,now);
            textList.push(dateText);
            now = DateUtil.dateAdd(now,24*3600*1000);
        }

        return textList;
    }
});
module.exports = DateWheelClass;