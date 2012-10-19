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