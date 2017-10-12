'use strict';

// todo figure out how to pull some of this out and put in the default caps.
exports.iosDevice1 = {
	"showIOSLog": false,
	"nativeInstrumentsLib": true,
	"platformName": "iOS",
	"platformVersion": "10.3",
	"automationName": "XCUITest",
	"deviceName": "MattMcIntyreIPad",
	"bundleId": "com.i360.i360Walk",
	"fullReset": false,
	"clearSystemFiles": true,
	"preventWDAAttachments": true,
	"noReset": true,
	"newCommandTimeout": false,
	"udid": "d551bed2c6173c1f97a7d845f0cc4ae69456fa2c",
	"showXcodeLog": true,
	"xcodeSigningId": "iPhone Developer",
	"xcodeOrgId": "55DW573EQF"
  };

exports.iosDevice2 = {
	'platformName'    : 'iOS',
	'platformVersion' : '10.1',
	'deviceName'      : "ZackStreeteriPad",
	'UDID'            : 'f81b68e2f1689371c31cee1048d3baf597f4446b'
};

//ios Simulator #1
exports.iosSim1 = {
	// 'appium-version'  : '1.6.3',
	'platformName'    : 'iOS',
	'platformVersion' : '10.2',
	'deviceName'      : 'iPhone 6 Plus'
	// 'port'            : 4723
	// 'UDID' 	 		  : '816AE1C8-B4D5-492C-B895-C17F65996FC4'
};

//ios Simulator #2
exports.iosSim2 = {
	// 'appium-version'  : '1.6.3',
	'platformName'    : 'iOS',
	'platformVersion' : '10.3',
	'deviceName'      : 'iPad Air 2'
	// 'UDID' 	 		  : '58409B4A-1021-4AB9-A590-98CE58403CFF'
	// 'webDriverAgentUrl' : 'http://localhost:8100'
	// 'port'            : 4723
};

//ios Simulator #3
exports.iosSim3 = {
	'platformName'    : 'iOS',
	'platformVersion' : '10.2',
	'deviceName'      : 'iPhone 5',
	'port'            : 4723
	// 'UDID' 	 		  : 'C12C70ED-2DE7-47CB-AA4F-61FB0B558E8D'
};

exports.androidDevice1 = {
  // 'appium-version': '1.6.3',
  'platformName': 'Android',
  'platformVersion': '6.0',
  'deviceName': 'G4'
};

exports.safari = {
	'platformName'    : 'iOS',
	'platformVersion' : '10.2',
	'deviceName'      : 'iPad Air 2',
	'browserName'     : 'Safari'
}
