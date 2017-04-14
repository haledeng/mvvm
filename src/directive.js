/**
 * 抽象所有directive的行为
 * 1. directive的lifecycle： bind, update, unbind
 */


import Watcher from './observer/watcher';
import * as _ from './util';


class Directive {
	constructor(descriptor, vm, node) {
		this.descriptor = descriptor;
		_.mixin(this, this.descriptor);
		this.bind = descriptor.bind || _.noop;
		this.update = descriptor.update || _.noop;
		this.watchExp = descriptor.watchExp || descriptor.expression;
		this.$el = node;
		this.$vm = vm;
		// bind, on等后面跟的事件名或属性名
		this.extraName = descriptor.extraName || descriptor.name;
		this._bind();
	}
	_bind() {
		var self = this;
		if (this.bind) {
			this.bind();
		}
		// 事件不需要update
		if (this.name === 'on') return;
		if ('function' === typeof this.update) {
			this._watcher = new Watcher({
				vm: this.$vm,
				$el: this.$el,
				exp: this.watchExp,
				directive: this.name,
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