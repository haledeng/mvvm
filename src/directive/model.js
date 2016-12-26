import {
	calculateExpression,
	parseExpression
} from './expression';

const vModel = (node, vm, exp) => {
	var tagName = node.tagName.toLowerCase();
	// var value = calculateExpression(scope, key);
	var value = parseExpression(vm, exp);
	if (tagName === 'input') {
		node.value = value;
	} else if (tagName === 'textarea') {
		node.innerHTML = value;
	}
	// node.removeAttribute('v-model');
}

export default vModel;