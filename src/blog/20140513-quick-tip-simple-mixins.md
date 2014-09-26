---
title: "Quick Tip: Simple way to mixin an object to a Backbone Module"
description: 
date: 2014-05-13
template: post.html
tags:
    - Javascript
    - BackboneJS
    - Quick Tip
---

To extend a Backbone module, you pass an object hash to the Backbone modules extend function.

    var MyView = Backbone.View.extend({
        // New view object hash
    });

Which is fine if you only have one object hash as the extend function only accepts one object (for the prototype properties). What if you have one or more object mixins (of common sets of functionality), which you would like to use between several modules without copying and pasting the code between those modules?

A simple way to do it, is to use underscores (backbone depends on underscore, so it'll already be in your application) `_.extend` method to merge all your object mixins into one object to be passed to the Backbone extend.

    var MyView = Backbone.View.extend( _.extend(
            { // Paging mixin },
            { // Dancing widget mixin },
            { // New view object hash }
        )
    });

<div class="alert alert-info">**Note:** `_.extend` overrides in order, so the last object will override properties of the same name in previous objects. So be careful of the order you list your mixins. If you need the reverse of this use `_.defaults` instead of `_.extend`.</div>

It doesn't make for the nicest source code reading so it'll depend on your aesthetics.

Alternatively, you can use `_.extend` to mixin the extra functionality directly onto the modules prototype after the modules setup.

    var MyView = Backbone.View.extend({
        // New view object hash
    });

    _.extend( MyView.prototype, { /* Paging mixin */ } );    
    _.extend( MyView.prototype, { /* Dancing widget mixin */ } );    

**Update (16/07/2014):** Added information about using the extend method and extending the prototype directly.

### References

[Backbone Docs](http://backbonejs.org/)  
[Underscore Docs](http://underscorejs.org/)  
