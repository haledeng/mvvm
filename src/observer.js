import Dep from './depender';
import * as _ from './util';
class Observer {
	constructor(data) {
		this.$data = data;
		this.observe(this.$data);
	}
	defineArrayReactive(arr, callback) {
		var oldProto = Array.prototype;
		var overrideProto = Object.create(Array.prototype);
		var result;
		['push', 'pop'].forEach(function(name) {
			var oldMethod = oldProto[name];
			Object.defineProperty(overrideProto, name, {
				enumerable: false,
				configurable: true,
				writable: true,
				value: function() {
					var oldArr = this.slice(0);
					var arg = [].slice.call(arguments);
					result = oldMethod.apply(this, arg);
					if (result.length !== oldArr.length) {
						callback(result);
					}
					return result;
				}
			})
		});
		arr.__proto__ = overrideProto;
	}
	observe(data) {
		// if (!data || !_.isType(data, 'object')) return;
		if (!data) return;
		var self = this;
		if (_.isType(data, 'array')) {
			// 重写array的push等方法
			// self.defineArrayReactive(data);
		} else if (_.isType(data, 'object')) {
			Object.keys(data).forEach(function(key) {
				self.defineReactive(data, key, data[key]);
			});
		}

	}
	defineReactive(data, key, val) {
		var dep = new Dep()
		var self = this;
		// 多层对象嵌套
		if (_.isType(val, 'array')) {
			self.defineArrayReactive(val, function() {
				dep.notify();
			});
			val.forEach(function(item) {
				self.observe(item);
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