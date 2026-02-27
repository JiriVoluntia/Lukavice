// Hamburger menu
const hamburger = document.getElementById('hamburger');
const navMobile = document.getElementById('navMobile');
const navButtonsMobile = document.querySelectorAll('.nav-button-mobile');

if (hamburger) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMobile.classList.toggle('active');
  });
}

// Zavření menu při kliknutí na odkaz
navButtonsMobile.forEach(button => {
  button.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navMobile.classList.remove('active');
  });
});

// Nastavení aktivního tlačítka
function setActiveNavButton() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const navButtons = document.querySelectorAll('.nav-button, .nav-button-mobile');
  
  navButtons.forEach(button => {
    const href = button.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      button.classList.add('active');
    } else {
      button.classList.remove('active');
    }
  });
}

document.addEventListener('DOMContentLoaded', setActiveNavButton);

// Otevření webu z obecne-info.json
async function openWeb(event) {
  event.preventDefault();
  try {
    const response = await fetch('data/obecne-info.json');
    const data = await response.json();
    if (data.info && data.info.web) {
      window.open(data.info.web, '_blank');
    }
  } catch (error) {
    console.error('Chyba:', error);
  }
}

// Načtení a nastavení loga s textem
async function loadLogoText() {
  // Pokud jsme na admin stránce, nenastavuj text
  if (window.location.pathname.includes('admin.html') || window.location.pathname.includes('admin-panel.html')) {
    return;
  }
  
  try {
    const response = await fetch('data/obecne-info.json');
    const data = await response.json();
    
    const titleEl = document.getElementById('navLogoTitle');
    const subtitleEl = document.getElementById('navLogoSubtitle');
    
    if (titleEl && data.info.nazevObce) {
      titleEl.textContent = data.info.nazevObce;
    }
    
    if (subtitleEl && data.info.okres) {
      subtitleEl.textContent = data.info.okres;
    }
  } catch (error) {
    console.error('Chyba při načítání loga:', error);
  }
}

document.addEventListener('DOMContentLoaded', loadLogoText);
