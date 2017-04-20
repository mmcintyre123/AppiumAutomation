"use strict";

module.exports = function () {

	require('colors');
	let wd            = require("wd");
	let assert  	  = require('assert');
	let	_             = require('underscore');
	let	Q             = require('q');
	let	fsExtra       = require('fs-extra');
	let	fs            = require('fs');
	let	_p            = require('../helpers/promise-utils');
	let	elements      = require('../helpers/elements');
	let	actions       = require('../helpers/actions');
	let store    	  = require('../helpers/store');
	let	pry  		  = require('pryjs');
	let	config 		  = require('../helpers/config');
	let	serverConfigs = require('../helpers/appium-servers');
	let	serverConfig  = process.env.SAUCE ? serverConfigs.sauce : serverConfigs.local;
	let	args  		  = process.argv.slice( 2 );
	let	simulator     = false;
	let	desired;
	let driver = config.driver;
	let	commons = require('../helpers/commons'); // this must be after the desired and driver are set


	describe("Test all icon colors", function() {

			this.timeout(3000000);
			let allPassed = true;
			console.log(('RUNNING ' + __filename.slice(__dirname.length + 1) + ' for android').green.bold.underline);


		it('Should perform a full login', function () {
			return driver
				.fullLogin()
		});

		it.only('Should login quick', function () {
			return driver
				.loginQuick()
		});

		// passing 4-20-17 4:30pm
		it.only('Should go to household page', function () {
			return driver
				.elementById(elements.homeScreen.walkbooks)
				.click()
				.waitForElementById(elements.surveys.survey1, 10000)
				.elementById('DO NOT USE: Mobile Automation Survey 1.0')
				.click()
				.waitForElementById(elements.survey.start, 10000) 
				.elementById(elements.survey.start)
				.click() // not working
				.waitForElementById('Walkbook 201', 10000)
			    .click()
			    .waitForElementById(elements.survey.popoverOpenBook, 10000)
			    .click()
			    .waitForElementByClassName('XCUIElementTypeTable', 10000)
			    // .elementByXPath(elements.walkbook.houseHold10)
			    // .getLocation()
			    // .then(function(loc){
			    // 	 return driver
			    // 		.swipe({
			    // 			startX: loc.x,
			    // 			startY: loc.y,
			    // 			offsetX: 0,
			    // 			offsetY: -550,
			    // 		})
			    // }) // scrolls down a full screen
		});

		// passing 4-20-17 1:30pm
		it('Should turn the house blue: one primary target not home', function () {
			console.log('Should turn the house blue: one primary target not home'.green.bold.underline);
			store.set('houseHolds', {});

			// Survey: DO NOT USE: Mobile Automation Survey 1.0

			return driver
				.startTime('Home Page to Household')
				.elementById(elements.homeScreen.walkbooks)
				.click()
				.startTime('Load Survey List')
				.waitForElementById(elements.surveys.survey1, 10000)
				.endTotalAndLogTime('Load Survey List')
				.elementById('DO NOT USE: Mobile Automation Survey 1.0')
				.click()
				.waitForElementById(elements.survey.start, 10000)
				.sleep(1000)
				.elementById(elements.survey.start)
				.click()
				.startTime('Load Survey')
				.waitForElementById('Select Walkbook', 13000)
			    .endTotalAndLogTime('Load Survey')
			    .elementByXPath(elements.survey.walkbook1)
			    .click()
			    .waitForElementById(elements.survey.popoverOpenBook, 13000)
			    .elementById(elements.survey.popoverOpenBook)
			    .click()
			    .startTime('Load Walkbook')
			    .waitForElementByClassName('XCUIElementTypeTable', 13000)
			    // save household IDs:
			    .elementByClassName('XCUIElementTypeTable')
			    .elementsByClassName('>','XCUIElementTypeCell')
			    .then(_p.saveHouseNames)
			    // pick the first notstarted household then continue - handles scrolling assuming 25 households to a walkbook - todo make this 20 in the future:
			    .then(function () {

			    	let houseHolds = store.get('houseHolds');

			    	for (let key in houseHolds) {

			    		let regexp = /.*notstarted.*/i;
			    		let this_value = houseHolds[key];
			    		
			    		if (regexp.test(this_value) === true) {

			    			console.log('Using ' + houseHolds[key]);
			    			let thisHousehold = this_value;
			    			let thisHouseholdAfter = this_value.replace('notstarted','attempted');
			    			let houseNum = Number(thisHousehold.match(/\d+/)[0]) + 1;

			    			return driver
			    				.scrollHouseList(houseNum) // custom method
    					    	.elementById(thisHousehold)
    					    	.click()
    							.waitForElementById(elements.walkbook.popoverOpenHouse, 10000)
    							.elementById(elements.walkbook.popoverOpenHouse)
    							.click()
    							.waitForElementById(elements.houseHold.notHome, 10000)
    							.endTotalAndLogTime('Home Page to Household')
    							.elementById(elements.houseHold.primTarget1)
    							.click()
    							.waitForElementById(elements.target.takeSurvey, 10000)
    							.elementById(elements.target.notHome)
    							.click()
    							.waitForElementById(elements.houseHold.finished, 10000)
    							.click()
    							.waitForElementById(thisHouseholdAfter, 10000) // verify the house is blue
    							.then(function () {
    								houseHolds[key] = thisHouseholdAfter;
    							}) // if previous passes, set the value in store to the new value.
				    			break;
			    		}
			    	}
			    })
		});

		// passing 4-20-17 4:30pm
		it('Should turn the house blue: household not home', function () {
			console.log('Should turn the house blue: household not home'.green.bold.underline);
			store.set('houseHolds', {});

			// Survey: DO NOT USE: Mobile Automation Survey 1.0

			return driver
				// save household IDs:
				.elementByClassName('XCUIElementTypeTable')
				.elementsByClassName('>','XCUIElementTypeCell')
				.then(_p.saveHouseNames)
				.execute('mobile: scroll', {direction: 'up'}) // ensure at the top
				.then(function () {

			    	let houseHolds = store.get('houseHolds');

				    // pick the first notstarted household then continue
			    	for (let key in houseHolds) {

			    		let regexp = /.*notstarted.*/i;
			    		let this_value = houseHolds[key];

			    		if (regexp.test(this_value) === true) {

			    			console.log('Using ' + houseHolds[key]);
			    			let thisHousehold = this_value;
			    			let thisHouseholdAfter = this_value.replace('notstarted','attempted');
			    			let houseNum = Number(thisHousehold.match(/\d+/)[0]) + 1;

					    	return driver
					    		.scrollHouseList(houseNum)
						    	.elementById(thisHousehold)
						    	.click()
								.waitForElementById(elements.walkbook.popoverOpenHouse, 10000)
								.elementById(elements.walkbook.popoverOpenHouse)
								.click()
								.waitForElementById(elements.houseHold.notHome, 10000)
								.elementById(elements.houseHold.notHome)
								.click()
								.waitForElementByClassName('XCUIElementTypeTable', 10000) // wait for the house list
								.waitForElementById(thisHouseholdAfter, 10000) // verify house is blue
								.then(function () {
									houseHolds[key] = thisHouseholdAfter;
								}) // if previous passes, set the value in store to the new value.
			    			break;
						}
					}
				})
		});

//************************************************//
// CHANGES IN ANDROID


// lah dee dah more work in Android - this should stay
//************************************************//

		// passing 4-20-17 4:30pm
		it.only('Should turn the house from blue to red: restricted access household', function () {
			console.log('Should turn the house blue: restricted access household'.green.bold.underline);
				store.set('houseHolds', {});

			// Survey: DO NOT USE: Mobile Automation Survey 1.0

			return driver
				// save household IDs:
				.elementByClassName('XCUIElementTypeTable')
				.elementsByClassName('>','XCUIElementTypeCell')
				.then(_p.saveHouseNames)
				.execute('mobile: scroll', {direction: 'up'}) // ensure at the top
				.then(function () {

			    	let houseHolds = store.get('houseHolds');

				    // pick the first attempted household then continue
			    	for (let key in houseHolds) {

			    		let regexp = /.*attempted.*/i;
			    		let this_value = houseHolds[key];

			    		if (regexp.test(this_value) === true) {

			    			console.log('Using ' + houseHolds[key]);
			    			let thisHousehold = this_value;
			    			let thisHouseholdAfter = this_value.replace('attempted','reject');
			    			let houseNum = Number(thisHousehold.match(/\d+/)[0]) + 1;

					    	return driver
					    		.scrollHouseList(houseNum)
						    	.elementById(thisHousehold)
						    	.click()
								.waitForElementById(elements.walkbook.popoverOpenHouse, 10000)
								.elementById(elements.walkbook.popoverOpenHouse)
								.click()
								.waitForElementById(elements.houseHold.restricted, 10000)
								.click()
								.waitForElementByClassName('XCUIElementTypeTable', 10000) // wait for the house list
								.waitForElementById(thisHouseholdAfter, 10000) // verify house is blue
								.then(function () {
									houseHolds[key] = thisHouseholdAfter;
								}) // if previous passes, set the value in store to the new value.
			    			break;
						}
					}
				})
		});

//************************************************//
// CHANGES IN ANDROID

//lah dee dah more work in Android - this should stay
//************************************************//


Here are a bunch of changes in ios.
=======

Here are a bunch of changes in ios.

Here is some new work in ios.  

New tests, etc.

This should stay, no android should appear, and these should move to Android after merging.
>>>>>>> ios


//		it('Should turn the house blue: xxxxxxxxxxx', function () {
//			console.log('Should turn the house blue: xxxxxxxxxxx'.green.bold.underline);
//
//			// xxxxxxxxx turns house blue
//			// Survey: DO NOT USE: Mobile Automation Survey 1.0
//
//			return driver
//
//
//		});
//		it('Should turn the house blue: xxxxxxxxxxx', function () {
//			console.log('Should turn the house blue: xxxxxxxxxxx'.green.bold.underline);
//
//			// xxxxxxxxx turns house blue
//			// Survey: DO NOT USE: Mobile Automation Survey 1.0
//
//			return driver
//
//
//		});
	});
};