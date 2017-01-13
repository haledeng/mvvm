'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

exports.default = function (patch) {
	var node = patch.left;
	patchDom(node, patch, 0);
};

var _vPatch = require('./vPatch');

var _vPatch2 = _interopRequireDefault(_vPatch);

var _util = require('./util');

var _ = _interopRequireWildcard(_util);

var _traversal = require('./traversal');

var _traversal2 = _interopRequireDefault(_traversal);

var _curd = require('./curd');

var curd = _interopRequireWildcard(_curd);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var findPatchNode = function findPatchNode(node, patch) {
	var children = {};
	for (var index in patch) {
		if (index !== 'left') {
			var child = (0, _traversal2.default)(node, index);
			children[index] = child;
		}
	}
	return children;
};

// 每个type对应的操作函数
var typeOpMaps = {};
typeOpMaps[_vPatch2.default.REMOVE] = curd.removeChild;
typeOpMaps[_vPatch2.default.INSERT] = curd.insertChild;
typeOpMaps[_vPatch2.default.REPLACE] = curd.replaceChild;
typeOpMaps[_vPatch2.default.PROPS] = curd.applyAttributes;
typeOpMaps[_vPatch2.default.TEXTNODE] = curd.replaceContent;

// 增量渲染
// 边查找边操作有bug
var patchDom = function patchDom(node, patch, index) {
	// 先把dom和index关系查找完毕，在进行dom操作
	var domIndex = findPatchNode(node, patch);
	for (var index in patch) {
		if (index !== 'left') {
			var child = domIndex[index];
			var applies = patch[index];
			if (!_.isArray(applies)) {
				applies = [applies];
			}
			applies.forEach(function (apply) {
				if (_.isFunction(typeOpMaps[apply.type])) {
					typeOpMaps[apply.type](child, apply);
				}
			});
		}
	}
};

;