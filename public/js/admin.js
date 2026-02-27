// Navigace mezi sekcemi
// Cache bust: 2024-02-27-001
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
  
  let html = '';
  let currentDate = '';
  
  proposals.forEach(proposal => {
    const proposalDate = proposal.datum;
    
    // Přidej datum jako nadpis
    if (proposalDate !== currentDate) {
      if (currentDate !== '') {
        html += '<div class="admin-section-divider"></div>';
      }
      html += `<div class="admin-section-label">${proposalDate}:</div>`;
      currentDate = proposalDate;
    }
    
    const statusClass = proposal.vysledek === 'SCHVÁLENO' ? 'admin-status-approved' : 'admin-status-rejected';
    const statusText = proposal.vysledek === 'SCHVÁLENO' ? 'Schváleno' : 'Zamítnuto';
    
    html += `
      <div class="admin-table-row">
        <div></div>
        <div>${proposal.nazev}</div>
        <div><span class="admin-status-badge ${statusClass}">${statusText}</span></div>
        <div></div>
        <div></div>
        <button class="admin-edit-btn" onclick="editProposal('${proposal.id}')">✎</button>
      </div>
    `;
  });
  
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
  
  // Oddělení aktivních a neaktivních
  const active = councillorsList.filter(c => c.aktivni);
  const inactive = councillorsList.filter(c => !c.aktivni);
  
  let html = '';
  
  // Aktivní
  if (active.length > 0) {
    html += '<div class="admin-section-label">Vyhledat zastupitele</div>';
    active.forEach(councillor => {
      const initials = councillor.jmeno.split(' ').map(n => n.charAt(0)).join('').toUpperCase();
      const avatar = councillor.profilovyObrazek 
        ? `<img src="${councillor.profilovyObrazek}" alt="${councillor.jmeno}" class="admin-avatar">`
        : `<div class="admin-avatar-placeholder">${initials}</div>`;
      
      html += `
        <div class="admin-table-row">
          ${avatar}
          <div>${councillor.jmeno}</div>
          <div>${councillor.strana || 'Nezávislý'}</div>
          <div>${councillor.funkce || '-'}</div>
          <div>Před 6 dny</div>
          <button class="admin-edit-btn" onclick="editCouncillor('${councillor.id}')">✎</button>
        </div>
      `;
    });
  }
  
  // Neaktivní
  if (inactive.length > 0) {
    html += '<div class="admin-section-divider"></div>';
    html += '<div class="admin-section-label">Neaktivní:</div>';
    inactive.forEach(councillor => {
      const initials = councillor.jmeno.split(' ').map(n => n.charAt(0)).join('').toUpperCase();
      const avatar = councillor.profilovyObrazek 
        ? `<img src="${councillor.profilovyObrazek}" alt="${councillor.jmeno}" class="admin-avatar">`
        : `<div class="admin-avatar-placeholder">${initials}</div>`;
      
      html += `
        <div class="admin-table-row">
          ${avatar}
          <div>${councillor.jmeno}</div>
          <div>${councillor.strana || 'Nezávislý'}</div>
          <div>${councillor.funkce || '-'}</div>
          <div>Před 6 dny</div>
          <button class="admin-edit-btn" onclick="editCouncillor('${councillor.id}')">✎</button>
        </div>
      `;
    });
  }
  
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
  
  let html = '';
  partiesList.forEach(party => {
    html += `
      <div class="admin-table-row">
        <div></div>
        <div>${party.nazev}</div>
        <div>
          <div class="admin-color-badge">
            <div class="admin-color-box" style="background-color: ${party.barva};"></div>
            <span>${party.barva}</span>
          </div>
        </div>
        <div></div>
        <div></div>
        <button class="admin-edit-btn" onclick="editParty('${party.id}')">✎</button>
      </div>
    `;
  });
  
  container.innerHTML = html;
}

// Načtení nastavení
async function loadSettings() {
  const container = document.getElementById('settingsContainer');
  const generalInfo = await loadGeneralInfo();
  
  container.innerHTML = `
    <div class="settings-form">
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


