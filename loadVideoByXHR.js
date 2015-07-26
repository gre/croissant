var loadVideoStandard = require("./loadVideoStandard");

var video = document.createElement("video");

function supported () {
  return typeof URL !== "undefined" &&
    URL.createObjectURL &&
    video.canPlayType &&
    navigator.userAgent.indexOf("Android")===-1 && //... https://code.google.com/p/chromium/issues/detail?id=253465
    (function () {
      try {
        var xhr = new XMLHttpRequest();
        xhr.responseType = "blob"; // IE throws here...
        return true;
      }
      catch (e) {
        return false;
      }
    }());
}

function determineBestVideo (videos) {
  var choices = [];
  for (var k in videos) {
    if (k === "video") {
      choices.push([ k, -1 ]);
    }
    else {
      var canplay = video.canPlayType(k);
      if (canplay) {
        if (canplay === "probably") {
          choices.push([ k, 10 ]);
        }
        else {
          choices.push([ k, 1 ]);
        }
      }
    }
  }
  choices.sort(function (a, b) {
    return b[1] - a[1];
  });

  if (choices.length === 0) return;
  var mime = choices[0][0];

  return {
    mime: mime,
    url: videos[mime]
  };
}

/**
 * This technique allows to be sure a video is fully loaded
 */
function load (videos, success, failure) {
  var toLoad = determineBestVideo(videos);
  if (!toLoad) {
    failure(new Error("No video mimetype match requirements."));
    return function () {};
  }

  var xhr = new XMLHttpRequest();
  var current = function () {
    xhr.abort();
  };

  xhr.responseType = "blob";
  xhr.onreadystatechange = function () {
    if(this.readyState === this.DONE) {
      if (this.status === 200) {
        var descr = {};
        descr[toLoad.mime] = URL.createObjectURL(xhr.response);
        current = loadVideoStandard(descr, success, failure);
      }
      else {
        failure(new Error("XHR Failed: "+this.status+" "+this.statusText));
      }
    }
  };
  xhr.open("GET", toLoad.url);
  xhr.send();

  return function () {
    if (current) {
      current();
      current = null;
    }
  };
}

load.supported = supported;

module.exports = load;
