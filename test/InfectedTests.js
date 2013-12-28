test( 'SET and GET object', function() {
	var obj = {'a': 'apple'};
	infect.set('key', obj);

	equal(obj, infect.get('key'), 'object used to SET equals the object returned from GET');
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


test('should work "infect.func" with minification code', function () {
	var $res = null;
	infect.set('checker', function (saveParam) {
		$res = saveParam;
	});
	infect.set('params', { name: '...Test Param...' });

	// minification code.
	// ps. http://jscompress.com/
	var InfectedClass=infect.func(function(e,t,n){this.param=e;t(n)},null,["$checker","params"]);

	equal($res, null, 'result has been init to null');

	var instance = new InfectedClass('test');

	equal($res.name, '...Test Param...',
		'result should set from $params');

	equal(instance.param, 'test',
		'Constructor is injecting testing params!');
});