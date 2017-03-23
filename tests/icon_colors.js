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
			console.log(('RUNNING ' + __filename.slice(__dirname.length + 1)).green.bold.underline);


		it('Should turn the house blue', function () {
			console.log('Should turn the house blue'.green.bold.underline);

			// Not home household
			// Not home 1+ primary targets				
			// use survey DO NOT USE: Mobile Automation Survey 1.0

			return driver
			






			
		});




	});
};