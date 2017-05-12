import * as _ from '../util';
import parseBind from '../parser/bind';

function addProperty(node, property, value) {
	if (property === 'class') {
		node.className = _.trim([node[property], value].join(' '));
	} else if (property === 'value') {
		node.value = value;
	} else {
		node.setAttribute(property, value);
	}
}

function removeProperty(node, property, value) {
	if (property === 'class') {
		node.className = node.className.replace(new RegExp('\\b' + value + '\\b'), '');
	} else {
		node.removeAttribute(property);
	}
}

function vBind(node, vm, value, property) {
	if (_.isType(value, 'object')) {
		for (var key in value) {
			if (value[key]) {
				addProperty(node, property, key);
			} else {
				removeProperty(node, property, key);
			}
		}
	} else {
		addProperty(node, property, value);
	}
}


export default {
	bind: function() {},
	update: function(value) {
		vBind(this.$el, this.$vm, value, this.extraName);
	}
}