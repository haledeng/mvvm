import {
	calculateExpression,
	parseForExpression
} from './expression';
import * as _ from '../util';


function vIf(node, vm, exp) {
	var value = calculateExpression(vm.$data, exp);
	var parent = node.parentNode || node.__parent__;
	if (value) {
		if (node.__parent__) {
			var newNode = node.cloneNode(true);
			newNode.removeAttribute('v-if');
			parent.appendChild(newNode);
			parent.replaceChild(newNode, node.__anchor__);
		}
	} else {
		// 这里应该是用something来占位，下次value变化是，直接替换
		// vue中使用注释来占位的,或者创建空的textNode，证实上面的猜想
		// node.__anchor__ = document.createComment('v-if');
		node.__anchor__ = document.createTextNode('');
		parent.replaceChild(node.__anchor__, node);
		node.__parent__ = parent;
	}
}

export default vIf;