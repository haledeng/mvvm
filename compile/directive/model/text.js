'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = {
	bind: function bind() {
		this.listener = function () {
			var self = this;
			var key = this.$el.getAttribute('v-' + this.name);
			this.$el.addEventListener('input', function () {
				self.set(key, this.value);
			}, false);
		};
		var tagName = this.$el.tagName.toLowerCase();
		this._attr = tagName === 'input' ? 'value' : 'textContent';
		this.listener.call(this);
	},
	update: function update(value) {
		this.$el[this._attr] = value;
	}
};