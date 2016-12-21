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

	var _observer = __webpack_require__(11);

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

	var _index = __webpack_require__(6);

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
	            // 遍历节点
	            var self = this;
	            var elements = node.getElementsByTagName('*');
	            elements = [].slice.call(elements);
	            elements.forEach(function (element) {
	                self.traversalAttribute(element);
	                if (self.isTextNode(element)) {
	                    self.parseTextNode(element);
	                }
	            });
	        }
	    }, {
	        key: 'traversalAttribute',
	        value: function traversalAttribute(node) {
	            var self = this;
	            // 遍历属性
	            var attrs = node.attributes;
	            for (var i = 0; i < attrs.length; i++) {
	                var item = attrs[i];
	                if (/^v\-([\w\:]*)/.test(item.name)) {
	                    // async
	                    (function (_item) {
	                        self.bindWatch(self.$vm.$data, item.value, function () {
	                            self._parseAttr(node, _item);
	                        });
	                    })(Object.assign({}, {
	                        name: item.name,
	                        value: item.value
	                    }));

	                    this._parseAttr(node, item);
	                    this.addInputListener(node, item);
	                }
	            }
	        }
	    }, {
	        key: '_parseAttr',
	        value: function _parseAttr(node, attr) {
	            // 转化属性
	            var self = this;
	            var attrReg = /^v\-([\w\:]*)/;
	            var matches = attr.name.match(attrReg);
	            // var tagName = node.tagName.toLowerCase();
	            var property = matches[1];
	            switch (property) {
	                // v-model
	                case 'model':
	                    (0, _index.vModel)(node, self.$vm.$data, attr.value);
	                    break;
	                // v-text
	                case 'text':
	                    (0, _index.vText)(node, this.$vm.$data, attr.value);
	                    break;
	                case 'on:click':
	                    // bind multy times
	                    _index.vOn.call(this.$vm.$data, node, this.$vm.methods, attr.value);
	                    break;
	                default:
	                    break;
	            }
	        }
	    }, {
	        key: 'addInputListener',
	        value: function addInputListener(node, attr) {
	            if (attr.name !== 'v-model') return;
	            var key = attr.value;
	            var oldVal = (0, _index.calculateExpression)(this.$vm.$data, key);
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
	            var _replace = function _replace(scope) {
	                var newHtml = html.replace(/\{\{([^\}]*)\}\}/g, function (all, name) {
	                    if (!keys.length) {
	                        keys.push(name);
	                    }
	                    name = _.trim(name);
	                    return scope[name] || '';
	                });
	                node.innerHTML = newHtml;
	            };
	            _replace(this.$vm.$data);
	            keys.forEach(function (key) {
	                self.bindWatch(self.$vm.$data, key, _replace);
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

	exports.trim = trim;

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

	var _directive = __webpack_require__(5);

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
				if (oldVal != newVal) {
					this.value = newVal;
					// this.callback.call(this.vm, newVal, oldVal);
					this.callback(this.vm, newVal, oldVal);
				}
			}
		}, {
			key: 'get',
			value: function get() {
				_depender2.default.target = this;
				// var value = this.vm[this.exp];
				var value = (0, _directive.calculateExpression)(this.vm, this.exp);
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
	exports.setScopeValue = exports.calculateExpression = exports.vFor = exports.vText = exports.vModel = undefined;

	var _util = __webpack_require__(2);

	var _ = _interopRequireWildcard(_util);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	// v-model
	var vModel = function vModel(node, scope, key) {
		var tagName = node.tagName.toLowerCase();
		var value = calculateExpression(scope, key);
		if (tagName === 'input') {
			node.value = value;
		} else if (tagName === 'textarea') {
			node.innerHTML = value;
		}
	};

	// v-text
	var vText = function vText(node, scope, key) {
		node.innerHTML = calculateExpression(scope, key);
	};

	// +,-,m.n,*,/
	// 添加上下文
	// AST?
	var addScope = function addScope(exp) {
		var prefix = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'scope';

		exp = _.trim(exp);
		// x.y
		exp = exp.replace(/\w+(?=\.)/g, function (match, index, all) {
			return [prefix, match].join('.');
		});
		exp = ' ' + exp + ' ';
		// x
		exp = exp.replace(/[\+\-\*\/\s]\w+(?![\'\.])[\+\-\*\/\s]/g, function (match, index, all) {
			return [prefix, _.trim(match)].join('.');
		});
		return _.trim(exp);

		// return exp.replace(/^([\'\w]*)\s*?([\+\-\*\/\.])?\s*?([\'\w]*)?$/, function(total, all, left, operater, right) {
		// 	if (left.indexOf('\'') === -1) {
		// 		left = [prefix, left].join('.');
		// 	}
		// 	if (right && right.indexOf('\'') === -1) {
		// 		if (operater !== '.') {
		// 			right = [prefix, right].join('.');
		// 		}
		// 		return left + operater + right;
		// 	}
		// 	return left;
		// });
	};

	// 计算表达式
	// strict mode can not use with
	// new Function
	var calculateExpression = function calculateExpression(scope, exp) {
		var prefix = 'scope';
		exp = addScope(exp);
		var fn = new Function(prefix, 'return ' + exp);
		return fn(scope);
		// with(scope) {
		// 	return eval(exp);
		// }
	};

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

	// v-for
	var vFor = function vFor() {};

	exports.vModel = vModel;
	exports.vText = vText;
	exports.vFor = vFor;
	exports.calculateExpression = calculateExpression;
	exports.setScopeValue = setScopeValue;

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.vOn = exports.calculateExpression = exports.setScopeValue = exports.vText = exports.vModel = undefined;

	var _model = __webpack_require__(7);

	var _model2 = _interopRequireDefault(_model);

	var _text = __webpack_require__(9);

	var _text2 = _interopRequireDefault(_text);

	var _expression = __webpack_require__(8);

	var _expression2 = _interopRequireDefault(_expression);

	var _event = __webpack_require__(10);

	var _event2 = _interopRequireDefault(_event);

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
	exports.calculateExpression = _expression2.default;
	exports.vOn = _event2.default;

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _expression = __webpack_require__(8);

	var _expression2 = _interopRequireDefault(_expression);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var vModel = function vModel(node, scope, key) {
	    var tagName = node.tagName.toLowerCase();
	    var value = (0, _expression2.default)(scope, key);
	    if (tagName === 'input') {
	        node.value = value;
	    } else if (tagName === 'textarea') {
	        node.innerHTML = value;
	    }
	    // node.removeAttribute('v-model');
	};

	exports.default = vModel;

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

	// +,-,m.n,*,/
	// 添加上下文
	// AST?
	var addScope = function addScope(exp) {
	    var prefix = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'scope';

	    exp = _.trim(exp);
	    // x.y
	    exp = exp.replace(/\w+(?=\.)/g, function (match, index, all) {
	        return [prefix, match].join('.');
	    });
	    exp = ' ' + exp + ' ';
	    // x
	    exp = exp.replace(/[\+\-\*\/\s]\w+(?![\'\.])[\+\-\*\/\s]/g, function (match, index, all) {
	        return [prefix, _.trim(match)].join('.');
	    });
	    return _.trim(exp);

	    // return exp.replace(/^([\'\w]*)\s*?([\+\-\*\/\.])?\s*?([\'\w]*)?$/, function(total, all, left, operater, right) {
	    //  if (left.indexOf('\'') === -1) {
	    //      left = [prefix, left].join('.');
	    //  }
	    //  if (right && right.indexOf('\'') === -1) {
	    //      if (operater !== '.') {
	    //          right = [prefix, right].join('.');
	    //      }
	    //      return left + operater + right;
	    //  }
	    //  return left;
	    // });
	};

	// 计算表达式
	// strict mode can not use with
	// new Function
	var calculateExpression = function calculateExpression(scope, exp) {
	    var prefix = 'scope';
	    exp = addScope(exp);
	    var fn = new Function(prefix, 'return ' + exp);
	    return fn(scope);
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

	var _expression = __webpack_require__(8);

	var _expression2 = _interopRequireDefault(_expression);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	// v-text
	var vText = function vText(node, scope, key) {
	    node.innerHTML = (0, _expression2.default)(scope, key);
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
	function vOn(node, methods, value) {
	    if (typeof value !== 'string') return;
	    var method = methods[value] || function () {};
	    var self = this;
	    node.addEventListener('click', function () {
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

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); // import Watcher from './watcher';


	var _depender = __webpack_require__(4);

	var _depender2 = _interopRequireDefault(_depender);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Observer = function () {
		function Observer(data) {
			_classCallCheck(this, Observer);

			this.$data = data;
			this.observe(this.$data);
			// this.$watcher = new Watcher();
		}

		_createClass(Observer, [{
			key: 'observe',
			value: function observe(data) {
				if (!data || (typeof data === 'undefined' ? 'undefined' : _typeof(data)) !== 'object') return;
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
				self.observe(val);
				Object.defineProperty(data, key, {
					configurable: false,
					enumerable: true,
					set: function set(newVal) {
						if (newVal !== val) {
							val = newVal;
							self.observe(newVal);
							dep.notify();
						}
						// TODO: key may be same
						// self.$watcher.emit(key, newVal);
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