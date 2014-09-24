'use strict';

test( 'SET and GET object', function() {
	var obj = {'a': 'apple'};
	var setTo = infect.set('key', obj);

	equal(obj, infect.get('key'), 'object used to SET equals the object returned from GET');
	equal(obj, setTo, 'object used to SET returned value from SET');
});

test( 'SET and GET function', function() {
	var func = function () { return 'apple'; };
	infect.set('key', func);

	equal(func, infect.get('key'), 'function used to SET equals the function returned from GET');
	equal('apple', infect.get('key')(), 'function used to SET returns the correct output');
});

test( 'Object injection', function() {
	var func = function () { return 'apple'; };
	infect.set('key', func);
	var obj = infect.obj({}, ['key']);

	equal(func(), obj.$key(), 'injected function returns the same value as original function');
});

test( 'trying to SET immutable values should throw Error', function() {
	throws(function () {
		infect.set('key', 'string');
	}, 'trying to set a string throws an error');

	throws(function () {
		infect.set('key', 1234);
	}, 'trying to set a numer throws an error');

	throws(function () {
		infect.set('key', null);
	}, 'trying to set null throws an error');

	throws(function () {
		infect.set('key', undefined);
	}, 'trying to set undefined throws an error');

	throws(function () {
		infect.set('key', true);
	}, 'trying to set bool (true) throws an error');

	throws(function () {
		infect.set('key', false);
	}, 'trying to set bool (false) throws an error');
});

test( 'Infected constructors should construct', function () {
	infect.set('a', {'apple': 'delicious'});
	function Apple(name, $a) {
		this.name = name;
		this.apple = $a.apple;
	}
	var name = 'Granny Smith';
	var InfectedApple = infect.func(Apple);

	var a1 = new Apple(name, infect.get('a'));
	var a2 = new InfectedApple(name);

	equal(a2.apple, a1.apple, 'Constructor is injecting and building');
	equal(a2.name, name, 'new InfectedApple() params are passing through');
	ok(a2 instanceof Apple, 'new InfectedApple() is instanceof Apple');
});

test( 'Minified Infect constructors should construct', function () {
	infect.set('a', {'apple': 'delicious'});
	function Apple(n, a) {
		this.name = n;
		this.apple = a.apple;
	}
	Apple.$infect = ['a'];

	var name = 'Granny Smith';
	var InfectedApple = infect.func(Apple);

	var a1 = new Apple(name, infect.get('a'));
	var a2 = new InfectedApple(name);

	equal(a2.apple, a1.apple, 'Constructor is injecting and building');
	equal(a2.name, name, 'new InfectedApple() params are passing through');
	ok(a2 instanceof Apple, 'new InfectedApple() is instanceof Apple');
});

test( 'Function injection', function() {
	var func = function () { return 'apple'; };
	var func2 = function () { return 'orange'; };

	infect.set('key', func);
	infect.set('key2', func2);

	// regular function injection
	function infected ($key) {
		return $key();
	}
	infected = infect.func(infected);

	// minified function injection
	function minInfected (k) {
		return k();
	}
	minInfected.$infect = ['key'];
	minInfected = infect.func(minInfected);

	// another minified function test
	var varMinInfected = infect.func(function (k) {
		return k();
	});
	varMinInfected.$infect = ['key'];

	var minInfected2 = infect.func(['key', 'key2', function (h, k, k2) {
		return h + k() + k2();
	}]);

	equal(func(), infected(), 'injected function returns the same value as original function');
	equal(func(), minInfected(), 'minified injected function returns the same value as original function');
	equal(func(), varMinInfected(), 'minified (var assigned) injected function returns the same value as original function');
	equal('hello ' + func() + func2(), minInfected2('hello '), 'minified without setting $infect property');
});
