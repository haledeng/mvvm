export default {
	bind: function() {
		var next = this.$el.nextElementSibling;
		if (next && next.getAttribute('v-else') !== null) {
			this.elseEl = next;
		}
	},
	toggle: function(elem, value) {
		elem.style.display = value ? '' : 'none';
	},
	update: function(value) {
		var toggle = this.toggle;
		toggle.call(this, this.$el, value);
		if (this.elseEl) {
			toggle.call(this, this.elseEl, !value);
		}
	}
}