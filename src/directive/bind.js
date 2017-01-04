import * as _ from '../util';
import parseBind from '../parser/bind';

// 属性转化
function transformProperty(property) {
	if (property === 'class') {
		return 'className';
	}
	return property;
}

function addProperty(node, property, value) {
	property = transformProperty(property);
	if (property === 'className') {
		node[property] = [node[property], value].join(' ');
	} else {
		node.setAttribute(property, value);
	}
}

function removeProperty(node, property, value) {
	property = transformProperty(property);
	if (property === 'className') {
		node[property] = node[property].replace(new RegExp('\\b' + value + '\\b'), '')
	} else {
		node.removeAttribute(property);
	}
}

function vBind(node, vm, value, property) {
	for (var key in value) {
		if (value[key]) {
			addProperty(node, property, key);
		} else {
			removeProperty(node, property, key);
		}
	}
}

// export default vBind;

export default {
	bind: function() {

	},
	update: function(value) {
		vBind(this.$el, this.$vm, value, this.extraName);
	}
}