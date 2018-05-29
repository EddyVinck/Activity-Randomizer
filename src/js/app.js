import './api/sheets';
import 'jquery';
import 'bootstrap/js/src/util';
import 'bootstrap/js/src/modal'; 
import 'bootstrap/js/src/collapse'; 
import './cookies/cookies';
// import dataToggleHeights from './frameworks/custom-bootstrap/data-toggle';
const getDataToggle = () => import('./frameworks/custom-bootstrap/data-toggle');

// dataToggleHeights();

if(document.querySelectorAll('[data-toggle=height-expand]').length > 0) {
  getDataToggle().then(f => {
    f();
  });
} else {
  console.log('no data toggles for height-expand');
}
