"use strict";

module.exports = function () {
	
	require('colors');
	let wd            = require("wd");
	let    assert  	  = require('assert');
	let	_             = require('underscore');
	let	Q             = require('q');
	let	fsExtra       = require('fs-extra');
	let	fs            = require('fs');
	let	_p            = require('../helpers/promise-utils');
	let	elements      = require('../helpers/elements');
	let	actions       = require('../helpers/actions');
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

		it('Should turn the house blue', function () {
			console.log('Should turn the house blue'.green.bold.underline);

			// Not home household
			// Not home 1+ primary targets				
			// use survey DO NOT USE: Mobile Automation Survey 1.0

			return driver
				.startTime('Home Page to Household')
				.elementById(elements.homeScreen.walkbooks)
				.click()
				.startTime('Load Survey List')
				.waitForElementById(elements.surveys.survey1, 10000).should.eventually.exist
				.endTotalAndLogTime('Load Survey List')
				.elementById('DO NOT USE: Mobile Automation Survey 1.0')
				.click()
				.waitForElementById(elements.survey.start, 10000).should.eventually.exist
				.elementById(elements.survey.start)
				.click()
				.startTime('Load Survey')
				.waitForElementById(elements.survey.walkbook1, 10000).should.eventually.exist
			    .endTotalAndLogTime('Load Survey')
			    .elementById(elements.survey.walkbook1)
			    .click()
			    .waitForElementById(elements.survey.popoverOpenBook, 10000).should.eventually.exist
			    .elementById(elements.survey.popoverOpenBook)
			    .click()
			    .startTime('Load Walkbook')





			
		});




	});
};