# Infect.js

Infect.js is a simple way to add the magic of dependency injection to any web project, regardless of the framework on which you choose to write your application. It's infectiously simple!

[buy me a cup of coffee?](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=454PTSYM7FKLU)

# Features
 - Extremely lightweight (under 1kb min+gz)
 - Has no dependencies of its own
 - Supports module loading systems (RequireJS/AMD, Node.js) with browser global fallback.
 - 4 ways to inject your code (function, class, object, and assignment)
 - Works in every browser I've tested so far

# Browser Support (verified)
 - Internet Explorer 6+
 - Chome 14+
 - Firefox 3.6+
 - Android
 - iOS

# Installation
Download: [Source](https://raw.github.com/amwmedia/infect.js/master/infect.js) | [Minified](https://raw.github.com/amwmedia/infect.js/master/infect.min.js)

NPM: `npm install infect`

Bower: `bower install infect`

# Getting Started
### Registering a dependency
```javascript
infect.set(String, Object|Function|Array|etc...)
```

A simple call to `infect.set()` with the name you want to use, and the mutable object you'd like to register will do the trick. In the example below we are using a function, but you can register any type of mutable value (Functions, Arrays, Objects, etc).

```javascript
infect.set('Logger', function (str) {
	// prepend a time to every log line
	console.log((new Date()).toLocaleTimeString() + ' ==> ' + str);
});
```

---
### Function Injection
```javascript
infect.func(Function, Object, Array)
```

When you're writing a function that needs one or more dependency, simply pass it to `infect.func()` and reference the dependencies as parameters that are prefixed with a dollar sign (`$`). All dependencies should be added to the end of the parameter list, and they are not expected when you call the function. Optionally you may pass in an object that you want to be used as `this` inside the function. If no object is provided, a blank object will be created for this purpose (the global scope will not be used).

```javascript
var foo = infect.func(function (name, age, $Logger) {
	$Logger(name + ' is ' + age);
}, this);

foo('Joe', 27);

// CONSOLE
// 11:50:37 PM ==> Joe is 27
```
[view on jsFiddle](http://bit.ly/1e1jOt7)


#### UPD
You may forced injection with additional service list in `infect.func()`

```javascript
var foo = infect.func(function (name, age, logger) {
	logger(name + ' is ' + age);
}, this, ['$Logger']);

foo('Joe', 27);

// CONSOLE
// 11:50:37 PM ==> Joe is 27
```

This code should work with minificators (jscompress, uglify etc..) !

---
### Class Injection

The `infect.func()` method can also support javascript constructors (classes). Just like above, all dependencies should be added to the end of the parameter list, and they are not expected when you `new` the constructor.

```javascript
function Cat(name, $Logger) {
	$Logger(name + ' is a Cat');
	this.name = name;
}
Cat = infect.func(Cat);

var c = new Cat('Mr. Buttons');
infect.get('Logger')('is c a Cat? ' + (c instanceof Cat));

// CONSOLE
// 11:50:37 PM ==> Mr. Buttons is a Cat
// 11:50:37 PM ==> is c a Cat? true
```
[view on jsFiddle](http://bit.ly/1bzE96F)

---
### Object Injection
```javascript
infect.obj(Object, Array)
```

Sometimes function injection may not work for you, but you'd still like an easy way to pull multiple dependencies into a single place for reference within your code. Object injection suits this nicely and can be done by simply calling `infect.obj()` with an object and an array of dependency names you'd like to have injected. Please node that any object can be injected except the global `Window` object (for obvious reasons). If you try to infect the global scope, `infect` will throw an error.

*NOTE:* You can reference the dependency with or without the dollar sign prefix (`$`). Regardless of how you reference it, *the object will be injected with the prefixed version for consistency*.

```javascript
var INFECTED = infect.obj({}, ['$Logger']);
var ALSO_INFECTED = {};
infect.obj(ALSO_INFECTED, ['Logger']);

INFECTED.$Logger('foo!');
ALSO_INFECTED.$Logger('bar!');

// CONSOLE
// 11:50:37 PM ==> foo!
// 11:50:37 PM ==> bar!
```
[view on jsFiddle](http://bit.ly/1hCYgYX)

---
### Assignment
```javascript
infect.get(String)
```

As a simple way to reference your dependencies, you can pull them out and assign individual dependencies to variables. This is not recommended as it breaks the consistency of your code, but it is possible so I wanted to show an example of usage.

```javascript
var log = infect.get('Logger');
log('foo bar!');

// CONSOLE
// 11:50:37 PM ==> foo bar!
```
[view on jsFiddle](http://bit.ly/1bmABTE)

---
[![githalytics.com alpha](https://cruel-carlota.pagodabox.com/a1013eea091e2a1284cc42d17830b6b4 "githalytics.com")](http://githalytics.com/amwmedia/infect.js)
