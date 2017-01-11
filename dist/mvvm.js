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

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * entry
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */

	var _compiler = __webpack_require__(1);

	var _compiler2 = _interopRequireDefault(_compiler);

	var _observer = __webpack_require__(22);

	var _observer2 = _interopRequireDefault(_observer);

	var _watcher = __webpack_require__(3);

	var _watcher2 = _interopRequireDefault(_watcher);

	var _directive = __webpack_require__(23);

	var _directive2 = _interopRequireDefault(_directive);

	var _events = __webpack_require__(24);

	var _events2 = _interopRequireDefault(_events);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var MVVM = function () {
		function MVVM(options) {
			_classCallCheck(this, MVVM);

			this.$data = options.data || {};
			this.$el = typeof options.el === 'string' ? document.querySelector(options.el) : options.el || document.body;
			this.methods = options.methods;
			this.filters = options.filters || {};
			this.computed = options.computed || {};
			// this._directives = [];
			this.copyData2Vm();
			new _observer2.default(this.$data);
			new _compiler2.default({
				el: this.$el,
				vm: this
			});
		}

		_createClass(MVVM, [{
			key: 'copyData2Vm',
			value: function copyData2Vm() {
				// 将data属性copy到vm下
				for (var prop in this.$data) {
					if (this.$data.hasOwnProperty(prop) && !this.hasOwnProperty(prop)) {
						this[prop] = this.$data[prop];
					}
				}
			}
		}, {
			key: '$watch',
			value: function $watch(paramName, _callback) {
				var self = this;
				new _watcher2.default({
					vm: self,
					exp: paramName,
					callback: function callback(vm, newVal, oldVal) {
						// watch variable change.
						typeof _callback === 'function' && _callback.call(vm, oldVal, newVal);
					}
				});
			}
		}, {
			key: 'bindDir',
			value: function bindDir(descriptor, node) {
				if (!this._directives) {
					this._directives = [];
				}
				// 切换上下文
				var self = descriptor.context || this;
				this._directives.push(new _directive2.default(descriptor, self, node));
			}
		}]);

		return MVVM;
	}();

	MVVM.directive = function (name, descriptor) {
		if (!this._cusDirectives) {
			this._cusDirectives = {};
		}
		this._cusDirectives[name] = descriptor;
		if (descriptor.bind) {
			var _bind = descriptor.bind;
			descriptor.bind = function () {
				var _descriptor = this.descriptor;
				_bind(this.$el, {
					expression: this.expression,
					value: ''
				});
			};
		}

		// 自定义directive，重写方法，传递参数
		if (descriptor.update) {
			var _update = descriptor.update;
			descriptor.update = function () {
				_update(this.$el, {
					expression: this.expression,
					value: this._watcher.value
				});
			};
		}
	};

	MVVM.component = function (name, options) {
		if (!this._globalCom) {
			this._globalCom = {};
		}
		this._globalCom[name] = options;
		options.name = name;
		// options.data = typeof options.data === 'function' ? options.data() : options.data;
		// new Observer(options.data);
	};

	(0, _events2.default)(MVVM);

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

	var _index = __webpack_require__(11);

	var _filter = __webpack_require__(6);

	var _compiler_props = __webpack_require__(19);

	var _compiler_props2 = _interopRequireDefault(_compiler_props);

	var _compiler_component = __webpack_require__(20);

	var _compiler_component2 = _interopRequireDefault(_compiler_component);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Compiler = function () {
		function Compiler(opts) {
			_classCallCheck(this, Compiler);

			this.$el = typeof opts.el === 'string' ? document.querySelector(opts.el) : opts.el;
			this.$vm = opts.vm;
			this.traversalNode(this.$el);
		}

		_createClass(Compiler, [{
			key: 'traversalNode',
			value: function traversalNode(node) {
				// elements应该是动态变化的
				// 遍历方式有问题
				// 遍历节点
				var self = this;

				function _traversal(node) {
					self.traversalAttribute(node);
					self.parseCustomComponent(node);
					if ((node.parentNode || node.nodeType == 11) && _.containOnlyTextNode(node)) {
						self.parseTextNode(node);
					} else {
						// node has been removed
						if (node.parentNode || node.nodeType == 11) {
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
			key: 'parseCustomComponent',
			value: function parseCustomComponent(node) {
				if (!node.tagName) return;
				var tagName = node.tagName.toLowerCase();
				var globalComonent = this.$vm.constructor._globalCom || {};
				var comNames = Object.keys(globalComonent);
				if (~comNames.indexOf(tagName)) {
					this._parseComponent(node);
				}
			}
		}, {
			key: 'traversalAttribute',
			value: function traversalAttribute(node) {
				var self = this;
				// 遍历属性
				var attrs = node.attributes || [];
				var dirs = [];
				for (var i = 0; i < attrs.length; i++) {
					var item = attrs[i];
					// v-for已经解析了其他的指定了，防止重复解析
					if (/^v\-([\w\:\']*)/.test(item.name) && node.parentNode) {
						this._parseAttr(node, item);
						dirs.push(item.name);
					}
				}

				// remove all directives
				// dirs.forEach(function(dir) {
				// 	node.removeAttribute(dir);
				// });
			}
		}, {
			key: 'bindWatch',
			value: function bindWatch(vm, exp, callback, directive) {
				var noop = function noop() {};
				return new _watcher2.default({
					vm: vm,
					exp: exp,
					directive: directive || '',
					callback: callback || noop
				});
			}
		}, {
			key: 'parseTextNode',
			value: function parseTextNode(node) {
				var self = this;
				var html = node.textContent;
				var keys = [];
				var watcherMaps = {};

				html.replace(/\{\{([^\}]*)\}\}/g, function (all, name) {
					if (keys.indexOf(name) === -1) {
						keys.push(name);
					}
				});

				// TODO: filters
				var _replace = function _replace(scope) {
					var newHtml = html.replace(/\{\{([^\}]*)\}\}/g, function (all, name) {
						return watcherMaps[name].value;
					});
					node.textContent = newHtml;
				};
				// watcher会计算parseExpression，_replace中不单独计算，
				keys.forEach(function (key) {
					watcherMaps[key] = self.bindWatch(self.$vm, key, _replace);
				});
				_replace(this.$vm.$data);
			}
		}]);

		return Compiler;
	}();

	(0, _compiler_props2.default)(Compiler);
	(0, _compiler_component2.default)(Compiler);

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

	var containOnlyTextNode = function containOnlyTextNode(node) {
		return !node.children.length && node.childNodes.length;
	};

	var upperFirst = function upperFirst(str) {
		return str.charAt(0).toUpperCase() + str.substring(1);
	};

	var addScope = function addScope(exp) {
		var prefix = arguments.length <= 1 || arguments[1] === undefined ? 'scope' : arguments[1];

		exp = trim(exp);
		// x.y
		// Math.random()  全局函数调用
		var globalObject = ['Math', 'window', 'Date', 'navigator'];
		exp = exp.replace(/[\w\[\]]+(?=\.)/g, function (match, index, all) {
			if (~globalObject.indexOf(match) || /^\d$/.test(match)) return match;
			return [prefix, match].join('.');
		});
		exp = ' ' + exp + ' ';
		// x
		exp = exp.replace(/[\+\-\*\/\s\>\<\=]\w+(?![\'\.])[\+\-\*\/\s\>\<\=]/g, function (match, index, all) {
			match = trim(match);
			if (/^[0-9]*$/.test(match)) {
				return match;
			}
			return [prefix, match].join('.');
		});
		return trim(exp);
	};

	exports.trim = trim;
	exports.isType = isType;
	exports.mixin = mixin;
	exports.upperFirst = upperFirst;
	exports.containOnlyTextNode = containOnlyTextNode;
	exports.addScope = addScope;

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

	var uid = 0;

	var Watcher = function () {
		function Watcher(opts) {
			_classCallCheck(this, Watcher);

			this.id = ++uid;
			this.vm = opts.vm;
			this.$el = opts.$el;
			this.exp = opts.exp;
			this.directive = opts.directive || '';
			this.callback = opts.callback;
			this.value = this.init();
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
			key: 'beforeGet',
			value: function beforeGet() {
				_depender2.default.target = this;
			}
		}, {
			key: 'afterGet',
			value: function afterGet() {
				_depender2.default.target = null;
			}
		}, {
			key: 'init',
			value: function init() {
				this.beforeGet();
				var value = this.get();
				this.afterGet();
				return value;
			}
		}, {
			key: 'get',
			value: function get() {
				return (0, _expression.parseExpression)(this.vm, this.exp, this.directive, this.$el);
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
					sub.update.call(sub);
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
	exports.parseExpression = exports.parseFilterExpression = exports.parseForExpression = exports.calculateExpression = undefined;

	var _util = __webpack_require__(2);

	var _ = _interopRequireWildcard(_util);

	var _filter = __webpack_require__(6);

	var _bind = __webpack_require__(7);

	var _bind2 = _interopRequireDefault(_bind);

	var _for = __webpack_require__(9);

	var _filter2 = __webpack_require__(10);

	var _filter3 = _interopRequireDefault(_filter2);

	var _expression = __webpack_require__(8);

	var _expression2 = _interopRequireDefault(_expression);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	// whether expression has filter
	function hasFilter(exp) {
	    if (!exp || exp.indexOf('|') === -1) return false;
	    return true;
	}

	function parseExpression(vm, exp, directive, node) {
	    var data = vm.$data;
	    var value = null;
	    var vmComputed = vm.computed || {};
	    // in v-for
	    // if (node && node.__scope__) {
	    //     var scope = node.__scope__;
	    //     exp = exp.replace(new RegExp(scope.$item, 'g'), scope.val + '[' + scope.index + ']');
	    // }
	    exp = (0, _for.parseItemScope)(node, exp);
	    switch (directive) {
	        case 'bind':
	            value = (0, _bind2.default)(vm, exp);
	            break;
	        default:

	            if (hasFilter(exp)) {
	                var filterInfo = (0, _filter3.default)(exp);
	                value = _filter.filter.apply(null, [vm, filterInfo.method, (0, _expression2.default)(data, filterInfo.param)].concat(filterInfo.args));
	            } else {
	                // computed property.
	                if (vmComputed[exp]) {
	                    value = vmComputed[exp].call(vm.$data);
	                } else {
	                    value = (0, _expression2.default)(data, exp);
	                }
	            }
	            break;

	    }
	    return value;
	}

	exports.calculateExpression = _expression2.default;
	exports.parseForExpression = _for.parseForExpression;
	exports.parseFilterExpression = _filter3.default;
	exports.parseExpression = parseExpression;

/***/ },
/* 6 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	// filters 过滤器
	function filter(vm, name, params) {
		var method = vm.filters[name];
		return method.apply(vm.$data, [params].concat([].slice.call(arguments, 3)));
	}

	exports.filter = filter;

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; // parse bind expression


	exports.default = parseBind;

	var _util = __webpack_require__(2);

	var _ = _interopRequireWildcard(_util);

	var _expression = __webpack_require__(8);

	var _expression2 = _interopRequireDefault(_expression);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	/**
	 * [parseBind description]
	 * @param  {Object} vm   instance
	 * @param  {String} attr expression
	 * @return {Object}      value of the expression
	 */
	function parseBind(vm, attr) {
		attr = _.trim(attr);
		var data = vm.$data;
		var computed = vm.computed;
		var value = {};
		if (/^\{(.*)\}$/.test(attr)) {
			// 计算表达式
			attr.replace(/([^\{\,\:]*):([^\,\:\}]*)/g, function (all, key, val) {
				value[_.trim(key)] = (0, _expression2.default)(data, _.trim(val));
				return all;
			});
		} else if (/\w*/.test(attr)) {
			// computed or data.property
			if (_typeof(data[attr]) === 'object') {
				value = data[attr];
			} else if (typeof computed[attr] === 'function') {
				value = computed[attr].apply(data);
			}
		}
		return value;
	}

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _util = __webpack_require__(2);

	var _ = _interopRequireWildcard(_util);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	// 计算表达式
	// strict mode can not use with
	// new Function
	var calculateExpression = function calculateExpression(scope, exp) {
	    // Plan A
	    var prefix = 'scope';
	    exp = _.addScope(exp);
	    var fn = new Function(prefix, 'return ' + exp);
	    // console.log(exp, scope);
	    return fn(scope);
	    // Plan B
	    // with(scope) {
	    //  return eval(exp);
	    // }
	};

	exports.default = calculateExpression;

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.parseItemScope = exports.parseForExpression = undefined;

	var _util = __webpack_require__(2);

	var _ = _interopRequireWildcard(_util);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	// v-for expression
	/**
	 * v-for expression parser
	 * @param  {string} expression 
	 * @return {object}      
	 * {
	 *     val: 遍历的变量名
	 *     scope: 遍历item临时变量
	 *     index: 遍历索引
	 * }
	 */
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

	// (item, index) in arr
	// item => arr[i]
	function parseItemScope(node, expression) {
	    if (node && node.__scope__) {
	        var scope = node.__scope__;
	        expression = expression.replace(new RegExp(scope.$item, 'g'), scope.val + '[' + scope.index + ']');
	    }
	    return expression;
	}

	exports.parseForExpression = parseForExpression;
	exports.parseItemScope = parseItemScope;

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _util = __webpack_require__(2);

	var _ = _interopRequireWildcard(_util);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	// paramName | filterName arg1 arg2
	function parseFilterExpression(str) {
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

	// 类型转化
	// 解析filter表达式
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

	exports.default = parseFilterExpression;

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.vHtml = exports.vBind = exports.vIf = exports.parseExpression = exports.parseForExpression = exports.vFor = exports.vOn = exports.calculateExpression = exports.setScopeValue = exports.vText = exports.vModel = undefined;

	var _model = __webpack_require__(12);

	var _model2 = _interopRequireDefault(_model);

	var _text = __webpack_require__(13);

	var _text2 = _interopRequireDefault(_text);

	var _expression = __webpack_require__(5);

	var _on = __webpack_require__(14);

	var _on2 = _interopRequireDefault(_on);

	var _for = __webpack_require__(15);

	var _for2 = _interopRequireDefault(_for);

	var _bind = __webpack_require__(16);

	var _bind2 = _interopRequireDefault(_bind);

	var _html = __webpack_require__(17);

	var _html2 = _interopRequireDefault(_html);

	var _if = __webpack_require__(18);

	var _if2 = _interopRequireDefault(_if);

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
	exports.vOn = _on2.default;
	exports.vFor = _for2.default;
	exports.parseForExpression = _expression.parseForExpression;
	exports.parseExpression = _expression.parseExpression;
	exports.vIf = _if2.default;
	exports.vBind = _bind2.default;
	exports.vHtml = _html2.default;

/***/ },
/* 12 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	// const vModel = (node, vm, value) => {
	// 	var tagName = node.tagName.toLowerCase();
	// 	if (tagName === 'input') {
	// 		node.value = value;
	// 	} else if (tagName === 'textarea') {
	// 		node.textContent = value;
	// 	}
	// 	node.removeAttribute('v-model');
	// }


	// export default vModel;
	// 
	exports.default = {
		bind: function bind() {
			var tagName = this.$el.tagName.toLowerCase();
			this._attr = tagName === 'input' ? 'value' : 'textContent';
			this.descriptor.addListener.call(this);
		},
		addListener: function addListener() {
			var self = this;
			var key = this.$el.getAttribute('v-' + this.name);
			this.$el.addEventListener('input', function () {
				self.set(key, this.value);
			}, false);
		},
		update: function update(value) {
			this.$el[this._attr] = value;
		}
	};

/***/ },
/* 13 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	var vText = function vText(node, vm, value) {
		node.textContent = value;
		// 影响后面attribute遍历
		node.removeAttribute('v-text');
	};

	exports.default = {
		// init
		bind: function bind() {
			this._attr = 'textContent';
		},
		update: function update(value) {
			this.$el[this._attr] = value;
		}
	};

	// export default vText;

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _util = __webpack_require__(2);

	var _ = _interopRequireWildcard(_util);

	var _for = __webpack_require__(9);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	// v-on:click="method(arg1, arg2, arg3)"
	// v-on:click="item.a=4"
	// event hander
	// 事件多次绑定
	function vOn(node, methods, value, eventName) {
		// console.log(node.__scope__);
		if (typeof value !== 'string') return;
		var fnReg = /([^\(]*)(\(([^\)]*)\))?/;
		// 解析
		var matches = value.match(fnReg);
		var self = this;
		if (matches) {
			// 函数调用或者表达式
			var method = methods[_.trim(matches[1])];
			// for语句内部on表达式
			if (!method /* && node.__scope__*/) {
					// var scope = node.__scope__;
					// TODO: RegExp 
					// value = value.replace(new RegExp(scope.$item, 'g'), scope.val + '[' + scope.index + ']');
					value = (0, _for.parseItemScope)(node, value);
					method = new Function(_.addScope(value, 'this'));
				}
			var args = matches[3];
			if (args) {
				args = args.split(',');
				args.forEach(function (arg, index) {
					arg = _.trim(arg);
					args[index] = self[arg] !== undefined ? self[arg] : '';
				});
			}
			node.addEventListener(eventName, function () {
				method.apply(self, args);
				// watcher表达式计算有问题
			}, false);
		}
	}

	var allowEvents = ['click', 'submit', 'touch', 'mousedown'];

	// export default vOn;

	exports.default = {
		bind: function bind() {
			var self = this;
			if (!this.$vm._listenedFn) {
				this.$vm._listenedFn = [];
			}
			// TODO：vOn里面的scope不一定是data，特别是在v-for中
			if (allowEvents.indexOf(this.extraName) === -1) {
				// 重复方法不监听
				if (this.$vm._listenedFn.indexOf(self.expression) === -1) {
					this.$vm._listenedFn.push(self.expression);
					// custom event;
					this.$vm.$on(this.extraName, function () {
						self.$vm.methods[self.expression].call(self.$vm.$data);
					});
				}
			} else {
				// 向父节点dispatch事件
				var parent = self.$vm.$parent;
				this.$vm.$data.$emit = function (name) {
					parent.$emit.call(parent, name);
				};
				vOn.call(this.$vm.$data, this.$el, this.$vm.methods, this.expression, this.extraName);
			}
		}
	};

/***/ },
/* 15 */
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

	// TODO: for循环作用域控制

	// 会二次执行，监听的元素变化时，会重新调用vfor
	function vFor(node, vm, expression) {
		var parent = node.parentNode || node.__parent__;
		// var expInfo = parseForExpression(expression);
		var expInfo = this._expInfo;
		var scope = vm.$data;
		var val = (0, _expression.calculateExpression)(scope, expInfo.val);
		if (!_.isType(val, 'array') || !val.length) return;
		var docFrag = document.createDocumentFragment();
		val.forEach(function (item, index) {
			// 子节点如何编译，Compiler中可以，但是需要修改scope
			var li = node.cloneNode(true);
			// maxnum call
			// TODO：v-for里面bind,on等作用域控制
			// 这里就替换节点里面的所有item？
			li.removeAttribute('v-for');
			var nodeScope = li.__scope__ = {
				val: expInfo.val
			};
			var context = {};
			context[expInfo.scope] = item;
			if (expInfo.index !== undefined) {
				context[expInfo.index] = index;
				nodeScope.$index = expInfo.index;
				nodeScope.index = index;
			}
			docFrag.appendChild(li);
			nodeScope.$item = expInfo.scope;
			nodeScope.item = item;
			/**
	   * item直接挂在$data下面，其中操作item会导致问题，
	   * 都是操作同一份item
	   * 渲染的时候，其实没有什么问题，每次item都不一致，
	   * 但是write的时候，有问题
	   */
			new _compiler2.default({
				el: li,
				vm: Object.assign(vm.__proto__, vm, {
					$data: _.mixin(context, scope)
				})
			});
		});
		!node.__parent__ && parent.removeChild(node);
		// node.__template__ = template;
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

	exports.default = {
		bind: function bind() {
			this._expInfo = (0, _expression.parseForExpression)(this.expression);
		},
		update: function update(value) {
			vFor.call(this, this.$el, this.$vm, this.expression);
		}
	};
	// export default vFor

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _util = __webpack_require__(2);

	var _ = _interopRequireWildcard(_util);

	var _bind = __webpack_require__(7);

	var _bind2 = _interopRequireDefault(_bind);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	// 属性转化
	function transformProperty(property) {
		if (property === 'class') {
			return 'className';
		}
		return property;
	}

	function addProperty(node, property, value) {
		property = transformProperty(property);
		if (property === 'className') {
			node[property] = _.trim([node[property], value].join(' '));
		} else {
			node.setAttribute(property, value);
		}
	}

	function removeProperty(node, property, value) {
		property = transformProperty(property);
		if (property === 'className') {
			node[property] = node[property].replace(new RegExp('\\b' + value + '\\b'), '');
		} else {
			node.removeAttribute(property);
		}
	}

	function vBind(node, vm, value, property) {
		for (var key in value) {
			if (value[key]) {
				addProperty(node, property, key);
			} else {
				removeProperty(node, property, key);
			}
		}
		// issue
		// 删除会导致后面的属性遍历有问题
		// 在遍历数组同时，在删除数组元素
		// node.removeAttribute('v-bind:' + property);
	}

	// export default vBind;

	exports.default = {
		bind: function bind() {},
		update: function update(value) {
			vBind(this.$el, this.$vm, value, this.extraName);
		}
	};

/***/ },
/* 17 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	// v-html
	var vHtml = function vHtml(node, vm, value) {
		node.innerHTML = value;
		// 影响后面attribute遍历
		node.removeAttribute('v-html');
	};

	exports.default = {
		bind: function bind() {
			this.$el.removeAttribute('v-' + this.name);
		},
		update: function update(value) {
			this.$el.innerHTML = value;
		}
	};

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _expression = __webpack_require__(5);

	var _util = __webpack_require__(2);

	var _ = _interopRequireWildcard(_util);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	// function vIf(node, vm, exp) {
	function vIf(node, vm, value) {
		var parent = node.parentNode || node.__parent__;
		// difference between nextSibling and nextElementSibling
		// get from node.childNode and node.children 
		var nextSibling = node.__nextSibling__ || node.nextElementSibling;

		var hasElseNext = this._hasElseNext;
		if (value) {
			if (node.__parent__) {
				// record the new node in document
				node.__new__ = insert(node.__new__ || node, parent);
			} else {
				// first time
				// clone新节点，删除v-if
				node.__new__ = replace(node, parent);
				node.__parent__ = parent;
			}
			if (hasElseNext) {
				node.__nextSibling__ = nextSibling;
				remove(nextSibling, parent);
			}
		} else {
			remove(node.__new__ || node, parent);
			if (hasElseNext) {
				node.__nextSibling__ = insert(nextSibling, parent);;
			}
		}
	}

	function replace(node, parent) {
		var newNode = node.cloneNode(true);
		newNode.removeAttribute('v-if');
		parent.replaceChild(newNode, node);
		return newNode;
	}

	function insert(node, parent) {
		var newNode = node.cloneNode(true);
		newNode.removeAttribute('v-if');
		newNode.removeAttribute('v-else');
		parent.replaceChild(newNode, node.__anchor__);
		return newNode;
	}

	function remove(node, parent) {
		// 这里应该是用something来占位，下次value变化是，直接替换
		// vue中使用注释来占位的,或者创建空的textNode，证实上面的猜想
		// node.__anchor__ = document.createComment('v-if');
		node.__anchor__ = document.createTextNode('');
		parent.replaceChild(node.__anchor__, node);
		node.__parent__ = parent;
	}

	exports.default = {
		bind: function bind() {
			// 是否有v-else元素
			var nextSibling = this.$el.nextElementSibling;
			this._hasElseNext = nextSibling && nextSibling.getAttribute('v-else') !== null;
		},
		update: function update(value) {
			vIf.call(this, this.$el, this.$vm, value);
		}
	};
	// export default vIf;

/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	exports.default = function (Compiler) {

		// ES6 function写法会导致this解析问题
		Compiler.prototype._parseAttr = function (node, attr) {
			var customDirectives = this.$vm.constructor._cusDirectives || {};
			var customNames = Object.keys(customDirectives);
			var self = this;
			var attrReg = /^v\-([\w\:\']*)/;
			var matches = attr.name.match(attrReg);
			var property = matches[1];
			var bindOn = /(on|bind)\:(\w*)/;
			if (bindOn.test(property)) {
				self.$vm.bindDir(Object.assign({
					expression: attr.value,
					name: RegExp.$1,
					extraName: RegExp.$2,
					context: self.$vm
				}, Dir['v' + _.upperFirst(RegExp.$1)]), node);
			} else {
				switch (property) {
					// v-model
					case 'model':
					case 'text':
					case 'html':
					case 'if':
						self.$vm.bindDir(Object.assign({
							expression: attr.value,
							name: property
						}, Dir['v' + _.upperFirst(property)]), node);
						break;
					case 'for':
						var info = (0, _for.parseForExpression)(attr.value);
						self.$vm.bindDir(Object.assign({
							expression: attr.value,
							watchExp: info.val,
							name: property
						}, Dir['v' + _.upperFirst(property)]), node);
						break;
					default:
						if (~customNames.indexOf(property)) {
							self.$vm.bindDir(Object.assign({
								expression: attr.value,
								name: property
							}, customDirectives[property]), node);
						}
						break;
				}
			}
		};
	};

	var _for = __webpack_require__(9);

	var _index = __webpack_require__(11);

	var Dir = _interopRequireWildcard(_index);

	var _util = __webpack_require__(2);

	var _ = _interopRequireWildcard(_util);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	exports.default = function (Compiler) {
		Compiler.prototype._parseComponent = function (node) {
			var allCom = this.$vm.constructor._globalCom;
			var descriptor = allCom[node.tagName.toLowerCase()];
			var instance = new _component2.default(descriptor.name, descriptor);
			var vm = this.$vm;

			var comVm = Object.create(vm.__proto__);
			comVm.methods = instance.methods;
			comVm.$data = instance.data;
			comVm.$parent = vm;

			//  TODO: 组件和原来VM的关系
			//  每个Componet的instance是沙箱模式
			// vm.copyData2Vm.call(comVm);
			// frag.uid = ++cid;
			new Compiler({
				el: instance.frag,
				vm: comVm
			});
			node.parentNode.replaceChild(instance.frag, node);
		};
	};

	var _component = __webpack_require__(21);

	var _component2 = _interopRequireDefault(_component);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); // import Compiler from './complier/complier';


	var _observer = __webpack_require__(22);

	var _observer2 = _interopRequireDefault(_observer);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var id = 0;

	var Component = function () {
		function Component(name, descriptor) {
			_classCallCheck(this, Component);

			this.name = name;
			this.template = descriptor.template;
			this.data = typeof descriptor.data === 'function' ? descriptor.data() : descriptor.data;
			this.data.uid = ++id;
			this.methods = descriptor.methods;
			this.init();
		}

		_createClass(Component, [{
			key: 'init',
			value: function init() {
				new _observer2.default(this.data);
				this.render();
			}
		}, {
			key: 'render',
			value: function render() {
				var frag = document.createDocumentFragment();
				var template = this.template;
				if (/^#/.test(template)) {
					var tempDom = document.querySelector(template);
					template = tempDom.innerHTML;
					tempDom.parentNode.removeChild(tempDom);
				}
				var div = document.createElement('div');
				div.innerHTML = template;
				[].slice.call(div.children).forEach(function (child) {
					frag.appendChild(child);
				});
				this.frag = frag;
				frag.uid = id;
			}
		}]);

		return Component;
	}();

	exports.default = Component;

/***/ },
/* 22 */
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
					val.forEach(function (item) {
						self.observe(item);
					});
				} else if (_.isType(val, 'object')) {
					self.observe(val);
				}
				Object.defineProperty(data, key, {
					configurable: false,
					enumerable: true,
					set: function set(newVal) {
						// debugger;
						if (newVal !== val) {
							val = newVal;
							// console.log('set', self.$data);
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

/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * 抽象所有directive的行为
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * 1. directive的lifecycle： bind, update, unbind
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * 2.
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */

	var _watcher = __webpack_require__(3);

	var _watcher2 = _interopRequireDefault(_watcher);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function noop() {};

	var Directive = function () {
		function Directive(descriptor, vm, node) {
			_classCallCheck(this, Directive);

			this.descriptor = descriptor;
			this.bind = descriptor.bind || noop;
			this.update = descriptor.update || noop;
			this.expression = descriptor.expression;
			this.watchExp = descriptor.watchExp || descriptor.expression;
			this.$el = node;
			this.$vm = vm;
			this.name = descriptor.name;
			// bind, on等后面跟的事件名或属性名
			this.extraName = descriptor.extraName || descriptor.name;
			this._bind();
		}

		_createClass(Directive, [{
			key: '_bind',
			value: function _bind() {
				var self = this;
				if (this.bind) {
					this.bind();
				}
				// 事件不需要update
				if (this.name === 'on') return;
				if (this.update) {
					this._watcher = new _watcher2.default({
						vm: this.$vm,
						$el: this.$el,
						exp: this.watchExp,
						directive: this.name,
						callback: function callback(vm, value, oldValue) {
							self.update(value);
						}
					});

					this.update(this._watcher.value);
				}
			}
		}, {
			key: 'set',
			value: function set(key, value) {
				this.$vm.$data[key] = value;
			}
		}]);

		return Directive;
	}();

	exports.default = Directive;

/***/ },
/* 24 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	exports.default = function (Lib) {
		Lib.prototype.$on = function (name, callback) {
			if (!this._events) {
				this._events = {};
			}
			(this._events[name] || (this._events[name] = [])).push(callback);
		};

		Lib.prototype.$emit = function (name) {
			var self = this;
			var fns = this._events[name];
			fns.forEach(function (fn) {
				fn.call(self);
			});
		};
	};

/***/ }
/******/ ])
});
;