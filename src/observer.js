// import Watcher from './watcher';
import Dep from './depender';
class Observer {
	constructor(data) {
		this.$data = data;
		this.observe(this.$data);
		// this.$watcher = new Watcher();
	}
	observe(data) {
		if (!data || typeof data !== 'object') return;
		var self = this;
		Object.keys(data).forEach(function(key) {
			self.defineReactive(data, key, data[key]);
		});
	}
	defineReactive(data, key, val) {
		var dep = new Dep()
		var self = this;
		// 多层对象嵌套
		self.observe(val);
		Object.defineProperty(data, key, {
			configurable: false,
			enumerable: true,
			set: function(newVal) {
				if (newVal !== val) {
					val = newVal;
					self.observe(newVal);
					dep.notify();
				}
				// TODO: key may be same
				// self.$watcher.emit(key, newVal);
			},
			get: function() {
				Dep.target && dep.addSub(Dep.target);
				return val;
			}
		});
	}
}

export default Observer;