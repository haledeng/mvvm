import {
	calculateExpression,
	parseExpression
} from './expression';

// v-text
const vText = (node, vm, key) => {
	var value = parseExpression(vm, key);
	node.textContent = value;
	// 影响后面attribute遍历
	node.removeAttribute('v-text');
};

export default vText;