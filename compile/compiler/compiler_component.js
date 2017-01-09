'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

exports.default = function (Compiler) {
	function copyNode() {}

	Compiler.prototype._parseComponent = function (node) {
		var allCom = this.$vm.constructor._globalCom;
		var descriptor = allCom[node.tagName.toLowerCase()];
		var template = descriptor.template;
		var data = descriptor.data;
		var frag = document.createDocumentFragment();
		var div = document.createElement('div');
		div.innerHTML = template;
		[].slice.call(div.children).forEach(function (child) {
			frag.appendChild(child);
		});
		new Compiler({
			el: frag,
			vm: {
				$data: data
			}
		});
		node.parentNode.replaceChild(frag, node);
	};
};