const initNav = () => {
  const navContents = document.querySelector('[nav-contents]');
  const hamburger = document.querySelector('.hamburger');

  hamburger.addEventListener('click', (e) => {
    navContents.classList.toggle('open');
  });
}

module.exports = initNav;