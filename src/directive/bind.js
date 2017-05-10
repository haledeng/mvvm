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
		node[property] = _.trim([node[property], value].join(' '));
	} else {
		node.setAttribute(property, value);
	}
}

function removeProperty(node, property, value) {
	property = transformProperty(property);
	if (property === 'className') {
		node[property] = node[property].replace(new RegExp('\\b' + value + '\\b'), '');
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
	// issue
	// 删除会导致后面的属性遍历有问题
	// 在遍历数组同时，在删除数组元素
	// node.removeAttribute('v-bind:' + property);
}

// export default vBind;

export default {
	bind: function() {},
	update: function(value) {
		vBind(this.$el, this.$vm, value, this.extraName);
	}
}