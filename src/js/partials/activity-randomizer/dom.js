import getCookies from '../../cookies/cookies';

/**
 * @returns example document ID or the ID from the document input
 */
const getDocumentIDFromdocumentLinkInput = () => {
  const documentLinkInput = document.getElementById('sheet-input');
  const defaultDocumentID = '1hqNuYTfAguDAXDWA9L14BarfqwVOWSGsd6IpuWNX2BE';
  let documentID = '';

  // Use the regex if it is a url, otherwise take the ID
  if (documentLinkInput.value.indexOf('docs.google.com/spreadsheets') > 0) {
    const googleSheetsDocumentIDRegex = new RegExp(/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
    // sheet link
    const regexResult = documentLinkInput.value.match(googleSheetsDocumentIDRegex);
    [, documentID] = regexResult;
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
const getDocumentID = () => {
  const cookies = getCookies();
  let documentID = '';

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
const appendPre = (message) => {
  const content = document.querySelectorAll('content');
  const textContent = document.createTextNode(`${message} \n`);
  content.appendChild(textContent);
};
const appendCol = (activity, time) => {
  const sheetContentContainers = document.querySelectorAll('[sheet-content]');

  sheetContentContainers.forEach((contentContainer) => {
    const col = document.createElement('div');
    const textContent = document.createTextNode(`${activity}, ${time} minutes.\n`);
    col.classList.add('col-sm-12');
    col.appendChild(textContent);
    contentContainer.appendChild(col);
  });
};

module.exports = { getDocumentID, appendPre, appendCol };
