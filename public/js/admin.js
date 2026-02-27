// Navigace mezi sekcemi
function initNavigation() {
  const params = new URLSearchParams(window.location.search);
  const section = params.get('section') || 'proposals';
  
  // Skrytí všech sekcí
  document.querySelectorAll('.admin-section').forEach(sec => {
    sec.classList.remove('active');
  });
  
  // Zobrazení vybrané sekce
  const sectionEl = document.getElementById(section + 'Section');
  if (sectionEl) {
    sectionEl.classList.add('active');
  }
  
  // Aktualizace aktivního tlačítka
  document.querySelectorAll('.nav-button, .nav-button-mobile').forEach(btn => {
    btn.classList.remove('active');
  });
  
  const activeBtn = document.querySelector(`a[href="admin.html?section=${section}"]`);
  if (activeBtn) {
    activeBtn.classList.add('active');
  }
}

// Settings button
document.addEventListener('DOMContentLoaded', () => {
  const settingsBtn = document.getElementById('settingsBtn');
  const settingsBtnMobile = document.getElementById('settingsBtnMobile');
  
  if (settingsBtn) {
    settingsBtn.addEventListener('click', () => {
      // Skrytí všech sekcí
      document.querySelectorAll('.admin-section').forEach(sec => {
        sec.classList.remove('active');
      });
      document.getElementById('settingsSection').classList.add('active');
      
      // Aktualizace URL
      window.history.pushState({}, '', 'admin.html?section=settings');
    });
  }
  
  if (settingsBtnMobile) {
    settingsBtnMobile.addEventListener('click', () => {
      document.querySelectorAll('.admin-section').forEach(sec => {
        sec.classList.remove('active');
      });
      document.getElementById('settingsSection').classList.add('active');
      window.history.pushState({}, '', 'admin.html?section=settings');
    });
  }
  
  initNavigation();
  loadProposalsAdmin();
  loadCouncillorsAdmin();
  loadPartiesAdmin();
  loadSettings();
});

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

navButtonsMobile.forEach(button => {
  button.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navMobile.classList.remove('active');
  });
});

// Načtení návrhů pro administraci
async function loadProposalsAdmin() {
  const proposals = await loadProposals();
  const container = document.getElementById('proposalsContainer');
  
  if (proposals.length === 0) {
    container.innerHTML = '<p style="color: rgba(0, 0, 0, 0.6);">Žádné návrhy</p>';
    return;
  }
  
  proposals.sort((a, b) => new Date(b.datum) - new Date(a.datum));
  
  let html = '<div style="display: flex; flex-direction: column; gap: 15px;">';
  proposals.forEach(proposal => {
    const statusClass = proposal.vysledek === 'SCHVÁLENO' ? 'approved' : 'rejected';
    const statusText = proposal.vysledek === 'SCHVÁLENO' ? 'Schváleno' : 'Zamítnuto';
    
    html += `
      <div class="proposal-box" style="display: flex; justify-content: space-between; align-items: center;">
        <div style="flex: 1;">
          <h3 class="proposal-title">${proposal.nazev}</h3>
          <div class="status-badge ${statusClass}">${statusText}</div>
        </div>
        <div style="display: flex; gap: 10px;">
          <button class="admin-btn admin-btn-edit" onclick="editProposal('${proposal.id}')">Upravit</button>
          <button class="admin-btn admin-btn-delete" onclick="deleteProposal('${proposal.id}')">Smazat</button>
        </div>
      </div>
    `;
  });
  html += '</div>';
  
  container.innerHTML = html;
}

// Načtení zastupitelů pro administraci
async function loadCouncillorsAdmin() {
  const councillors = await loadCouncillors();
  const container = document.getElementById('councillorsContainer');
  
  const councillorsList = Object.values(councillors);
  if (councillorsList.length === 0) {
    container.innerHTML = '<p style="color: rgba(0, 0, 0, 0.6);">Žádní zastupitelé</p>';
    return;
  }
  
  let html = '<div style="display: flex; flex-direction: column; gap: 15px;">';
  councillorsList.forEach(councillor => {
    const status = councillor.aktivni ? 'Aktivní' : 'Neaktivní';
    const statusClass = councillor.aktivni ? 'approved' : 'rejected';
    
    html += `
      <div class="proposal-box" style="display: flex; justify-content: space-between; align-items: center;">
        <div style="flex: 1;">
          <h3 class="proposal-title">${councillor.jmeno}</h3>
          <div class="status-badge ${statusClass}">${status}</div>
        </div>
        <div style="display: flex; gap: 10px;">
          <button class="admin-btn admin-btn-edit" onclick="editCouncillor('${councillor.id}')">Upravit</button>
          <button class="admin-btn admin-btn-delete" onclick="deleteCouncillor('${councillor.id}')">Smazat</button>
        </div>
      </div>
    `;
  });
  html += '</div>';
  
  container.innerHTML = html;
}

// Načtení stran pro administraci
async function loadPartiesAdmin() {
  const parties = await loadParties();
  const container = document.getElementById('partiesContainer');
  
  const partiesList = Object.values(parties);
  if (partiesList.length === 0) {
    container.innerHTML = '<p style="color: rgba(0, 0, 0, 0.6);">Žádné strany</p>';
    return;
  }
  
  let html = '<div style="display: flex; flex-direction: column; gap: 15px;">';
  partiesList.forEach(party => {
    html += `
      <div class="proposal-box" style="display: flex; justify-content: space-between; align-items: center;">
        <div style="flex: 1;">
          <h3 class="proposal-title">${party.nazev}</h3>
          <div style="display: flex; align-items: center; gap: 10px;">
            <div style="width: 20px; height: 20px; border-radius: 50%; background-color: ${party.barva};"></div>
            <span style="color: rgba(0, 0, 0, 0.6);">${party.barva}</span>
          </div>
        </div>
        <div style="display: flex; gap: 10px;">
          <button class="admin-btn admin-btn-edit" onclick="editParty('${party.id}')">Upravit</button>
          <button class="admin-btn admin-btn-delete" onclick="deleteParty('${party.id}')">Smazat</button>
        </div>
      </div>
    `;
  });
  html += '</div>';
  
  container.innerHTML = html;
}

// Načtení nastavení
async function loadSettings() {
  const container = document.getElementById('settingsContainer');
  const generalInfo = await loadGeneralInfo();
  
  container.innerHTML = `
    <div class="settings-form">
      <button class="admin-btn admin-btn-edit" onclick="openSettingsModal()" style="margin-bottom: 20px;">Upravit nastavení obce</button>
      <div class="form-group">
        <label>Název obce</label>
        <input type="text" id="settingNazev" value="${generalInfo.info?.nazevObce || ''}" class="form-input">
      </div>
      <div class="form-group">
        <label>Okres</label>
        <input type="text" id="settingOkres" value="${generalInfo.info?.okres || ''}" class="form-input">
      </div>
      <div class="form-group">
        <label>Web</label>
        <input type="text" id="settingWeb" value="${generalInfo.info?.web || ''}" class="form-input">
      </div>
      <button class="admin-btn admin-btn-save" onclick="saveSettings()">Uložit nastavení</button>
      <button class="admin-btn admin-btn-delete" onclick="logout()" style="margin-top: 10px;">Odhlásit se</button>
    </div>
  `;
}

// Dummy funkce pro úpravy (budou implementovány později)
function editProposal(id) {
  alert('Úprava návrhu: ' + id);
}

function deleteProposal(id) {
  if (confirm('Opravdu chcete smazat tento návrh?')) {
    alert('Návrh smazán: ' + id);
  }
}

function editCouncillor(id) {
  alert('Úprava zastupitele: ' + id);
}

function deleteCouncillor(id) {
  if (confirm('Opravdu chcete smazat tohoto zastupitele?')) {
    alert('Zastupitel smazán: ' + id);
  }
}

function editParty(id) {
  alert('Úprava strany: ' + id);
}

function deleteParty(id) {
  if (confirm('Opravdu chcete smazat tuto stranu?')) {
    alert('Strana smazána: ' + id);
  }
}

function saveSettings() {
  alert('Nastavení uloženo');
}

// Otevření popupu pro nastavení obce
async function openSettingsModal() {
  console.log('openSettingsModal called');
  const generalInfo = await loadGeneralInfo();
  const councillors = await loadCouncillors();
  
  const modal = modalManager.createModal('Upravit nastavení obce');
  
  // Řádek 1: Logo a Název + Okres
  const row1 = modalManager.addRow();
  
  // Logo upload
  const logoField = document.createElement('div');
  logoField.className = 'form-field';
  const logoLabel = document.createElement('label');
  logoLabel.className = 'form-field-label';
  logoLabel.textContent = 'Logo';
  const logoInput = document.createElement('input');
  logoInput.type = 'file';
  logoInput.className = 'form-field-input';
  logoInput.id = 'logo-upload';
  logoInput.accept = 'image/*';
  logoField.appendChild(logoLabel);
  logoField.appendChild(logoInput);
  row1.appendChild(logoField);
  
  // Název a Okres
  const rightCol = document.createElement('div');
  rightCol.style.display = 'flex';
  rightCol.style.flexDirection = 'column';
  rightCol.style.gap = '20px';
  
  const nazevField = document.createElement('div');
  nazevField.className = 'form-field';
  const nazevLabel = document.createElement('label');
  nazevLabel.className = 'form-field-label';
  nazevLabel.textContent = 'Název obce';
  const nazevInput = document.createElement('input');
  nazevInput.type = 'text';
  nazevInput.className = 'form-field-input';
  nazevInput.id = 'nazev-obce';
  nazevInput.value = generalInfo.info?.nazevObce || '';
  nazevField.appendChild(nazevLabel);
  nazevField.appendChild(nazevInput);
  rightCol.appendChild(nazevField);
  
  const okresField = document.createElement('div');
  okresField.className = 'form-field';
  const okresLabel = document.createElement('label');
  okresLabel.className = 'form-field-label';
  okresLabel.textContent = 'Okres';
  const okresSelect = document.createElement('select');
  okresSelect.className = 'form-field-select';
  okresSelect.id = 'okres';
  
  // Přidání možností okresů
  const okresy = ['Benešov', 'Beroun', 'Kladno', 'Kolín', 'Kutná Hora', 'Mělník', 'Mladá Boleslav', 'Nymburk', 'Praha-východ', 'Praha-západ', 'Příbram', 'Rakovník', 'Pardubický kraj'];
  okresy.forEach(okres => {
    const option = document.createElement('option');
    option.value = okres;
    option.textContent = okres;
    if (okres === generalInfo.info?.okres) {
      option.selected = true;
    }
    okresSelect.appendChild(option);
  });
  
  okresField.appendChild(okresLabel);
  okresField.appendChild(okresSelect);
  rightCol.appendChild(okresField);
  
  row1.appendChild(rightCol);
  
  // Řádek 2: Starosta a 1. Místostarosta
  const row2 = modalManager.addRow();
  
  const starostaField = document.createElement('div');
  starostaField.className = 'form-field';
  const starostaLabel = document.createElement('label');
  starostaLabel.className = 'form-field-label';
  starostaLabel.textContent = 'Starosta';
  const starostaSelect = document.createElement('select');
  starostaSelect.className = 'form-field-select';
  starostaSelect.id = 'starosta';
  
  const emptyOption = document.createElement('option');
  emptyOption.value = '';
  emptyOption.textContent = 'Vyberte zastupitele';
  starostaSelect.appendChild(emptyOption);
  
  Object.values(councillors).forEach(councillor => {
    if (councillor.aktivni) {
      const option = document.createElement('option');
      option.value = councillor.id;
      option.textContent = councillor.jmeno;
      starostaSelect.appendChild(option);
    }
  });
  
  starostaField.appendChild(starostaLabel);
  starostaField.appendChild(starostaSelect);
  row2.appendChild(starostaField);
  
  const mistarostaField = document.createElement('div');
  mistarostaField.className = 'form-field';
  const mistarostaLabel = document.createElement('label');
  mistarostaLabel.className = 'form-field-label';
  mistarostaLabel.textContent = '1. Místostarosta';
  const mistarostaSelect = document.createElement('select');
  mistarostaSelect.className = 'form-field-select';
  mistarostaSelect.id = 'mistarosta';
  
  mistarostaSelect.appendChild(emptyOption.cloneNode(true));
  
  Object.values(councillors).forEach(councillor => {
    if (councillor.aktivni) {
      const option = document.createElement('option');
      option.value = councillor.id;
      option.textContent = councillor.jmeno;
      mistarostaSelect.appendChild(option);
    }
  });
  
  mistarostaField.appendChild(mistarostaLabel);
  mistarostaField.appendChild(mistarostaSelect);
  row2.appendChild(mistarostaField);
  
  // Tlačítka
  modalManager.addButton('Uložit', () => {
    alert('Nastavení obce uloženo');
    modalManager.closeModal();
  }, 'save');
}
