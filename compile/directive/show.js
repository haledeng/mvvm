'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = {
	bind: function bind() {
		var next = this.$el.nextElementSibling;
		if (next && next.getAttribute('v-else') !== null) {
			this.elseEl = next;
		}
	},
	toggle: function toggle(elem, value) {
		elem.style.display = value ? '' : 'none';
	},
	update: function update(value) {
		var toggle = this.toggle;
		toggle.call(this, this.$el, value);
		if (this.elseEl) {
			toggle.call(this, this.elseEl, !value);
		}
	}
};