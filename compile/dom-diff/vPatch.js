"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
function VPatch(type, node, right) {
	this.type = type;
	this.left = node;
	this.right = right;
}

// 删除节点
VPatch.REMOVE = 0;
// 插入节点
VPatch.INSERT = 1;
VPatch.REPLACE = 2;
VPatch.PROPS = 3;
VPatch.TEXTNODE = 4;

exports.default = VPatch;