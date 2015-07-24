croissant
=========

**A multimedia resource loader with error handling and cancellation.**

It is designed to load videos and images for widely browsers support (desktop and mobile) and with fallback capabilities (user can provides multiple mimetypes and image fallback).

> This library only make sense if you want to programmatically use Image and Video
and be sure they are loaded and ready to be drawn on Canvas or used in WebGL for instance.

> *(if you don't have programmatical use-case you should simply use `<img/>` and `<video/>`).*

## API example

```js
var croissant = require("croissant");

var loader = croissant.loader({
  "video/webm": "cats.webm",
  "video/mp4": "cats.mp4",
  "image/png": "cats.fallback.png"
}, function (resource) {
  // resource can be:
  // { image: imageElement }
  // { video: videoElement }
  console.log("Loaded!", resource);
}, function (e) {
  // e is an Error or an Event
  console.log("Failed:", e);
});

// cancellation(); // Interrupt the loading when called
```

## Decorators

There is currently 2 decorators:

- `timeout(loadFn, duration)`: creates a loader that interrupt loadFn if still not resolved after a duration (in milliseconds).
- `fallbackBlack(loadFn)`: creates an always successful loader that provides a black image in case loadFn failed (1 pixel black image).

### Example

```js
var croissant = require("croissant");

var loaderThatTimeoutAndFallback =
  croissant.fallbackBlack(
    croissant.timeout(
      croissant.loader,
      60000));

// Usage
var cancellation =
  loaderThatTimeoutAndFallback({
    "video/webm": "cats.webm",
    "video/mp4": "cats.mp4",
    "image/png": "cats.fallback.png"
  }, function (resource) {
    // resource can be:
    // { image: imageElement }
    // { video: videoElement }
    console.log(resource);
  });
```
