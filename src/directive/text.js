const vText = (node, vm, value) => {
	node.textContent = value;
	// 影响后面attribute遍历
	node.removeAttribute('v-text');
};


export default {
	// init
	bind: function() {
		this._attr = 'textContent';
	},
	update: function(value) {
		this.$el[this._attr] = value;
	}
}

// export default vText;