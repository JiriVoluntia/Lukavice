// Dynamické načtení zastupitele
async function loadCouncillor(councillorId) {
  try {
    const fileList = await fetch('/api/list?dir=data/zastupitele').then(r => r.json());
    
    for (const fileName of fileList) {
      try {
        const res = await fetch(`data/zastupitele/${fileName}.json`);
        const data = await res.json();
        if (data.id === councillorId) {
          return data;
        }
      } catch (e) {
        // Pokračuj dál
      }
    }
  } catch (error) {
    console.error('Chyba při načítání zastupitele:', error);
  }
  return null;
}

// Dynamické načtení strany
async function loadParty(partyId) {
  try {
    const fileList = await fetch('/api/list?dir=data/strany').then(r => r.json());
    
    for (const fileName of fileList) {
      const res = await fetch(`data/strany/${fileName}.json`);
      const data = await res.json();
      if (data.id === partyId) {
        return data;
      }
    }
  } catch (error) {
    console.error('Chyba při načítání strany:', error);
  }
  return null;
}

// Dynamické načtení všech návrhů
async function loadAllProposals() {
  try {
    const fileList = await fetch('/api/list?dir=data/navrhy').then(r => r.json());
    
    const proposals = [];
    for (const fileName of fileList) {
      try {
        const res = await fetch(`data/navrhy/${fileName}.json`);
        const data = await res.json();
        proposals.push(data);
      } catch (e) {
        // Pokračuj dál
      }
    }
    return proposals;
  } catch (error) {
    console.error('Chyba při načítání návrhů:', error);
    return [];
  }
}

// Načtení zastupitele podle ID
async function loadCouncillorById(councillorId) {
  try {
    const names = [
      'bohuslav-svoboda', 'jiri-pospisil', 'zdenek-zajicek', 'jan-wolf', 'michal-hroza',
      'alexandra-udzenija', 'tomas-portlik', 'jan-chabr', 'zdenek-kovarik', 'jiri-ptacek',
      'david-vodrazka', 'lucie-kubesa', 'jakub-leps', 'martin-sedeke', 'pavel-mares',
      'hana-kordova-marvanova', 'tomas-pek', 'tomas-kastovskij', 'tomas-slabihoudek',
      'patrik-nacher', 'ondrej-prokop', 'barbora-razga', 'vaclav-bilek', 'jan-kolar',
      'martin-benkovic', 'radmila-kleslova', 'jan-husbauer', 'radomir-nepil', 'marcela-plesnikova',
      'stanislav-nekolny', 'martin-hrubcik', 'marta-gellova', 'lenka-vedralova',
      'zdenek-hrib', 'jana-komrskova', 'adam-zabransky', 'magdalena-valdmanova', 'daniel-mazur',
      'viktor-mahrik', 'eva-tylova', 'bara-soukup', 'jiri-bruzek', 'zuzana-freitas-lopesova',
      'gabriela-lnenicka', 'jaromir-beranek', 'david-bodecek',
      'adam-scheinherr', 'mariana-capkova', 'pavel-vyhnanek', 'petr-hlavacek', 'katerina-arnotova',
      'antonin-klecanda', 'david-prochazka', 'zuzana-hamanova', 'petr-zeman', 'pavel-zelenka',
      'kamila-matejkova', 'hana-trestikova', 'kristyna-drapala', 'vladan-broz', 'jiri-knitl',
      'milan-urban', 'josef-nerusil', 'zdenek-seidl'
    ];
    
    for (const name of names) {
      try {
        const res = await fetch(`data/zastupitele/${name}.json`);
        const data = await res.json();
        if (data.id === councillorId) {
          return data;
        }
      } catch (e) {
        // Pokračuj dál
      }
    }
  } catch (error) {
    console.error('Chyba při načítání zastupitele:', error);
  }
  return null;
}

// Inicializace
async function init() {
  const params = new URLSearchParams(window.location.search);
  const councillorId = params.get('id');
  
  if (!councillorId) {
    window.location.href = 'councillors.html';
    return;
  }
  
  const councillor = await loadCouncillor(councillorId);
  
  if (!councillor) {
    window.location.href = 'councillors.html';
    return;
  }
  
  const party = councillor.strana ? await loadParty(councillor.strana) : null;
  
  const container = document.getElementById('profileContainer');
  
  // Vytvoření HTML pro obrázek
  let imageHTML = '';
  if (councillor.profilovyObrazek) {
    imageHTML = `<div class="councillor-profile-image">
      <img src="${councillor.profilovyObrazek}" alt="${councillor.jmeno}">
    </div>`;
  } else {
    const initials = councillor.jmeno.split(' ').map(n => n.charAt(0)).join('').toUpperCase();
    imageHTML = `<div class="councillor-profile-image">
      <div class="councillor-profile-image-placeholder">${initials}</div>
    </div>`;
  }
  
  // Vytvoření textu pro stranu
  let partyText = '';
  if (councillor.nezavisly) {
    partyText = 'Nezávislý';
  } else if (party) {
    partyText = `Za ${party.nazev}`;
  }
  
  // Vytvoření HTML pro popis
  const descriptionHTML = councillor.popis ? `<p class="councillor-profile-description">${councillor.popis}</p>` : '';
  
  container.innerHTML = `
    <div class="councillor-profile-breadcrumb">
      <a href="councillors.html">Zastupitelé</a>
      <span>/</span>
      <span>${councillor.jmeno}</span>
    </div>
    
    <div class="councillor-profile-header">
      ${imageHTML}
      
      <div class="councillor-profile-info">
        <h1 class="councillor-profile-name">${councillor.jmeno}</h1>
        <p class="councillor-profile-party">${partyText}</p>
        ${descriptionHTML}
      </div>
    </div>
  `;
  
  // Načtení návrhů
  const proposals = await loadAllProposals();
  const proposalsSection = document.getElementById('proposalsSection');
  const votingSection = document.getElementById('votingSection');
  
  // Filtrování návrhů, kde se zastupitel hlasoval
  const councillorVotedProposals = proposals.filter(proposal => 
    proposal.pro.includes(councillor.id) || proposal.proti.includes(councillor.id)
  );
  
  // Filtrování návrhů, které zastupitel navrhl
  const councillorProposedProposals = proposals.filter(proposal => 
    proposal.navrhovatel === councillor.id
  );
  
  // Naplnění sekce hlasování - návrhy kde se hlasovalo
  if (councillorVotedProposals.length === 0) {
    votingSection.innerHTML = '<p style="color: rgba(0, 0, 0, 0.6); font-size: 16px;">Žádné hlasování</p>';
  } else {
    let votingHTML = '<div class="proposals-container">';
    
    for (const proposal of councillorVotedProposals) {
      // Určení hlasu zastupitele
      const vote = proposal.pro.includes(councillor.id) ? 'pro' : 'proti';
      const voteLabel = vote === 'pro' ? 'Pro' : 'Proti';
      const voteBadgeClass = vote === 'pro' ? 'approved' : 'rejected';
      
      // Formátování data
      const date = new Date(proposal.datum);
      const today = new Date();
      const diffTime = Math.abs(today - date);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      let dateText = '';
      if (diffDays === 0) {
        dateText = 'Dnes';
      } else if (diffDays === 1) {
        dateText = 'Včera';
      } else if (diffDays < 7) {
        dateText = `Před ${diffDays} dny`;
      } else if (diffDays < 30) {
        const weeks = Math.floor(diffDays / 7);
        dateText = `Před ${weeks} ${weeks === 1 ? 'týdnem' : 'týdny'}`;
      } else if (diffDays < 365) {
        const months = Math.floor(diffDays / 30);
        dateText = `Před ${months} ${months === 1 ? 'měsícem' : 'měsíci'}`;
      } else {
        const years = Math.floor(diffDays / 365);
        dateText = `Před ${years} ${years === 1 ? 'rokem' : 'lety'}`;
      }
      
      votingHTML += `
        <a href="proposal-detail.html?id=${proposal.id}" style="text-decoration: none; color: inherit;">
          <div class="proposal-box">
            <div class="proposal-header">
              <span class="status-badge ${voteBadgeClass}">${voteLabel}</span>
              <div class="date-info">
                <span class="date-text">${dateText}</span>
                <img src="images/icons/Datum.svg" alt="Datum" class="date-icon">
              </div>
            </div>
            
            <h3 class="proposal-title">${proposal.nazev}</h3>
            
            <p class="proposal-description-text">${proposal.popis}</p>
          </div>
        </a>
      `;
    }
    
    votingHTML += '</div>';
    votingSection.innerHTML = votingHTML;
  }
  
  // Naplnění sekce návrhů - pouze návrhy které zastupitel navrhl
  if (councillorProposedProposals.length === 0) {
    proposalsSection.innerHTML = '<p style="color: rgba(0, 0, 0, 0.6); font-size: 16px;">Žádné návrhy</p>';
  } else {
    let proposalsHTML = '<div class="proposals-container">';
    
    for (const proposal of councillorProposedProposals) {
      // Formátování data
      const date = new Date(proposal.datum);
      const today = new Date();
      const diffTime = Math.abs(today - date);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      let dateText = '';
      if (diffDays === 0) {
        dateText = 'Dnes';
      } else if (diffDays === 1) {
        dateText = 'Včera';
      } else if (diffDays < 7) {
        dateText = `Před ${diffDays} dny`;
      } else if (diffDays < 30) {
        const weeks = Math.floor(diffDays / 7);
        dateText = `Před ${weeks} ${weeks === 1 ? 'týdnem' : 'týdny'}`;
      } else if (diffDays < 365) {
        const months = Math.floor(diffDays / 30);
        dateText = `Před ${months} ${months === 1 ? 'měsícem' : 'měsíci'}`;
      } else {
        const years = Math.floor(diffDays / 365);
        dateText = `Před ${years} ${years === 1 ? 'rokem' : 'lety'}`;
      }
      
      const statusClass = proposal.vysledek === 'SCHVÁLENO' ? 'approved' : 'rejected';
      const statusText = proposal.vysledek === 'SCHVÁLENO' ? 'Schváleno' : 'Zamítnuto';
      
      proposalsHTML += `
        <a href="proposal-detail.html?id=${proposal.id}" style="text-decoration: none; color: inherit;">
          <div class="proposal-box">
            <div class="proposal-header">
              <span class="status-badge ${statusClass}">${statusText}</span>
              <div class="date-info">
                <span class="date-text">${dateText}</span>
                <img src="images/icons/Datum.svg" alt="Datum" class="date-icon">
              </div>
            </div>
            
            <h3 class="proposal-title">${proposal.nazev}</h3>
            
            <p class="proposal-description-text">${proposal.popis}</p>
          </div>
        </a>
      `;
    }
    
    proposalsHTML += '</div>';
    proposalsSection.innerHTML = proposalsHTML;
  }
  
  // Toggle bar functionality - přidáno po načtení HTML
  document.querySelectorAll('.toggle-button').forEach(button => {
    button.addEventListener('click', function() {
      const section = this.getAttribute('data-section');
      
      // Deactivate all buttons
      document.querySelectorAll('.toggle-button').forEach(btn => {
        btn.classList.remove('active');
      });
      
      // Activate clicked button
      this.classList.add('active');
      
      // Hide all sections
      document.querySelectorAll('.content-section').forEach(sec => {
        sec.classList.remove('active');
      });
      
      // Show selected section
      if (section === 'voting') {
        document.getElementById('votingSection').classList.add('active');
      } else if (section === 'proposals') {
        document.getElementById('proposalsSection').classList.add('active');
      }
    });
  });
}

document.addEventListener('DOMContentLoaded', init);
