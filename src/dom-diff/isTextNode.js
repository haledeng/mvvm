export default function(node) {
	return node.children.length === 0 && node.childNodes.length !== 0;
};