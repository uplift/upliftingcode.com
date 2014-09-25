---
title: "Using CSS border-box to create better layouts"
date: 2013-06-12
template: post.html
tags:
    - CSS
    - Border Box
---

When doing layouts in CSS, all developers eventually come across something called the ["box model"](http://en.wikipedia.org/wiki/Internet_Explorer_box_model_bug#Background). When first starting out, most assume that setting the width of an element in CSS will mean the visible element on screen will be the set width.

**Unfortunately this is not the case!** The width of the visible element on screen is actually **width + padding + border**. The exact same rules apply to the height of the element too. 

Over time this is something all developers get use to (like many other quirks) but it can be very annoying when defining layouts and grid systems where you want your columns to be a certain width and not auto expand when you add padding and border values for design.  

Is there any way around this? If there wasn't, it would make for a very short article. In fact in CSS3 there is a property called box-sizing. The box-sizing property tells the browser what type of box model to use for an element. The box-sizing property has three main values (not including inherit). By default all elements use the box model described above, which is called content-box.

What is needed is the value border-box. This value makes the width of an element equal to the set width and includes the padding and border values inside of the element instead of outside in content-box.

So thats ideal right for our layout and grid systems. It has even got Google Chrome Developer Advocate [Paul Irish](https://twitter.com/paul_irish) suggesting to use it on all elements with the below code.

    /* apply a natural box layout model to all elements */
    *, *:before, *:after {
        -moz-box-sizing: border-box;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
    }

Certainly makes developing web pages more intuitive!

<div class="alert alert-info">**Note:** Surprisingly the border-box behaviour is how Internet Explorer 6 under quirks mode behaves.</div>

### References

[box-sizing MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/box-sizing)  
[* { Box-sizing: Border-box } FTW by Paul irish](http://www.paulirish.com/2012/box-sizing-border-box-ftw/)  
[Box Sizing by CSS Tricks](http://css-tricks.com/box-sizing/)  
[Internet Explorer box model bug Background](http://en.wikipedia.org/wiki/Internet_Explorer_box_model_bug#Background)  
[Can I Use Box-sizing](http://caniuse.com/css3-boxsizing)  
