'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _util = require('../util');

var _ = _interopRequireWildcard(_util);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

// paramName | filterName arg1 arg2
function parseFilterExpression(str) {
    if (!str || str.indexOf('|') === -1) return null;
    var splits = str.split('|');
    var paramName = _.trim(splits[0]);
    var args = _.trim(splits[1]).split(' ');
    var methodName = args.shift();
    return {
        param: paramName,
        args: typeCheck(args),
        method: methodName
    };
}

// 类型转化
// 解析filter表达式
function typeCheck(args) {
    var rets = [];
    args.forEach(function (arg, index) {
        arg = _.trim(arg);
        // number
        if (/^[0-9]$/.test(arg)) {
            rets[index] = Number(arg);
        } else {
            // "'string'" => string
            rets[index] = arg.replace(/^\'|\'$/g, '');
        }
    });
    return rets;
}

exports.default = parseFilterExpression;