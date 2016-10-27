"use strict";
//var TimerControl = require('./TimeControl.js');
require('./TimeControl.js');
$(document).ready(function(){
//    console.log();
    TimeControl.init();

    $(".test-btn").on("click",function(){
        TimeControl.selectDate({
            min:15,
            max:43200,
            currentShowTime:"",//"2016-10-28 13:29",
            showImmeButton:true,//是否显示立即用车
            title:"请选择出发时间",//控件提示title
            success:function(res){
                console.log(res);
            }
        });
    });


});

