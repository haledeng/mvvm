'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _depender = require('./depender');

var _depender2 = _interopRequireDefault(_depender);

var _util = require('../util');

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