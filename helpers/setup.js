require( 'colors' );
let wd 			         = require( 'wd' );
let chai                 = require( 'chai' );
let chaiAsPromised       = require( 'chai-as-promised' );
let should               = chai.should();
let expect               = chai.expect;
let assert               = chai.assert;
let actions              = require('./actions');
let commons              = require('./commons');
let promiseUtils         = require('./promise-utils');
chai.config.includeStack = true;
chaiAsPromised.transferPromiseness = wd.transferPromiseness;
chai.use(chaiAsPromised);

wd.addPromiseChainMethod('swipe', actions.swipe);
wd.addPromiseChainMethod('takeScreenshotMethod', actions.takeScreenshotMethod);
wd.addPromiseChainMethod('startTime',commons.startTime);
wd.addPromiseChainMethod('endTotalAndLogTime',commons.endTotalAndLogTime);
wd.addPromiseChainMethod('loginQuick',commons.loginQuick);
wd.addPromiseChainMethod('fullLogin',commons.fullLogin);
wd.addPromiseChainMethod('pry',commons.pry);
wd.addPromiseChainMethod('mute',commons.mute);
wd.addPromiseChainMethod('unmute',commons.unmute);
wd.addPromiseChainMethod('scrollHouseList',commons.scrollHouseList);
wd.addPromiseChainMethod('clickFirstListItemByIdPart',promiseUtils.clickFirstListItemByIdPart);
wd.addPromiseChainMethod('refreshHouseList',commons.refreshHouseList);
wd.addPromiseChainMethod('consoleLog',commons.consoleLog);
wd.addPromiseChainMethod('saveAllNameAttributes',promiseUtils.saveAllNameAttributes);
wd.addPromiseChainMethod('saveFirstNameAttributes',promiseUtils.saveFirstNameAttributes);
wd.addPromiseChainMethod('clickHouseWithMultPrimary',commons.clickHouseWithMultPrimary);
wd.addPromiseChainMethod('surveyAllPrimaryTargets',commons.surveyAllPrimaryTargets);

exports.should = should;
exports.expect = expect;
exports.assert = assert;
exports.chai   = chai;

