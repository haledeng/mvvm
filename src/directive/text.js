import {
	calculateExpression,
	parseExpression
} from './expression';

// v-text
const vText = (node, vm, key) => {
	node.innerHTML = parseExpression(vm, key);
	// 影响后面attribute遍历
	// node.removeAttribute('v-text');
};

export default vText;