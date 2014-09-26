---
title: "On The Web: Google Map Web Component"
date: 2014-08-13
template: post.html
tags:
    - Web Components
    - On The Web
    - Google Maps
---

Web Components are the future of the web or at the very least, look increasing like the future of the web. Components bring a lot of new ways to how we build and structure applications on the web. 

They are built on top of four emerging specifications:-

  * [Custom Elements](http://www.w3.org/TR/custom-elements/)
  * [HTML Imports](http://www.w3.org/TR/html-imports/)
  * [Templates](http://www.w3.org/TR/html-templates/)
  * [Shadow DOM](http://www.w3.org/TR/shadow-dom/)

As further proof to how web components will shape the development of the web in years to come, Google have released a [google-map component](http://googlewebcomponents.github.io/google-map/components/google-map/). It's part of a greater set of web components for Google's API's and services which are currently built on [Polymer](http://www.polymer-project.org/) (Polymer being a framework on top of the web component specifications to enable working with them easier).

So you might be asking, why does a google-map component matter and why is it better than just using Google's Javascript Map API? Well lets have a look at the code for each approach.

For comparison we'll keep the example simple and just load a google map with a latitude and longitude.

### Javascript API

**HTML**

First we need a div container to load the map into.

    <!-- Rest of HTML removed for brevity -->
    <div id="map"></div>

**CSS**

Style the container.

    #map {
        height: 600px;
    }

**Javascript**

Create map object and set latitude and longitude on the map.

    var latLng = new google.maps.LatLng( "37.790", "-122.390" ),
        map = new google.maps.Map( document.getElementById( "map" ), {
            zoom    : 8
            center  : latLng
        });

### Web Component

**HTML**

Import the component and use the component passing in latitude and longitude attributes.

    <!-- Rest of HTML removed for brevity -->
    <!-- Import element -->
    <link rel="import" href="google-map.html">

    <google-map lat="37.790" long="-122.390" zoom="8"></google-map>

**CSS**

Style the component.

    google-map {
        height: 600px;
    }

Fairly simple and concise, right? No Javascript to understand, just plain HTML attributes. The Javascript API is abstracted away into attributes of the components element. The google-map element can be styled and accessed with Javascript like any other element in HTML.

Of course, this simple example using the basic google-map component might not have the full power of the Javascript API out of the box. Fortunately as a polymer element/custom element you can extend the google-map component to include any features from the Javascript API that aren't currently implemented.

This is only a simple example, so check out the [google-map component page](http://googlewebcomponents.github.io/google-map/components/google-map/) for more ways to use the component such as adding markers and to see the power of web components in the future of the web industry.

### References

[google-map component](http://googlewebcomponents.github.io/google-map/components/google-map/)  
[webcomponents.org](http://webcomponents.org/)  
[Polymer and Web Components change everything you know about Web development - Google I/O 2014](https://www.youtube.com/watch?v=8OJ7ih8EE7s)  
