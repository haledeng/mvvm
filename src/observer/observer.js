import Dep from './depender';
import * as _ from '../util';


// splice添加参数起始位置
const SPLICT_PARAM_INDEX = 2;

class Observer {
	constructor(data) {
		this.$data = data;
		this.observe(this.$data);
	}
	defineArrayReactive(arr, callback) {
		var self = this;
		var oldProto = Array.prototype;
		var overrideProto = Object.create(Array.prototype);
		['push', 'pop', 'reverse', 'sort', 'slice', 'shift',
			'unshift', 'splice'
		].forEach(function(name) {
			var oldMethod = oldProto[name];
			Object.defineProperty(overrideProto, name, {
				enumerable: false,
				configurable: true,
				writable: true,
				value: function() {
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
							if (name == 'push' || name == 'unshift' || (name == 'splice' && arg.length > SPLICT_PARAM_INDEX)) {
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
			})
		});
		arr.__proto__ = overrideProto;
	}
	observe(data) {
		if (!data || !_.isType(data, 'object')) return;
		var self = this;
		Object.keys(data).forEach(function(key) {
			self.defineReactive(data, key, data[key]);
		});

	}
	defineReactive(data, key, val) {
		var dep = new Dep();
		var self = this;
		// 多层对象嵌套
		if (_.isType(val, 'array')) {
			self.defineArrayReactive(val, function() {
				dep.notify();
			});
			val.forEach(function(item) {
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
			set: function(newVal) {
				if (newVal !== val) {
					val = newVal;
					self.observe(newVal);
					dep.notify();
				}
			},
			get: function() {
				Dep.target && dep.addSub(Dep.target);
				return val;
			}
		});
	}
}

export default Observer;