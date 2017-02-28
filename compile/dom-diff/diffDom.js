'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

exports.default = function (one, two) {
	var patch = {
		left: one
	};
	diffDom(one, two, patch, 0);
	return patch;
};

var _util = require('./util');

var _ = _interopRequireWildcard(_util);

var _vPatch = require('./vPatch');

var _vPatch2 = _interopRequireDefault(_vPatch);

var _diffProps = require('./diffProps');

var _diffProps2 = _interopRequireDefault(_diffProps);

var _isTextNode = require('./isTextNode');

var _isTextNode2 = _interopRequireDefault(_isTextNode);

var _attribute = require('./attribute');

var attr = _interopRequireWildcard(_attribute);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function appendPatch(apply, patch) {
	if (apply) {
		if (_.isArray(apply)) {
			apply.push(patch);
			return apply;
		} else {
			return [apply, patch];
		}
	} else {
		return patch;
	}
}

// textNode diff
function diffTextNode(one, two) {
	var isOneText = (0, _isTextNode2.default)(one);
	var isTwoText = (0, _isTextNode2.default)(two);
	if (isOneText) {
		if (isTwoText) {
			// both textNode
			var oneText = one.childNodes[0].data;
			var twoText = two.childNodes[0].data;
			if (_.trim(oneText) !== _.trim(twoText)) {
				return new _vPatch2.default(_vPatch2.default.TEXTNODE, one, twoText);
			}
			// } else {
			// return new VPatch(VPatch.REPLACE, one, two);
		}
	} else {
		if (isTwoText) {
			return new _vPatch2.default(_vPatch2.default.TEXTNODE, one, _.trim(two.childNodes[0].data));
		}
	}
}

// remove/replace 节点，需要将对应的prop操作删掉
function deleteChangeProp(apply) {
	if (!apply) return apply;
	if (_.isObject(apply)) {
		return apply.type === _vPatch2.default.PROPS ? null : apply;
	}
	if (_.isArray(apply)) {
		var newApply = [];
		apply.forEach(function (a) {
			if (a.type !== _vPatch2.default.PROPS) {
				newApply.push(a);
			}
		});
		if (newApply.length === 1) {
			return newApply[0];
		}
		return newApply;
	}
}

// 对比dom差异
function diffDom(one, two, patch, index) {
	var apply = patch[index];
	if (two) {
		if (one.tagName === two.tagName) {
			var oneAttr = attr.getAttr(one);
			var twoAttr = attr.getAttr(two);
			var props = (0, _diffProps2.default)(oneAttr, twoAttr);
			if (props) {
				apply = appendPatch(apply, new _vPatch2.default(_vPatch2.default.PROPS, one, props));
			}
			// innerText
			var textNode = diffTextNode(one, two);
			if (textNode) {
				apply = appendPatch(apply, textNode);
				if (textNode.type === _vPatch2.default.REPLACE) {
					apply = deleteChangeProp(apply);
				}
			}
			if (one.children.length || two.children.length) {
				apply = diffChildren(one, two, patch, apply, index);
			}
		} else {
			apply = appendPatch(apply, new _vPatch2.default(_vPatch2.default.REPLACE, one, two));
			apply = deleteChangeProp(apply);
		}
	} else {
		apply = appendPatch(apply, new _vPatch2.default(_vPatch2.default.REMOVE, one, two));
		apply = deleteChangeProp(apply);
	}
	if (apply) {
		patch[index] = apply;
	}
}

// 对比dom中childrend差异
function diffChildren(one, two, patch, apply, index) {
	var aLen = one.children.length;
	var bLen = two.children.length;
	var len = Math.max(aLen, bLen);
	for (var i = 0; i < len; i++) {
		index++;
		var leftNode = one.children[i];
		var rightNode = two.children[i];
		if (leftNode) {
			diffDom(leftNode, rightNode, patch, index);
			// index += leftNode.children.length;
			// 多层节点嵌套
			index += findDeep(leftNode);
		} else {
			if (rightNode) {
				apply = appendPatch(apply, new _vPatch2.default(_vPatch2.default.INSERT, null, rightNode));
			}
		}
	}
	return apply;
}

//  深度优先遍历
function findDeep(node) {
	var deep = 0;
	var children = node.children;
	deep += children.length;
	for (var i = 0; i < children.length; i++) {
		if (children[i].children.length) {
			deep += findDeep(children[i]);
		}
	}
	return deep;
}

;