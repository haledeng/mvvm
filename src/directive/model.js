// const vModel = (node, vm, value) => {
// 	var tagName = node.tagName.toLowerCase();
// 	if (tagName === 'input') {
// 		node.value = value;
// 	} else if (tagName === 'textarea') {
// 		node.textContent = value;
// 	}
// 	node.removeAttribute('v-model');
// }


// export default vModel;
// 
export default {
	bind: function() {
		var tagName = this.$el.tagName.toLowerCase();
		this._attr = tagName === 'input' ? 'value' : 'textContent';
		this.descriptor.addListener.call(this);
	},
	addListener: function() {
		var self = this;
		var key = this.$el.getAttribute('v-' + this.name);
		this.$el.addEventListener('input', function() {
			self.set(key, this.value);
		}, false);
	},
	update: function(value) {
		this.$el[this._attr] = value;
	},
}