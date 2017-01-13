"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

exports.default = function (node) {
	return node.children.length === 0 && node.childNodes.length !== 0;
};

;