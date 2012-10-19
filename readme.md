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

resolve to src/Foundation.UI.Label.


##Module
A module is defined by a call to:

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