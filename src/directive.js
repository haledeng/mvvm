// custom directive

import Watcher from './watcher';
// export default function(MVVM) {
// 	/**
// 	 * define custom directive
// 	 * @param  {string} name  directive name
// 	 * @param  {object} hooks directive hooks
// 	 * @return {[type]}       [description]
// 	 */
// 	*
// 	 * hooks functions may be following:
// 	 * http://vuejs.org/v2/guide/custom-directive.html

// 	MVVM.directive = function(name, hooks) {
// 		if (typeof name !== 'string') return;
// 		if (!this._directives) {
// 			this._directives = {};
// 		}
// 		if (!this._directives[name]) {
// 			this._directives[name] = hooks;
// 		}
// 	}
// }

function noop() {};

class Directive {
	constructor(descriptor, vm, node) {
		this.descriptor = descriptor;
		this.bind = descriptor.bind || noop;
		this.update = descriptor.update || noop;
		this.expression = descriptor.expression;
		this.$el = node;
		this.$vm = vm;
		this.name = descriptor.name;
		this._bind();
	}
	_bind() {
		var self = this;
		if (this.bind) {
			this.bind();
		}
		if (this.update) {
			this._watcher = new Watcher({
				vm: this.$vm,
				exp: this.expression,
				callback: function(vm, value, oldValue) {
					self.update(value);
				}
			});

			this.update(this._watcher.value);
		}
	}
	set(key, value) {
		this.$vm.$data[key] = value;
	}
}

export default Directive;