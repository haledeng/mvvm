import * as _ from './util';

export default function(attr) {
	var attrReg = /([a-zA-Z\-]*)\s*?\:\s*?([a-zA-Z0-9%\-\s\#]*);?/g;
	var attrs = {};
	attr && attr.replace(attrReg, function(all, key, value) {
		// key = camelize.camel(key);
		attrs[key] = _.trim(value);
	});
	return attrs;
}