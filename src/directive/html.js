// v-html
const vHtml = (node, vm, value) => {
	node.innerHTML = value;
	// 影响后面attribute遍历
	node.removeAttribute('v-html');
};

export default vHtml;