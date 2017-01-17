'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _checkbox = require('./model/checkbox');

var _checkbox2 = _interopRequireDefault(_checkbox);

var _input = require('./model/input');

var _input2 = _interopRequireDefault(_input);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
var handlers = {
	checkbox: _checkbox2.default,
	input: _input2.default
};

exports.default = {
	bind: function bind() {
		var tagName = this.$el.tagName.toLowerCase();
		var handler = null;
		if (tagName === 'input') {
			handler = handlers[this.$el.type] || handlers['input'];
		} else if (tagName === 'textarea') {
			handler = handlers['input'];
		}
		handler.bind.call(this);
		this.update = handler.update;
	}
};