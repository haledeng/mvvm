'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = {
	bind: function bind() {
		this.__attr__ = 'checked';
		this.listener = function () {
			var self = this;
			var key = this.$el.getAttribute('v-' + this.name);
			this.$el.addEventListener('click', function () {
				self.set(key, this.value);
			}, false);
		};
		this.listener.call(this);
	},
	update: function update(value) {
		if (value == this.$el.value) {
			this.$el.setAttribute(this.__attr__, 'checked');
		} else {
			this.$el.removeAttribute(this.__attr__);
		}
	}
};