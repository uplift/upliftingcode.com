---
title: Building with gulp, Part 1
description: Building a front end project with gulp
date: 2014-12-17
template: post.html
tags:
    - Build Script
    - Javascript
    - Gulp
---

Over the past few months you might have seen a series of posts on this blog about [building with Grunt](/blog/2014/04/building-with-grunt-part-1/). Grunt is a Javascript task runner tool for doing builds of projects. In the series of posts the project has been a front end website/application. Grunt however is not the only kid on the block in the task runner field. There is a newer tool called [gulp](http://gulpjs.com/) aiming to offer an alternative to Grunt. In this series of posts, the same project is going to be used from the Grunt articles but this time the build is going to use gulp as the task runner.

### What makes gulp different to Grunt?

Essentially they are both task runner tools written in Javascript (node.js). There are two main differences between the two. Gulp is more tasks through code where as Grunt is more tasks through configuration. Secondly gulp uses [node file streams](https://github.com/substack/stream-handbook) for the I/O (Input/Output) of files and the processing of the tasks over those files. Using streams usually means that builds are quicker as files aren't constantly being read and written from/to the file system before and after every task. 

### Getting started with gulp

Similar to Grunt, gulp is installed in two parts. First install gulp globally.

    npm install -g gulp

Next install gulp within the project.

    npm install gulp --save-dev

<div class="alert alert-info">Note: --save-dev saves the installed module to your projects package.json devDependencies</div>

Now that gulp is installed, we have to create a file called gulpfile.js at the root of your project. The gulpfile is the main file for gulp like Gruntfile.js is the main file for Grunt. The gulpfile.js is where you will configure your tasks using gulp.

A basic gulpfile looks like below

    var gulp = require( 'gulp' );

    gulp.task( 'default', function() {
        // Default task code
    });

At the top, gulp is required using the node require system. Then a default task is created using the gulp API and the build code for the default task can be added within the task function.

To run the above (which will do nothing), run `gulp` in the terminal.

With a basic gulp setup installed, we can now start adding tasks to the build.

### Adding Tasks

Adding tasks is as simple as adding another gulp.task block with a new name and a function of the build step.

Like Grunt, there is a big ecosystem of plugins to use modules with gulp but unlike Grunt, a plugin isn't always required for a module. As long as the module can accept [Vinyl file](https://github.com/wearefractal/vinyl-fs) streams, then it can be used directly without a plugin wrapper.

Any gulp plugins or node modules can be included in the gulpfile using the node require system.

Lets add a default task that actually does something in our gulpfile. First we will start with linting the project code.

As with the building with Grunt posts, [JSHint](http://www.jshint.com/) is our tool of choice for linting the Javascript files. Lets install it within the project.

    npm install gulp-jshint --save-dev

JSHint doesn't accept streams so the gulp-jshint needs to be installed. Lets require the plugin module in our gulpfile underneath where we required gulp itself.

    var jshint = require( 'gulp-jshint' );

Now the JSHint module is available to use, lets fill in that missing default task.

Each task function usually returns a stream. The gulp API offers gulp.src as an easily way to fetch files into a stream using a glob pattern or direct path. This can then be piped (using .pipe()) into tasks and plugins.

So lets fetch the Javascript files in our project into a stream.

    gulp.task( 'default', function() {
        return gulp.src( [ 'scripts/**/*.js' ] );
    });

This won't do a lot, so we need to pipe this file stream into JSHint. JSHint module requires two steps to get a linting report from the files. The first step pipes the files into JSHint main function then the results are piped into a JSHint reporter.

    gulp.task( 'default', function() {
        return gulp.src( [ 'scripts/**/*.js' ] )
            .pipe( jshint() )
            .pipe( jshint.reporter( 'default' ) );
    });

Running `gulp` in the terminal should now show the results of running JSHint over the projects Javascript files. If there are no linting errors, then it'll just show the task starting and finishing with the time taken.

### Conclusion

Now we have a basic gulpfile to start the gulp build with a default task. In the next post, we will look at how to chain tasks together for a fuller build system. If you wish to follow along with the code in these posts, the corresponding code can be found in its own [github project](https://github.com/uplift/building-with-gulp).

### References
[gulp.js - The streaming build system](http://gulpjs.com/)  
[gulp.js - Getting Started](https://github.com/gulpjs/gulp/blob/master/docs/getting-started.md#getting-started)   
[JSHint](http://www.jshint.com/)  
[Stream Handbook](https://github.com/substack/stream-handbook)  
[Vinyl FS](https://github.com/wearefractal/vinyl-fs)  
