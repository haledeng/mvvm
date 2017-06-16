// parse bind expression
import * as _ from '../util';
import {
	calculateExpression
} from '../parser/expression';

/**
 * [parseBind description]
 * @param  {Object} vm   instance
 * @param  {String} attr expression
 * @return {Object}      value of the expression
 */
export default function parseBind(data, attr) {
	attr = _.trim(attr);
	var value = {};
	if (/^\{(.*)\}$/.test(attr)) {
		// 计算表达式
		attr.replace(/([^\{\,\:]*):([^\,\:\}]*)/g, function(all, key, val) {
			value[_.trim(key)] = calculateExpression(data, _.trim(val));
			return all;
		});
	} else if (/\w*/.test(attr)) {
		// computed已经被计算
		// value = data[attr];
		// a.b.c
		value = _.getVal(data, attr);
	}
	return value;
}