import checkbox from './model/checkbox';
import text from './model/text';
import select from './model/select'
import radio from './model/radio';

var handlers = {
	checkbox,
	text,
	select,
	radio
};

export default {
	bind: function() {
		var $el = this.$el;
		var tagName = $el.tagName.toLowerCase();
		var handler = null;
		if (tagName === 'input') {
			handler = handlers[$el.type] || handlers['text'];
		} else if (tagName === 'textarea') {
			handler = handlers['text'];
		} else if (tagName === 'select') {
			handler = handlers[tagName];
		}
		handler.bind.call(this);
		this.update = handler.update;
	}
}