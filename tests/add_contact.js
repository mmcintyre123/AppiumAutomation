"use strict";

module.exports = function () {

	require('colors');
	let   wd            = require("wd");
	let   assert        = require('assert');
	let   asserters     = wd.asserters;
	let   cities        = require('cities');
	let   counties      = require('us-zcta-counties');
	let   _             = require('underscore');
	let   Q             = require('q');
	let   fsExtra       = require('fs-extra');
	let   fs            = require('fs');
	let   pry           = require('pryjs');
	const sql           = require('mssql');
	let   _p            = require('../helpers/promise-utils');
	let   elements      = require('../helpers/elements');
	let   actions       = require('../helpers/actions');
	let   store         = require('../helpers/store');
	let   config        = require('../helpers/config');
	let   serverConfigs = require('../helpers/appium-servers');
	let   creds         = require('../credentials');
	let   sqlQuery      = require('../helpers/queries');
	let   serverConfig  = process.env.SAUCE ? serverConfigs.sauce : serverConfigs.local;
	let   args          = process.argv.slice( 2 );
	let   simulator     = false;
	let	desired;
	let driver = config.driver;
	let	commons = require('../helpers/commons'); // this must be after the desired and driver are set

	describe("Test adding and editing contacts and related actions", function() {

		let allPassed = true;
		console.log(('RUNNING ' + __filename.slice(__dirname.length + 1) + ' for iOS').green.bold.underline);
		
		it.skip('for debugging', function () {
			return driver
				.loginQuick()
				.elementById(elements.homeScreen.voterLookup)
				.click()
		//		.waitForElementById(elements.voterLookup.add_contact.add_contact, 10000)
		//		.click()
		//		.waitForElementById(elements.voterLookup.save, 10000)
		//		.click()
		//		.then(function () {
		//			eval(require('pryjs').it)
		//		})
		//		.waitForElementToDisappearByClassName('XCUIElementTypeTable') // todo fix
		});
		
		it('Sets variables for test', function () {
			// because beforeAll needs to run before we set these due to the need to have dateTime defined.
			// todo define differently between US and Australia
			return driver
				.sleep(1)
				.then(function () {
					config.lastCreatedVolunteer = {};
					config.firstName = 'First' + config.dateTime;
					config.lastName  = 'Last' + config.dateTime;
					config.fullName = config.firstName + ' ' + config.lastName
					config.email = config.firstName + '.' + config.lastName + '@callingfromhome.com'
					config.firstNameReg = new RegExp(config.firstName)
					config.lastNameReg = new RegExp(config.lastName)
					config.emailReg = new RegExp(config.email)

					if (config.australia == undefined) {
						config.state = 'AL'
						config.stateReg = new RegExp(config.state)
						let theseCities = cities.findByState(config.state).filter(function nonBlanks (city) {
							return city.city != '' && city.zipcode != ''
						})
						let rand = Math.floor((Math.random() * theseCities.length) + 0);
						config.thisCity = theseCities[rand].city
						config.thisZip = theseCities[rand].zipcode
						config.thisCounty = counties.find({zip: config.thisZip}).county
					} else if (config.australia == true) {

					}
				})
		});
		
		it('Should login quick', function () {
			return driver
				.loginQuick()
		});
		
		it('Should search for a contact and see results', function () {
			return driver
				.elementById(elements.homeScreen.voterLookup)
				.click()
				.elementById(elements.voterLookup.state)
				.click()
				.then(function () {
					if (config.australia == true) {
						return driver
							.waitForElementById('Victoria',10000) // todo 
							.click()
							.elementById('Done') // todo this should be made the same as every other save/done button.
							.click()
					} else if (config.australia == undefined) {
						return driver
					}
				})
				.waitForElementById(elements.voterLookup.last_name, 10000)
				.click()
				.sendKeys('Smith')
				.hideKeyboard()
				.elementById(elements.voterLookup.search)
				.click()
				.waitForElementById(elements.voterLookupResults.table, 20000)
		});

		//todo make sure not to add a tag that already exists, otherwise we'll get false positives.
		it('Should add a tag', function () {
			let thisCategory = '';
			let thisTag = '';
			return driver
				.elementById(elements.voterLookupResults.voter1)
				.click()
				.waitForElementById(elements.voterDetail.addTag.addTag, 20000)
				.click()
				.then(function getCategoryName (el) {
					return driver
						.waitForElementById(elements.voterDetail.addTag.category4, 10000)
						.elementByClassName('XCUIElementTypeStaticText')   // fixme use xpath - this is not in the context of the previous element as hoped.
						.then(function (el) {
							return el.getAttribute('name').then(function(name) {
								console.log(('category is ' + name).white.bold) 
								thisCategory = 'Category: ' + name;
							})
						})
				})
				.elementById(elements.voterDetail.addTag.category4)
				.click()
				.then(function getTagName (el) {
					return driver
						.waitForElementById(elements.voterDetail.addTag.tag1, 10000)
						.elementByClassName('XCUIElementTypeStaticText')   // fixme use xpath - this is not in the context of the previous element as hoped.
						.then(function (el) {
							return el.getAttribute('name').then(function(name) {
								console.log(('Tag is ' + name).white.bold) 
								thisTag = name;
							})
						})
				})
				.elementById(elements.voterDetail.addTag.tag1)
				.click()
				.elementById(elements.voterDetail.addTag.done)
				.click()
				.sleep(2000)
				.elementByIdOrNull('Error', 3000)
				.then(function (el) {
					if (el !== null) {
						throw new Error('Something went wrong when adding the tag to the voter.')
					}
				})
				.waitForElementToDisappearByClassName(elements.general.spinner)
				.waitForElementById(elements.voterDetail.takeSurvey, 5000)
				.waitForElementById(thisCategory,10000)
				.waitForElementById(thisTag,10000)
				.elementById(elements.actionBar.back)
				.click()
				.back()
		});

		//todo currently failing - add bug
		it('Should add a contact', function () {
			// on the 
			return driver
				.elementByIdOrNull(elements.voterLookup.add_contact.add_contact)
				.then(function (el) {
					if (el !== null){
						el.click()
						return driver
					} else if (el == null) {
						return driver
							.resetApp()
							.loginQuick()
							.elementById(elements.homeScreen.voterLookup)
							.click()
							.elementById(elements.voterLookup.add_contact.add_contact)
							.click()
					}
				})
				.waitForElementById(elements.voterLookup.add_contact.first_name, 10000)
				.sendKeys(config.firstName)
				.elementById(elements.voterLookup.add_contact.last_name)
				.sendKeys(config.lastName)
				//todo - error keyboard is not present - use the spinners
				//.elementById('etDOB')
				//.click()
				//.sendKeys('01/01/1975')
				.elementById(elements.voterLookup.add_contact.city)
				.then(function (el) {
					if (config.australia == true) {
						el.sendKeys('Melbourne') // todo make random like in US
						return driver
					} else if (config.australia == undefined) {
						el.sendKeys(config.thisCity)
						return driver
					}
				})
				.elementById(elements.voterLookup.add_contact.postcode)
				.click()
				.elementById(elements.voterLookup.add_contact.phone2)
				.click()
				.elementById(elements.voterLookup.add_contact.email)
				.sendKeys(config.email)
				.elementById(elements.voterLookup.save)
				.click()
				.waitForElementById(elements.voterDetail.addTag.addTag, 10000)
		});

	});
};