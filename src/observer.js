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
		Object.defineProperty(data, key, {
			configurable: false,
			enumerable: true,
			set: function(newVal) {
				val = newVal;
				self.observe(data);
				self.$watcher.emit(key, newVal);
			},
			get: function() {
				return val;
			}
		});
	}
}

export default Observer;