---
title: Front End Build Script Tasks
description: Listing and explaining the tasks needed for a general web site/application build process
date: 2012-04-10
template: post.html
tags:
    - Build Script
    - CSS
    - Javascript
---

A topic I’ve been reading around the web quite a bit lately has been developers stating things like “If you’re not building your front end code for production you’re most likely doing it wrong.”

Looking at a number of sites across the web it is obvious that most people don’t build their front end code (including me on this blog at the time of writing).

Firstly you might be wondering what building your code actually means. A build step can include many actions (we’ll focus more on these later) that make code ready for use in a live production environment. With front end code, this generally centres around minifying and concatenating your CSS and javascript into one compact file each.

So why should you be building your code and why are you doing it wrong if you’re not? Essentially, as [HTML 5 Boilerplate](http://html5boilerplate.com/) project nicely states, **“Faster page load times and happy end users :)”**.

Some readers might be wondering what does a build script do and why do we need one and what does one look like?

There are several build tools available (not all are just for front end code). The most common build tool is [Make](http://www.gnu.org/software/make/) and its other language variants ([Rake](http://rake.rubyforge.org/), [Jake](http://cappuccino.org/discuss/2010/04/28/introducing-jake-a-build-tool-for-javascript/) et al). For some front end developers these might have a steep learning curve to get working. The HTML5 Boilerplate project currently uses [Apache Ant](http://ant.apache.org/) for its build script giving you a great starting point for your own projects (There are however [Node](https://github.com/h5bp/node-build-script) and [Rake](https://github.com/h5bp/rake-build-script) ports). A few Node.js build scripts, which might be easier to understand for front end developers, include [Buildr](https://github.com/balupton/buildr.npm) and the recently released [Grunt](https://github.com/cowboy/grunt).

Now that we understand what build scripts are available, what does a build script actually do? What makes front end code production ready?

### Retrieve from Source Control

So this might not be part of the build tool, but part of the build process. You need your development code to run the build script on. This might be a folder on your machine but ideally this should be stored in a VCS (Version Control System) and then you need to retrieve it to run your build.

### Code Review/Quality Control

This should be essential in any development. Normally in a team you’ll have another developer check your code for general best practices and internal best practices and style guidelines for your team. Obviously this human checking can’t be automated in a build script but there are a couple of tools for evaluating code for general best practices.

For CSS, there is [CSSLint](http://csslint.net/) written by Nicholas Zakas and Nicole Sullivan.

For JS, there are [JSHint](http://www.jshint.com/) written by Anton Kovalyov (and community) and [JSLint](http://www.jslint.com/) written by Douglas Crockford.

### Produce Documentation/API Docs

Any good developer will have comments in their code explaining its functionality or API information. Usually you want to extract this documentation into an easier to read format than reading code directly.

My personal favourite documentation tool at the moment is [docco](http://jashkenas.github.com/docco/), which produces a nice clean styled HTML document to read through. There are however many, many alternatives to choose from.

### Preprocessing

Depending on your weapon of choice in development tools, you might be using an abstraction language that compiles down to CSS ([SASS](http://sass-lang.com/), [Less](http://lesscss.org/), [Stylus](http://learnboost.github.com/stylus/docs/js.html)) or javascript ([Coffee-script](http://coffeescript.org/)). During the build you would want to compile them if they haven’t already been processed during development.

### Remove Debug Information

During your development, you might use debug statements or classes in your javascript and css to identify bugs in your application. As part of the code review process, these should be identified and removed, but there are few developers (especially early in their careers) who haven’t accidentally released these to production.

As part of the build, these should be removed (commented or deleted) so they don’t affect live code.

### Concatenate and Minify

This is the key part of any build script. Ideally a website should only have one CSS file and one javascript. This allows the website to load quicker as it doesn’t have the overhead of fetching many resources and suffer any latency in network connections and limits on the amount of connections browsers open amongst other reasons.

In development, working in one file (especially as part of a team) can be difficult and hard to manage and organize. Its usually better to develop in many files concentrating on one functionality.

As part of the build script it should take the contents of all your development files and merge them into the ideal one file.

Even with one file for your CSS and javascript, the file size can still be reduced, meaning less data transferred and less bandwidth used.

There are tools available that will remove all the white space in your file(s) (as production code doesn’t need to be readable). The same tools can also rewrite part of your code, changing variable names (where allowed and is suitable to do so) to make them smaller.

Below is a selection of minification tools:-

* [UglifyJS](https://github.com/mishoo/UglifyJS) (JS only)
* [YUICompressor](http://developer.yahoo.com/yui/compressor/) (CSS and JS)
* [Google Closure Compiler](http://code.google.com/closure/compiler/) (JS only)

### Write Cache Manifest

This task is dependent on the type of application you’re building. If a cache manifest file is needed, the build tool should be able to identify the resources used and write out a cache manifest file automatically. This should reduce any errors that would make an cache manifest invalid by having to maintain it manually.

### Rewrite HTML

After your code has been concatenated, you’re have one file instead of multiple files you had in development. How is this singular file referenced within your HTML code though? Your build tool should be clever enough to change the references to point to your new single file. It should also know how to version a file i.e. give it a unique name to bypass any potential cache issue.

### Minify HTML

Just like your CSS and javascript files, your HTML files can also be minified to remove whitespace, comments, extra quotes and other unnecessary markup.

To minify HTML you can use tools like [HTMLCompressor](http://code.google.com/p/htmlcompressor/) or [HTML Minifier](http://kangax.github.com/html-minifier/).

### Crush Images

Crushing images is the process of removing (meta/)data from an image to reduce its size without reducing the image quality. The idea of crushing images was popularized by Yahoo’s Exceptional Performance team with their [SmushIt](http://www.smushit.com/ysmush.it/) service.

There are several command line tools for crushing images of different file types (there seems to be an abundance of them focusing on the PNG format).

Example of these tools are [optipng](http://optipng.sourceforge.net/), [pngcrush](http://pmt.sourceforge.net/pngcrush/) (PNGs), [libjpeg](http://libjpeg.sourceforge.net/) (JPEGs) and [gifsicle](http://www.lcdf.org/gifsicle/) (GIFs).

### Delete Unnecessary Files

After all the manipulation by the build script, there is likely to be a number of files that are no longer needed for the application to function, left in your folder structure. These should be deleted (you still have a copy in your VCS), to save disk space on your server.

### Publish

Again, this might not be a job for the build tool, but it is part of the build process. Once the build has completed, should the generated files be published to the web server, a staging area or just to a new folder on your machine?

### Conclusion

Any good build script should be configurable to allow any of the above to be turned on and off by the developer to allow different builds for different situations (whether its environmental or just the technologies used).

Now we have a list of tasks a build script should accomplish. Do you agree with the list? Is there anything that has been missed off? What tools do you use to accomplish your builds? Share your thoughts in the comments below.

In future posts, I will be delving deeper into a few of the tasks above to show how these tasks could be accomplished.

### References

[HTML5 Boilerplate Build Script wiki page](https://github.com/h5bp/html5-boilerplate/wiki/Build-script)

