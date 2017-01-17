export default {
	bind: function() {
		this.addListener = function() {
			var self = this;
			var key = this.$el.getAttribute('v-' + this.name);
			this.$el.addEventListener('input', function() {
				self.set(key, this.value);
			}, false);
			// this.$el.addEventListener('change', function() {
			// 	self.set(key, this.value);
			// }, false);
		};
		var tagName = this.$el.tagName.toLowerCase();
		this._attr = tagName === 'input' ? 'value' : 'textContent';
		this.addListener.call(this);
	},
	update: function(value) {
		this.$el[this._attr] = value;
	}
}