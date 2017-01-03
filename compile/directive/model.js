'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
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
exports.default = {
	bind: function bind() {
		var tagName = this.$el.tagName.toLowerCase();
		this._attr = tagName === 'input' ? 'value' : 'textContent';
		this.descriptor.addListener.call(this);
	},
	addListener: function addListener() {
		var self = this;
		var key = this.$el.getAttribute('v-' + this.name);
		this.$el.addEventListener('input', function () {
			self.set(key, this.value);
		}, false);
	},
	update: function update(value) {
		this.$el[this._attr] = value;
	}
};