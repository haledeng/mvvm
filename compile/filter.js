"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
// filters 过滤器
function filter(vm, name, params) {
	var method = vm._filters[name];
	if (!method) return params;
	return method.apply(vm, [params].concat([].slice.call(arguments, 3)));
}

exports.filter = filter;