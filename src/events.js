import * as _ from './util';
export default function(Lib) {
	Lib.prototype.$on = function(name, callback) {
		if (!this._events) {
			this._events = {};
		}
		(this._events[name] || (this._events[name] = [])).push(callback);
	};


	Lib.prototype.$emit = function(name) {
		var args = [].slice.call(arguments, 1);
		var self = this;
		var fns = this._events[name];
		if (_.isType(fns, 'array')) {
			fns.forEach(function(fn) {
				fn.apply(self.$data, args);
			});
		} else if (_.isType(fns, 'function')) {
			fns.apply(self.$data, args);
		}

	};

	Lib.prototype.$broadcast = function() {
		var children = this.$children;
		var shouldPropagate = false;
		var args = arguments;
		children.forEach(function(child) {
			shouldPropagate = child.$emit.apply(child, args);
			// if (shouldPropagate) {
			// 	child.$broadcast.apply(child, arguments);
			// }
		});
	}
}