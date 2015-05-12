---
title: Introducing ExoSuit
description: A collection of mixins to be used to augment backbone.js applications
date: 2015-05-05
template: post.html
tags:
    - BackboneJS
    - Javascript
    - ExoSuit
---

[ExoSuit](https://github.com/uplift/ExoSuit) is a collection of functional mixins that augment your backbone application. [Backbone](http://backbonejs.org/) provides a basic structure to your Javascript application but lacks some of the excellent features of some of the more fully featured libraries and frameworks available.

ExoSuit aims to offer some of these features as mixins. This allows the behaviour of these features to be added to your existing Backbone modules, giving the advantage of only adding the functionality that you need and not having to include a whole library you only use a fraction of. 

The project currently consists of 19 mixins to add functionality to you Backbone collections, models, routers and views. They range from adding collection subsets to computed attributes to parsing querystrings from routes to view selector caching.

There is also an option to easily mixin any defined mixins as part of the Backbone extend method.

To install ExoSuit, you can install direct from bower or npm package manager with the name 'exosuit'.

    # npm
    npm install exosuit
    # bower
    bower install exosuit

ExoSuit can be used (with a few exceptions with the router mixins) as a browser script, an AMD module or a node module.

If you find any issues, please report them on the [github project issue page](https://github.com/uplift/ExoSuit/issues).

### References

[Backbone.js](http://backbonejs.org/)  
[ExoSuit](https://github.com/uplift/ExoSuit)  

