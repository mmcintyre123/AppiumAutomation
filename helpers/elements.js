let apps = require('./apps.js');

//iOS

	// Updating from top down with accessibility IDs in Android - compare later to iOS
	//By ID
	exports.actionBar = {
		'hamburgerMenu'     :  'mnOverflow',
		'search'	        :  'Search', // magnifying glass - make sure this works in Android.
		'clearSearch'       :  'search_close_btn', // 'x' mark inside the search box
		'searchText'        :  'search_src_text', // active search query
		'refresh'	        :  'action_refresh',
		'addContact'	    :  '', // this usually adds a contact or volunteer, depending on the context.
		'checkConnectivity' :  'Check Connectivity',
		'logOut' 		    :  'Log Out' // probably use elementByName for Android
	}


	// currently by xpath and ID
	exports.loginLogout = {
		'userName'		 : 'etLoginUsername',
		'password'		 : 'etPassword',
		'logIn'			 : 'btnLogin',
		'rememberMe'	 : 'cbRemember',
		'forgotPassword' : 'btnForgotPassword', // also currently ID accessible
		'signOut'        : 'btnSignOut',
		'OK'			 : 'OK',
		'Cancel'		 : 'Cancel'
	}

	// by ID
	exports.homeScreen = {
		'walkbooks'		 : 'btnWalkbooks',
		'voterLookup'    : 'btnVoterLookup',
		'voterCheckIn'   : 'btnVoterCheckIn',
		'eventCheckIn'   : 'btnEventCheckIn'
	}

	exports.surveys = {
		'survey1'	: 'cellSurvey_0',
		'survey2'	: 'cellSurvey_1',
		'survey3'	: 'cellSurvey_2',
		'survey4'	: 'cellSurvey_3',
		'survey5'	: 'cellSurvey_4',
		'survey6'	: 'cellSurvey_5',
		'survey7'	: 'cellSurvey_6',
		'survey8'	: 'cellSurvey_7',
		'survey9'	: 'cellSurvey_8',
		'survey10'	: 'cellSurvey_9',
		'survey11'	: 'cellSurvey_10',
		'survey12'	: 'cellSurvey_11',
		'survey13'	: 'cellSurvey_12',
		'survey14'	: 'cellSurvey_13',
		'survey15'	: 'cellSurvey_14',
		'survey16'	: 'cellSurvey_15',
		'survey17'	: 'cellSurvey_16',
		'survey18'	: 'cellSurvey_17',
		'survey19'	: 'cellSurvey_18',
		'survey20'	: 'cellSurvey_19'
	}


	// by ID
	exports.survey = {
		'previewQuestions' 	 :  'tvSurveyPreview',
		'start' 			 :  'btnStartSurvey',
		'gpsLocateMe' 		 :  'locate icon', // in Android it's content-desc "My Location"
		'map' 				 :  'walkbook_map', //in iOS effectively, label "dismiss popup"
		'mapSettings'		 :  'i ipad', // in Android this is in the mnOverflow - text = "Icon Legend"
		'list' 				 :  'walkbook_list', // in iOS effectively, label 'menuButton', if on map view
		'walkbook1'     	 :  '//*[contains(@label,\'cellWalkbook_0\')]',
		'walkbook2'     	 :  '//*[contains(@label,\'cellWalkbook_1\')]',
		'walkbook3'     	 :  '//*[contains(@label,\'cellWalkbook_2\')]',
		'walkbook4'     	 :  '//*[contains(@label,\'cellWalkbook_3\')]',
		'walkbook5'     	 :  '//*[contains(@label,\'cellWalkbook_4\')]',
		'walkbook6'     	 :  '//*[contains(@label,\'cellWalkbook_5\')]',
		'walkbook7'     	 :  '//*[contains(@label,\'cellWalkbook_6\')]',
		'walkbook8'     	 :  '//*[contains(@label,\'cellWalkbook_7\')]',
		'popoverOpenBook'	 :  'More Info'
	}


	//Use elementByXPath
	exports.walkbook = {
		'houseHold1'       : "//*[contains(@label,'cellHouse_0')]",
		'houseHold2'       : "//*[contains(@label,'cellHouse_1')]",
		'houseHold3'       : "//*[contains(@label,'cellHouse_2')]",
		'houseHold4'       : "//*[contains(@label,'cellHouse_3')]",
		'houseHold5'       : "//*[contains(@label,'cellHouse_4')]",
		'houseHold6'       : "//*[contains(@label,'cellHouse_5')]",
		'houseHold7'       : "//*[contains(@label,'cellHouse_6')]",
		'houseHold8'       : "//*[contains(@label,'cellHouse_7')]",
		'houseHold9'       : "//*[contains(@label,'cellHouse_8')]",
		'houseHold10'      : "//*[contains(@label,'cellHouse_9')]",
		'houseHold11'      : "//*[contains(@label,'cellHouse_10')]",
		'houseHold12'      : "//*[contains(@label,'cellHouse_11')]",
		'houseHold13'      : "//*[contains(@label,'cellHouse_12')]",
		'houseHold14'      : "//*[contains(@label,'cellHouse_13')]",
		'houseHold15'      : "//*[contains(@label,'cellHouse_14')]",
		'houseHold16'      : "//*[contains(@label,'cellHouse_15')]",
		'houseHold17'      : "//*[contains(@label,'cellHouse_16')]",
		'houseHold18'      : "//*[contains(@label,'cellHouse_17')]",
		'houseHold19'      : "//*[contains(@label,'cellHouse_18')]",
		'houseHold20'      : "//*[contains(@label,'cellHouse_19')]",
		'list'             : 'house_list',
		'popoverOpenHouse' : 'More Info' // only iOS
		// examples        :
		// cellHouse_0_sfh_notstarted
		// cellHouse_0_sfh_attempted
		// cellHouse_0_sfh_partial
		// cellHouse_0_sfh_reject
	}

	exports.houseHold = {
		'primTarget1'  : 'prim_cellContact_0',
		'primTarget2'  : 'prim_cellContact_1',
		'primTarget3'  : 'prim_cellContact_2',
		'primTarget4'  : 'prim_cellContact_3',
		'primTarget5'  : 'prim_cellContact_4',
		'primTarget6'  : 'prim_cellContact_5',
		'secTarget1'   : 'sec_cellContact_0',
		'secTarget2'   : 'sec_cellContact_1',
		'secTarget3'   : 'sec_cellContact_2',
		'secTarget4'   : 'sec_cellContact_3',
		'secTarget5'   : 'sec_cellContact_4',
		'secTarget6'   : 'sec_cellContact_5',
		'primPlus1'    : 'prim_cellContactPlus_0',
		'primPlus2'    : 'prim_cellContactPlus_1',
		'primPlus3'    : 'prim_cellContactPlus_2',
		'primPlus4'    : 'prim_cellContactPlus_3',
		'primPlus5'    : 'prim_cellContactPlus_4',
		'primPlus6'    : 'prim_cellContactPlus_5',
		'secPlus1'     : 'sec_cellContactPlus_0',
		'secPlus2'     : 'sec_cellContactPlus_1',
		'secPlus3'     : 'sec_cellContactPlus_2',
		'secPlus4'     : 'sec_cellContactPlus_3',
		'secPlus5'     : 'sec_cellContactPlus_4',
		'secPlus6'     : 'sec_cellContactPlus_5',
		'primInfo1'    : 'prim_cellContactInfo_0',
		'primInfo2'    : 'prim_cellContactInfo_1',
		'primInfo3'    : 'prim_cellContactInfo_2',
		'primInfo4'    : 'prim_cellContactInfo_3',
		'primInfo5'    : 'prim_cellContactInfo_4',
		'primInfo6'    : 'prim_cellContactInfo_5',
		'secInfo1'     : 'sec_cellContactInfo_0',
		'secInfo2'     : 'sec_cellContactInfo_1',
		'secInfo3'     : 'sec_cellContactInfo_2',
		'secInfo4'     : 'sec_cellContactInfo_3',
		'secInfo5'     : 'sec_cellContactInfo_4',
		'secInfo6'     : 'sec_cellContactInfo_5',
		'notHome' 	   : 'btnDisposition_Not Home',
		'refused' 	   : 'btnDisposition_Refused',
		'wrongAddress' : 'btnDisposition_Wrong Address',
		'restricted'   : 'btnDisposition_Restricted Access',
		'addContact'   : 'btnAddContact',
		'finished'     : 'btnDispoFinishHousehold'
	}

	exports.target = {
		'takeSurvey'     : 'btnTakeSurvey',    // Formerly: 'Take Survey',
		'notHome' 		 : 'btnNotHome', 	   // Formerly: 'Not Home',
		'refused' 		 : 'btnRefuse', 	   // Formerly: 'Refused',
		'wrongAddress'   : 'btnWrongAddress',  // Formerly: 'Wrong Address',
		'addNote' 		 : 'btnNote', 		   // Formerly: 'Add Note',
		'tag' 		     : 'btnTag', 		   // Formerly: 'Tag',
		'edit' 		     : 'btnEdit', 		   // Formerly: 'Edit',
		'requestBallot'  : 'btnAbsentee', 	   // Formerly: 'Request Absentee Ballot'
	}

	//todo: write a function that gets and stores an array of available targets in a household,
	//then iterates through them taking surveys.
	exports.takeSurvey = {
		'answer1'         :  'btnAnswer_0',  //Formerly: 'btnAnswer_0',
		'answer2'         :  'btnAnswer_1',  //Formerly: 'btnAnswer_1',
		'answer3'         :  'btnAnswer_2',  //Formerly: 'btnAnswer_2',
		'answer4'         :  'btnAnswer_3',  //Formerly: 'btnAnswer_3',
		'answer5'         :  'btnAnswer_4',  //Formerly: 'btnAnswer_4',
		'answer6'         :  'btnAnswer_5',  //Formerly: 'btnAnswer_5',
		'answer7'         :  'btnAnswer_6',  //Formerly: 'btnAnswer_6',
		'answer8'         :  'btnAnswer_7',  //Formerly: 'btnAnswer_7',
		'skip'            :  '',  			//Formerly: 'Skip',
		'prev'            :  'btnSurveyPrevious',  //Formerly: 'Prev', // previous question
		'submitAnswer'    :  '',			  //Formerly: 'Submit Answer',
		'remainingTarget' : '//*[(contains(id()\'btnRemaining\')]',
		'remainingPrimaryTarget' : 'prim_btnRemaining_1',			  //Formerly: '//UIAApplication[1]/UIAWindow[1]/UIAScrollView[1]/UIAButton[2]',
		'remainingSecondaryTarget' :  'sec_btnRemaining_3',			  //Formerly: '//UIAApplication[1]/UIAWindow[1]/UIAScrollView[1]/UIAButton[2]',
		'finish'	      :  'btnEpilogueFinished' 			 //Formerly: 'Finish with Household'
	}