// Custom data-toggle handlers in a way similar to how bootstrap does them
const heightExpander = () => {
  let dataToggleHeights = document.querySelectorAll('[data-toggle=height-expand]');
  console.log(dataToggleHeights);

  dataToggleHeights.forEach(el => {
    let tgE = el.getAttribute('data-target');
    let tgt = document.querySelector(tgE);
    let tgtHeight = tgt.offsetHeight;
    // tgt.
    const closedStyles = {
      "max-height": "0px", 
      "padding-top": 0, 
      "padding-bottom": 0, 
      border: 0, 
      overflow: "hidden", 
      margin: 0,
      // display: 'none'
    }

    for (const style in closedStyles) {
      if (closedStyles.hasOwnProperty(style)) {
        tgt.style[style] =  closedStyles[style];        
      }
    }

    el.addEventListener('click', e => {

      if(tgt && tgt.classList.contains('js-height-toggled')) {
        // is open
        tgt.classList.remove('js-height-toggled');
        // so close it
        for (const style in closedStyles) {
          if (closedStyles.hasOwnProperty(style)) {
            tgt.style[style] =  closedStyles[style];        
          }
        }
      } else {
        // is closed
        tgt.classList.add('js-height-toggled');
        // so open it
        for (const style in closedStyles) {
          if (closedStyles.hasOwnProperty(style)) {
            tgt.style[style] = '';        
          }
        }  
        // tgt.style.maxHeight = tgtHeight + "";      
      }
      
    });
  });
};

export default heightExpander;