 var camel = function(styleName) {
 	var reg = /\-([a-z])/g;
 	return styleName.replace(reg, function(all, key) {
 		return key.toUpperCase();
 	});
 };
 var unCamel = function(styleName) {
 	var reg = /[A-Z]/g;
 	return styleName.replace(reg, function(all) {
 		return '-' + all.toLowerCase();
 	});
 };


 export {
 	camel,
 	unCamel
 }