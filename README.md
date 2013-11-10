# Infect.js &raquo; A Simple Dependency Injection Library

Infect.js is a simple way to add the magic of dependency injection to any web project, regardless of the framework on which you choose to write your application. Dependency injection has many benefits. Asside from making your module definition cleaner, it also gives you a way to globally change certain services based on the environment they are loaded in, and allows you to write more modular code.

# Features

 - Extremely lightweight (1.1 Kb minified)
 - Supports module loading systems (RequireJS/AMD, Node.js) with browser global fallback.
 - Easy to register dependencies (strains) with a single call to `infect()`
 - 3 ways to infect your code (function, object, and assignment)

# Getting Started

### Registering a dependency (or strain)
A simple call to `infect()` with the name you want to use, and the mutible object you'd like to register will do the trick. In the example below we are using a function, but you can register any type of mutible value (Dates, Arrays, Objects, etc).

```javascript
infect('Logger', function (str) {
	// prepend a time to every log line
	console.log((new Date()).toLocaleTimeString() + ' ==> ' + str);
});
```

### Function Infection
When you're writing a function that you know will need one of your dependencies, simply pass it to `infect` and reference the dependencies as parameters that are prepended with a dollar sign (`$`). All dependencies should be added to the end of the parameter list, and they are not expected when you call the function. Optionally you may pass in an object that you want to be used as `this` inside the function.

```javascript
var foo = infect(function (name, age, $Logger) {
	$Logger(name + ' is ' + age);
	return 'bar!';
}, this);

foo('Joe', 27); // bar!

// CONSOLE
// 11:50:37 PM ==> Joe is 27
```

### Object Infection
Sometimes function infection may not work for you, but you'd still like an easy way to pull multiple dependencies into a single place for reference within your code. Object infection suits this nicely and can be done by simply calling `infect()` with an object and an array of dependency names you'd like injected. Please node that any object can be infected except the global `Window` object (for obvious reasons). If you try to infect the global scope, `infect()` will throw an error.

*NOTE:* You can reference the depenency with or without the prepended dollar sign (`$`) but, in either case, *the object will be infected with the prepended version*.

```javascript
var INFECTED = infect({}, ['$Logger']);
var ALSO_INFECTED = {};
infect(ALSO_INFECTED, ['Logger']);

INFECTED.$Logger('foo!');
ALSO_INFECTED.$Logger('bar!');

// CONSOLE
// 11:50:37 PM ==> foo!
// 11:50:37 PM ==> bar!
```

### Assignment
As a simple way to reference your dependencies, you can pull them out and assign individual strains to variables. This is not recommended as it breaks the consistancy of your code, but it is possible so I wanted to show an example of usage.

```javascript
var log = infect('Logger');
log('foo bar!');

// CONSOLE
// 11:50:37 PM ==> foo bar!
```
