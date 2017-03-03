//'use strict';

require( 'colors' );
let wd            = require( 'wd' );
let fs            = require( 'fs' );
let assert        = require( 'assert' );
let serverConfigs = require( './helpers/appium-servers' );
let args          = process.argv.slice( 2 );
let config        = require( './helpers/config' );
let actions       = require( './helpers/actions' );
let elements      = require( './helpers/elements' );
let timeout       = 180000;
let simulator     = false;
let desired;

for ( let i in args ) {
	let arg = args[ i ];
	let i   = Number( i );

	switch ( arg ) {
		case '-sim' : {
			if ( args[ i + 1 ] !== undefined ) {
				simulator = true;
				desired   = require( './helpers/caps' )[ args[ i + 1 ] ];

				config.set( {
					'os'      : args[ i + 1 ],
					'desired' : desired,
					'sim'     : true
				} );
			}

			break;
	}

		case '-time' : {
			if ( args[ i + 1 ] !== undefined ) {
				timeout = args[ i + 1 ];
			} else {
				throw 'You did not specify a timeout for -timeout';
			}

			break;
		}

		case '-reset' : {
			if ( args[ i + 1 ] !== undefined ) {
				config.set( {
					'reset' : true
				} );
			}

			break;
		}

		case '-os' : {
			if ( args[ i + 1 ] !== undefined ) {
				desired = require( './helpers/caps' )[ args[ i + 1 ] ];

				config.set( {
					'os'      : args[ i + 1 ],
					'desired' : desired,
					'sim'     : false
				} );
			} else {
				throw 'You did not specify a os for -os';
			}

			break;
		}
	}
}

require("./helpers/setup");
let commons = require( './helpers/commons' );
	//wd.addPromiseChainMethod( 'inputKeys', commons.sendKeys );
	// wd.addPromiseChainMethod( 'inputKeys', function ( config, keys ) {

	// 	if ( config.desired.platformName == 'Android' ) {
	// 		return this
	// 		.click()
	// 		.clear()
	// 		.sendKeys( keys )
	// 		.hideKeyboard();

	// 	} else if ( config.desired.platformName == 'IOS' ) {
	// 		return this
	// 		.click()
	// 		.elementByName( 'space' ).isDisplayed().should.eventually.be.true
	// 		.clear()
	// 		.sendKeys( keys );
	// 	}
	// } );
let driver = wd.promiseChainRemote( serverConfigs.local );
config.set( {
	'driver'   : driver,
	'elements' : elements
} );

describe( 'Automation Test in Progress!'.green, function () {

	this.timeout( timeout );
	let allPassed = true;
	require( './helpers/logging' ).configure( driver );

	commons.beforeAll();
	commons.afterAll();
	commons.afterEach();


	describe( 'Running automation, please wait for all tests to complete!'.red, function () {
/*
		describe( 'Running "SourceCode Check and SourceCode updates" Test.'.red, function () {

			let run = require( './TestFiles.js' );
				run.sourceCodeCheck( 'gitPullCheck' );
				//run.sourceCodeCheck( 'buildUpdates' );
		} );

		describe( 'Running Sync Smoke Test'.red, function () {

			let run = require( './TestFiles.js' );
				run.logins( 'loginSanboxSmokeTest' );
		} );
*/

		describe( 'Run sample test file'.red, function () {

			let devlopeApp = true;
			let run        = require( './TestFiles.js' );

			run.sampleTests( 'sample' );

		} );
	} );
} );
