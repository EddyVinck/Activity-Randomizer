export default () => {
  const currentYear = new Date().getFullYear();
  const copyRightStartingYear = 2018;

  if (currentYear === copyRightStartingYear) {
    return copyRightStartingYear;
  }

  return `${copyRightStartingYear} - ${currentYear}`;
};
