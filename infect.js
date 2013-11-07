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
	var strains = {};

	function infect(name, value, that) {
		var params, key, paramsText, func, origArgs, scope, i;
		// adding a new strain must be a mutable value
		if (typeof name === 'string' && value && 'object|function'.indexOf(typeof value) !== -1) {
			strains[name] = value;

		// fetching an existing strain
		} else if (typeof name === 'string' && value === undefined) {
			return strains[name] || undefined;

		// infecting a function is strains
		} else if (typeof name === 'function' && value instanceof Array) {
			// assign parameters to more logical names
			func = name;
			params = value;

			scope = { 'this': that };

			i = params.length;
			for (; i-- ;) {
				key = params[i];
				if (typeof key !== 'string') { throw ' :: infect.js => Keys must be strings'; }
				scope[key] = infect(key);
				if (scope[key] === undefined) { throw ' :: infect.js => Could not inject ' + arg; }
			}

			return function () {
				func.apply(scope, arguments);
			};

		// everything else is invalid
		} else {
			throw ' :: infect.js => invalid use of infect()';
		}
	}

    return infect;
}));