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
		// adding a new strain
		if (typeof name === 'string' && value) {
			if (strains[name]) { throw ' :: infect.js => ' + name + ' was already assigned!'; }
			strains[name] = value;
		} else if (typeof name === 'string' && value === undefined) {
			return strains[name] || null;
		} else if (typeof name === 'function' && value instanceof Array) {
			scope = scope || {};
			func = name;
			params = value || [];
			params.unshift('arguments');
			paramsText = params.join(',');
			params = getStrains(params);

			func = func.toString();
			origArgs = func.match(/^function\s*[^\(]*\(\s*([^\)]*)\)/m)[1];
			paramsText += (origArgs.split(' ').join('').length > 0) ? ',' : '';
			func = eval('(' + func.replace(origArgs, paramsText + origArgs) + ')');

			return function () {
				var args = Array.prototype.concat.apply(params, arguments);
				args[0] = arguments;
				func.apply(scope, args);
			};
		}
	}

	function getStrains(args) {
		var i, len, arg;
		for (i = 1, len = args.length; i < len; i++) {
			arg = args[i];

			args[i] = strains[arg] || null;
			if (args[i] === null) { throw ' :: infect.js => Could not inject ' + arg; }
		}
		return args;
	}

    return infect;
}));