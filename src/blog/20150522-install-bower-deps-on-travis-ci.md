---
title: "Quick Tip: Install Bower dependencies on Travis CI"
description: How to install bower dependencies on Travis CI for project tests
date: 2015-05-22
template: post.html
tags:
    - Testing
    - Bower
    - Travis CI
---

[Travis CI](https://travis-ci.org/) allows for easy testing of [Github](https://github.com/) projects by including a .travis.yml file with configuration in your project. By default it runs `npm install` to install any dependencies your project or project tests need. This is of limited use if your project or project tests are front end and rely on dependencies from [bower](http://bower.io/) to run.

It is however fairly straightforward to get Travis CI to install bower and install bower dependencies.  All you need to do is add the below before_script section in your .travis.yml file.

     language: node_js
     node_js:
       - "0.10"
     before_script:
       - npm install bower -g
       - bower install

Now before your test scripts run, Travis CI will install bower as a global and install any bower dependencies in your project.

### References
[Travis CI](https://travis-ci.org/)  
[bower](http://bower.io/)  
