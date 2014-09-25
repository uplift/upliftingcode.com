---
title: "AMD: An Overview"
description: An overview of what AMD is and how to use in in your applications
date: 2012-05-13
template: post.html
tags:
    - AMD
    - Javascript
    - RequireJS
---
Asynchronous Module Definition (AMD) is an API for defining and loading Javascript modules asynchronously.

AMD modules offer a way to write modular Javascript in the browser that is similar to writing modular Javascript on the server (e.g. using Node) with the main exception that the loading of modules is done in an asynchronous manner compared to the synchronous manner found on the server. AMD can also be used on the server with synchronous loading.

### So is AMD just another way to load Javascript?

**No!** Loading Javascript is just one part of AMD and is usually not a major aspect after the application has been run through a build script.

AMD’s greatest benefits is code organization. Part of the AMD definition is defining dependencies as part of the module instead of including script tags in the HTML which allows modules to be more easily shared and reused in other codebase’s.

AMD also offers a solution to two big problem issues in Javascript development, Globals and Namespacing.

### How to define a module using AMD

There are two keywords that are reserved by the AMD Specification. They are define and require.

Define (as it sounds) is a function to setup the definition of your modules. The define function consists of three arguments, the first two of which are optional.

    define(id?, dependencies?, factory)

**Id**: A string identify of the module (Optional). In majority of use cases this isn’t necessary to define while developing and usually handled by an AMD build tool.

**Dependencies**: An array of module ids that are required by the module being defined (Optional). The module ids, if not predefined (by the module itself or the loader), are relative to the module being defined. The file type (.js) is omitted for AMD modules. The resolved values of the array will be passed into the factory as arguments with their index in the array equivalent to the argument position in the factory.

**Factory**: An function or object that defines the module (**Mandatory**). If the factory is an object, the object is used as the value to pass to other modules that use the module being defined as a dependency. If the factory is a function it takes the return value of the function as the value to pass.

Require is a function for setting up how the AMD loader loads in your AMD modules (defined using define). See below for more information on AMD loaders.

For more on the finer details of the AMD Specification, I recommend reading the [AMD API Wiki](https://github.com/amdjs/amdjs-api/wiki/AMD).

### Refactoring existing modules to AMD

It is fairly straightforward to convert existing modular Javascript to its AMD equivalent.

A simple Javascript object (without dependencies) can be converted by wrapping it in a define call and removing the variable name of the object.

    //Plain Javascript Object
    var myObj = {
      "key1": "value1",
      "key2": "value2"
    };
    //Converted to an AMD module
    define({
      "key1": "value1",
      "key2": "value2"
    });

The same conversion can be done for an [Immediately-Invoked Function Expression](http://benalman.com/news/2010/11/immediately-invoked-function-expression/) (IIFE) (without dependencies)

    //IIFE
    var myModule = (function(){
      var Module = //Module code here
      return Module;
    }());
    //Converted to an AMD module
    define(function(){
      var Module = //Module code here
      return Module;
    });

To add a dependency of an AMD version of Backbone to the above module, you simply add it to the dependency array and reference it as an argument in the factory function.

    //backbone.js file located in same directory as this module
    define([ "backbone" ], function( Backbone ) {
      var Module = Backbone.Model({//model definition here});
      //other code here
      return Module;
    });

Anything external to the module being defined should be listed in the dependency array even if the the external module is a global object in your current application. This allows the module to be reused elsewhere (a different app perhaps?) and anyone looking at the module will know at a glance, what else is needed for the module to function. If you rely on a global object, it could cost you in the future when debugging to find out why the module no longer functions in a different context.

### AMD Loaders

Now you have defined and refactored your modules. How do you use them and load them into your application. The answer is an AMD Loader. An AMD Loader is the require part of the AMD Specification. 

<div class="alert alert-info">**Note**: The require keyword can be aliased with another word i.e. curl.js uses the keyword curl instead of require but they both have equivalent functionality.</div>

The require function is quite similar to the define function in most loaders. It takes an optional configuration object, an optional list of dependencies and a function to run after the dependencies are loaded.

    require(configuration?, dependencies? factory)

**Configuration**: A object to configure the require loader (Optional). Usually involves configuring paths to retrieve modules, setting up packages information and setting up configuration for loader plugins.

**Dependencies**: An array of module ids that are required before the require callback can run (Optional). Similar to the dependency array used when defining a module.

**Factory**: A callback function to be run once all dependencies are loaded.

### Loader Plugins

An AMD loader plugin is a piece of code that allows you to define dependencies within an AMD module that aren’t AMD modules. A common plugin is a text plugin that for example allows an AMD module to add an HTML template as a dependency.

To identify that a dependency isn’t a normal AMD module being loaded, a plugin registers a name that is included before the dependency’s path/id suffixed with an ! symbol.

    //template.html file located in same directory as this module
    define([text!template.html], function(template) {
      //code here
    });

For most plugins you always have to include the file extension aswell i.e. the .html in the above example.

There are a multitude of plugins available already for the different loaders (some with reuse across loaders) e.g. [Miller Medeiros’ requirejs-plugins github project](https://github.com/millermedeiros/requirejs-plugins).

### Loading Packages

Packages are groups of related code that don’t fit together into one module but are a collection of modules and other assets. An example of a package is the [has.js](https://github.com/phiggins42/has.js/) library.

A package usually has some sort of index file that is the core of the package and has multiple files that add and expand the core functionality that you call in when/if its required.

Most loaders have a special config for including packages. In RequireJS, a package is configured with the name of the package, the location of the package and the main file of the package.

### Should I use AMD?

**Absolutely**. I have been using AMD for about a year and find it very useful for organizing code and applications on the whole. I have also found its easier to explain Javascript modules to non Javascript programmers as it allows for easier explanation of concepts found natively in other languages.

Eventually native modules will arrive in Javascript in [ES Harmony](http://wiki.ecmascript.org/doku.php?id=harmony:modules) so we aren’t forced to use a library to allow this behaviour. Until then AMD is a very good solution to modular development and a way to convert AMD modules into native modules is currently being worked on with a view to easing the transition in the future. This work is currently work in progress as is the specification for native modules.

If you’re interested to see where AMD loaders are going, I’d recommend reading the draft of [RequireJS 2.0](https://github.com/jrburke/requirejs/wiki/Requirejs-2.0-draft) aswell as the other loaders listed in the references of this articles.

### References

[AMD API Wiki](https://github.com/amdjs/amdjs-api/wiki/AMD)  
[AMD Implement Google Group](https://groups.google.com/group/amd-implement)  
[AMD Patterns Slides by John Hann](http://unscriptable.com/code/AMD-module-patterns/)  
[AMD is better for the web than CommonJS modules](http://blog.millermedeiros.com/amd-is-better-for-the-web-than-commonjs-modules/)  
[Writing Modular JavaScript With AMD, CommonJS & ES Harmony](http://addyosmani.com/writing-modular-js/)  
[RequireJS Project Website](http://requirejs.org/)  
[Curl Wiki](https://github.com/cujojs/curl/wiki)  
[curl.js: Incredible AMD Loader by David Walsh](http://davidwalsh.name/curljs)  
[bdload AMD Loader](http://bdframework.org/bdLoad/)  
[CommonJS Packages 1.1 Spec](http://wiki.commonjs.org/wiki/Packages/1.1)  
