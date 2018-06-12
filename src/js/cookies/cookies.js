import Cookies from 'js-cookie';

let handleCookies = (cookies) => {
  if (cookies.hasConfiguredCookies === undefined) {
    // show cookie popup
    if(Cookies.get('_cookies_configured') !== true) {
      showCookiePopUp();
    }
  } else if (cookies.hasConfiguredCookies === 'true') {
    // check preferences    
    checkCookiePreferences(cookies);
  } else {
    // cookies probably edited or removed
  }
}

let checkCookiePreferences = (cookies) => {
  handleCookieReliantElements(cookies);
}

let showCookiePopUp = (cookies) => {
  let cookiePopUp = document.querySelector('.cookie-modal-wrapper');

  if(cookies.allowPreferences === 'true') {
    cookiePopUp.querySelector('[data-cookie-preferences-checkbox]').checked = true;
  } else {
    cookiePopUp.querySelector('[data-cookie-preferences-checkbox]').checked = false;    
  }

  cookiePopUp.classList.add('opened');  
  removeBodyScroll();
  addCookieModalEventListeners(cookiePopUp);
}

let addCookieModalEventListeners = (cookiePopUp) => {
  let cookieClose = cookiePopUp.querySelector('[data-cookie-modal-close]');
  let cookieSubmit = cookiePopUp.querySelector('[data-cookies-submit]');
  
  cookieClose.addEventListener('click',(e) => {
    cookiePopUp.classList.remove('opened');
    allowBodyScroll();
  });
  cookieSubmit.addEventListener('click',(e) => {
    Cookies.set('_cookies_configured', true);
    checkCookieCheckboxes(cookiePopUp);
    cookiePopUp.classList.remove('opened');
    allowBodyScroll();
  });
}

let checkCookieCheckboxes = cookiePopUp => {
  let cookiePreferenceCheckbox = cookiePopUp.querySelector('[data-cookie-preferences-checkbox]');
  let preferencesAllowed = cookiePreferenceCheckbox.checked;

  Cookies.set('_allow_preferences', preferencesAllowed);
  handleCookieReliantElements(getCookies());
}

/**
 * TODO: Return cookies as a boolean if possible so you don't have to check for === 'true' instead of === true
 */ 
let getCookies = () => {
  const cookies = {};

  cookies.hasConfiguredCookies = Cookies.get('_cookies_configured');
  cookies.allowPreferences = Cookies.get('_allow_preferences');
  cookies.preferredDoc = Cookies.get('_ra_preference_doc');
  cookies.preferredSheet = Cookies.get('_ra_preference_sheet');

  return cookies;
};

let handleCookieReliantElements = cookies => {
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

let showCookieMessage = () => {

}

let removeBodyScroll = () => {
  document.querySelector('body').style.overflow = 'hidden';
}
let allowBodyScroll = () => {
  document.querySelector('body').style.overflow = '';
}

handleCookies(getCookies());

const openCookies = document.querySelectorAll('[open-cookies]');
openCookies.forEach((openCookiesButton) => {
  openCookiesButton.addEventListener('click', () => {
    showCookiePopUp(getCookies());
  });
}); 
