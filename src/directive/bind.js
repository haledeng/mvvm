import * as _ from '../util';

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
		node[property] = node[property].replace(new RegExp('\\\b' + value + '\\\b'), '')
	} else {
		node.removeAttribute(property);
	}
}

export default function vBind(node, vm, attr, property) {
	attr = _.trim(attr);
	var data = vm.$data;
	var computed = vm.computed;
	var value = {};
	if (/^\{(.*)\}$/.test(attr)) {
		// 计算表达式
		attr.replace(/([^\{\,\:]*):([^\,\:\}]*)/g, function(all, key, val) {
			value[_.trim(key)] = data[_.trim(val)];
			return all;
		});
	} else if (/\w*/.test(attr)) {
		// computed or data.property
		if (data[attr] !== undefined) {
			value = data[attr];
		} else if (typeof computed[attr] === 'function') {
			value = computed[attr].apply(data);
		}
	}
	for (var key in value) {
		if (value[key]) {
			addProperty(node, property, key);
		} else {
			removeProperty(node, property, key);
		}
	}
}