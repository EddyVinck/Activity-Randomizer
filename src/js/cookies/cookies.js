import Cookies from 'js-cookie';

/**
 * 
 * @param {} cookies from the getCookies function
 * 
 * It is called when the page loads.
 */
const handleCookies = (cookies) => {
  if (cookies) {
    if (cookies.hasConfiguredCookies === undefined) {
      if(Cookies.get('_cookies_configured') !== true) {
        showCookieModal();
      }
    } else if (cookies.hasConfiguredCookies === 'true') {   
      handleCookieElements(cookies);
    } else {
      // cookies probably edited or removed
    }
  }
}

const showCookieModal = cookies => {
  let cookieModal = document.querySelector('.cookie-modal-wrapper');

  fillInCurrentCookieSettings(cookies, cookieModal);
  disableScrolling();
  addCookieModalEventListeners(cookieModal);
  cookieModal.classList.add('opened');  
}

const addCookieModalEventListeners = cookieModal => {
  const cookieClose = cookieModal.querySelector('[data-cookie-modal-close]');
  const cookieSubmit = cookieModal.querySelector('[data-cookies-submit]');
  
  cookieClose.addEventListener('click',(e) => {
    cookieModal.classList.remove('opened');
    enableScrolling();
  });
  cookieSubmit.addEventListener('click',(e) => {
    Cookies.set('_cookies_configured', true);
    const cookieSettings = checkCookieCheckboxes(cookieModal);
    setNewCookieSettings(cookieSettings);
    handleCookieElements(getCookies());
    enableScrolling();
    cookieModal.classList.remove('opened');
  });
}

const checkCookieCheckboxes = cookieModal => {
  const cookiePreferenceCheckbox = cookieModal.querySelector('[data-cookie-preferences-checkbox]');
  const preferencesAllowed = cookiePreferenceCheckbox.checked;

  const cookieSettingsFromPopUp = {
    preferences: preferencesAllowed
  }

  return cookieSettingsFromPopUp;
}

const setNewCookieSettings = settings => {
  Cookies.set('_allow_preferences', settings.preferences);  
}

/**
 * TODO: Return cookies as a boolean if possible so you don't have to check for === 'true' instead of === true
 */ 
const getCookies = () => {
  const cookies = {};

  cookies.hasConfiguredCookies = Cookies.get('_cookies_configured');
  cookies.allowPreferences = Cookies.get('_allow_preferences');
  cookies.preferredDoc = Cookies.get('_ra_preference_doc');
  cookies.preferredSheet = Cookies.get('_ra_preference_sheet');

  return cookies;
};


/**
 * @param {*} cookies
 * 
 * @description shows or hides elements based on a user's cookies 
 */
const handleCookieElements = cookies => {
  if(cookies.hasConfiguredCookies !== undefined) {
    /** Remove hidden class if preference cookies are allowed
     *  Else add the class
     */ 
    if(cookies.allowPreferences === 'true') {
      document.querySelectorAll('[data-preference-cookie]').forEach(element => {
        element.classList.remove('hidden');
      });
    } else {
      document.querySelectorAll('[data-preference-cookie]').forEach(element => {
        element.classList.add('hidden');
      });
    }
  } else {
    // hasConfiguredCookies === undefined
  }
}

const disableScrolling = () => {
  document.querySelector('body').style.overflow = 'hidden';
}
const enableScrolling = () => {
  document.querySelector('body').style.overflow = '';
}

/** 
 * Event listener for every element that has the 
 * open-cookies attribute.
 * It opens the cookie modal.
 * */
const openCookies = document.querySelectorAll('[open-cookies]');
openCookies.forEach((openCookiesButton) => {
  openCookiesButton.addEventListener('click', () => {
    showCookieModal(getCookies());
  });
}); 

const fillInCurrentCookieSettings = (cookies, cookieModal) => {
  if (cookies.allowPreferences === 'true') {
    cookieModal.querySelector('[data-cookie-preferences-checkbox]').checked = true;
  }
  else {
    cookieModal.querySelector('[data-cookie-preferences-checkbox]').checked = false;
  }
}

handleCookies(getCookies());
