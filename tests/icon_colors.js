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
			console.log(('RUNNING ' + __filename.slice(__dirname.length + 1) + ' for iOS').green.bold.underline);


		it('Should perform a full login', function () {
			return driver
				.fullLogin()
		});

		it.only('Should login quick', function () {
			return driver
				.loginQuick()
		});

		it.only('Should turn the house blue: one primary target not home', function () {
			console.log('Should turn the house blue: one primary target not home'.green.bold.underline);
			store.set('houseHolds', {})
			// Not home 1 primary target turns house blue
			// Survey: DO NOT USE: Mobile Automation Survey 1.0
			return driver
				// .startTime('Home Page to Household')
				.elementById(elements.homeScreen.walkbooks)
				.click()
				// .startTime('Load Survey List')
				.waitForElementById(elements.surveys.survey1, 10000)
				// .endTotalAndLogTime('Load Survey List')
				.elementById('DO NOT USE: Mobile Automation Survey 1.0')
				.click()
				.waitForElementById(elements.survey.start, 10000)
				.sleep(1000)
				.elementById(elements.survey.start)
				.click()
				// .startTime('Load Survey')
				.waitForElementById('Select Walkbook', 13000)
			    // .endTotalAndLogTime('Load Survey')
			    .elementByXPath(elements.survey.walkbook1)
			    .click()
			    .waitForElementById(elements.survey.popoverOpenBook, 13000)
			    .elementById(elements.survey.popoverOpenBook)
			    .click()
			    // .startTime('Load Walkbook')
			    .waitForElementByClassName('XCUIElementTypeTable', 13000)
			    // save household IDs:
			    .elementByClassName('XCUIElementTypeTable')
			    .elementsByClassName('>','XCUIElementTypeCell')
			    .then(_p.saveHouseNames)
			    // pick the first notstarted household then continue:
			    .then(function () {
			    	var houseHolds = store.get('houseHolds');
			    	// eval(require('pryjs').it)
			    	for (var key in houseHolds){
			    		var regexp = /.*notstarted.*/i;
			    		var this_value = houseHolds[key];
			    		if (regexp.test(this_value) === true) {
			    			console.log('Using ' + houseHolds[key]);
			    			config.thisHousehold = this_value;
			    			config.thisHouseholdAfter = this_value.replace('notstarted','attempted');
			    			let houseNum = Number(this_value.match(/\d+/)[0])
			    			// If all the houses in the inital view are used, scroll down:
			    			if (houseNum > 9) {
			    				return driver
				    				.execute('mobile: scroll', {direction: 'down'}) // scrolls to bottom
			    					.elementByXPath(elements.walkbook.houseHold20) // hopefully in view todo, make this more programmatic
			    					.getLocation()
			    					.then(function(loc){
			    						 return driver
			    							.swipe({
			    								startX: loc.x,
			    								startY: loc.y,
			    								endX: loc.x,
			    								endY: loc.y + 200,
			    								duration: 300
			    							})
			    					}) // scrolls back up a little
	    					    	.elementById(config.thisHousehold)
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
	    							.waitForElementById(elements.houseHold.finished)
	    							.click()
	    							.waitForElementById(config.thisHouseholdAfter) // verify the house is blue
	    							.then(function () {
	    								houseHolds[key] = config.thisHouseholdAfter;
	    							}) // if previous passes, set the value in store to the new value.
			    			} else {
						    	return driver
							    	.elementById(config.thisHousehold)
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
									.waitForElementById(elements.houseHold.finished)
									.click()
									.waitForElementById(config.thisHouseholdAfter) // verify the house is blue
									.then(function () {
										houseHolds[key] = config.thisHouseholdAfter;
									}) // if previous passes, set the value in store to the new value.
				    			break;
			    			}
			    		}
			    	}
			    })
		});

		it.only('Should turn the house blue: household not home', function () {
			console.log('Should turn the house blue: household not home'.green.bold.underline);
			store.set('houseHolds', {})
			// Not home household turns house blue
			// Survey: DO NOT USE: Mobile Automation Survey 1.0

	    	var houseHolds = store.get('houseHolds');
    		var regexp = /.*notstarted.*/i;
    		var this_value = houseHolds[key];

		    // pick the first notstarted household then continue
	    	for (var key in houseHolds) {
	    		if (regexp.test(this_value) === true) {
	    			console.log('Using ' + houseHolds[key]);
	    			config.thisHousehold = this_value;
	    			config.thisHouseholdAfter = this_value.replace('notstarted','attempted');
			    	return driver
				    	.elementById(config.thisHousehold)
				    	.click()
						.waitForElementById(elements.walkbook.popoverOpenHouse, 10000)
						.elementById(elements.walkbook.popoverOpenHouse)
						.click()
						.waitForElementById(elements.houseHold.notHome, 10000)
						.endTotalAndLogTime('Home Page to Household')
						.elementById(elements.houseHold.notHome)
						.click()
						.waitForElementByClassName('XCUIElementTypeTable', 13000) // wait for the house list
						.waitForElementById(config.thisHouseholdAfter) // verify house is blue
						.then(function () {
							houseHolds[key] = config.thisHouseholdAfter;
						}) // if previous passes, set the value in store to the new value.
	    			break;
				} else {
					console.log('All the houses in this walkbook have been started!'.red.bold.underline)
				}
			}
		});

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