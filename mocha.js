//'use strict';

require( 'colors' );
let wd            = require( 'wd' );
let fs            = require( 'fs' );
let assert        = require( 'assert' );
let serverConfigs = require( './helpers/appium-servers' );
let args          = process.argv.slice( 2 );
let config        = require( './helpers/config' );
let	_             = require('underscore');
let actions       = require( './helpers/actions' );
let elements      = require( './helpers/elements' );
let timeout       = 9999000;
let simulator     = false;
let desired;

	for ( var i in args ) {
		var arg = args[ i ];
		var i   = Number( i );

		switch ( arg ) {
			case '--sim' : {
				if ( args[ i + 1 ] !== undefined ) {
					simulator = true;
					desired   = _.clone(require( './helpers/caps' )[ args[ i + 1 ] ]);

					config.set( {
						'os'      : args[ i + 1 ],
						'desired' : desired,
						'sim'     : true
					} );

					config.desired.newCommandTimeout = args.includes("--dbg") ? 1800 : 120, // in seconds - 30 min or 2 min
					config.desired.launchTimeout = 180000  // in ms - 3 minutes

				}

				break;
		}

			case '--time' : {
				if ( args[ i + 1 ] !== undefined ) {
					timeout = args[ i + 1 ];
				} else {
					throw 'You did not specify a timeout for --time';
				}

				break;
			}

			case '--reset' : {
				if ( args[ i + 1 ] !== undefined ) {
					config.set( {
						'fullReset' : true
					} );
				}

				break;
			}

			case '--os' : {
				if ( args[ i + 1 ] !== undefined ) {
					desired = _.clone(require( './helpers/caps' )[ args[ i + 1 ] ]);

					config.set( {
						'os'      : args[ i + 1 ],
						'desired' : desired,
						'sim'     : false
					} );

					config.desired.newCommandTimeout = args.includes("--dbg") ? 1800 : 120, // in seconds - 30 min or 2 min
					config.desired.launchTimeout = 180000  // in ms - 3 minutes

				} else {
					throw 'You did not specify a os for --os';
				}

				break;
			}

			case '--ENV' : {
				if ( args[ i + 1 ] !== undefined && args[ i + 1 ].substring(0,2) !== '--') {
					config.set( {
						'ENV' : args[ i + 1 ]
					});
				} else {
					throw 'You did not specify an environment, for example, --ENV test';
				}
				break;
			}

			case '--app' : {
				if ( args[ i + 1 ] !== undefined && args[ i + 1 ].substring(0,2) !== '--') {

					if (args[ i + 1 ] == 'australia') {
						config.set( {
							'australia' : true
						} );
						config.desired.bundleId = "com.i360.i360WalkAUS"
					} else {
						config.desired.bundleId = "com.i360.i360Walk"
					}

				} else {
					throw 'This parameter is for specifying the Australia app.  Supply australia: --app australia';
				}

				break;
			}
		}
	}

let driver = wd.promiseChainRemote( serverConfigs.local );
config.set({
	'driver'   : driver,
	'elements' : elements
});

require("./helpers/setup");
let commons = require( './helpers/commons' );

describe( 'Loading beforeAll, beforeEachIt, afterEachIt, afterAll\n'.green, function () {

	this.timeout( timeout ); // total time limit for all tests to complete
	let allPassed = true;
	// require( './helpers/logging' ).configure( driver );

	commons.beforeAll();
	commons.beforeEachIt();
	commons.afterEachIt();
	commons.afterAll();

	describe( 'Future: running source code check and performing an update & build if necessary\n'.green, function () {
/*
		//todo adapt this for Walk
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
		describe( 'Running test automation\n'.green, function () {

			let devlopeApp = true; //todo figure out what this is for
			let counter = 0;
			let run = require( './TestFiles.js' );

			console.log('\nDesired Caps are:'.white.bold);
			console.dir(config.desired);
			console.log('\n');

		/* TESTS */
			// run.sampleTests( 'sample' );
			// run.sampleTests( 'web_app' );
			// run.sampleTests( 'walkbooks_smoke_tests' );
			(function repeatTest() {
				let timesToRun = 1
				if (counter < timesToRun) {
					counter+=1
					run.sampleTests('icon_colors');
					repeatTest()
				} else {
					return
				}
			})()
			// run.sampleTests( 'add_note' );
			// run.sampleTests( 'target_page' );
			run.sampleTests( 'add_contact' );
		} );
	} );


} );
