var toString = Object.prototype.toString;

var trim = function(str) {
	return str.replace(/(^\s*)|(\s*$)/, '');
};

/**
 * is Object
 * @param    {[type]}                 obj [description]
 * @return   {Boolean}                    [description]
 */
var isObject = function(obj) {
	return '[object Object]' === toString.call(obj);
}

/**
 * is object an array
 * @param    {object}                 obj [description]
 * @return   {Boolean}                    [description]
 */
var isArray = function(obj) {
	return '[object Array]' === toString.call(obj);
}

/**
 * is empty string
 * @param    {string}                 obj [description]
 * @return   {Boolean}                    [description]
 */
var isEmptyStr = function(obj) {
	return obj === '';
}


var isFunction = function(fn) {
	return fn && typeof fn === 'function';
}

export {
	trim,
	isObject,
	isArray,
	isEmptyStr,
	isFunction
};