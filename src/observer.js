import Watcher from './watcher';
class Observer {
	constructor(data) {
		this.$data = data;
		this.addObserverForAllProperty();
		this.$watcher = new Watcher();
	}
	addObserverForAllProperty() {
		for (var key in this.$data) {
			if (this.$data.hasOwnProperty(key)) {
				this.addObserver(this.$data, key, this.$data[key]);
			}
		}
	}
	addObserver(data, key, val) {
		var self = this;
		Object.defineProperty(data, key, {
			configurable: false,
			enumerable: true,
			set: function(newVal) {
				val = newVal;
				self.$watcher.emit(key, newVal);
			},
			get: function() {
				return val;
			}
		});
	}
}

export default Observer;