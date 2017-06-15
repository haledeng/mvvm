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
		var parent = this;
		while (parent && !parent._events) {
			parent = parent.$parent;
		}
		var fns = parent._events[name];
		if (_.isType(fns, 'array')) {
			fns.forEach(function(fn) {
				fn.apply(parent, args);
			});
		} else if (_.isType(fns, 'function')) {
			fns.apply(parent, args);
		}

	};

	// 向所有子组件广播事件
	Lib.prototype.$broadcast = function() {
		var children = this.$children;
		var shouldPropagate = false;
		var args = arguments;
		children.forEach(function(child) {
			shouldPropagate = child.$emit.apply(child, args);
			// 是否继续向下传播
			if (shouldPropagate) {
				child.$broadcast.apply(child, args);
			}
		});
	};

	// 父节点冒泡事件
	Lib.prototype.$dispatch = function() {
		var parent = this.$parent;
		var shouldPropagate = false;
		while (parent) {
			shouldPropagate = parent.$emit.apply(parent, arguments);
			parent = shouldPropagate ? parent.$parent : null;
		}
	}
}