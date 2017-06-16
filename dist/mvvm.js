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

	// TODO: slot support


	var _compiler = __webpack_require__(1);

	var _compiler2 = _interopRequireDefault(_compiler);

	var _observer = __webpack_require__(37);

	var _observer2 = _interopRequireDefault(_observer);

	var _watcher = __webpack_require__(3);

	var _watcher2 = _interopRequireDefault(_watcher);

	var _directive = __webpack_require__(38);

	var _directive2 = _interopRequireDefault(_directive);

	var _events = __webpack_require__(39);

	var _events2 = _interopRequireDefault(_events);

	var _index = __webpack_require__(40);

	var _index2 = _interopRequireDefault(_index);

	var _depender = __webpack_require__(4);

	var _depender2 = _interopRequireDefault(_depender);

	var _util = __webpack_require__(2);

	var _ = _interopRequireWildcard(_util);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var defineProperty = Object.defineProperty;

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
				this._filters = _.mixin(_index2.default, options.filters || {});
				this._computed = options.computed || {};
				var init = options.init || [];
				// lifecycle hook.
				init.forEach(function (hook) {
					hook.call(self);
				});
				// add Observer
				new _observer2.default(this.$data);
				this.proxyData();
				this.proxyMethod();
				this.initComputed();
				this.initWatcher();
				// lifeCycle
				var created = options.created || null;
				typeof created === 'function' && created.call(this);
				if (this.$el) {
					new _compiler2.default({
						el: this.$el,
						vm: this
					});
				}
			}
		}, {
			key: 'proxyMethod',
			value: function proxyMethod() {
				// vm.xxx() => vm.methods.xxx()
				var methods = Object.keys(this.methods);
				var vm = this;
				methods.map(function (name) {
					Object.defineProperty(vm, name, {
						configurable: true,
						enumerable: true,
						get: function get() {
							return vm.methods[name];
						},
						set: _.noop
					});
				});
			}
		}, {
			key: 'proxyData',
			value: function proxyData() {
				// vm.xxxx => vm.$data.xxx
				_.proxyData(this, '$data');
			}
		}, {
			key: 'initWatcher',
			value: function initWatcher() {
				// watch: {'key': 'callback'}
				var watcher = this.$options.watch || {};
				var vm = this;
				Object.keys(watcher).forEach(function (key) {
					var cb = watcher[key];
					if (typeof cb === 'string') cb = vm[cb];
					vm.$watch(key, cb);
				});
			}
		}, {
			key: 'initComputed',
			value: function initComputed() {
				var self = this;
				for (var key in this._computed) {
					var method = this._computed[key];
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

	var _compiler_props = __webpack_require__(34);

	var _compiler_props2 = _interopRequireDefault(_compiler_props);

	var _compiler_component = __webpack_require__(35);

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
				var globalComonent = this.$vm.constructor._globalCom || {};
				var comNames = Object.keys(globalComonent);

				// documentFragment
				// TEXTNODE
				// Element
				var _traversal = function _traversal(node) {
					var tagName = node.tagName;
					if (tagName && ~comNames.indexOf(tagName.toLowerCase())) {
						return self._parseComponent(node);
					}
					self.traversalAttribute(node);
					// has been remove
					if (node.nodeType !== 11 && !node.parentNode) return;
					if (node.nodeType == 3) {
						// text node
						self.parseTextNode(node);
					} else {
						var elements = node.childNodes;
						elements = [].slice.call(elements);
						elements.forEach(function (element) {
							_traversal(element);
						});
					}
				};

				_traversal(node);
			}
		}, {
			key: 'parseSlot',
			value: function parseSlot(node) {
				// parse slot
				var attrs = node.attributes || [];
				var slot = this.$vm._slot = this.$vm._slot || {};
				slot[node.getAttribute('name')] = node;
				node.removeAttribute('name');
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
					// v-for已经解析了其他的directive了，防止重复解析
					// /(v\-\w*)?(\:|\@)/
					if ((/^v\-([\w\:\']*)/.test(item.name) || /^[\:\@]/.test(item.name)) && node.parentNode) {
						this._parseAttr(node, item);
						dirs.push(item.name);
					}
					// slot
					if (item.name === 'slot') {
						var slotName = item.value;
						var slot = self.$vm._slot[item.value];
						node.removeAttribute(item.name);
						slot.parentNode && slot.parentNode.replaceChild(node, slot);
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
			value: function bindWatch(node, vm, exp, callback, directive) {
				var noop = function noop() {};
				return new _watcher2.default({
					vm: vm,
					exp: exp,
					$el: node,
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
					});
					node.textContent = newHtml;
				};
				// watcher会计算parseExpression，_replace中不单独计算，
				keys.forEach(function (key) {
					watcherMaps[key] = self.bindWatch(node, self.$vm, key, _replace);
				});
				_replace();
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
		var globalObjReg = /^(Math|window|document|location|navigator|screen|true|false)/;
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

	var extendScope = function extendScope(obj, vm) {
		var oldVals = {};
		forEach(obj, function (value, key) {
			// record old value.
			oldVals[key] = vm[key];
			vm[key] = value;
		});
		return oldVals;
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

	// 重置原来的对象
	var resetObject = function resetObject(oldVals, vm) {
		forEach(oldVals, function (value, key) {
			if (value == undefined) {
				delete vm[key];
			} else {
				vm[key] = value;
			}
		});
		oldVals = null;
	};

	// 向上查找当前作用域迭代器
	// v-for中的临时变量
	function getIterators(node) {
		var parent = node;
		while (parent && !parent._iterators) {
			parent = parent.parentNode;
		}
		return parent ? parent._iterators : null;
	}

	var getVal = function getVal(obj, namespace) {
		var names = namespace.split('.'),
		    len = names.length,
		    i = 1,
		    ret = obj[names[0]];
		if (typeof ret === 'undefined') return '';
		while (i < len && obj) {
			ret = ret[names[i++]];
		}
		return ret;
	};

	// 键码
	var KEYCODE_MAP = {
		'enter': 13,
		'esc': 27
	};

	var getKeyCode = function getKeyCode(key) {
		return KEYCODE_MAP[key] || 0;
	};

	var getKeyCodes = function getKeyCodes(keys) {
		var codes = [];
		forEach(keys, function (key) {
			codes.push(getKeyCode(key));
		});
		return codes;
	};

	// get key by keycode
	var getKey = function getKey(code) {
		for (var key in KEYCODE_MAP) {
			if (KEYCODE_MAP[key] === code) return key;
		}
		return '';
	};

	function parseNodeAttr2Obj(node) {
		var attrs = [].slice.call(node.attributes) || [];
		var ret = {};
		attrs.map(function (attr) {
			ret[attr.name] = attr.value;
		});
		return ret;
	}

	var proxyData = function proxyData(vm, prop) {
		var keys = Object.keys(vm[prop]);
		var self = vm;
		keys.map(function (key) {
			// proxy all property from data into instance.
			Object.defineProperty(vm, key, {
				configurable: true,
				enumerable: true,
				get: function get() {
					return self[prop][key];
				},
				set: function set(val) {
					self[prop][key] = val;
				}
			});
		});
	};
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
	exports.extendScope = extendScope;
	exports.getVal = getVal;
	exports.getKeyCode = getKeyCode;
	exports.getKeyCodes = getKeyCodes;
	exports.getKey = getKey;
	exports.parseNodeAttr2Obj = parseNodeAttr2Obj;
	exports.proxyData = proxyData;

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
	    node && (exp = (0, _for.parseItemScope)(node, exp));
	    // extend context 统一放到compiler中
	    // 放到compiler中，由于异步的问题，这里计算有bug
	    var oldVals = {};
	    var iterators = _.getIterators(node);
	    // extend vm scope, v-for temp variable
	    if (node && iterators) {
	        oldVals = _.extendScope(iterators, vm);
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
		var method = vm._filters[name];
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
	function parseBind(data, attr) {
		attr = _.trim(attr);
		var value = {};
		if (/^\{(.*)\}$/.test(attr)) {
			// 计算表达式
			attr.replace(/([^\{\,\:]*):([^\,\:\}]*)/g, function (all, key, val) {
				value[_.trim(key)] = (0, _expression.calculateExpression)(data, _.trim(val));
				return all;
			});
		} else if (/\w*/.test(attr)) {
			// computed已经被计算
			// value = data[attr];
			// a.b.c
			value = _.getVal(data, attr);
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

	var _text = __webpack_require__(16);

	var _text2 = _interopRequireDefault(_text);

	var _on = __webpack_require__(17);

	var _on2 = _interopRequireDefault(_on);

	var _for = __webpack_require__(18);

	var _for2 = _interopRequireDefault(_for);

	var _bind = __webpack_require__(30);

	var _bind2 = _interopRequireDefault(_bind);

	var _html = __webpack_require__(31);

	var _html2 = _interopRequireDefault(_html);

	var _if = __webpack_require__(32);

	var _if2 = _interopRequireDefault(_if);

	var _show = __webpack_require__(33);

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

	var _radio = __webpack_require__(15);

	var _radio2 = _interopRequireDefault(_radio);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var handlers = {
		checkbox: _checkbox2.default,
		text: _text2.default,
		select: _select2.default,
		radio: _radio2.default
	};

	exports.default = {
		bind: function bind() {
			var $el = this.$el;
			var tagName = $el.tagName.toLowerCase();
			var handler = null;
			if (tagName === 'input') {
				handler = handlers[$el.type] || handlers['text'];
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
	exports.default = {
		bind: function bind() {
			this.__attr__ = 'checked';
			this.listener = function () {
				var self = this;
				var key = this.$el.getAttribute('v-' + this.name);
				this.$el.addEventListener('click', function () {
					self.set(key, this.value);
				}, false);
			};
			this.listener.call(this);
		},
		update: function update(value) {
			if (value == this.$el.value) {
				this.$el.setAttribute(this.__attr__, 'checked');
			} else {
				this.$el.removeAttribute(this.__attr__);
			}
		}
	};

/***/ },
/* 16 */
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
/* 17 */
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

	// v-on:click="method(arg1, arg2, arg3)"
	// v-on:click="item.a=4"
	function vOn(node, methods, value, eventName) {
		methods = methods || {};
		if (typeof value !== 'string') return;
		var self = this;
		var fnReg = /([^\(]*)(\(([^\)]*)\))?/;
		// 解析
		var matches = value.match(fnReg);
		if (!matches) return console.log('wrong format expression in v-on');
		// 函数调用或者表达式
		var methodName = _.trim(matches[1]);
		var method = methods[methodName];
		// $emit, $dispatch
		if (this[methodName] && /^\$/.test(methodName)) {
			method = this[methodName];
		}
		// for语句内部on表达式
		if (!method /* && node.__scope__*/) {
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
				} else if (/^\'.*\'$/.test(arg)) {
					args[index] = arg.replace(/^\'|\'$/g, '');
				} else {
					args[index] = self[arg] !== undefined ? self[arg] : '';
				}
			});
		}
		// async
		(function (_args) {
			var isKeyEvent = eventName === 'keyup' || eventName === 'keydown';
			// keyup.enter
			// keyup.esc
			// avoid repeat listeners on same event.
			if (isKeyEvent) {
				var keys = node['_' + eventName];
				node._listeners = node._listeners || {};
				// 每个keyCode对应的回调
				node._listeners[keys[keys.length - 1]] = method;
			}
			if (!node._events || node._events.indexOf(eventName) === -1) {
				node.addEventListener(eventName, function (e) {
					// extend current context
					// temporary variables in v-for
					// async
					var oldVals = {};
					var iterators = _.getIterators(node);
					if (node && iterators) {
						oldVals = _.extendScope(iterators, self);
					}
					if (isKeyEvent) {
						var code = e.keyCode || e.charCode;
						var key = _.getKey(code);
						var codes = _.getKeyCodes(keys);
						if (~codes.indexOf(code) && key) {
							node._listeners[key].apply(self, [e]);
						}
					} else {
						method.apply(self, (_args || []).concat([e]));
					}
					_.resetObject(oldVals, self);
				}, false);
				// all event listeners
				node._events = node._events || [];
				node._events.push(eventName);
			}
		})(args);
	}

	var allowEvents = ['click', 'submit', 'touch', 'mousedown', 'keyup', 'keydown', 'dblclick', 'blur'];

	// export default vOn;

	exports.default = {
		bind: function bind() {
			var _this = this;

			var self = this;
			if (!this.$vm._listenedFn) {
				this.$vm._listenedFn = [];
			}
			// 原生事件
			if (allowEvents.indexOf(this.extraName) === -1) {
				// 重复方法不监听
				if (this.$vm._listenedFn.indexOf(self.expression) === -1) {
					this.$vm._listenedFn.push(self.expression);
					this.$vm.$on(this.extraName, function () {
						var method = self.$vm.methods[self.expression];
						if (!method) {
							var value = (0, _for.parseItemScope)(this.$el, self.expression);
							method = new Function(_.addScope(value, 'this'));
						}
						method.call(self.$vm);
						// self.$vm.methods[self.expression].call(self.$vm.$data);
					});
				}
			} else {
				(function () {
					// 自定义事件
					var _extend = function _extend(name) {
						self.$vm.$data[name] = function () {
							self.$vm[name].apply(self.$vm, arguments);
						};
					};
					// extend function in this.


					['$emit', '$broadcast', '$dispatch'].forEach(function (name) {
						_extend(name);
					});
					vOn.call(_this.$vm, _this.$el, _this.$vm.methods, _this.expression, _this.extraName);
				})();
			}
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

	var _compiler = __webpack_require__(1);

	var _compiler2 = _interopRequireDefault(_compiler);

	var _diffDom = __webpack_require__(19);

	var _diffDom2 = _interopRequireDefault(_diffDom);

	var _patch = __webpack_require__(27);

	var _patch2 = _interopRequireDefault(_patch);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	// 会二次执行，监听的元素变化时，会重新调用vfor
	function vFor(node, vm, expression, val) {
		// fix val=null，v-for中的模板还是在编译
		var parent = node.parentNode || node.__parent__;
		var expInfo = node._forInfo;
		var scope = vm.$data;
		var isTpl = node.tagName.toLowerCase() === 'template';
		// have to remove iterator template.
		if (['array', 'object'].indexOf(_.getType(val)) === -1) {
			// fix type error
			// val=null
			val = [];
		}
		var docFrag = document.createDocumentFragment();
		// temporary variables.
		var iterators = [expInfo.scope];
		if (expInfo.index) {
			iterators.push(expInfo.index);
		}
		// store old value
		var oldVals = _.getSubset(vm, iterators);
		_.forEach(val, function (item, index) {
			// support <template></template>
			var li = null;
			if (isTpl) {
				// template只能包含一个子节点，包含多个太复杂了
				li = document.createElement('div');
				li.innerHTML = node.innerHTML;
				var _frag = document.createDocumentFragment();
				[].slice.call(li.children).forEach(function (child) {
					_frag.appendChild(child);
				});
				li = _frag;
			} else {
				li = node.cloneNode(true);
				li.removeAttribute('v-for');
				// set a parentNode property
				docFrag.appendChild(li);
			}

			li._iterators = {};

			li._iterators[expInfo.scope] = vm[expInfo.scope] = item;
			if (expInfo.index !== undefined) {
				li._iterators[expInfo.index] = vm[expInfo.index] = index;
			}
			new _compiler2.default({
				el: li,
				vm: vm
			});
			if (isTpl) docFrag.appendChild(li);
		});
		if (!isTpl) {
			!node.__parent__ && parent.removeChild(node);
			node.__parent__ = parent;
			replaceChild(parent, docFrag);
		} else {
			// template node
			parent.replaceChild(docFrag, node);
		}
		// recover same iterator key
		_.resetObject(oldVals, vm);
	}

	function replaceChild(node, docFrag) {
		// var parent = node.parentNode;
		var newNode = node.cloneNode(false);
		newNode.appendChild(docFrag);
		// dom-diff
		var diff = (0, _diffDom2.default)(node, newNode);
		console.log(diff);
		(0, _patch2.default)(diff);
	}

	exports.default = {
		bind: function bind() {},
		update: function update(value) {
			vFor.call(this, this.$el, this.$vm, this.expression, value);
		}
	};

/***/ },
/* 19 */
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

	var _util = __webpack_require__(20);

	var _ = _interopRequireWildcard(_util);

	var _vPatch = __webpack_require__(21);

	var _vPatch2 = _interopRequireDefault(_vPatch);

	var _diffProps = __webpack_require__(22);

	var _diffProps2 = _interopRequireDefault(_diffProps);

	var _isTextNode = __webpack_require__(24);

	var _isTextNode2 = _interopRequireDefault(_isTextNode);

	var _attribute = __webpack_require__(25);

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
/* 20 */
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
/* 21 */
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
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _attr2prop = __webpack_require__(23);

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
/* 23 */
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

	var _util = __webpack_require__(20);

	var _ = _interopRequireWildcard(_util);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

/***/ },
/* 24 */
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
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.getAttr = exports.patchObject = exports.removeAttribute = exports.applyAttributes = undefined;

	var _util = __webpack_require__(20);

	var _ = _interopRequireWildcard(_util);

	var _camelize = __webpack_require__(26);

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
/* 26 */
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
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	exports.default = function (patch) {
		var node = patch.left;
		patchDom(node, patch, 0);
	};

	var _vPatch = __webpack_require__(21);

	var _vPatch2 = _interopRequireDefault(_vPatch);

	var _util = __webpack_require__(20);

	var _ = _interopRequireWildcard(_util);

	var _traversal = __webpack_require__(28);

	var _traversal2 = _interopRequireDefault(_traversal);

	var _curd = __webpack_require__(29);

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
/* 28 */
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
/* 29 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.applyAttributes = exports.replaceChild = exports.replaceContent = exports.removeChild = exports.insertChild = undefined;

	var _attribute = __webpack_require__(25);

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
/* 30 */
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

	function addProperty(node, property, value) {
		if (property === 'class') {
			node.className = _.trim([node[property], value].join(' '));
		} else if (property === 'value') {
			node.value = value;
		} else {
			node.setAttribute(property, value);
		}
	}

	function removeProperty(node, property, value) {
		if (property === 'class') {
			node.className = node.className.replace(new RegExp('\\b' + value + '\\b'), '');
		} else {
			node.removeAttribute(property);
		}
	}

	function vBind(node, vm, value, property) {
		if (_.isType(value, 'object')) {
			for (var key in value) {
				if (value[key]) {
					addProperty(node, property, key);
				} else {
					removeProperty(node, property, key);
				}
			}
		} else {
			addProperty(node, property, value);
		}
	}

	exports.default = {
		update: function update(value) {
			vBind(this.$el, this.$vm, value, this.extraName);
		}
	};

/***/ },
/* 31 */
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
/* 32 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _util = __webpack_require__(2);

	var _ = _interopRequireWildcard(_util);

	var _diffDom = __webpack_require__(19);

	var _diffDom2 = _interopRequireDefault(_diffDom);

	var _patch = __webpack_require__(27);

	var _patch2 = _interopRequireDefault(_patch);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	function vIf(node, vm, value) {
		if (value) {
			// 这种2次操作的方式，实际和未dom-diff差别不大
			if (this.$el.__anchor__) {
				if (this.$el._component) {
					(0, _patch2.default)((0, _diffDom2.default)(this.$el.__anchor__, this.$el._component.frag.firstElementChild));
				} else {
					(0, _patch2.default)((0, _diffDom2.default)(this.$el.__anchor__, this.$el));
				}
			}
			if (this.elseEl) {
				this.elseEl.__anchor__ = document.createTextNode('');
				(0, _patch2.default)((0, _diffDom2.default)(this.elseEl, this.elseEl.__anchor__));
			}
		} else {
			this.$el.__anchor__ = document.createTextNode('');
			if (this.$el._component) {
				(0, _patch2.default)((0, _diffDom2.default)(this.$el._component.frag.firstElementChild, this.$el.__anchor__));
			} else {
				(0, _patch2.default)((0, _diffDom2.default)(this.$el, this.$el.__anchor__));
			}
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
/* 33 */
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
/* 34 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	exports.default = function (Compiler) {

		function parseBindOn(str) {
			if (/^@/.test(str)) {
				// @event
				return 'on';
			} else if (/^\:/.test(str)) {
				// :bindProperty
				return 'bind';
			} else {
				// v-on:  v-bind:
				return str.replace(/^v\-|\:$/g, '');
			}
		}

		// ES6 function写法会导致this解析问题
		Compiler.prototype._parseAttr = function (node, attr) {
			var customDirectives = this.$vm.constructor._cusDirectives || {};
			var customNames = Object.keys(customDirectives);
			var self = this;
			var bindOn = /(v\-on\:|v\-bind\:|@|\:)([\w\-]*)/;
			// short name
			// v-on:event   @event
			// v-bind:property  :property
			if (bindOn.test(attr.name)) {
				// debugger;
				var extraName = RegExp.$2;
				var directiveName = parseBindOn(RegExp.$1);
				var keyCode = attr.name.replace(bindOn, '');
				// @keyup.enter
				// @keyup.esc
				if (keyCode) {
					node['_' + extraName] = node['_' + extraName] || [];
					node['_' + extraName].push(keyCode.replace(/^\./, ''));
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
				var watchExp = null;
				switch (property) {
					case 'for':
						var info = (0, _for.parseForExpression)(attr.value);
						// cache directive infomation
						node._forInfo = info;
						watchExp = info.val;
					// v-model
					case 'model':
					case 'text':
					case 'html':
					case 'show':
					case 'if':
						self.$vm.bindDir(Object.assign({
							expression: attr.value,
							name: property,
							watchExp: watchExp
						}, Dir['v' + _.upperFirst(property)]), node);
						break;
					default:
						console.log('custom directive `' + property + '`');
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
/* 35 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	exports.default = function (Compiler) {
		Compiler.prototype._parseComponent = function (node) {
			var self = this;
			var allCom = this.$vm.constructor._globalCom;
			var vm = this.$vm;
			var descriptor = allCom[node.tagName.toLowerCase()];
			descriptor.parent = vm;
			// var props = descriptor.props || [];
			// props获取的数据
			// props中的数据会被重复监听（component一次，MVVM初始化一次）
			// component是全局VM的一个child
			var instance = new _component2.default(node, descriptor.name, descriptor);

			var comVm = Object.create(vm.__proto__);
			comVm.methods = instance.methods;
			// parse表达式时，向上查找
			comVm.$data = instance.data || {};
			_.proxyData(comVm, '$data');
			comVm.props = _.parseNodeAttr2Obj(node);
			// 记录全局VM
			comVm.$parent = vm;
			comVm._events = instance.events;
			(vm.$children || (vm.$children = [])).push(comVm);
			//  每个Componet的instance是沙箱模式
			new Compiler({
				el: instance.frag,
				vm: comVm
			});
			node._component = instance;
			node.parentNode && node.parentNode.replaceChild(instance.frag, node);
		};
	};

	var _component = __webpack_require__(36);

	var _component2 = _interopRequireDefault(_component);

	var _expression = __webpack_require__(5);

	var _util = __webpack_require__(2);

	var _ = _interopRequireWildcard(_util);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ },
/* 36 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); // import Compiler from './complier/complier';


	var _observer = __webpack_require__(37);

	var _observer2 = _interopRequireDefault(_observer);

	var _util = __webpack_require__(2);

	var _ = _interopRequireWildcard(_util);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	// TODO: property compiler
	var id = 0;

	var Component = function () {
		function Component(el, name, descriptor) {
			_classCallCheck(this, Component);

			this.el = el;
			this.uid = ++id;
			this.name = name;
			this.descriptor = descriptor;
			this.template = descriptor.template;
			// props生成的数据，不需要重复监听
			this.data = typeof descriptor.data === 'function' ? descriptor.data() : descriptor.data;
			// props中引用vm的数据，不监听
			this.methods = descriptor.methods;
			this.events = descriptor.events;
			this.parent = descriptor.parent || null;
			this.init();
		}

		_createClass(Component, [{
			key: 'init',
			value: function init() {
				new _observer2.default(this.data);
				this.parseProps().initComputed().render();
			}
		}, {
			key: 'render',
			value: function render() {
				// component template.
				var frag = document.createDocumentFragment();
				// template ID
				var template = this.template;
				if (/^#/.test(template)) {
					var tempDom = document.querySelector(template);
					template = tempDom.innerHTML;
					// remove template DOM from Document.
					tempDom.parentNode.removeChild(tempDom);
					// record finally component template
					this.descriptor.template = template;
				}
				var div = document.createElement('div');
				div.innerHTML = template;
				[].slice.call(div.children).forEach(function (child) {
					frag.appendChild(child);
				});
				this.frag = frag;
			}
		}, {
			key: 'initComputed',
			value: function initComputed() {
				var self = this;
				var computed = this.descriptor.computed;
				var keys = Object.keys(this.descriptor.computed);
				keys.forEach(function (m) {
					self.data[m] = computed[m].call(self.data);
				});
				return this;
			}
		}, {
			key: 'parseProps',
			value: function parseProps() {
				var _this = this;

				var props = Object.keys(this.descriptor.props);
				var attrs = _.parseNodeAttr2Obj(this.el);
				var self = this;
				props.forEach(function (prop) {
					var exp = _this.el.getAttribute(prop);
					if (exp) {
						self.data[prop] = exp;
					} else {
						exp = _this.el.getAttribute(':' + prop);
						exp && (self.data[prop] = self.parent[exp]);
					}
				});
				return self;
			}
		}]);

		return Component;
	}();

	exports.default = Component;

/***/ },
/* 37 */
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

	// splice添加参数起始位置
	var SPLICT_PARAM_INDEX = 2;

	var Observer = function () {
		function Observer(data) {
			_classCallCheck(this, Observer);

			this.$data = data;
			this.observe(this.$data);
		}

		_createClass(Observer, [{
			key: 'defineArrayReactive',
			value: function defineArrayReactive(arr, callback) {
				var self = this;
				var oldProto = Array.prototype;
				var overrideProto = Object.create(Array.prototype);
				['push', 'pop', 'reverse', 'sort', 'slice', 'shift', 'unshift', 'splice'].forEach(function (name) {
					var oldMethod = oldProto[name];
					Object.defineProperty(overrideProto, name, {
						enumerable: false,
						configurable: true,
						writable: true,
						value: function value() {
							var oldArr = [].slice.call(this);
							var arg = [].slice.call(arguments);
							oldMethod.apply(this, arg);
							// arg is array
							switch (name) {
								case 'push':
								case 'unshift':
								case 'splice':
									// push(item1, item2,..., itemn);
									// unshift(item1, item2,..., itemn);
									// splice(index, count, item1, ..., itemn);
									if (name == 'push' || name == 'unshift' || name == 'splice' && arg.length > SPLICT_PARAM_INDEX) {
										var start = name == 'splice' ? SPLICT_PARAM_INDEX : 0;
										for (var i = start; i < arg.length; i++) {
											if (_.isType(arg[i], 'object')) {
												self.observe(arg[i]);
											}
										}
									}
									break;
								default:
									break;
							}
							// 后面有dom diff的算法，这里可以不需要
							if (this.length !== oldArr.length || name === 'reverse' || name === 'sort') {
								callback(this);
							}
							return this;
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

/***/ },
/* 38 */
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
				if (typeof this.bind === 'function') {
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
/* 39 */
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
			var parent = this;
			while (parent && !parent._events) {
				parent = parent.$parent;
			}
			var fns = parent._events[name];
			if (_.isType(fns, 'array')) {
				fns.forEach(function (fn) {
					fn.apply(parent, args);
				});
			} else if (_.isType(fns, 'function')) {
				fns.apply(parent, args);
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
/* 40 */
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