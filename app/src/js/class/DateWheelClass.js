"use strict";
var WheelClass=require('./WheelClass.js');
var DateWheelClass = WheelClass.extend({
    itemClassName:"car-time-date",
    ctor:function(textList){
        this._super("carTimeControlDate",textList);
    }
});
module.exports = DateWheelClass;