const vText = (node, vm, value) => {
	node.textContent = value;
	// 影响后面attribute遍历
	node.removeAttribute('v-text');
};

export default vText;