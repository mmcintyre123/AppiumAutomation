"use strict";

let wd     = require('wd'),
    Q      = require('q'),
    sizeOf = require('image-size'),
    config = require('./config'),
    fs     = require('fs-extra');
const resizeImg = require('resize-img');


exports.swipe = function (opts) {
  let action = new wd.TouchAction();
  action
    .press({x: opts.startX, y: opts.startY})
    .wait(opts.duration)
    .moveTo({x: opts.endX, y: opts.endY})
    .release();
  return this.performTouchAction(action);
};

exports.pinch = function (el) {
  return Q.all([
    el.getSize(),
    el.getLocation(),
  ]).then(function (res) {
    let size = res[0];
    let loc = res[1];
    let center = {
      x: loc.x + size.width / 2,
      y: loc.y + size.height / 2
    };
    let a1 = new wd.TouchAction(this);
    a1.press({el: el, x: center.x, y: center.y - 100}).moveTo({el: el}).release();
    let a2 = new wd.TouchAction(this);
    a2.press({el: el, x: center.x, y: center.y + 100}).moveTo({el: el}).release();
    let m = new wd.MultiAction(this);
    m.add(a1, a2);
    return m.perform();
  }.bind(this));
};

exports.zoom = function (el) {
  return Q.all([
    this.getWindowSize(),
    this.getLocation(el),
  ]).then(function (res) {
    let size = res[0];
    let loc = res[1];
    let center = {
      x: loc.x + size.width / 2,
      y: loc.y + size.height / 2
    };
    let a1 = new wd.TouchAction(this);
    a1.press({el: el}).moveTo({el: el, x: center.x, y: center.y - 100}).release();
    let a2 = new wd.TouchAction(this);
    a2.press({el: el}).moveTo({el: el, x: center.x, y: center.y + 100}).release();
    let m = new wd.MultiAction(this);
    m.add(a1, a2);
    return m.perform();
  }.bind(this));
};


// Close the stupid keyboard. WOW IOS IS ABSURD!
// exports.hideKeyboard = function() {
//   return driver
//     .elementsByXPath('//UIAApplication[1]/UIAWindow[1]')
//     .then(_p.filterDisplayed).first()
//     .getLocation()
//     .then(function(loc) {
//       return driver
//         .swipe({
//           startX: loc.x,
//           startY: loc.y + 100,
//           endX: loc.x,
//           endY: loc.y + 200,
//           duration: 100
//         });
//     })
// };


exports.takeScreenshotMethod = function(name) {
  return this
    // base64 screeshot
    .takeScreenshot()
    .should.eventually.exist
    // save screenshot to local file
    .then(function() {
      try {
        fs.unlinkSync('screenShots/' + name + '.png');
      } catch (ign) {}
      fs.existsSync('screenShots/' + name + '.png').should.not.be.ok;
    })
    .saveScreenshot('screenShots/' + name + '.png')
    .then(function() {
      fs.existsSync('screenShots/' + name + '.png').should.be.ok;
    })
    // get the dimensions of the screenshot (for shrinking below)
    .then(function () {
      config.dimensions = sizeOf('screenShots/' + name + '.png')
      config.width = config.dimensions['width'] / 2
      config.height = config.dimensions['height'] / 2
    })
    // shrink the image to make it easier to see
    .then(function() {
      resizeImg(fs.readFileSync('screenShots/' + name + '.png'), {
        width: config.width,
        height: config.height
      }).then(buf => {
        fs.writeFileSync('screenShots/' + name + '.png', buf);
      });
    })
};

// todo haven't tested
exports.sendKeysIOS = function(el, keys) {
  return this
    .then(function () {
      return el
        .click()
        .clear()
        .sendKeys(keys)
    })
    .hideKeyboard()
}
