"use strict";

let Q = require('q');
let _ = require('underscore');
let store = require('../helpers/store');
let config = require('../helpers/config');
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

// works:
exports.saveHouseNames = exports.each(function(el, i) {
  return el.getAttribute('name').then(function (attr) {
    var this_key = 'houseHold_' + i;
    var this_value = attr;
    store.get('houseHolds')[this_key] = this_value;
  })
});

// creating a function to pick the first "not started" household without saving the whole list.
// exports.pickFirstNotStarted = function () {
//   return driver
//     .elementByClassName('XCUIElementTypeTable')
//     .elementsByClassName('>','XCUIElementTypeCell')
//     .then(function (els) {
//       for(var el of els) {
//         el.getAttribute('name').then(function (attr) {
//           config.this_house = attr;
//         })
//         eval(require('pryjs').it)
//         console.log('attr is: ' + config.this_house);
//         var regexp = /.*notstarted.*/i;
//         if (regexp.test(config.this_house) === true) {
//           console.log('Using ' + this_house)
//           eval(require('pryjs').it)
//           return driver
//             .elementById(this_house)
//             .click()
//         }
//       }
//     })
// }


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


//todo figure this out
exports.clickWithIdPart = function (idpart, els) {
  // should take part of id, search array of els passed in, and return the one that matches.
  els.forEach( function(el, i) {
    if (el.match(idpart)) {
      return el;
    }
  return driver
    .click()
  });
};




