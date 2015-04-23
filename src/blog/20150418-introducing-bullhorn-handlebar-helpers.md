---
title: Introducing Bullhorn Handlebars
description: An introduction to a collection of helper functions for handlebars templating library
date: 2015-04-18
template: post.html
tags:
    - Handlebars
    - Templating
    - Bullhorn
---

[Bullhorn Handlebars Helpers](https://github.com/uplift/bullhorn-handlebars-helpers) are a collection of useful helper functions that are primarily designed to be used with the [Handlebars.js](http://handlebarsjs.com/) templating library. Bullhorn helper modules can also be used as standalone modules outside of Handlebars but it's API is designed to fit with what Handlebars passes as arguments to it's helpers.

Bullhorn provides extra functionality to the five built in helpers that Handlebars itself provides and offers access to default Javascript functions that aren't available inside of a Handlebars template e.g. array.join().

Bullhorn can be used in the browser or the server (i.e. node.js) and also supports usage as an AMD module.

To install Bullhorn, you can install direct from bower or npm package manager with the name 'bullhorn-handlebars-helpers'.

    # npm
    npm install bullhorn-handlebars-helpers
    # bower
    bower install bullhorn-handlebars-helpers

Each helper is in its own separate file so you can pick and choose which of the helpers you want to use and don't have to include the whole set.

If you find any issues, please report them on the [github project issue page](https://github.com/uplift/bullhorn-handlebars-helpers/issues).

### References

[Handlebars.js](http://handlebarsjs.com/)  
[Bullhorn Handlebars Helpers](https://github.com/uplift/bullhorn-handlebars-helpers)  

