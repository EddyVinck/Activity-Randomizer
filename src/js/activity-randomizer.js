import { getCookies } from './cookies/cookies';

/**
 * TODO: figure out what noActivityContainers does
 * TODO: JSdoc functions https://code.visualstudio.com/docs/languages/javascript
 */

const activityRandomzizer = {
  activitiesFromSheet: [],

  getActivities() {
    return this.activitiesFromSheet;
  },
  setActivities(newActivities) {
    this.activitiesFromSheet = newActivities;
  }
}

/**
 *  On load, called to load the auth2 library and API client library.
 *  Calls initClient.
 *  It's on the window object because it needs to be accessible to the Google Sheets script.
 */
window.handleClientLoad = () => {
  gapi.load('client:auth2', initClient);
}

/**
 *  Initializes the API client library and sets up sign-in state
 *  listeners.
 */
const initClient = () => {
  const authorizeButton = document.getElementById('authorize-button');
  const signoutButton = document.getElementById('signout-button');

  // Client ID and API key from the Developer Console
  const CLIENT_ID = '855790869281-iie5tqafurs5179pmr8s236n595o4460.apps.googleusercontent.com';
  const API_KEY = 'AIzaSyDxKJyIUDRnU7xTz6_CWAGxZkDiytZtpA4';

  // Array of API discovery doc URLs for APIs used by the quickstart
  const DISCOVERY_DOCS = [
    'https://sheets.googleapis.com/$discovery/rest?version=v4',
    'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'
  ];

  /* Authorization scopes required by the API; multiple scopes can be
   included, separated by spaces. */
  const SCOPES = 'https://www.googleapis.com/auth/spreadsheets.readonly https://www.googleapis.com/auth/calendar.readonly';

  gapi.client.init({
    apiKey: API_KEY,
    clientId: CLIENT_ID,
    discoveryDocs: DISCOVERY_DOCS,
    scope: SCOPES
  }).then(() => {
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
const updateSigninStatus = (isSignedIn) => {
  const authorizeButton = document.getElementById('authorize-button');
  const signoutButton = document.getElementById('signout-button');

  if (isSignedIn) {
    const documentID = getDocumentID();

    authorizeButton.style.display = 'none';
    signoutButton.style.display = 'inline-block';

    getSheetNames(documentID);
    listActivities(documentID);
  } else {
    authorizeButton.style.display = 'inline-block';
    signoutButton.style.display = 'none';
  }
}

/**
 *  Sign in the user upon button click.
 */
const handleAuthClick = (event) => {
  gapi.auth2.getAuthInstance().signIn();
}

/**
 *  Sign out the user upon button click.
 */
const handleSignoutClick = (event) => {
  gapi.auth2.getAuthInstance().signOut();
}

/**
 * Append a pre element to the body containing the given message
 * as its text node. Used to display the results of the API call.
 *
 * @param {string} message Text to be placed in pre element.
 */
const appendPre = (message) => {
  const content = document.querySelectorAll('content');
  const textContent = document.createTextNode(message + '\n');
  content.appendChild(textContent);
}
const appendCol = (activity, time) => {
  const sheetContentContainers = document.querySelectorAll('[sheet-content]');

  sheetContentContainers.forEach(contentContainer => {
    const col = document.createElement('div');
    const textContent = document.createTextNode(activity + ', ' + time + ' minutes.' + '\n');
    col.classList.add('col-sm-12');
    col.appendChild(textContent);
    contentContainer.appendChild(col);
  });
}

/**
 * Print the names and majors of students in a sample spreadsheet:
 * https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit
 */
const listActivities = (documentID, sheetName) => {
  const documentInput = document.getElementById('sheet-input');
  const sheetContentContainers = document.querySelectorAll('[sheet-content]');

  let sheetPrefix = sheetName ? (sheetName + '!') : '';
  const sheetCellRange = 'A2:D';
  sheetContentContainers.forEach(ct => ct.innerHTML = '<div class="col">Loading data...</div>');

  gapi.client.sheets.spreadsheets.values.get({
    spreadsheetId: documentID || '1hqNuYTfAguDAXDWA9L14BarfqwVOWSGsd6IpuWNX2BE',
    range: sheetPrefix + sheetCellRange,
  }).then((response) => {
    const range = response.result;
    
    /**
     *  Sometimes range.values has no values so it is not returned from the response
     * This is why it needs to be checked before the length is checked. 
     **/
    if (range.values && range.values.length > 0) {      
      // Reset the activities array
      const activities = [];

      sheetContentContainers.forEach(ct => ct.innerHTML = '');
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

      activityRandomzizer.setActivities(activities);
      setTimeRangeMaxValue();
      documentInput.classList.remove('is-invalid');
    } else {
      sheetContentContainers.forEach(ct => ct.innerHTML = '<div class="col">No data found. :(</div>');
      disableFilters();
    }
  }, (response) => {
    documentInput.classList.add('is-invalid');
    disableFilters();
    console.log('error: ' + response.result.error.message);
    appendPre('Error: ' + response.result.error.message);
  });
}

const getSheetNames = (documentID) => {
  gapi.client.sheets.spreadsheets.get({
    spreadsheetId: documentID
  }).then((response) => {
    insertSheetNames(response.result.sheets); // array        
  }, (reason) => {
    console.error('error: ' + reason.result.error.message);
  });
}

/**
 * 
 * @param {array} sheetNames 
 */
const insertSheetNames = (sheetNames) => {
  const sheetButtonContainer = document.querySelector('.sheet-button-container');
  sheetButtonContainer.innerHTML = '';

  sheetNames.forEach(sheet => {
    let sheetName = sheet.properties.title.toLowerCase();

    // Add the sheets as buttons
    if(sheetName !== 'info') {
      sheetButtonContainer.innerHTML += `<button class="btn btn-sm" value="${sheetName}">${sheetName}</button>`;      
    }

    let sheetButtons = sheetButtonContainer.querySelectorAll('button');

    // Add the click listeners for the buttons
    sheetButtons.forEach((btn, index, buttons) => {
      btn.addEventListener('click', (e) => {
        /**
         * Change the active button
         * Load activities based on active button
        */
        buttons.forEach((btn) => {
          btn.classList.remove('btn-primary');
        });
        btn.classList.add('btn-primary');

        let sheetName = e.target.value;
        let documentID = getDocumentID();
        listActivities(documentID, sheetName);
      });

      if(index === 0) {          
        // Manually dispatch a click event
        btn.dispatchEvent(new Event('click'));
        btn.classList.add('btn-primary');
      }
    });   
  });
}

/**
 * Gets the document ID associated with the users Google Sheets.
 * documentID is changed when the sheetSubmitButton is clicked. It is the document ID from the google sheets URL.
 */
const getDocumentID = () => {
  const cookies = getCookies();
  let documentID = '';
  
  if(cookies.preferredSheet !== undefined) {
    // Check the cookies for a saved document ID
    documentID = cookies.preferredDoc;
  } else {
    // Check the sheet input for a document ID
    documentID = getDocumentIDFromDocumentInput();
  }

  return documentID;
}

/**
 * @returns example document ID or the ID from the document input
 */
const getDocumentIDFromDocumentInput = () => {
  const documentInput = document.getElementById('sheet-input');
  const defaultDocumentID = '1hqNuYTfAguDAXDWA9L14BarfqwVOWSGsd6IpuWNX2BE';
  let documentID = '';
  
  // Use the regex if it is a url, otherwise take the ID
  if((documentInput.value).indexOf('docs.google.com/spreadsheets') > 0) {
    const googleSheetsDocumentIDRegex = new RegExp(/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
    // sheet link
    const regexResult = documentInput.value.match(googleSheetsDocumentIDRegex);
    documentID = regexResult[1];
  } else {
    documentID = documentInput.value == '' ? defaultDocumentID : documentInput.value;
  }

  return documentID;
}

/**
 * @description Puts an activity in the picked activity card
 * @param {activity} activity 
 */
const insertRandomizedActivity = (activity) => {
  const pickedActivity = document.getElementById('picked-activity');

  pickedActivity.querySelector('.card-title h2').innerHTML = activity.name;
  pickedActivity.querySelector('.card-text').innerHTML = activity.description + '<br>' + activity.time + ' minutes.';
}

const setTimeRangeMaxValue = (activities) => {
  const timeRangeValue = document.querySelector('[time-range-value]');
  const timeRangeMaxValueIndicator = document.querySelector('.max');
  
  timeRange.disabled = true;
  activities = activities || activityRandomzizer.getActivities();
  let maxTime = null;

  maxTime = activities.reduce((accumulator, currentActivity) => {
    let time = Number(currentActivity.time);
    return time > accumulator ? time : accumulator;        
  }, null);
  timeRange.max = maxTime;
  timeRange.value = maxTime;
  timeRangeMaxValueIndicator.innerHTML = maxTime;
  timeRangeValue.textContent = timeRange.value;

  if(timeRange.disabled == true && timeRange.max != 'null') {
    timeRange.disabled = false;
  } 
}

const getFilters = () => {
  const timeRange = document.querySelector('[time-range]');

  const filters = {
    maxTime: timeRange.value
  };
  filters.maxTime = timeRange.value;

  return filters;
}

const disableFilters = () => {
  timeRange.disabled = true;
}

const filterActivities = (activities, filters) => {
  // filter based on time
  const filtered = activities.filter((activity) => {
    /**
     * Because activity.time is a string it needs to be converted
     * to a number before comparing it to the value of the time range. 
     */
    return Number(activity.time) <= filters.maxTime;
  });
  return filtered;
}

// Elements with eventlisteners
const viewListButtons = document.querySelectorAll('[data-target="#viewCurrentActivities"]');
const timeRange = document.querySelector('[time-range]');
const randomizeButton = document.getElementById('pick-activity');
const sheetSubmitButton = document.getElementById('sheet-submit');
const removeFiltersButton = document.getElementById('remove-filters');

sheetSubmitButton.addEventListener('click', () => {  
  let documentID = getDocumentID();

  listActivities(documentID);
  getSheetNames(documentID);
});

randomizeButton.addEventListener('click', () => {
  const sheetContentContainers = document.querySelectorAll('[sheet-content]');
  const noActivityContainers = document.querySelectorAll('.no-activity');
  const randomizedActivityContainers = document.querySelectorAll('.randomized-activity');
  const activities = activityRandomzizer.getActivities(); 
  let filteredActivities = filterActivities(activities, getFilters()); 

  if(filteredActivities.length > 0) {
    let randomIndex = Math.floor(Math.random()*filteredActivities.length);

    insertRandomizedActivity(filteredActivities[randomIndex]);

    noActivityContainers.forEach((el) => {
      el.style.display = 'none';
    });
    randomizedActivityContainers.forEach((el) => {
      el.style.display = 'block';
    });
  } else {
    sheetContentContainers.forEach(ct => ct.innerHTML = '<div class="col">You filtered out all activities in your sheet.</div>');
    console.log('No activities available');
  }
  
});

timeRange.addEventListener('change', (e) => {
  const rangeValue = e.target.value;
  const timeRangeValue = document.querySelector('[time-range-value]');

  timeRangeValue.textContent = rangeValue;
});

removeFiltersButton.addEventListener('click', () => {
  // restore to the original state of the filters
  const activities = activityRandomzizer.getActivities();
  setTimeRangeMaxValue(activities);
});

/**
 * Add a click event listener to every button in viewListButtons
 * Fill the sheetContentContainers (containers that should have the list of activities)
 * with the filtered activities.
 */
viewListButtons.forEach((btn) => {
  const sheetContentContainers = document.querySelectorAll('[sheet-content]');

  btn.addEventListener('click', (e) => {
    const activities = activityRandomzizer.getActivities();
    const filteredActivities =  filterActivities(activities, getFilters());

    if(filteredActivities.length > 0) {
      sheetContentContainers.forEach((ct) => ct.innerHTML = '');
      filteredActivities.forEach((activity) => {
        appendCol(activity.name, activity.time);
      });
    } else {
      sheetContentContainers.forEach((ct) => {
        ct.innerHTML = '<div class="col">You filtered out all activities in your sheet.</div>';
      });
    }
  });
});





