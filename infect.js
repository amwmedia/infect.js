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
		preErr = ' :: infect.js => ';

	function type(o) {
		o = Object.prototype.toString.call(o);
		return o.match(/ (.*)]/)[1].toLowerCase();
	}

	function fail(f) {
		var params = Array.prototype.slice.call(arguments, 1),
			pText = '', i;

		for (i=0; i<params.length; i++) {
			pText += (pText.legnth > 0) ? ', ' + type(params[i]) : type(params[i]);
		}

		throw preErr + 'Invalid function parameters infect.' + f + '(' + pText + ')';
	}

	function set(name, value) {
		if (type(name) === 'string' && type(value) !== 'undefined' && value instanceof Object) {
			name = name.indexOf(op) === 0 ? name.substr(op.length) : name;
			strains[name] = value;
		} else { fail('set', name, value); }
	}

	function get(name) {
		if (type(name) === 'string') {
			name = name.indexOf(op) === 0 ? name.substr(op.length) : name;
			return strains[name] || undefined;
		} else { fail('get', name); }
	}

	function obj(object, list) {
		var key, i;
		if (type(object) === 'Object' && list instanceof Array) {
			// assign parameters to more logical names
			i = list.length;
			for (; i-- ;) {
				key = list[i];
				key = key.indexOf(op) === 0 ? key.substr(op.length) : key;
				if (type(key) !== 'string') { throw preErr + ' Keys must be strings'; }
				object[op + key] = get(key);
				if (object[op + key] === undefined) { throw preErr + 'Could not inject ' + key; }
			}
			return object;
		} else { fail('obj', object, list); }
	}

	function func(fnc, scope) {
		var i, key, args, argCount;
		if (type(fnc) === 'function') {
			scope = scope || {};
			
			// pull the function's parameters as a string
			args = /\(([^)]+)/.exec(fnc.toString())[1];
			if (args) { args = args.split(/\s*,\s*/); }

			i = argCount = args.length;
			for (; i-- ;) {
				key = args[i];
				if (key.indexOf(op) !== 0) {
					args = args.slice(i+1);
					break;
				}
				args[i] = get(key);
			}

			return function () {
				var _args = Array.prototype.slice.call(arguments),
					len = _args.length + args.length;

				for (; len < argCount; len++) {
					_args.push(undefined);
				}

				if (len > argCount) { throw preErr + 'Too many parameters! I expected <= ' +
											(argCount - args.length) + ' but got ' + _args.length; }

				// combine the injected params and actual params
				_args = _args.concat(args);
				
				// execute the injected function
				fnc.apply(scope, _args);
			};
		} else { fail('func', fnc, scope); }
	}

    return {
		'set': set,
		'get': get,
		'obj': obj,
		'object': obj,
		'func': func,
		'function': func,
		funk: func
    };
}));