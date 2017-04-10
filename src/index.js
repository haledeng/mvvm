/**
 * entry
 */

import Compiler from './compiler/compiler';
import Observer from './observer/observer';
import Watcher from './observer/watcher';
import Directive from './directive';
import eventMixin from './events';
import defaultFilters from './filters/index';
import Dep from './observer/depender';
import * as _ from './util';

const defineProperty = Object.defineProperty;
const noop = function() {};

class MVVM {
	constructor(options) {
		this.init(options);
	}
	init(options) {
		var self = this;
		this.$options = options;
		this.$data = options.data || {};
		this.$el = typeof options.el === 'string' ? document.querySelector(options.el) : options.el || document.body;
		this.methods = options.methods;
		this.filters = _.mixin(defaultFilters, options.filters || {});
		this.computed = options.computed || {};
		var init = options.init || [];

		init.forEach(function(hook) {
			hook.call(self);
		});
		new Observer(this.$data);
		this.copyData2Vm();
		this.initComputed();
		new Compiler({
			el: this.$el,
			vm: this
		});
	}
	copyData2Vm() {
		// 将data属性copy到vm下
		for (var prop in this.$data) {
			if (this.$data.hasOwnProperty(prop) && !this.hasOwnProperty(prop)) {
				this[prop] = this.$data[prop];
			}
		}
	}
	initComputed() {
		var self = this;
		for (var key in this.computed) {
			// if (key in self) {
			// 	console.log('property in computed will overwrite', key);
			// }
			var method = this.computed[key];
			// this.$data[key] = this.defineComputeGetter(method);
			defineProperty(this.$data, key, {
				get: self.defineComputeGetter(method),
				set: noop
			});
		}
	}
	defineComputeGetter(method) {
		var self = this;
		var watcher = new Watcher({
			vm: self,
			exp: method,
			callback: function() {}
		});
		return function() {
			if (Dep.target) {
				watcher.update();
			}
			return watcher.value;
		}
	}
	$watch(paramName, callback) {
		var self = this;
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
		// 切换上下文
		var self = descriptor.context || this;
		(this._directives || (this._directives = [])).push(new Directive(descriptor, self, node));
	}
}


// custom directive
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

	// 自定义directive，重写方法，传递参数
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

// custom component
MVVM.component = function(name, options) {
	if (!this._globalCom) {
		this._globalCom = {};
	}
	this._globalCom[name] = options;
	options.name = name;
};

eventMixin(MVVM);

export {
	MVVM
};