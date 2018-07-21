import activityRandomizer from './modules/activity-randomizer/state/activity-randomizer';
import { getFilters, filterActivities } from './modules/activity-randomizer/filters/filters';
import { setTimeRangeMaxValue, disableFilters } from './modules/activity-randomizer/filters/dom';
import {
  getDocumentID,
  appendMessage,
  appendActivity,
  removeActivityListContainersInnerHTML,
  setActivityContainerContent,
} from './modules/activity-randomizer/dom';

// Lists activities in the activityListContainers or shows an error
const listActivities = (documentID, sheetName) => {
  const documentLinkInput = document.getElementById('sheet-input');
  const sheetCellRange = 'A2:D';

  const sheetPrefix = sheetName ? `${sheetName}!` : '';
  setActivityContainerContent('<div class="col">Loading data...</div>');

  gapi.client.sheets.spreadsheets.values
    .get({
      spreadsheetId: documentID,
      range: sheetPrefix + sheetCellRange,
    })
    .then(
      (response) => {
        const range = response.result;

        // Sometimes range.values empty and then it is not returned from the response
        if (range.values && range.values.length > 0) {
          const activities = [];
          activityRandomizer.setDocumentValidity(true);

          removeActivityListContainersInnerHTML();
          for (let i = 0; i < range.values.length; i += 1) {
            const cellRow = range.values[i];

            // Print columns A and B, which correspond to indices 0 and 1.
            appendActivity(cellRow[0], cellRow[1]);

            activities.push({
              name: cellRow[0],
              time: cellRow[1],
              rating: cellRow[2],
              description: cellRow[3] || 'No description',
            });
          }

          activityRandomizer.setActivities(activities);
          setTimeRangeMaxValue();
          documentLinkInput.classList.remove('is-invalid');
        } else {
          setActivityContainerContent('<div class="col">No data found. :(</div>');
          disableFilters();
        }
      },
      // Handle rejected document
      () => {
        documentLinkInput.classList.add('is-invalid');
        activityRandomizer.setDocumentValidity(false);
        removeActivityListContainersInnerHTML();
        appendMessage('error: Make sure your Google Sheets document link is copied correctly.');
        disableFilters();
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

    // Add the sheets as buttons, except for the info sheet
    if (sheetName !== 'info') {
      sheetButtonContainer.innerHTML += `<button class="btn btn-sm" value="${sheetName}">${sheetName}</button>`;
    }

    const sheetButtons = sheetButtonContainer.querySelectorAll('button');

    // Add the click listeners for the buttons
    sheetButtons.forEach((clickedButton, index, buttons) => {
      clickedButton.addEventListener('click', (e) => {
        // Change the active button
        buttons.forEach((button) => {
          button.classList.remove('btn-primary');
        });
        clickedButton.classList.add('btn-primary');

        const sheetToUse = e.target.value;
        const documentID = getDocumentID();
        listActivities(documentID, sheetToUse);
      });

      if (index === 0) {
        clickedButton.dispatchEvent(new Event('click'));
        clickedButton.classList.add('btn-primary');
      }
    });
  });
};

const handleNoSheetNames = (error) => {
  insertSheetNames([]);
  disableFilters();
  activityRandomizer.setDocumentValidity(false);
  appendMessage(`Getting sheet names failed: ${error}`);
};

const getSheetNames = (documentID) =>
  new Promise((resolve, reject) => {
    gapi.client.sheets.spreadsheets
      .get({
        spreadsheetId: documentID,
      })
      .then(
        (response) => {
          resolve(response.result.sheets);
        },
        (response) => {
          reject(response.result.error.message);
        }
      );
  });

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

    getSheetNames(documentID)
      .then(insertSheetNames)
      .catch((error) => {
        handleNoSheetNames(error);
      });
    listActivities(documentID);
  } else {
    authorizeButton.style.display = 'inline-block';
    signoutButton.style.display = 'none';
  }
};

const handleGoogleAPIAuthClick = () => {
  gapi.auth2.getAuthInstance().signIn();
};
const handleGoogleAPISignoutClick = () => {
  gapi.auth2.getAuthInstance().signOut();
};

// Initializes the API client library and sets up sign-in state listeners.
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
 *  On window object for the Google Sheets script tag.
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
  pickedActivity.querySelector('.card-text').innerHTML = `${activity.description}<br>${
    activity.time
  } minutes.`;
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
  getSheetNames(documentID)
    .then(insertSheetNames)
    .catch((error) => {
      handleNoSheetNames(error);
    });
});

randomizeButton.addEventListener('click', () => {
  const noActivitySelectedContainers = document.querySelectorAll('.no-activity');
  const randomizedActivityContainers = document.querySelectorAll('.randomized-activity');
  const activities = activityRandomizer.getActivities();
  const filteredActivities = filterActivities(activities, getFilters());

  if (filteredActivities.length > 0) {
    const randomIndex = Math.floor(Math.random() * filteredActivities.length);

    insertRandomizedActivity(filteredActivities[randomIndex]);

    noActivitySelectedContainers.forEach((el) => {
      el.style.display = 'none';
    });
    randomizedActivityContainers.forEach((el) => {
      el.style.display = 'block';
    });
  } else {
    // When there are no activities available
    setActivityContainerContent(
      '<div class="col">You filtered out all activities in your sheet.</div>'
    );
  }
});

timeRange.addEventListener('change', (e) => {
  const rangeValue = e.target.value;
  const timeRangeValue = document.querySelector('[time-range-value]');

  timeRangeValue.textContent = rangeValue;
});

removeFiltersButton.addEventListener('click', () => {
  // restore to the original state of the filters
  const activities = activityRandomizer.getActivities();
  setTimeRangeMaxValue(activities);
});

// Add a click event listener to every button in viewListButtons
viewListButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    const documentIsValid = activityRandomizer.getDocumentValidity();

    if (documentIsValid) {
      const activities = activityRandomizer.getActivities();
      const filteredActivities = filterActivities(activities, getFilters());

      if (filteredActivities.length > 0) {
        // Fill the activityListContainers with the filtered activities.
        removeActivityListContainersInnerHTML();
        filteredActivities.forEach((activity) => {
          appendActivity(activity.name, activity.time);
        });
      } else {
        setActivityContainerContent(
          '<div class="col">You filtered out all activities in your sheet.</div>'
        );
      }
    } else {
      // sheet is invalid, do error handling
      setActivityContainerContent(
        '<div class="col">The currently selected sheet does not contain activities.</div>'
      );
    }
  });
});
