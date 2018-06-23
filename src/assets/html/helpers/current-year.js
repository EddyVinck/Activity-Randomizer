module.exports = function() { 
  var currentYear = (new Date()).getFullYear(); 
  var copyRightStartingYear = 2018;

  if(currentYear === copyRightStartingYear) {
    return copyRightStartingYear;
  }

  return `${copyRightStartingYear} - ${currentYear}`;
};