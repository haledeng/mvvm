export default {
	bind: function() {
		this.listener = function() {
			var self = this;
			var key = this.$el.getAttribute('v-' + this.name);
			this.$el.addEventListener('change', function(e) {
				self.set(key, this.checked);
			}, false);
		};
		this.listener.call(this);
	},
	update: function(value) {
		var node = this.$el;
		node.checked = !!value;
	},
	unbind: function() {}
}