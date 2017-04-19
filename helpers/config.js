'use strict';

/*
// Old way:
let config = function () {};
config.prototype.set = function ( options ) {

	for ( let i in options ) {
		this[ i ] = options[ i ];
	}
};
module.exports = new config();
*/

// New way:
let singleton = {
	set: function(options) {
		for (let i in options) {
			this[i] = options[i];
		}
	}
}
module.exports = singleton;