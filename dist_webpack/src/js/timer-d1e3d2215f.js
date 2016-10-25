/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(1);

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var TimeControl = __webpack_require__(2);
	$(document).ready(function(){
	    TimeControl.selectDate();
	});



/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;"use strict";
	(function(global, factory) {
	    if (true) { // AMD || CMD
	        if (true) {
	            !(__WEBPACK_AMD_DEFINE_RESULT__ = function() {
	                return factory();
	            }.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
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

	    var DateWheelClass = __webpack_require__(3);
	    var HourWheelClass = __webpack_require__(6);
	    var MinuWheelClass = __webpack_require__(7);

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

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var WheelClass=__webpack_require__(4);
	var DateWheelClass = WheelClass.extend({
	    itemClassName:"car-time-date",
	    ctor:function(textList){
	        this._super("carTimeControlDate",textList);
	    }
	});
	module.exports = DateWheelClass;

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var HClass = __webpack_require__(5);
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

/***/ },
/* 5 */
/***/ function(module, exports) {

	var HClass = function(){}
	var fnTest = /\b_super\b/;
	HClass.extend = function(props){
	    var _super = this.prototype;
	    var prototype = Object.create(_super);
	    var desc = { writable: true, enumerable: false, configurable: true };
	    function Class(){
	        if (this.ctor)
	            this.ctor.apply(this, arguments);
	    }
	    Class.prototype = prototype;
	    for(var idx = 0, li = arguments.length; idx < li; ++idx) {
	        var prop = arguments[idx];
	        for (var name in prop) {
	            var isFunc = (typeof prop[name] === "function");
	            var override = (typeof _super[name] === "function");
	            var hasSuperCall = fnTest.test(prop[name]);

	            if (isFunc && override && hasSuperCall) {
	                desc.value = (function (name, fn) {
	                    return function () {
	                        var tmp = this._super;
	                        this._super = _super[name];
	                        var ret = fn.apply(this, arguments);
	                        this._super = tmp;
	                        return ret;
	                    };
	                })(name, prop[name]);
	                Object.defineProperty(prototype, name, desc);
	            } else if (isFunc) {
	                desc.value = prop[name];
	                Object.defineProperty(prototype, name, desc);
	            } else {
	                prototype[name] = prop[name];
	            }
	        }
	    }
	    Class.extend=HClass.extend;
	    return Class;
	}
	module.exports = HClass;

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var WheelClass=__webpack_require__(4);
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

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var WheelClass=__webpack_require__(4);
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

/***/ }
/******/ ]);