---
title: "Quick Tip: Centre two or more points on a Google map"
description: Quick tip of how to display one or more points on a google map
date: 2013-04-18
template: post.html
tags:
    - Google Maps
    - Javascript
    - Quick Tip
---

When you have one Latitude/Longitude (LatLng) point on a map, it is easy to centre the map on that point by setting the center property of the map options or calling the setCenter function of the map object with the point.  

    // Create LatLng point
    var latLngOne = new google.maps.LatLng( "51.5072", "0.1275" ),
        // Create map with point as centre while setting the zoom level
        map = new google.maps.Map( document.getElementById( "map" ), {
            zoom    : 8
            center  : latLngOne
        });

The above code, centres a map on a single point in London.  What if you wish to set the centre of the map to show more than one point though? The center property and setCenter function only take one LatLng point. So how can you calculate the LatLng centre of two or more random points so the map is centred and has to correct zoom level to show all the points?

To do this, you have to create an instances of a LatLngBounds. A bounds works by calculating an area that encompasses the points you pass to it.  You can then pass the bounds getCenter function to the center property of the map options.

    // Create LatLng points
    var latLngOne = new google.maps.LatLng( "51.5072", "0.1275" ),
        latLngTwo = new google.maps.LatLng( "51.751724", "-1.255284" ),
        // Create instance of LatLngBounds
        latLngBounds = new google.maps.LatLngBounds();

    // Extend bounds with LatLng point - could also put points in an array and loop over calling extend on each one
    latLngBounds.extend( latLngOne );
    latLngBounds.extend( latLngTwo );

    // Create map using getCenter function of LatLngBounds instance as the LatLng point for the centre property
    var map = new google.maps.Map( document.getElementById( "map" ), {
        center  : latLngBounds.getCenter()
    });

    // Pass bounds to map function fitBounds so map shows the area covered by the bounds
    map.fitBounds( latLngBounds );

### References

[Google Maps Javascript API v3](https://developers.google.com/maps/documentation/javascript/)  
