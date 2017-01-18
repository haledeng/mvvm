'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = {
	bind: function bind() {
		var node = this.$el;
		var self = this;
		var key = this.$el.getAttribute('v-' + this.name);
		this.listener = function () {
			node.addEventListener('change', function () {
				self.set(key, this.value);
			});
		};
		this.listener();
	},
	update: function update(value) {
		var node = this.$el;
		node.value = value;
	}
};