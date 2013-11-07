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

	function infect(name, value, scope) {
		var params, paramsText, func, origArgs;
		// adding a new strain must be a mutable value
		if (typeof name === 'string' && value && 'object|function'.indexOf(typeof value) !== -1) {
			strains[name] = value;

		// fetching an existing strain
		} else if (typeof name === 'string' && value === undefined) {
			return strains[name] || null;

		// infecting a function is strains
		} else if (typeof name === 'function' && value instanceof Array) {
			scope = scope || {};
			
			// assign parameters to more logical names
			func = name;
			params = value;

			// add an arguments param so we can inject the original args at execution
			params.unshift('arguments');

			// get the params string to inject into the function
			paramsText = params.join(',');

			// fill params with the actual object references
			params = getStrains(params);

			// stringify the function
			func = func.toString();

			// pull the function's parameters as a string
			origArgs = func.match(/^function\s*[^\(]*\(\s*([^\)]*)\)/m)[1];

			// if the function was defined with parameter, delimit
			// the injection values and the parameter list wtih a comma
			paramsText += (origArgs.split(' ').join('').length > 0) ? ',' : '';

			// rewrite the function with the injected parameters
			func = eval('(' + func.replace(origArgs, paramsText + origArgs) + ')');

			return function () {
				// combine the injected params and actual params
				var args = Array.prototype.concat.apply(params, arguments);

				// replace the "arguments" parameter with the arguments value
				args[0] = arguments;
				
				// execute the injected function
				func.apply(scope, args);
			};

		// everything else is invalid
		} else {
			throw ' :: infect.js => invalid use of infect()';
		}
	}

	function getStrains(args) {
		var i, len, arg;
		for (i = 1, len = args.length; i < len; i++) {
			arg = args[i];
			if (typeof arg !== 'string') { throw ' :: infect.js => Keys must be strings'; }
			args[i] = strains[arg] || undefined;
			if (args[i] === undefined) { throw ' :: infect.js => Could not inject ' + arg; }
		}
		return args;
	}

    return infect;
}));