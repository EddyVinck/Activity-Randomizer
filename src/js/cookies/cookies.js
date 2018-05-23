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
    // cookies probably edited
  }
}

let checkCookiePreferences = (cookies) => {
  if (cookies.allowPreferences === true) {
    console.log('true');
  } else {
    console.log('not true');
  }
}

let showCookiePopUp = () => {
  console.log('show cookie popup');
  let cookiePopUp = document.querySelector('.cookie-modal-wrapper');
  

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
  let cookiePreferenceCheckbox = cookiePopUp.querySelector('[data-cookie-preferences]');
  let preferencesAllowed = cookiePreferenceCheckbox.checked;
  if(preferencesAllowed) {
    Cookies.set('_allow_preferences', true);
  }

  showCookieReliantElements(getCookies());
}

let getCookies = () => {
  const cookies = {};

  cookies.hasConfiguredCookies = Cookies.get('_cookies_configured');
  cookies.allowPreferences = Cookies.get('_allow_preferences');
  cookies.preferredDoc = Cookies.get('_ra_preference_doc');
  cookies.preferredSheet = Cookies.get('_ra_preference_sheet');
  
  return cookies;
};

let showCookieReliantElements = cookies => {
  if(cookies.hasConfiguredCookies !== undefined) {
    if(cookies.allowPreferences === true) {
      document.querySelectorAll('[data-gdpr-preference]').forEach(element => {
        element.classList.remove('hidden');
      });
    }
  } else {
    console.log(cookies.hasConfiguredCookies !== undefined);
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

