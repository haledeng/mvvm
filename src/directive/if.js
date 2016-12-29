import {
	calculateExpression,
	parseForExpression
} from './expression';
import * as _ from '../util';


// function vIf(node, vm, exp) {
function vIf(node, vm, value) {
	var parent = node.parentNode || node.__parent__;
	// difference between nextSibling and nextElementSibling
	// get from node.childNode and node.children 
	var nextSibling = node.__nextSibling__ || node.nextElementSibling;
	// 是否有v-else元素
	var hasElseNext = node.__hasElse__;
	if (hasElseNext === undefined) {
		hasElseNext = node.__hasElse__ = nextSibling && nextSibling.getAttribute('v-else') !== null
	}
	if (value) {
		if (node.__parent__) {
			// record the new node in document
			node.__new__ = insert(node.__new__ || node, parent);
		} else {
			// first time
			// clone新节点，删除v-if
			node.__new__ = replace(node, parent);
			node.__parent__ = parent;
		}
		if (hasElseNext) {
			node.__nextSibling__ = nextSibling;
			remove(nextSibling, parent);
		}
	} else {
		remove(node.__new__ || node, parent);
		if (hasElseNext) {
			node.__nextSibling__ = insert(nextSibling, parent);;
		}
	}
}


function replace(node, parent) {
	var newNode = node.cloneNode(true);
	newNode.removeAttribute('v-if');
	parent.replaceChild(newNode, node);
	return newNode;
}

function insert(node, parent) {
	var newNode = node.cloneNode(true);
	newNode.removeAttribute('v-if');
	newNode.removeAttribute('v-else');
	parent.replaceChild(newNode, node.__anchor__);
	return newNode;
}

function remove(node, parent) {
	// 这里应该是用something来占位，下次value变化是，直接替换
	// vue中使用注释来占位的,或者创建空的textNode，证实上面的猜想
	// node.__anchor__ = document.createComment('v-if');
	node.__anchor__ = document.createTextNode('');
	parent.replaceChild(node.__anchor__, node);
	node.__parent__ = parent;
}
export default vIf;