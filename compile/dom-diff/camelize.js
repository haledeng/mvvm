'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var camel = function camel(styleName) {
  var reg = /\-([a-z])/g;
  return styleName.replace(reg, function (all, key) {
    return key.toUpperCase();
  });
};
var unCamel = function unCamel(styleName) {
  var reg = /[A-Z]/g;
  return styleName.replace(reg, function (all) {
    return '-' + all.toLowerCase();
  });
};

exports.camel = camel;
exports.unCamel = unCamel;