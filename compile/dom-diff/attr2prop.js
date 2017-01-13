'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

exports.default = function (attr) {
	var attrReg = /([a-zA-Z\-]*)\s*?\:\s*?([a-zA-Z0-9%\-\s\#]*);?/g;
	var attrs = {};
	attr && attr.replace(attrReg, function (all, key, value) {
		// key = camelize.camel(key);
		attrs[key] = _.trim(value);
	});
	return attrs;
};

var _util = require('./util');

var _ = _interopRequireWildcard(_util);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }