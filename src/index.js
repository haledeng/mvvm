/**
 * entry
 */

import Compiler from './compiler';
import Observer from './observer';
import Watcher from './watcher';
class MVVM {
	constructor(options) {
		this.$data = options.data || {};
		this.$el = typeof options.el === 'string' ? document.querySelector(options.el) : options.el || document.body;
		this.methods = options.methods;
		this.filters = options.filters || {};
		new Observer(this.$data);
		new Compiler({
			el: this.$el,
			vm: this
		});
		this.copyData2Vm();
	}
	copyData2Vm() {
		// 将data属性copy到vm下
		for (var prop in this.$data) {
			if (this.$data.hasOwnProperty(prop) && !this.hasOwnProperty(prop)) {
				this[prop] = this.$data[prop];
			}
		}
	}
	$watch(paramName, callback) {
		var self = this
		new Watcher({
			vm: self,
			exp: paramName,
			callback: function(vm, newVal, oldVal) {
				// watch variable change.
				typeof callback === 'function' && callback.call(vm, oldVal, newVal);
			}
		});
	}
}

export {
	MVVM
};