---
layout: post
title: HDR Rendering -- WebGL Meetup
author: Angela Wei
date: 2017-09-21
tags: ["Engineering", "Graphics"]
---

![alt text](/assets/blog/floored-scene-screenshot.jpg "Screenshot from Luma")

Lars and I were proud to present at the [meetup](https://www.meetup.com/Khronos-NY-Chapter/events/242447651/) hosted by the Khronos NY Chapter.

Here are the slides we promised:

[Introduction to HDR Rendering](http://www.floored.com/wp-content/uploads/2017/09/Introduction-to-HDR-Rendering.pdf)

[HDR in Luma](http://www.floored.com/wp-content/uploads/2017/09/HDR-in-Luma.pdf)

[and the Demo Scene](https://depot.floored.com/scenes/hdr-webgl-meetup-sept-2018)

Shoutout to [Nick's post in 2013](http://www.floored.com/blog/2015webgl-hdr/) when we already had an HDR engine for lighting! Our presentation fills in some of the newer techniques we've tried in our quest for realism.

For those interested in how the image-based lighting (IBL) we showed is relevant to our scenes: Our indirect lighting is probe-based so any images from probes will act like an "HDR skybox" used to light the scene. That indirect light is in addition to the direct lighting from our point, area, and directional lights (and emission). For instance, the sky is reflected on surfaces because the sky is in our indirect light.

We touched on falling back to all half-float textures on iPad/iPhone. A good example of an effect that requires full float support is our light meter's histogram. On iPad, the histogram was overflowing the half-float values. Our histogram height is usually dependent on the resolution of the frame. Our solution on iPad has been to throttle the number of luminance samples taken from the frame when building the histogram.