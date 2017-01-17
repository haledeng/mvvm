export default {
	bind: function() {
		this.addListener = function() {
			var self = this;
			var key = this.$el.getAttribute('v-' + this.name);
			this.$el.addEventListener('change', function(e) {
				self.set(key, this.checked);
			}, false);
		};
		this.addListener.call(this);
	},
	update: function(value) {
		var node = this.$el;
		node.checked = !!value;
	},
}