/**
 * 根据序号，查找dom数，深度优先遍历
 */
export default function(node, index) {
	var count = 0;
	var lastChild = null;
	var _find = function(node, index) {
		if (index == count) return node;
		for (var i = 0; i < node.children.length; i++) {
			lastChild = node.children[i];
			count++;
			if (index == count) return lastChild;
			if (lastChild.children.length) {
				lastChild = _find(lastChild, index);
				if (lastChild) return lastChild;
			}
		}
		return null;
	};
	var findNode = _find(node, index);
	if (!findNode && index >= count) {
		return lastChild;
	} else {
		return findNode;
	}
};