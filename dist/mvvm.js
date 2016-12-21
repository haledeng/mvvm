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

	var _observer = __webpack_require__(4);

	var _observer2 = _interopRequireDefault(_observer);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } } /**
	                                                                                                                                                           * entry
	                                                                                                                                                           */

	var MVVM = function MVVM(options) {
		_classCallCheck(this, MVVM);

		this.$data = options.data || {};
		this.$el = typeof options.el === 'string' ? document.querySelector(options.el) : options.el || document.body;
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

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Compiler = function () {
		function Compiler(opts) {
			_classCallCheck(this, Compiler);

			this.$el = typeof opts.el === 'string' ? document.querySelector(opts.el) : opts.el;
			this.$vm = opts.vm;
			this.$watcher = new _watcher2.default();
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
					if (/^v\-(\w*)/.test(item.name)) {
						this.$watcher.on(item.value, function () {
							self._parseAttr(node, item);
						});
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
				var attrReg = /^v\-(\w*)/;
				var matches = attr.name.match(attrReg);
				var tagName = node.tagName.toLowerCase();
				var property = matches[1];
				switch (property) {
					// v-model
					case 'model':
						if (tagName === 'input') {
							node.value = self.$vm.$data[attr.value] || '';
						} else if (tagName === 'textarea') {
							node.innerHTML = this.$vm.$data[attr.value] || '';
						}
						break;
					// v-text
					case 'text':
						node.innerHTML = this.$vm.$data[attr.value] || '';
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
				var oldVal = this.$vm.$data[key];
				var self = this;
				// v-model监听
				node.addEventListener('change', function () {}, false);
				node.addEventListener('keyup', function () {
					if (node.value != oldVal) {
						self.$vm.$data[key] = node.value;
					}
				}, false);
			}
		}, {
			key: 'isTextNode',
			value: function isTextNode(node) {
				return node.children.length === 0 && node.childNodes.length !== 0;
			}
		}, {
			key: 'parseTextNode',
			value: function parseTextNode(node) {
				var self = this;
				var html = node.innerHTML;
				var keys = [];
				var _replace = function _replace() {
					var newHtml = html.replace(/\{\{([^\}]*)\}\}/g, function (all, name) {
						if (!keys.length) {
							keys.push(name);
						}
						name = _.trim(name);
						return self.$vm.$data[name] || '';
					});
					node.innerHTML = newHtml;
				};
				_replace();
				keys.forEach(function (key) {
					self.$watcher.on(key, function () {
						_replace();
					});
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
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Watcher = function () {
		function Watcher() {
			_classCallCheck(this, Watcher);
		}

		_createClass(Watcher, [{
			key: 'on',
			value: function on(name, callback) {
				if (typeof callback === 'function') {
					if (!Watcher._evMaps[name]) {
						Watcher._evMaps[name] = [];
					}
					Watcher._evMaps[name].push(callback);
				}
			}
		}, {
			key: 'off',
			value: function off(name) {
				if (Watcher._evMaps[name]) {
					delete Watcher._evMaps[name];
				}
			}
		}, {
			key: 'emit',
			value: function emit(name) {
				var callbacks = Watcher._evMaps[name];
				var args = [].slice.call(arguments, 1);
				callbacks.forEach(function (callback) {
					callback(args);
				});
			}
		}]);

		return Watcher;
	}();

	Watcher._evMaps = {};
	exports.default = Watcher;

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _watcher = __webpack_require__(3);

	var _watcher2 = _interopRequireDefault(_watcher);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Observer = function () {
		function Observer(data) {
			_classCallCheck(this, Observer);

			this.$data = data;
			this.addObserverForAllProperty();
			this.$watcher = new _watcher2.default();
		}

		_createClass(Observer, [{
			key: 'addObserverForAllProperty',
			value: function addObserverForAllProperty() {
				for (var key in this.$data) {
					if (this.$data.hasOwnProperty(key)) {
						this.addObserver(this.$data, key, this.$data[key]);
					}
				}
			}
		}, {
			key: 'addObserver',
			value: function addObserver(data, key, val) {
				var self = this;
				Object.defineProperty(data, key, {
					configurable: false,
					enumerable: true,
					set: function set(newVal) {
						val = newVal;
						self.$watcher.emit(key, newVal);
					},
					get: function get() {
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