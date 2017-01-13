'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _attr2prop = require('./attr2prop');

var _attr2prop2 = _interopRequireDefault(_attr2prop);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function parseStyle(one, two, key) {
	if (key === 'style') {
		var oneStyles = (0, _attr2prop2.default)(one[key]);
		var twoStyles = (0, _attr2prop2.default)(two[key]);
		return diffProps(oneStyles, twoStyles);
	} else {
		return two[key];
	}
}

function diffProps(one, two) {
	var diff;
	for (var k in one) {
		if (!(k in two)) {
			diff = diff || {};
			diff[k] = undefined;
		}

		if (one[k] !== two[k]) {
			diff = diff || {};
			// style增量更新
			diff[k] = parseStyle(one, two, k);
		}
	}

	for (var key in two) {
		if (!(key in one)) {
			diff = diff || {};
			diff[key] = parseStyle(one, two, key);
		}
	}

	return diff;
};

exports.default = diffProps;