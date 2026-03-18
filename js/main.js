document.addEventListener('DOMContentLoaded', function () {
  const mega = document.getElementById('gnbMega');
  const menuToggle = document.getElementById('menuToggle');
  const menuClose = document.getElementById('menuClose');
  const mobileNav = document.getElementById('mobileNav');

  menuToggle.addEventListener('click', function () {
    if (window.innerWidth <= 768) {
      mobileNav.classList.toggle('active');
    } else {
      mega.classList.toggle('active');
      menuToggle.style.display = mega.classList.contains('active') ? 'none' : '';
      menuClose.style.display = mega.classList.contains('active') ? '' : 'none';
    }
  });

  menuClose.addEventListener('click', function () {
    mega.classList.remove('active');
    menuToggle.style.display = '';
    menuClose.style.display = 'none';
  });
});
