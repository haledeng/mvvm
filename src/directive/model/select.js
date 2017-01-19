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

		var options = node.getElementsByTagName('option');
		this.__values__ = [];
		for (var i = 0; i < options.length; i++) {
			this.__values__.push(options[i].value);
		}
	},
	update: function(value) {
		if (~this.__values__.indexOf(value)) {
			this.$el.value = value;
		}
		// this.$el.value = value;
	}
}