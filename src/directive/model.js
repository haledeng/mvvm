// const vModel = (node, vm, value) => {
// 	var tagName = node.tagName.toLowerCase();
// 	if (tagName === 'input') {
// 		node.value = value;
// 	} else if (tagName === 'textarea') {
// 		node.textContent = value;
// 	}
// 	node.removeAttribute('v-model');
// }


// export default vModel;
// 
import checkbox from './model/checkbox';
import input from './model/input';

var handlers = {
	checkbox,
	input
};

export default {
	bind: function() {
		var tagName = this.$el.tagName.toLowerCase();
		var handler = null
		if (tagName === 'input') {
			handler = handlers[this.$el.type] || handlers['input'];
		} else if (tagName === 'textarea') {
			handler = handlers['input'];
		}
		handler.bind.call(this);
		this.update = handler.update;
	}
}