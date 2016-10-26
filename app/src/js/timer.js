"use strict";
var TimeControl = require('./TimeControl.js');
$(document).ready(function(){
    TimeControl.init();
    TimeControl.selectDate();
    console.log(TimeControl.getSelectDate());
});

