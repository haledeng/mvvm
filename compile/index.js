'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.MVVM = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * entry
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */

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

var _util = require('./util');

var _ = _interopRequireWildcard(_util);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var MVVM = function () {
	function MVVM(options) {
		_classCallCheck(this, MVVM);

		this.$data = options.data || {};
		this.$el = typeof options.el === 'string' ? document.querySelector(options.el) : options.el || document.body;
		this.methods = options.methods;
		this.filters = _.mixin(_index2.default, options.filters || {});
		this.computed = options.computed || {};
		this.copyData2Vm();
		new _observer2.default(this.$data);
		// observe(this.$data);
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
			// 切换上下文
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