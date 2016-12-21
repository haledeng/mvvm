'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _expression = require('./expression');

var _expression2 = _interopRequireDefault(_expression);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var vModel = function vModel(node, scope, key) {
    var tagName = node.tagName.toLowerCase();
    var value = (0, _expression2.default)(scope, key);
    if (tagName === 'input') {
        node.value = value;
    } else if (tagName === 'textarea') {
        node.innerHTML = value;
    }
    // node.removeAttribute('v-model');
};

exports.default = vModel;