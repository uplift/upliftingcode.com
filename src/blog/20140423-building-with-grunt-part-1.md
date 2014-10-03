---
title: Building with Grunt, Part 1
description: Building a front end project with Grunt
date: 2014-04-23
template: post.html
tags:
    - Build Script
    - Javascript
    - Grunt
---

Two years ago, I blogged about the list of tasks that make up a usual build workflow for a frontend web site/application. Unfortunately, I never got round to writing up how to actually create a build workflow to run those tasks. Time to correct that. Using the [original blog post](/blog/2012/04/front-end-build-script-tasks) as a guide, I will show you how to run the build tasks with [Grunt](http://gruntjs.com/).

### Why use Grunt?

Grunt is a task runner written in Javascript. A task runner does exactly as the name suggests, it runs tasks. With a task runner running the tasks, it means that the task can be automated. So bye bye manual work.

Grunt is an established product now with a wide array of plugins to choose from. Most tasks already have a plugin but if they don't, you can easily create one.

### Getting started with Grunt

To start with Grunt you first need to install Grunt. Grunt comes in two parts. The command line interface (CLI) and the main Grunt module. The CLI part needs to be installed globally. To install run the below in your terminal:-

    npm install -g grunt-cli

By installing the CLI, you haven't installed the Grunt task runner, just the command to run the task runner in your system path. The CLI basically looks for a local grunt module in your project (using node's require()).

To install the task runner, run the below in your terminal:-

    npm install grunt --save-dev 

<div class="alert alert-info">Note: --save-dev saves the installed module to your projects package.json devDependencies</div>

Now that Grunt is installed, we have to create a file called Gruntfile.js in the root of your project. The Gruntfile is the main file for Grunt and where you will configure your tasks to run.

This file is just a node module that exports a function that gets passed the grunt object.

    module.exports = function( grunt ) {
        // Grunt config goes here
    }

Within this function, initialize the Grunt config by calling grunt.initConfig function.

    module.exports = function( grunt ) {
        grunt.initConfig({
            // Grunt config goes here
        });
    }

Grunt then needs to know about any Grunt plugins it might need to use. To load a Grunt plugin you either have to call grunt.loadTasks or grunt.loadNpmtasks. 

    module.exports = function( grunt ) {
        // Load tasks from a directory, pass path to task directory
        grunt.loadTasks( "build/tasks/" ); 
        // ... more task directories
        // Load tasks installed using NPM, pass name of NPM module
        grunt.loadNpmTasks( "grunt-contrib-copy" )
        // ... more task NPM modules

        grunt.initConfig({
            // Grunt config goes here
        });
    }

<div class="alert alert-success">**Tip:** If more than a few grunt plugins are used then the list of loaded plugins can get quite cumbersome. In these cases use a module called matchdep by [Tyler Kellen](https://twitter.com/tkellen) which can be used to filter NPM module dependencies by name and pass them to the grunt.loadNpmTasks function.</div>

In this example we are only going to use NPM tasks for the time being so our Gruntfile so far will look like this.

    module.exports = function( grunt ) {
        // Load Tasks
        require( 'matchdep' ).filterDev( 'grunt-*' ).forEach( grunt.loadNpmTasks );

        grunt.initConfig({
            // Grunt config goes here
        });
    }

With Grunt installed and a basic Gruntfile set up, we can now start adding tasks to run in the build.

### Retrieve from Source Control

In the original article, retrieve from source control was listed as the initial task. Although it is still the initial task for our overall build, it is not the initial task for our Gruntfile.  Retrieving the code from source control should be the responsibility of the Continuous Integration (CI) environment which should also kick off the Grunt build. This is a topic for another article, so we'll skip over it for now and assume the code has been retrieved.

### Code Review/Quality Control

As part of software engineering development and working in a team, any code should conform to general best practice and style guidelines. There are a number of tools and Grunt plugins available for "linting" various aspects of your code.

For this example we are going to lint the Javascript files but in a full application, linting should be performed on [JSON](https://github.com/brandonramirez/grunt-jsonlint) files (usually project files i.e. build files), on [CSS](https://github.com/gruntjs/grunt-contrib-csslint)/[SASS](https://github.com/ahmednuaman/grunt-scss-lint) files, checking [coding style](https://github.com/gustavohenke/grunt-jscs) and maintaining [white spacing](https://github.com/schorfES/grunt-lintspaces) guidelines.

So how is the Gruntfile configured to lint the Javascript files?

To lint, we are going to use [JSHint](http://www.jshint.com/) and the Grunt plugin [grunt-contrib-jshint](https://github.com/gruntjs/grunt-contrib-jshint) that wraps JSHint.

First lets install the plugin

    npm install grunt-contrib-jshint --save-dev 

Then add the JSHint task to the initConfig and pass it the options it requires. For a full list of options see the [grunt-contrib-jshint github page](https://github.com/gruntjs/grunt-contrib-jshint).

    module.exports = function( grunt ) {
        // Load Tasks
        require( 'matchdep' ).filterDev( 'grunt-*' ).forEach( grunt.loadNpmTasks );

        grunt.initConfig({
            // jshint task
            jshint: {
                // Path to jshintrc file
                jshintrc: '.jshintrc',
                // Glob of where to find files to lint
                srclint: {
                    src: [ 'scripts/**/*.js' ]
                }
            }
        });
    }

With the first task in place, how do we run it? To run grunt, you need to run Grunt followed by the task name. In your terminal, run the below:

    grunt jshint

You should see an output saying the Javascript files under the script directory are lint free. 

To finish part 1, we'll do some tidy up so we can run more than one task at a time like above. To do this we'll need to register our own Grunt task and name it 'default'. Add the following line to the bottom of your Gruntfile.js before the closing function curly brace.

    grunt.registerTask( 'default', [] );

With this default task registered we can now run the `grunt` command without a task name. Running our current default task won't actually do anything currently. For it to do anything we need to add tasks to it.  The tasks are added by putting the name of the task in the current empty array.

Change the Gruntfile default task to add the jshint task.

    grunt.registerTask( 'default', [ 'jshint' ] );

Now run the grunt command

    grunt

The output should now show the same output as running `grunt jshint`

### Conclusion

That completes the end of part 1 and should show you how to create a basic Gruntfile, install the grunt modules and add a simple task to lint Javascript files with JSHint. Try adding some of the other linter's mentioned above to the Gruntfile.

I will post [part 2](/blog/2014/06/building-with-grunt-part-2/) shortly to carry on through the list of tasks for our front end application.

**Update (06/08/2014):** Added code to [github](https://github.com/uplift/building-with-grunt) so article is easier to follow along with.

### References

[Grunt: The Javascript Task Runner](http://gruntjs.com/)  
[JSHint](http://www.jshint.com/)  
[Grunt JSHint Task](https://github.com/gruntjs/grunt-contrib-jshint)  
[Grunt JSONLint Task](https://github.com/brandonramirez/grunt-jsonlint) 
[Grunt Javascript Coding Style Task](https://github.com/gustavohenke/grunt-jscs)  
[Grunt CSSLint Task](https://github.com/gruntjs/grunt-contrib-csslint) 
[Grunt SASSLint Task](https://github.com/ahmednuaman/grunt-scss-lint)  
[Grunt Lintspaces Task](https://github.com/schorfES/grunt-lintspaces)  
