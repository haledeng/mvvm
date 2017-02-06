'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _util = require('../util');

var _ = _interopRequireWildcard(_util);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

exports.default = {
	capitalize: function capitalize(val) {
		if (!val && val !== 0) return '';
		val = val.toString();
		return val.charAt(0).toUpperCase() + val.substr(1);
	},
	getType: _.getType,
	trim: _.trim
};