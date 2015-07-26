var loadVideoByXHR = require("./loadVideoByXHR");
var loadVideoStandard = require("./loadVideoStandard");

if (!loadVideoByXHR.supported()) {
  module.exports = loadVideoStandard;
}
else {
  module.exports = function (descr, success, failure) {
    var current = loadVideoByXHR(descr, success, function () {
      current = loadVideoStandard(descr, success, failure);
    });
    return function () {
      current();
    };
  };
}
