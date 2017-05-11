"use strict";

module.exports = function () {

	require('colors');
	let wd            = require("wd");
	let assert  	  = require('assert');
	let	_             = require('underscore');
	let	Q             = require('q');
	let	fsExtra       = require('fs-extra');
	let	fs            = require('fs');
	let	pry  		  = require('pryjs');
	let	_p            = require('../helpers/promise-utils');
	let	elements      = require('../helpers/elements');
	let	actions       = require('../helpers/actions');
	let store    	  = require('../helpers/store');
	let	config 		  = require('../helpers/config');
	let	serverConfigs = require('../helpers/appium-servers');
	let creds         = require('../credentials');
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

		it.only('For debugging', function () {
			// config.theseNameAttrs = [];

			return driver
				.loginQuick()
				.elementById(elements.homeScreen.walkbooks)
				.click()
				.waitForElementById(elements.surveys.survey1, 10000)
				.elementById('Copy of Copy of Survey with Custom Email and for checking numbers')
				.click()
				.waitForElementById(elements.survey.start, 10000)
				.sleep(1000) // sometimes start won't click - bcs of the spinner?
				.elementById(elements.survey.start)
				.click()
			    .waitForElementByClassName('XCUIElementTypeTable', 10000)
				.elementById('Walkbook 1')
				.click()
			    .waitForElementById(elements.survey.popoverOpenBook, 10000)
			    .click()
			    .waitForElementByClassName('XCUIElementTypeTable', 10000)
			    .elementById('cellHouse_6_sfh_notstarted')
			    .click()
			    // .clickFirstListItemByIdPart(elements.walkbook.houseHold8)
			    .waitForElementById(elements.walkbook.popoverOpenHouse)
			    .click()
			    .waitForElementById(elements.houseHold.notHome)
			    //works:
			    .elementByXPath("//*/XCUIElementTypeScrollView[1]/XCUIElementTypeOther[1]") // target button area
			    .elementsByClassName('>','XCUIElementTypeButton') // all button elements in the above context
			    .saveAllNameAttributes('cellContact_', 'theseNameAttrs')
			    .then(function () {

			    	let regexp = new RegExp('^prim_cellContact_\\d+$', 'i');

			    	var prom;
			    	for (let i = 0; i < config.theseNameAttrs.length; i++) {

			    		// take survey with all primary targets
			    		if (regexp.test(config.theseNameAttrs[i])) {

			    			let thisTarget = config.theseNameAttrs[i];
			    			
			    			if (i == 0) {
			    				prom = commons.takeSurveyTemp(thisTarget);
			    			} else {
			    				prom = prom.then(function () {
			    					return commons.takeSurveyTemp(thisTarget)
			    				})
			    			}
			    		}
			    	}
			    	return prom;
			    })
			    .consoleLog('TEST CASE IS OVER'.red.bold.underline) //surveys should have been taken with all primary targets and no non-primary targets.
			    .sleep(4000)
		});





		it('Should perform a full login', function () {
			return driver
				.fullLogin(creds.testUserName1, creds.testUserPwd1)
		});

		it('Should login quick', function () {
			return driver
				.loginQuick()
		});

		it('Should turn the house blue: one primary target not home', function () {

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
					    .consoleLog('Household color/status check passed - before refresh - Test: ' + config.currentTest.title)
					    .swipe({startX: 10, startY: 136, offsetX: 0, offsetY: 400,}) // refresh house list todo create a custom method?
					    .sleep(1000)
					    .waitForElementById(thisHouseholdAfter, 10000) // verify the house is blue after refresh
					    .consoleLog('Household color/status check passed - after refresh - Test: ' + config.currentTest.title)
			    });
		});

		it('TRANSITION: blue to red: one primary not home --> restricted access house', function () {

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
						.consoleLog('Household color/status check passed - before refresh - Test: ' + config.currentTest.title)
						.refreshHouseList()
						.sleep(1000)
						.waitForElementById(thisHouseholdAfter, 10000) // verify the house is blue after refresh
						.consoleLog('Household color/status check passed - after refresh - Test: ' + config.currentTest.title)
				});
		});

		it('REPORTING BUSINESS RULE 4 (multiple dispositions) & TRANSITION (red to blue: restricted house --> not home house)', function () {

			// Survey: DO NOT USE: Mobile Automation Survey 1.0

			return driver
				// save household IDs:
				.clickFirstListItemByIdPart('reject')
				.then(function () {
					console.log('Using ' + config.thisHousehold + ', houseNum ' + config.houseNum);
					let thisHouseholdAfter = config.thisHousehold.replace('reject','attempted');

					return driver

						.waitForElementById(elements.walkbook.popoverOpenHouse, 10000)
						.elementById(elements.walkbook.popoverOpenHouse)
						.click()
						.waitForElementById(elements.houseHold.notHome, 10000)
						.elementById(elements.houseHold.notHome)
						.click()
						.waitForElementByClassName('XCUIElementTypeTable', 10000) // wait for the house list
						.waitForElementById(config.thisHousehold, 10000) // house is still red - new reporting should have processed business rule 4. Must refresh to see correct household color.
						.consoleLog('Household color/status check passed - before refresh - Test: ' + config.currentTest.title)
						.refreshHouseList()
						.waitForElementById(thisHouseholdAfter, 10000) // verify the house is blue after refresh
						.consoleLog('Household color/status check passed - after refresh - Test: ' + config.currentTest.title)
				});
		});

		//todo finish this
		it('TRANSITION: blue to green: not home house --> take survey all primary', function () {

			return driver
				.clickFirstListItemByIdPart('attempted')
				.then(function () {
					console.log('Using ' + config.thisHousehold + ', houseNum ' + config.houseNum);
					let thisHouseholdAfter = config.thisHousehold.replace('attempted','complete');

					return driver

                    	.waitForElementById(elements.walkbook.popoverOpenHouse, 10000)
					    .elementById(elements.walkbook.popoverOpenHouse)
					    .click()
					    .waitForElementById(elements.houseHold.notHome, 10000)
					    .elementById(elements.houseHold.primTarget1)
					    .click()
					    .waitForElementById(elements.target.takeSurvey, 10000)

				})

			
		});




		it('Should turn the house red: wrong address house', function () {

			// Survey: DO NOT USE: Mobile Automation Survey 1.0

			return driver
				// save household IDs:
				.clickFirstListItemByIdPart('notstarted')
				.then(function () {
					console.log('Using ' + config.thisHousehold + ', houseNum ' + config.houseNum);
					let thisHouseholdAfter = config.thisHousehold.replace('notstarted','reject');

					return driver

						.waitForElementById(elements.walkbook.popoverOpenHouse, 10000)
						.elementById(elements.walkbook.popoverOpenHouse)
						.click()
						.waitForElementById(elements.houseHold.wrongAddress, 10000)
						.elementById(elements.houseHold.wrongAddress)
						.click()
						.waitForElementByClassName('XCUIElementTypeTable', 10000) // wait for the house list
						.waitForElementById(thisHouseholdAfter, 10000) // verify house
						.consoleLog('Household color/status check passed - before refresh - Test: ' + config.currentTest.title)
						.refreshHouseList()
						.waitForElementById(thisHouseholdAfter, 10000) // verify house after refresh
						.consoleLog('Household color/status check passed - after refresh - Test: ' + config.currentTest.title)
				});
			
		});


		it('Should turn the house red: refused house', function () {

			// Survey: DO NOT USE: Mobile Automation Survey 1.0

			return driver
				// save household IDs:
				.clickFirstListItemByIdPart('notstarted')
				.then(function () {
					console.log('Using ' + config.thisHousehold + ', houseNum ' + config.houseNum);
					let thisHouseholdAfter = config.thisHousehold.replace('notstarted','reject');

					return driver

						.waitForElementById(elements.walkbook.popoverOpenHouse, 10000)
						.elementById(elements.walkbook.popoverOpenHouse)
						.click()
						.waitForElementById(elements.houseHold.refused, 10000)
						.elementById(elements.houseHold.refused)
						.click()
						.waitForElementByClassName('XCUIElementTypeTable', 10000) // wait for the house list
						.waitForElementById(thisHouseholdAfter, 10000) // verify house
						.consoleLog('Household color/status check passed - before refresh - Test: ' + config.currentTest.title)
						.refreshHouseList()
						.waitForElementById(thisHouseholdAfter, 10000) // verify house after refresh
						.consoleLog('Household color/status check passed - after refresh - Test: ' + config.currentTest.title)
				});
			
		});

		it('Should turn the house blue: not home house', function () {

			// Survey: DO NOT USE: Mobile Automation Survey 1.0

			return driver
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
						.consoleLog('Household color/status check passed - before refresh - Test: ' + config.currentTest.title)
						.refreshHouseList()
						.waitForElementById(thisHouseholdAfter, 10000) // verify house after refresh
						.consoleLog('Household color/status check passed - after refresh - Test: ' + config.currentTest.title)
				});
		});


		it('TRANSITION: blue to red: not home house --> refused house', function () {

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
						.waitForElementById(elements.houseHold.refused, 10000)
						.elementById(elements.houseHold.refused)
						.click()
						.waitForElementByClassName('XCUIElementTypeTable', 10000) // wait for the house list
						.waitForElementById(thisHouseholdAfter, 10000) // verify house
						.consoleLog('Household color/status check passed - before refresh - Test: ' + config.currentTest.title)
						.refreshHouseList()
						.waitForElementById(thisHouseholdAfter, 10000) // verify house after refresh
						.consoleLog('Household color/status check passed - after refresh - Test: ' + config.currentTest.title)
				});
			
		});




	});
};