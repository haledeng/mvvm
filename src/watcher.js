/**
 *	事件监听的方式来处理
 */
// class Watcher {
// 	constructor() {

// 	}
// 	on(name, callback) {
// 		if (typeof callback === 'function') {
// 			if (!Watcher._evMaps[name]) {
// 				Watcher._evMaps[name] = [];
// 			}
// 			Watcher._evMaps[name].push(callback);
// 		}
// 	}
// 	off(name) {
// 		if (Watcher._evMaps[name]) {
// 			delete Watcher._evMaps[name];
// 		}
// 	}
// 	emit(name) {
// 		var callbacks = Watcher._evMaps[name];
// 		var args = [].slice.call(arguments, 1);
// 		callbacks.forEach(function(callback) {
// 			callback(args);
// 		});
// 	}
// }
// Watcher._evMaps = {};
var uid = 0;
import Dep from './depender';
import {
	calculateExpression
} from './directive';
class Watcher {
	constructor(opts) {
		this.id = uid++;
		this.vm = opts.vm;
		this.exp = opts.exp;
		this.callback = opts.callback;
		this.value = this.get();
	}
	update() {
		var newVal = this.get();
		var oldVal = this.value;
		if (oldVal != newVal) {
			this.value = newVal;
			// this.callback.call(this.vm, newVal, oldVal);
			this.callback(this.vm, newVal, oldVal);
		}
	}
	get() {
		Dep.target = this;
		// var value = this.vm[this.exp];
		var value = calculateExpression(this.vm, this.exp);
		Dep.target = null;
		return value;
	}
}
export default Watcher;