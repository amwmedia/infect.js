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

	function infect(name, value) {
		// adding a new strain
		if (typeof name === 'string' && value) {
			if (strains[name]) { throw ' :: infect.js => ' + name + ' was already assigned!'; }
			strains[name] = value;
		} else if (typeof name === 'string' && value === undefinded) {
			return strains[name] || null;
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

	// extent the function prototype to make injection easier
	Function.prototype.infect = function (scope, params) {
		scope = scope || {};
		params = params || [];
		params.unshift('arguments');
		var paramsText = params.join(', ');
		params = getStrains(params);

		var FN_ARGS = /^function\s*[^\(]*\(\s*([^\)]*)\)/m;
		// var FN_ARG_SPLIT = /,/;
		// var FN_ARG = /^\s*(_?)(\S+?)\1\s*$/;
		// var STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
		var func = this;
		var funcText = func.toString();
		var origArgs = funcText.match(FN_ARGS)[1];
		var delimiter = (origArgs.indexOf(',') !== -1) ? ',' : '';
		func = eval('(' + funcText.replace(origArgs, paramsText + delimiter + origArgs) + ')');

		return function () {
			var fargs = Array.prototype.concat.apply(params, arguments);
			fargs[0] = arguments;
			func.apply(scope, fargs);
		};
	};

    return infect;
}));