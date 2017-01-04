const trim = (str) => {
	if (typeof str !== 'string') {
		return Object.prototype.toString.call(str);
	}
	return str.replace(/^\s*|\s*$/g, '');
};

var toString = Object.prototype.toString;

const isType = (obj, type) => {
	return toString.call(obj) === '[object ' + type.replace(/^[a-z]/, type.charAt(0).toUpperCase()) + ']';
}

const mixin = (dest, source, rewrite = false) => {
	for (var prop in source) {
		if (source.hasOwnProperty(prop)) {
			if (!rewrite || !dest.hasOwnProperty(prop)) {
				dest[prop] = source[prop];
			}
		}
	}
	return dest;
}

const containOnlyTextNode = (node) => {
	return !node.children.length && node.childNodes.length;
}

const upperFirst = (str) => {
	return str.charAt(0).toUpperCase() + str.substring(1);
}

export {
	trim,
	isType,
	mixin,
	upperFirst,
	containOnlyTextNode
}