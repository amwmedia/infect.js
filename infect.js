(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(factory);
    } else if (typeof exports === 'object') {
        // Node.js
        module.exports = factory();
    } else {
        // Browser globals
        root.infect = factory();
  }
}(this, function () {
	var strains = {},
		type = Function.prototype.call.bind(Object.prototype.toString);

	function infect(name, value) {
		var i, key;
		// adding a new strain must be a mutable value
		if (typeof name === 'string' && value && value instanceof Object) {
			strains[name] = value;

		// fetching an existing strain
		} else if (typeof name === 'string' && value === undefined) {
			return strains[name] || undefined;

		// infecting a function is strains
		} else if (type(name) === '[object Object]' && value instanceof Array) {
			// assign parameters to more logical names
			i = value.length;
			for (; i-- ;) {
				key = value[i];
				if (typeof key !== 'string') { throw ' :: infect.js => Keys must be strings'; }
				name[key] = infect(key);
				if (name[key] === undefined) { throw ' :: infect.js => Could not inject ' + arg; }
			}
			return name;

		// everything else is invalid
		} else {
			throw ' :: infect.js => invalid use of infect(' + type(name) + ', ' + type(value) + ')';
		}
	}

    return infect;
}));