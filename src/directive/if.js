import * as _ from '../util';
import diffDom from '../dom-diff/diffDom';
import patch from '../dom-diff/patch';

function vIf(node, vm, value) {
	if (value) {
		// 这种2次操作的方式，实际和未dom-diff差别不大
		if (this.$el.__anchor__) {
			if (this.$el._component) {
				patch(diffDom(this.$el.__anchor__, this.$el._component.frag.firstElementChild));
			} else {
				patch(diffDom(this.$el.__anchor__, this.$el));
			}
		}
		if (this.elseEl) {
			this.elseEl.__anchor__ = document.createTextNode('');
			patch(diffDom(this.elseEl, this.elseEl.__anchor__));
		}
	} else {
		this.$el.__anchor__ = document.createTextNode('');
		if (this.$el._component) {
			patch(diffDom(this.$el._component.frag.firstElementChild, this.$el.__anchor__));
		} else {
			patch(diffDom(this.$el, this.$el.__anchor__));
		}
		if (this.elseEl) {
			patch(diffDom(this.elseEl.__anchor__, this.elseEl));
		}
	}
}


function removeNode(node) {
	node.__anchor__ = document.createTextNode('');
	return diffDom(node, node.__anchor__);
}

export default {
	bind: function() {
		// 是否有v-else元素
		var nextSibling = this.$el.nextElementSibling;
		if (nextSibling && nextSibling.getAttribute('v-else') !== null) {
			this.elseEl = nextSibling;
		}
	},
	update: function(value) {
		vIf.call(this, this.$el, this.$vm, value);
	}
}