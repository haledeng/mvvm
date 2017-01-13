var uid = 0;
import Dep from './depender';
import {
	parseExpression,
	calculateExpression
} from '../directive/expression';


class Watcher {
	constructor(opts) {
		this.id = ++uid;
		this.vm = opts.vm;
		this.$el = opts.$el;
		this.exp = opts.exp;
		this.directive = opts.directive || '';
		this.callback = opts.callback;
		this.value = this.init();
	}
	update() {
		var newVal = this.get();
		var oldVal = this.value;
		// @TODO: [], {}引用类型，指向了同一个值
		// if (oldVal != newVal) {
		this.value = newVal;
		this.callback(this.vm, newVal, oldVal);
		// }
	}
	beforeGet() {
		Dep.target = this;
	}
	afterGet() {
		Dep.target = null;
	}
	init() {
		this.beforeGet();
		var value = this.get();
		this.afterGet();
		return value;
	}
	get() {
		return parseExpression(this.vm, this.exp, this.directive, this.$el);
	}
}
export default Watcher;