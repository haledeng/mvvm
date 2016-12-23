import {
	calculateExpression
} from './expression';

import {
	filter,
	parseFilter
} from '../filter';
// v-text
const vText = (node, scope, key) => {
	// var scope = vm.$data;
	// var rets = parseFilter(key);
	// if (rets) {
	// 	var value = calculateExpression(scope, rets.param);
	// 	node.innerHTML = filter.apply(null, [vm, rets.method, value].concat(rets.args));
	// 	return;
	// }
	node.innerHTML = calculateExpression(scope, key);
	// 影响后面attribute遍历
	// node.removeAttribute('v-text');
};

export default vText;