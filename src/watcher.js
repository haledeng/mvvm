class Watcher {
	constructor() {

	}
	on(name, callback) {
		if (typeof callback === 'function') {
			if (!Watcher._evMaps[name]) {
				Watcher._evMaps[name] = [];
			}
			Watcher._evMaps[name].push(callback);
		}
	}
	off(name) {
		if (Watcher._evMaps[name]) {
			delete Watcher._evMaps[name];
		}
	}
	emit(name) {
		var callbacks = Watcher._evMaps[name];
		var args = [].slice.call(arguments, 1);
		callbacks.forEach(function(callback) {
			callback(args);
		});
	}
}
Watcher._evMaps = {};
export default Watcher;