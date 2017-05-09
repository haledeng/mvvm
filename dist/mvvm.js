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

	var _observer = __webpack_require__(36);

	var _observer2 = _interopRequireDefault(_observer);

	var _watcher = __webpack_require__(3);

	var _watcher2 = _interopRequireDefault(_watcher);

	var _directive = __webpack_require__(37);

	var _directive2 = _interopRequireDefault(_directive);

	var _events = __webpack_require__(38);

	var _events2 = _interopRequireDefault(_events);

	var _index = __webpack_require__(39);

	var _index2 = _interopRequireDefault(_index);

	var _depender = __webpack_require__(4);

	var _depender2 = _interopRequireDefault(_depender);

	var _util = __webpack_require__(2);

	var _ = _interopRequireWildcard(_util);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var defineProperty = Object.defineProperty;

	var proxy = function proxy(vm, key) {
		defineProperty(vm, key, {
			configurable: true,
			enumerable: true,
			get: function get() {
				return vm.$data[key];
			},
			set: function set(val) {
				vm.$data[key] = val;
			}
		});
	};

	var MVVM = function () {
		function MVVM(options) {
			_classCallCheck(this, MVVM);

			this.init(options);
		}

		_createClass(MVVM, [{
			key: 'init',
			value: function init(options) {
				var self = this;
				this.$options = options;
				this.$data = typeof options.data === 'function' ? options.data() : options.data || {};
				this.$el = typeof options.el === 'string' ? document.querySelector(options.el) : options.el;
				this.methods = options.methods || {};
				this.filters = _.mixin(_index2.default, options.filters || {});
				this.computed = options.computed || {};
				var init = options.init || [];
				// lifecycle hook.
				init.forEach(function (hook) {
					hook.call(self);
				});
				new _observer2.default(this.$data);
				this.initData();
				this.initComputed();
				if (this.$el) {
					new _compiler2.default({
						el: this.$el,
						vm: this
					});
				}
			}
		}, {
			key: 'initData',
			value: function initData() {
				var keys = Object.keys(this.$data);
				var i = keys.length;
				while (i--) {
					// proxy all property from data into instance.
					proxy(this, keys[i]);
				}
			}
		}, {
			key: 'initComputed',
			value: function initComputed() {
				var self = this;
				for (var key in this.computed) {
					var method = this.computed[key];
					defineProperty(this, key, {
						get: self.defineComputeGetter(method),
						set: _.noop
					});
				}
			}
		}, {
			key: 'defineComputeGetter',
			value: function defineComputeGetter(method) {
				var self = this;
				var watcher = new _watcher2.default({
					vm: self,
					exp: method,
					callback: _.noop
				});
				return function () {
					if (_depender2.default.target) {
						watcher.update();
					}
					return watcher.value;
				};
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
				// change context.
				var self = descriptor.context || this;
				(this._directives || (this._directives = [])).push(new _directive2.default(descriptor, self, node));
			}
		}]);

		return MVVM;
	}();

	// custom directive


	MVVM.directive = function (name, descriptor) {
		if (!this._cusDirectives) {
			this._cusDirectives = {};
		}
		this._cusDirectives[name] = descriptor;
		// init method
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

		// wrap update method, change function params
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

	// custom component
	MVVM.component = function (name, options) {
		if (!this._globalCom) {
			this._globalCom = {};
		}
		this._globalCom[name] = options;
		options.name = name;
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

	var _index = __webpack_require__(10);

	var _expression = __webpack_require__(5);

	var _compiler_props = __webpack_require__(33);

	var _compiler_props2 = _interopRequireDefault(_compiler_props);

	var _compiler_component = __webpack_require__(34);

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
					// /(v\-\w*)?(\:|\@)/
					if ((/^v\-([\w\:\']*)/.test(item.name) || /^[\:\@]/.test(item.name)) && node.parentNode) {
						// if (/(v\-\w*)?(\:|\@)?(\w*)/.test(item.name) && node.parentNode) {
						this._parseAttr(node, item);
						dirs.push(item.name);
					}
					// 属性值是模板表达式
					if (/^\{\{/.test(item.value) && /\}\}$/.test(item.value)) {
						var name = item.value.replace(/^\{\{/, '').replace(/\}\}$/, '');
						node.setAttribute(item.name, (0, _expression.calculateExpression)(self.$vm.$data, name));
					}
				}

				// remove all directives
				dirs.forEach(function (dir) {
					node.removeAttribute(dir);
				});
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

				var _replace = function _replace(scope) {
					var newHtml = html.replace(/\{\{([^\}]*)\}\}/g, function (all, name) {
						return watcherMaps[name].value;
						// return scope[name];
					});
					node.textContent = newHtml;
				};
				// watcher会计算parseExpression，_replace中不单独计算，
				keys.forEach(function (key) {
					watcherMaps[key] = self.bindWatch(self.$vm, key, _replace);
				});
				_replace();
				// _replace(this.$vm.$data);
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

	var getType = function getType(obj) {
		return toString.call(obj).replace(/^\[object\s|\]$/g, '').toLowerCase();
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

	// add context to expression
	var addScope = function addScope(exp) {
		var prefix = arguments.length <= 1 || arguments[1] === undefined ? 'scope' : arguments[1];

		// Global Object call
		var globalObjReg = /^(Math|window|document|location|navigator|screen)/;
		// begin with variables
		return exp.replace(/^[\w\[\]\-]+/g, function (all) {
			if (globalObjReg.test(all)) return all;
			return [prefix, all].join('.');
		}).replace(/([\s\=])([\w\[\]\-]+)/g, function (match, sep, val, index, all) {
			if (/^\d*$/.test(val) || globalObjReg.test(val)) return match;
			return sep + [prefix, val].join('.');
		}).replace(/\(([\w\[\]\-]+)\)/g, function (match, val, index, all) {
			if (/^\d*$/.test(val) || globalObjReg.test(val) || /^[\'\"]/.test(val)) return match;
			return '(' + [prefix, val].join('.') + ')';
		});
	};

	var isArrayEqual = function isArrayEqual(a, b) {
		if (isType(a, 'array') && isType(b, 'array')) {
			if (a.length !== b.length) return false;
			for (var i = 0; i < a.length; i++) {
				if (a[i] != b[i]) return false;
			}
			return true;
		}
		return false;
	};

	var isObjectEqual = function isObjectEqual(a, b) {
		if (isType(a, 'object') && isType(b, 'object')) {
			var aKeys = Object.keys[a];
			if (aKeys.length !== Object.keys(b).length) return false;
			for (var i = 0; i < aKeys.length; i++) {
				// ===?
				if (a[aKeys[i]] != b[aKeys[i]]) return false;
			}
			return true;
		}
		return false;
	};

	var kebabCase = function kebabCase(str) {
		if (typeof str !== 'string') return '';
		return str.replace(/[A-Z]/, function (all) {
			return '-' + all.toLowerCase();
		});
	};

	var praviteIterator = function praviteIterator(str) {
		return str ? '_' + str + '_' : '';
	};

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

	var parseStr2Obj = function parseStr2Obj(str, fn) {
		var ret = {};
		if (!str) return ret;
		str = trim(str.replace(/^\{|\}$/g, ''));
		str.replace(/([^\:\,]*)\:([^\,]*)/g, function (all, key, value) {
			ret[key] = fn ? fn(value) : value;
		});
		return ret;
	};

	// wrap forEach
	function forEach(val, fn) {
		if (isType(val, 'array')) {
			val.forEach(fn);
		} else if (isType(val, 'object')) {
			Object.keys(val).forEach(function (key) {
				fn(val[key], key);
			});
		} else {}
	}

	// get subset of object
	var getSubset = function getSubset(obj, keys) {
		var ret = {},
		    type = getType(keys);
		if ('object' === type) return null;
		if ('string' === type) keys = [keys];
		forEach(keys, function (value, key) {
			ret[value] = obj[value];
		});
		return ret;
	};

	var resetObject = function resetObject(oldVals, vm) {
		forEach(oldVals, function (value, key) {
			if (value == undefined) {
				delete vm[key];
			} else {
				vm[key] = value;
			}
		});
	};

	function getIterators(node) {
		var parent = node;
		while (parent && !parent._iterators) {
			parent = parent.parentNode;
		}
		return parent ? parent._iterators : null;
	}

	// empty function
	var noop = function noop() {};

	exports.trim = trim;
	exports.isType = isType;
	exports.mixin = mixin;
	exports.upperFirst = upperFirst;
	exports.containOnlyTextNode = containOnlyTextNode;
	exports.addScope = addScope;
	exports.kebabCase = kebabCase;
	exports.getType = getType;
	exports.isObjectEqual = isObjectEqual;
	exports.isArrayEqual = isArrayEqual;
	exports.setScopeValue = setScopeValue;
	exports.noop = noop;
	exports.parseStr2Obj = parseStr2Obj;
	exports.forEach = forEach;
	exports.getSubset = getSubset;
	exports.resetObject = resetObject;
	exports.getIterators = getIterators;

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

	var _util = __webpack_require__(2);

	var _ = _interopRequireWildcard(_util);

	var _expression = __webpack_require__(5);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

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
			// this.lazy = opts.lazy || false;
			this.value = this.init();
			// call 2 times
		}

		_createClass(Watcher, [{
			key: 'update',
			value: function update() {
				var newVal = this.get();
				var oldVal = this.value;
				this.value = newVal;
				this.callback(this.vm, newVal, oldVal);
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
				// var value = (this.lazy ? null : this.get());
				var value = this.get();
				this.afterGet();
				return value;
			}
		}, {
			key: 'get',
			value: function get() {

				if (typeof this.exp === 'function') {
					return this.exp.call(this.vm);
				}
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
	exports.parseExpression = exports.calculateExpression = undefined;

	var _util = __webpack_require__(2);

	var _ = _interopRequireWildcard(_util);

	var _filter = __webpack_require__(6);

	var _bind = __webpack_require__(7);

	var _bind2 = _interopRequireDefault(_bind);

	var _for = __webpack_require__(8);

	var _filter2 = __webpack_require__(9);

	var _filter3 = _interopRequireDefault(_filter2);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	// whether expression has filter
	function hasFilter(exp) {
	    return exp && /\s\|\s/.test(exp);
	}

	function parseExpression(vm, exp, directive, node) {
	    var value = null;
	    var vmComputed = vm.computed || {};
	    node && (exp = (0, _for.parseItemScope)(node, exp));
	    var oldVals = {};
	    var iterators = _.getIterators(node);
	    if (node && iterators) {
	        console.log(iterators);
	        _.forEach(iterators, function (value, key) {
	            // record old value.
	            oldVals[key] = vm[key];
	            vm[key] = value;
	        });
	    }
	    switch (directive) {
	        case 'bind':
	            value = (0, _bind2.default)(vm, exp);
	            break;
	        default:
	            if (hasFilter(exp)) {
	                var filterInfo = (0, _filter3.default)(exp);
	                value = _filter.filter.apply(null, [vm, filterInfo.method, calculateExpression(vm, filterInfo.param)].concat(filterInfo.args));
	            } else {
	                value = calculateExpression(vm, exp);
	                // 向上查找
	                if (vm.props && vm.props[exp]) {
	                    value = calculateExpression(vm.$parent, vm.props[exp]);
	                }
	            }
	            break;

	    }
	    _.resetObject(oldVals, vm);
	    return value;
	}

	var calculateExpression = function calculateExpression(scope, exp) {
	    // with expression. not support in strict mode.
	    var prefix = 'scope';
	    exp = _.addScope(exp);
	    var fn = new Function(prefix, 'return ' + exp);
	    return fn(scope);
	};

	exports.calculateExpression = calculateExpression;
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
		if (!method) return params;
		return method.apply(vm, [params].concat([].slice.call(arguments, 3)));
	}

	exports.filter = filter;

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.default = parseBind;

	var _util = __webpack_require__(2);

	var _ = _interopRequireWildcard(_util);

	var _expression = __webpack_require__(5);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	/**
	 * [parseBind description]
	 * @param  {Object} vm   instance
	 * @param  {String} attr expression
	 * @return {Object}      value of the expression
	 */
	// parse bind expression
	function parseBind(vm, attr) {
		attr = _.trim(attr);
		var data = vm;
		// var data = vm.$data;
		var computed = vm.computed;
		var value = {};
		if (/^\{(.*)\}$/.test(attr)) {
			// 计算表达式
			attr.replace(/([^\{\,\:]*):([^\,\:\}]*)/g, function (all, key, val) {
				value[_.trim(key)] = (0, _expression.calculateExpression)(data, _.trim(val));
				return all;
			});
		} else if (/\w*/.test(attr)) {
			// computed已经被计算
			value = data[attr];
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
/* 9 */
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
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.vShow = exports.vHtml = exports.vBind = exports.vIf = exports.vFor = exports.vOn = exports.vText = exports.vModel = undefined;

	var _model = __webpack_require__(11);

	var _model2 = _interopRequireDefault(_model);

	var _text = __webpack_require__(15);

	var _text2 = _interopRequireDefault(_text);

	var _on = __webpack_require__(16);

	var _on2 = _interopRequireDefault(_on);

	var _for = __webpack_require__(17);

	var _for2 = _interopRequireDefault(_for);

	var _bind = __webpack_require__(29);

	var _bind2 = _interopRequireDefault(_bind);

	var _html = __webpack_require__(30);

	var _html2 = _interopRequireDefault(_html);

	var _if = __webpack_require__(31);

	var _if2 = _interopRequireDefault(_if);

	var _show = __webpack_require__(32);

	var _show2 = _interopRequireDefault(_show);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.vModel = _model2.default;
	exports.vText = _text2.default;
	exports.vOn = _on2.default;
	exports.vFor = _for2.default;
	exports.vIf = _if2.default;
	exports.vBind = _bind2.default;
	exports.vHtml = _html2.default;
	exports.vShow = _show2.default;

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _checkbox = __webpack_require__(12);

	var _checkbox2 = _interopRequireDefault(_checkbox);

	var _text = __webpack_require__(13);

	var _text2 = _interopRequireDefault(_text);

	var _select = __webpack_require__(14);

	var _select2 = _interopRequireDefault(_select);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var handlers = {
		checkbox: _checkbox2.default,
		text: _text2.default,
		select: _select2.default
	}; // const vModel = (node, vm, value) => {
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
			var handler = null;
			if (tagName === 'input') {
				handler = handlers[this.$el.type] || handlers['text'];
			} else if (tagName === 'textarea') {
				handler = handlers['text'];
			} else if (tagName === 'select') {
				handler = handlers[tagName];
			}
			handler.bind.call(this);
			this.update = handler.update;
		}
	};

/***/ },
/* 12 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.default = {
		bind: function bind() {
			this.listener = function () {
				var self = this;
				var key = this.$el.getAttribute('v-' + this.name);
				this.$el.addEventListener('change', function (e) {
					self.set(key, this.checked);
				}, false);
			};
			this.listener.call(this);
		},
		update: function update(value) {
			var node = this.$el;
			node.checked = !!value;
		},
		unbind: function unbind() {}
	};

/***/ },
/* 13 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.default = {
		bind: function bind() {
			this.listener = function () {
				var self = this;
				var key = this.$el.getAttribute('v-' + this.name);
				this.$el.addEventListener('input', function () {
					self.set(key, this.value);
				}, false);
			};
			var tagName = this.$el.tagName.toLowerCase();
			this.__attr__ = tagName === 'input' ? 'value' : 'textContent';
			this.listener.call(this);
		},
		update: function update(value) {
			this.$el[this.__attr__] = value;
		}
	};

/***/ },
/* 14 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.default = {
		bind: function bind() {
			var node = this.$el;
			var self = this;
			var key = this.$el.getAttribute('v-' + this.name);
			this.listener = function () {
				node.addEventListener('change', function () {
					self.set(key, this.value);
				});
			};
			this.listener();

			var options = node.getElementsByTagName('option');
			this.__values__ = [];
			for (var i = 0; i < options.length; i++) {
				this.__values__.push(options[i].value);
			}
		},
		update: function update(value) {
			if (~this.__values__.indexOf(value)) {
				this.$el.value = value;
			}
			// this.$el.value = value;
		}
	};

/***/ },
/* 15 */
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
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _util = __webpack_require__(2);

	var _ = _interopRequireWildcard(_util);

	var _expression = __webpack_require__(5);

	var _for = __webpack_require__(8);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	var keyCodeConf = {
		'enter': 13
	};

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
					// object
					if (/^\{.*\}$/.test(arg)) {
						args[index] = _.parseStr2Obj(arg, function (value) {
							return (0, _expression.calculateExpression)(self, value);
						});
					} else {
						args[index] = self[arg] !== undefined ? self[arg] : '';
					}
				});
			}
			// async
			(function (_args) {
				node.addEventListener(eventName, function (e) {
					if (eventName === 'keyup') {
						var code = e.keyCode || e.charCode;
						if (code == keyCodeConf[node['_' + eventName]]) {
							method.apply(self, [e]);
						}
					} else {
						var oldVals = {};
						var iterators = _.getIterators(node);
						if (node && iterators) {
							_.forEach(iterators, function (value, key) {
								// record old value.
								oldVals[key] = self[key];
								self[key] = value;
							});
						}
						method.apply(self, (_args || []).concat([e]));
						_.resetObject(oldVals, self);
					}
				}, false);
			})(args);
		}
	}

	var allowEvents = ['click', 'submit', 'touch', 'mousedown', 'keyup'];

	// export default vOn;

	exports.default = {
		bind: function bind() {
			var _this = this;

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
						// self.$vm.methods[self.expression].call(self);
					});
				}
			} else {
				(function () {
					var _extend = function _extend(name) {
						self.$vm.$data[name] = function () {
							self.$vm[name].apply(self.$vm, arguments);
						};
					};

					// extend function in this.


					['$emit', '$broadcast', '$dispatch'].forEach(function (name) {
						_extend(name);
					});

					// vOn.call(this.$vm.$data, this.$el, this.$vm.methods, this.expression, this.extraName);
					vOn.call(_this.$vm, _this.$el, _this.$vm.methods, _this.expression, _this.extraName);
				})();
			}
		}
	};

/***/ },
/* 17 */
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

	var _diffDom = __webpack_require__(18);

	var _diffDom2 = _interopRequireDefault(_diffDom);

	var _patch = __webpack_require__(26);

	var _patch2 = _interopRequireDefault(_patch);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	// 会二次执行，监听的元素变化时，会重新调用vfor
	function vFor(node, vm, expression) {
		var parent = node.parentNode || node.__parent__;
		var expInfo = node._info;
		var scope = vm.$data;
		// parseExpression
		// var val = parseExpression(vm, expInfo.val, 'for', node);
		var val = node._vForValue;
		if (['array', 'object'].indexOf(_.getType(val)) === -1) return;
		var docFrag = document.createDocumentFragment();
		var iterators = [expInfo.scope];
		if (expInfo.index) {
			iterators.push(expInfo.index);
		}
		// store old value
		var oldVals = _.getSubset(vm, iterators);
		// var temp = {};
		_.forEach(val, function (item, index) {
			var li = node.cloneNode(true);
			li.removeAttribute('v-for');

			li._iterators = {};

			li._iterators[expInfo.scope] = vm[expInfo.scope] = item;
			// temp[expInfo.scope] = item;
			if (expInfo.index !== undefined) {
				li._iterators[expInfo.index] = vm[expInfo.index] = index;
				// temp[expInfo.index] = index;
			}
			docFrag.appendChild(li);
			// debugger;
			// item 临时挂载到vm下
			new _compiler2.default({
				el: li,
				vm: vm
				// vm: Object.assign(vm, temp)
			});
		});
		!node.__parent__ && parent.removeChild(node);
		node.__parent__ = parent;
		replaceChild(parent, docFrag);
		// recover same iterator key
		_.resetObject(oldVals, vm);
		oldVals = null;
		console.log(vm);
	}

	function replaceChild(node, docFrag) {
		var parent = node.parentNode;
		var newNode = node.cloneNode(false);
		newNode.appendChild(docFrag);
		// dom-diff
		var diff = (0, _diffDom2.default)(node, newNode);
		console.log(diff);
		(0, _patch2.default)(diff);
	}

	exports.default = {
		bind: function bind() {
			// this._expInfo = this.$el._info;
		},
		update: function update(value) {
			this.$el._vForValue = value;
			vFor.call(this, this.$el, this.$vm, this.expression);
		}
	};
	// export default vFor

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	exports.default = function (one, two) {
		var patch = {
			left: one
		};
		diffDom(one, two, patch, 0);
		return patch;
	};

	var _util = __webpack_require__(19);

	var _ = _interopRequireWildcard(_util);

	var _vPatch = __webpack_require__(20);

	var _vPatch2 = _interopRequireDefault(_vPatch);

	var _diffProps = __webpack_require__(21);

	var _diffProps2 = _interopRequireDefault(_diffProps);

	var _isTextNode = __webpack_require__(23);

	var _isTextNode2 = _interopRequireDefault(_isTextNode);

	var _attribute = __webpack_require__(24);

	var attr = _interopRequireWildcard(_attribute);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	function appendPatch(apply, patch) {
		if (apply) {
			if (_.isArray(apply)) {
				apply.push(patch);
				return apply;
			} else {
				return [apply, patch];
			}
		} else {
			return patch;
		}
	}

	// textNode diff
	function diffTextNode(one, two) {
		var isOneText = (0, _isTextNode2.default)(one);
		var isTwoText = (0, _isTextNode2.default)(two);
		if (isOneText) {
			if (isTwoText) {
				// both textNode
				var oneText = one.childNodes[0].data;
				var twoText = two.childNodes[0].data;
				if (_.trim(oneText) !== _.trim(twoText)) {
					return new _vPatch2.default(_vPatch2.default.TEXTNODE, one, twoText);
				}
				// } else {
				// return new VPatch(VPatch.REPLACE, one, two);
			}
		} else {
			if (isTwoText) {
				return new _vPatch2.default(_vPatch2.default.TEXTNODE, one, _.trim(two.childNodes[0].data));
			}
		}
	}

	// remove/replace 节点，需要将对应的prop操作删掉
	function deleteChangeProp(apply) {
		if (!apply) return apply;
		if (_.isObject(apply)) {
			return apply.type === _vPatch2.default.PROPS ? null : apply;
		}
		if (_.isArray(apply)) {
			var newApply = [];
			apply.forEach(function (a) {
				if (a.type !== _vPatch2.default.PROPS) {
					newApply.push(a);
				}
			});
			if (newApply.length === 1) {
				return newApply[0];
			}
			return newApply;
		}
	}

	// 对比dom差异
	function diffDom(one, two, patch, index) {
		var apply = patch[index];
		if (two) {
			if (one.tagName === two.tagName) {
				var oneAttr = attr.getAttr(one);
				var twoAttr = attr.getAttr(two);
				var props = (0, _diffProps2.default)(oneAttr, twoAttr);
				if (props) {
					apply = appendPatch(apply, new _vPatch2.default(_vPatch2.default.PROPS, one, props));
				}
				// innerText
				var textNode = diffTextNode(one, two);
				if (textNode) {
					apply = appendPatch(apply, textNode);
					if (textNode.type === _vPatch2.default.REPLACE) {
						apply = deleteChangeProp(apply);
					}
				}
				if (one.children.length || two.children.length) {
					apply = diffChildren(one, two, patch, apply, index);
				}
			} else {
				apply = appendPatch(apply, new _vPatch2.default(_vPatch2.default.REPLACE, one, two));
				apply = deleteChangeProp(apply);
			}
		} else {
			apply = appendPatch(apply, new _vPatch2.default(_vPatch2.default.REMOVE, one, two));
			apply = deleteChangeProp(apply);
		}
		if (apply) {
			patch[index] = apply;
		}
	}

	// 对比dom中childrend差异
	function diffChildren(one, two, patch, apply, index) {
		var aLen = one.children.length;
		var bLen = two.children.length;
		var len = Math.max(aLen, bLen);
		for (var i = 0; i < len; i++) {
			index++;
			var leftNode = one.children[i];
			var rightNode = two.children[i];
			if (leftNode) {
				diffDom(leftNode, rightNode, patch, index);
				// index += leftNode.children.length;
				// 多层节点嵌套
				index += findDeep(leftNode);
			} else {
				if (rightNode) {
					apply = appendPatch(apply, new _vPatch2.default(_vPatch2.default.INSERT, null, rightNode));
				}
			}
		}
		return apply;
	}

	//  深度优先遍历
	function findDeep(node) {
		var deep = 0;
		var children = node.children;
		deep += children.length;
		for (var i = 0; i < children.length; i++) {
			if (children[i].children.length) {
				deep += findDeep(children[i]);
			}
		}
		return deep;
	}

	;

/***/ },
/* 19 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var toString = Object.prototype.toString;

	var trim = function trim(str) {
	  return str.replace(/(^\s*)|(\s*$)/, '');
	};

	/**
	 * is Object
	 * @param    {[type]}                 obj [description]
	 * @return   {Boolean}                    [description]
	 */
	var isObject = function isObject(obj) {
	  return '[object Object]' === toString.call(obj);
	};

	/**
	 * is object an array
	 * @param    {object}                 obj [description]
	 * @return   {Boolean}                    [description]
	 */
	var isArray = function isArray(obj) {
	  return '[object Array]' === toString.call(obj);
	};

	/**
	 * is empty string
	 * @param    {string}                 obj [description]
	 * @return   {Boolean}                    [description]
	 */
	var isEmptyStr = function isEmptyStr(obj) {
	  return obj === '';
	};

	var isFunction = function isFunction(fn) {
	  return fn && typeof fn === 'function';
	};

	exports.trim = trim;
	exports.isObject = isObject;
	exports.isArray = isArray;
	exports.isEmptyStr = isEmptyStr;
	exports.isFunction = isFunction;

/***/ },
/* 20 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	function VPatch(type, node, right) {
		this.type = type;
		this.left = node;
		this.right = right;
	}

	// 删除节点
	VPatch.REMOVE = 0;
	// 插入节点
	VPatch.INSERT = 1;
	VPatch.REPLACE = 2;
	VPatch.PROPS = 3;
	VPatch.TEXTNODE = 4;

	exports.default = VPatch;

/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _attr2prop = __webpack_require__(22);

	var _attr2prop2 = _interopRequireDefault(_attr2prop);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function parseStyle(one, two, key) {
		if (key === 'style') {
			var oneStyles = (0, _attr2prop2.default)(one[key]);
			var twoStyles = (0, _attr2prop2.default)(two[key]);
			return diffProps(oneStyles, twoStyles);
		} else {
			return two[key];
		}
	}

	function diffProps(one, two) {
		var diff;
		for (var k in one) {
			if (!(k in two)) {
				diff = diff || {};
				diff[k] = undefined;
			}

			if (one[k] !== two[k]) {
				diff = diff || {};
				// style增量更新
				diff[k] = parseStyle(one, two, k);
			}
		}

		for (var key in two) {
			if (!(key in one)) {
				diff = diff || {};
				diff[key] = parseStyle(one, two, key);
			}
		}

		return diff;
	};

	exports.default = diffProps;

/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	exports.default = function (attr) {
		var attrReg = /([a-zA-Z\-]*)\s*?\:\s*?([a-zA-Z0-9%\-\s\#]*);?/g;
		var attrs = {};
		attr && attr.replace(attrReg, function (all, key, value) {
			// key = camelize.camel(key);
			attrs[key] = _.trim(value);
		});
		return attrs;
	};

	var _util = __webpack_require__(19);

	var _ = _interopRequireWildcard(_util);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

/***/ },
/* 23 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	exports.default = function (node) {
		return node.children.length === 0 && node.childNodes.length !== 0;
	};

	;

/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.getAttr = exports.patchObject = exports.removeAttribute = exports.applyAttributes = undefined;

	var _util = __webpack_require__(19);

	var _ = _interopRequireWildcard(_util);

	var _camelize = __webpack_require__(25);

	var camelize = _interopRequireWildcard(_camelize);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	var applyAttributes = function applyAttributes(node, props) {
		for (var propName in props) {
			var propValue = props[propName];
			if (typeof propValue === 'undefined') {
				this.removeAttribute(node, propName);
			} else {
				if (_.isObject(propValue)) {
					this.patchObject(node, propName, propValue);
				} else {
					node.setAttribute(propName, propValue);
				}
			}
		}
	};
	var removeAttribute = function removeAttribute(node, propName) {
		node.removeAttribute(propName);
	};
	var patchObject = function patchObject(node, propName, propValue) {
		for (var k in propValue) {
			if (propValue[k] === undefined && propName === 'style') {
				node[propName].removeProperty(camelize.unCamel(k));
			} else {
				node[propName][k] = propValue[k];
			}
		}
	};
	var getAttr = function getAttr(node) {
		var attrs = [].slice.call(node.attributes) || [];
		var ret = {};
		// for (var i = 0; i < attrs.length; i++) {
		// 	var attr = attrs[i];
		// 	if (!_.isEmptyStr(attr.value)) {
		// 		ret[attr.name] = attr.value;
		// 	}
		// }
		attrs.map(function (attr) {
			if (!_.isEmptyStr(attr.value)) {
				ret[attr.name] = attr.value;
			}
		});
		return ret;
	};
	exports.applyAttributes = applyAttributes;
	exports.removeAttribute = removeAttribute;
	exports.patchObject = patchObject;
	exports.getAttr = getAttr;

/***/ },
/* 25 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var camel = function camel(styleName) {
	  var reg = /\-([a-z])/g;
	  return styleName.replace(reg, function (all, key) {
	    return key.toUpperCase();
	  });
	};
	var unCamel = function unCamel(styleName) {
	  var reg = /[A-Z]/g;
	  return styleName.replace(reg, function (all) {
	    return '-' + all.toLowerCase();
	  });
	};

	exports.camel = camel;
	exports.unCamel = unCamel;

/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	exports.default = function (patch) {
		var node = patch.left;
		patchDom(node, patch, 0);
	};

	var _vPatch = __webpack_require__(20);

	var _vPatch2 = _interopRequireDefault(_vPatch);

	var _util = __webpack_require__(19);

	var _ = _interopRequireWildcard(_util);

	var _traversal = __webpack_require__(27);

	var _traversal2 = _interopRequireDefault(_traversal);

	var _curd = __webpack_require__(28);

	var curd = _interopRequireWildcard(_curd);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var findPatchNode = function findPatchNode(node, patch) {
		var children = {};
		for (var index in patch) {
			if (index !== 'left') {
				var child = (0, _traversal2.default)(node, index);
				children[index] = child;
			}
		}
		return children;
	};

	// 每个type对应的操作函数
	var typeOpMaps = {};
	typeOpMaps[_vPatch2.default.REMOVE] = curd.removeChild;
	typeOpMaps[_vPatch2.default.INSERT] = curd.insertChild;
	typeOpMaps[_vPatch2.default.REPLACE] = curd.replaceChild;
	typeOpMaps[_vPatch2.default.PROPS] = curd.applyAttributes;
	typeOpMaps[_vPatch2.default.TEXTNODE] = curd.replaceContent;

	// 增量渲染
	// 边查找边操作有bug
	var patchDom = function patchDom(node, patch, index) {
		// 先把dom和index关系查找完毕，在进行dom操作
		var domIndex = findPatchNode(node, patch);
		for (var index in patch) {
			if (index !== 'left') {
				var child = domIndex[index];
				var applies = patch[index];
				if (!_.isArray(applies)) {
					applies = [applies];
				}
				applies.forEach(function (apply) {
					if (_.isFunction(typeOpMaps[apply.type])) {
						typeOpMaps[apply.type](child, apply);
					}
				});
			}
		}
	};

	;

/***/ },
/* 27 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	exports.default = function (node, index) {
		var count = 0;
		var lastChild = null;
		var _find = function _find(node, index) {
			if (index == count) return node;
			for (var i = 0; i < node.children.length; i++) {
				lastChild = node.children[i];
				count++;
				if (index == count) return lastChild;
				if (lastChild.children.length) {
					lastChild = _find(lastChild, index);
					if (lastChild) return lastChild;
				}
			}
			return null;
		};
		var findNode = _find(node, index);
		if (!findNode && index >= count) {
			return lastChild;
		} else {
			return findNode;
		}
	};

	; /**
	   * 根据序号，查找dom数，深度优先遍历
	   */

/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.applyAttributes = exports.replaceChild = exports.replaceContent = exports.removeChild = exports.insertChild = undefined;

	var _attribute = __webpack_require__(24);

	var applyAttr = _interopRequireWildcard(_attribute);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	function insertChild(node, apply) {
		if (!apply.left && apply.right) {
			node.appendChild(apply.right);
		}
	}

	// 替换节点
	/**
	 * dom增、删、改
	 */
	function replaceChild(node, apply) {
		var parent = node.parentNode;
		// var newNode = apply.right.cloneNode(true);
		var newNode = apply.right;
		parent.replaceChild(newNode, node);
	}

	// 删除节点
	function removeChild(node, apply) {
		apply.left.parentNode.removeChild(apply.left);
	}

	// textNode节点，替换内容
	function replaceContent(node, apply) {
		if (apply && typeof apply.right === 'string') {
			node.innerHTML = apply.right;
		}
	}

	function applyAttributes(node, apply) {
		applyAttr.applyAttributes(node, apply.right);
	}

	exports.insertChild = insertChild;
	exports.removeChild = removeChild;
	exports.replaceContent = replaceContent;
	exports.replaceChild = replaceChild;
	exports.applyAttributes = applyAttributes;

/***/ },
/* 29 */
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
			// debugger;
			vBind(this.$el, this.$vm, value, this.extraName);
		}
	};

/***/ },
/* 30 */
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
/* 31 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _util = __webpack_require__(2);

	var _ = _interopRequireWildcard(_util);

	var _diffDom = __webpack_require__(18);

	var _diffDom2 = _interopRequireDefault(_diffDom);

	var _patch = __webpack_require__(26);

	var _patch2 = _interopRequireDefault(_patch);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	function vIf(node, vm, value) {
		// var hasElseNext = this._hasElseNext;
		if (value) {
			// 这种2次操作的方式，实际和未dom-diff差别不大
			if (this.$el.__anchor__) {
				(0, _patch2.default)((0, _diffDom2.default)(this.$el.__anchor__, this.$el));
			}
			if (this.elseEl) {
				this.elseEl.__anchor__ = document.createTextNode('');
				(0, _patch2.default)((0, _diffDom2.default)(this.elseEl, this.elseEl.__anchor__));
			}
		} else {
			this.$el.__anchor__ = document.createTextNode('');
			(0, _patch2.default)((0, _diffDom2.default)(this.$el, this.$el.__anchor__));
			if (this.elseEl) {
				(0, _patch2.default)((0, _diffDom2.default)(this.elseEl.__anchor__, this.elseEl));
			}
		}
	}

	function removeNode(node) {
		node.__anchor__ = document.createTextNode('');
		return (0, _diffDom2.default)(node, node.__anchor__);
	}

	exports.default = {
		bind: function bind() {
			// 是否有v-else元素
			var nextSibling = this.$el.nextElementSibling;
			if (nextSibling && nextSibling.getAttribute('v-else') !== null) {
				this.elseEl = nextSibling;
			}
		},
		update: function update(value) {
			vIf.call(this, this.$el, this.$vm, value);
		}
	};

/***/ },
/* 32 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.default = {
		bind: function bind() {
			var next = this.$el.nextElementSibling;
			if (next && next.getAttribute('v-else') !== null) {
				this.elseEl = next;
			}
		},
		toggle: function toggle(elem, value) {
			elem.style.display = value ? '' : 'none';
		},
		update: function update(value) {
			var toggle = this.toggle;
			toggle.call(this, this.$el, value);
			if (this.elseEl) {
				toggle.call(this, this.elseEl, !value);
			}
		}
	};

/***/ },
/* 33 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	exports.default = function (Compiler) {

		function parseBindOn(str) {
			// @event
			if (/^@/.test(str)) {
				return 'on';
			}
			// :bindProperty
			if (/^\:/.test(str)) {
				return 'bind';
			}
			// v-on:  v-bind:
			return str.replace(/^v\-|\:$/g, '');
		}

		// ES6 function写法会导致this解析问题
		Compiler.prototype._parseAttr = function (node, attr) {
			var customDirectives = this.$vm.constructor._cusDirectives || {};
			var customNames = Object.keys(customDirectives);
			var self = this;
			var bindOn = /(v\-on\:|v\-bind\:|@|\:)(\w*)/;
			// short name
			// v-on:event   @event
			// v-bind:property  :property
			if (bindOn.test(attr.name)) {
				var extraName = RegExp.$2;
				var directiveName = parseBindOn(RegExp.$1);
				var keyCode = attr.name.replace(bindOn, '');
				// @keyup.enter
				if (keyCode) {
					node['_' + extraName] = keyCode.replace(/^\./, '');
				}
				self.$vm.bindDir(Object.assign({
					expression: attr.value,
					name: directiveName,
					extraName: extraName,
					context: self.$vm
				}, Dir['v' + _.upperFirst(directiveName)]), node);
			} else {
				var attrReg = /^v\-([\w\:\']*)/;
				var matches = attr.name.match(attrReg);
				var property = matches[1];
				switch (property) {
					// v-model
					case 'model':
					case 'text':
					case 'html':
					case 'show':
					case 'if':
						self.$vm.bindDir(Object.assign({
							expression: attr.value,
							name: property
						}, Dir['v' + _.upperFirst(property)]), node);
						break;
					case 'for':
						var info = (0, _for.parseForExpression)(attr.value);
						// cache directive infomation
						node._info = info;
						self.$vm.bindDir(Object.assign({
							expression: attr.value,
							watchExp: info.val,
							name: property
						}, Dir['v' + _.upperFirst(property)]), node);
						break;
					default:
						// custom directives
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

	var _for = __webpack_require__(8);

	var _index = __webpack_require__(10);

	var Dir = _interopRequireWildcard(_index);

	var _util = __webpack_require__(2);

	var _ = _interopRequireWildcard(_util);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

/***/ },
/* 34 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	exports.default = function (Compiler) {
		Compiler.prototype._parseComponent = function (node) {
			var self = this;
			var allCom = this.$vm.constructor._globalCom;
			var descriptor = allCom[node.tagName.toLowerCase()];
			// var props = descriptor.props || [];
			// props获取的数据
			// props中的数据会被重复监听（component一次，MVVM初始化一次）
			// descriptor._data = parseProps(props, self.$vm, node);
			// component是全局VM的一个child
			var instance = new _component2.default(descriptor.name, descriptor);
			var vm = this.$vm;

			var comVm = Object.create(vm.__proto__);
			comVm.methods = instance.methods;
			// 此处有问题，componet的data会覆盖vm中的数据
			// parse表达式时，向上查找
			comVm.$data = instance.data || {};
			// 遇到props，向上查找parent
			// comVm.props = descriptor.props || [];
			comVm.props = getComProps(node);
			// 记录全局VM
			comVm.$parent = vm;
			comVm._events = instance.events;
			(vm.$children || (vm.$children = [])).push(comVm);

			//  每个Componet的instance是沙箱模式
			new Compiler({
				el: instance.frag,
				vm: comVm
			});
			node.parentNode.replaceChild(instance.frag, node);
		};
	};

	var _component = __webpack_require__(35);

	var _component2 = _interopRequireDefault(_component);

	var _expression = __webpack_require__(5);

	var _util = __webpack_require__(2);

	var _ = _interopRequireWildcard(_util);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	// 计算prop对应的value
	function parseProps(props, vm, node) {
		var ret = {};
		props.forEach(function (prop) {
			ret[prop] = (0, _expression.parseExpression)(vm, node.getAttribute(_.kebabCase(prop)));
		});
		return ret;
	} // 解析自定义component
	// import Observer from '../observer';

	function getComProps(node) {
		var attrs = [].slice.call(node.attributes) || [];
		var ret = {};
		attrs.map(function (attr) {
			ret[attr.name] = attr.value;
		});
		return ret;
	}

/***/ },
/* 35 */
/***/ function(module, exports) {

	

/***/ },
/* 36 */
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
				['push', 'pop', 'reverse', 'sort', 'slice', 'shift', 'unshift', 'splice'].forEach(function (name) {
					var oldMethod = oldProto[name];
					Object.defineProperty(overrideProto, name, {
						enumerable: false,
						configurable: true,
						writable: true,
						value: function value() {
							var oldArr = [].slice.call(this);
							var arg = [].slice.call(arguments);
							result = oldMethod.apply(this, arg);
							if (_.isType(arg, 'object')) {
								self.observe(arg);
							}
							// 后面有dom diff的算法，这里可以不需要
							if (result.length !== oldArr.length || name === 'reverse' || name === 'sort') {
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
				if (!data || !_.isType(data, 'object')) return;
				var self = this;
				Object.keys(data).forEach(function (key) {
					self.defineReactive(data, key, data[key]);
				});
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
						if (_.isType(item, 'object') || _.isType(item, 'array')) {
							self.observe(item);
						}
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

	// function defineArrayReactive() {
	// 	// will excute several times
	// 	var oldProto = Array.prototype;
	// 	var overrideProto = Object.create(Array.prototype);
	// 	var result;

	// 	['push', 'pop', 'reverse', 'sort', 'slice', 'shift',
	// 		'unshift'
	// 	].forEach(function(name) {
	// 		var oldMethod = oldProto[name];
	// 		Object.defineProperty(overrideProto, name, {
	// 			enumerable: false,
	// 			configurable: true,
	// 			writable: true,
	// 			value: function() {
	// 				var oldArr = this /*.slice(0)*/ ;
	// 				var i = arguments.length
	// 				var arg = new Array(i)
	// 				while (i--) {
	// 					arg[i] = arguments[i]
	// 				}
	// 				// var arg = [].slice.call(arguments);
	// 				result = oldMethod.apply(this, arg);
	// 				var ob = this.__ob__;
	// 				// 后面有dom diff的算法，这里可以不需要
	// 				if (result.length !== oldArr.length || name === 'reverse' || name === 'sort') {
	// 					ob.dep.notify();
	// 				}
	// 				// TODO: watcher中oldVal和newVal指向了同一引用
	// 				return result;
	// 			}
	// 		})
	// 	});
	// 	return overrideProto;
	// }


	// var overrideProto = defineArrayReactive();

	// class Observer {
	// 	constructor(data) {
	// 		this.$data = data;
	// 		this.dep = new Dep();
	// 		data.__ob__ = this;
	// 		if (_.isType(data, 'array')) {
	// 			this.observeArray(data);
	// 		} else {
	// 			this.walk(data);
	// 		}
	// 	}
	// 	observeArray(data) {
	// 		for (var i = 0; i < data.length; i++) {
	// 			observe(data[i]);
	// 		}
	// 		data.__proto__ = overrideProto;
	// 	}
	// 	walk(data) {
	// 		var self = this;
	// 		var value;
	// 		Object.keys(data).forEach(function(key) {
	// 			value = data[key];
	// 			if (key === '__ob__') return;
	// 			if (_.isType(value, 'array') || _.isType(value, 'object')) {
	// 				observe(value);
	// 			}
	// 			self.defineReactive(data, key, value);
	// 		});
	// 	}
	// 	defineReactive(data, key, val) {
	// 		console.log(val);
	// 		var dep = data.__ob__.dep;
	// 		Object.defineProperty(data, key, {
	// 			configurable: false,
	// 			enumerable: true,
	// 			set: function(newVal) {
	// 				// 引用类型
	// 				if (newVal !== val) {
	// 					val = newVal;
	// 					observe(newVal);
	// 					dep.notify();
	// 				}
	// 			},
	// 			get: function() {
	// 				var childOb = observe(val);
	// 				if (Dep.target) {
	// 					dep.addSub(Dep.target);
	// 					childOb.dep.addSub(Dep.target);
	// 				}
	// 				debugger;
	// 				return val;
	// 			}
	// 		});
	// 	}
	// }

	// function observe(data) {
	// 	if (!_.isType(data, 'object') && !_.isType(data, 'array')) return;
	// 	var ob;
	// 	if (data.__ob__) {
	// 		ob = data.__ob__;
	// 	} else {
	// 		ob = new Observer(data);
	// 	}
	// 	return ob;
	// }

	// export default observe;

/***/ },
/* 37 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * 抽象所有directive的行为
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * 1. directive的lifecycle： bind, update, unbind
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */

	var _watcher = __webpack_require__(3);

	var _watcher2 = _interopRequireDefault(_watcher);

	var _util = __webpack_require__(2);

	var _ = _interopRequireWildcard(_util);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Directive = function () {
		function Directive(descriptor, vm, node) {
			_classCallCheck(this, Directive);

			this.descriptor = descriptor;
			_.mixin(this, this.descriptor);
			this.bind = descriptor.bind || _.noop;
			this.update = descriptor.update || _.noop;
			this.watchExp = descriptor.watchExp || descriptor.expression;
			this.$el = node;
			this.$vm = vm;
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
				if ('function' === typeof this.update) {
					this._watcher = new _watcher2.default({
						vm: self.$vm,
						$el: self.$el,
						exp: self.watchExp,
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
/* 38 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

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
			var args = [].slice.call(arguments, 1);
			var self = this;
			var fns = this._events[name];
			if (_.isType(fns, 'array')) {
				fns.forEach(function (fn) {
					fn.apply(self.$data, args);
				});
			} else if (_.isType(fns, 'function')) {
				fns.apply(self.$data, args);
			}
		};

		// 向所有子组件广播事件
		Lib.prototype.$broadcast = function () {
			var children = this.$children;
			var shouldPropagate = false;
			var args = arguments;
			children.forEach(function (child) {
				shouldPropagate = child.$emit.apply(child, args);
				// 是否继续向下传播
				if (shouldPropagate) {
					child.$broadcast.apply(child, args);
				}
			});
		};

		// 父节点冒泡事件
		Lib.prototype.$dispatch = function () {
			var parent = this.$parent;
			var shouldPropagate = false;
			while (parent) {
				shouldPropagate = parent.$emit.apply(parent, arguments);
				parent = shouldPropagate ? parent.$parent : null;
			}
		};
	};

	var _util = __webpack_require__(2);

	var _ = _interopRequireWildcard(_util);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

/***/ },
/* 39 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _util = __webpack_require__(2);

	var _ = _interopRequireWildcard(_util);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	exports.default = {
		capitalize: function capitalize(val) {
			if (!val && val !== 0) return '';
			val = val.toString();
			return val.charAt(0).toUpperCase() + val.substr(1);
		},
		getType: _.getType,
		trim: _.trim
	};

/***/ }
/******/ ])
});
;