// parse bind expression
import * as _ from '../util';
import calculateExpression from './expression';

/**
 * [parseBind description]
 * @param  {Object} vm   instance
 * @param  {String} attr expression
 * @return {Object}      value of the expression
 */
export default function parseBind(vm, attr) {
	attr = _.trim(attr);
	var data = vm.$data;
	var computed = vm.computed;
	var value = {};
	if (/^\{(.*)\}$/.test(attr)) {
		// 计算表达式
		attr.replace(/([^\{\,\:]*):([^\,\:\}]*)/g, function(all, key, val) {
			// value[_.trim(key)] = data[_.trim(val)];
			value[_.trim(key)] = calculateExpression(data, _.trim(val));
			return all;
		});
	} else if (/\w*/.test(attr)) {
		// computed or data.property
		if (typeof data[attr] === 'object') {
			value = data[attr];
		} else if (typeof computed[attr] === 'function') {
			value = computed[attr].apply(data);
		}
	}
	return value;
}