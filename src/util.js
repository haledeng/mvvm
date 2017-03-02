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

const getType = (obj) => {
	return toString.call(obj).replace(/^\[object\s|\]$/g, '').toLowerCase();
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

const addScope = (exp, prefix = 'scope') => {
	exp = trim(exp);
	// x.y => scope.x.y
	// x.y.z = > scope.x.y.z
	// Math.random()  全局函数调用
	var globalObject = ['Math', 'window', 'Date', 'navigator', 'document'];
	exp = exp.replace(/[\w\[\]]+(?=\.)/g, function(match, index, all) {
		if (~globalObject.indexOf(match) || /^\d*$/.test(match)) return match;
		if (all.indexOf('.' + match) === -1) {
			return [prefix, match].join('.');
		}
		return match;
	});
	exp = ' ' + exp + ' ';
	// x
	exp = exp.replace(/[\+\-\*\/\s\>\<\=\(]\w+(?![\'\.])[\+\-\*\/\s\>\<\=\)]/g, function(match, index, all) {
		match = trim(match);
		if (/^\d*$/.test(match)) {
			return match;
		}
		match = match.replace(/([\+\-\*\/\s\>\<\=\(]?)(\w+)([\+\-\*\/\s\>\<\=\)]?)/, function(all, before, cur, after) {
			return before + [prefix, cur].join('.') + after;
		});
		return match;
		// return [prefix, match].join('.');
	});
	return trim(exp);
}



const isArrayEqual = (a, b) => {
	if (isType(a, 'array') && isType(b, 'array')) {
		if (a.length !== b.length) return false;
		for (var i = 0; i < a.length; i++) {
			if (a[i] != b[i]) return false;
		}
		return true;
	}
	return false;
}


const isObjectEqual = (a, b) => {
	if (isType(a, 'object') && isType(b, 'object')) {
		var aKeys = Object.keys[a];
		if (aKeys.length !== Object.keys(b).length) return false;
		for (var i = 0; i < aKeys.length; i++) {
			// ===?
			if (a[aKeys[i]] != b[aKeys[i]]) return false;
		}
		return true;
	}
	return false;
}

const kebabCase = (str) => {
	if (typeof str !== 'string') return '';
	return str.replace(/[A-Z]/, function(all) {
		return '-' + all.toLowerCase();
	});
}

export {
	trim,
	isType,
	mixin,
	upperFirst,
	containOnlyTextNode,
	addScope,
	kebabCase,
	getType,
	isObjectEqual,
	isArrayEqual
}