/**
 * entry
 */

import Compiler from './compiler';
import Observer from './observer';
class MVVM {
	constructor(options) {
		this.$data = options.data || {};
		this.$el = typeof options.el === 'string' ? document.querySelector(options.el) : options.el || document.body;
		this.methods = options.methods;
		new Observer(this.$data);
		new Compiler({
			el: this.$el,
			vm: this
		});
	}
}

export {
	MVVM
};