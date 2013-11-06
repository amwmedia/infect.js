(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(factory);
    } else if (typeof exports === 'object') {
        // Node.js
        module.exports = factory();
    } else {
        // Browser globals
        root.virus = factory();
  }
}(this, function () {
	var strains = {};

	function add(name, value) {
		strains[name] = value;
	}

	function diagnose(args) {
		var i, len, arg;
		for (i = 0, len = args.length; i < len; i++) {
			arg = args[i];
			args[i] = strains[arg] || null;
			if (args[i] === null) {
				throw 'Could not locate viral strain ' + arg;
			}
		}
		return args;
	}

	// extent the function prototype to make injection easier
	Function.prototype.infect = function (scope, params) {
		scope = scope || {};
		params = params || [];
		var paramsText = params.join(', ');
		if (paramsText) {
			paramsText += ', ';
		}
		params = diagnose(params);
		var FN_ARGS = /^function\s*[^\(]*\(\s*([^\)]*)\)/m;
		// var FN_ARG_SPLIT = /,/;
		// var FN_ARG = /^\s*(_?)(\S+?)\1\s*$/;
		// var STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
		var func = this;
		var funcText = func.toString();
		var origArgs = funcText.match(FN_ARGS)[1];
		func = eval('(' + funcText.replace(origArgs, paramsText + origArgs) + ')');

		return function () {
			var fargs = Array.prototype.concat.apply(params, arguments);
			func.apply(scope, fargs);
		};
	};

    return {
		add: add,
		diagnose: diagnose
    };
}));