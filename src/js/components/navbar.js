const initNav = () => {
  const navContents = document.querySelector('[nav-contents]');
  const hamburger = document.querySelector('.hamburger');

  hamburger.addEventListener('click', (e) => {
    $(navContents).collapse('toggle');
    e.preventDefault();
  });
}

module.exports = initNav;