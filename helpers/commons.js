'use strict';

require('colors');
require('./setup');
let wd 	  	  =  require('wd');
let fs        =  require('fs');
let fsExtra   =  require('fs-extra');
let assert    =  require('assert');
let config    =  require('./config');
let store     =  require('./Store');
let pry       =  require('pryjs');
let elements  =  require('./elements');
let driver    =  config.driver;

// todo this.os doesn't seem to be working.
function Commons () {
	this.os      = config.desired.platformName;
	this.version = config.desired.platformVersion;
};

// **************************************** \\
//    			CONFIG METHODS              \\
// **************************************** \\

/*
var stdout_write = process.stdout.write;
var stderr_write = process.stderr.write;

Commons.prototype.mute = function mute() {
    process.stderr.write = process.stdout.write = function(chunk, encoding, callback) {
        callback();
    };
};

Commons.prototype.unmute = function unmute() {
    process.stdout.write = stdout_write;
    process.stderr.write = stderr_write;
};
*/

let convertDate = function(ms) {
	//this is not used for anything that you will need! it is used for logging date/time and already set up
	let total = parseInt(ms);

	let hours = Math.floor(total / 3600000);
	total = total - (hours * 3600000);

	let minutes = Math.floor(total / 60000);
	total = total - (minutes * 60000);

	let seconds = Math.floor(total / 1000);
	total = total - (seconds * 1000);

	return {hrs: hours, mins: minutes, seconds: seconds, ms: total };
};

// todo this.os doesn't seem to be working.
Commons.prototype.isAndroid = function() {

	if (this.os == 'Android') {
		return true;
	}
	return false;
};

Commons.prototype.isAndroid6 = function() {

	if (this.os == 'Android' && this.version == '6.0') {
		return true;
	}
	return false;
};

Commons.prototype.isIOS = function() {

	if (this.os == 'iOS') {
		return true;
	}
	return false;
};

Commons.prototype.pry = function(){
	eval(pry.it);
};

Commons.prototype.beforeAll = function(){

	before(function() {

		let elements = config.elements;
		let desired  = config.desired;

		require("./logging").configure(driver);

		// this.os isn't working for some reason.  todo may need to update to account for iOS sim.
		if (process.platform == 'win32') {
			desired.app = require("./apps").androidDeviceAppW;
		} else if (process.env._system_name == 'OSX' && config.desired.platformName == 'Android') {
			desired.app = require("./apps").androidDeviceApp;
		} else if (config.desired.platformName == 'iOS' && config.sim == false) {
			desired.app = require("./apps").iosDeviceApp;
		} else if (config.desired.platformName == 'iOS' && config.sim == true) {
			desired.app = require("./apps").iosSimApp;
		} else {
			throw "Commons beforeAll couldn't match device, environment, and args to available apps."
		}

		if (process.env.SAUCE) {
			desired.name = 'Automation Code';
			desired.tags = ['sample'];
		}
		fsExtra.removeSync('./screenShots')
		fsExtra.mkdirs('./screenShots')
		fsExtra.removeSync('./loadTimeLogs') // to clear out the load time file if necessary
		fsExtra.mkdirs('./loadTimeLogs')

		// Open writeStream for logTime file using current local time
		require('moment-timezone')
		let moment = require('moment');
		let timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
		let time = moment().tz(timezone).format();
		let myCurrentTime = time.slice(11,19).replace(/:/g,'_');

		// Current date
		let month = (new Date().getMonth() + 1);
		let day = new Date().getDate();
		let year = new Date().getFullYear();

		// Local DateTime
		config.myDateTime = (month + '_' + day + '_' + year + '_' + myCurrentTime);
		config.wStreamLogTimeFile = fs.createWriteStream( 'loadTimeLogs/loadTimesLog_' +
														  config.myDateTime + '.txt' )
		config.logTimes = {} // this is where user-defined
		return driver.init(desired)
	});
};

Commons.prototype.afterAll = function(){

	after(function() {

		config.wStreamLogTimeFile.end();
		return driver
			.sleep(1005)
			.quit()
			.finally(function() {
				if (process.env.SAUCE) {
					return driver.sauceJobStatus(allPassed);
				}
			});
	});
};

Commons.prototype.afterEach = function(){
	afterEach(function() {
		// let allPassed = allPassed && this.currentTest.state === 'passed';
		if (this.currentTest.state !== 'passed') {
			let thisTest = this.currentTest.title;
			return driver
				.takeScreenshotMethod(thisTest);
		  }
    });
};

// Basic flow for writing files:
// let wstream = fs.createWriteStream('myOutput.txt');
// wstream.write('Hello world!\n');
// wstream.write('Another line\n');
// wstream.end();
Commons.prototype.startTime = function(startName){
	let startTime = new Date().getTime();
	config.logTimes[startName] = startTime;
};

Commons.prototype.endTotalAndLogTime = function(startName){
	let endTime     = new Date().getTime();
	let startTime   = config.logTimes[startName];
	let totalTime   = convertDate((endTime - startTime));
	let logTimeText = (startName      	 + ': '          +
							 totalTime.hrs     + ' hours, '    +
							 totalTime.mins    + ' minutes, '  +
							 totalTime.seconds + '.'           +
							 totalTime.ms      + ' seconds.');
	console.log(logTimeText)
	config.wStreamLogTimeFile.write(logTimeText + '\n');
};





// **************************************** \\
// 			GENERAL TEST METHODS 		    \\
// **************************************** \\

Commons.prototype.loginQuick = function(){
	console.log('LOGIN QUICK'.green.bold.underline);
	return driver
		.elementById(elements.loginLogout.logIn) // LogIn Button
		.click()
		.startTime('Log In')
		.waitForElementById(elements.homeScreen.walkbooks, 10000).should.eventually.exist
		.endTotalAndLogTime('Log In')
};

// todo press "Allow" button
Commons.prototype.fullLogin = function(){
	console.log('FULL LOGIN'.green.bold.underline);
	return driver
		.sleep(2000)
		.then(function () {
			if (driver.elementByClassNameIfExists('XCUIElementTypeAlert')) {
				driver.acceptAlert()
			} else {
				return driver
			}
		})
		.waitForElementById('etLoginUsername') // UserName
			.clear()
			.sendKeys('test_1654wseward')
		.hideKeyboard()
		.elementById('etPassword') // password
			.clear()
			.sendKeys('asdf')
		.hideKeyboard()
		.sleep(500)
		// Click away if we're in iOS:
		.then(function () {
			if(config.desired.platformName == 'iOS') {
				return driver
					.elementByClassName('XCUIElementTypeImage')
					.click()
			}
		})
		// check if "remember me" is already checked.
		.then(function () {
			if (config.desired.platformName == 'Android') {
				return driver
						     .elementById(elements.loginLogout.rememberMe)
						     .getAttribute('checked')
			} else if (config.desired.platformName == 'iOS') {
				return driver
						     .elementById(elements.loginLogout.rememberMe)
						     .getAttribute('value')
			}
		})
		.then(function (attr) {
			if (attr == false || attr == 'false') { // if remember me not checked do:
				return driver
						     .elementById(elements.loginLogout.rememberMe)
						     .click()
			}
		})
		.elementById('btnLogin') // LogIn Button
		.click()
		.startTime('Log In')
		// will be different depending on whether the user has multiple orgs:
		.waitForElementById(elements.homeScreen.walkbooks, 10000).should.eventually.exist
		.endTotalAndLogTime('Log In')
};

Commons.prototype.clickAndClose = function(scope, elemArray){
	while (elemArray.length) {
		let currentPage = elemArray.shift()
		config.alreadyHome = false
		scope = scope.elementById(currentPage)
			.click()
			.startTime(currentPage + ' load time')
			.then(function () {
				if (config.desired.platformName == 'Android'){
					return driver
								 .waitForElementById('up').should.eventually.exist
				} else {
					return driver
								 .waitForElementById('Close').should.eventually.exist
				}
			})
			.endTotalAndLogTime(currentPage + ' load time')
			.then(function (scope) {
				//check for message popups in Android:
				if (config.desired.platformName == 'Android') {
					if (currentPage == elements.homeScreen.voterCheckIn) {
						if (driver.elementById('message')) {
							driver
								  .elementById('message')
								  .source()
								  .then(function (source) {
								  	source.should.include('No precincts are assigned.')
								  })
								  .elementById('button1') // ok button
								  .click();
							config.alreadyHome = true;
						} else {
							return
						}
					} else if (currentPage == elements.homeScreen.eventCheckIn) {
						if (driver.elementById('message')) {
							driver
								  .elementById('message')
								  .source()
								  .then(function (source) {
								  	source.should.include('No events are assigned.')
								  })
								  .elementById('button1') // ok button
								  .click();
							config.alreadyHome = true;
						}
					} else if (config.alreadyHome == false) {
						driver
							  .elementById('up')
							  .click();
					}
				} else if (config.desired.platformName == 'iOS') {
					driver
						  .elementById('Close')
						  .click();
				} else {
					throw new Error('Did not recognize the operating system.')
				}
			})
			.sleep(750);
	}
	return scope;
};

Commons.prototype.scrollHouseList = function(houseNum) {
	// If all the houses in the inital view are used, scroll down:

	if (houseNum > 10 && houseNum <= 20) {
		return driver
			// .execute('mobile: scroll', {direction: 'up'}) // ensure at the top
			.elementByXPath(elements.walkbook.houseHold10)
			.getLocation()
			.then(function(loc){
				 return driver
					.swipe({
						startX: loc.x,
						startY: loc.y,
						offsetX: 0,
						offsetY: -550,
					})
			}) // scrolls down a full screen
	} else if (houseNum > 20 && houseNum <= 30) {
		return driver
			// .execute('mobile: scroll', {direction: 'up'}) // ensure at the top
			.elementByXPath(elements.walkbook.houseHold10)
			.getLocation()
			.then(function(loc){
				 return driver
					.swipe({
						startX: loc.x,
						startY: loc.y,
						offsetX: 0,
						offsetY: -1100,
					})
			}) // scrolls down a full 2 screens
	} else if (houseNum > 30 && houseNum <= 40) {
		return driver
			// .execute('mobile: scroll', {direction: 'up'}) // ensure at the top
			.elementByXPath(elements.walkbook.houseHold10)
			.getLocation()
			.then(function(loc){
				 return driver
					.swipe({
						startX: loc.x,
						startY: loc.y,
						offsetX: 0,
						offsetY: -1650,
					})
			}) // scrolls down a full 3 screens
	} else if (houseNum > 40) {
		console.log('Don\'t use such large Walkbooks!'.red.bold.underline)
		return driver
			.execute('mobile: scroll', {direction: 'down'}) // scrolls to bottom
	}
};


module.exports = new Commons();
