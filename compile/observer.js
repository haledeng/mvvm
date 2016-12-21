'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); // import Watcher from './watcher';


var _depender = require('./depender');

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