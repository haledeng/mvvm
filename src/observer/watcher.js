var uid = 0;
import Dep from './depender';
import * as _ from '../util';
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
		var hasToUpdate = true;

		var newVal = this.get();
		var oldVal = this.value;
		this.value = newVal;
		var valType = _.getType(newVal);
		// 是否需要触发更新回调
		if (valType === 'object') {
			if (_.isObjectEqual(newVal, oldVal)) {
				hasToUpdate = false;
			}
		} else if (valType === 'array') {
			if (_.isArrayEqual(newVal, oldVal)) {
				hasToUpdate = false;
			}
		} else {
			hasToUpdate = oldVal != newVal;
		}
		hasToUpdate && this.callback(this.vm, newVal, oldVal);
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