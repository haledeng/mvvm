// v-html
const vHtml = (node, vm, value) => {
	node.innerHTML = value;
	// 影响后面attribute遍历
	node.removeAttribute('v-html');
};

export default {
	bind: function() {
		this.$el.removeAttribute('v-' + this.name);
	},
	update: function(value) {
		this.$el.innerHTML = value;
	},
}