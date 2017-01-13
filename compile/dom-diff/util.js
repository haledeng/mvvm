'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var toString = Object.prototype.toString;

var trim = function trim(str) {
  return str.replace(/(^\s*)|(\s*$)/, '');
};

/**
 * is Object
 * @param    {[type]}                 obj [description]
 * @return   {Boolean}                    [description]
 */
var isObject = function isObject(obj) {
  return '[object Object]' === toString.call(obj);
};

/**
 * is object an array
 * @param    {object}                 obj [description]
 * @return   {Boolean}                    [description]
 */
var isArray = function isArray(obj) {
  return '[object Array]' === toString.call(obj);
};

/**
 * is empty string
 * @param    {string}                 obj [description]
 * @return   {Boolean}                    [description]
 */
var isEmptyStr = function isEmptyStr(obj) {
  return obj === '';
};

var isFunction = function isFunction(fn) {
  return fn && typeof fn === 'function';
};

exports.trim = trim;
exports.isObject = isObject;
exports.isArray = isArray;
exports.isEmptyStr = isEmptyStr;
exports.isFunction = isFunction;