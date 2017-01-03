// custom directive

import Watcher from './watcher';
export default function(MVVM) {
	/**
	 * define custom directive
	 * @param  {string} name  directive name
	 * @param  {object} hooks directive hooks
	 * @return {[type]}       [description]
	 */
	/**
	 * hooks functions may be following:
	 * http://vuejs.org/v2/guide/custom-directive.html
	 */
	MVVM.directive = function(name, hooks) {
		if (typeof name !== 'string') return;
		if (!this._directives) {
			this._directives = {};
		}
		if (!this._directives[name]) {
			this._directives[name] = hooks;
		}
	}
}

function noop() {};

class directive {
	constructor(descriptor, vm, node) {
		this.bind = descriptor.bind || noop;
		this.update = descriptor.update || noop;
		this.expression = descriptor.expression;
	}
	_bind() {
		if (this.bind) {
			this.bind();
		}
		if (this.update) {
			this._watcher = new Watcher({
				vm: vm,
				exp: this.expression,
				callback: this.update
			});
		}
	}
}