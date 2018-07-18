const initNav = () => {
  const navContents = document.querySelector('[nav-contents]');
  const hamburger = document.querySelector('[hamburger-toggle]');

  // Check if the hamburger needs to be an X or not
  const fixHamburgerState = (isOpen = false) => {
    hamburger.checked = isOpen;
  };

  hamburger.addEventListener('click', () => {
    $(navContents).collapse('toggle');
  });

  $(navContents).on('shown.bs.collapse', () => {
    fixHamburgerState(true);
  });

  $(navContents).on('hidden.bs.collapse', () => {
    fixHamburgerState(false);
  });
};

export default initNav;
