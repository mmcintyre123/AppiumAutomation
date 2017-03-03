'use strict';

let config = function () {};

config.prototype.set = function ( options ) {

	for ( let i in options ) {
		this[ i ] = options[ i ];
	}
};

module.exports = new config();


// let config = function () {};

// config.prototype.set = function ( options ) {

// 	for ( let i in options ) {
// 		this[ i ] = options[ i ];
// 	}
// };
