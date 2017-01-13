'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.applyAttributes = exports.replaceChild = exports.replaceContent = exports.removeChild = exports.insertChild = undefined;

var _attribute = require('./attribute');

var applyAttr = _interopRequireWildcard(_attribute);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function insertChild(node, apply) {
	if (!apply.left && apply.right) {
		node.appendChild(apply.right);
	}
}

// 替换节点
/**
 * dom增、删、改
 */
function replaceChild(node, apply) {
	var parent = node.parentNode;
	var newNode = apply.right.cloneNode(true);
	parent.replaceChild(newNode, node);
}

// 删除节点
function removeChild(node, apply) {
	apply.left.parentNode.removeChild(apply.left);
}

// textNode节点，替换内容
function replaceContent(node, apply) {
	if (apply && typeof apply.right === 'string') {
		node.innerHTML = apply.right;
	}
}

function applyAttributes(node, apply) {
	applyAttr.applyAttributes(node, apply.right);
}

exports.insertChild = insertChild;
exports.removeChild = removeChild;
exports.replaceContent = replaceContent;
exports.replaceChild = replaceChild;
exports.applyAttributes = applyAttributes;