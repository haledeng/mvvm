(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else {
		var a = factory();
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
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

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.MVVM = undefined;

	var _compiler = __webpack_require__(1);

	var _compiler2 = _interopRequireDefault(_compiler);

	var _observer = __webpack_require__(12);

	var _observer2 = _interopRequireDefault(_observer);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } } /**
	                                                                                                                                                           * entry
	                                                                                                                                                           */

	var MVVM = function MVVM(options) {
		_classCallCheck(this, MVVM);

		this.$data = options.data || {};
		this.$el = typeof options.el === 'string' ? document.querySelector(options.el) : options.el || document.body;
		this.methods = options.methods;
		this.filters = options.filters || {};
		new _observer2.default(this.$data);
		new _compiler2.default({
			el: this.$el,
			vm: this
		});
	};

	exports.MVVM = MVVM;

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _util = __webpack_require__(2);

	var _ = _interopRequireWildcard(_util);

	var _watcher = __webpack_require__(3);

	var _watcher2 = _interopRequireDefault(_watcher);

	var _index = __webpack_require__(7);

	var _filter = __webpack_require__(6);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Compiler = function () {
		function Compiler(opts) {
			_classCallCheck(this, Compiler);

			this.$el = typeof opts.el === 'string' ? document.querySelector(opts.el) : opts.el;
			this.$vm = opts.vm;
			this.init();
		}

		_createClass(Compiler, [{
			key: 'init',
			value: function init() {

				this.traversalNode(this.$el);
			}
		}, {
			key: 'traversalNode',
			value: function traversalNode(node) {
				// elements应该是动态变化的
				// 遍历方式有问题
				// 遍历节点
				var self = this;
				// var elements = node.getElementsByTagName('*');
				// elements = [].slice.call(elements);
				// elements.unshift(node);
				// elements.forEach(function(element) {
				// 	self.traversalAttribute(element);
				// 	// 模板不编译
				// 	if (self.isTextNode(element) && !element.__template__) {
				// 		self.parseTextNode(element);
				// 	}
				// 	// TODO: removeChild后，elements需要重新获取
				// });

				function _traversal(node) {
					self.traversalAttribute(node);
					if (self.isTextNode(node)) {
						self.parseTextNode(node);
					} else {
						// node has been removed
						if (node.parentNode) {
							var elements = node.children;
							elements = [].slice.call(elements);
							elements.forEach(function (element) {
								_traversal(element);
							});
						}
					}
				}
				_traversal(node);
			}
		}, {
			key: 'traversalAttribute',
			value: function traversalAttribute(node) {

				var self = this;
				// 遍历属性
				var attrs = node.attributes;
				for (var i = 0; i < attrs.length; i++) {
					var item = attrs[i];
					if (/^v\-([\w\:\']*)/.test(item.name)) {
						this._parseAttr(node, item);
						this.addInputListener(node, item);
					}
				}
			}
		}, {
			key: '_parseAttr',
			value: function _parseAttr(node, attr) {
				// debugger;
				// 转化属性
				var self = this;
				var attrReg = /^v\-([\w\:\']*)/;
				var matches = attr.name.match(attrReg);
				var property = matches[1];
				var eventReg = /on\:(\w*)/;
				if (eventReg.test(property)) {
					var eventName = RegExp.$1;
					_index.vOn.call(this.$vm.$data, node, this.$vm.methods, attr.value, eventName);
					// event handler
				} else {
					switch (property) {
						// v-model
						case 'model':
							// self.bindWatch(self.$vm.$data, attr.value, function() {
							// 	vModel(node, self.$vm.$data, attr.value);
							// });
							// vModel(node, self.$vm.$data, attr.value);


							self.bindWatch(self.$vm, attr.value, function () {
								(0, _index.vModel)(node, self.$vm, attr.value);
							});
							(0, _index.vModel)(node, self.$vm, attr.value);
							break;
						// v-text
						case 'text':
							// filters
							// TODO: watcher 中计算表达式有问题
							// watch 表达式，还是表达式中的变量
							// self.bindWatch(self.$vm.$data, attr.value, function() {
							// 	vText(node, self.$vm.$data, attr.value);
							// });
							// vText(node, this.$vm.$data, attr.value);
							self.bindWatch(self.$vm, attr.value, function () {
								(0, _index.vText)(node, self.$vm, attr.value);
							});
							(0, _index.vText)(node, this.$vm, attr.value);
							break;
						case 'for':
							var info = (0, _index.parseForExpression)(attr.value);
							self.bindWatch(self.$vm, info.val, function () {
								(0, _index.vFor)(node, self.$vm, attr.value);
							});
							(0, _index.vFor)(node, this.$vm, attr.value);
						default:
							break;
					}
				}
			}
		}, {
			key: 'addInputListener',
			value: function addInputListener(node, attr) {
				if (attr.name !== 'v-model') return;
				var key = attr.value;
				var oldVal = (0, _index.parseExpression)(this.$vm, key);
				// var oldVal = this.$vm.$data[key];
				var self = this;
				// v-model监听
				node.addEventListener('input', function () {
					if (node.value != oldVal) {
						(0, _index.setScopeValue)(self.$vm.$data, key, node.value);
						// self.$vm.$data[key] = node.value;
					}
				}, false);
			}
		}, {
			key: 'isTextNode',
			value: function isTextNode(node) {
				return node.children.length === 0 && node.childNodes.length !== 0;
			}
		}, {
			key: 'bindWatch',
			value: function bindWatch(vm, exp, callback) {
				var noop = function noop() {};
				new _watcher2.default({
					vm: vm,
					exp: exp,
					callback: callback || noop
				});
			}
		}, {
			key: 'parseTextNode',
			value: function parseTextNode(node) {
				var self = this;
				var html = node.innerHTML;
				var keys = [];

				// TODO: filters
				var _replace = function _replace(scope) {
					var newHtml = html.replace(/\{\{([^\}]*)\}\}/g, function (all, name) {
						// var rets = parseFilter(name);
						// if (rets) {
						// 	// 计算参数的值
						// 	var paramValue = calculateExpression(scope, rets.param);
						// 	return filter.apply(null, [self.$vm, rets.method, paramValue].concat(rets.args))

						// }
						if (!keys.length) {
							keys.push(name);
						}
						// name = _.trim(name);
						// return calculateExpression(scope, name);

						return (0, _index.parseExpression)(self.$vm, name);
						// return scope[name] !== undefined ? scope[name] : 0;
					});
					node.innerHTML = newHtml;
				};
				_replace(this.$vm.$data);
				keys.forEach(function (key) {
					self.bindWatch(self.$vm, key, _replace);
				});
			}
		}]);

		return Compiler;
	}();

	exports.default = Compiler;

/***/ },
/* 2 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	var trim = function trim(str) {
		if (typeof str !== 'string') {
			return Object.prototype.toString.call(str);
		}
		return str.replace(/^\s*|\s*$/g, '');
	};

	var toString = Object.prototype.toString;

	var isType = function isType(obj, type) {
		return toString.call(obj) === '[object ' + type.replace(/^[a-z]/, type.charAt(0).toUpperCase()) + ']';
	};

	var mixin = function mixin(dest, source) {
		var rewrite = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];

		for (var prop in source) {
			if (source.hasOwnProperty(prop)) {
				if (!rewrite || !dest.hasOwnProperty(prop)) {
					dest[prop] = source[prop];
				}
			}
		}
		return dest;
	};

	exports.trim = trim;
	exports.isType = isType;
	exports.mixin = mixin;

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _depender = __webpack_require__(4);

	var _depender2 = _interopRequireDefault(_depender);

	var _expression = __webpack_require__(5);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	/**
	 *	事件监听的方式来处理
	 */
	// class Watcher {
	// 	constructor() {

	// 	}
	// 	on(name, callback) {
	// 		if (typeof callback === 'function') {
	// 			if (!Watcher._evMaps[name]) {
	// 				Watcher._evMaps[name] = [];
	// 			}
	// 			Watcher._evMaps[name].push(callback);
	// 		}
	// 	}
	// 	off(name) {
	// 		if (Watcher._evMaps[name]) {
	// 			delete Watcher._evMaps[name];
	// 		}
	// 	}
	// 	emit(name) {
	// 		var callbacks = Watcher._evMaps[name];
	// 		var args = [].slice.call(arguments, 1);
	// 		callbacks.forEach(function(callback) {
	// 			callback(args);
	// 		});
	// 	}
	// }
	// Watcher._evMaps = {};
	var uid = 0;

	var Watcher = function () {
		function Watcher(opts) {
			_classCallCheck(this, Watcher);

			this.id = uid++;
			this.vm = opts.vm;
			this.exp = opts.exp;
			this.callback = opts.callback;
			this.value = this.get();
		}

		_createClass(Watcher, [{
			key: 'update',
			value: function update() {
				var newVal = this.get();
				var oldVal = this.value;
				// @TODO: [], {}引用类型，指向了同一个值
				// if (oldVal != newVal) {
				this.value = newVal;
				this.callback(this.vm, newVal, oldVal);
				// }
			}
		}, {
			key: 'get',
			value: function get() {
				_depender2.default.target = this;
				// var value = calculateExpression(this.vm, this.exp);
				var value = (0, _expression.parseExpression)(this.vm, this.exp);
				_depender2.default.target = null;
				return value;
			}
		}]);

		return Watcher;
	}();

	exports.default = Watcher;

/***/ },
/* 4 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Dep = function () {
		function Dep() {
			_classCallCheck(this, Dep);

			this.subs = [];
		}

		_createClass(Dep, [{
			key: "addSub",
			value: function addSub(sub) {
				this.subs.push(sub);
			}
		}, {
			key: "notify",
			value: function notify() {
				this.subs.forEach(function (sub) {
					sub.update();
				});
			}
		}]);

		return Dep;
	}();

	exports.default = Dep;

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.parseExpression = exports.parseFilter = exports.parseForExpression = exports.addScope = exports.calculateExpression = undefined;

	var _util = __webpack_require__(2);

	var _ = _interopRequireWildcard(_util);

	var _filter = __webpack_require__(6);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	// +,-,m.n,*,/
	// 添加上下文
	// AST?
	var addScope = function addScope(exp) {
	    var prefix = arguments.length <= 1 || arguments[1] === undefined ? 'scope' : arguments[1];

	    exp = _.trim(exp);
	    // x.y
	    exp = exp.replace(/\w+(?=\.)/g, function (match, index, all) {
	        return [prefix, match].join('.');
	    });
	    exp = ' ' + exp + ' ';
	    // x
	    exp = exp.replace(/[\+\-\*\/\s]\w+(?![\'\.])[\+\-\*\/\s]/g, function (match, index, all) {
	        match = _.trim(match);
	        if (/^[0-9]*$/.test(match)) {
	            return match;
	        }
	        return [prefix, match].join('.');
	    });
	    return _.trim(exp);
	};

	// 计算表达式
	// strict mode can not use with
	// new Function
	var calculateExpression = function calculateExpression(scope, exp) {
	    // Plan A
	    var prefix = 'scope';
	    exp = addScope(exp);
	    var fn = new Function(prefix, 'return ' + exp);
	    return fn(scope);
	    // Plan B
	    // with(scope) {
	    //  return eval(exp);
	    // }
	};

	function parseExpression(vm, exp) {
	    var data = vm.$data;
	    // debugger;
	    if (hasFilter(exp)) {
	        var filterInfo = parseFilter(exp);
	        var value = calculateExpression(data, filterInfo.param);
	        return _filter.filter.apply(null, [vm, filterInfo.method, value].concat(filterInfo.args));
	        // return filter.apply(vm, filterInfo.method, [filterInfo.param].concat(filterInfo.args));
	    } else {
	        return calculateExpression(data, exp);
	    }
	}

	// v-for expression
	function parseForExpression(expression) {
	    // variable name
	    var valReg = /in\s*([^\s]*)\s*?$/;
	    var ret = {};
	    if (valReg.test(expression)) {
	        ret.val = RegExp.$1;
	    }
	    // template variable name
	    // like: xxx in obj
	    // like: (item, index) in arr
	    // like: (item, value, index) in arr
	    var tempReg = /^\s?(.*)\s*in/;
	    if (tempReg.test(expression)) {
	        var itemStr = _.trim(RegExp.$1);
	        if (~itemStr.indexOf(',')) {
	            itemStr = itemStr.replace(/\(|\)/g, '');
	            itemStr = _.trim(itemStr);
	            var temp = itemStr.split(',');
	            ret.scope = _.trim(temp[0]);
	            ret.index = _.trim(temp[1]);
	        } else {
	            ret.scope = itemStr;
	        }
	    }
	    return ret;
	}

	// 解析filter表达式
	// paramName | filterName arg1 arg2
	function parseFilter(str) {
	    if (!str || str.indexOf('|') === -1) return null;
	    var splits = str.split('|');
	    var paramName = _.trim(splits[0]);
	    var args = _.trim(splits[1]).split(' ');
	    var methodName = args.shift();
	    return {
	        param: paramName,
	        args: typeCheck(args),
	        method: methodName
	    };
	}

	// whether expression has filter
	function hasFilter(exp) {
	    if (!exp || exp.indexOf('|') === -1) return false;
	    return true;
	}

	// 类型转化
	function typeCheck(args) {
	    var rets = [];
	    args.forEach(function (arg, index) {
	        arg = _.trim(arg);
	        // number
	        if (/^[0-9]$/.test(arg)) {
	            rets[index] = Number(arg);
	        } else {
	            // "'string'" => string
	            rets[index] = arg.replace(/^\'|\'$/g, '');
	        }
	    });
	    return rets;
	}

	exports.calculateExpression = calculateExpression;
	exports.addScope = addScope;
	exports.parseForExpression = parseForExpression;
	exports.parseFilter = parseFilter;
	exports.parseExpression = parseExpression;

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.parseFilter = exports.filter = undefined;

	var _util = __webpack_require__(2);

	var _ = _interopRequireWildcard(_util);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	// filters 过滤器
	function filter(vm, name, params) {
		var method = vm.filters[name];
		console.log([params].concat([].slice.call(arguments, 3)));
		return method.apply(vm.$data, [params].concat([].slice.call(arguments, 3)));
	}

	// 解析filter表达式
	function parseFilter(str) {
		if (!str || str.indexOf('|') === -1) return null;
		var splits = str.split('|');
		var paramName = _.trim(splits[0]);
		// paramName | filterName arg1 arg2
		var args = _.trim(splits[1]).split(' ');
		var methodName = args.shift();
		console.log(args);
		return {
			param: paramName,
			args: typeCheck(args),
			method: methodName
		};
	}

	// 类型转化
	function typeCheck(args) {
		var rets = [];
		args.forEach(function (arg, index) {
			arg = _.trim(arg);
			if (/^[0-9]$/.test(arg)) {
				rets[index] = Number(arg);
			} else {
				rets[index] = arg;
			}
		});
		return rets;
	}

	exports.filter = filter;
	exports.parseFilter = parseFilter;

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.parseExpression = exports.parseForExpression = exports.vFor = exports.vOn = exports.calculateExpression = exports.setScopeValue = exports.vText = exports.vModel = undefined;

	var _model = __webpack_require__(8);

	var _model2 = _interopRequireDefault(_model);

	var _text = __webpack_require__(9);

	var _text2 = _interopRequireDefault(_text);

	var _expression = __webpack_require__(5);

	var _event = __webpack_require__(10);

	var _event2 = _interopRequireDefault(_event);

	var _for = __webpack_require__(11);

	var _for2 = _interopRequireDefault(_for);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	// 设置属性值
	var setScopeValue = function setScopeValue(scope, key, value) {
	    if (~key.indexOf('.')) {
	        var namespaces = key.split('.');
	        var last = namespaces.pop();
	        namespaces.forEach(function (name) {
	            scope = scope[name] || (scope[name] = {});
	        });
	        scope[last] = value;
	    } else {
	        scope[key] = value;
	    }
	};

	exports.vModel = _model2.default;
	exports.vText = _text2.default;
	exports.setScopeValue = setScopeValue;
	exports.calculateExpression = _expression.calculateExpression;
	exports.vOn = _event2.default;
	exports.vFor = _for2.default;
	exports.parseForExpression = _expression.parseForExpression;
	exports.parseExpression = _expression.parseExpression;

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _expression = __webpack_require__(5);

	var vModel = function vModel(node, vm, exp) {
		var tagName = node.tagName.toLowerCase();
		// var value = calculateExpression(scope, key);
		var value = (0, _expression.parseExpression)(vm, exp);
		if (tagName === 'input') {
			node.value = value;
		} else if (tagName === 'textarea') {
			node.innerHTML = value;
		}
		// node.removeAttribute('v-model');
	};

	exports.default = vModel;

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _expression = __webpack_require__(5);

	// v-text
	var vText = function vText(node, vm, key) {
		node.innerHTML = (0, _expression.parseExpression)(vm, key);
		// 影响后面attribute遍历
		// node.removeAttribute('v-text');
	};

	exports.default = vText;

/***/ },
/* 10 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	// event hander
	// 事件多次绑定
	function vOn(node, methods, value, eventName) {
		if (typeof value !== 'string') return;
		var method = methods[value] || function () {};
		var self = this;
		node.addEventListener(eventName, function () {
			method.call(self);
		}, false);
	}

	exports.default = vOn;

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _expression = __webpack_require__(5);

	var _util = __webpack_require__(2);

	var _ = _interopRequireWildcard(_util);

	var _compiler = __webpack_require__(1);

	var _compiler2 = _interopRequireDefault(_compiler);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	function vFor(node, vm, expression) {
		var parent = node.parentNode || node.__parent__;
		var tagName = node.tagName.toLowerCase();
		var expInfo = (0, _expression.parseForExpression)(expression);
		var scope = vm.$data;
		var val = (0, _expression.calculateExpression)(scope, expInfo.val);
		if (!_.isType(val, 'array')) return;
		var docFrag = document.createDocumentFragment();
		var template = node.__template__ || node.innerHTML;
		val.forEach(function (item, index) {
			// 子节点如何编译，Compiler中可以，但是需要修改scope
			var li = document.createElement(tagName);
			// TODO: attributes
			li.innerHTML = template;
			// var li = node.cloneNode(true);
			var context = {};
			context[expInfo.scope] = item;
			if (expInfo.index !== undefined) {
				context[expInfo.index] = index;
			}
			new _compiler2.default({
				el: li,
				// TODO: methods, filters
				vm: {
					// mixin deep clone
					// $data: context
					$data: _.mixin(context, scope),
					methods: vm.methods,
					filters: vm.filters
				}
			});
			docFrag.appendChild(li);
		});
		!node.__parent__ && parent.removeChild(node);
		node.__template__ = template;
		// TODO: remove before
		node.__parent__ = replaceChild(parent, docFrag);
		// parent.replaceChild(docFrag, parent.lastChild);
	}

	function replaceChild(node, docFrag) {
		var parent = node.parentNode;
		var newNode = node.cloneNode(false);
		newNode.appendChild(docFrag);
		parent.replaceChild(newNode, node);
		return newNode;
	}

	exports.default = vFor;

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _depender = __webpack_require__(4);

	var _depender2 = _interopRequireDefault(_depender);

	var _util = __webpack_require__(2);

	var _ = _interopRequireWildcard(_util);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Observer = function () {
		function Observer(data) {
			_classCallCheck(this, Observer);

			this.$data = data;
			this.observe(this.$data);
		}

		_createClass(Observer, [{
			key: 'defineArrayReactive',
			value: function defineArrayReactive(arr, callback) {
				var oldProto = Array.prototype;
				var overrideProto = Object.create(Array.prototype);
				var result;
				['push', 'pop'].forEach(function (name) {
					var oldMethod = oldProto[name];
					Object.defineProperty(overrideProto, name, {
						enumerable: false,
						configurable: true,
						writable: true,
						value: function value() {
							var oldArr = this.slice(0);
							var arg = [].slice.call(arguments);
							result = oldMethod.apply(this, arg);
							if (result.length !== oldArr.length) {
								callback(result);
							}
							return result;
						}
					});
				});
				arr.__proto__ = overrideProto;
			}
		}, {
			key: 'observe',
			value: function observe(data) {
				// if (!data || !_.isType(data, 'object')) return;
				if (!data) return;
				var self = this;
				if (_.isType(data, 'array')) {
					// 重写array的push等方法
					// self.defineArrayReactive(data);
				} else if (_.isType(data, 'object')) {
					Object.keys(data).forEach(function (key) {
						self.defineReactive(data, key, data[key]);
					});
				}
			}
		}, {
			key: 'defineReactive',
			value: function defineReactive(data, key, val) {
				var dep = new _depender2.default();
				var self = this;
				// 多层对象嵌套
				if (_.isType(val, 'array')) {
					self.defineArrayReactive(val, function () {
						dep.notify();
					});
				} else if (_.isType(val, 'object')) {
					self.observe(val);
				}
				Object.defineProperty(data, key, {
					configurable: false,
					enumerable: true,
					set: function set(newVal) {
						if (newVal !== val) {
							val = newVal;
							self.observe(newVal);
							dep.notify();
						}
					},
					get: function get() {
						_depender2.default.target && dep.addSub(_depender2.default.target);
						return val;
					}
				});
			}
		}]);

		return Observer;
	}();

	exports.default = Observer;

/***/ }
/******/ ])
});
;