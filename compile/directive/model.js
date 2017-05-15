'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _checkbox = require('./model/checkbox');

var _checkbox2 = _interopRequireDefault(_checkbox);

var _text = require('./model/text');

var _text2 = _interopRequireDefault(_text);

var _select = require('./model/select');

var _select2 = _interopRequireDefault(_select);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var handlers = {
	checkbox: _checkbox2.default,
	text: _text2.default,
	select: _select2.default
};

exports.default = {
	bind: function bind() {
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
};