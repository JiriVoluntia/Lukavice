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

// Zkrácení textu na 380 znaků
function truncateText(text, maxLength = 380) {
  if (text.length > maxLength) {
    return { text: text.substring(0, maxLength) + '...', hasMore: true };
  }
  return { text: text, hasMore: false };
}

// Dynamické načtení návrhu
async function loadProposal(proposalId) {
  const proposals = await loadProposals();
  return proposals.find(p => p.id === proposalId) || null;
}

// Vytvoření HTML pro avatar
function createAvatarHTML(councillor) {
  const profileImage = councillor.profilovyObrazek;
  const initials = councillor.jmeno.split(' ').map(n => n.charAt(0)).join('').toUpperCase();
  
  if (profileImage) {
    return `<a href="councillor.html?id=${councillor.id}" class="voting-avatar" title="${councillor.jmeno}">
      <img src="${profileImage}" alt="${councillor.jmeno}">
    </a>`;
  } else {
    return `<a href="councillor.html?id=${councillor.id}" class="voting-avatar" title="${councillor.jmeno}">
      <div class="voting-avatar-placeholder">${initials}</div>
    </a>`;
  }
}

// Inicializace
async function init() {
  const params = new URLSearchParams(window.location.search);
  const proposalId = params.get('id');
  
  if (!proposalId) {
    window.location.href = 'proposals.html';
    return;
  }
  
  const councillors = await loadCouncillors();
  const proposal = await loadProposal(proposalId);
  
  if (!proposal) {
    window.location.href = 'proposals.html';
    return;
  }
  
  const container = document.getElementById('proposalDetail');
  const timeAgo = getTimeAgo(proposal.datum);
  const truncated = truncateText(proposal.popis);
  const proposerName = councillors[proposal.navrhovatel]?.jmeno || 'Neznámý';
  const statusClass = proposal.vysledek === 'SCHVÁLENO' ? 'approved' : 'rejected';
  const statusText = proposal.vysledek === 'SCHVÁLENO' ? 'Schváleno' : 'Zamítnuto';
  
  // Vytvoření HTML pro hlasující
  const proVoters = proposal.pro.filter(id => id).map(id => createAvatarHTML(councillors[id])).filter(html => html).join('');
  const againstVoters = proposal.proti.filter(id => id).map(id => createAvatarHTML(councillors[id])).filter(html => html).join('');
  
  const readMoreHTML = truncated.hasMore ? ' <a href="#" class="proposal-read-more">číst dále</a>' : '';
  
  container.innerHTML = `
    <div class="proposal-info-section">
      <div style="display: flex; justify-content: space-between; align-items: center; gap: 20px;">
        <div class="proposal-breadcrumb">
          <a href="proposals.html">Hlasování</a>
          <span>/</span>
          <span>${proposal.nazev}</span>
        </div>
        <div class="date-info">
          <span class="date-text">${timeAgo}</span>
          <img src="images/icons/Datum.svg" alt="Datum" class="date-icon">
        </div>
      </div>
      
      <h1 class="proposal-detail-title">${proposal.nazev}</h1>
      
      <div class="status-badge ${statusClass}">${statusText}</div>
      
      <p class="proposal-description-label">Popis</p>
      <p class="proposal-description-text">${truncated.text}${readMoreHTML}</p>
    </div>
    
    <div class="voting-section">
      <h2 class="voting-section-title">Výsledek hlasování:</h2>
      
      <div class="voting-group-detail">
        <div class="voting-group-label">
          <span class="voting-label-text">Pro</span>
          <span class="voting-count-badge pro">${proposal.pro.filter(id => id).length}</span>
        </div>
        <div class="voting-avatars">
          ${proVoters}
        </div>
      </div>
      
      <div class="voting-group-detail">
        <div class="voting-group-label">
          <span class="voting-label-text">Proti</span>
          <span class="voting-count-badge against">${proposal.proti.filter(id => id).length}</span>
        </div>
        <div class="voting-avatars">
          ${againstVoters}
        </div>
      </div>
    </div>
  `;
}

document.addEventListener('DOMContentLoaded', init);
