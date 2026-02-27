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
// Vercel cache bust: v1
async function openSettingsModal() {
  console.log('=== openSettingsModal START ===');
  const generalInfo = await loadGeneralInfo();
  const councillors = await loadCouncillors();
  
  const modal = modalManager.createModal('Upravit nastavení obce');
  console.log('Modal created:', modal);
  
  // Řádek 1: Logo vlevo, Název obce + Okres vpravo
  const row1 = document.createElement('div');
  row1.style.display = 'flex';
  row1.style.gap = '20px';
  row1.style.width = '100%';
  console.log('Row1 created');
  
  // Logo - čtverec 120x120
  const logoContainer = document.createElement('div');
  logoContainer.style.display = 'flex';
  logoContainer.style.flexDirection = 'column';
  logoContainer.style.gap = '4px';
  logoContainer.style.flexShrink = '0';
  
  const logoLabel = document.createElement('label');
  logoLabel.className = 'form-field-label';
  logoLabel.textContent = 'Logo';
  
  const logoBox = document.createElement('div');
  logoBox.style.width = '120px';
  logoBox.style.height = '120px';
  logoBox.style.background = 'linear-gradient(135deg, #e8e8e8 0%, #d0d0d0 100%)';
  logoBox.style.border = '2px dashed rgba(0, 0, 0, 0.2)';
  logoBox.style.borderRadius = '10px';
  logoBox.style.display = 'flex';
  logoBox.style.alignItems = 'center';
  logoBox.style.justifyContent = 'center';
  logoBox.style.cursor = 'pointer';
  logoBox.style.position = 'relative';
  logoBox.style.overflow = 'hidden';
  console.log('Logo box created with size:', logoBox.style.width, 'x', logoBox.style.height);
  
  const logoInput = document.createElement('input');
  logoInput.type = 'file';
  logoInput.id = 'logo-upload';
  logoInput.accept = 'image/*';
  logoInput.style.position = 'absolute';
  logoInput.style.width = '100%';
  logoInput.style.height = '100%';
  logoInput.style.opacity = '0';
  logoInput.style.cursor = 'pointer';
  
  const logoIcon = document.createElement('div');
  logoIcon.textContent = '✏️';
  logoIcon.style.fontSize = '32px';
  logoIcon.style.pointerEvents = 'none';
  
  logoBox.appendChild(logoInput);
  logoBox.appendChild(logoIcon);
  logoContainer.appendChild(logoLabel);
  logoContainer.appendChild(logoBox);
  row1.appendChild(logoContainer);
  console.log('Logo container added to row1');
  
  // Pravý sloupec: Název obce + Okres
  const rightCol = document.createElement('div');
  rightCol.style.display = 'flex';
  rightCol.style.flexDirection = 'column';
  rightCol.style.gap = '16px';
  rightCol.style.flex = '1';
  
  // Název obce
  const nazevGroup = document.createElement('div');
  nazevGroup.style.display = 'flex';
  nazevGroup.style.flexDirection = 'column';
  nazevGroup.style.gap = '4px';
  
  const nazevLabel = document.createElement('label');
  nazevLabel.className = 'form-field-label';
  nazevLabel.textContent = 'Název obce';
  
  const nazevInput = document.createElement('input');
  nazevInput.type = 'text';
  nazevInput.className = 'form-field-input';
  nazevInput.id = 'nazev-obce';
  nazevInput.value = generalInfo.info?.nazevObce || '';
  nazevInput.style.width = '100%';
  
  nazevGroup.appendChild(nazevLabel);
  nazevGroup.appendChild(nazevInput);
  rightCol.appendChild(nazevGroup);
  
  // Okres
  const okresGroup = document.createElement('div');
  okresGroup.style.display = 'flex';
  okresGroup.style.flexDirection = 'column';
  okresGroup.style.gap = '4px';
  
  const okresLabel = document.createElement('label');
  okresLabel.className = 'form-field-label';
  okresLabel.textContent = 'Okres';
  
  const okresSelect = document.createElement('select');
  okresSelect.className = 'form-field-select';
  okresSelect.id = 'okres';
  okresSelect.style.width = '100%';
  
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
  
  okresGroup.appendChild(okresLabel);
  okresGroup.appendChild(okresSelect);
  rightCol.appendChild(okresGroup);
  
  row1.appendChild(rightCol);
  modal.content.appendChild(row1);
  
  // Řádek 2: Starosta a Místostarosta
  const row2 = document.createElement('div');
  row2.style.display = 'flex';
  row2.style.gap = '20px';
  row2.style.width = '100%';
  
  // Starosta
  const starostaGroup = document.createElement('div');
  starostaGroup.style.display = 'flex';
  starostaGroup.style.flexDirection = 'column';
  starostaGroup.style.gap = '4px';
  starostaGroup.style.flex = '1';
  
  const starostaLabel = document.createElement('label');
  starostaLabel.className = 'form-field-label';
  starostaLabel.textContent = 'Starosta';
  
  const starostaSelect = document.createElement('select');
  starostaSelect.className = 'form-field-select';
  starostaSelect.id = 'starosta';
  starostaSelect.style.width = '100%';
  
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
  
  starostaGroup.appendChild(starostaLabel);
  starostaGroup.appendChild(starostaSelect);
  row2.appendChild(starostaGroup);
  
  // Místostarosta
  const mistarostaGroup = document.createElement('div');
  mistarostaGroup.style.display = 'flex';
  mistarostaGroup.style.flexDirection = 'column';
  mistarostaGroup.style.gap = '4px';
  mistarostaGroup.style.flex = '1';
  
  const mistarostaLabel = document.createElement('label');
  mistarostaLabel.className = 'form-field-label';
  mistarostaLabel.textContent = '1. Místostarosta';
  
  const mistarostaSelect = document.createElement('select');
  mistarostaSelect.className = 'form-field-select';
  mistarostaSelect.id = 'mistarosta';
  mistarostaSelect.style.width = '100%';
  
  mistarostaSelect.appendChild(emptyOption.cloneNode(true));
  
  Object.values(councillors).forEach(councillor => {
    if (councillor.aktivni) {
      const option = document.createElement('option');
      option.value = councillor.id;
      option.textContent = councillor.jmeno;
      mistarostaSelect.appendChild(option);
    }
  });
  
  mistarostaGroup.appendChild(mistarostaLabel);
  mistarostaGroup.appendChild(mistarostaSelect);
  row2.appendChild(mistarostaGroup);
  
  modal.content.appendChild(row2);
  
  // Tlačítko Uložit
  modalManager.addButton('Uložit', () => {
    alert('Nastavení obce uloženo');
    modalManager.closeModal();
  }, 'save');
  
  console.log('=== openSettingsModal END ===');
}
