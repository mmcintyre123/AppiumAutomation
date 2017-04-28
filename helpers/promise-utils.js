"use strict";

let Q = require('q');
let _ = require('underscore');
let store = require('../helpers/store');
let config = require('../helpers/config');
let commons = require('../helpers/commons')
let driver = config.driver;

exports.each = function (fn) {
  return function (els) {
    let seq = _(els).map(function (el, i) {
      return function () {
        return fn(el, i);
      };
    });
    // iterating
    return seq.reduce(Q.when, new Q()).then(function () {
      return els;
    });
  };
};

exports.filter = function (fn) {
  return function (els) {
    let seq = _(els).map(function (el, i) {
      return function (filteredEls) {
        return fn(el, i).then(function (isOk) {
          if (isOk) filteredEls.push(el);
          return filteredEls;
        });
      };
    });
    // iterating
    return seq.reduce(Q.when, new Q([]));
  };
};
  
exports.printNames = exports.each(function (el, i) {
  return el.getAttribute('name').print(i + "--> ");
});



exports.saveAllNameAttributes = function (idLike, array_name, regexp) {
  config[array_name] = [];
  return exports.each(function(el, i) {
    return el.getAttribute('name').then(function (attr) {

      if (regexp == undefined) {regexp = new RegExp('.*' + idLike + '.*', 'i');}

      if (regexp.test(attr)) {
        config[array_name].push(attr);
      }

    });
  });
};


exports.saveMenuButtonNames = exports.each(function(el, i) {
  return el.getAttribute('name').then(function (attr) {
    let this_key = 'menuButton_' + i;
    let this_value = attr;
    store.get('menuButtons')[this_key] = this_value;
  })
});


exports.getElementNameAttr = function getElementNameAttr(el) {
  return new Promise(function(resolve, reject) {
    return el.getAttribute('name')
  });
};

exports.clickFirstListItemByIdPart = function (idPart) {
  return driver
    .elementByClassName('XCUIElementTypeTable')
    .elementsByClassName('>','XCUIElementTypeCell')
    .then(function (els) {

        return Q.Promise(function(resolve, reject, notify) {
          let promises = exports.each(function(el, i) {
          
            return el.getAttribute('name').then(function (attr) {

              let regexp = new RegExp('.*' + idPart + '.*', 'i');
              let regexpIsHouse = new RegExp('.*cellHouse.*', 'i')

              if (regexp.test(attr)) {
                if (regexpIsHouse.test(attr)) { // for walkbook house list

                  config.thisHousehold = attr;
                  config.houseNum = Number(attr.match(/\d+/)[0]) + 1;

                  return driver
                    .scrollHouseList(config.houseNum)
                    .elementById(attr)
                    .click()
                    .then(function () {
                      resolve();
                    })

                } else {
                  return driver
                    .elementById(attr)
                    .click()
                    .then(function () {
                      resolve();
                    })
                }
              } else if ((els.length - 1) == i) {
                // if all elements tested and none match
                reject(new Error('Could not find a list item id containing ' + idPart + '.'));
              }
            })
          })(els);
        });
      });
};


exports.filterDisplayed = exports.filter(function (el) {
  return el.isDisplayed();
});

exports.filterWithName = function (name) {
  return exports.filter(function (el) {
    return el.getAttribute('name').then(function (_name) {
      return _name === name;
    });
  });
};

exports.filterWithNamePart = function (namePart) {
  let regexp = /.* + namePart + .*/i;
  return exports.filter(function (el) {
    return el.getAttribute('name').then(function (name) {
      return regexp.test(name);
    });
  });
};

