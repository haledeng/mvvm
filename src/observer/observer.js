import Dep from './depender';
import * as _ from '../util';
class Observer {
	constructor(data) {
		this.$data = data;
		this.observe(this.$data);
	}
	defineArrayReactive(arr, callback) {
		var oldProto = Array.prototype;
		var overrideProto = Object.create(Array.prototype);
		var result;
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
			})
		});
		arr.__proto__ = overrideProto;
	}
	observe(data) {
		if (!data) return;
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