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


// Otevření modalu pro nastavení obce
async function openSettingsModal() {
  const generalInfo = await loadGeneralInfo();
  const info = generalInfo.info || {};
  const functions = generalInfo.funkce || [];
  
  // Najdi Starostu a Místostarostu
  const starosta = functions.find(f => f.nazev === 'Starosta');
  const mistaroosta = functions.find(f => f.nazev === 'Místostarosta');
  
  const modal = modalManager.createModal('Upravit nastavení obce');
  
  // Logo - full width
  const logoRow = modalManager.addRow(true);
  const logoField = document.createElement('div');
  logoField.className = 'form-field';
  logoField.style.width = '100%';
  
  const logoLabel = document.createElement('label');
  logoLabel.className = 'form-field-label';
  logoLabel.textContent = 'Logo';
  logoField.appendChild(logoLabel);
  
  const logoContainer = document.createElement('div');
  logoContainer.style.width = '120px';
  logoContainer.style.height = '120px';
  logoContainer.style.position = 'relative';
  
  const logoImg = document.createElement('img');
  logoImg.id = 'logoPreview';
  logoImg.src = info.logo || 'images/logo.png';
  logoImg.style.width = '100%';
  logoImg.style.height = '100%';
  logoImg.style.objectFit = 'contain';
  logoImg.style.borderRadius = '10px';
  logoImg.style.border = '2px dashed rgba(0, 0, 0, 0.2)';
  logoImg.style.cursor = 'pointer';
  logoImg.style.display = 'flex';
  logoImg.style.alignItems = 'center';
  logoImg.style.justifyContent = 'center';
  
  const pencilIcon = document.createElement('div');
  pencilIcon.style.position = 'absolute';
  pencilIcon.style.top = '50%';
  pencilIcon.style.left = '50%';
  pencilIcon.style.transform = 'translate(-50%, -50%)';
  pencilIcon.style.fontSize = '32px';
  pencilIcon.style.pointerEvents = 'none';
  pencilIcon.textContent = '✏️';
  
  const logoInput = document.createElement('input');
  logoInput.type = 'file';
  logoInput.id = 'logoUpload';
  logoInput.accept = 'image/*';
  logoInput.style.display = 'none';
  
  logoInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        logoImg.src = event.target.result;
      };
      reader.readAsDataURL(file);
    }
  });
  
  logoImg.addEventListener('click', () => logoInput.click());
  
  logoContainer.appendChild(logoImg);
  logoContainer.appendChild(pencilIcon);
  logoContainer.appendChild(logoInput);
  logoField.appendChild(logoContainer);
  logoRow.appendChild(logoField);
  
  // Název obce a Okres - 2 sloupce
  const row1 = modalManager.addRow();
  modalManager.addFieldToRow(row1, 'Název obce', 'text', '', info.nazevObce || '');
  modalManager.addFieldToRow(row1, 'Okres', 'text', '', info.okres || '');
  
  // Starosta a Místostarosta - 2 sloupce, fill
  const row2 = modalManager.addRow();
  const starostaField = document.createElement('div');
  starostaField.className = 'form-field';
  starostaField.style.flex = '1';
  
  const starostaLabel = document.createElement('label');
  starostaLabel.className = 'form-field-label';
  starostaLabel.textContent = 'Starosta';
  starostaField.appendChild(starostaLabel);
  
  const starostaSelect = document.createElement('select');
  starostaSelect.className = 'form-field-select';
  starostaSelect.id = 'starosta-select';
  starostaSelect.style.width = '100%';
  
  const emptyOption = document.createElement('option');
  emptyOption.value = '';
  emptyOption.textContent = 'Vyberte...';
  starostaSelect.appendChild(emptyOption);
  
  // Načti zastupitele
  const councillors = await loadCouncillors();
  Object.values(councillors).forEach(councillor => {
    const option = document.createElement('option');
    option.value = councillor.id;
    option.textContent = councillor.jmeno;
    if (starosta && starosta.zastupitel === councillor.id) {
      option.selected = true;
    }
    starostaSelect.appendChild(option);
  });
  
  starostaField.appendChild(starostaSelect);
  row2.appendChild(starostaField);
  
  const mistarostaField = document.createElement('div');
  mistarostaField.className = 'form-field';
  mistarostaField.style.flex = '1';
  
  const mistarostaLabel = document.createElement('label');
  mistarostaLabel.className = 'form-field-label';
  mistarostaLabel.textContent = '1. Místostarosta';
  mistarostaField.appendChild(mistarostaLabel);
  
  const mistarostaSelect = document.createElement('select');
  mistarostaSelect.className = 'form-field-select';
  mistarostaSelect.id = 'mistaroosta-select';
  mistarostaSelect.style.width = '100%';
  
  const emptyOption2 = document.createElement('option');
  emptyOption2.value = '';
  emptyOption2.textContent = 'Vyberte...';
  mistarostaSelect.appendChild(emptyOption2);
  
  Object.values(councillors).forEach(councillor => {
    const option = document.createElement('option');
    option.value = councillor.id;
    option.textContent = councillor.jmeno;
    if (mistaroosta && mistaroosta.zastupitel === councillor.id) {
      option.selected = true;
    }
    mistarostaSelect.appendChild(option);
  });
  
  mistarostaField.appendChild(mistarostaSelect);
  row2.appendChild(mistarostaField);
  
  // Save button
  modalManager.addButton('Uložit', () => {
    console.log('Nastavení uloženo');
    modalManager.closeModal();
  }, 'save');
}
