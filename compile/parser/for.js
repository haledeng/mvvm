'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _util = require('../util');

var _ = _interopRequireWildcard(_util);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

// v-for expression
/**
 * v-for expression parser
 * @param  {string} expression 
 * @return {object}      
 * {
 *     val: 遍历的变量名
 *     scope: 遍历item临时变量
 *     index: 遍历索引
 * }
 */
function parseForExpression(expression) {
    // variable name
    var valReg = /in\s*([^\s]*)\s*?$/;
    var ret = {};
    if (valReg.test(expression)) {
        ret.val = RegExp.$1;
    }
    // template variable name
    // like: xxx in obj
    // like: (item, index) in arr
    // like: (item, value, index) in arr
    var tempReg = /^\s?(.*)\s*in/;
    if (tempReg.test(expression)) {
        var itemStr = _.trim(RegExp.$1);
        if (~itemStr.indexOf(',')) {
            itemStr = itemStr.replace(/\(|\)/g, '');
            itemStr = _.trim(itemStr);
            var temp = itemStr.split(',');
            ret.scope = _.trim(temp[0]);
            ret.index = _.trim(temp[1]);
        } else {
            ret.scope = itemStr;
        }
    }
    return ret;
}

// (item, index) in arr
// item => arr[i]
function parseItemScope(node, expression) {
    if (node && node.__scope__) {
        var scope = node.__scope__;
        expression = expression.replace(new RegExp(scope.$item, 'g'), scope.val + '[' + scope.index + ']');
    }
    return expression;
}

exports.default = parseForExpression;