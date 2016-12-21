'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _expression = require('./expression');

var _expression2 = _interopRequireDefault(_expression);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// v-text
var vText = function vText(node, scope, key) {
    node.innerHTML = (0, _expression2.default)(scope, key);
    // 影响后面attribute遍历
    // node.removeAttribute('v-text');
};

exports.default = vText;