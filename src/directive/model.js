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
import text from './model/text';
import select from './model/select'

var handlers = {
	checkbox,
	text,
	select
};

export default {
	bind: function() {
		var tagName = this.$el.tagName.toLowerCase();
		var handler = null;
		if (tagName === 'input') {
			handler = handlers[this.$el.type] || handlers['text'];
		} else if (tagName === 'textarea') {
			handler = handlers['text'];
		} else if (tagName === 'select') {
			handler = handlers[tagName];
		}
		handler.bind.call(this);
		this.update = handler.update;
	}
}