'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.MVVM = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * entry
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */

// TODO: slot support


var _compiler = require('./compiler/compiler');

var _compiler2 = _interopRequireDefault(_compiler);

var _observer = require('./observer/observer');

var _observer2 = _interopRequireDefault(_observer);

var _watcher = require('./observer/watcher');

var _watcher2 = _interopRequireDefault(_watcher);

var _directive = require('./directive');

var _directive2 = _interopRequireDefault(_directive);

var _events = require('./events');

var _events2 = _interopRequireDefault(_events);

var _index = require('./filters/index');

var _index2 = _interopRequireDefault(_index);

var _depender = require('./observer/depender');

var _depender2 = _interopRequireDefault(_depender);

var _util = require('./util');

var _ = _interopRequireWildcard(_util);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var defineProperty = Object.defineProperty;

// const proxy = function(vm, key) {
// 	defineProperty(vm, key, {
// 		configurable: true,
// 		enumerable: true,
// 		get: function() {
// 			return vm.$data[key];
// 		},
// 		set: function(val) {
// 			vm.$data[key] = val;
// 		}
// 	});
// }

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
			var keys = Object.keys(this.$data);
			var vm = this;
			keys.map(function (key) {
				// proxy all property from data into instance.
				Object.defineProperty(vm, key, {
					configurable: true,
					enumerable: true,
					get: function get() {
						return vm.$data[key];
					},
					set: function set(val) {
						vm.$data[key] = val;
					}
				});
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