import * as _ from './util';

function VNode(opts) {
	var len = arguments.length;
	if (len > 1) {
		opts = {};
		if (len >= 3) {
			opts.tagName = arguments[0];
			opts.attr = arguments[1];
			opts.children = _.isArray(arguments[2]) ? arguments[2] : [arguments[2]];
		} else {
			opts.tagName = arguments[0];
			opts.children = _.isArray(arguments[1]) ? arguments[1] : [arguments[1]];
		}
	}
	this.tagName = opts.tagName;
	this.attr = opts.attr || {};
	this.children = opts.children || [];
}

/*
 * parse dom to Element structure.
 */
VNode._parseDom2Element = function(dom) {
	var self = this;
	var attrs = {};
	var _attrs = dom.attributes;
	var item = null;
	for (var i = 0; i < _attrs.length; i++) {
		item = _attrs[i];
		attrs[item.name] = item.value;
	}

	var children = [];
	var _children = dom.childNodes;
	_children = [].slice.call(_children);
	_children.forEach(function(_child, index) {
		if (_child.nodeType === 1) {
			children.push(self._parseDom2Element(_child));
		} else if (_child.nodeType === 3 && _.trim(_child.data).length) {
			// text node
			children.push(_child.data);
		}
	});
	return new VNode({
		tagName: dom.tagName.toLowerCase(),
		attr: attrs,
		children: children
	})
};

/**
 * parse dom to Element Object
 */
VNode.parse = function(selector) {
	var dom = null;
	if (typeof selector === 'string') {
		dom = document.querySelector(selector);
	} else if (typeof selector === 'object') {
		dom = selector;
	} else {
		console.log('`VNode.parse` function receive a selector string or dom object');
		return;
	}
	return this._parseDom2Element(dom);
}

/**
 * render Element to HTML string
 */
VNode.prototype.render = function() {
	var dom = document.createElement(this.tagName);
	for (var prop in this.attr) {
		dom.setAttribute(prop, this.attr[prop]);
	}
	this.children.forEach(function(child) {
		var childEl = (child instanceof VNode) ? child.render() : document.createTextNode(child);
		dom.appendChild(childEl);
	});
	return dom;
};

export default VNode;