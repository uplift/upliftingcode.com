---
title: "Quick Tip: Editor Config for consistent file formatting"
description: How to use .editorconfig for application style guides
date: 2014-07-26
template: post.html
tags:
    - Quick Tip
    - Text Editors
    - Styleguide
---

Have you ever started on a project or come back to a project that someone else has altered and found the whitespace and file formatting to be all over the place and inconsistent?

This usually results in either having to fix the file format yourself or having a chat with the other developers to keep to a defined style. This relies on the other developers making sure they keep to the style or it being picked up and change in code reviews.

What is needed is a way to tell your text editor how to format the files as you type. This is where [Editorconfig](http://editorconfig.org/) comes in. It's a way to define the formatting styles that your project will use and have your text editor pick it up and set them as defaults. 

There are plugins for the majority of popular text editors, which are shown on the site.

To set your editor config, you need to create a .editorconfig file in the root of your project. An example of a .editorconfig file can be seen below. Check out the [Editorconfig.org](http://editorconfig.org/) website for more details of how to configure it for your projects.

    # EditorConfig is awesome: http://EditorConfig.org
    root = true

    [*]
    insert_final_newline = true
    trim_trailing_whitespace = true
    end_of_line = lf
    indent_style = space
    indent_size = 4
    charset = utf-8

    # Dont trim as spaces at end of line is line break
    [*.md]
    trim_trailing_whitespace = false

I won't even get into discussions about tabs versus spaces and 2 spaces versus 4 spaces. Set your own standard for your team and change the values accordingly. The important thing is that you set a standard!

### References

[Editorconfig.org](http://editorconfig.org/)  
