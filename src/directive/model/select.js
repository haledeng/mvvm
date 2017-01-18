export default {
	bind: function() {
		var node = this.$el;
		var self = this;
		var key = this.$el.getAttribute('v-' + this.name);
		this.listener = function() {
			node.addEventListener('change', function() {
				self.set(key, this.value);
			});
		};
		this.listener();
	},
	update: function(value) {
		var node = this.$el;
		node.value = value;
	}
}