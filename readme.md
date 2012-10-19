#MoMa - A Javascript Module and Class Manager.

MoMa (Module Manager) is a general dependency solver and symbol creator for javascript.
A module, ideally identifies one JavaScript file, and one symbol Class.
MoMa has the following features:

* Solves very deep transitive dependencies.
* Supports bundled files (all files concatenaded for production environments)
* Supports single file retrieval (get file by file for testing environments)
* It does not pollute global namespace.
* Based on John Resig's Class pattern.

##MoMa.ModuleManager

The MoMaModuleManager object is the entry point to modules definition. It is responsible for loading modules,
solving dependencies, notify callback observers about modules being solved, loading libraries, etc.

MoMa.ModuleManager has the following functions:

###MoMa.ModuleManager.baseURL(path)

The base URL defines a document root to read and solve modules from.
The function will append **/** in case the path does not contain it.

###MoMa.ModuleManager.setModulePath(module, path)

Define as much module paths as needed. for example:

```javascript
MoMa.ModuleManager.setModulePath("CAAT.Foundation", "src/Foundation")
```

will make a module like

```javascript
MoMa.Module({
  defines : "CAAT.Foundation.UI.Label",
  ...
```

resolve to

```javascript
src/Foundation.UI.Label.
```

###MoMa.ModuleManager.bring( ["module1 | .js file", "module2 | .js file",...] )

This functions loads all the modules or libraries specified.
Modules are loaded and solved on the fly, while .js files, are simply loaded.
When **MoMa** ends loading and solving all files/modules, it notifies via callback to MoMa's **onReady** function.

This function loads a file if the array value ends with **js**, or tries to load a module otherwise.

###MoMa.ModuleManager.addModuleSolvedListener(modulename,callback)

Add a callback function when a given module has been solved.

###MoMa.ModuleManager.load(file, onload, onerror)

Load a js file, and notify callbacks on file load, or on error. This function does not try to solve any module
contained in the file.
Intended to load independant non-module files.

###MoMa.ModuleManager.onReady(callback)

Call the callback funtion when all the files specified by a call to bring have been loaded and solved. It is safe
to start any program from this callback function.

###MoMa.ModuleManager.status()

Get the ModuleManager status.
Dumps on console information about every loaded module, its pending dependencies, and whether it's been solved.
A module has been solved when recursively, all its dependencies have been loaded and solved.

###MoMa.ModuleManager.solvedInOrder()

Get the list in resolution order of the modules loaded by this ModuleManager.


##Module

A module identifies a JavaScript file, and ideally, defines a Class. It is uniquely identified by its **defines** clause.

A module is created y calling:

```javascript
MoMa.Module({
  defines : "a.qualified.class.name",
  aliases : ["qualified.name", "qualified.name", ... ],
  extends : "a.qualified.class.name.to.extend",
  depends : ["a.qualified.class", "another.qualified.class", ... ],
  constants : {
    aconstant : 5,
    afunction : function() {
    },
    ...
  },
  extendsWith : function() {
    return {

    }
  },
  onCreate : function() {
    // function to call after module creation
    // opposed to when the module has been solved.
  }
}
```

###defines : {string}

This is the module definition. It must describe a valid constructor function namespace.
**MoMa** will build the needed object hierarchy from the global namespace and will synthesize a Class from the other
parameters to this name.

For example **defines : "CAAT.Foundation.Actor"** will create three nested objects CAAT -> Foundation -> Actor and will
associate the synthesized class to the **Actor** object.

###aliases : Array<string>

This allows to associate different class names.

For example **aliases: ["CAAT.Actor"]** will associate the same class object to CAAT.Foundation.Actor and CAAT.Actor.

This block is optional.

##depends : {Array<String>}

Define this module's dependencies. This clause could force new module resolution calls to bring the needed dependencies
to MoMa. Module resolution is instrumented by **setModulePath** calls.

This block is optional.

###constants : {object}

This clause will inject Class level constants.
By the time the module is defined, the Class has not yet been created, so Class level constants, as opposed to prototype
level constants can't be set. That's why, Class level constants have been deferred to a **constants** clause.

For example:

```javascript
CAAT.Module({
  defines : "CAAT.Module.Actor",
  constants : {
    c1: 1,
    c2: 'a'
  }
...
```

will create a final Class object:

```javascript
CAAT.Module.Actor.c1= 1
CAAT.Module.Actor.c2= 'a'
```

This block is optional.

###extends : {string}

This block causes the synthesized class to extend the module Class identified by the string.
It must be a module either defined in the **depends** block, or already loaded by another module dependencies.

This block is optional.

###extendsWith : {function|object}

Extends the module Class' prototype defined in extends with this object.
If a function is especified as value, the function must return an object, which will be used as the extending prototype.
This is an inheritance pattern, where the base module is extended and a new Class object is created.


###decorated : {boolean}

Instrument the synthesized Class object to be decorated with closured __super methods.
See **Synthesized Class - A disgression on style.**


##Module resolution

The rules to load a module from a call to **bring** are the following:

 * if the module_name ends with **.js**
   * if starts with **/**, the module resolves to **module_name.substring(1)**
   * else the module resolves to **baseURL/module_name
 * else
   * if a suitable modulePath defined by a call to **setModulePath** exists
     * strip module_path prefix from module_name and change it by the associated path
     * change . by /
     * prepend **baseURL**
   * else return module_name, which **will probably fail**

For example:

```javascript
MoMa.ModuleManager.
  setBaseURL("/code/js").
  setModulePath( "CAAT.Foundation", "src/Foundation" );

MoMa.bring( [
    "CAAT.Foundation.Actor",
    "CAAT.Foundation.UI.Label",
    "a.js",
    "/a.js"
] );
```

**CAAT.Foundation.Actor** will resolve to:

```javascript
/code/js/src/Foundation/Actor.js
'/code/js/' + 'src/Foundation/' + 'Actor' + '.js'
```

**CAAT.Foundation.UI.Label** will resolve to:

```javascript
/code/js/src/Foundation/UI/Label.js
'/code/js/' + 'src/Foundation/' + 'UI/Label' + 'js'
```

**a.js** will resolve to:

```javascript
/code/js/a.js
'/code/js' + 'a.js'
```

**/a.js** will resolve to:

```javascript
a.js
```

##Synthesized Class - A disgression on style.

MoMa is based on John Resig's single inheritance pattern: http://ejohn.org/blog/simple-javascript-inheritance/

MoMa is the base Module Manager for CAAT, an animation library which aims at full speed. In the contrary to John
Resig's inheritance pattern, MoMa's implementation only builds a superclass closure for the initialization routine.
Despite being very convenient to have a symbol to point to the superclass' function implementation, it has shown to
be extremely slow, taking twice as much time calling using the closured superclass function that traversing the
object hierarchy.
In essence, for a base class's overriden method:

```javascript

Class a {
  function : method() {

  }
}

Class b extends a {
  function : method() {

  }
}

```

calling from b.method() to a.method(), with the closure sugarized version you'd issue a call like:

```javascript
Class b extends a {
  function : method() {
    this.__super();
  }
}
```

which is very handy, elegant and maintainable, but instead, a call like:

```javascript
Class b extends a {
  function : method() {
    b.superclass.a.call(this);
  }
}
```

will be executed, which uglier, but extremely much faster.

A track for each synthesized class for **superclass** and **constructor** are being kept. That means that
**speed over maintainability has been chosen**

On the other hand, a developer can specify **decorated : true** in the module definition, which will cause every
overriden method Class from the superclass to be using closured methods.

MoMa imposes an external initialization function for Object initialization during construction. A call to **new**
on any Class will cause a call to the optional **__init** method. This method is expected to hold all the initialization
process for a given Class. This is the only closured by default method, and the developer should call
**this.__super(arg1, arg2, ...)** to chain constructor calls.

##Example