import activityRandomzizer from './partials/activity-randomizer/state/activity-randomizer';
import { getFilters, filterActivities } from './partials/activity-randomizer/filters/filters';
import { setTimeRangeMaxValue, disableFilters } from './partials/activity-randomizer/filters/dom';
import { getDocumentID, appendPre, appendCol } from './partials/activity-randomizer/dom';

/**
 * TODO: JSdoc functions https://code.visualstudio.com/docs/languages/javascript
 * TODO: Handle console.error cases and look for other possible failing cases
 */

/**
 * Lists activities in the sheetContentContainers or shows an error if that fails.
 * Also calls activityRandomizer.setActivities to set the activities.
 */
const listActivities = (documentID, sheetName) => {
  const documentInput = document.getElementById('sheet-input');
  const sheetContentContainers = document.querySelectorAll('[sheet-content]');

  const sheetPrefix = sheetName ? `${sheetName}!` : '';
  const sheetCellRange = 'A2:D';
  sheetContentContainers.forEach((ct) => {
    ct.innerHTML = '<div class="col">Loading data...</div>';
  });

  gapi.client.sheets.spreadsheets.values
    .get({
      spreadsheetId: documentID,
      range: sheetPrefix + sheetCellRange,
    })
    .then(
      (response) => {
        const range = response.result;

        /**
         *  Sometimes range.values has no values so it is not returned from the response
         * This is why it needs to be checked before the length is checked.
         * */
        if (range.values && range.values.length > 0) {
          // Reset the activities array
          const activities = [];

          sheetContentContainers.forEach((ct) => {
            ct.innerHTML = '';
          });
          for (let i = 0; i < range.values.length; i += 1) {
            const cellRow = range.values[i];

            // Print columns A and B, which correspond to indices 0 and 1.
            appendCol(cellRow[0], cellRow[1]);

            activities.push({
              name: cellRow[0],
              time: cellRow[1],
              rating: cellRow[2],
              description: cellRow[3] || 'No description',
            });
          }

          activityRandomzizer.setActivities(activities);
          setTimeRangeMaxValue();
          documentInput.classList.remove('is-invalid');
        } else {
          sheetContentContainers.forEach((ct) => {
            ct.innerHTML = '<div class="col">No data found. :(</div>';
          });
          disableFilters();
        }
      },
      (response) => {
        documentInput.classList.add('is-invalid');
        disableFilters();
        appendPre(
          `error: ${
            response.result.error.message
          }. Make sure your Google Sheets document link is copied correctly.`
        );
        console.log(`error: ${response.result.error.message}`);
      }
    );
};

/**
 * @param {array} sheetNames
 */
const insertSheetNames = (sheetNames) => {
  const sheetButtonContainer = document.querySelector('.sheet-button-container');
  sheetButtonContainer.innerHTML = '';

  sheetNames.forEach((sheet) => {
    const sheetName = sheet.properties.title.toLowerCase();

    // Add the sheets as buttons
    if (sheetName !== 'info') {
      sheetButtonContainer.innerHTML += `<button class="btn btn-sm" value="${sheetName}">${sheetName}</button>`;
    }

    const sheetButtons = sheetButtonContainer.querySelectorAll('button');

    // Add the click listeners for the buttons
    sheetButtons.forEach((clickedButton, index, buttons) => {
      clickedButton.addEventListener('click', (e) => {
        /**
         * Change the active button
         * Load activities based on active button
         */
        buttons.forEach((button) => {
          button.classList.remove('btn-primary');
        });
        clickedButton.classList.add('btn-primary');

        const sheetToUse = e.target.value;
        const documentID = getDocumentID();
        listActivities(documentID, sheetToUse);
      });

      if (index === 0) {
        // Manually dispatch a click event
        clickedButton.dispatchEvent(new Event('click'));
        clickedButton.classList.add('btn-primary');
      }
    });
  });
};

const getSheetNames = (documentID) => {
  gapi.client.sheets.spreadsheets
    .get({
      spreadsheetId: documentID,
    })
    .then(
      (response) => {
        insertSheetNames(response.result.sheets); // array
      },
      (reason) => {
        console.error(`error: ${reason.result.error.message}`);
      }
    );
};

/**
 *  Called when the signed in status changes, to update the UI
 *  appropriately. After a sign-in, the API is called.
 */
const updateGoogleAPISignInStatus = (isSignedIn) => {
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
};

/**
 *  Sign in the user upon button click.
 */
const handleGoogleAPIAuthClick = () => {
  gapi.auth2.getAuthInstance().signIn();
};

/**
 *  Sign out the user upon button click.
 */

const handleGoogleAPISignoutClick = () => {
  gapi.auth2.getAuthInstance().signOut();
};

/**
 *  Initializes the API client library and sets up sign-in state
 *  listeners.
 */
const initClientForGoogleSheetsAPI = () => {
  const authorizeButton = document.getElementById('authorize-button');
  const signoutButton = document.getElementById('signout-button');

  // Client ID and API key from the Developer Console
  const CLIENT_ID = '855790869281-iie5tqafurs5179pmr8s236n595o4460.apps.googleusercontent.com';
  const API_KEY = 'AIzaSyDxKJyIUDRnU7xTz6_CWAGxZkDiytZtpA4';

  // Array of API discovery doc URLs for APIs used by the quickstart
  const DISCOVERY_DOCS = [
    'https://sheets.googleapis.com/$discovery/rest?version=v4',
    'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest',
  ];

  /* Authorization scopes required by the API; multiple scopes can be
   included, separated by spaces. */
  const SCOPES =
    'https://www.googleapis.com/auth/spreadsheets.readonly https://www.googleapis.com/auth/calendar.readonly';

  gapi.client
    .init({
      apiKey: API_KEY,
      clientId: CLIENT_ID,
      discoveryDocs: DISCOVERY_DOCS,
      scope: SCOPES,
    })
    .then(() => {
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
 *  Calls initClient.
 *  It's on the window object because it needs to be accessible to the Google Sheets script.
 */
window.handleClientLoad = () => {
  gapi.load('client:auth2', initClientForGoogleSheetsAPI);
};

/**
 * @description Puts an activity in the picked activity card
 * @param {activity} activity
 */
const insertRandomizedActivity = (activity) => {
  const pickedActivity = document.getElementById('picked-activity');

  pickedActivity.querySelector('.card-title h2').innerHTML = activity.name;
  pickedActivity.querySelector('.card-text').innerHTML = `${activity.description}<br>
  ${activity.time} minutes.`;
};

// Elements with eventlisteners
const viewListButtons = document.querySelectorAll('[data-target="#viewCurrentActivities"]');
const timeRange = document.querySelector('[time-range]');
const randomizeButton = document.getElementById('pick-activity');
const sheetSubmitButton = document.getElementById('sheet-submit');
const removeFiltersButton = document.getElementById('remove-filters');

sheetSubmitButton.addEventListener('click', () => {
  const documentID = getDocumentID();

  listActivities(documentID);
  getSheetNames(documentID);
});

randomizeButton.addEventListener('click', () => {
  const sheetContentContainers = document.querySelectorAll('[sheet-content]');
  // Containers with content for when a user has not generated an activity yet
  const noActivityContainers = document.querySelectorAll('.no-activity');
  const randomizedActivityContainers = document.querySelectorAll('.randomized-activity');
  const activities = activityRandomzizer.getActivities();
  const filteredActivities = filterActivities(activities, getFilters());

  if (filteredActivities.length > 0) {
    const randomIndex = Math.floor(Math.random() * filteredActivities.length);

    insertRandomizedActivity(filteredActivities[randomIndex]);

    noActivityContainers.forEach((el) => {
      el.style.display = 'none';
    });
    randomizedActivityContainers.forEach((el) => {
      el.style.display = 'block';
    });
  } else {
    // When there are no activities available
    sheetContentContainers.forEach((ct) => {
      ct.innerHTML = '<div class="col">You filtered out all activities in your sheet.</div>';
    });
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

  btn.addEventListener('click', () => {
    const activities = activityRandomzizer.getActivities();
    const filteredActivities = filterActivities(activities, getFilters());

    if (filteredActivities.length > 0) {
      sheetContentContainers.forEach((ct) => {
        ct.innerHTML = '';
      });
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
