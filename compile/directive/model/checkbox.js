'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = {
	bind: function bind() {
		this.addListener = function () {
			var self = this;
			var key = this.$el.getAttribute('v-' + this.name);
			this.$el.addEventListener('change', function (e) {
				self.set(key, this.checked);
			}, false);
		};
		this.addListener.call(this);
	},
	update: function update(value) {
		var node = this.$el;
		node.checked = !!value;
	}
};