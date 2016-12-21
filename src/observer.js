import Watcher from './watcher';
class Observer {
	constructor(data) {
		this.$data = data;
		this.addObserverForAllProperty();
		this.$watcher = new Watcher();
	}
	init() {
		this.observe(this.$data);
	}
	observe(data) {
		if (!data || typeof data !== 'object') return;
		var self = this;
		Object.keys(data).forEach(function(key) {
			self.defineReactive(data, key, data[key]);
		});
	}
	defineReactive(data, key, val) {
		var self = this;
		// 多层对象嵌套
		// self.observe(data);
		Object.defineProperty(data, key, {
			configurable: false,
			enumerable: true,
			set: function(newVal) {
				val = newVal;
				self.observe(data);
				// TODO: key may be same
				self.$watcher.emit(key, newVal);
			},
			get: function() {
				return val;
			}
		});
	}
}

export default Observer;