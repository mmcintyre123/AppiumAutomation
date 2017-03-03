"use strict";
let config = require('./config');

// from built.io:
exports.configure = function (driver) {
  // eval(pry.it)
  driver.on('status', function (info) {
    console.log(info.cyan);
  });
  driver.on('command', function (meth, path, data) {
    console.log(' > ' + meth.yellow, path.magenta, data || '');
  });
  driver.on('http', function (meth, path, data) {
    console.log(' > ' + meth.magenta, path.cyan, (data || '').cyan);
  });
};
