/**
 * entry
 */

import Compiler from './compiler';
import Observer from './observer';
import Watcher from './watcher';
import Directive from './directive';
class MVVM {
	constructor(options) {
		this.$data = options.data || {};
		this.$el = typeof options.el === 'string' ? document.querySelector(options.el) : options.el || document.body;
		this.methods = options.methods;
		this.filters = options.filters || {};
		this.computed = options.computed || {};
		this._directives = [];
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
	bindDir(descriptor, node) {
		var self = this;
		this._directives.push(new Directive(descriptor, this, node));
	}
}


MVVM.directive = function(name, descriptor) {
	if (!this._cusDirectives) {
		this._cusDirectives = {};
	}
	this._cusDirectives[name] = descriptor;
	if (descriptor.bind) {
		var _bind = descriptor.bind;
		descriptor.bind = function() {
			var _descriptor = this.descriptor;
			_bind(this.$el, {
				expression: this.expression,
				value: ''
			});
		};
	}

	if (descriptor.update) {
		var _update = descriptor.update;
		descriptor.update = function() {
			_update(this.$el, {
				expression: this.expression,
				value: this._watcher.value
			});
		}
	}
};


export {
	MVVM
};