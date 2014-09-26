---
title: Building with Grunt, Part 2
description: Building a front end project with Grunt
date: 2014-06-21
template: post.html
tags:
    - Build Script
    - Javascript
    - Grunt
---

In [part 1](/blog/2014/04/building-with-grunt-part-1/) of this series, we looked at setting up Grunt and adding the first task. Now it's time to add a few more tasks to create an optimized front end site/application.

### Produce Documentation

All good code should be commented to some degree.  This helps another developers and future you understand the meaning of your code at a later point. There are numerous tools for producing documentation in various forms. In this example we are going to use [Docco](http://jashkenas.github.io/docco/).

Like many tasks, there is already a plugin for using docco with Grunt called [grunt-docco](https://github.com/DavidSouther/grunt-docco). To install grunt-docco run the below command:

    npm install grunt-docco --save-dev

The plugin accepts two properties, a file path/glob and an options list with the path to the directory to put the documentation output. In our example, the Gruntfile.js will look like this

    module.exports = function( grunt ) {
        // ...

        grunt.initConfig({
            // jshint task
            jshint: { /* JSHint config from part 1 */ },
            // docco task
            docco: {
                // document all the things
                all: {
                    // Path to scripts to doc
                    src: [ 'scripts/**/*.js' ],
                    options: {
                        output: 'build/docs/'
                    }
                }
            }
        });
    }

Running `grunt docco` should create a docs folder within the build directory containing the outputted HTML files of the files documentation side by side with the code. 

This task can now be added to the default task, adding it after the jshint task.

    grunt.registerTask( 'default', [ 'jshint', 'docco' ] );

### Now the build begins

Up to now, we've only checked the files for code quality and produced documentation from the comments in the code. None of these tasks have changed the source files directly yet. The tasks going forward are going to make changes to the source files.

Depending on your project and CI environment setup, you might not want this as it could effect cleaning up the project when starting a new build.  Each build should start from a fresh state of your source files so previous builds don't impact the next build.

To get around this we are going to copy the files needed for the build sideways and use the copied files to run the build over.  To do this we are going to use the Grunt task plugin grunt-contrib-copy 

<div class="alert alert-info">**Note:** Usually tasks named grunt-contrib are tasks that are maintained by the developers that maintain Grunt.</div>

As with previous plugins we need to install the task from NPM:

    npm install grunt-contrib-copy --save-dev

The plan for this build is to copy the source files to a **staging** directory, process and build the files in staging and then copy the production ready files from the build to a **publish** directory. The files that end up in the publish directory will be what the finished web site/application files and nothing else.

To use this task we add the name of the task to our Gruntfiles config.

Firstly lets define our copy to the staging directory. First we name the copy task, in this case "staging". The staging task object contains one property called files which is an array of file globs or a file object. In previous tasks we have defined the files by using [globs](http://gruntjs.com/configuring-tasks#globbing-patterns) but for the copy, a finer level of control over which files are moved is needed so we'll build a [dynamic file object](http://gruntjs.com/configuring-tasks#building-the-files-object-dynamically).

    module.exports = function( grunt ) {
        // ...

        grunt.initConfig({
            // ... other task configs
            // copy task
            copy: {
                staging: {
                    files: [
                        {
                            src       : [ './**' ],
                            dest      : 'build/staging/'
                        }
                    ]
                }
            }
        });
    }

The first attempt at building the file list to copy will take all files in our project and copy them to a staging directory within the build folder.  The trouble with this is that all files including node_modules directory, build directory and other files aren't required to process during the build. This will make the copy task **VERY** slow, slowing down the whole build and means there will be a lot of redundant files that need to be removed after the build process.

What we need is a way to filter the files that are being copied to the staging directory. Luckily there is a function we can include in the file object called filter.  This function accepts the source (src) filepath as its only argument and must return either true or false.

Within the filter function we can use a Grunt utility function called grunt.file.isMatch. This function accepts an array of file globs/patterns and the src filepath and returns whether they match or not. Any files that don't match the array of file globs/patterns are the files that are needed to be copied.

For now we will just include node_modules and the build directory as the pattern to exclude during the staging copy task.
    
    module.exports = function( grunt ) {
        // ...

        grunt.initConfig({
            // ... other tasks
            copy: {
                staging: {
                    files: [
                        {
                            src       : [ './**' ],
                            dest      : 'build/staging/',
                            filter  : function( src ) {
                                return !grunt.file.isMatch(
                                    [
                                        'node_modules',
                                        'node_modules/**',
                                        'build',
                                        'build/**'
                                    ],
                                    src
                                );
                            }
                        }
                    ]
                }
            }
        });
    }

<div class="alert alert-info">**Note:** Unfortunately it takes two lines to remove a folder using isMatch. One to remove all sub folders and files and another to remove the parent directory. If you know how to do this in one line, mention it in the comments.</div>

Running `grunt copy:staging` should now copy all files except the node_modules directory and the build directory to the staging directory, ready for the main build processing to begin.

_Try adding other unneeded files to the exclusion list like the README file and any other project files._

As a final step, add the copy task to the default task.

    grunt.registerTask( 'default', [ 'jshint', 'docco', 'copy:staging' ] );

### Cleaning up

In the previous copy task, the code was copied so we could start with a fresh untouched code base for each build. If we copy the code to staging each time, how does the processed files from the previous build get cleaned up?

What is needed before each copy is to remove the previous staging directory so the previous build files no longer exist.  For this, another task needs to be installed called grunt-contrib-clean.

    npm install grunt-contrib-clean --save-dev

In the Gruntfile, add the clean task and add an array of file/directory paths.

    module.exports = function( grunt ) {
        // ...

        grunt.initConfig({
            // ... other config
            // clean task
            clean: [ 'build/docs', 'build/staging/' ],
            // ... other config
        });
    }

This will now remove any previous build and staging directories when `grunt clean` is run. This task can then be added to the default task before the docco task so then each build will have a clean set of documentation and files for each build.

    grunt.registerTask( 'default', [ 'jshint', 'clean', 'docco', 'copy:staging' ] );

Running `grunt` now will run through all the tasks we have added so far. Give it a try. 

### Tidying Up

So far, all the configuration of the tasks has been done inline within the specific task. Even at this early stage, we have created duplication in the Gruntfile.

Lets make the Gruntfile a little more D.R.Y. (Don't Repeat Yourself)...

We've used the path "build/staging" in two places already in our tasks. If this ever needs to change, all occurrences of the path have to be searched for and replaced which is a time consuming task.  Luckily, as the Gruntfile is just a Javascript file then we could store the path in a variable or can store it within our Gruntfile config and use Grunt's template engine to replace occurrences within the Gruntfile.

So lets store the staging directory path in the Gruntfile config like so... 

    module.exports = function( grunt ) {
        // ...

        grunt.initConfig({
            paths: {
                staging: 'build/staging'
            },
            // ... other config
        });
    }

With that in place we can replace all references to the staging directory path with:

    <%= paths.staging %>

The "<%= %>"" are the template tags and "paths.staging" refers to how to navigate the Grunt config. 

<div class="alert alert-warning">**Task:** Try adding the path to the docs directory used in the docco task to the paths object and replace it in the docco task.</div>

One final bit of tidying up we can do is to move the list of ignore patterns used in the copy task into a config property. As we want to use this config within a function instead of a string, we cant use the in built grunt template tags. Fortunately Grunt exposes a function called `grunt.config` which you can pass the object path as a string like the object path used within the template tags.

    module.exports = function( grunt ) {
        // ...

        grunt.initConfig({
            ignores: {
                staging: [
                    'node_modules',
                    'node_modules/**',
                    'build',
                    'build/**'
                ]
            },
            // ... other tasks
            copy: {
                staging: {
                    files: [
                        {
                            src       : [ './**' ],
                            dest      : '<%= paths.staging %>/',
                            filter  : function( src ) {
                                return !grunt.file.isMatch( grunt.config( "ignores.staging" ), src );
                            },
                            matchBase : true
                        }
                    ]
                }
            }
        });
    }

### Conclusion

That completes the end of part 2 and should show you how to produce documentation and copy files as well as clean up previous build files and writing a cleaner Gruntfile.

I will post part 3 shortly to carry on with the main build tasks.

**Update (12/08/2014):** Added code to [github](https://github.com/uplift/building-with-grunt) so article is easier to follow along with. Fork it and let me know if you have any tips or tricks for improving this project.

### References

[Grunt: The Javascript Task Runner](http://gruntjs.com/)  
[Docco](http://jashkenas.github.io/docco/)  
[Grunt Docco Task](https://github.com/DavidSouther/grunt-docco)  
[Grunt Copy Task](https://github.com/gruntjs/grunt-contrib-copy)  
[Grunt Clean Task](https://github.com/gruntjs/grunt-contrib-clean)  
