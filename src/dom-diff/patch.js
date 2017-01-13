import VPatch from './vPatch';
import * as _ from './util';
import findIndexNode from './traversal';
import * as curd from './curd';


var findPatchNode = function(node, patch) {
	var children = {};
	for (var index in patch) {
		if (index !== 'left') {
			var child = findIndexNode(node, index);
			children[index] = child;
		}
	}
	return children;
}

// 每个type对应的操作函数
var typeOpMaps = {};
typeOpMaps[VPatch.REMOVE] = curd.removeChild;
typeOpMaps[VPatch.INSERT] = curd.insertChild;
typeOpMaps[VPatch.REPLACE] = curd.replaceChild;
typeOpMaps[VPatch.PROPS] = curd.applyAttributes;
typeOpMaps[VPatch.TEXTNODE] = curd.replaceContent;


// 增量渲染
// 边查找边操作有bug
var patchDom = function(node, patch, index) {
	// 先把dom和index关系查找完毕，在进行dom操作
	var domIndex = findPatchNode(node, patch);
	for (var index in patch) {
		if (index !== 'left') {
			var child = domIndex[index];
			var applies = patch[index];
			if (!_.isArray(applies)) {
				applies = [applies];
			}
			applies.forEach(function(apply) {
				if (_.isFunction(typeOpMaps[apply.type])) {
					typeOpMaps[apply.type](child, apply);
				}
			});
		}
	}
};

export default function(patch) {
	var node = patch.left;
	patchDom(node, patch, 0);
};