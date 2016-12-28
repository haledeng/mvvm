'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.parseExpression = exports.parseForExpression = exports.vFor = exports.vOn = exports.calculateExpression = exports.setScopeValue = exports.vText = exports.vModel = undefined;

var _model = require('./model');

var _model2 = _interopRequireDefault(_model);

var _text = require('./text');

var _text2 = _interopRequireDefault(_text);

var _expression = require('./expression');

var _on = require('./on');

var _on2 = _interopRequireDefault(_on);

var _for = require('./for');

var _for2 = _interopRequireDefault(_for);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// 设置属性值
var setScopeValue = function setScopeValue(scope, key, value) {
    if (~key.indexOf('.')) {
        var namespaces = key.split('.');
        var last = namespaces.pop();
        namespaces.forEach(function (name) {
            scope = scope[name] || (scope[name] = {});
        });
        scope[last] = value;
    } else {
        scope[key] = value;
    }
};

exports.vModel = _model2.default;
exports.vText = _text2.default;
exports.setScopeValue = setScopeValue;
exports.calculateExpression = _expression.calculateExpression;
exports.vOn = _on2.default;
exports.vFor = _for2.default;
exports.parseForExpression = _expression.parseForExpression;
exports.parseExpression = _expression.parseExpression;