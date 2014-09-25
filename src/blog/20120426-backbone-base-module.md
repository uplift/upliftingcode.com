---
title: "Quick Tip: A Backbone Base Module"
description: Quick tip of how to create a base backbone-like module
date: 2012-04-26
template: post.html
tags:
    - BackboneJS
    - Javascript
    - Quick Tip
---

Backbone.js is a great MV* framework but sometimes you just want a basic module to extend that doesn’t have all the properties of a router, model, collection or a view. Below is an example of how to create a base module that just has Backbone events and a extend function.

    var BaseModule = (function( _, Backbone ) {

      var Base = function( options ) {
          this.initialize.apply( this, arguments );
      };

      _.extend( Base.prototype, Backbone.Events, {
          initialize: function(){}
      });

      Base.extend = Backbone.Model.extend;

      return Base;

    }( _, Backbone ));

Of course you can add anything else you feel a base module needs and namespace it as you wish.
