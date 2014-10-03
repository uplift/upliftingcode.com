---
title: Building with Grunt, Part 3
description: Building a front end project with Grunt
date: 2014-10-03
template: post.html
tags:
    - Build Script
    - Javascript
    - Grunt
---

In the [first](/blog/2014/04/building-with-grunt-part-1/) [two](/blog/2014/06/building-with-grunt-part-2/) parts of this series, we have created a basic Gruntfile and implemented some pre-build tasks. Now it's time to get into the main build tasks. But first...

### What is all this configuration?

So far we've implemented Grunt tasks by passing the tasks configuration objects but haven't explained how those configuration options actually work.

Each task has a name which is used to group the tasks configuration data under i.e. grunt-contrib-uglify task is referenced with the task name 'uglify'. Each task configuration is just a Javascript object. Each task has different specific properties but any data can be kept on the object as long as it doesn't conflict with any property names that the task requires.

Generally, properties under the main task are called build targets and usually used to separate the task into separate filesets or options types. For example

    module.exports = function( grunt ) {
        grunt.initConfig({
            // Main Task
            copy: {
                // Build Target - Staging
                staging: { /* Staging options */ },
                // Build Target - Publish
                publish: { /* Publish options */ }
            }
        });
    }

Under the build targets, the filesets to perform the task on, are listed. There are a number of ways to specify a fileset which can be found on the [Grunt documentation](http://gruntjs.com/configuring-tasks).  The key points in specifying a fileset are the source and destination locations, whether with src and dest property names or by the using the property name (make sure to quote the name if it includes invalid characters) as the destination and source as the value. 

Depending on the way you specify the fileset, you can also have access to other properties such as filter to run functions over the fileset to exclude files that would be difficult with globbing patterns.

Other than the build targets and filesets, another important property is the options property.  Options can be specified at task level, on a per build target basis, both or not at all. Options on a build target will override the same option on the task. For example

    module.exports = function( grunt ) {
        grunt.initConfig({
            // Main Task
            copy: {
                options: {
                    // Task level options, both below targets will use unless overridden by target options
                },
                // Build Target - Staging
                staging: { 
                    options: {
                        // Staging target options
                    }
                },
                // Build Target - Publish
                publish: { 
                    // No options - will use task options
                }
            }
        });
    }

### Concatenation 

When sending front end code to users, you want it to be as performant and as fast as possible. This is usually achieved by concatenating all the script files or css files into one file (or as few as possible for your application) and delivering those to the user.

Like most things in Grunt, there's a task for it already. Install it by running

    npm install grunt-contrib-concat --save-dev

Then add it to the Gruntfile with the property name 'concat'. For this post, we are only going to cover the basics of taking files and concatenating them together. This task also has other options like adding banners and footers which you can investigate on the [tasks Github page](https://github.com/gruntjs/grunt-contrib-concat).

As we have copied all the source files to the staging directory, we now have to set all are paths to point to that directory.  In the last part we added a paths object to the Grunt config which we can reference to get the location of the staging directory.

We can then use the path to all the scripts in out paths object but append it to the staging path so it references all the scripts under the staging directory instead of the root of the project. 

<div class="alert alert-info">**Note:** By using scripts reference in our paths object (i.e. scripts/\*\*/\*.js) then the order of the concatenation of the scripts isn't guaranteed. For the majority of applications, you'll want to maintain the order of concatenation. To do this you would need to list the scripts in order in an array.</div>

We want the output of the concatenated scripts to be in the root of the scripts directory in a file called dist.js. This too is still in the staging directory. 

    module.exports = function( grunt ) {
        // ...

        grunt.initConfig({
            // ...
            concat: {
                dist: {
                    src: '<%= paths.staging %>/<%= paths.scripts %>',
                    dest: '<%= paths.staging %>/scripts/dist.js'
                }
            }
        });
    }

Add the task to the default task list and run `grunt` in your terminal. Under the /staging/scripts/ directory, a dist.js file should now exist with all the Javascript inside it.

### Minification

Now our application has one big file. Lets try and reduce the size of this file so it's quicker for the application users to download. Lets install the minification grunt task. There are a number of minification grunt tasks as well as a number of minifiers. For this we are going to use uglify minifier for the Javascript source files we are using. There are other Javascript minifiers as well as minifiers for CSS, HTML, images and other types of source code.

    npm install grunt-contrib-uglify --save-dev

Add the Uglify task to the Grunt config and set the source and destination to the destination of the concatenated task.

<div class="alert alert-info">**Note:** Putting the same path as the source and destination means the task will write over the existing file(s) with the output of the task.</div>

    module.exports = function( grunt ) {
        // ...

        grunt.initConfig({
            // ...
            uglify: {
                dist: {
                    src: '<%= paths.staging %>/scripts/dist.js',
                    dest: '<%= paths.staging %>/scripts/dist.js'
                }
            }
        });
    }

Finally add the Uglify task to the default task list.

The output of the dist.js file should now be the all the Javascript files concatenated and minified.

### Conclusion

Now we have built our source files into production ready files. We need to include the new production file into to our applications HTML page instead of the old sources files it currently references. We'll look how to do this in Part 4.

You can find the code for these articles on [Github](https://github.com/uplift/building-with-grunt) to follow along with. Let me know in the comments if you want anything explained in more detail or if you have any tips or tricks to improve this build process.

### References

[Grunt: The Javascript Task Runner](http://gruntjs.com/)  
[Grunt Configuring Tasks Documentation](http://gruntjs.com/configuring-tasks)  
[Grunt Concat Task](https://github.com/gruntjs/grunt-contrib-concat) 
