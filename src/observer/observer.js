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