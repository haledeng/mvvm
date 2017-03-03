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