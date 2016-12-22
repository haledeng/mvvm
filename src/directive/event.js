// event hander
// 事件多次绑定
function vOn(node, methods, value, eventName) {
	if (typeof value !== 'string') return;
	var method = methods[value] || function() {};
	var self = this;
	node.addEventListener(eventName, function() {
		method.call(self);
	}, false);
}

export default vOn;