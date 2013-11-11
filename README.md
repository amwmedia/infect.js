# Infect.js &raquo; Simple Dependency Injection

Infect.js is a simple way to add the magic of dependency injection to any web project, regardless of the framework on which you choose to write your application.

# Features
 - Extremely lightweight (1.4 Kb minified)
 - Supports module loading systems (RequireJS/AMD, Node.js) with browser global fallback.
 - Easy to inject multiple dependencies with a single call to `infect`
 - 3 ways to inject your code (function, object, and assignment)

# Getting Started
### Registering a dependency
usage: `infect.set`

A simple call to `infect.set()` with the name you want to use, and the mutable object you'd like to register will do the trick. In the example below we are using a function, but you can register any type of mutable value (Dates, Arrays, Objects, etc).

```javascript
infect.set('Logger', function (str) {
	// prepend a time to every log line
	console.log((new Date()).toLocaleTimeString() + ' ==> ' + str);
});
```

### Function Injection
usage: `infect.function`, `infect.func`

When you're writing a function that needs one or more dependency, simply pass it to `infect.func()` and reference the dependencies as parameters that are prepended with a dollar sign (`$`). All dependencies should be added to the end of the parameter list, and they are not expected when you call the function. Optionally you may pass in an object that you want to be used as `this` inside the function.

```javascript
var foo = infect.func(function (name, age, $Logger) {
	$Logger(name + ' is ' + age);
	return 'bar!';
}, this);

foo('Joe', 27); // bar!

// CONSOLE
// 11:50:37 PM ==> Joe is 27
```

### Object Injection
usage: `infect.object`, `infect.obj`

Sometimes function injection may not work for you, but you'd still like an easy way to pull multiple dependencies into a single place for reference within your code. Object injection suits this nicely and can be done by simply calling `infect.obj()` with an object and an array of dependency names you'd like to have injected. Please node that any object can be injected except the global `Window` object (for obvious reasons). If you try to infect the global scope, `infect` will throw an error.

*NOTE:* You can reference the dependency with or without the prepended dollar sign (`$`) but, in either case, *the object will be infected with the prepended version*.

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

### Assignment
usage: `infect.get`

As a simple way to reference your dependencies, you can pull them out and assign individual dependencies to variables. This is not recommended as it breaks the consistency of your code, but it is possible so I wanted to show an example of usage.

```javascript
var log = infect.get('Logger');
log('foo bar!');

// CONSOLE
// 11:50:37 PM ==> foo bar!
```
