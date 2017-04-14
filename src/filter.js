// filters 过滤器
function filter(vm, name, params) {
	var method = vm.filters[name];
	if (!method) return params;
	return method.apply(vm, [params].concat([].slice.call(arguments, 3)));
}

export {
	filter
};