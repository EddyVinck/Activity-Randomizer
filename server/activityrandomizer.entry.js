/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/js/activity-randomizer.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/js-cookie/src/js.cookie.js":
/*!*************************************************!*\
  !*** ./node_modules/js-cookie/src/js.cookie.js ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;/*!
 * JavaScript Cookie v2.2.0
 * https://github.com/js-cookie/js-cookie
 *
 * Copyright 2006, 2015 Klaus Hartl & Fagner Brack
 * Released under the MIT license
 */
;(function (factory) {
	var registeredInModuleLoader = false;
	if (true) {
		!(__WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) :
				__WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
		registeredInModuleLoader = true;
	}
	if (true) {
		module.exports = factory();
		registeredInModuleLoader = true;
	}
	if (!registeredInModuleLoader) {
		var OldCookies = window.Cookies;
		var api = window.Cookies = factory();
		api.noConflict = function () {
			window.Cookies = OldCookies;
			return api;
		};
	}
}(function () {
	function extend () {
		var i = 0;
		var result = {};
		for (; i < arguments.length; i++) {
			var attributes = arguments[ i ];
			for (var key in attributes) {
				result[key] = attributes[key];
			}
		}
		return result;
	}

	function init (converter) {
		function api (key, value, attributes) {
			var result;
			if (typeof document === 'undefined') {
				return;
			}

			// Write

			if (arguments.length > 1) {
				attributes = extend({
					path: '/'
				}, api.defaults, attributes);

				if (typeof attributes.expires === 'number') {
					var expires = new Date();
					expires.setMilliseconds(expires.getMilliseconds() + attributes.expires * 864e+5);
					attributes.expires = expires;
				}

				// We're using "expires" because "max-age" is not supported by IE
				attributes.expires = attributes.expires ? attributes.expires.toUTCString() : '';

				try {
					result = JSON.stringify(value);
					if (/^[\{\[]/.test(result)) {
						value = result;
					}
				} catch (e) {}

				if (!converter.write) {
					value = encodeURIComponent(String(value))
						.replace(/%(23|24|26|2B|3A|3C|3E|3D|2F|3F|40|5B|5D|5E|60|7B|7D|7C)/g, decodeURIComponent);
				} else {
					value = converter.write(value, key);
				}

				key = encodeURIComponent(String(key));
				key = key.replace(/%(23|24|26|2B|5E|60|7C)/g, decodeURIComponent);
				key = key.replace(/[\(\)]/g, escape);

				var stringifiedAttributes = '';

				for (var attributeName in attributes) {
					if (!attributes[attributeName]) {
						continue;
					}
					stringifiedAttributes += '; ' + attributeName;
					if (attributes[attributeName] === true) {
						continue;
					}
					stringifiedAttributes += '=' + attributes[attributeName];
				}
				return (document.cookie = key + '=' + value + stringifiedAttributes);
			}

			// Read

			if (!key) {
				result = {};
			}

			// To prevent the for loop in the first place assign an empty array
			// in case there are no cookies at all. Also prevents odd result when
			// calling "get()"
			var cookies = document.cookie ? document.cookie.split('; ') : [];
			var rdecode = /(%[0-9A-Z]{2})+/g;
			var i = 0;

			for (; i < cookies.length; i++) {
				var parts = cookies[i].split('=');
				var cookie = parts.slice(1).join('=');

				if (!this.json && cookie.charAt(0) === '"') {
					cookie = cookie.slice(1, -1);
				}

				try {
					var name = parts[0].replace(rdecode, decodeURIComponent);
					cookie = converter.read ?
						converter.read(cookie, name) : converter(cookie, name) ||
						cookie.replace(rdecode, decodeURIComponent);

					if (this.json) {
						try {
							cookie = JSON.parse(cookie);
						} catch (e) {}
					}

					if (key === name) {
						result = cookie;
						break;
					}

					if (!key) {
						result[name] = cookie;
					}
				} catch (e) {}
			}

			return result;
		}

		api.set = api;
		api.get = function (key) {
			return api.call(api, key);
		};
		api.getJSON = function () {
			return api.apply({
				json: true
			}, [].slice.call(arguments));
		};
		api.defaults = {};

		api.remove = function (key, attributes) {
			api(key, '', extend(attributes, {
				expires: -1
			}));
		};

		api.withConverter = init;

		return api;
	}

	return init(function () {});
}));


/***/ }),

/***/ "./src/js/activity-randomizer.js":
/*!***************************************!*\
  !*** ./src/js/activity-randomizer.js ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _activityRandomizer = __webpack_require__(/*! ./modules/activity-randomizer/state/activity-randomizer */ "./src/js/modules/activity-randomizer/state/activity-randomizer.js");

var _activityRandomizer2 = _interopRequireDefault(_activityRandomizer);

var _filters = __webpack_require__(/*! ./modules/activity-randomizer/filters/filters */ "./src/js/modules/activity-randomizer/filters/filters.js");

var _dom = __webpack_require__(/*! ./modules/activity-randomizer/filters/dom */ "./src/js/modules/activity-randomizer/filters/dom.js");

var _dom2 = __webpack_require__(/*! ./modules/activity-randomizer/dom */ "./src/js/modules/activity-randomizer/dom.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Lists activities in the activityListContainers or shows an error
var listActivities = function listActivities(documentID, sheetName) {
  var documentLinkInput = document.getElementById('sheet-input');
  var sheetCellRange = 'A2:D';

  var sheetPrefix = sheetName ? sheetName + '!' : '';
  (0, _dom2.setActivityContainerContent)('<div class="col">Loading data...</div>');

  gapi.client.sheets.spreadsheets.values.get({
    spreadsheetId: documentID,
    range: sheetPrefix + sheetCellRange
  }).then(function (response) {
    var range = response.result;

    // Sometimes range.values empty and then it is not returned from the response
    if (range.values && range.values.length > 0) {
      var activities = [];
      _activityRandomizer2.default.setDocumentValidity(true);

      (0, _dom2.removeActivityListContainersInnerHTML)();
      for (var i = 0; i < range.values.length; i += 1) {
        var cellRow = range.values[i];

        // Print columns A and B, which correspond to indices 0 and 1.
        (0, _dom2.appendActivity)(cellRow[0], cellRow[1]);

        activities.push({
          name: cellRow[0],
          time: cellRow[1],
          rating: cellRow[2],
          description: cellRow[3] || 'No description'
        });
      }

      _activityRandomizer2.default.setActivities(activities);
      (0, _dom.setTimeRangeMaxValue)();
      documentLinkInput.classList.remove('is-invalid');
    } else {
      (0, _dom2.setActivityContainerContent)('<div class="col">No data found. :(</div>');
      (0, _dom.disableFilters)();
    }
  },
  // Handle rejected document
  function () {
    documentLinkInput.classList.add('is-invalid');
    _activityRandomizer2.default.setDocumentValidity(false);
    (0, _dom2.removeActivityListContainersInnerHTML)();
    (0, _dom2.appendMessage)('error: Make sure your Google Sheets document link is copied correctly.');
    (0, _dom.disableFilters)();
  });
};

/**
 * @param {array} sheetNames
 */
var insertSheetNames = function insertSheetNames(sheetNames) {
  var sheetButtonContainer = document.querySelector('.sheet-button-container');
  sheetButtonContainer.innerHTML = '';

  sheetNames.forEach(function (sheet) {
    var sheetName = sheet.properties.title.toLowerCase();

    // Add the sheets as buttons, except for the info sheet
    if (sheetName !== 'info') {
      sheetButtonContainer.innerHTML += '<button class="btn btn-sm" value="' + sheetName + '">' + sheetName + '</button>';
    }

    var sheetButtons = sheetButtonContainer.querySelectorAll('button');

    // Add the click listeners for the buttons
    sheetButtons.forEach(function (clickedButton, index, buttons) {
      clickedButton.addEventListener('click', function (e) {
        // Change the active button
        buttons.forEach(function (button) {
          button.classList.remove('btn-primary');
        });
        clickedButton.classList.add('btn-primary');

        var sheetToUse = e.target.value;
        var documentID = (0, _dom2.getDocumentID)();
        listActivities(documentID, sheetToUse);
      });

      if (index === 0) {
        clickedButton.dispatchEvent(new Event('click'));
        clickedButton.classList.add('btn-primary');
      }
    });
  });
};

var handleNoSheetNames = function handleNoSheetNames(error) {
  insertSheetNames([]);
  (0, _dom.disableFilters)();
  _activityRandomizer2.default.setDocumentValidity(false);
  (0, _dom2.appendMessage)('Getting sheet names failed: ' + error);
};

var getSheetNames = function getSheetNames(documentID) {
  return new Promise(function (resolve, reject) {
    gapi.client.sheets.spreadsheets.get({
      spreadsheetId: documentID
    }).then(function (response) {
      resolve(response.result.sheets);
    }, function (response) {
      reject(response.result.error.message);
    });
  });
};

/**
 *  Called when the signed in status changes, to update the UI
 *  appropriately. After a sign-in, the API is called.
 */
var updateGoogleAPISignInStatus = function updateGoogleAPISignInStatus(isSignedIn) {
  var authorizeButton = document.getElementById('authorize-button');
  var signoutButton = document.getElementById('signout-button');

  if (isSignedIn) {
    var documentID = (0, _dom2.getDocumentID)();

    authorizeButton.style.display = 'none';
    signoutButton.style.display = 'inline-block';

    getSheetNames(documentID).then(insertSheetNames).catch(function (error) {
      handleNoSheetNames(error);
    });
    listActivities(documentID);
  } else {
    authorizeButton.style.display = 'inline-block';
    signoutButton.style.display = 'none';
  }
};

var handleGoogleAPIAuthClick = function handleGoogleAPIAuthClick() {
  gapi.auth2.getAuthInstance().signIn();
};
var handleGoogleAPISignoutClick = function handleGoogleAPISignoutClick() {
  gapi.auth2.getAuthInstance().signOut();
};

// Initializes the API client library and sets up sign-in state listeners.
var initClientForGoogleSheetsAPI = function initClientForGoogleSheetsAPI() {
  var authorizeButton = document.getElementById('authorize-button');
  var signoutButton = document.getElementById('signout-button');

  // Client ID and API key from the Developer Console
  var CLIENT_ID = '855790869281-iie5tqafurs5179pmr8s236n595o4460.apps.googleusercontent.com';
  var API_KEY = 'AIzaSyDxKJyIUDRnU7xTz6_CWAGxZkDiytZtpA4';

  // Array of API discovery doc URLs for APIs used by the quickstart
  var DISCOVERY_DOCS = ['https://sheets.googleapis.com/$discovery/rest?version=v4', 'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'];

  /* Authorization scopes required by the API; multiple scopes can be
   included, separated by spaces. */
  var SCOPES = 'https://www.googleapis.com/auth/spreadsheets.readonly https://www.googleapis.com/auth/calendar.readonly';

  gapi.client.init({
    apiKey: API_KEY,
    clientId: CLIENT_ID,
    discoveryDocs: DISCOVERY_DOCS,
    scope: SCOPES
  }).then(function () {
    // Listen for sign-in state changes.
    gapi.auth2.getAuthInstance().isSignedIn.listen(updateGoogleAPISignInStatus);

    // Handle the initial sign-in state.
    updateGoogleAPISignInStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
    authorizeButton.onclick = handleGoogleAPIAuthClick;
    signoutButton.onclick = handleGoogleAPISignoutClick;
  });
};

/**
 *  On load, called to load the auth2 library and API client library.
 *  On window object for the Google Sheets script tag.
 */
window.handleClientLoad = function () {
  gapi.load('client:auth2', initClientForGoogleSheetsAPI);
};

/**
 * @description Puts an activity in the picked activity card
 * @param {activity} activity
 */
var insertRandomizedActivity = function insertRandomizedActivity(activity) {
  var pickedActivity = document.getElementById('picked-activity');

  pickedActivity.querySelector('.card-title h2').innerHTML = activity.name;
  pickedActivity.querySelector('.card-text').innerHTML = activity.description + '<br>' + activity.time + ' minutes.';
};

// Elements with eventlisteners
var viewListButtons = document.querySelectorAll('[data-target="#viewCurrentActivities"]');
var timeRange = document.querySelector('[time-range]');
var randomizeButton = document.getElementById('pick-activity');
var sheetSubmitButton = document.getElementById('sheet-submit');
var removeFiltersButton = document.getElementById('remove-filters');

sheetSubmitButton.addEventListener('click', function () {
  var documentID = (0, _dom2.getDocumentID)();

  listActivities(documentID);
  getSheetNames(documentID).then(insertSheetNames).catch(function (error) {
    handleNoSheetNames(error);
  });
});

randomizeButton.addEventListener('click', function () {
  var noActivitySelectedContainers = document.querySelectorAll('.no-activity');
  var randomizedActivityContainers = document.querySelectorAll('.randomized-activity');
  var activities = _activityRandomizer2.default.getActivities();
  var filteredActivities = (0, _filters.filterActivities)(activities, (0, _filters.getFilters)());

  if (filteredActivities.length > 0) {
    var randomIndex = Math.floor(Math.random() * filteredActivities.length);

    insertRandomizedActivity(filteredActivities[randomIndex]);

    noActivitySelectedContainers.forEach(function (el) {
      el.style.display = 'none';
    });
    randomizedActivityContainers.forEach(function (el) {
      el.style.display = 'block';
    });
  } else {
    // When there are no activities available
    (0, _dom2.setActivityContainerContent)('<div class="col">You filtered out all activities in your sheet.</div>');
  }
});

timeRange.addEventListener('change', function (e) {
  var rangeValue = e.target.value;
  var timeRangeValue = document.querySelector('[time-range-value]');

  timeRangeValue.textContent = rangeValue;
});

removeFiltersButton.addEventListener('click', function () {
  // restore to the original state of the filters
  var activities = _activityRandomizer2.default.getActivities();
  (0, _dom.setTimeRangeMaxValue)(activities);
});

// Add a click event listener to every button in viewListButtons
viewListButtons.forEach(function (btn) {
  btn.addEventListener('click', function () {
    var documentIsValid = _activityRandomizer2.default.getDocumentValidity();

    if (documentIsValid) {
      var activities = _activityRandomizer2.default.getActivities();
      var filteredActivities = (0, _filters.filterActivities)(activities, (0, _filters.getFilters)());

      if (filteredActivities.length > 0) {
        // Fill the activityListContainers with the filtered activities.
        (0, _dom2.removeActivityListContainersInnerHTML)();
        filteredActivities.forEach(function (activity) {
          (0, _dom2.appendActivity)(activity.name, activity.time);
        });
      } else {
        (0, _dom2.setActivityContainerContent)('<div class="col">You filtered out all activities in your sheet.</div>');
      }
    } else {
      // sheet is invalid, do error handling
      (0, _dom2.setActivityContainerContent)('<div class="col">The currently selected sheet does not contain activities.</div>');
    }
  });
});

/***/ }),

/***/ "./src/js/modules/activity-randomizer/dom.js":
/*!***************************************************!*\
  !*** ./src/js/modules/activity-randomizer/dom.js ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setActivityContainerContent = exports.removeActivityListContainersInnerHTML = exports.appendActivity = exports.appendMessage = exports.getDocumentID = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _cookies = __webpack_require__(/*! ../cookies/cookies */ "./src/js/modules/cookies/cookies.js");

var _cookies2 = _interopRequireDefault(_cookies);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @returns example document ID or the ID from the document input
 */
var getDocumentIDFromdocumentLinkInput = function getDocumentIDFromdocumentLinkInput() {
  var documentLinkInput = document.getElementById('sheet-input');
  var defaultDocumentID = '1hqNuYTfAguDAXDWA9L14BarfqwVOWSGsd6IpuWNX2BE';
  var documentID = '';

  // Use the regex if it is a url, otherwise take the ID
  if (documentLinkInput.value.indexOf('docs.google.com/spreadsheets') > 0) {
    var googleSheetsDocumentIDRegex = new RegExp(/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
    // sheet link
    var regexResult = documentLinkInput.value.match(googleSheetsDocumentIDRegex);

    var _regexResult = _slicedToArray(regexResult, 2);

    documentID = _regexResult[1];
  } else {
    documentID = documentLinkInput.value === '' ? defaultDocumentID : documentLinkInput.value;
  }

  return documentID;
};

/**
 * Gets the document ID associated with the users Google Sheets.
 * documentID is changed when the sheetSubmitButton is clicked.
 * It is the document ID from the google sheets URL.
 */
var getDocumentID = function getDocumentID() {
  var cookies = (0, _cookies2.default)();
  var documentID = '';

  if (cookies.preferredSheet !== undefined) {
    // Check the cookies for a saved document ID
    documentID = cookies.preferredDoc;
  } else {
    // Check the sheet input for a document ID
    documentID = getDocumentIDFromdocumentLinkInput();
  }

  return documentID;
};

/**
 * Append a pre element to the body containing the given message
 * as its text node. Used to display the results of the API call.
 *
 * @param {string} message Text to be placed in pre element.
 */
var appendMessage = function appendMessage(message) {
  var activityListContainers = document.querySelectorAll('[sheet-content]');

  activityListContainers.forEach(function (contentContainer) {
    var col = document.createElement('div');
    var textContent = document.createTextNode(message);
    col.classList.add('col-sm-12');
    col.appendChild(textContent);
    contentContainer.appendChild(col);
  });
};
var appendActivity = function appendActivity(activity, time) {
  appendMessage(activity + ', ' + time + ' minutes.\n');
};
var setActivityContainerContent = function setActivityContainerContent(content) {
  var activityListContainers = document.querySelectorAll('[sheet-content]');

  activityListContainers.forEach(function (container) {
    container.innerHTML = content;
  });
};
var removeActivityListContainersInnerHTML = function removeActivityListContainersInnerHTML() {
  setActivityContainerContent('');
};

exports.getDocumentID = getDocumentID;
exports.appendMessage = appendMessage;
exports.appendActivity = appendActivity;
exports.removeActivityListContainersInnerHTML = removeActivityListContainersInnerHTML;
exports.setActivityContainerContent = setActivityContainerContent;

/***/ }),

/***/ "./src/js/modules/activity-randomizer/filters/dom.js":
/*!***********************************************************!*\
  !*** ./src/js/modules/activity-randomizer/filters/dom.js ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.disableFilters = exports.setTimeRangeMaxValue = undefined;

var _activityRandomizer = __webpack_require__(/*! ../state/activity-randomizer */ "./src/js/modules/activity-randomizer/state/activity-randomizer.js");

var _activityRandomizer2 = _interopRequireDefault(_activityRandomizer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var setTimeRangeMaxValue = function setTimeRangeMaxValue(activities) {
  var timeRange = document.querySelector('[time-range]');
  var timeRangeValue = document.querySelector('[time-range-value]');
  var timeRangeMaxValueIndicator = document.querySelector('.max');

  timeRange.disabled = true;
  var activitiesToCheckForMaxTime = activities || _activityRandomizer2.default.getActivities();
  var maxTime = null;

  maxTime = activitiesToCheckForMaxTime.reduce(function (accumulator, currentActivity) {
    var time = Number(currentActivity.time);
    return time > accumulator ? time : accumulator;
  }, null);

  timeRange.max = maxTime;
  timeRange.value = maxTime;
  timeRangeMaxValueIndicator.innerHTML = maxTime;
  timeRangeValue.textContent = timeRange.value;

  if (timeRange.disabled === true && timeRange.max !== 'null') {
    timeRange.disabled = false;
  }
};

var disableFilters = function disableFilters() {
  var timeRange = document.querySelector('[time-range]');
  timeRange.disabled = true;
};

exports.setTimeRangeMaxValue = setTimeRangeMaxValue;
exports.disableFilters = disableFilters;

/***/ }),

/***/ "./src/js/modules/activity-randomizer/filters/filters.js":
/*!***************************************************************!*\
  !*** ./src/js/modules/activity-randomizer/filters/filters.js ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var getFilters = function getFilters() {
  var timeRange = document.querySelector('[time-range]');

  var filters = {
    maxTime: timeRange.value
  };
  filters.maxTime = timeRange.value;

  return filters;
};

var filterActivities = function filterActivities(activities, filters) {
  /**
   * // filter based on time
   * Because activity.time is a string it needs to be converted
   * to a number before comparing it to the value of the time range.
   */
  var filteredActivities = activities.filter(function (activity) {
    return Number(activity.time) <= filters.maxTime;
  });
  return filteredActivities;
};

var handleCompletelyFilteredOutActivities = function handleCompletelyFilteredOutActivities() {};

exports.getFilters = getFilters;
exports.filterActivities = filterActivities;
exports.handleCompletelyFilteredOutActivities = handleCompletelyFilteredOutActivities;

/***/ }),

/***/ "./src/js/modules/activity-randomizer/state/activity-randomizer.js":
/*!*************************************************************************!*\
  !*** ./src/js/modules/activity-randomizer/state/activity-randomizer.js ***!
  \*************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var activityRandomizer = {
  activitiesFromSheet: [],
  documentValid: false,

  getActivities: function getActivities() {
    return this.activitiesFromSheet;
  },
  setActivities: function setActivities(newActivities) {
    this.activitiesFromSheet = newActivities;
    return this;
  },
  getDocumentValidity: function getDocumentValidity() {
    return this.documentValid;
  },
  setDocumentValidity: function setDocumentValidity(validity) {
    this.documentValid = validity;
    return this;
  }
};

exports.default = activityRandomizer;

/***/ }),

/***/ "./src/js/modules/cookies/cookies.js":
/*!*******************************************!*\
  !*** ./src/js/modules/cookies/cookies.js ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _jsCookie = __webpack_require__(/*! js-cookie */ "./node_modules/js-cookie/src/js.cookie.js");

var _jsCookie2 = _interopRequireDefault(_jsCookie);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var getCookies = function getCookies() {
  var cookies = {};

  cookies.hasConfiguredCookies = _jsCookie2.default.get('_cookies_configured');
  cookies.allowPreferences = _jsCookie2.default.get('_allow_preferences');
  cookies.preferredDoc = _jsCookie2.default.get('_ra_preference_doc');
  cookies.preferredSheet = _jsCookie2.default.get('_ra_preference_sheet');

  return cookies;
};

var fillCurrentCookieSettings = function fillCurrentCookieSettings(cookies, cookieModal) {
  if (cookies.allowPreferences === 'true') {
    cookieModal.querySelector('[data-cookie-preferences-checkbox]').checked = true;
  } else {
    cookieModal.querySelector('[data-cookie-preferences-checkbox]').checked = false;
  }
};

var disableScrolling = function disableScrolling() {
  document.querySelector('body').style.overflow = 'hidden';
};
var enableScrolling = function enableScrolling() {
  document.querySelector('body').style.overflow = '';
};
var setNewCookieSettings = function setNewCookieSettings(settings) {
  _jsCookie2.default.set('_allow_preferences', settings.preferences);
};

var checkCookieCheckboxes = function checkCookieCheckboxes(cookieModal) {
  var cookiePreferenceCheckbox = cookieModal.querySelector('[data-cookie-preferences-checkbox]');
  var preferencesAllowed = cookiePreferenceCheckbox.checked;

  var cookieSettingsFromPopUp = {
    preferences: preferencesAllowed
  };

  return cookieSettingsFromPopUp;
};

/**
 * @param {*} cookies
 * @description shows or hides elements based on a user's cookies
 */
var handleCookieElements = function handleCookieElements(cookies) {
  if (cookies.hasConfiguredCookies !== undefined) {
    /** Remove hidden class if preference cookies are allowed
     *  Else add the class
     */
    if (cookies.allowPreferences === 'true') {
      document.querySelectorAll('[data-preference-cookie]').forEach(function (element) {
        element.classList.remove('hidden');
      });
    } else {
      document.querySelectorAll('[data-preference-cookie]').forEach(function (element) {
        element.classList.add('hidden');
      });
    }
  } else {
    // hasConfiguredCookies === undefined
  }
};

var addCookieModalEventListeners = function addCookieModalEventListeners(cookieModal) {
  var cookieClose = cookieModal.querySelector('[data-cookie-modal-close]');
  var cookieSubmit = cookieModal.querySelector('[data-cookies-submit]');

  cookieClose.addEventListener('click', function () {
    cookieModal.classList.remove('opened');
    enableScrolling();
  });
  cookieSubmit.addEventListener('click', function () {
    _jsCookie2.default.set('_cookies_configured', true);
    var cookieSettings = checkCookieCheckboxes(cookieModal);
    setNewCookieSettings(cookieSettings);
    handleCookieElements(getCookies());
    enableScrolling();
    cookieModal.classList.remove('opened');
  });
};

var showCookieModal = function showCookieModal(cookies) {
  var cookieModal = document.querySelector('.cookie-modal-wrapper');

  fillCurrentCookieSettings(cookies, cookieModal);
  disableScrolling();
  addCookieModalEventListeners(cookieModal);
  cookieModal.classList.add('opened');
};

/**
 * @param {} cookies from the getCookies function
 * It is called when the page loads.
 */
var handleCookies = function handleCookies(cookies) {
  if (cookies) {
    if (cookies.hasConfiguredCookies === undefined) {
      if (_jsCookie2.default.get('_cookies_configured') !== 'true') {
        showCookieModal(cookies);
      }
    } else if (cookies.hasConfiguredCookies === 'true') {
      handleCookieElements(cookies);
    } else {
      // cookies probably edited or removed
    }
  }
};

/**
 * Event listener for every element that has the
 * open-cookies attribute.
 * It opens the cookie modal.
 * */
var openCookies = document.querySelectorAll('[open-cookies]');

openCookies.forEach(function (openCookiesButton) {
  openCookiesButton.addEventListener('click', function () {
    showCookieModal(getCookies());
  });
});

handleCookies(getCookies());

exports.default = getCookies;

/***/ })

/******/ });
//# sourceMappingURL=activityrandomizer.entry.js.map