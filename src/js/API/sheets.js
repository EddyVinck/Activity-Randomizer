// Client ID and API key from the Developer Console
const CLIENT_ID = '855790869281-iie5tqafurs5179pmr8s236n595o4460.apps.googleusercontent.com';
const API_KEY = 'AIzaSyDxKJyIUDRnU7xTz6_CWAGxZkDiytZtpA4';

// Array of API discovery doc URLs for APIs used by the quickstart
const DISCOVERY_DOCS = [
  "https://sheets.googleapis.com/$discovery/rest?version=v4",
  "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"
];

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
const SCOPES = "https://www.googleapis.com/auth/spreadsheets.readonly https://www.googleapis.com/auth/calendar.readonly";

// documentID is changed when sheetSubmit is clicked. It is the document ID from the google sheets URL.
let documentID = '1hqNuYTfAguDAXDWA9L14BarfqwVOWSGsd6IpuWNX2BE';

const authorizeButton = document.getElementById('authorize-button');
const signoutButton = document.getElementById('signout-button');
const documentInput = document.getElementById('sheet-input');
const sheetSubmit = document.getElementById('sheet-submit');
const sheetDropdown = document.getElementById('sheet-names');
const randomizeBtn = document.getElementById('pick-activity');
const pickedActivity = document.getElementById('picked-activity');
const sheetContentContainer = document.querySelectorAll('[sheet-content]');
const timeRange = document.querySelector('[time-range]');
const timeRangeValue = document.querySelector('[time-range-value]');
const filterSubmit = document.getElementById('filter-submit');
const removeFiltersBtn = document.getElementById('remove-filters');
const noActivityContainers = document.querySelectorAll('.no-activity');
const randomizedActivityContainers = document.querySelectorAll('.randomized-activity');
const viewListBtns = document.querySelectorAll('[data-target="#viewCurrentActivities"]');

// The activities array will hold all activities from a sheet
let activities = [];

/**
 *  On load, called to load the auth2 library and API client library.
 *  Calls initClient.
 */
window.handleClientLoad = function() {
  gapi.load('client:auth2', initClient);
}

/**
 *  Initializes the API client library and sets up sign-in state
 *  listeners.
 */
function initClient() {
  gapi.client.init({
    apiKey: API_KEY,
    clientId: CLIENT_ID,
    discoveryDocs: DISCOVERY_DOCS,
    scope: SCOPES
  }).then(function () {
    // Listen for sign-in state changes.
    gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

    // Handle the initial sign-in state.
    updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
    authorizeButton.onclick = handleAuthClick;
    signoutButton.onclick = handleSignoutClick;
  });
}

/**
 *  Called when the signed in status changes, to update the UI
 *  appropriately. After a sign-in, the API is called.
 */
function updateSigninStatus(isSignedIn) {
  if (isSignedIn) {
    authorizeButton.style.display = 'none';
    signoutButton.style.display = 'block';
    getSheetNames(documentID);
    listActivities(documentID);
  } else {
    authorizeButton.style.display = 'block';
    signoutButton.style.display = 'none';
  }
}

/**
 *  Sign in the user upon button click.
 */
function handleAuthClick(event) {
  gapi.auth2.getAuthInstance().signIn();
}

/**
 *  Sign out the user upon button click.
 */
function handleSignoutClick(event) {
  gapi.auth2.getAuthInstance().signOut();
}

/**
 * Append a pre element to the body containing the given message
 * as its text node. Used to display the results of the API call.
 *
 * @param {string} message Text to be placed in pre element.
 */
function appendPre(message) {
  const content = document.querySelectorAll('content');
  const textContent = document.createTextNode(message + '\n');
  content.appendChild(textContent);
}
function appendCol(activity, time) {
  sheetContentContainer.forEach(contentContainer => {
    const col = document.createElement("div");
    const textContent = document.createTextNode(activity + ", " + time + " minutes." + '\n');
    col.classList.add("col-sm-12");
    col.appendChild(textContent);
    contentContainer.appendChild(col);
  })
}

/**
 * Print the names and majors of students in a sample spreadsheet:
 * https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit
 */
function listActivities(documentID, sheetName) {
  let sheetPrefix = sheetName ? (sheetName + '!') : '';
  sheetContentContainer.forEach(ct => ct.innerHTML = '<div class="col">Loading data...</div>');

  gapi.client.sheets.spreadsheets.values.get({
    spreadsheetId: documentID || '1hqNuYTfAguDAXDWA9L14BarfqwVOWSGsd6IpuWNX2BE',
    range: sheetPrefix + 'A2:D',
  }).then(function (response) {
    const range = response.result;
    
    // Sometimes range.values has no values so it is not returned from the response
    // This is why it needs to be checked before the length is checked.
    if (range.values && range.values.length > 0) {      
      // Reset the activities array
      activities = [];

      sheetContentContainer.forEach(ct => ct.innerHTML = '');
      for (let i = 0; i < range.values.length; i++) {
        const row = range.values[i];

        // Print columns A and B, which correspond to indices 0 and 1.
        appendCol(row[0],row[1]);

        activities.push({
          name: row[0],
          time: row[1],
          rating: row[2],
          description: row[3] || 'No description'
        });
        
      }      
      setTimeRangeMaxValue();
      documentInput.classList.remove('is-invalid');
    } else {

      sheetContentContainer.forEach(ct => ct.innerHTML = '<div class="col">No data found. :(</div>');
      disableFilters();
    }
  }, function (response) {
    documentInput.classList.add('is-invalid');
    disableFilters();
    console.log('error: ' + response.result.error.message);
    appendPre('Error: ' + response.result.error.message);
  });
}

function getSheetNames(documentID) {
  gapi.client.sheets.spreadsheets.get({
    spreadsheetId: documentID
  }).then(function(response) {
    insertSheetNames(response.result.sheets, sheetDropdown); // array        
  }, function(reason) {
    console.error('error: ' + reason.result.error.message);
  });
}

function getSheet(documentID, sheetName) {
  listActivities(documentID, sheetName);
}

function insertSheetNames(sheetNames, select) {
  // select.style.display = "inline-block";
  select.disabled = true;
  select.innerHTML = '<option class="loading-option">Loading sheet names...</option>';
  sheetNames.forEach(sheet => {
    let sheetName = sheet.properties.title;

    if(sheetName.toLowerCase() !== 'info') {
      let option = document.createElement('option');
      option.text = sheetName;
      option.value = sheetName;
      select.appendChild(option);

      if(option.value.toLowerCase() === 'example template') {
        select.value = option.value;
        // Manually dispatch a change event
        select.dispatchEvent(new Event('change'));
      }
    }        
  });
  // Remove the loading option
  select.removeChild(select.querySelector('.loading-option'));
  select.disabled = false;
}

function insertRandomizedActivity(pick) {
  pickedActivity.querySelector('.card-title h2').innerHTML = pick.name;
  pickedActivity.querySelector('.card-text').innerHTML = pick.description + '<br>' + pick.time + ' minutes.';
}

sheetDropdown.addEventListener('change', (event) => {
  let sheetName = event.target.value;
  listActivities(documentID, sheetName);
});

sheetSubmit.addEventListener('click', function() {      
  if((documentInput.value).indexOf('docs.google.com/spreadsheets') > 0) {
    const googleSheetsDocumentIDRegex = new RegExp(/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
    // sheet link
    const regexResult = documentInput.value.match(googleSheetsDocumentIDRegex);
    documentID = regexResult[1];
  } else {
    documentID = documentInput.value == '' ? documentID : documentInput.value;
  }

  getSheet(documentID);
  getSheetNames(documentID);
});

randomizeBtn.addEventListener('click', () => {
  let theArrayToFilter = filterActivities(activities, checkFilters()); 

  if(theArrayToFilter.length > 0) {
    let random = Math.floor(Math.random()*theArrayToFilter.length);
    insertRandomizedActivity(theArrayToFilter[random]);
    noActivityContainers.forEach(function(el) {
      el.style.display = 'none';
    });
    randomizedActivityContainers.forEach(function(el) {
      el.style.display = 'block';
    });
  } else {
    sheetContentContainer.forEach(ct => ct.innerHTML = '<div class="col">You filtered out all activities in your sheet.</div>');
    console.log('No activities available');
  }
  
});

function setTimeRangeMaxValue(activ) {
  timeRange.disabled = true;
  activ = activ || activities;
  let maxTime = null;

  maxTime = activ.reduce((accumulator, currentActivity) => {
    let time = Number(currentActivity.time);
    return time > accumulator ? time : accumulator;        
  }, null);
  timeRange.max = maxTime;
  timeRange.value = maxTime;
  timeRangeValue.textContent = timeRange.value;
  if(timeRange.disabled == true && timeRange.max != 'null') timeRange.disabled = false;
}

function disableFilters() {
  timeRange.disabled = true;
}

timeRange.addEventListener('change', function(e) {
  const rangeValue = e.target.value;
  timeRangeValue.textContent = rangeValue;
});

function filterActivities(actvts, filters) {
  // filter based on time
  const filtered = actvts.filter((activity) => {
    // Because activity.time is a string it needs to be converted
    // to a number before comparing it to the value of the time range.
    return Number(activity.time) <= filters.maxTime;
  });
  return filtered;
}

removeFiltersBtn.addEventListener('click', () => {
  // restore to the original state of the filters
  setTimeRangeMaxValue(activities);
});

function checkFilters() {
  const filters = {};
  filters.maxTime = timeRange.value;

  return filters;
}

viewListBtns.forEach(function(btn) {
  btn.addEventListener('click', function(e){
    const filtered =  filterActivities(activities, checkFilters());
    if(filtered.length > 0) {
      sheetContentContainer.forEach(ct => ct.innerHTML = '');
      filtered.forEach(function(activity){
        appendCol(activity.name, activity.time);
      });
    } else {
      sheetContentContainer.forEach(ct => ct.innerHTML = '<div class="col">You filtered out all activities in your sheet.</div>');
    }
  });
});