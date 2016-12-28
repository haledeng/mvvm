import {
	parseExpression
} from './expression';

// v-text
const vHtml = (node, vm, key) => {
	var value = parseExpression(vm, key);
	node.innerHTML = value;
	// 影响后面attribute遍历
	// node.removeAttribute('v-text');
};

export default vHtml;