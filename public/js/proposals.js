// Funkce pro výpočet času od data
function getTimeAgo(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'Dnes';
  if (diffDays === 1) return 'Včera';
  if (diffDays < 7) return `Před ${diffDays} dny`;
  
  const diffWeeks = Math.floor(diffDays / 7);
  if (diffWeeks < 4) return `Před ${diffWeeks} týdnem${diffWeeks > 1 ? 'y' : ''}`;
  
  const diffMonths = Math.floor(diffDays / 30);
  if (diffMonths < 12) return `Před ${diffMonths} měsícem${diffMonths > 1 ? 'i' : ''}`;
  
  const diffYears = Math.floor(diffDays / 365);
  return `Před ${diffYears} rokem${diffYears > 1 ? 'y' : ''}`;
}

// Dynamické načtení zastupitelů
async function loadCouncillors() {
  const councillors = {};
  try {
    const fileList = await fetch('/api/list?dir=data/zastupitele').then(r => r.json());
    
    for (const fileName of fileList) {
      try {
        const res = await fetch(`../../data/zastupitele/${fileName}.json`);
        const data = await res.json();
        councillors[data.id] = data.jmeno;
      } catch (e) {
        // Pokračuj dál
      }
    }
  } catch (error) {
    console.error('Chyba při načítání zastupitelů:', error);
  }
  return councillors;
}

// Dynamické načtení návrhů
async function loadProposals() {
  const proposals = [];
  try {
    const fileList = await fetch('/api/list?dir=data/navrhy').then(r => r.json());
    
    for (const fileName of fileList) {
      try {
        const res = await fetch(`../../data/navrhy/${fileName}.json`);
        const data = await res.json();
        proposals.push(data);
      } catch (e) {
        // Pokračuj dál
      }
    }
  } catch (error) {
    console.error('Chyba při načítání návrhů:', error);
  }
  return proposals;
}

// Vytvoření HTML pro návrh
function createProposalHTML(proposal, councillors) {
  const statusClass = proposal.vysledek === 'SCHVÁLENO' ? 'approved' : 'rejected';
  const statusText = proposal.vysledek === 'SCHVÁLENO' ? 'Schváleno' : 'Zamítnuto';
  const proposerName = councillors[proposal.navrhovatel] || 'Neznámý';
  const timeAgo = getTimeAgo(proposal.datum);
  
  return `
    <div class="proposal-box" onclick="window.location.href='proposal-detail.html?id=${proposal.id}'" style="cursor: pointer;">
      <div class="proposal-header">
        <div class="status-badge ${statusClass}">${statusText}</div>
        <div class="date-info">
          <span class="date-text">${timeAgo}</span>
          <img src="images/icons/Datum.svg" alt="Datum" class="date-icon">
        </div>
      </div>
      
      <h2 class="proposal-title">${proposal.nazev}</h2>
      
      <div class="proposal-footer">
        <div class="proposer-info">
          <span class="proposer-label">Navrhl</span>
          <a href="councillor.html?id=${proposal.navrhovatel}" class="proposer-name" onclick="event.stopPropagation()">${proposerName}</a>
        </div>
        <div class="voting-info">
          <div class="voting-group">
            <span class="voting-label">Pro</span>
            <span class="voting-count pro">${proposal.pro.filter(id => id).length}</span>
          </div>
          <div class="voting-group">
            <span class="voting-label">Proti</span>
            <span class="voting-count against">${proposal.proti.filter(id => id).length}</span>
          </div>
        </div>
      </div>
    </div>
  `;
}

// Inicializace
async function init() {
  const councillors = await loadCouncillors();
  const proposals = await loadProposals();
  const container = document.getElementById('proposalsContainer');
  
  // Seřazení návrhů chronologicky (nejnovější nahoře)
  proposals.sort((a, b) => new Date(b.datum) - new Date(a.datum));
  
  proposals.forEach(proposal => {
    container.innerHTML += createProposalHTML(proposal, councillors);
  });
}

document.addEventListener('DOMContentLoaded', init);
