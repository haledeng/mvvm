// filters 过滤器
function filter(vm, name, params) {
	var method = vm.filters[name];
	return method.apply(vm.$data, [params].concat([].slice.call(arguments, 3)));
}

export {
	filter
};