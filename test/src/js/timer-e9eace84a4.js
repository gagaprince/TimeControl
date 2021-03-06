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

	__webpack_require__(2);

/***/ },
/* 1 */,
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

	    }
	    global.TimerControl = factory();
	}(typeof window !== "undefined" ? window : this, function() {
	    __webpack_require__(3);
	    var timerHtml = __webpack_require__(7)({});

	    var DateUtil = __webpack_require__(8);

	    var DateWheelClass = __webpack_require__(9);
	    var HourWheelClass = __webpack_require__(13);
	    var MinuWheelClass = __webpack_require__(14);

	    var QEvent = __webpack_require__(12).QEvent;
	    var em = __webpack_require__(12).EventManager;

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
	                console.log(_this.getSelectDate());
	                _this.postTimeChangeMsg();
	            });
	            em.addEventListener(QEvent.EventName.ON_HOUR_CHANGE,function(e){
	                console.log(_this.getSelectDate());
	                _this.postTimeChangeMsg();
	            });
	            em.addEventListener(QEvent.EventName.ON_MINU_CHANGE,function(e){
	                console.log(_this.getSelectDate());
	                _this.postTimeChangeMsg();
	            });
	            //添加对 取消 确定按钮的侦听
	            $("#carTimeSure").on("click",function(){
	                //隐藏当前控件 并调用传入的回调
	                _this.hide();
	                var select = _this.getSelectDate();
	                if(select==-1){
	                    //立即用车
	                    alert("立即用车");
	                }else{
	                    alert(DateUtil.dateFormat('yyyy-MM-dd hh:mm',_this.getSelectDate()));
	                }

	            });
	            $("#carTimeCansel").on("click",function(){
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
	                step:15//最小时间刻度
	            },options);
	            this.initStep();
	            this.initImmeButtonFlag();
	            this.initCurrentShow();
	            this.initDateRange();
	            this.initTitle();
	            this.initAviableDateRange();
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

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(4);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(6)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../../node_modules/.0.25.0@css-loader/index.js!./../../../node_modules/.2.2.3@less-loader/index.js!./timer.less", function() {
				var newContent = require("!!./../../../node_modules/.0.25.0@css-loader/index.js!./../../../node_modules/.2.2.3@less-loader/index.js!./timer.less");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(5)();
	// imports


	// module
	exports.push([module.id, "* {\n  margin: 0;\n  padding: 0;\n}\nbody .car-timer {\n  width: 100%;\n  height: 250px;\n  position: fixed;\n  bottom: 0;\n  background: #fff;\n}\nbody .car-timer .car-title {\n  width: 100%;\n  height: 40px;\n  display: -webkit-box;\n  display: -moz-box;\n  display: box;\n  box-orient: horizontal;\n  -webkit-box-orient: horizontal;\n  -moz-box-orient: horizontal;\n  -o-box-orient: horizontal;\n  box-pack: center;\n  -webkit-box-pack: center;\n  -moz-box-pack: center;\n  -o-box-pack: center;\n  box-align: center;\n  -webkit-box-align: center;\n  -moz-box-align: center;\n  -o-box-align: center;\n  font-size: 14px;\n  color: #666;\n  position: relative;\n}\nbody .car-timer .car-title:after {\n  content: \"\";\n  width: 200%;\n  height: 200%;\n  border-bottom: 1px solid #eee;\n  display: block;\n  position: absolute;\n  -webkit-transform: scale(0.5, 0.5);\n  -moz-transform: scale(0.5, 0.5);\n  -o-transform: scale(0.5, 0.5);\n  transform: scale(0.5, 0.5);\n  z-index: 1;\n  -webkit-transform-origin: 0 0;\n  -moz-transform-origin: 0 0;\n  -o-transform-origin: 0 0;\n  transform-origin: 0 0;\n}\nbody .car-timer .car-title .car-btn-cansel {\n  position: absolute;\n  left: 0;\n  width: 60px;\n  height: 40px;\n  display: -webkit-box;\n  display: -moz-box;\n  display: box;\n  box-orient: horizontal;\n  -webkit-box-orient: horizontal;\n  -moz-box-orient: horizontal;\n  -o-box-orient: horizontal;\n  box-pack: center;\n  -webkit-box-pack: center;\n  -moz-box-pack: center;\n  -o-box-pack: center;\n  box-align: center;\n  -webkit-box-align: center;\n  -moz-box-align: center;\n  -o-box-align: center;\n  color: #999;\n  z-index: 2;\n}\nbody .car-timer .car-title .car-btn-sure {\n  position: absolute;\n  right: 0;\n  width: 60px;\n  height: 40px;\n  display: -webkit-box;\n  display: -moz-box;\n  display: box;\n  box-orient: horizontal;\n  -webkit-box-orient: horizontal;\n  -moz-box-orient: horizontal;\n  -o-box-orient: horizontal;\n  box-pack: center;\n  -webkit-box-pack: center;\n  -moz-box-pack: center;\n  -o-box-pack: center;\n  box-align: center;\n  -webkit-box-align: center;\n  -moz-box-align: center;\n  -o-box-align: center;\n  color: #ffab4e;\n  z-index: 2;\n}\nbody .car-timer .car-body {\n  display: -webkit-box;\n  display: -moz-box;\n  display: box;\n  box-orient: horizontal;\n  -webkit-box-orient: horizontal;\n  -moz-box-orient: horizontal;\n  -o-box-orient: horizontal;\n  box-pack: center;\n  -webkit-box-pack: center;\n  -moz-box-pack: center;\n  -o-box-pack: center;\n  box-align: center;\n  -webkit-box-align: center;\n  -moz-box-align: center;\n  -o-box-align: center;\n  height: 210px;\n}\nbody .car-timer .car-body .car-time-show {\n  display: -webkit-box;\n  display: -moz-box;\n  display: box;\n  box-orient: horizontal;\n  -webkit-box-orient: horizontal;\n  -moz-box-orient: horizontal;\n  -o-box-orient: horizontal;\n  box-pack: center;\n  -webkit-box-pack: center;\n  -moz-box-pack: center;\n  -o-box-pack: center;\n  box-align: center;\n  -webkit-box-align: start;\n  -moz-box-align: start;\n  -o-box-align: start;\n  width: 90%;\n}\nbody .car-timer .car-body .car-time-show .car-time-frame {\n  height: 180px;\n  overflow: hidden;\n  position: relative;\n}\nbody .car-timer .car-body .car-time-show .car-time-frame .mask-up,\nbody .car-timer .car-body .car-time-show .car-time-frame .mask-down {\n  width: 100%;\n  height: 75px;\n  position: absolute;\n  z-index: 1;\n  background: rgba(255, 255, 255, 0.6);\n}\nbody .car-timer .car-body .car-time-show .car-time-frame .mask-down {\n  bottom: 0;\n}\nbody .car-timer .car-body .car-time-show .car-time-frame .car-time-list {\n  font-size: 18px;\n}\nbody .car-timer .car-body .car-time-show .car-time-frame .car-time-list .car-time-date {\n  height: 30px;\n  width: 175px;\n  display: -webkit-box;\n  display: -moz-box;\n  display: box;\n  box-orient: horizontal;\n  -webkit-box-orient: horizontal;\n  -moz-box-orient: horizontal;\n  -o-box-orient: horizontal;\n  box-pack: center;\n  -webkit-box-pack: center;\n  -moz-box-pack: center;\n  -o-box-pack: center;\n  box-align: center;\n  -webkit-box-align: center;\n  -moz-box-align: center;\n  -o-box-align: center;\n}\nbody .car-timer .car-body .car-time-show .car-time-frame .car-time-list .car-time-hour {\n  width: 80px;\n  height: 30px;\n  display: -webkit-box;\n  display: -moz-box;\n  display: box;\n  box-orient: horizontal;\n  -webkit-box-orient: horizontal;\n  -moz-box-orient: horizontal;\n  -o-box-orient: horizontal;\n  box-pack: center;\n  -webkit-box-pack: center;\n  -moz-box-pack: center;\n  -o-box-pack: center;\n  box-align: center;\n  -webkit-box-align: center;\n  -moz-box-align: center;\n  -o-box-align: center;\n}\nbody .car-timer .car-body .car-time-show .car-time-frame .car-time-list .car-time-minu {\n  width: 80px;\n  height: 30px;\n  display: -webkit-box;\n  display: -moz-box;\n  display: box;\n  box-orient: horizontal;\n  -webkit-box-orient: horizontal;\n  -moz-box-orient: horizontal;\n  -o-box-orient: horizontal;\n  box-pack: center;\n  -webkit-box-pack: center;\n  -moz-box-pack: center;\n  -o-box-pack: center;\n  box-align: center;\n  -webkit-box-align: center;\n  -moz-box-align: center;\n  -o-box-align: center;\n}\n", ""]);

	// exports


/***/ },
/* 5 */
/***/ function(module, exports) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	// css base code, injected by the css-loader
	module.exports = function() {
		var list = [];

		// return the list of modules as css string
		list.toString = function toString() {
			var result = [];
			for(var i = 0; i < this.length; i++) {
				var item = this[i];
				if(item[2]) {
					result.push("@media " + item[2] + "{" + item[1] + "}");
				} else {
					result.push(item[1]);
				}
			}
			return result.join("");
		};

		// import a list of modules into the list
		list.i = function(modules, mediaQuery) {
			if(typeof modules === "string")
				modules = [[null, modules, ""]];
			var alreadyImportedModules = {};
			for(var i = 0; i < this.length; i++) {
				var id = this[i][0];
				if(typeof id === "number")
					alreadyImportedModules[id] = true;
			}
			for(i = 0; i < modules.length; i++) {
				var item = modules[i];
				// skip already imported module
				// this implementation is not 100% perfect for weird media query combinations
				//  when a module is imported multiple times with different media queries.
				//  I hope this will never occur (Hey this way we have smaller bundles)
				if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
					if(mediaQuery && !item[2]) {
						item[2] = mediaQuery;
					} else if(mediaQuery) {
						item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
					}
					list.push(item);
				}
			}
		};
		return list;
	};


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	var stylesInDom = {},
		memoize = function(fn) {
			var memo;
			return function () {
				if (typeof memo === "undefined") memo = fn.apply(this, arguments);
				return memo;
			};
		},
		isOldIE = memoize(function() {
			return /msie [6-9]\b/.test(window.navigator.userAgent.toLowerCase());
		}),
		getHeadElement = memoize(function () {
			return document.head || document.getElementsByTagName("head")[0];
		}),
		singletonElement = null,
		singletonCounter = 0,
		styleElementsInsertedAtTop = [];

	module.exports = function(list, options) {
		if(false) {
			if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
		}

		options = options || {};
		// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
		// tags it will allow on a page
		if (typeof options.singleton === "undefined") options.singleton = isOldIE();

		// By default, add <style> tags to the bottom of <head>.
		if (typeof options.insertAt === "undefined") options.insertAt = "bottom";

		var styles = listToStyles(list);
		addStylesToDom(styles, options);

		return function update(newList) {
			var mayRemove = [];
			for(var i = 0; i < styles.length; i++) {
				var item = styles[i];
				var domStyle = stylesInDom[item.id];
				domStyle.refs--;
				mayRemove.push(domStyle);
			}
			if(newList) {
				var newStyles = listToStyles(newList);
				addStylesToDom(newStyles, options);
			}
			for(var i = 0; i < mayRemove.length; i++) {
				var domStyle = mayRemove[i];
				if(domStyle.refs === 0) {
					for(var j = 0; j < domStyle.parts.length; j++)
						domStyle.parts[j]();
					delete stylesInDom[domStyle.id];
				}
			}
		};
	}

	function addStylesToDom(styles, options) {
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			if(domStyle) {
				domStyle.refs++;
				for(var j = 0; j < domStyle.parts.length; j++) {
					domStyle.parts[j](item.parts[j]);
				}
				for(; j < item.parts.length; j++) {
					domStyle.parts.push(addStyle(item.parts[j], options));
				}
			} else {
				var parts = [];
				for(var j = 0; j < item.parts.length; j++) {
					parts.push(addStyle(item.parts[j], options));
				}
				stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
			}
		}
	}

	function listToStyles(list) {
		var styles = [];
		var newStyles = {};
		for(var i = 0; i < list.length; i++) {
			var item = list[i];
			var id = item[0];
			var css = item[1];
			var media = item[2];
			var sourceMap = item[3];
			var part = {css: css, media: media, sourceMap: sourceMap};
			if(!newStyles[id])
				styles.push(newStyles[id] = {id: id, parts: [part]});
			else
				newStyles[id].parts.push(part);
		}
		return styles;
	}

	function insertStyleElement(options, styleElement) {
		var head = getHeadElement();
		var lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];
		if (options.insertAt === "top") {
			if(!lastStyleElementInsertedAtTop) {
				head.insertBefore(styleElement, head.firstChild);
			} else if(lastStyleElementInsertedAtTop.nextSibling) {
				head.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling);
			} else {
				head.appendChild(styleElement);
			}
			styleElementsInsertedAtTop.push(styleElement);
		} else if (options.insertAt === "bottom") {
			head.appendChild(styleElement);
		} else {
			throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
		}
	}

	function removeStyleElement(styleElement) {
		styleElement.parentNode.removeChild(styleElement);
		var idx = styleElementsInsertedAtTop.indexOf(styleElement);
		if(idx >= 0) {
			styleElementsInsertedAtTop.splice(idx, 1);
		}
	}

	function createStyleElement(options) {
		var styleElement = document.createElement("style");
		styleElement.type = "text/css";
		insertStyleElement(options, styleElement);
		return styleElement;
	}

	function createLinkElement(options) {
		var linkElement = document.createElement("link");
		linkElement.rel = "stylesheet";
		insertStyleElement(options, linkElement);
		return linkElement;
	}

	function addStyle(obj, options) {
		var styleElement, update, remove;

		if (options.singleton) {
			var styleIndex = singletonCounter++;
			styleElement = singletonElement || (singletonElement = createStyleElement(options));
			update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
			remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
		} else if(obj.sourceMap &&
			typeof URL === "function" &&
			typeof URL.createObjectURL === "function" &&
			typeof URL.revokeObjectURL === "function" &&
			typeof Blob === "function" &&
			typeof btoa === "function") {
			styleElement = createLinkElement(options);
			update = updateLink.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
				if(styleElement.href)
					URL.revokeObjectURL(styleElement.href);
			};
		} else {
			styleElement = createStyleElement(options);
			update = applyToTag.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
			};
		}

		update(obj);

		return function updateStyle(newObj) {
			if(newObj) {
				if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
					return;
				update(obj = newObj);
			} else {
				remove();
			}
		};
	}

	var replaceText = (function () {
		var textStore = [];

		return function (index, replacement) {
			textStore[index] = replacement;
			return textStore.filter(Boolean).join('\n');
		};
	})();

	function applyToSingletonTag(styleElement, index, remove, obj) {
		var css = remove ? "" : obj.css;

		if (styleElement.styleSheet) {
			styleElement.styleSheet.cssText = replaceText(index, css);
		} else {
			var cssNode = document.createTextNode(css);
			var childNodes = styleElement.childNodes;
			if (childNodes[index]) styleElement.removeChild(childNodes[index]);
			if (childNodes.length) {
				styleElement.insertBefore(cssNode, childNodes[index]);
			} else {
				styleElement.appendChild(cssNode);
			}
		}
	}

	function applyToTag(styleElement, obj) {
		var css = obj.css;
		var media = obj.media;

		if(media) {
			styleElement.setAttribute("media", media)
		}

		if(styleElement.styleSheet) {
			styleElement.styleSheet.cssText = css;
		} else {
			while(styleElement.firstChild) {
				styleElement.removeChild(styleElement.firstChild);
			}
			styleElement.appendChild(document.createTextNode(css));
		}
	}

	function updateLink(linkElement, obj) {
		var css = obj.css;
		var sourceMap = obj.sourceMap;

		if(sourceMap) {
			// http://stackoverflow.com/a/26603875
			css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
		}

		var blob = new Blob([css], { type: "text/css" });

		var oldSrc = linkElement.href;

		linkElement.href = URL.createObjectURL(blob);

		if(oldSrc)
			URL.revokeObjectURL(oldSrc);
	}


/***/ },
/* 7 */
/***/ function(module, exports) {

	module.exports = function anonymous(it
	/**/) {
	var out='<div class="car-timer" id="carTimer"> <div class="car-title"> <div class="car-btn-cansel" id="carTimeCansel">取消</div> <div class="car-btn-sure" id="carTimeSure">确定</div> <font id="carTimeTile">请选择时间</font> </div> <div class="car-body"> <div class="car-time-show"> <div class="car-time-frame" id="carTimeControlDate"> <div class="mask-up"></div> <div class="mask-down"></div> <div class="car-time-list"> </div> </div> <div class="car-time-frame" id="carTimeControlHour"> <div class="mask-up"></div> <div class="mask-down"></div> <div class="car-time-list"> </div> </div> <div class="car-time-frame" id="carTimeControlMinu"> <div class="mask-up"></div> <div class="mask-down"></div> <div class="car-time-list"> </div> </div> </div> </div> </div>';return out;
	}

/***/ },
/* 8 */
/***/ function(module, exports) {

	var DateUtil = {
	    //其实是获取端时间
	    now:function(){
	        return new Date();
	    },
	    //两个时间作比较 前者>后者返回true
	    comparerDate:function(date1,date2){
	        var time1 = date1.getTime();
	        var time2 = date2.getTime();
	        return time1>time2;
	    },
	    getDayDate:function(date){
	        var dateStr = this.dateFormat("yyyy-MM-dd",date);
	        return this.parseStrToDate(dateStr);
	    },
	    //将字符串转为时间类型
	    parseStrToDate:function(dateStr){
	        var date = new Date(dateStr.replace(/-/g,"/"));
	        return date;
	    },
	    //已当前时间为基准 加减时间
	    dateAdd:function(date,nms){
	        if(!date)return;
	        if(date=="Invalid Date"){
	            return "";
	        }
	        var time = date.getTime();
	        var newDate = new Date();
	        newDate.setTime(time+nms);
	        return newDate;
	    },
	    //返回周几
	    dateWeekDay:function(date){
	        var weekDay = ["日","一","二","三","四","五","六"];
	        return weekDay[date.getDay()];
	    },
	    //将时间转为格式化字符串
	    dateFormat:function(fmt,date){
	        if(!date){
	            date = this.now();
	        }
	        var o = {
	            "M+": date.getMonth() + 1, //月份
	            "d+": date.getDate(), //日
	            "D+": this.dateWeekDay(date),
	            "h+": date.getHours(), //小时
	            "m+": date.getMinutes(), //分
	            "s+": date.getSeconds(), //秒
	            "q+": Math.floor((date.getMonth() + 3) / 3), //季度
	            "S": date.getMilliseconds() //毫秒
	        };
	        if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
	        for (var k in o)
	            if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
	        return fmt;
	    }
	};
	module.exports = DateUtil;

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var WheelClass=__webpack_require__(10);
	var DateUtil = __webpack_require__(8);
	var QEvent = __webpack_require__(12).QEvent;
	var em = __webpack_require__(12).EventManager;
	var DateWheelClass = WheelClass.extend({
	    itemClassName:"car-time-date",
	    minTime:null,
	    maxTime:null,
	    ctrler:null,//父级控制组件
	    isLiji:false,
	    currentTime:"",
	    ctor:function(ctrl){
	        this.ctrler = ctrl;
	        this._super("carTimeControlDate");
	    },
	    resetTextList:function(minTime,maxTime,isLiji,currentTime){
	        this.minTime = minTime;
	        this.maxTime = maxTime;
	        this.isLiji = isLiji;
	        this.currentTime = currentTime;
	        var textList = this.produceTextList(minTime,maxTime,isLiji);
	        this._super(textList);
	        this.initDefault();
	    },
	    produceTextList:function(minTime,maxTime,isLiji){
	        var textList=[];
	        var now = minTime;
	        if(isLiji){
	            textList.push("立即用车");
	        }
	        function _myComparer(date1,date2){//只比较date1 date2的日期
	            var maxDate = DateUtil.parseStrToDate(DateUtil.dateFormat("yyyy-MM-dd",date1));
	            var nowDate = DateUtil.parseStrToDate(DateUtil.dateFormat("yyyy-MM-dd",date2));
	            return DateUtil.comparerDate(maxDate,nowDate);
	        }
	        for(var i=0;!_myComparer(now,maxTime);i++){
	            var fm = "MM月dd日 星期D";
	            if(i==0){
	                if(DateUtil.dateFormat("yyyy-MM-dd")==DateUtil.dateFormat("yyyy-MM-dd",now)){
	                    fm = "MM月dd日 今天";
	                }
	            }
	            var dateText = DateUtil.dateFormat(fm,now);
	//            console.log(dateText);
	            textList.push(dateText);
	            now = DateUtil.dateAdd(now,24*3600*1000);
	        }

	        return textList;
	    },

	    initDefault:function(){
	        var currentTime = this.currentTime;
	        var currentIndex=0;
	        if(currentTime!=""){
	            var currentTimeDate = DateUtil.parseStrToDate(currentTime);
	            var currentDay = DateUtil.getDayDate(currentTimeDate);
	            var minDay = DateUtil.getDayDate(this.minTime);
	            var days = (currentDay.getTime()-minDay.getTime())/(24*3600000);
	            currentIndex = days;
	        }
	        if(this.isLiji){
	            currentIndex++;
	        }
	        this.currentIndex=currentIndex;
	        this.resetPos();
	    },
	    getSelect:function(){
	        var currentIndex = this.currentIndex;
	        if(this.isLiji){
	            if(currentIndex==0){
	                return -1;//返回-1 说明是立即用车
	            }
	            currentIndex--;
	        }
	        var select = DateUtil.dateAdd(this.minTime,currentIndex*24*3600000);
	        return DateUtil.dateFormat("yyyy-MM-dd",select);
	    },
	    onCurrentIndexChange:function(){
	        var event = new QEvent(QEvent.EventName.ON_DATE_CHANGE);
	        em.postMsg(event);
	    }
	});
	module.exports = DateWheelClass;

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var HClass = __webpack_require__(11);
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

	    stopMoveFlag:false,
	    ctor:function(id){
	        this.init(id);
	    },
	    init:function(id){
	        if(!id){
	            throw "wheelClass need a dom id";
	        }
	        this.id = id;
	        this.ele = $("#"+id);
	        if(this.ele.length==0){
	            throw "the id dom is not exist!";
	        }
	        this.elList = this.ele.find('.car-time-list');
	        this.initListener();
	    },
	    resetTextList:function(textList,current){
	        if(!textList){
	            throw "wheelClass need a array of text!";
	        }
	        this.textList = textList;
	        if(current){
	            this.currentText = current;
	        }
	        this.initList();
	        this.resetPos();
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
	    resetPos:function(datY,isUpdate,fromBufferMove){
	    //isUpdate 指是否更新currentIndex    fromBufferMove 是否来源于缓冲
	        //如果来源于缓冲的话 要看是否触发边界  如果触发边界 则 isUpdate=true
	        var needDuration = 0;
	        if(typeof datY == "undefined"){
	            datY = 0;
	            needDuration = 0.3;
	        }
	        //重置位置

	        var _this = this;
	        this._cacularNowPos(datY,function(pos,isend){//是否触发了边界
	            _this._transLateTo(-pos,needDuration);
	//            console.log("fromBufferMove&&isend:"+(fromBufferMove&&isend));
	            if(isUpdate||(fromBufferMove&&isend)){
	                var currentIndex = _this._cacularNowIndex(datY);
	//                console.log("currentIndex:"+currentIndex);
	                _this.currentIndex=currentIndex;
	                _this.resetPos();
	                _this.onCurrentIndexChange();//当滚轮变化时触发；
	            }
	        });
	    },
	    onCurrentIndexChange:function(){
	        //这个方法会在子方法中被重写
	    },
	    _cacularNowIndex:function(datY){
	        var  textList =this.textList;
	        var currentIndex = this.currentIndex;
	        var step = this.step;
	//        console.log("cacularDaty:"+datY);;
	        currentIndex = currentIndex-Math.floor(datY/step+0.5);
	//        console.log("_cacularNowIndex:"+currentIndex);
	        if(currentIndex<0){
	            currentIndex=0;
	        }
	        if(currentIndex>textList.length-1){
	            currentIndex = textList.length-1;
	        }
	        return currentIndex;
	    },
	    _cacularNowPos:function(datY,onCacular){
	        var step = this.step;
	        var currentIndex = this.currentIndex;
	        var pos = currentIndex*step-this.skew-datY;//需要移动的pos位置

	        //边界检测
	        var  textList =this.textList;
	        var topIndex = textList.length+2;
	        var topPos = topIndex*step-this.skew;
	        var isEnd = false;
	        if(pos>topPos){
	            pos = topPos;
	            this.stopBufferMove();
	            isEnd = true;
	        }
	        if(pos<-2*this.skew){
	            pos = -2*this.skew;
	            this.stopBufferMove();
	            isEnd = true;
	        }

	        if(onCacular){
	            onCacular(pos,isEnd);
	        }
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
	        var timeStart = 0;//时间刻度
	        var timeEnd = 0;//时间刻度
	        var speed = 0;//瞬时速度
	        elDom.addEventListener("touchstart",function(e){
	            var touch = e.touches[0];
	            touchStart = {
	                x:touch.pageX,
	                y:touch.pageY
	            }
	            timeStart = new Date().getTime();
	        },false);
	        elDom.addEventListener("touchmove",function(e){
	            var touch = e.touches[0];
	            var touchPre = touchCurrent||touchStart;
	            touchCurrent = {
	                x:touch.pageX,
	                y:touch.pageY
	            }

	            var datY = touchCurrent.y-touchStart.y;
	            _this.resetPos(datY);
	            //计算瞬时速度
	            timeEnd = new Date().getTime();
	            speed = (touchCurrent.y-touchPre.y)/(timeEnd-timeStart);
	            timeStart = timeEnd;
	        },false);
	        elDom.addEventListener("touchend",function(e){
	//            console.log("touchend");
	            var touch = e.changedTouches[0];

	            touchEnd = {
	                x:touch.pageX,
	                y:touch.pageY
	            }
	//            console.log("touchEnd");
	//            console.log(touchEnd);
	//            console.log("touchStart");
	//            console.log(touchStart);
	            var datY = touchEnd.y-touchStart.y;
	            //_this.resetPos(datY,true);
	            //缓冲运动
	//            console.log("speed:"+speed);
	            _this.bufferMove(datY,speed);
	            touchCurrent=null;
	            touchStart = null;
	            touchEnd = null;
	        },false);
	    },
	    stopBufferMove:function(){
	        this.stopMoveFlag = true;
	    },
	    bufferMove:function(datY,v){
	        //v=-1;
	        this.stopMoveFlag = false;
	        this._move(0,v,datY);
	    },
	    _move:function(dt,v,datY){
	        var g = 0.005;//加速度
	        var vend = Math.abs(v)-dt*g;
	//        console.log("vend:"+vend);
	        if(vend<0){
	            vend=0;
	        }
	        var dis = (v*v-vend*vend)/2/g;
	        var nowDatY = datY;
	        if(v!=0){
	            nowDatY = datY+v/Math.abs(v)*dis;
	        }

	//        console.log("resetPos datY:"+nowDatY);
	        this.resetPos(nowDatY,vend==0,true);
	        var _this = this;
	        if(vend!=0){
	            if(!this.stopMoveFlag){
	                setTimeout(function(){
	                    _this._move(dt+20,v,datY);
	                },20);
	            }else{
	                this.stopMoveFlag = false;
	            }
	        }

	    },
	    hide:function(){
	        this.ele.hide();
	    },
	    show:function(){
	        this.ele.show();
	    }
	});

	module.exports = WheelClass;

/***/ },
/* 11 */
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
/* 12 */
/***/ function(module, exports) {

	"use strict";
	/**
	 * 小型的事件注册 侦听的manage
	 * */
	//事件类
	function QEvent(name){
	    this.name = name;
	}
	QEvent.prototype={
	    name:null,
	    getName:function(){
	        return this.name;
	    }
	}
	QEvent.EventName={
	    "ON_DATE_CHANGE":"onDateChange",
	    "ON_HOUR_CHANGE":"onHourChange",
	    "ON_MINU_CHANGE":"onMinuChange",
	    "ON_TIME_CHANGE":"onTimeChange"
	}


	var EventManager = {
	    eventMap:{},

	    addEventListener:function(eventName,callback){
	        if(callback){
	            var eventMap = this.eventMap;
	            if(!eventMap[eventName]){
	                eventMap[eventName] = [];
	            }
	            eventMap[eventName].push(callback);
	        }
	    },
	    postMsg:function(event){//event 是一个事件对象
	        var eventName = event.getName();
	        var eventMap = this.eventMap;
	        if(eventMap[eventName]){
	            var list = eventMap[eventName];
	            var itemCall = list[0];
	            for(var i=0;itemCall;itemCall=list[++i]){
	                itemCall(event);
	            }
	        }
	    }
	}

	module.exports = {
	    EventManager:EventManager,
	    QEvent:QEvent
	};

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var WheelClass=__webpack_require__(10);
	var QEvent = __webpack_require__(12).QEvent;
	var em = __webpack_require__(12).EventManager;
	var DateUtil = __webpack_require__(8);
	var HourWheelClassHour = WheelClass.extend({
	    itemClassName:"car-time-hour",
	    minTime:null,
	    maxTime:null,
	    ctrler:null,//父级控制组件
	    currentTime:"",
	    ctor:function(ctrl){
	        this.ctrler = ctrl;
	        this._super("carTimeControlHour");
	    },
	    resetTextList:function(minTime,maxTime,currentTime){
	        this.minTime = minTime;
	        this.maxTime = maxTime;
	        this.currentTime = currentTime;
	        var textList = this.produceTextList();
	        this._super(textList);
	        this.initDefault();
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
	    },
	    initDefault:function(){
	        var currentTime = this.currentTime;
	        if(currentTime!=""){
	            var currentDate = DateUtil.parseStrToDate(currentTime);
	            this.resetPosByHour(currentDate,true);
	        }
	    },
	    getSelect:function(){
	        var currentIndex = this.currentIndex;
	        return currentIndex;
	    },
	    onCurrentIndexChange:function(){
	        var event = new QEvent(QEvent.EventName.ON_HOUR_CHANGE);
	        em.postMsg(event);
	    },
	    resetPosByHour:function(date,noExcuteChange){
	        var hour = date.getHours();
	        if(this.currentIndex!=hour){
	            this.currentIndex = hour;
	            this.resetPos();
	            if(!noExcuteChange){
	                this.onCurrentIndexChange();//当滚轮变化时触发；
	            }
	        }
	    },
	    resetMinPos:function(){
	        this.resetPosByHour(this.minTime);
	    },
	    resetMaxPos:function(){
	        this.resetPosByHour(this.maxTime);
	    },
	    initListener:function(){
	        this._super();
	        var _this = this;
	        var ctrl = this.ctrler;
	        em.addEventListener(QEvent.EventName.ON_TIME_CHANGE,function(e){
	            var nowSelect = ctrl.getSelectDate();
	            if(nowSelect==-1){
	                //马上用车
	                _this.hide();
	            }else{
	                _this.show();
	                //如果当前所选时间小于最小时间 则需要调整
	                if(DateUtil.comparerDate(_this.minTime,nowSelect)){
	                    //调整小时滚轮 到最小刻度
	                    console.log("需要调整最小小时数");
	                    _this.resetMinPos();
	                }
	                console.log("maxtime");
	                console.log(_this.maxTime);
	                if(DateUtil.comparerDate(nowSelect,_this.maxTime)){
	                    //调整小时滚轮 到最小刻度
	                    console.log("需要调整最大小时数");
	                    _this.resetMaxPos();
	                }
	            }

	        });
	    }
	});
	module.exports = HourWheelClassHour;

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var WheelClass=__webpack_require__(10);
	var QEvent = __webpack_require__(12).QEvent;
	var em = __webpack_require__(12).EventManager;
	var DateUtil = __webpack_require__(8);
	var MinuWheelClass = WheelClass.extend({
	    itemClassName:"car-time-minu",
	    minTime:null,
	    maxTime:null,
	    timeStep:null,
	    ctrler:null,//父级控制组件
	    currentTime:"",
	    ctor:function(ctrl){
	        this.ctrler = ctrl;
	        this._super("carTimeControlMinu");
	    },
	    resetTextList:function(minTime,maxTime,step,currentTime){
	        this.minTime = minTime;
	        this.maxTime = maxTime;
	        this.timeStep = step;
	        this.currentTime=currentTime;
	        var textList = this.produceTextList(step);
	        this._super(textList);
	        this.initDefault();
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
	    },
	    initDefault:function(){
	        var currentTime = this.currentTime;
	        if(currentTime!=""){
	            var currentDate = DateUtil.parseStrToDate(currentTime);
	            this.resetPosByMinu(currentDate,true);
	        }
	    },
	    getSelect:function(){
	        var currentIndex = this.currentIndex;
	        var step = this.timeStep;
	        return currentIndex*step;
	    },
	    onCurrentIndexChange:function(){
	        var event = new QEvent(QEvent.EventName.ON_MINU_CHANGE);
	        em.postMsg(event);
	    },
	    resetPosByMinu:function(date,noExcuteChange){
	        var minu = date.getMinutes();
	        var index = Math.floor(minu/this.timeStep);
	        if(this.currentIndex!=index){
	            this.currentIndex = index;
	            this.resetPos();
	            if(!noExcuteChange){
	                this.onCurrentIndexChange();//当滚轮变化时触发；
	            }
	        }
	    },
	    resetMinPos:function(){
	        this.resetPosByMinu(this.minTime);
	    },
	    resetMaxPos:function(){
	        this.resetPosByMinu(this.maxTime);
	    },
	    initListener:function(){
	        this._super();
	        var _this = this;
	        var ctrl = this.ctrler;
	        em.addEventListener(QEvent.EventName.ON_TIME_CHANGE,function(e){
	            var nowSelect = ctrl.getSelectDate();
	            if(nowSelect==-1){
	                //立即用车
	                //将当前wheel 隐藏
	                _this.hide();
	            }else{
	                _this.show();
	                //如果当前所选时间小于最小时间 则需要调整
	                if(DateUtil.comparerDate(_this.minTime,nowSelect)){
	                    //调整小时滚轮 到最小刻度
	                    console.log("需要调整最小分钟数");
	                    _this.resetMinPos();
	                }
	                if(DateUtil.comparerDate(nowSelect,_this.maxTime)){
	                    //调整小时滚轮 到最小刻度
	                    console.log("需要调整最大分钟数");
	                    _this.resetMaxPos();
	                }
	            }

	        });
	    }
	});
	module.exports = MinuWheelClass;

/***/ }
/******/ ]);