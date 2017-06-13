'use strict';

	module.exports.sampleTests = function ( sampleTests ) {

		switch ( sampleTests ) {
			case 'sample' :
				return require( './tests/sample.js' )();
			case 'icon_colors' :
				return require( './tests/icon_colors.js' )();
			case 'web_app' : 
				return require( './tests/web_app.js')();
		}
		console.log( 'No test case was selected!' );
	};
