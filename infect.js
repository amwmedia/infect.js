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
		op = '$',
		type = Function.prototype.call.bind(Object.prototype.toString);

	function infect(name, value) {
		var i, key, args, argCount;
		// adding a new strain must be a mutable value
		if (typeof name === 'string' && value && value instanceof Object) {
			name = name.indexOf(op) === 0 ? name.substr(op.length) : name;
			strains[name] = value;

		// fetching an existing strain
		} else if (typeof name === 'string' && value === undefined) {
			name = name.indexOf(op) === 0 ? name.substr(op.length) : name;
			return strains[name] || undefined;

		// infecting a function is strains
		} else if (type(name) === '[object Object]' && value instanceof Array) {
			// assign parameters to more logical names
			i = value.length;
			for (; i-- ;) {
				key = value[i];
				key = key.indexOf(op) === 0 ? key.substr(op.length) : key;
				if (typeof key !== 'string') { throw ' :: infect.js => Keys must be strings'; }
				name[op + key] = infect(key);
				if (name[op + key] === undefined) { throw ' :: infect.js => Could not inject ' + key; }
			}
			return name;

		// infecting a function is strains
		} else if (type(name) === '[object Function]') {
			value = value || {};
			
			// pull the function's parameters as a string
			args = /\(([^)]+)/.exec(name.toString())[1];
			if (args) { args = args.split(/\s*,\s*/); }

			i = argCount = args.length;
			for (; i-- ;) {
				key = args[i];
				if (key.indexOf(op) !== 0) {
					args = args.slice(i+1);
					break;
				}
				args[i] = infect(key);
			}

			return function () {
				var _args = Array.prototype.slice.call(arguments),
					len = _args.length + args.length;

				for (; len < argCount; len++) {
					_args.push(undefined);
				}

				if (len > argCount) { throw ' :: infect.js => Too many parameters! I expected <= ' +
											(argCount - args.length) + ' but got ' + _args.length; }

				// combine the injected params and actual params
				_args = _args.concat(args);
				
				// execute the injected function
				name.apply(value, _args);
			};

		// everything else is invalid
		} else {
			throw ' :: infect.js => invalid use of infect(' + type(name) + ', ' + type(value) + ')';
		}
	}

    return infect;
}));