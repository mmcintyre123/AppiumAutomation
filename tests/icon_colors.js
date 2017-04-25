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

		this.timeout(9000000);
		let allPassed = true;
		console.log(('RUNNING ' + __filename.slice(__dirname.length + 1) + ' for iOS').green.bold.underline);

/*
		it('For debugging', function () {
			//config.thisHousehold = [];
			//store.set('houseHolds', {});

			//goes to the household page
			return driver
				.loginQuick()
				.elementById(elements.homeScreen.walkbooks)
				.click()
				.waitForElementById(elements.surveys.survey1, 10000)
				.elementById('DO NOT USE: Mobile Automation Survey 1.0')
				.click()
				.waitForElementById(elements.survey.start, 10000)
				.sleep(1000) // sometimes start won't click - bcs of the spinner?
				.elementById(elements.survey.start)
				.click()
				.waitForElementByXPath(elements.survey.walkbook1, 10000)
			    .click()
			    .waitForElementById(elements.survey.popoverOpenBook, 10000)
			    .click()
			    .waitForElementByClassName('XCUIElementTypeTable', 10000)
			})
		});
*/

		it('Should perform a full login', function () {
			return driver
				.fullLogin()
		});

		it.only('Should login quick', function () {
			return driver
				.loginQuick()
		});

		// passing 4-25-17 7:20pm
		it.only('Should turn the house blue: one primary target not home', function () {

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

			    .clickFirstListItemByIdPart('notstarted')
			    .then(function () {

			    	console.log('Using ' + config.thisHousehold + ', houseNum ' + config.houseNum);
			    	let thisHouseholdAfter = config.thisHousehold.replace('notstarted','attempted');

			    	return driver

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
			    });
		});

		// passing 4-25-17 7:20pm
		it.only('Should turn the house blue: household not home', function () {

			console.log('Should turn the house blue: household not home'.green.bold.underline);

			// Survey: DO NOT USE: Mobile Automation Survey 1.0

			return driver
				// save household IDs:
				.clickFirstListItemByIdPart('notstarted')
				.then(function () {
					console.log('Using ' + config.thisHousehold + ', houseNum ' + config.houseNum);
					let thisHouseholdAfter = config.thisHousehold.replace('notstarted','attempted');

					return driver

						.waitForElementById(elements.walkbook.popoverOpenHouse, 10000)
						.elementById(elements.walkbook.popoverOpenHouse)
						.click()
						.waitForElementById(elements.houseHold.notHome, 10000)
						.elementById(elements.houseHold.notHome)
						.click()
						.waitForElementByClassName('XCUIElementTypeTable', 10000) // wait for the house list
						.waitForElementById(thisHouseholdAfter, 10000) // verify house is blue
				});
		});

		// passing 4-25-17 7:20pm
		it.only('Should turn the house from blue to red: restricted access household', function () {

			console.log('Should turn the house blue: restricted access household'.green.bold.underline);

			// Survey: DO NOT USE: Mobile Automation Survey 1.0

			return driver
				// save household IDs:
				.clickFirstListItemByIdPart('attempted')
				.then(function () {

					console.log('Using ' + config.thisHousehold + ', houseNum ' + config.houseNum);
					let thisHouseholdAfter = config.thisHousehold.replace('attempted','reject');

			    	return driver

						.waitForElementById(elements.walkbook.popoverOpenHouse, 10000)
						.elementById(elements.walkbook.popoverOpenHouse)
						.click()
						.waitForElementById(elements.houseHold.restricted, 10000)
						.click()
						.waitForElementByClassName('XCUIElementTypeTable', 10000) // wait for the house list
						.waitForElementById(thisHouseholdAfter, 10000) // verify house is blue
				});
		});
	});
};