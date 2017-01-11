'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _depender = require('./depender');

var _depender2 = _interopRequireDefault(_depender);

var _util = require('./util');

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