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

  exports.first = function (fn) {
    return function (els) {
      let seq = _(els).map(function (el, i) {
        return function () {
          return fn(el, i);
        };
      });
      // iterating
      return seq.reduce(Q.any, new Q()).then(function () {
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
      let this_key = 'houseHold_' + i;
      let this_value = attr;
      store.get('houseHolds')[this_key] = this_value;
    })
  });








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
}

exports.getFirstMatchingButtonName = function getFirstMatchingButtonName(els) {
  // let buttonNames = el.getAttribute('name')
  let promises = [];

  for (let el in els) {
    promises.push(exports.getElementNameAttr(el)); // push promises to array
  }

  return Promise.all(promises).then(function (dataArr) {
    dataArr.forEach(function(data) {
      return eval(require('pryjs').it)
    });
  })
}


// exports.pickFirstNotStarted = function (els) {
//   // let this_value = houseHolds[key];
//   exports.each(function(el, i) {
//     let pr = new Q();
//     return el.getAttribute('name').then(function (attr) {
//       let regexp = /.*notstarted.*/i;
//       // var this_key = 'houseHold_' + i;
//       // var this_value = attr;
//       // store.get('houseHolds')[this_key] = this_value;
//       eval(require('pryjs').it)
//       if (regexp.test(attr)) {
//         config.thisHousehold.push(attr)
//         pr.resolve()
//       } else {
//         // if all elements tested and none match
//         // pr.reject()
//       }
//     })
//   });
//   return pr;
// }

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
                  driver.elementById(attr).click();
                  resolve();
                }
              } else if ((els.length - 1) == i) {
                // if all elements tested and none match
                reject(new Error('Could not find a list item id containing ' + idPart + '.'));
              }

            })
          })(els);
        });
      });
}



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
  
  exports.filterWithNamePart = function (namePart) {
    let regexp = /.* + namePart + .*/i;
    return exports.filter(function (el) {
      return el.getAttribute('name').then(function (name) {
        return regexp.test(name);
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




