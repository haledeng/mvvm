export default {
	bind: function() {
		this.listener = function() {
			var self = this;
			var key = this.$el.getAttribute('v-' + this.name);
			this.$el.addEventListener('input', function() {
				self.set(key, this.value);
			}, false);
		};
		var tagName = this.$el.tagName.toLowerCase();
		this.__attr__ = tagName === 'input' ? 'value' : 'textContent';
		this.listener.call(this);
	},
	update: function(value) {
		this.$el[this.__attr__] = value;
	}
}