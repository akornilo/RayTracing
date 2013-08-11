RayTracing on html5 canvas!
===========================

This library enables ray-tracing directly on a canvas element. If you don't know what ray tracing is, here is a link to the wiki http://en.wikipedia.org/wiki/Ray_tracing_(graphics).

To start you will need to include finalVector.js, this is a concatenated version of the other files in this repo; a minified version is yet to come. You need to create an instance of a Ray, and pass it the canvas. Next you can add objects (currently only balls and planes are supported) or move the light source and the eye. 

Check out index.html for a small example.

You can add new types of objects to the scene, if you do so, you will need to define a collision and normal vector method, see Thing.js for an example.
